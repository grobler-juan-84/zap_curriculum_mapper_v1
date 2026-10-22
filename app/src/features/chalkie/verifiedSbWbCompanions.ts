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

/**
 * BE3 SB Unit 8 Content Connection / P.E. → WB Content Connection.
 *
 * Accepted after content review (*What Is a Calorie?* CLIL strand). Resolver-wired only:
 * no series handoff builder and no Chalkie generation authorized for this mapping.
 * Tracking ref (not a handoff package id): `be3-sb-wb-u08-p134-135-wb109-110`.
 */
export const BE3_U08_CLIL_PE_STABLE_REF = 'be3-sb-wb-u08-p134-135-wb109-110'

export const BE3_U08_SB134_135_WB109_110: CuratedVerifiedSbWbCompanion = {
  relationshipId: 'be3_sb_wb_rel_u08_clil_pe_sb134-135_wb109-110',
  relationshipType: 'workbook_practice_for',
  verificationStatus: 'human_verified',
  studentBookCatalogId: 'big_english_3_sb',
  workbookCatalogId: 'big_english_3_wb',
  studentBookPageIds: ['bep3_sb_p134', 'bep3_sb_p135'],
  studentBookPrintedPages: [134, 135],
  workbookPageIds: ['bep_3_wb_p109', 'bep_3_wb_p110'],
  workbookPrintedPages: [109, 110],
  unitNumber: 8,
  unitTitle: 'Healthy Living',
  verificationRationale:
    'Workbook pp.109–110 consolidate Student Book Content Connection / P.E. *What Is a Calorie?* (pp.134–135): shared calorie/energy/activity CLIL vocabulary and reading practice. LiA 107–108 and Grammar 111–112 are out of scope.',
  supportingEvidence: [
    'Unit identity: both Unit 8 Healthy Living (human_verified).',
    'SB pp.134–135: Content Connection | P.E. · clil_pe / clil_pe_project · What Is a Calorie?',
    'WB pp.109–110: Content Connection · clil_pe; cloze/listen/match on calorie/energy/active ideas.',
    'Shared CLIL vocab includes calorie, measure, put on weight, active, energy / activities.',
    'Explicitly excluded: WB LiA 107–108 and Grammar 111–112.',
  ],
}

/**
 * BE3 SB Unit 8 Grammar → WB Grammar.
 *
 * Accepted after content review (past simple regular *-ed* + irregulars). Resolver-wired only:
 * no series handoff builder and no Chalkie generation authorized for this mapping.
 * Tracking ref (not a handoff package id): `be3-sb-wb-u08-p136-137-wb111-112`.
 */
export const BE3_U08_GRAMMAR_STABLE_REF = 'be3-sb-wb-u08-p136-137-wb111-112'

export const BE3_U08_SB136_137_WB111_112: CuratedVerifiedSbWbCompanion = {
  relationshipId: 'be3_sb_wb_rel_u08_grammar_sb136-137_wb111-112',
  relationshipType: 'workbook_practice_for',
  verificationStatus: 'human_verified',
  studentBookCatalogId: 'big_english_3_sb',
  workbookCatalogId: 'big_english_3_wb',
  studentBookPageIds: ['bep3_sb_p136', 'bep3_sb_p137'],
  studentBookPrintedPages: [136, 137],
  workbookPageIds: ['bep_3_wb_p111', 'bep_3_wb_p112'],
  workbookPrintedPages: [111, 112],
  unitNumber: 8,
  unitTitle: 'Healthy Living',
  verificationRationale:
    'Workbook pp.111–112 consolidate Student Book Grammar (pp.136–137): shared past-simple regular *-ed* spelling and irregular forms strand, with WB extending questions/negatives on the same topic. LiA 107–108 and CLIL 109–110 are out of scope.',
  supportingEvidence: [
    'Unit identity: both Unit 8 Healthy Living (human_verified).',
    'SB pp.136–137: Grammar · grammar; regular *-ed* classify/narrative + irregular match + yesterday speaking.',
    'WB pp.111–112: Grammar · grammar; regulars chart, irregulars write, narrative cloze, Did…?/negatives.',
    'Distinct from LiA communicative Did…? practice (132–133 / 107–108).',
    'Explicitly excluded: WB LiA 107–108 and CLIL 109–110.',
  ],
}

/**
 * BE3 SB Unit 8 Culture Connection / Around the World → WB Culture Connection.
 *
 * Accepted after content review (*Strange Sports*). Resolver-wired only:
 * no series handoff builder and no Chalkie generation authorized for this mapping.
 * Tracking ref (not a handoff package id): `be3-sb-wb-u08-p138-139-wb113-114`.
 */
export const BE3_U08_CULTURE_STABLE_REF = 'be3-sb-wb-u08-p138-139-wb113-114'

export const BE3_U08_SB138_139_WB113_114: CuratedVerifiedSbWbCompanion = {
  relationshipId: 'be3_sb_wb_rel_u08_culture_sb138-139_wb113-114',
  relationshipType: 'workbook_practice_for',
  verificationStatus: 'human_verified',
  studentBookCatalogId: 'big_english_3_sb',
  workbookCatalogId: 'big_english_3_wb',
  studentBookPageIds: ['bep3_sb_p138', 'bep3_sb_p139'],
  studentBookPrintedPages: [138, 139],
  workbookPageIds: ['bep_3_wb_p113', 'bep_3_wb_p114'],
  workbookPrintedPages: [113, 114],
  unitNumber: 8,
  unitTitle: 'Healthy Living',
  verificationRationale:
    'Workbook pp.113–114 consolidate Student Book Culture Connection / Around the World *Strange Sports* (pp.138–139): shared unusual-sports reading strand (Octopush, Footvolley, Pumpkin Regatta). Grammar 111–112 and Writing 115 are out of scope.',
  supportingEvidence: [
    'Unit identity: both Unit 8 Healthy Living (human_verified).',
    'SB pp.138–139: Culture Connection | Around the World · culture / culture_activities · Strange Sports.',
    'WB pp.113–114: Culture Connection · culture_connection · Around the World; match/listen/T-F/Think Big invent a sport.',
    'Shared sports strand: octopush, footvolley, pumpkin regatta / contest, net, regatta, rowing, team.',
    'Explicitly excluded: WB Grammar 111–112 and Writing 115.',
  ],
}

/**
 * BE3 SB Unit 8 Writing → WB Writing (1→1).
 *
 * Accepted after content review (*Combining Sentences with and, but, or*). Resolver-wired only:
 * no series handoff builder and no Chalkie generation authorized for this mapping.
 * Packaging note: 1→1 single lesson likely (not a two-lesson series).
 * Tracking ref (not a handoff package id): `be3-sb-wb-u08-p140-wb115`.
 */
export const BE3_U08_WRITING_STABLE_REF = 'be3-sb-wb-u08-p140-wb115'

export const BE3_U08_SB140_WB115: CuratedVerifiedSbWbCompanion = {
  relationshipId: 'be3_sb_wb_rel_u08_writing_sb140_wb115',
  relationshipType: 'workbook_practice_for',
  verificationStatus: 'human_verified',
  studentBookCatalogId: 'big_english_3_sb',
  workbookCatalogId: 'big_english_3_wb',
  studentBookPageIds: ['bep3_sb_p140'],
  studentBookPrintedPages: [140],
  workbookPageIds: ['bep_3_wb_p115'],
  workbookPrintedPages: [115],
  unitNumber: 8,
  unitTitle: 'Healthy Living',
  verificationRationale:
    'Workbook p.115 consolidates Student Book Writing *Combining Sentences with and, but, or* (p.140): shared coordinating-conjunction writing strand. Culture 113–114 and Phonics 116 are out of scope. Valid 1→1 component pairing.',
  supportingEvidence: [
    'Unit identity: both Unit 8 Healthy Living (human_verified).',
    'SB p.140: Writing · writing · Combining Sentences with and, but, or.',
    'WB p.115: Writing · writing · same and/but/or joining work.',
    'Page-count shape: 1 SB → 1 WB (component map 1→1).',
    'Explicitly excluded: WB Culture 113–114 and Phonics 116.',
  ],
}

/**
 * BE3 SB Unit 8 Phonics → WB Phonics (1→1).
 *
 * Accepted after content review (*all, au, aw*). Resolver-wired only:
 * no series handoff builder and no Chalkie generation authorized for this mapping.
 * Packaging note: 1→1 single lesson likely (not a two-lesson series).
 * Tracking ref (not a handoff package id): `be3-sb-wb-u08-p141-wb116`.
 */
export const BE3_U08_PHONICS_STABLE_REF = 'be3-sb-wb-u08-p141-wb116'

export const BE3_U08_SB141_WB116: CuratedVerifiedSbWbCompanion = {
  relationshipId: 'be3_sb_wb_rel_u08_phonics_sb141_wb116',
  relationshipType: 'workbook_practice_for',
  verificationStatus: 'human_verified',
  studentBookCatalogId: 'big_english_3_sb',
  workbookCatalogId: 'big_english_3_wb',
  studentBookPageIds: ['bep3_sb_p141'],
  studentBookPrintedPages: [141],
  workbookPageIds: ['bep_3_wb_p116'],
  workbookPrintedPages: [116],
  unitNumber: 8,
  unitTitle: 'Healthy Living',
  verificationRationale:
    'Workbook p.116 consolidates Student Book Phonics *all, au, aw* (p.141): shared sound/spelling set and related chant practice. Writing 115 and Review 117 are out of scope. Valid 1→1 component pairing.',
  supportingEvidence: [
    'Unit identity: both Unit 8 Healthy Living (human_verified).',
    'SB p.141: Phonics · phonics · all, au, aw.',
    'WB p.116: Phonics · phonics · same all/au/aw circle/underline/connect/chant gaps.',
    'Shared items include ball, haul, draw, tall, yawn, claw, Paul, wall.',
    'Page-count shape: 1 SB → 1 WB (component map 1→1).',
    'Explicitly excluded: WB Writing 115 and Review 117.',
  ],
}

/**
 * BE3 SB Unit 8 Review → WB Review (1→1).
 *
 * Accepted after content review (Did…? / past-form review + gerund-as-subject on same Review page).
 * Resolver-wired only: no series handoff builder and no Chalkie generation authorized.
 * Packaging note: 1→1 single lesson likely (not a two-lesson series).
 * Values SB p.142 remains intentionally SB-only (no Workbook companion).
 * Tracking ref (not a handoff package id): `be3-sb-wb-u08-p143-wb117`.
 */
export const BE3_U08_REVIEW_STABLE_REF = 'be3-sb-wb-u08-p143-wb117'

export const BE3_U08_SB143_WB117: CuratedVerifiedSbWbCompanion = {
  relationshipId: 'be3_sb_wb_rel_u08_review_sb143_wb117',
  relationshipType: 'workbook_practice_for',
  verificationStatus: 'human_verified',
  studentBookCatalogId: 'big_english_3_sb',
  workbookCatalogId: 'big_english_3_wb',
  studentBookPageIds: ['bep3_sb_p143'],
  studentBookPrintedPages: [143],
  workbookPageIds: ['bep_3_wb_p117'],
  workbookPrintedPages: [117],
  unitNumber: 8,
  unitTitle: 'Healthy Living',
  verificationRationale:
    'Workbook p.117 consolidates Student Book Review (p.143): shared Did…? / did–didn\'t and past-form review, with WB gerund-as-subject practice still on the same Review page. Phonics 116 is out of scope. Values SB p.142 has no WB companion. Valid 1→1 component pairing.',
  supportingEvidence: [
    'Unit identity: both Unit 8 Healthy Living (human_verified).',
    'SB p.143: Review · review_self_assessment; Did…? choice, survey, regular/irregular past.',
    'WB p.117: Review · review; circle verbs, healthy-living cloze, gerund subjects on same Review page.',
    'Page-count shape: 1 SB → 1 WB (component map 1→1).',
    'Explicitly excluded: WB Phonics 116; Values SB p.142 is SB-only (no WB Values page).',
  ],
}

/** All curated companions recognised by the resolver. Add entries one reviewed pair at a time. */
export const CURATED_VERIFIED_SB_WB_COMPANIONS: readonly CuratedVerifiedSbWbCompanion[] = [
  BE3_U08_SB128_129_WB104_105,
  BE3_U08_SB130_131_WB106,
  BE3_U08_SB132_133_WB107_108,
  BE3_U08_SB134_135_WB109_110,
  BE3_U08_SB136_137_WB111_112,
  BE3_U08_SB138_139_WB113_114,
  BE3_U08_SB140_WB115,
  BE3_U08_SB141_WB116,
  BE3_U08_SB143_WB117,
]
