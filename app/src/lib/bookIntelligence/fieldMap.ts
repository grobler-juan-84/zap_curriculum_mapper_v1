/**
 * Explicit JSON (snake_case) ↔ TypeScript (camelCase) field map for the
 * draft nine-column Book Intelligence contract.
 * Keep aligned with docs/phase-2/book-intelligence-ui-data-contract-v1.md
 * and scripts/validate_book_intelligence_json.mjs
 */

export const BOOK_INTELLIGENCE_SCHEMA_NAME =
  'book_intelligence_unit_overview' as const

export const BOOK_INTELLIGENCE_LAYER = 'phase2_interpretation' as const

export const BOOK_INTELLIGENCE_COLUMN_SET = 'nine_column_ab' as const

export const LEARNING_OUTCOMES_PROVENANCE_VALUES = [
  'ai_inferred',
  'evidence_quoted',
  'mixed',
] as const

/** Required envelope JSON keys for nine_column_ab. */
export const REQUIRED_ENVELOPE_JSON_KEYS = [
  'schema_name',
  'schema_version',
  'layer',
  'column_set',
  'catalog_book_id',
  'units',
] as const

/** Required unit JSON keys (identity + nine content columns). */
export const REQUIRED_UNIT_JSON_KEYS = [
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
] as const

export type BookIntelligenceFieldMapEntry = {
  jsonKey: string
  tsKey: string
  level: 'envelope' | 'unit'
  required: boolean
}

/** Mapping checklist used by loaders and the CLI verifier. */
export const BOOK_INTELLIGENCE_FIELD_MAP: readonly BookIntelligenceFieldMapEntry[] =
  [
    {
      jsonKey: 'schema_name',
      tsKey: 'schemaName',
      level: 'envelope',
      required: true,
    },
    {
      jsonKey: 'schema_version',
      tsKey: 'schemaVersion',
      level: 'envelope',
      required: true,
    },
    { jsonKey: 'layer', tsKey: 'layer', level: 'envelope', required: true },
    {
      jsonKey: 'column_set',
      tsKey: 'columnSet',
      level: 'envelope',
      required: true,
    },
    {
      jsonKey: 'catalog_book_id',
      tsKey: 'catalogBookId',
      level: 'envelope',
      required: true,
    },
    {
      jsonKey: 'registry_id',
      tsKey: 'registryId',
      level: 'envelope',
      required: false,
    },
    {
      jsonKey: 'book_uuid',
      tsKey: 'bookUuid',
      level: 'envelope',
      required: false,
    },
    {
      jsonKey: 'series_slug',
      tsKey: 'seriesSlug',
      level: 'envelope',
      required: false,
    },
    { jsonKey: 'title', tsKey: 'title', level: 'envelope', required: false },
    { jsonKey: 'notes', tsKey: 'notes', level: 'envelope', required: false },
    { jsonKey: 'units', tsKey: 'units', level: 'envelope', required: true },
    { jsonKey: 'unit_id', tsKey: 'unitId', level: 'unit', required: true },
    {
      jsonKey: 'unit_number',
      tsKey: 'unitNumber',
      level: 'unit',
      required: true,
    },
    { jsonKey: 'title', tsKey: 'title', level: 'unit', required: true },
    {
      jsonKey: 'printed_page_start',
      tsKey: 'printedPageStart',
      level: 'unit',
      required: false,
    },
    {
      jsonKey: 'printed_page_end',
      tsKey: 'printedPageEnd',
      level: 'unit',
      required: false,
    },
    {
      jsonKey: 'vocabulary',
      tsKey: 'vocabulary',
      level: 'unit',
      required: true,
    },
    {
      jsonKey: 'grammar_structures',
      tsKey: 'grammarStructures',
      level: 'unit',
      required: true,
    },
    {
      jsonKey: 'communicative_functions',
      tsKey: 'communicativeFunctions',
      level: 'unit',
      required: true,
    },
    {
      jsonKey: 'learning_outcomes',
      tsKey: 'learningOutcomes',
      level: 'unit',
      required: true,
    },
    {
      jsonKey: 'learning_outcomes_provenance',
      tsKey: 'learningOutcomesProvenance',
      level: 'unit',
      required: false,
    },
    {
      jsonKey: 'clil_culture',
      tsKey: 'clilCulture',
      level: 'unit',
      required: true,
    },
    { jsonKey: 'values', tsKey: 'values', level: 'unit', required: true },
    { jsonKey: 'phonics', tsKey: 'phonics', level: 'unit', required: true },
    { jsonKey: 'writing', tsKey: 'writing', level: 'unit', required: true },
    {
      jsonKey: 'writing_component_id',
      tsKey: 'writingComponentId',
      level: 'unit',
      required: false,
    },
    {
      jsonKey: 'source_phase1_schema_version',
      tsKey: 'sourcePhase1SchemaVersion',
      level: 'unit',
      required: false,
    },
  ] as const
