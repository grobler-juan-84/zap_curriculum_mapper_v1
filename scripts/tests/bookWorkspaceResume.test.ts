/**
 * Book Workspace resume persistence (browser-local v1).
 * Run: npx tsx --test scripts/tests/bookWorkspaceResume.test.ts
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import {
  bookWorkspacePath,
  chalkieWorkspacePath,
} from '../../app/src/features/book-intelligence/bookIntelligenceStorageRegistry.ts'
import {
  bookWorkspaceChooseBookPath,
} from '../../app/src/features/book-intelligence/bookIntelligenceStorageRegistry.ts'
import {
  bookResumeStorageKey,
  clearBookWorkspaceResumeState,
  createBookWorkspaceResumeState,
  formatBookWorkspaceResumeHint,
  lastActiveBookForSeriesStorageKey,
  lastActiveBookStorageKey,
  parseBookWorkspaceResumeState,
  readBookWorkspaceLastActiveBook,
  readBookWorkspaceLastActiveBookForSeries,
  readBookWorkspaceResumeState,
  resolveBookWorkspaceResumeLocation,
  resolveLastStudentBookForSeries,
  resolveValidLastActiveWorkspaceEntry,
  validateSavedBookWorkspaceResume,
  writeBookWorkspaceActivePointers,
  writeBookWorkspaceLastActiveBook,
  writeBookWorkspaceResumeState,
  type BookWorkspaceResumeStorageDriver,
} from '../../app/src/features/book-workspace/resume/index.ts'
import { listLessonAnchorsForUnit } from '../../app/src/features/chalkie/chalkieLessonNavigation.ts'
import type { Book, CurriculumSeries } from '../../app/src/types/curriculum.ts'

function memoryStorage(): BookWorkspaceResumeStorageDriver & {
  store: Map<string, string>
} {
  const store = new Map<string, string>()
  return {
    store,
    getItem(key) {
      return store.has(key) ? store.get(key)! : null
    },
    setItem(key, value) {
      store.set(key, value)
    },
    removeItem(key) {
      store.delete(key)
    },
  }
}

function makeBook(
  partial: Partial<Book> & Pick<Book, 'id' | 'title' | 'catalogBookId' | 'type'>,
): Book {
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

function makeSeries(): CurriculumSeries[] {
  const be3Sb = makeBook({
    id: 'uuid-be3-sb',
    catalogBookId: 'big_english_3_sb',
    type: 'Student Book',
    title: 'Big English 3 Student Book',
    level: 'Level 3',
  })
  const be3Wb = makeBook({
    id: 'uuid-be3-wb',
    catalogBookId: 'big_english_3_wb',
    type: 'Workbook',
    title: 'Big English 3 Workbook',
    level: 'Level 3',
  })
  const be2Sb = makeBook({
    id: 'uuid-be2-sb',
    catalogBookId: 'big_english_2_sb',
    type: 'Student Book',
    title: 'Big English 2 Student Book',
    level: 'Level 2',
  })
  const bh3Sb = makeBook({
    id: 'uuid-bh3-sb',
    seriesId: 'series-beehive',
    catalogBookId: 'beehive_3_sb',
    type: 'Student Book',
    title: 'Beehive 3 Student Book',
    level: 'Level 3',
  })
  return [
    {
      id: 'series-big-english',
      name: 'Big English',
      publisher: 'Pearson',
      shortDesc: 'Big English series',
      targetAges: '6–12',
      levelsCount: 6,
      availableBooksCount: 3,
      featuredBookUuid: be3Sb.id,
      colorScheme: { accent: '#0284C7', badge: 'bg-sky-50' },
      books: [be2Sb, be3Sb, be3Wb],
    },
    {
      id: 'series-beehive',
      name: 'Beehive',
      publisher: 'Oxford',
      shortDesc: 'Beehive series',
      targetAges: '6–12',
      levelsCount: 6,
      availableBooksCount: 1,
      featuredBookUuid: bh3Sb.id,
      colorScheme: { accent: '#F59E0B', badge: 'bg-amber-50' },
      books: [bh3Sb],
    },
  ]
}

const USER_A = 'user-a'
const USER_B = 'user-b'
const BE3 = 'big_english_3_sb'
const BE2 = 'big_english_2_sb'

test('1. first visit defaults to Unit 1 first lesson', () => {
  const storage = memoryStorage()
  const seriesList = makeSeries()
  const resolved = resolveBookWorkspaceResumeLocation({
    userId: USER_A,
    seriesList,
    selectedBook: seriesList[0]!.books.find((b) => b.catalogBookId === BE3)!,
    storage,
  })
  assert.ok(resolved)
  assert.equal(resolved.source, 'default_unit_1')
  assert.equal(resolved.unitNumber, 1)
  assert.equal(resolved.catalogBookId, BE3)
})

test('2. reload restores the same book/unit/lesson/pages', () => {
  const storage = memoryStorage()
  const seriesList = makeSeries()
  const book = seriesList[0]!.books.find((b) => b.catalogBookId === BE3)!
  const state = createBookWorkspaceResumeState({
    seriesId: seriesList[0]!.id,
    bookId: book.id,
    catalogBookId: BE3,
    unitNumber: 8,
    printedPages: [134, 135],
  })!
  writeBookWorkspaceResumeState({ userId: USER_A, state, storage })

  const resolved = resolveBookWorkspaceResumeLocation({
    userId: USER_A,
    seriesList,
    selectedBook: book,
    knownUnitNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    storage,
  })
  assert.ok(resolved)
  assert.equal(resolved.source, 'saved')
  assert.equal(resolved.unitNumber, 8)
  assert.deepEqual(resolved.printedPages, [134, 135])
})

test('3. saved Unit 8 Lesson 4 resumes at Lesson 4 — not Lesson 5', () => {
  const storage = memoryStorage()
  const seriesList = makeSeries()
  const book = seriesList[0]!.books.find((b) => b.catalogBookId === BE3)!
  const anchors = listLessonAnchorsForUnit({
    studentBookCatalogId: BE3,
    unitNumber: 8,
  })
  assert.ok(anchors.length >= 5, 'expected at least 5 Unit 8 lesson anchors')
  const lesson4 = anchors[3]!
  const lesson5 = anchors[4]!
  assert.deepEqual([...lesson4.studentBookPrintedPages], [134, 135])
  assert.deepEqual([...lesson5.studentBookPrintedPages], [136, 137])

  const state = createBookWorkspaceResumeState({
    seriesId: seriesList[0]!.id,
    bookId: book.id,
    catalogBookId: BE3,
    unitNumber: 8,
    printedPages: [...lesson4.studentBookPrintedPages],
  })!
  writeBookWorkspaceResumeState({ userId: USER_A, state, storage })

  const resolved = resolveBookWorkspaceResumeLocation({
    userId: USER_A,
    seriesList,
    selectedBook: book,
    knownUnitNumbers: [8],
    storage,
  })
  assert.ok(resolved)
  assert.deepEqual(resolved.printedPages, [134, 135])
  assert.notDeepEqual(resolved.printedPages, [...lesson5.studentBookPrintedPages])
})

test('4. explicit ?unit=3 overrides saved Unit 8', () => {
  const storage = memoryStorage()
  const seriesList = makeSeries()
  const book = seriesList[0]!.books.find((b) => b.catalogBookId === BE3)!
  writeBookWorkspaceResumeState({
    userId: USER_A,
    state: createBookWorkspaceResumeState({
      seriesId: seriesList[0]!.id,
      bookId: book.id,
      catalogBookId: BE3,
      unitNumber: 8,
      printedPages: [134, 135],
    })!,
    storage,
  })

  const resolved = resolveBookWorkspaceResumeLocation({
    userId: USER_A,
    seriesList,
    selectedBook: book,
    explicitUnitQuery: '3',
    knownUnitNumbers: [1, 2, 3, 8],
    storage,
  })
  assert.ok(resolved)
  assert.equal(resolved.source, 'explicit_query')
  assert.equal(resolved.unitNumber, 3)
})

test('5. explicit location becomes the next saved location', () => {
  const storage = memoryStorage()
  const seriesList = makeSeries()
  const book = seriesList[0]!.books.find((b) => b.catalogBookId === BE3)!
  const next = createBookWorkspaceResumeState({
    seriesId: seriesList[0]!.id,
    bookId: book.id,
    catalogBookId: BE3,
    unitNumber: 3,
    printedPages: [],
  })!
  writeBookWorkspaceResumeState({ userId: USER_A, state: next, storage })
  const saved = readBookWorkspaceResumeState({
    userId: USER_A,
    catalogBookId: BE3,
    storage,
  })
  assert.equal(saved?.unitNumber, 3)
})

test('6. Big English 2 and Big English 3 retain independent positions', () => {
  const storage = memoryStorage()
  const seriesList = makeSeries()
  const be3 = seriesList[0]!.books.find((b) => b.catalogBookId === BE3)!
  const be2 = seriesList[0]!.books.find((b) => b.catalogBookId === BE2)!

  writeBookWorkspaceResumeState({
    userId: USER_A,
    state: createBookWorkspaceResumeState({
      seriesId: seriesList[0]!.id,
      bookId: be3.id,
      catalogBookId: BE3,
      unitNumber: 8,
      printedPages: [134, 135],
    })!,
    storage,
  })
  writeBookWorkspaceResumeState({
    userId: USER_A,
    state: createBookWorkspaceResumeState({
      seriesId: seriesList[0]!.id,
      bookId: be2.id,
      catalogBookId: BE2,
      unitNumber: 2,
      printedPages: [10],
    })!,
    storage,
  })

  const r3 = resolveBookWorkspaceResumeLocation({
    userId: USER_A,
    seriesList,
    selectedBook: be3,
    knownUnitNumbers: [8],
    storage,
  })
  const r2 = resolveBookWorkspaceResumeLocation({
    userId: USER_A,
    seriesList,
    selectedBook: be2,
    knownUnitNumbers: [1, 2],
    storage,
  })
  assert.equal(r3?.unitNumber, 8)
  assert.equal(r2?.unitNumber, 2)
})

test('7. two authenticated users do not share positions', () => {
  const storage = memoryStorage()
  const seriesList = makeSeries()
  const book = seriesList[0]!.books.find((b) => b.catalogBookId === BE3)!

  writeBookWorkspaceResumeState({
    userId: USER_A,
    state: createBookWorkspaceResumeState({
      seriesId: seriesList[0]!.id,
      bookId: book.id,
      catalogBookId: BE3,
      unitNumber: 8,
      printedPages: [134, 135],
    })!,
    storage,
  })
  writeBookWorkspaceResumeState({
    userId: USER_B,
    state: createBookWorkspaceResumeState({
      seriesId: seriesList[0]!.id,
      bookId: book.id,
      catalogBookId: BE3,
      unitNumber: 1,
      printedPages: [],
    })!,
    storage,
  })

  assert.notEqual(
    bookResumeStorageKey(USER_A, BE3),
    bookResumeStorageKey(USER_B, BE3),
  )
  assert.equal(
    readBookWorkspaceResumeState({
      userId: USER_A,
      catalogBookId: BE3,
      storage,
    })?.unitNumber,
    8,
  )
  assert.equal(
    readBookWorkspaceResumeState({
      userId: USER_B,
      catalogBookId: BE3,
      storage,
    })?.unitNumber,
    1,
  )
})

test('8. workbook never becomes the primary resume identity', () => {
  const storage = memoryStorage()
  const seriesList = makeSeries()
  const wb = seriesList[0]!.books.find((b) => b.catalogBookId === 'big_english_3_wb')!
  const resolved = resolveBookWorkspaceResumeLocation({
    userId: USER_A,
    seriesList,
    selectedBook: wb,
    storage,
  })
  assert.ok(resolved)
  assert.equal(resolved.catalogBookId, BE3)
  assert.notEqual(resolved.catalogBookId, 'big_english_3_wb')
})

test('9. malformed JSON fails safely', () => {
  const storage = memoryStorage()
  storage.setItem(bookResumeStorageKey(USER_A, BE3), '{not-json')
  const saved = readBookWorkspaceResumeState({
    userId: USER_A,
    catalogBookId: BE3,
    storage,
  })
  assert.equal(saved, null)
  assert.equal(storage.getItem(bookResumeStorageKey(USER_A, BE3)), null)
})

test('10. unknown book/unit/lesson fails safely', () => {
  const storage = memoryStorage()
  const seriesList = makeSeries()
  storage.setItem(
    bookResumeStorageKey(USER_A, 'totally_unknown_sb'),
    JSON.stringify({
      version: 1,
      seriesId: 'series-big-english',
      bookId: 'missing',
      catalogBookId: 'totally_unknown_sb',
      unitNumber: 99,
      lessonKeyOrAnchor: 'pages:1',
      printedPages: [1],
      updatedAt: new Date().toISOString(),
    }),
  )
  const raw = readBookWorkspaceResumeState({
    userId: USER_A,
    catalogBookId: 'totally_unknown_sb',
    storage,
  })
  const validated = validateSavedBookWorkspaceResume({
    userId: USER_A,
    saved: raw,
    seriesList,
    storage,
  })
  assert.equal(validated, null)

  const book = seriesList[0]!.books.find((b) => b.catalogBookId === BE3)!
  writeBookWorkspaceResumeState({
    userId: USER_A,
    state: createBookWorkspaceResumeState({
      seriesId: seriesList[0]!.id,
      bookId: book.id,
      catalogBookId: BE3,
      unitNumber: 99,
      printedPages: [9999],
    })!,
    storage,
  })
  const resolved = resolveBookWorkspaceResumeLocation({
    userId: USER_A,
    seriesList,
    selectedBook: book,
    knownUnitNumbers: [1, 8],
    storage,
  })
  assert.ok(resolved)
  assert.equal(resolved.source, 'default_unit_1')
})

test('11. catalog changes invalidate stale locations safely', () => {
  const storage = memoryStorage()
  const seriesList = makeSeries()
  const book = seriesList[0]!.books.find((b) => b.catalogBookId === BE3)!
  writeBookWorkspaceResumeState({
    userId: USER_A,
    state: createBookWorkspaceResumeState({
      seriesId: 'obsolete-series-id',
      bookId: book.id,
      catalogBookId: BE3,
      unitNumber: 8,
      printedPages: [134, 135],
    })!,
    storage,
  })
  const validated = validateSavedBookWorkspaceResume({
    userId: USER_A,
    saved: readBookWorkspaceResumeState({
      userId: USER_A,
      catalogBookId: BE3,
      storage,
    }),
    seriesList,
    storage,
  })
  assert.equal(validated, null)
  assert.equal(
    readBookWorkspaceResumeState({
      userId: USER_A,
      catalogBookId: BE3,
      storage,
    }),
    null,
  )
})

test('12. legacy redirects preserve explicit queries', () => {
  assert.equal(bookWorkspacePath(8), '/app/book-workspace?unit=8')
  assert.equal(chalkieWorkspacePath(8), '/app/book-workspace?unit=8')
  // PreserveQueryRedirect concatenates location.search onto the target path.
  const legacySearch = '?unit=8'
  const redirected = `/app/book-workspace${legacySearch}`
  assert.equal(redirected, '/app/book-workspace?unit=8')
})

test('13. browser back/forward is not defeated by restoration', () => {
  const storage = memoryStorage()
  const seriesList = makeSeries()
  const book = seriesList[0]!.books.find((b) => b.catalogBookId === BE3)!
  writeBookWorkspaceResumeState({
    userId: USER_A,
    state: createBookWorkspaceResumeState({
      seriesId: seriesList[0]!.id,
      bookId: book.id,
      catalogBookId: BE3,
      unitNumber: 8,
      printedPages: [134, 135],
    })!,
    storage,
  })

  // History entry with explicit unit=1 must win over saved unit 8.
  const fromHistory = resolveBookWorkspaceResumeLocation({
    userId: USER_A,
    seriesList,
    selectedBook: book,
    explicitUnitQuery: '1',
    knownUnitNumbers: [1, 8],
    storage,
  })
  assert.equal(fromHistory?.source, 'explicit_query')
  assert.equal(fromHistory?.unitNumber, 1)

  // Later history entry unit=8 still wins even if persistence changed.
  writeBookWorkspaceResumeState({
    userId: USER_A,
    state: createBookWorkspaceResumeState({
      seriesId: seriesList[0]!.id,
      bookId: book.id,
      catalogBookId: BE3,
      unitNumber: 1,
      printedPages: [],
    })!,
    storage,
  })
  const backToEight = resolveBookWorkspaceResumeLocation({
    userId: USER_A,
    seriesList,
    selectedBook: book,
    explicitUnitQuery: '8',
    knownUnitNumbers: [1, 8],
    storage,
  })
  assert.equal(backToEight?.unitNumber, 8)
  assert.equal(backToEight?.source, 'explicit_query')
})

test('14. logout/login restoration is user-scoped', () => {
  const storage = memoryStorage()
  const seriesList = makeSeries()
  const book = seriesList[0]!.books.find((b) => b.catalogBookId === BE3)!

  writeBookWorkspaceResumeState({
    userId: USER_A,
    state: createBookWorkspaceResumeState({
      seriesId: seriesList[0]!.id,
      bookId: book.id,
      catalogBookId: BE3,
      unitNumber: 8,
      printedPages: [134, 135],
    })!,
    storage,
  })
  writeBookWorkspaceLastActiveBook({
    userId: USER_A,
    state: {
      version: 1,
      seriesId: seriesList[0]!.id,
      bookId: book.id,
      catalogBookId: BE3,
      updatedAt: new Date().toISOString(),
    },
    storage,
  })

  // Simulate "logged out" reads — no user id yields no resume.
  assert.equal(
    readBookWorkspaceResumeState({
      userId: null,
      catalogBookId: BE3,
      storage,
    }),
    null,
  )
  assert.equal(
    readBookWorkspaceLastActiveBook({ userId: null, storage }),
    null,
  )

  // USER_B login does not see USER_A state.
  assert.equal(
    readBookWorkspaceResumeState({
      userId: USER_B,
      catalogBookId: BE3,
      storage,
    }),
    null,
  )
  assert.notEqual(
    lastActiveBookStorageKey(USER_A),
    lastActiveBookStorageKey(USER_B),
  )
})

test('15. no completion or automatic-next state is created', () => {
  const state = createBookWorkspaceResumeState({
    seriesId: 'series-big-english',
    bookId: 'uuid-be3-sb',
    catalogBookId: BE3,
    unitNumber: 8,
    printedPages: [134, 135],
  })!
  const raw = JSON.parse(JSON.stringify(state)) as Record<string, unknown>
  assert.equal('completed' in raw, false)
  assert.equal('completion' in raw, false)
  assert.equal('nextLesson' in raw, false)
  assert.equal('autoAdvance' in raw, false)
  assert.equal(state.unitNumber, 8)
  assert.deepEqual(state.printedPages, [134, 135])
})

test('16. existing Unit 8 navigation and one-page lesson behavior remains correct', () => {
  const anchors = listLessonAnchorsForUnit({
    studentBookCatalogId: BE3,
    unitNumber: 8,
  })
  assert.ok(anchors.length >= 5)
  // Values remains the companion-free one-page lesson.
  const values = anchors.find(
    (anchor) =>
      anchor.studentBookPrintedPages.length === 1 &&
      anchor.studentBookPrintedPages[0] === 142,
  )
  assert.ok(values)
  assert.equal(values.companionRelationshipId, null)

  // Lesson 4 identity remains CLIL pages — resume must not invent Lesson 5.
  assert.deepEqual([...anchors[3]!.studentBookPrintedPages], [134, 135])
})

test('parseBookWorkspaceResumeState rejects wrong version / missing fields', () => {
  assert.equal(parseBookWorkspaceResumeState(null), null)
  assert.equal(parseBookWorkspaceResumeState({ version: 2 }), null)
  assert.equal(
    parseBookWorkspaceResumeState({
      version: 1,
      seriesId: 's',
      bookId: 'b',
      catalogBookId: BE3,
      unitNumber: 0,
      printedPages: [1],
      updatedAt: 'x',
    }),
    null,
  )
})

test('clearBookWorkspaceResumeState removes only the targeted record', () => {
  const storage = memoryStorage()
  const seriesList = makeSeries()
  const be3 = seriesList[0]!.books.find((b) => b.catalogBookId === BE3)!
  const be2 = seriesList[0]!.books.find((b) => b.catalogBookId === BE2)!
  writeBookWorkspaceResumeState({
    userId: USER_A,
    state: createBookWorkspaceResumeState({
      seriesId: seriesList[0]!.id,
      bookId: be3.id,
      catalogBookId: BE3,
      unitNumber: 8,
      printedPages: [134, 135],
    })!,
    storage,
  })
  writeBookWorkspaceResumeState({
    userId: USER_A,
    state: createBookWorkspaceResumeState({
      seriesId: seriesList[0]!.id,
      bookId: be2.id,
      catalogBookId: BE2,
      unitNumber: 2,
      printedPages: [],
    })!,
    storage,
  })
  clearBookWorkspaceResumeState({
    userId: USER_A,
    catalogBookId: BE3,
    storage,
  })
  assert.equal(
    readBookWorkspaceResumeState({
      userId: USER_A,
      catalogBookId: BE3,
      storage,
    }),
    null,
  )
  assert.equal(
    readBookWorkspaceResumeState({
      userId: USER_A,
      catalogBookId: BE2,
      storage,
    })?.unitNumber,
    2,
  )
})

test('resume hint is concise and non-completion', () => {
  const hint = formatBookWorkspaceResumeHint(
    createBookWorkspaceResumeState({
      seriesId: 'series-big-english',
      bookId: 'uuid-be3-sb',
      catalogBookId: BE3,
      unitNumber: 8,
      printedPages: [134, 135],
    }),
  )
  assert.equal(hint, 'Resume: Unit 8 · pp.134–135')
  assert.equal(hint?.includes('%'), false)
  assert.equal(hint?.toLowerCase().includes('complete'), false)
})

test('17. valid last-active workspace resolves for login landing', () => {
  const storage = memoryStorage()
  const seriesList = makeSeries()
  const book = seriesList[0]!.books.find((b) => b.catalogBookId === BE3)!
  writeBookWorkspaceActivePointers({
    userId: USER_A,
    state: {
      version: 1,
      seriesId: seriesList[0]!.id,
      bookId: book.id,
      catalogBookId: BE3,
      updatedAt: new Date().toISOString(),
    },
    storage,
  })
  const match = resolveValidLastActiveWorkspaceEntry({
    userId: USER_A,
    seriesList,
    storage,
  })
  assert.ok(match)
  assert.equal(match.book.catalogBookId, BE3)
  assert.equal(match.series.id, 'series-big-english')
})

test('18. missing or invalid last-active falls through silently (CL)', () => {
  const storage = memoryStorage()
  const seriesList = makeSeries()
  assert.equal(
    resolveValidLastActiveWorkspaceEntry({
      userId: USER_A,
      seriesList,
      storage,
    }),
    null,
  )
  writeBookWorkspaceLastActiveBook({
    userId: USER_A,
    state: {
      version: 1,
      seriesId: 'series-big-english',
      bookId: 'missing-uuid',
      catalogBookId: 'not_a_real_book_sb',
      updatedAt: new Date().toISOString(),
    },
    storage,
  })
  assert.equal(
    resolveValidLastActiveWorkspaceEntry({
      userId: USER_A,
      seriesList,
      storage,
    }),
    null,
  )
})

test('19. per-series last book is independent of global last-active', () => {
  const storage = memoryStorage()
  const seriesList = makeSeries()
  const be3 = seriesList[0]!.books.find((b) => b.catalogBookId === BE3)!
  const bh3 = seriesList[1]!.books[0]!

  writeBookWorkspaceActivePointers({
    userId: USER_A,
    state: {
      version: 1,
      seriesId: 'series-big-english',
      bookId: be3.id,
      catalogBookId: BE3,
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    storage,
  })
  writeBookWorkspaceActivePointers({
    userId: USER_A,
    state: {
      version: 1,
      seriesId: 'series-beehive',
      bookId: bh3.id,
      catalogBookId: 'beehive_3_sb',
      updatedAt: '2026-01-02T00:00:00.000Z',
    },
    storage,
  })

  // Global last-active is the most recently written pointer (Beehive).
  assert.equal(
    readBookWorkspaceLastActiveBook({ userId: USER_A, storage })?.catalogBookId,
    'beehive_3_sb',
  )

  // Returning to Big English still restores BE3.
  const forBe = resolveLastStudentBookForSeries({
    userId: USER_A,
    seriesId: 'series-big-english',
    seriesList,
    storage,
  })
  assert.equal(forBe?.book.catalogBookId, BE3)

  const forBh = resolveLastStudentBookForSeries({
    userId: USER_A,
    seriesId: 'series-beehive',
    seriesList,
    storage,
  })
  assert.equal(forBh?.book.catalogBookId, 'beehive_3_sb')

  assert.notEqual(
    lastActiveBookForSeriesStorageKey(USER_A, 'series-big-english'),
    lastActiveBookStorageKey(USER_A),
  )
})

test('20. series without pointer returns null (chooser path)', () => {
  const storage = memoryStorage()
  const seriesList = makeSeries()
  assert.equal(
    resolveLastStudentBookForSeries({
      userId: USER_A,
      seriesId: 'series-big-english',
      seriesList,
      storage,
    }),
    null,
  )
  assert.equal(
    readBookWorkspaceLastActiveBookForSeries({
      userId: USER_A,
      seriesId: 'series-big-english',
      storage,
    }),
    null,
  )
  assert.equal(bookWorkspaceChooseBookPath(), '/app/book-workspace?chooseBook=1')
})
