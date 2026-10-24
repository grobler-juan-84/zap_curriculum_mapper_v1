/**
 * BE3 U8 Unit Learning Spine — read-only data foundation tests.
 * Run: npx tsx --test scripts/tests/be3U08UnitLearningSpine.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  BE3_U08_SPINE_CATALOG_BOOK_ID,
  BE3_U08_SPINE_UNIT_NUMBER,
  BE3_U08_SPINE_UNIT_TITLE,
  BE3_U08_UNIT_LEARNING_SPINE,
  BE3_U08_UNIT_LEARNING_SPINE_COMPONENTS,
  getUnitLearningSpine,
} from '../../app/src/features/chalkie/be3U08UnitLearningSpine.ts'
import {
  coreComponents,
  supportComponents,
} from '../../app/src/features/chalkie/unitLearningSpine.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

test('BE3 U8 spine identity and component count', () => {
  assert.equal(BE3_U08_UNIT_LEARNING_SPINE.catalogBookId, 'big_english_3_sb')
  assert.equal(BE3_U08_UNIT_LEARNING_SPINE.unitNumber, 8)
  assert.equal(BE3_U08_UNIT_LEARNING_SPINE.unitTitle, 'Healthy Living')
  assert.equal(BE3_U08_UNIT_LEARNING_SPINE_COMPONENTS.length, 10)
  assert.equal(
    BE3_U08_UNIT_LEARNING_SPINE.components,
    BE3_U08_UNIT_LEARNING_SPINE_COMPONENTS,
  )
})

test('exact core entries: Vocabulary/Song, Language in Action, Grammar', () => {
  const cores = coreComponents(BE3_U08_UNIT_LEARNING_SPINE)
  assert.deepEqual(
    cores.map((item) => ({
      id: item.componentId,
      title: item.title,
      pages: [...item.printedPages],
      kind: item.learningKind,
      seq: item.sequencingPosition,
    })),
    [
      {
        id: 'big_english_3_sb_u08_vocabulary_song',
        title: 'Vocabulary / Song',
        pages: [128, 129],
        kind: 'vocabulary',
        seq: 'Core 1',
      },
      {
        id: 'big_english_3_sb_u08_language_in_action',
        title: 'Language in Action',
        pages: [132, 133],
        kind: 'communicative_language',
        seq: 'Core 3',
      },
      {
        id: 'big_english_3_sb_u08_grammar',
        title: 'Grammar',
        pages: [136, 137],
        kind: 'grammar',
        seq: 'Core 5',
      },
    ],
  )
  assert.ok(cores.every((item) => item.role === 'core'))
  assert.ok(cores.every((item) => item.verificationStatus === 'human_verified'))
})

test('exact support / review_support entries and page scopes', () => {
  const support = supportComponents(BE3_U08_UNIT_LEARNING_SPINE)
  assert.deepEqual(
    support.map((item) => ({
      id: item.componentId,
      title: item.title,
      pages: [...item.printedPages],
      role: item.role,
      kind: item.learningKind,
    })),
    [
      {
        id: 'big_english_3_sb_u08_story_reading',
        title: 'Story / Reading',
        pages: [130, 131],
        role: 'support',
        kind: 'reading_content',
      },
      {
        id: 'big_english_3_sb_u08_content_connection_pe',
        title: 'Content Connection / P.E.',
        pages: [134, 135],
        role: 'support',
        kind: 'reading_content',
      },
      {
        id: 'big_english_3_sb_u08_culture_connection',
        title: 'Culture Connection',
        pages: [138, 139],
        role: 'support',
        kind: 'reading_content',
      },
      {
        id: 'big_english_3_sb_u08_writing',
        title: 'Writing',
        pages: [140],
        role: 'support',
        kind: 'writing',
      },
      {
        id: 'big_english_3_sb_u08_phonics',
        title: 'Phonics',
        pages: [141],
        role: 'support',
        kind: 'phonics',
      },
      {
        id: 'big_english_3_sb_u08_values',
        title: 'Values',
        pages: [142],
        role: 'support',
        kind: 'values_review',
      },
      {
        id: 'big_english_3_sb_u08_review',
        title: 'Review',
        pages: [143],
        role: 'review_support',
        kind: 'values_review',
      },
    ],
  )
})

test('unit teaching order is preserved (page-ascending component sequence)', () => {
  const pages = BE3_U08_UNIT_LEARNING_SPINE_COMPONENTS.map(
    (item) => item.printedPages[0],
  )
  assert.deepEqual(pages, [128, 130, 132, 134, 136, 138, 140, 141, 142, 143])
  const ids = BE3_U08_UNIT_LEARNING_SPINE_COMPONENTS.map((item) => item.componentId)
  assert.deepEqual(ids, [
    'big_english_3_sb_u08_vocabulary_song',
    'big_english_3_sb_u08_story_reading',
    'big_english_3_sb_u08_language_in_action',
    'big_english_3_sb_u08_content_connection_pe',
    'big_english_3_sb_u08_grammar',
    'big_english_3_sb_u08_culture_connection',
    'big_english_3_sb_u08_writing',
    'big_english_3_sb_u08_phonics',
    'big_english_3_sb_u08_values',
    'big_english_3_sb_u08_review',
  ])
})

test('stable IDs are unique and every entry is human_verified for BE3 U8 only', () => {
  const ids = BE3_U08_UNIT_LEARNING_SPINE_COMPONENTS.map((item) => item.componentId)
  assert.equal(new Set(ids).size, ids.length)
  for (const item of BE3_U08_UNIT_LEARNING_SPINE_COMPONENTS) {
    assert.equal(item.catalogBookId, BE3_U08_SPINE_CATALOG_BOOK_ID)
    assert.equal(item.unitNumber, BE3_U08_SPINE_UNIT_NUMBER)
    assert.equal(item.unitTitle, BE3_U08_SPINE_UNIT_TITLE)
    assert.equal(item.verificationStatus, 'human_verified')
    assert.ok(item.recycleReason.length > 0)
    assert.match(item.componentId, /^big_english_3_sb_u08_/)
  }
})

test('lookup returns spine only for big_english_3_sb unit 8', () => {
  assert.equal(
    getUnitLearningSpine('big_english_3_sb', 8),
    BE3_U08_UNIT_LEARNING_SPINE,
  )
  assert.equal(getUnitLearningSpine('big_english_3_sb', 7), null)
  assert.equal(getUnitLearningSpine('big_english_3_wb', 8), null)
  assert.equal(getUnitLearningSpine('big_english_2_sb', 8), null)
  assert.equal(getUnitLearningSpine('beehive_1_sb', 8), null)
})

test('spine modules stay read-only: no ranking, UI, or prior-learning wiring', () => {
  const typeSource = fs.readFileSync(
    path.join(ROOT, 'app/src/features/chalkie/unitLearningSpine.ts'),
    'utf8',
  )
  const dataSource = fs.readFileSync(
    path.join(ROOT, 'app/src/features/chalkie/be3U08UnitLearningSpine.ts'),
    'utf8',
  )
  assert.doesNotMatch(typeSource, /\bOpenAI\b|\bfetch\s*\(/)
  assert.doesNotMatch(dataSource, /\bOpenAI\b|\bfetch\s*\(/)
  assert.doesNotMatch(typeSource, /priorLearningSuggestions|TeacherChoiceFlowOverlay/)
  assert.doesNotMatch(dataSource, /priorLearningSuggestions|TeacherChoiceFlowOverlay/)
  assert.match(dataSource, /Not wired to Step 2/)
  assert.match(typeSource, /No ranking/)
})
