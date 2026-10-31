/**
 * Slice 1 — same-unit read-only PRIOR candidate model tests.
 * Run: npx tsx --test scripts/tests/buildSameUnitPriorLearningCandidates.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { buildSameUnitPriorLearningCandidates } from '../../app/src/features/chalkie/buildSameUnitPriorLearningCandidates.ts'
import { deriveSameUnitEarlierVocabularySuggestions } from '../../app/src/features/chalkie/deriveSameUnitEarlierVocabularySuggestions.ts'
import {
  neutralPriorSupportInputFromCandidate,
  priorLearningProvenanceLabel,
  teacherChoiceSuggestionFromPriorLearningCandidate,
} from '../../app/src/features/chalkie/priorLearningCandidate.ts'
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

test('same-unit PRIOR candidates include required Slice 1 fields for BE3 U8 LiA', () => {
  const candidates = buildSameUnitPriorLearningCandidates({
    summary: be3Unit8Summary(),
    visiblePrintedPages: [132, 133],
    unitNumber: 8,
    catalogBookId: 'big_english_3_sb',
  })

  assert.equal(candidates.length, 1)
  const candidate = candidates[0]!
  assert.equal(candidate.sourceType, 'PRIOR')
  assert.equal(candidate.verificationStatus, 'verified')
  assert.equal(candidate.catalogBookId, 'big_english_3_sb')
  assert.equal(candidate.unitNumber, 8)
  assert.deepEqual(candidate.printedPages, [128])
  assert.ok(candidate.pageIds.length === 1)
  assert.equal(candidate.title, 'Healthy and unhealthy activities')
  assert.match(candidate.contentPreview, /have a big breakfast/)
  assert.match(candidate.whyItMayHelp, /earlier in this unit/i)
  assert.match(candidate.provenanceNote, /Human-verified target vocabulary/)
  assert.equal(candidate.target, 'both')
  assert.equal(candidate.teacherNote, null)
  assert.equal(candidate.sourceReference, 'Earlier in this unit · p.128')
  assert.match(candidate.caution, /not evidence printed on the current spread/)
  assert.equal(candidate.id, `same-unit-vocab-${candidate.pageIds[0]}-128`)
  assert.equal(priorLearningProvenanceLabel(candidate.sourceType), '[PRIOR]')
})

test('current spread pages are never offered as same-unit PRIOR candidates', () => {
  const candidates = buildSameUnitPriorLearningCandidates({
    summary: be3Unit8Summary(),
    visiblePrintedPages: [128, 129],
    unitNumber: 8,
  })
  assert.equal(candidates.length, 0)
})

test('empty earlier vocab yields honest empty candidate list', () => {
  const summary = be3Unit8Summary()
  const raw = asRecord(summary.raw)
  const emptySummary: BatchJsonSummary = {
    ...summary,
    raw: {
      ...raw,
      vocabulary: [],
    },
  }
  const candidates = buildSameUnitPriorLearningCandidates({
    summary: emptySummary,
    visiblePrintedPages: [132, 133],
    unitNumber: 8,
  })
  assert.deepEqual(candidates, [])
})

test('TeacherChoiceSuggestion adapter preserves existing Step 2 card behaviour', () => {
  const candidates = buildSameUnitPriorLearningCandidates({
    summary: be3Unit8Summary(),
    visiblePrintedPages: [132, 133],
    unitNumber: 8,
  })
  const derived = deriveSameUnitEarlierVocabularySuggestions({
    summary: be3Unit8Summary(),
    visiblePrintedPages: [132, 133],
    unitNumber: 8,
  })
  assert.deepEqual(
    candidates.map(teacherChoiceSuggestionFromPriorLearningCandidate),
    derived,
  )
  assert.equal(derived[0]?.provenanceTag, '[PRIOR]')
  assert.equal(derived[0]?.evidenceKindLabel, 'Vocabulary')
  assert.equal(
    derived[0]?.label,
    'Healthy and unhealthy activities: Unit 08 p.128',
  )
})

test('neutral prior-support mapping keeps provenance and both-lesson targets', () => {
  const [candidate] = buildSameUnitPriorLearningCandidates({
    summary: be3Unit8Summary(),
    visiblePrintedPages: [132, 133],
    unitNumber: 8,
  })
  assert.ok(candidate)
  const mapped = neutralPriorSupportInputFromCandidate(candidate)
  assert.equal(mapped.provenance, '[PRIOR]')
  assert.deepEqual(mapped.targetLessons, ['lesson1', 'lesson2'])
  assert.equal(mapped.label, candidate.title)
  assert.equal(mapped.frame, candidate.contentPreview)
})

test('Slice 1 sources remain read-only: no HM or teacher-added builders in module', () => {
  const builderSource = fs.readFileSync(
    path.join(
      ROOT,
      'app/src/features/chalkie/buildSameUnitPriorLearningCandidates.ts',
    ),
    'utf8',
  )
  const modelSource = fs.readFileSync(
    path.join(ROOT, 'app/src/features/chalkie/priorLearningCandidate.ts'),
    'utf8',
  )
  assert.match(builderSource, /sourceType: 'PRIOR'/)
  assert.doesNotMatch(builderSource, /sourceType: 'HM'|TEACHER_ADDED/)
  assert.match(modelSource, /Slice 1/)
  assert.match(modelSource, /No UI selection changes/)
})
