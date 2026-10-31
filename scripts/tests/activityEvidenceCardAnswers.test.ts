/**
 * VAL-01: selection cards hide item-level expected answers by default.
 * Run: npx tsx --test scripts/tests/activityEvidenceCardAnswers.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  selectionChromeExpectedAnswerTexts,
} from '../../app/src/features/chalkie/ActivityEvidenceCard.tsx'
import { buildSbActivityCards } from '../../app/src/features/chalkie/chalkieActivitySelection.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const BE3_CANONICAL_PATH = path.join(
  ROOT,
  'data/phase1/big_english_3_sb/canonical/v1.json',
)
const CARD_SOURCE_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/ActivityEvidenceCard.tsx',
)

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function loadBe3Summary(): BatchJsonSummary {
  const raw = JSON.parse(
    fs.readFileSync(BE3_CANONICAL_PATH, 'utf8'),
  ) as Record<string, unknown>
  return {
    catalogBookId: 'big_english_3_sb',
    units: [],
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

const summary = loadBe3Summary()

test('Values Activity 36 cards do not surface Answer: healthy/unhealthy by default', () => {
  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [142],
  })
  const values36 = cards.find((card) => card.activityNumber === '36')
  assert.ok(values36)
  assert.ok(
    values36.evidence.items.some((item) => item.expectedAnswer === 'healthy'),
  )
  assert.ok(
    values36.evidence.items.some((item) => item.expectedAnswer === 'unhealthy'),
  )
  assert.deepEqual(selectionChromeExpectedAnswerTexts(values36), [])
  assert.deepEqual(selectionChromeExpectedAnswerTexts(values36, false), [])
})

test('keyed activities keep expected answers on the model without selection-chrome leak', () => {
  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [130, 131],
  })
  const keyed = cards.find((card) =>
    card.evidence.items.some((item) => Boolean(item.expectedAnswer?.trim())),
  )
  assert.ok(keyed)
  assert.ok(keyed.evidence.items.some((item) => item.expectedAnswer?.trim()))
  assert.deepEqual(selectionChromeExpectedAnswerTexts(keyed), [])
})

test('open activities without answers stay empty for both modes', () => {
  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [128, 129],
  })
  const open = cards.find(
    (card) =>
      !card.evidence.expectedAnswer &&
      card.evidence.items.every((item) => !item.expectedAnswer),
  )
  assert.ok(open)
  assert.deepEqual(selectionChromeExpectedAnswerTexts(open), [])
  assert.deepEqual(selectionChromeExpectedAnswerTexts(open, true), [])
})

test('opt-in reveal exposes Values answers without mutating evidence', () => {
  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [142],
  })
  const values36 = cards.find((card) => card.activityNumber === '36')
  assert.ok(values36)
  const before = JSON.stringify(values36.evidence.items)
  const revealed = selectionChromeExpectedAnswerTexts(values36, true)
  assert.ok(revealed.includes('healthy'))
  assert.ok(revealed.includes('unhealthy'))
  assert.equal(JSON.stringify(values36.evidence.items), before)
})

test('card markup requires opt-in prop before rendering Answer: labels', () => {
  const source = fs.readFileSync(CARD_SOURCE_PATH, 'utf8')
  assert.match(source, /revealExpectedAnswers/)
  assert.match(
    source,
    /revealExpectedAnswers && item\.expectedAnswer/,
  )
  assert.match(
    source,
    /revealExpectedAnswers && evidence\.expectedAnswer/,
  )
})
