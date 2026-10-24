/**
 * Narrow deterministic ordering for same-unit `[PRIOR]` candidates.
 *
 * Order: `core` → `support` → unclassified (no `spineRole`).
 * Within each bucket, preserve existing source order (stable).
 * Does not invent candidates, change selection defaults, or add UI.
 *
 * Design: `docs/phase-5/unit-learning-spine-and-prior-learning-ranking-design-v0.1.md`
 */
import type { PriorLearningCandidate } from './priorLearningCandidate'

function spineRoleRank(
  role: PriorLearningCandidate['spineRole'],
): number {
  if (role === 'core') return 0
  if (role === 'support') return 1
  return 2
}

/**
 * Return candidates ordered by spine role. Does not mutate the input.
 * Candidates with the same rank keep their relative source order.
 */
export function orderSameUnitPriorLearningCandidatesBySpineRole(
  candidates: readonly PriorLearningCandidate[],
): PriorLearningCandidate[] {
  return candidates
    .map((candidate, sourceIndex) => ({ candidate, sourceIndex }))
    .sort((a, b) => {
      const rankDelta =
        spineRoleRank(a.candidate.spineRole) -
        spineRoleRank(b.candidate.spineRole)
      if (rankDelta !== 0) return rankDelta
      return a.sourceIndex - b.sourceIndex
    })
    .map(({ candidate }) => candidate)
}
