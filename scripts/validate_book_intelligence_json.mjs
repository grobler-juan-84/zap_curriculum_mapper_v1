/**
 * Validate a Book Intelligence JSON file against the draft dual-column-set contract.
 *
 * Must stay aligned with:
 *   app/src/lib/bookIntelligence/*
 *   docs/phase-2/book-intelligence-ui-data-contract-v1.md
 *
 * Examples:
 *   node scripts/validate_book_intelligence_json.mjs
 *   node scripts/validate_book_intelligence_json.mjs --file path/to.json
 *   node scripts/validate_book_intelligence_json.mjs --file path/to.json --no-be3-smoke
 */

import { readFileSync } from 'node:fs'
import { dirname, isAbsolute, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { validateBookIntelligence } from './lib/book_intelligence_contract.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const DEFAULT_FILE = resolve(
  root,
  'data/phase2/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json',
)

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
  const options = { file: DEFAULT_FILE, be3Smoke: true }
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--file') options.file = argv[++i]
    if (argv[i] === '--no-be3-smoke') options.be3Smoke = false
  }
  return options
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

  const { errors, mapped } = validateBookIntelligence(raw)

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

  if (options.be3Smoke && mapped.catalogBookId === 'big_english_3_sb') {
    const unit0 = mapped.units[0]
    const checks = [
      ['catalogBookId', mapped.catalogBookId === 'big_english_3_sb'],
      ['units[0].unitId', unit0?.unitId === 'big_english_3_sb_unit_01'],
      ['units[0].writing non-empty', Boolean(unit0?.writing?.trim())],
      [
        'units[0].learningOutcomesProvenance',
        unit0?.learningOutcomesProvenance === 'ai_inferred',
      ],
      ['columnSet nine_column_ab', mapped.columnSet === 'nine_column_ab'],
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
  }

  console.log(
    `PASS: draft Book Intelligence contract (${mapped.columnSet})`,
  )
  console.log(
    `  catalogBookId=${mapped.catalogBookId} units=${mapped.units.length}` +
      (mapped.units[0]?.writing
        ? ` writing="${mapped.units[0].writing}"`
        : ' writing=(omitted)'),
  )
}

main()
