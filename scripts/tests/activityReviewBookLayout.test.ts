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
    /<ActivityEvidenceDetails card=\{card\} showActivityType=\{false\} \/>/,
  )
  assert.match(cardSource, /data-activity-type-row/)
  assert.match(cardSource, /showActivityType && evidence\.activityType/)
  assert.match(cardSource, /evidence\.activityType/)
})

test('enrichment POC card keeps summary focus with lightbulb guidance and evidence disclosure', () => {
  const cardSource = fs.readFileSync(CARD_PATH, 'utf8')
  assert.match(cardSource, /data-experimental-activity-enrichment/)
  assert.match(cardSource, /data-enrichment-layer="summary"/)
  assert.match(cardSource, /AI summary · experimental/)
  assert.match(cardSource, /data-enrichment-layer="guidance"/)
  assert.match(cardSource, /data-enrichment-guidance-toggle/)
  assert.match(cardSource, /Lightbulb/)
  assert.match(cardSource, /Optional teaching guidance/)
  assert.match(cardSource, /AI suggestion/)
  assert.match(cardSource, /Include guidance in experimental lesson package/)
  assert.match(cardSource, /data-enrichment-layer="publisher_evidence"/)
  assert.match(cardSource, /data-enrichment-evidence-toggle/)
  assert.match(cardSource, /Original publisher evidence/)
  assert.match(cardSource, /Human verified/)
  // Presentation-only labels; sidecar wording is rendered from summary.text / guidance.text.
  assert.match(cardSource, /\{summary\.text\}/)
  assert.match(cardSource, /\{guidance\.text\}/)
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
