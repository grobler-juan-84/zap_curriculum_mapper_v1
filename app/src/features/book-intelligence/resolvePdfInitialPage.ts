import { type PageMap, pdfForPrinted } from '../validation/pdfPageMap'

export type Phase1UnitPages = {
  unitNumber: string
  printedPageStart: number | null
  pdfPageStart: number | null
}

/**
 * Resolve 1-based PDF index for ValidationPdfPane `initialPage`.
 * Prefer Phase 1 `pdf_page_start`, then printed→PDF via page map, then BI printed pages.
 */
export function resolvePdfInitialPage(
  unitNumber: string | null | undefined,
  biPrintedPageStart: number | null | undefined,
  phase1Units: Phase1UnitPages[],
  pageMap: PageMap,
): number | null {
  if (!unitNumber) return null
  const phase1 = phase1Units.find((unit) => unit.unitNumber === unitNumber)
  if (typeof phase1?.pdfPageStart === 'number') return phase1.pdfPageStart
  const printed =
    phase1?.printedPageStart ?? biPrintedPageStart ?? null
  if (typeof printed !== 'number') return null
  if (pageMap.length > 0) return pdfForPrinted(pageMap, printed)
  return printed
}
