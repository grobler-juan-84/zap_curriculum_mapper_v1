import React from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Book, CurriculumSeries } from '../../types/curriculum'
import type { BookFileBatch } from '../../types/validation'

interface ValidationHeaderProps {
  seriesList: CurriculumSeries[]
  series: CurriculumSeries
  book: Book
  batches: BookFileBatch[]
  currentBatch: BookFileBatch | null
  currentIndex: number
  /** True when picker units are sliced from one canonical_json file. */
  fromCanonical?: boolean
  onPrev: () => void
  onNext: () => void
  onSelectBatch: (batchId: string) => void
  onSelectSeries: (seriesId: string) => void
  onSelectBook: (bookId: string) => void
  onBackToBooks: () => void
}

function batchLabel(batch: BookFileBatch): string {
  return batch.label?.trim() || batch.filename || batch.storagePath.split('/').pop() || 'Unit batch'
}

export const ValidationHeader: React.FC<ValidationHeaderProps> = ({
  seriesList,
  series,
  book,
  batches,
  currentBatch,
  currentIndex,
  fromCanonical = false,
  onPrev,
  onNext,
  onSelectBatch,
  onSelectSeries,
  onSelectBook,
  onBackToBooks,
}) => {
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex >= 0 && currentIndex < batches.length - 1
  const status = currentBatch?.status ?? 'pending'

  return (
    <header className="z-10 flex h-11 shrink-0 select-none items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 shadow-xs">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onBackToBooks}
          className="flex shrink-0 items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Series</span>
        </button>

        <div className="hidden h-4 w-px bg-slate-300 sm:block" />

        <select
          value={series.id}
          onChange={(e) => onSelectSeries(e.target.value)}
          aria-label="Select series"
          className="max-w-[140px] cursor-pointer truncate rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-800 shadow-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {seriesList.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.name}
            </option>
          ))}
        </select>

        <select
          value={book.id}
          onChange={(e) => onSelectBook(e.target.value)}
          aria-label="Select book"
          className="max-w-[220px] cursor-pointer truncate rounded border border-indigo-200 bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-900 shadow-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {series.books.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.title}
            </option>
          ))}
        </select>

        {currentBatch ? (
          <>
            {fromCanonical ? (
              <span className="hidden rounded border border-indigo-300 bg-indigo-50 px-1.5 py-0.5 font-mono text-[11px] text-indigo-900 lg:inline">
                from canonical
              </span>
            ) : null}
            <span
              className={`hidden rounded border px-1.5 py-0.5 font-mono text-[11px] lg:inline ${
                status === 'verified'
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                  : status === 'needs_review'
                    ? 'border-amber-300 bg-amber-50 text-amber-900'
                    : 'border-slate-300 bg-slate-50 text-slate-700'
              }`}
            >
              {status}
            </span>
          </>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={onPrev}
          disabled={!hasPrev}
          title="Previous unit (←)"
          className={`flex items-center gap-1 rounded border px-2 py-1 text-xs font-medium transition-colors ${
            hasPrev
              ? 'cursor-pointer border-slate-300 bg-white text-slate-800 shadow-xs hover:bg-slate-50'
              : 'cursor-not-allowed border-transparent bg-slate-50 text-slate-400'
          }`}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Prev</span>
        </button>

        <select
          value={currentBatch?.id ?? ''}
          onChange={(e) => onSelectBatch(e.target.value)}
          disabled={batches.length === 0}
          aria-label="Select unit"
          className="max-w-[200px] cursor-pointer truncate rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-800 shadow-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {batches.length === 0 ? (
            <option value="">No units</option>
          ) : (
            batches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batchLabel(batch)}
              </option>
            ))
          )}
        </select>

        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          title="Next unit (→)"
          className={`flex items-center gap-1 rounded border px-2 py-1 text-xs font-medium transition-colors ${
            hasNext
              ? 'cursor-pointer border-slate-300 bg-white text-slate-800 shadow-xs hover:bg-slate-50'
              : 'cursor-not-allowed border-transparent bg-slate-50 text-slate-400'
          }`}
        >
          <span className="hidden md:inline">Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  )
}
