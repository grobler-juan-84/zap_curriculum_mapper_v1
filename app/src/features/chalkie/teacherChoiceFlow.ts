/**
 * Teacher-choice overlay step model (3 screens after merging prior-learning
 * selection with custom-language entry).
 */

export const TEACHER_CHOICE_TOTAL_STEPS = 3

export type TeacherAddedLanguage = {
  id: string
  frame: string
  note: string
}

export function teacherChoiceStepName(step: number): string {
  if (step === 1) return 'Current lesson'
  if (step === 2) return 'Prior learning'
  return 'Lesson inputs'
}

export function advanceTeacherChoiceStep(step: number): number {
  if (step >= TEACHER_CHOICE_TOTAL_STEPS) return TEACHER_CHOICE_TOTAL_STEPS
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
  frame: string,
  note: string,
  idFactory: () => string = () =>
    `teacher-added-${Date.now()}-${existing.length + 1}`,
): TeacherAddedLanguage[] | null {
  const trimmedFrame = frame.trim()
  if (!trimmedFrame) return null
  return [
    ...existing,
    {
      id: idFactory(),
      frame: trimmedFrame,
      note: note.trim(),
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
    return 'No prior learning selected'
  }
  const selectedPart = `${selectedCount} selected`
  if (teacherAddedCount === 0) return selectedPart
  return `${selectedPart} · ${teacherAddedCount} teacher-added`
}

/** Step titles that must not appear after the merge. */
export const REMOVED_TEACHER_CHOICE_SCREEN_TITLE = 'What do you choose?'
