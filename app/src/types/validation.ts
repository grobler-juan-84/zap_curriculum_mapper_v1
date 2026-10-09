/** Validation / verification workflow types for Phase 1 unit batches. */

export type BookFileStatus = 'pending' | 'needs_review' | 'verified'

/** Which object store produced the Validation PDF signed URL (D011). */
export type PdfStorageProvider = 'r2' | 'supabase'

export type SignedPdfResult = {
  url: string
  provider: PdfStorageProvider
}

export type BookFileBatch = {
  id: string
  /** Postgres UUID FK (`book_files.book_id` → `books.id`). */
  bookUuid: string
  fileType: string
  bucket: string
  storagePath: string
  filename: string | null
  label: string | null
  status: BookFileStatus | null
  mimeType: string | null
  fileSize: number | null
  /**
   * When navigating a unit slice of canonical_json, status writes go to this
   * real batch_json book_files.id (if a matching unit batch exists).
   */
  statusTargetId?: string | null
  /** Unit number for canonical-sourced virtual nav items. */
  unitNumber?: string | null
  unitId?: string | null
}

export type BatchJsonUnit = {
  unitId?: string
  unitNumber?: string
  title?: string
  theme?: string
  printedPageStart?: number | null
  printedPageEnd?: number | null
  /** 1-based physical PDF index; differs from printed when the source scan omits pages. */
  pdfPageStart?: number | null
  pdfPageEnd?: number | null
}

export type BatchJsonSummary = {
  /** Catalog `book_id` from curriculum JSON (not the Postgres UUID). */
  catalogBookId?: string
  series?: string
  level?: string
  bookType?: string
  units: BatchJsonUnit[]
  vocabulary: Array<{ term?: string; classification?: string; pageId?: string }>
  language: Array<{ prompt?: string; response?: string; languageType?: string }>
  activities: Array<{ title?: string; activityType?: string; pageId?: string }>
  pages: Array<{
    printedPage?: number | null
    pdfPage?: number | null
    sectionTitle?: string
    sectionType?: string
  }>
  raw: unknown
}
