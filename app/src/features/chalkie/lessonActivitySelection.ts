/**
 * Workspace-level activity selection scope and reconciliation.
 *
 * Selection is owned by the neutral current-lesson surface (left panel) and
 * shared with Create-a-prompt. Within a scope, new eligible cards default to
 * selected and known deselections stick. Across scopes in the same Book
 * Workspace book session, a memory map restores known+selected ids so teacher
 * exclusions survive navigation; first visit to a scope still defaults all-on.
 */

import {
  createDefaultSbActivitySelection,
  type SbActivityCard,
  type SbActivitySelectionState,
} from './chalkieActivitySelection'
import {
  createDefaultWbActivitySelection,
  type WbActivityCard,
  type WbActivitySelectionState,
} from './chalkieWorkbookActivitySelection'

export function buildLessonActivitySelectionScopeKey(input: {
  catalogBookId?: string | null
  unitNumber?: string | number | null
  sbPrintedPages: readonly number[]
  companionRelationshipId?: string | null
}): string {
  const pages = input.sbPrintedPages
    .filter(Number.isFinite)
    .map((page) => Math.floor(page))
    .join(',')
  const unit =
    input.unitNumber == null || input.unitNumber === ''
      ? ''
      : String(input.unitNumber)
  return [
    input.catalogBookId ?? '',
    unit,
    pages,
    input.companionRelationshipId ?? '',
  ].join('|')
}

export function activityCardIdsKey(
  cards: readonly { readonly id: string }[],
): string {
  return cards.map((card) => card.id).join('\n')
}

/** Companion relationship id is the 4th `|`-segment of the selection scope key. */
export function selectionScopeHasCompanion(scopeKey: string): boolean {
  const companionId = scopeKey.split('|')[3] ?? ''
  return companionId.length > 0
}

/**
 * When to stop re-defaulting after a lesson-scope change.
 *
 * Wait for Student Book cards (same as before). When the scope includes a
 * verified companion, also wait until Workbook cards arrive or the companion
 * workbook summary has finished loading — otherwise clearing on SB-only arrival
 * leaves WB at 0 of N until a fragile late reconcile.
 */
export function shouldClearPendingLessonActivitySelectionDefault(input: {
  scopeKey: string
  sbCardCount: number
  wbCardCount: number
  workbookSummaryLoaded: boolean
  scopeChanged: boolean
  sbCardIdsKey: string
  wbCardIdsKey: string
}): boolean {
  const awaitsCompanionWorkbook = selectionScopeHasCompanion(input.scopeKey)
  const workbookReady =
    !awaitsCompanionWorkbook ||
    input.wbCardCount > 0 ||
    input.workbookSummaryLoaded

  if (input.sbCardCount > 0 && workbookReady) return true

  if (
    input.sbCardIdsKey === '' &&
    input.wbCardIdsKey === '' &&
    !input.scopeChanged &&
    workbookReady
  ) {
    // Stable empty lesson (no SB/WB cards) — stop retrying.
    return true
  }

  return false
}

/**
 * Reconcile selection to the current card set.
 * - Unknown / stale IDs drop out.
 * - Cards never seen before default to selected.
 * - Previously known deselections remain deselected.
 *
 * Callers must pass a stable previousCardIds snapshot and must not mutate the
 * known-id ref inside React setState updaters (Strict Mode may invoke twice).
 */
export function reconcileActivitySelection(input: {
  cardIds: readonly string[]
  previousSelectedIds: readonly string[]
  previousCardIds: readonly string[]
}): { selectedCardIds: readonly string[] } {
  const previousCards = new Set(input.previousCardIds)
  const previousSelected = new Set(input.previousSelectedIds)
  const selectedCardIds = input.cardIds.filter((id) => {
    if (!previousCards.has(id)) return true
    return previousSelected.has(id)
  })
  return { selectedCardIds }
}

export function reconcileSbActivitySelection(input: {
  cards: readonly SbActivityCard[]
  previous: SbActivitySelectionState | null
  previousCardIds: readonly string[]
}): SbActivitySelectionState {
  if (!input.previous) {
    return createDefaultSbActivitySelection(input.cards)
  }
  return reconcileActivitySelection({
    cardIds: input.cards.map((card) => card.id),
    previousSelectedIds: input.previous.selectedCardIds,
    previousCardIds: input.previousCardIds,
  })
}

export function reconcileWbActivitySelection(input: {
  cards: readonly WbActivityCard[]
  previous: WbActivitySelectionState | null
  previousCardIds: readonly string[]
}): WbActivitySelectionState {
  if (!input.previous) {
    return createDefaultWbActivitySelection(input.cards)
  }
  return reconcileActivitySelection({
    cardIds: input.cards.map((card) => card.id),
    previousSelectedIds: input.previous.selectedCardIds,
    previousCardIds: input.previousCardIds,
  })
}

export function includedActivitiesCountLabel(
  selectedCount: number,
  totalCount: number,
): string {
  const noun = totalCount === 1 ? 'activity' : 'activities'
  return `${selectedCount} of ${totalCount} ${noun} included`
}

/**
 * Session-only memory for one lesson-scope key. Empty selected arrays are valid
 * teacher choices; absence from the map means uninitialized (first visit).
 */
export type LessonActivityScopeSelectionMemory = {
  readonly knownSbCardIds: readonly string[]
  readonly selectedSbCardIds: readonly string[]
  readonly knownWbCardIds: readonly string[]
  readonly selectedWbCardIds: readonly string[]
}

export type LessonActivityScopeSelectionMemoryMap = Map<
  string,
  LessonActivityScopeSelectionMemory
>

export function createLessonActivityScopeSelectionMemoryMap(): LessonActivityScopeSelectionMemoryMap {
  return new Map()
}

export function clearLessonActivityScopeSelectionMemory(
  map: LessonActivityScopeSelectionMemoryMap,
): void {
  map.clear()
}

export function readLessonActivityScopeSelectionMemory(
  map: LessonActivityScopeSelectionMemoryMap,
  scopeKey: string,
): LessonActivityScopeSelectionMemory | undefined {
  if (!scopeKey) return undefined
  return map.get(scopeKey)
}

export function writeLessonActivityScopeSelectionMemory(
  map: LessonActivityScopeSelectionMemoryMap,
  scopeKey: string,
  memory: LessonActivityScopeSelectionMemory,
): void {
  if (!scopeKey) return
  map.set(scopeKey, {
    knownSbCardIds: [...memory.knownSbCardIds],
    selectedSbCardIds: [...memory.selectedSbCardIds],
    knownWbCardIds: [...memory.knownWbCardIds],
    selectedWbCardIds: [...memory.selectedWbCardIds],
  })
}

export function captureLessonActivityScopeSelectionMemory(input: {
  knownSbCardIds: readonly string[]
  selectedSbCardIds: readonly string[]
  knownWbCardIds: readonly string[]
  selectedWbCardIds: readonly string[]
}): LessonActivityScopeSelectionMemory {
  return {
    knownSbCardIds: [...input.knownSbCardIds],
    selectedSbCardIds: [...input.selectedSbCardIds],
    knownWbCardIds: [...input.knownWbCardIds],
    selectedWbCardIds: [...input.selectedWbCardIds],
  }
}

/** Union previous known ids with cards seen now (stable order: prior, then new). */
export function mergeKnownActivityCardIds(
  previousKnown: readonly string[],
  currentCardIds: readonly string[],
): readonly string[] {
  const seen = new Set<string>()
  const merged: string[] = []
  for (const id of previousKnown) {
    if (seen.has(id)) continue
    seen.add(id)
    merged.push(id)
  }
  for (const id of currentCardIds) {
    if (seen.has(id)) continue
    seen.add(id)
    merged.push(id)
  }
  return merged
}

/**
 * Keep selected ids for known cards that have not loaded yet, so a partial
 * card set cannot drop a saved inclusion before the card arrives.
 */
export function retainSelectedIdsForUnloadedKnownCards(input: {
  knownCardIds: readonly string[]
  selectedCardIds: readonly string[]
  loadedCardIds: readonly string[]
  reconciledSelectedIds: readonly string[]
}): readonly string[] {
  const loaded = new Set(input.loadedCardIds)
  const known = new Set(input.knownCardIds)
  const retainedPending = input.selectedCardIds.filter(
    (id) => known.has(id) && !loaded.has(id),
  )
  return mergeKnownActivityCardIds(input.reconciledSelectedIds, retainedPending)
}

/**
 * Apply saved scope memory to the cards currently loaded.
 * Uses saved known ids as reconcile previousCardIds so late-arriving previously
 * deselected cards are not mistaken for new cards. Selected ids for known but
 * not-yet-loaded cards are retained in memory until those cards appear.
 */
export function applyLessonActivityScopeSelectionMemory(input: {
  memory: LessonActivityScopeSelectionMemory
  sbCards: readonly SbActivityCard[]
  wbCards: readonly WbActivityCard[]
}): {
  sbSelection: SbActivitySelectionState
  wbSelection: WbActivitySelectionState
  knownSbCardIds: readonly string[]
  knownWbCardIds: readonly string[]
  memory: LessonActivityScopeSelectionMemory
} {
  const sbLoadedIds = input.sbCards.map((card) => card.id)
  const wbLoadedIds = input.wbCards.map((card) => card.id)
  const sbSelection = reconcileSbActivitySelection({
    cards: input.sbCards,
    previous: { selectedCardIds: input.memory.selectedSbCardIds },
    previousCardIds: input.memory.knownSbCardIds,
  })
  const wbSelection = reconcileWbActivitySelection({
    cards: input.wbCards,
    previous: { selectedCardIds: input.memory.selectedWbCardIds },
    previousCardIds: input.memory.knownWbCardIds,
  })
  const knownSbCardIds = mergeKnownActivityCardIds(
    input.memory.knownSbCardIds,
    sbLoadedIds,
  )
  const knownWbCardIds = mergeKnownActivityCardIds(
    input.memory.knownWbCardIds,
    wbLoadedIds,
  )
  const selectedSbCardIds = retainSelectedIdsForUnloadedKnownCards({
    knownCardIds: input.memory.knownSbCardIds,
    selectedCardIds: input.memory.selectedSbCardIds,
    loadedCardIds: sbLoadedIds,
    reconciledSelectedIds: sbSelection.selectedCardIds,
  })
  const selectedWbCardIds = retainSelectedIdsForUnloadedKnownCards({
    knownCardIds: input.memory.knownWbCardIds,
    selectedCardIds: input.memory.selectedWbCardIds,
    loadedCardIds: wbLoadedIds,
    reconciledSelectedIds: wbSelection.selectedCardIds,
  })
  const memory = captureLessonActivityScopeSelectionMemory({
    knownSbCardIds,
    selectedSbCardIds,
    knownWbCardIds,
    selectedWbCardIds,
  })
  return {
    sbSelection: { selectedCardIds: sbSelection.selectedCardIds },
    wbSelection: { selectedCardIds: wbSelection.selectedCardIds },
    knownSbCardIds,
    knownWbCardIds,
    memory,
  }
}
