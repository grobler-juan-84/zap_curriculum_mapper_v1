/**
 * Normalize unit batch book_id / unit_id fields to catalog identity.
 * Entity IDs preserved. Does not rewrite target_book_id (may be cross-book).
 *
 * Usage:
 *   node scripts/normalize_be_units.mjs big_english_5_sb
 *   node scripts/normalize_be_units.mjs big_english_5_sb 1 2 3
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const catalog = process.argv[2]
if (!catalog) {
  console.error('Usage: node scripts/normalize_be_units.mjs <catalog_book_id> [units...]')
  process.exit(1)
}
const dir = resolve(__dirname, '../data/phase1', catalog)
const units = process.argv
  .slice(3)
  .map((s) => Number.parseInt(s, 10))
  .filter((n) => Number.isFinite(n) && n >= 1 && n <= 9)
const targets = units.length ? units : [1, 2, 3, 4, 5, 6, 7, 8, 9]

function rewrite(node, unitId) {
  if (Array.isArray(node)) {
    for (const item of node) rewrite(item, unitId)
    return
  }
  if (!node || typeof node !== 'object') return
  for (const [k, v] of Object.entries(node)) {
    if ((k === 'book_id' || k === 'source_book_id') && typeof v === 'string' && v) {
      node[k] = catalog
    } else if (k === 'unit_id' && typeof v === 'string' && v) {
      node[k] = unitId
    } else {
      rewrite(v, unitId)
    }
  }
}

for (const n of targets) {
  const nn = String(n).padStart(2, '0')
  const unitId = `${catalog}_unit_${nn}`
  const path = resolve(dir, `${catalog}_unit_${nn}.json`)
  if (!existsSync(path)) throw new Error(`Missing ${path}`)
  const data = JSON.parse(readFileSync(path, 'utf8'))
  rewrite(data, unitId)
  if (data.batch && typeof data.batch === 'object') {
    data.batch.batch_id = unitId
    data.batch.unit_id = unitId
  }
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  const pages = (data.pages || []).map((p) => p.printed_page).filter((x) => typeof x === 'number')
  console.log(
    `OK ${unitId}: pages ${Math.min(...pages)}-${Math.max(...pages)} (${pages.length}), title ${data.units?.[0]?.title}`,
  )
}
