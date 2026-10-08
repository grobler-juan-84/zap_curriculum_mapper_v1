/**
 * Upload source PDFs to Cloudflare R2 and upsert matching `book_files` rows
 * (`file_type = source_pdf`). D012 — PDF bytes go to R2 only (not Supabase Storage).
 *
 * Local source (gitignored): app/src/assets/books/{series_slug}/{catalog_book_id}.pdf
 * R2 destination: {series_slug}/{catalog_book_id}/source.pdf
 *
 * Env (root `.env.local` / `app/.env.local`):
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
 *   VITE_SUPABASE_URL (or SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY  — catalog upsert only
 *
 * Usage (from repo root):
 *   node scripts/upload_source_pdfs.mjs
 *   $env:UPLOAD_ONLY='beehive_1_sb'; node scripts/upload_source_pdfs.mjs
 *
 * Requires: npm install --prefix scripts/.r2-tools @aws-sdk/client-s3
 * Never commit secrets.
 */

import { readFileSync, existsSync, statSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const vendorRoot = join(__dirname, '.r2-tools')
const { createClient } = createRequire(resolve(root, 'app', 'package.json'))(
  '@supabase/supabase-js',
)

const bucket = 'book-sources'
const localBooksRoot = join(root, 'app', 'src', 'assets', 'books')

/** [book_id, series_slug, storagePath] — local file is {series}/{book_id}.pdf */
const SOURCES = [
  ['beehive_1_sb', 'beehive', 'beehive/beehive_1_sb/source.pdf'],
  ['big_english_1_sb', 'big-english', 'big-english/big_english_1_sb/source.pdf'],
  ['big_english_2_sb', 'big-english', 'big-english/big_english_2_sb/source.pdf'],
  ['reach_higher_2a', 'reach-higher', 'reach-higher/reach_higher_2a/source.pdf'],
]

function loadEnvFile(path) {
  if (!existsSync(path)) return
  const text = readFileSync(path, 'utf8')
  for (const line of text.split(/\r?\n/)) {
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
    if (!(key in process.env) || !process.env[key]) {
      process.env[key] = value
    }
  }
}

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

loadEnvFile(resolve(root, 'app', '.env.local'))
loadEnvFile(resolve(root, '.env.local'))
loadEnvFile(resolve(root, '.env'))

const url = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim()
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
  bucket
).trim()

const missing = []
if (!url) missing.push('VITE_SUPABASE_URL or SUPABASE_URL')
if (!serviceKey) missing.push('SUPABASE_SERVICE_ROLE_KEY')
if (!accountId) missing.push('R2_ACCOUNT_ID')
if (!r2AccessKeyId) missing.push('R2_ACCESS_KEY_ID')
if (!r2SecretAccessKey) missing.push('R2_SECRET_ACCESS_KEY')
if (!r2Bucket) missing.push('R2_BUCKET_NAME')
if (!endpoint) missing.push('R2_ENDPOINT (or R2_ACCOUNT_ID to derive)')

if (missing.length) {
  console.error(`Missing required env: ${missing.join(', ')}`)
  process.exit(1)
}

const requireVendor = createRequire(join(vendorRoot, 'package.json'))
let S3Client
let PutObjectCommand
try {
  ;({ S3Client, PutObjectCommand } = requireVendor('@aws-sdk/client-s3'))
} catch {
  console.error(
    'Missing @aws-sdk/client-s3. From repo root run:\n' +
      '  npm install --prefix scripts/.r2-tools @aws-sdk/client-s3',
  )
  process.exit(1)
}

const r2 = new S3Client({
  region: 'auto',
  endpoint,
  credentials: {
    accessKeyId: r2AccessKeyId,
    secretAccessKey: r2SecretAccessKey,
  },
})

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const onlyFilter = (process.env.UPLOAD_ONLY || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const selected = onlyFilter.length
  ? SOURCES.filter(([bookKey, seriesSlug, storagePath]) =>
      onlyFilter.some(
        (token) =>
          bookKey === token ||
          seriesSlug === token ||
          bookKey.includes(token) ||
          storagePath.includes(token),
      ),
    )
  : SOURCES

if (onlyFilter.length && selected.length === 0) {
  console.error(`UPLOAD_ONLY matched no sources: ${onlyFilter.join(', ')}`)
  process.exit(1)
}

let uploaded = 0
let failed = 0

for (const [bookKey, seriesSlug, storagePath] of selected) {
  const localPath = join(localBooksRoot, seriesSlug, `${bookKey}.pdf`)
  if (!existsSync(localPath)) {
    console.error(`MISSING ${localPath}`)
    failed += 1
    continue
  }

  const { data: book, error: bookError } = await supabase
    .from('books')
    .select('id')
    .eq('book_id', bookKey)
    .maybeSingle()

  if (bookError || !book?.id) {
    console.error(
      `FAIL   ${storagePath}: book_id=${bookKey} not found (${bookError?.message ?? 'no row'})`,
    )
    failed += 1
    continue
  }

  const body = readFileSync(localPath)
  const size = statSync(localPath).size

  try {
    await r2.send(
      new PutObjectCommand({
        Bucket: r2Bucket,
        Key: storagePath,
        Body: body,
        ContentType: 'application/pdf',
      }),
    )
  } catch (err) {
    console.error(
      `FAIL   R2 ${storagePath}: ${err instanceof Error ? err.message : String(err)}`,
    )
    failed += 1
    continue
  }

  const { error: metaError } = await supabase.from('book_files').upsert(
    {
      book_id: book.id,
      file_type: 'source_pdf',
      bucket,
      storage_path: storagePath,
      filename: 'source.pdf',
      mime_type: 'application/pdf',
      file_size: size,
      label: 'Source PDF',
      status: 'pending',
    },
    { onConflict: 'bucket,storage_path' },
  )

  if (metaError) {
    console.warn(
      `WARN   uploaded to R2 but could not upsert book_files: ${storagePath} (${metaError.message})`,
    )
  }

  console.log(`OK     R2 ${storagePath} (${size} bytes) → ${bookKey}`)
  uploaded += 1
}

console.log(
  `\nDone. uploaded=${uploaded} failed=${failed} selected=${selected.length} (R2-only D012)`,
)
if (failed > 0) process.exit(1)
