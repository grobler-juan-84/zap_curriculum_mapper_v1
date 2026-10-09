/**
 * Normalize BE3-SB Unit 7 (whole-unit Studio export) to catalog book_id / unit_id.
 * Entity IDs preserved. Usage: node scripts/normalize_be3sb_unit07.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const path = resolve(
  __dirname,
  '../data/phase1/big_english_3_sb/big_english_3_sb_unit_07.json',
)
const CATALOG = 'big_english_3_sb'
const UNIT_ID = 'big_english_3_sb_unit_07'

function rewrite(node) {
  if (Array.isArray(node)) {
    node.forEach(rewrite)
    return
  }
  if (!node || typeof node !== 'object') return
  for (const [k, v] of Object.entries(node)) {
    if ((k === 'book_id' || k === 'source_book_id' || k === 'target_book_id') && typeof v === 'string' && v) {
      node[k] = CATALOG
    } else if (k === 'unit_id' && typeof v === 'string' && v) {
      node[k] = UNIT_ID
    } else {
      rewrite(v)
    }
  }
}

const data = JSON.parse(readFileSync(path, 'utf8'))
rewrite(data)
if (data.batch && typeof data.batch === 'object') {
  data.batch.batch_id = UNIT_ID
  data.batch.unit_id = UNIT_ID
}
writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
const pages = (data.pages || []).map((p) => p.printed_page)
console.log(
  `OK ${UNIT_ID}: pages ${pages[0]}-${pages.at(-1)} (${pages.length}), title ${data.units?.[0]?.title}`,
)
