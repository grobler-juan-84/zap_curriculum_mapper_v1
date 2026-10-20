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

test('unmapped BE3 spreads still do not receive guessed Workbook companions', () => {
  const sb = loadJson(BE3_SB_PATH)
  const wb = loadJson(BE3_WB_PATH)
  for (const pages of [
    [130, 131],
    [132, 133],
    [134, 135],
    [136, 137],
    [138, 139],
  ]) {
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
  }
})

test('incomplete workbook_practice_for relationship is rejected', () => {
  // Use an unmapped spread so the curated opener pair does not intercept.
  const sb = {
    book_id: 'big_english_3_sb',
    pages: [
      { page_id: 'bep3_sb_p132', printed_page: 132 },
      { page_id: 'bep3_sb_p133', printed_page: 133 },
    ],
    relationships: [
      {
        relationship_id: 'fake_rel',
        book_id: 'big_english_3_sb',
        relationship_type: 'workbook_practice_for',
        source_entity_id: 'bep3_sb_p132',
        target_entity_id: null,
        verification_status: 'human_verified',
      },
    ],
  }
  const wb = {
    book_id: 'big_english_3_wb',
    pages: [
      { page_id: 'bep_3_wb_p107', printed_page: 107 },
      { page_id: 'bep_3_wb_p108', printed_page: 108 },
    ],
    relationships: [],
  }

  const result = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sb,
    workbookCanonical: wb,
    studentBookPrintedPages: [132, 133],
  })
  assert.equal(result.companion, null)
  assert.equal(result.gapReason, 'relationship_target_incomplete')
})

test('partial canonical cross-book relationship does not invent full-spread companion', () => {
  const sb = {
    book_id: 'big_english_3_sb',
    pages: [
      { page_id: 'bep3_sb_p132', printed_page: 132 },
      { page_id: 'bep3_sb_p133', printed_page: 133 },
    ],
    relationships: [
      {
        relationship_id: 'ok_rel',
        book_id: 'big_english_3_sb',
        relationship_type: 'workbook_practice_for',
        source_entity_id: 'bep3_sb_p132',
        target_entity_id: 'bep_3_wb_p107',
        target_book_id: 'big_english_3_wb',
        verification_status: 'human_verified',
      },
    ],
  }
  const wb = {
    book_id: 'big_english_3_wb',
    pages: [
      { page_id: 'bep_3_wb_p107', printed_page: 107 },
      { page_id: 'bep_3_wb_p108', printed_page: 108 },
    ],
    relationships: [],
  }

  const result = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sb,
    workbookCanonical: wb,
    studentBookPrintedPages: [132, 133],
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

test('BE3 ready resolve records companion but keeps series packaging off for now', () => {
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
  // Series handoff UI/builders are the next step — companion alone must not enable them yet.
  assert.equal(lesson.supportsTwoLessonSeries, false)
  assert.equal(lesson.isBe2U08PrototypeRoute, false)
})

test('single-lesson BE3 path remains ready and local (regression)', () => {
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
  assert.equal(lesson.supportsTwoLessonSeries, false)
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
      'A two-lesson Student Book → Workbook series is not available for this source',
    ),
  )
})
