/**
 * Focused teacher-choice flow tests (merged prior-learning + custom language).
 * Run: npx tsx --test scripts/tests/teacherChoiceFlow.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { buildChalkiePromptPreview } from '../../app/src/features/chalkie/buildChalkiePromptPreview.ts'
import { resolveChalkieLessonContext } from '../../app/src/features/chalkie/resolveChalkieLessonContext.ts'
import {
  BE2_U08_PROTOTYPE_FOCUS,
  BE2_U08_VOCABULARY,
} from '../../app/src/features/chalkie/teacherChoicePrototypeContent.ts'
import {
  REMOVED_TEACHER_CHOICE_SCREEN_TITLE,
  TEACHER_CHOICE_TOTAL_STEPS,
  advanceTeacherChoiceStep,
  appendTeacherAddedLanguage,
  clearPriorLearningSelections,
  footerSelectionSummary,
  retreatTeacherChoiceStep,
  teacherChoiceStepName,
  toggleSelectedSuggestionId,
} from '../../app/src/features/chalkie/teacherChoiceFlow.ts'
import type { Book } from '../../app/src/types/curriculum.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OVERLAY_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx',
)
const DRAFT_SERVICE_PATH = path.join(
  ROOT,
  'app/src/services/chalkieLessonDraftService.ts',
)
const DRAFT_HANDLER_PATH = path.join(
  ROOT,
  'app/server/handleGenerateChalkieLessonDraftRequest.ts',
)
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

test('teacher-choice flow is three steps without Your choices screen', () => {
  assert.equal(TEACHER_CHOICE_TOTAL_STEPS, 3)
  assert.equal(teacherChoiceStepName(1), 'Current lesson')
  assert.equal(teacherChoiceStepName(2), 'Prior learning')
  assert.equal(teacherChoiceStepName(3), 'Lesson inputs')
  assert.equal(advanceTeacherChoiceStep(2), 3)
  assert.equal(advanceTeacherChoiceStep(3), 3)
  assert.equal(retreatTeacherChoiceStep(3), 2)
  assert.equal(retreatTeacherChoiceStep(1), 1)

  const overlaySource = fs.readFileSync(OVERLAY_PATH, 'utf8')
  assert.ok(!overlaySource.includes(REMOVED_TEACHER_CHOICE_SCREEN_TITLE))
  assert.ok(!overlaySource.includes('Your choices'))
  assert.ok(overlaySource.includes('Add Prior Skills'))
  assert.ok(overlaySource.includes('Add a prior skill'))
  assert.ok(overlaySource.includes('future instructions to come here'))
  assert.ok(overlaySource.includes('teacher-added-title'))
  assert.ok(overlaySource.includes('addPriorSkillExpanded'))
  assert.ok(overlaySource.includes('aria-expanded={addPriorSkillExpanded}'))
  assert.ok(overlaySource.includes('aria-label="Add a prior skill"'))
  assert.ok(overlaySource.includes('aria-label="Prior skills"'))
  assert.ok(!overlaySource.includes('What might be useful to reuse?'))
  assert.ok(!overlaySource.includes('Add language of your own'))
  assert.ok(!overlaySource.includes('Why it may help:'))
  assert.ok(!overlaySource.includes('Caution:'))
  assert.ok(overlaySource.includes('Purpose:'))
  assert.ok(overlaySource.includes('TEACHER_CHOICE_TOTAL_STEPS'))
})

test('handoff overlay has no model-draft UI and does not call the OpenAI endpoint', () => {
  const overlaySource = fs.readFileSync(OVERLAY_PATH, 'utf8')
  assert.ok(!overlaySource.includes('Optional model draft'))
  assert.ok(!overlaySource.includes('Generate Chalkie lesson draft'))
  assert.ok(!overlaySource.includes('chalkieLessonDraftService'))
  assert.ok(!overlaySource.includes('/api/chalkie/generate'))
  assert.ok(!overlaySource.includes('OpenAI'))
  assert.ok(!overlaySource.includes('model draft'))
  assert.ok(overlaySource.includes('HandoffCopyableBox'))
  assert.ok(overlaySource.includes('Copy title'))
  assert.ok(overlaySource.includes('Copy prompt'))
  assert.ok(overlaySource.includes('Copy outline'))
  assert.ok(overlaySource.includes('Copy vocabulary'))
  assert.ok(overlaySource.includes('Detailed Chalkie prompt'))
  assert.ok(overlaySource.includes('Suggested Chalkie vocabulary'))
  assert.ok(overlaySource.includes('Concise teacher-controlled outline'))
  assert.ok(
    overlaySource.includes(
      'Prepared locally from verified curriculum evidence and your selections',
    ),
  )
  assert.ok(overlaySource.includes('No AI'))
  assert.ok(overlaySource.includes('generation was used'))
  assert.ok(overlaySource.includes('Back to lesson inputs'))
  assert.ok(overlaySource.includes('handleBack'))

  assert.ok(fs.existsSync(DRAFT_SERVICE_PATH), 'draft service should remain dormant on disk')
  assert.ok(fs.existsSync(DRAFT_HANDLER_PATH), 'draft handler should remain dormant on disk')
  const serviceSource = fs.readFileSync(DRAFT_SERVICE_PATH, 'utf8')
  assert.match(serviceSource, /\/api\/chalkie\/generate/)
  const handlerSource = fs.readFileSync(DRAFT_HANDLER_PATH, 'utf8')
  assert.match(handlerSource, /openai|OpenAI/i)
})

test('combined prior-learning screen can select p.128 card and add custom language into prompt', () => {
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8Summary(),
    visiblePrintedPages: [132, 133],
    unitNumber: 8,
  })
  assert.equal(lesson.status, 'ready')
  assert.equal(lesson.priorLearningSuggestions.length, 1)

  let selectedIds: string[] = []
  let teacherAdditions: { id: string; title: string; frame: string; purpose: string }[] = []

  const card = lesson.priorLearningSuggestions[0]
  selectedIds = toggleSelectedSuggestionId(selectedIds, card.id)
  assert.deepEqual(selectedIds, [card.id])
  assert.match(card.label, /Healthy and unhealthy activities — from p\.128/)

  const added = appendTeacherAddedLanguage(
    teacherAdditions,
    'Past habits',
    'What did you do yesterday?',
    'Quick warm-up',
    () => 'teacher-added-1',
  )
  assert.ok(added)
  teacherAdditions = added
  selectedIds = toggleSelectedSuggestionId(selectedIds, 'teacher-added-1')
  assert.equal(teacherAdditions.length, 1)
  assert.equal(
    footerSelectionSummary(
      selectedIds.filter((id) => id !== 'teacher-added-1').length,
      selectedIds.includes('teacher-added-1') ? 1 : 0,
    ),
    '1 selected · 1 teacher-added',
  )

  // Continue to lesson inputs, then back — selections remain in this session model.
  let step = 2
  step = advanceTeacherChoiceStep(step)
  assert.equal(step, 3)
  step = retreatTeacherChoiceStep(step)
  assert.equal(step, 2)
  assert.ok(selectedIds.includes(card.id))
  assert.equal(teacherAdditions[0]?.frame, 'What did you do yesterday?')
  assert.equal(teacherAdditions[0]?.title, 'Past habits')

  const selectedSuggestions = lesson.priorLearningSuggestions.filter((item) =>
    selectedIds.includes(item.id),
  )
  const selectedTeacherAdditions = teacherAdditions.filter((item) =>
    selectedIds.includes(item.id),
  )
  const prompt = buildChalkiePromptPreview({
    lesson,
    packageShape: 'single',
    selectedSuggestions,
    teacherAdditions: selectedTeacherAdditions.map(({ title, frame, purpose }) => ({
      title,
      frame,
      purpose,
    })),
  })
  assert.match(prompt, /\[PRIOR\]/)
  assert.match(prompt, /Healthy and unhealthy activities — from p\.128/)
  assert.match(prompt, /have a big breakfast/)
  assert.match(prompt, /\[TEACHER-ADDED · UNVERIFIED\] Past habits: What did you do yesterday\?/)
  assert.match(prompt, /Purpose: Quick warm-up/)
})

test('continuing with neither selection nor custom language remains allowed', () => {
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8Summary(),
    visiblePrintedPages: [132, 133],
    unitNumber: 8,
  })
  const cleared = clearPriorLearningSelections()
  assert.deepEqual(cleared.selectedIds, [])
  assert.deepEqual(cleared.teacherAdditions, [])
  assert.equal(footerSelectionSummary(0, 0), 'No prior learning selected')
  assert.equal(appendTeacherAddedLanguage([], 'Title', '   ', 'purpose'), null)
  assert.equal(appendTeacherAddedLanguage([], '', 'frame', 'purpose'), null)

  const prompt = buildChalkiePromptPreview({
    lesson,
    packageShape: 'single',
    selectedSuggestions: [],
    teacherAdditions: [],
  })
  assert.match(prompt, /No verified prior learning was selected for this lesson/)
})

test('BE2 curated prior-learning flow still reaches the local prompt', () => {
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
  assert.equal(lesson.priorLearningSuggestions.length, 4)

  let selectedIds: string[] = []
  selectedIds = toggleSelectedSuggestionId(selectedIds, 'PL-19')
  const selected = lesson.priorLearningSuggestions.filter((item) =>
    selectedIds.includes(item.id),
  )
  const prompt = buildChalkiePromptPreview({
    lesson,
    packageShape: 'single',
    selectedSuggestions: selected,
    teacherAdditions: [],
  })
  assert.match(prompt, /\[HM\] Preference \(Unit 7\)/)
  assert.doesNotMatch(prompt, /What do you choose/)
})
