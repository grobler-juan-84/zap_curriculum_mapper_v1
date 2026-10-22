/**
 * Test-only parity proof for the neutral-package Opener Chalkie renderer.
 * Run: npx tsx --test scripts/tests/renderBe3U08OpenerNeutralPackageToChalkieShadow.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { buildBe3U08OpenerSbWbSeriesHandoff } from '../../app/src/features/chalkie/buildBe3U08OpenerSbWbSeriesHandoff.ts'
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
import { renderBe3U08OpenerNeutralPackageToChalkieShadow } from '../../app/src/features/chalkie/renderBe3U08OpenerNeutralPackageToChalkieShadow.ts'
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

function openerFixture() {
  const companion = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sbCanonical,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wbCanonical,
    studentBookPrintedPages: [128, 129],
  }).companion
  assert.ok(companion)
  const sbCards = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: [128, 129],
  })
  const wbCards = buildWbActivityCards({
    summary: wbSummary,
    companion,
  })
  return { companion, sbCards, wbCards }
}

function allSelectedPackage() {
  const fixture = openerFixture()
  return {
    ...fixture,
    lessonPackage: buildNeutralSbWbLessonPackage({
      companion: fixture.companion,
      sbSelection: createSbActivityHandoffSelection(
        fixture.sbCards,
        createDefaultSbActivitySelection(fixture.sbCards),
      ),
      wbSelection: createWbActivityHandoffSelection(
        fixture.wbCards,
        createDefaultWbActivitySelection(fixture.wbCards),
      ),
    }),
  }
}

test('all-selected neutral Opener package exactly matches five accepted outputs', () => {
  const { lessonPackage } = allSelectedPackage()
  const shadow =
    renderBe3U08OpenerNeutralPackageToChalkieShadow(lessonPackage)
  const accepted = buildBe3U08OpenerSbWbSeriesHandoff()

  assert.deepEqual(shadow, {
    detailedHandoff: accepted.detailedHandoff,
    lesson1Outline: accepted.lesson1Outline,
    lesson1Vocabulary: accepted.lesson1Vocabulary,
    lesson2Outline: accepted.lesson2Outline,
    lesson2Vocabulary: accepted.lesson2Vocabulary,
  })
})

test('excluded SB and WB activities stay absent from shadow output', () => {
  const fixture = openerFixture()
  const sbExcluded = fixture.sbCards.find(
    (card) => card.printedPage === 129 && card.activityNumber === '4',
  )
  const wbExcluded = fixture.wbCards.find(
    (card) => card.printedPage === 105 && card.activityNumber === '3',
  )
  assert.ok(sbExcluded)
  assert.ok(wbExcluded)

  const lessonPackage = buildNeutralSbWbLessonPackage({
    companion: fixture.companion,
    sbSelection: createSbActivityHandoffSelection(
      fixture.sbCards,
      setSbActivityCardSelected({
        cards: fixture.sbCards,
        state: createDefaultSbActivitySelection(fixture.sbCards),
        cardId: sbExcluded.id,
        selected: false,
      }),
    ),
    wbSelection: createWbActivityHandoffSelection(
      fixture.wbCards,
      setWbActivityCardSelected({
        cards: fixture.wbCards,
        state: createDefaultWbActivitySelection(fixture.wbCards),
        cardId: wbExcluded.id,
        selected: false,
      }),
    ),
  })
  const shadow =
    renderBe3U08OpenerNeutralPackageToChalkieShadow(lessonPackage)
  const serialized = JSON.stringify(shadow)

  assert.doesNotMatch(
    serialized,
    /Listen and sing\. How does Zach feel today\?/,
  )
  assert.doesNotMatch(serialized, /Listen and write\./)
  assert.doesNotMatch(serialized, /Track 153|Audio track 153/)
  assert.doesNotMatch(shadow.lesson1Outline, /Activity 4:/)
  assert.doesNotMatch(shadow.lesson2Outline, /Activity 3:/)
  assert.doesNotMatch(shadow.lesson2Vocabulary, /\benough\b/)
  assert.match(shadow.lesson1Outline, /Activity 5:/)
  assert.match(shadow.lesson2Outline, /Activity 4:/)
})

test('zero-selected lessons render honest existing empty states without fallback', () => {
  const fixture = openerFixture()
  const lessonPackage = buildNeutralSbWbLessonPackage({
    companion: fixture.companion,
    sbSelection: createSbActivityHandoffSelection(fixture.sbCards, {
      selectedCardIds: [],
    }),
    wbSelection: createWbActivityHandoffSelection(fixture.wbCards, {
      selectedCardIds: [],
    }),
  })
  const shadow =
    renderBe3U08OpenerNeutralPackageToChalkieShadow(lessonPackage)

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
    /\[SB p\.12[89]\] Activity|\[WB p\.10[45]\] Activity/,
  )
})

test('prior support retains provenance and explicit lesson targeting', () => {
  const fixture = openerFixture()
  const lessonPackage = buildNeutralSbWbLessonPackage({
    companion: fixture.companion,
    sbSelection: createSbActivityHandoffSelection(
      fixture.sbCards,
      createDefaultSbActivitySelection(fixture.sbCards),
    ),
    wbSelection: createWbActivityHandoffSelection(
      fixture.wbCards,
      createDefaultWbActivitySelection(fixture.wbCards),
    ),
    priorSupport: [
      {
        id: 'prior-l1',
        provenance: '[PRIOR]',
        label: 'Earlier Unit 8 frame',
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
        frame: 'Yes, I did.',
        sourceReference: 'BE3 SB Unit 7',
        evidenceReference: 'reviewed horizontal-map record',
        purpose: null,
        targetLessons: ['lesson2'],
      },
      {
        id: 'teacher-both',
        provenance: '[TEACHER-ADDED · UNVERIFIED]',
        label: 'Class reminder',
        frame: 'Use a full answer.',
        sourceReference: null,
        evidenceReference: null,
        purpose: 'Optional response support',
        targetLessons: ['lesson1', 'lesson2'],
      },
    ],
  })
  const handoff =
    renderBe3U08OpenerNeutralPackageToChalkieShadow(
      lessonPackage,
    ).detailedHandoff

  assert.match(handoff, /\[PRIOR\] \[Lesson 1\] Earlier Unit 8 frame/)
  assert.match(handoff, /\[HM\] \[Lesson 2\] Earlier-unit short answer/)
  assert.match(
    handoff,
    /\[TEACHER-ADDED · UNVERIFIED\] \[Lessons 1 and 2\] Class reminder/,
  )
})
