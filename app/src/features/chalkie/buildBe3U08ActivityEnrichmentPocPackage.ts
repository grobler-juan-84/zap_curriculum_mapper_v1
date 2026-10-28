/**
 * Lesson-specific selection projection for the bounded BE3 U8 enrichment POC.
 *
 * This is intentionally separate from the persistent sidecar records and from
 * every production package/generation route. Pure functions return new values;
 * they never mutate source cards, publisher evidence or summaries.
 *
 * One experimental package holds Student Book and Workbook selections separately.
 * Optional teaching guidance is not part of the active POC projection.
 */
import {
  BE3_U08_ACTIVITY_IDS,
  BE3_U08_ACTIVITY_ENRICHMENT_POC_VERSION,
  BE3_U08_OPENER_SB_WB_RELATIONSHIP_ID,
  BE3_U08_WB_ACTIVITY_IDS,
  getBe3U08ActivitySummary,
  getBe3U08WbActivitySummary,
  isBe3U08ActivityId,
  isBe3U08WbActivityId,
  type Be3U08ActivityId,
  type Be3U08WbActivityId,
} from './be3U08ActivityEnrichmentPoc'
import type {
  SbActivityCard,
  SbActivitySelectionState,
} from './chalkieActivitySelection'
import type {
  WbActivityCard,
  WbActivitySelectionState,
} from './chalkieWorkbookActivitySelection'
import type { VerifiedSbWbCompanion } from './resolveVerifiedSbWbCompanion'

type ExperimentalPackageActivity<
  TSource extends 'SB' | 'WB',
  TActivityId extends string,
> = {
  readonly selection: {
    readonly source: TSource
    readonly activityId: TActivityId
    readonly includeActivity: true
  }
  readonly publisherEvidenceReference: {
    readonly source: TSource
    readonly activityId: TActivityId
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
}

export type Be3U08ActivityEnrichmentPocPackage = {
  readonly packageType: 'experimental_neutral_lesson_package'
  readonly experiment: typeof BE3_U08_ACTIVITY_ENRICHMENT_POC_VERSION
  readonly scope: {
    readonly studentBook: {
      readonly catalogBookId: 'big_english_3_sb'
      readonly unitId: 'big_english_3_sb_unit_08'
      readonly printedPages: readonly [128, 129]
    }
    readonly workbook: {
      readonly catalogBookId: 'big_english_3_wb'
      readonly relationshipId: typeof BE3_U08_OPENER_SB_WB_RELATIONSHIP_ID
      readonly printedPages: readonly [104, 105]
    } | null
  }
  readonly studentBookActivities: readonly ExperimentalPackageActivity<
    'SB',
    Be3U08ActivityId
  >[]
  readonly workbookActivities: readonly ExperimentalPackageActivity<
    'WB',
    Be3U08WbActivityId
  >[]
}

const expectedSbActivityPages = new Map<Be3U08ActivityId, number>([
  ['bep3_sb_act_08_01', 128],
  ['bep3_sb_act_08_02', 128],
  ['bep3_sb_act_08_03', 128],
  ['bep3_sb_act_08_04', 129],
  ['bep3_sb_act_08_05', 129],
])

const expectedWbActivityPages = new Map<Be3U08WbActivityId, number>([
  ['bep_3_wb_act_104_1', 104],
  ['bep_3_wb_act_104_2', 104],
  ['bep_3_wb_act_105_3', 105],
  ['bep_3_wb_act_105_4', 105],
])

function pagesMatchExact(
  actual: readonly number[] | undefined,
  expected: readonly number[],
): boolean {
  if (!actual || actual.length !== expected.length) return false
  const sortedActual = [...actual].sort((a, b) => a - b)
  const sortedExpected = [...expected].sort((a, b) => a - b)
  return sortedExpected.every((page, index) => sortedActual[index] === page)
}

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
      card.printedPage !== expectedSbActivityPages.get(activityId)
    ) {
      return false
    }
    seen.add(activityId)
  }

  return BE3_U08_ACTIVITY_IDS.every((activityId) => seen.has(activityId))
}

export function isExactBe3U08WorkbookEnrichmentPocScope(input: {
  readonly cards: readonly WbActivityCard[]
  readonly companion: VerifiedSbWbCompanion | null
}): boolean {
  const companion = input.companion
  if (
    !companion ||
    companion.relationshipId !== BE3_U08_OPENER_SB_WB_RELATIONSHIP_ID ||
    companion.workbookCatalogId !== 'big_english_3_wb' ||
    !pagesMatchExact(companion.workbookPrintedPages, [104, 105]) ||
    !pagesMatchExact(companion.studentBookPrintedPages, [128, 129])
  ) {
    return false
  }

  if (input.cards.length !== BE3_U08_WB_ACTIVITY_IDS.length) return false

  const seen = new Set<string>()
  for (const card of input.cards) {
    const activityId = card.references[0]?.activityId
    if (
      !activityId ||
      !isBe3U08WbActivityId(activityId) ||
      seen.has(activityId) ||
      card.source !== 'WB' ||
      card.references[0]?.verificationStatus !== 'human_verified' ||
      card.printedPage !== expectedWbActivityPages.get(activityId)
    ) {
      return false
    }
    seen.add(activityId)
  }

  return BE3_U08_WB_ACTIVITY_IDS.every((activityId) => seen.has(activityId))
}

function projectStudentBookActivities(input: {
  readonly cards: readonly SbActivityCard[]
  readonly activitySelection: SbActivitySelectionState
}): Be3U08ActivityEnrichmentPocPackage['studentBookActivities'] {
  const selectedCardIds = new Set(input.activitySelection.selectedCardIds)

  return input.cards.flatMap((card) => {
    const activityId = card.references.activityId
    if (!selectedCardIds.has(card.id) || !isBe3U08ActivityId(activityId)) return []

    const summary = getBe3U08ActivitySummary(activityId)
    if (!summary) return []

    return [
      {
        selection: {
          source: 'SB' as const,
          activityId,
          includeActivity: true as const,
        },
        publisherEvidenceReference: {
          source: 'SB' as const,
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
}

function projectWorkbookActivities(input: {
  readonly cards: readonly WbActivityCard[]
  readonly activitySelection: WbActivitySelectionState
}): Be3U08ActivityEnrichmentPocPackage['workbookActivities'] {
  const selectedCardIds = new Set(input.activitySelection.selectedCardIds)

  return input.cards.flatMap((card) => {
    const activityId = card.references[0]?.activityId
    if (
      !selectedCardIds.has(card.id) ||
      !activityId ||
      !isBe3U08WbActivityId(activityId)
    ) {
      return []
    }

    const summary = getBe3U08WbActivitySummary(activityId)
    if (!summary) return []

    return [
      {
        selection: {
          source: 'WB' as const,
          activityId,
          includeActivity: true as const,
        },
        publisherEvidenceReference: {
          source: 'WB' as const,
          activityId,
          cardId: card.id,
          pageId: card.pageId,
          printedPage: card.printedPage,
          verificationStatus: 'human_verified' as const,
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
}

export function buildBe3U08ActivityEnrichmentPocPackage(input: {
  readonly cards: readonly SbActivityCard[]
  readonly activitySelection: SbActivitySelectionState
  readonly workbookCards?: readonly WbActivityCard[]
  readonly workbookActivitySelection?: WbActivitySelectionState
  readonly workbookCompanion?: VerifiedSbWbCompanion | null
}): Be3U08ActivityEnrichmentPocPackage | null {
  if (!isExactBe3U08ActivityEnrichmentPocScope(input.cards)) return null

  const workbookEligible = isExactBe3U08WorkbookEnrichmentPocScope({
    cards: input.workbookCards ?? [],
    companion: input.workbookCompanion ?? null,
  })

  return {
    packageType: 'experimental_neutral_lesson_package',
    experiment: BE3_U08_ACTIVITY_ENRICHMENT_POC_VERSION,
    scope: {
      studentBook: {
        catalogBookId: 'big_english_3_sb',
        unitId: 'big_english_3_sb_unit_08',
        printedPages: [128, 129],
      },
      workbook: workbookEligible
        ? {
            catalogBookId: 'big_english_3_wb',
            relationshipId: BE3_U08_OPENER_SB_WB_RELATIONSHIP_ID,
            printedPages: [104, 105],
          }
        : null,
    },
    studentBookActivities: projectStudentBookActivities({
      cards: input.cards,
      activitySelection: input.activitySelection,
    }),
    workbookActivities: workbookEligible
      ? projectWorkbookActivities({
          cards: input.workbookCards ?? [],
          activitySelection:
            input.workbookActivitySelection ?? { selectedCardIds: [] },
        })
      : [],
  }
}
