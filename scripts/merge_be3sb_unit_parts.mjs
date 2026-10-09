/**
 * Trial merge: combine BE3-SB split unit part JSON files into one unit batch each.
 *
 * Usage (from repo root):
 *   node scripts/merge_be3sb_unit_parts.mjs
 *   node scripts/merge_be3sb_unit_parts.mjs 4 5 6
 *
 * Writes:
 *   data/phase1/big_english_3_sb/big_english_3_sb_unit_0N.json
 *
 * Leaves *_p*-*.json part files in place. Does not rewrite entity IDs.
 * Normalizes book_id → catalog big_english_3_sb and unit_id → big_english_3_sb_unit_0N.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const dir = resolve(root, 'data/phase1/big_english_3_sb')
const CATALOG_BOOK_ID = 'big_english_3_sb'

const ARRAY_KEYS = [
  'pages',
  'vocabulary',
  'language',
  'activities',
  'continuous_text',
  'curriculum_components',
  'relationships',
  'extraction_issues',
  'schema_gaps',
]

const UNITS = [
  {
    unitNumber: 1,
    out: 'big_english_3_sb_unit_01.json',
    parts: [
      'big_english_3_sb_unit_01_p4-11.json',
      'big_english_3_sb_unit_01_p12-19.json',
    ],
  },
  {
    unitNumber: 2,
    out: 'big_english_3_sb_unit_02.json',
    parts: [
      'big_english_3_sb_unit_02_p20-27.json',
      'big_english_3_sb_unit_02_p28-35.json',
    ],
  },
  {
    unitNumber: 3,
    out: 'big_english_3_sb_unit_03.json',
    parts: [
      'big_english_3_sb_unit_03_p36-43.json',
      'big_english_3_sb_unit_03_p44-51.json',
    ],
  },
  {
    unitNumber: 4,
    out: 'big_english_3_sb_unit_04.json',
    parts: [
      'big_english_3_sb_unit_04_p58-65.json',
      'big_english_3_sb_unit_04_p66-73.json',
    ],
  },
  {
    unitNumber: 5,
    out: 'big_english_3_sb_unit_05.json',
    parts: [
      'big_english_3_sb_unit_05_p74-81.json',
      'big_english_3_sb_unit_05_p82-89.json',
    ],
  },
  {
    unitNumber: 6,
    out: 'big_english_3_sb_unit_06.json',
    parts: [
      'big_english_3_sb_unit_06_p90-97.json',
      'big_english_3_sb_unit_06_p98_105.json',
    ],
  },
]

function asArray(value) {
  return Array.isArray(value) ? value : []
}

function asRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value : null
}

function collectEntityIds(rootObj) {
  const ids = new Set()
  const walk = (node) => {
    if (Array.isArray(node)) {
      node.forEach(walk)
      return
    }
    if (!node || typeof node !== 'object') return
    for (const [k, v] of Object.entries(node)) {
      if (typeof v === 'string' && (k.endsWith('_id') || k === 'id') && k !== 'book_id') {
        ids.add(v)
      } else {
        walk(v)
      }
    }
  }
  walk(rootObj)
  return ids
}

function rewriteBookAndUnitIds(node, catalogBookId, unitId) {
  if (Array.isArray(node)) {
    for (const item of node) rewriteBookAndUnitIds(item, catalogBookId, unitId)
    return
  }
  if (!node || typeof node !== 'object') return
  for (const [k, v] of Object.entries(node)) {
    if (k === 'book_id' || k === 'source_book_id' || k === 'target_book_id') {
      if (typeof v === 'string' && v) node[k] = catalogBookId
    } else if (k === 'unit_id') {
      if (typeof v === 'string' && v) node[k] = unitId
    } else {
      rewriteBookAndUnitIds(v, catalogBookId, unitId)
    }
  }
}

function mergeUnit({ unitNumber, out, parts }) {
  const unitId = `${CATALOG_BOOK_ID}_unit_${String(unitNumber).padStart(2, '0')}`
  const loaded = []
  for (const name of parts) {
    const path = resolve(dir, name)
    if (!existsSync(path)) throw new Error(`Missing part file: ${path}`)
    loaded.push({ name, data: JSON.parse(readFileSync(path, 'utf8')) })
  }

  const first = loaded[0].data
  const last = loaded[loaded.length - 1].data
  const unitRecs = loaded.flatMap(({ data }) => asArray(data.units).map(asRecord)).filter(Boolean)
  const pages = loaded.flatMap(({ data }) => asArray(data.pages))
  const printed = pages
    .map((p) => asRecord(p)?.printed_page)
    .filter((n) => typeof n === 'number')
  const pdf = pages
    .map((p) => asRecord(p)?.pdf_page)
    .filter((n) => typeof n === 'number')

  const printedByPart = loaded.map(({ name, data }) => {
    const nums = asArray(data.pages)
      .map((p) => asRecord(p)?.printed_page)
      .filter((n) => typeof n === 'number')
    return { name, start: nums.length ? Math.min(...nums) : null, end: nums.length ? Math.max(...nums) : null }
  })
  for (let i = 0; i < printedByPart.length; i++) {
    for (let j = i + 1; j < printedByPart.length; j++) {
      const a = printedByPart[i]
      const b = printedByPart[j]
      if (a.start == null || b.start == null) continue
      const overlap = !(a.end < b.start || b.end < a.start)
      if (overlap) {
        throw new Error(
          `Unit ${unitNumber}: overlapping printed pages between ${a.name} (${a.start}-${a.end}) and ${b.name} (${b.start}-${b.end}). ` +
            `Replace the wrong part file before merging.`,
        )
      }
    }
  }

  // Collision check across parts (entity ids other than book_id)
  const seen = new Set()
  const collisions = []
  for (const { name, data } of loaded) {
    for (const id of collectEntityIds(data)) {
      if (seen.has(id)) collisions.push({ id, file: name })
      else seen.add(id)
    }
  }
  if (collisions.length) {
    throw new Error(
      `Unit ${unitNumber}: ${collisions.length} cross-part ID collision(s), e.g. ${collisions[0].id}`,
    )
  }

  const printedStart = printed.length ? Math.min(...printed) : null
  const printedEnd = printed.length ? Math.max(...printed) : null
  const pdfStart = pdf.length ? Math.min(...pdf) : null
  const pdfEnd = pdf.length ? Math.max(...pdf) : null

  const baseUnit = unitRecs[0] ? { ...unitRecs[0] } : {}
  const title =
    unitRecs.map((u) => u.title).find((t) => typeof t === 'string' && t.trim()) ?? baseUnit.title
  const theme =
    unitRecs.map((u) => u.theme).find((t) => typeof t === 'string' && t.trim()) ?? baseUnit.theme

  const book = { ...(asRecord(first.book) || {}) }
  book.book_id = CATALOG_BOOK_ID
  book.printed_page_start = printedStart
  book.printed_page_end = printedEnd
  book.extraction_status = 'in_progress'
  book.verification_status = book.verification_status ?? 'unverified'

  const unit = {
    ...baseUnit,
    unit_id: unitId,
    book_id: CATALOG_BOOK_ID,
    unit_number: String(unitNumber),
    title,
    theme,
    printed_page_start: printedStart,
    printed_page_end: printedEnd,
    pdf_page_start: pdfStart ?? printedStart,
    pdf_page_end: pdfEnd ?? printedEnd,
    notes: `Merged from split parts: ${parts.join(' + ')}. Entity IDs preserved as extracted (mixed legacy prefixes).`,
    verification_status: 'unverified',
  }

  const batch = {
    batch_id: `${CATALOG_BOOK_ID}_unit_${String(unitNumber).padStart(2, '0')}`,
    unit_id: unitId,
    source_section: `Unit ${unitNumber}${title ? `: ${title}` : ''} (pp. ${printedStart}-${printedEnd}; merged from ${parts.length} parts)`,
    printed_page_start: printedStart,
    printed_page_end: printedEnd,
    pdf_page_start: pdfStart ?? printedStart,
    pdf_page_end: pdfEnd ?? printedEnd,
    extraction_status: 'complete',
    notes: `Trial merge of ${parts.join(' + ')}`,
  }

  const merged = {
    schema: asRecord(first.schema) || asRecord(last.schema) || first.schema,
    book,
    batch,
    units: [unit],
  }

  const counts = {}
  for (const key of ARRAY_KEYS) {
    merged[key] = loaded.flatMap(({ data }) => asArray(data[key]))
    counts[key] = merged[key].length
  }

  rewriteBookAndUnitIds(merged, CATALOG_BOOK_ID, unitId)

  const outPath = resolve(dir, out)
  writeFileSync(outPath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8')

  return {
    out,
    unitId,
    printedStart,
    printedEnd,
    pageCount: counts.pages,
    counts,
    partFiles: parts,
  }
}

const requested = process.argv.slice(2).map((s) => Number.parseInt(s, 10)).filter((n) => Number.isFinite(n))
const selected = requested.length
  ? UNITS.filter((u) => requested.includes(u.unitNumber))
  : UNITS

if (!selected.length) {
  console.error(`No matching units. Available: ${UNITS.map((u) => u.unitNumber).join(', ')}`)
  process.exit(1)
}

const results = []
let failures = 0
for (const spec of selected) {
  try {
    const result = mergeUnit(spec)
    results.push(result)
    console.log(
      `OK ${result.out}: pages ${result.printedStart}-${result.printedEnd} (${result.pageCount}), ` +
        `vocab ${result.counts.vocabulary}, lang ${result.counts.language}, acts ${result.counts.activities}`,
    )
  } catch (err) {
    failures += 1
    console.error(`FAIL unit ${spec.unitNumber}: ${err.message}`)
  }
}

console.log(`\nDone. ${results.length} merged, ${failures} failed. Part files left in place.`)
if (failures) process.exit(1)
