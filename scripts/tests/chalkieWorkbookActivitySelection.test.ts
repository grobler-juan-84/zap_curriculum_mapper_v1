/**
 * Verified Workbook activity-card model/UI boundary tests.
 * Run: npx tsx --test scripts/tests/chalkieWorkbookActivitySelection.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { buildBe3U08OpenerSbWbSeriesHandoff } from '../../app/src/features/chalkie/buildBe3U08OpenerSbWbSeriesHandoff.ts'
import { buildChalkieConciseOutline } from '../../app/src/features/chalkie/buildChalkieConciseOutline.ts'
import {
  buildChalkiePromptPreview,
  lessonTitleForPackage,
} from '../../app/src/features/chalkie/buildChalkiePromptPreview.ts'
import { buildSuggestedChalkieVocabulary } from '../../app/src/features/chalkie/buildSuggestedChalkieVocabulary.ts'
import {
  buildSbActivityCards,
  createDefaultSbActivitySelection,
  createSbActivityHandoffSelection,
  sbActivitySelectionStatus,
} from '../../app/src/features/chalkie/chalkieActivitySelection.ts'
import {
  buildWbActivityCards,
  buildWbActivityPagePanels,
  createDefaultWbActivitySelection,
  createWbActivityHandoffSelection,
  setWbActivityCardSelected,
  wbActivitySelectionStatus,
  type WbActivitySelectionState,
} from '../../app/src/features/chalkie/chalkieWorkbookActivitySelection.ts'
import { resolveChalkieLessonContext } from '../../app/src/features/chalkie/resolveChalkieLessonContext.ts'
import { resolveVerifiedSbWbCompanion } from '../../app/src/features/chalkie/resolveVerifiedSbWbCompanion.ts'
import {
  advanceTeacherChoiceStep,
  retreatTeacherChoiceStep,
} from '../../app/src/features/chalkie/teacherChoiceFlow.ts'
import type { Book } from '../../app/src/types/curriculum.ts'
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
const OVERLAY_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx',
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
    pages: asArray(raw.pages).map((entry) => {
      const page = asRecord(entry)
      return {
        printedPage:
          typeof page.printed_page === 'number' ? page.printed_page : null,
        pdfPage: typeof page.pdf_page === 'number' ? page.pdf_page : null,
      }
    }),
    raw,
  }
}

const sbCanonical = loadJson(BE3_SB_PATH)
const wbCanonical = loadJson(BE3_WB_PATH)
const sbSummary = summaryFromCanonical(sbCanonical, 'big_english_3_sb')
const wbSummary = summaryFromCanonical(wbCanonical, 'big_english_3_wb')

function companionFor(studentBookPrintedPages: number[]) {
  return resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sbCanonical,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wbCanonical,
    studentBookPrintedPages,
  }).companion
}

function cardsFor(studentBookPrintedPages: number[]) {
  const companion = companionFor(studentBookPrintedPages)
  return {
    companion,
    cards: buildWbActivityCards({ summary: wbSummary, companion }),
  }
}

test('opener SB128–129 resolves WB104–105 cards in two exact page panels', () => {
  const { companion, cards } = cardsFor([128, 129])
  const panels = buildWbActivityPagePanels({ cards, companion })

  assert.deepEqual(
    panels.map((panel) => [panel.pageId, panel.printedPage]),
    [
      ['bep_3_wb_p104', 104],
      ['bep_3_wb_p105', 105],
    ],
  )
  assert.deepEqual(
    panels.map((panel) => panel.cards.length),
    [2, 2],
  )
  assert.deepEqual(
    panels.map((panel) => panel.includedInLessonScope),
    [true, true],
  )
  assert.deepEqual(panels.map((panel) => panel.position), ['left', 'right'])
  assert.ok(cards.every((card) => card.source === 'WB'))
  assert.ok(cards.every((card) => card.id.startsWith('wb-activity:')))
  assert.ok(
    cards.every(
      (card) =>
        card.references.length === 1 &&
        card.references[0]?.verificationStatus === 'human_verified',
    ),
  )
})

test('Story SB130–131 keeps WB106 left with a non-content right placeholder', () => {
  const { companion, cards } = cardsFor([130, 131])
  const panels = buildWbActivityPagePanels({ cards, companion })

  assert.deepEqual(panels.map((panel) => panel.printedPage), [106, null])
  assert.deepEqual(
    panels.map((panel) => panel.includedInLessonScope),
    [true, false],
  )
  assert.deepEqual(panels.map((panel) => panel.position), ['left', 'right'])
  assert.ok(panels[0]?.cards.length)
  assert.deepEqual(panels[1]?.cards, [])
  assert.ok(cards.length > 0)
  assert.ok(cards.every((card) => card.printedPage === 106))
  assert.equal(cards.some((card) => card.printedPage === 107), false)
})

test('Writing p.140 keeps WB115 right with a non-content left placeholder', () => {
  const { companion, cards } = cardsFor([140])
  const panels = buildWbActivityPagePanels({ cards, companion })

  assert.deepEqual(panels.map((panel) => panel.printedPage), [null, 115])
  assert.deepEqual(
    panels.map((panel) => panel.includedInLessonScope),
    [false, true],
  )
  assert.deepEqual(panels.map((panel) => panel.position), ['left', 'right'])
  assert.deepEqual(panels[0]?.cards, [])
  assert.equal(cards.length, 3)
  assert.ok(cards.every((card) => card.pageId === 'bep_3_wb_p115'))
})

test('Values p.142 has no companion and produces no Workbook cards or panels', () => {
  const { companion, cards } = cardsFor([142])
  assert.equal(companion, null)
  assert.deepEqual(cards, [])
  assert.deepEqual(buildWbActivityPagePanels({ cards, companion }), [])
})

test('all eligible Workbook cards start selected and stale IDs stay inert', () => {
  const { cards } = cardsFor([128, 129])
  const state = createDefaultWbActivitySelection(cards)

  assert.deepEqual(state.selectedCardIds, cards.map((card) => card.id))
  assert.deepEqual(wbActivitySelectionStatus(cards, state), {
    selectedCount: 4,
    totalCount: 4,
    hasNoSelectedWorkbookActivities: false,
  })

  const staleState: WbActivitySelectionState = {
    selectedCardIds: ['wb-activity:missing'],
  }
  const normalized = setWbActivityCardSelected({
    cards,
    state: staleState,
    cardId: 'wb-activity:also-missing',
    selected: true,
  })
  assert.deepEqual(normalized.selectedCardIds, [])
})

test('unchecking Workbook changes only Workbook count/state', () => {
  const sbCards = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: [128, 129],
  })
  const sbState = createDefaultSbActivitySelection(sbCards)
  const { cards: wbCards } = cardsFor([128, 129])
  const excluded = wbCards[0]
  assert.ok(excluded)

  const wbState = setWbActivityCardSelected({
    cards: wbCards,
    state: createDefaultWbActivitySelection(wbCards),
    cardId: excluded.id,
    selected: false,
  })

  assert.equal(wbActivitySelectionStatus(wbCards, wbState).selectedCount, 3)
  assert.deepEqual(sbActivitySelectionStatus(sbCards, sbState), {
    selectedCount: sbCards.length,
    totalCount: sbCards.length,
    hasNoSelectedCurrentActivities: false,
  })
})

test('Workbook selection survives Continue to Prior Learning and Back', () => {
  const { cards } = cardsFor([130, 131])
  const excluded = cards[0]
  assert.ok(excluded)
  const state = setWbActivityCardSelected({
    cards,
    state: createDefaultWbActivitySelection(cards),
    cardId: excluded.id,
    selected: false,
  })

  let step = advanceTeacherChoiceStep(1)
  assert.equal(step, 2)
  step = retreatTeacherChoiceStep(step)
  assert.equal(step, 1)
  assert.equal(state.selectedCardIds.includes(excluded.id), false)
  assert.equal(
    wbActivitySelectionStatus(cards, state).selectedCount,
    cards.length - 1,
  )
})

test('Workbook selection propagates only into Workbook-bearing series artifacts', () => {
  const book: Book = {
    id: 'book-uuid-test',
    seriesId: 'series-uuid-test',
    catalogBookId: 'big_english_3_sb',
    title: 'Big English 3 Student Book',
    level: '3',
    audience: 'Primary',
    totalUnits: 9,
    type: 'Student Book',
    colorScheme: {
      primary: '#000000',
      accent: '#333333',
      badgeBg: '#eeeeee',
      badgeText: '#111111',
    },
    pageSpreads: [],
  }
  const lesson = resolveChalkieLessonContext({
    book,
    summary: sbSummary,
    visiblePrintedPages: [128, 129],
    unitNumber: 8,
    workbookCanonical: wbCanonical,
  })
  assert.equal(lesson.status, 'ready')
  const sbCards = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: [128, 129],
  })
  const sbSelection = createSbActivityHandoffSelection(
    sbCards,
    createDefaultSbActivitySelection(sbCards),
  )
  const { cards: wbCards } = cardsFor([128, 129])
  const wbBefore = createDefaultWbActivitySelection(wbCards)
  const wbAfter = setWbActivityCardSelected({
    cards: wbCards,
    state: wbBefore,
    cardId: wbCards[0]!.id,
    selected: false,
  })
  const workbookSelectionBefore = createWbActivityHandoffSelection(
    wbCards,
    wbBefore,
  )
  const workbookSelectionAfter = createWbActivityHandoffSelection(
    wbCards,
    wbAfter,
  )

  const outputSnapshot = (
    workbookActivitySelection: ReturnType<
      typeof createWbActivityHandoffSelection
    >,
  ) => ({
    prompt: buildChalkiePromptPreview({
      lesson,
      packageShape: 'series',
      selectedSuggestions: [],
      teacherAdditions: [],
      activitySelection: sbSelection,
      workbookActivitySelection,
    }),
    outline: buildChalkieConciseOutline({
      lesson,
      selectedSuggestions: [],
      activitySelection: sbSelection,
    }),
    vocabulary: buildSuggestedChalkieVocabulary(lesson, sbSelection),
    title: lessonTitleForPackage(lesson, 'series'),
    seriesHandoff: buildBe3U08OpenerSbWbSeriesHandoff({
      selectedSuggestions: [],
      teacherAdditions: [],
      activitySelection: sbSelection,
      workbookActivitySelection,
    }),
  })

  const before = outputSnapshot(workbookSelectionBefore)
  assert.notDeepEqual(wbBefore, wbAfter)
  const after = outputSnapshot(workbookSelectionAfter)
  assert.notEqual(after.prompt, before.prompt)
  assert.notDeepEqual(after.seriesHandoff, before.seriesHandoff)
  assert.equal(after.outline, before.outline)
  assert.deepEqual(after.vocabulary, before.vocabulary)
  assert.equal(after.title, before.title)
})

test('no-companion Student Book handoff is unaffected by Workbook selection', () => {
  const book: Book = {
    id: 'book-uuid-test',
    seriesId: 'series-uuid-test',
    catalogBookId: 'big_english_3_sb',
    title: 'Big English 3 Student Book',
    level: '3',
    audience: 'Primary',
    totalUnits: 9,
    type: 'Student Book',
    colorScheme: {
      primary: '#000000',
      accent: '#333333',
      badgeBg: '#eeeeee',
      badgeText: '#111111',
    },
    pageSpreads: [],
  }
  const lesson = resolveChalkieLessonContext({
    book,
    summary: sbSummary,
    visiblePrintedPages: [142],
    unitNumber: 8,
    workbookCanonical: wbCanonical,
  })
  assert.equal(lesson.status, 'ready')
  assert.equal(lesson.workbookCompanion, null)
  const sbCards = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: [142],
  })
  const activitySelection = createSbActivityHandoffSelection(
    sbCards,
    createDefaultSbActivitySelection(sbCards),
  )
  const input = {
    lesson,
    packageShape: 'single' as const,
    selectedSuggestions: [],
    teacherAdditions: [],
    activitySelection,
  }

  assert.equal(
    buildChalkiePromptPreview({
      ...input,
      workbookActivitySelection: createWbActivityHandoffSelection(
        [],
        createDefaultWbActivitySelection([]),
      ),
    }),
    buildChalkiePromptPreview(input),
  )
})

test('overlay renders evidence-shaped Workbook UI and passes WB state into handoff calls', () => {
  const source = fs.readFileSync(OVERLAY_PATH, 'utf8')
  const step1Start = source.indexOf('{step === 1 ? (')
  const step2Start = source.indexOf('{step === 2 ? (')
  const step1Source = source.slice(step1Start, step2Start)
  const handoffStart = source.indexOf('const handleGeneratePromptPreview')
  const handoffEnd = source.indexOf('const handleCopyPrompt')
  const handoffSource = source.slice(handoffStart, handoffEnd)

  assert.match(step1Source, /data-wb-activity-section/)
  assert.match(step1Source, /Verified Workbook companion for this lesson/)
  assert.match(step1Source, /Workbook · p\.\{panel\.printedPage\}/)
  assert.match(step1Source, /\[WB p\.\{card\.printedPage\}\]/)
  assert.match(step1Source, /workbookActivityPagePanels\.length > 1/)
  assert.match(step1Source, /data-wb-facing-placeholder/)
  assert.match(step1Source, /No verified Workbook content for this lesson\./)
  assert.match(step1Source, /lesson\.workbookCompanion &&/)
  assert.match(step1Source, /Workbook activity selection is saved for this session/)
  assert.match(step1Source, /current local handoff includes Workbook content/)
  assert.match(handoffSource, /workbookActivitySelection: handoffWorkbookActivitySelection/)
  assert.match(handoffSource, /handoffWorkbookActivitySelection/)
})
