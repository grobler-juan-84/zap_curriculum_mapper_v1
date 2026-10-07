import React, { useState, useRef, useEffect } from 'react';
import type { PageSpread, QuickActionType } from '../../types/curriculum';
import type { AIResponseData } from '../../services/aiAssistantService';
import { useTeacherAiResponses } from './hooks/useTeacherAiResponses';
import {
  Sparkles,
  Send,
  Copy,
  Check,
  Layers,
  Clock,
  AlertCircle,
  FileCode,
  Flame,
} from 'lucide-react';

interface TeacherAiAssistantProps {
  spread: PageSpread;
  seriesName: string;
  bookTitle: string;
  onOpenChalkieModal?: (rawPrompt: string) => void;
  prefillPrompt?: string | null;
  onClearPrefillPrompt?: () => void;
}

export const TeacherAiAssistant: React.FC<TeacherAiAssistantProps> = ({
  spread,
  seriesName,
  bookTitle,
  onOpenChalkieModal,
  prefillPrompt,
  onClearPrefillPrompt,
}) => {
  const { runQuickAction, answerQuery } = useTeacherAiResponses();
  const [activeAction, setActiveAction] = useState<QuickActionType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentResponse, setCurrentResponse] = useState<AIResponseData | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');

  const responseContainerRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  const quickActionPrompts: Record<QuickActionType, string> = {
    'scaffold': `Scaffold this lesson for pp. ${spread.pageNumbers}`,
    'lesson-plan': `Create a 45-minute lesson plan for pp. ${spread.pageNumbers}`,
    'chalkie-prompt': `Create Chalkie prompt for pp. ${spread.pageNumbers}`,
    'speaking-activities': `Speaking activities for pp. ${spread.pageNumbers}`,
    'game-ideas': `Game ideas for pp. ${spread.pageNumbers}`,
    'likely-difficulties': `Likely difficulties for pp. ${spread.pageNumbers}`,
  };

  // Reset response when spread changes to keep it strictly on-demand for the current pages
  useEffect(() => {
    setCurrentResponse(null);
    setActiveAction(null);
    setChatInput('');
  }, [spread.id]);

  // Handle external prefilled prompt trigger if provided
  useEffect(() => {
    if (prefillPrompt) {
      setChatInput(prefillPrompt);
      chatInputRef.current?.focus();
      if (onClearPrefillPrompt) {
        onClearPrefillPrompt();
      }
    }
  }, [prefillPrompt, onClearPrefillPrompt]);

  const handleSelectQuickAction = (action: QuickActionType) => {
    setActiveAction(action);
    setChatInput(quickActionPrompts[action]);
    chatInputRef.current?.focus();
  };

  const handleSelectSuggestedQuestion = (question: string) => {
    setChatInput(question);
    setActiveAction(null);
    chatInputRef.current?.focus();
  };

  const handleSendQuery = (queryText: string) => {
    if (!queryText.trim() || loading) return;
    const q = queryText.trim();
    setLoading(true);

    setTimeout(() => {
      let aiRes: AIResponseData;
      if (activeAction && q === quickActionPrompts[activeAction]) {
        aiRes = runQuickAction(activeAction, spread);
      } else {
        aiRes = answerQuery(q, spread);
      }
      setCurrentResponse(aiRes);
      setLoading(false);
      if (responseContainerRef.current) {
        responseContainerRef.current.scrollTop = 0;
      }
    }, 280);
  };

  const handleCopy = (text?: string) => {
    if (!currentResponse) return;
    const contentToCopy =
      text ||
      currentResponse.rawTextForCopy ||
      `${currentResponse.title}\n\n${currentResponse.summary}\n\n` +
        currentResponse.sections
          .map((s) => `${s.heading}\n${s.content || ''}\n${s.listItems?.join('\n') || ''}`)
          .join('\n\n');

    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickActionItems: Array<{ id: QuickActionType; label: string; icon: any }> = [
    { id: 'scaffold', label: 'Scaffold this lesson', icon: Layers },
    { id: 'lesson-plan', label: 'Create lesson plan', icon: Clock },
    { id: 'chalkie-prompt', label: 'Create Chalkie prompt', icon: FileCode },
    { id: 'speaking-activities', label: 'Speaking activities', icon: Sparkles },
    { id: 'game-ideas', label: 'Game ideas', icon: Flame },
    { id: 'likely-difficulties', label: 'Likely difficulties', icon: AlertCircle },
  ];

  const suggestedQuestions = [
    'How can I scaffold this for weaker students?',
    'What should students already know?',
    'Give me a 5-minute speaking activity.',
    'What mistakes should I watch for?',
    'How does this connect to later learning?',
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50 border-t border-slate-300 select-none overflow-hidden">
      {/* Context Aware Top Bar */}
      <div className="h-8 bg-white border-b border-slate-200 px-3 flex items-center justify-between shrink-0 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 font-semibold text-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Teacher Assistant</span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] text-slate-500 font-mono">
            Grounding: {seriesName} · {bookTitle} · pp. {spread.pageNumbers}
          </span>
        </div>

        {currentResponse && (
          <div className="flex items-center gap-2">
            {currentResponse.rawTextForCopy && onOpenChalkieModal && (
              <button
                type="button"
                onClick={() => onOpenChalkieModal(currentResponse.rawTextForCopy!)}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 underline flex items-center gap-1 cursor-pointer"
              >
                <span>Inspect Prompt</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => handleCopy()}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-500" />
                  <span>Copy Output</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions Bar */}
      <div className="px-3 py-1.5 bg-slate-100/80 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto shrink-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Actions:
        </span>
        {quickActionItems.map((action) => {
          const Icon = action.icon;
          const isActive = activeAction === action.id;
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => handleSelectQuickAction(action.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-slate-200'
              }`}
            >
              <Icon className={`w-3 h-3 ${isActive ? 'text-indigo-200' : 'text-slate-500'}`} />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Response View Area (Scrollable) */}
      <div
        ref={responseContainerRef}
        className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-white"
      >
        {loading ? (
          <div className="h-full min-h-[140px] flex flex-col items-center justify-center text-slate-400 gap-2">
            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium text-slate-500">
              Generating curriculum intelligence for pp. {spread.pageNumbers}...
            </span>
          </div>
        ) : currentResponse ? (
          <div className="space-y-3 max-w-4xl">
            {/* Header info */}
            <div className="border-b border-slate-200 pb-2">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  {currentResponse.title}
                </h3>
                {currentResponse.badge && (
                  <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {currentResponse.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentResponse.summary}
              </p>
            </div>

            {/* Structured Sections */}
            <div className="space-y-2.5">
              {currentResponse.sections.map((section, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded bg-slate-50/70 border border-slate-200 space-y-1.5 text-xs text-slate-800"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold text-slate-900 text-xs">{section.heading}</span>
                    {section.subheading && (
                      <span className="text-[11px] font-medium text-indigo-600">
                        {section.subheading}
                      </span>
                    )}
                  </div>

                  {section.content && (
                    <p className="text-xs text-slate-700 leading-relaxed">{section.content}</p>
                  )}

                  {section.listItems && (
                    <ul className="pl-4 list-disc space-y-1 text-slate-700">
                      {section.listItems.map((item, itemIdx) => (
                        <li key={itemIdx}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {section.callout && (
                    <div
                      className={`p-2 rounded border text-[11px] flex items-start gap-2 ${
                        section.callout.type === 'warning'
                          ? 'bg-rose-50 border-rose-200 text-rose-900'
                          : section.callout.type === 'frame'
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-semibold'
                          : 'bg-amber-50 border-amber-200 text-amber-900'
                      }`}
                    >
                      <span className="font-bold uppercase tracking-wider text-[10px]">
                        [{section.callout.label}]:
                      </span>
                      <span>{section.callout.text}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[140px] flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2 border border-slate-200">
              <Sparkles className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-xs font-semibold text-slate-700">
              Curriculum Intelligence on Demand
            </p>
            <p className="text-[11px] text-slate-500 max-w-md mt-1 leading-relaxed">
              Click an action above or try a prompt below, then click <strong className="font-semibold text-slate-800">Ask AI</strong> to generate tailored intelligence for pp. {spread.pageNumbers}.
            </p>
          </div>
        )}
      </div>

      {/* Suggested Questions Pills & Chat Input (Bottom Pinned) */}
      <div className="p-2.5 bg-slate-100 border-t border-slate-200 shrink-0 space-y-1.5">
        {/* Suggested Quick Prompt Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
          <span className="text-[10px] text-slate-600 font-medium shrink-0">Try asking:</span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSuggestedQuestion(q)}
              className="px-2 py-0.5 rounded bg-white hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 border border-slate-200 whitespace-nowrap transition-colors text-[11px] cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Free-Text Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery(chatInput);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              ref={chatInputRef}
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything about these pages or how to teach them..."
              className="w-full h-8 pl-3 pr-8 rounded bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-xs"
            />
          </div>
          <button
            type="submit"
            disabled={!chatInput.trim() || loading}
            className="h-8 px-3 rounded bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed"
          >
            <span>Ask AI</span>
            <Send className="w-3 h-3" />
          </button>
        </form>
      </div>
    </div>
  );
};
