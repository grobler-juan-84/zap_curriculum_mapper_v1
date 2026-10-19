/** Temporary BE2 Unit 8 · pp. 128–129 fixture for the teacher-choice prototype route. */

export type TeacherChoiceLanguageExample = {
  label?: string
  example: string
}

/** @deprecated Prefer ChalkieLessonContext from resolveChalkieLessonContext. */
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

export const BE2_U08_PROTOTYPE_PAGES = [128, 129] as const

export const BE2_U08_VOCABULARY = [
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

export const BE2_U08_LANGUAGE: TeacherChoiceLanguageExample[] = [
  { label: 'Preference', example: 'Do you like cheetahs? Yes, I do!' },
  { label: 'Ability statement', example: 'Cheetahs can run.' },
]

export const BE2_U08_CLARIFICATION =
  'can / can’t is current Unit 8 learning, not prior learning to reuse.'

export const BE2_U08_PROTOTYPE_FOCUS =
  'Speak about wild animals using preference and ability language.'

export const BE2_U08_PROTOTYPE_PAGE_LABELS = [
  'p. 128: Unit 8: Wild Animals',
  'p. 129: Song / vocabulary: To the Zoo!',
] as const

export const BE2_U08_PROTOTYPE_ACTIVITIES = [
  'p. 128: Listen, look, and say. / Listen, find, and say. / Play a game.',
  'p. 129: Listen and sing. Then look at 1 and find. / Listen and say true or false. / Look at 1. Ask and answer.',
] as const

export const BE2_U08_SINGLE_LESSON_TITLE =
  'Big English 2 Student Book · Unit 8 · pp. 128–129 · Wild Animals'

export const BE2_U08_SERIES_LESSON_TITLE =
  'Big English 2 · Unit 8 · SB pp. 128–129 + WB pp. 104–105 · Wild Animals'

function normalizeCatalogId(value: string | null | undefined): string | null {
  if (typeof value !== 'string') return null
  const normalized = value.trim().toLowerCase()
  return normalized || null
}

export function isBe2StudentBook(input: {
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

export function isBe2U08PrototypePages(pages: number[]): boolean {
  if (pages.length !== BE2_U08_PROTOTYPE_PAGES.length) return false
  const sorted = [...pages].sort((a, b) => a - b)
  return (
    sorted[0] === BE2_U08_PROTOTYPE_PAGES[0] && sorted[1] === BE2_U08_PROTOTYPE_PAGES[1]
  )
}
