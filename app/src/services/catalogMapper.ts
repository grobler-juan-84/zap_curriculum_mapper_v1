import type { Book, CurriculumSeries, PageSpread } from '../types/curriculum'
import { mockCurriculumSeries } from '../mocks/curriculum/curriculumSeries'

export type DbBookRow = {
  id: string
  book_id: string
  series_id: string
  title: string
  level: string | null
  book_type: string | null
  edition: string | null
  language: string | null
  status: string
  cover_path?: string | null
  book_files?: Array<{ id: string }> | null
}

export type DbSeriesRow = {
  id: string
  name: string
  publisher: string | null
  description: string | null
  cover_path?: string | null
  books?: DbBookRow[] | null
}

type SeriesPresentation = {
  targetAges: string
  levelsCount: number
  colorScheme: CurriculumSeries['colorScheme']
  emoji: string
}

const DEFAULT_PRESENTATION: SeriesPresentation = {
  targetAges: 'School curriculum',
  levelsCount: 1,
  colorScheme: {
    accent: '#6366F1',
    badge: 'bg-slate-100 text-slate-800 border-slate-300',
  },
  emoji: '📚',
}

export function presentationForSeriesName(name: string): SeriesPresentation {
  const key = name.trim().toLowerCase()
  if (key.includes('beehive')) {
    return {
      targetAges: 'Ages 6–12',
      levelsCount: 2,
      colorScheme: {
        accent: '#EAB308',
        badge: 'bg-amber-100 text-amber-900 border-amber-300',
      },
      emoji: '🐝',
    }
  }
  if (key.includes('big english')) {
    return {
      targetAges: 'Primary / lower secondary',
      levelsCount: 6,
      colorScheme: {
        accent: '#0EA5E9',
        badge: 'bg-sky-100 text-sky-900 border-sky-300',
      },
      emoji: '🌍',
    }
  }
  if (key.includes('reach higher')) {
    return {
      targetAges: 'Upper primary / secondary',
      levelsCount: 4,
      colorScheme: {
        accent: '#10B981',
        badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      },
      emoji: '🏔️',
    }
  }
  return DEFAULT_PRESENTATION
}

function mockSpreadsForCatalogBookId(catalogBookId: string): PageSpread[] {
  // Keep Beehive 1 interactive demo spreads until Storage-backed content is wired.
  if (catalogBookId === 'beehive_1_sb') {
    const mockBook = mockCurriculumSeries
      .find((series) => series.id === 'beehive')
      ?.books.find((book) => book.id === 'beehive-1')
    return mockBook?.pageSpreads ?? []
  }
  return []
}

export function defaultBookCoverPath(catalogBookId: string): string | null {
  switch (catalogBookId) {
    case 'beehive_1_sb':
      return 'books/beehive_1_sb/cover.png'
    case 'big_english_1_sb':
      return 'books/big_english_1_sb/cover.png'
    case 'big_english_2_sb':
      return 'books/big_english_2_sb/cover.png'
    case 'reach_higher_2a':
      return 'books/reach_higher_2a/cover.png'
    default:
      return null
  }
}

function mapBookType(value: string | null): Book['type'] {
  if (value === 'Student Book' || value === 'Workbook' || value === "Teacher's Guide") {
    return value
  }
  if (value?.toLowerCase().includes('workbook')) return 'Workbook'
  if (value?.toLowerCase().includes('teacher')) return "Teacher's Guide"
  return 'Student Book'
}

export function mapDbBookToBook(row: DbBookRow): Book {
  const pageSpreads = mockSpreadsForCatalogBookId(row.book_id)
  const fileCount = row.book_files?.length ?? 0
  const coverPath = row.cover_path?.trim() || defaultBookCoverPath(row.book_id) || undefined
  return {
    id: row.id,
    catalogBookId: row.book_id,
    seriesId: row.series_id,
    title: row.title,
    level: row.level ? `Level ${row.level}` : 'Level —',
    audience: row.level ? `Level ${row.level}` : 'Curriculum book',
    totalUnits: fileCount > 0 ? fileCount : pageSpreads.length > 0 ? pageSpreads.length : 0,
    type: mapBookType(row.book_type),
    coverPath,
    colorScheme: {
      primary: '#0284C7',
      accent: '#F59E0B',
      badgeBg: 'bg-sky-50',
      badgeText: 'text-sky-800',
    },
    pageSpreads,
  }
}

export function defaultSeriesCoverPath(name: string): string | null {
  const key = name.trim().toLowerCase()
  if (key.includes('beehive')) return 'series/beehive_book_series.png'
  if (key.includes('big english')) return 'series/big_english_book_series.png'
  if (key.includes('reach higher')) return 'series/reach_higher_book_series.png'
  return null
}

export function mapDbSeriesToCurriculumSeries(row: DbSeriesRow): CurriculumSeries {
  const presentation = presentationForSeriesName(row.name)
  const books = (row.books ?? [])
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title))
    .map(mapDbBookToBook)
  const coverPath = row.cover_path?.trim() || defaultSeriesCoverPath(row.name) || undefined

  return {
    id: row.id,
    name: row.name,
    publisher: row.publisher ?? 'Publisher TBD',
    shortDesc: row.description?.trim() || `${row.name} curriculum series.`,
    targetAges: presentation.targetAges,
    levelsCount: presentation.levelsCount,
    availableBooksCount: books.length,
    featuredBookUuid: books[0]?.id ?? '',
    coverPath,
    colorScheme: presentation.colorScheme,
    books,
  }
}

export function seriesEmoji(name: string): string {
  return presentationForSeriesName(name).emoji
}
