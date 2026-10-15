/**
 * Draft Book Intelligence UI contract types (0.1-draft).
 * Authority: docs/phase-2/book-intelligence-ui-data-contract-v1.md
 * Supports eight_column_baseline and nine_column_ab. Not a methodology/schema lock.
 */

export type BookIntelligenceColumnSet =
  | 'eight_column_baseline'
  | 'nine_column_ab'

export type LearningOutcomesProvenance =
  | 'ai_inferred'
  | 'evidence_quoted'
  | 'mixed'

export interface BookIntelligenceUnitOverview {
  unitId: string
  unitNumber: string
  title: string
  printedPageStart?: number | null
  printedPageEnd?: number | null
  vocabulary: string
  grammarStructures: string
  communicativeFunctions: string
  learningOutcomes: string
  learningOutcomesProvenance?: LearningOutcomesProvenance
  clilCulture: string
  values: string
  phonics: string
  /** Required for nine_column_ab; omitted for eight_column_baseline. */
  writing?: string
  writingComponentId?: string | null
  sourcePhase1SchemaVersion?: string | null
}

export interface BookIntelligenceOverviewDocument {
  schemaName: 'book_intelligence_unit_overview'
  schemaVersion: string
  layer: 'phase2_interpretation'
  columnSet: BookIntelligenceColumnSet
  catalogBookId: string
  registryId?: string
  bookUuid?: string | null
  seriesSlug?: string
  title?: string
  notes?: string
  units: BookIntelligenceUnitOverview[]
}

export type BookIntelligenceParseResult =
  | { ok: true; data: BookIntelligenceOverviewDocument }
  | { ok: false; errors: string[] }
