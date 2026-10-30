/**
 * Chalkie renderer for the BE3 Unit 8 Content Connection / P.E. neutral package.
 *
 * Accepts SB pp.134–135 → WB pp.109–110 only. Does not invent audio wording,
 * calorie/science claims, answer keys, diagram placements, or Exercise Chart visuals.
 * NLL-derived knowledge may sit on the package but never becomes artifact prose.
 */
import type {
  NeutralLessonId,
  NeutralLessonPackageLesson,
  NeutralPriorSupportRecord,
  NeutralSbWbLessonPackage,
  NeutralSelectedActivityEvidence,
} from './buildNeutralSbWbLessonPackage'

const CLIL_PE_PACKAGE_REFERENCE = 'be3-sb-wb-u08-p134-135-wb109-110'
const CLIL_PE_RELATIONSHIP_ID =
  'be3_sb_wb_rel_u08_clil_pe_sb134-135_wb109-110'
const CLIL_PE_UNIT_TITLE = 'Healthy Living'

const CLIL_PE_LESSON1_VOCABULARY =
  'Verified Content Connection / P.E. vocabulary from the selected spread only: active, activities, body, burn, calorie, fit, measure, put on weight, rest. Do not invent additional science or health claims.'
const CLIL_PE_LESSON2_VOCABULARY =
  'Verified Workbook Content Connection vocabulary from the selected practice only: active, activities, energy, measure, put on weight, calorie-related box terms when those activities are selected. Do not invent nutritional guidance.'

/** Keyed activities whose answers must never appear as artifact prose. */
const SUPPRESS_ANSWER_PROSE_ACTIVITY_IDS = new Set([
  'bep3_sb_act_08_13',
  'bep3_sb_act_08_14',
  'bep3_sb_act_08_15',
  'bep3_sb_act_08_16',
  'bep_3_wb_act_109_11',
  'bep_3_wb_act_109_12',
  'bep_3_wb_act_110_13',
  'bep_3_wb_act_110_tb',
])

export type Be3U08ClilPeChalkieShadowOutput = {
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

function assertAcceptedClilPePackage(
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
    identity.packageReference === CLIL_PE_PACKAGE_REFERENCE &&
    identity.relationshipId === CLIL_PE_RELATIONSHIP_ID &&
    identity.relationshipType === 'workbook_practice_for' &&
    identity.verificationStatus === 'human_verified' &&
    identity.componentKey === 'clil_pe' &&
    identity.componentTitle === 'Content Connection / P.E.' &&
    identity.studentBookCatalogId === 'big_english_3_sb' &&
    identity.workbookCatalogId === 'big_english_3_wb' &&
    identity.unitNumber === 8 &&
    identity.unitTitle === CLIL_PE_UNIT_TITLE &&
    packaging.type === 'two_lesson_sb_wb' &&
    arraysEqual(packaging.lessonOrder, ['lesson1', 'lesson2']) &&
    lesson1.id === 'lesson1' &&
    lesson1.role === 'student_book' &&
    lesson1.scope.source === 'SB' &&
    lesson1.scope.catalogBookId === 'big_english_3_sb' &&
    arraysEqual(lesson1.scope.printedPages, [134, 135]) &&
    arraysEqual(lesson1.scope.pageIds, ['bep3_sb_p134', 'bep3_sb_p135']) &&
    lesson2.id === 'lesson2' &&
    lesson2.role === 'workbook' &&
    lesson2.scope.source === 'WB' &&
    lesson2.scope.catalogBookId === 'big_english_3_wb' &&
    arraysEqual(lesson2.scope.printedPages, [109, 110]) &&
    arraysEqual(lesson2.scope.pageIds, ['bep_3_wb_p109', 'bep_3_wb_p110']) &&
    lessonPackage.curriculumInterpretation == null &&
    !hasSchoolContext

  if (!valid) {
    throw new Error(
      `CLIL/P.E. Chalkie shadow rendering is not enabled for ${identity.packageReference}.`,
    )
  }
}

function activityIdOf(activity: NeutralSelectedActivityEvidence): string {
  return activity.references[0]?.activityId ?? ''
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

function suppressAnswerProse(activity: NeutralSelectedActivityEvidence): boolean {
  return SUPPRESS_ANSWER_PROSE_ACTIVITY_IDS.has(activityIdOf(activity))
}

function honestyNotes(
  activity: NeutralSelectedActivityEvidence,
): string[] {
  const id = activityIdOf(activity)
  const notes: string[] = []
  if (id === 'bep3_sb_act_08_13') {
    notes.push(
      '  Boundary: prediction/choice warm-up only; do not dump keyed choices as science claims.',
    )
  }
  if (id === 'bep3_sb_act_08_14') {
    notes.push(
      '  Dependency: official Audio 157 and the What Is a Calorie? article; checks Activity 13; use only publisher number figures; do not invent audio wording or broader science claims.',
    )
  }
  if (id === 'bep3_sb_act_08_15') {
    notes.push(
      '  Dependency: Activity 14 article; do not reconstruct excluded article text or dump answer keys.',
    )
  }
  if (id === 'bep3_sb_act_08_16') {
    notes.push(
      '  Boundary: publisher body-activity chart and word box only; do not invent classifications, figures, or good-food/bad-food framing.',
    )
  }
  if (id === 'bep3_sb_act_08_17') {
    notes.push(
      '  Dependency: questions at the end of the Activity 14 article; do not reconstruct excluded article content.',
    )
  }
  if (id === 'bep3_sb_act_08_18') {
    notes.push(
      '  Project + visual dependency: personal Exercise Chart; do not invent the chart visual content.',
    )
  }
  if (id === 'bep_3_wb_act_109_11') {
    notes.push(
      '  Boundary: six-gap box completion only; do not dump cloze answers or invent nutritional guidance.',
    )
  }
  if (id === 'bep_3_wb_act_109_12') {
    notes.push(
      '  Dependency: official Audio 158 to check circled choices; do not invent audio order, wording, or answers.',
    )
  }
  if (id === 'bep_3_wb_act_110_13') {
    notes.push(
      '  Dependency: Look at Activity 12; selecting this must not reconstruct excluded Activity 12 content.',
    )
  }
  if (id === 'bep_3_wb_act_110_14') {
    notes.push(
      '  Visual dependency: Inside / Outside / Inside or Outside diagram; do not invent placements or unseen diagram detail.',
    )
  }
  if (id === 'bep_3_wb_act_110_tb') {
    notes.push(
      '  Think Big: treat as its own choose task; do not expand into unsupported healthy/unhealthy doctrine.',
    )
  }
  return notes
}

function activityPromptLines(
  lesson: NeutralLessonPackageLesson,
): string[] {
  if (lesson.selection.status === 'zero_selected') {
    return lesson.role === 'student_book'
      ? [
          '- No current Student Book activities were selected.',
          '- Do not reconstruct or infer content from unselected CLIL/P.E. page activities, article context, NLL membership, or historical Experiment 14 material.',
        ]
      : [
          '- No Workbook activities were selected.',
          '- Do not reconstruct or infer content from unselected Workbook CLIL/P.E. activities.',
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
    if (activity.languageFrame) {
      lines.push(`  Language: ${activity.languageFrame}`)
    }
    if (hasAudio(lesson, activity)) {
      const note = audioNote(lesson, activity)
      lines.push(`  Use the official book audio${note ? ` (${note})` : ''}.`)
    }
    if (
      activityIdOf(activity) === 'bep3_sb_act_08_18' ||
      activityIdOf(activity) === 'bep_3_wb_act_110_14'
    ) {
      lines.push(
        '  Visual dependency: use the page chart/diagram; do not invent unseen visual detail.',
      )
    }
    if (!suppressAnswerProse(activity)) {
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
    } else {
      for (const item of activity.items) {
        const itemLabel = item.itemNumber ? `Item ${item.itemNumber}` : 'Item'
        if (item.prompt) lines.push(`  ${itemLabel} task: ${item.prompt}`)
      }
    }
    lines.push(...honestyNotes(activity))
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
    '- Lesson 1: Student Book printed pages 134–135',
    '- Lesson 2: Workbook printed pages 109–110',
    '',
    'Do not expand beyond this exact Content Connection / P.E. relationship.',
    'Do not replace the Student Book or Workbook.',
    'Do not invent publisher audio wording, calorie/science claims, answer keys, diagram placements, or Exercise Chart visuals.',
    'Use the official book audio and visuals where the selected activity requires them.',
    'Workbook pages 109–110 are verified source evidence for this series; they may not be the PDF currently open in the workspace.',
    'Treat Lesson 2 as consolidation and practice of the Student Book Content Connection / P.E. strand—not a second presentation of Lesson 1.',
    '',
    'SOURCE LABELS:',
    '- [SB] = Student Book evidence from pages 134–135 only',
    '- [WB] = Workbook evidence from pages 109–110 only',
    '- [PRIOR] = teacher-selected prior learning, not current-page evidence',
    '- [TEACHER-ADDED · UNVERIFIED] = teacher-directed language not verified as publisher evidence',
    '- [SUPPLEMENTARY] = teacher-controlled support, not publisher wording',
    '',
    'A. SERIES SCOPE',
    '',
    'Lesson 1 — Student Book pp. 134–135',
    'Purpose: support reading/content/P.E. work on What Is a Calorie? through the verified Content Connection activities.',
    '',
    '[SB p.134] Activity 13: Read, guess, and choose; keep the prediction/choice boundary; do not dump keyed choices as science claims.',
    '[SB p.134] Activity 14: Listen to Audio 157 and read the article; identify what 60, 12,000, 9, and 10 mean; check Activity 13; use only publisher figures; do not invent audio wording.',
    '[SB p.135] Activity 15: Answer five comprehension questions about the Activity 14 article; do not dump answer keys.',
    '[SB p.135] Activity 16: Complete the body-activity chart from the word box, then add more; do not invent classifications or good-food/bad-food framing.',
    '[SB p.135] Activity 17: Partner ask/answer using questions at the end of the Activity 14 article; do not reconstruct excluded article text.',
    '[SB p.135] Activity 18: Make a personal Exercise Chart; preserve the visual dependency; do not invent chart visuals.',
    '',
    'Lesson 2 — Workbook pp. 109–110',
    'Purpose: consolidate calorie/energy/activity Content Connection practice through the verified Workbook activities.',
    '',
    '[WB p.109] Activity 11: Complete the six-gap calorie text from the word box; do not dump cloze answers.',
    '[WB p.109] Activity 12: Read and circle, then listen to Audio 158 to check; do not invent audio wording or answers.',
    '[WB p.110] Activity 13: Look at Activity 12 and match five sentence halves; do not reconstruct excluded Activity 12.',
    '[WB p.110] Activity 14: Complete the Inside / Outside / Inside or Outside diagram and add five more; do not invent placements.',
    '[WB p.110] Think Big: Read and choose; keep it as its own task; avoid unsupported health doctrine.',
    '',
    'B. TEACHER-SELECTED PRIOR LEARNING',
    '',
    ...priorSupportLines(lessonPackage.priorSupport),
    '',
    'C. TEACHING GUIDANCE',
    '',
    '- Keep Lesson 1 on Student Book pp. 134–135 and Lesson 2 on Workbook pp. 109–110.',
    '- Use only selected current-page activities; do not reconstruct excluded activities from page context, NLL membership, or Experiment 14 history.',
    '- Keep Audio 157 / Audio 158 as official-book dependencies when Activities 14 / 12 are selected; do not generate transcripts.',
    '- Preserve article, chart, diagram, project, and Think Big boundaries honestly.',
    '- Use selected prior or teacher-added language only as clearly labelled support; it never replaces current CLIL/P.E. evidence.',
    '- Keep both lessons concise and classroom-usable.',
    '- Success means students are prepared to work with SB 134–135 and WB 109–110.',
    '',
    'D. HARD BOUNDARIES',
    '',
    '- Do not use Language in Action pages SB 132–133 or WB 107–108 as current CLIL/P.E. evidence.',
    '- Do not use Grammar pages SB 136–137 or WB 111–112.',
    '- Do not use Culture pages SB 138–139 or WB 113–114.',
    '- Do not use or reconstruct unselected Student Book or Workbook activities.',
    '- Do not invent publisher audio, calorie/science, nutritional, medical, diagram, or answer-key content.',
    '- Do not claim teacher-added language is publisher evidence.',
    '- Do not load or quote NLL-derived summaries or Book Intelligence as artifact prose.',
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
    '- Lesson 1: Student Book printed pages 134–135',
    '- Lesson 2: Workbook printed pages 109–110',
    '',
    'Do not expand beyond this exact Content Connection / P.E. relationship.',
    'Do not replace the Student Book or Workbook.',
    'Do not invent publisher audio wording, calorie/science claims, answer keys, diagram placements, or Exercise Chart visuals.',
    'Workbook pages 109–110 are verified source evidence for this series; they may not be the PDF currently open in the workspace.',
    '',
    'SOURCE LABELS:',
    '- [SB] = selected Student Book activity evidence from pages 134–135 only',
    '- [WB] = selected Workbook activity evidence from pages 109–110 only',
    '- [PRIOR] = teacher-selected prior learning, not current-page evidence',
    '- [TEACHER-ADDED · UNVERIFIED] = teacher-directed language not verified as publisher evidence',
    '',
    'A. SERIES SCOPE',
    '',
    'Lesson 1 — Student Book pp. 134–135',
    sbSelectionSensitive
      ? 'Use only the selected Student Book activities below.'
      : 'Use the verified Student Book Content Connection / P.E. activities below.',
    ...sbActivityLines,
    '',
    sbVocabulary.length
      ? `Selected Lesson 1 words/models: ${sbVocabulary.join(', ')}.`
      : 'Selected Lesson 1 words/models: none safely attributable to the selected activities.',
    sbLanguage.length
      ? `Selected Lesson 1 language: ${sbLanguage.join(' | ')}`
      : 'Selected Lesson 1 language: none safely attributable to the selected activities.',
    '',
    'Lesson 2 — Workbook pp. 109–110',
    wbSelectionSensitive
      ? 'Use only the selected Workbook activities below. Do not reconstruct excluded Workbook activities.'
      : 'Purpose: consolidate calorie/energy/activity Content Connection practice through the verified Workbook activities.',
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
    '- Keep Lesson 1 on Student Book pp. 134–135 and Lesson 2 on Workbook pp. 109–110.',
    noLesson1Activities
      ? '- Lesson 1: no current Student Book activities were selected; do not recreate them from page context, article memory, or Experiment 14.'
      : sbSelectionSensitive
        ? '- Lesson 1: use only the selected Student Book activities listed above; do not reconstruct excluded activities.'
        : '- Lesson 1: use the verified Student Book activities listed above.',
    noLesson2Activities
      ? '- Lesson 2: no Workbook activities were selected; keep the lesson slot valid but do not recreate or substitute Workbook teaching content.'
      : wbSelectionSensitive
        ? '- Lesson 2: use only the selected Workbook activities listed above; do not reconstruct excluded activities.'
        : '- Lesson 2: use the verified Workbook consolidation/practice activities listed above.',
    '- Prior learning remains separate and never replaces unselected current CLIL/P.E. evidence.',
    '- Keep both lessons concise and classroom-usable.',
    '',
    'D. HARD BOUNDARIES',
    '',
    '- Do not use Language in Action pages SB 132–133 or WB 107–108 as current CLIL/P.E. evidence.',
    '- Do not use Grammar pages SB 136–137 or WB 111–112.',
    '- Do not use Culture pages SB 138–139 or WB 113–114.',
    '- Do not use or reconstruct unselected Student Book or Workbook activities.',
    '- Do not invent publisher audio, calorie/science, nutritional, medical, diagram, or answer-key content.',
    '- Do not load or quote NLL-derived summaries as artifact prose.',
  ].join('\n')
}

function renderAcceptedLesson1Outline(): string {
  return [
    'Concise teacher-controlled outline — Lesson 1',
    'Short teaching sequence for Student Book pp. 134–135 only (Content Connection / P.E.). Keep book-working time; do not expand into a slide-by-slide script.',
    '',
    '1. [SB] Activity 13: Prediction/choice warm-up; do not dump keyed choices as science claims.',
    '2. [SB] Activity 14: Listen to Audio 157 and read; identify publisher numbers; check Activity 13; no invented audio wording.',
    '3. [SB] Activity 15: Answer comprehension questions about the Activity 14 article; no answer-key dump.',
    '4. [SB] Activity 16: Complete the body-activity chart; no invented classifications or good-food/bad-food framing.',
    '5. [SB] Activity 17: Partner ask/answer from the end of the Activity 14 article.',
    '6. [SB] Activity 18: Personal Exercise Chart project; preserve visual dependency without inventing visuals.',
    '7. [SUPPLEMENTARY] Finish with one brief teacher-selected content check; do not present it as publisher wording.',
    '',
  ].join('\n')
}

function renderAcceptedLesson2Outline(): string {
  return [
    'Concise teacher-controlled outline — Lesson 2',
    'Short teaching sequence for Workbook pp. 109–110 only. Consolidation and practice of the Student Book Content Connection / P.E. strand—not a second Lesson 1. Keep book-working time; do not expand into a slide-by-slide script.',
    '',
    '1. [WB] Activity 11: Six-gap box completion; do not dump cloze answers.',
    '2. [WB] Activity 12: Circle then check with Audio 158; do not invent audio wording or answers.',
    '3. [WB] Activity 13: Match using Activity 12; do not reconstruct excluded Activity 12.',
    '4. [WB] Activity 14: Inside/Outside diagram; do not invent placements.',
    '5. [WB] Think Big: Read and choose; keep as its own task.',
    '6. [SUPPLEMENTARY] Finish with one brief teacher-selected content check; do not present it as publisher wording.',
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
    ? 'Student Book pp. 134–135'
    : 'Workbook pp. 109–110'
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
      const honesty = honestyNotes(activity)
        .map((note) => note.replace(/^\s+/, ' '))
        .join('')
      lines.push(
        `${index + 1}. [${source}] ${number}: ${activity.verifiedWording}${audio}${honesty}`,
      )
    })
  }
  lines.push('')
  return lines.join('\n')
}

export function renderBe3U08ClilPeNeutralPackageToChalkieShadow(
  lessonPackage: NeutralSbWbLessonPackage,
): Be3U08ClilPeChalkieShadowOutput {
  assertAcceptedClilPePackage(lessonPackage)
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
        ? CLIL_PE_LESSON1_VOCABULARY
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
        ? CLIL_PE_LESSON2_VOCABULARY
        : lessonPackage.lesson2.selection.status === 'zero_selected'
          ? 'No Workbook activities selected.'
          : lessonPackage.lesson2.vocabulary.join(', ') ||
            lessonPackage.lesson2.languageModels.join(' | ') ||
            'No Workbook words or models are safely attributable to the selected activities.',
  }
}
