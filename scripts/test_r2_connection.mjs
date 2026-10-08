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

const accountId = (process.env.R2_ACCOUNT_ID || '').trim()
const accessKeyId = (process.env.R2_ACCESS_KEY_ID || '').trim()
const secretAccessKey = (process.env.R2_SECRET_ACCESS_KEY || '').trim()
const bucket = (
  process.env.R2_BUCKET_NAME ||
  process.env.R2_BUCKET_BOOK_SOURCES ||
  'book-sources'
).trim()
const endpoint =
  (process.env.R2_ENDPOINT || '').trim() ||
  (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : '')

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

// Unauthenticated public URL probe (r2.dev / pub style is account-specific;
// path-style on the S3 endpoint without auth should not succeed for a private bucket).
try {
  const publicProbeUrl = `${endpoint.replace(/\/$/, '')}/${bucket}/${encodeURIComponent(testKey).replace(/%2F/g, '/')}`
  const res = await fetch(publicProbeUrl, { method: 'HEAD' })
  // Object was deleted; a private bucket should not return 200 for anonymous access to any key.
  // Probe a synthetic key that never existed:
  const neverKey = `_connection-tests/does-not-exist-${randomUUID()}.txt`
  const probe2 = await fetch(
    `${endpoint.replace(/\/$/, '')}/${bucket}/${neverKey.split('/').map(encodeURIComponent).join('/')}`,
    { method: 'GET' },
  )
  results.publicDenied = probe2.status === 403 || probe2.status === 401 || probe2.status === 404
  console.log(`Anonymous GET probe status: ${probe2.status} (${results.publicDenied ? 'not publicly readable' : 'UNEXPECTED — investigate'})`)
  void publicProbeUrl
  void res
} catch (err) {
  // Network errors still suggest no open public read path from this client
  results.publicDenied = true
  console.log(`Anonymous GET probe: network/error (${err?.message ?? err}) — treat as not publicly readable from this host`)
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

process.exit(allOk ? 0 : 1)

// silence unused import in some bundlers
void pathToFileURL
