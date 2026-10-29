/**
 * Non-serving Chalkie renderer for the BE3 Unit 8 Language in Action package.
 *
 * Accepts SB pp.132–133 → WB pp.107–108 only. Does not load NLL or BI.
 * Not wired into the served Chalkie overlay or lesson-context resolver.
 */
import type {
  NeutralLessonId,
  NeutralLessonPackageLesson,
  NeutralPriorSupportRecord,
  NeutralSbWbLessonPackage,
  NeutralSelectedActivityEvidence,
} from './buildNeutralSbWbLessonPackage'

const LIA_PACKAGE_REFERENCE = 'be3-sb-wb-u08-p132-133-wb107-108'
const LIA_RELATIONSHIP_ID = 'be3_sb_wb_rel_u08_lia_sb132-133_wb107-108'
const LIA_UNIT_TITLE = 'Healthy Living'

const LIA_LESSON1_VOCABULARY =
  "No dedicated target vocabulary is listed for SB pp. 132–133. Language models: Did you have breakfast? / No, I didn't. | Did he get enough sleep? / Yes, he did. | Did you do any exercise yesterday? / No, I didn't."
const LIA_LESSON2_VOCABULARY =
  "No dedicated target vocabulary is listed for WB pp. 107–108. Language model: Did he get enough sleep? / Yes, he did. / No, he didn't."

export type Be3U08LiaChalkieShadowOutput = {
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

function assertAcceptedLiaPackage(
  lessonPackage: NeutralSbWbLessonPackage,
): void {
  const identity = lessonPackage.identity
  const packaging = lessonPackage.packaging
  const lesson1 = lessonPackage.lesson1
  const lesson2 = lessonPackage.lesson2
  const hasSchoolContext =
    Object.prototype.hasOwnProperty.call(lessonPackage, 'schoolContext') &&
    (lessonPackage as { schoolContext?: unknown }).schoolContext != null

  const valid =
    identity.packageReference === LIA_PACKAGE_REFERENCE &&
    identity.relationshipId === LIA_RELATIONSHIP_ID &&
    identity.relationshipType === 'workbook_practice_for' &&
    identity.verificationStatus === 'human_verified' &&
    identity.componentKey === 'lia' &&
    identity.componentTitle === 'Language in Action' &&
    identity.studentBookCatalogId === 'big_english_3_sb' &&
    identity.workbookCatalogId === 'big_english_3_wb' &&
    identity.unitNumber === 8 &&
    identity.unitTitle === LIA_UNIT_TITLE &&
    packaging.type === 'two_lesson_sb_wb' &&
    arraysEqual(packaging.lessonOrder, ['lesson1', 'lesson2']) &&
    lesson1.id === 'lesson1' &&
    lesson1.role === 'student_book' &&
    lesson1.scope.source === 'SB' &&
    lesson1.scope.catalogBookId === 'big_english_3_sb' &&
    arraysEqual(lesson1.scope.printedPages, [132, 133]) &&
    arraysEqual(lesson1.scope.pageIds, ['bep3_sb_p132', 'bep3_sb_p133']) &&
    lesson2.id === 'lesson2' &&
    lesson2.role === 'workbook' &&
    lesson2.scope.source === 'WB' &&
    lesson2.scope.catalogBookId === 'big_english_3_wb' &&
    arraysEqual(lesson2.scope.printedPages, [107, 108]) &&
    arraysEqual(lesson2.scope.pageIds, ['bep_3_wb_p107', 'bep_3_wb_p108']) &&
    lessonPackage.curriculumInterpretation == null &&
    lessonPackage.derivedKnowledge == null &&
    !hasSchoolContext

  if (!valid) {
    throw new Error(
      `Language in Action Chalkie shadow rendering is not enabled for ${identity.packageReference}.`,
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

function hasAudio(
  lesson: NeutralLessonPackageLesson,
  activity: NeutralSelectedActivityEvidence,
): boolean {
  return lesson.audioReferences.some(
    (reference) => reference.cardId === activity.cardId,
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
  const selectedNumbers = new Set(
    lesson.selectedActivities
      .map((activity) => activity.activityNumber)
      .filter((value): value is string => Boolean(value)),
  )
  const lines: string[] = []

  for (const activity of lesson.selectedActivities) {
    const isWbActivity7 =
      source === 'WB' && activity.activityNumber === '7'
    const suppressAct10Answers =
      activity.activityNumber === '10' &&
      source === 'WB' &&
      !selectedNumbers.has('9')
    const activityLabel = activity.activityNumber
      ? `Activity ${activity.activityNumber}`
      : 'Activity'
    lines.push(
      `- [${source} p.${activity.printedPage}] ${activityLabel}: ${activity.verifiedWording}`,
    )
    if (
      !isWbActivity7 &&
      activity.prompt &&
      activity.prompt !== activity.verifiedWording
    ) {
      lines.push(`  Task evidence: ${activity.prompt}`)
    }
    if (activity.expectedAnswer && !isWbActivity7 && !suppressAct10Answers) {
      lines.push(`  Answer evidence: ${activity.expectedAnswer}`)
    }
    if (!isWbActivity7) {
      for (const item of activity.items) {
        const itemLabel = item.itemNumber ? `Item ${item.itemNumber}` : 'Item'
        if (item.prompt) lines.push(`  ${itemLabel} task: ${item.prompt}`)
        if (item.expectedAnswer && !suppressAct10Answers) {
          lines.push(`  ${itemLabel} answer evidence: ${item.expectedAnswer}`)
        }
      }
    }
    if (activity.languageFrame) {
      lines.push(`  Language: ${activity.languageFrame}`)
    }
    if (hasAudio(lesson, activity)) {
      const note = audioNote(lesson, activity)
      lines.push(`  Use the official book audio${note ? ` (${note})` : ''}.`)
    }
    if (isWbActivity7) {
      lines.push(
        '  Visual/sticker dependency: use the Workbook illustrations and stickers; do not invent scene details, placements or answers.',
      )
    }
    if (suppressAct10Answers) {
      lines.push(
        '  Dependency: this task uses the Activity 9 illustrations; do not reconstruct excluded Activity 9 evidence or answers.',
      )
    }
  }
  return lines
}

function targetLessonLabel(
  targetLessons: readonly NeutralLessonId[],
): string {
  const hasLesson1 = targetLessons.includes('lesson1')
  const hasLesson2 = targetLessons.includes('lesson2')
  if (hasLesson1 && hasLesson2) return '[Lessons 1 and 2]'
  if (hasLesson1) return '[Lesson 1]'
  if (hasLesson2) return '[Lesson 2]'
  return ''
}

function priorSupportLines(
  records: readonly NeutralPriorSupportRecord[],
): string[] {
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
      const target = targetLessonLabel(record.targetLessons)
      const targetSuffix = target ? ` ${target}` : ''
      lines.push(
        source
          ? `${record.provenance} ${record.label} (${source})${targetSuffix}: ${record.frame}`
          : `${record.provenance} ${record.label}${targetSuffix}: ${record.frame}`,
      )
    }
  }

  if (teacherAdded.length > 0) {
    lines.push('')
    for (const record of teacherAdded) {
      const title = record.label.trim()
      const target = targetLessonLabel(record.targetLessons)
      const targetSuffix = target ? ` ${target}` : ''
      lines.push(
        `[TEACHER-ADDED · UNVERIFIED] ${title ? `${title}${targetSuffix}: ` : target ? `${target}: ` : ''}${record.frame}`,
      )
      if (record.purpose) lines.push(`Purpose: ${record.purpose}`)
    }
  }

  return lines
}

function renderAcceptedAllSelectedDetailedHandoff(
  lessonPackage: NeutralSbWbLessonPackage,
): string {
  return [
    'Create a short, picture-led TWO-LESSON series to SUPPORT Big English 3 Unit 8 using ONLY these source pages:',
    '- Lesson 1: Student Book printed pages 132–133',
    '- Lesson 2: Workbook printed pages 107–108',
    '',
    'Do not expand beyond this exact Language in Action relationship.',
    'Do not replace the Student Book or Workbook.',
    'Do not invent publisher audio scripts, sticker placements, illustration details, or missing answers.',
    'Use the official book audio, stickers and illustrations where the selected activity requires them.',
    'Workbook pages 107–108 are verified source evidence for this series; they may not be the PDF currently open in the workspace.',
    'Treat Lesson 2 as consolidation and practice of the Student Book language—not a second presentation of Lesson 1.',
    '',
    'SOURCE LABELS:',
    '- [SB] = Student Book evidence from pages 132–133 only',
    '- [WB] = Workbook evidence from pages 107–108 only',
    '- [PRIOR] = teacher-selected prior learning, not current-page evidence',
    '- [TEACHER-ADDED · UNVERIFIED] = teacher-directed language not verified as publisher evidence',
    '- [SUPPLEMENTARY] = teacher-controlled support, not publisher wording',
    '',
    'A. SERIES SCOPE',
    '',
    'Lesson 1 — Student Book pp. 132–133',
    'Purpose: practise past-simple Did …? questions and short answers through the verified Language in Action activities.',
    '',
    '[SB p.132] Activity 8: Listen and look at the sentences. Help Luke and Amy make more. Use official Audio 155 and the visible sentence models and phrase bank; do not invent audio wording.',
    '[SB p.132] Activity 9: Match the phrases. Make five questions about yesterday. Then ask and answer.',
    "[SB p.133] Activity 10: Complete four dialogues with did or didn't.",
    '[SB p.133] Activity 11: Put the words in order to make five questions. Then ask.',
    '[SB p.133] Activity 12: Read and match six Did …? questions and answers. Then change the answers.',
    "[SB] Verified language models: Did you have breakfast? / No, I didn't. | Did he get enough sleep? / Yes, he did. | Did you do any exercise yesterday? / No, I didn't.",
    '[SB] Dedicated target vocabulary on these pages: none listed.',
    '',
    'Lesson 2 — Workbook pp. 107–108',
    "Purpose: consolidate Did …? questions, did/didn't responses and past-activity comprehension through the verified Workbook practice.",
    '',
    '[WB p.107] Activity 7: Listen and stick to show what Grace and Carlos did on the weekend. Use official Audio 156, illustrations and stickers; do not invent the audio sequence, placements or answers.',
    "[WB p.107] Activity 8: Read and complete two dialogues with did or didn't.",
    '[WB p.108] Activity 9: Look at the illustrations and circle the past activity that completes each of three sentences.',
    '[WB p.108] Activity 10: Use the Activity 9 illustrations to answer seven Did …? questions. The answers depend on those illustrations; do not reconstruct an excluded Activity 9.',
    "[WB] Verified language model: Did he get enough sleep? / Yes, he did. / No, he didn't.",
    '[WB] Dedicated target vocabulary on these pages: none listed.',
    '',
    'B. TEACHER-SELECTED PRIOR LEARNING',
    '',
    ...priorSupportLines(lessonPackage.priorSupport),
    '',
    'C. TEACHING GUIDANCE',
    '',
    '- Keep Lesson 1 on Student Book pp. 132–133 and Lesson 2 on Workbook pp. 107–108.',
    '- Use only selected current-page activities; do not reconstruct excluded activities from page context.',
    '- Keep Audio 155 and Audio 156 as official-book dependencies; do not generate transcripts.',
    '- Keep the Activity 7 sticker task and Activities 9–10 illustration tasks anchored to the physical Workbook.',
    '- Use selected prior or teacher-added language only as clearly labelled support.',
    '- Keep both lessons concise and classroom-usable.',
    '- Success means students are prepared to work with SB 132–133 and WB 107–108.',
    '',
    'D. HARD BOUNDARIES',
    '',
    '- Do not use Story pages SB 130–131 or WB 106.',
    '- Do not use CLIL/P.E. pages SB 134–135 or WB 109–110.',
    '- Do not use or reconstruct unselected Student Book or Workbook activities.',
    '- Do not invent publisher audio, sticker or illustration content.',
    '- Do not claim teacher-added language is publisher evidence.',
    '- Do not load or quote NLL-derived summaries or Book Intelligence.',
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
  const sbActivityLines = activityPromptLines(lesson1)
  const wbActivityLines = activityPromptLines(lesson2)
  const sbVocabulary = lesson1.vocabulary
  const wbVocabulary = lesson2.vocabulary
  const sbLanguage = lesson1.languageModels
  const wbLanguage = lesson2.languageModels

  return [
    'Create a short, picture-led TWO-LESSON series to SUPPORT Big English 3 Unit 8 using ONLY these source pages:',
    '- Lesson 1: Student Book printed pages 132–133',
    '- Lesson 2: Workbook printed pages 107–108',
    '',
    'Do not expand beyond this exact Language in Action relationship.',
    'Do not replace the Student Book or Workbook.',
    'Do not invent publisher audio scripts, sticker placements, illustration details, or missing answers.',
    'Workbook pages 107–108 are verified source evidence for this series; they may not be the PDF currently open in the workspace.',
    '',
    'SOURCE LABELS:',
    '- [SB] = selected Student Book activity evidence from pages 132–133 only',
    '- [WB] = selected Workbook activity evidence from pages 107–108 only',
    '- [PRIOR] = teacher-selected prior learning, not current-page evidence',
    '- [TEACHER-ADDED · UNVERIFIED] = teacher-directed language not verified as publisher evidence',
    '',
    'A. SERIES SCOPE',
    '',
    'Lesson 1 — Student Book pp. 132–133',
    sbSelectionSensitive
      ? 'Use only the selected Student Book activities below.'
      : 'Use the verified Student Book Language in Action activities below.',
    ...sbActivityLines,
    '',
    sbVocabulary.length
      ? `Selected Lesson 1 words/models: ${sbVocabulary.join(', ')}.`
      : 'Selected Lesson 1 words/models: none safely attributable to the selected activities.',
    sbLanguage.length
      ? `Selected Lesson 1 language: ${sbLanguage.join(' | ')}`
      : 'Selected Lesson 1 language: none safely attributable to the selected activities.',
    '',
    'Lesson 2 — Workbook pp. 107–108',
    wbSelectionSensitive
      ? 'Use only the selected Workbook activities below. Do not reconstruct excluded Workbook activities.'
      : "Purpose: consolidate Did …? questions, did/didn't responses and past-activity comprehension through the verified Workbook practice.",
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
    '- Keep Lesson 1 on Student Book pp. 132–133 and Lesson 2 on Workbook pp. 107–108.',
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
    '- Do not use Story pages SB 130–131 or WB 106.',
    '- Do not use CLIL/P.E. pages SB 134–135 or WB 109–110.',
    '- Do not use or reconstruct unselected Student Book or Workbook activities.',
    '- Do not invent publisher audio, sticker or illustration content.',
  ].join('\n')
}

function renderAcceptedLesson1Outline(): string {
  return [
    'Concise teacher-controlled outline — Lesson 1',
    'Short teaching sequence for Student Book pp. 132–133 only (Language in Action). Keep book-working time; do not expand into a slide-by-slide script.',
    '',
    '1. [SB] Activity 8: Listen and look at the sentence models. Use official Audio 155; do not invent transcript wording.',
    '2. [SB] Activity 9: Match five phrase halves, make questions about yesterday, then ask and answer.',
    "3. [SB] Activity 10: Complete four dialogues with did or didn't.",
    '4. [SB] Activity 11: Order words to make five questions, then ask them.',
    '5. [SB] Activity 12: Match six Did …? questions and answers, then change the answers.',
    '6. [SUPPLEMENTARY] Finish with one brief teacher-selected Did …? exchange; do not present it as publisher wording.',
    '',
  ].join('\n')
}

function renderAcceptedLesson2Outline(): string {
  return [
    'Concise teacher-controlled outline — Lesson 2',
    'Short teaching sequence for Workbook pp. 107–108 only. Consolidation and practice of the Student Book Language in Action strand—not a second Lesson 1. Keep book-working time; do not expand into a slide-by-slide script.',
    '',
    '1. [WB] Activity 7: Listen and stick. Use official Audio 156, illustrations and stickers; do not supply unverified placements or answers.',
    "2. [WB] Activity 8: Complete two dialogues with did or didn't.",
    '3. [WB] Activity 9: Use the illustrations to circle the correct past activity in three items.',
    '4. [WB] Activity 10: Use the Activity 9 illustrations to answer seven Did …? questions; do not reconstruct excluded visual evidence.',
    '5. [SUPPLEMENTARY] Finish with one brief teacher-selected Did …? check; do not present it as publisher wording.',
    '',
  ].join('\n')
}

function renderSelectionAwareOutline(
  lesson: NeutralLessonPackageLesson,
): string {
  const isStudentBook = lesson.role === 'student_book'
  const source = isStudentBook ? 'SB' : 'WB'
  const lessonNumber = isStudentBook ? '1' : '2'
  const scope = isStudentBook
    ? 'Student Book pp. 132–133'
    : 'Workbook pp. 107–108'
  const selectedNumbers = new Set(
    lesson.selectedActivities
      .map((activity) => activity.activityNumber)
      .filter((value): value is string => Boolean(value)),
  )
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
      const audio = hasAudio(lesson, activity)
        ? ` Use the official book audio${
            audioNote(lesson, activity)
              ? ` (${audioNote(lesson, activity)})`
              : ''
          }.`
        : ''
      const dependency =
        !isStudentBook &&
        activity.activityNumber === '10' &&
        !selectedNumbers.has('9')
          ? ' Depends on Activity 9 illustrations; do not reconstruct excluded Activity 9.'
          : ''
      lines.push(
        `${index + 1}. [${source}] ${number}: ${activity.verifiedWording}${audio}${dependency}`,
      )
    })
  }
  lines.push('')
  return lines.join('\n')
}

export function renderBe3U08LiaNeutralPackageToChalkieShadow(
  lessonPackage: NeutralSbWbLessonPackage,
): Be3U08LiaChalkieShadowOutput {
  assertAcceptedLiaPackage(lessonPackage)
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
        ? LIA_LESSON1_VOCABULARY
        : lessonPackage.lesson1.selection.status === 'zero_selected'
          ? ''
          : lessonPackage.lesson1.vocabulary.join(', ') ||
            lessonPackage.lesson1.languageModels.join(' | ') ||
            'No Student Book words or models are safely attributable to the selected activities.',
    lesson2Outline:
      lessonPackage.lesson2.selection.status === 'all_selected'
        ? renderAcceptedLesson2Outline()
        : renderSelectionAwareOutline(lessonPackage.lesson2),
    lesson2Vocabulary:
      lessonPackage.lesson2.selection.status === 'all_selected'
        ? LIA_LESSON2_VOCABULARY
        : lessonPackage.lesson2.selection.status === 'zero_selected'
          ? 'No Workbook activities selected.'
          : lessonPackage.lesson2.vocabulary.join(', ') ||
            lessonPackage.lesson2.languageModels.join(' | ') ||
            'No Workbook words or models are safely attributable to the selected activities.',
  }
}
