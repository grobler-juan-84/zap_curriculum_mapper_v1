/**
 * Curriculum-agnostic NLL component lookup by exact activity membership.
 *
 * Matches the complete set of available lesson activity IDs against
 * `nll_components` + `nll_component_activities`. Requires set equality —
 * no partial matches, guessing, or first-result selection.
 * Activity IDs carry book identity, so exact full-set matching prevents
 * cross-book / cross-unit collisions without a hard-coded unit table.
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import type { NllComponentActivityRow, NllComponentRow } from './neutralLessonLibrary'

export type NllComponentMembershipCatalogEntry = {
  readonly componentId: string
  readonly componentKey: string
  readonly componentTitle: string
  readonly status: NllComponentRow['status']
  /** Full membership activity_id set for this component (unordered). */
  readonly activityIds: readonly string[]
}

export type ResolveNllComponentByExactMembershipMatch = {
  readonly kind: 'matched'
  readonly componentId: string
  readonly componentKey: string
  readonly componentTitle: string
}

export type ResolveNllComponentByExactMembershipResult =
  | ResolveNllComponentByExactMembershipMatch
  | { readonly kind: 'unavailable' }
  | {
      readonly kind: 'ambiguous'
      readonly matches: readonly {
        readonly componentId: string
        readonly componentKey: string
        readonly componentTitle: string
      }[]
    }

function normalizeActivityIds(ids: readonly string[]): string[] {
  const unique = new Set<string>()
  for (const raw of ids) {
    if (typeof raw !== 'string') continue
    const id = raw.trim()
    if (id) unique.add(id)
  }
  return [...unique]
}

function setsEqual(left: ReadonlySet<string>, right: ReadonlySet<string>): boolean {
  if (left.size !== right.size) return false
  for (const id of left) {
    if (!right.has(id)) return false
  }
  return true
}

/**
 * Pure exact full-set membership resolve against an in-memory catalog.
 * Test-friendly; does not touch Supabase.
 */
export function resolveNllComponentByExactActivityMembership(input: {
  readonly lessonActivityIds: readonly string[]
  readonly catalog: readonly NllComponentMembershipCatalogEntry[]
}): ResolveNllComponentByExactMembershipResult {
  const lessonIds = normalizeActivityIds(input.lessonActivityIds)
  if (lessonIds.length === 0) return { kind: 'unavailable' }

  const lessonSet = new Set(lessonIds)
  const matches: ResolveNllComponentByExactMembershipMatch[] = []
  const seenKeys = new Set<string>()

  for (const entry of input.catalog) {
    const membershipIds = normalizeActivityIds(entry.activityIds)
    const membershipSet = new Set(membershipIds)
    if (!setsEqual(lessonSet, membershipSet)) continue

    const dedupeKey = `${entry.componentId}\u0000${entry.componentKey}`
    if (seenKeys.has(dedupeKey)) continue
    seenKeys.add(dedupeKey)

    matches.push({
      kind: 'matched',
      componentId: entry.componentId,
      componentKey: entry.componentKey,
      componentTitle: entry.componentTitle,
    })
  }

  if (matches.length === 0) return { kind: 'unavailable' }
  if (matches.length === 1) return matches[0]!
  return {
    kind: 'ambiguous',
    matches: matches.map((match) => ({
      componentId: match.componentId,
      componentKey: match.componentKey,
      componentTitle: match.componentTitle,
    })),
  }
}

function requireData<T>(
  label: string,
  result: { readonly data: unknown; readonly error: { message: string } | null },
): T {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data as T
}

/**
 * Load candidate component membership rows for exact-set matching.
 * Candidates are components that share at least one lesson activity ID;
 * full memberships are then loaded so set equality can be tested.
 */
export async function loadNllComponentMembershipCatalog(
  client: SupabaseClient,
  lessonActivityIds: readonly string[],
): Promise<readonly NllComponentMembershipCatalogEntry[]> {
  const lessonIds = normalizeActivityIds(lessonActivityIds)
  if (lessonIds.length === 0) return []

  const hitResult = await client
    .from('nll_component_activities')
    .select('component_id, activity_id')
    .in('activity_id', lessonIds)
  const hits = requireData<
    readonly { readonly component_id: string; readonly activity_id: string }[]
  >('Load NLL membership hits', hitResult)

  const candidateIds = [
    ...new Set(
      hits
        .map((row) =>
          typeof row.component_id === 'string' ? row.component_id.trim() : '',
        )
        .filter(Boolean),
    ),
  ]
  if (candidateIds.length === 0) return []

  const [componentResult, membershipResult] = await Promise.all([
    client
      .from('nll_components')
      .select('id, component_key, title, status, created_at')
      .in('id', candidateIds),
    client
      .from('nll_component_activities')
      .select('component_id, activity_id, position')
      .in('component_id', candidateIds),
  ])

  const components = requireData<readonly NllComponentRow[]>(
    'Load NLL candidate components',
    componentResult,
  )
  const memberships = requireData<readonly NllComponentActivityRow[]>(
    'Load NLL candidate memberships',
    membershipResult,
  )

  const activityIdsByComponentId = new Map<string, string[]>()
  for (const membership of memberships) {
    const componentId =
      typeof membership.component_id === 'string'
        ? membership.component_id.trim()
        : ''
    const activityId =
      typeof membership.activity_id === 'string'
        ? membership.activity_id.trim()
        : ''
    if (!componentId || !activityId) continue
    const list = activityIdsByComponentId.get(componentId) ?? []
    list.push(activityId)
    activityIdsByComponentId.set(componentId, list)
  }

  const catalog: NllComponentMembershipCatalogEntry[] = []
  for (const component of components) {
    const componentId =
      typeof component.id === 'string' ? component.id.trim() : ''
    const componentKey =
      typeof component.component_key === 'string'
        ? component.component_key.trim()
        : ''
    if (!componentId || !componentKey) continue
    catalog.push({
      componentId,
      componentKey,
      componentTitle:
        typeof component.title === 'string' ? component.title : componentKey,
      status: component.status,
      activityIds: activityIdsByComponentId.get(componentId) ?? [],
    })
  }

  // Stable order for deterministic ambiguous reporting.
  catalog.sort((left, right) =>
    left.componentKey.localeCompare(right.componentKey) ||
    left.componentId.localeCompare(right.componentId),
  )

  return catalog
}

/**
 * Resolve using a live Supabase catalog query, then exact set equality.
 */
export async function resolveNllComponentByExactActivityMembershipFromClient(
  client: SupabaseClient,
  lessonActivityIds: readonly string[],
): Promise<ResolveNllComponentByExactMembershipResult> {
  const catalog = await loadNllComponentMembershipCatalog(
    client,
    lessonActivityIds,
  )
  return resolveNllComponentByExactActivityMembership({
    lessonActivityIds,
    catalog,
  })
}
