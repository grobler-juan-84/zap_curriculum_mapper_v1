import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { chalkieLessonDraftService } from '../../services/chalkieLessonDraftService'
import {
  BE2_U08_SERIES_LESSON1_VOCAB,
  BE2_U08_SERIES_LESSON2_VOCAB,
  buildChalkiePromptPreview,
  lessonTitleForPackage,
  type LessonPackageShape,
} from './buildChalkiePromptPreview'
import type { ChalkieLessonContext } from './resolveChalkieLessonContext'

interface TeacherChoiceFlowOverlayProps {
  open: boolean
  onClose: () => void
  lesson: ChalkieLessonContext | null
}

type TeacherAddedLanguage = {
  id: string
  frame: string
  note: string
}

const TOTAL_STEPS = 4

function stepNameFor(step: number): string {
  if (step === 1) return 'Current lesson'
  if (step === 2) return 'Prior learning'
  if (step === 3) return 'Your choices'
  return 'Lesson inputs'
}

function footerSummary(selectedCount: number, teacherAddedCount: number): string {
  if (selectedCount === 0 && teacherAddedCount === 0) {
    return 'No prior learning selected'
  }
  const selectedPart = `${selectedCount} selected`
  if (teacherAddedCount === 0) return selectedPart
  return `${selectedPart} · ${teacherAddedCount} teacher-added`
}

export const TeacherChoiceFlowOverlay: React.FC<TeacherChoiceFlowOverlayProps> = ({
  open,
  onClose,
  lesson,
}) => {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const continueRef = useRef<HTMLButtonElement>(null)
  const [step, setStep] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [openEvidenceIds, setOpenEvidenceIds] = useState<string[]>([])
  const [teacherAdditions, setTeacherAdditions] = useState<TeacherAddedLanguage[]>([])
  const [newFrame, setNewFrame] = useState('')
  const [newNote, setNewNote] = useState('')
  const [showPromptPreview, setShowPromptPreview] = useState(false)
  const [promptPreview, setPromptPreview] = useState('')
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [titleCopyStatus, setTitleCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [lessonShape, setLessonShape] = useState<LessonPackageShape>('single')
  const [generatingDraft, setGeneratingDraft] = useState(false)
  const [draftMarkdown, setDraftMarkdown] = useState('')
  const [draftError, setDraftError] = useState<string | null>(null)
  const [draftCopyStatus, setDraftCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [draftMeta, setDraftMeta] = useState<{
    packageType: LessonPackageShape
    displayTitle: string
  } | null>(null)

  const clearGeneratedDraft = () => {
    setGeneratingDraft(false)
    setDraftMarkdown('')
    setDraftError(null)
    setDraftCopyStatus('idle')
    setDraftMeta(null)
  }

  useEffect(() => {
    if (!open) {
      setStep(1)
      setSelectedIds([])
      setOpenEvidenceIds([])
      setTeacherAdditions([])
      setNewFrame('')
      setNewNote('')
      setShowPromptPreview(false)
      setPromptPreview('')
      setCopyStatus('idle')
      setTitleCopyStatus('idle')
      setLessonShape('single')
      clearGeneratedDraft()
      return
    }

    setLessonShape('single')

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => {
      continueRef.current?.focus()
    }, 0)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  const priorLearningSuggestions = lesson?.priorLearningSuggestions ?? []

  const selectedSuggestions = useMemo(
    () => priorLearningSuggestions.filter((item) => selectedIds.includes(item.id)),
    [priorLearningSuggestions, selectedIds],
  )

  if (!open || !lesson) return null

  const stepName = stepNameFor(step)
  const selectedCount = selectedIds.length
  const teacherAddedCount = teacherAdditions.length
  const canAddFrame = newFrame.trim().length > 0
  const useTwoColumnSelected = selectedSuggestions.length >= 2
  const effectiveLessonShape: LessonPackageShape =
    lessonShape === 'series' && lesson.supportsTwoLessonSeries ? 'series' : 'single'
  const activeLessonTitle = lessonTitleForPackage(lesson, effectiveLessonShape)
  const isSeriesPreview = showPromptPreview && effectiveLessonShape === 'series'
  const hasPriorLearningSuggestions = priorLearningSuggestions.length > 0

  const handleContinue = () => {
    if (step < 4) {
      setShowPromptPreview(false)
      setCopyStatus('idle')
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (showPromptPreview) {
      setShowPromptPreview(false)
      setCopyStatus('idle')
      clearGeneratedDraft()
      return
    }
    if (step > 1) setStep(step - 1)
  }

  const handlePackageShapeChange = (next: LessonPackageShape) => {
    if (next === 'series' && !lesson.supportsTwoLessonSeries) return
    setLessonShape(next)
    setTitleCopyStatus('idle')
    clearGeneratedDraft()
    if (showPromptPreview) {
      setShowPromptPreview(false)
      setPromptPreview('')
      setCopyStatus('idle')
    }
  }

  const handleGeneratePromptPreview = () => {
    const assembled = buildChalkiePromptPreview({
      lesson,
      packageShape: effectiveLessonShape,
      selectedSuggestions,
      teacherAdditions,
    })
    setPromptPreview(assembled)
    setShowPromptPreview(true)
    setCopyStatus('idle')
    setTitleCopyStatus('idle')
    clearGeneratedDraft()
  }

  const handleGenerateLessonDraft = async () => {
    if (!promptPreview || generatingDraft) return
    setGeneratingDraft(true)
    setDraftError(null)
    setDraftCopyStatus('idle')
    try {
      const result = await chalkieLessonDraftService.generate({
        assembledPrompt: promptPreview,
        packageType: effectiveLessonShape,
        displayTitle: activeLessonTitle,
      })
      setDraftMarkdown(result.draftMarkdown)
      setDraftMeta({
        packageType: result.packageType,
        displayTitle: result.displayTitle,
      })
    } catch (err) {
      setDraftMarkdown('')
      setDraftMeta(null)
      setDraftError(err instanceof Error ? err.message : 'Generation failed.')
    } finally {
      setGeneratingDraft(false)
    }
  }

  const handleCopyGeneratedDraft = async () => {
    if (!draftMarkdown) return
    try {
      await navigator.clipboard.writeText(draftMarkdown)
      setDraftCopyStatus('copied')
      window.setTimeout(() => setDraftCopyStatus('idle'), 2000)
    } catch {
      setDraftCopyStatus('failed')
    }
  }

  const handleCopyPrompt = async () => {
    if (!promptPreview) return
    try {
      await navigator.clipboard.writeText(promptPreview)
      setCopyStatus('copied')
      window.setTimeout(() => setCopyStatus('idle'), 2000)
    } catch {
      setCopyStatus('failed')
    }
  }

  const handleCopyLessonTitle = async () => {
    try {
      await navigator.clipboard.writeText(activeLessonTitle)
      setTitleCopyStatus('copied')
      window.setTimeout(() => setTitleCopyStatus('idle'), 2000)
    } catch {
      setTitleCopyStatus('failed')
    }
  }

  const toggleSuggestion = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const toggleEvidence = (id: string) => {
    setOpenEvidenceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const handleAddTeacherLanguage = () => {
    const frame = newFrame.trim()
    if (!frame) return
    setTeacherAdditions((prev) => [
      ...prev,
      {
        id: `teacher-added-${Date.now()}-${prev.length + 1}`,
        frame,
        note: newNote.trim(),
      },
    ])
    setNewFrame('')
    setNewNote('')
  }

  const handleRemoveTeacherLanguage = (id: string) => {
    setTeacherAdditions((prev) => prev.filter((item) => item.id !== id))
  }

  const handleUseNoPriorLearning = () => {
    setSelectedIds([])
    setTeacherAdditions([])
    setNewFrame('')
    setNewNote('')
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/45 p-3 sm:p-5 lg:p-8">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[92vh] w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl sm:w-[min(80vw,1440px)]"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <p className="text-xs text-slate-500">
              {step} of {TOTAL_STEPS}
              <span className="mx-2 text-slate-300" aria-hidden="true">
                ·
              </span>
              <span className="text-slate-700">{stepName}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2.5 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Cancel
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
          {step === 1 ? (
            <div className="mx-auto w-full max-w-[46rem] space-y-7">
              <div className="space-y-3">
                <h2
                  id={titleId}
                  className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.75rem]"
                >
                  What are you teaching now?
                </h2>
                <div className="space-y-1 text-sm leading-relaxed text-slate-600">
                  <p className="font-medium text-slate-800">{lesson.bookLabel}</p>
                  <p>{lesson.unitLine}</p>
                  <p>Visible pages: {lesson.visiblePageRangeLabel}</p>
                  <p>Page sections: {lesson.currentFocus}</p>
                </div>
                {lesson.teachingFocus ? (
                  <div className="space-y-1 text-sm leading-relaxed text-slate-600">
                    <p>
                      <span className="font-medium text-slate-800">Teaching focus:</span>{' '}
                      {lesson.teachingFocus}
                    </p>
                    <p className="text-slate-500">
                      Planning summary derived from verified evidence — not a publisher quotation.
                    </p>
                  </div>
                ) : null}
                {lesson.unitContextNote ? (
                  <p className="text-sm leading-relaxed text-slate-500">{lesson.unitContextNote}</p>
                ) : null}
              </div>

              <section className="space-y-2.5" aria-label="Current words and models">
                <h3 className="text-sm font-medium text-slate-800">Current words and models</h3>
                {lesson.vocabulary.length > 0 ? (
                  <>
                    <ul className="flex flex-wrap gap-2">
                      {lesson.vocabulary.map((term) => (
                        <li
                          key={term}
                          className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                        >
                          {term}
                        </li>
                      ))}
                    </ul>
                    {lesson.hasActivityDerivedModels && !lesson.hasDedicatedVocabulary ? (
                      <p className="text-sm text-slate-500">
                        From verified activity items (not dedicated vocabulary rows).
                      </p>
                    ) : null}
                    {lesson.hasDedicatedVocabulary && lesson.hasActivityDerivedModels ? (
                      <p className="text-sm text-slate-500">
                        Includes dedicated vocabulary rows and activity-derived models.
                      </p>
                    ) : null}
                  </>
                ) : (
                  <p className="text-sm text-slate-500">
                    No dedicated vocabulary rows or safely extractable activity-derived models are
                    available for these pages yet.
                  </p>
                )}
              </section>

              <section className="space-y-2.5" aria-label="Current language">
                <h3 className="text-sm font-medium text-slate-800">Current language</h3>
                {lesson.languageExamples.length > 0 ? (
                  <>
                    <ul className="space-y-2 text-sm leading-relaxed text-slate-700">
                      {lesson.languageExamples.map((item) => (
                        <li key={`${item.label ?? ''}:${item.example}`}>
                          {item.label ? (
                            <>
                              <span className="font-medium text-slate-800">{item.label}:</span>{' '}
                              <span>{item.example}</span>
                            </>
                          ) : (
                            item.example
                          )}
                        </li>
                      ))}
                    </ul>
                    {lesson.hasActivityLanguageFrames && !lesson.hasDedicatedLanguage ? (
                      <p className="text-sm text-slate-500">
                        No separate language entity is linked; verified activity language frames are
                        shown.
                      </p>
                    ) : null}
                  </>
                ) : (
                  <p className="text-sm text-slate-500">
                    No dedicated language rows or verified activity language frames are available for
                    these pages yet.
                  </p>
                )}
                {lesson.clarification ? (
                  <p className="pt-1 text-sm leading-relaxed text-slate-600">
                    <span className="font-medium text-slate-700">Note:</span> {lesson.clarification}
                  </p>
                ) : null}
              </section>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-7">
              <div className="max-w-3xl space-y-3">
                <h2
                  id={titleId}
                  className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.75rem]"
                >
                  What might be useful to reuse?
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  {hasPriorLearningSuggestions
                    ? 'Verified prior-learning suggestions from earlier units in this book. Choose only what helps this lesson.'
                    : 'Prior-learning suggestions are only available when verified for the current lesson source.'}
                </p>
              </div>

              {hasPriorLearningSuggestions ? (
                <ul
                  className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5"
                  aria-label="AI prior-learning suggestions"
                >
                  {priorLearningSuggestions.map((suggestion) => {
                    const checked = selectedIds.includes(suggestion.id)
                    const evidenceOpen = openEvidenceIds.includes(suggestion.id)
                    const checkboxId = `teacher-choice-${suggestion.id}`
                    return (
                      <li
                        key={suggestion.id}
                        className={`rounded-xl border p-4 transition-colors sm:p-5 ${
                          checked
                            ? 'border-indigo-200 bg-indigo-50/50'
                            : 'border-slate-200/80 bg-slate-50/40'
                        }`}
                      >
                        <div className="flex h-full gap-3">
                          <input
                            id={checkboxId}
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleSuggestion(suggestion.id)}
                            className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            aria-describedby={`${checkboxId}-details`}
                          />
                          <div id={`${checkboxId}-details`} className="min-w-0 flex-1 space-y-2.5">
                            <div className="space-y-0.5">
                              <label
                                htmlFor={checkboxId}
                                className="block text-sm font-medium text-slate-900"
                              >
                                {suggestion.label}
                              </label>
                              <p className="text-xs text-slate-500">{suggestion.source}</p>
                            </div>
                            <p className="text-[0.95rem] leading-relaxed text-slate-900">
                              {suggestion.frame}
                            </p>
                            <p className="text-sm leading-relaxed text-slate-600">
                              <span className="font-medium text-slate-700">Why it may help:</span>{' '}
                              {suggestion.whyItMayHelp}
                            </p>
                            <p className="text-sm leading-relaxed text-slate-500">
                              <span className="font-medium text-slate-600">Caution:</span>{' '}
                              {suggestion.caution}
                            </p>
                            <div>
                              <button
                                type="button"
                                onClick={() => toggleEvidence(suggestion.id)}
                                className="text-sm text-slate-500 underline-offset-2 transition-colors hover:text-slate-700 hover:underline"
                                aria-expanded={evidenceOpen}
                              >
                                Why this suggestion?
                              </button>
                              {evidenceOpen ? (
                                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                                  {suggestion.evidenceNote}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
                  No verified prior-learning suggestions are available for this lesson yet. You can
                  continue without selecting prior learning.
                </p>
              )}

              {hasPriorLearningSuggestions ? (
                <p className="text-sm text-slate-500">
                  You can continue without selecting any prior learning.
                </p>
              ) : null}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-9">
              <div className="max-w-3xl space-y-3">
                <h2
                  id={titleId}
                  className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.75rem]"
                >
                  What do you choose?
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  Choose the prior learning that will be available to support this lesson.
                </p>
              </div>

              <section className="space-y-4" aria-label="Selected prior learning">
                <h3 className="text-sm font-medium text-slate-800">Selected prior learning</h3>

                {selectedSuggestions.length === 0 ? (
                  <p className="max-w-xl text-sm leading-relaxed text-slate-500">
                    No prior learning is selected yet. That is a valid choice for this lesson.
                  </p>
                ) : (
                  <ul
                    className={`grid grid-cols-1 gap-4 ${
                      useTwoColumnSelected ? 'md:grid-cols-2 md:gap-5' : 'max-w-xl'
                    }`}
                  >
                    {selectedSuggestions.map((suggestion) => {
                      const checkboxId = `teacher-choice-selected-${suggestion.id}`
                      return (
                        <li
                          key={suggestion.id}
                          className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-4 sm:p-5"
                        >
                          <div className="flex gap-3">
                            <input
                              id={checkboxId}
                              type="checkbox"
                              checked
                              onChange={() => toggleSuggestion(suggestion.id)}
                              className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <div className="min-w-0 flex-1 space-y-2">
                              <div className="space-y-0.5">
                                <label
                                  htmlFor={checkboxId}
                                  className="block text-sm font-medium text-slate-900"
                                >
                                  {suggestion.label}
                                </label>
                                <p className="text-xs text-slate-500">{suggestion.source}</p>
                              </div>
                              <p className="text-[0.95rem] leading-relaxed text-slate-900">
                                {suggestion.frame}
                              </p>
                              <p className="text-sm text-slate-500">Available for this lesson</p>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>

              <section className="max-w-2xl space-y-4" aria-label="Add language of your own">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-slate-800">Add language of your own</h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Add a useful language frame for this class when it is not in the suggested
                    choices.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="teacher-added-frame"
                      className="block text-sm text-slate-700"
                    >
                      Language frame
                    </label>
                    <input
                      id="teacher-added-frame"
                      type="text"
                      value={newFrame}
                      onChange={(event) => setNewFrame(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' && canAddFrame) {
                          event.preventDefault()
                          handleAddTeacherLanguage()
                        }
                      }}
                      placeholder="e.g. What is it? / What are they?"
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="teacher-added-note" className="block text-sm text-slate-700">
                      Optional note
                    </label>
                    <input
                      id="teacher-added-note"
                      type="text"
                      value={newNote}
                      onChange={(event) => setNewNote(event.target.value)}
                      placeholder="Why this helps your class"
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={!canAddFrame}
                    onClick={handleAddTeacherLanguage}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      canAddFrame
                        ? 'bg-slate-800 text-white hover:bg-slate-700'
                        : 'cursor-not-allowed bg-slate-200 text-slate-500'
                    }`}
                  >
                    Add
                  </button>
                </div>

                {teacherAdditions.length > 0 ? (
                  <ul className="space-y-3" aria-label="Teacher-added language">
                    {teacherAdditions.map((item) => (
                      <li
                        key={item.id}
                        className="rounded-xl border border-slate-200 bg-slate-50/50 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 space-y-1.5">
                            <p className="text-[0.95rem] leading-relaxed text-slate-900">
                              {item.frame}
                            </p>
                            {item.note ? (
                              <p className="text-sm leading-relaxed text-slate-600">{item.note}</p>
                            ) : null}
                            <p className="text-sm text-slate-600">
                              <span className="font-medium text-slate-700">
                                Teacher-added · unverified
                              </span>
                            </p>
                            <p className="text-sm leading-relaxed text-slate-500">
                              Useful for this class, but not currently verified as prior-book
                              evidence.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveTeacherLanguage(item.id)}
                            className="shrink-0 rounded-md px-2 py-1 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>

              <section className="max-w-2xl space-y-2" aria-label="Use no prior learning">
                <button
                  type="button"
                  onClick={handleUseNoPriorLearning}
                  className="text-sm font-medium text-slate-700 underline-offset-2 transition-colors hover:text-slate-900 hover:underline"
                >
                  Use no prior learning for this lesson
                </button>
              </section>
            </div>
          ) : null}

          {step === 4 && !showPromptPreview ? (
            <div className="space-y-8">
              <div className="max-w-3xl space-y-3">
                <h2
                  id={titleId}
                  className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.75rem]"
                >
                  What will support this lesson?
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  Review the current lesson and chosen prior learning before preparing a prompt.
                </p>
              </div>

              <section className="max-w-3xl space-y-3" aria-label="Lesson title">
                <h3 className="text-sm font-medium text-slate-800">Lesson title</h3>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <p className="select-text text-sm leading-relaxed text-slate-800">
                    {activeLessonTitle}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyLessonTitle}
                    className="shrink-0 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    {titleCopyStatus === 'copied' ? 'Copied' : 'Copy title'}
                  </button>
                </div>
                {titleCopyStatus === 'failed' ? (
                  <p className="text-sm text-slate-500">
                    Copying was unavailable. Select the title text and copy it manually.
                  </p>
                ) : null}
              </section>

              <section className="max-w-3xl space-y-3" aria-label="How should this be packaged?">
                <h3 className="text-sm font-medium text-slate-800">How should this be packaged?</h3>
                <div className="space-y-3">
                  <label className="flex cursor-pointer gap-3">
                    <input
                      type="radio"
                      name="lesson-shape"
                      value="single"
                      checked={effectiveLessonShape === 'single'}
                      onChange={() => handlePackageShapeChange('single')}
                      className="mt-1 h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="min-w-0 space-y-0.5">
                      <span className="block text-sm font-medium text-slate-900">Single lesson</span>
                      <span className="block text-sm leading-relaxed text-slate-600">
                        One short lesson supporting Student Book {lesson.visiblePageRangeLabel}.
                      </span>
                    </span>
                  </label>

                  {lesson.supportsTwoLessonSeries ? (
                    <label className="flex cursor-pointer gap-3">
                      <input
                        type="radio"
                        name="lesson-shape"
                        value="series"
                        checked={effectiveLessonShape === 'series'}
                        onChange={() => handlePackageShapeChange('series')}
                        className="mt-1 h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        aria-describedby={
                          effectiveLessonShape === 'series'
                            ? 'lesson-shape-series-note'
                            : undefined
                        }
                      />
                      <span className="min-w-0 space-y-1">
                        <span className="block text-sm font-medium text-slate-900">
                          Two-lesson series
                        </span>
                        <span className="block text-sm leading-relaxed text-slate-600">
                          Separate introduction and practice across Student Book and Workbook pages.
                        </span>
                        {effectiveLessonShape === 'series' ? (
                          <span
                            id="lesson-shape-series-note"
                            className="mt-1 block space-y-0.5 text-sm leading-relaxed text-slate-500"
                          >
                            <span className="block">Lesson 1 — Student Book pp. 128–129</span>
                            <span className="block">Lesson 2 — Workbook pp. 104–105</span>
                            <span className="block pt-1">
                              Workbook pages are verified source evidence for this packaging choice;
                              they may not be the PDF currently open in the workspace.
                            </span>
                          </span>
                        ) : null}
                      </span>
                    </label>
                  ) : (
                    <p className="text-sm leading-relaxed text-slate-500">
                      A two-lesson Student Book → Workbook series is not available for this source
                      route yet.
                    </p>
                  )}
                </div>
              </section>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
                <section className="space-y-4" aria-label="Current lesson requirements">
                  <h3 className="text-sm font-medium text-slate-800">Current lesson requirements</h3>
                  <div className="space-y-1 text-sm leading-relaxed text-slate-600">
                    <p className="font-medium text-slate-800">{lesson.bookLabel}</p>
                    <p>{lesson.unitLine}</p>
                    <p>Visible pages: {lesson.visiblePageRangeLabel}</p>
                    <p>Page sections: {lesson.currentFocus}</p>
                    {lesson.teachingFocus ? (
                      <p>
                        <span className="font-medium text-slate-700">Teaching focus:</span>{' '}
                        {lesson.teachingFocus}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-800">Current words and models</h4>
                    {lesson.vocabulary.length > 0 ? (
                      <ul className="flex flex-wrap gap-2">
                        {lesson.vocabulary.map((term) => (
                          <li
                            key={term}
                            className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                          >
                            {term}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500">
                        No dedicated vocabulary rows or activity-derived models listed for this
                        lesson.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-800">Current language</h4>
                    {lesson.languageExamples.length > 0 ? (
                      <ul className="space-y-1.5 text-sm leading-relaxed text-slate-700">
                        {lesson.languageExamples.map((item) => (
                          <li key={`${item.label ?? ''}:${item.example}`}>
                            {item.label ? (
                              <>
                                <span className="font-medium text-slate-800">{item.label}:</span>{' '}
                                <span>{item.example}</span>
                              </>
                            ) : (
                              item.example
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500">
                        No dedicated language rows or activity language frames listed for this
                        lesson.
                      </p>
                    )}
                    {lesson.clarification ? (
                      <p className="pt-1 text-sm leading-relaxed text-slate-600">
                        <span className="font-medium text-slate-700">Note:</span>{' '}
                        {lesson.clarification}
                      </p>
                    ) : null}
                  </div>
                </section>

                <div className="space-y-8">
                  <section className="space-y-4" aria-label="Selected prior learning">
                    <h3 className="text-sm font-medium text-slate-800">Selected prior learning</h3>
                    {selectedSuggestions.length === 0 ? (
                      <p className="text-sm leading-relaxed text-slate-500">
                        No verified prior learning was selected for this lesson.
                      </p>
                    ) : (
                      <ul className="space-y-4">
                        {selectedSuggestions.map((suggestion) => (
                          <li key={suggestion.id} className="space-y-1.5">
                            <div className="space-y-0.5">
                              <p className="text-sm font-medium text-slate-900">
                                {suggestion.label}
                              </p>
                              <p className="text-xs text-slate-500">{suggestion.source}</p>
                            </div>
                            <p className="text-sm leading-relaxed text-slate-800">
                              {suggestion.frame}
                            </p>
                            <p className="text-sm text-slate-500">Available for this lesson</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>

                  {teacherAdditions.length > 0 ? (
                    <section className="space-y-4" aria-label="Teacher-added language">
                      <h3 className="text-sm font-medium text-slate-800">Teacher-added language</h3>
                      <ul className="space-y-4">
                        {teacherAdditions.map((item) => (
                          <li key={item.id} className="space-y-1.5">
                            <p className="text-sm leading-relaxed text-slate-900">{item.frame}</p>
                            {item.note ? (
                              <p className="text-sm leading-relaxed text-slate-600">{item.note}</p>
                            ) : null}
                            <p className="text-sm font-medium text-slate-700">
                              Teacher-added · unverified
                            </p>
                            <p className="text-sm leading-relaxed text-slate-500">
                              Useful for this class, but not currently verified as prior-book
                              evidence.
                            </p>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                </div>
              </div>

              <section
                className="max-w-3xl space-y-2 border-t border-slate-100 pt-6"
                aria-label="Use guidance"
              >
                <h3 className="text-sm font-medium text-slate-800">Use guidance</h3>
                <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-600">
                  <li>Use selected language only where it fits naturally.</li>
                  <li>Do not force every selected frame into every activity.</li>
                  <li>
                    Do not present teacher-added or mapper-generated wording as publisher text.
                  </li>
                  <li>
                    These selections are available lesson inputs; they do not automatically create a
                    lesson.
                  </li>
                </ul>
              </section>
            </div>
          ) : null}

          {step === 4 && showPromptPreview ? (
            <div className="flex w-full flex-col gap-5">
              <div className="space-y-3">
                <h2
                  id={titleId}
                  className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.75rem]"
                >
                  Chalkie prompt preview
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  {isSeriesPreview
                    ? 'This prompt was assembled from the agreed Student Book and Workbook source pages plus your selected lesson inputs.'
                    : 'This prompt was assembled from the visible book pages and your selected lesson inputs.'}
                </p>
              </div>

              <section className="space-y-2" aria-label="Series or lesson title">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <p className="select-text text-sm font-medium leading-relaxed text-slate-800">
                    {activeLessonTitle}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyLessonTitle}
                    className="shrink-0 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    {titleCopyStatus === 'copied' ? 'Copied' : 'Copy title'}
                  </button>
                </div>
                {titleCopyStatus === 'failed' ? (
                  <p className="text-sm text-slate-500">
                    Copying was unavailable. Select the title text and copy it manually.
                  </p>
                ) : null}
              </section>

              {isSeriesPreview ? (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
                  <div className="flex min-w-0 flex-col gap-3 lg:col-span-7">
                    <label htmlFor="chalkie-prompt-preview" className="sr-only">
                      Copy-ready Chalkie prompt
                    </label>
                    <textarea
                      id="chalkie-prompt-preview"
                      readOnly
                      value={promptPreview}
                      rows={24}
                      className="min-h-[20rem] w-full flex-1 resize-y rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-xs leading-relaxed text-slate-800 shadow-xs focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 sm:text-[13px]"
                    />
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleCopyPrompt}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
                      >
                        {copyStatus === 'copied' ? 'Copied' : 'Copy prompt'}
                      </button>
                      {copyStatus === 'failed' ? (
                        <p className="text-sm text-slate-500">
                          Copying was unavailable. Select the prompt text and copy it manually.
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <aside className="flex min-w-0 flex-col gap-4 lg:col-span-5">
                    <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
                      <h3 className="text-sm font-medium text-slate-900">
                        Lesson 1 — Student Book pp. 128–129
                      </h3>
                      <p className="mt-2 text-sm text-slate-500">Source: Student Book pp. 128–129</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-700">
                        Focus: introduce and practise wild-animal vocabulary through the page
                        spread, song context, and the current-unit preference/ability model.
                      </p>
                      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-600">
                        <li>Animal vocabulary</li>
                        <li>To the Zoo!</li>
                        <li>Do you like cheetahs? Yes, I do! Cheetahs can run.</li>
                        <li>
                          Visible page activities: listen/look/say, find/say, game, song/listen,
                          true/false, ask/answer
                        </li>
                      </ul>
                    </section>

                    <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
                      <h3 className="text-sm font-medium text-slate-900">
                        Lesson 2 — Workbook pp. 104–105
                      </h3>
                      <p className="mt-2 text-sm text-slate-500">Source: Workbook pp. 104–105</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-700">
                        Focus: use the matching workbook evidence for animal naming/matching,
                        song-related writing, and a short zoo-animal response.
                      </p>
                      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-600">
                        <li>Animal naming/matching (Look and write / Look and match)</li>
                        <li>Song-related listening/writing</li>
                        <li>What animals do you like seeing at the zoo?</li>
                      </ul>
                    </section>

                    <section className="space-y-2 border-t border-slate-100 pt-4">
                      <h3 className="text-sm font-medium text-slate-800">
                        Prototype lesson allocation
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-500">
                        Planning division only — not a publisher-assigned lesson split.
                      </p>
                      <p className="text-sm leading-relaxed text-slate-700">
                        <span className="font-medium text-slate-800">Lesson 1 vocabulary:</span>{' '}
                        {BE2_U08_SERIES_LESSON1_VOCAB}
                      </p>
                      <p className="text-sm leading-relaxed text-slate-700">
                        <span className="font-medium text-slate-800">Lesson 2 vocabulary:</span>{' '}
                        {BE2_U08_SERIES_LESSON2_VOCAB}
                      </p>
                    </section>
                  </aside>
                </div>
              ) : (
                <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
                  <label htmlFor="chalkie-prompt-preview" className="sr-only">
                    Copy-ready Chalkie prompt
                  </label>
                  <textarea
                    id="chalkie-prompt-preview"
                    readOnly
                    value={promptPreview}
                    rows={22}
                    className="min-h-[18rem] w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-xs leading-relaxed text-slate-800 shadow-xs focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 sm:text-[13px]"
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCopyPrompt}
                      className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
                    >
                      {copyStatus === 'copied' ? 'Copied' : 'Copy prompt'}
                    </button>
                    {copyStatus === 'failed' ? (
                      <p className="text-sm text-slate-500">
                        Copying was unavailable. Select the prompt text and copy it manually.
                      </p>
                    ) : null}
                  </div>
                </div>
              )}

              <section
                className="space-y-4 border-t border-slate-100 pt-5"
                aria-label="Generated Chalkie lesson draft"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-slate-800">
                      Optional model draft
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-500">
                      Sends the local prompt above to a server-side OpenAI test path. Nothing is
                      saved.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={generatingDraft || !promptPreview}
                    onClick={handleGenerateLessonDraft}
                    className={`shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      generatingDraft || !promptPreview
                        ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                        : 'bg-slate-800 text-white hover:bg-slate-700'
                    }`}
                  >
                    {generatingDraft ? 'Generating…' : 'Generate Chalkie lesson draft'}
                  </button>
                </div>

                {draftError ? (
                  <p className="text-sm leading-relaxed text-rose-700" role="alert">
                    {draftError}
                  </p>
                ) : null}

                {draftMarkdown ? (
                  <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-slate-900">
                        Generated Chalkie lesson draft — review before use
                      </h4>
                      <p className="text-sm text-slate-500">
                        {(draftMeta?.packageType ?? effectiveLessonShape) === 'series'
                          ? 'Two-lesson series'
                          : 'Single lesson'}
                        {' · '}
                        {draftMeta?.displayTitle ?? activeLessonTitle}
                      </p>
                      <p className="text-sm text-slate-500">
                        Not saved. Closing this overlay discards the draft.
                      </p>
                    </div>
                    <label htmlFor="chalkie-lesson-draft" className="sr-only">
                      Generated Chalkie lesson draft
                    </label>
                    <textarea
                      id="chalkie-lesson-draft"
                      readOnly
                      value={draftMarkdown}
                      rows={18}
                      className="min-h-[14rem] w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-800 shadow-xs focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleCopyGeneratedDraft}
                        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        {draftCopyStatus === 'copied' ? 'Copied' : 'Copy generated draft'}
                      </button>
                      {draftCopyStatus === 'failed' ? (
                        <p className="text-sm text-slate-500">
                          Copying was unavailable. Select the draft text and copy it manually.
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </section>
            </div>
          ) : null}
        </div>

        <footer className="shrink-0 border-t border-slate-100 px-5 py-3.5 sm:px-6 lg:px-8">
          {step === 4 && !showPromptPreview ? (
            <p className="mb-3 text-sm text-slate-500">
              No Chalkie prompt has been generated yet.
            </p>
          ) : null}
          {step === 4 && showPromptPreview ? (
            <p className="mb-3 text-sm text-slate-500">
              {draftMarkdown
                ? 'Local prompt preview plus an unsaved model draft. Nothing is persisted.'
                : 'Local preview only. A model draft is optional and not saved.'}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="min-w-[5.5rem] text-sm text-slate-500">
              {step === 2 || step === 3
                ? footerSummary(selectedCount, step === 3 ? teacherAddedCount : 0)
                : step === 4
                  ? footerSummary(selectedCount, teacherAddedCount)
                  : null}
            </p>
            <div className="flex flex-wrap items-center justify-end gap-2">
              {step > 1 || showPromptPreview ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded-md px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  {showPromptPreview ? 'Back to lesson inputs' : 'Back'}
                </button>
              ) : null}
              <button
                type="button"
                onClick={onClose}
                className="rounded-md px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                Cancel
              </button>
              {step < 4 ? (
                <button
                  ref={continueRef}
                  type="button"
                  onClick={handleContinue}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
                >
                  Continue
                </button>
              ) : showPromptPreview ? (
                <button
                  ref={continueRef}
                  type="button"
                  onClick={onClose}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
                >
                  Back to workspace
                </button>
              ) : (
                <button
                  ref={continueRef}
                  type="button"
                  onClick={handleGeneratePromptPreview}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
                >
                  Generate Chalkie prompt
                </button>
              )}
            </div>
          </div>
        </footer>
      </div>
    </div>,
    document.body,
  )
}
