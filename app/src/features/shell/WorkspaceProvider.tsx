import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { curriculumService } from '../../services/curriculumService'
import type { Book, CurriculumSeries, PageSpread } from '../../types/curriculum'

interface WorkspaceContextValue {
  catalogLoading: boolean
  catalogError: string | null
  selectedSeriesId: string
  selectedBookUuid: string
  currentSpreadId: string
  /**
   * Authoritative printed-page scope for the active book surface (Chalkie lesson
   * pages or Book Workspace spread). Null when unknown / cleared on book change.
   */
  activePrintedPages: readonly number[] | null
  sidebarCollapsed: boolean
  currentSeries: CurriculumSeries | null
  currentBook: Book | null
  currentSpread: PageSpread | null
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  selectSeries: (seriesId: string) => void
  selectBook: (bookUuid: string) => void
  setCurrentSpreadId: (spreadId: string) => void
  setActivePrintedPages: (pages: readonly number[] | null) => void
  openDefaultBeehiveSpread: () => void
  reloadCatalog: () => void
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [catalogVersion, setCatalogVersion] = useState(0)
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [catalogError, setCatalogError] = useState<string | null>(null)
  const [selectedSeriesId, setSelectedSeriesId] = useState('')
  const [selectedBookUuid, setSelectedBookUuid] = useState('')
  const [currentSpreadId, setCurrentSpreadIdState] = useState('')
  const [activePrintedPages, setActivePrintedPagesState] = useState<
    readonly number[] | null
  >(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const setActivePrintedPages = useCallback((pages: readonly number[] | null) => {
    if (pages == null) {
      setActivePrintedPagesState(null)
      return
    }
    const normalized = [
      ...new Set(
        pages
          .filter((page) => Number.isFinite(page))
          .map((page) => Math.floor(page)),
      ),
    ].sort((a, b) => a - b)
    setActivePrintedPagesState(normalized.length ? normalized : null)
  }, [])

  const setCurrentSpreadId = useCallback(
    (spreadId: string) => {
      setCurrentSpreadIdState(spreadId)
      // Clear until the active surface re-publishes pages for the new spread.
      setActivePrintedPagesState(null)
    },
    [],
  )

  useEffect(() => {
    let cancelled = false
    setCatalogLoading(true)
    setCatalogError(null)

    curriculumService
      .loadCatalog({ force: catalogVersion > 0 })
      .then((seriesList) => {
        if (cancelled) return
        setCatalogLoading(false)
        const defaults = curriculumService.getDefaultSelection()
        setSelectedSeriesId((current) => current || defaults.seriesId)
        setSelectedBookUuid((current) => current || defaults.bookUuid)
        setCurrentSpreadIdState((current) => current || defaults.spreadId)

        // If previous selection disappeared after reload, fall back to defaults.
        if (seriesList.length > 0) {
          const seriesStillExists = seriesList.some((series) => series.id === selectedSeriesId)
          if (selectedSeriesId && !seriesStillExists) {
            setSelectedSeriesId(defaults.seriesId)
            setSelectedBookUuid(defaults.bookUuid)
            setCurrentSpreadIdState(defaults.spreadId)
            setActivePrintedPagesState(null)
          }
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setCatalogLoading(false)
        setCatalogError(
          err instanceof Error ? err.message : 'Failed to load curriculum catalog.',
        )
      })

    return () => {
      cancelled = true
    }
    // intentionally exclude selectedSeriesId from deps — only re-run on catalogVersion
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalogVersion])

  const currentSeries =
    curriculumService.getSeriesById(selectedSeriesId) ?? curriculumService.listSeries()[0] ?? null
  const currentBook =
    currentSeries?.books.find((book) => book.id === selectedBookUuid) ??
    currentSeries?.books[0] ??
    null
  const currentSpread =
    currentBook?.pageSpreads.find((spread) => spread.id === currentSpreadId) ??
    currentBook?.pageSpreads[0] ??
    null

  const selectSeries = useCallback((seriesId: string) => {
    const series = curriculumService.getSeriesById(seriesId)
    if (!series) return
    setSelectedSeriesId(series.id)
    const firstBook = series.books[0]
    if (firstBook) {
      setSelectedBookUuid(firstBook.id)
      setCurrentSpreadIdState(firstBook.pageSpreads[0]?.id ?? '')
    } else {
      setSelectedBookUuid('')
      setCurrentSpreadIdState('')
    }
    setActivePrintedPagesState(null)
  }, [])

  const selectBook = useCallback((bookUuid: string) => {
    const match = curriculumService.getBookByUuid(bookUuid)
    if (!match) return
    setSelectedSeriesId(match.series.id)
    setSelectedBookUuid(match.book.id)
    setCurrentSpreadIdState(match.book.pageSpreads[0]?.id ?? '')
    setActivePrintedPagesState(null)
  }, [])

  const openDefaultBeehiveSpread = useCallback(() => {
    const match = curriculumService.getBookByCatalogId('beehive_1_sb')
    if (!match) {
      const beehive = curriculumService.getSeriesByName('Beehive')
      if (beehive) selectSeries(beehive.id)
      return
    }
    setSelectedSeriesId(match.series.id)
    setSelectedBookUuid(match.book.id)
    setCurrentSpreadIdState(match.book.pageSpreads[0]?.id ?? '')
    setActivePrintedPagesState(null)
  }, [selectSeries])

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev)
  }, [])

  const reloadCatalog = useCallback(() => {
    curriculumService.clearCache()
    setCatalogVersion((value) => value + 1)
  }, [])

  const value = useMemo(
    () => ({
      catalogLoading,
      catalogError,
      selectedSeriesId,
      selectedBookUuid,
      currentSpreadId,
      activePrintedPages,
      sidebarCollapsed,
      currentSeries,
      currentBook,
      currentSpread,
      setSidebarCollapsed,
      toggleSidebar,
      selectSeries,
      selectBook,
      setCurrentSpreadId,
      setActivePrintedPages,
      openDefaultBeehiveSpread,
      reloadCatalog,
    }),
    [
      catalogLoading,
      catalogError,
      selectedSeriesId,
      selectedBookUuid,
      currentSpreadId,
      activePrintedPages,
      sidebarCollapsed,
      currentSeries,
      currentBook,
      currentSpread,
      toggleSidebar,
      selectSeries,
      selectBook,
      setCurrentSpreadId,
      setActivePrintedPages,
      openDefaultBeehiveSpread,
      reloadCatalog,
    ],
  )

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error('useWorkspace must be used within WorkspaceProvider')
  }
  return context
}
