/**
 * Stage 4 NLP → General Lesson Plan renderer tests.
 * Run: npx tsx --test scripts/tests/renderGeneralLessonPlanFromNeutralPackage.test.ts
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import type {
  NeutralSbWbLessonPackage,
  NeutralSelectedActivityEvidence,
} from '../../app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts'
import { renderGeneralLessonPlanFromNeutralPackage } from '../../app/src/features/chalkie/renderGeneralLessonPlanFromNeutralPackage.ts'

function evidence(input: {
  readonly activityId: string
  readonly source: 'SB' | 'WB'
  readonly printedPage: number
  readonly wording: string
  readonly activityNumber: string
}): NeutralSelectedActivityEvidence {
  return {
    cardId: `${input.source === 'SB' ? 'sb' : 'wb'}-activity:${input.activityId}`,
    source: input.source,
    pageId: `page-${input.printedPage}`,
    printedPage: input.printedPage,
    activityNumber: input.activityNumber,
    verifiedWording: input.wording,
    activityType: null,
    prompt: null,
    expectedAnswer: null,
    languageFrame: null,
    items: [],
    references: [
      {
        activityId: input.activityId,
        bookId: input.source === 'SB' ? 'big_english_3_sb' : 'big_english_3_wb',
        unitId: null,
        pageId: `page-${input.printedPage}`,
        verificationStatus: 'human_verified',
      },
    ],
  }
}

function packageFixture(input?: {
  readonly includeAct3Summary?: boolean
  readonly omitAct2Summary?: boolean
  readonly omitBi?: boolean
}): NeutralSbWbLessonPackage {
  const act1 = evidence({
    activityId: 'bep3_sb_act_08_01',
    source: 'SB',
    printedPage: 128,
    wording: 'Listen and say.',
    activityNumber: '1',
  })
  const act2 = evidence({
    activityId: 'bep3_sb_act_08_02',
    source: 'SB',
    printedPage: 128,
    wording: 'Find and say.',
    activityNumber: '2',
  })
  const act3 = evidence({
    activityId: 'bep3_sb_act_08_03',
    source: 'SB',
    printedPage: 128,
    wording: 'Play a game.',
    activityNumber: '3',
  })
  const wb1 = evidence({
    activityId: 'bep_3_wb_act_104_1',
    source: 'WB',
    printedPage: 104,
    wording: 'Write the activities.',
    activityNumber: '1',
  })

  const summaries = [
    {
      activityId: 'bep3_sb_act_08_01',
      summaryId: 's1',
      version: 1,
      summaryText: 'Students listen and say healthy-living questions.',
      evidenceStatus: 'sufficient' as const,
      displayStatus: 'hidden' as const,
      reviewState: 'experimental' as const,
      provenance: { generator: 'test' },
      canonicalPath: 'p',
      canonicalSha256: 'c',
      activitySha256: 'a1',
      createdAt: '2026-10-29T00:00:00.000Z',
      staleness: 'current' as const,
      currentActivitySha256: 'a1',
    },
  ]
  if (input?.includeAct3Summary !== false) {
    summaries.push({
      activityId: 'bep3_sb_act_08_03',
      summaryId: 's3',
      version: 1,
      summaryText:
        'The verified evidence only says “Play a game.” The game procedure is not available in the activity record.',
      evidenceStatus: 'insufficient',
      displayStatus: 'hidden',
      reviewState: 'experimental',
      provenance: { generator: 'test' },
      canonicalPath: 'p',
      canonicalSha256: 'c',
      activitySha256: 'a3',
      createdAt: '2026-10-29T00:00:00.000Z',
      staleness: 'current',
      currentActivitySha256: 'a3',
    })
  }
  if (!input?.omitAct2Summary) {
    summaries.splice(1, 0, {
      activityId: 'bep3_sb_act_08_02',
      summaryId: 's2',
      version: 1,
      summaryText: 'Students find matching content.',
      evidenceStatus: 'sufficient',
      displayStatus: 'hidden',
      reviewState: 'experimental',
      provenance: { generator: 'test' },
      canonicalPath: 'p',
      canonicalSha256: 'c',
      activitySha256: 'a2',
      createdAt: '2026-10-29T00:00:00.000Z',
      staleness: 'current',
      currentActivitySha256: 'a2',
    })
  }
  summaries.push({
    activityId: 'bep_3_wb_act_104_1',
    summaryId: 'w1',
    version: 1,
    summaryText: 'Students write healthy activities.',
    evidenceStatus: 'sufficient',
    displayStatus: 'hidden',
    reviewState: 'experimental',
    provenance: { generator: 'test' },
    canonicalPath: 'p',
    canonicalSha256: 'c',
    activitySha256: 'w',
    createdAt: '2026-10-29T00:00:00.000Z',
    staleness: 'current',
    currentActivitySha256: 'w',
  })

  return {
    identity: {
      packageReference: 'be3-sb-wb-u08-p128-129-wb104-105',
      relationshipId: 'be3_sb_wb_rel_u08_opener_sb128-129_wb104-105',
      relationshipType: 'workbook_practice_for',
      verificationStatus: 'human_verified',
      studentBookCatalogId: 'big_english_3_sb',
      workbookCatalogId: 'big_english_3_wb',
      unitNumber: 8,
      unitTitle: 'Healthy Living',
      componentKey: 'opener',
      componentTitle: 'Healthy and unhealthy activities',
    },
    packaging: {
      type: 'two_lesson_sb_wb',
      lessonOrder: ['lesson1', 'lesson2'],
    },
    lesson1: {
      id: 'lesson1',
      role: 'student_book',
      purpose: 'Introduce healthy and unhealthy activities.',
      scope: {
        source: 'SB',
        catalogBookId: 'big_english_3_sb',
        pageIds: ['p128', 'p129'],
        printedPages: [128, 129],
      },
      selectedActivities: [act1, act2, act3],
      vocabulary: ['healthy', 'unhealthy'],
      languageModels: ['Did you…?'],
      audioReferences: [],
      selection: {
        status: 'partial_selection',
        eligibleActivityCount: 5,
        selectedActivityCount: 3,
        hasExcludedActivities: true,
        fullySelectedPrintedPages: [],
        partiallySelectedPrintedPages: [128],
        zeroSelectedPrintedPages: [129],
      },
      emptySelectionMessage: null,
    },
    lesson2: {
      id: 'lesson2',
      role: 'workbook',
      purpose: 'Consolidate through workbook practice.',
      scope: {
        source: 'WB',
        catalogBookId: 'big_english_3_wb',
        pageIds: ['p104', 'p105'],
        printedPages: [104, 105],
      },
      selectedActivities: [wb1],
      vocabulary: ['exercise'],
      languageModels: [],
      audioReferences: [],
      selection: {
        status: 'partial_selection',
        eligibleActivityCount: 4,
        selectedActivityCount: 1,
        hasExcludedActivities: true,
        fullySelectedPrintedPages: [],
        partiallySelectedPrintedPages: [104],
        zeroSelectedPrintedPages: [105],
      },
      emptySelectionMessage: null,
    },
    priorSupport: [
      {
        id: 'p1',
        provenance: '[PRIOR]',
        label: 'Earlier unit',
        frame: 'I can talk about food.',
        sourceReference: 'Unit 7',
        evidenceReference: 'note',
        purpose: null,
        targetLessons: ['lesson1', 'lesson2'],
      },
      {
        id: 't1',
        provenance: '[TEACHER-ADDED · UNVERIFIED]',
        label: 'Teacher note',
        frame: 'Review yesterday',
        sourceReference: null,
        evidenceReference: null,
        purpose: 'Warm-up',
        targetLessons: ['lesson1', 'lesson2'],
      },
    ],
    ...(input?.omitBi
      ? {}
      : {
          curriculumInterpretation: {
            bookIntelligence: {
              catalogBookId: 'big_english_3_sb',
              unitId: 'u8',
              unitNumber: '8',
              communicativeFocus: 'Healthy habits',
              suggestedLearningOutcomes: 'Ask and answer Did…? questions',
              learningOutcomesProvenance: 'mixed' as const,
              biArtifactRef: 'bi-ref',
              layer: 'phase2_interpretation' as const,
            },
          },
        }),
    derivedKnowledge: {
      source: 'nll',
      componentKey: 'be3-u08-opener',
      componentId: 'component-1',
      activitySummaries: summaries.filter((row) =>
        input?.omitAct2Summary ? row.activityId !== 'bep3_sb_act_08_02' : true,
      ),
    },
    boundaries: {
      exactSourceScopeRequired: true,
      reconstructExcludedActivities: false,
      priorSupportMayReplaceCurrentEvidence: false,
      inferAdjacentWorkbookPages: false,
      inventSourceContent: false,
      bookIntelligenceMayBecomeSourceEvidence: false,
      excludedScopes: [],
      notes: [],
    },
  }
}

test('renderer produces two-lesson structure with experimental NLL labels', () => {
  const text = renderGeneralLessonPlanFromNeutralPackage(packageFixture())
  assert.match(text, /GENERAL LESSON PLAN — DERIVED EXPERIMENTAL PILOT/)
  assert.match(text, /LESSON 1 — Student Book/)
  assert.match(text, /LESSON 2 — Workbook/)
  assert.match(text, /Publisher evidence:/)
  assert.match(text, /NLL summary · experimental/)
  assert.match(text, /Students listen and say healthy-living questions/)
  assert.match(text, /SUGGESTED FLOW \(derived guidance · not publisher requirements\)/)
  assert.doesNotMatch(text, /ChatGPT|Claude|Chalkie|MagicSchool/)
})

test('Activity 3 remains insufficient without invented game procedure', () => {
  const text = renderGeneralLessonPlanFromNeutralPackage(packageFixture())
  assert.match(text, /Play a game/)
  assert.match(text, /Insufficient evidence for a fuller summary/)
  assert.doesNotMatch(text, /invented game|roll a die|winner takes/i)
})

test('missing summaries are visible; deselected activities stay absent', () => {
  const text = renderGeneralLessonPlanFromNeutralPackage(
    packageFixture({ omitAct2Summary: true }),
  )
  assert.match(
    text,
    /No preferred NLL summary is attached for this selected activity/,
  )
  assert.doesNotMatch(text, /bep3_sb_act_08_04/)
  assert.doesNotMatch(text, /bep_3_wb_act_105_3/)
})

test('Stage 4 renderer excludes BI and keeps derived purposes / publisher evidence', () => {
  // Fixture still carries curriculumInterpretation so the renderer must ignore it.
  const text = renderGeneralLessonPlanFromNeutralPackage(packageFixture())
  assert.match(text, /OBJECTIVES/)
  assert.match(
    text,
    /No authoritative lesson objective is available in this pilot package\./,
  )
  assert.doesNotMatch(text, /Book Intelligence/i)
  assert.doesNotMatch(text, /phase2_interpretation/)
  assert.doesNotMatch(text, /communicative focus/i)
  assert.doesNotMatch(text, /suggested learning outcomes/i)
  assert.doesNotMatch(text, /biArtifactRef/)
  assert.doesNotMatch(text, /Healthy habits/)
  assert.doesNotMatch(text, /Ask and answer Did…\? questions/)
  assert.match(text, /\[PRIOR\] Earlier unit/)
  assert.match(text, /\[TEACHER-ADDED · UNVERIFIED\] Teacher note/)
  assert.match(text, /Lesson 1 SB vocabulary/)
  assert.match(
    text,
    /Derived lesson purpose \(not a publisher requirement\): Introduce healthy and unhealthy activities\./,
  )
  assert.match(
    text,
    /Derived lesson purpose \(not a publisher requirement\): Consolidate through workbook practice\./,
  )
  assert.match(text, /Publisher evidence:/)
  assert.doesNotMatch(text, /Students should master healthy living forever/)
})
