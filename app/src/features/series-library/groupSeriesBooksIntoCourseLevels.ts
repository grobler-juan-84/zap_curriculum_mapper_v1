/**
 * Group catalog physical books into teachable course-level cards.
 * Student Book is primary; Workbook is optional companion material.
 * Fail closed on duplicate Student Books or malformed level identity.
 */

import type { Book } from '../../types/curriculum'

export type CourseLevelMaterialRole = 'student_book' | 'workbook' | 'other'

export type CourseLevelCard = {
  /** Stable level identity within a series (e.g. `3`, `2a`). */
  levelKey: string
  /** Numeric sort key (integer levels first; letter suffixes as fractional offset). */
  levelSortValue: number
  /** Teacher-facing title, e.g. `Big English 3`. */
  displayTitle: string
  studentBook: Book
  workbook: Book | null
  /** Concise availability label without storage/catalog implementation detail. */
  materialsLabel: string
  /** Prefer Student Book cover; callers may still fall back when the asset is missing. */
  coverBook: Book
}

export type GroupSeriesBooksIntoCourseLevelsSuccess = {
  ok: true
  levels: CourseLevelCard[]
}

export type GroupSeriesBooksIntoCourseLevelsFailure = {
  ok: false
  error: string
}

export type GroupSeriesBooksIntoCourseLevelsResult =
  | GroupSeriesBooksIntoCourseLevelsSuccess
  | GroupSeriesBooksIntoCourseLevelsFailure

type ResolvedBookIdentity = {
  levelKey: string
  levelSortValue: number
  role: CourseLevelMaterialRole
}

function seriesDisplayBase(seriesName: string): string {
  return seriesName
    .replace(/\s+book\s+series$/i, '')
    .replace(/\s+series$/i, '')
    .trim()
}

function sortValueForLevelKey(levelKey: string): number | null {
  const match = /^(\d+)([a-z]?)$/i.exec(levelKey.trim())
  if (!match) return null
  const major = Number(match[1])
  if (!Number.isFinite(major)) return null
  const suffix = (match[2] ?? '').toLowerCase()
  const fraction = suffix ? (suffix.charCodeAt(0) - 96) / 100 : 0
  return major + fraction
}

function roleFromBookType(type: Book['type'] | undefined): CourseLevelMaterialRole {
  if (type === 'Workbook') return 'workbook'
  if (type === 'Student Book') return 'student_book'
  if (type === "Teacher's Guide") return 'other'
  return 'other'
}

/**
 * Resolve level + material role from catalog identity, corroborated by book type.
 * Returns null when identity is malformed or contradictory.
 */
export function resolveCourseLevelBookIdentity(
  book: Book,
): ResolvedBookIdentity | null {
  const catalogBookId = book.catalogBookId?.trim()
  if (!catalogBookId) return null

  const paired = /^(?:big_english|beehive)_(\d+[a-z]?)_(sb|wb)$/i.exec(catalogBookId)
  if (paired) {
    const levelKey = paired[1].toLowerCase()
    const levelSortValue = sortValueForLevelKey(levelKey)
    if (levelSortValue === null) return null
    const suffix = paired[2].toLowerCase()
    const role: CourseLevelMaterialRole =
      suffix === 'wb' ? 'workbook' : 'student_book'
    const typeRole = roleFromBookType(book.type)
    if (typeRole !== 'other' && typeRole !== role) return null
    return { levelKey, levelSortValue, role }
  }

  const reach = /^reach_higher_(\d+[a-z]?)$/i.exec(catalogBookId)
  if (reach) {
    const levelKey = reach[1].toLowerCase()
    const levelSortValue = sortValueForLevelKey(levelKey)
    if (levelSortValue === null) return null
    const typeRole = roleFromBookType(book.type)
    if (typeRole === 'workbook') {
      return { levelKey, levelSortValue, role: 'workbook' }
    }
    if (typeRole === 'other') return null
    return { levelKey, levelSortValue, role: 'student_book' }
  }

  const levelFromField = /^Level\s+(\d+[a-z]?)$/i.exec(book.level?.trim() ?? '')
  const audienceLevel = /^Level\s+(\d+[a-z]?)$/i.exec(book.audience?.trim() ?? '')
  const levelKey = (levelFromField?.[1] ?? audienceLevel?.[1] ?? '').toLowerCase()
  if (!levelKey) return null
  const levelSortValue = sortValueForLevelKey(levelKey)
  if (levelSortValue === null) return null

  const typeRole = roleFromBookType(book.type)
  if (typeRole === 'other') return null
  return { levelKey, levelSortValue, role: typeRole }
}

function materialsLabelFor(hasWorkbook: boolean): string {
  return hasWorkbook ? 'Student Book + Workbook' : 'Student Book'
}

/**
 * Group a series' physical catalog books into course-level teacher cards.
 * Books that cannot be identified are omitted. Duplicate Student Books or
 * duplicate Workbooks for the same level fail the whole grouping.
 */
export function groupSeriesBooksIntoCourseLevels(input: {
  seriesName: string
  books: readonly Book[]
}): GroupSeriesBooksIntoCourseLevelsResult {
  const baseName = seriesDisplayBase(input.seriesName)
  if (!baseName) {
    return { ok: false, error: 'Series name is missing or empty.' }
  }

  type Bucket = {
    levelKey: string
    levelSortValue: number
    studentBooks: Book[]
    workbooks: Book[]
  }

  const buckets = new Map<string, Bucket>()

  for (const book of input.books) {
    const identity = resolveCourseLevelBookIdentity(book)
    if (!identity) continue
    if (identity.role === 'other') continue

    let bucket = buckets.get(identity.levelKey)
    if (!bucket) {
      bucket = {
        levelKey: identity.levelKey,
        levelSortValue: identity.levelSortValue,
        studentBooks: [],
        workbooks: [],
      }
      buckets.set(identity.levelKey, bucket)
    }

    if (identity.role === 'student_book') {
      bucket.studentBooks.push(book)
    } else {
      bucket.workbooks.push(book)
    }
  }

  const levels: CourseLevelCard[] = []

  for (const bucket of buckets.values()) {
    if (bucket.studentBooks.length === 0) {
      // Workbook-only level is not a teachable entry card under D021.
      continue
    }
    if (bucket.studentBooks.length > 1) {
      return {
        ok: false,
        error: `Ambiguous Student Book identity for ${baseName} level ${bucket.levelKey}.`,
      }
    }
    if (bucket.workbooks.length > 1) {
      return {
        ok: false,
        error: `Ambiguous Workbook identity for ${baseName} level ${bucket.levelKey}.`,
      }
    }

    const studentBook = bucket.studentBooks[0]
    const workbook = bucket.workbooks[0] ?? null
    const displayLevel = bucket.levelKey.toUpperCase() === bucket.levelKey
      ? bucket.levelKey
      : bucket.levelKey.replace(/(\d+)([a-z])/i, (_, n: string, s: string) => `${n}${s.toLowerCase()}`)

    levels.push({
      levelKey: bucket.levelKey,
      levelSortValue: bucket.levelSortValue,
      displayTitle: `${baseName} ${displayLevel}`,
      studentBook,
      workbook,
      materialsLabel: materialsLabelFor(Boolean(workbook)),
      coverBook: studentBook,
    })
  }

  levels.sort((a, b) => {
    if (a.levelSortValue !== b.levelSortValue) {
      return a.levelSortValue - b.levelSortValue
    }
    return a.levelKey.localeCompare(b.levelKey)
  })

  return { ok: true, levels }
}
