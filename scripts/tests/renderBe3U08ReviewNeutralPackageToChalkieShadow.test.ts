/**
 * Focused Review-B five-artifact renderer tests.
 * Run: npx tsx --test scripts/tests/renderBe3U08ReviewNeutralPackageToChalkieShadow.test.ts
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
import { renderBe3U08ReviewNeutralPackageToChalkieShadow } from '../../app/src/features/chalkie/renderBe3U08ReviewNeutralPackageToChalkieShadow.ts'
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
    studentBookPrintedPages: [143],
  }).companion
  assert.ok(companion)
  const sbCards = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: [143],
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

test('Review all-selected render emits five deterministic artifacts with source honesty', () => {
  const { lessonPackage } = allSelectedPackage()
  const a = renderBe3U08ReviewNeutralPackageToChalkieShadow(lessonPackage)
  const b = renderBe3U08ReviewNeutralPackageToChalkieShadow(lessonPackage)
  assert.deepEqual(a, b)
  assert.match(a.detailedHandoff, /Student Book printed page 143/)
  assert.match(a.detailedHandoff, /Workbook printed page 117/)
  assert.match(a.detailedHandoff, /no SB audio/)
  assert.match(a.detailedHandoff, /Did you/)
  assert.match(a.detailedHandoff, /Open class survey/)
  assert.match(a.detailedHandoff, /Do not invent/)
  assert.match(a.detailedHandoff, /word box/)
  assert.match(a.detailedHandoff, /gerund-as-subject/)
  assert.match(a.detailedHandoff, /Values page SB 142/)
  assert.doesNotMatch(a.detailedHandoff, /\bNLL summary\b/)
  assert.doesNotMatch(a.detailedHandoff, /Book Intelligence unit|bookIntelligence/)
  assert.doesNotMatch(
    a.detailedHandoff,
    /Here is a sample response|Sample student paragraph|Rubric criteria:|no SB audio transcript:/i,
  )
  assert.match(a.lesson1Outline, /Activity 39/)
  assert.match(a.lesson1Outline, /Activity 41/)
  assert.match(a.lesson2Outline, /Activity 31/)
  assert.match(a.lesson2Outline, /Activity 33/)
  assert.match(a.lesson1Vocabulary, /Did \/ did \/ didn't/)
  assert.match(a.lesson2Vocabulary, /Workbook Review vocabulary/)
})

test('Review per-activity exclusion preserves keyed/open honesty', () => {
  const { companion, sbCards, wbCards } = allSelectedPackage()
  const act39 = sbCards.find((card) => card.activityNumber === '39')
  const act32 = wbCards.find((card) => card.activityNumber === '32')
  assert.ok(act39)
  assert.ok(act32)

  const without39 = buildNeutralSbWbLessonPackage({
    companion,
    sbSelection: createSbActivityHandoffSelection(
      sbCards,
      setSbActivityCardSelected({
        cards: sbCards,
        state: createDefaultSbActivitySelection(sbCards),
        cardId: act39.id,
        selected: false,
      }),
    ),
    wbSelection: createWbActivityHandoffSelection(
      wbCards,
      createDefaultWbActivitySelection(wbCards),
    ),
  })
  const renderedWithout39 =
    renderBe3U08ReviewNeutralPackageToChalkieShadow(without39)
  assert.doesNotMatch(
    renderedWithout39.detailedHandoff,
    /\[SB p\.140\] Activity 39:/,
  )
  assert.doesNotMatch(
    renderedWithout39.detailedHandoff,
    /\[SB p\.143\] Activity 39:/,
  )
  assert.match(
    renderedWithout39.detailedHandoff,
    /do not reconstruct excluded activities/i,
  )

  const without32 = buildNeutralSbWbLessonPackage({
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
        cardId: act32.id,
        selected: false,
      }),
    ),
  })
  const renderedWithout32 =
    renderBe3U08ReviewNeutralPackageToChalkieShadow(without32)
  assert.doesNotMatch(
    renderedWithout32.detailedHandoff,
    /\[WB p\.115\] Activity 25:/,
  )
  assert.match(
    renderedWithout32.detailedHandoff,
    /Do not reconstruct excluded Workbook activities/,
  )
})

test('Review zero-both selection uses explicit empty states without substitute tasks', () => {
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
  const rendered = renderBe3U08ReviewNeutralPackageToChalkieShadow(zero)
  assert.match(
    rendered.detailedHandoff,
    /No current Student Book activities were selected/,
  )
  assert.match(rendered.detailedHandoff, /No Workbook activities were selected/)
  assert.match(rendered.detailedHandoff, /generic Unit 8 wrap-up/)
  assert.equal(rendered.lesson1Vocabulary, '')
  assert.equal(rendered.lesson2Vocabulary, 'No Workbook activities selected.')
  assert.match(rendered.lesson1Outline, /No current Student Book activities/)
  assert.match(rendered.lesson2Outline, /No Workbook activities were selected/)
})

test('Review renderer fails closed on wrong package identity and keeps NLL prose out', () => {
  const { lessonPackage } = allSelectedPackage()
  const withNll = {
    ...lessonPackage,
    derivedKnowledge: {
      componentKey: 'be3-u08-review',
      activities: [
        {
          activityId: 'bep3_sb_act_08_39',
          summaryText: 'SECRET-NLL-SUMMARY-MUST-NOT-LEAK',
          evidenceStatus: 'sufficient',
          displayStatus: 'hidden',
          reviewState: 'experimental',
          staleness: 'fresh',
        },
      ],
    },
  } as unknown as NeutralSbWbLessonPackage
  const rendered = renderBe3U08ReviewNeutralPackageToChalkieShadow(withNll)
  assert.doesNotMatch(
    JSON.stringify(rendered),
    /SECRET-NLL-SUMMARY-MUST-NOT-LEAK/,
  )

  assert.throws(
    () =>
      renderBe3U08ReviewNeutralPackageToChalkieShadow({
        ...lessonPackage,
        identity: {
          ...lessonPackage.identity,
          packageReference: 'be3-sb-wb-u08-p140-wb115',
        },
      }),
    /not enabled/,
  )
})
