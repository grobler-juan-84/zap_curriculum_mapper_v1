/**
 * Stage D smoke checks (no secrets printed):
 * 1) Catalog source_pdf rows for Beehive 1 + Big English 1
 * 2) Direct R2 Head/sign for Beehive path via app/server/signSourcePdf.ts
 *
 * Full JWT + middleware path is verified in the Validation UI (provider badge).
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const appRoot = resolve(root, 'app')

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
  .in('book_id', ['beehive_1_sb', 'big_english_1_sb'])

if (booksErr) {
  console.error('books lookup failed:', booksErr.message)
  process.exit(1)
}

const byCatalog = Object.fromEntries((books ?? []).map((b) => [b.book_id, b.id]))
const paths = {}

for (const catalogId of ['beehive_1_sb', 'big_english_1_sb']) {
  const uuid = byCatalog[catalogId]
  if (!uuid) {
    console.log(`${catalogId}: FAIL (no books row)`)
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
    continue
  }
  paths[catalogId] = pdf.storage_path
  console.log(`${catalogId}: PASS catalog bookFileId present path=${pdf.storage_path}`)
}

const signMod = await import(
  pathToFileURL(resolve(appRoot, 'server/signSourcePdf.ts')).href
)

const beehivePath = paths.beehive_1_sb
if (beehivePath) {
  const signed = await signMod.signSourcePdfObject(beehivePath)
  if (signed.ok) {
    console.log(`beehive_1_sb R2 sign: PASS (url length=${signed.signedUrl.length}, no secret printed)`)
  } else {
    console.log(`beehive_1_sb R2 sign: FAIL code=${signed.code} message=${signed.message}`)
    process.exit(1)
  }
}

const bePath = paths.big_english_1_sb
if (bePath) {
  const signed = await signMod.signSourcePdfObject(bePath)
  if (!signed.ok && signed.code === 'not_found') {
    console.log(`big_english_1_sb R2 sign: PASS expected not_found (fallback book)`)
  } else if (signed.ok) {
    console.log(`big_english_1_sb R2 sign: NOTE object already on R2`)
  } else {
    console.log(`big_english_1_sb R2 sign: FAIL code=${signed.code}`)
    process.exit(1)
  }
}

console.log('')
console.log('CORS: Object Read/Write token cannot manage CORS (AccessDenied).')
console.log(
  'If PDF.js fails cross-origin, add GET/HEAD for http://localhost:5173 and http://127.0.0.1:5173 in Cloudflare R2 bucket CORS settings.',
)
console.log('UI check: Validation badge should show "via r2" for Beehive 1 and "via supabase" for others.')
