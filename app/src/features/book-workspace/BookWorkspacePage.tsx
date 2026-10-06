import { useNavigate } from 'react-router-dom'
import { useWorkspace } from '../shell/WorkspaceProvider'
import { BookWorkspace } from './BookWorkspace'

export function BookWorkspacePage() {
  const navigate = useNavigate()
  const {
    currentSeries,
    currentBook,
    currentSpreadId,
    setCurrentSpreadId,
    catalogLoading,
    catalogError,
  } = useWorkspace()

  if (catalogLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50 text-sm text-slate-600">
        Loading book workspace…
      </div>
    )
  }

  if (catalogError || !currentSeries || !currentBook) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
        <p className="text-sm font-medium text-slate-800">Workspace unavailable</p>
        <p className="max-w-md text-xs text-slate-500">
          {catalogError ?? 'Select a book from the series library first.'}
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

  if (currentBook.pageSpreads.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
        <p className="text-sm font-medium text-slate-800">{currentBook.title}</p>
        <p className="max-w-md text-xs text-slate-500">
          This book is in the catalog and has unit batches in Storage, but interactive page spreads
          are not wired yet. Beehive 1 still has the mock workstation demo.
        </p>
        <button
          type="button"
          onClick={() => navigate('/app/series')}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
        >
          Back to Series
        </button>
      </div>
    )
  }

  return (
    <BookWorkspace
      series={currentSeries}
      book={currentBook}
      currentSpreadId={currentSpreadId}
      onChangeSpread={setCurrentSpreadId}
      onBackToBooks={() => navigate('/app/series')}
    />
  )
}
