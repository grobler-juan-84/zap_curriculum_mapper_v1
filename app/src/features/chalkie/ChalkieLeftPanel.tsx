import React, { useEffect, useId, useState } from 'react'
import {
  BookOpen,
  Brain,
  ChevronDown,
  ChevronRight,
  ListChecks,
  MessageSquareText,
  Minus,
  Notebook,
  Plus,
  ShieldCheck,
  SpellCheck2,
  Target,
} from 'lucide-react'
import type { BookFileBatch } from '../../types/validation'
import type { CurriculumAuthorityState } from '../scope-sequence/scopeSequence'
import type { SbActivityCard } from './chalkieActivitySelection'
import {
  sbActivitySelectionStatus,
  type SbActivitySelectionState,
} from './chalkieActivitySelection'
import type { WbActivityCard } from './chalkieWorkbookActivitySelection'
import {
  wbActivitySelectionStatus,
  type WbActivitySelectionState,
} from './chalkieWorkbookActivitySelection'
import {
  buildBookContentCollapsedSummary,
  buildBookIntelligenceCollapsedSummary,
  type CurrentLessonContext,
} from './currentLessonContext'
import { UNIT_INTELLIGENCE_DISCLAIMER } from './chalkieUnitIntelligence'
import { ActivityEvidenceCard } from './ActivityEvidenceCard'
import { includedActivitiesCountLabel } from './lessonActivitySelection'

interface ChalkieLeftPanelProps {
  batch: BookFileBatch | null
  loading: boolean
  error: string | null
  /** Publisher Scope & Sequence authority; read-only and never AI-derived. */
  curriculumAuthority: CurriculumAuthorityState
  /** Neutral current-lesson package for the live PDF page scope. */
  currentLesson: CurrentLessonContext | null
  /** Authoritative SB activity selection (workspace-owned). */
  sbActivitySelection: SbActivitySelectionState
  /** Authoritative WB activity selection (workspace-owned). */
  wbActivitySelection: WbActivitySelectionState
  onSbActivitySelectionChange: (cardId: string, selected: boolean) => void
  onWbActivitySelectionChange: (cardId: string, selected: boolean) => void
}

type NestedBookSectionId =
  | 'objectives'
  | 'vocabulary'
  | 'language'
  | 'grammar'
  | 'activities'
  | 'workbook'

function objectiveItems(context: CurrentLessonContext): string[] {
  const view = context.bookContent.pagesView
  const items: string[] = []
  if (view.lessonTopic?.trim()) items.push(view.lessonTopic.trim())
  for (const label of view.pageLabels) {
    const trimmed = label.trim()
    if (trimmed && !items.includes(trimmed)) items.push(trimmed)
  }
  return items
}

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

function TopLevelAccordion(props: {
  id: string
  title: string
  badge: string
  summary: string
  open: boolean
  onToggle: () => void
  tone: 'authority' | 'book' | 'intelligence'
  children: React.ReactNode
}) {
  const { id, title, badge, summary, open, onToggle, tone, children } = props
  const panelId = `${id}-panel`
  const isAuthority = tone === 'authority'
  const isBook = tone === 'book'
  const shell = isAuthority
    ? 'border-emerald-300 bg-emerald-50/55'
    : isBook
      ? 'border-sky-200/90 bg-sky-50/40'
      : 'border-violet-200/90 bg-violet-50/40'
  const iconWrap = isAuthority
    ? 'bg-emerald-100 text-emerald-800'
    : isBook
      ? 'bg-sky-100 text-sky-700'
      : 'bg-violet-100 text-violet-700'
  const badgeClass = isAuthority
    ? 'border-emerald-300 bg-white text-emerald-900'
    : isBook
      ? 'border-sky-200 bg-white text-sky-800'
      : 'border-violet-200 bg-white text-violet-800'
  const Icon = isAuthority ? ShieldCheck : isBook ? BookOpen : Brain

  return (
    <section className={`overflow-hidden rounded-xl border ${shell}`}>
      <button
        type="button"
        id={id}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-white/55"
      >
        <span
          className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${iconWrap}`}
          aria-hidden="true"
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className="min-w-0 flex-1 space-y-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold tracking-tight text-slate-900">
              {title}
            </span>
            <span
              className={`rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${badgeClass}`}
            >
              {badge}
            </span>
          </span>
          {!open ? (
            <span className="block text-[11px] leading-relaxed text-slate-600">
              {summary}
            </span>
          ) : null}
        </span>
        <span className="mt-0.5 shrink-0 text-slate-400" aria-hidden="true">
          {open ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </span>
      </button>
      {open ? (
        <div
          id={panelId}
          role="region"
          aria-labelledby={id}
          className="border-t border-white/70 px-2.5 pb-2.5 pt-2"
        >
          {children}
        </div>
      ) : null}
    </section>
  )
}

function NestedAccordion(props: {
  id: string
  title: string
  countLabel?: string | null
  icon: React.ComponentType<{ className?: string }>
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  const { id, title, countLabel, icon: Icon, open, onToggle, children } = props
  const panelId = `${id}-panel`
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200/90 bg-white shadow-xs">
      <button
        type="button"
        id={id}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-2.5 py-2 text-left transition-colors hover:bg-slate-50"
      >
        <span
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-sky-50 text-sky-700"
          aria-hidden="true"
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold text-slate-800">{title}</span>
          {countLabel ? (
            <span className="block text-[11px] text-slate-500">{countLabel}</span>
          ) : null}
        </span>
        <span
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border border-slate-200 text-slate-500"
          aria-hidden="true"
        >
          {open ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
        </span>
      </button>
      {open ? (
        <div
          id={panelId}
          role="region"
          aria-labelledby={id}
          className="border-t border-slate-100 px-2.5 py-2"
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-xs leading-relaxed text-slate-700">
      {items.map((item) => (
        <li key={item} className="list-inside list-disc">
          {item}
        </li>
      ))}
    </ul>
  )
}

function VocabularyChips({ terms }: { terms: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Target vocabulary">
      {terms.map((term) => (
        <li
          key={term}
          className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-950"
        >
          {term}
        </li>
      ))}
    </ul>
  )
}

function LanguageFrameList({ lines }: { lines: string[] }) {
  return (
    <ul className="space-y-2" aria-label="Target language frames">
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

function VerifiedActivityList({
  cards,
  pagePrefix,
  selectedCardIds,
  onSelectedChange,
  checkboxIdPrefix,
}: {
  cards: readonly (SbActivityCard | WbActivityCard)[]
  pagePrefix: 'SB' | 'WB'
  selectedCardIds: readonly string[]
  onSelectedChange: (cardId: string, selected: boolean) => void
  checkboxIdPrefix: string
}) {
  const selected = new Set(selectedCardIds)
  return (
    <ul className="space-y-2" aria-label="Book activities">
      {cards.map((card) => (
        <ActivityEvidenceCard
          key={card.id}
          card={card}
          pagePrefix={pagePrefix}
          selected={selected.has(card.id)}
          onSelectedChange={(next) => onSelectedChange(card.id, next)}
          checkboxId={`${checkboxIdPrefix}-${card.id}`}
        />
      ))}
    </ul>
  )
}

export const ChalkieLeftPanel: React.FC<ChalkieLeftPanelProps> = ({
  batch,
  loading,
  error,
  curriculumAuthority,
  currentLesson,
  sbActivitySelection,
  wbActivitySelection,
  onSbActivitySelectionChange,
  onWbActivitySelectionChange,
}) => {
  const baseId = useId()
  const scopeBadge = currentLesson?.scope.rangeLabel ?? '—'
  const panelContextKey = currentLesson
    ? `${currentLesson.scope.sbPrintedPages.join(',')}|${
        currentLesson.bookContent.workbookCompanion?.relationshipId ?? ''
      }`
    : 'empty'

  const [authorityOpen, setAuthorityOpen] = useState(true)
  const [bookOpen, setBookOpen] = useState(true)
  const [intelligenceOpen, setIntelligenceOpen] = useState(false)
  const [nestedOpen, setNestedOpen] = useState<Record<NestedBookSectionId, boolean>>(
    {
      objectives: false,
      vocabulary: false,
      language: false,
      grammar: false,
      activities: false,
      workbook: false,
    },
  )

  useEffect(() => {
    setNestedOpen({
      objectives: false,
      vocabulary: false,
      language: false,
      grammar: false,
      activities: false,
      workbook: false,
    })
  }, [panelContextKey])

  const toggleNested = (id: NestedBookSectionId) => {
    setNestedOpen((current) => ({ ...current, [id]: !current[id] }))
  }

  const objectives = currentLesson ? objectiveItems(currentLesson) : []
  const pagesView = currentLesson?.bookContent.pagesView
  const vocabulary = pagesView
    ? pagesView.dedicatedVocabulary.length
      ? pagesView.dedicatedVocabulary
      : pagesView.vocabulary
    : []
  const languageLines = pagesView?.languageLines ?? []
  const grammarFocus = pagesView?.teachingFocus?.trim() || null
  const sbActivities = currentLesson?.bookContent.sbActivities ?? []
  const wbActivities = currentLesson?.bookContent.wbActivities ?? []
  const showWbSection = Boolean(
    currentLesson?.bookContent.workbookCompanion &&
      currentLesson.bookContent.workbookPrintedPages?.length,
  )
  const sbSelectionStatus = sbActivitySelectionStatus(
    sbActivities,
    sbActivitySelection,
  )
  const wbSelectionStatus = wbActivitySelectionStatus(
    wbActivities,
    wbActivitySelection,
  )

  const bookSummary = currentLesson
    ? buildBookContentCollapsedSummary(currentLesson.bookContent)
    : ''
  const intelligenceSummary = currentLesson
    ? buildBookIntelligenceCollapsedSummary(currentLesson.bookIntelligence)
    : ''
  const authoritySummary =
    curriculumAuthority.status === 'ready'
      ? `Unit ${curriculumAuthority.unit.unitNumberRaw}: ${curriculumAuthority.unit.unitTitleRaw}`
      : curriculumAuthority.status === 'loading'
        ? 'Loading verified publisher requirements…'
        : curriculumAuthority.status === 'unavailable'
          ? 'Publisher requirements unavailable; book evidence remains available.'
          : ''

  return (
    <div className="flex h-full select-none flex-col border-r border-slate-200 bg-white">
      <div className="flex h-11 shrink-0 items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="h-2 w-2 shrink-0 rounded-full bg-sky-600" />
          <h2 className="truncate text-xs font-bold tracking-tight text-slate-800 uppercase">
            Curriculum &amp; Intelligence
          </h2>
        </div>
        <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2 py-0.5 font-mono text-[11px] text-slate-600">
          {scopeBadge}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2.5 py-2.5">
        {loading ? (
          <p className="p-2 text-sm text-slate-500">Loading unit evidence…</p>
        ) : error ? (
          <div className="rounded border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
            {error}
          </div>
        ) : !currentLesson ? (
          <p className="p-2 text-sm text-slate-500">
            Select a unit to inspect curriculum evidence.
          </p>
        ) : (
          <div className="space-y-2.5">
            {curriculumAuthority.status !== 'not_configured' ? (
              <TopLevelAccordion
                id={`${baseId}-curriculum-authority`}
                title="Curriculum Authority"
                badge="Publisher SS · read-only"
                summary={authoritySummary}
                open={authorityOpen}
                onToggle={() => setAuthorityOpen((open) => !open)}
                tone="authority"
              >
                {curriculumAuthority.status === 'loading' ? (
                  <p className="text-xs text-slate-500">
                    Loading verified publisher requirements…
                  </p>
                ) : curriculumAuthority.status === 'unavailable' ? (
                  <p className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs leading-relaxed text-amber-900">
                    {curriculumAuthority.message}
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    <div className="rounded-lg border border-emerald-200 bg-white px-2.5 py-2">
                      <p className="text-xs font-bold text-emerald-950">
                        Unit {curriculumAuthority.unit.unitNumberRaw}:{' '}
                        {curriculumAuthority.unit.unitTitleRaw}
                      </p>
                      <p className="mt-0.5 text-[11px] text-emerald-800">
                        {curriculumAuthority.unit.studentBookPagesRaw}
                      </p>
                    </div>
                    <dl className="space-y-2">
                      {curriculumAuthority.unit.publisherCategories.map((category) => (
                        <div
                          key={`${category.columnOrder}-${category.categoryNameRaw}`}
                          className="rounded-lg border border-emerald-100 bg-white px-2.5 py-2"
                        >
                          <dt className="mb-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-900">
                            {category.categoryNameRaw}
                          </dt>
                          <dd className="text-xs leading-relaxed whitespace-pre-wrap text-slate-700">
                            {category.rawText}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <p className="px-0.5 text-[10px] leading-relaxed text-slate-500">
                      Source: {curriculumAuthority.document.sourceMetadata.sourceFilename} ·{' '}
                      {curriculumAuthority.document.schemaVersion}. Publisher curriculum
                      authority; separate from textbook evidence and AI interpretation.
                    </p>
                  </div>
                )}
              </TopLevelAccordion>
            ) : null}

            <TopLevelAccordion
              id={`${baseId}-book-content`}
              title="Book Content"
              badge="Verified source"
              summary={
                currentLesson.bookContent.unitView
                  ? bookSummary
                  : 'Outside selected unit pages — Unit evidence chrome cleared'
              }
              open={bookOpen}
              onToggle={() => setBookOpen((open) => !open)}
              tone="book"
            >
              <div className="space-y-2">
                <p className="px-0.5 text-[11px] leading-relaxed text-slate-500">
                  Textbook-grounded evidence for {scopeBadge}
                  {currentLesson.bookContent.unitView && currentLesson.scope.unitLabel
                    ? ` · ${currentLesson.scope.unitLabel}`
                    : ''}
                  {currentLesson.bookContent.unitView && batch?.label
                    ? ` · ${batch.label}`
                    : ''}
                  {!currentLesson.bookContent.unitView
                    ? currentLesson.scope.unitLabel
                      ? ` · PDF page maps to ${currentLesson.scope.unitLabel} (select that unit for its book evidence)`
                      : ' · current PDF page is outside the selected unit'
                    : ''}
                  .
                </p>

                {objectives.length > 0 ? (
                  <NestedAccordion
                    id={`${baseId}-objectives`}
                    title="Curriculum Objectives"
                    countLabel={`${objectives.length} listed`}
                    icon={Target}
                    open={nestedOpen.objectives}
                    onToggle={() => toggleNested('objectives')}
                  >
                    <BulletList items={objectives} />
                  </NestedAccordion>
                ) : null}

                {vocabulary.length > 0 ? (
                  <NestedAccordion
                    id={`${baseId}-vocabulary`}
                    title="Target Vocabulary"
                    countLabel={`${vocabulary.length} words/models`}
                    icon={SpellCheck2}
                    open={nestedOpen.vocabulary}
                    onToggle={() => toggleNested('vocabulary')}
                  >
                    <VocabularyChips terms={[...vocabulary]} />
                    {pagesView &&
                    !pagesView.hasDedicatedVocabulary &&
                    pagesView.hasActivityDerivedModels ? (
                      <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                        Includes activity-derived models where dedicated vocabulary rows are
                        absent.
                      </p>
                    ) : null}
                  </NestedAccordion>
                ) : null}

                {languageLines.length > 0 ? (
                  <NestedAccordion
                    id={`${baseId}-language`}
                    title="Target Language Frame"
                    countLabel={
                      languageLines.length === 1
                        ? '1 frame'
                        : `${languageLines.length} frames`
                    }
                    icon={MessageSquareText}
                    open={nestedOpen.language}
                    onToggle={() => toggleNested('language')}
                  >
                    <LanguageFrameList lines={[...languageLines]} />
                  </NestedAccordion>
                ) : null}

                {grammarFocus ? (
                  <NestedAccordion
                    id={`${baseId}-grammar`}
                    title="Grammar / Language Focus"
                    countLabel="Planning summary"
                    icon={ListChecks}
                    open={nestedOpen.grammar}
                    onToggle={() => toggleNested('grammar')}
                  >
                    <BulletList items={[grammarFocus]} />
                    <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                      Derived from verified page metadata — not a publisher quotation.
                    </p>
                  </NestedAccordion>
                ) : null}

                {sbActivities.length > 0 ? (
                  <NestedAccordion
                    id={`${baseId}-activities`}
                    title="Book Activities"
                    countLabel={includedActivitiesCountLabel(
                      sbSelectionStatus.selectedCount,
                      sbSelectionStatus.totalCount,
                    )}
                    icon={Notebook}
                    open={nestedOpen.activities}
                    onToggle={() => toggleNested('activities')}
                  >
                    <div className="space-y-2">
                      <p className="text-[11px] leading-relaxed text-slate-500">
                        Choose which verified Student Book activities will be carried into
                        prompt preparation. Deselected activities stay out of the neutral
                        package.
                      </p>
                      <p
                        className="text-[11px] font-medium text-slate-600"
                        aria-live="polite"
                      >
                        {includedActivitiesCountLabel(
                          sbSelectionStatus.selectedCount,
                          sbSelectionStatus.totalCount,
                        )}
                      </p>
                      <VerifiedActivityList
                        cards={sbActivities}
                        pagePrefix="SB"
                        selectedCardIds={sbActivitySelection.selectedCardIds}
                        onSelectedChange={onSbActivitySelectionChange}
                        checkboxIdPrefix={`${baseId}-sb-activity`}
                      />
                    </div>
                  </NestedAccordion>
                ) : null}

                {showWbSection ? (
                  <NestedAccordion
                    id={`${baseId}-workbook`}
                    title="Workbook Companion"
                    countLabel={
                      wbActivities.length > 0
                        ? includedActivitiesCountLabel(
                            wbSelectionStatus.selectedCount,
                            wbSelectionStatus.totalCount,
                          )
                        : currentLesson.bookContent.workbookPrintedPages
                          ? `pp. ${currentLesson.bookContent.workbookPrintedPages.join('–')}`
                          : null
                    }
                    icon={Notebook}
                    open={nestedOpen.workbook}
                    onToggle={() => toggleNested('workbook')}
                  >
                    <div className="space-y-2">
                      <p className="text-[11px] leading-relaxed text-slate-500">
                        Mapped Workbook consolidation/practice (verified companion). Separate
                        from Student Book lesson identity. Selection here also controls what
                        enters prompt preparation.
                      </p>
                      {currentLesson.bookContent.workbookCompanion?.relationshipId ? (
                        <p className="font-mono text-[10px] text-slate-400">
                          {
                            currentLesson.bookContent.workbookCompanion
                              .relationshipId
                          }
                        </p>
                      ) : null}
                      {wbActivities.length > 0 ? (
                        <>
                          <p
                            className="text-[11px] font-medium text-slate-600"
                            aria-live="polite"
                          >
                            {includedActivitiesCountLabel(
                              wbSelectionStatus.selectedCount,
                              wbSelectionStatus.totalCount,
                            )}
                          </p>
                          <VerifiedActivityList
                            cards={wbActivities}
                            pagePrefix="WB"
                            selectedCardIds={wbActivitySelection.selectedCardIds}
                            onSelectedChange={onWbActivitySelectionChange}
                            checkboxIdPrefix={`${baseId}-wb-activity`}
                          />
                        </>
                      ) : (
                        <p className="text-xs text-slate-500">
                          No human-verified Workbook activity cards are available for this
                          companion.
                        </p>
                      )}
                    </div>
                  </NestedAccordion>
                ) : null}

                {objectives.length === 0 &&
                vocabulary.length === 0 &&
                languageLines.length === 0 &&
                !grammarFocus &&
                sbActivities.length === 0 &&
                !showWbSection ? (
                  <p className="rounded-lg border border-dashed border-slate-200 bg-white px-3 py-2 text-xs leading-relaxed text-slate-500">
                    {pagesView?.emptyMessage ??
                      'No verified Student Book evidence is available for this page scope.'}
                  </p>
                ) : null}
              </div>
            </TopLevelAccordion>

            <TopLevelAccordion
              id={`${baseId}-book-intelligence`}
              title="Book Intelligence"
              badge="Teacher interpretation"
              summary={intelligenceSummary}
              open={intelligenceOpen}
              onToggle={() => setIntelligenceOpen((open) => !open)}
              tone="intelligence"
            >
              <div className="space-y-2.5">
                <p className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[11px] leading-relaxed text-amber-900">
                  {UNIT_INTELLIGENCE_DISCLAIMER}
                </p>
                {currentLesson.bookIntelligence.status === 'loading' ? (
                  <p className="text-xs text-slate-500">Loading Book Intelligence…</p>
                ) : currentLesson.bookIntelligence.status === 'unavailable' ? (
                  <p className="text-xs leading-relaxed text-slate-500">
                    {currentLesson.bookIntelligence.message}
                  </p>
                ) : (
                  <>
                    <div className="rounded-lg border border-violet-200/80 bg-white px-2.5 py-2">
                      <p className="text-xs font-semibold text-slate-900">
                        Unit {currentLesson.bookIntelligence.unitNumber}:{' '}
                        {currentLesson.bookIntelligence.title}
                      </p>
                      {currentLesson.bookIntelligence.pageRange ? (
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          {currentLesson.bookIntelligence.pageRange}
                          {currentLesson.bookIntelligence.layer ? (
                            <span className="text-slate-400">
                              {' '}
                              · {currentLesson.bookIntelligence.layer}
                            </span>
                          ) : null}
                        </p>
                      ) : currentLesson.bookIntelligence.layer ? (
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {currentLesson.bookIntelligence.layer}
                        </p>
                      ) : null}
                    </div>
                    <dl className="space-y-2">
                      {currentLesson.bookIntelligence.fields.map((field) => (
                        <div
                          key={field.key}
                          className="rounded-lg border border-violet-100 bg-white px-2.5 py-2"
                        >
                          <dt className="mb-0.5 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-violet-800/80">
                            <span>{field.label}</span>
                            {field.badge ? (
                              <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold normal-case tracking-normal text-violet-800">
                                {field.badge}
                              </span>
                            ) : null}
                          </dt>
                          <dd className="text-xs leading-relaxed whitespace-pre-wrap text-slate-700">
                            {field.value || '—'}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </>
                )}
              </div>
            </TopLevelAccordion>
          </div>
        )}
      </div>
    </div>
  )
}
