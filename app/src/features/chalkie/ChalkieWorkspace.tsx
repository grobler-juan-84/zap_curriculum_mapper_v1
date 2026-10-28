import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Book, CurriculumSeries } from '../../types/curriculum'
import type { BatchJsonSummary, BookFileBatch } from '../../types/validation'
import {
  findBatchForUnitNumber,
  listUnitsFromJson,
  sliceCanonicalByUnit,
  summarizeBatchJson,
  validationService,
} from '../../services/validationService'
import { curriculumService } from '../../services/curriculumService'
import { ValidationHeader } from '../validation/ValidationHeader'
import { ValidationPdfPane } from '../validation/ValidationPdfPane'
import {
  buildPageMap,
  exactPdfPagesForPrinted,
  pdfForPrinted,
} from '../validation/pdfPageMap'
import { chalkieCompanionRendererProps } from '../validation/pdfRendererSpread'
import type { BookIntelligenceOverviewDocument } from '../../types/bookIntelligence'
import {
  hasBookIntelligenceOverview,
} from '../book-intelligence/bookIntelligenceStorageRegistry'
import { loadBookIntelligenceFromStorage } from '../book-intelligence/loadBookIntelligenceFromStorage'
import {
  findScopeSequenceUnit,
  type CurriculumAuthorityState,
  type ScopeSequenceDocument,
} from '../scope-sequence/scopeSequence'
import { loadScopeSequenceFromStorage } from '../scope-sequence/loadScopeSequenceFromStorage'
import { hasScopeSequenceAuthority } from '../scope-sequence/scopeSequenceStorageRegistry'
import {
  enterWorkbookPdfView,
  isStudentBook,
  lessonAnchorPrintedPages,
  resolveActiveLessonScope,
  restoreStudentBookPdfView,
  shouldApplyVisiblePagesFromPdf,
  studentBookDisplayTitle,
} from './chalkieStudentBookUi'
import { ChalkieLeftPanel } from './ChalkieLeftPanel'
import { ChalkieOutputPanel } from './ChalkieOutputPanel'
import { TeacherChoiceFlowOverlay } from './TeacherChoiceFlowOverlay'
import {
  resolveChalkieLessonContext,
  type ChalkieLessonContext,
} from './resolveChalkieLessonContext'
import {
  buildSbActivityCards,
  createDefaultSbActivitySelection,
  setSbActivityCardSelected,
  type SbActivitySelectionState,
} from './chalkieActivitySelection'
import {
  buildWbActivityCards,
  createDefaultWbActivitySelection,
  setWbActivityCardSelected,
  type WbActivitySelectionState,
} from './chalkieWorkbookActivitySelection'
import { buildCurrentLessonContext } from './currentLessonContext'
import {
  activityCardIdsKey,
  buildLessonActivitySelectionScopeKey,
  reconcileSbActivitySelection,
  reconcileWbActivitySelection,
} from './lessonActivitySelection'

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

function pickBatchIdForUnit(
  batches: BookFileBatch[],
  unitNumber: string | null,
): string {
  if (!unitNumber) return batches[0]?.id ?? ''
  const match =
    batches.find((batch) => batch.unitNumber === unitNumber) ??
    findBatchForUnitNumber(batches, unitNumber)
  return match?.id ?? batches[0]?.id ?? ''
}

function unitNumberFromBatch(batch: BookFileBatch | null): string | null {
  if (!batch) return null
  if (batch.unitNumber) return batch.unitNumber
  const fromLabel = batch.label?.match(/Unit\s+(\d+)/i)?.[1]
  if (fromLabel) return fromLabel
  const fromPath = batch.storagePath.match(/unit[_-]?(\d+)/i)?.[1]
  if (fromPath) return String(Number(fromPath))
  return null
}

export const ChalkieWorkspace: React.FC<ChalkieWorkspaceProps> = ({
  seriesList,
  series,
  book,
  onSelectSeries,
  onSelectBook,
  onBackToBooks,
}) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedUnit = searchParams.get('unit')

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

  /** Student Book visible pages — reading spread (never overwritten by WB viewer). */
  const [sbVisiblePrintedPages, setSbVisiblePrintedPages] = useState<number[]>([])
  /**
   * Printed page from Go / Prev / Next — lesson scope for one-page components
   * shown inside a two-page PDF reading spread.
   */
  const [activePrintedPage, setActivePrintedPage] = useState<number | null>(null)
  const [pdfViewMode, setPdfViewMode] = useState<'student_book' | 'workbook'>(
    'student_book',
  )
  const [frozenSbPrintedPages, setFrozenSbPrintedPages] = useState<number[] | null>(
    null,
  )
  /** Active lesson page frozen with the SB reading spread during Workbook view. */
  const [frozenActivePrintedPage, setFrozenActivePrintedPage] = useState<number | null>(
    null,
  )
  /** Full SB spread awaiting PDF confirmation after View Student Book. */
  const [pendingSbRestorePages, setPendingSbRestorePages] = useState<number[] | null>(
    null,
  )

  const [workbookSummary, setWorkbookSummary] = useState<BatchJsonSummary | null>(null)
  const [wbPdfUrl, setWbPdfUrl] = useState<string | null>(null)
  const [wbPdfProvider, setWbPdfProvider] = useState<'r2' | 'supabase' | null>(null)
  const [wbPdfLoading, setWbPdfLoading] = useState(false)

  const [bookIntelligence, setBookIntelligence] =
    useState<BookIntelligenceOverviewDocument | null>(null)
  const [bookIntelligenceLoading, setBookIntelligenceLoading] = useState(false)

  const [scopeSequence, setScopeSequence] =
    useState<ScopeSequenceDocument | null>(null)
  const [scopeSequenceBookId, setScopeSequenceBookId] = useState<string | null>(
    null,
  )
  const [scopeSequenceLoading, setScopeSequenceLoading] = useState(false)
  const [scopeSequenceError, setScopeSequenceError] = useState<string | null>(null)

  const [teacherChoiceOpen, setTeacherChoiceOpen] = useState(false)
  const [activeLesson, setActiveLesson] = useState<ChalkieLessonContext | null>(null)
  const [scopeGuard, setScopeGuard] = useState<ChalkieLessonContext | null>(null)
  /** Authoritative activity selection for left panel + Create-a-prompt. */
  const [sbActivitySelection, setSbActivitySelection] =
    useState<SbActivitySelectionState>(() => createDefaultSbActivitySelection([]))
  const [wbActivitySelection, setWbActivitySelection] =
    useState<WbActivitySelectionState>(() => createDefaultWbActivitySelection([]))
  const selectionScopeKeyRef = useRef('')
  const knownSbCardIdsRef = useRef<readonly string[]>([])
  const knownWbCardIdsRef = useRef<readonly string[]>([])
  const [pdfJumpRequest, setPdfJumpRequest] = useState<{
    pdfPage: number
    requestId: number
  } | null>(null)

  const [leftPaneWidthPercent, setLeftPaneWidthPercent] = useState(33)
  const [isDraggingColSplitter, setIsDraggingColSplitter] = useState(false)

  const currentIndex = Math.max(
    0,
    batches.findIndex((batch) => batch.id === selectedBatchId),
  )
  const currentBatch =
    batches.find((batch) => batch.id === selectedBatchId) ?? batches[0] ?? null
  const currentUnitNumber = unitNumberFromBatch(currentBatch)

  const curriculumAuthority = useMemo<CurriculumAuthorityState>(() => {
    if (!hasScopeSequenceAuthority(book.catalogBookId)) {
      return { status: 'not_configured' }
    }
    if (scopeSequenceBookId !== book.catalogBookId) {
      return { status: 'loading' }
    }
    if (scopeSequenceLoading) return { status: 'loading' }
    if (scopeSequenceError) {
      return { status: 'unavailable', message: scopeSequenceError }
    }
    if (!scopeSequence) {
      return {
        status: 'unavailable',
        message: 'Publisher Scope & Sequence is unavailable. Book evidence remains usable.',
      }
    }
    const unit = findScopeSequenceUnit(scopeSequence, currentUnitNumber)
    if (!unit) {
      return {
        status: 'unavailable',
        message: currentUnitNumber
          ? `No Scope & Sequence entry matched Unit ${currentUnitNumber}.`
          : 'Select a unit to view its publisher Scope & Sequence.',
      }
    }
    return { status: 'ready', document: scopeSequence, unit }
  }, [
    book.catalogBookId,
    currentUnitNumber,
    scopeSequence,
    scopeSequenceBookId,
    scopeSequenceError,
    scopeSequenceLoading,
  ])

  const pageMap = useMemo(() => buildPageMap(summary?.pages ?? []), [summary])
  const wbPageMap = useMemo(
    () => buildPageMap(workbookSummary?.pages ?? []),
    [workbookSummary],
  )

  const pdfInitialPage = useMemo(() => {
    const unit = summary?.units[0]
    if (!unit) return null
    if (typeof unit.pdfPageStart === 'number') return unit.pdfPageStart
    if (typeof unit.printedPageStart === 'number') {
      const exact = exactPdfPagesForPrinted(summary?.pages ?? [], [
        unit.printedPageStart,
      ])
      if (exact?.[0] != null) return exact[0]
      return pdfForPrinted(pageMap, unit.printedPageStart)
    }
    return null
  }, [summary, pageMap])

  /** Visible SB reading spread (may be two pages while lesson scope is one page). */
  const anchorSbPages = useMemo(
    () =>
      lessonAnchorPrintedPages({
        pdfViewMode,
        sbVisiblePrintedPages,
        frozenSbPrintedPages,
      }),
    [pdfViewMode, sbVisiblePrintedPages, frozenSbPrintedPages],
  )

  const effectiveActivePrintedPage =
    pdfViewMode === 'workbook' && frozenActivePrintedPage != null
      ? frozenActivePrintedPage
      : activePrintedPage

  const studentBookCanonical = useMemo(() => {
    if (fromCanonical && canonicalRaw && typeof canonicalRaw === 'object') {
      return canonicalRaw as Record<string, unknown>
    }
    if (summary?.raw && typeof summary.raw === 'object') {
      return summary.raw as Record<string, unknown>
    }
    return null
  }, [fromCanonical, canonicalRaw, summary?.raw])

  const activeLessonScope = useMemo(
    () =>
      resolveActiveLessonScope({
        studentBookCatalogId: book.catalogBookId,
        visiblePrintedPages: anchorSbPages,
        activePrintedPage: effectiveActivePrintedPage,
        studentBookCanonical,
      }),
    [
      book.catalogBookId,
      anchorSbPages,
      effectiveActivePrintedPage,
      studentBookCanonical,
    ],
  )

  const verifiedCompanion = activeLessonScope.companion
  /** Pages used for companion + Prepare Chalkie prompt (not merely the PDF reading pair). */
  const lessonScopePages = activeLessonScope.lessonPrintedPages

  const activeLessonPageLabel = useMemo(() => {
    if (
      activeLessonScope.scopeSource === 'exact_visible_spread' &&
      lessonScopePages.length > 1
    ) {
      const first = lessonScopePages[0]
      const last = lessonScopePages[lessonScopePages.length - 1]
      return `Active lesson pages: pp.${first}–${last}.`
    }
    const page =
      activeLessonScope.activePrintedPage ??
      (lessonScopePages.length === 1 ? lessonScopePages[0] : null)
    if (page != null) return `Active lesson page: p.${page}.`
    return null
  }, [activeLessonScope, lessonScopePages])

  /** Exact source pdf_page indices for the SB lesson spread (never printed-as-pdf). */
  const sbTargetPdfPages = useMemo(() => {
    const printed = pendingSbRestorePages?.length
      ? pendingSbRestorePages
      : anchorSbPages
    if (!printed.length) return null
    return exactPdfPagesForPrinted(summary?.pages ?? [], printed)
  }, [summary?.pages, pendingSbRestorePages, anchorSbPages])

  /** Exact source pdf_page indices for the verified WB companion pages. */
  const wbTargetPdfPages = useMemo(() => {
    if (!verifiedCompanion?.workbookPrintedPages.length) return null
    return exactPdfPagesForPrinted(
      workbookSummary?.pages ?? [],
      verifiedCompanion.workbookPrintedPages,
    )
  }, [workbookSummary?.pages, verifiedCompanion?.workbookPrintedPages])

  const pdfRendererProps = useMemo(
    () =>
      chalkieCompanionRendererProps({
        mode: pdfViewMode,
        sbPdfPages: sbTargetPdfPages,
        wbPdfPages: wbTargetPdfPages,
        pendingSbRestore: Boolean(pendingSbRestorePages?.length),
      }),
    [pdfViewMode, sbTargetPdfPages, wbTargetPdfPages, pendingSbRestorePages],
  )

  const handleVisiblePrintedPagesChange = useCallback(
    (pages: number[]) => {
      // Only Student Book view updates the reading spread (D021).
      // During restore, ignore one-page / partial reports that would drop the companion.
      if (
        !shouldApplyVisiblePagesFromPdf({
          pendingRestorePrintedPages: pendingSbRestorePages,
          reportedPages: pages,
        })
      ) {
        return
      }
      if (pendingSbRestorePages?.length) {
        setPendingSbRestorePages(null)
      }
      setSbVisiblePrintedPages(pages)
      // Keep Go-target active page when it still sits in the visible pair; else default left.
      setActivePrintedPage((current) => {
        if (pages.length === 0) return current
        if (current != null && pages.includes(current)) return current
        return Math.min(...pages)
      })
    },
    [pendingSbRestorePages],
  )

  const handleActivePrintedPageChange = useCallback((printedPage: number) => {
    if (!Number.isFinite(printedPage)) return
    setActivePrintedPage(Math.floor(printedPage))
  }, [])

  const liveLessonContext = useMemo(
    () =>
      resolveChalkieLessonContext({
        book,
        summary,
        visiblePrintedPages: lessonScopePages,
        unitNumber: currentBatch?.unitNumber ?? summary?.units[0]?.unitNumber ?? null,
      }),
    [book, summary, lessonScopePages, currentBatch?.unitNumber],
  )

  /**
   * Live curriculum context for the left panel — same verified activity builders
   * the Create-a-prompt modal uses, scoped to the current PDF lesson pages.
   */
  const liveCurrentLesson = useMemo(
    () =>
      buildCurrentLessonContext({
        summary,
        sbPrintedPages: lessonScopePages,
        workbookSummary,
        workbookCompanion: verifiedCompanion,
        bookIntelligence,
        bookIntelligenceLoading,
        unitNumber:
          currentBatch?.unitNumber ?? summary?.units[0]?.unitNumber ?? null,
      }),
    [
      summary,
      lessonScopePages,
      workbookSummary,
      verifiedCompanion,
      bookIntelligence,
      bookIntelligenceLoading,
      currentBatch?.unitNumber,
    ],
  )

  /**
   * Modal cards freeze to the prepared lesson scope so selection matches what
   * the teacher confirmed at Create-a-prompt time (same builders as left panel).
   */
  const activeLessonActivityCards = useMemo(
    () =>
      buildSbActivityCards({
        summary,
        activeLessonPrintedPages: activeLesson?.visiblePrintedPages ?? [],
      }),
    [summary, activeLesson],
  )
  const activeLessonWorkbookActivityCards = useMemo(
    () =>
      buildWbActivityCards({
        summary: workbookSummary,
        companion: activeLesson?.workbookCompanion ?? null,
      }),
    [workbookSummary, activeLesson],
  )

  const liveSbActivityCards = liveCurrentLesson.bookContent.sbActivities
  const liveWbActivityCards = liveCurrentLesson.bookContent.wbActivities

  /**
   * While Create-a-prompt is open, selection stays keyed to the frozen prepared
   * lesson so PDF navigation cannot leak a different scope into the handoff.
   */
  const selectionSbCards =
    teacherChoiceOpen && activeLesson ? activeLessonActivityCards : liveSbActivityCards
  const selectionWbCards =
    teacherChoiceOpen && activeLesson
      ? activeLessonWorkbookActivityCards
      : liveWbActivityCards

  const liveSelectionScopeKey = useMemo(
    () =>
      buildLessonActivitySelectionScopeKey({
        catalogBookId: book.catalogBookId,
        unitNumber: currentBatch?.unitNumber ?? summary?.units[0]?.unitNumber ?? null,
        sbPrintedPages: lessonScopePages,
        companionRelationshipId: verifiedCompanion?.relationshipId ?? null,
      }),
    [
      book.catalogBookId,
      currentBatch?.unitNumber,
      summary?.units,
      lessonScopePages,
      verifiedCompanion?.relationshipId,
    ],
  )

  const preparedSelectionScopeKey = useMemo(
    () =>
      activeLesson
        ? buildLessonActivitySelectionScopeKey({
            catalogBookId: activeLesson.catalogBookId,
            unitNumber: activeLesson.unitNumber,
            sbPrintedPages: activeLesson.visiblePrintedPages,
            companionRelationshipId:
              activeLesson.workbookCompanion?.relationshipId ?? null,
          })
        : '',
    [activeLesson],
  )

  const activeSelectionScopeKey =
    teacherChoiceOpen && activeLesson
      ? preparedSelectionScopeKey
      : liveSelectionScopeKey

  const selectionSbCardIdsKey = activityCardIdsKey(selectionSbCards)
  const selectionWbCardIdsKey = activityCardIdsKey(selectionWbCards)

  useEffect(() => {
    const scopeChanged = activeSelectionScopeKey !== selectionScopeKeyRef.current
    if (scopeChanged) {
      setSbActivitySelection(createDefaultSbActivitySelection(selectionSbCards))
      setWbActivitySelection(createDefaultWbActivitySelection(selectionWbCards))
      knownSbCardIdsRef.current = selectionSbCards.map((card) => card.id)
      knownWbCardIdsRef.current = selectionWbCards.map((card) => card.id)
      selectionScopeKeyRef.current = activeSelectionScopeKey
      return
    }

    setSbActivitySelection((previous) => {
      const next = reconcileSbActivitySelection({
        cards: selectionSbCards,
        previous,
        previousCardIds: knownSbCardIdsRef.current,
      })
      knownSbCardIdsRef.current = selectionSbCards.map((card) => card.id)
      const nextIds = activityCardIdsKey(
        next.selectedCardIds.map((id) => ({ id })),
      )
      const prevIds = activityCardIdsKey(
        previous.selectedCardIds.map((id) => ({ id })),
      )
      return nextIds === prevIds ? previous : next
    })
    setWbActivitySelection((previous) => {
      const next = reconcileWbActivitySelection({
        cards: selectionWbCards,
        previous,
        previousCardIds: knownWbCardIdsRef.current,
      })
      knownWbCardIdsRef.current = selectionWbCards.map((card) => card.id)
      const nextIds = activityCardIdsKey(
        next.selectedCardIds.map((id) => ({ id })),
      )
      const prevIds = activityCardIdsKey(
        previous.selectedCardIds.map((id) => ({ id })),
      )
      return nextIds === prevIds ? previous : next
    })
  }, [
    activeSelectionScopeKey,
    selectionSbCardIdsKey,
    selectionWbCardIdsKey,
    selectionSbCards,
    selectionWbCards,
  ])

  const handleSbActivitySelectionChange = useCallback(
    (cardId: string, selected: boolean) => {
      setSbActivitySelection((current) =>
        setSbActivityCardSelected({
          cards: selectionSbCards,
          state: current,
          cardId,
          selected,
        }),
      )
    },
    [selectionSbCards],
  )

  const handleWbActivitySelectionChange = useCallback(
    (cardId: string, selected: boolean) => {
      setWbActivitySelection((current) =>
        setWbActivityCardSelected({
          cards: selectionWbCards,
          state: current,
          cardId,
          selected,
        }),
      )
    },
    [selectionWbCards],
  )

  const handlePreparePrompt = useCallback(() => {
    const resolved = resolveChalkieLessonContext({
      book,
      summary,
      visiblePrintedPages: lessonScopePages,
      unitNumber: currentBatch?.unitNumber ?? summary?.units[0]?.unitNumber ?? null,
    })

    if (resolved.status !== 'ready') {
      setScopeGuard(resolved)
      setTeacherChoiceOpen(false)
      setActiveLesson(null)
      return
    }

    setScopeGuard(null)
    setActiveLesson(resolved)
    setTeacherChoiceOpen(true)
  }, [book, summary, lessonScopePages, currentBatch?.unitNumber])

  const handleTogglePdfSource = useCallback(() => {
    if (pdfViewMode === 'student_book') {
      if (!verifiedCompanion) return
      const next = enterWorkbookPdfView(sbVisiblePrintedPages)
      setFrozenSbPrintedPages(next.frozenSbPrintedPages)
      setFrozenActivePrintedPage(activePrintedPage)
      setPendingSbRestorePages(null)
      setPdfViewMode(next.pdfViewMode)
      // Jump using verified WB pdf_page values — never printed-as-pdf.
      const wbPdf = exactPdfPagesForPrinted(
        workbookSummary?.pages ?? [],
        verifiedCompanion.workbookPrintedPages,
      )
      if (wbPdf?.[0] != null) {
        setPdfJumpRequest((prev) => ({
          pdfPage: wbPdf[0]!,
          requestId: (prev?.requestId ?? 0) + 1,
        }))
      }
      return
    }
    // Restore the exact frozen SB spread — do not derive from Workbook/PDF state.
    const next = restoreStudentBookPdfView({
      frozenSbPrintedPages,
      sbVisiblePrintedPages,
    })
    setSbVisiblePrintedPages(next.sbVisiblePrintedPages)
    setFrozenSbPrintedPages(next.frozenSbPrintedPages)
    if (frozenActivePrintedPage != null) {
      setActivePrintedPage(frozenActivePrintedPage)
    }
    setFrozenActivePrintedPage(null)
    setPendingSbRestorePages(next.pendingRestorePrintedPages)
    setPdfViewMode(next.pdfViewMode)
    const sbPdf = exactPdfPagesForPrinted(
      summary?.pages ?? [],
      next.pendingRestorePrintedPages,
    )
    if (sbPdf?.[0] != null) {
      setPdfJumpRequest((prev) => ({
        pdfPage: sbPdf[0]!,
        requestId: (prev?.requestId ?? 0) + 1,
      }))
    }
  }, [
    pdfViewMode,
    sbVisiblePrintedPages,
    frozenSbPrintedPages,
    frozenActivePrintedPage,
    activePrintedPage,
    verifiedCompanion,
    workbookSummary?.pages,
    summary?.pages,
  ])

  const handleCloseTeacherChoice = useCallback(() => {
    setTeacherChoiceOpen(false)
    setActiveLesson(null)
  }, [])

  const handleJumpToUnitOpening = useCallback(() => {
    setPdfViewMode('student_book')
    setFrozenSbPrintedPages(null)
    setFrozenActivePrintedPage(null)
    setPendingSbRestorePages(null)
    const printed = scopeGuard?.unitOpeningPrintedPage ?? liveLessonContext.unitOpeningPrintedPage
    if (printed == null) return
    setActivePrintedPage(printed)
    const pdfPage = pdfForPrinted(pageMap, printed)
    setPdfJumpRequest((prev) => ({
      pdfPage,
      requestId: (prev?.requestId ?? 0) + 1,
    }))
    setScopeGuard(null)
  }, [scopeGuard, liveLessonContext.unitOpeningPrintedPage, pageMap])

  // D021: Chalkie standard path is Student Book only — redirect WB/TG selections.
  useEffect(() => {
    if (isStudentBook(book)) return
    const sb = series.books.find(isStudentBook)
    if (sb) onSelectBook(sb.id)
  }, [book, series.books, onSelectBook])

  // Unit / book change → always Student Book view before resolving pages.
  useEffect(() => {
    setPdfViewMode('student_book')
    setFrozenSbPrintedPages(null)
    setFrozenActivePrintedPage(null)
    setActivePrintedPage(null)
    setPendingSbRestorePages(null)
  }, [selectedBatchId, book.id])

  // Leave Workbook view if the mapped companion no longer applies.
  useEffect(() => {
    if (!verifiedCompanion && pdfViewMode === 'workbook') {
      const next = restoreStudentBookPdfView({
        frozenSbPrintedPages,
        sbVisiblePrintedPages,
      })
      setSbVisiblePrintedPages(next.sbVisiblePrintedPages)
      setFrozenSbPrintedPages(next.frozenSbPrintedPages)
      if (frozenActivePrintedPage != null) {
        setActivePrintedPage(frozenActivePrintedPage)
      }
      setFrozenActivePrintedPage(null)
      setPendingSbRestorePages(
        next.pendingRestorePrintedPages.length ? next.pendingRestorePrintedPages : null,
      )
      setPdfViewMode(next.pdfViewMode)
    }
  }, [
    verifiedCompanion,
    pdfViewMode,
    frozenSbPrintedPages,
    frozenActivePrintedPage,
    sbVisiblePrintedPages,
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
    setSbVisiblePrintedPages([])
    setActivePrintedPage(null)
    setPdfViewMode('student_book')
    setFrozenSbPrintedPages(null)
    setFrozenActivePrintedPage(null)
    setPendingSbRestorePages(null)
    setTeacherChoiceOpen(false)
    setActiveLesson(null)
    setScopeGuard(null)
    setPdfJumpRequest(null)

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
          setSelectedBatchId('')
          setBatchesLoading(false)
          setJsonLoading(false)
          return
        }

        const unitBatches = rows.filter((row) => row.fileType === 'batch_json')
        setFromCanonical(false)
        setCanonicalRaw(null)
        setBatches(unitBatches)
        setSelectedBatchId('')
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

  // Apply `?unit=` (default first unit) once batches are ready — supports legacy BI redirects.
  useEffect(() => {
    if (batchesLoading || batches.length === 0) return
    const nextId = pickBatchIdForUnit(batches, requestedUnit)
    setSelectedBatchId((prev) => (prev === nextId ? prev : nextId))
  }, [batchesLoading, batches, requestedUnit])

  // Keep Chalkie `?unit=` aligned with the selected unit for deep links / Validation round-trips.
  useEffect(() => {
    if (!selectedBatchId || !currentUnitNumber) return
    if (searchParams.get('unit') === currentUnitNumber) return
    const next = new URLSearchParams(searchParams)
    next.set('unit', currentUnitNumber)
    setSearchParams(next, { replace: true })
  }, [selectedBatchId, currentUnitNumber, searchParams, setSearchParams])

  // Publisher SS authority — read-only and independent from SB/WB evidence and prompts.
  useEffect(() => {
    let cancelled = false
    const catalogBookId = book.catalogBookId

    setScopeSequenceBookId(catalogBookId ?? null)
    setScopeSequence(null)
    setScopeSequenceError(null)

    if (!catalogBookId || !hasScopeSequenceAuthority(catalogBookId)) {
      setScopeSequenceLoading(false)
      return
    }

    setScopeSequenceLoading(true)
    void (async () => {
      const result = await loadScopeSequenceFromStorage(catalogBookId)
      if (cancelled) return
      if (result.ok) {
        setScopeSequence(result.data)
      } else {
        setScopeSequenceError(result.errors.join(' '))
      }
      setScopeSequenceLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [book.catalogBookId])

  // Phase 2 Book Intelligence — read-only unit arc; never blocks Chalkie prep.
  useEffect(() => {
    let cancelled = false
    const catalogBookId = book.catalogBookId

    setBookIntelligence(null)

    if (!catalogBookId || !hasBookIntelligenceOverview(catalogBookId)) {
      setBookIntelligenceLoading(false)
      return
    }

    setBookIntelligenceLoading(true)

    void (async () => {
      const result = await loadBookIntelligenceFromStorage(catalogBookId)
      if (cancelled) return
      if (result.ok) {
        setBookIntelligence(result.data)
      } else {
        setBookIntelligence(null)
      }
      setBookIntelligenceLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [book.catalogBookId])

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

  // Load mapped Workbook PDF + summary only when a verified companion exists.
  useEffect(() => {
    let cancelled = false
    let objectUrlToRevoke: string | null = null

    if (!verifiedCompanion) {
      setWorkbookSummary(null)
      setWbPdfUrl(null)
      setWbPdfProvider(null)
      setWbPdfLoading(false)
      return
    }

    const wbMatch = curriculumService.getBookByCatalogId(
      verifiedCompanion.workbookCatalogId,
    )
    if (!wbMatch) {
      setWorkbookSummary(null)
      setWbPdfUrl(null)
      setWbPdfProvider(null)
      setWbPdfLoading(false)
      return
    }

    setWbPdfLoading(true)

    void (async () => {
      try {
        const rows = await validationService.listValidationFiles(wbMatch.book.id)
        if (cancelled) return
        const canonical = rows.find((row) => row.fileType === 'canonical_json')
        if (canonical) {
          const raw = await validationService.downloadJson(canonical)
          if (cancelled) return
          setWorkbookSummary(summarizeBatchJson(raw))
        } else {
          setWorkbookSummary(null)
        }

        const pdf = await validationService.findSourcePdf(wbMatch.book.id)
        if (cancelled) return
        if (!pdf) {
          setWbPdfUrl(null)
          setWbPdfProvider(null)
          return
        }
        const signed = await validationService.createSignedPdfUrl(pdf)
        if (cancelled) {
          if (signed?.url.startsWith('blob:')) URL.revokeObjectURL(signed.url)
          return
        }
        if (!signed) {
          setWbPdfUrl(null)
          setWbPdfProvider(null)
          return
        }
        if (signed.url.startsWith('blob:')) objectUrlToRevoke = signed.url
        setWbPdfUrl(signed.url)
        setWbPdfProvider(signed.provider)
      } catch (err) {
        if (cancelled) return
        console.error(
          '[chalkie] Workbook companion load failed:',
          err instanceof Error ? err.message : err,
        )
        setWorkbookSummary(null)
        setWbPdfUrl(null)
        setWbPdfProvider(null)
      } finally {
        if (!cancelled) setWbPdfLoading(false)
      }
    })()

    return () => {
      cancelled = true
      if (objectUrlToRevoke) URL.revokeObjectURL(objectUrlToRevoke)
    }
  }, [verifiedCompanion?.relationshipId, verifiedCompanion?.workbookCatalogId])

  // Jump to verified WB pdf_page indices when entering Workbook view (or when
  // workbook page records arrive after the mode switch).
  const wbTargetPdfKey = wbTargetPdfPages?.join(',') ?? ''
  useEffect(() => {
    if (pdfViewMode !== 'workbook') return
    if (!wbTargetPdfPages?.[0]) return
    setPdfJumpRequest((prev) => ({
      pdfPage: wbTargetPdfPages[0]!,
      requestId: (prev?.requestId ?? 0) + 1,
    }))
  }, [pdfViewMode, wbTargetPdfKey]) // eslint-disable-line react-hooks/exhaustive-deps -- keyed by pdf list contents

  useEffect(() => {
    if (!currentBatch) {
      setSummary(null)
      setJsonError(null)
      setSbVisiblePrintedPages([])
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

  const handleSelectBatch = useCallback((batchId: string) => {
    setPdfViewMode('student_book')
    setFrozenSbPrintedPages(null)
    setPendingSbRestorePages(null)
    setSelectedBatchId(batchId)
  }, [])

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      handleSelectBatch(batches[currentIndex - 1].id)
    }
  }, [batches, currentIndex, handleSelectBatch])

  const handleNext = useCallback(() => {
    if (currentIndex < batches.length - 1) {
      handleSelectBatch(batches[currentIndex + 1].id)
    }
  }, [batches, currentIndex, handleSelectBatch])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (teacherChoiceOpen || scopeGuard) return
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
  }, [handlePrev, handleNext, teacherChoiceOpen, scopeGuard])

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

  const scopeUnitJumpLabel =
    scopeGuard?.unitNumber != null
      ? `Go to Unit ${scopeGuard.unitNumber} opening pages`
      : 'Go to unit opening pages'

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
        onSelectBatch={handleSelectBatch}
        onSelectSeries={onSelectSeries}
        onSelectBook={onSelectBook}
        onBackToBooks={onBackToBooks}
        showVerificationStatus={false}
        bookOptionsFilter="student_books_only"
        bookDisplayTitle={(entry) => studentBookDisplayTitle(entry.title)}
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
          aria-label="Curriculum and intelligence"
          style={{ width: `${leftPaneWidthPercent}%` }}
          className="flex h-full shrink-0 flex-col overflow-hidden"
        >
          <ChalkieLeftPanel
            batch={currentBatch}
            loading={batchesLoading || jsonLoading}
            error={jsonError}
            curriculumAuthority={curriculumAuthority}
            currentLesson={summary ? liveCurrentLesson : null}
            sbActivitySelection={sbActivitySelection}
            wbActivitySelection={wbActivitySelection}
            onSbActivitySelectionChange={handleSbActivitySelectionChange}
            onWbActivitySelectionChange={handleWbActivitySelectionChange}
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
          <div className="min-h-0 flex-1 overflow-hidden bg-slate-200/60 p-2">
            <ValidationPdfPane
              pdfUrl={pdfViewMode === 'workbook' ? wbPdfUrl : pdfUrl}
              loading={
                pdfViewMode === 'workbook' ? wbPdfLoading || pdfLoading : pdfLoading
              }
              bookTitle={
                pdfViewMode === 'workbook'
                  ? `Workbook · mapped pp. ${verifiedCompanion?.workbookPrintedPages.join('–') ?? '—'}`
                  : studentBookDisplayTitle(book.title)
              }
              pdfProvider={pdfViewMode === 'workbook' ? wbPdfProvider : pdfProvider}
              initialPage={
                pdfViewMode === 'workbook'
                  ? (wbTargetPdfPages?.[0] ?? null)
                  : pendingSbRestorePages?.length && sbTargetPdfPages?.[0] != null
                    ? sbTargetPdfPages[0]
                    : pdfInitialPage
              }
              pageMap={pdfViewMode === 'workbook' ? wbPageMap : pageMap}
              onVisiblePrintedPagesChange={
                pdfViewMode === 'student_book'
                  ? handleVisiblePrintedPagesChange
                  : undefined
              }
              onActivePrintedPageChange={
                pdfViewMode === 'student_book'
                  ? handleActivePrintedPageChange
                  : undefined
              }
              jumpRequest={pdfJumpRequest}
              navigationLocked={pdfRendererProps.navigationLocked}
              allowedPdfPages={pdfRendererProps.allowedPdfPages}
            />
          </div>

          {pdfViewMode === 'workbook' ||
          activeLessonPageLabel ||
          verifiedCompanion ? (
            <div className="flex shrink-0 items-center justify-between gap-2 border-t border-slate-200 bg-white px-3 py-2">
              <div className="min-w-0 text-[11px] leading-snug text-slate-500">
                {pdfViewMode === 'workbook' ? (
                  <p>
                    Inspecting mapped Workbook consolidation pages only. Lesson prep
                    stays on the Student Book.
                  </p>
                ) : (
                  <>
                    {activeLessonPageLabel ? <p>{activeLessonPageLabel}</p> : null}
                    {verifiedCompanion ? (
                      <p>
                        Verified Workbook companion available for the current lesson
                        page.
                      </p>
                    ) : null}
                  </>
                )}
              </div>
              {verifiedCompanion ? (
                <button
                  type="button"
                  onClick={handleTogglePdfSource}
                  className="shrink-0 rounded-md border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-900 transition-colors hover:bg-indigo-100"
                >
                  {pdfViewMode === 'workbook' ? 'View Student Book' : 'View Workbook'}
                </button>
              ) : null}
            </div>
          ) : null}

          <ChalkieOutputPanel onPreparePrompt={handlePreparePrompt} />
        </section>
      </div>

      {scopeGuard ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/45 p-3 sm:p-5">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="chalkie-scope-guard-title"
            className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6"
          >
            <h2
              id="chalkie-scope-guard-title"
              className="text-lg font-semibold tracking-tight text-slate-900"
            >
              Source pages need to match this unit
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {scopeGuard.status === 'no_page_evidence'
                ? scopeGuard.evidenceUnavailableMessage
                : scopeGuard.scopeMessage}
            </p>
            {scopeGuard.status === 'out_of_unit' && !scopeGuard.canJumpToUnitOpening ? (
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Use the PDF page controls to open a spread from this unit, then try again.
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setScopeGuard(null)}
                className="rounded-md px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                Close
              </button>
              {scopeGuard.status === 'out_of_unit' && scopeGuard.canJumpToUnitOpening ? (
                <button
                  type="button"
                  onClick={handleJumpToUnitOpening}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
                >
                  {scopeUnitJumpLabel}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <TeacherChoiceFlowOverlay
        open={teacherChoiceOpen && activeLesson != null}
        onClose={handleCloseTeacherChoice}
        lesson={activeLesson}
        activityCards={activeLessonActivityCards}
        workbookActivityCards={activeLessonWorkbookActivityCards}
        bookIntelligence={bookIntelligence}
        sbActivitySelection={sbActivitySelection}
        wbActivitySelection={wbActivitySelection}
        onSbActivitySelectionChange={handleSbActivitySelectionChange}
        onWbActivitySelectionChange={handleWbActivitySelectionChange}
      />
    </div>
  )
}
