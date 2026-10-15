/**
 * Compare BE2 eight-column BI JSON unit cells to the v2 Markdown source table.
 *
 *   node scripts/compare_be2_bi_json_to_markdown.mjs
 */

import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const mdPath = resolve(
  root,
  'docs/phase-2/experiments/be2-sb-u01-u09-book-overview-d017-v2.md',
)
const jsonPath = resolve(
  root,
  'data/phase2/big_english_2_sb/interpretations/be2-sb-u01-u09-book-intelligence-v2-eight-column-v0.1-draft.json',
)

function stripMdEmphasis(s) {
  return s.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1')
}

function parseTableRows(md) {
  const rows = []
  for (const line of md.split(/\r?\n/)) {
    if (!line.startsWith('| **')) continue
    const cells = []
    let cur = ''
    const s = line.trim()
    for (let j = 1; j < s.length; j += 1) {
      if (s[j] === '|') {
        cells.push(cur.trim())
        cur = ''
        continue
      }
      cur += s[j]
    }
    rows.push(cells)
  }
  return rows
}

const FIELD_KEYS = [
  'vocabulary',
  'grammar_structures',
  'communicative_functions',
  'learning_outcomes',
  'clil_culture',
  'values',
  'phonics',
]

const rows = parseTableRows(readFileSync(mdPath, 'utf8'))
const doc = JSON.parse(readFileSync(jsonPath, 'utf8'))

const discrepancies = []

if (doc.column_set !== 'eight_column_baseline') {
  discrepancies.push({
    unit: 'envelope',
    field: 'column_set',
    expected: 'eight_column_baseline',
    actual: doc.column_set,
  })
}

if (doc.units?.some((u) => 'writing' in u && u.writing != null)) {
  discrepancies.push({
    unit: 'envelope',
    field: 'writing',
    expected: 'omitted',
    actual: 'present on one or more units',
  })
}

if (rows.length !== doc.units.length) {
  discrepancies.push({
    unit: 'envelope',
    field: 'units.length',
    expected: rows.length,
    actual: doc.units.length,
  })
}

rows.forEach((cells, i) => {
  const unit = doc.units[i]
  const label = unit ? `U${unit.unit_number}` : `row[${i}]`
  if (!unit) {
    discrepancies.push({
      unit: label,
      field: 'unit',
      expected: 'present',
      actual: 'missing',
    })
    return
  }

  const m = cells[0].match(
    /^\*\*(\d+)\s+(.+?)\*\*\s*\(pp\.\s*(\d+)–(\d+)\)\s*$/,
  )
  if (!m) {
    discrepancies.push({
      unit: label,
      field: 'unit_header',
      expected: 'parseable',
      actual: cells[0],
    })
    return
  }

  const expected = {
    unit_number: m[1],
    title: m[2],
    printed_page_start: Number(m[3]),
    printed_page_end: Number(m[4]),
    unit_id: `bep2_unit_0${m[1]}`,
  }

  for (const [field, value] of Object.entries(expected)) {
    if (unit[field] !== value) {
      discrepancies.push({
        unit: label,
        field,
        expected: value,
        actual: unit[field],
      })
    }
  }

  FIELD_KEYS.forEach((key, cellIndex) => {
    const expectedText = stripMdEmphasis(cells[cellIndex + 1])
    const actualText = unit[key]
    if (actualText !== expectedText) {
      discrepancies.push({
        unit: label,
        field: key,
        expected: expectedText,
        actual: actualText,
      })
    }
  })

  if (unit.learning_outcomes_provenance !== 'ai_inferred') {
    discrepancies.push({
      unit: label,
      field: 'learning_outcomes_provenance',
      expected: 'ai_inferred',
      actual: unit.learning_outcomes_provenance,
    })
  }
})

console.log('=== BE2 BI JSON ↔ Markdown v2 comparison ===')
console.log(`Markdown: ${mdPath}`)
console.log(`JSON:     ${jsonPath}`)
console.log(`Units compared: ${Math.min(rows.length, doc.units?.length ?? 0)}`)
console.log('')

if (discrepancies.length === 0) {
  console.log('DISCREPANCIES: none')
  console.log('PASS: all unit content fields match Markdown (emphasis-normalized)')
  process.exit(0)
}

console.log(`DISCREPANCIES: ${discrepancies.length}`)
for (const d of discrepancies) {
  console.log(`- ${d.unit}.${d.field}`)
  console.log(`    expected: ${JSON.stringify(d.expected)}`)
  console.log(`    actual:   ${JSON.stringify(d.actual)}`)
}
process.exit(1)
