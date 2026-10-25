/**
 * Generic Student-Book-only two-lesson packaging.
 * Run: npx tsx --test scripts/tests/sbOnlyTwoLessonPackaging.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  allocateSbOnlyTwoLessonActivities,
  formatSbOnlyLessonActivityScope,
  sortSelectedSbActivitiesForTwoLessons,
} from '../../app/src/features/chalkie/allocateSbOnlyTwoLessonActivities.ts'
import { buildSbOnlyTwoLessonHandoff } from '../../app/src/features/chalkie/buildSbOnlyTwoLessonHandoff.ts'
import { buildChalkiePromptPreview } from '../../app/src/features/chalkie/buildChalkiePromptPreview.ts'
import {
  buildSbActivityCards,
  createDefaultSbActivitySelection,
  createSbActivityHandoffSelection,
  type SelectedSbActivityEvidence,
} from '../../app/src/features/chalkie/chalkieActivitySelection.ts'
import { resolveChalkieLessonContext } from '../../app/src/features/chalkie/resolveChalkieLessonContext.ts'
import type { Book } from '../../app/src/types/curriculum.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const BE3_SB_PATH = path.join(ROOT, 'data/phase1/big_english_3_sb/canonical/v1.json')
const BE3_WB_PATH = path.join(ROOT, 'data/phase1/big_english_3_wb/canonical/v1.json')
const OVERLAY_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx',
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

function be3Unit8SbSummary(): BatchJsonSummary {
  const rawBook = loadJson(BE3_SB_PATH)
  const unit = asArray(rawBook.units).find((entry) => {
    const u = asRecord(entry)
    return u.unit_number === 8 || u.unit_number === '8'
  })
  const unitRec = asRecord(unit)
  const start =
    typeof unitRec.printed_page_start === 'number' ? unitRec.printed_page_start : 128
  const end = typeof unitRec.printed_page_end === 'number' ? unitRec.printed_page_end : 143
  const unitPages: number[] = []
  for (let page = start; page <= end; page += 1) unitPages.push(page)

  const pageRows = asArray(rawBook.pages).filter((entry) => {
    const printed = asRecord(entry).printed_page
    return typeof printed === 'number' && unitPages.includes(printed)
  })
  const pageIds = new Set(
    pageRows
      .map((entry) => asRecord(entry).page_id)
      .filter((id): id is string => typeof id === 'string'),
  )

  return {
    catalogBookId: 'big_english_3_sb',
    units: [
      {
        unitNumber: 8,
        title: typeof unitRec.title === 'string' ? unitRec.title : 'Healthy Living',
        printedPageStart: start,
        printedPageEnd: end,
      },
    ],
    vocabulary: [],
    language: [],
    activities: asArray(rawBook.activities)
      .filter((entry) => pageIds.has(String(asRecord(entry).page_id ?? '')))
      .map((entry) => {
        const a = asRecord(entry)
        return {
          title:
            typeof a.instruction === 'string'
              ? a.instruction
              : typeof a.title === 'string'
                ? a.title
                : undefined,
          pageId: typeof a.page_id === 'string' ? a.page_id : undefined,
        }
      }),
    pages: pageRows.map((entry) => {
      const p = asRecord(entry)
      return {
        printedPage: typeof p.printed_page === 'number' ? p.printed_page : null,
        sectionTitle: typeof p.section_title === 'string' ? p.section_title : undefined,
        sectionType: typeof p.section_type === 'string' ? p.section_type : undefined,
        pageHeading: typeof p.page_heading === 'string' ? p.page_heading : undefined,
      }
    }),
    raw: {
      book_id: 'big_english_3_sb',
      units: asArray(rawBook.units).filter((entry) => {
        const u = asRecord(entry)
        return u.unit_number === 8 || u.unit_number === '8'
      }),
      pages: pageRows,
      vocabulary: asArray(rawBook.vocabulary).filter((entry) =>
        pageIds.has(String(asRecord(entry).page_id ?? '')),
      ),
      language: asArray(rawBook.language).filter((entry) =>
        pageIds.has(String(asRecord(entry).page_id ?? '')),
      ),
      activities: asArray(rawBook.activities).filter((entry) =>
        pageIds.has(String(asRecord(entry).page_id ?? '')),
      ),
      curriculum_components: asArray(rawBook.curriculum_components).filter((entry) =>
        pageIds.has(String(asRecord(entry).page_id ?? '')),
      ),
    },
  }
}

function evidenceStub(
  overrides: Partial<SelectedSbActivityEvidence> &
    Pick<SelectedSbActivityEvidence, 'cardId' | 'printedPage'>,
): SelectedSbActivityEvidence {
  return {
    cardId: overrides.cardId,
    source: 'SB',
    pageId: overrides.pageId ?? `page-${overrides.printedPage}`,
    printedPage: overrides.printedPage,
    activityNumber: overrides.activityNumber ?? null,
    verifiedWording: overrides.verifiedWording ?? `Activity on p.${overrides.printedPage}`,
    activityType: overrides.activityType ?? null,
    prompt: overrides.prompt ?? null,
    expectedAnswer: overrides.expectedAnswer ?? null,
    languageFrame: overrides.languageFrame ?? null,
    audioDependency: overrides.audioDependency ?? false,
    visualDependency: overrides.visualDependency ?? false,
    sourceDependencyNote: overrides.sourceDependencyNote ?? null,
    items: overrides.items ?? [],
    references: overrides.references ?? {
      activityId: overrides.cardId,
      bookId: 'big_english_3_sb',
      unitId: null,
      pageId: overrides.pageId ?? `page-${overrides.printedPage}`,
      verificationStatus: 'human_verified',
    },
  }
}

test('stable allocation sorts by page then activity number and mid-splits', () => {
  const selected = [
    evidenceStub({ cardId: 'c', printedPage: 133, activityNumber: '2' }),
    evidenceStub({ cardId: 'a', printedPage: 132, activityNumber: '2' }),
    evidenceStub({ cardId: 'b', printedPage: 132, activityNumber: '1' }),
    evidenceStub({ cardId: 'd', printedPage: 133, activityNumber: '1' }),
  ]
  const ordered = sortSelectedSbActivitiesForTwoLessons(selected)
  assert.deepEqual(
    ordered.map((item) => item.cardId),
    ['b', 'a', 'd', 'c'],
  )

  const allocation = allocateSbOnlyTwoLessonActivities(selected)
  assert.deepEqual(
    allocation.lesson1.map((item) => item.cardId),
    ['b', 'a'],
  )
  assert.deepEqual(
    allocation.lesson2.map((item) => item.cardId),
    ['d', 'c'],
  )
})

test('odd activity count gives the extra activity to Lesson 1', () => {
  const selected = [
    evidenceStub({ cardId: '1', printedPage: 132, activityNumber: '1' }),
    evidenceStub({ cardId: '2', printedPage: 132, activityNumber: '2' }),
    evidenceStub({ cardId: '3', printedPage: 133, activityNumber: '1' }),
  ]
  const allocation = allocateSbOnlyTwoLessonActivities(selected)
  assert.equal(allocation.lesson1.length, 2)
  assert.equal(allocation.lesson2.length, 1)
  assert.equal(allocation.lesson1[0]?.cardId, '1')
  assert.equal(allocation.lesson2[0]?.cardId, '3')
})

test('BE3 U8 SB pp.132–133 enables SB-only two-lesson packaging', () => {
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8SbSummary(),
    visiblePrintedPages: [132, 133],
    unitNumber: 8,
    workbookCanonical: loadJson(BE3_WB_PATH),
  })

  assert.equal(lesson.status, 'ready')
  assert.equal(lesson.supportsTwoLessonSeries, true)
  assert.equal(lesson.twoLessonPackagingMode, 'sb_only')
  assert.equal(lesson.seriesLessonTitle, null)
  assert.equal(lesson.stableSeriesReference, null)
  assert.ok(lesson.workbookCompanion)
  assert.equal(
    lesson.workbookCompanion?.relationshipId,
    'be3_sb_wb_rel_u08_lia_sb132-133_wb107-108',
  )
})

test('BE3 U8 SB pp.132–133 SB-only handoff uses only Student Book evidence', () => {
  const summary = be3Unit8SbSummary()
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary,
    visiblePrintedPages: [132, 133],
    unitNumber: 8,
    workbookCanonical: loadJson(BE3_WB_PATH),
  })
  assert.equal(lesson.status, 'ready')
  assert.equal(lesson.twoLessonPackagingMode, 'sb_only')

  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [132, 133],
  })
  assert.ok(cards.length >= 2)
  const selection = createSbActivityHandoffSelection(
    cards,
    createDefaultSbActivitySelection(cards),
  )
  const allocation = allocateSbOnlyTwoLessonActivities(selection.selectedEvidence)
  assert.ok(allocation.lesson1.length >= 1)
  assert.ok(allocation.lesson2.length >= 1)

  const handoff = buildSbOnlyTwoLessonHandoff({
    lesson,
    selectedSuggestions: [
      {
        id: 'prior-test',
        label: 'Earlier unit language',
        frame: 'I like salad.',
        source: 'Unit 7',
        whyItMayHelp: 'Warm-up',
        caution: 'Optional prior support only.',
        evidenceNote: 'Same-unit earlier pages.',
        provenanceTag: '[PRIOR]',
      },
    ],
    teacherAdditions: [
      {
        title: 'Class phrase',
        frame: 'Let us share.',
        purpose: 'Classroom routine',
      },
    ],
    activitySelection: selection,
  })

  assert.match(handoff.detailedHandoff, /TWO-LESSON series/)
  assert.match(handoff.detailedHandoff, /ONLY Student Book printed pages 132, 133/)
  assert.match(handoff.detailedHandoff, /Do not invent Workbook content/)
  assert.doesNotMatch(handoff.detailedHandoff, /Workbook printed page/)
  assert.doesNotMatch(handoff.detailedHandoff, /\[WB/)
  assert.match(
    handoff.detailedHandoff,
    new RegExp(`Lesson 1 — Student Book ${lesson.visiblePageRangeLabel}`),
  )
  assert.match(
    handoff.detailedHandoff,
    new RegExp(`Lesson 2 — Student Book ${lesson.visiblePageRangeLabel}`),
  )
  assert.match(handoff.detailedHandoff, /\[PRIOR] Earlier unit language/)
  assert.match(handoff.detailedHandoff, /\[TEACHER-ADDED · UNVERIFIED] Class phrase/)
  assert.equal(
    handoff.lesson1ActivityScope,
    formatSbOnlyLessonActivityScope(allocation.lesson1),
  )
  assert.equal(
    handoff.lesson2ActivityScope,
    formatSbOnlyLessonActivityScope(allocation.lesson2),
  )

  const viaPreview = buildChalkiePromptPreview({
    lesson,
    packageShape: 'series',
    selectedSuggestions: [],
    teacherAdditions: [],
    activitySelection: selection,
  })
  assert.match(viaPreview, /TWO-LESSON series/)
  assert.match(viaPreview, /ONLY Student Book printed pages 132, 133/)
  assert.doesNotMatch(viaPreview, /Workbook printed page/)
  assert.doesNotMatch(viaPreview, /An Unhealthy Dinner/)
})

test('single-lesson path for BE3 U8 pp.132–133 remains unchanged', () => {
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8SbSummary(),
    visiblePrintedPages: [132, 133],
    unitNumber: 8,
  })
  const single = buildChalkiePromptPreview({
    lesson,
    packageShape: 'single',
    selectedSuggestions: [],
    teacherAdditions: [],
  })
  assert.doesNotMatch(single, /TWO-LESSON series/)
  assert.doesNotMatch(single, /Lesson 1 current activities/)
  assert.doesNotMatch(single, /Workbook/)
})

test('accepted BE3 opener route keeps richer SB→WB packaging mode', () => {
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8SbSummary(),
    visiblePrintedPages: [128, 129],
    unitNumber: 8,
    workbookCanonical: loadJson(BE3_WB_PATH),
  })
  assert.equal(lesson.twoLessonPackagingMode, 'sb_wb')
  assert.equal(lesson.supportsTwoLessonSeries, true)
  assert.ok(lesson.seriesLessonTitle)
})

test('overlay surfaces enabled Two lessons Student Book spread choice', () => {
  const overlay = fs.readFileSync(OVERLAY_PATH, 'utf8')
  assert.match(overlay, /Two lessons from this Student Book spread/)
  assert.match(overlay, /Both lessons use only this Student Book spread/)
  assert.match(overlay, /No Workbook[\s\S]{0,80}companion is implied/)
  assert.match(overlay, /buildSbOnlyTwoLessonHandoff/)
  assert.match(overlay, /allocateSbOnlyTwoLessonActivities/)
})
