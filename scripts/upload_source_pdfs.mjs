/**
 * Upload pilot source PDFs into the private `book-sources` bucket and upsert
 * matching `book_files` rows (`file_type = source_pdf`).
 *
 * Local source (gitignored): app/src/assets/books/{series_slug}/{catalog_book_id}.pdf
 * Storage destination unchanged: {series_slug}/{catalog_book_id}/source.pdf
 *
 * Reads credentials from app/.env.local (or process env):
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage (from repo root):
 *   node scripts/upload_source_pdfs.mjs
 *
 * Never commit the service-role key.
 */

import { readFileSync, existsSync, statSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
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

loadEnvFile(resolve(root, 'app', '.env.local'))
loadEnvFile(resolve(root, '.env.local'))
loadEnvFile(resolve(root, '.env'))

const url = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim()
const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

if (!url || !serviceKey) {
  console.error(
    'Missing VITE_SUPABASE_URL (or SUPABASE_URL) and/or SUPABASE_SERVICE_ROLE_KEY.',
  )
  process.exit(1)
}

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

  const { error: uploadError } = await supabase.storage.from(bucket).upload(storagePath, body, {
    contentType: 'application/pdf',
    upsert: true,
  })

  if (uploadError) {
    console.error(`FAIL   ${storagePath}: ${uploadError.message}`)
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
      `WARN   uploaded but could not upsert book_files: ${storagePath} (${metaError.message})`,
    )
  }

  console.log(`OK     ${storagePath} (${size} bytes) → ${bookKey}`)
  uploaded += 1
}

console.log(
  `\nDone. uploaded=${uploaded} failed=${failed} selected=${selected.length}`,
)
if (failed > 0) process.exit(1)
