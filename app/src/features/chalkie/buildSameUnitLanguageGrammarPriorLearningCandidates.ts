/**
 * Same-unit `[PRIOR]` language/grammar candidates from verified language entities.
 *
 * Assembled into Step 2 via `assembleSameUnitPriorLearningCandidates` (optional /
 * unchecked; spine-aware order). Never invents frames, models, or grammar
 * explanations. Current-page language is excluded.
 *
 * Design: `docs/phase-5/unit-learning-spine-and-prior-learning-ranking-design-v0.1.md`
 */
import type { BatchJsonSummary } from '../../types/validation'
import { attachUnitLearningSpineMetadata } from './attachUnitLearningSpineMetadata'
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

function isExplicitInSource(value: unknown): boolean {
  return value === true
}

function languagePreview(entry: Record<string, unknown>): string | null {
  const full = asString(entry.full_text)
  if (full) return full
  const prompt = asString(entry.prompt)
  const response = asString(entry.response)
  if (prompt && response) return `${prompt} / ${response}`
  return prompt ?? response ?? null
}

/** Parse notes like "Presentation frame in Activity 8 screen" → 8. */
function activityNumberFromNotes(notes: string | undefined): number | null {
  if (!notes) return null
  const match = notes.match(/\bActivity\s+(\d+)\b/i)
  if (!match?.[1]) return null
  const n = Number(match[1])
  return Number.isFinite(n) ? n : null
}

export type BuildSameUnitLanguageGrammarPriorLearningCandidatesInput = {
  readonly summary: BatchJsonSummary
  readonly visiblePrintedPages: readonly number[]
  readonly unitNumber: number
  readonly catalogBookId?: string | null
}

type LanguageRow = {
  languageId: string
  printedPage: number
  pageId: string
  languageType: string
  preview: string
  grammarLabel: string | null
  notes: string | undefined
  sectionTitle: string | undefined
}

/**
 * Build same-unit language/grammar `[PRIOR]` candidates from verified earlier-page
 * language entities. Empty when evidence is absent or ambiguous.
 */
export function buildSameUnitLanguageGrammarPriorLearningCandidates(
  input: BuildSameUnitLanguageGrammarPriorLearningCandidatesInput,
): PriorLearningCandidate[] {
  const visible = input.visiblePrintedPages.filter((n) => Number.isFinite(n))
  if (visible.length === 0) return []

  const unitNumber = input.unitNumber
  const catalogBookId =
    input.catalogBookId ?? input.summary.catalogBookId ?? null
  const earliestVisible = Math.min(...visible)
  const raw = asRecord(input.summary.raw)

  const pageIdToPrinted = new Map<string, number>()
  const pageIdToSectionTitle = new Map<string, string>()
  for (const entry of asArray(raw.pages)) {
    const p = asRecord(entry)
    const pageId = asString(p.page_id)
    const printed = asNumber(p.printed_page)
    if (!pageId || printed == null) continue
    pageIdToPrinted.set(pageId, printed)
    const sectionTitle = asString(p.section_title)
    if (sectionTitle) pageIdToSectionTitle.set(pageId, sectionTitle)
  }

  const activitiesByPage = new Map<string, Record<string, unknown>[]>()
  for (const entry of asArray(raw.activities)) {
    const a = asRecord(entry)
    const pageId = asString(a.page_id)
    if (!pageId) continue
    const list = activitiesByPage.get(pageId) ?? []
    list.push(a)
    activitiesByPage.set(pageId, list)
  }

  const rows: LanguageRow[] = []
  for (const entry of asArray(raw.language)) {
    const lang = asRecord(entry)
    if (!isHumanVerified(asString(lang.verification_status))) continue
    if (!isExplicitInSource(lang.explicit_in_source)) continue

    const languageType = asString(lang.language_type)?.toLowerCase()
    if (
      languageType !== 'question_answer' &&
      languageType !== 'grammar_pattern'
    ) {
      continue
    }

    const pageId = asString(lang.page_id)
    if (!pageId || !pageIdToPrinted.has(pageId)) continue
    const printed = pageIdToPrinted.get(pageId)!
    // Never treat the current (or later) pages as prior learning.
    if (printed >= earliestVisible) continue

    const languageId = asString(lang.language_id)
    const preview = languagePreview(lang)
    if (!languageId || !preview) continue

    rows.push({
      languageId,
      printedPage: printed,
      pageId,
      languageType,
      preview,
      grammarLabel: asString(lang.grammar_label) ?? null,
      notes: asString(lang.notes),
      sectionTitle: pageIdToSectionTitle.get(pageId),
    })
  }

  if (rows.length === 0) return []

  const liaRows = rows
    .filter((row) => row.languageType === 'question_answer')
    .sort(
      (a, b) =>
        a.printedPage - b.printedPage ||
        a.languageId.localeCompare(b.languageId),
    )
  const grammarRows = rows
    .filter((row) => row.languageType === 'grammar_pattern')
    .sort(
      (a, b) =>
        a.printedPage - b.printedPage ||
        a.languageId.localeCompare(b.languageId),
    )

  const candidates: PriorLearningCandidate[] = []

  if (liaRows.length > 0) {
    const pageIds = [...new Set(liaRows.map((row) => row.pageId))]
    const printedPages = [
      ...new Set(liaRows.map((row) => row.printedPage)),
    ].sort((a, b) => a - b)
    const languageIds = liaRows.map((row) => row.languageId)
    const activityIds = resolveActivityIdsForLanguageRows(
      liaRows,
      activitiesByPage,
    )

    // LiA Did…? / short-answer frames require at least one safely linked activity
    // when notes claim an Activity N presentation — otherwise leave unclassified empty.
    const notesClaimActivity = liaRows.some(
      (row) => activityNumberFromNotes(row.notes) != null,
    )
    if (notesClaimActivity && activityIds.length === 0) {
      // Ambiguous activity attribution — do not invent.
    } else {
      const pageLabel =
        printedPages.length === 1
          ? `p.${printedPages[0]}`
          : `pp.${printedPages[0]}–${printedPages[printedPages.length - 1]}`
      const base: PriorLearningCandidate = {
        id: `same-unit-language-lia-${printedPages.join('-')}`,
        catalogBookId,
        unitNumber,
        printedPages,
        pageIds,
        sourceType: 'PRIOR',
        title: liaRows[0]?.sectionTitle ?? 'Language in Action',
        contentPreview: liaRows.map((row) => row.preview).join(' · '),
        whyItMayHelp:
          'Verified Did…? / short-answer language from earlier in this unit may support later practice.',
        provenanceNote: `Human-verified explicit language (${languageIds.join(', ')}) from earlier in this unit (${pageLabel}).`,
        target: 'both',
        teacherNote: null,
        verificationStatus: 'verified',
        sourceReference: `Earlier in this unit · ${pageLabel}`,
        caution:
          'This is earlier-page language from the same unit, not evidence printed on the current spread.',
        evidenceKind: 'communicative_language',
        languageIds,
        activityIds,
      }
      candidates.push(attachUnitLearningSpineMetadata(base))
    }
  }

  if (grammarRows.length > 0) {
    // Grammar-box patterns are language-entity evidence (not a single activity).
    // Require explicit grammar_label on every row — otherwise ambiguous.
    if (grammarRows.every((row) => row.grammarLabel)) {
      const pageIds = [...new Set(grammarRows.map((row) => row.pageId))]
      const printedPages = [
        ...new Set(grammarRows.map((row) => row.printedPage)),
      ].sort((a, b) => a - b)
      const languageIds = grammarRows.map((row) => row.languageId)
      const pageLabel =
        printedPages.length === 1
          ? `p.${printedPages[0]}`
          : `pp.${printedPages[0]}–${printedPages[printedPages.length - 1]}`
      const base: PriorLearningCandidate = {
        id: `same-unit-language-grammar-${printedPages.join('-')}`,
        catalogBookId,
        unitNumber,
        printedPages,
        pageIds,
        sourceType: 'PRIOR',
        title: grammarRows[0]?.sectionTitle ?? 'Grammar',
        contentPreview: grammarRows.map((row) => row.preview).join(' · '),
        whyItMayHelp:
          'Verified grammar patterns from earlier in this unit may support later practice.',
        provenanceNote: `Human-verified explicit grammar_pattern language (${languageIds.join(', ')}) from earlier in this unit (${pageLabel}).`,
        target: 'both',
        teacherNote: null,
        verificationStatus: 'verified',
        sourceReference: `Earlier in this unit · ${pageLabel}`,
        caution:
          'This is earlier-page grammar from the same unit, not evidence printed on the current spread.',
        evidenceKind: 'grammar',
        languageIds,
        activityIds: [],
      }
      candidates.push(attachUnitLearningSpineMetadata(base))
    }
  }

  // Page order only; spine-role ordering is applied by the assemble step.
  return candidates.sort(
    (a, b) =>
      (a.printedPages[0] ?? 0) - (b.printedPages[0] ?? 0) ||
      a.id.localeCompare(b.id),
  )
}

function resolveActivityIdsForLanguageRows(
  rows: readonly LanguageRow[],
  activitiesByPage: Map<string, Record<string, unknown>[]>,
): string[] {
  const ids = new Set<string>()
  for (const row of rows) {
    const activityNumber = activityNumberFromNotes(row.notes)
    if (activityNumber == null) continue
    const onPage = activitiesByPage.get(row.pageId) ?? []
    const matches = onPage.filter((activity) => {
      if (!isHumanVerified(asString(activity.verification_status))) return false
      const num = asNumber(activity.activity_number)
      return num === activityNumber
    })
    // Require exactly one verified activity with that number on the page.
    if (matches.length !== 1) continue
    const activityId = asString(matches[0]!.activity_id)
    if (activityId) ids.add(activityId)
  }
  return [...ids].sort((a, b) => a.localeCompare(b))
}
