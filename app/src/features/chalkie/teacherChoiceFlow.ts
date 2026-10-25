/**
 * Teacher-choice overlay step model.
 *
 * Full path (verified Workbook activities available): 5 screens —
 * Review SB selection → Review WB selection → Prior skills → Neutral review →
 * Choose output.
 * When no verified Workbook companion/activity set exists, the Workbook
 * screen is omitted and progress renumbers to 4 steps.
 *
 * Activity selection is owned by the left-panel current-lesson surface; the
 * first screens confirm/adjust that shared selection rather than restarting it.
 *
 * Chalkie packaging (single / two-lesson) is not a numbered step; it opens
 * only after the teacher chooses the Chalkie output.
 */

export type TeacherChoiceStepId =
  | 'student_book'
  | 'workbook'
  | 'prior_skills'
  | 'neutral_review'
  | 'choose_output'

/** Maximum numbered screens when a verified Workbook step is included. */
export const TEACHER_CHOICE_MAX_STEPS = 5

/** Numbered screens when the Workbook step is skipped. */
export const TEACHER_CHOICE_STEPS_WITHOUT_WORKBOOK = 4

/**
 * @deprecated Prefer `teacherChoiceTotalSteps(includeWorkbook)`.
 * Kept as the full-path maximum for call sites that only need an upper bound.
 */
export const TEACHER_CHOICE_TOTAL_STEPS = TEACHER_CHOICE_MAX_STEPS

export type TeacherAddedLanguage = {
  id: string
  title: string
  frame: string
  purpose: string
}

export function includeTeacherChoiceWorkbookStep(input: {
  hasVerifiedWorkbookCompanion: boolean
  workbookActivityCardCount: number
}): boolean {
  return (
    input.hasVerifiedWorkbookCompanion && input.workbookActivityCardCount > 0
  )
}

export function buildTeacherChoiceSteps(
  includeWorkbook: boolean,
): readonly TeacherChoiceStepId[] {
  if (includeWorkbook) {
    return [
      'student_book',
      'workbook',
      'prior_skills',
      'neutral_review',
      'choose_output',
    ] as const
  }
  return [
    'student_book',
    'prior_skills',
    'neutral_review',
    'choose_output',
  ] as const
}

export function teacherChoiceTotalSteps(includeWorkbook: boolean): number {
  return buildTeacherChoiceSteps(includeWorkbook).length
}

export function teacherChoiceStepIndex(
  stepId: TeacherChoiceStepId,
  includeWorkbook: boolean,
): number {
  const steps = buildTeacherChoiceSteps(includeWorkbook)
  const index = steps.indexOf(stepId)
  if (index >= 0) return index + 1
  // Workbook omitted while state still names it — treat as Student Book.
  if (stepId === 'workbook') return 1
  return 1
}

export function teacherChoiceStepIdAt(
  step: number,
  includeWorkbook: boolean,
): TeacherChoiceStepId {
  const steps = buildTeacherChoiceSteps(includeWorkbook)
  const index = Math.min(Math.max(step, 1), steps.length) - 1
  return steps[index] ?? 'student_book'
}

export function teacherChoiceStepName(
  stepOrId: number | TeacherChoiceStepId,
  includeWorkbook = true,
): string {
  const id =
    typeof stepOrId === 'string'
      ? stepOrId
      : teacherChoiceStepIdAt(stepOrId, includeWorkbook)
  if (id === 'student_book') return 'Review Student Book selection'
  if (id === 'workbook') return 'Review Workbook selection'
  if (id === 'prior_skills') return 'Prior skills'
  if (id === 'neutral_review') return 'Review lesson package'
  return 'Choose output'
}

export function advanceTeacherChoiceStepId(
  stepId: TeacherChoiceStepId,
  includeWorkbook: boolean,
): TeacherChoiceStepId {
  const steps = buildTeacherChoiceSteps(includeWorkbook)
  const index = steps.indexOf(stepId)
  if (index < 0) {
    return steps[0] ?? 'student_book'
  }
  if (index >= steps.length - 1) return steps[steps.length - 1] ?? stepId
  return steps[index + 1] ?? stepId
}

export function retreatTeacherChoiceStepId(
  stepId: TeacherChoiceStepId,
  includeWorkbook: boolean,
): TeacherChoiceStepId {
  const steps = buildTeacherChoiceSteps(includeWorkbook)
  const index = steps.indexOf(stepId)
  if (index <= 0) return steps[0] ?? 'student_book'
  return steps[index - 1] ?? stepId
}

/** Numeric helpers retained for tests and simple callers. */
export function advanceTeacherChoiceStep(
  step: number,
  totalSteps: number = TEACHER_CHOICE_MAX_STEPS,
): number {
  if (step >= totalSteps) return totalSteps
  return step + 1
}

export function retreatTeacherChoiceStep(step: number): number {
  if (step <= 1) return 1
  return step - 1
}

export function toggleSelectedSuggestionId(
  selectedIds: string[],
  id: string,
): string[] {
  return selectedIds.includes(id)
    ? selectedIds.filter((item) => item !== id)
    : [...selectedIds, id]
}

export function appendTeacherAddedLanguage(
  existing: TeacherAddedLanguage[],
  title: string,
  frame: string,
  purpose: string,
  idFactory: () => string = () =>
    `teacher-added-${Date.now()}-${existing.length + 1}`,
): TeacherAddedLanguage[] | null {
  const trimmedTitle = title.trim()
  const trimmedFrame = frame.trim()
  const trimmedPurpose = purpose.trim()
  if (!trimmedTitle || !trimmedFrame || !trimmedPurpose) return null
  return [
    ...existing,
    {
      id: idFactory(),
      title: trimmedTitle,
      frame: trimmedFrame,
      purpose: trimmedPurpose,
    },
  ]
}

export function clearPriorLearningSelections(): {
  selectedIds: string[]
  teacherAdditions: TeacherAddedLanguage[]
} {
  return { selectedIds: [], teacherAdditions: [] }
}

export function footerSelectionSummary(
  selectedCount: number,
  teacherAddedCount: number,
): string {
  if (selectedCount === 0 && teacherAddedCount === 0) {
    return ''
  }
  const selectedPart = `${selectedCount} selected`
  if (teacherAddedCount === 0) return selectedPart
  return `${selectedPart} · ${teacherAddedCount} teacher-added`
}

/** Step titles that must not appear after the merge. */
export const REMOVED_TEACHER_CHOICE_SCREEN_TITLE = 'What do you choose?'
