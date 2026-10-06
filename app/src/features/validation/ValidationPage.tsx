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
    selectBook,
    reloadCatalog,
  } = useWorkspace()

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

  if (!currentSeries || !currentBook) {
    const seriesList = curriculumService.listSeries()
    return (
      <div className="flex h-full flex-col overflow-y-auto bg-slate-50">
        <header className="flex h-11 shrink-0 items-center border-b border-slate-200 bg-white px-6">
          <span className="text-sm font-bold text-slate-900">Validation</span>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-xs text-slate-500">Select a book to verify unit batches</span>
        </header>
        <main className="mx-auto w-full max-w-3xl space-y-4 p-6">
          {seriesList.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
              No series loaded. Open Curriculum Library first or check Supabase seed data.
            </p>
          ) : (
            seriesList.map((series) => (
              <section key={series.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
                <h2 className="text-sm font-bold text-slate-900">{series.name}</h2>
                <ul className="mt-3 space-y-2">
                  {series.books.map((book) => (
                    <li key={book.id}>
                      <button
                        type="button"
                        onClick={() => selectBook(book.id)}
                        className="flex w-full items-center justify-between rounded border border-slate-200 px-3 py-2 text-left text-xs transition-colors hover:border-indigo-300 hover:bg-indigo-50"
                      >
                        <span className="font-semibold text-slate-800">{book.title}</span>
                        <span className="font-mono text-slate-500">{book.totalUnits} units</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
          <button
            type="button"
            onClick={() => navigate('/app/curriculum')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            ← Back to Curriculum Library
          </button>
        </main>
      </div>
    )
  }

  return (
    <ValidationWorkspace
      series={currentSeries}
      book={currentBook}
      onBackToBooks={() => navigate('/app/series')}
    />
  )
}
