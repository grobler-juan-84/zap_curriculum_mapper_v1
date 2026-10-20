/**
 * Deterministic same-unit earlier-page vocabulary suggestions for Chalkie Step 2.
 * No API calls. Not cross-unit horizontal mapping.
 */
import type { BatchJsonSummary } from '../../types/validation'
import {
  formatPriorSkillCardTitle,
  type TeacherChoiceSuggestion,
} from './teacherChoiceSuggestions'

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

function isHumanVerified(status: string | undefined): boolean {
  if (!status) return false
  const normalized = status.toLowerCase()
  return normalized === 'human_verified' || normalized === 'verified'
}

function isTargetVocabulary(classification: string | undefined): boolean {
  if (!classification) return false
  return classification.toLowerCase() === 'target'
}

type VocabBundle = {
  printedPage: number
  pageId: string
  title: string
  terms: string[]
}

function componentTitleForPage(
  components: Record<string, unknown>[],
  pageId: string,
  fallbackSectionTitle: string | undefined,
): string {
  const onPage = components.filter((c) => asString(c.page_id) === pageId)
  const vocabularyPreferred =
    onPage.find((c) => /\bvocabulary\b/i.test(asString(c.component_type) ?? asString(c.type) ?? '')) ??
    onPage.find((c) => Boolean(asString(c.title)))
  return (
    asString(vocabularyPreferred?.title) ??
    fallbackSectionTitle ??
    'Earlier vocabulary'
  )
}

/**
 * Offer human-verified target vocabulary from earlier printed pages in the same
 * unit summary, grouped by curriculum-component title on that page.
 */
export function deriveSameUnitEarlierVocabularySuggestions(input: {
  summary: BatchJsonSummary
  visiblePrintedPages: number[]
  unitNumber: number
}): TeacherChoiceSuggestion[] {
  const visible = input.visiblePrintedPages.filter((n) => Number.isFinite(n))
  if (visible.length === 0) return []
  const unitNumber = input.unitNumber

  const earliestVisible = Math.min(...visible)
  const raw = asRecord(input.summary.raw)
  const pages = asArray(raw.pages)
  const pageIdToPrinted = new Map<string, number>()
  const pageIdToSectionTitle = new Map<string, string>()

  for (const entry of pages) {
    const p = asRecord(entry)
    const pageId = asString(p.page_id)
    const printed = asNumber(p.printed_page)
    if (!pageId || printed == null) continue
    pageIdToPrinted.set(pageId, printed)
    const sectionTitle = asString(p.section_title)
    if (sectionTitle) pageIdToSectionTitle.set(pageId, sectionTitle)
  }

  const components = asArray(raw.curriculum_components).map((entry) => asRecord(entry))
  const bundles = new Map<string, VocabBundle>()

  for (const entry of asArray(raw.vocabulary)) {
    const v = asRecord(entry)
    const term = asString(v.term)
    if (!term) continue
    if (!isHumanVerified(asString(v.verification_status))) continue
    if (!isTargetVocabulary(asString(v.classification))) continue

    const pageId = asString(v.page_id)
    if (!pageId) continue
    const printed = pageIdToPrinted.get(pageId) ?? asNumber(v.printed_page)
    if (printed == null || printed >= earliestVisible) continue

    // Same-unit gate: summary is already unit-sliced in the app; still require the
    // page to appear in this summary's page list.
    if (!pageIdToPrinted.has(pageId)) continue

    const title = componentTitleForPage(
      components,
      pageId,
      pageIdToSectionTitle.get(pageId),
    )
    const key = `${printed}:${pageId}:${title}`
    const existing = bundles.get(key)
    if (existing) {
      if (!existing.terms.includes(term)) existing.terms.push(term)
    } else {
      bundles.set(key, {
        printedPage: printed,
        pageId,
        title,
        terms: [term],
      })
    }
  }

  return [...bundles.values()]
    .filter((bundle) => bundle.terms.length > 0)
    .sort((a, b) => a.printedPage - b.printedPage || a.title.localeCompare(b.title))
    .map((bundle) => {
      const id = `same-unit-vocab-${bundle.pageId}-${bundle.printedPage}`
      return {
        id,
        label: formatPriorSkillCardTitle({
          unitNumber,
          pageStart: bundle.printedPage,
          pageEnd: bundle.printedPage,
          skillName: bundle.title,
        }),
        source: `Earlier in this unit · p.${bundle.printedPage}`,
        frame: bundle.terms.join(', '),
        whyItMayHelp:
          'These target phrases were taught earlier in this unit and may support practice on the current pages.',
        caution:
          'This is earlier-page vocabulary from the same unit, not evidence printed on the current spread.',
        evidenceNote: `Human-verified target vocabulary from earlier in this unit (p.${bundle.printedPage}), grouped under its verified curriculum component.`,
        provenanceTag: '[PRIOR]',
      } satisfies TeacherChoiceSuggestion
    })
}
