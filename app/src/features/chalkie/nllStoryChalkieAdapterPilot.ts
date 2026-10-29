/**
 * Bounded Stage 6B NLL -> NLP -> Chalkie Story adapter pilot.
 * Default-off; BE3 U8 Story only; lazy Chalkie series path only.
 * NLL summaries stay package-only and never become Chalkie prose.
 * Story remains BI-absent (D022). Does not generalize the Stage 5 Opener module.
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import type { TeacherAddedLanguageInput } from './buildChalkiePromptPreview'
import {
  BE3_U08_STORY_SERIES_RELATIONSHIP_ID,
  BE3_U08_STORY_SERIES_STABLE_REF,
  BE3_U08_STORY_SERIES_TITLE,
  type Be3U08StorySeriesHandoff,
} from './buildBe3U08StorySbWbSeriesHandoff'
import {
  buildNeutralSbWbLessonPackage,
  type NeutralSbWbLessonPackage,
} from './buildNeutralSbWbLessonPackage'
import {
  mapTeacherInputsToStoryPriorSupport,
} from './be3U08StoryNeutralCanary'
import type {
  SbActivityCard,
  SbActivityHandoffSelection,
} from './chalkieActivitySelection'
import type {
  WbActivityCard,
  WbActivityHandoffSelection,
} from './chalkieWorkbookActivitySelection'
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

export const NLL_CHALKIE_STORY_ADAPTER_PILOT_ENV =
  'VITE_NLL_CHALKIE_STORY_ADAPTER_PILOT'

export const BE3_U08_STORY_NLL_COMPONENT_KEY = 'be3-u08-story'

const STORY_SB_PAGES = [130, 131] as const
const STORY_WB_PAGES = [106] as const

const STORY_SB_ACTIVITY_IDS = [
  'bep3_sb_act_08_06',
  'bep3_sb_act_08_07',
] as const

const STORY_WB_ACTIVITY_IDS = [
  'bep_3_wb_act_106_5',
  'bep_3_wb_act_106_6',
  'bep_3_wb_act_106_tb',
] as const

const STORY_SB_ACTIVITY_PAGES: ReadonlyMap<string, number> = new Map([
  ['bep3_sb_act_08_06', 130],
  ['bep3_sb_act_08_07', 131],
])

const STORY_WB_ACTIVITY_PAGES: ReadonlyMap<string, number> = new Map([
  ['bep_3_wb_act_106_5', 106],
  ['bep_3_wb_act_106_6', 106],
  ['bep_3_wb_act_106_tb', 106],
])

function envFlagEnabled(raw: string | boolean | undefined): boolean {
  if (raw === true) return true
  if (typeof raw !== 'string') return false
  const normalized = raw.trim().toLowerCase()
  return normalized === '1' || normalized === 'true' || normalized === 'yes'
}

function pagesMatchExact(
  actual: readonly number[] | null | undefined,
  expected: readonly number[],
): boolean {
  if (!actual || actual.length !== expected.length) return false
  const sortedActual = [...actual].sort((a, b) => a - b)
  const sortedExpected = [...expected].sort((a, b) => a - b)
  return sortedExpected.every((page, index) => sortedActual[index] === page)
}

export function isNllStoryChalkieAdapterPilotEnabled(
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
  return envFlagEnabled(resolved[NLL_CHALKIE_STORY_ADAPTER_PILOT_ENV])
}

export function isExactBe3U08StoryNllChalkieAdapterScope(input: {
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly companion: VerifiedSbWbCompanion | null
}): boolean {
  const companion = input.companion
  if (
    !companion ||
    companion.relationshipId !== BE3_U08_STORY_SERIES_RELATIONSHIP_ID ||
    companion.studentBookCatalogId !== 'big_english_3_sb' ||
    companion.workbookCatalogId !== 'big_english_3_wb' ||
    !pagesMatchExact(companion.studentBookPrintedPages, STORY_SB_PAGES) ||
    !pagesMatchExact(companion.workbookPrintedPages, STORY_WB_PAGES)
  ) {
    return false
  }

  if (input.activityCards.length !== STORY_SB_ACTIVITY_IDS.length) return false
  if (input.workbookActivityCards.length !== STORY_WB_ACTIVITY_IDS.length) {
    return false
  }

  const seenSb = new Set<string>()
  for (const card of input.activityCards) {
    const activityId = card.references.activityId
    const expectedPage = STORY_SB_ACTIVITY_PAGES.get(activityId)
    if (
      expectedPage === undefined ||
      seenSb.has(activityId) ||
      card.references.bookId !== 'big_english_3_sb' ||
      card.references.unitId !== 'big_english_3_sb_unit_08' ||
      card.references.verificationStatus !== 'human_verified' ||
      card.printedPage !== expectedPage
    ) {
      return false
    }
    seenSb.add(activityId)
  }
  if (!STORY_SB_ACTIVITY_IDS.every((id) => seenSb.has(id))) return false

  const seenWb = new Set<string>()
  for (const card of input.workbookActivityCards) {
    const activityId = card.references[0]?.activityId
    const expectedPage = activityId
      ? STORY_WB_ACTIVITY_PAGES.get(activityId)
      : undefined
    if (
      !activityId ||
      expectedPage === undefined ||
      seenWb.has(activityId) ||
      card.source !== 'WB' ||
      card.references[0]?.verificationStatus !== 'human_verified' ||
      card.printedPage !== expectedPage
    ) {
      return false
    }
    seenWb.add(activityId)
  }
  return STORY_WB_ACTIVITY_IDS.every((id) => seenWb.has(id))
}

export function shouldRunNllStoryChalkieAdapterPilot(input: {
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

export type NllStoryChalkieAdapterPreparedOutputKind =
  | 'chalkie'
  | 'lesson_plan'
  | null

export function storyNllChalkieAdapterScopeKey(input: {
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly companion: VerifiedSbWbCompanion | null
}): string {
  const sbIds = input.activityCards
    .map((card) => card.references.activityId)
    .sort()
    .join(',')
  const wbIds = input.workbookActivityCards
    .map((card) => card.references[0]?.activityId ?? '')
    .sort()
    .join(',')
  return [input.companion?.relationshipId ?? '', sbIds, wbIds].join('|')
}

export function nllStoryChalkieAdapterRequestKey(input: {
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly companion: VerifiedSbWbCompanion | null
  readonly sbSelection: SbActivityHandoffSelection
  readonly wbSelection: WbActivityHandoffSelection
  readonly selectedSuggestions: readonly TeacherChoiceSuggestion[]
  readonly teacherAdditions: readonly TeacherAddedLanguageInput[]
}): string {
  const scopeKey = storyNllChalkieAdapterScopeKey(input)
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

export function shouldApplyNllStoryChalkieAdapterPilotResult(input: {
  readonly requestId: number
  readonly latestRequestId: number
  readonly overlayOpen: boolean
  readonly requestKey: string
  readonly currentRequestKey: string
  readonly preparedOutputKind: NllStoryChalkieAdapterPreparedOutputKind
}): boolean {
  return (
    input.overlayOpen &&
    input.requestId === input.latestRequestId &&
    input.requestKey === input.currentRequestKey &&
    input.preparedOutputKind === 'chalkie'
  )
}

export function invalidateNllStoryChalkieAdapterPilotRequest(input: {
  readonly requestIdRef: { current: number }
}): void {
  input.requestIdRef.current += 1
}

export type NllStoryChalkieAdapterPilotLoadNll = (
  client: SupabaseClient | null,
  componentKey: string,
  options: { readonly includeHiddenExperimental: true },
) => Promise<ResolvedNllComponent | null>

export type NllStoryChalkieAdapterPilotSuccess = {
  readonly ok: true
  readonly nlp: NeutralSbWbLessonPackage
  readonly handoff: Be3U08StorySeriesHandoff
}

export type NllStoryChalkieAdapterPilotFallback = {
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

export type NllStoryChalkieAdapterPilotResult =
  | NllStoryChalkieAdapterPilotSuccess
  | NllStoryChalkieAdapterPilotFallback

export type AssembleNllStoryChalkieAdapterPilotInput = {
  readonly flagEnabled?: boolean
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly companion: VerifiedSbWbCompanion | null
  readonly sbSelection: SbActivityHandoffSelection
  readonly wbSelection: WbActivityHandoffSelection
  readonly selectedSuggestions?: readonly TeacherChoiceSuggestion[]
  readonly teacherAdditions?: readonly TeacherAddedLanguageInput[]
  readonly client: SupabaseClient | null
  readonly loadNll?: NllStoryChalkieAdapterPilotLoadNll
  readonly buildNeutralPackage?: typeof buildNeutralSbWbLessonPackage
  readonly renderNeutral?: typeof renderChalkieFromNeutralPackage
  readonly env?: { readonly [key: string]: string | boolean | undefined } | null
}

const defaultLoadNll: NllStoryChalkieAdapterPilotLoadNll = async (
  client,
  componentKey,
  options,
) => {
  if (!client) return null
  return loadNeutralLessonComponent(client, componentKey, options)
}

function toStoryHandoff(
  rendered: ChalkieNeutralPackageRenderOutput,
): Be3U08StorySeriesHandoff {
  return {
    relationshipId: BE3_U08_STORY_SERIES_RELATIONSHIP_ID,
    seriesTitle: BE3_U08_STORY_SERIES_TITLE,
    stableSeriesReference: BE3_U08_STORY_SERIES_STABLE_REF,
    ...rendered,
  }
}

/**
 * Lazy Stage 6B assembler: load Story NLL, assemble the exact selected NLP,
 * attach selected summaries, then render the five existing Story artifacts.
 * Never throws to the UI; callers retain the current Story canary/bespoke fallback.
 * Does not accept or attach Book Intelligence.
 */
export async function assembleNllStoryChalkieAdapterPilot(
  input: AssembleNllStoryChalkieAdapterPilotInput,
): Promise<NllStoryChalkieAdapterPilotResult> {
  const flagEnabled =
    input.flagEnabled ?? isNllStoryChalkieAdapterPilotEnabled(input.env)
  if (!flagEnabled) {
    return {
      ok: false,
      reason: 'flag_off',
      message: 'Stage 6B Story Chalkie adapter pilot flag is off.',
    }
  }

  const exactScope = isExactBe3U08StoryNllChalkieAdapterScope({
    activityCards: input.activityCards,
    workbookActivityCards: input.workbookActivityCards,
    companion: input.companion,
  })
  if (!exactScope || !input.companion) {
    return {
      ok: false,
      reason: 'ineligible_scope',
      message:
        'Exact BE3 Unit 8 Story scope is required for the Stage 6B pilot.',
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
      BE3_U08_STORY_NLL_COMPONENT_KEY,
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
      message: `NLL component ${BE3_U08_STORY_NLL_COMPONENT_KEY} was not found.`,
    }
  }

  const buildNeutral = input.buildNeutralPackage ?? buildNeutralSbWbLessonPackage
  let nlp: NeutralSbWbLessonPackage
  try {
    const base = buildNeutral({
      companion: input.companion,
      sbSelection: input.sbSelection,
      wbSelection: input.wbSelection,
      priorSupport: mapTeacherInputsToStoryPriorSupport({
        selectedSuggestions: [...(input.selectedSuggestions ?? [])],
        teacherAdditions: [...(input.teacherAdditions ?? [])],
      }),
      // Story remains BI-absent: do not pass bookIntelligenceUnit / biArtifactRef.
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
      handoff: toStoryHandoff(renderNeutral(nlp)),
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
