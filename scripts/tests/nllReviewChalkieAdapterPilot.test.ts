/**
 * Focused Review-C adapter pilot tests.
 * Run: npx tsx --test scripts/tests/nllReviewChalkieAdapterPilot.test.ts
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
  assembleNllReviewChalkieAdapterPilot,
  BE3_U08_REVIEW_NLL_COMPONENT_KEY,
  BE3_U08_REVIEW_SERIES_RELATIONSHIP_ID,
  isExactBe3U08ReviewNllChalkieAdapterScope,
  isNllReviewChalkieAdapterPilotEnabled,
  NLL_CHALKIE_REVIEW_ADAPTER_PILOT_ENV,
  nllReviewChalkieAdapterRequestKey,
  shouldApplyNllReviewChalkieAdapterPilotResult,
  shouldRunNllReviewChalkieAdapterPilot,
} from '../../app/src/features/chalkie/nllReviewChalkieAdapterPilot.ts'
import { BE3_U08_SB141_WB116 } from '../../app/src/features/chalkie/verifiedSbWbCompanions.ts'
import { BE3_U08_SB143_WB117 } from '../../app/src/features/chalkie/verifiedSbWbCompanions.ts'
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
  activeLessonPrintedPages: [143],
})
const wbCards = buildWbActivityCards({
  summary: summary('big_english_3_wb', wbCanonical),
  companion: BE3_U08_SB143_WB117,
})

const reviewCompanion: VerifiedSbWbCompanion = {
  ...BE3_U08_SB143_WB117,
  source: 'curated_verified',
}
const isolatorCompanion: VerifiedSbWbCompanion = {
  ...BE3_U08_SB141_WB116,
  source: 'curated_verified',
}

const REVIEW_ORDER = [
  'bep3_sb_act_08_39',
  'bep3_sb_act_08_40',
  'bep3_sb_act_08_41',
  'bep_3_wb_act_117_31',
  'bep_3_wb_act_117_32',
  'bep_3_wb_act_117_33',
] as const

function mockResolvedReview(): ResolvedNllComponent {
  return {
    component: {
      id: '3e800008-0000-4000-8000-000000000009',
      component_key: BE3_U08_REVIEW_NLL_COMPONENT_KEY,
      title: 'Big English 3 Unit 8 Review',
      status: 'draft',
      created_at: '2026-10-30T00:00:00.000Z',
    },
    activities: REVIEW_ORDER.map((activityId, index) => ({
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

test('Review-C flag defaults off and exact scope validates 6 activities', () => {
  assert.equal(isNllReviewChalkieAdapterPilotEnabled({}), false)
  assert.equal(
    isNllReviewChalkieAdapterPilotEnabled({
      [NLL_CHALKIE_REVIEW_ADAPTER_PILOT_ENV]: 'false',
    }),
    false,
  )
  assert.equal(
    isNllReviewChalkieAdapterPilotEnabled({
      [NLL_CHALKIE_REVIEW_ADAPTER_PILOT_ENV]: 'true',
    }),
    true,
  )
  assert.equal(
    isExactBe3U08ReviewNllChalkieAdapterScope({
      activityCards: sbCards,
      workbookActivityCards: wbCards,
      companion: reviewCompanion,
    }),
    true,
  )
  assert.equal(
    isExactBe3U08ReviewNllChalkieAdapterScope({
      activityCards: sbCards,
      workbookActivityCards: wbCards,
      companion: isolatorCompanion,
    }),
    false,
  )
  assert.equal(
    shouldRunNllReviewChalkieAdapterPilot({
      flagEnabled: true,
      exactScopeEligible: true,
      chalkieRequested: true,
      seriesPackageRequested: true,
    }),
    true,
  )
  assert.equal(
    shouldRunNllReviewChalkieAdapterPilot({
      flagEnabled: true,
      exactScopeEligible: true,
      chalkieRequested: true,
      seriesPackageRequested: false,
    }),
    false,
  )
})

test('Review-C assembles package-level NLL without leaking summary prose; stale guard works', async () => {
  const sbSelection = createSbActivityHandoffSelection(
    sbCards,
    createDefaultSbActivitySelection(sbCards),
  )
  const wbSelection = createWbActivityHandoffSelection(
    wbCards,
    createDefaultWbActivitySelection(wbCards),
  )
  const result = await assembleNllReviewChalkieAdapterPilot({
    flagEnabled: true,
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion: reviewCompanion,
    sbSelection,
    wbSelection,
    client: { from: () => ({}) } as never,
    loadNll: async () => mockResolvedReview(),
  })
  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.equal(result.nlp.identity.relationshipId, BE3_U08_REVIEW_SERIES_RELATIONSHIP_ID)
  assert.ok(result.nlp.derivedKnowledge)
  assert.equal(result.nlp.curriculumInterpretation, undefined)
  assert.doesNotMatch(result.handoff.detailedHandoff, /HIDDEN-SUMMARY-/)
  assert.match(result.handoff.detailedHandoff, /mixed consolidation/)
  assert.doesNotMatch(result.handoff.detailedHandoff, /Audio 163|Audio 164|bep3_sb_act_08_32|all, au, aw/)
  assert.equal(result.handoff.stableSeriesReference, 'be3-sb-wb-u08-p143-wb117')

  const requestKey = nllReviewChalkieAdapterRequestKey({
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion: reviewCompanion,
    sbSelection,
    wbSelection,
    selectedSuggestions: [],
    teacherAdditions: [],
  })
  assert.equal(
    shouldApplyNllReviewChalkieAdapterPilotResult({
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
    shouldApplyNllReviewChalkieAdapterPilotResult({
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

test('Review-C falls back on flag-off, wrong scope, and incomplete membership', async () => {
  const sbSelection = createSbActivityHandoffSelection(
    sbCards,
    createDefaultSbActivitySelection(sbCards),
  )
  const wbSelection = createWbActivityHandoffSelection(
    wbCards,
    createDefaultWbActivitySelection(wbCards),
  )
  const flagOff = await assembleNllReviewChalkieAdapterPilot({
    flagEnabled: false,
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion: reviewCompanion,
    sbSelection,
    wbSelection,
    client: { from: () => ({}) } as never,
    loadNll: async () => mockResolvedReview(),
  })
  assert.equal(flagOff.ok, false)
  if (!flagOff.ok) assert.equal(flagOff.reason, 'flag_off')

  const wrongScope = await assembleNllReviewChalkieAdapterPilot({
    flagEnabled: true,
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion: isolatorCompanion,
    sbSelection,
    wbSelection,
    client: { from: () => ({}) } as never,
    loadNll: async () => mockResolvedReview(),
  })
  assert.equal(wrongScope.ok, false)
  if (!wrongScope.ok) assert.equal(wrongScope.reason, 'ineligible_scope')

  const incomplete = await assembleNllReviewChalkieAdapterPilot({
    flagEnabled: true,
    activityCards: sbCards,
    workbookActivityCards: wbCards,
    companion: reviewCompanion,
    sbSelection,
    wbSelection,
    client: { from: () => ({}) } as never,
    loadNll: async () => {
      const resolved = mockResolvedReview()
      return {
        ...resolved,
        activities: resolved.activities.slice(0, 4),
      }
    },
  })
  assert.equal(incomplete.ok, false)
  if (!incomplete.ok) assert.equal(incomplete.reason, 'incomplete_component')
})

test('Review-C stays isolated from Phonics package identity', () => {
  const cultureSbCards = buildSbActivityCards({
    summary: summary('big_english_3_sb', sbCanonical),
    activeLessonPrintedPages: [141],
  })
  const cultureWbCards = buildWbActivityCards({
    summary: summary('big_english_3_wb', wbCanonical),
    companion: BE3_U08_SB141_WB116,
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
  assert.equal(culturePackage.identity.componentKey, 'phonics')
  assert.notEqual(
    culturePackage.identity.relationshipId,
    BE3_U08_REVIEW_SERIES_RELATIONSHIP_ID,
  )
})

test('Create-a-prompt is wired to Review-C with sb_only fallback and no Review BI framing', () => {
  const overlay = fs.readFileSync(
    path.join(ROOT, 'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx'),
    'utf8',
  )
  const envExample = fs.readFileSync(path.join(ROOT, '.env.example'), 'utf8')
  const viteEnv = fs.readFileSync(path.join(ROOT, 'app/src/vite-env.d.ts'), 'utf8')
  assert.match(
    envExample,
    /^VITE_NLL_CHALKIE_REVIEW_ADAPTER_PILOT=false\r?$/m,
  )
  assert.match(viteEnv, /VITE_NLL_CHALKIE_REVIEW_ADAPTER_PILOT/)
  assert.match(overlay, /assembleNllReviewChalkieAdapterPilot\(\{/)
  assert.match(overlay, /shouldRunNllReviewChalkieAdapterPilot\(/)
  assert.match(overlay, /reviewSeriesPackageRequested/)
  assert.match(
    overlay,
    /Review remains BI-absent: do not apply Opener BI framing/,
  )
  assert.match(
    overlay,
    /Review-C failure: retain current sb_only path with captured selections/,
  )
  assert.doesNotMatch(
    overlay,
    /assembleNllReviewChalkieAdapterPilot[\s\S]{0,800}applyOpenerBiFramingToHandoff/,
  )
})
