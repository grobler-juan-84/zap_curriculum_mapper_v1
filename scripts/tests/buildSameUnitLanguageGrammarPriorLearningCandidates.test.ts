/**
 * Read-only same-unit language/grammar PRIOR foundation (not Step 2).
 * Run: npx tsx --test scripts/tests/buildSameUnitLanguageGrammarPriorLearningCandidates.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { buildSameUnitLanguageGrammarPriorLearningCandidates } from '../../app/src/features/chalkie/buildSameUnitLanguageGrammarPriorLearningCandidates.ts'
import { buildSameUnitPriorLearningCandidates } from '../../app/src/features/chalkie/buildSameUnitPriorLearningCandidates.ts'
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

function be3Unit8Summary(): BatchJsonSummary {
  const rawBook = JSON.parse(
    fs.readFileSync(BE3_CANONICAL_PATH, 'utf8'),
  ) as Record<string, unknown>
  const unit = asArray(rawBook.units).find((entry) => {
    const u = asRecord(entry)
    return u.unit_number === 8 || u.unit_number === '8'
  })
  const unitRec = asRecord(unit)
  const start =
    typeof unitRec.printed_page_start === 'number'
      ? unitRec.printed_page_start
      : 128
  const end =
    typeof unitRec.printed_page_end === 'number'
      ? unitRec.printed_page_end
      : 143
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

  const raw = {
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
    curriculum_components: asArray(rawBook.curriculum_components).filter(
      (entry) => pageIds.has(String(asRecord(entry).page_id ?? '')),
    ),
  }

  return {
    catalogBookId: 'big_english_3_sb',
    units: [
      {
        unitNumber: 8,
        title:
          typeof unitRec.title === 'string' ? unitRec.title : 'Healthy Living',
        printedPageStart: start,
        printedPageEnd: end,
      },
    ],
    vocabulary: [],
    language: [],
    activities: [],
    pages: [],
    raw,
  }
}

test('BE3 U8 earlier LiA yields verified Did…? / short-answer candidate with Activity 8', () => {
  const candidates = buildSameUnitLanguageGrammarPriorLearningCandidates({
    summary: be3Unit8Summary(),
    visiblePrintedPages: [136, 137],
    unitNumber: 8,
    catalogBookId: 'big_english_3_sb',
  })
  const lia = candidates.find(
    (item) => item.evidenceKind === 'communicative_language',
  )
  assert.ok(lia)
  assert.equal(lia.sourceType, 'PRIOR')
  assert.equal(lia.title, 'Language in Action')
  assert.deepEqual(lia.printedPages, [132])
  assert.deepEqual(lia.languageIds, [
    'bep3_sb_lang_08_01',
    'bep3_sb_lang_08_02',
  ])
  assert.deepEqual(lia.activityIds, ['bep3_sb_act_08_08'])
  assert.equal(lia.componentId, 'big_english_3_sb_u08_language_in_action')
  assert.equal(lia.spineRole, 'core')
  assert.match(lia.contentPreview, /Did you have breakfast\?/)
  assert.match(lia.contentPreview, /Did he get enough sleep\?/)
  assert.match(lia.contentPreview, /No, I didn't\./)
  assert.match(lia.contentPreview, /Yes, he did\./)
  assert.doesNotMatch(lia.contentPreview, /played \/ walked/)
})

test('BE3 U8 earlier Grammar yields verified regular/irregular past-tense candidate', () => {
  const candidates = buildSameUnitLanguageGrammarPriorLearningCandidates({
    summary: be3Unit8Summary(),
    visiblePrintedPages: [140],
    unitNumber: 8,
    catalogBookId: 'big_english_3_sb',
  })
  const grammar = candidates.find((item) => item.evidenceKind === 'grammar')
  assert.ok(grammar)
  assert.equal(grammar.sourceType, 'PRIOR')
  assert.equal(grammar.title, 'Grammar')
  assert.deepEqual(grammar.printedPages, [136])
  assert.deepEqual(grammar.languageIds, [
    'bep3_sb_lang_08_03',
    'bep3_sb_lang_08_04',
  ])
  assert.deepEqual(grammar.activityIds, [])
  assert.equal(grammar.componentId, 'big_english_3_sb_u08_grammar')
  assert.equal(grammar.spineRole, 'core')
  assert.match(grammar.contentPreview, /played \/ walked \/ stayed/)
  assert.match(grammar.contentPreview, /went \/ saw \/ came/)
  assert.doesNotMatch(grammar.contentPreview, /Did you have breakfast/)
})

test('empty output when language evidence is absent', () => {
  const summary = be3Unit8Summary()
  const raw = asRecord(summary.raw)
  const empty: BatchJsonSummary = {
    ...summary,
    raw: { ...raw, language: [] },
  }
  assert.deepEqual(
    buildSameUnitLanguageGrammarPriorLearningCandidates({
      summary: empty,
      visiblePrintedPages: [140],
      unitNumber: 8,
      catalogBookId: 'big_english_3_sb',
    }),
    [],
  )
})

test('empty output when language is not explicit_in_source (ambiguous)', () => {
  const summary = be3Unit8Summary()
  const raw = asRecord(summary.raw)
  const stripped = asArray(raw.language).map((entry) => ({
    ...asRecord(entry),
    explicit_in_source: false,
  }))
  const ambiguous: BatchJsonSummary = {
    ...summary,
    raw: { ...raw, language: stripped },
  }
  assert.deepEqual(
    buildSameUnitLanguageGrammarPriorLearningCandidates({
      summary: ambiguous,
      visiblePrintedPages: [140],
      unitNumber: 8,
      catalogBookId: 'big_english_3_sb',
    }),
    [],
  )
})

test('current-page LiA and Grammar are excluded from prior candidates', () => {
  const onLia = buildSameUnitLanguageGrammarPriorLearningCandidates({
    summary: be3Unit8Summary(),
    visiblePrintedPages: [132, 133],
    unitNumber: 8,
    catalogBookId: 'big_english_3_sb',
  })
  assert.equal(
    onLia.some((item) => item.evidenceKind === 'communicative_language'),
    false,
  )
  assert.ok(onLia.every((item) => (item.printedPages[0] ?? 0) < 132))

  const onGrammar = buildSameUnitLanguageGrammarPriorLearningCandidates({
    summary: be3Unit8Summary(),
    visiblePrintedPages: [136, 137],
    unitNumber: 8,
    catalogBookId: 'big_english_3_sb',
  })
  assert.equal(
    onGrammar.some((item) => item.evidenceKind === 'grammar'),
    false,
  )
  assert.ok(onGrammar.every((item) => (item.printedPages[0] ?? 0) < 136))
})

test('vocabulary-only builder still excludes language/grammar evidence kinds', () => {
  const vocab = buildSameUnitPriorLearningCandidates({
    summary: be3Unit8Summary(),
    visiblePrintedPages: [136, 137],
    unitNumber: 8,
    catalogBookId: 'big_english_3_sb',
  })
  assert.ok(vocab.every((item) => item.evidenceKind === 'vocabulary'))
  assert.ok(vocab.every((item) => item.languageIds === undefined))
})

test('language/grammar builder stays free of HM / AI / UI wiring', () => {
  const source = fs.readFileSync(
    path.join(
      ROOT,
      'app/src/features/chalkie/buildSameUnitLanguageGrammarPriorLearningCandidates.ts',
    ),
    'utf8',
  )
  assert.doesNotMatch(source, /orderSameUnitPriorLearningCandidatesBySpineRole/)
  assert.doesNotMatch(source, /TeacherChoiceFlowOverlay|OpenAI|fetch\s*\(|School Notes|\[HM\]/)
})
