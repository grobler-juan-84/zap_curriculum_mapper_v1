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

/**
 * Default catalog book when a legacy `/app/book-intelligence` URL has no segment.
 * Dedicated BI preview UI is retired; Chalkie Workspace Unit Intelligence is the teacher surface.
 */
export const DEFAULT_BOOK_INTELLIGENCE_CATALOG_BOOK_ID = 'big_english_3_sb'

export const BOOK_INTELLIGENCE_STORAGE_ARTIFACTS: Record<
  string,
  BookIntelligenceStorageArtifact
> = {
  big_english_2_sb: {
    catalogBookId: 'big_english_2_sb',
    seriesSlug: 'big-english',
    bucket: BOOK_INTELLIGENCE_STORAGE_BUCKET,
    storagePath:
      'big-english/big_english_2_sb/interpretations/be2-sb-u01-u09-book-intelligence-v2-eight-column-v0.1-draft.json',
    expectedUnitCount: 9,
    label: 'BE2-SB Units 1–9 v2 eight-column',
  },
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

/**
 * Teacher-facing path for Book Intelligence content (Chalkie Workspace Unit Intelligence).
 * Optional `unit` query is applied when Chalkie Workspace loads unit batches.
 */
export function chalkieWorkspacePath(unitNumber?: string | number | null): string {
  if (unitNumber === undefined || unitNumber === null || unitNumber === '') {
    return '/app/chalkie'
  }
  return `/app/chalkie?unit=${encodeURIComponent(String(unitNumber))}`
}

/**
 * @deprecated Dedicated BI preview routes are retired. Prefer `chalkieWorkspacePath`.
 * Kept as a compatibility alias that returns the Chalkie Workspace path (book selection
 * is applied by the legacy-route redirect via workspace state).
 */
export function bookIntelligencePath(
  _catalogBookId: string,
  unitNumber?: string | number,
): string {
  return chalkieWorkspacePath(unitNumber)
}
