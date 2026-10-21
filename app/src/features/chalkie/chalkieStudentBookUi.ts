/**
 * Teacher-facing Student Book–first helpers for Chalkie Workspace (D021).
 * Display/filter only — does not invent SB→WB companions.
 */

import type { Book } from '../../types/curriculum'
import { exactPdfPagesForPrinted } from '../validation/pdfPageMap'
import {
  resolveVerifiedSbWbCompanion,
  type VerifiedSbWbCompanion,
} from './resolveVerifiedSbWbCompanion'

export type SourcePagePdfRef = {
  printedPage?: number | null
  pdfPage?: number | null
}

/**
 * Resolve the physical PDF indices the viewer must render for a printed-page
 * spread. Uses exact source `pdf_page` only — never treats printed as PDF index.
 */
export function resolveViewerPdfPagesForPrinted(
  sourcePages: SourcePagePdfRef[],
  printedPages: number[],
): number[] | null {
  return exactPdfPagesForPrinted(sourcePages, printedPages)
}

/** True when the catalog book is a Student Book (not Workbook / TG). */
export function isStudentBook(book: Book): boolean {
  if (book.type === 'Student Book') return true
  if (book.type === 'Workbook' || book.type === "Teacher's Guide") return false
  return /_sb$/i.test(book.catalogBookId ?? '')
}

/**
 * Teacher-facing dropdown label: `Big English 3 Student Book` → `Big English 3`.
 * Leaves other titles unchanged when the suffix is absent.
 */
export function studentBookDisplayTitle(title: string): string {
  const trimmed = title.trim()
  const withoutSb = trimmed.replace(/\s+Student Book\s*$/i, '').trim()
  return withoutSb || trimmed
}

/** Books shown in the Chalkie top dropdown (Student Books only). */
export function filterStudentBooksForTeacherDropdown(books: Book[]): Book[] {
  return books.filter(isStudentBook)
}

/**
 * Resolve a verified companion for the current SB printed pages.
 * Curated mappings only require catalog id + exact SB pages (no heuristics).
 */
export function resolveCompanionForSbPages(input: {
  studentBookCatalogId: string | null | undefined
  studentBookPrintedPages: number[]
  studentBookCanonical?: Record<string, unknown> | null
}): VerifiedSbWbCompanion | null {
  const { companion } = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: input.studentBookCatalogId,
    studentBookCanonical: input.studentBookCanonical ?? null,
    studentBookPrintedPages: input.studentBookPrintedPages,
  })
  return companion
}

/**
 * SB pages that anchor lesson prep / handoff while the PDF may show Workbook.
 * When Workbook view is active, keep the frozen SB pages — never swap identity to WB.
 */
export function lessonAnchorPrintedPages(input: {
  pdfViewMode: 'student_book' | 'workbook'
  sbVisiblePrintedPages: number[]
  frozenSbPrintedPages: number[] | null
}): number[] {
  if (input.pdfViewMode === 'workbook' && input.frozenSbPrintedPages?.length) {
    return input.frozenSbPrintedPages
  }
  return input.sbVisiblePrintedPages
}

function normalizePrintedPages(pages: number[]): number[] {
  return [...new Set(pages.filter((n) => Number.isFinite(n)))].sort((a, b) => a - b)
}

function printedPagesEqual(a: number[], b: number[]): boolean {
  const left = normalizePrintedPages(a)
  const right = normalizePrintedPages(b)
  if (left.length !== right.length) return false
  return left.every((page, index) => page === right[index])
}

export type PdfSourceViewMode = 'student_book' | 'workbook'

/** Enter Workbook PDF view: freeze the exact SB spread for restore + lesson identity. */
export function enterWorkbookPdfView(sbPrintedPages: number[]): {
  pdfViewMode: 'workbook'
  frozenSbPrintedPages: number[]
} {
  return {
    pdfViewMode: 'workbook',
    frozenSbPrintedPages: normalizePrintedPages(sbPrintedPages),
  }
}

/**
 * Leave Workbook PDF view: restore the saved SB spread, never derive pages from
 * the Workbook viewer or a one-page PDF report.
 */
export function restoreStudentBookPdfView(input: {
  frozenSbPrintedPages: number[] | null
  sbVisiblePrintedPages: number[]
}): {
  pdfViewMode: 'student_book'
  frozenSbPrintedPages: null
  sbVisiblePrintedPages: number[]
  pendingRestorePrintedPages: number[]
} {
  const restored = normalizePrintedPages(
    input.frozenSbPrintedPages?.length
      ? input.frozenSbPrintedPages
      : input.sbVisiblePrintedPages,
  )
  return {
    pdfViewMode: 'student_book',
    frozenSbPrintedPages: null,
    sbVisiblePrintedPages: restored,
    pendingRestorePrintedPages: restored,
  }
}

/**
 * While a Student Book restore is pending, ignore incomplete PDF visible-page
 * reports (e.g. only p.128) so the companion toggle / WB summary stay intact.
 * Accept once the PDF reports the full restored spread.
 */
export function shouldApplyVisiblePagesFromPdf(input: {
  pendingRestorePrintedPages: number[] | null
  reportedPages: number[]
}): boolean {
  const pending = input.pendingRestorePrintedPages
  if (!pending?.length) return true
  return printedPagesEqual(pending, input.reportedPages)
}
