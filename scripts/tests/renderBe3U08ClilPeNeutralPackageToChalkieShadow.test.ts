/**
 * Focused CLIL-B five-artifact renderer tests.
 * Run: npx tsx --test scripts/tests/renderBe3U08ClilPeNeutralPackageToChalkieShadow.test.ts
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
import { renderBe3U08ClilPeNeutralPackageToChalkieShadow } from '../../app/src/features/chalkie/renderBe3U08ClilPeNeutralPackageToChalkieShadow.ts'
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
    studentBookPrintedPages: [134, 135],
  }).companion
  assert.ok(companion)
  const sbCards = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: [134, 135],
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

test('CLIL all-selected render emits five deterministic artifacts with source honesty', () => {
  const { lessonPackage } = allSelectedPackage()
  const a = renderBe3U08ClilPeNeutralPackageToChalkieShadow(lessonPackage)
  const b = renderBe3U08ClilPeNeutralPackageToChalkieShadow(lessonPackage)
  assert.deepEqual(a, b)
  assert.match(a.detailedHandoff, /Student Book printed pages 134–135/)
  assert.match(a.detailedHandoff, /Workbook printed pages 109–110/)
  assert.match(a.detailedHandoff, /Audio 157/)
  assert.match(a.detailedHandoff, /Audio 158/)
  assert.match(a.detailedHandoff, /Exercise Chart/)
  assert.match(a.detailedHandoff, /Inside \/ Outside/)
  assert.match(a.detailedHandoff, /Think Big/)
  assert.match(a.detailedHandoff, /Do not invent/)
  assert.doesNotMatch(a.detailedHandoff, /\bNLL summary\b/)
  assert.doesNotMatch(a.detailedHandoff, /Book Intelligence unit|bookIntelligence/)
  assert.match(a.lesson1Outline, /Activity 13/)
  assert.match(a.lesson1Outline, /Activity 18/)
  assert.match(a.lesson2Outline, /Activity 11/)
  assert.match(a.lesson2Outline, /Think Big/)
  assert.match(a.lesson1Vocabulary, /calorie/)
  assert.match(a.lesson2Vocabulary, /measure/)
  assert.doesNotMatch(
    `${a.detailedHandoff}\n${a.lesson1Outline}\n${a.lesson2Outline}`,
    /A calorie is a measure of the energy you get from food|Because he burned all the calories|Michael Phelps ate/,
  )
})

test('CLIL per-activity exclusion preserves dependency honesty', () => {
  const { companion, sbCards, wbCards } = allSelectedPackage()
  const act14 = sbCards.find((card) => card.activityNumber === '14')
  const act12 = wbCards.find((card) => card.activityNumber === '12')
  assert.ok(act14)
  assert.ok(act12)

  const without14 = buildNeutralSbWbLessonPackage({
    companion,
    sbSelection: createSbActivityHandoffSelection(
      sbCards,
      setSbActivityCardSelected({
        cards: sbCards,
        state: createDefaultSbActivitySelection(sbCards),
        cardId: act14.id,
        selected: false,
      }),
    ),
    wbSelection: createWbActivityHandoffSelection(
      wbCards,
      createDefaultWbActivitySelection(wbCards),
    ),
  })
  const renderedWithout14 =
    renderBe3U08ClilPeNeutralPackageToChalkieShadow(without14)
  assert.doesNotMatch(
    renderedWithout14.detailedHandoff,
    /\[SB p\.134\] Activity 14:/,
  )
  assert.match(
    renderedWithout14.detailedHandoff,
    /do not reconstruct excluded activities/i,
  )

  const without12 = buildNeutralSbWbLessonPackage({
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
        cardId: act12.id,
        selected: false,
      }),
    ),
  })
  const renderedWithout12 =
    renderBe3U08ClilPeNeutralPackageToChalkieShadow(without12)
  assert.match(
    renderedWithout12.detailedHandoff,
    /must not reconstruct excluded Activity 12|Do not reconstruct excluded Workbook activities/,
  )
})

test('CLIL zero-both selection uses explicit empty states', () => {
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
  const rendered = renderBe3U08ClilPeNeutralPackageToChalkieShadow(zero)
  assert.match(
    rendered.detailedHandoff,
    /No current Student Book activities were selected/,
  )
  assert.match(rendered.detailedHandoff, /No Workbook activities were selected/)
  assert.equal(rendered.lesson1Vocabulary, '')
  assert.equal(rendered.lesson2Vocabulary, 'No Workbook activities selected.')
  assert.match(rendered.lesson1Outline, /No current Student Book activities/)
  assert.match(rendered.lesson2Outline, /No Workbook activities were selected/)
})

test('CLIL renderer fails closed on wrong package identity and keeps NLL prose out', () => {
  const { lessonPackage } = allSelectedPackage()
  const withNll = {
    ...lessonPackage,
    derivedKnowledge: {
      componentKey: 'be3-u08-clil-pe',
      activities: [
        {
          activityId: 'bep3_sb_act_08_13',
          summaryText: 'SECRET-NLL-SUMMARY-MUST-NOT-LEAK',
          evidenceStatus: 'sufficient',
          displayStatus: 'hidden',
          reviewState: 'experimental',
          staleness: 'fresh',
        },
      ],
    },
  } as unknown as NeutralSbWbLessonPackage
  const rendered = renderBe3U08ClilPeNeutralPackageToChalkieShadow(withNll)
  assert.doesNotMatch(
    JSON.stringify(rendered),
    /SECRET-NLL-SUMMARY-MUST-NOT-LEAK/,
  )

  assert.throws(
    () =>
      renderBe3U08ClilPeNeutralPackageToChalkieShadow({
        ...lessonPackage,
        identity: {
          ...lessonPackage.identity,
          packageReference: 'be3-sb-wb-u08-p136-137-wb111-112',
        },
      }),
    /not enabled/,
  )
})
