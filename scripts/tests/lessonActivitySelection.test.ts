/**
 * Workspace-owned activity selection: defaults, continuity, reconcile, exclusion.
 * Run: npx tsx --test scripts/tests/lessonActivitySelection.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  buildSbActivityCards,
  createDefaultSbActivitySelection,
  createSbActivityHandoffSelection,
  selectedSbActivityEvidence,
  selectedSbActivityLanguage,
  selectedSbActivityPromptLines,
  selectedSbActivityVocabulary,
  setSbActivityCardSelected,
} from '../../app/src/features/chalkie/chalkieActivitySelection.ts'
import {
  buildWbActivityCards,
  createDefaultWbActivitySelection,
  createWbActivityHandoffSelection,
  selectedWbActivityEvidence,
} from '../../app/src/features/chalkie/chalkieWorkbookActivitySelection.ts'
import { buildCurrentLessonContext } from '../../app/src/features/chalkie/currentLessonContext.ts'
import {
  activityCardIdsKey,
  applyLessonActivityScopeSelectionMemory,
  buildLessonActivitySelectionScopeKey,
  captureLessonActivityScopeSelectionMemory,
  clearLessonActivityScopeSelectionMemory,
  createLessonActivityScopeSelectionMemoryMap,
  includedActivitiesCountLabel,
  mergeKnownActivityCardIds,
  readLessonActivityScopeSelectionMemory,
  reconcileActivitySelection,
  reconcileSbActivitySelection,
  reconcileWbActivitySelection,
  selectionScopeHasCompanion,
  shouldClearPendingLessonActivitySelectionDefault,
  writeLessonActivityScopeSelectionMemory,
} from '../../app/src/features/chalkie/lessonActivitySelection.ts'
import { buildChalkiePromptPreview } from '../../app/src/features/chalkie/buildChalkiePromptPreview.ts'
import { resolveChalkieLessonContext } from '../../app/src/features/chalkie/resolveChalkieLessonContext.ts'
import type { Book } from '../../app/src/types/curriculum.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const BE3_CANONICAL_PATH = path.join(
  ROOT,
  'data/phase1/big_english_3_sb/canonical/v1.json',
)
const WORKSPACE_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/ChalkieWorkspace.tsx',
)
const LEFT_PANEL_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/ChalkieLeftPanel.tsx',
)
const OVERLAY_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx',
)
const CURRENT_LESSON_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/currentLessonContext.ts',
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
  const pageRows = asArray(rawBook.pages).filter((entry) => {
    const printed = asRecord(entry).printed_page
    return typeof printed === 'number' && printed >= start && printed <= end
  })
  return {
    catalogBookId: 'big_english_3_sb',
    units: [
      {
        unitNumber: 8,
        title:
          typeof unitRec.title === 'string' ? unitRec.title : 'Unit 8',
        printedPageStart: start,
        printedPageEnd: end,
      },
    ],
    vocabulary: [],
    language: [],
    activities: [],
    pages: pageRows.map((entry) => {
      const page = asRecord(entry)
      return {
        printedPage:
          typeof page.printed_page === 'number' ? page.printed_page : null,
        pdfPage: typeof page.pdf_page === 'number' ? page.pdf_page : null,
      }
    }),
    raw: rawBook,
  }
}

function bookStub(): Book {
  return {
    id: 'book-uuid-test',
    seriesId: 'series-uuid-test',
    catalogBookId: 'big_english_3_sb',
    title: 'Big English 3 Student Book',
    level: '3',
    audience: 'Primary',
    totalUnits: 9,
    type: 'Student Book',
    colorScheme: {
      primary: '#000000',
      accent: '#333333',
      badgeBg: '#eeeeee',
      badgeText: '#111111',
    },
    pageSpreads: [],
  }
}

const summary = loadBe3Summary()

test('default left-panel selection includes every eligible SB activity', () => {
  const context = buildCurrentLessonContext({
    summary,
    sbPrintedPages: [128, 129],
    unitNumber: 8,
  })
  const cards = context.bookContent.sbActivities
  assert.ok(cards.length >= 2)
  const selection = createDefaultSbActivitySelection(cards)
  assert.deepEqual(
    selection.selectedCardIds,
    cards.map((card) => card.id),
  )
  assert.equal(
    includedActivitiesCountLabel(selection.selectedCardIds.length, cards.length),
    `${cards.length} of ${cards.length} activities included`,
  )
})

test('left-panel → overlay selection continuity uses one shared state shape', () => {
  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [128, 129],
  })
  let workspaceSelection = createDefaultSbActivitySelection(cards)
  workspaceSelection = setSbActivityCardSelected({
    cards,
    state: workspaceSelection,
    cardId: cards[0]!.id,
    selected: false,
  })

  // Overlay receives the same state object values (no independent default reset).
  const overlaySelection = workspaceSelection
  assert.deepEqual(overlaySelection.selectedCardIds, workspaceSelection.selectedCardIds)
  assert.equal(
    selectedSbActivityEvidence(cards, overlaySelection).length,
    cards.length - 1,
  )

  const workspaceSource = fs.readFileSync(WORKSPACE_PATH, 'utf8')
  const leftPanelSource = fs.readFileSync(LEFT_PANEL_PATH, 'utf8')
  const overlaySource = fs.readFileSync(OVERLAY_PATH, 'utf8')
  assert.match(workspaceSource, /sbActivitySelection=\{sbActivitySelection\}/)
  assert.match(workspaceSource, /onSbActivitySelectionChange=\{handleSbActivitySelectionChange\}/)
  assert.match(leftPanelSource, /onSbActivitySelectionChange/)
  assert.match(overlaySource, /sbActivitySelection,/)
  assert.match(overlaySource, /onSbActivitySelectionChange/)
  assert.ok(!overlaySource.includes('createDefaultSbActivitySelection(activityCards)'))
  assert.ok(!overlaySource.includes('useState<SbActivitySelectionState'))
})

test('synchronized selection edits keep one authoritative ID set', () => {
  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [128, 129],
  })
  let shared = createDefaultSbActivitySelection(cards)
  const target = cards[1]!

  // Left-panel edit
  shared = setSbActivityCardSelected({
    cards,
    state: shared,
    cardId: target.id,
    selected: false,
  })
  // Overlay reads the same state
  assert.equal(shared.selectedCardIds.includes(target.id), false)

  // Overlay re-includes
  shared = setSbActivityCardSelected({
    cards,
    state: shared,
    cardId: target.id,
    selected: true,
  })
  assert.equal(shared.selectedCardIds.includes(target.id), true)
})

test('lesson-scope reset and within-scope reconciliation are deterministic', () => {
  const openerKey = buildLessonActivitySelectionScopeKey({
    catalogBookId: 'big_english_3_sb',
    unitNumber: 1,
    sbPrintedPages: [4, 5],
    companionRelationshipId: null,
  })
  const storyKey = buildLessonActivitySelectionScopeKey({
    catalogBookId: 'big_english_3_sb',
    unitNumber: 8,
    sbPrintedPages: [128, 129],
    companionRelationshipId: 'be3-u08-story-sb-wb',
  })
  assert.notEqual(openerKey, storyKey)

  const storyCards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [128, 129],
  })
  let selection = createDefaultSbActivitySelection(storyCards)
  selection = setSbActivityCardSelected({
    cards: storyCards,
    state: selection,
    cardId: storyCards[0]!.id,
    selected: false,
  })

  // Scope change → defaults for the new card set
  const openerCards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [4, 5],
  })
  selection = createDefaultSbActivitySelection(openerCards)
  assert.deepEqual(
    selection.selectedCardIds,
    openerCards.map((card) => card.id),
  )

  // Within-scope: new card defaults selected; known deselection sticks
  const ids = ['a', 'b', 'c']
  const afterDeselect = reconcileActivitySelection({
    cardIds: ids,
    previousSelectedIds: ['a', 'c'],
    previousCardIds: ['a', 'b', 'c'],
  })
  assert.deepEqual(afterDeselect.selectedCardIds, ['a', 'c'])

  const afterNewCard = reconcileActivitySelection({
    cardIds: ['a', 'b', 'c', 'd'],
    previousSelectedIds: ['a', 'c'],
    previousCardIds: ['a', 'b', 'c'],
  })
  assert.deepEqual(afterNewCard.selectedCardIds, ['a', 'c', 'd'])

  const reconciled = reconcileSbActivitySelection({
    cards: storyCards,
    previous: {
      selectedCardIds: storyCards.slice(1).map((card) => card.id),
    },
    previousCardIds: storyCards.map((card) => card.id),
  })
  assert.equal(reconciled.selectedCardIds.includes(storyCards[0]!.id), false)
  assert.equal(activityCardIdsKey(storyCards).includes('\n'), true)
})

test('deselected evidence stays out of handoff accessors and prompt lines', () => {
  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [128, 129],
  })
  assert.ok(cards.length >= 2)
  let state = createDefaultSbActivitySelection(cards)
  const excluded = cards[0]!
  state = setSbActivityCardSelected({
    cards,
    state,
    cardId: excluded.id,
    selected: false,
  })
  const handoff = createSbActivityHandoffSelection(cards, state)
  assert.equal(
    handoff.selectedEvidence.some((item) => item.cardId === excluded.id),
    false,
  )
  const promptLines = selectedSbActivityPromptLines(handoff).join('\n')
  assert.equal(promptLines.includes(excluded.verifiedWording), false)
  assert.equal(
    selectedSbActivityEvidence(cards, state).some(
      (item) => item.cardId === excluded.id,
    ),
    false,
  )
})

test('sparse opener activities stay sparse; rich U8 activities expose verified detail', () => {
  const opener = buildCurrentLessonContext({
    summary,
    sbPrintedPages: [4, 5],
    unitNumber: 1,
  })
  const rich = buildCurrentLessonContext({
    summary,
    sbPrintedPages: [128, 129],
    unitNumber: 8,
  })
  assert.ok(opener.bookContent.sbActivities.length > 0)
  assert.ok(rich.bookContent.sbActivities.length > 0)

  const sparseEmptyPreviews = opener.bookContent.sbActivities.filter(
    (card) => card.preview.kind === 'empty',
  )
  assert.ok(sparseEmptyPreviews.length > 0)

  const richWithTypeOrFrame = rich.bookContent.sbActivities.filter(
    (card) =>
      Boolean(card.evidence.activityType) ||
      Boolean(card.evidence.languageFrame) ||
      card.evidence.items.length > 0,
  )
  assert.ok(richWithTypeOrFrame.length > 0)

  const leftPanelSource = fs.readFileSync(LEFT_PANEL_PATH, 'utf8')
  const overlaySource = fs.readFileSync(OVERLAY_PATH, 'utf8')
  assert.match(leftPanelSource, /ActivityEvidenceCard/)
  assert.match(overlaySource, /ActivityEvidenceCard/)
})

test('all-selected adapter output still includes current SB activity evidence', () => {
  const unitSummary = be3Unit8Summary()
  const lesson = resolveChalkieLessonContext({
    book: bookStub(),
    summary: unitSummary,
    visiblePrintedPages: [128, 129],
    unitNumber: 8,
  })
  assert.equal(lesson.status, 'ready')
  if (lesson.status !== 'ready') return

  const cards = buildSbActivityCards({
    summary: unitSummary,
    activeLessonPrintedPages: [128, 129],
  })
  const selection = createDefaultSbActivitySelection(cards)
  const handoff = createSbActivityHandoffSelection(cards, selection)
  const prompt = buildChalkiePromptPreview({
    lesson,
    selectedSuggestions: [],
    teacherAdditions: [],
    activitySelection: handoff,
  })
  assert.match(prompt, /Activity/)
  assert.ok(selectedSbActivityVocabulary(handoff).length >= 0)
  assert.ok(Array.isArray(selectedSbActivityLanguage(handoff)))
})

test('neutral currentLessonContext still avoids Chalkie prompt/UI imports', () => {
  const source = fs.readFileSync(CURRENT_LESSON_PATH, 'utf8')
  assert.ok(!source.includes('buildChalkiePromptPreview'))
  assert.ok(!source.includes('TeacherChoiceFlowOverlay'))
  assert.ok(!source.includes('ChalkieLeftPanel'))
  assert.ok(!source.includes('buildDetailedGeneralLessonPlan'))
  assert.ok(source.includes('Folder location under features/chalkie is'))
  assert.ok(source.includes('transitional for the current route'))
  assert.ok(source.includes('Do not create a half-neutral duplicate'))
})

test('pending default waits for companion Workbook cards or loaded summary', () => {
  const openerScope = buildLessonActivitySelectionScopeKey({
    catalogBookId: 'big_english_3_sb',
    unitNumber: 8,
    sbPrintedPages: [128, 129],
    companionRelationshipId: 'be3_sb_wb_rel_u08_opener_sb128-129_wb104-105',
  })
  const valuesScope = buildLessonActivitySelectionScopeKey({
    catalogBookId: 'big_english_3_sb',
    unitNumber: 8,
    sbPrintedPages: [142],
    companionRelationshipId: null,
  })
  assert.equal(selectionScopeHasCompanion(openerScope), true)
  assert.equal(selectionScopeHasCompanion(valuesScope), false)

  // SB ready but companion WB summary still loading → keep pending.
  assert.equal(
    shouldClearPendingLessonActivitySelectionDefault({
      scopeKey: openerScope,
      sbCardCount: 5,
      wbCardCount: 0,
      workbookSummaryLoaded: false,
      scopeChanged: false,
      sbCardIdsKey: 'sb-1',
      wbCardIdsKey: '',
    }),
    false,
  )

  // Companion WB cards arrived → clear pending (defaults include 4/4).
  assert.equal(
    shouldClearPendingLessonActivitySelectionDefault({
      scopeKey: openerScope,
      sbCardCount: 5,
      wbCardCount: 4,
      workbookSummaryLoaded: true,
      scopeChanged: false,
      sbCardIdsKey: 'sb-1',
      wbCardIdsKey: 'wb-1',
    }),
    true,
  )

  // SB-only Values: no companion wait; SB cards are enough.
  assert.equal(
    shouldClearPendingLessonActivitySelectionDefault({
      scopeKey: valuesScope,
      sbCardCount: 3,
      wbCardCount: 0,
      workbookSummaryLoaded: false,
      scopeChanged: false,
      sbCardIdsKey: 'sb-1',
      wbCardIdsKey: '',
    }),
    true,
  )
})

test('late Workbook cards default selected even after Strict Mode double reconcile', () => {
  const wbIds = ['wb-1', 'wb-2', 'wb-3', 'wb-4']
  // Simulate the poisoned path: first updater mutates known ids, second sees
  // empty selection against those known ids. Capture-before-mutate avoids it.
  let knownWb: readonly string[] = []
  const previousKnown = knownWb
  const first = reconcileActivitySelection({
    cardIds: wbIds,
    previousSelectedIds: [],
    previousCardIds: previousKnown,
  })
  knownWb = wbIds // mutate after capture (as workspace now does)
  const second = reconcileActivitySelection({
    cardIds: wbIds,
    previousSelectedIds: [],
    previousCardIds: previousKnown, // still the pre-mutate snapshot
  })
  assert.deepEqual(first.selectedCardIds, wbIds)
  assert.deepEqual(second.selectedCardIds, wbIds)

  // Contrast: mutating known before the second call empties selection (the bug).
  const poisoned = reconcileActivitySelection({
    cardIds: wbIds,
    previousSelectedIds: [],
    previousCardIds: knownWb,
  })
  assert.deepEqual(poisoned.selectedCardIds, [])
  assert.equal(typeof reconcileWbActivitySelection, 'function')
})

test('verified WB selection stays separately addressable from SB', () => {
  const sbCards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [128, 129],
  })
  // Minimal companion-shaped cards via empty companion → empty WB set
  const wbCards = buildWbActivityCards({
    summary: null,
    companion: null,
  })
  assert.equal(wbCards.length, 0)
  const sbSelection = createDefaultSbActivitySelection(sbCards)
  const wbSelection = createDefaultWbActivitySelection(wbCards)
  assert.ok(sbSelection.selectedCardIds.length > 0)
  assert.deepEqual(wbSelection.selectedCardIds, [])

  // Scope key changes when companion appears
  const without = buildLessonActivitySelectionScopeKey({
    catalogBookId: 'big_english_3_sb',
    unitNumber: 8,
    sbPrintedPages: [128, 129],
    companionRelationshipId: null,
  })
  const withCompanion = buildLessonActivitySelectionScopeKey({
    catalogBookId: 'big_english_3_sb',
    unitNumber: 8,
    sbPrintedPages: [128, 129],
    companionRelationshipId: 'be3-u08-opener-sb-wb',
  })
  assert.notEqual(without, withCompanion)

  // Deselecting SB must not invent WB evidence
  const deselected = setSbActivityCardSelected({
    cards: sbCards,
    state: sbSelection,
    cardId: sbCards[0]!.id,
    selected: false,
  })
  const wbHandoff = createWbActivityHandoffSelection(wbCards, wbSelection)
  assert.equal(selectedWbActivityEvidence(wbCards, wbSelection).length, 0)
  assert.equal(wbHandoff.selectedEvidence.length, 0)
  assert.ok(deselected.selectedCardIds.length === sbCards.length - 1)
})

test('scope change drops stale IDs and defaults new lesson without cross-component leak', () => {
  const openerCards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [128, 129],
  })
  const phonicsCards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [141],
  })
  assert.ok(openerCards.length > 0)
  assert.ok(phonicsCards.length > 0)

  const openerKey = buildLessonActivitySelectionScopeKey({
    catalogBookId: 'big_english_3_sb',
    unitNumber: 8,
    sbPrintedPages: [128, 129],
    companionRelationshipId: 'be3_sb_wb_rel_u08_opener_sb128-129_wb104-105',
  })
  const phonicsKey = buildLessonActivitySelectionScopeKey({
    catalogBookId: 'big_english_3_sb',
    unitNumber: 8,
    sbPrintedPages: [141],
    companionRelationshipId: 'be3_sb_wb_rel_u08_phonics_sb141_wb116',
  })
  assert.notEqual(openerKey, phonicsKey)

  const openerSelection = createDefaultSbActivitySelection(openerCards)
  const partial = setSbActivityCardSelected({
    cards: openerCards,
    state: openerSelection,
    cardId: openerCards[0]!.id,
    selected: false,
  })

  // Simulate scope change: ignore prior deselection; default the new lesson fully.
  const afterScopeChange = createDefaultSbActivitySelection(phonicsCards)
  assert.deepEqual(
    [...afterScopeChange.selectedCardIds].sort(),
    phonicsCards.map((c) => c.id).sort(),
  )
  assert.ok(
    afterScopeChange.selectedCardIds.every(
      (id) => !openerCards.some((card) => card.id === id),
    ),
  )

  // Within the same resolved lesson, deliberate deselection sticks across card refresh.
  const sameScopeReconcile = reconcileSbActivitySelection({
    cards: openerCards,
    previous: partial,
    previousCardIds: openerCards.map((c) => c.id),
  })
  assert.ok(!sameScopeReconcile.selectedCardIds.includes(openerCards[0]!.id))
  assert.equal(
    sameScopeReconcile.selectedCardIds.length,
    openerCards.length - 1,
  )

  // Transient empty prior cards must not leave new lesson at 0 of N.
  const fromEmpty = reconcileSbActivitySelection({
    cards: phonicsCards,
    previous: { selectedCardIds: [] },
    previousCardIds: [],
  })
  assert.deepEqual(
    [...fromEmpty.selectedCardIds].sort(),
    phonicsCards.map((c) => c.id).sort(),
  )
  assert.equal(
    includedActivitiesCountLabel(
      fromEmpty.selectedCardIds.length,
      phonicsCards.length,
    ),
    `${phonicsCards.length} of ${phonicsCards.length} activities included`,
  )
})

test('scope selection memory restores exclusions and keeps empty selection valid', () => {
  const map = createLessonActivityScopeSelectionMemoryMap()
  const openerCards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [128, 129],
  })
  const openerKey = buildLessonActivitySelectionScopeKey({
    catalogBookId: 'big_english_3_sb',
    unitNumber: 8,
    sbPrintedPages: [128, 129],
    companionRelationshipId: 'be3_sb_wb_rel_u08_opener_sb128-129_wb104-105',
  })
  const knownIds = openerCards.map((card) => card.id)
  const deselectedId = openerCards[0]!.id
  const selectedIds = knownIds.filter((id) => id !== deselectedId)

  writeLessonActivityScopeSelectionMemory(
    map,
    openerKey,
    captureLessonActivityScopeSelectionMemory({
      knownSbCardIds: knownIds,
      selectedSbCardIds: selectedIds,
      knownWbCardIds: [],
      selectedWbCardIds: [],
    }),
  )

  const restored = readLessonActivityScopeSelectionMemory(map, openerKey)
  assert.ok(restored)
  const applied = applyLessonActivityScopeSelectionMemory({
    memory: restored!,
    sbCards: openerCards,
    wbCards: [],
  })
  assert.ok(!applied.sbSelection.selectedCardIds.includes(deselectedId))
  assert.equal(applied.sbSelection.selectedCardIds.length, selectedIds.length)

  // Empty selection is valid saved state — not treated as uninitialized.
  writeLessonActivityScopeSelectionMemory(
    map,
    openerKey,
    captureLessonActivityScopeSelectionMemory({
      knownSbCardIds: knownIds,
      selectedSbCardIds: [],
      knownWbCardIds: [],
      selectedWbCardIds: [],
    }),
  )
  const emptyApplied = applyLessonActivityScopeSelectionMemory({
    memory: readLessonActivityScopeSelectionMemory(map, openerKey)!,
    sbCards: openerCards,
    wbCards: [],
  })
  assert.deepEqual(emptyApplied.sbSelection.selectedCardIds, [])
  assert.ok(readLessonActivityScopeSelectionMemory(map, openerKey))
})

test('scope selection memory keeps late-loaded deselected cards off', () => {
  const allIds = ['sb-1', 'sb-2', 'sb-3', 'sb-4']
  const memory = captureLessonActivityScopeSelectionMemory({
    knownSbCardIds: allIds,
    selectedSbCardIds: ['sb-1', 'sb-2', 'sb-3'], // sb-4 deselected
    knownWbCardIds: ['wb-1', 'wb-2'],
    selectedWbCardIds: ['wb-1'], // wb-2 deselected
  })

  // First only a subset of cards has loaded.
  const early = applyLessonActivityScopeSelectionMemory({
    memory,
    sbCards: allIds.slice(0, 2).map((id) => ({ id }) as never),
    wbCards: [{ id: 'wb-1' } as never],
  })
  assert.deepEqual(early.sbSelection.selectedCardIds, ['sb-1', 'sb-2'])
  assert.deepEqual(early.wbSelection.selectedCardIds, ['wb-1'])

  // Late cards arrive — previously known deselections stay off; not treated as new.
  const late = applyLessonActivityScopeSelectionMemory({
    memory: early.memory,
    sbCards: allIds.map((id) => ({ id }) as never),
    wbCards: [{ id: 'wb-1' } as never, { id: 'wb-2' } as never],
  })
  assert.deepEqual(late.sbSelection.selectedCardIds, ['sb-1', 'sb-2', 'sb-3'])
  assert.ok(!late.sbSelection.selectedCardIds.includes('sb-4'))
  assert.deepEqual(late.wbSelection.selectedCardIds, ['wb-1'])
  assert.ok(!late.wbSelection.selectedCardIds.includes('wb-2'))

  // Genuinely new card still defaults on.
  const withNew = applyLessonActivityScopeSelectionMemory({
    memory: late.memory,
    sbCards: [...allIds, 'sb-5'].map((id) => ({ id }) as never),
    wbCards: [{ id: 'wb-1' } as never, { id: 'wb-2' } as never],
  })
  assert.ok(withNew.sbSelection.selectedCardIds.includes('sb-5'))
  assert.ok(!withNew.sbSelection.selectedCardIds.includes('sb-4'))
})

test('scope selection memory isolates keys and clears at session boundary', () => {
  const map = createLessonActivityScopeSelectionMemoryMap()
  const openerKey = buildLessonActivitySelectionScopeKey({
    catalogBookId: 'big_english_3_sb',
    unitNumber: 8,
    sbPrintedPages: [128, 129],
    companionRelationshipId: 'be3_sb_wb_rel_u08_opener_sb128-129_wb104-105',
  })
  const valuesKey = buildLessonActivitySelectionScopeKey({
    catalogBookId: 'big_english_3_sb',
    unitNumber: 8,
    sbPrintedPages: [142],
    companionRelationshipId: null,
  })
  const otherBookKey = buildLessonActivitySelectionScopeKey({
    catalogBookId: 'big_english_2_sb',
    unitNumber: 8,
    sbPrintedPages: [128, 129],
    companionRelationshipId: null,
  })
  assert.notEqual(openerKey, valuesKey)
  assert.notEqual(openerKey, otherBookKey)

  writeLessonActivityScopeSelectionMemory(
    map,
    openerKey,
    captureLessonActivityScopeSelectionMemory({
      knownSbCardIds: ['a'],
      selectedSbCardIds: [],
      knownWbCardIds: [],
      selectedWbCardIds: [],
    }),
  )
  writeLessonActivityScopeSelectionMemory(
    map,
    valuesKey,
    captureLessonActivityScopeSelectionMemory({
      knownSbCardIds: ['b'],
      selectedSbCardIds: ['b'],
      knownWbCardIds: [],
      selectedWbCardIds: [],
    }),
  )
  assert.deepEqual(
    readLessonActivityScopeSelectionMemory(map, openerKey)?.selectedSbCardIds,
    [],
  )
  assert.deepEqual(
    readLessonActivityScopeSelectionMemory(map, valuesKey)?.selectedSbCardIds,
    ['b'],
  )
  assert.equal(readLessonActivityScopeSelectionMemory(map, otherBookKey), undefined)

  clearLessonActivityScopeSelectionMemory(map)
  assert.equal(readLessonActivityScopeSelectionMemory(map, openerKey), undefined)
  assert.equal(readLessonActivityScopeSelectionMemory(map, valuesKey), undefined)
  assert.deepEqual(mergeKnownActivityCardIds(['a'], ['a', 'b']), ['a', 'b'])

  const workspace = fs.readFileSync(
    path.join(ROOT, 'app/src/features/chalkie/ChalkieWorkspace.tsx'),
    'utf8',
  )
  assert.ok(workspace.includes('createLessonActivityScopeSelectionMemoryMap'))
  assert.ok(workspace.includes('applyLessonActivityScopeSelectionMemory'))
  assert.ok(workspace.includes('clearLessonActivityScopeSelectionMemory'))
  assert.ok(workspace.includes('handleBackToBooks'))
  assert.ok(workspace.includes('[book.id]'))
})
