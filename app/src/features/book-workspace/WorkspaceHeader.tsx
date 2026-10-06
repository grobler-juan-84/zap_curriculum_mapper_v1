import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import type { Book, PageSpread } from '../../types/curriculum';

interface WorkspaceHeaderProps {
  book: Book;
  spread: PageSpread;
  allSpreads: PageSpread[];
  currentIndex: number;
  onPrevSpread: () => void;
  onNextSpread: () => void;
  onSelectSpread: (spreadId: string) => void;
  onBackToBooks: () => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  book,
  spread,
  allSpreads,
  currentIndex,
  onPrevSpread,
  onNextSpread,
  onSelectSpread,
  onBackToBooks,
}) => {
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allSpreads.length - 1;

  return (
    <header className="h-11 bg-white border-b border-slate-200 px-3 flex items-center justify-between shrink-0 select-none shadow-xs z-10">
      {/* Left: Back to Books & Breadcrumbs */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onBackToBooks}
          className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Books</span>
        </button>

        <div className="h-4 w-px bg-slate-300" />

        {/* Book & Unit Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
            <span className="text-indigo-700">{book.title}</span>
            <span className="text-slate-400 font-normal">/</span>
            <span className="text-slate-700">Unit {spread.unitNumber}: {spread.unitTitle}</span>
            <span className="text-slate-400 font-normal">/</span>
            <span className="bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded text-[11px] font-mono">
              Pages {spread.pageNumbers}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Quick Target Summary */}
      <div className="hidden xl:flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
        <span className="text-slate-500 font-medium">Core Target:</span>
        <span className="font-semibold text-indigo-700">“{spread.bookContent.targetLanguage.question}”</span>
        <span className="text-slate-400">➔</span>
        <span className="font-semibold text-emerald-700">“{spread.bookContent.targetLanguage.answer}”</span>
      </div>

      {/* Right: Spread Navigation Controls */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onPrevSpread}
          disabled={!hasPrev}
          title="Previous lesson pages (←)"
          className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 border transition-colors ${
            hasPrev
              ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-xs cursor-pointer'
              : 'bg-slate-50 text-slate-400 border-transparent cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Prev Spread</span>
        </button>

        {/* Fast Spread Selector Dropdown */}
        <select
          value={spread.id}
          onChange={(e) => onSelectSpread(e.target.value)}
          aria-label="Select lesson pages"
          className="bg-white border border-slate-300 text-slate-800 rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-xs cursor-pointer"
        >
          {allSpreads.map((s) => (
            <option key={s.id} value={s.id}>
              pp. {s.pageNumbers} ({s.title})
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onNextSpread}
          disabled={!hasNext}
          title="Next lesson pages (→)"
          className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 border transition-colors ${
            hasNext
              ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-xs cursor-pointer'
              : 'bg-slate-50 text-slate-400 border-transparent cursor-not-allowed'
          }`}
        >
          <span className="hidden md:inline">Next Spread</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
