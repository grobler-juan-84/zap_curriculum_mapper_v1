/**
 * Local asymmetric two-lesson SB→WB handoff for the accepted BE3 U8 Story pairing.
 *
 * Relationship: be3_sb_wb_rel_u08_story_sb130-131_wb106
 * Lesson 1: SB pp.130–131 only · Lesson 2: WB p.106 only.
 * Scope is WB p.106 only (Language in Action companion page is out of package scope).
 * Not a general pairing rule.
 */
import type { TeacherChoiceSuggestion } from './teacherChoiceSuggestions'
import type { TeacherAddedLanguageInput } from './buildChalkiePromptPreview'
import { BE3_U08_SB130_131_WB106 } from './verifiedSbWbCompanions'
import {
  hasNoSelectedSbActivities,
  hasSbActivityExclusions,
  selectedSbActivityLanguage,
  selectedSbActivityPromptLines,
  selectedSbActivityVocabulary,
  type SbActivityHandoffSelection,
} from './chalkieActivitySelection'
import {
  hasNoSelectedWbActivities,
  hasWbActivityExclusions,
  selectedWbActivityLanguage,
  selectedWbActivityPromptLines,
  selectedWbActivityVocabulary,
  type WbActivityHandoffSelection,
} from './chalkieWorkbookActivitySelection'

export const BE3_U08_STORY_SERIES_RELATIONSHIP_ID =
  BE3_U08_SB130_131_WB106.relationshipId

export const BE3_U08_STORY_SERIES_TITLE =
  'BE3 Unit 08 · SB pp. 130–131 + WB p. 106 — Healthy Living — An Unhealthy Dinner'

export const BE3_U08_STORY_SERIES_STABLE_REF = 'be3-sb-wb-u08-p130-131-wb106'

/**
 * SB pp.130–131 have no dedicated target-vocabulary rows.
 * Keep an honest limited note — do not pad with opener (128–129) language.
 */
export const BE3_U08_STORY_LESSON1_VOCAB =
  'No dedicated target vocabulary listed on SB pp.130–131 (Story / Reading · An Unhealthy Dinner).'

/** Verified WB p.106 target vocabulary + Think Big categorisation items (source-confirmed). */
export const BE3_U08_STORY_LESSON2_VOCAB = [
  'unhealthy',
  'fries',
  'lettuce',
  'tomatoes',
  'cola',
  'burger',
  'water',
].join(', ')

export type Be3U08StorySeriesHandoff = {
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
  workbookActivitySelection?: WbActivityHandoffSelection
}): string {
  if (
    (input.activitySelection &&
      hasSbActivityExclusions(input.activitySelection)) ||
    (input.workbookActivitySelection &&
      hasWbActivityExclusions(input.workbookActivitySelection))
  ) {
    return buildSelectionAwareDetailedHandoff(input)
  }
  const priorLines = buildPriorLearningBlock(input)

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
    `[SB] Dedicated target vocabulary on these pages: none listed. ${BE3_U08_STORY_LESSON1_VOCAB}`,
    '',
    'Lesson 2 — Workbook p. 106 only',
    'Purpose: consolidate the story strand with Did Amy…? Yes/No she did short answers, personal dinner reflection, and Think Big healthy/unhealthy categorisation.',
    '',
    '[WB p.106] Unit 8 Healthy Living · Story',
    '[WB p.106] Notes: Story title: An Unhealthy Dinner',
    `[WB p.106] Target vocabulary: ${BE3_U08_STORY_LESSON2_VOCAB}.`,
    "[WB p.106] Activity 5: Read and answer. Write Yes, she did or No, she didn’t. (Did Amy eat a burger and fries…? / Did she eat fried food? / Did she drink a large glass of water? / Did she eat a healthy dinner?)",
    '[WB p.106] Language model: Did Amy…? → Yes, she did. / No, she didn’t.',
    '[WB p.106] Activity 6: What did you eat for dinner yesterday? Was it healthy? Draw, write, and circle.',
    '[WB p.106] Think Big: Healthy or unhealthy? Draw. (fries, lettuce, tomatoes, bottle of cola, burger, water)',
    '',
    'Verified lesson vocabulary notes (page evidence only — not a publisher lesson split):',
    `- Lesson 1 vocabulary: ${BE3_U08_STORY_LESSON1_VOCAB}`,
    `- Lesson 2 vocabulary: ${BE3_U08_STORY_LESSON2_VOCAB}`,
    '',
    'B. TEACHER-SELECTED PRIOR LEARNING',
    '',
    ...priorLines,
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

function buildSelectionAwareDetailedHandoff(input: {
  selectedSuggestions: TeacherChoiceSuggestion[]
  teacherAdditions: TeacherAddedLanguageInput[]
  activitySelection?: SbActivityHandoffSelection
  workbookActivitySelection?: WbActivityHandoffSelection
}): string {
  const priorLines = buildPriorLearningBlock(input)
  const sbSelectionSensitive =
    input.activitySelection != null &&
    hasSbActivityExclusions(input.activitySelection)
  const wbSelectionSensitive =
    input.workbookActivitySelection != null &&
    hasWbActivityExclusions(input.workbookActivitySelection)
  const sbActivityLines = sbSelectionSensitive
    ? selectedSbActivityPromptLines(input.activitySelection!)
    : [
        '[SB p.130] Activity 6: Listen and read. Did Amy eat a healthy dinner? (Audio track 154 required.)',
        '[SB p.131] Activity 7: Read and choose.',
      ]
  const sbVocabulary = sbSelectionSensitive
    ? selectedSbActivityVocabulary(input.activitySelection!)
    : []
  const sbLanguage = sbSelectionSensitive
    ? selectedSbActivityLanguage(input.activitySelection!)
    : []
  const wbActivityLines = wbSelectionSensitive
    ? selectedWbActivityPromptLines(input.workbookActivitySelection!)
    : [
        '[WB p.106] Unit 8 Healthy Living · Story',
        '[WB p.106] Notes: Story title: An Unhealthy Dinner',
        `[WB p.106] Target vocabulary: ${BE3_U08_STORY_LESSON2_VOCAB}.`,
        "[WB p.106] Activity 5: Read and answer. Write Yes, she did or No, she didn’t. (Did Amy eat a burger and fries…? / Did she eat fried food? / Did she drink a large glass of water? / Did she eat a healthy dinner?)",
        '[WB p.106] Language model: Did Amy…? → Yes, she did. / No, she didn’t.',
        '[WB p.106] Activity 6: What did you eat for dinner yesterday? Was it healthy? Draw, write, and circle.',
        '[WB p.106] Think Big: Healthy or unhealthy? Draw. (fries, lettuce, tomatoes, bottle of cola, burger, water)',
      ]
  const wbVocabulary = wbSelectionSensitive
    ? selectedWbActivityVocabulary(input.workbookActivitySelection!)
    : BE3_U08_STORY_LESSON2_VOCAB.split(', ')
  const wbLanguage = wbSelectionSensitive
    ? selectedWbActivityLanguage(input.workbookActivitySelection!)
    : ['Did Amy…? / Yes, she did. / No, she didn’t.']
  const noSbActivities =
    sbSelectionSensitive && hasNoSelectedSbActivities(input.activitySelection!)
  const noWbActivities =
    wbSelectionSensitive &&
    hasNoSelectedWbActivities(input.workbookActivitySelection!)

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
    ...priorLines,
    '',
    'C. TEACHING GUIDANCE',
    '',
    '- Keep Lesson 1 on Student Book pp. 130–131 and Lesson 2 on Workbook p. 106 only.',
    noSbActivities
      ? '- Lesson 1: no current Student Book activities were selected; do not recreate them from page context.'
      : sbSelectionSensitive
        ? '- Lesson 1: use only the selected Student Book activities listed above; do not reconstruct excluded activities.'
        : '- Lesson 1: use the verified Student Book activities listed above.',
    noWbActivities
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

export const BE3_U08_STORY_LESSON1_OUTLINE = [
  'Concise teacher-controlled outline — Lesson 1',
  'Short teaching sequence for Student Book pp. 130–131 only (Story / Reading · An Unhealthy Dinner). Keep book-working time; do not expand into a slide-by-slide script.',
  '',
  '1. [SB] Activity 6: Listen and read. Did Amy eat a healthy dinner? Use the official book audio (Track 154).',
  "2. [SB] Check understanding of the story question: Did Amy eat a healthy dinner? → No, she didn't.",
  '3. [SB] Activity 7: Read and choose. Complete the Amy-dinner comprehension items on the page.',
  '4. [SUPPLEMENTARY] Finish with a brief oral recap of why Amy’s dinner was unhealthy (student language; not a publisher script).',
  '',
].join('\n')

export const BE3_U08_STORY_LESSON2_OUTLINE = [
  'Concise teacher-controlled outline — Lesson 2',
  'Short teaching sequence for Workbook p. 106 only. Consolidation/practice of the Student Book story — not a second Lesson 1. Keep book-working time; do not expand into a slide-by-slide script.',
  '',
  "1. [WB] Activity 5: Read and answer. Write Yes, she did or No, she didn’t. (Did Amy…? short answers about the story dinner.)",
  '2. [WB] Activity 6: What did you eat for dinner yesterday? Was it healthy? Draw, write, and circle.',
  '3. [WB] Think Big: Healthy or unhealthy? Draw.',
  '4. [SUPPLEMENTARY] Finish with a brief oral check using one Did…? / Yes, she did / No, she didn’t item from the story strand.',
  '',
].join('\n')

function buildSelectionAwareLesson1Outline(
  selection: SbActivityHandoffSelection,
): string {
  const lines = [
    'Concise teacher-controlled outline — Lesson 1',
    'Short teaching sequence for Student Book pp. 130–131 only. Use only selected activities; do not reconstruct excluded activities.',
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
      const answer = activity.expectedAnswer
        ? ` Answer evidence: ${activity.expectedAnswer}`
        : ''
      lines.push(
        `${index + 1}. [SB] ${number}: ${activity.verifiedWording}${audio}${answer}`,
      )
    })
  }
  lines.push('')
  return lines.join('\n')
}

function buildSelectionAwareLesson2Outline(
  selection: WbActivityHandoffSelection,
): string {
  const lines = [
    'Concise teacher-controlled outline — Lesson 2',
    'Short teaching sequence for Workbook p. 106 only. Use only selected activities; do not reconstruct excluded activities.',
    '',
  ]
  if (hasNoSelectedWbActivities(selection)) {
    lines.push(
      '1. [WB] No Workbook activities were selected. Keep the Lesson 2 slot valid without adding or substituting Workbook teaching content.',
    )
  } else {
    selection.selectedEvidence.forEach((activity, index) => {
      const number = activity.activityNumber
        ? `Activity ${activity.activityNumber}`
        : 'Activity'
      const audio = activity.audioDependency
        ? ` Use the official book audio${activity.sourceDependencyNote ? ` (${activity.sourceDependencyNote})` : ''}.`
        : ''
      const answer = activity.expectedAnswer
        ? ` Answer evidence: ${activity.expectedAnswer}`
        : ''
      const language = activity.languageFrame
        ? ` Model: ${activity.languageFrame}`
        : ''
      lines.push(
        `${index + 1}. [WB] ${number}: ${activity.verifiedWording}${audio}${answer}${language}`,
      )
    })
  }
  lines.push('')
  return lines.join('\n')
}

/**
 * Build the six local series copyables for the accepted BE3 U8 story pair only.
 */
export function buildBe3U08StorySbWbSeriesHandoff(input?: {
  selectedSuggestions?: TeacherChoiceSuggestion[]
  teacherAdditions?: TeacherAddedLanguageInput[]
  activitySelection?: SbActivityHandoffSelection
  workbookActivitySelection?: WbActivityHandoffSelection
}): Be3U08StorySeriesHandoff {
  const selectionOverride =
    input?.activitySelection &&
    hasSbActivityExclusions(input.activitySelection)
      ? input.activitySelection
      : null
  const workbookSelectionOverride =
    input?.workbookActivitySelection &&
    hasWbActivityExclusions(input.workbookActivitySelection)
      ? input.workbookActivitySelection
      : null
  return {
    relationshipId: BE3_U08_STORY_SERIES_RELATIONSHIP_ID,
    seriesTitle: BE3_U08_STORY_SERIES_TITLE,
    stableSeriesReference: BE3_U08_STORY_SERIES_STABLE_REF,
    detailedHandoff: buildDetailedHandoff({
      selectedSuggestions: input?.selectedSuggestions ?? [],
      teacherAdditions: input?.teacherAdditions ?? [],
      activitySelection: input?.activitySelection,
      workbookActivitySelection: input?.workbookActivitySelection,
    }),
    lesson1Outline: selectionOverride
      ? buildSelectionAwareLesson1Outline(selectionOverride)
      : BE3_U08_STORY_LESSON1_OUTLINE,
    lesson1Vocabulary: selectionOverride
      ? selectedSbActivityVocabulary(selectionOverride).join(', ')
      : BE3_U08_STORY_LESSON1_VOCAB,
    lesson2Outline: workbookSelectionOverride
      ? buildSelectionAwareLesson2Outline(workbookSelectionOverride)
      : BE3_U08_STORY_LESSON2_OUTLINE,
    lesson2Vocabulary: workbookSelectionOverride
      ? hasNoSelectedWbActivities(workbookSelectionOverride)
        ? 'No Workbook activities selected.'
        : selectedWbActivityVocabulary(workbookSelectionOverride).join(', ') ||
          'No Workbook words or models are safely attributable to the selected activities.'
      : BE3_U08_STORY_LESSON2_VOCAB,
  }
}

export function isBe3U08StorySeriesCompanion(
  companion: { relationshipId?: string | null } | null | undefined,
): boolean {
  return companion?.relationshipId === BE3_U08_STORY_SERIES_RELATIONSHIP_ID
}
