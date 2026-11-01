/**
 * Book Workspace resume: restore once from precedence, persist on stable location.
 * Does not mark completion or auto-advance lessons.
 */

import { useEffect, useRef } from 'react'
import type { Book, CurriculumSeries } from '../../../types/curriculum'
import type { BookFileBatch } from '../../../types/validation'
import {
  BOOK_WORKSPACE_RESUME_VERSION,
  createBookWorkspaceResumeState,
  readBookWorkspaceResumeState,
  resolveBookWorkspaceResumeLocation,
  validateSavedBookWorkspaceResume,
  writeBookWorkspaceActivePointers,
  writeBookWorkspaceResumeState,
} from './index'

function knownUnitNumbersFromBatches(
  batches: readonly BookFileBatch[],
): number[] {
  const units = new Set<number>()
  for (const batch of batches) {
    const raw = batch.unitNumber
    if (raw == null || raw === '') continue
    const n = Number.parseInt(String(raw), 10)
    if (Number.isFinite(n) && n >= 1) units.add(n)
  }
  return [...units].sort((a, b) => a - b)
}

function pagesKey(pages: readonly number[]): string {
  return [...pages].sort((a, b) => a - b).join(',')
}

export function useBookWorkspaceResume(input: {
  userId: string | null | undefined
  seriesList: readonly CurriculumSeries[]
  series: CurriculumSeries
  book: Book
  batches: readonly BookFileBatch[]
  batchesLoading: boolean
  requestedUnit: string | null
  selectedBatchId: string
  currentUnitNumber: string | null
  lessonPrintedPages: readonly number[]
  jsonLoading: boolean
  setSelectedBatchId: (id: string | ((prev: string) => string)) => void
  applyLessonPages: (pages: readonly number[]) => boolean
  pickBatchIdForUnit: (
    batches: readonly BookFileBatch[],
    unitNumber: string | null,
  ) => string
}): void {
  const {
    userId,
    seriesList,
    series,
    book,
    batches,
    batchesLoading,
    requestedUnit,
    selectedBatchId,
    currentUnitNumber,
    lessonPrintedPages,
    jsonLoading,
    setSelectedBatchId,
    applyLessonPages,
    pickBatchIdForUnit,
  } = input

  const restoreEpochRef = useRef(0)
  const pendingLessonPagesRef = useRef<number[] | null>(null)
  const lastPersistedKeyRef = useRef<string>('')
  const unitRestoreDoneRef = useRef(false)

  // Reset restore state when the primary book changes.
  useEffect(() => {
    restoreEpochRef.current += 1
    pendingLessonPagesRef.current = null
    lastPersistedKeyRef.current = ''
    unitRestoreDoneRef.current = false
  }, [book.id, userId])

  // Unit restore / URL-driven selection.
  useEffect(() => {
    if (batchesLoading || batches.length === 0) return

    // Explicit / history `?unit=` wins for unit selection. When it matches the
    // saved unit (common after URL sync + reload), still restore that unit's
    // saved lesson pages. A different unit is a true override → first lesson.
    if (requestedUnit) {
      const nextId = pickBatchIdForUnit(batches, requestedUnit)
      setSelectedBatchId((prev) => (prev === nextId ? prev : nextId))
      unitRestoreDoneRef.current = true

      const requestedNumber = Number.parseInt(requestedUnit, 10)
      const catalogBookId = book.catalogBookId?.trim()
      if (
        Number.isFinite(requestedNumber) &&
        catalogBookId &&
        !pendingLessonPagesRef.current?.length
      ) {
        const saved = validateSavedBookWorkspaceResume({
          userId,
          saved: readBookWorkspaceResumeState({
            userId,
            catalogBookId,
          }),
          seriesList,
          knownUnitNumbers: knownUnitNumbersFromBatches(batches),
        })
        if (
          saved &&
          saved.unitNumber === requestedNumber &&
          saved.printedPages.length > 0
        ) {
          pendingLessonPagesRef.current = [...saved.printedPages]
        }
      }
      return
    }

    if (unitRestoreDoneRef.current) return

    const knownUnits = knownUnitNumbersFromBatches(batches)
    const resolved = resolveBookWorkspaceResumeLocation({
      userId,
      seriesList,
      selectedBook: book,
      selectedSeriesId: series.id,
      explicitUnitQuery: null,
      knownUnitNumbers: knownUnits,
    })

    unitRestoreDoneRef.current = true
    const unitLabel = resolved ? String(resolved.unitNumber) : null
    const nextId = pickBatchIdForUnit(batches, unitLabel)
    setSelectedBatchId((prev) => (prev === nextId ? prev : nextId))

    if (resolved?.printedPages.length) {
      pendingLessonPagesRef.current = [...resolved.printedPages]
    } else {
      pendingLessonPagesRef.current = null
    }
  }, [
    batchesLoading,
    batches,
    requestedUnit,
    userId,
    seriesList,
    book,
    series.id,
    setSelectedBatchId,
    pickBatchIdForUnit,
  ])

  // Apply deferred lesson pages once unit JSON / page map is ready.
  useEffect(() => {
    const pending = pendingLessonPagesRef.current
    if (!pending?.length) return
    if (!selectedBatchId || !currentUnitNumber) return
    if (jsonLoading) return
    if (requestedUnit && requestedUnit !== currentUnitNumber) return

    // Clear only once the live lesson scope matches the resumed pages.
    if (pagesKey(lessonPrintedPages) === pagesKey(pending)) {
      pendingLessonPagesRef.current = null
      return
    }

    applyLessonPages(pending)
  }, [
    selectedBatchId,
    currentUnitNumber,
    jsonLoading,
    requestedUnit,
    applyLessonPages,
    lessonPrintedPages,
  ])

  // Persist stable Student Book location + last-active book.
  useEffect(() => {
    if (!userId) return
    const catalogBookId = book.catalogBookId?.trim()
    if (!catalogBookId) return
    if (!currentUnitNumber || !selectedBatchId) return
    if (jsonLoading) return
    // Wait until deferred resume pages are applied so we do not clobber them.
    if (pendingLessonPagesRef.current?.length) return
    if (!unitRestoreDoneRef.current) return

    const unitNumber = Number.parseInt(currentUnitNumber, 10)
    if (!Number.isFinite(unitNumber) || unitNumber < 1) return

    // Prefer exact lesson-scope pages; empty means unit-only continuity.
    const printedPages = [...lessonPrintedPages]
    const key = `${catalogBookId}|${unitNumber}|${pagesKey(printedPages)}`
    if (key === lastPersistedKeyRef.current) return
    lastPersistedKeyRef.current = key

    const state = createBookWorkspaceResumeState({
      seriesId: series.id,
      bookId: book.id,
      catalogBookId,
      unitNumber,
      printedPages,
    })
    if (!state) return

    writeBookWorkspaceResumeState({ userId, state })
    writeBookWorkspaceActivePointers({
      userId,
      state: {
        version: BOOK_WORKSPACE_RESUME_VERSION,
        seriesId: series.id,
        bookId: book.id,
        catalogBookId,
        updatedAt: state.updatedAt,
      },
    })
  }, [
    userId,
    book.id,
    book.catalogBookId,
    series.id,
    selectedBatchId,
    currentUnitNumber,
    lessonPrintedPages,
    jsonLoading,
  ])
}
