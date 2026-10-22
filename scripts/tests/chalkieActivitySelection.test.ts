/**
 * Focused SB-only Activity Selection model/state tests.
 * Run: npx tsx --test scripts/tests/chalkieActivitySelection.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  buildSbActivityCards,
  buildSbActivityPageColumns,
  createSbActivityHandoffSelection,
  createDefaultSbActivitySelection,
  selectedSbActivityLanguage,
  selectedSbActivityVocabulary,
  sbActivitySelectionStatus,
  selectedSbActivityEvidence,
  setSbActivityCardSelected,
  type SbActivitySelectionState,
} from '../../app/src/features/chalkie/chalkieActivitySelection.ts'
import { resolveActiveLessonScope } from '../../app/src/features/chalkie/chalkieStudentBookUi.ts'
import {
  advanceTeacherChoiceStep,
  retreatTeacherChoiceStep,
} from '../../app/src/features/chalkie/teacherChoiceFlow.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const BE3_CANONICAL_PATH = path.join(
  ROOT,
  'data/phase1/big_english_3_sb/canonical/v1.json',
)
const OVERLAY_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx',
)
function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function loadBe3Summary(): BatchJsonSummary {
  const raw = JSON.parse(
    fs.readFileSync(BE3_CANONICAL_PATH, 'utf8'),
  ) as Record<string, unknown>
  const rawPages = asArray(raw.pages)
  return {
    catalogBookId: 'big_english_3_sb',
    units: [],
    vocabulary: [],
    language: [],
    activities: [],
    pages: rawPages.map((entry) => {
      const page = asRecord(entry)
      return {
        printedPage:
          typeof page.printed_page === 'number' ? page.printed_page : null,
        pdfPage: typeof page.pdf_page === 'number' ? page.pdf_page : null,
      }
    }),
    raw,
  }
}

const summary = loadBe3Summary()

test('BE3 U8 pp.128–129 render two populated SB page panels in source-page order', () => {
  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [128, 129],
  })
  const columns = buildSbActivityPageColumns(cards, [128, 129])

  assert.equal(cards.length, 5)
  assert.deepEqual([...new Set(cards.map((card) => card.printedPage))], [128, 129])
  assert.deepEqual(columns.map((column) => column.printedPage), [128, 129])
  assert.equal(columns[0]?.cards.length, 3)
  assert.equal(columns[1]?.cards.length, 2)
  assert.ok(columns[0]?.cards.every((card) => card.printedPage === 128))
  assert.ok(columns[1]?.cards.every((card) => card.printedPage === 129))
  assert.ok(cards.every((card) => card.source === 'SB'))
  assert.ok(cards.every((card) => card.references.verificationStatus === 'human_verified'))
  assert.ok(cards.every((card) => card.id.startsWith('sb-activity:')))
  assert.ok(cards.every((card) => card.references.activityId.length > 0))
  assert.ok(cards.every((card) => card.references.pageId === card.pageId))
  assert.equal(cards.some((card) => card.printedPage === 140), false)
})

test('every eligible SB activity card is selected by default', () => {
  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [128, 129],
  })
  const state = createDefaultSbActivitySelection(cards)

  assert.equal(cards.length, 5)
  assert.deepEqual(state.selectedCardIds, cards.map((card) => card.id))
  assert.equal(selectedSbActivityEvidence(cards, state).length, cards.length)
  assert.deepEqual(sbActivitySelectionStatus(cards, state), {
    selectedCount: cards.length,
    totalCount: cards.length,
    hasNoSelectedCurrentActivities: false,
  })
})

test('excluding one card removes its verified evidence from the selected accessor', () => {
  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [132, 133],
  })
  const excluded = cards[0]
  assert.ok(excluded)

  const state = setSbActivityCardSelected({
    cards,
    state: createDefaultSbActivitySelection(cards),
    cardId: excluded.id,
    selected: false,
  })
  const selected = selectedSbActivityEvidence(cards, state)

  assert.equal(selected.some((evidence) => evidence.cardId === excluded.id), false)
  assert.equal(
    selected.some(
      (evidence) =>
        evidence.references.activityId === excluded.references.activityId,
    ),
    false,
  )
  assert.equal(selected.length, cards.length - 1)
  assert.equal(
    sbActivitySelectionStatus(cards, state).selectedCount,
    cards.length - 1,
  )
})

test('unknown and stale card IDs never create selected activity evidence', () => {
  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [140],
  })
  const staleOnly: SbActivitySelectionState = {
    selectedCardIds: ['sb-activity:missing'],
  }
  assert.deepEqual(selectedSbActivityEvidence(cards, staleOnly), [])

  const afterUnknownSelect = setSbActivityCardSelected({
    cards,
    state: staleOnly,
    cardId: 'sb-activity:still-missing',
    selected: true,
  })
  assert.deepEqual(afterUnknownSelect.selectedCardIds, [])
  assert.equal(
    sbActivitySelectionStatus(cards, afterUnknownSelect)
      .hasNoSelectedCurrentActivities,
    true,
  )
})

test('deselecting all cards reports no selected current activities', () => {
  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [142],
  })
  assert.ok(cards.length > 0)
  assert.ok(cards.some((card) => card.preview.kind === 'empty'))

  const emptyState = cards.reduce(
    (state, card) =>
      setSbActivityCardSelected({
        cards,
        state,
        cardId: card.id,
        selected: false,
      }),
    createDefaultSbActivitySelection(cards),
  )

  assert.deepEqual(selectedSbActivityEvidence(cards, emptyState), [])
  assert.deepEqual(sbActivitySelectionStatus(cards, emptyState), {
    selectedCount: 0,
    totalCount: cards.length,
    hasNoSelectedCurrentActivities: true,
  })
})

test('active p.140 inside visible 140–141 excludes all p.141 activities', () => {
  const activeScope = resolveActiveLessonScope({
    studentBookCatalogId: 'big_english_3_sb',
    visiblePrintedPages: [140, 141],
    activePrintedPage: 140,
  })
  assert.deepEqual(activeScope.lessonPrintedPages, [140])

  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: activeScope.lessonPrintedPages,
  })
  const columns = buildSbActivityPageColumns(
    cards,
    activeScope.lessonPrintedPages,
  )

  assert.ok(cards.length > 0)
  assert.deepEqual(columns.map((column) => column.printedPage), [140])
  assert.deepEqual(columns[0]?.cards, cards)
  assert.ok(cards.every((card) => card.printedPage === 140))
  assert.ok(cards.every((card) => card.pageId === 'bep3_sb_p140'))
  assert.ok(cards.some((card) => card.references.activityId === 'bep3_sb_act_08_31'))
  assert.equal(
    cards.some((card) => card.references.activityId === 'bep3_sb_act_08_32'),
    false,
  )
})

test('activity exclusions persist through Current Lesson to Prior Learning and Back', () => {
  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [132, 133],
  })
  const excluded = cards[0]
  assert.ok(excluded)

  const state = setSbActivityCardSelected({
    cards,
    state: createDefaultSbActivitySelection(cards),
    cardId: excluded.id,
    selected: false,
  })
  let step = 1
  step = advanceTeacherChoiceStep(step)
  assert.equal(step, 2)
  step = retreatTeacherChoiceStep(step)
  assert.equal(step, 1)
  assert.equal(state.selectedCardIds.includes(excluded.id), false)
  assert.equal(
    sbActivitySelectionStatus(cards, state).selectedCount,
    cards.length - 1,
  )
})

test('overlay exposes honest activity selection feedback and local handoff propagation', () => {
  const overlaySource = fs.readFileSync(OVERLAY_PATH, 'utf8')
  const step1Start = overlaySource.indexOf('{step === 1 ? (')
  const step2Start = overlaySource.indexOf('{step === 2 ? (')
  assert.ok(step1Start >= 0)
  assert.ok(step2Start > step1Start)
  const step1Source = overlaySource.slice(step1Start, step2Start)

  assert.match(overlaySource, /Current Student Book activities/)
  assert.match(step1Source, /Current lesson/)
  assert.match(
    step1Source,
    /Select the Student Book activities to include in this lesson\./,
  )
  assert.match(step1Source, /data-sb-activity-spread/)
  assert.match(step1Source, /data-page-count=\{activityPageColumns\.length\}/)
  assert.match(step1Source, /Student Book · p\.\{column\.printedPage\}/)
  assert.match(overlaySource, /\[SB p\.\{card\.printedPage\}\]/)
  assert.match(step1Source, /activityPageColumns\.length > 1/)
  assert.match(step1Source, /left-1\/2/)
  assert.match(step1Source, /max-w-\[80rem\]/)
  assert.match(step1Source, /selected/)
  assert.ok(!step1Source.includes('>Include<'))
  assert.ok(!step1Source.includes('Current words and models'))
  assert.ok(!step1Source.includes('Current language'))
  assert.ok(!step1Source.includes('Teaching focus:'))
  assert.ok(!step1Source.includes('Visible pages:'))
  assert.match(
    overlaySource,
    /No current Student Book activities are selected\. A later handoff would contain/,
  )
  assert.match(
    overlaySource,
    /Selected activities will be included in this local handoff\./,
  )
  assert.match(overlaySource, /No safe verified preview is available for this activity\./)
  assert.match(overlaySource, /createSbActivityHandoffSelection/)
  assert.match(overlaySource, /activitySelection: handoffActivitySelection/)
})

test('selected evidence accessors apply page-complete vocabulary and language boundaries', () => {
  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [128, 129],
  })
  const allSelectedState = createDefaultSbActivitySelection(cards)
  const allSelected = createSbActivityHandoffSelection(cards, allSelectedState)
  assert.ok(selectedSbActivityVocabulary(allSelected).includes('have a big breakfast'))
  assert.ok(selectedSbActivityLanguage(allSelected).length > 0)

  const p128Activity = cards.find((card) => card.printedPage === 128)
  assert.ok(p128Activity)
  const partial = createSbActivityHandoffSelection(
    cards,
    setSbActivityCardSelected({
      cards,
      state: allSelectedState,
      cardId: p128Activity.id,
      selected: false,
    }),
  )
  assert.equal(
    selectedSbActivityVocabulary(partial).includes('have a big breakfast'),
    false,
  )
})
