/**
 * Flag-off five-artifact series handoff for LiA→Review companions.
 * Run: npx tsx --test scripts/tests/buildBe3U08NeutralSeriesHandoff.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  buildBe3U08NeutralSeriesHandoff,
  isBe3U08NeutralSeriesCompanion,
  resolveBe3U08NeutralSeriesMeta,
} from '../../app/src/features/chalkie/buildBe3U08NeutralSeriesHandoff.ts'
import {
  buildSbActivityCards,
  createDefaultSbActivitySelection,
  createSbActivityHandoffSelection,
} from '../../app/src/features/chalkie/chalkieActivitySelection.ts'
import {
  buildWbActivityCards,
  createDefaultWbActivitySelection,
  createWbActivityHandoffSelection,
} from '../../app/src/features/chalkie/chalkieWorkbookActivitySelection.ts'
import { resolveChalkieLessonContext } from '../../app/src/features/chalkie/resolveChalkieLessonContext.ts'
import { resolveVerifiedSbWbCompanion } from '../../app/src/features/chalkie/resolveVerifiedSbWbCompanion.ts'
import {
  BE3_U08_SB128_129_WB104_105,
  BE3_U08_SB130_131_WB106,
  BE3_U08_SB132_133_WB107_108,
  BE3_U08_SB136_137_WB111_112,
} from '../../app/src/features/chalkie/verifiedSbWbCompanions.ts'
import type { Book } from '../../app/src/types/curriculum.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const BE3_SB_PATH = path.join(
  ROOT,
  'data/phase1/big_english_3_sb/canonical/v1.json',
)
const BE3_WB_PATH = path.join(
  ROOT,
  'data/phase1/big_english_3_wb/canonical/v1.json',
)
const OVERLAY_SOURCE = path.join(
  ROOT,
  'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx',
)
const RESOLVER_SOURCE = path.join(
  ROOT,
  'app/src/features/chalkie/resolveChalkieLessonContext.ts',
)

function loadJson(filePath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function summaryFromCanonical(
  raw: Record<string, unknown>,
  catalogBookId: string,
): BatchJsonSummary {
  const unit = asArray(raw.units).find((entry) => {
    const row = asRecord(entry)
    return row.unit_number === 8 || row.unit_number === '8'
  })
  const unitRecord = asRecord(unit)
  return {
    catalogBookId,
    units: [
      {
        unitNumber: 8,
        title:
          typeof unitRecord.title === 'string'
            ? unitRecord.title
            : 'Healthy Living',
        printedPageStart:
          typeof unitRecord.printed_page_start === 'number'
            ? unitRecord.printed_page_start
            : 128,
        printedPageEnd:
          typeof unitRecord.printed_page_end === 'number'
            ? unitRecord.printed_page_end
            : 143,
      },
    ],
    vocabulary: [],
    language: [],
    activities: [],
    pages: [],
    raw,
  }
}

function bookStub(): Book {
  return {
    id: 'book-uuid-test',
    seriesId: 'series-uuid-test',
    catalogBookId: 'big_english_3_sb',
    title: 'Big English 3 Student Book',
    level: '3',
    audience: 'Primary',
    totalUnits: 9,
    type: 'Student Book',
    colorScheme: {
      primary: '#000000',
      accent: '#333333',
      badgeBg: '#eeeeee',
      badgeText: '#111111',
    },
    pageSpreads: [],
  }
}

function requireCanonical(): {
  readonly sbRaw: Record<string, unknown>
  readonly wbRaw: Record<string, unknown>
} {
  assert.ok(fs.existsSync(BE3_SB_PATH), `missing ${BE3_SB_PATH}`)
  assert.ok(fs.existsSync(BE3_WB_PATH), `missing ${BE3_WB_PATH}`)
  return {
    sbRaw: loadJson(BE3_SB_PATH),
    wbRaw: loadJson(BE3_WB_PATH),
  }
}

function selectionsForCompanion(input: {
  readonly sbRaw: Record<string, unknown>
  readonly wbRaw: Record<string, unknown>
  readonly companion: NonNullable<
    ReturnType<typeof resolveVerifiedSbWbCompanion>['companion']
  >
  readonly sbPages: readonly number[]
}) {
  const sbSummary = summaryFromCanonical(input.sbRaw, 'big_english_3_sb')
  const wbSummary = summaryFromCanonical(input.wbRaw, 'big_english_3_wb')
  const sbCards = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: [...input.sbPages],
  })
  const wbCards = buildWbActivityCards({
    summary: wbSummary,
    companion: input.companion,
  })
  assert.ok(sbCards.length > 0, 'expected SB activity cards')
  assert.ok(wbCards.length > 0, 'expected WB activity cards')
  return {
    activitySelection: createSbActivityHandoffSelection(
      sbCards,
      createDefaultSbActivitySelection(sbCards),
    ),
    workbookActivitySelection: createWbActivityHandoffSelection(
      wbCards,
      createDefaultWbActivitySelection(wbCards),
    ),
  }
}

test('companion detection covers LiA→Review only, not Opener/Story', () => {
  assert.equal(isBe3U08NeutralSeriesCompanion(BE3_U08_SB128_129_WB104_105), false)
  assert.equal(isBe3U08NeutralSeriesCompanion(BE3_U08_SB130_131_WB106), false)
  assert.equal(isBe3U08NeutralSeriesCompanion(BE3_U08_SB132_133_WB107_108), true)
  assert.equal(isBe3U08NeutralSeriesCompanion(BE3_U08_SB136_137_WB111_112), true)
  assert.equal(isBe3U08NeutralSeriesCompanion(null), false)
})

test('LiA flag-off handoff populates outlines and vocabulary', () => {
  const { sbRaw, wbRaw } = requireCanonical()
  const { companion } = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sbRaw,
    workbookCanonical: wbRaw,
    studentBookPrintedPages: [132, 133],
  })
  assert.ok(companion)
  assert.equal(companion!.relationshipId, BE3_U08_SB132_133_WB107_108.relationshipId)

  const selections = selectionsForCompanion({
    sbRaw,
    wbRaw,
    companion: companion!,
    sbPages: [132, 133],
  })
  const handoff = buildBe3U08NeutralSeriesHandoff({
    companion: companion!,
    ...selections,
  })
  assert.ok(handoff)
  const meta = resolveBe3U08NeutralSeriesMeta(companion)
  assert.equal(handoff!.seriesTitle, meta!.seriesTitle)
  assert.equal(handoff!.stableSeriesReference, meta!.stableSeriesReference)
  for (const key of [
    'detailedHandoff',
    'lesson1Outline',
    'lesson1Vocabulary',
    'lesson2Outline',
    'lesson2Vocabulary',
  ] as const) {
    assert.ok(handoff![key].trim().length > 0, `${key} should be populated`)
  }
  assert.match(handoff!.lesson1Outline, /Language in Action/)
  assert.match(handoff!.detailedHandoff, /132/)
})

test('Grammar flag-off handoff populates outlines and vocabulary', () => {
  const { sbRaw, wbRaw } = requireCanonical()
  const { companion } = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sbRaw,
    workbookCanonical: wbRaw,
    studentBookPrintedPages: [136, 137],
  })
  assert.ok(companion)
  assert.equal(companion!.relationshipId, BE3_U08_SB136_137_WB111_112.relationshipId)

  const selections = selectionsForCompanion({
    sbRaw,
    wbRaw,
    companion: companion!,
    sbPages: [136, 137],
  })
  const handoff = buildBe3U08NeutralSeriesHandoff({
    companion: companion!,
    ...selections,
  })
  assert.ok(handoff)
  for (const key of [
    'detailedHandoff',
    'lesson1Outline',
    'lesson1Vocabulary',
    'lesson2Outline',
    'lesson2Vocabulary',
  ] as const) {
    assert.ok(handoff![key].trim().length > 0, `${key} should be populated`)
  }
  assert.match(handoff!.seriesTitle, /Grammar/)
})

test('Story companion still uses bespoke path (neutral helper returns null)', () => {
  const { sbRaw, wbRaw } = requireCanonical()
  const { companion } = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sbRaw,
    workbookCanonical: wbRaw,
    studentBookPrintedPages: [130, 131],
  })
  assert.ok(companion)
  const selections = selectionsForCompanion({
    sbRaw,
    wbRaw,
    companion: companion!,
    sbPages: [130, 131],
  })
  assert.equal(
    buildBe3U08NeutralSeriesHandoff({
      companion: companion!,
      ...selections,
    }),
    null,
  )
})

test('Values SB-only pages stay sb_only packaging with no series companion', () => {
  const { sbRaw, wbRaw } = requireCanonical()
  const resolved = resolveChalkieLessonContext({
    book: bookStub(),
    summary: summaryFromCanonical(sbRaw, 'big_english_3_sb'),
    workbookCanonical: wbRaw,
    visiblePrintedPages: [142],
    unitNumber: 8,
  })
  assert.equal(resolved.status, 'ready')
  assert.equal(resolved.twoLessonPackagingMode, 'sb_only')
  assert.equal(resolved.workbookCompanion, null)
  assert.equal(resolved.seriesLessonTitle, null)
})

test('LiA pages resolve as sb_wb with series title when companion present', () => {
  const { sbRaw, wbRaw } = requireCanonical()
  const resolved = resolveChalkieLessonContext({
    book: bookStub(),
    summary: summaryFromCanonical(sbRaw, 'big_english_3_sb'),
    workbookCanonical: wbRaw,
    visiblePrintedPages: [132, 133],
    unitNumber: 8,
  })
  assert.equal(resolved.status, 'ready')
  assert.equal(resolved.twoLessonPackagingMode, 'sb_wb')
  assert.ok(resolved.workbookCompanion)
  assert.match(resolved.seriesLessonTitle ?? '', /Language in Action/)
  assert.equal(
    resolved.stableSeriesReference,
    resolveBe3U08NeutralSeriesMeta(resolved.workbookCompanion)!.stableSeriesReference,
  )
})

test('overlay and resolver wire the neutral series fallback', () => {
  const overlay = fs.readFileSync(OVERLAY_SOURCE, 'utf8')
  const resolver = fs.readFileSync(RESOLVER_SOURCE, 'utf8')
  assert.match(overlay, /buildBe3U08NeutralSeriesHandoff/)
  assert.match(overlay, /isBe3U08NeutralSeriesCompanion/)
  assert.match(
    overlay,
    /LiA-C failure: retain neutral series \(or SB-only\) fallback with captured selections/,
  )
  assert.match(resolver, /resolveBe3U08NeutralSeriesMeta/)
  assert.match(resolver, /be3NeutralSeriesMeta/)
})
