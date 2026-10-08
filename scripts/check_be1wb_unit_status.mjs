/**
 * Report BE1-WB unit book_files.status + local verification_status summary.
 * Usage: node scripts/check_be1wb_unit_status.mjs
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
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

loadEnvFile(resolve(root, 'app', '.env.local'))
loadEnvFile(resolve(root, '.env.local'))

const { createClient } = createRequire(resolve(root, 'app', 'package.json'))(
  '@supabase/supabase-js',
)
const url = (process.env.VITE_SUPABASE_URL || '').trim()
const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const { data: book, error: bookError } = await supabase
  .from('books')
  .select('id,book_id,status,title')
  .eq('book_id', catalogBookId)
  .single()
if (bookError) throw new Error(bookError.message)

const { data: files, error: filesError } = await supabase
  .from('book_files')
  .select('label,status,file_type,storage_path,filename')
  .eq('book_id', book.id)
  .eq('file_type', 'batch_json')
  .order('storage_path')
if (filesError) throw new Error(filesError.message)

console.log(`books: ${book.book_id} status=${book.status}`)
console.log('--- book_files batch_json ---')
for (const f of files || []) {
  console.log(`${f.label}\t${f.status}\t${f.storage_path}`)
}

console.log('--- local unit verification ---')
const dir = join(root, 'data', 'phase1', catalogBookId)
for (let i = 1; i <= 9; i++) {
  const n = String(i).padStart(2, '0')
  const path = join(dir, `${catalogBookId}_unit_${n}.json`)
  if (!existsSync(path)) {
    console.log(`Unit ${i}\tMISSING LOCAL ${path}`)
    continue
  }
  const j = JSON.parse(readFileSync(path, 'utf8'))
  const unitVer = j.units?.[0]?.verification_status ?? '?'
  const bookVer = j.book?.verification_status ?? '?'
  const missing = (j.extraction_issues || []).filter(
    (x) => x.issue_type === 'missing_source' && x.status === 'open',
  ).length
  const unverifiedEntities = countUnverified(j)
  console.log(
    `Unit ${i}\tunit=${unitVer}\tbook_field=${bookVer}\topen_missing_source=${missing}\tunverified_entities=${unverifiedEntities}`,
  )
}

function countUnverified(node, skipBook = true) {
  let count = 0
  function walk(value, inBook) {
    if (Array.isArray(value)) {
      for (const item of value) walk(item, inBook)
      return
    }
    if (!value || typeof value !== 'object') return
    for (const [k, v] of Object.entries(value)) {
      if (k === 'book' && skipBook) {
        walk(v, true)
        continue
      }
      if (k === 'verification_status' && typeof v === 'string') {
        if (!inBook && v !== 'human_verified') count += 1
        continue
      }
      walk(v, inBook)
    }
  }
  walk(node, false)
  return count
}
