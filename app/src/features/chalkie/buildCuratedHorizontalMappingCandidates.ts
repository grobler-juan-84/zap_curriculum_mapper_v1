/**
 * Slice 3 — build curated earlier-unit `[HM]` candidates from verified entries.
 *
 * Never auto-selects. Never invents relationships. Excludes same-unit and
 * current-page evidence (those belong to `[PRIOR]` / current lesson).
 */
import {
  listCuratedHorizontalMappingEntries,
  type CuratedHorizontalMappingEntry,
} from './curatedHorizontalMappingEntries'
import type { PriorLearningCandidate } from './priorLearningCandidate'

export type BuildCuratedHorizontalMappingCandidatesInput = {
  readonly catalogBookId: string | null | undefined
  readonly unitNumber: number
  readonly visiblePrintedPages: readonly number[]
}

function sortedUniquePages(pages: readonly number[]): number[] {
  return [...new Set(pages.filter((page) => Number.isFinite(page) && page > 0))].sort(
    (a, b) => a - b,
  )
}

function pagesExactlyMatch(
  visible: readonly number[],
  target: readonly number[],
): boolean {
  const left = sortedUniquePages(visible)
  const right = sortedUniquePages(target)
  if (left.length !== right.length) return false
  return left.every((page, index) => page === right[index])
}

function overlapsPages(
  left: readonly number[],
  right: readonly number[],
): boolean {
  const rightSet = new Set(sortedUniquePages(right))
  return sortedUniquePages(left).some((page) => rightSet.has(page))
}

function entryIsEligible(
  entry: CuratedHorizontalMappingEntry,
  input: BuildCuratedHorizontalMappingCandidatesInput,
): boolean {
  if (entry.catalogBookId !== input.catalogBookId) return false
  if (entry.targetUnitNumber !== input.unitNumber) return false
  // Earlier-unit only — same-unit recycle is `[PRIOR]`, not curated `[HM]`.
  if (entry.sourceUnitNumber === entry.targetUnitNumber) return false
  if (
    entry.additionalSourceUnitNumbers?.some(
      (unit) => unit === entry.targetUnitNumber,
    )
  ) {
    return false
  }
  // Never surface own / current-page evidence as curated prior support.
  if (overlapsPages(entry.sourcePrintedPages, input.visiblePrintedPages)) {
    return false
  }
  if (
    entry.targetPrintedPages != null &&
    entry.targetPrintedPages.length > 0 &&
    !pagesExactlyMatch(input.visiblePrintedPages, entry.targetPrintedPages)
  ) {
    return false
  }
  return true
}

function candidateFromEntry(
  entry: CuratedHorizontalMappingEntry,
): PriorLearningCandidate {
  return {
    id: entry.id,
    catalogBookId: entry.catalogBookId,
    unitNumber: entry.sourceUnitNumber,
    printedPages: [...entry.sourcePrintedPages],
    pageIds: [],
    sourceType: 'HM',
    title: entry.title,
    contentPreview: entry.contentPreview,
    whyItMayHelp: entry.whyItMayHelp,
    provenanceNote: entry.provenanceNote,
    target: 'both',
    teacherNote: null,
    verificationStatus: 'verified',
    sourceReference: entry.sourceReference,
    caution: entry.caution,
    ...(entry.suggestionLabel ? { suggestionLabel: entry.suggestionLabel } : {}),
  }
}

/**
 * Deterministic curated `[HM]` candidates for the current lesson scope.
 * Order follows the curated store declaration order.
 */
export function buildCuratedHorizontalMappingCandidates(
  input: BuildCuratedHorizontalMappingCandidatesInput,
): PriorLearningCandidate[] {
  if (!input.catalogBookId || !Number.isFinite(input.unitNumber)) return []
  return listCuratedHorizontalMappingEntries()
    .filter((entry) => entryIsEligible(entry, input))
    .map(candidateFromEntry)
}
