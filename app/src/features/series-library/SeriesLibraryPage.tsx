import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookWorkspacePath } from '../book-intelligence/bookIntelligenceStorageRegistry'
import {
  formatBookWorkspaceResumeHint,
  readBookWorkspaceResumeState,
  validateSavedBookWorkspaceResume,
} from '../book-workspace/resume'
import { useAuth } from '../auth/AuthProvider'
import { useWorkspace } from '../shell/WorkspaceProvider'
import { SeriesLibrary } from './SeriesLibrary'
import type { CourseLevelCard } from './groupSeriesBooksIntoCourseLevels'

export function SeriesLibraryPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    currentSeries,
    selectSeries,
    selectBook,
    catalogLoading,
    catalogError,
  } = useWorkspace()

  const seriesList = useMemo(
    () => (currentSeries ? [currentSeries] : []),
    [currentSeries],
  )

  const resumeHintsByCatalogId = useMemo(() => {
    const hints: Record<string, string> = {}
    if (!user?.id || !currentSeries) return hints
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
        seriesList,
      })
      const hint = formatBookWorkspaceResumeHint(validated)
      if (hint) hints[catalogBookId] = hint
    }
    return hints
  }, [user?.id, currentSeries, seriesList])

  if (catalogLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50 text-sm text-slate-600">
        Loading series…
      </div>
    )
  }

  if (catalogError || !currentSeries) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
        <p className="text-sm font-medium text-slate-800">Series unavailable</p>
        <p className="max-w-md text-xs text-slate-500">
          {catalogError ?? 'Select a series from the Curriculum Library first.'}
        </p>
        <button
          type="button"
          onClick={() => navigate('/app/curriculum')}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
        >
          Back to Curriculum Library
        </button>
      </div>
    )
  }

  const openCourseLevel = (level: CourseLevelCard) => {
    selectSeries(currentSeries.id)
    // Student Book is always the primary workspace book; Workbook attaches via companions.
    selectBook(level.studentBook.id)
    // No `?unit=` so Book Workspace restores the validated saved location (or Unit 1).
    navigate(bookWorkspacePath())
  }

  return (
    <SeriesLibrary
      series={currentSeries}
      resumeHintsByCatalogId={resumeHintsByCatalogId}
      onSelectCourseLevel={openCourseLevel}
      onBackToCurriculum={() => navigate('/app/curriculum')}
    />
  )
}
