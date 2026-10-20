import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, Copy } from 'lucide-react'
import { buildChalkieConciseOutline } from './buildChalkieConciseOutline'
import {
  BE2_U08_SERIES_LESSON1_VOCAB,
  BE2_U08_SERIES_LESSON2_VOCAB,
  buildChalkiePromptPreview,
  lessonTitleForPackage,
  type LessonPackageShape,
} from './buildChalkiePromptPreview'
import { buildSuggestedChalkieVocabulary } from './buildSuggestedChalkieVocabulary'
import type { ChalkieLessonContext } from './resolveChalkieLessonContext'
import {
  TEACHER_CHOICE_TOTAL_STEPS,
  advanceTeacherChoiceStep,
  appendTeacherAddedLanguage,
  clearPriorLearningSelections,
  footerSelectionSummary,
  retreatTeacherChoiceStep,
  teacherChoiceStepName,
  toggleSelectedSuggestionId,
  type TeacherAddedLanguage,
} from './teacherChoiceFlow'

interface TeacherChoiceFlowOverlayProps {
  open: boolean
  onClose: () => void
  lesson: ChalkieLessonContext | null
}

type CopyFeedback = 'idle' | 'copied' | 'failed'

function HandoffCopyableBox(props: {
  id: string
  value: string
  rows: number
  copyLabel: string
  copyStatus: CopyFeedback
  onCopy: () => void
  disabled?: boolean
  className?: string
  textareaClassName?: string
}) {
  const {
    id,
    value,
    rows,
    copyLabel,
    copyStatus,
    onCopy,
    disabled = false,
    className = '',
    textareaClassName = '',
  } = props
  const label = copyStatus === 'copied' ? 'Copied' : copyLabel

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        {copyLabel.replace(/^Copy /, 'Copy-ready ')}
      </label>
      <textarea
        id={id}
        readOnly
        value={value}
        rows={rows}
        className={`w-full resize-y rounded-lg border border-slate-200 bg-slate-50 py-3 pl-4 pr-11 text-slate-800 shadow-xs focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 ${textareaClassName}`}
      />
      <button
        type="button"
        onClick={onCopy}
        disabled={disabled}
        title={label}
        aria-label={label}
        className={`absolute right-1.5 top-1.5 inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
          disabled
            ? 'cursor-not-allowed text-slate-300'
            : copyStatus === 'copied'
              ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-50'
              : 'text-slate-500 hover:bg-white/80 hover:text-slate-800'
        }`}
      >
        {copyStatus === 'copied' ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </div>
  )
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
  const [teacherAdditions, setTeacherAdditions] = useState<TeacherAddedLanguage[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newFrame, setNewFrame] = useState('')
  const [newPurpose, setNewPurpose] = useState('')
  const [addPriorSkillExpanded, setAddPriorSkillExpanded] = useState(false)
  const [showPromptPreview, setShowPromptPreview] = useState(false)
  const [promptPreview, setPromptPreview] = useState('')
  const [conciseOutline, setConciseOutline] = useState('')
  const [suggestedVocabulary, setSuggestedVocabulary] = useState('')
  const [suggestedVocabularyEmpty, setSuggestedVocabularyEmpty] = useState(false)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [outlineCopyStatus, setOutlineCopyStatus] = useState<'idle' | 'copied' | 'failed'>(
    'idle',
  )
  const [vocabularyCopyStatus, setVocabularyCopyStatus] = useState<
    'idle' | 'copied' | 'failed'
  >('idle')
  const [titleCopyStatus, setTitleCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [lessonShape, setLessonShape] = useState<LessonPackageShape>('single')

  useEffect(() => {
    if (!open) {
      setStep(1)
      setSelectedIds([])
      setTeacherAdditions([])
      setNewTitle('')
      setNewFrame('')
      setNewPurpose('')
      setAddPriorSkillExpanded(false)
      setShowPromptPreview(false)
      setPromptPreview('')
      setConciseOutline('')
      setSuggestedVocabulary('')
      setSuggestedVocabularyEmpty(false)
      setCopyStatus('idle')
      setOutlineCopyStatus('idle')
      setVocabularyCopyStatus('idle')
      setTitleCopyStatus('idle')
      setLessonShape('single')
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

  const selectedTeacherAdditions = useMemo(
    () => teacherAdditions.filter((item) => selectedIds.includes(item.id)),
    [teacherAdditions, selectedIds],
  )

  if (!open || !lesson) return null

  const stepName = teacherChoiceStepName(step)
  const selectedCount = selectedSuggestions.length
  const teacherAddedCount = selectedTeacherAdditions.length
  const canAddPriorSkill =
    newTitle.trim().length > 0 &&
    newFrame.trim().length > 0 &&
    newPurpose.trim().length > 0
  const effectiveLessonShape: LessonPackageShape =
    lessonShape === 'series' && lesson.supportsTwoLessonSeries ? 'series' : 'single'
  const activeLessonTitle = lessonTitleForPackage(lesson, effectiveLessonShape)
  const isSeriesPreview = showPromptPreview && effectiveLessonShape === 'series'
  const hasPriorLearningSuggestions = priorLearningSuggestions.length > 0

  const handleContinue = () => {
    if (step < TEACHER_CHOICE_TOTAL_STEPS) {
      setShowPromptPreview(false)
      setCopyStatus('idle')
      setStep(advanceTeacherChoiceStep(step))
    }
  }

  const handleBack = () => {
    if (showPromptPreview) {
      setShowPromptPreview(false)
      setCopyStatus('idle')
      return
    }
    if (step > 1) setStep(retreatTeacherChoiceStep(step))
  }

  const handlePackageShapeChange = (next: LessonPackageShape) => {
    if (next === 'series' && !lesson.supportsTwoLessonSeries) return
    setLessonShape(next)
    setTitleCopyStatus('idle')
    if (showPromptPreview) {
      setShowPromptPreview(false)
      setPromptPreview('')
      setConciseOutline('')
      setSuggestedVocabulary('')
      setSuggestedVocabularyEmpty(false)
      setCopyStatus('idle')
      setOutlineCopyStatus('idle')
      setVocabularyCopyStatus('idle')
    }
  }

  const handleGeneratePromptPreview = () => {
    const assembled = buildChalkiePromptPreview({
      lesson,
      packageShape: effectiveLessonShape,
      selectedSuggestions,
      teacherAdditions: selectedTeacherAdditions,
    })
    const outline = buildChalkieConciseOutline({
      lesson,
      selectedSuggestions,
    })
    const suggested = buildSuggestedChalkieVocabulary(lesson)
    setPromptPreview(assembled)
    setConciseOutline(outline)
    setSuggestedVocabulary(suggested.copyText)
    setSuggestedVocabularyEmpty(suggested.isEmpty)
    setShowPromptPreview(true)
    setCopyStatus('idle')
    setOutlineCopyStatus('idle')
    setVocabularyCopyStatus('idle')
    setTitleCopyStatus('idle')
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

  const handleCopyOutline = async () => {
    if (!conciseOutline) return
    try {
      await navigator.clipboard.writeText(conciseOutline)
      setOutlineCopyStatus('copied')
      window.setTimeout(() => setOutlineCopyStatus('idle'), 2000)
    } catch {
      setOutlineCopyStatus('failed')
    }
  }

  const handleCopyVocabulary = async () => {
    if (!suggestedVocabulary || suggestedVocabularyEmpty) return
    try {
      await navigator.clipboard.writeText(suggestedVocabulary)
      setVocabularyCopyStatus('copied')
      window.setTimeout(() => setVocabularyCopyStatus('idle'), 2000)
    } catch {
      setVocabularyCopyStatus('failed')
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
    setSelectedIds((prev) => toggleSelectedSuggestionId(prev, id))
  }

  const handleAddPriorSkill = () => {
    if (!canAddPriorSkill) return
    const id = `teacher-added-${Date.now()}-${teacherAdditions.length + 1}`
    setTeacherAdditions((prev) => {
      const next = appendTeacherAddedLanguage(prev, newTitle, newFrame, newPurpose, () => id)
      return next ?? prev
    })
    setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setNewTitle('')
    setNewFrame('')
    setNewPurpose('')
  }

  const handleUseNoPriorLearning = () => {
    const cleared = clearPriorLearningSelections()
    setSelectedIds(cleared.selectedIds)
    setTeacherAdditions(cleared.teacherAdditions)
    setNewTitle('')
    setNewFrame('')
    setNewPurpose('')
    setAddPriorSkillExpanded(false)
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
              {step} of {TEACHER_CHOICE_TOTAL_STEPS}
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
                  {lesson.lessonTopic ? (
                    <p>
                      <span className="font-medium text-slate-800">Lesson topic:</span>{' '}
                      {lesson.lessonTopic}
                    </p>
                  ) : null}
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
            <div className="space-y-8">
              <div className="max-w-3xl space-y-3">
                <h2
                  id={titleId}
                  className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.75rem]"
                >
                  Add Prior Skills
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  {hasPriorLearningSuggestions
                    ? 'Verified prior-learning suggestions from earlier pages or units in this book. You can also add a language frame of your own.'
                    : 'No verified suggestions for this lesson yet. You can add a language frame of your own, or continue with no prior learning.'}
                </p>
              </div>

              <section
                className="rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/30"
                aria-label="Add a prior skill"
              >
                <button
                  type="button"
                  onClick={() => setAddPriorSkillExpanded((open) => !open)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left sm:px-5"
                  aria-expanded={addPriorSkillExpanded}
                  aria-controls="add-prior-skill-panel"
                  id="add-prior-skill-toggle"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-indigo-900">
                      Add a prior skill
                    </span>
                    {!addPriorSkillExpanded ? (
                      <span className="mt-0.5 block text-xs leading-relaxed text-indigo-800/80">
                        Teacher-created · not a verified suggestion
                      </span>
                    ) : null}
                  </span>
                  <span
                    className="shrink-0 text-xs font-medium text-indigo-800"
                    aria-hidden="true"
                  >
                    {addPriorSkillExpanded ? 'Hide' : 'Show'}
                  </span>
                </button>

                {addPriorSkillExpanded ? (
                  <div
                    id="add-prior-skill-panel"
                    role="region"
                    aria-labelledby="add-prior-skill-toggle"
                    className="grid grid-cols-1 gap-4 border-t border-indigo-200/70 px-4 pb-4 pt-3 sm:px-5 sm:pb-5 md:grid-cols-2 md:gap-5"
                  >
                    <div className="space-y-3">
                      <p className="text-xs leading-relaxed text-indigo-800/80">
                        Teacher-created · not a verified suggestion
                      </p>
                      <div className="space-y-2.5">
                        <div className="space-y-1">
                          <label
                            htmlFor="teacher-added-title"
                            className="block text-xs font-medium text-slate-700"
                          >
                            Short title
                          </label>
                          <input
                            id="teacher-added-title"
                            type="text"
                            value={newTitle}
                            onChange={(event) => setNewTitle(event.target.value)}
                            placeholder="e.g. Preference"
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                          />
                        </div>
                        <div className="space-y-1">
                          <label
                            htmlFor="teacher-added-frame"
                            className="block text-xs font-medium text-slate-700"
                          >
                            Language frame
                          </label>
                          <input
                            id="teacher-added-frame"
                            type="text"
                            value={newFrame}
                            onChange={(event) => setNewFrame(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' && canAddPriorSkill) {
                                event.preventDefault()
                                handleAddPriorSkill()
                              }
                            }}
                            placeholder="e.g. Do you like + noun? Yes, I do. / No, I don’t."
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                          />
                        </div>
                        <div className="space-y-1">
                          <label
                            htmlFor="teacher-added-purpose"
                            className="block text-xs font-medium text-slate-700"
                          >
                            Purpose
                          </label>
                          <input
                            id="teacher-added-purpose"
                            type="text"
                            value={newPurpose}
                            onChange={(event) => setNewPurpose(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' && canAddPriorSkill) {
                                event.preventDefault()
                                handleAddPriorSkill()
                              }
                            }}
                            placeholder="e.g. Extends preference talk with this lesson’s vocabulary"
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                          />
                        </div>
                        <button
                          type="button"
                          disabled={!canAddPriorSkill}
                          onClick={handleAddPriorSkill}
                          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                            canAddPriorSkill
                              ? 'bg-[#3766a3] text-white hover:bg-[#2f578c]'
                              : 'cursor-not-allowed bg-slate-200 text-slate-500'
                          }`}
                        >
                          Add prior skill
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200/80 bg-white/70 p-4 sm:p-5">
                      <p className="text-sm leading-relaxed text-slate-700">
                        future instructions to come here
                      </p>
                    </div>
                  </div>
                ) : null}
              </section>

              <ul
                className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5"
                aria-label="Prior skills"
              >
                {teacherAdditions.map((item) => {
                  const checked = selectedIds.includes(item.id)
                  const checkboxId = `teacher-choice-${item.id}`
                  return (
                    <li
                      key={item.id}
                      className={`rounded-xl border p-4 transition-colors sm:p-5 ${
                        checked
                          ? 'border-indigo-200 bg-indigo-50/50'
                          : 'border-dashed border-indigo-200/80 bg-white'
                      }`}
                    >
                      <div className="flex h-full gap-3">
                        <input
                          id={checkboxId}
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleSuggestion(item.id)}
                          className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          aria-describedby={`${checkboxId}-details`}
                        />
                        <div id={`${checkboxId}-details`} className="min-w-0 flex-1 space-y-2.5">
                          <label
                            htmlFor={checkboxId}
                            className="block text-sm font-medium text-slate-900"
                          >
                            {item.title}
                          </label>
                          <p className="text-[0.95rem] leading-relaxed text-slate-900">
                            {item.frame}
                          </p>
                          <p className="text-sm leading-relaxed text-slate-600">
                            <span className="font-medium text-slate-700">Purpose:</span>{' '}
                            {item.purpose}
                          </p>
                        </div>
                      </div>
                    </li>
                  )
                })}

                {priorLearningSuggestions.map((suggestion) => {
                  const checked = selectedIds.includes(suggestion.id)
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
                          <label
                            htmlFor={checkboxId}
                            className="block text-sm font-medium text-slate-900"
                          >
                            {suggestion.label}
                          </label>
                          <p className="text-[0.95rem] leading-relaxed text-slate-900">
                            {suggestion.frame}
                          </p>
                          <p className="text-sm leading-relaxed text-slate-600">
                            <span className="font-medium text-slate-700">Purpose:</span>{' '}
                            {suggestion.whyItMayHelp}
                          </p>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <section className="max-w-2xl space-y-2" aria-label="Continue options">
                <p className="text-sm text-slate-500">
                  You can continue without selecting any prior learning.
                </p>
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

          {step === 3 && !showPromptPreview ? (
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
                  <div className="min-w-0 space-y-1">
                    <p className="select-text text-sm leading-relaxed text-slate-800">
                      {activeLessonTitle}
                    </p>
                    {lesson.stableLessonReference ? (
                      <p className="text-xs text-slate-500">
                        Ref: {lesson.stableLessonReference}
                      </p>
                    ) : null}
                  </div>
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
                    {lesson.lessonTopic ? (
                      <p>
                        <span className="font-medium text-slate-700">Lesson topic:</span>{' '}
                        {lesson.lessonTopic}
                      </p>
                    ) : null}
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

                  {selectedTeacherAdditions.length > 0 ? (
                    <section className="space-y-4" aria-label="Teacher-added prior skills">
                      <h3 className="text-sm font-medium text-slate-800">
                        Teacher-added prior skills
                      </h3>
                      <ul className="space-y-4">
                        {selectedTeacherAdditions.map((item) => (
                          <li key={item.id} className="space-y-1.5">
                            <p className="text-sm font-medium text-slate-900">{item.title}</p>
                            <p className="text-sm leading-relaxed text-slate-900">{item.frame}</p>
                            <p className="text-sm leading-relaxed text-slate-600">
                              <span className="font-medium text-slate-700">Purpose:</span>{' '}
                              {item.purpose}
                            </p>
                            <p className="text-sm font-medium text-slate-700">
                              Teacher-added · unverified
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

          {step === 3 && showPromptPreview ? (
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

              <section className="mx-auto w-full max-w-4xl space-y-2" aria-label="Series or lesson title">
                <h3 className="text-sm font-medium text-slate-800">Lesson title</h3>
                <HandoffCopyableBox
                  id="chalkie-lesson-title-handoff"
                  value={activeLessonTitle}
                  rows={2}
                  copyLabel="Copy title"
                  copyStatus={titleCopyStatus}
                  onCopy={handleCopyLessonTitle}
                  textareaClassName="min-h-[2.75rem] resize-none text-sm font-medium leading-relaxed"
                />
                {lesson.stableLessonReference ? (
                  <p className="text-xs text-slate-500">
                    Ref: {lesson.stableLessonReference}
                  </p>
                ) : null}
                {titleCopyStatus === 'failed' ? (
                  <p className="text-sm text-slate-500">
                    Copying was unavailable. Select the title text and copy it manually.
                  </p>
                ) : null}
              </section>

              {isSeriesPreview ? (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
                  <div className="flex min-w-0 flex-col gap-2 lg:col-span-7">
                    <h3 className="text-sm font-medium text-slate-800">Detailed Chalkie prompt</h3>
                    <HandoffCopyableBox
                      id="chalkie-prompt-preview"
                      value={promptPreview}
                      rows={24}
                      copyLabel="Copy prompt"
                      copyStatus={copyStatus}
                      onCopy={handleCopyPrompt}
                      className="flex-1"
                      textareaClassName="min-h-[20rem] font-mono text-xs leading-relaxed sm:text-[13px]"
                    />
                    {copyStatus === 'failed' ? (
                      <p className="text-sm text-slate-500">
                        Copying was unavailable. Select the prompt text and copy it manually.
                      </p>
                    ) : null}
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
                <div className="mx-auto flex w-full max-w-4xl flex-col gap-2">
                  <h3 className="text-sm font-medium text-slate-800">Detailed Chalkie prompt</h3>
                  <HandoffCopyableBox
                    id="chalkie-prompt-preview"
                    value={promptPreview}
                    rows={22}
                    copyLabel="Copy prompt"
                    copyStatus={copyStatus}
                    onCopy={handleCopyPrompt}
                    textareaClassName="min-h-[18rem] font-mono text-xs leading-relaxed sm:text-[13px]"
                  />
                  {copyStatus === 'failed' ? (
                    <p className="text-sm text-slate-500">
                      Copying was unavailable. Select the prompt text and copy it manually.
                    </p>
                  ) : null}
                </div>
              )}

              {conciseOutline ? (
                <section
                  className="mx-auto w-full max-w-4xl space-y-3 border-t border-slate-100 pt-5"
                  aria-label="Concise teacher-controlled outline"
                >
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-slate-800">
                      Concise teacher-controlled outline
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-500">
                      Local short teaching sequence for the current pages. Separate from the
                      detailed prompt above. Not a slide-by-slide script.
                    </p>
                  </div>
                  <HandoffCopyableBox
                    id="chalkie-concise-outline"
                    value={conciseOutline}
                    rows={12}
                    copyLabel="Copy outline"
                    copyStatus={outlineCopyStatus}
                    onCopy={handleCopyOutline}
                    textareaClassName="min-h-[12rem] font-mono text-xs leading-relaxed sm:text-[13px]"
                  />
                  {outlineCopyStatus === 'failed' ? (
                    <p className="text-sm text-slate-500">
                      Copying was unavailable. Select the outline text and copy it manually.
                    </p>
                  ) : null}
                </section>
              ) : null}

              <section
                className="mx-auto w-full max-w-4xl space-y-3 border-t border-slate-100 pt-5"
                aria-label="Suggested Chalkie vocabulary"
              >
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-slate-800">
                    Suggested Chalkie vocabulary
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">
                    Current-page words/models suggested for Chalkie’s vocabulary field. Review
                    before pasting.
                  </p>
                </div>
                {suggestedVocabularyEmpty ? (
                  <p className="text-sm leading-relaxed text-slate-600">
                    No verified current-page words or models are available for Chalkie’s vocabulary
                    field on these pages.
                  </p>
                ) : (
                  <HandoffCopyableBox
                    id="chalkie-suggested-vocabulary"
                    value={suggestedVocabulary}
                    rows={3}
                    copyLabel="Copy vocabulary"
                    copyStatus={vocabularyCopyStatus}
                    onCopy={handleCopyVocabulary}
                    textareaClassName="min-h-[4.5rem] font-mono text-xs leading-relaxed sm:text-[13px]"
                  />
                )}
                {vocabularyCopyStatus === 'failed' ? (
                  <p className="text-sm text-slate-500">
                    Copying was unavailable. Select the vocabulary text and copy it manually.
                  </p>
                ) : null}
              </section>
            </div>
          ) : null}
        </div>

        <footer className="shrink-0 border-t border-slate-200/60 bg-[#8bcfd9] px-5 py-3.5 sm:px-6 lg:px-8">
          {step === 3 && !showPromptPreview ? (
            <p className="mb-3 text-sm text-slate-500">
              No Chalkie prompt has been prepared yet.
            </p>
          ) : null}
          {step === 3 && showPromptPreview ? (
            <p className="mb-3 text-sm text-slate-500">
              Prepared locally from verified curriculum evidence and your selections. No AI
              generation was used.
            </p>
          ) : null}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="min-w-[5.5rem] text-sm text-slate-500">
              {step === 2 || step === 3
                ? footerSelectionSummary(selectedCount, teacherAddedCount)
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
              {step < TEACHER_CHOICE_TOTAL_STEPS ? (
                <button
                  ref={continueRef}
                  type="button"
                  onClick={handleContinue}
                  className="rounded-md bg-[#3766a3] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2f578c]"
                >
                  Continue
                </button>
              ) : showPromptPreview ? (
                <button
                  ref={continueRef}
                  type="button"
                  onClick={onClose}
                  className="rounded-md bg-[#3766a3] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2f578c]"
                >
                  Back to workspace
                </button>
              ) : (
                <button
                  ref={continueRef}
                  type="button"
                  onClick={handleGeneratePromptPreview}
                  className="rounded-md bg-[#3766a3] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2f578c]"
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
