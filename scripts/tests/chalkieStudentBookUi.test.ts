/**
 * Focused D021 Student Book–first UI helper tests.
 * Run: npx tsx --test scripts/tests/chalkieStudentBookUi.test.ts
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import {
  filterStudentBooksForTeacherDropdown,
  isStudentBook,
  lessonAnchorPrintedPages,
  resolveCompanionForSbPages,
  studentBookDisplayTitle,
} from '../../app/src/features/chalkie/chalkieStudentBookUi.ts'
import type { Book } from '../../app/src/types/curriculum.ts'

function bookStub(overrides: Partial<Book> & Pick<Book, 'id' | 'title' | 'type'>): Book {
  return {
    id: overrides.id,
    seriesId: 'series-uuid',
    catalogBookId: overrides.catalogBookId,
    title: overrides.title,
    level: '3',
    audience: 'Primary',
    totalUnits: 9,
    type: overrides.type,
    colorScheme: {
      primary: '#000',
      accent: '#111',
      badgeBg: '#eee',
      badgeText: '#000',
    },
    pageSpreads: [],
  }
}

test('studentBookDisplayTitle strips Student Book suffix', () => {
  assert.equal(
    studentBookDisplayTitle('Big English 3 Student Book'),
    'Big English 3',
  )
  assert.equal(studentBookDisplayTitle('Beehive 1'), 'Beehive 1')
})

test('teacher dropdown excludes Workbooks', () => {
  const books = [
    bookStub({
      id: 'sb',
      title: 'Big English 3 Student Book',
      type: 'Student Book',
      catalogBookId: 'big_english_3_sb',
    }),
    bookStub({
      id: 'wb',
      title: 'Big English 3 Workbook',
      type: 'Workbook',
      catalogBookId: 'big_english_3_wb',
    }),
  ]
  const filtered = filterStudentBooksForTeacherDropdown(books)
  assert.equal(filtered.length, 1)
  assert.equal(filtered[0]?.id, 'sb')
  assert.equal(isStudentBook(books[1]!), false)
})

test('mapped BE3 U8 opener resolves companion; unmapped pages do not', () => {
  const mapped = resolveCompanionForSbPages({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookPrintedPages: [128, 129],
  })
  assert.ok(mapped)
  assert.equal(mapped?.relationshipId, 'be3_sb_wb_rel_u08_opener_sb128-129_wb104-105')
  assert.deepEqual(mapped?.workbookPrintedPages, [104, 105])

  const unmapped = resolveCompanionForSbPages({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookPrintedPages: [140],
  })
  assert.equal(unmapped, null)
})

test('lesson anchor stays on frozen SB pages during Workbook view', () => {
  assert.deepEqual(
    lessonAnchorPrintedPages({
      pdfViewMode: 'workbook',
      sbVisiblePrintedPages: [104, 105],
      frozenSbPrintedPages: [128, 129],
    }),
    [128, 129],
  )
  assert.deepEqual(
    lessonAnchorPrintedPages({
      pdfViewMode: 'student_book',
      sbVisiblePrintedPages: [128, 129],
      frozenSbPrintedPages: null,
    }),
    [128, 129],
  )
})
