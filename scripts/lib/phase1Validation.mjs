import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '../..')
const requireFromApp = createRequire(resolve(root, 'app', 'package.json'))
const Ajv2020 = requireFromApp('ajv/dist/2020').default
const schema = JSON.parse(
  readFileSync(resolve(root, 'schemas', 'phase1-0.1.schema.json'), 'utf8'),
)

const ajv = new Ajv2020({
  allErrors: true,
  strict: false,
  allowUnionTypes: true,
})
const validateShape = ajv.compile(schema)

export const ARRAY_KEYS = [
  'units',
  'pages',
  'vocabulary',
  'language',
  'activities',
  'continuous_text',
  'curriculum_components',
  'relationships',
  'extraction_issues',
  'schema_gaps',
]

export const ID_FIELDS = {
  units: ['unit_id'],
  pages: ['page_id'],
  vocabulary: ['vocabulary_id'],
  language: ['language_id'],
  activities: ['activity_id'],
  continuous_text: ['text_id', 'continuous_text_id'],
  curriculum_components: ['component_id'],
  relationships: ['relationship_id'],
  extraction_issues: ['issue_id'],
  schema_gaps: ['schema_gap_id'],
}

const ENTITY_TYPE_TO_ARRAY = {
  unit: 'units',
  page: 'pages',
  vocabulary: 'vocabulary',
  vocab: 'vocabulary',
  language: 'language',
  activity: 'activities',
  text: 'continuous_text',
  continuous_text: 'continuous_text',
  component: 'curriculum_components',
  curriculum_component: 'curriculum_components',
  relationship: 'relationships',
}

const KNOWN_VOCABULARY_CLASSIFICATIONS = new Set([
  'target',
  'recycled',
  'supporting_context',
  'instructional',
  'uncertain',
])
const KNOWN_SCOPE_ESTIMATES = new Set([
  'book_specific',
  'series_specific',
  'possibly_universal',
  'unknown',
])
const KNOWN_VERIFICATION_STATUSES = new Set([
  'unverified',
  'needs_review',
  'human_verified',
  'source_dependency',
])
const SEVERITY_ORDER = { ERROR: 0, WARNING: 1, INFO: 2 }

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function asArray(value) {
  return Array.isArray(value) ? value : []
}

function asNonEmptyString(value) {
  return typeof value === 'string' && value.trim() ? value : null
}

function primaryId(arrayKey, record) {
  if (!isRecord(record)) return null
  for (const field of ID_FIELDS[arrayKey] ?? []) {
    const value = asNonEmptyString(record[field])
    if (value) return value
  }
  return null
}

function pointerPart(value) {
  return String(value).replaceAll('~', '~0').replaceAll('/', '~1')
}

function normalizeEntityType(value) {
  if (typeof value !== 'string') return null
  return value.trim().toLowerCase().replaceAll('-', '_').replaceAll(' ', '_')
}

function numericValue(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) {
    return Number(value)
  }
  return null
}

function distribution(records, field) {
  const out = {}
  for (const record of records) {
    if (!isRecord(record)) continue
    const raw = record[field]
    const key = raw == null ? '(null)' : String(raw)
    out[key] = (out[key] ?? 0) + 1
  }
  return out
}

function findLocalPrefixes(aliasMap, catalogBookId) {
  const entry = aliasMap?.byCatalog?.get(catalogBookId)
  return Array.isArray(entry?.entity_id_prefix_examples)
    ? entry.entity_id_prefix_examples.filter((value) => typeof value === 'string' && value)
    : []
}

function stableDatasetHash(dataset) {
  return createHash('sha256').update(JSON.stringify(dataset)).digest('hex')
}

function statusFromCounts(errorCount, warningCount) {
  if (errorCount) return 'failed'
  if (warningCount) return 'passed_with_warnings'
  return 'passed'
}

function sortFindings(findings) {
  findings.sort(
    (a, b) =>
      SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] ||
      a.code.localeCompare(b.code) ||
      a.path.localeCompare(b.path),
  )
}

/**
 * Validate one Phase 1 batch or canonical dataset.
 *
 * This checks structure and internal consistency only. It does not certify
 * curriculum meaning, source completeness, or PDF fidelity.
 */
export function validatePhase1Dataset(dataset, options = {}) {
  const {
    mode = 'canonical',
    bookConfig = null,
    aliasMap = null,
    source = null,
    generatedAt = new Date().toISOString(),
  } = options
  const findings = []
  const add = (severity, code, path, message, details = undefined) => {
    findings.push({
      severity,
      code,
      path,
      message,
      ...(details === undefined ? {} : { details }),
    })
  }

  if (!isRecord(dataset)) {
    add('ERROR', 'ROOT_NOT_OBJECT', '/', 'Dataset root must be a JSON object.')
    return buildReport()
  }

  const shapeOk = validateShape(dataset)
  if (!shapeOk) {
    for (const error of validateShape.errors ?? []) {
      const suffix =
        error.keyword === 'required' && error.params?.missingProperty
          ? `/${pointerPart(error.params.missingProperty)}`
          : ''
      add(
        'ERROR',
        `SCHEMA_${String(error.keyword).toUpperCase()}`,
        `${error.instancePath || ''}${suffix}` || '/',
        error.message ?? 'JSON Schema validation failed.',
        error.params,
      )
    }
  }

  if (mode === 'canonical') {
    if (!isRecord(dataset.verification)) {
      add(
        'ERROR',
        'CANONICAL_VERIFICATION_REQUIRED',
        '/verification',
        'Canonical datasets require a verification object.',
      )
    }
    if ('batch' in dataset) {
      add(
        'ERROR',
        'CANONICAL_BATCH_METADATA_PRESENT',
        '/batch',
        'Canonical datasets must not retain batch metadata at the top level.',
      )
    }
  } else if (mode === 'batch') {
    if (!isRecord(dataset.batch)) {
      add('ERROR', 'BATCH_METADATA_REQUIRED', '/batch', 'Batch datasets require batch metadata.')
    }
  } else {
    add('ERROR', 'VALIDATION_MODE_UNKNOWN', '/', `Unknown validation mode "${mode}".`)
  }

  const indexes = Object.fromEntries(ARRAY_KEYS.map((key) => [key, new Map()]))
  const catalogBookId = bookConfig?.catalogBookId ?? asNonEmptyString(dataset.book?.catalog_book_id)
  checkRequiredBookMetadata()
  checkBookIds(dataset, catalogBookId)
  checkIdsAndBuildIndexes()
  checkEntityReferences()
  checkUnitsAndPages()
  checkRelationships()
  checkClassifications()
  checkVerificationMetadata()
  if (mode === 'batch') checkBatchScope()

  return buildReport()

  function checkRequiredBookMetadata() {
    if (!isRecord(dataset.book)) return
    for (const field of [
      'series',
      'level',
      'book_type',
      'source_filename',
      'source_format',
    ]) {
      if (dataset.book[field] == null || dataset.book[field] === '') {
        add(
          'WARNING',
          'REQUIRED_BOOK_METADATA_NULL',
          `/book/${field}`,
          `Required book metadata field "${field}" is present but unresolved.`,
        )
      }
    }
  }

  function checkBookIds(rootValue, expectedCatalogId) {
    const allowedBatchAliases = new Set(
      expectedCatalogId && aliasMap
        ? aliasMap.aliasesFor(expectedCatalogId)
        : expectedCatalogId
          ? [expectedCatalogId]
          : [],
    )

    function walk(node, path) {
      if (Array.isArray(node)) {
        node.forEach((item, index) => walk(item, `${path}/${index}`))
        return
      }
      if (!isRecord(node)) return

      for (const [key, value] of Object.entries(node)) {
        const childPath = `${path}/${pointerPart(key)}`
        if (key === 'book_id' && typeof value === 'string' && expectedCatalogId) {
          const valid =
            mode === 'canonical'
              ? value === expectedCatalogId
              : allowedBatchAliases.has(value)
          if (!valid) {
            add(
              'ERROR',
              mode === 'canonical'
                ? 'BOOK_ID_NOT_NORMALIZED'
                : 'BOOK_ID_ALIAS_UNKNOWN',
              childPath,
              mode === 'canonical'
                ? `Canonical book_id must be "${expectedCatalogId}", found "${value}".`
                : `Batch book_id "${value}" is not a registered alias of "${expectedCatalogId}".`,
            )
          }
        } else if (
          (key === 'source_book_id' || key === 'target_book_id') &&
          typeof value === 'string' &&
          expectedCatalogId &&
          aliasMap?.resolveCatalogId(value) === expectedCatalogId &&
          mode === 'canonical' &&
          value !== expectedCatalogId
        ) {
          add(
            'ERROR',
            'SAME_BOOK_RELATION_ALIAS_NOT_NORMALIZED',
            childPath,
            `Same-book ${key} must use catalog ID "${expectedCatalogId}".`,
          )
        }
        if (value !== null && typeof value === 'object') walk(value, childPath)
      }
    }

    walk(rootValue, '')

    if (mode === 'canonical' && expectedCatalogId) {
      if (dataset.book?.catalog_book_id !== expectedCatalogId) {
        add(
          'ERROR',
          'CATALOG_BOOK_ID_MISMATCH',
          '/book/catalog_book_id',
          `book.catalog_book_id must be "${expectedCatalogId}".`,
        )
      }
      if (
        dataset.verification?.catalog_book_id != null &&
        dataset.verification.catalog_book_id !== expectedCatalogId
      ) {
        add(
          'ERROR',
          'VERIFICATION_CATALOG_BOOK_ID_MISMATCH',
          '/verification/catalog_book_id',
          `verification.catalog_book_id must be "${expectedCatalogId}".`,
        )
      }
    }
  }

  function checkIdsAndBuildIndexes() {
    for (const arrayKey of ARRAY_KEYS) {
      const records = asArray(dataset[arrayKey])
      records.forEach((record, index) => {
        const path = `/${arrayKey}/${index}`
        if (!isRecord(record)) return
        const id = primaryId(arrayKey, record)
        if (!id) return
        if (indexes[arrayKey].has(id)) {
          add(
            'ERROR',
            'DUPLICATE_PRIMARY_ID',
            path,
            `Duplicate ${ID_FIELDS[arrayKey].join('/')} "${id}" in ${arrayKey}.`,
            { firstPath: indexes[arrayKey].get(id) },
          )
        } else {
          indexes[arrayKey].set(id, path)
        }

        if (
          arrayKey === 'continuous_text' &&
          !asNonEmptyString(record.text_id) &&
          asNonEmptyString(record.continuous_text_id)
        ) {
          add(
            'WARNING',
            'CONTINUOUS_TEXT_LEGACY_ID',
            `${path}/continuous_text_id`,
            'Schema 0.1 uses text_id; continuous_text_id is accepted only for compatibility.',
          )
        }
      })
    }
  }

  function checkEntityReferences() {
    const unitIds = indexes.units
    const pageIds = indexes.pages
    for (const arrayKey of [
      'pages',
      'vocabulary',
      'language',
      'activities',
      'continuous_text',
      'curriculum_components',
      'extraction_issues',
      'schema_gaps',
    ]) {
      asArray(dataset[arrayKey]).forEach((record, index) => {
        if (!isRecord(record)) return
        const path = `/${arrayKey}/${index}`
        const unitId = asNonEmptyString(record.unit_id)
        const pageId = asNonEmptyString(record.page_id)
        if (unitId && !unitIds.has(unitId)) {
          add(
            'ERROR',
            'UNIT_REFERENCE_MISSING',
            `${path}/unit_id`,
            `Unknown unit_id "${unitId}".`,
          )
        }
        if (pageId && !pageIds.has(pageId)) {
          add(
            'ERROR',
            'PAGE_REFERENCE_MISSING',
            `${path}/page_id`,
            `Unknown page_id "${pageId}".`,
          )
        }
        if (
          arrayKey !== 'pages' &&
          arrayKey !== 'extraction_issues' &&
          arrayKey !== 'schema_gaps' &&
          !unitId &&
          !pageId
        ) {
          add(
            'WARNING',
            'ENTITY_WITHOUT_LOCATION',
            path,
            `${arrayKey} record has neither unit_id nor page_id.`,
          )
        }
      })
    }
  }

  function checkUnitsAndPages() {
    const units = asArray(dataset.units).filter(isRecord)
    const pages = asArray(dataset.pages).filter(isRecord)
    const unitById = new Map(
      units.map((unit) => [asNonEmptyString(unit.unit_id), unit]).filter(([id]) => id),
    )
    const unitNumberPaths = new Map()

    units.forEach((unit, index) => {
      const path = `/units/${index}`
      const unitNumber = numericValue(unit.unit_number)
      if (unitNumber != null) {
        if (unitNumberPaths.has(unitNumber)) {
          add(
            'ERROR',
            'DUPLICATE_UNIT_NUMBER',
            `${path}/unit_number`,
            `Duplicate unit_number "${unitNumber}".`,
            { firstPath: unitNumberPaths.get(unitNumber) },
          )
        } else {
          unitNumberPaths.set(unitNumber, `${path}/unit_number`)
        }
      }

      const start = numericValue(unit.printed_page_start)
      const end = numericValue(unit.printed_page_end)
      if (mode === 'canonical' && (start == null || end == null)) {
        add(
          'ERROR',
          'UNIT_PRINTED_RANGE_REQUIRED',
          path,
          'Canonical unit requires printed_page_start and printed_page_end.',
        )
      } else if (start != null && end != null && start > end) {
        add(
          'ERROR',
          'UNIT_PRINTED_RANGE_REVERSED',
          path,
          `Unit printed range ${start}–${end} is reversed.`,
        )
      }
    })

    pages.forEach((page, index) => {
      const unitId = asNonEmptyString(page.unit_id)
      const printedPage = numericValue(page.printed_page)
      const unit = unitId ? unitById.get(unitId) : null
      if (!unit || printedPage == null) return
      const start = numericValue(unit.printed_page_start)
      const end = numericValue(unit.printed_page_end)
      if (start != null && end != null && (printedPage < start || printedPage > end)) {
        add(
          'ERROR',
          'PAGE_OUTSIDE_UNIT_RANGE',
          `/pages/${index}/printed_page`,
          `Printed page ${printedPage} is outside owning unit range ${start}–${end}.`,
          { unitId },
        )
      }
    })

    const pagesByPrinted = new Map()
    pages.forEach((page, index) => {
      const printedPage = numericValue(page.printed_page)
      if (printedPage == null) return
      const existing = pagesByPrinted.get(printedPage) ?? []
      existing.push(`/pages/${index}`)
      pagesByPrinted.set(printedPage, existing)
    })
    for (const [printedPage, paths] of pagesByPrinted) {
      if (paths.length > 1) {
        add(
          'WARNING',
          'DUPLICATE_PRINTED_PAGE',
          paths[1],
          `Printed page ${printedPage} occurs ${paths.length} times.`,
          { paths },
        )
      }
    }

    if (mode === 'canonical' && bookConfig?.expectedUnits) {
      const present = new Set(
        units.map((unit) => numericValue(unit.unit_number)).filter((value) => value != null),
      )
      for (const expected of bookConfig.expectedUnits) {
        if (!present.has(expected)) {
          add(
            'ERROR',
            'EXPECTED_UNIT_MISSING',
            '/units',
            `Expected unit ${expected} is missing.`,
          )
        }
      }
      for (const value of present) {
        if (!bookConfig.expectedUnits.includes(value)) {
          add(
            'WARNING',
            'UNEXPECTED_UNIT',
            '/units',
            `Unit ${value} is outside the configured expected unit list.`,
          )
        }
      }
    }

    const unitRanges = units
      .map((unit) => ({
        unitId: unit.unit_id,
        start: numericValue(unit.printed_page_start),
        end: numericValue(unit.printed_page_end),
      }))
      .filter(({ start, end }) => start != null && end != null)
      .sort((a, b) => a.start - b.start)
    for (let index = 1; index < unitRanges.length; index += 1) {
      const previous = unitRanges[index - 1]
      const current = unitRanges[index]
      if (current.start <= previous.end) {
        add(
          'WARNING',
          'UNIT_PRINTED_RANGES_OVERLAP',
          '/units',
          `Unit ranges overlap: ${previous.unitId} (${previous.start}–${previous.end}) and ${current.unitId} (${current.start}–${current.end}).`,
        )
      } else if (current.start > previous.end + 1) {
        add(
          'WARNING',
          'UNIT_PRINTED_RANGE_GAP',
          '/units',
          `Gap between unit ranges ${previous.end + 1}–${current.start - 1}.`,
          { afterUnitId: previous.unitId, beforeUnitId: current.unitId },
        )
      }
    }

    const printedPages = pages
      .map((page) => numericValue(page.printed_page))
      .filter((value) => value != null)
    const pageMin = printedPages.length ? Math.min(...printedPages) : null
    const pageMax = printedPages.length ? Math.max(...printedPages) : null
    const bookStart = numericValue(dataset.book?.printed_page_start)
    const bookEnd = numericValue(dataset.book?.printed_page_end)
    if (
      mode === 'canonical' &&
      pageMin != null &&
      pageMax != null &&
      bookStart != null &&
      bookEnd != null &&
      (bookStart !== pageMin || bookEnd !== pageMax)
    ) {
      add(
        'WARNING',
        'BOOK_PAGE_RANGE_DIFFERS_FROM_PAGES',
        '/book',
        `Book metadata range ${bookStart}–${bookEnd} differs from represented pages ${pageMin}–${pageMax}.`,
      )
    }
  }

  function checkRelationships() {
    const localPrefixes = findLocalPrefixes(aliasMap, catalogBookId)
    asArray(dataset.relationships).forEach((relationship, index) => {
      if (!isRecord(relationship)) return
      const relationshipPath = `/relationships/${index}`
      checkEndpoint('source', relationship, relationshipPath)
      checkEndpoint('target', relationship, relationshipPath)
    })

    function checkEndpoint(side, relationship, relationshipPath) {
      const typeField = `${side}_entity_type`
      const idField = `${side}_entity_id`
      const bookField = `${side}_book_id`
      const entityType = normalizeEntityType(relationship[typeField])
      const entityId = asNonEmptyString(relationship[idField])
      if (!entityType || !entityId) return
      const arrayKey = ENTITY_TYPE_TO_ARRAY[entityType]
      if (!arrayKey) {
        add(
          'WARNING',
          'RELATIONSHIP_ENTITY_TYPE_UNKNOWN',
          `${relationshipPath}/${typeField}`,
          `Cannot validate ${side} entity type "${relationship[typeField]}".`,
        )
        return
      }
      if (indexes[arrayKey].has(entityId)) return

      const endpointBookId = asNonEmptyString(relationship[bookField])
      const resolvedEndpointBook = endpointBookId
        ? aliasMap?.resolveCatalogId(endpointBookId)
        : null
      if (
        endpointBookId &&
        catalogBookId &&
        (resolvedEndpointBook
          ? resolvedEndpointBook !== catalogBookId
          : endpointBookId !== catalogBookId)
      ) {
        add(
          'INFO',
          'EXTERNAL_RELATIONSHIP_NOT_CHECKED',
          `${relationshipPath}/${idField}`,
          `${side} endpoint "${entityId}" belongs to external book "${resolvedEndpointBook ?? endpointBookId}".`,
        )
        return
      }

      const looksLocal = localPrefixes.some((prefix) => entityId.startsWith(prefix))
      if (mode === 'batch' && looksLocal) {
        add(
          'WARNING',
          'BATCH_RELATIONSHIP_ENDPOINT_DEFERRED',
          `${relationshipPath}/${idField}`,
          `${side} endpoint "${entityId}" is not in this batch; canonical validation will resolve it after merge.`,
        )
        return
      }
      if (!endpointBookId && !looksLocal) {
        add(
          'WARNING',
          'EXTERNAL_RELATIONSHIP_BOOK_ID_MISSING',
          `${relationshipPath}/${idField}`,
          `Unresolved endpoint "${entityId}" appears external but ${bookField} is missing.`,
        )
        return
      }

      add(
        'ERROR',
        `RELATIONSHIP_${side.toUpperCase()}_MISSING`,
        `${relationshipPath}/${idField}`,
        `${side} endpoint "${entityId}" does not exist in ${arrayKey}.`,
      )
    }
  }

  function checkClassifications() {
    asArray(dataset.vocabulary).forEach((record, index) => {
      if (!isRecord(record)) return
      const value = record.classification
      if (
        typeof value === 'string' &&
        value.trim() &&
        !KNOWN_VOCABULARY_CLASSIFICATIONS.has(value)
      ) {
        add(
          'WARNING',
          'VOCABULARY_CLASSIFICATION_UNKNOWN',
          `/vocabulary/${index}/classification`,
          `Unknown working vocabulary classification "${value}"; retained because the list is extensible.`,
        )
      }
    })
    asArray(dataset.schema_gaps).forEach((record, index) => {
      if (!isRecord(record)) return
      const value = record.scope_estimate
      if (
        typeof value === 'string' &&
        value.trim() &&
        !KNOWN_SCOPE_ESTIMATES.has(value)
      ) {
        add(
          'WARNING',
          'SCHEMA_GAP_SCOPE_UNKNOWN',
          `/schema_gaps/${index}/scope_estimate`,
          `Unknown scope_estimate "${value}".`,
        )
      }
    })
    for (const arrayKey of ARRAY_KEYS) {
      asArray(dataset[arrayKey]).forEach((record, index) => {
        if (!isRecord(record)) return
        const value = record.verification_status
        if (
          typeof value === 'string' &&
          value.trim() &&
          !KNOWN_VERIFICATION_STATUSES.has(value)
        ) {
          add(
            'WARNING',
            'VERIFICATION_STATUS_UNKNOWN',
            `/${arrayKey}/${index}/verification_status`,
            `Unknown working verification_status "${value}".`,
          )
        }
      })
    }
  }

  function checkVerificationMetadata() {
    if (mode !== 'canonical' || !isRecord(dataset.verification)) return
    const statuses = dataset.verification.unit_batch_statuses
    if (isRecord(statuses)) {
      const nonVerified = Object.entries(statuses).filter(([, value]) => value !== 'verified')
      if (nonVerified.length) {
        add(
          'WARNING',
          'MERGED_BATCH_STATUS_NOT_VERIFIED',
          '/verification/unit_batch_statuses',
          `${nonVerified.length} merged batch status value(s) are not "verified".`,
          Object.fromEntries(nonVerified),
        )
      }
    }
    if (
      dataset.verification.whole_book_audit === 'passed' &&
      dataset.book?.verification_status &&
      dataset.book.verification_status !== 'human_verified'
    ) {
      add(
        'WARNING',
        'BOOK_VERIFICATION_STATUS_DRIFT',
        '/book/verification_status',
        `Whole-book audit passed but book.verification_status is "${dataset.book.verification_status}".`,
      )
    }
  }

  function checkBatchScope() {
    const batchUnitId = asNonEmptyString(dataset.batch?.unit_id)
    if (!batchUnitId) return
    for (const arrayKey of ARRAY_KEYS) {
      if (arrayKey === 'relationships') continue
      asArray(dataset[arrayKey]).forEach((record, index) => {
        if (!isRecord(record)) return
        const unitId = asNonEmptyString(record.unit_id)
        if (unitId && unitId !== batchUnitId) {
          add(
            'ERROR',
            'BATCH_UNIT_SCOPE_MISMATCH',
            `/${arrayKey}/${index}/unit_id`,
            `Record unit_id "${unitId}" differs from batch.unit_id "${batchUnitId}".`,
          )
        }
      })
    }
  }

  function buildReport() {
    sortFindings(findings)
    const errorCount = findings.filter((finding) => finding.severity === 'ERROR').length
    const warningCount = findings.filter((finding) => finding.severity === 'WARNING').length
    const infoCount = findings.filter((finding) => finding.severity === 'INFO').length
    const arrays = isRecord(dataset)
      ? Object.fromEntries(ARRAY_KEYS.map((key) => [key, asArray(dataset[key]).length]))
      : Object.fromEntries(ARRAY_KEYS.map((key) => [key, 0]))
    const pages = isRecord(dataset) ? asArray(dataset.pages).filter(isRecord) : []
    const printedPages = pages
      .map((page) => numericValue(page.printed_page))
      .filter((value) => value != null)

    return {
      report_version: 1,
      validator_version: '0.1.0',
      generated_at: generatedAt,
      mode,
      source,
      dataset_sha256: isRecord(dataset) ? stableDatasetHash(dataset) : null,
      dataset: {
        catalog_book_id: bookConfig?.catalogBookId ?? dataset?.book?.catalog_book_id ?? null,
        book_id: dataset?.book?.book_id ?? null,
        schema_name: dataset?.schema?.name ?? null,
        schema_version: dataset?.schema?.version ?? null,
      },
      summary: {
        status: statusFromCounts(errorCount, warningCount),
        error_count: errorCount,
        warning_count: warningCount,
        info_count: infoCount,
      },
      metrics: {
        counts: arrays,
        printed_page_range: {
          min: printedPages.length ? Math.min(...printedPages) : null,
          max: printedPages.length ? Math.max(...printedPages) : null,
        },
        vocabulary_classifications: isRecord(dataset)
          ? distribution(asArray(dataset.vocabulary), 'classification')
          : {},
        extraction_issue_types: isRecord(dataset)
          ? distribution(asArray(dataset.extraction_issues), 'issue_type')
          : {},
        schema_gap_scopes: isRecord(dataset)
          ? distribution(asArray(dataset.schema_gaps), 'scope_estimate')
          : {},
      },
      findings,
      disclaimer:
        'Automated structural validation only. This report does not certify curriculum meaning, source completeness, or PDF fidelity.',
    }
  }
}

export function findCrossBatchIdCollisions(batches) {
  const collisions = []
  for (const arrayKey of ARRAY_KEYS) {
    const seen = new Map()
    batches.forEach((batch, batchIndex) => {
      asArray(batch?.[arrayKey]).forEach((record, recordIndex) => {
        const id = primaryId(arrayKey, record)
        if (!id) return
        if (seen.has(id)) {
          collisions.push({
            array: arrayKey,
            id,
            first: seen.get(id),
            duplicate: { batchIndex, recordIndex },
          })
        } else {
          seen.set(id, { batchIndex, recordIndex })
        }
      })
    })
  }
  return collisions
}

export function formatValidationSummary(report) {
  const lines = [
    `Phase 1 structural validation: ${report.summary.status.toUpperCase()}`,
    `book=${report.dataset.catalog_book_id ?? report.dataset.book_id ?? 'unknown'} schema=${report.dataset.schema_version ?? 'unknown'} mode=${report.mode}`,
    `errors=${report.summary.error_count} warnings=${report.summary.warning_count} info=${report.summary.info_count}`,
  ]
  for (const finding of report.findings) {
    lines.push(
      `${finding.severity.padEnd(7)} ${finding.code} ${finding.path} — ${finding.message}`,
    )
  }
  lines.push(report.disclaimer)
  return lines.join('\n')
}
