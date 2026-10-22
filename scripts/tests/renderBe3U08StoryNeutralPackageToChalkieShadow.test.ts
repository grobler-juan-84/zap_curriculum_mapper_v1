/**
 * Test-only parity proof for the asymmetric neutral-package Story renderer.
 * Run: npx tsx --test scripts/tests/renderBe3U08StoryNeutralPackageToChalkieShadow.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { buildBe3U08StorySbWbSeriesHandoff } from '../../app/src/features/chalkie/buildBe3U08StorySbWbSeriesHandoff.ts'
import { buildNeutralSbWbLessonPackage } from '../../app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts'
import {
  buildSbActivityCards,
  createDefaultSbActivitySelection,
  createSbActivityHandoffSelection,
  setSbActivityCardSelected,
} from '../../app/src/features/chalkie/chalkieActivitySelection.ts'
import {
  buildWbActivityCards,
  createDefaultWbActivitySelection,
  createWbActivityHandoffSelection,
  setWbActivityCardSelected,
} from '../../app/src/features/chalkie/chalkieWorkbookActivitySelection.ts'
import { renderChalkieFromNeutralPackage } from '../../app/src/features/chalkie/renderChalkieFromNeutralPackage.ts'
import { resolveVerifiedSbWbCompanion } from '../../app/src/features/chalkie/resolveVerifiedSbWbCompanion.ts'
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

const sbCanonical = loadJson(BE3_SB_PATH)
const wbCanonical = loadJson(BE3_WB_PATH)
const sbSummary = summaryFromCanonical(sbCanonical, 'big_english_3_sb')
const wbSummary = summaryFromCanonical(wbCanonical, 'big_english_3_wb')

function storyFixture() {
  const companion = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sbCanonical,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wbCanonical,
    studentBookPrintedPages: [130, 131],
  }).companion
  assert.ok(companion)
  const sbCards = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: [130, 131],
  })
  const wbCards = buildWbActivityCards({
    summary: wbSummary,
    companion,
  })
  return { companion, sbCards, wbCards }
}

function storyPackage(input?: {
  excludedSbCardId?: string
  excludedWbCardId?: string
  zeroSb?: boolean
  zeroWb?: boolean
  priorSupport?: Parameters<
    typeof buildNeutralSbWbLessonPackage
  >[0]['priorSupport']
}) {
  const fixture = storyFixture()
  let sbState = input?.zeroSb
    ? { selectedCardIds: [] }
    : createDefaultSbActivitySelection(fixture.sbCards)
  let wbState = input?.zeroWb
    ? { selectedCardIds: [] }
    : createDefaultWbActivitySelection(fixture.wbCards)

  if (input?.excludedSbCardId) {
    sbState = setSbActivityCardSelected({
      cards: fixture.sbCards,
      state: sbState,
      cardId: input.excludedSbCardId,
      selected: false,
    })
  }
  if (input?.excludedWbCardId) {
    wbState = setWbActivityCardSelected({
      cards: fixture.wbCards,
      state: wbState,
      cardId: input.excludedWbCardId,
      selected: false,
    })
  }

  return {
    ...fixture,
    lessonPackage: buildNeutralSbWbLessonPackage({
      companion: fixture.companion,
      sbSelection: createSbActivityHandoffSelection(fixture.sbCards, sbState),
      wbSelection: createWbActivityHandoffSelection(fixture.wbCards, wbState),
      priorSupport: input?.priorSupport,
    }),
  }
}

function assertNoWb107(output: Record<string, string>): void {
  for (const [name, value] of Object.entries(output)) {
    assert.doesNotMatch(
      value,
      /WB p\.?\s*107|Workbook (?:printed )?page 107|106–107/,
      `${name} must not contain WB p.107`,
    )
  }
}

test('all-selected neutral Story package exactly matches five accepted outputs', () => {
  const { lessonPackage } = storyPackage()
  const shadow = renderChalkieFromNeutralPackage(lessonPackage)
  const accepted = buildBe3U08StorySbWbSeriesHandoff()

  assert.deepEqual(shadow, {
    detailedHandoff: accepted.detailedHandoff,
    lesson1Outline: accepted.lesson1Outline,
    lesson1Vocabulary: accepted.lesson1Vocabulary,
    lesson2Outline: accepted.lesson2Outline,
    lesson2Vocabulary: accepted.lesson2Vocabulary,
  })
})

test('all five Story artifacts preserve WB106-only scope with no WB107 leakage', () => {
  const shadow = renderChalkieFromNeutralPackage(
    storyPackage().lessonPackage,
  )

  assertNoWb107(shadow)
  assert.match(shadow.detailedHandoff, /Workbook printed page 106 only/)
  assert.match(shadow.lesson2Outline, /Workbook p\. 106 only/)
  assert.match(shadow.lesson1Vocabulary, /No dedicated target vocabulary/)
  assert.doesNotMatch(shadow.lesson1Vocabulary, /have a big breakfast|Live Right/)
  assert.doesNotMatch(shadow.lesson2Vocabulary, /have a big breakfast|Live Right/)
})

test('excluding one SB Story activity removes its evidence without reconstruction', () => {
  const fixture = storyFixture()
  const activity6 = fixture.sbCards.find(
    (card) => card.activityNumber === '6',
  )
  assert.ok(activity6)
  const { lessonPackage } = storyPackage({
    excludedSbCardId: activity6.id,
  })
  const shadow = renderChalkieFromNeutralPackage(lessonPackage)

  assert.doesNotMatch(
    shadow.detailedHandoff,
    /Listen and read\. Did Amy eat a healthy dinner\?/,
  )
  assert.doesNotMatch(shadow.detailedHandoff, /Audio track 154/)
  assert.doesNotMatch(shadow.detailedHandoff, /\[SB p\.130\]/)
  assert.doesNotMatch(shadow.lesson1Outline, /Activity 6|Track 154/)
  assert.match(shadow.detailedHandoff, /\[SB p\.131\] Activity 7/)
  assert.match(shadow.lesson1Outline, /Activity 7/)
  assertNoWb107(shadow)
})

test('excluding WB106 Activity 5 removes its evidence, language, and attribution', () => {
  const fixture = storyFixture()
  const activity5 = fixture.wbCards.find(
    (card) => card.activityNumber === '5',
  )
  assert.ok(activity5)
  const { lessonPackage } = storyPackage({
    excludedWbCardId: activity5.id,
  })
  const shadow = renderChalkieFromNeutralPackage(lessonPackage)
  const serialized = JSON.stringify(shadow)

  assert.doesNotMatch(serialized, /\[WB p\.106\] Activity 5/)
  assert.doesNotMatch(serialized, /Did Amy eat a burger and fries/)
  assert.doesNotMatch(serialized, /Yes, she did\. \| No, she didn't\./)
  assert.doesNotMatch(shadow.lesson2Outline, /Activity 5|Did Amy/)
  assert.doesNotMatch(shadow.lesson2Vocabulary, /\bunhealthy\b/)
  assert.doesNotMatch(serialized, /official book audio.*Activity 5/i)
  assert.match(shadow.detailedHandoff, /\[WB p\.106\] Activity 6/)
  assert.match(shadow.detailedHandoff, /\[WB p\.106\] Activity THINK BIG/)
  assert.match(shadow.lesson2Outline, /Activity 6/)
  assert.match(shadow.lesson2Outline, /Activity THINK BIG/)
  assertNoWb107(shadow)
})

test('partial Workbook selection remains WB106-only without a facing-page artifact', () => {
  const fixture = storyFixture()
  const activity6 = fixture.wbCards.find(
    (card) => card.activityNumber === '6',
  )
  assert.ok(activity6)
  const { lessonPackage } = storyPackage({
    excludedWbCardId: activity6.id,
  })
  const shadow = renderChalkieFromNeutralPackage(lessonPackage)
  const serialized = JSON.stringify(shadow)

  assert.deepEqual(lessonPackage.lesson2.scope.printedPages, [106])
  assert.equal(lessonPackage.lesson2.selection.status, 'partial_selection')
  assert.match(shadow.detailedHandoff, /Workbook p\. 106 only/)
  assert.match(shadow.lesson2Outline, /Workbook p\. 106 only/)
  assert.doesNotMatch(serialized, /facing|placeholder|p\.?\s*107|106–107/i)
})

test('zero-selected Story lessons remain explicit without fallback or substitution', () => {
  const { lessonPackage } = storyPackage({ zeroSb: true, zeroWb: true })
  const shadow = renderChalkieFromNeutralPackage(lessonPackage)

  assert.match(
    shadow.detailedHandoff,
    /No current Student Book activities were selected/,
  )
  assert.match(
    shadow.detailedHandoff,
    /No Workbook activities were selected/,
  )
  assert.match(
    shadow.detailedHandoff,
    /do not recreate or substitute Workbook teaching content/,
  )
  assert.match(
    shadow.lesson1Outline,
    /No current Student Book activities were selected/,
  )
  assert.match(
    shadow.lesson2Outline,
    /No Workbook activities were selected/,
  )
  assert.equal(shadow.lesson1Vocabulary, '')
  assert.equal(shadow.lesson2Vocabulary, 'No Workbook activities selected.')
  assert.doesNotMatch(
    JSON.stringify(shadow),
    /\[SB p\.13[01]\] Activity|\[WB p\.106\] Activity/,
  )
  assertNoWb107(shadow)
})

test('Story prior support preserves provenance and explicit lesson targets', () => {
  const { lessonPackage } = storyPackage({
    priorSupport: [
      {
        id: 'prior-opener-l1',
        provenance: '[PRIOR]',
        label: 'Earlier Unit 8 healthy-living frame',
        frame: 'Did you eat breakfast?',
        sourceReference: 'BE3 SB Unit 8 p.128',
        evidenceReference: 'human-verified activity',
        purpose: null,
        targetLessons: ['lesson1'],
      },
      {
        id: 'hm-l2',
        provenance: '[HM]',
        label: 'Earlier-unit short answer',
        frame: 'No, she did not.',
        sourceReference: 'BE3 SB Unit 7',
        evidenceReference: 'reviewed horizontal-map record',
        purpose: null,
        targetLessons: ['lesson2'],
      },
      {
        id: 'teacher-both',
        provenance: '[TEACHER-ADDED · UNVERIFIED]',
        label: 'Class reminder',
        frame: 'Answer in a full sentence.',
        sourceReference: null,
        evidenceReference: null,
        purpose: 'Optional response support',
        targetLessons: ['lesson1', 'lesson2'],
      },
    ],
  })
  const handoff =
    renderChalkieFromNeutralPackage(lessonPackage).detailedHandoff

  assert.match(
    handoff,
    /\[PRIOR\] \[Lesson 1\] Earlier Unit 8 healthy-living frame/,
  )
  assert.match(handoff, /\[HM\] \[Lesson 2\] Earlier-unit short answer/)
  assert.match(
    handoff,
    /\[TEACHER-ADDED · UNVERIFIED\] \[Lessons 1 and 2\] Class reminder/,
  )
  assert.doesNotMatch(handoff, /Workbook (?:printed )?page 107|106–107/)
})
