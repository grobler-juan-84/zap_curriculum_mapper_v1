/**
 * Bounded Culture-C NLL -> NLP -> Chalkie adapter pilot.
 * Default-off; BE3 U8 Culture Connection only; lazy Create-a-prompt path only.
 * NLL summaries stay package-only and never become Chalkie prose.
 * Culture remains BI-absent (D022). Does not generalize Opener, Story, LiA, Grammar, or CLIL/P.E.
 *
 * Serving note: resolver default for this relationship remains sb_only.
 * When this flag is on and the teacher chooses a two-lesson series, the overlay
 * may serve the accepted SB→WB five-artifact renderer; flag-off keeps sb_only.
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import type { TeacherAddedLanguageInput } from './buildChalkiePromptPreview'
import { BE3_U08_SB138_139_WB113_114 } from './verifiedSbWbCompanions'
import {
  buildNeutralSbWbLessonPackage,
  type NeutralSbWbLessonPackage,
} from './buildNeutralSbWbLessonPackage'
import { mapTeacherInputsToStoryPriorSupport } from './be3U08StoryNeutralCanary'
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

export const NLL_CHALKIE_CULTURE_ADAPTER_PILOT_ENV =
  'VITE_NLL_CHALKIE_CULTURE_ADAPTER_PILOT'

export const BE3_U08_CULTURE_NLL_COMPONENT_KEY = 'be3-u08-culture'

export const BE3_U08_CULTURE_SERIES_RELATIONSHIP_ID =
  BE3_U08_SB138_139_WB113_114.relationshipId

export const BE3_U08_CULTURE_SERIES_STABLE_REF =
  'be3-sb-wb-u08-p138-139-wb113-114'

export const BE3_U08_CULTURE_SERIES_TITLE =
  'BE3 Unit 08 · SB pp. 138–139 + WB pp. 113–114 — Healthy Living — Culture Connection'

export type Be3U08CultureSeriesHandoff = {
  readonly relationshipId: string
  readonly seriesTitle: string
  readonly stableSeriesReference: string
  readonly detailedHandoff: string
  readonly lesson1Outline: string
  readonly lesson1Vocabulary: string
  readonly lesson2Outline: string
  readonly lesson2Vocabulary: string
}

const CULTURE_SB_PAGES = [138, 139] as const
const CULTURE_WB_PAGES = [113, 114] as const

const CULTURE_SB_ACTIVITY_IDS = [
  'bep3_sb_act_08_24',
  'bep3_sb_act_08_25',
  'bep3_sb_act_08_26',
  'bep3_sb_act_08_27',
] as const

const CULTURE_WB_ACTIVITY_IDS = [
  'bep_3_wb_act_113_20',
  'bep_3_wb_act_113_21',
  'bep_3_wb_act_114_22',
  'bep_3_wb_act_114_23',
  'bep_3_wb_act_114_tb',
] as const

const CULTURE_ALL_ACTIVITY_IDS = [
  ...CULTURE_SB_ACTIVITY_IDS,
  ...CULTURE_WB_ACTIVITY_IDS,
] as const

const CULTURE_SB_ACTIVITY_PAGES: ReadonlyMap<string, number> = new Map([
  ['bep3_sb_act_08_24', 138],
  ['bep3_sb_act_08_25', 138],
  ['bep3_sb_act_08_26', 138],
  ['bep3_sb_act_08_27', 139],
])

const CULTURE_WB_ACTIVITY_PAGES: ReadonlyMap<string, number> = new Map([
  ['bep_3_wb_act_113_20', 113],
  ['bep_3_wb_act_113_21', 113],
  ['bep_3_wb_act_114_22', 114],
  ['bep_3_wb_act_114_23', 114],
  ['bep_3_wb_act_114_tb', 114],
])

const CULTURE_WB_ACTIVITY_PAGE_IDS: ReadonlyMap<string, string> = new Map([
  ['bep_3_wb_act_113_20', 'bep_3_wb_p113'],
  ['bep_3_wb_act_113_21', 'bep_3_wb_p113'],
  ['bep_3_wb_act_114_22', 'bep_3_wb_p114'],
  ['bep_3_wb_act_114_23', 'bep_3_wb_p114'],
  ['bep_3_wb_act_114_tb', 'bep_3_wb_p114'],
])

function isExactExpectedCultureWbCard(card: WbActivityCard): boolean {
  if (card.source !== 'WB' || card.references.length !== 1) return false
  const reference = card.references[0]
  if (!reference) return false

  const activityId = reference.activityId
  const expectedPage = CULTURE_WB_ACTIVITY_PAGES.get(activityId)
  const expectedPageId = CULTURE_WB_ACTIVITY_PAGE_IDS.get(activityId)
  if (expectedPage === undefined || expectedPageId === undefined) return false

  return (
    reference.bookId === 'big_english_3_wb' &&
    reference.unitId === 'big_english_3_wb_unit_08' &&
    reference.pageId === expectedPageId &&
    reference.verificationStatus === 'human_verified' &&
    card.pageId === expectedPageId &&
    card.printedPage === expectedPage &&
    card.evidence.references.length === 1 &&
    card.evidence.references[0]?.activityId === activityId &&
    card.evidence.references[0]?.bookId === 'big_english_3_wb' &&
    card.evidence.references[0]?.unitId === 'big_english_3_wb_unit_08' &&
    card.evidence.references[0]?.pageId === expectedPageId &&
    card.evidence.references[0]?.verificationStatus === 'human_verified' &&
    card.evidence.pageId === expectedPageId &&
    card.evidence.printedPage === expectedPage &&
    card.evidence.source === 'WB'
  )
}

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

export function isNllCultureChalkieAdapterPilotEnabled(
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
  return envFlagEnabled(resolved[NLL_CHALKIE_CULTURE_ADAPTER_PILOT_ENV])
}

export function isExactBe3U08CultureNllChalkieAdapterScope(input: {
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly companion: VerifiedSbWbCompanion | null
}): boolean {
  const companion = input.companion
  if (
    !companion ||
    companion.relationshipId !== BE3_U08_CULTURE_SERIES_RELATIONSHIP_ID ||
    companion.studentBookCatalogId !== 'big_english_3_sb' ||
    companion.workbookCatalogId !== 'big_english_3_wb' ||
    !pagesMatchExact(companion.studentBookPrintedPages, CULTURE_SB_PAGES) ||
    !pagesMatchExact(companion.workbookPrintedPages, CULTURE_WB_PAGES)
  ) {
    return false
  }

  if (input.activityCards.length !== CULTURE_SB_ACTIVITY_IDS.length) {
    return false
  }
  if (input.workbookActivityCards.length !== CULTURE_WB_ACTIVITY_IDS.length) {
    return false
  }

  const seenSb = new Set<string>()
  for (const card of input.activityCards) {
    const activityId = card.references.activityId
    const expectedPage = CULTURE_SB_ACTIVITY_PAGES.get(activityId)
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
  if (!CULTURE_SB_ACTIVITY_IDS.every((id) => seenSb.has(id))) return false

  const seenWb = new Set<string>()
  for (const card of input.workbookActivityCards) {
    const activityId = card.references[0]?.activityId
    if (
      !activityId ||
      seenWb.has(activityId) ||
      !isExactExpectedCultureWbCard(card)
    ) {
      return false
    }
    seenWb.add(activityId)
  }
  return CULTURE_WB_ACTIVITY_IDS.every((id) => seenWb.has(id))
}

/**
 * Culture series gate does not require resolver sb_wb packaging.
 * Flag-off overlay continues to use the current sb_only path.
 */
export function shouldRunNllCultureChalkieAdapterPilot(input: {
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

export type NllCultureChalkieAdapterPreparedOutputKind =
  | 'chalkie'
  | 'lesson_plan'
  | null

export function cultureNllChalkieAdapterScopeKey(input: {
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

export function nllCultureChalkieAdapterRequestKey(input: {
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly companion: VerifiedSbWbCompanion | null
  readonly sbSelection: SbActivityHandoffSelection
  readonly wbSelection: WbActivityHandoffSelection
  readonly selectedSuggestions: readonly TeacherChoiceSuggestion[]
  readonly teacherAdditions: readonly TeacherAddedLanguageInput[]
}): string {
  const scopeKey = cultureNllChalkieAdapterScopeKey(input)
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
  return JSON.stringify([scopeKey, sbIds, wbIds, prior, additions, 'chalkie'])
}

export function shouldApplyNllCultureChalkieAdapterPilotResult(input: {
  readonly requestId: number
  readonly latestRequestId: number
  readonly overlayOpen: boolean
  readonly requestKey: string
  readonly currentRequestKey: string
  readonly preparedOutputKind: NllCultureChalkieAdapterPreparedOutputKind
}): boolean {
  return (
    input.overlayOpen &&
    input.requestId === input.latestRequestId &&
    input.requestKey === input.currentRequestKey &&
    input.preparedOutputKind === 'chalkie'
  )
}

export function invalidateNllCultureChalkieAdapterPilotRequest(input: {
  readonly requestIdRef: { current: number }
}): void {
  input.requestIdRef.current += 1
}

export type NllCultureChalkieAdapterPilotLoadNll = (
  client: SupabaseClient | null,
  componentKey: string,
  options: { readonly includeHiddenExperimental: true },
) => Promise<ResolvedNllComponent | null>

export type NllCultureChalkieAdapterPilotSuccess = {
  readonly ok: true
  readonly nlp: NeutralSbWbLessonPackage
  readonly handoff: Be3U08CultureSeriesHandoff
}

export type NllCultureChalkieAdapterPilotFallback = {
  readonly ok: false
  readonly reason:
    | 'flag_off'
    | 'ineligible_scope'
    | 'missing_client'
    | 'missing_component'
    | 'incomplete_component'
    | 'load_error'
    | 'package_error'
    | 'renderer_error'
  readonly message: string
}

export type NllCultureChalkieAdapterPilotResult =
  | NllCultureChalkieAdapterPilotSuccess
  | NllCultureChalkieAdapterPilotFallback

export type AssembleNllCultureChalkieAdapterPilotInput = {
  readonly flagEnabled?: boolean
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly companion: VerifiedSbWbCompanion | null
  readonly sbSelection: SbActivityHandoffSelection
  readonly wbSelection: WbActivityHandoffSelection
  readonly selectedSuggestions?: readonly TeacherChoiceSuggestion[]
  readonly teacherAdditions?: readonly TeacherAddedLanguageInput[]
  readonly client: SupabaseClient | null
  readonly loadNll?: NllCultureChalkieAdapterPilotLoadNll
  readonly buildNeutralPackage?: typeof buildNeutralSbWbLessonPackage
  readonly renderNeutral?: typeof renderChalkieFromNeutralPackage
  readonly env?: { readonly [key: string]: string | boolean | undefined } | null
}

const defaultLoadNll: NllCultureChalkieAdapterPilotLoadNll = async (
  client,
  componentKey,
  options,
) => {
  if (!client) return null
  return loadNeutralLessonComponent(client, componentKey, options)
}

function toCultureHandoff(
  rendered: ChalkieNeutralPackageRenderOutput,
): Be3U08CultureSeriesHandoff {
  return {
    relationshipId: BE3_U08_CULTURE_SERIES_RELATIONSHIP_ID,
    seriesTitle: BE3_U08_CULTURE_SERIES_TITLE,
    stableSeriesReference: BE3_U08_CULTURE_SERIES_STABLE_REF,
    ...rendered,
  }
}

function isCompleteExpectedCultureNllComponent(
  resolved: ResolvedNllComponent,
): boolean {
  if (resolved.component.component_key !== BE3_U08_CULTURE_NLL_COMPONENT_KEY) {
    return false
  }

  const activities = resolved.activities
  if (activities.length !== CULTURE_ALL_ACTIVITY_IDS.length) return false

  const seenIds = new Set<string>()
  for (const activity of activities) {
    if (
      !activity.activityId ||
      seenIds.has(activity.activityId) ||
      activity.position == null ||
      activity.preferredSummary == null
    ) {
      return false
    }
    seenIds.add(activity.activityId)
  }
  if (seenIds.size !== CULTURE_ALL_ACTIVITY_IDS.length) return false

  return CULTURE_ALL_ACTIVITY_IDS.every((activityId, index) => {
    const expectedPosition = index + 1
    const membership = activities.find(
      (activity) => activity.activityId === activityId,
    )
    return (
      membership != null &&
      membership.position === expectedPosition &&
      membership.preferredSummary != null
    )
  })
}

/**
 * Lazy Culture-C assembler: load Culture NLL, assemble the exact selected NLP,
 * attach selected summaries, then render the five accepted Culture artifacts.
 * Never throws to the UI; callers retain the current sb_only fallback.
 * Does not accept or attach Book Intelligence.
 */
export async function assembleNllCultureChalkieAdapterPilot(
  input: AssembleNllCultureChalkieAdapterPilotInput,
): Promise<NllCultureChalkieAdapterPilotResult> {
  const flagEnabled =
    input.flagEnabled ?? isNllCultureChalkieAdapterPilotEnabled(input.env)
  if (!flagEnabled) {
    return {
      ok: false,
      reason: 'flag_off',
      message: 'Culture-C Chalkie adapter pilot flag is off.',
    }
  }

  const exactScope = isExactBe3U08CultureNllChalkieAdapterScope({
    activityCards: input.activityCards,
    workbookActivityCards: input.workbookActivityCards,
    companion: input.companion,
  })
  if (!exactScope || !input.companion) {
    return {
      ok: false,
      reason: 'ineligible_scope',
      message:
        'Exact BE3 Unit 8 Culture Connection scope is required for the Culture-C pilot.',
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
      BE3_U08_CULTURE_NLL_COMPONENT_KEY,
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
      message: `NLL component ${BE3_U08_CULTURE_NLL_COMPONENT_KEY} was not found.`,
    }
  }

  if (!isCompleteExpectedCultureNllComponent(resolved)) {
    return {
      ok: false,
      reason: 'incomplete_component',
      message: `NLL component ${BE3_U08_CULTURE_NLL_COMPONENT_KEY} is incomplete or invalid for Culture-C.`,
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
      // Culture remains BI-absent: do not pass bookIntelligenceUnit / biArtifactRef.
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
      handoff: toCultureHandoff(renderNeutral(nlp)),
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
