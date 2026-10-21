/**
 * Teacher-facing Student Book–first helpers for Chalkie Workspace (D021).
 * Display/filter only — does not invent SB→WB companions.
 */

import type { Book } from '../../types/curriculum'
import {
  resolveVerifiedSbWbCompanion,
  type VerifiedSbWbCompanion,
} from './resolveVerifiedSbWbCompanion'

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
