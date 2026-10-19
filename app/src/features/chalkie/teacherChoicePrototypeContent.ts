/** Prototype lesson context for the teacher-choice flow micro-step (BE2 Unit 8). */

export type TeacherChoiceLanguageExample = {
  label?: string
  example: string
}

export type TeacherChoiceLessonContext = {
  bookLabel: string
  unitLine: string
  currentFocus: string
  vocabulary: string[]
  languageExamples: TeacherChoiceLanguageExample[]
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

const BE2_U08_LANGUAGE: TeacherChoiceLanguageExample[] = [
  { label: 'Preference', example: 'Do you like cheetahs? Yes, I do!' },
  { label: 'Ability statement', example: 'Cheetahs can run.' },
  { label: 'Ability question', example: 'Can a kangaroo jump? Yes, it can.' },
]

const BE2_U08_CLARIFICATION =
  'can / can’t is current Unit 8 learning, not prior learning to reuse.'

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
      currentFocus: 'Speak about wild animals using preference and ability language.',
      vocabulary: [...BE2_U08_VOCABULARY],
      languageExamples: BE2_U08_LANGUAGE,
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
    languageExamples: (input.languagePreview ?? []).slice(0, 3).map((example) => ({ example })),
    clarification: null,
    isPrototypeCase: false,
  }
}
