import React, { useMemo, useState } from 'react'
import { BookMarked, ChevronDown, ChevronRight, Eye } from 'lucide-react'
import type { BatchJsonSummary, BookFileBatch } from '../../types/validation'
import { buildUnitSummaryView, buildVisiblePagesView } from './chalkieEvidence'

interface ChalkieLeftPanelProps {
  batch: BookFileBatch | null
  summary: BatchJsonSummary | null
  visiblePrintedPages: number[]
  loading: boolean
  error: string | null
}

function Section({
  title,
  icon: Icon,
  defaultOpen = true,
  children,
}: {
  title: string
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

function BulletList({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) {
    return <p className="text-xs text-slate-500">{empty}</p>
  }
  return (
    <ul className="space-y-1 text-xs leading-relaxed text-slate-700">
      {items.map((item, i) => (
        <li key={i} className="list-inside list-disc">
          {item}
        </li>
      ))}
    </ul>
  )
}

export const ChalkieLeftPanel: React.FC<ChalkieLeftPanelProps> = ({
  batch,
  summary,
  visiblePrintedPages,
  loading,
  error,
}) => {
  const unitView = useMemo(
    () => (summary ? buildUnitSummaryView(summary) : null),
    [summary],
  )
  const visibleView = useMemo(
    () => buildVisiblePagesView(summary, visiblePrintedPages),
    [summary, visiblePrintedPages],
  )

  const visibleRangeLabel =
    visiblePrintedPages.length > 0
      ? visiblePrintedPages.length === 1
        ? `p. ${visiblePrintedPages[0]}`
        : `pp. ${visiblePrintedPages[0]}–${visiblePrintedPages[visiblePrintedPages.length - 1]}`
      : null

  return (
    <div className="flex h-full select-none flex-col border-r border-slate-200 bg-white">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-indigo-600" />
          <h2 className="text-xs font-bold tracking-tight text-slate-800 uppercase">
            Chalkie context
          </h2>
        </div>
        <span className="max-w-[45%] truncate rounded border border-slate-200 bg-white px-2 py-0.5 font-mono text-[11px] text-slate-500">
          {batch?.label ?? '—'}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading ? (
          <p className="p-4 text-sm text-slate-500">Loading unit evidence…</p>
        ) : error ? (
          <div className="m-3 rounded border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
            {error}
          </div>
        ) : !summary || !unitView ? (
          <p className="p-4 text-sm text-slate-500">Select a unit to prepare a Chalkie prompt.</p>
        ) : (
          <>
            <Section title="Unit Summary" icon={BookMarked} defaultOpen>
              <p className="text-xs font-semibold text-slate-900">{unitView.unitLabel}</p>
              {unitView.pageRange ? (
                <p className="text-[11px] text-slate-500">{unitView.pageRange}</p>
              ) : null}
              {unitView.theme ? (
                <p className="text-xs text-slate-600">
                  <span className="font-medium text-slate-500">Theme:</span> {unitView.theme}
                </p>
              ) : null}
              {unitView.learningFocus ? (
                <p className="text-xs text-slate-700">
                  <span className="font-medium text-slate-500">Focus:</span>{' '}
                  {unitView.learningFocus}
                </p>
              ) : null}
              {unitView.vocabularyPreview.length > 0 ? (
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Key vocabulary
                  </p>
                  <p className="text-xs leading-relaxed text-slate-800">
                    {unitView.vocabularyPreview.join(', ')}
                    {summary.vocabulary.length > unitView.vocabularyPreview.length
                      ? ' …'
                      : ''}
                  </p>
                </div>
              ) : null}
              {unitView.languagePreview.length > 0 ? (
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Language frames
                  </p>
                  <BulletList items={unitView.languagePreview} empty="" />
                </div>
              ) : null}
              {unitView.activityPreview.length > 0 ? (
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Book activities
                  </p>
                  <BulletList items={unitView.activityPreview} empty="" />
                </div>
              ) : null}
            </Section>

            <Section title="Visible Pages Summary" icon={Eye} defaultOpen>
              {visibleRangeLabel ? (
                <p className="text-[11px] font-mono text-indigo-700">{visibleRangeLabel}</p>
              ) : null}
              {visibleView.emptyMessage ? (
                <p className="text-xs text-slate-500">{visibleView.emptyMessage}</p>
              ) : (
                <>
                  <BulletList
                    items={visibleView.pageLabels}
                    empty="No page sections listed for this spread."
                  />
                  {visibleView.vocabulary.length > 0 ? (
                    <div>
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Vocabulary on spread
                      </p>
                      <p className="text-xs text-slate-800">
                        {visibleView.vocabulary.join(', ')}
                      </p>
                    </div>
                  ) : null}
                  {visibleView.languageLines.length > 0 ? (
                    <div>
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Language on spread
                      </p>
                      <BulletList items={visibleView.languageLines} empty="" />
                    </div>
                  ) : null}
                  {visibleView.activityLines.length > 0 ? (
                    <div>
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Activities on spread
                      </p>
                      <BulletList items={visibleView.activityLines} empty="" />
                    </div>
                  ) : null}
                </>
              )}
            </Section>
          </>
        )}
      </div>
    </div>
  )
}
