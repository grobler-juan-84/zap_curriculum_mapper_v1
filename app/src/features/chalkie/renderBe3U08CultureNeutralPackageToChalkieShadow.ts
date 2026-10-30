/**
 * Chalkie renderer for the BE3 Unit 8 Culture Connection neutral package.
 *
 * Accepts SB pp.138–139 → WB pp.113–114 only. Does not invent cultural facts,
 * sport/country mappings, audio wording, answer keys, chart cells, or stereotypes.
 * NLL-derived knowledge may sit on the package but never becomes artifact prose.
 */
import type {
  NeutralLessonId,
  NeutralLessonPackageLesson,
  NeutralPriorSupportRecord,
  NeutralSbWbLessonPackage,
  NeutralSelectedActivityEvidence,
} from './buildNeutralSbWbLessonPackage'

const CULTURE_PACKAGE_REFERENCE = 'be3-sb-wb-u08-p138-139-wb113-114'
const CULTURE_RELATIONSHIP_ID =
  'be3_sb_wb_rel_u08_culture_sb138-139_wb113-114'
const CULTURE_UNIT_TITLE = 'Healthy Living'

const CULTURE_LESSON1_VOCABULARY =
  'Verified Culture Connection vocabulary from the selected spread only: sport names and publisher-labelled Strange Sports wording when those activities are selected. Do not invent countries, dates, origins, rules, or cultural facts.'
const CULTURE_LESSON2_VOCABULARY =
  'Verified Workbook Culture Connection vocabulary from the selected practice only: sport/contest terms when those activities are selected. Do not invent cultural facts, mappings, or answer keys.'

/** Keyed / answer-sensitive activities whose answers must never appear as artifact prose. */
const SUPPRESS_ANSWER_PROSE_ACTIVITY_IDS = new Set([
  'bep3_sb_act_08_26',
  'bep3_sb_act_08_27',
  'bep_3_wb_act_113_20',
  'bep_3_wb_act_113_21',
  'bep_3_wb_act_114_22',
  'bep_3_wb_act_114_23',
])

export type Be3U08CultureChalkieShadowOutput = {
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

function assertAcceptedCulturePackage(
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
    identity.packageReference === CULTURE_PACKAGE_REFERENCE &&
    identity.relationshipId === CULTURE_RELATIONSHIP_ID &&
    identity.relationshipType === 'workbook_practice_for' &&
    identity.verificationStatus === 'human_verified' &&
    identity.componentKey === 'culture' &&
    identity.componentTitle === 'Culture Connection' &&
    identity.studentBookCatalogId === 'big_english_3_sb' &&
    identity.workbookCatalogId === 'big_english_3_wb' &&
    identity.unitNumber === 8 &&
    identity.unitTitle === CULTURE_UNIT_TITLE &&
    packaging.type === 'two_lesson_sb_wb' &&
    arraysEqual(packaging.lessonOrder, ['lesson1', 'lesson2']) &&
    lesson1.id === 'lesson1' &&
    lesson1.role === 'student_book' &&
    lesson1.scope.source === 'SB' &&
    lesson1.scope.catalogBookId === 'big_english_3_sb' &&
    arraysEqual(lesson1.scope.printedPages, [138, 139]) &&
    arraysEqual(lesson1.scope.pageIds, ['bep3_sb_p138', 'bep3_sb_p139']) &&
    lesson2.id === 'lesson2' &&
    lesson2.role === 'workbook' &&
    lesson2.scope.source === 'WB' &&
    lesson2.scope.catalogBookId === 'big_english_3_wb' &&
    arraysEqual(lesson2.scope.printedPages, [113, 114]) &&
    arraysEqual(lesson2.scope.pageIds, ['bep_3_wb_p113', 'bep_3_wb_p114']) &&
    lessonPackage.curriculumInterpretation == null &&
    !hasSchoolContext

  if (!valid) {
    throw new Error(
      `Culture Connection Chalkie shadow rendering is not enabled for ${identity.packageReference}.`,
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
  if (id === 'bep3_sb_act_08_24') {
    notes.push(
      '  Boundary: open non-keyed partner matching; do not turn sport/country options into factual mappings; preserve Add your own as open student work.',
    )
  }
  if (id === 'bep3_sb_act_08_25') {
    notes.push(
      '  Dependency: official Audio 160 and visual evidence; do not invent a transcript; use Strange sports only as publisher-attributed wording; do not invent sports, origins, countries, dates, rules, or cultural facts.',
    )
  }
  if (id === 'bep3_sb_act_08_26') {
    notes.push(
      '  Dependency: Activity 25; do not reconstruct excluded reading through T/F claims or answers.',
    )
  }
  if (id === 'bep3_sb_act_08_27') {
    notes.push(
      '  Chart/layout dependency: do not expose or invent origin, description, similar-sport, or reason-started answer cells; avoid stereotypes and unsupported comparisons.',
    )
  }
  if (id === 'bep_3_wb_act_113_20') {
    notes.push(
      '  Forward dependency: Look at 21; selecting this must not reconstruct excluded Activity 21 content.',
    )
  }
  if (id === 'bep_3_wb_act_113_21') {
    notes.push(
      '  Dependency: official Audio 161; do not invent audio wording, order, or answers.',
    )
  }
  if (id === 'bep_3_wb_act_114_22') {
    notes.push(
      '  Boundary: exact matching task only; protect answers and cross-activity evidence.',
    )
  }
  if (id === 'bep_3_wb_act_114_23') {
    notes.push(
      '  Boundary: exact T/F task only; protect answers; do not invent cultural facts.',
    )
  }
  if (id === 'bep_3_wb_act_114_tb') {
    notes.push(
      '  Think Big: open creative invent-a-sport work; do not convert student invention into publisher facts.',
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
          '- Do not reconstruct or infer content from unselected Culture page activities, reading context, NLL membership, or general knowledge.',
        ]
      : [
          '- No Workbook activities were selected.',
          '- Do not reconstruct or infer content from unselected Workbook Culture activities.',
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
      activityIdOf(activity) === 'bep3_sb_act_08_25' ||
      activityIdOf(activity) === 'bep3_sb_act_08_27'
    ) {
      lines.push(
        '  Visual/layout dependency: use the page visual or chart; do not invent unseen visual detail.',
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
    '- Lesson 1: Student Book printed pages 138–139',
    '- Lesson 2: Workbook printed pages 113–114',
    '',
    'Do not expand beyond this exact Culture Connection relationship.',
    'Do not replace the Student Book or Workbook.',
    'Do not invent cultural facts, sport/country mappings, audio wording, answer keys, chart cells, dates, rules, or stereotypes.',
    'Use the official book audio and visuals where the selected activity requires them.',
    'Workbook pages 113–114 are verified source evidence for this series; they may not be the PDF currently open in the workspace.',
    'Treat Lesson 2 as consolidation and practice of the Student Book Culture Connection strand—not a second presentation of Lesson 1.',
    '',
    'SOURCE LABELS:',
    '- [SB] = Student Book evidence from pages 138–139 only',
    '- [WB] = Workbook evidence from pages 113–114 only',
    '- [PRIOR] = teacher-selected prior learning, not current-page evidence',
    '- [TEACHER-ADDED · UNVERIFIED] = teacher-directed language not verified as publisher evidence',
    '- [SUPPLEMENTARY] = teacher-controlled support, not publisher wording',
    '',
    'A. SERIES SCOPE',
    '',
    'Lesson 1 — Student Book pp. 138–139',
    'Purpose: support Culture Connection / Around the World reading work on Strange Sports through the verified activities.',
    '',
    '[SB p.138] Activity 24: Partner match sports to country options or add your own; keep matching open and non-keyed; do not treat options as factual mappings.',
    '[SB p.138] Activity 25: Listen to Audio 160 and read; identify when people started these publisher-labelled strange sports; preserve visual dependency; do not invent transcript, sports, origins, countries, dates, or rules.',
    '[SB p.138] Activity 26: Look at Activity 25 and say true or false; do not reconstruct excluded reading through T/F claims or answers.',
    '[SB p.139] Activity 27: Complete the sports chart; preserve chart/layout dependency; do not invent origin, description, similar-sport, or reason-started answer cells.',
    '',
    'Lesson 2 — Workbook pp. 113–114',
    'Purpose: consolidate Culture Connection practice through the verified Workbook activities.',
    '',
    '[WB p.113] Activity 20: Look at 21; read quickly and match; do not reconstruct excluded Activity 21.',
    '[WB p.113] Activity 21: Listen to Audio 161, read, and write; do not invent audio wording, order, or answers.',
    '[WB p.114] Activity 22: Read and match; protect answers and exact matching boundaries.',
    '[WB p.114] Activity 23: Read and circle T/F; protect answers; do not invent cultural facts.',
    '[WB p.114] Think Big: Make up a strange sport; keep as open creative work; do not convert student invention into publisher facts.',
    '',
    'B. TEACHER-SELECTED PRIOR LEARNING',
    '',
    ...priorSupportLines(lessonPackage.priorSupport),
    '',
    'C. TEACHING GUIDANCE',
    '',
    '- Keep Lesson 1 on Student Book pp. 138–139 and Lesson 2 on Workbook pp. 113–114.',
    '- Use only selected current-page activities; do not reconstruct excluded activities from page context, NLL membership, or general knowledge.',
    '- Keep Audio 160 / Audio 161 as official-book dependencies when Activities 25 / 21 are selected; do not generate transcripts.',
    '- Preserve open matching, reading, chart, matching/T/F, forward-dependency, and Think Big boundaries honestly.',
    '- Use selected prior or teacher-added language only as clearly labelled support; it never replaces current Culture evidence.',
    '- Avoid stereotypes, unsupported comparisons, and amplified judgmental framing.',
    '- Keep both lessons concise and classroom-usable.',
    '- Success means students are prepared to work with SB 138–139 and WB 113–114.',
    '',
    'D. HARD BOUNDARIES',
    '',
    '- Do not use Content Connection / P.E. pages SB 134–135 or WB 109–110 as current Culture evidence.',
    '- Do not use Grammar pages SB 136–137 or WB 111–112.',
    '- Do not use Language in Action pages SB 132–133 or WB 107–108.',
    '- Do not use Writing pages SB 140 or WB 115.',
    '- Do not use or reconstruct unselected Student Book or Workbook activities.',
    '- Do not invent publisher audio, cultural facts, sport/country mappings, chart answers, or answer-key content.',
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
    '- Lesson 1: Student Book printed pages 138–139',
    '- Lesson 2: Workbook printed pages 113–114',
    '',
    'Do not expand beyond this exact Culture Connection relationship.',
    'Do not replace the Student Book or Workbook.',
    'Do not invent cultural facts, sport/country mappings, audio wording, answer keys, chart cells, dates, rules, or stereotypes.',
    'Workbook pages 113–114 are verified source evidence for this series; they may not be the PDF currently open in the workspace.',
    '',
    'SOURCE LABELS:',
    '- [SB] = selected Student Book activity evidence from pages 138–139 only',
    '- [WB] = selected Workbook activity evidence from pages 113–114 only',
    '- [PRIOR] = teacher-selected prior learning, not current-page evidence',
    '- [TEACHER-ADDED · UNVERIFIED] = teacher-directed language not verified as publisher evidence',
    '',
    'A. SERIES SCOPE',
    '',
    'Lesson 1 — Student Book pp. 138–139',
    sbSelectionSensitive
      ? 'Use only the selected Student Book activities below.'
      : 'Use the verified Student Book Culture Connection activities below.',
    ...sbActivityLines,
    '',
    sbVocabulary.length
      ? `Selected Lesson 1 words/models: ${sbVocabulary.join(', ')}.`
      : 'Selected Lesson 1 words/models: none safely attributable to the selected activities.',
    sbLanguage.length
      ? `Selected Lesson 1 language: ${sbLanguage.join(' | ')}`
      : 'Selected Lesson 1 language: none safely attributable to the selected activities.',
    '',
    'Lesson 2 — Workbook pp. 113–114',
    wbSelectionSensitive
      ? 'Use only the selected Workbook activities below. Do not reconstruct excluded Workbook activities.'
      : 'Purpose: consolidate Culture Connection practice through the verified Workbook activities.',
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
    '- Keep Lesson 1 on Student Book pp. 138–139 and Lesson 2 on Workbook pp. 113–114.',
    noLesson1Activities
      ? '- Lesson 1: no current Student Book activities were selected; do not recreate them from page context, reading memory, or general knowledge.'
      : sbSelectionSensitive
        ? '- Lesson 1: use only the selected Student Book activities listed above; do not reconstruct excluded activities.'
        : '- Lesson 1: use the verified Student Book activities listed above.',
    noLesson2Activities
      ? '- Lesson 2: no Workbook activities were selected; keep the lesson slot valid but do not recreate or substitute Workbook teaching content.'
      : wbSelectionSensitive
        ? '- Lesson 2: use only the selected Workbook activities listed above; do not reconstruct excluded activities.'
        : '- Lesson 2: use the verified Workbook consolidation/practice activities listed above.',
    '- Prior learning remains separate and never replaces unselected current Culture evidence.',
    '- Avoid stereotypes, unsupported comparisons, and amplified judgmental framing.',
    '- Keep both lessons concise and classroom-usable.',
    '',
    'D. HARD BOUNDARIES',
    '',
    '- Do not use Content Connection / P.E. pages SB 134–135 or WB 109–110 as current Culture evidence.',
    '- Do not use Grammar pages SB 136–137 or WB 111–112.',
    '- Do not use Language in Action pages SB 132–133 or WB 107–108.',
    '- Do not use or reconstruct unselected Student Book or Workbook activities.',
    '- Do not invent publisher audio, cultural facts, sport/country mappings, chart answers, or answer-key content.',
    '- Do not load or quote NLL-derived summaries as artifact prose.',
  ].join('\n')
}

function renderAcceptedLesson1Outline(): string {
  return [
    'Concise teacher-controlled outline — Lesson 1',
    'Short teaching sequence for Student Book pp. 138–139 only (Culture Connection). Keep book-working time; do not expand into a slide-by-slide script.',
    '',
    '1. [SB] Activity 24: Open partner matching of sports to country options or add your own; do not treat options as factual mappings.',
    '2. [SB] Activity 25: Listen to Audio 160 and read; preserve visual dependency; no invented transcript or cultural facts.',
    '3. [SB] Activity 26: Look at Activity 25; true/false without reconstructing excluded reading.',
    '4. [SB] Activity 27: Complete the sports chart; preserve layout; do not invent answer cells.',
    '5. [SUPPLEMENTARY] Finish with one brief teacher-selected content check; do not present it as publisher wording.',
    '',
  ].join('\n')
}

function renderAcceptedLesson2Outline(): string {
  return [
    'Concise teacher-controlled outline — Lesson 2',
    'Short teaching sequence for Workbook pp. 113–114 only. Consolidation and practice of the Student Book Culture Connection strand—not a second Lesson 1. Keep book-working time; do not expand into a slide-by-slide script.',
    '',
    '1. [WB] Activity 20: Look at 21; quick read and match; do not reconstruct excluded Activity 21.',
    '2. [WB] Activity 21: Listen to Audio 161, read, and write; do not invent audio wording or answers.',
    '3. [WB] Activity 22: Read and match; protect answers.',
    '4. [WB] Activity 23: Read and circle T/F; protect answers.',
    '5. [WB] Think Big: Invent a strange sport; keep as open creative work.',
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
    ? 'Student Book pp. 138–139'
    : 'Workbook pp. 113–114'
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

export function renderBe3U08CultureNeutralPackageToChalkieShadow(
  lessonPackage: NeutralSbWbLessonPackage,
): Be3U08CultureChalkieShadowOutput {
  assertAcceptedCulturePackage(lessonPackage)
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
        ? CULTURE_LESSON1_VOCABULARY
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
        ? CULTURE_LESSON2_VOCABULARY
        : lessonPackage.lesson2.selection.status === 'zero_selected'
          ? 'No Workbook activities selected.'
          : lessonPackage.lesson2.vocabulary.join(', ') ||
            lessonPackage.lesson2.languageModels.join(' | ') ||
            'No Workbook words or models are safely attributable to the selected activities.',
  }
}
