/**
 * Experimental BE3 Unit 8 activity-enrichment sidecars (historical Opener POC).
 *
 * Create-a-prompt modal cards use Neutral Lesson Library preferred summaries
 * exclusively via `nllActivitySummaries.ts` (`VITE_CHALKIE_NLL_ACTIVITY_SUMMARIES`).
 * This module retains static Opener POC summary fixtures, package helpers, and
 * Stage 3 comparison fixtures for historical tests only — not a modal runtime
 * fallback and not wired through `TeacherChoiceFlowOverlay`.
 *
 * Records below reference, but never rewrite:
 * - five human-verified SB activities on pp. 128-129
 * - four human-verified WB companion activities on pp. 104-105
 *   (relationship be3_sb_wb_rel_u08_opener_sb128-129_wb104-105)
 *
 * Optional teaching guidance remains parked (F025). Do not reintroduce it here.
 */

export const BE3_U08_ACTIVITY_ENRICHMENT_POC_ENV =
  'VITE_CHALKIE_BE3_U08_ACTIVITY_ENRICHMENT_POC'

export const BE3_U08_ACTIVITY_ENRICHMENT_POC_VERSION =
  'be3-u08-activity-enrichment-poc-v1'

export const BE3_U08_OPENER_SB_WB_RELATIONSHIP_ID =
  'be3_sb_wb_rel_u08_opener_sb128-129_wb104-105'

export const BE3_U08_ACTIVITY_IDS = [
  'bep3_sb_act_08_01',
  'bep3_sb_act_08_02',
  'bep3_sb_act_08_03',
  'bep3_sb_act_08_04',
  'bep3_sb_act_08_05',
] as const

export const BE3_U08_WB_ACTIVITY_IDS = [
  'bep_3_wb_act_104_1',
  'bep_3_wb_act_104_2',
  'bep_3_wb_act_105_3',
  'bep_3_wb_act_105_4',
] as const

export type Be3U08ActivityId = (typeof BE3_U08_ACTIVITY_IDS)[number]
export type Be3U08WbActivityId = (typeof BE3_U08_WB_ACTIVITY_IDS)[number]

/** Minimal display contract shared by SB and WB experimental summary cards. */
export type Be3U08ExperimentalSummaryDisplay = {
  readonly text: string
  readonly evidenceSufficiency: 'sufficient' | 'insufficient'
}

export type Be3U08ActivitySummarySidecarRecord =
  Be3U08ExperimentalSummaryDisplay & {
    readonly recordType: 'teacher_friendly_summary'
    readonly recordId: string
    readonly version: typeof BE3_U08_ACTIVITY_ENRICHMENT_POC_VERSION
    readonly sourceEvidence: {
      readonly activityId: Be3U08ActivityId
      readonly verificationStatus: 'human_verified'
      readonly source: 'SB'
    }
    readonly reviewStatus: 'experimental_review_required'
    readonly generation: {
      readonly method: 'ai_assisted_draft'
      readonly provider: 'openai'
      readonly model: 'gpt-5'
      readonly promptVersion: typeof BE3_U08_ACTIVITY_ENRICHMENT_POC_VERSION
    }
  }

export type Be3U08WbActivitySummarySidecarRecord =
  Be3U08ExperimentalSummaryDisplay & {
    readonly recordType: 'teacher_friendly_summary'
    readonly recordId: string
    readonly version: typeof BE3_U08_ACTIVITY_ENRICHMENT_POC_VERSION
    readonly sourceEvidence: {
      readonly activityId: Be3U08WbActivityId
      readonly verificationStatus: 'human_verified'
      readonly source: 'WB'
    }
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

function sbSummaryRecord(input: {
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
      verificationStatus: 'human_verified' as const,
      source: 'SB' as const,
    }),
    text: input.text,
    evidenceSufficiency: input.evidenceSufficiency ?? 'sufficient',
    reviewStatus: 'experimental_review_required',
    generation: generationMetadata,
  })
}

function wbSummaryRecord(input: {
  readonly activityId: Be3U08WbActivityId
  readonly page: string
  readonly number: string
  readonly text: string
  readonly evidenceSufficiency?: 'sufficient' | 'insufficient'
}): Be3U08WbActivitySummarySidecarRecord {
  return Object.freeze({
    recordType: 'teacher_friendly_summary',
    recordId: `big_english_3_wb_unit_08_p${input.page}_activity_${input.number}_summary_poc_v1`,
    version: BE3_U08_ACTIVITY_ENRICHMENT_POC_VERSION,
    sourceEvidence: Object.freeze({
      activityId: input.activityId,
      verificationStatus: 'human_verified' as const,
      source: 'WB' as const,
    }),
    text: input.text,
    evidenceSufficiency: input.evidenceSufficiency ?? 'sufficient',
    reviewStatus: 'experimental_review_required',
    generation: generationMetadata,
  })
}

/** Derived SB summaries: experimental records, not publisher evidence. */
export const BE3_U08_ACTIVITY_SUMMARY_SIDECAR = Object.freeze([
  sbSummaryRecord({
    activityId: 'bep3_sb_act_08_01',
    number: '01',
    text: 'Students listen, look at the pictures and say the healthy-living questions about Sally and Zach.',
  }),
  sbSummaryRecord({
    activityId: 'bep3_sb_act_08_02',
    number: '02',
    text: 'Students listen to Audio 150, find the matching content on the page and say it.',
  }),
  sbSummaryRecord({
    activityId: 'bep3_sb_act_08_03',
    number: '03',
    text: 'The verified evidence only says “Play a game.” The game procedure is not available in the activity record.',
    evidenceSufficiency: 'insufficient',
  }),
  sbSummaryRecord({
    activityId: 'bep3_sb_act_08_04',
    number: '04',
    text: 'Students listen and sing, then answer how Zach feels today.',
  }),
  sbSummaryRecord({
    activityId: 'bep3_sb_act_08_05',
    number: '05',
    text: 'Students use the pictures from Activity 1 to ask and answer Did…? questions with short answers.',
  }),
] satisfies readonly Be3U08ActivitySummarySidecarRecord[])

/**
 * Derived WB companion summaries for opener pp.104–105 only.
 * Checked against canonical instructions; do not invent procedures or answers.
 */
export const BE3_U08_WB_ACTIVITY_SUMMARY_SIDECAR = Object.freeze([
  wbSummaryRecord({
    activityId: 'bep_3_wb_act_104_1',
    page: '104',
    number: '1',
    text: 'Students write the activities shown in the pictures using the word box, then check which ones are healthy.',
  }),
  wbSummaryRecord({
    activityId: 'bep_3_wb_act_104_2',
    page: '104',
    number: '2',
    text: 'Students read questions about how they feel and their healthy habits, then circle the answers that are true for them.',
  }),
  wbSummaryRecord({
    activityId: 'bep_3_wb_act_105_3',
    page: '105',
    number: '3',
    text: 'Students listen to the ‘Live Right!’ song and complete six gaps using words from the word box.',
  }),
  wbSummaryRecord({
    activityId: 'bep_3_wb_act_105_4',
    page: '105',
    number: '4',
    text: 'Students read three healthy-habit questions, check their own answers, then respond with Yes, I did or No, I didn’t.',
  }),
] satisfies readonly Be3U08WbActivitySummarySidecarRecord[])

const sbSummaryByActivityId = new Map(
  BE3_U08_ACTIVITY_SUMMARY_SIDECAR.map((record) => [
    record.sourceEvidence.activityId,
    record,
  ]),
)

const wbSummaryByActivityId = new Map(
  BE3_U08_WB_ACTIVITY_SUMMARY_SIDECAR.map((record) => [
    record.sourceEvidence.activityId,
    record,
  ]),
)

export function isBe3U08ActivityId(value: string): value is Be3U08ActivityId {
  return (BE3_U08_ACTIVITY_IDS as readonly string[]).includes(value)
}

export function isBe3U08WbActivityId(value: string): value is Be3U08WbActivityId {
  return (BE3_U08_WB_ACTIVITY_IDS as readonly string[]).includes(value)
}

export function getBe3U08ActivitySummary(
  activityId: string,
): Be3U08ActivitySummarySidecarRecord | null {
  return isBe3U08ActivityId(activityId)
    ? (sbSummaryByActivityId.get(activityId) ?? null)
    : null
}

export function getBe3U08WbActivitySummary(
  activityId: string,
): Be3U08WbActivitySummarySidecarRecord | null {
  return isBe3U08WbActivityId(activityId)
    ? (wbSummaryByActivityId.get(activityId) ?? null)
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
