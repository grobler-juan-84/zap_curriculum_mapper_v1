/**
 * Slice 2–3 — surface prior-learning candidates for optional teacher selection.
 *
 * Same-unit `[PRIOR]` and curated earlier-unit `[HM]` only. Never auto-selects.
 * Never invents School Notes or AI suggestions. No OpenAI/API.
 */
import type { PriorLearningCandidate } from './priorLearningCandidate'
import { teacherChoiceSuggestionFromPriorLearningCandidate } from './priorLearningCandidate'
import type { TeacherChoiceSuggestion } from './teacherChoiceSuggestions'

/**
 * Map read-only same-unit candidates into Step 2 suggestion cards.
 * Only `PRIOR` source types are surfaced. Candidate order is preserved
 * (builder may already apply spine-role ordering: core → support → unclassified).
 */
export function surfaceSameUnitPriorLearningSuggestions(
  candidates: readonly PriorLearningCandidate[],
): TeacherChoiceSuggestion[] {
  return candidates
    .filter((candidate) => candidate.sourceType === 'PRIOR')
    .map(teacherChoiceSuggestionFromPriorLearningCandidate)
}

/**
 * Map curated earlier-unit `[HM]` candidates into Step 2 suggestion cards.
 * Only `HM` source types are surfaced. Candidate order is preserved.
 */
export function surfaceCuratedHorizontalMappingSuggestions(
  candidates: readonly PriorLearningCandidate[],
): TeacherChoiceSuggestion[] {
  return candidates
    .filter((candidate) => candidate.sourceType === 'HM')
    .map(teacherChoiceSuggestionFromPriorLearningCandidate)
}

function normalizeFrameKey(frame: string): string {
  return frame.trim().replace(/\s+/g, ' ').toLowerCase()
}

/**
 * Step 2 merge: same-unit `[PRIOR]` first (existing order), then curated `[HM]`.
 * Drops `[HM]` cards that duplicate a `[PRIOR]` id or identical frame text.
 */
export function mergeStep2PriorLearningSuggestions(input: {
  readonly sameUnitPriorCandidates: readonly PriorLearningCandidate[]
  readonly curatedHmCandidates: readonly PriorLearningCandidate[]
}): TeacherChoiceSuggestion[] {
  const prior = surfaceSameUnitPriorLearningSuggestions(
    input.sameUnitPriorCandidates,
  )
  const hm = surfaceCuratedHorizontalMappingSuggestions(
    input.curatedHmCandidates,
  )
  const seenIds = new Set(prior.map((item) => item.id))
  const seenFrames = new Set(
    prior.map((item) => normalizeFrameKey(item.frame)).filter(Boolean),
  )
  const hmDeduped = hm.filter((item) => {
    if (seenIds.has(item.id)) return false
    const frameKey = normalizeFrameKey(item.frame)
    if (frameKey && seenFrames.has(frameKey)) return false
    return true
  })
  return [...prior, ...hmDeduped]
}

/** Hard rule: suggestions start unchecked. */
export function initialSelectedPriorLearningIds(): string[] {
  return []
}

/**
 * Keep selected ids that still exist in the surfaced suggestion list.
 * Does not add new ids — never auto-selects newly arrived candidates.
 */
export function retainSelectedPriorLearningIds(
  selectedIds: readonly string[],
  surfacedSuggestions: readonly TeacherChoiceSuggestion[],
): string[] {
  const allowed = new Set(surfacedSuggestions.map((item) => item.id))
  return selectedIds.filter((id) => allowed.has(id))
}
