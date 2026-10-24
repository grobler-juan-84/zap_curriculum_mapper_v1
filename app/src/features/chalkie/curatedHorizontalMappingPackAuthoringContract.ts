/**
 * Verification-ready authoring contract for curated earlier-unit `[HM]` packs.
 *
 * Test / documentation infrastructure only. Not consumed by the runtime builder
 * path. Expanding product `[HM]` coverage still requires an owner-verified pack
 * that satisfies this contract — see:
 * `docs/phase-5/curated-horizontal-mapping-pack-authoring-contract-v0.1.md`
 */
import type { CuratedHorizontalMappingEntry } from './curatedHorizontalMappingEntries'

/** Ownership / verification evidence required before a new pack may ship. */
export type CuratedHorizontalMappingPackVerificationEvidence = {
  readonly ownerVerified: true
  /** Repository-relative paths (or durable citations) justifying the pack. */
  readonly evidenceDocPaths: readonly string[]
  /** Short human summary of what was verified and for which target. */
  readonly summary: string
}

/**
 * Pack-level authoring record: exact target route + entries + verification.
 * A distinct product route is a distinct
 * `(catalogBookId, targetUnitNumber, targetPrintedPages)` triple.
 */
export type CuratedHorizontalMappingPackAuthoringRecord = {
  readonly catalogBookId: string
  readonly targetUnitNumber: number
  readonly targetPrintedPages: readonly number[]
  readonly entries: readonly CuratedHorizontalMappingEntry[]
  readonly verificationEvidence: CuratedHorizontalMappingPackVerificationEvidence
}

export type CuratedHorizontalMappingAuthoringIssue = {
  readonly path: string
  readonly message: string
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function sortedUniquePages(pages: readonly number[]): number[] {
  return [...new Set(pages.filter((page) => Number.isFinite(page) && page > 0))].sort(
    (a, b) => a - b,
  )
}

function pagesOverlap(left: readonly number[], right: readonly number[]): boolean {
  const rightSet = new Set(sortedUniquePages(right))
  return sortedUniquePages(left).some((page) => rightSet.has(page))
}

/**
 * Validate one curated entry against the minimum authoring fields + exclusions.
 * Does not invent content; reports missing / unsafe fields only.
 */
export function validateCuratedHorizontalMappingEntry(
  entry: CuratedHorizontalMappingEntry,
  options?: {
    readonly expectedCatalogBookId?: string
    readonly expectedTargetUnitNumber?: number
    readonly expectedTargetPrintedPages?: readonly number[]
    readonly pathPrefix?: string
  },
): CuratedHorizontalMappingAuthoringIssue[] {
  const prefix = options?.pathPrefix ?? entry.id
  const issues: CuratedHorizontalMappingAuthoringIssue[] = []

  const requireString = (field: keyof CuratedHorizontalMappingEntry, value: unknown) => {
    if (!isNonEmptyString(value)) {
      issues.push({
        path: `${prefix}.${String(field)}`,
        message: `${String(field)} must be a non-empty string`,
      })
    }
  }

  if (!isNonEmptyString(entry.id)) {
    issues.push({ path: `${prefix}.id`, message: 'id must be a non-empty string' })
  }
  requireString('catalogBookId', entry.catalogBookId)
  requireString('title', entry.title)
  requireString('contentPreview', entry.contentPreview)
  requireString('whyItMayHelp', entry.whyItMayHelp)
  requireString('caution', entry.caution)
  requireString('provenanceNote', entry.provenanceNote)
  requireString('sourceReference', entry.sourceReference)

  if (!Number.isFinite(entry.targetUnitNumber) || entry.targetUnitNumber <= 0) {
    issues.push({
      path: `${prefix}.targetUnitNumber`,
      message: 'targetUnitNumber must be a positive number',
    })
  }
  if (!Number.isFinite(entry.sourceUnitNumber) || entry.sourceUnitNumber <= 0) {
    issues.push({
      path: `${prefix}.sourceUnitNumber`,
      message: 'sourceUnitNumber must be a positive number',
    })
  }

  const targetPages = entry.targetPrintedPages
  if (targetPages == null || targetPages.length === 0) {
    issues.push({
      path: `${prefix}.targetPrintedPages`,
      message: 'targetPrintedPages must be an exact non-empty printed-page spread',
    })
  } else if (sortedUniquePages(targetPages).length !== targetPages.length) {
    issues.push({
      path: `${prefix}.targetPrintedPages`,
      message: 'targetPrintedPages must be unique positive printed pages',
    })
  }

  if (
    entry.sourcePrintedPages == null ||
    entry.sourcePrintedPages.length === 0 ||
    sortedUniquePages(entry.sourcePrintedPages).length !== entry.sourcePrintedPages.length
  ) {
    issues.push({
      path: `${prefix}.sourcePrintedPages`,
      message: 'sourcePrintedPages must be a non-empty unique positive page list',
    })
  }

  // Same-unit exclusion — curated [HM] is earlier-unit only.
  if (entry.sourceUnitNumber === entry.targetUnitNumber) {
    issues.push({
      path: `${prefix}.sourceUnitNumber`,
      message: 'sourceUnitNumber must differ from targetUnitNumber (same-unit is [PRIOR])',
    })
  }
  if (
    entry.additionalSourceUnitNumbers?.some((unit) => unit === entry.targetUnitNumber)
  ) {
    issues.push({
      path: `${prefix}.additionalSourceUnitNumbers`,
      message: 'additionalSourceUnitNumbers must not include the target unit',
    })
  }

  // Current-page / target-spread exclusion — source evidence must not sit on the target pages.
  if (
    targetPages != null &&
    targetPages.length > 0 &&
    entry.sourcePrintedPages != null &&
    pagesOverlap(entry.sourcePrintedPages, targetPages)
  ) {
    issues.push({
      path: `${prefix}.sourcePrintedPages`,
      message: 'sourcePrintedPages must not overlap targetPrintedPages (current-page exclusion)',
    })
  }

  if (
    options?.expectedCatalogBookId != null &&
    entry.catalogBookId !== options.expectedCatalogBookId
  ) {
    issues.push({
      path: `${prefix}.catalogBookId`,
      message: `catalogBookId must equal pack target ${options.expectedCatalogBookId}`,
    })
  }
  if (
    options?.expectedTargetUnitNumber != null &&
    entry.targetUnitNumber !== options.expectedTargetUnitNumber
  ) {
    issues.push({
      path: `${prefix}.targetUnitNumber`,
      message: `targetUnitNumber must equal pack target ${options.expectedTargetUnitNumber}`,
    })
  }
  if (options?.expectedTargetPrintedPages != null) {
    const expected = sortedUniquePages(options.expectedTargetPrintedPages)
    const actual = sortedUniquePages(targetPages ?? [])
    if (
      expected.length !== actual.length ||
      expected.some((page, index) => page !== actual[index])
    ) {
      issues.push({
        path: `${prefix}.targetPrintedPages`,
        message: `targetPrintedPages must exactly match pack target [${expected.join(', ')}]`,
      })
    }
  }

  return issues
}

/**
 * Validate a full pack authoring record (route + entries + verification evidence).
 */
export function validateCuratedHorizontalMappingPackAuthoring(
  pack: CuratedHorizontalMappingPackAuthoringRecord,
): CuratedHorizontalMappingAuthoringIssue[] {
  const issues: CuratedHorizontalMappingAuthoringIssue[] = []

  if (!isNonEmptyString(pack.catalogBookId)) {
    issues.push({
      path: 'catalogBookId',
      message: 'catalogBookId must be a non-empty string',
    })
  }
  if (!Number.isFinite(pack.targetUnitNumber) || pack.targetUnitNumber <= 0) {
    issues.push({
      path: 'targetUnitNumber',
      message: 'targetUnitNumber must be a positive number',
    })
  }
  if (
    pack.targetPrintedPages == null ||
    pack.targetPrintedPages.length === 0 ||
    sortedUniquePages(pack.targetPrintedPages).length !== pack.targetPrintedPages.length
  ) {
    issues.push({
      path: 'targetPrintedPages',
      message: 'targetPrintedPages must be an exact non-empty unique printed-page spread',
    })
  }

  if (!Array.isArray(pack.entries) || pack.entries.length === 0) {
    issues.push({
      path: 'entries',
      message: 'entries must include at least one curated candidate',
    })
  } else {
    const seenIds = new Set<string>()
    for (const [index, entry] of pack.entries.entries()) {
      if (seenIds.has(entry.id)) {
        issues.push({
          path: `entries[${index}].id`,
          message: `duplicate candidate id ${entry.id}`,
        })
      }
      seenIds.add(entry.id)
      issues.push(
        ...validateCuratedHorizontalMappingEntry(entry, {
          expectedCatalogBookId: pack.catalogBookId,
          expectedTargetUnitNumber: pack.targetUnitNumber,
          expectedTargetPrintedPages: pack.targetPrintedPages,
          pathPrefix: `entries[${index}]`,
        }),
      )
    }
  }

  const evidence = pack.verificationEvidence
  if (evidence == null || evidence.ownerVerified !== true) {
    issues.push({
      path: 'verificationEvidence.ownerVerified',
      message: 'verificationEvidence.ownerVerified must be true',
    })
  }
  if (
    evidence == null ||
    !Array.isArray(evidence.evidenceDocPaths) ||
    evidence.evidenceDocPaths.length === 0 ||
    evidence.evidenceDocPaths.some((path) => !isNonEmptyString(path))
  ) {
    issues.push({
      path: 'verificationEvidence.evidenceDocPaths',
      message: 'verificationEvidence.evidenceDocPaths must cite at least one evidence doc',
    })
  }
  if (evidence == null || !isNonEmptyString(evidence.summary)) {
    issues.push({
      path: 'verificationEvidence.summary',
      message: 'verificationEvidence.summary must be a non-empty string',
    })
  }

  return issues
}

export function isCuratedHorizontalMappingPackAuthoringComplete(
  pack: CuratedHorizontalMappingPackAuthoringRecord,
): boolean {
  return validateCuratedHorizontalMappingPackAuthoring(pack).length === 0
}

/** Target route for the shipped BE2 U8 opener curated `[HM]` pack. */
export const BE2_U08_CURATED_HM_PACK_TARGET = {
  catalogBookId: 'big_english_2_sb',
  targetUnitNumber: 8,
  targetPrintedPages: [128, 129] as const,
} as const

/**
 * Owner-verification citations for the shipped BE2 U8 opener pack.
 * Does not add a second product route; entries come from the live store.
 */
export const BE2_U08_CURATED_HM_PACK_VERIFICATION_EVIDENCE: CuratedHorizontalMappingPackVerificationEvidence =
  {
    ownerVerified: true,
    evidenceDocPaths: [
      'docs/phase-2/experiments/be2-u01-u07-prior-language-bank-u08-horizontal-map-v0.1.md',
      'docs/phase-2/experiments/be2-u08-horizontal-map-teacher-choice-card-v0.1.md',
      'docs/phase-2/experiments/be2-u08-horizontal-map-lesson-input-pack-v0.1.md',
      'docs/phase-5/chalkie-prior-learning-horizontal-mapping-audit-v0.1.md',
      'docs/phase-5/curated-horizontal-mapping-pack-authoring-contract-v0.1.md',
    ],
    summary:
      'Owner-verified BE2 Unit 8 opener (SB pp.128–129) earlier-unit bank: PL-19, PL-08, PL-01, PL-03; Slice 3 store + golden fixture.',
  }

/** Build the BE2 U8 opener authoring record from live store entries (single source of truth). */
export function be2U08CuratedHmPackAuthoringRecord(
  entries: readonly CuratedHorizontalMappingEntry[],
): CuratedHorizontalMappingPackAuthoringRecord {
  return {
    catalogBookId: BE2_U08_CURATED_HM_PACK_TARGET.catalogBookId,
    targetUnitNumber: BE2_U08_CURATED_HM_PACK_TARGET.targetUnitNumber,
    targetPrintedPages: [...BE2_U08_CURATED_HM_PACK_TARGET.targetPrintedPages],
    entries,
    verificationEvidence: BE2_U08_CURATED_HM_PACK_VERIFICATION_EVIDENCE,
  }
}
