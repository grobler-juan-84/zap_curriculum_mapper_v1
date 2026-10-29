import type { SupabaseClient } from '@supabase/supabase-js'

export type NllDisplayStatus = 'hidden' | 'available'
export type NllReviewState = 'experimental' | 'reviewed' | 'teacher_corrected'
export type NllSummaryStaleness = 'current' | 'potentially_stale' | 'unverifiable'

export type NllComponentRow = {
  readonly id: string
  readonly component_key: string
  readonly title: string
  readonly status: 'draft' | 'available' | 'retired'
  readonly created_at: string
}
export type NllComponentActivityRow = {
  readonly component_id: string
  readonly activity_id: string
  readonly position: number | null
}
export type NllActivitySummaryRow = {
  readonly id: string
  readonly activity_id: string
  readonly version: number
  readonly summary_text: string
  readonly canonical_path: string
  readonly canonical_sha256: string
  readonly activity_sha256: string
  readonly evidence_status: 'sufficient' | 'insufficient'
  readonly display_status: NllDisplayStatus
  readonly review_state: NllReviewState
  readonly is_preferred: boolean
  readonly provenance: Readonly<Record<string, unknown>>
  readonly created_at: string
}
export type NllSsComponentLinkRow = {
  readonly id: string
  readonly component_id: string
  readonly ss_path: string
  readonly ss_sha256: string
  readonly unit_number_raw: string
  readonly column_order: number
  readonly category_name_raw: string
  readonly status: 'proposed' | 'available'
  readonly created_at: string
}
export type ResolvedNllSummary = NllActivitySummaryRow & {
  readonly staleness: NllSummaryStaleness
  readonly currentActivitySha256: string | null
}
export type ResolvedNllComponent = {
  readonly component: NllComponentRow
  readonly activities: readonly {
    readonly activityId: string
    readonly position: number | null
    readonly preferredSummary: ResolvedNllSummary | null
  }[]
  readonly curriculumAuthorityLinks: readonly NllSsComponentLinkRow[]
  readonly proposedSsLinks: readonly NllSsComponentLinkRow[]
}
export type AssembleNllComponentInput = {
  readonly component: NllComponentRow
  readonly memberships: readonly NllComponentActivityRow[]
  readonly summaries: readonly NllActivitySummaryRow[]
  readonly ssLinks: readonly NllSsComponentLinkRow[]
  readonly includeHiddenExperimental?: boolean
  readonly currentActivitySha256ById?: Readonly<Record<string, string>>
}

function resolveStaleness(
  summary: NllActivitySummaryRow,
  currentById?: Readonly<Record<string, string>>,
): Pick<ResolvedNllSummary, 'staleness' | 'currentActivitySha256'> {
  const current = currentById?.[summary.activity_id]
  if (!current) return { staleness: 'unverifiable', currentActivitySha256: null }
  return {
    staleness: current === summary.activity_sha256 ? 'current' : 'potentially_stale',
    currentActivitySha256: current,
  }
}

export function assembleNeutralLessonComponent(
  input: AssembleNllComponentInput,
): ResolvedNllComponent {
  const preferredByActivityId = new Map<string, NllActivitySummaryRow>()
  for (const summary of input.summaries) {
    if (!summary.is_preferred) continue
    if (summary.display_status === 'hidden' && !input.includeHiddenExperimental) continue
    preferredByActivityId.set(summary.activity_id, summary)
  }

  const activities = input.memberships
    .filter((membership) => membership.component_id === input.component.id)
    .sort(
      (left, right) =>
        (left.position ?? Number.MAX_SAFE_INTEGER) -
          (right.position ?? Number.MAX_SAFE_INTEGER) ||
        left.activity_id.localeCompare(right.activity_id),
    )
    .map((membership) => {
      const summary = preferredByActivityId.get(membership.activity_id)
      return {
        activityId: membership.activity_id,
        position: membership.position,
        preferredSummary: summary
          ? {
              ...summary,
              ...resolveStaleness(summary, input.currentActivitySha256ById),
            }
          : null,
      }
    })

  const links = input.ssLinks.filter(
    (link) => link.component_id === input.component.id,
  )
  return {
    component: input.component,
    activities,
    curriculumAuthorityLinks: links.filter((link) => link.status === 'available'),
    proposedSsLinks: links.filter((link) => link.status === 'proposed'),
  }
}

function requireData<T>(
  label: string,
  result: { readonly data: unknown; readonly error: { message: string } | null },
): T {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data as T
}

export async function loadNeutralLessonComponent(
  client: SupabaseClient,
  componentKey: string,
  options?: {
    readonly includeHiddenExperimental?: boolean
    readonly currentActivitySha256ById?: Readonly<Record<string, string>>
  },
): Promise<ResolvedNllComponent | null> {
  const componentResult = await client
    .from('nll_components')
    .select('id, component_key, title, status, created_at')
    .eq('component_key', componentKey)
    .maybeSingle()
  const component = requireData<NllComponentRow | null>('Load NLL component', componentResult)
  if (!component) return null

  const [membershipResult, ssLinkResult] = await Promise.all([
    client
      .from('nll_component_activities')
      .select('component_id, activity_id, position')
      .eq('component_id', component.id)
      .order('position', { ascending: true }),
    client
      .from('nll_ss_component_links')
      .select('id, component_id, ss_path, ss_sha256, unit_number_raw, column_order, category_name_raw, status, created_at')
      .eq('component_id', component.id)
      .order('column_order', { ascending: true }),
  ])
  const memberships = requireData<NllComponentActivityRow[]>('Load NLL component activities', membershipResult)
  const ssLinks = requireData<NllSsComponentLinkRow[]>('Load NLL SS links', ssLinkResult)
  const activityIds = memberships.map((membership) => membership.activity_id)

  let summaries: NllActivitySummaryRow[] = []
  if (activityIds.length > 0) {
    let summaryQuery = client
      .from('nll_activity_summaries')
      .select('id, activity_id, version, summary_text, canonical_path, canonical_sha256, activity_sha256, evidence_status, display_status, review_state, is_preferred, provenance, created_at')
      .in('activity_id', activityIds)
      .eq('is_preferred', true)
    if (!options?.includeHiddenExperimental) {
      summaryQuery = summaryQuery.eq('display_status', 'available')
    }
    summaries = requireData<NllActivitySummaryRow[]>('Load preferred NLL summaries', await summaryQuery)
  }

  return assembleNeutralLessonComponent({
    component,
    memberships,
    summaries,
    ssLinks,
    includeHiddenExperimental: options?.includeHiddenExperimental,
    currentActivitySha256ById: options?.currentActivitySha256ById,
  })
}

function stableCanonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableCanonicalJson).join(',')}]`
  if (value !== null && typeof value === 'object') {
    const record = value as Record<string, unknown>
    return `{${Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableCanonicalJson(record[key])}`)
      .join(',')}}`
  }
  return JSON.stringify(value)
}

export async function fingerprintCanonicalActivity(
  activity: Readonly<Record<string, unknown>>,
): Promise<string> {
  const bytes = new TextEncoder().encode(stableCanonicalJson(activity))
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('')
}
