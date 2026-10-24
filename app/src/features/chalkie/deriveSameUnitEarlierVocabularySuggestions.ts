/**
 * Deterministic same-unit earlier-page vocabulary suggestions for Chalkie Step 2.
 * No API calls. Not cross-unit horizontal mapping.
 *
 * Slice 1: thin adapter over `buildSameUnitPriorLearningCandidates` so the UI
 * keeps receiving `TeacherChoiceSuggestion` without selection/behaviour change.
 */
import type { BatchJsonSummary } from '../../types/validation'
import { buildSameUnitPriorLearningCandidates } from './buildSameUnitPriorLearningCandidates'
import {
  teacherChoiceSuggestionFromPriorLearningCandidate,
} from './priorLearningCandidate'
import type { TeacherChoiceSuggestion } from './teacherChoiceSuggestions'

/**
 * Offer human-verified target vocabulary from earlier printed pages in the same
 * unit summary, grouped by curriculum-component title on that page.
 */
export function deriveSameUnitEarlierVocabularySuggestions(input: {
  summary: BatchJsonSummary
  visiblePrintedPages: number[]
  unitNumber: number
}): TeacherChoiceSuggestion[] {
  return buildSameUnitPriorLearningCandidates({
    summary: input.summary,
    visiblePrintedPages: input.visiblePrintedPages,
    unitNumber: input.unitNumber,
    catalogBookId: input.summary.catalogBookId ?? null,
  }).map(teacherChoiceSuggestionFromPriorLearningCandidate)
}
