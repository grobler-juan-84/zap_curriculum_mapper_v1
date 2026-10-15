import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { curriculumService } from '../../services/curriculumService'
import {
  listUnitsFromJson,
  summarizeBatchJson,
  validationService,
} from '../../services/validationService'
import type {
  BookIntelligenceOverviewDocument,
  BookIntelligenceUnitOverview,
} from '../../types/bookIntelligence'
import { useWorkspace } from '../shell/WorkspaceProvider'
import {
  ValidationPdfPane,
  type PdfVisibleRange,
} from '../validation/ValidationPdfPane'
import { buildPageMap } from '../validation/pdfPageMap'
import {
  DEFAULT_BOOK_INTELLIGENCE_CATALOG_BOOK_ID,
  getBookIntelligenceStorageArtifact,
} from './bookIntelligenceStorageRegistry'
import { BookIntelligenceUnitPreview } from './BookIntelligenceUnitPreview'
import { loadBookIntelligenceFromStorage } from './loadBookIntelligenceFromStorage'
import { phase1EvidencePath } from './phase1EvidenceLink'
import {
  resolvePdfInitialPage,
  type Phase1UnitPages,
} from './resolvePdfInitialPage'
import {
  resolvePdfPageEnd,
  resolveUnitForVisiblePdfPages,
} from './syncUnitFromPdfPages'

const UNIT_QUERY_KEY = 'unit'
const DEFAULT_LEFT_PANE_PERCENT = 38

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; errors: string[] }
  | { status: 'ready'; data: BookIntelligenceOverviewDocument }

/**
 * Resolve BI unit from `?unit=` only. Never fall back to Unit 1 when the param
 * is missing — that raced review-gap URL clears and yanked the PDF to U1.
 */
function resolveUnit(
  units: BookIntelligenceUnitOverview[],
  unitParam: string | null,
): BookIntelligenceUnitOverview | null {
  if (units.length === 0 || !unitParam) return null
  return units.find((unit) => unit.unitNumber === unitParam) ?? null
}

/**
 * Read-only Book Intelligence preview for a catalog book.
 * Loads verified Phase 2 JSON from Supabase Storage via the draft-contract loader.
 * Selected unit is URL-addressable via `?unit={unitNumber}` (e.g. `?unit=5`).
 * Split layout mirrors Validation: BI fields left, source PDF right.
 */
export function BookIntelligencePreviewPage() {
  const navigate = useNavigate()
  const { selectSeries, selectBook, catalogLoading } = useWorkspace()
  const { catalogBookId: routeCatalogBookId } = useParams<{
    catalogBookId?: string
  }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const catalogBookId =
    routeCatalogBookId?.trim() || DEFAULT_BOOK_INTELLIGENCE_CATALOG_BOOK_ID
  const artifact = getBookIntelligenceStorageArtifact(catalogBookId)
  const unitParam = searchParams.get(UNIT_QUERY_KEY)
  // Re-read after catalog load (WorkspaceProvider re-render when catalogLoading flips).
  const catalogMatch = curriculumService.getBookByCatalogId(catalogBookId)
  const book = catalogMatch?.book ?? null

  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [evidenceError, setEvidenceError] = useState<string | null>(null)

  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfProvider, setPdfProvider] = useState<'r2' | 'supabase' | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [phase1Units, setPhase1Units] = useState<Phase1UnitPages[]>([])
  const [pageMapEntries, setPageMapEntries] = useState<
    Array<{ printedPage?: number | null; pdfPage?: number | null }>
  >([])

  const [leftPaneWidthPercent, setLeftPaneWidthPercent] = useState(
    DEFAULT_LEFT_PANE_PERCENT,
  )
  const [isDraggingColSplitter, setIsDraggingColSplitter] = useState(false)
  /** When PDF is on inter-unit review/checkpoint pages with no BI unit. */
  const [pdfOutsideUnits, setPdfOutsideUnits] = useState(false)
  /**
   * When false, PDF-driven unit changes must not apply `initialPage` jumps
   * (avoids yanking back to a stale/default unit start after a review gap).
   * Tab clicks and first URL default set this true.
   */
  const [allowPdfUnitJump, setAllowPdfUnitJump] = useState(true)

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })

    const registered = getBookIntelligenceStorageArtifact(catalogBookId)
    if (!registered) {
      setState({
        status: 'error',
        errors: [
          `No Book Intelligence overview is available yet for ${catalogBookId}.`,
        ],
      })
      return
    }

    void (async () => {
      const result = await loadBookIntelligenceFromStorage(catalogBookId)
      if (cancelled) return
      if (!result.ok) {
        setState({ status: 'error', errors: result.errors })
        return
      }
      setState({ status: 'ready', data: result.data })
    })()

    return () => {
      cancelled = true
    }
  }, [catalogBookId])

  // Source PDF + Phase 1 page targeting (same services as Validation; read-only).
  // Load page meta before exposing pdfUrl so the first paint can jump to the unit.
  useEffect(() => {
    let cancelled = false
    let objectUrlToRevoke: string | null = null
    setPdfUrl(null)
    setPdfProvider(null)
    setPhase1Units([])
    setPageMapEntries([])

    if (catalogLoading) {
      setPdfLoading(true)
      return
    }

    if (!book?.id) {
      setPdfLoading(false)
      return
    }

    setPdfLoading(true)

    void (async () => {
      try {
        const [pdf, files] = await Promise.all([
          validationService.findSourcePdf(book.id),
          validationService.listValidationFiles(book.id),
        ])
        if (cancelled) return

        const canonical = files.find((row) => row.fileType === 'canonical_json')
        if (canonical) {
          try {
            const raw = await validationService.downloadJson(canonical)
            if (cancelled) return
            setPhase1Units(
              listUnitsFromJson(raw).map((unit) => ({
                unitNumber: unit.unitNumber,
                printedPageStart: unit.printedPageStart,
                printedPageEnd: unit.printedPageEnd,
                pdfPageStart: unit.pdfPageStart,
                pdfPageEnd: unit.pdfPageEnd,
              })),
            )
            const summary = summarizeBatchJson(raw)
            setPageMapEntries(summary.pages)
          } catch {
            if (!cancelled) {
              setPhase1Units([])
              setPageMapEntries([])
            }
          }
        }

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
        console.error(
          '[book-intelligence] PDF load failed:',
          err instanceof Error ? err.message : err,
        )
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
  }, [book?.id, catalogLoading])

  useEffect(() => {
    if (!isDraggingColSplitter) return
    const handleMouseMove = (e: MouseEvent) => {
      const row = document.getElementById('bi-split-row')
      if (!row) return
      const rect = row.getBoundingClientRect()
      const relativeX = e.clientX - rect.left
      const newPercent = (relativeX / rect.width) * 100
      if (newPercent >= 24 && newPercent <= 55) {
        setLeftPaneWidthPercent(newPercent)
      }
    }
    const handleMouseUp = () => setIsDraggingColSplitter(false)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDraggingColSplitter])

  const selectedUnit =
    state.status === 'ready' && !pdfOutsideUnits
      ? resolveUnit(state.data.units, unitParam)
      : null

  // Default `?unit=` only on first entry (never after a review-gap clear / PDF sync).
  useEffect(() => {
    if (state.status !== 'ready' || pdfOutsideUnits) return
    if (unitParam || !allowPdfUnitJump) return
    const first = state.data.units[0]
    if (!first) return
    const next = new URLSearchParams(searchParams)
    next.set(UNIT_QUERY_KEY, first.unitNumber)
    setSearchParams(next, { replace: true })
  }, [
    state,
    unitParam,
    pdfOutsideUnits,
    allowPdfUnitJump,
    searchParams,
    setSearchParams,
  ])

  const pageMap = useMemo(
    () => buildPageMap(pageMapEntries),
    [pageMapEntries],
  )

  // Keep Document mounted across unit changes (no React key remount) — same as
  // ValidationWorkspace. Suppress jumps for PDF-driven unit sync after gaps.
  const pdfInitialPage = useMemo(() => {
    if (pdfOutsideUnits || !allowPdfUnitJump) return null
    return resolvePdfInitialPage(
      selectedUnit?.unitNumber,
      selectedUnit?.printedPageStart,
      phase1Units,
      pageMap,
    )
  }, [
    selectedUnit,
    phase1Units,
    pageMap,
    pdfOutsideUnits,
    allowPdfUnitJump,
  ])

  const pdfInitialPageEnd = useMemo(() => {
    if (pdfOutsideUnits || !allowPdfUnitJump) return null
    return resolvePdfPageEnd(selectedUnit?.unitNumber, phase1Units)
  }, [selectedUnit, phase1Units, pdfOutsideUnits, allowPdfUnitJump])

  function selectUnit(unitNumber: string) {
    setPdfOutsideUnits(false)
    setAllowPdfUnitJump(true)
    const next = new URLSearchParams(searchParams)
    next.set(UNIT_QUERY_KEY, unitNumber)
    setSearchParams(next, { replace: true })
  }

  const handleVisiblePdfRange = useCallback(
    (range: PdfVisibleRange) => {
      if (phase1Units.length === 0) return
      const matched = resolveUnitForVisiblePdfPages(range, phase1Units)
      if (matched == null) {
        // Keep prior `?unit=` — clearing it used to fall back to Unit 1 and
        // jump the PDF to page 4 when leaving Review 1 toward Unit 4.
        setPdfOutsideUnits(true)
        return
      }
      setPdfOutsideUnits(false)
      // PDF already shows the right pages — do not apply unit-start jumps.
      setAllowPdfUnitJump(false)
      if (unitParam === matched) return
      const next = new URLSearchParams(searchParams)
      next.set(UNIT_QUERY_KEY, matched)
      setSearchParams(next, { replace: true })
    },
    [phase1Units, unitParam, searchParams, setSearchParams],
  )

  function openPhase1Evidence(unitNumber: string) {
    setEvidenceError(null)
    const match = curriculumService.getBookByCatalogId(catalogBookId)
    if (!match) {
      setEvidenceError(
        `Could not find catalog book ${catalogBookId} to open Phase 1 evidence.`,
      )
      return
    }
    selectSeries(match.series.id)
    selectBook(match.book.id)
    navigate(phase1EvidencePath(unitNumber))
  }

  if (state.status === 'loading') {
    return (
      <div className="flex h-full flex-col overflow-auto bg-slate-50">
        <PreviewChrome catalogBookId={catalogBookId} />
        <div className="mx-auto w-full max-w-3xl px-6 py-8">
          <p className="text-sm text-slate-600">
            Loading Book Intelligence from Supabase Storage…
          </p>
          {artifact ? (
            <p className="mt-2 font-mono text-[11px] text-slate-400">
              {artifact.bucket}/{artifact.storagePath}
            </p>
          ) : null}
        </div>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="flex h-full flex-col overflow-auto bg-slate-50">
        <PreviewChrome catalogBookId={catalogBookId} />
        <div className="mx-auto w-full max-w-3xl px-6 py-8">
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            <p className="font-semibold">Failed to load Book Intelligence JSON</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
              {state.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  const { data } = state
  const bookTitle = book?.title ?? data.title ?? catalogBookId

  return (
    <div className="flex h-full select-none flex-col overflow-hidden bg-slate-100">
      <header className="shrink-0 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-wide text-indigo-600 uppercase">
              Phase 2 · Experimental
            </p>
            <h1 className="mt-0.5 text-base font-semibold tracking-tight text-slate-900">
              Book Intelligence Preview
            </h1>
            <p className="mt-1 max-w-2xl text-xs text-slate-500">
              Nine-column A+B overview from Supabase Storage. Left: unit fields
              (synced to the visible PDF pages). Right: source PDF. URL via{' '}
              <code className="text-[10px]">?unit=</code>. Not Phase 1 evidence.
            </p>
          </div>
          <Link
            to="/app/series"
            className="shrink-0 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Back to series library
          </Link>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
            {data.columnSet}
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600">
            {data.catalogBookId}
            {data.registryId ? ` · ${data.registryId}` : ''}
          </span>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
            Storage · {data.units.length} units
          </span>
        </div>
        {data.units.length > 0 ? (
          <div className="mt-3">
            <label className="mb-1.5 block text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
              Unit
            </label>
            <div
              role="tablist"
              aria-label="Select unit"
              className="flex flex-wrap gap-1.5"
            >
              {data.units.map((unit) => {
                const isSelected =
                  !pdfOutsideUnits && unit.unitId === selectedUnit?.unitId
                return (
                  <button
                    key={unit.unitId}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => selectUnit(unit.unitNumber)}
                    className={`rounded border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-800'
                    }`}
                    title={`Unit ${unit.unitNumber}: ${unit.title}`}
                  >
                    U{unit.unitNumber}
                    <span className="ml-1.5 hidden sm:inline font-normal opacity-90">
                      {unit.title}
                    </span>
                  </button>
                )
              })}
            </div>
            {pdfOutsideUnits ? (
              <p className="mt-2 text-[11px] font-medium text-amber-800">
                Viewing pages outside extracted units (review / checkpoint).
              </p>
            ) : null}
          </div>
        ) : null}
      </header>

      {evidenceError ? (
        <div className="shrink-0 border-b border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-900">
          {evidenceError}
        </div>
      ) : null}

      <div id="bi-split-row" className="flex min-h-0 flex-1 overflow-hidden">
        <section
          aria-label="Book Intelligence unit fields"
          style={{ width: `${leftPaneWidthPercent}%` }}
          className="flex h-full shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-slate-50"
        >
          <div className="min-h-0 flex-1 overflow-auto p-3">
            {data.title ? (
              <p className="mb-2 text-xs font-medium text-slate-600">
                {data.title}
              </p>
            ) : null}
            {pdfOutsideUnits ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-6 text-center">
                <p className="text-sm font-semibold text-amber-950">
                  No Book Intelligence available for these pages.
                </p>
                <p className="mt-2 text-xs leading-relaxed text-amber-900/80">
                  These PDF pages fall outside extracted unit ranges (for example
                  inter-unit reviews or checkpoints). Continue browsing the PDF,
                  or select a unit above.
                </p>
              </div>
            ) : selectedUnit ? (
              <BookIntelligenceUnitPreview
                document={data}
                unit={selectedUnit}
                onViewSourceEvidence={openPhase1Evidence}
              />
            ) : (
              <p className="text-sm text-slate-600">No units in document.</p>
            )}
            {data.notes && !pdfOutsideUnits ? (
              <p className="mt-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-[11px] leading-relaxed text-slate-500">
                {data.notes}
              </p>
            ) : null}
          </div>
        </section>

        <div
          onMouseDown={(e) => {
            e.preventDefault()
            setIsDraggingColSplitter(true)
          }}
          title="Drag to resize Book Intelligence and PDF panels"
          className="z-20 flex w-2 shrink-0 cursor-col-resize items-center justify-center bg-slate-300 transition-colors hover:bg-indigo-400 active:bg-indigo-600 group"
        >
          <div className="h-10 w-1 rounded-full bg-slate-400 group-hover:bg-white" />
        </div>

        <section
          aria-label="Source PDF for selected unit"
          className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-slate-200/60 p-2"
        >
          <ValidationPdfPane
            pdfUrl={pdfUrl}
            loading={pdfLoading || catalogLoading}
            bookTitle={bookTitle}
            pdfProvider={pdfProvider}
            initialPage={pdfInitialPage}
            initialPageEnd={pdfInitialPageEnd}
            pageMap={pageMap}
            onVisibleRangeChange={handleVisiblePdfRange}
          />
        </section>
      </div>
    </div>
  )
}

function PreviewChrome({ catalogBookId }: { catalogBookId: string }) {
  return (
    <div className="border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-sm font-semibold text-slate-900">
          Book Intelligence Preview
        </h1>
        <Link
          to="/app/series"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
        >
          Back to series library
        </Link>
      </div>
      <p className="mt-1 font-mono text-[11px] text-slate-400">{catalogBookId}</p>
    </div>
  )
}
