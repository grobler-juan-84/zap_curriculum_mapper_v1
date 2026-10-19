/** Prototype lesson context for the teacher-choice flow micro-step (BE2 Unit 8). */

export type TeacherChoiceLessonContext = {
  bookLabel: string
  unitLine: string
  currentFocus: string
  vocabulary: string[]
  languageExamples: string[]
  clarification: string | null
  isPrototypeCase: boolean
}

const BE2_U08_VOCABULARY = [
  'cheetah',
  'crocodile',
  'elephant',
  'giraffe',
  'hippo',
  'kangaroo',
  'monkey',
  'parrot',
  'peacock',
  'polar bear',
  'snake',
  'zebra',
] as const

const BE2_U08_LANGUAGE = [
  'Do you like cheetahs? Yes, I do!',
  'Cheetahs can run.',
  'Can a kangaroo jump? Yes, it can.',
] as const

const BE2_U08_CLARIFICATION =
  'Ability language with “can” is current Unit 8 learning. It is not retrieved prior learning.'

export function buildTeacherChoiceLessonContext(input: {
  bookTitle: string
  catalogBookId?: string | null
  unitNumber?: number | null
  unitTitle?: string | null
  unitTheme?: string | null
  vocabularyPreview?: string[]
  languagePreview?: string[]
}): TeacherChoiceLessonContext {
  const unitNumber = input.unitNumber ?? null
  const isBe2U08 =
    input.catalogBookId === 'big_english_2_sb' && unitNumber === 8

  if (isBe2U08) {
    const theme = input.unitTheme?.trim() || input.unitTitle?.trim() || 'Wild Animals'
    return {
      bookLabel: 'Big English 2',
      unitLine: `Unit 8 · ${theme}`,
      currentFocus: 'speaking with animal vocabulary',
      vocabulary: [...BE2_U08_VOCABULARY],
      languageExamples: [...BE2_U08_LANGUAGE],
      clarification: BE2_U08_CLARIFICATION,
      isPrototypeCase: true,
    }
  }

  const unitLabel =
    unitNumber != null
      ? input.unitTitle?.trim()
        ? `Unit ${unitNumber} · ${input.unitTitle.trim()}`
        : `Unit ${unitNumber}`
      : input.unitTitle?.trim() || 'Current unit'

  return {
    bookLabel: input.bookTitle,
    unitLine: unitLabel,
    currentFocus: input.unitTheme?.trim() || 'Review the visible lesson in the source PDF.',
    vocabulary: (input.vocabularyPreview ?? []).slice(0, 12),
    languageExamples: (input.languagePreview ?? []).slice(0, 3),
    clarification: null,
    isPrototypeCase: false,
  }
}
