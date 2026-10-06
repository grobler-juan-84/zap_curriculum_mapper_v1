import React from 'react'
import type { CurriculumSeries } from '../../types/curriculum'
import { Breadcrumbs } from '../../components/shared/Breadcrumbs'
import { CheckCircle2, ArrowRight, CircleDashed } from 'lucide-react'
import beehive1Cover from '../../assests/images/book-series/Beehive1_Student_Book_Cover.png'
import bigEnglish1Cover from '../../assests/images/book-series/big_english_1_student_book_cover.png'
import bigEnglish2Cover from '../../assests/images/book-series/big_english_2_student_book_cover.png'
import reachHigherCover from '../../assests/images/book-series/reach_higher_student_book_cover.png'

interface SeriesLibraryProps {
  series: CurriculumSeries
  onSelectBook: (bookId: string) => void
  onBackToCurriculum: () => void
}

function localCoverForBook(stableBookId?: string): string | undefined {
  switch (stableBookId) {
    case 'beehive_1_sb':
      return beehive1Cover
    case 'big_english_1_sb':
      return bigEnglish1Cover
    case 'big_english_2_sb':
      return bigEnglish2Cover
    case 'reach_higher_2a':
      return reachHigherCover
    default:
      return undefined
  }
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
                Books loaded from Supabase for this series. Choose one to open its workspace.
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
                const coverSrc = book.coverImage || localCoverForBook(book.stableBookId)
                return (
                  <div
                    key={book.id}
                    onClick={() => onSelectBook(book.id)}
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
                        />
                      ) : (
                        <div className="flex h-40 w-full items-center justify-center rounded-md border border-dashed border-slate-300 text-xs text-slate-400">
                          No cover image
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
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
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
