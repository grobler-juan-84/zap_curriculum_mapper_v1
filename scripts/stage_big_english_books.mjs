/**
 * Stage one or more Big English books for Validation:
 * catalog seed (books + source_pdf) → normalize units → R2 PDF → batch upload → status=extracted
 *
 * Usage:
 *   node scripts/stage_big_english_books.mjs big_english_5_sb big_english_5_wb big_english_6_sb big_english_6_wb
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const BOOK_META = {
  big_english_5_sb: {
    title: 'Big English 5 Student Book',
    level: '5',
    book_type: 'Student Book',
    registryId: 'BE5-SB',
  },
  big_english_5_wb: {
    title: 'Big English 5 Workbook',
    level: '5',
    book_type: 'Workbook',
    registryId: 'BE5-WB',
  },
  big_english_6_sb: {
    title: 'Big English 6 Student Book',
    level: '6',
    book_type: 'Student Book',
    registryId: 'BE6-SB',
  },
  big_english_6_wb: {
    title: 'Big English 6 Workbook',
    level: '6',
    book_type: 'Workbook',
    registryId: 'BE6-WB',
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

const catalogs = process.argv.slice(2).filter(Boolean)
if (!catalogs.length) {
  console.error(
    'Usage: node scripts/stage_big_english_books.mjs <catalog_book_id...>',
  )
  process.exit(1)
}
for (const c of catalogs) {
  if (!BOOK_META[c]) {
    console.error(`Unknown / unsupported catalog for this helper: ${c}`)
    process.exit(1)
  }
}

const { createClient } = createRequire(resolve(root, 'app', 'package.json'))(
  '@supabase/supabase-js',
)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

function run(cmd, args, env = {}) {
  console.log(`\n> ${cmd} ${args.join(' ')}`)
  const r = spawnSync(cmd, args, {
    cwd: root,
    env: { ...process.env, ...env },
    encoding: 'utf8',
    shell: true,
  })
  if (r.stdout) process.stdout.write(r.stdout)
  if (r.stderr) process.stderr.write(r.stderr)
  if (r.status !== 0) {
    throw new Error(`Command failed (${r.status}): ${cmd} ${args.join(' ')}`)
  }
}

const { data: series, error: seriesErr } = await supabase
  .from('book_series')
  .select('id,name')
  .ilike('name', 'Big English')
  .maybeSingle()
if (seriesErr || !series?.id) {
  throw new Error(seriesErr?.message || 'Big English series missing')
}

for (const catalog of catalogs) {
  const meta = BOOK_META[catalog]
  console.log(`\n======== Staging ${meta.registryId} (${catalog}) ========`)

  // 1) sanitize + normalize local JSON
  run('node', ['scripts/sanitize_be_unit_json.mjs', catalog])
  run('node', ['scripts/normalize_be_units.mjs', catalog])

  // 2) catalog seed
  const { data: book, error: bookErr } = await supabase
    .from('books')
    .upsert(
      {
        book_id: catalog,
        series_id: series.id,
        title: meta.title,
        level: meta.level,
        book_type: meta.book_type,
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

  const { error: pdfErr } = await supabase.from('book_files').upsert(
    {
      book_id: book.id,
      file_type: 'source_pdf',
      bucket: 'book-sources',
      storage_path: `big-english/${catalog}/source.pdf`,
      filename: 'source.pdf',
      mime_type: 'application/pdf',
      label: 'Source PDF',
      status: 'pending',
    },
    { onConflict: 'bucket,storage_path' },
  )
  if (pdfErr) throw new Error(pdfErr.message)
  console.log('book_files OK source_pdf')

  // 3) R2 PDF + batches
  run('node', ['scripts/upload_source_pdfs.mjs'], { UPLOAD_ONLY: catalog })
  run('node', ['scripts/upload_pilot_batches.mjs'], { UPLOAD_ONLY: catalog })

  // 4) status extracted
  const { data: updated, error: statusErr } = await supabase
    .from('books')
    .update({ status: 'extracted' })
    .eq('book_id', catalog)
    .select('id,status')
    .single()
  if (statusErr) throw new Error(statusErr.message)
  console.log(`books.status=${updated.status}`)

  const { data: files } = await supabase
    .from('book_files')
    .select('label,status')
    .eq('book_id', book.id)
    .eq('file_type', 'batch_json')
    .order('storage_path')
  console.log(
    `batch_json: ${(files || []).length}/9 pending=${(files || []).filter((f) => f.status === 'pending').length}`,
  )
}

console.log('\nAll requested books staged.')
