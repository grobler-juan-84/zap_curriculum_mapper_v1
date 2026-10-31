/**
 * Shared BE3 Unit 8 NLL activity-summary loader for Create-a-prompt modal cards.
 *
 * Default-off (`VITE_CHALKIE_NLL_ACTIVITY_SUMMARIES`). Loads preferred summaries
 * once per exact lesson/component scope (including hidden/experimental), maps
 * strictly by activity_id, validates ordered membership, and fails closed to
 * ordinary evidence cards. Summaries are modal-display only — never selection
 * state and never Chalkie artifact / prompt / lesson-plan prose.
 *
 * Sole runtime AI-summary source for Unit 8 Create-a-prompt modal cards
 * (Opener through Review, including Values). Historical Opener POC /
 * POC↔NLL comparison modules remain as non-modal fixtures/tests only and are
 * not wired into overlay modal presentation.
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import type { SbActivityCard } from './chalkieActivitySelection'
import type { WbActivityCard } from './chalkieWorkbookActivitySelection'
import type { VerifiedSbWbCompanion } from './resolveVerifiedSbWbCompanion'
import {
  loadNeutralLessonComponent,
  type ResolvedNllComponent,
} from '../nll/neutralLessonLibrary'

export const NLL_ACTIVITY_SUMMARIES_ENV = 'VITE_CHALKIE_NLL_ACTIVITY_SUMMARIES'

export type NllActivitySummaryDisplay = {
  readonly text: string
  readonly evidenceSufficiency: 'sufficient' | 'insufficient'
}

export type NllActivitySummaryByActivityId = ReadonlyMap<
  string,
  NllActivitySummaryDisplay
>

export type NllActivitySummaryLoadStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'empty'
  | 'unavailable'
  | 'error'
  | 'membership_mismatch'

export type NllActivitySummaryComponentSpec = {
  readonly componentKey: string
  readonly expectedActivityIds: readonly string[]
}

/** Live Unit 8 NLL components (ten lessons, including Values). */
export const BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS = {
  opener: {
    componentKey: 'be3-u08-opener',
    expectedActivityIds: [
      'bep3_sb_act_08_01',
      'bep3_sb_act_08_02',
      'bep3_sb_act_08_03',
      'bep3_sb_act_08_04',
      'bep3_sb_act_08_05',
      'bep_3_wb_act_104_1',
      'bep_3_wb_act_104_2',
      'bep_3_wb_act_105_3',
      'bep_3_wb_act_105_4',
    ],
  },
  story: {
    componentKey: 'be3-u08-story',
    expectedActivityIds: [
      'bep3_sb_act_08_06',
      'bep3_sb_act_08_07',
      'bep_3_wb_act_106_5',
      'bep_3_wb_act_106_6',
      'bep_3_wb_act_106_tb',
    ],
  },
  lia: {
    componentKey: 'be3-u08-lia',
    expectedActivityIds: [
      'bep3_sb_act_08_08',
      'bep3_sb_act_08_09',
      'bep3_sb_act_08_10',
      'bep3_sb_act_08_11',
      'bep3_sb_act_08_12',
      'bep_3_wb_act_107_7',
      'bep_3_wb_act_107_8',
      'bep_3_wb_act_108_9',
      'bep_3_wb_act_108_10',
    ],
  },
  clilPe: {
    componentKey: 'be3-u08-clil-pe',
    expectedActivityIds: [
      'bep3_sb_act_08_13',
      'bep3_sb_act_08_14',
      'bep3_sb_act_08_15',
      'bep3_sb_act_08_16',
      'bep3_sb_act_08_17',
      'bep3_sb_act_08_18',
      'bep_3_wb_act_109_11',
      'bep_3_wb_act_109_12',
      'bep_3_wb_act_110_13',
      'bep_3_wb_act_110_14',
      'bep_3_wb_act_110_tb',
    ],
  },
  grammar: {
    componentKey: 'be3-u08-grammar',
    expectedActivityIds: [
      'bep3_sb_act_08_19',
      'bep3_sb_act_08_20',
      'bep3_sb_act_08_21',
      'bep3_sb_act_08_22',
      'bep3_sb_act_08_23',
      'bep_3_wb_act_111_15',
      'bep_3_wb_act_111_16',
      'bep_3_wb_act_111_17',
      'bep_3_wb_act_112_18',
      'bep_3_wb_act_112_19',
    ],
  },
  culture: {
    componentKey: 'be3-u08-culture',
    expectedActivityIds: [
      'bep3_sb_act_08_24',
      'bep3_sb_act_08_25',
      'bep3_sb_act_08_26',
      'bep3_sb_act_08_27',
      'bep_3_wb_act_113_20',
      'bep_3_wb_act_113_21',
      'bep_3_wb_act_114_22',
      'bep_3_wb_act_114_23',
      'bep_3_wb_act_114_tb',
    ],
  },
  writing: {
    componentKey: 'be3-u08-writing',
    expectedActivityIds: [
      'bep3_sb_act_08_28',
      'bep3_sb_act_08_29',
      'bep3_sb_act_08_30',
      'bep3_sb_act_08_31',
      'bep_3_wb_act_115_24',
      'bep_3_wb_act_115_25',
      'bep_3_wb_act_115_26',
    ],
  },
  phonics: {
    componentKey: 'be3-u08-phonics',
    expectedActivityIds: [
      'bep3_sb_act_08_32',
      'bep3_sb_act_08_33',
      'bep3_sb_act_08_34',
      'bep3_sb_act_08_35',
      'bep_3_wb_act_116_27',
      'bep_3_wb_act_116_28',
      'bep_3_wb_act_116_29',
      'bep_3_wb_act_116_30',
    ],
  },
  values: {
    componentKey: 'be3-u08-values',
    expectedActivityIds: [
      'bep3_sb_act_08_36',
      'bep3_sb_act_08_37',
      'bep3_sb_act_08_38',
    ],
  },
  review: {
    componentKey: 'be3-u08-review',
    expectedActivityIds: [
      'bep3_sb_act_08_39',
      'bep3_sb_act_08_40',
      'bep3_sb_act_08_41',
      'bep_3_wb_act_117_31',
      'bep_3_wb_act_117_32',
      'bep_3_wb_act_117_33',
    ],
  },
} as const satisfies Record<string, NllActivitySummaryComponentSpec>

export const BE3_U08_NLL_ACTIVITY_SUMMARY_BY_RELATIONSHIP_ID: Readonly<
  Record<string, NllActivitySummaryComponentSpec>
> = {
  'be3_sb_wb_rel_u08_opener_sb128-129_wb104-105':
    BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.opener,
  'be3_sb_wb_rel_u08_story_sb130-131_wb106':
    BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.story,
  'be3_sb_wb_rel_u08_lia_sb132-133_wb107-108':
    BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.lia,
  'be3_sb_wb_rel_u08_clil_pe_sb134-135_wb109-110':
    BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.clilPe,
  'be3_sb_wb_rel_u08_grammar_sb136-137_wb111-112':
    BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.grammar,
  'be3_sb_wb_rel_u08_culture_sb138-139_wb113-114':
    BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.culture,
  'be3_sb_wb_rel_u08_writing_sb140_wb115':
    BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.writing,
  'be3_sb_wb_rel_u08_phonics_sb141_wb116':
    BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.phonics,
  'be3_sb_wb_rel_u08_review_sb143_wb117':
    BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.review,
}

const VALUES_SB_ACTIVITY_IDS =
  BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.values.expectedActivityIds

function envFlagEnabled(raw: string | boolean | undefined): boolean {
  if (raw === true) return true
  if (typeof raw !== 'string') return false
  const normalized = raw.trim().toLowerCase()
  return normalized === '1' || normalized === 'true' || normalized === 'yes'
}

export function isNllActivitySummariesEnabled(
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
  return envFlagEnabled(resolved[NLL_ACTIVITY_SUMMARIES_ENV])
}

function sortedUniqueIds(ids: readonly string[]): string[] {
  return [...new Set(ids.filter(Boolean))].sort()
}

function sbActivityIds(cards: readonly SbActivityCard[]): string[] {
  return cards.map((card) => card.references.activityId)
}

function wbActivityIds(cards: readonly WbActivityCard[]): string[] {
  return cards.map((card) => card.references[0]?.activityId ?? '').filter(Boolean)
}

export function isExactBe3U08ValuesNllActivitySummaryScope(input: {
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly companion: VerifiedSbWbCompanion | null
}): boolean {
  if (input.companion != null) return false
  if (input.workbookActivityCards.length > 0) return false
  const ids = sortedUniqueIds(sbActivityIds(input.activityCards))
  const expected = sortedUniqueIds(VALUES_SB_ACTIVITY_IDS)
  if (ids.length !== expected.length) return false
  if (!ids.every((id, index) => id === expected[index])) return false
  return input.activityCards.every(
    (card) =>
      card.printedPage === 142 &&
      VALUES_SB_ACTIVITY_IDS.includes(
        card.references.activityId as (typeof VALUES_SB_ACTIVITY_IDS)[number],
      ),
  )
}

export function resolveBe3U08NllActivitySummarySpec(input: {
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly companion: VerifiedSbWbCompanion | null
}): NllActivitySummaryComponentSpec | null {
  if (isExactBe3U08ValuesNllActivitySummaryScope(input)) {
    return BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.values
  }
  const relationshipId = input.companion?.relationshipId
  if (!relationshipId) return null
  return BE3_U08_NLL_ACTIVITY_SUMMARY_BY_RELATIONSHIP_ID[relationshipId] ?? null
}

/**
 * Exact lesson/component eligibility: mapped NLL component exists and the
 * modal's SB+WB activity ids are a subset of that component's expected membership
 * (allows partial/zero selection without changing selection state).
 */
export function isExactBe3U08NllActivitySummaryScope(input: {
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly companion: VerifiedSbWbCompanion | null
}): boolean {
  const spec = resolveBe3U08NllActivitySummarySpec(input)
  if (!spec) return false
  const expected = new Set(spec.expectedActivityIds)
  const present = [
    ...sbActivityIds(input.activityCards),
    ...wbActivityIds(input.workbookActivityCards),
  ]
  if (present.length === 0) return false
  return present.every((id) => expected.has(id))
}

export function shouldLoadNllActivitySummaries(input: {
  readonly open: boolean
  readonly flagEnabled: boolean
  readonly exactScopeEligible: boolean
}): boolean {
  return input.open && input.flagEnabled && input.exactScopeEligible
}

export function nllActivitySummaryScopeKey(input: {
  readonly componentKey: string
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly companion: VerifiedSbWbCompanion | null
}): string {
  const sbIds = sortedUniqueIds(sbActivityIds(input.activityCards)).join(',')
  const wbIds = sortedUniqueIds(wbActivityIds(input.workbookActivityCards)).join(
    ',',
  )
  return [
    input.componentKey,
    input.companion?.relationshipId ?? 'companion-free',
    sbIds,
    wbIds,
  ].join('|')
}

export function membershipMatchesExpected(
  resolved: ResolvedNllComponent,
  expectedActivityIds: readonly string[],
): boolean {
  if (resolved.component.component_key == null) return false
  if (resolved.activities.length !== expectedActivityIds.length) return false
  return expectedActivityIds.every((activityId, index) => {
    const row = resolved.activities[index]
    return (
      row != null &&
      row.activityId === activityId &&
      row.position === index + 1 &&
      row.preferredSummary != null &&
      row.preferredSummary.summary_text.trim().length > 0
    )
  })
}

export function mapResolvedNllComponentToActivitySummaries(
  resolved: ResolvedNllComponent | null,
  expectedActivityIds: readonly string[],
): {
  readonly status: 'success' | 'empty' | 'membership_mismatch'
  readonly byActivityId: NllActivitySummaryByActivityId
} {
  if (!resolved) {
    return { status: 'empty', byActivityId: new Map() }
  }
  if (!membershipMatchesExpected(resolved, expectedActivityIds)) {
    return { status: 'membership_mismatch', byActivityId: new Map() }
  }
  const byActivityId = new Map<string, NllActivitySummaryDisplay>()
  for (const activity of resolved.activities) {
    const summary = activity.preferredSummary
    if (!summary) continue
    byActivityId.set(activity.activityId, {
      text: summary.summary_text,
      evidenceSufficiency: summary.evidence_status,
    })
  }
  return {
    status: byActivityId.size > 0 ? 'success' : 'empty',
    byActivityId,
  }
}

export function nllActivitySummaryForActivity(
  byActivityId: NllActivitySummaryByActivityId | null,
  activityId: string,
): NllActivitySummaryDisplay | null {
  if (!byActivityId) return null
  return byActivityId.get(activityId) ?? null
}

/** Per-card modal display: summary only on success+hit; otherwise evidence fallback. */
export function toNllActivitySummaryDisplay(
  input: {
    readonly loadStatus: NllActivitySummaryLoadStatus
    readonly byActivityId: NllActivitySummaryByActivityId | null
    readonly activityId: string
  },
): NllActivitySummaryDisplay | null {
  if (input.loadStatus !== 'success') return null
  return nllActivitySummaryForActivity(input.byActivityId, input.activityId)
}

export type LoadNllActivitySummariesResult =
  | {
      readonly kind: 'success'
      readonly byActivityId: NllActivitySummaryByActivityId
      readonly componentKey: string
    }
  | { readonly kind: 'empty'; readonly componentKey: string }
  | { readonly kind: 'unavailable'; readonly componentKey: string }
  | { readonly kind: 'membership_mismatch'; readonly componentKey: string }
  | {
      readonly kind: 'error'
      readonly componentKey: string
      readonly message: string
    }

export async function loadNllActivitySummaries(input: {
  readonly client: SupabaseClient | null
  readonly componentKey: string
  readonly expectedActivityIds: readonly string[]
  readonly loadComponent?: typeof loadNeutralLessonComponent
}): Promise<LoadNllActivitySummariesResult> {
  const componentKey = input.componentKey
  if (!input.client) {
    return { kind: 'unavailable', componentKey }
  }
  const load = input.loadComponent ?? loadNeutralLessonComponent
  try {
    const resolved = await load(input.client, componentKey, {
      includeHiddenExperimental: true,
    })
    if (!resolved) {
      return { kind: 'empty', componentKey }
    }
    if (resolved.component.component_key !== componentKey) {
      return { kind: 'membership_mismatch', componentKey }
    }
    const mapped = mapResolvedNllComponentToActivitySummaries(
      resolved,
      input.expectedActivityIds,
    )
    if (mapped.status === 'membership_mismatch') {
      return { kind: 'membership_mismatch', componentKey }
    }
    if (mapped.status === 'empty') {
      return { kind: 'empty', componentKey }
    }
    return {
      kind: 'success',
      byActivityId: mapped.byActivityId,
      componentKey,
    }
  } catch (error) {
    return {
      kind: 'error',
      componentKey,
      message:
        error instanceof Error
          ? error.message
          : 'NLL activity-summary load failed',
    }
  }
}

export type NllActivitySummaryLifecycleState = {
  readonly status: NllActivitySummaryLoadStatus
  readonly byActivityId: NllActivitySummaryByActivityId | null
  readonly componentKey: string | null
}

type SharedNllActivitySummaryFlight = {
  readonly scopeKey: string
  readonly promise: Promise<LoadNllActivitySummariesResult>
}

/** Bounded single-flight slot — one in-flight component summary load at a time. */
let sharedNllActivitySummaryFlight: SharedNllActivitySummaryFlight | null = null

/** Test-only: clear the shared flight so cases start from a clean slot. */
export function resetNllActivitySummarySharedFlightForTests(): void {
  sharedNllActivitySummaryFlight = null
}

/** Test-only: inspect the active shared flight key. */
export function peekNllActivitySummarySharedFlightScopeKeyForTests(): string | null {
  return sharedNllActivitySummaryFlight?.scopeKey ?? null
}

function lifecycleStateFromResult(
  result: LoadNllActivitySummariesResult,
): NllActivitySummaryLifecycleState {
  if (result.kind === 'success') {
    return {
      status: 'success',
      byActivityId: result.byActivityId,
      componentKey: result.componentKey,
    }
  }
  if (result.kind === 'empty') {
    return {
      status: 'empty',
      byActivityId: null,
      componentKey: result.componentKey,
    }
  }
  if (result.kind === 'unavailable') {
    return {
      status: 'unavailable',
      byActivityId: null,
      componentKey: result.componentKey,
    }
  }
  if (result.kind === 'membership_mismatch') {
    return {
      status: 'membership_mismatch',
      byActivityId: null,
      componentKey: result.componentKey,
    }
  }
  return {
    status: 'error',
    byActivityId: null,
    componentKey: result.componentKey,
  }
}

/**
 * Overlay effect entry for NLL activity-summary loading.
 *
 * Same eligible `scopeKey` reuses one in-flight promise (covers React Strict Mode
 * setup/cleanup/setup). Cleanup cancels only that subscriber's apply path.
 * Clearing eligibility drops the shared flight so a later reopen or new scope
 * starts a fresh request. Not a general fetch cache.
 */
export function subscribeNllActivitySummaryLifecycle(input: {
  readonly shouldLoad: boolean
  readonly scopeKey: string
  readonly componentKey: string
  readonly expectedActivityIds: readonly string[]
  readonly client: SupabaseClient | null
  readonly loadSummaries?: typeof loadNllActivitySummaries
  readonly apply: (next: NllActivitySummaryLifecycleState) => void
}): () => void {
  if (!input.shouldLoad || !input.scopeKey || !input.componentKey) {
    sharedNllActivitySummaryFlight = null
    input.apply({ status: 'idle', byActivityId: null, componentKey: null })
    return () => {}
  }

  let cancelled = false
  input.apply({
    status: 'loading',
    byActivityId: null,
    componentKey: input.componentKey,
  })

  const loadSummaries = input.loadSummaries ?? loadNllActivitySummaries
  let flight = sharedNllActivitySummaryFlight
  if (!flight || flight.scopeKey !== input.scopeKey) {
    flight = {
      scopeKey: input.scopeKey,
      promise: loadSummaries({
        client: input.client,
        componentKey: input.componentKey,
        expectedActivityIds: input.expectedActivityIds,
      }),
    }
    sharedNllActivitySummaryFlight = flight
  }

  const subscribedFlight = flight
  void subscribedFlight.promise.then((result) => {
    if (cancelled) return
    if (sharedNllActivitySummaryFlight !== subscribedFlight) return
    input.apply(lifecycleStateFromResult(result))
  })

  return () => {
    cancelled = true
  }
}
