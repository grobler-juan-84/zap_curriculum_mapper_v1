/**
 * Read-only spine consumer — core component ID listing.
 * Run: npx tsx --test scripts/tests/listCoreUnitLearningSpineComponentIds.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  BE3_U08_UNIT_LEARNING_SPINE,
  BE3_U08_UNIT_LEARNING_SPINE_COMPONENTS,
} from '../../app/src/features/chalkie/be3U08UnitLearningSpine.ts'
import { listCoreUnitLearningSpineComponentIds } from '../../app/src/features/chalkie/listCoreUnitLearningSpineComponentIds.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

test('BE3 Unit 8 returns the three exact core component IDs in declared spine order', () => {
  const ids = listCoreUnitLearningSpineComponentIds('big_english_3_sb', 8)
  assert.deepEqual(ids, [
    'big_english_3_sb_u08_vocabulary_song',
    'big_english_3_sb_u08_language_in_action',
    'big_english_3_sb_u08_grammar',
  ])
  const cores = BE3_U08_UNIT_LEARNING_SPINE_COMPONENTS.filter(
    (item) => item.role === 'core',
  )
  assert.deepEqual(
    cores.map((item) => ({
      id: item.componentId,
      pages: [...item.printedPages],
      title: item.title,
    })),
    [
      {
        id: 'big_english_3_sb_u08_vocabulary_song',
        pages: [128, 129],
        title: 'Vocabulary / Song',
      },
      {
        id: 'big_english_3_sb_u08_language_in_action',
        pages: [132, 133],
        title: 'Language in Action',
      },
      {
        id: 'big_english_3_sb_u08_grammar',
        pages: [136, 137],
        title: 'Grammar',
      },
    ],
  )
})

test('support and review_support components are excluded', () => {
  const ids = listCoreUnitLearningSpineComponentIds('big_english_3_sb', 8)
  const supportIds = BE3_U08_UNIT_LEARNING_SPINE_COMPONENTS.filter(
    (item) => item.role === 'support' || item.role === 'review_support',
  ).map((item) => item.componentId)
  assert.equal(supportIds.length, 7)
  for (const supportId of supportIds) {
    assert.equal(ids.includes(supportId), false)
  }
  assert.equal(ids.includes('big_english_3_sb_u08_story_reading'), false)
  assert.equal(ids.includes('big_english_3_sb_u08_review'), false)
})

test('book/unit without a spine returns an honest empty result', () => {
  assert.deepEqual(listCoreUnitLearningSpineComponentIds('big_english_3_sb', 7), [])
  assert.deepEqual(listCoreUnitLearningSpineComponentIds('big_english_3_wb', 8), [])
  assert.deepEqual(listCoreUnitLearningSpineComponentIds('big_english_2_sb', 8), [])
  assert.deepEqual(listCoreUnitLearningSpineComponentIds('beehive_1_sb', 1), [])
})

test('helper does not alter the spine record', () => {
  const before = JSON.stringify(BE3_U08_UNIT_LEARNING_SPINE)
  const beforeComponents = JSON.stringify(BE3_U08_UNIT_LEARNING_SPINE_COMPONENTS)
  const first = listCoreUnitLearningSpineComponentIds('big_english_3_sb', 8)
  const second = listCoreUnitLearningSpineComponentIds('big_english_3_sb', 8)
  assert.deepEqual(first, second)
  assert.equal(JSON.stringify(BE3_U08_UNIT_LEARNING_SPINE), before)
  assert.equal(
    JSON.stringify(BE3_U08_UNIT_LEARNING_SPINE_COMPONENTS),
    beforeComponents,
  )
  assert.equal(BE3_U08_UNIT_LEARNING_SPINE.components.length, 10)
})

test('consumer stays read-only: no Step 2, ranking, or UI wiring', () => {
  const source = fs.readFileSync(
    path.join(
      ROOT,
      'app/src/features/chalkie/listCoreUnitLearningSpineComponentIds.ts',
    ),
    'utf8',
  )
  assert.match(source, /Does not influence Step 2/)
  assert.doesNotMatch(source, /priorLearningSuggestions|TeacherChoiceFlowOverlay/)
  assert.doesNotMatch(source, /\bOpenAI\b|\bfetch\s*\(/)
})
