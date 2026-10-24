/**
 * Light teacher-facing evidence-kind distinction for same-unit [PRIOR] cards.
 * Run: npx tsx --test scripts/tests/priorLearningEvidenceKindDisplay.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { assembleSameUnitPriorLearningCandidates } from '../../app/src/features/chalkie/assembleSameUnitPriorLearningCandidates.ts'
import {
  formatSameUnitPriorProvenanceLine,
  priorLearningEvidenceKindDisplayLabel,
  teacherChoiceSuggestionFromPriorLearningCandidate,
} from '../../app/src/features/chalkie/priorLearningCandidate.ts'
import { surfaceSameUnitPriorLearningSuggestions } from '../../app/src/features/chalkie/surfaceSameUnitPriorLearningSuggestions.ts'
import { BE2_U08_AI_SUGGESTIONS } from '../../app/src/features/chalkie/teacherChoiceSuggestions.ts'
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

test('display labels map vocabulary / LiA / Grammar without inventing kinds', () => {
  assert.equal(priorLearningEvidenceKindDisplayLabel('vocabulary'), 'Vocabulary')
  assert.equal(
    priorLearningEvidenceKindDisplayLabel('communicative_language'),
    'Language in Action',
  )
  assert.equal(priorLearningEvidenceKindDisplayLabel('grammar'), 'Grammar')
  assert.equal(priorLearningEvidenceKindDisplayLabel(undefined), undefined)
  assert.equal(priorLearningEvidenceKindDisplayLabel(null), undefined)
})

test('provenance line keeps [PRIOR] + optional-support copy and inserts evidence kind', () => {
  assert.equal(
    formatSameUnitPriorProvenanceLine({
      source: 'Earlier in this unit · p.128',
      evidenceKindLabel: 'Vocabulary',
    }),
    '[PRIOR] · Earlier in this unit · p.128 · Vocabulary · optional same-unit support — not current-page evidence',
  )
  assert.equal(
    formatSameUnitPriorProvenanceLine({
      source: 'Earlier in this unit · p.132',
      evidenceKindLabel: 'Language in Action',
    }),
    '[PRIOR] · Earlier in this unit · p.132 · Language in Action · optional same-unit support — not current-page evidence',
  )
  assert.equal(
    formatSameUnitPriorProvenanceLine({
      source: 'Earlier in this unit · p.136',
      evidenceKindLabel: 'Grammar',
      includeOptionalSupportNote: false,
    }),
    '[PRIOR] · Earlier in this unit · p.136 · Grammar',
  )
  assert.equal(
    formatSameUnitPriorProvenanceLine({
      source: 'Earlier in this unit · p.128',
    }),
    '[PRIOR] · Earlier in this unit · p.128 · optional same-unit support — not current-page evidence',
  )
})

test('adapter surfaces evidenceKindLabel for assembled same-unit candidates', () => {
  const assembled = assembleSameUnitPriorLearningCandidates({
    summary: be3Unit8Summary(),
    visiblePrintedPages: [140],
    unitNumber: 8,
    catalogBookId: 'big_english_3_sb',
  })
  const suggestions = surfaceSameUnitPriorLearningSuggestions(assembled)

  const byKind = new Map(
    suggestions.map((item) => [item.evidenceKindLabel, item] as const),
  )
  assert.equal(byKind.get('Vocabulary')?.provenanceTag, '[PRIOR]')
  assert.equal(byKind.get('Language in Action')?.provenanceTag, '[PRIOR]')
  assert.equal(byKind.get('Grammar')?.provenanceTag, '[PRIOR]')

  for (const candidate of assembled) {
    const suggestion = teacherChoiceSuggestionFromPriorLearningCandidate(candidate)
    assert.equal(
      suggestion.evidenceKindLabel,
      priorLearningEvidenceKindDisplayLabel(candidate.evidenceKind),
    )
    assert.equal(
      formatSameUnitPriorProvenanceLine({
        source: suggestion.source,
        evidenceKindLabel: suggestion.evidenceKindLabel,
      }).includes('optional same-unit support — not current-page evidence'),
      true,
    )
  }
})

test('BE2 fixture cards stay without evidenceKindLabel', () => {
  assert.ok(
    BE2_U08_AI_SUGGESTIONS.every((item) => item.evidenceKindLabel == null),
  )
})

test('overlay uses plain provenance helper; no evidence-kind badges or filters', () => {
  const overlay = fs.readFileSync(
    path.join(ROOT, 'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx'),
    'utf8',
  )
  assert.match(overlay, /formatSameUnitPriorProvenanceLine/)
  assert.match(overlay, /priorLearningEvidenceKindDisplayLabel/)
  assert.doesNotMatch(overlay, /EvidenceKindBadge|evidenceKindFilter|autoSelectPrior/i)
  assert.match(
    overlay,
    /includeOptionalSupportNote:\s*Boolean\(priorCandidate\)/,
  )
})
