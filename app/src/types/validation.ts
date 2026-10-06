/** Validation / verification workflow types for Phase 1 unit batches. */

export type BookFileStatus = 'pending' | 'needs_review' | 'verified'

export type BookFileBatch = {
  id: string
  bookId: string
  fileType: string
  bucket: string
  storagePath: string
  filename: string | null
  label: string | null
  status: BookFileStatus | null
  mimeType: string | null
  fileSize: number | null
}

export type BatchJsonUnit = {
  unitId?: string
  unitNumber?: string
  title?: string
  theme?: string
  printedPageStart?: number | null
  printedPageEnd?: number | null
}

export type BatchJsonSummary = {
  bookId?: string
  series?: string
  level?: string
  bookType?: string
  units: BatchJsonUnit[]
  vocabulary: Array<{ term?: string; classification?: string; pageId?: string }>
  language: Array<{ prompt?: string; response?: string; languageType?: string }>
  activities: Array<{ title?: string; activityType?: string; pageId?: string }>
  pages: Array<{ printedPage?: number | null; sectionTitle?: string; sectionType?: string }>
  raw: unknown
}
