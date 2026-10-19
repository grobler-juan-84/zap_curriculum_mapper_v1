import React, { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { type PageMap, pdfForPrinted, printedForPdf } from './pdfPageMap'

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
   * Explicit one-shot navigation request (1-based PDF index).
   * Increments `requestId` to force a jump even when the target page is unchanged.
   */
  jumpRequest?: { pdfPage: number; requestId: number } | null
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
  jumpRequest = null,
}) => {
  const [numPages, setNumPages] = useState(0)
  const [pairStart, setPairStart] = useState(1)
  const [jumpValue, setJumpValue] = useState('1')
  const [docError, setDocError] = useState<string | null>(null)
  /** Avoid reporting page 1 before the host's initial unit jump has applied. */
  const [rangeReportReady, setRangeReportReady] = useState(false)

  const printedLabel = (pdfIndex: number): number => printedForPdf(pageMap, pdfIndex) ?? pdfIndex

  useEffect(() => {
    setNumPages(0)
    setPairStart(1)
    setJumpValue('1')
    setDocError(null)
    setRangeReportReady(false)
  }, [pdfUrl])

  // Jump when the host changes unit (or page map arrives). Keep the Document
  // mounted across unit changes — remounting via React `key` breaks Prev/Next.
  // When `initialPageEnd` is set, skip jumping if the view already overlaps the
  // unit range (PDF-driven unit sync must not yank the reader back to page 1).
  useEffect(() => {
    if (!numPages) return
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
  }, [initialPage, initialPageEnd, numPages, pageMap])

  // Host-driven jump (e.g. "Go to unit opening pages") — always applies.
  useEffect(() => {
    if (!numPages || !jumpRequest) return
    if (!Number.isFinite(jumpRequest.pdfPage)) return
    const start = clampPage(jumpRequest.pdfPage, numPages)
    setPairStart(start)
    setJumpValue(String(printedForPdf(pageMap, start) ?? start))
  }, [jumpRequest, numPages, pageMap])

  const leftPage = pairStart
  const rightPage = pairStart + 1 <= numPages ? pairStart + 1 : null
  const canPrev = pairStart > 1
  const canNext = pairStart < numPages

  useEffect(() => {
    if (!numPages || !onVisibleRangeChange || !rangeReportReady) return
    onVisibleRangeChange({
      pdfStart: leftPage,
      pdfEnd: rightPage ?? leftPage,
    })
  }, [leftPage, rightPage, numPages, onVisibleRangeChange, rangeReportReady])

  const leftPrinted = printedForPdf(pageMap, leftPage)
  const rightPrinted = rightPage ? printedForPdf(pageMap, rightPage) : null

  useEffect(() => {
    if (!onVisiblePrintedPagesChange || !numPages || !rangeReportReady) return
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
    if (!numPages) return '—'
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
    setPairStart((current) => {
      const next = clampPage(current - 2, numPages)
      setJumpValue(String(printedLabel(next)))
      return next
    })
  }

  const goNext = () => {
    setPairStart((current) => {
      const next = clampPage(current + 2, numPages)
      setJumpValue(String(printedLabel(next)))
      return next
    })
  }

  const jumpToPage = () => {
    const parsed = Number.parseInt(jumpValue, 10)
    if (!Number.isFinite(parsed) || !numPages) return
    const start = clampPage(pdfForPrinted(pageMap, parsed), numPages)
    setPairStart(start)
    setJumpValue(String(printedLabel(start)))
  }

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
                file={pdfUrl}
                loading={
                  <div className="flex h-full items-center justify-center text-sm text-slate-500">
                    Loading PDF…
                  </div>
                }
                onLoadSuccess={({ numPages: nextNumPages }) => {
                  setNumPages(nextNumPages)
                  setDocError(null)
                  setPairStart((current) => clampPage(current, nextNumPages))
                }}
                onLoadError={(error) => {
                  setDocError(error.message || 'Could not load PDF.')
                }}
                className="flex flex-1 items-start justify-center gap-2 p-2"
              >
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
                ) : (
                  <div className="flex h-[480px] w-[360px] items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400">
                    End of document
                  </div>
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
