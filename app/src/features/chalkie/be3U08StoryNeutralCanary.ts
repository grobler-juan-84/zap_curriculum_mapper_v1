/**
 * Story-only guarded production canary for neutral package → shared Chalkie dispatcher.
 *
 * Default OFF. Exact relationship: be3_sb_wb_rel_u08_story_sb130-131_wb106
 * (SB pp.130–131 → WB p.106 only). WB p.107 must never appear.
 *
 * Status: IMPLEMENTED / AWAITING OWNER MANUAL CHECK
 */
import type { TeacherAddedLanguageInput } from './buildChalkiePromptPreview'
import {
  buildBe3U08StorySbWbSeriesHandoff,
  BE3_U08_STORY_SERIES_RELATIONSHIP_ID,
  type Be3U08StorySeriesHandoff,
} from './buildBe3U08StorySbWbSeriesHandoff'
import {
  buildNeutralSbWbLessonPackage,
  type NeutralPriorSupportInput,
  type NeutralSbWbLessonPackage,
} from './buildNeutralSbWbLessonPackage'
import type { SbActivityHandoffSelection } from './chalkieActivitySelection'
import type { WbActivityHandoffSelection } from './chalkieWorkbookActivitySelection'
import {
  renderChalkieFromNeutralPackage,
  UnsupportedNeutralPackageRendererError,
  type ChalkieNeutralPackageRenderOutput,
} from './renderChalkieFromNeutralPackage'
import type { VerifiedSbWbCompanion } from './resolveVerifiedSbWbCompanion'
import type { TeacherChoiceSuggestion } from './teacherChoiceSuggestions'

/** Vite public env flag — opt-in only; default unset/false keeps bespoke path. */
export const BE3_U08_STORY_NEUTRAL_CANARY_ENV =
  'VITE_CHALKIE_BE3_U08_STORY_NEUTRAL_CANARY'

export type StoryNeutralCanaryArtifactKey =
  | 'detailedHandoff'
  | 'lesson1Outline'
  | 'lesson1Vocabulary'
  | 'lesson2Outline'
  | 'lesson2Vocabulary'

export type StoryNeutralCanaryDiagnostic = {
  readonly relationshipId: string
  readonly reason:
    | 'artifact_mismatch'
    | 'unsupported_relationship'
    | 'renderer_error'
    | 'package_error'
    | 'missing_selection'
  readonly mismatchedArtifacts: readonly StoryNeutralCanaryArtifactKey[]
  readonly message: string
}

export type StoryNeutralCanaryResult = {
  readonly handoff: Be3U08StorySeriesHandoff
  readonly servedFrom: 'bespoke' | 'neutral_canary'
  readonly diagnostic: StoryNeutralCanaryDiagnostic | null
}

export type StoryNeutralCanaryInput = {
  readonly companion: VerifiedSbWbCompanion
  readonly selectedSuggestions?: readonly TeacherChoiceSuggestion[]
  readonly teacherAdditions?: readonly TeacherAddedLanguageInput[]
  readonly activitySelection?: SbActivityHandoffSelection
  readonly workbookActivitySelection?: WbActivityHandoffSelection
  /** Test override. When omitted, reads the Vite env flag (default off). */
  readonly canaryEnabled?: boolean
  readonly buildBespoke?: typeof buildBe3U08StorySbWbSeriesHandoff
  readonly buildNeutralPackage?: typeof buildNeutralSbWbLessonPackage
  readonly renderNeutral?: typeof renderChalkieFromNeutralPackage
  readonly onDiagnostic?: (diagnostic: StoryNeutralCanaryDiagnostic) => void
}

const ARTIFACT_KEYS: readonly StoryNeutralCanaryArtifactKey[] = [
  'detailedHandoff',
  'lesson1Outline',
  'lesson1Vocabulary',
  'lesson2Outline',
  'lesson2Vocabulary',
]

function envFlagEnabled(raw: string | boolean | undefined): boolean {
  if (raw === true) return true
  if (typeof raw !== 'string') return false
  const normalized = raw.trim().toLowerCase()
  return normalized === '1' || normalized === 'true' || normalized === 'yes'
}

export function isBe3U08StoryNeutralCanaryEnabled(
  env?: { readonly [key: string]: string | boolean | undefined } | null,
): boolean {
  const resolved =
    env ??
    (typeof import.meta !== 'undefined'
      ? (import.meta.env as
          | { readonly [key: string]: string | boolean | undefined }
          | undefined)
      : undefined) ??
    {}
  return envFlagEnabled(resolved[BE3_U08_STORY_NEUTRAL_CANARY_ENV])
}

export function mapTeacherInputsToStoryPriorSupport(input: {
  readonly selectedSuggestions: readonly TeacherChoiceSuggestion[]
  readonly teacherAdditions: readonly TeacherAddedLanguageInput[]
}): NeutralPriorSupportInput[] {
  const records: NeutralPriorSupportInput[] = []

  for (const suggestion of input.selectedSuggestions) {
    records.push({
      id: suggestion.id,
      provenance: suggestion.provenanceTag ?? '[PRIOR]',
      label: suggestion.label,
      frame: suggestion.frame,
      sourceReference: suggestion.source,
      evidenceReference:
        suggestion.evidenceNote.trim() || 'teacher-selected support',
      purpose: null,
      targetLessons: ['lesson1', 'lesson2'],
    })
  }

  input.teacherAdditions.forEach((addition, index) => {
    records.push({
      id: `teacher-added-${index + 1}`,
      provenance: '[TEACHER-ADDED · UNVERIFIED]',
      label: addition.title.trim(),
      frame: addition.frame.trim(),
      sourceReference: null,
      evidenceReference: null,
      purpose: addition.purpose.trim() || null,
      targetLessons: ['lesson1', 'lesson2'],
    })
  })

  return records
}

function compareArtifacts(
  bespoke: Be3U08StorySeriesHandoff,
  neutral: ChalkieNeutralPackageRenderOutput,
): StoryNeutralCanaryArtifactKey[] {
  return ARTIFACT_KEYS.filter((key) => bespoke[key] !== neutral[key])
}

function emitDiagnostic(
  diagnostic: StoryNeutralCanaryDiagnostic,
  onDiagnostic?: (diagnostic: StoryNeutralCanaryDiagnostic) => void,
): void {
  onDiagnostic?.(diagnostic)
  console.warn(`[Chalkie Story neutral canary] ${diagnostic.message}`)
}

function serveBespoke(
  handoff: Be3U08StorySeriesHandoff,
  diagnostic: StoryNeutralCanaryDiagnostic | null,
  onDiagnostic?: (diagnostic: StoryNeutralCanaryDiagnostic) => void,
): StoryNeutralCanaryResult {
  if (diagnostic) emitDiagnostic(diagnostic, onDiagnostic)
  return {
    handoff,
    servedFrom: 'bespoke',
    diagnostic,
  }
}

/**
 * Build the Story series handoff, optionally through the guarded neutral canary.
 * When the canary flag is off, only the bespoke builder runs.
 */
export function buildBe3U08StorySbWbSeriesHandoffWithNeutralCanary(
  input: StoryNeutralCanaryInput,
): StoryNeutralCanaryResult {
  const buildBespoke = input.buildBespoke ?? buildBe3U08StorySbWbSeriesHandoff
  const selectedSuggestions = [...(input.selectedSuggestions ?? [])]
  const teacherAdditions = [...(input.teacherAdditions ?? [])]
  const bespoke = buildBespoke({
    selectedSuggestions,
    teacherAdditions,
    activitySelection: input.activitySelection,
    workbookActivitySelection: input.workbookActivitySelection,
  })

  const enabled = input.canaryEnabled ?? isBe3U08StoryNeutralCanaryEnabled()
  if (!enabled) {
    return {
      handoff: bespoke,
      servedFrom: 'bespoke',
      diagnostic: null,
    }
  }

  if (
    input.companion.relationshipId !== BE3_U08_STORY_SERIES_RELATIONSHIP_ID
  ) {
    return serveBespoke(
      bespoke,
      {
        relationshipId: input.companion.relationshipId,
        reason: 'unsupported_relationship',
        mismatchedArtifacts: [],
        message: `relationship ${input.companion.relationshipId}: canary refused; served bespoke`,
      },
      input.onDiagnostic,
    )
  }

  if (!input.activitySelection || !input.workbookActivitySelection) {
    return serveBespoke(
      bespoke,
      {
        relationshipId: BE3_U08_STORY_SERIES_RELATIONSHIP_ID,
        reason: 'missing_selection',
        mismatchedArtifacts: [],
        message: `relationship ${BE3_U08_STORY_SERIES_RELATIONSHIP_ID}: canary skipped (missing selection); served bespoke`,
      },
      input.onDiagnostic,
    )
  }

  const buildNeutralPackage =
    input.buildNeutralPackage ?? buildNeutralSbWbLessonPackage
  const renderNeutral = input.renderNeutral ?? renderChalkieFromNeutralPackage

  let lessonPackage: NeutralSbWbLessonPackage
  try {
    lessonPackage = buildNeutralPackage({
      companion: input.companion,
      sbSelection: input.activitySelection,
      wbSelection: input.workbookActivitySelection,
      priorSupport: mapTeacherInputsToStoryPriorSupport({
        selectedSuggestions,
        teacherAdditions,
      }),
    })
  } catch {
    return serveBespoke(
      bespoke,
      {
        relationshipId: BE3_U08_STORY_SERIES_RELATIONSHIP_ID,
        reason: 'package_error',
        mismatchedArtifacts: [],
        message: `relationship ${BE3_U08_STORY_SERIES_RELATIONSHIP_ID}: package assembly failed; served bespoke`,
      },
      input.onDiagnostic,
    )
  }

  let neutral: ChalkieNeutralPackageRenderOutput
  try {
    neutral = renderNeutral(lessonPackage)
  } catch (error) {
    if (error instanceof UnsupportedNeutralPackageRendererError) {
      return serveBespoke(
        bespoke,
        {
          relationshipId: error.relationshipId,
          reason: 'unsupported_relationship',
          mismatchedArtifacts: [],
          message: `relationship ${error.relationshipId}: unsupported renderer; served bespoke`,
        },
        input.onDiagnostic,
      )
    }
    return serveBespoke(
      bespoke,
      {
        relationshipId: BE3_U08_STORY_SERIES_RELATIONSHIP_ID,
        reason: 'renderer_error',
        mismatchedArtifacts: [],
        message: `relationship ${BE3_U08_STORY_SERIES_RELATIONSHIP_ID}: renderer error; served bespoke`,
      },
      input.onDiagnostic,
    )
  }

  const mismatchedArtifacts = compareArtifacts(bespoke, neutral)
  if (mismatchedArtifacts.length > 0) {
    return serveBespoke(
      bespoke,
      {
        relationshipId: BE3_U08_STORY_SERIES_RELATIONSHIP_ID,
        reason: 'artifact_mismatch',
        mismatchedArtifacts,
        message: `relationship ${BE3_U08_STORY_SERIES_RELATIONSHIP_ID}: mismatch on ${mismatchedArtifacts.join(', ')}; served bespoke`,
      },
      input.onDiagnostic,
    )
  }

  return {
    handoff: {
      ...bespoke,
      detailedHandoff: neutral.detailedHandoff,
      lesson1Outline: neutral.lesson1Outline,
      lesson1Vocabulary: neutral.lesson1Vocabulary,
      lesson2Outline: neutral.lesson2Outline,
      lesson2Vocabulary: neutral.lesson2Vocabulary,
    },
    servedFrom: 'neutral_canary',
    diagnostic: null,
  }
}
