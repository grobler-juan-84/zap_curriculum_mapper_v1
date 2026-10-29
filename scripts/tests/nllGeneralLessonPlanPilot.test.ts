/**
 * Stage 4 NLL → NLP → General Lesson Plan pilot tests.
 * Run: npx tsx --test scripts/tests/nllGeneralLessonPlanPilot.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import type { SupabaseClient } from '@supabase/supabase-js'

import { isBe3U08ActivityEnrichmentPocEnabled } from '../../app/src/features/chalkie/be3U08ActivityEnrichmentPoc.ts'
import {
  BE3_U08_ACTIVITY_IDS,
  BE3_U08_WB_ACTIVITY_IDS,
} from '../../app/src/features/chalkie/be3U08ActivityEnrichmentPoc.ts'
import type { SbActivityCard } from '../../app/src/features/chalkie/chalkieActivitySelection.ts'
import type { WbActivityCard } from '../../app/src/features/chalkie/chalkieWorkbookActivitySelection.ts'
import {
  isNllCardComparisonEnabled,
} from '../../app/src/features/chalkie/nllCardComparison.ts'
import {
  NLL_GENERAL_LESSON_PLAN_PILOT_ENV,
  assembleNllGeneralLessonPlanPilot,
  attachSelectedNllDerivedKnowledge,
  canonicalActivityIdFromNeutralEvidence,
  isExactBe3U08OpenerNllGeneralLessonPlanScope,
  isNllGeneralLessonPlanPilotEnabled,
  orderedSelectedActivityIdsFromNeutralPackage,
  invalidateNllGeneralLessonPlanPilotRequest,
  mapTeacherInputsToOpenerPriorSupportForGeneralLessonPlan,
  shouldApplyNllGeneralLessonPlanPilotResult,
  shouldRunNllGeneralLessonPlanPilot,
} from '../../app/src/features/chalkie/nllGeneralLessonPlanPilot.ts'
import { mapTeacherInputsToOpenerPriorSupport as mapTeacherInputsToOpenerPriorSupportFromCanary } from '../../app/src/features/chalkie/be3U08OpenerNeutralCanary.ts'
import type {
  NeutralSbWbLessonPackage,
  NeutralSelectedActivityEvidence,
} from '../../app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts'
import type { VerifiedSbWbCompanion } from '../../app/src/features/chalkie/resolveVerifiedSbWbCompanion.ts'
import { isNllShadowPilotEnabled } from '../../app/src/features/nll/buildNllShadowLessonPackage.ts'
import type {
  NllActivitySummaryRow,
  ResolvedNllComponent,
} from '../../app/src/features/nll/neutralLessonLibrary.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const PILOT_SOURCE = path.join(
  ROOT,
  'app/src/features/chalkie/nllGeneralLessonPlanPilot.ts',
)
const OVERLAY_SOURCE = path.join(
  ROOT,
  'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx',
)
const PACKAGE_SOURCE = path.join(
  ROOT,
  'app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts',
)
const COMPONENT_ID = '3e800008-0000-4000-8000-000000000001'

const SB_PAGES: Record<(typeof BE3_U08_ACTIVITY_IDS)[number], number> = {
  bep3_sb_act_08_01: 128,
  bep3_sb_act_08_02: 128,
  bep3_sb_act_08_03: 128,
  bep3_sb_act_08_04: 129,
  bep3_sb_act_08_05: 129,
}

const WB_PAGES: Record<(typeof BE3_U08_WB_ACTIVITY_IDS)[number], number> = {
  bep_3_wb_act_104_1: 104,
  bep_3_wb_act_104_2: 104,
  bep_3_wb_act_105_3: 105,
  bep_3_wb_act_105_4: 105,
}

function syntheticOpenerSbCards(): SbActivityCard[] {
  return BE3_U08_ACTIVITY_IDS.map((activityId) => {
    const pageId = `page-${SB_PAGES[activityId]}`
    const references = {
      activityId,
      bookId: 'big_english_3_sb',
      unitId: 'big_english_3_sb_unit_08',
      pageId,
      verificationStatus: 'human_verified' as const,
    }
    return {
      id: `sb-activity:${activityId}`,
      source: 'SB' as const,
      pageId,
      printedPage: SB_PAGES[activityId],
      activityNumber: activityId.slice(-2),
      verifiedWording: `SB wording ${activityId}`,
      preview: { kind: 'empty' as const, values: [] },
      activityLinkedModels: [],
      pageDedicatedVocabulary: [],
      pageDedicatedLanguage: [],
      references,
      evidence: {
        cardId: `sb-activity:${activityId}`,
        source: 'SB' as const,
        pageId,
        printedPage: SB_PAGES[activityId],
        activityNumber: activityId.slice(-2),
        verifiedWording: `SB wording ${activityId}`,
        activityType: null,
        prompt: null,
        expectedAnswer: null,
        languageFrame: null,
        audioDependency: false,
        visualDependency: false,
        sourceDependencyNote: null,
        items: [],
        references,
      },
    }
  })
}

function syntheticOpenerWbCards(): WbActivityCard[] {
  return BE3_U08_WB_ACTIVITY_IDS.map((activityId) => {
    const pageId = `page-${WB_PAGES[activityId]}`
    const references = [
      {
        activityId,
        bookId: 'big_english_3_wb',
        unitId: 'big_english_3_wb_unit_08',
        pageId,
        verificationStatus: 'human_verified' as const,
      },
    ]
    return {
      id: `wb-activity:${activityId}`,
      source: 'WB' as const,
      pageId,
      printedPage: WB_PAGES[activityId],
      activityNumber: activityId.slice(-1),
      verifiedWording: `WB wording ${activityId}`,
      preview: { kind: 'empty' as const, values: [] },
      activityLinkedModels: [],
      pageDedicatedVocabulary: [],
      pageDedicatedLanguage: [],
      references,
      evidence: {
        cardId: `wb-activity:${activityId}`,
        source: 'WB' as const,
        pageId,
        printedPage: WB_PAGES[activityId],
        activityNumber: activityId.slice(-1),
        verifiedWording: `WB wording ${activityId}`,
        activityType: null,
        prompt: null,
        expectedAnswer: null,
        languageFrame: null,
        audioDependency: false,
        visualDependency: false,
        sourceDependencyNote: null,
        items: [],
        references,
      },
    }
  })
}

function openerCompanion(): VerifiedSbWbCompanion {
  return {
    studentBookCatalogId: 'big_english_3_sb',
    workbookCatalogId: 'big_english_3_wb',
    studentBookPrintedPages: [128, 129],
    workbookPrintedPages: [104, 105],
    relationshipId: 'be3_sb_wb_rel_u08_opener_sb128-129_wb104-105',
    relationshipType: 'workbook_practice_for',
    source: 'curated_verified',
  }
}

function summaryRow(
  activityId: string,
  overrides: Partial<NllActivitySummaryRow> = {},
): NllActivitySummaryRow {
  return {
    id: `summary-${activityId}`,
    activity_id: activityId,
    version: 1,
    summary_text: `Summary for ${activityId}`,
    canonical_path: 'canonical/path.json',
    canonical_sha256: 'canon-sha',
    activity_sha256: `act-sha-${activityId}`,
    evidence_status: activityId === 'bep3_sb_act_08_03' ? 'insufficient' : 'sufficient',
    display_status: 'hidden',
    review_state: 'experimental',
    is_preferred: true,
    provenance: { generator: 'pilot-test', activityId },
    created_at: '2026-10-29T00:00:00.000Z',
    ...overrides,
  }
}

function resolvedComponent(
  activityIds: readonly string[],
  summaryOverrides: Partial<Record<string, Partial<NllActivitySummaryRow>>> = {},
): ResolvedNllComponent {
  return {
    component: {
      id: COMPONENT_ID,
      component_key: 'be3-u08-opener',
      title: 'Opener',
      status: 'available',
      created_at: '2026-10-29T00:00:00.000Z',
    },
    activities: activityIds.map((activityId, index) => {
      const row = summaryRow(activityId, summaryOverrides[activityId])
      return {
        activityId,
        position: index + 1,
        preferredSummary: {
          ...row,
          staleness: 'current' as const,
          currentActivitySha256: row.activity_sha256,
        },
      }
    }),
    curriculumAuthorityLinks: [],
    proposedSsLinks: [],
  }
}

function evidenceFromCard(
  card: SbActivityCard | WbActivityCard,
): NeutralSelectedActivityEvidence {
  return {
    cardId: card.evidence.cardId,
    source: card.evidence.source,
    pageId: card.evidence.pageId,
    printedPage: card.evidence.printedPage,
    activityNumber: card.evidence.activityNumber,
    verifiedWording: card.evidence.verifiedWording,
    activityType: card.evidence.activityType,
    prompt: card.evidence.prompt,
    expectedAnswer: card.evidence.expectedAnswer,
    languageFrame: card.evidence.languageFrame,
    items: [],
    references:
      card.source === 'SB'
        ? [card.references]
        : [...card.references],
  }
}

function baseNlp(input?: {
  readonly omitSbIds?: readonly string[]
  readonly omitWbIds?: readonly string[]
}): NeutralSbWbLessonPackage {
  const omitSb = new Set(input?.omitSbIds ?? [])
  const omitWb = new Set(input?.omitWbIds ?? [])
  const sbCards = syntheticOpenerSbCards().filter(
    (card) => !omitSb.has(card.references.activityId),
  )
  const wbCards = syntheticOpenerWbCards().filter(
    (card) => !omitWb.has(card.references[0].activityId),
  )
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
      purpose: 'Lesson 1 purpose',
      scope: {
        source: 'SB',
        catalogBookId: 'big_english_3_sb',
        pageIds: ['bep3_sb_p128', 'bep3_sb_p129'],
        printedPages: [128, 129],
      },
      selectedActivities: sbCards.map(evidenceFromCard),
      vocabulary: ['healthy'],
      languageModels: ['Did you…?'],
      audioReferences: [],
      selection: {
        status: 'partial_selection',
        eligibleActivityCount: 5,
        selectedActivityCount: sbCards.length,
        hasExcludedActivities: sbCards.length < 5,
        fullySelectedPrintedPages: [],
        partiallySelectedPrintedPages: [128, 129],
        zeroSelectedPrintedPages: [],
      },
      emptySelectionMessage: sbCards.length === 0 ? 'No SB selected.' : null,
    },
    lesson2: {
      id: 'lesson2',
      role: 'workbook',
      purpose: 'Lesson 2 purpose',
      scope: {
        source: 'WB',
        catalogBookId: 'big_english_3_wb',
        pageIds: ['bep_3_wb_p104', 'bep_3_wb_p105'],
        printedPages: [104, 105],
      },
      selectedActivities: wbCards.map(evidenceFromCard),
      vocabulary: [],
      languageModels: [],
      audioReferences: [],
      selection: {
        status: 'partial_selection',
        eligibleActivityCount: 4,
        selectedActivityCount: wbCards.length,
        hasExcludedActivities: wbCards.length < 4,
        fullySelectedPrintedPages: [],
        partiallySelectedPrintedPages: [104, 105],
        zeroSelectedPrintedPages: [],
      },
      emptySelectionMessage: wbCards.length === 0 ? 'No WB selected.' : null,
    },
    priorSupport: [
      {
        id: 'prior-1',
        provenance: '[PRIOR]',
        label: 'Prior frame',
        frame: 'I can…',
        sourceReference: 'U7',
        evidenceReference: 'note',
        purpose: null,
        targetLessons: ['lesson1', 'lesson2'],
      },
    ],
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

test('flag defaults off and accepts only established explicit truthy values', () => {
  assert.equal(isNllGeneralLessonPlanPilotEnabled({}), false)
  assert.equal(
    isNllGeneralLessonPlanPilotEnabled({
      [NLL_GENERAL_LESSON_PLAN_PILOT_ENV]: 'false',
    }),
    false,
  )
  assert.equal(
    isNllGeneralLessonPlanPilotEnabled({
      [NLL_GENERAL_LESSON_PLAN_PILOT_ENV]: 'true',
    }),
    true,
  )
  assert.equal(
    isNllGeneralLessonPlanPilotEnabled({
      [NLL_GENERAL_LESSON_PLAN_PILOT_ENV]: '1',
    }),
    true,
  )
  assert.equal(
    isNllGeneralLessonPlanPilotEnabled({
      [NLL_GENERAL_LESSON_PLAN_PILOT_ENV]: 'yes',
    }),
    true,
  )
})

test('flag is independent from Stage 3, POC, shadow, and canary flags', () => {
  const env = {
    VITE_CHALKIE_NLL_CARD_COMPARISON: 'true',
    VITE_CHALKIE_BE3_U08_ACTIVITY_ENRICHMENT_POC: 'true',
    VITE_CHALKIE_NLL_SHADOW_PILOT: 'true',
    VITE_CHALKIE_BE3_U08_OPENER_NEUTRAL_CANARY: 'true',
  }
  assert.equal(isNllGeneralLessonPlanPilotEnabled(env), false)
  assert.equal(isNllCardComparisonEnabled(env), true)
  assert.equal(isBe3U08ActivityEnrichmentPocEnabled(env), true)
  assert.equal(isNllShadowPilotEnabled(env), true)
  assert.equal(
    isNllGeneralLessonPlanPilotEnabled({
      ...env,
      [NLL_GENERAL_LESSON_PLAN_PILOT_ENV]: 'true',
    }),
    true,
  )
})

test('exact Opener scope is required; Story cards are ineligible', () => {
  const companion = openerCompanion()
  assert.equal(
    isExactBe3U08OpenerNllGeneralLessonPlanScope({
      activityCards: syntheticOpenerSbCards(),
      workbookActivityCards: syntheticOpenerWbCards(),
      companion,
    }),
    true,
  )
  assert.equal(
    isExactBe3U08OpenerNllGeneralLessonPlanScope({
      activityCards: syntheticOpenerSbCards().slice(0, 2),
      workbookActivityCards: syntheticOpenerWbCards(),
      companion,
    }),
    false,
  )
  assert.equal(
    shouldRunNllGeneralLessonPlanPilot({
      flagEnabled: true,
      exactScopeEligible: false,
      generalLessonPlanRequested: true,
    }),
    false,
  )
  assert.equal(
    shouldRunNllGeneralLessonPlanPilot({
      flagEnabled: true,
      exactScopeEligible: true,
      generalLessonPlanRequested: false,
    }),
    false,
  )
})

test('attach keeps publisher evidence free of NLL fields and orders Lesson1 then Lesson2', () => {
  const nlp = baseNlp({ omitSbIds: ['bep3_sb_act_08_02'] })
  const allIds = [...BE3_U08_ACTIVITY_IDS, ...BE3_U08_WB_ACTIVITY_IDS]
  const attached = attachSelectedNllDerivedKnowledge({
    nlp,
    resolved: resolvedComponent(allIds),
  })
  assert.ok(attached.derivedKnowledge)
  assert.equal(attached.derivedKnowledge?.source, 'nll')
  assert.equal(attached.derivedKnowledge?.componentId, COMPONENT_ID)
  const ordered = attached.derivedKnowledge!.activitySummaries.map(
    (row) => row.activityId,
  )
  assert.deepEqual(
    ordered,
    orderedSelectedActivityIdsFromNeutralPackage(nlp),
  )
  assert.ok(!ordered.includes('bep3_sb_act_08_02'))
  assert.equal(ordered[0], 'bep3_sb_act_08_01')
  assert.equal(ordered.at(-1), 'bep_3_wb_act_105_4')
  for (const activity of [
    ...attached.lesson1.selectedActivities,
    ...attached.lesson2.selectedActivities,
  ]) {
    assert.equal('summaryText' in activity, false)
    assert.equal('derivedKnowledge' in activity, false)
    assert.ok(activity.verifiedWording.startsWith('SB wording') || activity.verifiedWording.startsWith('WB wording'))
  }
})

test('preferred-summary identity/version can change without evidence or membership changes', () => {
  const nlp = baseNlp()
  const first = attachSelectedNllDerivedKnowledge({
    nlp,
    resolved: resolvedComponent(['bep3_sb_act_08_01'], {
      bep3_sb_act_08_01: { id: 'sum-v1', version: 1, summary_text: 'v1 text' },
    }),
  })
  const second = attachSelectedNllDerivedKnowledge({
    nlp,
    resolved: resolvedComponent(['bep3_sb_act_08_01'], {
      bep3_sb_act_08_01: {
        id: 'sum-v2',
        version: 2,
        summary_text: 'v2 text',
        activity_sha256: 'new-sha',
        provenance: { generator: 'replacement' },
      },
    }),
  })
  assert.deepEqual(
    first.lesson1.selectedActivities,
    second.lesson1.selectedActivities,
  )
  assert.equal(first.derivedKnowledge?.activitySummaries[0]?.summaryId, 'sum-v1')
  assert.equal(second.derivedKnowledge?.activitySummaries[0]?.summaryId, 'sum-v2')
  assert.equal(second.derivedKnowledge?.activitySummaries[0]?.version, 2)
  assert.equal(
    second.derivedKnowledge?.activitySummaries[0]?.activitySha256,
    'new-sha',
  )
  assert.deepEqual(
    second.derivedKnowledge?.activitySummaries[0]?.provenance,
    { generator: 'replacement' },
  )
})

test('successful empty mapping creates empty derivedKnowledge section', () => {
  const nlp = baseNlp()
  const attached = attachSelectedNllDerivedKnowledge({
    nlp,
    resolved: {
      component: {
        id: COMPONENT_ID,
        component_key: 'be3-u08-opener',
        title: 'Opener',
        status: 'available',
        created_at: '2026-10-29T00:00:00.000Z',
      },
      activities: nlp.lesson1.selectedActivities.map((activity) => ({
        activityId: canonicalActivityIdFromNeutralEvidence(activity)!,
        position: 1,
        preferredSummary: null,
      })),
      curriculumAuthorityLinks: [],
      proposedSsLinks: [],
    },
  })
  assert.deepEqual(attached.derivedKnowledge, {
    source: 'nll',
    componentKey: 'be3-u08-opener',
    componentId: COMPONENT_ID,
    activitySummaries: [],
  })
})

test('assemble returns honest fallbacks and never loads when flag off', async () => {
  let loadCount = 0
  const loadNll = async () => {
    loadCount += 1
    return resolvedComponent([...BE3_U08_ACTIVITY_IDS, ...BE3_U08_WB_ACTIVITY_IDS])
  }
  const sbCards = syntheticOpenerSbCards()
  const wbCards = syntheticOpenerWbCards()
  const companion = openerCompanion()
  const sbSelection = {
    allCards: sbCards,
    selectedEvidence: sbCards.map((card) => card.evidence),
  }
  const wbSelection = {
    allCards: wbCards,
    selectedEvidence: wbCards.map((card) => card.evidence),
  }

  const off = await assembleNllGeneralLessonPlanPilot({
    flagEnabled: false,
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion,
    sbSelection,
    wbSelection,
    client: {} as SupabaseClient,
    loadNll,
  })
  assert.equal(off.ok, false)
  if (!off.ok) assert.equal(off.reason, 'flag_off')
  assert.equal(loadCount, 0)

  const missingClient = await assembleNllGeneralLessonPlanPilot({
    flagEnabled: true,
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion,
    sbSelection,
    wbSelection,
    client: null,
  })
  assert.equal(missingClient.ok, false)
  if (!missingClient.ok) assert.equal(missingClient.reason, 'missing_client')

  const missingComponent = await assembleNllGeneralLessonPlanPilot({
    flagEnabled: true,
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion,
    sbSelection,
    wbSelection,
    client: {} as SupabaseClient,
    loadNll: async () => null,
  })
  assert.equal(missingComponent.ok, false)
  if (!missingComponent.ok) assert.equal(missingComponent.reason, 'missing_component')

  const loadError = await assembleNllGeneralLessonPlanPilot({
    flagEnabled: true,
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion,
    sbSelection,
    wbSelection,
    client: {} as SupabaseClient,
    loadNll: async () => {
      throw new Error('network down')
    },
  })
  assert.equal(loadError.ok, false)
  if (!loadError.ok) {
    assert.equal(loadError.reason, 'load_error')
    assert.match(loadError.message, /network down/)
  }

  const success = await assembleNllGeneralLessonPlanPilot({
    flagEnabled: true,
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion,
    sbSelection,
    wbSelection,
    client: {} as SupabaseClient,
    loadNll,
    buildNeutralPackage: () => baseNlp(),
  })
  assert.equal(success.ok, true)
  if (success.ok) {
    assert.equal(success.nlp.derivedKnowledge?.activitySummaries.length, 9)
    assert.equal(loadCount, 1)
    assert.equal(
      success.nlp.derivedKnowledge?.activitySummaries[0]?.displayStatus,
      'hidden',
    )
  }
})

test('hidden experimental loading is requested only on eligible assemble path', async () => {
  const seen: Array<{ key: string; hidden: boolean }> = []
  await assembleNllGeneralLessonPlanPilot({
    flagEnabled: true,
    activityCards: syntheticOpenerSbCards(),
    workbookActivityCards: syntheticOpenerWbCards(),
    companion: openerCompanion(),
    sbSelection: {
      allCards: syntheticOpenerSbCards(),
      selectedEvidence: syntheticOpenerSbCards().map((c) => c.evidence),
    },
    wbSelection: {
      allCards: syntheticOpenerWbCards(),
      selectedEvidence: syntheticOpenerWbCards().map((c) => c.evidence),
    },
    client: {} as SupabaseClient,
    loadNll: async (_client, componentKey, options) => {
      seen.push({
        key: componentKey,
        hidden: options.includeHiddenExperimental === true,
      })
      return resolvedComponent([...BE3_U08_ACTIVITY_IDS, ...BE3_U08_WB_ACTIVITY_IDS])
    },
    buildNeutralPackage: () => baseNlp(),
  })
  assert.deepEqual(seen, [{ key: 'be3-u08-opener', hidden: true }])
})

test('result guard requires open overlay, current request, matching scope, and General output', () => {
  const base = {
    requestId: 1,
    latestRequestId: 1,
    overlayOpen: true,
    requestScopeKey: 'rel|sb|wb',
    currentScopeKey: 'rel|sb|wb',
    preparedOutputKind: 'lesson_plan' as const,
  }
  assert.equal(shouldApplyNllGeneralLessonPlanPilotResult(base), true)
  assert.equal(
    shouldApplyNllGeneralLessonPlanPilotResult({
      ...base,
      latestRequestId: 2,
    }),
    false,
  )
  assert.equal(
    shouldApplyNllGeneralLessonPlanPilotResult({
      ...base,
      overlayOpen: false,
    }),
    false,
  )
  assert.equal(
    shouldApplyNllGeneralLessonPlanPilotResult({
      ...base,
      currentScopeKey: 'rel|sb-changed|wb',
    }),
    false,
  )
  assert.equal(
    shouldApplyNllGeneralLessonPlanPilotResult({
      ...base,
      preparedOutputKind: 'chalkie',
    }),
    false,
  )
  assert.equal(
    shouldApplyNllGeneralLessonPlanPilotResult({
      ...base,
      preparedOutputKind: null,
    }),
    false,
  )

  const requestIdRef = { current: 4 }
  invalidateNllGeneralLessonPlanPilotRequest({ requestIdRef })
  assert.equal(requestIdRef.current, 5)
  assert.equal(
    shouldApplyNllGeneralLessonPlanPilotResult({
      ...base,
      requestId: 4,
      latestRequestId: requestIdRef.current,
    }),
    false,
  )
})

test('scope-key change and General→Chalkie supersession both fail the real apply guard', () => {
  const requestIdRef = { current: 10 }
  const requestScopeKey = 'opener|sb128-129|wb104-105'
  const inFlight = {
    requestId: requestIdRef.current,
    latestRequestId: requestIdRef.current,
    overlayOpen: true,
    requestScopeKey,
    currentScopeKey: requestScopeKey,
    preparedOutputKind: 'lesson_plan' as const,
  }
  assert.equal(shouldApplyNllGeneralLessonPlanPilotResult(inFlight), true)

  // Eligibility/scope drifts while overlay stays open: request id may still match,
  // but the captured scope key must not.
  assert.equal(
    shouldApplyNllGeneralLessonPlanPilotResult({
      ...inFlight,
      currentScopeKey: 'story|sb132-133|wb106-107',
    }),
    false,
  )

  // Teacher chooses Chalkie while General remains in flight: invalidate + clear General.
  invalidateNllGeneralLessonPlanPilotRequest({ requestIdRef })
  assert.equal(
    shouldApplyNllGeneralLessonPlanPilotResult({
      ...inFlight,
      latestRequestId: requestIdRef.current,
      preparedOutputKind: null,
    }),
    false,
  )
  assert.equal(
    shouldApplyNllGeneralLessonPlanPilotResult({
      ...inFlight,
      latestRequestId: requestIdRef.current,
      preparedOutputKind: 'chalkie',
    }),
    false,
  )
})

test('Stage 4 prior-support mapper preserves established PRIOR/HM and teacher-added semantics', () => {
  const selectedSuggestions = [
    {
      id: 'prior-a',
      label: 'Prior A',
      frame: 'I can…',
      source: 'Unit 7',
      evidenceNote: '  note  ',
      provenanceTag: '[PRIOR]' as const,
    },
    {
      id: 'hm-b',
      label: 'HM B',
      frame: 'I have…',
      source: 'Bank',
      evidenceNote: '',
      provenanceTag: '[HM]' as const,
    },
  ]
  const teacherAdditions = [
    {
      title: ' Teacher note ',
      frame: ' Review ',
      purpose: ' Warm-up ',
    },
  ]
  const fromPilot = mapTeacherInputsToOpenerPriorSupportForGeneralLessonPlan({
    selectedSuggestions,
    teacherAdditions,
  })
  const fromCanary = mapTeacherInputsToOpenerPriorSupportFromCanary({
    selectedSuggestions,
    teacherAdditions,
  })
  assert.deepEqual(fromPilot, fromCanary)
  assert.equal(fromPilot[0]?.provenance, '[PRIOR]')
  assert.equal(fromPilot[1]?.provenance, '[HM]')
  assert.equal(fromPilot[0]?.evidenceReference, 'note')
  assert.equal(fromPilot[1]?.evidenceReference, 'teacher-selected support')
  assert.equal(fromPilot[2]?.provenance, '[TEACHER-ADDED · UNVERIFIED]')
  assert.equal(fromPilot[2]?.purpose, 'Warm-up')
  assert.deepEqual(fromPilot[2]?.targetLessons, ['lesson1', 'lesson2'])
})

test('overlay wires Stage 4 lazily on General only; package keeps derivedKnowledge optional', () => {
  const pilot = fs.readFileSync(PILOT_SOURCE, 'utf8')
  const overlay = fs.readFileSync(OVERLAY_SOURCE, 'utf8')
  const pkg = fs.readFileSync(PACKAGE_SOURCE, 'utf8')
  assert.match(pilot, /VITE_NLL_GENERAL_LESSON_PLAN_PILOT/)
  assert.match(pilot, /includeHiddenExperimental: true/)
  assert.match(pilot, /mapTeacherInputsToOpenerPriorSupportForGeneralLessonPlan/)
  assert.doesNotMatch(pilot, /buildNllShadowLessonPackage/)
  assert.doesNotMatch(pilot, /subscribeNllCardComparisonLifecycle/)
  assert.doesNotMatch(pilot, /be3U08OpenerNeutralCanary/)
  assert.doesNotMatch(pilot, /bookIntelligenceUnit/)
  assert.doesNotMatch(pilot, /biArtifactRef/)
  assert.doesNotMatch(pilot, /BookIntelligenceUnitOverview/)
  assert.match(overlay, /assembleNllGeneralLessonPlanPilot/)
  assert.match(overlay, /renderGeneralLessonPlanFromNeutralPackage/)
  assert.match(overlay, /handlePrepareDetailedLessonPlan/)
  assert.match(overlay, /Preparing general lesson plan/)
  assert.match(overlay, /NLL_GENERAL_LESSON_PLAN_FALLBACK_LINE/)
  assert.match(overlay, /invalidateNllGeneralLessonPlanPilotRequest/)
  assert.match(overlay, /openerNllGeneralLessonPlanScopeKey/)
  assert.match(overlay, /handleChooseChalkie/)
  const chalkieHandler = overlay.slice(
    overlay.indexOf('const handleChooseChalkie'),
    overlay.indexOf('const resetPreviewChromeForLessonPlan') === -1
      ? overlay.indexOf('const handlePrepareDetailedLessonPlan')
      : overlay.indexOf('const resetPreviewChromeForLessonPlan'),
  )
  assert.match(chalkieHandler, /invalidateNllGeneralLessonPlanPilotRequest/)
  assert.match(chalkieHandler, /preparedOutputKindRef\.current === 'lesson_plan'/)
  assert.match(chalkieHandler, /preparedOutputKindRef\.current = null/)
  assert.doesNotMatch(chalkieHandler, /assembleNllGeneralLessonPlanPilot/)
  assert.match(overlay, /generalLessonPlanRequestScopeKeyRef/)
  assert.match(overlay, /generalLessonPlanCurrentScopeKeyRef/)
  assert.match(
    overlay,
    /generalLessonPlanRequestScopeKeyRef\.current !== generalLessonPlanScopeKey/,
  )
  const assembleCall = overlay.slice(
    overlay.indexOf('void assembleNllGeneralLessonPlanPilot({'),
    overlay.indexOf('}).then((result) => {'),
  )
  assert.doesNotMatch(assembleCall, /bookIntelligenceUnit/)
  assert.doesNotMatch(assembleCall, /biArtifactRef/)
  assert.match(overlay, /buildExistingGeneralLessonPlanText/)
  assert.match(
    overlay.slice(
      overlay.indexOf('const buildExistingGeneralLessonPlanText'),
      overlay.indexOf('const handlePrepareDetailedLessonPlan'),
    ),
    /bookIntelligenceUnit/,
  )
  assert.match(pkg, /derivedKnowledge\?:/)
  assert.match(pkg, /NeutralNllDerivedKnowledge/)
  assert.match(pkg, /curriculumInterpretation/)
  assert.doesNotMatch(
    pkg.slice(pkg.indexOf('export function buildNeutralSbWbLessonPackage')),
    /derivedKnowledge:/,
  )
})

test('successful Stage 4 assemble omits curriculumInterpretation BI from the package', async () => {
  const sbCards = syntheticOpenerSbCards()
  const wbCards = syntheticOpenerWbCards()
  let seenBiArgs: { bookIntelligenceUnit?: unknown; biArtifactRef?: unknown } | null =
    null
  const success = await assembleNllGeneralLessonPlanPilot({
    flagEnabled: true,
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion: openerCompanion(),
    sbSelection: {
      allCards: sbCards,
      selectedEvidence: sbCards.map((card) => card.evidence),
    },
    wbSelection: {
      allCards: wbCards,
      selectedEvidence: wbCards.map((card) => card.evidence),
    },
    client: {} as SupabaseClient,
    loadNll: async () =>
      resolvedComponent([...BE3_U08_ACTIVITY_IDS, ...BE3_U08_WB_ACTIVITY_IDS]),
    buildNeutralPackage: (input) => {
      seenBiArgs = {
        bookIntelligenceUnit: input.bookIntelligenceUnit,
        biArtifactRef: input.biArtifactRef,
      }
      return baseNlp()
    },
  })
  assert.equal(success.ok, true)
  assert.deepEqual(seenBiArgs, {
    bookIntelligenceUnit: undefined,
    biArtifactRef: undefined,
  })
  if (success.ok) {
    assert.equal(success.nlp.curriculumInterpretation, undefined)
  }
})
