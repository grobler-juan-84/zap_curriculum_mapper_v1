import { useNavigate } from 'react-router-dom'
import {
  bookWorkspaceChooseBookPath,
  bookWorkspacePath,
} from '../book-intelligence/bookIntelligenceStorageRegistry'
import { resolveCourseLevelBookIdentity } from '../series-library/groupSeriesBooksIntoCourseLevels'
import { useAuth } from '../auth/AuthProvider'
import { resolveLastStudentBookForSeries } from '../book-workspace/resume'
import { useWorkspace } from '../shell/WorkspaceProvider'
import { curriculumService } from '../../services/curriculumService'
import { CurriculumLibrary } from './CurriculumLibrary'
import { useCurriculumCatalog } from './hooks/useCurriculumCatalog'

export function CurriculumLibraryPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { seriesList, loading, error, reload } = useCurriculumCatalog()
  const {
    selectSeries,
    selectBook,
    catalogLoading,
    catalogError,
    reloadCatalog,
  } = useWorkspace()

  const isLoading = loading || catalogLoading
  const displayError = error ?? catalogError

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50 text-sm text-slate-600">
        Loading curriculum series from Supabase…
      </div>
    )
  }

  if (displayError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
        <p className="text-sm font-medium text-slate-800">Could not load curriculum catalog</p>
        <p className="max-w-md text-xs text-slate-500">{displayError}</p>
        <button
          type="button"
          onClick={() => {
            reload()
            reloadCatalog()
          }}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <CurriculumLibrary
      seriesList={seriesList}
      onSelectSeries={(seriesId) => {
        selectSeries(seriesId)
        const resumed = resolveLastStudentBookForSeries({
          userId: user?.id,
          seriesId,
          seriesList,
        })
        if (resumed) {
          selectBook(resumed.book.id)
          navigate(bookWorkspacePath())
          return
        }
        navigate(bookWorkspaceChooseBookPath())
      }}
      onDirectOpenBook={(bookUuid) => {
        const match = curriculumService.getBookByUuid(bookUuid)
        if (!match) {
          selectBook(bookUuid)
          navigate(bookWorkspacePath())
          return
        }

        selectSeries(match.series.id)

        const openedIdentity = resolveCourseLevelBookIdentity(match.book)
        let primaryBook = match.book
        if (openedIdentity?.role === 'workbook') {
          const companionSb = match.series.books.find((entry) => {
            const identity = resolveCourseLevelBookIdentity(entry)
            return (
              identity?.role === 'student_book' &&
              identity.levelKey === openedIdentity.levelKey
            )
          })
          if (companionSb) primaryBook = companionSb
        }

        selectBook(primaryBook.id)
        navigate(bookWorkspacePath())
      }}
    />
  )
}
