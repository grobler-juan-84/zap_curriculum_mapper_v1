import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, Copy } from 'lucide-react'
import {
  buildBe3U08OpenerSbWbSeriesHandoff,
  isBe3U08OpenerSeriesCompanion,
  type Be3U08OpenerSeriesHandoff,
} from './buildBe3U08OpenerSbWbSeriesHandoff'
import {
  buildBe3U08StorySbWbSeriesHandoff,
  isBe3U08StorySeriesCompanion,
  type Be3U08StorySeriesHandoff,
} from './buildBe3U08StorySbWbSeriesHandoff'
import { buildChalkieConciseOutline } from './buildChalkieConciseOutline'
import {
  BE2_U08_SERIES_LESSON1_VOCAB,
  BE2_U08_SERIES_LESSON2_VOCAB,
  buildChalkiePromptPreview,
  lessonTitleForPackage,
  type LessonPackageShape,
  type TeacherAddedLanguageInput,
} from './buildChalkiePromptPreview'
import { buildSuggestedChalkieVocabulary } from './buildSuggestedChalkieVocabulary'
import type { ChalkieLessonContext } from './resolveChalkieLessonContext'
import {
  TEACHER_CHOICE_TOTAL_STEPS,
  advanceTeacherChoiceStep,
  appendTeacherAddedLanguage,
  footerSelectionSummary,
  retreatTeacherChoiceStep,
  teacherChoiceStepName,
  toggleSelectedSuggestionId,
  type TeacherAddedLanguage,
} from './teacherChoiceFlow'
import {
  splitPriorSkillCardTitle,
  type TeacherChoiceSuggestion,
} from './teacherChoiceSuggestions'
import {
  buildSbActivityPageColumns,
  createSbActivityHandoffSelection,
  createDefaultSbActivitySelection,
  hasSbActivityExclusions,
  selectedSbActivityLanguage,
  selectedSbActivityVocabulary,
  sbActivitySelectionStatus,
  setSbActivityCardSelected,
  type SbActivityHandoffSelection,
  type SbActivityCard,
  type SbActivityPreviewKind,
  type SbActivitySelectionState,
} from './chalkieActivitySelection'
import {
  buildWbActivityPagePanels,
  createWbActivityHandoffSelection,
  createDefaultWbActivitySelection,
  setWbActivityCardSelected,
  wbActivitySelectionStatus,
  type WbActivityCard,
  type WbActivityHandoffSelection,
  type WbActivityPreviewKind,
  type WbActivitySelectionState,
} from './chalkieWorkbookActivitySelection'

type Be3U08SeriesHandoff = Be3U08OpenerSeriesHandoff | Be3U08StorySeriesHandoff

function isBe3U08SeriesCompanion(
  companion: { relationshipId?: string | null } | null | undefined,
): boolean {
  return (
    isBe3U08OpenerSeriesCompanion(companion) ||
    isBe3U08StorySeriesCompanion(companion)
  )
}

function buildBe3U08SeriesHandoffForCompanion(
  companion: { relationshipId?: string | null } | null | undefined,
  selectedSuggestions: TeacherChoiceSuggestion[],
  teacherAdditions: TeacherAddedLanguageInput[],
  activitySelection: SbActivityHandoffSelection,
  workbookActivitySelection: WbActivityHandoffSelection,
): Be3U08SeriesHandoff | null {
  if (isBe3U08OpenerSeriesCompanion(companion)) {
    return buildBe3U08OpenerSbWbSeriesHandoff({
      selectedSuggestions,
      teacherAdditions,
      activitySelection,
      workbookActivitySelection,
    })
  }
  if (isBe3U08StorySeriesCompanion(companion)) {
    return buildBe3U08StorySbWbSeriesHandoff({
      selectedSuggestions,
      teacherAdditions,
      activitySelection,
      workbookActivitySelection,
    })
  }
  return null
}

function PriorSkillCardHeading({ label }: { label: string }) {
  const { skillName, bookSources } = splitPriorSkillCardTitle(label)
  if (!bookSources) {
    return <span className="font-bold text-slate-900">{skillName}</span>
  }
  return (
    <>
      <span className="font-bold text-slate-900">{skillName}</span>
      <span className="font-normal text-slate-700">: {bookSources}</span>
    </>
  )
}

function activityPreviewLabel(
  kind: SbActivityPreviewKind | WbActivityPreviewKind,
): string {
  if (kind === 'language_model' || kind === 'activity_item_model') {
    return 'Language'
  }
  if (kind === 'expected_answer') return 'Answer evidence'
  return 'Task evidence'
}

function compactStudentBookLabel(bookLabel: string): string {
  return bookLabel.replace(/\s+Student Book$/i, '').trim() || bookLabel
}

interface TeacherChoiceFlowOverlayProps {
  open: boolean
  onClose: () => void
  lesson: ChalkieLessonContext | null
  activityCards: readonly SbActivityCard[]
  workbookActivityCards: readonly WbActivityCard[]
}

type CopyFeedback = 'idle' | 'copied' | 'failed'

const BE2_U08_SERIES_LESSON1_OUTLINE_COPY = [
  'Lesson 1 — Student Book pp. 128–129',
  'Source: Student Book pp. 128–129',
  'Focus: introduce and practise wild-animal vocabulary through the page spread, song context, and the current-unit preference/ability model.',
  '- Animal vocabulary',
  '- To the Zoo!',
  '- Do you like cheetahs? Yes, I do! Cheetahs can run.',
  '- Visible page activities: listen/look/say, find/say, game, song/listen, true/false, ask/answer',
].join('\n')

const BE2_U08_SERIES_LESSON2_OUTLINE_COPY = [
  'Lesson 2 — Workbook pp. 104–105',
  'Source: Workbook pp. 104–105',
  'Focus: use the matching workbook evidence for animal naming/matching, song-related writing, and a short zoo-animal response.',
  '- Animal naming/matching (Look and write / Look and match)',
  '- Song-related listening/writing',
  '- What animals do you like seeing at the zoo?',
].join('\n')

function HandoffCopyIconButton(props: {
  copyLabel: string
  copyStatus: CopyFeedback
  onCopy: () => void
  disabled?: boolean
}) {
  const { copyLabel, copyStatus, onCopy, disabled = false } = props
  const label = copyStatus === 'copied' ? 'Copied' : copyLabel

  return (
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
  )
}

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
      <HandoffCopyIconButton
        copyLabel={copyLabel}
        copyStatus={copyStatus}
        onCopy={onCopy}
        disabled={disabled}
      />
    </div>
  )
}

export const TeacherChoiceFlowOverlay: React.FC<TeacherChoiceFlowOverlayProps> = ({
  open,
  onClose,
  lesson,
  activityCards,
  workbookActivityCards,
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
  const [lesson1OutlineCopyStatus, setLesson1OutlineCopyStatus] = useState<
    'idle' | 'copied' | 'failed'
  >('idle')
  const [lesson2OutlineCopyStatus, setLesson2OutlineCopyStatus] = useState<
    'idle' | 'copied' | 'failed'
  >('idle')
  const [lesson1VocabCopyStatus, setLesson1VocabCopyStatus] = useState<
    'idle' | 'copied' | 'failed'
  >('idle')
  const [lesson2VocabCopyStatus, setLesson2VocabCopyStatus] = useState<
    'idle' | 'copied' | 'failed'
  >('idle')
  const [be3SeriesHandoff, setBe3SeriesHandoff] = useState<Be3U08SeriesHandoff | null>(
    null,
  )
  const [lessonShape, setLessonShape] = useState<LessonPackageShape>('single')
  const [activitySelection, setActivitySelection] =
    useState<SbActivitySelectionState | null>(null)
  const [workbookActivitySelection, setWorkbookActivitySelection] =
    useState<WbActivitySelectionState | null>(null)

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
      setLesson1OutlineCopyStatus('idle')
      setLesson2OutlineCopyStatus('idle')
      setLesson1VocabCopyStatus('idle')
      setLesson2VocabCopyStatus('idle')
      setBe3SeriesHandoff(null)
      setLessonShape('single')
      setActivitySelection(null)
      setWorkbookActivitySelection(null)
      return
    }

    setLessonShape('single')
    setActivitySelection(createDefaultSbActivitySelection(activityCards))
    // Keep null as the default sentinel so asynchronously loaded verified WB
    // cards still begin selected without resetting the rest of the modal.
    setWorkbookActivitySelection(null)

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
  }, [open, onClose, activityCards])

  const priorLearningSuggestions = lesson?.priorLearningSuggestions ?? []

  const selectedSuggestions = useMemo(
    () => priorLearningSuggestions.filter((item) => selectedIds.includes(item.id)),
    [priorLearningSuggestions, selectedIds],
  )

  const selectedTeacherAdditions = useMemo(
    () => teacherAdditions.filter((item) => selectedIds.includes(item.id)),
    [teacherAdditions, selectedIds],
  )

  const effectiveActivitySelection = useMemo(
    () => activitySelection ?? createDefaultSbActivitySelection(activityCards),
    [activityCards, activitySelection],
  )

  const activityPageColumns = useMemo(
    () =>
      buildSbActivityPageColumns(
        activityCards,
        lesson?.visiblePrintedPages ?? [],
      ),
    [activityCards, lesson?.visiblePrintedPages],
  )

  const activitySelectionStatus = useMemo(
    () => sbActivitySelectionStatus(activityCards, effectiveActivitySelection),
    [activityCards, effectiveActivitySelection],
  )
  const effectiveWorkbookActivitySelection = useMemo(
    () =>
      workbookActivitySelection ??
      createDefaultWbActivitySelection(workbookActivityCards),
    [workbookActivityCards, workbookActivitySelection],
  )
  const workbookActivityPagePanels = useMemo(
    () =>
      buildWbActivityPagePanels({
        cards: workbookActivityCards,
        companion: lesson?.workbookCompanion ?? null,
      }),
    [workbookActivityCards, lesson?.workbookCompanion],
  )
  const workbookActivitySelectionStatus = useMemo(
    () =>
      wbActivitySelectionStatus(
        workbookActivityCards,
        effectiveWorkbookActivitySelection,
      ),
    [workbookActivityCards, effectiveWorkbookActivitySelection],
  )
  const handoffWorkbookActivitySelection = useMemo(
    () =>
      createWbActivityHandoffSelection(
        workbookActivityCards,
        effectiveWorkbookActivitySelection,
      ),
    [workbookActivityCards, effectiveWorkbookActivitySelection],
  )
  const handoffActivitySelection = useMemo(
    () =>
      createSbActivityHandoffSelection(
        activityCards,
        effectiveActivitySelection,
      ),
    [activityCards, effectiveActivitySelection],
  )
  const selectedActivityVocabulary = useMemo(
    () => selectedSbActivityVocabulary(handoffActivitySelection),
    [handoffActivitySelection],
  )
  const selectedActivityLanguage = useMemo(
    () => selectedSbActivityLanguage(handoffActivitySelection),
    [handoffActivitySelection],
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
  const isBe3SeriesPreview = isSeriesPreview && be3SeriesHandoff != null
  const selectionHasExclusions = hasSbActivityExclusions(handoffActivitySelection)
  const seriesLesson1Pages =
    lesson.workbookCompanion?.studentBookPrintedPages?.join('–') ?? '128–129'
  const seriesLesson2Pages =
    lesson.workbookCompanion?.workbookPrintedPages?.join('–') ?? '104–105'
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
      setLesson1OutlineCopyStatus('idle')
      setLesson2OutlineCopyStatus('idle')
      setLesson1VocabCopyStatus('idle')
      setLesson2VocabCopyStatus('idle')
      setBe3SeriesHandoff(null)
    }
  }

  const handleGeneratePromptPreview = () => {
    const assembled = buildChalkiePromptPreview({
      lesson,
      packageShape: effectiveLessonShape,
      selectedSuggestions,
      teacherAdditions: selectedTeacherAdditions,
      activitySelection: handoffActivitySelection,
      workbookActivitySelection: handoffWorkbookActivitySelection,
    })
    const useBe3Series =
      effectiveLessonShape === 'series' &&
      isBe3U08SeriesCompanion(lesson.workbookCompanion)
    const be3Handoff = useBe3Series
      ? buildBe3U08SeriesHandoffForCompanion(
          lesson.workbookCompanion,
          selectedSuggestions,
          selectedTeacherAdditions,
          handoffActivitySelection,
          handoffWorkbookActivitySelection,
        )
      : null
    const outline = useBe3Series
      ? ''
      : buildChalkieConciseOutline({
          lesson,
          selectedSuggestions,
          activitySelection: handoffActivitySelection,
        })
    const suggested = useBe3Series
      ? { copyText: '', isEmpty: true }
      : buildSuggestedChalkieVocabulary(lesson, handoffActivitySelection)
    setPromptPreview(assembled)
    setBe3SeriesHandoff(be3Handoff)
    setConciseOutline(outline)
    setSuggestedVocabulary(suggested.copyText)
    setSuggestedVocabularyEmpty(suggested.isEmpty)
    setShowPromptPreview(true)
    setCopyStatus('idle')
    setOutlineCopyStatus('idle')
    setVocabularyCopyStatus('idle')
    setTitleCopyStatus('idle')
    setLesson1OutlineCopyStatus('idle')
    setLesson2OutlineCopyStatus('idle')
    setLesson1VocabCopyStatus('idle')
    setLesson2VocabCopyStatus('idle')
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

  const handleCopyLesson1Outline = async () => {
    const text =
      be3SeriesHandoff?.lesson1Outline ??
      (selectionHasExclusions
        ? conciseOutline
        : BE2_U08_SERIES_LESSON1_OUTLINE_COPY)
    try {
      await navigator.clipboard.writeText(text)
      setLesson1OutlineCopyStatus('copied')
      window.setTimeout(() => setLesson1OutlineCopyStatus('idle'), 2000)
    } catch {
      setLesson1OutlineCopyStatus('failed')
    }
  }

  const handleCopyLesson2Outline = async () => {
    const text = be3SeriesHandoff?.lesson2Outline ?? BE2_U08_SERIES_LESSON2_OUTLINE_COPY
    try {
      await navigator.clipboard.writeText(text)
      setLesson2OutlineCopyStatus('copied')
      window.setTimeout(() => setLesson2OutlineCopyStatus('idle'), 2000)
    } catch {
      setLesson2OutlineCopyStatus('failed')
    }
  }

  const handleCopyLesson1Vocabulary = async () => {
    if (!be3SeriesHandoff?.lesson1Vocabulary) return
    try {
      await navigator.clipboard.writeText(be3SeriesHandoff.lesson1Vocabulary)
      setLesson1VocabCopyStatus('copied')
      window.setTimeout(() => setLesson1VocabCopyStatus('idle'), 2000)
    } catch {
      setLesson1VocabCopyStatus('failed')
    }
  }

  const handleCopyLesson2Vocabulary = async () => {
    if (!be3SeriesHandoff?.lesson2Vocabulary) return
    try {
      await navigator.clipboard.writeText(be3SeriesHandoff.lesson2Vocabulary)
      setLesson2VocabCopyStatus('copied')
      window.setTimeout(() => setLesson2VocabCopyStatus('idle'), 2000)
    } catch {
      setLesson2VocabCopyStatus('failed')
    }
  }

  const toggleSuggestion = (id: string) => {
    setSelectedIds((prev) => toggleSelectedSuggestionId(prev, id))
  }

  const handleActivitySelectionChange = (cardId: string, selected: boolean) => {
    setActivitySelection((current) =>
      setSbActivityCardSelected({
        cards: activityCards,
        state: current ?? createDefaultSbActivitySelection(activityCards),
        cardId,
        selected,
      }),
    )
  }

  const handleWorkbookActivitySelectionChange = (
    cardId: string,
    selected: boolean,
  ) => {
    setWorkbookActivitySelection((current) =>
      setWbActivityCardSelected({
        cards: workbookActivityCards,
        state:
          current ?? createDefaultWbActivitySelection(workbookActivityCards),
        cardId,
        selected,
      }),
    )
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

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/45 p-3 sm:p-5 lg:p-8">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[92vh] w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl sm:w-[min(80vw,1440px)]"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 bg-white px-5 py-3.5 sm:px-6 lg:px-8">
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

        <div
          className={`min-h-0 flex-1 overflow-y-auto bg-[#8bcfd9]/20 ${
            step === 1
              ? 'px-4 py-5 sm:px-6 sm:py-6 lg:px-8'
              : 'px-5 py-6 sm:px-8 sm:py-8 lg:px-10'
          }`}
        >
          {step === 1 ? (
            <div className="mx-auto w-full max-w-[80rem] space-y-4">
              <div className="space-y-1">
                <h2
                  id={titleId}
                  className="text-sm font-semibold text-slate-800"
                >
                  Current lesson
                  <span className="mx-2 font-normal text-slate-400" aria-hidden="true">
                    ·
                  </span>
                  {compactStudentBookLabel(lesson.bookLabel)}
                  <span className="mx-2 font-normal text-slate-400" aria-hidden="true">
                    ·
                  </span>
                  {lesson.unitLine}
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  Select the Student Book activities to include in this lesson.
                </p>
              </div>

              <section className="space-y-3" aria-label="Current Student Book activities">
                <div
                  className="rounded-2xl border border-slate-300/80 bg-slate-200/55 p-2 shadow-sm sm:p-3"
                  data-sb-activity-spread
                  data-page-count={activityPageColumns.length}
                >
                  <div className="flex items-center justify-between gap-3 px-2 pb-2 pt-0.5 sm:px-3">
                    <h3 className="text-sm font-semibold text-slate-800">
                      Student Book activities
                    </h3>
                    <p className="text-sm font-medium text-slate-600" aria-live="polite">
                      {activitySelectionStatus.selectedCount} of{' '}
                      {activitySelectionStatus.totalCount} selected
                    </p>
                  </div>

                  <div className="relative">
                    {activityPageColumns.length > 1 ? (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 left-1/2 z-10 hidden w-6 -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-400/25 to-transparent md:block"
                      />
                    ) : null}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5">
                      {activityPageColumns.map((column) => (
                        <div
                          key={column.printedPage}
                          className={`min-w-0 rounded-xl border p-3 sm:p-4 ${
                            column.includedInLessonScope
                              ? 'border-slate-200 bg-[#fffefb] shadow-sm'
                              : 'border-slate-200/70 bg-slate-100/55'
                          }`}
                          data-sb-activity-page={
                            column.includedInLessonScope
                              ? column.printedPage
                              : undefined
                          }
                          data-sb-facing-placeholder={
                            column.includedInLessonScope
                              ? undefined
                              : column.position
                          }
                        >
                          {column.includedInLessonScope ? (
                            <h4 className="mb-3 border-b border-slate-200 pb-2 text-sm font-semibold text-slate-700">
                              Student Book · p.{column.printedPage}
                            </h4>
                          ) : (
                            <div className="flex min-h-[10rem] items-center justify-center px-4 py-8 text-center">
                              <p className="max-w-xs text-xs leading-relaxed text-slate-400">
                                Not included in this lesson scope.
                              </p>
                            </div>
                          )}
                          {column.includedInLessonScope &&
                          column.cards.length > 0 ? (
                            <ul className="space-y-2.5">
                              {column.cards.map((card) => {
                                const checkboxId = `current-activity-${card.id}`
                                const detailsId = `${checkboxId}-details`
                                const checked =
                                  effectiveActivitySelection.selectedCardIds.includes(card.id)
                                return (
                                  <li
                                    key={card.id}
                                    className={`rounded-lg border p-3 transition-colors ${
                                      checked
                                        ? 'border-indigo-200 bg-indigo-50/55 shadow-xs'
                                        : 'border-slate-200 bg-slate-50/75'
                                    }`}
                                  >
                                    <div className="flex gap-2.5">
                                      <input
                                        id={checkboxId}
                                        type="checkbox"
                                        checked={checked}
                                        onChange={(event) =>
                                          handleActivitySelectionChange(
                                            card.id,
                                            event.target.checked,
                                          )
                                        }
                                        aria-label={`Select ${card.activityNumber ? `Activity ${card.activityNumber}` : 'activity'} on Student Book page ${card.printedPage}`}
                                        aria-describedby={detailsId}
                                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                      />
                                      <div id={detailsId} className="min-w-0 flex-1 space-y-1">
                                        <p className="text-[11px] font-medium text-slate-500">
                                          [SB p.{card.printedPage}]
                                          {card.activityNumber
                                            ? ` · Activity ${card.activityNumber}`
                                            : ''}
                                        </p>
                                        <p className="text-sm font-semibold leading-snug text-slate-900">
                                          {card.verifiedWording}
                                        </p>
                                        {card.preview.kind === 'empty' ? (
                                          <p className="text-xs leading-relaxed text-slate-500">
                                            No safe verified preview is available for this activity.
                                          </p>
                                        ) : (
                                          <div className="space-y-0.5 pt-0.5">
                                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                                              {activityPreviewLabel(card.preview.kind)}
                                            </p>
                                            <ul className="space-y-0.5 text-xs leading-relaxed text-slate-700">
                                              {card.preview.values.map((value) => (
                                                <li key={value}>{value}</li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </li>
                                )
                              })}
                            </ul>
                          ) : column.includedInLessonScope ? (
                            <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50/70 p-3 text-xs leading-relaxed text-slate-500">
                              No human-verified Student Book activity cards are available for this
                              page.
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 px-1">
                  {activitySelectionStatus.hasNoSelectedCurrentActivities ? (
                    <p
                      role="status"
                      className="rounded-md border border-amber-200/80 bg-amber-50/80 px-3 py-2 text-xs leading-relaxed text-amber-900"
                    >
                      No current Student Book activities are selected. A later handoff would contain
                      no selected current-page activities.
                    </p>
                  ) : null}

                  <p className="text-xs leading-relaxed text-slate-500">
                    Selected activities will be included in this local handoff.
                  </p>
                </div>
              </section>

              {lesson.workbookCompanion &&
              workbookActivityPagePanels.length > 0 ? (
                <section
                  className="space-y-3 pt-2"
                  aria-label="Workbook activities"
                  data-wb-activity-section
                >
                  <div
                    className="rounded-2xl border border-slate-300/80 bg-slate-200/55 p-2 shadow-sm sm:p-3"
                    data-wb-activity-spread
                    data-page-count={workbookActivityPagePanels.length}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 px-2 pb-2 pt-0.5 sm:px-3">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">
                          Workbook activities
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500">
                          Verified Workbook companion for this lesson
                        </p>
                      </div>
                      <p
                        className="text-sm font-medium text-slate-600"
                        aria-live="polite"
                      >
                        {workbookActivitySelectionStatus.selectedCount} of{' '}
                        {workbookActivitySelectionStatus.totalCount} selected
                      </p>
                    </div>

                    <div className="relative">
                      {workbookActivityPagePanels.length > 1 ? (
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-y-0 left-1/2 z-10 hidden w-6 -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-400/25 to-transparent md:block"
                        />
                      ) : null}
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5">
                        {workbookActivityPagePanels.map((panel) => (
                          <div
                            key={panel.pageId ?? `placeholder-${panel.position}`}
                            className={`min-w-0 rounded-xl border p-3 sm:p-4 ${
                              panel.includedInLessonScope
                                ? 'border-slate-200 bg-[#fffefb] shadow-sm'
                                : 'border-slate-200/70 bg-slate-100/55'
                            }`}
                            data-wb-activity-page={
                              panel.includedInLessonScope
                                ? panel.printedPage ?? undefined
                                : undefined
                            }
                            data-wb-facing-placeholder={
                              panel.includedInLessonScope
                                ? undefined
                                : panel.position
                            }
                          >
                            {panel.includedInLessonScope ? (
                              <h4 className="mb-3 border-b border-slate-200 pb-2 text-sm font-semibold text-slate-700">
                                Workbook · p.{panel.printedPage}
                              </h4>
                            ) : (
                              <div className="flex min-h-[10rem] items-center justify-center px-4 py-8 text-center">
                                <p className="max-w-xs text-xs leading-relaxed text-slate-400">
                                  No verified Workbook content for this lesson.
                                </p>
                              </div>
                            )}
                            {panel.includedInLessonScope &&
                            panel.cards.length > 0 ? (
                              <ul className="space-y-2.5">
                                {panel.cards.map((card) => {
                                  const checkboxId = `workbook-activity-${card.id}`
                                  const detailsId = `${checkboxId}-details`
                                  const checked =
                                    effectiveWorkbookActivitySelection.selectedCardIds.includes(
                                      card.id,
                                    )
                                  return (
                                    <li
                                      key={card.id}
                                      className={`rounded-lg border p-3 transition-colors ${
                                        checked
                                          ? 'border-indigo-200 bg-indigo-50/55 shadow-xs'
                                          : 'border-slate-200 bg-slate-50/75'
                                      }`}
                                    >
                                      <div className="flex gap-2.5">
                                        <input
                                          id={checkboxId}
                                          type="checkbox"
                                          checked={checked}
                                          onChange={(event) =>
                                            handleWorkbookActivitySelectionChange(
                                              card.id,
                                              event.target.checked,
                                            )
                                          }
                                          aria-label={`Select ${card.activityNumber ? `Activity ${card.activityNumber}` : 'activity'} on Workbook page ${card.printedPage}`}
                                          aria-describedby={detailsId}
                                          className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <div
                                          id={detailsId}
                                          className="min-w-0 flex-1 space-y-1"
                                        >
                                          <p className="text-[11px] font-medium text-slate-500">
                                            [WB p.{card.printedPage}]
                                            {card.activityNumber
                                              ? ` · Activity ${card.activityNumber}`
                                              : ''}
                                          </p>
                                          <p className="text-sm font-semibold leading-snug text-slate-900">
                                            {card.verifiedWording}
                                          </p>
                                          {card.preview.kind === 'empty' ? (
                                            <p className="text-xs leading-relaxed text-slate-500">
                                              No safe verified preview is available for this
                                              activity.
                                            </p>
                                          ) : (
                                            <div className="space-y-0.5 pt-0.5">
                                              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                                                {activityPreviewLabel(card.preview.kind)}
                                              </p>
                                              <ul className="space-y-0.5 text-xs leading-relaxed text-slate-700">
                                                {card.preview.values.map((value) => (
                                                  <li key={value}>{value}</li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </li>
                                  )
                                })}
                              </ul>
                            ) : panel.includedInLessonScope ? (
                              <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50/70 p-3 text-xs leading-relaxed text-slate-500">
                                No human-verified Workbook activity cards are available for this
                                mapped page.
                              </p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 px-1">
                    {workbookActivitySelectionStatus.hasNoSelectedWorkbookActivities ? (
                      <p
                        role="status"
                        className="rounded-md border border-amber-200/80 bg-amber-50/80 px-3 py-2 text-xs leading-relaxed text-amber-900"
                      >
                        No Workbook activities are selected for this session.
                      </p>
                    ) : null}
                    <p className="text-xs leading-relaxed text-slate-500">
                      Workbook activity selection is saved for this session and is used where the
                      current local handoff includes Workbook content.
                    </p>
                  </div>
                </section>
              ) : null}
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
                className="rounded-xl border-2 border-dashed border-indigo-200 bg-white"
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

                    <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4 sm:p-5">
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
                          ? 'border-indigo-200 bg-indigo-50'
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
                          <label htmlFor={checkboxId} className="block text-sm text-slate-900">
                            <span className="font-bold">{item.title}</span>
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
                          ? 'border-indigo-200 bg-indigo-50'
                          : 'border-slate-200/80 bg-white'
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
                          <label htmlFor={checkboxId} className="block text-sm text-slate-900">
                            <PriorSkillCardHeading label={suggestion.label} />
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
                <p className="select-text text-sm leading-relaxed text-slate-800">
                  {activeLessonTitle}
                </p>
              </section>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
                <section className="space-y-4" aria-label="How should this be packaged?">
                  <h3 className="text-sm font-medium text-slate-800">How should this be packaged?</h3>
                  <div className="space-y-3 rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5">
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
                        <span className="block text-sm font-medium text-slate-900">
                          Single lesson
                        </span>
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
                            Separate introduction and practice across Student Book and Workbook
                            pages.
                          </span>
                          {effectiveLessonShape === 'series' ? (
                            <span
                              id="lesson-shape-series-note"
                              className="mt-1 block space-y-0.5 text-sm leading-relaxed text-slate-500"
                            >
                              <span className="block">
                                Lesson 1 — Student Book pp. {seriesLesson1Pages}
                              </span>
                              <span className="block">
                                Lesson 2 — Workbook pp. {seriesLesson2Pages}
                              </span>
                              <span className="block pt-1">
                                Workbook pages are verified source evidence for this packaging
                                choice; they may not be the PDF currently open in the workspace.
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
                <div className="hidden lg:block" aria-hidden="true" />
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
                <section className="space-y-4" aria-label="Selected current activities">
                  <h3 className="text-sm font-medium text-slate-800">Selected current activities</h3>
                  <div className="space-y-4 rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5">
                    <div className="space-y-1 text-sm leading-relaxed text-slate-600">
                      <p className="font-medium text-slate-800">{lesson.bookLabel}</p>
                      <p>{lesson.unitLine}</p>
                      <p>Source scope: {lesson.visiblePageRangeLabel}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-slate-800">
                        Included Student Book activities
                      </h4>
                      {handoffActivitySelection.selectedEvidence.length > 0 ? (
                        <ul className="space-y-1.5 text-sm leading-relaxed text-slate-700">
                          {handoffActivitySelection.selectedEvidence.map((activity) => (
                            <li key={activity.cardId}>
                              <span className="font-medium text-slate-800">
                                [SB p.{activity.printedPage}]
                                {activity.activityNumber
                                  ? ` · Activity ${activity.activityNumber}`
                                  : ''}
                              </span>
                              {' — '}
                              {activity.verifiedWording}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-slate-500">
                          No current Student Book activities are selected. Prior learning remains
                          separate and does not replace current-page content.
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-slate-800">
                        Selected activity words and models
                      </h4>
                      {selectedActivityVocabulary.length > 0 ? (
                        <ul className="flex flex-wrap gap-2">
                          {selectedActivityVocabulary.map((term) => (
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
                          No words or models are safely attributable to the selected activities.
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-slate-800">
                        Selected activity language
                      </h4>
                      {selectedActivityLanguage.length > 0 ? (
                        <ul className="space-y-1.5 text-sm leading-relaxed text-slate-700">
                          {selectedActivityLanguage.map((language) => (
                            <li key={language}>{language}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-slate-500">
                          No language is safely attributable to the selected activities.
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                <div className="space-y-8">
                  <section className="space-y-4" aria-label="Selected prior learning">
                    <h3 className="text-sm font-medium text-slate-800">Selected prior learning</h3>
                    <div className="space-y-4 rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5">
                      {selectedSuggestions.length === 0 ? (
                        <p className="text-sm leading-relaxed text-slate-500">
                          No verified prior learning was selected for this lesson.
                        </p>
                      ) : (
                        <ul className="space-y-4">
                          {selectedSuggestions.map((suggestion) => (
                            <li key={suggestion.id} className="space-y-1.5">
                              <div className="space-y-0.5">
                                <p className="text-sm text-slate-900">
                                  <PriorSkillCardHeading label={suggestion.label} />
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
                    </div>
                  </section>

                  {selectedTeacherAdditions.length > 0 ? (
                    <section className="space-y-4" aria-label="Teacher-added prior skills">
                      <h3 className="text-sm font-medium text-slate-800">
                        Teacher-added prior skills
                      </h3>
                      <div className="space-y-4 rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5">
                        <ul className="space-y-4">
                          {selectedTeacherAdditions.map((item) => (
                            <li key={item.id} className="space-y-1.5">
                              <p className="text-sm font-bold text-slate-900">{item.title}</p>
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
                      </div>
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
                <h3 className="text-sm font-medium text-slate-800">
                  {isSeriesPreview ? 'Series title' : 'Lesson title'}
                </h3>
                <HandoffCopyableBox
                  id="chalkie-lesson-title-handoff"
                  value={activeLessonTitle}
                  rows={2}
                  copyLabel={isSeriesPreview ? 'Copy series title' : 'Copy title'}
                  copyStatus={titleCopyStatus}
                  onCopy={handleCopyLessonTitle}
                  textareaClassName="min-h-[2.75rem] resize-none text-sm font-medium leading-relaxed"
                />
                {titleCopyStatus === 'failed' ? (
                  <p className="text-sm text-slate-500">
                    Copying was unavailable. Select the title text and copy it manually.
                  </p>
                ) : null}
                {isBe3SeriesPreview && be3SeriesHandoff?.stableSeriesReference ? (
                  <p className="text-xs text-slate-500">
                    Ref: <span className="font-mono">{be3SeriesHandoff.stableSeriesReference}</span>
                  </p>
                ) : lesson.stableSeriesReference && effectiveLessonShape === 'series' ? (
                  <p className="text-xs text-slate-500">
                    Ref: <span className="font-mono">{lesson.stableSeriesReference}</span>
                  </p>
                ) : lesson.stableLessonReference && !isSeriesPreview ? (
                  <p className="text-xs text-slate-500">
                    Ref: <span className="font-mono">{lesson.stableLessonReference}</span>
                  </p>
                ) : null}
              </section>

              {isBe3SeriesPreview && be3SeriesHandoff ? (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
                  <div className="flex min-w-0 flex-col gap-2 lg:col-span-7">
                    <h3 className="text-sm font-medium text-slate-800">
                      Detailed two-lesson Chalkie handoff
                    </h3>
                    <HandoffCopyableBox
                      id="chalkie-prompt-preview"
                      value={promptPreview}
                      rows={24}
                      copyLabel="Copy detailed handoff"
                      copyStatus={copyStatus}
                      onCopy={handleCopyPrompt}
                      className="flex-1"
                      textareaClassName="min-h-[20rem] font-mono text-xs leading-relaxed sm:text-[13px]"
                    />
                    {copyStatus === 'failed' ? (
                      <p className="text-sm text-slate-500">
                        Copying was unavailable. Select the handoff text and copy it manually.
                      </p>
                    ) : null}
                  </div>
                  <aside className="flex min-w-0 flex-col gap-2 lg:col-span-5">
                    <h3 className="text-sm font-medium text-slate-800">Lesson outlines and vocabulary</h3>
                    <div className="flex min-w-0 flex-col gap-4">
                      <section className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-800">
                          Lesson 1 concise outline (SB pp. {seriesLesson1Pages})
                        </h4>
                        <HandoffCopyableBox
                          id="chalkie-be3-l1-outline"
                          value={be3SeriesHandoff.lesson1Outline}
                          rows={10}
                          copyLabel="Copy Lesson 1 outline"
                          copyStatus={lesson1OutlineCopyStatus}
                          onCopy={handleCopyLesson1Outline}
                          textareaClassName="min-h-[10rem] font-mono text-xs leading-relaxed sm:text-[13px]"
                        />
                      </section>
                      <section className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-800">
                          Lesson 1 suggested vocabulary
                        </h4>
                        <HandoffCopyableBox
                          id="chalkie-be3-l1-vocab"
                          value={be3SeriesHandoff.lesson1Vocabulary}
                          rows={3}
                          copyLabel="Copy Lesson 1 vocabulary"
                          copyStatus={lesson1VocabCopyStatus}
                          onCopy={handleCopyLesson1Vocabulary}
                          textareaClassName="min-h-[4.5rem] font-mono text-xs leading-relaxed sm:text-[13px]"
                        />
                      </section>
                      <section className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-800">
                          Lesson 2 concise outline (WB pp. {seriesLesson2Pages})
                        </h4>
                        <HandoffCopyableBox
                          id="chalkie-be3-l2-outline"
                          value={be3SeriesHandoff.lesson2Outline}
                          rows={9}
                          copyLabel="Copy Lesson 2 outline"
                          copyStatus={lesson2OutlineCopyStatus}
                          onCopy={handleCopyLesson2Outline}
                          textareaClassName="min-h-[9rem] font-mono text-xs leading-relaxed sm:text-[13px]"
                        />
                      </section>
                      <section className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-800">
                          Lesson 2 suggested vocabulary
                        </h4>
                        <HandoffCopyableBox
                          id="chalkie-be3-l2-vocab"
                          value={be3SeriesHandoff.lesson2Vocabulary}
                          rows={3}
                          copyLabel="Copy Lesson 2 vocabulary"
                          copyStatus={lesson2VocabCopyStatus}
                          onCopy={handleCopyLesson2Vocabulary}
                          textareaClassName="min-h-[4.5rem] font-mono text-xs leading-relaxed sm:text-[13px]"
                        />
                      </section>
                    </div>
                  </aside>
                </div>
              ) : isSeriesPreview ? (
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

                  <aside className="flex min-w-0 flex-col gap-2 lg:col-span-5">
                    <h3 className="text-sm font-medium text-slate-800">Lesson Outlines</h3>
                    <div className="flex min-w-0 flex-col gap-4">
                    <section className="relative rounded-xl border border-slate-200 bg-white p-4 pr-11 sm:p-5 sm:pr-12">
                      <HandoffCopyIconButton
                        copyLabel="Copy Lesson 1 outline"
                        copyStatus={lesson1OutlineCopyStatus}
                        onCopy={handleCopyLesson1Outline}
                      />
                      <h4 className="text-sm font-medium text-slate-900">
                        Lesson 1 — Student Book pp. 128–129
                      </h4>
                      <p className="mt-2 text-sm text-slate-500">Source: Student Book pp. 128–129</p>
                      {selectionHasExclusions ? (
                        <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-600">
                          {conciseOutline}
                        </pre>
                      ) : (
                        <>
                          <p className="mt-2 text-sm leading-relaxed text-slate-700">
                            Focus: introduce and practise wild-animal vocabulary through the page
                            spread, song context, and the current-unit preference/ability model.
                          </p>
                          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-600">
                            <li>Animal vocabulary</li>
                            <li>To the Zoo!</li>
                            <li>Do you like cheetahs? Yes, I do! Cheetahs can run.</li>
                            <li>
                              Visible page activities: listen/look/say, find/say, game,
                              song/listen, true/false, ask/answer
                            </li>
                          </ul>
                        </>
                      )}
                      {lesson1OutlineCopyStatus === 'failed' ? (
                        <p className="mt-2 text-sm text-slate-500">
                          Copying was unavailable. Select the outline text and copy it manually.
                        </p>
                      ) : null}
                    </section>

                    <section className="relative rounded-xl border border-slate-200 bg-white p-4 pr-11 sm:p-5 sm:pr-12">
                      <HandoffCopyIconButton
                        copyLabel="Copy Lesson 2 outline"
                        copyStatus={lesson2OutlineCopyStatus}
                        onCopy={handleCopyLesson2Outline}
                      />
                      <h4 className="text-sm font-medium text-slate-900">
                        Lesson 2 — Workbook pp. 104–105
                      </h4>
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
                      {lesson2OutlineCopyStatus === 'failed' ? (
                        <p className="mt-2 text-sm text-slate-500">
                          Copying was unavailable. Select the outline text and copy it manually.
                        </p>
                      ) : null}
                    </section>
                    </div>

                    <section className="space-y-2 border-t border-slate-100 pt-4">
                      <h3 className="text-sm font-medium text-slate-800">
                        Prototype lesson allocation
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-500">
                        Planning division only — not a publisher-assigned lesson split.
                      </p>
                      <p className="text-sm leading-relaxed text-slate-700">
                        <span className="font-medium text-slate-800">Lesson 1 vocabulary:</span>{' '}
                        {selectionHasExclusions
                          ? selectedActivityVocabulary.join(', ') ||
                            'No selected Student Book activity vocabulary is safely attributable.'
                          : BE2_U08_SERIES_LESSON1_VOCAB}
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

              {!isBe3SeriesPreview && conciseOutline ? (
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

              {!isBe3SeriesPreview ? (
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
              ) : null}
            </div>
          ) : null}
        </div>

        <footer className="shrink-0 border-t border-slate-200/60 bg-[#8bcfd9] px-5 py-3.5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="min-w-[5.5rem] text-sm text-slate-500">
              {(step === 2 || step === 3) && (selectedCount > 0 || teacherAddedCount > 0)
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
