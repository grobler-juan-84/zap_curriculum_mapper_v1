/**
 * Neutral package assembler contract tests.
 * Run: npx tsx --test scripts/tests/buildNeutralSbWbLessonPackage.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  buildNeutralSbWbLessonPackage,
  type NeutralPriorSupportInput,
} from '../../app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts'
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

function fixture(studentBookPrintedPages: number[]) {
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
  return { companion, sbCards, wbCards }
}

function allSelected(studentBookPrintedPages: number[]) {
  const { companion, sbCards, wbCards } = fixture(studentBookPrintedPages)
  return {
    companion,
    sbCards,
    wbCards,
    sbSelection: createSbActivityHandoffSelection(
      sbCards,
      createDefaultSbActivitySelection(sbCards),
    ),
    wbSelection: createWbActivityHandoffSelection(
      wbCards,
      createDefaultWbActivitySelection(wbCards),
    ),
  }
}

test('opener all-selected package preserves exact scope and activity order', () => {
  const input = allSelected([128, 129])
  const lessonPackage = buildNeutralSbWbLessonPackage(input)

  assert.equal(
    lessonPackage.identity.packageReference,
    'be3-sb-wb-u08-p128-129-wb104-105',
  )
  assert.equal(
    lessonPackage.identity.relationshipId,
    'be3_sb_wb_rel_u08_opener_sb128-129_wb104-105',
  )
  assert.equal(lessonPackage.packaging.type, 'two_lesson_sb_wb')
  assert.deepEqual(lessonPackage.packaging.lessonOrder, ['lesson1', 'lesson2'])
  assert.deepEqual(lessonPackage.lesson1.scope, {
    source: 'SB',
    catalogBookId: 'big_english_3_sb',
    pageIds: ['bep3_sb_p128', 'bep3_sb_p129'],
    printedPages: [128, 129],
  })
  assert.deepEqual(lessonPackage.lesson2.scope, {
    source: 'WB',
    catalogBookId: 'big_english_3_wb',
    pageIds: ['bep_3_wb_p104', 'bep_3_wb_p105'],
    printedPages: [104, 105],
  })
  assert.deepEqual(
    lessonPackage.lesson1.selectedActivities.map(
      (activity) => activity.activityNumber,
    ),
    ['1', '2', '3', '4', '5'],
  )
  assert.deepEqual(
    lessonPackage.lesson2.selectedActivities.map(
      (activity) => activity.activityNumber,
    ),
    ['1', '2', '3', '4'],
  )
  assert.equal(lessonPackage.lesson1.selection.status, 'all_selected')
  assert.equal(lessonPackage.lesson2.selection.status, 'all_selected')
})

test('Story all-selected package preserves WB106-only asymmetric scope', () => {
  const input = allSelected([130, 131])
  const lessonPackage = buildNeutralSbWbLessonPackage(input)

  assert.equal(
    lessonPackage.identity.packageReference,
    'be3-sb-wb-u08-p130-131-wb106',
  )
  assert.equal(lessonPackage.identity.componentKey, 'story')
  assert.deepEqual(lessonPackage.lesson1.scope.printedPages, [130, 131])
  assert.deepEqual(lessonPackage.lesson2.scope.printedPages, [106])
  assert.deepEqual(lessonPackage.lesson2.scope.pageIds, ['bep_3_wb_p106'])
  assert.deepEqual(
    lessonPackage.lesson2.selectedActivities.map(
      (activity) => activity.activityNumber,
    ),
    ['5', '6', 'THINK BIG'],
  )
  assert.doesNotMatch(JSON.stringify(lessonPackage), /bep_3_wb_p107/)
})

test('excluded SB and WB activities cannot appear in the neutral package', () => {
  const input = allSelected([128, 129])
  const sbExcluded = input.sbCards.find(
    (card) => card.printedPage === 129 && card.activityNumber === '4',
  )
  const wbExcluded = input.wbCards.find(
    (card) => card.printedPage === 105 && card.activityNumber === '3',
  )
  assert.ok(sbExcluded)
  assert.ok(wbExcluded)
  const sbSelection = createSbActivityHandoffSelection(
    input.sbCards,
    setSbActivityCardSelected({
      cards: input.sbCards,
      state: createDefaultSbActivitySelection(input.sbCards),
      cardId: sbExcluded.id,
      selected: false,
    }),
  )
  const wbSelection = createWbActivityHandoffSelection(
    input.wbCards,
    setWbActivityCardSelected({
      cards: input.wbCards,
      state: createDefaultWbActivitySelection(input.wbCards),
      cardId: wbExcluded.id,
      selected: false,
    }),
  )
  const serialized = JSON.stringify(
    buildNeutralSbWbLessonPackage({
      companion: input.companion,
      sbSelection,
      wbSelection,
    }),
  )

  assert.doesNotMatch(serialized, new RegExp(sbExcluded.id))
  assert.doesNotMatch(serialized, new RegExp(wbExcluded.id))
  assert.doesNotMatch(serialized, /Listen and sing\. How does Zach feel today\?/)
  assert.doesNotMatch(serialized, /Listen and write\./)
  assert.doesNotMatch(serialized, /\b153\b/)
})

test('partial pages lose only their page-attributed vocabulary and language', () => {
  const input = allSelected([128, 129])
  const sbP128Activity = input.sbCards.find(
    (card) => card.printedPage === 128,
  )
  const wbP104Activity1 = input.wbCards.find(
    (card) => card.printedPage === 104 && card.activityNumber === '1',
  )
  assert.ok(sbP128Activity)
  assert.ok(wbP104Activity1)
  const lessonPackage = buildNeutralSbWbLessonPackage({
    companion: input.companion,
    sbSelection: createSbActivityHandoffSelection(
      input.sbCards,
      setSbActivityCardSelected({
        cards: input.sbCards,
        state: createDefaultSbActivitySelection(input.sbCards),
        cardId: sbP128Activity.id,
        selected: false,
      }),
    ),
    wbSelection: createWbActivityHandoffSelection(
      input.wbCards,
      setWbActivityCardSelected({
        cards: input.wbCards,
        state: createDefaultWbActivitySelection(input.wbCards),
        cardId: wbP104Activity1.id,
        selected: false,
      }),
    ),
  })

  assert.deepEqual(
    lessonPackage.lesson1.selection.partiallySelectedPrintedPages,
    [128],
  )
  assert.deepEqual(
    lessonPackage.lesson2.selection.partiallySelectedPrintedPages,
    [104],
  )
  assert.equal(
    lessonPackage.lesson1.vocabulary.includes('have a big breakfast'),
    false,
  )
  assert.equal(
    lessonPackage.lesson2.vocabulary.includes('ate a healthy breakfast'),
    false,
  )
  assert.equal(
    lessonPackage.lesson2.languageModels.some((value) =>
      value.includes('How do you feel today?'),
    ),
    false,
  )
  assert.match(lessonPackage.lesson2.languageModels.join(' | '), /Yes, I did/)
})

test('zero selected SB and WB produce explicit empty states without fallback', () => {
  const input = allSelected([128, 129])
  const lessonPackage = buildNeutralSbWbLessonPackage({
    companion: input.companion,
    sbSelection: createSbActivityHandoffSelection(input.sbCards, {
      selectedCardIds: [],
    }),
    wbSelection: createWbActivityHandoffSelection(input.wbCards, {
      selectedCardIds: [],
    }),
  })

  for (const lesson of [lessonPackage.lesson1, lessonPackage.lesson2]) {
    assert.equal(lesson.selection.status, 'zero_selected')
    assert.deepEqual(lesson.selectedActivities, [])
    assert.deepEqual(lesson.vocabulary, [])
    assert.deepEqual(lesson.languageModels, [])
    assert.deepEqual(lesson.audioReferences, [])
    assert.match(lesson.emptySelectionMessage ?? '', /No .* activities selected/)
  }
  assert.equal(lessonPackage.boundaries.reconstructExcludedActivities, false)
  assert.equal(lessonPackage.boundaries.priorSupportMayReplaceCurrentEvidence, false)
  assert.equal(lessonPackage.boundaries.inferAdjacentWorkbookPages, false)
})

test('prior support preserves provenance and explicit lesson targets', () => {
  const input = allSelected([130, 131])
  const priorSupport: NeutralPriorSupportInput[] = [
    {
      id: 'prior-u08-opener',
      provenance: '[PRIOR]',
      label: 'Earlier Unit 8 healthy-living phrases',
      frame: 'Did you get enough sleep?',
      sourceReference: 'BE3 SB Unit 8 p.128',
      evidenceReference: 'human-verified vocabulary/language rows',
      purpose: 'Optional retrieval before the Story',
      targetLessons: ['lesson1'],
    },
    {
      id: 'hm-u07',
      provenance: '[HM]',
      label: 'Earlier-unit short answers',
      frame: 'Yes, I did. / No, I did not.',
      sourceReference: 'BE3 SB Unit 7',
      evidenceReference: 'future reviewed horizontal-map record',
      purpose: 'Optional support for Workbook answers',
      targetLessons: ['lesson2'],
    },
    {
      id: 'teacher-support',
      provenance: '[TEACHER-ADDED · UNVERIFIED]',
      label: 'Class reminder',
      frame: 'Give a full short answer.',
      sourceReference: null,
      evidenceReference: null,
      purpose: 'Teacher-directed support',
      targetLessons: ['lesson1', 'lesson2'],
    },
  ]
  const baseline = buildNeutralSbWbLessonPackage(input)
  const lessonPackage = buildNeutralSbWbLessonPackage({
    ...input,
    priorSupport,
  })

  assert.deepEqual(lessonPackage.priorSupport, priorSupport)
  assert.deepEqual(
    lessonPackage.priorSupport.map((support) => [
      support.provenance,
      support.targetLessons,
    ]),
    [
      ['[PRIOR]', ['lesson1']],
      ['[HM]', ['lesson2']],
      ['[TEACHER-ADDED · UNVERIFIED]', ['lesson1', 'lesson2']],
    ],
  )
  assert.deepEqual(
    lessonPackage.lesson1.selectedActivities,
    baseline.lesson1.selectedActivities,
  )
  assert.deepEqual(
    lessonPackage.lesson2.selectedActivities,
    baseline.lesson2.selectedActivities,
  )
})

test('LiA all-selected package preserves exact SB132–133 / WB107–108 scope and order', () => {
  const input = allSelected([132, 133])
  const lessonPackage = buildNeutralSbWbLessonPackage(input)

  assert.equal(
    lessonPackage.identity.packageReference,
    'be3-sb-wb-u08-p132-133-wb107-108',
  )
  assert.equal(
    lessonPackage.identity.relationshipId,
    'be3_sb_wb_rel_u08_lia_sb132-133_wb107-108',
  )
  assert.equal(lessonPackage.identity.componentKey, 'lia')
  assert.equal(lessonPackage.identity.componentTitle, 'Language in Action')
  assert.equal(lessonPackage.packaging.type, 'two_lesson_sb_wb')
  assert.deepEqual(lessonPackage.lesson1.scope, {
    source: 'SB',
    catalogBookId: 'big_english_3_sb',
    pageIds: ['bep3_sb_p132', 'bep3_sb_p133'],
    printedPages: [132, 133],
  })
  assert.deepEqual(lessonPackage.lesson2.scope, {
    source: 'WB',
    catalogBookId: 'big_english_3_wb',
    pageIds: ['bep_3_wb_p107', 'bep_3_wb_p108'],
    printedPages: [107, 108],
  })
  assert.deepEqual(
    lessonPackage.lesson1.selectedActivities.map(
      (activity) => activity.activityNumber,
    ),
    ['8', '9', '10', '11', '12'],
  )
  assert.deepEqual(
    lessonPackage.lesson2.selectedActivities.map(
      (activity) => activity.activityNumber,
    ),
    ['7', '8', '9', '10'],
  )
  assert.equal(lessonPackage.lesson1.selection.status, 'all_selected')
  assert.equal(lessonPackage.lesson2.selection.status, 'all_selected')
  assert.equal(lessonPackage.lesson1.selection.selectedActivityCount, 5)
  assert.equal(lessonPackage.lesson2.selection.selectedActivityCount, 4)
  assert.equal(lessonPackage.curriculumInterpretation, undefined)
  assert.equal(lessonPackage.derivedKnowledge, undefined)
  assert.doesNotMatch(JSON.stringify(lessonPackage), /bep3_sb_p130|bep_3_wb_p106|bep3_sb_p134|bep_3_wb_p109/)
})

test('LiA partial and zero selection stay selection-honest without reconstruction', () => {
  const input = allSelected([132, 133])
  const act8 = input.sbCards.find((card) => card.activityNumber === '8')
  const act7 = input.wbCards.find((card) => card.activityNumber === '7')
  assert.ok(act8)
  assert.ok(act7)

  const partial = buildNeutralSbWbLessonPackage({
    companion: input.companion,
    sbSelection: createSbActivityHandoffSelection(
      input.sbCards,
      setSbActivityCardSelected({
        cards: input.sbCards,
        state: createDefaultSbActivitySelection(input.sbCards),
        cardId: act8.id,
        selected: false,
      }),
    ),
    wbSelection: createWbActivityHandoffSelection(
      input.wbCards,
      setWbActivityCardSelected({
        cards: input.wbCards,
        state: createDefaultWbActivitySelection(input.wbCards),
        cardId: act7.id,
        selected: false,
      }),
    ),
  })
  assert.equal(partial.lesson1.selection.status, 'partial_selection')
  assert.equal(partial.lesson2.selection.status, 'partial_selection')
  assert.deepEqual(
    partial.lesson1.selectedActivities.map((activity) => activity.activityNumber),
    ['9', '10', '11', '12'],
  )
  assert.deepEqual(
    partial.lesson2.selectedActivities.map((activity) => activity.activityNumber),
    ['8', '9', '10'],
  )
  assert.equal(
    partial.lesson1.audioReferences.some((reference) =>
      /155/.test(reference.sourceDependencyNote ?? ''),
    ),
    false,
  )
  assert.equal(
    partial.lesson2.audioReferences.some((reference) =>
      /156/.test(reference.sourceDependencyNote ?? ''),
    ),
    false,
  )

  const zero = buildNeutralSbWbLessonPackage({
    companion: input.companion,
    sbSelection: createSbActivityHandoffSelection(input.sbCards, {
      selectedCardIds: [],
    }),
    wbSelection: createWbActivityHandoffSelection(input.wbCards, {
      selectedCardIds: [],
    }),
  })
  assert.equal(zero.lesson1.selection.status, 'zero_selected')
  assert.equal(zero.lesson2.selection.status, 'zero_selected')
  assert.deepEqual(zero.lesson1.selectedActivities, [])
  assert.deepEqual(zero.lesson2.selectedActivities, [])
  assert.deepEqual(zero.lesson1.audioReferences, [])
  assert.deepEqual(zero.lesson2.audioReferences, [])
})

test('LiA prior support retains provenance and BI/NLL remain absent', () => {
  const input = allSelected([132, 133])
  const lessonPackage = buildNeutralSbWbLessonPackage({
    ...input,
    priorSupport: [
      {
        id: 'prior-lia',
        provenance: '[PRIOR]',
        label: 'Earlier Unit 8 healthy-living frame',
        frame: 'Did you eat breakfast?',
        sourceReference: 'BE3 SB Unit 8 p.128',
        evidenceReference: 'human-verified activity',
        purpose: null,
        targetLessons: ['lesson1'],
      },
      {
        id: 'teacher-lia',
        provenance: '[TEACHER-ADDED · UNVERIFIED]',
        label: 'Class reminder',
        frame: 'Answer with did or didn\'t.',
        sourceReference: null,
        evidenceReference: null,
        purpose: 'Optional support',
        targetLessons: ['lesson1', 'lesson2'],
      },
    ],
    bookIntelligenceUnit: {
      unitId: 'big_english_3_sb_unit_08',
      unitNumber: '8',
      title: 'Healthy Living',
      vocabulary: 'MUST-NOT-ENTER',
      grammarStructures: 'MUST-NOT-ENTER',
      communicativeFunctions: 'LiA must not attach BI.',
      learningOutcomes: 'LiA must not attach BI.',
      learningOutcomesProvenance: 'ai_inferred',
      clilCulture: 'MUST-NOT-ENTER',
      values: 'MUST-NOT-ENTER',
      phonics: 'MUST-NOT-ENTER',
    },
  })

  assert.equal(lessonPackage.identity.componentKey, 'lia')
  assert.equal(lessonPackage.curriculumInterpretation, undefined)
  assert.equal(lessonPackage.derivedKnowledge, undefined)
  assert.deepEqual(
    lessonPackage.priorSupport.map((support) => [
      support.provenance,
      support.targetLessons,
    ]),
    [
      ['[PRIOR]', ['lesson1']],
      ['[TEACHER-ADDED · UNVERIFIED]', ['lesson1', 'lesson2']],
    ],
  )
  assert.doesNotMatch(JSON.stringify(lessonPackage), /MUST-NOT-ENTER/)
})

test('LiA fails closed when verified scope fields are altered', () => {
  const input = allSelected([132, 133])
  assert.throws(
    () =>
      buildNeutralSbWbLessonPackage({
        ...input,
        companion: {
          ...input.companion,
          studentBookCatalogId: 'big_english_2_sb',
        },
      }),
    /Verified scope does not match/,
  )
  assert.throws(
    () =>
      buildNeutralSbWbLessonPackage({
        ...input,
        companion: {
          ...input.companion,
          studentBookPrintedPages: [132],
        },
      }),
    /Verified scope does not match/,
  )
  assert.throws(
    () =>
      buildNeutralSbWbLessonPackage({
        ...input,
        companion: {
          ...input.companion,
          studentBookPageIds: ['bep3_sb_p132'],
        },
      }),
    /Verified scope does not match/,
  )
})

test('assembler rejects resolver-wired relationships outside the accepted pairs', () => {
  const input = allSelected([134, 135])
  assert.throws(
    () => buildNeutralSbWbLessonPackage(input),
    /not enabled for relationship/,
  )
})

test('opener without BI still assembles and omits curriculumInterpretation', () => {
  const input = allSelected([128, 129])
  const lessonPackage = buildNeutralSbWbLessonPackage(input)
  assert.equal(lessonPackage.curriculumInterpretation, undefined)
  assert.equal(
    lessonPackage.boundaries.bookIntelligenceMayBecomeSourceEvidence,
    false,
  )
})

test('opener with matching BI attaches labelled curriculumInterpretation only', () => {
  const input = allSelected([128, 129])
  const baseline = buildNeutralSbWbLessonPackage(input)
  const lessonPackage = buildNeutralSbWbLessonPackage({
    ...input,
    bookIntelligenceUnit: {
      unitId: 'big_english_3_sb_unit_08',
      unitNumber: '8',
      title: 'Healthy Living',
      vocabulary: 'MUST-NOT-ENTER-VOCAB',
      grammarStructures: 'MUST-NOT-ENTER-GRAMMAR',
      communicativeFunctions: 'Talk about healthy and unhealthy activities.',
      learningOutcomes: 'I can talk about healthy living.',
      learningOutcomesProvenance: 'ai_inferred',
      clilCulture: 'MUST-NOT-ENTER-CLIL',
      values: 'MUST-NOT-ENTER-VALUES',
      phonics: 'MUST-NOT-ENTER-PHONICS',
      writing: 'MUST-NOT-ENTER-WRITING',
    },
    biArtifactRef:
      'big-english/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json',
  })

  assert.ok(lessonPackage.curriculumInterpretation?.bookIntelligence)
  const bi = lessonPackage.curriculumInterpretation.bookIntelligence
  assert.equal(bi.layer, 'phase2_interpretation')
  assert.equal(
    bi.communicativeFocus,
    'Talk about healthy and unhealthy activities.',
  )
  assert.equal(bi.suggestedLearningOutcomes, 'I can talk about healthy living.')
  assert.equal(bi.learningOutcomesProvenance, 'ai_inferred')
  assert.deepEqual(
    lessonPackage.lesson1.selectedActivities,
    baseline.lesson1.selectedActivities,
  )
  assert.deepEqual(lessonPackage.lesson1.vocabulary, baseline.lesson1.vocabulary)
  assert.deepEqual(
    lessonPackage.lesson1.scope.printedPages,
    baseline.lesson1.scope.printedPages,
  )
  const serialized = JSON.stringify(lessonPackage)
  assert.doesNotMatch(serialized, /MUST-NOT-ENTER/)
})

test('opener omits BI when unit number mismatches package unit', () => {
  const input = allSelected([128, 129])
  const lessonPackage = buildNeutralSbWbLessonPackage({
    ...input,
    bookIntelligenceUnit: {
      unitId: 'big_english_3_sb_unit_07',
      unitNumber: '7',
      title: 'Other unit',
      vocabulary: 'x',
      grammarStructures: 'x',
      communicativeFunctions: 'Wrong unit focus.',
      learningOutcomes: 'Wrong unit LO.',
      learningOutcomesProvenance: 'ai_inferred',
      clilCulture: 'x',
      values: 'x',
      phonics: 'x',
    },
  })
  assert.equal(lessonPackage.curriculumInterpretation, undefined)
})

test('Story package ignores BI even when a unit overview is supplied', () => {
  const input = allSelected([130, 131])
  const lessonPackage = buildNeutralSbWbLessonPackage({
    ...input,
    bookIntelligenceUnit: {
      unitId: 'big_english_3_sb_unit_08',
      unitNumber: '8',
      title: 'Healthy Living',
      vocabulary: 'x',
      grammarStructures: 'x',
      communicativeFunctions: 'Story must not attach BI in this slice.',
      learningOutcomes: 'Story must not attach BI.',
      learningOutcomesProvenance: 'ai_inferred',
      clilCulture: 'x',
      values: 'x',
      phonics: 'x',
    },
  })
  assert.equal(lessonPackage.identity.componentKey, 'story')
  assert.equal(lessonPackage.curriculumInterpretation, undefined)
  assert.equal(
    lessonPackage.boundaries.bookIntelligenceMayBecomeSourceEvidence,
    false,
  )
})

test('Stage 4 derivedKnowledge is optional; base Opener package omits it until pilot attach', () => {
  const source = fs.readFileSync(
    path.join(ROOT, 'app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts'),
    'utf8',
  )
  assert.match(source, /derivedKnowledge\?: NeutralNllDerivedKnowledge/)
  assert.match(source, /NeutralNllDerivedActivitySummary/)
  const builderBody = source.slice(
    source.indexOf('export function buildNeutralSbWbLessonPackage'),
  )
  assert.doesNotMatch(builderBody, /derivedKnowledge:/)

  const lessonPackage = buildNeutralSbWbLessonPackage(allSelected([128, 129]))
  assert.equal(lessonPackage.derivedKnowledge, undefined)
  for (const activity of [
    ...lessonPackage.lesson1.selectedActivities,
    ...lessonPackage.lesson2.selectedActivities,
  ]) {
    assert.equal('summaryText' in activity, false)
    assert.equal('derivedKnowledge' in activity, false)
  }
})
