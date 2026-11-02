/**
 * Priority 5 — genuine Student-Book-only neutral NLP.
 * Run: app\\node_modules\\.bin\\tsx.cmd --test scripts/tests/buildNeutralSbOnlyLessonPackage.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { allocateSbOnlyTwoLessonActivities } from '../../app/src/features/chalkie/allocateSbOnlyTwoLessonActivities.ts'
import {
  buildNeutralSbOnlyLessonPackage,
  buildNeutralSbWbLessonPackage,
} from '../../app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts'
import {
  buildSbActivityCards,
  createDefaultSbActivitySelection,
  createSbActivityHandoffSelection,
  setSbActivityCardSelected,
} from '../../app/src/features/chalkie/chalkieActivitySelection.ts'
import {
  buildWbActivityCards,
  createDefaultWbActivitySelection,
  createWbActivityHandoffSelection,
} from '../../app/src/features/chalkie/chalkieWorkbookActivitySelection.ts'
import { attachSelectedNllDerivedKnowledge } from '../../app/src/features/chalkie/nllGeneralLessonPlanPilot.ts'
import { resolveVerifiedSbWbCompanion } from '../../app/src/features/chalkie/resolveVerifiedSbWbCompanion.ts'
import type { ResolvedNllComponent } from '../../app/src/features/nll/neutralLessonLibrary.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const BE3_SB_PATH = path.join(
  ROOT,
  'data/phase1/big_english_3_sb/canonical/v1.json',
)
const BE3_WB_PATH = path.join(
  ROOT,
  'data/phase1/big_english_3_wb/canonical/v1.json',
)

function loadJson(filePath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function summaryFromCanonical(
  raw: Record<string, unknown>,
  catalogBookId: string,
): BatchJsonSummary {
  const unit = asArray(raw.units).find((entry) => {
    const row = asRecord(entry)
    return row.unit_number === 8 || row.unit_number === '8'
  })
  const unitRecord = asRecord(unit)
  return {
    catalogBookId,
    units: [
      {
        unitNumber: 8,
        title:
          typeof unitRecord.title === 'string'
            ? unitRecord.title
            : 'Healthy Living',
        printedPageStart:
          typeof unitRecord.printed_page_start === 'number'
            ? unitRecord.printed_page_start
            : 128,
        printedPageEnd:
          typeof unitRecord.printed_page_end === 'number'
            ? unitRecord.printed_page_end
            : 143,
      },
    ],
    vocabulary: [],
    language: [],
    activities: [],
    pages: [],
    raw,
  }
}

const sbCanonical = loadJson(BE3_SB_PATH)
const wbCanonical = loadJson(BE3_WB_PATH)
const sbSummary = summaryFromCanonical(sbCanonical, 'big_english_3_sb')
const wbSummary = summaryFromCanonical(wbCanonical, 'big_english_3_wb')

function valuesCards() {
  return buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: [142],
  })
}

function activityIdsInPackage(
  nlp: ReturnType<typeof buildNeutralSbOnlyLessonPackage>,
): string[] {
  return [
    ...nlp.lesson1.selectedActivities,
    ...nlp.lesson2.selectedActivities,
  ].map((activity) => activity.references[0]?.activityId ?? '')
}

test('1. all eligible SB activities selected assemble SB-only NLP', () => {
  const cards = valuesCards()
  assert.equal(cards.length, 3)
  const selection = createSbActivityHandoffSelection(
    cards,
    createDefaultSbActivitySelection(cards),
  )
  const expected = allocateSbOnlyTwoLessonActivities(selection.selectedEvidence)

  const nlp = buildNeutralSbOnlyLessonPackage({
    studentBookCatalogId: 'big_english_3_sb',
    unitNumber: 8,
    unitTitle: 'Healthy Living',
    componentTitle: 'Values',
    packageReference: 'be3-sb-u08-p142',
    componentKey: 'be3-u08-values',
    sbSelection: selection,
  })

  assert.equal(nlp.packaging.type, 'two_lesson_sb_only')
  assert.equal(nlp.identity.studentBookCatalogId, 'big_english_3_sb')
  assert.equal(nlp.lesson1.role, 'student_book')
  assert.equal(nlp.lesson2.role, 'student_book')
  assert.equal(nlp.lesson1.selection.status, 'all_selected')
  assert.equal(nlp.lesson2.selection.status, 'all_selected')
  assert.equal(nlp.lesson1.selectedActivities.length, expected.lesson1.length)
  assert.equal(nlp.lesson2.selectedActivities.length, expected.lesson2.length)
  assert.equal(
    nlp.lesson1.selectedActivities.length + nlp.lesson2.selectedActivities.length,
    3,
  )
  assert.equal(nlp.lesson1.scope.source, 'SB')
  assert.equal(nlp.lesson2.scope.source, 'SB')
  assert.ok(!('workbookCatalogId' in nlp.identity))
  assert.ok(!('relationshipId' in nlp.identity))
  assert.deepEqual(nlp.boundaries.excludedScopes, [])
  assert.ok(
    nlp.boundaries.notes.some((note) =>
      note.includes('no Workbook companion'),
    ),
  )
})

test('2. excluded SB activities remain outside the NLP', () => {
  const cards = valuesCards()
  let state = createDefaultSbActivitySelection(cards)
  const excluded = cards[cards.length - 1]
  assert.ok(excluded)
  state = setSbActivityCardSelected({
    cards,
    state,
    cardId: excluded.id,
    selected: false,
  })
  const selection = createSbActivityHandoffSelection(cards, state)
  const nlp = buildNeutralSbOnlyLessonPackage({
    studentBookCatalogId: 'big_english_3_sb',
    unitNumber: 8,
    unitTitle: 'Healthy Living',
    componentTitle: 'Values',
    packageReference: 'be3-sb-u08-p142',
    sbSelection: selection,
  })

  assert.equal(nlp.lesson1.selection.status, 'partial_selection')
  assert.equal(nlp.lesson2.selection.status, 'partial_selection')
  const ids = activityIdsInPackage(nlp)
  assert.equal(ids.length, 2)
  assert.ok(!ids.includes(excluded.references.activityId))
  assert.equal(
    nlp.lesson1.selectedActivities.length + nlp.lesson2.selectedActivities.length,
    selection.selectedEvidence.length,
  )
})

test('3. zero SB selection stays honest without restoring defaults', () => {
  const cards = valuesCards()
  let state = createDefaultSbActivitySelection(cards)
  for (const card of cards) {
    state = setSbActivityCardSelected({
      cards,
      state,
      cardId: card.id,
      selected: false,
    })
  }
  const selection = createSbActivityHandoffSelection(cards, state)
  assert.equal(selection.selectedEvidence.length, 0)

  const nlp = buildNeutralSbOnlyLessonPackage({
    studentBookCatalogId: 'big_english_3_sb',
    unitNumber: 8,
    unitTitle: 'Healthy Living',
    componentTitle: 'Values',
    packageReference: 'be3-sb-u08-p142',
    sbSelection: selection,
  })

  assert.equal(nlp.lesson1.selection.status, 'zero_selected')
  assert.equal(nlp.lesson2.selection.status, 'zero_selected')
  assert.equal(nlp.lesson1.selectedActivities.length, 0)
  assert.equal(nlp.lesson2.selectedActivities.length, 0)
  assert.equal(nlp.lesson1.vocabulary.length, 0)
  assert.equal(nlp.lesson2.vocabulary.length, 0)
  assert.equal(nlp.lesson1.languageModels.length, 0)
  assert.equal(nlp.lesson2.languageModels.length, 0)
  assert.ok(
    nlp.lesson1.emptySelectionMessage?.includes(
      'No Student Book activities selected',
    ),
  )
  assert.ok(
    nlp.lesson2.emptySelectionMessage?.includes(
      'No Student Book activities selected',
    ),
  )
})

test('4. no Workbook evidence or unrelated lesson activities enter SB-only NLP', () => {
  const values = valuesCards()
  const opener = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: [128, 129],
  })
  assert.ok(opener.length > 0)

  // Selection intentionally limited to Values cards; opener cards must not leak in.
  const selection = createSbActivityHandoffSelection(
    values,
    createDefaultSbActivitySelection(values),
  )
  const companion = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sbCanonical,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wbCanonical,
    studentBookPrintedPages: [136, 137],
  }).companion
  assert.ok(companion)
  const wbCards = buildWbActivityCards({
    summary: wbSummary,
    companion,
  })
  assert.ok(wbCards.length > 0)

  const nlp = buildNeutralSbOnlyLessonPackage({
    studentBookCatalogId: 'big_english_3_sb',
    unitNumber: 8,
    unitTitle: 'Healthy Living',
    componentTitle: 'Values',
    packageReference: 'be3-sb-u08-p142',
    sbSelection: selection,
  })

  const ids = activityIdsInPackage(nlp)
  for (const id of ids) {
    assert.ok(id.startsWith('bep3_sb_act_08_3'))
    assert.ok(!id.includes('wb'))
  }
  assert.ok(
    nlp.lesson1.selectedActivities.every((activity) => activity.source === 'SB'),
  )
  assert.ok(
    nlp.lesson2.selectedActivities.every((activity) => activity.source === 'SB'),
  )
  assert.equal(nlp.lesson1.scope.source, 'SB')
  assert.equal(nlp.lesson2.scope.source, 'SB')
  assert.deepEqual(nlp.lesson1.scope.printedPages, [142])
  assert.deepEqual(nlp.lesson2.scope.printedPages, [142])
  assert.ok(!JSON.stringify(nlp).includes('workbookCatalogId'))
  assert.ok(!JSON.stringify(nlp).includes('bep_3_wb_act_'))
  assert.ok(!ids.some((id) => opener.some((card) => card.references.activityId === id)))
  // WB cards exist in the curriculum fixture but were never passed into the builder.
  assert.ok(wbCards.length > 0)
})

test('SB-only NLP attaches selected NLL derived knowledge only', () => {
  const cards = valuesCards()
  let state = createDefaultSbActivitySelection(cards)
  const excluded = cards[0]
  assert.ok(excluded)
  state = setSbActivityCardSelected({
    cards,
    state,
    cardId: excluded.id,
    selected: false,
  })
  const selection = createSbActivityHandoffSelection(cards, state)
  const base = buildNeutralSbOnlyLessonPackage({
    studentBookCatalogId: 'big_english_3_sb',
    unitNumber: 8,
    unitTitle: 'Healthy Living',
    componentTitle: 'Values',
    packageReference: 'be3-sb-u08-p142',
    componentKey: 'be3-u08-values',
    sbSelection: selection,
  })

  const activityIds = cards.map((card) => card.references.activityId)
  const resolved: ResolvedNllComponent = {
    component: {
      id: 'nll-be3-u08-values',
      component_key: 'be3-u08-values',
      title: 'Values',
      status: 'draft',
      created_at: '2026-11-02T00:00:00.000Z',
    },
    activities: activityIds.map((activityId, index) => ({
      activityId,
      position: index + 1,
      preferredSummary: {
        id: `sum-${activityId}`,
        activity_id: activityId,
        version: 1,
        summary_text: `Summary ${activityId}`,
        canonical_path: 'mock',
        canonical_sha256: 'a'.repeat(64),
        activity_sha256: 'b'.repeat(64),
        evidence_status: 'sufficient',
        display_status: 'hidden',
        review_state: 'experimental',
        is_preferred: true,
        provenance: {},
        created_at: '2026-11-02T00:00:00.000Z',
        staleness: 'unverifiable',
        currentActivitySha256: null,
      },
    })),
    curriculumAuthorityLinks: [],
    proposedSsLinks: [],
  }

  const withKnowledge = attachSelectedNllDerivedKnowledge({
    nlp: base,
    resolved,
  })
  const attachedIds =
    withKnowledge.derivedKnowledge?.activitySummaries.map(
      (summary) => summary.activityId,
    ) ?? []
  assert.equal(attachedIds.length, 2)
  assert.ok(!attachedIds.includes(excluded.references.activityId))
  assert.deepEqual(
    [...attachedIds].sort(),
    activityIdsInPackage(withKnowledge).sort(),
  )
})

test('5. existing SB→WB NLP packaging remains unchanged', () => {
  const pages = [136, 137]
  const companion = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sbCanonical,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wbCanonical,
    studentBookPrintedPages: pages,
  }).companion
  assert.ok(companion)

  const sbCards = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: pages,
  })
  const wbCards = buildWbActivityCards({
    summary: wbSummary,
    companion,
  })
  const nlp = buildNeutralSbWbLessonPackage({
    companion,
    sbSelection: createSbActivityHandoffSelection(
      sbCards,
      createDefaultSbActivitySelection(sbCards),
    ),
    wbSelection: createWbActivityHandoffSelection(
      wbCards,
      createDefaultWbActivitySelection(wbCards),
    ),
  })

  assert.equal(nlp.packaging.type, 'two_lesson_sb_wb')
  assert.equal(nlp.lesson1.role, 'student_book')
  assert.equal(nlp.lesson2.role, 'workbook')
  assert.equal(nlp.identity.workbookCatalogId, 'big_english_3_wb')
  assert.ok(nlp.lesson2.selectedActivities.length > 0)
  assert.ok(
    nlp.lesson2.selectedActivities.every((activity) => activity.source === 'WB'),
  )
})
