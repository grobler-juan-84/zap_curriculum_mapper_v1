/**
 * Stage D/E smoke checks (no secrets printed):
 * 1) Catalog source_pdf rows for all in-scope pilot books
 * 2) Direct R2 getSourcePdfObject for each catalog path (Stage E expects all present)
 *
 * Full JWT + same-origin proxy path is verified in the Validation UI (provider badge).
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const appRoot = resolve(root, 'app')

const CATALOG_IDS = [
  'beehive_1_sb',
  'big_english_1_sb',
  'big_english_1_wb',
  'big_english_2_sb',
  'big_english_2_wb',
  'reach_higher_2a',
]

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
loadEnvFile(resolve(appRoot, '.env.local'))

const { createClient } = createRequire(resolve(appRoot, 'package.json'))('@supabase/supabase-js')
const supabaseUrl = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim()
const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
const anonKey = (process.env.VITE_SUPABASE_ANON_KEY || '').trim()

if (!supabaseUrl || !(serviceKey || anonKey)) {
  console.error('Missing Supabase env')
  process.exit(2)
}

const admin = createClient(supabaseUrl, serviceKey || anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const { data: books, error: booksErr } = await admin
  .from('books')
  .select('id, book_id')
  .in('book_id', CATALOG_IDS)

if (booksErr) {
  console.error('books lookup failed:', booksErr.message)
  process.exit(1)
}

const byCatalog = Object.fromEntries((books ?? []).map((b) => [b.book_id, b.id]))
const paths = {}
let catalogFail = 0

for (const catalogId of CATALOG_IDS) {
  const uuid = byCatalog[catalogId]
  if (!uuid) {
    console.log(`${catalogId}: FAIL (no books row)`)
    catalogFail += 1
    continue
  }
  const { data: pdf, error } = await admin
    .from('book_files')
    .select('id, storage_path')
    .eq('book_id', uuid)
    .eq('file_type', 'source_pdf')
    .maybeSingle()
  if (error || !pdf) {
    console.log(`${catalogId}: FAIL (no source_pdf row)`)
    catalogFail += 1
    continue
  }
  paths[catalogId] = pdf.storage_path
  console.log(`${catalogId}: PASS catalog bookFileId present path=${pdf.storage_path}`)
}

const signMod = await import(
  pathToFileURL(resolve(appRoot, 'server/signSourcePdf.ts')).href
)

let r2Fail = 0
for (const catalogId of CATALOG_IDS) {
  const storagePath = paths[catalogId]
  if (!storagePath) continue
  const got = await signMod.getSourcePdfObject(storagePath)
  if (got.ok) {
    console.log(`${catalogId} R2 proxy-get: PASS (bytes=${got.bytes.length})`)
  } else {
    console.log(`${catalogId} R2 proxy-get: FAIL code=${got.code} message=${got.message}`)
    r2Fail += 1
  }
}

console.log('')
console.log('Browser delivery uses same-origin POST /api/source-pdf-content (no R2 CORS required).')
console.log(
  'Manual UI: open Validation for big_english_1_wb (and any pilot); badge should show "via r2" and console delivery=proxy.',
)
console.log('JSON datasets / covers remain on Supabase; Auth + catalog authorization unchanged.')

if (catalogFail || r2Fail) {
  console.log('')
  console.log(`Smoke: FAIL (catalog_fail=${catalogFail} r2_fail=${r2Fail})`)
  process.exit(1)
}

console.log('')
console.log('Smoke: PASS (all cataloged source PDFs retrievable from R2)')
process.exit(0)
