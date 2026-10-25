/**
 * SB-only Step 1 layout: no empty facing panel; SB→WB pairs keep two-source UI.
 * Run: npx tsx --test scripts/tests/chalkieSbOnlyActivityLayout.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  buildSbActivityCards,
  buildSbActivityPageColumns,
} from '../../app/src/features/chalkie/chalkieActivitySelection.ts'
import { resolveChalkieLessonContext } from '../../app/src/features/chalkie/resolveChalkieLessonContext.ts'
import type { Book } from '../../app/src/types/curriculum.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const BE3_SB_PATH = path.join(ROOT, 'data/phase1/big_english_3_sb/canonical/v1.json')
const BE3_WB_PATH = path.join(ROOT, 'data/phase1/big_english_3_wb/canonical/v1.json')
const OVERLAY_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx',
)

function loadJson(filePath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

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

function be3UnitSummary(unitNumber: number): BatchJsonSummary {
  const rawBook = loadJson(BE3_SB_PATH)
  const unit = asArray(rawBook.units).find((entry) => {
    const u = asRecord(entry)
    return u.unit_number === unitNumber || u.unit_number === String(unitNumber)
  })
  const unitRec = asRecord(unit)
  const start =
    typeof unitRec.printed_page_start === 'number' ? unitRec.printed_page_start : 1
  const end =
    typeof unitRec.printed_page_end === 'number' ? unitRec.printed_page_end : start
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

  return {
    catalogBookId: 'big_english_3_sb',
    units: [
      {
        unitNumber,
        title:
          typeof unitRec.title === 'string' ? unitRec.title : `Unit ${unitNumber}`,
        printedPageStart: start,
        printedPageEnd: end,
      },
    ],
    vocabulary: [],
    language: [],
    activities: [],
    pages: pageRows.map((entry) => {
      const p = asRecord(entry)
      return {
        printedPage: typeof p.printed_page === 'number' ? p.printed_page : null,
      }
    }),
    raw: {
      book_id: 'big_english_3_sb',
      units: asArray(rawBook.units).filter((entry) => {
        const u = asRecord(entry)
        return u.unit_number === unitNumber || u.unit_number === String(unitNumber)
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
    },
  }
}

/** Mirror overlay filtering: SB-only hides facing placeholders. */
function visibleSbColumnsForLesson(input: {
  hasVerifiedWorkbookCompanion: boolean
  cards: ReturnType<typeof buildSbActivityCards>
  visiblePrintedPages: number[]
}) {
  const columns = buildSbActivityPageColumns(
    input.cards,
    input.visiblePrintedPages,
  )
  return input.hasVerifiedWorkbookCompanion
    ? columns
    : columns.filter((column) => column.includedInLessonScope)
}

test('BE3 Unit 1 p.4 SB-only layout shows one full-width Student Book list', () => {
  const summary = be3UnitSummary(1)
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary,
    visiblePrintedPages: [4],
    unitNumber: 1,
  })

  assert.equal(lesson.status, 'ready')
  assert.equal(lesson.workbookCompanion, null)
  assert.deepEqual(lesson.visiblePrintedPages, [4])

  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [4],
  })
  const padded = buildSbActivityPageColumns(cards, [4])
  assert.equal(padded.length, 2)
  assert.equal(padded.filter((column) => !column.includedInLessonScope).length, 1)

  const visible = visibleSbColumnsForLesson({
    hasVerifiedWorkbookCompanion: false,
    cards,
    visiblePrintedPages: [4],
  })
  assert.equal(visible.length, 1)
  assert.equal(visible[0]?.printedPage, 4)
  assert.equal(visible[0]?.includedInLessonScope, true)
  assert.ok(visible.every((column) => column.includedInLessonScope))
})

test('verified BE3 U8 opener SB→WB route still exposes two-source layout hooks', () => {
  const summary = be3UnitSummary(8)
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary,
    visiblePrintedPages: [128, 129],
    unitNumber: 8,
    workbookCanonical: loadJson(BE3_WB_PATH),
  })

  assert.equal(lesson.status, 'ready')
  assert.ok(lesson.workbookCompanion)
  assert.deepEqual(lesson.workbookCompanion?.studentBookPrintedPages, [128, 129])
  assert.deepEqual(lesson.workbookCompanion?.workbookPrintedPages, [104, 105])

  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [128, 129],
  })
  const visible = visibleSbColumnsForLesson({
    hasVerifiedWorkbookCompanion: true,
    cards,
    visiblePrintedPages: [128, 129],
  })
  assert.equal(visible.length, 2)
  assert.deepEqual(
    visible.map((column) => column.printedPage),
    [128, 129],
  )
  assert.ok(visible.every((column) => column.includedInLessonScope))
})

test('overlay gates facing placeholders to verified companion routes only', () => {
  const overlay = fs.readFileSync(OVERLAY_PATH, 'utf8')
  assert.match(overlay, /hasVerifiedWorkbookCompanion/)
  assert.match(overlay, /visibleSbActivityPageColumns/)
  assert.match(overlay, /data-sb-only-layout/)
  assert.match(overlay, /data-sb-wb-pair-layout/)
  assert.match(
    overlay,
    /hasVerifiedWorkbookCompanion[\s\S]{0,120}activityPageColumns[\s\S]{0,80}filter/,
  )
  assert.match(overlay, /Not included in this lesson scope\./)
  assert.match(overlay, /data-wb-activity-section/)
})
