/**
 * Modal activity-review open-book layout contracts.
 * Run: npx tsx --test scripts/tests/activityReviewBookLayout.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OVERLAY_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx',
)
const CARD_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/ActivityEvidenceCard.tsx',
)
const SPREAD_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/ActivityReviewBookSpread.tsx',
)
const LEFT_PANEL_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/ChalkieLeftPanel.tsx',
)

test('modal activity cards expand naturally without nested card scrollbars', () => {
  const cardSource = fs.readFileSync(CARD_PATH, 'utf8')
  assert.match(cardSource, /data-activity-card-layout="modal"/)
  assert.match(cardSource, /data-activity-card-height="natural"/)
  assert.ok(!cardSource.includes('data-activity-card-scroll'))
  assert.ok(!cardSource.includes('MODAL_ACTIVITY_CARD_HEIGHT_CLASS'))
  assert.ok(!cardSource.includes('h-[11.5rem]'))
  assert.match(cardSource, /layout === 'modal'/)
  assert.match(cardSource, /ActivityChrome/)
  assert.match(cardSource, /ActivityEvidenceDetails/)
})

test('modal review hides Type row; panel layout can still show it', () => {
  const cardSource = fs.readFileSync(CARD_PATH, 'utf8')
  assert.match(
    cardSource,
    /<ActivityEvidenceDetails[\s\S]*?showActivityType=\{false\}[\s\S]*?\/>/,
  )
  assert.match(cardSource, /data-activity-type-row/)
  assert.match(cardSource, /showActivityType && evidence\.activityType/)
  assert.match(cardSource, /evidence\.activityType/)
})

test('enrichment POC card keeps summary focus without Optional Teaching Guidance; publisher evidence stays out of the card UI', () => {
  const cardSource = fs.readFileSync(CARD_PATH, 'utf8')
  assert.match(cardSource, /data-experimental-activity-enrichment/)
  assert.match(cardSource, /data-enrichment-layer="summary"/)
  assert.match(cardSource, /AI summary · experimental/)
  assert.match(cardSource, /Insufficient evidence for a fuller summary/)
  assert.match(cardSource, /\{summary\.text\}/)
  assert.match(cardSource, /Be3U08ExperimentalSummaryDisplay/)
  assert.ok(!cardSource.includes('Optional teaching guidance'))
  assert.ok(!cardSource.includes('data-enrichment-layer="guidance"'))
  assert.ok(!cardSource.includes('data-enrichment-guidance-toggle'))
  assert.ok(!cardSource.includes('Include guidance in experimental lesson package'))
  assert.ok(!cardSource.includes('Lightbulb'))
  // Publisher evidence remains in builders/selection; not shown on enrichment cards.
  assert.ok(!cardSource.includes('data-enrichment-layer="publisher_evidence"'))
  assert.ok(!cardSource.includes('Original publisher evidence'))
  assert.ok(!cardSource.includes('data-enrichment-evidence-toggle'))
})

test('overlay wires NLL summary presentation to SB and WB modal cards', () => {
  const overlaySource = fs.readFileSync(OVERLAY_PATH, 'utf8')
  assert.match(overlaySource, /nllActivitySummary=\{/)
  assert.match(overlaySource, /nllActivitySummaryEligible/)
  assert.match(overlaySource, /pagePrefix="WB"/)
  assert.match(overlaySource, /pagePrefix="SB"/)
  assert.doesNotMatch(overlaySource, /experimentalSummary=\{/)
  assert.doesNotMatch(overlaySource, /getBe3U08WbActivitySummary/)
  assert.doesNotMatch(overlaySource, /workbookEnrichmentPocEnabled/)
  assert.match(overlaySource, /twoColumn=\{true\}/)
  assert.match(overlaySource, /data-wb-activity-page/)
})

test('open-book spread keeps equal-height pages with independent list scroll', () => {
  const spreadSource = fs.readFileSync(SPREAD_PATH, 'utf8')
  assert.match(spreadSource, /data-activity-book-spread="true"/)
  assert.match(spreadSource, /data-activity-book-page="true"/)
  assert.match(spreadSource, /data-activity-book-page-scroll="true"/)
  assert.match(spreadSource, /min-h-0/)
  assert.match(spreadSource, /h-full/)
  assert.match(spreadSource, /overflow-y-auto/)
  assert.match(spreadSource, /overflow-hidden/)
})

test('overlay activity-review body is height-bounded; header\/footer remain outside scroll', () => {
  const overlaySource = fs.readFileSync(OVERLAY_PATH, 'utf8')
  assert.match(overlaySource, /data-teacher-choice-fixed-height="true"/)
  assert.match(overlaySource, /data-teacher-choice-body=\{/)
  assert.match(overlaySource, /activity-review/)
  assert.match(overlaySource, /ActivityReviewBookSpread/)
  assert.match(overlaySource, /layout="modal"/)
  assert.match(overlaySource, /shrink-0 border-t border-slate-200\/60 bg-\[#8bcfd9\]/)
  assert.match(overlaySource, /document\.body\.style\.overflow = 'hidden'/)

  const step1Start = overlaySource.indexOf(
    "{resolvedStepId === 'student_book' ? (",
  )
  const workbookStart = overlaySource.indexOf(
    "{resolvedStepId === 'workbook' && includeWorkbookStep ? (",
  )
  const priorStart = overlaySource.indexOf(
    "{resolvedStepId === 'prior_skills' ? (",
  )
  assert.ok(step1Start >= 0)
  assert.ok(workbookStart > step1Start)
  assert.ok(priorStart > workbookStart)

  const step1 = overlaySource.slice(step1Start, workbookStart)
  const workbook = overlaySource.slice(workbookStart, priorStart)

  for (const section of [step1, workbook]) {
    assert.match(section, /layout="modal"/)
    assert.match(section, /ActivityReviewBookSpread/)
    assert.match(section, /ActivityReviewBookPage/)
    assert.match(section, /min-h-0/)
  }

  assert.match(step1, /data-sb-facing-placeholder/)
  assert.match(step1, /Not included in this lesson scope\./)
  assert.match(workbook, /data-wb-facing-placeholder/)
  assert.match(workbook, /No verified Workbook content for this lesson\./)
})

test('left panel keeps unbounded panel card layout', () => {
  const leftPanel = fs.readFileSync(LEFT_PANEL_PATH, 'utf8')
  assert.match(leftPanel, /ActivityEvidenceCard/)
  assert.ok(!leftPanel.includes('layout="modal"'))
  assert.ok(!leftPanel.includes('ActivityReviewBookSpread'))
})
