/**
 * Read-only helper: fingerprint authoritative canonical activity objects into
 * a currentActivitySha256ById map for NLL staleness comparison.
 *
 * Reuses fingerprintCanonicalActivity. Omits unresolved/failed IDs so the
 * loader reports them as unverifiable. Does not write to NLL or canonical data.
 */
import { fingerprintCanonicalActivity } from './neutralLessonLibrary'

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function activityIdOf(activity: Record<string, unknown>): string {
  const id = activity.activity_id
  return typeof id === 'string' ? id.trim() : ''
}

/**
 * Index full activity objects from one or more canonical book JSON roots.
 * Later raws overwrite earlier ones only on identical activity_id (SB then WB
 * is safe for BE3 — ids do not collide across books).
 */
export function indexCanonicalActivitiesById(
  ...canonicalRaws: readonly (unknown | null | undefined)[]
): ReadonlyMap<string, Readonly<Record<string, unknown>>> {
  const map = new Map<string, Readonly<Record<string, unknown>>>()
  for (const raw of canonicalRaws) {
    if (raw == null) continue
    for (const entry of asArray(asRecord(raw).activities)) {
      const activity = asRecord(entry)
      const activityId = activityIdOf(activity)
      if (!activityId) continue
      map.set(activityId, activity)
    }
  }
  return map
}

export async function buildCurrentActivitySha256ById(input: {
  readonly canonicalRaws?: readonly (unknown | null | undefined)[]
  readonly activityIds: readonly string[]
}): Promise<Readonly<Record<string, string>>> {
  const byId = indexCanonicalActivitiesById(...(input.canonicalRaws ?? []))
  const out: Record<string, string> = {}

  for (const rawId of input.activityIds) {
    const activityId = typeof rawId === 'string' ? rawId.trim() : ''
    if (!activityId) continue
    const activity = byId.get(activityId)
    if (!activity) continue
    try {
      out[activityId] = await fingerprintCanonicalActivity(activity)
    } catch {
      // Isolate failures: omit so resolveStaleness reports unverifiable.
    }
  }

  return out
}
