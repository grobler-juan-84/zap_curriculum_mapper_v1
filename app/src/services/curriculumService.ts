import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { Book, CurriculumSeries, PageSpread } from '../types/curriculum'
import {
  mapDbSeriesToCurriculumSeries,
  type DbSeriesRow,
} from './catalogMapper'

let catalogCache: CurriculumSeries[] | null = null
let catalogPromise: Promise<CurriculumSeries[]> | null = null

async function fetchCatalogFromSupabase(): Promise<CurriculumSeries[]> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to app/.env.local.',
    )
  }

  const { data, error } = await supabase
    .from('book_series')
    .select(
      `
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
        book_files ( id )
      )
    `,
    )
    .order('name', { ascending: true })

  if (error) {
    // Older DBs may not have cover_path yet — retry without it.
    if (/cover_path/i.test(error.message)) {
      const fallback = await supabase
        .from('book_series')
        .select(
          `
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
        `,
        )
        .order('name', { ascending: true })
      if (fallback.error) throw new Error(fallback.error.message)
      const rows = (fallback.data ?? []) as DbSeriesRow[]
      return attachSeriesCoverUrls(rows.map(mapDbSeriesToCurriculumSeries))
    }
    throw new Error(error.message)
  }

  const rows = (data ?? []) as DbSeriesRow[]
  return attachSeriesCoverUrls(rows.map(mapDbSeriesToCurriculumSeries))
}

async function attachSeriesCoverUrls(
  seriesList: CurriculumSeries[],
): Promise<CurriculumSeries[]> {
  const client = supabase
  if (!client) return seriesList

  return Promise.all(
    seriesList.map(async (series) => {
      if (!series.coverPath) return series
      const { data, error } = await client.storage
        .from('book-assets')
        .createSignedUrl(series.coverPath, 60 * 60)
      if (error || !data?.signedUrl) return series
      return { ...series, coverImage: data.signedUrl }
    }),
  )
}

/** Mock-backed curriculum catalog access. Swap implementation later for JSON/API. */
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
