/**
 * Deterministic, SB-only current-activity model and selection helpers.
 *
 * This module is intentionally not wired to the UI or handoff builders yet.
 * Callers must pass the resolved active lesson pages, not the PDF-facing pair.
 */
import type { BatchJsonSummary } from '../../types/validation'
import {
  extractActivityItemModel,
  splitLanguageFrames,
} from './chalkieEvidence'

type UnknownRecord = Record<string, unknown>

export type SbActivityPreviewKind =
  | 'language_model'
  | 'activity_item_model'
  | 'expected_answer'
  | 'task_evidence'
  | 'empty'

export type SbActivityPreview = {
  readonly kind: SbActivityPreviewKind
  /** Exact verified snippets only; empty means no safe preview is available. */
  readonly values: readonly string[]
}

export type SbActivityEvidenceReference = {
  readonly activityId: string
  readonly bookId: string | null
  readonly unitId: string | null
  readonly pageId: string
  readonly verificationStatus: 'human_verified'
}

export type SbActivityEvidenceItem = {
  readonly itemNumber: string | null
  readonly prompt: string | null
  readonly expectedAnswer: string | null
}

/**
 * Verified evidence belonging to one activity card. This is the future-only
 * boundary that handoff builders may consume after a separately authorized slice.
 */
export type SelectedSbActivityEvidence = {
  readonly cardId: string
  readonly source: 'SB'
  readonly pageId: string
  readonly printedPage: number
  readonly activityNumber: string | null
  readonly verifiedWording: string
  readonly activityType: string | null
  readonly languageFrame: string | null
  readonly items: readonly SbActivityEvidenceItem[]
  readonly references: SbActivityEvidenceReference
}

export type SbActivityCard = {
  readonly id: string
  readonly source: 'SB'
  readonly pageId: string
  readonly printedPage: number
  readonly activityNumber: string | null
  readonly verifiedWording: string
  readonly preview: SbActivityPreview
  readonly references: SbActivityEvidenceReference
  readonly evidence: SelectedSbActivityEvidence
}

export type SbActivitySelectionState = {
  /** Serializable and UI-independent so it can survive later modal navigation. */
  readonly selectedCardIds: readonly string[]
}

export type SbActivitySelectionStatus = {
  readonly selectedCount: number
  readonly totalCount: number
  readonly hasNoSelectedCurrentActivities: boolean
}

export type SbActivityPageColumn = {
  readonly printedPage: number
  readonly cards: readonly SbActivityCard[]
}

function asRecord(value: unknown): UnknownRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {}
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function asFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (
    typeof value === 'string' &&
    value.trim() &&
    Number.isFinite(Number(value))
  ) {
    return Number(value)
  }
  return null
}

function asActivityNumber(value: unknown): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return asString(value)
}

function unique(values: readonly string[]): string[] {
  return [...new Set(values)]
}

/**
 * Keep previews short and literal. This deliberately rejects long prose and
 * answer-key dumps instead of trying to rewrite them into teaching summaries.
 */
function safeShortValues(values: readonly (string | null)[]): string[] {
  const result: string[] = []
  for (const value of values) {
    if (!value) continue
    const normalized = value.replace(/\s+/g, ' ').trim()
    if (!normalized || normalized.length > 80 || normalized.includes(',')) continue
    if (!result.includes(normalized)) result.push(normalized)
    if (result.length === 4) break
  }
  return result
}

function evidenceItems(activity: UnknownRecord): SbActivityEvidenceItem[] {
  return asArray(activity.items).map((raw) => {
    const item = asRecord(raw)
    return {
      itemNumber: asString(item.item_number),
      prompt: asString(item.prompt),
      expectedAnswer: asString(item.expected_answer),
    }
  })
}

function buildPreview(activity: UnknownRecord): SbActivityPreview {
  const languageFrame = asString(activity.language_frame)
  if (languageFrame) {
    const frames = splitLanguageFrames(languageFrame).slice(0, 2)
    if (frames.length) return { kind: 'language_model', values: frames }
  }

  const activityType =
    asString(activity.activity_type) ?? asString(activity.type)
  const models = unique(
    asArray(activity.items)
      .map((raw) =>
        extractActivityItemModel(asRecord(raw), {
          activityType,
        }),
      )
      .filter((value): value is string => value !== null),
  ).slice(0, 4)
  if (models.length) {
    return { kind: 'activity_item_model', values: models }
  }

  const items = evidenceItems(activity)
  const expectedAnswers = safeShortValues([
    asString(activity.expected_answer),
    ...items.map((item) => item.expectedAnswer),
  ])
  if (expectedAnswers.length) {
    return { kind: 'expected_answer', values: expectedAnswers }
  }

  const taskEvidence = safeShortValues([
    asString(activity.prompt),
    ...items.map((item) => item.prompt),
  ])
  if (taskEvidence.length) {
    return { kind: 'task_evidence', values: taskEvidence }
  }

  return { kind: 'empty', values: [] }
}

function pageIdToPrintedPage(summary: BatchJsonSummary): Map<string, number> {
  const result = new Map<string, number>()
  for (const raw of asArray(asRecord(summary.raw).pages)) {
    const page = asRecord(raw)
    const pageId = asString(page.page_id)
    const printedPage = asFiniteNumber(page.printed_page)
    if (pageId && printedPage != null) result.set(pageId, printedPage)
  }
  return result
}

function compareCards(left: SbActivityCard, right: SbActivityCard): number {
  if (left.printedPage !== right.printedPage) {
    return left.printedPage - right.printedPage
  }
  const leftNumber = Number(left.activityNumber)
  const rightNumber = Number(right.activityNumber)
  if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber)) {
    return leftNumber - rightNumber
  }
  return left.id.localeCompare(right.id)
}

/**
 * Build cards from human-verified Student Book activity rows in the resolved
 * active lesson scope. Rows without stable activity/page IDs or verified
 * wording are not eligible.
 */
export function buildSbActivityCards(input: {
  summary: BatchJsonSummary | null
  activeLessonPrintedPages: readonly number[]
}): SbActivityCard[] {
  if (!input.summary || input.activeLessonPrintedPages.length === 0) return []

  const activePages = new Set(
    input.activeLessonPrintedPages.filter(Number.isFinite).map(Math.floor),
  )
  const pageMap = pageIdToPrintedPage(input.summary)
  const cards: SbActivityCard[] = []
  const seenCardIds = new Set<string>()

  for (const raw of asArray(asRecord(input.summary.raw).activities)) {
    const activity = asRecord(raw)
    if (asString(activity.verification_status) !== 'human_verified') continue

    const activityId = asString(activity.activity_id)
    const pageId = asString(activity.page_id)
    const printedPage =
      asFiniteNumber(activity.printed_page) ??
      (pageId ? (pageMap.get(pageId) ?? null) : null)
    const verifiedWording =
      asString(activity.title) ??
      asString(activity.activity_title) ??
      asString(activity.instruction)

    if (!activityId || !pageId || printedPage == null || !verifiedWording) continue
    if (!activePages.has(printedPage)) continue

    const cardId = `sb-activity:${activityId}`
    if (seenCardIds.has(cardId)) continue
    seenCardIds.add(cardId)

    const activityNumber = asActivityNumber(
      activity.activity_number ?? activity.number,
    )
    const references: SbActivityEvidenceReference = {
      activityId,
      bookId: asString(activity.book_id),
      unitId: asString(activity.unit_id),
      pageId,
      verificationStatus: 'human_verified',
    }
    const evidence: SelectedSbActivityEvidence = {
      cardId,
      source: 'SB',
      pageId,
      printedPage,
      activityNumber,
      verifiedWording,
      activityType:
        asString(activity.activity_type) ?? asString(activity.type),
      languageFrame: asString(activity.language_frame),
      items: evidenceItems(activity),
      references,
    }

    cards.push({
      id: cardId,
      source: 'SB',
      pageId,
      printedPage,
      activityNumber,
      verifiedWording,
      preview: buildPreview(activity),
      references,
      evidence,
    })
  }

  return cards.sort(compareCards)
}

/** Select every eligible current card once when the modal session is created. */
export function createDefaultSbActivitySelection(
  cards: readonly SbActivityCard[],
): SbActivitySelectionState {
  return { selectedCardIds: cards.map((card) => card.id) }
}

/**
 * Keep the active lesson's page order and expose empty columns honestly when
 * an active page has no eligible verified activity rows.
 */
export function buildSbActivityPageColumns(
  cards: readonly SbActivityCard[],
  activeLessonPrintedPages: readonly number[],
): SbActivityPageColumn[] {
  return unique(
    activeLessonPrintedPages
      .filter(Number.isFinite)
      .map((printedPage) => String(Math.floor(printedPage))),
  ).map((printedPage) => {
    const pageNumber = Number(printedPage)
    return {
      printedPage: pageNumber,
      cards: cards.filter((card) => card.printedPage === pageNumber),
    }
  })
}

/**
 * Deterministically include/exclude a known card. Unknown or stale IDs cannot
 * enter selection state; existing stale IDs are removed during normalization.
 */
export function setSbActivityCardSelected(input: {
  cards: readonly SbActivityCard[]
  state: SbActivitySelectionState
  cardId: string
  selected: boolean
}): SbActivitySelectionState {
  const validIds = new Set(input.cards.map((card) => card.id))
  const selectedIds = new Set(
    input.state.selectedCardIds.filter((id) => validIds.has(id)),
  )

  if (validIds.has(input.cardId)) {
    if (input.selected) selectedIds.add(input.cardId)
    else selectedIds.delete(input.cardId)
  }

  return {
    selectedCardIds: input.cards
      .map((card) => card.id)
      .filter((id) => selectedIds.has(id)),
  }
}

/**
 * Future handoff boundary: return evidence only for currently selected, known
 * cards, in deterministic card order. Not consumed by existing builders yet.
 */
export function selectedSbActivityEvidence(
  cards: readonly SbActivityCard[],
  state: SbActivitySelectionState,
): SelectedSbActivityEvidence[] {
  const selectedIds = new Set(state.selectedCardIds)
  return cards
    .filter((card) => selectedIds.has(card.id))
    .map((card) => card.evidence)
}

export function sbActivitySelectionStatus(
  cards: readonly SbActivityCard[],
  state: SbActivitySelectionState,
): SbActivitySelectionStatus {
  const selectedCount = selectedSbActivityEvidence(cards, state).length
  return {
    selectedCount,
    totalCount: cards.length,
    hasNoSelectedCurrentActivities: selectedCount === 0,
  }
}
