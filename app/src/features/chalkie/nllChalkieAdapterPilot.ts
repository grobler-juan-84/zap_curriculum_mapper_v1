/**
 * Bounded Stage 5 NLL -> NLP -> Chalkie adapter pilot.
 * Default-off; BE3 U8 Opener only; lazy Chalkie series path only.
 * NLL summaries stay package-only and never become Chalkie prose.
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import type { BookIntelligenceUnitOverview } from '../../types/bookIntelligence'
import type { TeacherAddedLanguageInput } from './buildChalkiePromptPreview'
import {
  BE3_U08_OPENER_SERIES_RELATIONSHIP_ID,
  BE3_U08_OPENER_SERIES_STABLE_REF,
  BE3_U08_OPENER_SERIES_TITLE,
  type Be3U08OpenerSeriesHandoff,
} from './buildBe3U08OpenerSbWbSeriesHandoff'
import {
  buildNeutralSbWbLessonPackage,
  type NeutralPriorSupportInput,
  type NeutralSbWbLessonPackage,
} from './buildNeutralSbWbLessonPackage'
import type {
  SbActivityCard,
  SbActivityHandoffSelection,
} from './chalkieActivitySelection'
import type {
  WbActivityCard,
  WbActivityHandoffSelection,
} from './chalkieWorkbookActivitySelection'
import {
  BE3_U08_OPENER_NLL_COMPONENT_KEY,
  isExactBe3U08OpenerNllCardComparisonScope,
  openerNllCardComparisonScopeKey,
} from './nllCardComparison'
import { attachSelectedNllDerivedKnowledge } from './nllGeneralLessonPlanPilot'
import {
  renderChalkieFromNeutralPackage,
  type ChalkieNeutralPackageRenderOutput,
} from './renderChalkieFromNeutralPackage'
import type { VerifiedSbWbCompanion } from './resolveVerifiedSbWbCompanion'
import type { TeacherChoiceSuggestion } from './teacherChoiceSuggestions'
import {
  loadNeutralLessonComponent,
  type ResolvedNllComponent,
} from '../nll/neutralLessonLibrary'

export const NLL_CHALKIE_ADAPTER_PILOT_ENV =
  'VITE_NLL_CHALKIE_ADAPTER_PILOT'

function envFlagEnabled(raw: string | boolean | undefined): boolean {
  if (raw === true) return true
  if (typeof raw !== 'string') return false
  const normalized = raw.trim().toLowerCase()
  return normalized === '1' || normalized === 'true' || normalized === 'yes'
}

export function isNllChalkieAdapterPilotEnabled(
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
  return envFlagEnabled(resolved[NLL_CHALKIE_ADAPTER_PILOT_ENV])
}

export function isExactBe3U08OpenerNllChalkieAdapterScope(input: {
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly companion: VerifiedSbWbCompanion | null
}): boolean {
  return isExactBe3U08OpenerNllCardComparisonScope(input)
}

export function shouldRunNllChalkieAdapterPilot(input: {
  readonly flagEnabled: boolean
  readonly exactScopeEligible: boolean
  readonly chalkieRequested: boolean
  readonly seriesPackageRequested: boolean
}): boolean {
  return (
    input.flagEnabled &&
    input.exactScopeEligible &&
    input.chalkieRequested &&
    input.seriesPackageRequested
  )
}

export type NllChalkieAdapterPreparedOutputKind =
  | 'chalkie'
  | 'lesson_plan'
  | null

export function nllChalkieAdapterRequestKey(input: {
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly companion: VerifiedSbWbCompanion | null
  readonly sbSelection: SbActivityHandoffSelection
  readonly wbSelection: WbActivityHandoffSelection
  readonly selectedSuggestions: readonly TeacherChoiceSuggestion[]
  readonly teacherAdditions: readonly TeacherAddedLanguageInput[]
}): string {
  const scopeKey = openerNllCardComparisonScopeKey(input)
  const sbIds = input.sbSelection.selectedEvidence.map((item) => item.cardId)
  const wbIds = input.wbSelection.selectedEvidence.map((item) => item.cardId)
  const prior = input.selectedSuggestions.map((item) => [
    item.id,
    item.label,
    item.frame,
    item.source,
    item.evidenceNote,
  ])
  const additions = input.teacherAdditions.map((item) => [
    item.title,
    item.frame,
    item.purpose,
  ])
  return JSON.stringify([scopeKey, sbIds, wbIds, prior, additions])
}

export function shouldApplyNllChalkieAdapterPilotResult(input: {
  readonly requestId: number
  readonly latestRequestId: number
  readonly overlayOpen: boolean
  readonly requestKey: string
  readonly currentRequestKey: string
  readonly preparedOutputKind: NllChalkieAdapterPreparedOutputKind
}): boolean {
  return (
    input.overlayOpen &&
    input.requestId === input.latestRequestId &&
    input.requestKey === input.currentRequestKey &&
    input.preparedOutputKind === 'chalkie'
  )
}

export function invalidateNllChalkieAdapterPilotRequest(input: {
  readonly requestIdRef: { current: number }
}): void {
  input.requestIdRef.current += 1
}

function mapTeacherInputsToOpenerPriorSupport(input: {
  readonly selectedSuggestions: readonly TeacherChoiceSuggestion[]
  readonly teacherAdditions: readonly TeacherAddedLanguageInput[]
}): NeutralPriorSupportInput[] {
  const records: NeutralPriorSupportInput[] = input.selectedSuggestions.map(
    (suggestion) => ({
      id: suggestion.id,
      provenance: suggestion.provenanceTag ?? '[PRIOR]',
      label: suggestion.label,
      frame: suggestion.frame,
      sourceReference: suggestion.source,
      evidenceReference:
        suggestion.evidenceNote.trim() || 'teacher-selected support',
      purpose: null,
      targetLessons: ['lesson1', 'lesson2'],
    }),
  )

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

export type NllChalkieAdapterPilotLoadNll = (
  client: SupabaseClient | null,
  componentKey: string,
  options: { readonly includeHiddenExperimental: true },
) => Promise<ResolvedNllComponent | null>

export type NllChalkieAdapterPilotSuccess = {
  readonly ok: true
  readonly nlp: NeutralSbWbLessonPackage
  readonly handoff: Be3U08OpenerSeriesHandoff
}

export type NllChalkieAdapterPilotFallback = {
  readonly ok: false
  readonly reason:
    | 'flag_off'
    | 'ineligible_scope'
    | 'missing_client'
    | 'missing_component'
    | 'load_error'
    | 'package_error'
    | 'renderer_error'
  readonly message: string
}

export type NllChalkieAdapterPilotResult =
  | NllChalkieAdapterPilotSuccess
  | NllChalkieAdapterPilotFallback

export type AssembleNllChalkieAdapterPilotInput = {
  readonly flagEnabled?: boolean
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly companion: VerifiedSbWbCompanion | null
  readonly sbSelection: SbActivityHandoffSelection
  readonly wbSelection: WbActivityHandoffSelection
  readonly selectedSuggestions?: readonly TeacherChoiceSuggestion[]
  readonly teacherAdditions?: readonly TeacherAddedLanguageInput[]
  readonly bookIntelligenceUnit?: BookIntelligenceUnitOverview | null
  readonly biArtifactRef?: string | null
  readonly client: SupabaseClient | null
  readonly loadNll?: NllChalkieAdapterPilotLoadNll
  readonly buildNeutralPackage?: typeof buildNeutralSbWbLessonPackage
  readonly renderNeutral?: typeof renderChalkieFromNeutralPackage
  readonly env?: { readonly [key: string]: string | boolean | undefined } | null
}

const defaultLoadNll: NllChalkieAdapterPilotLoadNll = async (
  client,
  componentKey,
  options,
) => {
  if (!client) return null
  return loadNeutralLessonComponent(client, componentKey, options)
}

function toOpenerHandoff(
  rendered: ChalkieNeutralPackageRenderOutput,
): Be3U08OpenerSeriesHandoff {
  return {
    relationshipId: BE3_U08_OPENER_SERIES_RELATIONSHIP_ID,
    seriesTitle: BE3_U08_OPENER_SERIES_TITLE,
    stableSeriesReference: BE3_U08_OPENER_SERIES_STABLE_REF,
    ...rendered,
  }
}

/**
 * Lazy Stage 5 assembler: load NLL, assemble the exact selected NLP, attach
 * selected summaries, then render the five existing Chalkie artifacts.
 * Never throws to the UI; callers retain the existing bespoke fallback.
 */
export async function assembleNllChalkieAdapterPilot(
  input: AssembleNllChalkieAdapterPilotInput,
): Promise<NllChalkieAdapterPilotResult> {
  const flagEnabled =
    input.flagEnabled ?? isNllChalkieAdapterPilotEnabled(input.env)
  if (!flagEnabled) {
    return {
      ok: false,
      reason: 'flag_off',
      message: 'Stage 5 Chalkie adapter pilot flag is off.',
    }
  }

  const exactScope = isExactBe3U08OpenerNllChalkieAdapterScope({
    activityCards: input.activityCards,
    workbookActivityCards: input.workbookActivityCards,
    companion: input.companion,
  })
  if (!exactScope || !input.companion) {
    return {
      ok: false,
      reason: 'ineligible_scope',
      message: 'Exact BE3 Unit 8 Opener scope is required for the Stage 5 pilot.',
    }
  }

  if (!input.client && !input.loadNll) {
    return {
      ok: false,
      reason: 'missing_client',
      message: 'Supabase client is unavailable for NLL load.',
    }
  }

  const loadNll = input.loadNll ?? defaultLoadNll
  let resolved: ResolvedNllComponent | null
  try {
    resolved = await loadNll(
      input.client,
      BE3_U08_OPENER_NLL_COMPONENT_KEY,
      { includeHiddenExperimental: true },
    )
  } catch (error) {
    return {
      ok: false,
      reason: 'load_error',
      message:
        error instanceof Error ? error.message : 'NLL component load failed.',
    }
  }

  if (!resolved) {
    return {
      ok: false,
      reason: 'missing_component',
      message: `NLL component ${BE3_U08_OPENER_NLL_COMPONENT_KEY} was not found.`,
    }
  }

  const buildNeutral = input.buildNeutralPackage ?? buildNeutralSbWbLessonPackage
  let nlp: NeutralSbWbLessonPackage
  try {
    const base = buildNeutral({
      companion: input.companion,
      sbSelection: input.sbSelection,
      wbSelection: input.wbSelection,
      priorSupport: mapTeacherInputsToOpenerPriorSupport({
        selectedSuggestions: [...(input.selectedSuggestions ?? [])],
        teacherAdditions: [...(input.teacherAdditions ?? [])],
      }),
      bookIntelligenceUnit: input.bookIntelligenceUnit,
      biArtifactRef: input.biArtifactRef,
    })
    nlp = attachSelectedNllDerivedKnowledge({ nlp: base, resolved })
  } catch (error) {
    return {
      ok: false,
      reason: 'package_error',
      message:
        error instanceof Error
          ? error.message
          : 'Neutral lesson package assembly failed.',
    }
  }

  const renderNeutral = input.renderNeutral ?? renderChalkieFromNeutralPackage
  try {
    return {
      ok: true,
      nlp,
      handoff: toOpenerHandoff(renderNeutral(nlp)),
    }
  } catch (error) {
    return {
      ok: false,
      reason: 'renderer_error',
      message:
        error instanceof Error
          ? error.message
          : 'Neutral Chalkie rendering failed.',
    }
  }
}
