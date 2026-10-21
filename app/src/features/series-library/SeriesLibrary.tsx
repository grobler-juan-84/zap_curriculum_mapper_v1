import React from 'react'
import type { CurriculumSeries } from '../../types/curriculum'
import { Breadcrumbs } from '../../components/shared/Breadcrumbs'
import { CheckCircle2, ArrowRight, CircleDashed } from 'lucide-react'
import { useCoverImageUrls } from '../../hooks/useCoverImageUrls'
import { hasBookIntelligenceOverview } from '../book-intelligence/bookIntelligenceStorageRegistry'

interface SeriesLibraryProps {
  series: CurriculumSeries
  onSelectBook: (bookUuid: string) => void
  onValidateBook?: (bookUuid: string) => void
  /** Opens Chalkie Workspace (Unit Intelligence when BI overview is registered). */
  onOpenChalkieWorkspace?: (catalogBookId: string) => void
  onBackToCurriculum: () => void
}

export const SeriesLibrary: React.FC<SeriesLibraryProps> = ({
  series,
  onSelectBook,
  onValidateBook,
  onOpenChalkieWorkspace,
  onBackToCurriculum,
}) => {
  const coverUrls = useCoverImageUrls(series.books.map((book) => book.coverPath))
  const breadcrumbItems = [
    { label: 'Curriculum Library', onClick: onBackToCurriculum },
    { label: series.name, active: true },
  ]
  const anyBookHasBi = series.books.some(
    (book) =>
      Boolean(onOpenChalkieWorkspace) &&
      hasBookIntelligenceOverview(book.catalogBookId),
  )

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
                {anyBookHasBi
                  ? 'Books loaded from Supabase for this series. Open Chalkie Workspace for Unit Intelligence when Phase 2 BI is available; Book Workspace remains secondary.'
                  : 'Books loaded from Supabase for this series. Choose one to open its workspace.'}
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
                const isFeatured = book.catalogBookId === 'beehive_1_sb'
                const catalogBookId = book.catalogBookId
                const showChalkiePrimary =
                  Boolean(onOpenChalkieWorkspace) &&
                  hasBookIntelligenceOverview(catalogBookId)
                const coverSrc = book.coverPath
                  ? coverUrls[book.coverPath]
                  : book.coverImage

                function openPrimary() {
                  if (showChalkiePrimary && catalogBookId) {
                    onOpenChalkieWorkspace?.(catalogBookId)
                    return
                  }
                  onSelectBook(book.id)
                }

                return (
                  <div
                    key={book.id}
                    onClick={openPrimary}
                    className={`group flex cursor-pointer flex-col overflow-hidden rounded-lg border bg-white shadow-xs transition-all hover:shadow-md ${
                      isFeatured
                        ? 'border-indigo-300 ring-1 ring-indigo-200'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="border-b border-slate-100 px-4 pt-3 pb-2">
                      <h4 className="text-sm font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                        {book.title}
                      </h4>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                        <span>{book.type}</span>
                        <span>·</span>
                        <span>{book.audience}</span>
                        <span>·</span>
                        <span className="font-mono">{book.totalUnits} Units</span>
                      </div>
                    </div>

                    <div className="flex max-h-56 items-center justify-center bg-slate-50 px-4 py-3">
                      {coverSrc ? (
                        <img
                          src={coverSrc}
                          alt={`${book.title} Cover`}
                          className="max-h-52 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-40 w-full items-center justify-center rounded-md border border-dashed border-slate-300 text-xs text-slate-400">
                          No cover image
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-4 py-3">
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
                      <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1">
                        {onValidateBook ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              onValidateBook(book.id)
                            }}
                            className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
                          >
                            Validate
                          </button>
                        ) : null}
                        {showChalkiePrimary && catalogBookId ? (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onOpenChalkieWorkspace?.(catalogBookId)
                              }}
                              className="flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900"
                              title="Open Chalkie Workspace (Unit Intelligence when available)"
                            >
                              <span>Open Chalkie Workspace</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onSelectBook(book.id)
                              }}
                              className="text-xs font-medium text-slate-500 hover:text-slate-800"
                              title="Open mock Book Workspace"
                            >
                              Workspace
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="flex items-center gap-1 text-xs font-bold text-indigo-600 transition-transform group-hover:translate-x-0.5"
                          >
                            <span>Open Workspace</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        )}
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
