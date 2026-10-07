import React, { useState, useEffect, useCallback } from 'react';
import type { Book, CurriculumSeries } from '../../types/curriculum';
import { WorkspaceHeader } from './WorkspaceHeader';
import { LessonIntelligencePanel } from '../lesson-intelligence/LessonIntelligencePanel';
import { BookViewer } from '../book-viewer/BookViewer';
import { TeacherAiAssistant } from '../teacher-assistant/TeacherAiAssistant';
import { ChalkiePromptModal } from '../teacher-assistant/ChalkiePromptModal';

interface BookWorkspaceProps {
  series: CurriculumSeries;
  book: Book;
  currentSpreadId: string;
  onChangeSpread: (spreadId: string) => void;
  onBackToBooks: () => void;
}

export const BookWorkspace: React.FC<BookWorkspaceProps> = ({
  series,
  book,
  currentSpreadId,
  onChangeSpread,
  onBackToBooks,
}) => {
  const allSpreads = book.pageSpreads;
  const currentIndex = Math.max(
    0,
    allSpreads.findIndex((s) => s.id === currentSpreadId)
  );
  const currentSpread = allSpreads[currentIndex] || allSpreads[0];

  // Synchronized vocabulary highlighting
  const [selectedVocab, setSelectedVocab] = useState<string | null>(null);

  // Vertical split ratio for right pane (Book Viewer vs AI Assistant)
  const [topPaneHeightPercent, setTopPaneHeightPercent] = useState<number>(58);
  const [isDraggingSplitter, setIsDraggingSplitter] = useState<boolean>(false);

  // Chalkie prompt modal
  const [chalkieModalOpen, setChalkieModalOpen] = useState<boolean>(false);
  const [chalkieRawPrompt, setChalkieRawPrompt] = useState<string>('');

  // On-demand prompt prefilling for Teacher AI Assistant
  const [assistantPrefillPrompt, setAssistantPrefillPrompt] = useState<string | null>(null);

  const handlePrevSpread = useCallback(() => {
    if (currentIndex > 0) {
      onChangeSpread(allSpreads[currentIndex - 1].id);
      setSelectedVocab(null);
    }
  }, [currentIndex, allSpreads, onChangeSpread]);

  const handleNextSpread = useCallback(() => {
    if (currentIndex < allSpreads.length - 1) {
      onChangeSpread(allSpreads[currentIndex + 1].id);
      setSelectedVocab(null);
    }
  }, [currentIndex, allSpreads, onChangeSpread]);

  // Keyboard navigation for turning textbook pages
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevSpread();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextSpread();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevSpread, handleNextSpread]);

  // Draggable splitter handler
  const handleMouseDownSplitter = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingSplitter(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingSplitter) return;
      const rightPaneContainer = document.getElementById('right-workspace-pane');
      if (!rightPaneContainer) return;
      const rect = rightPaneContainer.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      const newPercent = (relativeY / rect.height) * 100;
      // Clamp between 30% and 75%
      if (newPercent >= 30 && newPercent <= 75) {
        setTopPaneHeightPercent(newPercent);
      }
    };

    const handleMouseUp = () => {
      if (isDraggingSplitter) {
        setIsDraggingSplitter(false);
      }
    };

    if (isDraggingSplitter) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSplitter]);

  const handleOpenChalkieModal = (rawPrompt: string) => {
    setChalkieRawPrompt(rawPrompt);
    setChalkieModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col bg-slate-100 overflow-hidden select-none">
      {/* Workspace Context Header */}
      <WorkspaceHeader
        book={book}
        spread={currentSpread}
        allSpreads={allSpreads}
        currentIndex={currentIndex}
        onPrevSpread={handlePrevSpread}
        onNextSpread={handleNextSpread}
        onSelectSpread={onChangeSpread}
        onBackToBooks={onBackToBooks}
      />

      {/* Main Multi-Column Split Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* ========================================================================= */}
        {/* LEFT PANE: CURRICULUM & TEACHING INTELLIGENCE (approx 33% width) */}
        {/* ========================================================================= */}
        <section
          aria-label="Curriculum and Teaching Intelligence"
          className="w-1/3 min-w-[340px] max-w-[480px] h-full flex flex-col shrink-0"
        >
          <LessonIntelligencePanel
            spread={currentSpread}
            selectedVocab={selectedVocab}
            onSelectVocab={setSelectedVocab}
            onRequestAIScaffold={() => setAssistantPrefillPrompt(`Scaffold this lesson for pp. ${currentSpread.pageNumbers}`)}
          />
        </section>

        {/* ========================================================================= */}
        {/* RIGHT PANE: BOOK VIEWER (TOP) + TEACHER AI ASSISTANT (BOTTOM) */}
        {/* ========================================================================= */}
        <section
          id="right-workspace-pane"
          aria-label="Textbook Viewer and Teacher AI Assistant"
          className="flex-1 h-full flex flex-col overflow-hidden relative"
        >
          {/* Top Half: Book Viewer */}
          <div
            style={{ height: `${topPaneHeightPercent}%` }}
            className="overflow-hidden transition-all duration-75 p-2 bg-slate-200/60"
          >
            <BookViewer
              spread={currentSpread}
              allSpreads={allSpreads}
              currentIndex={currentIndex}
              onPrevSpread={handlePrevSpread}
              onNextSpread={handleNextSpread}
              onSelectSpread={onChangeSpread}
              onWordClick={setSelectedVocab}
              highlightedWord={selectedVocab}
            />
          </div>

          {/* Draggable Resizer Bar */}
          <div
            onMouseDown={handleMouseDownSplitter}
            title="Drag to resize Textbook Viewer and AI Assistant"
            className="h-2 bg-slate-300 hover:bg-indigo-400 active:bg-indigo-600 transition-colors cursor-row-resize flex items-center justify-center shrink-0 z-20 group"
          >
            <div className="w-10 h-1 bg-slate-400 group-hover:bg-white rounded-full" />
          </div>

          {/* Bottom Half: Teacher AI Assistant */}
          <div
            style={{ height: `${100 - topPaneHeightPercent}%` }}
            className="overflow-hidden transition-all duration-75 flex flex-col"
          >
            <TeacherAiAssistant
              spread={currentSpread}
              seriesName={series.name}
              bookTitle={book.title}
              onOpenChalkieModal={handleOpenChalkieModal}
              prefillPrompt={assistantPrefillPrompt}
              onClearPrefillPrompt={() => setAssistantPrefillPrompt(null)}
            />
          </div>
        </section>
      </div>

      {/* Downstream Chalkie Prompt Modal */}
      <ChalkiePromptModal
        isOpen={chalkieModalOpen}
        onClose={() => setChalkieModalOpen(false)}
        rawPrompt={chalkieRawPrompt}
      />
    </div>
  );
};
