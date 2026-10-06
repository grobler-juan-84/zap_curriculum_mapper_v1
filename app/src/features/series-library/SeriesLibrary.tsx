import React from 'react'
import type { CurriculumSeries } from '../../types/curriculum'
import { Breadcrumbs } from '../../components/shared/Breadcrumbs'
import { CheckCircle2, ArrowRight, CircleDashed } from 'lucide-react'

interface SeriesLibraryProps {
  series: CurriculumSeries
  onSelectBook: (bookId: string) => void
  onBackToCurriculum: () => void
}

export const SeriesLibrary: React.FC<SeriesLibraryProps> = ({
  series,
  onSelectBook,
  onBackToCurriculum,
}) => {
  const breadcrumbItems = [
    { label: 'Curriculum Library', onClick: onBackToCurriculum },
    { label: series.name, active: true },
  ]

  return (
    <div className="flex h-full select-none flex-col overflow-y-auto bg-slate-50">
      <header className="flex h-11 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Publisher:</span>
          <span className="font-semibold text-slate-800">{series.publisher}</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 p-6">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold tracking-wide text-slate-900 uppercase">
                Available Teaching Books
              </h2>
              <p className="text-xs text-slate-500">
                Choose a book to open its curriculum mapping workspace and textbook viewer.
              </p>
            </div>
            <span className="font-mono text-xs text-slate-500">
              {series.books.length} Books Ready for Inspection
            </span>
          </div>

          {series.books.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              No books linked to this series in Supabase yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {series.books.map((book) => {
                const hasInteractiveSpreads = book.pageSpreads.length > 0
                const isFeatured = book.stableBookId === 'beehive_1_sb'
                return (
                  <div
                    key={book.id}
                    onClick={() => onSelectBook(book.id)}
                    className={`group flex cursor-pointer flex-col justify-between rounded-lg border bg-white p-4 shadow-xs transition-all hover:shadow-md ${
                      isFeatured
                        ? 'border-indigo-300 ring-1 ring-indigo-200'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="relative mb-3.5 aspect-[3/4] overflow-hidden rounded-md border border-slate-200 bg-slate-100 shadow-xs transition-all group-hover:scale-[1.01] group-hover:shadow-md">
                      <img
                        src={book.coverImage || '/images/beehive-1-cover.svg'}
                        alt={`${book.title} Cover`}
                        className="pointer-events-none h-full w-full object-cover select-none"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                          {book.title}
                        </h4>
                        <span className="font-mono text-xs text-slate-500">
                          {book.totalUnits} Units
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{book.type}</span>
                        <span>·</span>
                        <span>{book.audience}</span>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                        {hasInteractiveSpreads ? (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Interactive Spreads Loaded</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                            <CircleDashed className="h-3.5 w-3.5 text-slate-400" />
                            <span>Catalog only (batches in Storage)</span>
                          </span>
                        )}
                        <button
                          type="button"
                          className="flex items-center gap-1 text-xs font-bold text-indigo-600 transition-transform group-hover:translate-x-0.5"
                        >
                          <span>Open Workspace</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
