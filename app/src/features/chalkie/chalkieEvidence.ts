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
  vocabulary: string[]
  languageLines: string[]
  activityLines: string[]
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
    .slice(0, 5)
    .map((a) => a.title?.trim() || a.activityType?.trim() || '')
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
  if (!summary || visiblePrintedPages.length === 0) {
    return {
      pageLabels: [],
      vocabulary: [],
      languageLines: [],
      activityLines: [],
      emptyMessage: 'Navigate the PDF to see evidence for the visible spread.',
    }
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

  const vocabulary: string[] = []
  for (const raw of asArray(asRecord(summary.raw).vocabulary)) {
    const v = asRecord(raw)
    const term = asString(v.term)
    if (!term) continue
    const pageId = asString(v.page_id)
    const printed = asNumber(v.printed_page)
    if (belongsToPrintedPages(pageId, printed, visibleSet, pageIdMap)) {
      vocabulary.push(term)
    }
  }
  if (vocabulary.length === 0) {
    for (const item of summary.vocabulary) {
      if (item.pageId && pageIdMap.has(item.pageId) && visibleSet.has(pageIdMap.get(item.pageId)!)) {
        if (item.term?.trim()) vocabulary.push(item.term.trim())
      }
    }
  }

  const languageLines: string[] = []
  for (const raw of asArray(asRecord(summary.raw).language)) {
    const l = asRecord(raw)
    const pageId = asString(l.page_id)
    const printed = asNumber(l.printed_page)
    if (!belongsToPrintedPages(pageId, printed, visibleSet, pageIdMap)) continue
    const q = asString(l.prompt)
    const a = asString(l.response)
    if (q && a) languageLines.push(`${q} → ${a}`)
    else if (q) languageLines.push(q)
    else if (a) languageLines.push(a)
  }

  const activityLines: string[] = []
  for (const raw of asArray(asRecord(summary.raw).activities)) {
    const a = asRecord(raw)
    const pageId = asString(a.page_id)
    const printed = asNumber(a.printed_page)
    if (!belongsToPrintedPages(pageId, printed, visibleSet, pageIdMap)) continue
    const title = asString(a.title) ?? asString(a.activity_title)
    const type = asString(a.activity_type) ?? asString(a.type)
    if (title) activityLines.push(type ? `${title} (${type})` : title)
  }

  const hasContent =
    pageLabels.length > 0 ||
    vocabulary.length > 0 ||
    languageLines.length > 0 ||
    activityLines.length > 0

  return {
    pageLabels: pageLabels.slice(0, 6),
    vocabulary: [...new Set(vocabulary)].slice(0, 16),
    languageLines: languageLines.slice(0, 4),
    activityLines: activityLines.slice(0, 4),
    emptyMessage: hasContent
      ? null
      : 'No structured evidence matched these printed pages in the unit JSON.',
  }
}
