import type { Phase1UnitPages } from './resolvePdfInitialPage'

export type PdfVisibleRange = {
  pdfStart: number
  pdfEnd: number
}

/**
 * Find which Phase 1 unit contains a 1-based PDF page index, if any.
 * Uses extracted `pdf_page_start` / `pdf_page_end` boundaries only.
 */
export function findUnitForPdfPage(
  pdfPage: number,
  phase1Units: Phase1UnitPages[],
): string | null {
  if (!Number.isFinite(pdfPage)) return null
  for (const unit of phase1Units) {
    if (
      typeof unit.pdfPageStart === 'number' &&
      typeof unit.pdfPageEnd === 'number' &&
      pdfPage >= unit.pdfPageStart &&
      pdfPage <= unit.pdfPageEnd
    ) {
      return unit.unitNumber
    }
  }
  return null
}

/**
 * Map the PDF viewer's visible pair to a BI unit number, or null when the
 * spread falls outside all extracted units (inter-unit reviews/checkpoints).
 *
 * Preference: left page's unit; if left is outside and right is inside a unit,
 * adopt the right (entering the next unit on a straddling spread).
 */
export function resolveUnitForVisiblePdfPages(
  range: PdfVisibleRange,
  phase1Units: Phase1UnitPages[],
): string | null {
  const leftUnit = findUnitForPdfPage(range.pdfStart, phase1Units)
  const rightPage =
    range.pdfEnd !== range.pdfStart ? range.pdfEnd : null
  const rightUnit =
    rightPage != null ? findUnitForPdfPage(rightPage, phase1Units) : null

  if (leftUnit && rightUnit && leftUnit !== rightUnit) return leftUnit
  if (leftUnit) return leftUnit
  if (rightUnit) return rightUnit
  return null
}

export function resolvePdfPageEnd(
  unitNumber: string | null | undefined,
  phase1Units: Phase1UnitPages[],
): number | null {
  if (!unitNumber) return null
  const match = phase1Units.find((unit) => unit.unitNumber === unitNumber)
  return typeof match?.pdfPageEnd === 'number' ? match.pdfPageEnd : null
}
