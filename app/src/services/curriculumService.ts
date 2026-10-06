import { mockCurriculumSeries } from '../mocks/curriculum/curriculumSeries'
import type { Book, CurriculumSeries, PageSpread } from '../types/curriculum'

/** Mock-backed curriculum catalog access. Swap implementation later for JSON/API. */
export const curriculumService = {
  listSeries(): CurriculumSeries[] {
    return mockCurriculumSeries
  },

  getSeriesById(seriesId: string): CurriculumSeries | null {
    return mockCurriculumSeries.find((series) => series.id === seriesId) ?? null
  },

  getBookById(bookId: string): { series: CurriculumSeries; book: Book } | null {
    for (const series of mockCurriculumSeries) {
      const book = series.books.find((entry) => entry.id === bookId)
      if (book) return { series, book }
    }
    return null
  },

  getSpreadById(spreadId: string): {
    series: CurriculumSeries
    book: Book
    spread: PageSpread
  } | null {
    for (const series of mockCurriculumSeries) {
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
    const series = mockCurriculumSeries[0]
    const book = series.books[0]
    return {
      seriesId: series.id,
      bookId: book.id,
      spreadId: book.pageSpreads[0]?.id ?? '',
    }
  },
}
