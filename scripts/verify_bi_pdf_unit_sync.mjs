/**
 * Verify PDF visible-range → Book Intelligence unit sync transitions.
 * Mirrors app/src/features/book-intelligence/syncUnitFromPdfPages.ts
 *
 * Checks:
 *   U3 → inter-unit review (no BI) → U4
 *   U6 → inter-unit review (no BI) → U7
 *   U9 → in-unit review (still U9 BI)
 *
 * Usage (repo root):
 *   node scripts/verify_bi_pdf_unit_sync.mjs
 */

import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const CANONICAL_PATH = resolve(
  root,
  'data/phase1/big_english_3_sb/canonical/v1.json',
)

function findUnitForPdfPage(pdfPage, phase1Units) {
  for (const unit of phase1Units) {
    if (
      typeof unit.pdfPageStart === 'number' &&
      typeof unit.pdfPageEnd === 'number' &&
      pdfPage >= unit.pdfPageStart &&
      pdfPage <= unit.pdfPageEnd
    ) {
      return unit.unitNumber
    }
  }
  return null
}

function resolveUnitForVisiblePdfPages(range, phase1Units) {
  const leftUnit = findUnitForPdfPage(range.pdfStart, phase1Units)
  const rightPage = range.pdfEnd !== range.pdfStart ? range.pdfEnd : null
  const rightUnit =
    rightPage != null ? findUnitForPdfPage(rightPage, phase1Units) : null
  if (leftUnit && rightUnit && leftUnit !== rightUnit) return leftUnit
  if (leftUnit) return leftUnit
  if (rightUnit) return rightUnit
  return null
}

/** Simulate overlap-skip jump (PDF sync must not yank when already in unit). */
function wouldJump(currentStart, initialPage, initialPageEnd, numPages) {
  if (initialPage == null) return false
  const start = Math.min(Math.max(1, initialPage), numPages)
  if (initialPageEnd == null) return currentStart !== start
  const end = Math.min(Math.max(1, initialPageEnd), numPages)
  const viewEnd = currentStart + 1 <= numPages ? currentStart + 1 : currentStart
  const overlaps = currentStart <= end && viewEnd >= start
  return !overlaps
}

let failed = 0
function pass(msg) {
  console.log(`PASS  ${msg}`)
}
function fail(msg) {
  failed += 1
  console.error(`FAIL  ${msg}`)
}

if (!existsSync(CANONICAL_PATH)) {
  fail(`missing ${CANONICAL_PATH}`)
  process.exit(1)
}

const canonical = JSON.parse(readFileSync(CANONICAL_PATH, 'utf8'))
const phase1Units = (canonical.units ?? []).map((unit) => ({
  unitNumber: String(unit.unit_number),
  pdfPageStart: unit.pdf_page_start ?? null,
  pdfPageEnd: unit.pdf_page_end ?? null,
}))

const byNum = Object.fromEntries(phase1Units.map((u) => [u.unitNumber, u]))
const numPages = 157

console.log('=== BI ↔ PDF unit sync transitions ===\n')

function step(label, range, expect) {
  const got = resolveUnitForVisiblePdfPages(range, phase1Units)
  if (got === expect) {
    pass(
      `${label}: pdf ${range.pdfStart}–${range.pdfEnd} → ${
        got == null ? 'no BI (outside units)' : `unit ${got}`
      }`,
    )
  } else {
    fail(`${label}: expected ${expect}, got ${got}`)
  }
  return got
}

// --- U3 → review gap → U4 ---
const u3 = byNum['3']
const u4 = byNum['4']
step('U3 mid', { pdfStart: u3.pdfPageStart + 2, pdfEnd: u3.pdfPageStart + 3 }, '3')
step('U3 end (in-unit review p.51)', { pdfStart: 50, pdfEnd: 51 }, '3')
step('U3→review gap', { pdfStart: 52, pdfEnd: 53 }, null)
step('review mid-gap', { pdfStart: 54, pdfEnd: 55 }, null)
step('review→U4 straddle', { pdfStart: 57, pdfEnd: 58 }, '4')
step('U4 start', { pdfStart: 58, pdfEnd: 59 }, '4')

// Loop guard: landing on U4 via PDF must not re-jump to unit start if already there
if (
  !wouldJump(58, u4.pdfPageStart, u4.pdfPageEnd, numPages) &&
  !wouldJump(60, u4.pdfPageStart, u4.pdfPageEnd, numPages)
) {
  pass('U3→review→U4: no PDF re-jump once inside U4 range')
} else {
  fail('U3→review→U4: unexpected re-jump inside U4')
}

// --- U6 → review gap → U7 ---
const u6 = byNum['6']
const u7 = byNum['7']
step('U6 end', { pdfStart: 102, pdfEnd: 103 }, '6')
step('U6→review gap', { pdfStart: 104, pdfEnd: 105 }, null)
step('review→U7 straddle', { pdfStart: 109, pdfEnd: 110 }, '7')
step('U7 start', { pdfStart: 110, pdfEnd: 111 }, '7')
if (!wouldJump(110, u7.pdfPageStart, u7.pdfPageEnd, numPages)) {
  pass('U6→review→U7: no PDF re-jump once inside U7 range')
} else {
  fail('U6→review→U7: unexpected re-jump inside U7')
}

// --- U9 → in-unit review (last extracted pages) ---
const u9 = byNum['9']
step('U9 start', { pdfStart: u9.pdfPageStart, pdfEnd: u9.pdfPageStart + 1 }, '9')
step('U9→review (in-unit)', { pdfStart: 156, pdfEnd: 157 }, '9')
if (u9.pdfPageEnd === 157) {
  pass('U9 review is last extracted PDF page (157); continuous nav preserved')
} else {
  fail(`U9 pdf end expected 157, got ${u9.pdfPageEnd}`)
}

// Explicit outside message cases (gaps)
const outsideCases = [
  [52, 53],
  [56, 57],
  [104, 105],
  [108, 109],
]
for (const [a, b] of outsideCases) {
  const got = resolveUnitForVisiblePdfPages(
    { pdfStart: a, pdfEnd: b },
    phase1Units,
  )
  if (got == null) pass(`outside message range pdf ${a}–${b}`)
  else fail(`expected outside for pdf ${a}–${b}, got unit ${got}`)
}

// Tab-select while on gap should jump (outside range → unit start)
if (wouldJump(54, u3.pdfPageStart, u3.pdfPageEnd, numPages)) {
  pass('Selecting U3 while on review gap jumps PDF to U3 start')
} else {
  fail('Selecting U3 on review gap should jump')
}

// --- Regression: Review 1 gap → U4 must never select Unit 1 ---
// Old bug: clearing ?unit= on the gap made resolveUnit fall back to units[0],
// then initialPage jumped the PDF to U1 (page 4).
function resolveUnitNoFallback(units, unitParam) {
  if (!unitParam) return null
  return units.find((u) => u.unitNumber === unitParam) ?? null
}
function resolveUnitOldFallback(units, unitParam) {
  if (unitParam) {
    return units.find((u) => u.unitNumber === unitParam) ?? units[0] ?? null
  }
  return units[0] ?? null
}

const biUnitNumbers = phase1Units.map((u) => ({ unitNumber: u.unitNumber }))
const afterGapClear = resolveUnitOldFallback(biUnitNumbers, null)
if (afterGapClear?.unitNumber === '1') {
  pass('Confirmed old fallback: null ?unit= → Unit 1 (the bug)')
} else {
  fail('Expected old fallback to Unit 1 for documentation check')
}

const fixedAfterGap = resolveUnitNoFallback(biUnitNumbers, null)
if (fixedAfterGap == null) {
  pass('Fixed resolveUnit: null ?unit= does not fall back to Unit 1')
} else {
  fail('Fixed resolveUnit must return null when ?unit= is missing')
}

// Simulate Review 1 → U4 with PDF-driven sync (no unit-start jump)
const review1ToU4 = []
for (const range of [
  { pdfStart: 52, pdfEnd: 53 },
  { pdfStart: 54, pdfEnd: 55 },
  { pdfStart: 56, pdfEnd: 57 },
  { pdfStart: 57, pdfEnd: 58 },
  { pdfStart: 58, pdfEnd: 59 },
]) {
  review1ToU4.push(resolveUnitForVisiblePdfPages(range, phase1Units))
}
if (
  review1ToU4[0] == null &&
  review1ToU4[1] == null &&
  review1ToU4[2] == null &&
  review1ToU4[3] === '4' &&
  review1ToU4[4] === '4' &&
  !review1ToU4.includes('1')
) {
  pass('Review 1 → U4 sequence: gap/null then unit 4; never unit 1')
} else {
  fail(`Review 1 → U4 sequence wrong: ${JSON.stringify(review1ToU4)}`)
}

// Reverse: U4 → Review 1 gap
const u4ToReview1 = [
  resolveUnitForVisiblePdfPages({ pdfStart: 58, pdfEnd: 59 }, phase1Units),
  resolveUnitForVisiblePdfPages({ pdfStart: 56, pdfEnd: 57 }, phase1Units),
  resolveUnitForVisiblePdfPages({ pdfStart: 52, pdfEnd: 53 }, phase1Units),
]
if (u4ToReview1[0] === '4' && u4ToReview1[1] == null && u4ToReview1[2] == null) {
  pass('Reverse U4 → Review 1: unit 4 then outside (no Unit 1)')
} else {
  fail(`Reverse U4 → Review 1 wrong: ${JSON.stringify(u4ToReview1)}`)
}

// PDF-driven entry into U4 must not jump away from page 58 when suppress-jump
if (!wouldJump(58, null, null, numPages)) {
  pass('PDF-driven U4 entry with suppressed initialPage does not jump')
} else {
  fail('Suppressed initialPage should not jump')
}
// Stale U1 initialPage while viewing U4 (the failure mode) WOULD jump — guard remains
if (wouldJump(58, 4, 19, numPages)) {
  pass('Guard: stale U1 initialPage [4,19] while on pdf 58 would jump (must be suppressed)')
} else {
  fail('Expected stale U1 range to be outside current view')
}

if (failed) {
  console.error(`\nFAILED (${failed})`)
  process.exit(1)
}
console.log('\nPDF UNIT SYNC VERIFY PASS')
