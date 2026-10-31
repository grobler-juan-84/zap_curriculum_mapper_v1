/**
 * Bounded lesson-anchor navigation for Chalkie Student Book PDF controls.
 *
 * Prefers curated companion SB page sets (exact metadata) plus an explicit
 * companion-free lesson allowlist (e.g. Values). Does not invent mappings for
 * other books/units beyond registered companion-free entries.
 */

import {
  CURATED_VERIFIED_SB_WB_COMPANIONS,
  type CuratedVerifiedSbWbCompanion,
} from './verifiedSbWbCompanions'

export type ChalkieLessonAnchor = {
  readonly studentBookPrintedPages: readonly number[]
  /** Null when the lesson is intentionally companion-free (e.g. Values). */
  readonly companionRelationshipId: string | null
  readonly unitNumber: number
  readonly studentBookCatalogId: string
}

/** Explicit companion-free lessons (not inventable from curated WB pairs). */
export const COMPANION_FREE_LESSON_ANCHORS: readonly ChalkieLessonAnchor[] = [
  {
    studentBookCatalogId: 'big_english_3_sb',
    unitNumber: 8,
    studentBookPrintedPages: [142],
    companionRelationshipId: null,
  },
]

function normalizePages(pages: readonly number[]): number[] {
  return [...new Set(pages.filter((n) => Number.isFinite(n)).map((n) => Math.floor(n)))].sort(
    (a, b) => a - b,
  )
}

function pagesEqual(a: readonly number[], b: readonly number[]): boolean {
  const left = normalizePages(a)
  const right = normalizePages(b)
  if (left.length !== right.length) return false
  return left.every((page, index) => page === right[index])
}

function companionToAnchor(entry: CuratedVerifiedSbWbCompanion): ChalkieLessonAnchor {
  return {
    studentBookCatalogId: entry.studentBookCatalogId,
    unitNumber: entry.unitNumber,
    studentBookPrintedPages: normalizePages(entry.studentBookPrintedPages),
    companionRelationshipId: entry.relationshipId,
  }
}

/**
 * Ordered lesson anchors for a Student Book catalog + unit.
 * Curated companions first (by start page), then registered companion-free lessons.
 */
export function listLessonAnchorsForUnit(input: {
  studentBookCatalogId: string | null | undefined
  unitNumber: number | string | null | undefined
}): ChalkieLessonAnchor[] {
  const catalog = input.studentBookCatalogId?.trim() || ''
  if (!catalog) return []
  const unit =
    input.unitNumber == null || input.unitNumber === ''
      ? null
      : Number.parseInt(String(input.unitNumber), 10)
  if (unit == null || !Number.isFinite(unit)) return []

  const fromCompanions = CURATED_VERIFIED_SB_WB_COMPANIONS.filter(
    (entry) =>
      entry.studentBookCatalogId === catalog && entry.unitNumber === unit,
  ).map(companionToAnchor)

  const companionFree = COMPANION_FREE_LESSON_ANCHORS.filter(
    (entry) =>
      entry.studentBookCatalogId === catalog && entry.unitNumber === unit,
  )

  const covered = new Set(
    fromCompanions.flatMap((anchor) => [...anchor.studentBookPrintedPages]),
  )
  const freeOnly = companionFree.filter(
    (anchor) =>
      !anchor.studentBookPrintedPages.some((page) => covered.has(page)),
  )

  return [...fromCompanions, ...freeOnly].sort(
    (a, b) => a.studentBookPrintedPages[0]! - b.studentBookPrintedPages[0]!,
  )
}

export function findLessonAnchorForPrintedPage(input: {
  studentBookCatalogId: string | null | undefined
  unitNumber: number | string | null | undefined
  printedPage: number
}): ChalkieLessonAnchor | null {
  const page = Math.floor(input.printedPage)
  if (!Number.isFinite(page)) return null
  const anchors = listLessonAnchorsForUnit(input)
  return (
    anchors.find((anchor) => anchor.studentBookPrintedPages.includes(page)) ??
    null
  )
}

export function resolveLessonPagesForPrintedPage(input: {
  studentBookCatalogId: string | null | undefined
  unitNumber: number | string | null | undefined
  printedPage: number
}): number[] | null {
  const anchor = findLessonAnchorForPrintedPage(input)
  return anchor ? [...anchor.studentBookPrintedPages] : null
}

export type LessonNavStep =
  | { readonly kind: 'lesson'; readonly anchor: ChalkieLessonAnchor }
  | { readonly kind: 'end_of_unit' }

export function resolveNextLessonStep(input: {
  studentBookCatalogId: string | null | undefined
  unitNumber: number | string | null | undefined
  currentLessonPages: readonly number[]
  activePrintedPage?: number | null
}): LessonNavStep {
  const anchors = listLessonAnchorsForUnit(input)
  if (!anchors.length) return { kind: 'end_of_unit' }

  const current = normalizePages(
    input.currentLessonPages.length
      ? input.currentLessonPages
      : input.activePrintedPage != null
        ? [input.activePrintedPage]
        : [],
  )
  const index = anchors.findIndex((anchor) =>
    pagesEqual(anchor.studentBookPrintedPages, current),
  )
  if (index >= 0) {
    const next = anchors[index + 1]
    return next ? { kind: 'lesson', anchor: next } : { kind: 'end_of_unit' }
  }

  const active =
    input.activePrintedPage != null && Number.isFinite(input.activePrintedPage)
      ? Math.floor(input.activePrintedPage)
      : current[0] ?? null
  if (active == null) {
    return { kind: 'lesson', anchor: anchors[0]! }
  }
  const containing = anchors.findIndex((anchor) =>
    anchor.studentBookPrintedPages.includes(active),
  )
  if (containing < 0) {
    const after = anchors.find((anchor) => anchor.studentBookPrintedPages[0]! > active)
    return after ? { kind: 'lesson', anchor: after } : { kind: 'end_of_unit' }
  }
  const next = anchors[containing + 1]
  return next ? { kind: 'lesson', anchor: next } : { kind: 'end_of_unit' }
}

export function resolvePreviousLessonStep(input: {
  studentBookCatalogId: string | null | undefined
  unitNumber: number | string | null | undefined
  currentLessonPages: readonly number[]
  activePrintedPage?: number | null
}): LessonNavStep | { readonly kind: 'start_of_unit' } {
  const anchors = listLessonAnchorsForUnit(input)
  if (!anchors.length) return { kind: 'start_of_unit' }

  const current = normalizePages(
    input.currentLessonPages.length
      ? input.currentLessonPages
      : input.activePrintedPage != null
        ? [input.activePrintedPage]
        : [],
  )
  const index = anchors.findIndex((anchor) =>
    pagesEqual(anchor.studentBookPrintedPages, current),
  )
  if (index > 0) {
    return { kind: 'lesson', anchor: anchors[index - 1]! }
  }
  if (index === 0) return { kind: 'start_of_unit' }

  const active =
    input.activePrintedPage != null && Number.isFinite(input.activePrintedPage)
      ? Math.floor(input.activePrintedPage)
      : current[0] ?? null
  if (active == null) return { kind: 'start_of_unit' }
  const containing = anchors.findIndex((anchor) =>
    anchor.studentBookPrintedPages.includes(active),
  )
  if (containing > 0) {
    return { kind: 'lesson', anchor: anchors[containing - 1]! }
  }
  if (containing === 0) return { kind: 'start_of_unit' }
  const before = [...anchors]
    .reverse()
    .find((anchor) => anchor.studentBookPrintedPages[0]! < active)
  return before ? { kind: 'lesson', anchor: before } : { kind: 'start_of_unit' }
}

export function isPrintedPageInsideUnitRange(input: {
  printedPage: number
  unitPrintedPageStart: number | null | undefined
  unitPrintedPageEnd: number | null | undefined
}): boolean {
  const page = Math.floor(input.printedPage)
  if (!Number.isFinite(page)) return false
  const start = input.unitPrintedPageStart
  const end = input.unitPrintedPageEnd
  if (start == null || end == null) return true
  if (!Number.isFinite(start) || !Number.isFinite(end)) return true
  return page >= start && page <= end
}

/** Authoritative unit page membership from catalog/canonical unit descriptors. */
export type UnitPageRangeDescriptor = {
  readonly unitNumber: string | number
  readonly title?: string | null
  readonly printedPageStart: number | null | undefined
  readonly printedPageEnd: number | null | undefined
}

export function resolveUnitForPrintedPage(
  units: readonly UnitPageRangeDescriptor[],
  printedPage: number,
): UnitPageRangeDescriptor | null {
  const page = Math.floor(printedPage)
  if (!Number.isFinite(page)) return null
  for (const unit of units) {
    if (
      isPrintedPageInsideUnitRange({
        printedPage: page,
        unitPrintedPageStart: unit.printedPageStart,
        unitPrintedPageEnd: unit.printedPageEnd,
      }) &&
      unit.printedPageStart != null &&
      unit.printedPageEnd != null
    ) {
      return unit
    }
  }
  return null
}

export type GroundedUnitChrome = {
  readonly status: 'inside_selected' | 'outside_resolved_other' | 'outside_unresolved'
  /** Unit number that may be shown as grounded chrome; null when cleared. */
  readonly groundedUnitNumber: string | null
  readonly groundedUnitTitle: string | null
  readonly groundedUnitLabel: string | null
}

function unitLabelFor(unitNumber: string | number, title?: string | null): string {
  const num = String(unitNumber).trim()
  const trimmed = title?.trim()
  return trimmed ? `Unit ${num}: ${trimmed}` : `Unit ${num}`
}

/**
 * Decide which unit title/SS chrome may appear for the active printed page.
 * Never invents a unit: only selected-unit membership or exact catalog page ranges.
 */
export function resolveGroundedUnitChrome(input: {
  printedPage: number | null | undefined
  selectedUnitNumber: string | number | null | undefined
  selectedUnitTitle?: string | null
  selectedUnitPrintedPageStart: number | null | undefined
  selectedUnitPrintedPageEnd: number | null | undefined
  bookUnits: readonly UnitPageRangeDescriptor[]
}): GroundedUnitChrome {
  const selected =
    input.selectedUnitNumber == null || input.selectedUnitNumber === ''
      ? null
      : String(input.selectedUnitNumber).trim()
  const page =
    input.printedPage != null && Number.isFinite(input.printedPage)
      ? Math.floor(input.printedPage)
      : null

  if (page == null || selected == null) {
    if (selected == null) {
      return {
        status: 'outside_unresolved',
        groundedUnitNumber: null,
        groundedUnitTitle: null,
        groundedUnitLabel: null,
      }
    }
    return {
      status: 'inside_selected',
      groundedUnitNumber: selected,
      groundedUnitTitle: input.selectedUnitTitle?.trim() || null,
      groundedUnitLabel: unitLabelFor(selected, input.selectedUnitTitle),
    }
  }

  const insideSelected = isPrintedPageInsideUnitRange({
    printedPage: page,
    unitPrintedPageStart: input.selectedUnitPrintedPageStart,
    unitPrintedPageEnd: input.selectedUnitPrintedPageEnd,
  })
  if (insideSelected) {
    return {
      status: 'inside_selected',
      groundedUnitNumber: selected,
      groundedUnitTitle: input.selectedUnitTitle?.trim() || null,
      groundedUnitLabel: unitLabelFor(selected, input.selectedUnitTitle),
    }
  }

  const resolved = resolveUnitForPrintedPage(input.bookUnits, page)
  if (resolved) {
    const otherNumber = String(resolved.unitNumber).trim()
    if (otherNumber && otherNumber !== selected) {
      return {
        status: 'outside_resolved_other',
        groundedUnitNumber: otherNumber,
        groundedUnitTitle: resolved.title?.trim() || null,
        groundedUnitLabel: unitLabelFor(otherNumber, resolved.title),
      }
    }
  }

  return {
    status: 'outside_unresolved',
    groundedUnitNumber: null,
    groundedUnitTitle: null,
    groundedUnitLabel: null,
  }
}
