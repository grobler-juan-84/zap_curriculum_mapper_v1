/**
 * Bounded BE3 U8 SB pp.128-129 activity-enrichment POC tests.
 * Run: npx tsx --test scripts/tests/be3U08ActivityEnrichmentPoc.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  BE3_U08_ACTIVITY_IDS,
  BE3_U08_ACTIVITY_SUMMARY_SIDECAR,
  getBe3U08ActivitySummary,
  isBe3U08ActivityEnrichmentPocEnabled,
} from '../../app/src/features/chalkie/be3U08ActivityEnrichmentPoc.ts'
import {
  buildBe3U08ActivityEnrichmentPocPackage,
  isExactBe3U08ActivityEnrichmentPocScope,
} from '../../app/src/features/chalkie/buildBe3U08ActivityEnrichmentPocPackage.ts'
import {
  buildSbActivityCards,
  createDefaultSbActivitySelection,
  setSbActivityCardSelected,
} from '../../app/src/features/chalkie/chalkieActivitySelection.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const BE3_CANONICAL_PATH = path.join(
  ROOT,
  'data/phase1/big_english_3_sb/canonical/v1.json',
)
const POC_SOURCE_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/be3U08ActivityEnrichmentPoc.ts',
)
const PACKAGE_SOURCE_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/buildBe3U08ActivityEnrichmentPocPackage.ts',
)
const CARD_SOURCE_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/ActivityEvidenceCard.tsx',
)
const OVERLAY_SOURCE_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx',
)

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function loadCanonical(): {
  readonly sourceText: string
  readonly raw: Record<string, unknown>
  readonly summary: BatchJsonSummary
} {
  const sourceText = fs.readFileSync(BE3_CANONICAL_PATH, 'utf8')
  const raw = JSON.parse(sourceText) as Record<string, unknown>
  const pages = asArray(raw.pages).map((entry) => {
    const page = asRecord(entry)
    return {
      printedPage:
        typeof page.printed_page === 'number' ? page.printed_page : null,
      pdfPage: typeof page.pdf_page === 'number' ? page.pdf_page : null,
    }
  })
  return {
    sourceText,
    raw,
    summary: {
      catalogBookId: 'big_english_3_sb',
      units: [],
      vocabulary: [],
      language: [],
      activities: [],
      pages,
      raw,
    },
  }
}

function canonicalPocActivities(raw: Record<string, unknown>): unknown[] {
  return asArray(raw.activities).filter((entry) => {
    const activityId = asRecord(entry).activity_id
    return typeof activityId === 'string' &&
      (BE3_U08_ACTIVITY_IDS as readonly string[]).includes(activityId)
  })
}

test('development flag is default-off and only explicit truthy values enable it', () => {
  assert.equal(isBe3U08ActivityEnrichmentPocEnabled({}), false)
  assert.equal(
    isBe3U08ActivityEnrichmentPocEnabled({
      VITE_CHALKIE_BE3_U08_ACTIVITY_ENRICHMENT_POC: 'false',
    }),
    false,
  )
  assert.equal(
    isBe3U08ActivityEnrichmentPocEnabled({
      VITE_CHALKIE_BE3_U08_ACTIVITY_ENRICHMENT_POC: 'true',
    }),
    true,
  )
})

test('POC covers exactly five verified activities; summaries stay separate from publisher evidence', () => {
  assert.deepEqual(
    BE3_U08_ACTIVITY_SUMMARY_SIDECAR.map(
      (record) => record.sourceEvidence.activityId,
    ),
    BE3_U08_ACTIVITY_IDS,
  )
  assert.equal(BE3_U08_ACTIVITY_SUMMARY_SIDECAR.length, 5)
  assert.ok(
    BE3_U08_ACTIVITY_SUMMARY_SIDECAR.every(
      (record) => record.recordType === 'teacher_friendly_summary',
    ),
  )
  assert.equal(Object.isFrozen(BE3_U08_ACTIVITY_SUMMARY_SIDECAR), true)

  const pocSource = fs.readFileSync(POC_SOURCE_PATH, 'utf8')
  assert.ok(!pocSource.includes('optional_teaching_guidance'))
  assert.ok(!pocSource.includes('BE3_U08_TEACHING_GUIDANCE_SIDECAR'))
  assert.ok(!pocSource.includes('getBe3U08TeachingGuidance'))
  assert.ok(!pocSource.includes('Be3U08TeachingGuidanceSidecarRecord'))

  const packageSource = fs.readFileSync(PACKAGE_SOURCE_PATH, 'utf8')
  assert.ok(!packageSource.includes('includeGuidance'))
  assert.ok(!packageSource.includes('guidanceSelection'))
  assert.ok(!packageSource.includes('Be3U08GuidanceSelectionState'))
})

test('exact scope accepts only the canonical five-card BE3 U8 pp.128-129 set', () => {
  const { summary } = loadCanonical()
  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [128, 129],
  })

  assert.equal(cards.length, 5)
  assert.equal(isExactBe3U08ActivityEnrichmentPocScope(cards), true)
  assert.equal(isExactBe3U08ActivityEnrichmentPocScope(cards.slice(0, 4)), false)
})

test('Activity 3 remains explicitly marked as insufficient evidence', () => {
  const summary = getBe3U08ActivitySummary('bep3_sb_act_08_03')

  assert.ok(summary)
  assert.equal(summary.evidenceSufficiency, 'insufficient')
  assert.match(summary.text, /only says “Play a game\.”/)
  assert.match(summary.text, /procedure is not available/)
})

test('activity selection controls experimental package inclusion without mutating records', () => {
  const canonical = loadCanonical()
  const canonicalActivitiesBefore = JSON.stringify(
    canonicalPocActivities(canonical.raw),
  )
  const summariesBefore = JSON.stringify(BE3_U08_ACTIVITY_SUMMARY_SIDECAR)
  const cards = buildSbActivityCards({
    summary: canonical.summary,
    activeLessonPrintedPages: [128, 129],
  })
  const cardsBefore = JSON.stringify(cards)

  let activitySelection = createDefaultSbActivitySelection(cards)
  const activity2 = cards.find(
    (card) => card.references.activityId === 'bep3_sb_act_08_02',
  )
  assert.ok(activity2)
  activitySelection = setSbActivityCardSelected({
    cards,
    state: activitySelection,
    cardId: activity2.id,
    selected: false,
  })

  const lessonPackage = buildBe3U08ActivityEnrichmentPocPackage({
    cards,
    activitySelection,
  })

  assert.ok(lessonPackage)
  assert.equal(lessonPackage.packageType, 'experimental_neutral_lesson_package')
  assert.equal(lessonPackage.activities.length, 4)
  assert.equal(
    lessonPackage.activities.some(
      (activity) => activity.selection.activityId === 'bep3_sb_act_08_02',
    ),
    false,
  )
  assert.ok(
    lessonPackage.activities.every(
      (activity) =>
        activity.selection.includeActivity === true &&
        activity.publisherEvidenceReference.activityId ===
          activity.selection.activityId &&
        typeof activity.summary.text === 'string' &&
        activity.summary.text.length > 0,
    ),
  )
  assert.ok(
    lessonPackage.activities.every(
      (activity) =>
        !('includeGuidance' in activity.selection) &&
        !('guidance' in activity),
    ),
  )

  const activity3 = lessonPackage.activities.find(
    (activity) => activity.selection.activityId === 'bep3_sb_act_08_03',
  )
  assert.ok(activity3)
  assert.equal(activity3.summary.evidenceSufficiency, 'insufficient')

  assert.equal(JSON.stringify(cards), cardsBefore)
  assert.equal(
    JSON.stringify(canonicalPocActivities(canonical.raw)),
    canonicalActivitiesBefore,
  )
  assert.equal(JSON.stringify(BE3_U08_ACTIVITY_SUMMARY_SIDECAR), summariesBefore)
  assert.equal(fs.readFileSync(BE3_CANONICAL_PATH, 'utf8'), canonical.sourceText)
})

test('no Optional Teaching Guidance remains in enrichment-card or overlay POC wiring', () => {
  const cardSource = fs.readFileSync(CARD_SOURCE_PATH, 'utf8')
  assert.ok(!cardSource.includes('Optional teaching guidance'))
  assert.ok(!cardSource.includes('data-enrichment-layer="guidance"'))
  assert.ok(!cardSource.includes('data-enrichment-guidance-toggle'))
  assert.ok(!cardSource.includes('Include guidance in experimental lesson package'))
  assert.ok(!cardSource.includes('experimentalGuidance'))
  assert.ok(!cardSource.includes('onGuidanceSelectedChange'))
  assert.ok(!cardSource.includes('Be3U08TeachingGuidanceSidecarRecord'))
  assert.ok(!cardSource.includes('Lightbulb'))

  const overlaySource = fs.readFileSync(OVERLAY_SOURCE_PATH, 'utf8')
  assert.ok(!overlaySource.includes('be3U08GuidanceSelection'))
  assert.ok(!overlaySource.includes('getBe3U08TeachingGuidance'))
  assert.ok(!overlaySource.includes('createDefaultBe3U08GuidanceSelection'))
  assert.ok(!overlaySource.includes('setBe3U08GuidanceSelected'))
  assert.ok(!overlaySource.includes('experimentalGuidance'))
  assert.ok(!overlaySource.includes('includeGuidance'))
  assert.ok(!overlaySource.includes('Guidance included'))
  assert.ok(!overlaySource.includes('Guidance not included'))
})
