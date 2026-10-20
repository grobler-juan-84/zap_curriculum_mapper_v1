/**
 * Focused suggested-Chalkie-vocabulary handoff tests (local, no API).
 * Run: npx tsx --test scripts/tests/buildSuggestedChalkieVocabulary.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { buildChalkieConciseOutline } from '../../app/src/features/chalkie/buildChalkieConciseOutline.ts'
import { buildChalkiePromptPreview } from '../../app/src/features/chalkie/buildChalkiePromptPreview.ts'
import { buildSuggestedChalkieVocabulary } from '../../app/src/features/chalkie/buildSuggestedChalkieVocabulary.ts'
import { resolveChalkieLessonContext } from '../../app/src/features/chalkie/resolveChalkieLessonContext.ts'
import type { Book } from '../../app/src/types/curriculum.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const BE3_CANONICAL_PATH = path.join(
  ROOT,
  'data/phase1/big_english_3_sb/canonical/v1.json',
)

const EXPECTED_132_133 = [
  'do any exercise',
  'drink lots of water',
  'have a healthy lunch',
  'get enough sleep',
  'ride my bike',
] as const

const P128_PRIOR_PHRASES = [
  'have a big breakfast',
  'get 10 hours of sleep',
  'drink lots of water',
  'ride a bike',
  'eat breakfast',
  'get any exercise',
  'have a healthy lunch',
  'get enough sleep',
] as const

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

function be3Unit8Summary(): BatchJsonSummary {
  const rawBook = JSON.parse(fs.readFileSync(BE3_CANONICAL_PATH, 'utf8')) as Record<
    string,
    unknown
  >
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
    units: [
      {
        unitNumber: 8,
        title: 'Healthy Living',
        printedPageStart: start,
        printedPageEnd: end,
      },
    ],
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

function resolveBe3U08(pages: number[]) {
  return resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8Summary(),
    visiblePrintedPages: pages,
    unitNumber: 8,
  })
}

test('BE3 pp.132–133 suggested vocabulary is exactly the five current-page models', () => {
  const lesson = resolveBe3U08([132, 133])
  const prior = lesson.priorLearningSuggestions[0]
  assert.ok(prior)
  assert.equal(lesson.priorLearningSuggestions.length, 1)

  const suggested = buildSuggestedChalkieVocabulary(lesson)
  assert.equal(suggested.isEmpty, false)
  assert.deepEqual(suggested.terms, [...EXPECTED_132_133])
  assert.equal(suggested.copyText, EXPECTED_132_133.join(', '))

  // PRIOR bundle must not expand the Chalkie vocabulary chips.
  for (const phrase of P128_PRIOR_PHRASES) {
    if (EXPECTED_132_133.includes(phrase as (typeof EXPECTED_132_133)[number])) continue
    assert.ok(
      !suggested.terms.includes(phrase),
      `PRIOR-only phrase leaked into suggested vocabulary: ${phrase}`,
    )
  }
  assert.ok(!suggested.terms.includes('have a big breakfast'))
  assert.ok(!suggested.terms.includes('eat breakfast'))
  assert.ok(!suggested.terms.includes('ride a bike'))
  assert.ok(suggested.terms.includes('ride my bike'))
})

test('teacher-added language is not added to suggested vocabulary', () => {
  const lesson = resolveBe3U08([132, 133])
  const suggested = buildSuggestedChalkieVocabulary(lesson)
  assert.ok(!suggested.terms.includes('What did you do yesterday?'))
  assert.doesNotMatch(suggested.copyText, /What did you do yesterday/)
})

test('copy payload matches displayed vocabulary text', () => {
  const lesson = resolveBe3U08([132, 133])
  const suggested = buildSuggestedChalkieVocabulary(lesson)
  assert.equal(suggested.copyText, suggested.terms.join(', '))
  assert.equal(
    suggested.copyText,
    'do any exercise, drink lots of water, have a healthy lunch, get enough sleep, ride my bike',
  )
})

test('lesson without current words/models shows honest empty state', () => {
  const suggested = buildSuggestedChalkieVocabulary({ vocabulary: [] })
  assert.equal(suggested.isEmpty, true)
  assert.deepEqual(suggested.terms, [])
  assert.equal(suggested.copyText, '')
})

test('detailed prompt and concise outline remain unchanged by vocabulary builder', () => {
  const lesson = resolveBe3U08([132, 133])
  const prior = lesson.priorLearningSuggestions[0]
  assert.ok(prior)

  const prompt = buildChalkiePromptPreview({
    lesson,
    packageShape: 'single',
    selectedSuggestions: [prior],
    teacherAdditions: [{ frame: 'What did you do yesterday?', note: 'warm-up' }],
  })
  const outline = buildChalkieConciseOutline({
    lesson,
    selectedSuggestions: [prior],
  })
  const suggested = buildSuggestedChalkieVocabulary(lesson)

  assert.match(prompt, /\[PRIOR\]/)
  assert.match(prompt, /have a big breakfast/)
  assert.match(prompt, /\[TEACHER-ADDED · UNVERIFIED\] What did you do yesterday\?/)
  assert.match(outline, /\[PRIOR\]/)
  assert.match(outline, /Activity 8:/)
  assert.doesNotMatch(prompt, /Suggested Chalkie vocabulary/)
  assert.doesNotMatch(outline, /Suggested Chalkie vocabulary/)
  assert.equal(
    suggested.copyText,
    'do any exercise, drink lots of water, have a healthy lunch, get enough sleep, ride my bike',
  )
})
