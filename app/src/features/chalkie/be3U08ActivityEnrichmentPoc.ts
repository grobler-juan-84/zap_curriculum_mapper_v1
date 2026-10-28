/**
 * Experimental BE3 Unit 8 activity-enrichment sidecars.
 *
 * This bounded POC deliberately keeps derived summaries and optional teaching
 * guidance separate from the Phase 1 publisher evidence. The records below
 * reference, but never rewrite, the five human-verified SB activities on
 * pp. 128-129.
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

export type Be3U08TeachingGuidanceSidecarRecord = {
  readonly recordType: 'optional_teaching_guidance'
  readonly recordId: string
  readonly version: typeof BE3_U08_ACTIVITY_ENRICHMENT_POC_VERSION
  readonly sourceEvidence: {
    readonly activityId: Be3U08ActivityId
    readonly verificationStatus: 'human_verified'
  }
  readonly text: string | null
  readonly availability: 'available' | 'withheld_insufficient_evidence'
  readonly withheldReason: string | null
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

function guidanceRecord(input: {
  readonly activityId: Be3U08ActivityId
  readonly number: string
  readonly text: string | null
  readonly withheldReason?: string | null
}): Be3U08TeachingGuidanceSidecarRecord {
  const available = input.text !== null
  return Object.freeze({
    recordType: 'optional_teaching_guidance',
    recordId: `big_english_3_sb_unit_08_activity_${input.number}_guidance_poc_v1`,
    version: BE3_U08_ACTIVITY_ENRICHMENT_POC_VERSION,
    sourceEvidence: Object.freeze({
      activityId: input.activityId,
      verificationStatus: 'human_verified',
    }),
    text: input.text,
    availability: available ? 'available' : 'withheld_insufficient_evidence',
    withheldReason: available ? null : (input.withheldReason ?? null),
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

/** Optional suggestions: experimental records, never publisher instructions. */
export const BE3_U08_TEACHING_GUIDANCE_SIDECAR = Object.freeze([
  guidanceRecord({
    activityId: 'bep3_sb_act_08_01',
    number: '01',
    text: 'Use the pictures to check meaning before the audio, then pause for whole-class repetition of the questions.',
  }),
  guidanceRecord({
    activityId: 'bep3_sb_act_08_02',
    number: '02',
    text: 'Play Audio 150 once for finding, then again with pauses so students can say each item.',
  }),
  guidanceRecord({
    activityId: 'bep3_sb_act_08_03',
    number: '03',
    text: null,
    withheldReason: 'The verified publisher evidence does not describe the game procedure, so this POC does not invent one.',
  }),
  guidanceRecord({
    activityId: 'bep3_sb_act_08_04',
    number: '04',
    text: 'Ask students to listen first for Zach’s feeling, check the answer, then replay the audio for singing.',
  }),
  guidanceRecord({
    activityId: 'bep3_sb_act_08_05',
    number: '05',
    text: 'Model one exchange, then let pairs take turns choosing a picture and asking and answering the question.',
  }),
] satisfies readonly Be3U08TeachingGuidanceSidecarRecord[])

const summaryByActivityId = new Map(
  BE3_U08_ACTIVITY_SUMMARY_SIDECAR.map((record) => [
    record.sourceEvidence.activityId,
    record,
  ]),
)

const guidanceByActivityId = new Map(
  BE3_U08_TEACHING_GUIDANCE_SIDECAR.map((record) => [
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

export function getBe3U08TeachingGuidance(
  activityId: string,
): Be3U08TeachingGuidanceSidecarRecord | null {
  return isBe3U08ActivityId(activityId)
    ? (guidanceByActivityId.get(activityId) ?? null)
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
