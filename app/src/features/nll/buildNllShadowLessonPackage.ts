import type {
  NllActivitySummaryRow,
  NllSsComponentLinkRow,
  ResolvedNllComponent,
} from './neutralLessonLibrary'

export const NLL_SHADOW_PILOT_ENV = 'VITE_CHALKIE_NLL_SHADOW_PILOT'

function envFlagEnabled(raw: string | boolean | undefined): boolean {
  if (raw === true) return true
  if (typeof raw !== 'string') return false
  const normalized = raw.trim().toLowerCase()
  return normalized === '1' || normalized === 'true' || normalized === 'yes'
}

export function isNllShadowPilotEnabled(
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
  return envFlagEnabled(resolved[NLL_SHADOW_PILOT_ENV])
}

export type NllShadowPublisherEvidenceReference = {
  readonly activityId: string
  readonly source: 'SB' | 'WB'
  readonly canonicalPath: string
  readonly canonicalSha256: string
  readonly evidenceReference: Readonly<Record<string, unknown>>
}
export type NllShadowLessonPackage = {
  readonly packageType: 'nll_shadow_lesson_package'
  readonly componentKey: string
  readonly curriculumAuthority: readonly NllSsComponentLinkRow[]
  readonly proposedSsLinks: readonly NllSsComponentLinkRow[]
  readonly activities: readonly {
    readonly activityId: string
    readonly publisherEvidence: NllShadowPublisherEvidenceReference
    readonly aiSummary: (NllActivitySummaryRow & {
      readonly staleness: 'current' | 'potentially_stale' | 'unverifiable'
      readonly currentActivitySha256: string | null
    }) | null
  }[]
}

export function buildNllShadowLessonPackage(input: {
  readonly component: ResolvedNllComponent
  readonly selectedActivityIds: readonly string[]
  readonly publisherEvidenceByActivityId: Readonly<Record<string, NllShadowPublisherEvidenceReference>>
  readonly env?: { readonly [key: string]: string | boolean | undefined } | null
}): NllShadowLessonPackage | null {
  if (!isNllShadowPilotEnabled(input.env)) return null
  const selected = new Set(input.selectedActivityIds)
  const activities = input.component.activities.flatMap((activity) => {
    if (!selected.has(activity.activityId)) return []
    const publisherEvidence = input.publisherEvidenceByActivityId[activity.activityId]
    if (!publisherEvidence) return []
    return [{
      activityId: activity.activityId,
      publisherEvidence,
      aiSummary: activity.preferredSummary,
    }]
  })
  return {
    packageType: 'nll_shadow_lesson_package',
    componentKey: input.component.component.component_key,
    curriculumAuthority: input.component.curriculumAuthorityLinks,
    proposedSsLinks: input.component.proposedSsLinks,
    activities,
  }
}
