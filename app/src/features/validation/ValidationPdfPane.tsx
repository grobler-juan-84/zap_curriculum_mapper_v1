import React, { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { type PageMap, pdfForPrinted, printedForPdf } from './pdfPageMap'
import { resolvePdfRendererSpread } from './pdfRendererSpread'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

export type PdfVisibleRange = {
  /** 1-based PDF index of the left page in the pair. */
  pdfStart: number
  /** 1-based PDF index of the right page (same as start when only one page). */
  pdfEnd: number
}

interface ValidationPdfPaneProps {
  pdfUrl: string | null
  loading: boolean
  bookTitle: string
  /** Which store produced the PDF URL (D012 R2-only; `supabase` unused). */
  pdfProvider?: 'r2' | 'supabase' | null
  /** 1-based PDF index placed on the left; the following page (if any) is on the right. */
  initialPage?: number | null
  /**
   * Inclusive PDF end of the host's selected unit. When set, applying
   * `initialPage` is skipped if the current view already overlaps
   * `[initialPage, initialPageEnd]` — prevents PDF↔unit sync loops.
   */
  initialPageEnd?: number | null
  /** Printed ↔ PDF index map for the current unit; empty means printed = PDF index. */
  pageMap?: PageMap
  /** Fired whenever the visible PDF pair changes (load, Prev/Next, Go, or jump). */
  onVisibleRangeChange?: (range: PdfVisibleRange) => void
  /** Called when the visible spread’s printed page numbers change (Chalkie Workspace). */
  onVisiblePrintedPagesChange?: (printedPages: number[]) => void
  /**
   * Printed page selected via Go / Prev / Next (lesson scope for one-page components).
   * May differ from the left page when Go targets the right page of a facing pair.
   */
  onActivePrintedPageChange?: (printedPage: number) => void
  /**
   * Explicit one-shot navigation request (1-based PDF index).
   * Increments `requestId` to force a jump even when the target page is unchanged.
   */
  jumpRequest?: { pdfPage: number; requestId: number } | null
  /**
   * When true, disable Prev/Next, page spinner, and Go (Chalkie Workbook companion view).
   */
  navigationLocked?: boolean
  /**
   * Host-owned lesson-anchor navigation (Chalkie). Return true when handled so the
   * pane does not fall back to a fixed two-page PDF increment.
   */
  onLessonNavigateNext?: () => boolean
  onLessonNavigatePrev?: () => boolean
  onLessonNavigateGo?: (printedPage: number) => boolean
  /** When true with lesson navigation, disable Next at the unit's last lesson. */
  lessonNavAtEnd?: boolean
  /** When true with lesson navigation, disable Prev at the unit's first lesson. */
  lessonNavAtStart?: boolean
  /**
   * When set, show only these printed pages (mapped via `pageMap` → pdf indices).
   * Prefer `allowedPdfPages` when verified source `pdf_page` values are available.
   */
  allowedPrintedPages?: number[] | null
  /**
   * When set, show only these physical PDF indices (already resolved from source
   * `pdf_page`). Takes precedence over `allowedPrintedPages`.
   */
  allowedPdfPages?: number[] | null
}

const EMPTY_PAGE_MAP: PageMap = []

function clampPage(page: number, numPages: number): number {
  if (numPages <= 0) return 1
  return Math.min(Math.max(1, Math.floor(page)), numPages)
}

export const ValidationPdfPane: React.FC<ValidationPdfPaneProps> = ({
  pdfUrl,
  loading,
  bookTitle,
  pdfProvider = null,
  initialPage = null,
  initialPageEnd = null,
  pageMap = EMPTY_PAGE_MAP,
  onVisibleRangeChange,
  onVisiblePrintedPagesChange,
  onActivePrintedPageChange,
  jumpRequest = null,
  navigationLocked = false,
  onLessonNavigateNext,
  onLessonNavigatePrev,
  onLessonNavigateGo,
  lessonNavAtEnd = false,
  lessonNavAtStart = false,
  allowedPrintedPages = null,
  allowedPdfPages = null,
}) => {
  const [numPages, setNumPages] = useState(0)
  const [pairStart, setPairStart] = useState(1)
  const [jumpValue, setJumpValue] = useState('1')
  const [docError, setDocError] = useState<string | null>(null)
  /** Avoid reporting page 1 before the host's initial unit jump has applied. */
  const [rangeReportReady, setRangeReportReady] = useState(false)

  const printedLabel = (pdfIndex: number): number => printedForPdf(pageMap, pdfIndex) ?? pdfIndex

  /** Host-resolved physical PDF indices, or printed→pdf via pageMap as fallback. */
  const resolvedAllowedPdfPages = useMemo(() => {
    if (allowedPdfPages?.length) {
      return allowedPdfPages.filter((n) => Number.isFinite(n) && n >= 1)
    }
    if (!allowedPrintedPages?.length) return null
    return allowedPrintedPages.map((printed) => pdfForPrinted(pageMap, printed))
  }, [allowedPdfPages, allowedPrintedPages, pageMap])

  const spread = useMemo(
    () =>
      resolvePdfRendererSpread({
        numPages,
        pairStart,
        allowedPdfPages: resolvedAllowedPdfPages,
      }),
    [numPages, pairStart, resolvedAllowedPdfPages],
  )

  const leftPage = spread.leftPdfPage
  const rightPage = spread.rightPdfPage
  const pagesLocked = Boolean(resolvedAllowedPdfPages?.length)
  const lessonNavEnabled = Boolean(
    onLessonNavigateNext || onLessonNavigatePrev || onLessonNavigateGo,
  )
  const canPrev =
    !navigationLocked &&
    !pagesLocked &&
    (lessonNavEnabled ? !lessonNavAtStart : pairStart > 1)
  const canNext =
    !navigationLocked &&
    !pagesLocked &&
    (lessonNavEnabled ? !lessonNavAtEnd : pairStart < numPages)

  // Align pairStart with forced mapped pages (keeps jump label honest).
  useEffect(() => {
    if (!resolvedAllowedPdfPages?.length || !numPages) return
    const start = resolvedAllowedPdfPages.find((n) => n >= 1 && n <= numPages)
    if (start == null) return
    setPairStart(start)
    setJumpValue(String(printedForPdf(pageMap, start) ?? start))
    setRangeReportReady(true)
  }, [resolvedAllowedPdfPages, numPages, pageMap])

  useEffect(() => {
    setNumPages(0)
    setPairStart(1)
    setJumpValue('1')
    setDocError(null)
    setRangeReportReady(false)
  }, [pdfUrl])

  // Jump when the host changes unit (or page map arrives). Keep the Document
  // mounted across unit changes within the same PDF — remount only when pdfUrl
  // changes (see Document `key` below).
  useEffect(() => {
    if (!numPages) return
    if (resolvedAllowedPdfPages?.length) return
    if (initialPage == null || !Number.isFinite(initialPage)) {
      setRangeReportReady(true)
      return
    }
    const start = clampPage(initialPage, numPages)
    if (initialPageEnd != null && Number.isFinite(initialPageEnd)) {
      const end = clampPage(initialPageEnd, numPages)
      setPairStart((current) => {
        const viewEnd = current + 1 <= numPages ? current + 1 : current
        const overlaps = current <= end && viewEnd >= start
        if (overlaps) return current
        setJumpValue(String(printedForPdf(pageMap, start) ?? start))
        return start
      })
      setRangeReportReady(true)
      return
    }
    setPairStart(start)
    setJumpValue(String(printedForPdf(pageMap, start) ?? start))
    setRangeReportReady(true)
  }, [initialPage, initialPageEnd, numPages, pageMap, resolvedAllowedPdfPages])

  // Host-driven jump (e.g. View Student Book restore) — always applies once loaded
  // unless mapped pages are forcing the visible pair.
  useEffect(() => {
    if (!numPages || !jumpRequest) return
    if (resolvedAllowedPdfPages?.length) return
    if (!Number.isFinite(jumpRequest.pdfPage)) return
    const start = clampPage(jumpRequest.pdfPage, numPages)
    setPairStart(start)
    setJumpValue(String(printedForPdf(pageMap, start) ?? start))
    setRangeReportReady(true)
  }, [jumpRequest, numPages, pageMap, resolvedAllowedPdfPages])

  useEffect(() => {
    if (!numPages || !onVisibleRangeChange || !rangeReportReady) return
    if (leftPage == null) return
    onVisibleRangeChange({
      pdfStart: leftPage,
      pdfEnd: rightPage ?? leftPage,
    })
  }, [leftPage, rightPage, numPages, onVisibleRangeChange, rangeReportReady])

  const leftPrinted = leftPage != null ? printedForPdf(pageMap, leftPage) : null
  const rightPrinted = rightPage != null ? printedForPdf(pageMap, rightPage) : null

  useEffect(() => {
    if (!onVisiblePrintedPagesChange || !numPages || !rangeReportReady) return
    if (leftPage == null) return
    const pages: number[] = []
    const left = printedForPdf(pageMap, leftPage)
    if (left != null) pages.push(left)
    if (rightPage != null) {
      const right = printedForPdf(pageMap, rightPage)
      if (right != null && right !== left) pages.push(right)
    }
    pages.sort((a, b) => a - b)
    onVisiblePrintedPagesChange(pages)
  }, [
    onVisiblePrintedPagesChange,
    numPages,
    pageMap,
    leftPage,
    rightPage,
    rangeReportReady,
  ])

  const pdfLabel = useMemo(() => {
    if (!numPages || leftPage == null) return '—'
    if (rightPage) return `${leftPage}–${rightPage} of ${numPages}`
    return `${leftPage} of ${numPages}`
  }, [leftPage, rightPage, numPages])

  const printedRangeLabel =
    leftPrinted == null
      ? null
      : rightPrinted != null
        ? `p. ${leftPrinted}–${rightPrinted}`
        : `p. ${leftPrinted}`

  const missingLabel =
    leftPrinted != null && rightPrinted != null && rightPrinted - leftPrinted > 1
      ? rightPrinted - leftPrinted === 2
        ? `p. ${leftPrinted + 1} missing from source PDF`
        : `pp. ${leftPrinted + 1}–${rightPrinted - 1} missing from source PDF`
      : null

  const goPrev = () => {
    if (navigationLocked || pagesLocked || !canPrev) return
    if (onLessonNavigatePrev?.()) return
    setPairStart((current) => {
      const next = clampPage(current - 2, numPages)
      const printed = printedLabel(next)
      setJumpValue(String(printed))
      onActivePrintedPageChange?.(printed)
      return next
    })
  }

  const goNext = () => {
    if (navigationLocked || pagesLocked || !canNext) return
    if (onLessonNavigateNext?.()) return
    setPairStart((current) => {
      const next = clampPage(current + 2, numPages)
      const printed = printedLabel(next)
      setJumpValue(String(printed))
      onActivePrintedPageChange?.(printed)
      return next
    })
  }

  /**
   * Go to a printed page: keep a consecutive facing pair visible for reading when
   * the target is the right-hand page, and report the Go target as the active
   * lesson page (one-page components on a two-page PDF spread).
   * Host lesson-anchor Go expands to the full lesson when registered.
   */
  const jumpToPage = () => {
    if (navigationLocked || pagesLocked) return
    const parsed = Number.parseInt(jumpValue, 10)
    if (!Number.isFinite(parsed) || !numPages) return
    if (onLessonNavigateGo?.(parsed)) return
    const targetPdf = pdfForPrinted(pageMap, parsed)
    const prevPdf = pdfForPrinted(pageMap, parsed - 1)
    // If target is the right page of a consecutive PDF pair, start at the left.
    const startPdf =
      prevPdf != null && targetPdf === prevPdf + 1 ? prevPdf : targetPdf
    const start = clampPage(startPdf, numPages)
    setPairStart(start)
    setJumpValue(String(parsed))
    onActivePrintedPageChange?.(parsed)
  }

  const showMappedOnlyBadge = navigationLocked || pagesLocked

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-md border border-slate-300 bg-white shadow-xs">
      <div className="flex min-h-9 shrink-0 flex-wrap items-center justify-between gap-x-2 gap-y-1 border-b border-slate-200 bg-slate-50 px-3 py-1.5">
        <div className="flex min-w-0 flex-1 items-center gap-2 text-xs font-bold text-slate-800">
          <FileText className="h-3.5 w-3.5 shrink-0 text-slate-500" />
          <span className="shrink-0">Source PDF</span>
          <span className="truncate font-mono text-[10px] font-normal text-slate-500">
            {bookTitle}
          </span>
          {pdfProvider ? (
            <span
              className="shrink-0 rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wide text-slate-600"
              title="Object store that signed this PDF URL"
            >
              via {pdfProvider}
            </span>
          ) : null}
          {missingLabel ? (
            <span className="shrink-0 rounded border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-800">
              {missingLabel}
            </span>
          ) : null}
        </div>

        {pdfUrl && numPages > 0 ? (
          <div className="flex shrink-0 flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canPrev}
              className="inline-flex h-6 items-center rounded border border-slate-300 bg-white px-1.5 text-slate-700 disabled:opacity-40"
              aria-label="Previous two pages"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            {printedRangeLabel ? (
              <span
                className="flex min-w-[5.5rem] flex-col items-center leading-tight"
                title="Printed page numbers (physical PDF index below)"
              >
                <span className="font-mono text-[10px] font-semibold text-slate-700">
                  {printedRangeLabel}
                </span>
                <span className="font-mono text-[9px] text-slate-400">PDF {pdfLabel}</span>
              </span>
            ) : (
              <span className="min-w-[5.5rem] text-center font-mono text-[10px] text-slate-600">
                {pdfLabel}
              </span>
            )}
            <button
              type="button"
              onClick={goNext}
              disabled={!canNext}
              className="inline-flex h-6 items-center rounded border border-slate-300 bg-white px-1.5 text-slate-700 disabled:opacity-40"
              aria-label="Next two pages"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            {showMappedOnlyBadge ? (
              <span className="ml-1 rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-900">
                Mapped pages only
              </span>
            ) : (
              <form
                className="ml-1 flex items-center gap-1"
                onSubmit={(e) => {
                  e.preventDefault()
                  jumpToPage()
                }}
              >
                <label className="sr-only" htmlFor="pdf-jump-page">
                  Jump to printed page
                </label>
                <input
                  id="pdf-jump-page"
                  type="number"
                  min={1}
                  title="Printed page number"
                  value={jumpValue}
                  onChange={(e) => setJumpValue(e.target.value)}
                  className="h-6 w-14 rounded border border-slate-300 px-1.5 font-mono text-[10px] text-slate-700"
                />
                <button
                  type="submit"
                  className="h-6 rounded border border-slate-300 bg-white px-2 text-[10px] font-semibold text-slate-700"
                >
                  Go
                </button>
              </form>
            )}
          </div>
        ) : null}
      </div>

      <div className="relative min-h-0 flex-1 overflow-auto bg-slate-100">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Checking for source PDF…
          </div>
        ) : pdfUrl ? (
          <div className="flex h-full min-h-[240px] flex-col">
            {docError ? (
              <div className="flex h-full items-center justify-center px-4 text-center text-sm text-rose-700">
                {docError}
              </div>
            ) : (
              <Document
                // Remount when the source file changes so numPages/onLoadSuccess
                // always belong to the active SB or WB PDF (not a stale document).
                key={pdfUrl}
                file={pdfUrl}
                loading={
                  <div className="flex h-full items-center justify-center text-sm text-slate-500">
                    Loading PDF…
                  </div>
                }
                onLoadSuccess={({ numPages: nextNumPages }) => {
                  setNumPages(nextNumPages)
                  setDocError(null)
                }}
                onLoadError={(error) => {
                  setDocError(error.message || 'Could not load PDF.')
                }}
                className="flex flex-1 items-start justify-center gap-2 p-2"
              >
                {spread.awaitingDocument || leftPage == null ? (
                  <div className="flex h-[480px] w-full items-center justify-center text-sm text-slate-500">
                    Loading pages…
                  </div>
                ) : (
                  <>
                    <div className="overflow-hidden rounded border border-slate-300 bg-white shadow-sm">
                      <Page
                        pageNumber={leftPage}
                        width={360}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                      />
                    </div>
                    {rightPage ? (
                      <div className="overflow-hidden rounded border border-slate-300 bg-white shadow-sm">
                        <Page
                          pageNumber={rightPage}
                          width={360}
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                        />
                      </div>
                    ) : spread.showingEndOfDocument ? (
                      <div className="flex h-[480px] w-[360px] items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400">
                        End of document
                      </div>
                    ) : null}
                  </>
                )}
              </Document>
            )}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <div className="rounded-full border border-dashed border-slate-300 bg-white p-4">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-800">PDF not uploaded yet</p>
            <p className="max-w-sm text-xs leading-relaxed text-slate-500">
              Upload the student-book PDF to the private <code className="text-[11px]">book-sources</code>{' '}
              bucket and register a <code className="text-[11px]">source_pdf</code> row on{' '}
              <code className="text-[11px]">book_files</code>. It will embed here for side-by-side
              verification against the unit JSON.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
