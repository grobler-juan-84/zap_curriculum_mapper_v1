/**
 * Focused Chalkie evidence-resolution tests (node:test via tsx).
 * Run: npx tsx --test scripts/tests/resolveChalkieLessonContext.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  buildVisiblePagesView,
  extractActivityItemModel,
  splitLanguageFrames,
} from '../../app/src/features/chalkie/chalkieEvidence.ts'
import { buildChalkiePromptPreview } from '../../app/src/features/chalkie/buildChalkiePromptPreview.ts'
import { resolveChalkieLessonContext } from '../../app/src/features/chalkie/resolveChalkieLessonContext.ts'
import {
  BE2_U08_PROTOTYPE_FOCUS,
  BE2_U08_VOCABULARY,
} from '../../app/src/features/chalkie/teacherChoicePrototypeContent.ts'
import type { Book } from '../../app/src/types/curriculum.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const BE3_CANONICAL_PATH = path.join(
  ROOT,
  'data/phase1/big_english_3_sb/canonical/v1.json',
)

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

function loadBe3Canonical(): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(BE3_CANONICAL_PATH, 'utf8')) as Record<string, unknown>
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
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
      { page_id: 'bep3_sb_p136', printed_page: 136, section_title: 'Grammar' },
      { page_id: 'bep3_sb_p137', printed_page: 137, section_title: 'Grammar' },
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

function resolveBe3(pages: number[]) {
  return resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3SummaryForPrintedPages(pages),
    visiblePrintedPages: pages,
    unitNumber: 8,
  })
}

/** Full Unit 8 slice (as the app loads from canonical) so earlier-page prior learning can resolve. */
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

function resolveBe3WithUnitSummary(pages: number[]) {
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

const BE3_U08_P128_TARGET_PHRASES = [
  'have a big breakfast',
  'get 10 hours of sleep',
  'drink lots of water',
  'ride a bike',
  'eat breakfast',
  'get any exercise',
  'have a healthy lunch',
  'get enough sleep',
] as const

test('splitLanguageFrames preserves Q&A exchanges separated by |', () => {
  const parts = splitLanguageFrames(
    "Did he eat breakfast? / No, he didn't. | Did she ride her bike? / Yes, she did.",
  )
  assert.deepEqual(parts, [
    "Did he eat breakfast? / No, he didn't.",
    'Did she ride her bike? / Yes, she did.',
  ])
})

test('extractActivityItemModel joins matching_and_speaking phrase halves', () => {
  assert.equal(
    extractActivityItemModel(
      { prompt: 'do any', expected_answer: 'exercise' },
      { activityType: 'matching_and_speaking' },
    ),
    'do any exercise',
  )
  assert.equal(
    extractActivityItemModel(
      { prompt: 'Did Ruth visit her cousin yesterday?', expected_answer: 'd Yes, she did.' },
      { activityType: 'read_and_match' },
    ),
    null,
  )
})

test('BE3 pp.128–129 prioritizes vocabulary teaching focus over secondary Did…?', () => {
  const resolved = resolveBe3([128, 129])
  assert.equal(resolved.status, 'ready')
  assert.equal(resolved.lessonTopic, 'Healthy and unhealthy activities · Live Right!')
  assert.match(resolved.teachingFocus ?? '', /Learn and use the phrases for Healthy and unhealthy activities/i)
  assert.match(resolved.teachingFocus ?? '', /Did/)
  assert.match(resolved.teachingFocus ?? '', /short answers/i)
  assert.ok(
    (resolved.teachingFocus ?? '').toLowerCase().indexOf('learn and use') <
      (resolved.teachingFocus ?? '').toLowerCase().indexOf('did'),
  )
  const examples = resolved.languageExamples.map((item) => item.example)
  assert.ok(examples.includes("Did he eat breakfast? / No, he didn't."))
  assert.ok(examples.includes('Did she ride her bike? / Yes, she did.'))
  assert.ok(!examples.some((ex) => ex === "No, he didn't."))
})

test('BE3 pp.130–131 uses story-comprehension teaching focus', () => {
  const resolved = resolveBe3([130, 131])
  assert.equal(resolved.status, 'ready')
  assert.equal(resolved.lessonTopic, 'An Unhealthy Dinner')
  assert.equal(resolved.hasDedicatedVocabulary, false)
  assert.equal(resolved.hasActivityDerivedModels, false)
  assert.equal(resolved.vocabulary.length, 0)
  assert.match(resolved.teachingFocus ?? '', /An Unhealthy Dinner/)
  assert.match(resolved.teachingFocus ?? '', /unhealthy/i)
  assert.doesNotMatch(resolved.teachingFocus ?? '', /^Ask and answer about past activities/)
  const language = resolved.languageExamples.map((item) => item.example).join('\n')
  assert.doesNotMatch(language, /Did you have breakfast\?/)
  assert.doesNotMatch(language, /Did he get enough sleep\?/)
})

test('BE3 pp.132–133 retains Did…? teaching focus and five safe activity phrases', () => {
  const resolved = resolveBe3([132, 133])
  assert.equal(resolved.status, 'ready')
  assert.equal(
    resolved.teachingFocus,
    'Ask and answer about past activities using Did…? and short answers.',
  )
  assert.doesNotMatch(resolved.teachingFocus ?? '', /irregular/i)
  const examples = resolved.languageExamples.map((item) => item.example)
  assert.ok(examples.includes("Did you have breakfast? / No, I didn't."))
  assert.ok(examples.includes('Did he get enough sleep? / Yes, he did.'))
  for (const phrase of [
    'do any exercise',
    'drink lots of water',
    'have a healthy lunch',
    'get enough sleep',
    'ride my bike',
  ]) {
    assert.ok(resolved.vocabulary.includes(phrase), `missing phrase: ${phrase}`)
  }
})

test('BE3 pp.134–135 uses CLIL content-reading teaching focus without Grammar-box language', () => {
  const resolved = resolveBe3([134, 135])
  assert.equal(resolved.status, 'ready')
  assert.equal(resolved.lessonTopic, 'What Is a Calorie?')
  assert.ok(resolved.hasDedicatedVocabulary)
  assert.match(resolved.teachingFocus ?? '', /calorie/i)
  assert.match(resolved.teachingFocus ?? '', /good or bad for the body/i)
  assert.doesNotMatch(resolved.teachingFocus ?? '', /^Ask and answer about past activities/)
  const language = resolved.languageExamples.map((item) => item.example).join('\n')
  assert.doesNotMatch(language, /played \/ walked \/ stayed/)
  assert.doesNotMatch(language, /went \/ saw \/ came/)
})

test('BE3 pp.136–137 retains regular/irregular past-tense teaching focus', () => {
  const visible = buildVisiblePagesView(be3SummaryForPrintedPages([136, 137]), [136, 137])
  const resolved = resolveBe3([136, 137])
  assert.equal(resolved.status, 'ready')
  assert.equal(
    resolved.teachingFocus,
    'Use regular and irregular past-tense verbs to make simple sentences about yesterday.',
  )
  assert.match(resolved.teachingFocus ?? '', /regular/i)
  assert.match(resolved.teachingFocus ?? '', /irregular/i)
  assert.match(resolved.teachingFocus ?? '', /yesterday/i)
  const language = resolved.languageExamples.map((item) => item.example).join('\n')
  assert.match(language, /played \/ walked \/ stayed/)
  assert.match(language, /went \/ saw \/ came/)
  assert.ok(resolved.vocabulary.includes('put → put'))
  assert.ok(resolved.vocabulary.includes('work → worked'))
  assert.ok(resolved.vocabulary.includes('go → went'))
  assert.ok(resolved.activityLines.some((line) => line.includes('Tell your partner')))
  assert.ok(visible.vocabulary.includes('put → put'))
  assert.ok(visible.vocabulary.length >= 17)
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
  assert.deepEqual(
    resolved.priorLearningSuggestions.map((item) => item.id),
    ['PL-19', 'PL-08', 'PL-01', 'PL-03'],
  )
})

test('BE3 U8 pp.132–133 offers one earlier same-unit vocabulary bundle from p.128', () => {
  const resolved = resolveBe3WithUnitSummary([132, 133])
  assert.equal(resolved.status, 'ready')
  assert.equal(resolved.priorLearningSuggestions.length, 1)
  const suggestion = resolved.priorLearningSuggestions[0]
  assert.equal(suggestion.label, 'Healthy and unhealthy activities — from p.128')
  assert.equal(suggestion.source, 'Earlier in this unit · p.128')
  assert.equal(suggestion.provenanceTag, '[PRIOR]')
  assert.match(suggestion.source, /Earlier in this unit/)
  assert.match(suggestion.source, /p\.128/)
  for (const phrase of BE3_U08_P128_TARGET_PHRASES) {
    assert.ok(suggestion.frame.includes(phrase), `missing phrase: ${phrase}`)
  }
  // Screen 1 current-page evidence unchanged (Did…? focus; activity phrases, not p.128 bundle).
  assert.equal(
    resolved.teachingFocus,
    'Ask and answer about past activities using Did…? and short answers.',
  )
  assert.ok(!resolved.vocabulary.includes('have a big breakfast'))
  assert.ok(resolved.vocabulary.includes('do any exercise'))
})

test('BE3 U8 pp.128–129 does not suggest its own vocabulary as prior learning', () => {
  const resolved = resolveBe3WithUnitSummary([128, 129])
  assert.equal(resolved.status, 'ready')
  assert.equal(resolved.priorLearningSuggestions.length, 0)
  assert.match(resolved.teachingFocus ?? '', /Learn and use the phrases for Healthy and unhealthy activities/i)
})

test('selected same-unit vocabulary bundle reaches local prompt without API', () => {
  const resolved = resolveBe3WithUnitSummary([132, 133])
  const suggestion = resolved.priorLearningSuggestions[0]
  assert.ok(suggestion)
  const prompt = buildChalkiePromptPreview({
    lesson: resolved,
    packageShape: 'single',
    selectedSuggestions: [suggestion],
    teacherAdditions: [],
  })
  assert.match(prompt, /\[PRIOR\]/)
  assert.match(prompt, /Healthy and unhealthy activities — from p\.128/)
  assert.match(prompt, /Earlier in this unit · p\.128/)
  assert.match(prompt, /have a big breakfast/)
  assert.match(prompt, /get enough sleep/)
  assert.doesNotMatch(prompt, /\[HM\] Healthy and unhealthy activities/)
  assert.match(prompt, /Ask and answer about past activities using Did/)
})

test('dynamic prompt preview carries topic, focus, models, and language', () => {
  const resolved = resolveBe3([136, 137])
  const prompt = buildChalkiePromptPreview({
    lesson: resolved,
    packageShape: 'single',
    selectedSuggestions: [],
    teacherAdditions: [],
  })

  assert.match(prompt, /Lesson topic/)
  assert.match(prompt, /Teaching focus/)
  assert.match(prompt, /Verified words and models/)
  assert.match(prompt, /Verified activity language/)
  assert.match(prompt, /put → put/)
  assert.match(prompt, /Yesterday, I woke up early/)
  assert.ok(resolved.activityLines.includes(BE3_ACT_23) || prompt.includes('Tell your partner'))
})
