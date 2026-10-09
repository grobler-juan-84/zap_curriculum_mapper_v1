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

/** [bookKey, localFilename, storagePath, label, status] */
const BATCHES = [
  ['beehive_1_sb', 'beehive_1_sb_unit_01.json', 'beehive/beehive_1_sb/batches/unit_01.json', 'Unit 1', 'verified'],
  ['beehive_1_sb', 'beehive_1_sb_unit_02.json', 'beehive/beehive_1_sb/batches/unit_02.json', 'Unit 2', 'verified'],
  ['beehive_1_sb', 'beehive_1_sb_unit_03.json', 'beehive/beehive_1_sb/batches/unit_03.json', 'Unit 3', 'verified'],
  ['beehive_1_sb', 'beehive_1_sb_unit_04.json', 'beehive/beehive_1_sb/batches/unit_04.json', 'Unit 4', 'verified'],
  ['beehive_1_sb', 'beehive_1_sb_unit_05.json', 'beehive/beehive_1_sb/batches/unit_05.json', 'Unit 5', 'verified'],
  ['beehive_1_sb', 'beehive_1_sb_unit_06.json', 'beehive/beehive_1_sb/batches/unit_06.json', 'Unit 6', 'verified'],
  ['beehive_1_sb', 'beehive_1_sb_unit_07.json', 'beehive/beehive_1_sb/batches/unit_07.json', 'Unit 7', 'verified'],
  ['beehive_1_sb', 'beehive_1_sb_unit_08.json', 'beehive/beehive_1_sb/batches/unit_08.json', 'Unit 8', 'verified'],
  ['beehive_1_sb', 'beehive_1_sb_unit_09.json', 'beehive/beehive_1_sb/batches/unit_09.json', 'Unit 9', 'verified'],
  ['beehive_1_sb', 'beehive_1_sb_unit_10.json', 'beehive/beehive_1_sb/batches/unit_10.json', 'Unit 10', 'verified'],
  ['big_english_1_sb', 'big_english_1_sb_unit_01.json', 'big-english/big_english_1_sb/batches/unit_01.json', 'Unit 1', 'verified'],
  ['big_english_1_sb', 'big_english_1_sb_unit_02.json', 'big-english/big_english_1_sb/batches/unit_02.json', 'Unit 2', 'verified'],
  ['big_english_1_sb', 'big_english_1_sb_unit_03.json', 'big-english/big_english_1_sb/batches/unit_03.json', 'Unit 3', 'verified'],
  ['big_english_1_sb', 'big_english_1_sb_unit_04.json', 'big-english/big_english_1_sb/batches/unit_04.json', 'Unit 4', 'verified'],
  ['big_english_1_sb', 'big_english_1_sb_unit_05.json', 'big-english/big_english_1_sb/batches/unit_05.json', 'Unit 5', 'verified'],
  ['big_english_1_sb', 'big_english_1_sb_unit_06.json', 'big-english/big_english_1_sb/batches/unit_06.json', 'Unit 6', 'verified'],
  ['big_english_1_sb', 'big_english_1_sb_unit_07.json', 'big-english/big_english_1_sb/batches/unit_07.json', 'Unit 7', 'verified'],
  ['big_english_1_sb', 'big_english_1_sb_unit_08.json', 'big-english/big_english_1_sb/batches/unit_08.json', 'Unit 8', 'verified'],
  ['big_english_1_sb', 'big_english_1_sb_unit_09.json', 'big-english/big_english_1_sb/batches/unit_09.json', 'Unit 9', 'verified'],
  ['big_english_1_wb', 'big_english_1_wb_unit_01.json', 'big-english/big_english_1_wb/batches/unit_01.json', 'Unit 1', 'pending'],
  ['big_english_1_wb', 'big_english_1_wb_unit_02.json', 'big-english/big_english_1_wb/batches/unit_02.json', 'Unit 2', 'pending'],
  ['big_english_1_wb', 'big_english_1_wb_unit_03.json', 'big-english/big_english_1_wb/batches/unit_03.json', 'Unit 3', 'pending'],
  ['big_english_1_wb', 'big_english_1_wb_unit_04.json', 'big-english/big_english_1_wb/batches/unit_04.json', 'Unit 4', 'pending'],
  ['big_english_1_wb', 'big_english_1_wb_unit_05.json', 'big-english/big_english_1_wb/batches/unit_05.json', 'Unit 5', 'pending'],
  ['big_english_1_wb', 'big_english_1_wb_unit_06.json', 'big-english/big_english_1_wb/batches/unit_06.json', 'Unit 6', 'pending'],
  ['big_english_1_wb', 'big_english_1_wb_unit_07.json', 'big-english/big_english_1_wb/batches/unit_07.json', 'Unit 7', 'pending'],
  ['big_english_1_wb', 'big_english_1_wb_unit_08.json', 'big-english/big_english_1_wb/batches/unit_08.json', 'Unit 8', 'pending'],
  ['big_english_1_wb', 'big_english_1_wb_unit_09.json', 'big-english/big_english_1_wb/batches/unit_09.json', 'Unit 9', 'pending'],
  ['big_english_2_sb', 'big_english_2_sb_unit_01.json', 'big-english/big_english_2_sb/batches/unit_01.json', 'Unit 1', 'verified'],
  ['big_english_2_sb', 'big_english_2_sb_unit_02.json', 'big-english/big_english_2_sb/batches/unit_02.json', 'Unit 2', 'verified'],
  ['big_english_2_sb', 'big_english_2_sb_unit_03.json', 'big-english/big_english_2_sb/batches/unit_03.json', 'Unit 3', 'verified'],
  ['big_english_2_sb', 'big_english_2_sb_unit_04.json', 'big-english/big_english_2_sb/batches/unit_04.json', 'Unit 4', 'verified'],
  ['big_english_2_sb', 'big_english_2_sb_unit_05.json', 'big-english/big_english_2_sb/batches/unit_05.json', 'Unit 5', 'verified'],
  ['big_english_2_sb', 'big_english_2_sb_unit_06.json', 'big-english/big_english_2_sb/batches/unit_06.json', 'Unit 6', 'verified'],
  ['big_english_2_sb', 'big_english_2_sb_unit_07.json', 'big-english/big_english_2_sb/batches/unit_07.json', 'Unit 7', 'verified'],
  ['big_english_2_sb', 'big_english_2_sb_unit_08.json', 'big-english/big_english_2_sb/batches/unit_08.json', 'Unit 8', 'verified'],
  ['big_english_2_sb', 'big_english_2_sb_unit_09.json', 'big-english/big_english_2_sb/batches/unit_09.json', 'Unit 9', 'verified'],
  ['big_english_2_wb', 'big_english_2_wb_unit_01.json', 'big-english/big_english_2_wb/batches/unit_01.json', 'Unit 1', 'pending'],
  ['big_english_2_wb', 'big_english_2_wb_unit_02.json', 'big-english/big_english_2_wb/batches/unit_02.json', 'Unit 2', 'pending'],
  ['big_english_2_wb', 'big_english_2_wb_unit_03.json', 'big-english/big_english_2_wb/batches/unit_03.json', 'Unit 3', 'pending'],
  ['big_english_2_wb', 'big_english_2_wb_unit_04.json', 'big-english/big_english_2_wb/batches/unit_04.json', 'Unit 4', 'pending'],
  ['big_english_2_wb', 'big_english_2_wb_unit_05.json', 'big-english/big_english_2_wb/batches/unit_05.json', 'Unit 5', 'pending'],
  ['big_english_2_wb', 'big_english_2_wb_unit_06.json', 'big-english/big_english_2_wb/batches/unit_06.json', 'Unit 6', 'pending'],
  ['big_english_2_wb', 'big_english_2_wb_unit_07.json', 'big-english/big_english_2_wb/batches/unit_07.json', 'Unit 7', 'pending'],
  ['big_english_2_wb', 'big_english_2_wb_unit_08.json', 'big-english/big_english_2_wb/batches/unit_08.json', 'Unit 8', 'pending'],
  ['big_english_2_wb', 'big_english_2_wb_unit_09.json', 'big-english/big_english_2_wb/batches/unit_09.json', 'Unit 9', 'pending'],
  ['big_english_3_sb', 'big_english_3_sb_unit_01.json', 'big-english/big_english_3_sb/batches/unit_01.json', 'Unit 1', 'pending'],
  ['big_english_3_sb', 'big_english_3_sb_unit_02.json', 'big-english/big_english_3_sb/batches/unit_02.json', 'Unit 2', 'pending'],
  ['big_english_3_sb', 'big_english_3_sb_unit_03.json', 'big-english/big_english_3_sb/batches/unit_03.json', 'Unit 3', 'pending'],
  ['big_english_3_sb', 'big_english_3_sb_unit_04.json', 'big-english/big_english_3_sb/batches/unit_04.json', 'Unit 4', 'pending'],
  ['big_english_3_sb', 'big_english_3_sb_unit_05.json', 'big-english/big_english_3_sb/batches/unit_05.json', 'Unit 5', 'pending'],
  ['big_english_3_sb', 'big_english_3_sb_unit_06.json', 'big-english/big_english_3_sb/batches/unit_06.json', 'Unit 6', 'pending'],
  ['big_english_3_sb', 'big_english_3_sb_unit_07.json', 'big-english/big_english_3_sb/batches/unit_07.json', 'Unit 7', 'pending'],
  ['big_english_3_sb', 'big_english_3_sb_unit_08.json', 'big-english/big_english_3_sb/batches/unit_08.json', 'Unit 8', 'pending'],
  ['big_english_3_sb', 'big_english_3_sb_unit_09.json', 'big-english/big_english_3_sb/batches/unit_09.json', 'Unit 9', 'pending'],
  ['big_english_3_wb', 'big_english_3_wb_unit_01.json', 'big-english/big_english_3_wb/batches/unit_01.json', 'Unit 1', 'pending'],
  ['big_english_3_wb', 'big_english_3_wb_unit_02.json', 'big-english/big_english_3_wb/batches/unit_02.json', 'Unit 2', 'pending'],
  ['big_english_3_wb', 'big_english_3_wb_unit_03.json', 'big-english/big_english_3_wb/batches/unit_03.json', 'Unit 3', 'pending'],
  ['big_english_3_wb', 'big_english_3_wb_unit_04.json', 'big-english/big_english_3_wb/batches/unit_04.json', 'Unit 4', 'pending'],
  ['big_english_3_wb', 'big_english_3_wb_unit_05.json', 'big-english/big_english_3_wb/batches/unit_05.json', 'Unit 5', 'pending'],
  ['big_english_3_wb', 'big_english_3_wb_unit_06.json', 'big-english/big_english_3_wb/batches/unit_06.json', 'Unit 6', 'pending'],
  ['big_english_3_wb', 'big_english_3_wb_unit_07.json', 'big-english/big_english_3_wb/batches/unit_07.json', 'Unit 7', 'pending'],
  ['big_english_3_wb', 'big_english_3_wb_unit_08.json', 'big-english/big_english_3_wb/batches/unit_08.json', 'Unit 8', 'pending'],
  ['big_english_3_wb', 'big_english_3_wb_unit_09.json', 'big-english/big_english_3_wb/batches/unit_09.json', 'Unit 9', 'pending'],
  ['big_english_4_sb', 'big_english_4_sb_unit_01.json', 'big-english/big_english_4_sb/batches/unit_01.json', 'Unit 1', 'pending'],
  ['big_english_4_sb', 'big_english_4_sb_unit_02.json', 'big-english/big_english_4_sb/batches/unit_02.json', 'Unit 2', 'pending'],
  ['big_english_4_sb', 'big_english_4_sb_unit_03.json', 'big-english/big_english_4_sb/batches/unit_03.json', 'Unit 3', 'pending'],
  ['big_english_4_sb', 'big_english_4_sb_unit_04.json', 'big-english/big_english_4_sb/batches/unit_04.json', 'Unit 4', 'pending'],
  ['big_english_4_sb', 'big_english_4_sb_unit_05.json', 'big-english/big_english_4_sb/batches/unit_05.json', 'Unit 5', 'pending'],
  ['big_english_4_sb', 'big_english_4_sb_unit_06.json', 'big-english/big_english_4_sb/batches/unit_06.json', 'Unit 6', 'pending'],
  ['big_english_4_sb', 'big_english_4_sb_unit_07.json', 'big-english/big_english_4_sb/batches/unit_07.json', 'Unit 7', 'pending'],
  ['big_english_4_sb', 'big_english_4_sb_unit_08.json', 'big-english/big_english_4_sb/batches/unit_08.json', 'Unit 8', 'pending'],
  ['big_english_4_sb', 'big_english_4_sb_unit_09.json', 'big-english/big_english_4_sb/batches/unit_09.json', 'Unit 9', 'pending'],
  ['big_english_4_wb', 'big_english_4_wb_unit_01.json', 'big-english/big_english_4_wb/batches/unit_01.json', 'Unit 1', 'pending'],
  ['big_english_4_wb', 'big_english_4_wb_unit_02.json', 'big-english/big_english_4_wb/batches/unit_02.json', 'Unit 2', 'pending'],
  ['big_english_4_wb', 'big_english_4_wb_unit_03.json', 'big-english/big_english_4_wb/batches/unit_03.json', 'Unit 3', 'pending'],
  ['big_english_4_wb', 'big_english_4_wb_unit_04.json', 'big-english/big_english_4_wb/batches/unit_04.json', 'Unit 4', 'pending'],
  ['big_english_4_wb', 'big_english_4_wb_unit_05.json', 'big-english/big_english_4_wb/batches/unit_05.json', 'Unit 5', 'pending'],
  ['big_english_4_wb', 'big_english_4_wb_unit_06.json', 'big-english/big_english_4_wb/batches/unit_06.json', 'Unit 6', 'pending'],
  ['big_english_4_wb', 'big_english_4_wb_unit_07.json', 'big-english/big_english_4_wb/batches/unit_07.json', 'Unit 7', 'pending'],
  ['big_english_4_wb', 'big_english_4_wb_unit_08.json', 'big-english/big_english_4_wb/batches/unit_08.json', 'Unit 8', 'pending'],
  ['big_english_4_wb', 'big_english_4_wb_unit_09.json', 'big-english/big_english_4_wb/batches/unit_09.json', 'Unit 9', 'pending'],
  ['big_english_5_sb', 'big_english_5_sb_unit_01.json', 'big-english/big_english_5_sb/batches/unit_01.json', 'Unit 1', 'pending'],
  ['big_english_5_sb', 'big_english_5_sb_unit_02.json', 'big-english/big_english_5_sb/batches/unit_02.json', 'Unit 2', 'pending'],
  ['big_english_5_sb', 'big_english_5_sb_unit_03.json', 'big-english/big_english_5_sb/batches/unit_03.json', 'Unit 3', 'pending'],
  ['big_english_5_sb', 'big_english_5_sb_unit_04.json', 'big-english/big_english_5_sb/batches/unit_04.json', 'Unit 4', 'pending'],
  ['big_english_5_sb', 'big_english_5_sb_unit_05.json', 'big-english/big_english_5_sb/batches/unit_05.json', 'Unit 5', 'pending'],
  ['big_english_5_sb', 'big_english_5_sb_unit_06.json', 'big-english/big_english_5_sb/batches/unit_06.json', 'Unit 6', 'pending'],
  ['big_english_5_sb', 'big_english_5_sb_unit_07.json', 'big-english/big_english_5_sb/batches/unit_07.json', 'Unit 7', 'pending'],
  ['big_english_5_sb', 'big_english_5_sb_unit_08.json', 'big-english/big_english_5_sb/batches/unit_08.json', 'Unit 8', 'pending'],
  ['big_english_5_sb', 'big_english_5_sb_unit_09.json', 'big-english/big_english_5_sb/batches/unit_09.json', 'Unit 9', 'pending'],
  ['big_english_5_wb', 'big_english_5_wb_unit_01.json', 'big-english/big_english_5_wb/batches/unit_01.json', 'Unit 1', 'pending'],
  ['big_english_5_wb', 'big_english_5_wb_unit_02.json', 'big-english/big_english_5_wb/batches/unit_02.json', 'Unit 2', 'pending'],
  ['big_english_5_wb', 'big_english_5_wb_unit_03.json', 'big-english/big_english_5_wb/batches/unit_03.json', 'Unit 3', 'pending'],
  ['big_english_5_wb', 'big_english_5_wb_unit_04.json', 'big-english/big_english_5_wb/batches/unit_04.json', 'Unit 4', 'pending'],
  ['big_english_5_wb', 'big_english_5_wb_unit_05.json', 'big-english/big_english_5_wb/batches/unit_05.json', 'Unit 5', 'pending'],
  ['big_english_5_wb', 'big_english_5_wb_unit_06.json', 'big-english/big_english_5_wb/batches/unit_06.json', 'Unit 6', 'pending'],
  ['big_english_5_wb', 'big_english_5_wb_unit_07.json', 'big-english/big_english_5_wb/batches/unit_07.json', 'Unit 7', 'pending'],
  ['big_english_5_wb', 'big_english_5_wb_unit_08.json', 'big-english/big_english_5_wb/batches/unit_08.json', 'Unit 8', 'pending'],
  ['big_english_5_wb', 'big_english_5_wb_unit_09.json', 'big-english/big_english_5_wb/batches/unit_09.json', 'Unit 9', 'pending'],
  ['big_english_6_sb', 'big_english_6_sb_unit_01.json', 'big-english/big_english_6_sb/batches/unit_01.json', 'Unit 1', 'pending'],
  ['big_english_6_sb', 'big_english_6_sb_unit_02.json', 'big-english/big_english_6_sb/batches/unit_02.json', 'Unit 2', 'pending'],
  ['big_english_6_sb', 'big_english_6_sb_unit_03.json', 'big-english/big_english_6_sb/batches/unit_03.json', 'Unit 3', 'pending'],
  ['big_english_6_sb', 'big_english_6_sb_unit_04.json', 'big-english/big_english_6_sb/batches/unit_04.json', 'Unit 4', 'pending'],
  ['big_english_6_sb', 'big_english_6_sb_unit_05.json', 'big-english/big_english_6_sb/batches/unit_05.json', 'Unit 5', 'pending'],
  ['big_english_6_sb', 'big_english_6_sb_unit_06.json', 'big-english/big_english_6_sb/batches/unit_06.json', 'Unit 6', 'pending'],
  ['big_english_6_sb', 'big_english_6_sb_unit_07.json', 'big-english/big_english_6_sb/batches/unit_07.json', 'Unit 7', 'pending'],
  ['big_english_6_sb', 'big_english_6_sb_unit_08.json', 'big-english/big_english_6_sb/batches/unit_08.json', 'Unit 8', 'pending'],
  ['big_english_6_sb', 'big_english_6_sb_unit_09.json', 'big-english/big_english_6_sb/batches/unit_09.json', 'Unit 9', 'pending'],
  ['big_english_6_wb', 'big_english_6_wb_unit_01.json', 'big-english/big_english_6_wb/batches/unit_01.json', 'Unit 1', 'pending'],
  ['big_english_6_wb', 'big_english_6_wb_unit_02.json', 'big-english/big_english_6_wb/batches/unit_02.json', 'Unit 2', 'pending'],
  ['big_english_6_wb', 'big_english_6_wb_unit_03.json', 'big-english/big_english_6_wb/batches/unit_03.json', 'Unit 3', 'pending'],
  ['big_english_6_wb', 'big_english_6_wb_unit_04.json', 'big-english/big_english_6_wb/batches/unit_04.json', 'Unit 4', 'pending'],
  ['big_english_6_wb', 'big_english_6_wb_unit_05.json', 'big-english/big_english_6_wb/batches/unit_05.json', 'Unit 5', 'pending'],
  ['big_english_6_wb', 'big_english_6_wb_unit_06.json', 'big-english/big_english_6_wb/batches/unit_06.json', 'Unit 6', 'pending'],
  ['big_english_6_wb', 'big_english_6_wb_unit_07.json', 'big-english/big_english_6_wb/batches/unit_07.json', 'Unit 7', 'pending'],
  ['big_english_6_wb', 'big_english_6_wb_unit_08.json', 'big-english/big_english_6_wb/batches/unit_08.json', 'Unit 8', 'pending'],
  ['big_english_6_wb', 'big_english_6_wb_unit_09.json', 'big-english/big_english_6_wb/batches/unit_09.json', 'Unit 9', 'pending'],
  ['reach_higher_2a', 'rh2a_sb_unit1.json', 'reach-higher/reach_higher_2a/batches/unit_01.json', 'Unit 1', 'verified'],
  ['reach_higher_2a', 'rh2a_sb_unit2.json', 'reach-higher/reach_higher_2a/batches/unit_02.json', 'Unit 2', 'verified'],
  ['reach_higher_2a', 'rh2a_sb_unit3.json', 'reach-higher/reach_higher_2a/batches/unit_03.json', 'Unit 3', 'verified'],
  ['reach_higher_2a', 'rh2a_sb_unit4.json', 'reach-higher/reach_higher_2a/batches/unit_04.json', 'Unit 4', 'verified'],
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

const bookIdCache = new Map()

async function resolveBookUuid(bookKey) {
  if (bookIdCache.has(bookKey)) return bookIdCache.get(bookKey)
  const { data, error } = await supabase
    .from('books')
    .select('id')
    .eq('book_id', bookKey)
    .maybeSingle()
  if (error || !data?.id) {
    throw new Error(error?.message || `No books row for book_id=${bookKey}`)
  }
  bookIdCache.set(bookKey, data.id)
  return data.id
}

const onlyFilter = (process.env.UPLOAD_ONLY || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const selected = onlyFilter.length
  ? BATCHES.filter(([bookKey, filename, storagePath]) =>
      onlyFilter.some(
        (token) =>
          filename === token ||
          filename.includes(token) ||
          storagePath === token ||
          `${bookKey}/${filename}`.includes(token),
      ),
    )
  : BATCHES

if (onlyFilter.length && selected.length === 0) {
  console.error(`UPLOAD_ONLY matched no batches: ${onlyFilter.join(', ')}`)
  process.exit(1)
}

let uploaded = 0
let failed = 0
let skipped = 0

for (const [bookKey, filename, storagePath, label, status] of selected) {
  const localPath = join(root, 'data', 'phase1', bookKey, filename)
  if (!existsSync(localPath)) {
    if (onlyFilter.length) {
      console.error(`MISSING ${localPath}`)
      failed += 1
    } else {
      console.warn(`SKIP   missing local file ${localPath}`)
      skipped += 1
    }
    continue
  }

  const body = readFileSync(localPath)
  const size = statSync(localPath).size
  // Reject empty placeholders (`{}`) and truncated Studio dumps.
  if (size < 1000) {
    console.error(`FAIL   ${localPath}: file too small (${size} bytes) — refusing to upload placeholder`)
    failed += 1
    continue
  }
  try {
    const parsed = JSON.parse(body.toString('utf8'))
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.pages) || parsed.pages.length === 0) {
      console.error(`FAIL   ${localPath}: JSON missing non-empty pages[]`)
      failed += 1
      continue
    }
  } catch (err) {
    console.error(
      `FAIL   ${localPath}: invalid JSON (${err instanceof Error ? err.message : err})`,
    )
    failed += 1
    continue
  }

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

  try {
    const bookUuid = await resolveBookUuid(bookKey)
    const { error: metaError } = await supabase.from('book_files').upsert(
      {
        book_id: bookUuid,
        file_type: 'batch_json',
        bucket,
        storage_path: storagePath,
        filename,
        mime_type: 'application/json',
        file_size: size,
        label,
        status,
      },
      { onConflict: 'bucket,storage_path' },
    )

    if (metaError) {
      console.warn(
        `WARN   uploaded but could not upsert book_files: ${storagePath} (${metaError.message})`,
      )
    }
  } catch (err) {
    console.warn(
      `WARN   uploaded but could not resolve/upsert book_files: ${storagePath} (${err instanceof Error ? err.message : err})`,
    )
  }

  console.log(`OK     ${storagePath} (${size} bytes)`)
  uploaded += 1
}

console.log(
  `\nDone. uploaded=${uploaded} failed=${failed} skipped=${skipped} selected=${selected.length}`,
)
if (failed > 0) process.exit(1)
