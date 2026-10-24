/**
 * Complete U1–U9 Book Intelligence PDF navigation regression.
 *
 * Covers:
 *   - Per-unit start/mid/end page → unit sync
 *   - Forward walk (+2 pages) across the whole book
 *   - Backward walk (−2 pages)
 *   - Inter-unit review gaps (after U3, after U6)
 *   - Adjacent unit boundaries (no gap)
 *   - Unit tab selection jump targets (pdf_page_start)
 *   - Deep links ?unit=1…9
 *   - No Unit 1 fallback when ?unit= is missing
 *
 * Mirrors:
 *   app/src/features/book-intelligence/syncUnitFromPdfPages.ts
 *   app/src/features/book-intelligence/resolvePdfInitialPage.ts
 *   ValidationPdfPane overlap-skip / pair navigation
 *
 * Usage (repo root):
 *   node scripts/verify_bi_pdf_u1_u9_regression.mjs
 */

import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const { createClient } = createRequire(resolve(root, 'app', 'package.json'))(
  '@supabase/supabase-js',
)

const CANONICAL_PATH = resolve(
  root,
  'data/phase1/big_english_3_sb/canonical/v1.json',
)
const BI_PATH = resolve(
  root,
  'data/phase2/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json',
)
const CATALOG = 'big_english_3_sb'
const BUCKET = 'book-datasets'
const STORAGE_PATH =
  'big-english/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json'

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

function resolvePdfInitialPage(unitNumber, biPrinted, phase1Units, pageMap) {
  if (!unitNumber) return null
  const phase1 = phase1Units.find((u) => u.unitNumber === unitNumber)
  if (typeof phase1?.pdfPageStart === 'number') return phase1.pdfPageStart
  const printed = phase1?.printedPageStart ?? biPrinted ?? null
  if (typeof printed !== 'number') return null
  if (pageMap.length > 0) {
    const exact = pageMap.find((e) => e.printed === printed)
    if (exact) return exact.pdf
    let best = pageMap[0]
    let bestDist = Math.abs(best.printed - printed)
    for (const entry of pageMap) {
      const dist = Math.abs(entry.printed - printed)
      if (dist < bestDist) {
        best = entry
        bestDist = dist
      }
    }
    return printed + (best.pdf - best.printed)
  }
  return printed
}

function resolveUnitFromQuery(units, unitParam) {
  if (!unitParam) return null
  return units.find((u) => u.unitNumber === unitParam) ?? null
}

function clampPage(page, numPages) {
  return Math.min(Math.max(1, Math.floor(page)), numPages)
}

function wouldJump(currentStart, initialPage, initialPageEnd, numPages) {
  if (initialPage == null) return false
  const start = clampPage(initialPage, numPages)
  if (initialPageEnd == null) return currentStart !== start
  const end = clampPage(initialPageEnd, numPages)
  const viewEnd = currentStart + 1 <= numPages ? currentStart + 1 : currentStart
  return !(currentStart <= end && viewEnd >= start)
}

function pairAt(start, numPages) {
  const pdfStart = clampPage(start, numPages)
  const pdfEnd = pdfStart + 1 <= numPages ? pdfStart + 1 : pdfStart
  return { pdfStart, pdfEnd }
}

function bookIntelligencePath(catalogBookId, unitNumber) {
  const base = `/app/book-intelligence/${catalogBookId}`
  if (unitNumber == null || unitNumber === '') return base
  return `${base}?unit=${encodeURIComponent(String(unitNumber))}`
}

let failed = 0
function pass(msg) {
  console.log(`PASS  ${msg}`)
}
function fail(msg) {
  failed += 1
  console.error(`FAIL  ${msg}`)
}
function expect(cond, msg) {
  if (cond) pass(msg)
  else fail(msg)
}

loadEnvFile(resolve(root, 'app', '.env.local'))
loadEnvFile(resolve(root, '.env.local'))

if (!existsSync(CANONICAL_PATH)) {
  fail(`missing ${CANONICAL_PATH}`)
  process.exit(1)
}
if (!existsSync(BI_PATH)) {
  fail(`missing ${BI_PATH}`)
  process.exit(1)
}

const canonical = JSON.parse(readFileSync(CANONICAL_PATH, 'utf8'))
const bi = JSON.parse(readFileSync(BI_PATH, 'utf8'))

const phase1Units = (canonical.units ?? [])
  .map((unit) => ({
    unitNumber: String(unit.unit_number),
    printedPageStart:
      typeof unit.printed_page_start === 'number'
        ? unit.printed_page_start
        : null,
    printedPageEnd:
      typeof unit.printed_page_end === 'number' ? unit.printed_page_end : null,
    pdfPageStart:
      typeof unit.pdf_page_start === 'number' ? unit.pdf_page_start : null,
    pdfPageEnd:
      typeof unit.pdf_page_end === 'number' ? unit.pdf_page_end : null,
  }))
  .sort((a, b) => Number(a.unitNumber) - Number(b.unitNumber))

const byNum = Object.fromEntries(phase1Units.map((u) => [u.unitNumber, u]))
const biUnits = (bi.units ?? []).map((u) => ({
  unitNumber: String(u.unit_number),
  printedPageStart: u.printed_page_start ?? null,
}))
const pageMap = (canonical.pages ?? [])
  .filter((p) => typeof p.pdf_page === 'number' && typeof p.printed_page === 'number')
  .map((p) => ({ pdf: p.pdf_page, printed: p.printed_page }))
  .sort((a, b) => a.pdf - b.pdf)

const numPages = Math.max(...phase1Units.map((u) => u.pdfPageEnd ?? 0), 1)

const gaps = []
for (let i = 0; i < phase1Units.length - 1; i++) {
  const a = phase1Units[i]
  const b = phase1Units[i + 1]
  if (
    typeof a.pdfPageEnd === 'number' &&
    typeof b.pdfPageStart === 'number' &&
    a.pdfPageEnd + 1 < b.pdfPageStart
  ) {
    gaps.push({
      afterUnit: a.unitNumber,
      beforeUnit: b.unitNumber,
      pdfStart: a.pdfPageEnd + 1,
      pdfEnd: b.pdfPageStart - 1,
    })
  }
}

console.log('=== BI PDF U1–U9 navigation regression ===\n')
console.log(
  `Units: ${phase1Units.length} · PDF pages: ${numPages} · Gaps: ${gaps.length}\n`,
)

// ---------------------------------------------------------------------------
// 1. Unit inventory
// ---------------------------------------------------------------------------
expect(phase1Units.length === 9, 'Phase 1 has units 1–9')
expect(biUnits.length === 9, 'BI overview has units 1–9')
for (const n of ['1', '2', '3', '4', '5', '6', '7', '8', '9']) {
  expect(Boolean(byNum[n]), `Phase 1 unit ${n} present`)
  expect(
    biUnits.some((u) => u.unitNumber === n),
    `BI unit ${n} present`,
  )
  expect(
    typeof byNum[n].pdfPageStart === 'number' &&
      typeof byNum[n].pdfPageEnd === 'number',
    `U${n} has pdf_page_start/end`,
  )
}

// ---------------------------------------------------------------------------
// 2. Deep links ?unit=1…9 → correct PDF start (unit selection target)
// ---------------------------------------------------------------------------
console.log('\n--- Deep links & unit selection targets ---')
for (const n of ['1', '2', '3', '4', '5', '6', '7', '8', '9']) {
  const biUnit = biUnits.find((u) => u.unitNumber === n)
  const start = resolvePdfInitialPage(
    n,
    biUnit?.printedPageStart,
    phase1Units,
    pageMap,
  )
  expect(
    start === byNum[n].pdfPageStart,
    `Deep link/select U${n} → PDF ${start} (expected ${byNum[n].pdfPageStart})`,
  )
  expect(
    bookIntelligencePath(CATALOG, n) ===
      `/app/book-intelligence/${CATALOG}?unit=${n}`,
    `Deep link path U${n}`,
  )
  expect(
    resolveUnitFromQuery(biUnits, n)?.unitNumber === n,
    `?unit=${n} resolves to unit ${n}`,
  )
}

expect(
  resolveUnitFromQuery(biUnits, null) == null,
  'Missing ?unit= does not fall back to Unit 1',
)
expect(
  resolveUnitFromQuery(biUnits, '99') == null,
  'Invalid ?unit= does not fall back to Unit 1',
)

// ---------------------------------------------------------------------------
// 3. Per-unit start / mid / end sync
// ---------------------------------------------------------------------------
console.log('\n--- Per-unit start / mid / end ---')
for (const u of phase1Units) {
  const start = u.pdfPageStart
  const end = u.pdfPageEnd
  const mid = Math.floor((start + end) / 2)
  // Align mid to even-ish pair start within unit
  const midPair = mid % 2 === start % 2 ? mid : mid - 1
  const samples = [
    ['start', start],
    ['mid', Math.max(start, Math.min(end - 1, midPair))],
    ['end-1', Math.max(start, end - 1)],
  ]
  for (const [label, page] of samples) {
    const range = pairAt(page, numPages)
    const got = resolveUnitForVisiblePdfPages(range, phase1Units)
    // End pair may straddle into gap/next unit — allow left-unit preference
    if (range.pdfStart >= start && range.pdfStart <= end) {
      expect(
        got === u.unitNumber,
        `U${u.unitNumber} ${label} pdf ${range.pdfStart}–${range.pdfEnd} → unit ${got}`,
      )
    }
  }
}

// ---------------------------------------------------------------------------
// 4. Forward walk (+2) across entire book
// ---------------------------------------------------------------------------
console.log('\n--- Forward walk (+2 pages) ---')
{
  let pairStart = 1
  let sawGapAfter3 = false
  let sawGapAfter6 = false
  let lastUnit = null
  const visitedUnits = new Set()
  const illegalU1AfterGap = []

  while (pairStart <= numPages) {
    const range = pairAt(pairStart, numPages)
    const got = resolveUnitForVisiblePdfPages(range, phase1Units)

    for (const gap of gaps) {
      // Fully inside the gap → no BI. Straddle 57–58 / 109–110 enters next unit (OK).
      const fullyInGap =
        range.pdfStart >= gap.pdfStart && range.pdfEnd <= gap.pdfEnd
      const touchesGap =
        range.pdfStart <= gap.pdfEnd && range.pdfEnd >= gap.pdfStart
      if (fullyInGap) {
        if (got != null) {
          fail(
            `Forward: gap after U${gap.afterUnit} pdf ${range.pdfStart}–${range.pdfEnd} expected no BI, got U${got}`,
          )
        }
      }
      if (touchesGap) {
        if (gap.afterUnit === '3') sawGapAfter3 = true
        if (gap.afterUnit === '6') sawGapAfter6 = true
      }
    }

    // Leaving Review-after-U3 into U4 must never report U1
    if (
      lastUnit == null &&
      got === '1' &&
      range.pdfStart >= 52 &&
      range.pdfStart <= 59
    ) {
      illegalU1AfterGap.push(range)
    }

    if (got) visitedUnits.add(got)
    lastUnit = got
    if (pairStart >= numPages) break
    pairStart = clampPage(pairStart + 2, numPages)
    if (pairStart === range.pdfStart) break
  }

  expect(sawGapAfter3, 'Forward walk encountered Review gap after U3')
  expect(sawGapAfter6, 'Forward walk encountered Review gap after U6')
  expect(
    visitedUnits.size === 9,
    `Forward walk visited all 9 units (got ${[...visitedUnits].sort((a, b) => +a - +b).join(',')})`,
  )
  expect(
    illegalU1AfterGap.length === 0,
    'Forward: no illegal Unit 1 selection near Review1→U4',
  )

  // Explicit boundary transitions
  const transitions = [
    [18, '1'],
    [20, '2'],
    [34, '2'],
    [36, '3'],
    [50, '3'],
    [52, null],
    [56, null],
    [58, '4'],
    [70, '4'],
    [72, '5'],
    [86, '5'],
    [88, '6'],
    [102, '6'],
    [104, null],
    [108, null],
    [110, '7'],
    [124, '7'],
    [126, '8'],
    [140, '8'],
    [142, '9'],
    [156, '9'],
  ]
  for (const [page, want] of transitions) {
    const range = pairAt(page, numPages)
    const got = resolveUnitForVisiblePdfPages(range, phase1Units)
    expect(
      got === want,
      `Forward checkpoint pdf ${range.pdfStart}–${range.pdfEnd} → ${
        got == null ? 'no BI' : `U${got}`
      } (want ${want == null ? 'no BI' : `U${want}`})`,
    )
  }
}

// ---------------------------------------------------------------------------
// 5. Backward walk (−2) from end
// ---------------------------------------------------------------------------
console.log('\n--- Backward walk (−2 pages) ---')
{
  let pairStart = numPages % 2 === 0 ? numPages - 1 : numPages
  // Start from last even-ish pair that includes end
  pairStart = clampPage(numPages - 1, numPages)
  const visitedUnits = new Set()
  let sawGapAfter6 = false
  let sawGapAfter3 = false

  while (pairStart >= 1) {
    const range = pairAt(pairStart, numPages)
    const got = resolveUnitForVisiblePdfPages(range, phase1Units)
    if (got) visitedUnits.add(got)
    for (const gap of gaps) {
      const fullyInGap =
        range.pdfStart >= gap.pdfStart && range.pdfEnd <= gap.pdfEnd
      const touchesGap =
        range.pdfStart <= gap.pdfEnd && range.pdfEnd >= gap.pdfStart
      if (fullyInGap) {
        expect(
          got == null,
          `Backward: gap after U${gap.afterUnit} pdf ${range.pdfStart}–${range.pdfEnd} → no BI`,
        )
      }
      if (touchesGap) {
        if (gap.afterUnit === '3') sawGapAfter3 = true
        if (gap.afterUnit === '6') sawGapAfter6 = true
      }
    }
    if (pairStart <= 1) break
    const next = pairStart - 2
    if (next === pairStart) break
    pairStart = next
  }

  expect(sawGapAfter3, 'Backward walk encountered Review gap after U3')
  expect(sawGapAfter6, 'Backward walk encountered Review gap after U6')
  expect(
    visitedUnits.size === 9,
    `Backward walk visited all 9 units (got ${[...visitedUnits].sort((a, b) => +a - +b).join(',')})`,
  )

  // Reverse through Review1: U4 → gap → U3
  const reverseReview1 = [
    [58, '4'],
    [56, null],
    [52, null],
    [50, '3'],
  ]
  for (const [page, want] of reverseReview1) {
    const range = pairAt(page, numPages)
    const got = resolveUnitForVisiblePdfPages(range, phase1Units)
    expect(
      got === want,
      `Backward Review1 path pdf ${range.pdfStart}–${range.pdfEnd} → ${
        got == null ? 'no BI' : `U${got}`
      }`,
    )
  }

  // Reverse through Review2: U7 → gap → U6
  const reverseReview2 = [
    [110, '7'],
    [108, null],
    [104, null],
    [102, '6'],
  ]
  for (const [page, want] of reverseReview2) {
    const range = pairAt(page, numPages)
    const got = resolveUnitForVisiblePdfPages(range, phase1Units)
    expect(
      got === want,
      `Backward Review2 path pdf ${range.pdfStart}–${range.pdfEnd} → ${
        got == null ? 'no BI' : `U${got}`
      }`,
    )
  }
}

// ---------------------------------------------------------------------------
// 6. Gap → next unit must not jump to Unit 1 (regression)
// ---------------------------------------------------------------------------
console.log('\n--- Gap exit / jump suppression ---')
for (const gap of gaps) {
  const next = byNum[gap.beforeUnit]
  const enterPage = next.pdfPageStart
  const range = pairAt(enterPage, numPages)
  const got = resolveUnitForVisiblePdfPages(range, phase1Units)
  expect(
    got === gap.beforeUnit,
    `Exit gap after U${gap.afterUnit} at pdf ${enterPage} → U${got}`,
  )
  expect(
    got !== '1' || gap.beforeUnit === '1',
    `Exit gap after U${gap.afterUnit} does not wrongly select U1`,
  )
  // PDF-driven sync suppresses initialPage → no jump
  expect(
    !wouldJump(enterPage, null, null, numPages),
    `PDF-driven enter U${gap.beforeUnit}: suppressed jump`,
  )
  // Stale U1 jump would be wrong — document the danger
  expect(
    wouldJump(enterPage, 4, 19, numPages),
    `Stale U1 [4,19] while on pdf ${enterPage} would jump (must stay suppressed)`,
  )
}

// Tab select while on gap → jump to unit start
for (const gap of gaps) {
  const midGap = Math.floor((gap.pdfStart + gap.pdfEnd) / 2)
  const target = byNum[gap.beforeUnit]
  expect(
    wouldJump(midGap, target.pdfPageStart, target.pdfPageEnd, numPages),
    `Tab-select U${gap.beforeUnit} from gap pdf ${midGap} jumps to ${target.pdfPageStart}`,
  )
}

// ---------------------------------------------------------------------------
// 7. Adjacent boundaries (no gap): U1↔U2, U4↔U5, U5↔U6, U7↔U8, U8↔U9
// ---------------------------------------------------------------------------
console.log('\n--- Adjacent unit boundaries ---')
const adjacent = [
  [19, '1', 20, '2'],
  [71, '4', 72, '5'],
  [87, '5', 88, '6'],
  [125, '7', 126, '8'],
  [141, '8', 142, '9'],
]
for (const [leftEnd, leftUnit, rightStart, rightUnit] of adjacent) {
  expect(
    resolveUnitForVisiblePdfPages(pairAt(leftEnd, numPages), phase1Units) ===
      leftUnit,
    `Boundary U${leftUnit} end pdf ${leftEnd}`,
  )
  expect(
    resolveUnitForVisiblePdfPages(pairAt(rightStart, numPages), phase1Units) ===
      rightUnit,
    `Boundary U${rightUnit} start pdf ${rightStart}`,
  )
  // Straddle prefers left
  const straddle = {
    pdfStart: leftEnd,
    pdfEnd: rightStart,
  }
  expect(
    resolveUnitForVisiblePdfPages(straddle, phase1Units) === leftUnit,
    `Straddle pdf ${leftEnd}–${rightStart} prefers U${leftUnit}`,
  )
}

// ---------------------------------------------------------------------------
// 8. In-unit reviews still belong to their unit (U1,U3,U9 samples)
// ---------------------------------------------------------------------------
console.log('\n--- In-unit review pages ---')
for (const n of ['1', '3', '6', '9']) {
  const end = byNum[n].pdfPageEnd
  const got = resolveUnitForVisiblePdfPages(pairAt(end - 1, numPages), phase1Units)
  expect(got === n, `In-unit review near end of U${n} (pdf ~${end}) → U${got}`)
}

// ---------------------------------------------------------------------------
// 9. Storage BI still available (deep-link data path)
// ---------------------------------------------------------------------------
console.log('\n--- Storage BI artifact ---')
{
  const url = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim()
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
  if (!url || !key) {
    fail('Missing Supabase env for Storage check')
  } else {
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const local = readFileSync(BI_PATH)
    const localHash = createHash('sha256').update(local).digest('hex')
    const { data, error } = await supabase.storage.from(BUCKET).download(STORAGE_PATH)
    if (error || !data) {
      fail(`Storage download failed: ${error?.message ?? 'no data'}`)
    } else {
      const buf = Buffer.from(await data.arrayBuffer())
      const remoteHash = createHash('sha256').update(buf).digest('hex')
      expect(remoteHash === localHash, `Storage BI sha256 matches local (${localHash.slice(0, 12)}…)`)
      const remote = JSON.parse(buf.toString('utf8'))
      expect(
        Array.isArray(remote.units) && remote.units.length === 9,
        'Storage BI has 9 units',
      )
    }
  }
}

if (failed) {
  console.error(`\nREGRESSION FAILED (${failed} checks)`)
  process.exit(1)
}
console.log(`\nU1–U9 PDF NAVIGATION REGRESSION PASS`)
