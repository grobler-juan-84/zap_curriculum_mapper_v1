import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { Book, CurriculumSeries } from '../../types/curriculum'
import type { BatchJsonSummary, BookFileBatch } from '../../types/validation'
import {
  findBatchForUnitNumber,
  listUnitsFromJson,
  sliceCanonicalByUnit,
  summarizeBatchJson,
  validationService,
} from '../../services/validationService'
import { chalkieGenerateService } from '../../services/chalkieGenerateService'
import { ValidationHeader } from '../validation/ValidationHeader'
import { ValidationPdfPane } from '../validation/ValidationPdfPane'
import { buildPageMap, pdfForPrinted } from '../validation/pdfPageMap'
import { buildUnitSummaryView, buildVisiblePagesView } from './chalkieEvidence'
import { ChalkieLeftPanel } from './ChalkieLeftPanel'
import { ChalkieOutputPanel, type ChalkieGeneratedOutput } from './ChalkieOutputPanel'

interface ChalkieWorkspaceProps {
  seriesList: CurriculumSeries[]
  series: CurriculumSeries
  book: Book
  onSelectSeries: (seriesId: string) => void
  onSelectBook: (bookUuid: string) => void
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
      bookUuid: canonical.bookUuid,
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

export const ChalkieWorkspace: React.FC<ChalkieWorkspaceProps> = ({
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

  const [canonicalRaw, setCanonicalRaw] = useState<unknown | null>(null)
  const [fromCanonical, setFromCanonical] = useState(false)

  const [summary, setSummary] = useState<BatchJsonSummary | null>(null)
  const [jsonLoading, setJsonLoading] = useState(false)
  const [jsonError, setJsonError] = useState<string | null>(null)

  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfProvider, setPdfProvider] = useState<'r2' | 'supabase' | null>(null)
  const [pdfLoading, setPdfLoading] = useState(true)

  const [visiblePrintedPages, setVisiblePrintedPages] = useState<number[]>([])

  const [generating, setGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [generated, setGenerated] = useState<ChalkieGeneratedOutput | null>(null)

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

  const pageMap = useMemo(() => buildPageMap(summary?.pages ?? []), [summary])

  const pdfInitialPage = useMemo(() => {
    const unit = summary?.units[0]
    if (!unit) return null
    if (typeof unit.pdfPageStart === 'number') return unit.pdfPageStart
    if (typeof unit.printedPageStart === 'number') {
      return pdfForPrinted(pageMap, unit.printedPageStart)
    }
    return null
  }, [summary, pageMap])

  const handleVisiblePrintedPagesChange = useCallback((pages: number[]) => {
    setVisiblePrintedPages(pages)
  }, [])

  const unitView = useMemo(
    () => (summary ? buildUnitSummaryView(summary) : null),
    [summary],
  )
  const visibleView = useMemo(
    () => buildVisiblePagesView(summary, visiblePrintedPages),
    [summary, visiblePrintedPages],
  )

  const canGenerate = Boolean(
    summary && unitView && visiblePrintedPages.length > 0 && !jsonLoading && !batchesLoading,
  )
  const disabledReason = !summary
    ? 'Select a unit with Phase 1 evidence first.'
    : visiblePrintedPages.length === 0
      ? 'Navigate the PDF so a printed-page spread is visible.'
      : null

  const handleGenerate = useCallback(async () => {
    if (!summary || !unitView || visiblePrintedPages.length === 0) return
    setGenerating(true)
    setGenerateError(null)
    try {
      const unitVocabulary = summary.vocabulary
        .map((v) => v.term?.trim())
        .filter((t): t is string => Boolean(t))
      const unitLanguage = summary.language
        .map((item) => {
          const q = item.prompt?.trim()
          const a = item.response?.trim()
          if (q && a) return `${q} → ${a}`
          return q || a || ''
        })
        .filter(Boolean)
      const unitActivities = summary.activities
        .map((a) => a.title?.trim() || a.activityType?.trim() || '')
        .filter(Boolean)

      const result = await chalkieGenerateService.generate({
        bookTitle: book.title,
        catalogBookId: book.catalogBookId ?? summary.catalogBookId,
        series: summary.series ?? series.name,
        unitLabel: unitView.unitLabel,
        unitTheme: unitView.theme,
        unitPageRange: unitView.pageRange,
        learningFocus: unitView.learningFocus,
        visiblePrintedPages,
        unitVocabulary,
        unitLanguage,
        unitActivities,
        visiblePageLabels: visibleView.pageLabels,
        visibleVocabulary: visibleView.vocabulary,
        visibleLanguage: visibleView.languageLines,
        visibleActivities: visibleView.activityLines,
      })
      setGenerated({
        lessonTopic: result.lessonTopic,
        chalkiePrompt: result.chalkiePrompt,
        vocabularyCsv: result.vocabularyCsv,
      })
    } catch (err: unknown) {
      setGenerateError(err instanceof Error ? err.message : 'Generate failed.')
    } finally {
      setGenerating(false)
    }
  }, [
    summary,
    unitView,
    visiblePrintedPages,
    visibleView,
    book.title,
    book.catalogBookId,
    series.name,
  ])

  useEffect(() => {
    let cancelled = false
    setBatchesLoading(true)
    setBatchesError(null)
    setSelectedBatchId('')
    setSummary(null)
    setCanonicalRaw(null)
    setFromCanonical(false)
    setBatches([])
    setVisiblePrintedPages([])
    setGenerated(null)
    setGenerateError(null)

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
        setPdfUrl(signed.url)
        setPdfProvider(signed.provider)
      } catch (err) {
        if (cancelled) return
        console.error('[chalkie] PDF load failed:', err instanceof Error ? err.message : err)
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
    setGenerated(null)
    setGenerateError(null)
  }, [selectedBatchId])

  useEffect(() => {
    if (!currentBatch) {
      setSummary(null)
      setJsonError(null)
      setVisiblePrintedPages([])
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
    }
  }, [batches, currentIndex])

  const handleNext = useCallback(() => {
    if (currentIndex < batches.length - 1) {
      setSelectedBatchId(batches[currentIndex + 1].id)
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
      const pane = document.getElementById('chalkie-right-pane')
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
      const row = document.getElementById('chalkie-split-row')
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
        onSelectBatch={setSelectedBatchId}
        onSelectSeries={onSelectSeries}
        onSelectBook={onSelectBook}
        onBackToBooks={onBackToBooks}
        showVerificationStatus={false}
      />

      {batchesError ? (
        <div className="border-b border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-800">
          {batchesError}
        </div>
      ) : null}

      {!batchesLoading && !batchesError && batches.length === 0 ? (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
          No curriculum JSON for <span className="font-semibold">{book.title}</span>. Load canonical
          or batch JSON in Storage before using Chalkie Workspace.
        </div>
      ) : null}

      <div id="chalkie-split-row" className="flex flex-1 overflow-hidden">
        <section
          aria-label="Chalkie context summaries"
          style={{ width: `${leftPaneWidthPercent}%` }}
          className="flex h-full shrink-0 flex-col overflow-hidden"
        >
          <ChalkieLeftPanel
            batch={currentBatch}
            summary={summary}
            visiblePrintedPages={visiblePrintedPages}
            loading={batchesLoading || jsonLoading}
            error={jsonError}
          />
        </section>

        <div
          onMouseDown={(e) => {
            e.preventDefault()
            setIsDraggingColSplitter(true)
          }}
          title="Drag to resize context and PDF panels"
          className="z-20 flex w-2 shrink-0 cursor-col-resize items-center justify-center bg-slate-300 transition-colors hover:bg-indigo-400 active:bg-indigo-600 group"
        >
          <div className="h-10 w-1 rounded-full bg-slate-400 group-hover:bg-white" />
        </div>

        <section
          id="chalkie-right-pane"
          aria-label="Source PDF and Chalkie prompt"
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
              pageMap={pageMap}
              onVisiblePrintedPagesChange={handleVisiblePrintedPagesChange}
            />
          </div>

          <div
            onMouseDown={(e) => {
              e.preventDefault()
              setIsDraggingRowSplitter(true)
            }}
            title="Drag to resize PDF and prompt panel"
            className="z-20 flex h-2 shrink-0 cursor-row-resize items-center justify-center bg-slate-300 transition-colors hover:bg-indigo-400 active:bg-indigo-600 group"
          >
            <div className="h-1 w-10 rounded-full bg-slate-400 group-hover:bg-white" />
          </div>

          <div
            style={{ height: `${100 - topPaneHeightPercent}%` }}
            className="flex flex-col overflow-hidden transition-all duration-75"
          >
            <ChalkieOutputPanel
              canGenerate={canGenerate}
              generating={generating}
              error={generateError}
              output={generated}
              disabledReason={disabledReason}
              onGenerate={handleGenerate}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
