import React from 'react';
import type { CurriculumSeries } from '../../types/curriculum';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface CurriculumLibraryProps {
  seriesList: CurriculumSeries[];
  onSelectSeries: (seriesId: string) => void;
  onDirectOpenBook: (bookId: string) => void;
}

export const CurriculumLibrary: React.FC<CurriculumLibraryProps> = ({
  seriesList,
  onSelectSeries,
  onDirectOpenBook: _onDirectOpenBook,
}) => {
  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-y-auto select-none">
      {/* Top Header */}
      <header className="h-11 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-slate-900 tracking-tight">
            Curriculum Library
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-xs text-slate-500">Select Curriculum Series</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">
            {seriesList.length} Series Indexed
          </span>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">
        {/* Series Library Cards Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Available Curriculum Series
            </h2>
            <span className="text-xs text-slate-500">
              Click any series to browse levels and books
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {seriesList.map((series) => {
              const isBeehive = series.id === 'beehive';
              return (
                <div
                  key={series.id}
                  onClick={() => onSelectSeries(series.id)}
                  className={`bg-white border rounded-lg p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group ${
                    isBeehive
                      ? 'border-indigo-300 ring-1 ring-indigo-100 hover:border-indigo-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Series Header Visual Strip */}
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-300 flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform">
                        {series.id === 'beehive' ? '🐝' : series.id === 'big-english' ? '🌍' : '🏔️'}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${series.colorScheme.badge}`}>
                        {series.publisher}
                      </span>
                    </div>

                    {/* Series Title & Description */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {series.name}
                      </h3>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">
                        {series.publisher} · {series.targetAges}
                      </div>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {series.shortDesc}
                      </p>
                    </div>

                    {/* Metadata Specs */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                      <span>{series.levelsCount} Total Levels</span>
                      <span className="font-semibold text-indigo-700">
                        {series.availableBooksCount} Books Available
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isBeehive ? 'Interactive Workstation' : 'Series Indexed'}</span>
                    </span>
                    <button
                      type="button"
                      className="text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1"
                    >
                      <span>Explore Series</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
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
