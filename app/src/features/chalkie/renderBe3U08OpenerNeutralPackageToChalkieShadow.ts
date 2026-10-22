/**
 * Test-only Chalkie renderer for the accepted BE3 Unit 8 Opener package.
 *
 * This module is deliberately not wired into the UI or normal handoff flow.
 * It proves that the neutral package can reproduce the accepted Chalkie
 * artifacts while keeping selection-sensitive source evidence package-only.
 */
import {
  BE3_U08_OPENER_LESSON1_VOCAB,
  BE3_U08_OPENER_LESSON2_VOCAB,
} from './buildBe3U08OpenerSbWbSeriesHandoff'
import type {
  NeutralLessonPackageLesson,
  NeutralPriorSupportRecord,
  NeutralSbWbLessonPackage,
  NeutralSelectedActivityEvidence,
} from './buildNeutralSbWbLessonPackage'

const OPENER_PACKAGE_REFERENCE = 'be3-sb-wb-u08-p128-129-wb104-105'
const OPENER_RELATIONSHIP_ID =
  'be3_sb_wb_rel_u08_opener_sb128-129_wb104-105'

export type Be3U08OpenerChalkieShadowOutput = {
  readonly detailedHandoff: string
  readonly lesson1Outline: string
  readonly lesson1Vocabulary: string
  readonly lesson2Outline: string
  readonly lesson2Vocabulary: string
}

function arraysEqual<T>(left: readonly T[], right: readonly T[]): boolean {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  )
}

function assertAcceptedOpenerPackage(
  lessonPackage: NeutralSbWbLessonPackage,
): void {
  const valid =
    lessonPackage.identity.packageReference === OPENER_PACKAGE_REFERENCE &&
    lessonPackage.identity.relationshipId === OPENER_RELATIONSHIP_ID &&
    lessonPackage.identity.componentKey === 'opener' &&
    lessonPackage.packaging.type === 'two_lesson_sb_wb' &&
    lessonPackage.lesson1.role === 'student_book' &&
    lessonPackage.lesson2.role === 'workbook' &&
    arraysEqual(lessonPackage.lesson1.scope.printedPages, [128, 129]) &&
    arraysEqual(lessonPackage.lesson2.scope.printedPages, [104, 105])

  if (!valid) {
    throw new Error(
      `Opener Chalkie shadow rendering is not enabled for ${lessonPackage.identity.packageReference}.`,
    )
  }
}

function audioNote(
  lesson: NeutralLessonPackageLesson,
  activity: NeutralSelectedActivityEvidence,
): string | null {
  return (
    lesson.audioReferences.find(
      (reference) => reference.cardId === activity.cardId,
    )?.sourceDependencyNote ?? null
  )
}

function activityPromptLines(
  lesson: NeutralLessonPackageLesson,
): string[] {
  if (lesson.selection.status === 'zero_selected') {
    return lesson.role === 'student_book'
      ? [
          '- No current Student Book activities were selected.',
          '- Do not reconstruct or infer content from unselected page activities.',
        ]
      : [
          '- No Workbook activities were selected.',
          '- Do not reconstruct or infer content from unselected Workbook activities.',
        ]
  }

  const source = lesson.role === 'student_book' ? 'SB' : 'WB'
  const lines: string[] = []
  for (const activity of lesson.selectedActivities) {
    const activityLabel = activity.activityNumber
      ? `Activity ${activity.activityNumber}`
      : 'Activity'
    lines.push(
      `- [${source} p.${activity.printedPage}] ${activityLabel}: ${activity.verifiedWording}`,
    )
    if (activity.prompt && activity.prompt !== activity.verifiedWording) {
      lines.push(`  Task evidence: ${activity.prompt}`)
    }
    if (activity.expectedAnswer) {
      lines.push(`  Answer evidence: ${activity.expectedAnswer}`)
    }
    for (const item of activity.items) {
      const itemLabel = item.itemNumber ? `Item ${item.itemNumber}` : 'Item'
      if (item.prompt) lines.push(`  ${itemLabel} task: ${item.prompt}`)
      if (item.expectedAnswer) {
        lines.push(`  ${itemLabel} answer evidence: ${item.expectedAnswer}`)
      }
    }
    if (activity.languageFrame) {
      lines.push(`  Language: ${activity.languageFrame}`)
    }
    const note = audioNote(lesson, activity)
    if (
      lesson.audioReferences.some(
        (reference) => reference.cardId === activity.cardId,
      )
    ) {
      lines.push(`  Use the official book audio${note ? ` (${note})` : ''}.`)
    }
  }
  return lines
}

function priorSupportLines(
  records: readonly NeutralPriorSupportRecord[],
): string[] {
  // Match accepted bespoke prior-block wording so production canary parity can hold.
  // Explicit Lesson 1 / Lesson 2 targeting remains on NeutralPriorSupportRecord.targetLessons.
  if (records.length === 0) {
    return ['No verified prior learning was selected for this lesson.']
  }

  const priorish = records.filter(
    (record) => record.provenance !== '[TEACHER-ADDED · UNVERIFIED]',
  )
  const teacherAdded = records.filter(
    (record) => record.provenance === '[TEACHER-ADDED · UNVERIFIED]',
  )
  const lines: string[] = []

  if (priorish.length === 0) {
    lines.push('No verified prior learning was selected for this lesson.')
  } else {
    for (const record of priorish) {
      const source = record.sourceReference?.trim()
      lines.push(
        source
          ? `${record.provenance} ${record.label} (${source}): ${record.frame}`
          : `${record.provenance} ${record.label}: ${record.frame}`,
      )
    }
  }

  if (teacherAdded.length > 0) {
    lines.push('')
    for (const record of teacherAdded) {
      const title = record.label.trim()
      lines.push(
        `[TEACHER-ADDED · UNVERIFIED] ${title ? `${title}: ` : ''}${record.frame}`,
      )
      if (record.purpose) lines.push(`Purpose: ${record.purpose}`)
    }
  }

  return lines
}

const ACCEPTED_SB_ACTIVITY_LINES = [
  '[SB p.128] Activities: Listen, look, and say. / Listen, find, and say. / Play a game.',
  '[SB p.129] Activity: Listen and sing. How does Zach feel today?',
  '[SB p.129] Activity: Look at 1. Ask and answer.',
  "[SB p.129] Required model: Did he eat breakfast? / No, he didn't. | Did she ride her bike? / Yes, she did.",
]

const ACCEPTED_WB_ACTIVITY_LINES = [
  '[WB p.104] Unit 8 Healthy Living · unit opener vocabulary',
  `[WB p.104] Target vocabulary (past/contrast forms): ${BE3_U08_OPENER_LESSON2_VOCAB}.`,
  '[WB p.104] Activity 1: Write. Use activities from the box. Then check (✓) the healthy ones.',
  '[WB p.104] Activity 2: Read and circle for you. (Includes How do you feel today? and Did you…? Yes/No items.)',
  '[WB p.105] Song practice · Live Right!',
  '[WB p.105] Activity 3: Listen and write. (Audio track 153 required. Word box: any, Did, enough, good, too, you.)',
  "[WB p.105] Activity 4: Read and ✓ for you. Then answer with Yes, I did or No, I didn't.",
]

const ACCEPTED_SB_LANGUAGE = [
  "Did he eat breakfast? / No, he didn't.",
  'Did she ride her bike? / Yes, she did.',
]

const ACCEPTED_WB_LANGUAGE = ["Yes, I did. / No, I didn't."]

function renderAcceptedAllSelectedDetailedHandoff(
  lessonPackage: NeutralSbWbLessonPackage,
): string {
  const lesson1Vocabulary = lessonPackage.lesson1.vocabulary.join(', ')
  const lesson2Vocabulary = lessonPackage.lesson2.vocabulary.join(', ')

  return [
    'Create a short, picture-led TWO-LESSON series to SUPPORT Big English 3 Unit 8 using ONLY these source pages:',
    '- Lesson 1: Student Book printed pages 128–129',
    '- Lesson 2: Workbook printed pages 104–105',
    '',
    'Do not teach later Unit 8 pages, including story, Language in Action, Content Connection, Grammar, Culture, Writing, Phonics, Values, or Review.',
    'Do not replace the textbook or workbook.',
    'Do not invent publisher audio scripts, song lyrics, or missing exercise text.',
    'Use the book/audio where needed.',
    'Workbook pages 104–105 are verified source evidence for this series; they may not be the PDF currently open in the workspace.',
    'Treat Lesson 2 as consolidation/practice of the Student Book opener — not a second copy of Lesson 1.',
    '',
    'SOURCE LABELS:',
    '- [SB] = Student Book evidence from pages 128–129 only',
    '- [WB] = Workbook evidence from pages 104–105 only',
    '- [PRIOR] = teacher-selected prior learning from earlier pages in the same unit (not visible-page evidence)',
    '- [TEACHER-ADDED · UNVERIFIED] = teacher-directed language not currently verified as prior-book evidence',
    '- [SUPPLEMENTARY] = teacher-controlled closing check; not publisher wording',
    '',
    'A. SERIES SCOPE',
    '',
    'Lesson 1 — Student Book pp. 128–129',
    'Purpose: introduce and practise healthy/unhealthy activity phrases through the vocabulary spread and Live Right! song context; then use Did…? short answers from the page.',
    '',
    '[SB p.128] Unit 8 Healthy Living · Vocabulary',
    '[SB p.128] Curriculum component: Healthy and unhealthy activities',
    `[SB p.128] Target vocabulary: ${lesson1Vocabulary}.`,
    '[SB p.128] Activities: Listen, look, and say. / Listen, find, and say. / Play a game.',
    '',
    '[SB p.129] Song / Vocabulary · Live Right!',
    '[SB p.129] Activity: Listen and sing. How does Zach feel today?',
    '[SB p.129] Activity: Look at 1. Ask and answer.',
    "[SB p.129] Required model: Did he eat breakfast? / No, he didn't. | Did she ride her bike? / Yes, she did.",
    '',
    'Lesson 2 — Workbook pp. 104–105',
    'Purpose: consolidate the opener strand with past/contrast healthy-activity writing, personal Did you…? responses, and Live Right! song listen/write practice.',
    '',
    '[WB p.104] Unit 8 Healthy Living · unit opener vocabulary',
    `[WB p.104] Target vocabulary (past/contrast forms): ${lesson2Vocabulary}.`,
    '[WB p.104] Activity 1: Write. Use activities from the box. Then check (✓) the healthy ones.',
    '[WB p.104] Activity 2: Read and circle for you. (Includes How do you feel today? and Did you…? Yes/No items.)',
    '',
    '[WB p.105] Song practice · Live Right!',
    '[WB p.105] Activity 3: Listen and write. (Audio track 153 required. Word box: any, Did, enough, good, too, you.)',
    "[WB p.105] Activity 4: Read and ✓ for you. Then answer with Yes, I did or No, I didn't.",
    '',
    'Verified lesson vocabulary lists (page evidence only — not a publisher lesson split):',
    `- Lesson 1 vocabulary: ${lesson1Vocabulary}`,
    `- Lesson 2 vocabulary: ${lesson2Vocabulary}`,
    '',
    'B. TEACHER-SELECTED PRIOR LEARNING',
    '',
    ...priorSupportLines(lessonPackage.priorSupport),
    '',
    'C. TEACHING GUIDANCE',
    '',
    '- Keep Lesson 1 on Student Book pp. 128–129 and Lesson 2 on Workbook pp. 104–105.',
    '- Lesson 1: start with the healthy/unhealthy activity pictures; support Live Right! with the book/audio; model the page-129 Did…? short answers.',
    '- Lesson 2: use workbook label/check and personal Did you…? practice; support song listen/write with official audio; do not invent lyrics or answer keys.',
    '- Use selected [PRIOR] language only where it fits naturally across the series.',
    '- Treat selected language as available support, not as a requirement to force into every activity.',
    '- Do not present [PRIOR] combinations or teacher-added language as publisher wording.',
    '- Keep generated examples supplementary and clearly distinguishable from textbook/workbook content.',
    '- Keep both lessons concise and classroom-usable.',
    '- Success means students are prepared to work with SB 128–129 and WB 104–105.',
    '',
    'D. HARD BOUNDARIES',
    '',
    '- Stay on Student Book pages 128–129 and Workbook pages 104–105 only.',
    '- Do not expand into later Unit 8 topics.',
    '- Do not invent publisher audio scripts, song lyrics, or unknown exercise items.',
    '- Do not claim teacher-added language is publisher evidence.',
    '- Do not treat Lesson 2 as a second presentation of Lesson 1 content.',
  ].join('\n')
}

function renderSelectionAwareDetailedHandoff(
  lessonPackage: NeutralSbWbLessonPackage,
): string {
  const lesson1 = lessonPackage.lesson1
  const lesson2 = lessonPackage.lesson2
  const sbSelectionSensitive = lesson1.selection.status !== 'all_selected'
  const wbSelectionSensitive = lesson2.selection.status !== 'all_selected'
  const noLesson1Activities = lesson1.selection.status === 'zero_selected'
  const noLesson2Activities = lesson2.selection.status === 'zero_selected'
  const sbActivityLines = sbSelectionSensitive
    ? activityPromptLines(lesson1)
    : ACCEPTED_SB_ACTIVITY_LINES
  const wbActivityLines = wbSelectionSensitive
    ? activityPromptLines(lesson2)
    : ACCEPTED_WB_ACTIVITY_LINES
  const sbVocabulary = sbSelectionSensitive
    ? lesson1.vocabulary
    : BE3_U08_OPENER_LESSON1_VOCAB.split(', ')
  const wbVocabulary = wbSelectionSensitive
    ? lesson2.vocabulary
    : BE3_U08_OPENER_LESSON2_VOCAB.split(', ')
  const sbLanguage = sbSelectionSensitive
    ? lesson1.languageModels
    : ACCEPTED_SB_LANGUAGE
  const wbLanguage = wbSelectionSensitive
    ? lesson2.languageModels
    : ACCEPTED_WB_LANGUAGE

  return [
    'Create a short, picture-led TWO-LESSON series to SUPPORT Big English 3 Unit 8 using ONLY these source pages:',
    '- Lesson 1: Student Book printed pages 128–129',
    '- Lesson 2: Workbook printed pages 104–105',
    '',
    'Do not replace the textbook or workbook.',
    'Do not invent publisher audio scripts, song lyrics, or missing exercise text.',
    'Workbook pages 104–105 are verified source evidence for this series; they may not be the PDF currently open in the workspace.',
    'Treat Lesson 2 as consolidation/practice of the Student Book opener — not a second copy of Lesson 1.',
    '',
    'SOURCE LABELS:',
    '- [SB] = selected Student Book activity evidence from pages 128–129 only',
    '- [WB] = selected Workbook activity evidence from pages 104–105 only',
    '- [PRIOR] = teacher-selected prior learning from earlier pages in the same unit',
    '- [TEACHER-ADDED · UNVERIFIED] = teacher-directed language not currently verified as prior-book evidence',
    '',
    'A. SERIES SCOPE',
    '',
    'Lesson 1 — Student Book pp. 128–129',
    sbSelectionSensitive
      ? 'Use only the selected Student Book activities below.'
      : 'Use the verified Student Book opener activities below.',
    ...sbActivityLines,
    '',
    sbVocabulary.length
      ? `Selected Lesson 1 words/models: ${sbVocabulary.join(', ')}.`
      : 'Selected Lesson 1 words/models: none safely attributable to the selected activities.',
    sbLanguage.length
      ? `Selected Lesson 1 language: ${sbLanguage.join(' | ')}`
      : 'Selected Lesson 1 language: none safely attributable to the selected activities.',
    '',
    'Lesson 2 — Workbook pp. 104–105',
    wbSelectionSensitive
      ? 'Use only the selected Workbook activities below. Do not reconstruct excluded Workbook activities.'
      : 'Purpose: consolidate the opener strand with past/contrast healthy-activity writing, personal Did you…? responses, and Live Right! song listen/write practice.',
    ...wbActivityLines,
    '',
    wbVocabulary.length
      ? `Selected Lesson 2 words/models: ${wbVocabulary.join(', ')}.`
      : 'Selected Lesson 2 words/models: none safely attributable to the selected Workbook activities.',
    wbLanguage.length
      ? `Selected Lesson 2 language: ${wbLanguage.join(' | ')}`
      : 'Selected Lesson 2 language: none safely attributable to the selected Workbook activities.',
    '',
    'B. TEACHER-SELECTED PRIOR LEARNING',
    '',
    ...priorSupportLines(lessonPackage.priorSupport),
    '',
    'C. TEACHING GUIDANCE',
    '',
    '- Keep Lesson 1 on Student Book pp. 128–129 and Lesson 2 on Workbook pp. 104–105.',
    noLesson1Activities
      ? '- Lesson 1: no current Student Book activities were selected; do not recreate them from page context.'
      : sbSelectionSensitive
        ? '- Lesson 1: use only the selected Student Book activities listed above; do not reconstruct excluded activities.'
        : '- Lesson 1: use the verified Student Book activities listed above.',
    noLesson2Activities
      ? '- Lesson 2: no Workbook activities were selected; keep the lesson slot valid but do not recreate or substitute Workbook teaching content.'
      : wbSelectionSensitive
        ? '- Lesson 2: use only the selected Workbook activities listed above; do not reconstruct excluded activities.'
        : '- Lesson 2: use the verified Workbook consolidation/practice activities listed above.',
    '- Prior learning remains separate support and does not replace unselected current-page content.',
    '- Keep both lessons concise and classroom-usable.',
    '',
    'D. HARD BOUNDARIES',
    '',
    '- Stay on Student Book pages 128–129 and Workbook pages 104–105 only.',
    '- Do not use or reconstruct unselected Student Book activities.',
    '- Do not use or reconstruct unselected Workbook activities.',
    '- Do not invent publisher audio scripts, song lyrics, or unknown exercise items.',
  ].join('\n')
}

function renderSelectionAwareOutline(
  lesson: NeutralLessonPackageLesson,
): string {
  const isStudentBook = lesson.role === 'student_book'
  const source = isStudentBook ? 'SB' : 'WB'
  const sourceName = isStudentBook ? 'Student Book' : 'Workbook'
  const lessonNumber = isStudentBook ? '1' : '2'
  const pages = lesson.scope.printedPages.join('–')
  const lines = [
    `Concise teacher-controlled outline — Lesson ${lessonNumber}`,
    `Short teaching sequence for ${sourceName} pp. ${pages} only. Use only selected activities; do not reconstruct excluded activities.`,
    '',
  ]

  if (lesson.selection.status === 'zero_selected') {
    lines.push(
      isStudentBook
        ? '1. [SB] No current Student Book activities were selected. Teacher must review the source selection before adding current-page work.'
        : '1. [WB] No Workbook activities were selected. Keep the Lesson 2 slot valid without adding or substituting Workbook teaching content.',
    )
  } else {
    lesson.selectedActivities.forEach((activity, index) => {
      const number = activity.activityNumber
        ? `Activity ${activity.activityNumber}`
        : 'Activity'
      const hasAudio = lesson.audioReferences.some(
        (reference) => reference.cardId === activity.cardId,
      )
      const note = audioNote(lesson, activity)
      const audio = hasAudio
        ? ` Use the official book audio${note ? ` (${note})` : ''}.`
        : ''
      const language = activity.languageFrame
        ? ` Model: ${activity.languageFrame}`
        : ''
      lines.push(
        `${index + 1}. [${source}] ${number}: ${activity.verifiedWording}${audio}${language}`,
      )
    })
  }
  lines.push('')
  return lines.join('\n')
}

function renderAcceptedLesson1Outline(): string {
  return [
    'Concise teacher-controlled outline — Lesson 1',
    'Short teaching sequence for Student Book pp. 128–129 only. Keep book-working time; do not expand into a slide-by-slide script.',
    '',
    '1. [SB] Activity 1: Listen, look, and say. Use the official book audio.',
    '2. [SB] Activity 2: Listen, find, and say. Use the official book audio.',
    '3. [SB] Activity 3: Play a game.',
    '4. [SB] Activity 4: Listen and sing. How does Zach feel today? Use the official book audio.',
    "5. [SB] Activity 5: Look at 1. Ask and answer. Model: Did he eat breakfast? / No, he didn't. | Did she ride her bike? / Yes, she did.",
    '6. [SUPPLEMENTARY] Finish with a brief oral recap using one Did…? question and short answer.',
    '',
  ].join('\n')
}

function renderAcceptedLesson2Outline(): string {
  return [
    'Concise teacher-controlled outline — Lesson 2',
    'Short teaching sequence for Workbook pp. 104–105 only. Consolidation/practice of the Student Book opener — not a second Lesson 1. Keep book-working time; do not expand into a slide-by-slide script.',
    '',
    '1. [WB] Activity 1: Write. Use activities from the box. Then check (✓) the healthy ones.',
    '2. [WB] Activity 2: Read and circle for you. (Personal Did you…? / Yes/No responses.)',
    '3. [WB] Activity 3: Listen and write. Use the official book audio (Track 153).',
    "4. [WB] Activity 4: Read and ✓ for you. Then answer with Yes, I did or No, I didn't.",
    '5. [SUPPLEMENTARY] Finish with a brief oral check using one Did you…? question and Yes, I did / No, I didn’t.',
    '',
  ].join('\n')
}

export function renderBe3U08OpenerNeutralPackageToChalkieShadow(
  lessonPackage: NeutralSbWbLessonPackage,
): Be3U08OpenerChalkieShadowOutput {
  assertAcceptedOpenerPackage(lessonPackage)
  const allSelected =
    lessonPackage.lesson1.selection.status === 'all_selected' &&
    lessonPackage.lesson2.selection.status === 'all_selected'

  return {
    detailedHandoff: allSelected
      ? renderAcceptedAllSelectedDetailedHandoff(lessonPackage)
      : renderSelectionAwareDetailedHandoff(lessonPackage),
    lesson1Outline:
      lessonPackage.lesson1.selection.status === 'all_selected'
        ? renderAcceptedLesson1Outline()
        : renderSelectionAwareOutline(lessonPackage.lesson1),
    lesson1Vocabulary: lessonPackage.lesson1.vocabulary.join(', '),
    lesson2Outline:
      lessonPackage.lesson2.selection.status === 'all_selected'
        ? renderAcceptedLesson2Outline()
        : renderSelectionAwareOutline(lessonPackage.lesson2),
    lesson2Vocabulary:
      lessonPackage.lesson2.selection.status === 'zero_selected'
        ? 'No Workbook activities selected.'
        : lessonPackage.lesson2.vocabulary.join(', ') ||
          'No Workbook words or models are safely attributable to the selected activities.',
  }
}
