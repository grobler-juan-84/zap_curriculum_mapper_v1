/**
 * Suggested Chalkie vocabulary for the final handoff.
 * Current-page words/models only — never PRIOR / HM / teacher-added.
 * Local only; no API.
 */
import type { ChalkieLessonContext } from './resolveChalkieLessonContext'

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
): SuggestedChalkieVocabulary {
  const terms: string[] = []
  for (const raw of lesson.vocabulary) {
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
