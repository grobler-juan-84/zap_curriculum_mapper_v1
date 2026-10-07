import React, { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

interface ValidationPdfPaneProps {
  pdfUrl: string | null
  loading: boolean
  bookTitle: string
  /** 1-based page placed on the left; the following page (if any) is on the right. */
  initialPage?: number | null
}

function clampPage(page: number, numPages: number): number {
  if (numPages <= 0) return 1
  return Math.min(Math.max(1, Math.floor(page)), numPages)
}

export const ValidationPdfPane: React.FC<ValidationPdfPaneProps> = ({
  pdfUrl,
  loading,
  bookTitle,
  initialPage = null,
}) => {
  const [numPages, setNumPages] = useState(0)
  const [pairStart, setPairStart] = useState(1)
  const [jumpValue, setJumpValue] = useState('1')
  const [docError, setDocError] = useState<string | null>(null)

  useEffect(() => {
    setNumPages(0)
    setPairStart(1)
    setJumpValue('1')
    setDocError(null)
  }, [pdfUrl])

  useEffect(() => {
    if (!numPages || !initialPage) return
    const start = clampPage(initialPage, numPages)
    setPairStart(start)
    setJumpValue(String(start))
  }, [initialPage, numPages])

  const leftPage = pairStart
  const rightPage = pairStart + 1 <= numPages ? pairStart + 1 : null
  const canPrev = pairStart > 1
  const canNext = pairStart < numPages

  const pageLabel = useMemo(() => {
    if (!numPages) return '—'
    if (rightPage) return `${leftPage}–${rightPage} of ${numPages}`
    return `${leftPage} of ${numPages}`
  }, [leftPage, rightPage, numPages])

  const goPrev = () => {
    setPairStart((current) => {
      const next = clampPage(current - 2, numPages)
      setJumpValue(String(next))
      return next
    })
  }

  const goNext = () => {
    setPairStart((current) => {
      const next = clampPage(current + 2, numPages)
      setJumpValue(String(next))
      return next
    })
  }

  const jumpToPage = () => {
    const parsed = Number.parseInt(jumpValue, 10)
    if (!Number.isFinite(parsed) || !numPages) return
    const start = clampPage(parsed, numPages)
    setPairStart(start)
    setJumpValue(String(start))
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-md border border-slate-300 bg-white shadow-xs">
      <div className="flex h-9 shrink-0 items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-3">
        <div className="flex min-w-0 items-center gap-2 text-xs font-bold text-slate-800">
          <FileText className="h-3.5 w-3.5 shrink-0 text-slate-500" />
          Source PDF
          <span className="truncate font-mono text-[10px] font-normal text-slate-500">
            {bookTitle}
          </span>
        </div>

        {pdfUrl && numPages > 0 ? (
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canPrev}
              className="inline-flex h-6 items-center rounded border border-slate-300 bg-white px-1.5 text-slate-700 disabled:opacity-40"
              aria-label="Previous two pages"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-[5.5rem] text-center font-mono text-[10px] text-slate-600">
              {pageLabel}
            </span>
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
                Jump to page
              </label>
              <input
                id="pdf-jump-page"
                type="number"
                min={1}
                max={numPages || undefined}
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
