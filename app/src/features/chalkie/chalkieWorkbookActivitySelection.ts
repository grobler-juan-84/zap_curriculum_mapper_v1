/**
 * Verified Workbook activity cards and session-only selection helpers.
 *
 * This model is intentionally separate from the Student Book handoff model.
 * A bounded handoff-selection view propagates checked evidence without
 * persisting the session state or broadening verified companion scope.
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

export type WbActivityEvidenceItem = {
  readonly itemNumber: string | null
  readonly prompt: string | null
  readonly expectedAnswer: string | null
}

export type SelectedWbActivityEvidence = {
  readonly cardId: string
  readonly source: 'WB'
  readonly pageId: string
  readonly printedPage: number
  readonly activityNumber: string | null
  readonly verifiedWording: string
  readonly activityType: string | null
  readonly prompt: string | null
  readonly expectedAnswer: string | null
  readonly languageFrame: string | null
  readonly audioDependency: boolean
  readonly sourceDependencyNote: string | null
  readonly items: readonly WbActivityEvidenceItem[]
  readonly references: readonly WbActivityEvidenceReference[]
}

export type WbActivityCard = {
  readonly id: string
  readonly source: 'WB'
  readonly pageId: string
  readonly printedPage: number
  readonly activityNumber: string | null
  readonly verifiedWording: string
  readonly preview: WbActivityPreview
  readonly activityLinkedModels: readonly string[]
  readonly pageDedicatedVocabulary: readonly string[]
  readonly pageDedicatedLanguage: readonly string[]
  readonly references: readonly WbActivityEvidenceReference[]
  readonly evidence: SelectedWbActivityEvidence
}

export type WbActivitySelectionState = {
  readonly selectedCardIds: readonly string[]
}

export type WbActivitySelectionStatus = {
  readonly selectedCount: number
  readonly totalCount: number
  readonly hasNoSelectedWorkbookActivities: boolean
}

export type WbActivityHandoffSelection = {
  readonly allCards: readonly WbActivityCard[]
  readonly selectedEvidence: readonly SelectedWbActivityEvidence[]
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

function evidenceItems(activity: UnknownRecord): WbActivityEvidenceItem[] {
  return asArray(activity.items).map((raw) => {
    const item = asRecord(raw)
    return {
      itemNumber: asString(item.item_number),
      prompt: asString(item.prompt),
      expectedAnswer: asString(item.expected_answer),
    }
  })
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

function pageAttributedEvidence(
  summary: BatchJsonSummary,
  pageMap: ReadonlyMap<string, number>,
): Map<number, { vocabulary: string[]; language: string[] }> {
  const result = new Map<number, { vocabulary: string[]; language: string[] }>()
  const pageNumber = (record: UnknownRecord): number | null => {
    const pageId = asString(record.page_id)
    return (
      asFiniteNumber(record.printed_page) ??
      (pageId ? (pageMap.get(pageId) ?? null) : null)
    )
  }
  const entryFor = (printedPage: number) => {
    const existing = result.get(printedPage)
    if (existing) return existing
    const created = { vocabulary: [] as string[], language: [] as string[] }
    result.set(printedPage, created)
    return created
  }

  for (const raw of asArray(asRecord(summary.raw).vocabulary)) {
    const record = asRecord(raw)
    if (asString(record.verification_status) !== 'human_verified') continue
    const printedPage = pageNumber(record)
    const term = asString(record.term)
    if (printedPage == null || !term) continue
    const values = entryFor(printedPage).vocabulary
    if (!values.includes(term)) values.push(term)
  }

  for (const raw of asArray(asRecord(summary.raw).language)) {
    const record = asRecord(raw)
    if (asString(record.verification_status) !== 'human_verified') continue
    const printedPage = pageNumber(record)
    if (printedPage == null) continue
    const prompt = asString(record.prompt)
    const response = asString(record.response)
    const fullText = asString(record.full_text)
    const value =
      prompt && response ? `${prompt} / ${response}` : prompt ?? response ?? fullText
    if (!value) continue
    const values = entryFor(printedPage).language
    if (!values.includes(value)) values.push(value)
  }

  return result
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
  const canonicalPageMap = pageIdToPrintedPage(input.summary)
  const pageEvidence = pageAttributedEvidence(input.summary, canonicalPageMap)
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

    const activityNumber = asActivityNumber(
      activity.activity_number ?? activity.number,
    )
    const references: readonly WbActivityEvidenceReference[] = [
      {
        activityId,
        bookId: asString(activity.book_id),
        unitId: asString(activity.unit_id),
        pageId,
        verificationStatus: 'human_verified',
      },
    ]
    const evidence: SelectedWbActivityEvidence = {
      cardId,
      source: 'WB',
      pageId,
      printedPage: mappedPrintedPage,
      activityNumber,
      verifiedWording,
      activityType:
        asString(activity.activity_type) ?? asString(activity.type),
      prompt: asString(activity.prompt),
      expectedAnswer: asString(activity.expected_answer),
      languageFrame: asString(activity.language_frame),
      audioDependency: activity.audio_dependency === true,
      sourceDependencyNote: asString(activity.source_dependency_note),
      items: evidenceItems(activity),
      references,
    }
    const attributed = pageEvidence.get(mappedPrintedPage)

    cards.push({
      id: cardId,
      source: 'WB',
      pageId,
      printedPage: mappedPrintedPage,
      activityNumber,
      verifiedWording,
      preview: buildPreview(activity),
      activityLinkedModels: activityItemModels(activity),
      pageDedicatedVocabulary: attributed?.vocabulary ?? [],
      pageDedicatedLanguage: attributed?.language ?? [],
      references,
      evidence,
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

export function selectedWbActivityEvidence(
  cards: readonly WbActivityCard[],
  state: WbActivitySelectionState,
): SelectedWbActivityEvidence[] {
  const selectedIds = new Set(state.selectedCardIds)
  return cards
    .filter((card) => selectedIds.has(card.id))
    .map((card) => card.evidence)
}

export function createWbActivityHandoffSelection(
  cards: readonly WbActivityCard[],
  state: WbActivitySelectionState,
): WbActivityHandoffSelection {
  return {
    allCards: cards,
    selectedEvidence: selectedWbActivityEvidence(cards, state),
  }
}

export function hasWbActivityExclusions(
  selection: WbActivityHandoffSelection,
): boolean {
  return selection.selectedEvidence.length < selection.allCards.length
}

export function hasNoSelectedWbActivities(
  selection: WbActivityHandoffSelection,
): boolean {
  return selection.selectedEvidence.length === 0
}

function selectedCardIds(
  selection: WbActivityHandoffSelection,
): Set<string> {
  return new Set(selection.selectedEvidence.map((evidence) => evidence.cardId))
}

function fullySelectedPageNumbers(
  selection: WbActivityHandoffSelection,
): Set<number> {
  const selectedIds = selectedCardIds(selection)
  const pages = new Set(selection.allCards.map((card) => card.printedPage))
  return new Set(
    [...pages].filter((printedPage) => {
      const pageCards = selection.allCards.filter(
        (card) => card.printedPage === printedPage,
      )
      return (
        pageCards.length > 0 &&
        pageCards.every((card) => selectedIds.has(card.id))
      )
    }),
  )
}

export function selectedWbActivityVocabulary(
  selection: WbActivityHandoffSelection,
): string[] {
  const selectedIds = selectedCardIds(selection)
  const completePages = fullySelectedPageNumbers(selection)
  const values: string[] = []

  for (const card of selection.allCards) {
    if (completePages.has(card.printedPage)) {
      for (const value of card.pageDedicatedVocabulary) {
        if (!values.includes(value)) values.push(value)
      }
    }
    if (selectedIds.has(card.id)) {
      for (const value of card.activityLinkedModels) {
        if (!values.includes(value)) values.push(value)
      }
    }
  }

  return values
}

export function selectedWbActivityLanguage(
  selection: WbActivityHandoffSelection,
): string[] {
  const selectedIds = selectedCardIds(selection)
  const completePages = fullySelectedPageNumbers(selection)
  const values: string[] = []

  for (const card of selection.allCards) {
    if (completePages.has(card.printedPage)) {
      for (const value of card.pageDedicatedLanguage) {
        if (!values.includes(value)) values.push(value)
      }
    }
    if (!selectedIds.has(card.id) || !card.evidence.languageFrame) continue
    for (const value of splitLanguageFrames(card.evidence.languageFrame)) {
      if (!values.includes(value)) values.push(value)
    }
  }

  return values
}

export function selectedWbActivityPromptLines(
  selection: WbActivityHandoffSelection,
): string[] {
  if (hasNoSelectedWbActivities(selection)) {
    return [
      '- No Workbook activities were selected.',
      '- Do not reconstruct or infer content from unselected Workbook activities.',
    ]
  }

  const lines: string[] = []
  for (const evidence of selection.selectedEvidence) {
    const activityLabel = evidence.activityNumber
      ? `Activity ${evidence.activityNumber}`
      : 'Activity'
    lines.push(
      `- [WB p.${evidence.printedPage}] ${activityLabel}: ${evidence.verifiedWording}`,
    )
    if (evidence.prompt && evidence.prompt !== evidence.verifiedWording) {
      lines.push(`  Task evidence: ${evidence.prompt}`)
    }
    if (evidence.expectedAnswer) {
      lines.push(`  Answer evidence: ${evidence.expectedAnswer}`)
    }
    for (const item of evidence.items) {
      const itemLabel = item.itemNumber ? `Item ${item.itemNumber}` : 'Item'
      if (item.prompt) lines.push(`  ${itemLabel} task: ${item.prompt}`)
      if (item.expectedAnswer) {
        lines.push(`  ${itemLabel} answer evidence: ${item.expectedAnswer}`)
      }
    }
    if (evidence.languageFrame) {
      lines.push(`  Language: ${evidence.languageFrame}`)
    }
    if (evidence.audioDependency) {
      const sourceNote = evidence.sourceDependencyNote
        ? ` (${evidence.sourceDependencyNote})`
        : ''
      lines.push(`  Use the official book audio${sourceNote}.`)
    }
  }
  return lines
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
