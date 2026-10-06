import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  BookOpen, 
  FileText,
  Volume2
} from 'lucide-react';
import type { PageSpread } from '../../types/curriculum';

interface BookViewerToolbarProps {
  spread: PageSpread;
  allSpreads: PageSpread[];
  currentIndex: number;
  onPrevSpread: () => void;
  onNextSpread: () => void;
  onSelectSpread: (spreadId: string) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  viewMode: 'two-page' | 'single-page';
  onToggleViewMode: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onPlayAudioDemo?: () => void;
  isPlayingAudio?: boolean;
}

export const BookViewerToolbar: React.FC<BookViewerToolbarProps> = ({
  spread,
  allSpreads,
  currentIndex,
  onPrevSpread,
  onNextSpread,
  onSelectSpread,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  viewMode,
  onToggleViewMode,
  isFullscreen,
  onToggleFullscreen,
  onPlayAudioDemo,
  isPlayingAudio,
}) => {
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allSpreads.length - 1;

  return (
    <div className="h-9 bg-slate-100/90 border-b border-slate-200 px-3 flex items-center justify-between select-none shrink-0 text-xs">
      {/* Left: Spread Navigation */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onPrevSpread}
          disabled={!hasPrev}
          title="Previous spread (Left arrow)"
          className={`p-1 rounded flex items-center gap-0.5 border ${
            hasPrev
              ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50 cursor-pointer shadow-xs active:bg-slate-200'
              : 'bg-slate-100 border-transparent text-slate-400 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium pr-0.5">Prev</span>
        </button>

        {/* Spread Selector Dropdown */}
        <select
          value={spread.id}
          onChange={(e) => onSelectSpread(e.target.value)}
          aria-label="Select textbook page spread"
          className="bg-white border border-slate-300 text-slate-800 rounded px-2 py-0.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-xs cursor-pointer"
        >
          {allSpreads.map((s) => (
            <option key={s.id} value={s.id}>
              Pages {s.pageNumbers} — {s.title}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onNextSpread}
          disabled={!hasNext}
          title="Next spread (Right arrow)"
          className={`p-1 rounded flex items-center gap-0.5 border ${
            hasNext
              ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50 cursor-pointer shadow-xs active:bg-slate-200'
              : 'bg-slate-100 border-transparent text-slate-400 cursor-not-allowed'
          }`}
        >
          <span className="text-[11px] font-medium pl-0.5">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <span className="text-slate-400 text-xs ml-1 hidden sm:inline">
          ({currentIndex + 1} of {allSpreads.length} spreads)
        </span>
      </div>

      {/* Middle: Audio Simulator (Curriculum Evidence) */}
      <div className="flex items-center gap-2">
        {onPlayAudioDemo && (
          <button
            type="button"
            onClick={onPlayAudioDemo}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium transition-colors border ${
              isPlayingAudio
                ? 'bg-emerald-600 text-white border-emerald-700 animate-pulse'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <Volume2 className="w-3 h-3 text-emerald-600" />
            <span>{isPlayingAudio ? 'Playing Track...' : 'Simulate Audio Track'}</span>
          </button>
        )}
      </div>

      {/* Right: Zoom & Layout Controls */}
      <div className="flex items-center gap-1">
        {/* View Mode Toggle (2-page vs 1-page) */}
        <button
          type="button"
          onClick={onToggleViewMode}
          title={viewMode === 'two-page' ? 'Switch to single page view' : 'Switch to two-page spread view'}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white hover:bg-slate-50 border border-slate-200 text-[11px] text-slate-700"
        >
          {viewMode === 'two-page' ? (
            <>
              <BookOpen className="w-3 h-3 text-indigo-600" />
              <span className="hidden md:inline">2 Pages</span>
            </>
          ) : (
            <>
              <FileText className="w-3 h-3 text-indigo-600" />
              <span className="hidden md:inline">1 Page</span>
            </>
          )}
        </button>

        <div className="h-3.5 w-px bg-slate-300 mx-1" />

        {/* Zoom Out */}
        <button
          type="button"
          onClick={onZoomOut}
          disabled={zoom <= 70}
          title="Zoom out"
          className="p-1 rounded bg-white hover:bg-slate-50 disabled:opacity-40 border border-slate-200 text-slate-600"
        >
          <ZoomOut className="w-3 h-3" />
        </button>

        {/* Zoom Reset / Current Zoom */}
        <button
          type="button"
          onClick={onZoomReset}
          title="Reset zoom to 100%"
          className="px-1.5 py-0.5 rounded bg-white hover:bg-slate-50 border border-slate-200 font-mono text-[10px] text-slate-700 tabular-nums min-w-[42px] text-center"
        >
          {zoom}%
        </button>

        {/* Zoom In */}
        <button
          type="button"
          onClick={onZoomIn}
          disabled={zoom >= 150}
          title="Zoom in"
          className="p-1 rounded bg-white hover:bg-slate-50 disabled:opacity-40 border border-slate-200 text-slate-600"
        >
          <ZoomIn className="w-3 h-3" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit maximized view' : 'Maximize book viewer'}
          className="p-1 rounded bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 ml-1"
        >
          {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
};
