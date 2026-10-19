import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { TeacherChoiceLessonContext } from './teacherChoicePrototypeContent'
import { BE2_U08_AI_SUGGESTIONS } from './teacherChoiceSuggestions'

interface TeacherChoiceFlowOverlayProps {
  open: boolean
  onClose: () => void
  lesson: TeacherChoiceLessonContext
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
  return 'Coming next'
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

  useEffect(() => {
    if (!open) {
      setStep(1)
      setSelectedIds([])
      setOpenEvidenceIds([])
      setTeacherAdditions([])
      setNewFrame('')
      setNewNote('')
      return
    }

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

  const selectedSuggestions = useMemo(
    () => BE2_U08_AI_SUGGESTIONS.filter((item) => selectedIds.includes(item.id)),
    [selectedIds],
  )

  if (!open) return null

  const stepName = stepNameFor(step)
  const selectedCount = selectedIds.length
  const teacherAddedCount = teacherAdditions.length
  const canAddFrame = newFrame.trim().length > 0
  const useTwoColumnSelected = selectedSuggestions.length >= 2

  const handleContinue = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/45 p-3 sm:items-center sm:p-5 lg:p-8">
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
                  <p>Current focus: {lesson.currentFocus}</p>
                </div>
              </div>

              <section className="space-y-2.5" aria-label="Current vocabulary">
                <h3 className="text-sm font-medium text-slate-800">Current vocabulary</h3>
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
                    No vocabulary preview is available for this unit yet.
                  </p>
                )}
              </section>

              <section className="space-y-2.5" aria-label="Current language">
                <h3 className="text-sm font-medium text-slate-800">Current language</h3>
                {lesson.languageExamples.length > 0 ? (
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
                ) : (
                  <p className="text-sm text-slate-500">
                    No language examples are available for this unit yet.
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
                  AI found four useful language patterns from earlier units in this book. Choose only
                  what helps this lesson.
                </p>
              </div>

              <ul
                className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5"
                aria-label="AI prior-learning suggestions"
              >
                {BE2_U08_AI_SUGGESTIONS.map((suggestion) => {
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

              <p className="text-sm text-slate-500">
                You can continue without selecting any prior learning.
              </p>
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

          {step === 4 ? (
            <div className="mx-auto w-full max-w-[46rem] space-y-3 py-8">
              <h2
                id={titleId}
                className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.75rem]"
              >
                Step 4 prototype coming next
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-slate-600">
                This micro-step stops here. No prompt has been generated.
              </p>
            </div>
          ) : null}
        </div>

        <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-3.5 sm:px-6 lg:px-8">
          <p className="min-w-[5.5rem] text-sm text-slate-500">
            {step === 2 || step === 3
              ? footerSummary(selectedCount, step === 3 ? teacherAddedCount : 0)
              : null}
          </p>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="rounded-md px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                Back
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
            ) : (
              <button
                ref={continueRef}
                type="button"
                onClick={onClose}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
              >
                Back to workspace
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>,
    document.body,
  )
}
