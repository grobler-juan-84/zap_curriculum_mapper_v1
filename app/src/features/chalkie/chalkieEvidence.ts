import type { BatchJsonSummary } from '../../types/validation'

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() && !Number.isNaN(Number(value))) {
    return Number(value)
  }
  return null
}

export type UnitSummaryView = {
  unitLabel: string
  pageRange: string | null
  theme: string | null
  learningFocus: string | null
  vocabularyPreview: string[]
  languagePreview: string[]
  activityPreview: string[]
}

export type VisiblePagesView = {
  pageLabels: string[]
  /** Dedicated Phase 1 vocabulary rows linked to the visible pages. */
  dedicatedVocabulary: string[]
  /** Conservative base→form models from verified activity items. */
  activityDerivedModels: string[]
  /**
   * Teacher-facing words/models list: dedicated rows first, then activity-derived
   * models when useful. Not a claim that derived models are publisher vocab rows.
   */
  vocabulary: string[]
  /** Dedicated language entity lines (prompt/response). */
  dedicatedLanguageLines: string[]
  /** Verified activity language_frame values (may be split on " / "). */
  activityLanguageFrames: string[]
  /** Combined dedicated language + activity frames for display/prompt. */
  languageLines: string[]
  activityLines: string[]
  /** Planning summary derived from verified metadata — not a publisher quotation. */
  teachingFocus: string | null
  hasDedicatedVocabulary: boolean
  hasActivityDerivedModels: boolean
  hasDedicatedLanguage: boolean
  hasActivityLanguageFrames: boolean
  emptyMessage: string | null
}

function pageIdToPrinted(summary: BatchJsonSummary): Map<string, number> {
  const map = new Map<string, number>()
  for (const raw of asArray(asRecord(summary.raw).pages)) {
    const p = asRecord(raw)
    const pageId = asString(p.page_id)
    const printed = asNumber(p.printed_page)
    if (pageId && printed != null) map.set(pageId, printed)
  }
  return map
}

function belongsToPrintedPages(
  pageId: string | undefined,
  printedOnRow: number | null,
  visibleSet: Set<number>,
  pageIdMap: Map<string, number>,
): boolean {
  if (printedOnRow != null && visibleSet.has(printedOnRow)) return true
  if (pageId && pageIdMap.has(pageId) && visibleSet.has(pageIdMap.get(pageId)!)) {
    return true
  }
  return false
}

function looksLikeSingleWord(value: string): boolean {
  return /^[A-Za-z']+$/.test(value)
}

/** Strip match-key prefixes such as "d went" → "went" when clearly a single letter label. */
function stripMatchingAnswerPrefix(answer: string): string {
  const trimmed = answer.trim()
  const match = trimmed.match(/^[a-z]\s+(.+)$/i)
  return match ? match[1].trim() : trimmed
}

/** Prefer the first form when dual spellings are recorded ("traveled / travelled"). */
function primaryAnswerForm(answer: string): string {
  const stripped = stripMatchingAnswerPrefix(answer)
  const first = stripped.split('/')[0]?.trim() ?? stripped
  return first
}

function extractBracketedBase(prompt: string): string | null {
  const match = prompt.match(/\[([A-Za-z']+)\]/)
  return match ? match[1].toLowerCase() : null
}

/**
 * Conservatively extract a base → form model from one verified activity item.
 * Skips multi-answer key dumps (comma lists) and items without a clear base cue.
 */
export function extractActivityItemModel(item: Record<string, unknown>): string | null {
  const prompt = asString(item.prompt)
  const rawAnswer = asString(item.expected_answer)
  if (!rawAnswer) return null

  // Chart-completion buckets often store several answers — do not dump answer keys.
  if (rawAnswer.includes(',')) return null

  const form = primaryAnswerForm(rawAnswer)
  if (!form || !looksLikeSingleWord(form)) return null

  if (prompt) {
    const bracketBase = extractBracketedBase(prompt)
    if (bracketBase) {
      return `${bracketBase} → ${form.toLowerCase()}`
    }
    const simple = prompt.trim()
    if (looksLikeSingleWord(simple)) {
      return `${simple.toLowerCase()} → ${form.toLowerCase()}`
    }
  }

  return null
}

function splitLanguageFrames(frame: string): string[] {
  return frame
    .split(/\s+\/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function collectVisibleActivities(
  summary: BatchJsonSummary,
  visibleSet: Set<number>,
  pageIdMap: Map<string, number>,
): Record<string, unknown>[] {
  const rows: Record<string, unknown>[] = []
  for (const raw of asArray(asRecord(summary.raw).activities)) {
    const a = asRecord(raw)
    const pageId = asString(a.page_id)
    const printed = asNumber(a.printed_page)
    if (!belongsToPrintedPages(pageId, printed, visibleSet, pageIdMap)) continue
    rows.push(a)
  }
  return rows
}

function collectVisibleComponents(
  summary: BatchJsonSummary,
  visibleSet: Set<number>,
  pageIdMap: Map<string, number>,
): Record<string, unknown>[] {
  const rows: Record<string, unknown>[] = []
  for (const raw of asArray(asRecord(summary.raw).curriculum_components)) {
    const c = asRecord(raw)
    const pageId = asString(c.page_id)
    if (!belongsToPrintedPages(pageId, null, visibleSet, pageIdMap)) continue
    rows.push(c)
  }
  return rows
}

/**
 * Deterministic planning summary from verified component/activity metadata.
 * Not publisher wording — do not label as [SB] quotation.
 */
export function deriveTeachingFocus(input: {
  activities: Record<string, unknown>[]
  components: Record<string, unknown>[]
  activityDerivedModels: string[]
  activityLanguageFrames: string[]
}): string | null {
  const noteBlob = input.activities
    .map((a) => asString(a.notes) ?? '')
    .join(' ')
    .toLowerCase()
  const instructionBlob = input.activities
    .map((a) => asString(a.instruction) ?? asString(a.title) ?? '')
    .join(' ')
    .toLowerCase()
  const typeBlob = input.activities
    .map((a) => asString(a.activity_type) ?? asString(a.type) ?? '')
    .join(' ')
    .toLowerCase()
  const componentBlob = input.components
    .map((c) => `${asString(c.title) ?? ''} ${asString(c.source_label) ?? ''}`)
    .join(' ')
    .toLowerCase()
  const frameBlob = input.activityLanguageFrames.join(' ').toLowerCase()
  const modelBlob = input.activityDerivedModels.join(' ').toLowerCase()

  const hasRegular =
    /regular\s+past|past\s+simple|spelling/.test(noteBlob) ||
    /chart_completion_spelling|spelling/.test(typeBlob) ||
    /\[[a-z']+\]/.test(instructionBlob) ||
    input.activityDerivedModels.some((m) => /ed$/.test(m.split('→')[1]?.trim() ?? ''))

  const hasIrregular =
    /irregular/.test(noteBlob) ||
    /irregular/.test(componentBlob) ||
    /read_and_match/.test(typeBlob) ||
    input.activityDerivedModels.some((m) => {
      const [, form] = m.split('→').map((p) => p.trim())
      const [base] = m.split('→').map((p) => p.trim())
      return Boolean(base && form && form !== `${base}ed` && !form.endsWith('ed'))
    }) ||
    /\b(went|came|had|slept|fell|wrote|flew)\b/.test(modelBlob)

  const hasYesterday =
    /\byesterday\b/.test(instructionBlob) ||
    /\byesterday\b/.test(frameBlob) ||
    /\byesterday\b/.test(noteBlob)

  // Strong grammar signal from component title when past models exist.
  const grammarPastComponent =
    /grammar/.test(componentBlob) &&
    (hasRegular || hasIrregular || /\bcame\b|\bplayed\b|\bpast\b/.test(componentBlob))

  if (!hasRegular && !hasIrregular && !hasYesterday && !grammarPastComponent) {
    return null
  }

  if ((hasRegular || grammarPastComponent) && hasIrregular && hasYesterday) {
    return 'Use regular and irregular past-tense verbs to make simple sentences about yesterday.'
  }
  if ((hasRegular || grammarPastComponent) && hasIrregular) {
    return 'Practise regular and irregular past-tense verb forms on these pages.'
  }
  if ((hasRegular || grammarPastComponent) && hasYesterday) {
    return 'Use regular past-tense verbs to talk about what happened yesterday.'
  }
  if (hasIrregular && hasYesterday) {
    return 'Use irregular past-tense verbs to talk about what happened yesterday.'
  }
  if (hasYesterday) {
    return 'Talk about what happened yesterday using the language on these pages.'
  }
  if (hasRegular || grammarPastComponent) {
    return 'Practise regular past-tense verb forms on these pages.'
  }
  if (hasIrregular) {
    return 'Practise irregular past-tense verb forms on these pages.'
  }
  return null
}

/** Concise Phase 1 unit context for teachers (no Phase 2 interpretation). */
export function buildUnitSummaryView(summary: BatchJsonSummary): UnitSummaryView {
  const unit = summary.units[0]
  const unitNum = unit?.unitNumber || '?'
  const title = unit?.title?.trim()
  const unitLabel = title ? `Unit ${unitNum}: ${title}` : `Unit ${unitNum}`

  let pageRange: string | null = null
  if (unit?.printedPageStart != null && unit?.printedPageEnd != null) {
    pageRange = `pp. ${unit.printedPageStart}–${unit.printedPageEnd}`
  }

  const sectionTitles = summary.pages
    .map((p) => p.sectionTitle?.trim())
    .filter((t): t is string => Boolean(t))
  const uniqueSections = [...new Set(sectionTitles)].slice(0, 4)
  const learningFocus =
    uniqueSections.length > 0 ? uniqueSections.join(' · ') : unit?.theme?.trim() ?? null

  const vocabularyPreview = summary.vocabulary
    .map((v) => v.term?.trim())
    .filter((t): t is string => Boolean(t))
    .slice(0, 12)

  const languagePreview = summary.language
    .slice(0, 4)
    .map((item) => {
      const q = item.prompt?.trim()
      const a = item.response?.trim()
      if (q && a) return `${q} → ${a}`
      return q || a || ''
    })
    .filter(Boolean)

  const activityPreview = summary.activities
    .slice(0, 6)
    .map((a) => a.title?.trim() || '')
    .filter(Boolean)

  return {
    unitLabel,
    pageRange,
    theme: unit?.theme?.trim() ?? null,
    learningFocus,
    vocabularyPreview,
    languagePreview,
    activityPreview,
  }
}

/** Evidence tied to the PDF spread’s printed pages only. */
export function buildVisiblePagesView(
  summary: BatchJsonSummary | null,
  visiblePrintedPages: number[],
): VisiblePagesView {
  const empty: VisiblePagesView = {
    pageLabels: [],
    dedicatedVocabulary: [],
    activityDerivedModels: [],
    vocabulary: [],
    dedicatedLanguageLines: [],
    activityLanguageFrames: [],
    languageLines: [],
    activityLines: [],
    teachingFocus: null,
    hasDedicatedVocabulary: false,
    hasActivityDerivedModels: false,
    hasDedicatedLanguage: false,
    hasActivityLanguageFrames: false,
    emptyMessage: 'Navigate the PDF to see evidence for the visible spread.',
  }

  if (!summary || visiblePrintedPages.length === 0) {
    return empty
  }

  const visibleSet = new Set(visiblePrintedPages)
  const pageIdMap = pageIdToPrinted(summary)

  const pageLabels = summary.pages
    .filter((p) => p.printedPage != null && visibleSet.has(p.printedPage))
    .map((p) => {
      const label = p.sectionTitle?.trim() || p.sectionType?.trim() || 'Page content'
      return `p. ${p.printedPage}: ${label}`
    })

  if (pageLabels.length === 0) {
    const fallback = visiblePrintedPages.map((n) => `p. ${n}`)
    pageLabels.push(...fallback)
  }

  const dedicatedVocabulary: string[] = []
  for (const raw of asArray(asRecord(summary.raw).vocabulary)) {
    const v = asRecord(raw)
    const term = asString(v.term)
    if (!term) continue
    const pageId = asString(v.page_id)
    const printed = asNumber(v.printed_page)
    if (belongsToPrintedPages(pageId, printed, visibleSet, pageIdMap)) {
      dedicatedVocabulary.push(term)
    }
  }
  if (dedicatedVocabulary.length === 0) {
    for (const item of summary.vocabulary) {
      if (item.pageId && pageIdMap.has(item.pageId) && visibleSet.has(pageIdMap.get(item.pageId)!)) {
        if (item.term?.trim()) dedicatedVocabulary.push(item.term.trim())
      }
    }
  }

  const dedicatedLanguageLines: string[] = []
  for (const raw of asArray(asRecord(summary.raw).language)) {
    const l = asRecord(raw)
    const pageId = asString(l.page_id)
    const printed = asNumber(l.printed_page)
    if (!belongsToPrintedPages(pageId, printed, visibleSet, pageIdMap)) continue
    const q = asString(l.prompt)
    const a = asString(l.response)
    if (q && a) dedicatedLanguageLines.push(`${q} → ${a}`)
    else if (q) dedicatedLanguageLines.push(q)
    else if (a) dedicatedLanguageLines.push(a)
  }

  const visibleActivities = collectVisibleActivities(summary, visibleSet, pageIdMap)
  const visibleComponents = collectVisibleComponents(summary, visibleSet, pageIdMap)

  const activityLines: string[] = []
  const activityDerivedModels: string[] = []
  const activityLanguageFrames: string[] = []

  for (const a of visibleActivities) {
    const title =
      asString(a.title) ?? asString(a.activity_title) ?? asString(a.instruction)
    if (title) activityLines.push(title)

    const frame = asString(a.language_frame)
    if (frame) {
      for (const part of splitLanguageFrames(frame)) {
        activityLanguageFrames.push(part)
      }
    }

    for (const rawItem of asArray(a.items)) {
      const model = extractActivityItemModel(asRecord(rawItem))
      if (model) activityDerivedModels.push(model)
    }
  }

  if (activityLines.length === 0) {
    for (const item of summary.activities) {
      if (
        item.pageId &&
        pageIdMap.has(item.pageId) &&
        visibleSet.has(pageIdMap.get(item.pageId)!)
      ) {
        const title = item.title?.trim()
        if (title) activityLines.push(title)
      }
    }
  }

  const uniqueDedicatedVocab = [...new Set(dedicatedVocabulary)]
  const uniqueDerivedModels = [...new Set(activityDerivedModels)]
  const uniqueFrames = [...new Set(activityLanguageFrames)]
  const uniqueDedicatedLanguage = [...new Set(dedicatedLanguageLines)]

  const vocabulary = [
    ...uniqueDedicatedVocab,
    ...uniqueDerivedModels.filter((model) => !uniqueDedicatedVocab.includes(model)),
  ]
  const languageLines = [
    ...uniqueDedicatedLanguage,
    ...uniqueFrames.filter((frame) => !uniqueDedicatedLanguage.includes(frame)),
  ]

  const teachingFocus = deriveTeachingFocus({
    activities: visibleActivities,
    components: visibleComponents,
    activityDerivedModels: uniqueDerivedModels,
    activityLanguageFrames: uniqueFrames,
  })

  const hasDedicatedVocabulary = uniqueDedicatedVocab.length > 0
  const hasActivityDerivedModels = uniqueDerivedModels.length > 0
  const hasDedicatedLanguage = uniqueDedicatedLanguage.length > 0
  const hasActivityLanguageFrames = uniqueFrames.length > 0

  const hasContent =
    pageLabels.length > 0 ||
    vocabulary.length > 0 ||
    languageLines.length > 0 ||
    activityLines.length > 0

  return {
    pageLabels: pageLabels.slice(0, 6),
    dedicatedVocabulary: uniqueDedicatedVocab.slice(0, 16),
    activityDerivedModels: uniqueDerivedModels.slice(0, 16),
    vocabulary: vocabulary.slice(0, 16),
    dedicatedLanguageLines: uniqueDedicatedLanguage.slice(0, 4),
    activityLanguageFrames: uniqueFrames.slice(0, 6),
    languageLines: languageLines.slice(0, 6),
    // Bound of six keeps a two-page five-activity spread intact (e.g. BE3 U8 136–137).
    activityLines: activityLines.slice(0, 6),
    teachingFocus,
    hasDedicatedVocabulary,
    hasActivityDerivedModels,
    hasDedicatedLanguage,
    hasActivityLanguageFrames,
    emptyMessage: hasContent
      ? null
      : 'No structured evidence matched these printed pages in the unit JSON.',
  }
}
