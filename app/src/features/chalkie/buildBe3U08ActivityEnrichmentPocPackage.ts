/**
 * Lesson-specific selection projection for the bounded BE3 U8 enrichment POC.
 *
 * This is intentionally separate from the persistent sidecar records and from
 * every production package/generation route. Pure functions return new values;
 * they never mutate source cards, publisher evidence or summaries.
 *
 * Optional teaching guidance is not part of the active POC projection.
 */
import {
  BE3_U08_ACTIVITY_IDS,
  BE3_U08_ACTIVITY_ENRICHMENT_POC_VERSION,
  getBe3U08ActivitySummary,
  isBe3U08ActivityId,
  type Be3U08ActivityId,
} from './be3U08ActivityEnrichmentPoc'
import type {
  SbActivityCard,
  SbActivitySelectionState,
} from './chalkieActivitySelection'

export type Be3U08ActivityEnrichmentPocPackage = {
  readonly packageType: 'experimental_neutral_lesson_package'
  readonly experiment: typeof BE3_U08_ACTIVITY_ENRICHMENT_POC_VERSION
  readonly scope: {
    readonly catalogBookId: 'big_english_3_sb'
    readonly unitId: 'big_english_3_sb_unit_08'
    readonly studentBookPrintedPages: readonly [128, 129]
  }
  readonly activities: readonly {
    readonly selection: {
      readonly activityId: Be3U08ActivityId
      readonly includeActivity: true
    }
    readonly publisherEvidenceReference: {
      readonly activityId: Be3U08ActivityId
      readonly cardId: string
      readonly pageId: string
      readonly printedPage: number
      readonly verificationStatus: 'human_verified'
    }
    readonly summary: {
      readonly recordId: string
      readonly text: string
      readonly evidenceSufficiency: 'sufficient' | 'insufficient'
      readonly reviewStatus: 'experimental_review_required'
    }
  }[]
}

const expectedActivityPages = new Map<Be3U08ActivityId, number>([
  ['bep3_sb_act_08_01', 128],
  ['bep3_sb_act_08_02', 128],
  ['bep3_sb_act_08_03', 128],
  ['bep3_sb_act_08_04', 129],
  ['bep3_sb_act_08_05', 129],
])

export function isExactBe3U08ActivityEnrichmentPocScope(
  cards: readonly SbActivityCard[],
): boolean {
  if (cards.length !== BE3_U08_ACTIVITY_IDS.length) return false

  const seen = new Set<string>()
  for (const card of cards) {
    const activityId = card.references.activityId
    if (
      !isBe3U08ActivityId(activityId) ||
      seen.has(activityId) ||
      card.references.bookId !== 'big_english_3_sb' ||
      card.references.unitId !== 'big_english_3_sb_unit_08' ||
      card.references.verificationStatus !== 'human_verified' ||
      card.printedPage !== expectedActivityPages.get(activityId)
    ) {
      return false
    }
    seen.add(activityId)
  }

  return BE3_U08_ACTIVITY_IDS.every((activityId) => seen.has(activityId))
}

export function buildBe3U08ActivityEnrichmentPocPackage(input: {
  readonly cards: readonly SbActivityCard[]
  readonly activitySelection: SbActivitySelectionState
}): Be3U08ActivityEnrichmentPocPackage | null {
  if (!isExactBe3U08ActivityEnrichmentPocScope(input.cards)) return null

  const selectedCardIds = new Set(input.activitySelection.selectedCardIds)

  const activities = input.cards.flatMap((card) => {
    const activityId = card.references.activityId
    if (!selectedCardIds.has(card.id) || !isBe3U08ActivityId(activityId)) return []

    const summary = getBe3U08ActivitySummary(activityId)
    if (!summary) return []

    return [
      {
        selection: {
          activityId,
          includeActivity: true as const,
        },
        publisherEvidenceReference: {
          activityId,
          cardId: card.id,
          pageId: card.references.pageId,
          printedPage: card.printedPage,
          verificationStatus: card.references.verificationStatus,
        },
        summary: {
          recordId: summary.recordId,
          text: summary.text,
          evidenceSufficiency: summary.evidenceSufficiency,
          reviewStatus: summary.reviewStatus,
        },
      },
    ]
  })

  return {
    packageType: 'experimental_neutral_lesson_package',
    experiment: BE3_U08_ACTIVITY_ENRICHMENT_POC_VERSION,
    scope: {
      catalogBookId: 'big_english_3_sb',
      unitId: 'big_english_3_sb_unit_08',
      studentBookPrintedPages: [128, 129],
    },
    activities,
  }
}
