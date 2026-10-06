import { useNavigate } from 'react-router-dom'
import { useWorkspace } from '../shell/WorkspaceProvider'
import { SeriesLibrary } from './SeriesLibrary'

export function SeriesLibraryPage() {
  const navigate = useNavigate()
  const { currentSeries, selectBook, catalogLoading, catalogError } = useWorkspace()

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
      onSelectBook={(bookId) => {
        selectBook(bookId)
        navigate('/app/workspace')
      }}
      onValidateBook={(bookId) => {
        selectBook(bookId)
        navigate('/app/validation')
      }}
      onBackToCurriculum={() => navigate('/app/curriculum')}
    />
  )
}
