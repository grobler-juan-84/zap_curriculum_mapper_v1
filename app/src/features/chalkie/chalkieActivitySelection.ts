/**
 * Deterministic, SB-only current-activity model and selection helpers.
 *
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
  readonly prompt: string | null
  readonly expectedAnswer: string | null
  readonly languageFrame: string | null
  readonly audioDependency: boolean
  /** Present when the verified activity row sets visual_dependency. */
  readonly visualDependency: boolean
  readonly sourceDependencyNote: string | null
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
  /** Conservative item-level models directly linked to this activity. */
  readonly activityLinkedModels: readonly string[]
  /** Page-attributed evidence, usable only when every eligible card on the page remains selected. */
  readonly pageDedicatedVocabulary: readonly string[]
  readonly pageDedicatedLanguage: readonly string[]
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
  readonly includedInLessonScope: boolean
  readonly position: 'left' | 'right'
}

export type SbActivityHandoffSelection = {
  readonly allCards: readonly SbActivityCard[]
  readonly selectedEvidence: readonly SelectedSbActivityEvidence[]
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

function buildPreview(activity: UnknownRecord): SbActivityPreview {
  const languageFrame = asString(activity.language_frame)
  if (languageFrame) {
    const frames = splitLanguageFrames(languageFrame).slice(0, 2)
    if (frames.length) return { kind: 'language_model', values: frames }
  }

  const models = activityItemModels(activity)
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
  const pageEvidence = pageAttributedEvidence(input.summary, pageMap)
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
      prompt: asString(activity.prompt),
      expectedAnswer: asString(activity.expected_answer),
      languageFrame: asString(activity.language_frame),
      audioDependency: activity.audio_dependency === true,
      visualDependency: activity.visual_dependency === true,
      sourceDependencyNote: asString(activity.source_dependency_note),
      items: evidenceItems(activity),
      references,
    }
    const attributed = pageEvidence.get(printedPage)

    cards.push({
      id: cardId,
      source: 'SB',
      pageId,
      printedPage,
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

/** Select every eligible current card once when the modal session is created. */
export function createDefaultSbActivitySelection(
  cards: readonly SbActivityCard[],
): SbActivitySelectionState {
  return { selectedCardIds: cards.map((card) => card.id) }
}

/** Render every lesson scope as a physical two-page spread. */
export function buildSbActivityPageColumns(
  cards: readonly SbActivityCard[],
  activeLessonPrintedPages: readonly number[],
): SbActivityPageColumn[] {
  const activePages = unique(
    activeLessonPrintedPages
      .filter(Number.isFinite)
      .map((printedPage) => String(Math.floor(printedPage))),
  ).map(Number)

  if (activePages.length === 0) return []

  const spreadPages =
    activePages.length === 1
      ? activePages[0]! % 2 === 0
        ? [activePages[0]!, activePages[0]! + 1]
        : [activePages[0]! - 1, activePages[0]!]
      : activePages.slice(0, 2)
  const activePageSet = new Set(activePages)

  return spreadPages.map((pageNumber, index) => {
    return {
      printedPage: pageNumber,
      cards: activePageSet.has(pageNumber)
        ? cards.filter((card) => card.printedPage === pageNumber)
        : [],
      includedInLessonScope: activePageSet.has(pageNumber),
      position: index === 0 ? 'left' : 'right',
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
 * Return evidence only for currently selected, known cards, in deterministic
 * card order.
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

export function createSbActivityHandoffSelection(
  cards: readonly SbActivityCard[],
  state: SbActivitySelectionState,
): SbActivityHandoffSelection {
  return {
    allCards: cards,
    selectedEvidence: selectedSbActivityEvidence(cards, state),
  }
}

export function hasSbActivityExclusions(
  selection: SbActivityHandoffSelection,
): boolean {
  return selection.selectedEvidence.length < selection.allCards.length
}

export function hasNoSelectedSbActivities(
  selection: SbActivityHandoffSelection,
): boolean {
  return selection.selectedEvidence.length === 0
}

function selectedCardIds(selection: SbActivityHandoffSelection): Set<string> {
  return new Set(selection.selectedEvidence.map((evidence) => evidence.cardId))
}

function fullySelectedPageNumbers(
  selection: SbActivityHandoffSelection,
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

/** Conservative vocabulary/model payload for selected activities only. */
export function selectedSbActivityVocabulary(
  selection: SbActivityHandoffSelection,
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

/** Page language is retained only when that page is fully selected. */
export function selectedSbActivityLanguage(
  selection: SbActivityHandoffSelection,
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

export function selectedSbActivityPromptLines(
  selection: SbActivityHandoffSelection,
): string[] {
  if (hasNoSelectedSbActivities(selection)) {
    return [
      '- No current Student Book activities were selected.',
      '- Do not reconstruct or infer content from unselected page activities.',
    ]
  }

  const lines: string[] = []
  for (const evidence of selection.selectedEvidence) {
    const activityLabel = evidence.activityNumber
      ? `Activity ${evidence.activityNumber}`
      : 'Activity'
    lines.push(
      `- [SB p.${evidence.printedPage}] ${activityLabel}: ${evidence.verifiedWording}`,
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
