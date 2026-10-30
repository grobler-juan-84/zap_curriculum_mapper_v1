/**
 * Chalkie renderer for the BE3 Unit 8 Grammar neutral package.
 *
 * Accepts SB pp.136–137 → WB pp.111–112 only. Does not invent transcripts,
 * answer keys, spelling rules, or verb inventories beyond selected evidence.
 * NLL-derived knowledge may sit on the package but never becomes artifact prose.
 */
import type {
  NeutralLessonId,
  NeutralLessonPackageLesson,
  NeutralPriorSupportRecord,
  NeutralSbWbLessonPackage,
  NeutralSelectedActivityEvidence,
} from './buildNeutralSbWbLessonPackage'

const GRAMMAR_PACKAGE_REFERENCE = 'be3-sb-wb-u08-p136-137-wb111-112'
const GRAMMAR_RELATIONSHIP_ID =
  'be3_sb_wb_rel_u08_grammar_sb136-137_wb111-112'
const GRAMMAR_UNIT_TITLE = 'Healthy Living'

const GRAMMAR_LESSON1_VOCABULARY =
  'No dedicated target vocabulary is listed for SB pp. 136–137. Use only verified model frames from selected Grammar activities; grammar-box rows are page context, not selectable memberships.'
const GRAMMAR_LESSON2_VOCABULARY =
  "No dedicated target vocabulary is listed for WB pp. 111–112. Language models from selected Workbook Grammar tasks only (for example Did …? / did / didn't formation and base-form negatives when those activities are selected)."

/** Activities whose keyed answers must never appear as artifact prose. */
const SUPPRESS_ANSWER_PROSE_ACTIVITY_IDS = new Set([
  'bep3_sb_act_08_19',
  'bep3_sb_act_08_20',
  'bep3_sb_act_08_21',
  'bep3_sb_act_08_22',
  'bep_3_wb_act_111_15',
  'bep_3_wb_act_111_16',
  'bep_3_wb_act_111_17',
  'bep_3_wb_act_112_18',
  'bep_3_wb_act_112_19',
])

export type Be3U08GrammarChalkieShadowOutput = {
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

function assertAcceptedGrammarPackage(
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
    identity.packageReference === GRAMMAR_PACKAGE_REFERENCE &&
    identity.relationshipId === GRAMMAR_RELATIONSHIP_ID &&
    identity.relationshipType === 'workbook_practice_for' &&
    identity.verificationStatus === 'human_verified' &&
    identity.componentKey === 'grammar' &&
    identity.componentTitle === 'Grammar' &&
    identity.studentBookCatalogId === 'big_english_3_sb' &&
    identity.workbookCatalogId === 'big_english_3_wb' &&
    identity.unitNumber === 8 &&
    identity.unitTitle === GRAMMAR_UNIT_TITLE &&
    packaging.type === 'two_lesson_sb_wb' &&
    arraysEqual(packaging.lessonOrder, ['lesson1', 'lesson2']) &&
    lesson1.id === 'lesson1' &&
    lesson1.role === 'student_book' &&
    lesson1.scope.source === 'SB' &&
    lesson1.scope.catalogBookId === 'big_english_3_sb' &&
    arraysEqual(lesson1.scope.printedPages, [136, 137]) &&
    arraysEqual(lesson1.scope.pageIds, ['bep3_sb_p136', 'bep3_sb_p137']) &&
    lesson2.id === 'lesson2' &&
    lesson2.role === 'workbook' &&
    lesson2.scope.source === 'WB' &&
    lesson2.scope.catalogBookId === 'big_english_3_wb' &&
    arraysEqual(lesson2.scope.printedPages, [111, 112]) &&
    arraysEqual(lesson2.scope.pageIds, ['bep_3_wb_p111', 'bep_3_wb_p112']) &&
    lessonPackage.curriculumInterpretation == null &&
    // derivedKnowledge may be attached by Grammar-C at package level only.
    !hasSchoolContext

  if (!valid) {
    throw new Error(
      `Grammar Chalkie shadow rendering is not enabled for ${identity.packageReference}.`,
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
  if (id === 'bep3_sb_act_08_19') {
    notes.push(
      '  Dependency: official Audio 159 and page visuals; do not invent an audio transcript or expose the keyed bicycle answer as general artifact prose.',
    )
  }
  if (id === 'bep3_sb_act_08_20') {
    notes.push(
      '  Dependency: regular-past spelling chart and word box only; do not invent spelling rules or additional verbs.',
    )
  }
  if (id === 'bep3_sb_act_08_21') {
    notes.push(
      '  Boundary: nine-item narrative gap-fill; preserve traveled / travelled dual evidence when relevant; do not print a full answer key.',
    )
  }
  if (id === 'bep3_sb_act_08_22') {
    notes.push(
      '  Boundary: eight-item irregular matching inventory only; do not borrow Workbook Activity 16 verbs.',
    )
  }
  if (id === 'bep3_sb_act_08_23') {
    notes.push(
      '  Open speaking: use only verified yesterday model frames; do not invent further prompts.',
    )
  }
  if (id === 'bep_3_wb_act_111_15') {
    notes.push(
      '  Dependency: this Workbook regular-past chart and word box only; do not substitute Student Book Activity 20.',
    )
  }
  if (id === 'bep_3_wb_act_111_16') {
    notes.push(
      '  Boundary: ten irregular-verb writings only; do not borrow Student Book Activity 22 inventory.',
    )
  }
  if (id === 'bep_3_wb_act_111_17') {
    notes.push(
      '  Boundary: thirteen-item narrative cloze only; do not print a full answer key.',
    )
  }
  if (id === 'bep_3_wb_act_112_18') {
    notes.push(
      '  Morphology/formation practice with visual dependency: preserve Did + base-verb items and Was/Were items; do not collapse into Did-only and do not treat as LiA communicative ask/answer.',
    )
  }
  if (id === 'bep_3_wb_act_112_19') {
    notes.push(
      "  Boundary: affirmative → didn't + base-form negatives; do not print full keyed answers.",
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
          '- Do not reconstruct or infer content from unselected Grammar page activities, grammar-box context, or NLL membership.',
        ]
      : [
          '- No Workbook activities were selected.',
          '- Do not reconstruct or infer content from unselected Workbook Grammar activities.',
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
      activityIdOf(activity) === 'bep3_sb_act_08_19' ||
      activityIdOf(activity) === 'bep_3_wb_act_112_18'
    ) {
      lines.push(
        '  Visual dependency: use the page illustrations; do not invent unseen visual detail.',
      )
    }
    // Never dump keyed answers / item answer keys for Grammar honesty activities.
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
    '- Lesson 1: Student Book printed pages 136–137',
    '- Lesson 2: Workbook printed pages 111–112',
    '',
    'Do not expand beyond this exact Grammar relationship.',
    'Do not replace the Student Book or Workbook.',
    'Do not invent publisher audio transcripts, illustration details, spelling rules, verb inventories, or answer keys.',
    'Use the official book audio and illustrations where the selected activity requires them.',
    'Workbook pages 111–112 are verified source evidence for this series; they may not be the PDF currently open in the workspace.',
    'Treat Lesson 2 as consolidation and practice of the Student Book Grammar strand—not a second presentation of Lesson 1.',
    '',
    'SOURCE LABELS:',
    '- [SB] = Student Book evidence from pages 136–137 only',
    '- [WB] = Workbook evidence from pages 111–112 only',
    '- [PRIOR] = teacher-selected prior learning, not current-page evidence',
    '- [TEACHER-ADDED · UNVERIFIED] = teacher-directed language not verified as publisher evidence',
    '- [SUPPLEMENTARY] = teacher-controlled support, not publisher wording',
    '',
    'A. SERIES SCOPE',
    '',
    'Lesson 1 — Student Book pp. 136–137',
    'Purpose: practise regular past *-ed* spelling, irregular past forms, and yesterday speaking through the verified Grammar activities.',
    '',
    '[SB p.136] Activity 19: Look, listen, and read. How did Donna\'s dad come home? Use official Audio 159 and visuals; do not invent a transcript or expose the keyed bicycle answer as general artifact prose.',
    '[SB p.136] Activity 20: Copy and complete the regular-past spelling chart using the word box; do not invent spelling rules or extra verbs.',
    '[SB p.137] Activity 21: Read and complete the nine-item past-form narrative gap-fill; preserve traveled / travelled dual evidence; do not print a full answer key.',
    '[SB p.137] Activity 22: Match eight base verbs to their irregular past forms; do not borrow Workbook Activity 16 verbs.',
    '[SB p.137] Activity 23: Tell a partner what you did yesterday using only the verified model frames.',
    '[SB] Grammar-box language on p.136 is page context only — not a selectable membership.',
    '[SB] Dedicated target vocabulary on these pages: none listed.',
    '',
    'Lesson 2 — Workbook pp. 111–112',
    'Purpose: consolidate regular/irregular past morphology and question/negative formation through the verified Workbook Grammar practice.',
    '',
    '[WB p.111] Activity 15: Complete the regular-past spelling chart with the word box; do not substitute Student Book Activity 20.',
    '[WB p.111] Activity 16: Write the simple-past forms of ten irregular verbs; do not borrow Student Book Activity 22 inventory.',
    '[WB p.111] Activity 17: Complete the thirteen-item narrative cloze with correct past forms; do not print a full answer key.',
    '[WB p.112] Activity 18: Complete six questions and answers about past activities using page models and illustrations. Preserve Did + base-verb items and Was/Were items; this is morphology/formation practice, not LiA communicative ask/answer.',
    "[WB p.112] Activity 19: Rewrite three affirmative past sentences as negatives with didn't + base form; do not print full keyed answers.",
    '[WB] Dedicated target vocabulary on these pages: none listed.',
    '',
    'B. TEACHER-SELECTED PRIOR LEARNING',
    '',
    ...priorSupportLines(lessonPackage.priorSupport),
    '',
    'C. TEACHING GUIDANCE',
    '',
    '- Keep Lesson 1 on Student Book pp. 136–137 and Lesson 2 on Workbook pp. 111–112.',
    '- Use only selected current-page activities; do not reconstruct excluded activities from page context, grammar-box rows, NLL membership, or optional LiA prior support.',
    '- Keep Audio 159 as an official-book dependency when Activity 19 is selected; do not generate a transcript.',
    '- Keep regular *-ed* spelling work distinct from irregular inventories.',
    '- Use selected prior or teacher-added language only as clearly labelled support; it never replaces current Grammar evidence.',
    '- Keep both lessons concise and classroom-usable.',
    '- Success means students are prepared to work with SB 136–137 and WB 111–112.',
    '',
    'D. HARD BOUNDARIES',
    '',
    '- Do not use Language in Action pages SB 132–133 or WB 107–108 as current Grammar evidence.',
    '- Do not use CLIL/P.E. pages SB 134–135 or WB 109–110.',
    '- Do not use Culture pages SB 138–139 or WB 113–114.',
    '- Do not use or reconstruct unselected Student Book or Workbook activities.',
    '- Do not invent publisher audio, illustration, spelling-rule, or answer-key content.',
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
    '- Lesson 1: Student Book printed pages 136–137',
    '- Lesson 2: Workbook printed pages 111–112',
    '',
    'Do not expand beyond this exact Grammar relationship.',
    'Do not replace the Student Book or Workbook.',
    'Do not invent publisher audio transcripts, illustration details, spelling rules, verb inventories, or answer keys.',
    'Workbook pages 111–112 are verified source evidence for this series; they may not be the PDF currently open in the workspace.',
    '',
    'SOURCE LABELS:',
    '- [SB] = selected Student Book activity evidence from pages 136–137 only',
    '- [WB] = selected Workbook activity evidence from pages 111–112 only',
    '- [PRIOR] = teacher-selected prior learning, not current-page evidence',
    '- [TEACHER-ADDED · UNVERIFIED] = teacher-directed language not verified as publisher evidence',
    '',
    'A. SERIES SCOPE',
    '',
    'Lesson 1 — Student Book pp. 136–137',
    sbSelectionSensitive
      ? 'Use only the selected Student Book activities below.'
      : 'Use the verified Student Book Grammar activities below.',
    ...sbActivityLines,
    '',
    sbVocabulary.length
      ? `Selected Lesson 1 words/models: ${sbVocabulary.join(', ')}.`
      : 'Selected Lesson 1 words/models: none safely attributable to the selected activities.',
    sbLanguage.length
      ? `Selected Lesson 1 language: ${sbLanguage.join(' | ')}`
      : 'Selected Lesson 1 language: none safely attributable to the selected activities.',
    '',
    'Lesson 2 — Workbook pp. 111–112',
    wbSelectionSensitive
      ? 'Use only the selected Workbook activities below. Do not reconstruct excluded Workbook activities.'
      : 'Purpose: consolidate regular/irregular past morphology and question/negative formation through the verified Workbook Grammar practice.',
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
    '- Keep Lesson 1 on Student Book pp. 136–137 and Lesson 2 on Workbook pp. 111–112.',
    noLesson1Activities
      ? '- Lesson 1: no current Student Book activities were selected; do not recreate them from page context or grammar-box rows.'
      : sbSelectionSensitive
        ? '- Lesson 1: use only the selected Student Book activities listed above; do not reconstruct excluded activities.'
        : '- Lesson 1: use the verified Student Book activities listed above.',
    noLesson2Activities
      ? '- Lesson 2: no Workbook activities were selected; keep the lesson slot valid but do not recreate or substitute Workbook teaching content.'
      : wbSelectionSensitive
        ? '- Lesson 2: use only the selected Workbook activities listed above; do not reconstruct excluded activities.'
        : '- Lesson 2: use the verified Workbook consolidation/practice activities listed above.',
    '- Prior learning and optional LiA support remain separate and never replace unselected current Grammar evidence.',
    '- Keep both lessons concise and classroom-usable.',
    '',
    'D. HARD BOUNDARIES',
    '',
    '- Do not use Language in Action pages SB 132–133 or WB 107–108 as current Grammar evidence.',
    '- Do not use CLIL/P.E. pages SB 134–135 or WB 109–110.',
    '- Do not use Culture pages SB 138–139 or WB 113–114.',
    '- Do not use or reconstruct unselected Student Book or Workbook activities.',
    '- Do not invent publisher audio, illustration, spelling-rule, or answer-key content.',
    '- Do not load or quote NLL-derived summaries as artifact prose.',
  ].join('\n')
}

function renderAcceptedLesson1Outline(): string {
  return [
    'Concise teacher-controlled outline — Lesson 1',
    'Short teaching sequence for Student Book pp. 136–137 only (Grammar). Keep book-working time; do not expand into a slide-by-slide script.',
    '',
    '1. [SB] Activity 19: Look, listen, and read with official Audio 159; do not invent a transcript or dump the keyed bicycle answer.',
    '2. [SB] Activity 20: Complete the regular-past spelling chart from the word box; do not invent spelling rules.',
    '3. [SB] Activity 21: Complete the nine-item narrative gap-fill; preserve traveled / travelled dual evidence; no full answer key.',
    '4. [SB] Activity 22: Match eight irregular past forms; do not borrow Workbook Activity 16 verbs.',
    '5. [SB] Activity 23: Pair speaking with verified yesterday frames only.',
    '6. [SUPPLEMENTARY] Finish with one brief teacher-selected past-form check; do not present it as publisher wording.',
    '',
  ].join('\n')
}

function renderAcceptedLesson2Outline(): string {
  return [
    'Concise teacher-controlled outline — Lesson 2',
    'Short teaching sequence for Workbook pp. 111–112 only. Consolidation and practice of the Student Book Grammar strand—not a second Lesson 1. Keep book-working time; do not expand into a slide-by-slide script.',
    '',
    '1. [WB] Activity 15: Complete the Workbook regular-past chart; do not substitute Student Book Activity 20.',
    '2. [WB] Activity 16: Write ten irregular past forms; do not borrow Student Book Activity 22 inventory.',
    '3. [WB] Activity 17: Complete the thirteen-item narrative cloze; do not print a full answer key.',
    '4. [WB] Activity 18: Complete six Q&A items using visuals; preserve Did and Was/Were morphology; this is not LiA communicative practice.',
    "5. [WB] Activity 19: Rewrite three affirmatives as didn't + base-form negatives; do not dump keyed answers.",
    '6. [SUPPLEMENTARY] Finish with one brief teacher-selected past-form check; do not present it as publisher wording.',
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
    ? 'Student Book pp. 136–137'
    : 'Workbook pp. 111–112'
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

export function renderBe3U08GrammarNeutralPackageToChalkieShadow(
  lessonPackage: NeutralSbWbLessonPackage,
): Be3U08GrammarChalkieShadowOutput {
  assertAcceptedGrammarPackage(lessonPackage)
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
        ? GRAMMAR_LESSON1_VOCABULARY
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
        ? GRAMMAR_LESSON2_VOCABULARY
        : lessonPackage.lesson2.selection.status === 'zero_selected'
          ? 'No Workbook activities selected.'
          : lessonPackage.lesson2.vocabulary.join(', ') ||
            lessonPackage.lesson2.languageModels.join(' | ') ||
            'No Workbook words or models are safely attributable to the selected activities.',
  }
}
