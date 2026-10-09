/**
 * Set canonical book.printed_page_* from merged pages.
 * Usage: node scripts/patch_canonical_book_range.mjs big_english_5_sb
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const catalog = process.argv[2]
if (!catalog) {
  console.error('Usage: node scripts/patch_canonical_book_range.mjs <catalog_book_id>')
  process.exit(1)
}
const seriesSlug = catalog.startsWith('reach_higher')
  ? 'reach-higher'
  : catalog.startsWith('beehive')
    ? 'beehive'
    : 'big-english'
const localPath = join(root, 'data', 'phase1', catalog, 'canonical', 'v1.json')
const storagePath = `${seriesSlug}/${catalog}/canonical/v1.json`

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
