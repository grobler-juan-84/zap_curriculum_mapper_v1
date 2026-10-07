/**
 * One-shot: mark selected book_files batch_json rows as verified.
 * Usage: node scripts/mark_batches_verified.mjs
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
loadEnvFile(resolve(root, '.env'))

const url = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim()
const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const paths = [
  'beehive/beehive_1_sb/batches/unit_09.json',
  'beehive/beehive_1_sb/batches/unit_10.json',
  'reach-higher/reach_higher_2a/batches/unit_01.json',
  'reach-higher/reach_higher_2a/batches/unit_02.json',
  'reach-higher/reach_higher_2a/batches/unit_03.json',
  'reach-higher/reach_higher_2a/batches/unit_04.json',
]

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const { data, error } = await supabase
  .from('book_files')
  .update({ status: 'verified' })
  .eq('bucket', 'book-datasets')
  .eq('file_type', 'batch_json')
  .in('storage_path', paths)
  .select('storage_path, status, label')

if (error) {
  console.error(error.message)
  process.exit(1)
}

console.log(`updated ${data?.length ?? 0}`)
for (const row of data ?? []) {
  console.log(`${row.status}\t${row.label}\t${row.storage_path}`)
}
