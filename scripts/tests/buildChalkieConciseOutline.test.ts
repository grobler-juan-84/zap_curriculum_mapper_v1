/**
 * Focused concise-outline tests (local, no API).
 * Run: npx tsx --test scripts/tests/buildChalkieConciseOutline.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { buildChalkieConciseOutline } from '../../app/src/features/chalkie/buildChalkieConciseOutline.ts'
import { buildChalkiePromptPreview } from '../../app/src/features/chalkie/buildChalkiePromptPreview.ts'
import {
  buildSbActivityCards,
  createDefaultSbActivitySelection,
  createSbActivityHandoffSelection,
  setSbActivityCardSelected,
} from '../../app/src/features/chalkie/chalkieActivitySelection.ts'
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

test('BE3 pp.132–133 outline lists Activities 8–12 in order with PRIOR when selected', () => {
  const lesson = resolveBe3U08([132, 133])
  assert.equal(lesson.status, 'ready')
  assert.equal(lesson.outlineActivities.length, 5)
  assert.deepEqual(
    lesson.outlineActivities.map((item) => item.activityNumber),
    [8, 9, 10, 11, 12],
  )

  const prior = lesson.priorLearningSuggestions[0]
  assert.ok(prior)
  const outline = buildChalkieConciseOutline({
    lesson,
    selectedSuggestions: [prior],
  })

  assert.match(
    outline,
    /\[PRIOR\] Briefly retrieve the selected phrases for Healthy and unhealthy activities from p\.128\./,
  )
  assert.match(outline, /1\.\s*\[PRIOR\]/)
  assert.match(outline, /2\.\s*\[SB\] Activity 8:/)
  assert.match(outline, /3\.\s*\[SB\] Activity 9:/)
  assert.match(outline, /4\.\s*\[SB\] Activity 10:/)
  assert.match(outline, /5\.\s*\[SB\] Activity 11:/)
  assert.match(outline, /6\.\s*\[SB\] Activity 12:/)
  assert.match(outline, /7\.\s*\[SUPPLEMENTARY\]/)

  const act8 = outline.split('\n').find((line) => line.includes('Activity 8:'))
  assert.ok(act8)
  assert.match(act8, /official book audio/i)
  assert.match(act8, /Listen and look at the sentences/i)

  for (const n of [9, 10, 11, 12]) {
    const line = outline.split('\n').find((entry) => entry.includes(`Activity ${n}:`))
    assert.ok(line, `missing Activity ${n}`)
    assert.doesNotMatch(line, /official book audio/i)
  }

  assert.doesNotMatch(outline, /What did you do yesterday/)
})

test('no prior selection means no PRIOR outline step; teacher-added stays out', () => {
  const lesson = resolveBe3U08([132, 133])
  const outline = buildChalkieConciseOutline({
    lesson,
    selectedSuggestions: [],
  })
  assert.doesNotMatch(outline, /\[PRIOR\]/)
  assert.match(outline, /1\.\s*\[SB\] Activity 8:/)
  assert.match(outline, /\[SUPPLEMENTARY\]/)

  const prompt = buildChalkiePromptPreview({
    lesson,
    packageShape: 'single',
    selectedSuggestions: [],
    teacherAdditions: [
      { title: 'Past habits', frame: 'What did you do yesterday?', purpose: 'warm-up' },
    ],
  })
  const outlineWithIgnoredTeacherAdd = buildChalkieConciseOutline({
    lesson,
    selectedSuggestions: [],
  })
  assert.doesNotMatch(outlineWithIgnoredTeacherAdd, /What did you do yesterday/)
  assert.match(
    prompt,
    /\[TEACHER-ADDED · UNVERIFIED\] Past habits: What did you do yesterday\?/,
  )
  assert.match(prompt, /Purpose: warm-up/)
})

test('detailed prompt remains unchanged by outline builder', () => {
  const lesson = resolveBe3U08([132, 133])
  const prior = lesson.priorLearningSuggestions[0]
  const promptA = buildChalkiePromptPreview({
    lesson,
    packageShape: 'single',
    selectedSuggestions: prior ? [prior] : [],
    teacherAdditions: [],
  })
  const promptB = buildChalkiePromptPreview({
    lesson,
    packageShape: 'single',
    selectedSuggestions: prior ? [prior] : [],
    teacherAdditions: [],
  })
  assert.equal(promptA, promptB)
  assert.doesNotMatch(promptA, /Concise teacher-controlled outline/)
  const outline = buildChalkieConciseOutline({
    lesson,
    selectedSuggestions: prior ? [prior] : [],
  })
  assert.match(outline, /Concise teacher-controlled outline/)
  assert.notEqual(outline, promptA)
})

test('excluding BE3 p.129 Activity 4 removes its prompt, answer, audio, and outline without affecting neighbours', () => {
  const summary = be3Unit8Summary()
  const lesson = resolveBe3U08([128, 129])
  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [128, 129],
  })
  const activity4 = cards.find(
    (card) => card.references.activityId === 'bep3_sb_act_08_04',
  )
  assert.ok(activity4)
  const selection = createSbActivityHandoffSelection(
    cards,
    setSbActivityCardSelected({
      cards,
      state: createDefaultSbActivitySelection(cards),
      cardId: activity4.id,
      selected: false,
    }),
  )
  const prompt = buildChalkiePromptPreview({
    lesson,
    packageShape: 'single',
    selectedSuggestions: [],
    teacherAdditions: [],
    activitySelection: selection,
  })
  const outline = buildChalkieConciseOutline({
    lesson,
    selectedSuggestions: [],
    activitySelection: selection,
  })

  assert.doesNotMatch(prompt, /Listen and sing\. How does Zach feel today\?/)
  assert.doesNotMatch(prompt, /I feel awful today\. \/ He feels awful\./)
  assert.doesNotMatch(prompt, /\b(?:151|152)\b/)
  assert.doesNotMatch(prompt, /Live Right!/)
  assert.doesNotMatch(prompt, /Teaching focus/)
  assert.doesNotMatch(prompt, /Unit context/)
  assert.doesNotMatch(outline, /Activity 4:/)
  assert.match(prompt, /Activity 5: Look at 1\. Ask and answer\./)
  assert.match(outline, /Activity 5:/)
  assert.match(prompt, /Activity 1:/)
  assert.doesNotMatch(outline, /\[SUPPLEMENTARY\]/)
})

test('all-selected SB state preserves the existing single-lesson handoff artifacts', () => {
  const summary = be3Unit8Summary()
  const lesson = resolveBe3U08([128, 129])
  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [128, 129],
  })
  const selection = createSbActivityHandoffSelection(
    cards,
    createDefaultSbActivitySelection(cards),
  )
  const input = {
    lesson,
    packageShape: 'single' as const,
    selectedSuggestions: [],
    teacherAdditions: [],
  }

  assert.equal(
    buildChalkiePromptPreview({ ...input, activitySelection: selection }),
    buildChalkiePromptPreview(input),
  )
  assert.equal(
    buildChalkieConciseOutline({
      lesson,
      selectedSuggestions: [],
      activitySelection: selection,
    }),
    buildChalkieConciseOutline({
      lesson,
      selectedSuggestions: [],
    }),
  )
})

test('all SB activities excluded yields explicit empty output with no page fallback', () => {
  const summary = be3Unit8Summary()
  const lesson = resolveBe3U08([128, 129])
  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [128, 129],
  })
  const selection = createSbActivityHandoffSelection(cards, {
    selectedCardIds: [],
  })
  const prompt = buildChalkiePromptPreview({
    lesson,
    packageShape: 'single',
    selectedSuggestions: [],
    teacherAdditions: [],
    activitySelection: selection,
  })
  const outline = buildChalkieConciseOutline({
    lesson,
    selectedSuggestions: [],
    activitySelection: selection,
  })

  assert.match(prompt, /No current Student Book activities were selected/)
  assert.match(prompt, /Prior learning remains optional support/)
  assert.doesNotMatch(prompt, /\[SB p\.128\] Activity/)
  assert.doesNotMatch(prompt, /\[SB p\.129\] Activity/)
  assert.doesNotMatch(prompt, /Teaching focus/)
  assert.match(outline, /No current Student Book activities were selected/)
  assert.doesNotMatch(outline, /Activity [1-5]:/)
})

test('BE2 curated detailed prompt behaviour remains intact', () => {
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
      raw: {
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
      },
    },
    visiblePrintedPages: [128, 129],
    unitNumber: 8,
  })

  assert.equal(lesson.isBe2U08PrototypeRoute, true)
  assert.equal(lesson.currentFocus, BE2_U08_PROTOTYPE_FOCUS)
  assert.deepEqual(lesson.vocabulary, [...BE2_U08_VOCABULARY])
  assert.equal(lesson.outlineActivities.length, 0)

  const selected = lesson.priorLearningSuggestions.filter((item) => item.id === 'PL-19')
  const prompt = buildChalkiePromptPreview({
    lesson,
    packageShape: 'single',
    selectedSuggestions: selected,
    teacherAdditions: [],
  })
  assert.match(prompt, /\[HM\] Preference: Unit 07 pp\.113-116/)

  const outline = buildChalkieConciseOutline({
    lesson,
    selectedSuggestions: selected,
  })
  assert.match(outline, /\[HM\]/)
  assert.match(outline, /\[SUPPLEMENTARY\]/)
  assert.doesNotMatch(outline, /\[SB\] Activity/)
})
