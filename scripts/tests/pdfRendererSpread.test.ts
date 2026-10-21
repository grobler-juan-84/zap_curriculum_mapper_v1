/**
 * PDF renderer spread resolution — catches second-page End-of-document regressions.
 * Run: npx tsx --test scripts/tests/pdfRendererSpread.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { exactPdfPagesForPrinted } from '../../app/src/features/validation/pdfPageMap.ts'
import {
  chalkieCompanionRendererProps,
  resolvePdfRendererSpread,
} from '../../app/src/features/validation/pdfRendererSpread.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const BE3_SB_PATH = path.join(ROOT, 'data/phase1/big_english_3_sb/canonical/v1.json')
const BE3_WB_PATH = path.join(ROOT, 'data/phase1/big_english_3_wb/canonical/v1.json')

function sourcePages(filePath: string): Array<{ printedPage: number | null; pdfPage: number | null }> {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8')) as {
    pages?: Array<{ printed_page?: unknown; pdf_page?: unknown }>
  }
  return (raw.pages ?? []).map((page) => ({
    printedPage: typeof page.printed_page === 'number' ? page.printed_page : null,
    pdfPage: typeof page.pdf_page === 'number' ? page.pdf_page : null,
  }))
}

test('WB mapped 104–105 paints both PDF pages (no End of document)', () => {
  const spread = resolvePdfRendererSpread({
    numPages: 140,
    pairStart: 1, // stale cover position must not win
    allowedPdfPages: [104, 105],
  })
  assert.equal(spread.awaitingDocument, false)
  assert.equal(spread.leftPdfPage, 104)
  assert.equal(spread.rightPdfPage, 105)
  assert.equal(spread.showingEndOfDocument, false)
})

test('stale short numPages must not clamp 105→104 (regression for one-page WB)', () => {
  // Old bug: clampPage(105, 104) === 104 → unique [104] → End of document on the right.
  const spread = resolvePdfRendererSpread({
    numPages: 104,
    pairStart: 104,
    allowedPdfPages: [104, 105],
  })
  assert.equal(spread.leftPdfPage, 104)
  assert.equal(spread.rightPdfPage, null)
  assert.equal(
    spread.showingEndOfDocument,
    true,
    'second mapped page missing from document length is visible as EOD for tests/UI',
  )
  // Critical: we did not invent a fake second page by clamping
  assert.notEqual(spread.rightPdfPage, 104)
})

test('SB restore force-display paints PDF 126–127 even when pairStart is cover', () => {
  const spread = resolvePdfRendererSpread({
    numPages: 157,
    pairStart: 1,
    allowedPdfPages: [126, 127],
  })
  assert.equal(spread.leftPdfPage, 126)
  assert.equal(spread.rightPdfPage, 127)
  assert.equal(spread.showingEndOfDocument, false)
})

test('awaiting document does not paint cover + End of document', () => {
  const spread = resolvePdfRendererSpread({
    numPages: 0,
    pairStart: 1,
    allowedPdfPages: [126, 127],
  })
  assert.equal(spread.awaitingDocument, true)
  assert.equal(spread.leftPdfPage, null)
  assert.equal(spread.rightPdfPage, null)
  assert.equal(spread.showingEndOfDocument, false)
})

test('BE3 U8 opener host props supply exact renderer page pairs for SB→WB→SB', () => {
  assert.ok(fs.existsSync(BE3_SB_PATH))
  assert.ok(fs.existsSync(BE3_WB_PATH))

  const sbPdf = exactPdfPagesForPrinted(sourcePages(BE3_SB_PATH), [128, 129])
  const wbPdf = exactPdfPagesForPrinted(sourcePages(BE3_WB_PATH), [104, 105])
  assert.deepEqual(sbPdf, [126, 127])
  assert.deepEqual(wbPdf, [104, 105])

  const wbProps = chalkieCompanionRendererProps({
    mode: 'workbook',
    sbPdfPages: sbPdf,
    wbPdfPages: wbPdf,
    pendingSbRestore: false,
  })
  assert.deepEqual(wbProps.allowedPdfPages, [104, 105])
  assert.equal(wbProps.navigationLocked, true)

  const wbSpread = resolvePdfRendererSpread({
    numPages: 140,
    pairStart: 1,
    allowedPdfPages: wbProps.allowedPdfPages,
  })
  assert.deepEqual([wbSpread.leftPdfPage, wbSpread.rightPdfPage], [104, 105])
  assert.equal(wbSpread.showingEndOfDocument, false)

  const sbRestoreProps = chalkieCompanionRendererProps({
    mode: 'student_book',
    sbPdfPages: sbPdf,
    wbPdfPages: wbPdf,
    pendingSbRestore: true,
  })
  assert.deepEqual(sbRestoreProps.allowedPdfPages, [126, 127])
  assert.equal(sbRestoreProps.navigationLocked, true)

  const sbSpread = resolvePdfRendererSpread({
    numPages: 157,
    pairStart: 1,
    allowedPdfPages: sbRestoreProps.allowedPdfPages,
  })
  assert.deepEqual([sbSpread.leftPdfPage, sbSpread.rightPdfPage], [126, 127])
  assert.equal(sbSpread.showingEndOfDocument, false)

  const sbFreeProps = chalkieCompanionRendererProps({
    mode: 'student_book',
    sbPdfPages: sbPdf,
    wbPdfPages: wbPdf,
    pendingSbRestore: false,
  })
  assert.equal(sbFreeProps.allowedPdfPages, null)
  assert.equal(sbFreeProps.navigationLocked, false)
})
