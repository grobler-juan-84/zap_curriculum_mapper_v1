/**
 * Focused Culture-B five-artifact renderer tests.
 * Run: npx tsx --test scripts/tests/renderBe3U08CultureNeutralPackageToChalkieShadow.test.ts
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
import { renderBe3U08CultureNeutralPackageToChalkieShadow } from '../../app/src/features/chalkie/renderBe3U08CultureNeutralPackageToChalkieShadow.ts'
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
    studentBookPrintedPages: [138, 139],
  }).companion
  assert.ok(companion)
  const sbCards = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: [138, 139],
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

test('Culture all-selected render emits five deterministic artifacts with source honesty', () => {
  const { lessonPackage } = allSelectedPackage()
  const a = renderBe3U08CultureNeutralPackageToChalkieShadow(lessonPackage)
  const b = renderBe3U08CultureNeutralPackageToChalkieShadow(lessonPackage)
  assert.deepEqual(a, b)
  assert.match(a.detailedHandoff, /Student Book printed pages 138–139/)
  assert.match(a.detailedHandoff, /Workbook printed pages 113–114/)
  assert.match(a.detailedHandoff, /Audio 160/)
  assert.match(a.detailedHandoff, /Audio 161/)
  assert.match(a.detailedHandoff, /Strange sports|strange sports/)
  assert.match(a.detailedHandoff, /Think Big/)
  assert.match(a.detailedHandoff, /Do not invent/)
  assert.match(a.detailedHandoff, /open and non-keyed|non-keyed/)
  assert.match(a.detailedHandoff, /Look at 21/)
  assert.match(a.detailedHandoff, /stereotypes/)
  assert.doesNotMatch(a.detailedHandoff, /\bNLL summary\b/)
  assert.doesNotMatch(a.detailedHandoff, /Book Intelligence unit|bookIntelligence/)
  assert.match(a.lesson1Outline, /Activity 24/)
  assert.match(a.lesson1Outline, /Activity 27/)
  assert.match(a.lesson2Outline, /Activity 20/)
  assert.match(a.lesson2Outline, /Think Big/)
  assert.match(a.lesson1Vocabulary, /Strange Sports/)
  assert.match(a.lesson2Vocabulary, /Culture Connection/)
  const blob = `${a.detailedHandoff}\n${a.lesson1Outline}\n${a.lesson2Outline}`
  assert.doesNotMatch(blob, /Australia is famous for|Octopush was invented in|Footvolley originated/)
})

test('Culture per-activity exclusion preserves dependency honesty', () => {
  const { companion, sbCards, wbCards } = allSelectedPackage()
  const act25 = sbCards.find((card) => card.activityNumber === '25')
  const act21 = wbCards.find((card) => card.activityNumber === '21')
  assert.ok(act25)
  assert.ok(act21)

  const without25 = buildNeutralSbWbLessonPackage({
    companion,
    sbSelection: createSbActivityHandoffSelection(
      sbCards,
      setSbActivityCardSelected({
        cards: sbCards,
        state: createDefaultSbActivitySelection(sbCards),
        cardId: act25.id,
        selected: false,
      }),
    ),
    wbSelection: createWbActivityHandoffSelection(
      wbCards,
      createDefaultWbActivitySelection(wbCards),
    ),
  })
  const renderedWithout25 =
    renderBe3U08CultureNeutralPackageToChalkieShadow(without25)
  assert.doesNotMatch(
    renderedWithout25.detailedHandoff,
    /\[SB p\.138\] Activity 25:/,
  )
  assert.match(
    renderedWithout25.detailedHandoff,
    /do not reconstruct excluded activities/i,
  )

  const without21 = buildNeutralSbWbLessonPackage({
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
        cardId: act21.id,
        selected: false,
      }),
    ),
  })
  const renderedWithout21 =
    renderBe3U08CultureNeutralPackageToChalkieShadow(without21)
  assert.match(
    renderedWithout21.detailedHandoff,
    /must not reconstruct excluded Activity 21|Do not reconstruct excluded Workbook activities/,
  )
})

test('Culture zero-both selection uses explicit empty states', () => {
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
  const rendered = renderBe3U08CultureNeutralPackageToChalkieShadow(zero)
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

test('Culture renderer fails closed on wrong package identity and keeps NLL prose out', () => {
  const { lessonPackage } = allSelectedPackage()
  const withNll = {
    ...lessonPackage,
    derivedKnowledge: {
      componentKey: 'be3-u08-culture',
      activities: [
        {
          activityId: 'bep3_sb_act_08_24',
          summaryText: 'SECRET-NLL-SUMMARY-MUST-NOT-LEAK',
          evidenceStatus: 'sufficient',
          displayStatus: 'hidden',
          reviewState: 'experimental',
          staleness: 'fresh',
        },
      ],
    },
  } as unknown as NeutralSbWbLessonPackage
  const rendered = renderBe3U08CultureNeutralPackageToChalkieShadow(withNll)
  assert.doesNotMatch(
    JSON.stringify(rendered),
    /SECRET-NLL-SUMMARY-MUST-NOT-LEAK/,
  )

  assert.throws(
    () =>
      renderBe3U08CultureNeutralPackageToChalkieShadow({
        ...lessonPackage,
        identity: {
          ...lessonPackage.identity,
          packageReference: 'be3-sb-wb-u08-p134-135-wb109-110',
        },
      }),
    /not enabled/,
  )
})
