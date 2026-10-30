/**
 * Bounded Writing-C NLL -> NLP -> Chalkie adapter pilot.
 * Default-off; BE3 U8 Writing only; lazy Create-a-prompt path only.
 * NLL summaries stay package-only and never become Chalkie prose.
 * Writing remains BI-absent (D022). Does not generalize Opener, Story, LiA, Grammar, CLIL/P.E., or Culture.
 *
 * Serving note: resolver default for this relationship remains sb_only.
 * When this flag is on and the teacher chooses a two-lesson series, the overlay
 * may serve the accepted SB→WB five-artifact renderer; flag-off keeps sb_only.
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import type { TeacherAddedLanguageInput } from './buildChalkiePromptPreview'
import { BE3_U08_SB140_WB115 } from './verifiedSbWbCompanions'
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

export const NLL_CHALKIE_WRITING_ADAPTER_PILOT_ENV =
  'VITE_NLL_CHALKIE_WRITING_ADAPTER_PILOT'

export const BE3_U08_WRITING_NLL_COMPONENT_KEY = 'be3-u08-writing'

export const BE3_U08_WRITING_SERIES_RELATIONSHIP_ID =
  BE3_U08_SB140_WB115.relationshipId

export const BE3_U08_WRITING_SERIES_STABLE_REF =
  'be3-sb-wb-u08-p140-wb115'

export const BE3_U08_WRITING_SERIES_TITLE =
  'BE3 Unit 08 · SB p. 140 + WB p. 115 — Healthy Living — Writing'

export type Be3U08WritingSeriesHandoff = {
  readonly relationshipId: string
  readonly seriesTitle: string
  readonly stableSeriesReference: string
  readonly detailedHandoff: string
  readonly lesson1Outline: string
  readonly lesson1Vocabulary: string
  readonly lesson2Outline: string
  readonly lesson2Vocabulary: string
}

const WRITING_SB_PAGES = [140] as const
const WRITING_WB_PAGES = [115] as const

const WRITING_SB_ACTIVITY_IDS = [
  'bep3_sb_act_08_28',
  'bep3_sb_act_08_29',
  'bep3_sb_act_08_30',
  'bep3_sb_act_08_31',
] as const

const WRITING_WB_ACTIVITY_IDS = [
  'bep_3_wb_act_115_24',
  'bep_3_wb_act_115_25',
  'bep_3_wb_act_115_26',
] as const

const WRITING_ALL_ACTIVITY_IDS = [
  ...WRITING_SB_ACTIVITY_IDS,
  ...WRITING_WB_ACTIVITY_IDS,
] as const

const WRITING_SB_ACTIVITY_PAGES: ReadonlyMap<string, number> = new Map([
  ['bep3_sb_act_08_28', 140],
  ['bep3_sb_act_08_29', 140],
  ['bep3_sb_act_08_30', 140],
  ['bep3_sb_act_08_31', 140],
])

const WRITING_WB_ACTIVITY_PAGES: ReadonlyMap<string, number> = new Map([
  ['bep_3_wb_act_115_24', 115],
  ['bep_3_wb_act_115_25', 115],
  ['bep_3_wb_act_115_26', 115],
])

const WRITING_WB_ACTIVITY_PAGE_IDS: ReadonlyMap<string, string> = new Map([
  ['bep_3_wb_act_115_24', 'bep_3_wb_p115'],
  ['bep_3_wb_act_115_25', 'bep_3_wb_p115'],
  ['bep_3_wb_act_115_26', 'bep_3_wb_p115'],
])

function isExactExpectedWritingWbCard(card: WbActivityCard): boolean {
  if (card.source !== 'WB' || card.references.length !== 1) return false
  const reference = card.references[0]
  if (!reference) return false

  const activityId = reference.activityId
  const expectedPage = WRITING_WB_ACTIVITY_PAGES.get(activityId)
  const expectedPageId = WRITING_WB_ACTIVITY_PAGE_IDS.get(activityId)
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

export function isNllWritingChalkieAdapterPilotEnabled(
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
  return envFlagEnabled(resolved[NLL_CHALKIE_WRITING_ADAPTER_PILOT_ENV])
}

export function isExactBe3U08WritingNllChalkieAdapterScope(input: {
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly companion: VerifiedSbWbCompanion | null
}): boolean {
  const companion = input.companion
  if (
    !companion ||
    companion.relationshipId !== BE3_U08_WRITING_SERIES_RELATIONSHIP_ID ||
    companion.studentBookCatalogId !== 'big_english_3_sb' ||
    companion.workbookCatalogId !== 'big_english_3_wb' ||
    !pagesMatchExact(companion.studentBookPrintedPages, WRITING_SB_PAGES) ||
    !pagesMatchExact(companion.workbookPrintedPages, WRITING_WB_PAGES)
  ) {
    return false
  }

  if (input.activityCards.length !== WRITING_SB_ACTIVITY_IDS.length) {
    return false
  }
  if (input.workbookActivityCards.length !== WRITING_WB_ACTIVITY_IDS.length) {
    return false
  }

  const seenSb = new Set<string>()
  for (const card of input.activityCards) {
    const activityId = card.references.activityId
    const expectedPage = WRITING_SB_ACTIVITY_PAGES.get(activityId)
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
  if (!WRITING_SB_ACTIVITY_IDS.every((id) => seenSb.has(id))) return false

  const seenWb = new Set<string>()
  for (const card of input.workbookActivityCards) {
    const activityId = card.references[0]?.activityId
    if (
      !activityId ||
      seenWb.has(activityId) ||
      !isExactExpectedWritingWbCard(card)
    ) {
      return false
    }
    seenWb.add(activityId)
  }
  return WRITING_WB_ACTIVITY_IDS.every((id) => seenWb.has(id))
}

/**
 * Writing series gate does not require resolver sb_wb packaging.
 * Flag-off overlay continues to use the current sb_only path.
 */
export function shouldRunNllWritingChalkieAdapterPilot(input: {
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

export type NllWritingChalkieAdapterPreparedOutputKind =
  | 'chalkie'
  | 'lesson_plan'
  | null

export function writingNllChalkieAdapterScopeKey(input: {
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

export function nllWritingChalkieAdapterRequestKey(input: {
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly companion: VerifiedSbWbCompanion | null
  readonly sbSelection: SbActivityHandoffSelection
  readonly wbSelection: WbActivityHandoffSelection
  readonly selectedSuggestions: readonly TeacherChoiceSuggestion[]
  readonly teacherAdditions: readonly TeacherAddedLanguageInput[]
}): string {
  const scopeKey = writingNllChalkieAdapterScopeKey(input)
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

export function shouldApplyNllWritingChalkieAdapterPilotResult(input: {
  readonly requestId: number
  readonly latestRequestId: number
  readonly overlayOpen: boolean
  readonly requestKey: string
  readonly currentRequestKey: string
  readonly preparedOutputKind: NllWritingChalkieAdapterPreparedOutputKind
}): boolean {
  return (
    input.overlayOpen &&
    input.requestId === input.latestRequestId &&
    input.requestKey === input.currentRequestKey &&
    input.preparedOutputKind === 'chalkie'
  )
}

export function invalidateNllWritingChalkieAdapterPilotRequest(input: {
  readonly requestIdRef: { current: number }
}): void {
  input.requestIdRef.current += 1
}

export type NllWritingChalkieAdapterPilotLoadNll = (
  client: SupabaseClient | null,
  componentKey: string,
  options: { readonly includeHiddenExperimental: true },
) => Promise<ResolvedNllComponent | null>

export type NllWritingChalkieAdapterPilotSuccess = {
  readonly ok: true
  readonly nlp: NeutralSbWbLessonPackage
  readonly handoff: Be3U08WritingSeriesHandoff
}

export type NllWritingChalkieAdapterPilotFallback = {
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

export type NllWritingChalkieAdapterPilotResult =
  | NllWritingChalkieAdapterPilotSuccess
  | NllWritingChalkieAdapterPilotFallback

export type AssembleNllWritingChalkieAdapterPilotInput = {
  readonly flagEnabled?: boolean
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly companion: VerifiedSbWbCompanion | null
  readonly sbSelection: SbActivityHandoffSelection
  readonly wbSelection: WbActivityHandoffSelection
  readonly selectedSuggestions?: readonly TeacherChoiceSuggestion[]
  readonly teacherAdditions?: readonly TeacherAddedLanguageInput[]
  readonly client: SupabaseClient | null
  readonly loadNll?: NllWritingChalkieAdapterPilotLoadNll
  readonly buildNeutralPackage?: typeof buildNeutralSbWbLessonPackage
  readonly renderNeutral?: typeof renderChalkieFromNeutralPackage
  readonly env?: { readonly [key: string]: string | boolean | undefined } | null
}

const defaultLoadNll: NllWritingChalkieAdapterPilotLoadNll = async (
  client,
  componentKey,
  options,
) => {
  if (!client) return null
  return loadNeutralLessonComponent(client, componentKey, options)
}

function toWritingHandoff(
  rendered: ChalkieNeutralPackageRenderOutput,
): Be3U08WritingSeriesHandoff {
  return {
    relationshipId: BE3_U08_WRITING_SERIES_RELATIONSHIP_ID,
    seriesTitle: BE3_U08_WRITING_SERIES_TITLE,
    stableSeriesReference: BE3_U08_WRITING_SERIES_STABLE_REF,
    ...rendered,
  }
}

function isCompleteExpectedWritingNllComponent(
  resolved: ResolvedNllComponent,
): boolean {
  if (resolved.component.component_key !== BE3_U08_WRITING_NLL_COMPONENT_KEY) {
    return false
  }

  const activities = resolved.activities
  if (activities.length !== WRITING_ALL_ACTIVITY_IDS.length) return false

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
  if (seenIds.size !== WRITING_ALL_ACTIVITY_IDS.length) return false

  return WRITING_ALL_ACTIVITY_IDS.every((activityId, index) => {
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
 * Lazy Writing-C assembler: load Writing NLL, assemble the exact selected NLP,
 * attach selected summaries, then render the five accepted Writing artifacts.
 * Never throws to the UI; callers retain the current sb_only fallback.
 * Does not accept or attach Book Intelligence.
 */
export async function assembleNllWritingChalkieAdapterPilot(
  input: AssembleNllWritingChalkieAdapterPilotInput,
): Promise<NllWritingChalkieAdapterPilotResult> {
  const flagEnabled =
    input.flagEnabled ?? isNllWritingChalkieAdapterPilotEnabled(input.env)
  if (!flagEnabled) {
    return {
      ok: false,
      reason: 'flag_off',
      message: 'Writing-C Chalkie adapter pilot flag is off.',
    }
  }

  const exactScope = isExactBe3U08WritingNllChalkieAdapterScope({
    activityCards: input.activityCards,
    workbookActivityCards: input.workbookActivityCards,
    companion: input.companion,
  })
  if (!exactScope || !input.companion) {
    return {
      ok: false,
      reason: 'ineligible_scope',
      message:
        'Exact BE3 Unit 8 Writing scope is required for the Writing-C pilot.',
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
      BE3_U08_WRITING_NLL_COMPONENT_KEY,
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
      message: `NLL component ${BE3_U08_WRITING_NLL_COMPONENT_KEY} was not found.`,
    }
  }

  if (!isCompleteExpectedWritingNllComponent(resolved)) {
    return {
      ok: false,
      reason: 'incomplete_component',
      message: `NLL component ${BE3_U08_WRITING_NLL_COMPONENT_KEY} is incomplete or invalid for Writing-C.`,
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
      // Writing remains BI-absent: do not pass bookIntelligenceUnit / biArtifactRef.
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
      handoff: toWritingHandoff(renderNeutral(nlp)),
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
