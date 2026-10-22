/**
 * Verified Workbook activity cards and session-only selection helpers.
 *
 * This model is intentionally separate from the Student Book handoff model.
 * Workbook selections are UI state only and must not feed any handoff builder.
 */
import type { BatchJsonSummary } from '../../types/validation'
import {
  extractActivityItemModel,
  splitLanguageFrames,
} from './chalkieEvidence'
import type { VerifiedSbWbCompanion } from './resolveVerifiedSbWbCompanion'

type UnknownRecord = Record<string, unknown>

export type WbActivityPreviewKind =
  | 'language_model'
  | 'activity_item_model'
  | 'expected_answer'
  | 'task_evidence'
  | 'empty'

export type WbActivityPreview = {
  readonly kind: WbActivityPreviewKind
  /** Exact verified snippets only; empty means no safe preview is available. */
  readonly values: readonly string[]
}

export type WbActivityEvidenceReference = {
  readonly activityId: string
  readonly bookId: string | null
  readonly unitId: string | null
  readonly pageId: string
  readonly verificationStatus: 'human_verified'
}

export type WbActivityCard = {
  readonly id: string
  readonly source: 'WB'
  readonly pageId: string
  readonly printedPage: number
  readonly activityNumber: string | null
  readonly verifiedWording: string
  readonly preview: WbActivityPreview
  readonly references: readonly WbActivityEvidenceReference[]
}

export type WbActivitySelectionState = {
  readonly selectedCardIds: readonly string[]
}

export type WbActivitySelectionStatus = {
  readonly selectedCount: number
  readonly totalCount: number
  readonly hasNoSelectedWorkbookActivities: boolean
}

export type WbActivityPagePanel = {
  readonly pageId: string | null
  readonly printedPage: number | null
  readonly cards: readonly WbActivityCard[]
  readonly includedInLessonScope: boolean
  readonly position: 'left' | 'right'
}

type VerifiedCompanionPage = {
  readonly pageId: string
  readonly printedPage: number
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

function activityItemModels(activity: UnknownRecord): string[] {
  const activityType =
    asString(activity.activity_type) ?? asString(activity.type)
  return unique(
    asArray(activity.items)
      .map((raw) =>
        extractActivityItemModel(asRecord(raw), {
          activityType,
        }),
      )
      .filter((value): value is string => value !== null),
  ).slice(0, 4)
}

function buildPreview(activity: UnknownRecord): WbActivityPreview {
  const languageFrame = asString(activity.language_frame)
  if (languageFrame) {
    const frames = splitLanguageFrames(languageFrame).slice(0, 2)
    if (frames.length) return { kind: 'language_model', values: frames }
  }

  const models = activityItemModels(activity)
  if (models.length) {
    return { kind: 'activity_item_model', values: models }
  }

  const items = asArray(activity.items).map(asRecord)
  const expectedAnswers = safeShortValues([
    asString(activity.expected_answer),
    ...items.map((item) => asString(item.expected_answer)),
  ])
  if (expectedAnswers.length) {
    return { kind: 'expected_answer', values: expectedAnswers }
  }

  const taskEvidence = safeShortValues([
    asString(activity.prompt),
    ...items.map((item) => asString(item.prompt)),
  ])
  if (taskEvidence.length) {
    return { kind: 'task_evidence', values: taskEvidence }
  }

  const vocabulary = safeShortValues(
    asArray(activity.vocabulary).map((value) =>
      typeof value === 'string'
        ? value
        : asString(asRecord(value).term) ?? asString(asRecord(value).word),
    ),
  )
  if (vocabulary.length) {
    return { kind: 'task_evidence', values: vocabulary }
  }

  return { kind: 'empty', values: [] }
}

function verifiedCompanionPages(
  companion: VerifiedSbWbCompanion | null,
): VerifiedCompanionPage[] {
  if (!companion?.workbookPageIds?.length) return []
  if (
    companion.workbookPageIds.length !== companion.workbookPrintedPages.length
  ) {
    return []
  }

  return companion.workbookPageIds.map((pageId, index) => ({
    pageId,
    printedPage: companion.workbookPrintedPages[index]!,
  }))
}

function compareCards(left: WbActivityCard, right: WbActivityCard): number {
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
 * Build cards only from human-verified activities whose page IDs occur in the
 * exact resolved companion. Printed-page matches alone are never sufficient.
 */
export function buildWbActivityCards(input: {
  summary: BatchJsonSummary | null
  companion: VerifiedSbWbCompanion | null
}): WbActivityCard[] {
  if (!input.summary) return []

  const companionPages = verifiedCompanionPages(input.companion)
  if (companionPages.length === 0) return []

  const pageById = new Map(
    companionPages.map((page) => [page.pageId, page.printedPage]),
  )
  const cards: WbActivityCard[] = []
  const seenCardIds = new Set<string>()

  for (const raw of asArray(asRecord(input.summary.raw).activities)) {
    const activity = asRecord(raw)
    if (asString(activity.verification_status) !== 'human_verified') continue

    const activityId = asString(activity.activity_id)
    const pageId = asString(activity.page_id)
    if (!activityId || !pageId || !pageById.has(pageId)) continue

    const mappedPrintedPage = pageById.get(pageId)!
    const rowPrintedPage = asFiniteNumber(activity.printed_page)
    if (rowPrintedPage != null && rowPrintedPage !== mappedPrintedPage) continue

    const verifiedWording =
      asString(activity.title) ??
      asString(activity.activity_title) ??
      asString(activity.instruction)
    if (!verifiedWording) continue

    const cardId = `wb-activity:${activityId}`
    if (seenCardIds.has(cardId)) continue
    seenCardIds.add(cardId)

    cards.push({
      id: cardId,
      source: 'WB',
      pageId,
      printedPage: mappedPrintedPage,
      activityNumber: asActivityNumber(
        activity.activity_number ?? activity.number,
      ),
      verifiedWording,
      preview: buildPreview(activity),
      references: [
        {
          activityId,
          bookId: asString(activity.book_id),
          unitId: asString(activity.unit_id),
          pageId,
          verificationStatus: 'human_verified',
        },
      ],
    })
  }

  return cards.sort(compareCards)
}

/**
 * Render the verified companion as a physical two-page spread. A missing
 * facing page is a visual-only placeholder and never enters card selection.
 */
export function buildWbActivityPagePanels(input: {
  cards: readonly WbActivityCard[]
  companion: VerifiedSbWbCompanion | null
}): WbActivityPagePanel[] {
  const verifiedPages = verifiedCompanionPages(input.companion)
  if (verifiedPages.length === 0) return []

  if (verifiedPages.length === 1) {
    const page = verifiedPages[0]!
    const realPanel: WbActivityPagePanel = {
      ...page,
      cards: input.cards.filter((card) => card.pageId === page.pageId),
      includedInLessonScope: true,
      position: page.printedPage % 2 === 0 ? 'left' : 'right',
    }
    const placeholder: WbActivityPagePanel = {
      pageId: null,
      printedPage: null,
      cards: [],
      includedInLessonScope: false,
      position: realPanel.position === 'left' ? 'right' : 'left',
    }
    return realPanel.position === 'left'
      ? [realPanel, placeholder]
      : [placeholder, realPanel]
  }

  return verifiedPages.slice(0, 2).map((page, index) => ({
    ...page,
    cards: input.cards.filter((card) => card.pageId === page.pageId),
    includedInLessonScope: true,
    position: index === 0 ? 'left' : 'right',
  }))
}

export function createDefaultWbActivitySelection(
  cards: readonly WbActivityCard[],
): WbActivitySelectionState {
  return { selectedCardIds: cards.map((card) => card.id) }
}

/**
 * Include/exclude known cards only. Unknown and stale IDs are removed during
 * normalization and can never create selected Workbook content.
 */
export function setWbActivityCardSelected(input: {
  cards: readonly WbActivityCard[]
  state: WbActivitySelectionState
  cardId: string
  selected: boolean
}): WbActivitySelectionState {
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

export function wbActivitySelectionStatus(
  cards: readonly WbActivityCard[],
  state: WbActivitySelectionState,
): WbActivitySelectionStatus {
  const validIds = new Set(cards.map((card) => card.id))
  const selectedCount = new Set(
    state.selectedCardIds.filter((id) => validIds.has(id)),
  ).size
  return {
    selectedCount,
    totalCount: cards.length,
    hasNoSelectedWorkbookActivities:
      cards.length > 0 && selectedCount === 0,
  }
}
