/**
 * Chalkie renderer for the BE3 Unit 8 Writing neutral package.
 *
 * Accepts SB p.140 → WB p.115 only. Does not invent transcripts, keyed answer
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

const WRITING_PACKAGE_REFERENCE = 'be3-sb-wb-u08-p140-wb115'
const WRITING_RELATIONSHIP_ID = 'be3_sb_wb_rel_u08_writing_sb140_wb115'
const WRITING_UNIT_TITLE = 'Healthy Living'

const WRITING_LESSON1_VOCABULARY =
  'Verified Writing vocabulary from SB p.140 only: coordinating conjunctions and, but, or when those activities are selected. Do not invent health content, model paragraphs, or sample student responses.'
const WRITING_LESSON2_VOCABULARY =
  'Verified Workbook Writing vocabulary from p.115 only: and / but / or practice terms when those activities are selected. Do not invent clause completions, cloze paragraphs, or answer keys.'

/** Keyed / answer-sensitive activities whose answers must never appear as artifact prose. */
const SUPPRESS_ANSWER_PROSE_ACTIVITY_IDS = new Set([
  'bep3_sb_act_08_28',
  'bep3_sb_act_08_29',
  'bep3_sb_act_08_30',
  'bep_3_wb_act_115_24',
  'bep_3_wb_act_115_25',
  'bep_3_wb_act_115_26',
])

export type Be3U08WritingChalkieShadowOutput = {
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

function assertAcceptedWritingPackage(
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
    identity.packageReference === WRITING_PACKAGE_REFERENCE &&
    identity.relationshipId === WRITING_RELATIONSHIP_ID &&
    identity.relationshipType === 'workbook_practice_for' &&
    identity.verificationStatus === 'human_verified' &&
    identity.componentKey === 'writing' &&
    identity.componentTitle === 'Writing' &&
    identity.studentBookCatalogId === 'big_english_3_sb' &&
    identity.workbookCatalogId === 'big_english_3_wb' &&
    identity.unitNumber === 8 &&
    identity.unitTitle === WRITING_UNIT_TITLE &&
    packaging.type === 'two_lesson_sb_wb' &&
    arraysEqual(packaging.lessonOrder, ['lesson1', 'lesson2']) &&
    lesson1.id === 'lesson1' &&
    lesson1.role === 'student_book' &&
    lesson1.scope.source === 'SB' &&
    lesson1.scope.catalogBookId === 'big_english_3_sb' &&
    arraysEqual(lesson1.scope.printedPages, [140]) &&
    arraysEqual(lesson1.scope.pageIds, ['bep3_sb_p140']) &&
    lesson2.id === 'lesson2' &&
    lesson2.role === 'workbook' &&
    lesson2.scope.source === 'WB' &&
    lesson2.scope.catalogBookId === 'big_english_3_wb' &&
    arraysEqual(lesson2.scope.printedPages, [115]) &&
    arraysEqual(lesson2.scope.pageIds, ['bep_3_wb_p115']) &&
    lessonPackage.curriculumInterpretation == null &&
    !hasSchoolContext

  if (!valid) {
    throw new Error(
      `Writing Chalkie shadow rendering is not enabled for ${identity.packageReference}.`,
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
  if (id === 'bep3_sb_act_08_28') {
    notes.push(
      '  Dependency: Audio 162 listen-and-check; do not invent a transcript; do not print full keyed conjunction answers as student composition.',
    )
  }
  if (id === 'bep3_sb_act_08_29') {
    notes.push(
      '  Boundary: five keyed sentence-combining items; do not convert examples into a model paragraph or student response.',
    )
  }
  if (id === 'bep3_sb_act_08_30') {
    notes.push(
      '  Boundary: four keyed and/but/or choices; do not reconstruct excluded items or answers.',
    )
  }
  if (id === 'bep3_sb_act_08_31') {
    notes.push(
      '  Open production: write three sentences about healthy habits using and, but, and or once each; do not invent a sample response, paragraph, rubric, checklist, audience, genre, criteria, or teaching procedure. “Healthy habits” is prompt context only.',
    )
  }
  if (id === 'bep_3_wb_act_115_24') {
    notes.push(
      '  Boundary: six keyed circle choices; do not expose full answers.',
    )
  }
  if (id === 'bep_3_wb_act_115_25') {
    notes.push(
      '  Clause-box / visual dependency: complete stems from the box; do not invent completed clauses or unseen visual details.',
    )
  }
  if (id === 'bep_3_wb_act_115_26') {
    notes.push(
      '  Boundary: six-gap paragraph cloze with or/but/and; do not invent the completed paragraph or answers.',
    )
  }
  return notes
}

function activityPromptLines(lesson: NeutralLessonPackageLesson): string[] {
  if (lesson.selection.status === 'zero_selected') {
    return lesson.role === 'student_book'
      ? [
          '- No current Student Book activities were selected.',
          '- Do not reconstruct or invent a substitute writing task from unselected Writing page activities, NLL membership, or general knowledge.',
        ]
      : [
          '- No Workbook activities were selected.',
          '- Do not reconstruct or invent content from unselected Workbook Writing activities.',
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
    '- Lesson 1: Student Book printed page 140',
    '- Lesson 2: Workbook printed page 115',
    '',
    'Do not expand beyond this exact Writing relationship.',
    'Do not replace the Student Book or Workbook.',
    'Do not invent transcripts, keyed answer dumps, model paragraphs, sample open-production responses, rubrics, clause completions, cloze paragraphs, health content, or Phonics material.',
    'Use the official book audio where the selected activity requires it (Audio 162 listen-and-check).',
    'Workbook page 115 is verified source evidence for this series; it may not be the PDF currently open in the workspace.',
    'Treat Lesson 2 as consolidation and practice of the Student Book Writing strand—not a second presentation of Lesson 1.',
    '',
    'SOURCE LABELS:',
    '- [SB] = Student Book evidence from page 140 only',
    '- [WB] = Workbook evidence from page 115 only',
    '- [PRIOR] = teacher-selected prior learning, not current-page evidence',
    '- [TEACHER-ADDED · UNVERIFIED] = teacher-directed language not verified as publisher evidence',
    '- [SUPPLEMENTARY] = teacher-controlled support, not publisher wording',
    '',
    'A. SERIES SCOPE',
    '',
    'Lesson 1 — Student Book p. 140',
    'Purpose: support Writing / Combining Sentences with and, but, or through the verified activities.',
    '',
    '[SB p.140] Activity 28: Complete keyed conjunction gaps, then listen to Audio 162 to check; no invented transcript; do not dump keyed answers as composition.',
    '[SB p.140] Activity 29: Join five keyed sentence pairs with and, but, or; keyed examples are not a model paragraph or student response.',
    '[SB p.140] Activity 30: Read and choose among and, but, or in four keyed items; do not reconstruct excluded answers.',
    '[SB p.140] Activity 31: Open production — write three sentences about healthy habits using and, but, and or once each; no invented sample, rubric, checklist, audience, genre, criteria, or teaching procedure.',
    '',
    'Lesson 2 — Workbook p. 115',
    'Purpose: consolidate Writing practice through the verified Workbook activities.',
    '',
    '[WB p.115] Activity 24: Read and circle and/but/or in six keyed items; do not expose full answers.',
    '[WB p.115] Activity 25: Complete four stems from the clause box; preserve visual/box dependency; do not invent completed clauses.',
    '[WB p.115] Activity 26: Complete a six-gap paragraph cloze with or/but/and; do not invent the completed paragraph.',
    '',
    'B. TEACHER-SELECTED PRIOR LEARNING',
    '',
    ...priorSupportLines(lessonPackage.priorSupport),
    '',
    'C. TEACHING GUIDANCE',
    '',
    '- Keep Lesson 1 on Student Book p. 140 and Lesson 2 on Workbook p. 115.',
    '- Use only selected current-page activities; do not reconstruct excluded activities from page context, NLL membership, or general knowledge.',
    '- Keep Audio 162 as an official-book listen-and-check dependency when Activity 28 is selected; do not generate a transcript.',
    '- Preserve keyed craft versus open production honestly; zero selection must not create a substitute writing task.',
    '- Use selected prior or teacher-added language only as clearly labelled support; it never replaces current Writing evidence.',
    '- Keep both lessons concise and classroom-usable.',
    '- Success means students are prepared to work with SB 140 and WB 115.',
    '',
    'D. HARD BOUNDARIES',
    '',
    '- Do not use Phonics pages SB 141 or WB 116.',
    '- Do not use Culture pages SB 138–139 or WB 113–114.',
    '- Do not use Grammar, CLIL/P.E., Language in Action, Story, or Opener pages as current Writing evidence.',
    '- Do not use or reconstruct unselected Student Book or Workbook activities.',
    '- Do not invent publisher audio wording, answer keys, model paragraphs, sample responses, rubrics, or health content beyond the prompt.',
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
    '- Lesson 1: Student Book printed page 140',
    '- Lesson 2: Workbook printed page 115',
    '',
    'Do not expand beyond this exact Writing relationship.',
    'Do not replace the Student Book or Workbook.',
    'Do not invent transcripts, keyed answer dumps, model paragraphs, sample open-production responses, rubrics, clause completions, cloze paragraphs, health content, or Phonics material.',
    'Workbook page 115 is verified source evidence for this series; it may not be the PDF currently open in the workspace.',
    '',
    'SOURCE LABELS:',
    '- [SB] = selected Student Book activity evidence from page 140 only',
    '- [WB] = selected Workbook activity evidence from page 115 only',
    '- [PRIOR] = teacher-selected prior learning, not current-page evidence',
    '- [TEACHER-ADDED · UNVERIFIED] = teacher-directed language not verified as publisher evidence',
    '',
    'A. SERIES SCOPE',
    '',
    'Lesson 1 — Student Book p. 140',
    sbSelectionSensitive
      ? 'Use only the selected Student Book activities below.'
      : 'Use the verified Student Book Writing activities below.',
    ...sbActivityLines,
    '',
    sbVocabulary.length
      ? `Selected Lesson 1 words/models: ${sbVocabulary.join(', ')}.`
      : 'Selected Lesson 1 words/models: none safely attributable to the selected activities.',
    sbLanguage.length
      ? `Selected Lesson 1 language: ${sbLanguage.join(' | ')}`
      : 'Selected Lesson 1 language: none safely attributable to the selected activities.',
    '',
    'Lesson 2 — Workbook p. 115',
    wbSelectionSensitive
      ? 'Use only the selected Workbook activities below. Do not reconstruct excluded Workbook activities.'
      : 'Purpose: consolidate Writing practice through the verified Workbook activities.',
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
    '- Keep Lesson 1 on Student Book p. 140 and Lesson 2 on Workbook p. 115.',
    noLesson1Activities
      ? '- Lesson 1: no current Student Book activities were selected; do not recreate them or invent a substitute writing task.'
      : sbSelectionSensitive
        ? '- Lesson 1: use only the selected Student Book activities listed above; do not reconstruct excluded activities.'
        : '- Lesson 1: use the verified Student Book activities listed above.',
    noLesson2Activities
      ? '- Lesson 2: no Workbook activities were selected; keep the lesson slot valid but do not recreate or substitute Workbook teaching content.'
      : wbSelectionSensitive
        ? '- Lesson 2: use only the selected Workbook activities listed above; do not reconstruct excluded activities.'
        : '- Lesson 2: use the verified Workbook consolidation/practice activities listed above.',
    '- Prior learning remains separate and never replaces unselected current Writing evidence.',
    '- Keep both lessons concise and classroom-usable.',
    '',
    'D. HARD BOUNDARIES',
    '',
    '- Do not use Phonics pages SB 141 or WB 116.',
    '- Do not use Culture, Grammar, CLIL/P.E., Language in Action, Story, or Opener pages as current Writing evidence.',
    '- Do not use or reconstruct unselected Student Book or Workbook activities.',
    '- Do not invent publisher audio wording, answer keys, model paragraphs, sample responses, rubrics, or health content beyond the prompt.',
    '- Do not load or quote NLL-derived summaries as artifact prose.',
  ].join('\n')
}

function renderAcceptedLesson1Outline(): string {
  return [
    'Concise teacher-controlled outline — Lesson 1',
    'Short teaching sequence for Student Book p. 140 only (Writing). Keep book-working time; do not expand into a slide-by-slide script.',
    '',
    '1. [SB] Activity 28: Complete keyed conjunction gaps; listen to Audio 162 to check; no invented transcript or answer dump.',
    '2. [SB] Activity 29: Join five keyed sentence pairs; do not convert examples into a model paragraph.',
    '3. [SB] Activity 30: Read and choose and/but/or in four keyed items; protect answers.',
    '4. [SB] Activity 31: Open production — three healthy-habits sentences using and, but, and or once; no invented sample or rubric.',
    '5. [SUPPLEMENTARY] Finish with one brief teacher-selected content check; do not present it as publisher wording.',
    '',
  ].join('\n')
}

function renderAcceptedLesson2Outline(): string {
  return [
    'Concise teacher-controlled outline — Lesson 2',
    'Short teaching sequence for Workbook p. 115 only. Consolidation and practice of the Student Book Writing strand—not a second Lesson 1. Keep book-working time; do not expand into a slide-by-slide script.',
    '',
    '1. [WB] Activity 24: Read and circle and/but/or; protect answers.',
    '2. [WB] Activity 25: Complete stems from the clause box; preserve visual/box dependency; do not invent clauses.',
    '3. [WB] Activity 26: Complete the paragraph cloze with or/but/and; do not invent the completed paragraph.',
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
  const scope = isStudentBook ? 'Student Book p. 140' : 'Workbook p. 115'
  const lines = [
    `Concise teacher-controlled outline — Lesson ${lessonNumber}`,
    `Short teaching sequence for ${scope} only. Use only selected activities; do not reconstruct excluded activities.`,
    '',
  ]

  if (lesson.selection.status === 'zero_selected') {
    lines.push(
      isStudentBook
        ? '1. [SB] No current Student Book activities were selected. Do not invent a substitute writing task.'
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

export function renderBe3U08WritingNeutralPackageToChalkieShadow(
  lessonPackage: NeutralSbWbLessonPackage,
): Be3U08WritingChalkieShadowOutput {
  assertAcceptedWritingPackage(lessonPackage)
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
        ? WRITING_LESSON1_VOCABULARY
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
        ? WRITING_LESSON2_VOCABULARY
        : lessonPackage.lesson2.selection.status === 'zero_selected'
          ? 'No Workbook activities selected.'
          : lessonPackage.lesson2.vocabulary.join(', ') ||
            lessonPackage.lesson2.languageModels.join(' | ') ||
            'No Workbook words or models are safely attributable to the selected activities.',
  }
}
