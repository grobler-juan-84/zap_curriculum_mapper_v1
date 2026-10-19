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

const BE2_U08_CATALOG_ID = 'big_english_2_sb'
const BE2_U08_BOOK_TITLE = 'big english 2 student book'

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
]

const BE2_U08_CLARIFICATION =
  'can / can’t is current Unit 8 learning, not prior learning to reuse.'

function normalizeCatalogId(value: string | null | undefined): string | null {
  if (typeof value !== 'string') return null
  const normalized = value.trim().toLowerCase()
  return normalized || null
}

function isUnitEight(unitNumber: number | string | null | undefined): boolean {
  if (unitNumber == null || unitNumber === '') return false
  return Number(unitNumber) === 8
}

function isBe2StudentBook(input: {
  catalogBookId?: string | null
  summaryCatalogBookId?: string | null
  bookTitle: string
}): boolean {
  const candidateCatalogIds = [input.catalogBookId, input.summaryCatalogBookId]
    .map(normalizeCatalogId)
    .filter((value): value is string => Boolean(value))

  if (candidateCatalogIds.includes(BE2_U08_CATALOG_ID)) return true

  // Narrow title fallback only when catalog IDs are absent or inconsistent.
  return input.bookTitle.trim().toLowerCase() === BE2_U08_BOOK_TITLE
}

export function buildTeacherChoiceLessonContext(input: {
  bookTitle: string
  catalogBookId?: string | null
  summaryCatalogBookId?: string | null
  unitNumber?: number | string | null
  unitTitle?: string | null
  unitTheme?: string | null
  vocabularyPreview?: string[]
  languagePreview?: string[]
}): TeacherChoiceLessonContext {
  const unitNumber = input.unitNumber ?? null
  const isBe2U08 = isBe2StudentBook(input) && isUnitEight(unitNumber)

  if (isBe2U08) {
    const title = input.unitTitle?.trim()
    const unitLine =
      title && !title.includes('·') && title.length <= 40
        ? `Unit 8 · ${title}`
        : 'Unit 8 · Wild Animals'
    return {
      bookLabel: 'Big English 2',
      unitLine,
      currentFocus: 'Speak about wild animals using preference and ability language.',
      vocabulary: [...BE2_U08_VOCABULARY],
      languageExamples: BE2_U08_LANGUAGE,
      clarification: BE2_U08_CLARIFICATION,
      isPrototypeCase: true,
    }
  }

  const unitLabel =
    unitNumber != null && unitNumber !== ''
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
