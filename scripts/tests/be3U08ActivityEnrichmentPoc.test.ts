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
  BE3_U08_TEACHING_GUIDANCE_SIDECAR,
  getBe3U08ActivitySummary,
  getBe3U08TeachingGuidance,
  isBe3U08ActivityEnrichmentPocEnabled,
} from '../../app/src/features/chalkie/be3U08ActivityEnrichmentPoc.ts'
import {
  buildBe3U08ActivityEnrichmentPocPackage,
  createDefaultBe3U08GuidanceSelection,
  isExactBe3U08ActivityEnrichmentPocScope,
  reconcileBe3U08GuidanceSelection,
  setBe3U08GuidanceSelected,
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

test('POC sidecars cover exactly the five verified activities and remain distinct', () => {
  assert.deepEqual(
    BE3_U08_ACTIVITY_SUMMARY_SIDECAR.map(
      (record) => record.sourceEvidence.activityId,
    ),
    BE3_U08_ACTIVITY_IDS,
  )
  assert.deepEqual(
    BE3_U08_TEACHING_GUIDANCE_SIDECAR.map(
      (record) => record.sourceEvidence.activityId,
    ),
    BE3_U08_ACTIVITY_IDS,
  )
  assert.ok(
    BE3_U08_ACTIVITY_SUMMARY_SIDECAR.every(
      (record) => record.recordType === 'teacher_friendly_summary',
    ),
  )
  assert.ok(
    BE3_U08_TEACHING_GUIDANCE_SIDECAR.every(
      (record) => record.recordType === 'optional_teaching_guidance',
    ),
  )
  assert.equal(Object.isFrozen(BE3_U08_ACTIVITY_SUMMARY_SIDECAR), true)
  assert.equal(Object.isFrozen(BE3_U08_TEACHING_GUIDANCE_SIDECAR), true)
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

test('guidance is default-off, cannot outlive its activity, and cannot be selected for Activity 3', () => {
  const { summary } = loadCanonical()
  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [128, 129],
  })
  const activitySelection = createDefaultSbActivitySelection(cards)
  const defaultGuidance = createDefaultBe3U08GuidanceSelection()
  assert.deepEqual(defaultGuidance.selectedGuidanceActivityIds, [])

  const activity1 = cards.find(
    (card) => card.references.activityId === 'bep3_sb_act_08_01',
  )
  assert.ok(activity1)
  const selectedGuidance = setBe3U08GuidanceSelected({
    cards,
    activitySelection,
    guidanceSelection: defaultGuidance,
    activityId: 'bep3_sb_act_08_01',
    selected: true,
  })
  assert.deepEqual(selectedGuidance.selectedGuidanceActivityIds, [
    'bep3_sb_act_08_01',
  ])

  const activity1Deselected = setSbActivityCardSelected({
    cards,
    state: activitySelection,
    cardId: activity1.id,
    selected: false,
  })
  assert.deepEqual(
    reconcileBe3U08GuidanceSelection({
      cards,
      activitySelection: activity1Deselected,
      guidanceSelection: selectedGuidance,
    }).selectedGuidanceActivityIds,
    [],
  )

  assert.deepEqual(
    setBe3U08GuidanceSelected({
      cards,
      activitySelection,
      guidanceSelection: defaultGuidance,
      activityId: 'bep3_sb_act_08_03',
      selected: true,
    }).selectedGuidanceActivityIds,
    [],
  )
})

test('Activity 3 exposes insufficient evidence and withholds invented guidance', () => {
  const summary = getBe3U08ActivitySummary('bep3_sb_act_08_03')
  const guidance = getBe3U08TeachingGuidance('bep3_sb_act_08_03')

  assert.ok(summary)
  assert.ok(guidance)
  assert.equal(summary.evidenceSufficiency, 'insufficient')
  assert.match(summary.text, /only says “Play a game\.”/)
  assert.match(summary.text, /procedure is not available/)
  assert.equal(guidance.availability, 'withheld_insufficient_evidence')
  assert.equal(guidance.text, null)
  assert.match(guidance.withheldReason ?? '', /does not describe the game procedure/)
})

test('experimental package reflects selections without mutating evidence or sidecars', () => {
  const canonical = loadCanonical()
  const canonicalActivitiesBefore = JSON.stringify(
    canonicalPocActivities(canonical.raw),
  )
  const summariesBefore = JSON.stringify(BE3_U08_ACTIVITY_SUMMARY_SIDECAR)
  const guidanceBefore = JSON.stringify(BE3_U08_TEACHING_GUIDANCE_SIDECAR)
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
  const guidanceSelection = setBe3U08GuidanceSelected({
    cards,
    activitySelection,
    guidanceSelection: createDefaultBe3U08GuidanceSelection(),
    activityId: 'bep3_sb_act_08_01',
    selected: true,
  })

  const lessonPackage = buildBe3U08ActivityEnrichmentPocPackage({
    cards,
    activitySelection,
    guidanceSelection,
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
  assert.deepEqual(
    lessonPackage.activities
      .filter((activity) => activity.selection.includeGuidance)
      .map((activity) => activity.selection.activityId),
    ['bep3_sb_act_08_01'],
  )
  assert.ok(
    lessonPackage.activities.every(
      (activity) =>
        activity.selection.includeGuidance === (activity.guidance !== null),
    ),
  )

  assert.equal(JSON.stringify(cards), cardsBefore)
  assert.equal(
    JSON.stringify(canonicalPocActivities(canonical.raw)),
    canonicalActivitiesBefore,
  )
  assert.equal(JSON.stringify(BE3_U08_ACTIVITY_SUMMARY_SIDECAR), summariesBefore)
  assert.equal(JSON.stringify(BE3_U08_TEACHING_GUIDANCE_SIDECAR), guidanceBefore)
  assert.equal(fs.readFileSync(BE3_CANONICAL_PATH, 'utf8'), canonical.sourceText)
})
