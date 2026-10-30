/**
 * Focused Writing-C adapter pilot tests.
 * Run: npx tsx --test scripts/tests/nllWritingChalkieAdapterPilot.test.ts
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
  assembleNllWritingChalkieAdapterPilot,
  BE3_U08_WRITING_NLL_COMPONENT_KEY,
  BE3_U08_WRITING_SERIES_RELATIONSHIP_ID,
  isExactBe3U08WritingNllChalkieAdapterScope,
  isNllWritingChalkieAdapterPilotEnabled,
  NLL_CHALKIE_WRITING_ADAPTER_PILOT_ENV,
  nllWritingChalkieAdapterRequestKey,
  shouldApplyNllWritingChalkieAdapterPilotResult,
  shouldRunNllWritingChalkieAdapterPilot,
} from '../../app/src/features/chalkie/nllWritingChalkieAdapterPilot.ts'
import { BE3_U08_SB138_139_WB113_114 } from '../../app/src/features/chalkie/verifiedSbWbCompanions.ts'
import { BE3_U08_SB140_WB115 } from '../../app/src/features/chalkie/verifiedSbWbCompanions.ts'
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
  activeLessonPrintedPages: [140],
})
const wbCards = buildWbActivityCards({
  summary: summary('big_english_3_wb', wbCanonical),
  companion: BE3_U08_SB140_WB115,
})

const writingCompanion: VerifiedSbWbCompanion = {
  ...BE3_U08_SB140_WB115,
  source: 'curated_verified',
}
const isolatorCompanion: VerifiedSbWbCompanion = {
  ...BE3_U08_SB138_139_WB113_114,
  source: 'curated_verified',
}

const WRITING_ORDER = [
  'bep3_sb_act_08_28',
  'bep3_sb_act_08_29',
  'bep3_sb_act_08_30',
  'bep3_sb_act_08_31',
  'bep_3_wb_act_115_24',
  'bep_3_wb_act_115_25',
  'bep_3_wb_act_115_26',
] as const

function mockResolvedWriting(): ResolvedNllComponent {
  return {
    component: {
      id: '3e800008-0000-4000-8000-000000000007',
      component_key: BE3_U08_WRITING_NLL_COMPONENT_KEY,
      title: 'Big English 3 Unit 8 Writing',
      status: 'draft',
      created_at: '2026-10-30T00:00:00.000Z',
    },
    activities: WRITING_ORDER.map((activityId, index) => ({
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

test('Writing-C flag defaults off and exact scope validates seven activities', () => {
  assert.equal(isNllWritingChalkieAdapterPilotEnabled({}), false)
  assert.equal(
    isNllWritingChalkieAdapterPilotEnabled({
      [NLL_CHALKIE_WRITING_ADAPTER_PILOT_ENV]: 'false',
    }),
    false,
  )
  assert.equal(
    isNllWritingChalkieAdapterPilotEnabled({
      [NLL_CHALKIE_WRITING_ADAPTER_PILOT_ENV]: 'true',
    }),
    true,
  )
  assert.equal(
    isExactBe3U08WritingNllChalkieAdapterScope({
      activityCards: sbCards,
      workbookActivityCards: wbCards,
      companion: writingCompanion,
    }),
    true,
  )
  assert.equal(
    isExactBe3U08WritingNllChalkieAdapterScope({
      activityCards: sbCards,
      workbookActivityCards: wbCards,
      companion: isolatorCompanion,
    }),
    false,
  )
  assert.equal(
    shouldRunNllWritingChalkieAdapterPilot({
      flagEnabled: true,
      exactScopeEligible: true,
      chalkieRequested: true,
      seriesPackageRequested: true,
    }),
    true,
  )
  assert.equal(
    shouldRunNllWritingChalkieAdapterPilot({
      flagEnabled: true,
      exactScopeEligible: true,
      chalkieRequested: true,
      seriesPackageRequested: false,
    }),
    false,
  )
})

test('Writing-C assembles package-level NLL without leaking summary prose; stale guard works', async () => {
  const sbSelection = createSbActivityHandoffSelection(
    sbCards,
    createDefaultSbActivitySelection(sbCards),
  )
  const wbSelection = createWbActivityHandoffSelection(
    wbCards,
    createDefaultWbActivitySelection(wbCards),
  )
  const result = await assembleNllWritingChalkieAdapterPilot({
    flagEnabled: true,
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion: writingCompanion,
    sbSelection,
    wbSelection,
    client: { from: () => ({}) } as never,
    loadNll: async () => mockResolvedWriting(),
  })
  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.equal(result.nlp.identity.relationshipId, BE3_U08_WRITING_SERIES_RELATIONSHIP_ID)
  assert.ok(result.nlp.derivedKnowledge)
  assert.equal(result.nlp.curriculumInterpretation, undefined)
  assert.doesNotMatch(result.handoff.detailedHandoff, /HIDDEN-SUMMARY-/)
  assert.match(result.handoff.detailedHandoff, /Audio 162/)
  assert.doesNotMatch(result.handoff.detailedHandoff, /Audio 160|Audio 161/)
  assert.equal(result.handoff.stableSeriesReference, 'be3-sb-wb-u08-p140-wb115')

  const requestKey = nllWritingChalkieAdapterRequestKey({
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion: writingCompanion,
    sbSelection,
    wbSelection,
    selectedSuggestions: [],
    teacherAdditions: [],
  })
  assert.equal(
    shouldApplyNllWritingChalkieAdapterPilotResult({
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
    shouldApplyNllWritingChalkieAdapterPilotResult({
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

test('Writing-C falls back on flag-off, wrong scope, and incomplete membership', async () => {
  const sbSelection = createSbActivityHandoffSelection(
    sbCards,
    createDefaultSbActivitySelection(sbCards),
  )
  const wbSelection = createWbActivityHandoffSelection(
    wbCards,
    createDefaultWbActivitySelection(wbCards),
  )
  const flagOff = await assembleNllWritingChalkieAdapterPilot({
    flagEnabled: false,
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion: writingCompanion,
    sbSelection,
    wbSelection,
    client: { from: () => ({}) } as never,
    loadNll: async () => mockResolvedWriting(),
  })
  assert.equal(flagOff.ok, false)
  if (!flagOff.ok) assert.equal(flagOff.reason, 'flag_off')

  const wrongScope = await assembleNllWritingChalkieAdapterPilot({
    flagEnabled: true,
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion: isolatorCompanion,
    sbSelection,
    wbSelection,
    client: { from: () => ({}) } as never,
    loadNll: async () => mockResolvedWriting(),
  })
  assert.equal(wrongScope.ok, false)
  if (!wrongScope.ok) assert.equal(wrongScope.reason, 'ineligible_scope')

  const incomplete = await assembleNllWritingChalkieAdapterPilot({
    flagEnabled: true,
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion: writingCompanion,
    sbSelection,
    wbSelection,
    client: { from: () => ({}) } as never,
    loadNll: async () => {
      const resolved = mockResolvedWriting()
      return {
        ...resolved,
        activities: resolved.activities.slice(0, 4),
      }
    },
  })
  assert.equal(incomplete.ok, false)
  if (!incomplete.ok) assert.equal(incomplete.reason, 'incomplete_component')
})

test('Writing-C stays isolated from Culture package identity', () => {
  const cultureSbCards = buildSbActivityCards({
    summary: summary('big_english_3_sb', sbCanonical),
    activeLessonPrintedPages: [138, 139],
  })
  const cultureWbCards = buildWbActivityCards({
    summary: summary('big_english_3_wb', wbCanonical),
    companion: BE3_U08_SB138_139_WB113_114,
  })
  const culturePackage = buildNeutralSbWbLessonPackage({
    companion: isolatorCompanion,
    sbSelection: createSbActivityHandoffSelection(
      cultureSbCards,
      createDefaultSbActivitySelection(cultureSbCards),
    ),
    wbSelection: createWbActivityHandoffSelection(
      cultureWbCards,
      createDefaultWbActivitySelection(cultureWbCards),
    ),
  })
  assert.equal(culturePackage.identity.componentKey, 'culture')
  assert.notEqual(
    culturePackage.identity.relationshipId,
    BE3_U08_WRITING_SERIES_RELATIONSHIP_ID,
  )
})

test('Create-a-prompt is wired to Writing-C with sb_only fallback and no Writing BI framing', () => {
  const overlay = fs.readFileSync(
    path.join(ROOT, 'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx'),
    'utf8',
  )
  const envExample = fs.readFileSync(path.join(ROOT, '.env.example'), 'utf8')
  const viteEnv = fs.readFileSync(path.join(ROOT, 'app/src/vite-env.d.ts'), 'utf8')
  assert.match(
    envExample,
    /^VITE_NLL_CHALKIE_WRITING_ADAPTER_PILOT=false$/m,
  )
  assert.match(viteEnv, /VITE_NLL_CHALKIE_WRITING_ADAPTER_PILOT/)
  assert.match(overlay, /assembleNllWritingChalkieAdapterPilot\(\{/)
  assert.match(overlay, /shouldRunNllWritingChalkieAdapterPilot\(/)
  assert.match(overlay, /writingSeriesPackageRequested/)
  assert.match(
    overlay,
    /Writing remains BI-absent: do not apply Opener BI framing/,
  )
  assert.match(
    overlay,
    /Writing-C failure: retain current sb_only path with captured selections/,
  )
  assert.doesNotMatch(
    overlay,
    /assembleNllWritingChalkieAdapterPilot[\s\S]{0,800}applyOpenerBiFramingToHandoff/,
  )
})
