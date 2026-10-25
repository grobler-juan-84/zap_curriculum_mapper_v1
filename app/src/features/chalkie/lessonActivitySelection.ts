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

/**
 * Reconcile selection to the current card set.
 * - Unknown / stale IDs drop out.
 * - Cards never seen before default to selected.
 * - Previously known deselections remain deselected.
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
