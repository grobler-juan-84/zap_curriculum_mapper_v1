import React, { useState } from 'react'
import { Check, Copy, Loader2, Sparkles } from 'lucide-react'

const OUTPUT_PLACEHOLDER =
  'Click Generate Chalkie Prompt to build a page-scoped brief from Phase 1 evidence for the visible PDF spread.\n\n' +
  'Generation uses your signed-in session and the server OpenAI key — no mock output.'

export type ChalkieGeneratedOutput = {
  lessonTopic: string
  chalkiePrompt: string
  vocabularyCsv: string
}

interface ChalkieOutputPanelProps {
  canGenerate: boolean
  generating: boolean
  error: string | null
  output: ChalkieGeneratedOutput | null
  disabledReason?: string | null
  onGenerate: () => void
}

function CopyFieldButton({
  label,
  value,
  disabled,
}: {
  label: string
  value: string
  disabled?: boolean
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!value || disabled) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      disabled={disabled || !value}
      title={!value ? 'Nothing to copy yet.' : `Copy ${label}`}
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold transition-colors ${
        disabled || !value
          ? 'cursor-not-allowed border-slate-200 text-slate-400'
          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
      }`}
    >
      {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

export const ChalkieOutputPanel: React.FC<ChalkieOutputPanelProps> = ({
  canGenerate,
  generating,
  error,
  output,
  disabledReason,
  onGenerate,
}) => {
  const generateDisabled = !canGenerate || generating

  return (
    <div className="flex h-full flex-col border-t border-slate-200 bg-white">
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-3">
        <h2 className="text-xs font-bold tracking-tight text-slate-800 uppercase">
          Chalkie prompt
        </h2>
        <span className="text-[11px] text-slate-500">
          {generating ? 'Generating…' : output ? 'Ready to copy' : 'Idle'}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={generateDisabled}
            title={
              generateDisabled
                ? disabledReason || 'Cannot generate yet.'
                : 'Generate a page-scoped Chalkie prompt from Phase 1 evidence'
            }
            onClick={onGenerate}
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-bold shadow-xs transition-colors ${
              generateDisabled
                ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            {generating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            Generate Chalkie Prompt
          </button>
          <p className="text-[11px] text-slate-500">
            {disabledReason && !canGenerate
              ? disabledReason
              : 'Uses visible PDF pages + Phase 1 evidence. Does not invent Phase 2–4 content.'}
          </p>
        </div>

        {error ? (
          <div className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
            {error}
          </div>
        ) : null}

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded border border-slate-200 bg-slate-50/80 p-2">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Lesson topic
              </span>
              <CopyFieldButton
                label="lesson topic"
                value={output?.lessonTopic ?? ''}
                disabled={generating}
              />
            </div>
            <p className="text-[11px] text-slate-800">{output?.lessonTopic || '—'}</p>
          </div>
          <div className="rounded border border-slate-200 bg-slate-50/80 p-2">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Vocabulary (CSV)
              </span>
              <CopyFieldButton
                label="vocabulary"
                value={output?.vocabularyCsv ?? ''}
                disabled={generating}
              />
            </div>
            <p className="break-words text-[11px] text-slate-800">
              {output?.vocabularyCsv || '—'}
            </p>
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
            <CopyFieldButton
              label="Chalkie prompt"
              value={output?.chalkiePrompt ?? ''}
              disabled={generating}
            />
          </div>
          <textarea
            id="chalkie-prompt-output"
            readOnly
            value={output?.chalkiePrompt ?? ''}
            placeholder={OUTPUT_PLACEHOLDER}
            rows={8}
            className="min-h-[120px] flex-1 resize-none rounded border border-slate-300 bg-slate-50 px-2.5 py-2 text-xs leading-relaxed text-slate-700 shadow-xs focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}
