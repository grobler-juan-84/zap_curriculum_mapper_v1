import React from 'react'
import { Copy, Sparkles } from 'lucide-react'

const OUTPUT_PLACEHOLDER =
  'Your generated Chalkie prompt will appear here after server-side OpenAI integration is connected.\n\n' +
  'The generator will use Phase 1 evidence for the visible pages and Phase 5 packaging guidance—without inventing Phase 2–4 interpretation.'

export const ChalkieOutputPanel: React.FC = () => {
  return (
    <div className="flex h-full flex-col border-t border-slate-200 bg-white">
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-3">
        <h2 className="text-xs font-bold tracking-tight text-slate-800 uppercase">
          Chalkie prompt
        </h2>
        <span className="text-[11px] text-slate-500">Generation pending</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled
            title="OpenAI server integration is not connected yet."
            className="inline-flex items-center gap-2 rounded-md bg-slate-200 px-4 py-2 text-xs font-bold text-slate-500 shadow-xs cursor-not-allowed"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate Chalkie Prompt
          </button>
          <p className="text-[11px] text-slate-500">
            OpenAI integration pending — prompt generation will run on the server with your signed-in
            session.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded border border-dashed border-slate-200 bg-slate-50/80 p-2">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Lesson topic
              </span>
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-1 rounded border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-400 cursor-not-allowed"
              >
                <Copy className="h-3 w-3" />
                Copy
              </button>
            </div>
            <p className="text-[11px] text-slate-400">—</p>
          </div>
          <div className="rounded border border-dashed border-slate-200 bg-slate-50/80 p-2 sm:col-span-1">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Vocabulary (CSV)
              </span>
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-1 rounded border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-400 cursor-not-allowed"
              >
                <Copy className="h-3 w-3" />
                Copy
              </button>
            </div>
            <p className="text-[11px] text-slate-400">—</p>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="mb-1 flex items-center justify-between gap-2">
            <label
              htmlFor="chalkie-prompt-output"
              className="text-[11px] font-semibold uppercase tracking-wide text-slate-500"
            >
              Chalkie prompt
            </label>
            <button
              type="button"
              disabled
              title="Nothing generated yet."
              className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-400 cursor-not-allowed"
            >
              <Copy className="h-3 w-3" />
              Copy
            </button>
          </div>
          <textarea
            id="chalkie-prompt-output"
            readOnly
            value=""
            placeholder={OUTPUT_PLACEHOLDER}
            rows={8}
            className="min-h-[120px] flex-1 resize-none rounded border border-slate-300 bg-slate-50 px-2.5 py-2 text-xs leading-relaxed text-slate-700 shadow-xs focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}
