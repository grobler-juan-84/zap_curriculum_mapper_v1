/**
 * Stage C — migrate ONE textbook PDF from Supabase Storage → Cloudflare R2.
 * Default pilot: Beehive 1 Student Book (beehive_1_sb).
 *
 * Does NOT modify the app, database, or delete Supabase objects.
 * Does NOT overwrite an existing R2 object at the destination key.
 *
 * Usage (from repo root):
 *   node scripts/migrate_pilot_pdf_to_r2.mjs
 *   node scripts/migrate_pilot_pdf_to_r2.mjs beehive_1_sb
 */

import { createHash, randomUUID } from 'node:crypto'
import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const vendorRoot = join(__dirname, '.r2-tools')
const { createClient } = createRequire(resolve(root, 'app', 'package.json'))(
  '@supabase/supabase-js',
)

const PILOTS = {
  beehive_1_sb: {
    catalogBookId: 'beehive_1_sb',
    expectedKey: 'beehive/beehive_1_sb/source.pdf',
    displayName: 'Beehive 1 Student Book',
  },
}

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

loadEnvFile(resolve(root, 'app', '.env.local'))
loadEnvFile(resolve(root, '.env.local'))
loadEnvFile(resolve(root, '.env'))

function normalizeAccountAndEndpoint(rawAccountId, rawEndpoint) {
  let accountId = (rawAccountId || '').trim()
  let endpoint = (rawEndpoint || '').trim()
  if (/^https?:\/\//i.test(accountId)) {
    try {
      const u = new URL(accountId)
      if (!endpoint) endpoint = `${u.protocol}//${u.host}`
      const m = u.host.match(/^([a-f0-9]+)\.r2\.cloudflarestorage\.com$/i)
      if (m) accountId = m[1]
    } catch {
      /* keep */
    }
  } else if (/\.r2\.cloudflarestorage\.com$/i.test(accountId)) {
    if (!endpoint) endpoint = `https://${accountId}`
    const m = accountId.match(/^([a-f0-9]+)\.r2\.cloudflarestorage\.com$/i)
    if (m) accountId = m[1]
  }
  if (!endpoint && accountId) endpoint = `https://${accountId}.r2.cloudflarestorage.com`
  return { accountId, endpoint }
}

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex')
}

const bookKey = (process.argv[2] || 'beehive_1_sb').trim()
const pilot = PILOTS[bookKey]
if (!pilot) {
  console.error(`Unknown pilot "${bookKey}". Supported: ${Object.keys(PILOTS).join(', ')}`)
  process.exit(1)
}

const supabaseUrl = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim()
const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
const { accountId, endpoint } = normalizeAccountAndEndpoint(
  process.env.R2_ACCOUNT_ID,
  process.env.R2_ENDPOINT,
)
const r2AccessKeyId = (process.env.R2_ACCESS_KEY_ID || '').trim()
const r2SecretAccessKey = (process.env.R2_SECRET_ACCESS_KEY || '').trim()
const r2Bucket = (
  process.env.R2_BUCKET_NAME ||
  process.env.R2_BUCKET_BOOK_SOURCES ||
  'book-sources'
).trim()

if (!supabaseUrl || !serviceKey) {
  console.error('Missing Supabase URL or SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(2)
}
if (!endpoint || !r2AccessKeyId || !r2SecretAccessKey || !r2Bucket) {
  console.error('Missing R2 env (R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET_NAME).')
  process.exit(2)
}

const requireVendor = createRequire(join(vendorRoot, 'package.json'))
const {
  S3Client,
  HeadObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} = requireVendor('@aws-sdk/client-s3')

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const r2 = new S3Client({
  region: 'auto',
  endpoint,
  credentials: { accessKeyId: r2AccessKeyId, secretAccessKey: r2SecretAccessKey },
})

console.log(`Pilot: ${pilot.displayName} (${pilot.catalogBookId})`)
console.log('(Credential values are never printed.)')
console.log('')

// --- Step 1: resolve catalog key from Postgres ---
const { data: bookRow, error: bookErr } = await supabase
  .from('books')
  .select('id, book_id')
  .eq('book_id', pilot.catalogBookId)
  .maybeSingle()

if (bookErr || !bookRow?.id) {
  console.error(`Book lookup failed: ${bookErr?.message ?? 'not found'}`)
  process.exit(1)
}

const { data: fileRow, error: fileErr } = await supabase
  .from('book_files')
  .select('id, bucket, storage_path, filename, mime_type, file_size, file_type')
  .eq('book_id', bookRow.id)
  .eq('file_type', 'source_pdf')
  .maybeSingle()

if (fileErr || !fileRow) {
  console.error(`source_pdf book_files row failed: ${fileErr?.message ?? 'not found'}`)
  process.exit(1)
}

const sourceBucket = fileRow.bucket
const objectKey = fileRow.storage_path

console.log(`Catalog book_id: ${bookRow.book_id}`)
console.log(`Supabase bucket: ${sourceBucket}`)
console.log(`Verified object key: ${objectKey}`)
console.log(`Expected convention key: ${pilot.expectedKey}`)
console.log(`Key matches convention: ${objectKey === pilot.expectedKey ? 'YES' : 'NO'}`)
console.log(`Catalog mime_type: ${fileRow.mime_type ?? '(none)'}`)
console.log(`Catalog file_size: ${fileRow.file_size ?? '(none)'}`)

if (objectKey === 'beehive/beehive/beehive_1_sb/source.pdf') {
  console.log(
    'NOTE: duplicated beehive/beehive/ path is present in catalog — migrating that exact key as-is.',
  )
} else if (objectKey === 'beehive/beehive_1_sb/source.pdf') {
  console.log(
    'Hierarchy note: path is {series-slug}/{catalog_book_id}/source.pdf — NOT a duplicated beehive/beehive/ segment.',
  )
}

if (sourceBucket !== 'book-sources') {
  console.error(`Unexpected source bucket "${sourceBucket}" (expected book-sources). Stopping.`)
  process.exit(1)
}
if (r2Bucket !== 'book-sources') {
  console.error(`Unexpected R2 bucket "${r2Bucket}" (expected book-sources). Stopping.`)
  process.exit(1)
}

// --- Step 2: download from Supabase ---
const workDir = join(tmpdir(), `gcm-r2-stage-c-${randomUUID()}`)
mkdirSync(workDir, { recursive: true })
const localFromSupabase = join(workDir, 'from-supabase.pdf')
const localFromR2 = join(workDir, 'from-r2.pdf')

console.log(`Temp dir: ${workDir}`)

const { data: blob, error: dlErr } = await supabase.storage
  .from(sourceBucket)
  .download(objectKey)

if (dlErr || !blob) {
  console.error(`Supabase download failed: ${dlErr?.message ?? 'no data'}`)
  rmSync(workDir, { recursive: true, force: true })
  process.exit(1)
}

const supabaseBuf = Buffer.from(await blob.arrayBuffer())
writeFileSync(localFromSupabase, supabaseBuf)
const supabaseSha = sha256(supabaseBuf)
const supabaseSize = supabaseBuf.length

console.log(`Supabase download size: ${supabaseSize} bytes`)
console.log(`Supabase SHA-256: ${supabaseSha}`)
console.log(`Content-Type used for R2: application/pdf`)

// --- Step 3: conflict check + upload to R2 ---
let destExists = false
try {
  await r2.send(new HeadObjectCommand({ Bucket: r2Bucket, Key: objectKey }))
  destExists = true
} catch (err) {
  const name = err?.name ?? ''
  const status = err?.$metadata?.httpStatusCode
  if (name === 'NotFound' || name === 'NoSuchKey' || status === 404) {
    destExists = false
  } else {
    console.error(`R2 HeadObject failed: ${name}: ${err?.message ?? err}`)
    rmSync(workDir, { recursive: true, force: true })
    try {
      r2.destroy()
    } catch {
      /* ignore */
    }
    process.exit(1)
  }
}

if (destExists) {
  console.error(`CONFLICT: R2 already has object at ${r2Bucket}/${objectKey}. Not overwriting.`)
  rmSync(workDir, { recursive: true, force: true })
  try {
    r2.destroy()
  } catch {
    /* ignore */
  }
  process.exit(3)
}

console.log('R2 destination clear — uploading…')
await r2.send(
  new PutObjectCommand({
    Bucket: r2Bucket,
    Key: objectKey,
    Body: supabaseBuf,
    ContentType: 'application/pdf',
  }),
)
console.log('R2 upload: ok')

// --- Step 4: verify ---
const got = await r2.send(new GetObjectCommand({ Bucket: r2Bucket, Key: objectKey }))
const r2Buf = Buffer.from(await got.Body.transformToByteArray())
writeFileSync(localFromR2, r2Buf)
const r2Sha = sha256(r2Buf)
const r2Size = r2Buf.length

console.log(`R2 download size: ${r2Size} bytes`)
console.log(`R2 SHA-256: ${r2Sha}`)

const sizeMatch = supabaseSize === r2Size
const shaMatch = supabaseSha === r2Sha
const keyMatch = true // same objectKey used both sides

console.log(`Size match: ${sizeMatch ? 'PASS' : 'FAIL'}`)
console.log(`SHA-256 match: ${shaMatch ? 'PASS' : 'FAIL'}`)
console.log(`Object key preserved: ${keyMatch ? 'PASS' : 'FAIL'} (${objectKey})`)

// Confirm Supabase original still present
const { data: stillBlob, error: stillErr } = await supabase.storage
  .from(sourceBucket)
  .download(objectKey)
const supabaseStillThere = !stillErr && stillBlob != null
console.log(`Supabase original preserved: ${supabaseStillThere ? 'YES' : 'NO'}`)

rmSync(workDir, { recursive: true, force: true })
console.log('Temp files removed.')

try {
  r2.destroy()
} catch {
  /* ignore */
}

const pass = sizeMatch && shaMatch && keyMatch && supabaseStillThere
console.log('')
console.log(`Stage C pilot: ${pass ? 'PASS' : 'FAIL'}`)
process.exit(pass ? 0 : 1)
