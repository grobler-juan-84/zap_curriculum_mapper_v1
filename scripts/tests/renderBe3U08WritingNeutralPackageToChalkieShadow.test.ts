/**
 * Focused Writing-B five-artifact renderer tests.
 * Run: npx tsx --test scripts/tests/renderBe3U08WritingNeutralPackageToChalkieShadow.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { buildNeutralSbWbLessonPackage } from '../../app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts'
import type { NeutralSbWbLessonPackage } from '../../app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts'
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
import { renderBe3U08WritingNeutralPackageToChalkieShadow } from '../../app/src/features/chalkie/renderBe3U08WritingNeutralPackageToChalkieShadow.ts'
import { resolveVerifiedSbWbCompanion } from '../../app/src/features/chalkie/resolveVerifiedSbWbCompanion.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const sbCanonical = JSON.parse(
  fs.readFileSync(
    path.join(ROOT, 'data/phase1/big_english_3_sb/canonical/v1.json'),
    'utf8',
  ),
) as Record<string, unknown>
const wbCanonical = JSON.parse(
  fs.readFileSync(
    path.join(ROOT, 'data/phase1/big_english_3_wb/canonical/v1.json'),
    'utf8',
  ),
) as Record<string, unknown>

function summaryFromCanonical(
  raw: Record<string, unknown>,
  catalogBookId: string,
): BatchJsonSummary {
  return {
    catalogBookId,
    units: [
      {
        unitNumber: 8,
        title: 'Healthy Living',
        printedPageStart: 128,
        printedPageEnd: 143,
      },
    ],
    vocabulary: [],
    language: [],
    activities: [],
    pages: [],
    raw,
  }
}

const sbSummary = summaryFromCanonical(sbCanonical, 'big_english_3_sb')
const wbSummary = summaryFromCanonical(wbCanonical, 'big_english_3_wb')

function allSelectedPackage() {
  const companion = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sbCanonical,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wbCanonical,
    studentBookPrintedPages: [140],
  }).companion
  assert.ok(companion)
  const sbCards = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: [140],
  })
  const wbCards = buildWbActivityCards({ summary: wbSummary, companion })
  return {
    companion,
    sbCards,
    wbCards,
    lessonPackage: buildNeutralSbWbLessonPackage({
      companion,
      sbSelection: createSbActivityHandoffSelection(
        sbCards,
        createDefaultSbActivitySelection(sbCards),
      ),
      wbSelection: createWbActivityHandoffSelection(
        wbCards,
        createDefaultWbActivitySelection(wbCards),
      ),
    }),
  }
}

test('Writing all-selected render emits five deterministic artifacts with source honesty', () => {
  const { lessonPackage } = allSelectedPackage()
  const a = renderBe3U08WritingNeutralPackageToChalkieShadow(lessonPackage)
  const b = renderBe3U08WritingNeutralPackageToChalkieShadow(lessonPackage)
  assert.deepEqual(a, b)
  assert.match(a.detailedHandoff, /Student Book printed page 140/)
  assert.match(a.detailedHandoff, /Workbook printed page 115/)
  assert.match(a.detailedHandoff, /Audio 162/)
  assert.match(a.detailedHandoff, /healthy habits/)
  assert.match(a.detailedHandoff, /Open production/)
  assert.match(a.detailedHandoff, /Do not invent/)
  assert.match(a.detailedHandoff, /clause box/)
  assert.match(a.detailedHandoff, /paragraph cloze/)
  assert.match(a.detailedHandoff, /Phonics pages SB 141/)
  assert.doesNotMatch(a.detailedHandoff, /\bNLL summary\b/)
  assert.doesNotMatch(a.detailedHandoff, /Book Intelligence unit|bookIntelligence/)
  assert.doesNotMatch(
    a.detailedHandoff,
    /Here is a sample response|Sample student paragraph|Rubric criteria:|Audio 162 transcript:/i,
  )
  assert.match(a.lesson1Outline, /Activity 28/)
  assert.match(a.lesson1Outline, /Activity 31/)
  assert.match(a.lesson2Outline, /Activity 24/)
  assert.match(a.lesson2Outline, /Activity 26/)
  assert.match(a.lesson1Vocabulary, /coordinating conjunctions/)
  assert.match(a.lesson2Vocabulary, /Workbook Writing vocabulary/)
})

test('Writing per-activity exclusion preserves keyed/open honesty', () => {
  const { companion, sbCards, wbCards } = allSelectedPackage()
  const act28 = sbCards.find((card) => card.activityNumber === '28')
  const act25 = wbCards.find((card) => card.activityNumber === '25')
  assert.ok(act28)
  assert.ok(act25)

  const without28 = buildNeutralSbWbLessonPackage({
    companion,
    sbSelection: createSbActivityHandoffSelection(
      sbCards,
      setSbActivityCardSelected({
        cards: sbCards,
        state: createDefaultSbActivitySelection(sbCards),
        cardId: act28.id,
        selected: false,
      }),
    ),
    wbSelection: createWbActivityHandoffSelection(
      wbCards,
      createDefaultWbActivitySelection(wbCards),
    ),
  })
  const renderedWithout28 =
    renderBe3U08WritingNeutralPackageToChalkieShadow(without28)
  assert.doesNotMatch(
    renderedWithout28.detailedHandoff,
    /\[SB p\.140\] Activity 28:/,
  )
  assert.doesNotMatch(renderedWithout28.detailedHandoff, /Audio 162/)
  assert.match(
    renderedWithout28.detailedHandoff,
    /do not reconstruct excluded activities/i,
  )

  const without25 = buildNeutralSbWbLessonPackage({
    companion,
    sbSelection: createSbActivityHandoffSelection(
      sbCards,
      createDefaultSbActivitySelection(sbCards),
    ),
    wbSelection: createWbActivityHandoffSelection(
      wbCards,
      setWbActivityCardSelected({
        cards: wbCards,
        state: createDefaultWbActivitySelection(wbCards),
        cardId: act25.id,
        selected: false,
      }),
    ),
  })
  const renderedWithout25 =
    renderBe3U08WritingNeutralPackageToChalkieShadow(without25)
  assert.doesNotMatch(
    renderedWithout25.detailedHandoff,
    /\[WB p\.115\] Activity 25:/,
  )
  assert.match(
    renderedWithout25.detailedHandoff,
    /Do not reconstruct excluded Workbook activities/,
  )
})

test('Writing zero-both selection uses explicit empty states without substitute tasks', () => {
  const { companion, sbCards, wbCards } = allSelectedPackage()
  const zero = buildNeutralSbWbLessonPackage({
    companion,
    sbSelection: createSbActivityHandoffSelection(sbCards, {
      selectedCardIds: [],
    }),
    wbSelection: createWbActivityHandoffSelection(wbCards, {
      selectedCardIds: [],
    }),
  })
  const rendered = renderBe3U08WritingNeutralPackageToChalkieShadow(zero)
  assert.match(
    rendered.detailedHandoff,
    /No current Student Book activities were selected/,
  )
  assert.match(rendered.detailedHandoff, /No Workbook activities were selected/)
  assert.match(rendered.detailedHandoff, /substitute writing task/)
  assert.equal(rendered.lesson1Vocabulary, '')
  assert.equal(rendered.lesson2Vocabulary, 'No Workbook activities selected.')
  assert.match(rendered.lesson1Outline, /No current Student Book activities/)
  assert.match(rendered.lesson2Outline, /No Workbook activities were selected/)
})

test('Writing renderer fails closed on wrong package identity and keeps NLL prose out', () => {
  const { lessonPackage } = allSelectedPackage()
  const withNll = {
    ...lessonPackage,
    derivedKnowledge: {
      componentKey: 'be3-u08-writing',
      activities: [
        {
          activityId: 'bep3_sb_act_08_28',
          summaryText: 'SECRET-NLL-SUMMARY-MUST-NOT-LEAK',
          evidenceStatus: 'sufficient',
          displayStatus: 'hidden',
          reviewState: 'experimental',
          staleness: 'fresh',
        },
      ],
    },
  } as unknown as NeutralSbWbLessonPackage
  const rendered = renderBe3U08WritingNeutralPackageToChalkieShadow(withNll)
  assert.doesNotMatch(
    JSON.stringify(rendered),
    /SECRET-NLL-SUMMARY-MUST-NOT-LEAK/,
  )

  assert.throws(
    () =>
      renderBe3U08WritingNeutralPackageToChalkieShadow({
        ...lessonPackage,
        identity: {
          ...lessonPackage.identity,
          packageReference: 'be3-sb-wb-u08-p141-wb116',
        },
      }),
    /not enabled/,
  )
})
