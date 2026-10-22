/**
 * Deterministic concise teacher-controlled outline for Chalkie handoff.
 * Local only — no API. Separate from the detailed evidence prompt.
 */
import type { ChalkieOutlineActivity } from './chalkieEvidence'
import {
  splitPriorSkillCardTitle,
  type TeacherChoiceSuggestion,
} from './teacherChoiceSuggestions'
import type { ChalkieLessonContext } from './resolveChalkieLessonContext'
import {
  hasNoSelectedSbActivities,
  hasSbActivityExclusions,
  type SbActivityHandoffSelection,
  type SelectedSbActivityEvidence,
} from './chalkieActivitySelection'

export type { ChalkieOutlineActivity }

function pageRefFromSuggestion(suggestion: TeacherChoiceSuggestion): string | null {
  const fromLabelPp = suggestion.label.match(/\bpp\.(\d+)(?:-(\d+))?/i)
  if (fromLabelPp) {
    const start = fromLabelPp[1]
    const end = fromLabelPp[2]
    if (end && end !== start) return `pp.${start}-${end}`
    return `p.${start}`
  }
  const fromSource = suggestion.source.match(/\bp\.\s*(\d+)\b/i)
  if (fromSource) return `p.${fromSource[1]}`
  const fromLabel = suggestion.label.match(/\bp\.\s*(\d+)\b/i)
  if (fromLabel) return `p.${fromLabel[1]}`
  return null
}

function topicFromSuggestion(suggestion: TeacherChoiceSuggestion): string {
  const { skillName } = splitPriorSkillCardTitle(suggestion.label)
  if (skillName && skillName !== suggestion.label) return skillName
  return suggestion.label.replace(/\s*[—-]\s*from\s*p\.\s*\d+\s*$/i, '').trim() || suggestion.label
}

function priorRetrievalStep(suggestion: TeacherChoiceSuggestion): string {
  const tag = suggestion.provenanceTag ?? '[HM]'
  const topic = topicFromSuggestion(suggestion)
  const page = pageRefFromSuggestion(suggestion)
  if (tag === '[PRIOR]' && page) {
    return `[PRIOR] Briefly retrieve the selected phrases for ${topic} from ${page}.`
  }
  if (page) {
    return `${tag} Briefly retrieve the selected prior learning (${topic}) from ${page}.`
  }
  return `${tag} Briefly retrieve the selected prior learning: ${suggestion.label} (${suggestion.source}).`
}

function activityOutlineStep(activity: ChalkieOutlineActivity): string {
  const numberLabel =
    activity.activityNumber != null ? `Activity ${activity.activityNumber}` : 'Activity'
  const instruction = activity.instruction.replace(/\s+/g, ' ').trim()
  const base =
    /[.!?]$/.test(instruction) ? instruction : `${instruction}.`
  const audioNote = activity.audioDependency ? ' Use the official book audio.' : ''
  return `[SB] ${numberLabel}: ${base}${audioNote}`
}

function selectedActivityOutlineStep(
  activity: SelectedSbActivityEvidence,
): string {
  const numberLabel =
    activity.activityNumber != null
      ? `Activity ${activity.activityNumber}`
      : 'Activity'
  const instruction = activity.verifiedWording.replace(/\s+/g, ' ').trim()
  const base = /[.!?]$/.test(instruction) ? instruction : `${instruction}.`
  const audioNote = activity.audioDependency
    ? ` Use the official book audio${activity.sourceDependencyNote ? ` (${activity.sourceDependencyNote})` : ''}.`
    : ''
  const languageNote = activity.languageFrame
    ? ` Model: ${activity.languageFrame}`
    : ''
  return `[SB] ${numberLabel}: ${base}${audioNote}${languageNote}`
}

function supplementaryClosingStep(lesson: ChalkieLessonContext): string {
  const focus = (lesson.teachingFocus ?? '').toLowerCase()
  const languageBlob = lesson.languageExamples.map((item) => item.example).join(' ').toLowerCase()
  if (/\bdid\b/.test(focus) || /\bdid\b[^|]*\?/.test(languageBlob)) {
    return '[SUPPLEMENTARY] Finish with a brief oral recap using one Did…? question and short answer.'
  }
  return '[SUPPLEMENTARY] Finish with a brief oral check using the language practised on these pages.'
}

/**
 * Build a short teaching-sequence outline from verified visible-page activities
 * and teacher-selected prior learning. Does not include teacher-added language.
 */
export function buildChalkieConciseOutline(input: {
  lesson: ChalkieLessonContext
  selectedSuggestions: TeacherChoiceSuggestion[]
  activitySelection?: SbActivityHandoffSelection
}): string {
  const { lesson, selectedSuggestions, activitySelection } = input
  const lines: string[] = [
    'Concise teacher-controlled outline',
    'Short teaching sequence for the current Student Book pages. Keep book-working time; do not expand into a slide-by-slide script.',
    '',
  ]

  let step = 1

  for (const suggestion of selectedSuggestions) {
    lines.push(`${step}. ${priorRetrievalStep(suggestion)}`)
    step += 1
  }

  if (activitySelection && hasSbActivityExclusions(activitySelection)) {
    if (hasNoSelectedSbActivities(activitySelection)) {
      lines.push(
        `${step}. [SB] No current Student Book activities were selected. Do not reconstruct unselected page activities.`,
      )
      step += 1
    } else {
      for (const activity of activitySelection.selectedEvidence) {
        lines.push(`${step}. ${selectedActivityOutlineStep(activity)}`)
        step += 1
      }
    }
  } else {
    const activities = [...lesson.outlineActivities].sort((a, b) => {
      if (a.printedPage !== b.printedPage) return a.printedPage - b.printedPage
      const an = a.activityNumber ?? Number.POSITIVE_INFINITY
      const bn = b.activityNumber ?? Number.POSITIVE_INFINITY
      return an - bn
    })

    for (const activity of activities) {
      lines.push(`${step}. ${activityOutlineStep(activity)}`)
      step += 1
    }

    lines.push(`${step}. ${supplementaryClosingStep(lesson)}`)
  }
  lines.push('')
  return lines.join('\n')
}
