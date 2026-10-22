import {
  hasNoSelectedSbActivities,
  selectedSbActivityLanguage,
  selectedSbActivityVocabulary,
  type SbActivityCard,
  type SbActivityHandoffSelection,
  type SelectedSbActivityEvidence,
} from './chalkieActivitySelection'
import {
  hasNoSelectedWbActivities,
  selectedWbActivityLanguage,
  selectedWbActivityVocabulary,
  type SelectedWbActivityEvidence,
  type WbActivityCard,
  type WbActivityHandoffSelection,
} from './chalkieWorkbookActivitySelection'
import type { VerifiedSbWbCompanion } from './resolveVerifiedSbWbCompanion'
import {
  BE3_U08_SB128_129_WB104_105,
  BE3_U08_SB130_131_WB106,
  type CuratedVerifiedSbWbCompanion,
} from './verifiedSbWbCompanions'

export type NeutralLessonId = 'lesson1' | 'lesson2'

export type NeutralPriorSupportProvenance =
  | '[PRIOR]'
  | '[HM]'
  | '[TEACHER-ADDED · UNVERIFIED]'

export type NeutralPriorSupportInput = {
  readonly id: string
  readonly provenance: NeutralPriorSupportProvenance
  readonly label: string
  readonly frame: string
  readonly sourceReference: string | null
  readonly evidenceReference: string | null
  readonly purpose: string | null
  readonly targetLessons: readonly NeutralLessonId[]
}

export type NeutralPriorSupportRecord = NeutralPriorSupportInput

export type NeutralSourceScope = {
  readonly source: 'SB' | 'WB'
  readonly catalogBookId: string
  readonly pageIds: readonly string[]
  readonly printedPages: readonly number[]
}

export type NeutralActivityEvidenceItem = {
  readonly itemNumber: string | null
  readonly prompt: string | null
  readonly expectedAnswer: string | null
}

export type NeutralActivityReference = {
  readonly activityId: string
  readonly bookId: string | null
  readonly unitId: string | null
  readonly pageId: string
  readonly verificationStatus: 'human_verified'
}

export type NeutralSelectedActivityEvidence = {
  readonly cardId: string
  readonly source: 'SB' | 'WB'
  readonly pageId: string
  readonly printedPage: number
  readonly activityNumber: string | null
  readonly verifiedWording: string
  readonly activityType: string | null
  readonly prompt: string | null
  readonly expectedAnswer: string | null
  readonly languageFrame: string | null
  readonly items: readonly NeutralActivityEvidenceItem[]
  readonly references: readonly NeutralActivityReference[]
}

export type NeutralAudioReference = {
  readonly cardId: string
  readonly source: 'SB' | 'WB'
  readonly pageId: string
  readonly printedPage: number
  readonly sourceDependencyNote: string | null
}

export type NeutralSelectionState = {
  readonly status: 'all_selected' | 'partial_selection' | 'zero_selected'
  readonly eligibleActivityCount: number
  readonly selectedActivityCount: number
  readonly hasExcludedActivities: boolean
  readonly fullySelectedPrintedPages: readonly number[]
  readonly partiallySelectedPrintedPages: readonly number[]
  readonly zeroSelectedPrintedPages: readonly number[]
}

export type NeutralLessonPackageLesson = {
  readonly id: NeutralLessonId
  readonly role: 'student_book' | 'workbook'
  readonly purpose: string
  readonly scope: NeutralSourceScope
  readonly selectedActivities: readonly NeutralSelectedActivityEvidence[]
  readonly vocabulary: readonly string[]
  readonly languageModels: readonly string[]
  readonly audioReferences: readonly NeutralAudioReference[]
  readonly selection: NeutralSelectionState
  readonly emptySelectionMessage: string | null
}

export type NeutralExcludedScope = {
  readonly source: 'SB' | 'WB'
  readonly printedPages: readonly number[]
  readonly reason: string
}

export type NeutralPackageBoundaries = {
  readonly exactSourceScopeRequired: true
  readonly reconstructExcludedActivities: false
  readonly priorSupportMayReplaceCurrentEvidence: false
  readonly inferAdjacentWorkbookPages: false
  readonly inventSourceContent: false
  readonly excludedScopes: readonly NeutralExcludedScope[]
  readonly notes: readonly string[]
}

export type NeutralSbWbLessonPackage = {
  readonly identity: {
    readonly packageReference:
      | 'be3-sb-wb-u08-p128-129-wb104-105'
      | 'be3-sb-wb-u08-p130-131-wb106'
    readonly relationshipId: string
    readonly relationshipType: 'workbook_practice_for'
    readonly verificationStatus: 'human_verified'
    readonly studentBookCatalogId: string
    readonly workbookCatalogId: string
    readonly unitNumber: number
    readonly unitTitle: string
    readonly componentKey: 'opener' | 'story'
    readonly componentTitle: string
  }
  readonly packaging: {
    readonly type: 'two_lesson_sb_wb'
    readonly lessonOrder: readonly ['lesson1', 'lesson2']
  }
  readonly lesson1: NeutralLessonPackageLesson
  readonly lesson2: NeutralLessonPackageLesson
  readonly priorSupport: readonly NeutralPriorSupportRecord[]
  readonly boundaries: NeutralPackageBoundaries
}

type SupportedPackageConfig = {
  readonly companion: CuratedVerifiedSbWbCompanion
  readonly packageReference: NeutralSbWbLessonPackage['identity']['packageReference']
  readonly componentKey: NeutralSbWbLessonPackage['identity']['componentKey']
  readonly componentTitle: string
  readonly lesson1Purpose: string
  readonly lesson2Purpose: string
  readonly excludedScopes: readonly NeutralExcludedScope[]
  readonly boundaryNotes: readonly string[]
}

const OPENER_CONFIG: SupportedPackageConfig = {
  companion: BE3_U08_SB128_129_WB104_105,
  packageReference: 'be3-sb-wb-u08-p128-129-wb104-105',
  componentKey: 'opener',
  componentTitle: 'Healthy and unhealthy activities',
  lesson1Purpose:
    'Introduce and practise healthy and unhealthy activity phrases through the vocabulary spread, song context, and short-answer work.',
  lesson2Purpose:
    'Consolidate the opener strand through past and contrast writing, personal responses, and verified song-linked practice.',
  excludedScopes: [
    {
      source: 'SB',
      printedPages: [130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143],
      reason: 'Later Unit 8 components are outside this package.',
    },
    {
      source: 'WB',
      printedPages: [106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117],
      reason: 'Workbook components after the opener are outside this package.',
    },
  ],
  boundaryNotes: [
    'Lesson 2 is consolidation and practice of the verified opener relationship, not a duplicate presentation of Lesson 1.',
    'Official audio may be referenced only by selected activities that carry an audio dependency.',
  ],
}

const STORY_CONFIG: SupportedPackageConfig = {
  companion: BE3_U08_SB130_131_WB106,
  packageReference: 'be3-sb-wb-u08-p130-131-wb106',
  componentKey: 'story',
  componentTitle: 'An Unhealthy Dinner',
  lesson1Purpose:
    'Support the verified Story and Reading activities, including listening or reading and source-grounded comprehension.',
  lesson2Purpose:
    'Consolidate the Story strand through verified short-answer, personal reflection, and healthy or unhealthy categorisation activities.',
  excludedScopes: [
    {
      source: 'WB',
      printedPages: [107],
      reason: 'Workbook p.107 is Language in Action and is not part of the verified Story companion.',
    },
  ],
  boundaryNotes: [
    'Workbook scope is p.106 only; no adjacent Workbook activity may enter this package.',
    'SB opener material from pp.128–129 may appear only as explicitly selected prior support, never as current Story evidence.',
  ],
}

const SUPPORTED_CONFIGS = new Map<string, SupportedPackageConfig>([
  [OPENER_CONFIG.companion.relationshipId, OPENER_CONFIG],
  [STORY_CONFIG.companion.relationshipId, STORY_CONFIG],
])

function arraysEqual<T>(left: readonly T[], right: readonly T[]): boolean {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  )
}

function requireSupportedConfig(
  companion: VerifiedSbWbCompanion,
): SupportedPackageConfig {
  const config = SUPPORTED_CONFIGS.get(companion.relationshipId)
  if (!config) {
    throw new Error(
      `Neutral SB→WB lesson packages are not enabled for relationship ${companion.relationshipId}.`,
    )
  }

  const expected = config.companion
  const hasExactScope =
    companion.source === 'curated_verified' &&
    companion.relationshipType === expected.relationshipType &&
    companion.studentBookCatalogId === expected.studentBookCatalogId &&
    companion.workbookCatalogId === expected.workbookCatalogId &&
    arraysEqual(
      companion.studentBookPrintedPages,
      expected.studentBookPrintedPages,
    ) &&
    arraysEqual(companion.workbookPrintedPages, expected.workbookPrintedPages) &&
    arraysEqual(companion.studentBookPageIds ?? [], expected.studentBookPageIds) &&
    arraysEqual(companion.workbookPageIds ?? [], expected.workbookPageIds)

  if (!hasExactScope) {
    throw new Error(
      `Verified scope does not match accepted relationship ${companion.relationshipId}.`,
    )
  }
  return config
}

function normalizeSbSelection(
  selection: SbActivityHandoffSelection,
  scope: NeutralSourceScope,
): SbActivityHandoffSelection {
  const cards = selection.allCards.filter(
    (card) =>
      card.source === 'SB' &&
      scope.pageIds.includes(card.pageId) &&
      scope.printedPages.includes(card.printedPage),
  )
  const selectedIds = new Set(
    selection.selectedEvidence.map((evidence) => evidence.cardId),
  )
  return {
    allCards: cards,
    selectedEvidence: cards
      .filter((card) => selectedIds.has(card.id))
      .map((card) => card.evidence),
  }
}

function normalizeWbSelection(
  selection: WbActivityHandoffSelection,
  scope: NeutralSourceScope,
): WbActivityHandoffSelection {
  const cards = selection.allCards.filter(
    (card) =>
      card.source === 'WB' &&
      scope.pageIds.includes(card.pageId) &&
      scope.printedPages.includes(card.printedPage),
  )
  const selectedIds = new Set(
    selection.selectedEvidence.map((evidence) => evidence.cardId),
  )
  return {
    allCards: cards,
    selectedEvidence: cards
      .filter((card) => selectedIds.has(card.id))
      .map((card) => card.evidence),
  }
}

function activityReferences(
  evidence: SelectedSbActivityEvidence | SelectedWbActivityEvidence,
): readonly NeutralActivityReference[] {
  return evidence.source === 'SB'
    ? [{ ...evidence.references }]
    : evidence.references.map((reference) => ({ ...reference }))
}

function selectedActivities(
  evidence: readonly (
    | SelectedSbActivityEvidence
    | SelectedWbActivityEvidence
  )[],
): NeutralSelectedActivityEvidence[] {
  return evidence.map((activity) => ({
    cardId: activity.cardId,
    source: activity.source,
    pageId: activity.pageId,
    printedPage: activity.printedPage,
    activityNumber: activity.activityNumber,
    verifiedWording: activity.verifiedWording,
    activityType: activity.activityType,
    prompt: activity.prompt,
    expectedAnswer: activity.expectedAnswer,
    languageFrame: activity.languageFrame,
    items: activity.items.map((item) => ({ ...item })),
    references: activityReferences(activity),
  }))
}

function audioReferences(
  evidence: readonly (
    | SelectedSbActivityEvidence
    | SelectedWbActivityEvidence
  )[],
): NeutralAudioReference[] {
  return evidence
    .filter((activity) => activity.audioDependency)
    .map((activity) => ({
      cardId: activity.cardId,
      source: activity.source,
      pageId: activity.pageId,
      printedPage: activity.printedPage,
      sourceDependencyNote: activity.sourceDependencyNote,
    }))
}

function pageSelectionState(
  cards: readonly (SbActivityCard | WbActivityCard)[],
  selectedCardIds: ReadonlySet<string>,
  printedPages: readonly number[],
): Pick<
  NeutralSelectionState,
  | 'fullySelectedPrintedPages'
  | 'partiallySelectedPrintedPages'
  | 'zeroSelectedPrintedPages'
> {
  const fullySelectedPrintedPages: number[] = []
  const partiallySelectedPrintedPages: number[] = []
  const zeroSelectedPrintedPages: number[] = []

  for (const printedPage of printedPages) {
    const pageCards = cards.filter((card) => card.printedPage === printedPage)
    const selectedCount = pageCards.filter((card) =>
      selectedCardIds.has(card.id),
    ).length
    if (pageCards.length > 0 && selectedCount === pageCards.length) {
      fullySelectedPrintedPages.push(printedPage)
    } else if (selectedCount > 0) {
      partiallySelectedPrintedPages.push(printedPage)
    } else {
      zeroSelectedPrintedPages.push(printedPage)
    }
  }

  return {
    fullySelectedPrintedPages,
    partiallySelectedPrintedPages,
    zeroSelectedPrintedPages,
  }
}

function selectionState(
  cards: readonly (SbActivityCard | WbActivityCard)[],
  evidence: readonly (
    | SelectedSbActivityEvidence
    | SelectedWbActivityEvidence
  )[],
  printedPages: readonly number[],
): NeutralSelectionState {
  const selectedCardIds = new Set(evidence.map((activity) => activity.cardId))
  const selectedActivityCount = selectedCardIds.size
  const eligibleActivityCount = cards.length
  const hasExcludedActivities = selectedActivityCount < eligibleActivityCount
  return {
    status:
      selectedActivityCount === 0
        ? 'zero_selected'
        : hasExcludedActivities
          ? 'partial_selection'
          : 'all_selected',
    eligibleActivityCount,
    selectedActivityCount,
    hasExcludedActivities,
    ...pageSelectionState(cards, selectedCardIds, printedPages),
  }
}

function normalizePriorSupport(
  records: readonly NeutralPriorSupportInput[],
): NeutralPriorSupportRecord[] {
  const seenIds = new Set<string>()
  return records.map((record) => {
    const id = record.id.trim()
    const label = record.label.trim()
    const frame = record.frame.trim()
    const targetLessons = [...new Set(record.targetLessons)]
    if (
      !id ||
      seenIds.has(id) ||
      !label ||
      !frame ||
      targetLessons.length === 0
    ) {
      throw new Error(
        'Prior support requires a unique ID, label, frame, and at least one explicit lesson target.',
      )
    }
    if (
      record.provenance !== '[TEACHER-ADDED · UNVERIFIED]' &&
      (!record.sourceReference?.trim() || !record.evidenceReference?.trim())
    ) {
      throw new Error(
        `${record.provenance} support requires source and evidence references.`,
      )
    }
    seenIds.add(id)
    return {
      id,
      provenance: record.provenance,
      label,
      frame,
      sourceReference: record.sourceReference?.trim() || null,
      evidenceReference: record.evidenceReference?.trim() || null,
      purpose: record.purpose?.trim() || null,
      targetLessons,
    }
  })
}

export function buildNeutralSbWbLessonPackage(input: {
  readonly companion: VerifiedSbWbCompanion
  readonly sbSelection: SbActivityHandoffSelection
  readonly wbSelection: WbActivityHandoffSelection
  readonly priorSupport?: readonly NeutralPriorSupportInput[]
}): NeutralSbWbLessonPackage {
  const config = requireSupportedConfig(input.companion)
  const accepted = config.companion
  const sbScope: NeutralSourceScope = {
    source: 'SB',
    catalogBookId: accepted.studentBookCatalogId,
    pageIds: [...accepted.studentBookPageIds],
    printedPages: [...accepted.studentBookPrintedPages],
  }
  const wbScope: NeutralSourceScope = {
    source: 'WB',
    catalogBookId: accepted.workbookCatalogId,
    pageIds: [...accepted.workbookPageIds],
    printedPages: [...accepted.workbookPrintedPages],
  }
  const sbSelection = normalizeSbSelection(input.sbSelection, sbScope)
  const wbSelection = normalizeWbSelection(input.wbSelection, wbScope)
  const sbActivities = selectedActivities(sbSelection.selectedEvidence)
  const wbActivities = selectedActivities(wbSelection.selectedEvidence)

  return {
    identity: {
      packageReference: config.packageReference,
      relationshipId: accepted.relationshipId,
      relationshipType: accepted.relationshipType,
      verificationStatus: accepted.verificationStatus,
      studentBookCatalogId: accepted.studentBookCatalogId,
      workbookCatalogId: accepted.workbookCatalogId,
      unitNumber: accepted.unitNumber,
      unitTitle: accepted.unitTitle,
      componentKey: config.componentKey,
      componentTitle: config.componentTitle,
    },
    packaging: {
      type: 'two_lesson_sb_wb',
      lessonOrder: ['lesson1', 'lesson2'],
    },
    lesson1: {
      id: 'lesson1',
      role: 'student_book',
      purpose: config.lesson1Purpose,
      scope: sbScope,
      selectedActivities: sbActivities,
      vocabulary: selectedSbActivityVocabulary(sbSelection),
      languageModels: selectedSbActivityLanguage(sbSelection),
      audioReferences: audioReferences(sbSelection.selectedEvidence),
      selection: selectionState(
        sbSelection.allCards,
        sbSelection.selectedEvidence,
        sbScope.printedPages,
      ),
      emptySelectionMessage: hasNoSelectedSbActivities(sbSelection)
        ? 'No Student Book activities selected; do not reconstruct or substitute current-source content.'
        : null,
    },
    lesson2: {
      id: 'lesson2',
      role: 'workbook',
      purpose: config.lesson2Purpose,
      scope: wbScope,
      selectedActivities: wbActivities,
      vocabulary: selectedWbActivityVocabulary(wbSelection),
      languageModels: selectedWbActivityLanguage(wbSelection),
      audioReferences: audioReferences(wbSelection.selectedEvidence),
      selection: selectionState(
        wbSelection.allCards,
        wbSelection.selectedEvidence,
        wbScope.printedPages,
      ),
      emptySelectionMessage: hasNoSelectedWbActivities(wbSelection)
        ? 'No Workbook activities selected; keep Lesson 2 empty without reconstruction, substitution, or adjacent-page content.'
        : null,
    },
    priorSupport: normalizePriorSupport(input.priorSupport ?? []),
    boundaries: {
      exactSourceScopeRequired: true,
      reconstructExcludedActivities: false,
      priorSupportMayReplaceCurrentEvidence: false,
      inferAdjacentWorkbookPages: false,
      inventSourceContent: false,
      excludedScopes: config.excludedScopes.map((scope) => ({
        ...scope,
        printedPages: [...scope.printedPages],
      })),
      notes: [...config.boundaryNotes],
    },
  }
}
