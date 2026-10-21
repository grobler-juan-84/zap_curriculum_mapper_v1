/**
 * Focused D021 Student Book–first UI helper tests.
 * Run: npx tsx --test scripts/tests/chalkieStudentBookUi.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  enterWorkbookPdfView,
  filterStudentBooksForTeacherDropdown,
  isStudentBook,
  lessonAnchorPrintedPages,
  resolveCompanionForSbPages,
  resolveViewerPdfPagesForPrinted,
  restoreStudentBookPdfView,
  shouldApplyVisiblePagesFromPdf,
  studentBookDisplayTitle,
} from '../../app/src/features/chalkie/chalkieStudentBookUi.ts'
import type { Book } from '../../app/src/types/curriculum.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const BE3_SB_PATH = path.join(ROOT, 'data/phase1/big_english_3_sb/canonical/v1.json')
const BE3_WB_PATH = path.join(ROOT, 'data/phase1/big_english_3_wb/canonical/v1.json')

function sourcePagesFromCanonical(filePath: string): Array<{
  printedPage: number | null
  pdfPage: number | null
}> {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8')) as {
    pages?: Array<{ printed_page?: unknown; pdf_page?: unknown }>
  }
  return (raw.pages ?? []).map((page) => ({
    printedPage: typeof page.printed_page === 'number' ? page.printed_page : null,
    pdfPage: typeof page.pdf_page === 'number' ? page.pdf_page : null,
  }))
}

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

test('SB 128–129 → Workbook → Student Book restores full spread + companion', () => {
  const sbSpread = [128, 129]
  const entered = enterWorkbookPdfView(sbSpread)
  assert.equal(entered.pdfViewMode, 'workbook')
  assert.deepEqual(entered.frozenSbPrintedPages, [128, 129])

  // Workbook viewer / live pages must not replace lesson identity.
  const anchorWhileWorkbook = lessonAnchorPrintedPages({
    pdfViewMode: entered.pdfViewMode,
    sbVisiblePrintedPages: [104, 105],
    frozenSbPrintedPages: entered.frozenSbPrintedPages,
  })
  assert.deepEqual(anchorWhileWorkbook, [128, 129])
  const companionWhileWorkbook = resolveCompanionForSbPages({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookPrintedPages: anchorWhileWorkbook,
  })
  assert.ok(companionWhileWorkbook)
  assert.deepEqual(companionWhileWorkbook?.workbookPrintedPages, [104, 105])

  const restored = restoreStudentBookPdfView({
    frozenSbPrintedPages: entered.frozenSbPrintedPages,
    // Simulate corrupted live pages from Workbook / one-page PDF report.
    sbVisiblePrintedPages: [128],
  })
  assert.equal(restored.pdfViewMode, 'student_book')
  assert.equal(restored.frozenSbPrintedPages, null)
  assert.deepEqual(restored.sbVisiblePrintedPages, [128, 129])
  assert.deepEqual(restored.pendingRestorePrintedPages, [128, 129])

  // Incomplete PDF report must not wipe the restored spread / companion.
  assert.equal(
    shouldApplyVisiblePagesFromPdf({
      pendingRestorePrintedPages: restored.pendingRestorePrintedPages,
      reportedPages: [128],
    }),
    false,
  )

  const companionAfterRestore = resolveCompanionForSbPages({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookPrintedPages: restored.sbVisiblePrintedPages,
  })
  assert.ok(companionAfterRestore)
  assert.equal(
    companionAfterRestore?.relationshipId,
    'be3_sb_wb_rel_u08_opener_sb128-129_wb104-105',
  )
  assert.deepEqual(companionAfterRestore?.workbookPrintedPages, [104, 105])

  // Full spread confirmation clears the restore guard.
  assert.equal(
    shouldApplyVisiblePagesFromPdf({
      pendingRestorePrintedPages: restored.pendingRestorePrintedPages,
      reportedPages: [128, 129],
    }),
    true,
  )
})

test('BE3 U8 opener resolves verified pdf_page targets for SB and WB (not printed-as-pdf)', () => {
  assert.ok(fs.existsSync(BE3_SB_PATH), 'BE3 SB canonical required')
  assert.ok(fs.existsSync(BE3_WB_PATH), 'BE3 WB canonical required')

  const sbPages = sourcePagesFromCanonical(BE3_SB_PATH)
  const wbPages = sourcePagesFromCanonical(BE3_WB_PATH)

  const sbPrinted = [128, 129]
  const wbPrinted = [104, 105]

  const sbPdfPages = resolveViewerPdfPagesForPrinted(sbPages, sbPrinted)
  const wbPdfPages = resolveViewerPdfPagesForPrinted(wbPages, wbPrinted)

  // Verified Phase 1 source values (printed ≠ pdf for SB front-matter offset).
  assert.deepEqual(sbPdfPages, [126, 127])
  assert.deepEqual(wbPdfPages, [104, 105])

  // Must not silently treat printed numbers as PDF indices for SB.
  assert.notDeepEqual(sbPdfPages, sbPrinted)

  const companion = resolveCompanionForSbPages({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookPrintedPages: sbPrinted,
  })
  assert.ok(companion)
  assert.deepEqual(companion?.workbookPrintedPages, wbPrinted)

  // Full round trip: SB pdf targets → WB pdf targets → restored SB pdf targets.
  const entered = enterWorkbookPdfView(sbPrinted)
  const restored = restoreStudentBookPdfView({
    frozenSbPrintedPages: entered.frozenSbPrintedPages,
    sbVisiblePrintedPages: [128],
  })
  assert.deepEqual(
    resolveViewerPdfPagesForPrinted(sbPages, restored.pendingRestorePrintedPages),
    [126, 127],
  )
  assert.deepEqual(
    resolveViewerPdfPagesForPrinted(wbPages, companion!.workbookPrintedPages),
    [104, 105],
  )
})

test('exact pdf_page resolver returns null when printed pages are missing from source', () => {
  assert.equal(
    resolveViewerPdfPagesForPrinted(
      [{ printedPage: 128, pdfPage: 126 }],
      [128, 129],
    ),
    null,
  )
  assert.equal(
    resolveViewerPdfPagesForPrinted(
      [{ printedPage: 128, pdfPage: null }],
      [128],
    ),
    null,
  )
})
