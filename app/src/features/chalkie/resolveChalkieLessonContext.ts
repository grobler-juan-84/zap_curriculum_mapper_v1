/**
 * Resolves a truthful Chalkie lesson context from the selected book/unit
 * and the currently open PDF printed pages. No silent BE2 U8 fallback.
 */
import type { Book } from '../../types/curriculum'
import type { BatchJsonSummary } from '../../types/validation'
import {
  buildUnitSummaryView,
  buildVisiblePagesView,
  type ChalkieOutlineActivity,
} from './chalkieEvidence'
import {
  BE2_U08_CLARIFICATION,
  BE2_U08_LANGUAGE,
  BE2_U08_VOCABULARY,
  BE2_U08_PROTOTYPE_ACTIVITIES,
  BE2_U08_PROTOTYPE_FOCUS,
  BE2_U08_PROTOTYPE_PAGE_LABELS,
  BE2_U08_SERIES_LESSON_TITLE,
  BE2_U08_SINGLE_LESSON_TITLE,
  isBe2StudentBook,
  isBe2U08PrototypePages,
  type TeacherChoiceLanguageExample,
} from './teacherChoicePrototypeContent'
import {
  BE2_U08_AI_SUGGESTIONS,
  type TeacherChoiceSuggestion,
} from './teacherChoiceSuggestions'
import { deriveSameUnitEarlierVocabularySuggestions } from './deriveSameUnitEarlierVocabularySuggestions'
import { buildChalkieLessonNaming } from './buildChalkieLessonNaming'
import {
  resolveVerifiedSbWbCompanion,
  type VerifiedSbWbCompanion,
} from './resolveVerifiedSbWbCompanion'

export type ChalkieLessonContextStatus =
  | 'ready'
  | 'out_of_unit'
  | 'no_visible_pages'
  | 'no_page_evidence'
  | 'no_unit_range'

export type ChalkieLessonContext = {
  status: ChalkieLessonContextStatus
  catalogBookId: string | null
  bookLabel: string
  unitNumber: number | null
  unitTitle: string | null
  unitLine: string
  visiblePrintedPages: number[]
  visiblePageRangeLabel: string
  unitPrintedPageStart: number | null
  unitPrintedPageEnd: number | null
  unitPageRangeLabel: string | null
  /** Page-section labels for orientation (not a communicative aim). */
  currentFocus: string
  /** Verified page heading / curriculum-component topic (not a teaching aim). */
  lessonTopic: string | null
  /**
   * Planning summary derived from verified activity/component evidence.
   * Not a publisher quotation — show with planning-summary wording in UI/prompt.
   */
  teachingFocus: string | null
  /** Dedicated vocab rows and/or activity-derived models for teacher display. */
  vocabulary: string[]
  hasDedicatedVocabulary: boolean
  hasActivityDerivedModels: boolean
  languageExamples: TeacherChoiceLanguageExample[]
  hasDedicatedLanguage: boolean
  hasActivityLanguageFrames: boolean
  clarification: string | null
  activityLines: string[]
  /** Verified visible-page activities for the concise outline (not Screen 1). */
  outlineActivities: ChalkieOutlineActivity[]
  pageLabels: string[]
  /** Exact BE2 SB Unit 8 · pp. 128–129 curated prototype route. */
  isBe2U08PrototypeRoute: boolean
  supportsTwoLessonSeries: boolean
  /**
   * Verified SB→WB companion from explicit human-verified cross-book relationships only.
   * Null when no pairing exists — never filled by structural heuristics.
   */
  workbookCompanion: VerifiedSbWbCompanion | null
  priorLearningSuggestions: TeacherChoiceSuggestion[]
  singleLessonTitle: string
  seriesLessonTitle: string | null
  /**
   * Filename/database-safe tracking id (e.g. be3-sb-u08-p132-133).
   * Not copied as the teacher-facing lesson title. Optional `-l01` / `-l02`
   * suffixes may be appended later when multiple lessons share a spread.
   */
  stableLessonReference: string | null
  scopeMessage: string | null
  canJumpToUnitOpening: boolean
  unitOpeningPrintedPage: number | null
  hasVerifiedPageEvidence: boolean
  evidenceUnavailableMessage: string | null
  /** Optional unit-level note; never presented as visible-page evidence. */
  unitContextNote: string | null
}

function emptyEvidenceFlags() {
  return {
    lessonTopic: null as string | null,
    teachingFocus: null as string | null,
    hasDedicatedVocabulary: false,
    hasActivityDerivedModels: false,
    hasDedicatedLanguage: false,
    hasActivityLanguageFrames: false,
    outlineActivities: [] as ChalkieOutlineActivity[],
  }
}

function formatPageRange(pages: number[]): string {
  if (pages.length === 0) return '—'
  if (pages.length === 1) return `p. ${pages[0]}`
  return `pp. ${pages[0]}–${pages[pages.length - 1]}`
}

function formatUnitPageRange(start: number | null, end: number | null): string | null {
  if (start == null || end == null) return null
  return `pp. ${start}–${end}`
}

function parseUnitNumber(value: number | string | null | undefined): number | null {
  if (value == null || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function normalizeBookLabel(bookTitle: string, isBe2: boolean): string {
  if (isBe2) return 'Big English 2'
  const trimmed = bookTitle.trim()
  return trimmed || 'Selected book'
}

function pagesWithinUnitRange(
  pages: number[],
  start: number | null,
  end: number | null,
): boolean {
  if (start == null || end == null || pages.length === 0) return false
  return pages.every((page) => page >= start && page <= end)
}

function buildUnitLine(unitNumber: number | null, unitTitle: string | null): string {
  if (unitNumber != null && unitTitle) return `Unit ${unitNumber} · ${unitTitle}`
  if (unitNumber != null) return `Unit ${unitNumber}`
  return unitTitle?.trim() || 'Current unit'
}

function languageExamplesFromVisibleView(input: {
  dedicatedLanguageLines: string[]
  activityLanguageFrames: string[]
}): TeacherChoiceLanguageExample[] {
  const examples: TeacherChoiceLanguageExample[] = []

  for (const line of input.dedicatedLanguageLines.slice(0, 8)) {
    // Preserve verified Q&A / pattern text; do not rewrite publisher wording.
    examples.push({
      label: line.includes('?') ? 'Exchange' : undefined,
      example: line,
    })
  }

  for (const frame of input.activityLanguageFrames.slice(0, 8)) {
    if (examples.some((item) => item.example === frame)) continue
    examples.push({
      label: frame.includes('?') ? 'Exchange' : 'Language frame',
      example: frame,
    })
  }

  return examples.slice(0, 8)
}

export function resolveChalkieLessonContext(input: {
  book: Book
  summary: BatchJsonSummary | null
  visiblePrintedPages: number[]
  unitNumber?: number | string | null
  /**
   * Optional Workbook canonical JSON for verified SB→WB pairing only.
   * When omitted or unpaired, two-lesson series stays unavailable (except BE2 U8 fixture).
   */
  workbookCanonical?: Record<string, unknown> | null
}): ChalkieLessonContext {
  const sortedVisible = [...input.visiblePrintedPages].sort((a, b) => a - b)
  const visiblePageRangeLabel = formatPageRange(sortedVisible)
  const unit = input.summary?.units[0]
  const unitNumber = parseUnitNumber(input.unitNumber ?? unit?.unitNumber ?? null)
  const unitTitle = unit?.title?.trim() || null
  const unitPrintedPageStart =
    typeof unit?.printedPageStart === 'number' ? unit.printedPageStart : null
  const unitPrintedPageEnd =
    typeof unit?.printedPageEnd === 'number' ? unit.printedPageEnd : null
  const unitPageRangeLabel = formatUnitPageRange(unitPrintedPageStart, unitPrintedPageEnd)
  const catalogBookId =
    input.summary?.catalogBookId?.trim() || input.book.catalogBookId?.trim() || null
  const isBe2 = isBe2StudentBook({
    catalogBookId: input.book.catalogBookId,
    summaryCatalogBookId: input.summary?.catalogBookId,
    bookTitle: input.book.title,
  })
  const bookLabel = normalizeBookLabel(input.book.title, isBe2)
  const unitLine = buildUnitLine(unitNumber, unitTitle)
  const unitOpeningPrintedPage = unitPrintedPageStart
  const canJumpToUnitOpening = unitOpeningPrintedPage != null

  const base = {
    catalogBookId,
    bookLabel,
    unitNumber,
    unitTitle,
    unitLine,
    visiblePrintedPages: sortedVisible,
    visiblePageRangeLabel,
    unitPrintedPageStart,
    unitPrintedPageEnd,
    unitPageRangeLabel,
    unitOpeningPrintedPage,
    canJumpToUnitOpening,
  }

  if (sortedVisible.length === 0) {
    return {
      ...base,
      ...emptyEvidenceFlags(),
      status: 'no_visible_pages',
      currentFocus: '',
      vocabulary: [],
      languageExamples: [],
      clarification: null,
      activityLines: [],
      pageLabels: [],
      isBe2U08PrototypeRoute: false,
      supportsTwoLessonSeries: false,
      workbookCompanion: null,
      priorLearningSuggestions: [],
      singleLessonTitle: '',
      seriesLessonTitle: null,
      stableLessonReference: null,
      scopeMessage:
        'Open a page spread in the source PDF before preparing a Chalkie prompt.',
      hasVerifiedPageEvidence: false,
      evidenceUnavailableMessage: null,
      unitContextNote: null,
    }
  }

  if (unitPrintedPageStart == null || unitPrintedPageEnd == null) {
    return {
      ...base,
      ...emptyEvidenceFlags(),
      status: 'no_unit_range',
      currentFocus: '',
      vocabulary: [],
      languageExamples: [],
      clarification: null,
      activityLines: [],
      pageLabels: [],
      isBe2U08PrototypeRoute: false,
      supportsTwoLessonSeries: false,
      workbookCompanion: null,
      priorLearningSuggestions: [],
      singleLessonTitle: '',
      seriesLessonTitle: null,
      stableLessonReference: null,
      scopeMessage:
        'This unit does not have a verified printed page range yet, so Chalkie cannot confirm that the open pages belong to the selected unit.',
      hasVerifiedPageEvidence: false,
      evidenceUnavailableMessage: null,
      unitContextNote: null,
    }
  }

  const inUnit = pagesWithinUnitRange(
    sortedVisible,
    unitPrintedPageStart,
    unitPrintedPageEnd,
  )

  if (!inUnit) {
    const unitLabel =
      unitNumber != null ? `${bookLabel} Unit ${unitNumber}` : `${bookLabel} this unit`
    return {
      ...base,
      ...emptyEvidenceFlags(),
      status: 'out_of_unit',
      currentFocus: '',
      vocabulary: [],
      languageExamples: [],
      clarification: null,
      activityLines: [],
      pageLabels: [],
      isBe2U08PrototypeRoute: false,
      supportsTwoLessonSeries: false,
      workbookCompanion: null,
      priorLearningSuggestions: [],
      singleLessonTitle: '',
      seriesLessonTitle: null,
      stableLessonReference: null,
      scopeMessage: `The open pages (${visiblePageRangeLabel}) are outside ${unitLabel}. Open a page spread from this unit before preparing a Chalkie prompt.`,
      hasVerifiedPageEvidence: false,
      evidenceUnavailableMessage: null,
      unitContextNote: null,
    }
  }

  const isBe2U08PrototypeRoute =
    isBe2 && unitNumber === 8 && isBe2U08PrototypePages(sortedVisible)

  if (isBe2U08PrototypeRoute) {
    return {
      ...base,
      status: 'ready',
      currentFocus: BE2_U08_PROTOTYPE_FOCUS,
      lessonTopic: null,
      teachingFocus: BE2_U08_PROTOTYPE_FOCUS,
      vocabulary: [...BE2_U08_VOCABULARY],
      hasDedicatedVocabulary: true,
      hasActivityDerivedModels: false,
      languageExamples: [...BE2_U08_LANGUAGE],
      hasDedicatedLanguage: true,
      hasActivityLanguageFrames: false,
      clarification: BE2_U08_CLARIFICATION,
      activityLines: [...BE2_U08_PROTOTYPE_ACTIVITIES],
      outlineActivities: [],
      pageLabels: [...BE2_U08_PROTOTYPE_PAGE_LABELS],
      isBe2U08PrototypeRoute: true,
      supportsTwoLessonSeries: true,
      workbookCompanion: null,
      priorLearningSuggestions: BE2_U08_AI_SUGGESTIONS,
      singleLessonTitle: BE2_U08_SINGLE_LESSON_TITLE,
      seriesLessonTitle: BE2_U08_SERIES_LESSON_TITLE,
      stableLessonReference: buildChalkieLessonNaming({
        catalogBookId,
        bookTitle: input.book.title,
        bookType: input.book.type,
        unitNumber,
        unitTitle,
        visiblePrintedPages: sortedVisible,
        teachingFocus: BE2_U08_PROTOTYPE_FOCUS,
        lessonTopic: null,
      }).stableLessonReference,
      scopeMessage: null,
      hasVerifiedPageEvidence: true,
      evidenceUnavailableMessage: null,
      unitContextNote:
        unitPageRangeLabel != null
          ? `Unit context (not visible-page evidence): full unit ${unitPageRangeLabel}.`
          : null,
    }
  }

  const visibleView = input.summary
    ? buildVisiblePagesView(input.summary, sortedVisible)
    : null

  // Need vocab, language, or activities — page labels alone are not enough to invent a lesson.
  const hasStructuredEvidence = Boolean(
    visibleView &&
      (visibleView.vocabulary.length > 0 ||
        visibleView.languageLines.length > 0 ||
        visibleView.activityLines.length > 0),
  )

  if (!hasStructuredEvidence) {
    return {
      ...base,
      ...emptyEvidenceFlags(),
      status: 'no_page_evidence',
      currentFocus: '',
      vocabulary: [],
      languageExamples: [],
      clarification: null,
      activityLines: [],
      pageLabels: visibleView?.pageLabels ?? [],
      isBe2U08PrototypeRoute: false,
      supportsTwoLessonSeries: false,
      workbookCompanion: null,
      priorLearningSuggestions: [],
      singleLessonTitle: '',
      seriesLessonTitle: null,
      stableLessonReference: null,
      scopeMessage: null,
      hasVerifiedPageEvidence: false,
      evidenceUnavailableMessage: `Source evidence is not available for these pages (${visiblePageRangeLabel}) yet. Open a spread with verified page evidence before preparing a Chalkie prompt.`,
      unitContextNote: null,
    }
  }

  const unitView = input.summary ? buildUnitSummaryView(input.summary) : null
  const pageFocus =
    visibleView!.pageLabels.length > 0
      ? visibleView!.pageLabels.join(' · ')
      : 'Review the visible lesson in the source PDF.'

  const priorLearningSuggestions = input.summary
    ? deriveSameUnitEarlierVocabularySuggestions({
        summary: input.summary,
        visiblePrintedPages: sortedVisible,
      })
    : []

  const naming = buildChalkieLessonNaming({
    catalogBookId,
    bookTitle: input.book.title,
    bookType: input.book.type,
    unitNumber,
    unitTitle,
    visiblePrintedPages: sortedVisible,
    teachingFocus: visibleView!.teachingFocus,
    lessonTopic: visibleView!.lessonTopic,
  })

  const studentBookCanonical =
    input.summary?.raw && typeof input.summary.raw === 'object'
      ? (input.summary.raw as Record<string, unknown>)
      : null
  const { companion: workbookCompanion } = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: catalogBookId,
    studentBookCanonical,
    workbookCanonical: input.workbookCanonical ?? null,
    studentBookPrintedPages: sortedVisible,
  })

  return {
    ...base,
    status: 'ready',
    currentFocus: pageFocus,
    lessonTopic: visibleView!.lessonTopic,
    teachingFocus: visibleView!.teachingFocus,
    vocabulary: visibleView!.vocabulary.slice(0, 24),
    hasDedicatedVocabulary: visibleView!.hasDedicatedVocabulary,
    hasActivityDerivedModels: visibleView!.hasActivityDerivedModels,
    languageExamples: languageExamplesFromVisibleView({
      dedicatedLanguageLines: visibleView!.dedicatedLanguageLines,
      activityLanguageFrames: visibleView!.activityLanguageFrames,
    }),
    hasDedicatedLanguage: visibleView!.hasDedicatedLanguage,
    hasActivityLanguageFrames: visibleView!.hasActivityLanguageFrames,
    clarification: null,
    activityLines: visibleView!.activityLines.slice(0, 6),
    outlineActivities: visibleView!.outlineActivities,
    pageLabels: visibleView!.pageLabels.slice(0, 6),
    isBe2U08PrototypeRoute: false,
    supportsTwoLessonSeries: workbookCompanion != null,
    workbookCompanion,
    priorLearningSuggestions,
    singleLessonTitle: naming.teacherFacingTitle,
    seriesLessonTitle: null,
    stableLessonReference: naming.stableLessonReference,
    scopeMessage: null,
    hasVerifiedPageEvidence: true,
    evidenceUnavailableMessage: null,
    unitContextNote:
      unitView?.theme || unitView?.learningFocus
        ? `Unit context (not visible-page evidence): ${
            unitView.theme ?? unitView.learningFocus
          }${unitPageRangeLabel ? ` · full unit ${unitPageRangeLabel}` : ''}.`
        : unitPageRangeLabel
          ? `Unit context (not visible-page evidence): full unit ${unitPageRangeLabel}.`
          : null,
  }
}
