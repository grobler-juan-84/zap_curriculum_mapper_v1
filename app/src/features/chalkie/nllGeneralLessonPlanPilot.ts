/**
 * Bounded Stage 4 NLL → NLP → General Lesson Plan pilot.
 * Default-off; BE3 U8 Opener only; lazy General-plan path only.
 * Does not mutate NLL visibility, Stage 3 comparison, POC, canaries, or Chalkie.
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import type { TeacherAddedLanguageInput } from './buildChalkiePromptPreview'
import {
  buildNeutralSbWbLessonPackage,
  type NeutralNllDerivedActivitySummary,
  type NeutralNllDerivedKnowledge,
  type NeutralPriorSupportInput,
  type NeutralSbWbLessonPackage,
  type NeutralSelectedActivityEvidence,
} from './buildNeutralSbWbLessonPackage'
import type { SbActivityCard, SbActivityHandoffSelection } from './chalkieActivitySelection'
import type { WbActivityCard, WbActivityHandoffSelection } from './chalkieWorkbookActivitySelection'
import {
  BE3_U08_OPENER_NLL_COMPONENT_KEY,
  isExactBe3U08OpenerNllCardComparisonScope,
  openerNllCardComparisonScopeKey,
} from './nllCardComparison'
import type { VerifiedSbWbCompanion } from './resolveVerifiedSbWbCompanion'
import type { TeacherChoiceSuggestion } from './teacherChoiceSuggestions'
import {
  loadNeutralLessonComponent,
  type ResolvedNllComponent,
} from '../nll/neutralLessonLibrary'

export const NLL_GENERAL_LESSON_PLAN_PILOT_ENV =
  'VITE_NLL_GENERAL_LESSON_PLAN_PILOT'

export const NLL_GENERAL_LESSON_PLAN_FALLBACK_LINE =
  'NLL enrichment was unavailable; this plan uses the existing verified-evidence path.'

function envFlagEnabled(raw: string | boolean | undefined): boolean {
  if (raw === true) return true
  if (typeof raw !== 'string') return false
  const normalized = raw.trim().toLowerCase()
  return normalized === '1' || normalized === 'true' || normalized === 'yes'
}

export function isNllGeneralLessonPlanPilotEnabled(
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
  return envFlagEnabled(resolved[NLL_GENERAL_LESSON_PLAN_PILOT_ENV])
}

export function isExactBe3U08OpenerNllGeneralLessonPlanScope(input: {
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly companion: VerifiedSbWbCompanion | null
}): boolean {
  return isExactBe3U08OpenerNllCardComparisonScope(input)
}

export function shouldRunNllGeneralLessonPlanPilot(input: {
  readonly flagEnabled: boolean
  readonly exactScopeEligible: boolean
  readonly generalLessonPlanRequested: boolean
}): boolean {
  return (
    input.flagEnabled &&
    input.exactScopeEligible &&
    input.generalLessonPlanRequested
  )
}

/** Same Opener identity key used by Stage 3 comparison; Stage 4 reuses for invalidation only. */
export function openerNllGeneralLessonPlanScopeKey(input: {
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly companion: VerifiedSbWbCompanion | null
}): string {
  return openerNllCardComparisonScopeKey(input)
}

export type NllGeneralLessonPlanPreparedOutputKind =
  | 'chalkie'
  | 'lesson_plan'
  | null

/**
 * Apply an in-flight Stage 4 result only when the General request is still current.
 * Scope-key and prepared-output checks prevent stale apply after lesson change,
 * Chalkie supersession, or backing out of the General preview.
 */
export function shouldApplyNllGeneralLessonPlanPilotResult(input: {
  readonly requestId: number
  readonly latestRequestId: number
  readonly overlayOpen: boolean
  readonly requestScopeKey: string
  readonly currentScopeKey: string
  readonly preparedOutputKind: NllGeneralLessonPlanPreparedOutputKind
}): boolean {
  return (
    input.overlayOpen &&
    input.requestId === input.latestRequestId &&
    input.requestScopeKey === input.currentScopeKey &&
    input.preparedOutputKind === 'lesson_plan'
  )
}

/** Bump the local request generation so in-flight Stage 4 work cannot apply. */
export function invalidateNllGeneralLessonPlanPilotRequest(input: {
  readonly requestIdRef: { current: number }
}): void {
  input.requestIdRef.current += 1
}

/**
 * Bounded Stage 4 prior-support mapper (Opener NLP semantics).
 * Kept local so the durable Stage 4 path does not depend on the experimental canary module.
 */
export function mapTeacherInputsToOpenerPriorSupportForGeneralLessonPlan(input: {
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

export function canonicalActivityIdFromNeutralEvidence(
  activity: NeutralSelectedActivityEvidence,
): string | null {
  const fromReferences = activity.references[0]?.activityId?.trim()
  if (fromReferences) return fromReferences
  const cardId = activity.cardId.trim()
  for (const prefix of ['sb-activity:', 'wb-activity:'] as const) {
    if (cardId.startsWith(prefix)) {
      const id = cardId.slice(prefix.length).trim()
      return id.length > 0 ? id : null
    }
  }
  return null
}

export function orderedSelectedActivityIdsFromNeutralPackage(
  nlp: NeutralSbWbLessonPackage,
): readonly string[] {
  const ids: string[] = []
  for (const activity of nlp.lesson1.selectedActivities) {
    const id = canonicalActivityIdFromNeutralEvidence(activity)
    if (id) ids.push(id)
  }
  for (const activity of nlp.lesson2.selectedActivities) {
    const id = canonicalActivityIdFromNeutralEvidence(activity)
    if (id) ids.push(id)
  }
  return ids
}

function mapPreferredSummary(
  activityId: string,
  resolved: ResolvedNllComponent,
): NeutralNllDerivedActivitySummary | null {
  const membership = resolved.activities.find(
    (entry) => entry.activityId === activityId,
  )
  const summary = membership?.preferredSummary
  if (!summary) return null
  return {
    activityId,
    summaryId: summary.id,
    version: summary.version,
    summaryText: summary.summary_text,
    evidenceStatus: summary.evidence_status,
    displayStatus: summary.display_status,
    reviewState: summary.review_state,
    provenance: summary.provenance,
    canonicalPath: summary.canonical_path,
    canonicalSha256: summary.canonical_sha256,
    activitySha256: summary.activity_sha256,
    createdAt: summary.created_at,
    staleness: summary.staleness,
    currentActivitySha256: summary.currentActivitySha256,
  }
}

export function attachSelectedNllDerivedKnowledge(input: {
  readonly nlp: NeutralSbWbLessonPackage
  readonly resolved: ResolvedNllComponent
}): NeutralSbWbLessonPackage {
  const orderedIds = orderedSelectedActivityIdsFromNeutralPackage(input.nlp)
  const activitySummaries: NeutralNllDerivedActivitySummary[] = []
  for (const activityId of orderedIds) {
    const mapped = mapPreferredSummary(activityId, input.resolved)
    if (mapped) activitySummaries.push(mapped)
  }
  const derivedKnowledge: NeutralNllDerivedKnowledge = {
    source: 'nll',
    componentKey: input.resolved.component.component_key,
    componentId: input.resolved.component.id,
    activitySummaries,
  }
  return {
    ...input.nlp,
    derivedKnowledge,
  }
}

export type NllGeneralLessonPlanPilotLoadNll = (
  client: SupabaseClient | null,
  componentKey: string,
  options: { readonly includeHiddenExperimental: true },
) => Promise<ResolvedNllComponent | null>

export type NllGeneralLessonPlanPilotSuccess = {
  readonly ok: true
  readonly nlp: NeutralSbWbLessonPackage
}

export type NllGeneralLessonPlanPilotFallback = {
  readonly ok: false
  readonly reason:
    | 'flag_off'
    | 'ineligible_scope'
    | 'missing_client'
    | 'missing_component'
    | 'load_error'
    | 'package_error'
  readonly message: string
}

export type NllGeneralLessonPlanPilotResult =
  | NllGeneralLessonPlanPilotSuccess
  | NllGeneralLessonPlanPilotFallback

export type AssembleNllGeneralLessonPlanPilotInput = {
  readonly flagEnabled?: boolean
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly companion: VerifiedSbWbCompanion | null
  readonly sbSelection: SbActivityHandoffSelection
  readonly wbSelection: WbActivityHandoffSelection
  readonly selectedSuggestions?: readonly TeacherChoiceSuggestion[]
  readonly teacherAdditions?: readonly TeacherAddedLanguageInput[]
  readonly client: SupabaseClient | null
  readonly loadNll?: NllGeneralLessonPlanPilotLoadNll
  readonly buildNeutralPackage?: typeof buildNeutralSbWbLessonPackage
  readonly env?: { readonly [key: string]: string | boolean | undefined } | null
}

const defaultLoadNll: NllGeneralLessonPlanPilotLoadNll = async (
  client,
  componentKey,
  options,
) => {
  if (!client) return null
  return loadNeutralLessonComponent(client, componentKey, options)
}

/**
 * Lazy Stage 4 assembler: load Opener NLL (hidden experimental allowed),
 * build base NLP, attach selected derived summaries. Never throws to UI.
 */
export async function assembleNllGeneralLessonPlanPilot(
  input: AssembleNllGeneralLessonPlanPilotInput,
): Promise<NllGeneralLessonPlanPilotResult> {
  const flagEnabled =
    input.flagEnabled ?? isNllGeneralLessonPlanPilotEnabled(input.env)
  if (!flagEnabled) {
    return {
      ok: false,
      reason: 'flag_off',
      message: 'Stage 4 General Lesson Plan pilot flag is off.',
    }
  }

  const exactScope = isExactBe3U08OpenerNllGeneralLessonPlanScope({
    activityCards: input.activityCards,
    workbookActivityCards: input.workbookActivityCards,
    companion: input.companion,
  })
  if (!exactScope || !input.companion) {
    return {
      ok: false,
      reason: 'ineligible_scope',
      message: 'Exact BE3 Unit 8 Opener scope is required for the Stage 4 pilot.',
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
  const buildNeutral = input.buildNeutralPackage ?? buildNeutralSbWbLessonPackage

  let resolved: ResolvedNllComponent | null
  try {
    resolved = await loadNll(input.client, BE3_U08_OPENER_NLL_COMPONENT_KEY, {
      includeHiddenExperimental: true,
    })
  } catch (error) {
    return {
      ok: false,
      reason: 'load_error',
      message:
        error instanceof Error
          ? error.message
          : 'NLL component load failed.',
    }
  }

  if (!resolved) {
    return {
      ok: false,
      reason: 'missing_component',
      message: `NLL component ${BE3_U08_OPENER_NLL_COMPONENT_KEY} was not found.`,
    }
  }

  try {
    const priorSupport = mapTeacherInputsToOpenerPriorSupportForGeneralLessonPlan({
      selectedSuggestions: [...(input.selectedSuggestions ?? [])],
      teacherAdditions: [...(input.teacherAdditions ?? [])],
    })
    // Stage 4 deliberately omits experimental BI inputs.
    // Shared NLP + flag-off GLP retain D022 BI support.
    const base = buildNeutral({
      companion: input.companion,
      sbSelection: input.sbSelection,
      wbSelection: input.wbSelection,
      priorSupport,
    })
    return {
      ok: true,
      nlp: attachSelectedNllDerivedKnowledge({
        nlp: base,
        resolved,
      }),
    }
  } catch (error) {
    return {
      ok: false,
      reason: 'package_error',
      message:
        error instanceof Error
          ? error.message
          : 'Neutral package assembly failed.',
    }
  }
}
