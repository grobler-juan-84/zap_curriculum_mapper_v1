import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { curriculumService } from '../../services/curriculumService'
import type { Book, CurriculumSeries, PageSpread } from '../../types/curriculum'

interface WorkspaceContextValue {
  selectedSeriesId: string
  selectedBookId: string
  currentSpreadId: string
  sidebarCollapsed: boolean
  currentSeries: CurriculumSeries
  currentBook: Book
  currentSpread: PageSpread | null
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  selectSeries: (seriesId: string) => void
  selectBook: (bookId: string) => void
  setCurrentSpreadId: (spreadId: string) => void
  openDefaultBeehiveSpread: () => void
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined)

const defaults = curriculumService.getDefaultSelection()

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [selectedSeriesId, setSelectedSeriesId] = useState(defaults.seriesId)
  const [selectedBookId, setSelectedBookId] = useState(defaults.bookId)
  const [currentSpreadId, setCurrentSpreadId] = useState(defaults.spreadId)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const currentSeries =
    curriculumService.getSeriesById(selectedSeriesId) ?? curriculumService.listSeries()[0]
  const currentBook =
    currentSeries.books.find((book) => book.id === selectedBookId) ?? currentSeries.books[0]
  const currentSpread =
    currentBook.pageSpreads.find((spread) => spread.id === currentSpreadId) ??
    currentBook.pageSpreads[0] ??
    null

  const selectSeries = useCallback((seriesId: string) => {
    const series = curriculumService.getSeriesById(seriesId)
    if (!series) return
    setSelectedSeriesId(series.id)
    const firstBook = series.books[0]
    if (firstBook) {
      setSelectedBookId(firstBook.id)
      if (firstBook.pageSpreads[0]) {
        setCurrentSpreadId(firstBook.pageSpreads[0].id)
      }
    }
  }, [])

  const selectBook = useCallback((bookId: string) => {
    const match = curriculumService.getBookById(bookId)
    if (!match) return
    setSelectedSeriesId(match.series.id)
    setSelectedBookId(match.book.id)
    if (match.book.pageSpreads[0]) {
      setCurrentSpreadId(match.book.pageSpreads[0].id)
    }
  }, [])

  const openDefaultBeehiveSpread = useCallback(() => {
    setSelectedSeriesId('beehive')
    setSelectedBookId('beehive-1')
    setCurrentSpreadId('beehive-1-p6-7')
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev)
  }, [])

  const value = useMemo(
    () => ({
      selectedSeriesId,
      selectedBookId,
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
    }),
    [
      selectedSeriesId,
      selectedBookId,
      currentSpreadId,
      sidebarCollapsed,
      currentSeries,
      currentBook,
      currentSpread,
      toggleSidebar,
      selectSeries,
      selectBook,
      openDefaultBeehiveSpread,
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
