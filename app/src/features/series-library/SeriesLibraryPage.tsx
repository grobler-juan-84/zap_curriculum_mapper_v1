import { useNavigate } from 'react-router-dom'
import { chalkieWorkspacePath } from '../book-intelligence/bookIntelligenceStorageRegistry'
import { curriculumService } from '../../services/curriculumService'
import { useWorkspace } from '../shell/WorkspaceProvider'
import { SeriesLibrary } from './SeriesLibrary'

export function SeriesLibraryPage() {
  const navigate = useNavigate()
  const {
    currentSeries,
    selectSeries,
    selectBook,
    catalogLoading,
    catalogError,
  } = useWorkspace()

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

  return (
    <SeriesLibrary
      series={currentSeries}
      onSelectBook={(bookUuid) => {
        selectBook(bookUuid)
        navigate('/app/workspace')
      }}
      onValidateBook={(bookUuid) => {
        selectBook(bookUuid)
        navigate('/app/validation')
      }}
      onOpenChalkieWorkspace={(catalogBookId) => {
        const match = curriculumService.getBookByCatalogId(catalogBookId)
        if (match) {
          selectSeries(match.series.id)
          selectBook(match.book.id)
        }
        navigate(chalkieWorkspacePath())
      }}
      onBackToCurriculum={() => navigate('/app/curriculum')}
    />
  )
}
