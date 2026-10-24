/**
 * BI → NLP planning context filter (D022).
 * Run: npx tsx --test scripts/tests/toBiPlanningContext.test.ts
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import { toBiPlanningContext } from '../../app/src/lib/bookIntelligence/toBiPlanningContext.ts'
import type { BookIntelligenceUnitOverview } from '../../app/src/types/bookIntelligence.ts'

function unit(
  overrides: Partial<BookIntelligenceUnitOverview> = {},
): BookIntelligenceUnitOverview {
  return {
    unitId: 'big_english_3_sb_unit_08',
    unitNumber: '8',
    title: 'Healthy Living',
    vocabulary: 'healthy, unhealthy — MUST NOT COPY',
    grammarStructures: 'present simple — MUST NOT COPY',
    communicativeFunctions: 'Talk about healthy and unhealthy activities.',
    learningOutcomes: 'I can talk about healthy living.',
    learningOutcomesProvenance: 'ai_inferred',
    clilCulture: 'CLIL — MUST NOT COPY',
    values: 'Values — MUST NOT COPY',
    phonics: 'Phonics — MUST NOT COPY',
    writing: 'Writing — MUST NOT COPY',
    ...overrides,
  }
}

test('toBiPlanningContext keeps communicative focus and LOs with provenance', () => {
  const context = toBiPlanningContext({
    catalogBookId: 'big_english_3_sb',
    unit: unit(),
    biArtifactRef:
      'big-english/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json',
  })
  assert.ok(context)
  assert.equal(context.catalogBookId, 'big_english_3_sb')
  assert.equal(context.unitId, 'big_english_3_sb_unit_08')
  assert.equal(context.unitNumber, '8')
  assert.equal(
    context.communicativeFocus,
    'Talk about healthy and unhealthy activities.',
  )
  assert.equal(context.suggestedLearningOutcomes, 'I can talk about healthy living.')
  assert.equal(context.learningOutcomesProvenance, 'ai_inferred')
  assert.equal(context.layer, 'phase2_interpretation')
  assert.match(context.biArtifactRef ?? '', /book-intelligence-ab/)
  assert.equal(
    Object.prototype.hasOwnProperty.call(context, 'vocabulary'),
    false,
  )
})

test('toBiPlanningContext omits unit vocab/grammar/CLIL/values/phonics/writing fields', () => {
  const context = toBiPlanningContext({
    catalogBookId: 'big_english_3_sb',
    unit: unit(),
  })
  assert.ok(context)
  const serialized = JSON.stringify(context)
  assert.doesNotMatch(serialized, /MUST NOT COPY/)
  assert.doesNotMatch(serialized, /"vocabulary"/)
  assert.doesNotMatch(serialized, /"clilCulture"/)
  assert.doesNotMatch(serialized, /"writing"/)
})

test('toBiPlanningContext returns null when unit number mismatches expected', () => {
  const context = toBiPlanningContext({
    catalogBookId: 'big_english_3_sb',
    unit: unit(),
    expectedUnitNumber: 7,
  })
  assert.equal(context, null)
})

test('toBiPlanningContext accepts matching expected unit number', () => {
  const context = toBiPlanningContext({
    catalogBookId: 'big_english_3_sb',
    unit: unit({ unitNumber: '08' }),
    expectedUnitNumber: 8,
  })
  assert.ok(context)
  assert.equal(context.unitNumber, '08')
})

test('toBiPlanningContext returns null when both planning fields empty', () => {
  const context = toBiPlanningContext({
    catalogBookId: 'big_english_3_sb',
    unit: unit({
      communicativeFunctions: '   ',
      learningOutcomes: '',
    }),
  })
  assert.equal(context, null)
})

test('toBiPlanningContext defaults LO provenance to ai_inferred when LOs present', () => {
  const context = toBiPlanningContext({
    catalogBookId: 'big_english_3_sb',
    unit: unit({
      learningOutcomesProvenance: undefined,
      communicativeFunctions: '',
    }),
  })
  assert.ok(context)
  assert.equal(context.communicativeFocus, null)
  assert.equal(context.learningOutcomesProvenance, 'ai_inferred')
})
