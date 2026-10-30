/**
 * Bounded Phonics-C NLL -> NLP -> Chalkie adapter pilot.
 * Default-off; BE3 U8 Phonics only; lazy Create-a-prompt path only.
 * NLL summaries stay package-only and never become Chalkie prose.
 * Phonics remains BI-absent (D022). Independent of every other component adapter.
 *
 * Serving note: resolver default for this relationship remains sb_only.
 * When this flag is on and the teacher chooses a two-lesson series, the overlay
 * may serve the accepted SB→WB five-artifact renderer; flag-off keeps sb_only.
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import type { TeacherAddedLanguageInput } from './buildChalkiePromptPreview'
import { BE3_U08_SB141_WB116 } from './verifiedSbWbCompanions'
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

export const NLL_CHALKIE_PHONICS_ADAPTER_PILOT_ENV =
  'VITE_NLL_CHALKIE_PHONICS_ADAPTER_PILOT'

export const BE3_U08_PHONICS_NLL_COMPONENT_KEY = 'be3-u08-phonics'

export const BE3_U08_PHONICS_SERIES_RELATIONSHIP_ID =
  BE3_U08_SB141_WB116.relationshipId

export const BE3_U08_PHONICS_SERIES_STABLE_REF =
  'be3-sb-wb-u08-p141-wb116'

export const BE3_U08_PHONICS_SERIES_TITLE =
  'BE3 Unit 08 · SB p. 141 + WB p. 116 — Healthy Living — Phonics'

export type Be3U08PhonicsSeriesHandoff = {
  readonly relationshipId: string
  readonly seriesTitle: string
  readonly stableSeriesReference: string
  readonly detailedHandoff: string
  readonly lesson1Outline: string
  readonly lesson1Vocabulary: string
  readonly lesson2Outline: string
  readonly lesson2Vocabulary: string
}

const PHONICS_SB_PAGES = [141] as const
const PHONICS_WB_PAGES = [116] as const

const PHONICS_SB_ACTIVITY_IDS = [
  'bep3_sb_act_08_32',
  'bep3_sb_act_08_33',
  'bep3_sb_act_08_34',
  'bep3_sb_act_08_35',
] as const

const PHONICS_WB_ACTIVITY_IDS = [
  'bep_3_wb_act_116_27',
  'bep_3_wb_act_116_28',
  'bep_3_wb_act_116_29',
  'bep_3_wb_act_116_30',
] as const

const PHONICS_ALL_ACTIVITY_IDS = [
  ...PHONICS_SB_ACTIVITY_IDS,
  ...PHONICS_WB_ACTIVITY_IDS,
] as const

const PHONICS_SB_ACTIVITY_PAGES: ReadonlyMap<string, number> = new Map([
  ['bep3_sb_act_08_32', 141],
  ['bep3_sb_act_08_33', 141],
  ['bep3_sb_act_08_34', 141],
  ['bep3_sb_act_08_35', 141],
])

const PHONICS_WB_ACTIVITY_PAGES: ReadonlyMap<string, number> = new Map([
  ['bep_3_wb_act_116_27', 116],
  ['bep_3_wb_act_116_28', 116],
  ['bep_3_wb_act_116_29', 116],
  ['bep_3_wb_act_116_30', 116],
])

const PHONICS_WB_ACTIVITY_PAGE_IDS: ReadonlyMap<string, string> = new Map([
  ['bep_3_wb_act_116_27', 'bep_3_wb_p116'],
  ['bep_3_wb_act_116_28', 'bep_3_wb_p116'],
  ['bep_3_wb_act_116_29', 'bep_3_wb_p116'],
  ['bep_3_wb_act_116_30', 'bep_3_wb_p116'],
])

function isExactExpectedPhonicsWbCard(card: WbActivityCard): boolean {
  if (card.source !== 'WB' || card.references.length !== 1) return false
  const reference = card.references[0]
  if (!reference) return false

  const activityId = reference.activityId
  const expectedPage = PHONICS_WB_ACTIVITY_PAGES.get(activityId)
  const expectedPageId = PHONICS_WB_ACTIVITY_PAGE_IDS.get(activityId)
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

export function isNllPhonicsChalkieAdapterPilotEnabled(
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
  return envFlagEnabled(resolved[NLL_CHALKIE_PHONICS_ADAPTER_PILOT_ENV])
}

export function isExactBe3U08PhonicsNllChalkieAdapterScope(input: {
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly companion: VerifiedSbWbCompanion | null
}): boolean {
  const companion = input.companion
  if (
    !companion ||
    companion.relationshipId !== BE3_U08_PHONICS_SERIES_RELATIONSHIP_ID ||
    companion.studentBookCatalogId !== 'big_english_3_sb' ||
    companion.workbookCatalogId !== 'big_english_3_wb' ||
    !pagesMatchExact(companion.studentBookPrintedPages, PHONICS_SB_PAGES) ||
    !pagesMatchExact(companion.workbookPrintedPages, PHONICS_WB_PAGES)
  ) {
    return false
  }

  if (input.activityCards.length !== PHONICS_SB_ACTIVITY_IDS.length) {
    return false
  }
  if (input.workbookActivityCards.length !== PHONICS_WB_ACTIVITY_IDS.length) {
    return false
  }

  const seenSb = new Set<string>()
  for (const card of input.activityCards) {
    const activityId = card.references.activityId
    const expectedPage = PHONICS_SB_ACTIVITY_PAGES.get(activityId)
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
  if (!PHONICS_SB_ACTIVITY_IDS.every((id) => seenSb.has(id))) return false

  const seenWb = new Set<string>()
  for (const card of input.workbookActivityCards) {
    const activityId = card.references[0]?.activityId
    if (
      !activityId ||
      seenWb.has(activityId) ||
      !isExactExpectedPhonicsWbCard(card)
    ) {
      return false
    }
    seenWb.add(activityId)
  }
  return PHONICS_WB_ACTIVITY_IDS.every((id) => seenWb.has(id))
}

export function shouldRunNllPhonicsChalkieAdapterPilot(input: {
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

export type NllPhonicsChalkieAdapterPreparedOutputKind =
  | 'chalkie'
  | 'lesson_plan'
  | null

export function phonicsNllChalkieAdapterScopeKey(input: {
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

export function nllPhonicsChalkieAdapterRequestKey(input: {
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly companion: VerifiedSbWbCompanion | null
  readonly sbSelection: SbActivityHandoffSelection
  readonly wbSelection: WbActivityHandoffSelection
  readonly selectedSuggestions: readonly TeacherChoiceSuggestion[]
  readonly teacherAdditions: readonly TeacherAddedLanguageInput[]
}): string {
  const scopeKey = phonicsNllChalkieAdapterScopeKey(input)
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

export function shouldApplyNllPhonicsChalkieAdapterPilotResult(input: {
  readonly requestId: number
  readonly latestRequestId: number
  readonly overlayOpen: boolean
  readonly requestKey: string
  readonly currentRequestKey: string
  readonly preparedOutputKind: NllPhonicsChalkieAdapterPreparedOutputKind
}): boolean {
  return (
    input.overlayOpen &&
    input.requestId === input.latestRequestId &&
    input.requestKey === input.currentRequestKey &&
    input.preparedOutputKind === 'chalkie'
  )
}

export function invalidateNllPhonicsChalkieAdapterPilotRequest(input: {
  readonly requestIdRef: { current: number }
}): void {
  input.requestIdRef.current += 1
}

export type NllPhonicsChalkieAdapterPilotLoadNll = (
  client: SupabaseClient | null,
  componentKey: string,
  options: { readonly includeHiddenExperimental: true },
) => Promise<ResolvedNllComponent | null>

export type NllPhonicsChalkieAdapterPilotSuccess = {
  readonly ok: true
  readonly nlp: NeutralSbWbLessonPackage
  readonly handoff: Be3U08PhonicsSeriesHandoff
}

export type NllPhonicsChalkieAdapterPilotFallback = {
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

export type NllPhonicsChalkieAdapterPilotResult =
  | NllPhonicsChalkieAdapterPilotSuccess
  | NllPhonicsChalkieAdapterPilotFallback

export type AssembleNllPhonicsChalkieAdapterPilotInput = {
  readonly flagEnabled?: boolean
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly companion: VerifiedSbWbCompanion | null
  readonly sbSelection: SbActivityHandoffSelection
  readonly wbSelection: WbActivityHandoffSelection
  readonly selectedSuggestions?: readonly TeacherChoiceSuggestion[]
  readonly teacherAdditions?: readonly TeacherAddedLanguageInput[]
  readonly client: SupabaseClient | null
  readonly loadNll?: NllPhonicsChalkieAdapterPilotLoadNll
  readonly buildNeutralPackage?: typeof buildNeutralSbWbLessonPackage
  readonly renderNeutral?: typeof renderChalkieFromNeutralPackage
  readonly env?: { readonly [key: string]: string | boolean | undefined } | null
}

const defaultLoadNll: NllPhonicsChalkieAdapterPilotLoadNll = async (
  client,
  componentKey,
  options,
) => {
  if (!client) return null
  return loadNeutralLessonComponent(client, componentKey, options)
}

function toPhonicsHandoff(
  rendered: ChalkieNeutralPackageRenderOutput,
): Be3U08PhonicsSeriesHandoff {
  return {
    relationshipId: BE3_U08_PHONICS_SERIES_RELATIONSHIP_ID,
    seriesTitle: BE3_U08_PHONICS_SERIES_TITLE,
    stableSeriesReference: BE3_U08_PHONICS_SERIES_STABLE_REF,
    ...rendered,
  }
}

function isCompleteExpectedPhonicsNllComponent(
  resolved: ResolvedNllComponent,
): boolean {
  if (resolved.component.component_key !== BE3_U08_PHONICS_NLL_COMPONENT_KEY) {
    return false
  }

  const activities = resolved.activities
  if (activities.length !== PHONICS_ALL_ACTIVITY_IDS.length) return false

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
  if (seenIds.size !== PHONICS_ALL_ACTIVITY_IDS.length) return false

  return PHONICS_ALL_ACTIVITY_IDS.every((activityId, index) => {
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

export async function assembleNllPhonicsChalkieAdapterPilot(
  input: AssembleNllPhonicsChalkieAdapterPilotInput,
): Promise<NllPhonicsChalkieAdapterPilotResult> {
  const flagEnabled =
    input.flagEnabled ?? isNllPhonicsChalkieAdapterPilotEnabled(input.env)
  if (!flagEnabled) {
    return {
      ok: false,
      reason: 'flag_off',
      message: 'Phonics-C Chalkie adapter pilot flag is off.',
    }
  }

  const exactScope = isExactBe3U08PhonicsNllChalkieAdapterScope({
    activityCards: input.activityCards,
    workbookActivityCards: input.workbookActivityCards,
    companion: input.companion,
  })
  if (!exactScope || !input.companion) {
    return {
      ok: false,
      reason: 'ineligible_scope',
      message:
        'Exact BE3 Unit 8 Phonics scope is required for the Phonics-C pilot.',
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
      BE3_U08_PHONICS_NLL_COMPONENT_KEY,
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
      message: `NLL component ${BE3_U08_PHONICS_NLL_COMPONENT_KEY} was not found.`,
    }
  }

  if (!isCompleteExpectedPhonicsNllComponent(resolved)) {
    return {
      ok: false,
      reason: 'incomplete_component',
      message: `NLL component ${BE3_U08_PHONICS_NLL_COMPONENT_KEY} is incomplete or invalid for Phonics-C.`,
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
      handoff: toPhonicsHandoff(renderNeutral(nlp)),
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
