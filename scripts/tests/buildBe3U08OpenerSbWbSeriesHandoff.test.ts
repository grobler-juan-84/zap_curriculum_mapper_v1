/**
 * BE3 U8 opener SB→WB series handoff tests.
 * Run: npx tsx --test scripts/tests/buildBe3U08OpenerSbWbSeriesHandoff.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  BE3_U08_OPENER_LESSON1_VOCAB,
  BE3_U08_OPENER_LESSON2_VOCAB,
  BE3_U08_OPENER_SERIES_RELATIONSHIP_ID,
  BE3_U08_OPENER_SERIES_STABLE_REF,
  BE3_U08_OPENER_SERIES_TITLE,
  buildBe3U08OpenerSbWbSeriesHandoff,
} from '../../app/src/features/chalkie/buildBe3U08OpenerSbWbSeriesHandoff.ts'
import { buildChalkiePromptPreview } from '../../app/src/features/chalkie/buildChalkiePromptPreview.ts'
import { resolveChalkieLessonContext } from '../../app/src/features/chalkie/resolveChalkieLessonContext.ts'
import {
  BE2_U08_SERIES_LESSON_TITLE,
  BE2_U08_SINGLE_LESSON_TITLE,
} from '../../app/src/features/chalkie/teacherChoicePrototypeContent.ts'
import type { Book } from '../../app/src/types/curriculum.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const BE3_SB_PATH = path.join(ROOT, 'data/phase1/big_english_3_sb/canonical/v1.json')
const BE3_WB_PATH = path.join(ROOT, 'data/phase1/big_english_3_wb/canonical/v1.json')
const OVERLAY_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx',
)
const HANDOFF_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/buildBe3U08OpenerSbWbSeriesHandoff.ts',
)

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

function loadJson(filePath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>
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
      relationships: asArray(rawBook.relationships),
    },
  }
}

test('accepted BE3 opener pair enables series and yields six non-empty copyables', () => {
  assert.ok(fs.existsSync(BE3_SB_PATH))
  assert.ok(fs.existsSync(BE3_WB_PATH))

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

  assert.equal(lesson.status, 'ready')
  assert.equal(lesson.supportsTwoLessonSeries, true)
  assert.equal(
    lesson.workbookCompanion?.relationshipId,
    BE3_U08_OPENER_SERIES_RELATIONSHIP_ID,
  )
  assert.equal(lesson.seriesLessonTitle, BE3_U08_OPENER_SERIES_TITLE)
  assert.equal(lesson.stableSeriesReference, BE3_U08_OPENER_SERIES_STABLE_REF)
  assert.ok(!lesson.seriesLessonTitle?.includes(BE3_U08_OPENER_SERIES_STABLE_REF))

  const handoff = buildBe3U08OpenerSbWbSeriesHandoff()
  assert.ok(handoff.seriesTitle.trim())
  assert.ok(handoff.detailedHandoff.trim())
  assert.ok(handoff.lesson1Outline.trim())
  assert.ok(handoff.lesson1Vocabulary.trim())
  assert.ok(handoff.lesson2Outline.trim())
  assert.ok(handoff.lesson2Vocabulary.trim())

  const prompt = buildChalkiePromptPreview({
    lesson,
    packageShape: 'series',
    selectedSuggestions: [],
    teacherAdditions: [],
  })
  assert.equal(prompt, handoff.detailedHandoff)
  assert.match(prompt, /Lesson 1: Student Book printed pages 128–129/)
  assert.match(prompt, /Lesson 2: Workbook printed pages 104–105/)
  assert.match(prompt, /consolidation\/practice/)
})

test('L1 uses SB scope and L2 uses WB scope', () => {
  const handoff = buildBe3U08OpenerSbWbSeriesHandoff()

  assert.equal(handoff.lesson1Vocabulary, BE3_U08_OPENER_LESSON1_VOCAB)
  assert.equal(handoff.lesson2Vocabulary, BE3_U08_OPENER_LESSON2_VOCAB)
  assert.match(handoff.lesson1Vocabulary, /have a big breakfast/)
  assert.doesNotMatch(handoff.lesson1Vocabulary, /ate a healthy breakfast/)
  assert.match(handoff.lesson2Vocabulary, /ate a healthy breakfast/)
  assert.doesNotMatch(handoff.lesson2Vocabulary, /have a big breakfast/)

  assert.match(handoff.lesson1Outline, /Student Book pp\. 128–129/)
  assert.match(handoff.lesson1Outline, /\[SB\]/)
  assert.doesNotMatch(handoff.lesson1Outline, /\[WB\]/)

  assert.match(handoff.lesson2Outline, /Workbook pp\. 104–105/)
  assert.match(handoff.lesson2Outline, /\[WB\]/)
  assert.doesNotMatch(handoff.lesson2Outline, /\[SB\]/)
  assert.match(handoff.lesson2Outline, /Consolidation\/practice/)

  assert.match(handoff.detailedHandoff, /\[SB p\.128\]/)
  assert.match(handoff.detailedHandoff, /\[WB p\.104\]/)
  assert.match(handoff.detailedHandoff, /Live Right!/)
})

test('unmapped BE3 spreads do not enable any BE3 series package', () => {
  const wb = loadJson(BE3_WB_PATH)

  for (const pages of [
    [132, 133],
    [134, 135],
    [136, 137],
  ]) {
    const lesson = resolveChalkieLessonContext({
      book: bookStub({
        catalogBookId: 'big_english_3_sb',
        title: 'Big English 3 Student Book',
      }),
      summary: be3Unit8SbSummary(),
      visiblePrintedPages: pages,
      unitNumber: 8,
      workbookCanonical: wb,
    })
    assert.equal(lesson.supportsTwoLessonSeries, false, `pages ${pages.join('-')}`)
    assert.equal(lesson.workbookCompanion, null, `pages ${pages.join('-')}`)
    assert.equal(lesson.seriesLessonTitle, null)
    assert.equal(lesson.stableSeriesReference, null)

    const prompt = buildChalkiePromptPreview({
      lesson,
      packageShape: 'series',
      selectedSuggestions: [],
      teacherAdditions: [],
    })
    assert.doesNotMatch(prompt, /TWO-LESSON series/)
    assert.doesNotMatch(prompt, /Workbook printed pages 104–105/)
    assert.doesNotMatch(prompt, /Workbook printed page 106/)
  }
})

test('existing BE2 fixture series titles and packaging remain unchanged', () => {
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_2_sb',
      title: 'Big English 2 Student Book',
      level: '2',
    }),
    summary: {
      catalogBookId: 'big_english_2_sb',
      units: [
        {
          unitNumber: 8,
          title: 'Wild Animals',
          printedPageStart: 128,
          printedPageEnd: 143,
        },
      ],
      vocabulary: [],
      language: [],
      activities: [],
      pages: [
        { printedPage: 128, sectionTitle: 'Vocabulary' },
        { printedPage: 129, sectionTitle: 'Song' },
      ],
      raw: {
        book_id: 'big_english_2_sb',
        pages: [
          { page_id: 'be2_sb_p128', printed_page: 128 },
          { page_id: 'be2_sb_p129', printed_page: 129 },
        ],
      },
    },
    visiblePrintedPages: [128, 129],
    unitNumber: 8,
  })

  assert.equal(lesson.isBe2U08PrototypeRoute, true)
  assert.equal(lesson.supportsTwoLessonSeries, true)
  assert.equal(lesson.singleLessonTitle, BE2_U08_SINGLE_LESSON_TITLE)
  assert.equal(lesson.seriesLessonTitle, BE2_U08_SERIES_LESSON_TITLE)
  assert.equal(lesson.workbookCompanion, null)
  assert.equal(lesson.stableSeriesReference, null)

  const prompt = buildChalkiePromptPreview({
    lesson,
    packageShape: 'series',
    selectedSuggestions: [],
    teacherAdditions: [],
  })
  assert.match(prompt, /Big English 2 Unit 8/)
  assert.match(prompt, /To the Zoo!/)
  assert.doesNotMatch(prompt, /Healthy Living/)
  assert.doesNotMatch(prompt, /Live Right!/)
})

test('BE3 series handoff and overlay stay local (no OpenAI)', () => {
  const handoffSource = fs.readFileSync(HANDOFF_PATH, 'utf8')
  const overlaySource = fs.readFileSync(OVERLAY_PATH, 'utf8')
  assert.ok(!handoffSource.includes('/api/chalkie/generate'))
  assert.ok(!handoffSource.toLowerCase().includes('openai'))
  assert.ok(!overlaySource.includes('chalkieLessonDraftService'))
  assert.ok(overlaySource.includes('buildBe3U08OpenerSbWbSeriesHandoff'))
})
