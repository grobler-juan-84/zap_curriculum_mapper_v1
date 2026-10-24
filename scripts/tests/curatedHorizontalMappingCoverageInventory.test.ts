/**
 * Data-only curated `[HM]` coverage inventory.
 *
 * Locks the verification gate: only routes with explicit curated store entries
 * may surface `[HM]`. Expanding coverage requires new verified source packs —
 * never inference from titles/themes/adjacent lessons.
 *
 * Run: npx tsx --test scripts/tests/curatedHorizontalMappingCoverageInventory.test.ts
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
} from '../../app/src/features/chalkie/curatedHorizontalMappingEntries.ts'
import { resolveChalkieLessonContext } from '../../app/src/features/chalkie/resolveChalkieLessonContext.ts'
import {
  initialSelectedPriorLearningIds,
  mergeStep2PriorLearningSuggestions,
} from '../../app/src/features/chalkie/surfaceSameUnitPriorLearningSuggestions.ts'
import type { PriorLearningCandidate } from '../../app/src/features/chalkie/priorLearningCandidate.ts'
import type { Book } from '../../app/src/types/curriculum.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const BE3_CANONICAL_PATH = path.join(
  ROOT,
  'data/phase1/big_english_3_sb/canonical/v1.json',
)

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function bookStub(overrides: Partial<Book> & Pick<Book, 'catalogBookId' | 'title'>): Book {
  return {
    id: 'book-uuid-test',
    seriesId: 'series-uuid-test',
    catalogBookId: overrides.catalogBookId,
    title: overrides.title,
    level: overrides.level ?? '3',
    audience: overrides.audience ?? 'Primary',
    totalUnits: overrides.totalUnits ?? 9,
    type: overrides.type ?? 'Student Book',
    colorScheme: overrides.colorScheme ?? {
      primary: '#000000',
      accent: '#333333',
      badgeBg: '#eeeeee',
      badgeText: '#111111',
    },
    pageSpreads: overrides.pageSpreads ?? [],
  }
}

function be3Unit8Summary(): BatchJsonSummary {
  const rawBook = JSON.parse(
    fs.readFileSync(BE3_CANONICAL_PATH, 'utf8'),
  ) as Record<string, unknown>
  const unit = asArray(rawBook.units).find((entry) => {
    const u = asRecord(entry)
    return u.unit_number === 8 || u.unit_number === '8'
  })
  const unitRec = asRecord(unit)
  const start =
    typeof unitRec.printed_page_start === 'number'
      ? unitRec.printed_page_start
      : 128
  const end =
    typeof unitRec.printed_page_end === 'number'
      ? unitRec.printed_page_end
      : 143
  const unitPages: number[] = []
  for (let page = start; page <= end; page += 1) unitPages.push(page)

  const pageRows = asArray(rawBook.pages).filter((entry) => {
    const printed = asRecord(entry).printed_page
    return typeof printed === 'number' && unitPages.includes(printed)
  })
  const pageIds = new Set(
    pageRows
      .map((entry) => asRecord(entry).page_id)
      .filter((id): id is string => typeof id === 'string'),
  )

  const raw = {
    book_id: 'big_english_3_sb',
    units: asArray(rawBook.units).filter((entry) => {
      const u = asRecord(entry)
      return u.unit_number === 8 || u.unit_number === '8'
    }),
    pages: pageRows,
    vocabulary: asArray(rawBook.vocabulary).filter((entry) =>
      pageIds.has(String(asRecord(entry).page_id ?? '')),
    ),
    language: asArray(rawBook.language).filter((entry) =>
      pageIds.has(String(asRecord(entry).page_id ?? '')),
    ),
    activities: asArray(rawBook.activities).filter((entry) =>
      pageIds.has(String(asRecord(entry).page_id ?? '')),
    ),
    curriculum_components: asArray(rawBook.curriculum_components).filter(
      (entry) => pageIds.has(String(asRecord(entry).page_id ?? '')),
    ),
  }

  return {
    catalogBookId: 'big_english_3_sb',
    units: [
      {
        unitNumber: 8,
        title:
          typeof unitRec.title === 'string' ? unitRec.title : 'Healthy Living',
        printedPageStart: start,
        printedPageEnd: end,
      },
    ],
    vocabulary: [],
    language: [],
    activities: [],
    pages: [],
    raw,
  }
}

test('store coverage is BE2 U8 opener only (no unverified second route)', () => {
  const entries = listCuratedHorizontalMappingEntries()
  assert.equal(entries.length, 4)
  assert.deepEqual(
    entries.map((item) => item.id),
    BE2_U08_CURATED_HORIZONTAL_MAPPING_ENTRIES.map((item) => item.id),
  )
  assert.ok(
    entries.every(
      (item) =>
        item.catalogBookId === 'big_english_2_sb' &&
        item.targetUnitNumber === 8 &&
        JSON.stringify(item.targetPrintedPages ?? null) ===
          JSON.stringify([128, 129]),
    ),
  )
  assert.ok(
    entries.every((item) => item.sourceUnitNumber !== item.targetUnitNumber),
  )
})

test('no curated [HM] for BE3 U8, BE2 non-opener pages, or other units', () => {
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
  assert.deepEqual(
    buildCuratedHorizontalMappingCandidates({
      catalogBookId: 'big_english_2_sb',
      unitNumber: 7,
      visiblePrintedPages: [113, 116],
    }),
    [],
  )
  assert.deepEqual(
    buildCuratedHorizontalMappingCandidates({
      catalogBookId: 'big_english_1_sb',
      unitNumber: 1,
      visiblePrintedPages: [5, 6],
    }),
    [],
  )
})

test('BE3 ready route keeps PRIOR-only Step 2 when no curated [HM] entries exist', () => {
  const resolved = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
      level: '3',
    }),
    summary: be3Unit8Summary(),
    visiblePrintedPages: [140],
    unitNumber: 8,
  })
  assert.equal(resolved.status, 'ready')
  assert.ok(resolved.sameUnitPriorLearningCandidates.length > 0)
  assert.deepEqual(resolved.curatedHorizontalMappingCandidates, [])
  assert.ok(
    resolved.priorLearningSuggestions.every(
      (item) => item.provenanceTag === '[PRIOR]',
    ),
  )
  assert.deepEqual(initialSelectedPriorLearningIds(), [])
})

test('coverage expansion gate docs remain the authority for adding routes', () => {
  const audit = fs.readFileSync(
    path.join(
      ROOT,
      'docs/phase-5/chalkie-prior-learning-horizontal-mapping-audit-v0.1.md',
    ),
    'utf8',
  )
  assert.match(audit, /Coverage expansion gate/)
  assert.match(audit, /BE2 U8 opener/)
  assert.match(audit, /No second target lesson/)
  assert.match(audit, /this gate forbids/)
  assert.match(audit, /Unlock condition/)
  assert.match(audit, /curated-horizontal-mapping-pack-authoring-contract-v0\.1\.md/)
  const authoring = fs.readFileSync(
    path.join(
      ROOT,
      'docs/phase-5/curated-horizontal-mapping-pack-authoring-contract-v0.1.md',
    ),
    'utf8',
  )
  assert.match(authoring, /verification-ready authoring gate/i)
})

test('merge still prefers PRIOR and dedupes overlapping HM when both present', () => {
  const prior: PriorLearningCandidate = {
    id: 'same-unit-demo',
    catalogBookId: 'big_english_3_sb',
    unitNumber: 8,
    printedPages: [128],
    pageIds: [],
    sourceType: 'PRIOR',
    title: 'Demo',
    contentPreview: 'shared frame text',
    whyItMayHelp: 'same-unit',
    provenanceNote: 'prior',
    target: 'both',
    teacherNote: null,
    verificationStatus: 'verified',
    sourceReference: 'Earlier in this unit · p.128',
    caution: 'exposure ≠ mastery',
    evidenceKind: 'vocabulary',
  }
  const hmSameId: PriorLearningCandidate = {
    ...prior,
    id: prior.id,
    sourceType: 'HM',
    contentPreview: 'different frame',
    sourceReference: 'Unit 7',
  }
  const hmSameFrame: PriorLearningCandidate = {
    id: 'hm-frame',
    catalogBookId: 'big_english_2_sb',
    unitNumber: 7,
    printedPages: [113],
    pageIds: [],
    sourceType: 'HM',
    title: 'Frame dup',
    contentPreview: 'shared frame text',
    whyItMayHelp: 'dup',
    provenanceNote: 'hm',
    target: 'both',
    teacherNote: null,
    verificationStatus: 'verified',
    sourceReference: 'Unit 7',
    caution: 'caution',
  }
  const hmOk = buildCuratedHorizontalMappingCandidates({
    catalogBookId: 'big_english_2_sb',
    unitNumber: 8,
    visiblePrintedPages: [128, 129],
  }).find((item) => item.id === 'PL-08')
  assert.ok(hmOk)

  const merged = mergeStep2PriorLearningSuggestions({
    sameUnitPriorCandidates: [prior],
    curatedHmCandidates: [hmSameId, hmSameFrame, hmOk],
  })
  assert.deepEqual(
    merged.map((item) => item.id),
    ['same-unit-demo', 'PL-08'],
  )
})
