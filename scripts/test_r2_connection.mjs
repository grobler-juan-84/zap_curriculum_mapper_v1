/**
 * Stage B — Cloudflare R2 connectivity test (S3-compatible API).
 *
 * Loads credentials from root `.env.local` / `.env` (never VITE_*).
 * Does NOT migrate PDFs or touch application code.
 *
 * Usage (from repo root):
 *   node scripts/test_r2_connection.mjs
 *
 * Requires `@aws-sdk/client-s3` under `scripts/.r2-tools/` (gitignored vendor install).
 */

import { createHash, randomUUID } from 'node:crypto'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const vendorRoot = join(__dirname, '.r2-tools')

function loadEnvFile(path) {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env) || !process.env[key]) process.env[key] = value
  }
}

loadEnvFile(resolve(root, '.env.local'))
loadEnvFile(resolve(root, '.env'))

function normalizeAccountAndEndpoint(rawAccountId, rawEndpoint) {
  let accountId = (rawAccountId || '').trim()
  let endpoint = (rawEndpoint || '').trim()

  // Owners sometimes paste the full S3 endpoint into R2_ACCOUNT_ID.
  if (/^https?:\/\//i.test(accountId)) {
    try {
      const u = new URL(accountId)
      if (!endpoint) endpoint = `${u.protocol}//${u.host}`
      const host = u.host
      const m = host.match(/^([a-f0-9]+)\.r2\.cloudflarestorage\.com$/i)
      if (m) accountId = m[1]
    } catch {
      /* keep raw; validation below will fail clearly */
    }
  } else if (/\.r2\.cloudflarestorage\.com$/i.test(accountId)) {
    if (!endpoint) endpoint = `https://${accountId}`
    const m = accountId.match(/^([a-f0-9]+)\.r2\.cloudflarestorage\.com$/i)
    if (m) accountId = m[1]
  }

  if (!endpoint && accountId) {
    endpoint = `https://${accountId}.r2.cloudflarestorage.com`
  }

  return { accountId, endpoint }
}

const accessKeyId = (process.env.R2_ACCESS_KEY_ID || '').trim()
const secretAccessKey = (process.env.R2_SECRET_ACCESS_KEY || '').trim()
const bucket = (
  process.env.R2_BUCKET_NAME ||
  process.env.R2_BUCKET_BOOK_SOURCES ||
  'book-sources'
).trim()
const { accountId, endpoint } = normalizeAccountAndEndpoint(
  process.env.R2_ACCOUNT_ID,
  process.env.R2_ENDPOINT,
)
function redactedStatus(label, ok) {
  console.log(`${label}: ${ok ? 'PASS' : 'FAIL'}`)
}

const missing = []
if (!accountId) missing.push('R2_ACCOUNT_ID')
if (!accessKeyId) missing.push('R2_ACCESS_KEY_ID')
if (!secretAccessKey) missing.push('R2_SECRET_ACCESS_KEY')
if (!bucket) missing.push('R2_BUCKET_NAME')
if (!endpoint) missing.push('R2_ENDPOINT (or R2_ACCOUNT_ID to derive)')

if (missing.length) {
  console.error(
    `Missing required env (fill root .env.local; do not paste secrets in chat): ${missing.join(', ')}`,
  )
  process.exit(2)
}

const requireVendor = createRequire(join(vendorRoot, 'package.json'))
let S3Client
let ListObjectsV2Command
let PutObjectCommand
let GetObjectCommand
let DeleteObjectCommand
let HeadObjectCommand
try {
  ;({
    S3Client,
    ListObjectsV2Command,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    HeadObjectCommand,
  } = requireVendor('@aws-sdk/client-s3'))
} catch {
  console.error(
    'Missing @aws-sdk/client-s3. From repo root run:\n' +
      '  npm install --prefix scripts/.r2-tools @aws-sdk/client-s3\n' +
      '(scripts/.r2-tools is gitignored)',
  )
  process.exit(2)
}

const client = new S3Client({
  region: 'auto',
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: false,
})

const results = {
  connection: false,
  bucketAccess: false,
  upload: false,
  downloadChecksum: false,
  deletion: false,
  publicDenied: null,
}

const testKey = `_connection-tests/gcm-r2-stage-b-${randomUUID()}.txt`
const payload = `gcm-r2-stage-b\n${new Date().toISOString()}\n${randomUUID()}\n`
const expectedSha = createHash('sha256').update(payload, 'utf8').digest('hex')

console.log(`Bucket: ${bucket}`)
console.log(`Endpoint host: ${new URL(endpoint).host}`)
console.log(`Test object key: ${testKey}`)
console.log('(Credential values are never printed.)')
console.log('')

try {
  const listed = await client.send(
    new ListObjectsV2Command({
      Bucket: bucket,
      MaxKeys: 20,
      Prefix: '',
    }),
  )
  results.connection = true
  results.bucketAccess = true
  const keys = (listed.Contents ?? []).map((o) => o.Key).filter(Boolean)
  console.log(`ListObjects: ok (showing up to ${keys.length} key(s), no mutations)`)
  for (const key of keys.slice(0, 20)) {
    // Never print under series textbook paths in detail beyond key names — keys are not secrets
    console.log(`  - ${key}`)
  }
  if (keys.length === 0) console.log('  (bucket empty or no keys returned)')
} catch (err) {
  console.error(`ListObjects failed: ${err?.name ?? 'Error'}: ${err?.message ?? err}`)
  redactedStatus('Connection', false)
  redactedStatus('Bucket access', false)
  process.exit(1)
}

redactedStatus('Connection', results.connection)
redactedStatus('Bucket access', results.bucketAccess)

try {
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: testKey,
      Body: payload,
      ContentType: 'text/plain; charset=utf-8',
    }),
  )
  results.upload = true
} catch (err) {
  console.error(`PutObject failed: ${err?.name ?? 'Error'}: ${err?.message ?? err}`)
  redactedStatus('Test upload', false)
  process.exit(1)
}
redactedStatus('Test upload', results.upload)

try {
  const got = await client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: testKey,
    }),
  )
  const bytes = Buffer.from(await got.Body.transformToByteArray())
  const actualSha = createHash('sha256').update(bytes).digest('hex')
  if (actualSha !== expectedSha) {
    throw new Error(`SHA-256 mismatch (expected ${expectedSha.slice(0, 8)}… got ${actualSha.slice(0, 8)}…)`)
  }
  results.downloadChecksum = true
} catch (err) {
  console.error(`GetObject/checksum failed: ${err?.name ?? 'Error'}: ${err?.message ?? err}`)
  // best-effort cleanup
  try {
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: testKey }))
  } catch {
    /* ignore */
  }
  redactedStatus('Test download and checksum', false)
  process.exit(1)
}
redactedStatus('Test download and checksum', results.downloadChecksum)

try {
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: testKey }))
  let stillThere = false
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: testKey }))
    stillThere = true
  } catch (err) {
    const name = err?.name ?? ''
    const status = err?.$metadata?.httpStatusCode
    if (name === 'NotFound' || name === 'NoSuchKey' || status === 404) {
      stillThere = false
    } else {
      throw err
    }
  }
  if (stillThere) throw new Error('Test object still present after DeleteObject')
  results.deletion = true
} catch (err) {
  console.error(`DeleteObject/verify failed: ${err?.name ?? 'Error'}: ${err?.message ?? err}`)
  redactedStatus('Test deletion', false)
  process.exit(1)
}
redactedStatus('Test deletion', results.deletion)

// Unauthenticated probe against the S3 API endpoint (not a public r2.dev URL).
// 200 would be concerning; 400/401/403/404 mean the object is not anonymously readable.
try {
  const neverKey = `_connection-tests/does-not-exist-${randomUUID()}.txt`
  const probeUrl = `${endpoint.replace(/\/$/, '')}/${bucket}/${neverKey
    .split('/')
    .map(encodeURIComponent)
    .join('/')}`
  const probe = await fetch(probeUrl, { method: 'GET' })
  results.publicDenied = [400, 401, 403, 404].includes(probe.status)
  console.log(
    `Anonymous GET probe status: ${probe.status} (${results.publicDenied ? 'not publicly readable' : 'UNEXPECTED — investigate'})`,
  )
} catch (err) {
  results.publicDenied = true
  console.log(
    `Anonymous GET probe: network/error (${err?.message ?? err}) — treat as not publicly readable from this host`,
  )
}

console.log('')
console.log('Stage B summary')
redactedStatus('Connection', results.connection)
redactedStatus('Bucket access', results.bucketAccess)
redactedStatus('Test upload', results.upload)
redactedStatus('Test download and checksum', results.downloadChecksum)
redactedStatus('Test deletion', results.deletion)
console.log(
  `Public anonymous access denied (heuristic): ${results.publicDenied ? 'PASS' : 'FAIL / REVIEW'}`,
)
console.log(
  'Bucket-scope of the API token cannot be proven from the S3 API alone — confirm Object Read & Write is limited to book-sources in the Cloudflare dashboard.',
)

const allOk =
  results.connection &&
  results.bucketAccess &&
  results.upload &&
  results.downloadChecksum &&
  results.deletion

try {
  client.destroy()
} catch {
  /* ignore */
}

process.exit(allOk ? 0 : 1)

void pathToFileURL
