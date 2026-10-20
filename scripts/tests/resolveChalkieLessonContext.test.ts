/**
 * Focused Chalkie evidence-resolution tests (node:test via tsx).
 * Run: npx tsx --test scripts/tests/resolveChalkieLessonContext.test.ts
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import { buildVisiblePagesView } from '../../app/src/features/chalkie/chalkieEvidence.ts'
import { resolveChalkieLessonContext } from '../../app/src/features/chalkie/resolveChalkieLessonContext.ts'
import {
  BE2_U08_PROTOTYPE_FOCUS,
  BE2_U08_VOCABULARY,
} from '../../app/src/features/chalkie/teacherChoicePrototypeContent.ts'
import type { Book } from '../../app/src/types/curriculum.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const BE3_ACT_19 = "Look, listen, and read. How did Donna's dad come home?"
const BE3_ACT_20 =
  'Copy the chart in your notebook and complete. Use the words from the box.'
const BE3_ACT_21 = 'Read and complete.'
const BE3_ACT_22 = 'Read and match.'
const BE3_ACT_23 = 'Tell your partner about what you did yesterday.'

function bookStub(overrides: Partial<Book> & Pick<Book, 'catalogBookId' | 'title'>): Book {
  return {
    id: 'book-uuid-test',
    seriesId: 'series-uuid-test',
    catalogBookId: overrides.catalogBookId,
    title: overrides.title,
    level: overrides.level ?? '3',
    audience: overrides.audience ?? 'Primary',
    totalUnits: overrides.totalUnits ?? 9,
    type: overrides.type ?? 'Student Book',
    colorScheme: overrides.colorScheme ?? {
      primary: '#000000',
      accent: '#333333',
      badgeBg: '#eeeeee',
      badgeText: '#111111',
    },
    pageSpreads: overrides.pageSpreads ?? [],
  }
}

function be3Unit8HealthyLivingSummary(): BatchJsonSummary {
  const raw = {
    book_id: 'big_english_3_sb',
    units: [
      {
        unit_id: 'big_english_3_sb_unit_08',
        unit_number: 8,
        title: 'Healthy Living',
        theme: 'health / habits / exercise / past actions',
        printed_page_start: 128,
        printed_page_end: 143,
      },
    ],
    pages: [
      {
        page_id: 'bep3_sb_p136',
        printed_page: 136,
        section_title: 'Grammar',
        section_type: 'grammar',
      },
      {
        page_id: 'bep3_sb_p137',
        printed_page: 137,
        section_title: 'Grammar',
        section_type: 'grammar',
      },
    ],
    vocabulary: [],
    language: [],
    activities: [
      {
        activity_id: 'bep3_sb_act_19',
        page_id: 'bep3_sb_p136',
        printed_page: 136,
        activity_number: 19,
        instruction: BE3_ACT_19,
        activity_type: 'listen_read',
      },
      {
        activity_id: 'bep3_sb_act_20',
        page_id: 'bep3_sb_p136',
        printed_page: 136,
        activity_number: 20,
        instruction: BE3_ACT_20,
      },
      {
        activity_id: 'bep3_sb_act_21',
        page_id: 'bep3_sb_p137',
        printed_page: 137,
        activity_number: 21,
        instruction: BE3_ACT_21,
      },
      {
        activity_id: 'bep3_sb_act_22',
        page_id: 'bep3_sb_p137',
        printed_page: 137,
        activity_number: 22,
        instruction: BE3_ACT_22,
      },
      {
        activity_id: 'bep3_sb_act_23',
        page_id: 'bep3_sb_p137',
        printed_page: 137,
        activity_number: 23,
        instruction: BE3_ACT_23,
      },
    ],
  }

  return {
    catalogBookId: 'big_english_3_sb',
    units: [
      {
        unitId: 'big_english_3_sb_unit_08',
        unitNumber: 8,
        title: 'Healthy Living',
        theme: 'health / habits / exercise / past actions',
        printedPageStart: 128,
        printedPageEnd: 143,
      },
    ],
    vocabulary: [],
    language: [],
    // Summarized titles empty until validationService instruction fallback runs;
    // visible-page resolution must still read instruction from raw.
    activities: [
      { pageId: 'bep3_sb_p136', activityType: 'listen_read' },
      { pageId: 'bep3_sb_p136' },
      { pageId: 'bep3_sb_p137' },
      { pageId: 'bep3_sb_p137' },
      { pageId: 'bep3_sb_p137' },
    ],
    pages: [
      { printedPage: 136, sectionTitle: 'Grammar', sectionType: 'grammar' },
      { printedPage: 137, sectionTitle: 'Grammar', sectionType: 'grammar' },
    ],
    raw,
  }
}

function labelsOnlySummary(): BatchJsonSummary {
  const raw = {
    book_id: 'big_english_3_sb',
    units: [
      {
        unit_number: 8,
        title: 'Healthy Living',
        printed_page_start: 128,
        printed_page_end: 143,
      },
    ],
    pages: [
      {
        page_id: 'bep3_sb_p136',
        printed_page: 136,
        section_title: 'Grammar',
      },
      {
        page_id: 'bep3_sb_p137',
        printed_page: 137,
        section_title: 'Grammar',
      },
    ],
    vocabulary: [],
    language: [],
    activities: [],
  }

  return {
    catalogBookId: 'big_english_3_sb',
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
    pages: [
      { printedPage: 136, sectionTitle: 'Grammar' },
      { printedPage: 137, sectionTitle: 'Grammar' },
    ],
    raw,
  }
}

function be2Unit8SummaryWithSparseVisibleEvidence(): BatchJsonSummary {
  const raw = {
    book_id: 'big_english_2_sb',
    units: [
      {
        unit_number: 8,
        title: 'Wild Animals',
        printed_page_start: 120,
        printed_page_end: 135,
      },
    ],
    pages: [
      { page_id: 'be2_p128', printed_page: 128, section_title: 'Vocabulary' },
      { page_id: 'be2_p129', printed_page: 129, section_title: 'Song' },
    ],
    vocabulary: [],
    language: [],
    activities: [],
  }

  return {
    catalogBookId: 'big_english_2_sb',
    units: [
      {
        unitNumber: 8,
        title: 'Wild Animals',
        printedPageStart: 120,
        printedPageEnd: 135,
      },
    ],
    vocabulary: [],
    language: [],
    activities: [],
    pages: [
      { printedPage: 128, sectionTitle: 'Vocabulary' },
      { printedPage: 129, sectionTitle: 'Song' },
    ],
    raw,
  }
}

test('BE3 Unit 8 pp.136–137 resolves ready from verified instruction-only activities', () => {
  const resolved = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8HealthyLivingSummary(),
    visiblePrintedPages: [136, 137],
    unitNumber: 8,
  })

  assert.equal(resolved.status, 'ready')
  assert.equal(resolved.isBe2U08PrototypeRoute, false)
  assert.equal(resolved.supportsTwoLessonSeries, false)
  assert.equal(resolved.hasVerifiedPageEvidence, true)
})

test('BE3 Unit 8 pp.136–137 exposes Activities 19–23 from instruction fields', () => {
  const visible = buildVisiblePagesView(be3Unit8HealthyLivingSummary(), [136, 137])
  const resolved = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8HealthyLivingSummary(),
    visiblePrintedPages: [136, 137],
    unitNumber: 8,
  })

  assert.deepEqual(visible.activityLines, [
    BE3_ACT_19,
    BE3_ACT_20,
    BE3_ACT_21,
    BE3_ACT_22,
    BE3_ACT_23,
  ])
  assert.deepEqual(resolved.activityLines, [
    BE3_ACT_19,
    BE3_ACT_20,
    BE3_ACT_21,
    BE3_ACT_22,
    BE3_ACT_23,
  ])
  assert.ok(
    resolved.activityLines.some((line) => line.includes('Tell your partner')),
    'Activity 23 instruction must be retained',
  )
})

test('Activity 23 is not dropped by the previous four-item visible-page limit', () => {
  const visible = buildVisiblePagesView(be3Unit8HealthyLivingSummary(), [136, 137])
  assert.equal(visible.activityLines.length, 5)
  assert.equal(visible.activityLines[4], BE3_ACT_23)
})

test('page labels alone still return no_page_evidence', () => {
  const resolved = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: labelsOnlySummary(),
    visiblePrintedPages: [136, 137],
    unitNumber: 8,
  })

  assert.equal(resolved.status, 'no_page_evidence')
  assert.equal(resolved.hasVerifiedPageEvidence, false)
  assert.match(
    resolved.evidenceUnavailableMessage ?? '',
    /Source evidence is not available for these pages/,
  )
})

test('exact BE2 Unit 8 fixture route is unchanged', () => {
  const resolved = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_2_sb',
      title: 'Big English 2 Student Book',
      level: '2',
    }),
    summary: be2Unit8SummaryWithSparseVisibleEvidence(),
    visiblePrintedPages: [128, 129],
    unitNumber: 8,
  })

  assert.equal(resolved.status, 'ready')
  assert.equal(resolved.isBe2U08PrototypeRoute, true)
  assert.equal(resolved.supportsTwoLessonSeries, true)
  assert.equal(resolved.currentFocus, BE2_U08_PROTOTYPE_FOCUS)
  assert.deepEqual(resolved.vocabulary, [...BE2_U08_VOCABULARY])
  assert.equal(resolved.priorLearningSuggestions.length, 4)
})
