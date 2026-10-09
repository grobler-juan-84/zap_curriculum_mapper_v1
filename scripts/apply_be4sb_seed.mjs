/**
 * Apply BE4-SB catalog seed via service role (no supabase CLI required).
 * Mirrors supabase/migrations/20261009140000_seed_big_english_4_sb.sql
 *
 * Usage: node scripts/apply_be4sb_seed.mjs
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const { createClient } = createRequire(resolve(root, 'app', 'package.json'))(
  '@supabase/supabase-js',
)

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

const url = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim()
const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const { data: series, error: seriesErr } = await supabase
  .from('book_series')
  .select('id,name')
  .ilike('name', 'Big English')
  .maybeSingle()

if (seriesErr || !series?.id) {
  throw new Error(seriesErr?.message || 'Big English series missing')
}

const { data: book, error: bookErr } = await supabase
  .from('books')
  .upsert(
    {
      book_id: 'big_english_4_sb',
      series_id: series.id,
      title: 'Big English 4 Student Book',
      level: '4',
      book_type: 'Student Book',
      edition: null,
      language: 'English',
      status: 'registered',
    },
    { onConflict: 'book_id' },
  )
  .select('id,book_id')
  .single()

if (bookErr) throw new Error(bookErr.message)
console.log(`books OK ${book.book_id} ${book.id}`)

const { error: filesErr } = await supabase.from('book_files').upsert(
  {
    book_id: book.id,
    file_type: 'source_pdf',
    bucket: 'book-sources',
    storage_path: 'big-english/big_english_4_sb/source.pdf',
    filename: 'source.pdf',
    mime_type: 'application/pdf',
    label: 'Source PDF',
    status: 'pending',
  },
  { onConflict: 'bucket,storage_path' },
)

if (filesErr) throw new Error(filesErr.message)
console.log('book_files OK source_pdf')
