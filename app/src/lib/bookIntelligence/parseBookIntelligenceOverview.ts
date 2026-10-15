import type {
  BookIntelligenceOverviewDocument,
  BookIntelligenceParseResult,
  BookIntelligenceUnitOverview,
  LearningOutcomesProvenance,
} from '../../types/bookIntelligence'
import {
  BOOK_INTELLIGENCE_COLUMN_SET,
  BOOK_INTELLIGENCE_LAYER,
  BOOK_INTELLIGENCE_SCHEMA_NAME,
  LEARNING_OUTCOMES_PROVENANCE_VALUES,
  REQUIRED_UNIT_JSON_KEYS,
} from './fieldMap'

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function readNonEmptyString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: string[],
): string | null {
  const value = record[key]
  if (typeof value !== 'string') {
    errors.push(`${path}.${key}: expected non-empty string`)
    return null
  }
  if (!value.trim()) {
    errors.push(`${path}.${key}: must not be empty`)
    return null
  }
  return value
}

function readOptionalString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: string[],
): string | undefined {
  if (!(key in record) || record[key] === undefined) return undefined
  const value = record[key]
  if (typeof value !== 'string') {
    errors.push(`${path}.${key}: expected string when present`)
    return undefined
  }
  return value
}

function readOptionalStringOrNull(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: string[],
): string | null | undefined {
  if (!(key in record) || record[key] === undefined) return undefined
  const value = record[key]
  if (value === null) return null
  if (typeof value !== 'string') {
    errors.push(`${path}.${key}: expected string or null when present`)
    return undefined
  }
  return value
}

function readOptionalNumberOrNull(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: string[],
): number | null | undefined {
  if (!(key in record) || record[key] === undefined) return undefined
  const value = record[key]
  if (value === null) return null
  if (typeof value === 'number' && Number.isFinite(value)) return value
  errors.push(`${path}.${key}: expected number or null when present`)
  return undefined
}

function readUnitNumber(
  record: Record<string, unknown>,
  path: string,
  errors: string[],
): string | null {
  const value = record.unit_number
  if (typeof value === 'number') {
    errors.push(
      `${path}.unit_number: expected string (got number); use \"${String(value)}\"`,
    )
    return null
  }
  return readNonEmptyString(record, 'unit_number', path, errors)
}

function readProvenance(
  record: Record<string, unknown>,
  path: string,
  errors: string[],
): LearningOutcomesProvenance {
  if (
    !(
      'learning_outcomes_provenance' in record
    ) ||
    record.learning_outcomes_provenance === undefined
  ) {
    return 'ai_inferred'
  }
  const value = record.learning_outcomes_provenance
  if (
    typeof value === 'string' &&
    (LEARNING_OUTCOMES_PROVENANCE_VALUES as readonly string[]).includes(value)
  ) {
    return value as LearningOutcomesProvenance
  }
  errors.push(
    `${path}.learning_outcomes_provenance: expected one of ${LEARNING_OUTCOMES_PROVENANCE_VALUES.join(', ')}`,
  )
  return 'ai_inferred'
}

function mapUnit(
  raw: unknown,
  index: number,
  errors: string[],
): BookIntelligenceUnitOverview | null {
  const path = `units[${index}]`
  if (!isRecord(raw)) {
    errors.push(`${path}: expected object`)
    return null
  }

  for (const key of REQUIRED_UNIT_JSON_KEYS) {
    if (key === 'unit_number') continue
    if (!(key in raw)) {
      errors.push(`${path}.${key}: required`)
    }
  }

  const unitId = readNonEmptyString(raw, 'unit_id', path, errors)
  const unitNumber = readUnitNumber(raw, path, errors)
  const title = readNonEmptyString(raw, 'title', path, errors)
  const vocabulary = readNonEmptyString(raw, 'vocabulary', path, errors)
  const grammarStructures = readNonEmptyString(
    raw,
    'grammar_structures',
    path,
    errors,
  )
  const communicativeFunctions = readNonEmptyString(
    raw,
    'communicative_functions',
    path,
    errors,
  )
  const learningOutcomes = readNonEmptyString(
    raw,
    'learning_outcomes',
    path,
    errors,
  )
  const clilCulture = readNonEmptyString(raw, 'clil_culture', path, errors)
  const values = readNonEmptyString(raw, 'values', path, errors)
  const phonics = readNonEmptyString(raw, 'phonics', path, errors)
  const writing = readNonEmptyString(raw, 'writing', path, errors)

  const printedPageStart = readOptionalNumberOrNull(
    raw,
    'printed_page_start',
    path,
    errors,
  )
  const printedPageEnd = readOptionalNumberOrNull(
    raw,
    'printed_page_end',
    path,
    errors,
  )
  const learningOutcomesProvenance = readProvenance(raw, path, errors)
  const writingComponentId = readOptionalStringOrNull(
    raw,
    'writing_component_id',
    path,
    errors,
  )
  const sourcePhase1SchemaVersion = readOptionalStringOrNull(
    raw,
    'source_phase1_schema_version',
    path,
    errors,
  )

  if (
    !unitId ||
    !unitNumber ||
    !title ||
    !vocabulary ||
    !grammarStructures ||
    !communicativeFunctions ||
    !learningOutcomes ||
    !clilCulture ||
    !values ||
    !phonics ||
    !writing
  ) {
    return null
  }

  const unit: BookIntelligenceUnitOverview = {
    unitId,
    unitNumber,
    title,
    vocabulary,
    grammarStructures,
    communicativeFunctions,
    learningOutcomes,
    learningOutcomesProvenance,
    clilCulture,
    values,
    phonics,
    writing,
  }

  if (printedPageStart !== undefined) unit.printedPageStart = printedPageStart
  if (printedPageEnd !== undefined) unit.printedPageEnd = printedPageEnd
  if (writingComponentId !== undefined) {
    unit.writingComponentId = writingComponentId
  }
  if (sourcePhase1SchemaVersion !== undefined) {
    unit.sourcePhase1SchemaVersion = sourcePhase1SchemaVersion
  }

  return unit
}

/**
 * Validate draft-contract JSON (`snake_case`) and map to TypeScript (`camelCase`).
 * Read-only; no I/O.
 */
export function parseBookIntelligenceOverview(
  raw: unknown,
): BookIntelligenceParseResult {
  const errors: string[] = []

  if (!isRecord(raw)) {
    return { ok: false, errors: ['root: expected object'] }
  }

  const schemaName = readNonEmptyString(raw, 'schema_name', 'root', errors)
  if (schemaName && schemaName !== BOOK_INTELLIGENCE_SCHEMA_NAME) {
    errors.push(
      `root.schema_name: expected \"${BOOK_INTELLIGENCE_SCHEMA_NAME}\"`,
    )
  }

  const schemaVersion = readNonEmptyString(raw, 'schema_version', 'root', errors)

  const layer = readNonEmptyString(raw, 'layer', 'root', errors)
  if (layer && layer !== BOOK_INTELLIGENCE_LAYER) {
    errors.push(`root.layer: expected \"${BOOK_INTELLIGENCE_LAYER}\"`)
  }

  const columnSet = readNonEmptyString(raw, 'column_set', 'root', errors)
  if (columnSet && columnSet !== BOOK_INTELLIGENCE_COLUMN_SET) {
    errors.push(
      `root.column_set: expected \"${BOOK_INTELLIGENCE_COLUMN_SET}\" (eight-column baseline is out of scope)`,
    )
  }

  const catalogBookId = readNonEmptyString(
    raw,
    'catalog_book_id',
    'root',
    errors,
  )

  if (!Array.isArray(raw.units)) {
    errors.push('root.units: expected non-empty array')
  } else if (raw.units.length === 0) {
    errors.push('root.units: must contain at least one unit')
  }

  const registryId = readOptionalString(raw, 'registry_id', 'root', errors)
  const bookUuid = readOptionalStringOrNull(raw, 'book_uuid', 'root', errors)
  const seriesSlug = readOptionalString(raw, 'series_slug', 'root', errors)
  const title = readOptionalString(raw, 'title', 'root', errors)
  const notes = readOptionalString(raw, 'notes', 'root', errors)

  const units: BookIntelligenceUnitOverview[] = []
  if (Array.isArray(raw.units)) {
    for (let i = 0; i < raw.units.length; i += 1) {
      const unit = mapUnit(raw.units[i], i, errors)
      if (unit) units.push(unit)
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors }
  }

  if (
    !schemaName ||
    !schemaVersion ||
    !layer ||
    !columnSet ||
    !catalogBookId ||
    units.length === 0
  ) {
    return { ok: false, errors: ['root: incomplete after validation'] }
  }

  const data: BookIntelligenceOverviewDocument = {
    schemaName: BOOK_INTELLIGENCE_SCHEMA_NAME,
    schemaVersion,
    layer: BOOK_INTELLIGENCE_LAYER,
    columnSet: BOOK_INTELLIGENCE_COLUMN_SET,
    catalogBookId,
    units,
  }

  if (registryId !== undefined) data.registryId = registryId
  if (bookUuid !== undefined) data.bookUuid = bookUuid
  if (seriesSlug !== undefined) data.seriesSlug = seriesSlug
  if (title !== undefined) data.title = title
  if (notes !== undefined) data.notes = notes

  return { ok: true, data }
}
