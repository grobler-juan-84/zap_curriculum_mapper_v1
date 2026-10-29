/**
 * Tool-neutral General Lesson Plan renderer from a Neutral Lesson Package.
 * Stage 4 pilot: two-lesson SB→WB Opener output with labelled NLL derived knowledge.
 */
import type {
  NeutralNllDerivedActivitySummary,
  NeutralPriorSupportRecord,
  NeutralSbWbLessonPackage,
  NeutralSelectedActivityEvidence,
} from './buildNeutralSbWbLessonPackage'
import { canonicalActivityIdFromNeutralEvidence } from './nllGeneralLessonPlanPilot'

function formatPageRange(pages: readonly number[]): string {
  if (pages.length === 0) return '(no pages)'
  if (pages.length === 1) return `p. ${pages[0]}`
  return `pp. ${pages[0]}–${pages[pages.length - 1]}`
}

function activityHeading(activity: NeutralSelectedActivityEvidence): string {
  const number = activity.activityNumber?.trim()
  const label = number ? `Activity ${number}` : 'Activity'
  return `${label} · ${activity.source} p.${activity.printedPage}`
}

function lookupDerivedSummary(
  activity: NeutralSelectedActivityEvidence,
  byActivityId: ReadonlyMap<string, NeutralNllDerivedActivitySummary>,
): NeutralNllDerivedActivitySummary | null {
  const activityId = canonicalActivityIdFromNeutralEvidence(activity)
  if (!activityId) return null
  return byActivityId.get(activityId) ?? null
}

function publisherEvidenceLines(
  activity: NeutralSelectedActivityEvidence,
): string[] {
  const lines = [
    'Publisher evidence:',
    `- Verified wording: ${activity.verifiedWording}`,
  ]
  if (activity.prompt?.trim()) {
    lines.push(`- Prompt: ${activity.prompt.trim()}`)
  }
  if (activity.expectedAnswer?.trim()) {
    lines.push(`- Expected answer (publisher): ${activity.expectedAnswer.trim()}`)
  }
  if (activity.languageFrame?.trim()) {
    lines.push(`- Language frame: ${activity.languageFrame.trim()}`)
  }
  for (const item of activity.items) {
    const itemLabel = item.itemNumber?.trim()
      ? `Item ${item.itemNumber.trim()}`
      : 'Item'
    const prompt = item.prompt?.trim() ?? ''
    const answer = item.expectedAnswer?.trim()
    lines.push(
      answer
        ? `- ${itemLabel}: ${prompt} → ${answer}`
        : `- ${itemLabel}: ${prompt || '(no prompt text)'}`,
    )
  }
  return lines
}

function nllSummaryLines(
  summary: NeutralNllDerivedActivitySummary | null,
): string[] {
  if (!summary) {
    return [
      'NLL summary · experimental: No preferred NLL summary is attached for this selected activity.',
    ]
  }
  const lines = [
    'NLL summary · experimental:',
    summary.summaryText,
  ]
  if (summary.evidenceStatus === 'insufficient') {
    lines.push(
      'Insufficient evidence for a fuller summary. Do not invent missing publisher procedures, scripts, answers, or game steps.',
    )
  }
  return lines
}

function activityBlock(
  activity: NeutralSelectedActivityEvidence,
  byActivityId: ReadonlyMap<string, NeutralNllDerivedActivitySummary>,
): string[] {
  return [
    activityHeading(activity),
    ...publisherEvidenceLines(activity),
    ...nllSummaryLines(lookupDerivedSummary(activity, byActivityId)),
    '',
  ]
}

function vocabularyLanguageLines(
  vocabulary: readonly string[],
  languageModels: readonly string[],
  sourceLabel: string,
): string[] {
  return [
    vocabulary.length > 0
      ? `- ${sourceLabel} vocabulary / models: ${vocabulary.join(', ')}`
      : `- ${sourceLabel} vocabulary / models: none safely attributable.`,
    languageModels.length > 0
      ? `- ${sourceLabel} language: ${languageModels.join(' | ')}`
      : `- ${sourceLabel} language: none safely attributable.`,
  ]
}

function priorSupportLines(
  records: readonly NeutralPriorSupportRecord[],
): string[] {
  if (records.length === 0) {
    return ['- None selected.']
  }
  return records.map((record) => {
    const source = record.sourceReference?.trim()
    const purpose = record.purpose?.trim()
    const parts = [
      `${record.provenance} ${record.label}: ${record.frame}`,
      source ? `source ${source}` : null,
      purpose ? `purpose ${purpose}` : null,
    ].filter(Boolean)
    return `- ${parts.join(' · ')}`
  })
}

function objectivesSection(): string[] {
  return [
    'OBJECTIVES',
    'No authoritative lesson objective is available in this pilot package.',
  ]
}

function derivedGuidanceSection(): string[] {
  return [
    'SUGGESTED FLOW (derived guidance · not publisher requirements)',
    '- Review Lesson 1 Student Book publisher evidence with learners, using NLL summaries only as experimental teacher-facing support.',
    '- Move to Lesson 2 Workbook practice for the same selected strand; keep deselected activities out of the plan.',
    '- Do not invent timing, publisher scripts, answers, activity procedures, or requirements that are absent from verified evidence.',
    '- Treat proposed SS curriculum links (if encountered elsewhere) as non-authoritative; they are not approved curriculum authority in this plan.',
  ]
}

/**
 * Render a copyable two-lesson General Lesson Plan from an NLP (Stage 4 pilot).
 */
export function renderGeneralLessonPlanFromNeutralPackage(
  nlp: NeutralSbWbLessonPackage,
): string {
  const byActivityId = new Map<string, NeutralNllDerivedActivitySummary>()
  for (const summary of nlp.derivedKnowledge?.activitySummaries ?? []) {
    byActivityId.set(summary.activityId, summary)
  }

  const sbRange = formatPageRange(nlp.lesson1.scope.printedPages)
  const wbRange = formatPageRange(nlp.lesson2.scope.printedPages)

  const lesson1Body =
    nlp.lesson1.selectedActivities.length === 0
      ? [
          nlp.lesson1.emptySelectionMessage ??
            'No Student Book activities were selected for Lesson 1.',
          '',
        ]
      : nlp.lesson1.selectedActivities.flatMap((activity) =>
          activityBlock(activity, byActivityId),
        )

  const lesson2Body =
    nlp.lesson2.selectedActivities.length === 0
      ? [
          nlp.lesson2.emptySelectionMessage ??
            'No Workbook activities were selected for Lesson 2.',
          '',
        ]
      : nlp.lesson2.selectedActivities.flatMap((activity) =>
          activityBlock(activity, byActivityId),
        )

  return [
    'GENERAL LESSON PLAN — DERIVED EXPERIMENTAL PILOT',
    'Assembled locally from a Neutral Lesson Package. This is a derived output, not a canonical curriculum authority.',
    'Publisher evidence and NLL-derived knowledge are kept separate below. NLL summaries remain experimental.',
    '',
    `Package reference: ${nlp.identity.packageReference}`,
    `Relationship: ${nlp.identity.relationshipId}`,
    `Component: ${nlp.identity.componentTitle} (${nlp.identity.componentKey})`,
    `Book / unit: ${nlp.identity.studentBookCatalogId} · Unit ${nlp.identity.unitNumber}: ${nlp.identity.unitTitle}`,
    `Packaging: ${nlp.packaging.type} (${nlp.packaging.lessonOrder.join(' → ')})`,
    `Source pages: Student Book ${sbRange}; Workbook ${wbRange}`,
    '',
    ...objectivesSection(),
    '',
    'SELECTED PRIOR-LEARNING SUPPORT (existing provenance labels)',
    ...priorSupportLines(nlp.priorSupport),
    '',
    `LESSON 1 — Student Book ${sbRange}`,
    `Derived lesson purpose (not a publisher requirement): ${nlp.lesson1.purpose}`,
    '',
    ...lesson1Body,
    ...vocabularyLanguageLines(
      nlp.lesson1.vocabulary,
      nlp.lesson1.languageModels,
      'Lesson 1 SB',
    ),
    '',
    `LESSON 2 — Workbook ${wbRange}`,
    `Derived lesson purpose (not a publisher requirement): ${nlp.lesson2.purpose}`,
    '',
    ...lesson2Body,
    ...vocabularyLanguageLines(
      nlp.lesson2.vocabulary,
      nlp.lesson2.languageModels,
      'Lesson 2 WB',
    ),
    '',
    ...derivedGuidanceSection(),
  ].join('\n')
}
