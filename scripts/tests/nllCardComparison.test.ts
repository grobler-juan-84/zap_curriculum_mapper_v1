/**
 * Bounded Stage 3 NLL↔POC activity-card comparison tests.
 * Run: npx tsx --test scripts/tests/nllCardComparison.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import type { SupabaseClient } from '@supabase/supabase-js'

import {
  BE3_U08_ACTIVITY_IDS,
  BE3_U08_ACTIVITY_SUMMARY_SIDECAR,
  BE3_U08_OPENER_SB_WB_RELATIONSHIP_ID,
  BE3_U08_WB_ACTIVITY_IDS,
  BE3_U08_WB_ACTIVITY_SUMMARY_SIDECAR,
  getBe3U08ActivitySummary,
  getBe3U08WbActivitySummary,
  isBe3U08ActivityEnrichmentPocEnabled,
} from '../../app/src/features/chalkie/be3U08ActivityEnrichmentPoc.ts'
import type { SbActivityCard } from '../../app/src/features/chalkie/chalkieActivitySelection.ts'
import type { WbActivityCard } from '../../app/src/features/chalkie/chalkieWorkbookActivitySelection.ts'
import {
  BE3_U08_OPENER_NLL_COMPONENT_KEY,
  NLL_CARD_COMPARISON_ENV,
  isExactBe3U08OpenerNllCardComparisonScope,
  isNllCardComparisonEnabled,
  loadNllCardComparisonSummaries,
  mapResolvedNllComponentToCardSummaries,
  peekNllCardComparisonSharedFlightScopeKeyForTests,
  resetNllCardComparisonSharedFlightForTests,
  shouldLoadNllCardComparison,
  subscribeNllCardComparisonLifecycle,
  toNllCardComparisonDisplayState,
  type NllCardComparisonLifecycleState,
} from '../../app/src/features/chalkie/nllCardComparison.ts'
import type { VerifiedSbWbCompanion } from '../../app/src/features/chalkie/resolveVerifiedSbWbCompanion.ts'
import {
  assembleNeutralLessonComponent,
  type NllActivitySummaryRow,
  type NllComponentActivityRow,
  type NllComponentRow,
  type ResolvedNllComponent,
} from '../../app/src/features/nll/neutralLessonLibrary.ts'
import { isNllShadowPilotEnabled } from '../../app/src/features/nll/buildNllShadowLessonPackage.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const COMPARISON_SOURCE = path.join(
  ROOT,
  'app/src/features/chalkie/nllCardComparison.ts',
)
const CARD_SOURCE = path.join(
  ROOT,
  'app/src/features/chalkie/ActivityEvidenceCard.tsx',
)
const OVERLAY_SOURCE = path.join(
  ROOT,
  'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx',
)
const LEFT_PANEL_SOURCE = path.join(
  ROOT,
  'app/src/features/chalkie/ChalkieLeftPanel.tsx',
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
      id: `card-${activityId}`,
      source: 'SB' as const,
      pageId,
      printedPage: SB_PAGES[activityId],
      activityNumber: activityId.slice(-2),
      verifiedWording: 'verified',
      preview: { kind: 'empty' as const, values: [] },
      activityLinkedModels: [],
      pageDedicatedVocabulary: [],
      pageDedicatedLanguage: [],
      references,
      evidence: {
        cardId: `card-${activityId}`,
        source: 'SB' as const,
        pageId,
        printedPage: SB_PAGES[activityId],
        activityNumber: activityId.slice(-2),
        verifiedWording: 'verified',
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
    const pageId = `wb-page-${WB_PAGES[activityId]}`
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
      source: 'WB' as const,
      pageId,
      printedPage: WB_PAGES[activityId],
      activityNumber: activityId.slice(-1),
      verifiedWording: 'verified',
      preview: { kind: 'empty' as const, values: [] },
      activityLinkedModels: [],
      pageDedicatedVocabulary: [],
      pageDedicatedLanguage: [],
      references,
      evidence: {
        cardId: `wb-card-${activityId}`,
        source: 'WB' as const,
        pageId,
        printedPage: WB_PAGES[activityId],
        activityNumber: activityId.slice(-1),
        verifiedWording: 'verified',
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
    relationshipId: BE3_U08_OPENER_SB_WB_RELATIONSHIP_ID,
    relationshipType: 'workbook_practice_for',
    source: 'curated_verified',
  }
}

function openerCards() {
  return {
    companion: openerCompanion(),
    activityCards: syntheticOpenerSbCards(),
    workbookActivityCards: syntheticOpenerWbCards(),
  }
}

function seededSummaryRow(
  activityId: string,
  text: string,
  evidence: 'sufficient' | 'insufficient',
  position: number,
): NllActivitySummaryRow {
  return {
    id: `seed-${activityId}`,
    activity_id: activityId,
    version: 1,
    summary_text: text,
    canonical_path: 'big-english/big_english_3_sb/canonical/v1.json',
    canonical_sha256: 'a'.repeat(64),
    activity_sha256: 'b'.repeat(64),
    evidence_status: evidence,
    display_status: 'hidden',
    review_state: 'experimental',
    is_preferred: true,
    provenance: { method: 'ai_assisted_draft' },
    created_at: '2026-10-29T00:00:00.000Z',
  }
}

function seededOpenerResolved(): ResolvedNllComponent {
  const component: NllComponentRow = {
    id: COMPONENT_ID,
    component_key: BE3_U08_OPENER_NLL_COMPONENT_KEY,
    title: 'Big English 3 Unit 8 Opener',
    status: 'draft',
    created_at: '2026-10-29T00:00:00.000Z',
  }
  const allIds = [...BE3_U08_ACTIVITY_IDS, ...BE3_U08_WB_ACTIVITY_IDS]
  const memberships: NllComponentActivityRow[] = allIds.map((activityId, index) => ({
    component_id: COMPONENT_ID,
    activity_id: activityId,
    position: index + 1,
  }))
  const summaries: NllActivitySummaryRow[] = [
    ...BE3_U08_ACTIVITY_SUMMARY_SIDECAR.map((record, index) =>
      seededSummaryRow(
        record.sourceEvidence.activityId,
        record.text,
        record.evidenceSufficiency,
        index + 1,
      ),
    ),
    ...BE3_U08_WB_ACTIVITY_SUMMARY_SIDECAR.map((record, index) =>
      seededSummaryRow(
        record.sourceEvidence.activityId,
        record.text,
        record.evidenceSufficiency,
        index + 6,
      ),
    ),
  ]
  return assembleNeutralLessonComponent({
    component,
    memberships,
    summaries,
    ssLinks: [],
    includeHiddenExperimental: true,
  })
}

test('comparison flag defaults off and accepts only explicit truthy values', () => {
  assert.equal(isNllCardComparisonEnabled({}), false)
  assert.equal(
    isNllCardComparisonEnabled({ [NLL_CARD_COMPARISON_ENV]: 'false' }),
    false,
  )
  assert.equal(
    isNllCardComparisonEnabled({ [NLL_CARD_COMPARISON_ENV]: '0' }),
    false,
  )
  assert.equal(
    isNllCardComparisonEnabled({ [NLL_CARD_COMPARISON_ENV]: 'true' }),
    true,
  )
  assert.equal(
    isNllCardComparisonEnabled({ [NLL_CARD_COMPARISON_ENV]: '1' }),
    true,
  )
  assert.equal(
    isNllCardComparisonEnabled({ [NLL_CARD_COMPARISON_ENV]: 'yes' }),
    true,
  )
})

test('comparison flag is independent from POC, shadow, and canary flags', () => {
  const otherFlagsOn = {
    VITE_CHALKIE_BE3_U08_ACTIVITY_ENRICHMENT_POC: 'true',
    VITE_CHALKIE_NLL_SHADOW_PILOT: 'true',
    VITE_CHALKIE_BE3_U08_OPENER_NEUTRAL_CANARY: 'true',
    VITE_CHALKIE_BE3_U08_STORY_NEUTRAL_CANARY: 'true',
  }
  assert.equal(isNllCardComparisonEnabled(otherFlagsOn), false)
  assert.equal(isBe3U08ActivityEnrichmentPocEnabled(otherFlagsOn), true)
  assert.equal(isNllShadowPilotEnabled(otherFlagsOn), true)
  assert.equal(
    isNllCardComparisonEnabled({
      ...otherFlagsOn,
      [NLL_CARD_COMPARISON_ENV]: 'true',
    }),
    true,
  )
  assert.equal(
    isBe3U08ActivityEnrichmentPocEnabled({
      [NLL_CARD_COMPARISON_ENV]: 'true',
    }),
    false,
  )
  assert.equal(
    isNllShadowPilotEnabled({
      [NLL_CARD_COMPARISON_ENV]: 'true',
    }),
    false,
  )
})

test('exact nine-activity Opener scope only; Story, WB 107, other unit, and incomplete sets are ineligible', () => {
  const { activityCards, workbookActivityCards, companion } = openerCards()
  assert.equal(activityCards.length, 5)
  assert.equal(workbookActivityCards.length, 4)
  assert.equal(companion.relationshipId, BE3_U08_OPENER_SB_WB_RELATIONSHIP_ID)
  assert.equal(
    isExactBe3U08OpenerNllCardComparisonScope({
      activityCards,
      workbookActivityCards,
      companion,
    }),
    true,
  )

  assert.equal(
    isExactBe3U08OpenerNllCardComparisonScope({
      activityCards: activityCards.slice(0, 4),
      workbookActivityCards,
      companion,
    }),
    false,
  )
  assert.equal(
    isExactBe3U08OpenerNllCardComparisonScope({
      activityCards,
      workbookActivityCards: workbookActivityCards.slice(0, 3),
      companion,
    }),
    false,
  )
  assert.equal(
    isExactBe3U08OpenerNllCardComparisonScope({
      activityCards,
      workbookActivityCards,
      companion: {
        ...companion,
        relationshipId: 'be3_sb_wb_rel_u08_story_sb130-131_wb106',
        studentBookPrintedPages: [130, 131],
        workbookPrintedPages: [106],
      },
    }),
    false,
  )
  assert.equal(
    isExactBe3U08OpenerNllCardComparisonScope({
      activityCards,
      workbookActivityCards,
      companion: {
        ...companion,
        workbookPrintedPages: [104, 105, 107],
      },
    }),
    false,
  )
  assert.equal(
    isExactBe3U08OpenerNllCardComparisonScope({
      activityCards,
      workbookActivityCards,
      companion: null,
    }),
    false,
  )
})

test('maps all nine seeded NLL summaries by activity_id with POC text identity', () => {
  const mapped = mapResolvedNllComponentToCardSummaries(seededOpenerResolved())
  assert.equal(mapped.status, 'success')
  assert.equal(mapped.byActivityId.size, 9)

  for (const activityId of BE3_U08_ACTIVITY_IDS) {
    const poc = getBe3U08ActivitySummary(activityId)
    const nll = mapped.byActivityId.get(activityId)
    assert.ok(poc)
    assert.ok(nll)
    assert.equal(nll.text, poc.text)
    assert.equal(nll.evidenceSufficiency, poc.evidenceSufficiency)
  }
  for (const activityId of BE3_U08_WB_ACTIVITY_IDS) {
    const poc = getBe3U08WbActivitySummary(activityId)
    const nll = mapped.byActivityId.get(activityId)
    assert.ok(poc)
    assert.ok(nll)
    assert.equal(nll.text, poc.text)
    assert.equal(nll.evidenceSufficiency, poc.evidenceSufficiency)
  }

  const activity3 = mapped.byActivityId.get('bep3_sb_act_08_03')
  assert.ok(activity3)
  assert.equal(activity3.evidenceSufficiency, 'insufficient')
  assert.match(activity3.text, /only says “Play a game\.”/)
})

test('missing summary, empty component, unavailable client, and load failure are honest', async () => {
  assert.deepEqual(mapResolvedNllComponentToCardSummaries(null), {
    status: 'empty',
    byActivityId: new Map(),
  })

  const emptyResolved = assembleNeutralLessonComponent({
    component: {
      id: COMPONENT_ID,
      component_key: BE3_U08_OPENER_NLL_COMPONENT_KEY,
      title: 'Big English 3 Unit 8 Opener',
      status: 'draft',
      created_at: '2026-10-29T00:00:00.000Z',
    },
    memberships: [
      {
        component_id: COMPONENT_ID,
        activity_id: 'bep3_sb_act_08_01',
        position: 1,
      },
    ],
    summaries: [],
    ssLinks: [],
    includeHiddenExperimental: true,
  })
  const emptyMapped = mapResolvedNllComponentToCardSummaries(emptyResolved)
  assert.equal(emptyMapped.status, 'empty')
  assert.equal(emptyMapped.byActivityId.size, 0)

  const unavailable = await loadNllCardComparisonSummaries({ client: null })
  assert.equal(unavailable.kind, 'unavailable')

  const failed = await loadNllCardComparisonSummaries({
    client: {} as SupabaseClient,
    loadComponent: async () => {
      throw new Error('network down')
    },
  })
  assert.equal(failed.kind, 'error')

  const success = await loadNllCardComparisonSummaries({
    client: {} as SupabaseClient,
    loadComponent: async (_client, key, options) => {
      assert.equal(key, BE3_U08_OPENER_NLL_COMPONENT_KEY)
      assert.equal(options?.includeHiddenExperimental, true)
      return seededOpenerResolved()
    },
  })
  assert.equal(success.kind, 'success')
  if (success.kind === 'success') {
    assert.equal(success.byActivityId.size, 9)
  }

  const missingDisplay = toNllCardComparisonDisplayState({
    loadStatus: 'success',
    byActivityId: new Map([
      [
        'bep3_sb_act_08_01',
        { text: 'ok', evidenceSufficiency: 'sufficient' },
      ],
    ]),
    activityId: 'bep3_sb_act_08_99',
  })
  assert.equal(missingDisplay.status, 'empty')
  assert.equal(missingDisplay.summary, null)

  assert.equal(
    toNllCardComparisonDisplayState({
      loadStatus: 'loading',
      byActivityId: null,
      activityId: 'bep3_sb_act_08_01',
    }).status,
    'loading',
  )
  assert.equal(
    toNllCardComparisonDisplayState({
      loadStatus: 'unavailable',
      byActivityId: null,
      activityId: 'bep3_sb_act_08_01',
    }).status,
    'unavailable',
  )
})

test('shouldLoad gates query; single-flight lifecycle covers Strict Mode, cancel, reopen, and scope change', async () => {
  assert.equal(
    shouldLoadNllCardComparison({
      open: false,
      comparisonFlagEnabled: true,
      exactScopeEligible: true,
    }),
    false,
  )
  assert.equal(
    shouldLoadNllCardComparison({
      open: true,
      comparisonFlagEnabled: false,
      exactScopeEligible: true,
    }),
    false,
  )
  assert.equal(
    shouldLoadNllCardComparison({
      open: true,
      comparisonFlagEnabled: true,
      exactScopeEligible: false,
    }),
    false,
  )
  assert.equal(
    shouldLoadNllCardComparison({
      open: true,
      comparisonFlagEnabled: true,
      exactScopeEligible: true,
    }),
    true,
  )

  type LoadResult = Awaited<ReturnType<typeof loadNllCardComparisonSummaries>>
  const successResult: LoadResult = {
    kind: 'success',
    byActivityId: mapResolvedNllComponentToCardSummaries(seededOpenerResolved())
      .byActivityId,
  }

  resetNllCardComparisonSharedFlightForTests()
  let loadCount = 0
  const pendingLoads: Array<{
    readonly promise: Promise<LoadResult>
    readonly resolve: (value: LoadResult) => void
  }> = []
  const injectableLoad = async (): Promise<LoadResult> => {
    loadCount += 1
    let resolve!: (value: LoadResult) => void
    const promise = new Promise<LoadResult>((res) => {
      resolve = res
    })
    pendingLoads.push({ promise, resolve })
    return promise
  }

  const flush = async () => {
    await Promise.resolve()
    await Promise.resolve()
  }

  const appliedA: NllCardComparisonLifecycleState[] = []
  const appliedB: NllCardComparisonLifecycleState[] = []

  // Ineligible / flag-off path: no request.
  const stopIdle = subscribeNllCardComparisonLifecycle({
    shouldLoad: false,
    scopeKey: '',
    client: {} as SupabaseClient,
    loadSummaries: injectableLoad,
    apply: (next) => appliedA.push(next),
  })
  assert.equal(loadCount, 0)
  assert.equal(peekNllCardComparisonSharedFlightScopeKeyForTests(), null)
  assert.deepEqual(appliedA.at(-1), { status: 'idle', byActivityId: null })
  stopIdle()

  // Strict Mode: setup → cleanup → setup for the same scope joins one flight.
  appliedA.length = 0
  const stopFirst = subscribeNllCardComparisonLifecycle({
    shouldLoad: true,
    scopeKey: 'scope-opener',
    client: {} as SupabaseClient,
    loadSummaries: injectableLoad,
    apply: (next) => appliedA.push(next),
  })
  assert.equal(loadCount, 1)
  assert.equal(peekNllCardComparisonSharedFlightScopeKeyForTests(), 'scope-opener')
  assert.equal(appliedA.at(-1)?.status, 'loading')
  const firstFlight = pendingLoads[0]!
  stopFirst()

  const stopSecond = subscribeNllCardComparisonLifecycle({
    shouldLoad: true,
    scopeKey: 'scope-opener',
    client: {} as SupabaseClient,
    loadSummaries: injectableLoad,
    apply: (next) => appliedB.push(next),
  })
  assert.equal(
    loadCount,
    1,
    'Strict Mode remount must reuse the in-flight promise',
  )
  assert.equal(appliedB.at(-1)?.status, 'loading')

  firstFlight.resolve(successResult)
  await firstFlight.promise
  await flush()

  assert.equal(
    appliedA.some((entry) => entry.status === 'success'),
    false,
    'cancelled Strict Mode subscriber must not apply',
  )
  assert.equal(appliedB.at(-1)?.status, 'success')
  assert.equal(appliedB.at(-1)?.byActivityId?.size, 9)

  // Closing / becoming ineligible clears flight; no further request.
  appliedB.length = 0
  stopSecond()
  const stopClosed = subscribeNllCardComparisonLifecycle({
    shouldLoad: false,
    scopeKey: 'scope-opener',
    client: {} as SupabaseClient,
    loadSummaries: injectableLoad,
    apply: (next) => appliedB.push(next),
  })
  assert.equal(peekNllCardComparisonSharedFlightScopeKeyForTests(), null)
  assert.deepEqual(appliedB.at(-1), { status: 'idle', byActivityId: null })
  const loadsAfterClose = loadCount
  stopClosed()

  // Reopen may perform a fresh request.
  appliedA.length = 0
  const stopReopen = subscribeNllCardComparisonLifecycle({
    shouldLoad: true,
    scopeKey: 'scope-opener',
    client: {} as SupabaseClient,
    loadSummaries: injectableLoad,
    apply: (next) => appliedA.push(next),
  })
  assert.equal(loadCount, loadsAfterClose + 1)
  const reopenFlight = pendingLoads[loadsAfterClose]!
  reopenFlight.resolve(successResult)
  await reopenFlight.promise
  await flush()
  assert.equal(appliedA.at(-1)?.status, 'success')
  stopReopen()
  subscribeNllCardComparisonLifecycle({
    shouldLoad: false,
    scopeKey: '',
    client: null,
    loadSummaries: injectableLoad,
    apply: () => {},
  })()

  // Different eligible scope → fresh request; late prior-flight result ignored.
  const appliedOld: NllCardComparisonLifecycleState[] = []
  const appliedNew: NllCardComparisonLifecycleState[] = []
  const loadsBeforeScopeChange = loadCount
  const stopOldScope = subscribeNllCardComparisonLifecycle({
    shouldLoad: true,
    scopeKey: 'scope-a',
    client: {} as SupabaseClient,
    loadSummaries: injectableLoad,
    apply: (next) => appliedOld.push(next),
  })
  assert.equal(loadCount, loadsBeforeScopeChange + 1)
  const oldFlight = pendingLoads[loadsBeforeScopeChange]!
  stopOldScope()

  const stopNewScope = subscribeNllCardComparisonLifecycle({
    shouldLoad: true,
    scopeKey: 'scope-b',
    client: {} as SupabaseClient,
    loadSummaries: injectableLoad,
    apply: (next) => appliedNew.push(next),
  })
  assert.equal(loadCount, loadsBeforeScopeChange + 2)
  assert.equal(peekNllCardComparisonSharedFlightScopeKeyForTests(), 'scope-b')
  const newFlight = pendingLoads[loadsBeforeScopeChange + 1]!

  oldFlight.resolve(successResult)
  await oldFlight.promise
  await flush()
  assert.equal(
    appliedOld.some((entry) => entry.status === 'success'),
    false,
  )
  assert.equal(appliedNew.at(-1)?.status, 'loading')

  newFlight.resolve({ kind: 'unavailable' })
  await newFlight.promise
  await flush()
  assert.equal(appliedNew.at(-1)?.status, 'unavailable')
  stopNewScope()

  // Overlay modal display moved to nllActivitySummaries; comparison module retained.
  const overlaySource = fs.readFileSync(OVERLAY_SOURCE, 'utf8')
  assert.doesNotMatch(overlaySource, /subscribeNllCardComparisonLifecycle/)
  assert.doesNotMatch(overlaySource, /toNllCardComparisonDisplayState/)
  assert.match(overlaySource, /subscribeNllActivitySummaryLifecycle/)
  assert.ok(!overlaySource.includes('loadNeutralLessonComponent('))
  assert.ok(!overlaySource.includes('loadNllCardComparisonSummaries('))

  const comparisonSource = fs.readFileSync(COMPARISON_SOURCE, 'utf8')
  assert.match(comparisonSource, /includeHiddenExperimental:\s*true/)
  assert.match(comparisonSource, /subscribeNllCardComparisonLifecycle/)
  assert.match(comparisonSource, /BE3_U08_OPENER_NLL_COMPONENT_KEY/)
  assert.match(comparisonSource, /@deprecated/)

  resetNllCardComparisonSharedFlightForTests()
})

test('card retains comparison chrome; overlay uses shared NLL summary path', () => {
  const cardSource = fs.readFileSync(CARD_SOURCE, 'utf8')
  assert.match(cardSource, /data-nll-card-comparison="true"/)
  assert.match(cardSource, /POC summary · experimental/)
  assert.match(cardSource, /NLL summary · experimental/)
  assert.match(cardSource, /AI summary · experimental/)
  assert.match(cardSource, /Insufficient evidence for a fuller summary/)
  assert.match(cardSource, /showNllActivitySummary = isModal && nllActivitySummary != null/)
  assert.match(cardSource, /data-nll-activity-summary/)
  assert.match(cardSource, /data-activity-card-layout="panel"/)
  assert.ok(!cardSource.includes('proposedSsLinks'))
  assert.ok(!cardSource.includes('staleness'))

  const overlaySource = fs.readFileSync(OVERLAY_SOURCE, 'utf8')
  assert.match(overlaySource, /nllActivitySummaryEligible/)
  assert.match(overlaySource, /nllActivitySummary=\{/)
  assert.match(overlaySource, /onSelectedChange/)
  assert.doesNotMatch(overlaySource, /getBe3U08ActivitySummary/)
  assert.doesNotMatch(overlaySource, /getBe3U08WbActivitySummary/)
  assert.doesNotMatch(overlaySource, /showSbExperimentalSummary/)
  assert.doesNotMatch(overlaySource, /nllCardComparisonEligible/)

  const leftPanel = fs.readFileSync(LEFT_PANEL_SOURCE, 'utf8')
  assert.ok(!leftPanel.includes('nllComparison'))
  assert.ok(!leftPanel.includes('nllCardComparison'))
  assert.ok(!leftPanel.includes('VITE_CHALKIE_NLL_CARD_COMPARISON'))
  assert.ok(!leftPanel.includes('nllActivitySummary'))

  const comparisonSource = fs.readFileSync(COMPARISON_SOURCE, 'utf8')
  assert.match(comparisonSource, /isExactBe3U08ActivityEnrichmentPocScope/)
  assert.match(comparisonSource, /isExactBe3U08WorkbookEnrichmentPocScope/)
  assert.ok(!comparisonSource.includes('buildNllShadowLessonPackage'))
})
