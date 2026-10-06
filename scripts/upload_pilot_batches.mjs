/**
 * Upload pilot Phase 1 unit-batch JSON files into the private `book-datasets` bucket.
 *
 * Local source (gitignored): data/phase1/<book_id>/*.json
 * Storage is the repo source of truth after upload — restore local copies only when re-uploading.
 *
 * Reads credentials from app/.env.local (or process env):
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage (from repo root):
 *   node scripts/upload_pilot_batches.mjs
 *
 * Never commit the service-role key. Prefer keeping it out of Vite-loaded files long-term.
 */

import { readFileSync, existsSync, statSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const { createClient } = createRequire(resolve(root, 'app', 'package.json'))(
  '@supabase/supabase-js',
)
const bucket = 'book-datasets'

const BATCHES = [
  ['beehive_1_sb', 'beehive_1_sb_unit_01.json', 'beehive/beehive_1_sb/batches/unit_01.json'],
  ['beehive_1_sb', 'beehive_1_sb_unit_02.json', 'beehive/beehive_1_sb/batches/unit_02.json'],
  ['beehive_1_sb', 'beehive_1_sb_unit_03.json', 'beehive/beehive_1_sb/batches/unit_03.json'],
  ['beehive_1_sb', 'beehive_1_sb_unit_04.json', 'beehive/beehive_1_sb/batches/unit_04.json'],
  ['beehive_1_sb', 'beehive_1_sb_unit_05.json', 'beehive/beehive_1_sb/batches/unit_05.json'],
  ['beehive_1_sb', 'beehive_1_sb_unit_06.json', 'beehive/beehive_1_sb/batches/unit_06.json'],
  ['beehive_1_sb', 'beehive_1_sb_unit_07.json', 'beehive/beehive_1_sb/batches/unit_07.json'],
  ['beehive_1_sb', 'beehive_1_sb_unit_08.json', 'beehive/beehive_1_sb/batches/unit_08.json'],
  ['big_english_1_sb', 'big_english_1_sb_unit_01.json', 'big-english/big_english_1_sb/batches/unit_01.json'],
  ['big_english_1_sb', 'big_english_1_sb_unit_02.json', 'big-english/big_english_1_sb/batches/unit_02.json'],
  ['big_english_1_sb', 'big_english_1_sb_unit_03.json', 'big-english/big_english_1_sb/batches/unit_03.json'],
  ['big_english_1_sb', 'big_english_1_sb_unit_04.json', 'big-english/big_english_1_sb/batches/unit_04.json'],
  ['big_english_1_sb', 'big_english_1_sb_unit_05.json', 'big-english/big_english_1_sb/batches/unit_05.json'],
  ['big_english_1_sb', 'big_english_1_sb_unit_06.json', 'big-english/big_english_1_sb/batches/unit_06.json'],
  ['big_english_1_sb', 'big_english_1_sb_unit_07.json', 'big-english/big_english_1_sb/batches/unit_07.json'],
  ['big_english_1_sb', 'big_english_1_sb_unit_08.json', 'big-english/big_english_1_sb/batches/unit_08.json'],
  ['big_english_1_sb', 'big_english_1_sb_unit_09.json', 'big-english/big_english_1_sb/batches/unit_09.json'],
  ['big_english_2_sb', 'big_english_2_sb_unit_01.json', 'big-english/big_english_2_sb/batches/unit_01.json'],
  ['big_english_2_sb', 'big_english_2_sb_unit_02.json', 'big-english/big_english_2_sb/batches/unit_02.json'],
  ['big_english_2_sb', 'big_english_2_sb_unit_03.json', 'big-english/big_english_2_sb/batches/unit_03.json'],
  ['big_english_2_sb', 'big_english_2_sb_unit_04.json', 'big-english/big_english_2_sb/batches/unit_04.json'],
  ['big_english_2_sb', 'big_english_2_sb_unit_05.json', 'big-english/big_english_2_sb/batches/unit_05.json'],
  ['big_english_2_sb', 'big_english_2_sb_unit_06.json', 'big-english/big_english_2_sb/batches/unit_06.json'],
  ['big_english_2_sb', 'big_english_2_sb_unit_07.json', 'big-english/big_english_2_sb/batches/unit_07.json'],
  ['big_english_2_sb', 'big_english_2_sb_unit_08.json', 'big-english/big_english_2_sb/batches/unit_08.json'],
  ['big_english_2_sb', 'big_english_2_sb_unit_09.json', 'big-english/big_english_2_sb/batches/unit_09.json'],
  ['reach_higher_2a', 'rh2a_sb_unit1.json', 'reach-higher/reach_higher_2a/batches/unit_01.json'],
  ['reach_higher_2a', 'rh2a_sb_unit2.json', 'reach-higher/reach_higher_2a/batches/unit_02.json'],
  ['reach_higher_2a', 'rh2a_sb_unit3.json', 'reach-higher/reach_higher_2a/batches/unit_03.json'],
  ['reach_higher_2a', 'rh2a_sb_unit4.json', 'reach-higher/reach_higher_2a/batches/unit_04.json'],
]

function loadEnvFile(path) {
  if (!existsSync(path)) return
  const text = readFileSync(path, 'utf8')
  for (const line of text.split(/\r?\n/)) {
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
    if (!(key in process.env) || !process.env[key]) {
      process.env[key] = value
    }
  }
}

loadEnvFile(resolve(root, 'app', '.env.local'))
loadEnvFile(resolve(root, '.env.local'))
loadEnvFile(resolve(root, '.env'))

const url = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim()
const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

if (!url || !serviceKey) {
  console.error(
    'Missing VITE_SUPABASE_URL (or SUPABASE_URL) and/or SUPABASE_SERVICE_ROLE_KEY.',
  )
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

let uploaded = 0
let failed = 0

for (const [bookId, filename, storagePath] of BATCHES) {
  const localPath = join(root, 'data', 'phase1', bookId, filename)
  if (!existsSync(localPath)) {
    console.error(`MISSING ${localPath}`)
    failed += 1
    continue
  }

  const body = readFileSync(localPath)
  const size = statSync(localPath).size

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, body, {
      contentType: 'application/json',
      upsert: true,
    })

  if (uploadError) {
    console.error(`FAIL   ${storagePath}: ${uploadError.message}`)
    failed += 1
    continue
  }

  const { error: metaError } = await supabase
    .from('book_files')
    .update({ file_size: size, mime_type: 'application/json' })
    .eq('bucket', bucket)
    .eq('storage_path', storagePath)

  if (metaError) {
    console.warn(`WARN   uploaded but could not update book_files: ${storagePath} (${metaError.message})`)
  }

  console.log(`OK     ${storagePath} (${size} bytes)`)
  uploaded += 1
}

console.log(`\nDone. uploaded=${uploaded} failed=${failed} total=${BATCHES.length}`)
if (failed > 0) process.exit(1)
