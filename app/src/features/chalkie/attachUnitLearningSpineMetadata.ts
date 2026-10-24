/**
 * Read-only Unit Learning Spine metadata enrichment for same-unit `[PRIOR]` candidates.
 *
 * Attaches optional `componentId` / `spineRole` only on exact deterministic matches.
 * Does not change wording, IDs, provenance, ranking, selection, or UI.
 *
 * Design: `docs/phase-5/unit-learning-spine-and-prior-learning-ranking-design-v0.1.md`
 */
import { getUnitLearningSpine } from './be3U08UnitLearningSpine'
import type {
  PriorLearningCandidate,
  PriorLearningSpineRole,
} from './priorLearningCandidate'
import type {
  UnitLearningSpine,
  UnitLearningSpineComponent,
  UnitLearningSpineRole,
} from './unitLearningSpine'

export type PriorLearningSpineMetadata = {
  readonly componentId: string
  readonly spineRole: PriorLearningSpineRole
}

function toInspectableSpineRole(
  role: UnitLearningSpineRole,
): PriorLearningSpineRole {
  return role === 'core' ? 'core' : 'support'
}

/**
 * Find the unique spine component that fully contains the candidate's printed pages.
 * Zero or multiple matches → unclassified (null). Never guesses.
 */
export function resolveUnitLearningSpineMetadataForCandidate(
  candidate: Pick<
    PriorLearningCandidate,
    'printedPages' | 'catalogBookId' | 'unitNumber'
  >,
  spine: UnitLearningSpine | null,
): PriorLearningSpineMetadata | null {
  if (spine == null) return null
  if (
    candidate.catalogBookId == null ||
    candidate.catalogBookId !== spine.catalogBookId
  ) {
    return null
  }
  if (
    candidate.unitNumber == null ||
    candidate.unitNumber !== spine.unitNumber
  ) {
    return null
  }

  const pages = candidate.printedPages.filter((n) => Number.isFinite(n))
  if (pages.length === 0) return null

  const matches: UnitLearningSpineComponent[] = spine.components.filter(
    (component) =>
      pages.every((page) => component.printedPages.includes(page)),
  )

  if (matches.length !== 1) return null

  const match = matches[0]!
  return {
    componentId: match.componentId,
    spineRole: toInspectableSpineRole(match.role),
  }
}

function withoutSpineMetadata(
  candidate: PriorLearningCandidate,
): PriorLearningCandidate {
  if (candidate.componentId === undefined && candidate.spineRole === undefined) {
    return candidate
  }
  const {
    componentId: _componentId,
    spineRole: _spineRole,
    ...rest
  } = candidate
  void _componentId
  void _spineRole
  return rest
}

/**
 * Return a candidate with optional spine metadata when deterministically known.
 * Both fields absent when unclassified. Does not mutate the input.
 */
export function attachUnitLearningSpineMetadata(
  candidate: PriorLearningCandidate,
  spine: UnitLearningSpine | null = candidate.catalogBookId != null &&
    candidate.unitNumber != null
    ? getUnitLearningSpine(candidate.catalogBookId, candidate.unitNumber)
    : null,
): PriorLearningCandidate {
  const meta = resolveUnitLearningSpineMetadataForCandidate(candidate, spine)
  if (meta == null) return withoutSpineMetadata(candidate)
  return {
    ...withoutSpineMetadata(candidate),
    componentId: meta.componentId,
    spineRole: meta.spineRole,
  }
}
