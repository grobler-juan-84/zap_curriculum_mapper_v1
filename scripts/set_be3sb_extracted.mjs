/**
 * Set BE3-SB books.status = extracted after unit batches are uploaded.
 * Usage: node scripts/set_be3sb_extracted.mjs
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

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
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

const { data: book, error } = await supabase
  .from('books')
  .update({ status: 'extracted' })
  .eq('book_id', 'big_english_3_sb')
  .select('id,status')
  .single()

if (error) throw new Error(error.message)
console.log(`books.status=${book.status}`)

const { data: files, error: filesError } = await supabase
  .from('book_files')
  .select('label,status,storage_path')
  .eq('book_id', book.id)
  .eq('file_type', 'batch_json')
  .order('storage_path')

if (filesError) throw new Error(filesError.message)
for (const f of files || []) console.log(`${f.label}\t${f.status}`)
console.log(`batch_json rows: ${(files || []).length}`)
