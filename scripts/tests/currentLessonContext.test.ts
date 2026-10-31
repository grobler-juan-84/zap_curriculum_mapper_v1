/**
 * Neutral current-lesson context: shared activity model for left panel + selection.
 * Run: npx tsx --test scripts/tests/currentLessonContext.test.ts
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildCurrentLessonContext,
  buildBookContentCollapsedSummary,
} from '../../app/src/features/chalkie/currentLessonContext.ts'
import {
  createDefaultSbActivitySelection,
  createSbActivityHandoffSelection,
  setSbActivityCardSelected,
} from '../../app/src/features/chalkie/chalkieActivitySelection.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'
import type { BookIntelligenceOverviewDocument } from '../../app/src/types/bookIntelligence.ts'

function summaryWithActivities(
  activities: Record<string, unknown>[],
  pages: Array<{ page_id: string; printed_page: number }>,
): BatchJsonSummary {
  return {
    catalogBookId: 'big_english_3_sb',
    units: [
      {
        unitNumber: 1,
        title: 'Wake Up!',
        printedPageStart: 4,
        printedPageEnd: 5,
      },
    ],
    vocabulary: [],
    language: [],
    activities: [],
    pages: pages.map((page) => ({
      printedPage: page.printed_page,
      pdfPage: page.printed_page,
    })),
    raw: {
      book_id: 'big_english_3_sb',
      pages: pages.map((page) => ({
        page_id: page.page_id,
        printed_page: page.printed_page,
        section_title: 'Vocabulary',
      })),
      vocabulary: [],
      language: [],
      activities,
      curriculum_components: [],
    },
  }
}

const PAGE = { page_id: 'big_english_3_sb_p004', printed_page: 4 }

test('sparse opener activity: no invented enrichment on shared cards', () => {
  const summary = summaryWithActivities(
    [
      {
        activity_id: 'big_english_3_sb_act_sparse_1',
        book_id: 'big_english_3_sb',
        unit_id: 'big_english_3_sb_u01',
        page_id: PAGE.page_id,
        printed_page: PAGE.printed_page,
        activity_number: '1',
        instruction: 'Listen, look, and say.',
        audio_dependency: true,
        visual_dependency: false,
        language_frame: null,
        prompt: null,
        expected_answer: null,
        items: [],
        verification_status: 'human_verified',
      },
    ],
    [PAGE],
  )

  const context = buildCurrentLessonContext({
    summary,
    sbPrintedPages: [4],
    bookIntelligence: null,
  })

  assert.equal(context.bookContent.sbActivities.length, 1)
  const card = context.bookContent.sbActivities[0]
  assert.ok(card)
  assert.equal(card.verifiedWording, 'Listen, look, and say.')
  assert.equal(card.evidence.audioDependency, true)
  assert.equal(card.evidence.visualDependency, false)
  assert.equal(card.evidence.languageFrame, null)
  assert.equal(card.evidence.prompt, null)
  assert.equal(card.evidence.expectedAnswer, null)
  assert.equal(card.evidence.items.length, 0)
  assert.equal(card.preview.kind, 'empty')
  assert.deepEqual(card.preview.values, [])
  assert.equal(card.pageDedicatedVocabulary.length, 0)

  // Book Intelligence must not leak into page-scoped book content.
  assert.equal(context.bookIntelligence.status, 'unavailable')
  assert.equal(context.bookContent.pagesView.vocabulary.includes('Learning Outcomes'), false)
})

test('rich activity: visible fields agree with handoff selection evidence', () => {
  const summary = summaryWithActivities(
    [
      {
        activity_id: 'big_english_3_sb_act_rich_1',
        book_id: 'big_english_3_sb',
        unit_id: 'big_english_3_sb_u01',
        page_id: PAGE.page_id,
        printed_page: PAGE.printed_page,
        activity_number: '2',
        activity_type: 'ask_and_answer',
        instruction: 'Ask and answer.',
        language_frame: 'What do you do? / I wake up.',
        prompt: 'What do you do?',
        expected_answer: 'I wake up.',
        audio_dependency: false,
        visual_dependency: true,
        source_dependency_note: 'Uses page pictures.',
        items: [
          {
            item_number: '1',
            prompt: 'What do you do?',
            expected_answer: 'I wake up.',
          },
        ],
        verification_status: 'human_verified',
      },
    ],
    [PAGE],
  )

  const context = buildCurrentLessonContext({
    summary,
    sbPrintedPages: [4],
  })
  const card = context.bookContent.sbActivities[0]
  assert.ok(card)
  assert.equal(card.evidence.activityType, 'ask_and_answer')
  assert.equal(card.evidence.languageFrame, 'What do you do? / I wake up.')
  assert.equal(card.evidence.visualDependency, true)
  assert.equal(card.evidence.items.length, 1)

  const handoff = createSbActivityHandoffSelection(
    context.bookContent.sbActivities,
    createDefaultSbActivitySelection(context.bookContent.sbActivities),
  )
  assert.equal(handoff.selectedEvidence.length, 1)
  const selected = handoff.selectedEvidence[0]
  assert.ok(selected)
  assert.equal(selected.references.activityId, card.references.activityId)
  assert.equal(selected.languageFrame, card.evidence.languageFrame)
  assert.equal(selected.activityType, card.evidence.activityType)
  assert.equal(selected.visualDependency, card.evidence.visualDependency)
  assert.equal(selected.items[0]?.expectedAnswer, 'I wake up.')
})

test('deselected activity cannot reappear in handoff selection', () => {
  const summary = summaryWithActivities(
    [
      {
        activity_id: 'big_english_3_sb_act_a',
        book_id: 'big_english_3_sb',
        page_id: PAGE.page_id,
        printed_page: PAGE.printed_page,
        activity_number: '1',
        instruction: 'Listen, look, and say.',
        verification_status: 'human_verified',
      },
      {
        activity_id: 'big_english_3_sb_act_b',
        book_id: 'big_english_3_sb',
        page_id: PAGE.page_id,
        printed_page: PAGE.printed_page,
        activity_number: '2',
        instruction: 'Play a game.',
        verification_status: 'human_verified',
      },
    ],
    [PAGE],
  )

  const context = buildCurrentLessonContext({
    summary,
    sbPrintedPages: [4],
  })
  const cards = context.bookContent.sbActivities
  assert.equal(cards.length, 2)
  const excluded = cards[1]
  assert.ok(excluded)

  const state = setSbActivityCardSelected({
    cards,
    state: createDefaultSbActivitySelection(cards),
    cardId: excluded.id,
    selected: false,
  })
  const handoff = createSbActivityHandoffSelection(cards, state)
  assert.equal(handoff.selectedEvidence.length, 1)
  assert.equal(
    handoff.selectedEvidence.some((row) => row.cardId === excluded.id),
    false,
  )
  assert.equal(
    handoff.selectedEvidence.some((row) =>
      row.verifiedWording.includes('Play a game'),
    ),
    false,
  )
})

test('Book Intelligence stays separate from page-scoped book content', () => {
  const summary = summaryWithActivities(
    [
      {
        activity_id: 'big_english_3_sb_act_bi_sep',
        book_id: 'big_english_3_sb',
        page_id: PAGE.page_id,
        printed_page: PAGE.printed_page,
        activity_number: '1',
        instruction: 'Listen, look, and say.',
        verification_status: 'human_verified',
      },
    ],
    [PAGE],
  )

  const biDoc: BookIntelligenceOverviewDocument = {
    schemaName: 'book_intelligence_unit_overview',
    schemaVersion: '0.1',
    layer: 'phase2_interpretation',
    columnSet: 'eight_column_baseline',
    catalogBookId: 'big_english_3_sb',
    units: [
      {
        unitId: 'u1',
        unitNumber: '1',
        title: 'Wake Up!',
        printedPageStart: 4,
        printedPageEnd: 19,
        vocabulary: 'BI-ONLY vocab interpretation',
        grammarStructures: 'BI-ONLY grammar',
        communicativeFunctions: 'BI-ONLY functions',
        learningOutcomes: 'BI-ONLY outcomes',
        learningOutcomesProvenance: 'ai_inferred',
        clilCulture: '',
        values: '',
        phonics: '',
      },
    ],
  }

  const context = buildCurrentLessonContext({
    summary,
    sbPrintedPages: [4],
    bookIntelligence: biDoc,
    unitNumber: 1,
  })

  assert.equal(context.bookIntelligence.status, 'ready')
  if (context.bookIntelligence.status !== 'ready') return
  const biValues = context.bookIntelligence.fields.map((field) => field.value)
  assert.ok(biValues.some((value) => value.includes('BI-ONLY')))

  const pageVocab = context.bookContent.pagesView.vocabulary.join(' ')
  const activityText = context.bookContent.sbActivities
    .map((card) => card.verifiedWording)
    .join(' ')
  assert.equal(pageVocab.includes('BI-ONLY'), false)
  assert.equal(activityText.includes('BI-ONLY'), false)

  const summaryLine = buildBookContentCollapsedSummary(context.bookContent)
  assert.equal(summaryLine.includes('BI-ONLY'), false)
})

test('explicit null unitNumber clears Unit grounded chrome (SCOPE-01)', () => {
  const summary = summaryWithActivities(
    [
      {
        activity_id: 'big_english_3_sb_act_u08',
        book_id: 'big_english_3_sb',
        page_id: 'big_english_3_sb_p143',
        printed_page: 143,
        activity_number: '1',
        instruction: 'Review.',
        verification_status: 'human_verified',
      },
    ],
    [{ page_id: 'big_english_3_sb_p143', printed_page: 143 }],
  )
  // Pretend the loaded summary is Unit 8.
  summary.units[0] = {
    unitNumber: 8,
    title: 'Healthy Living',
    printedPageStart: 128,
    printedPageEnd: 143,
  }

  const inside = buildCurrentLessonContext({
    summary,
    sbPrintedPages: [143],
    unitNumber: 8,
  })
  assert.equal(inside.scope.unitLabel, 'Unit 8: Healthy Living')
  assert.ok(inside.bookContent.unitView)

  const outsideCleared = buildCurrentLessonContext({
    summary,
    sbPrintedPages: [],
    unitNumber: null,
  })
  assert.equal(outsideCleared.scope.unitLabel, null)
  assert.equal(outsideCleared.bookContent.unitView, null)
  assert.equal(outsideCleared.bookIntelligence.status, 'unavailable')

  const outsideOtherCatalog = buildCurrentLessonContext({
    summary,
    sbPrintedPages: [],
    unitNumber: null,
    groundedUnitLabel: 'Unit 9: School Trips',
  })
  assert.equal(outsideOtherCatalog.scope.unitLabel, 'Unit 9: School Trips')
  assert.equal(outsideOtherCatalog.bookContent.unitView, null)
  assert.equal(
    outsideOtherCatalog.scope.unitLabel?.includes('Unit 8'),
    false,
  )

  const mismatchedUnitNumber = buildCurrentLessonContext({
    summary,
    sbPrintedPages: [],
    unitNumber: 9,
  })
  assert.equal(mismatchedUnitNumber.bookContent.unitView, null)
  assert.equal(mismatchedUnitNumber.scope.unitLabel, null)
})

test('unverified activities are excluded from current-lesson book content', () => {
  const summary = summaryWithActivities(
    [
      {
        activity_id: 'big_english_3_sb_act_unverified',
        book_id: 'big_english_3_sb',
        page_id: PAGE.page_id,
        printed_page: PAGE.printed_page,
        activity_number: '9',
        instruction: 'Should not appear.',
        verification_status: 'unverified',
      },
      {
        activity_id: 'big_english_3_sb_act_verified',
        book_id: 'big_english_3_sb',
        page_id: PAGE.page_id,
        printed_page: PAGE.printed_page,
        activity_number: '1',
        instruction: 'Listen, look, and say.',
        verification_status: 'human_verified',
      },
    ],
    [PAGE],
  )

  const context = buildCurrentLessonContext({
    summary,
    sbPrintedPages: [4],
  })
  assert.equal(context.bookContent.sbActivities.length, 1)
  assert.equal(
    context.bookContent.sbActivities[0]?.verifiedWording,
    'Listen, look, and say.',
  )
})
