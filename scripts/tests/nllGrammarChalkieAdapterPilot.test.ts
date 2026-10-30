/**
 * Grammar-C NLL -> NLP -> Chalkie adapter pilot tests.
 * Run: npx tsx --test scripts/tests/nllGrammarChalkieAdapterPilot.test.ts
 *
 * Uses synthetic exact-scope fixtures so the suite can run when the gitignored
 * WB canonical is absent. Does not fabricate or substitute that file.
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
  NLL_CHALKIE_STORY_ADAPTER_PILOT_ENV,
  isNllStoryChalkieAdapterPilotEnabled,
} from '../../app/src/features/chalkie/nllStoryChalkieAdapterPilot.ts'
import { BE3_U08_STORY_NEUTRAL_CANARY_ENV } from '../../app/src/features/chalkie/be3U08StoryNeutralCanary.ts'
import {
  BE3_U08_GRAMMAR_NLL_COMPONENT_KEY,
  BE3_U08_GRAMMAR_SERIES_RELATIONSHIP_ID,
  BE3_U08_GRAMMAR_SERIES_STABLE_REF,
  NLL_CHALKIE_GRAMMAR_ADAPTER_PILOT_ENV,
  assembleNllGrammarChalkieAdapterPilot,
  invalidateNllGrammarChalkieAdapterPilotRequest,
  isExactBe3U08GrammarNllChalkieAdapterScope,
  isNllGrammarChalkieAdapterPilotEnabled,
  nllGrammarChalkieAdapterRequestKey,
  shouldApplyNllGrammarChalkieAdapterPilotResult,
  shouldRunNllGrammarChalkieAdapterPilot,
} from '../../app/src/features/chalkie/nllGrammarChalkieAdapterPilot.ts'
import {
  NLL_CHALKIE_LIA_ADAPTER_PILOT_ENV,
  isNllLiaChalkieAdapterPilotEnabled,
} from '../../app/src/features/chalkie/nllLiaChalkieAdapterPilot.ts'
import { buildNeutralSbWbLessonPackage } from '../../app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts'
import {
  createDefaultSbActivitySelection,
  createSbActivityHandoffSelection,
  setSbActivityCardSelected,
  type SbActivityCard,
} from '../../app/src/features/chalkie/chalkieActivitySelection.ts'
import {
  createDefaultWbActivitySelection,
  createWbActivityHandoffSelection,
  setWbActivityCardSelected,
  type WbActivityCard,
} from '../../app/src/features/chalkie/chalkieWorkbookActivitySelection.ts'
import { renderChalkieFromNeutralPackage } from '../../app/src/features/chalkie/renderChalkieFromNeutralPackage.ts'
import { BE3_U08_SB136_137_WB111_112 } from '../../app/src/features/chalkie/verifiedSbWbCompanions.ts'
import type { TeacherChoiceSuggestion } from '../../app/src/features/chalkie/teacherChoiceSuggestions.ts'
import type {
  NllActivitySummaryRow,
  ResolvedNllComponent,
} from '../../app/src/features/nll/neutralLessonLibrary.ts'
import type { VerifiedSbWbCompanion } from '../../app/src/features/chalkie/resolveVerifiedSbWbCompanion.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OVERLAY_SOURCE = path.join(
  ROOT,
  'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx',
)
const ENV_EXAMPLE = path.join(ROOT, '.env.example')
const VITE_ENV = path.join(ROOT, 'app/src/vite-env.d.ts')
const BE3_WB_PATH = path.join(
  ROOT,
  'data/phase1/big_english_3_wb/canonical/v1.json',
)
const NLL_ONLY_TEXT = 'NLL-ONLY-GRAMMAR-SUMMARY-MUST-STAY-IN-THE-PACKAGE'

const GRAMMAR_SB_DEFS = [
  {
    activityId: 'bep3_sb_act_08_19',
    pageId: 'bep3_sb_p136',
    printedPage: 136,
    activityNumber: '19',
    wording:
      "Look, listen, and read. How did Donna's dad come home?",
    audio: true,
    audioNote: 'Audio 159',
  },
  {
    activityId: 'bep3_sb_act_08_20',
    pageId: 'bep3_sb_p136',
    printedPage: 136,
    activityNumber: '20',
    wording:
      'Copy the chart in your notebook and complete. Use the words from the box.',
    audio: false,
    audioNote: null,
  },
  {
    activityId: 'bep3_sb_act_08_21',
    pageId: 'bep3_sb_p137',
    printedPage: 137,
    activityNumber: '21',
    wording: 'Read and complete.',
    audio: false,
    audioNote: null,
  },
  {
    activityId: 'bep3_sb_act_08_22',
    pageId: 'bep3_sb_p137',
    printedPage: 137,
    activityNumber: '22',
    wording: 'Read and match.',
    audio: false,
    audioNote: null,
  },
  {
    activityId: 'bep3_sb_act_08_23',
    pageId: 'bep3_sb_p137',
    printedPage: 137,
    activityNumber: '23',
    wording: 'Tell your partner about what you did yesterday.',
    audio: false,
    audioNote: null,
  },
] as const

const GRAMMAR_WB_DEFS = [
  {
    activityId: 'bep_3_wb_act_111_15',
    pageId: 'bep_3_wb_p111',
    printedPage: 111,
    activityNumber: '15',
    wording: 'Complete the chart. Use the words from the box.',
    audio: false,
    audioNote: null,
  },
  {
    activityId: 'bep_3_wb_act_111_16',
    pageId: 'bep_3_wb_p111',
    printedPage: 111,
    activityNumber: '16',
    wording: 'Read and write.',
    audio: false,
    audioNote: null,
  },
  {
    activityId: 'bep_3_wb_act_111_17',
    pageId: 'bep_3_wb_p111',
    printedPage: 111,
    activityNumber: '17',
    wording:
      'Read and write. Use the correct form of the verb in parentheses.',
    audio: false,
    audioNote: null,
  },
  {
    activityId: 'bep_3_wb_act_112_18',
    pageId: 'bep_3_wb_p112',
    printedPage: 112,
    activityNumber: '18',
    wording: 'Complete the questions and answers.',
    audio: false,
    audioNote: null,
  },
  {
    activityId: 'bep_3_wb_act_112_19',
    pageId: 'bep_3_wb_p112',
    printedPage: 112,
    activityNumber: '19',
    wording: 'Write negative sentences.',
    audio: false,
    audioNote: null,
  },
] as const

function makeSbCard(
  def: (typeof GRAMMAR_SB_DEFS)[number],
): SbActivityCard {
  const references = {
    activityId: def.activityId,
    bookId: 'big_english_3_sb',
    unitId: 'big_english_3_sb_unit_08',
    pageId: def.pageId,
    verificationStatus: 'human_verified' as const,
  }
  const evidence = {
    cardId: `sb-card-${def.activityId}`,
    source: 'SB' as const,
    pageId: def.pageId,
    printedPage: def.printedPage,
    activityNumber: def.activityNumber,
    verifiedWording: def.wording,
    activityType: 'grammar_practice',
    prompt: null,
    expectedAnswer: null,
    languageFrame: null,
    audioDependency: def.audio,
    visualDependency: false,
    sourceDependencyNote: def.audioNote,
    items: [],
    references,
  }
  return {
    id: evidence.cardId,
    source: 'SB',
    pageId: def.pageId,
    printedPage: def.printedPage,
    activityNumber: def.activityNumber,
    verifiedWording: def.wording,
    preview: { kind: 'empty', values: [] },
    activityLinkedModels: [],
    pageDedicatedVocabulary: [],
    pageDedicatedLanguage: [],
    references,
    evidence,
  }
}

function makeWbCard(
  def: (typeof GRAMMAR_WB_DEFS)[number],
): WbActivityCard {
  const references = [
    {
      activityId: def.activityId,
      bookId: 'big_english_3_wb',
      unitId: 'big_english_3_wb_unit_08',
      pageId: def.pageId,
      verificationStatus: 'human_verified' as const,
    },
  ]
  const evidence = {
    cardId: `wb-card-${def.activityId}`,
    source: 'WB' as const,
    pageId: def.pageId,
    printedPage: def.printedPage,
    activityNumber: def.activityNumber,
    verifiedWording: def.wording,
    activityType: 'workbook_practice',
    prompt: null,
    expectedAnswer: null,
    languageFrame: null,
    audioDependency: def.audio,
    visualDependency: def.activityNumber === '18',
    sourceDependencyNote: def.audioNote,
    items: [],
    references,
  }
  return {
    id: evidence.cardId,
    source: 'WB',
    pageId: def.pageId,
    printedPage: def.printedPage,
    activityNumber: def.activityNumber,
    verifiedWording: def.wording,
    preview: { kind: 'empty', values: [] },
    activityLinkedModels: [],
    pageDedicatedVocabulary: [],
    pageDedicatedLanguage: [],
    references,
    evidence,
  }
}

function grammarFixture() {
  const companion = {
    ...BE3_U08_SB136_137_WB111_112,
    source: 'curated_verified' as const,
  } satisfies VerifiedSbWbCompanion
  return {
    companion,
    sbCards: GRAMMAR_SB_DEFS.map(makeSbCard),
    wbCards: GRAMMAR_WB_DEFS.map(makeWbCard),
  }
}

type GrammarFixture = ReturnType<typeof grammarFixture>

function allSelections(fixture: GrammarFixture) {
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

function activityIds(fixture: GrammarFixture): string[] {
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
    provenance: { generator: 'grammar-c-test' },
    created_at: '2026-10-30T00:00:00.000Z',
  }
}

function resolvedComponent(
  ids: readonly string[],
  options?: {
    readonly omitPreferredFor?: string
    readonly wrongKey?: boolean
    readonly activities?: ResolvedNllComponent['activities']
  },
): ResolvedNllComponent {
  return {
    component: {
      id: '3e800008-0000-4000-8000-000000000004',
      component_key: options?.wrongKey
        ? 'be3-u08-story'
        : BE3_U08_GRAMMAR_NLL_COMPONENT_KEY,
      title: 'Big English 3 Unit 8 Grammar',
      status: 'draft',
      created_at: '2026-10-30T00:00:00.000Z',
    },
    activities:
      options?.activities ??
      ids.map((activityId, index) => {
        const summary = summaryRow(activityId)
        const preferred =
          options?.omitPreferredFor === activityId
            ? null
            : {
                ...summary,
                staleness: 'current' as const,
                currentActivitySha256: summary.activity_sha256,
              }
        return {
          activityId,
          position: index + 1,
          preferredSummary: preferred,
        }
      }),
    curriculumAuthorityLinks: [],
    proposedSsLinks: [
      {
        id: '3e800008-0000-4000-8000-000000000401',
        component_id: '3e800008-0000-4000-8000-000000000004',
        ss_entity_kind: 'structures',
        ss_entity_id: 'big_english_3_ss_unit_08_structures_order_2',
        link_status: 'proposed',
        notes: 'proposed only',
        created_at: '2026-10-30T00:00:00.000Z',
      },
    ],
  }
}

function withPreferredMemberships(
  entries: readonly {
    readonly activityId: string
    readonly position: number | null
  }[],
): ResolvedNllComponent['activities'] {
  return entries.map((entry) => {
    const summary = summaryRow(entry.activityId)
    return {
      activityId: entry.activityId,
      position: entry.position,
      preferredSummary: {
        ...summary,
        staleness: 'current' as const,
        currentActivitySha256: summary.activity_sha256,
      },
    }
  })
}

const selectedSuggestion: TeacherChoiceSuggestion = {
  id: 'prior-grammar-1',
  label: 'Teacher-selected Grammar prior language',
  source: 'Verified prior source',
  frame: 'Selected Grammar prior frame.',
  whyItMayHelp: 'Test fixture.',
  caution: 'Test fixture.',
  evidenceNote: 'Verified prior evidence.',
  provenanceTag: '[PRIOR]',
}

function successfulInput(fixture = grammarFixture()) {
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
          title: 'Teacher Grammar addition',
          frame: 'Teacher-added Grammar frame.',
          purpose: 'Teacher purpose.',
        },
      ],
      client: null,
      loadNll: async () => resolvedComponent(activityIds(fixture)),
    },
  }
}

test('Grammar-C flag defaults off and the run gate isolates exact Grammar series Chalkie scope', () => {
  assert.equal(isNllGrammarChalkieAdapterPilotEnabled({}), false)
  assert.equal(
    isNllGrammarChalkieAdapterPilotEnabled({
      [NLL_CHALKIE_GRAMMAR_ADAPTER_PILOT_ENV]: 'false',
    }),
    false,
  )
  assert.equal(
    isNllGrammarChalkieAdapterPilotEnabled({
      [NLL_CHALKIE_GRAMMAR_ADAPTER_PILOT_ENV]: 'true',
    }),
    true,
  )
  assert.equal(
    shouldRunNllGrammarChalkieAdapterPilot({
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
    assert.equal(shouldRunNllGrammarChalkieAdapterPilot(gate), false)
  }
})

test('Grammar-C, Opener, Story, and Story-canary flags remain independent', () => {
  assert.equal(
    isNllGrammarChalkieAdapterPilotEnabled({
      [NLL_CHALKIE_GRAMMAR_ADAPTER_PILOT_ENV]: 'true',
      [NLL_CHALKIE_ADAPTER_PILOT_ENV]: 'false',
      [NLL_CHALKIE_STORY_ADAPTER_PILOT_ENV]: 'false',
      [BE3_U08_STORY_NEUTRAL_CANARY_ENV]: 'true',
    }),
    true,
  )
  assert.equal(
    isNllChalkieAdapterPilotEnabled({
      [NLL_CHALKIE_GRAMMAR_ADAPTER_PILOT_ENV]: 'true',
      [NLL_CHALKIE_ADAPTER_PILOT_ENV]: 'false',
    }),
    false,
  )
  assert.equal(
    isNllStoryChalkieAdapterPilotEnabled({
      [NLL_CHALKIE_GRAMMAR_ADAPTER_PILOT_ENV]: 'true',
      [NLL_CHALKIE_STORY_ADAPTER_PILOT_ENV]: 'false',
    }),
    false,
  )
  assert.equal(
    isNllGrammarChalkieAdapterPilotEnabled({
      [NLL_CHALKIE_ADAPTER_PILOT_ENV]: 'true',
      [NLL_CHALKIE_STORY_ADAPTER_PILOT_ENV]: 'true',
    }),
    false,
  )
})

test('flag off and non-Grammar scopes do not load Grammar NLL', async () => {
  const { fixture, input } = successfulInput()
  let loadCalls = 0
  const loadNll = async (
    _client: unknown,
    componentKey: string,
  ) => {
    loadCalls += 1
    assert.equal(componentKey, BE3_U08_GRAMMAR_NLL_COMPONENT_KEY)
    return resolvedComponent(activityIds(fixture))
  }

  const flagOff = await assembleNllGrammarChalkieAdapterPilot({
    ...input,
    flagEnabled: false,
    loadNll,
  })
  assert.deepEqual(flagOff.ok ? null : flagOff.reason, 'flag_off')
  assert.equal(loadCalls, 0)

  const wrongRelationship = {
    ...fixture.companion,
    relationshipId: 'be3_sb_wb_rel_u08_story_sb130-131_wb106',
  }
  const wrongRel = await assembleNllGrammarChalkieAdapterPilot({
    ...input,
    companion: wrongRelationship,
    loadNll,
  })
  assert.deepEqual(wrongRel.ok ? null : wrongRel.reason, 'ineligible_scope')
  assert.equal(loadCalls, 0)

  const wrongPages = {
    ...fixture.companion,
    workbookPrintedPages: [106],
  }
  const wrongPage = await assembleNllGrammarChalkieAdapterPilot({
    ...input,
    companion: wrongPages,
    loadNll,
  })
  assert.deepEqual(wrongPage.ok ? null : wrongPage.reason, 'ineligible_scope')
  assert.equal(loadCalls, 0)

  assert.equal(
    isExactBe3U08GrammarNllChalkieAdapterScope({
      activityCards: fixture.sbCards.slice(0, 1),
      workbookActivityCards: fixture.wbCards,
      companion: fixture.companion,
    }),
    false,
  )
})

test('exact Grammar scope is eligible and all-selected keeps ten activities package-only', async () => {
  const { fixture, input } = successfulInput()
  assert.equal(
    isExactBe3U08GrammarNllChalkieAdapterScope({
      activityCards: fixture.sbCards,
      workbookActivityCards: fixture.wbCards,
      companion: fixture.companion,
    }),
    true,
  )

  const result = await assembleNllGrammarChalkieAdapterPilot(input)
  assert.equal(result.ok, true)
  if (!result.ok) return

  assert.equal(result.nlp.identity.packageReference, BE3_U08_GRAMMAR_SERIES_STABLE_REF)
  assert.equal(
    result.nlp.identity.relationshipId,
    BE3_U08_GRAMMAR_SERIES_RELATIONSHIP_ID,
  )
  assert.equal(result.nlp.lesson1.selectedActivities.length, 5)
  assert.equal(result.nlp.lesson2.selectedActivities.length, 5)
  assert.equal(result.nlp.derivedKnowledge?.activitySummaries.length, 10)
  assert.equal(result.nlp.curriculumInterpretation, undefined)
  assert.match(result.handoff.detailedHandoff, /Selected Grammar prior frame\./)
  assert.match(result.handoff.detailedHandoff, /Teacher-added Grammar frame\./)
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
  assert.deepEqual(result.nlp.lesson1.scope.printedPages, [136, 137])
  assert.deepEqual(result.nlp.lesson2.scope.printedPages, [111, 112])
})

test('partial SB/WB selection renders only selected activities', async () => {
  const fixture = grammarFixture()
  const keepSb = new Set([
    'bep3_sb_act_08_20',
    'bep3_sb_act_08_21',
    'bep3_sb_act_08_22',
    'bep3_sb_act_08_23',
  ])
  const keepWb = new Set([
    'bep_3_wb_act_111_16',
    'bep_3_wb_act_111_17',
    'bep_3_wb_act_112_19',
  ])
  let sbState = createDefaultSbActivitySelection(fixture.sbCards)
  for (const card of fixture.sbCards) {
    if (!keepSb.has(card.references.activityId)) {
      sbState = setSbActivityCardSelected({
        cards: fixture.sbCards,
        state: sbState,
        cardId: card.id,
        selected: false,
      })
    }
  }
  let wbState = createDefaultWbActivitySelection(fixture.wbCards)
  for (const card of fixture.wbCards) {
    if (!keepWb.has(card.references[0]?.activityId ?? '')) {
      wbState = setWbActivityCardSelected({
        cards: fixture.wbCards,
        state: wbState,
        cardId: card.id,
        selected: false,
      })
    }
  }

  const result = await assembleNllGrammarChalkieAdapterPilot({
    ...successfulInput(fixture).input,
    sbSelection: createSbActivityHandoffSelection(fixture.sbCards, sbState),
    wbSelection: createWbActivityHandoffSelection(fixture.wbCards, wbState),
  })
  assert.equal(result.ok, true)
  if (!result.ok) return

  assert.equal(result.nlp.lesson1.selectedActivities.length, 4)
  assert.equal(result.nlp.lesson2.selectedActivities.length, 3)
  assert.doesNotMatch(
    result.handoff.detailedHandoff,
    /\[SB p\.136\] Activity 19:/,
  )
  assert.doesNotMatch(result.handoff.lesson1Outline, /\[SB\] Activity 19/)
  assert.doesNotMatch(result.handoff.detailedHandoff, /Audio 159/)
  assert.doesNotMatch(
    result.handoff.detailedHandoff,
    /\[WB p\.111\] Activity 15:/,
  )
  assert.doesNotMatch(result.handoff.lesson2Outline, /\[WB\] Activity 15/)
  assert.match(
    result.handoff.detailedHandoff,
    /\[WB p\.111\] Activity 16:/,
  )
})

test('zero SB, zero WB, and zero-both stay honest without reconstruction', async () => {
  const fixture = grammarFixture()

  async function assembleZero(zeroSb: boolean, zeroWb: boolean) {
    let sbState = createDefaultSbActivitySelection(fixture.sbCards)
    let wbState = createDefaultWbActivitySelection(fixture.wbCards)
    if (zeroSb) {
      for (const card of fixture.sbCards) {
        sbState = setSbActivityCardSelected({
          cards: fixture.sbCards,
          state: sbState,
          cardId: card.id,
          selected: false,
        })
      }
    }
    if (zeroWb) {
      for (const card of fixture.wbCards) {
        wbState = setWbActivityCardSelected({
          cards: fixture.wbCards,
          state: wbState,
          cardId: card.id,
          selected: false,
        })
      }
    }
    return assembleNllGrammarChalkieAdapterPilot({
      ...successfulInput(fixture).input,
      sbSelection: createSbActivityHandoffSelection(fixture.sbCards, sbState),
      wbSelection: createWbActivityHandoffSelection(fixture.wbCards, wbState),
    })
  }

  const zeroSb = await assembleZero(true, false)
  assert.equal(zeroSb.ok, true)
  if (zeroSb.ok) {
    assert.equal(zeroSb.nlp.lesson1.selectedActivities.length, 0)
    assert.match(
      zeroSb.handoff.detailedHandoff,
      /No current Student Book activities were selected/,
    )
    for (const card of fixture.sbCards) {
      assert.doesNotMatch(
        zeroSb.handoff.detailedHandoff,
        new RegExp(card.verifiedWording.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
      )
    }
  }

  const zeroWb = await assembleZero(false, true)
  assert.equal(zeroWb.ok, true)
  if (zeroWb.ok) {
    assert.equal(zeroWb.nlp.lesson2.selectedActivities.length, 0)
    assert.match(
      zeroWb.handoff.detailedHandoff,
      /No Workbook activities were selected/,
    )
  }

  const zeroBoth = await assembleZero(true, true)
  assert.equal(zeroBoth.ok, true)
  if (zeroBoth.ok) {
    assert.equal(zeroBoth.nlp.lesson1.selectedActivities.length, 0)
    assert.equal(zeroBoth.nlp.lesson2.selectedActivities.length, 0)
    assert.equal(zeroBoth.nlp.derivedKnowledge?.activitySummaries.length, 0)
    assert.equal(zeroBoth.nlp.boundaries.reconstructExcludedActivities, false)
  }
})

test('excluding WB Activity 18 while keeping Activity 19 stays selection-honest', async () => {
  const fixture = grammarFixture()
  const act18 = fixture.wbCards.find((card) => card.activityNumber === '18')
  assert.ok(act18)
  const wbState = setWbActivityCardSelected({
    cards: fixture.wbCards,
    state: createDefaultWbActivitySelection(fixture.wbCards),
    cardId: act18.id,
    selected: false,
  })
  const result = await assembleNllGrammarChalkieAdapterPilot({
    ...successfulInput(fixture).input,
    wbSelection: createWbActivityHandoffSelection(fixture.wbCards, wbState),
  })
  assert.equal(result.ok, true)
  if (!result.ok) return

  assert.equal(
    result.nlp.lesson2.selectedActivities.some(
      (activity) => activity.activityNumber === '18',
    ),
    false,
  )
  assert.equal(
    result.nlp.lesson2.selectedActivities.some(
      (activity) => activity.activityNumber === '19',
    ),
    true,
  )
  assert.doesNotMatch(
    result.handoff.detailedHandoff,
    /\[WB p\.112\] Activity 18:/,
  )
  assert.match(
    result.handoff.detailedHandoff,
    /\[WB p\.112\] Activity 19:/,
  )
  assert.doesNotMatch(
    result.handoff.detailedHandoff,
    /Was\/Were/,
  )
})

test('teacher inputs retain provenance and lesson targets', async () => {
  const result = await assembleNllGrammarChalkieAdapterPilot(successfulInput().input)
  assert.equal(result.ok, true)
  if (!result.ok) return

  assert.equal(result.nlp.priorSupport.length, 2)
  assert.equal(result.nlp.priorSupport[0]?.provenance, '[PRIOR]')
  assert.deepEqual(result.nlp.priorSupport[0]?.targetLessons, [
    'lesson1',
    'lesson2',
  ])
  assert.equal(
    result.nlp.priorSupport[1]?.provenance,
    '[TEACHER-ADDED · UNVERIFIED]',
  )
  assert.equal(result.nlp.priorSupport[1]?.purpose, 'Teacher purpose.')
  assert.match(result.handoff.detailedHandoff, /\[PRIOR\]/)
  assert.match(result.handoff.detailedHandoff, /\[TEACHER-ADDED · UNVERIFIED\]/)
  assert.match(result.handoff.detailedHandoff, /Purpose: Teacher purpose\./)
})

test('missing, incomplete, malformed NLL and package/renderer failures fall back', async () => {
  const { fixture, input } = successfulInput()

  const missing = await assembleNllGrammarChalkieAdapterPilot({
    ...input,
    loadNll: async () => null,
  })
  assert.deepEqual(missing.ok ? null : missing.reason, 'missing_component')

  const incomplete = await assembleNllGrammarChalkieAdapterPilot({
    ...input,
    loadNll: async () =>
      resolvedComponent(activityIds(fixture).slice(0, 5)),
  })
  assert.deepEqual(
    incomplete.ok ? null : incomplete.reason,
    'incomplete_component',
  )

  const noPreferred = await assembleNllGrammarChalkieAdapterPilot({
    ...input,
    loadNll: async () =>
      resolvedComponent(activityIds(fixture), {
        omitPreferredFor: 'bep3_sb_act_08_19',
      }),
  })
  assert.deepEqual(
    noPreferred.ok ? null : noPreferred.reason,
    'incomplete_component',
  )

  const wrongKey = await assembleNllGrammarChalkieAdapterPilot({
    ...input,
    loadNll: async () =>
      resolvedComponent(activityIds(fixture), { wrongKey: true }),
  })
  assert.deepEqual(
    wrongKey.ok ? null : wrongKey.reason,
    'incomplete_component',
  )

  const loadFailure = await assembleNllGrammarChalkieAdapterPilot({
    ...input,
    loadNll: async () => {
      throw new Error('load failed')
    },
  })
  assert.deepEqual(loadFailure.ok ? null : loadFailure.reason, 'load_error')

  const packageFailure = await assembleNllGrammarChalkieAdapterPilot({
    ...input,
    buildNeutralPackage: (() => {
      throw new Error('package failed')
    }) as typeof buildNeutralSbWbLessonPackage,
  })
  assert.deepEqual(
    packageFailure.ok ? null : packageFailure.reason,
    'package_error',
  )

  const rendererFailure = await assembleNllGrammarChalkieAdapterPilot({
    ...input,
    renderNeutral: (() => {
      throw new Error('renderer failed')
    }) as typeof renderChalkieFromNeutralPackage,
  })
  assert.deepEqual(
    rendererFailure.ok ? null : rendererFailure.reason,
    'renderer_error',
  )

  const missingClient = await assembleNllGrammarChalkieAdapterPilot({
    ...input,
    loadNll: undefined,
    client: null,
  })
  assert.deepEqual(
    missingClient.ok ? null : missingClient.reason,
    'missing_client',
  )
})

test('extra, duplicate, null-position, and wrong-order NLL memberships fail closed', async () => {
  const { fixture, input } = successfulInput()
  const ids = activityIds(fixture)

  const extra = await assembleNllGrammarChalkieAdapterPilot({
    ...input,
    loadNll: async () =>
      resolvedComponent(ids, {
        activities: withPreferredMemberships([
          ...ids.map((activityId, index) => ({
            activityId,
            position: index + 1,
          })),
          { activityId: 'bep3_sb_act_08_06', position: 10 },
        ]),
      }),
  })
  assert.deepEqual(extra.ok ? null : extra.reason, 'incomplete_component')

  const duplicate = await assembleNllGrammarChalkieAdapterPilot({
    ...input,
    loadNll: async () =>
      resolvedComponent(ids, {
        activities: withPreferredMemberships([
          ...ids.slice(0, 8).map((activityId, index) => ({
            activityId,
            position: index + 1,
          })),
          { activityId: ids[0]!, position: 9 },
        ]),
      }),
  })
  assert.deepEqual(duplicate.ok ? null : duplicate.reason, 'incomplete_component')

  const nullPosition = await assembleNllGrammarChalkieAdapterPilot({
    ...input,
    loadNll: async () =>
      resolvedComponent(ids, {
        activities: withPreferredMemberships(
          ids.map((activityId, index) => ({
            activityId,
            position: index === 0 ? null : index + 1,
          })),
        ),
      }),
  })
  assert.deepEqual(
    nullPosition.ok ? null : nullPosition.reason,
    'incomplete_component',
  )

  const wrongPosition = await assembleNllGrammarChalkieAdapterPilot({
    ...input,
    loadNll: async () =>
      resolvedComponent(ids, {
        activities: withPreferredMemberships(
          ids.map((activityId, index) => ({
            activityId,
            // Swap positions 1 and 2 while keeping IDs in array order.
            position:
              index === 0 ? 2 : index === 1 ? 1 : index + 1,
          })),
        ),
      }),
  })
  assert.deepEqual(
    wrongPosition.ok ? null : wrongPosition.reason,
    'incomplete_component',
  )

  const reorderedIds = await assembleNllGrammarChalkieAdapterPilot({
    ...input,
    loadNll: async () =>
      resolvedComponent(ids, {
        activities: withPreferredMemberships([
          { activityId: ids[1]!, position: 1 },
          { activityId: ids[0]!, position: 2 },
          ...ids.slice(2).map((activityId, index) => ({
            activityId,
            position: index + 3,
          })),
        ]),
      }),
  })
  assert.deepEqual(
    reorderedIds.ok ? null : reorderedIds.reason,
    'incomplete_component',
  )
})

test('Workbook wrong book, unit, page, or ambiguous references are ineligible', () => {
  const fixture = grammarFixture()
  assert.equal(
    isExactBe3U08GrammarNllChalkieAdapterScope({
      activityCards: fixture.sbCards,
      workbookActivityCards: fixture.wbCards,
      companion: fixture.companion,
    }),
    true,
  )

  const first = fixture.wbCards[0]!

  const wrongBook = [
    {
      ...first,
      references: [{ ...first.references[0]!, bookId: 'big_english_3_sb' }],
      evidence: {
        ...first.evidence,
        references: [
          { ...first.evidence.references[0]!, bookId: 'big_english_3_sb' },
        ],
      },
    },
    ...fixture.wbCards.slice(1),
  ]
  assert.equal(
    isExactBe3U08GrammarNllChalkieAdapterScope({
      activityCards: fixture.sbCards,
      workbookActivityCards: wrongBook,
      companion: fixture.companion,
    }),
    false,
  )

  const wrongUnit = [
    {
      ...first,
      references: [
        { ...first.references[0]!, unitId: 'big_english_3_wb_unit_07' },
      ],
      evidence: {
        ...first.evidence,
        references: [
          {
            ...first.evidence.references[0]!,
            unitId: 'big_english_3_wb_unit_07',
          },
        ],
      },
    },
    ...fixture.wbCards.slice(1),
  ]
  assert.equal(
    isExactBe3U08GrammarNllChalkieAdapterScope({
      activityCards: fixture.sbCards,
      workbookActivityCards: wrongUnit,
      companion: fixture.companion,
    }),
    false,
  )

  const wrongPageId = [
    {
      ...first,
      pageId: 'bep_3_wb_p106',
      references: [{ ...first.references[0]!, pageId: 'bep_3_wb_p106' }],
      evidence: {
        ...first.evidence,
        pageId: 'bep_3_wb_p106',
        references: [
          { ...first.evidence.references[0]!, pageId: 'bep_3_wb_p106' },
        ],
      },
    },
    ...fixture.wbCards.slice(1),
  ]
  assert.equal(
    isExactBe3U08GrammarNllChalkieAdapterScope({
      activityCards: fixture.sbCards,
      workbookActivityCards: wrongPageId,
      companion: fixture.companion,
    }),
    false,
  )

  const ambiguousRefs = [
    {
      ...first,
      references: [
        first.references[0]!,
        {
          ...first.references[0]!,
          activityId: 'bep_3_wb_act_111_16',
        },
      ],
      evidence: {
        ...first.evidence,
        references: [
          first.evidence.references[0]!,
          {
            ...first.evidence.references[0]!,
            activityId: 'bep_3_wb_act_111_16',
          },
        ],
      },
    },
    ...fixture.wbCards.slice(1),
  ]
  assert.equal(
    isExactBe3U08GrammarNllChalkieAdapterScope({
      activityCards: fixture.sbCards,
      workbookActivityCards: ambiguousRefs,
      companion: fixture.companion,
    }),
    false,
  )
})

test('Grammar remains BI-absent (D022)', async () => {
  const result = await assembleNllGrammarChalkieAdapterPilot(successfulInput().input)
  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.equal(result.nlp.curriculumInterpretation, undefined)
  assert.doesNotMatch(JSON.stringify(result.handoff), /phase2_interpretation/)
  assert.doesNotMatch(JSON.stringify(result.nlp), /phase2_interpretation/)
})

test('request identity and apply guards prevent stale Grammar-C results', () => {
  const fixture = grammarFixture()
  const selections = allSelections(fixture)
  const base = {
    activityCards: fixture.sbCards,
    workbookActivityCards: fixture.wbCards,
    companion: fixture.companion,
    ...selections,
    selectedSuggestions: [selectedSuggestion],
    teacherAdditions: [],
  }
  const requestKey = nllGrammarChalkieAdapterRequestKey(base)
  const changedKey = nllGrammarChalkieAdapterRequestKey({
    ...base,
    selectedSuggestions: [],
  })
  assert.notEqual(requestKey, changedKey)
  assert.equal(
    shouldApplyNllGrammarChalkieAdapterPilotResult({
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
    shouldApplyNllGrammarChalkieAdapterPilotResult({
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
    shouldApplyNllGrammarChalkieAdapterPilotResult({
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
    shouldApplyNllGrammarChalkieAdapterPilotResult({
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
  invalidateNllGrammarChalkieAdapterPilotRequest({ requestIdRef })
  assert.equal(requestIdRef.current, 4)
})

test('Create-a-prompt is wired to Grammar-C with sb_only fallback and no Grammar BI framing', () => {
  const overlay = fs.readFileSync(OVERLAY_SOURCE, 'utf8')
  const envExample = fs.readFileSync(ENV_EXAMPLE, 'utf8')
  const viteEnv = fs.readFileSync(VITE_ENV, 'utf8')
  assert.match(
    envExample,
    /^VITE_NLL_CHALKIE_GRAMMAR_ADAPTER_PILOT=false$/m,
  )
  assert.match(viteEnv, /VITE_NLL_CHALKIE_GRAMMAR_ADAPTER_PILOT/)
  assert.match(overlay, /assembleNllGrammarChalkieAdapterPilot\(\{/)
  assert.match(overlay, /shouldRunNllGrammarChalkieAdapterPilot\(/)
  assert.match(overlay, /grammarSeriesPackageRequested/)
  assert.match(
    overlay,
    /Grammar remains BI-absent: do not apply Opener BI framing/,
  )
  assert.match(
    overlay,
    /Grammar-C failure: retain current sb_only path with captured selections/,
  )
  assert.doesNotMatch(
    overlay,
    /assembleNllGrammarChalkieAdapterPilot[\s\S]{0,800}applyOpenerBiFramingToHandoff/,
  )
})

test('canonical WB availability note for retained regressions', () => {
  const present = fs.existsSync(BE3_WB_PATH)
  if (!present) {
    console.log(
      'BLOCKED note: data/phase1/big_english_3_wb/canonical/v1.json is absent; Grammar-C focused suite used synthetic fixtures. Canonical-dependent retained regressions remain blocked.',
    )
  }
  assert.equal(typeof present, 'boolean')
})
