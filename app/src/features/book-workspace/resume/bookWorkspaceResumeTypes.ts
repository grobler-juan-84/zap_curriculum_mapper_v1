/**
 * Book Workspace resume location — operational preference only.
 * Not canonical evidence, NLL knowledge, NLP content, or lesson completion.
 */

export const BOOK_WORKSPACE_RESUME_VERSION = 1 as const

export type BookWorkspaceResumeState = {
  readonly version: typeof BOOK_WORKSPACE_RESUME_VERSION
  readonly seriesId: string
  readonly bookId: string
  readonly catalogBookId: string
  readonly unitNumber: number
  /** Stable lesson identity within the unit, e.g. `pages:128-129`. */
  readonly lessonKeyOrAnchor: string | null
  readonly printedPages: readonly number[]
  readonly updatedAt: string
}

export type BookWorkspaceLastActiveBook = {
  readonly version: typeof BOOK_WORKSPACE_RESUME_VERSION
  readonly seriesId: string
  readonly bookId: string
  readonly catalogBookId: string
  readonly updatedAt: string
}

export type ResolvedBookWorkspaceResumeLocation = {
  readonly seriesId: string
  readonly bookId: string
  readonly catalogBookId: string
  readonly unitNumber: number
  readonly lessonKeyOrAnchor: string | null
  readonly printedPages: readonly number[]
  readonly source: 'explicit_query' | 'saved' | 'default_unit_1'
}
