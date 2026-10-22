/**
 * Local two-lesson SB→WB handoff for the one accepted BE3 U8 opener pairing.
 *
 * Relationship: be3_sb_wb_rel_u08_opener_sb128-129_wb104-105
 * Content is grounded in verified Phase 1 canonical evidence for SB 128–129
 * and WB 104–105 only. Not a general pairing rule.
 */
import type { TeacherChoiceSuggestion } from './teacherChoiceSuggestions'
import type { TeacherAddedLanguageInput } from './buildChalkiePromptPreview'
import { BE3_U08_SB128_129_WB104_105 } from './verifiedSbWbCompanions'
import {
  hasNoSelectedSbActivities,
  hasSbActivityExclusions,
  selectedSbActivityLanguage,
  selectedSbActivityPromptLines,
  selectedSbActivityVocabulary,
  type SbActivityHandoffSelection,
} from './chalkieActivitySelection'

export const BE3_U08_OPENER_SERIES_RELATIONSHIP_ID =
  BE3_U08_SB128_129_WB104_105.relationshipId

export const BE3_U08_OPENER_SERIES_TITLE =
  'BE3 Unit 08 · SB pp. 128–129 + WB pp. 104–105 — Healthy Living — Healthy and unhealthy activities'

export const BE3_U08_OPENER_SERIES_STABLE_REF = 'be3-sb-wb-u08-p128-129-wb104-105'

/** Verified SB p.128 target vocabulary (present forms). */
export const BE3_U08_OPENER_LESSON1_VOCAB = [
  'have a big breakfast',
  'get 10 hours of sleep',
  'drink lots of water',
  'ride a bike',
  'eat breakfast',
  'get any exercise',
  'have a healthy lunch',
  'get enough sleep',
].join(', ')

/**
 * Verified WB pp.104–105 target vocabulary (past/contrast consolidation forms).
 * Does not duplicate the full SB present-form list.
 */
export const BE3_U08_OPENER_LESSON2_VOCAB = [
  'ate a healthy breakfast',
  'ate pie for breakfast',
  'drank lots of water',
  'got ten hours of sleep',
  'got two hours of sleep',
  'rode a bike',
  'exercise',
  'enough',
].join(', ')

export type Be3U08OpenerSeriesHandoff = {
  relationshipId: string
  seriesTitle: string
  stableSeriesReference: string
  detailedHandoff: string
  lesson1Outline: string
  lesson1Vocabulary: string
  lesson2Outline: string
  lesson2Vocabulary: string
}

function buildPriorLearningBlock(input: {
  selectedSuggestions: TeacherChoiceSuggestion[]
  teacherAdditions: TeacherAddedLanguageInput[]
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

function buildDetailedHandoff(input: {
  selectedSuggestions: TeacherChoiceSuggestion[]
  teacherAdditions: TeacherAddedLanguageInput[]
  activitySelection?: SbActivityHandoffSelection
}): string {
  if (
    input.activitySelection &&
    hasSbActivityExclusions(input.activitySelection)
  ) {
    return buildSelectionAwareDetailedHandoff({
      ...input,
      activitySelection: input.activitySelection,
    })
  }
  const priorLines = buildPriorLearningBlock(input)

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
    `[SB p.128] Target vocabulary: ${BE3_U08_OPENER_LESSON1_VOCAB}.`,
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
    `[WB p.104] Target vocabulary (past/contrast forms): ${BE3_U08_OPENER_LESSON2_VOCAB}.`,
    '[WB p.104] Activity 1: Write. Use activities from the box. Then check (✓) the healthy ones.',
    '[WB p.104] Activity 2: Read and circle for you. (Includes How do you feel today? and Did you…? Yes/No items.)',
    '',
    '[WB p.105] Song practice · Live Right!',
    '[WB p.105] Activity 3: Listen and write. (Audio track 153 required. Word box: any, Did, enough, good, too, you.)',
    "[WB p.105] Activity 4: Read and ✓ for you. Then answer with Yes, I did or No, I didn't.",
    '',
    'Verified lesson vocabulary lists (page evidence only — not a publisher lesson split):',
    `- Lesson 1 vocabulary: ${BE3_U08_OPENER_LESSON1_VOCAB}`,
    `- Lesson 2 vocabulary: ${BE3_U08_OPENER_LESSON2_VOCAB}`,
    '',
    'B. TEACHER-SELECTED PRIOR LEARNING',
    '',
    ...priorLines,
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

function buildSelectionAwareDetailedHandoff(input: {
  selectedSuggestions: TeacherChoiceSuggestion[]
  teacherAdditions: TeacherAddedLanguageInput[]
  activitySelection: SbActivityHandoffSelection
}): string {
  const priorLines = buildPriorLearningBlock(input)
  const activityLines = selectedSbActivityPromptLines(input.activitySelection)
  const vocabulary = selectedSbActivityVocabulary(input.activitySelection)
  const language = selectedSbActivityLanguage(input.activitySelection)
  const noActivities = hasNoSelectedSbActivities(input.activitySelection)

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
    '- [WB] = Workbook evidence from pages 104–105 only',
    '- [PRIOR] = teacher-selected prior learning from earlier pages in the same unit',
    '- [TEACHER-ADDED · UNVERIFIED] = teacher-directed language not currently verified as prior-book evidence',
    '',
    'A. SERIES SCOPE',
    '',
    'Lesson 1 — Student Book pp. 128–129',
    'Use only the selected Student Book activities below.',
    ...activityLines,
    '',
    vocabulary.length
      ? `Selected Lesson 1 words/models: ${vocabulary.join(', ')}.`
      : 'Selected Lesson 1 words/models: none safely attributable to the selected activities.',
    language.length
      ? `Selected Lesson 1 language: ${language.join(' | ')}`
      : 'Selected Lesson 1 language: none safely attributable to the selected activities.',
    '',
    'Lesson 2 — Workbook pp. 104–105',
    'Purpose: consolidate the opener strand with past/contrast healthy-activity writing, personal Did you…? responses, and Live Right! song listen/write practice.',
    '',
    '[WB p.104] Unit 8 Healthy Living · unit opener vocabulary',
    `[WB p.104] Target vocabulary (past/contrast forms): ${BE3_U08_OPENER_LESSON2_VOCAB}.`,
    '[WB p.104] Activity 1: Write. Use activities from the box. Then check (✓) the healthy ones.',
    '[WB p.104] Activity 2: Read and circle for you. (Includes How do you feel today? and Did you…? Yes/No items.)',
    '',
    '[WB p.105] Song practice · Live Right!',
    '[WB p.105] Activity 3: Listen and write. (Audio track 153 required. Word box: any, Did, enough, good, too, you.)',
    "[WB p.105] Activity 4: Read and ✓ for you. Then answer with Yes, I did or No, I didn't.",
    `- Lesson 2 vocabulary: ${BE3_U08_OPENER_LESSON2_VOCAB}`,
    '',
    'B. TEACHER-SELECTED PRIOR LEARNING',
    '',
    ...priorLines,
    '',
    'C. TEACHING GUIDANCE',
    '',
    '- Keep Lesson 1 on Student Book pp. 128–129 and Lesson 2 on Workbook pp. 104–105.',
    noActivities
      ? '- Lesson 1: no current Student Book activities were selected; do not recreate them from page context.'
      : '- Lesson 1: use only the selected Student Book activities listed above; do not reconstruct excluded activities.',
    '- Lesson 2: keep the existing Workbook consolidation/practice scope unchanged.',
    '- Prior learning remains separate support and does not replace unselected current-page content.',
    '- Keep both lessons concise and classroom-usable.',
    '',
    'D. HARD BOUNDARIES',
    '',
    '- Stay on Student Book pages 128–129 and Workbook pages 104–105 only.',
    '- Do not use or reconstruct unselected Student Book activities.',
    '- Do not change Workbook scope, vocabulary, outline, or infer Workbook activity selection.',
    '- Do not invent publisher audio scripts, song lyrics, or unknown exercise items.',
  ].join('\n')
}

export const BE3_U08_OPENER_LESSON1_OUTLINE = [
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

export const BE3_U08_OPENER_LESSON2_OUTLINE = [
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

function buildSelectionAwareLesson1Outline(
  selection: SbActivityHandoffSelection,
): string {
  const lines = [
    'Concise teacher-controlled outline — Lesson 1',
    'Short teaching sequence for Student Book pp. 128–129 only. Use only selected activities; do not reconstruct excluded activities.',
    '',
  ]
  if (hasNoSelectedSbActivities(selection)) {
    lines.push(
      '1. [SB] No current Student Book activities were selected. Teacher must review the source selection before adding current-page work.',
    )
  } else {
    selection.selectedEvidence.forEach((activity, index) => {
      const number = activity.activityNumber
        ? `Activity ${activity.activityNumber}`
        : 'Activity'
      const audio = activity.audioDependency
        ? ` Use the official book audio${activity.sourceDependencyNote ? ` (${activity.sourceDependencyNote})` : ''}.`
        : ''
      const language = activity.languageFrame
        ? ` Model: ${activity.languageFrame}`
        : ''
      lines.push(
        `${index + 1}. [SB] ${number}: ${activity.verifiedWording}${audio}${language}`,
      )
    })
  }
  lines.push('')
  return lines.join('\n')
}

/**
 * Build the six local series copyables for the accepted BE3 U8 opener pair only.
 */
export function buildBe3U08OpenerSbWbSeriesHandoff(input?: {
  selectedSuggestions?: TeacherChoiceSuggestion[]
  teacherAdditions?: TeacherAddedLanguageInput[]
  activitySelection?: SbActivityHandoffSelection
}): Be3U08OpenerSeriesHandoff {
  const selectionOverride =
    input?.activitySelection &&
    hasSbActivityExclusions(input.activitySelection)
      ? input.activitySelection
      : null
  return {
    relationshipId: BE3_U08_OPENER_SERIES_RELATIONSHIP_ID,
    seriesTitle: BE3_U08_OPENER_SERIES_TITLE,
    stableSeriesReference: BE3_U08_OPENER_SERIES_STABLE_REF,
    detailedHandoff: buildDetailedHandoff({
      selectedSuggestions: input?.selectedSuggestions ?? [],
      teacherAdditions: input?.teacherAdditions ?? [],
      activitySelection: input?.activitySelection,
    }),
    lesson1Outline: selectionOverride
      ? buildSelectionAwareLesson1Outline(selectionOverride)
      : BE3_U08_OPENER_LESSON1_OUTLINE,
    lesson1Vocabulary: selectionOverride
      ? selectedSbActivityVocabulary(selectionOverride).join(', ')
      : BE3_U08_OPENER_LESSON1_VOCAB,
    lesson2Outline: BE3_U08_OPENER_LESSON2_OUTLINE,
    lesson2Vocabulary: BE3_U08_OPENER_LESSON2_VOCAB,
  }
}

export function isBe3U08OpenerSeriesCompanion(
  companion: { relationshipId?: string | null } | null | undefined,
): boolean {
  return companion?.relationshipId === BE3_U08_OPENER_SERIES_RELATIONSHIP_ID
}
