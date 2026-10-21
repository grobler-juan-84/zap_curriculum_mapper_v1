/**
 * Focused chalkieWorkspacePath / legacy BI path alias tests.
 * Run: npx tsx --test scripts/tests/chalkieWorkspacePath.test.ts
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import {
  bookIntelligencePath,
  chalkieWorkspacePath,
} from '../../app/src/features/book-intelligence/bookIntelligenceStorageRegistry.ts'

test('chalkieWorkspacePath builds entry and unit deep links', () => {
  assert.equal(chalkieWorkspacePath(), '/app/chalkie')
  assert.equal(chalkieWorkspacePath(null), '/app/chalkie')
  assert.equal(chalkieWorkspacePath('1'), '/app/chalkie?unit=1')
  assert.equal(chalkieWorkspacePath(8), '/app/chalkie?unit=8')
})

test('deprecated bookIntelligencePath aliases to Chalkie Workspace', () => {
  assert.equal(
    bookIntelligencePath('big_english_3_sb'),
    '/app/chalkie',
  )
  assert.equal(
    bookIntelligencePath('big_english_3_sb', '1'),
    '/app/chalkie?unit=1',
  )
})
