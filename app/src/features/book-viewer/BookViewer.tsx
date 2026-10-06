import React, { useState } from 'react';
import type { PageSpread } from '../../types/curriculum';
import { BookViewerToolbar } from './BookViewerToolbar';
import { TextbookPageContent } from './TextbookPageContent';
import { ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';

interface BookViewerProps {
  spread: PageSpread;
  allSpreads: PageSpread[];
  currentIndex: number;
  onPrevSpread: () => void;
  onNextSpread: () => void;
  onSelectSpread: (spreadId: string) => void;
  onWordClick?: (word: string) => void;
  highlightedWord?: string | null;
}

export const BookViewer: React.FC<BookViewerProps> = ({
  spread,
  allSpreads,
  currentIndex,
  onPrevSpread,
  onNextSpread,
  onSelectSpread,
  onWordClick,
  highlightedWord,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [viewMode, setViewMode] = useState<'two-page' | 'single-page'>('two-page');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioBanner, setAudioBanner] = useState<string | null>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(150, prev + 10));
  const handleZoomOut = () => setZoom((prev) => Math.max(70, prev - 10));
  const handleZoomReset = () => setZoom(100);
  const handleToggleViewMode = () =>
    setViewMode((prev) => (prev === 'two-page' ? 'single-page' : 'two-page'));
  const handleToggleFullscreen = () => setIsFullscreen((prev) => !prev);

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    setAudioBanner(`Playing: Track ${spread.bookContent.activities[0]?.audioTrack || '04'} — "Listen, point and repeat"`);
    setTimeout(() => {
      setIsPlayingAudio(false);
      setTimeout(() => setAudioBanner(null), 3000);
    }, 2500);
  };

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allSpreads.length - 1;

  return (
    <div
      className={`flex flex-col bg-slate-200/90 border border-slate-300 rounded-md overflow-hidden shadow-xs relative ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl bg-slate-900/80 p-1' : 'h-full'
      }`}
    >
      {/* Viewer Toolbar */}
      <BookViewerToolbar
        spread={spread}
        allSpreads={allSpreads}
        currentIndex={currentIndex}
        onPrevSpread={onPrevSpread}
        onNextSpread={onNextSpread}
        onSelectSpread={onSelectSpread}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        viewMode={viewMode}
        onToggleViewMode={handleToggleViewMode}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onPlayAudioDemo={handlePlayAudio}
        isPlayingAudio={isPlayingAudio}
      />

      {/* Audio notification banner */}
      {audioBanner && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 bg-slate-900/95 text-white px-3 py-1 rounded-full text-xs flex items-center gap-2 shadow-lg border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>{audioBanner}</span>
        </div>
      )}

      {/* Main Book Display Canvas */}
      <div className="flex-1 overflow-auto p-3 flex items-center justify-center relative bg-gradient-to-b from-slate-200 to-slate-300/80">
        {/* Physical Book Double-Page Container */}
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}
          className="transition-transform duration-150 flex items-stretch shadow-xl rounded-md overflow-hidden border border-slate-400/80 bg-white max-w-5xl w-full min-h-[440px] relative"
        >
          {/* Left Page */}
          <div className={`${viewMode === 'two-page' ? 'w-1/2' : 'w-full'} flex-1 min-h-[440px]`}>
            <TextbookPageContent
              spread={spread}
              pageSide="left"
              onWordClick={onWordClick}
              highlightedWord={highlightedWord}
            />
          </div>

          {/* Book Spine Center Crease & Binding Shadow */}
          {viewMode === 'two-page' && (
            <div className="w-3 bg-gradient-to-r from-slate-300 via-slate-400/60 to-slate-200 relative shrink-0 z-10 shadow-inner flex flex-col justify-between items-center py-2 pointer-events-none">
              <div className="w-0.5 h-full bg-slate-400/50" />
            </div>
          )}

          {/* Right Page (Shown in 2-page mode) */}
          {viewMode === 'two-page' && (
            <div className="w-1/2 flex-1 min-h-[440px]">
              <TextbookPageContent
                spread={spread}
                pageSide="right"
                onWordClick={onWordClick}
                highlightedWord={highlightedWord}
              />
            </div>
          )}
        </div>

        {/* Floating Quick Page Turn Arrows */}
        {hasPrev && (
          <button
            type="button"
            onClick={onPrevSpread}
            title="Previous page spread (←)"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 z-20 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 -ml-0.5" />
          </button>
        )}

        {hasNext && (
          <button
            type="button"
            onClick={onNextSpread}
            title="Next page spread (→)"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 z-20 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 -mr-0.5" />
          </button>
        )}
      </div>
    </div>
  );
};
