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
  sidebarCollapsed: boolean
  currentSeries: CurriculumSeries | null
  currentBook: Book | null
  currentSpread: PageSpread | null
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  selectSeries: (seriesId: string) => void
  selectBook: (bookUuid: string) => void
  setCurrentSpreadId: (spreadId: string) => void
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
  const [currentSpreadId, setCurrentSpreadId] = useState('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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
        setCurrentSpreadId((current) => current || defaults.spreadId)

        // If previous selection disappeared after reload, fall back to defaults.
        if (seriesList.length > 0) {
          const seriesStillExists = seriesList.some((series) => series.id === selectedSeriesId)
          if (selectedSeriesId && !seriesStillExists) {
            setSelectedSeriesId(defaults.seriesId)
            setSelectedBookUuid(defaults.bookUuid)
            setCurrentSpreadId(defaults.spreadId)
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
      setCurrentSpreadId(firstBook.pageSpreads[0]?.id ?? '')
    } else {
      setSelectedBookUuid('')
      setCurrentSpreadId('')
    }
  }, [])

  const selectBook = useCallback((bookUuid: string) => {
    const match = curriculumService.getBookByUuid(bookUuid)
    if (!match) return
    setSelectedSeriesId(match.series.id)
    setSelectedBookUuid(match.book.id)
    setCurrentSpreadId(match.book.pageSpreads[0]?.id ?? '')
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
    setCurrentSpreadId(match.book.pageSpreads[0]?.id ?? '')
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
      sidebarCollapsed,
      currentSeries,
      currentBook,
      currentSpread,
      setSidebarCollapsed,
      toggleSidebar,
      selectSeries,
      selectBook,
      setCurrentSpreadId,
      openDefaultBeehiveSpread,
      reloadCatalog,
    }),
    [
      catalogLoading,
      catalogError,
      selectedSeriesId,
      selectedBookUuid,
      currentSpreadId,
      sidebarCollapsed,
      currentSeries,
      currentBook,
      currentSpread,
      toggleSidebar,
      selectSeries,
      selectBook,
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
