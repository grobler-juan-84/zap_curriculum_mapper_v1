import React from 'react';
import type { CurriculumSeries } from '../../types/curriculum';
import { Breadcrumbs } from '../../components/shared/Breadcrumbs';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface SeriesLibraryProps {
  series: CurriculumSeries;
  onSelectBook: (bookId: string) => void;
  onBackToCurriculum: () => void;
}

export const SeriesLibrary: React.FC<SeriesLibraryProps> = ({
  series,
  onSelectBook,
  onBackToCurriculum,
}) => {
  const breadcrumbItems = [
    { label: 'Curriculum Library', onClick: onBackToCurriculum },
    { label: series.name, active: true },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-y-auto select-none">
      {/* Top Context Header */}
      <header className="h-11 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Publisher:</span>
          <span className="font-semibold text-slate-800">{series.publisher}</span>
        </div>
      </header>

      {/* Main Series View */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">
        {/* Book Shelf Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Available Teaching Books
              </h2>
              <p className="text-xs text-slate-500">
                Choose a book to open its curriculum mapping workspace and textbook viewer.
              </p>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              2 Books Ready for Inspection
            </span>
          </div>

          {/* Book Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {series.books.map((book) => {
              const isFeatured = book.id === 'beehive-1';
              return (
                <div
                  key={book.id}
                  onClick={() => onSelectBook(book.id)}
                  className={`bg-white border rounded-lg p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group ${
                    isFeatured
                      ? 'border-indigo-300 ring-1 ring-indigo-200'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Book Card Top Visual: Authentic Textbook Cover Image */}
                  <div className="relative mb-3.5 rounded-md overflow-hidden bg-slate-100 border border-slate-200 aspect-[3/4] shadow-xs group-hover:shadow-md group-hover:scale-[1.01] transition-all">
                    <img
                      src={book.coverImage || (book.id === 'beehive-2' ? '/images/beehive-2-cover.svg' : '/images/beehive-1-cover.svg')}
                      alt={`${book.title} Cover`}
                      className="w-full h-full object-cover select-none pointer-events-none"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Book Metadata & Actions */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {book.title}
                      </h4>
                      <span className="text-xs text-slate-500 font-mono">
                        {book.totalUnits} Units
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{book.type}</span>
                      <span>·</span>
                      <span>{book.audience}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Interactive Spreads Loaded</span>
                      </span>
                      <button
                        type="button"
                        className="text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1"
                      >
                        <span>Open Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
