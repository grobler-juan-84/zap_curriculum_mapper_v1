/**
 * Pure PDF spread resolution for ValidationPdfPane.
 * Separates “which physical PDF pages to paint” from React/PDF.js lifecycle.
 */

export type PdfRendererSpread = {
  leftPdfPage: number | null
  rightPdfPage: number | null
  /** True when the right slot is intentionally empty (true EOF or missing 2nd mapped page). */
  showingEndOfDocument: boolean
  /** Document length not known yet — do not paint cover/EOF placeholders. */
  awaitingDocument: boolean
}

function clampPage(page: number, numPages: number): number {
  if (numPages <= 0) return 1
  return Math.min(Math.max(1, Math.floor(page)), numPages)
}

/**
 * Decide the exact left/right PDF page numbers the renderer should paint.
 *
 * Rules:
 * - With `allowedPdfPages`, render those physical indices (order preserved).
 * - Never clamp a high index down onto a lower one (that collapsed WB 104+105 → 104
 *   when `numPages` was stale/short, producing “End of document” on the right).
 * - Out-of-range requested pages are dropped; if that removes the 2nd mapped page,
 *   `showingEndOfDocument` is true so tests/UI can catch the failure.
 * - Without allow-list, show the normal pair starting at `pairStart`.
 */
export function resolvePdfRendererSpread(input: {
  numPages: number
  pairStart: number
  allowedPdfPages?: number[] | null
}): PdfRendererSpread {
  const { numPages, pairStart, allowedPdfPages } = input

  if (!Number.isFinite(numPages) || numPages <= 0) {
    return {
      leftPdfPage: null,
      rightPdfPage: null,
      showingEndOfDocument: false,
      awaitingDocument: true,
    }
  }

  if (allowedPdfPages?.length) {
    const requested = allowedPdfPages.filter((n) => Number.isFinite(n) && n >= 1)
    const inRange: number[] = []
    for (const page of requested) {
      const pdfPage = Math.floor(page)
      if (pdfPage > numPages) continue
      if (!inRange.includes(pdfPage)) inRange.push(pdfPage)
    }

    if (inRange.length === 0) {
      return {
        leftPdfPage: null,
        rightPdfPage: null,
        showingEndOfDocument: true,
        awaitingDocument: false,
      }
    }

    const leftPdfPage = inRange[0]!
    const rightPdfPage = inRange.length > 1 ? inRange[1]! : null
    const lostMappedPage = inRange.length < requested.length

    return {
      leftPdfPage,
      rightPdfPage,
      showingEndOfDocument: rightPdfPage == null && (requested.length === 1 || lostMappedPage),
      awaitingDocument: false,
    }
  }

  const leftPdfPage = clampPage(pairStart, numPages)
  const rightPdfPage = leftPdfPage + 1 <= numPages ? leftPdfPage + 1 : null
  return {
    leftPdfPage,
    rightPdfPage,
    showingEndOfDocument: rightPdfPage == null,
    awaitingDocument: false,
  }
}

/** Props the host must supply so the pane can paint a known two-page mapping. */
export function chalkieCompanionRendererProps(input: {
  mode: 'student_book' | 'workbook'
  sbPdfPages: number[] | null
  wbPdfPages: number[] | null
  pendingSbRestore: boolean
}): {
  allowedPdfPages: number[] | null
  navigationLocked: boolean
} {
  if (input.mode === 'workbook') {
    return {
      allowedPdfPages: input.wbPdfPages,
      navigationLocked: true,
    }
  }
  if (input.pendingSbRestore && input.sbPdfPages?.length) {
    return {
      allowedPdfPages: input.sbPdfPages,
      navigationLocked: true,
    }
  }
  return {
    allowedPdfPages: null,
    navigationLocked: false,
  }
}
