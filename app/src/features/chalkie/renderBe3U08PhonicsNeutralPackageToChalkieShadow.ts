/**
 * Chalkie renderer for the BE3 Unit 8 Phonics neutral package.
 *
 * Accepts SB p.141 → WB p.116 only. Does not invent transcripts, keyed answer
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

const PHONICS_PACKAGE_REFERENCE = 'be3-sb-wb-u08-p141-wb116'
const PHONICS_RELATIONSHIP_ID = 'be3_sb_wb_rel_u08_phonics_sb141_wb116'
const PHONICS_UNIT_TITLE = 'Healthy Living'

const PHONICS_LESSON1_VOCABULARY =
  'Verified Phonics targets from SB p.141 only: graphemes all, au, and aw; publisher targets ball, haul, and draw when those activities are selected. Do not invent IPA, pronunciation rules, accent variants, exceptions, minimal pairs, or extra words. Audio 163–166 are official-book dependencies without transcripts. Chant evidence bep3_sb_text_08_06 is identity/role only — never reproduce full chant text.'
const PHONICS_LESSON2_VOCABULARY =
  'Verified Workbook Phonics vocabulary from p.116 only: all / au / aw circle, underline, connect/write, and chant-gap practice when those activities are selected. Do not invent words, sentences, spellings, transcripts, or chant answers. Audio 167 has no transcript.'

/** Keyed / answer-sensitive activities whose answers must never appear as artifact prose. */
const SUPPRESS_ANSWER_PROSE_ACTIVITY_IDS = new Set([
  'bep3_sb_act_08_34',
  'bep_3_wb_act_116_27',
  'bep_3_wb_act_116_28',
  'bep_3_wb_act_116_29',
  'bep_3_wb_act_116_30',
])

export type Be3U08PhonicsChalkieShadowOutput = {
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

function assertAcceptedPhonicsPackage(
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
    identity.packageReference === PHONICS_PACKAGE_REFERENCE &&
    identity.relationshipId === PHONICS_RELATIONSHIP_ID &&
    identity.relationshipType === 'workbook_practice_for' &&
    identity.verificationStatus === 'human_verified' &&
    identity.componentKey === 'phonics' &&
    identity.componentTitle === 'Phonics' &&
    identity.studentBookCatalogId === 'big_english_3_sb' &&
    identity.workbookCatalogId === 'big_english_3_wb' &&
    identity.unitNumber === 8 &&
    identity.unitTitle === PHONICS_UNIT_TITLE &&
    packaging.type === 'two_lesson_sb_wb' &&
    arraysEqual(packaging.lessonOrder, ['lesson1', 'lesson2']) &&
    lesson1.id === 'lesson1' &&
    lesson1.role === 'student_book' &&
    lesson1.scope.source === 'SB' &&
    lesson1.scope.catalogBookId === 'big_english_3_sb' &&
    arraysEqual(lesson1.scope.printedPages, [141]) &&
    arraysEqual(lesson1.scope.pageIds, ['bep3_sb_p141']) &&
    lesson2.id === 'lesson2' &&
    lesson2.role === 'workbook' &&
    lesson2.scope.source === 'WB' &&
    lesson2.scope.catalogBookId === 'big_english_3_wb' &&
    arraysEqual(lesson2.scope.printedPages, [116]) &&
    arraysEqual(lesson2.scope.pageIds, ['bep_3_wb_p116']) &&
    lessonPackage.curriculumInterpretation == null &&
    !hasSchoolContext

  if (!valid) {
    throw new Error(
      `Phonics Chalkie shadow rendering is not enabled for ${identity.packageReference}.`,
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
  if (id === 'bep3_sb_act_08_32') {
    notes.push(
      '  Dependency: Audio 163 listen/read/repeat for graphemes all, au, and aw only; no transcript, IPA, or invented pronunciation rule.',
    )
  }
  if (id === 'bep3_sb_act_08_33') {
    notes.push(
      '  Dependency: Audio 164 plus visual find-and-say for publisher targets ball, haul, and draw; preserve visual dependency; no transcript or invented words.',
    )
  }
  if (id === 'bep3_sb_act_08_34') {
    notes.push(
      '  Boundary: eight keyed blends with Audio 165; protect keyed word inventory; do not treat answers as an open word list or reconstruct if excluded.',
    )
  }
  if (id === 'bep3_sb_act_08_35') {
    notes.push(
      '  Chant: Audio 166; reference chant evidence bep3_sb_text_08_06 by identity and role only; never reproduce full chant text; excluding this activity removes chant evidence everywhere.',
    )
  }
  if (id === 'bep_3_wb_act_116_27') {
    notes.push(
      '  Boundary: circle all, au, and aw in the publisher word box; protect keyed circle targets; do not invent additional words.',
    )
  }
  if (id === 'bep_3_wb_act_116_28') {
    notes.push(
      '  Boundary: underline all/au/aw words in two publisher sentences, then read aloud; do not invent sentences or reconstruct excluded underlines.',
    )
  }
  if (id === 'bep_3_wb_act_116_29') {
    notes.push(
      '  Boundary: connect letter parts and write three keyed words; do not invent spellings or reconstruct excluded connect/write items.',
    )
  }
  if (id === 'bep_3_wb_act_116_30') {
    notes.push(
      '  Dependency: Audio 167 listen-and-write five chant gaps; no invented transcript or reconstructed chant answers beyond canonical gap evidence.',
    )
  }
  return notes
}

function activityPromptLines(lesson: NeutralLessonPackageLesson): string[] {
  if (lesson.selection.status === 'zero_selected') {
    return lesson.role === 'student_book'
      ? [
          '- No current Student Book activities were selected.',
          '- Do not reconstruct or invent a substitute phonics drill from unselected Phonics page activities, NLL membership, or general knowledge.',
        ]
      : [
          '- No Workbook activities were selected.',
          '- Do not reconstruct or invent content from unselected Workbook Phonics activities.',
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
    '- Lesson 1: Student Book printed page 141',
    '- Lesson 2: Workbook printed page 116',
    '',
    'Do not expand beyond this exact Phonics relationship.',
    'Do not replace the Student Book or Workbook.',
    'Do not invent IPA, universal pronunciation rules, accent variants, exceptions, minimal pairs, invented words, transcripts, Writing material, or Values material.',
    'Limit target evidence to graphemes all, au, and aw only.',
    'Use the official book audio where the selected activity requires it (Audio 163–167).',
    'Workbook page 116 is verified source evidence for this series; it may not be the PDF currently open in the workspace.',
    'Treat Lesson 2 as consolidation and practice of the Student Book Phonics strand—not a second presentation of Lesson 1.',
    '',
    'SOURCE LABELS:',
    '- [SB] = Student Book evidence from page 141 only',
    '- [WB] = Workbook evidence from page 116 only',
    '- [PRIOR] = teacher-selected prior learning, not current-page evidence',
    '- [TEACHER-ADDED · UNVERIFIED] = teacher-directed language not verified as publisher evidence',
    '- [SUPPLEMENTARY] = teacher-controlled support, not publisher wording',
    '',
    'A. SERIES SCOPE',
    '',
    'Lesson 1 — Student Book p. 141',
    'Purpose: support Phonics / all, au, aw through the verified activities.',
    '',
    '[SB p.141] Activity 32: Listen, read and repeat graphemes all, au, and aw with Audio 163; no transcript, IPA, or invented pronunciation rule.',
    '[SB p.141] Activity 33: Listen to Audio 164, find publisher targets ball, haul, and draw, then say; preserve visual dependency; no invented words or transcript.',
    '[SB p.141] Activity 34: Listen to Audio 165 and blend eight keyed publisher words; protect the keyed inventory; do not reconstruct if excluded.',
    '[SB p.141] Activity 35: Read aloud, then listen and chant with Audio 166; reference chant evidence bep3_sb_text_08_06 by identity/role only; never reproduce full chant text; excluding this activity removes chant evidence everywhere.',
    '',
    'Lesson 2 — Workbook p. 116',
    'Purpose: consolidate Phonics practice through the verified Workbook activities.',
    '',
    '[WB p.116] Activity 27: Read and circle all, au, and aw in the publisher word box; protect keyed circle targets.',
    '[WB p.116] Activity 28: Underline all/au/aw words in two publisher sentences and read aloud; do not invent sentences.',
    '[WB p.116] Activity 29: Connect letter parts and write three keyed words; do not invent spellings.',
    '[WB p.116] Activity 30: Listen to Audio 167 and complete five chant-gap prompts; no invented transcript or reconstructed chant answers.',
    '',
    'B. TEACHER-SELECTED PRIOR LEARNING',
    '',
    ...priorSupportLines(lessonPackage.priorSupport),
    '',
    'C. TEACHING GUIDANCE',
    '',
    '- Keep Lesson 1 on Student Book p. 141 and Lesson 2 on Workbook p. 116.',
    '- Use only selected current-page activities; do not reconstruct excluded activities from page context, NLL membership, or general knowledge.',
    '- Keep Audio 163–167 as official-book dependencies without transcripts when those activities are selected.',
    '- Protect Activity 34 keyed blends and WB circle/underline/connect/write/chant-gap boundaries; zero selection must not invent a phonics drill.',
    '- Use selected prior or teacher-added language only as clearly labelled support; it never replaces current Phonics evidence.',
    '- Keep both lessons concise and classroom-usable.',
    '- Success means students are prepared to work with SB 141 and WB 116.',
    '',
    'D. HARD BOUNDARIES',
    '',
    '- Do not use Writing pages SB 140 or WB 115.',
    '- Do not use Values page SB 142.',
    '- Do not use Review pages SB 143 or WB 117.',
    '- Do not use Culture, Grammar, CLIL/P.E., Language in Action, Story, or Opener pages as current Phonics evidence.',
    '- Do not use or reconstruct unselected Student Book or Workbook activities.',
    '- Do not invent IPA, pronunciation rules, accent variants, exceptions, minimal pairs, invented words, transcripts, answer keys, or full chant text.',
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
    '- Lesson 1: Student Book printed page 141',
    '- Lesson 2: Workbook printed page 116',
    '',
    'Do not expand beyond this exact Phonics relationship.',
    'Do not replace the Student Book or Workbook.',
    'Do not invent IPA, universal pronunciation rules, accent variants, exceptions, minimal pairs, invented words, transcripts, Writing material, or Values material.',
    'Limit target evidence to graphemes all, au, and aw only.',
    'Workbook page 116 is verified source evidence for this series; it may not be the PDF currently open in the workspace.',
    '',
    'SOURCE LABELS:',
    '- [SB] = selected Student Book activity evidence from page 141 only',
    '- [WB] = selected Workbook activity evidence from page 116 only',
    '- [PRIOR] = teacher-selected prior learning, not current-page evidence',
    '- [TEACHER-ADDED · UNVERIFIED] = teacher-directed language not verified as publisher evidence',
    '',
    'A. SERIES SCOPE',
    '',
    'Lesson 1 — Student Book p. 141',
    sbSelectionSensitive
      ? 'Use only the selected Student Book activities below.'
      : 'Use the verified Student Book Phonics activities below.',
    ...sbActivityLines,
    '',
    sbVocabulary.length
      ? `Selected Lesson 1 words/models: ${sbVocabulary.join(', ')}.`
      : 'Selected Lesson 1 words/models: none safely attributable to the selected activities.',
    sbLanguage.length
      ? `Selected Lesson 1 language: ${sbLanguage.join(' | ')}`
      : 'Selected Lesson 1 language: none safely attributable to the selected activities.',
    '',
    'Lesson 2 — Workbook p. 116',
    wbSelectionSensitive
      ? 'Use only the selected Workbook activities below. Do not reconstruct excluded Workbook activities.'
      : 'Purpose: consolidate Phonics practice through the verified Workbook activities.',
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
    '- Keep Lesson 1 on Student Book p. 141 and Lesson 2 on Workbook p. 116.',
    noLesson1Activities
      ? '- Lesson 1: no current Student Book activities were selected; do not recreate them or invent a substitute phonics drill.'
      : sbSelectionSensitive
        ? '- Lesson 1: use only the selected Student Book activities listed above; do not reconstruct excluded activities.'
        : '- Lesson 1: use the verified Student Book activities listed above.',
    noLesson2Activities
      ? '- Lesson 2: no Workbook activities were selected; keep the lesson slot valid but do not recreate or substitute Workbook teaching content.'
      : wbSelectionSensitive
        ? '- Lesson 2: use only the selected Workbook activities listed above; do not reconstruct excluded activities.'
        : '- Lesson 2: use the verified Workbook consolidation/practice activities listed above.',
    '- Prior learning remains separate and never replaces unselected current Phonics evidence.',
    '- Keep both lessons concise and classroom-usable.',
    '',
    'D. HARD BOUNDARIES',
    '',
    '- Do not use Writing pages SB 140 or WB 115, Values page SB 142, or Review pages SB 143 / WB 117.',
    '- Do not use Culture, Grammar, CLIL/P.E., Language in Action, Story, or Opener pages as current Phonics evidence.',
    '- Do not use or reconstruct unselected Student Book or Workbook activities.',
    '- Do not invent IPA, pronunciation rules, accent variants, exceptions, minimal pairs, invented words, transcripts, answer keys, or full chant text.',
    '- Do not load or quote NLL-derived summaries as artifact prose.',
  ].join('\n')
}

function renderAcceptedLesson1Outline(): string {
  return [
    'Concise teacher-controlled outline — Lesson 1',
    'Short teaching sequence for Student Book p. 141 only (Phonics · all, au, aw). Keep book-working time; do not expand into a slide-by-slide script.',
    '',
    '1. [SB] Activity 32: Listen, read and repeat all/au/aw with Audio 163; no transcript or IPA.',
    '2. [SB] Activity 33: Listen/find/say ball, haul, draw with Audio 164; preserve visual dependency.',
    '3. [SB] Activity 34: Blend eight keyed words with Audio 165; protect keyed inventory.',
    '4. [SB] Activity 35: Read aloud then chant with Audio 166; chant evidence by identity/role only — never full chant text.',
    '5. [SUPPLEMENTARY] Finish with one brief teacher-selected content check; do not present it as publisher wording.',
    '',
  ].join('\n')
}

function renderAcceptedLesson2Outline(): string {
  return [
    'Concise teacher-controlled outline — Lesson 2',
    'Short teaching sequence for Workbook p. 116 only. Consolidation and practice of the Student Book Phonics strand—not a second Lesson 1. Keep book-working time; do not expand into a slide-by-slide script.',
    '',
    '1. [WB] Activity 27: Circle all/au/aw in the word box; protect answers.',
    '2. [WB] Activity 28: Underline all/au/aw words and read aloud; protect answers.',
    '3. [WB] Activity 29: Connect letters and write three keyed words; protect answers.',
    '4. [WB] Activity 30: Listen to Audio 167 and write chant gaps; no transcript or invented answers.',
    '5. [SUPPLEMENTARY] Finish with one brief teacher-selected content check; do not present it as publisher wording.',
    '',
  ].join('\n')
}

function renderSelectionAwareOutline(
  lesson: NeutralLessonPackageLesson,
): string {
  const isStudentBook = lesson.role === 'student_book'
  const source = isStudentBook ? 'SB' : 'WB'
  const lessonNumber = isStudentBook ? '1' : '2'
  const scope = isStudentBook ? 'Student Book p. 141' : 'Workbook p. 116'
  const lines = [
    `Concise teacher-controlled outline — Lesson ${lessonNumber}`,
    `Short teaching sequence for ${scope} only. Use only selected activities; do not reconstruct excluded activities.`,
    '',
  ]

  if (lesson.selection.status === 'zero_selected') {
    lines.push(
      isStudentBook
        ? '1. [SB] No current Student Book activities were selected. Do not invent a substitute phonics drill.'
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

export function renderBe3U08PhonicsNeutralPackageToChalkieShadow(
  lessonPackage: NeutralSbWbLessonPackage,
): Be3U08PhonicsChalkieShadowOutput {
  assertAcceptedPhonicsPackage(lessonPackage)
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
        ? PHONICS_LESSON1_VOCABULARY
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
        ? PHONICS_LESSON2_VOCABULARY
        : lessonPackage.lesson2.selection.status === 'zero_selected'
          ? 'No Workbook activities selected.'
          : lessonPackage.lesson2.vocabulary.join(', ') ||
            lessonPackage.lesson2.languageModels.join(' | ') ||
            'No Workbook words or models are safely attributable to the selected activities.',
  }
}
