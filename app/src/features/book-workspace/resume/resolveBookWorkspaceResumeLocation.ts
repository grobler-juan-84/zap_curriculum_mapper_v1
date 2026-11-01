/**
 * Resolve Book Workspace resume location with explicit-query precedence.
 * Never advances to a next lesson. Never treats resume as completion.
 */

import type { Book, CurriculumSeries } from '../../../types/curriculum'
import {
  findLessonAnchorForPrintedPage,
  listLessonAnchorsForUnit,
} from '../../chalkie/chalkieLessonNavigation'
import {
  buildLessonKeyFromPrintedPages,
  clearBookWorkspaceResumeState,
  parseLessonKeyPrintedPages,
  readBookWorkspaceLastActiveBook,
  readBookWorkspaceLastActiveBookForSeries,
  readBookWorkspaceResumeState,
  type BookWorkspaceResumeStorageDriver,
} from './bookWorkspaceResumeStorage'
import type {
  BookWorkspaceResumeState,
  ResolvedBookWorkspaceResumeLocation,
} from './bookWorkspaceResumeTypes'

function isStudentBook(book: Book): boolean {
  if (book.type === 'Student Book') return true
  if (book.type === 'Workbook' || book.type === "Teacher's Guide") return false
  return /_sb$/i.test(book.catalogBookId ?? '')
}

function findStudentBookInCatalog(
  seriesList: readonly CurriculumSeries[],
  catalogBookId: string,
): { series: CurriculumSeries; book: Book } | null {
  for (const series of seriesList) {
    const book = series.books.find((entry) => entry.catalogBookId === catalogBookId)
    if (book && isStudentBook(book)) return { series, book }
  }
  return null
}

function findStudentBookByUuid(
  seriesList: readonly CurriculumSeries[],
  bookId: string,
): { series: CurriculumSeries; book: Book } | null {
  for (const series of seriesList) {
    const book = series.books.find((entry) => entry.id === bookId)
    if (book && isStudentBook(book)) return { series, book }
  }
  return null
}

function firstStudentBook(
  seriesList: readonly CurriculumSeries[],
): { series: CurriculumSeries; book: Book } | null {
  for (const series of seriesList) {
    const book = series.books.find((entry) => isStudentBook(entry))
    if (book) return { series, book }
  }
  return null
}

/**
 * When a Workbook (or other non-SB) is selected, prefer the sibling Student Book
 * in the same series/level. Workbook never owns resume identity.
 */
function findPrimaryStudentBookForSelection(
  seriesList: readonly CurriculumSeries[],
  selected: Book,
): { series: CurriculumSeries; book: Book } | null {
  const asStudent = findStudentBookByUuid(seriesList, selected.id)
  if (asStudent) return asStudent
  if (selected.catalogBookId) {
    const byCatalog = findStudentBookInCatalog(seriesList, selected.catalogBookId)
    if (byCatalog) return byCatalog
  }

  // Workbook companion → same-series Student Book with matching level / paired catalog id.
  for (const series of seriesList) {
    const inSeries = series.books.some((entry) => entry.id === selected.id)
    if (!inSeries) continue

    const catalog = selected.catalogBookId?.trim() ?? ''
    const pairedCatalog = catalog.replace(/_wb$/i, '_sb')
    if (pairedCatalog && pairedCatalog !== catalog) {
      const paired = series.books.find(
        (entry) => isStudentBook(entry) && entry.catalogBookId === pairedCatalog,
      )
      if (paired) return { series, book: paired }
    }

    const sameLevel = series.books.find(
      (entry) =>
        isStudentBook(entry) &&
        entry.level === selected.level &&
        entry.id !== selected.id,
    )
    if (sameLevel) return { series, book: sameLevel }
  }

  return null
}

function normalizeUnitNumber(value: string | number | null | undefined): number | null {
  if (value == null || value === '') return null
  const n =
    typeof value === 'number' ? value : Number.parseInt(String(value).trim(), 10)
  if (!Number.isFinite(n) || n < 1) return null
  return Math.floor(n)
}

function pagesWithinKnownUnitAnchors(input: {
  catalogBookId: string
  unitNumber: number
  printedPages: readonly number[]
}): boolean {
  const anchors = listLessonAnchorsForUnit({
    studentBookCatalogId: input.catalogBookId,
    unitNumber: input.unitNumber,
  })
  if (!anchors.length) {
    // No curated map for this unit — accept non-empty page lists as soft location.
    return input.printedPages.length > 0
  }
  if (!input.printedPages.length) return true
  return input.printedPages.every((page) =>
    anchors.some((anchor) => anchor.studentBookPrintedPages.includes(page)),
  )
}

function resolvePagesForUnit(input: {
  catalogBookId: string
  unitNumber: number
  preferredPages: readonly number[]
  lessonKeyOrAnchor: string | null
}): { pages: number[]; lessonKeyOrAnchor: string | null } {
  const fromKey = parseLessonKeyPrintedPages(input.lessonKeyOrAnchor)
  const preferred = fromKey?.length ? fromKey : [...input.preferredPages]
  const anchors = listLessonAnchorsForUnit({
    studentBookCatalogId: input.catalogBookId,
    unitNumber: input.unitNumber,
  })

  if (preferred.length) {
    if (!anchors.length) {
      return {
        pages: preferred,
        lessonKeyOrAnchor:
          input.lessonKeyOrAnchor ?? buildLessonKeyFromPrintedPages(preferred),
      }
    }
    const match = anchors.find((anchor) => {
      const left = [...anchor.studentBookPrintedPages]
      return (
        left.length === preferred.length &&
        left.every((page, index) => page === preferred[index])
      )
    })
    if (match) {
      const pages = [...match.studentBookPrintedPages]
      return {
        pages,
        lessonKeyOrAnchor: buildLessonKeyFromPrintedPages(pages),
      }
    }
    const containing = findLessonAnchorForPrintedPage({
      studentBookCatalogId: input.catalogBookId,
      unitNumber: input.unitNumber,
      printedPage: preferred[0]!,
    })
    if (containing) {
      const pages = [...containing.studentBookPrintedPages]
      return {
        pages,
        lessonKeyOrAnchor: buildLessonKeyFromPrintedPages(pages),
      }
    }
  }

  if (anchors[0]) {
    const pages = [...anchors[0].studentBookPrintedPages]
    return {
      pages,
      lessonKeyOrAnchor: buildLessonKeyFromPrintedPages(pages),
    }
  }

  return { pages: [], lessonKeyOrAnchor: null }
}

/**
 * Validate a saved record against the live catalog. Clears the record when stale.
 */
export function validateSavedBookWorkspaceResume(input: {
  userId: string | null | undefined
  saved: BookWorkspaceResumeState | null
  seriesList: readonly CurriculumSeries[]
  knownUnitNumbers?: readonly number[] | null
  storage?: BookWorkspaceResumeStorageDriver | null
}): BookWorkspaceResumeState | null {
  const saved = input.saved
  if (!saved) return null

  const match = findStudentBookInCatalog(input.seriesList, saved.catalogBookId)
  if (!match || match.book.id !== saved.bookId || match.series.id !== saved.seriesId) {
    clearBookWorkspaceResumeState({
      userId: input.userId,
      catalogBookId: saved.catalogBookId,
      storage: input.storage,
    })
    return null
  }

  if (
    input.knownUnitNumbers &&
    input.knownUnitNumbers.length > 0 &&
    !input.knownUnitNumbers.includes(saved.unitNumber)
  ) {
    clearBookWorkspaceResumeState({
      userId: input.userId,
      catalogBookId: saved.catalogBookId,
      storage: input.storage,
    })
    return null
  }

  if (
    saved.printedPages.length > 0 &&
    !pagesWithinKnownUnitAnchors({
      catalogBookId: saved.catalogBookId,
      unitNumber: saved.unitNumber,
      printedPages: saved.printedPages,
    })
  ) {
    // Keep unit continuity; drop invalid page specificity by rewriting through resolver.
    return {
      ...saved,
      printedPages: [],
      lessonKeyOrAnchor: null,
    }
  }

  return saved
}

export function resolveBookWorkspaceResumeLocation(input: {
  userId: string | null | undefined
  seriesList: readonly CurriculumSeries[]
  selectedBook?: Book | null
  selectedSeriesId?: string | null
  explicitUnitQuery?: string | number | null
  knownUnitNumbers?: readonly number[] | null
  storage?: BookWorkspaceResumeStorageDriver | null
}): ResolvedBookWorkspaceResumeLocation | null {
  const seriesList = input.seriesList
  if (!seriesList.length) return null

  let bookMatch = input.selectedBook
    ? findPrimaryStudentBookForSelection(seriesList, input.selectedBook)
    : null

  if (!bookMatch) {
    const lastActive = readBookWorkspaceLastActiveBook({
      userId: input.userId,
      storage: input.storage,
    })
    if (lastActive) {
      bookMatch =
        findStudentBookInCatalog(seriesList, lastActive.catalogBookId) ??
        findStudentBookByUuid(seriesList, lastActive.bookId)
    }
  }

  if (!bookMatch) {
    bookMatch = firstStudentBook(seriesList)
  }

  if (!bookMatch) return null

  const { series, book } = bookMatch
  const catalogBookId = book.catalogBookId?.trim()
  if (!catalogBookId) return null

  const knownUnits = input.knownUnitNumbers ?? null
  const firstUnit =
    knownUnits && knownUnits.length > 0
      ? [...knownUnits].sort((a, b) => a - b)[0]!
      : 1

  const explicitUnit = normalizeUnitNumber(input.explicitUnitQuery)
  if (explicitUnit != null) {
    const unitNumber =
      knownUnits && knownUnits.length > 0 && !knownUnits.includes(explicitUnit)
        ? firstUnit
        : explicitUnit
    const pageResolution = resolvePagesForUnit({
      catalogBookId,
      unitNumber,
      preferredPages: [],
      lessonKeyOrAnchor: null,
    })
    return {
      seriesId: series.id,
      bookId: book.id,
      catalogBookId,
      unitNumber,
      lessonKeyOrAnchor: pageResolution.lessonKeyOrAnchor,
      printedPages: pageResolution.pages,
      source: 'explicit_query',
    }
  }

  const savedRaw = readBookWorkspaceResumeState({
    userId: input.userId,
    catalogBookId,
    storage: input.storage,
  })
  const saved = validateSavedBookWorkspaceResume({
    userId: input.userId,
    saved: savedRaw,
    seriesList,
    knownUnitNumbers: knownUnits,
    storage: input.storage,
  })

  if (saved) {
    const pageResolution = resolvePagesForUnit({
      catalogBookId,
      unitNumber: saved.unitNumber,
      preferredPages: saved.printedPages,
      lessonKeyOrAnchor: saved.lessonKeyOrAnchor,
    })
    return {
      seriesId: series.id,
      bookId: book.id,
      catalogBookId,
      unitNumber: saved.unitNumber,
      lessonKeyOrAnchor: pageResolution.lessonKeyOrAnchor,
      printedPages: pageResolution.pages,
      source: 'saved',
    }
  }

  const pageResolution = resolvePagesForUnit({
    catalogBookId,
    unitNumber: firstUnit,
    preferredPages: [],
    lessonKeyOrAnchor: null,
  })
  return {
    seriesId: series.id,
    bookId: book.id,
    catalogBookId,
    unitNumber: firstUnit,
    lessonKeyOrAnchor: pageResolution.lessonKeyOrAnchor,
    printedPages: pageResolution.pages,
    source: 'default_unit_1',
  }
}

export function formatBookWorkspaceResumeHint(
  state: BookWorkspaceResumeState | null,
): string | null {
  if (!state) return null
  const pages = state.printedPages
  const pageLabel =
    pages.length === 0
      ? null
      : pages.length === 1
        ? `p.${pages[0]}`
        : `pp.${pages[0]}–${pages[pages.length - 1]}`
  return pageLabel
    ? `Resume: Unit ${state.unitNumber} · ${pageLabel}`
    : `Resume: Unit ${state.unitNumber}`
}

export function resolvePrimaryStudentBookForWorkspaceEntry(input: {
  userId: string | null | undefined
  seriesList: readonly CurriculumSeries[]
  currentBook?: Book | null
  storage?: BookWorkspaceResumeStorageDriver | null
}): { series: CurriculumSeries; book: Book } | null {
  if (input.currentBook && isStudentBook(input.currentBook)) {
    const match = findStudentBookByUuid(input.seriesList, input.currentBook.id)
    if (match) return match
  }

  const lastActive = readBookWorkspaceLastActiveBook({
    userId: input.userId,
    storage: input.storage,
  })
  if (lastActive) {
    const byCatalog = findStudentBookInCatalog(
      input.seriesList,
      lastActive.catalogBookId,
    )
    if (byCatalog) return byCatalog
  }

  if (input.currentBook) {
    const paired = findPrimaryStudentBookForSelection(
      input.seriesList,
      input.currentBook,
    )
    if (paired) return paired
  }

  return firstStudentBook(input.seriesList)
}

/**
 * Valid last-active workspace for post-login / `/app` landing.
 * Returns null when missing or catalog-invalid (caller falls through to CL silently).
 */
export function resolveValidLastActiveWorkspaceEntry(input: {
  userId: string | null | undefined
  seriesList: readonly CurriculumSeries[]
  storage?: BookWorkspaceResumeStorageDriver | null
}): { series: CurriculumSeries; book: Book } | null {
  const lastActive = readBookWorkspaceLastActiveBook({
    userId: input.userId,
    storage: input.storage,
  })
  if (!lastActive) return null

  const byCatalog = findStudentBookInCatalog(
    input.seriesList,
    lastActive.catalogBookId,
  )
  if (byCatalog) return byCatalog

  const byUuid = findStudentBookByUuid(input.seriesList, lastActive.bookId)
  if (byUuid) return byUuid

  return null
}

/**
 * Last primary Student Book for a series (CL → workspace handoff).
 * Invalid/stale pointers return null so the in-workspace chooser can open.
 */
export function resolveLastStudentBookForSeries(input: {
  userId: string | null | undefined
  seriesId: string | null | undefined
  seriesList: readonly CurriculumSeries[]
  storage?: BookWorkspaceResumeStorageDriver | null
}): { series: CurriculumSeries; book: Book } | null {
  const seriesId = input.seriesId?.trim()
  if (!seriesId) return null

  const pointer = readBookWorkspaceLastActiveBookForSeries({
    userId: input.userId,
    seriesId,
    storage: input.storage,
  })
  if (!pointer) return null

  const series = input.seriesList.find((entry) => entry.id === seriesId)
  if (!series) return null

  const byCatalog = series.books.find(
    (entry) =>
      isStudentBook(entry) && entry.catalogBookId === pointer.catalogBookId,
  )
  if (byCatalog) return { series, book: byCatalog }

  const byUuid = series.books.find(
    (entry) => isStudentBook(entry) && entry.id === pointer.bookId,
  )
  if (byUuid) return { series, book: byUuid }

  return null
}
