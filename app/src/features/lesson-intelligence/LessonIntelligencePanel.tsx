import React, { useState } from 'react';
import type { PageSpread } from '../../types/curriculum';
import { 
  BookMarked, 
  Lightbulb, 
  Target, 
  AlertTriangle, 
  Plus,
  Minus,
  Volume2, 
  MessageSquare,
  Layers,
  Sparkles,
  CheckCircle2,
  Bookmark,
  TrendingUp,
  Compass
} from 'lucide-react';

interface LessonIntelligencePanelProps {
  spread: PageSpread;
  selectedVocab: string | null;
  onSelectVocab: (word: string | null) => void;
  onRequestAIScaffold?: () => void;
}

export const LessonIntelligencePanel: React.FC<LessonIntelligencePanelProps> = ({
  spread,
  selectedVocab,
  onSelectVocab,
  onRequestAIScaffold: _onRequestAIScaffold,
}) => {
  const { bookContent, teachingIntelligence } = spread;

  // Parent sections collapsed/expanded state
  const [isBookContentExpanded, setIsBookContentExpanded] = useState<boolean>(false);
  const [isTeachingIntelligenceExpanded, setIsTeachingIntelligenceExpanded] = useState<boolean>(false);

  // Sub-sections expanded state
  const [expandedSubSections, setExpandedSubSections] = useState<Record<string, boolean>>({
    objectives: false,
    vocabulary: false,
    targetLanguage: false,
    grammar: false,
    activities: false,
    overview: false,
    teacherFocus: false,
    priorKnowledge: false,
    difficulties: false,
    progression: false,
    floorDepth: false,
    buildsToward: false,
  });

  // Toggle individual parent
  const toggleBookContent = () => {
    setIsBookContentExpanded((prev) => !prev);
  };

  const toggleTeachingIntelligence = () => {
    setIsTeachingIntelligenceExpanded((prev) => !prev);
  };

  // Toggle individual sub-section
  const toggleSubSection = (key: string) => {
    setExpandedSubSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200 select-none">
      {/* Pane Sticky Header */}
      <div className="h-11 bg-slate-50 border-b border-slate-200 px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-600" />
          <h2 className="text-xs font-bold text-slate-800 tracking-tight uppercase">
            Curriculum & Intelligence
          </h2>
        </div>
        <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
          pp. {spread.pageNumbers}
        </span>
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
        {/* ========================================================================= */}
        {/* STEP 1 / PARENT 1: BOOK CONTENT */}
        {/* ========================================================================= */}
        <div className="border border-sky-200 rounded-lg overflow-hidden bg-white shadow-2xs">
          {/* Parent Header */}
          <button
            type="button"
            onClick={toggleBookContent}
            className="w-full px-3.5 py-2.5 bg-gradient-to-r from-sky-50 to-slate-50 hover:from-sky-100/70 hover:to-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-md bg-sky-600 text-white flex items-center justify-center shadow-2xs shrink-0">
                <BookMarked className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-950 tracking-tight">
                    BOOK CONTENT
                  </span>
                  <span className="text-[10px] text-sky-700 bg-sky-100 font-semibold px-1.5 py-0.2 rounded">
                    Textbook Grounded
                  </span>
                </div>
                {!isBookContentExpanded && (
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    Objectives · {bookContent.targetVocabulary.length} Vocab words · Target frame · {bookContent.activities.length} Activities
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className="w-6 h-6 rounded-md flex items-center justify-center bg-white border border-sky-200 text-sky-700 group-hover:bg-sky-600 group-hover:text-white shadow-2xs transition-colors">
                {isBookContentExpanded ? (
                  <Minus className="w-3.5 h-3.5" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
              </span>
            </div>
          </button>

          {/* Sub-Sections inside BOOK CONTENT (Visible when Parent is Expanded) */}
          {isBookContentExpanded && (
            <div className="p-3 border-t border-sky-100 bg-sky-50/20 space-y-2.5 animate-in fade-in duration-150">
              {/* 1. Curriculum Objectives */}
              <div className="border border-slate-200 rounded-md overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleSubSection('objectives')}
                  className="w-full px-3 py-2 bg-slate-50/80 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Target className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-600 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      Curriculum Objectives
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({bookContent.curriculumObjectives.length})
                    </span>
                  </div>
                  <span className="w-5 h-5 rounded flex items-center justify-center bg-white border border-slate-200 text-slate-600 group-hover:border-indigo-300 group-hover:text-indigo-600 shadow-2xs transition-colors">
                    {expandedSubSections.objectives ? (
                      <Minus className="w-3 h-3" />
                    ) : (
                      <Plus className="w-3 h-3" />
                    )}
                  </span>
                </button>
                {expandedSubSections.objectives && (
                  <div className="p-3 border-t border-slate-100 bg-white animate-in fade-in duration-150">
                    <ul className="text-xs text-slate-600 space-y-1.5 pl-3.5 list-disc leading-relaxed">
                      {bookContent.curriculumObjectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 2. Target Vocabulary */}
              <div className="border border-slate-200 rounded-md overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleSubSection('vocabulary')}
                  className="w-full px-3 py-2 bg-slate-50/80 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Bookmark className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-600 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      Target Vocabulary
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({bookContent.targetVocabulary.length} words)
                    </span>
                  </div>
                  <span className="w-5 h-5 rounded flex items-center justify-center bg-white border border-slate-200 text-slate-600 group-hover:border-indigo-300 group-hover:text-indigo-600 shadow-2xs transition-colors">
                    {expandedSubSections.vocabulary ? (
                      <Minus className="w-3 h-3" />
                    ) : (
                      <Plus className="w-3 h-3" />
                    )}
                  </span>
                </button>
                {expandedSubSections.vocabulary && (
                  <div className="p-3 border-t border-slate-100 bg-white space-y-2 animate-in fade-in duration-150">
                    <div className="text-[11px] text-slate-500 flex justify-between items-center">
                      <span>Click any word to inspect & highlight on page</span>
                      {selectedVocab && (
                        <button
                          type="button"
                          onClick={() => onSelectVocab(null)}
                          className="text-sky-700 hover:text-sky-900 font-semibold underline text-[10px]"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {bookContent.targetVocabulary.map((v) => {
                        const isSelected = selectedVocab === v.word;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => onSelectVocab(isSelected ? null : v.word)}
                            className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer border ${
                              isSelected
                                ? 'bg-sky-600 text-white border-sky-700 shadow-2xs font-semibold'
                                : 'bg-slate-50 text-slate-700 hover:bg-sky-50 hover:text-sky-900 border-slate-200'
                            }`}
                          >
                            <span>{v.word}</span>
                            {v.phonetic && (
                              <span
                                className={`text-[10px] ml-1 font-mono ${
                                  isSelected ? 'text-sky-100' : 'text-slate-600'
                                }`}
                              >
                                {v.phonetic}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {selectedVocab && (
                      <div className="p-2 bg-sky-50/70 border border-sky-200 rounded text-xs text-sky-950 flex items-center justify-between">
                        <div>
                          <span className="font-bold">{selectedVocab}</span>
                          <span className="text-slate-500 text-[11px] ml-1.5">
                            {bookContent.targetVocabulary.find((v) => v.word === selectedVocab)?.translationOrNote}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 3. Target Language Frame */}
              <div className="border border-slate-200 rounded-md overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleSubSection('targetLanguage')}
                  className="w-full px-3 py-2 bg-slate-50/80 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-600 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      Target Language Frame
                    </span>
                  </div>
                  <span className="w-5 h-5 rounded flex items-center justify-center bg-white border border-slate-200 text-slate-600 group-hover:border-indigo-300 group-hover:text-indigo-600 shadow-2xs transition-colors">
                    {expandedSubSections.targetLanguage ? (
                      <Minus className="w-3 h-3" />
                    ) : (
                      <Plus className="w-3 h-3" />
                    )}
                  </span>
                </button>
                {expandedSubSections.targetLanguage && (
                  <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2 animate-in fade-in duration-150">
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider w-14 shrink-0">
                          Question:
                        </span>
                        <span className="font-semibold text-slate-900">
                          {bookContent.targetLanguage.question}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider w-14 shrink-0">
                          Answer:
                        </span>
                        <span className="font-semibold text-emerald-900 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          {bookContent.targetLanguage.answer}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Grammar / Language Focus */}
              <div className="border border-slate-200 rounded-md overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleSubSection('grammar')}
                  className="w-full px-3 py-2 bg-slate-50/80 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Sparkles className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-600 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      Grammar / Language Focus
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({bookContent.grammarFocus.length})
                    </span>
                  </div>
                  <span className="w-5 h-5 rounded flex items-center justify-center bg-white border border-slate-200 text-slate-600 group-hover:border-indigo-300 group-hover:text-indigo-600 shadow-2xs transition-colors">
                    {expandedSubSections.grammar ? (
                      <Minus className="w-3 h-3" />
                    ) : (
                      <Plus className="w-3 h-3" />
                    )}
                  </span>
                </button>
                {expandedSubSections.grammar && (
                  <div className="p-3 border-t border-slate-100 bg-white animate-in fade-in duration-150">
                    <div className="text-xs text-slate-600 space-y-1 pl-1">
                      {bookContent.grammarFocus.map((gf, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                          <span>{gf}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Book Activities */}
              <div className="border border-slate-200 rounded-md overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleSubSection('activities')}
                  className="w-full px-3 py-2 bg-slate-50/80 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Volume2 className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-600 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      Book Activities
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({bookContent.activities.length})
                    </span>
                  </div>
                  <span className="w-5 h-5 rounded flex items-center justify-center bg-white border border-slate-200 text-slate-600 group-hover:border-indigo-300 group-hover:text-indigo-600 shadow-2xs transition-colors">
                    {expandedSubSections.activities ? (
                      <Minus className="w-3 h-3" />
                    ) : (
                      <Plus className="w-3 h-3" />
                    )}
                  </span>
                </button>
                {expandedSubSections.activities && (
                  <div className="p-3 border-t border-slate-100 bg-white space-y-2 animate-in fade-in duration-150">
                    {bookContent.activities.map((act) => (
                      <div key={act.id} className="p-2 rounded bg-slate-50/80 border border-slate-200 text-xs">
                        <div className="flex items-center justify-between font-semibold text-slate-800 text-[11px]">
                          <span>
                            Ex {act.number}. {act.title}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            {act.audioTrack ? `Track ${act.audioTrack}` : act.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          {act.instructions}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* STEP 1 / PARENT 2: TEACHING INTELLIGENCE */}
        {/* ========================================================================= */}
        <div className="border border-indigo-200 rounded-lg overflow-hidden bg-white shadow-2xs">
          {/* Parent Header */}
          <button
            type="button"
            onClick={toggleTeachingIntelligence}
            className="w-full px-3.5 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50/40 hover:from-indigo-100/70 hover:to-purple-100/50 flex items-center justify-between text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center shadow-2xs shrink-0">
                <Lightbulb className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-950 tracking-tight">
                    TEACHING INTELLIGENCE
                  </span>
                  <span className="text-[10px] text-indigo-700 bg-indigo-100 font-semibold px-1.5 py-0.2 rounded">
                    Teacher Interpretation
                  </span>
                </div>
                {!isTeachingIntelligenceExpanded && (
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    Overview · Focus · Difficulties ({teachingIntelligence.likelyDifficulties.length}) · 7-Step Progression · Floor vs Depth
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className="w-6 h-6 rounded-md flex items-center justify-center bg-white border border-indigo-200 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white shadow-2xs transition-colors">
                {isTeachingIntelligenceExpanded ? (
                  <Minus className="w-3.5 h-3.5" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
              </span>
            </div>
          </button>

          {/* Sub-Sections inside TEACHING INTELLIGENCE (Visible when Parent is Expanded) */}
          {isTeachingIntelligenceExpanded && (
            <div className="p-3 border-t border-indigo-100 bg-indigo-50/20 space-y-2.5 animate-in fade-in duration-150">
              {/* 6. Lesson Overview */}
              <div className="border border-indigo-100 rounded-md overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleSubSection('overview')}
                  className="w-full px-3 py-2 bg-indigo-50/50 hover:bg-indigo-50/80 flex items-center justify-between text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Compass className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="text-xs font-semibold text-indigo-950 truncate">
                      Lesson Overview
                    </span>
                  </div>
                  <span className="w-5 h-5 rounded flex items-center justify-center bg-white border border-indigo-200 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white shadow-2xs transition-colors">
                    {expandedSubSections.overview ? (
                      <Minus className="w-3 h-3" />
                    ) : (
                      <Plus className="w-3 h-3" />
                    )}
                  </span>
                </button>
                {expandedSubSections.overview && (
                  <div className="p-3 border-t border-indigo-100 bg-white animate-in fade-in duration-150">
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {teachingIntelligence.lessonOverview}
                    </p>
                  </div>
                )}
              </div>

              {/* 7. Teacher Focus: Recognition ➔ Production */}
              <div className="border border-amber-200 rounded-md overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleSubSection('teacherFocus')}
                  className="w-full px-3 py-2 bg-amber-50/60 hover:bg-amber-50 flex items-center justify-between text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="text-xs font-semibold text-amber-950 truncate">
                      Teacher Focus: Recognition ➔ Production
                    </span>
                  </div>
                  <span className="w-5 h-5 rounded flex items-center justify-center bg-white border border-amber-300 text-amber-800 group-hover:bg-amber-500 group-hover:text-white shadow-2xs transition-colors">
                    {expandedSubSections.teacherFocus ? (
                      <Minus className="w-3 h-3" />
                    ) : (
                      <Plus className="w-3 h-3" />
                    )}
                  </span>
                </button>
                {expandedSubSections.teacherFocus && (
                  <div className="p-3 border-t border-amber-200 bg-amber-50/20 space-y-2 animate-in fade-in duration-150">
                    <p className="text-xs text-amber-900 font-medium leading-relaxed">
                      {teachingIntelligence.teacherFocus.goal}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="bg-white p-2 rounded border border-amber-200 shadow-2xs">
                        <span className="text-[10px] text-slate-500 block">Passive Recognition:</span>
                        <span className="font-semibold text-slate-800">
                          “{teachingIntelligence.teacherFocus.recognition}”
                        </span>
                      </div>
                      <div className="bg-white p-2 rounded border border-emerald-200 shadow-2xs">
                        <span className="text-[10px] text-emerald-600 block">Productive Response:</span>
                        <span className="font-semibold text-emerald-800">
                          “{teachingIntelligence.teacherFocus.productiveResponse}”
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 8. Prior Knowledge Required */}
              <div className="border border-slate-200 rounded-md overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleSubSection('priorKnowledge')}
                  className="w-full px-3 py-2 bg-slate-50/80 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-600 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      Prior Knowledge Required
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({teachingIntelligence.priorKnowledge.length})
                    </span>
                  </div>
                  <span className="w-5 h-5 rounded flex items-center justify-center bg-white border border-slate-200 text-slate-600 group-hover:border-indigo-300 group-hover:text-indigo-600 shadow-2xs transition-colors">
                    {expandedSubSections.priorKnowledge ? (
                      <Minus className="w-3 h-3" />
                    ) : (
                      <Plus className="w-3 h-3" />
                    )}
                  </span>
                </button>
                {expandedSubSections.priorKnowledge && (
                  <div className="p-3 border-t border-slate-100 bg-white animate-in fade-in duration-150">
                    <ul className="text-xs text-slate-600 space-y-1 pl-3.5 list-disc">
                      {teachingIntelligence.priorKnowledge.map((pk, i) => (
                        <li key={i}>{pk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 9. Likely Student Difficulties */}
              <div className="border border-rose-200 rounded-md overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleSubSection('difficulties')}
                  className="w-full px-3 py-2 bg-rose-50/60 hover:bg-rose-50 flex items-center justify-between text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="text-xs font-semibold text-rose-950 truncate">
                      Likely Student Difficulties
                    </span>
                    <span className="text-[10px] text-rose-600 font-mono">
                      ({teachingIntelligence.likelyDifficulties.length})
                    </span>
                  </div>
                  <span className="w-5 h-5 rounded flex items-center justify-center bg-white border border-rose-300 text-rose-700 group-hover:bg-rose-500 group-hover:text-white shadow-2xs transition-colors">
                    {expandedSubSections.difficulties ? (
                      <Minus className="w-3 h-3" />
                    ) : (
                      <Plus className="w-3 h-3" />
                    )}
                  </span>
                </button>
                {expandedSubSections.difficulties && (
                  <div className="p-3 border-t border-rose-100 bg-white space-y-2 animate-in fade-in duration-150">
                    {teachingIntelligence.likelyDifficulties.map((diff, i) => (
                      <div key={i} className="p-2 bg-rose-50/40 border border-rose-200 rounded text-xs space-y-1">
                        <div className="font-semibold text-rose-950 flex items-center justify-between text-[11px]">
                          <span>{diff.issue}</span>
                          <span className="text-[10px] font-mono text-rose-600">Common error</span>
                        </div>
                        <div className="flex items-baseline gap-1.5 text-[11px]">
                          <span className="text-rose-700 line-through">“{diff.studentSays}”</span>
                          <span className="text-slate-400">➔</span>
                          <span className="text-emerald-700 font-semibold">“{diff.targetPattern}”</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-tight bg-white p-1 rounded border border-rose-100">
                          💡 {diff.teachingResponse}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 10. Suggested Learning Progression */}
              <div className="border border-slate-200 rounded-md overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleSubSection('progression')}
                  className="w-full px-3 py-2 bg-slate-50/80 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Layers className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-600 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      Suggested Learning Progression
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({teachingIntelligence.learningProgression.length} Steps)
                    </span>
                  </div>
                  <span className="w-5 h-5 rounded flex items-center justify-center bg-white border border-slate-200 text-slate-600 group-hover:border-indigo-300 group-hover:text-indigo-600 shadow-2xs transition-colors">
                    {expandedSubSections.progression ? (
                      <Minus className="w-3 h-3" />
                    ) : (
                      <Plus className="w-3 h-3" />
                    )}
                  </span>
                </button>
                {expandedSubSections.progression && (
                  <div className="p-3 border-t border-slate-100 bg-white space-y-2 animate-in fade-in duration-150">
                    {teachingIntelligence.learningProgression.map((step) => (
                      <div key={step.step} className="flex items-start gap-2 text-xs">
                        <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {step.step}
                        </span>
                        <div>
                          <span className="font-semibold text-slate-800 text-[11px]">{step.title}: </span>
                          <span className="text-[11px] text-slate-600 leading-relaxed">{step.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 11. Curriculum Floor vs. Optional Depth */}
              <div className="border border-slate-200 rounded-md overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleSubSection('floorDepth')}
                  className="w-full px-3 py-2 bg-slate-50/80 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Target className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-600 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      Curriculum Floor vs. Optional Depth
                    </span>
                  </div>
                  <span className="w-5 h-5 rounded flex items-center justify-center bg-white border border-slate-200 text-slate-600 group-hover:border-indigo-300 group-hover:text-indigo-600 shadow-2xs transition-colors">
                    {expandedSubSections.floorDepth ? (
                      <Minus className="w-3 h-3" />
                    ) : (
                      <Plus className="w-3 h-3" />
                    )}
                  </span>
                </button>
                {expandedSubSections.floorDepth && (
                  <div className="p-3 border-t border-slate-100 bg-white space-y-2.5 animate-in fade-in duration-150">
                    <div className="space-y-1 text-xs">
                      <div className="text-[11px] font-semibold text-indigo-700">Non-negotiable Floor:</div>
                      <ul className="pl-3 list-disc text-slate-600 space-y-0.5 text-[11px]">
                        {teachingIntelligence.curriculumFloor.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-1 text-xs pt-1.5 border-t border-slate-100">
                      <div className="text-[11px] font-semibold text-emerald-700">Optional Depth:</div>
                      <ul className="pl-3 list-disc text-slate-600 space-y-0.5 text-[11px]">
                        {teachingIntelligence.optionalDepth.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* 12. Builds Toward */}
              <div className="border border-slate-200 rounded-md overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleSubSection('buildsToward')}
                  className="w-full px-3 py-2 bg-slate-50/80 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <TrendingUp className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-600 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      Builds Toward (Curriculum Trajectory)
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({teachingIntelligence.buildsToward.length})
                    </span>
                  </div>
                  <span className="w-5 h-5 rounded flex items-center justify-center bg-white border border-slate-200 text-slate-600 group-hover:border-indigo-300 group-hover:text-indigo-600 shadow-2xs transition-colors">
                    {expandedSubSections.buildsToward ? (
                      <Minus className="w-3 h-3" />
                    ) : (
                      <Plus className="w-3 h-3" />
                    )}
                  </span>
                </button>
                {expandedSubSections.buildsToward && (
                  <div className="p-3 border-t border-slate-100 bg-white space-y-1.5 text-xs animate-in fade-in duration-150">
                    {teachingIntelligence.buildsToward.map((b, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] py-1 border-b border-slate-100 last:border-none">
                        <span className="text-slate-500 font-medium">{b.phase}</span>
                        <span className="font-semibold text-slate-800">“{b.pattern}”</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
