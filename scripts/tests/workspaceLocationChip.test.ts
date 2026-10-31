/**
 * UX-02: sidebar location chip formatting from workspace page scope.
 * Run: npx tsx --test scripts/tests/workspaceLocationChip.test.ts
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import {
  formatPrintedPageScopeLabel,
  formatWorkspaceLocationChip,
} from '../../app/src/features/shell/workspaceLocationChip.ts'

test('BE3 two-page lesson formats as pp.A–B', () => {
  assert.equal(formatPrintedPageScopeLabel([128, 129]), 'pp.128–129')
  assert.equal(
    formatWorkspaceLocationChip({
      bookTitle: 'Big English 3',
      printedPages: [129, 128],
    }),
    'Big English 3 · pp.128–129',
  )
})

test('BE3 single-page lesson formats as p.N', () => {
  assert.equal(formatPrintedPageScopeLabel([141]), 'p.141')
  assert.equal(
    formatWorkspaceLocationChip({
      bookTitle: 'Big English 3',
      printedPages: [141],
    }),
    'Big English 3 · p.141',
  )
})

test('Beehive workspace keeps Beehive title and pages', () => {
  assert.equal(
    formatWorkspaceLocationChip({
      bookTitle: 'Beehive 1',
      printedPages: [6, 7],
    }),
    'Beehive 1 · pp.6–7',
  )
})

test('book transition without pages shows book only (no stale pages)', () => {
  assert.equal(
    formatWorkspaceLocationChip({
      bookTitle: 'Big English 3',
      printedPages: null,
    }),
    'Big English 3',
  )
  assert.equal(
    formatWorkspaceLocationChip({
      bookTitle: 'Big English 3',
      printedPages: [],
    }),
    'Big English 3',
  )
})

test('no-active-book fallback', () => {
  assert.equal(
    formatWorkspaceLocationChip({
      bookTitle: null,
      printedPages: null,
    }),
    'No book selected',
  )
})
