/**
 * Focused CLIL-C adapter pilot tests.
 * Run: npx tsx --test scripts/tests/nllClilPeChalkieAdapterPilot.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { buildNeutralSbWbLessonPackage } from '../../app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts'
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
  assembleNllClilPeChalkieAdapterPilot,
  BE3_U08_CLIL_PE_NLL_COMPONENT_KEY,
  BE3_U08_CLIL_PE_SERIES_RELATIONSHIP_ID,
  isExactBe3U08ClilPeNllChalkieAdapterScope,
  isNllClilPeChalkieAdapterPilotEnabled,
  NLL_CHALKIE_CLIL_PE_ADAPTER_PILOT_ENV,
  nllClilPeChalkieAdapterRequestKey,
  shouldApplyNllClilPeChalkieAdapterPilotResult,
  shouldRunNllClilPeChalkieAdapterPilot,
} from '../../app/src/features/chalkie/nllClilPeChalkieAdapterPilot.ts'
import { BE3_U08_SB134_135_WB109_110 } from '../../app/src/features/chalkie/verifiedSbWbCompanions.ts'
import { BE3_U08_SB136_137_WB111_112 } from '../../app/src/features/chalkie/verifiedSbWbCompanions.ts'
import type { VerifiedSbWbCompanion } from '../../app/src/features/chalkie/resolveVerifiedSbWbCompanion.ts'
import type { ResolvedNllComponent } from '../../app/src/features/nll/neutralLessonLibrary.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const sbCanonical = JSON.parse(
  fs.readFileSync(
    path.join(ROOT, 'data/phase1/big_english_3_sb/canonical/v1.json'),
    'utf8',
  ),
) as Record<string, unknown>
const wbCanonical = JSON.parse(
  fs.readFileSync(
    path.join(ROOT, 'data/phase1/big_english_3_wb/canonical/v1.json'),
    'utf8',
  ),
) as Record<string, unknown>

function summary(catalogBookId: string, raw: Record<string, unknown>): BatchJsonSummary {
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
    raw,
  }
}

const sbCards = buildSbActivityCards({
  summary: summary('big_english_3_sb', sbCanonical),
  activeLessonPrintedPages: [134, 135],
})
const wbCards = buildWbActivityCards({
  summary: summary('big_english_3_wb', wbCanonical),
  companion: BE3_U08_SB134_135_WB109_110,
})

const clilCompanion: VerifiedSbWbCompanion = {
  ...BE3_U08_SB134_135_WB109_110,
  source: 'curated_verified',
}
const grammarCompanion: VerifiedSbWbCompanion = {
  ...BE3_U08_SB136_137_WB111_112,
  source: 'curated_verified',
}

const CLIL_ORDER = [
  'bep3_sb_act_08_13',
  'bep3_sb_act_08_14',
  'bep3_sb_act_08_15',
  'bep3_sb_act_08_16',
  'bep3_sb_act_08_17',
  'bep3_sb_act_08_18',
  'bep_3_wb_act_109_11',
  'bep_3_wb_act_109_12',
  'bep_3_wb_act_110_13',
  'bep_3_wb_act_110_14',
  'bep_3_wb_act_110_tb',
] as const

function mockResolvedClil(): ResolvedNllComponent {
  return {
    component: {
      id: '3e800008-0000-4000-8000-000000000005',
      component_key: BE3_U08_CLIL_PE_NLL_COMPONENT_KEY,
      title: 'Big English 3 Unit 8 Content Connection / P.E.',
      status: 'draft',
      created_at: '2026-10-30T00:00:00.000Z',
    },
    activities: CLIL_ORDER.map((activityId, index) => ({
      activityId,
      position: index + 1,
      preferredSummary: {
        id: `${activityId}_summary`,
        activity_id: activityId,
        version: 1,
        summary_text: `HIDDEN-SUMMARY-${activityId}`,
        canonical_path: 'path',
        canonical_sha256: 'hash',
        activity_sha256: 'fp',
        evidence_status: 'sufficient',
        display_status: 'hidden',
        review_state: 'experimental',
        is_preferred: true,
        provenance: {},
        created_at: '2026-10-30T00:00:00.000Z',
      },
    })),
    proposedSsLinks: [],
  } as unknown as ResolvedNllComponent
}

test('CLIL-C flag defaults off and exact scope validates eleven activities', () => {
  assert.equal(isNllClilPeChalkieAdapterPilotEnabled({}), false)
  assert.equal(
    isNllClilPeChalkieAdapterPilotEnabled({
      [NLL_CHALKIE_CLIL_PE_ADAPTER_PILOT_ENV]: 'false',
    }),
    false,
  )
  assert.equal(
    isNllClilPeChalkieAdapterPilotEnabled({
      [NLL_CHALKIE_CLIL_PE_ADAPTER_PILOT_ENV]: 'true',
    }),
    true,
  )
  assert.equal(
    isExactBe3U08ClilPeNllChalkieAdapterScope({
      activityCards: sbCards,
      workbookActivityCards: wbCards,
      companion: clilCompanion,
    }),
    true,
  )
  assert.equal(
    isExactBe3U08ClilPeNllChalkieAdapterScope({
      activityCards: sbCards,
      workbookActivityCards: wbCards,
      companion: grammarCompanion,
    }),
    false,
  )
  assert.equal(
    shouldRunNllClilPeChalkieAdapterPilot({
      flagEnabled: true,
      exactScopeEligible: true,
      chalkieRequested: true,
      seriesPackageRequested: true,
    }),
    true,
  )
  assert.equal(
    shouldRunNllClilPeChalkieAdapterPilot({
      flagEnabled: true,
      exactScopeEligible: true,
      chalkieRequested: true,
      seriesPackageRequested: false,
    }),
    false,
  )
})

test('CLIL-C assembles package-level NLL without leaking summary prose; stale guard works', async () => {
  const sbSelection = createSbActivityHandoffSelection(
    sbCards,
    createDefaultSbActivitySelection(sbCards),
  )
  const wbSelection = createWbActivityHandoffSelection(
    wbCards,
    createDefaultWbActivitySelection(wbCards),
  )
  const result = await assembleNllClilPeChalkieAdapterPilot({
    flagEnabled: true,
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion: clilCompanion,
    sbSelection,
    wbSelection,
    client: { from: () => ({}) } as never,
    loadNll: async () => mockResolvedClil(),
  })
  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.equal(result.nlp.identity.relationshipId, BE3_U08_CLIL_PE_SERIES_RELATIONSHIP_ID)
  assert.ok(result.nlp.derivedKnowledge)
  assert.equal(result.nlp.curriculumInterpretation, undefined)
  assert.doesNotMatch(result.handoff.detailedHandoff, /HIDDEN-SUMMARY-/)
  assert.match(result.handoff.detailedHandoff, /Audio 157/)
  assert.match(result.handoff.detailedHandoff, /Audio 158/)
  assert.equal(result.handoff.stableSeriesReference, 'be3-sb-wb-u08-p134-135-wb109-110')

  const requestKey = nllClilPeChalkieAdapterRequestKey({
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion: clilCompanion,
    sbSelection,
    wbSelection,
    selectedSuggestions: [],
    teacherAdditions: [],
  })
  assert.equal(
    shouldApplyNllClilPeChalkieAdapterPilotResult({
      requestId: 1,
      latestRequestId: 1,
      overlayOpen: true,
      requestKey,
      currentRequestKey: requestKey,
      preparedOutputKind: 'chalkie',
    }),
    true,
  )
  assert.equal(
    shouldApplyNllClilPeChalkieAdapterPilotResult({
      requestId: 1,
      latestRequestId: 2,
      overlayOpen: true,
      requestKey,
      currentRequestKey: requestKey,
      preparedOutputKind: 'chalkie',
    }),
    false,
  )
})

test('CLIL-C falls back on flag-off, wrong scope, and incomplete membership', async () => {
  const sbSelection = createSbActivityHandoffSelection(
    sbCards,
    createDefaultSbActivitySelection(sbCards),
  )
  const wbSelection = createWbActivityHandoffSelection(
    wbCards,
    createDefaultWbActivitySelection(wbCards),
  )
  const flagOff = await assembleNllClilPeChalkieAdapterPilot({
    flagEnabled: false,
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion: clilCompanion,
    sbSelection,
    wbSelection,
    client: { from: () => ({}) } as never,
    loadNll: async () => mockResolvedClil(),
  })
  assert.equal(flagOff.ok, false)
  if (!flagOff.ok) assert.equal(flagOff.reason, 'flag_off')

  const wrongScope = await assembleNllClilPeChalkieAdapterPilot({
    flagEnabled: true,
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion: grammarCompanion,
    sbSelection,
    wbSelection,
    client: { from: () => ({}) } as never,
    loadNll: async () => mockResolvedClil(),
  })
  assert.equal(wrongScope.ok, false)
  if (!wrongScope.ok) assert.equal(wrongScope.reason, 'ineligible_scope')

  const incomplete = await assembleNllClilPeChalkieAdapterPilot({
    flagEnabled: true,
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion: clilCompanion,
    sbSelection,
    wbSelection,
    client: { from: () => ({}) } as never,
    loadNll: async () => {
      const resolved = mockResolvedClil()
      return {
        ...resolved,
        activities: resolved.activities.slice(0, 5),
      }
    },
  })
  assert.equal(incomplete.ok, false)
  if (!incomplete.ok) assert.equal(incomplete.reason, 'incomplete_component')
})

test('CLIL-C stays isolated from Grammar package identity', () => {
  const grammarSbCards = buildSbActivityCards({
    summary: summary('big_english_3_sb', sbCanonical),
    activeLessonPrintedPages: [136, 137],
  })
  const grammarWbCards = buildWbActivityCards({
    summary: summary('big_english_3_wb', wbCanonical),
    companion: BE3_U08_SB136_137_WB111_112,
  })
  const grammarPackage = buildNeutralSbWbLessonPackage({
    companion: grammarCompanion,
    sbSelection: createSbActivityHandoffSelection(
      grammarSbCards,
      createDefaultSbActivitySelection(grammarSbCards),
    ),
    wbSelection: createWbActivityHandoffSelection(
      grammarWbCards,
      createDefaultWbActivitySelection(grammarWbCards),
    ),
  })
  assert.equal(grammarPackage.identity.componentKey, 'grammar')
  assert.notEqual(
    grammarPackage.identity.relationshipId,
    BE3_U08_CLIL_PE_SERIES_RELATIONSHIP_ID,
  )
})

test('Create-a-prompt is wired to CLIL-C with sb_only fallback and no CLIL BI framing', () => {
  const overlay = fs.readFileSync(
    path.join(ROOT, 'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx'),
    'utf8',
  )
  const envExample = fs.readFileSync(path.join(ROOT, '.env.example'), 'utf8')
  const viteEnv = fs.readFileSync(path.join(ROOT, 'app/src/vite-env.d.ts'), 'utf8')
  assert.match(
    envExample,
    /^VITE_NLL_CHALKIE_CLIL_PE_ADAPTER_PILOT=false$/m,
  )
  assert.match(viteEnv, /VITE_NLL_CHALKIE_CLIL_PE_ADAPTER_PILOT/)
  assert.match(overlay, /assembleNllClilPeChalkieAdapterPilot\(\{/)
  assert.match(overlay, /shouldRunNllClilPeChalkieAdapterPilot\(/)
  assert.match(overlay, /clilPeSeriesPackageRequested/)
  assert.match(
    overlay,
    /CLIL remains BI-absent: do not apply Opener BI framing/,
  )
  assert.match(
    overlay,
    /CLIL-C failure: retain current sb_only path with captured selections/,
  )
  assert.doesNotMatch(
    overlay,
    /assembleNllClilPeChalkieAdapterPilot[\s\S]{0,800}applyOpenerBiFramingToHandoff/,
  )
})
