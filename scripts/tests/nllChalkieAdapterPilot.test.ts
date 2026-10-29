/**
 * Stage 5 NLL -> NLP -> Chalkie adapter pilot tests.
 * Run: node --test scripts/tests/nllChalkieAdapterPilot.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  NLL_CHALKIE_ADAPTER_PILOT_ENV,
  assembleNllChalkieAdapterPilot,
  invalidateNllChalkieAdapterPilotRequest,
  isExactBe3U08OpenerNllChalkieAdapterScope,
  isNllChalkieAdapterPilotEnabled,
  nllChalkieAdapterRequestKey,
  shouldApplyNllChalkieAdapterPilotResult,
  shouldRunNllChalkieAdapterPilot,
} from '../../app/src/features/chalkie/nllChalkieAdapterPilot.ts'
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
const BE3_SB_PATH = path.join(
  ROOT,
  'data/phase1/big_english_3_sb/canonical/v1.json',
)
const BE3_WB_PATH = path.join(
  ROOT,
  'data/phase1/big_english_3_wb/canonical/v1.json',
)
const NLL_ONLY_TEXT = 'NLL-ONLY-SUMMARY-MUST-STAY-IN-THE-PACKAGE'

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

type OpenerFixture = ReturnType<typeof openerFixture>

function allSelections(fixture: OpenerFixture) {
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

function activityIds(fixture: OpenerFixture): string[] {
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
    provenance: { generator: 'stage5-test' },
    created_at: '2026-10-29T00:00:00.000Z',
  }
}

function resolvedComponent(ids: readonly string[]): ResolvedNllComponent {
  return {
    component: {
      id: '3e800008-0000-4000-8000-000000000001',
      component_key: 'be3-u08-opener',
      title: 'Opener',
      status: 'available',
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
    proposedSsLinks: [],
  }
}

const selectedSuggestion: TeacherChoiceSuggestion = {
  id: 'prior-1',
  label: 'Teacher-selected prior language',
  source: 'Verified prior source',
  frame: 'Selected prior frame.',
  whyItMayHelp: 'Test fixture.',
  caution: 'Test fixture.',
  evidenceNote: 'Verified prior evidence.',
  provenanceTag: '[PRIOR]',
}

function successfulInput(fixture = openerFixture()) {
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
          title: 'Teacher addition',
          frame: 'Teacher-added frame.',
          purpose: 'Teacher purpose.',
        },
      ],
      client: null,
      loadNll: async () => resolvedComponent(activityIds(fixture)),
    },
  }
}

test('Stage 5 flag defaults off and the run gate isolates exact series Chalkie scope', () => {
  assert.equal(isNllChalkieAdapterPilotEnabled({}), false)
  assert.equal(
    isNllChalkieAdapterPilotEnabled({
      [NLL_CHALKIE_ADAPTER_PILOT_ENV]: 'false',
    }),
    false,
  )
  assert.equal(
    isNllChalkieAdapterPilotEnabled({
      [NLL_CHALKIE_ADAPTER_PILOT_ENV]: 'true',
    }),
    true,
  )
  assert.equal(
    shouldRunNllChalkieAdapterPilot({
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
    assert.equal(shouldRunNllChalkieAdapterPilot(gate), false)
  }
})

test('flag off and out-of-scope requests do not load NLL', async () => {
  const { fixture, input } = successfulInput()
  let loadCalls = 0
  const loadNll = async () => {
    loadCalls += 1
    return resolvedComponent(activityIds(fixture))
  }
  const flagOff = await assembleNllChalkieAdapterPilot({
    ...input,
    flagEnabled: false,
    loadNll,
  })
  assert.deepEqual(flagOff.ok ? null : flagOff.reason, 'flag_off')
  assert.equal(loadCalls, 0)

  const wrongCompanion = {
    ...fixture.companion,
    relationshipId: 'be3_sb_wb_rel_u08_story_sb130-131_wb106',
    studentBookPrintedPages: [130, 131],
    workbookPrintedPages: [106],
  }
  assert.equal(
    isExactBe3U08OpenerNllChalkieAdapterScope({
      activityCards: fixture.sbCards,
      workbookActivityCards: fixture.wbCards,
      companion: wrongCompanion,
    }),
    false,
  )
  const outOfScope = await assembleNllChalkieAdapterPilot({
    ...input,
    companion: wrongCompanion,
    loadNll,
  })
  assert.deepEqual(outOfScope.ok ? null : outOfScope.reason, 'ineligible_scope')
  assert.equal(loadCalls, 0)
})

test('all selected produces all five artifacts, preserves teacher input, and keeps NLL prose package-only', async () => {
  const { input } = successfulInput()
  const result = await assembleNllChalkieAdapterPilot(input)
  assert.equal(result.ok, true)
  if (!result.ok) return

  assert.equal(result.nlp.lesson1.selectedActivities.length, 5)
  assert.equal(result.nlp.lesson2.selectedActivities.length, 4)
  assert.equal(result.nlp.derivedKnowledge?.activitySummaries.length, 9)
  assert.match(result.handoff.detailedHandoff, /Selected prior frame\./)
  assert.match(result.handoff.detailedHandoff, /Teacher-added frame\./)
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
})

test('partial selection preserves the SB p.129 Activity 4 and WB p.105 Activity 3 exclusions', async () => {
  const fixture = openerFixture()
  const excludedSb = fixture.sbCards.find(
    (card) => card.printedPage === 129 && card.activityNumber === '4',
  )
  const excludedWb = fixture.wbCards.find(
    (card) => card.printedPage === 105 && card.activityNumber === '3',
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
  const result = await assembleNllChalkieAdapterPilot({
    ...successfulInput(fixture).input,
    sbSelection: createSbActivityHandoffSelection(fixture.sbCards, sbState),
    wbSelection: createWbActivityHandoffSelection(fixture.wbCards, wbState),
  })
  assert.equal(result.ok, true)
  if (!result.ok) return

  assert.equal(result.nlp.lesson1.selectedActivities.length, 4)
  assert.equal(result.nlp.lesson2.selectedActivities.length, 3)
  const derivedIds = result.nlp.derivedKnowledge?.activitySummaries.map(
    (summary) => summary.activityId,
  )
  assert.equal(derivedIds?.includes(excludedSb.references.activityId), false)
  assert.equal(derivedIds?.includes(excludedWb.references[0]?.activityId ?? ''), false)
  assert.doesNotMatch(
    result.handoff.detailedHandoff,
    /Listen and sing\. How does Zach feel today\?/,
  )
  assert.doesNotMatch(result.handoff.lesson1Outline, /Activity 4:/)
  assert.doesNotMatch(result.handoff.lesson2Outline, /Activity 3:/)
})

test('zero selection stays empty and never reconstructs unchecked activities', async () => {
  const fixture = openerFixture()
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
  const result = await assembleNllChalkieAdapterPilot({
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
})

test('NLL, package, and renderer failures return bounded fallback results', async () => {
  const { input } = successfulInput()
  const loadFailure = await assembleNllChalkieAdapterPilot({
    ...input,
    loadNll: async () => {
      throw new Error('load failed')
    },
  })
  assert.deepEqual(loadFailure.ok ? null : loadFailure.reason, 'load_error')

  const missing = await assembleNllChalkieAdapterPilot({
    ...input,
    loadNll: async () => null,
  })
  assert.deepEqual(missing.ok ? null : missing.reason, 'missing_component')

  const packageFailure = await assembleNllChalkieAdapterPilot({
    ...input,
    buildNeutralPackage: (() => {
      throw new Error('package failed')
    }) as typeof buildNeutralSbWbLessonPackage,
  })
  assert.deepEqual(packageFailure.ok ? null : packageFailure.reason, 'package_error')

  const rendererFailure = await assembleNllChalkieAdapterPilot({
    ...input,
    renderNeutral: (() => {
      throw new Error('renderer failed')
    }) as typeof renderChalkieFromNeutralPackage,
  })
  assert.deepEqual(rendererFailure.ok ? null : rendererFailure.reason, 'renderer_error')

  const missingClient = await assembleNllChalkieAdapterPilot({
    ...input,
    loadNll: undefined,
    client: null,
  })
  assert.deepEqual(missingClient.ok ? null : missingClient.reason, 'missing_client')
})

test('D022 BI remains interpretation-only and BI-absent behavior remains valid', async () => {
  const { input } = successfulInput()
  const withoutBi = await assembleNllChalkieAdapterPilot(input)
  assert.equal(withoutBi.ok, true)
  if (!withoutBi.ok) return
  assert.equal(withoutBi.nlp.curriculumInterpretation, undefined)

  const withBi = await assembleNllChalkieAdapterPilot({
    ...input,
    bookIntelligenceUnit: {
      unitId: 'big_english_3_sb_unit_08',
      unitNumber: '8',
      title: 'Healthy Living',
      vocabulary: 'MUST-NOT-ENTER-CHALKIE-VOCAB',
      grammarStructures: 'MUST-NOT-ENTER-CHALKIE-GRAMMAR',
      communicativeFunctions: 'Talk about healthy and unhealthy activities.',
      learningOutcomes: 'I can talk about healthy living.',
      learningOutcomesProvenance: 'ai_inferred',
      clilCulture: 'MUST-NOT-ENTER-CHALKIE-CLIL',
      values: 'MUST-NOT-ENTER-CHALKIE-VALUES',
      phonics: 'MUST-NOT-ENTER-CHALKIE-PHONICS',
    },
    biArtifactRef: 'interpretations/be3-u08-bi.json',
  })
  assert.equal(withBi.ok, true)
  if (!withBi.ok) return
  assert.equal(
    withBi.nlp.curriculumInterpretation?.bookIntelligence.layer,
    'phase2_interpretation',
  )
  assert.equal(
    withBi.nlp.boundaries.bookIntelligenceMayBecomeSourceEvidence,
    false,
  )
  assert.doesNotMatch(JSON.stringify(withBi.handoff), /MUST-NOT-ENTER-CHALKIE/)
})

test('request identity and apply guards prevent stale Stage 5 results', () => {
  const fixture = openerFixture()
  const selections = allSelections(fixture)
  const base = {
    activityCards: fixture.sbCards,
    workbookActivityCards: fixture.wbCards,
    companion: fixture.companion,
    ...selections,
    selectedSuggestions: [selectedSuggestion],
    teacherAdditions: [],
  }
  const requestKey = nllChalkieAdapterRequestKey(base)
  const changedKey = nllChalkieAdapterRequestKey({
    ...base,
    selectedSuggestions: [],
  })
  assert.notEqual(requestKey, changedKey)
  assert.equal(
    shouldApplyNllChalkieAdapterPilotResult({
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
    shouldApplyNllChalkieAdapterPilotResult({
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
    shouldApplyNllChalkieAdapterPilotResult({
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
    shouldApplyNllChalkieAdapterPilotResult({
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
  invalidateNllChalkieAdapterPilotRequest({ requestIdRef })
  assert.equal(requestIdRef.current, 4)
})

test('Create-a-prompt is wired to Stage 5 while retaining existing fallback and all five artifacts', () => {
  const overlay = fs.readFileSync(OVERLAY_SOURCE, 'utf8')
  const envExample = fs.readFileSync(ENV_EXAMPLE, 'utf8')
  assert.match(
    envExample,
    /^VITE_NLL_CHALKIE_ADAPTER_PILOT=false$/m,
  )
  assert.match(overlay, /assembleNllChalkieAdapterPilot\(\{/)
  assert.match(overlay, /buildExistingChalkieOutput\(biInputs\)/)
  assert.match(overlay, /applyOpenerBiFramingToHandoff\(/)
  assert.match(overlay, /assembled: handoff\.detailedHandoff/)
  assert.match(overlay, /setBe3SeriesHandoff\(input\.be3Handoff\)/)
  assert.match(overlay, /lesson1Outline/)
  assert.match(overlay, /lesson1Vocabulary/)
  assert.match(overlay, /lesson2Outline/)
  assert.match(overlay, /lesson2Vocabulary/)
})
