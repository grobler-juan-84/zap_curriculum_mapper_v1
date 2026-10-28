/**
 * Shared verified activity evidence disclosure for left panel and preparation review.
 * Selection controls are optional props — this component does not own workspace state.
 *
 * `layout="modal"` expands cards to their content; page columns scroll. Left-panel
 * callers keep the default compact layout.
 */
import { useId, useState } from 'react'
import { ChevronRight, Lightbulb } from 'lucide-react'
import type { SbActivityCard } from './chalkieActivitySelection'
import type { WbActivityCard } from './chalkieWorkbookActivitySelection'
import type {
  Be3U08ActivitySummarySidecarRecord,
  Be3U08TeachingGuidanceSidecarRecord,
} from './be3U08ActivityEnrichmentPoc'

export type ActivityEvidenceCardModel = SbActivityCard | WbActivityCard

function splitLanguageExchange(line: string): {
  prompt: string
  response: string | null
} {
  const slash = line.split(/\s+\/\s+/)
  if (slash.length === 2 && slash[0]?.trim() && slash[1]?.trim()) {
    return { prompt: slash[0].trim(), response: slash[1].trim() }
  }
  const arrow = line.split(/\s+→\s+/)
  if (arrow.length === 2 && arrow[0]?.trim() && arrow[1]?.trim()) {
    return { prompt: arrow[0].trim(), response: arrow[1].trim() }
  }
  return { prompt: line.trim(), response: null }
}

function LanguageFrameList({ lines }: { lines: readonly string[] }) {
  return (
    <ul className="space-y-1.5">
      {lines.map((line) => {
        const { prompt, response } = splitLanguageExchange(line)
        return (
          <li
            key={line}
            className="rounded-md border border-slate-200 bg-slate-50/80 px-2.5 py-2"
          >
            <p className="text-xs leading-relaxed text-slate-800">{prompt}</p>
            {response ? (
              <p className="mt-1 border-t border-slate-200/80 pt-1 text-xs leading-relaxed text-slate-600">
                <span className="font-medium text-slate-500">Response:</span>{' '}
                {response}
              </p>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

function VocabularyChips({ terms }: { terms: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {terms.map((term) => (
        <li
          key={term}
          className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700"
        >
          {term}
        </li>
      ))}
    </ul>
  )
}

function ActivityChrome({
  card,
  pagePrefix,
  emphasizeTitle = false,
}: {
  card: ActivityEvidenceCardModel
  pagePrefix: 'SB' | 'WB'
  emphasizeTitle?: boolean
}) {
  const evidence = card.evidence
  const title =
    card.activityNumber != null ? `Activity ${card.activityNumber}` : 'Activity'

  return (
    <div className="min-w-0 space-y-1">
      <p
        className={
          emphasizeTitle
            ? 'text-sm font-semibold tracking-tight text-slate-900'
            : 'text-xs font-semibold text-slate-900'
        }
      >
        {title}
      </p>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-medium text-slate-500">
          {pagePrefix} p.{card.printedPage}
        </span>
        {evidence.audioDependency ? (
          <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
            Audio
          </span>
        ) : null}
        {evidence.visualDependency ? (
          <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-medium text-sky-800">
            Visual
          </span>
        ) : null}
      </div>
    </div>
  )
}

function ActivityEvidenceDetails({
  card,
  showActivityType = true,
}: {
  card: ActivityEvidenceCardModel
  /** Left panel may show the verified type slug; modal review hides it. */
  showActivityType?: boolean
}) {
  const evidence = card.evidence
  const hasItems = evidence.items.some(
    (item) => item.prompt || item.expectedAnswer,
  )
  const hasLinkedVocab = card.pageDedicatedVocabulary.length > 0
  const hasPreviewValues =
    card.preview.kind !== 'empty' && card.preview.values.length > 0
  const showEnrichment =
    (showActivityType && Boolean(evidence.activityType)) ||
    evidence.audioDependency ||
    evidence.visualDependency ||
    Boolean(evidence.languageFrame) ||
    Boolean(evidence.prompt) ||
    Boolean(evidence.expectedAnswer) ||
    Boolean(evidence.sourceDependencyNote) ||
    hasItems ||
    hasLinkedVocab ||
    hasPreviewValues

  return (
    <>
      <p className="text-xs leading-relaxed text-slate-800">{card.verifiedWording}</p>

      {showEnrichment ? (
        <div className="mt-2 space-y-2 border-t border-slate-100 pt-2">
          {showActivityType && evidence.activityType ? (
            <p className="text-[11px] text-slate-600" data-activity-type-row>
              <span className="font-medium text-slate-500">Type:</span>{' '}
              {evidence.activityType}
            </p>
          ) : null}
          {evidence.languageFrame ? (
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Language frame
              </p>
              <LanguageFrameList lines={[evidence.languageFrame]} />
            </div>
          ) : null}
          {evidence.prompt ? (
            <p className="text-xs text-slate-700">
              <span className="font-medium text-slate-500">Prompt:</span>{' '}
              {evidence.prompt}
            </p>
          ) : null}
          {evidence.expectedAnswer ? (
            <p className="text-xs text-slate-700">
              <span className="font-medium text-slate-500">Expected answer:</span>{' '}
              {evidence.expectedAnswer}
            </p>
          ) : null}
          {hasItems ? (
            <ul className="space-y-1.5" aria-label="Activity items">
              {evidence.items.map((item, index) => {
                if (!item.prompt && !item.expectedAnswer) return null
                return (
                  <li
                    key={`${card.id}-item-${item.itemNumber ?? index}`}
                    className="rounded border border-slate-100 bg-slate-50/80 px-2 py-1.5"
                  >
                    <p className="text-[11px] font-medium text-slate-500">
                      Item {item.itemNumber ?? index + 1}
                    </p>
                    {item.prompt ? (
                      <p className="text-xs text-slate-800">{item.prompt}</p>
                    ) : null}
                    {item.expectedAnswer ? (
                      <p className="text-xs text-slate-600">
                        Answer: {item.expectedAnswer}
                      </p>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          ) : null}
          {hasPreviewValues &&
          card.preview.kind !== 'language_model' &&
          !evidence.languageFrame ? (
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {card.preview.kind === 'expected_answer'
                  ? 'Answer evidence'
                  : card.preview.kind === 'activity_item_model'
                    ? 'Item models'
                    : 'Task evidence'}
              </p>
              <ul className="space-y-0.5 text-xs text-slate-700">
                {card.preview.values.map((value) => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {evidence.sourceDependencyNote ? (
            <p className="text-[11px] leading-relaxed text-slate-500">
              {evidence.sourceDependencyNote}
            </p>
          ) : null}
          {hasLinkedVocab ? (
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Page vocabulary
              </p>
              <VocabularyChips terms={[...card.pageDedicatedVocabulary]} />
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  )
}

export function ActivityEvidenceBody({
  card,
  pagePrefix,
}: {
  card: ActivityEvidenceCardModel
  pagePrefix: 'SB' | 'WB'
}) {
  return (
    <div className="min-w-0 flex-1">
      <ActivityChrome card={card} pagePrefix={pagePrefix} />
      <div className="mt-1">
        <ActivityEvidenceDetails card={card} />
      </div>
    </div>
  )
}

function ExperimentalActivityEnrichment({
  card,
  pagePrefix,
  activitySelected,
  summary,
  guidance,
  guidanceSelected,
  onGuidanceSelectedChange,
}: {
  card: ActivityEvidenceCardModel
  pagePrefix: 'SB' | 'WB'
  activitySelected: boolean
  summary: Be3U08ActivitySummarySidecarRecord
  guidance: Be3U08TeachingGuidanceSidecarRecord
  guidanceSelected: boolean
  onGuidanceSelectedChange?: (selected: boolean) => void
}) {
  const baseId = useId()
  const guidancePanelId = `${baseId}-guidance`
  const [guidanceOpen, setGuidanceOpen] = useState(false)
  const guidanceAvailable =
    guidance.availability === 'available' && guidance.text !== null
  const guidanceCheckboxId =
    `activity-guidance-${summary.sourceEvidence.activityId}`

  return (
    <div className="min-w-0 flex-1 space-y-3" data-experimental-activity-enrichment>
      <ActivityChrome card={card} pagePrefix={pagePrefix} emphasizeTitle />

      <section
        aria-label="Experimental teacher-friendly summary"
        data-enrichment-layer="summary"
      >
        <p className="text-[10px] font-medium tracking-wide text-slate-500">
          AI summary · experimental
        </p>
        <p className="mt-1 text-sm leading-relaxed text-slate-900">{summary.text}</p>
        {summary.evidenceSufficiency === 'insufficient' ? (
          <p className="mt-1.5 text-[11px] leading-relaxed text-amber-800">
            Insufficient evidence for a fuller summary.
          </p>
        ) : null}
      </section>

      <div
        className="rounded-md border border-slate-200/80 bg-slate-50/50"
        data-enrichment-layer="guidance"
      >
        <button
          type="button"
          aria-expanded={guidanceOpen}
          aria-controls={guidancePanelId}
          onClick={() => setGuidanceOpen((open) => !open)}
          className="flex w-full items-center gap-2 px-2.5 py-2 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100/80"
          data-enrichment-guidance-toggle
        >
          <Lightbulb
            className={`h-3.5 w-3.5 shrink-0 ${
              guidanceOpen ? 'text-amber-600' : 'text-slate-500'
            }`}
            aria-hidden="true"
          />
          <span className="min-w-0 flex-1">Optional teaching guidance</span>
          <span className="shrink-0 text-[10px] font-normal text-slate-500">
            AI suggestion
          </span>
          <ChevronRight
            className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${
              guidanceOpen ? 'rotate-90' : ''
            }`}
            aria-hidden="true"
          />
        </button>
        {guidanceOpen ? (
          <div
            id={guidancePanelId}
            className="space-y-2 border-t border-slate-200/80 px-2.5 py-2.5"
          >
            {guidanceAvailable ? (
              <>
                <p className="text-xs leading-relaxed text-slate-700">
                  {guidance.text}
                </p>
                <label
                  htmlFor={guidanceCheckboxId}
                  className={`flex items-start gap-2 text-xs ${
                    activitySelected ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  <input
                    id={guidanceCheckboxId}
                    type="checkbox"
                    checked={activitySelected && guidanceSelected}
                    disabled={!activitySelected || !onGuidanceSelectedChange}
                    onChange={(event) =>
                      onGuidanceSelectedChange?.(event.target.checked)
                    }
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>
                    Include guidance in experimental lesson package
                    {!activitySelected ? ' (select the activity first)' : ''}
                  </span>
                </label>
              </>
            ) : (
              <p className="text-xs leading-relaxed text-amber-800">
                Guidance withheld: {guidance.withheldReason}
              </p>
            )}
          </div>
        ) : null}
      </div>
      {/*
        Publisher evidence remains in selection/package builders; it is not
        shown on enrichment POC cards so the teacher-facing surface stays summary-first.
      */}
    </div>
  )
}

export function ActivityEvidenceCard({
  card,
  pagePrefix,
  selected,
  onSelectedChange,
  checkboxId,
  compact = false,
  layout = 'panel',
  experimentalSummary,
  experimentalGuidance,
  guidanceSelected = false,
  onGuidanceSelectedChange,
}: {
  card: ActivityEvidenceCardModel
  pagePrefix: 'SB' | 'WB'
  selected?: boolean
  onSelectedChange?: (selected: boolean) => void
  checkboxId?: string
  /** Tighter chrome padding for dense grids. */
  compact?: boolean
  /**
   * `panel` — natural height (left panel).
   * `modal` — natural height; page columns scroll (no nested card scrollbars).
   */
  layout?: 'panel' | 'modal'
  /** Bounded BE3 U8 POC only; absent for all production/default-off paths. */
  experimentalSummary?: Be3U08ActivitySummarySidecarRecord | null
  /** Kept separate from the summary because it is an optional AI suggestion. */
  experimentalGuidance?: Be3U08TeachingGuidanceSidecarRecord | null
  guidanceSelected?: boolean
  onGuidanceSelectedChange?: (selected: boolean) => void
}) {
  const selectable = typeof onSelectedChange === 'function'
  const checked = selected ?? true
  const inputId =
    checkboxId ?? `activity-evidence-${pagePrefix.toLowerCase()}-${card.id}`
  const isModal = layout === 'modal'
  const showExperimentalEnrichment =
    isModal && experimentalSummary != null && experimentalGuidance != null

  const shellClass = [
    'rounded-lg border',
    selectable
      ? checked
        ? isModal
          ? 'border-slate-300 bg-white shadow-xs ring-1 ring-sky-200/70'
          : compact
            ? 'border-[#8bcfd9] bg-[#8bcfd9]/30 shadow-xs'
            : 'border-[#8bcfd9] bg-[#8bcfd9]/20 shadow-xs'
        : isModal
          ? 'border-slate-200 bg-white'
          : compact
            ? 'border-slate-200 bg-slate-50/75'
            : 'border-slate-200 bg-white shadow-xs'
      : 'border-slate-200 bg-white shadow-xs',
    isModal ? 'p-3' : compact ? 'p-2' : 'px-2.5 py-2',
  ].join(' ')

  const checkbox = selectable ? (
    <input
      id={inputId}
      type="checkbox"
      checked={checked}
      onChange={(event) => onSelectedChange?.(event.target.checked)}
      aria-label={`Include ${card.activityNumber ? `Activity ${card.activityNumber}` : 'activity'} on ${pagePrefix === 'SB' ? 'Student Book' : 'Workbook'} page ${card.printedPage}`}
      className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
    />
  ) : null

  if (isModal) {
    return (
      <li
        className={shellClass}
        data-activity-card-layout="modal"
        data-activity-card-height="natural"
      >
        <div className={selectable ? 'flex gap-2.5' : undefined}>
          {checkbox}
          {showExperimentalEnrichment ? (
            <ExperimentalActivityEnrichment
              card={card}
              pagePrefix={pagePrefix}
              activitySelected={checked}
              summary={experimentalSummary}
              guidance={experimentalGuidance}
              guidanceSelected={guidanceSelected}
              onGuidanceSelectedChange={onGuidanceSelectedChange}
            />
          ) : (
            <div className="min-w-0 flex-1 space-y-1.5">
              <ActivityChrome card={card} pagePrefix={pagePrefix} emphasizeTitle />
              <ActivityEvidenceDetails card={card} showActivityType={false} />
            </div>
          )}
        </div>
      </li>
    )
  }

  return (
    <li className={shellClass} data-activity-card-layout="panel">
      <div className={selectable ? 'flex gap-2.5' : undefined}>
        {checkbox}
        <ActivityEvidenceBody card={card} pagePrefix={pagePrefix} />
      </div>
    </li>
  )
}
