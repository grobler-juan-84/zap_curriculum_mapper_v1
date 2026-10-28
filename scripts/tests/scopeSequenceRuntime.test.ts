import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  findScopeSequenceUnit,
  parseScopeSequenceV2,
} from '../../app/src/features/scope-sequence/scopeSequence.ts'
import {
  getScopeSequenceStorageArtifact,
  SCOPE_SEQUENCE_STORAGE_ARTIFACTS,
} from '../../app/src/features/scope-sequence/scopeSequenceStorageRegistry.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

const EXPECTED = {
  big_english_3_sb: {
    file: 'BE3_SS.JSON',
    sha256: 'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a',
    target: 'Big English 3',
  },
  big_english_4_sb: {
    file: 'BE4_SS.JSON',
    sha256: 'e48b0832ec1ac1e2aafa690a69900ecf6b2a50aaed54946d02f6daf3fee354ce',
    target: 'Big English 4',
  },
  big_english_5_sb: {
    file: 'BE5_SS.JSON',
    sha256: 'a3b221412a765b5e2f323d86b67df1163b71b534dcdb1ac7fe19e231af8128c5',
    target: 'Big English 5',
  },
  big_english_6_sb: {
    file: 'BE6_SS.JSON',
    sha256: '5ec3a4bd6e93380db0d796e49d63e5551f4ead859876de3570dfdfeafbd4d746',
    target: 'Big English 6',
  },
} as const

const APPROVED_SOURCE_DIR = path.join(ROOT, 'docs/SS_JSON_FILES NEW')
const APPROVED_SOURCES_PRESENT = Object.values(EXPECTED).every((expected) =>
  fs.existsSync(path.join(APPROVED_SOURCE_DIR, expected.file)),
)

function loadApproved(file: string): { bytes: Buffer; raw: unknown } {
  const bytes = fs.readFileSync(path.join(APPROVED_SOURCE_DIR, file))
  return { bytes, raw: JSON.parse(bytes.toString('utf8')) as unknown }
}

function fixtureUnit(unitNumber: string, title: string) {
  return {
    unit_number_raw: unitNumber,
    unit_title_raw: title,
    student_book_pages_raw: `pp. ${unitNumber}–${Number(unitNumber) + 1}`,
    source_location: { pdf_pages: [Number(unitNumber)] },
    publisher_categories: [
      {
        category_name_raw: 'Vocabulary',
        column_order: 1,
        cell_status: 'present',
        raw_text: `Exact vocabulary for ${title}`,
        content_blocks: [{ heading_raw: 'Vocabulary:', entries_raw: [title] }],
      },
    ],
  }
}

function scopeSequenceFixture(): unknown {
  return {
    schema_version: 'ss-extraction-v2',
    extraction_metadata: { prompt_version: 'SS-V2', target_level: 'Big English 3' },
    source_metadata: {
      source_filename: 'fixture.pdf',
      publisher: 'Pearson',
      series: 'Big English',
      level: 3,
      edition: null,
      pdf_pages: [1, 2],
    },
    original_column_headings: ['Unit', 'Vocabulary'],
    units: [fixtureUnit('1', 'Unit One'), fixtureUnit('2', 'Unit Two')],
    checkpoints_and_reviews: [],
    back_matter: [],
    extraction_issues: [],
    qa_summary: {
      visible_unit_count: 2,
      extracted_unit_count: 2,
      all_columns_checked: true,
      row_alignment_checked: true,
      second_visual_transcription_pass_completed: true,
      total_issue_count: 0,
      unresolved_issue_count: 0,
    },
  }
}

test('registry contains exactly the approved BE3–6 SS artifacts and leaves BE1–2 unchanged', () => {
  assert.deepEqual(Object.keys(SCOPE_SEQUENCE_STORAGE_ARTIFACTS), Object.keys(EXPECTED))
  assert.equal(getScopeSequenceStorageArtifact('big_english_1_sb'), null)
  assert.equal(getScopeSequenceStorageArtifact('big_english_2_sb'), null)

  for (const [catalogBookId, expected] of Object.entries(EXPECTED)) {
    const artifact = getScopeSequenceStorageArtifact(catalogBookId)
    assert.ok(artifact)
    assert.equal(artifact.expectedSha256, expected.sha256)
    assert.equal(artifact.expectedTargetLevel, expected.target)
    assert.equal(
      artifact.storagePath,
      `big-english/${catalogBookId}/canonical/ss_v1.json`,
    )
  }
})

test(
  'local approved BE3–6 files match their audit hashes and parse losslessly',
  { skip: !APPROVED_SOURCES_PRESENT },
  () => {
  for (const expected of Object.values(EXPECTED)) {
    const { bytes, raw } = loadApproved(expected.file)
    assert.equal(createHash('sha256').update(bytes).digest('hex'), expected.sha256)
    const parsed = parseScopeSequenceV2(raw)
    assert.equal(parsed.ok, true)
    if (!parsed.ok) continue

    assert.equal(parsed.data.extractionMetadata.targetLevel, expected.target)
    assert.equal(parsed.data.units.length, 9)
    assert.deepEqual(
      parsed.data.units.map((unit) => unit.unitNumberRaw),
      ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    )
    assert.equal(JSON.stringify(parsed.data.raw), JSON.stringify(raw))

    const rawUnits = (raw as { units: Array<{ publisher_categories: unknown[] }> }).units
    parsed.data.units.forEach((unit, index) => {
      assert.equal(
        unit.publisherCategories.length,
        rawUnits[index]?.publisher_categories.length,
      )
    })
  }
  },
)

test('v2 adapter retains the complete source document, units, and categories', () => {
  const raw = scopeSequenceFixture()
  const parsed = parseScopeSequenceV2(raw)
  assert.equal(parsed.ok, true)
  if (!parsed.ok) return
  assert.equal(JSON.stringify(parsed.data.raw), JSON.stringify(raw))
  assert.equal(parsed.data.units[0]?.raw, (raw as { units: unknown[] }).units[0])
  assert.equal(
    parsed.data.units[0]?.publisherCategories[0]?.raw,
    (raw as { units: Array<{ publisher_categories: unknown[] }> }).units[0]
      ?.publisher_categories[0],
  )
})

test('unit lookup uses the exact publisher unit_number_raw without title reinterpretation', () => {
  const parsed = parseScopeSequenceV2(scopeSequenceFixture())
  assert.equal(parsed.ok, true)
  if (!parsed.ok) return
  assert.equal(findScopeSequenceUnit(parsed.data, 2)?.unitTitleRaw, 'Unit Two')
  assert.equal(findScopeSequenceUnit(parsed.data, 1)?.unitTitleRaw, 'Unit One')
  assert.equal(findScopeSequenceUnit(parsed.data, 3), null)
})

test('invalid or missing SS fails closed without affecting other data paths', () => {
  const parsed = parseScopeSequenceV2({ schema_version: 'wrong', units: [] })
  assert.equal(parsed.ok, false)
  assert.equal(findScopeSequenceUnit(null, 1), null)
})

test('SS integration remains display-only and outside prompt/package modules', () => {
  const chalkieDir = path.join(ROOT, 'app/src/features/chalkie')
  const imports = fs
    .readdirSync(chalkieDir)
    .filter((file) => /\.(ts|tsx)$/.test(file))
    .filter((file) =>
      fs.readFileSync(path.join(chalkieDir, file), 'utf8').includes('scope-sequence'),
    )
    .sort()
  assert.deepEqual(imports, ['ChalkieLeftPanel.tsx', 'ChalkieWorkspace.tsx'])

  const panel = fs.readFileSync(
    path.join(chalkieDir, 'ChalkieLeftPanel.tsx'),
    'utf8',
  )
  const workspace = fs.readFileSync(
    path.join(chalkieDir, 'ChalkieWorkspace.tsx'),
    'utf8',
  )
  assert.match(panel, /Curriculum Authority/)
  assert.match(panel, /Publisher SS · read-only/)
  assert.match(panel, /category\.rawText/)
  assert.match(workspace, /scopeSequenceBookId !== book\.catalogBookId/)
})
