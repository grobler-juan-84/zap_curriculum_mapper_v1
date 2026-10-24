/**
 * Session teacher-added prior-skill path (not School Notes).
 * Run: npx tsx --test scripts/tests/teacherAddedPriorSkillPath.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { buildChalkiePromptPreview } from '../../app/src/features/chalkie/buildChalkiePromptPreview.ts'
import {
  formatCuratedHmProvenanceLine,
  formatSameUnitPriorProvenanceLine,
  formatTeacherAddedProvenanceLine,
} from '../../app/src/features/chalkie/priorLearningCandidate.ts'
import { resolveChalkieLessonContext } from '../../app/src/features/chalkie/resolveChalkieLessonContext.ts'
import {
  appendTeacherAddedLanguage,
  toggleSelectedSuggestionId,
} from '../../app/src/features/chalkie/teacherChoiceFlow.ts'
import type { Book } from '../../app/src/types/curriculum.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OVERLAY_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx',
)
const BE3_CANONICAL_PATH = path.join(
  ROOT,
  'data/phase1/big_english_3_sb/canonical/v1.json',
)

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

function be3Unit8Summary(): BatchJsonSummary {
  const rawBook = JSON.parse(
    fs.readFileSync(BE3_CANONICAL_PATH, 'utf8'),
  ) as Record<string, unknown>
  const unit = asArray(rawBook.units).find((entry) => {
    const u = asRecord(entry)
    return u.unit_number === 8 || u.unit_number === '8'
  })
  const unitRec = asRecord(unit)
  const start =
    typeof unitRec.printed_page_start === 'number'
      ? unitRec.printed_page_start
      : 128
  const end =
    typeof unitRec.printed_page_end === 'number'
      ? unitRec.printed_page_end
      : 143
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
    curriculum_components: asArray(rawBook.curriculum_components).filter(
      (entry) => pageIds.has(String(asRecord(entry).page_id ?? '')),
    ),
  }

  return {
    catalogBookId: 'big_english_3_sb',
    units: [
      {
        unitNumber: 8,
        title:
          typeof unitRec.title === 'string' ? unitRec.title : 'Healthy Living',
        printedPageStart: start,
        printedPageEnd: end,
      },
    ],
    vocabulary: [],
    language: [],
    activities: [],
    pages: [],
    raw,
  }
}

test('teacher-added provenance is distinct from PRIOR and HM wording', () => {
  assert.equal(
    formatTeacherAddedProvenanceLine(),
    '[TEACHER-ADDED · UNVERIFIED] · session only — not publisher evidence',
  )
  assert.equal(
    formatTeacherAddedProvenanceLine({ includeSessionNote: false }),
    '[TEACHER-ADDED · UNVERIFIED]',
  )
  assert.notEqual(
    formatTeacherAddedProvenanceLine(),
    formatSameUnitPriorProvenanceLine({
      source: 'Earlier in this unit · p.128',
      evidenceKindLabel: 'Vocabulary',
    }),
  )
  assert.notEqual(
    formatTeacherAddedProvenanceLine(),
    formatCuratedHmProvenanceLine({ source: 'Unit 7 · SB pp.113–116' }),
  )
})

test('appendTeacherAddedLanguage is session-shaped and never invents PRIOR/HM ids', () => {
  const added = appendTeacherAddedLanguage(
    [],
    'Preference echo',
    'I like cheetahs, too.',
    'School preference',
    () => 'teacher-added-test-1',
  )
  assert.ok(added)
  assert.equal(added[0]?.id, 'teacher-added-test-1')
  assert.doesNotMatch(added[0]!.id, /^PL-/)
  assert.doesNotMatch(added[0]!.id, /^same-unit-/)
  assert.equal(
    appendTeacherAddedLanguage([], 'Title', '', 'purpose'),
    null,
  )
})

test('teacher-added reaches handoff only when explicitly selected; unchecked stays out', () => {
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8Summary(),
    visiblePrintedPages: [132, 133],
    unitNumber: 8,
  })
  const added = appendTeacherAddedLanguage(
    [],
    'Past habits',
    'What did you do yesterday?',
    'Warm-up',
    () => 'teacher-added-1',
  )
  assert.ok(added)

  const withoutSelection = buildChalkiePromptPreview({
    lesson,
    packageShape: 'single',
    selectedSuggestions: [],
    teacherAdditions: [],
  })
  assert.doesNotMatch(withoutSelection, /\[TEACHER-ADDED · UNVERIFIED\] Past habits/)
  assert.doesNotMatch(withoutSelection, /What did you do yesterday\?/)

  let selectedIds: string[] = []
  selectedIds = toggleSelectedSuggestionId(selectedIds, 'teacher-added-1')
  const withSelection = buildChalkiePromptPreview({
    lesson,
    packageShape: 'single',
    selectedSuggestions: [],
    teacherAdditions: added
      .filter((item) => selectedIds.includes(item.id))
      .map(({ title, frame, purpose }) => ({ title, frame, purpose })),
  })
  assert.match(
    withSelection,
    /\[TEACHER-ADDED · UNVERIFIED\] Past habits: What did you do yesterday\?/,
  )
  assert.match(withSelection, /Purpose: Warm-up/)
  assert.doesNotMatch(withSelection, /\[PRIOR\].*Past habits/)
  assert.doesNotMatch(withSelection, /\[HM\].*Past habits/)
})

test('overlay shows teacher-added provenance, does not auto-select on add, not School Notes', () => {
  const overlay = fs.readFileSync(OVERLAY_PATH, 'utf8')
  assert.match(overlay, /formatTeacherAddedProvenanceLine/)
  assert.match(overlay, /Session only\. New skills stay unchecked/)
  assert.match(overlay, /not publisher[\s\S]{0,80}evidence or School Notes/)
  assert.doesNotMatch(overlay, /future instructions to come here/)
  assert.doesNotMatch(overlay, /schoolNotes|School-Specific Notes accordion/i)
  // Adding must not auto-check into selectedIds.
  assert.doesNotMatch(
    overlay,
    /appendTeacherAddedLanguage[\s\S]{0,400}setSelectedIds\(\(prev\) => \(prev\.includes\(id\)/,
  )
  assert.match(
    overlay,
    /Session teacher-added stays optional\/unchecked — never auto-selected into handoff/,
  )
})

test('teacher-added does not alter PRIOR/HM suggestion lists from the resolver', () => {
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8Summary(),
    visiblePrintedPages: [132, 133],
    unitNumber: 8,
  })
  const before = lesson.priorLearningSuggestions.map((item) => item.id)
  appendTeacherAddedLanguage(
    [],
    'Extra',
    'Frame',
    'Purpose',
    () => 'teacher-added-extra',
  )
  assert.deepEqual(
    lesson.priorLearningSuggestions.map((item) => item.id),
    before,
  )
  assert.ok(
    lesson.priorLearningSuggestions.every(
      (item) => item.provenanceTag === '[PRIOR]' || item.provenanceTag === '[HM]',
    ),
  )
})
