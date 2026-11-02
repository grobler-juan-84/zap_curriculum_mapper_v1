/**
 * NLL/NLP Inspector report builder (D029) — audit hardening.
 * Run: npm --prefix app run test:inspector
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { buildNeutralSbWbLessonPackage } from '../../app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts'
import {
  buildInspectionOverview,
  buildNllNlpInspectionReport,
  buildTeacherSelectionRows,
  collectInspectionIssues,
  shouldShowNllNlpInspectorCard,
} from '../../app/src/features/chalkie/nllNlpInspector.ts'
import {
  buildSbActivityCards,
  createDefaultSbActivitySelection,
  createSbActivityHandoffSelection,
  setSbActivityCardSelected,
} from '../../app/src/features/chalkie/chalkieActivitySelection.ts'
import {
  buildWbActivityCards,
  createDefaultWbActivitySelection,
  createWbActivityHandoffSelection,
  setWbActivityCardSelected,
} from '../../app/src/features/chalkie/chalkieWorkbookActivitySelection.ts'
import type { ChalkieLessonContext } from '../../app/src/features/chalkie/resolveChalkieLessonContext.ts'
import { resolveVerifiedSbWbCompanion } from '../../app/src/features/chalkie/resolveVerifiedSbWbCompanion.ts'
import type { VerifiedSbWbCompanion } from '../../app/src/features/chalkie/resolveVerifiedSbWbCompanion.ts'
import { BE3_U08_SB136_137_WB111_112 } from '../../app/src/features/chalkie/verifiedSbWbCompanions.ts'
import { buildCurrentActivitySha256ById } from '../../app/src/features/nll/buildCurrentActivitySha256ById.ts'
import {
  assembleNeutralLessonComponent,
  fingerprintCanonicalActivity,
  type NllActivitySummaryRow,
  type ResolvedNllComponent,
} from '../../app/src/features/nll/neutralLessonLibrary.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const BE3_SB_PATH = path.join(
  ROOT,
  'data/phase1/big_english_3_sb/canonical/v1.json',
)
const BE3_WB_PATH = path.join(
  ROOT,
  'data/phase1/big_english_3_wb/canonical/v1.json',
)

function loadJson(filePath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function summaryFromCanonical(
  raw: Record<string, unknown>,
  catalogBookId: string,
): BatchJsonSummary {
  const unit = asArray(raw.units).find((entry) => {
    const row = asRecord(entry)
    return row.unit_number === 8 || row.unit_number === '8'
  })
  const unitRecord = asRecord(unit)
  return {
    catalogBookId,
    units: [
      {
        unitNumber: 8,
        title:
          typeof unitRecord.title === 'string'
            ? unitRecord.title
            : 'Healthy Living',
        printedPageStart:
          typeof unitRecord.printed_page_start === 'number'
            ? unitRecord.printed_page_start
            : 128,
        printedPageEnd:
          typeof unitRecord.printed_page_end === 'number'
            ? unitRecord.printed_page_end
            : 143,
      },
    ],
    vocabulary: [],
    language: [],
    activities: [],
    pages: [],
    raw,
  }
}

const sbCanonical = loadJson(BE3_SB_PATH)
const wbCanonical = loadJson(BE3_WB_PATH)
const sbSummary = summaryFromCanonical(sbCanonical, 'big_english_3_sb')
const wbSummary = summaryFromCanonical(wbCanonical, 'big_english_3_wb')

function baseLesson(
  overrides: Partial<ChalkieLessonContext> = {},
): ChalkieLessonContext {
  return {
    status: 'ready',
    catalogBookId: 'big_english_3_sb',
    bookLabel: 'Big English 3 Student Book',
    unitNumber: 8,
    unitTitle: 'Healthy Living',
    unitLine: 'Big English 3 Student Book Unit 8',
    visiblePrintedPages: [128, 129],
    visiblePageRangeLabel: '128–129',
    unitPrintedPageStart: 128,
    unitPrintedPageEnd: 143,
    unitPageRangeLabel: '128–143',
    currentFocus: 'Opener',
    lessonTopic: 'Healthy and unhealthy activities',
    teachingFocus: null,
    vocabulary: [],
    hasDedicatedVocabulary: false,
    hasActivityDerivedModels: false,
    languageExamples: [],
    hasDedicatedLanguage: false,
    hasActivityLanguageFrames: false,
    clarification: null,
    activityLines: [],
    outlineActivities: [],
    pageLabels: [],
    isBe2U08PrototypeRoute: false,
    twoLessonPackagingMode: 'sb_wb',
    supportsTwoLessonSeries: true,
    workbookCompanion: null,
    sameUnitPriorLearningCandidates: [],
    curatedHorizontalMappingCandidates: [],
    priorLearningSuggestions: [],
    singleLessonTitle: 'Healthy and unhealthy activities',
    seriesLessonTitle: null,
    stableLessonReference: 'be3-sb-u08-p128-129',
    stableSeriesReference: null,
    ...overrides,
  }
}

function mockSummary(
  activityId: string,
  overrides: {
    review_state?: 'experimental' | 'reviewed' | 'teacher_corrected'
    evidence_status?: 'sufficient' | 'insufficient'
    display_status?: 'hidden' | 'available'
    staleness?: 'current' | 'potentially_stale' | 'unverifiable'
    currentActivitySha256?: string | null
  } = {},
): NonNullable<ResolvedNllComponent['activities'][number]['preferredSummary']> {
  return {
    id: `sum-${activityId}`,
    activity_id: activityId,
    version: 1,
    summary_text: `Summary for ${activityId}`,
    canonical_path: 'mock',
    canonical_sha256: 'a'.repeat(64),
    activity_sha256: 'b'.repeat(64),
    evidence_status: overrides.evidence_status ?? 'sufficient',
    display_status: overrides.display_status ?? 'hidden',
    review_state: overrides.review_state ?? 'experimental',
    is_preferred: true,
    provenance: {},
    created_at: '2026-11-01T00:00:00.000Z',
    staleness: overrides.staleness ?? 'unverifiable',
    currentActivitySha256:
      overrides.currentActivitySha256 === undefined
        ? null
        : overrides.currentActivitySha256,
  }
}

function mockNllForIds(
  componentKey: string,
  activityIds: readonly string[],
  summaryOverrides: Parameters<typeof mockSummary>[1] = {},
): ResolvedNllComponent {
  return {
    component: {
      id: `nll-${componentKey}`,
      component_key: componentKey,
      title: componentKey,
      status: 'draft',
      created_at: '2026-11-01T00:00:00.000Z',
    },
    activities: activityIds.map((activityId, index) => ({
      activityId,
      position: index + 1,
      preferredSummary: mockSummary(activityId, summaryOverrides),
    })),
    curriculumAuthorityLinks: [],
    proposedSsLinks: [],
  }
}

test('shouldShowNllNlpInspectorCard is admin-only', () => {
  assert.equal(shouldShowNllNlpInspectorCard('admin'), true)
  assert.equal(shouldShowNllNlpInspectorCard('teacher'), false)
  assert.equal(shouldShowNllNlpInspectorCard(null), false)
})

test('human_verified + experimental is not classified as source-unverified', () => {
  const issues = collectInspectionIssues({
    teacherSelections: [
      {
        activityId: 'act-1',
        cardId: 'card-1',
        source: 'SB',
        title: 'Activity 1',
        printedPage: 141,
        availableInNll: true,
        selectedByTeacher: true,
        excludedByTeacher: false,
        includedInNlp: true,
        sourceVerificationStatus: 'human_verified',
        nllSummaryId: 'sum-1',
        nllReviewState: 'experimental',
        nllEvidenceStatus: 'sufficient',
        nllDisplayStatus: 'hidden',
        nllStaleness: 'unverifiable',
        nllCurrentActivitySha256: null,
        nllStoredActivitySha256: 'b'.repeat(64),
      },
    ],
    nllStatus: 'loaded',
    nlpStatus: 'assembled',
    scopeSequenceStatus: 'unit_level',
    nll: null,
  })

  assert.ok(issues.some((issue) => issue.kind === 'experimental'))
  assert.ok(issues.some((issue) => issue.kind === 'staleness_unverifiable'))
  assert.equal(
    issues.filter((issue) => issue.kind === 'unverified').length,
    0,
  )
})

test('insufficient evidence and excluded are independent of missing', () => {
  const issues = collectInspectionIssues({
    teacherSelections: [
      {
        activityId: 'act-game',
        cardId: 'card-game',
        source: 'SB',
        title: 'Play a game',
        printedPage: 128,
        availableInNll: true,
        selectedByTeacher: false,
        excludedByTeacher: true,
        includedInNlp: false,
        sourceVerificationStatus: 'human_verified',
        nllSummaryId: 'sum-game',
        nllReviewState: 'reviewed',
        nllEvidenceStatus: 'insufficient',
        nllDisplayStatus: 'hidden',
        nllStaleness: 'current',
        nllCurrentActivitySha256: 'b'.repeat(64),
        nllStoredActivitySha256: 'b'.repeat(64),
      },
    ],
    nllStatus: 'loaded',
    nlpStatus: 'assembled',
    scopeSequenceStatus: 'unit_level',
    nll: null,
  })

  assert.ok(issues.some((issue) => issue.kind === 'excluded'))
  assert.ok(issues.some((issue) => issue.kind === 'insufficient_evidence'))
  assert.equal(issues.filter((issue) => issue.kind === 'missing').length, 0)
})

test('unavailable NLP is not classified as missing curriculum content', () => {
  const issues = collectInspectionIssues({
    teacherSelections: [],
    nllStatus: 'loaded',
    nlpStatus: 'unavailable',
    scopeSequenceStatus: 'unit_level',
    nll: null,
  })
  assert.ok(issues.some((issue) => issue.kind === 'unavailable'))
  assert.equal(issues.filter((issue) => issue.kind === 'missing').length, 0)
})

test('companion-free Values-like report stays partial without mutating selections', async () => {
  const pages = [142]
  const sbCards = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: pages,
  })
  assert.ok(sbCards.length > 0)
  const selectionState = createDefaultSbActivitySelection(sbCards)
  const sbSelection = createSbActivityHandoffSelection(sbCards, selectionState)
  const selectedBefore = sbSelection.selectedEvidence.map((row) => row.cardId)
  const activityIds = sbCards.map((card) => card.references.activityId)
  const mockNll = mockNllForIds('be3-u08-values', activityIds)

  const report = await buildNllNlpInspectionReport({
    lesson: baseLesson({
      visiblePrintedPages: pages,
      visiblePageRangeLabel: '142',
      twoLessonPackagingMode: 'sb_only',
      supportsTwoLessonSeries: true,
      workbookCompanion: null,
      singleLessonTitle: 'Values',
      currentFocus: 'Values',
      stableLessonReference: 'be3-sb-u08-p142',
    }),
    activityCards: sbCards,
    workbookActivityCards: [],
    sbSelection,
    wbSelection: createWbActivityHandoffSelection(
      [],
      createDefaultWbActivitySelection([]),
    ),
    selectedSuggestions: [],
    teacherAdditions: [],
    client: {} as never,
    nowIso: '2026-11-01T00:00:00.000Z',
    loadNll: async () => mockNll,
  })

  assert.equal(report.nlp.status, 'assembled')
  assert.equal(report.nll.status, 'loaded')
  assert.equal(report.adapterOrConsumerInclusion, 'not_in_scope')
  assert.equal(report.lessonIdentity.twoLessonPackagingConfiguration, 'sb_only')
  assert.equal(report.lessonIdentity.assembledPackageType, 'two_lesson_sb_only')
  assert.equal(report.nlp.package?.packaging.type, 'two_lesson_sb_only')
  assert.equal(report.nlp.package?.lesson1.role, 'student_book')
  assert.equal(report.nlp.package?.lesson2.role, 'student_book')
  assert.equal(report.nlp.package?.lesson1.scope.source, 'SB')
  assert.equal(report.nlp.package?.lesson2.scope.source, 'SB')
  assert.ok(report.markdown.includes('## Overview'))
  assert.ok(report.markdown.includes('Source/configuration mode'))
  assert.ok(
    !report.markdown.includes(
      'provenance terminates at teacher selection',
    ),
  )
  assert.ok(
    report.markdown.includes(
      'Excluded means currently unselected',
    ),
  )
  assert.ok(
    report.markdown.includes(
      'authoritative current activity hash was not supplied',
    ),
  )
  assert.ok(
    report.teacherSelections.every(
      (row) => row.selectedByTeacher === true && row.includedInNlp === true,
    ),
  )
  assert.ok(
    !report.issues.some(
      (issue) =>
        issue.kind === 'unverified' && issue.message.includes('experimental'),
    ),
  )
  assert.ok(report.issues.some((issue) => issue.kind === 'experimental'))
  assert.deepEqual(
    sbSelection.selectedEvidence.map((row) => row.cardId),
    selectedBefore,
  )
})

test('Grammar exclusion remains in NLL inventory and absent from NLP', async () => {
  const pages = [136, 137]
  const companion = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sbCanonical,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wbCanonical,
    studentBookPrintedPages: pages,
  }).companion
  assert.ok(companion)
  assert.equal(
    companion.relationshipId,
    'be3_sb_wb_rel_u08_grammar_sb136-137_wb111-112',
  )

  const sbCards = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: pages,
  })
  const wbCards = buildWbActivityCards({
    summary: wbSummary,
    companion,
  })
  assert.ok(wbCards.length > 0)

  let wbState = createDefaultWbActivitySelection(wbCards)
  const excludedWb = wbCards[wbCards.length - 1]
  assert.ok(excludedWb)
  wbState = setWbActivityCardSelected({
    cards: wbCards,
    state: wbState,
    cardId: excludedWb.id,
    selected: false,
  })

  const sbSelection = createSbActivityHandoffSelection(
    sbCards,
    createDefaultSbActivitySelection(sbCards),
  )
  const wbSelection = createWbActivityHandoffSelection(wbCards, wbState)
  const selectedBefore = [
    ...sbSelection.selectedEvidence.map((row) => row.cardId),
    ...wbSelection.selectedEvidence.map((row) => row.cardId),
  ]

  const allActivityIds = [
    ...sbCards.map((card) => card.references.activityId),
    ...wbCards
      .map((card) => card.references[0]?.activityId)
      .filter((id): id is string => Boolean(id)),
  ]
  assert.deepEqual(
    [...allActivityIds].sort(),
    [
      'bep3_sb_act_08_19',
      'bep3_sb_act_08_20',
      'bep3_sb_act_08_21',
      'bep3_sb_act_08_22',
      'bep3_sb_act_08_23',
      'bep_3_wb_act_111_15',
      'bep_3_wb_act_111_16',
      'bep_3_wb_act_111_17',
      'bep_3_wb_act_112_18',
      'bep_3_wb_act_112_19',
    ].sort(),
  )
  const mockNll = mockNllForIds('be3-u08-grammar', allActivityIds)

  const report = await buildNllNlpInspectionReport({
    lesson: baseLesson({
      visiblePrintedPages: pages,
      visiblePageRangeLabel: '136–137',
      workbookCompanion: companion,
      twoLessonPackagingMode: 'sb_only',
      currentFocus: 'Grammar',
      singleLessonTitle: 'Grammar',
    }),
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    sbSelection,
    wbSelection,
    selectedSuggestions: [],
    teacherAdditions: [],
    scopeSequenceUnit: {
      unitNumberRaw: '8',
      unitTitleRaw: 'Healthy Living',
      publisherCategories: [
        {
          categoryNameRaw: 'Structures',
          columnOrder: 1,
          rawText: 'unit-level structures',
        },
      ],
    } as never,
    client: {} as never,
    nowIso: '2026-11-02T00:00:00.000Z',
    loadNll: async () => mockNll,
  })

  assert.equal(report.nlp.status, 'assembled')
  assert.equal(report.nll.status, 'loaded')
  assert.equal(report.nll.componentKey, 'be3-u08-grammar')
  assert.equal(report.adapterOrConsumerInclusion, 'not_in_scope')
  assert.equal(report.scopeSequence.status, 'unit_level')
  assert.equal(
    report.lessonIdentity.companionRelationshipId,
    'be3_sb_wb_rel_u08_grammar_sb136-137_wb111-112',
  )
  assert.deepEqual(report.lessonIdentity.studentBookPages, [136, 137])
  assert.deepEqual(report.lessonIdentity.workbookPages, [111, 112])
  assert.equal(
    report.lessonIdentity.twoLessonPackagingConfiguration,
    'sb_only',
  )
  assert.equal(report.lessonIdentity.assembledPackageType, 'two_lesson_sb_wb')
  assert.equal(
    report.nlp.package?.identity.packageReference,
    'be3-sb-wb-u08-p136-137-wb111-112',
  )
  assert.equal(report.nlp.package?.identity.componentTitle, 'Grammar')
  assert.ok(report.markdown.includes('Assembled NLP package type: two_lesson_sb_wb'))
  assert.ok(
    !report.markdown.includes('provenance terminates at teacher selection'),
  )
  assert.ok(
    report.markdown.includes(
      'Excluded means currently unselected',
    ),
  )

  const excludedActivityId = excludedWb.references[0]?.activityId ?? ''
  assert.equal(excludedActivityId, 'bep_3_wb_act_112_19')
  const excludedRow = report.teacherSelections.find(
    (row) => row.cardId === excludedWb.id,
  )
  assert.ok(excludedRow)
  assert.equal(excludedRow.availableInNll, true)
  assert.equal(excludedRow.selectedByTeacher, false)
  assert.equal(excludedRow.excludedByTeacher, true)
  assert.equal(excludedRow.includedInNlp, false)

  const derivedIds = new Set(
    report.nlp.package?.derivedKnowledge?.activitySummaries.map(
      (summary) => summary.activityId,
    ) ?? [],
  )
  assert.equal(derivedIds.has(excludedActivityId), false)
  assert.equal(report.overview.nllActivitiesAvailable, 10)
  assert.equal(report.overview.teacherSelectedCount, 9)
  assert.equal(report.overview.teacherExcludedCount, 1)
  assert.equal(report.overview.includedInNlpCount, 9)
  assert.equal(report.overview.derivedSummariesInNlpCount, 9)

  assert.ok(
    report.issues.some(
      (issue) =>
        issue.kind === 'excluded' && issue.message.includes(excludedActivityId),
    ),
  )

  assert.deepEqual(
    [
      ...sbSelection.selectedEvidence.map((row) => row.cardId),
      ...wbSelection.selectedEvidence.map((row) => row.cardId),
    ],
    selectedBefore,
  )
})

test('Phonics exclusion remains in NLL inventory and absent from NLP', async () => {
  const pages = [141]
  const companion = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sbCanonical,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wbCanonical,
    studentBookPrintedPages: pages,
  }).companion
  assert.ok(companion)

  const sbCards = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: pages,
  })
  const wbCards = buildWbActivityCards({
    summary: wbSummary,
    companion,
  })
  assert.ok(wbCards.length > 0)

  let wbState = createDefaultWbActivitySelection(wbCards)
  const excludedWb = wbCards[wbCards.length - 1]
  assert.ok(excludedWb)
  wbState = setWbActivityCardSelected({
    cards: wbCards,
    state: wbState,
    cardId: excludedWb.id,
    selected: false,
  })

  const sbSelection = createSbActivityHandoffSelection(
    sbCards,
    createDefaultSbActivitySelection(sbCards),
  )
  const wbSelection = createWbActivityHandoffSelection(wbCards, wbState)
  const selectedBefore = [
    ...sbSelection.selectedEvidence.map((row) => row.cardId),
    ...wbSelection.selectedEvidence.map((row) => row.cardId),
  ]

  const allActivityIds = [
    ...sbCards.map((card) => card.references.activityId),
    ...wbCards
      .map((card) => card.references[0]?.activityId)
      .filter((id): id is string => Boolean(id)),
  ]
  const mockNll = mockNllForIds('be3-u08-phonics', allActivityIds)

  const report = await buildNllNlpInspectionReport({
    lesson: baseLesson({
      visiblePrintedPages: pages,
      visiblePageRangeLabel: '141',
      workbookCompanion: companion,
      twoLessonPackagingMode: 'sb_only',
      currentFocus: 'Phonics',
      singleLessonTitle: 'Phonics',
    }),
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    sbSelection,
    wbSelection,
    selectedSuggestions: [],
    teacherAdditions: [],
    scopeSequenceUnit: {
      unitNumberRaw: '8',
      unitTitleRaw: 'Healthy Living',
      publisherCategories: [
        {
          categoryNameRaw: 'Phonics',
          columnOrder: 1,
          rawText: 'unit-level phonics',
        },
      ],
    } as never,
    client: {} as never,
    nowIso: '2026-11-01T00:00:00.000Z',
    loadNll: async () => mockNll,
  })

  assert.equal(report.nlp.status, 'assembled')
  assert.equal(report.nll.status, 'loaded')
  assert.equal(report.scopeSequence.status, 'unit_level')
  assert.equal(
    report.lessonIdentity.twoLessonPackagingConfiguration,
    'sb_only',
  )
  assert.equal(report.lessonIdentity.assembledPackageType, 'two_lesson_sb_wb')
  assert.ok(report.markdown.includes('Assembled NLP package type: two_lesson_sb_wb'))

  const excludedActivityId = excludedWb.references[0]?.activityId ?? ''
  const excludedRow = report.teacherSelections.find(
    (row) => row.cardId === excludedWb.id,
  )
  assert.ok(excludedRow)
  assert.equal(excludedRow.availableInNll, true)
  assert.equal(excludedRow.selectedByTeacher, false)
  assert.equal(excludedRow.excludedByTeacher, true)
  assert.equal(excludedRow.includedInNlp, false)

  const derivedIds = new Set(
    report.nlp.package?.derivedKnowledge?.activitySummaries.map(
      (summary) => summary.activityId,
    ) ?? [],
  )
  assert.equal(derivedIds.has(excludedActivityId), false)

  assert.ok(
    report.issues.some(
      (issue) =>
        issue.kind === 'excluded' && issue.message.includes(excludedActivityId),
    ),
  )

  assert.deepEqual(
    [
      ...sbSelection.selectedEvidence.map((row) => row.cardId),
      ...wbSelection.selectedEvidence.map((row) => row.cardId),
    ],
    selectedBefore,
  )

  assert.equal(
    report.overview.teacherExcludedCount,
    report.teacherSelections.filter((row) => row.excludedByTeacher).length,
  )
  assert.equal(
    report.overview.includedInNlpCount,
    report.teacherSelections.filter((row) => row.includedInNlp).length,
  )
})

test('overview is derived from the same inspection model', () => {
  const overview = buildInspectionOverview({
    teacherSelections: [
      {
        activityId: 'a1',
        cardId: 'c1',
        source: 'SB',
        title: 'A1',
        printedPage: 1,
        availableInNll: true,
        selectedByTeacher: true,
        excludedByTeacher: false,
        includedInNlp: true,
        sourceVerificationStatus: 'human_verified',
        nllSummaryId: 's1',
        nllReviewState: 'experimental',
        nllEvidenceStatus: 'sufficient',
        nllDisplayStatus: 'hidden',
        nllStaleness: 'unverifiable',
        nllCurrentActivitySha256: null,
        nllStoredActivitySha256: null,
      },
      {
        activityId: 'a2',
        cardId: 'c2',
        source: 'WB',
        title: 'A2',
        printedPage: 2,
        availableInNll: true,
        selectedByTeacher: false,
        excludedByTeacher: true,
        includedInNlp: false,
        sourceVerificationStatus: 'human_verified',
        nllSummaryId: 's2',
        nllReviewState: 'experimental',
        nllEvidenceStatus: 'insufficient',
        nllDisplayStatus: 'hidden',
        nllStaleness: 'potentially_stale',
        nllCurrentActivitySha256: 'x',
        nllStoredActivitySha256: 'y',
      },
    ],
    nllStatus: 'loaded',
    nllActivityCount: 2,
    nlp: null,
    nlpStatus: 'unavailable',
    issues: [
      { kind: 'excluded', message: 'x' },
      { kind: 'experimental', message: 'y' },
    ],
  })

  assert.equal(overview.nllActivitiesAvailable, 2)
  assert.equal(overview.teacherSelectedCount, 1)
  assert.equal(overview.teacherExcludedCount, 1)
  assert.equal(overview.includedInNlpCount, 1)
  assert.equal(overview.experimentalOrReviewPendingCount, 2)
  assert.equal(overview.insufficientEvidenceCount, 1)
  assert.equal(overview.staleCount, 1)
  assert.equal(overview.stalenessUnverifiableCount, 1)
  assert.equal(overview.majorFindingsCount, 2)
  assert.equal(overview.priorSupportCandidateCount, 0)
})

test('buildTeacherSelectionRows keeps available/selected/excluded/included independent', () => {
  const pages = [128, 129]
  const companion = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sbCanonical,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wbCanonical,
    studentBookPrintedPages: pages,
  }).companion
  assert.ok(companion)
  const sbCards = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: pages,
  })
  const wbCards = buildWbActivityCards({ summary: wbSummary, companion })
  let sbState = createDefaultSbActivitySelection(sbCards)
  const first = sbCards[0]
  assert.ok(first)
  sbState = setSbActivityCardSelected({
    cards: sbCards,
    state: sbState,
    cardId: first.id,
    selected: false,
  })
  const sbSelection = createSbActivityHandoffSelection(sbCards, sbState)
  const wbSelection = createWbActivityHandoffSelection(
    wbCards,
    createDefaultWbActivitySelection(wbCards),
  )
  const nll = mockNllForIds('be3-u08-opener', [
    first.references.activityId,
    ...wbCards
      .map((card) => card.references[0]?.activityId)
      .filter((id): id is string => Boolean(id))
      .slice(0, 1),
  ])

  const nlp = buildNeutralSbWbLessonPackage({
    companion,
    sbSelection,
    wbSelection,
  })

  const rows = buildTeacherSelectionRows({
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    sbSelection,
    wbSelection,
    nll,
    nlp,
  })
  const firstRow = rows.find((row) => row.cardId === first.id)
  assert.ok(firstRow)
  assert.equal(firstRow.availableInNll, true)
  assert.equal(firstRow.selectedByTeacher, false)
  assert.equal(firstRow.excludedByTeacher, true)
  assert.equal(firstRow.includedInNlp, false)
})

const FIXTURES_DIR = path.join(ROOT, 'scripts/fixtures/nll-staleness')
const GRAMMAR_FIXTURE = loadJson(
  path.join(FIXTURES_DIR, 'be3-u08-grammar-activities.json'),
) as {
  readonly studentBookActivities: ReadonlyArray<Record<string, unknown>>
  readonly workbookActivities: ReadonlyArray<Record<string, unknown>>
  readonly expectedActivitySha256ById: Readonly<Record<string, string>>
  readonly expectedActivitySha256Source: string
}
const VALUES_FIXTURE = loadJson(
  path.join(FIXTURES_DIR, 'be3-u08-values-activities.json'),
) as {
  readonly studentBookActivities: ReadonlyArray<Record<string, unknown>>
  readonly expectedActivitySha256ById: Readonly<Record<string, string>>
  readonly expectedActivitySha256Source: string
}

/** Literal migration activity_sha256 pins — independent of runtime fingerprint output. */
const GRAMMAR_MIGRATION_ACTIVITY_SHA256 = GRAMMAR_FIXTURE.expectedActivitySha256ById
const VALUES_MIGRATION_ACTIVITY_SHA256 = VALUES_FIXTURE.expectedActivitySha256ById

function fixtureSummary(
  catalogBookId: string,
  activities: ReadonlyArray<Record<string, unknown>>,
  pages: ReadonlyArray<{ page_id: string; printed_page: number }>,
): BatchJsonSummary {
  return {
    catalogBookId,
    units: [
      {
        unitNumber: 8,
        title: 'Healthy Living',
        printedPageStart: 128,
        printedPageEnd: 143,
      },
    ],
    vocabulary: [],
    language: [],
    activities: [],
    pages: [],
    raw: {
      units: [
        {
          unit_number: 8,
          title: 'Healthy Living',
          printed_page_start: 128,
          printed_page_end: 143,
        },
      ],
      pages: pages.map((page) => ({
        ...page,
        unit_id: `${catalogBookId}_unit_08`,
        book_id: catalogBookId,
        verification_status: 'human_verified',
      })),
      activities,
      vocabulary: [],
      language: [],
    },
  }
}

function rawPreferredSummary(
  activityId: string,
  activitySha256: string,
): NllActivitySummaryRow {
  return {
    id: `sum-${activityId}`,
    activity_id: activityId,
    version: 1,
    summary_text: `Summary for ${activityId}`,
    canonical_path: 'fixture',
    canonical_sha256: 'a'.repeat(64),
    activity_sha256: activitySha256,
    evidence_status: 'sufficient',
    display_status: 'hidden',
    review_state: 'experimental',
    is_preferred: true,
    provenance: {},
    created_at: '2026-11-02T00:00:00.000Z',
  }
}

function loadNllViaAssemble(
  componentKey: string,
  activityIds: readonly string[],
  storedShaById: Readonly<Record<string, string>>,
) {
  return async (
    _client: unknown,
    key: string,
    options: {
      readonly includeHiddenExperimental: true
      readonly currentActivitySha256ById?: Readonly<Record<string, string>>
    },
  ) => {
    assert.equal(key, componentKey)
    return assembleNeutralLessonComponent({
      component: {
        id: `nll-${componentKey}`,
        component_key: componentKey,
        title: componentKey,
        status: 'draft',
        created_at: '2026-11-02T00:00:00.000Z',
      },
      memberships: activityIds.map((activityId, index) => ({
        component_id: `nll-${componentKey}`,
        activity_id: activityId,
        position: index + 1,
      })),
      summaries: activityIds.map((activityId) =>
        rawPreferredSummary(activityId, storedShaById[activityId] ?? '0'.repeat(64)),
      ),
      ssLinks: [],
      includeHiddenExperimental: options.includeHiddenExperimental,
      currentActivitySha256ById: options.currentActivitySha256ById,
    })
  }
}

test('tracked Grammar and Values fixtures match migration activity_sha256 pins 13/13', async () => {
  assert.equal(
    GRAMMAR_FIXTURE.expectedActivitySha256Source,
    'supabase/migrations/20261030160000_seed_nll_be3_u08_grammar.sql',
  )
  assert.equal(
    VALUES_FIXTURE.expectedActivitySha256Source,
    'supabase/migrations/20261030220000_seed_nll_be3_u08_values.sql',
  )
  assert.equal(Object.keys(GRAMMAR_MIGRATION_ACTIVITY_SHA256).length, 10)
  assert.equal(Object.keys(VALUES_MIGRATION_ACTIVITY_SHA256).length, 3)

  const grammarActivities = [
    ...GRAMMAR_FIXTURE.studentBookActivities,
    ...GRAMMAR_FIXTURE.workbookActivities,
  ]
  for (const activity of grammarActivities) {
    const activityId = String(activity.activity_id)
    const pinned = GRAMMAR_MIGRATION_ACTIVITY_SHA256[activityId]
    assert.ok(pinned, `missing Grammar migration pin for ${activityId}`)
    assert.equal(
      await fingerprintCanonicalActivity(activity),
      pinned,
      `Grammar fixture fingerprint must equal migration pin for ${activityId}`,
    )
  }
  for (const activity of VALUES_FIXTURE.studentBookActivities) {
    const activityId = String(activity.activity_id)
    const pinned = VALUES_MIGRATION_ACTIVITY_SHA256[activityId]
    assert.ok(pinned, `missing Values migration pin for ${activityId}`)
    assert.equal(
      await fingerprintCanonicalActivity(activity),
      pinned,
      `Values fixture fingerprint must equal migration pin for ${activityId}`,
    )
  }
})

test('buildCurrentActivitySha256ById fingerprints tracked fixtures and omits missing ids', async () => {
  const grammarRaw = {
    activities: [
      ...GRAMMAR_FIXTURE.studentBookActivities,
      ...GRAMMAR_FIXTURE.workbookActivities,
    ],
  }
  const ids = grammarRaw.activities.map((row) => String(row.activity_id))
  const map = await buildCurrentActivitySha256ById({
    canonicalRaws: [grammarRaw],
    activityIds: [...ids, 'missing_activity_id'],
  })
  assert.equal(Object.keys(map).length, 10)
  assert.equal(map.missing_activity_id, undefined)
  for (const activityId of ids) {
    assert.equal(map[activityId], GRAMMAR_MIGRATION_ACTIVITY_SHA256[activityId])
  }
})

test('Grammar Inspector authoritative hashes: current, potentially_stale, and unverifiable', async () => {
  const companion: VerifiedSbWbCompanion = {
    ...BE3_U08_SB136_137_WB111_112,
    source: 'curated_verified',
  }
  const sbSummary = fixtureSummary('big_english_3_sb', GRAMMAR_FIXTURE.studentBookActivities, [
    { page_id: 'bep3_sb_p136', printed_page: 136 },
    { page_id: 'bep3_sb_p137', printed_page: 137 },
  ])
  const wbSummary = fixtureSummary('big_english_3_wb', GRAMMAR_FIXTURE.workbookActivities, [
    { page_id: 'bep_3_wb_p111', printed_page: 111 },
    { page_id: 'bep_3_wb_p112', printed_page: 112 },
  ])
  const sbCards = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: [136, 137],
  })
  const wbCards = buildWbActivityCards({ summary: wbSummary, companion })
  assert.equal(sbCards.length, 5)
  assert.equal(wbCards.length, 5)

  let wbState = createDefaultWbActivitySelection(wbCards)
  const excludedWb = wbCards[wbCards.length - 1]
  assert.ok(excludedWb)
  wbState = setWbActivityCardSelected({
    cards: wbCards,
    state: wbState,
    cardId: excludedWb.id,
    selected: false,
  })
  const sbSelection = createSbActivityHandoffSelection(
    sbCards,
    createDefaultSbActivitySelection(sbCards),
  )
  const wbSelection = createWbActivityHandoffSelection(wbCards, wbState)

  const allActivities = [
    ...GRAMMAR_FIXTURE.studentBookActivities,
    ...GRAMMAR_FIXTURE.workbookActivities,
  ]
  const activityIds = allActivities.map((row) => String(row.activity_id))
  // Stored hashes come only from independently pinned migration values.
  const storedMigrationPins = GRAMMAR_MIGRATION_ACTIVITY_SHA256
  const currentMatchingMap = await buildCurrentActivitySha256ById({
    canonicalRaws: [{ activities: allActivities }],
    activityIds,
  })
  assert.equal(Object.keys(currentMatchingMap).length, 10)
  for (const activityId of activityIds) {
    assert.equal(currentMatchingMap[activityId], storedMigrationPins[activityId])
  }

  const loadNll = loadNllViaAssemble(
    'be3-u08-grammar',
    activityIds,
    storedMigrationPins,
  )
  const lesson = baseLesson({
    visiblePrintedPages: [136, 137],
    visiblePageRangeLabel: '136–137',
    workbookCompanion: companion,
    twoLessonPackagingMode: 'sb_only',
    currentFocus: 'Grammar',
    singleLessonTitle: 'Grammar',
  })

  const currentReport = await buildNllNlpInspectionReport({
    lesson,
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    sbSelection,
    wbSelection,
    selectedSuggestions: [],
    teacherAdditions: [],
    client: {} as never,
    nowIso: '2026-11-02T12:00:00.000Z',
    currentActivitySha256ById: currentMatchingMap,
    loadNll,
  })
  assert.equal(currentReport.nll.status, 'loaded')
  assert.equal(currentReport.nlp.status, 'assembled')
  assert.equal(currentReport.overview.nllActivitiesAvailable, 10)
  assert.equal(currentReport.overview.teacherSelectedCount, 9)
  assert.equal(currentReport.overview.teacherExcludedCount, 1)
  assert.equal(currentReport.overview.includedInNlpCount, 9)
  assert.equal(currentReport.overview.derivedSummariesInNlpCount, 9)
  assert.equal(currentReport.overview.staleCount, 0)
  assert.equal(currentReport.overview.stalenessUnverifiableCount, 0)
  assert.ok(
    currentReport.teacherSelections.every((row) => row.nllStaleness === 'current'),
  )
  const excludedId = excludedWb.references[0]?.activityId ?? ''
  assert.equal(excludedId, 'bep_3_wb_act_112_19')
  const excludedRow = currentReport.teacherSelections.find(
    (row) => row.activityId === excludedId,
  )
  assert.ok(excludedRow)
  assert.equal(excludedRow.selectedByTeacher, false)
  assert.equal(excludedRow.includedInNlp, false)
  assert.equal(excludedRow.nllStaleness, 'current')
  assert.equal(
    excludedRow.nllStoredActivitySha256,
    storedMigrationPins[excludedId],
  )

  const mutatedTarget = 'bep3_sb_act_08_21'
  const mutatedActivities = allActivities.map((activity) => {
    if (activity.activity_id !== mutatedTarget) return activity
    return { ...activity, instruction: `${String(activity.instruction)} [mutated]` }
  })
  const staleCurrentMap = await buildCurrentActivitySha256ById({
    canonicalRaws: [{ activities: mutatedActivities }],
    activityIds,
  })
  assert.notEqual(staleCurrentMap[mutatedTarget], storedMigrationPins[mutatedTarget])
  const staleReport = await buildNllNlpInspectionReport({
    lesson,
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    sbSelection,
    wbSelection,
    selectedSuggestions: [],
    teacherAdditions: [],
    client: {} as never,
    nowIso: '2026-11-02T12:00:00.000Z',
    currentActivitySha256ById: staleCurrentMap,
    loadNll,
  })
  assert.equal(staleReport.overview.staleCount, 1)
  assert.equal(staleReport.overview.stalenessUnverifiableCount, 0)
  assert.equal(staleReport.overview.includedInNlpCount, 9)
  const staleRow = staleReport.teacherSelections.find(
    (row) => row.activityId === mutatedTarget,
  )
  assert.ok(staleRow)
  assert.equal(staleRow.nllStaleness, 'potentially_stale')
  assert.equal(
    staleRow.nllStoredActivitySha256,
    storedMigrationPins[mutatedTarget],
  )
  assert.ok(
    staleReport.teacherSelections
      .filter((row) => row.activityId !== mutatedTarget)
      .every((row) => row.nllStaleness === 'current'),
  )

  const partialCurrentMap = { ...currentMatchingMap }
  delete partialCurrentMap[excludedId]
  const unverifiableReport = await buildNllNlpInspectionReport({
    lesson,
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    sbSelection,
    wbSelection,
    selectedSuggestions: [],
    teacherAdditions: [],
    client: {} as never,
    nowIso: '2026-11-02T12:00:00.000Z',
    currentActivitySha256ById: partialCurrentMap,
    loadNll,
  })
  assert.equal(unverifiableReport.overview.stalenessUnverifiableCount, 1)
  assert.equal(unverifiableReport.overview.staleCount, 0)
  const unverifiableRow = unverifiableReport.teacherSelections.find(
    (row) => row.activityId === excludedId,
  )
  assert.ok(unverifiableRow)
  assert.equal(unverifiableRow.nllStaleness, 'unverifiable')
  assert.equal(unverifiableRow.nllCurrentActivitySha256, null)
  assert.equal(
    unverifiableRow.nllStoredActivitySha256,
    storedMigrationPins[excludedId],
  )
  assert.equal(unverifiableRow.selectedByTeacher, false)
  assert.equal(unverifiableRow.includedInNlp, false)
  assert.ok(
    unverifiableReport.teacherSelections
      .filter((row) => row.activityId !== excludedId)
      .every((row) => row.nllStaleness === 'current'),
  )
})

test('Values Inspector authoritative SB hashes work without companion (SB-only NLP)', async () => {
  const sbSummary = fixtureSummary('big_english_3_sb', VALUES_FIXTURE.studentBookActivities, [
    { page_id: 'bep3_sb_p142', printed_page: 142 },
  ])
  const sbCards = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: [142],
  })
  assert.equal(sbCards.length, 3)
  const activityIds = VALUES_FIXTURE.studentBookActivities.map((row) =>
    String(row.activity_id),
  )
  const storedMigrationPins = VALUES_MIGRATION_ACTIVITY_SHA256
  const currentMatchingMap = await buildCurrentActivitySha256ById({
    canonicalRaws: [{ activities: VALUES_FIXTURE.studentBookActivities }],
    activityIds,
  })
  assert.equal(Object.keys(currentMatchingMap).length, 3)
  for (const activityId of activityIds) {
    assert.equal(currentMatchingMap[activityId], storedMigrationPins[activityId])
  }

  const loadNll = loadNllViaAssemble(
    'be3-u08-values',
    activityIds,
    storedMigrationPins,
  )
  const report = await buildNllNlpInspectionReport({
    lesson: baseLesson({
      visiblePrintedPages: [142],
      visiblePageRangeLabel: '142',
      twoLessonPackagingMode: 'sb_only',
      workbookCompanion: null,
      currentFocus: 'Values',
      singleLessonTitle: 'Values',
      stableLessonReference: 'be3-sb-u08-p142',
    }),
    activityCards: sbCards,
    workbookActivityCards: [],
    sbSelection: createSbActivityHandoffSelection(
      sbCards,
      createDefaultSbActivitySelection(sbCards),
    ),
    wbSelection: createWbActivityHandoffSelection(
      [],
      createDefaultWbActivitySelection([]),
    ),
    selectedSuggestions: [],
    teacherAdditions: [],
    client: {} as never,
    nowIso: '2026-11-02T12:00:00.000Z',
    currentActivitySha256ById: currentMatchingMap,
    loadNll,
  })

  assert.equal(report.nll.status, 'loaded')
  assert.equal(report.nll.componentKey, 'be3-u08-values')
  assert.equal(report.nlp.status, 'assembled')
  assert.equal(report.lessonIdentity.assembledPackageType, 'two_lesson_sb_only')
  assert.equal(report.lessonIdentity.companionRelationshipId, null)
  assert.deepEqual(report.lessonIdentity.workbookPages, [])
  assert.equal(report.overview.nllActivitiesAvailable, 3)
  assert.equal(report.overview.includedInNlpCount, 3)
  assert.equal(report.overview.staleCount, 0)
  assert.equal(report.overview.stalenessUnverifiableCount, 0)
  assert.ok(report.teacherSelections.every((row) => row.nllStaleness === 'current'))
  assert.ok(
    report.teacherSelections.every(
      (row) => row.selectedByTeacher === true && row.includedInNlp === true,
    ),
  )

  const partialCurrentMap = { ...currentMatchingMap }
  delete partialCurrentMap.bep3_sb_act_08_38
  const partialReport = await buildNllNlpInspectionReport({
    lesson: baseLesson({
      visiblePrintedPages: [142],
      visiblePageRangeLabel: '142',
      twoLessonPackagingMode: 'sb_only',
      workbookCompanion: null,
      currentFocus: 'Values',
      singleLessonTitle: 'Values',
      stableLessonReference: 'be3-sb-u08-p142',
    }),
    activityCards: sbCards,
    workbookActivityCards: [],
    sbSelection: createSbActivityHandoffSelection(
      sbCards,
      createDefaultSbActivitySelection(sbCards),
    ),
    wbSelection: createWbActivityHandoffSelection(
      [],
      createDefaultWbActivitySelection([]),
    ),
    selectedSuggestions: [],
    teacherAdditions: [],
    client: {} as never,
    nowIso: '2026-11-02T12:00:00.000Z',
    currentActivitySha256ById: partialCurrentMap,
    loadNll,
  })
  assert.equal(partialReport.nlp.status, 'assembled')
  assert.equal(partialReport.overview.stalenessUnverifiableCount, 1)
  assert.equal(partialReport.overview.staleCount, 0)
  const missing = partialReport.teacherSelections.find(
    (row) => row.activityId === 'bep3_sb_act_08_38',
  )
  assert.ok(missing)
  assert.equal(missing.nllStaleness, 'unverifiable')
  assert.equal(
    missing.nllStoredActivitySha256,
    storedMigrationPins.bep3_sb_act_08_38,
  )
  assert.ok(
    partialReport.teacherSelections
      .filter((row) => row.activityId !== 'bep3_sb_act_08_38')
      .every((row) => row.nllStaleness === 'current'),
  )
})
