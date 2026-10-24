/**
 * Assemble same-unit `[PRIOR]` candidates for Step 2: vocabulary + verified
 * language/grammar foundations, then spine-aware ordering.
 *
 * Cards remain optional / unchecked. No badges, curated mapping, notes product, or AI.
 */
import type { BatchJsonSummary } from '../../types/validation'
import { buildSameUnitLanguageGrammarPriorLearningCandidates } from './buildSameUnitLanguageGrammarPriorLearningCandidates'
import { buildSameUnitPriorLearningCandidates } from './buildSameUnitPriorLearningCandidates'
import { orderSameUnitPriorLearningCandidatesBySpineRole } from './orderSameUnitPriorLearningCandidatesBySpineRole'
import type { PriorLearningCandidate } from './priorLearningCandidate'

export type AssembleSameUnitPriorLearningCandidatesInput = {
  readonly summary: BatchJsonSummary
  readonly visiblePrintedPages: readonly number[]
  readonly unitNumber: number
  readonly catalogBookId?: string | null
}

/**
 * Merge vocabulary and language/grammar same-unit candidates, then order
 * core → support → unclassified (stable within role).
 */
export function assembleSameUnitPriorLearningCandidates(
  input: AssembleSameUnitPriorLearningCandidatesInput,
): PriorLearningCandidate[] {
  const vocabulary = buildSameUnitPriorLearningCandidates(input)
  const languageGrammar = buildSameUnitLanguageGrammarPriorLearningCandidates(input)
  return orderSameUnitPriorLearningCandidatesBySpineRole([
    ...vocabulary,
    ...languageGrammar,
  ])
}
