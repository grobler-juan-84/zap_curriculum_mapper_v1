/**
 * Opener-only guarded neutral canary tests.
 * Run: npx tsx --test scripts/tests/be3U08OpenerNeutralCanary.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  BE3_U08_OPENER_NEUTRAL_CANARY_ENV,
  buildBe3U08OpenerSbWbSeriesHandoffWithNeutralCanary,
  isBe3U08OpenerNeutralCanaryEnabled,
  mapTeacherInputsToOpenerPriorSupport,
  type OpenerNeutralCanaryDiagnostic,
} from '../../app/src/features/chalkie/be3U08OpenerNeutralCanary.ts'
import { buildBe3U08OpenerSbWbSeriesHandoff } from '../../app/src/features/chalkie/buildBe3U08OpenerSbWbSeriesHandoff.ts'
import { buildBe3U08StorySbWbSeriesHandoff } from '../../app/src/features/chalkie/buildBe3U08StorySbWbSeriesHandoff.ts'
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
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const BE3_SB_PATH = path.join(
  ROOT,
  'data/phase1/big_english_3_sb/canonical/v1.json',
)
const BE3_WB_PATH = path.join(
  ROOT,
  'data/phase1/big_english_3_wb/canonical/v1.json',
)

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
  const wbCards = buildWbActivityCards({
    summary: wbSummary,
    companion,
  })
  return { companion, sbCards, wbCards }
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
  const sbCards = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: [130, 131],
  })
  const wbCards = buildWbActivityCards({
    summary: wbSummary,
    companion,
  })
  return { companion, sbCards, wbCards }
}

test('canary env flag defaults off and accepts explicit true values', () => {
  assert.equal(isBe3U08OpenerNeutralCanaryEnabled({}), false)
  assert.equal(
    isBe3U08OpenerNeutralCanaryEnabled({
      [BE3_U08_OPENER_NEUTRAL_CANARY_ENV]: 'false',
    }),
    false,
  )
  assert.equal(
    isBe3U08OpenerNeutralCanaryEnabled({
      [BE3_U08_OPENER_NEUTRAL_CANARY_ENV]: 'true',
    }),
    true,
  )
  assert.equal(
    isBe3U08OpenerNeutralCanaryEnabled({
      [BE3_U08_OPENER_NEUTRAL_CANARY_ENV]: '1',
    }),
    true,
  )
})

test('flag OFF uses bespoke only and does not invoke neutral assembly/rendering', () => {
  const fixture = openerFixture()
  let neutralCalls = 0
  let renderCalls = 0
  const result = buildBe3U08OpenerSbWbSeriesHandoffWithNeutralCanary({
    companion: fixture.companion,
    activitySelection: createSbActivityHandoffSelection(
      fixture.sbCards,
      createDefaultSbActivitySelection(fixture.sbCards),
    ),
    workbookActivitySelection: createWbActivityHandoffSelection(
      fixture.wbCards,
      createDefaultWbActivitySelection(fixture.wbCards),
    ),
    canaryEnabled: false,
    buildNeutralPackage: ((input) => {
      neutralCalls += 1
      return buildNeutralSbWbLessonPackage(input)
    }) as typeof buildNeutralSbWbLessonPackage,
    renderNeutral: ((lessonPackage) => {
      renderCalls += 1
      return renderChalkieFromNeutralPackage(lessonPackage)
    }) as typeof renderChalkieFromNeutralPackage,
  })

  assert.equal(result.servedFrom, 'bespoke')
  assert.equal(result.diagnostic, null)
  assert.equal(neutralCalls, 0)
  assert.equal(renderCalls, 0)
  assert.deepEqual(
    result.handoff,
    buildBe3U08OpenerSbWbSeriesHandoff({
      activitySelection: createSbActivityHandoffSelection(
        fixture.sbCards,
        createDefaultSbActivitySelection(fixture.sbCards),
      ),
      workbookActivitySelection: createWbActivityHandoffSelection(
        fixture.wbCards,
        createDefaultWbActivitySelection(fixture.wbCards),
      ),
    }),
  )
})

test('flag ON + all-selected serves neutral output on exact parity', () => {
  const fixture = openerFixture()
  const sbSelection = createSbActivityHandoffSelection(
    fixture.sbCards,
    createDefaultSbActivitySelection(fixture.sbCards),
  )
  const wbSelection = createWbActivityHandoffSelection(
    fixture.wbCards,
    createDefaultWbActivitySelection(fixture.wbCards),
  )
  const result = buildBe3U08OpenerSbWbSeriesHandoffWithNeutralCanary({
    companion: fixture.companion,
    activitySelection: sbSelection,
    workbookActivitySelection: wbSelection,
    canaryEnabled: true,
  })

  assert.equal(result.servedFrom, 'neutral_canary')
  assert.equal(result.diagnostic, null)
  assert.deepEqual(
    {
      detailedHandoff: result.handoff.detailedHandoff,
      lesson1Outline: result.handoff.lesson1Outline,
      lesson1Vocabulary: result.handoff.lesson1Vocabulary,
      lesson2Outline: result.handoff.lesson2Outline,
      lesson2Vocabulary: result.handoff.lesson2Vocabulary,
    },
    renderChalkieFromNeutralPackage(
      buildNeutralSbWbLessonPackage({
        companion: fixture.companion,
        sbSelection,
        wbSelection,
      }),
    ),
  )
})

test('flag ON + SB exclusion keeps excluded activity absent with exact parity', () => {
  const fixture = openerFixture()
  const excluded = fixture.sbCards.find(
    (card) => card.printedPage === 129 && card.activityNumber === '4',
  )
  assert.ok(excluded)
  const sbSelection = createSbActivityHandoffSelection(
    fixture.sbCards,
    setSbActivityCardSelected({
      cards: fixture.sbCards,
      state: createDefaultSbActivitySelection(fixture.sbCards),
      cardId: excluded.id,
      selected: false,
    }),
  )
  const wbSelection = createWbActivityHandoffSelection(
    fixture.wbCards,
    createDefaultWbActivitySelection(fixture.wbCards),
  )
  const result = buildBe3U08OpenerSbWbSeriesHandoffWithNeutralCanary({
    companion: fixture.companion,
    activitySelection: sbSelection,
    workbookActivitySelection: wbSelection,
    canaryEnabled: true,
  })

  assert.equal(result.servedFrom, 'neutral_canary')
  assert.doesNotMatch(
    result.handoff.detailedHandoff,
    /Listen and sing\. How does Zach feel today\?/,
  )
  assert.doesNotMatch(result.handoff.lesson1Outline, /Activity 4:/)
})

test('flag ON + WB exclusion keeps excluded activity absent with exact parity', () => {
  const fixture = openerFixture()
  const excluded = fixture.wbCards.find(
    (card) => card.printedPage === 105 && card.activityNumber === '3',
  )
  assert.ok(excluded)
  const sbSelection = createSbActivityHandoffSelection(
    fixture.sbCards,
    createDefaultSbActivitySelection(fixture.sbCards),
  )
  const wbSelection = createWbActivityHandoffSelection(
    fixture.wbCards,
    setWbActivityCardSelected({
      cards: fixture.wbCards,
      state: createDefaultWbActivitySelection(fixture.wbCards),
      cardId: excluded.id,
      selected: false,
    }),
  )
  const result = buildBe3U08OpenerSbWbSeriesHandoffWithNeutralCanary({
    companion: fixture.companion,
    activitySelection: sbSelection,
    workbookActivitySelection: wbSelection,
    canaryEnabled: true,
  })

  assert.equal(result.servedFrom, 'neutral_canary')
  assert.doesNotMatch(result.handoff.detailedHandoff, /Listen and write\./)
  assert.doesNotMatch(result.handoff.lesson2Outline, /Activity 3:/)
  assert.doesNotMatch(result.handoff.lesson2Vocabulary, /\benough\b/)
})

test('flag ON + partial page selection preserves exact parity without page leakage', () => {
  const fixture = openerFixture()
  const page129Cards = fixture.sbCards.filter((card) => card.printedPage === 129)
  assert.ok(page129Cards.length >= 2)
  let state = createDefaultSbActivitySelection(fixture.sbCards)
  state = setSbActivityCardSelected({
    cards: fixture.sbCards,
    state,
    cardId: page129Cards[0]!.id,
    selected: false,
  })
  const sbSelection = createSbActivityHandoffSelection(fixture.sbCards, state)
  const wbSelection = createWbActivityHandoffSelection(
    fixture.wbCards,
    createDefaultWbActivitySelection(fixture.wbCards),
  )
  const result = buildBe3U08OpenerSbWbSeriesHandoffWithNeutralCanary({
    companion: fixture.companion,
    activitySelection: sbSelection,
    workbookActivitySelection: wbSelection,
    canaryEnabled: true,
  })
  const bespoke = buildBe3U08OpenerSbWbSeriesHandoff({
    activitySelection: sbSelection,
    workbookActivitySelection: wbSelection,
  })

  assert.equal(result.servedFrom, 'neutral_canary')
  assert.equal(result.handoff.detailedHandoff, bespoke.detailedHandoff)
  assert.equal(result.handoff.lesson1Vocabulary, bespoke.lesson1Vocabulary)
  assert.doesNotMatch(result.handoff.detailedHandoff, /Language in Action|p\.130|p\.107/)
})

test('flag ON + zero selection keeps honest empty states', () => {
  const fixture = openerFixture()
  const result = buildBe3U08OpenerSbWbSeriesHandoffWithNeutralCanary({
    companion: fixture.companion,
    activitySelection: createSbActivityHandoffSelection(fixture.sbCards, {
      selectedCardIds: [],
    }),
    workbookActivitySelection: createWbActivityHandoffSelection(
      fixture.wbCards,
      { selectedCardIds: [] },
    ),
    canaryEnabled: true,
  })

  assert.equal(result.servedFrom, 'neutral_canary')
  assert.match(
    result.handoff.detailedHandoff,
    /No current Student Book activities were selected/,
  )
  assert.match(
    result.handoff.detailedHandoff,
    /No Workbook activities were selected/,
  )
  assert.equal(result.handoff.lesson1Vocabulary, '')
  assert.equal(
    result.handoff.lesson2Vocabulary,
    'No Workbook activities selected.',
  )
})

test('flag ON + prior/HM/teacher-added preserves provenance and package targets', () => {
  const fixture = openerFixture()
  const sbSelection = createSbActivityHandoffSelection(
    fixture.sbCards,
    createDefaultSbActivitySelection(fixture.sbCards),
  )
  const wbSelection = createWbActivityHandoffSelection(
    fixture.wbCards,
    createDefaultWbActivitySelection(fixture.wbCards),
  )
  const selectedSuggestions = [
    {
      id: 'prior-1',
      label: 'Earlier Unit 8 frame',
      source: 'BE3 SB Unit 8 p.126',
      frame: 'Did you eat breakfast?',
      whyItMayHelp: 'prior',
      caution: 'optional',
      evidenceNote: 'verified',
      provenanceTag: '[PRIOR]' as const,
    },
    {
      id: 'hm-1',
      label: 'Earlier-unit short answer',
      source: 'BE3 SB Unit 7',
      frame: 'Yes, I did.',
      whyItMayHelp: 'hm',
      caution: 'optional',
      evidenceNote: 'reviewed',
      provenanceTag: '[HM]' as const,
    },
  ]
  const teacherAdditions = [
    {
      title: 'Class reminder',
      frame: 'Use a full answer.',
      purpose: 'Optional response support',
    },
  ]
  const mapped = mapTeacherInputsToOpenerPriorSupport({
    selectedSuggestions,
    teacherAdditions,
  })
  assert.deepEqual(
    mapped.map((record) => ({
      provenance: record.provenance,
      targetLessons: [...record.targetLessons],
    })),
    [
      { provenance: '[PRIOR]', targetLessons: ['lesson1', 'lesson2'] },
      { provenance: '[HM]', targetLessons: ['lesson1', 'lesson2'] },
      {
        provenance: '[TEACHER-ADDED · UNVERIFIED]',
        targetLessons: ['lesson1', 'lesson2'],
      },
    ],
  )

  const result = buildBe3U08OpenerSbWbSeriesHandoffWithNeutralCanary({
    companion: fixture.companion,
    selectedSuggestions,
    teacherAdditions,
    activitySelection: sbSelection,
    workbookActivitySelection: wbSelection,
    canaryEnabled: true,
  })

  assert.equal(result.servedFrom, 'neutral_canary')
  assert.match(result.handoff.detailedHandoff, /\[PRIOR\] Earlier Unit 8 frame/)
  assert.match(result.handoff.detailedHandoff, /\[HM\] Earlier-unit short answer/)
  assert.match(
    result.handoff.detailedHandoff,
    /\[TEACHER-ADDED · UNVERIFIED\] Class reminder: Use a full answer\./,
  )
  assert.match(
    result.handoff.detailedHandoff,
    /Purpose: Optional response support/,
  )
})

test('forced renderer mismatch serves bespoke and emits bounded diagnostic', () => {
  const fixture = openerFixture()
  const diagnostics: OpenerNeutralCanaryDiagnostic[] = []
  const warnings: string[] = []
  const originalWarn = console.warn
  console.warn = (...args: unknown[]) => {
    warnings.push(String(args[0] ?? ''))
  }

  try {
    const result = buildBe3U08OpenerSbWbSeriesHandoffWithNeutralCanary({
      companion: fixture.companion,
      activitySelection: createSbActivityHandoffSelection(
        fixture.sbCards,
        createDefaultSbActivitySelection(fixture.sbCards),
      ),
      workbookActivitySelection: createWbActivityHandoffSelection(
        fixture.wbCards,
        createDefaultWbActivitySelection(fixture.wbCards),
      ),
      canaryEnabled: true,
      renderNeutral: () => ({
        detailedHandoff: 'FORCED_MISMATCH',
        lesson1Outline: 'FORCED_MISMATCH',
        lesson1Vocabulary: 'FORCED_MISMATCH',
        lesson2Outline: 'FORCED_MISMATCH',
        lesson2Vocabulary: 'FORCED_MISMATCH',
      }),
      onDiagnostic: (diagnostic) => {
        diagnostics.push(diagnostic)
      },
    })

    const bespoke = buildBe3U08OpenerSbWbSeriesHandoff({
      activitySelection: createSbActivityHandoffSelection(
        fixture.sbCards,
        createDefaultSbActivitySelection(fixture.sbCards),
      ),
      workbookActivitySelection: createWbActivityHandoffSelection(
        fixture.wbCards,
        createDefaultWbActivitySelection(fixture.wbCards),
      ),
    })

    assert.equal(result.servedFrom, 'bespoke')
    assert.deepEqual(result.handoff, bespoke)
    assert.ok(result.diagnostic)
    assert.equal(result.diagnostic?.reason, 'artifact_mismatch')
    assert.equal(
      result.diagnostic?.relationshipId,
      'be3_sb_wb_rel_u08_opener_sb128-129_wb104-105',
    )
    assert.ok(
      result.diagnostic?.mismatchedArtifacts.includes('detailedHandoff'),
    )
    assert.equal(diagnostics.length, 1)
    assert.match(warnings.join('\n'), /mismatch on detailedHandoff/)
    assert.doesNotMatch(warnings.join('\n'), /FORCED_MISMATCH|Live Right!/)
  } finally {
    console.warn = originalWarn
  }
})

test('Opener canary module stays Opener-only; Story uses its own canary wrapper', () => {
  const story = storyFixture()
  const storyHandoff = buildBe3U08StorySbWbSeriesHandoff({
    activitySelection: createSbActivityHandoffSelection(
      story.sbCards,
      createDefaultSbActivitySelection(story.sbCards),
    ),
    workbookActivitySelection: createWbActivityHandoffSelection(
      story.wbCards,
      createDefaultWbActivitySelection(story.wbCards),
    ),
  })
  assert.match(storyHandoff.detailedHandoff, /An Unhealthy Dinner|Story/)
  assert.doesNotMatch(storyHandoff.detailedHandoff, /p\.107/)

  const canarySource = fs.readFileSync(
    path.join(
      ROOT,
      'app/src/features/chalkie/be3U08OpenerNeutralCanary.ts',
    ),
    'utf8',
  )
  const storyBuilderSource = fs.readFileSync(
    path.join(
      ROOT,
      'app/src/features/chalkie/buildBe3U08StorySbWbSeriesHandoff.ts',
    ),
    'utf8',
  )
  const overlaySource = fs.readFileSync(
    path.join(
      ROOT,
      'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx',
    ),
    'utf8',
  )

  assert.ok(canarySource.includes('BE3_U08_OPENER_SERIES_RELATIONSHIP_ID'))
  assert.doesNotMatch(canarySource, /story_sb130-131/)
  assert.ok(
    overlaySource.includes('buildBe3U08OpenerSbWbSeriesHandoffWithNeutralCanary'),
  )
  assert.ok(
    overlaySource.includes('buildBe3U08StorySbWbSeriesHandoffWithNeutralCanary'),
  )
  assert.ok(!storyBuilderSource.includes('be3U08OpenerNeutralCanary'))
  assert.ok(!storyBuilderSource.includes('be3U08StoryNeutralCanary'))
})
