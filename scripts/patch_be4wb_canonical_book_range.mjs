/**
 * Set BE4-WB canonical book.printed_page_* from merged pages (merge pickBook
 * may inherit a single-unit batch range).
 *
 * Usage: node scripts/patch_be4wb_canonical_book_range.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const catalog = 'big_english_4_wb'
const localPath = join(root, 'data', 'phase1', catalog, 'canonical', 'v1.json')
const storagePath = `big-english/${catalog}/canonical/v1.json`

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

const j = JSON.parse(readFileSync(localPath, 'utf8'))
const printed = j.pages.map((p) => p.printed_page).filter((n) => typeof n === 'number')
j.book.printed_page_start = Math.min(...printed)
j.book.printed_page_end = Math.max(...printed)
const body = `${JSON.stringify(j, null, 2)}\n`
writeFileSync(localPath, body, 'utf8')
console.log(`patched book printed ${j.book.printed_page_start}–${j.book.printed_page_end}`)

const { createClient } = createRequire(resolve(root, 'app', 'package.json'))(
  '@supabase/supabase-js',
)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
)
const { error } = await supabase.storage
  .from('book-datasets')
  .upload(storagePath, Buffer.from(body, 'utf8'), {
    contentType: 'application/json',
    upsert: true,
  })
if (error) throw new Error(error.message)
console.log(`Uploaded ${storagePath}`)
