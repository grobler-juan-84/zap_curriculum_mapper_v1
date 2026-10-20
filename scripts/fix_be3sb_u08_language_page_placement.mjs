/**
 * Correct BE3-SB Unit 8 language page_id misplacements exposed by Chalkie
 * screenshot review:
 *   bep3_sb_lang_08_01 / 08_02  p.130 → p.132  (Language in Action Activity 8)
 *   bep3_sb_lang_08_03 / 08_04  p.134 → p.136  (Grammar box on Grammar spread)
 *
 * Patches local unit batch, uploads to Storage as verified, then remarges
 * canonical via merge_canonical_book.mjs.
 *
 * Usage (from repo root):
 *   node scripts/fix_be3sb_u08_language_page_placement.mjs
 */

import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const bucket = 'book-datasets'
const bookKey = 'big_english_3_sb'
const localBatchPath = join(
  root,
  'data/phase1/big_english_3_sb/big_english_3_sb_unit_08.json',
)
const storagePath = 'big-english/big_english_3_sb/batches/unit_08.json'

const CORRECTIONS = {
  bep3_sb_lang_08_01: 'bep3_sb_p132',
  bep3_sb_lang_08_02: 'bep3_sb_p132',
  bep3_sb_lang_08_03: 'bep3_sb_p136',
  bep3_sb_lang_08_04: 'bep3_sb_p136',
}

function loadEnv(path) {
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

loadEnv(resolve(root, 'app', '.env.local'))
loadEnv(resolve(root, '.env.local'))
loadEnv(resolve(root, '.env'))

const url = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim()
const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
if (!url || !key) {
  console.error('Missing Supabase URL or SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}

if (!existsSync(localBatchPath)) {
  console.error(`Missing local batch: ${localBatchPath}`)
  process.exit(1)
}

const batch = JSON.parse(readFileSync(localBatchPath, 'utf8'))
const language = Array.isArray(batch.language) ? batch.language : []
const pageIds = new Set(
  (Array.isArray(batch.pages) ? batch.pages : [])
    .map((row) => row?.page_id)
    .filter((id) => typeof id === 'string'),
)

const changes = []
for (const [languageId, targetPageId] of Object.entries(CORRECTIONS)) {
  if (!pageIds.has(targetPageId)) {
    console.error(`Target page_id missing from batch: ${targetPageId}`)
    process.exit(1)
  }
  const row = language.find((entry) => entry?.language_id === languageId)
  if (!row) {
    console.error(`Language record not found: ${languageId}`)
    process.exit(1)
  }
  const before = row.page_id
  if (before === targetPageId) {
    console.log(`OK     ${languageId} already on ${targetPageId}`)
    continue
  }
  row.page_id = targetPageId
  changes.push({ languageId, before, after: targetPageId })
  console.log(`FIX    ${languageId}: ${before} → ${targetPageId}`)
}

if (changes.length === 0) {
  console.log('No local page_id changes needed; continuing to upload/remarge.')
}

const body = `${JSON.stringify(batch, null, 2)}\n`
writeFileSync(localBatchPath, body, 'utf8')
console.log(`Wrote local ${localBatchPath}`)

const { createClient } = createRequire(resolve(root, 'app', 'package.json'))(
  '@supabase/supabase-js',
)
const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const { data: bookRow, error: bookError } = await supabase
  .from('books')
  .select('id')
  .eq('book_id', bookKey)
  .maybeSingle()
if (bookError || !bookRow?.id) {
  console.error(`Book not found: ${bookKey} (${bookError?.message ?? 'no row'})`)
  process.exit(1)
}

const uploadBody = Buffer.from(body, 'utf8')
const { error: uploadError } = await supabase.storage
  .from(bucket)
  .upload(storagePath, uploadBody, {
    contentType: 'application/json',
    upsert: true,
  })
if (uploadError) {
  console.error(`Upload failed: ${uploadError.message}`)
  process.exit(1)
}
console.log(`Uploaded ${bucket}/${storagePath}`)

const { error: upsertError } = await supabase.from('book_files').upsert(
  {
    book_id: bookRow.id,
    file_type: 'batch_json',
    bucket,
    storage_path: storagePath,
    filename: 'big_english_3_sb_unit_08.json',
    mime_type: 'application/json',
    file_size: statSync(localBatchPath).size,
    label: 'Unit 8',
    status: 'verified',
  },
  { onConflict: 'bucket,storage_path' },
)
if (upsertError) {
  console.error(`book_files upsert failed: ${upsertError.message}`)
  process.exit(1)
}
console.log('book_files status=verified for unit_08 batch')

console.log('Remerging canonical…')
const merge = spawnSync(
  process.execPath,
  [join(root, 'scripts/merge_canonical_book.mjs'), bookKey],
  { cwd: root, stdio: 'inherit', env: process.env },
)
if (merge.status !== 0) {
  console.error('merge_canonical_book.mjs failed')
  process.exit(merge.status ?? 1)
}

const canonical = JSON.parse(
  readFileSync(
    join(root, 'data/phase1/big_english_3_sb/canonical/v1.json'),
    'utf8',
  ),
)
for (const [languageId, targetPageId] of Object.entries(CORRECTIONS)) {
  const row = (canonical.language || []).find(
    (entry) => entry?.language_id === languageId,
  )
  if (!row || row.page_id !== targetPageId) {
    console.error(
      `Canonical check failed for ${languageId}: got ${row?.page_id ?? 'missing'}`,
    )
    process.exit(1)
  }
  console.log(`CHECK  canonical ${languageId} → ${row.page_id}`)
}

console.log('Done.')
