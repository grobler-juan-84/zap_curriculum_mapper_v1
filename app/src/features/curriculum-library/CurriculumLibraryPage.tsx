import { useNavigate } from 'react-router-dom'
import { useWorkspace } from '../shell/WorkspaceProvider'
import { CurriculumLibrary } from './CurriculumLibrary'
import { useCurriculumCatalog } from './hooks/useCurriculumCatalog'

export function CurriculumLibraryPage() {
  const navigate = useNavigate()
  const { seriesList, loading, error, reload } = useCurriculumCatalog()
  const { selectSeries, selectBook, catalogLoading, catalogError, reloadCatalog } = useWorkspace()

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
        navigate('/app/series')
      }}
      onDirectOpenBook={(bookUuid) => {
        selectBook(bookUuid)
        navigate('/app/workspace')
      }}
    />
  )
}
