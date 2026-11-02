/**
 * Priority 4 — exact NLL component membership lookup.
 * Run: app\\node_modules\\.bin\\tsx.cmd --test scripts/tests/resolveNllComponentByExactActivityMembership.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS } from '../../app/src/features/chalkie/nllActivitySummaries.ts'
import {
  buildSbActivityCards,
  createDefaultSbActivitySelection,
  createSbActivityHandoffSelection,
} from '../../app/src/features/chalkie/chalkieActivitySelection.ts'
import {
  buildWbActivityCards,
  createDefaultWbActivitySelection,
  createWbActivityHandoffSelection,
} from '../../app/src/features/chalkie/chalkieWorkbookActivitySelection.ts'
import {
  buildNllNlpInspectionReport,
  collectAvailableLessonActivityIds,
} from '../../app/src/features/chalkie/nllNlpInspector.ts'
import type { ChalkieLessonContext } from '../../app/src/features/chalkie/resolveChalkieLessonContext.ts'
import { resolveVerifiedSbWbCompanion } from '../../app/src/features/chalkie/resolveVerifiedSbWbCompanion.ts'
import type { ResolvedNllComponent } from '../../app/src/features/nll/neutralLessonLibrary.ts'
import {
  resolveNllComponentByExactActivityMembership,
  type NllComponentMembershipCatalogEntry,
} from '../../app/src/features/nll/resolveNllComponentByExactActivityMembership.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

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

function catalogEntry(
  overrides: Partial<NllComponentMembershipCatalogEntry> &
    Pick<
      NllComponentMembershipCatalogEntry,
      'componentId' | 'componentKey' | 'activityIds'
    >,
): NllComponentMembershipCatalogEntry {
  return {
    componentTitle: overrides.componentTitle ?? overrides.componentKey,
    status: overrides.status ?? 'draft',
    ...overrides,
  }
}

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
    visiblePrintedPages: [136, 137],
    visiblePageRangeLabel: '136–137',
    unitPrintedPageStart: 128,
    unitPrintedPageEnd: 143,
    unitPageRangeLabel: '128–143',
    currentFocus: 'Grammar',
    lessonTopic: 'Grammar',
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
    twoLessonPackagingMode: 'sb_only',
    supportsTwoLessonSeries: true,
    workbookCompanion: null,
    sameUnitPriorLearningCandidates: [],
    curatedHorizontalMappingCandidates: [],
    priorLearningSuggestions: [],
    singleLessonTitle: 'Grammar',
    seriesLessonTitle: null,
    stableLessonReference: 'be3-sb-u08-p136-137',
    stableSeriesReference: null,
    ...overrides,
  }
}

const BE2_U01_TEST_ONLY_ACTIVITY_IDS = [
  'bep2_sb_act_01_01',
  'bep2_sb_act_01_02',
  'bep_2_wb_act_01_1',
] as const

const BE2_U01_TEST_ONLY_COMPONENT = catalogEntry({
  componentId: 'test-only-be2-u01-opener-id',
  componentKey: 'test-only-be2-u01-opener',
  componentTitle: 'Test-only BE2 Unit 1 opener',
  activityIds: BE2_U01_TEST_ONLY_ACTIVITY_IDS,
})

const BE3_GRAMMAR_COMPONENT = catalogEntry({
  componentId: 'nll-be3-u08-grammar',
  componentKey: 'be3-u08-grammar',
  componentTitle: 'BE3 U8 Grammar',
  activityIds: BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.grammar.expectedActivityIds,
})

test('1. test-only other book/unit resolves without a BE3 Unit 8 rule', () => {
  const result = resolveNllComponentByExactActivityMembership({
    lessonActivityIds: [...BE2_U01_TEST_ONLY_ACTIVITY_IDS].reverse(),
    catalog: [
      BE3_GRAMMAR_COMPONENT,
      BE2_U01_TEST_ONLY_COMPONENT,
      catalogEntry({
        componentId: 'nll-be3-u08-values',
        componentKey: 'be3-u08-values',
        activityIds: BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.values.expectedActivityIds,
      }),
    ],
  })

  assert.equal(result.kind, 'matched')
  if (result.kind !== 'matched') return
  assert.equal(result.componentKey, 'test-only-be2-u01-opener')
  assert.equal(result.componentId, 'test-only-be2-u01-opener-id')
})

test('2. existing BE3 Unit 8 Grammar membership still resolves', () => {
  const result = resolveNllComponentByExactActivityMembership({
    lessonActivityIds: [
      ...BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.grammar.expectedActivityIds,
    ],
    catalog: [BE2_U01_TEST_ONLY_COMPONENT, BE3_GRAMMAR_COMPONENT],
  })

  assert.equal(result.kind, 'matched')
  if (result.kind !== 'matched') return
  assert.equal(result.componentKey, 'be3-u08-grammar')
})

test('3. no matching component fails safely as unavailable', () => {
  const result = resolveNllComponentByExactActivityMembership({
    lessonActivityIds: ['bep3_sb_act_08_19', 'bep3_sb_act_08_20'],
    catalog: [BE3_GRAMMAR_COMPONENT, BE2_U01_TEST_ONLY_COMPONENT],
  })
  assert.deepEqual(result, { kind: 'unavailable' })
})

test('4. multiple exact matches fail safely as ambiguous', () => {
  const result = resolveNllComponentByExactActivityMembership({
    lessonActivityIds:
      BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.grammar.expectedActivityIds,
    catalog: [
      BE3_GRAMMAR_COMPONENT,
      catalogEntry({
        componentId: 'dup-be3-u08-grammar',
        componentKey: 'be3-u08-grammar-duplicate',
        componentTitle: 'Duplicate Grammar membership',
        activityIds: BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.grammar.expectedActivityIds,
      }),
    ],
  })

  assert.equal(result.kind, 'ambiguous')
  if (result.kind !== 'ambiguous') return
  assert.equal(result.matches.length, 2)
  assert.deepEqual(
    result.matches.map((match) => match.componentKey).sort(),
    ['be3-u08-grammar', 'be3-u08-grammar-duplicate'],
  )
})

test('partial / cross-book membership never matches', () => {
  assert.equal(
    resolveNllComponentByExactActivityMembership({
      lessonActivityIds: [
        ...BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.grammar.expectedActivityIds,
        'extra_activity',
      ],
      catalog: [BE3_GRAMMAR_COMPONENT],
    }).kind,
    'unavailable',
  )

  assert.equal(
    resolveNllComponentByExactActivityMembership({
      lessonActivityIds: BE2_U01_TEST_ONLY_ACTIVITY_IDS,
      catalog: [BE3_GRAMMAR_COMPONENT],
    }).kind,
    'unavailable',
  )
})

test('Inspector wires exact membership, non-BE3 match, unavailable, and ambiguous', async () => {
  const sbCanonical = loadJson(
    path.join(ROOT, 'data/phase1/big_english_3_sb/canonical/v1.json'),
  )
  const wbCanonical = loadJson(
    path.join(ROOT, 'data/phase1/big_english_3_wb/canonical/v1.json'),
  )
  const sbSummary = summaryFromCanonical(sbCanonical, 'big_english_3_sb')
  const wbSummary = summaryFromCanonical(wbCanonical, 'big_english_3_wb')
  const pages = [136, 137]
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
  const lessonActivityIds = collectAvailableLessonActivityIds({
    activityCards: sbCards,
    workbookActivityCards: wbCards,
  })
  assert.equal(
    lessonActivityIds.length,
    BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.grammar.expectedActivityIds.length,
  )

  const mockNll = (componentKey: string): ResolvedNllComponent => ({
    component: {
      id: `nll-${componentKey}`,
      component_key: componentKey,
      title: componentKey,
      status: 'draft',
      created_at: '2026-11-02T00:00:00.000Z',
    },
    activities: lessonActivityIds.map((activityId, index) => ({
      activityId,
      position: index + 1,
      preferredSummary: null,
    })),
    curriculumAuthorityLinks: [],
    proposedSsLinks: [],
  })

  const grammarReport = await buildNllNlpInspectionReport({
    lesson: baseLesson({ workbookCompanion: companion }),
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    sbSelection: createSbActivityHandoffSelection(
      sbCards,
      createDefaultSbActivitySelection(sbCards),
    ),
    wbSelection: createWbActivityHandoffSelection(
      wbCards,
      createDefaultWbActivitySelection(wbCards),
    ),
    selectedSuggestions: [],
    teacherAdditions: [],
    client: {} as never,
    loadNll: async (_client, key) => {
      assert.equal(key, 'be3-u08-grammar')
      return mockNll(key)
    },
    resolveNllComponentByExactMembership: (ids) =>
      resolveNllComponentByExactActivityMembership({
        lessonActivityIds: ids,
        catalog: [BE3_GRAMMAR_COMPONENT, BE2_U01_TEST_ONLY_COMPONENT],
      }),
    nowIso: '2026-11-02T00:00:00.000Z',
  })
  assert.equal(grammarReport.nll.status, 'loaded')
  assert.equal(grammarReport.nll.componentKey, 'be3-u08-grammar')
  assert.ok(grammarReport.nll.note.includes('exact activity-membership'))

  const otherBookReport = await buildNllNlpInspectionReport({
    lesson: baseLesson({
      catalogBookId: 'big_english_2_sb',
      bookLabel: 'Big English 2 Student Book',
      unitNumber: 1,
      workbookCompanion: null,
    }),
    activityCards: [],
    workbookActivityCards: [],
    sbSelection: createSbActivityHandoffSelection(
      [],
      createDefaultSbActivitySelection([]),
    ),
    wbSelection: createWbActivityHandoffSelection(
      [],
      createDefaultWbActivitySelection([]),
    ),
    selectedSuggestions: [],
    teacherAdditions: [],
    client: {} as never,
    loadNll: async (_client, key) => {
      assert.equal(key, 'test-only-be2-u01-opener')
      return {
        ...mockNll(key),
        activities: BE2_U01_TEST_ONLY_ACTIVITY_IDS.map((activityId, index) => ({
          activityId,
          position: index + 1,
          preferredSummary: null,
        })),
      }
    },
    // Injected resolver proves non-BE3 lookup without relying on BE3 cards.
    resolveNllComponentByExactMembership: () =>
      resolveNllComponentByExactActivityMembership({
        lessonActivityIds: BE2_U01_TEST_ONLY_ACTIVITY_IDS,
        catalog: [BE2_U01_TEST_ONLY_COMPONENT, BE3_GRAMMAR_COMPONENT],
      }),
    nowIso: '2026-11-02T00:00:00.000Z',
  })
  assert.equal(otherBookReport.nll.status, 'loaded')
  assert.equal(otherBookReport.nll.componentKey, 'test-only-be2-u01-opener')
  assert.ok(!otherBookReport.nll.note.includes('BE3 Unit 8 resolver fallback'))

  const ambiguousReport = await buildNllNlpInspectionReport({
    lesson: baseLesson({ workbookCompanion: companion }),
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    sbSelection: createSbActivityHandoffSelection(
      sbCards,
      createDefaultSbActivitySelection(sbCards),
    ),
    wbSelection: createWbActivityHandoffSelection(
      wbCards,
      createDefaultWbActivitySelection(wbCards),
    ),
    selectedSuggestions: [],
    teacherAdditions: [],
    client: {} as never,
    loadNll: async () => {
      assert.fail('loadNll must not run when membership is ambiguous')
      return null
    },
    resolveNllComponentByExactMembership: (ids) =>
      resolveNllComponentByExactActivityMembership({
        lessonActivityIds: ids,
        catalog: [
          BE3_GRAMMAR_COMPONENT,
          catalogEntry({
            componentId: 'dup-grammar',
            componentKey: 'be3-u08-grammar-duplicate',
            activityIds:
              BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.grammar.expectedActivityIds,
          }),
        ],
      }),
    nowIso: '2026-11-02T00:00:00.000Z',
  })
  assert.equal(ambiguousReport.nll.status, 'unavailable')
  assert.equal(ambiguousReport.nll.componentKey, null)
  assert.ok(ambiguousReport.nll.note.includes('Ambiguous NLL component membership'))

  const unavailableReport = await buildNllNlpInspectionReport({
    lesson: baseLesson({ workbookCompanion: null }),
    activityCards: [],
    workbookActivityCards: [],
    sbSelection: createSbActivityHandoffSelection(
      [],
      createDefaultSbActivitySelection([]),
    ),
    wbSelection: createWbActivityHandoffSelection(
      [],
      createDefaultWbActivitySelection([]),
    ),
    selectedSuggestions: [],
    teacherAdditions: [],
    client: {} as never,
    loadNll: async () => {
      assert.fail('loadNll must not run when no component matches')
      return null
    },
    resolveNllComponentByExactMembership: () => ({ kind: 'unavailable' }),
    nowIso: '2026-11-02T00:00:00.000Z',
  })
  assert.equal(unavailableReport.nll.status, 'not_applicable')
  assert.equal(unavailableReport.nll.componentKey, null)
})
