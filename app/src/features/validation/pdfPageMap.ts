/**
 * Printed page ↔ physical PDF index mapping for the Validation viewer.
 * Built from extracted page records (`printed_page` + `pdf_page`), so source
 * scans with omitted pages still navigate correctly.
 */

export type PageMapEntry = { pdf: number; printed: number }

/** Sorted by PDF index; one entry per PDF index. */
export type PageMap = PageMapEntry[]

export function buildPageMap(
  pages: Array<{ printedPage?: number | null; pdfPage?: number | null }>,
): PageMap {
  const byPdf = new Map<number, number>()
  for (const page of pages) {
    const { printedPage, pdfPage } = page
    if (typeof printedPage !== 'number' || typeof pdfPage !== 'number') continue
    if (!byPdf.has(pdfPage)) byPdf.set(pdfPage, printedPage)
  }
  return [...byPdf.entries()]
    .map(([pdf, printed]) => ({ pdf, printed }))
    .sort((a, b) => a.pdf - b.pdf)
}

function nearestBy(map: PageMap, value: number, key: 'pdf' | 'printed'): PageMapEntry {
  let best = map[0]
  for (const entry of map) {
    if (Math.abs(entry[key] - value) < Math.abs(best[key] - value)) best = entry
  }
  return best
}

/** Printed label for a PDF index; extrapolates from the nearest known page. */
export function printedForPdf(map: PageMap, pdfIndex: number): number | null {
  if (!map.length) return null
  const exact = map.find((entry) => entry.pdf === pdfIndex)
  if (exact) return exact.printed
  const near = nearestBy(map, pdfIndex, 'pdf')
  return pdfIndex + (near.printed - near.pdf)
}

/** PDF index for a printed page; falls back to the printed number when unmapped. */
export function pdfForPrinted(map: PageMap, printed: number): number {
  if (!map.length) return printed
  const exact = map.find((entry) => entry.printed === printed)
  if (exact) return exact.pdf
  const near = nearestBy(map, printed, 'printed')
  return printed + (near.pdf - near.printed)
}
