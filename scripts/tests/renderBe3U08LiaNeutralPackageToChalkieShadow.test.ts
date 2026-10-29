/**
 * Non-serving parity proof for the BE3 U8 Language in Action neutral renderer.
 * Run: npx tsx --test scripts/tests/renderBe3U08LiaNeutralPackageToChalkieShadow.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { buildNeutralSbWbLessonPackage } from '../../app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts'
import {
  buildSbActivityCards,
  createDefaultSbActivitySelection,
  createSbActivityHandoffSelection,
  setSbActivityCardSelected,
} from '../../app/src/features/chalkie/chalkieActivitySelection.ts'
import {
  buildWbActivityCards,
  createDefaultWbActivitySelection,
  createWbActivityHandoffSelection,
  setWbActivityCardSelected,
} from '../../app/src/features/chalkie/chalkieWorkbookActivitySelection.ts'
import { renderBe3U08LiaNeutralPackageToChalkieShadow } from '../../app/src/features/chalkie/renderBe3U08LiaNeutralPackageToChalkieShadow.ts'
import { renderChalkieFromNeutralPackage } from '../../app/src/features/chalkie/renderChalkieFromNeutralPackage.ts'
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

const EXPECTED_DETAILED_HANDOFF = [
  'Create a short, picture-led TWO-LESSON series to SUPPORT Big English 3 Unit 8 using ONLY these source pages:',
  '- Lesson 1: Student Book printed pages 132–133',
  '- Lesson 2: Workbook printed pages 107–108',
  '',
  'Do not expand beyond this exact Language in Action relationship.',
  'Do not replace the Student Book or Workbook.',
  'Do not invent publisher audio scripts, sticker placements, illustration details, or missing answers.',
  'Use the official book audio, stickers and illustrations where the selected activity requires them.',
  'Workbook pages 107–108 are verified source evidence for this series; they may not be the PDF currently open in the workspace.',
  'Treat Lesson 2 as consolidation and practice of the Student Book language—not a second presentation of Lesson 1.',
  '',
  'SOURCE LABELS:',
  '- [SB] = Student Book evidence from pages 132–133 only',
  '- [WB] = Workbook evidence from pages 107–108 only',
  '- [PRIOR] = teacher-selected prior learning, not current-page evidence',
  '- [TEACHER-ADDED · UNVERIFIED] = teacher-directed language not verified as publisher evidence',
  '- [SUPPLEMENTARY] = teacher-controlled support, not publisher wording',
  '',
  'A. SERIES SCOPE',
  '',
  'Lesson 1 — Student Book pp. 132–133',
  'Purpose: practise past-simple Did …? questions and short answers through the verified Language in Action activities.',
  '',
  '[SB p.132] Activity 8: Listen and look at the sentences. Help Luke and Amy make more. Use official Audio 155 and the visible sentence models and phrase bank; do not invent audio wording.',
  '[SB p.132] Activity 9: Match the phrases. Make five questions about yesterday. Then ask and answer.',
  "[SB p.133] Activity 10: Complete four dialogues with did or didn't.",
  '[SB p.133] Activity 11: Put the words in order to make five questions. Then ask.',
  '[SB p.133] Activity 12: Read and match six Did …? questions and answers. Then change the answers.',
  "[SB] Verified language models: Did you have breakfast? / No, I didn't. | Did he get enough sleep? / Yes, he did. | Did you do any exercise yesterday? / No, I didn't.",
  '[SB] Dedicated target vocabulary on these pages: none listed.',
  '',
  'Lesson 2 — Workbook pp. 107–108',
  "Purpose: consolidate Did …? questions, did/didn't responses and past-activity comprehension through the verified Workbook practice.",
  '',
  '[WB p.107] Activity 7: Listen and stick to show what Grace and Carlos did on the weekend. Use official Audio 156, illustrations and stickers; do not invent the audio sequence, placements or answers.',
  "[WB p.107] Activity 8: Read and complete two dialogues with did or didn't.",
  '[WB p.108] Activity 9: Look at the illustrations and circle the past activity that completes each of three sentences.',
  '[WB p.108] Activity 10: Use the Activity 9 illustrations to answer seven Did …? questions. The answers depend on those illustrations; do not reconstruct an excluded Activity 9.',
  "[WB] Verified language model: Did he get enough sleep? / Yes, he did. / No, he didn't.",
  '[WB] Dedicated target vocabulary on these pages: none listed.',
  '',
  'B. TEACHER-SELECTED PRIOR LEARNING',
  '',
  'No verified prior learning was selected for this lesson.',
  '',
  'C. TEACHING GUIDANCE',
  '',
  '- Keep Lesson 1 on Student Book pp. 132–133 and Lesson 2 on Workbook pp. 107–108.',
  '- Use only selected current-page activities; do not reconstruct excluded activities from page context.',
  '- Keep Audio 155 and Audio 156 as official-book dependencies; do not generate transcripts.',
  '- Keep the Activity 7 sticker task and Activities 9–10 illustration tasks anchored to the physical Workbook.',
  '- Use selected prior or teacher-added language only as clearly labelled support.',
  '- Keep both lessons concise and classroom-usable.',
  '- Success means students are prepared to work with SB 132–133 and WB 107–108.',
  '',
  'D. HARD BOUNDARIES',
  '',
  '- Do not use Story pages SB 130–131 or WB 106.',
  '- Do not use CLIL/P.E. pages SB 134–135 or WB 109–110.',
  '- Do not use or reconstruct unselected Student Book or Workbook activities.',
  '- Do not invent publisher audio, sticker or illustration content.',
  '- Do not claim teacher-added language is publisher evidence.',
  '- Do not load or quote NLL-derived summaries or Book Intelligence.',
].join('\n')

const EXPECTED_LESSON1_OUTLINE = [
  'Concise teacher-controlled outline — Lesson 1',
  'Short teaching sequence for Student Book pp. 132–133 only (Language in Action). Keep book-working time; do not expand into a slide-by-slide script.',
  '',
  '1. [SB] Activity 8: Listen and look at the sentence models. Use official Audio 155; do not invent transcript wording.',
  '2. [SB] Activity 9: Match five phrase halves, make questions about yesterday, then ask and answer.',
  "3. [SB] Activity 10: Complete four dialogues with did or didn't.",
  '4. [SB] Activity 11: Order words to make five questions, then ask them.',
  '5. [SB] Activity 12: Match six Did …? questions and answers, then change the answers.',
  '6. [SUPPLEMENTARY] Finish with one brief teacher-selected Did …? exchange; do not present it as publisher wording.',
  '',
].join('\n')

const EXPECTED_LESSON1_VOCABULARY =
  "No dedicated target vocabulary is listed for SB pp. 132–133. Language models: Did you have breakfast? / No, I didn't. | Did he get enough sleep? / Yes, he did. | Did you do any exercise yesterday? / No, I didn't."

const EXPECTED_LESSON2_OUTLINE = [
  'Concise teacher-controlled outline — Lesson 2',
  'Short teaching sequence for Workbook pp. 107–108 only. Consolidation and practice of the Student Book Language in Action strand—not a second Lesson 1. Keep book-working time; do not expand into a slide-by-slide script.',
  '',
  '1. [WB] Activity 7: Listen and stick. Use official Audio 156, illustrations and stickers; do not supply unverified placements or answers.',
  "2. [WB] Activity 8: Complete two dialogues with did or didn't.",
  '3. [WB] Activity 9: Use the illustrations to circle the correct past activity in three items.',
  '4. [WB] Activity 10: Use the Activity 9 illustrations to answer seven Did …? questions; do not reconstruct excluded visual evidence.',
  '5. [SUPPLEMENTARY] Finish with one brief teacher-selected Did …? check; do not present it as publisher wording.',
  '',
].join('\n')

const EXPECTED_LESSON2_VOCABULARY =
  "No dedicated target vocabulary is listed for WB pp. 107–108. Language model: Did he get enough sleep? / Yes, he did. / No, he didn't."

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

function liaFixture() {
  const companion = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sbCanonical,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wbCanonical,
    studentBookPrintedPages: [132, 133],
  }).companion
  assert.ok(companion)
  const sbCards = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: [132, 133],
  })
  const wbCards = buildWbActivityCards({
    summary: wbSummary,
    companion,
  })
  return { companion, sbCards, wbCards }
}

function liaPackage(input?: {
  excludedSbCardId?: string
  excludedWbCardId?: string
  keepOnlySbCardIds?: string[]
  keepOnlyWbCardIds?: string[]
  zeroSb?: boolean
  zeroWb?: boolean
  priorSupport?: Parameters<
    typeof buildNeutralSbWbLessonPackage
  >[0]['priorSupport']
}) {
  const fixture = liaFixture()
  let sbState = input?.zeroSb
    ? { selectedCardIds: [] as string[] }
    : createDefaultSbActivitySelection(fixture.sbCards)
  let wbState = input?.zeroWb
    ? { selectedCardIds: [] as string[] }
    : createDefaultWbActivitySelection(fixture.wbCards)

  if (input?.keepOnlySbCardIds) {
    const keep = new Set(input.keepOnlySbCardIds)
    for (const card of fixture.sbCards) {
      if (!keep.has(card.id) && sbState.selectedCardIds.includes(card.id)) {
        sbState = setSbActivityCardSelected({
          cards: fixture.sbCards,
          state: sbState,
          cardId: card.id,
          selected: false,
        })
      }
    }
  }
  if (input?.keepOnlyWbCardIds) {
    const keep = new Set(input.keepOnlyWbCardIds)
    for (const card of fixture.wbCards) {
      if (!keep.has(card.id) && wbState.selectedCardIds.includes(card.id)) {
        wbState = setWbActivityCardSelected({
          cards: fixture.wbCards,
          state: wbState,
          cardId: card.id,
          selected: false,
        })
      }
    }
  }
  if (input?.excludedSbCardId) {
    sbState = setSbActivityCardSelected({
      cards: fixture.sbCards,
      state: sbState,
      cardId: input.excludedSbCardId,
      selected: false,
    })
  }
  if (input?.excludedWbCardId) {
    wbState = setWbActivityCardSelected({
      cards: fixture.wbCards,
      state: wbState,
      cardId: input.excludedWbCardId,
      selected: false,
    })
  }

  return {
    ...fixture,
    lessonPackage: buildNeutralSbWbLessonPackage({
      companion: fixture.companion,
      sbSelection: createSbActivityHandoffSelection(fixture.sbCards, sbState),
      wbSelection: createWbActivityHandoffSelection(fixture.wbCards, wbState),
      priorSupport: input?.priorSupport,
    }),
  }
}

function assertNoAdjacentLeak(output: Record<string, string>): void {
  const serialized = JSON.stringify(output)
  assert.doesNotMatch(serialized, /\[SB p\.130\]|\[SB p\.131\]|\[WB p\.106\]/)
  assert.doesNotMatch(serialized, /\[SB p\.134\]|\[SB p\.135\]|\[WB p\.109\]|\[WB p\.110\]/)
  assert.doesNotMatch(serialized, /An Unhealthy Dinner|What Is a Calorie/)
  assert.doesNotMatch(serialized, /be3-u08-lia|summaryText|curriculumInterpretation/)
  // Boundary prose may mention NLL/BI as prohibitions; ensure no attached content.
  assert.doesNotMatch(serialized, /NLL summary:|Book Intelligence unit overview/)
}

test('all-selected LiA package exactly matches the five approved artifacts', () => {
  const { lessonPackage } = liaPackage()
  const shadow = renderChalkieFromNeutralPackage(lessonPackage)

  assert.deepEqual(shadow, {
    detailedHandoff: EXPECTED_DETAILED_HANDOFF,
    lesson1Outline: EXPECTED_LESSON1_OUTLINE,
    lesson1Vocabulary: EXPECTED_LESSON1_VOCABULARY,
    lesson2Outline: EXPECTED_LESSON2_OUTLINE,
    lesson2Vocabulary: EXPECTED_LESSON2_VOCABULARY,
  })
  assertNoAdjacentLeak(shadow)
})

test('LiA identity assertion rejects non-LiA and representative malformed packages', () => {
  const openerCompanion = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: sbCanonical,
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: wbCanonical,
    studentBookPrintedPages: [128, 129],
  }).companion
  assert.ok(openerCompanion)
  const openerSbCards = buildSbActivityCards({
    summary: sbSummary,
    activeLessonPrintedPages: [128, 129],
  })
  const openerWbCards = buildWbActivityCards({
    summary: wbSummary,
    companion: openerCompanion,
  })
  const openerPackage = buildNeutralSbWbLessonPackage({
    companion: openerCompanion,
    sbSelection: createSbActivityHandoffSelection(
      openerSbCards,
      createDefaultSbActivitySelection(openerSbCards),
    ),
    wbSelection: createWbActivityHandoffSelection(
      openerWbCards,
      createDefaultWbActivitySelection(openerWbCards),
    ),
  })

  assert.throws(
    () => renderBe3U08LiaNeutralPackageToChalkieShadow(openerPackage),
    /Language in Action Chalkie shadow rendering is not enabled/,
  )

  const { lessonPackage } = liaPackage()
  const reject = (mutated: typeof lessonPackage) => {
    assert.throws(
      () => renderBe3U08LiaNeutralPackageToChalkieShadow(mutated),
      /Language in Action Chalkie shadow rendering is not enabled/,
    )
  }

  reject({
    ...lessonPackage,
    identity: {
      ...lessonPackage.identity,
      componentKey: 'story',
    },
  })
  reject({
    ...lessonPackage,
    identity: {
      ...lessonPackage.identity,
      relationshipType: 'same_unit_continuation',
    } as typeof lessonPackage.identity,
  })
  reject({
    ...lessonPackage,
    identity: {
      ...lessonPackage.identity,
      studentBookCatalogId: 'big_english_2_sb',
    },
  })
  reject({
    ...lessonPackage,
    packaging: {
      ...lessonPackage.packaging,
      lessonOrder: ['lesson2', 'lesson1'],
    } as typeof lessonPackage.packaging,
  })
  reject({
    ...lessonPackage,
    schoolContext: { note: 'must not render' },
  } as typeof lessonPackage)
})

test('excluding Activity 8 removes Audio 155 everywhere', () => {
  const fixture = liaFixture()
  const activity8 = fixture.sbCards.find((card) => card.activityNumber === '8')
  assert.ok(activity8)
  const shadow = renderChalkieFromNeutralPackage(
    liaPackage({ excludedSbCardId: activity8.id }).lessonPackage,
  )
  const serialized = JSON.stringify(shadow)

  assert.doesNotMatch(serialized, /Audio 155|Audio track 155/)
  assert.doesNotMatch(serialized, /Help Luke and Amy make more/)
  assert.doesNotMatch(shadow.lesson1Outline, /Activity 8/)
  assert.match(shadow.detailedHandoff, /Activity 9/)
  assert.match(shadow.lesson1Outline, /Activity 9/)
  assertNoAdjacentLeak(shadow)
})

test('excluding Activity 7 removes Audio 156 and sticker-task references', () => {
  const fixture = liaFixture()
  const activity7 = fixture.wbCards.find((card) => card.activityNumber === '7')
  assert.ok(activity7)
  const shadow = renderChalkieFromNeutralPackage(
    liaPackage({ excludedWbCardId: activity7.id }).lessonPackage,
  )
  const serialized = JSON.stringify(shadow)

  assert.doesNotMatch(serialized, /Audio 156|Audio track 156/)
  assert.doesNotMatch(serialized, /Listen and stick|Grace and Carlos/)
  assert.doesNotMatch(shadow.lesson2Outline, /Activity 7/)
  assert.match(shadow.detailedHandoff, /Activity 8/)
  assert.match(shadow.lesson2Outline, /Activity 8/)
  assertNoAdjacentLeak(shadow)
})

test('selection-aware Activity 7 keeps media honesty without bracketed scene locators', () => {
  const fixture = liaFixture()
  const activity8 = fixture.sbCards.find((card) => card.activityNumber === '8')
  assert.ok(activity8)
  // Exclude one SB activity so rendering is selection-aware while Act 7 remains selected.
  const shadow = renderChalkieFromNeutralPackage(
    liaPackage({ excludedSbCardId: activity8.id }).lessonPackage,
  )
  const serialized = JSON.stringify(shadow)

  assert.match(shadow.detailedHandoff, /\[WB p\.107\] Activity 7:/)
  assert.match(shadow.detailedHandoff, /Listen and stick/)
  assert.match(serialized, /Audio track 156|Audio 156/)
  assert.match(shadow.detailedHandoff, /stickers|Visual\/sticker dependency/)
  assert.doesNotMatch(
    serialized,
    /\[girl stretching\/exercising\]|\[girl riding bike\]|\[boy playing soccer\]/,
  )
  assert.doesNotMatch(serialized, /Sunday \[girl|Saturday \[girl|Sunday \[boy/)
  assertNoAdjacentLeak(shadow)
})

test('Activity 10 alone acknowledges visual dependency without reconstructing Activity 9', () => {
  const fixture = liaFixture()
  const activity10 = fixture.wbCards.find((card) => card.activityNumber === '10')
  assert.ok(activity10)
  const shadow = renderChalkieFromNeutralPackage(
    liaPackage({
      keepOnlyWbCardIds: [activity10.id],
    }).lessonPackage,
  )
  const serialized = JSON.stringify(shadow)

  assert.match(serialized, /Activity 9 illustrations|Depends on Activity 9/)
  assert.doesNotMatch(serialized, /\[WB p\.108\] Activity 9:/)
  assert.doesNotMatch(shadow.lesson2Outline, /^.*Activity 9: Use the illustrations/m)
  assert.doesNotMatch(serialized, /ate dinner|watched TV|woke up/)
  assertNoAdjacentLeak(shadow)
})

test('zero-selected LiA lessons remain explicit without fallback', () => {
  const shadow = renderChalkieFromNeutralPackage(
    liaPackage({ zeroSb: true, zeroWb: true }).lessonPackage,
  )

  assert.match(
    shadow.detailedHandoff,
    /No current Student Book activities were selected/,
  )
  assert.match(shadow.detailedHandoff, /No Workbook activities were selected/)
  assert.match(
    shadow.lesson1Outline,
    /No current Student Book activities were selected/,
  )
  assert.match(shadow.lesson2Outline, /No Workbook activities were selected/)
  assert.equal(shadow.lesson1Vocabulary, '')
  assert.equal(shadow.lesson2Vocabulary, 'No Workbook activities selected.')
  assert.doesNotMatch(JSON.stringify(shadow), /Audio 155|Audio 156/)
  assertNoAdjacentLeak(shadow)
})

test('LiA prior and teacher-added provenance include stable lesson-target labels', () => {
  const handoff = renderChalkieFromNeutralPackage(
    liaPackage({
      priorSupport: [
        {
          id: 'prior-l1',
          provenance: '[PRIOR]',
          label: 'Earlier Unit 8 healthy-living frame',
          frame: 'Did you eat breakfast?',
          sourceReference: 'BE3 SB Unit 8 p.128',
          evidenceReference: 'human-verified activity',
          purpose: null,
          targetLessons: ['lesson1'],
        },
        {
          id: 'hm-l2',
          provenance: '[HM]',
          label: 'Earlier-unit short answer',
          frame: 'No, she did not.',
          sourceReference: 'BE3 SB Unit 7',
          evidenceReference: 'reviewed horizontal-map record',
          purpose: null,
          targetLessons: ['lesson2'],
        },
        {
          id: 'teacher-both',
          provenance: '[TEACHER-ADDED · UNVERIFIED]',
          label: 'Class reminder',
          frame: 'Answer with did or didn\'t.',
          sourceReference: null,
          evidenceReference: null,
          purpose: 'Optional response support',
          targetLessons: ['lesson1', 'lesson2'],
        },
      ],
    }).lessonPackage,
  ).detailedHandoff

  assert.match(
    handoff,
    /\[PRIOR\] Earlier Unit 8 healthy-living frame \(BE3 SB Unit 8 p\.128\) \[Lesson 1\]: Did you eat breakfast\?/,
  )
  assert.match(
    handoff,
    /\[HM\] Earlier-unit short answer \(BE3 SB Unit 7\) \[Lesson 2\]: No, she did not\./,
  )
  assert.match(
    handoff,
    /\[TEACHER-ADDED · UNVERIFIED\] Class reminder \[Lessons 1 and 2\]: Answer with did or didn't\./,
  )
  assert.match(handoff, /Purpose: Optional response support/)
  assert.doesNotMatch(handoff, /No verified prior learning was selected for this lesson\./)
})
