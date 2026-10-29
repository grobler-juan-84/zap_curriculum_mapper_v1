/**
 * Stage 6B NLL -> NLP -> Chalkie Story adapter pilot tests.
 * Run: npx tsx --test scripts/tests/nllStoryChalkieAdapterPilot.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  NLL_CHALKIE_ADAPTER_PILOT_ENV,
  isNllChalkieAdapterPilotEnabled,
} from '../../app/src/features/chalkie/nllChalkieAdapterPilot.ts'
import {
  BE3_U08_STORY_NLL_COMPONENT_KEY,
  NLL_CHALKIE_STORY_ADAPTER_PILOT_ENV,
  assembleNllStoryChalkieAdapterPilot,
  invalidateNllStoryChalkieAdapterPilotRequest,
  isExactBe3U08StoryNllChalkieAdapterScope,
  isNllStoryChalkieAdapterPilotEnabled,
  nllStoryChalkieAdapterRequestKey,
  shouldApplyNllStoryChalkieAdapterPilotResult,
  shouldRunNllStoryChalkieAdapterPilot,
} from '../../app/src/features/chalkie/nllStoryChalkieAdapterPilot.ts'
import { BE3_U08_STORY_NEUTRAL_CANARY_ENV } from '../../app/src/features/chalkie/be3U08StoryNeutralCanary.ts'
import { buildNeutralSbWbLessonPackage } from '../../app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts'
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
import { renderChalkieFromNeutralPackage } from '../../app/src/features/chalkie/renderChalkieFromNeutralPackage.ts'
import { resolveVerifiedSbWbCompanion } from '../../app/src/features/chalkie/resolveVerifiedSbWbCompanion.ts'
import type { TeacherChoiceSuggestion } from '../../app/src/features/chalkie/teacherChoiceSuggestions.ts'
import type {
  NllActivitySummaryRow,
  ResolvedNllComponent,
} from '../../app/src/features/nll/neutralLessonLibrary.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OVERLAY_SOURCE = path.join(
  ROOT,
  'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx',
)
const ENV_EXAMPLE = path.join(ROOT, '.env.example')
const VITE_ENV = path.join(ROOT, 'app/src/vite-env.d.ts')
const BE3_SB_PATH = path.join(
  ROOT,
  'data/phase1/big_english_3_sb/canonical/v1.json',
)
const BE3_WB_PATH = path.join(
  ROOT,
  'data/phase1/big_english_3_wb/canonical/v1.json',
)
const NLL_ONLY_TEXT = 'NLL-ONLY-STORY-SUMMARY-MUST-STAY-IN-THE-PACKAGE'

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

function assertNoWb107(value: unknown): void {
  const serialized = JSON.stringify(value)
  assert.doesNotMatch(
    serialized,
    /p\.?\s*107|106–107|106-107|Language in Action.*107/i,
    'must not contain WB p.107',
  )
}

function storyFixture() {
  const companion = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sbCanonical,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wbCanonical,
    studentBookPrintedPages: [130, 131],
  }).companion
  assert.ok(companion)
  assert.equal(
    companion.relationshipId,
    'be3_sb_wb_rel_u08_story_sb130-131_wb106',
  )
  const sbCards = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: [130, 131],
  })
  const wbCards = buildWbActivityCards({ summary: wbSummary, companion })
  assert.deepEqual(
    [...new Set(wbCards.map((card) => card.printedPage))],
    [106],
  )
  return { companion, sbCards, wbCards }
}

function openerFixture() {
  const companion = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sbCanonical,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wbCanonical,
    studentBookPrintedPages: [128, 129],
  }).companion
  assert.ok(companion)
  const sbCards = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: [128, 129],
  })
  const wbCards = buildWbActivityCards({ summary: wbSummary, companion })
  return { companion, sbCards, wbCards }
}

type StoryFixture = ReturnType<typeof storyFixture>

function allSelections(fixture: StoryFixture) {
  return {
    sbSelection: createSbActivityHandoffSelection(
      fixture.sbCards,
      createDefaultSbActivitySelection(fixture.sbCards),
    ),
    wbSelection: createWbActivityHandoffSelection(
      fixture.wbCards,
      createDefaultWbActivitySelection(fixture.wbCards),
    ),
  }
}

function activityIds(fixture: StoryFixture): string[] {
  return [
    ...fixture.sbCards.map((card) => card.references.activityId),
    ...fixture.wbCards.map((card) => card.references[0]?.activityId ?? ''),
  ].filter(Boolean)
}

function summaryRow(activityId: string): NllActivitySummaryRow {
  return {
    id: `summary-${activityId}`,
    activity_id: activityId,
    version: 1,
    summary_text: `${NLL_ONLY_TEXT}:${activityId}`,
    canonical_path: 'canonical/path.json',
    canonical_sha256: 'canonical-sha',
    activity_sha256: `activity-sha-${activityId}`,
    evidence_status: 'sufficient',
    display_status: 'hidden',
    review_state: 'experimental',
    is_preferred: true,
    provenance: { generator: 'stage6b-test' },
    created_at: '2026-10-29T00:00:00.000Z',
  }
}

function resolvedComponent(ids: readonly string[]): ResolvedNllComponent {
  return {
    component: {
      id: '3e800008-0000-4000-8000-000000000002',
      component_key: BE3_U08_STORY_NLL_COMPONENT_KEY,
      title: 'Big English 3 Unit 8 Story',
      status: 'draft',
      created_at: '2026-10-29T00:00:00.000Z',
    },
    activities: ids.map((activityId, index) => {
      const summary = summaryRow(activityId)
      return {
        activityId,
        position: index + 1,
        preferredSummary: {
          ...summary,
          staleness: 'current' as const,
          currentActivitySha256: summary.activity_sha256,
        },
      }
    }),
    curriculumAuthorityLinks: [],
    proposedSsLinks: [
      {
        id: '3e800008-0000-4000-8000-000000000201',
        component_id: '3e800008-0000-4000-8000-000000000002',
        ss_entity_kind: 'structures',
        ss_entity_id: 'big_english_3_ss_unit_08_structures_order_2',
        link_status: 'proposed',
        notes: 'proposed only',
        created_at: '2026-10-29T00:00:00.000Z',
      },
    ],
  }
}

const selectedSuggestion: TeacherChoiceSuggestion = {
  id: 'prior-story-1',
  label: 'Teacher-selected Story prior language',
  source: 'Verified prior source',
  frame: 'Selected Story prior frame.',
  whyItMayHelp: 'Test fixture.',
  caution: 'Test fixture.',
  evidenceNote: 'Verified prior evidence.',
  provenanceTag: '[PRIOR]',
}

function successfulInput(fixture = storyFixture()) {
  const selections = allSelections(fixture)
  return {
    fixture,
    selections,
    input: {
      flagEnabled: true,
      activityCards: fixture.sbCards,
      workbookActivityCards: fixture.wbCards,
      companion: fixture.companion,
      ...selections,
      selectedSuggestions: [selectedSuggestion],
      teacherAdditions: [
        {
          title: 'Teacher Story addition',
          frame: 'Teacher-added Story frame.',
          purpose: 'Teacher purpose.',
        },
      ],
      client: null,
      loadNll: async () => resolvedComponent(activityIds(fixture)),
    },
  }
}

test('Stage 6B flag defaults off and the run gate isolates exact Story series Chalkie scope', () => {
  assert.equal(isNllStoryChalkieAdapterPilotEnabled({}), false)
  assert.equal(
    isNllStoryChalkieAdapterPilotEnabled({
      [NLL_CHALKIE_STORY_ADAPTER_PILOT_ENV]: 'false',
    }),
    false,
  )
  assert.equal(
    isNllStoryChalkieAdapterPilotEnabled({
      [NLL_CHALKIE_STORY_ADAPTER_PILOT_ENV]: 'true',
    }),
    true,
  )
  assert.equal(
    shouldRunNllStoryChalkieAdapterPilot({
      flagEnabled: true,
      exactScopeEligible: true,
      chalkieRequested: true,
      seriesPackageRequested: true,
    }),
    true,
  )
  for (const key of [
    'flagEnabled',
    'exactScopeEligible',
    'chalkieRequested',
    'seriesPackageRequested',
  ] as const) {
    const gate = {
      flagEnabled: true,
      exactScopeEligible: true,
      chalkieRequested: true,
      seriesPackageRequested: true,
      [key]: false,
    }
    assert.equal(shouldRunNllStoryChalkieAdapterPilot(gate), false)
  }
})

test('Stage 6B, Stage 5 Opener, and Story canary flags remain independent', () => {
  assert.equal(
    isNllStoryChalkieAdapterPilotEnabled({
      [NLL_CHALKIE_STORY_ADAPTER_PILOT_ENV]: 'true',
      [NLL_CHALKIE_ADAPTER_PILOT_ENV]: 'false',
      [BE3_U08_STORY_NEUTRAL_CANARY_ENV]: 'true',
    }),
    true,
  )
  assert.equal(
    isNllChalkieAdapterPilotEnabled({
      [NLL_CHALKIE_STORY_ADAPTER_PILOT_ENV]: 'true',
      [NLL_CHALKIE_ADAPTER_PILOT_ENV]: 'false',
    }),
    false,
  )
  assert.equal(
    isNllStoryChalkieAdapterPilotEnabled({
      [NLL_CHALKIE_ADAPTER_PILOT_ENV]: 'true',
      [BE3_U08_STORY_NEUTRAL_CANARY_ENV]: 'true',
    }),
    false,
  )
})

test('flag off, Opener, and non-Story scopes do not load Story NLL', async () => {
  const { fixture, input } = successfulInput()
  let loadCalls = 0
  const loadNll = async (
    _client: unknown,
    componentKey: string,
  ) => {
    loadCalls += 1
    assert.equal(componentKey, BE3_U08_STORY_NLL_COMPONENT_KEY)
    return resolvedComponent(activityIds(fixture))
  }

  const flagOff = await assembleNllStoryChalkieAdapterPilot({
    ...input,
    flagEnabled: false,
    loadNll,
  })
  assert.deepEqual(flagOff.ok ? null : flagOff.reason, 'flag_off')
  assert.equal(loadCalls, 0)

  const opener = openerFixture()
  assert.equal(
    isExactBe3U08StoryNllChalkieAdapterScope({
      activityCards: opener.sbCards,
      workbookActivityCards: opener.wbCards,
      companion: opener.companion,
    }),
    false,
  )
  const openerResult = await assembleNllStoryChalkieAdapterPilot({
    ...input,
    activityCards: opener.sbCards,
    workbookActivityCards: opener.wbCards,
    companion: opener.companion,
    ...allSelections(opener as unknown as StoryFixture),
    loadNll,
  })
  assert.deepEqual(openerResult.ok ? null : openerResult.reason, 'ineligible_scope')
  assert.equal(loadCalls, 0)

  const singleLessonLike = {
    ...fixture.companion,
    workbookPrintedPages: [] as number[],
    relationshipId: 'not-the-story-relationship',
  }
  const isolated = await assembleNllStoryChalkieAdapterPilot({
    ...input,
    companion: singleLessonLike,
    loadNll,
  })
  assert.deepEqual(isolated.ok ? null : isolated.reason, 'ineligible_scope')
  assert.equal(loadCalls, 0)
})

test('exact Story scope is eligible and all-selected keeps five activities package-only', async () => {
  const { fixture, input } = successfulInput()
  assert.equal(
    isExactBe3U08StoryNllChalkieAdapterScope({
      activityCards: fixture.sbCards,
      workbookActivityCards: fixture.wbCards,
      companion: fixture.companion,
    }),
    true,
  )

  const result = await assembleNllStoryChalkieAdapterPilot(input)
  assert.equal(result.ok, true)
  if (!result.ok) return

  assert.equal(result.nlp.lesson1.selectedActivities.length, 2)
  assert.equal(result.nlp.lesson2.selectedActivities.length, 3)
  assert.equal(result.nlp.derivedKnowledge?.activitySummaries.length, 5)
  assert.equal(result.nlp.curriculumInterpretation, undefined)
  assert.match(result.handoff.detailedHandoff, /Selected Story prior frame\./)
  assert.match(result.handoff.detailedHandoff, /Teacher-added Story frame\./)
  for (const key of [
    'detailedHandoff',
    'lesson1Outline',
    'lesson1Vocabulary',
    'lesson2Outline',
    'lesson2Vocabulary',
  ] as const) {
    assert.ok(result.handoff[key].trim().length > 0, `${key} should be populated`)
  }
  assert.doesNotMatch(JSON.stringify(result.handoff), new RegExp(NLL_ONLY_TEXT))
  assert.deepEqual(result.nlp.lesson2.scope.printedPages, [106])
  assert.ok(
    result.nlp.boundaries.excludedScopes.some(
      (scope) =>
        scope.source === 'WB' &&
        scope.printedPages.includes(107),
    ),
    'NLP must record WB p.107 as excluded scope',
  )
  assert.equal(
    result.nlp.lesson2.selectedActivities.some(
      (activity) => activity.printedPage === 107,
    ),
    false,
  )
  assertNoWb107(result.handoff)
})

test('partial selection preserves SB Activity 6 and WB Activity 5 exclusions', async () => {
  const fixture = storyFixture()
  const excludedSb = fixture.sbCards.find(
    (card) => card.printedPage === 130 && card.activityNumber === '6',
  )
  const excludedWb = fixture.wbCards.find(
    (card) => card.printedPage === 106 && card.activityNumber === '5',
  )
  assert.ok(excludedSb)
  assert.ok(excludedWb)
  const sbState = setSbActivityCardSelected({
    cards: fixture.sbCards,
    state: createDefaultSbActivitySelection(fixture.sbCards),
    cardId: excludedSb.id,
    selected: false,
  })
  const wbState = setWbActivityCardSelected({
    cards: fixture.wbCards,
    state: createDefaultWbActivitySelection(fixture.wbCards),
    cardId: excludedWb.id,
    selected: false,
  })
  const result = await assembleNllStoryChalkieAdapterPilot({
    ...successfulInput(fixture).input,
    sbSelection: createSbActivityHandoffSelection(fixture.sbCards, sbState),
    wbSelection: createWbActivityHandoffSelection(fixture.wbCards, wbState),
  })
  assert.equal(result.ok, true)
  if (!result.ok) return

  assert.equal(result.nlp.lesson1.selectedActivities.length, 1)
  assert.equal(result.nlp.lesson2.selectedActivities.length, 2)
  const derivedIds = result.nlp.derivedKnowledge?.activitySummaries.map(
    (summary) => summary.activityId,
  )
  assert.equal(derivedIds?.includes(excludedSb.references.activityId), false)
  assert.equal(
    derivedIds?.includes(excludedWb.references[0]?.activityId ?? ''),
    false,
  )
  assert.doesNotMatch(
    result.handoff.detailedHandoff,
    /Listen and read\. Did Amy eat a healthy dinner\?/,
  )
  assert.doesNotMatch(result.handoff.lesson1Outline, /Activity 6|Track 154/)
  assert.doesNotMatch(result.handoff.lesson2Outline, /Activity 5|Did Amy/)
  assert.doesNotMatch(
    JSON.stringify(result.handoff),
    /Did Amy eat a burger and fries/,
  )
  assertNoWb107(result.handoff)
})

test('zero selection stays empty and never reconstructs unchecked activities', async () => {
  const fixture = storyFixture()
  let sbState = createDefaultSbActivitySelection(fixture.sbCards)
  for (const card of fixture.sbCards) {
    sbState = setSbActivityCardSelected({
      cards: fixture.sbCards,
      state: sbState,
      cardId: card.id,
      selected: false,
    })
  }
  let wbState = createDefaultWbActivitySelection(fixture.wbCards)
  for (const card of fixture.wbCards) {
    wbState = setWbActivityCardSelected({
      cards: fixture.wbCards,
      state: wbState,
      cardId: card.id,
      selected: false,
    })
  }
  const result = await assembleNllStoryChalkieAdapterPilot({
    ...successfulInput(fixture).input,
    sbSelection: createSbActivityHandoffSelection(fixture.sbCards, sbState),
    wbSelection: createWbActivityHandoffSelection(fixture.wbCards, wbState),
  })
  assert.equal(result.ok, true)
  if (!result.ok) return

  assert.equal(result.nlp.lesson1.selectedActivities.length, 0)
  assert.equal(result.nlp.lesson2.selectedActivities.length, 0)
  assert.equal(result.nlp.derivedKnowledge?.activitySummaries.length, 0)
  assert.equal(result.nlp.boundaries.reconstructExcludedActivities, false)
  for (const card of [...fixture.sbCards, ...fixture.wbCards]) {
    assert.doesNotMatch(
      result.handoff.detailedHandoff,
      new RegExp(card.verifiedWording.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    )
  }
  assertNoWb107(result.handoff)
})

test('NLL, package, and renderer failures return bounded fallback results', async () => {
  const { input } = successfulInput()
  const loadFailure = await assembleNllStoryChalkieAdapterPilot({
    ...input,
    loadNll: async () => {
      throw new Error('load failed')
    },
  })
  assert.deepEqual(loadFailure.ok ? null : loadFailure.reason, 'load_error')

  const missing = await assembleNllStoryChalkieAdapterPilot({
    ...input,
    loadNll: async () => null,
  })
  assert.deepEqual(missing.ok ? null : missing.reason, 'missing_component')

  const packageFailure = await assembleNllStoryChalkieAdapterPilot({
    ...input,
    buildNeutralPackage: (() => {
      throw new Error('package failed')
    }) as typeof buildNeutralSbWbLessonPackage,
  })
  assert.deepEqual(packageFailure.ok ? null : packageFailure.reason, 'package_error')

  const rendererFailure = await assembleNllStoryChalkieAdapterPilot({
    ...input,
    renderNeutral: (() => {
      throw new Error('renderer failed')
    }) as typeof renderChalkieFromNeutralPackage,
  })
  assert.deepEqual(rendererFailure.ok ? null : rendererFailure.reason, 'renderer_error')

  const missingClient = await assembleNllStoryChalkieAdapterPilot({
    ...input,
    loadNll: undefined,
    client: null,
  })
  assert.deepEqual(missingClient.ok ? null : missingClient.reason, 'missing_client')
})

test('Story remains BI-absent even when Opener BI fixtures exist nearby', async () => {
  const { input } = successfulInput()
  const result = await assembleNllStoryChalkieAdapterPilot(input)
  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.equal(result.nlp.curriculumInterpretation, undefined)
  assert.doesNotMatch(JSON.stringify(result.handoff), /MUST-NOT-ENTER-CHALKIE/)
  assert.doesNotMatch(JSON.stringify(result.nlp), /phase2_interpretation/)
})

test('request identity and apply guards prevent stale Stage 6B results', () => {
  const fixture = storyFixture()
  const selections = allSelections(fixture)
  const base = {
    activityCards: fixture.sbCards,
    workbookActivityCards: fixture.wbCards,
    companion: fixture.companion,
    ...selections,
    selectedSuggestions: [selectedSuggestion],
    teacherAdditions: [],
  }
  const requestKey = nllStoryChalkieAdapterRequestKey(base)
  const changedKey = nllStoryChalkieAdapterRequestKey({
    ...base,
    selectedSuggestions: [],
  })
  assert.notEqual(requestKey, changedKey)
  assert.equal(
    shouldApplyNllStoryChalkieAdapterPilotResult({
      requestId: 3,
      latestRequestId: 3,
      overlayOpen: true,
      requestKey,
      currentRequestKey: requestKey,
      preparedOutputKind: 'chalkie',
    }),
    true,
  )
  assert.equal(
    shouldApplyNllStoryChalkieAdapterPilotResult({
      requestId: 3,
      latestRequestId: 4,
      overlayOpen: true,
      requestKey,
      currentRequestKey: requestKey,
      preparedOutputKind: 'chalkie',
    }),
    false,
  )
  assert.equal(
    shouldApplyNllStoryChalkieAdapterPilotResult({
      requestId: 3,
      latestRequestId: 3,
      overlayOpen: true,
      requestKey,
      currentRequestKey: changedKey,
      preparedOutputKind: 'chalkie',
    }),
    false,
  )
  assert.equal(
    shouldApplyNllStoryChalkieAdapterPilotResult({
      requestId: 3,
      latestRequestId: 3,
      overlayOpen: false,
      requestKey,
      currentRequestKey: requestKey,
      preparedOutputKind: 'chalkie',
    }),
    false,
  )
  const requestIdRef = { current: 3 }
  invalidateNllStoryChalkieAdapterPilotRequest({ requestIdRef })
  assert.equal(requestIdRef.current, 4)
})

test('Create-a-prompt is wired to Stage 6B with Story fallback and no Story BI framing', () => {
  const overlay = fs.readFileSync(OVERLAY_SOURCE, 'utf8')
  const envExample = fs.readFileSync(ENV_EXAMPLE, 'utf8')
  const viteEnv = fs.readFileSync(VITE_ENV, 'utf8')
  assert.match(
    envExample,
    /^VITE_NLL_CHALKIE_STORY_ADAPTER_PILOT=false$/m,
  )
  assert.match(viteEnv, /VITE_NLL_CHALKIE_STORY_ADAPTER_PILOT/)
  assert.match(overlay, /assembleNllStoryChalkieAdapterPilot\(\{/)
  assert.match(overlay, /shouldRunNllStoryChalkieAdapterPilot\(/)
  assert.match(overlay, /buildExistingChalkieOutput\(biInputs\)/)
  assert.match(
    overlay,
    /Story remains BI-absent: do not apply Opener BI framing/,
  )
  assert.match(overlay, /assembled: result\.handoff\.detailedHandoff/)
  assert.doesNotMatch(
    overlay,
    /assembleNllStoryChalkieAdapterPilot[\s\S]{0,800}applyOpenerBiFramingToHandoff/,
  )
})
