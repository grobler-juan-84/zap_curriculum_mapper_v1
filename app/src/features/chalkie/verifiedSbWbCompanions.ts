/**
 * Explicitly curated, human-verified Student Book → Workbook companions.
 *
 * These are not pagination heuristics. Each entry records a reviewed content pairing
 * for one spread only. Do not auto-generate entries from unit position alone.
 */

export type CuratedVerifiedSbWbCompanion = {
  relationshipId: string
  relationshipType: 'workbook_practice_for'
  verificationStatus: 'human_verified'
  studentBookCatalogId: string
  workbookCatalogId: string
  studentBookPageIds: string[]
  studentBookPrintedPages: number[]
  workbookPageIds: string[]
  workbookPrintedPages: number[]
  unitNumber: number
  unitTitle: string
  /** Short human rationale kept with the mapping. */
  verificationRationale: string
  supportingEvidence: string[]
}

/**
 * BE3 SB Unit 8 opener → WB Unit 8 opener.
 *
 * Accepted after content comparison (vocab/language/activity purpose), not because
 * both happen to be the first spread of Unit 8.
 */
export const BE3_U08_SB128_129_WB104_105: CuratedVerifiedSbWbCompanion = {
  relationshipId: 'be3_sb_wb_rel_u08_opener_sb128-129_wb104-105',
  relationshipType: 'workbook_practice_for',
  verificationStatus: 'human_verified',
  studentBookCatalogId: 'big_english_3_sb',
  workbookCatalogId: 'big_english_3_wb',
  studentBookPageIds: ['bep3_sb_p128', 'bep3_sb_p129'],
  studentBookPrintedPages: [128, 129],
  workbookPageIds: ['bep_3_wb_p104', 'bep_3_wb_p105'],
  workbookPrintedPages: [104, 105],
  unitNumber: 8,
  unitTitle: 'Healthy Living',
  verificationRationale:
    'Workbook pp.104–105 consolidate the same Healthy Living opener as SB pp.128–129: shared healthy/unhealthy activity vocabulary (WB uses past forms), Did…? short-answer practice, and song-linked listening/writing that supports the SB Live Right! song/vocabulary strand.',
  supportingEvidence: [
    'Unit identity: both Unit 8 Healthy Living (human_verified).',
    'SB p.128 target vocab: have a big breakfast, get 10 hours of sleep, drink lots of water, ride a bike, eat breakfast, get any exercise, have a healthy lunch, get enough sleep.',
    'WB p.104 target vocab (past/contrast forms of the same set): ate a healthy breakfast, drank lots of water, got ten hours of sleep, rode a bike, exercise; plus unhealthy contrasts ate pie for breakfast / got two hours of sleep.',
    'SB Act 5 language frame: Did he eat breakfast? / No, he didn’t. | Did she ride her bike? / Yes, she did.',
    'WB Act 2–4: Did you…? personal questions on sleep/water/bike/lunch/exercise with Yes/No and Yes, I did / No, I didn’t.',
    'SB Acts 1–4: present vocab + Live Right! song; WB Acts 1–3: label/check healthy activities + song listen/write (Track 153) consolidating the same strand.',
  ],
}

/** All curated companions recognised by the resolver. Add entries one reviewed pair at a time. */
export const CURATED_VERIFIED_SB_WB_COMPANIONS: readonly CuratedVerifiedSbWbCompanion[] = [
  BE3_U08_SB128_129_WB104_105,
]
