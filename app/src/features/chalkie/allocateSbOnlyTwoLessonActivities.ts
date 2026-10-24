/**
 * Stable Lesson 1 → Lesson 2 split of selected Student Book activities.
 *
 * Used for generic SB-only two-lesson packaging. Does not invent Workbook
 * content or change activity evidence — only allocates already-selected items.
 */
import type { SelectedSbActivityEvidence } from './chalkieActivitySelection'

export type SbOnlyTwoLessonAllocation = {
  readonly lesson1: readonly SelectedSbActivityEvidence[]
  readonly lesson2: readonly SelectedSbActivityEvidence[]
}

function activitySortKey(activityNumber: string | null): number {
  if (activityNumber == null || !activityNumber.trim()) {
    return Number.POSITIVE_INFINITY
  }
  const parsed = Number(activityNumber.trim())
  return Number.isFinite(parsed) ? parsed : Number.POSITIVE_INFINITY
}

/** Stable page → activity-number → cardId order. */
export function sortSelectedSbActivitiesForTwoLessons(
  evidence: readonly SelectedSbActivityEvidence[],
): SelectedSbActivityEvidence[] {
  return [...evidence].sort((left, right) => {
    if (left.printedPage !== right.printedPage) {
      return left.printedPage - right.printedPage
    }
    const leftNumber = activitySortKey(left.activityNumber)
    const rightNumber = activitySortKey(right.activityNumber)
    if (leftNumber !== rightNumber) return leftNumber - rightNumber
    return left.cardId.localeCompare(right.cardId)
  })
}

/**
 * Split ordered selected activities into Lesson 1 then Lesson 2.
 * Odd counts give the extra activity to Lesson 1.
 */
export function allocateSbOnlyTwoLessonActivities(
  selectedEvidence: readonly SelectedSbActivityEvidence[],
): SbOnlyTwoLessonAllocation {
  const ordered = sortSelectedSbActivitiesForTwoLessons(selectedEvidence)
  if (ordered.length === 0) {
    return { lesson1: [], lesson2: [] }
  }
  const splitAt = Math.ceil(ordered.length / 2)
  return {
    lesson1: ordered.slice(0, splitAt),
    lesson2: ordered.slice(splitAt),
  }
}

export function formatSbOnlyLessonActivityScope(
  activities: readonly SelectedSbActivityEvidence[],
): string {
  if (activities.length === 0) {
    return 'No selected Student Book activities allocated'
  }
  return activities
    .map((activity) => {
      const number = activity.activityNumber
        ? `Activity ${activity.activityNumber}`
        : 'Activity'
      return `p.${activity.printedPage} ${number}`
    })
    .join(' · ')
}
