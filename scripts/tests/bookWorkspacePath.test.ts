/**
 * Canonical Book Workspace path helpers + legacy aliases.
 * Run: npx tsx --test scripts/tests/bookWorkspacePath.test.ts scripts/tests/chalkieWorkspacePath.test.ts
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import {
  bookIntelligencePath,
  bookWorkspaceChooseBookPath,
  bookWorkspacePath,
  chalkieWorkspacePath,
} from '../../app/src/features/book-intelligence/bookIntelligenceStorageRegistry.ts'

test('bookWorkspacePath builds entry and unit deep links', () => {
  assert.equal(bookWorkspacePath(), '/app/book-workspace')
  assert.equal(bookWorkspacePath(null), '/app/book-workspace')
  assert.equal(bookWorkspacePath('1'), '/app/book-workspace?unit=1')
  assert.equal(bookWorkspacePath(8), '/app/book-workspace?unit=8')
})

test('bookWorkspaceChooseBookPath opens in-workspace course-level chooser', () => {
  assert.equal(bookWorkspaceChooseBookPath(), '/app/book-workspace?chooseBook=1')
})

test('legacy chalkieWorkspacePath aliases to Book Workspace', () => {
  assert.equal(chalkieWorkspacePath(), '/app/book-workspace')
  assert.equal(chalkieWorkspacePath(8), '/app/book-workspace?unit=8')
})

test('deprecated bookIntelligencePath aliases to Book Workspace', () => {
  assert.equal(bookIntelligencePath('big_english_3_sb'), '/app/book-workspace')
  assert.equal(
    bookIntelligencePath('big_english_3_sb', '1'),
    '/app/book-workspace?unit=1',
  )
})
