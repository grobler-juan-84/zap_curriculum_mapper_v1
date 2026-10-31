/**
 * Read-only spine metadata enrichment for same-unit PRIOR candidates.
 * Run: npx tsx --test scripts/tests/attachUnitLearningSpineMetadata.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  attachUnitLearningSpineMetadata,
  resolveUnitLearningSpineMetadataForCandidate,
} from '../../app/src/features/chalkie/attachUnitLearningSpineMetadata.ts'
import { buildSameUnitPriorLearningCandidates } from '../../app/src/features/chalkie/buildSameUnitPriorLearningCandidates.ts'
import { BE3_U08_UNIT_LEARNING_SPINE } from '../../app/src/features/chalkie/be3U08UnitLearningSpine.ts'
import {
  teacherChoiceSuggestionFromPriorLearningCandidate,
  type PriorLearningCandidate,
} from '../../app/src/features/chalkie/priorLearningCandidate.ts'
import { surfaceSameUnitPriorLearningSuggestions } from '../../app/src/features/chalkie/surfaceSameUnitPriorLearningSuggestions.ts'
import { initialSelectedPriorLearningIds } from '../../app/src/features/chalkie/surfaceSameUnitPriorLearningSuggestions.ts'
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

function baseCandidate(
  overrides: Partial<PriorLearningCandidate> &
    Pick<PriorLearningCandidate, 'id' | 'printedPages'>,
): PriorLearningCandidate {
  return {
    catalogBookId: 'big_english_3_sb',
    unitNumber: 8,
    pageIds: ['fixture-page'],
    sourceType: 'PRIOR',
    title: 'Fixture',
    contentPreview: 'fixture frame',
    whyItMayHelp: 'fixture purpose',
    provenanceNote: 'fixture provenance',
    target: 'both',
    teacherNote: null,
    verificationStatus: 'verified',
    sourceReference: 'Earlier in this unit · fixture',
    caution: 'fixture caution',
    ...overrides,
  }
}

test('BE3 U8 Vocabulary/Song candidate from p.128 resolves to exact core spine component', () => {
  const candidates = buildSameUnitPriorLearningCandidates({
    summary: be3Unit8Summary(),
    visiblePrintedPages: [132, 133],
    unitNumber: 8,
    catalogBookId: 'big_english_3_sb',
  })
  const vocab = candidates.find((item) =>
    item.printedPages.includes(128),
  )
  assert.ok(vocab)
  assert.deepEqual(vocab.printedPages, [128])
  assert.equal(vocab.componentId, 'big_english_3_sb_u08_vocabulary_song')
  assert.equal(vocab.spineRole, 'core')
})

test('BE3 U8 Content Connection candidate from p.134 resolves to exact support spine component', () => {
  const candidates = buildSameUnitPriorLearningCandidates({
    summary: be3Unit8Summary(),
    visiblePrintedPages: [136, 137],
    unitNumber: 8,
    catalogBookId: 'big_english_3_sb',
  })
  const content = candidates.find((item) =>
    item.printedPages.includes(134),
  )
  assert.ok(content)
  assert.deepEqual(content.printedPages, [134])
  assert.equal(content.componentId, 'big_english_3_sb_u08_content_connection_pe')
  assert.equal(content.spineRole, 'support')
})

test('candidate with no matching spine entry remains honestly unclassified', () => {
  const unmatched = attachUnitLearningSpineMetadata(
    baseCandidate({
      id: 'unclassified-fixture',
      printedPages: [999],
      componentId: 'should-be-stripped',
      spineRole: 'core',
    }),
    BE3_U08_UNIT_LEARNING_SPINE,
  )
  assert.equal(unmatched.componentId, undefined)
  assert.equal(unmatched.spineRole, undefined)
  assert.equal(
    resolveUnitLearningSpineMetadataForCandidate(
      unmatched,
      BE3_U08_UNIT_LEARNING_SPINE,
    ),
    null,
  )

  const noSpineBook = attachUnitLearningSpineMetadata(
    baseCandidate({
      id: 'other-book',
      catalogBookId: 'big_english_2_sb',
      printedPages: [128],
    }),
  )
  assert.equal(noSpineBook.componentId, undefined)
  assert.equal(noSpineBook.spineRole, undefined)
})

test('existing candidate content and Step 2 selection behaviour are unchanged', () => {
  const candidates = buildSameUnitPriorLearningCandidates({
    summary: be3Unit8Summary(),
    visiblePrintedPages: [132, 133],
    unitNumber: 8,
    catalogBookId: 'big_english_3_sb',
  })
  assert.equal(candidates.length, 1)
  const candidate = candidates[0]!

  assert.equal(candidate.id, `same-unit-vocab-${candidate.pageIds[0]}-128`)
  assert.equal(candidate.title, 'Healthy and unhealthy activities')
  assert.match(candidate.contentPreview, /have a big breakfast/)
  assert.equal(candidate.sourceReference, 'Earlier in this unit · p.128')
  assert.equal(candidate.sourceType, 'PRIOR')
  assert.equal(candidate.whyItMayHelp.includes('earlier in this unit'), true)

  const suggestion = teacherChoiceSuggestionFromPriorLearningCandidate(candidate)
  assert.equal(
    suggestion.label,
    'Healthy and unhealthy activities: Unit 08 p.128',
  )
  assert.equal(suggestion.frame, candidate.contentPreview)
  assert.equal(suggestion.provenanceTag, '[PRIOR]')
  assert.equal(suggestion.evidenceKindLabel, 'Vocabulary')
  assert.equal('componentId' in suggestion, false)
  assert.equal('spineRole' in suggestion, false)

  const surfaced = surfaceSameUnitPriorLearningSuggestions(candidates)
  assert.deepEqual(
    surfaced.map((item) => item.id),
    [candidate.id],
  )
  assert.deepEqual(initialSelectedPriorLearningIds(), [])
})

test('enrichment module stays internal: no UI or ranking wiring', () => {
  const source = fs.readFileSync(
    path.join(ROOT, 'app/src/features/chalkie/attachUnitLearningSpineMetadata.ts'),
    'utf8',
  )
  assert.match(source, /Does not change wording/)
  assert.doesNotMatch(source, /TeacherChoiceFlowOverlay|priorLearningSuggestions/)
  assert.doesNotMatch(source, /\bOpenAI\b|\bfetch\s*\(/)
})
