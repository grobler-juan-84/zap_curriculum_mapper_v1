/**
 * NLL/NLP Inspector report builder (D029) — audit hardening.
 * Run: npx tsx --test scripts/tests/nllNlpInspector.test.ts
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
import type { ResolvedNllComponent } from '../../app/src/features/nll/neutralLessonLibrary.ts'
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

  assert.equal(report.nlp.status, 'unavailable')
  assert.equal(report.nll.status, 'loaded')
  assert.equal(report.lessonIdentity.twoLessonPackagingConfiguration, 'sb_only')
  assert.equal(report.lessonIdentity.assembledPackageType, null)
  assert.ok(report.markdown.includes('## Overview'))
  assert.ok(report.markdown.includes('Source/configuration mode'))
  assert.ok(
    report.teacherSelections.every(
      (row) => row.selectedByTeacher === true && row.includedInNlp === false,
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
