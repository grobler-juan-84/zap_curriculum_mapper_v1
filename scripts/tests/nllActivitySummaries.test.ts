/**
 * Shared BE3 U8 NLL activity-summary loader / modal-contract tests.
 * Run: npx tsx --test scripts/tests/nllActivitySummaries.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import type { SupabaseClient } from '@supabase/supabase-js'

import type { SbActivityCard } from '../../app/src/features/chalkie/chalkieActivitySelection.ts'
import type { WbActivityCard } from '../../app/src/features/chalkie/chalkieWorkbookActivitySelection.ts'
import {
  BE3_U08_NLL_ACTIVITY_SUMMARY_BY_RELATIONSHIP_ID,
  BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS,
  isExactBe3U08NllActivitySummaryScope,
  isExactBe3U08ValuesNllActivitySummaryScope,
  isNllActivitySummariesEnabled,
  loadNllActivitySummaries,
  mapResolvedNllComponentToActivitySummaries,
  membershipMatchesExpected,
  NLL_ACTIVITY_SUMMARIES_ENV,
  nllActivitySummaryScopeKey,
  peekNllActivitySummarySharedFlightScopeKeyForTests,
  resetNllActivitySummarySharedFlightForTests,
  resolveBe3U08NllActivitySummarySpec,
  shouldLoadNllActivitySummaries,
  subscribeNllActivitySummaryLifecycle,
  toNllActivitySummaryDisplay,
  type NllActivitySummaryLifecycleState,
} from '../../app/src/features/chalkie/nllActivitySummaries.ts'
import type { VerifiedSbWbCompanion } from '../../app/src/features/chalkie/resolveVerifiedSbWbCompanion.ts'
import {
  assembleNeutralLessonComponent,
  type NllActivitySummaryRow,
  type NllComponentActivityRow,
  type NllComponentRow,
} from '../../app/src/features/nll/neutralLessonLibrary.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const LOADER_SOURCE = path.join(
  ROOT,
  'app/src/features/chalkie/nllActivitySummaries.ts',
)
const OVERLAY_SOURCE = path.join(
  ROOT,
  'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx',
)
const CARD_SOURCE = path.join(
  ROOT,
  'app/src/features/chalkie/ActivityEvidenceCard.tsx',
)
const POC_SOURCE = path.join(
  ROOT,
  'app/src/features/chalkie/be3U08ActivityEnrichmentPoc.ts',
)

const LIVE_COMPONENT_KEYS = [
  'be3-u08-opener',
  'be3-u08-story',
  'be3-u08-lia',
  'be3-u08-clil-pe',
  'be3-u08-grammar',
  'be3-u08-culture',
  'be3-u08-writing',
  'be3-u08-phonics',
  'be3-u08-values',
  'be3-u08-review',
] as const

function syntheticSbCard(
  activityId: string,
  printedPage: number,
): SbActivityCard {
  const pageId = `page-${printedPage}`
  const references = {
    activityId,
    bookId: 'big_english_3_sb',
    unitId: 'big_english_3_sb_unit_08',
    pageId,
    verificationStatus: 'human_verified' as const,
  }
  return {
    id: `card-${activityId}`,
    source: 'SB',
    pageId,
    printedPage,
    activityNumber: activityId.replace(/\D+/g, '').slice(-2),
    verifiedWording: 'verified',
    preview: { kind: 'empty', values: [] },
    activityLinkedModels: [],
    pageDedicatedVocabulary: [],
    pageDedicatedLanguage: [],
    references,
    evidence: {
      cardId: `card-${activityId}`,
      source: 'SB',
      pageId,
      printedPage,
      activityNumber: activityId.replace(/\D+/g, '').slice(-2),
      verifiedWording: 'verified',
      activityType: null,
      prompt: 'RAW PROMPT SHOULD NOT LEAK',
      expectedAnswer: 'SECRET EXPECTED ANSWER',
      languageFrame: 'SECRET FRAME',
      audioDependency: false,
      visualDependency: false,
      sourceDependencyNote: null,
      items: [],
      references,
    },
  }
}

function syntheticWbCard(
  activityId: string,
  printedPage: number,
): WbActivityCard {
  const pageId = `wb-page-${printedPage}`
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
    id: `wb-card-${activityId}`,
    source: 'WB',
    pageId,
    printedPage,
    activityNumber: activityId.replace(/\D+/g, '').slice(-2),
    verifiedWording: 'verified',
    preview: { kind: 'empty', values: [] },
    activityLinkedModels: [],
    pageDedicatedVocabulary: [],
    pageDedicatedLanguage: [],
    references,
    evidence: {
      cardId: `wb-card-${activityId}`,
      source: 'WB',
      pageId,
      printedPage,
      activityNumber: activityId.replace(/\D+/g, '').slice(-2),
      verifiedWording: 'verified',
      activityType: null,
      prompt: 'WB RAW PROMPT',
      expectedAnswer: 'WB SECRET ANSWER',
      languageFrame: null,
      audioDependency: false,
      visualDependency: false,
      sourceDependencyNote: null,
      items: [],
      references,
    },
  }
}

function companion(relationshipId: string): VerifiedSbWbCompanion {
  return {
    studentBookCatalogId: 'big_english_3_sb',
    workbookCatalogId: 'big_english_3_wb',
    studentBookPrintedPages: [128, 129],
    workbookPrintedPages: [104, 105],
    relationshipId,
    relationshipType: 'workbook_practice_for',
    source: 'curated_verified',
  }
}

function resolvedFromSpec(
  spec: (typeof BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS)[keyof typeof BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS],
  options?: { readonly dropSummaryFor?: string; readonly scrambleOrder?: boolean },
) {
  const component: NllComponentRow = {
    id: 'component-test',
    component_key: spec.componentKey,
    title: spec.componentKey,
    status: 'draft',
    created_at: '2026-10-31T00:00:00.000Z',
  }
  const ids = options?.scrambleOrder
    ? [...spec.expectedActivityIds].reverse()
    : [...spec.expectedActivityIds]
  const memberships: NllComponentActivityRow[] = ids.map((activityId, index) => ({
    component_id: component.id,
    activity_id: activityId,
    position: index + 1,
  }))
  const summaries: NllActivitySummaryRow[] = ids
    .filter((id) => id !== options?.dropSummaryFor)
    .map((activityId) => ({
      id: `${activityId}_summary`,
      activity_id: activityId,
      version: 1,
      summary_text: `Concise summary for ${activityId}`,
      canonical_path: 'path',
      canonical_sha256: 'a'.repeat(64),
      activity_sha256: 'b'.repeat(64),
      evidence_status: 'sufficient',
      display_status: 'hidden',
      review_state: 'experimental',
      is_preferred: true,
      provenance: {},
      created_at: '2026-10-31T00:00:00.000Z',
    }))
  return assembleNeutralLessonComponent({
    component,
    memberships,
    summaries,
    ssLinks: [],
    includeHiddenExperimental: true,
  })
}

test('flag defaults off and accepts common truthy values', () => {
  assert.equal(isNllActivitySummariesEnabled({}), false)
  assert.equal(
    isNllActivitySummariesEnabled({ [NLL_ACTIVITY_SUMMARIES_ENV]: 'true' }),
    true,
  )
  assert.equal(
    isNllActivitySummariesEnabled({ [NLL_ACTIVITY_SUMMARIES_ENV]: '1' }),
    true,
  )
  assert.equal(
    isNllActivitySummariesEnabled({ [NLL_ACTIVITY_SUMMARIES_ENV]: 'no' }),
    false,
  )
})

test('maps all nine live companions plus Values companion-free scope (10 components / 77 activities)', () => {
  assert.equal(
    Object.keys(BE3_U08_NLL_ACTIVITY_SUMMARY_BY_RELATIONSHIP_ID).length,
    9,
  )
  assert.equal(Object.keys(BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS).length, 10)
  for (const key of LIVE_COMPONENT_KEYS) {
    assert.ok(
      Object.values(BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS).some(
        (spec) => spec.componentKey === key,
      ),
      key,
    )
  }
  assert.equal(
    BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.values.componentKey,
    'be3-u08-values',
  )
  assert.deepEqual(
    [...BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.values.expectedActivityIds],
    ['bep3_sb_act_08_36', 'bep3_sb_act_08_37', 'bep3_sb_act_08_38'],
  )

  const liveTotal = LIVE_COMPONENT_KEYS.reduce((n, key) => {
    const spec = Object.values(BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS).find(
      (row) => row.componentKey === key,
    )
    return n + (spec?.expectedActivityIds.length ?? 0)
  }, 0)
  assert.equal(liveTotal, 77)

  const openerCards = BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.opener.expectedActivityIds
    .filter((id) => id.startsWith('bep3_sb_'))
    .map((id) => syntheticSbCard(id, 128))
  const openerWb = BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.opener.expectedActivityIds
    .filter((id) => id.startsWith('bep_3_wb_'))
    .map((id) => syntheticWbCard(id, 104))
  const openerCompanion = companion(
    'be3_sb_wb_rel_u08_opener_sb128-129_wb104-105',
  )
  assert.equal(
    resolveBe3U08NllActivitySummarySpec({
      activityCards: openerCards,
      workbookActivityCards: openerWb,
      companion: openerCompanion,
    })?.componentKey,
    'be3-u08-opener',
  )
  assert.equal(
    isExactBe3U08NllActivitySummaryScope({
      activityCards: openerCards,
      workbookActivityCards: openerWb,
      companion: openerCompanion,
    }),
    true,
  )

  const valuesCards = [
    syntheticSbCard('bep3_sb_act_08_36', 142),
    syntheticSbCard('bep3_sb_act_08_37', 142),
    syntheticSbCard('bep3_sb_act_08_38', 142),
  ]
  assert.equal(
    isExactBe3U08ValuesNllActivitySummaryScope({
      activityCards: valuesCards,
      workbookActivityCards: [],
      companion: null,
    }),
    true,
  )
  assert.equal(
    resolveBe3U08NllActivitySummarySpec({
      activityCards: valuesCards,
      workbookActivityCards: [],
      companion: null,
    })?.componentKey,
    'be3-u08-values',
  )
  assert.equal(
    isExactBe3U08ValuesNllActivitySummaryScope({
      activityCards: valuesCards,
      workbookActivityCards: [syntheticWbCard('bep_3_wb_act_116_27', 116)],
      companion: null,
    }),
    false,
  )
})

test('membership validation fails closed on missing or reordered rows', () => {
  const spec = BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.story
  const ok = resolvedFromSpec(spec)
  assert.equal(membershipMatchesExpected(ok, spec.expectedActivityIds), true)
  const mapped = mapResolvedNllComponentToActivitySummaries(
    ok,
    spec.expectedActivityIds,
  )
  assert.equal(mapped.status, 'success')
  assert.equal(mapped.byActivityId.size, 5)

  const missing = resolvedFromSpec(spec, {
    dropSummaryFor: 'bep3_sb_act_08_06',
  })
  assert.equal(
    mapResolvedNllComponentToActivitySummaries(missing, spec.expectedActivityIds)
      .status,
    'membership_mismatch',
  )

  const scrambled = resolvedFromSpec(spec, { scrambleOrder: true })
  assert.equal(
    mapResolvedNllComponentToActivitySummaries(
      scrambled,
      spec.expectedActivityIds,
    ).status,
    'membership_mismatch',
  )
})

test('load success / empty / unavailable / membership mismatch / error', async () => {
  const spec = BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.opener
  const success = await loadNllActivitySummaries({
    client: {} as SupabaseClient,
    componentKey: spec.componentKey,
    expectedActivityIds: spec.expectedActivityIds,
    loadComponent: async () => resolvedFromSpec(spec),
  })
  assert.equal(success.kind, 'success')
  if (success.kind === 'success') {
    assert.equal(success.byActivityId.size, 9)
  }

  const empty = await loadNllActivitySummaries({
    client: {} as SupabaseClient,
    componentKey: spec.componentKey,
    expectedActivityIds: spec.expectedActivityIds,
    loadComponent: async () => null,
  })
  assert.equal(empty.kind, 'empty')

  const unavailable = await loadNllActivitySummaries({
    client: null,
    componentKey: 'be3-u08-values',
    expectedActivityIds:
      BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.values.expectedActivityIds,
  })
  assert.equal(unavailable.kind, 'unavailable')

  const mismatch = await loadNllActivitySummaries({
    client: {} as SupabaseClient,
    componentKey: spec.componentKey,
    expectedActivityIds: spec.expectedActivityIds,
    loadComponent: async () =>
      resolvedFromSpec(spec, { dropSummaryFor: 'bep3_sb_act_08_01' }),
  })
  assert.equal(mismatch.kind, 'membership_mismatch')

  const errored = await loadNllActivitySummaries({
    client: {} as SupabaseClient,
    componentKey: spec.componentKey,
    expectedActivityIds: spec.expectedActivityIds,
    loadComponent: async () => {
      throw new Error('boom')
    },
  })
  assert.equal(errored.kind, 'error')
})

test('display helper only exposes summaries on success hits', () => {
  const byActivityId = new Map([
    [
      'bep3_sb_act_08_01',
      { text: 'NLL only', evidenceSufficiency: 'sufficient' as const },
    ],
  ])
  assert.deepEqual(
    toNllActivitySummaryDisplay({
      loadStatus: 'success',
      byActivityId,
      activityId: 'bep3_sb_act_08_01',
    }),
    { text: 'NLL only', evidenceSufficiency: 'sufficient' },
  )
  assert.equal(
    toNllActivitySummaryDisplay({
      loadStatus: 'loading',
      byActivityId,
      activityId: 'bep3_sb_act_08_01',
    }),
    null,
  )
  assert.equal(
    toNllActivitySummaryDisplay({
      loadStatus: 'success',
      byActivityId,
      activityId: 'missing',
    }),
    null,
  )
  assert.equal(
    toNllActivitySummaryDisplay({
      loadStatus: 'membership_mismatch',
      byActivityId,
      activityId: 'bep3_sb_act_08_01',
    }),
    null,
  )
})

async function flushMicrotasks(): Promise<void> {
  await Promise.resolve()
  await Promise.resolve()
  await new Promise<void>((resolve) => setTimeout(resolve, 0))
}

test('single-flight and stale-response protection across lessons', async () => {
  resetNllActivitySummarySharedFlightForTests()
  const applied: NllActivitySummaryLifecycleState[] = []
  let resolveLoad!: (value: {
    readonly kind: 'success'
    readonly byActivityId: Map<
      string,
      { readonly text: string; readonly evidenceSufficiency: 'sufficient' }
    >
    readonly componentKey: string
  }) => void
  const deferred = new Promise<Parameters<typeof resolveLoad>[0]>((resolve) => {
    resolveLoad = resolve
  })

  const cleanupA = subscribeNllActivitySummaryLifecycle({
    shouldLoad: true,
    scopeKey: 'scope-a',
    componentKey: 'be3-u08-opener',
    expectedActivityIds:
      BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.opener.expectedActivityIds,
    client: {} as SupabaseClient,
    loadSummaries: async () => deferred,
    apply: (next) => applied.push(next),
  })
  assert.equal(
    peekNllActivitySummarySharedFlightScopeKeyForTests(),
    'scope-a',
  )

  // Same scope reuses flight.
  const appliedB: NllActivitySummaryLifecycleState[] = []
  const cleanupB = subscribeNllActivitySummaryLifecycle({
    shouldLoad: true,
    scopeKey: 'scope-a',
    componentKey: 'be3-u08-opener',
    expectedActivityIds:
      BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.opener.expectedActivityIds,
    client: {} as SupabaseClient,
    loadSummaries: async () => {
      throw new Error('should reuse flight')
    },
    apply: (next) => appliedB.push(next),
  })

  cleanupA()
  resolveLoad({
    kind: 'success',
    componentKey: 'be3-u08-opener',
    byActivityId: new Map([
      [
        'bep3_sb_act_08_01',
        { text: 'stale-a', evidenceSufficiency: 'sufficient' },
      ],
    ]),
  })
  await deferred
  await flushMicrotasks()
  assert.ok(!applied.some((row) => row.status === 'success'))
  assert.ok(appliedB.some((row) => row.status === 'success'))
  cleanupB()

  // New lesson scope supersedes prior flight key.
  resetNllActivitySummarySharedFlightForTests()
  const appliedStory: NllActivitySummaryLifecycleState[] = []
  let resolveStory!: (value: {
    readonly kind: 'success'
    readonly byActivityId: Map<
      string,
      { readonly text: string; readonly evidenceSufficiency: 'sufficient' }
    >
    readonly componentKey: string
  }) => void
  const storyDeferred = new Promise<Parameters<typeof resolveStory>[0]>(
    (resolve) => {
      resolveStory = resolve
    },
  )
  const cleanupOpener = subscribeNllActivitySummaryLifecycle({
    shouldLoad: true,
    scopeKey: 'opener-scope',
    componentKey: 'be3-u08-opener',
    expectedActivityIds:
      BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.opener.expectedActivityIds,
    client: {} as SupabaseClient,
    loadSummaries: async () => storyDeferred as never,
    apply: () => {},
  })
  cleanupOpener()
  const cleanupStory = subscribeNllActivitySummaryLifecycle({
    shouldLoad: true,
    scopeKey: 'story-scope',
    componentKey: 'be3-u08-story',
    expectedActivityIds:
      BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.story.expectedActivityIds,
    client: {} as SupabaseClient,
    loadSummaries: async () => ({
      kind: 'success',
      componentKey: 'be3-u08-story',
      byActivityId: new Map([
        [
          'bep3_sb_act_08_06',
          { text: 'story', evidenceSufficiency: 'sufficient' },
        ],
      ]),
    }),
    apply: (next) => appliedStory.push(next),
  })
  resolveStory({
    kind: 'success',
    componentKey: 'be3-u08-opener',
    byActivityId: new Map([
      [
        'bep3_sb_act_08_01',
        { text: 'opener-stale', evidenceSufficiency: 'sufficient' },
      ],
    ]),
  })
  await storyDeferred
  await flushMicrotasks()
  assert.ok(
    !appliedStory.some(
      (row) =>
        row.status === 'success' &&
        row.byActivityId?.get('bep3_sb_act_08_01') != null,
    ),
  )
  assert.ok(
    appliedStory.some(
      (row) =>
        row.status === 'success' &&
        row.byActivityId?.get('bep3_sb_act_08_06')?.text === 'story',
    ),
  )
  cleanupStory()
  assert.equal(
    shouldLoadNllActivitySummaries({
      open: false,
      flagEnabled: true,
      exactScopeEligible: true,
    }),
    false,
  )
})

test('overlay uses NLL activity summaries and does not call POC getters', () => {
  const overlay = fs.readFileSync(OVERLAY_SOURCE, 'utf8')
  const loader = fs.readFileSync(LOADER_SOURCE, 'utf8')
  const card = fs.readFileSync(CARD_SOURCE, 'utf8')
  const poc = fs.readFileSync(POC_SOURCE, 'utf8')

  assert.match(loader, /VITE_CHALKIE_NLL_ACTIVITY_SUMMARIES/)
  assert.match(overlay, /nllActivitySummaries/)
  assert.match(overlay, /nllActivitySummary=/)
  assert.doesNotMatch(overlay, /getBe3U08ActivitySummary/)
  assert.doesNotMatch(overlay, /getBe3U08WbActivitySummary/)
  assert.doesNotMatch(overlay, /toNllCardComparisonDisplayState/)
  assert.doesNotMatch(overlay, /subscribeNllCardComparisonLifecycle/)
  assert.match(card, /data-nll-activity-summary/)
  assert.match(card, /AI summary · experimental/)
  assert.match(poc, /historical tests only/)
  assert.doesNotMatch(overlay, /buildBe3U08ActivityEnrichmentPocPackage/)
  assert.doesNotMatch(overlay, /activityEnrichmentPocEnabled/)
})

test('NLL modal summaries do not leak into Chalkie or lesson-plan assembly paths', () => {
  const overlay = fs.readFileSync(OVERLAY_SOURCE, 'utf8')
  const loader = fs.readFileSync(LOADER_SOURCE, 'utf8')
  // Loader contract: modal-display only.
  assert.match(loader, /never Chalkie artifact/)
  assert.match(loader, /never selection/)
  // Overlay must not pass NLL summary text into artifact builders / prompts.
  assert.doesNotMatch(overlay, /nllActivitySummaryByActivityId[\s\S]{0,200}buildChalkie/)
  assert.doesNotMatch(overlay, /nllActivitySummaryByActivityId[\s\S]{0,200}lessonPlan/)
  assert.doesNotMatch(overlay, /toNllActivitySummaryDisplay\([\s\S]{0,120}prompt/)
  assert.doesNotMatch(overlay, /summary_text/)
})

test('scope key changes with component and activity identity', () => {
  const opener = BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.opener
  const story = BE3_U08_NLL_ACTIVITY_SUMMARY_SPECS.story
  const keyA = nllActivitySummaryScopeKey({
    componentKey: opener.componentKey,
    activityCards: [syntheticSbCard('bep3_sb_act_08_01', 128)],
    workbookActivityCards: [],
    companion: companion('be3_sb_wb_rel_u08_opener_sb128-129_wb104-105'),
  })
  const keyB = nllActivitySummaryScopeKey({
    componentKey: story.componentKey,
    activityCards: [syntheticSbCard('bep3_sb_act_08_06', 130)],
    workbookActivityCards: [],
    companion: companion('be3_sb_wb_rel_u08_story_sb130-131_wb106'),
  })
  assert.notEqual(keyA, keyB)
})
