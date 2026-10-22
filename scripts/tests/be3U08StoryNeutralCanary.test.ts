/**
 * Story-only guarded neutral canary tests.
 * Run: npx tsx --test scripts/tests/be3U08StoryNeutralCanary.test.ts
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
} from '../../app/src/features/chalkie/be3U08OpenerNeutralCanary.ts'
import {
  BE3_U08_STORY_NEUTRAL_CANARY_ENV,
  buildBe3U08StorySbWbSeriesHandoffWithNeutralCanary,
  isBe3U08StoryNeutralCanaryEnabled,
  mapTeacherInputsToStoryPriorSupport,
  type StoryNeutralCanaryDiagnostic,
} from '../../app/src/features/chalkie/be3U08StoryNeutralCanary.ts'
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
  const wbCards = buildWbActivityCards({
    summary: wbSummary,
    companion,
  })
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
  const wbCards = buildWbActivityCards({
    summary: wbSummary,
    companion,
  })
  return { companion, sbCards, wbCards }
}

test('Story canary env flag defaults off and accepts explicit true values', () => {
  assert.equal(isBe3U08StoryNeutralCanaryEnabled({}), false)
  assert.equal(
    isBe3U08StoryNeutralCanaryEnabled({
      [BE3_U08_STORY_NEUTRAL_CANARY_ENV]: 'false',
    }),
    false,
  )
  assert.equal(
    isBe3U08StoryNeutralCanaryEnabled({
      [BE3_U08_STORY_NEUTRAL_CANARY_ENV]: 'true',
    }),
    true,
  )
  assert.equal(
    isBe3U08StoryNeutralCanaryEnabled({
      [BE3_U08_STORY_NEUTRAL_CANARY_ENV]: '1',
    }),
    true,
  )
})

test('flag OFF uses bespoke Story only and does not invoke neutral assembly/rendering', () => {
  const fixture = storyFixture()
  let neutralCalls = 0
  let renderCalls = 0
  const result = buildBe3U08StorySbWbSeriesHandoffWithNeutralCanary({
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
    buildBe3U08StorySbWbSeriesHandoff({
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
  assertNoWb107(result.handoff)
})

test('flag ON + all-selected serves neutral output on exact five-artifact parity', () => {
  const fixture = storyFixture()
  const sbSelection = createSbActivityHandoffSelection(
    fixture.sbCards,
    createDefaultSbActivitySelection(fixture.sbCards),
  )
  const wbSelection = createWbActivityHandoffSelection(
    fixture.wbCards,
    createDefaultWbActivitySelection(fixture.wbCards),
  )
  const result = buildBe3U08StorySbWbSeriesHandoffWithNeutralCanary({
    companion: fixture.companion,
    activitySelection: sbSelection,
    workbookActivitySelection: wbSelection,
    canaryEnabled: true,
  })
  const neutral = renderChalkieFromNeutralPackage(
    buildNeutralSbWbLessonPackage({
      companion: fixture.companion,
      sbSelection,
      wbSelection,
    }),
  )

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
    neutral,
  )
  assertNoWb107(result.handoff)
})

test('flag ON + SB exclusion keeps excluded activity absent with exact parity', () => {
  const fixture = storyFixture()
  const excluded = fixture.sbCards.find((card) => card.activityNumber === '6')
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
  const result = buildBe3U08StorySbWbSeriesHandoffWithNeutralCanary({
    companion: fixture.companion,
    activitySelection: sbSelection,
    workbookActivitySelection: wbSelection,
    canaryEnabled: true,
  })
  const bespoke = buildBe3U08StorySbWbSeriesHandoff({
    activitySelection: sbSelection,
    workbookActivitySelection: wbSelection,
  })

  assert.equal(result.servedFrom, 'neutral_canary')
  assert.equal(result.handoff.detailedHandoff, bespoke.detailedHandoff)
  assert.equal(result.handoff.lesson1Outline, bespoke.lesson1Outline)
  assert.doesNotMatch(
    result.handoff.detailedHandoff,
    /Listen and read\. Did Amy eat a healthy dinner\?/,
  )
  assert.doesNotMatch(result.handoff.lesson1Outline, /Activity 6|Track 154/)
  assert.match(result.handoff.detailedHandoff, /\[SB p\.131\] Activity 7/)
  assertNoWb107(result.handoff)
})

test('flag ON + WB p.106 exclusion keeps excluded activity absent with exact parity', () => {
  const fixture = storyFixture()
  const excluded = fixture.wbCards.find((card) => card.activityNumber === '5')
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
  const result = buildBe3U08StorySbWbSeriesHandoffWithNeutralCanary({
    companion: fixture.companion,
    activitySelection: sbSelection,
    workbookActivitySelection: wbSelection,
    canaryEnabled: true,
  })
  const serialized = JSON.stringify(result.handoff)

  assert.equal(result.servedFrom, 'neutral_canary')
  assert.doesNotMatch(serialized, /\[WB p\.106\] Activity 5/)
  assert.doesNotMatch(serialized, /Did Amy eat a burger and fries/)
  assert.doesNotMatch(result.handoff.lesson2Outline, /Activity 5|Did Amy/)
  assert.doesNotMatch(result.handoff.lesson2Vocabulary, /\bunhealthy\b/)
  assert.match(result.handoff.detailedHandoff, /\[WB p\.106\] Activity 6/)
  assertNoWb107(result.handoff)
})

test('flag ON + partial WB selection remains WB p.106-only without facing-page leakage', () => {
  const fixture = storyFixture()
  const activity6 = fixture.wbCards.find((card) => card.activityNumber === '6')
  assert.ok(activity6)
  const sbSelection = createSbActivityHandoffSelection(
    fixture.sbCards,
    createDefaultSbActivitySelection(fixture.sbCards),
  )
  const wbSelection = createWbActivityHandoffSelection(
    fixture.wbCards,
    setWbActivityCardSelected({
      cards: fixture.wbCards,
      state: createDefaultWbActivitySelection(fixture.wbCards),
      cardId: activity6.id,
      selected: false,
    }),
  )
  const result = buildBe3U08StorySbWbSeriesHandoffWithNeutralCanary({
    companion: fixture.companion,
    activitySelection: sbSelection,
    workbookActivitySelection: wbSelection,
    canaryEnabled: true,
  })
  const serialized = JSON.stringify(result.handoff)

  assert.equal(result.servedFrom, 'neutral_canary')
  assert.match(result.handoff.detailedHandoff, /Workbook p\. 106 only/)
  assert.match(result.handoff.lesson2Outline, /Workbook p\. 106 only/)
  assert.doesNotMatch(serialized, /facing|placeholder|p\.?\s*107|106–107/i)
})

test('flag ON + zero selection keeps honest empty states without WB p.107', () => {
  const fixture = storyFixture()
  const result = buildBe3U08StorySbWbSeriesHandoffWithNeutralCanary({
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
  assertNoWb107(result.handoff)
})

test('flag ON + prior/HM/teacher-added preserves provenance and package targets', () => {
  const fixture = storyFixture()
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
      source: 'BE3 SB Unit 8 p.128',
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
  const mapped = mapTeacherInputsToStoryPriorSupport({
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

  const result = buildBe3U08StorySbWbSeriesHandoffWithNeutralCanary({
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
  assertNoWb107(result.handoff)
})

test('forced renderer mismatch serves bespoke and emits bounded diagnostic without content', () => {
  const fixture = storyFixture()
  const diagnostics: StoryNeutralCanaryDiagnostic[] = []
  const warnings: string[] = []
  const originalWarn = console.warn
  console.warn = (...args: unknown[]) => {
    warnings.push(String(args[0] ?? ''))
  }

  try {
    const result = buildBe3U08StorySbWbSeriesHandoffWithNeutralCanary({
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

    const bespoke = buildBe3U08StorySbWbSeriesHandoff({
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
      'be3_sb_wb_rel_u08_story_sb130-131_wb106',
    )
    assert.deepEqual(
      [...(result.diagnostic?.mismatchedArtifacts ?? [])].sort(),
      [
        'detailedHandoff',
        'lesson1Outline',
        'lesson1Vocabulary',
        'lesson2Outline',
        'lesson2Vocabulary',
      ],
    )
    assert.equal(diagnostics.length, 1)
    assert.match(warnings.join('\n'), /mismatch on detailedHandoff/)
    assert.doesNotMatch(
      warnings.join('\n'),
      /FORCED_MISMATCH|An Unhealthy Dinner|Listen and read/,
    )
    assertNoWb107(result.handoff)
  } finally {
    console.warn = originalWarn
  }
})

test('renderer error serves bespoke with minimal diagnostic', () => {
  const fixture = storyFixture()
  const warnings: string[] = []
  const originalWarn = console.warn
  console.warn = (...args: unknown[]) => {
    warnings.push(String(args[0] ?? ''))
  }

  try {
    const result = buildBe3U08StorySbWbSeriesHandoffWithNeutralCanary({
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
      renderNeutral: () => {
        throw new Error('forced renderer failure')
      },
    })

    assert.equal(result.servedFrom, 'bespoke')
    assert.equal(result.diagnostic?.reason, 'renderer_error')
    assert.equal(
      result.diagnostic?.relationshipId,
      'be3_sb_wb_rel_u08_story_sb130-131_wb106',
    )
    assert.match(warnings.join('\n'), /renderer error; served bespoke/)
    assert.doesNotMatch(warnings.join('\n'), /forced renderer failure/)
  } finally {
    console.warn = originalWarn
  }
})

test('Opener canary behavior remains unchanged and independent of Story flag', () => {
  const opener = openerFixture()
  const openerSb = createSbActivityHandoffSelection(
    opener.sbCards,
    createDefaultSbActivitySelection(opener.sbCards),
  )
  const openerWb = createWbActivityHandoffSelection(
    opener.wbCards,
    createDefaultWbActivitySelection(opener.wbCards),
  )

  assert.equal(isBe3U08OpenerNeutralCanaryEnabled({}), false)
  assert.equal(
    isBe3U08OpenerNeutralCanaryEnabled({
      [BE3_U08_OPENER_NEUTRAL_CANARY_ENV]: 'true',
      [BE3_U08_STORY_NEUTRAL_CANARY_ENV]: 'true',
    }),
    true,
  )

  const openerOff = buildBe3U08OpenerSbWbSeriesHandoffWithNeutralCanary({
    companion: opener.companion,
    activitySelection: openerSb,
    workbookActivitySelection: openerWb,
    canaryEnabled: false,
  })
  assert.equal(openerOff.servedFrom, 'bespoke')
  assert.deepEqual(
    openerOff.handoff,
    buildBe3U08OpenerSbWbSeriesHandoff({
      activitySelection: openerSb,
      workbookActivitySelection: openerWb,
    }),
  )

  const openerOn = buildBe3U08OpenerSbWbSeriesHandoffWithNeutralCanary({
    companion: opener.companion,
    activitySelection: openerSb,
    workbookActivitySelection: openerWb,
    canaryEnabled: true,
  })
  assert.equal(openerOn.servedFrom, 'neutral_canary')

  const storySource = fs.readFileSync(
    path.join(ROOT, 'app/src/features/chalkie/be3U08StoryNeutralCanary.ts'),
    'utf8',
  )
  const openerSource = fs.readFileSync(
    path.join(ROOT, 'app/src/features/chalkie/be3U08OpenerNeutralCanary.ts'),
    'utf8',
  )
  const overlaySource = fs.readFileSync(
    path.join(ROOT, 'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx'),
    'utf8',
  )

  assert.ok(storySource.includes('BE3_U08_STORY_SERIES_RELATIONSHIP_ID'))
  assert.doesNotMatch(storySource, /opener_sb128-129/)
  assert.doesNotMatch(openerSource, /story_sb130-131/)
  assert.ok(
    overlaySource.includes('buildBe3U08OpenerSbWbSeriesHandoffWithNeutralCanary'),
  )
  assert.ok(
    overlaySource.includes('buildBe3U08StorySbWbSeriesHandoffWithNeutralCanary'),
  )
})
