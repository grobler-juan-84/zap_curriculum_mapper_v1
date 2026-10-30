/**
 * Grammar-B renderer contract and source-honesty tests.
 * Run: npx tsx --test scripts/tests/renderBe3U08GrammarNeutralPackageToChalkieShadow.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

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
import { renderBe3U08GrammarNeutralPackageToChalkieShadow } from '../../app/src/features/chalkie/renderBe3U08GrammarNeutralPackageToChalkieShadow.ts'
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

function fixture() {
  const companion = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sbCanonical,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wbCanonical,
    studentBookPrintedPages: [136, 137],
  }).companion
  assert.ok(companion)
  const sbCards = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: [136, 137],
  })
  const wbCards = buildWbActivityCards({
    summary: wbSummary,
    companion,
  })
  return { companion, sbCards, wbCards }
}

function allSelectedPackage() {
  const { companion, sbCards, wbCards } = fixture()
  return buildNeutralSbWbLessonPackage({
    companion,
    sbSelection: createSbActivityHandoffSelection(
      sbCards,
      createDefaultSbActivitySelection(sbCards),
    ),
    wbSelection: createWbActivityHandoffSelection(
      wbCards,
      createDefaultWbActivitySelection(wbCards),
    ),
  })
}

test('Grammar all-selected renderer emits five deterministic artifacts with exact lesson targets', () => {
  const lessonPackage = allSelectedPackage()
  const a = renderBe3U08GrammarNeutralPackageToChalkieShadow(lessonPackage)
  const b = renderBe3U08GrammarNeutralPackageToChalkieShadow(lessonPackage)
  assert.deepEqual(Object.keys(a).sort(), [
    'detailedHandoff',
    'lesson1Outline',
    'lesson1Vocabulary',
    'lesson2Outline',
    'lesson2Vocabulary',
  ])
  assert.deepEqual(a, b)
  assert.deepEqual(a, renderChalkieFromNeutralPackage(lessonPackage))
  assert.match(a.detailedHandoff, /Student Book printed pages 136–137/)
  assert.match(a.detailedHandoff, /Workbook printed pages 111–112/)
  assert.match(a.lesson1Outline, /Student Book pp\. 136–137 only/)
  assert.match(a.lesson2Outline, /Workbook pp\. 111–112 only/)
})

test('Grammar source-honesty keeps Audio 159, chart/cloze/irregular boundaries, and suppresses answer dumps', () => {
  const output = renderBe3U08GrammarNeutralPackageToChalkieShadow(
    allSelectedPackage(),
  )
  const joined = [
    output.detailedHandoff,
    output.lesson1Outline,
    output.lesson2Outline,
    output.lesson1Vocabulary,
    output.lesson2Vocabulary,
  ].join('\n')

  assert.match(joined, /Audio 159/)
  assert.match(joined, /do not invent a transcript/i)
  assert.match(joined, /keyed bicycle answer/i)
  assert.doesNotMatch(joined, /\bon foot\b/i)
  assert.match(joined, /traveled \/ travelled/)
  assert.match(joined, /eight-item irregular|Match eight/i)
  assert.match(joined, /do not borrow Workbook Activity 16/i)
  assert.match(joined, /do not substitute Student Book Activity 20/i)
  assert.match(joined, /thirteen-item narrative cloze/i)
  assert.match(joined, /Was\/Were/)
  assert.match(joined, /not LiA communicative/i)
  assert.match(joined, /didn't \+ base/)
  assert.match(joined, /grammar-box/i)
  assert.doesNotMatch(joined, /NLL-ONLY|derivedKnowledge|summary_text/)
  assert.doesNotMatch(joined, /Language in Action relationship/)
  assert.doesNotMatch(joined, /SB 132–133 as current Grammar/)
})

test('Grammar partial and zero selections do not reconstruct excluded activity evidence', () => {
  const { companion, sbCards, wbCards } = fixture()
  const excludeIds = new Set([
    'bep3_sb_act_08_19',
    'bep3_sb_act_08_20',
    'bep3_sb_act_08_22',
    'bep_3_wb_act_111_15',
    'bep_3_wb_act_111_16',
    'bep_3_wb_act_112_18',
  ])

  let sbState = createDefaultSbActivitySelection(sbCards)
  for (const card of sbCards) {
    if (excludeIds.has(card.references.activityId)) {
      sbState = setSbActivityCardSelected({
        cards: sbCards,
        state: sbState,
        cardId: card.id,
        selected: false,
      })
    }
  }
  let wbState = createDefaultWbActivitySelection(wbCards)
  for (const card of wbCards) {
    const id = card.references[0]?.activityId
    if (id && excludeIds.has(id)) {
      wbState = setWbActivityCardSelected({
        cards: wbCards,
        state: wbState,
        cardId: card.id,
        selected: false,
      })
    }
  }

  const partial = renderBe3U08GrammarNeutralPackageToChalkieShadow(
    buildNeutralSbWbLessonPackage({
      companion,
      sbSelection: createSbActivityHandoffSelection(sbCards, sbState),
      wbSelection: createWbActivityHandoffSelection(wbCards, wbState),
    }),
  )
  assert.doesNotMatch(partial.detailedHandoff, /Audio 159/)
  assert.doesNotMatch(partial.detailedHandoff, /\[SB p\.136\] Activity 19:/)
  assert.doesNotMatch(partial.detailedHandoff, /\[SB p\.136\] Activity 20:/)
  assert.doesNotMatch(partial.detailedHandoff, /\[SB p\.137\] Activity 22:/)
  assert.doesNotMatch(partial.detailedHandoff, /\[WB p\.111\] Activity 15:/)
  assert.doesNotMatch(partial.detailedHandoff, /\[WB p\.111\] Activity 16:/)
  assert.doesNotMatch(partial.detailedHandoff, /\[WB p\.112\] Activity 18:/)
  assert.match(partial.detailedHandoff, /\[SB p\.137\] Activity 21:/)
  assert.match(partial.detailedHandoff, /\[SB p\.137\] Activity 23:/)
  assert.match(partial.detailedHandoff, /\[WB p\.111\] Activity 17:/)
  assert.match(partial.detailedHandoff, /\[WB p\.112\] Activity 19:/)

  const zero = renderBe3U08GrammarNeutralPackageToChalkieShadow(
    buildNeutralSbWbLessonPackage({
      companion,
      sbSelection: createSbActivityHandoffSelection(sbCards, {
        selectedCardIds: [],
      }),
      wbSelection: createWbActivityHandoffSelection(wbCards, {
        selectedCardIds: [],
      }),
    }),
  )
  assert.match(
    zero.detailedHandoff,
    /No current Student Book activities were selected/,
  )
  assert.match(zero.detailedHandoff, /No Workbook activities were selected/)
  assert.equal(zero.lesson2Vocabulary, 'No Workbook activities selected.')
  assert.doesNotMatch(zero.detailedHandoff, /Audio 159/)
  assert.doesNotMatch(zero.lesson1Outline, /Activity 19/)
})

test('Grammar renderer fails closed on wrong package identity', () => {
  const openerPages = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sbCanonical,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wbCanonical,
    studentBookPrintedPages: [128, 129],
  }).companion
  assert.ok(openerPages)
  const sbCards = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: [128, 129],
  })
  const wbCards = buildWbActivityCards({
    summary: wbSummary,
    companion: openerPages,
  })
  const openerPackage = buildNeutralSbWbLessonPackage({
    companion: openerPages,
    sbSelection: createSbActivityHandoffSelection(
      sbCards,
      createDefaultSbActivitySelection(sbCards),
    ),
    wbSelection: createWbActivityHandoffSelection(
      wbCards,
      createDefaultWbActivitySelection(wbCards),
    ),
  })
  assert.throws(
    () => renderBe3U08GrammarNeutralPackageToChalkieShadow(openerPackage),
    /Grammar Chalkie shadow rendering is not enabled/,
  )
})
