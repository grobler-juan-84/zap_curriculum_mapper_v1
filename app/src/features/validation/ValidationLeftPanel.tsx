import React, { useState } from 'react'
import { BookMarked, ChevronDown, ChevronRight, FileJson, Languages, ListChecks, Type } from 'lucide-react'
import type { BatchJsonSummary, BookFileBatch } from '../../types/validation'

interface ValidationLeftPanelProps {
  batch: BookFileBatch | null
  summary: BatchJsonSummary | null
  loading: boolean
  error: string | null
}

function Section({
  title,
  count,
  icon: Icon,
  defaultOpen = false,
  children,
}: {
  title: string
  count?: number
  icon: React.ComponentType<{ className?: string }>
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-slate-100">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-slate-50"
      >
        <span className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Icon className="h-3.5 w-3.5 text-indigo-600" />
          {title}
          {typeof count === 'number' ? (
            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
              {count}
            </span>
          ) : null}
        </span>
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        )}
      </button>
      {open ? <div className="space-y-2 px-3 pb-3">{children}</div> : null}
    </div>
  )
}

export const ValidationLeftPanel: React.FC<ValidationLeftPanelProps> = ({
  batch,
  summary,
  loading,
  error,
}) => {
  return (
    <div className="flex h-full select-none flex-col border-r border-slate-200 bg-white">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-600" />
          <h2 className="text-xs font-bold tracking-tight text-slate-800 uppercase">
            Unit JSON Evidence
          </h2>
        </div>
        <span className="rounded border border-slate-200 bg-white px-2 py-0.5 font-mono text-[11px] text-slate-500">
          {batch?.label ?? '—'}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading ? (
          <p className="p-4 text-sm text-slate-500">Loading unit batch from Storage…</p>
        ) : error ? (
          <div className="m-3 rounded border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
            {error}
          </div>
        ) : !summary ? (
          <p className="p-4 text-sm text-slate-500">Select a unit batch to inspect extracted JSON.</p>
        ) : (
          <>
            <div className="space-y-1 border-b border-slate-100 px-3 py-3 text-xs text-slate-600">
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">book_id</span>
                <span className="font-mono text-slate-800">{summary.bookId ?? '—'}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">series</span>
                <span className="font-medium text-slate-800">{summary.series ?? '—'}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">level</span>
                <span className="text-slate-800">{summary.level ?? '—'}</span>
              </div>
              {batch ? (
                <div className="flex justify-between gap-2 pt-1">
                  <span className="text-slate-500">storage</span>
                  <span className="max-w-[60%] truncate font-mono text-[10px] text-slate-700" title={batch.storagePath}>
                    {batch.storagePath}
                  </span>
                </div>
              ) : null}
            </div>

            <Section title="Units" count={summary.units.length} icon={BookMarked} defaultOpen>
              {summary.units.length === 0 ? (
                <p className="text-xs text-slate-500">No units array entries in this batch.</p>
              ) : (
                summary.units.map((unit, i) => (
                  <div key={unit.unitId ?? i} className="rounded border border-slate-200 bg-slate-50 p-2">
                    <div className="text-xs font-bold text-slate-900">
                      Unit {unit.unitNumber || '?'}
                      {unit.title ? `: ${unit.title}` : ''}
                    </div>
                    {unit.theme ? <div className="mt-0.5 text-[11px] text-slate-600">Theme: {unit.theme}</div> : null}
                    <div className="mt-1 font-mono text-[11px] text-slate-500">
                      pp. {unit.printedPageStart ?? '—'}–{unit.printedPageEnd ?? '—'}
                    </div>
                  </div>
                ))
              )}
            </Section>

            <Section title="Pages" count={summary.pages.length} icon={FileJson} defaultOpen>
              {summary.pages.length === 0 ? (
                <p className="text-xs text-slate-500">No pages in this batch.</p>
              ) : (
                <ul className="max-h-40 space-y-1 overflow-y-auto text-xs text-slate-700">
                  {summary.pages.slice(0, 40).map((page, i) => (
                    <li key={i} className="flex items-baseline justify-between gap-2">
                      <span className="font-mono text-slate-500">p.{page.printedPage ?? '?'}</span>
                      <span className="truncate text-right">
                        {page.sectionTitle || page.sectionType || 'page'}
                      </span>
                    </li>
                  ))}
                  {summary.pages.length > 40 ? (
                    <li className="text-[11px] text-slate-400">+{summary.pages.length - 40} more</li>
                  ) : null}
                </ul>
              )}
            </Section>

            <Section title="Vocabulary" count={summary.vocabulary.length} icon={Type} defaultOpen>
              {summary.vocabulary.length === 0 ? (
                <p className="text-xs text-slate-500">No vocabulary entries.</p>
              ) : (
                <ul className="flex flex-wrap gap-1.5">
                  {summary.vocabulary.slice(0, 60).map((item, i) => (
                    <li
                      key={i}
                      className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-800"
                      title={item.classification}
                    >
                      {item.term || '—'}
                    </li>
                  ))}
                  {summary.vocabulary.length > 60 ? (
                    <li className="text-[11px] text-slate-400">+{summary.vocabulary.length - 60}</li>
                  ) : null}
                </ul>
              )}
            </Section>

            <Section title="Language" count={summary.language.length} icon={Languages}>
              {summary.language.length === 0 ? (
                <p className="text-xs text-slate-500">No language entries.</p>
              ) : (
                <ul className="max-h-48 space-y-2 overflow-y-auto">
                  {summary.language.slice(0, 25).map((item, i) => (
                    <li key={i} className="rounded border border-slate-200 bg-slate-50 p-2 text-xs">
                      {item.languageType ? (
                        <div className="mb-1 font-mono text-[10px] text-slate-500">{item.languageType}</div>
                      ) : null}
                      {item.prompt ? <div className="text-indigo-800">Q: {item.prompt}</div> : null}
                      {item.response ? <div className="text-emerald-800">A: {item.response}</div> : null}
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            <Section title="Activities" count={summary.activities.length} icon={ListChecks}>
              {summary.activities.length === 0 ? (
                <p className="text-xs text-slate-500">No activities.</p>
              ) : (
                <ul className="max-h-48 space-y-1 overflow-y-auto text-xs text-slate-700">
                  {summary.activities.slice(0, 40).map((item, i) => (
                    <li key={i} className="flex justify-between gap-2 border-b border-slate-50 py-1">
                      <span className="truncate">{item.title || 'Untitled activity'}</span>
                      {item.activityType ? (
                        <span className="shrink-0 text-[10px] text-slate-500">{item.activityType}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </Section>
          </>
        )}
      </div>
    </div>
  )
}
