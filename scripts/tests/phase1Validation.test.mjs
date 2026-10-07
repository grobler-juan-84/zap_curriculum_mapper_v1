import assert from 'node:assert/strict'
import test from 'node:test'

import { loadBookIdAliasMap } from '../lib/bookIdAliases.mjs'
import {
  findCrossBatchIdCollisions,
  validatePhase1Dataset,
} from '../lib/phase1Validation.mjs'

const aliasMap = loadBookIdAliasMap()
const bookConfig = {
  catalogBookId: 'big_english_1_sb',
  expectedUnits: [1],
}

function canonicalFixture() {
  return {
    schema: {
      name: 'general_curriculum_mapper_phase1',
      version: '0.1',
      status: 'development',
    },
    book: {
      book_id: 'big_english_1_sb',
      catalog_book_id: 'big_english_1_sb',
      series: 'Big English',
      level: '1',
      book_type: 'Student Book',
      source_filename: 'book.pdf',
      source_format: 'PDF',
      printed_page_start: 1,
      printed_page_end: 2,
      verification_status: 'human_verified',
    },
    units: [
      {
        unit_id: 'bep1_unit_01',
        book_id: 'big_english_1_sb',
        unit_number: '1',
        printed_page_start: 1,
        printed_page_end: 2,
        verification_status: 'human_verified',
      },
    ],
    pages: [
      {
        page_id: 'bep1_page_001',
        book_id: 'big_english_1_sb',
        unit_id: 'bep1_unit_01',
        printed_page: 1,
        instructional: true,
        verification_status: 'human_verified',
      },
      {
        page_id: 'bep1_page_002',
        book_id: 'big_english_1_sb',
        unit_id: 'bep1_unit_01',
        printed_page: 2,
        instructional: true,
        verification_status: 'human_verified',
      },
    ],
    vocabulary: [
      {
        vocabulary_id: 'bep1_vocab_0001',
        book_id: 'big_english_1_sb',
        unit_id: 'bep1_unit_01',
        page_id: null,
        term: 'desk',
        classification: 'target',
        verification_status: 'human_verified',
      },
    ],
    language: [],
    activities: [
      {
        activity_id: 'bep1_activity_0001',
        book_id: 'big_english_1_sb',
        unit_id: 'bep1_unit_01',
        page_id: 'bep1_page_001',
        verification_status: 'human_verified',
      },
    ],
    continuous_text: [
      {
        text_id: 'bep1_text_0001',
        book_id: 'big_english_1_sb',
        unit_id: 'bep1_unit_01',
        page_id: 'bep1_page_001',
        verification_status: 'human_verified',
      },
    ],
    curriculum_components: [],
    relationships: [
      {
        relationship_id: 'bep1_relationship_0001',
        book_id: 'big_english_1_sb',
        relationship_type: 'uses',
        source_entity_type: 'activity',
        source_entity_id: 'bep1_activity_0001',
        target_entity_type: 'text',
        target_entity_id: 'bep1_text_0001',
        verification_status: 'human_verified',
      },
    ],
    extraction_issues: [],
    schema_gaps: [],
    verification: {
      status: 'unit_batches_merged',
      catalog_book_id: 'big_english_1_sb',
      schema_version: '0.1',
      whole_book_audit: 'not_started',
      unit_batch_statuses: {
        'unit_01.json': 'verified',
      },
    },
  }
}

function validate(dataset) {
  return validatePhase1Dataset(dataset, {
    mode: 'canonical',
    bookConfig,
    aliasMap,
    generatedAt: '2026-10-07T00:00:00.000Z',
  })
}

test('valid schema 0.1 canonical passes with text_id and nullable page locator', () => {
  const report = validate(canonicalFixture())
  assert.equal(report.summary.status, 'passed')
  assert.equal(report.summary.error_count, 0)
})

test('duplicate primary IDs block validation', () => {
  const fixture = canonicalFixture()
  fixture.pages.push({ ...fixture.pages[0] })
  const report = validate(fixture)
  assert.ok(report.findings.some((finding) => finding.code === 'DUPLICATE_PRIMARY_ID'))
  assert.equal(report.summary.status, 'failed')
})

test('continuous_text_id remains compatible but warns', () => {
  const fixture = canonicalFixture()
  fixture.continuous_text[0].continuous_text_id = fixture.continuous_text[0].text_id
  delete fixture.continuous_text[0].text_id
  fixture.relationships[0].target_entity_id = fixture.continuous_text[0].continuous_text_id
  const report = validate(fixture)
  assert.equal(report.summary.error_count, 0)
  assert.ok(
    report.findings.some((finding) => finding.code === 'CONTINUOUS_TEXT_LEGACY_ID'),
  )
})

test('extensible vocabulary classification warns instead of failing', () => {
  const fixture = canonicalFixture()
  fixture.vocabulary[0].classification = 'publisher_specific'
  const report = validate(fixture)
  assert.equal(report.summary.error_count, 0)
  assert.ok(
    report.findings.some(
      (finding) => finding.code === 'VOCABULARY_CLASSIFICATION_UNKNOWN',
    ),
  )
})

test('unresolved external relationship without target_book_id warns', () => {
  const fixture = canonicalFixture()
  fixture.relationships[0].target_entity_type = 'page'
  fixture.relationships[0].target_entity_id = 'other_series_wb_p001'
  const report = validate(fixture)
  assert.equal(report.summary.error_count, 0)
  assert.ok(
    report.findings.some(
      (finding) => finding.code === 'EXTERNAL_RELATIONSHIP_BOOK_ID_MISSING',
    ),
  )
})

test('explicit external-book endpoint is informational and not resolved locally', () => {
  const fixture = canonicalFixture()
  fixture.relationships[0].target_entity_type = 'page'
  fixture.relationships[0].target_entity_id = 'big_english_1_wb_p001'
  fixture.relationships[0].target_book_id = 'big_english_1_wb'
  const report = validate(fixture)
  assert.equal(report.summary.error_count, 0)
  assert.ok(
    report.findings.some(
      (finding) => finding.code === 'EXTERNAL_RELATIONSHIP_NOT_CHECKED',
    ),
  )
})

test('unresolved same-book relationship endpoint is an error', () => {
  const fixture = canonicalFixture()
  fixture.relationships[0].target_entity_type = 'page'
  fixture.relationships[0].target_entity_id = 'bep1_missing_page'
  const report = validate(fixture)
  assert.ok(
    report.findings.some(
      (finding) => finding.code === 'RELATIONSHIP_TARGET_MISSING',
    ),
  )
  assert.equal(report.summary.status, 'failed')
})

test('same-book relationship outside one batch is deferred until canonical validation', () => {
  const fixture = canonicalFixture()
  fixture.batch = {
    batch_id: 'bep1_batch_u01',
    unit_id: 'bep1_unit_01',
  }
  delete fixture.verification
  fixture.relationships[0].target_entity_type = 'page'
  fixture.relationships[0].target_entity_id = 'bep1_page_from_another_batch'
  const report = validatePhase1Dataset(fixture, {
    mode: 'batch',
    bookConfig,
    aliasMap,
    generatedAt: '2026-10-07T00:00:00.000Z',
  })
  assert.equal(report.summary.error_count, 0)
  assert.ok(
    report.findings.some(
      (finding) => finding.code === 'BATCH_RELATIONSHIP_ENDPOINT_DEFERRED',
    ),
  )
})

test('canonical aliases are rejected after D007 normalization', () => {
  const fixture = canonicalFixture()
  fixture.vocabulary[0].book_id = 'bep1_sb'
  const report = validate(fixture)
  assert.ok(report.findings.some((finding) => finding.code === 'BOOK_ID_NOT_NORMALIZED'))
})

test('cross-batch ID collisions are reported before merge dedupe', () => {
  const batches = [
    { pages: [{ page_id: 'same' }] },
    { pages: [{ page_id: 'same' }] },
  ]
  assert.deepEqual(findCrossBatchIdCollisions(batches), [
    {
      array: 'pages',
      id: 'same',
      first: { batchIndex: 0, recordIndex: 0 },
      duplicate: { batchIndex: 1, recordIndex: 0 },
    },
  ])
})
