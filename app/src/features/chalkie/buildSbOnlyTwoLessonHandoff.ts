/**
 * Generic Student-Book-only two-lesson handoff from one verified SB spread.
 *
 * Sole source evidence = selected Student Book pages. Never invents Workbook
 * content or implies a Workbook companion.
 */
import {
  allocateSbOnlyTwoLessonActivities,
  formatSbOnlyLessonActivityScope,
} from './allocateSbOnlyTwoLessonActivities'
import type {
  SbActivityHandoffSelection,
  SelectedSbActivityEvidence,
} from './chalkieActivitySelection'
import {
  hasNoSelectedSbActivities,
  hasSbActivityExclusions,
  selectedSbActivityLanguage,
  selectedSbActivityVocabulary,
} from './chalkieActivitySelection'
import type { ChalkieLessonContext } from './resolveChalkieLessonContext'
import type { TeacherChoiceSuggestion } from './teacherChoiceSuggestions'

export type SbOnlyTeacherAddedLanguageInput = {
  title: string
  frame: string
  purpose: string
}

function buildPriorLearningBlock(input: {
  selectedSuggestions: TeacherChoiceSuggestion[]
  teacherAdditions: SbOnlyTeacherAddedLanguageInput[]
}): string[] {
  const priorLines: string[] = []

  if (input.selectedSuggestions.length === 0) {
    priorLines.push('No verified prior learning was selected for this lesson.')
  } else {
    for (const suggestion of input.selectedSuggestions) {
      const tag = suggestion.provenanceTag ?? '[PRIOR]'
      priorLines.push(
        `${tag} ${suggestion.label} (${suggestion.source}): ${suggestion.frame}`,
      )
    }
  }

  if (input.teacherAdditions.length > 0) {
    priorLines.push('')
    for (const addition of input.teacherAdditions) {
      const title = addition.title.trim()
      const frame = addition.frame.trim()
      priorLines.push(
        `[TEACHER-ADDED · UNVERIFIED] ${title ? `${title}: ` : ''}${frame}`,
      )
      if (addition.purpose.trim()) {
        priorLines.push(`Purpose: ${addition.purpose.trim()}`)
      }
    }
  }

  return priorLines
}

function activityPromptLines(
  activities: readonly SelectedSbActivityEvidence[],
  emptyMessage: string,
): string[] {
  if (activities.length === 0) return [`- ${emptyMessage}`]
  const lines: string[] = []
  for (const evidence of activities) {
    const activityLabel = evidence.activityNumber
      ? `Activity ${evidence.activityNumber}`
      : 'Activity'
    lines.push(
      `- [SB p.${evidence.printedPage}] ${activityLabel}: ${evidence.verifiedWording}`,
    )
    if (evidence.prompt && evidence.prompt !== evidence.verifiedWording) {
      lines.push(`  Task evidence: ${evidence.prompt}`)
    }
    if (evidence.languageFrame) {
      lines.push(`  Language: ${evidence.languageFrame}`)
    }
  }
  return lines
}

export type SbOnlyTwoLessonHandoff = {
  readonly detailedHandoff: string
  readonly lesson1ActivityScope: string
  readonly lesson2ActivityScope: string
  readonly pageRangeLabel: string
}

/**
 * Build a two-lesson series handoff that uses only the current Student Book spread.
 */
export function buildSbOnlyTwoLessonHandoff(input: {
  lesson: ChalkieLessonContext
  selectedSuggestions: TeacherChoiceSuggestion[]
  teacherAdditions: SbOnlyTeacherAddedLanguageInput[]
  activitySelection?: SbActivityHandoffSelection
}): SbOnlyTwoLessonHandoff {
  const { lesson } = input
  const pageList = lesson.visiblePrintedPages.join(', ')
  const pageRangeLabel = lesson.visiblePageRangeLabel
  const selection = input.activitySelection
  const selectedEvidence = selection?.selectedEvidence ?? []
  const allocation = allocateSbOnlyTwoLessonActivities(selectedEvidence)
  const priorLines = buildPriorLearningBlock(input)
  const selectionSensitive =
    selection != null && hasSbActivityExclusions(selection)
  const noSelected =
    selection != null && hasNoSelectedSbActivities(selection)

  const selectedWords = selection
    ? selectedSbActivityVocabulary(selection)
    : lesson.vocabulary
  const selectedLanguage = selection
    ? selectedSbActivityLanguage(selection)
    : lesson.languageExamples.map((item) => item.example)

  const wordsLines =
    selectedWords.length > 0
      ? [
          `Verified words and models available on this spread: ${selectedWords.join(', ')}.`,
        ]
      : [
          'Verified words and models: none safely attributable for this Student Book spread.',
        ]
  const languageLines =
    selectedLanguage.length > 0
      ? selectedLanguage.map((value) => `- ${value}`)
      : ['- No verified language frames safely attributable for this spread.']

  const lesson1Lines = activityPromptLines(
    allocation.lesson1,
    noSelected
      ? 'No current Student Book activities were selected for Lesson 1.'
      : 'No selected Student Book activities were allocated to Lesson 1.',
  )
  const lesson2Lines = activityPromptLines(
    allocation.lesson2,
    noSelected
      ? 'No current Student Book activities were selected for Lesson 2.'
      : 'No selected Student Book activities were allocated to Lesson 2.',
  )

  const detailedHandoff = [
    `Create a short, picture-led TWO-LESSON series to SUPPORT ${lesson.bookLabel} ${lesson.unitLine} using ONLY Student Book printed pages ${pageList}.`,
    '',
    'Both lessons use the same Student Book spread as sole source evidence.',
    'Do not invent Workbook content or imply a Workbook companion.',
    'Do not teach other unit pages beyond the listed printed pages.',
    'Do not replace the textbook.',
    'Do not invent publisher audio scripts or missing exercise text.',
    'Use the book/audio where needed.',
    '',
    'SOURCE LABELS:',
    `- [SB] = Student Book evidence from printed pages ${pageList} only`,
    '- [PRIOR] = teacher-selected prior learning from earlier pages in the same unit (not current-spread evidence)',
    '- [HM] = teacher-selected prior learning from earlier units in the same book',
    '- [TEACHER-ADDED · UNVERIFIED] = teacher-directed language not currently verified as prior-book evidence',
    '',
    'PACKAGING:',
    `- Lesson 1 — Student Book ${pageRangeLabel} · ${formatSbOnlyLessonActivityScope(allocation.lesson1)}`,
    `- Lesson 2 — Student Book ${pageRangeLabel} · ${formatSbOnlyLessonActivityScope(allocation.lesson2)}`,
    '- Activity allocation follows stable page/activity order from the teacher-selected current activities.',
    '',
    'A. CURRENT STUDENT BOOK EVIDENCE',
    '',
    `Shared source scope: Student Book ${pageRangeLabel}`,
    ...wordsLines,
    '',
    'Verified language available on this spread:',
    ...languageLines,
    '',
    'Lesson 1 current activities:',
    ...lesson1Lines,
    '',
    'Lesson 2 current activities:',
    ...lesson2Lines,
    '',
    'B. TEACHER-SELECTED PRIOR LEARNING',
    '',
    ...priorLines,
    '',
    'C. TEACHING GUIDANCE',
    '',
    `- Keep both lessons on Student Book pages ${pageList} only.`,
    '- Lesson 1 introduces/practises the Lesson 1 allocated activities first.',
    '- Lesson 2 continues with the Lesson 2 allocated activities from the same spread.',
    ...(noSelected
      ? [
          '- No current Student Book activities were selected; do not recreate them from page context.',
        ]
      : selectionSensitive
        ? [
            '- Use only the selected Student Book activities listed above; do not reconstruct excluded activities.',
          ]
        : []),
    '- Prior learning remains optional support and does not replace current-page evidence.',
    '- Use selected [PRIOR] / [HM] language only where it fits naturally across the series.',
    '- Do not present [PRIOR] / [HM] or teacher-added language as publisher wording.',
    '- Keep both lessons concise and classroom-usable.',
    '',
    'D. HARD BOUNDARIES',
    '',
    `- Stay on Student Book pages ${pageList} only.`,
    '- Do not invent Workbook pages, Workbook activities, or a Workbook companion.',
    ...(selectionSensitive
      ? ['- Do not use or reconstruct unselected Student Book activities.']
      : []),
    '- Do not invent publisher audio scripts or unknown exercise items.',
    '- Do not claim teacher-added language is publisher evidence.',
  ].join('\n')

  return {
    detailedHandoff,
    lesson1ActivityScope: formatSbOnlyLessonActivityScope(allocation.lesson1),
    lesson2ActivityScope: formatSbOnlyLessonActivityScope(allocation.lesson2),
    pageRangeLabel,
  }
}
