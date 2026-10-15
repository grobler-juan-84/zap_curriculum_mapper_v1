/**
 * Validate a Book Intelligence JSON file against the draft nine-column contract.
 *
 * Must stay aligned with:
 *   app/src/lib/bookIntelligence/*
 *   docs/phase-2/book-intelligence-ui-data-contract-v1.md
 *
 * Examples:
 *   node scripts/validate_book_intelligence_json.mjs
 *   node scripts/validate_book_intelligence_json.mjs --file path/to.json
 */

import { readFileSync } from 'node:fs'
import { dirname, isAbsolute, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const DEFAULT_FILE = resolve(
  root,
  'data/phase2/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json',
)

const SCHEMA_NAME = 'book_intelligence_unit_overview'
const LAYER = 'phase2_interpretation'
const COLUMN_SET = 'nine_column_ab'
const PROVENANCE = new Set(['ai_inferred', 'evidence_quoted', 'mixed'])

const REQUIRED_UNIT_KEYS = [
  'unit_id',
  'unit_number',
  'title',
  'vocabulary',
  'grammar_structures',
  'communicative_functions',
  'learning_outcomes',
  'clil_culture',
  'values',
  'phonics',
  'writing',
]

/** Mirrors app/src/lib/bookIntelligence/fieldMap.ts (keep in sync). */
const FIELD_MAP = [
  ['schema_name', 'schemaName', 'envelope'],
  ['schema_version', 'schemaVersion', 'envelope'],
  ['layer', 'layer', 'envelope'],
  ['column_set', 'columnSet', 'envelope'],
  ['catalog_book_id', 'catalogBookId', 'envelope'],
  ['registry_id', 'registryId', 'envelope'],
  ['book_uuid', 'bookUuid', 'envelope'],
  ['series_slug', 'seriesSlug', 'envelope'],
  ['unit_id', 'unitId', 'unit'],
  ['unit_number', 'unitNumber', 'unit'],
  ['printed_page_start', 'printedPageStart', 'unit'],
  ['printed_page_end', 'printedPageEnd', 'unit'],
  ['grammar_structures', 'grammarStructures', 'unit'],
  ['communicative_functions', 'communicativeFunctions', 'unit'],
  ['learning_outcomes', 'learningOutcomes', 'unit'],
  ['learning_outcomes_provenance', 'learningOutcomesProvenance', 'unit'],
  ['clil_culture', 'clilCulture', 'unit'],
  ['writing', 'writing', 'unit'],
  ['writing_component_id', 'writingComponentId', 'unit'],
  ['source_phase1_schema_version', 'sourcePhase1SchemaVersion', 'unit'],
]

function parseArgs(argv) {
  const options = { file: DEFAULT_FILE }
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--file') options.file = argv[++i]
  }
  return options
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function validate(raw) {
  const errors = []

  if (!isRecord(raw)) {
    return { errors: ['root: expected object'], mapped: null }
  }

  if (raw.schema_name !== SCHEMA_NAME) {
    errors.push(`root.schema_name: expected "${SCHEMA_NAME}"`)
  }
  if (!nonEmptyString(raw.schema_version)) {
    errors.push('root.schema_version: expected non-empty string')
  }
  if (raw.layer !== LAYER) {
    errors.push(`root.layer: expected "${LAYER}"`)
  }
  if (raw.column_set !== COLUMN_SET) {
    errors.push(`root.column_set: expected "${COLUMN_SET}"`)
  }
  if (!nonEmptyString(raw.catalog_book_id)) {
    errors.push('root.catalog_book_id: expected non-empty string')
  }
  if (!Array.isArray(raw.units) || raw.units.length === 0) {
    errors.push('root.units: expected non-empty array')
  }

  if ('book_uuid' in raw && raw.book_uuid !== null && typeof raw.book_uuid !== 'string') {
    errors.push('root.book_uuid: expected string or null')
  }

  const units = []
  if (Array.isArray(raw.units)) {
    raw.units.forEach((unit, index) => {
      const path = `units[${index}]`
      if (!isRecord(unit)) {
        errors.push(`${path}: expected object`)
        return
      }
      for (const key of REQUIRED_UNIT_KEYS) {
        if (key === 'unit_number') {
          if (typeof unit.unit_number === 'number') {
            errors.push(
              `${path}.unit_number: expected string (got number); use "${unit.unit_number}"`,
            )
          } else if (!nonEmptyString(unit.unit_number)) {
            errors.push(`${path}.unit_number: expected non-empty string`)
          }
          continue
        }
        if (!nonEmptyString(unit[key])) {
          errors.push(`${path}.${key}: expected non-empty string`)
        }
      }
      if (
        'learning_outcomes_provenance' in unit &&
        unit.learning_outcomes_provenance !== undefined &&
        !PROVENANCE.has(unit.learning_outcomes_provenance)
      ) {
        errors.push(
          `${path}.learning_outcomes_provenance: invalid value`,
        )
      }
      for (const pageKey of ['printed_page_start', 'printed_page_end']) {
        if (!(pageKey in unit) || unit[pageKey] === undefined) continue
        const v = unit[pageKey]
        if (v !== null && typeof v !== 'number') {
          errors.push(`${path}.${pageKey}: expected number or null`)
        }
      }

      units.push({
        unitId: unit.unit_id,
        unitNumber: unit.unit_number,
        title: unit.title,
        vocabulary: unit.vocabulary,
        grammarStructures: unit.grammar_structures,
        communicativeFunctions: unit.communicative_functions,
        learningOutcomes: unit.learning_outcomes,
        learningOutcomesProvenance:
          unit.learning_outcomes_provenance ?? 'ai_inferred',
        clilCulture: unit.clil_culture,
        values: unit.values,
        phonics: unit.phonics,
        writing: unit.writing,
        writingComponentId: unit.writing_component_id,
        printedPageStart: unit.printed_page_start,
        printedPageEnd: unit.printed_page_end,
      })
    })
  }

  if (errors.length) return { errors, mapped: null }

  return {
    errors: [],
    mapped: {
      schemaName: SCHEMA_NAME,
      schemaVersion: raw.schema_version,
      layer: LAYER,
      columnSet: COLUMN_SET,
      catalogBookId: raw.catalog_book_id,
      registryId: raw.registry_id,
      bookUuid: raw.book_uuid,
      seriesSlug: raw.series_slug,
      title: raw.title,
      units,
    },
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  const filePath = isAbsolute(options.file)
    ? options.file
    : resolve(root, options.file)

  let text
  try {
    text = readFileSync(filePath, 'utf8')
  } catch (err) {
    console.error(`FAIL: cannot read ${filePath}`)
    console.error(err instanceof Error ? err.message : err)
    process.exit(1)
  }

  let raw
  try {
    raw = JSON.parse(text)
  } catch (err) {
    console.error(`FAIL: invalid JSON in ${filePath}`)
    console.error(err instanceof Error ? err.message : err)
    process.exit(1)
  }

  const { errors, mapped } = validate(raw)

  console.log(`File: ${filePath}`)
  console.log('')
  console.log('Field mapping (JSON → TS):')
  for (const [jsonKey, tsKey, level] of FIELD_MAP) {
    console.log(`  ${level.padEnd(8)} ${jsonKey} → ${tsKey}`)
  }
  console.log('')

  if (errors.length) {
    console.log('FAIL: contract validation')
    for (const error of errors) console.log(`  - ${error}`)
    process.exit(1)
  }

  const unit0 = mapped.units[0]
  const checks = [
    ['catalogBookId', mapped.catalogBookId === 'big_english_3_sb'],
    ['units[0].unitId', unit0?.unitId === 'big_english_3_sb_unit_01'],
    ['units[0].writing non-empty', Boolean(unit0?.writing?.trim())],
    [
      'units[0].learningOutcomesProvenance',
      unit0?.learningOutcomesProvenance === 'ai_inferred',
    ],
    ['columnSet nine_column_ab', mapped.columnSet === COLUMN_SET],
  ]

  let smokeOk = true
  console.log('BE3 Unit 1 smoke checks:')
  for (const [label, ok] of checks) {
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}`)
    if (!ok) smokeOk = false
  }
  console.log('')

  if (!smokeOk) {
    console.log('FAIL: mapped values did not match BE3 Unit 1 expectations')
    process.exit(1)
  }

  console.log('PASS: draft nine-column Book Intelligence contract')
  console.log(
    `  catalogBookId=${mapped.catalogBookId} units=${mapped.units.length} writing="${unit0.writing}"`,
  )
}

main()
