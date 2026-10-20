/**
 * Resolve a verified Student Book → Workbook lesson pairing for Chalkie series packaging.
 *
 * Accepts only:
 * 1) Explicit curated companions in `verifiedSbWbCompanions.ts`, or
 * 2) Human-verified cross-book relationships with both ends present in canonical JSON.
 *
 * Does **not** invent pairings from parallel unit structure, matching page counts,
 * matching section titles, or “same unit number” heuristics.
 *
 * When no such relationship exists, returns null.
 */

import { CURATED_VERIFIED_SB_WB_COMPANIONS } from './verifiedSbWbCompanions'

export type VerifiedSbWbCompanion = {
  studentBookCatalogId: string
  workbookCatalogId: string
  studentBookPrintedPages: number[]
  workbookPrintedPages: number[]
  studentBookPageIds?: string[]
  workbookPageIds?: string[]
  relationshipId: string
  relationshipType: string
  source: 'curated_verified' | 'canonical_relationship'
}

export type SbWbCompanionGapReason =
  | 'workbook_canonical_missing'
  | 'no_cross_book_relationship'
  | 'relationship_not_human_verified'
  | 'relationship_target_incomplete'
  | 'pages_do_not_match_visible_spread'

/** Relationship types that can mean SB↔WB packaging (must also carry cross-book targets). */
export const CROSS_BOOK_SB_WB_RELATIONSHIP_TYPES = [
  'workbook_practice_for',
  'practises_workbook',
  'supports_workbook',
  'student_book_to_workbook',
  'sb_to_wb',
] as const

const CROSS_BOOK_TYPE_SET = new Set<string>(CROSS_BOOK_SB_WB_RELATIONSHIP_TYPES)

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function normalizePages(pages: number[]): number[] {
  return [...new Set(pages.filter((n) => Number.isFinite(n)))].sort((a, b) => a - b)
}

function pagesEqual(a: number[], b: number[]): boolean {
  const left = normalizePages(a)
  const right = normalizePages(b)
  if (left.length !== right.length) return false
  return left.every((page, index) => page === right[index])
}

function catalogBookIdOf(canonical: Record<string, unknown> | null | undefined): string | null {
  if (!canonical) return null
  return asString(asRecord(canonical.book).book_id) ?? asString(canonical.book_id)
}

function isWorkbookCatalogId(catalogBookId: string | null | undefined): boolean {
  return /_wb$/i.test(catalogBookId ?? '')
}

function collectPageIdsForPrintedPages(
  canonical: Record<string, unknown> | null | undefined,
  printedPages: number[],
): Set<string> {
  const wanted = new Set(normalizePages(printedPages))
  const ids = new Set<string>()
  if (!canonical) return ids
  for (const entry of asArray(canonical.pages)) {
    const page = asRecord(entry)
    const printed = page.printed_page
    const pageId = asString(page.page_id)
    if (typeof printed === 'number' && wanted.has(printed) && pageId) ids.add(pageId)
  }
  return ids
}

function printedPagesForEntity(
  canonical: Record<string, unknown> | null | undefined,
  entityId: string,
): number[] {
  if (!canonical) return []
  const pages: number[] = []

  for (const entry of asArray(canonical.pages)) {
    const page = asRecord(entry)
    if (asString(page.page_id) === entityId && typeof page.printed_page === 'number') {
      pages.push(page.printed_page)
    }
  }

  for (const key of ['activities', 'vocabulary', 'language', 'curriculum_components', 'continuous_text']) {
    for (const entry of asArray(canonical[key])) {
      const row = asRecord(entry)
      const idCandidates = [
        asString(row.activity_id),
        asString(row.vocabulary_id),
        asString(row.language_id),
        asString(row.component_id),
        asString(row.text_id),
        asString(row.page_id),
        asString(row.id),
      ].filter((value): value is string => Boolean(value))
      if (!idCandidates.includes(entityId)) continue
      if (typeof row.printed_page === 'number') pages.push(row.printed_page)
      const pageId = asString(row.page_id)
      if (pageId) {
        for (const pageEntry of asArray(canonical.pages)) {
          const page = asRecord(pageEntry)
          if (asString(page.page_id) === pageId && typeof page.printed_page === 'number') {
            pages.push(page.printed_page)
          }
        }
      }
    }
  }

  return normalizePages(pages)
}

function relationshipTouchesStudentSpread(
  rel: Record<string, unknown>,
  studentPageIds: Set<string>,
  studentPages: number[],
  studentCanonical: Record<string, unknown> | null | undefined,
): boolean {
  const sourceId = asString(rel.source_entity_id)
  const targetId = asString(rel.target_entity_id)
  if (sourceId && studentPageIds.has(sourceId)) return true
  if (targetId && studentPageIds.has(targetId)) return true
  if (sourceId) {
    const pages = printedPagesForEntity(studentCanonical, sourceId)
    if (pages.some((page) => studentPages.includes(page))) return true
  }
  if (targetId) {
    const pages = printedPagesForEntity(studentCanonical, targetId)
    if (pages.some((page) => studentPages.includes(page))) return true
  }
  return false
}

function matchCuratedCompanion(input: {
  studentCatalog: string
  studentPages: number[]
}): VerifiedSbWbCompanion | null {
  for (const entry of CURATED_VERIFIED_SB_WB_COMPANIONS) {
    if (entry.verificationStatus !== 'human_verified') continue
    if (entry.studentBookCatalogId !== input.studentCatalog) continue
    if (!pagesEqual(entry.studentBookPrintedPages, input.studentPages)) continue
    return {
      studentBookCatalogId: entry.studentBookCatalogId,
      workbookCatalogId: entry.workbookCatalogId,
      studentBookPrintedPages: [...entry.studentBookPrintedPages],
      workbookPrintedPages: [...entry.workbookPrintedPages],
      studentBookPageIds: [...entry.studentBookPageIds],
      workbookPageIds: [...entry.workbookPageIds],
      relationshipId: entry.relationshipId,
      relationshipType: entry.relationshipType,
      source: 'curated_verified',
    }
  }
  return null
}

/**
 * Attempt to resolve a verified SB→WB companion for the visible Student Book pages.
 * Returns null when evidence is missing or incomplete — never guesses.
 */
export function resolveVerifiedSbWbCompanion(input: {
  studentBookCatalogId: string | null | undefined
  studentBookCanonical: Record<string, unknown> | null | undefined
  workbookCatalogId?: string | null
  workbookCanonical?: Record<string, unknown> | null
  studentBookPrintedPages: number[]
}): { companion: VerifiedSbWbCompanion | null; gapReason: SbWbCompanionGapReason | null } {
  const studentPages = normalizePages(input.studentBookPrintedPages)
  const studentCatalog =
    input.studentBookCatalogId?.trim() ||
    catalogBookIdOf(input.studentBookCanonical) ||
    null

  if (!studentCatalog || studentPages.length === 0) {
    return { companion: null, gapReason: 'no_cross_book_relationship' }
  }

  const curated = matchCuratedCompanion({ studentCatalog, studentPages })
  if (curated) return { companion: curated, gapReason: null }

  const workbookCanonical = input.workbookCanonical ?? null
  const workbookCatalog =
    input.workbookCatalogId?.trim() || catalogBookIdOf(workbookCanonical) || null

  if (!workbookCanonical || !workbookCatalog) {
    return { companion: null, gapReason: 'workbook_canonical_missing' }
  }

  const studentPageIds = collectPageIdsForPrintedPages(
    input.studentBookCanonical,
    studentPages,
  )
  const relationships = [
    ...asArray(input.studentBookCanonical?.relationships),
    ...asArray(workbookCanonical.relationships),
  ]

  let sawCrossBookType = false
  let sawUnverified = false
  let sawIncomplete = false
  let sawPageMismatch = false

  for (const entry of relationships) {
    const rel = asRecord(entry)
    const type = (asString(rel.relationship_type) ?? '').toLowerCase()
    if (!CROSS_BOOK_TYPE_SET.has(type)) continue
    sawCrossBookType = true

    if (!relationshipTouchesStudentSpread(rel, studentPageIds, studentPages, input.studentBookCanonical)) {
      continue
    }

    const verification = (asString(rel.verification_status) ?? '').toLowerCase()
    if (verification && verification !== 'human_verified') {
      sawUnverified = true
      continue
    }

    const sourceId = asString(rel.source_entity_id)
    const targetId = asString(rel.target_entity_id)
    const targetBookId =
      asString(rel.target_book_id) ?? asString(rel.target_catalog_book_id)

    if (!sourceId || !targetId || !targetBookId) {
      sawIncomplete = true
      continue
    }

    const sourceBookId = asString(rel.book_id) ?? studentCatalog
    if (sourceBookId === targetBookId) {
      sawIncomplete = true
      continue
    }

    const workbookIsTarget = isWorkbookCatalogId(targetBookId)
    const workbookIsSource = isWorkbookCatalogId(sourceBookId)
    if (!workbookIsTarget && !workbookIsSource) {
      sawIncomplete = true
      continue
    }

    const resolvedWorkbookCatalog = workbookIsTarget ? targetBookId : sourceBookId
    const workbookEntityId = workbookIsTarget ? targetId : sourceId
    const studentEntityId = workbookIsTarget ? sourceId : targetId

    const workbookPages = printedPagesForEntity(workbookCanonical, workbookEntityId)
    const linkedStudentPages = printedPagesForEntity(input.studentBookCanonical, studentEntityId)
    const effectiveStudentPages =
      linkedStudentPages.length > 0 ? linkedStudentPages : studentPages

    if (workbookPages.length === 0) {
      sawIncomplete = true
      continue
    }

    if (!pagesEqual(effectiveStudentPages, studentPages)) {
      sawPageMismatch = true
      continue
    }

    return {
      companion: {
        studentBookCatalogId: studentCatalog,
        workbookCatalogId: resolvedWorkbookCatalog,
        studentBookPrintedPages: studentPages,
        workbookPrintedPages: workbookPages,
        relationshipId: asString(rel.relationship_id) ?? `${type}:${sourceId}->${targetId}`,
        relationshipType: type,
        source: 'canonical_relationship',
      },
      gapReason: null,
    }
  }

  if (sawPageMismatch) return { companion: null, gapReason: 'pages_do_not_match_visible_spread' }
  if (sawIncomplete) return { companion: null, gapReason: 'relationship_target_incomplete' }
  if (sawUnverified) return { companion: null, gapReason: 'relationship_not_human_verified' }
  if (!sawCrossBookType) return { companion: null, gapReason: 'no_cross_book_relationship' }
  return { companion: null, gapReason: 'no_cross_book_relationship' }
}
