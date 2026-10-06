import { useNavigate } from 'react-router-dom'
import { curriculumService } from '../../services/curriculumService'
import { useWorkspace } from '../shell/WorkspaceProvider'
import { ValidationWorkspace } from './ValidationWorkspace'

export function ValidationPage() {
  const navigate = useNavigate()
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

  if (catalogLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50 text-sm text-slate-500">
        Loading catalog for validation…
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

  if (!currentSeries || !currentBook || seriesList.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
        <p className="text-sm font-medium text-slate-800">No books available</p>
        <p className="max-w-md text-xs text-slate-500">
          Load the curriculum catalog from Supabase, then return here to validate unit batches.
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

  return (
    <ValidationWorkspace
      key={currentBook.id}
      seriesList={seriesList}
      series={currentSeries}
      book={currentBook}
      onSelectSeries={selectSeries}
      onSelectBook={selectBook}
      onBackToBooks={() => navigate('/app/series')}
    />
  )
}
