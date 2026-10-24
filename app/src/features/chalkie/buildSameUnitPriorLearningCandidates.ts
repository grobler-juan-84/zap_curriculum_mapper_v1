/**
 * Slice 1 — deterministic read-only same-unit `[PRIOR]` candidate builder.
 *
 * Sources human-verified target vocabulary from earlier printed pages in the
 * current unit summary. No UI selection, no `[HM]`, no OpenAI/API.
 *
 * Optional Unit Learning Spine metadata (`componentId` / `spineRole`) is attached
 * only on deterministic page-scope matches. Candidates are then ordered
 * core → support → unclassified (stable within role). No UI badges or auto-select.
 */
import type { BatchJsonSummary } from '../../types/validation'
import { attachUnitLearningSpineMetadata } from './attachUnitLearningSpineMetadata'
import { orderSameUnitPriorLearningCandidatesBySpineRole } from './orderSameUnitPriorLearningCandidatesBySpineRole'
import type { PriorLearningCandidate } from './priorLearningCandidate'

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
    onPage.find((c) =>
      /\bvocabulary\b/i.test(
        asString(c.component_type) ?? asString(c.type) ?? '',
      ),
    ) ?? onPage.find((c) => Boolean(asString(c.title)))
  return (
    asString(vocabularyPreferred?.title) ??
    fallbackSectionTitle ??
    'Earlier vocabulary'
  )
}

export type BuildSameUnitPriorLearningCandidatesInput = {
  readonly summary: BatchJsonSummary
  readonly visiblePrintedPages: readonly number[]
  readonly unitNumber: number
  /** Catalog `book_id` when known; null is honest when unavailable. */
  readonly catalogBookId?: string | null
}

/**
 * Build read-only same-unit `[PRIOR]` candidates from earlier verified target
 * vocabulary in the unit summary. Empty when no earlier verified target vocab
 * exists — never invents candidates.
 */
export function buildSameUnitPriorLearningCandidates(
  input: BuildSameUnitPriorLearningCandidatesInput,
): PriorLearningCandidate[] {
  const visible = input.visiblePrintedPages.filter((n) => Number.isFinite(n))
  if (visible.length === 0) return []

  const unitNumber = input.unitNumber
  const catalogBookId =
    input.catalogBookId ?? input.summary.catalogBookId ?? null
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

  const components = asArray(raw.curriculum_components).map((entry) =>
    asRecord(entry),
  )
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

  const withMetadata = [...bundles.values()]
    .filter((bundle) => bundle.terms.length > 0)
    .sort(
      (a, b) =>
        a.printedPage - b.printedPage || a.title.localeCompare(b.title),
    )
    .map((bundle) => {
      const id = `same-unit-vocab-${bundle.pageId}-${bundle.printedPage}`
      const base: PriorLearningCandidate = {
        id,
        catalogBookId,
        unitNumber,
        printedPages: [bundle.printedPage],
        pageIds: [bundle.pageId],
        sourceType: 'PRIOR',
        title: bundle.title,
        contentPreview: bundle.terms.join(', '),
        whyItMayHelp:
          'These target phrases were taught earlier in this unit and may support practice on the current pages.',
        provenanceNote: `Human-verified target vocabulary from earlier in this unit (p.${bundle.printedPage}), grouped under its verified curriculum component.`,
        target: 'both',
        teacherNote: null,
        verificationStatus: 'verified',
        sourceReference: `Earlier in this unit · p.${bundle.printedPage}`,
        caution:
          'This is earlier-page vocabulary from the same unit, not evidence printed on the current spread.',
        evidenceKind: 'vocabulary',
      }
      return attachUnitLearningSpineMetadata(base)
    })

  return orderSameUnitPriorLearningCandidatesBySpineRole(withMetadata)
}
