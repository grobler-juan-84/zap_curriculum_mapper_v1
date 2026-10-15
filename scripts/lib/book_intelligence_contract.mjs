/**
 * Shared Book Intelligence draft-contract validation (mirrors app TS loader).
 * Keep aligned with:
 *   app/src/lib/bookIntelligence/fieldMap.ts
 *   app/src/lib/bookIntelligence/parseBookIntelligenceOverview.ts
 *   docs/phase-2/book-intelligence-ui-data-contract-v1.md
 */

export const SCHEMA_NAME = 'book_intelligence_unit_overview'
export const LAYER = 'phase2_interpretation'
export const COLUMN_SETS = ['eight_column_baseline', 'nine_column_ab']
export const PROVENANCE = new Set(['ai_inferred', 'evidence_quoted', 'mixed'])

export const REQUIRED_UNIT_KEYS_BASE = [
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
]

export const REQUIRED_UNIT_KEYS_NINE = [...REQUIRED_UNIT_KEYS_BASE, 'writing']

/** UI field keys by column set (camelCase; mirrors fieldMap.ts). */
export const UI_FIELDS_BY_COLUMN_SET = {
  eight_column_baseline: [
    'vocabulary',
    'grammarStructures',
    'communicativeFunctions',
    'learningOutcomes',
    'clilCulture',
    'values',
    'phonics',
  ],
  nine_column_ab: [
    'vocabulary',
    'grammarStructures',
    'communicativeFunctions',
    'learningOutcomes',
    'clilCulture',
    'values',
    'phonics',
    'writing',
  ],
}

export function requiredUnitKeysForColumnSet(columnSet) {
  if (columnSet === 'nine_column_ab') return REQUIRED_UNIT_KEYS_NINE
  return REQUIRED_UNIT_KEYS_BASE
}

export function isColumnSet(value) {
  return COLUMN_SETS.includes(value)
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * @returns {{ errors: string[], mapped: object | null }}
 */
export function validateBookIntelligence(raw) {
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
  if (!isColumnSet(raw.column_set)) {
    errors.push(
      `root.column_set: expected one of ${COLUMN_SETS.join(', ')}`,
    )
  }
  if (!nonEmptyString(raw.catalog_book_id)) {
    errors.push('root.catalog_book_id: expected non-empty string')
  }
  if (!Array.isArray(raw.units) || raw.units.length === 0) {
    errors.push('root.units: expected non-empty array')
  }

  if (
    'book_uuid' in raw &&
    raw.book_uuid !== null &&
    typeof raw.book_uuid !== 'string'
  ) {
    errors.push('root.book_uuid: expected string or null')
  }

  const columnSet = isColumnSet(raw.column_set) ? raw.column_set : null
  const requiredKeys = columnSet
    ? requiredUnitKeysForColumnSet(columnSet)
    : REQUIRED_UNIT_KEYS_BASE

  const units = []
  if (Array.isArray(raw.units)) {
    raw.units.forEach((unit, index) => {
      const path = `units[${index}]`
      if (!isRecord(unit)) {
        errors.push(`${path}: expected object`)
        return
      }
      for (const key of requiredKeys) {
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
      // Optional writing on eight_column: if present, must be non-empty string.
      if (
        columnSet === 'eight_column_baseline' &&
        'writing' in unit &&
        unit.writing !== undefined &&
        !nonEmptyString(unit.writing)
      ) {
        errors.push(`${path}.writing: expected non-empty string when present`)
      }
      if (
        'learning_outcomes_provenance' in unit &&
        unit.learning_outcomes_provenance !== undefined &&
        !PROVENANCE.has(unit.learning_outcomes_provenance)
      ) {
        errors.push(`${path}.learning_outcomes_provenance: invalid value`)
      }
      for (const pageKey of ['printed_page_start', 'printed_page_end']) {
        if (!(pageKey in unit) || unit[pageKey] === undefined) continue
        const v = unit[pageKey]
        if (v !== null && typeof v !== 'number') {
          errors.push(`${path}.${pageKey}: expected number or null`)
        }
      }

      const mappedUnit = {
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
        writingComponentId: unit.writing_component_id,
        printedPageStart: unit.printed_page_start,
        printedPageEnd: unit.printed_page_end,
      }
      if (nonEmptyString(unit.writing)) {
        mappedUnit.writing = unit.writing
      }
      units.push(mappedUnit)
    })
  }

  if (errors.length) return { errors, mapped: null }

  return {
    errors: [],
    mapped: {
      schemaName: SCHEMA_NAME,
      schemaVersion: raw.schema_version,
      layer: LAYER,
      columnSet,
      catalogBookId: raw.catalog_book_id,
      registryId: raw.registry_id,
      bookUuid: raw.book_uuid,
      seriesSlug: raw.series_slug,
      title: raw.title,
      units,
    },
  }
}
