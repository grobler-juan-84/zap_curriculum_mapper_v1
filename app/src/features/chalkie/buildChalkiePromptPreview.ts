import type { TeacherChoiceSuggestion } from './teacherChoiceSuggestions'

export type TeacherAddedLanguageInput = {
  frame: string
  note: string
}

/** Deterministic page-scoped Chalkie prompt for BE2 U8 pp. 128–129 (local only). */
export function buildChalkiePromptPreview(input: {
  selectedSuggestions: TeacherChoiceSuggestion[]
  teacherAdditions: TeacherAddedLanguageInput[]
}): string {
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
