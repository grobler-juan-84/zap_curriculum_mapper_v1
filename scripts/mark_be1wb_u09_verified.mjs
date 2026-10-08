/**
 * Mark BE1-WB Unit 9 human-verified for available source content (metadata only).
 * Does not invent missing printed pages 124–129. Keeps missing_source issue open.
 *
 * Usage: node scripts/mark_be1wb_u09_verified.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const localPath = resolve(
  root,
  'data',
  'phase1',
  'big_english_1_wb',
  'big_english_1_wb_unit_09.json',
)
const storagePath = 'big-english/big_english_1_wb/batches/unit_09.json'
const catalogBookId = 'big_english_1_wb'

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

if (!existsSync(localPath)) {
  console.error(`Missing ${localPath}`)
  process.exit(1)
}

const dataset = JSON.parse(readFileSync(localPath, 'utf8'))

markHumanVerified(dataset)

// Book-level status stays unverified until all units are approved.
if (dataset.book && typeof dataset.book === 'object') {
  dataset.book.verification_status = 'unverified'
}

const approvalNote =
  'Human verification 2026-10-08: approved for content present in the supplied source PDF. Printed pages 124–129 remain absent from the PDF and are not extracted or verified (open missing_source issue).'

if (dataset.batch && typeof dataset.batch === 'object') {
  const existing = (dataset.batch.notes || '').trim()
  dataset.batch.notes = existing.includes('Human verification 2026-10-08')
    ? existing
    : existing
      ? `${existing} ${approvalNote}`
      : approvalNote
}

if (Array.isArray(dataset.units)) {
  for (const unit of dataset.units) {
    if (unit?.unit_id !== 'big_english_1_wb_unit_09') continue
    const existing = (unit.notes || '').trim()
    const unitNote =
      'Human-verified 2026-10-08 for available PDF pages only; printed 124–129 missing from source PDF (documented exception).'
    unit.notes = existing.includes('Human-verified 2026-10-08')
      ? existing
      : existing
        ? `${existing} ${unitNote}`
        : unitNote
  }
}

if (Array.isArray(dataset.extraction_issues)) {
  for (const issue of dataset.extraction_issues) {
    if (issue?.issue_type !== 'missing_source') continue
    issue.status = 'open'
    issue.description =
      'Printed pages 124–129 inclusive are missing from the supplied BE1-WB source PDF (gap between PDF page 123 / printed 123 and PDF page 124 / printed 130). Extraction correctly omitted unavailable Story / Language in Action / Content Connection / Grammar activities 5–16. Human verification 2026-10-08 approved available PDF content only; these missing pages remain unextracted and unverified.'
  }
}

writeFileSync(localPath, `${JSON.stringify(dataset, null, 2)}\n`, 'utf8')
console.log(`Updated local metadata: ${localPath}`)

loadEnvFile(resolve(root, 'app', '.env.local'))
loadEnvFile(resolve(root, '.env.local'))

const url = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim()
const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
if (!url || !key) {
  console.error('Missing Supabase env; local file updated only.')
  process.exit(1)
}

const { createClient } = createRequire(resolve(root, 'app', 'package.json'))(
  '@supabase/supabase-js',
)
const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const body = Buffer.from(`${JSON.stringify(dataset, null, 2)}\n`, 'utf8')
const { error: uploadError } = await supabase.storage
  .from('book-datasets')
  .upload(storagePath, body, {
    contentType: 'application/json',
    upsert: true,
  })
if (uploadError) {
  console.error(`Storage upload failed: ${uploadError.message}`)
  process.exit(1)
}
console.log(`Uploaded ${storagePath}`)

const { data: book, error: bookError } = await supabase
  .from('books')
  .select('id')
  .eq('book_id', catalogBookId)
  .maybeSingle()
if (bookError || !book?.id) {
  console.error(bookError?.message || `No books row for ${catalogBookId}`)
  process.exit(1)
}

const { error: metaError } = await supabase.from('book_files').upsert(
  {
    book_id: book.id,
    file_type: 'batch_json',
    bucket: 'book-datasets',
    storage_path: storagePath,
    filename: 'big_english_1_wb_unit_09.json',
    mime_type: 'application/json',
    file_size: body.length,
    label: 'Unit 9',
    status: 'verified',
  },
  { onConflict: 'bucket,storage_path' },
)
if (metaError) {
  console.error(`book_files upsert failed: ${metaError.message}`)
  process.exit(1)
}
console.log('book_files.status=verified for Unit 9')
