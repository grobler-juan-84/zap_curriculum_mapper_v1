/**
 * Workspace-level activity selection scope and reconciliation.
 *
 * Selection is owned by the neutral current-lesson surface (left panel) and
 * shared with Create-a-prompt. Scope changes reset deterministically; within a
 * scope, new eligible cards default to selected and known deselections stick.
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
