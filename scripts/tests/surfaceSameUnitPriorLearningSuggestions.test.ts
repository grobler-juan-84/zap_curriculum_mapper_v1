/**
 * Slice 2 — candidate-aware same-unit PRIOR suggestion surfacing.
 * Run: npx tsx --test scripts/tests/surfaceSameUnitPriorLearningSuggestions.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { buildSameUnitPriorLearningCandidates } from '../../app/src/features/chalkie/buildSameUnitPriorLearningCandidates.ts'
import type { PriorLearningCandidate } from '../../app/src/features/chalkie/priorLearningCandidate.ts'
import { resolveChalkieLessonContext } from '../../app/src/features/chalkie/resolveChalkieLessonContext.ts'
import {
  initialSelectedPriorLearningIds,
  retainSelectedPriorLearningIds,
  surfaceSameUnitPriorLearningSuggestions,
} from '../../app/src/features/chalkie/surfaceSameUnitPriorLearningSuggestions.ts'
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

function hmOnlyCandidate(): PriorLearningCandidate {
  return {
    id: 'hm-fixture-only',
    sourceType: 'HM',
    verificationStatus: 'verified',
    catalogBookId: 'big_english_3_sb',
    unitNumber: 7,
    printedPages: [110],
    pageIds: ['page-hm'],
    title: 'Earlier unit (HM)',
    contentPreview: 'should not surface in Slice 2',
    whyItMayHelp: 'curated HM — out of Slice 2 scope',
    provenanceNote: 'Fixture HM — not built by same-unit PRIOR path',
    target: 'both',
    teacherNote: null,
    sourceReference: 'Earlier unit · p.110',
    caution: 'Not same-unit PRIOR',
  }
}

test('surfaceSameUnitPriorLearningSuggestions maps PRIOR only and preserves order', () => {
  const prior = buildSameUnitPriorLearningCandidates({
    summary: be3Unit8Summary(),
    visiblePrintedPages: [132, 133],
    unitNumber: 8,
    catalogBookId: 'big_english_3_sb',
  })
  assert.equal(prior.length, 1)
  const mixed = [...prior, hmOnlyCandidate()]
  const surfaced = surfaceSameUnitPriorLearningSuggestions(mixed)
  assert.equal(surfaced.length, 1)
  assert.equal(surfaced[0]!.id, prior[0]!.id)
  assert.equal(surfaced[0]!.provenanceTag, '[PRIOR]')
  assert.equal(
    surfaced[0]!.label,
    'Healthy and unhealthy activities: Unit 08 pp.128-128',
  )
})

test('initialSelectedPriorLearningIds is always empty (never auto-select)', () => {
  assert.deepEqual(initialSelectedPriorLearningIds(), [])
})

test('retainSelectedPriorLearningIds drops missing ids and never adds new ones', () => {
  const prior = buildSameUnitPriorLearningCandidates({
    summary: be3Unit8Summary(),
    visiblePrintedPages: [132, 133],
    unitNumber: 8,
    catalogBookId: 'big_english_3_sb',
  })
  const surfaced = surfaceSameUnitPriorLearningSuggestions(prior)
  assert.equal(surfaced.length, 1)
  const kept = retainSelectedPriorLearningIds(
    [surfaced[0]!.id, 'gone-id'],
    surfaced,
  )
  assert.deepEqual(kept, [surfaced[0]!.id])
  assert.deepEqual(retainSelectedPriorLearningIds([], surfaced), [])
})

test('resolver ready path exposes candidates and surfaces them without auto-select semantics', () => {
  const resolved = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8Summary(),
    visiblePrintedPages: [132, 133],
    unitNumber: 8,
  })
  assert.equal(resolved.status, 'ready')
  assert.equal(resolved.sameUnitPriorLearningCandidates.length, 1)
  assert.equal(resolved.sameUnitPriorLearningCandidates[0]!.sourceType, 'PRIOR')
  assert.equal(resolved.priorLearningSuggestions.length, 1)
  assert.equal(
    resolved.priorLearningSuggestions[0]!.id,
    resolved.sameUnitPriorLearningCandidates[0]!.id,
  )
  assert.equal(resolved.priorLearningSuggestions[0]!.provenanceTag, '[PRIOR]')
  assert.deepEqual(initialSelectedPriorLearningIds(), [])
})

test('BE2 fixture keeps curated cards; same-unit PRIOR candidates stay empty', () => {
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
  assert.equal(resolved.priorLearningSuggestions.length, 4)
  assert.deepEqual(
    resolved.priorLearningSuggestions.map((item) => item.id),
    ['PL-19', 'PL-08', 'PL-01', 'PL-03'],
  )
  assert.ok(
    resolved.priorLearningSuggestions.every((item) => item.provenanceTag === '[HM]'),
  )
})

test('surface module keeps PRIOR/HM optional and does not invent School Notes or AI', () => {
  const surfaceSource = fs.readFileSync(
    path.join(
      ROOT,
      'app/src/features/chalkie/surfaceSameUnitPriorLearningSuggestions.ts',
    ),
    'utf8',
  )
  assert.match(surfaceSource, /sourceType === 'PRIOR'/)
  assert.match(surfaceSource, /sourceType === 'HM'/)
  assert.doesNotMatch(surfaceSource, /\bfetch\s*\(/)
  assert.doesNotMatch(surfaceSource, /TEACHER_ADDED/)
  assert.match(surfaceSource, /Never auto-selects/)
  assert.match(surfaceSource, /No OpenAI\/API/)
})
