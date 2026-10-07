import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { Book, CurriculumSeries, PageSpread } from '../types/curriculum'
import {
  mapDbSeriesToCurriculumSeries,
  type DbSeriesRow,
} from './catalogMapper'

let catalogCache: CurriculumSeries[] | null = null
let catalogPromise: Promise<CurriculumSeries[]> | null = null

const SERIES_SELECT_WITH_BOOK_COVERS = `
  id,
  name,
  publisher,
  description,
  cover_path,
  books (
    id,
    book_id,
    series_id,
    title,
    level,
    book_type,
    edition,
    language,
    status,
    cover_path,
    book_files ( id )
  )
`

const SERIES_SELECT_BASIC = `
  id,
  name,
  publisher,
  description,
  books (
    id,
    book_id,
    series_id,
    title,
    level,
    book_type,
    edition,
    language,
    status,
    book_files ( id )
  )
`

async function fetchCatalogFromSupabase(): Promise<CurriculumSeries[]> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to app/.env.local.',
    )
  }

  let data: unknown = null
  let error: { message: string } | null = null

  {
    const primary = await supabase
      .from('book_series')
      .select(SERIES_SELECT_WITH_BOOK_COVERS)
      .order('name', { ascending: true })
    data = primary.data
    error = primary.error
  }

  if (error && /cover_path/i.test(error.message)) {
    const fallback = await supabase
      .from('book_series')
      .select(SERIES_SELECT_BASIC)
      .order('name', { ascending: true })
    data = fallback.data
    error = fallback.error
  }

  if (error) {
    throw new Error(error.message)
  }

  const rows = (data ?? []) as DbSeriesRow[]
  return rows.map(mapDbSeriesToCurriculumSeries)
}

/** Curriculum catalog access backed by Supabase book_series / books. */
export const curriculumService = {
  /** Load (and cache) series + books from Supabase. Safe to call repeatedly. */
  async loadCatalog(options?: { force?: boolean }): Promise<CurriculumSeries[]> {
    if (!options?.force && catalogCache) {
      return catalogCache
    }
    if (!options?.force && catalogPromise) {
      return catalogPromise
    }

    catalogPromise = fetchCatalogFromSupabase()
      .then((series) => {
        catalogCache = series
        return series
      })
      .catch((error) => {
        catalogPromise = null
        throw error
      })

    return catalogPromise
  },

  clearCache(): void {
    catalogCache = null
    catalogPromise = null
  },

  /** Synchronous read of the in-memory cache (empty until loadCatalog resolves). */
  listSeries(): CurriculumSeries[] {
    return catalogCache ?? []
  },

  getSeriesById(seriesId: string): CurriculumSeries | null {
    return this.listSeries().find((series) => series.id === seriesId) ?? null
  },

  getSeriesByName(name: string): CurriculumSeries | null {
    const key = name.trim().toLowerCase()
    return (
      this.listSeries().find((series) => series.name.trim().toLowerCase() === key) ?? null
    )
  },

  getBookById(bookId: string): { series: CurriculumSeries; book: Book } | null {
    for (const series of this.listSeries()) {
      const book = series.books.find((entry) => entry.id === bookId)
      if (book) return { series, book }
    }
    return null
  },

  getBookByStableId(stableBookId: string): { series: CurriculumSeries; book: Book } | null {
    for (const series of this.listSeries()) {
      const book = series.books.find((entry) => entry.stableBookId === stableBookId)
      if (book) return { series, book }
    }
    return null
  },

  getSpreadById(spreadId: string): {
    series: CurriculumSeries
    book: Book
    spread: PageSpread
  } | null {
    for (const series of this.listSeries()) {
      for (const book of series.books) {
        const spread = book.pageSpreads.find((entry) => entry.id === spreadId)
        if (spread) return { series, book, spread }
      }
    }
    return null
  },

  getDefaultSelection(): {
    seriesId: string
    bookId: string
    spreadId: string
  } {
    const series = this.listSeries()[0]
    if (!series) {
      return { seriesId: '', bookId: '', spreadId: '' }
    }
    const book = series.books[0]
    return {
      seriesId: series.id,
      bookId: book?.id ?? '',
      spreadId: book?.pageSpreads[0]?.id ?? '',
    }
  },
}
