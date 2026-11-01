import React from 'react'
import type { CurriculumSeries } from '../../types/curriculum'
import { Breadcrumbs } from '../../components/shared/Breadcrumbs'
import { ArrowRight } from 'lucide-react'
import { useCoverImageUrls } from '../../hooks/useCoverImageUrls'
import {
  groupSeriesBooksIntoCourseLevels,
  type CourseLevelCard,
} from './groupSeriesBooksIntoCourseLevels'

interface SeriesLibraryProps {
  series: CurriculumSeries
  /** Opens Book Workspace for a course level (Student Book primary). */
  onSelectCourseLevel: (level: CourseLevelCard) => void
  onBackToCurriculum: () => void
  /** Optional validated resume hints keyed by Student Book catalogBookId. */
  resumeHintsByCatalogId?: Readonly<Record<string, string>>
}

export const SeriesLibrary: React.FC<SeriesLibraryProps> = ({
  series,
  onSelectCourseLevel,
  onBackToCurriculum,
  resumeHintsByCatalogId,
}) => {
  const grouped = groupSeriesBooksIntoCourseLevels({
    seriesName: series.name,
    books: series.books,
  })
  const levels = grouped.ok ? grouped.levels : []
  const coverPaths = levels
    .map((level) => level.coverBook.coverPath)
    .filter((path): path is string => Boolean(path))
  const coverUrls = useCoverImageUrls(coverPaths)
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
                Available Course Levels
              </h2>
              <p className="text-xs text-slate-500">
                Choose a level to open Book Workspace. Student Book is primary; Workbook attaches
                when a verified companion mapping exists.
              </p>
            </div>
            <span className="font-mono text-xs text-slate-500">
              {grouped.ok
                ? `${levels.length} Level${levels.length === 1 ? '' : 's'} Ready`
                : 'Levels unavailable'}
            </span>
          </div>

          {!grouped.ok ? (
            <div className="rounded-lg border border-dashed border-rose-300 bg-white p-8 text-center text-sm text-rose-700">
              {grouped.error}
            </div>
          ) : levels.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              No course levels linked to this series in Supabase yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {levels.map((level) => {
                const coverSrc = level.coverBook.coverPath
                  ? coverUrls[level.coverBook.coverPath]
                  : level.coverBook.coverImage

                return (
                  <div
                    key={level.levelKey}
                    onClick={() => onSelectCourseLevel(level)}
                    className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs transition-all hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="border-b border-slate-100 px-4 pt-3 pb-2">
                      <h4 className="text-sm font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                        {level.displayTitle}
                      </h4>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                        <span>{level.materialsLabel}</span>
                        <span>·</span>
                        <span className="font-mono">
                          {level.studentBook.totalUnits} Units
                        </span>
                      </div>
                    </div>

                    <div className="flex max-h-56 items-center justify-center bg-slate-50 px-4 py-3">
                      {coverSrc ? (
                        <img
                          src={coverSrc}
                          alt={`${level.displayTitle} Cover`}
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

                    <div className="flex flex-col gap-2 border-t border-slate-100 px-4 py-3">
                      {resumeHintsByCatalogId?.[level.studentBook.catalogBookId ?? ''] ? (
                        <p className="text-[11px] text-slate-600">
                          {
                            resumeHintsByCatalogId[
                              level.studentBook.catalogBookId ?? ''
                            ]
                          }
                        </p>
                      ) : null}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-medium text-slate-500">
                          {level.workbook
                            ? 'Workbook available as companion'
                            : 'Student Book only'}
                        </span>
                        <button
                          type="button"
                          className="flex items-center gap-1 text-xs font-bold text-indigo-600 transition-transform group-hover:translate-x-0.5"
                        >
                          <span>Open Book Workspace</span>
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
