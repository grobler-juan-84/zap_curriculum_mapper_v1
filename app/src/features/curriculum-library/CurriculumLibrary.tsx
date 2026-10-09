import React from 'react'
import type { CurriculumSeries } from '../../types/curriculum'
import { seriesEmoji } from '../../services/catalogMapper'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useCoverImageUrls } from '../../hooks/useCoverImageUrls'

interface CurriculumLibraryProps {
  seriesList: CurriculumSeries[]
  onSelectSeries: (seriesId: string) => void
  onDirectOpenBook: (bookUuid: string) => void
}

export const CurriculumLibrary: React.FC<CurriculumLibraryProps> = ({
  seriesList,
  onSelectSeries,
  onDirectOpenBook: _onDirectOpenBook,
}) => {
  const coverUrls = useCoverImageUrls(seriesList.map((series) => series.coverPath))

  return (
    <div className="flex h-full select-none flex-col overflow-y-auto bg-slate-50">
      <header className="flex h-11 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-tight text-slate-900">Curriculum Library</span>
          <span className="text-slate-300">/</span>
          <span className="text-xs text-slate-500">Select Curriculum Series</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-slate-500">{seriesList.length} Series Indexed</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold tracking-wider text-slate-700 uppercase">
              Available Curriculum Series
            </h2>
            <span className="text-xs text-slate-500">Click any series to browse levels and books</span>
          </div>

          {seriesList.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              No series found in Supabase <code className="text-xs">book_series</code>.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {seriesList.map((series) => {
                const isBeehive = series.name.toLowerCase().includes('beehive')
                const coverSrc = series.coverPath
                  ? coverUrls[series.coverPath]
                  : series.coverImage
                return (
                  <div
                    key={series.id}
                    onClick={() => onSelectSeries(series.id)}
                    className={`group flex cursor-pointer flex-col overflow-hidden rounded-lg border bg-white shadow-xs transition-all hover:shadow-md ${
                      isBeehive
                        ? 'border-indigo-300 ring-1 ring-indigo-100 hover:border-indigo-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="border-b border-slate-100 px-4 pt-3 pb-2">
                      <h3 className="text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                        {series.name}
                      </h3>
                    </div>

                    <div className="flex max-h-40 w-full items-center justify-center bg-slate-50 px-3 py-2">
                      {coverSrc ? (
                        <img
                          src={coverSrc}
                          alt={`${series.name} series`}
                          className="max-h-36 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-28 w-full flex-col items-center justify-center gap-2 text-slate-600">
                          <span className="text-3xl">{seriesEmoji(series.name)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between border-t border-slate-100 p-4">
                      <div className="flex items-center justify-between font-mono text-xs text-slate-500">
                        <span>{series.levelsCount} Total Levels</span>
                        <span className="font-semibold text-indigo-700">
                          {series.availableBooksCount} Books Available
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                        <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span>{isBeehive ? 'Interactive Workstation' : 'Series Indexed'}</span>
                        </span>
                        <button
                          type="button"
                          className="flex items-center gap-1 text-xs font-bold text-indigo-600 transition-transform group-hover:translate-x-0.5"
                        >
                          <span>Explore Series</span>
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
