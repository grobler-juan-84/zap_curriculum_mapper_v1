/**
 * Step 2 assembly: vocabulary + language/grammar same-unit PRIOR candidates.
 * Run: npx tsx --test scripts/tests/assembleSameUnitPriorLearningCandidates.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { assembleSameUnitPriorLearningCandidates } from '../../app/src/features/chalkie/assembleSameUnitPriorLearningCandidates.ts'
import { resolveChalkieLessonContext } from '../../app/src/features/chalkie/resolveChalkieLessonContext.ts'
import {
  initialSelectedPriorLearningIds,
  surfaceSameUnitPriorLearningSuggestions,
} from '../../app/src/features/chalkie/surfaceSameUnitPriorLearningSuggestions.ts'
import { BE2_U08_VOCABULARY } from '../../app/src/features/chalkie/teacherChoicePrototypeContent.ts'
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

function resolveBe3(pages: number[]) {
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

test('verified LiA and Grammar cards surface on eligible later Unit 8 lessons', () => {
  const onGrammar = resolveBe3([136, 137])
  assert.equal(onGrammar.status, 'ready')
  const lia = onGrammar.sameUnitPriorLearningCandidates.find(
    (item) => item.evidenceKind === 'communicative_language',
  )
  assert.ok(lia)
  assert.equal(lia.componentId, 'big_english_3_sb_u08_language_in_action')
  assert.equal(lia.spineRole, 'core')
  assert.match(lia.contentPreview, /Did you have breakfast/)
  assert.equal(
    onGrammar.sameUnitPriorLearningCandidates.some(
      (item) => item.evidenceKind === 'grammar',
    ),
    false,
  )

  const suggestions = surfaceSameUnitPriorLearningSuggestions(
    onGrammar.sameUnitPriorLearningCandidates,
  )
  assert.ok(suggestions.some((item) => item.id === lia.id))
  assert.equal(suggestions.find((item) => item.id === lia.id)?.provenanceTag, '[PRIOR]')

  const onWriting = resolveBe3([140])
  const grammar = onWriting.sameUnitPriorLearningCandidates.find(
    (item) => item.evidenceKind === 'grammar',
  )
  assert.ok(grammar)
  assert.equal(grammar.componentId, 'big_english_3_sb_u08_grammar')
  assert.equal(grammar.spineRole, 'core')
  assert.match(grammar.contentPreview, /played \/ walked \/ stayed/)
  assert.ok(
    onWriting.priorLearningSuggestions.some((item) => item.id === grammar.id),
  )
})

test('LiA and Grammar do not surface on their own pages or earlier pages', () => {
  const onLia = resolveBe3([132, 133])
  assert.equal(
    onLia.sameUnitPriorLearningCandidates.some(
      (item) => item.evidenceKind === 'communicative_language',
    ),
    false,
  )
  assert.equal(
    onLia.sameUnitPriorLearningCandidates.some(
      (item) => item.evidenceKind === 'grammar',
    ),
    false,
  )
  assert.ok(
    onLia.sameUnitPriorLearningCandidates.some((item) =>
      item.printedPages.includes(128),
    ),
  )

  const onGrammar = resolveBe3([136, 137])
  assert.equal(
    onGrammar.sameUnitPriorLearningCandidates.some(
      (item) => item.evidenceKind === 'grammar',
    ),
    false,
  )
  assert.ok(
    onGrammar.sameUnitPriorLearningCandidates.some(
      (item) => item.evidenceKind === 'communicative_language',
    ),
  )

  const onOpener = resolveBe3([128, 129])
  assert.deepEqual(onOpener.sameUnitPriorLearningCandidates, [])
})

test('vocabulary, LiA, and Grammar core cards appear in spine order when all eligible', () => {
  const assembled = assembleSameUnitPriorLearningCandidates({
    summary: be3Unit8Summary(),
    visiblePrintedPages: [140],
    unitNumber: 8,
    catalogBookId: 'big_english_3_sb',
  })
  const cores = assembled.filter((item) => item.spineRole === 'core')
  assert.deepEqual(
    cores.map((item) => item.evidenceKind),
    ['vocabulary', 'communicative_language', 'grammar'],
  )
  assert.deepEqual(
    cores.map((item) => item.componentId),
    [
      'big_english_3_sb_u08_vocabulary_song',
      'big_english_3_sb_u08_language_in_action',
      'big_english_3_sb_u08_grammar',
    ],
  )
  const firstSupportIndex = assembled.findIndex(
    (item) => item.spineRole === 'support',
  )
  const lastCoreIndex = Math.max(
    ...cores.map((item) => assembled.indexOf(item)),
  )
  assert.ok(firstSupportIndex > lastCoreIndex)
})

test('cards remain unchecked by default', () => {
  assert.deepEqual(initialSelectedPriorLearningIds(), [])
  const resolved = resolveBe3([140])
  assert.ok(resolved.priorLearningSuggestions.length >= 3)
  assert.deepEqual(initialSelectedPriorLearningIds(), [])
})

test('existing support cards and BE2 fixture cards remain unchanged', () => {
  const onGrammar = resolveBe3([136, 137])
  const content = onGrammar.sameUnitPriorLearningCandidates.find((item) =>
    item.printedPages.includes(134),
  )
  assert.ok(content)
  assert.equal(content.spineRole, 'support')
  assert.equal(content.componentId, 'big_english_3_sb_u08_content_connection_pe')
  assert.equal(content.evidenceKind, 'vocabulary')
  const contentSuggestion = onGrammar.priorLearningSuggestions.find(
    (item) => item.id === content.id,
  )
  assert.equal(contentSuggestion?.evidenceKindLabel, 'Vocabulary')

  const be2 = resolveChalkieLessonContext({
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
  assert.equal(be2.isBe2U08PrototypeRoute, true)
  assert.deepEqual(be2.sameUnitPriorLearningCandidates, [])
  assert.deepEqual(be2.vocabulary, [...BE2_U08_VOCABULARY])
  assert.deepEqual(
    be2.priorLearningSuggestions.map((item) => item.id),
    ['PL-19', 'PL-08', 'PL-01', 'PL-03'],
  )
  assert.ok(
    be2.priorLearningSuggestions.every((item) => item.evidenceKindLabel == null),
  )
  assert.ok(
    be2.priorLearningSuggestions.every((item) => item.provenanceTag === '[HM]'),
  )
  assert.deepEqual(
    be2.curatedHorizontalMappingCandidates.map((item) => item.id),
    ['PL-19', 'PL-08', 'PL-01', 'PL-03'],
  )
})

test('no HM, School Notes, or AI behaviour in assemble / resolve path', () => {
  const assembleSource = fs.readFileSync(
    path.join(
      ROOT,
      'app/src/features/chalkie/assembleSameUnitPriorLearningCandidates.ts',
    ),
    'utf8',
  )
  assert.doesNotMatch(assembleSource, /\bOpenAI\b|\bfetch\s*\(/)
  assert.doesNotMatch(assembleSource, /sourceType: 'HM'|TEACHER_ADDED/)

  const resolved = resolveBe3([140])
  assert.ok(
    resolved.priorLearningSuggestions.every(
      (item) => item.provenanceTag === '[PRIOR]' || item.provenanceTag == null,
    ),
  )
  assert.ok(
    resolved.sameUnitPriorLearningCandidates.every(
      (item) => item.sourceType === 'PRIOR',
    ),
  )
})
