/**
 * Dual column-set Book Intelligence contract tests.
 *
 *   node --test scripts/tests/book_intelligence_column_sets.test.mjs
 */

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  COLUMN_SETS,
  UI_FIELDS_BY_COLUMN_SET,
  requiredUnitKeysForColumnSet,
  validateBookIntelligence,
} from '../lib/book_intelligence_contract.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '../..')
const BE3_FILE = resolve(
  root,
  'data/phase2/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json',
)

function sharedUnitFields() {
  return {
    unit_id: 'fixture_unit_01',
    unit_number: '1',
    title: 'Fixture Unit',
    printed_page_start: 1,
    printed_page_end: 10,
    vocabulary: 'words',
    grammar_structures: 'forms',
    communicative_functions: 'functions',
    learning_outcomes: 'outcomes',
    learning_outcomes_provenance: 'ai_inferred',
    clil_culture: 'clil',
    values: 'values',
    phonics: 'phonics',
  }
}

function eightColumnFixture() {
  return {
    schema_name: 'book_intelligence_unit_overview',
    schema_version: '0.1-draft',
    layer: 'phase2_interpretation',
    column_set: 'eight_column_baseline',
    catalog_book_id: 'fixture_eight_column_sb',
    units: [sharedUnitFields()],
  }
}

function nineColumnFixture() {
  return {
    schema_name: 'book_intelligence_unit_overview',
    schema_version: '0.1-draft',
    layer: 'phase2_interpretation',
    column_set: 'nine_column_ab',
    catalog_book_id: 'fixture_nine_column_sb',
    units: [
      {
        ...sharedUnitFields(),
        writing: 'Sentence craft',
      },
    ],
  }
}

test('column sets allow-list includes eight and nine', () => {
  assert.deepEqual(COLUMN_SETS, [
    'eight_column_baseline',
    'nine_column_ab',
  ])
})

test('writing required only for nine_column_ab', () => {
  assert.ok(!requiredUnitKeysForColumnSet('eight_column_baseline').includes('writing'))
  assert.ok(requiredUnitKeysForColumnSet('nine_column_ab').includes('writing'))
})

test('UI fields: eight-column omits writing; nine-column includes it', () => {
  assert.equal(UI_FIELDS_BY_COLUMN_SET.eight_column_baseline.length, 7)
  assert.ok(!UI_FIELDS_BY_COLUMN_SET.eight_column_baseline.includes('writing'))
  assert.equal(UI_FIELDS_BY_COLUMN_SET.nine_column_ab.length, 8)
  assert.ok(UI_FIELDS_BY_COLUMN_SET.nine_column_ab.includes('writing'))
})

test('eight_column_baseline accepts unit without writing', () => {
  const { errors, mapped } = validateBookIntelligence(eightColumnFixture())
  assert.deepEqual(errors, [])
  assert.equal(mapped.columnSet, 'eight_column_baseline')
  assert.equal(mapped.units.length, 1)
  assert.equal(mapped.units[0].writing, undefined)
})

test('nine_column_ab rejects unit without writing', () => {
  const raw = nineColumnFixture()
  delete raw.units[0].writing
  const { errors, mapped } = validateBookIntelligence(raw)
  assert.ok(errors.some((e) => e.includes('writing')))
  assert.equal(mapped, null)
})

test('nine_column_ab accepts unit with writing', () => {
  const { errors, mapped } = validateBookIntelligence(nineColumnFixture())
  assert.deepEqual(errors, [])
  assert.equal(mapped.columnSet, 'nine_column_ab')
  assert.equal(mapped.units[0].writing, 'Sentence craft')
})

test('unknown column_set is rejected', () => {
  const raw = eightColumnFixture()
  raw.column_set = 'ten_column_fantasy'
  const { errors, mapped } = validateBookIntelligence(raw)
  assert.ok(errors.some((e) => e.includes('column_set')))
  assert.equal(mapped, null)
})

test('BE3 U1–9 nine_column_ab artifact still validates', () => {
  const raw = JSON.parse(readFileSync(BE3_FILE, 'utf8'))
  const { errors, mapped } = validateBookIntelligence(raw)
  assert.deepEqual(errors, [])
  assert.equal(mapped.columnSet, 'nine_column_ab')
  assert.equal(mapped.catalogBookId, 'big_english_3_sb')
  assert.equal(mapped.units.length, 9)
  for (const unit of mapped.units) {
    assert.ok(unit.writing && unit.writing.trim().length > 0)
  }
})
