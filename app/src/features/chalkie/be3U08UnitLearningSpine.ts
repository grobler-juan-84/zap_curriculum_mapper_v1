/**
 * BE3 Student Book Unit 8 (*Healthy Living*) — author-curated Unit Learning Spine.
 *
 * Read-only data only. Not wired to Step 2, ranking, UI, or handoff.
 * Design: `docs/phase-5/unit-learning-spine-and-prior-learning-ranking-design-v0.1.md`
 */
import type { UnitLearningSpine, UnitLearningSpineComponent } from './unitLearningSpine'

export const BE3_U08_SPINE_CATALOG_BOOK_ID = 'big_english_3_sb' as const
export const BE3_U08_SPINE_UNIT_NUMBER = 8 as const
export const BE3_U08_SPINE_UNIT_TITLE = 'Healthy Living' as const

const base = {
  catalogBookId: BE3_U08_SPINE_CATALOG_BOOK_ID,
  unitNumber: BE3_U08_SPINE_UNIT_NUMBER,
  unitTitle: BE3_U08_SPINE_UNIT_TITLE,
  verificationStatus: 'human_verified' as const,
}

/**
 * Ordered unit teaching sequence. Core = primary reusable foundations;
 * support / review_support = pedagogically useful but not default main recycle targets.
 */
export const BE3_U08_UNIT_LEARNING_SPINE_COMPONENTS: readonly UnitLearningSpineComponent[] =
  [
    {
      ...base,
      componentId: 'big_english_3_sb_u08_vocabulary_song',
      title: 'Vocabulary / Song',
      componentType: 'Vocabulary/Song',
      printedPages: [128, 129],
      role: 'core',
      learningKind: 'vocabulary',
      sequencingPosition: 'Core 1',
      recycleReason:
        'Unit opener vocabulary and song language for healthy/unhealthy activities — reusable lexical foundation for later Unit 8 lessons.',
    },
    {
      ...base,
      componentId: 'big_english_3_sb_u08_story_reading',
      title: 'Story / Reading',
      componentType: 'Story/Reading',
      printedPages: [130, 131],
      role: 'support',
      learningKind: 'reading_content',
      sequencingPosition: null,
      recycleReason:
        'Story/reading practice that may optionally support later lessons; not a default main reusable-prior-learning target.',
    },
    {
      ...base,
      componentId: 'big_english_3_sb_u08_language_in_action',
      title: 'Language in Action',
      componentType: 'Language in Action',
      printedPages: [132, 133],
      role: 'core',
      learningKind: 'communicative_language',
      sequencingPosition: 'Core 3',
      recycleReason:
        'Communicative Did…? / short-answer practice — core language foundation to recycle into later Unit 8 lessons when relevant.',
    },
    {
      ...base,
      componentId: 'big_english_3_sb_u08_content_connection_pe',
      title: 'Content Connection / P.E.',
      componentType: 'Content Connection/P.E.',
      printedPages: [134, 135],
      role: 'support',
      learningKind: 'reading_content',
      sequencingPosition: null,
      recycleReason:
        'Content/reading support; optional recycle only — not treated as a primary unit learning spine target.',
    },
    {
      ...base,
      componentId: 'big_english_3_sb_u08_grammar',
      title: 'Grammar',
      componentType: 'Grammar',
      printedPages: [136, 137],
      role: 'core',
      learningKind: 'grammar',
      sequencingPosition: 'Core 5',
      recycleReason:
        'Past-tense grammar patterns and models — core foundation for later or related Unit 8 work when evidenced.',
    },
    {
      ...base,
      componentId: 'big_english_3_sb_u08_culture_connection',
      title: 'Culture Connection',
      componentType: 'Culture Connection',
      printedPages: [138, 139],
      role: 'support',
      learningKind: 'reading_content',
      sequencingPosition: null,
      recycleReason:
        'Culture/reading support; useful optionally but not a default main prior-learning recycle target.',
    },
    {
      ...base,
      componentId: 'big_english_3_sb_u08_writing',
      title: 'Writing',
      componentType: 'Writing',
      printedPages: [140],
      role: 'support',
      learningKind: 'writing',
      sequencingPosition: null,
      recycleReason:
        'Writing practice; support unless later curated otherwise — not a default core recycle target.',
    },
    {
      ...base,
      componentId: 'big_english_3_sb_u08_phonics',
      title: 'Phonics',
      componentType: 'Phonics',
      printedPages: [141],
      role: 'support',
      learningKind: 'phonics',
      sequencingPosition: null,
      recycleReason:
        'Phonics support; optional only — not a primary same-unit prior-learning foundation.',
    },
    {
      ...base,
      componentId: 'big_english_3_sb_u08_values',
      title: 'Values',
      componentType: 'Values',
      printedPages: [142],
      role: 'support',
      learningKind: 'values_review',
      sequencingPosition: null,
      recycleReason:
        'Values reflection; support for optional recycle, not a core language/grammar foundation.',
    },
    {
      ...base,
      componentId: 'big_english_3_sb_u08_review',
      title: 'Review',
      componentType: 'Review',
      printedPages: [143],
      role: 'review_support',
      learningKind: 'values_review',
      sequencingPosition: null,
      recycleReason:
        'Unit review — review/support rather than core; may consolidate earlier learning but is not itself a primary recycle target.',
    },
  ]

export const BE3_U08_UNIT_LEARNING_SPINE: UnitLearningSpine = {
  catalogBookId: BE3_U08_SPINE_CATALOG_BOOK_ID,
  unitNumber: BE3_U08_SPINE_UNIT_NUMBER,
  unitTitle: BE3_U08_SPINE_UNIT_TITLE,
  components: BE3_U08_UNIT_LEARNING_SPINE_COMPONENTS,
}

/**
 * Read-only lookup. Returns a spine only for author-curated units.
 * Never invents a spine for other books/units.
 */
export function getUnitLearningSpine(
  catalogBookId: string,
  unitNumber: number,
): UnitLearningSpine | null {
  if (
    catalogBookId === BE3_U08_SPINE_CATALOG_BOOK_ID &&
    unitNumber === BE3_U08_SPINE_UNIT_NUMBER
  ) {
    return BE3_U08_UNIT_LEARNING_SPINE
  }
  return null
}
