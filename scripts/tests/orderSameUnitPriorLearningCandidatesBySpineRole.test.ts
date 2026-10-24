/**
 * Narrow spine-role ordering for same-unit PRIOR candidates.
 * Run: npx tsx --test scripts/tests/orderSameUnitPriorLearningCandidatesBySpineRole.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { buildSameUnitPriorLearningCandidates } from '../../app/src/features/chalkie/buildSameUnitPriorLearningCandidates.ts'
import { orderSameUnitPriorLearningCandidatesBySpineRole } from '../../app/src/features/chalkie/orderSameUnitPriorLearningCandidatesBySpineRole.ts'
import type { PriorLearningCandidate } from '../../app/src/features/chalkie/priorLearningCandidate.ts'
import { resolveChalkieLessonContext } from '../../app/src/features/chalkie/resolveChalkieLessonContext.ts'
import {
  BE2_U08_VOCABULARY,
} from '../../app/src/features/chalkie/teacherChoicePrototypeContent.ts'
import type { Book } from '../../app/src/types/curriculum.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
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

function fixtureCandidate(
  overrides: Partial<PriorLearningCandidate> &
    Pick<PriorLearningCandidate, 'id' | 'printedPages'>,
): PriorLearningCandidate {
  return {
    catalogBookId: 'big_english_3_sb',
    unitNumber: 8,
    pageIds: ['fixture'],
    sourceType: 'PRIOR',
    title: overrides.title ?? overrides.id,
    contentPreview: 'frame',
    whyItMayHelp: 'purpose',
    provenanceNote: 'note',
    target: 'both',
    teacherNote: null,
    verificationStatus: 'verified',
    sourceReference: 'Earlier in this unit',
    caution: 'caution',
    ...overrides,
  }
}

test('BE3 U8 Grammar pp.136–137: p.128 Vocabulary/Song core appears before p.134 Content Connection support', () => {
  const candidates = buildSameUnitPriorLearningCandidates({
    summary: be3Unit8Summary(),
    visiblePrintedPages: [136, 137],
    unitNumber: 8,
    catalogBookId: 'big_english_3_sb',
  })
  assert.ok(candidates.length >= 2)
  const vocab = candidates.find((item) => item.printedPages.includes(128))
  const content = candidates.find((item) => item.printedPages.includes(134))
  assert.ok(vocab)
  assert.ok(content)
  assert.equal(vocab.spineRole, 'core')
  assert.equal(vocab.componentId, 'big_english_3_sb_u08_vocabulary_song')
  assert.equal(content.spineRole, 'support')
  assert.equal(content.componentId, 'big_english_3_sb_u08_content_connection_pe')
  assert.ok(candidates.indexOf(vocab) < candidates.indexOf(content))
})

test('spine membership alone never invents a PRIOR candidate', () => {
  const candidates = buildSameUnitPriorLearningCandidates({
    summary: be3Unit8Summary(),
    visiblePrintedPages: [136, 137],
    unitNumber: 8,
    catalogBookId: 'big_english_3_sb',
  })
  const pages = candidates.flatMap((item) => [...item.printedPages])
  // Core LiA / Grammar and Story are on the spine but have no earlier target vocab
  // for this view — they must not appear merely because they are spine components.
  assert.equal(pages.includes(130), false)
  assert.equal(pages.includes(132), false)
  assert.equal(pages.includes(133), false)
  assert.equal(pages.includes(136), false)
  assert.equal(pages.includes(137), false)
  assert.ok(pages.every((page) => page < 136))
})

test('candidates with the same spine role retain existing source order', () => {
  const supportLaterFirst = fixtureCandidate({
    id: 'support-b',
    printedPages: [138],
    spineRole: 'support',
    title: 'Zebra support',
  })
  const supportEarlierSecond = fixtureCandidate({
    id: 'support-a',
    printedPages: [134],
    spineRole: 'support',
    title: 'Alpha support',
  })
  const core = fixtureCandidate({
    id: 'core-a',
    printedPages: [128],
    spineRole: 'core',
    title: 'Core',
  })
  // Source order deliberately puts a later support before an earlier support,
  // and support before core — role ordering must promote core, but keep
  // support-b before support-a (source order within role).
  const ordered = orderSameUnitPriorLearningCandidatesBySpineRole([
    supportLaterFirst,
    supportEarlierSecond,
    core,
  ])
  assert.deepEqual(
    ordered.map((item) => item.id),
    ['core-a', 'support-b', 'support-a'],
  )
})

test('book/unit without a spine retains existing candidate order', () => {
  const first = fixtureCandidate({
    id: 'no-spine-1',
    catalogBookId: 'big_english_2_sb',
    unitNumber: 8,
    printedPages: [120],
    title: 'Later title sorts after if we sorted by title',
  })
  const second = fixtureCandidate({
    id: 'no-spine-2',
    catalogBookId: 'big_english_2_sb',
    unitNumber: 8,
    printedPages: [110],
    title: 'AAA would come first if sorted by title',
  })
  assert.equal(first.spineRole, undefined)
  assert.equal(second.spineRole, undefined)
  const ordered = orderSameUnitPriorLearningCandidatesBySpineRole([first, second])
  assert.deepEqual(
    ordered.map((item) => item.id),
    ['no-spine-1', 'no-spine-2'],
  )

  const fromBuilder = buildSameUnitPriorLearningCandidates({
    summary: {
      ...be3Unit8Summary(),
      catalogBookId: 'unspined_book_sb',
    },
    visiblePrintedPages: [136, 137],
    unitNumber: 8,
    catalogBookId: 'unspined_book_sb',
  })
  assert.ok(fromBuilder.every((item) => item.spineRole === undefined))
  const pages = fromBuilder.map((item) => item.printedPages[0])
  for (let i = 1; i < pages.length; i += 1) {
    assert.ok((pages[i - 1] ?? 0) <= (pages[i] ?? 0))
  }
})

test('existing BE2 fixture cards remain separate and unchanged', () => {
  const resolved = resolveChalkieLessonContext({
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
  assert.equal(resolved.isBe2U08PrototypeRoute, true)
  assert.deepEqual(resolved.sameUnitPriorLearningCandidates, [])
  assert.deepEqual(resolved.vocabulary, [...BE2_U08_VOCABULARY])
  assert.deepEqual(
    resolved.priorLearningSuggestions.map((item) => item.id),
    ['PL-19', 'PL-08', 'PL-01', 'PL-03'],
  )
})

test('ordering module does not invent candidates or wire UI', () => {
  const source = fs.readFileSync(
    path.join(
      ROOT,
      'app/src/features/chalkie/orderSameUnitPriorLearningCandidatesBySpineRole.ts',
    ),
    'utf8',
  )
  assert.match(source, /Does not invent candidates/)
  assert.doesNotMatch(source, /TeacherChoiceFlowOverlay|OpenAI|fetch\s*\(/)
})
