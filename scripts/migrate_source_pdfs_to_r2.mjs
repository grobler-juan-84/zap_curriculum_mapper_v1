/**
 * Stage E — audit + migrate textbook source PDFs Supabase Storage → Cloudflare R2.
 *
 * - Inventories catalog `book_files` (file_type=source_pdf), Supabase objects, R2 objects
 * - Migrates missing R2 objects using identical object keys
 * - Never overwrites existing R2 objects; identical content → already_migrated
 * - Does NOT delete Supabase originals, change catalog rows, or migrate JSON/covers
 *
 * Usage (from repo root):
 *   node scripts/migrate_source_pdfs_to_r2.mjs              # audit + migrate
 *   node scripts/migrate_source_pdfs_to_r2.mjs --audit-only # inventory only
 *   node scripts/migrate_source_pdfs_to_r2.mjs --verify-only # reconcile + SHA check (no upload)
 */

import { createHash } from 'node:crypto'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const vendorRoot = join(__dirname, '.r2-tools')
const { createClient } = createRequire(resolve(root, 'app', 'package.json'))(
  '@supabase/supabase-js',
)

const args = new Set(process.argv.slice(2))
const auditOnly = args.has('--audit-only')
const verifyOnly = args.has('--verify-only')

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

async function streamToBuffer(body) {
  if (!body) return Buffer.alloc(0)
  if (Buffer.isBuffer(body)) return body
  if (typeof body.transformToByteArray === 'function') {
    return Buffer.from(await body.transformToByteArray())
  }
  const chunks = []
  for await (const chunk of body) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
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
const supabaseBucket = 'book-sources'

if (!supabaseUrl || !serviceKey) {
  console.error('Missing Supabase URL or SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(2)
}
if (!endpoint || !r2AccessKeyId || !r2SecretAccessKey || !r2Bucket) {
  console.error(
    'Missing R2 env (R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET_NAME).',
  )
  process.exit(2)
}

const requireVendor = createRequire(join(vendorRoot, 'package.json'))
const {
  S3Client,
  HeadObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} = requireVendor('@aws-sdk/client-s3')

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const r2 = new S3Client({
  region: 'auto',
  endpoint,
  credentials: { accessKeyId: r2AccessKeyId, secretAccessKey: r2SecretAccessKey },
})

console.log('Stage E — source PDF migration (Supabase → R2)')
console.log(`Mode: ${auditOnly ? 'audit-only' : verifyOnly ? 'verify-only' : 'migrate'}`)
console.log('(Credential values are never printed.)')
console.log('')

// --- Catalog inventory ---
const { data: fileRows, error: fileErr } = await supabase
  .from('book_files')
  .select(
    'id, bucket, storage_path, filename, mime_type, file_size, file_type, book_id, books!inner(book_id, title)',
  )
  .eq('file_type', 'source_pdf')
  .order('storage_path')

if (fileErr) {
  console.error(`book_files query failed: ${fileErr.message}`)
  process.exit(1)
}

const catalog = (fileRows ?? []).map((row) => ({
  bookFileId: row.id,
  catalogBookId: row.books?.book_id ?? '(unknown)',
  title: row.books?.title ?? '',
  bucket: row.bucket,
  objectKey: row.storage_path,
  catalogFileSize: row.file_size,
  mimeType: row.mime_type,
}))

console.log(`Catalog source_pdf rows: ${catalog.length}`)
for (const c of catalog) {
  console.log(
    `  - ${c.catalogBookId}  key=${c.objectKey}  catalog_size=${c.catalogFileSize ?? '(none)'}  bucket=${c.bucket}`,
  )
}
console.log('')

// --- List Supabase Storage objects (recursive) ---
async function listSupabasePrefix(prefix = '') {
  const keys = []
  const { data, error } = await supabase.storage.from(supabaseBucket).list(prefix, {
    limit: 1000,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' },
  })
  if (error) throw new Error(`Supabase list "${prefix}": ${error.message}`)
  for (const item of data ?? []) {
    const path = prefix ? `${prefix}/${item.name}` : item.name
    // folders have null id in supabase storage list
    if (item.id == null && !item.metadata) {
      keys.push(...(await listSupabasePrefix(path)))
    } else if (item.name?.toLowerCase().endsWith('.pdf') || path.endsWith('source.pdf')) {
      keys.push({
        key: path,
        size: item.metadata?.size ?? item.metadata?.contentLength ?? null,
      })
    } else if (item.id != null) {
      // non-pdf file under book-sources — still record
      keys.push({
        key: path,
        size: item.metadata?.size ?? null,
        nonPdf: !path.toLowerCase().endsWith('.pdf'),
      })
    }
  }
  return keys
}

let supabaseObjects = []
try {
  supabaseObjects = await listSupabasePrefix('')
} catch (err) {
  console.error(String(err?.message ?? err))
  process.exit(1)
}

const supabaseByKey = new Map(supabaseObjects.map((o) => [o.key, o]))
console.log(`Supabase ${supabaseBucket} objects found: ${supabaseObjects.length}`)
for (const o of supabaseObjects) {
  console.log(`  - ${o.key}${o.size != null ? ` (${o.size} bytes)` : ''}${o.nonPdf ? ' [non-pdf]' : ''}`)
}
console.log('')

// --- List R2 objects ---
async function listR2All() {
  const out = []
  let token
  do {
    const resp = await r2.send(
      new ListObjectsV2Command({
        Bucket: r2Bucket,
        ContinuationToken: token,
        MaxKeys: 1000,
      }),
    )
    for (const obj of resp.Contents ?? []) {
      if (!obj.Key) continue
      // skip connection-test leftovers if any
      out.push({ key: obj.Key, size: obj.Size ?? null })
    }
    token = resp.IsTruncated ? resp.NextContinuationToken : undefined
  } while (token)
  return out
}

const r2Objects = await listR2All()
const r2ByKey = new Map(r2Objects.map((o) => [o.key, o]))
console.log(`R2 ${r2Bucket} objects found: ${r2Objects.length}`)
for (const o of r2Objects) {
  console.log(`  - ${o.key}${o.size != null ? ` (${o.size} bytes)` : ''}`)
}
console.log('')

const catalogKeys = new Set(catalog.map((c) => c.objectKey))
/** R2/S3 often stores zero-byte keys ending in `/` as folder placeholders — not PDF objects. */
function isPrefixPlaceholder(o) {
  return o.key.endsWith('/') || (o.size === 0 && !o.key.toLowerCase().endsWith('.pdf'))
}
const uncatalogedSupabase = supabaseObjects.filter(
  (o) => !catalogKeys.has(o.key) && !isPrefixPlaceholder(o),
)
const uncatalogedR2 = r2Objects.filter(
  (o) =>
    !catalogKeys.has(o.key) &&
    !o.key.startsWith('_connection-tests/') &&
    !isPrefixPlaceholder(o),
)
const r2PrefixPlaceholders = r2Objects.filter(isPrefixPlaceholder)

if (uncatalogedSupabase.length) {
  console.log(`Uncataloged Supabase objects: ${uncatalogedSupabase.length}`)
  for (const o of uncatalogedSupabase) console.log(`  - ${o.key}`)
  console.log('')
}
if (uncatalogedR2.length) {
  console.log(`Uncataloged R2 objects: ${uncatalogedR2.length}`)
  for (const o of uncatalogedR2) console.log(`  - ${o.key}`)
  console.log('')
}

async function downloadSupabase(objectKey) {
  const { data: blob, error } = await supabase.storage.from(supabaseBucket).download(objectKey)
  if (error || !blob) {
    return { ok: false, error: error?.message ?? 'no data' }
  }
  const buf = Buffer.from(await blob.arrayBuffer())
  return { ok: true, buf, sha: sha256(buf), size: buf.length }
}

async function headR2(objectKey) {
  try {
    const head = await r2.send(new HeadObjectCommand({ Bucket: r2Bucket, Key: objectKey }))
    return {
      ok: true,
      exists: true,
      size: head.ContentLength ?? null,
      etag: head.ETag ?? null,
    }
  } catch (err) {
    const name = err?.name ?? ''
    const status = err?.$metadata?.httpStatusCode
    if (name === 'NotFound' || name === 'NoSuchKey' || status === 404) {
      return { ok: true, exists: false }
    }
    return { ok: false, error: `${name}: ${err?.message ?? err}` }
  }
}

async function downloadR2(objectKey) {
  try {
    const got = await r2.send(new GetObjectCommand({ Bucket: r2Bucket, Key: objectKey }))
    const buf = await streamToBuffer(got.Body)
    return { ok: true, buf, sha: sha256(buf), size: buf.length }
  } catch (err) {
    const name = err?.name ?? ''
    const status = err?.$metadata?.httpStatusCode
    if (name === 'NotFound' || name === 'NoSuchKey' || status === 404) {
      return { ok: false, notFound: true, error: 'not_found' }
    }
    return { ok: false, error: `${name}: ${err?.message ?? err}` }
  }
}

/**
 * @typedef {'verified' | 'migrated' | 'already_migrated' | 'missing_source' | 'conflict' | 'failed' | 'audit'} RowStatus
 */

/** @type {Array<Record<string, unknown>>} */
const report = []

const counts = {
  cataloged: catalog.length,
  migrated: 0,
  already_migrated: 0,
  verified: 0,
  missing_source: 0,
  conflict: 0,
  failed: 0,
}

for (const entry of catalog) {
  const { catalogBookId, objectKey, bucket } = entry
  console.log(`--- ${catalogBookId} ---`)
  console.log(`Object key: ${objectKey}`)

  if (bucket !== 'book-sources') {
    console.log(`FAIL: unexpected catalog bucket "${bucket}"`)
    counts.failed += 1
    report.push({
      catalogBookId,
      objectKey,
      supabase: 'present?',
      r2: 'n/a',
      shaMatch: 'FAIL',
      status: 'failed',
      note: `unexpected bucket ${bucket}`,
    })
    continue
  }

  const sbPresentListed = supabaseByKey.has(objectKey)
  const r2PresentListed = r2ByKey.has(objectKey)

  // Always try download for authoritative presence/size/sha
  const sb = await downloadSupabase(objectKey)
  if (!sb.ok) {
    console.log(`Supabase: MISSING (${sb.error})`)
    counts.missing_source += 1
    const r2Head = await headR2(objectKey)
    report.push({
      catalogBookId,
      objectKey,
      supabase: 'missing',
      r2: r2Head.exists ? 'present' : 'missing',
      shaMatch: 'FAIL',
      status: 'missing_source',
      note: sb.error,
      supabaseListed: sbPresentListed,
      r2Listed: r2PresentListed,
    })
    continue
  }

  console.log(`Supabase: present  size=${sb.size}  sha256=${sb.sha}`)

  const r2Head = await headR2(objectKey)
  if (!r2Head.ok) {
    console.log(`R2 HeadObject FAIL: ${r2Head.error}`)
    counts.failed += 1
    report.push({
      catalogBookId,
      objectKey,
      supabase: 'present',
      r2: 'error',
      shaMatch: 'FAIL',
      status: 'failed',
      note: r2Head.error,
      supabaseSize: sb.size,
      supabaseSha: sb.sha,
    })
    continue
  }

  if (auditOnly) {
    report.push({
      catalogBookId,
      objectKey,
      supabase: 'present',
      r2: r2Head.exists ? 'present' : 'missing',
      shaMatch: 'n/a',
      status: 'audit',
      supabaseSize: sb.size,
      supabaseSha: sb.sha,
      r2ListedSize: r2Head.size,
    })
    console.log(`R2: ${r2Head.exists ? 'present' : 'missing'} (audit-only; no transfer)`)
    continue
  }

  if (r2Head.exists) {
    const r2Obj = await downloadR2(objectKey)
    if (!r2Obj.ok) {
      console.log(`R2 download FAIL: ${r2Obj.error}`)
      counts.failed += 1
      report.push({
        catalogBookId,
        objectKey,
        supabase: 'present',
        r2: 'present',
        shaMatch: 'FAIL',
        status: 'failed',
        note: `R2 download: ${r2Obj.error}`,
        supabaseSha: sb.sha,
      })
      continue
    }

    const match = sb.sha === r2Obj.sha && sb.size === r2Obj.size
    if (match) {
      console.log(`R2: present + identical (already migrated)  sha256=${r2Obj.sha}`)
      counts.already_migrated += 1
      counts.verified += 1
      report.push({
        catalogBookId,
        objectKey,
        supabase: 'present',
        r2: 'present',
        shaMatch: 'PASS',
        status: 'already_migrated',
        size: sb.size,
        sha256: sb.sha,
      })
    } else {
      console.log('CONFLICT: R2 object exists but SHA/size differs — not overwriting')
      console.log(`  Supabase sha=${sb.sha} size=${sb.size}`)
      console.log(`  R2       sha=${r2Obj.sha} size=${r2Obj.size}`)
      counts.conflict += 1
      report.push({
        catalogBookId,
        objectKey,
        supabase: 'present',
        r2: 'present',
        shaMatch: 'FAIL',
        status: 'conflict',
        supabaseSha: sb.sha,
        r2Sha: r2Obj.sha,
        supabaseSize: sb.size,
        r2Size: r2Obj.size,
      })
    }
    continue
  }

  // Missing on R2
  if (verifyOnly) {
    console.log('R2: missing (verify-only; no upload)')
    counts.failed += 1
    report.push({
      catalogBookId,
      objectKey,
      supabase: 'present',
      r2: 'missing',
      shaMatch: 'FAIL',
      status: 'failed',
      note: 'not on R2 (verify-only)',
      supabaseSha: sb.sha,
      supabaseSize: sb.size,
    })
    continue
  }

  console.log('R2: missing — uploading…')
  try {
    await r2.send(
      new PutObjectCommand({
        Bucket: r2Bucket,
        Key: objectKey,
        Body: sb.buf,
        ContentType: 'application/pdf',
      }),
    )
  } catch (err) {
    console.log(`Upload FAIL: ${err?.message ?? err}`)
    counts.failed += 1
    report.push({
      catalogBookId,
      objectKey,
      supabase: 'present',
      r2: 'missing',
      shaMatch: 'FAIL',
      status: 'failed',
      note: `upload: ${err?.message ?? err}`,
      supabaseSha: sb.sha,
    })
    continue
  }

  const verify = await downloadR2(objectKey)
  if (!verify.ok) {
    console.log(`Post-upload verify FAIL: ${verify.error}`)
    counts.failed += 1
    report.push({
      catalogBookId,
      objectKey,
      supabase: 'present',
      r2: 'error',
      shaMatch: 'FAIL',
      status: 'failed',
      note: `post-upload get: ${verify.error}`,
      supabaseSha: sb.sha,
    })
    continue
  }

  const match = sb.sha === verify.sha && sb.size === verify.size
  // Confirm Supabase still present
  const still = await downloadSupabase(objectKey)
  const supabasePreserved = still.ok && still.sha === sb.sha

  if (match && supabasePreserved) {
    console.log(`Migrated + verified  sha256=${verify.sha}  size=${verify.size}`)
    counts.migrated += 1
    counts.verified += 1
    report.push({
      catalogBookId,
      objectKey,
      supabase: 'present',
      r2: 'present',
      shaMatch: 'PASS',
      status: 'migrated',
      size: sb.size,
      sha256: sb.sha,
      supabasePreserved: true,
    })
  } else {
    console.log(`Verify FAIL match=${match} supabasePreserved=${supabasePreserved}`)
    counts.failed += 1
    report.push({
      catalogBookId,
      objectKey,
      supabase: 'present',
      r2: 'present',
      shaMatch: match ? 'PASS' : 'FAIL',
      status: 'failed',
      note: `post-check match=${match} preserved=${supabasePreserved}`,
      supabaseSha: sb.sha,
      r2Sha: verify.sha,
    })
  }
}

console.log('')
console.log('========== Stage E report ==========')
console.log('| Book ID | Object key | Supabase | R2 | SHA-256 match | Status |')
console.log('|---|---|---|---|---|---|')
for (const row of report) {
  console.log(
    `| ${row.catalogBookId} | ${row.objectKey} | ${row.supabase} | ${row.r2} | ${row.shaMatch} | ${row.status} |`,
  )
}
console.log('')
console.log(`Total cataloged source PDFs: ${counts.cataloged}`)
console.log(`Newly migrated: ${counts.migrated}`)
console.log(`Already present and verified: ${counts.already_migrated}`)
console.log(`SHA-verified total (migrated + already): ${counts.verified}`)
console.log(`Missing source files: ${counts.missing_source}`)
console.log(`Destination conflicts: ${counts.conflict}`)
console.log(`Failed transfers / verify gaps: ${counts.failed}`)
console.log(`Uncataloged Supabase objects: ${uncatalogedSupabase.length}`)
console.log(
  `Uncataloged R2 PDF/objects (excl. _connection-tests/ + prefix placeholders): ${uncatalogedR2.length}`,
)
console.log(`R2 prefix placeholders (ignored): ${r2PrefixPlaceholders.length}`)

const inScopeOk =
  counts.missing_source === 0 &&
  counts.conflict === 0 &&
  counts.failed === 0 &&
  counts.verified === counts.cataloged &&
  !auditOnly

const status = auditOnly
  ? 'AUDIT'
  : inScopeOk
    ? 'PASS'
    : counts.verified > 0
      ? 'PARTIAL'
      : 'FAIL'

console.log('')
console.log(`Stage E migration status: ${status}`)
console.log('Supabase originals: not deleted (by design).')
console.log('Catalog / object keys: unchanged.')

try {
  r2.destroy()
} catch {
  /* ignore */
}

process.exit(status === 'PASS' || status === 'AUDIT' ? 0 : 1)
