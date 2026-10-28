/**
 * Lesson-specific selection projection for the bounded BE3 U8 enrichment POC.
 *
 * This is intentionally separate from the persistent sidecar records and from
 * every production package/generation route. Pure functions return new values;
 * they never mutate source cards, publisher evidence, summaries or guidance.
 */
import {
  BE3_U08_ACTIVITY_IDS,
  BE3_U08_ACTIVITY_ENRICHMENT_POC_VERSION,
  getBe3U08ActivitySummary,
  getBe3U08TeachingGuidance,
  isBe3U08ActivityId,
  type Be3U08ActivityId,
} from './be3U08ActivityEnrichmentPoc'
import type {
  SbActivityCard,
  SbActivitySelectionState,
} from './chalkieActivitySelection'

export type Be3U08GuidanceSelectionState = {
  /** Guidance is opt-in. Activity IDs are used because sidecars reference evidence IDs. */
  readonly selectedGuidanceActivityIds: readonly Be3U08ActivityId[]
}

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
      readonly includeGuidance: boolean
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
    readonly guidance: {
      readonly recordId: string
      readonly text: string
      readonly reviewStatus: 'experimental_review_required'
    } | null
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

export function createDefaultBe3U08GuidanceSelection(): Be3U08GuidanceSelectionState {
  return { selectedGuidanceActivityIds: [] }
}

export function reconcileBe3U08GuidanceSelection(input: {
  readonly cards: readonly SbActivityCard[]
  readonly activitySelection: SbActivitySelectionState
  readonly guidanceSelection: Be3U08GuidanceSelectionState
}): Be3U08GuidanceSelectionState {
  if (!isExactBe3U08ActivityEnrichmentPocScope(input.cards)) {
    return createDefaultBe3U08GuidanceSelection()
  }

  const selectedCardIds = new Set(input.activitySelection.selectedCardIds)
  const eligibleActivityIds = new Set(
    input.cards
      .filter((card) => selectedCardIds.has(card.id))
      .map((card) => card.references.activityId)
      .filter((activityId): activityId is Be3U08ActivityId => {
        const guidance = getBe3U08TeachingGuidance(activityId)
        return guidance?.availability === 'available'
      }),
  )

  return {
    selectedGuidanceActivityIds: BE3_U08_ACTIVITY_IDS.filter(
      (activityId) =>
        input.guidanceSelection.selectedGuidanceActivityIds.includes(activityId) &&
        eligibleActivityIds.has(activityId),
    ),
  }
}

export function setBe3U08GuidanceSelected(input: {
  readonly cards: readonly SbActivityCard[]
  readonly activitySelection: SbActivitySelectionState
  readonly guidanceSelection: Be3U08GuidanceSelectionState
  readonly activityId: string
  readonly selected: boolean
}): Be3U08GuidanceSelectionState {
  const normalized = reconcileBe3U08GuidanceSelection(input)
  if (!isBe3U08ActivityId(input.activityId)) return normalized

  const card = input.cards.find(
    (candidate) => candidate.references.activityId === input.activityId,
  )
  const guidance = getBe3U08TeachingGuidance(input.activityId)
  const activitySelected =
    card != null && input.activitySelection.selectedCardIds.includes(card.id)
  if (!activitySelected || guidance?.availability !== 'available') return normalized

  const selectedIds = new Set(normalized.selectedGuidanceActivityIds)
  if (input.selected) selectedIds.add(input.activityId)
  else selectedIds.delete(input.activityId)

  return {
    selectedGuidanceActivityIds: BE3_U08_ACTIVITY_IDS.filter((activityId) =>
      selectedIds.has(activityId),
    ),
  }
}

export function buildBe3U08ActivityEnrichmentPocPackage(input: {
  readonly cards: readonly SbActivityCard[]
  readonly activitySelection: SbActivitySelectionState
  readonly guidanceSelection: Be3U08GuidanceSelectionState
}): Be3U08ActivityEnrichmentPocPackage | null {
  if (!isExactBe3U08ActivityEnrichmentPocScope(input.cards)) return null

  const guidanceSelection = reconcileBe3U08GuidanceSelection(input)
  const selectedCardIds = new Set(input.activitySelection.selectedCardIds)
  const selectedGuidanceIds = new Set(
    guidanceSelection.selectedGuidanceActivityIds,
  )

  const activities = input.cards.flatMap((card) => {
    const activityId = card.references.activityId
    if (!selectedCardIds.has(card.id) || !isBe3U08ActivityId(activityId)) return []

    const summary = getBe3U08ActivitySummary(activityId)
    const guidance = getBe3U08TeachingGuidance(activityId)
    if (!summary || !guidance) return []

    const includeGuidance =
      selectedGuidanceIds.has(activityId) &&
      guidance.availability === 'available' &&
      guidance.text !== null

    return [
      {
        selection: {
          activityId,
          includeActivity: true as const,
          includeGuidance,
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
        guidance: includeGuidance
          ? {
              recordId: guidance.recordId,
              text: guidance.text,
              reviewStatus: guidance.reviewStatus,
            }
          : null,
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
