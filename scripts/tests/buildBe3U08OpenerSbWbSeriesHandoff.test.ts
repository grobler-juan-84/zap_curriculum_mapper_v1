/**
 * BE3 U8 opener SB→WB series handoff tests.
 * Run: npx tsx --test scripts/tests/buildBe3U08OpenerSbWbSeriesHandoff.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  BE3_U08_OPENER_LESSON1_VOCAB,
  BE3_U08_OPENER_LESSON2_VOCAB,
  BE3_U08_OPENER_SERIES_RELATIONSHIP_ID,
  BE3_U08_OPENER_SERIES_STABLE_REF,
  BE3_U08_OPENER_SERIES_TITLE,
  buildBe3U08OpenerSbWbSeriesHandoff,
} from '../../app/src/features/chalkie/buildBe3U08OpenerSbWbSeriesHandoff.ts'
import { buildChalkiePromptPreview } from '../../app/src/features/chalkie/buildChalkiePromptPreview.ts'
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
import { resolveChalkieLessonContext } from '../../app/src/features/chalkie/resolveChalkieLessonContext.ts'
import { resolveVerifiedSbWbCompanion } from '../../app/src/features/chalkie/resolveVerifiedSbWbCompanion.ts'
import {
  BE2_U08_SERIES_LESSON_TITLE,
  BE2_U08_SINGLE_LESSON_TITLE,
} from '../../app/src/features/chalkie/teacherChoicePrototypeContent.ts'
import type { Book } from '../../app/src/types/curriculum.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const BE3_SB_PATH = path.join(ROOT, 'data/phase1/big_english_3_sb/canonical/v1.json')
const BE3_WB_PATH = path.join(ROOT, 'data/phase1/big_english_3_wb/canonical/v1.json')
const OVERLAY_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx',
)
const HANDOFF_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/buildBe3U08OpenerSbWbSeriesHandoff.ts',
)

function bookStub(overrides: Partial<Book> & Pick<Book, 'catalogBookId' | 'title'>): Book {
  return {
    id: 'book-uuid-test',
    seriesId: 'series-uuid-test',
    catalogBookId: overrides.catalogBookId,
    title: overrides.title,
    level: overrides.level ?? '3',
    audience: overrides.audience ?? 'Primary',
    totalUnits: overrides.totalUnits ?? 9,
    type: overrides.type ?? 'Student Book',
    colorScheme: overrides.colorScheme ?? {
      primary: '#000000',
      accent: '#333333',
      badgeBg: '#eeeeee',
      badgeText: '#111111',
    },
    pageSpreads: overrides.pageSpreads ?? [],
  }
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function loadJson(filePath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>
}

function be3Unit8SbSummary(): BatchJsonSummary {
  const rawBook = loadJson(BE3_SB_PATH)
  const unit = asArray(rawBook.units).find((entry) => {
    const u = asRecord(entry)
    return u.unit_number === 8 || u.unit_number === '8'
  })
  const unitRec = asRecord(unit)
  const start =
    typeof unitRec.printed_page_start === 'number' ? unitRec.printed_page_start : 128
  const end = typeof unitRec.printed_page_end === 'number' ? unitRec.printed_page_end : 143
  const unitPages: number[] = []
  for (let page = start; page <= end; page += 1) unitPages.push(page)

  const pageRows = asArray(rawBook.pages).filter((entry) => {
    const printed = asRecord(entry).printed_page
    return typeof printed === 'number' && unitPages.includes(printed)
  })
  const pageIds = new Set(
    pageRows
      .map((entry) => asRecord(entry).page_id)
      .filter((id): id is string => typeof id === 'string'),
  )

  return {
    catalogBookId: 'big_english_3_sb',
    units: [
      {
        unitNumber: 8,
        title: typeof unitRec.title === 'string' ? unitRec.title : 'Healthy Living',
        printedPageStart: start,
        printedPageEnd: end,
      },
    ],
    vocabulary: [],
    language: [],
    activities: asArray(rawBook.activities)
      .filter((entry) => pageIds.has(String(asRecord(entry).page_id ?? '')))
      .map((entry) => {
        const a = asRecord(entry)
        return {
          title:
            typeof a.instruction === 'string'
              ? a.instruction
              : typeof a.title === 'string'
                ? a.title
                : undefined,
          pageId: typeof a.page_id === 'string' ? a.page_id : undefined,
        }
      }),
    pages: pageRows.map((entry) => {
      const p = asRecord(entry)
      return {
        printedPage: typeof p.printed_page === 'number' ? p.printed_page : null,
        sectionTitle: typeof p.section_title === 'string' ? p.section_title : undefined,
        sectionType: typeof p.section_type === 'string' ? p.section_type : undefined,
        pageHeading: typeof p.page_heading === 'string' ? p.page_heading : undefined,
      }
    }),
    raw: {
      book_id: 'big_english_3_sb',
      units: asArray(rawBook.units).filter((entry) => {
        const u = asRecord(entry)
        return u.unit_number === 8 || u.unit_number === '8'
      }),
      pages: pageRows,
      vocabulary: asArray(rawBook.vocabulary).filter((entry) =>
        pageIds.has(String(asRecord(entry).page_id ?? '')),
      ),
      language: asArray(rawBook.language).filter((entry) =>
        pageIds.has(String(asRecord(entry).page_id ?? '')),
      ),
      activities: asArray(rawBook.activities).filter((entry) =>
        pageIds.has(String(asRecord(entry).page_id ?? '')),
      ),
      curriculum_components: asArray(rawBook.curriculum_components).filter((entry) =>
        pageIds.has(String(asRecord(entry).page_id ?? '')),
      ),
      relationships: asArray(rawBook.relationships),
    },
  }
}

function be3WbSummary(): BatchJsonSummary {
  const raw = loadJson(BE3_WB_PATH)
  return {
    catalogBookId: 'big_english_3_wb',
    units: [],
    vocabulary: [],
    language: [],
    activities: [],
    pages: [],
    raw,
  }
}

function openerWbCards() {
  const companion = resolveVerifiedSbWbCompanion({
    studentBookCatalogId: 'big_english_3_sb',
    studentBookCanonical: loadJson(BE3_SB_PATH),
    workbookCatalogId: 'big_english_3_wb',
    workbookCanonical: loadJson(BE3_WB_PATH),
    studentBookPrintedPages: [128, 129],
  }).companion
  assert.ok(companion)
  return buildWbActivityCards({
    summary: be3WbSummary(),
    companion,
  })
}

test('accepted BE3 opener pair enables series and yields six non-empty copyables', () => {
  assert.ok(fs.existsSync(BE3_SB_PATH))
  assert.ok(fs.existsSync(BE3_WB_PATH))

  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8SbSummary(),
    visiblePrintedPages: [128, 129],
    unitNumber: 8,
    workbookCanonical: loadJson(BE3_WB_PATH),
  })

  assert.equal(lesson.status, 'ready')
  assert.equal(lesson.supportsTwoLessonSeries, true)
  assert.equal(lesson.twoLessonPackagingMode, 'sb_wb')
  assert.equal(
    lesson.workbookCompanion?.relationshipId,
    BE3_U08_OPENER_SERIES_RELATIONSHIP_ID,
  )
  assert.equal(lesson.seriesLessonTitle, BE3_U08_OPENER_SERIES_TITLE)
  assert.equal(lesson.stableSeriesReference, BE3_U08_OPENER_SERIES_STABLE_REF)
  assert.ok(!lesson.seriesLessonTitle?.includes(BE3_U08_OPENER_SERIES_STABLE_REF))

  const handoff = buildBe3U08OpenerSbWbSeriesHandoff()
  assert.ok(handoff.seriesTitle.trim())
  assert.ok(handoff.detailedHandoff.trim())
  assert.ok(handoff.lesson1Outline.trim())
  assert.ok(handoff.lesson1Vocabulary.trim())
  assert.ok(handoff.lesson2Outline.trim())
  assert.ok(handoff.lesson2Vocabulary.trim())

  const prompt = buildChalkiePromptPreview({
    lesson,
    packageShape: 'series',
    selectedSuggestions: [],
    teacherAdditions: [],
  })
  assert.equal(prompt, handoff.detailedHandoff)
  assert.match(prompt, /Lesson 1: Student Book printed pages 128–129/)
  assert.match(prompt, /Lesson 2: Workbook printed pages 104–105/)
  assert.match(prompt, /consolidation\/practice/)
})

test('L1 uses SB scope and L2 uses WB scope', () => {
  const handoff = buildBe3U08OpenerSbWbSeriesHandoff()

  assert.equal(handoff.lesson1Vocabulary, BE3_U08_OPENER_LESSON1_VOCAB)
  assert.equal(handoff.lesson2Vocabulary, BE3_U08_OPENER_LESSON2_VOCAB)
  assert.match(handoff.lesson1Vocabulary, /have a big breakfast/)
  assert.doesNotMatch(handoff.lesson1Vocabulary, /ate a healthy breakfast/)
  assert.match(handoff.lesson2Vocabulary, /ate a healthy breakfast/)
  assert.doesNotMatch(handoff.lesson2Vocabulary, /have a big breakfast/)

  assert.match(handoff.lesson1Outline, /Student Book pp\. 128–129/)
  assert.match(handoff.lesson1Outline, /\[SB\]/)
  assert.doesNotMatch(handoff.lesson1Outline, /\[WB\]/)

  assert.match(handoff.lesson2Outline, /Workbook pp\. 104–105/)
  assert.match(handoff.lesson2Outline, /\[WB\]/)
  assert.doesNotMatch(handoff.lesson2Outline, /\[SB\]/)
  assert.match(handoff.lesson2Outline, /Consolidation\/practice/)

  assert.match(handoff.detailedHandoff, /\[SB p\.128\]/)
  assert.match(handoff.detailedHandoff, /\[WB p\.104\]/)
  assert.match(handoff.detailedHandoff, /Live Right!/)
})

test('all-selected opener Workbook cards preserve the accepted handoff', () => {
  const cards = openerWbCards()
  const selection = createWbActivityHandoffSelection(
    cards,
    createDefaultWbActivitySelection(cards),
  )

  assert.deepEqual(
    buildBe3U08OpenerSbWbSeriesHandoff({
      workbookActivitySelection: selection,
    }),
    buildBe3U08OpenerSbWbSeriesHandoff(),
  )
})

test('excluding WB105 Activity 3 removes its song/audio evidence without affecting selected neighbours', () => {
  const cards = openerWbCards()
  const activity3 = cards.find((card) => card.activityNumber === '3')
  assert.ok(activity3)
  const selection = createWbActivityHandoffSelection(
    cards,
    setWbActivityCardSelected({
      cards,
      state: createDefaultWbActivitySelection(cards),
      cardId: activity3.id,
      selected: false,
    }),
  )
  const handoff = buildBe3U08OpenerSbWbSeriesHandoff({
    workbookActivitySelection: selection,
  })

  assert.doesNotMatch(handoff.detailedHandoff, /\[WB p\.105\] Activity 3/)
  assert.doesNotMatch(handoff.detailedHandoff, /Listen and write/)
  assert.doesNotMatch(handoff.detailedHandoff, /Track 153|Audio track 153/)
  assert.doesNotMatch(handoff.detailedHandoff, /Song practice · Live Right!/)
  assert.doesNotMatch(handoff.lesson2Outline, /Activity 3|Listen and write|Track 153/)
  assert.doesNotMatch(handoff.lesson2Vocabulary, /\benough\b/)
  assert.match(handoff.detailedHandoff, /\[WB p\.104\] Activity 1/)
  assert.match(handoff.detailedHandoff, /\[WB p\.104\] Activity 2/)
  assert.match(handoff.detailedHandoff, /\[WB p\.105\] Activity 4/)
  assert.match(handoff.detailedHandoff, /Yes, I did\. \| No, I didn't\./)
  assert.match(handoff.lesson2Outline, /Activity 4/)
  assert.match(handoff.lesson2Vocabulary, /ate a healthy breakfast/)
})

test('zero selected opener Workbook activities keeps Lesson 2 valid without fallback', () => {
  const cards = openerWbCards()
  const selection = createWbActivityHandoffSelection(cards, {
    selectedCardIds: [],
  })
  const handoff = buildBe3U08OpenerSbWbSeriesHandoff({
    workbookActivitySelection: selection,
  })

  assert.match(handoff.detailedHandoff, /No Workbook activities were selected/)
  assert.match(handoff.detailedHandoff, /do not reconstruct or infer content/i)
  assert.doesNotMatch(handoff.detailedHandoff, /\[WB p\.10[45]\] Activity/)
  assert.doesNotMatch(handoff.detailedHandoff, /Live Right! song listen\/write/)
  assert.match(handoff.lesson2Outline, /No Workbook activities were selected/)
  assert.equal(handoff.lesson2Vocabulary, 'No Workbook activities selected.')
  assert.equal(handoff.seriesTitle, BE3_U08_OPENER_SERIES_TITLE)
  assert.equal(handoff.stableSeriesReference, BE3_U08_OPENER_SERIES_STABLE_REF)
})

test('SB activity exclusions propagate through opener Lesson 1 while Workbook Lesson 2 stays unchanged', () => {
  const summary = be3Unit8SbSummary()
  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [128, 129],
  })
  const allSelected = createSbActivityHandoffSelection(
    cards,
    createDefaultSbActivitySelection(cards),
  )
  const baseline = buildBe3U08OpenerSbWbSeriesHandoff()
  assert.deepEqual(
    buildBe3U08OpenerSbWbSeriesHandoff({
      activitySelection: allSelected,
    }),
    baseline,
  )

  const activity4 = cards.find(
    (card) => card.references.activityId === 'bep3_sb_act_08_04',
  )
  assert.ok(activity4)
  const partial = createSbActivityHandoffSelection(
    cards,
    setSbActivityCardSelected({
      cards,
      state: createDefaultSbActivitySelection(cards),
      cardId: activity4.id,
      selected: false,
    }),
  )
  const handoff = buildBe3U08OpenerSbWbSeriesHandoff({
    activitySelection: partial,
  })

  assert.doesNotMatch(handoff.detailedHandoff, /Listen and sing\. How does Zach feel today\?/)
  assert.doesNotMatch(handoff.detailedHandoff, /I feel awful today\. \/ He feels awful\./)
  assert.doesNotMatch(handoff.detailedHandoff, /\b(?:151|152)\b/)
  assert.doesNotMatch(handoff.lesson1Outline, /Activity 4:/)
  assert.doesNotMatch(handoff.lesson1Outline, /official book audio.*151|151.*official book audio/i)
  assert.match(handoff.detailedHandoff, /Activity 5: Look at 1\. Ask and answer\./)
  assert.match(handoff.lesson1Outline, /Activity 5:/)
  assert.match(handoff.detailedHandoff, /Activity 1:/)
  assert.doesNotMatch(handoff.detailedHandoff, /Purpose: introduce the Unit 8 healthy living strand/)
  assert.equal(handoff.lesson2Outline, baseline.lesson2Outline)
  assert.equal(handoff.lesson2Vocabulary, baseline.lesson2Vocabulary)
  assert.match(handoff.detailedHandoff, /\[WB p\.105\] Song practice · Live Right!/)
})

test('excluding every opener SB activity gives an honest no-selection state without fallback', () => {
  const cards = buildSbActivityCards({
    summary: be3Unit8SbSummary(),
    activeLessonPrintedPages: [128, 129],
  })
  const selection = createSbActivityHandoffSelection(cards, {
    selectedCardIds: [],
  })
  const handoff = buildBe3U08OpenerSbWbSeriesHandoff({
    activitySelection: selection,
  })

  assert.match(handoff.detailedHandoff, /No current Student Book activities were selected/)
  assert.match(handoff.detailedHandoff, /do not recreate them from page context/i)
  assert.doesNotMatch(handoff.detailedHandoff, /\[SB p\.128\] Activity/)
  assert.doesNotMatch(handoff.detailedHandoff, /\[SB p\.129\] Activity/)
  assert.match(handoff.lesson1Outline, /No current Student Book activities were selected/)
  assert.equal(handoff.lesson1Vocabulary, '')
})

test('non-series BE3 spreads use SB-only two-lesson, not opener/story SB→WB', () => {
  const wb = loadJson(BE3_WB_PATH)

  // LiA is resolver-wired but has no series handoff.
  const lia = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8SbSummary(),
    visiblePrintedPages: [132, 133],
    unitNumber: 8,
    workbookCanonical: wb,
  })
  assert.equal(lia.supportsTwoLessonSeries, true)
  assert.equal(lia.twoLessonPackagingMode, 'sb_only')
  assert.equal(
    lia.workbookCompanion?.relationshipId,
    'be3_sb_wb_rel_u08_lia_sb132-133_wb107-108',
  )
  assert.equal(lia.seriesLessonTitle, null)
  assert.equal(lia.stableSeriesReference, null)

  // CLIL/P.E. is resolver-wired but has no series handoff.
  const clil = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8SbSummary(),
    visiblePrintedPages: [134, 135],
    unitNumber: 8,
    workbookCanonical: wb,
  })
  assert.equal(clil.supportsTwoLessonSeries, true)
  assert.equal(clil.twoLessonPackagingMode, 'sb_only')
  assert.equal(
    clil.workbookCompanion?.relationshipId,
    'be3_sb_wb_rel_u08_clil_pe_sb134-135_wb109-110',
  )
  assert.equal(clil.seriesLessonTitle, null)
  assert.equal(clil.stableSeriesReference, null)

  // Grammar is resolver-wired but has no series handoff.
  const grammar = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8SbSummary(),
    visiblePrintedPages: [136, 137],
    unitNumber: 8,
    workbookCanonical: wb,
  })
  assert.equal(grammar.supportsTwoLessonSeries, true)
  assert.equal(grammar.twoLessonPackagingMode, 'sb_only')
  assert.equal(
    grammar.workbookCompanion?.relationshipId,
    'be3_sb_wb_rel_u08_grammar_sb136-137_wb111-112',
  )
  assert.deepEqual(grammar.workbookCompanion?.workbookPrintedPages, [111, 112])
  assert.equal(grammar.seriesLessonTitle, null)
  assert.equal(grammar.stableSeriesReference, null)

  // Culture is resolver-wired but has no series handoff.
  const culture = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8SbSummary(),
    visiblePrintedPages: [138, 139],
    unitNumber: 8,
    workbookCanonical: wb,
  })
  assert.equal(culture.supportsTwoLessonSeries, true)
  assert.equal(culture.twoLessonPackagingMode, 'sb_only')
  assert.equal(
    culture.workbookCompanion?.relationshipId,
    'be3_sb_wb_rel_u08_culture_sb138-139_wb113-114',
  )
  assert.deepEqual(culture.workbookCompanion?.workbookPrintedPages, [113, 114])
  assert.equal(culture.seriesLessonTitle, null)
  assert.equal(culture.stableSeriesReference, null)

  // Writing is resolver-wired (1→1) but has no series handoff.
  const writing = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8SbSummary(),
    visiblePrintedPages: [140],
    unitNumber: 8,
    workbookCanonical: wb,
  })
  assert.equal(writing.supportsTwoLessonSeries, true)
  assert.equal(writing.twoLessonPackagingMode, 'sb_only')
  assert.equal(
    writing.workbookCompanion?.relationshipId,
    'be3_sb_wb_rel_u08_writing_sb140_wb115',
  )
  assert.deepEqual(writing.workbookCompanion?.workbookPrintedPages, [115])
  assert.equal(writing.seriesLessonTitle, null)
  assert.equal(writing.stableSeriesReference, null)

  // Phonics is resolver-wired (1→1) but has no series handoff.
  const phonics = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8SbSummary(),
    visiblePrintedPages: [141],
    unitNumber: 8,
    workbookCanonical: wb,
  })
  assert.equal(phonics.supportsTwoLessonSeries, true)
  assert.equal(phonics.twoLessonPackagingMode, 'sb_only')
  assert.equal(
    phonics.workbookCompanion?.relationshipId,
    'be3_sb_wb_rel_u08_phonics_sb141_wb116',
  )
  assert.deepEqual(phonics.workbookCompanion?.workbookPrintedPages, [116])
  assert.equal(phonics.seriesLessonTitle, null)
  assert.equal(phonics.stableSeriesReference, null)

  // Review is resolver-wired (1→1) but has no series handoff.
  const review = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8SbSummary(),
    visiblePrintedPages: [143],
    unitNumber: 8,
    workbookCanonical: wb,
  })
  assert.equal(review.supportsTwoLessonSeries, true)
  assert.equal(review.twoLessonPackagingMode, 'sb_only')
  assert.equal(
    review.workbookCompanion?.relationshipId,
    'be3_sb_wb_rel_u08_review_sb143_wb117',
  )
  assert.deepEqual(review.workbookCompanion?.workbookPrintedPages, [117])
  assert.equal(review.seriesLessonTitle, null)
  assert.equal(review.stableSeriesReference, null)

  // Values p.142 remains intentionally SB-only.
  const values = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary: be3Unit8SbSummary(),
    visiblePrintedPages: [142],
    unitNumber: 8,
    workbookCanonical: wb,
  })
  assert.equal(values.supportsTwoLessonSeries, true)
  assert.equal(values.twoLessonPackagingMode, 'sb_only')
  assert.equal(values.workbookCompanion, null)
  assert.equal(values.seriesLessonTitle, null)
  assert.equal(values.stableSeriesReference, null)

  const valuesPrompt = buildChalkiePromptPreview({
    lesson: values,
    packageShape: 'series',
    selectedSuggestions: [],
    teacherAdditions: [],
  })
  assert.match(valuesPrompt, /TWO-LESSON series/)
  assert.match(valuesPrompt, /ONLY Student Book/)
  assert.doesNotMatch(valuesPrompt, /Workbook printed pages 104–105/)
  assert.doesNotMatch(valuesPrompt, /Workbook printed page 106/)
  assert.doesNotMatch(valuesPrompt, /An Unhealthy Dinner/)
})

test('existing BE2 fixture series titles and packaging remain unchanged', () => {
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_2_sb',
      title: 'Big English 2 Student Book',
      level: '2',
    }),
    summary: {
      catalogBookId: 'big_english_2_sb',
      units: [
        {
          unitNumber: 8,
          title: 'Wild Animals',
          printedPageStart: 128,
          printedPageEnd: 143,
        },
      ],
      vocabulary: [],
      language: [],
      activities: [],
      pages: [
        { printedPage: 128, sectionTitle: 'Vocabulary' },
        { printedPage: 129, sectionTitle: 'Song' },
      ],
      raw: {
        book_id: 'big_english_2_sb',
        pages: [
          { page_id: 'be2_sb_p128', printed_page: 128 },
          { page_id: 'be2_sb_p129', printed_page: 129 },
        ],
      },
    },
    visiblePrintedPages: [128, 129],
    unitNumber: 8,
  })

  assert.equal(lesson.isBe2U08PrototypeRoute, true)
  assert.equal(lesson.supportsTwoLessonSeries, true)
  assert.equal(lesson.singleLessonTitle, BE2_U08_SINGLE_LESSON_TITLE)
  assert.equal(lesson.seriesLessonTitle, BE2_U08_SERIES_LESSON_TITLE)
  assert.equal(lesson.workbookCompanion, null)
  assert.equal(lesson.stableSeriesReference, null)

  const prompt = buildChalkiePromptPreview({
    lesson,
    packageShape: 'series',
    selectedSuggestions: [],
    teacherAdditions: [],
  })
  assert.match(prompt, /Big English 2 Unit 8/)
  assert.match(prompt, /To the Zoo!/)
  assert.doesNotMatch(prompt, /Healthy Living/)
  assert.doesNotMatch(prompt, /Live Right!/)
})

test('BE3 series handoff and overlay stay local (no OpenAI)', () => {
  const handoffSource = fs.readFileSync(HANDOFF_PATH, 'utf8')
  const overlaySource = fs.readFileSync(OVERLAY_PATH, 'utf8')
  assert.ok(!handoffSource.includes('/api/chalkie/generate'))
  assert.ok(!handoffSource.toLowerCase().includes('openai'))
  assert.ok(!overlaySource.includes('chalkieLessonDraftService'))
  assert.ok(
    overlaySource.includes('buildBe3U08OpenerSbWbSeriesHandoffWithNeutralCanary'),
  )
})
