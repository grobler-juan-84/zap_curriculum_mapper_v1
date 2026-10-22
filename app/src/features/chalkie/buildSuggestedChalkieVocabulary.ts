/**
 * Suggested Chalkie vocabulary for the final handoff.
 * Current-page words/models only — never PRIOR / HM / teacher-added.
 * Local only; no API.
 */
import type { ChalkieLessonContext } from './resolveChalkieLessonContext'
import {
  selectedSbActivityVocabulary,
  type SbActivityHandoffSelection,
} from './chalkieActivitySelection'

export type SuggestedChalkieVocabulary = {
  /** Deduped current-page terms in source order. */
  terms: string[]
  /** Comma-separated copy payload for Chalkie’s vocabulary field. */
  copyText: string
  isEmpty: boolean
}

/**
 * Build suggested Chalkie vocabulary from the lesson’s verified current-page
 * words/models list (dedicated rows when present, else activity-derived models).
 */
export function buildSuggestedChalkieVocabulary(
  lesson: Pick<ChalkieLessonContext, 'vocabulary'>,
  activitySelection?: SbActivityHandoffSelection,
): SuggestedChalkieVocabulary {
  const terms: string[] = []
  const sourceTerms = activitySelection
    ? selectedSbActivityVocabulary(activitySelection)
    : lesson.vocabulary
  for (const raw of sourceTerms) {
    const term = typeof raw === 'string' ? raw.trim() : ''
    if (!term) continue
    if (terms.includes(term)) continue
    terms.push(term)
  }
  return {
    terms,
    copyText: terms.join(', '),
    isEmpty: terms.length === 0,
  }
}
