/**
 * Shared verified activity evidence disclosure for left panel and preparation review.
 * Selection controls are optional props — this component does not own workspace state.
 *
 * `layout="modal"` bounds card height and scrolls rich evidence inside the card so the
 * open-book review pages stay equal height. Left-panel callers keep the default layout.
 */
import type { SbActivityCard } from './chalkieActivitySelection'
import type { WbActivityCard } from './chalkieWorkbookActivitySelection'
import type {
  Be3U08ActivitySummarySidecarRecord,
  Be3U08TeachingGuidanceSidecarRecord,
} from './be3U08ActivityEnrichmentPoc'

export type ActivityEvidenceCardModel = SbActivityCard | WbActivityCard

/** Shared modal card height so rich and sparse activities occupy the same footprint. */
export const MODAL_ACTIVITY_CARD_HEIGHT_CLASS = 'h-[11.5rem]'

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
}: {
  card: ActivityEvidenceCardModel
  pagePrefix: 'SB' | 'WB'
}) {
  const evidence = card.evidence
  const title =
    card.activityNumber != null ? `Activity ${card.activityNumber}` : 'Activity'

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <p className="text-xs font-semibold text-slate-900">{title}</p>
      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
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

const modalCardScrollClass =
  'min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:rgb(148_163_184)_transparent]'

function ExperimentalActivityEnrichment({
  card,
  activitySelected,
  summary,
  guidance,
  guidanceSelected,
  onGuidanceSelectedChange,
}: {
  card: ActivityEvidenceCardModel
  activitySelected: boolean
  summary: Be3U08ActivitySummarySidecarRecord
  guidance: Be3U08TeachingGuidanceSidecarRecord
  guidanceSelected: boolean
  onGuidanceSelectedChange?: (selected: boolean) => void
}) {
  const guidanceAvailable =
    guidance.availability === 'available' && guidance.text !== null
  const guidanceCheckboxId =
    `activity-guidance-${summary.sourceEvidence.activityId}`

  return (
    <div className="space-y-2" data-experimental-activity-enrichment>
      <section
        className="rounded-md border border-indigo-100 bg-indigo-50/70 p-2"
        aria-label="Experimental teacher-friendly summary"
        data-enrichment-layer="summary"
      >
        <p className="text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
          Teacher-friendly summary · Experimental interpretation
        </p>
        <p className="mt-1 text-xs leading-relaxed text-slate-800">{summary.text}</p>
        {summary.evidenceSufficiency === 'insufficient' ? (
          <p className="mt-1 text-[11px] font-medium text-amber-800">
            Insufficient evidence for a fuller summary.
          </p>
        ) : null}
      </section>

      <details
        className="rounded-md border border-violet-100 bg-violet-50/60 px-2 py-1.5"
        data-enrichment-layer="guidance"
      >
        <summary className="cursor-pointer text-[11px] font-semibold text-violet-800">
          Optional teaching guidance · AI suggestion
        </summary>
        {guidanceAvailable ? (
          <div className="mt-2 space-y-2">
            <p className="text-xs leading-relaxed text-slate-700">{guidance.text}</p>
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
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
              />
              <span>
                Include guidance in experimental lesson package
                {!activitySelected ? ' (select the activity first)' : ''}
              </span>
            </label>
          </div>
        ) : (
          <p className="mt-2 text-xs leading-relaxed text-amber-800">
            Guidance withheld: {guidance.withheldReason}
          </p>
        )}
      </details>

      <details
        className="rounded-md border border-slate-200 bg-white px-2 py-1.5"
        data-enrichment-layer="publisher_evidence"
      >
        <summary className="cursor-pointer text-[11px] font-semibold text-slate-700">
          Original publisher evidence · Human verified
        </summary>
        <div className="mt-2 border-t border-slate-100 pt-2">
          <ActivityEvidenceDetails card={card} showActivityType={false} />
        </div>
      </details>
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
   * `modal` — fixed shared height; chrome stays put; evidence scrolls inside.
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
    selectable
      ? checked
        ? compact || isModal
          ? 'rounded-lg border border-[#8bcfd9] bg-[#8bcfd9]/30 shadow-xs'
          : 'rounded-md border border-[#8bcfd9] bg-[#8bcfd9]/20 shadow-xs'
        : compact || isModal
          ? 'rounded-lg border border-slate-200 bg-slate-50/75'
          : 'rounded-md border border-slate-200 bg-white shadow-xs'
      : 'rounded-md border border-slate-200 bg-white shadow-xs',
    isModal
      ? `flex ${MODAL_ACTIVITY_CARD_HEIGHT_CLASS} flex-col overflow-hidden p-2`
      : compact
        ? 'p-2'
        : 'px-2.5 py-2',
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
        data-activity-card-height="bounded"
      >
        <div className="flex shrink-0 gap-2.5">
          {checkbox}
          <div className="min-w-0 flex-1">
            <ActivityChrome card={card} pagePrefix={pagePrefix} />
          </div>
        </div>
        <div
          className={`${modalCardScrollClass} mt-1.5 ${selectable ? 'pl-[1.625rem]' : ''}`}
          data-activity-card-scroll
        >
          {showExperimentalEnrichment ? (
            <ExperimentalActivityEnrichment
              card={card}
              activitySelected={checked}
              summary={experimentalSummary}
              guidance={experimentalGuidance}
              guidanceSelected={guidanceSelected}
              onGuidanceSelectedChange={onGuidanceSelectedChange}
            />
          ) : (
            <ActivityEvidenceDetails card={card} showActivityType={false} />
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
