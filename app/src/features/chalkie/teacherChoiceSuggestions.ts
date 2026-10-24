/** Prototype AI prior-learning suggestions for teacher-choice Step 2 (BE2 U8). */

export type TeacherChoiceSuggestion = {
  id: string
  label: string
  source: string
  frame: string
  whyItMayHelp: string
  caution: string
  evidenceNote: string
  /**
   * Prompt provenance marker. Defaults to `[HM]` (curated cross-unit).
   * Same-unit earlier-page vocabulary uses `[PRIOR]`.
   */
  provenanceTag?: '[HM]' | '[PRIOR]'
  /**
   * Optional plain-text evidence-kind label for same-unit `[PRIOR]` cards
   * (Vocabulary / Language in Action / Grammar). Display-only; not handoff.
   */
  evidenceKindLabel?: string
}

/** Card / prompt title: `Preference: Unit 07 pp.113-116` */
export function formatPriorSkillCardTitle(input: {
  unitNumber: number
  pageStart: number
  pageEnd: number
  skillName: string
}): string {
  const unit = String(input.unitNumber).padStart(2, '0')
  const start = String(input.pageStart).padStart(2, '0')
  const end = String(input.pageEnd).padStart(2, '0')
  return `${input.skillName.trim()}: Unit ${unit} pp.${start}-${end}`
}

/** Split `Preference: Unit 07 pp.113-116` for UI (bold skill name only). */
export function splitPriorSkillCardTitle(label: string): {
  skillName: string
  bookSources: string | null
} {
  const separator = ': '
  const index = label.indexOf(separator)
  if (index <= 0) return { skillName: label.trim(), bookSources: null }
  const skillName = label.slice(0, index).trim()
  const bookSources = label.slice(index + separator.length).trim()
  if (!skillName || !bookSources) return { skillName: label.trim(), bookSources: null }
  return { skillName, bookSources }
}

/** Golden fixture for BE2 U8 opener curated `[HM]` cards (Slice 3 store must match). */
export const BE2_U08_AI_SUGGESTIONS: TeacherChoiceSuggestion[] = [
  {
    id: 'PL-19',
    label: formatPriorSkillCardTitle({
      unitNumber: 7,
      pageStart: 113,
      pageEnd: 116,
      skillName: 'Preference',
    }),
    source: 'Unit 7 · SB pp.113–116',
    frame: 'Do you like + noun? Yes, I do. I like … / No, I don’t. I don’t like …',
    whyItMayHelp: 'It supports fuller preference exchanges with Unit 8 animal vocabulary.',
    caution: 'Keep positive and negative answers accurate.',
    evidenceNote: 'Previously used for food preferences in Unit 7 (SB pp.113/116).',
    provenanceTag: '[HM]',
  },
  {
    id: 'PL-08',
    label: formatPriorSkillCardTitle({
      unitNumber: 2,
      pageStart: 28,
      pageEnd: 28,
      skillName: 'Agreement',
    }),
    source: 'Unit 2 · SB p.28',
    frame: 'Me, too! / Me neither!',
    whyItMayHelp: 'It can extend a short preference exchange.',
    caution: '“Me neither!” follows a negative statement only.',
    evidenceNote:
      'Previously used for agreement after positive or negative preference statements in Unit 2 (SB p.28).',
    provenanceTag: '[HM]',
  },
  {
    id: 'PL-01',
    label: formatPriorSkillCardTitle({
      unitNumber: 1,
      pageStart: 5,
      pageEnd: 8,
      skillName: 'Action description',
    }),
    source: 'Unit 1 · SB pp.5–8',
    frame: 'What’s he/she doing? He/She’s + -ing.',
    whyItMayHelp: 'It supports talking about animal actions after ability language.',
    caution: 'Animal examples are teacher/mapper adaptations, not exact publisher wording.',
    evidenceNote: 'Previously used for singular present-continuous action descriptions in Unit 1 (SB pp.5/8).',
    provenanceTag: '[HM]',
  },
  {
    id: 'PL-03',
    // Dual-unit bank item: primary SB page evidence is U1 p.9; U6 is also in the bank.
    label: 'Quantity: Units 01 & 06 pp.09-09',
    source: 'Units 1 and 6 · SB p.9 (+ U6 quantity reuse)',
    frame: 'How many + plural noun are there? There are …',
    whyItMayHelp: 'It is useful when there is a clear animal picture or scene to count.',
    caution: 'Use only with countable plural animals and a visible count.',
    evidenceNote: 'Previously used for counting pictures and objects in Units 1 and 6 (SB p.9 evidenced for U1).',
    provenanceTag: '[HM]',
  },
]
