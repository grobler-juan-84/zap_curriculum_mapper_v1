/**
 * Chalkie renderer for the accepted asymmetric BE3 Unit 8 Story package.
 *
 * Accepts SB pp.130–131 → WB p.106 only and never renders a facing page or WB p.107.
 * Production may call this only through the Story-only guarded canary (default off).
 */
import { BE3_U08_STORY_LESSON2_VOCAB } from './buildBe3U08StorySbWbSeriesHandoff'
import type {
  NeutralLessonPackageLesson,
  NeutralPriorSupportRecord,
  NeutralSbWbLessonPackage,
  NeutralSelectedActivityEvidence,
} from './buildNeutralSbWbLessonPackage'

const STORY_PACKAGE_REFERENCE = 'be3-sb-wb-u08-p130-131-wb106'
const STORY_RELATIONSHIP_ID =
  'be3_sb_wb_rel_u08_story_sb130-131_wb106'
const STORY_LESSON1_EMPTY_VOCABULARY =
  'No dedicated target vocabulary listed on SB pp.130–131 (Story / Reading · An Unhealthy Dinner).'
const STORY_LESSON2_ACCEPTED_VOCABULARY = [
  'unhealthy',
  'fries',
  'lettuce',
  'tomatoes',
  'cola',
  'burger',
  'water',
].join(', ')

export type Be3U08StoryChalkieShadowOutput = {
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

function assertAcceptedStoryPackage(
  lessonPackage: NeutralSbWbLessonPackage,
): void {
  const valid =
    lessonPackage.identity.packageReference === STORY_PACKAGE_REFERENCE &&
    lessonPackage.identity.relationshipId === STORY_RELATIONSHIP_ID &&
    lessonPackage.identity.componentKey === 'story' &&
    lessonPackage.packaging.type === 'two_lesson_sb_wb' &&
    lessonPackage.lesson1.role === 'student_book' &&
    lessonPackage.lesson2.role === 'workbook' &&
    arraysEqual(lessonPackage.lesson1.scope.printedPages, [130, 131]) &&
    arraysEqual(lessonPackage.lesson2.scope.printedPages, [106])

  if (!valid) {
    throw new Error(
      `Story Chalkie shadow rendering is not enabled for ${lessonPackage.identity.packageReference}.`,
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
  '[SB p.130] Activity 6: Listen and read. Did Amy eat a healthy dinner? (Audio track 154 required.)',
  '[SB p.131] Activity 7: Read and choose.',
]

const ACCEPTED_WB_ACTIVITY_LINES = [
  '[WB p.106] Unit 8 Healthy Living · Story',
  '[WB p.106] Notes: Story title: An Unhealthy Dinner',
  `[WB p.106] Target vocabulary: ${BE3_U08_STORY_LESSON2_VOCAB}.`,
  "[WB p.106] Activity 5: Read and answer. Write Yes, she did or No, she didn’t. (Did Amy eat a burger and fries…? / Did she eat fried food? / Did she drink a large glass of water? / Did she eat a healthy dinner?)",
  '[WB p.106] Language model: Did Amy…? → Yes, she did. / No, she didn’t.',
  '[WB p.106] Activity 6: What did you eat for dinner yesterday? Was it healthy? Draw, write, and circle.',
  '[WB p.106] Think Big: Healthy or unhealthy? Draw. (fries, lettuce, tomatoes, bottle of cola, burger, water)',
]

const ACCEPTED_WB_LANGUAGE = ['Did Amy…? / Yes, she did. / No, she didn’t.']

function renderAcceptedAllSelectedDetailedHandoff(
  lessonPackage: NeutralSbWbLessonPackage,
): string {
  return [
    'Create a short, picture-led TWO-LESSON series to SUPPORT Big English 3 Unit 8 using ONLY these source pages:',
    '- Lesson 1: Student Book printed pages 130–131',
    '- Lesson 2: Workbook printed page 106 only',
    '',
    'Do not expand Workbook scope beyond printed page 106.',
    'Do not teach later Unit 8 pages, including Language in Action, Content Connection, Grammar, Culture, Writing, Phonics, Values, or Review.',
    'Do not automatically import vocabulary from Student Book pages 128–129. Opener language may appear only if the teacher explicitly selected it as [PRIOR].',
    'Do not replace the textbook or workbook.',
    'Do not invent publisher audio scripts or missing story/exercise text.',
    'Use the book/audio where needed.',
    'Workbook page 106 is verified source evidence for this series; it may not be the PDF currently open in the workspace.',
    'Treat Lesson 2 as consolidation/practice of the Student Book story — not a second copy of Lesson 1.',
    '',
    'SOURCE LABELS:',
    '- [SB] = Student Book evidence from pages 130–131 only',
    '- [WB] = selected Workbook activity evidence from page 106 only',
    '- [PRIOR] = teacher-selected prior learning from earlier pages in the same unit (not visible-page evidence)',
    '- [TEACHER-ADDED · UNVERIFIED] = teacher-directed language not currently verified as prior-book evidence',
    '- [SUPPLEMENTARY] = teacher-controlled closing check; not publisher wording',
    '',
    'A. SERIES SCOPE',
    '',
    'Lesson 1 — Student Book pp. 130–131',
    'Purpose: support the Story / Reading component An Unhealthy Dinner — listen/read the story and complete the Amy-dinner comprehension choose task.',
    '',
    '[SB p.130] Unit 8 Healthy Living · Story',
    '[SB p.130] Page heading / component: An Unhealthy Dinner',
    '[SB p.130] Activity 6: Listen and read. Did Amy eat a healthy dinner? (Audio track 154 required.)',
    "[SB p.130] Expected answer (source): No, she didn't.",
    '',
    '[SB p.131] Reading · reading comprehension',
    '[SB p.131] Activity 7: Read and choose. (Amy dinner comprehension items: party/home; healthy/unhealthy food; fries; fried food; cola/sugar; dad happy/isn’t.)',
    `[SB] Dedicated target vocabulary on these pages: none listed. ${STORY_LESSON1_EMPTY_VOCABULARY}`,
    '',
    'Lesson 2 — Workbook p. 106 only',
    'Purpose: consolidate the story strand with Did Amy…? Yes/No she did short answers, personal dinner reflection, and Think Big healthy/unhealthy categorisation.',
    '',
    '[WB p.106] Unit 8 Healthy Living · Story',
    '[WB p.106] Notes: Story title: An Unhealthy Dinner',
    `[WB p.106] Target vocabulary: ${STORY_LESSON2_ACCEPTED_VOCABULARY}.`,
    "[WB p.106] Activity 5: Read and answer. Write Yes, she did or No, she didn’t. (Did Amy eat a burger and fries…? / Did she eat fried food? / Did she drink a large glass of water? / Did she eat a healthy dinner?)",
    '[WB p.106] Language model: Did Amy…? → Yes, she did. / No, she didn’t.',
    '[WB p.106] Activity 6: What did you eat for dinner yesterday? Was it healthy? Draw, write, and circle.',
    '[WB p.106] Think Big: Healthy or unhealthy? Draw. (fries, lettuce, tomatoes, bottle of cola, burger, water)',
    '',
    'Verified lesson vocabulary notes (page evidence only — not a publisher lesson split):',
    `- Lesson 1 vocabulary: ${STORY_LESSON1_EMPTY_VOCABULARY}`,
    `- Lesson 2 vocabulary: ${STORY_LESSON2_ACCEPTED_VOCABULARY}`,
    '',
    'B. TEACHER-SELECTED PRIOR LEARNING',
    '',
    ...priorSupportLines(lessonPackage.priorSupport),
    '',
    'C. TEACHING GUIDANCE',
    '',
    '- Keep Lesson 1 on Student Book pp. 130–131 and Lesson 2 on Workbook p. 106 only.',
    '- Lesson 1: support listen/read of An Unhealthy Dinner with official audio; then complete Read and choose comprehension.',
    '- Lesson 2: consolidate with Did Amy…? short answers, personal dinner write/draw, and Think Big categorisation — do not repeat the full story presentation.',
    '- Use selected [PRIOR] language only where it fits naturally across the series.',
    '- Treat selected language as available support, not as a requirement to force into every activity.',
    '- Do not present [PRIOR] combinations or teacher-added language as publisher wording.',
    '- Keep generated examples supplementary and clearly distinguishable from textbook/workbook content.',
    '- Keep both lessons concise and classroom-usable.',
    '- Success means students are prepared to work with SB 130–131 and WB 106.',
    '',
    'D. HARD BOUNDARIES',
    '',
    '- Stay on Student Book pages 130–131 and Workbook page 106 only.',
    '- Do not expand Workbook practice beyond page 106.',
    '- Do not expand into later Unit 8 topics.',
    '- Do not invent publisher audio scripts or unknown exercise items.',
    '- Do not claim teacher-added language is publisher evidence.',
    '- Do not treat Lesson 2 as a second presentation of Lesson 1 content.',
    '- Do not import Student Book pages 128–129 vocabulary unless explicitly selected as [PRIOR].',
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
  const sbVocabulary = sbSelectionSensitive ? lesson1.vocabulary : []
  const wbVocabulary = wbSelectionSensitive
    ? lesson2.vocabulary
    : BE3_U08_STORY_LESSON2_VOCAB.split(', ')
  const sbLanguage = sbSelectionSensitive ? lesson1.languageModels : []
  const wbLanguage = wbSelectionSensitive
    ? lesson2.languageModels
    : ACCEPTED_WB_LANGUAGE

  return [
    'Create a short, picture-led TWO-LESSON series to SUPPORT Big English 3 Unit 8 using ONLY these source pages:',
    '- Lesson 1: Student Book printed pages 130–131',
    '- Lesson 2: Workbook printed page 106 only',
    '',
    'Do not expand Workbook scope beyond printed page 106.',
    'Do not replace the textbook or workbook.',
    'Do not invent publisher audio scripts or missing story/exercise text.',
    'Workbook page 106 is verified source evidence for this series; it may not be the PDF currently open in the workspace.',
    '',
    'SOURCE LABELS:',
    '- [SB] = selected Student Book activity evidence from pages 130–131 only',
    '- [WB] = Workbook evidence from page 106 only',
    '- [PRIOR] = teacher-selected prior learning from earlier pages in the same unit',
    '- [TEACHER-ADDED · UNVERIFIED] = teacher-directed language not currently verified as prior-book evidence',
    '',
    'A. SERIES SCOPE',
    '',
    'Lesson 1 — Student Book pp. 130–131',
    sbSelectionSensitive
      ? 'Use only the selected Student Book activities below.'
      : 'Use the verified Student Book Story / Reading activities below.',
    ...sbActivityLines,
    '',
    sbVocabulary.length
      ? `Selected Lesson 1 words/models: ${sbVocabulary.join(', ')}.`
      : 'Selected Lesson 1 words/models: none safely attributable to the selected activities.',
    sbLanguage.length
      ? `Selected Lesson 1 language: ${sbLanguage.join(' | ')}`
      : 'Selected Lesson 1 language: none safely attributable to the selected activities.',
    '',
    'Lesson 2 — Workbook p. 106 only',
    wbSelectionSensitive
      ? 'Use only the selected Workbook activities below. Do not reconstruct excluded Workbook activities.'
      : 'Purpose: consolidate the story strand with Did Amy…? Yes/No she did short answers, personal dinner reflection, and Think Big healthy/unhealthy categorisation.',
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
    '- Keep Lesson 1 on Student Book pp. 130–131 and Lesson 2 on Workbook p. 106 only.',
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
    '- Stay on Student Book pages 130–131 and Workbook page 106 only.',
    '- Do not use or reconstruct unselected Student Book activities.',
    '- Do not use or reconstruct unselected Workbook activities.',
    '- Do not invent publisher audio scripts or unknown exercise items.',
  ].join('\n')
}

function renderSelectionAwareOutline(
  lesson: NeutralLessonPackageLesson,
): string {
  const isStudentBook = lesson.role === 'student_book'
  const source = isStudentBook ? 'SB' : 'WB'
  const lessonNumber = isStudentBook ? '1' : '2'
  const scope = isStudentBook
    ? 'Student Book pp. 130–131'
    : 'Workbook p. 106'
  const lines = [
    `Concise teacher-controlled outline — Lesson ${lessonNumber}`,
    `Short teaching sequence for ${scope} only. Use only selected activities; do not reconstruct excluded activities.`,
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
      const answer = activity.expectedAnswer
        ? ` Answer evidence: ${activity.expectedAnswer}`
        : ''
      const language =
        !isStudentBook && activity.languageFrame
          ? ` Model: ${activity.languageFrame}`
          : ''
      lines.push(
        `${index + 1}. [${source}] ${number}: ${activity.verifiedWording}${audio}${answer}${language}`,
      )
    })
  }
  lines.push('')
  return lines.join('\n')
}

function renderAcceptedLesson1Outline(): string {
  return [
    'Concise teacher-controlled outline — Lesson 1',
    'Short teaching sequence for Student Book pp. 130–131 only (Story / Reading · An Unhealthy Dinner). Keep book-working time; do not expand into a slide-by-slide script.',
    '',
    '1. [SB] Activity 6: Listen and read. Did Amy eat a healthy dinner? Use the official book audio (Track 154).',
    "2. [SB] Check understanding of the story question: Did Amy eat a healthy dinner? → No, she didn't.",
    '3. [SB] Activity 7: Read and choose. Complete the Amy-dinner comprehension items on the page.',
    '4. [SUPPLEMENTARY] Finish with a brief oral recap of why Amy’s dinner was unhealthy (student language; not a publisher script).',
    '',
  ].join('\n')
}

function renderAcceptedLesson2Outline(): string {
  return [
    'Concise teacher-controlled outline — Lesson 2',
    'Short teaching sequence for Workbook p. 106 only. Consolidation/practice of the Student Book story — not a second Lesson 1. Keep book-working time; do not expand into a slide-by-slide script.',
    '',
    "1. [WB] Activity 5: Read and answer. Write Yes, she did or No, she didn’t. (Did Amy…? short answers about the story dinner.)",
    '2. [WB] Activity 6: What did you eat for dinner yesterday? Was it healthy? Draw, write, and circle.',
    '3. [WB] Think Big: Healthy or unhealthy? Draw.',
    '4. [SUPPLEMENTARY] Finish with a brief oral check using one Did…? / Yes, she did / No, she didn’t item from the story strand.',
    '',
  ].join('\n')
}

export function renderBe3U08StoryNeutralPackageToChalkieShadow(
  lessonPackage: NeutralSbWbLessonPackage,
): Be3U08StoryChalkieShadowOutput {
  assertAcceptedStoryPackage(lessonPackage)
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
    lesson1Vocabulary:
      lessonPackage.lesson1.selection.status === 'all_selected'
        ? STORY_LESSON1_EMPTY_VOCABULARY
        : lessonPackage.lesson1.vocabulary.join(', '),
    lesson2Outline:
      lessonPackage.lesson2.selection.status === 'all_selected'
        ? renderAcceptedLesson2Outline()
        : renderSelectionAwareOutline(lessonPackage.lesson2),
    lesson2Vocabulary:
      lessonPackage.lesson2.selection.status === 'all_selected'
        ? STORY_LESSON2_ACCEPTED_VOCABULARY
        : lessonPackage.lesson2.selection.status === 'zero_selected'
          ? 'No Workbook activities selected.'
          : lessonPackage.lesson2.vocabulary.join(', ') ||
            'No Workbook words or models are safely attributable to the selected activities.',
  }
}
