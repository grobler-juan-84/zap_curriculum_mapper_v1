/**
 * Local registry of Phase 2 Book Intelligence Storage companions.
 * Not Postgres / book_files — additive path map only until registration is decided.
 */

export type BookIntelligenceStorageArtifact = {
  catalogBookId: string
  seriesSlug: string
  bucket: string
  storagePath: string
  expectedUnitCount: number
  label: string
}

export const BOOK_INTELLIGENCE_STORAGE_BUCKET = 'book-datasets'

/** Default overview when opening `/app/book-intelligence` with no catalog segment. */
export const DEFAULT_BOOK_INTELLIGENCE_CATALOG_BOOK_ID = 'big_english_3_sb'

export const BOOK_INTELLIGENCE_STORAGE_ARTIFACTS: Record<
  string,
  BookIntelligenceStorageArtifact
> = {
  big_english_3_sb: {
    catalogBookId: 'big_english_3_sb',
    seriesSlug: 'big-english',
    bucket: BOOK_INTELLIGENCE_STORAGE_BUCKET,
    storagePath:
      'big-english/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json',
    expectedUnitCount: 9,
    label: 'BE3-SB Units 1–9 A+B',
  },
}

export function getBookIntelligenceStorageArtifact(
  catalogBookId: string | undefined | null,
): BookIntelligenceStorageArtifact | null {
  if (!catalogBookId) return null
  return BOOK_INTELLIGENCE_STORAGE_ARTIFACTS[catalogBookId] ?? null
}

export function hasBookIntelligenceOverview(
  catalogBookId: string | undefined | null,
): boolean {
  return getBookIntelligenceStorageArtifact(catalogBookId) !== null
}

export function bookIntelligencePath(
  catalogBookId: string,
  unitNumber?: string | number,
): string {
  const base = `/app/book-intelligence/${catalogBookId}`
  if (unitNumber === undefined || unitNumber === null || unitNumber === '') {
    return base
  }
  return `${base}?unit=${encodeURIComponent(String(unitNumber))}`
}
