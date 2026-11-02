/**
 * Flag-off five-artifact series handoff for verified BE3 U8 companions
 * LiA → Review (Opener/Story keep their bespoke builders).
 *
 * Builds via existing neutral package + shared Chalkie renderer. Does not load
 * NLL or attach BI. Used when NLL C-adapters are off or fail closed.
 */
import { mapTeacherInputsToStoryPriorSupport } from './be3U08StoryNeutralCanary'
import type { TeacherAddedLanguageInput } from './buildChalkiePromptPreview'
import {
  buildNeutralSbWbLessonPackage,
} from './buildNeutralSbWbLessonPackage'
import type { SbActivityHandoffSelection } from './chalkieActivitySelection'
import type { WbActivityHandoffSelection } from './chalkieWorkbookActivitySelection'
import { renderChalkieFromNeutralPackage } from './renderChalkieFromNeutralPackage'
import type { VerifiedSbWbCompanion } from './resolveVerifiedSbWbCompanion'
import type { TeacherChoiceSuggestion } from './teacherChoiceSuggestions'
import {
  BE3_U08_CLIL_PE_STABLE_REF,
  BE3_U08_CULTURE_STABLE_REF,
  BE3_U08_GRAMMAR_STABLE_REF,
  BE3_U08_LIA_STABLE_REF,
  BE3_U08_PHONICS_STABLE_REF,
  BE3_U08_REVIEW_STABLE_REF,
  BE3_U08_SB132_133_WB107_108,
  BE3_U08_SB134_135_WB109_110,
  BE3_U08_SB136_137_WB111_112,
  BE3_U08_SB138_139_WB113_114,
  BE3_U08_SB140_WB115,
  BE3_U08_SB141_WB116,
  BE3_U08_SB143_WB117,
  BE3_U08_WRITING_STABLE_REF,
} from './verifiedSbWbCompanions'

export type Be3U08NeutralSeriesHandoff = {
  readonly relationshipId: string
  readonly seriesTitle: string
  readonly stableSeriesReference: string
  readonly detailedHandoff: string
  readonly lesson1Outline: string
  readonly lesson1Vocabulary: string
  readonly lesson2Outline: string
  readonly lesson2Vocabulary: string
}

type NeutralSeriesMeta = {
  readonly seriesTitle: string
  readonly stableSeriesReference: string
}

const NEUTRAL_SERIES_BY_RELATIONSHIP_ID: ReadonlyMap<string, NeutralSeriesMeta> =
  new Map([
    [
      BE3_U08_SB132_133_WB107_108.relationshipId,
      {
        seriesTitle:
          'BE3 Unit 08 · SB pp. 132–133 + WB pp. 107–108 — Healthy Living — Language in Action',
        stableSeriesReference: BE3_U08_LIA_STABLE_REF,
      },
    ],
    [
      BE3_U08_SB134_135_WB109_110.relationshipId,
      {
        seriesTitle:
          'BE3 Unit 08 · SB pp. 134–135 + WB pp. 109–110 — Healthy Living — Content Connection / P.E.',
        stableSeriesReference: BE3_U08_CLIL_PE_STABLE_REF,
      },
    ],
    [
      BE3_U08_SB136_137_WB111_112.relationshipId,
      {
        seriesTitle:
          'BE3 Unit 08 · SB pp. 136–137 + WB pp. 111–112 — Healthy Living — Grammar',
        stableSeriesReference: BE3_U08_GRAMMAR_STABLE_REF,
      },
    ],
    [
      BE3_U08_SB138_139_WB113_114.relationshipId,
      {
        seriesTitle:
          'BE3 Unit 08 · SB pp. 138–139 + WB pp. 113–114 — Healthy Living — Culture Connection',
        stableSeriesReference: BE3_U08_CULTURE_STABLE_REF,
      },
    ],
    [
      BE3_U08_SB140_WB115.relationshipId,
      {
        seriesTitle:
          'BE3 Unit 08 · SB p. 140 + WB p. 115 — Healthy Living — Writing',
        stableSeriesReference: BE3_U08_WRITING_STABLE_REF,
      },
    ],
    [
      BE3_U08_SB141_WB116.relationshipId,
      {
        seriesTitle:
          'BE3 Unit 08 · SB p. 141 + WB p. 116 — Healthy Living — Phonics',
        stableSeriesReference: BE3_U08_PHONICS_STABLE_REF,
      },
    ],
    [
      BE3_U08_SB143_WB117.relationshipId,
      {
        seriesTitle:
          'BE3 Unit 08 · SB p. 143 + WB p. 117 — Healthy Living — Review',
        stableSeriesReference: BE3_U08_REVIEW_STABLE_REF,
      },
    ],
  ])

export function resolveBe3U08NeutralSeriesMeta(
  companion: { relationshipId?: string | null } | null | undefined,
): NeutralSeriesMeta | null {
  const relationshipId = companion?.relationshipId
  if (!relationshipId) return null
  return NEUTRAL_SERIES_BY_RELATIONSHIP_ID.get(relationshipId) ?? null
}

export function isBe3U08NeutralSeriesCompanion(
  companion: { relationshipId?: string | null } | null | undefined,
): boolean {
  return resolveBe3U08NeutralSeriesMeta(companion) != null
}

/**
 * Build the five Chalkie series artifacts for a LiA→Review verified companion.
 * Returns null when the companion is unsupported or selections are missing.
 */
export function buildBe3U08NeutralSeriesHandoff(input: {
  readonly companion: VerifiedSbWbCompanion
  readonly selectedSuggestions?: readonly TeacherChoiceSuggestion[]
  readonly teacherAdditions?: readonly TeacherAddedLanguageInput[]
  readonly activitySelection?: SbActivityHandoffSelection
  readonly workbookActivitySelection?: WbActivityHandoffSelection
}): Be3U08NeutralSeriesHandoff | null {
  const meta = resolveBe3U08NeutralSeriesMeta(input.companion)
  if (!meta) return null
  if (!input.activitySelection || !input.workbookActivitySelection) return null

  try {
    const nlp = buildNeutralSbWbLessonPackage({
      companion: input.companion,
      sbSelection: input.activitySelection,
      wbSelection: input.workbookActivitySelection,
      priorSupport: mapTeacherInputsToStoryPriorSupport({
        selectedSuggestions: [...(input.selectedSuggestions ?? [])],
        teacherAdditions: [...(input.teacherAdditions ?? [])],
      }),
      // LiA→Review remain BI-absent on this fallback path.
    })
    const rendered = renderChalkieFromNeutralPackage(nlp)
    return {
      relationshipId: input.companion.relationshipId,
      seriesTitle: meta.seriesTitle,
      stableSeriesReference: meta.stableSeriesReference,
      detailedHandoff: rendered.detailedHandoff,
      lesson1Outline: rendered.lesson1Outline,
      lesson1Vocabulary: rendered.lesson1Vocabulary,
      lesson2Outline: rendered.lesson2Outline,
      lesson2Vocabulary: rendered.lesson2Vocabulary,
    }
  } catch {
    return null
  }
}
