/**
 * Optional Chalkie BI framing flag (D022 Phase 4).
 * Run: npx tsx --test scripts/tests/chalkieBiFraming.test.ts
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import type { BiPlanningContext } from '../../app/src/lib/bookIntelligence/toBiPlanningContext.ts'
import type { Be3U08OpenerSeriesHandoff } from '../../app/src/features/chalkie/buildBe3U08OpenerSbWbSeriesHandoff.ts'
import {
  applyOpenerBiFramingToHandoff,
  BE3_U08_OPENER_BI_FRAMING_ENV,
  isBe3U08OpenerBiFramingEnabled,
} from '../../app/src/features/chalkie/chalkieBiFraming.ts'

const bi: BiPlanningContext = {
  catalogBookId: 'big_english_3_sb',
  unitId: 'big_english_3_sb_unit_08',
  unitNumber: '8',
  communicativeFocus: 'Talk about healthy and unhealthy activities.',
  suggestedLearningOutcomes: 'I can talk about healthy living.',
  learningOutcomesProvenance: 'ai_inferred',
  biArtifactRef: null,
  layer: 'phase2_interpretation',
}

function handoffStub(): Be3U08OpenerSeriesHandoff {
  return {
    relationshipId: 'be3_sb_wb_rel_u08_opener_sb128-129_wb104-105',
    seriesTitle: 'Test series',
    stableSeriesReference: 'be3-sb-wb-u08-p128-129-wb104-105',
    detailedHandoff: 'DETAILED HANDOFF BODY\n',
    lesson1Outline: 'L1 outline',
    lesson1Vocabulary: 'word a, word b',
    lesson2Outline: 'L2 outline',
    lesson2Vocabulary: 'word c',
  }
}

test('BI framing flag defaults off', () => {
  assert.equal(isBe3U08OpenerBiFramingEnabled({}), false)
  assert.equal(
    isBe3U08OpenerBiFramingEnabled({ [BE3_U08_OPENER_BI_FRAMING_ENV]: 'false' }),
    false,
  )
  assert.equal(
    isBe3U08OpenerBiFramingEnabled({ [BE3_U08_OPENER_BI_FRAMING_ENV]: 'true' }),
    true,
  )
})

test('flag off leaves handoff unchanged (parity path)', () => {
  const original = handoffStub()
  const next = applyOpenerBiFramingToHandoff(original, bi, { enabled: false })
  assert.deepEqual(next, original)
})

test('flag on appends labelled BI block to detailedHandoff only', () => {
  const original = handoffStub()
  const next = applyOpenerBiFramingToHandoff(original, bi, { enabled: true })
  assert.match(
    next.detailedHandoff,
    /UNIT PLANNING CONTEXT \(Book Intelligence · phase2_interpretation\)/,
  )
  assert.match(
    next.detailedHandoff,
    /Communicative focus: Talk about healthy and unhealthy activities\./,
  )
  assert.equal(next.lesson1Outline, original.lesson1Outline)
  assert.equal(next.lesson1Vocabulary, original.lesson1Vocabulary)
  assert.equal(next.lesson2Outline, original.lesson2Outline)
  assert.equal(next.lesson2Vocabulary, original.lesson2Vocabulary)
})

test('flag on with missing BI context leaves handoff unchanged', () => {
  const original = handoffStub()
  const next = applyOpenerBiFramingToHandoff(original, null, { enabled: true })
  assert.deepEqual(next, original)
})
