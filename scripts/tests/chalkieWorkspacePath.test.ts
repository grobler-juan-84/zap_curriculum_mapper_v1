/**
 * Compatibility: former chalkieWorkspacePath tests now expect Book Workspace URLs.
 * Run: npx tsx --test scripts/tests/chalkieWorkspacePath.test.ts
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import {
  bookIntelligencePath,
  chalkieWorkspacePath,
} from '../../app/src/features/book-intelligence/bookIntelligenceStorageRegistry.ts'

test('chalkieWorkspacePath builds entry and unit deep links (canonical Book Workspace)', () => {
  assert.equal(chalkieWorkspacePath(), '/app/book-workspace')
  assert.equal(chalkieWorkspacePath(null), '/app/book-workspace')
  assert.equal(chalkieWorkspacePath('1'), '/app/book-workspace?unit=1')
  assert.equal(chalkieWorkspacePath(8), '/app/book-workspace?unit=8')
})

test('deprecated bookIntelligencePath aliases to Book Workspace', () => {
  assert.equal(
    bookIntelligencePath('big_english_3_sb'),
    '/app/book-workspace',
  )
  assert.equal(
    bookIntelligencePath('big_english_3_sb', '1'),
    '/app/book-workspace?unit=1',
  )
})
