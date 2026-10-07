import React, { useState } from 'react'
import { CheckCircle2, CircleDashed, AlertTriangle, Loader2 } from 'lucide-react'
import type { BookFileBatch, BookFileStatus } from '../../types/validation'

interface ValidationToolsPanelProps {
  batch: BookFileBatch | null
  saving: boolean
  error: string | null
  /** RLS allows book_files writes only for profiles.role = admin. */
  canWriteStatus: boolean
  onSetStatus: (status: BookFileStatus) => void
}

const STATUS_OPTIONS: Array<{
  value: BookFileStatus
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  activeClass: string
}> = [
  {
    value: 'pending',
    label: 'Pending',
    description: 'Not reviewed yet',
    icon: CircleDashed,
    activeClass: 'border-slate-400 bg-slate-100 ring-1 ring-slate-300',
  },
  {
    value: 'needs_review',
    label: 'Needs fix',
    description: 'JSON does not match source',
    icon: AlertTriangle,
    activeClass: 'border-amber-400 bg-amber-50 ring-1 ring-amber-300',
  },
  {
    value: 'verified',
    label: 'Verified',
    description: 'JSON matches the unit evidence',
    icon: CheckCircle2,
    activeClass: 'border-emerald-400 bg-emerald-50 ring-1 ring-emerald-300',
  },
]

export const ValidationToolsPanel: React.FC<ValidationToolsPanelProps> = ({
  batch,
  saving,
  error,
  canWriteStatus,
  onSetStatus,
}) => {
  const [notes, setNotes] = useState('')
  const current = batch?.status ?? 'pending'

  return (
    <div className="flex h-full flex-col border-t border-slate-200 bg-white">
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-3">
        <h2 className="text-xs font-bold tracking-tight text-slate-800 uppercase">Validation Tools</h2>
        {saving ? (
          <span className="flex items-center gap-1 text-[11px] text-indigo-600">
            <Loader2 className="h-3 w-3 animate-spin" />
            Saving…
          </span>
        ) : (
          <span className="font-mono text-[11px] text-slate-500">book_files.status</span>
        )}
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        {!batch ? (
          <p className="text-sm text-slate-500">No unit batch selected.</p>
        ) : (
          <>
            {!canWriteStatus ? (
              <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                Status cannot be saved with your current role. In Supabase SQL, run{' '}
                <code className="text-[11px]">
                  update public.profiles set role = &apos;admin&apos; where id = auth.uid();
                </code>{' '}
                (or set role for your user id), then refresh.
              </div>
            ) : null}

            <div>
              <p className="mb-2 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                Set verification status
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {STATUS_OPTIONS.map((option) => {
                  const Icon = option.icon
                  const active = current === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      disabled={saving || !canWriteStatus}
                      onClick={() => onSetStatus(option.value)}
                      className={`rounded-md border px-3 py-2 text-left transition-colors disabled:opacity-60 ${
                        active
                          ? option.activeClass
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                        <Icon className="h-3.5 w-3.5" />
                        {option.label}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-slate-500">{option.description}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {error ? (
              <div className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
                {error}
              </div>
            ) : null}

            <div>
              <label
                htmlFor="validation-notes"
                className="mb-1 block text-[11px] font-semibold tracking-wide text-slate-500 uppercase"
              >
                Session notes (not saved yet)
              </label>
              <textarea
                id="validation-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="e.g. vocab term ‘desk’ missing on p.6; language prompt mismatch…"
                className="w-full resize-none rounded border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-800 shadow-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Status writes to <code className="text-[10px]">book_files.status</code> immediately when
                you are signed in as admin. Notes persistence can be added later.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
