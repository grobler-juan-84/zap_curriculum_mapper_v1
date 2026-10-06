import React, { useCallback, useEffect, useState } from 'react'
import type { Book, CurriculumSeries } from '../../types/curriculum'
import type { BatchJsonSummary, BookFileBatch, BookFileStatus } from '../../types/validation'
import { validationService } from '../../services/validationService'
import { ValidationHeader } from './ValidationHeader'
import { ValidationLeftPanel } from './ValidationLeftPanel'
import { ValidationPdfPane } from './ValidationPdfPane'
import { ValidationToolsPanel } from './ValidationToolsPanel'

interface ValidationWorkspaceProps {
  seriesList: CurriculumSeries[]
  series: CurriculumSeries
  book: Book
  onSelectSeries: (seriesId: string) => void
  onSelectBook: (bookId: string) => void
  onBackToBooks: () => void
}

export const ValidationWorkspace: React.FC<ValidationWorkspaceProps> = ({
  seriesList,
  series,
  book,
  onSelectSeries,
  onSelectBook,
  onBackToBooks,
}) => {
  const [batches, setBatches] = useState<BookFileBatch[]>([])
  const [selectedBatchId, setSelectedBatchId] = useState('')
  const [batchesLoading, setBatchesLoading] = useState(true)
  const [batchesError, setBatchesError] = useState<string | null>(null)

  const [summary, setSummary] = useState<BatchJsonSummary | null>(null)
  const [jsonLoading, setJsonLoading] = useState(false)
  const [jsonError, setJsonError] = useState<string | null>(null)

  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfLoading, setPdfLoading] = useState(true)

  const [statusSaving, setStatusSaving] = useState(false)
  const [statusError, setStatusError] = useState<string | null>(null)

  const [topPaneHeightPercent, setTopPaneHeightPercent] = useState(62)
  const [isDraggingSplitter, setIsDraggingSplitter] = useState(false)

  const currentIndex = Math.max(
    0,
    batches.findIndex((batch) => batch.id === selectedBatchId),
  )
  const currentBatch =
    batches.find((batch) => batch.id === selectedBatchId) ?? batches[0] ?? null

  useEffect(() => {
    let cancelled = false
    setBatchesLoading(true)
    setBatchesError(null)
    setSelectedBatchId('')
    setSummary(null)

    validationService
      .listUnitBatches(book.id)
      .then((rows) => {
        if (cancelled) return
        setBatches(rows)
        setSelectedBatchId(rows[0]?.id ?? '')
        setBatchesLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setBatches([])
        setBatchesLoading(false)
        setBatchesError(err instanceof Error ? err.message : 'Failed to load unit batches.')
      })

    return () => {
      cancelled = true
    }
  }, [book.id])

  useEffect(() => {
    let cancelled = false
    setPdfLoading(true)
    setPdfUrl(null)

    validationService
      .findSourcePdf(book.id)
      .then(async (pdf) => {
        if (cancelled) return
        if (!pdf) {
          setPdfLoading(false)
          return
        }
        const url = await validationService.createSignedPdfUrl(pdf)
        if (cancelled) return
        setPdfUrl(url)
        setPdfLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setPdfUrl(null)
        setPdfLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [book.id])

  useEffect(() => {
    if (!currentBatch) {
      setSummary(null)
      setJsonError(null)
      return
    }

    let cancelled = false
    setJsonLoading(true)
    setJsonError(null)

    validationService
      .loadBatchJson(currentBatch)
      .then((parsed) => {
        if (cancelled) return
        setSummary(parsed)
        setJsonLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setSummary(null)
        setJsonLoading(false)
        setJsonError(err instanceof Error ? err.message : 'Failed to load batch JSON.')
      })

    return () => {
      cancelled = true
    }
  }, [currentBatch])

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setSelectedBatchId(batches[currentIndex - 1].id)
      setStatusError(null)
    }
  }, [batches, currentIndex])

  const handleNext = useCallback(() => {
    if (currentIndex < batches.length - 1) {
      setSelectedBatchId(batches[currentIndex + 1].id)
      setStatusError(null)
    }
  }, [batches, currentIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePrev, handleNext])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingSplitter) return
      const pane = document.getElementById('right-validation-pane')
      if (!pane) return
      const rect = pane.getBoundingClientRect()
      const relativeY = e.clientY - rect.top
      const newPercent = (relativeY / rect.height) * 100
      if (newPercent >= 30 && newPercent <= 75) {
        setTopPaneHeightPercent(newPercent)
      }
    }
    const handleMouseUp = () => setIsDraggingSplitter(false)

    if (isDraggingSplitter) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDraggingSplitter])

  const handleSetStatus = async (status: BookFileStatus) => {
    if (!currentBatch) return
    setStatusSaving(true)
    setStatusError(null)
    try {
      await validationService.updateBatchStatus(currentBatch.id, status)
      setBatches((prev) =>
        prev.map((batch) => (batch.id === currentBatch.id ? { ...batch, status } : batch)),
      )
    } catch (err: unknown) {
      setStatusError(err instanceof Error ? err.message : 'Failed to update status.')
    } finally {
      setStatusSaving(false)
    }
  }

  return (
    <div className="flex h-full select-none flex-col overflow-hidden bg-slate-100">
      <ValidationHeader
        seriesList={seriesList}
        series={series}
        book={book}
        batches={batches}
        currentBatch={currentBatch}
        currentIndex={currentIndex}
        onPrev={handlePrev}
        onNext={handleNext}
        onSelectBatch={(id) => {
          setSelectedBatchId(id)
          setStatusError(null)
        }}
        onSelectSeries={onSelectSeries}
        onSelectBook={onSelectBook}
        onBackToBooks={onBackToBooks}
      />

      {batchesError ? (
        <div className="border-b border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-800">
          {batchesError}
        </div>
      ) : null}

      {!batchesLoading && !batchesError && batches.length === 0 ? (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
          No <code className="text-[11px]">batch_json</code> rows for{' '}
          <span className="font-semibold">{book.title}</span> (
          <span className="font-mono">{book.stableBookId ?? book.id}</span>). Confirm seed + Storage
          upload for this book.
        </div>
      ) : null}

      <div className="flex flex-1 overflow-hidden">
        <section
          aria-label="Unit JSON evidence"
          className="flex h-full w-1/3 min-w-[340px] max-w-[480px] shrink-0 flex-col"
        >
          <ValidationLeftPanel
            batch={currentBatch}
            summary={summary}
            loading={batchesLoading || jsonLoading}
            error={jsonError}
          />
        </section>

        <section
          id="right-validation-pane"
          aria-label="Source PDF and validation tools"
          className="relative flex h-full flex-1 flex-col overflow-hidden"
        >
          <div
            style={{ height: `${topPaneHeightPercent}%` }}
            className="overflow-hidden bg-slate-200/60 p-2 transition-all duration-75"
          >
            <ValidationPdfPane pdfUrl={pdfUrl} loading={pdfLoading} bookTitle={book.title} />
          </div>

          <div
            onMouseDown={(e) => {
              e.preventDefault()
              setIsDraggingSplitter(true)
            }}
            title="Drag to resize PDF and validation tools"
            className="z-20 flex h-2 shrink-0 cursor-row-resize items-center justify-center bg-slate-300 transition-colors hover:bg-indigo-400 active:bg-indigo-600 group"
          >
            <div className="h-1 w-10 rounded-full bg-slate-400 group-hover:bg-white" />
          </div>

          <div
            style={{ height: `${100 - topPaneHeightPercent}%` }}
            className="flex flex-col overflow-hidden transition-all duration-75"
          >
            <ValidationToolsPanel
              key={currentBatch?.id ?? 'none'}
              batch={currentBatch}
              saving={statusSaving}
              error={statusError}
              onSetStatus={handleSetStatus}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
