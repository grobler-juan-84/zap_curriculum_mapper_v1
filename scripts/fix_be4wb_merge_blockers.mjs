/**
 * Fix BE4-WB merge blockers:
 * - Units 1 / 2 / 6 / 7 / 9: extend printed ranges to include rear grammar pages
 *   (134 / 135 / 139 / 140 / 142) so batch D008 passes; canonical overlap warnings accepted.
 * - Remap Studio unit-shorthand relationship endpoints to catalog unit_ids.
 * - Tag known Student Book cross-refs with target_book_id = big_english_4_sb.
 *
 * Usage: node scripts/fix_be4wb_merge_blockers.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const catalog = 'big_english_4_wb'
const localDir = join(root, 'data', 'phase1', catalog)
const grammarUnits = [1, 2, 6, 7, 9]
const sbCatalog = 'big_english_4_sb'

const UNIT_ALIAS_MAP = {
  bep4_wb_u01: `${catalog}_unit_01`,
  bep4_wb_u02: `${catalog}_unit_02`,
  bep4_wb_u03: `${catalog}_unit_03`,
  bep4_wb_u04: `${catalog}_unit_04`,
  bep4_wb_u05: `${catalog}_unit_05`,
  bep4_wb_u06: `${catalog}_unit_06`,
  bep4_wb_u07: `${catalog}_unit_07`,
  bep4_wb_u08: `${catalog}_unit_08`,
  bep4_wb_u09: `${catalog}_unit_09`,
  bep_4_wb_u01: `${catalog}_unit_01`,
  bep_4_wb_u02: `${catalog}_unit_02`,
  bep_4_wb_u03: `${catalog}_unit_03`,
  bep_4_wb_u04: `${catalog}_unit_04`,
  bep_4_wb_u05: `${catalog}_unit_05`,
  bep_4_wb_u06: `${catalog}_unit_06`,
  bep_4_wb_u07: `${catalog}_unit_07`,
  bep_4_wb_u08: `${catalog}_unit_08`,
  bep_4_wb_u09: `${catalog}_unit_09`,
  bep_wb_4_u01: `${catalog}_unit_01`,
  bep_wb_4_u02: `${catalog}_unit_02`,
  bep_wb_4_u03: `${catalog}_unit_03`,
  bep_wb_4_u04: `${catalog}_unit_04`,
  bep_wb_4_u05: `${catalog}_unit_05`,
  bep_wb_4_u06: `${catalog}_unit_06`,
  bep_wb_4_u7: `${catalog}_unit_07`,
  bep_wb_4_u07: `${catalog}_unit_07`,
  bep_wb_4_u08: `${catalog}_unit_08`,
  bep_wb_4_u09: `${catalog}_unit_09`,
  be4plus_wb_u01: `${catalog}_unit_01`,
  be4plus_wb_u02: `${catalog}_unit_02`,
  be4plus_wb_u03: `${catalog}_unit_03`,
  be4plus_wb_u04: `${catalog}_unit_04`,
  be4plus_wb_u05: `${catalog}_unit_05`,
  be4plus_wb_u06: `${catalog}_unit_06`,
  be4plus_wb_u07: `${catalog}_unit_07`,
  be4plus_wb_u08: `${catalog}_unit_08`,
  be4plus_wb_u09: `${catalog}_unit_09`,
  bep4_wb_unit_01: `${catalog}_unit_01`,
  bep4_wb_unit_02: `${catalog}_unit_02`,
  bep4_wb_unit_03: `${catalog}_unit_03`,
  bep4_wb_unit_04: `${catalog}_unit_04`,
  bep4_wb_unit_05: `${catalog}_unit_05`,
  bep4_wb_unit_06: `${catalog}_unit_06`,
  bep4_wb_unit_07: `${catalog}_unit_07`,
  bep4_wb_unit_08: `${catalog}_unit_08`,
  bep4_wb_unit_09: `${catalog}_unit_09`,
}

const SB_ENDPOINT_HINTS = [
  /^bep4_sb_/i,
  /^bep_4_sb_/i,
  /^be4plus_sb/i,
  /^student_book_/i,
]

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

function pageNums(pages, field) {
  return pages
    .map((p) => p?.[field])
    .filter((n) => typeof n === 'number' && Number.isFinite(n))
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

let totalAliasRewrites = 0
let totalSbTagged = 0

for (let n = 1; n <= 9; n++) {
  const nn = String(n).padStart(2, '0')
  const localPath = join(localDir, `${catalog}_unit_${nn}.json`)
  if (!existsSync(localPath)) throw new Error(`Missing ${localPath}`)
  const dataset = JSON.parse(readFileSync(localPath, 'utf8'))
  const mainUnitId = `${catalog}_unit_${nn}`
  let changed = false

  if (grammarUnits.includes(n)) {
    const pages = dataset.pages || []
    const printed = pageNums(pages, 'printed_page')
    const pdf = pageNums(pages, 'pdf_page')
    const printedEnd = Math.max(...printed)
    const printedStart = Math.min(...printed)
    const pdfEnd = pdf.length ? Math.max(...pdf) : printedEnd
    const pdfStart = pdf.length ? Math.min(...pdf) : printedStart

    dataset.units = (dataset.units || []).filter(
      (u) => !String(u?.unit_id || '').endsWith('_grammar'),
    )
    const mainUnit = dataset.units.find((u) => u.unit_id === mainUnitId) ?? dataset.units[0]
    if (!mainUnit) throw new Error(`U${nn}: missing unit`)
    mainUnit.printed_page_start = printedStart
    mainUnit.printed_page_end = printedEnd
    if ('pdf_page_start' in mainUnit) mainUnit.pdf_page_start = pdfStart
    if ('pdf_page_end' in mainUnit) mainUnit.pdf_page_end = pdfEnd

    for (const page of pages) {
      page.unit_id = mainUnitId
    }

    if (dataset.batch && typeof dataset.batch === 'object') {
      dataset.batch.printed_page_start = printedStart
      dataset.batch.printed_page_end = printedEnd
      dataset.batch.pdf_page_start = pdfStart
      dataset.batch.pdf_page_end = pdfEnd
      dataset.batch.unit_id = mainUnitId
    }

    if (dataset.book && typeof dataset.book === 'object') {
      dataset.book.printed_page_start = printedStart
      dataset.book.printed_page_end = printedEnd
    }

    changed = true
    console.log(`OK U${nn}: printed ${printedStart}–${printedEnd} (grammar-inclusive)`)
  }

  for (const rel of dataset.relationships || []) {
    for (const field of ['source_entity_id', 'target_entity_id']) {
      const id = rel[field]
      if (typeof id === 'string' && UNIT_ALIAS_MAP[id]) {
        rel[field] = UNIT_ALIAS_MAP[id]
        totalAliasRewrites += 1
        changed = true
      }
    }
    const target = rel.target_entity_id
    if (
      typeof target === 'string' &&
      SB_ENDPOINT_HINTS.some((re) => re.test(target)) &&
      !rel.target_book_id
    ) {
      rel.target_book_id = sbCatalog
      totalSbTagged += 1
      changed = true
    }
  }

  if (!changed) continue
  const body = `${JSON.stringify(dataset, null, 2)}\n`
  writeFileSync(localPath, body, 'utf8')
  await uploadUnit(nn, body)
}

console.log(
  `Done. aliasRewrites=${totalAliasRewrites} sbCrossRefsTagged=${totalSbTagged}`,
)
console.log(`Re-run: node scripts/merge_canonical_book.mjs ${catalog}`)
