/**
 * Platform-neutral detailed general lesson plan from the same selected
 * Chalkie lesson evidence and package shape. Local assembly only — not an
 * external-model generation product.
 *
 * Optional BI planning context (D022) may appear as a labelled interpretation
 * section for the BE3 U8 Opener slice only — never as page evidence.
 */
import type { BiPlanningContext } from '../../lib/bookIntelligence/toBiPlanningContext'
import {
  toBiPlanningContext,
} from '../../lib/bookIntelligence/toBiPlanningContext'
import type { BookIntelligenceUnitOverview } from '../../types/bookIntelligence'
import {
  allocateSbOnlyTwoLessonActivities,
  formatSbOnlyLessonActivityScope,
} from './allocateSbOnlyTwoLessonActivities'
import type {
  SbActivityHandoffSelection,
  SelectedSbActivityEvidence,
} from './chalkieActivitySelection'
import {
  hasNoSelectedSbActivities,
  selectedSbActivityLanguage,
  selectedSbActivityVocabulary,
} from './chalkieActivitySelection'
import type {
  SelectedWbActivityEvidence,
  WbActivityHandoffSelection,
} from './chalkieWorkbookActivitySelection'
import {
  lessonTitleForPackage,
  type LessonPackageShape,
  type TeacherAddedLanguageInput,
} from './buildChalkiePromptPreview'
import { isBe3U08OpenerSeriesCompanion } from './buildBe3U08OpenerSbWbSeriesHandoff'
import type { ChalkieLessonContext } from './resolveChalkieLessonContext'
import type { TeacherChoiceSuggestion } from './teacherChoiceSuggestions'

export type DetailedGeneralLessonPlanResult = {
  readonly detailedLessonPlan: string
  readonly packageShapeLabel: string
}

function formatPageList(pages: readonly number[]): string {
  return pages.join(', ')
}

function formatPageRange(pages: readonly number[]): string {
  if (pages.length === 0) return '(no pages)'
  if (pages.length === 1) return `p. ${pages[0]}`
  return `pp. ${pages[0]}–${pages[pages.length - 1]}`
}

function packageShapeLabel(
  lesson: ChalkieLessonContext,
  packageShape: LessonPackageShape,
): string {
  if (packageShape !== 'series' || !lesson.supportsTwoLessonSeries) {
    return 'Single lesson'
  }
  if (lesson.twoLessonPackagingMode === 'sb_only') {
    return 'Two lessons from this Student Book spread'
  }
  if (lesson.twoLessonPackagingMode === 'sb_wb') {
    return 'Two-lesson Student Book → Workbook series'
  }
  return 'Single lesson'
}

function formatLearningOutcomesProvenance(
  provenance: BiPlanningContext['learningOutcomesProvenance'],
): string {
  switch (provenance) {
    case 'evidence_quoted':
      return 'evidence_quoted'
    case 'mixed':
      return 'mixed'
    case 'ai_inferred':
    default:
      return 'ai_inferred'
  }
}

/**
 * Labelled BI planning section for NLP consumers. Does not change activities,
 * vocabulary, language models, or page scope.
 */
export function formatBiPlanningContextSection(
  context: BiPlanningContext | null | undefined,
): string[] {
  if (!context) return []
  const lines = [
    'UNIT PLANNING CONTEXT (Book Intelligence · phase2_interpretation)',
    'Optional curriculum interpretation — not Student Book / Workbook page evidence.',
    'Do not treat this block as [SB]/ [WB], or [SS] source text.',
  ]
  if (context.communicativeFocus) {
    lines.push(`- Communicative focus: ${context.communicativeFocus}`)
  }
  if (context.suggestedLearningOutcomes) {
    const provenance = formatLearningOutcomesProvenance(
      context.learningOutcomesProvenance,
    )
    lines.push(
      `- Suggested learning outcomes (${provenance}): ${context.suggestedLearningOutcomes}`,
    )
  }
  return lines
}

function resolveBiPlanningForOpenerPlan(input: {
  lesson: ChalkieLessonContext
  biPlanningContext?: BiPlanningContext | null
  bookIntelligenceUnit?: BookIntelligenceUnitOverview | null
  biArtifactRef?: string | null
}): BiPlanningContext | null {
  if (!isBe3U08OpenerSeriesCompanion(input.lesson.workbookCompanion)) {
    return null
  }
  if (input.biPlanningContext) return input.biPlanningContext
  if (!input.bookIntelligenceUnit || !input.lesson.catalogBookId) return null
  return toBiPlanningContext({
    catalogBookId: input.lesson.catalogBookId,
    unit: input.bookIntelligenceUnit,
    biArtifactRef: input.biArtifactRef,
    expectedUnitNumber: input.lesson.unitNumber,
  })
}

function priorLearningLines(input: {
  selectedSuggestions: TeacherChoiceSuggestion[]
  teacherAdditions: TeacherAddedLanguageInput[]
}): string[] {
  const lines: string[] = []
  if (input.selectedSuggestions.length === 0 && input.teacherAdditions.length === 0) {
    lines.push('- None selected.')
    return lines
  }
  for (const suggestion of input.selectedSuggestions) {
    const tag = suggestion.provenanceTag ?? '[PRIOR]'
    lines.push(
      `- ${tag} ${suggestion.label} (${suggestion.source}): ${suggestion.frame}`,
    )
  }
  for (const addition of input.teacherAdditions) {
    const title = addition.title.trim()
    const frame = addition.frame.trim()
    lines.push(
      `- [TEACHER-ADDED · UNVERIFIED] ${title ? `${title}: ` : ''}${frame}`,
    )
    if (addition.purpose.trim()) {
      lines.push(`  Purpose: ${addition.purpose.trim()}`)
    }
  }
  return lines
}

function sbActivityLines(
  activities: readonly SelectedSbActivityEvidence[],
  emptyMessage: string,
): string[] {
  if (activities.length === 0) return [`- ${emptyMessage}`]
  return activities.map((activity) => {
    const number = activity.activityNumber
      ? `Activity ${activity.activityNumber}`
      : 'Activity'
    return `- [SB p.${activity.printedPage}] ${number}: ${activity.verifiedWording}`
  })
}

function wbActivityLines(
  activities: readonly SelectedWbActivityEvidence[],
  emptyMessage: string,
): string[] {
  if (activities.length === 0) return [`- ${emptyMessage}`]
  return activities.map((activity) => {
    const number = activity.activityNumber
      ? `Activity ${activity.activityNumber}`
      : 'Activity'
    return `- [WB p.${activity.printedPage}] ${number}: ${activity.verifiedWording}`
  })
}

function objectiveFromFocus(lesson: ChalkieLessonContext): string {
  if (lesson.teachingFocus?.trim()) {
    return lesson.teachingFocus.trim()
  }
  if (lesson.lessonTopic?.trim()) {
    return `Support students with ${lesson.lessonTopic.trim()} using the selected Student Book pages.`
  }
  return `Support students with the selected Student Book evidence on ${lesson.visiblePageRangeLabel}.`
}

function sequenceStepsFromActivities(
  activities: readonly SelectedSbActivityEvidence[],
  sourceLabel: string,
): string[] {
  if (activities.length === 0) {
    return [
      `- Open ${sourceLabel} and orient students to the page spread.`,
      '- Use teacher-selected prior learning only if it fits naturally as warm-up support.',
      '- Guide students through the available page work without inventing missing exercise text.',
      '- Close with a short oral or written check using the page language.',
    ]
  }
  const steps: string[] = [
    `- Open ${sourceLabel} and briefly set the lesson focus.`,
  ]
  for (const [index, activity] of activities.entries()) {
    const number = activity.activityNumber
      ? `Activity ${activity.activityNumber}`
      : `Activity ${index + 1}`
    steps.push(
      `- Lead ${number} on SB p.${activity.printedPage}: ${activity.verifiedWording}`,
    )
  }
  steps.push(
    '- Use selected prior-learning support only where it helps students access the current page work.',
  )
  steps.push('- End with a short check that students can use the page language with support.')
  return steps
}

function wbSequenceSteps(
  activities: readonly SelectedWbActivityEvidence[],
  sourceLabel: string,
): string[] {
  if (activities.length === 0) {
    return [
      `- Open ${sourceLabel} and connect briefly to the previous Student Book lesson.`,
      '- Guide students through the available Workbook practice without inventing missing items.',
      '- Close with a short consolidation check.',
    ]
  }
  const steps: string[] = [
    `- Open ${sourceLabel} as consolidation/practice after the Student Book lesson.`,
  ]
  for (const [index, activity] of activities.entries()) {
    const number = activity.activityNumber
      ? `Activity ${activity.activityNumber}`
      : `Activity ${index + 1}`
    steps.push(
      `- Lead ${number} on WB p.${activity.printedPage}: ${activity.verifiedWording}`,
    )
  }
  steps.push('- Keep this lesson as practice of the paired Student Book work — not a second presentation.')
  steps.push('- Close with a short check for understanding from the Workbook tasks.')
  return steps
}

function checksForUnderstanding(
  words: readonly string[],
  language: readonly string[],
): string[] {
  const lines: string[] = []
  if (language.length > 0) {
    lines.push(
      `- Listen for accurate use of selected language (for example: ${language.slice(0, 2).join(' / ')}).`,
    )
  } else {
    lines.push('- Listen for accurate use of the page language with support.')
  }
  if (words.length > 0) {
    lines.push(
      `- Check that students can recognise or say key words/models from the selected evidence (for example: ${words.slice(0, 6).join(', ')}).`,
    )
  } else {
    lines.push('- Check that students can complete the selected page tasks with support.')
  }
  lines.push('- Note any gaps to revisit with the book on a later day; do not invent missing publisher text.')
  return lines
}

function buildSingleLessonPlan(input: {
  lesson: ChalkieLessonContext
  title: string
  shapeLabel: string
  selectedSuggestions: TeacherChoiceSuggestion[]
  teacherAdditions: TeacherAddedLanguageInput[]
  activitySelection?: SbActivityHandoffSelection
}): string {
  const { lesson } = input
  const selected = input.activitySelection?.selectedEvidence ?? []
  const noSelected =
    input.activitySelection != null &&
    hasNoSelectedSbActivities(input.activitySelection)
  const words = input.activitySelection
    ? selectedSbActivityVocabulary(input.activitySelection)
    : lesson.vocabulary
  const language = input.activitySelection
    ? selectedSbActivityLanguage(input.activitySelection)
    : lesson.languageExamples.map((item) => item.example)
  const pageList = formatPageList(lesson.visiblePrintedPages)

  return [
    'DETAILED GENERAL LESSON PLAN',
    'Assembled locally from teacher-selected verified curriculum evidence.',
    'This is not an output from ChatGPT, Claude, Canva, or any other external generation service.',
    '',
    `Lesson title: ${input.title}`,
    `Book / unit: ${lesson.bookLabel} · ${lesson.unitLine}`,
    `Source pages: Student Book ${lesson.visiblePageRangeLabel} (printed pages ${pageList})`,
    `Package shape: ${input.shapeLabel}`,
    '',
    'OBJECTIVE',
    objectiveFromFocus(lesson),
    '',
    'MATERIALS / SOURCE EVIDENCE',
    `- Student Book ${lesson.visiblePageRangeLabel}`,
    ...sbActivityLines(
      selected,
      noSelected
        ? 'No current Student Book activities were selected.'
        : 'No selected Student Book activity evidence was available.',
    ),
    words.length > 0
      ? `- Selected words/models: ${words.join(', ')}`
      : '- Selected words/models: none safely attributable.',
    language.length > 0
      ? `- Selected language: ${language.join(' | ')}`
      : '- Selected language: none safely attributable.',
    '',
    'SELECTED PRIOR-LEARNING SUPPORT',
    ...priorLearningLines(input),
    '',
    'LESSON SEQUENCE',
    ...sequenceStepsFromActivities(
      selected,
      `Student Book ${lesson.visiblePageRangeLabel}`,
    ),
    '',
    'CHECKS FOR UNDERSTANDING',
    ...checksForUnderstanding(words, language),
  ].join('\n')
}

function buildSbOnlyTwoLessonPlan(input: {
  lesson: ChalkieLessonContext
  title: string
  shapeLabel: string
  selectedSuggestions: TeacherChoiceSuggestion[]
  teacherAdditions: TeacherAddedLanguageInput[]
  activitySelection?: SbActivityHandoffSelection
}): string {
  const { lesson } = input
  const selected = input.activitySelection?.selectedEvidence ?? []
  const allocation = allocateSbOnlyTwoLessonActivities(selected)
  const noSelected =
    input.activitySelection != null &&
    hasNoSelectedSbActivities(input.activitySelection)
  const words = input.activitySelection
    ? selectedSbActivityVocabulary(input.activitySelection)
    : lesson.vocabulary
  const language = input.activitySelection
    ? selectedSbActivityLanguage(input.activitySelection)
    : lesson.languageExamples.map((item) => item.example)
  const pageList = formatPageList(lesson.visiblePrintedPages)
  const lesson1Words = allocation.lesson1.flatMap((activity) =>
    activity.languageFrame ? [activity.languageFrame] : [],
  )
  const lesson2Words = allocation.lesson2.flatMap((activity) =>
    activity.languageFrame ? [activity.languageFrame] : [],
  )

  return [
    'DETAILED GENERAL LESSON PLAN',
    'Assembled locally from teacher-selected verified curriculum evidence.',
    'This is not an output from ChatGPT, Claude, Canva, or any other external generation service.',
    '',
    `Lesson title: ${input.title}`,
    `Book / unit: ${lesson.bookLabel} · ${lesson.unitLine}`,
    `Source pages: Student Book ${lesson.visiblePageRangeLabel} (printed pages ${pageList}) only`,
    `Package shape: ${input.shapeLabel}`,
    'Both lessons use the same Student Book spread as sole source evidence. No Workbook companion is implied.',
    '',
    'SHARED OBJECTIVE',
    objectiveFromFocus(lesson),
    '',
    'SHARED MATERIALS / SOURCE EVIDENCE',
    `- Student Book ${lesson.visiblePageRangeLabel}`,
    words.length > 0
      ? `- Selected words/models on this spread: ${words.join(', ')}`
      : '- Selected words/models: none safely attributable.',
    language.length > 0
      ? `- Selected language on this spread: ${language.join(' | ')}`
      : '- Selected language: none safely attributable.',
    '',
    'SELECTED PRIOR-LEARNING SUPPORT (optional across both lessons)',
    ...priorLearningLines(input),
    '',
    `LESSON 1 — Student Book ${lesson.visiblePageRangeLabel}`,
    `Activity allocation: ${formatSbOnlyLessonActivityScope(allocation.lesson1)}`,
    ...sbActivityLines(
      allocation.lesson1,
      noSelected
        ? 'No current Student Book activities were selected for Lesson 1.'
        : 'No selected activities were allocated to Lesson 1.',
    ),
    '',
    'Lesson 1 sequence',
    ...sequenceStepsFromActivities(
      allocation.lesson1,
      `Student Book ${lesson.visiblePageRangeLabel}`,
    ),
    '',
    'Lesson 1 checks for understanding',
    ...checksForUnderstanding(words, lesson1Words.length > 0 ? lesson1Words : language),
    '',
    `LESSON 2 — Student Book ${lesson.visiblePageRangeLabel}`,
    `Activity allocation: ${formatSbOnlyLessonActivityScope(allocation.lesson2)}`,
    ...sbActivityLines(
      allocation.lesson2,
      noSelected
        ? 'No current Student Book activities were selected for Lesson 2.'
        : 'No selected activities were allocated to Lesson 2.',
    ),
    '',
    'Lesson 2 sequence',
    ...sequenceStepsFromActivities(
      allocation.lesson2,
      `Student Book ${lesson.visiblePageRangeLabel}`,
    ),
    '',
    'Lesson 2 checks for understanding',
    ...checksForUnderstanding(words, lesson2Words.length > 0 ? lesson2Words : language),
  ].join('\n')
}

function buildSbWbTwoLessonPlan(input: {
  lesson: ChalkieLessonContext
  title: string
  shapeLabel: string
  selectedSuggestions: TeacherChoiceSuggestion[]
  teacherAdditions: TeacherAddedLanguageInput[]
  activitySelection?: SbActivityHandoffSelection
  workbookActivitySelection?: WbActivityHandoffSelection
  biPlanningContext?: BiPlanningContext | null
  bookIntelligenceUnit?: BookIntelligenceUnitOverview | null
  biArtifactRef?: string | null
}): string {
  const { lesson } = input
  const companion = lesson.workbookCompanion
  const sbPages =
    companion?.studentBookPrintedPages ?? lesson.visiblePrintedPages
  // BE2 U8 fixture series keeps the known WB pages when companion JSON is absent.
  const wbPages =
    companion?.workbookPrintedPages ??
    (lesson.isBe2U08PrototypeRoute ? [104, 105] : [])
  const sbSelected = input.activitySelection?.selectedEvidence ?? []
  const wbSelected = input.workbookActivitySelection?.selectedEvidence ?? []
  const sbWords = input.activitySelection
    ? selectedSbActivityVocabulary(input.activitySelection)
    : lesson.vocabulary
  const sbLanguage = input.activitySelection
    ? selectedSbActivityLanguage(input.activitySelection)
    : lesson.languageExamples.map((item) => item.example)
  const sbRange = formatPageRange(sbPages)
  const wbRange = formatPageRange(wbPages)
  const biSection = formatBiPlanningContextSection(
    resolveBiPlanningForOpenerPlan(input),
  )

  return [
    'DETAILED GENERAL LESSON PLAN',
    'Assembled locally from teacher-selected verified curriculum evidence.',
    'This is not an output from ChatGPT, Claude, Canva, or any other external generation service.',
    '',
    `Lesson title: ${input.title}`,
    `Book / unit: ${lesson.bookLabel} · ${lesson.unitLine}`,
    `Source pages: Student Book ${sbRange}; Workbook ${wbRange}`,
    `Package shape: ${input.shapeLabel}`,
    'Lesson 1 uses Student Book evidence; Lesson 2 uses the verified Workbook companion allocation.',
    '',
    'SHARED OBJECTIVE',
    objectiveFromFocus(lesson),
    ...(biSection.length > 0 ? ['', ...biSection] : []),
    '',
    'SELECTED PRIOR-LEARNING SUPPORT (optional across both lessons)',
    ...priorLearningLines(input),
    '',
    `LESSON 1 — Student Book ${sbRange}`,
    'Materials / source evidence',
    ...sbActivityLines(
      sbSelected,
      'No current Student Book activities were selected for Lesson 1.',
    ),
    sbWords.length > 0
      ? `- Selected SB words/models: ${sbWords.join(', ')}`
      : '- Selected SB words/models: none safely attributable.',
    sbLanguage.length > 0
      ? `- Selected SB language: ${sbLanguage.join(' | ')}`
      : '- Selected SB language: none safely attributable.',
    '',
    'Lesson 1 sequence',
    ...sequenceStepsFromActivities(sbSelected, `Student Book ${sbRange}`),
    '',
    'Lesson 1 checks for understanding',
    ...checksForUnderstanding(sbWords, sbLanguage),
    '',
    `LESSON 2 — Workbook ${wbRange}`,
    'Materials / source evidence',
    ...wbActivityLines(
      wbSelected,
      wbPages.length === 0
        ? 'No verified Workbook pages are available for this packaging route.'
        : 'No current Workbook activities were selected for Lesson 2.',
    ),
    '',
    'Lesson 2 sequence',
    ...wbSequenceSteps(wbSelected, `Workbook ${wbRange}`),
    '',
    'Lesson 2 checks for understanding',
    '- Check that students can complete the selected Workbook practice with support.',
    '- Confirm the Workbook lesson consolidates the paired Student Book work rather than introducing unrelated content.',
    '- Note any gaps to revisit with the books later; do not invent missing publisher text.',
  ].join('\n')
}

/**
 * Build a copyable detailed general lesson plan from the same inputs used for
 * the Chalkie prompt preview.
 */
export function buildDetailedGeneralLessonPlan(input: {
  lesson: ChalkieLessonContext
  packageShape?: LessonPackageShape
  selectedSuggestions: TeacherChoiceSuggestion[]
  teacherAdditions: TeacherAddedLanguageInput[]
  activitySelection?: SbActivityHandoffSelection
  workbookActivitySelection?: WbActivityHandoffSelection
  /** Optional BI planning context (Opener slice). Prefer pre-filtered context. */
  biPlanningContext?: BiPlanningContext | null
  bookIntelligenceUnit?: BookIntelligenceUnitOverview | null
  biArtifactRef?: string | null
}): DetailedGeneralLessonPlanResult {
  const packageShape: LessonPackageShape = input.packageShape ?? 'single'
  const effectiveShape: LessonPackageShape =
    packageShape === 'series' && input.lesson.supportsTwoLessonSeries
      ? 'series'
      : 'single'
  const title = lessonTitleForPackage(input.lesson, effectiveShape)
  const shapeLabel = input.packageShape == null
    ? 'General lesson plan'
    : packageShapeLabel(input.lesson, effectiveShape)

  if (effectiveShape === 'series') {
    if (input.lesson.twoLessonPackagingMode === 'sb_only') {
      return {
        detailedLessonPlan: buildSbOnlyTwoLessonPlan({
          ...input,
          title,
          shapeLabel,
        }),
        packageShapeLabel: shapeLabel,
      }
    }
    if (input.lesson.twoLessonPackagingMode === 'sb_wb') {
      return {
        detailedLessonPlan: buildSbWbTwoLessonPlan({
          ...input,
          title,
          shapeLabel,
        }),
        packageShapeLabel: shapeLabel,
      }
    }
  }

  return {
    detailedLessonPlan: buildSingleLessonPlan({
      ...input,
      title,
      shapeLabel,
    }),
    packageShapeLabel: shapeLabel,
  }
}
