/**
 * Course-level catalog grouping for /app/series.
 * Run: npx tsx --test scripts/tests/groupSeriesBooksIntoCourseLevels.test.ts
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import {
  groupSeriesBooksIntoCourseLevels,
  resolveCourseLevelBookIdentity,
} from '../../app/src/features/series-library/groupSeriesBooksIntoCourseLevels.ts'
import type { Book } from '../../app/src/types/curriculum.ts'

function book(partial: Partial<Book> & Pick<Book, 'id' | 'title' | 'catalogBookId' | 'type'>): Book {
  return {
    seriesId: 'series-big-english',
    level: partial.level ?? 'Level —',
    audience: partial.audience ?? 'Curriculum book',
    totalUnits: partial.totalUnits ?? 9,
    colorScheme: {
      primary: '#0284C7',
      accent: '#F59E0B',
      badgeBg: 'bg-sky-50',
      badgeText: 'text-sky-800',
    },
    pageSpreads: [],
    ...partial,
  }
}

function bigEnglishPair(level: number): Book[] {
  return [
    book({
      id: `sb-${level}`,
      title: `Big English ${level} Student Book`,
      catalogBookId: `big_english_${level}_sb`,
      type: 'Student Book',
      level: `Level ${level}`,
      audience: `Level ${level}`,
      coverPath: level === 3 ? 'books/big_english_3_sb/cover.png' : undefined,
    }),
    book({
      id: `wb-${level}`,
      title: `Big English ${level} Workbook`,
      catalogBookId: `big_english_${level}_wb`,
      type: 'Workbook',
      level: `Level ${level}`,
      audience: `Level ${level}`,
    }),
  ]
}

test('Big English 12 physical books group into six numeric levels', () => {
  const books = [1, 2, 3, 4, 5, 6].flatMap((level) => bigEnglishPair(level))
  // Shuffle to prove sort is not input-order dependent.
  books.reverse()

  const result = groupSeriesBooksIntoCourseLevels({
    seriesName: 'Big English',
    books,
  })

  assert.equal(result.ok, true)
  if (!result.ok) return

  assert.equal(result.levels.length, 6)
  assert.deepEqual(
    result.levels.map((level) => level.displayTitle),
    [
      'Big English 1',
      'Big English 2',
      'Big English 3',
      'Big English 4',
      'Big English 5',
      'Big English 6',
    ],
  )

  for (const level of result.levels) {
    assert.equal(level.studentBook.type, 'Student Book')
    assert.equal(level.workbook?.type, 'Workbook')
    assert.equal(level.materialsLabel, 'Student Book + Workbook')
    assert.equal(level.coverBook.id, level.studentBook.id)
    assert.match(level.studentBook.catalogBookId ?? '', /_sb$/)
    assert.match(level.workbook?.catalogBookId ?? '', /_wb$/)
  }
})

test('numeric level ordering is stable', () => {
  const books = [
    ...bigEnglishPair(6),
    ...bigEnglishPair(1),
    ...bigEnglishPair(3),
  ]
  const result = groupSeriesBooksIntoCourseLevels({
    seriesName: 'Big English Book Series',
    books,
  })
  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.deepEqual(
    result.levels.map((level) => level.levelKey),
    ['1', '3', '6'],
  )
  assert.equal(result.levels[0]?.displayTitle, 'Big English 1')
})

test('missing cover falls back honestly (no invented cover path)', () => {
  const result = groupSeriesBooksIntoCourseLevels({
    seriesName: 'Big English',
    books: [
      book({
        id: 'sb-4',
        title: 'Big English 4 Student Book',
        catalogBookId: 'big_english_4_sb',
        type: 'Student Book',
        level: 'Level 4',
      }),
    ],
  })
  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.equal(result.levels[0]?.coverBook.coverPath, undefined)
  assert.equal(result.levels[0]?.coverBook.coverImage, undefined)
})

test('missing Workbook remains Student Book only', () => {
  const result = groupSeriesBooksIntoCourseLevels({
    seriesName: 'Big English',
    books: [
      book({
        id: 'sb-2',
        title: 'Big English 2 Student Book',
        catalogBookId: 'big_english_2_sb',
        type: 'Student Book',
        level: 'Level 2',
      }),
    ],
  })
  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.equal(result.levels.length, 1)
  assert.equal(result.levels[0]?.workbook, null)
  assert.equal(result.levels[0]?.materialsLabel, 'Student Book')
})

test('ambiguous duplicate Student Books fail closed', () => {
  const result = groupSeriesBooksIntoCourseLevels({
    seriesName: 'Big English',
    books: [
      book({
        id: 'sb-3a',
        title: 'Big English 3 Student Book A',
        catalogBookId: 'big_english_3_sb',
        type: 'Student Book',
        level: 'Level 3',
      }),
      book({
        id: 'sb-3b',
        title: 'Big English 3 Student Book B',
        catalogBookId: 'big_english_3_sb',
        type: 'Student Book',
        level: 'Level 3',
      }),
    ],
  })
  assert.equal(result.ok, false)
  if (result.ok) return
  assert.match(result.error, /Ambiguous Student Book/i)
})

test('workbook-only level is omitted (not a teacher entry card)', () => {
  const result = groupSeriesBooksIntoCourseLevels({
    seriesName: 'Big English',
    books: [
      book({
        id: 'wb-5',
        title: 'Big English 5 Workbook',
        catalogBookId: 'big_english_5_wb',
        type: 'Workbook',
        level: 'Level 5',
      }),
    ],
  })
  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.equal(result.levels.length, 0)
})

test('type vs catalog suffix contradiction fails identity resolve', () => {
  const identity = resolveCourseLevelBookIdentity(
    book({
      id: 'bad',
      title: 'Broken',
      catalogBookId: 'big_english_3_sb',
      type: 'Workbook',
      level: 'Level 3',
    }),
  )
  assert.equal(identity, null)
})

test('Big English 3 card primary identity is Student Book', () => {
  const result = groupSeriesBooksIntoCourseLevels({
    seriesName: 'Big English',
    books: bigEnglishPair(3),
  })
  assert.equal(result.ok, true)
  if (!result.ok) return
  const level3 = result.levels[0]
  assert.equal(level3?.studentBook.catalogBookId, 'big_english_3_sb')
  assert.equal(level3?.workbook?.catalogBookId, 'big_english_3_wb')
  assert.notEqual(level3?.studentBook.id, level3?.workbook?.id)
})
