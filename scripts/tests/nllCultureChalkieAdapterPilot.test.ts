/**
 * Focused Culture-C adapter pilot tests.
 * Run: npx tsx --test scripts/tests/nllCultureChalkieAdapterPilot.test.ts
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
  assembleNllCultureChalkieAdapterPilot,
  BE3_U08_CULTURE_NLL_COMPONENT_KEY,
  BE3_U08_CULTURE_SERIES_RELATIONSHIP_ID,
  isExactBe3U08CultureNllChalkieAdapterScope,
  isNllCultureChalkieAdapterPilotEnabled,
  NLL_CHALKIE_CULTURE_ADAPTER_PILOT_ENV,
  nllCultureChalkieAdapterRequestKey,
  shouldApplyNllCultureChalkieAdapterPilotResult,
  shouldRunNllCultureChalkieAdapterPilot,
} from '../../app/src/features/chalkie/nllCultureChalkieAdapterPilot.ts'
import { BE3_U08_SB134_135_WB109_110 } from '../../app/src/features/chalkie/verifiedSbWbCompanions.ts'
import { BE3_U08_SB138_139_WB113_114 } from '../../app/src/features/chalkie/verifiedSbWbCompanions.ts'
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
  activeLessonPrintedPages: [138, 139],
})
const wbCards = buildWbActivityCards({
  summary: summary('big_english_3_wb', wbCanonical),
  companion: BE3_U08_SB138_139_WB113_114,
})

const cultureCompanion: VerifiedSbWbCompanion = {
  ...BE3_U08_SB138_139_WB113_114,
  source: 'curated_verified',
}
const clilCompanion: VerifiedSbWbCompanion = {
  ...BE3_U08_SB134_135_WB109_110,
  source: 'curated_verified',
}

const CULTURE_ORDER = [
  'bep3_sb_act_08_24',
  'bep3_sb_act_08_25',
  'bep3_sb_act_08_26',
  'bep3_sb_act_08_27',
  'bep_3_wb_act_113_20',
  'bep_3_wb_act_113_21',
  'bep_3_wb_act_114_22',
  'bep_3_wb_act_114_23',
  'bep_3_wb_act_114_tb',
] as const

function mockResolvedCulture(): ResolvedNllComponent {
  return {
    component: {
      id: '3e800008-0000-4000-8000-000000000006',
      component_key: BE3_U08_CULTURE_NLL_COMPONENT_KEY,
      title: 'Big English 3 Unit 8 Culture Connection',
      status: 'draft',
      created_at: '2026-10-30T00:00:00.000Z',
    },
    activities: CULTURE_ORDER.map((activityId, index) => ({
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

test('Culture-C flag defaults off and exact scope validates nine activities', () => {
  assert.equal(isNllCultureChalkieAdapterPilotEnabled({}), false)
  assert.equal(
    isNllCultureChalkieAdapterPilotEnabled({
      [NLL_CHALKIE_CULTURE_ADAPTER_PILOT_ENV]: 'false',
    }),
    false,
  )
  assert.equal(
    isNllCultureChalkieAdapterPilotEnabled({
      [NLL_CHALKIE_CULTURE_ADAPTER_PILOT_ENV]: 'true',
    }),
    true,
  )
  assert.equal(
    isExactBe3U08CultureNllChalkieAdapterScope({
      activityCards: sbCards,
      workbookActivityCards: wbCards,
      companion: cultureCompanion,
    }),
    true,
  )
  assert.equal(
    isExactBe3U08CultureNllChalkieAdapterScope({
      activityCards: sbCards,
      workbookActivityCards: wbCards,
      companion: clilCompanion,
    }),
    false,
  )
  assert.equal(
    shouldRunNllCultureChalkieAdapterPilot({
      flagEnabled: true,
      exactScopeEligible: true,
      chalkieRequested: true,
      seriesPackageRequested: true,
    }),
    true,
  )
  assert.equal(
    shouldRunNllCultureChalkieAdapterPilot({
      flagEnabled: true,
      exactScopeEligible: true,
      chalkieRequested: true,
      seriesPackageRequested: false,
    }),
    false,
  )
})

test('Culture-C assembles package-level NLL without leaking summary prose; stale guard works', async () => {
  const sbSelection = createSbActivityHandoffSelection(
    sbCards,
    createDefaultSbActivitySelection(sbCards),
  )
  const wbSelection = createWbActivityHandoffSelection(
    wbCards,
    createDefaultWbActivitySelection(wbCards),
  )
  const result = await assembleNllCultureChalkieAdapterPilot({
    flagEnabled: true,
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion: cultureCompanion,
    sbSelection,
    wbSelection,
    client: { from: () => ({}) } as never,
    loadNll: async () => mockResolvedCulture(),
  })
  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.equal(result.nlp.identity.relationshipId, BE3_U08_CULTURE_SERIES_RELATIONSHIP_ID)
  assert.ok(result.nlp.derivedKnowledge)
  assert.equal(result.nlp.curriculumInterpretation, undefined)
  assert.doesNotMatch(result.handoff.detailedHandoff, /HIDDEN-SUMMARY-/)
  assert.match(result.handoff.detailedHandoff, /Audio 160/)
  assert.match(result.handoff.detailedHandoff, /Audio 161/)
  assert.equal(result.handoff.stableSeriesReference, 'be3-sb-wb-u08-p138-139-wb113-114')

  const requestKey = nllCultureChalkieAdapterRequestKey({
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion: cultureCompanion,
    sbSelection,
    wbSelection,
    selectedSuggestions: [],
    teacherAdditions: [],
  })
  assert.equal(
    shouldApplyNllCultureChalkieAdapterPilotResult({
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
    shouldApplyNllCultureChalkieAdapterPilotResult({
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

test('Culture-C falls back on flag-off, wrong scope, and incomplete membership', async () => {
  const sbSelection = createSbActivityHandoffSelection(
    sbCards,
    createDefaultSbActivitySelection(sbCards),
  )
  const wbSelection = createWbActivityHandoffSelection(
    wbCards,
    createDefaultWbActivitySelection(wbCards),
  )
  const flagOff = await assembleNllCultureChalkieAdapterPilot({
    flagEnabled: false,
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion: cultureCompanion,
    sbSelection,
    wbSelection,
    client: { from: () => ({}) } as never,
    loadNll: async () => mockResolvedCulture(),
  })
  assert.equal(flagOff.ok, false)
  if (!flagOff.ok) assert.equal(flagOff.reason, 'flag_off')

  const wrongScope = await assembleNllCultureChalkieAdapterPilot({
    flagEnabled: true,
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion: clilCompanion,
    sbSelection,
    wbSelection,
    client: { from: () => ({}) } as never,
    loadNll: async () => mockResolvedCulture(),
  })
  assert.equal(wrongScope.ok, false)
  if (!wrongScope.ok) assert.equal(wrongScope.reason, 'ineligible_scope')

  const incomplete = await assembleNllCultureChalkieAdapterPilot({
    flagEnabled: true,
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion: cultureCompanion,
    sbSelection,
    wbSelection,
    client: { from: () => ({}) } as never,
    loadNll: async () => {
      const resolved = mockResolvedCulture()
      return {
        ...resolved,
        activities: resolved.activities.slice(0, 4),
      }
    },
  })
  assert.equal(incomplete.ok, false)
  if (!incomplete.ok) assert.equal(incomplete.reason, 'incomplete_component')
})

test('Culture-C stays isolated from CLIL package identity', () => {
  const clilSbCards = buildSbActivityCards({
    summary: summary('big_english_3_sb', sbCanonical),
    activeLessonPrintedPages: [134, 135],
  })
  const clilWbCards = buildWbActivityCards({
    summary: summary('big_english_3_wb', wbCanonical),
    companion: BE3_U08_SB134_135_WB109_110,
  })
  const clilPackage = buildNeutralSbWbLessonPackage({
    companion: clilCompanion,
    sbSelection: createSbActivityHandoffSelection(
      clilSbCards,
      createDefaultSbActivitySelection(clilSbCards),
    ),
    wbSelection: createWbActivityHandoffSelection(
      clilWbCards,
      createDefaultWbActivitySelection(clilWbCards),
    ),
  })
  assert.equal(clilPackage.identity.componentKey, 'clil_pe')
  assert.notEqual(
    clilPackage.identity.relationshipId,
    BE3_U08_CULTURE_SERIES_RELATIONSHIP_ID,
  )
})

test('Create-a-prompt is wired to Culture-C with sb_only fallback and no Culture BI framing', () => {
  const overlay = fs.readFileSync(
    path.join(ROOT, 'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx'),
    'utf8',
  )
  const envExample = fs.readFileSync(path.join(ROOT, '.env.example'), 'utf8')
  const viteEnv = fs.readFileSync(path.join(ROOT, 'app/src/vite-env.d.ts'), 'utf8')
  assert.match(
    envExample,
    /^VITE_NLL_CHALKIE_CULTURE_ADAPTER_PILOT=false$/m,
  )
  assert.match(viteEnv, /VITE_NLL_CHALKIE_CULTURE_ADAPTER_PILOT/)
  assert.match(overlay, /assembleNllCultureChalkieAdapterPilot\(\{/)
  assert.match(overlay, /shouldRunNllCultureChalkieAdapterPilot\(/)
  assert.match(overlay, /cultureSeriesPackageRequested/)
  assert.match(
    overlay,
    /Culture remains BI-absent: do not apply Opener BI framing/,
  )
  assert.match(
    overlay,
    /Culture-C failure: retain current sb_only path with captured selections/,
  )
  assert.doesNotMatch(
    overlay,
    /assembleNllCultureChalkieAdapterPilot[\s\S]{0,800}applyOpenerBiFramingToHandoff/,
  )
})
