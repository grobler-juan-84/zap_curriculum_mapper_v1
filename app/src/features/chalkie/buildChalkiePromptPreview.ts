import type { TeacherChoiceSuggestion } from './teacherChoiceSuggestions'

export type TeacherAddedLanguageInput = {
  frame: string
  note: string
}

export type LessonPackageShape = 'single' | 'series'

export const BE2_U08_SINGLE_LESSON_TITLE =
  'Big English 2 Student Book · Unit 8 · pp. 128–129 · Wild Animals'

export const BE2_U08_SERIES_LESSON_TITLE =
  'Big English 2 · Unit 8 · SB pp. 128–129 + WB pp. 104–105 · Wild Animals'

/** Prototype planning allocation — not a publisher lesson division. */
export const BE2_U08_SERIES_LESSON1_VOCAB =
  'giraffe, hippo, kangaroo, cheetah, polar bear, zebra'

/** Prototype planning allocation — not a publisher lesson division. */
export const BE2_U08_SERIES_LESSON2_VOCAB =
  'parrot, monkey, peacock, elephant, crocodile, snake'

function buildPriorLearningBlock(input: {
  selectedSuggestions: TeacherChoiceSuggestion[]
  teacherAdditions: TeacherAddedLanguageInput[]
}): string[] {
  const priorLines: string[] = []

  if (input.selectedSuggestions.length === 0) {
    priorLines.push('No verified prior learning was selected for this lesson.')
  } else {
    for (const suggestion of input.selectedSuggestions) {
      priorLines.push(
        `[HM] ${suggestion.label} (${suggestion.source}): ${suggestion.frame}`,
      )
    }
  }

  if (input.teacherAdditions.length > 0) {
    priorLines.push('')
    for (const addition of input.teacherAdditions) {
      priorLines.push(`[TEACHER-ADDED · UNVERIFIED] ${addition.frame}`)
      if (addition.note.trim()) {
        priorLines.push(`Teacher note: ${addition.note.trim()}`)
      }
    }
  }

  return priorLines
}

function buildSingleLessonPrompt(input: {
  selectedSuggestions: TeacherChoiceSuggestion[]
  teacherAdditions: TeacherAddedLanguageInput[]
}): string {
  const priorLines = buildPriorLearningBlock(input)

  return [
    'Create a short, picture-led slide lesson to SUPPORT Big English 2 Student Book Unit 8, printed pages 128–129 ONLY.',
    '',
    'Do not teach later Unit 8 pages, including habitats, grammar, phonics, culture, values, or review.',
    'Do not replace the textbook.',
    'Do not invent publisher audio scripts or missing true/false item text.',
    'Use the book/audio where needed.',
    '',
    'SOURCE LABELS:',
    '- [SB] = Student Book evidence from pages 128–129 only',
    '- [HM] = teacher-selected prior learning from earlier units in the same book',
    '- [TEACHER-ADDED · UNVERIFIED] = teacher-directed language not currently verified as prior-book evidence',
    '',
    'A. CURRENT PAGE EVIDENCE',
    '',
    '[SB p.128] Unit 8: Wild Animals',
    '[SB p.128] Target vocabulary: cheetah, crocodile, elephant, giraffe, hippo, kangaroo, monkey, parrot, peacock, polar bear, snake, zebra.',
    '[SB p.128] Activities: Listen, look, and say. / Listen, find, and say. / Play a game.',
    '',
    '[SB p.129] Song / vocabulary: To the Zoo!',
    '[SB p.129] Page word: chase.',
    '[SB p.129] Required model: Do you like cheetahs? Yes, I do! Cheetahs can run.',
    '[SB p.129] Activities: Listen and sing. Then look at 1 and find. / Listen and say true or false. / Look at 1. Ask and answer.',
    '',
    'Communicative aim:',
    'Students can name the page-128 animals and use the page-129 like + can model in short supported talk.',
    '',
    'B. TEACHER-SELECTED PRIOR LEARNING',
    '',
    ...priorLines,
    '',
    'C. TEACHING GUIDANCE',
    '',
    '- Start with the page-128 animal pictures: hear, see, say, point, find, and name.',
    '- Support the page-129 song using the book/audio; do not invent lyrics or official listening text.',
    '- Model the required page-129 like + can sentence once or twice.',
    '- Use selected [HM] language only where it fits naturally.',
    '- Treat selected language as available support, not as a requirement to force into every activity.',
    '- Do not present [HM] combinations or teacher-added language as publisher wording.',
    '- Keep generated examples supplementary and clearly distinguishable from textbook content.',
    '- Keep the lesson concise and classroom-usable.',
    '- Success means students are prepared to work with the book pages 128–129.',
    '',
    'D. HARD BOUNDARIES',
    '',
    '- Stay on Student Book pages 128–129 only.',
    '- Do not expand into later Unit 8 topics.',
    '- Do not invent publisher audio scripts or unknown true/false items.',
    '- Do not claim teacher-added language is publisher evidence.',
  ].join('\n')
}

function buildSeriesLessonPrompt(input: {
  selectedSuggestions: TeacherChoiceSuggestion[]
  teacherAdditions: TeacherAddedLanguageInput[]
}): string {
  const priorLines = buildPriorLearningBlock(input)

  return [
    'Create a short, picture-led TWO-LESSON series to SUPPORT Big English 2 Unit 8 using ONLY these source pages:',
    '- Lesson 1: Student Book printed pages 128–129',
    '- Lesson 2: Workbook printed pages 104–105',
    '',
    'Do not teach later Unit 8 pages, including habitats, grammar, phonics, culture, values, or review.',
    'Do not replace the textbook or workbook.',
    'Do not invent publisher audio scripts or missing true/false item text.',
    'Use the book/audio where needed.',
    'Workbook pages 104–105 are verified source evidence for this series; they may not be the PDF currently open in the workspace.',
    '',
    'SOURCE LABELS:',
    '- [SB] = Student Book evidence from pages 128–129 only',
    '- [WB] = Workbook evidence from pages 104–105 only',
    '- [HM] = teacher-selected prior learning from earlier units in the same book',
    '- [TEACHER-ADDED · UNVERIFIED] = teacher-directed language not currently verified as prior-book evidence',
    '',
    'A. SERIES SCOPE',
    '',
    'Lesson 1 — Student Book pp. 128–129',
    'Purpose: introduce and practise wild-animal vocabulary through the page spread, song context, and the current-unit preference/ability model.',
    '',
    '[SB p.128] Unit 8: Wild Animals',
    '[SB p.128] Animal vocabulary: cheetah, crocodile, elephant, giraffe, hippo, kangaroo, monkey, parrot, peacock, polar bear, snake, zebra.',
    '[SB p.128] Activities: Listen, look, and say. / Listen, find, and say. / Play a game.',
    '',
    '[SB p.129] Song / vocabulary: To the Zoo!',
    '[SB p.129] Page word: chase.',
    '[SB p.129] Required model: Do you like cheetahs? Yes, I do! Cheetahs can run.',
    '[SB p.129] Activities: Listen and sing. Then look at 1 and find. / Listen and say true or false. / Look at 1. Ask and answer.',
    '',
    'Lesson 2 — Workbook pp. 104–105',
    'Purpose: use the matching workbook evidence for animal naming/matching, song-related writing, and a short zoo-animal response.',
    '',
    '[WB p.104] Naming / matching practice (Look and write. / Look and match.).',
    '[WB p.104–105] Song-related listening/writing practice tied to the unit song strand.',
    '[WB p.105] Response prompt: What animals do you like seeing at the zoo?',
    '',
    'Prototype lesson vocabulary allocation (planning division only; not a publisher lesson split):',
    `- Lesson 1 vocabulary: ${BE2_U08_SERIES_LESSON1_VOCAB}`,
    `- Lesson 2 vocabulary: ${BE2_U08_SERIES_LESSON2_VOCAB}`,
    '',
    'B. TEACHER-SELECTED PRIOR LEARNING',
    '',
    ...priorLines,
    '',
    'C. TEACHING GUIDANCE',
    '',
    '- Keep Lesson 1 on Student Book pp. 128–129 and Lesson 2 on Workbook pp. 104–105.',
    '- Lesson 1: start with animal pictures; support To the Zoo! with the book/audio; model the page-129 like + can sentence.',
    '- Lesson 2: use workbook naming/matching and song-related writing; support a short zoo-animal response.',
    '- Use selected [HM] language only where it fits naturally across the series.',
    '- Treat selected language as available support, not as a requirement to force into every activity.',
    '- Do not present [HM] combinations or teacher-added language as publisher wording.',
    '- Keep generated examples supplementary and clearly distinguishable from textbook/workbook content.',
    '- Keep both lessons concise and classroom-usable.',
    '- Success means students are prepared to work with SB 128–129 and WB 104–105.',
    '',
    'D. HARD BOUNDARIES',
    '',
    '- Stay on Student Book pages 128–129 and Workbook pages 104–105 only.',
    '- Do not expand into later Unit 8 topics.',
    '- Do not invent publisher audio scripts or unknown true/false items.',
    '- Do not claim teacher-added language is publisher evidence.',
    '- Do not treat the prototype vocabulary allocation as publisher-assigned lesson content.',
  ].join('\n')
}

/**
 * Deterministic local Chalkie prompt for the BE2 U8 packaging prototype.
 *
 * packageShape:
 * - single = SB pp. 128–129 only (existing route)
 * - series = Lesson 1 SB 128–129 + Lesson 2 WB 104–105 (explicit packaging choice)
 */
export function buildChalkiePromptPreview(input: {
  packageShape?: LessonPackageShape
  selectedSuggestions: TeacherChoiceSuggestion[]
  teacherAdditions: TeacherAddedLanguageInput[]
}): string {
  if (input.packageShape === 'series') {
    return buildSeriesLessonPrompt(input)
  }
  return buildSingleLessonPrompt(input)
}

export function lessonTitleForPackage(packageShape: LessonPackageShape): string {
  return packageShape === 'series' ? BE2_U08_SERIES_LESSON_TITLE : BE2_U08_SINGLE_LESSON_TITLE
}
