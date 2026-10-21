/**
 * Explicitly curated, human-verified Student Book → Workbook companions.
 *
 * These are not pagination heuristics. Each entry records a reviewed content pairing
 * for one logical component only. Do not auto-generate entries from unit position alone.
 *
 * Page-count asymmetry is allowed: e.g. two SB pages may map to one WB page when the
 * Workbook component is a single page. Arrays record the verified pages exactly.
 */

export type CuratedVerifiedSbWbCompanion = {
  relationshipId: string
  relationshipType: 'workbook_practice_for'
  verificationStatus: 'human_verified'
  studentBookCatalogId: string
  workbookCatalogId: string
  studentBookPageIds: string[]
  /** Verified SB printed pages (may be one or more). */
  studentBookPrintedPages: number[]
  workbookPageIds: string[]
  /** Verified WB printed pages (may be one or more; length need not equal SB). */
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

/**
 * BE3 SB Unit 8 Story / Reading → WB Story (asymmetric 2→1).
 *
 * Accepted after content review of SB pp.130–131 against WB p.106 only.
 * WB p.107 (Language in Action) is explicitly excluded — rejected as part of 106–107.
 */
export const BE3_U08_SB130_131_WB106: CuratedVerifiedSbWbCompanion = {
  relationshipId: 'be3_sb_wb_rel_u08_story_sb130-131_wb106',
  relationshipType: 'workbook_practice_for',
  verificationStatus: 'human_verified',
  studentBookCatalogId: 'big_english_3_sb',
  workbookCatalogId: 'big_english_3_wb',
  studentBookPageIds: ['bep3_sb_p130', 'bep3_sb_p131'],
  studentBookPrintedPages: [130, 131],
  workbookPageIds: ['bep_3_wb_p106'],
  workbookPrintedPages: [106],
  unitNumber: 8,
  unitTitle: 'Healthy Living',
  verificationRationale:
    'Workbook p.106 consolidates Student Book Story/Reading *An Unhealthy Dinner* (pp.130–131): shared story title/component, Amy-dinner Did…? Yes/No she did short answers, and healthy/unhealthy personal extension. Single WB story page against a two-page SB spread is expected (component map). WB p.107 is Language in Action and is not part of this relationship.',
  supportingEvidence: [
    'Unit identity: both Unit 8 Healthy Living (human_verified).',
    'SB pp.130–131: Story + Reading · component An Unhealthy Dinner; Act 6 Listen and read. Did Amy eat a healthy dinner?; Act 7 Read and choose (Amy dinner comprehension).',
    'WB p.106 only: Story · notes Story title: An Unhealthy Dinner; component An Unhealthy Dinner.',
    'WB Act 5: Read and answer. Write Yes, she did or No, she didn’t. (Did Amy eat a burger and fries…? / Did she eat a healthy dinner?).',
    'WB Act 6 + Think Big: personal dinner write/draw and healthy/unhealthy categorisation extending the story strand.',
    'Explicitly excluded: WB p.107 Language in Action (weekend stickers / did–didn’t dialogues) — not story consolidation.',
  ],
}

/**
 * BE3 SB Unit 8 Language in Action → WB Language in Action.
 *
 * Accepted after content review (Did…? / did–didn't practice). Resolver-wired only:
 * no series handoff builder and no Chalkie generation authorized for this mapping.
 * Tracking ref (not a handoff package id): `be3-sb-wb-u08-p132-133-wb107-108`.
 */
export const BE3_U08_LIA_STABLE_REF = 'be3-sb-wb-u08-p132-133-wb107-108'

export const BE3_U08_SB132_133_WB107_108: CuratedVerifiedSbWbCompanion = {
  relationshipId: 'be3_sb_wb_rel_u08_lia_sb132-133_wb107-108',
  relationshipType: 'workbook_practice_for',
  verificationStatus: 'human_verified',
  studentBookCatalogId: 'big_english_3_sb',
  workbookCatalogId: 'big_english_3_wb',
  studentBookPageIds: ['bep3_sb_p132', 'bep3_sb_p133'],
  studentBookPrintedPages: [132, 133],
  workbookPageIds: ['bep_3_wb_p107', 'bep_3_wb_p108'],
  workbookPrintedPages: [107, 108],
  unitNumber: 8,
  unitTitle: 'Healthy Living',
  verificationRationale:
    'Workbook pp.107–108 consolidate Student Book Language in Action (pp.132–133): shared Healthy Living LiA strand and Did…? / did–didn’t short-answer practice. WB p.106 Story is out of scope.',
  supportingEvidence: [
    'Unit identity: both Unit 8 Healthy Living (human_verified).',
    'SB pp.132–133: Language in Action · grammar_practice; Acts 8–12 Did…? ask–answer practice.',
    'WB pp.107–108: Language in Action; Act 7 weekend listen/stick; Act 8 did/didn’t dialogues; Acts 9–10 picture phrases feeding Did…? answers.',
    'Target language aligns: Did you have breakfast? / No, I didn’t.; Did he get enough sleep? / Yes, he did.',
    'Explicitly excluded: WB p.106 Story (story companion only); later Grammar/CLIL pages out of scope.',
  ],
}

/** All curated companions recognised by the resolver. Add entries one reviewed pair at a time. */
export const CURATED_VERIFIED_SB_WB_COMPANIONS: readonly CuratedVerifiedSbWbCompanion[] = [
  BE3_U08_SB128_129_WB104_105,
  BE3_U08_SB130_131_WB106,
  BE3_U08_SB132_133_WB107_108,
]
