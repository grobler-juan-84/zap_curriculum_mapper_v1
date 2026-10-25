/**
 * Neutral current-lesson context for the teacher-facing curriculum panel.
 *
 * Assembles page-scoped Phase 1 Book Content and separately labelled Phase 2
 * Book Intelligence. Contains no Chalkie packaging, prompt strings, or
 * generator-specific types. Folder location under features/chalkie is
 * transitional for the current route.
 *
 * Relocation follow-up (parked): moving this file alone would still import
 * chalkie-named activity/evidence/BI builders, or require moving that whole
 * neutral cluster together. Do not create a half-neutral duplicate.
 */

import type { BatchJsonSummary } from '../../types/validation'
import type { BookIntelligenceOverviewDocument } from '../../types/bookIntelligence'
import {
  buildUnitSummaryView,
  buildVisiblePagesView,
  type UnitSummaryView,
  type VisiblePagesView,
} from './chalkieEvidence'
import {
  buildSbActivityCards,
  type SbActivityCard,
} from './chalkieActivitySelection'
import {
  buildWbActivityCards,
  type WbActivityCard,
} from './chalkieWorkbookActivitySelection'
import type { VerifiedSbWbCompanion } from './resolveVerifiedSbWbCompanion'
import {
  buildChalkieUnitIntelligenceView,
  type ChalkieUnitIntelligenceView,
} from './chalkieUnitIntelligence'

export type CurrentLessonScope = {
  readonly sbPrintedPages: readonly number[]
  readonly rangeLabel: string | null
  readonly unitLabel: string | null
  readonly unitPageRange: string | null
}

export type CurrentLessonBookContent = {
  /** Page-scoped Phase 1 projections (topic, vocab, language, focus). */
  readonly pagesView: VisiblePagesView
  readonly unitView: UnitSummaryView | null
  /** Human-verified SB activity cards for the current page scope. */
  readonly sbActivities: readonly SbActivityCard[]
  /** Human-verified WB activity cards when a companion resolves; otherwise empty. */
  readonly wbActivities: readonly WbActivityCard[]
  readonly workbookCompanion: VerifiedSbWbCompanion | null
  readonly workbookPrintedPages: readonly number[] | null
}

export type CurrentLessonContext = {
  readonly scope: CurrentLessonScope
  readonly bookContent: CurrentLessonBookContent
  /** Phase 2 interpretation only — never page-scoped source evidence. */
  readonly bookIntelligence: ChalkieUnitIntelligenceView
}

function rangeLabelFor(pages: readonly number[]): string | null {
  if (pages.length === 0) return null
  if (pages.length === 1) return `p. ${pages[0]}`
  return `pp. ${pages[0]}–${pages[pages.length - 1]}`
}

export function buildBookContentCollapsedSummary(
  bookContent: CurrentLessonBookContent,
): string {
  const view = bookContent.pagesView
  const objectives: string[] = []
  if (view.lessonTopic?.trim()) objectives.push(view.lessonTopic.trim())
  for (const label of view.pageLabels) {
    const trimmed = label.trim()
    if (trimmed && !objectives.includes(trimmed)) objectives.push(trimmed)
  }
  const vocabulary = view.dedicatedVocabulary.length
    ? view.dedicatedVocabulary
    : view.vocabulary
  const language = view.languageLines
  const hasGrammar = Boolean(view.teachingFocus?.trim())
  const activityCount = bookContent.sbActivities.length
  const hasWorkbook = bookContent.workbookCompanion != null

  const parts: string[] = []
  if (objectives.length > 0) parts.push('Objectives')
  if (vocabulary.length > 0) {
    parts.push(
      vocabulary.length === 1
        ? '1 vocabulary word'
        : `${vocabulary.length} vocabulary words`,
    )
  }
  if (language.length > 0) {
    parts.push(language.length === 1 ? 'Target frame' : `${language.length} language frames`)
  }
  if (hasGrammar) parts.push('Language focus')
  if (activityCount > 0) {
    parts.push(activityCount === 1 ? '1 activity' : `${activityCount} activities`)
  }
  if (hasWorkbook) parts.push('Workbook companion')
  return parts.length > 0
    ? parts.join(' · ')
    : 'No verified page evidence for this scope'
}

export function buildBookIntelligenceCollapsedSummary(
  view: ChalkieUnitIntelligenceView,
): string {
  if (view.status === 'loading') return 'Loading…'
  if (view.status === 'unavailable') return 'Not available for this book/unit yet'
  const labels = view.fields
    .filter((field) => field.value.trim().length > 0)
    .map((field) => field.label)
    .slice(0, 5)
  if (labels.length === 0) return 'No interpretation fields present'
  return labels.join(' · ')
}

export function buildCurrentLessonContext(input: {
  summary: BatchJsonSummary | null
  sbPrintedPages: readonly number[]
  workbookSummary?: BatchJsonSummary | null
  workbookCompanion?: VerifiedSbWbCompanion | null
  bookIntelligence?: BookIntelligenceOverviewDocument | null
  bookIntelligenceLoading?: boolean
  unitNumber?: string | number | null
}): CurrentLessonContext {
  const sbPrintedPages = input.sbPrintedPages.filter(Number.isFinite).map(Math.floor)
  const unitView = input.summary ? buildUnitSummaryView(input.summary) : null
  const pagesView = buildVisiblePagesView(input.summary, sbPrintedPages)
  const sbActivities = buildSbActivityCards({
    summary: input.summary,
    activeLessonPrintedPages: sbPrintedPages,
  })
  const companion = input.workbookCompanion ?? null
  const wbActivities =
    companion != null
      ? buildWbActivityCards({
          summary: input.workbookSummary ?? null,
          companion,
        })
      : []

  const unitNumber =
    input.unitNumber ??
    input.summary?.units[0]?.unitNumber ??
    null

  const bookIntelligence = buildChalkieUnitIntelligenceView({
    loading: input.bookIntelligenceLoading,
    document: input.bookIntelligence ?? null,
    unitNumber,
  })

  return {
    scope: {
      sbPrintedPages,
      rangeLabel: rangeLabelFor(sbPrintedPages),
      unitLabel: unitView?.unitLabel ?? null,
      unitPageRange: unitView?.pageRange ?? null,
    },
    bookContent: {
      pagesView,
      unitView,
      sbActivities,
      wbActivities,
      workbookCompanion: companion,
      workbookPrintedPages: companion?.workbookPrintedPages ?? null,
    },
    bookIntelligence,
  }
}
