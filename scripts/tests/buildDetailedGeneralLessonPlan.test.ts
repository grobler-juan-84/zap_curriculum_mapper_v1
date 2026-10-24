/**
 * Detailed general lesson plan — same evidence and package shape as Chalkie.
 * Run: npx tsx --test scripts/tests/buildDetailedGeneralLessonPlan.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { allocateSbOnlyTwoLessonActivities } from '../../app/src/features/chalkie/allocateSbOnlyTwoLessonActivities.ts'
import { buildChalkiePromptPreview } from '../../app/src/features/chalkie/buildChalkiePromptPreview.ts'
import { buildDetailedGeneralLessonPlan } from '../../app/src/features/chalkie/buildDetailedGeneralLessonPlan.ts'
import {
  buildSbActivityCards,
  createDefaultSbActivitySelection,
  createSbActivityHandoffSelection,
} from '../../app/src/features/chalkie/chalkieActivitySelection.ts'
import { resolveChalkieLessonContext } from '../../app/src/features/chalkie/resolveChalkieLessonContext.ts'
import type { Book } from '../../app/src/types/curriculum.ts'
import type { BatchJsonSummary } from '../../app/src/types/validation.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const BE3_SB_PATH = path.join(ROOT, 'data/phase1/big_english_3_sb/canonical/v1.json')
const BE3_WB_PATH = path.join(ROOT, 'data/phase1/big_english_3_wb/canonical/v1.json')
const OVERLAY_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx',
)
const BUILDER_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/buildDetailedGeneralLessonPlan.ts',
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
    },
  }
}

test('BE3 U8 pp.132–133 single-lesson plan uses same selected SB evidence as Chalkie', () => {
  const summary = be3Unit8SbSummary()
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary,
    visiblePrintedPages: [132, 133],
    unitNumber: 8,
  })
  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [132, 133],
  })
  const selection = createSbActivityHandoffSelection(
    cards,
    createDefaultSbActivitySelection(cards),
  )
  const prior = [
    {
      id: 'prior-1',
      label: 'Earlier frame',
      frame: 'I like fruit.',
      source: 'Unit 7',
      whyItMayHelp: 'Warm-up',
      caution: 'Optional',
      evidenceNote: 'Same-unit',
      provenanceTag: '[PRIOR]' as const,
    },
  ]
  const additions = [
    { title: 'Class phrase', frame: 'Let us begin.', purpose: 'Routine' },
  ]

  const chalkie = buildChalkiePromptPreview({
    lesson,
    packageShape: 'single',
    selectedSuggestions: prior,
    teacherAdditions: additions,
    activitySelection: selection,
  })
  const plan = buildDetailedGeneralLessonPlan({
    lesson,
    packageShape: 'single',
    selectedSuggestions: prior,
    teacherAdditions: additions,
    activitySelection: selection,
  })

  assert.equal(plan.packageShapeLabel, 'Single lesson')
  assert.match(plan.detailedLessonPlan, /DETAILED GENERAL LESSON PLAN/)
  assert.match(plan.detailedLessonPlan, /Package shape: Single lesson/)
  assert.match(plan.detailedLessonPlan, /printed pages 132, 133/)
  assert.match(plan.detailedLessonPlan, /\[PRIOR] Earlier frame/)
  assert.match(plan.detailedLessonPlan, /\[TEACHER-ADDED · UNVERIFIED] Class phrase/)
  assert.doesNotMatch(plan.detailedLessonPlan, /LESSON 2/)
  assert.match(
    plan.detailedLessonPlan,
    /not an output from ChatGPT, Claude, Canva/,
  )
  assert.doesNotMatch(chalkie, /TWO-LESSON series/)
  assert.match(chalkie, /printed pages 132, 133/)
  assert.match(chalkie, /\[PRIOR] Earlier frame/)

  for (const evidence of selection.selectedEvidence) {
    assert.match(
      plan.detailedLessonPlan,
      new RegExp(`\\[SB p\\.${evidence.printedPage}\\]`),
    )
    assert.match(
      plan.detailedLessonPlan,
      new RegExp(evidence.verifiedWording.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    )
  }
})

test('BE3 U8 pp.132–133 SB-only two-lesson plan matches Chalkie allocation', () => {
  const summary = be3Unit8SbSummary()
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary,
    visiblePrintedPages: [132, 133],
    unitNumber: 8,
    workbookCanonical: loadJson(BE3_WB_PATH),
  })
  assert.equal(lesson.twoLessonPackagingMode, 'sb_only')
  assert.equal(lesson.supportsTwoLessonSeries, true)

  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [132, 133],
  })
  const selection = createSbActivityHandoffSelection(
    cards,
    createDefaultSbActivitySelection(cards),
  )
  const allocation = allocateSbOnlyTwoLessonActivities(selection.selectedEvidence)
  assert.ok(allocation.lesson1.length >= 1)
  assert.ok(allocation.lesson2.length >= 1)

  const chalkie = buildChalkiePromptPreview({
    lesson,
    packageShape: 'series',
    selectedSuggestions: [],
    teacherAdditions: [],
    activitySelection: selection,
  })
  const plan = buildDetailedGeneralLessonPlan({
    lesson,
    packageShape: 'series',
    selectedSuggestions: [],
    teacherAdditions: [],
    activitySelection: selection,
  })

  assert.equal(
    plan.packageShapeLabel,
    'Two lessons from this Student Book spread',
  )
  assert.match(plan.detailedLessonPlan, /Package shape: Two lessons from this Student Book spread/)
  assert.match(plan.detailedLessonPlan, /No Workbook companion is implied/)
  assert.match(plan.detailedLessonPlan, /LESSON 1 — Student Book/)
  assert.match(plan.detailedLessonPlan, /LESSON 2 — Student Book/)
  assert.doesNotMatch(plan.detailedLessonPlan, /LESSON 2 — Workbook/)
  assert.doesNotMatch(plan.detailedLessonPlan, /Workbook printed page/)

  assert.match(chalkie, /TWO-LESSON series/)
  assert.match(chalkie, /ONLY Student Book printed pages 132, 133/)

  for (const evidence of allocation.lesson1) {
    assert.match(
      plan.detailedLessonPlan,
      new RegExp(evidence.verifiedWording.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    )
  }
  for (const evidence of allocation.lesson2) {
    assert.match(
      plan.detailedLessonPlan,
      new RegExp(evidence.verifiedWording.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    )
  }
})

test('BE3 opener SB→WB series plan preserves Student Book then Workbook shape', () => {
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
  assert.equal(lesson.twoLessonPackagingMode, 'sb_wb')

  const plan = buildDetailedGeneralLessonPlan({
    lesson,
    packageShape: 'series',
    selectedSuggestions: [],
    teacherAdditions: [],
  })

  assert.equal(plan.packageShapeLabel, 'Two-lesson Student Book → Workbook series')
  assert.match(plan.detailedLessonPlan, /LESSON 1 — Student Book/)
  assert.match(plan.detailedLessonPlan, /LESSON 2 — Workbook/)
  assert.match(plan.detailedLessonPlan, /pp\. 128–129/)
  assert.match(plan.detailedLessonPlan, /pp\. 104–105/)
  assert.doesNotMatch(
    plan.detailedLessonPlan,
    /UNIT PLANNING CONTEXT \(Book Intelligence/,
  )
})

test('BE3 opener plan includes labelled BI planning context without changing source evidence', () => {
  const summary = be3Unit8SbSummary()
  const lesson = resolveChalkieLessonContext({
    book: bookStub({
      catalogBookId: 'big_english_3_sb',
      title: 'Big English 3 Student Book',
    }),
    summary,
    visiblePrintedPages: [128, 129],
    unitNumber: 8,
    workbookCanonical: loadJson(BE3_WB_PATH),
  })
  const cards = buildSbActivityCards({
    summary,
    activeLessonPrintedPages: [128, 129],
  })
  const selection = createSbActivityHandoffSelection(
    cards,
    createDefaultSbActivitySelection(cards),
  )
  const baseline = buildDetailedGeneralLessonPlan({
    lesson,
    packageShape: 'series',
    selectedSuggestions: [],
    teacherAdditions: [],
    activitySelection: selection,
  })
  const plan = buildDetailedGeneralLessonPlan({
    lesson,
    packageShape: 'series',
    selectedSuggestions: [],
    teacherAdditions: [],
    activitySelection: selection,
    bookIntelligenceUnit: {
      unitId: 'big_english_3_sb_unit_08',
      unitNumber: '8',
      title: 'Healthy Living',
      vocabulary: 'MUST-NOT-APPEAR-AS-EVIDENCE',
      grammarStructures: 'MUST-NOT-APPEAR-AS-EVIDENCE',
      communicativeFunctions: 'Talk about healthy and unhealthy activities.',
      learningOutcomes: 'I can talk about healthy living.',
      learningOutcomesProvenance: 'ai_inferred',
      clilCulture: 'MUST-NOT-APPEAR-AS-EVIDENCE',
      values: 'MUST-NOT-APPEAR-AS-EVIDENCE',
      phonics: 'MUST-NOT-APPEAR-AS-EVIDENCE',
      writing: 'MUST-NOT-APPEAR-AS-EVIDENCE',
    },
  })

  assert.match(
    plan.detailedLessonPlan,
    /UNIT PLANNING CONTEXT \(Book Intelligence · phase2_interpretation\)/,
  )
  assert.match(plan.detailedLessonPlan, /not Student Book \/ Workbook page evidence/)
  assert.match(
    plan.detailedLessonPlan,
    /Communicative focus: Talk about healthy and unhealthy activities\./,
  )
  assert.match(
    plan.detailedLessonPlan,
    /Suggested learning outcomes \(ai_inferred\): I can talk about healthy living\./,
  )
  assert.doesNotMatch(plan.detailedLessonPlan, /MUST-NOT-APPEAR-AS-EVIDENCE/)

  for (const evidence of selection.selectedEvidence) {
    assert.match(
      plan.detailedLessonPlan,
      new RegExp(evidence.verifiedWording.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    )
  }
  assert.match(baseline.detailedLessonPlan, /LESSON 1 — Student Book/)
})

test('overlay offers both prepare actions without changing Chalkie assembly imports', () => {
  const overlay = fs.readFileSync(OVERLAY_PATH, 'utf8')
  const builder = fs.readFileSync(BUILDER_PATH, 'utf8')

  assert.match(overlay, /Prepare Chalkie prompt/)
  assert.match(overlay, /Prepare lesson plan/)
  assert.match(overlay, /buildDetailedGeneralLessonPlan/)
  assert.match(overlay, /buildChalkiePromptPreview/)
  assert.match(overlay, /handlePrepareChalkiePrompt/)
  assert.match(overlay, /handlePrepareDetailedLessonPlan/)
  assert.doesNotMatch(overlay, /Generate Chalkie prompt/)

  assert.match(builder, /DETAILED GENERAL LESSON PLAN/)
  assert.match(builder, /not an output from ChatGPT, Claude, Canva/)
  assert.doesNotMatch(builder, /\/api\//)
  assert.doesNotMatch(builder, /fetch\(|openai\.com|anthropic\.com/i)
})
