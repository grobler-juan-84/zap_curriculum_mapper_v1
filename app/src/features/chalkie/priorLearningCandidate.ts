/**
 * Read-only Prior Learning / Horizontal Mapping candidate model (Slice 1+).
 *
 * Design authority:
 * `docs/phase-5/chalkie-prior-learning-horizontal-mapping-audit-v0.1.md`
 *
 * Shared record shape for same-unit `[PRIOR]` and curated earlier-unit `[HM]`.
 * No UI selection changes beyond optional teacher-controlled cards.
 * School Notes product surface remains Slice 4 (not authorized here).
 */
import type { NeutralLessonId } from './buildNeutralSbWbLessonPackage'
import {
  formatPriorSkillCardTitle,
  type TeacherChoiceSuggestion,
} from './teacherChoiceSuggestions'

/** Source family — maps to visible handoff labels. */
export type PriorLearningSourceType = 'PRIOR' | 'HM' | 'TEACHER_ADDED'

export type PriorLearningVerificationStatus =
  | 'verified'
  | 'provisional'
  | 'unverified'

export type PriorLearningLessonTarget = NeutralLessonId | 'both'

/** Inspectable Unit Learning Spine role when deterministically matched. */
export type PriorLearningSpineRole = 'core' | 'support'

/**
 * Distinguishes vocabulary vs language/grammar same-unit `[PRIOR]` foundations.
 * Surfaced lightly on Step 2 cards as plain provenance text (not badges/filters).
 */
export type PriorLearningEvidenceKind =
  | 'vocabulary'
  | 'communicative_language'
  | 'grammar'

/** Teacher-facing evidence-kind phrase for same-unit `[PRIOR]` provenance lines. */
export function priorLearningEvidenceKindDisplayLabel(
  evidenceKind: PriorLearningEvidenceKind | undefined | null,
): string | undefined {
  switch (evidenceKind) {
    case 'vocabulary':
      return 'Vocabulary'
    case 'communicative_language':
      return 'Language in Action'
    case 'grammar':
      return 'Grammar'
    default:
      return undefined
  }
}

/**
 * Light Step 2 provenance line for same-unit `[PRIOR]` cards.
 * Keeps `[PRIOR]` and the optional-support note; inserts evidence kind when known.
 */
export function formatSameUnitPriorProvenanceLine(input: {
  source: string
  evidenceKindLabel?: string | null
  includeOptionalSupportNote?: boolean
}): string {
  const parts = ['[PRIOR]', input.source.trim()].filter(Boolean)
  const kind = input.evidenceKindLabel?.trim()
  if (kind) parts.push(kind)
  if (input.includeOptionalSupportNote !== false) {
    parts.push('optional same-unit support — not current-page evidence')
  }
  return parts.join(' · ')
}

/**
 * Light Step 2 provenance line for curated earlier-unit `[HM]` cards.
 * Keeps `[HM]` distinct from same-unit `[PRIOR]` without badges/filters.
 */
export function formatCuratedHmProvenanceLine(input: {
  source: string
  includeOptionalSupportNote?: boolean
}): string {
  const parts = ['[HM]', input.source.trim()].filter(Boolean)
  if (input.includeOptionalSupportNote !== false) {
    parts.push('optional earlier-unit support — not current-page evidence')
  }
  return parts.join(' · ')
}

/**
 * Light Step 2 provenance line for session teacher-added skills.
 * Distinct from `[PRIOR]` / `[HM]` and from future School Notes (not persisted).
 */
export function formatTeacherAddedProvenanceLine(input?: {
  includeSessionNote?: boolean
}): string {
  const parts = ['[TEACHER-ADDED · UNVERIFIED]']
  if (input?.includeSessionNote !== false) {
    parts.push('session only — not publisher evidence')
  }
  return parts.join(' · ')
}

/**
 * Deterministic, inspectable candidate for optional teacher selection later.
 * Slice 1 produces these as read-only data — never auto-selected into handoff.
 */
export type PriorLearningCandidate = {
  readonly id: string
  readonly catalogBookId: string | null
  readonly unitNumber: number | null
  /** Inclusive printed-page scope in the source book; empty for pure teacher notes. */
  readonly printedPages: readonly number[]
  readonly pageIds: readonly string[]
  readonly sourceType: PriorLearningSourceType
  readonly title: string
  /**
   * Optional full Step 2 card label when title + pages cannot express the
   * curated bank wording (dual-unit `[HM]` items).
   */
  readonly suggestionLabel?: string
  /** Concise language/content preview (frame, models, or short content). */
  readonly contentPreview: string
  readonly whyItMayHelp: string
  readonly provenanceNote: string
  readonly target: PriorLearningLessonTarget
  readonly teacherNote: string | null
  readonly verificationStatus: PriorLearningVerificationStatus
  /** Human-readable source line for adapters / cards. */
  readonly sourceReference: string
  /** Caution for teachers (prior exposure ≠ mastery). */
  readonly caution: string
  /**
   * Optional Unit Learning Spine metadata (internal inspection only).
   * Present only when the candidate’s printed pages uniquely match one declared
   * spine component. Absent = honestly unclassified. Not used for ranking/UI yet.
   */
  readonly componentId?: string
  readonly spineRole?: PriorLearningSpineRole
  /** Optional evidence family — vocabulary vs communicative language vs grammar. */
  readonly evidenceKind?: PriorLearningEvidenceKind
  /** Verified language entity ids when the candidate is language/grammar-backed. */
  readonly languageIds?: readonly string[]
  /**
   * Verified activity ids only when notes (or an equivalent explicit link)
   * deterministically name a same-page activity. Empty/absent when not safe.
   */
  readonly activityIds?: readonly string[]
}

export function priorLearningProvenanceLabel(
  sourceType: PriorLearningSourceType,
): '[PRIOR]' | '[HM]' | '[TEACHER-ADDED · UNVERIFIED]' {
  switch (sourceType) {
    case 'PRIOR':
      return '[PRIOR]'
    case 'HM':
      return '[HM]'
    case 'TEACHER_ADDED':
      return '[TEACHER-ADDED · UNVERIFIED]'
  }
}

/**
 * Adapter bridge for the existing Step 2 card / handoff suggestion shape.
 * Slice 1 keeps UI on `TeacherChoiceSuggestion`; this map preserves behaviour.
 */
export function teacherChoiceSuggestionFromPriorLearningCandidate(
  candidate: PriorLearningCandidate,
): TeacherChoiceSuggestion {
  const pageStart = candidate.printedPages[0]
  const pageEnd =
    candidate.printedPages[candidate.printedPages.length - 1] ?? pageStart
  const unitNumber = candidate.unitNumber
  const label =
    candidate.suggestionLabel?.trim() ||
    (unitNumber != null && pageStart != null && pageEnd != null
      ? formatPriorSkillCardTitle({
          unitNumber,
          pageStart,
          pageEnd,
          skillName: candidate.title,
        })
      : candidate.title)

  const evidenceKindLabel = priorLearningEvidenceKindDisplayLabel(
    candidate.evidenceKind,
  )

  return {
    id: candidate.id,
    label,
    source: candidate.sourceReference,
    frame: candidate.contentPreview,
    whyItMayHelp: candidate.whyItMayHelp,
    caution: candidate.caution,
    evidenceNote: candidate.provenanceNote,
    provenanceTag:
      candidate.sourceType === 'PRIOR'
        ? '[PRIOR]'
        : candidate.sourceType === 'HM'
          ? '[HM]'
          : undefined,
    ...(evidenceKindLabel ? { evidenceKindLabel } : {}),
  }
}

/**
 * Neutral-package prior-support shape from a selected candidate (Slice 2+).
 * Exported for contract alignment; Slice 1 does not wire selection.
 */
export function neutralPriorSupportInputFromCandidate(
  candidate: PriorLearningCandidate,
): {
  readonly id: string
  readonly provenance: '[PRIOR]' | '[HM]' | '[TEACHER-ADDED · UNVERIFIED]'
  readonly label: string
  readonly frame: string
  readonly sourceReference: string | null
  readonly evidenceReference: string | null
  readonly purpose: string | null
  readonly targetLessons: readonly NeutralLessonId[]
} {
  const targetLessons: NeutralLessonId[] =
    candidate.target === 'both'
      ? ['lesson1', 'lesson2']
      : [candidate.target]

  return {
    id: candidate.id,
    provenance: priorLearningProvenanceLabel(candidate.sourceType),
    label: candidate.title,
    frame: candidate.contentPreview,
    sourceReference: candidate.sourceReference || null,
    evidenceReference: candidate.provenanceNote || null,
    purpose: candidate.teacherNote,
    targetLessons,
  }
}
