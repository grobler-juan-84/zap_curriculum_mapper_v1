/**
 * Chalkie renderer for the BE3 Unit 8 Review neutral package.
 *
 * Accepts SB p.143 → WB p.117 only. Does not invent transcripts, keyed answer
 * dumps, model paragraphs, sample open-production responses, rubrics, clause
 * completions, cloze paragraphs, health content, or Phonics material.
 * NLL-derived knowledge may sit on the package but never becomes artifact prose.
 */
import type {
  NeutralLessonId,
  NeutralLessonPackageLesson,
  NeutralPriorSupportRecord,
  NeutralSbWbLessonPackage,
  NeutralSelectedActivityEvidence,
} from './buildNeutralSbWbLessonPackage'

const REVIEW_PACKAGE_REFERENCE = 'be3-sb-wb-u08-p143-wb117'
const REVIEW_RELATIONSHIP_ID = 'be3_sb_wb_rel_u08_review_sb143_wb117'
const REVIEW_UNIT_TITLE = 'Healthy Living'

const REVIEW_LESSON1_VOCABULARY =
  "Verified Review language from SB p.143 only: Did / did / didn't choice frames and past-form prompts when those activities are selected. Do not invent SB audio, survey answers, or earlier-component aggregation."
const REVIEW_LESSON2_VOCABULARY =
  'Verified Workbook Review vocabulary from p.117 only: verb-form choice, publisher cloze box words, and gerund-as-subject stems when those activities are selected. Gerund evidence remains Workbook-only and must not be back-ported into Student Book Review summaries.'

/** Keyed / answer-sensitive activities whose answers must never appear as artifact prose. */
const SUPPRESS_ANSWER_PROSE_ACTIVITY_IDS = new Set([
  'bep3_sb_act_08_39',
  'bep3_sb_act_08_41',
  'bep_3_wb_act_117_31',
  'bep_3_wb_act_117_32',
  'bep_3_wb_act_117_33',
])

export type Be3U08ReviewChalkieShadowOutput = {
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

function assertAcceptedReviewPackage(
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
    identity.packageReference === REVIEW_PACKAGE_REFERENCE &&
    identity.relationshipId === REVIEW_RELATIONSHIP_ID &&
    identity.relationshipType === 'workbook_practice_for' &&
    identity.verificationStatus === 'human_verified' &&
    identity.componentKey === 'review' &&
    identity.componentTitle === 'Review' &&
    identity.studentBookCatalogId === 'big_english_3_sb' &&
    identity.workbookCatalogId === 'big_english_3_wb' &&
    identity.unitNumber === 8 &&
    identity.unitTitle === REVIEW_UNIT_TITLE &&
    packaging.type === 'two_lesson_sb_wb' &&
    arraysEqual(packaging.lessonOrder, ['lesson1', 'lesson2']) &&
    lesson1.id === 'lesson1' &&
    lesson1.role === 'student_book' &&
    lesson1.scope.source === 'SB' &&
    lesson1.scope.catalogBookId === 'big_english_3_sb' &&
    arraysEqual(lesson1.scope.printedPages, [143]) &&
    arraysEqual(lesson1.scope.pageIds, ['bep3_sb_p143']) &&
    lesson2.id === 'lesson2' &&
    lesson2.role === 'workbook' &&
    lesson2.scope.source === 'WB' &&
    lesson2.scope.catalogBookId === 'big_english_3_wb' &&
    arraysEqual(lesson2.scope.printedPages, [117]) &&
    arraysEqual(lesson2.scope.pageIds, ['bep_3_wb_p117']) &&
    lessonPackage.curriculumInterpretation == null &&
    !hasSchoolContext

  if (!valid) {
    throw new Error(
      `Review Chalkie shadow rendering is not enabled for ${identity.packageReference}.`,
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

function honestyNotes(activity: NeutralSelectedActivityEvidence): string[] {
  const id = activityIdOf(activity)
  const notes: string[] = []
  if (id === 'bep3_sb_act_08_39') {
    notes.push(
      '  Boundary: four keyed Did/did/didn\'t choices; protect answers; no SB audio; preserve page-level visual dependency.',
    )
  }
  if (id === 'bep3_sb_act_08_40') {
    notes.push(
      '  Open survey: publisher Did you…? frames plus two student-added questions; do not invent personal answers or require disclosure.',
    )
  }
  if (id === 'bep3_sb_act_08_41') {
    notes.push(
      '  Boundary: six keyed past verb forms; protect answers; do not invent SB audio.',
    )
  }
  if (id === 'bep_3_wb_act_117_31') {
    notes.push(
      '  Boundary: three keyed verb-form circles; preserve page visual dependency; do not reconstruct excluded choices.',
    )
  }
  if (id === 'bep_3_wb_act_117_32') {
    notes.push(
      '  Boundary: six-gap cloze from the publisher word box; do not invent box words or reconstruct excluded gaps.',
    )
  }
  if (id === 'bep_3_wb_act_117_33') {
    notes.push(
      '  WB-only: five keyed gerund-as-subject sentences; do not back-port into Student Book Review summaries.',
    )
  }
  return notes
}

function activityPromptLines(lesson: NeutralLessonPackageLesson): string[] {
  if (lesson.selection.status === 'zero_selected') {
    return lesson.role === 'student_book'
      ? [
          '- No current Student Book activities were selected.',
          '- Do not reconstruct or invent a generic Unit 8 wrap-up from unselected Review page activities, NLL membership, or general knowledge.',
        ]
      : [
          '- No Workbook activities were selected.',
          '- Do not reconstruct or invent content from unselected Workbook Review activities.',
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
    if (activityIdOf(activity) === 'bep_3_wb_act_115_25') {
      lines.push(
        '  Visual/box dependency: use the publisher clause box; do not invent unseen visual detail or completed clauses.',
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

function targetLessonLabel(targetLessons: readonly NeutralLessonId[]): string {
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
    '- Lesson 1: Student Book printed page 143',
    '- Lesson 2: Workbook printed page 117',
    '',
    'Do not expand beyond this exact Review relationship.',
    'Do not replace the Student Book or Workbook.',
    'Review is mixed consolidation of the verified Review activities only — not whole-unit aggregation.',
    'Do not invent SB audio, survey answers, earlier-component summaries, Values material, or back-ported WB gerund evidence into SB summaries.',
    'Workbook page 117 is verified source evidence for this series; it may not be the PDF currently open in the workspace.',
    'Treat Lesson 2 as consolidation and practice of the Student Book Review strand—not a second presentation of Lesson 1.',
    '',
    'SOURCE LABELS:',
    '- [SB] = Student Book evidence from page 143 only',
    '- [WB] = Workbook evidence from page 117 only',
    '- [PRIOR] = teacher-selected prior learning, not current-page evidence',
    '- [TEACHER-ADDED · UNVERIFIED] = teacher-directed language not verified as publisher evidence',
    '- [SUPPLEMENTARY] = teacher-controlled support, not publisher wording',
    '',
    'A. SERIES SCOPE',
    '',
    'Lesson 1 — Student Book p. 143',
    'Purpose: support Review through the verified Student Book activities.',
    '',
    '[SB p.143] Activity 39: Read and choose among Did/did/didn\'t in four keyed items; protect answers; no SB audio; preserve page-level visual dependency.',
    '[SB p.143] Activity 40: Open class survey with publisher Did you…? frames; add two student questions; do not invent personal answers or require disclosure.',
    '[SB p.143] Activity 41: Complete six keyed past verb forms; protect answers; do not invent SB audio.',
    '',
    'Lesson 2 — Workbook p. 117',
    'Purpose: consolidate Review practice through the verified Workbook activities.',
    '',
    '[WB p.117] Activity 31: Circle the correct verb form in three keyed items; preserve visual dependency; protect answers.',
    '[WB p.117] Activity 32: Complete a six-gap cloze from the publisher word box; protect answers.',
    '[WB p.117] Activity 33: Complete five keyed gerund-as-subject sentences (Workbook-only); do not back-port into SB Review summaries.',
    '',
    'B. TEACHER-SELECTED PRIOR LEARNING',
    '',
    ...priorSupportLines(lessonPackage.priorSupport),
    '',
    'C. TEACHING GUIDANCE',
    '',
    '- Keep Lesson 1 on Student Book p. 143 and Lesson 2 on Workbook p. 117.',
    '- Use only selected current-page Review activities; do not import earlier Unit 8 component summaries, links, packages, memberships, or prose.',
    '- Protect keyed answers; preserve open survey work without invented responses.',
    '- Keep WB gerund evidence in Lesson 2 only; zero selection must not create a generic Unit 8 wrap-up.',
    '- Optional prior learning cannot replace current Review evidence.',
    '- Keep both lessons concise and classroom-usable.',
    '- Success means students are prepared to work with SB 143 and WB 117.',
    '',
    'D. HARD BOUNDARIES',
    '',
    '- Do not use Values page SB 142.',
    '- Do not use Values page SB 142 or Phonics pages SB 141 / WB 116.',
    '- Do not use Writing, Culture, Grammar, CLIL/P.E., Language in Action, Story, or Opener pages as current Review evidence.',
    '- Do not aggregate earlier Unit 8 components into this Review package.',
    '- Do not use or reconstruct unselected Student Book or Workbook activities.',
    '- Do not invent SB audio, survey answers, answer keys, or back-ported WB gerund evidence into SB summaries.',
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
    '- Lesson 1: Student Book printed page 143',
    '- Lesson 2: Workbook printed page 117',
    '',
    'Do not expand beyond this exact Review relationship.',
    'Do not replace the Student Book or Workbook.',
    'Review is mixed consolidation of the verified Review activities only — not whole-unit aggregation.',
    'Do not invent SB audio, survey answers, earlier-component summaries, Values material, or back-ported WB gerund evidence into SB summaries.',
    'Workbook page 117 is verified source evidence for this series; it may not be the PDF currently open in the workspace.',
    '',
    'SOURCE LABELS:',
    '- [SB] = selected Student Book activity evidence from page 143 only',
    '- [WB] = selected Workbook activity evidence from page 117 only',
    '- [PRIOR] = teacher-selected prior learning, not current-page evidence',
    '- [TEACHER-ADDED · UNVERIFIED] = teacher-directed language not verified as publisher evidence',
    '',
    'A. SERIES SCOPE',
    '',
    'Lesson 1 — Student Book p. 143',
    sbSelectionSensitive
      ? 'Use only the selected Student Book activities below.'
      : 'Use the verified Student Book Review activities below.',
    ...sbActivityLines,
    '',
    sbVocabulary.length
      ? `Selected Lesson 1 words/models: ${sbVocabulary.join(', ')}.`
      : 'Selected Lesson 1 words/models: none safely attributable to the selected activities.',
    sbLanguage.length
      ? `Selected Lesson 1 language: ${sbLanguage.join(' | ')}`
      : 'Selected Lesson 1 language: none safely attributable to the selected activities.',
    '',
    'Lesson 2 — Workbook p. 117',
    wbSelectionSensitive
      ? 'Use only the selected Workbook activities below. Do not reconstruct excluded Workbook activities.'
      : 'Purpose: consolidate Review practice through the verified Workbook activities.',
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
    '- Keep Lesson 1 on Student Book p. 143 and Lesson 2 on Workbook p. 117.',
    noLesson1Activities
      ? '- Lesson 1: no current Student Book activities were selected; do not recreate them or invent a generic Unit 8 wrap-up.'
      : sbSelectionSensitive
        ? '- Lesson 1: use only the selected Student Book activities listed above; do not reconstruct excluded activities.'
        : '- Lesson 1: use the verified Student Book activities listed above.',
    noLesson2Activities
      ? '- Lesson 2: no Workbook activities were selected; keep the lesson slot valid but do not recreate or substitute Workbook teaching content.'
      : wbSelectionSensitive
        ? '- Lesson 2: use only the selected Workbook activities listed above; do not reconstruct excluded activities.'
        : '- Lesson 2: use the verified Workbook consolidation/practice activities listed above.',
    '- Prior learning remains separate and never replaces unselected current Review evidence.',
    '- Keep both lessons concise and classroom-usable.',
    '',
    'D. HARD BOUNDARIES',
    '',
    '- Do not use Values page SB 142 or Phonics pages SB 141 / WB 116.',
    '- Do not use Writing, Culture, Grammar, CLIL/P.E., Language in Action, Story, or Opener pages as current Review evidence, and do not aggregate earlier Unit 8 components.',
    '- Do not use or reconstruct unselected Student Book or Workbook activities.',
    '- Do not invent SB audio, survey answers, answer keys, or back-ported WB gerund evidence into SB summaries.',
    '- Do not load or quote NLL-derived summaries as artifact prose.',
  ].join('\n')
}

function renderAcceptedLesson1Outline(): string {
  return [
    'Concise teacher-controlled outline — Lesson 1',
    'Short teaching sequence for Student Book p. 143 only (Review). Keep book-working time; do not expand into a slide-by-slide script.',
    '',
    '1. [SB] Activity 39: Read and choose Did/did/didn\'t; protect answers; no SB audio.',
    '2. [SB] Activity 40: Class survey with Did you…? frames plus two student questions; no invented personal answers.',
    '3. [SB] Activity 41: Complete six keyed past forms; protect answers.',
    '4. [SUPPLEMENTARY] Finish with one brief teacher-selected content check; do not present it as publisher wording.',
    '',
  ].join('\n')
}

function renderAcceptedLesson2Outline(): string {
  return [
    'Concise teacher-controlled outline — Lesson 2',
    'Short teaching sequence for Workbook p. 117 only. Consolidation and practice of the Student Book Review strand—not a second Lesson 1. Keep book-working time; do not expand into a slide-by-slide script.',
    '',
    '1. [WB] Activity 31: Circle the correct verb form; protect answers.',
    '2. [WB] Activity 32: Complete the cloze from the word box; protect answers.',
    '3. [WB] Activity 33: Complete gerund-as-subject sentences (Workbook-only); do not back-port to SB.',
    '4. [SUPPLEMENTARY] Finish with one brief teacher-selected content check; do not present it as publisher wording.',
    '',
  ].join('\n')
}

function renderSelectionAwareOutline(
  lesson: NeutralLessonPackageLesson,
): string {
  const isStudentBook = lesson.role === 'student_book'
  const source = isStudentBook ? 'SB' : 'WB'
  const lessonNumber = isStudentBook ? '1' : '2'
  const scope = isStudentBook ? 'Student Book p. 143' : 'Workbook p. 117'
  const lines = [
    `Concise teacher-controlled outline — Lesson ${lessonNumber}`,
    `Short teaching sequence for ${scope} only. Use only selected activities; do not reconstruct excluded activities.`,
    '',
  ]

  if (lesson.selection.status === 'zero_selected') {
    lines.push(
      isStudentBook
        ? '1. [SB] No current Student Book activities were selected. Do not invent a generic Unit 8 wrap-up.'
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

export function renderBe3U08ReviewNeutralPackageToChalkieShadow(
  lessonPackage: NeutralSbWbLessonPackage,
): Be3U08ReviewChalkieShadowOutput {
  assertAcceptedReviewPackage(lessonPackage)
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
        ? REVIEW_LESSON1_VOCABULARY
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
        ? REVIEW_LESSON2_VOCABULARY
        : lessonPackage.lesson2.selection.status === 'zero_selected'
          ? 'No Workbook activities selected.'
          : lessonPackage.lesson2.vocabulary.join(', ') ||
            lessonPackage.lesson2.languageModels.join(' | ') ||
            'No Workbook words or models are safely attributable to the selected activities.',
  }
}
