/**
 * Slice 3 — human-curated earlier-unit `[HM]` relationships.
 *
 * Entries are explicit and verified only. Never infer usefulness from
 * similarity. No School Notes product surface and no remote model ranking.
 *
 * Design authority:
 * `docs/phase-5/chalkie-prior-learning-horizontal-mapping-audit-v0.1.md`
 * Additional pack unlock gate:
 * `docs/phase-5/curated-horizontal-mapping-pack-authoring-contract-v0.1.md`
 */

/** Author-curated earlier-unit horizontal-mapping relationship. */
export type CuratedHorizontalMappingEntry = {
  readonly id: string
  /** Book where the target lesson lives (and where source evidence was verified). */
  readonly catalogBookId: string
  /** Unit that may offer this curated card. */
  readonly targetUnitNumber: number
  /**
   * When set, offer only if the visible printed pages exactly match this
   * sorted target spread (fixture-narrow eligibility).
   */
  readonly targetPrintedPages?: readonly number[]
  /** Primary earlier source unit (must differ from the target unit). */
  readonly sourceUnitNumber: number
  readonly sourcePrintedPages: readonly number[]
  /** Extra earlier units referenced in dual-unit bank items (display only). */
  readonly additionalSourceUnitNumbers?: readonly number[]
  readonly title: string
  /**
   * Optional full Step 2 card label when `formatPriorSkillCardTitle` cannot
   * express dual-unit bank wording (e.g. PL-03).
   */
  readonly suggestionLabel?: string
  readonly contentPreview: string
  readonly whyItMayHelp: string
  readonly caution: string
  readonly provenanceNote: string
  readonly sourceReference: string
}

/**
 * Verified BE2 Unit 8 opener curated `[HM]` bank (pp.128–129).
 * Content matches the existing Step 2 fixture cards (`BE2_U08_AI_SUGGESTIONS`).
 */
export const BE2_U08_CURATED_HORIZONTAL_MAPPING_ENTRIES: readonly CuratedHorizontalMappingEntry[] =
  [
    {
      id: 'PL-19',
      catalogBookId: 'big_english_2_sb',
      targetUnitNumber: 8,
      targetPrintedPages: [128, 129],
      sourceUnitNumber: 7,
      sourcePrintedPages: [113, 116],
      title: 'Preference',
      contentPreview:
        'Do you like + noun? Yes, I do. I like … / No, I don’t. I don’t like …',
      whyItMayHelp:
        'It supports fuller preference exchanges with Unit 8 animal vocabulary.',
      caution: 'Keep positive and negative answers accurate.',
      provenanceNote:
        'Previously used for food preferences in Unit 7 (SB pp.113/116).',
      sourceReference: 'Unit 7 · SB pp.113–116',
    },
    {
      id: 'PL-08',
      catalogBookId: 'big_english_2_sb',
      targetUnitNumber: 8,
      targetPrintedPages: [128, 129],
      sourceUnitNumber: 2,
      sourcePrintedPages: [28],
      title: 'Agreement',
      contentPreview: 'Me, too! / Me neither!',
      whyItMayHelp: 'It can extend a short preference exchange.',
      caution: '“Me neither!” follows a negative statement only.',
      provenanceNote:
        'Previously used for agreement after positive or negative preference statements in Unit 2 (SB p.28).',
      sourceReference: 'Unit 2 · SB p.28',
    },
    {
      id: 'PL-01',
      catalogBookId: 'big_english_2_sb',
      targetUnitNumber: 8,
      targetPrintedPages: [128, 129],
      sourceUnitNumber: 1,
      sourcePrintedPages: [5, 8],
      title: 'Action description',
      contentPreview: 'What’s he/she doing? He/She’s + -ing.',
      whyItMayHelp:
        'It supports talking about animal actions after ability language.',
      caution:
        'Animal examples are teacher/mapper adaptations, not exact publisher wording.',
      provenanceNote:
        'Previously used for singular present-continuous action descriptions in Unit 1 (SB pp.5/8).',
      sourceReference: 'Unit 1 · SB pp.5–8',
    },
    {
      id: 'PL-03',
      catalogBookId: 'big_english_2_sb',
      targetUnitNumber: 8,
      targetPrintedPages: [128, 129],
      sourceUnitNumber: 1,
      sourcePrintedPages: [9],
      additionalSourceUnitNumbers: [6],
      title: 'Quantity',
      suggestionLabel: 'Quantity: Units 01 & 06 pp.09-09',
      contentPreview: 'How many + plural noun are there? There are …',
      whyItMayHelp:
        'It is useful when there is a clear animal picture or scene to count.',
      caution: 'Use only with countable plural animals and a visible count.',
      provenanceNote:
        'Previously used for counting pictures and objects in Units 1 and 6 (SB p.9 evidenced for U1).',
      sourceReference: 'Units 1 and 6 · SB p.9 (+ U6 quantity reuse)',
    },
  ]

const ALL_CURATED_HORIZONTAL_MAPPING_ENTRIES: readonly CuratedHorizontalMappingEntry[] =
  [...BE2_U08_CURATED_HORIZONTAL_MAPPING_ENTRIES]

/** Read-only catalog of verified curated `[HM]` entries (stable declaration order). */
export function listCuratedHorizontalMappingEntries(): readonly CuratedHorizontalMappingEntry[] {
  return ALL_CURATED_HORIZONTAL_MAPPING_ENTRIES
}
