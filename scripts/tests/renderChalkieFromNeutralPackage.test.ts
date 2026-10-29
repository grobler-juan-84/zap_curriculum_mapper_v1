/**
 * Shared test-only Chalkie dispatcher boundary tests.
 * Run: npx tsx --test scripts/tests/renderChalkieFromNeutralPackage.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { buildNeutralSbWbLessonPackage } from '../../app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts'
import type { NeutralSbWbLessonPackage } from '../../app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts'
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
  renderChalkieFromNeutralPackage,
  UnsupportedNeutralPackageRendererError,
} from '../../app/src/features/chalkie/renderChalkieFromNeutralPackage.ts'
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

function packageForPages(studentBookPrintedPages: number[]) {
  const companion = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sbCanonical,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wbCanonical,
    studentBookPrintedPages,
  }).companion
  assert.ok(companion)
  const sbCards = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: studentBookPrintedPages,
  })
  const wbCards = buildWbActivityCards({
    summary: wbSummary,
    companion,
  })
  return buildNeutralSbWbLessonPackage({
    companion,
    sbSelection: createSbActivityHandoffSelection(
      sbCards,
      createDefaultSbActivitySelection(sbCards),
    ),
    wbSelection: createWbActivityHandoffSelection(
      wbCards,
      createDefaultWbActivitySelection(wbCards),
    ),
  })
}

test('exact LiA package dispatches to the LiA renderer', () => {
  const output = renderChalkieFromNeutralPackage(packageForPages([132, 133]))
  assert.match(output.detailedHandoff, /Language in Action relationship/)
  assert.match(output.detailedHandoff, /Student Book printed pages 132–133/)
  assert.match(output.detailedHandoff, /Workbook printed pages 107–108/)
  assert.match(output.lesson1Outline, /Language in Action/)
  assert.match(output.lesson2Outline, /Workbook pp\. 107–108 only/)
})

test('unsupported neutral relationship throws a typed error without fallback output', () => {
  const unsupportedPackage = {
    identity: {
      relationshipId: 'be3_sb_wb_rel_u08_clil_pe_sb134-135_wb109-110',
      packageReference: 'be3-sb-wb-u08-p134-135-wb109-110',
    },
  } as unknown as NeutralSbWbLessonPackage

  assert.throws(
    () => renderChalkieFromNeutralPackage(unsupportedPackage),
    (error: unknown) => {
      assert.ok(error instanceof UnsupportedNeutralPackageRendererError)
      assert.equal(error.code, 'unsupported_neutral_package_renderer')
      assert.equal(
        error.relationshipId,
        'be3_sb_wb_rel_u08_clil_pe_sb134-135_wb109-110',
      )
      assert.equal(
        error.packageReference,
        'be3-sb-wb-u08-p134-135-wb109-110',
      )
      assert.match(error.message, /No test-only Chalkie renderer is registered/)
      return true
    },
  )
})

test('Opener and Story dispatcher outputs remain available through the shared dispatcher', () => {
  const opener = renderChalkieFromNeutralPackage(packageForPages([128, 129]))
  const story = renderChalkieFromNeutralPackage(packageForPages([130, 131]))
  assert.match(opener.detailedHandoff, /Student Book printed pages 128–129/)
  assert.match(story.detailedHandoff, /Workbook printed page 106 only/)
  assert.doesNotMatch(opener.detailedHandoff, /Language in Action relationship/)
  assert.doesNotMatch(story.detailedHandoff, /Language in Action relationship/)
})
