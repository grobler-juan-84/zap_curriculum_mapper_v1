/**
 * Browser-local Book Workspace resume persistence (validation v1).
 * Namespaced by authenticated user ID + primary Student Book catalog ID.
 * No database / Supabase migration in this phase.
 */

import {
  BOOK_WORKSPACE_RESUME_VERSION,
  type BookWorkspaceLastActiveBook,
  type BookWorkspaceResumeState,
} from './bookWorkspaceResumeTypes'

const STORAGE_PREFIX = 'zap.bookWorkspaceResume.v1'

export type BookWorkspaceResumeStorageDriver = {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

function defaultDriver(): BookWorkspaceResumeStorageDriver | null {
  if (typeof window === 'undefined' || !window.localStorage) return null
  return window.localStorage
}

export function bookResumeStorageKey(userId: string, catalogBookId: string): string {
  return `${STORAGE_PREFIX}.user:${userId}.book:${catalogBookId}`
}

export function lastActiveBookStorageKey(userId: string): string {
  return `${STORAGE_PREFIX}.user:${userId}.lastActiveBook`
}

export function lastActiveBookForSeriesStorageKey(
  userId: string,
  seriesId: string,
): string {
  return `${STORAGE_PREFIX}.user:${userId}.series:${seriesId}.lastActiveBook`
}

function normalizePages(pages: unknown): number[] | null {
  if (!Array.isArray(pages)) return null
  const out = [
    ...new Set(
      pages
        .map((page) => (typeof page === 'number' ? page : Number(page)))
        .filter((page) => Number.isFinite(page))
        .map((page) => Math.floor(page)),
    ),
  ].sort((a, b) => a - b)
  return out
}

export function buildLessonKeyFromPrintedPages(
  pages: readonly number[],
): string | null {
  const normalized = normalizePages(pages)
  if (!normalized?.length) return null
  return `pages:${normalized.join('-')}`
}

export function parseLessonKeyPrintedPages(
  lessonKeyOrAnchor: string | null | undefined,
): number[] | null {
  if (!lessonKeyOrAnchor || typeof lessonKeyOrAnchor !== 'string') return null
  const match = /^pages:(\d+(?:-\d+)*)$/.exec(lessonKeyOrAnchor.trim())
  if (!match) return null
  return normalizePages(match[1].split('-').map((part) => Number(part)))
}

export function parseBookWorkspaceResumeState(
  raw: unknown,
): BookWorkspaceResumeState | null {
  if (!raw || typeof raw !== 'object') return null
  const record = raw as Record<string, unknown>
  if (record.version !== BOOK_WORKSPACE_RESUME_VERSION) return null
  const seriesId = typeof record.seriesId === 'string' ? record.seriesId.trim() : ''
  const bookId = typeof record.bookId === 'string' ? record.bookId.trim() : ''
  const catalogBookId =
    typeof record.catalogBookId === 'string' ? record.catalogBookId.trim() : ''
  const unitNumber =
    typeof record.unitNumber === 'number'
      ? record.unitNumber
      : typeof record.unitNumber === 'string'
        ? Number.parseInt(record.unitNumber, 10)
        : NaN
  const printedPages = normalizePages(record.printedPages)
  const updatedAt =
    typeof record.updatedAt === 'string' ? record.updatedAt.trim() : ''
  const lessonKeyOrAnchor =
    record.lessonKeyOrAnchor == null
      ? null
      : typeof record.lessonKeyOrAnchor === 'string'
        ? record.lessonKeyOrAnchor.trim() || null
        : null

  if (!seriesId || !bookId || !catalogBookId) return null
  if (!Number.isFinite(unitNumber) || unitNumber < 1) return null
  if (!printedPages) return null
  if (!updatedAt) return null

  return {
    version: BOOK_WORKSPACE_RESUME_VERSION,
    seriesId,
    bookId,
    catalogBookId,
    unitNumber: Math.floor(unitNumber),
    lessonKeyOrAnchor,
    printedPages,
    updatedAt,
  }
}

export function parseBookWorkspaceLastActiveBook(
  raw: unknown,
): BookWorkspaceLastActiveBook | null {
  if (!raw || typeof raw !== 'object') return null
  const record = raw as Record<string, unknown>
  if (record.version !== BOOK_WORKSPACE_RESUME_VERSION) return null
  const seriesId = typeof record.seriesId === 'string' ? record.seriesId.trim() : ''
  const bookId = typeof record.bookId === 'string' ? record.bookId.trim() : ''
  const catalogBookId =
    typeof record.catalogBookId === 'string' ? record.catalogBookId.trim() : ''
  const updatedAt =
    typeof record.updatedAt === 'string' ? record.updatedAt.trim() : ''
  if (!seriesId || !bookId || !catalogBookId || !updatedAt) return null
  return {
    version: BOOK_WORKSPACE_RESUME_VERSION,
    seriesId,
    bookId,
    catalogBookId,
    updatedAt,
  }
}

export function readBookWorkspaceResumeState(input: {
  userId: string | null | undefined
  catalogBookId: string | null | undefined
  storage?: BookWorkspaceResumeStorageDriver | null
}): BookWorkspaceResumeState | null {
  const userId = input.userId?.trim()
  const catalogBookId = input.catalogBookId?.trim()
  if (!userId || !catalogBookId) return null
  const storage = input.storage === undefined ? defaultDriver() : input.storage
  if (!storage) return null
  const key = bookResumeStorageKey(userId, catalogBookId)
  try {
    const raw = storage.getItem(key)
    if (!raw) return null
    const parsed = parseBookWorkspaceResumeState(JSON.parse(raw))
    if (!parsed || parsed.catalogBookId !== catalogBookId) {
      storage.removeItem(key)
      return null
    }
    return parsed
  } catch {
    try {
      storage.removeItem(key)
    } catch {
      /* ignore */
    }
    return null
  }
}

export function writeBookWorkspaceResumeState(input: {
  userId: string | null | undefined
  state: BookWorkspaceResumeState
  storage?: BookWorkspaceResumeStorageDriver | null
}): boolean {
  const userId = input.userId?.trim()
  if (!userId) return false
  if (input.state.version !== BOOK_WORKSPACE_RESUME_VERSION) return false
  const storage = input.storage === undefined ? defaultDriver() : input.storage
  if (!storage) return false
  const key = bookResumeStorageKey(userId, input.state.catalogBookId)
  try {
    storage.setItem(key, JSON.stringify(input.state))
    return true
  } catch {
    return false
  }
}

export function clearBookWorkspaceResumeState(input: {
  userId: string | null | undefined
  catalogBookId: string | null | undefined
  storage?: BookWorkspaceResumeStorageDriver | null
}): void {
  const userId = input.userId?.trim()
  const catalogBookId = input.catalogBookId?.trim()
  if (!userId || !catalogBookId) return
  const storage = input.storage === undefined ? defaultDriver() : input.storage
  if (!storage) return
  try {
    storage.removeItem(bookResumeStorageKey(userId, catalogBookId))
  } catch {
    /* ignore */
  }
}

export function readBookWorkspaceLastActiveBook(input: {
  userId: string | null | undefined
  storage?: BookWorkspaceResumeStorageDriver | null
}): BookWorkspaceLastActiveBook | null {
  const userId = input.userId?.trim()
  if (!userId) return null
  const storage = input.storage === undefined ? defaultDriver() : input.storage
  if (!storage) return null
  const key = lastActiveBookStorageKey(userId)
  try {
    const raw = storage.getItem(key)
    if (!raw) return null
    const parsed = parseBookWorkspaceLastActiveBook(JSON.parse(raw))
    if (!parsed) {
      storage.removeItem(key)
      return null
    }
    return parsed
  } catch {
    try {
      storage.removeItem(key)
    } catch {
      /* ignore */
    }
    return null
  }
}

export function writeBookWorkspaceLastActiveBook(input: {
  userId: string | null | undefined
  state: BookWorkspaceLastActiveBook
  storage?: BookWorkspaceResumeStorageDriver | null
}): boolean {
  const userId = input.userId?.trim()
  if (!userId) return false
  const storage = input.storage === undefined ? defaultDriver() : input.storage
  if (!storage) return false
  try {
    storage.setItem(lastActiveBookStorageKey(userId), JSON.stringify(input.state))
    return true
  } catch {
    return false
  }
}

export function readBookWorkspaceLastActiveBookForSeries(input: {
  userId: string | null | undefined
  seriesId: string | null | undefined
  storage?: BookWorkspaceResumeStorageDriver | null
}): BookWorkspaceLastActiveBook | null {
  const userId = input.userId?.trim()
  const seriesId = input.seriesId?.trim()
  if (!userId || !seriesId) return null
  const storage = input.storage === undefined ? defaultDriver() : input.storage
  if (!storage) return null
  const key = lastActiveBookForSeriesStorageKey(userId, seriesId)
  try {
    const raw = storage.getItem(key)
    if (!raw) return null
    const parsed = parseBookWorkspaceLastActiveBook(JSON.parse(raw))
    if (!parsed || parsed.seriesId !== seriesId) {
      storage.removeItem(key)
      return null
    }
    return parsed
  } catch {
    try {
      storage.removeItem(key)
    } catch {
      /* ignore */
    }
    return null
  }
}

export function writeBookWorkspaceLastActiveBookForSeries(input: {
  userId: string | null | undefined
  state: BookWorkspaceLastActiveBook
  storage?: BookWorkspaceResumeStorageDriver | null
}): boolean {
  const userId = input.userId?.trim()
  const seriesId = input.state.seriesId?.trim()
  if (!userId || !seriesId) return false
  const storage = input.storage === undefined ? defaultDriver() : input.storage
  if (!storage) return false
  try {
    storage.setItem(
      lastActiveBookForSeriesStorageKey(userId, seriesId),
      JSON.stringify(input.state),
    )
    return true
  } catch {
    return false
  }
}

/**
 * Persist both login landing (global last-active) and per-series last book.
 */
export function writeBookWorkspaceActivePointers(input: {
  userId: string | null | undefined
  state: BookWorkspaceLastActiveBook
  storage?: BookWorkspaceResumeStorageDriver | null
}): boolean {
  const wroteGlobal = writeBookWorkspaceLastActiveBook(input)
  const wroteSeries = writeBookWorkspaceLastActiveBookForSeries(input)
  return wroteGlobal && wroteSeries
}

export function createBookWorkspaceResumeState(input: {
  seriesId: string
  bookId: string
  catalogBookId: string
  unitNumber: number
  printedPages: readonly number[]
  lessonKeyOrAnchor?: string | null
  updatedAt?: string
}): BookWorkspaceResumeState | null {
  const seriesId = input.seriesId.trim()
  const bookId = input.bookId.trim()
  const catalogBookId = input.catalogBookId.trim()
  const unitNumber = Math.floor(input.unitNumber)
  const printedPages = normalizePages(input.printedPages) ?? []
  if (!seriesId || !bookId || !catalogBookId) return null
  if (!Number.isFinite(unitNumber) || unitNumber < 1) return null
  const lessonKeyOrAnchor =
    input.lessonKeyOrAnchor === undefined
      ? buildLessonKeyFromPrintedPages(printedPages)
      : input.lessonKeyOrAnchor
  return {
    version: BOOK_WORKSPACE_RESUME_VERSION,
    seriesId,
    bookId,
    catalogBookId,
    unitNumber,
    lessonKeyOrAnchor,
    printedPages,
    updatedAt: input.updatedAt ?? new Date().toISOString(),
  }
}
