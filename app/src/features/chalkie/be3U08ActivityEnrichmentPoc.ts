/**
 * Experimental BE3 Unit 8 activity-enrichment sidecars.
 *
 * This bounded POC keeps derived teacher-friendly summaries separate from the
 * Phase 1 publisher evidence. The records below reference, but never rewrite,
 * the five human-verified SB activities on pp. 128-129.
 *
 * Optional teaching guidance was removed from the active POC (parked for later
 * reconsideration). Do not reintroduce dormant guidance records here.
 */

export const BE3_U08_ACTIVITY_ENRICHMENT_POC_ENV =
  'VITE_CHALKIE_BE3_U08_ACTIVITY_ENRICHMENT_POC'

export const BE3_U08_ACTIVITY_ENRICHMENT_POC_VERSION =
  'be3-u08-activity-enrichment-poc-v1'

export const BE3_U08_ACTIVITY_IDS = [
  'bep3_sb_act_08_01',
  'bep3_sb_act_08_02',
  'bep3_sb_act_08_03',
  'bep3_sb_act_08_04',
  'bep3_sb_act_08_05',
] as const

export type Be3U08ActivityId = (typeof BE3_U08_ACTIVITY_IDS)[number]

export type Be3U08ActivitySummarySidecarRecord = {
  readonly recordType: 'teacher_friendly_summary'
  readonly recordId: string
  readonly version: typeof BE3_U08_ACTIVITY_ENRICHMENT_POC_VERSION
  readonly sourceEvidence: {
    readonly activityId: Be3U08ActivityId
    readonly verificationStatus: 'human_verified'
  }
  readonly text: string
  readonly evidenceSufficiency: 'sufficient' | 'insufficient'
  readonly reviewStatus: 'experimental_review_required'
  readonly generation: {
    readonly method: 'ai_assisted_draft'
    readonly provider: 'openai'
    readonly model: 'gpt-5'
    readonly promptVersion: typeof BE3_U08_ACTIVITY_ENRICHMENT_POC_VERSION
  }
}

const generationMetadata = Object.freeze({
  method: 'ai_assisted_draft' as const,
  provider: 'openai' as const,
  model: 'gpt-5' as const,
  promptVersion: BE3_U08_ACTIVITY_ENRICHMENT_POC_VERSION,
})

function summaryRecord(input: {
  readonly activityId: Be3U08ActivityId
  readonly number: string
  readonly text: string
  readonly evidenceSufficiency?: 'sufficient' | 'insufficient'
}): Be3U08ActivitySummarySidecarRecord {
  return Object.freeze({
    recordType: 'teacher_friendly_summary',
    recordId: `big_english_3_sb_unit_08_activity_${input.number}_summary_poc_v1`,
    version: BE3_U08_ACTIVITY_ENRICHMENT_POC_VERSION,
    sourceEvidence: Object.freeze({
      activityId: input.activityId,
      verificationStatus: 'human_verified',
    }),
    text: input.text,
    evidenceSufficiency: input.evidenceSufficiency ?? 'sufficient',
    reviewStatus: 'experimental_review_required',
    generation: generationMetadata,
  })
}

/** Derived summaries: experimental records, not publisher evidence. */
export const BE3_U08_ACTIVITY_SUMMARY_SIDECAR = Object.freeze([
  summaryRecord({
    activityId: 'bep3_sb_act_08_01',
    number: '01',
    text: 'Students listen, look at the pictures and say the healthy-living questions about Sally and Zach.',
  }),
  summaryRecord({
    activityId: 'bep3_sb_act_08_02',
    number: '02',
    text: 'Students listen to Audio 150, find the matching content on the page and say it.',
  }),
  summaryRecord({
    activityId: 'bep3_sb_act_08_03',
    number: '03',
    text: 'The verified evidence only says “Play a game.” The game procedure is not available in the activity record.',
    evidenceSufficiency: 'insufficient',
  }),
  summaryRecord({
    activityId: 'bep3_sb_act_08_04',
    number: '04',
    text: 'Students listen and sing, then answer how Zach feels today.',
  }),
  summaryRecord({
    activityId: 'bep3_sb_act_08_05',
    number: '05',
    text: 'Students use the pictures from Activity 1 to ask and answer Did…? questions with short answers.',
  }),
] satisfies readonly Be3U08ActivitySummarySidecarRecord[])

const summaryByActivityId = new Map(
  BE3_U08_ACTIVITY_SUMMARY_SIDECAR.map((record) => [
    record.sourceEvidence.activityId,
    record,
  ]),
)

export function isBe3U08ActivityId(value: string): value is Be3U08ActivityId {
  return (BE3_U08_ACTIVITY_IDS as readonly string[]).includes(value)
}

export function getBe3U08ActivitySummary(
  activityId: string,
): Be3U08ActivitySummarySidecarRecord | null {
  return isBe3U08ActivityId(activityId)
    ? (summaryByActivityId.get(activityId) ?? null)
    : null
}

function envFlagEnabled(raw: string | boolean | undefined): boolean {
  if (raw === true) return true
  if (typeof raw !== 'string') return false
  const normalized = raw.trim().toLowerCase()
  return normalized === '1' || normalized === 'true' || normalized === 'yes'
}

export function isBe3U08ActivityEnrichmentPocEnabled(
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
  return envFlagEnabled(resolved[BE3_U08_ACTIVITY_ENRICHMENT_POC_ENV])
}
