/**
 * Unit Learning Spine — generic read-only record types + lookup.
 *
 * Design authority:
 * `docs/phase-5/unit-learning-spine-and-prior-learning-ranking-design-v0.1.md`
 *
 * Slice: BE3 Unit 8 spine data only. No ranking, no Step 2 / UI / handoff wiring.
 */

/** Author-curated role for reusable prior-learning preference (not page-order logic). */
export type UnitLearningSpineRole = 'core' | 'support' | 'review_support'

/**
 * Learning kind for spine components.
 * Matches the design record; distinct from Activity Selection evidence.
 */
export type UnitLearningSpineLearningKind =
  | 'vocabulary'
  | 'communicative_language'
  | 'grammar'
  | 'reading_content'
  | 'phonics'
  | 'writing'
  | 'values_review'

/** Human-authored verification flag — spine entries are never auto-inferred. */
export type UnitLearningSpineVerificationStatus = 'human_verified'

/**
 * One author-curated component in a unit learning spine.
 * Read-only data for future ranking; not consumed by Step 2 today.
 */
export type UnitLearningSpineComponent = {
  readonly componentId: string
  readonly catalogBookId: string
  readonly unitNumber: number
  readonly unitTitle: string
  readonly title: string
  readonly componentType: string
  /** Inclusive printed-page scope (Student Book). */
  readonly printedPages: readonly number[]
  readonly role: UnitLearningSpineRole
  readonly learningKind: UnitLearningSpineLearningKind
  /** Optional author sequence label (e.g. Core 1). */
  readonly sequencingPosition: string | null
  readonly recycleReason: string
  readonly verificationStatus: UnitLearningSpineVerificationStatus
}

/** Full spine for one book unit — ordered in unit teaching sequence. */
export type UnitLearningSpine = {
  readonly catalogBookId: string
  readonly unitNumber: number
  readonly unitTitle: string
  readonly components: readonly UnitLearningSpineComponent[]
}

export function coreComponents(
  spine: UnitLearningSpine,
): readonly UnitLearningSpineComponent[] {
  return spine.components.filter((item) => item.role === 'core')
}

export function supportComponents(
  spine: UnitLearningSpine,
): readonly UnitLearningSpineComponent[] {
  return spine.components.filter(
    (item) => item.role === 'support' || item.role === 'review_support',
  )
}
