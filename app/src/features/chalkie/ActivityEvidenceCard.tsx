/**
 * Shared verified activity evidence disclosure for left panel and preparation review.
 * Selection controls are optional props — this component does not own workspace state.
 *
 * `layout="modal"` expands cards to their content; page columns scroll. Left-panel
 * callers keep the default compact layout.
 *
 * Bounded BE3 U8 enrichment POC cards (when enabled) show checkbox, activity chrome,
 * AI summary, and insufficient-evidence warning only.
 */
import type { SbActivityCard } from './chalkieActivitySelection'
import type { WbActivityCard } from './chalkieWorkbookActivitySelection'
import type { Be3U08ExperimentalSummaryDisplay } from './be3U08ActivityEnrichmentPoc'

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

function ExperimentalSummarySection({
  summary,
  label,
  ariaLabel,
}: {
  summary: Be3U08ExperimentalSummaryDisplay
  label: string
  ariaLabel: string
}) {
  return (
    <section aria-label={ariaLabel} data-enrichment-layer="summary">
      <p className="text-[10px] font-medium tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-slate-900">{summary.text}</p>
      {summary.evidenceSufficiency === 'insufficient' ? (
        <p className="mt-1.5 text-[11px] leading-relaxed text-amber-800">
          Insufficient evidence for a fuller summary.
        </p>
      ) : null}
    </section>
  )
}

function ExperimentalActivityEnrichment({
  card,
  pagePrefix,
  summary,
}: {
  card: ActivityEvidenceCardModel
  pagePrefix: 'SB' | 'WB'
  summary: Be3U08ExperimentalSummaryDisplay
}) {
  return (
    <div className="min-w-0 flex-1 space-y-3" data-experimental-activity-enrichment>
      <ActivityChrome card={card} pagePrefix={pagePrefix} emphasizeTitle />

      <ExperimentalSummarySection
        summary={summary}
        label="AI summary · experimental"
        ariaLabel="Experimental teacher-friendly summary"
      />
      {/*
        Publisher evidence remains in selection/package builders; it is not
        shown on enrichment POC cards so the teacher-facing surface stays summary-first.
      */}
    </div>
  )
}

const POC_COMPARISON_LABEL = 'POC summary · experimental'
const NLL_COMPARISON_LABEL = 'NLL summary · experimental'

function NllComparisonColumn({
  status,
  summary,
}: {
  status: NllCardComparisonDisplayState['status']
  summary: Be3U08ExperimentalSummaryDisplay | null
}) {
  if (status === 'loading') {
    return (
      <section
        aria-label={NLL_COMPARISON_LABEL}
        data-nll-comparison-column="loading"
      >
        <p className="text-[10px] font-medium tracking-wide text-slate-500">
          {NLL_COMPARISON_LABEL}
        </p>
        <p className="mt-1 text-sm italic leading-relaxed text-slate-500">
          Loading NLL summary…
        </p>
      </section>
    )
  }
  if (status === 'success' && summary) {
    return (
      <div data-nll-comparison-column="success">
        <ExperimentalSummarySection
          summary={summary}
          label={NLL_COMPARISON_LABEL}
          ariaLabel={NLL_COMPARISON_LABEL}
        />
      </div>
    )
  }
  const message =
    status === 'unavailable'
      ? 'NLL summary unavailable.'
      : status === 'error'
        ? 'NLL summary could not be loaded.'
        : 'NLL summary not available for this activity.'
  return (
    <section
      aria-label={NLL_COMPARISON_LABEL}
      data-nll-comparison-column={status}
    >
      <p className="text-[10px] font-medium tracking-wide text-slate-500">
        {NLL_COMPARISON_LABEL}
      </p>
      <p className="mt-1 text-sm italic leading-relaxed text-slate-500">{message}</p>
    </section>
  )
}

function NllCardComparisonEnrichment({
  card,
  pagePrefix,
  pocSummary,
  nllComparison,
}: {
  card: ActivityEvidenceCardModel
  pagePrefix: 'SB' | 'WB'
  pocSummary: Be3U08ExperimentalSummaryDisplay | null
  nllComparison: NllCardComparisonDisplayState
}) {
  return (
    <div
      className="min-w-0 flex-1 space-y-3"
      data-experimental-activity-enrichment
      data-nll-card-comparison="true"
    >
      <ActivityChrome card={card} pagePrefix={pagePrefix} emphasizeTitle />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="min-w-0" data-poc-comparison-column>
          {pocSummary ? (
            <ExperimentalSummarySection
              summary={pocSummary}
              label={POC_COMPARISON_LABEL}
              ariaLabel={POC_COMPARISON_LABEL}
            />
          ) : (
            <section aria-label={POC_COMPARISON_LABEL}>
              <p className="text-[10px] font-medium tracking-wide text-slate-500">
                {POC_COMPARISON_LABEL}
              </p>
              <p className="mt-1 text-sm italic leading-relaxed text-slate-500">
                POC summary not available for this activity.
              </p>
            </section>
          )}
        </div>
        <div className="min-w-0">
          <NllComparisonColumn
            status={nllComparison.status}
            summary={nllComparison.summary}
          />
        </div>
      </div>
    </div>
  )
}

/** Stage 3 NLL side of POC↔NLL card comparison (modal Opener scope only). */
export type NllCardComparisonDisplayState = {
  readonly status: 'loading' | 'success' | 'empty' | 'unavailable' | 'error'
  readonly summary: Be3U08ExperimentalSummaryDisplay | null
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
  nllComparison = null,
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
  experimentalSummary?: Be3U08ExperimentalSummaryDisplay | null
  /**
   * When set on modal cards, shows labelled POC + NLL summaries side by side.
   * Ignored for left-panel (`panel`) layout. Never blank the whole card.
   */
  nllComparison?: NllCardComparisonDisplayState | null
}) {
  const selectable = typeof onSelectedChange === 'function'
  const checked = selected ?? true
  const inputId =
    checkboxId ?? `activity-evidence-${pagePrefix.toLowerCase()}-${card.id}`
  const isModal = layout === 'modal'
  const showNllComparison = isModal && nllComparison != null
  const showExperimentalEnrichment =
    isModal && !showNllComparison && experimentalSummary != null

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
          {showNllComparison ? (
            <NllCardComparisonEnrichment
              card={card}
              pagePrefix={pagePrefix}
              pocSummary={experimentalSummary ?? null}
              nllComparison={nllComparison}
            />
          ) : showExperimentalEnrichment ? (
            <ExperimentalActivityEnrichment
              card={card}
              pagePrefix={pagePrefix}
              summary={experimentalSummary}
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
