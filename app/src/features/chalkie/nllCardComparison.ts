/**
 * Bounded Stage 3 NLL ↔ POC activity-card comparison helpers.
 * Default-off; Opener nine-activity scope only. Not generalized NLL infrastructure.
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  isExactBe3U08ActivityEnrichmentPocScope,
  isExactBe3U08WorkbookEnrichmentPocScope,
} from './buildBe3U08ActivityEnrichmentPocPackage'
import type { SbActivityCard } from './chalkieActivitySelection'
import type { WbActivityCard } from './chalkieWorkbookActivitySelection'
import type { VerifiedSbWbCompanion } from './resolveVerifiedSbWbCompanion'
import {
  loadNeutralLessonComponent,
  type ResolvedNllComponent,
} from '../nll/neutralLessonLibrary'

export const NLL_CARD_COMPARISON_ENV = 'VITE_CHALKIE_NLL_CARD_COMPARISON'

export const BE3_U08_OPENER_NLL_COMPONENT_KEY = 'be3-u08-opener'

export type NllCardComparisonLoadStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'empty'
  | 'unavailable'
  | 'error'

export type NllCardComparisonSummaryDisplay = {
  readonly text: string
  readonly evidenceSufficiency: 'sufficient' | 'insufficient'
}

export type NllCardComparisonByActivityId = ReadonlyMap<
  string,
  NllCardComparisonSummaryDisplay
>

function envFlagEnabled(raw: string | boolean | undefined): boolean {
  if (raw === true) return true
  if (typeof raw !== 'string') return false
  const normalized = raw.trim().toLowerCase()
  return normalized === '1' || normalized === 'true' || normalized === 'yes'
}

export function isNllCardComparisonEnabled(
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
  return envFlagEnabled(resolved[NLL_CARD_COMPARISON_ENV])
}

export function isExactBe3U08OpenerNllCardComparisonScope(input: {
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly companion: VerifiedSbWbCompanion | null
}): boolean {
  return (
    isExactBe3U08ActivityEnrichmentPocScope(input.activityCards) &&
    isExactBe3U08WorkbookEnrichmentPocScope({
      cards: input.workbookActivityCards,
      companion: input.companion,
    })
  )
}

export function shouldLoadNllCardComparison(input: {
  readonly open: boolean
  readonly comparisonFlagEnabled: boolean
  readonly exactScopeEligible: boolean
}): boolean {
  return input.open && input.comparisonFlagEnabled && input.exactScopeEligible
}

export function mapResolvedNllComponentToCardSummaries(
  resolved: ResolvedNllComponent | null,
): {
  readonly status: 'success' | 'empty'
  readonly byActivityId: NllCardComparisonByActivityId
} {
  if (!resolved) {
    return { status: 'empty', byActivityId: new Map() }
  }

  const byActivityId = new Map<string, NllCardComparisonSummaryDisplay>()
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

export function nllCardComparisonSummaryForActivity(
  byActivityId: NllCardComparisonByActivityId | null,
  activityId: string,
): NllCardComparisonSummaryDisplay | null {
  if (!byActivityId) return null
  return byActivityId.get(activityId) ?? null
}

/** Per-card display state for the NLL column (no staleness chrome in Stage 3). */
export function toNllCardComparisonDisplayState(input: {
  readonly loadStatus: NllCardComparisonLoadStatus
  readonly byActivityId: NllCardComparisonByActivityId | null
  readonly activityId: string
}): {
  readonly status: 'loading' | 'success' | 'empty' | 'unavailable' | 'error'
  readonly summary: NllCardComparisonSummaryDisplay | null
} {
  if (input.loadStatus === 'idle' || input.loadStatus === 'loading') {
    return { status: 'loading', summary: null }
  }
  if (input.loadStatus === 'unavailable') {
    return { status: 'unavailable', summary: null }
  }
  if (input.loadStatus === 'error') {
    return { status: 'error', summary: null }
  }
  if (input.loadStatus === 'empty') {
    return { status: 'empty', summary: null }
  }
  const summary = nllCardComparisonSummaryForActivity(
    input.byActivityId,
    input.activityId,
  )
  if (!summary) {
    return { status: 'empty', summary: null }
  }
  return { status: 'success', summary }
}

export type LoadNllCardComparisonResult =
  | { readonly kind: 'success'; readonly byActivityId: NllCardComparisonByActivityId }
  | { readonly kind: 'empty' }
  | { readonly kind: 'unavailable' }
  | { readonly kind: 'error'; readonly message: string }

export async function loadNllCardComparisonSummaries(input: {
  readonly client: SupabaseClient | null
  readonly loadComponent?: typeof loadNeutralLessonComponent
}): Promise<LoadNllCardComparisonResult> {
  if (!input.client) return { kind: 'unavailable' }
  const load = input.loadComponent ?? loadNeutralLessonComponent
  try {
    const resolved = await load(input.client, BE3_U08_OPENER_NLL_COMPONENT_KEY, {
      includeHiddenExperimental: true,
    })
    const mapped = mapResolvedNllComponentToCardSummaries(resolved)
    if (mapped.status === 'empty') return { kind: 'empty' }
    return { kind: 'success', byActivityId: mapped.byActivityId }
  } catch (error) {
    return {
      kind: 'error',
      message: error instanceof Error ? error.message : 'NLL comparison load failed',
    }
  }
}

export function openerNllCardComparisonScopeKey(input: {
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
  return [
    input.companion?.relationshipId ?? '',
    sbIds,
    wbIds,
  ].join('|')
}

export type NllCardComparisonLifecycleState = {
  readonly status: NllCardComparisonLoadStatus
  readonly byActivityId: NllCardComparisonByActivityId | null
}

type SharedNllCardComparisonFlight = {
  readonly scopeKey: string
  readonly promise: Promise<LoadNllCardComparisonResult>
}

/** Bounded single-flight slot — one in-flight Opener comparison load at a time. */
let sharedNllCardComparisonFlight: SharedNllCardComparisonFlight | null = null

/** Test-only: clear the shared flight so cases start from a clean slot. */
export function resetNllCardComparisonSharedFlightForTests(): void {
  sharedNllCardComparisonFlight = null
}

/** Test-only: inspect the active shared flight key. */
export function peekNllCardComparisonSharedFlightScopeKeyForTests(): string | null {
  return sharedNllCardComparisonFlight?.scopeKey ?? null
}

function lifecycleStateFromResult(
  result: LoadNllCardComparisonResult,
): NllCardComparisonLifecycleState {
  if (result.kind === 'success') {
    return { status: 'success', byActivityId: result.byActivityId }
  }
  if (result.kind === 'empty') {
    return { status: 'empty', byActivityId: null }
  }
  if (result.kind === 'unavailable') {
    return { status: 'unavailable', byActivityId: null }
  }
  return { status: 'error', byActivityId: null }
}

/**
 * Overlay effect entry for Stage 3 comparison loading.
 *
 * Same eligible `scopeKey` reuses one in-flight promise (covers React Strict Mode
 * setup/cleanup/setup). Cleanup cancels only that subscriber's apply path.
 * Clearing eligibility (`shouldLoad: false`) drops the shared flight so a later
 * reopen or new scope starts a fresh request. Not a general fetch cache.
 */
export function subscribeNllCardComparisonLifecycle(input: {
  readonly shouldLoad: boolean
  readonly scopeKey: string
  readonly client: SupabaseClient | null
  readonly loadSummaries?: typeof loadNllCardComparisonSummaries
  readonly apply: (next: NllCardComparisonLifecycleState) => void
}): () => void {
  if (!input.shouldLoad || !input.scopeKey) {
    sharedNllCardComparisonFlight = null
    input.apply({ status: 'idle', byActivityId: null })
    return () => {}
  }

  let cancelled = false
  input.apply({ status: 'loading', byActivityId: null })

  const loadSummaries = input.loadSummaries ?? loadNllCardComparisonSummaries
  let flight = sharedNllCardComparisonFlight
  if (!flight || flight.scopeKey !== input.scopeKey) {
    flight = {
      scopeKey: input.scopeKey,
      promise: loadSummaries({ client: input.client }),
    }
    sharedNllCardComparisonFlight = flight
  }

  const subscribedFlight = flight
  void subscribedFlight.promise.then((result) => {
    if (cancelled) return
    if (sharedNllCardComparisonFlight !== subscribedFlight) return
    input.apply(lifecycleStateFromResult(result))
  })

  return () => {
    cancelled = true
  }
}
