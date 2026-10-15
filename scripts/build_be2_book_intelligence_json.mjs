/**
 * One-shot / repeatable port: BE2 v2 Markdown overview → eight-column BI JSON.
 * Faithful cell copy (markdown emphasis markers stripped). No AI regeneration.
 *
 *   node scripts/build_be2_book_intelligence_json.mjs
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const mdPath = resolve(
  root,
  'docs/phase-2/experiments/be2-sb-u01-u09-book-overview-d017-v2.md',
)
const phase1Path = resolve(
  root,
  'data/phase1/big_english_2_sb/canonical/v1.json',
)
const outPath = resolve(
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
    if (cells.length !== 8) {
      throw new Error(`expected 8 cells, got ${cells.length}: ${line}`)
    }
    rows.push(cells)
  }
  return rows
}

const phase1 = JSON.parse(readFileSync(phase1Path, 'utf8'))
const p1ByNumber = new Map(
  phase1.units.map((u) => [String(u.unit_number), u]),
)

const rows = parseTableRows(readFileSync(mdPath, 'utf8'))
if (rows.length !== 9) {
  throw new Error(`expected 9 units, got ${rows.length}`)
}

const units = rows.map((cells) => {
  const unitCell = cells[0]
  const m = unitCell.match(
    /^\*\*(\d+)\s+(.+?)\*\*\s*\(pp\.\s*(\d+)–(\d+)\)\s*$/,
  )
  if (!m) throw new Error(`bad unit cell: ${unitCell}`)

  const unitNumber = m[1]
  const title = m[2]
  const printedPageStart = Number(m[3])
  const printedPageEnd = Number(m[4])
  const p1 = p1ByNumber.get(unitNumber)
  if (!p1) throw new Error(`missing phase1 unit ${unitNumber}`)
  if (p1.title !== title) {
    throw new Error(
      `title mismatch U${unitNumber}: md=${title} p1=${p1.title}`,
    )
  }
  if (
    p1.printed_page_start !== printedPageStart ||
    p1.printed_page_end !== printedPageEnd
  ) {
    throw new Error(`page mismatch U${unitNumber}`)
  }

  return {
    unit_id: p1.unit_id,
    unit_number: unitNumber,
    title,
    printed_page_start: printedPageStart,
    printed_page_end: printedPageEnd,
    vocabulary: stripMdEmphasis(cells[1]),
    grammar_structures: stripMdEmphasis(cells[2]),
    communicative_functions: stripMdEmphasis(cells[3]),
    learning_outcomes: stripMdEmphasis(cells[4]),
    learning_outcomes_provenance: 'ai_inferred',
    clil_culture: stripMdEmphasis(cells[5]),
    values: stripMdEmphasis(cells[6]),
    phonics: stripMdEmphasis(cells[7]),
    source_phase1_schema_version: '0.1',
  }
})

const doc = {
  schema_name: 'book_intelligence_unit_overview',
  schema_version: '0.1-draft',
  layer: 'phase2_interpretation',
  column_set: 'eight_column_baseline',
  catalog_book_id: 'big_english_2_sb',
  registry_id: 'BE2-SB',
  book_uuid: null,
  series_slug: 'big-english',
  title:
    'Big English 2 Student Book — Units 1–9 Book Intelligence (v2 eight-column)',
  notes:
    'Experimental Phase 2 interpretation ported from approved BE2 v2 eight-column Markdown overview. Content is a faithful cell-level copy (markdown emphasis markers removed). Not Phase 1 evidence; not merged into canonical/v1.json; format not locked. No Writing column. Source Markdown: docs/phase-2/experiments/be2-sb-u01-u09-book-overview-d017-v2.md. Contract: docs/phase-2/book-intelligence-ui-data-contract-v1.md.',
  units,
}

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, `${JSON.stringify(doc, null, 2)}\n`, 'utf8')
console.log(`Wrote ${outPath}`)
console.log(`units=${units.length}`)
for (const u of units) {
  console.log(`  ${u.unit_id}  U${u.unit_number} ${u.title}`)
}
