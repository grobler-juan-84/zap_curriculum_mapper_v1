/**
 * Focused Chalkie lesson naming tests.
 * Run: npx tsx --test scripts/tests/buildChalkieLessonNaming.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  DID_PAST_ACTIVITY_TEACHING_FOCUS,
  buildChalkieLessonNaming,
  buildStableLessonReference,
  deriveShortLessonFocusTitle,
  formatPageReference,
  formatZeroPaddedUnitNumber,
  resolveBookTypeCode,
  resolveSeriesLevelCode,
} from '../../app/src/features/chalkie/buildChalkieLessonNaming.ts'
import { buildChalkieConciseOutline } from '../../app/src/features/chalkie/buildChalkieConciseOutline.ts'
import { buildChalkiePromptPreview } from '../../app/src/features/chalkie/buildChalkiePromptPreview.ts'
import { buildSuggestedChalkieVocabulary } from '../../app/src/features/chalkie/buildSuggestedChalkieVocabulary.ts'
import { resolveChalkieLessonContext } from '../../app/src/features/chalkie/resolveChalkieLessonContext.ts'
import type { Book } from '../../app/src/types/curriculum.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const NAMING_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/buildChalkieLessonNaming.ts',
)
const OVERLAY_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx',
)
const BE3_CANONICAL_PATH = path.join(
  ROOT,
  'data/phase1/big_english_3_sb/canonical/v1.json',
)

const APPROVED_BE3_TITLE =
  'BE3 SB Unit 08 pp. 132–133 — Healthy Living — Asking About Yesterday'
const APPROVED_BE3_REF = 'be3-sb-u08-p132-133'

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

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function loadBe3Canonical(): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(BE3_CANONICAL_PATH, 'utf8')) as Record<string, unknown>
}

/** Slice real BE3 canonical JSON into a BatchJsonSummary for the given printed pages. */
function be3SummaryForPrintedPages(printedPages: number[]): BatchJsonSummary {
  const rawBook = loadBe3Canonical()
  const pageRows = asArray(rawBook.pages).filter((entry) => {
    const printed = asRecord(entry).printed_page
    return typeof printed === 'number' && printedPages.includes(printed)
  })
  const pageIds = new Set(
    pageRows
      .map((entry) => asRecord(entry).page_id)
      .filter((id): id is string => typeof id === 'string'),
  )

  const units = asArray(rawBook.units)
    .filter((entry) => {
      const u = asRecord(entry)
      return u.unit_number === 8 || u.unit_number === '8'
    })
    .map((entry) => {
      const u = asRecord(entry)
      return {
        unitId: typeof u.unit_id === 'string' ? u.unit_id : undefined,
        unitNumber: 8,
        title: typeof u.title === 'string' ? u.title : undefined,
        theme: typeof u.theme === 'string' ? u.theme : undefined,
        printedPageStart:
          typeof u.printed_page_start === 'number' ? u.printed_page_start : null,
        printedPageEnd: typeof u.printed_page_end === 'number' ? u.printed_page_end : null,
      }
    })

  const raw = {
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
  }

  return {
    catalogBookId: 'big_english_3_sb',
    units,
    vocabulary: asArray(raw.vocabulary).map((entry) => {
      const v = asRecord(entry)
      return {
        term: typeof v.term === 'string' ? v.term : undefined,
        pageId: typeof v.page_id === 'string' ? v.page_id : undefined,
      }
    }),
    language: [],
    activities: asArray(raw.activities).map((entry) => {
      const a = asRecord(entry)
      return {
        title:
          typeof a.instruction === 'string'
            ? a.instruction
            : typeof a.title === 'string'
              ? a.title
              : undefined,
        activityType: typeof a.activity_type === 'string' ? a.activity_type : undefined,
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
    raw,
  }
}

function be3Unit8Summary(): BatchJsonSummary {
  const rawBook = loadBe3Canonical()
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
  return be3SummaryForPrintedPages(unitPages)
}

function resolveBe3(pages: number[]) {
  return resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
      type: 'Student Book',
    }),
    summary: be3Unit8Summary(),
    visiblePrintedPages: pages,
    unitNumber: 8,
  })
}

test('BE3 SB Unit 8 pp.132–133 produces the approved teacher-facing title', () => {
  const lesson = resolveBe3([132, 133])
  assert.equal(lesson.status, 'ready')
  assert.equal(lesson.singleLessonTitle, APPROVED_BE3_TITLE)
  assert.ok(!lesson.singleLessonTitle.includes(':'))
})

test('BE3 SB Unit 8 pp.132–133 stable reference is exact', () => {
  const lesson = resolveBe3([132, 133])
  assert.equal(lesson.stableLessonReference, APPROVED_BE3_REF)
})

test('units are zero-padded in title and reference', () => {
  assert.equal(formatZeroPaddedUnitNumber(8), '08')
  assert.equal(formatZeroPaddedUnitNumber(1), '01')
  const naming = buildChalkieLessonNaming({
    catalogBookId: 'big_english_3_sb',
    bookTitle: 'Big English 3 Student Book',
    bookType: 'Student Book',
    unitNumber: 8,
    unitTitle: 'Healthy Living',
    visiblePrintedPages: [132, 133],
    teachingFocus: DID_PAST_ACTIVITY_TEACHING_FOCUS,
    lessonTopic: 'Language in Action',
  })
  assert.match(naming.teacherFacingTitle, /Unit 08/)
  assert.match(naming.stableLessonReference ?? '', /-u08-/)
})

test('Student Book and Workbook references cannot collide', () => {
  assert.equal(resolveBookTypeCode({ catalogBookId: 'big_english_3_sb' }), 'SB')
  assert.equal(resolveBookTypeCode({ catalogBookId: 'big_english_3_wb' }), 'WB')
  assert.equal(resolveSeriesLevelCode({ catalogBookId: 'big_english_3_sb' }), 'BE3')

  const sb = buildStableLessonReference({
    seriesLevelCode: 'BE3',
    bookTypeCode: 'SB',
    unitNumber: 8,
    visiblePrintedPages: [132, 133],
  })
  const wb = buildStableLessonReference({
    seriesLevelCode: 'BE3',
    bookTypeCode: 'WB',
    unitNumber: 8,
    visiblePrintedPages: [132, 133],
  })
  assert.equal(sb, 'be3-sb-u08-p132-133')
  assert.equal(wb, 'be3-wb-u08-p132-133')
  assert.notEqual(sb, wb)
})

test('single-page and two-page formats are correct', () => {
  assert.equal(formatPageReference([132]), 'p. 132')
  assert.equal(formatPageReference([132, 133]), 'pp. 132–133')
  assert.equal(
    buildStableLessonReference({
      seriesLevelCode: 'BE3',
      bookTypeCode: 'SB',
      unitNumber: 8,
      visiblePrintedPages: [132],
    }),
    'be3-sb-u08-p132',
  )
  assert.equal(
    buildStableLessonReference({
      seriesLevelCode: 'BE3',
      bookTypeCode: 'SB',
      unitNumber: 8,
      visiblePrintedPages: [133, 132],
    }),
    'be3-sb-u08-p132-133',
  )
})

test('same source always produces the same reference', () => {
  const a = resolveBe3([132, 133]).stableLessonReference
  const b = resolveBe3([133, 132]).stableLessonReference
  assert.equal(a, APPROVED_BE3_REF)
  assert.equal(b, APPROVED_BE3_REF)
})

test('Asking About Yesterday is derived from Did…? focus, not page hardcoding', () => {
  assert.equal(
    deriveShortLessonFocusTitle({
      teachingFocus: DID_PAST_ACTIVITY_TEACHING_FOCUS,
      lessonTopic: 'Language in Action',
    }),
    'Asking About Yesterday',
  )
  assert.equal(
    deriveShortLessonFocusTitle({
      teachingFocus: DID_PAST_ACTIVITY_TEACHING_FOCUS,
      lessonTopic: null,
    }),
    'Asking About Yesterday',
  )

  const namingSource = fs.readFileSync(NAMING_PATH, 'utf8')
  assert.ok(!namingSource.includes('132'))
  assert.ok(!namingSource.includes('133'))
  assert.ok(!namingSource.includes('Unit 8'))
  assert.ok(!namingSource.includes('unit_08'))
  assert.ok(namingSource.includes('Asking About Yesterday'))
  assert.ok(namingSource.includes('DID_PAST_ACTIVITY_TEACHING_FOCUS'))
  assert.ok(namingSource.includes('-l01'))
})

test('detailed prompt, outline, and vocabulary remain content-stable for BE3 132–133', () => {
  const lesson = resolveBe3([132, 133])
  const prompt = buildChalkiePromptPreview({
    lesson,
    packageShape: 'single',
    selectedSuggestions: [],
    teacherAdditions: [],
  })
  const outline = buildChalkieConciseOutline({
    lesson,
    selectedSuggestions: [],
  })
  const vocab = buildSuggestedChalkieVocabulary(lesson)

  assert.match(prompt, /Big English 3 Student Book/)
  assert.match(prompt, /printed pages 132, 133 ONLY/)
  assert.doesNotMatch(prompt, /BE3 SB Unit 08/)
  assert.match(outline, /Ask and answer|Did/)
  assert.ok(vocab.copyText.includes('do any exercise'))
  assert.equal(lesson.teachingFocus, DID_PAST_ACTIVITY_TEACHING_FOCUS)
  assert.equal(lesson.lessonTopic, 'Unit 8 language practice (Did he...?)')
})

test('naming path does not call or import the OpenAI draft endpoint', () => {
  const namingSource = fs.readFileSync(NAMING_PATH, 'utf8')
  const overlaySource = fs.readFileSync(OVERLAY_PATH, 'utf8')
  assert.ok(!namingSource.includes('/api/chalkie/generate'))
  assert.ok(!namingSource.includes('chalkieLessonDraftService'))
  assert.ok(!namingSource.includes('openai'))
  assert.ok(!overlaySource.includes('chalkieLessonDraftService'))
  assert.ok(!overlaySource.includes('/api/chalkie/generate'))
})
