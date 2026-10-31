/**
 * PRIOR-01: prior-learning card page labels.
 * Run: npx tsx --test scripts/tests/priorSkillPageLabel.test.ts
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import {
  formatPriorSkillCardTitle,
  formatPriorSkillPageScope,
  BE2_U08_AI_SUGGESTIONS,
} from '../../app/src/features/chalkie/teacherChoiceSuggestions.ts'

test('single-page prior label uses p.N', () => {
  assert.equal(
    formatPriorSkillPageScope({
      unitNumber: 8,
      pageStart: 128,
      pageEnd: 128,
    }),
    'Unit 08 p.128',
  )
  assert.equal(
    formatPriorSkillCardTitle({
      unitNumber: 8,
      pageStart: 128,
      pageEnd: 128,
      skillName: 'Healthy and unhealthy activities',
    }),
    'Healthy and unhealthy activities: Unit 08 p.128',
  )
})

test('multi-page prior label uses pp.A–B', () => {
  assert.equal(
    formatPriorSkillPageScope({
      unitNumber: 7,
      pageStart: 113,
      pageEnd: 116,
    }),
    'Unit 07 pp.113–116',
  )
  assert.equal(
    formatPriorSkillCardTitle({
      unitNumber: 7,
      pageStart: 113,
      pageEnd: 116,
      skillName: 'Preference',
    }),
    'Preference: Unit 07 pp.113–116',
  )
})

test('BE2 golden fixture single-page Agreement uses p.28', () => {
  const agreement = BE2_U08_AI_SUGGESTIONS.find((item) => item.id === 'PL-08')
  assert.ok(agreement)
  assert.equal(agreement.label, 'Agreement: Unit 02 p.28')
  assert.equal(agreement.label.includes('pp.28-28'), false)
})
