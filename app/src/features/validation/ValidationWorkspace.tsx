import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import type { Book, CurriculumSeries } from '../../types/curriculum'
import type { BatchJsonSummary, BookFileBatch, BookFileStatus } from '../../types/validation'
import {
  findBatchForUnitNumber,
  listUnitsFromJson,
  sliceCanonicalByUnit,
  summarizeBatchJson,
  validationService,
} from '../../services/validationService'
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

function buildCanonicalUnitNav(
  canonical: BookFileBatch,
  raw: unknown,
  allFiles: BookFileBatch[],
): BookFileBatch[] {
  return listUnitsFromJson(raw).map((unit) => {
    const matching = findBatchForUnitNumber(allFiles, unit.unitNumber)
    const titleSuffix = unit.title ? `: ${unit.title}` : ''
    return {
      id: `canonical-unit:${canonical.id}:${unit.unitNumber}`,
      bookId: canonical.bookId,
      fileType: 'canonical_json',
      bucket: canonical.bucket,
      storagePath: canonical.storagePath,
      filename: canonical.filename,
      label: `Unit ${unit.unitNumber}${titleSuffix}`,
      status: matching?.status ?? null,
      mimeType: canonical.mimeType,
      fileSize: canonical.fileSize,
      statusTargetId: matching?.id ?? null,
      unitNumber: unit.unitNumber,
      unitId: unit.unitId ?? null,
    }
  })
}

export const ValidationWorkspace: React.FC<ValidationWorkspaceProps> = ({
  seriesList,
  series,
  book,
  onSelectSeries,
  onSelectBook,
  onBackToBooks,
}) => {
  const { profile } = useAuth()
  const canWriteStatus = profile?.role === 'admin'

  /** Items shown in the unit picker (virtual units from canonical, or real batches). */
  const [batches, setBatches] = useState<BookFileBatch[]>([])
  const [selectedBatchId, setSelectedBatchId] = useState('')
  const [batchesLoading, setBatchesLoading] = useState(true)
  const [batchesError, setBatchesError] = useState<string | null>(null)

  const [canonicalRaw, setCanonicalRaw] = useState<unknown | null>(null)
  const [fromCanonical, setFromCanonical] = useState(false)

  const [summary, setSummary] = useState<BatchJsonSummary | null>(null)
  const [jsonLoading, setJsonLoading] = useState(false)
  const [jsonError, setJsonError] = useState<string | null>(null)

  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfProvider, setPdfProvider] = useState<'r2' | 'supabase' | null>(null)
  const [pdfLoading, setPdfLoading] = useState(true)

  const [statusSaving, setStatusSaving] = useState(false)
  const [statusError, setStatusError] = useState<string | null>(null)

  const [topPaneHeightPercent, setTopPaneHeightPercent] = useState(62)
  const [isDraggingRowSplitter, setIsDraggingRowSplitter] = useState(false)
  const [leftPaneWidthPercent, setLeftPaneWidthPercent] = useState(33)
  const [isDraggingColSplitter, setIsDraggingColSplitter] = useState(false)

  const currentIndex = Math.max(
    0,
    batches.findIndex((batch) => batch.id === selectedBatchId),
  )
  const currentBatch =
    batches.find((batch) => batch.id === selectedBatchId) ?? batches[0] ?? null

  const pdfInitialPage =
    summary?.units.find((unit) => typeof unit.printedPageStart === 'number')?.printedPageStart ??
    null

  const statusBatch = useMemo(() => {
    if (!currentBatch) return null
    if (currentBatch.statusTargetId) {
      return {
        ...currentBatch,
        id: currentBatch.statusTargetId,
      }
    }
    if (fromCanonical && !currentBatch.statusTargetId) {
      return null
    }
    return currentBatch
  }, [currentBatch, fromCanonical])

  useEffect(() => {
    let cancelled = false
    setBatchesLoading(true)
    setBatchesError(null)
    setSelectedBatchId('')
    setSummary(null)
    setCanonicalRaw(null)
    setFromCanonical(false)
    setBatches([])

    ;(async () => {
      try {
        const rows = await validationService.listValidationFiles(book.id)
        if (cancelled) return

        const canonical = rows.find((row) => row.fileType === 'canonical_json')
        if (canonical) {
          setJsonLoading(true)
          const raw = await validationService.downloadJson(canonical)
          if (cancelled) return
          const nav = buildCanonicalUnitNav(canonical, raw, rows)
          setCanonicalRaw(raw)
          setFromCanonical(true)
          setBatches(nav)
          setSelectedBatchId(nav[0]?.id ?? '')
          setBatchesLoading(false)
          setJsonLoading(false)
          return
        }

        const unitBatches = rows.filter((row) => row.fileType === 'batch_json')
        setFromCanonical(false)
        setCanonicalRaw(null)
        setBatches(unitBatches)
        setSelectedBatchId(unitBatches[0]?.id ?? '')
        setBatchesLoading(false)
      } catch (err: unknown) {
        if (cancelled) return
        setBatches([])
        setBatchesLoading(false)
        setJsonLoading(false)
        setBatchesError(err instanceof Error ? err.message : 'Failed to load unit batches.')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [book.id])

  useEffect(() => {
    let cancelled = false
    let objectUrlToRevoke: string | null = null
    setPdfLoading(true)
    setPdfUrl(null)
    setPdfProvider(null)

    ;(async () => {
      try {
        const pdf = await validationService.findSourcePdf(book.id)
        if (cancelled) return
        if (!pdf) {
          setPdfUrl(null)
          setPdfProvider(null)
          return
        }
        const signed = await validationService.createSignedPdfUrl(pdf)
        if (cancelled) {
          if (signed?.url.startsWith('blob:')) URL.revokeObjectURL(signed.url)
          return
        }
        if (!signed) {
          setPdfUrl(null)
          setPdfProvider(null)
          return
        }
        if (signed.url.startsWith('blob:')) objectUrlToRevoke = signed.url
        console.info(
          `[validation] PDF provider=${signed.provider} delivery=${signed.url.startsWith('blob:') ? 'proxy' : 'signed-url'} book=${book.stableBookId ?? book.id} path=${pdf.storagePath}`,
        )
        setPdfUrl(signed.url)
        setPdfProvider(signed.provider)
      } catch (err) {
        if (cancelled) return
        console.error('[validation] PDF load failed:', err instanceof Error ? err.message : err)
        setPdfUrl(null)
        setPdfProvider(null)
      } finally {
        if (!cancelled) setPdfLoading(false)
      }
    })()

    return () => {
      cancelled = true
      if (objectUrlToRevoke) URL.revokeObjectURL(objectUrlToRevoke)
    }
  }, [book.id])

  useEffect(() => {
    if (!currentBatch) {
      setSummary(null)
      setJsonError(null)
      return
    }

    if (fromCanonical && canonicalRaw != null) {
      setJsonLoading(true)
      setJsonError(null)
      try {
        const sliced = sliceCanonicalByUnit(canonicalRaw, {
          unitId: currentBatch.unitId ?? undefined,
          unitNumber: currentBatch.unitNumber ?? undefined,
        })
        setSummary(summarizeBatchJson(sliced))
        setJsonLoading(false)
      } catch (err: unknown) {
        setSummary(null)
        setJsonLoading(false)
        setJsonError(err instanceof Error ? err.message : 'Failed to slice canonical JSON.')
      }
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
  }, [currentBatch, fromCanonical, canonicalRaw])

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
      if (!isDraggingRowSplitter) return
      const pane = document.getElementById('right-validation-pane')
      if (!pane) return
      const rect = pane.getBoundingClientRect()
      const relativeY = e.clientY - rect.top
      const newPercent = (relativeY / rect.height) * 100
      if (newPercent >= 30 && newPercent <= 75) {
        setTopPaneHeightPercent(newPercent)
      }
    }
    const handleMouseUp = () => setIsDraggingRowSplitter(false)

    if (isDraggingRowSplitter) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDraggingRowSplitter])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingColSplitter) return
      const row = document.getElementById('validation-split-row')
      if (!row) return
      const rect = row.getBoundingClientRect()
      const relativeX = e.clientX - rect.left
      const newPercent = (relativeX / rect.width) * 100
      if (newPercent >= 22 && newPercent <= 50) {
        setLeftPaneWidthPercent(newPercent)
      }
    }
    const handleMouseUp = () => setIsDraggingColSplitter(false)

    if (isDraggingColSplitter) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDraggingColSplitter])

  const handleSetStatus = async (status: BookFileStatus) => {
    const targetId = currentBatch?.statusTargetId ?? (fromCanonical ? null : currentBatch?.id)
    if (!targetId || !currentBatch) {
      setStatusError(
        fromCanonical
          ? 'No matching unit batch_json row to update for this canonical unit.'
          : 'No unit batch selected.',
      )
      return
    }
    setStatusSaving(true)
    setStatusError(null)
    try {
      await validationService.updateBatchStatus(targetId, status)
      setBatches((prev) =>
        prev.map((batch) =>
          batch.id === currentBatch.id || batch.statusTargetId === targetId
            ? { ...batch, status }
            : batch,
        ),
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
        fromCanonical={fromCanonical}
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
          No <code className="text-[11px]">batch_json</code> or{' '}
          <code className="text-[11px]">canonical_json</code> rows for{' '}
          <span className="font-semibold">{book.title}</span> (
          <span className="font-mono">{book.stableBookId ?? book.id}</span>). Confirm seed + Storage
          upload for this book.
        </div>
      ) : null}

      <div id="validation-split-row" className="flex flex-1 overflow-hidden">
        <section
          aria-label="Unit JSON evidence"
          style={{ width: `${leftPaneWidthPercent}%` }}
          className="flex h-full shrink-0 flex-col overflow-hidden"
        >
          <ValidationLeftPanel
            batch={currentBatch}
            summary={summary}
            loading={batchesLoading || jsonLoading}
            error={jsonError}
          />
        </section>

        <div
          onMouseDown={(e) => {
            e.preventDefault()
            setIsDraggingColSplitter(true)
          }}
          title="Drag to resize evidence and PDF panels"
          className="z-20 flex w-2 shrink-0 cursor-col-resize items-center justify-center bg-slate-300 transition-colors hover:bg-indigo-400 active:bg-indigo-600 group"
        >
          <div className="h-10 w-1 rounded-full bg-slate-400 group-hover:bg-white" />
        </div>

        <section
          id="right-validation-pane"
          aria-label="Source PDF and validation tools"
          className="relative flex h-full flex-1 flex-col overflow-hidden"
        >
          <div
            style={{ height: `${topPaneHeightPercent}%` }}
            className="overflow-hidden bg-slate-200/60 p-2 transition-all duration-75"
          >
            <ValidationPdfPane
              pdfUrl={pdfUrl}
              loading={pdfLoading}
              bookTitle={book.title}
              pdfProvider={pdfProvider}
              initialPage={pdfInitialPage}
            />
          </div>

          <div
            onMouseDown={(e) => {
              e.preventDefault()
              setIsDraggingRowSplitter(true)
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
              batch={statusBatch}
              saving={statusSaving}
              error={statusError}
              canWriteStatus={canWriteStatus && Boolean(statusBatch)}
              onSetStatus={handleSetStatus}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
