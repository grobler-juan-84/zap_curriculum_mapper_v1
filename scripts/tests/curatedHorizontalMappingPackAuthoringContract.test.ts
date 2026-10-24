/**
 * Curated `[HM]` pack authoring contract gate.
 *
 * Ensures checked-in curated entries remain traceable to the verification-ready
 * authoring fields and rejects incomplete packs/entries. Does not manufacture a
 * second product route or alter runtime builder output.
 *
 * Run: npx tsx --test scripts/tests/curatedHorizontalMappingPackAuthoringContract.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { buildCuratedHorizontalMappingCandidates } from '../../app/src/features/chalkie/buildCuratedHorizontalMappingCandidates.ts'
import {
  BE2_U08_CURATED_HORIZONTAL_MAPPING_ENTRIES,
  listCuratedHorizontalMappingEntries,
  type CuratedHorizontalMappingEntry,
} from '../../app/src/features/chalkie/curatedHorizontalMappingEntries.ts'
import {
  BE2_U08_CURATED_HM_PACK_TARGET,
  BE2_U08_CURATED_HM_PACK_VERIFICATION_EVIDENCE,
  be2U08CuratedHmPackAuthoringRecord,
  isCuratedHorizontalMappingPackAuthoringComplete,
  validateCuratedHorizontalMappingEntry,
  validateCuratedHorizontalMappingPackAuthoring,
} from '../../app/src/features/chalkie/curatedHorizontalMappingPackAuthoringContract.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

const CONTRACT_DOC =
  'docs/phase-5/curated-horizontal-mapping-pack-authoring-contract-v0.1.md'

function baseEntry(
  overrides: Partial<CuratedHorizontalMappingEntry> = {},
): CuratedHorizontalMappingEntry {
  return {
    id: 'PL-TEST',
    catalogBookId: 'big_english_2_sb',
    targetUnitNumber: 8,
    targetPrintedPages: [128, 129],
    sourceUnitNumber: 7,
    sourcePrintedPages: [113],
    title: 'Preference',
    contentPreview: 'Do you like …?',
    whyItMayHelp: 'Supports preference practice.',
    caution: 'Keep polarity accurate.',
    provenanceNote: 'Earlier Unit 7 preference language.',
    sourceReference: 'Unit 7 · SB p.113',
    ...overrides,
  }
}

test('authoring contract doc exists and names minimum unlock fields', () => {
  const doc = fs.readFileSync(path.join(ROOT, CONTRACT_DOC), 'utf8')
  assert.match(doc, /verification-ready authoring gate/i)
  assert.match(doc, /catalogBookId/)
  assert.match(doc, /targetPrintedPages/)
  assert.match(doc, /sourceUnitNumber/)
  assert.match(doc, /Same-unit exclusion/)
  assert.match(doc, /Current-page exclusion/)
  assert.match(doc, /Ownership \/ verification evidence/)
  assert.match(doc, /Fixture and acceptance-test/)
  assert.match(doc, /BE2 Unit 8 opener/)
  assert.match(doc, /No School Notes/)
})

test('checked-in curated entries remain structurally complete and exclusion-safe', () => {
  const entries = listCuratedHorizontalMappingEntries()
  assert.equal(entries.length, 4)
  assert.deepEqual(
    entries.map((item) => item.id),
    BE2_U08_CURATED_HORIZONTAL_MAPPING_ENTRIES.map((item) => item.id),
  )

  for (const entry of entries) {
    const issues = validateCuratedHorizontalMappingEntry(entry, {
      expectedCatalogBookId: BE2_U08_CURATED_HM_PACK_TARGET.catalogBookId,
      expectedTargetUnitNumber: BE2_U08_CURATED_HM_PACK_TARGET.targetUnitNumber,
      expectedTargetPrintedPages: BE2_U08_CURATED_HM_PACK_TARGET.targetPrintedPages,
    })
    assert.deepEqual(issues, [], `${entry.id}: ${JSON.stringify(issues)}`)
  }
})

test('BE2 U8 reference pack authoring record is complete against live store', () => {
  const pack = be2U08CuratedHmPackAuthoringRecord(
    listCuratedHorizontalMappingEntries(),
  )
  assert.equal(isCuratedHorizontalMappingPackAuthoringComplete(pack), true)
  assert.deepEqual(validateCuratedHorizontalMappingPackAuthoring(pack), [])
  assert.equal(pack.verificationEvidence.ownerVerified, true)
  assert.ok(pack.verificationEvidence.evidenceDocPaths.includes(CONTRACT_DOC))
  for (const evidencePath of BE2_U08_CURATED_HM_PACK_VERIFICATION_EVIDENCE.evidenceDocPaths) {
    assert.ok(
      fs.existsSync(path.join(ROOT, evidencePath)),
      `missing evidence doc: ${evidencePath}`,
    )
  }
})

test('rejects incomplete entries (missing fields, same-unit, current-page overlap)', () => {
  const missingTitle = validateCuratedHorizontalMappingEntry(
    baseEntry({ title: '   ' }),
  )
  assert.ok(missingTitle.some((issue) => issue.path.endsWith('.title')))

  const sameUnit = validateCuratedHorizontalMappingEntry(
    baseEntry({ sourceUnitNumber: 8 }),
  )
  assert.ok(sameUnit.some((issue) => /same-unit/i.test(issue.message)))

  const currentPage = validateCuratedHorizontalMappingEntry(
    baseEntry({ sourcePrintedPages: [128] }),
  )
  assert.ok(currentPage.some((issue) => /current-page/i.test(issue.message)))

  const noTargetPages = validateCuratedHorizontalMappingEntry(
    baseEntry({ targetPrintedPages: [] }),
  )
  assert.ok(
    noTargetPages.some((issue) => issue.path.endsWith('.targetPrintedPages')),
  )
})

test('rejects incomplete packs (no verification, empty entries, wrong target)', () => {
  const noEvidence = validateCuratedHorizontalMappingPackAuthoring({
    catalogBookId: 'big_english_3_sb',
    targetUnitNumber: 8,
    targetPrintedPages: [128, 129],
    entries: [baseEntry({ catalogBookId: 'big_english_3_sb' })],
    verificationEvidence: {
      ownerVerified: true,
      evidenceDocPaths: [],
      summary: '',
    },
  })
  assert.ok(
    noEvidence.some((issue) =>
      issue.path.startsWith('verificationEvidence.evidenceDocPaths'),
    ),
  )
  assert.ok(
    noEvidence.some((issue) => issue.path.startsWith('verificationEvidence.summary')),
  )

  const emptyEntries = validateCuratedHorizontalMappingPackAuthoring({
    catalogBookId: 'big_english_3_sb',
    targetUnitNumber: 1,
    targetPrintedPages: [5, 6],
    entries: [],
    verificationEvidence: {
      ownerVerified: true,
      evidenceDocPaths: [CONTRACT_DOC],
      summary: 'Incomplete on purpose.',
    },
  })
  assert.ok(emptyEntries.some((issue) => issue.path === 'entries'))

  const mismatchedTarget = validateCuratedHorizontalMappingPackAuthoring({
    catalogBookId: 'big_english_2_sb',
    targetUnitNumber: 8,
    targetPrintedPages: [130, 131],
    entries: [baseEntry()],
    verificationEvidence: {
      ownerVerified: true,
      evidenceDocPaths: [CONTRACT_DOC],
      summary: 'Wrong target pages for entry.',
    },
  })
  assert.ok(
    mismatchedTarget.some((issue) =>
      issue.path.endsWith('.targetPrintedPages'),
    ),
  )
})

test('contract gate does not manufacture a second runtime [HM] route', () => {
  assert.deepEqual(
    buildCuratedHorizontalMappingCandidates({
      catalogBookId: 'big_english_3_sb',
      unitNumber: 8,
      visiblePrintedPages: [128, 129],
    }),
    [],
  )
  assert.deepEqual(
    buildCuratedHorizontalMappingCandidates({
      catalogBookId: 'big_english_2_sb',
      unitNumber: 8,
      visiblePrintedPages: [130, 131],
    }),
    [],
  )
  const opener = buildCuratedHorizontalMappingCandidates({
    catalogBookId: 'big_english_2_sb',
    unitNumber: 8,
    visiblePrintedPages: [128, 129],
  })
  assert.deepEqual(
    opener.map((item) => item.id),
    ['PL-19', 'PL-08', 'PL-01', 'PL-03'],
  )
  assert.ok(opener.every((item) => item.sourceType === 'HM'))
})
