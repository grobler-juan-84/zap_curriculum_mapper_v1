/**
 * Fix BE4-SB merge blockers: rewrite relationship endpoints that still use
 * Studio unit aliases (bep4_sb_u04, bep_4_sb_u09) to catalog unit_ids.
 *
 * Usage: node scripts/fix_be4sb_merge_blockers.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const catalog = 'big_english_4_sb'
const localDir = join(root, 'data', 'phase1', catalog)

/** Studio unit shorthand → catalog unit_id */
const UNIT_ALIAS_MAP = {
  bep4_sb_u01: `${catalog}_unit_01`,
  bep4_sb_u02: `${catalog}_unit_02`,
  bep4_sb_u03: `${catalog}_unit_03`,
  bep4_sb_u04: `${catalog}_unit_04`,
  bep4_sb_u05: `${catalog}_unit_05`,
  bep4_sb_u06: `${catalog}_unit_06`,
  bep4_sb_u07: `${catalog}_unit_07`,
  bep4_sb_u08: `${catalog}_unit_08`,
  bep4_sb_u09: `${catalog}_unit_09`,
  bep_4_sb_u01: `${catalog}_unit_01`,
  bep_4_sb_u02: `${catalog}_unit_02`,
  bep_4_sb_u03: `${catalog}_unit_03`,
  bep_4_sb_u04: `${catalog}_unit_04`,
  bep_4_sb_u05: `${catalog}_unit_05`,
  bep_4_sb_u06: `${catalog}_unit_06`,
  bep_4_sb_u07: `${catalog}_unit_07`,
  bep_4_sb_u08: `${catalog}_unit_08`,
  bep_4_sb_u09: `${catalog}_unit_09`,
}

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

async function uploadUnit(nn, body) {
  const storagePath = `big-english/${catalog}/batches/unit_${nn}.json`
  await supabase.storage.from('book-datasets').remove([storagePath])
  const { error } = await supabase.storage
    .from('book-datasets')
    .upload(storagePath, Buffer.from(body, 'utf8'), {
      contentType: 'application/json',
      upsert: true,
    })
  if (error) throw new Error(`upload ${storagePath}: ${error.message}`)
}

let totalRewrites = 0
for (let n = 1; n <= 9; n++) {
  const nn = String(n).padStart(2, '0')
  const localPath = join(localDir, `${catalog}_unit_${nn}.json`)
  if (!existsSync(localPath)) continue
  const dataset = JSON.parse(readFileSync(localPath, 'utf8'))
  let rewrites = 0
  for (const rel of dataset.relationships || []) {
    for (const field of ['source_entity_id', 'target_entity_id']) {
      const id = rel[field]
      if (typeof id === 'string' && UNIT_ALIAS_MAP[id]) {
        rel[field] = UNIT_ALIAS_MAP[id]
        rewrites += 1
      }
    }
  }
  if (!rewrites) continue
  totalRewrites += rewrites
  const body = `${JSON.stringify(dataset, null, 2)}\n`
  writeFileSync(localPath, body, 'utf8')
  await uploadUnit(nn, body)
  console.log(`OK U${nn}: rewrote ${rewrites} relationship endpoint(s)`)
}

console.log(`Done. total endpoint rewrites=${totalRewrites}`)
console.log('Re-run: node scripts/merge_canonical_book.mjs big_english_4_sb')
