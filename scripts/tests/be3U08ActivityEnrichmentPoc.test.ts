/**
 * Bounded BE3 U8 SB pp.128-129 + WB pp.104-105 activity-enrichment POC tests.
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
  BE3_U08_OPENER_SB_WB_RELATIONSHIP_ID,
  BE3_U08_WB_ACTIVITY_IDS,
  BE3_U08_WB_ACTIVITY_SUMMARY_SIDECAR,
  getBe3U08ActivitySummary,
  getBe3U08WbActivitySummary,
  isBe3U08ActivityEnrichmentPocEnabled,
} from '../../app/src/features/chalkie/be3U08ActivityEnrichmentPoc.ts'
import {
  buildBe3U08ActivityEnrichmentPocPackage,
  isExactBe3U08ActivityEnrichmentPocScope,
  isExactBe3U08WorkbookEnrichmentPocScope,
} from '../../app/src/features/chalkie/buildBe3U08ActivityEnrichmentPocPackage.ts'
import {
  buildSbActivityCards,
  createDefaultSbActivitySelection,
  setSbActivityCardSelected,
} from '../../app/src/features/chalkie/chalkieActivitySelection.ts'
import {
  buildWbActivityCards,
  createDefaultWbActivitySelection,
  setWbActivityCardSelected,
} from '../../app/src/features/chalkie/chalkieWorkbookActivitySelection.ts'
import { resolveVerifiedSbWbCompanion } from '../../app/src/features/chalkie/resolveVerifiedSbWbCompanion.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const BE3_SB_CANONICAL_PATH = path.join(
  ROOT,
  'data/phase1/big_english_3_sb/canonical/v1.json',
)
const BE3_WB_CANONICAL_PATH = path.join(
  ROOT,
  'data/phase1/big_english_3_wb/canonical/v1.json',
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

function loadCanonical(filePath: string, catalogBookId: string): {
  readonly sourceText: string
  readonly raw: Record<string, unknown>
  readonly summary: BatchJsonSummary
} {
  const sourceText = fs.readFileSync(filePath, 'utf8')
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
      catalogBookId,
      units: [],
      vocabulary: [],
      language: [],
      activities: [],
      pages,
      raw,
    },
  }
}

function filterActivities(
  raw: Record<string, unknown>,
  activityIds: readonly string[],
): unknown[] {
  return asArray(raw.activities).filter((entry) => {
    const activityId = asRecord(entry).activity_id
    return typeof activityId === 'string' && activityIds.includes(activityId)
  })
}

function openerCompanion() {
  const sb = loadCanonical(BE3_SB_CANONICAL_PATH, 'big_english_3_sb')
  const wb = loadCanonical(BE3_WB_CANONICAL_PATH, 'big_english_3_wb')
  return resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sb.raw,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wb.raw,
    studentBookPrintedPages: [128, 129],
  }).companion
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

test('POC covers exactly five SB and four WB verified activities; summaries stay separate from evidence', () => {
  assert.deepEqual(
    BE3_U08_ACTIVITY_SUMMARY_SIDECAR.map(
      (record) => record.sourceEvidence.activityId,
    ),
    BE3_U08_ACTIVITY_IDS,
  )
  assert.equal(BE3_U08_ACTIVITY_SUMMARY_SIDECAR.length, 5)
  assert.deepEqual(
    BE3_U08_WB_ACTIVITY_SUMMARY_SIDECAR.map(
      (record) => record.sourceEvidence.activityId,
    ),
    BE3_U08_WB_ACTIVITY_IDS,
  )
  assert.equal(BE3_U08_WB_ACTIVITY_SUMMARY_SIDECAR.length, 4)
  assert.ok(
    BE3_U08_ACTIVITY_SUMMARY_SIDECAR.every(
      (record) =>
        record.recordType === 'teacher_friendly_summary' &&
        record.sourceEvidence.source === 'SB',
    ),
  )
  assert.ok(
    BE3_U08_WB_ACTIVITY_SUMMARY_SIDECAR.every(
      (record) =>
        record.recordType === 'teacher_friendly_summary' &&
        record.sourceEvidence.source === 'WB',
    ),
  )
  assert.equal(Object.isFrozen(BE3_U08_ACTIVITY_SUMMARY_SIDECAR), true)
  assert.equal(Object.isFrozen(BE3_U08_WB_ACTIVITY_SUMMARY_SIDECAR), true)

  const pocSource = fs.readFileSync(POC_SOURCE_PATH, 'utf8')
  assert.ok(!pocSource.includes('optional_teaching_guidance'))
  assert.ok(!pocSource.includes('BE3_U08_TEACHING_GUIDANCE_SIDECAR'))
  assert.ok(!pocSource.includes('getBe3U08TeachingGuidance'))

  const packageSource = fs.readFileSync(PACKAGE_SOURCE_PATH, 'utf8')
  assert.ok(!packageSource.includes('includeGuidance'))
  assert.match(packageSource, /studentBookActivities/)
  assert.match(packageSource, /workbookActivities/)
})

test('exact SB scope accepts only the canonical five-card BE3 U8 pp.128-129 set', () => {
  const { summary } = loadCanonical(BE3_SB_CANONICAL_PATH, 'big_english_3_sb')
  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [128, 129],
  })

  assert.equal(cards.length, 5)
  assert.equal(isExactBe3U08ActivityEnrichmentPocScope(cards), true)
  assert.equal(isExactBe3U08ActivityEnrichmentPocScope(cards.slice(0, 4)), false)
})

test('exact WB scope accepts only the four verified companion activities on pp.104-105', () => {
  const wb = loadCanonical(BE3_WB_CANONICAL_PATH, 'big_english_3_wb')
  const companion = openerCompanion()
  assert.ok(companion)
  assert.equal(companion.relationshipId, BE3_U08_OPENER_SB_WB_RELATIONSHIP_ID)

  const cards = buildWbActivityCards({ summary: wb.summary, companion })
  assert.equal(cards.length, 4)
  assert.deepEqual(
    cards.map((card) => card.references[0]?.activityId),
    [...BE3_U08_WB_ACTIVITY_IDS],
  )
  assert.equal(
    isExactBe3U08WorkbookEnrichmentPocScope({ cards, companion }),
    true,
  )
})

test('wrong or missing WB activity IDs disable Workbook enrichment', () => {
  const wb = loadCanonical(BE3_WB_CANONICAL_PATH, 'big_english_3_wb')
  const companion = openerCompanion()
  assert.ok(companion)
  const cards = buildWbActivityCards({ summary: wb.summary, companion })

  assert.equal(
    isExactBe3U08WorkbookEnrichmentPocScope({
      cards: cards.slice(0, 3),
      companion,
    }),
    false,
  )
  assert.equal(
    isExactBe3U08WorkbookEnrichmentPocScope({
      cards: [
        {
          ...cards[0]!,
          references: [
            {
              ...cards[0]!.references[0]!,
              activityId: 'bep_3_wb_act_999_x',
            },
          ],
        },
        ...cards.slice(1),
      ],
      companion,
    }),
    false,
  )
})

test('wrong companion or pages disable Workbook enrichment', () => {
  const wb = loadCanonical(BE3_WB_CANONICAL_PATH, 'big_english_3_wb')
  const companion = openerCompanion()
  assert.ok(companion)
  const cards = buildWbActivityCards({ summary: wb.summary, companion })

  assert.equal(
    isExactBe3U08WorkbookEnrichmentPocScope({ cards, companion: null }),
    false,
  )
  assert.equal(
    isExactBe3U08WorkbookEnrichmentPocScope({
      cards,
      companion: {
        ...companion,
        relationshipId: 'be3_sb_wb_rel_u08_story_sb130-131_wb106',
        workbookPrintedPages: [106],
        studentBookPrintedPages: [130, 131],
      },
    }),
    false,
  )
  assert.equal(
    isExactBe3U08WorkbookEnrichmentPocScope({
      cards,
      companion: {
        ...companion,
        workbookPrintedPages: [104],
      },
    }),
    false,
  )
})

test('Activity 3 remains explicitly marked as insufficient evidence', () => {
  const summary = getBe3U08ActivitySummary('bep3_sb_act_08_03')

  assert.ok(summary)
  assert.equal(summary.evidenceSufficiency, 'insufficient')
  assert.match(summary.text, /only says “Play a game\.”/)
  assert.match(summary.text, /procedure is not available/)
})

test('Workbook summaries match required wording and remain distinct from canonical evidence', () => {
  assert.equal(
    getBe3U08WbActivitySummary('bep_3_wb_act_104_1')?.text,
    'Students write the activities shown in the pictures using the word box, then check which ones are healthy.',
  )
  assert.equal(
    getBe3U08WbActivitySummary('bep_3_wb_act_104_2')?.text,
    'Students read questions about how they feel and their healthy habits, then circle the answers that are true for them.',
  )
  assert.equal(
    getBe3U08WbActivitySummary('bep_3_wb_act_105_3')?.text,
    'Students listen to the ‘Live Right!’ song and complete six gaps using words from the word box.',
  )
  assert.equal(
    getBe3U08WbActivitySummary('bep_3_wb_act_105_4')?.text,
    'Students read three healthy-habit questions, check their own answers, then respond with Yes, I did or No, I didn’t.',
  )

  const wb = loadCanonical(BE3_WB_CANONICAL_PATH, 'big_english_3_wb')
  const canonicalActs = filterActivities(wb.raw, BE3_U08_WB_ACTIVITY_IDS)
  assert.equal(canonicalActs.length, 4)
  assert.ok(
    !JSON.stringify(canonicalActs).includes(
      'Students write the activities shown in the pictures using the word box',
    ),
  )
})

test('SB and WB selection control one experimental package without mutating records', () => {
  const sb = loadCanonical(BE3_SB_CANONICAL_PATH, 'big_english_3_sb')
  const wb = loadCanonical(BE3_WB_CANONICAL_PATH, 'big_english_3_wb')
  const companion = openerCompanion()
  assert.ok(companion)

  const sbActivitiesBefore = JSON.stringify(
    filterActivities(sb.raw, BE3_U08_ACTIVITY_IDS),
  )
  const wbActivitiesBefore = JSON.stringify(
    filterActivities(wb.raw, BE3_U08_WB_ACTIVITY_IDS),
  )
  const sbSummariesBefore = JSON.stringify(BE3_U08_ACTIVITY_SUMMARY_SIDECAR)
  const wbSummariesBefore = JSON.stringify(BE3_U08_WB_ACTIVITY_SUMMARY_SIDECAR)

  const sbCards = buildSbActivityCards({
    summary: sb.summary,
    activeLessonPrintedPages: [128, 129],
  })
  const wbCards = buildWbActivityCards({ summary: wb.summary, companion })
  const sbCardsBefore = JSON.stringify(sbCards)
  const wbCardsBefore = JSON.stringify(wbCards)

  let sbSelection = createDefaultSbActivitySelection(sbCards)
  let wbSelection = createDefaultWbActivitySelection(wbCards)

  const sbActivity2 = sbCards.find(
    (card) => card.references.activityId === 'bep3_sb_act_08_02',
  )
  const wbActivity3 = wbCards.find(
    (card) => card.references[0]?.activityId === 'bep_3_wb_act_105_3',
  )
  assert.ok(sbActivity2)
  assert.ok(wbActivity3)

  sbSelection = setSbActivityCardSelected({
    cards: sbCards,
    state: sbSelection,
    cardId: sbActivity2.id,
    selected: false,
  })
  wbSelection = setWbActivityCardSelected({
    cards: wbCards,
    state: wbSelection,
    cardId: wbActivity3.id,
    selected: false,
  })

  const lessonPackage = buildBe3U08ActivityEnrichmentPocPackage({
    cards: sbCards,
    activitySelection: sbSelection,
    workbookCards: wbCards,
    workbookActivitySelection: wbSelection,
    workbookCompanion: companion,
  })

  assert.ok(lessonPackage)
  assert.equal(lessonPackage.packageType, 'experimental_neutral_lesson_package')
  assert.deepEqual(lessonPackage.scope.studentBook.printedPages, [128, 129])
  assert.deepEqual(lessonPackage.scope.workbook?.printedPages, [104, 105])
  assert.equal(
    lessonPackage.scope.workbook?.relationshipId,
    BE3_U08_OPENER_SB_WB_RELATIONSHIP_ID,
  )
  assert.equal(lessonPackage.studentBookActivities.length, 4)
  assert.equal(lessonPackage.workbookActivities.length, 3)
  assert.equal(
    lessonPackage.studentBookActivities.some(
      (activity) => activity.selection.activityId === 'bep3_sb_act_08_02',
    ),
    false,
  )
  assert.equal(
    lessonPackage.workbookActivities.some(
      (activity) => activity.selection.activityId === 'bep_3_wb_act_105_3',
    ),
    false,
  )
  assert.ok(
    lessonPackage.studentBookActivities.every(
      (activity) => activity.selection.source === 'SB',
    ),
  )
  assert.ok(
    lessonPackage.workbookActivities.every(
      (activity) => activity.selection.source === 'WB',
    ),
  )
  assert.ok(!('activities' in lessonPackage))

  const emptyWbPackage = buildBe3U08ActivityEnrichmentPocPackage({
    cards: sbCards,
    activitySelection: sbSelection,
    workbookCards: wbCards,
    workbookActivitySelection: { selectedCardIds: [] },
    workbookCompanion: companion,
  })
  assert.ok(emptyWbPackage)
  assert.deepEqual(emptyWbPackage.workbookActivities, [])
  assert.ok(emptyWbPackage.scope.workbook)
  assert.equal(emptyWbPackage.studentBookActivities.length, 4)

  assert.equal(JSON.stringify(sbCards), sbCardsBefore)
  assert.equal(JSON.stringify(wbCards), wbCardsBefore)
  assert.equal(
    JSON.stringify(filterActivities(sb.raw, BE3_U08_ACTIVITY_IDS)),
    sbActivitiesBefore,
  )
  assert.equal(
    JSON.stringify(filterActivities(wb.raw, BE3_U08_WB_ACTIVITY_IDS)),
    wbActivitiesBefore,
  )
  assert.equal(JSON.stringify(BE3_U08_ACTIVITY_SUMMARY_SIDECAR), sbSummariesBefore)
  assert.equal(
    JSON.stringify(BE3_U08_WB_ACTIVITY_SUMMARY_SIDECAR),
    wbSummariesBefore,
  )
  assert.equal(fs.readFileSync(BE3_SB_CANONICAL_PATH, 'utf8'), sb.sourceText)
  assert.equal(fs.readFileSync(BE3_WB_CANONICAL_PATH, 'utf8'), wb.sourceText)
})

test('no Optional Teaching Guidance or publisher-evidence controls remain on enrichment cards', () => {
  const cardSource = fs.readFileSync(CARD_SOURCE_PATH, 'utf8')
  assert.ok(!cardSource.includes('Optional teaching guidance'))
  assert.ok(!cardSource.includes('data-enrichment-layer="guidance"'))
  assert.ok(!cardSource.includes('data-enrichment-guidance-toggle'))
  assert.ok(!cardSource.includes('Include guidance in experimental lesson package'))
  assert.ok(!cardSource.includes('Original publisher evidence'))
  assert.ok(!cardSource.includes('data-enrichment-layer="publisher_evidence"'))
  assert.ok(!cardSource.includes('Lightbulb'))

  const overlaySource = fs.readFileSync(OVERLAY_SOURCE_PATH, 'utf8')
  assert.match(overlaySource, /getBe3U08WbActivitySummary/)
  assert.match(overlaySource, /workbookEnrichmentPocEnabled/)
  assert.ok(!overlaySource.includes('includeGuidance'))
  assert.ok(!overlaySource.includes('Guidance included'))
})

test('POC-only path remains when comparison is off; selection wiring stays intact', () => {
  const cardSource = fs.readFileSync(CARD_SOURCE_PATH, 'utf8')
  assert.match(cardSource, /AI summary · experimental/)
  assert.match(cardSource, /data-experimental-activity-enrichment/)
  assert.match(cardSource, /showExperimentalEnrichment/)
  assert.match(cardSource, /onSelectedChange/)
  assert.match(cardSource, /type="checkbox"/)

  const overlaySource = fs.readFileSync(OVERLAY_SOURCE_PATH, 'utf8')
  assert.match(overlaySource, /activityEnrichmentPocEnabled/)
  assert.match(overlaySource, /workbookEnrichmentPocEnabled/)
  assert.match(overlaySource, /showSbExperimentalSummary/)
  assert.match(overlaySource, /showWbExperimentalSummary/)
  assert.match(overlaySource, /onSbActivitySelectionChange/)
  assert.match(overlaySource, /onWbActivitySelectionChange/)
  assert.match(overlaySource, /experimentalSummary=\{/)
  assert.match(overlaySource, /Activity enrichment experiment · not NLL adapter/)
  // Comparison is additive and default-off; POC getters remain the summary source.
  assert.match(overlaySource, /getBe3U08ActivitySummary/)
  assert.match(overlaySource, /getBe3U08WbActivitySummary/)
})
