import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { curriculumService } from '../../services/curriculumService'
import { useAuth } from '../auth/AuthProvider'
import {
  bookWorkspaceChooseBookPath,
  bookWorkspacePath,
} from '../book-intelligence/bookIntelligenceStorageRegistry'
import {
  formatBookWorkspaceResumeHint,
  readBookWorkspaceLastActiveBook,
  readBookWorkspaceResumeState,
  resolvePrimaryStudentBookForWorkspaceEntry,
  validateSavedBookWorkspaceResume,
} from '../book-workspace/resume'
import { SeriesLibrary } from '../series-library/SeriesLibrary'
import type { CourseLevelCard } from '../series-library/groupSeriesBooksIntoCourseLevels'
import { useWorkspace } from '../shell/WorkspaceProvider'
import { ChalkieWorkspace } from './ChalkieWorkspace'
import { isStudentBook } from './chalkieStudentBookUi'

/**
 * Canonical Book Workspace page.
 * Internal component name retained temporarily (`ChalkiePage` / `ChalkieWorkspace`) —
 * user-facing product name is Book Workspace; Chalkie is an output adapter only.
 */
export function ChalkiePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const chooseBook =
    searchParams.get('chooseBook') === '1' ||
    searchParams.get('chooseBook') === 'true'
  const { user } = useAuth()
  const {
    currentSeries,
    currentBook,
    catalogLoading,
    catalogError,
    selectSeries,
    selectBook,
    reloadCatalog,
  } = useWorkspace()

  const seriesList = curriculumService.listSeries()
  const [entryReady, setEntryReady] = useState(false)

  // Resolve last-active / workbook pairing before mounting the workspace so the
  // catalog default cannot briefly persist over the user's resume book.
  // Skip when the teacher explicitly opened the in-workspace book chooser.
  useEffect(() => {
    if (catalogLoading || entryReady) return

    if (chooseBook) {
      setEntryReady(true)
      return
    }

    if (!user?.id || seriesList.length === 0) {
      setEntryReady(true)
      return
    }

    const defaults = curriculumService.getDefaultSelection()
    const isCatalogDefault =
      !currentBook || currentBook.id === defaults.bookUuid

    if (isCatalogDefault) {
      const lastActive = readBookWorkspaceLastActiveBook({ userId: user.id })
      if (lastActive?.catalogBookId) {
        const match = resolvePrimaryStudentBookForWorkspaceEntry({
          userId: user.id,
          seriesList,
          currentBook: null,
        })
        if (match && match.book.id !== currentBook?.id) {
          selectBook(match.book.id)
          return
        }
      }
    }

    if (currentBook && !isStudentBook(currentBook)) {
      const paired = resolvePrimaryStudentBookForWorkspaceEntry({
        userId: user.id,
        seriesList,
        currentBook,
      })
      if (paired && paired.book.id !== currentBook.id) {
        selectBook(paired.book.id)
        return
      }
    }

    setEntryReady(true)
  }, [
    catalogLoading,
    entryReady,
    chooseBook,
    user?.id,
    seriesList,
    currentBook,
    selectBook,
  ])

  const resumeHintsByCatalogId = useMemo(() => {
    const hints: Record<string, string> = {}
    if (!user?.id || !currentSeries) return hints
    const scopedSeriesList = [currentSeries]
    for (const book of currentSeries.books) {
      const catalogBookId = book.catalogBookId?.trim()
      if (!catalogBookId) continue
      if (book.type === 'Workbook' || book.type === "Teacher's Guide") continue
      const raw = readBookWorkspaceResumeState({
        userId: user.id,
        catalogBookId,
      })
      const validated = validateSavedBookWorkspaceResume({
        userId: user.id,
        saved: raw,
        seriesList: scopedSeriesList,
      })
      const hint = formatBookWorkspaceResumeHint(validated)
      if (hint) hints[catalogBookId] = hint
    }
    return hints
  }, [user?.id, currentSeries])

  if (catalogLoading || !entryReady) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50 text-sm text-slate-500">
        Loading catalog for Book Workspace…
      </div>
    )
  }

  if (catalogError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
        <p className="text-sm font-medium text-slate-800">Catalog unavailable</p>
        <p className="max-w-md text-xs text-slate-500">{catalogError}</p>
        <button
          type="button"
          onClick={reloadCatalog}
          className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-xs hover:bg-slate-50"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!currentSeries || seriesList.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
        <p className="text-sm font-medium text-slate-800">No books available</p>
        <p className="max-w-md text-xs text-slate-500">
          Load the curriculum catalog from Supabase, then return here to prepare lessons.
        </p>
        <button
          type="button"
          onClick={() => navigate('/app/curriculum')}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
        >
          Open Curriculum Library
        </button>
      </div>
    )
  }

  const openCourseLevel = (level: CourseLevelCard) => {
    selectSeries(currentSeries.id)
    selectBook(level.studentBook.id)
    navigate(bookWorkspacePath(), { replace: true })
  }

  if (chooseBook) {
    return (
      <SeriesLibrary
        series={currentSeries}
        resumeHintsByCatalogId={resumeHintsByCatalogId}
        onSelectCourseLevel={openCourseLevel}
        onBackToCurriculum={() => navigate('/app/curriculum')}
      />
    )
  }

  if (!currentBook) {
    return (
      <SeriesLibrary
        series={currentSeries}
        resumeHintsByCatalogId={resumeHintsByCatalogId}
        onSelectCourseLevel={openCourseLevel}
        onBackToCurriculum={() => navigate('/app/curriculum')}
      />
    )
  }

  return (
    <ChalkieWorkspace
      key={currentBook.id}
      seriesList={seriesList}
      series={currentSeries}
      book={currentBook}
      onSelectSeries={selectSeries}
      onSelectBook={selectBook}
      onBackToBooks={() => navigate(bookWorkspaceChooseBookPath())}
    />
  )
}
