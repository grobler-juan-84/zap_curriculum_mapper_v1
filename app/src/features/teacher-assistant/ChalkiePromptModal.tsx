import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Sparkles } from 'lucide-react';

interface ChalkiePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  rawPrompt: string;
}

export const ChalkiePromptModal: React.FC<ChalkiePromptModalProps> = ({
  isOpen,
  onClose,
  rawPrompt,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in select-none">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-xs text-slate-800">
              Downstream Chalkie Prompt Specification
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          <div className="bg-indigo-50 border border-indigo-200 rounded p-2.5 text-xs text-indigo-950 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Curriculum to Prompt Translation</span>
              <span>
                This generated prompt translates the curriculum floor, target language frames, and scaffolding constraints directly into instructions for the downstream lesson-generation tool.
              </span>
            </div>
          </div>

          <pre className="p-3 bg-slate-950 text-emerald-400 rounded-md text-[11px] font-mono whitespace-pre-wrap leading-relaxed border border-slate-800 max-h-96 overflow-y-auto">
            {rawPrompt}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Ready to paste into Chalkie or any LLM agent
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold shadow-xs transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Prompt Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
