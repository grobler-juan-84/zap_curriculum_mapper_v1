export const SCOPE_SEQUENCE_SCHEMA_VERSION = 'ss-extraction-v2' as const

export type ScopeSequenceCategory = {
  readonly categoryNameRaw: string
  readonly columnOrder: number
  readonly cellStatus: string
  readonly rawText: string
  /** Complete original category; retained so the adapter is lossless. */
  readonly raw: Readonly<Record<string, unknown>>
}

export type ScopeSequenceUnit = {
  readonly unitNumberRaw: string
  readonly unitTitleRaw: string
  readonly studentBookPagesRaw: string
  readonly sourcePdfPages: readonly number[]
  readonly publisherCategories: readonly ScopeSequenceCategory[]
  /** Complete original unit; retained so the adapter is lossless. */
  readonly raw: Readonly<Record<string, unknown>>
}

export type ScopeSequenceDocument = {
  readonly schemaVersion: typeof SCOPE_SEQUENCE_SCHEMA_VERSION
  readonly extractionMetadata: {
    readonly promptVersion: string
    readonly targetLevel: string
  }
  readonly sourceMetadata: {
    readonly sourceFilename: string
    readonly publisher: string | null
    readonly series: string
    readonly level: string
    readonly edition: string | null
    readonly pdfPages: readonly number[]
  }
  readonly originalColumnHeadings: readonly string[]
  readonly units: readonly ScopeSequenceUnit[]
  /** Complete approved document; no source fields are discarded by the adapter. */
  readonly raw: Readonly<Record<string, unknown>>
}

export type ScopeSequenceParseResult =
  | { readonly ok: true; readonly data: ScopeSequenceDocument }
  | { readonly ok: false; readonly errors: readonly string[] }

export type CurriculumAuthorityState =
  | { readonly status: 'not_configured' }
  | { readonly status: 'loading' }
  | { readonly status: 'unavailable'; readonly message: string }
  | {
      readonly status: 'ready'
      readonly document: ScopeSequenceDocument
      readonly unit: ScopeSequenceUnit
    }

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function asString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}

function asNullableString(value: unknown): string | null {
  return value === null ? null : asString(value)
}

function asNumberArray(value: unknown): number[] | null {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== 'number')) {
    return null
  }
  return [...value]
}

export function parseScopeSequenceV2(rawValue: unknown): ScopeSequenceParseResult {
  const errors: string[] = []
  const raw = asRecord(rawValue)
  if (!raw) return { ok: false, errors: ['Scope & Sequence root must be an object.'] }
  if (raw.schema_version !== SCOPE_SEQUENCE_SCHEMA_VERSION) {
    errors.push(`schema_version must be ${SCOPE_SEQUENCE_SCHEMA_VERSION}.`)
  }

  const extraction = asRecord(raw.extraction_metadata)
  const source = asRecord(raw.source_metadata)
  const promptVersion = asString(extraction?.prompt_version)
  const targetLevel = asString(extraction?.target_level)
  const sourceFilename = asString(source?.source_filename)
  const publisher = asNullableString(source?.publisher)
  const series = asString(source?.series)
  const sourceLevel = source?.level
  const level =
    typeof sourceLevel === 'number'
      ? String(sourceLevel)
      : typeof sourceLevel === 'string'
        ? sourceLevel
        : null
  const edition = asNullableString(source?.edition)
  const pdfPages = asNumberArray(source?.pdf_pages)
  if (!promptVersion || !targetLevel) {
    errors.push('extraction_metadata requires prompt_version and target_level.')
  }
  if (!sourceFilename || !series || !level || !pdfPages) {
    errors.push('source_metadata is incomplete or invalid.')
  }
  if (source && source.publisher !== null && publisher === null) {
    errors.push('source_metadata.publisher must be a string or null.')
  }
  if (source && source.edition !== null && edition === null) {
    errors.push('source_metadata.edition must be a string or null.')
  }

  const headings = Array.isArray(raw.original_column_headings)
    ? raw.original_column_headings.filter(
        (entry): entry is string => typeof entry === 'string',
      )
    : []
  if (
    !Array.isArray(raw.original_column_headings) ||
    headings.length !== raw.original_column_headings.length
  ) {
    errors.push('original_column_headings must contain only strings.')
  }

  const rawUnits = Array.isArray(raw.units) ? raw.units : []
  if (!Array.isArray(raw.units)) errors.push('units must be an array.')
  const units: ScopeSequenceUnit[] = []
  rawUnits.forEach((entry, unitIndex) => {
    const unit = asRecord(entry)
    const unitNumberRaw = asString(unit?.unit_number_raw)
    const unitTitleRaw = asString(unit?.unit_title_raw)
    const studentBookPagesRaw = asString(unit?.student_book_pages_raw)
    const sourcePdfPages = asNumberArray(
      asRecord(unit?.source_location)?.pdf_pages,
    )
    const rawCategories = Array.isArray(unit?.publisher_categories)
      ? unit.publisher_categories
      : []
    if (
      !unit ||
      !unitNumberRaw ||
      !unitTitleRaw ||
      studentBookPagesRaw === null ||
      !sourcePdfPages ||
      !Array.isArray(unit.publisher_categories)
    ) {
      errors.push(`units[${unitIndex}] is incomplete or invalid.`)
      return
    }

    const publisherCategories: ScopeSequenceCategory[] = []
    rawCategories.forEach((categoryEntry, categoryIndex) => {
      const category = asRecord(categoryEntry)
      const categoryNameRaw = asString(category?.category_name_raw)
      const columnOrder =
        typeof category?.column_order === 'number' ? category.column_order : null
      const cellStatus = asString(category?.cell_status)
      const rawText = asString(category?.raw_text)
      if (!category || !categoryNameRaw || columnOrder === null || !cellStatus || rawText === null) {
        errors.push(
          `units[${unitIndex}].publisher_categories[${categoryIndex}] is incomplete or invalid.`,
        )
        return
      }
      publisherCategories.push({
        categoryNameRaw,
        columnOrder,
        cellStatus,
        rawText,
        raw: category,
      })
    })
    units.push({
      unitNumberRaw,
      unitTitleRaw,
      studentBookPagesRaw,
      sourcePdfPages,
      publisherCategories,
      raw: unit,
    })
  })

  if (
    errors.length ||
    !promptVersion ||
    !targetLevel ||
    !sourceFilename ||
    !series ||
    !level ||
    !pdfPages
  ) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    data: {
      schemaVersion: SCOPE_SEQUENCE_SCHEMA_VERSION,
      extractionMetadata: { promptVersion, targetLevel },
      sourceMetadata: {
        sourceFilename,
        publisher,
        series,
        level,
        edition,
        pdfPages,
      },
      originalColumnHeadings: headings,
      units,
      raw,
    },
  }
}

export function findScopeSequenceUnit(
  document: ScopeSequenceDocument | null | undefined,
  unitNumber: string | number | null | undefined,
): ScopeSequenceUnit | null {
  if (!document || unitNumber === null || unitNumber === undefined) return null
  const requested = Number(unitNumber)
  if (!Number.isFinite(requested)) return null
  return (
    document.units.find((unit) => Number(unit.unitNumberRaw) === requested) ?? null
  )
}
