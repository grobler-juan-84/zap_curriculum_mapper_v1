/**
 * Focused Unit Intelligence view tests (node:test via tsx).
 * Run: npx tsx --test scripts/tests/chalkieUnitIntelligence.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { buildChalkiePromptPreview } from '../../app/src/features/chalkie/buildChalkiePromptPreview.ts'
import {
  UNIT_INTELLIGENCE_EMPTY_MESSAGE,
  buildChalkieUnitIntelligenceView,
  findBookIntelligenceUnit,
} from '../../app/src/features/chalkie/chalkieUnitIntelligence.ts'
import { resolveChalkieLessonContext } from '../../app/src/features/chalkie/resolveChalkieLessonContext.ts'
import { loadBookIntelligenceOverviewFromJsonText } from '../../app/src/lib/bookIntelligence/loadBookIntelligenceOverview.ts'
import type { Book } from '../../app/src/types/curriculum.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const BE3_BI_PATH = path.join(
  ROOT,
  'data/phase2/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json',
)

function loadBe3BookIntelligence() {
  const text = fs.readFileSync(BE3_BI_PATH, 'utf8')
  const result = loadBookIntelligenceOverviewFromJsonText(text)
  assert.equal(result.ok, true, 'BE3 BI fixture must parse')
  if (!result.ok) throw new Error('unreachable')
  return result.data
}

function bookStub(catalogBookId: string): Book {
  return {
    id: 'book-uuid-test',
    seriesId: 'series-uuid-test',
    catalogBookId,
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
}

function summaryStub(): BatchJsonSummary {
  return {
    catalogBookId: 'big_english_3_sb',
    units: [
      {
        unitId: 'big_english_3_sb_unit_01',
        unitNumber: '1',
        title: 'Wake Up!',
        printedPageStart: 4,
        printedPageEnd: 19,
      },
    ],
    pages: [
      {
        printedPage: 4,
        sectionTitle: 'Vocabulary',
        pageHeading: 'Vocabulary',
      },
    ],
    vocabulary: [{ term: 'wake up', pageId: 'p4' }],
    language: [],
    activities: [{ title: 'Look and say.', pageId: 'p4' }],
    raw: {},
  }
}

test('available Book Intelligence appears for a supported BE3 unit', () => {
  const document = loadBe3BookIntelligence()
  const unit = findBookIntelligenceUnit(document, '1')
  assert.ok(unit)
  assert.equal(unit?.title, 'Wake Up!')

  const view = buildChalkieUnitIntelligenceView({
    document,
    unitNumber: 1,
  })
  assert.equal(view.status, 'ready')
  if (view.status !== 'ready') return

  assert.equal(view.unitNumber, '1')
  assert.equal(view.title, 'Wake Up!')
  assert.equal(view.pageRange, 'pp. 4–19')

  const keys = view.fields.map((field) => field.key)
  assert.deepEqual(keys, [
    'vocabulary',
    'grammarStructures',
    'communicativeFunctions',
    'learningOutcomes',
    'clilCulture',
    'values',
    'phonics',
    'writing',
  ])

  const outcomes = view.fields.find((field) => field.key === 'learningOutcomes')
  assert.ok(outcomes)
  assert.equal(outcomes?.badge, 'AI-inferred')
  assert.match(outcomes?.value ?? '', /daily routines/i)

  const writing = view.fields.find((field) => field.key === 'writing')
  assert.ok(writing)
  assert.match(writing?.value ?? '', /subjects/i)
})

test('unavailable book/unit gives the honest empty state', () => {
  const noDocument = buildChalkieUnitIntelligenceView({
    document: null,
    unitNumber: '1',
  })
  assert.equal(noDocument.status, 'unavailable')
  if (noDocument.status === 'unavailable') {
    assert.equal(noDocument.message, UNIT_INTELLIGENCE_EMPTY_MESSAGE)
  }

  const document = loadBe3BookIntelligence()
  const missingUnit = buildChalkieUnitIntelligenceView({
    document,
    unitNumber: '99',
  })
  assert.equal(missingUnit.status, 'unavailable')
  if (missingUnit.status === 'unavailable') {
    assert.equal(missingUnit.message, UNIT_INTELLIGENCE_EMPTY_MESSAGE)
  }
})

test('opening Unit Intelligence does not change the prepared handoff/context', () => {
  const book = bookStub('big_english_3_sb')
  const summary = summaryStub()
  const visiblePrintedPages = [4]

  const contextBefore = resolveChalkieLessonContext({
    book,
    summary,
    visiblePrintedPages,
    unitNumber: '1',
  })

  const biView = buildChalkieUnitIntelligenceView({
    document: loadBe3BookIntelligence(),
    unitNumber: '1',
  })
  assert.equal(biView.status, 'ready')

  const contextAfter = resolveChalkieLessonContext({
    book,
    summary,
    visiblePrintedPages,
    unitNumber: '1',
  })

  assert.deepEqual(contextAfter, contextBefore)

  if (contextBefore.status === 'ready' && contextAfter.status === 'ready') {
    assert.equal(
      buildChalkiePromptPreview(contextAfter),
      buildChalkiePromptPreview(contextBefore),
    )
  }
})

test('loading state is distinct and does not invent content', () => {
  const view = buildChalkieUnitIntelligenceView({
    loading: true,
    document: loadBe3BookIntelligence(),
    unitNumber: '1',
  })
  assert.equal(view.status, 'loading')
})
