export {
  BOOK_WORKSPACE_RESUME_VERSION,
  type BookWorkspaceLastActiveBook,
  type BookWorkspaceResumeState,
  type ResolvedBookWorkspaceResumeLocation,
} from './bookWorkspaceResumeTypes'

export {
  bookResumeStorageKey,
  buildLessonKeyFromPrintedPages,
  clearBookWorkspaceResumeState,
  createBookWorkspaceResumeState,
  lastActiveBookForSeriesStorageKey,
  lastActiveBookStorageKey,
  parseBookWorkspaceLastActiveBook,
  parseBookWorkspaceResumeState,
  parseLessonKeyPrintedPages,
  readBookWorkspaceLastActiveBook,
  readBookWorkspaceLastActiveBookForSeries,
  readBookWorkspaceResumeState,
  writeBookWorkspaceActivePointers,
  writeBookWorkspaceLastActiveBook,
  writeBookWorkspaceLastActiveBookForSeries,
  writeBookWorkspaceResumeState,
  type BookWorkspaceResumeStorageDriver,
} from './bookWorkspaceResumeStorage'

export {
  formatBookWorkspaceResumeHint,
  resolveBookWorkspaceResumeLocation,
  resolveLastStudentBookForSeries,
  resolvePrimaryStudentBookForWorkspaceEntry,
  resolveValidLastActiveWorkspaceEntry,
  validateSavedBookWorkspaceResume,
} from './resolveBookWorkspaceResumeLocation'
