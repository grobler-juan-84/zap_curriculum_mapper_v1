/**
 * Verified SB→WB companion pairing tests.
 * Run: npx tsx --test scripts/tests/resolveVerifiedSbWbCompanion.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { resolveChalkieLessonContext } from '../../app/src/features/chalkie/resolveChalkieLessonContext.ts'
import {
  resolveVerifiedSbWbCompanion,
} from '../../app/src/features/chalkie/resolveVerifiedSbWbCompanion.ts'
import {
  BE3_U08_CLIL_PE_STABLE_REF,
  BE3_U08_CULTURE_STABLE_REF,
  BE3_U08_GRAMMAR_STABLE_REF,
  BE3_U08_LIA_STABLE_REF,
  BE3_U08_PHONICS_STABLE_REF,
  BE3_U08_REVIEW_STABLE_REF,
  BE3_U08_WRITING_STABLE_REF,
} from '../../app/src/features/chalkie/verifiedSbWbCompanions.ts'
import type { Book } from '../../app/src/types/curriculum.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const BE3_SB_PATH = path.join(ROOT, 'data/phase1/big_english_3_sb/canonical/v1.json')
const BE3_WB_PATH = path.join(ROOT, 'data/phase1/big_english_3_wb/canonical/v1.json')
const RESOLVER_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/resolveVerifiedSbWbCompanion.ts',
)
const OVERLAY_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx',
)

function bookStub(overrides: Partial<Book> & Pick<Book, 'catalogBookId' | 'title'>): Book {
  return {
    id: 'book-uuid-test',
    seriesId: 'series-uuid-test',
    catalogBookId: overrides.catalogBookId,
    title: overrides.title,
    level: overrides.level ?? '3',
    audience: overrides.audience ?? 'Primary',
    totalUnits: overrides.totalUnits ?? 9,
    type: overrides.type ?? 'Student Book',
    colorScheme: overrides.colorScheme ?? {
      primary: '#000000',
      accent: '#333333',
      badgeBg: '#eeeeee',
      badgeText: '#111111',
    },
    pageSpreads: overrides.pageSpreads ?? [],
  }
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function loadJson(filePath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>
}

function be3Unit8SbSummary(): BatchJsonSummary {
  const rawBook = loadJson(BE3_SB_PATH)
  const unit = asArray(rawBook.units).find((entry) => {
    const u = asRecord(entry)
    return u.unit_number === 8 || u.unit_number === '8'
  })
  const unitRec = asRecord(unit)
  const start =
    typeof unitRec.printed_page_start === 'number' ? unitRec.printed_page_start : 128
  const end = typeof unitRec.printed_page_end === 'number' ? unitRec.printed_page_end : 143
  const unitPages: number[] = []
  for (let page = start; page <= end; page += 1) unitPages.push(page)

  const pageRows = asArray(rawBook.pages).filter((entry) => {
    const printed = asRecord(entry).printed_page
    return typeof printed === 'number' && unitPages.includes(printed)
  })
  const pageIds = new Set(
    pageRows
      .map((entry) => asRecord(entry).page_id)
      .filter((id): id is string => typeof id === 'string'),
  )
  const raw = {
    book_id: 'big_english_3_sb',
    units: asArray(rawBook.units).filter((entry) => {
      const u = asRecord(entry)
      return u.unit_number === 8 || u.unit_number === '8'
    }),
    pages: pageRows,
    vocabulary: asArray(rawBook.vocabulary).filter((entry) =>
      pageIds.has(String(asRecord(entry).page_id ?? '')),
    ),
    language: asArray(rawBook.language).filter((entry) =>
      pageIds.has(String(asRecord(entry).page_id ?? '')),
    ),
    activities: asArray(rawBook.activities).filter((entry) =>
      pageIds.has(String(asRecord(entry).page_id ?? '')),
    ),
    curriculum_components: asArray(rawBook.curriculum_components).filter((entry) =>
      pageIds.has(String(asRecord(entry).page_id ?? '')),
    ),
    relationships: asArray(rawBook.relationships),
  }

  return {
    catalogBookId: 'big_english_3_sb',
    units: [
      {
        unitNumber: 8,
        title: typeof unitRec.title === 'string' ? unitRec.title : 'Healthy Living',
        printedPageStart: start,
        printedPageEnd: end,
      },
    ],
    vocabulary: [],
    language: [],
    activities: asArray(raw.activities).map((entry) => {
      const a = asRecord(entry)
      return {
        title:
          typeof a.instruction === 'string'
            ? a.instruction
            : typeof a.title === 'string'
              ? a.title
              : undefined,
        pageId: typeof a.page_id === 'string' ? a.page_id : undefined,
      }
    }),
    pages: pageRows.map((entry) => {
      const p = asRecord(entry)
      return {
        printedPage: typeof p.printed_page === 'number' ? p.printed_page : null,
        sectionTitle: typeof p.section_title === 'string' ? p.section_title : undefined,
        sectionType: typeof p.section_type === 'string' ? p.section_type : undefined,
        pageHeading: typeof p.page_heading === 'string' ? p.page_heading : undefined,
      }
    }),
    raw,
  }
}

test('BE3 SB pp.128–129 resolves to curated WB pp.104–105 companion', () => {
  assert.ok(fs.existsSync(BE3_SB_PATH), 'BE3 SB canonical required')
  assert.ok(fs.existsSync(BE3_WB_PATH), 'BE3 WB canonical required')

  const sb = loadJson(BE3_SB_PATH)
  const wb = loadJson(BE3_WB_PATH)
  const result = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sb,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wb,
    studentBookPrintedPages: [128, 129],
  })

  assert.ok(result.companion)
  assert.equal(result.gapReason, null)
  assert.equal(result.companion?.source, 'curated_verified')
  assert.equal(
    result.companion?.relationshipId,
    'be3_sb_wb_rel_u08_opener_sb128-129_wb104-105',
  )
  assert.deepEqual(result.companion?.studentBookPrintedPages, [128, 129])
  assert.deepEqual(result.companion?.workbookPrintedPages, [104, 105])
  assert.deepEqual(result.companion?.studentBookPageIds, [
    'bep3_sb_p128',
    'bep3_sb_p129',
  ])
  assert.deepEqual(result.companion?.workbookPageIds, [
    'bep_3_wb_p104',
    'bep_3_wb_p105',
  ])
  assert.equal(result.companion?.workbookCatalogId, 'big_english_3_wb')
})

test('BE3 SB pp.130–131 resolves to asymmetric curated WB p.106 companion only', () => {
  const sb = loadJson(BE3_SB_PATH)
  const wb = loadJson(BE3_WB_PATH)
  const result = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sb,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wb,
    studentBookPrintedPages: [130, 131],
  })

  assert.ok(result.companion)
  assert.equal(result.gapReason, null)
  assert.equal(result.companion?.source, 'curated_verified')
  assert.equal(
    result.companion?.relationshipId,
    'be3_sb_wb_rel_u08_story_sb130-131_wb106',
  )
  assert.deepEqual(result.companion?.studentBookPrintedPages, [130, 131])
  assert.deepEqual(result.companion?.workbookPrintedPages, [106])
  assert.deepEqual(result.companion?.studentBookPageIds, [
    'bep3_sb_p130',
    'bep3_sb_p131',
  ])
  assert.deepEqual(result.companion?.workbookPageIds, ['bep_3_wb_p106'])
  // Rejected 106–107 pairing must not reappear via page guess.
  assert.ok(!result.companion?.workbookPrintedPages.includes(107))
})

test('BE3 SB pp.132–133 resolves to curated LiA WB pp.107–108 companion', () => {
  const sb = loadJson(BE3_SB_PATH)
  const wb = loadJson(BE3_WB_PATH)
  const result = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sb,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wb,
    studentBookPrintedPages: [132, 133],
  })

  assert.ok(result.companion)
  assert.equal(result.gapReason, null)
  assert.equal(result.companion?.source, 'curated_verified')
  assert.equal(
    result.companion?.relationshipId,
    'be3_sb_wb_rel_u08_lia_sb132-133_wb107-108',
  )
  assert.deepEqual(result.companion?.studentBookPrintedPages, [132, 133])
  assert.deepEqual(result.companion?.workbookPrintedPages, [107, 108])
  assert.deepEqual(result.companion?.studentBookPageIds, [
    'bep3_sb_p132',
    'bep3_sb_p133',
  ])
  assert.deepEqual(result.companion?.workbookPageIds, [
    'bep_3_wb_p107',
    'bep_3_wb_p108',
  ])
  assert.equal(BE3_U08_LIA_STABLE_REF, 'be3-sb-wb-u08-p132-133-wb107-108')
  // Resolver-wired only — story scope must not leak into LiA.
  assert.ok(!result.companion?.workbookPrintedPages.includes(106))
})

test('BE3 SB pp.134–135 resolves to curated CLIL/P.E. WB pp.109–110 companion', () => {
  const sb = loadJson(BE3_SB_PATH)
  const wb = loadJson(BE3_WB_PATH)
  const result = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sb,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wb,
    studentBookPrintedPages: [134, 135],
  })

  assert.ok(result.companion)
  assert.equal(result.gapReason, null)
  assert.equal(result.companion?.source, 'curated_verified')
  assert.equal(
    result.companion?.relationshipId,
    'be3_sb_wb_rel_u08_clil_pe_sb134-135_wb109-110',
  )
  assert.deepEqual(result.companion?.studentBookPrintedPages, [134, 135])
  assert.deepEqual(result.companion?.workbookPrintedPages, [109, 110])
  assert.deepEqual(result.companion?.studentBookPageIds, [
    'bep3_sb_p134',
    'bep3_sb_p135',
  ])
  assert.deepEqual(result.companion?.workbookPageIds, [
    'bep_3_wb_p109',
    'bep_3_wb_p110',
  ])
  assert.equal(BE3_U08_CLIL_PE_STABLE_REF, 'be3-sb-wb-u08-p134-135-wb109-110')
  // Must not bleed into LiA or Grammar WB pages.
  assert.ok(!result.companion?.workbookPrintedPages.includes(107))
  assert.ok(!result.companion?.workbookPrintedPages.includes(111))
})

test('BE3 SB pp.136–137 resolves to curated Grammar WB pp.111–112 companion', () => {
  const sb = loadJson(BE3_SB_PATH)
  const wb = loadJson(BE3_WB_PATH)
  const result = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sb,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wb,
    studentBookPrintedPages: [136, 137],
  })

  assert.ok(result.companion)
  assert.equal(result.gapReason, null)
  assert.equal(result.companion?.source, 'curated_verified')
  assert.equal(
    result.companion?.relationshipId,
    'be3_sb_wb_rel_u08_grammar_sb136-137_wb111-112',
  )
  assert.deepEqual(result.companion?.studentBookPrintedPages, [136, 137])
  assert.deepEqual(result.companion?.workbookPrintedPages, [111, 112])
  assert.deepEqual(result.companion?.studentBookPageIds, [
    'bep3_sb_p136',
    'bep3_sb_p137',
  ])
  assert.deepEqual(result.companion?.workbookPageIds, [
    'bep_3_wb_p111',
    'bep_3_wb_p112',
  ])
  assert.equal(BE3_U08_GRAMMAR_STABLE_REF, 'be3-sb-wb-u08-p136-137-wb111-112')
  // Must not bleed into CLIL or Culture WB pages.
  assert.ok(!result.companion?.workbookPrintedPages.includes(109))
  assert.ok(!result.companion?.workbookPrintedPages.includes(113))
})

test('BE3 SB pp.138–139 resolves to curated Culture WB pp.113–114 companion', () => {
  const sb = loadJson(BE3_SB_PATH)
  const wb = loadJson(BE3_WB_PATH)
  const result = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sb,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wb,
    studentBookPrintedPages: [138, 139],
  })

  assert.ok(result.companion)
  assert.equal(result.gapReason, null)
  assert.equal(result.companion?.source, 'curated_verified')
  assert.equal(
    result.companion?.relationshipId,
    'be3_sb_wb_rel_u08_culture_sb138-139_wb113-114',
  )
  assert.deepEqual(result.companion?.studentBookPrintedPages, [138, 139])
  assert.deepEqual(result.companion?.workbookPrintedPages, [113, 114])
  assert.deepEqual(result.companion?.studentBookPageIds, [
    'bep3_sb_p138',
    'bep3_sb_p139',
  ])
  assert.deepEqual(result.companion?.workbookPageIds, [
    'bep_3_wb_p113',
    'bep_3_wb_p114',
  ])
  assert.equal(BE3_U08_CULTURE_STABLE_REF, 'be3-sb-wb-u08-p138-139-wb113-114')
  // Must not bleed into Grammar or Writing WB pages.
  assert.ok(!result.companion?.workbookPrintedPages.includes(111))
  assert.ok(!result.companion?.workbookPrintedPages.includes(115))
})

test('BE3 SB p.140 resolves to curated Writing WB p.115 companion', () => {
  const sb = loadJson(BE3_SB_PATH)
  const wb = loadJson(BE3_WB_PATH)
  const result = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sb,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wb,
    studentBookPrintedPages: [140],
  })

  assert.ok(result.companion)
  assert.equal(result.gapReason, null)
  assert.equal(result.companion?.source, 'curated_verified')
  assert.equal(
    result.companion?.relationshipId,
    'be3_sb_wb_rel_u08_writing_sb140_wb115',
  )
  assert.deepEqual(result.companion?.studentBookPrintedPages, [140])
  assert.deepEqual(result.companion?.workbookPrintedPages, [115])
  assert.deepEqual(result.companion?.studentBookPageIds, ['bep3_sb_p140'])
  assert.deepEqual(result.companion?.workbookPageIds, ['bep_3_wb_p115'])
  assert.equal(BE3_U08_WRITING_STABLE_REF, 'be3-sb-wb-u08-p140-wb115')
  // Must not bleed into Culture or Phonics WB pages.
  assert.ok(!result.companion?.workbookPrintedPages.includes(113))
  assert.ok(!result.companion?.workbookPrintedPages.includes(116))
})

test('BE3 SB p.141 resolves to curated Phonics WB p.116 companion', () => {
  const sb = loadJson(BE3_SB_PATH)
  const wb = loadJson(BE3_WB_PATH)
  const result = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sb,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wb,
    studentBookPrintedPages: [141],
  })

  assert.ok(result.companion)
  assert.equal(result.gapReason, null)
  assert.equal(result.companion?.source, 'curated_verified')
  assert.equal(
    result.companion?.relationshipId,
    'be3_sb_wb_rel_u08_phonics_sb141_wb116',
  )
  assert.deepEqual(result.companion?.studentBookPrintedPages, [141])
  assert.deepEqual(result.companion?.workbookPrintedPages, [116])
  assert.deepEqual(result.companion?.studentBookPageIds, ['bep3_sb_p141'])
  assert.deepEqual(result.companion?.workbookPageIds, ['bep_3_wb_p116'])
  assert.equal(BE3_U08_PHONICS_STABLE_REF, 'be3-sb-wb-u08-p141-wb116')
  // Must not bleed into Writing or Review WB pages.
  assert.ok(!result.companion?.workbookPrintedPages.includes(115))
  assert.ok(!result.companion?.workbookPrintedPages.includes(117))
})

test('BE3 SB p.143 resolves to curated Review WB p.117 companion', () => {
  const sb = loadJson(BE3_SB_PATH)
  const wb = loadJson(BE3_WB_PATH)
  const result = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sb,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wb,
    studentBookPrintedPages: [143],
  })

  assert.ok(result.companion)
  assert.equal(result.gapReason, null)
  assert.equal(result.companion?.source, 'curated_verified')
  assert.equal(
    result.companion?.relationshipId,
    'be3_sb_wb_rel_u08_review_sb143_wb117',
  )
  assert.deepEqual(result.companion?.studentBookPrintedPages, [143])
  assert.deepEqual(result.companion?.workbookPrintedPages, [117])
  assert.deepEqual(result.companion?.studentBookPageIds, ['bep3_sb_p143'])
  assert.deepEqual(result.companion?.workbookPageIds, ['bep_3_wb_p117'])
  assert.equal(BE3_U08_REVIEW_STABLE_REF, 'be3-sb-wb-u08-p143-wb117')
  // Must not bleed into Phonics WB pages.
  assert.ok(!result.companion?.workbookPrintedPages.includes(116))
})

test('BE3 SB Values p.142 resolves no Workbook companion (SB-only confirmed)', () => {
  const sb = loadJson(BE3_SB_PATH)
  const wb = loadJson(BE3_WB_PATH)
  const result = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sb,
    workbookCanonical: wb,
    studentBookPrintedPages: [142],
  })
  assert.equal(result.companion, null)
  assert.ok(result.gapReason)
  assert.notEqual(
    result.companion?.relationshipId,
    'be3_sb_wb_rel_u08_review_sb143_wb117',
  )
})

test('unmapped BE3 spreads still do not receive guessed Workbook companions', () => {
  const sb = loadJson(BE3_SB_PATH)
  const wb = loadJson(BE3_WB_PATH)
  for (const pages of [[140, 141], [142, 143]]) {
    const result = resolveVerifiedSbWbCompanion({
      studentBookCatalogId: 'big_english_3_sb',
      studentBookCanonical: sb,
      workbookCanonical: wb,
      studentBookPrintedPages: pages,
    })
    assert.equal(
      result.companion,
      null,
      `pages ${pages.join('-')} must not invent a WB companion`,
    )
    assert.ok(result.gapReason)
    assert.notEqual(
      result.companion?.relationshipId,
      'be3_sb_wb_rel_u08_review_sb143_wb117',
    )
  }
})

test('incomplete workbook_practice_for relationship is rejected', () => {
  // Use an unmapped multi-page set so curated companions do not intercept.
  const sb = {
    book_id: 'big_english_3_sb',
    pages: [
      { page_id: 'bep3_sb_p142', printed_page: 142 },
      { page_id: 'bep3_sb_p_other', printed_page: 999 },
    ],
    relationships: [
      {
        relationship_id: 'fake_rel',
        book_id: 'big_english_3_sb',
        relationship_type: 'workbook_practice_for',
        source_entity_id: 'bep3_sb_p142',
        target_entity_id: null,
        verification_status: 'human_verified',
      },
    ],
  }
  const wb = {
    book_id: 'big_english_3_wb',
    pages: [
      { page_id: 'bep_3_wb_p117', printed_page: 117 },
    ],
    relationships: [],
  }

  const result = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sb,
    workbookCanonical: wb,
    studentBookPrintedPages: [142, 999],
  })
  assert.equal(result.companion, null)
  assert.equal(result.gapReason, 'relationship_target_incomplete')
})

test('partial canonical cross-book relationship does not invent full-spread companion', () => {
  const sb = {
    book_id: 'big_english_3_sb',
    pages: [
      { page_id: 'bep3_sb_p142', printed_page: 142 },
      { page_id: 'bep3_sb_p_other', printed_page: 999 },
    ],
    relationships: [
      {
        relationship_id: 'ok_rel',
        book_id: 'big_english_3_sb',
        relationship_type: 'workbook_practice_for',
        source_entity_id: 'bep3_sb_p142',
        target_entity_id: 'bep_3_wb_p117',
        target_book_id: 'big_english_3_wb',
        verification_status: 'human_verified',
      },
    ],
  }
  const wb = {
    book_id: 'big_english_3_wb',
    pages: [
      { page_id: 'bep_3_wb_p117', printed_page: 117 },
    ],
    relationships: [],
  }

  const result = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sb,
    workbookCanonical: wb,
    studentBookPrintedPages: [142, 999],
  })

  assert.equal(result.companion, null)
  assert.ok(
    result.gapReason === 'pages_do_not_match_visible_spread' ||
      result.gapReason === 'relationship_target_incomplete',
  )
})

test('verified relationship covering both SB pages resolves WB companion', () => {
  const sb = {
    book_id: 'big_english_3_sb',
    pages: [
      { page_id: 'bep3_sb_spread_128_129', printed_page: 128 },
      { page_id: 'bep3_sb_spread_128_129', printed_page: 129 },
    ],
    relationships: [
      {
        relationship_id: 'ok_rel_spread',
        book_id: 'big_english_3_sb',
        relationship_type: 'workbook_practice_for',
        source_entity_id: 'bep3_sb_spread_128_129',
        target_entity_id: 'bep_3_wb_spread_104_105',
        target_book_id: 'big_english_3_wb',
        verification_status: 'human_verified',
      },
    ],
  }
  const wb = {
    book_id: 'big_english_3_wb',
    pages: [
      { page_id: 'bep_3_wb_spread_104_105', printed_page: 104 },
      { page_id: 'bep_3_wb_spread_104_105', printed_page: 105 },
    ],
    relationships: [],
  }

  const result = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sb,
    workbookCanonical: wb,
    studentBookPrintedPages: [128, 129],
  })

  assert.ok(result.companion)
  assert.deepEqual(result.companion?.workbookPrintedPages, [104, 105])
  assert.deepEqual(result.companion?.studentBookPrintedPages, [128, 129])
  assert.equal(result.companion?.workbookCatalogId, 'big_english_3_wb')
  assert.equal(result.gapReason, null)
})

test('BE3 ready resolve enables series packaging for the accepted opener pair', () => {
  const wb = loadJson(BE3_WB_PATH)
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8SbSummary(),
    visiblePrintedPages: [128, 129],
    unitNumber: 8,
    workbookCanonical: wb,
  })

  assert.equal(lesson.status, 'ready')
  assert.ok(lesson.workbookCompanion)
  assert.deepEqual(lesson.workbookCompanion?.workbookPrintedPages, [104, 105])
  assert.equal(lesson.supportsTwoLessonSeries, true)
  assert.equal(lesson.twoLessonPackagingMode, 'sb_wb')
  assert.ok(lesson.seriesLessonTitle)
  assert.ok(lesson.stableSeriesReference)
  assert.equal(lesson.isBe2U08PrototypeRoute, false)
})

test('BE3 story companion resolves and enables story series packaging only', () => {
  const wb = loadJson(BE3_WB_PATH)
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8SbSummary(),
    visiblePrintedPages: [130, 131],
    unitNumber: 8,
    workbookCanonical: wb,
  })

  assert.equal(lesson.status, 'ready')
  assert.ok(lesson.workbookCompanion)
  assert.equal(
    lesson.workbookCompanion?.relationshipId,
    'be3_sb_wb_rel_u08_story_sb130-131_wb106',
  )
  assert.deepEqual(lesson.workbookCompanion?.workbookPrintedPages, [106])
  assert.equal(lesson.supportsTwoLessonSeries, true)
  assert.equal(lesson.twoLessonPackagingMode, 'sb_wb')
  assert.ok(lesson.seriesLessonTitle?.includes('An Unhealthy Dinner'))
  assert.ok(lesson.seriesLessonTitle?.includes('WB p. 106'))
  assert.doesNotMatch(lesson.seriesLessonTitle ?? '', /107/)
  assert.equal(lesson.stableSeriesReference, 'be3-sb-wb-u08-p130-131-wb106')
})

test('BE3 LiA companion resolves without enabling SB→WB series titles', () => {
  const wb = loadJson(BE3_WB_PATH)
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8SbSummary(),
    visiblePrintedPages: [132, 133],
    unitNumber: 8,
    workbookCanonical: wb,
  })

  assert.equal(lesson.status, 'ready')
  assert.ok(lesson.workbookCompanion)
  assert.equal(
    lesson.workbookCompanion?.relationshipId,
    'be3_sb_wb_rel_u08_lia_sb132-133_wb107-108',
  )
  assert.deepEqual(lesson.workbookCompanion?.workbookPrintedPages, [107, 108])
  // Companion alone does not unlock SB→WB series titles; SB-only two-lesson is available.
  assert.equal(lesson.supportsTwoLessonSeries, true)
  assert.equal(lesson.twoLessonPackagingMode, 'sb_only')
  assert.equal(lesson.seriesLessonTitle, null)
  assert.equal(lesson.stableSeriesReference, null)
  assert.equal(BE3_U08_LIA_STABLE_REF, 'be3-sb-wb-u08-p132-133-wb107-108')
})

test('BE3 CLIL/P.E. companion resolves without enabling SB→WB series titles', () => {
  const wb = loadJson(BE3_WB_PATH)
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8SbSummary(),
    visiblePrintedPages: [134, 135],
    unitNumber: 8,
    workbookCanonical: wb,
  })

  assert.equal(lesson.status, 'ready')
  assert.ok(lesson.workbookCompanion)
  assert.equal(
    lesson.workbookCompanion?.relationshipId,
    'be3_sb_wb_rel_u08_clil_pe_sb134-135_wb109-110',
  )
  assert.deepEqual(lesson.workbookCompanion?.workbookPrintedPages, [109, 110])
  assert.equal(lesson.supportsTwoLessonSeries, true)
  assert.equal(lesson.twoLessonPackagingMode, 'sb_only')
  assert.equal(lesson.seriesLessonTitle, null)
  assert.equal(lesson.stableSeriesReference, null)
  assert.equal(BE3_U08_CLIL_PE_STABLE_REF, 'be3-sb-wb-u08-p134-135-wb109-110')
})

test('BE3 Grammar companion resolves without enabling SB→WB series titles', () => {
  const wb = loadJson(BE3_WB_PATH)
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8SbSummary(),
    visiblePrintedPages: [136, 137],
    unitNumber: 8,
    workbookCanonical: wb,
  })

  assert.equal(lesson.status, 'ready')
  assert.ok(lesson.workbookCompanion)
  assert.equal(
    lesson.workbookCompanion?.relationshipId,
    'be3_sb_wb_rel_u08_grammar_sb136-137_wb111-112',
  )
  assert.deepEqual(lesson.workbookCompanion?.workbookPrintedPages, [111, 112])
  assert.equal(lesson.supportsTwoLessonSeries, true)
  assert.equal(lesson.twoLessonPackagingMode, 'sb_only')
  assert.equal(lesson.seriesLessonTitle, null)
  assert.equal(lesson.stableSeriesReference, null)
  assert.equal(BE3_U08_GRAMMAR_STABLE_REF, 'be3-sb-wb-u08-p136-137-wb111-112')
})

test('BE3 Culture companion resolves without enabling SB→WB series titles', () => {
  const wb = loadJson(BE3_WB_PATH)
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8SbSummary(),
    visiblePrintedPages: [138, 139],
    unitNumber: 8,
    workbookCanonical: wb,
  })

  assert.equal(lesson.status, 'ready')
  assert.ok(lesson.workbookCompanion)
  assert.equal(
    lesson.workbookCompanion?.relationshipId,
    'be3_sb_wb_rel_u08_culture_sb138-139_wb113-114',
  )
  assert.deepEqual(lesson.workbookCompanion?.workbookPrintedPages, [113, 114])
  assert.equal(lesson.supportsTwoLessonSeries, true)
  assert.equal(lesson.twoLessonPackagingMode, 'sb_only')
  assert.equal(lesson.seriesLessonTitle, null)
  assert.equal(lesson.stableSeriesReference, null)
  assert.equal(BE3_U08_CULTURE_STABLE_REF, 'be3-sb-wb-u08-p138-139-wb113-114')
})

test('BE3 Writing companion resolves without enabling SB→WB series titles', () => {
  const wb = loadJson(BE3_WB_PATH)
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8SbSummary(),
    visiblePrintedPages: [140],
    unitNumber: 8,
    workbookCanonical: wb,
  })

  assert.equal(lesson.status, 'ready')
  assert.ok(lesson.workbookCompanion)
  assert.equal(
    lesson.workbookCompanion?.relationshipId,
    'be3_sb_wb_rel_u08_writing_sb140_wb115',
  )
  assert.deepEqual(lesson.workbookCompanion?.workbookPrintedPages, [115])
  assert.equal(lesson.supportsTwoLessonSeries, true)
  assert.equal(lesson.twoLessonPackagingMode, 'sb_only')
  assert.equal(lesson.seriesLessonTitle, null)
  assert.equal(lesson.stableSeriesReference, null)
  assert.equal(BE3_U08_WRITING_STABLE_REF, 'be3-sb-wb-u08-p140-wb115')
})

test('BE3 Phonics companion resolves without enabling SB→WB series titles', () => {
  const wb = loadJson(BE3_WB_PATH)
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8SbSummary(),
    visiblePrintedPages: [141],
    unitNumber: 8,
    workbookCanonical: wb,
  })

  assert.equal(lesson.status, 'ready')
  assert.ok(lesson.workbookCompanion)
  assert.equal(
    lesson.workbookCompanion?.relationshipId,
    'be3_sb_wb_rel_u08_phonics_sb141_wb116',
  )
  assert.deepEqual(lesson.workbookCompanion?.workbookPrintedPages, [116])
  assert.equal(lesson.supportsTwoLessonSeries, true)
  assert.equal(lesson.twoLessonPackagingMode, 'sb_only')
  assert.equal(lesson.seriesLessonTitle, null)
  assert.equal(lesson.stableSeriesReference, null)
  assert.equal(BE3_U08_PHONICS_STABLE_REF, 'be3-sb-wb-u08-p141-wb116')
})

test('BE3 Review companion resolves without enabling SB→WB series titles', () => {
  const wb = loadJson(BE3_WB_PATH)
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8SbSummary(),
    visiblePrintedPages: [143],
    unitNumber: 8,
    workbookCanonical: wb,
  })

  assert.equal(lesson.status, 'ready')
  assert.ok(lesson.workbookCompanion)
  assert.equal(
    lesson.workbookCompanion?.relationshipId,
    'be3_sb_wb_rel_u08_review_sb143_wb117',
  )
  assert.deepEqual(lesson.workbookCompanion?.workbookPrintedPages, [117])
  assert.equal(lesson.supportsTwoLessonSeries, true)
  assert.equal(lesson.twoLessonPackagingMode, 'sb_only')
  assert.equal(lesson.seriesLessonTitle, null)
  assert.equal(lesson.stableSeriesReference, null)
  assert.equal(BE3_U08_REVIEW_STABLE_REF, 'be3-sb-wb-u08-p143-wb117')
})

test('BE3 Values p.142 stays SB-only two-lesson (no WB companion)', () => {
  const wb = loadJson(BE3_WB_PATH)
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8SbSummary(),
    visiblePrintedPages: [142],
    unitNumber: 8,
    workbookCanonical: wb,
  })

  assert.equal(lesson.workbookCompanion, null)
  assert.equal(lesson.supportsTwoLessonSeries, true)
  assert.equal(lesson.twoLessonPackagingMode, 'sb_only')
  assert.equal(lesson.seriesLessonTitle, null)
  assert.equal(lesson.stableSeriesReference, null)
})

test('single-lesson BE3 opener path remains ready; series is optional (regression)', () => {
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8SbSummary(),
    visiblePrintedPages: [128, 129],
    unitNumber: 8,
  })
  assert.equal(lesson.status, 'ready')
  assert.ok(lesson.singleLessonTitle.includes('BE3 SB Unit 08'))
  // Curated companion does not require workbook canonical to resolve.
  assert.equal(lesson.supportsTwoLessonSeries, true)
  assert.ok(lesson.workbookCompanion)
})

test('pairing resolver and overlay do not call OpenAI endpoints', () => {
  const resolverSource = fs.readFileSync(RESOLVER_PATH, 'utf8')
  const overlaySource = fs.readFileSync(OVERLAY_PATH, 'utf8')
  assert.ok(!resolverSource.includes('/api/chalkie/generate'))
  assert.ok(!resolverSource.includes('openai'))
  assert.ok(!overlaySource.includes('chalkieLessonDraftService'))
  assert.ok(!overlaySource.includes('/api/chalkie/generate'))
  assert.ok(
    overlaySource.includes(
      'A two-lesson packaging choice is not available for this source route yet.',
    ),
  )
  assert.ok(overlaySource.includes('Two lessons from this Student Book spread'))
})
