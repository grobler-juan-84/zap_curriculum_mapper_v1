/**
 * Align BE1-WB Units 1–8 JSON verification metadata with completed human review,
 * set book-level human_verified (available PDF content; D013 exception preserved),
 * and set books.status = verified.
 *
 * Does not invent missing printed pages 124–129 or close missing_source issues.
 *
 * Usage: node scripts/finalize_be1wb_human_verify.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const catalogBookId = 'big_english_1_wb'
const localDir = join(root, 'data', 'phase1', catalogBookId)

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

function markHumanVerified(value) {
  if (Array.isArray(value)) {
    for (const item of value) markHumanVerified(item)
    return
  }
  if (!value || typeof value !== 'object') return
  for (const [key, child] of Object.entries(value)) {
    if (key === 'verification_status' && typeof child === 'string') {
      value[key] = 'human_verified'
      continue
    }
    markHumanVerified(child)
  }
}

loadEnvFile(resolve(root, 'app', '.env.local'))
loadEnvFile(resolve(root, '.env.local'))

const url = (process.env.VITE_SUPABASE_URL || '').trim()
const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
if (!url || !key) {
  console.error('Missing Supabase env')
  process.exit(1)
}

const { createClient } = createRequire(resolve(root, 'app', 'package.json'))(
  '@supabase/supabase-js',
)
const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const { data: book, error: bookError } = await supabase
  .from('books')
  .select('id,book_id,status')
  .eq('book_id', catalogBookId)
  .single()
if (bookError || !book?.id) throw new Error(bookError?.message || 'book missing')

const { data: files, error: filesError } = await supabase
  .from('book_files')
  .select('label,status,storage_path,filename')
  .eq('book_id', book.id)
  .eq('file_type', 'batch_json')
  .order('storage_path')
if (filesError) throw new Error(filesError.message)

const pending = (files || []).filter((f) => f.status !== 'verified')
if (pending.length) {
  console.error('Refusing book-level approval; unverified batches:')
  for (const f of pending) console.error(`  ${f.label} status=${f.status}`)
  process.exit(1)
}
console.log(`book_files: ${files.length}/9 batch_json verified`)

const bookNote =
  'Human verification COMPLETE 2026-10-08 for all available source-PDF content (Units 1–9). Printed pages 124–129 are absent from the supplied PDF and remain an accepted open missing_source exception (D013); those pages were not invented, extracted, or marked verified.'

for (let i = 1; i <= 9; i++) {
  const n = String(i).padStart(2, '0')
  const filename = `${catalogBookId}_unit_${n}.json`
  const localPath = join(localDir, filename)
  const storagePath = `big-english/${catalogBookId}/batches/unit_${n}.json`

  let dataset
  if (existsSync(localPath)) {
    dataset = JSON.parse(readFileSync(localPath, 'utf8'))
  } else {
    const { data, error } = await supabase.storage.from('book-datasets').download(storagePath)
    if (error || !data) throw new Error(`download ${storagePath}: ${error?.message}`)
    dataset = JSON.parse(await data.text())
  }

  markHumanVerified(dataset)

  if (dataset.book && typeof dataset.book === 'object') {
    dataset.book.verification_status = 'human_verified'
    dataset.book.extraction_status = 'extracted'
    const existing = (dataset.book.notes || '').trim()
    dataset.book.notes = existing.includes('Human verification COMPLETE 2026-10-08')
      ? existing
      : existing
        ? `${existing} ${bookNote}`
        : bookNote
  }

  if (Array.isArray(dataset.extraction_issues)) {
    for (const issue of dataset.extraction_issues) {
      if (issue?.issue_type === 'missing_source') {
        issue.status = 'open'
      }
    }
  }

  const body = `${JSON.stringify(dataset, null, 2)}\n`
  writeFileSync(localPath, body, 'utf8')

  const { error: uploadError } = await supabase.storage
    .from('book-datasets')
    .upload(storagePath, Buffer.from(body, 'utf8'), {
      contentType: 'application/json',
      upsert: true,
    })
  if (uploadError) throw new Error(`upload ${storagePath}: ${uploadError.message}`)

  const { error: metaError } = await supabase.from('book_files').upsert(
    {
      book_id: book.id,
      file_type: 'batch_json',
      bucket: 'book-datasets',
      storage_path: storagePath,
      filename,
      mime_type: 'application/json',
      file_size: Buffer.byteLength(body),
      label: `Unit ${i}`,
      status: 'verified',
    },
    { onConflict: 'bucket,storage_path' },
  )
  if (metaError) throw new Error(`book_files ${storagePath}: ${metaError.message}`)

  console.log(`OK Unit ${i} human_verified (missing_source left open if present)`)
}

const { error: statusError } = await supabase
  .from('books')
  .update({ status: 'verified' })
  .eq('id', book.id)
if (statusError) throw new Error(`books.status: ${statusError.message}`)

console.log(`books.status → verified for ${catalogBookId}`)
console.log('Done. Book-level human verification recorded (D013 exception preserved).')
