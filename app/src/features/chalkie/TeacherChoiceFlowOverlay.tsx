import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { Check, Copy } from 'lucide-react'
import { buildBe3U08OpenerSbWbSeriesHandoffWithNeutralCanary } from './be3U08OpenerNeutralCanary'
import { buildBe3U08StorySbWbSeriesHandoffWithNeutralCanary } from './be3U08StoryNeutralCanary'
import {
  isBe3U08OpenerSeriesCompanion,
  type Be3U08OpenerSeriesHandoff,
} from './buildBe3U08OpenerSbWbSeriesHandoff'
import type { VerifiedSbWbCompanion } from './resolveVerifiedSbWbCompanion'
import {
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
  advanceTeacherChoiceStepId,
  appendTeacherAddedLanguage,
  footerSelectionSummary,
  includeTeacherChoiceWorkbookStep,
  retreatTeacherChoiceStepId,
  teacherChoiceStepIndex,
  teacherChoiceStepName,
  teacherChoiceTotalSteps,
  toggleSelectedSuggestionId,
  type TeacherAddedLanguage,
  type TeacherChoiceStepId,
} from './teacherChoiceFlow'
import {
  splitPriorSkillCardTitle,
  type TeacherChoiceSuggestion,
} from './teacherChoiceSuggestions'
import {
  formatCuratedHmProvenanceLine,
  formatSameUnitPriorProvenanceLine,
  formatTeacherAddedProvenanceLine,
  priorLearningEvidenceKindDisplayLabel,
} from './priorLearningCandidate'
import { initialSelectedPriorLearningIds } from './surfaceSameUnitPriorLearningSuggestions'
import {
  buildSbActivityPageColumns,
  createSbActivityHandoffSelection,
  hasSbActivityExclusions,
  selectedSbActivityLanguage,
  selectedSbActivityVocabulary,
  sbActivitySelectionStatus,
  type SbActivityHandoffSelection,
  type SbActivityCard,
  type SbActivitySelectionState,
} from './chalkieActivitySelection'
import {
  buildWbActivityPagePanels,
  createWbActivityHandoffSelection,
  wbActivitySelectionStatus,
  type WbActivityCard,
  type WbActivityHandoffSelection,
  type WbActivitySelectionState,
} from './chalkieWorkbookActivitySelection'
import { ActivityEvidenceCard } from './ActivityEvidenceCard'
import {
  getBe3U08ActivitySummary,
  getBe3U08WbActivitySummary,
  isBe3U08ActivityEnrichmentPocEnabled,
} from './be3U08ActivityEnrichmentPoc'
import {
  buildBe3U08ActivityEnrichmentPocPackage,
  isExactBe3U08ActivityEnrichmentPocScope,
  isExactBe3U08WorkbookEnrichmentPocScope,
} from './buildBe3U08ActivityEnrichmentPocPackage'
import {
  isExactBe3U08OpenerNllCardComparisonScope,
  isNllCardComparisonEnabled,
  openerNllCardComparisonScopeKey,
  shouldLoadNllCardComparison,
  subscribeNllCardComparisonLifecycle,
  toNllCardComparisonDisplayState,
  type NllCardComparisonByActivityId,
  type NllCardComparisonLoadStatus,
} from './nllCardComparison'
import {
  assembleNllGeneralLessonPlanPilot,
  invalidateNllGeneralLessonPlanPilotRequest,
  isExactBe3U08OpenerNllGeneralLessonPlanScope,
  isNllGeneralLessonPlanPilotEnabled,
  NLL_GENERAL_LESSON_PLAN_FALLBACK_LINE,
  openerNllGeneralLessonPlanScopeKey,
  shouldApplyNllGeneralLessonPlanPilotResult,
  shouldRunNllGeneralLessonPlanPilot,
} from './nllGeneralLessonPlanPilot'
import {
  assembleNllChalkieAdapterPilot,
  invalidateNllChalkieAdapterPilotRequest,
  isExactBe3U08OpenerNllChalkieAdapterScope,
  isNllChalkieAdapterPilotEnabled,
  nllChalkieAdapterRequestKey,
  shouldApplyNllChalkieAdapterPilotResult,
  shouldRunNllChalkieAdapterPilot,
} from './nllChalkieAdapterPilot'
import {
  assembleNllStoryChalkieAdapterPilot,
  invalidateNllStoryChalkieAdapterPilotRequest,
  isExactBe3U08StoryNllChalkieAdapterScope,
  isNllStoryChalkieAdapterPilotEnabled,
  nllStoryChalkieAdapterRequestKey,
  shouldApplyNllStoryChalkieAdapterPilotResult,
  shouldRunNllStoryChalkieAdapterPilot,
} from './nllStoryChalkieAdapterPilot'
import {
  assembleNllLiaChalkieAdapterPilot,
  invalidateNllLiaChalkieAdapterPilotRequest,
  isExactBe3U08LiaNllChalkieAdapterScope,
  isNllLiaChalkieAdapterPilotEnabled,
  nllLiaChalkieAdapterRequestKey,
  shouldApplyNllLiaChalkieAdapterPilotResult,
  shouldRunNllLiaChalkieAdapterPilot,
  type Be3U08LiaSeriesHandoff,
} from './nllLiaChalkieAdapterPilot'
import {
  assembleNllGrammarChalkieAdapterPilot,
  invalidateNllGrammarChalkieAdapterPilotRequest,
  isExactBe3U08GrammarNllChalkieAdapterScope,
  isNllGrammarChalkieAdapterPilotEnabled,
  nllGrammarChalkieAdapterRequestKey,
  shouldApplyNllGrammarChalkieAdapterPilotResult,
  shouldRunNllGrammarChalkieAdapterPilot,
  type Be3U08GrammarSeriesHandoff,
} from './nllGrammarChalkieAdapterPilot'
import {
  assembleNllClilPeChalkieAdapterPilot,
  invalidateNllClilPeChalkieAdapterPilotRequest,
  isExactBe3U08ClilPeNllChalkieAdapterScope,
  isNllClilPeChalkieAdapterPilotEnabled,
  nllClilPeChalkieAdapterRequestKey,
  shouldApplyNllClilPeChalkieAdapterPilotResult,
  shouldRunNllClilPeChalkieAdapterPilot,
  type Be3U08ClilPeSeriesHandoff,
} from './nllClilPeChalkieAdapterPilot'
import {
  assembleNllCultureChalkieAdapterPilot,
  invalidateNllCultureChalkieAdapterPilotRequest,
  isExactBe3U08CultureNllChalkieAdapterScope,
  isNllCultureChalkieAdapterPilotEnabled,
  nllCultureChalkieAdapterRequestKey,
  shouldApplyNllCultureChalkieAdapterPilotResult,
  shouldRunNllCultureChalkieAdapterPilot,
  type Be3U08CultureSeriesHandoff,
} from './nllCultureChalkieAdapterPilot'
import {
  assembleNllWritingChalkieAdapterPilot,
  invalidateNllWritingChalkieAdapterPilotRequest,
  isExactBe3U08WritingNllChalkieAdapterScope,
  isNllWritingChalkieAdapterPilotEnabled,
  nllWritingChalkieAdapterRequestKey,
  shouldApplyNllWritingChalkieAdapterPilotResult,
  shouldRunNllWritingChalkieAdapterPilot,
  type Be3U08WritingSeriesHandoff,
} from './nllWritingChalkieAdapterPilot'
import {
  assembleNllPhonicsChalkieAdapterPilot,
  invalidateNllPhonicsChalkieAdapterPilotRequest,
  isExactBe3U08PhonicsNllChalkieAdapterScope,
  isNllPhonicsChalkieAdapterPilotEnabled,
  nllPhonicsChalkieAdapterRequestKey,
  shouldApplyNllPhonicsChalkieAdapterPilotResult,
  shouldRunNllPhonicsChalkieAdapterPilot,
  type Be3U08PhonicsSeriesHandoff,
} from './nllPhonicsChalkieAdapterPilot'
import {
  assembleNllReviewChalkieAdapterPilot,
  invalidateNllReviewChalkieAdapterPilotRequest,
  isExactBe3U08ReviewNllChalkieAdapterScope,
  isNllReviewChalkieAdapterPilotEnabled,
  nllReviewChalkieAdapterRequestKey,
  shouldApplyNllReviewChalkieAdapterPilotResult,
  shouldRunNllReviewChalkieAdapterPilot,
  type Be3U08ReviewSeriesHandoff,
} from './nllReviewChalkieAdapterPilot'
import { renderGeneralLessonPlanFromNeutralPackage } from './renderGeneralLessonPlanFromNeutralPackage'
import { supabase } from '../../lib/supabase'
import {
  ActivityReviewBookPage,
  ActivityReviewBookSpread,
} from './ActivityReviewBookSpread'
import { includedActivitiesCountLabel } from './lessonActivitySelection'
import {
  allocateSbOnlyTwoLessonActivities,
  formatSbOnlyLessonActivityScope,
} from './allocateSbOnlyTwoLessonActivities'
import {
  buildSbOnlyTwoLessonHandoff,
  type SbOnlyTwoLessonHandoff,
} from './buildSbOnlyTwoLessonHandoff'
import { buildDetailedGeneralLessonPlan } from './buildDetailedGeneralLessonPlan'
import { applyOpenerBiFramingToHandoff } from './chalkieBiFraming'
import { getBookIntelligenceStorageArtifact } from '../book-intelligence/bookIntelligenceStorageRegistry'
import { toBiPlanningContext } from '../../lib/bookIntelligence/toBiPlanningContext'
import type { BookIntelligenceOverviewDocument } from '../../types/bookIntelligence'
import { findBookIntelligenceUnit } from './chalkieUnitIntelligence'

type PreparedOutputKind = 'chalkie' | 'lesson_plan'

type Be3U08SeriesHandoff =
  | Be3U08OpenerSeriesHandoff
  | Be3U08StorySeriesHandoff
  | Be3U08LiaSeriesHandoff
  | Be3U08GrammarSeriesHandoff
  | Be3U08ClilPeSeriesHandoff
  | Be3U08CultureSeriesHandoff
  | Be3U08WritingSeriesHandoff
  | Be3U08PhonicsSeriesHandoff
  | Be3U08ReviewSeriesHandoff

function isBe3U08SeriesCompanion(
  companion: { relationshipId?: string | null } | null | undefined,
): boolean {
  return (
    isBe3U08OpenerSeriesCompanion(companion) ||
    isBe3U08StorySeriesCompanion(companion)
  )
}

function resolveOverlayBiInputs(input: {
  lesson: ChalkieLessonContext
  bookIntelligence: BookIntelligenceOverviewDocument | null
}): {
  unit: ReturnType<typeof findBookIntelligenceUnit>
  planningContext: ReturnType<typeof toBiPlanningContext>
  biArtifactRef: string | null
} {
  if (!input.bookIntelligence || !input.lesson.catalogBookId) {
    return { unit: null, planningContext: null, biArtifactRef: null }
  }
  const unit = findBookIntelligenceUnit(
    input.bookIntelligence,
    input.lesson.unitNumber,
  )
  const artifact = getBookIntelligenceStorageArtifact(input.lesson.catalogBookId)
  const biArtifactRef = artifact?.storagePath ?? null
  const planningContext = unit
    ? toBiPlanningContext({
        catalogBookId: input.lesson.catalogBookId,
        unit,
        biArtifactRef,
        expectedUnitNumber: input.lesson.unitNumber,
      })
    : null
  return { unit, planningContext, biArtifactRef }
}

function buildBe3U08SeriesHandoffForCompanion(
  companion: VerifiedSbWbCompanion | null | undefined,
  selectedSuggestions: TeacherChoiceSuggestion[],
  teacherAdditions: TeacherAddedLanguageInput[],
  activitySelection: SbActivityHandoffSelection,
  workbookActivitySelection: WbActivityHandoffSelection,
  biInputs?: {
    unit: ReturnType<typeof findBookIntelligenceUnit>
    planningContext: ReturnType<typeof toBiPlanningContext>
    biArtifactRef: string | null
  },
): Be3U08SeriesHandoff | null {
  if (isBe3U08OpenerSeriesCompanion(companion) && companion) {
    const handoff = buildBe3U08OpenerSbWbSeriesHandoffWithNeutralCanary({
      companion,
      selectedSuggestions,
      teacherAdditions,
      activitySelection,
      workbookActivitySelection,
      bookIntelligenceUnit: biInputs?.unit ?? null,
      biArtifactRef: biInputs?.biArtifactRef ?? null,
    }).handoff
    // Phase 4: intentional Chalkie delta only when BI framing flag is on.
    return applyOpenerBiFramingToHandoff(handoff, biInputs?.planningContext)
  }
  if (isBe3U08StorySeriesCompanion(companion) && companion) {
    return buildBe3U08StorySbWbSeriesHandoffWithNeutralCanary({
      companion,
      selectedSuggestions,
      teacherAdditions,
      activitySelection,
      workbookActivitySelection,
    }).handoff
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

interface TeacherChoiceFlowOverlayProps {
  open: boolean
  onClose: () => void
  lesson: ChalkieLessonContext | null
  activityCards: readonly SbActivityCard[]
  workbookActivityCards: readonly WbActivityCard[]
  /** Optional loaded BI document for NLP interpretation attach (D022). */
  bookIntelligence?: BookIntelligenceOverviewDocument | null
  /** Shared workspace selection — same state as the left panel. */
  sbActivitySelection: SbActivitySelectionState
  wbActivitySelection: WbActivitySelectionState
  onSbActivitySelectionChange: (cardId: string, selected: boolean) => void
  onWbActivitySelectionChange: (cardId: string, selected: boolean) => void
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
      className={`absolute right-1.5 top-1.5 inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors ${disabled
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
  bookIntelligence = null,
  sbActivitySelection,
  wbActivitySelection,
  onSbActivitySelectionChange,
  onWbActivitySelectionChange,
}) => {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const continueRef = useRef<HTMLButtonElement>(null)
  const overlayOpenRef = useRef(open)
  const generalLessonPlanRequestIdRef = useRef(0)
  const generalLessonPlanRequestScopeKeyRef = useRef('')
  const generalLessonPlanCurrentScopeKeyRef = useRef('')
  const nllChalkieAdapterRequestIdRef = useRef(0)
  const nllChalkieAdapterRequestKeyRef = useRef('')
  const nllChalkieAdapterCurrentRequestKeyRef = useRef('')
  const nllStoryChalkieAdapterRequestIdRef = useRef(0)
  const nllStoryChalkieAdapterRequestKeyRef = useRef('')
  const nllStoryChalkieAdapterCurrentRequestKeyRef = useRef('')
  const nllLiaChalkieAdapterRequestIdRef = useRef(0)
  const nllLiaChalkieAdapterRequestKeyRef = useRef('')
  const nllLiaChalkieAdapterCurrentRequestKeyRef = useRef('')
  const nllGrammarChalkieAdapterRequestIdRef = useRef(0)
  const nllGrammarChalkieAdapterRequestKeyRef = useRef('')
  const nllGrammarChalkieAdapterCurrentRequestKeyRef = useRef('')
  const nllClilPeChalkieAdapterRequestIdRef = useRef(0)
  const nllClilPeChalkieAdapterRequestKeyRef = useRef('')
  const nllClilPeChalkieAdapterCurrentRequestKeyRef = useRef('')
  const nllCultureChalkieAdapterRequestIdRef = useRef(0)
  const nllCultureChalkieAdapterRequestKeyRef = useRef('')
  const nllCultureChalkieAdapterCurrentRequestKeyRef = useRef('')
  const nllWritingChalkieAdapterRequestIdRef = useRef(0)
  const nllWritingChalkieAdapterRequestKeyRef = useRef('')
  const nllWritingChalkieAdapterCurrentRequestKeyRef = useRef('')
  const nllPhonicsChalkieAdapterRequestIdRef = useRef(0)
  const nllPhonicsChalkieAdapterRequestKeyRef = useRef('')
  const nllPhonicsChalkieAdapterCurrentRequestKeyRef = useRef('')
  const nllReviewChalkieAdapterRequestIdRef = useRef(0)
  const nllReviewChalkieAdapterRequestKeyRef = useRef('')
  const nllReviewChalkieAdapterCurrentRequestKeyRef = useRef('')
  const preparedOutputKindRef = useRef<PreparedOutputKind | null>(null)
  const [stepId, setStepId] = useState<TeacherChoiceStepId>('student_book')
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    initialSelectedPriorLearningIds(),
  )
  const [teacherAdditions, setTeacherAdditions] = useState<TeacherAddedLanguage[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newFrame, setNewFrame] = useState('')
  const [newPurpose, setNewPurpose] = useState('')
  const [addPriorSkillExpanded, setAddPriorSkillExpanded] = useState(false)
  const [showPromptPreview, setShowPromptPreview] = useState(false)
  const [showChalkiePackaging, setShowChalkiePackaging] = useState(false)
  const [preparedOutputKind, setPreparedOutputKind] =
    useState<PreparedOutputKind | null>(null)
  preparedOutputKindRef.current = preparedOutputKind
  const [promptPreview, setPromptPreview] = useState('')
  const [lessonPlanPreview, setLessonPlanPreview] = useState('')
  const [lessonPlanPreparing, setLessonPlanPreparing] = useState(false)
  const [chalkiePreparing, setChalkiePreparing] = useState(false)
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
  const [sbOnlyHandoff, setSbOnlyHandoff] = useState<SbOnlyTwoLessonHandoff | null>(null)
  const [lessonShape, setLessonShape] = useState<LessonPackageShape>('single')
  const [nllComparisonLoadStatus, setNllComparisonLoadStatus] =
    useState<NllCardComparisonLoadStatus>('idle')
  const [nllComparisonByActivityId, setNllComparisonByActivityId] =
    useState<NllCardComparisonByActivityId | null>(null)
  const activityEnrichmentPocEnabled =
    isBe3U08ActivityEnrichmentPocEnabled() &&
    isExactBe3U08ActivityEnrichmentPocScope(activityCards)
  const workbookEnrichmentPocEnabled =
    activityEnrichmentPocEnabled &&
    isExactBe3U08WorkbookEnrichmentPocScope({
      cards: workbookActivityCards,
      companion: lesson?.workbookCompanion ?? null,
    })
  const nllCardComparisonFlagOn = isNllCardComparisonEnabled()
  const nllCardComparisonExactScope = isExactBe3U08OpenerNllCardComparisonScope({
    activityCards,
    workbookActivityCards,
    companion: lesson?.workbookCompanion ?? null,
  })
  const nllCardComparisonEligible =
    nllCardComparisonFlagOn && nllCardComparisonExactScope
  const showSbExperimentalSummary =
    activityEnrichmentPocEnabled || nllCardComparisonEligible
  const showWbExperimentalSummary =
    workbookEnrichmentPocEnabled || nllCardComparisonEligible
  const nllComparisonScopeKey = nllCardComparisonEligible
    ? openerNllCardComparisonScopeKey({
        activityCards,
        workbookActivityCards,
        companion: lesson?.workbookCompanion ?? null,
      })
    : ''
  const generalLessonPlanScopeKey = openerNllGeneralLessonPlanScopeKey({
    activityCards,
    workbookActivityCards,
    companion: lesson?.workbookCompanion ?? null,
  })
  generalLessonPlanCurrentScopeKeyRef.current = generalLessonPlanScopeKey

  useEffect(() => {
    const shouldLoad = shouldLoadNllCardComparison({
      open,
      comparisonFlagEnabled: nllCardComparisonFlagOn,
      exactScopeEligible: nllCardComparisonExactScope,
    })
    return subscribeNllCardComparisonLifecycle({
      shouldLoad,
      scopeKey: nllComparisonScopeKey,
      client: supabase,
      apply: (next) => {
        setNllComparisonLoadStatus(next.status)
        setNllComparisonByActivityId(next.byActivityId)
      },
    })
  }, [
    open,
    nllCardComparisonFlagOn,
    nllCardComparisonExactScope,
    nllComparisonScopeKey,
  ])

  useEffect(() => {
    if (!open) return
    if (
      lessonPlanPreparing &&
      generalLessonPlanRequestScopeKeyRef.current &&
      generalLessonPlanRequestScopeKeyRef.current !== generalLessonPlanScopeKey
    ) {
      invalidateNllGeneralLessonPlanPilotRequest({
        requestIdRef: generalLessonPlanRequestIdRef,
      })
      setLessonPlanPreparing(false)
    }
  }, [open, generalLessonPlanScopeKey, lessonPlanPreparing])

  useEffect(() => {
    overlayOpenRef.current = open
    if (!open) {
      invalidateNllGeneralLessonPlanPilotRequest({
        requestIdRef: generalLessonPlanRequestIdRef,
      })
      invalidateNllChalkieAdapterPilotRequest({
        requestIdRef: nllChalkieAdapterRequestIdRef,
      })
      invalidateNllStoryChalkieAdapterPilotRequest({
        requestIdRef: nllStoryChalkieAdapterRequestIdRef,
      })
      invalidateNllLiaChalkieAdapterPilotRequest({
        requestIdRef: nllLiaChalkieAdapterRequestIdRef,
      })
      invalidateNllGrammarChalkieAdapterPilotRequest({
        requestIdRef: nllGrammarChalkieAdapterRequestIdRef,
      })
      invalidateNllClilPeChalkieAdapterPilotRequest({
        requestIdRef: nllClilPeChalkieAdapterRequestIdRef,
      })
      invalidateNllCultureChalkieAdapterPilotRequest({
        requestIdRef: nllCultureChalkieAdapterRequestIdRef,
      })
      invalidateNllWritingChalkieAdapterPilotRequest({
        requestIdRef: nllWritingChalkieAdapterRequestIdRef,
      })
      invalidateNllPhonicsChalkieAdapterPilotRequest({
        requestIdRef: nllPhonicsChalkieAdapterRequestIdRef,
      })
      invalidateNllReviewChalkieAdapterPilotRequest({
        requestIdRef: nllReviewChalkieAdapterRequestIdRef,
      })
      generalLessonPlanRequestScopeKeyRef.current = ''
      nllChalkieAdapterRequestKeyRef.current = ''
      nllStoryChalkieAdapterRequestKeyRef.current = ''
      nllLiaChalkieAdapterRequestKeyRef.current = ''
      nllGrammarChalkieAdapterRequestKeyRef.current = ''
      nllClilPeChalkieAdapterRequestKeyRef.current = ''
      nllCultureChalkieAdapterRequestKeyRef.current = ''
      nllWritingChalkieAdapterRequestKeyRef.current = ''
      nllPhonicsChalkieAdapterRequestKeyRef.current = ''
      nllReviewChalkieAdapterRequestKeyRef.current = ''
      preparedOutputKindRef.current = null
      setStepId('student_book')
      setSelectedIds(initialSelectedPriorLearningIds())
      setTeacherAdditions([])
      setNewTitle('')
      setNewFrame('')
      setNewPurpose('')
      setAddPriorSkillExpanded(false)
      setShowPromptPreview(false)
      setShowChalkiePackaging(false)
      setPreparedOutputKind(null)
      setPromptPreview('')
      setLessonPlanPreview('')
      setLessonPlanPreparing(false)
      setChalkiePreparing(false)
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
      setSbOnlyHandoff(null)
      setLessonShape('single')
      return
    }

    setStepId('student_book')
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

  const activityPageColumns = useMemo(
    () =>
      buildSbActivityPageColumns(
        activityCards,
        lesson?.visiblePrintedPages ?? [],
      ),
    [activityCards, lesson?.visiblePrintedPages],
  )
  /**
   * Facing-page "Not included" placeholders only belong on verified SB→WB pair
   * routes. Ordinary Student Book-only lessons show in-scope pages only.
   */
  const hasVerifiedWorkbookCompanion = Boolean(lesson?.workbookCompanion)
  const visibleSbActivityPageColumns = useMemo(
    () =>
      hasVerifiedWorkbookCompanion
        ? activityPageColumns
        : activityPageColumns.filter((column) => column.includedInLessonScope),
    [activityPageColumns, hasVerifiedWorkbookCompanion],
  )
  const sbActivityUsesTwoColumnLayout = visibleSbActivityPageColumns.length > 1

  const activitySelectionStatus = useMemo(
    () => sbActivitySelectionStatus(activityCards, sbActivitySelection),
    [activityCards, sbActivitySelection],
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
      wbActivitySelectionStatus(workbookActivityCards, wbActivitySelection),
    [workbookActivityCards, wbActivitySelection],
  )
  const handoffWorkbookActivitySelection = useMemo(
    () =>
      createWbActivityHandoffSelection(
        workbookActivityCards,
        wbActivitySelection,
      ),
    [workbookActivityCards, wbActivitySelection],
  )
  const handoffActivitySelection = useMemo(
    () => createSbActivityHandoffSelection(activityCards, sbActivitySelection),
    [activityCards, sbActivitySelection],
  )
  const nllChalkieAdapterCurrentRequestKey = nllChalkieAdapterRequestKey({
    activityCards,
    workbookActivityCards,
    companion: lesson?.workbookCompanion ?? null,
    sbSelection: handoffActivitySelection,
    wbSelection: handoffWorkbookActivitySelection,
    selectedSuggestions,
    teacherAdditions: selectedTeacherAdditions,
  })
  const nllStoryChalkieAdapterCurrentRequestKey = nllStoryChalkieAdapterRequestKey({
    activityCards,
    workbookActivityCards,
    companion: lesson?.workbookCompanion ?? null,
    sbSelection: handoffActivitySelection,
    wbSelection: handoffWorkbookActivitySelection,
    selectedSuggestions,
    teacherAdditions: selectedTeacherAdditions,
  })
  const nllLiaChalkieAdapterCurrentRequestKey = nllLiaChalkieAdapterRequestKey({
    activityCards,
    workbookActivityCards,
    companion: lesson?.workbookCompanion ?? null,
    sbSelection: handoffActivitySelection,
    wbSelection: handoffWorkbookActivitySelection,
    selectedSuggestions,
    teacherAdditions: selectedTeacherAdditions,
  })
  const nllGrammarChalkieAdapterCurrentRequestKey =
    nllGrammarChalkieAdapterRequestKey({
      activityCards,
      workbookActivityCards,
      companion: lesson?.workbookCompanion ?? null,
      sbSelection: handoffActivitySelection,
      wbSelection: handoffWorkbookActivitySelection,
      selectedSuggestions,
      teacherAdditions: selectedTeacherAdditions,
    })
  const nllClilPeChalkieAdapterCurrentRequestKey =
    nllClilPeChalkieAdapterRequestKey({
      activityCards,
      workbookActivityCards,
      companion: lesson?.workbookCompanion ?? null,
      sbSelection: handoffActivitySelection,
      wbSelection: handoffWorkbookActivitySelection,
      selectedSuggestions,
      teacherAdditions: selectedTeacherAdditions,
    })
  const nllCultureChalkieAdapterCurrentRequestKey =
    nllCultureChalkieAdapterRequestKey({
      activityCards,
      workbookActivityCards,
      companion: lesson?.workbookCompanion ?? null,
      sbSelection: handoffActivitySelection,
      wbSelection: handoffWorkbookActivitySelection,
      selectedSuggestions,
      teacherAdditions: selectedTeacherAdditions,
    })
  const nllWritingChalkieAdapterCurrentRequestKey =
    nllWritingChalkieAdapterRequestKey({
      activityCards,
      workbookActivityCards,
      companion: lesson?.workbookCompanion ?? null,
      sbSelection: handoffActivitySelection,
      wbSelection: handoffWorkbookActivitySelection,
      selectedSuggestions,
      teacherAdditions: selectedTeacherAdditions,
    })
  const nllPhonicsChalkieAdapterCurrentRequestKey =
    nllPhonicsChalkieAdapterRequestKey({
      activityCards,
      workbookActivityCards,
      companion: lesson?.workbookCompanion ?? null,
      sbSelection: handoffActivitySelection,
      wbSelection: handoffWorkbookActivitySelection,
      selectedSuggestions,
      teacherAdditions: selectedTeacherAdditions,
    })
  const nllReviewChalkieAdapterCurrentRequestKey =
    nllReviewChalkieAdapterRequestKey({
      activityCards,
      workbookActivityCards,
      companion: lesson?.workbookCompanion ?? null,
      sbSelection: handoffActivitySelection,
      wbSelection: handoffWorkbookActivitySelection,
      selectedSuggestions,
      teacherAdditions: selectedTeacherAdditions,
    })

  useLayoutEffect(() => {
    nllChalkieAdapterCurrentRequestKeyRef.current =
      nllChalkieAdapterCurrentRequestKey
  }, [nllChalkieAdapterCurrentRequestKey])

  useLayoutEffect(() => {
    nllStoryChalkieAdapterCurrentRequestKeyRef.current =
      nllStoryChalkieAdapterCurrentRequestKey
  }, [nllStoryChalkieAdapterCurrentRequestKey])

  useLayoutEffect(() => {
    nllLiaChalkieAdapterCurrentRequestKeyRef.current =
      nllLiaChalkieAdapterCurrentRequestKey
  }, [nllLiaChalkieAdapterCurrentRequestKey])

  useLayoutEffect(() => {
    nllGrammarChalkieAdapterCurrentRequestKeyRef.current =
      nllGrammarChalkieAdapterCurrentRequestKey
  }, [nllGrammarChalkieAdapterCurrentRequestKey])

  useLayoutEffect(() => {
    nllClilPeChalkieAdapterCurrentRequestKeyRef.current =
      nllClilPeChalkieAdapterCurrentRequestKey
  }, [nllClilPeChalkieAdapterCurrentRequestKey])

  useLayoutEffect(() => {
    nllCultureChalkieAdapterCurrentRequestKeyRef.current =
      nllCultureChalkieAdapterCurrentRequestKey
  }, [nllCultureChalkieAdapterCurrentRequestKey])

  useLayoutEffect(() => {
    nllWritingChalkieAdapterCurrentRequestKeyRef.current =
      nllWritingChalkieAdapterCurrentRequestKey
  }, [nllWritingChalkieAdapterCurrentRequestKey])

  useLayoutEffect(() => {
    nllPhonicsChalkieAdapterCurrentRequestKeyRef.current =
      nllPhonicsChalkieAdapterCurrentRequestKey
  }, [nllPhonicsChalkieAdapterCurrentRequestKey])

  useLayoutEffect(() => {
    nllReviewChalkieAdapterCurrentRequestKeyRef.current =
      nllReviewChalkieAdapterCurrentRequestKey
  }, [nllReviewChalkieAdapterCurrentRequestKey])

  useEffect(() => {
    if (!open) return
    if (
      chalkiePreparing &&
      nllChalkieAdapterRequestKeyRef.current &&
      nllChalkieAdapterRequestKeyRef.current !==
        nllChalkieAdapterCurrentRequestKey
    ) {
      invalidateNllChalkieAdapterPilotRequest({
        requestIdRef: nllChalkieAdapterRequestIdRef,
      })
      setChalkiePreparing(false)
    }
  }, [chalkiePreparing, nllChalkieAdapterCurrentRequestKey, open])

  useEffect(() => {
    if (!open) return
    if (
      chalkiePreparing &&
      nllStoryChalkieAdapterRequestKeyRef.current &&
      nllStoryChalkieAdapterRequestKeyRef.current !==
        nllStoryChalkieAdapterCurrentRequestKey
    ) {
      invalidateNllStoryChalkieAdapterPilotRequest({
        requestIdRef: nllStoryChalkieAdapterRequestIdRef,
      })
      setChalkiePreparing(false)
    }
  }, [chalkiePreparing, nllStoryChalkieAdapterCurrentRequestKey, open])

  useEffect(() => {
    if (!open) return
    if (
      chalkiePreparing &&
      nllLiaChalkieAdapterRequestKeyRef.current &&
      nllLiaChalkieAdapterRequestKeyRef.current !==
        nllLiaChalkieAdapterCurrentRequestKey
    ) {
      invalidateNllLiaChalkieAdapterPilotRequest({
        requestIdRef: nllLiaChalkieAdapterRequestIdRef,
      })
      setChalkiePreparing(false)
    }
  }, [chalkiePreparing, nllLiaChalkieAdapterCurrentRequestKey, open])

  useEffect(() => {
    if (!open) return
    if (
      chalkiePreparing &&
      nllGrammarChalkieAdapterRequestKeyRef.current &&
      nllGrammarChalkieAdapterRequestKeyRef.current !==
        nllGrammarChalkieAdapterCurrentRequestKey
    ) {
      invalidateNllGrammarChalkieAdapterPilotRequest({
        requestIdRef: nllGrammarChalkieAdapterRequestIdRef,
      })
      invalidateNllClilPeChalkieAdapterPilotRequest({
        requestIdRef: nllClilPeChalkieAdapterRequestIdRef,
      })
      invalidateNllCultureChalkieAdapterPilotRequest({
        requestIdRef: nllCultureChalkieAdapterRequestIdRef,
      })
      invalidateNllWritingChalkieAdapterPilotRequest({
        requestIdRef: nllWritingChalkieAdapterRequestIdRef,
      })
      invalidateNllPhonicsChalkieAdapterPilotRequest({
        requestIdRef: nllPhonicsChalkieAdapterRequestIdRef,
      })
      invalidateNllReviewChalkieAdapterPilotRequest({
        requestIdRef: nllReviewChalkieAdapterRequestIdRef,
      })
      setChalkiePreparing(false)
    }
  }, [chalkiePreparing, nllGrammarChalkieAdapterCurrentRequestKey, open])

  useEffect(() => {
    if (!open) return
    if (
      chalkiePreparing &&
      nllClilPeChalkieAdapterRequestKeyRef.current &&
      nllClilPeChalkieAdapterRequestKeyRef.current !==
        nllClilPeChalkieAdapterCurrentRequestKey
    ) {
      invalidateNllClilPeChalkieAdapterPilotRequest({
        requestIdRef: nllClilPeChalkieAdapterRequestIdRef,
      })
      invalidateNllCultureChalkieAdapterPilotRequest({
        requestIdRef: nllCultureChalkieAdapterRequestIdRef,
      })
      invalidateNllWritingChalkieAdapterPilotRequest({
        requestIdRef: nllWritingChalkieAdapterRequestIdRef,
      })
      invalidateNllPhonicsChalkieAdapterPilotRequest({
        requestIdRef: nllPhonicsChalkieAdapterRequestIdRef,
      })
      invalidateNllReviewChalkieAdapterPilotRequest({
        requestIdRef: nllReviewChalkieAdapterRequestIdRef,
      })
      setChalkiePreparing(false)
    }
  }, [chalkiePreparing, nllClilPeChalkieAdapterCurrentRequestKey, open])

  useEffect(() => {
    if (!open) return
    if (
      chalkiePreparing &&
      nllCultureChalkieAdapterRequestKeyRef.current &&
      nllCultureChalkieAdapterRequestKeyRef.current !==
        nllCultureChalkieAdapterCurrentRequestKey
    ) {
      invalidateNllCultureChalkieAdapterPilotRequest({
        requestIdRef: nllCultureChalkieAdapterRequestIdRef,
      })
      setChalkiePreparing(false)
    }
    if (
      chalkiePreparing &&
      nllWritingChalkieAdapterRequestKeyRef.current &&
      nllWritingChalkieAdapterRequestKeyRef.current !==
        nllWritingChalkieAdapterCurrentRequestKey
    ) {
      invalidateNllWritingChalkieAdapterPilotRequest({
        requestIdRef: nllWritingChalkieAdapterRequestIdRef,
      })
      invalidateNllPhonicsChalkieAdapterPilotRequest({
        requestIdRef: nllPhonicsChalkieAdapterRequestIdRef,
      })
      invalidateNllReviewChalkieAdapterPilotRequest({
        requestIdRef: nllReviewChalkieAdapterRequestIdRef,
      })
      setChalkiePreparing(false)
    }
  }, [chalkiePreparing, nllCultureChalkieAdapterCurrentRequestKey, nllWritingChalkieAdapterCurrentRequestKey, open])

useEffect(() => {
    if (!open) return
    if (
      chalkiePreparing &&
      nllCultureChalkieAdapterRequestKeyRef.current &&
      nllCultureChalkieAdapterRequestKeyRef.current !==
        nllCultureChalkieAdapterCurrentRequestKey
    ) {
      invalidateNllCultureChalkieAdapterPilotRequest({
        requestIdRef: nllCultureChalkieAdapterRequestIdRef,
      })
      setChalkiePreparing(false)
    }
    if (
      chalkiePreparing &&
      nllPhonicsChalkieAdapterRequestKeyRef.current &&
      nllPhonicsChalkieAdapterRequestKeyRef.current !==
        nllPhonicsChalkieAdapterCurrentRequestKey
    ) {
      invalidateNllPhonicsChalkieAdapterPilotRequest({
        requestIdRef: nllPhonicsChalkieAdapterRequestIdRef,
      })
      setChalkiePreparing(false)
    }
  }, [chalkiePreparing, nllPhonicsChalkieAdapterCurrentRequestKey, open])

useEffect(() => {
    if (!open) return
    if (
      chalkiePreparing &&
      nllCultureChalkieAdapterRequestKeyRef.current &&
      nllCultureChalkieAdapterRequestKeyRef.current !==
        nllCultureChalkieAdapterCurrentRequestKey
    ) {
      invalidateNllCultureChalkieAdapterPilotRequest({
        requestIdRef: nllCultureChalkieAdapterRequestIdRef,
      })
      setChalkiePreparing(false)
    }
    if (
      chalkiePreparing &&
      nllReviewChalkieAdapterRequestKeyRef.current &&
      nllReviewChalkieAdapterRequestKeyRef.current !==
        nllReviewChalkieAdapterCurrentRequestKey
    ) {
      invalidateNllReviewChalkieAdapterPilotRequest({
        requestIdRef: nllReviewChalkieAdapterRequestIdRef,
      })
      setChalkiePreparing(false)
    }
  }, [chalkiePreparing, nllReviewChalkieAdapterCurrentRequestKey, open])

  const experimentalActivityEnrichmentPackage = useMemo(
    () =>
      activityEnrichmentPocEnabled
        ? buildBe3U08ActivityEnrichmentPocPackage({
            cards: activityCards,
            activitySelection: sbActivitySelection,
            workbookCards: workbookActivityCards,
            workbookActivitySelection: wbActivitySelection,
            workbookCompanion: lesson?.workbookCompanion ?? null,
          })
        : null,
    [
      activityCards,
      activityEnrichmentPocEnabled,
      lesson?.workbookCompanion,
      sbActivitySelection,
      wbActivitySelection,
      workbookActivityCards,
    ],
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

  const includeWorkbookStep = includeTeacherChoiceWorkbookStep({
    hasVerifiedWorkbookCompanion,
    workbookActivityCardCount: workbookActivityCards.length,
  })
  const totalSteps = teacherChoiceTotalSteps(includeWorkbookStep)
  const resolvedStepId =
    stepId === 'workbook' && !includeWorkbookStep ? 'student_book' : stepId
  const stepNumber = teacherChoiceStepIndex(resolvedStepId, includeWorkbookStep)
  const stepName = teacherChoiceStepName(resolvedStepId)
  const selectedCount = selectedSuggestions.length
  const teacherAddedCount = selectedTeacherAdditions.length
  const canAddPriorSkill =
    newTitle.trim().length > 0 &&
    newFrame.trim().length > 0 &&
    newPurpose.trim().length > 0
  const effectiveLessonShape: LessonPackageShape =
    lessonShape === 'series' && lesson.supportsTwoLessonSeries ? 'series' : 'single'
  const activeLessonTitle = lessonTitleForPackage(lesson, effectiveLessonShape)
  const neutralLessonTitle = lessonTitleForPackage(lesson, 'single')
  const isChalkiePreview =
    showPromptPreview && preparedOutputKind === 'chalkie'
  const isLessonPlanPreview =
    showPromptPreview && preparedOutputKind === 'lesson_plan'
  const isSeriesPreview = isChalkiePreview && effectiveLessonShape === 'series'
  const isBe3SeriesPreview = isSeriesPreview && be3SeriesHandoff != null
  const isSbOnlySeriesPreview =
    isSeriesPreview &&
    lesson.twoLessonPackagingMode === 'sb_only' &&
    sbOnlyHandoff != null
  const selectionHasExclusions = hasSbActivityExclusions(handoffActivitySelection)
  const seriesLesson1Pages =
    lesson.workbookCompanion?.studentBookPrintedPages?.join('–') ?? '128–129'
  const seriesLesson2Pages =
    lesson.workbookCompanion?.workbookPrintedPages?.join('–') ?? '104–105'
  const workbookCompanionPageLabel =
    lesson.workbookCompanion?.workbookPrintedPages?.join('–') ?? null
  const sbOnlyAllocation =
    lesson.twoLessonPackagingMode === 'sb_only'
      ? allocateSbOnlyTwoLessonActivities(handoffActivitySelection.selectedEvidence)
      : null
  const hasPriorLearningSuggestions = priorLearningSuggestions.length > 0
  const showChooseOutput =
    resolvedStepId === 'choose_output' &&
    !showPromptPreview &&
    !showChalkiePackaging

  const handleContinue = () => {
    if (resolvedStepId === 'choose_output') return
    setShowPromptPreview(false)
    setCopyStatus('idle')
    setStepId(advanceTeacherChoiceStepId(resolvedStepId, includeWorkbookStep))
  }

  const handleBack = () => {
    if (showPromptPreview) {
      if (preparedOutputKind === 'lesson_plan') {
        invalidateNllGeneralLessonPlanPilotRequest({
          requestIdRef: generalLessonPlanRequestIdRef,
        })
        setLessonPlanPreparing(false)
      }
      if (preparedOutputKind === 'chalkie') {
        invalidateNllChalkieAdapterPilotRequest({
          requestIdRef: nllChalkieAdapterRequestIdRef,
        })
        invalidateNllStoryChalkieAdapterPilotRequest({
          requestIdRef: nllStoryChalkieAdapterRequestIdRef,
        })
        invalidateNllLiaChalkieAdapterPilotRequest({
          requestIdRef: nllLiaChalkieAdapterRequestIdRef,
        })
        invalidateNllGrammarChalkieAdapterPilotRequest({
          requestIdRef: nllGrammarChalkieAdapterRequestIdRef,
        })
        invalidateNllClilPeChalkieAdapterPilotRequest({
          requestIdRef: nllClilPeChalkieAdapterRequestIdRef,
        })
        invalidateNllCultureChalkieAdapterPilotRequest({
          requestIdRef: nllCultureChalkieAdapterRequestIdRef,
        })
      invalidateNllWritingChalkieAdapterPilotRequest({
        requestIdRef: nllWritingChalkieAdapterRequestIdRef,
      })
      invalidateNllPhonicsChalkieAdapterPilotRequest({
        requestIdRef: nllPhonicsChalkieAdapterRequestIdRef,
      })
      invalidateNllReviewChalkieAdapterPilotRequest({
        requestIdRef: nllReviewChalkieAdapterRequestIdRef,
      })
        setChalkiePreparing(false)
      }
      setShowPromptPreview(false)
      preparedOutputKindRef.current = null
      setPreparedOutputKind(null)
      setCopyStatus('idle')
      if (preparedOutputKind === 'chalkie') {
        setShowChalkiePackaging(true)
      }
      return
    }
    if (showChalkiePackaging) {
      setShowChalkiePackaging(false)
      return
    }
    if (resolvedStepId !== 'student_book') {
      setStepId(retreatTeacherChoiceStepId(resolvedStepId, includeWorkbookStep))
    }
  }

  const handlePackageShapeChange = (next: LessonPackageShape) => {
    if (next === 'series' && !lesson.supportsTwoLessonSeries) return
    invalidateNllChalkieAdapterPilotRequest({
      requestIdRef: nllChalkieAdapterRequestIdRef,
    })
    invalidateNllStoryChalkieAdapterPilotRequest({
      requestIdRef: nllStoryChalkieAdapterRequestIdRef,
    })
    invalidateNllLiaChalkieAdapterPilotRequest({
      requestIdRef: nllLiaChalkieAdapterRequestIdRef,
    })
    invalidateNllGrammarChalkieAdapterPilotRequest({
      requestIdRef: nllGrammarChalkieAdapterRequestIdRef,
    })
    invalidateNllClilPeChalkieAdapterPilotRequest({
      requestIdRef: nllClilPeChalkieAdapterRequestIdRef,
    })
    invalidateNllCultureChalkieAdapterPilotRequest({
      requestIdRef: nllCultureChalkieAdapterRequestIdRef,
    })
      invalidateNllWritingChalkieAdapterPilotRequest({
        requestIdRef: nllWritingChalkieAdapterRequestIdRef,
      })
      invalidateNllPhonicsChalkieAdapterPilotRequest({
        requestIdRef: nllPhonicsChalkieAdapterRequestIdRef,
      })
      invalidateNllReviewChalkieAdapterPilotRequest({
        requestIdRef: nllReviewChalkieAdapterRequestIdRef,
      })
    setChalkiePreparing(false)
    setLessonShape(next)
    setTitleCopyStatus('idle')
    if (showPromptPreview) {
      setShowPromptPreview(false)
      setPreparedOutputKind(null)
      setPromptPreview('')
      setLessonPlanPreview('')
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
      setSbOnlyHandoff(null)
    }
  }

  const buildExistingChalkieOutput = (biInputs: ReturnType<typeof resolveOverlayBiInputs>) => {
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
      lesson.twoLessonPackagingMode === 'sb_wb' &&
      isBe3U08SeriesCompanion(lesson.workbookCompanion)
    const useSbOnlySeries =
      effectiveLessonShape === 'series' &&
      lesson.twoLessonPackagingMode === 'sb_only'
    const be3Handoff = useBe3Series
      ? buildBe3U08SeriesHandoffForCompanion(
        lesson.workbookCompanion,
        selectedSuggestions,
        selectedTeacherAdditions,
        handoffActivitySelection,
        handoffWorkbookActivitySelection,
        biInputs,
      )
      : null
    const sbOnly = useSbOnlySeries
      ? buildSbOnlyTwoLessonHandoff({
        lesson,
        selectedSuggestions,
        teacherAdditions: selectedTeacherAdditions,
        activitySelection: handoffActivitySelection,
      })
      : null
    const outline =
      useBe3Series || useSbOnlySeries
        ? ''
        : buildChalkieConciseOutline({
          lesson,
          selectedSuggestions,
          activitySelection: handoffActivitySelection,
        })
    const suggested =
      useBe3Series || useSbOnlySeries
        ? { copyText: '', isEmpty: true }
        : buildSuggestedChalkieVocabulary(lesson, handoffActivitySelection)
    return { assembled, be3Handoff, sbOnly, outline, suggested }
  }

  const applyPreparedChalkieOutput = (input: {
    assembled: string
    be3Handoff: Be3U08SeriesHandoff | null
    sbOnly: SbOnlyTwoLessonHandoff | null
    outline: string
    suggested: { copyText: string; isEmpty: boolean }
  }) => {
    preparedOutputKindRef.current = 'chalkie'
    setPreparedOutputKind('chalkie')
    setPromptPreview(input.assembled)
    setLessonPlanPreview('')
    setBe3SeriesHandoff(input.be3Handoff)
    setSbOnlyHandoff(input.sbOnly)
    setConciseOutline(input.outline)
    setSuggestedVocabulary(input.suggested.copyText)
    setSuggestedVocabularyEmpty(input.suggested.isEmpty)
    setShowPromptPreview(true)
    setShowChalkiePackaging(false)
    setCopyStatus('idle')
    setOutlineCopyStatus('idle')
    setVocabularyCopyStatus('idle')
    setTitleCopyStatus('idle')
    setLesson1OutlineCopyStatus('idle')
    setLesson2OutlineCopyStatus('idle')
    setLesson1VocabCopyStatus('idle')
    setLesson2VocabCopyStatus('idle')
  }

  const beginChalkiePreparingChrome = () => {
    setChalkiePreparing(true)
    preparedOutputKindRef.current = 'chalkie'
    setPreparedOutputKind('chalkie')
    setPromptPreview('Preparing Chalkie prompt…')
    setLessonPlanPreview('')
    setBe3SeriesHandoff(null)
    setSbOnlyHandoff(null)
    setConciseOutline('')
    setSuggestedVocabulary('')
    setSuggestedVocabularyEmpty(true)
    setShowPromptPreview(true)
    setShowChalkiePackaging(false)
  }

  const handlePrepareChalkiePrompt = () => {
    invalidateNllGeneralLessonPlanPilotRequest({
      requestIdRef: generalLessonPlanRequestIdRef,
    })
    setLessonPlanPreparing(false)
    const biInputs = resolveOverlayBiInputs({ lesson, bookIntelligence })
    const seriesPackageRequested =
      effectiveLessonShape === 'series' &&
      lesson.twoLessonPackagingMode === 'sb_wb'
    // LiA/Grammar/CLIL/Culture/Writing remain resolver sb_only; C-adapters activate on teacher-chosen series only.
    const liaSeriesPackageRequested = effectiveLessonShape === 'series'
    const grammarSeriesPackageRequested = effectiveLessonShape === 'series'
    const clilPeSeriesPackageRequested = effectiveLessonShape === 'series'
    const cultureSeriesPackageRequested = effectiveLessonShape === 'series'
    const writingSeriesPackageRequested = effectiveLessonShape === 'series'
    const phonicsSeriesPackageRequested = effectiveLessonShape === 'series'
    const reviewSeriesPackageRequested = effectiveLessonShape === 'series'

    const runStoryPilot = shouldRunNllStoryChalkieAdapterPilot({
      flagEnabled: isNllStoryChalkieAdapterPilotEnabled(),
      exactScopeEligible: isExactBe3U08StoryNllChalkieAdapterScope({
        activityCards,
        workbookActivityCards,
        companion: lesson.workbookCompanion ?? null,
      }),
      chalkieRequested: true,
      seriesPackageRequested,
    })

    if (runStoryPilot) {
      invalidateNllChalkieAdapterPilotRequest({
        requestIdRef: nllChalkieAdapterRequestIdRef,
      })
      invalidateNllLiaChalkieAdapterPilotRequest({
        requestIdRef: nllLiaChalkieAdapterRequestIdRef,
      })
      invalidateNllGrammarChalkieAdapterPilotRequest({
        requestIdRef: nllGrammarChalkieAdapterRequestIdRef,
      })
      invalidateNllClilPeChalkieAdapterPilotRequest({
        requestIdRef: nllClilPeChalkieAdapterRequestIdRef,
      })
      invalidateNllCultureChalkieAdapterPilotRequest({
        requestIdRef: nllCultureChalkieAdapterRequestIdRef,
      })
      invalidateNllWritingChalkieAdapterPilotRequest({
        requestIdRef: nllWritingChalkieAdapterRequestIdRef,
      })
      invalidateNllPhonicsChalkieAdapterPilotRequest({
        requestIdRef: nllPhonicsChalkieAdapterRequestIdRef,
      })
      invalidateNllReviewChalkieAdapterPilotRequest({
        requestIdRef: nllReviewChalkieAdapterRequestIdRef,
      })
      nllChalkieAdapterRequestKeyRef.current = ''
      nllLiaChalkieAdapterRequestKeyRef.current = ''
      nllGrammarChalkieAdapterRequestKeyRef.current = ''
      nllClilPeChalkieAdapterRequestKeyRef.current = ''
      nllCultureChalkieAdapterRequestKeyRef.current = ''
      nllWritingChalkieAdapterRequestKeyRef.current = ''
      nllPhonicsChalkieAdapterRequestKeyRef.current = ''
      nllReviewChalkieAdapterRequestKeyRef.current = ''
      const requestId = nllStoryChalkieAdapterRequestIdRef.current + 1
      nllStoryChalkieAdapterRequestIdRef.current = requestId
      const requestKey = nllStoryChalkieAdapterCurrentRequestKey
      nllStoryChalkieAdapterRequestKeyRef.current = requestKey
      beginChalkiePreparingChrome()

      void assembleNllStoryChalkieAdapterPilot({
        flagEnabled: true,
        activityCards,
        workbookActivityCards,
        companion: lesson.workbookCompanion ?? null,
        sbSelection: handoffActivitySelection,
        wbSelection: handoffWorkbookActivitySelection,
        selectedSuggestions,
        teacherAdditions: selectedTeacherAdditions,
        client: supabase,
      }).then((result) => {
        if (
          !shouldApplyNllStoryChalkieAdapterPilotResult({
            requestId,
            latestRequestId: nllStoryChalkieAdapterRequestIdRef.current,
            overlayOpen: overlayOpenRef.current,
            requestKey,
            currentRequestKey:
              nllStoryChalkieAdapterCurrentRequestKeyRef.current,
            preparedOutputKind: preparedOutputKindRef.current,
          })
        ) {
          return
        }

        setChalkiePreparing(false)
        if (!result.ok) {
          applyPreparedChalkieOutput(buildExistingChalkieOutput(biInputs))
          return
        }

        // Story remains BI-absent: do not apply Opener BI framing.
        applyPreparedChalkieOutput({
          assembled: result.handoff.detailedHandoff,
          be3Handoff: result.handoff,
          sbOnly: null,
          outline: '',
          suggested: { copyText: '', isEmpty: true },
        })
      })
      return
    }

    const runLiaPilot = shouldRunNllLiaChalkieAdapterPilot({
      flagEnabled: isNllLiaChalkieAdapterPilotEnabled(),
      exactScopeEligible: isExactBe3U08LiaNllChalkieAdapterScope({
        activityCards,
        workbookActivityCards,
        companion: lesson.workbookCompanion ?? null,
      }),
      chalkieRequested: true,
      seriesPackageRequested: liaSeriesPackageRequested,
    })

    if (runLiaPilot) {
      invalidateNllChalkieAdapterPilotRequest({
        requestIdRef: nllChalkieAdapterRequestIdRef,
      })
      invalidateNllStoryChalkieAdapterPilotRequest({
        requestIdRef: nllStoryChalkieAdapterRequestIdRef,
      })
      invalidateNllGrammarChalkieAdapterPilotRequest({
        requestIdRef: nllGrammarChalkieAdapterRequestIdRef,
      })
      invalidateNllClilPeChalkieAdapterPilotRequest({
        requestIdRef: nllClilPeChalkieAdapterRequestIdRef,
      })
      invalidateNllCultureChalkieAdapterPilotRequest({
        requestIdRef: nllCultureChalkieAdapterRequestIdRef,
      })
      invalidateNllWritingChalkieAdapterPilotRequest({
        requestIdRef: nllWritingChalkieAdapterRequestIdRef,
      })
      invalidateNllPhonicsChalkieAdapterPilotRequest({
        requestIdRef: nllPhonicsChalkieAdapterRequestIdRef,
      })
      invalidateNllReviewChalkieAdapterPilotRequest({
        requestIdRef: nllReviewChalkieAdapterRequestIdRef,
      })
      nllChalkieAdapterRequestKeyRef.current = ''
      nllStoryChalkieAdapterRequestKeyRef.current = ''
      nllGrammarChalkieAdapterRequestKeyRef.current = ''
      nllClilPeChalkieAdapterRequestKeyRef.current = ''
      nllCultureChalkieAdapterRequestKeyRef.current = ''
      nllWritingChalkieAdapterRequestKeyRef.current = ''
      nllPhonicsChalkieAdapterRequestKeyRef.current = ''
      nllReviewChalkieAdapterRequestKeyRef.current = ''
      const requestId = nllLiaChalkieAdapterRequestIdRef.current + 1
      nllLiaChalkieAdapterRequestIdRef.current = requestId
      const requestKey = nllLiaChalkieAdapterCurrentRequestKey
      nllLiaChalkieAdapterRequestKeyRef.current = requestKey
      beginChalkiePreparingChrome()

      void assembleNllLiaChalkieAdapterPilot({
        flagEnabled: true,
        activityCards,
        workbookActivityCards,
        companion: lesson.workbookCompanion ?? null,
        sbSelection: handoffActivitySelection,
        wbSelection: handoffWorkbookActivitySelection,
        selectedSuggestions,
        teacherAdditions: selectedTeacherAdditions,
        client: supabase,
      }).then((result) => {
        if (
          !shouldApplyNllLiaChalkieAdapterPilotResult({
            requestId,
            latestRequestId: nllLiaChalkieAdapterRequestIdRef.current,
            overlayOpen: overlayOpenRef.current,
            requestKey,
            currentRequestKey: nllLiaChalkieAdapterCurrentRequestKeyRef.current,
            preparedOutputKind: preparedOutputKindRef.current,
          })
        ) {
          return
        }

        setChalkiePreparing(false)
        if (!result.ok) {
          // LiA-C failure: retain current sb_only path with captured selections.
          applyPreparedChalkieOutput(buildExistingChalkieOutput(biInputs))
          return
        }

        // LiA remains BI-absent: do not apply Opener BI framing.
        applyPreparedChalkieOutput({
          assembled: result.handoff.detailedHandoff,
          be3Handoff: result.handoff,
          sbOnly: null,
          outline: '',
          suggested: { copyText: '', isEmpty: true },
        })
      })
      return
    }

    const runClilPePilot = shouldRunNllClilPeChalkieAdapterPilot({
      flagEnabled: isNllClilPeChalkieAdapterPilotEnabled(),
      exactScopeEligible: isExactBe3U08ClilPeNllChalkieAdapterScope({
        activityCards,
        workbookActivityCards,
        companion: lesson.workbookCompanion ?? null,
      }),
      chalkieRequested: true,
      seriesPackageRequested: clilPeSeriesPackageRequested,
    })

    if (runClilPePilot) {
      invalidateNllChalkieAdapterPilotRequest({
        requestIdRef: nllChalkieAdapterRequestIdRef,
      })
      invalidateNllStoryChalkieAdapterPilotRequest({
        requestIdRef: nllStoryChalkieAdapterRequestIdRef,
      })
      invalidateNllLiaChalkieAdapterPilotRequest({
        requestIdRef: nllLiaChalkieAdapterRequestIdRef,
      })
      invalidateNllGrammarChalkieAdapterPilotRequest({
        requestIdRef: nllGrammarChalkieAdapterRequestIdRef,
      })
      invalidateNllClilPeChalkieAdapterPilotRequest({
        requestIdRef: nllClilPeChalkieAdapterRequestIdRef,
      })
      invalidateNllCultureChalkieAdapterPilotRequest({
        requestIdRef: nllCultureChalkieAdapterRequestIdRef,
      })
      invalidateNllWritingChalkieAdapterPilotRequest({
        requestIdRef: nllWritingChalkieAdapterRequestIdRef,
      })
      invalidateNllPhonicsChalkieAdapterPilotRequest({
        requestIdRef: nllPhonicsChalkieAdapterRequestIdRef,
      })
      invalidateNllReviewChalkieAdapterPilotRequest({
        requestIdRef: nllReviewChalkieAdapterRequestIdRef,
      })
      nllChalkieAdapterRequestKeyRef.current = ''
      nllStoryChalkieAdapterRequestKeyRef.current = ''
      nllLiaChalkieAdapterRequestKeyRef.current = ''
      nllGrammarChalkieAdapterRequestKeyRef.current = ''
      nllClilPeChalkieAdapterRequestKeyRef.current = ''
      nllCultureChalkieAdapterRequestKeyRef.current = ''
      nllWritingChalkieAdapterRequestKeyRef.current = ''
      nllPhonicsChalkieAdapterRequestKeyRef.current = ''
      nllReviewChalkieAdapterRequestKeyRef.current = ''
      const requestId = nllClilPeChalkieAdapterRequestIdRef.current + 1
      nllClilPeChalkieAdapterRequestIdRef.current = requestId
      const requestKey = nllClilPeChalkieAdapterCurrentRequestKey
      nllClilPeChalkieAdapterRequestKeyRef.current = requestKey
      beginChalkiePreparingChrome()

      void assembleNllClilPeChalkieAdapterPilot({
        flagEnabled: true,
        activityCards,
        workbookActivityCards,
        companion: lesson.workbookCompanion ?? null,
        sbSelection: handoffActivitySelection,
        wbSelection: handoffWorkbookActivitySelection,
        selectedSuggestions,
        teacherAdditions: selectedTeacherAdditions,
        client: supabase,
      }).then((result) => {
        if (
          !shouldApplyNllClilPeChalkieAdapterPilotResult({
            requestId,
            latestRequestId: nllClilPeChalkieAdapterRequestIdRef.current,
            overlayOpen: overlayOpenRef.current,
            requestKey,
            currentRequestKey:
              nllClilPeChalkieAdapterCurrentRequestKeyRef.current,
            preparedOutputKind: preparedOutputKindRef.current,
          })
        ) {
          return
        }

        setChalkiePreparing(false)
        if (!result.ok) {
          // CLIL-C failure: retain current sb_only path with captured selections.
          applyPreparedChalkieOutput(buildExistingChalkieOutput(biInputs))
          return
        }

        // CLIL remains BI-absent: do not apply Opener BI framing.
        applyPreparedChalkieOutput({
          assembled: result.handoff.detailedHandoff,
          be3Handoff: result.handoff,
          sbOnly: null,
          outline: '',
          suggested: { copyText: '', isEmpty: true },
        })
      })
      return
    }

    const runCulturePilot = shouldRunNllCultureChalkieAdapterPilot({
      flagEnabled: isNllCultureChalkieAdapterPilotEnabled(),
      exactScopeEligible: isExactBe3U08CultureNllChalkieAdapterScope({
        activityCards,
        workbookActivityCards,
        companion: lesson.workbookCompanion ?? null,
      }),
      chalkieRequested: true,
      seriesPackageRequested: cultureSeriesPackageRequested,
    })

    if (runCulturePilot) {
      invalidateNllChalkieAdapterPilotRequest({
        requestIdRef: nllChalkieAdapterRequestIdRef,
      })
      invalidateNllStoryChalkieAdapterPilotRequest({
        requestIdRef: nllStoryChalkieAdapterRequestIdRef,
      })
      invalidateNllLiaChalkieAdapterPilotRequest({
        requestIdRef: nllLiaChalkieAdapterRequestIdRef,
      })
      invalidateNllGrammarChalkieAdapterPilotRequest({
        requestIdRef: nllGrammarChalkieAdapterRequestIdRef,
      })
      invalidateNllClilPeChalkieAdapterPilotRequest({
        requestIdRef: nllClilPeChalkieAdapterRequestIdRef,
      })
      invalidateNllCultureChalkieAdapterPilotRequest({
        requestIdRef: nllCultureChalkieAdapterRequestIdRef,
      })
      invalidateNllWritingChalkieAdapterPilotRequest({
        requestIdRef: nllWritingChalkieAdapterRequestIdRef,
      })
      invalidateNllPhonicsChalkieAdapterPilotRequest({
        requestIdRef: nllPhonicsChalkieAdapterRequestIdRef,
      })
      invalidateNllReviewChalkieAdapterPilotRequest({
        requestIdRef: nllReviewChalkieAdapterRequestIdRef,
      })
      nllChalkieAdapterRequestKeyRef.current = ''
      nllStoryChalkieAdapterRequestKeyRef.current = ''
      nllLiaChalkieAdapterRequestKeyRef.current = ''
      nllGrammarChalkieAdapterRequestKeyRef.current = ''
      nllClilPeChalkieAdapterRequestKeyRef.current = ''
      nllCultureChalkieAdapterRequestKeyRef.current = ''
      nllWritingChalkieAdapterRequestKeyRef.current = ''
      nllPhonicsChalkieAdapterRequestKeyRef.current = ''
      nllReviewChalkieAdapterRequestKeyRef.current = ''
      const requestId = nllCultureChalkieAdapterRequestIdRef.current + 1
      nllCultureChalkieAdapterRequestIdRef.current = requestId
      const requestKey = nllCultureChalkieAdapterCurrentRequestKey
      nllCultureChalkieAdapterRequestKeyRef.current = requestKey
      beginChalkiePreparingChrome()

      void assembleNllCultureChalkieAdapterPilot({
        flagEnabled: true,
        activityCards,
        workbookActivityCards,
        companion: lesson.workbookCompanion ?? null,
        sbSelection: handoffActivitySelection,
        wbSelection: handoffWorkbookActivitySelection,
        selectedSuggestions,
        teacherAdditions: selectedTeacherAdditions,
        client: supabase,
      }).then((result) => {
        if (
          !shouldApplyNllCultureChalkieAdapterPilotResult({
            requestId,
            latestRequestId: nllCultureChalkieAdapterRequestIdRef.current,
            overlayOpen: overlayOpenRef.current,
            requestKey,
            currentRequestKey:
              nllCultureChalkieAdapterCurrentRequestKeyRef.current,
            preparedOutputKind: preparedOutputKindRef.current,
          })
        ) {
          return
        }

        setChalkiePreparing(false)
        if (!result.ok) {
          // Culture-C failure: retain current sb_only path with captured selections.
          applyPreparedChalkieOutput(buildExistingChalkieOutput(biInputs))
          return
        }

        // Culture remains BI-absent: do not apply Opener BI framing.
        applyPreparedChalkieOutput({
          assembled: result.handoff.detailedHandoff,
          be3Handoff: result.handoff,
          sbOnly: null,
          outline: '',
          suggested: { copyText: '', isEmpty: true },
        })
      })
      return
    }

    const runWritingPilot = shouldRunNllWritingChalkieAdapterPilot({
      flagEnabled: isNllWritingChalkieAdapterPilotEnabled(),
      exactScopeEligible: isExactBe3U08WritingNllChalkieAdapterScope({
        activityCards,
        workbookActivityCards,
        companion: lesson.workbookCompanion ?? null,
      }),
      chalkieRequested: true,
      seriesPackageRequested: writingSeriesPackageRequested,
    })

    if (runWritingPilot) {
      invalidateNllChalkieAdapterPilotRequest({
        requestIdRef: nllChalkieAdapterRequestIdRef,
      })
      invalidateNllStoryChalkieAdapterPilotRequest({
        requestIdRef: nllStoryChalkieAdapterRequestIdRef,
      })
      invalidateNllLiaChalkieAdapterPilotRequest({
        requestIdRef: nllLiaChalkieAdapterRequestIdRef,
      })
      invalidateNllGrammarChalkieAdapterPilotRequest({
        requestIdRef: nllGrammarChalkieAdapterRequestIdRef,
      })
      invalidateNllClilPeChalkieAdapterPilotRequest({
        requestIdRef: nllClilPeChalkieAdapterRequestIdRef,
      })
      invalidateNllCultureChalkieAdapterPilotRequest({
        requestIdRef: nllCultureChalkieAdapterRequestIdRef,
      })
      invalidateNllWritingChalkieAdapterPilotRequest({
        requestIdRef: nllWritingChalkieAdapterRequestIdRef,
      })
      invalidateNllPhonicsChalkieAdapterPilotRequest({
        requestIdRef: nllPhonicsChalkieAdapterRequestIdRef,
      })
      invalidateNllReviewChalkieAdapterPilotRequest({
        requestIdRef: nllReviewChalkieAdapterRequestIdRef,
      })
      nllChalkieAdapterRequestKeyRef.current = ''
      nllStoryChalkieAdapterRequestKeyRef.current = ''
      nllLiaChalkieAdapterRequestKeyRef.current = ''
      nllGrammarChalkieAdapterRequestKeyRef.current = ''
      nllClilPeChalkieAdapterRequestKeyRef.current = ''
      nllCultureChalkieAdapterRequestKeyRef.current = ''
      nllWritingChalkieAdapterRequestKeyRef.current = ''
      nllPhonicsChalkieAdapterRequestKeyRef.current = ''
      nllReviewChalkieAdapterRequestKeyRef.current = ''
      const requestId = nllWritingChalkieAdapterRequestIdRef.current + 1
      nllWritingChalkieAdapterRequestIdRef.current = requestId
      const requestKey = nllWritingChalkieAdapterCurrentRequestKey
      nllWritingChalkieAdapterRequestKeyRef.current = requestKey
      beginChalkiePreparingChrome()

      void assembleNllWritingChalkieAdapterPilot({
        flagEnabled: true,
        activityCards,
        workbookActivityCards,
        companion: lesson.workbookCompanion ?? null,
        sbSelection: handoffActivitySelection,
        wbSelection: handoffWorkbookActivitySelection,
        selectedSuggestions,
        teacherAdditions: selectedTeacherAdditions,
        client: supabase,
      }).then((result) => {
        if (
          !shouldApplyNllWritingChalkieAdapterPilotResult({
            requestId,
            latestRequestId: nllWritingChalkieAdapterRequestIdRef.current,
            overlayOpen: overlayOpenRef.current,
            requestKey,
            currentRequestKey:
              nllWritingChalkieAdapterCurrentRequestKeyRef.current,
            preparedOutputKind: preparedOutputKindRef.current,
          })
        ) {
          return
        }

        setChalkiePreparing(false)
        if (!result.ok) {
          // Writing-C failure: retain current sb_only path with captured selections.
          applyPreparedChalkieOutput(buildExistingChalkieOutput(biInputs))
          return
        }

        // Writing remains BI-absent: do not apply Opener BI framing.
        applyPreparedChalkieOutput({
          assembled: result.handoff.detailedHandoff,
          be3Handoff: result.handoff,
          sbOnly: null,
          outline: '',
          suggested: { copyText: '', isEmpty: true },
        })
      })
      return
    }

    const runPhonicsPilot = shouldRunNllPhonicsChalkieAdapterPilot({
      flagEnabled: isNllPhonicsChalkieAdapterPilotEnabled(),
      exactScopeEligible: isExactBe3U08PhonicsNllChalkieAdapterScope({
        activityCards,
        workbookActivityCards,
        companion: lesson.workbookCompanion ?? null,
      }),
      chalkieRequested: true,
      seriesPackageRequested: phonicsSeriesPackageRequested,
    })

    if (runPhonicsPilot) {
      invalidateNllChalkieAdapterPilotRequest({
        requestIdRef: nllChalkieAdapterRequestIdRef,
      })
      invalidateNllStoryChalkieAdapterPilotRequest({
        requestIdRef: nllStoryChalkieAdapterRequestIdRef,
      })
      invalidateNllLiaChalkieAdapterPilotRequest({
        requestIdRef: nllLiaChalkieAdapterRequestIdRef,
      })
      invalidateNllGrammarChalkieAdapterPilotRequest({
        requestIdRef: nllGrammarChalkieAdapterRequestIdRef,
      })
      invalidateNllClilPeChalkieAdapterPilotRequest({
        requestIdRef: nllClilPeChalkieAdapterRequestIdRef,
      })
      invalidateNllCultureChalkieAdapterPilotRequest({
        requestIdRef: nllCultureChalkieAdapterRequestIdRef,
      })
      invalidateNllWritingChalkieAdapterPilotRequest({
        requestIdRef: nllWritingChalkieAdapterRequestIdRef,
      })
      invalidateNllPhonicsChalkieAdapterPilotRequest({
        requestIdRef: nllPhonicsChalkieAdapterRequestIdRef,
      })
      invalidateNllReviewChalkieAdapterPilotRequest({
        requestIdRef: nllReviewChalkieAdapterRequestIdRef,
      })
      nllChalkieAdapterRequestKeyRef.current = ''
      nllStoryChalkieAdapterRequestKeyRef.current = ''
      nllLiaChalkieAdapterRequestKeyRef.current = ''
      nllGrammarChalkieAdapterRequestKeyRef.current = ''
      nllClilPeChalkieAdapterRequestKeyRef.current = ''
      nllCultureChalkieAdapterRequestKeyRef.current = ''
      nllWritingChalkieAdapterRequestKeyRef.current = ''
      nllPhonicsChalkieAdapterRequestKeyRef.current = ''
      nllReviewChalkieAdapterRequestKeyRef.current = ''
      const requestId = nllPhonicsChalkieAdapterRequestIdRef.current + 1
      nllPhonicsChalkieAdapterRequestIdRef.current = requestId
      const requestKey = nllPhonicsChalkieAdapterCurrentRequestKey
      nllPhonicsChalkieAdapterRequestKeyRef.current = requestKey
      beginChalkiePreparingChrome()

      void assembleNllPhonicsChalkieAdapterPilot({
        flagEnabled: true,
        activityCards,
        workbookActivityCards,
        companion: lesson.workbookCompanion ?? null,
        sbSelection: handoffActivitySelection,
        wbSelection: handoffWorkbookActivitySelection,
        selectedSuggestions,
        teacherAdditions: selectedTeacherAdditions,
        client: supabase,
      }).then((result) => {
        if (
          !shouldApplyNllPhonicsChalkieAdapterPilotResult({
            requestId,
            latestRequestId: nllPhonicsChalkieAdapterRequestIdRef.current,
            overlayOpen: overlayOpenRef.current,
            requestKey,
            currentRequestKey:
              nllPhonicsChalkieAdapterCurrentRequestKeyRef.current,
            preparedOutputKind: preparedOutputKindRef.current,
          })
        ) {
          return
        }

        setChalkiePreparing(false)
        if (!result.ok) {
          // Phonics-C failure: retain current sb_only path with captured selections.
          applyPreparedChalkieOutput(buildExistingChalkieOutput(biInputs))
          return
        }

        // Phonics remains BI-absent: do not apply Opener BI framing.
        applyPreparedChalkieOutput({
          assembled: result.handoff.detailedHandoff,
          be3Handoff: result.handoff,
          sbOnly: null,
          outline: '',
          suggested: { copyText: '', isEmpty: true },
        })
      })
      return
    }

    const runReviewPilot = shouldRunNllReviewChalkieAdapterPilot({
      flagEnabled: isNllReviewChalkieAdapterPilotEnabled(),
      exactScopeEligible: isExactBe3U08ReviewNllChalkieAdapterScope({
        activityCards,
        workbookActivityCards,
        companion: lesson.workbookCompanion ?? null,
      }),
      chalkieRequested: true,
      seriesPackageRequested: reviewSeriesPackageRequested,
    })

    if (runReviewPilot) {
      invalidateNllChalkieAdapterPilotRequest({
        requestIdRef: nllChalkieAdapterRequestIdRef,
      })
      invalidateNllStoryChalkieAdapterPilotRequest({
        requestIdRef: nllStoryChalkieAdapterRequestIdRef,
      })
      invalidateNllLiaChalkieAdapterPilotRequest({
        requestIdRef: nllLiaChalkieAdapterRequestIdRef,
      })
      invalidateNllGrammarChalkieAdapterPilotRequest({
        requestIdRef: nllGrammarChalkieAdapterRequestIdRef,
      })
      invalidateNllClilPeChalkieAdapterPilotRequest({
        requestIdRef: nllClilPeChalkieAdapterRequestIdRef,
      })
      invalidateNllCultureChalkieAdapterPilotRequest({
        requestIdRef: nllCultureChalkieAdapterRequestIdRef,
      })
      invalidateNllWritingChalkieAdapterPilotRequest({
        requestIdRef: nllWritingChalkieAdapterRequestIdRef,
      })
      invalidateNllPhonicsChalkieAdapterPilotRequest({
        requestIdRef: nllPhonicsChalkieAdapterRequestIdRef,
      })
      invalidateNllReviewChalkieAdapterPilotRequest({
        requestIdRef: nllReviewChalkieAdapterRequestIdRef,
      })
      nllChalkieAdapterRequestKeyRef.current = ''
      nllStoryChalkieAdapterRequestKeyRef.current = ''
      nllLiaChalkieAdapterRequestKeyRef.current = ''
      nllGrammarChalkieAdapterRequestKeyRef.current = ''
      nllClilPeChalkieAdapterRequestKeyRef.current = ''
      nllCultureChalkieAdapterRequestKeyRef.current = ''
      nllWritingChalkieAdapterRequestKeyRef.current = ''
      nllPhonicsChalkieAdapterRequestKeyRef.current = ''
      nllReviewChalkieAdapterRequestKeyRef.current = ''
      const requestId = nllReviewChalkieAdapterRequestIdRef.current + 1
      nllReviewChalkieAdapterRequestIdRef.current = requestId
      const requestKey = nllReviewChalkieAdapterCurrentRequestKey
      nllReviewChalkieAdapterRequestKeyRef.current = requestKey
      beginChalkiePreparingChrome()

      void assembleNllReviewChalkieAdapterPilot({
        flagEnabled: true,
        activityCards,
        workbookActivityCards,
        companion: lesson.workbookCompanion ?? null,
        sbSelection: handoffActivitySelection,
        wbSelection: handoffWorkbookActivitySelection,
        selectedSuggestions,
        teacherAdditions: selectedTeacherAdditions,
        client: supabase,
      }).then((result) => {
        if (
          !shouldApplyNllReviewChalkieAdapterPilotResult({
            requestId,
            latestRequestId: nllReviewChalkieAdapterRequestIdRef.current,
            overlayOpen: overlayOpenRef.current,
            requestKey,
            currentRequestKey:
              nllReviewChalkieAdapterCurrentRequestKeyRef.current,
            preparedOutputKind: preparedOutputKindRef.current,
          })
        ) {
          return
        }

        setChalkiePreparing(false)
        if (!result.ok) {
          // Review-C failure: retain current sb_only path with captured selections.
          applyPreparedChalkieOutput(buildExistingChalkieOutput(biInputs))
          return
        }

        // Review remains BI-absent: do not apply Opener BI framing.
        applyPreparedChalkieOutput({
          assembled: result.handoff.detailedHandoff,
          be3Handoff: result.handoff,
          sbOnly: null,
          outline: '',
          suggested: { copyText: '', isEmpty: true },
        })
      })
      return
    }


    const runGrammarPilot = shouldRunNllGrammarChalkieAdapterPilot({
      flagEnabled: isNllGrammarChalkieAdapterPilotEnabled(),
      exactScopeEligible: isExactBe3U08GrammarNllChalkieAdapterScope({
        activityCards,
        workbookActivityCards,
        companion: lesson.workbookCompanion ?? null,
      }),
      chalkieRequested: true,
      seriesPackageRequested: grammarSeriesPackageRequested,
    })

    if (runGrammarPilot) {
      invalidateNllChalkieAdapterPilotRequest({
        requestIdRef: nllChalkieAdapterRequestIdRef,
      })
      invalidateNllStoryChalkieAdapterPilotRequest({
        requestIdRef: nllStoryChalkieAdapterRequestIdRef,
      })
      invalidateNllLiaChalkieAdapterPilotRequest({
        requestIdRef: nllLiaChalkieAdapterRequestIdRef,
      })
      invalidateNllClilPeChalkieAdapterPilotRequest({
        requestIdRef: nllClilPeChalkieAdapterRequestIdRef,
      })
      invalidateNllCultureChalkieAdapterPilotRequest({
        requestIdRef: nllCultureChalkieAdapterRequestIdRef,
      })
      invalidateNllWritingChalkieAdapterPilotRequest({
        requestIdRef: nllWritingChalkieAdapterRequestIdRef,
      })
      invalidateNllPhonicsChalkieAdapterPilotRequest({
        requestIdRef: nllPhonicsChalkieAdapterRequestIdRef,
      })
      invalidateNllReviewChalkieAdapterPilotRequest({
        requestIdRef: nllReviewChalkieAdapterRequestIdRef,
      })
      nllChalkieAdapterRequestKeyRef.current = ''
      nllStoryChalkieAdapterRequestKeyRef.current = ''
      nllLiaChalkieAdapterRequestKeyRef.current = ''
      nllClilPeChalkieAdapterRequestKeyRef.current = ''
      nllCultureChalkieAdapterRequestKeyRef.current = ''
      nllWritingChalkieAdapterRequestKeyRef.current = ''
      nllPhonicsChalkieAdapterRequestKeyRef.current = ''
      nllReviewChalkieAdapterRequestKeyRef.current = ''
      const requestId = nllGrammarChalkieAdapterRequestIdRef.current + 1
      nllGrammarChalkieAdapterRequestIdRef.current = requestId
      const requestKey = nllGrammarChalkieAdapterCurrentRequestKey
      nllGrammarChalkieAdapterRequestKeyRef.current = requestKey
      beginChalkiePreparingChrome()

      void assembleNllGrammarChalkieAdapterPilot({
        flagEnabled: true,
        activityCards,
        workbookActivityCards,
        companion: lesson.workbookCompanion ?? null,
        sbSelection: handoffActivitySelection,
        wbSelection: handoffWorkbookActivitySelection,
        selectedSuggestions,
        teacherAdditions: selectedTeacherAdditions,
        client: supabase,
      }).then((result) => {
        if (
          !shouldApplyNllGrammarChalkieAdapterPilotResult({
            requestId,
            latestRequestId: nllGrammarChalkieAdapterRequestIdRef.current,
            overlayOpen: overlayOpenRef.current,
            requestKey,
            currentRequestKey:
              nllGrammarChalkieAdapterCurrentRequestKeyRef.current,
            preparedOutputKind: preparedOutputKindRef.current,
          })
        ) {
          return
        }

        setChalkiePreparing(false)
        if (!result.ok) {
          // Grammar-C failure: retain current sb_only path with captured selections.
          applyPreparedChalkieOutput(buildExistingChalkieOutput(biInputs))
          return
        }

        // Grammar remains BI-absent: do not apply Opener BI framing.
        applyPreparedChalkieOutput({
          assembled: result.handoff.detailedHandoff,
          be3Handoff: result.handoff,
          sbOnly: null,
          outline: '',
          suggested: { copyText: '', isEmpty: true },
        })
      })
      return
    }

    const runOpenerPilot = shouldRunNllChalkieAdapterPilot({
      flagEnabled: isNllChalkieAdapterPilotEnabled(),
      exactScopeEligible: isExactBe3U08OpenerNllChalkieAdapterScope({
        activityCards,
        workbookActivityCards,
        companion: lesson.workbookCompanion ?? null,
      }),
      chalkieRequested: true,
      seriesPackageRequested,
    })

    if (!runOpenerPilot) {
      invalidateNllChalkieAdapterPilotRequest({
        requestIdRef: nllChalkieAdapterRequestIdRef,
      })
      invalidateNllStoryChalkieAdapterPilotRequest({
        requestIdRef: nllStoryChalkieAdapterRequestIdRef,
      })
      invalidateNllLiaChalkieAdapterPilotRequest({
        requestIdRef: nllLiaChalkieAdapterRequestIdRef,
      })
      invalidateNllGrammarChalkieAdapterPilotRequest({
        requestIdRef: nllGrammarChalkieAdapterRequestIdRef,
      })
      invalidateNllClilPeChalkieAdapterPilotRequest({
        requestIdRef: nllClilPeChalkieAdapterRequestIdRef,
      })
      invalidateNllCultureChalkieAdapterPilotRequest({
        requestIdRef: nllCultureChalkieAdapterRequestIdRef,
      })
      invalidateNllWritingChalkieAdapterPilotRequest({
        requestIdRef: nllWritingChalkieAdapterRequestIdRef,
      })
      invalidateNllPhonicsChalkieAdapterPilotRequest({
        requestIdRef: nllPhonicsChalkieAdapterRequestIdRef,
      })
      invalidateNllReviewChalkieAdapterPilotRequest({
        requestIdRef: nllReviewChalkieAdapterRequestIdRef,
      })
      setChalkiePreparing(false)
      applyPreparedChalkieOutput(buildExistingChalkieOutput(biInputs))
      return
    }

    invalidateNllStoryChalkieAdapterPilotRequest({
      requestIdRef: nllStoryChalkieAdapterRequestIdRef,
    })
    invalidateNllLiaChalkieAdapterPilotRequest({
      requestIdRef: nllLiaChalkieAdapterRequestIdRef,
    })
    invalidateNllGrammarChalkieAdapterPilotRequest({
      requestIdRef: nllGrammarChalkieAdapterRequestIdRef,
    })
    invalidateNllClilPeChalkieAdapterPilotRequest({
      requestIdRef: nllClilPeChalkieAdapterRequestIdRef,
    })
    invalidateNllCultureChalkieAdapterPilotRequest({
      requestIdRef: nllCultureChalkieAdapterRequestIdRef,
    })
      invalidateNllWritingChalkieAdapterPilotRequest({
        requestIdRef: nllWritingChalkieAdapterRequestIdRef,
      })
      invalidateNllPhonicsChalkieAdapterPilotRequest({
        requestIdRef: nllPhonicsChalkieAdapterRequestIdRef,
      })
      invalidateNllReviewChalkieAdapterPilotRequest({
        requestIdRef: nllReviewChalkieAdapterRequestIdRef,
      })
    nllStoryChalkieAdapterRequestKeyRef.current = ''
    nllLiaChalkieAdapterRequestKeyRef.current = ''
    nllGrammarChalkieAdapterRequestKeyRef.current = ''
    nllClilPeChalkieAdapterRequestKeyRef.current = ''
      nllCultureChalkieAdapterRequestKeyRef.current = ''
      nllWritingChalkieAdapterRequestKeyRef.current = ''
      nllPhonicsChalkieAdapterRequestKeyRef.current = ''
      nllReviewChalkieAdapterRequestKeyRef.current = ''
    const requestId = nllChalkieAdapterRequestIdRef.current + 1
    nllChalkieAdapterRequestIdRef.current = requestId
    const requestKey = nllChalkieAdapterCurrentRequestKey
    nllChalkieAdapterRequestKeyRef.current = requestKey
    beginChalkiePreparingChrome()

    void assembleNllChalkieAdapterPilot({
      flagEnabled: true,
      activityCards,
      workbookActivityCards,
      companion: lesson.workbookCompanion ?? null,
      sbSelection: handoffActivitySelection,
      wbSelection: handoffWorkbookActivitySelection,
      selectedSuggestions,
      teacherAdditions: selectedTeacherAdditions,
      bookIntelligenceUnit: biInputs.unit,
      biArtifactRef: biInputs.biArtifactRef,
      client: supabase,
    }).then((result) => {
      if (
        !shouldApplyNllChalkieAdapterPilotResult({
          requestId,
          latestRequestId: nllChalkieAdapterRequestIdRef.current,
          overlayOpen: overlayOpenRef.current,
          requestKey,
          currentRequestKey: nllChalkieAdapterCurrentRequestKeyRef.current,
          preparedOutputKind: preparedOutputKindRef.current,
        })
      ) {
        return
      }

      setChalkiePreparing(false)
      if (!result.ok) {
        applyPreparedChalkieOutput(buildExistingChalkieOutput(biInputs))
        return
      }

      const handoff = applyOpenerBiFramingToHandoff(
        result.handoff,
        biInputs.planningContext,
      )
      applyPreparedChalkieOutput({
        assembled: handoff.detailedHandoff,
        be3Handoff: handoff,
        sbOnly: null,
        outline: '',
        suggested: { copyText: '', isEmpty: true },
      })
    })
  }

  const handleChooseChalkie = () => {
    invalidateNllGeneralLessonPlanPilotRequest({
      requestIdRef: generalLessonPlanRequestIdRef,
    })
    invalidateNllChalkieAdapterPilotRequest({
      requestIdRef: nllChalkieAdapterRequestIdRef,
    })
    invalidateNllStoryChalkieAdapterPilotRequest({
      requestIdRef: nllStoryChalkieAdapterRequestIdRef,
    })
    invalidateNllLiaChalkieAdapterPilotRequest({
      requestIdRef: nllLiaChalkieAdapterRequestIdRef,
    })
    invalidateNllGrammarChalkieAdapterPilotRequest({
      requestIdRef: nllGrammarChalkieAdapterRequestIdRef,
    })
    invalidateNllClilPeChalkieAdapterPilotRequest({
      requestIdRef: nllClilPeChalkieAdapterRequestIdRef,
    })
    invalidateNllCultureChalkieAdapterPilotRequest({
      requestIdRef: nllCultureChalkieAdapterRequestIdRef,
    })
      invalidateNllWritingChalkieAdapterPilotRequest({
        requestIdRef: nllWritingChalkieAdapterRequestIdRef,
      })
      invalidateNllPhonicsChalkieAdapterPilotRequest({
        requestIdRef: nllPhonicsChalkieAdapterRequestIdRef,
      })
      invalidateNllReviewChalkieAdapterPilotRequest({
        requestIdRef: nllReviewChalkieAdapterRequestIdRef,
      })
    setLessonPlanPreparing(false)
    setChalkiePreparing(false)
    // Keep preparedOutputKind off General so an in-flight Stage 4 result cannot apply.
    if (preparedOutputKindRef.current === 'lesson_plan') {
      preparedOutputKindRef.current = null
      setPreparedOutputKind(null)
    }
    setShowChalkiePackaging(true)
  }

  const resetPreviewChromeForLessonPlan = () => {
    preparedOutputKindRef.current = 'lesson_plan'
    setPreparedOutputKind('lesson_plan')
    setPromptPreview('')
    setBe3SeriesHandoff(null)
    setSbOnlyHandoff(null)
    setConciseOutline('')
    setSuggestedVocabulary('')
    setSuggestedVocabularyEmpty(true)
    setShowPromptPreview(true)
    setShowChalkiePackaging(false)
    setCopyStatus('idle')
    setOutlineCopyStatus('idle')
    setVocabularyCopyStatus('idle')
    setTitleCopyStatus('idle')
    setLesson1OutlineCopyStatus('idle')
    setLesson2OutlineCopyStatus('idle')
    setLesson1VocabCopyStatus('idle')
    setLesson2VocabCopyStatus('idle')
  }

  const buildExistingGeneralLessonPlanText = (fallbackLine?: string) => {
    const biInputs = resolveOverlayBiInputs({ lesson, bookIntelligence })
    const plan = buildDetailedGeneralLessonPlan({
      lesson,
      selectedSuggestions,
      teacherAdditions: selectedTeacherAdditions,
      activitySelection: handoffActivitySelection,
      workbookActivitySelection: handoffWorkbookActivitySelection,
      bookIntelligenceUnit: biInputs.unit,
      biArtifactRef: biInputs.biArtifactRef,
    })
    return fallbackLine
      ? `${fallbackLine}\n\n${plan.detailedLessonPlan}`
      : plan.detailedLessonPlan
  }

  const handlePrepareDetailedLessonPlan = () => {
    invalidateNllChalkieAdapterPilotRequest({
      requestIdRef: nllChalkieAdapterRequestIdRef,
    })
    invalidateNllStoryChalkieAdapterPilotRequest({
      requestIdRef: nllStoryChalkieAdapterRequestIdRef,
    })
    invalidateNllLiaChalkieAdapterPilotRequest({
      requestIdRef: nllLiaChalkieAdapterRequestIdRef,
    })
    invalidateNllGrammarChalkieAdapterPilotRequest({
      requestIdRef: nllGrammarChalkieAdapterRequestIdRef,
    })
    invalidateNllClilPeChalkieAdapterPilotRequest({
      requestIdRef: nllClilPeChalkieAdapterRequestIdRef,
    })
    invalidateNllCultureChalkieAdapterPilotRequest({
      requestIdRef: nllCultureChalkieAdapterRequestIdRef,
    })
      invalidateNllWritingChalkieAdapterPilotRequest({
        requestIdRef: nllWritingChalkieAdapterRequestIdRef,
      })
      invalidateNllPhonicsChalkieAdapterPilotRequest({
        requestIdRef: nllPhonicsChalkieAdapterRequestIdRef,
      })
      invalidateNllReviewChalkieAdapterPilotRequest({
        requestIdRef: nllReviewChalkieAdapterRequestIdRef,
      })
    setChalkiePreparing(false)
    const flagEnabled = isNllGeneralLessonPlanPilotEnabled()
    const exactScopeEligible = isExactBe3U08OpenerNllGeneralLessonPlanScope({
      activityCards,
      workbookActivityCards,
      companion: lesson.workbookCompanion ?? null,
    })
    const runPilot = shouldRunNllGeneralLessonPlanPilot({
      flagEnabled,
      exactScopeEligible,
      generalLessonPlanRequested: true,
    })

    if (!runPilot) {
      setLessonPlanPreparing(false)
      resetPreviewChromeForLessonPlan()
      setLessonPlanPreview(buildExistingGeneralLessonPlanText())
      return
    }

    const requestId = generalLessonPlanRequestIdRef.current + 1
    generalLessonPlanRequestIdRef.current = requestId
    const requestScopeKey = generalLessonPlanScopeKey
    generalLessonPlanRequestScopeKeyRef.current = requestScopeKey
    setLessonPlanPreparing(true)
    resetPreviewChromeForLessonPlan()
    setLessonPlanPreview('Preparing general lesson plan…')

    void assembleNllGeneralLessonPlanPilot({
      flagEnabled: true,
      activityCards,
      workbookActivityCards,
      companion: lesson.workbookCompanion ?? null,
      sbSelection: handoffActivitySelection,
      wbSelection: handoffWorkbookActivitySelection,
      selectedSuggestions,
      teacherAdditions: selectedTeacherAdditions,
      client: supabase,
    }).then((result) => {
      if (
        !shouldApplyNllGeneralLessonPlanPilotResult({
          requestId,
          latestRequestId: generalLessonPlanRequestIdRef.current,
          overlayOpen: overlayOpenRef.current,
          requestScopeKey,
          currentScopeKey: generalLessonPlanCurrentScopeKeyRef.current,
          preparedOutputKind: preparedOutputKindRef.current,
        })
      ) {
        return
      }
      setLessonPlanPreparing(false)
      if (result.ok) {
        setLessonPlanPreview(
          renderGeneralLessonPlanFromNeutralPackage(result.nlp),
        )
        return
      }
      setLessonPlanPreview(
        buildExistingGeneralLessonPlanText(NLL_GENERAL_LESSON_PLAN_FALLBACK_LINE),
      )
    })
  }

  const handleCopyPrompt = async () => {
    const text =
      preparedOutputKind === 'lesson_plan' ? lessonPlanPreview : promptPreview
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
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

  const handleAddPriorSkill = () => {
    if (!canAddPriorSkill) return
    const id = `teacher-added-${Date.now()}-${teacherAdditions.length + 1}`
    setTeacherAdditions((prev) => {
      const next = appendTeacherAddedLanguage(prev, newTitle, newFrame, newPurpose, () => id)
      return next ?? prev
    })
    // Session teacher-added stays optional/unchecked — never auto-selected into handoff.
    setNewTitle('')
    setNewFrame('')
    setNewPurpose('')
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-3 sm:p-5 lg:p-8">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex h-[min(calc(78vh+120px),calc(52rem+120px))] max-h-[calc(100vh-2.5rem)] w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl sm:w-[min(80vw,1440px)]"
        data-teacher-choice-fixed-height="true"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 bg-white px-5 py-3.5 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <p className="text-xs text-slate-500">
              Step {stepNumber} of {totalSteps}
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
          className={`min-h-0 flex-1 bg-[#8bcfd9]/20 ${
            resolvedStepId === 'student_book' || resolvedStepId === 'workbook'
              ? 'flex flex-col overflow-hidden px-4 py-4 sm:px-6 sm:py-5 lg:px-8'
              : 'overflow-y-auto px-5 py-6 sm:px-8 sm:py-8 lg:px-10'
          }`}
          data-teacher-choice-body={
            resolvedStepId === 'student_book' || resolvedStepId === 'workbook'
              ? 'activity-review'
              : 'default'
          }
        >
          {resolvedStepId === 'student_book' ? (
            <div className="mx-auto flex h-full min-h-0 w-full max-w-[80rem] flex-col gap-3">
              <section
                className="flex min-h-0 flex-1 flex-col gap-3"
                aria-label="Review selected Student Book activities"
                data-sb-only-layout={hasVerifiedWorkbookCompanion ? undefined : 'true'}
                data-activity-selection-review="student_book"
              >
                <ActivityReviewBookSpread
                  spreadAttr="data-sb-activity-spread"
                  pageCount={visibleSbActivityPageColumns.length}
                  title="Student Book activities"
                  titleId={titleId}
                  countLabel={includedActivitiesCountLabel(
                    activitySelectionStatus.selectedCount,
                    activitySelectionStatus.totalCount,
                  )}
                  showGutter={sbActivityUsesTwoColumnLayout}
                  twoColumn={sbActivityUsesTwoColumnLayout}
                >
                  {visibleSbActivityPageColumns.map((column) => (
                    <ActivityReviewBookPage
                      key={column.printedPage}
                      includedInLessonScope={column.includedInLessonScope}
                      heading={
                        column.includedInLessonScope
                          ? `Student Book · p.${column.printedPage}`
                          : null
                      }
                      placeholderText="Not included in this lesson scope."
                      pageAttrName="data-sb-activity-page"
                      pageAttrValue={column.printedPage}
                      facingPlaceholderAttr="data-sb-facing-placeholder"
                      facingPosition={column.position}
                    >
                      {column.cards.length > 0 ? (
                        <ul className="space-y-3">
                          {column.cards.map((card) => (
                            <ActivityEvidenceCard
                              key={card.id}
                              card={card}
                              pagePrefix="SB"
                              compact
                              layout="modal"
                              selected={sbActivitySelection.selectedCardIds.includes(
                                card.id,
                              )}
                              onSelectedChange={(selected) => {
                                onSbActivitySelectionChange(card.id, selected)
                              }}
                              checkboxId={`current-activity-${card.id}`}
                              experimentalSummary={
                                showSbExperimentalSummary
                                  ? getBe3U08ActivitySummary(
                                      card.references.activityId,
                                    )
                                  : null
                              }
                              nllComparison={
                                nllCardComparisonEligible
                                  ? toNllCardComparisonDisplayState({
                                      loadStatus: nllComparisonLoadStatus,
                                      byActivityId: nllComparisonByActivityId,
                                      activityId: card.references.activityId,
                                    })
                                  : null
                              }
                            />
                          ))}
                        </ul>
                      ) : (
                        <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50/70 p-3 text-xs leading-relaxed text-slate-500">
                          No human-verified Student Book activity cards are available for this
                          page.
                        </p>
                      )}
                    </ActivityReviewBookPage>
                  ))}
                </ActivityReviewBookSpread>

                {activitySelectionStatus.hasNoSelectedCurrentActivities ? (
                  <div className="shrink-0 px-1">
                    <p
                      role="status"
                      className="rounded-md border border-amber-200/80 bg-amber-50/80 px-3 py-2 text-xs leading-relaxed text-amber-900"
                    >
                      No current Student Book activities are selected. A later handoff would contain
                      no selected current-page activities.
                    </p>
                  </div>
                ) : null}
              </section>
            </div>
          ) : null}

          {resolvedStepId === 'workbook' && includeWorkbookStep ? (
            <div className="mx-auto flex h-full min-h-0 w-full max-w-[80rem] flex-col gap-3">
              <section
                className="flex min-h-0 flex-1 flex-col gap-3"
                aria-label="Review selected Workbook activities"
                data-wb-activity-section
                data-sb-wb-pair-layout="true"
                data-activity-selection-review="workbook"
              >
                <ActivityReviewBookSpread
                  spreadAttr="data-wb-activity-spread"
                  pageCount={workbookActivityPagePanels.length}
                  title="Verified Workbook companion for this lesson"
                  titleId={titleId}
                  countLabel={includedActivitiesCountLabel(
                    workbookActivitySelectionStatus.selectedCount,
                    workbookActivitySelectionStatus.totalCount,
                  )}
                  showGutter={workbookActivityPagePanels.length > 1}
                  twoColumn={true}
                >
                  {workbookActivityPagePanels.map((panel) => (
                    <ActivityReviewBookPage
                      key={panel.pageId ?? `placeholder-${panel.position}`}
                      includedInLessonScope={panel.includedInLessonScope}
                      heading={
                        panel.includedInLessonScope
                          ? `Workbook · p.${panel.printedPage}`
                          : null
                      }
                      placeholderText="No verified Workbook content for this lesson."
                      pageAttrName="data-wb-activity-page"
                      pageAttrValue={panel.printedPage ?? undefined}
                      facingPlaceholderAttr="data-wb-facing-placeholder"
                      facingPosition={panel.position}
                    >
                      {panel.cards.length > 0 ? (
                        <ul className="space-y-3">
                          {panel.cards.map((card) => (
                            <ActivityEvidenceCard
                              key={card.id}
                              card={card}
                              pagePrefix="WB"
                              compact
                              layout="modal"
                              selected={wbActivitySelection.selectedCardIds.includes(
                                card.id,
                              )}
                              onSelectedChange={(selected) =>
                                onWbActivitySelectionChange(card.id, selected)
                              }
                              checkboxId={`workbook-activity-${card.id}`}
                              experimentalSummary={
                                showWbExperimentalSummary
                                  ? getBe3U08WbActivitySummary(
                                      card.references[0]?.activityId ?? '',
                                    )
                                  : null
                              }
                              nllComparison={
                                nllCardComparisonEligible
                                  ? toNllCardComparisonDisplayState({
                                      loadStatus: nllComparisonLoadStatus,
                                      byActivityId: nllComparisonByActivityId,
                                      activityId:
                                        card.references[0]?.activityId ?? '',
                                    })
                                  : null
                              }
                            />
                          ))}
                        </ul>
                      ) : (
                        <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50/70 p-3 text-xs leading-relaxed text-slate-500">
                          No human-verified Workbook activity cards are available for this
                          mapped page.
                        </p>
                      )}
                    </ActivityReviewBookPage>
                  ))}
                </ActivityReviewBookSpread>

                {workbookActivitySelectionStatus.hasNoSelectedWorkbookActivities ? (
                  <div className="shrink-0 px-1">
                    <p
                      role="status"
                      className="rounded-md border border-amber-200/80 bg-amber-50/80 px-3 py-2 text-xs leading-relaxed text-amber-900"
                    >
                      No Workbook activities are selected for this session.
                    </p>
                  </div>
                ) : null}
              </section>
            </div>
          ) : null}

          {resolvedStepId === 'prior_skills' ? (
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
                          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${canAddPriorSkill
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
                        Session only. New skills stay unchecked until you select them. They are
                        labelled [TEACHER-ADDED · UNVERIFIED] in the handoff and are not publisher
                        evidence or School Notes.
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
                      className={`rounded-xl border p-4 transition-colors sm:p-5 ${checked
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
                          <p className="text-xs leading-relaxed text-slate-500">
                            {formatTeacherAddedProvenanceLine()}
                          </p>
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
                  const priorCandidate = (
                    lesson?.sameUnitPriorLearningCandidates ?? []
                  ).find((candidate) => candidate.id === suggestion.id)
                  const hmCandidate = (
                    lesson?.curatedHorizontalMappingCandidates ?? []
                  ).find((candidate) => candidate.id === suggestion.id)
                  const isPrior =
                    suggestion.provenanceTag === '[PRIOR]' ||
                    priorCandidate?.sourceType === 'PRIOR'
                  const isHm =
                    !isPrior &&
                    (suggestion.provenanceTag === '[HM]' ||
                      hmCandidate?.sourceType === 'HM')
                  return (
                    <li
                      key={suggestion.id}
                      className={`rounded-xl border p-4 transition-colors sm:p-5 ${checked
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
                          {isPrior ? (
                            <p className="text-xs leading-relaxed text-slate-500">
                              {formatSameUnitPriorProvenanceLine({
                                source: suggestion.source,
                                evidenceKindLabel:
                                  suggestion.evidenceKindLabel ??
                                  priorLearningEvidenceKindDisplayLabel(
                                    priorCandidate?.evidenceKind,
                                  ),
                                includeOptionalSupportNote: Boolean(priorCandidate),
                              })}
                            </p>
                          ) : isHm ? (
                            <p className="text-xs leading-relaxed text-slate-500">
                              {formatCuratedHmProvenanceLine({
                                source: suggestion.source,
                                includeOptionalSupportNote: true,
                              })}
                            </p>
                          ) : null}
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

          {resolvedStepId === 'neutral_review' &&
          !showPromptPreview &&
          !showChalkiePackaging ? (
            <div className="space-y-8">
              <div className="max-w-3xl space-y-3">
                <h2
                  id={titleId}
                  className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.75rem]"
                >
                  Review lesson package
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  A calm summary of the selected Student Book activities
                  {includeWorkbookStep ? ', Workbook activities,' : ''} and prior skills.
                  You will choose the output format next.
                </p>
              </div>

              <section className="max-w-3xl space-y-3" aria-label="Lesson focus">
                <h3 className="text-sm font-medium text-slate-800">Lesson focus</h3>
                <div className="space-y-2 rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5">
                  <p className="select-text text-sm leading-relaxed text-slate-800">
                    {neutralLessonTitle}
                  </p>
                  {lesson.currentFocus ? (
                    <p className="text-sm leading-relaxed text-slate-600">
                      {lesson.currentFocus}
                    </p>
                  ) : null}
                  <p className="text-sm leading-relaxed text-slate-500">
                    Source pages: Student Book {lesson.visiblePageRangeLabel}
                    {includeWorkbookStep && workbookCompanionPageLabel
                      ? ` · Workbook pp. ${workbookCompanionPageLabel}`
                      : ''}
                  </p>
                  {includeWorkbookStep && lesson.workbookCompanion ? (
                    <p className="text-sm leading-relaxed text-slate-500">
                      Verified Workbook companion is available for this lesson.
                    </p>
                  ) : null}
                </div>
              </section>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
                <section className="space-y-4" aria-label="Selected Student Book activities">
                  <h3 className="text-sm font-medium text-slate-800">
                    Selected Student Book activities
                  </h3>
                  <div className="space-y-3 rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5">
                    <div className="space-y-1 text-sm leading-relaxed text-slate-600">
                      <p className="font-medium text-slate-800">{lesson.bookLabel}</p>
                      <p>{lesson.unitLine}</p>
                      <p>Source scope: {lesson.visiblePageRangeLabel}</p>
                    </div>
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
                        No Student Book activities are selected.
                      </p>
                    )}

                    {experimentalActivityEnrichmentPackage ? (
                      <div
                        className="space-y-2 border-t border-indigo-100 pt-3"
                        data-experimental-activity-enrichment-package
                        data-experimental-neutral-lesson-package
                      >
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                            Activity enrichment experiment · not NLL adapter
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-slate-500">
                            Bounded BE3 U8 activity-summary experiment (flag{' '}
                            <span className="font-mono">
                              VITE_CHALKIE_BE3_U08_ACTIVITY_ENRICHMENT_POC
                            </span>
                            ). Not production behaviour and not the Neutral Lesson
                            Library component adapter. Selections are copied into this
                            lesson-specific view only; sidecar and publisher records
                            remain unchanged.
                          </p>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-600">
                              Student Book activities
                            </p>
                            {experimentalActivityEnrichmentPackage.studentBookActivities
                              .length > 0 ? (
                              <ul className="mt-1.5 space-y-2">
                                {experimentalActivityEnrichmentPackage.studentBookActivities.map(
                                  (activity) => (
                                    <li
                                      key={`sb-${activity.selection.activityId}`}
                                      className="rounded-md border border-indigo-100 bg-indigo-50/50 p-2.5"
                                    >
                                      <p className="text-xs font-medium text-slate-800">
                                        {activity.summary.text}
                                      </p>
                                      <p className="mt-1 text-[11px] text-slate-500">
                                        SB evidence: {activity.publisherEvidenceReference.activityId}
                                      </p>
                                    </li>
                                  ),
                                )}
                              </ul>
                            ) : (
                              <p className="mt-1.5 text-xs text-slate-500">
                                No Student Book activities are included in this experimental package.
                              </p>
                            )}
                          </div>
                          {experimentalActivityEnrichmentPackage.scope.workbook ? (
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-600">
                                Workbook activities
                              </p>
                              {experimentalActivityEnrichmentPackage.workbookActivities
                                .length > 0 ? (
                                <ul className="mt-1.5 space-y-2">
                                  {experimentalActivityEnrichmentPackage.workbookActivities.map(
                                    (activity) => (
                                      <li
                                        key={`wb-${activity.selection.activityId}`}
                                        className="rounded-md border border-indigo-100 bg-indigo-50/50 p-2.5"
                                      >
                                        <p className="text-xs font-medium text-slate-800">
                                          {activity.summary.text}
                                        </p>
                                        <p className="mt-1 text-[11px] text-slate-500">
                                          WB evidence: {activity.publisherEvidenceReference.activityId}
                                        </p>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              ) : (
                                <p className="mt-1.5 text-xs text-slate-500">
                                  No Workbook activities are included in this experimental package.
                                </p>
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </section>

                <div className="space-y-8">
                  {includeWorkbookStep ? (
                    <section
                      className="space-y-4"
                      aria-label="Selected Workbook activities"
                    >
                      <h3 className="text-sm font-medium text-slate-800">
                        Selected Workbook activities
                      </h3>
                      <div className="space-y-3 rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5">
                        {handoffWorkbookActivitySelection.selectedEvidence.length > 0 ? (
                          <ul className="space-y-1.5 text-sm leading-relaxed text-slate-700">
                            {handoffWorkbookActivitySelection.selectedEvidence.map(
                              (activity) => (
                                <li key={activity.cardId}>
                                  <span className="font-medium text-slate-800">
                                    [WB p.{activity.printedPage}]
                                    {activity.activityNumber
                                      ? ` · Activity ${activity.activityNumber}`
                                      : ''}
                                  </span>
                                  {' — '}
                                  {activity.verifiedWording}
                                </li>
                              ),
                            )}
                          </ul>
                        ) : (
                          <p className="text-sm text-slate-500">
                            No Workbook activities are selected.
                          </p>
                        )}
                      </div>
                    </section>
                  ) : null}

                  <section className="space-y-4" aria-label="Selected prior skills">
                    <h3 className="text-sm font-medium text-slate-800">
                      Selected prior skills
                    </h3>
                    <div className="space-y-4 rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5">
                      {selectedSuggestions.length === 0 &&
                      selectedTeacherAdditions.length === 0 ? (
                        <p className="text-sm leading-relaxed text-slate-500">
                          No prior skills were selected for this lesson.
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
                            </li>
                          ))}
                          {selectedTeacherAdditions.map((item) => (
                            <li key={item.id} className="space-y-1.5">
                              <p className="text-sm font-bold text-slate-900">{item.title}</p>
                              <p className="text-sm leading-relaxed text-slate-900">
                                {item.frame}
                              </p>
                              <p className="text-sm leading-relaxed text-slate-600">
                                <span className="font-medium text-slate-700">Purpose:</span>{' '}
                                {item.purpose}
                              </p>
                              <p className="text-xs leading-relaxed text-slate-500">
                                {formatTeacherAddedProvenanceLine()}
                              </p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          ) : null}

          {showChooseOutput ? (
            <div className="mx-auto w-full max-w-4xl space-y-7">
              <div className="space-y-3">
                <h2
                  id={titleId}
                  className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.75rem]"
                >
                  What would you like to create?
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  Your lesson evidence and selected support are ready. Choose an output format.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleChooseChalkie}
                  className="group rounded-xl border border-indigo-200 bg-white p-5 text-left shadow-xs transition hover:border-indigo-400 hover:bg-indigo-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <span className="mb-4 inline-flex rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white">Chalkie</span>
                  <span className="block text-lg font-semibold text-slate-900">Chalkie prompt</span>
                  <span className="mt-2 block text-sm leading-relaxed text-slate-600">
                    Prepare a Chalkie-ready prompt. Choose its lesson packaging on the next screen.
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handlePrepareDetailedLessonPlan}
                  disabled={lessonPlanPreparing}
                  className="group rounded-xl border border-slate-200 bg-white p-5 text-left shadow-xs transition hover:border-[#3766a3] hover:bg-sky-50/40 focus:outline-none focus:ring-2 focus:ring-[#3766a3] disabled:cursor-wait disabled:opacity-70"
                >
                  <span className="mb-4 inline-flex rounded-lg bg-sky-100 px-3 py-1.5 text-sm font-semibold text-[#3766a3]">General</span>
                  <span className="block text-lg font-semibold text-slate-900">Prepare lesson plan</span>
                  <span className="mt-2 block text-sm leading-relaxed text-slate-600">
                    {lessonPlanPreparing
                      ? 'Preparing general lesson plan…'
                      : 'Create a detailed, platform-neutral lesson plan from the selected evidence.'}
                  </span>
                </button>
              </div>
            </div>
          ) : null}

          {resolvedStepId === 'choose_output' &&
          !showPromptPreview &&
          showChalkiePackaging ? (
            <div className="space-y-8">
              <div className="max-w-3xl space-y-3">
                <h2
                  id={titleId}
                  className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.75rem]"
                >
                  How should Chalkie package this lesson?
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  Choose how Chalkie should package this already-reviewed lesson context.
                </p>
              </div>

              <section className="max-w-3xl space-y-3" aria-label="Lesson title">
                <h3 className="text-sm font-medium text-slate-800">Lesson title</h3>
                <p className="select-text text-sm leading-relaxed text-slate-800">
                  {activeLessonTitle}
                </p>
              </section>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
                <section className="space-y-4" aria-label="How should this Chalkie prompt be packaged?">
                  <h3 className="text-sm font-medium text-slate-800">How should this Chalkie prompt be packaged?</h3>
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
                            {lesson.twoLessonPackagingMode === 'sb_only'
                              ? 'Two lessons from this Student Book spread'
                              : 'Two-lesson series'}
                          </span>
                          <span className="block text-sm leading-relaxed text-slate-600">
                            {lesson.twoLessonPackagingMode === 'sb_only'
                              ? `Split the selected Student Book activities on ${lesson.visiblePageRangeLabel} into two short lessons.`
                              : 'Separate introduction and practice across Student Book and Workbook pages.'}
                          </span>
                          {effectiveLessonShape === 'series' &&
                            lesson.twoLessonPackagingMode === 'sb_wb' ? (
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
                          {effectiveLessonShape === 'series' &&
                            lesson.twoLessonPackagingMode === 'sb_only' &&
                            sbOnlyAllocation ? (
                            <span
                              id="lesson-shape-series-note"
                              className="mt-1 block space-y-0.5 text-sm leading-relaxed text-slate-500"
                            >
                              <span className="block">
                                Lesson 1 — Student Book {lesson.visiblePageRangeLabel} ·{' '}
                                {formatSbOnlyLessonActivityScope(sbOnlyAllocation.lesson1)}
                              </span>
                              <span className="block">
                                Lesson 2 — Student Book {lesson.visiblePageRangeLabel} ·{' '}
                                {formatSbOnlyLessonActivityScope(sbOnlyAllocation.lesson2)}
                              </span>
                              <span className="block pt-1">
                                Both lessons use only this Student Book spread. No Workbook
                                companion is implied.
                              </span>
                            </span>
                          ) : null}
                        </span>
                      </label>
                    ) : (
                      <p className="text-sm leading-relaxed text-slate-500">
                        A two-lesson packaging choice is not available for this source route yet.
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
                              <p className="text-xs leading-relaxed text-slate-500">
                                {formatTeacherAddedProvenanceLine()}
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

          {resolvedStepId === 'choose_output' && showPromptPreview ? (
            <div className="flex w-full flex-col gap-5">
              <div className="space-y-3">
                <h2
                  id={titleId}
                  className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.75rem]"
                >
                  {isLessonPlanPreview
                    ? 'Detailed general lesson plan'
                    : 'Chalkie prompt preview'}
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  {isLessonPlanPreview
                    ? 'This platform-neutral lesson plan uses the selected lesson, activities, and prior learning. It is assembled locally for classroom use.'
                    : isSeriesPreview
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

              {isLessonPlanPreview ? (
                <div className="mx-auto flex w-full max-w-4xl flex-col gap-2">
                  <h3 className="text-sm font-medium text-slate-800">
                    Copyable detailed lesson plan
                  </h3>
                  <HandoffCopyableBox
                    id="chalkie-detailed-lesson-plan"
                    value={lessonPlanPreview}
                    rows={24}
                    copyLabel="Copy lesson plan"
                    copyStatus={copyStatus}
                    onCopy={handleCopyPrompt}
                    textareaClassName="min-h-[20rem] font-mono text-xs leading-relaxed sm:text-[13px]"
                  />
                  {copyStatus === 'failed' ? (
                    <p className="text-sm text-slate-500">
                      Copying was unavailable. Select the lesson plan text and copy it manually.
                    </p>
                  ) : null}
                </div>
              ) : isBe3SeriesPreview && be3SeriesHandoff ? (
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
              ) : isSbOnlySeriesPreview && sbOnlyHandoff ? (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
                  <div className="flex min-w-0 flex-col gap-2 lg:col-span-7">
                    <h3 className="text-sm font-medium text-slate-800">
                      Detailed two-lesson Student Book handoff
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
                    <h3 className="text-sm font-medium text-slate-800">
                      Two-lesson Student Book scopes
                    </h3>
                    <div className="flex min-w-0 flex-col gap-4">
                      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                        <h4 className="text-sm font-medium text-slate-900">
                          Lesson 1 — Student Book {sbOnlyHandoff.pageRangeLabel}
                        </h4>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                          {sbOnlyHandoff.lesson1ActivityScope}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          Source: Student Book {sbOnlyHandoff.pageRangeLabel} only
                        </p>
                      </section>
                      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                        <h4 className="text-sm font-medium text-slate-900">
                          Lesson 2 — Student Book {sbOnlyHandoff.pageRangeLabel}
                        </h4>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                          {sbOnlyHandoff.lesson2ActivityScope}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          Source: Student Book {sbOnlyHandoff.pageRangeLabel} only · no Workbook
                          companion
                        </p>
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
              {(resolvedStepId === 'prior_skills' ||
                resolvedStepId === 'neutral_review' ||
                resolvedStepId === 'choose_output') &&
              (selectedCount > 0 || teacherAddedCount > 0)
                ? footerSelectionSummary(selectedCount, teacherAddedCount)
                : null}
            </p>
            <div className="flex flex-wrap items-center justify-end gap-2">
              {resolvedStepId !== 'student_book' ||
              showPromptPreview ||
              showChalkiePackaging ? (
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
              {resolvedStepId !== 'choose_output' ? (
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
              ) : showChalkiePackaging ? (
                <button
                  ref={continueRef}
                  type="button"
                  onClick={handlePrepareChalkiePrompt}
                  disabled={chalkiePreparing}
                  className="rounded-md bg-[#3766a3] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2f578c] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {chalkiePreparing ? 'Preparing Chalkie prompt…' : 'Prepare Chalkie prompt'}
                </button>
              ) : null}
            </div>
          </div>
        </footer>
      </div>
    </div>,
    document.body,
  )
}