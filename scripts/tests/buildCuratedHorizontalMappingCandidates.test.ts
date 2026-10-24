/**
 * Slice 3 — curated earlier-unit [HM] candidates.
 * Run: npx tsx --test scripts/tests/buildCuratedHorizontalMappingCandidates.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { buildChalkiePromptPreview } from '../../app/src/features/chalkie/buildChalkiePromptPreview.ts'
import { buildCuratedHorizontalMappingCandidates } from '../../app/src/features/chalkie/buildCuratedHorizontalMappingCandidates.ts'
import {
  formatCuratedHmProvenanceLine,
  teacherChoiceSuggestionFromPriorLearningCandidate,
} from '../../app/src/features/chalkie/priorLearningCandidate.ts'
import { resolveChalkieLessonContext } from '../../app/src/features/chalkie/resolveChalkieLessonContext.ts'
import {
  initialSelectedPriorLearningIds,
  mergeStep2PriorLearningSuggestions,
  surfaceCuratedHorizontalMappingSuggestions,
} from '../../app/src/features/chalkie/surfaceSameUnitPriorLearningSuggestions.ts'
import { BE2_U08_AI_SUGGESTIONS } from '../../app/src/features/chalkie/teacherChoiceSuggestions.ts'
import type { PriorLearningCandidate } from '../../app/src/features/chalkie/priorLearningCandidate.ts'
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
    level: overrides.level ?? '2',
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

test('BE2 U8 opener pages surface verified curated [HM] in store order', () => {
  const candidates = buildCuratedHorizontalMappingCandidates({
    catalogBookId: 'big_english_2_sb',
    unitNumber: 8,
    visiblePrintedPages: [128, 129],
  })
  assert.deepEqual(
    candidates.map((item) => item.id),
    ['PL-19', 'PL-08', 'PL-01', 'PL-03'],
  )
  assert.ok(candidates.every((item) => item.sourceType === 'HM'))
  assert.ok(candidates.every((item) => item.verificationStatus === 'verified'))
  assert.ok(
    candidates.every((item) => item.unitNumber !== 8),
    'source unit must be earlier than target unit',
  )

  const suggestions = surfaceCuratedHorizontalMappingSuggestions(candidates)
  assert.deepEqual(suggestions, BE2_U08_AI_SUGGESTIONS)
})

test('excludes non-matching book, unit, and non-exact target spreads', () => {
  assert.deepEqual(
    buildCuratedHorizontalMappingCandidates({
      catalogBookId: 'big_english_3_sb',
      unitNumber: 8,
      visiblePrintedPages: [128, 129],
    }),
    [],
  )
  assert.deepEqual(
    buildCuratedHorizontalMappingCandidates({
      catalogBookId: 'big_english_2_sb',
      unitNumber: 7,
      visiblePrintedPages: [128, 129],
    }),
    [],
  )
  assert.deepEqual(
    buildCuratedHorizontalMappingCandidates({
      catalogBookId: 'big_english_2_sb',
      unitNumber: 8,
      visiblePrintedPages: [130, 131],
    }),
    [],
  )
})

test('never surfaces current-page source evidence as curated [HM]', () => {
  const candidates = buildCuratedHorizontalMappingCandidates({
    catalogBookId: 'big_english_2_sb',
    unitNumber: 8,
    // Overlaps PL-19 source pages 113/116 — must not invent a looser match;
    // targetPrintedPages also fail exact match, so empty is correct.
    visiblePrintedPages: [113, 116],
  })
  assert.deepEqual(candidates, [])
})

test('provenance/display distinguishes [HM] from [PRIOR] wording', () => {
  assert.equal(
    formatCuratedHmProvenanceLine({
      source: 'Unit 7 · SB pp.113–116',
    }),
    '[HM] · Unit 7 · SB pp.113–116 · optional earlier-unit support — not current-page evidence',
  )
  const [candidate] = buildCuratedHorizontalMappingCandidates({
    catalogBookId: 'big_english_2_sb',
    unitNumber: 8,
    visiblePrintedPages: [128, 129],
  })
  assert.ok(candidate)
  const suggestion = teacherChoiceSuggestionFromPriorLearningCandidate(candidate)
  assert.equal(suggestion.provenanceTag, '[HM]')
  assert.equal(suggestion.evidenceKindLabel, undefined)
})

test('merge keeps PRIOR first, then HM, and drops overlapping HM duplicates', () => {
  const prior: PriorLearningCandidate = {
    id: 'same-unit-vocab-demo',
    catalogBookId: 'big_english_3_sb',
    unitNumber: 8,
    printedPages: [128],
    pageIds: [],
    sourceType: 'PRIOR',
    title: 'Healthy and unhealthy activities',
    contentPreview: 'have a big breakfast',
    whyItMayHelp: 'earlier in this unit',
    provenanceNote: 'same-unit',
    target: 'both',
    teacherNote: null,
    verificationStatus: 'verified',
    sourceReference: 'Earlier in this unit · p.128',
    caution: 'exposure ≠ mastery',
    evidenceKind: 'vocabulary',
  }
  const hmDuplicateId: PriorLearningCandidate = {
    ...prior,
    id: prior.id,
    sourceType: 'HM',
    contentPreview: 'Do you like + noun?',
    sourceReference: 'Unit 7 · SB pp.113–116',
  }
  const hmDuplicateFrame: PriorLearningCandidate = {
    id: 'PL-frame-dup',
    catalogBookId: 'big_english_2_sb',
    unitNumber: 7,
    printedPages: [113],
    pageIds: [],
    sourceType: 'HM',
    title: 'Dup frame',
    contentPreview: 'have a big breakfast',
    whyItMayHelp: 'overlap',
    provenanceNote: 'dup',
    target: 'both',
    teacherNote: null,
    verificationStatus: 'verified',
    sourceReference: 'Unit 7',
    caution: 'caution',
  }
  const hmOk: PriorLearningCandidate = {
    id: 'PL-08',
    catalogBookId: 'big_english_2_sb',
    unitNumber: 2,
    printedPages: [28],
    pageIds: [],
    sourceType: 'HM',
    title: 'Agreement',
    contentPreview: 'Me, too! / Me neither!',
    whyItMayHelp: 'extend',
    provenanceNote: 'u2',
    target: 'both',
    teacherNote: null,
    verificationStatus: 'verified',
    sourceReference: 'Unit 2 · SB p.28',
    caution: 'polarity',
  }

  const merged = mergeStep2PriorLearningSuggestions({
    sameUnitPriorCandidates: [prior],
    curatedHmCandidates: [hmDuplicateId, hmDuplicateFrame, hmOk],
  })
  assert.deepEqual(
    merged.map((item) => item.id),
    ['same-unit-vocab-demo', 'PL-08'],
  )
  assert.equal(merged[0]?.provenanceTag, '[PRIOR]')
  assert.equal(merged[1]?.provenanceTag, '[HM]')
})

test('BE2 resolver route stays optional/unchecked and handoff uses [HM] only when selected', () => {
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
  assert.deepEqual(
    resolved.curatedHorizontalMappingCandidates.map((item) => item.id),
    ['PL-19', 'PL-08', 'PL-01', 'PL-03'],
  )
  assert.deepEqual(resolved.priorLearningSuggestions, BE2_U08_AI_SUGGESTIONS)
  assert.deepEqual(initialSelectedPriorLearningIds(), [])

  const emptyHandoff = buildChalkiePromptPreview({
    lesson: resolved,
    packageShape: 'single',
    selectedSuggestions: [],
    teacherAdditions: [],
  })
  assert.match(emptyHandoff, /No verified prior learning was selected/)
  assert.doesNotMatch(emptyHandoff, /\[HM\] Preference/)

  const selected = resolved.priorLearningSuggestions.filter((item) => item.id === 'PL-19')
  const withHm = buildChalkiePromptPreview({
    lesson: resolved,
    packageShape: 'single',
    selectedSuggestions: selected,
    teacherAdditions: [],
  })
  assert.match(withHm, /\[HM\] Preference: Unit 07 pp\.113-116/)
})

test('BE3 ready route keeps PRIOR behavior and has no curated [HM] without entries', () => {
  const resolved = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
      level: '3',
    }),
    summary: be3Unit8Summary(),
    visiblePrintedPages: [140],
    unitNumber: 8,
  })
  assert.equal(resolved.status, 'ready')
  assert.ok(resolved.sameUnitPriorLearningCandidates.length > 0)
  assert.deepEqual(resolved.curatedHorizontalMappingCandidates, [])
  assert.ok(
    resolved.priorLearningSuggestions.every(
      (item) => item.provenanceTag === '[PRIOR]',
    ),
  )
  assert.ok(
    resolved.priorLearningSuggestions.some(
      (item) => item.evidenceKindLabel === 'Vocabulary',
    ),
  )
})

test('Slice 3 modules stay free of remote model / fetch wiring', () => {
  for (const relative of [
    'app/src/features/chalkie/curatedHorizontalMappingEntries.ts',
    'app/src/features/chalkie/buildCuratedHorizontalMappingCandidates.ts',
  ]) {
    const source = fs.readFileSync(path.join(ROOT, relative), 'utf8')
    assert.doesNotMatch(source, /\bOpenAI\b|\bfetch\s*\(/)
    assert.doesNotMatch(source, /sourceType:\s*'TEACHER_ADDED'/)
  }
})
