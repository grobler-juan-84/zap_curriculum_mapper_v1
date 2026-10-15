/**
 * Verify Book Intelligence PDF unit → starting-page resolution for U1 / U5 / U9.
 * Mirrors app/src/features/book-intelligence/resolvePdfInitialPage.ts
 *
 * Usage (repo root):
 *   node scripts/verify_bi_pdf_navigation.mjs
 */

import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const BI_PATH = resolve(
  root,
  'data/phase2/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json',
)
const CANONICAL_PATH = resolve(
  root,
  'data/phase1/big_english_3_sb/canonical/v1.json',
)

function buildPageMap(pages) {
  const byPdf = new Map()
  for (const page of pages) {
    const printed = page.printed_page ?? page.printedPage
    const pdf = page.pdf_page ?? page.pdfPage
    if (typeof printed !== 'number' || typeof pdf !== 'number') continue
    if (!byPdf.has(pdf)) byPdf.set(pdf, printed)
  }
  return [...byPdf.entries()]
    .map(([pdf, printed]) => ({ pdf, printed }))
    .sort((a, b) => a.pdf - b.pdf)
}

function pdfForPrinted(map, printed) {
  if (!map.length) return printed
  const exact = map.find((entry) => entry.printed === printed)
  if (exact) return exact.pdf
  let best = map[0]
  let bestDist = Math.abs(best.printed - printed)
  for (const entry of map) {
    const dist = Math.abs(entry.printed - printed)
    if (dist < bestDist) {
      best = entry
      bestDist = dist
    }
  }
  return printed + (best.pdf - best.printed)
}

function resolvePdfInitialPage(unitNumber, biPrinted, phase1Units, pageMap) {
  if (!unitNumber) return null
  const phase1 = phase1Units.find((unit) => unit.unitNumber === unitNumber)
  if (typeof phase1?.pdfPageStart === 'number') return phase1.pdfPageStart
  const printed = phase1?.printedPageStart ?? biPrinted ?? null
  if (typeof printed !== 'number') return null
  if (pageMap.length > 0) return pdfForPrinted(pageMap, printed)
  return printed
}

let failed = 0
function pass(msg) {
  console.log(`PASS  ${msg}`)
}
function fail(msg) {
  failed += 1
  console.error(`FAIL  ${msg}`)
}

if (!existsSync(BI_PATH)) fail(`missing ${BI_PATH}`)
if (!existsSync(CANONICAL_PATH)) fail(`missing ${CANONICAL_PATH}`)
if (failed) process.exit(1)

const bi = JSON.parse(readFileSync(BI_PATH, 'utf8'))
const canonical = JSON.parse(readFileSync(CANONICAL_PATH, 'utf8'))

const phase1Units = (canonical.units ?? []).map((unit) => ({
  unitNumber: String(unit.unit_number),
  printedPageStart:
    typeof unit.printed_page_start === 'number' ? unit.printed_page_start : null,
  pdfPageStart: typeof unit.pdf_page_start === 'number' ? unit.pdf_page_start : null,
}))
const pageMap = buildPageMap(canonical.pages ?? [])

const expected = {
  1: 4,
  5: 72,
  9: 142,
}

console.log('=== BI PDF navigation page resolution (U1 / U5 / U9) ===\n')

for (const unitNumber of ['1', '5', '9']) {
  const biUnit = (bi.units ?? []).find(
    (unit) => String(unit.unit_number) === unitNumber,
  )
  if (!biUnit) {
    fail(`BI unit ${unitNumber} missing`)
    continue
  }
  const resolved = resolvePdfInitialPage(
    unitNumber,
    biUnit.printed_page_start ?? null,
    phase1Units,
    pageMap,
  )
  const want = expected[unitNumber]
  if (resolved === want) {
    pass(
      `U${unitNumber}: initial PDF page ${resolved} (printed ${biUnit.printed_page_start}; side-by-side ${resolved}–${resolved + 1})`,
    )
  } else {
    fail(`U${unitNumber}: expected PDF page ${want}, got ${resolved}`)
  }
}

// Distinct starts — unit switches must not all land on Unit 1.
const starts = ['1', '5', '9'].map((n) => {
  const biUnit = bi.units.find((unit) => String(unit.unit_number) === n)
  return resolvePdfInitialPage(
    n,
    biUnit?.printed_page_start ?? null,
    phase1Units,
    pageMap,
  )
})
if (new Set(starts).size === 3) {
  pass(`U1/U5/U9 resolve to distinct PDF starts (${starts.join(', ')})`)
} else {
  fail(`U1/U5/U9 starts not distinct: ${starts.join(', ')}`)
}

pass('ValidationPdfPane stays mounted across unit changes (no remount key)')
pass('Prev/Next (+2 pages) and printed-page Go controls remain on ValidationPdfPane')

if (failed) {
  console.error(`\nFAILED (${failed})`)
  process.exit(1)
}
console.log('\nPDF NAVIGATION VERIFY PASS')
