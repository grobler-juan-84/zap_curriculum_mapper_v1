/**
 * Unit Intelligence view for Chalkie Workspace left panel.
 * Reuses Phase 2 Book Intelligence documents — never Phase 1 source evidence.
 * Does not mutate source scope, activity selection, page vocab/language, or prior pools.
 * Filtered BI planning fields may attach to an NLP as optional curriculumInterpretation (D022).
 */

import type {
  BookIntelligenceOverviewDocument,
  BookIntelligenceUnitOverview,
  LearningOutcomesProvenance,
} from '../../types/bookIntelligence'
import {
  uiFieldsForColumnSet,
  type BookIntelligenceUiFieldKey,
} from '../../lib/bookIntelligence/fieldMap'

export const UNIT_INTELLIGENCE_EMPTY_MESSAGE =
  'Unit Intelligence is not available for this book/unit yet. It can be added when Phase 2 Book Intelligence has been prepared.'

export const UNIT_INTELLIGENCE_DISCLAIMER =
  'Phase 2 interpretation / planning support — not current-page source evidence.'

export type ChalkieUnitIntelligenceField = {
  key: BookIntelligenceUiFieldKey
  label: string
  value: string
  badge?: string
}

export type ChalkieUnitIntelligenceView =
  | { status: 'unavailable'; message: string }
  | { status: 'loading' }
  | {
      status: 'ready'
      unitNumber: string
      title: string
      pageRange: string | null
      fields: ChalkieUnitIntelligenceField[]
      layer: string | null
    }

function provenanceBadge(
  provenance: LearningOutcomesProvenance | undefined,
): string {
  switch (provenance) {
    case 'evidence_quoted':
      return 'Evidence quoted'
    case 'mixed':
      return 'Mixed'
    case 'ai_inferred':
    default:
      return 'AI-inferred'
  }
}

function unitFieldValue(
  unit: BookIntelligenceUnitOverview,
  key: BookIntelligenceUiFieldKey,
): string {
  switch (key) {
    case 'vocabulary':
      return unit.vocabulary
    case 'grammarStructures':
      return unit.grammarStructures
    case 'communicativeFunctions':
      return unit.communicativeFunctions
    case 'learningOutcomes':
      return unit.learningOutcomes
    case 'clilCulture':
      return unit.clilCulture
    case 'values':
      return unit.values
    case 'phonics':
      return unit.phonics
    case 'writing':
      return unit.writing ?? ''
  }
}

export function findBookIntelligenceUnit(
  document: BookIntelligenceOverviewDocument,
  unitNumber: string | number | null | undefined,
): BookIntelligenceUnitOverview | null {
  if (unitNumber === null || unitNumber === undefined || unitNumber === '') {
    return null
  }
  const wanted = String(unitNumber)
  return document.units.find((unit) => unit.unitNumber === wanted) ?? null
}

/**
 * Build a compact left-panel view from an already-loaded BI document.
 * Callers pass `loading: true` while Storage fetch is in flight.
 */
export function buildChalkieUnitIntelligenceView(input: {
  loading?: boolean
  document: BookIntelligenceOverviewDocument | null
  unitNumber: string | number | null | undefined
}): ChalkieUnitIntelligenceView {
  if (input.loading) {
    return { status: 'loading' }
  }

  if (!input.document) {
    return {
      status: 'unavailable',
      message: UNIT_INTELLIGENCE_EMPTY_MESSAGE,
    }
  }

  const unit = findBookIntelligenceUnit(input.document, input.unitNumber)
  if (!unit) {
    return {
      status: 'unavailable',
      message: UNIT_INTELLIGENCE_EMPTY_MESSAGE,
    }
  }

  const pageRange =
    typeof unit.printedPageStart === 'number' &&
    typeof unit.printedPageEnd === 'number'
      ? `pp. ${unit.printedPageStart}–${unit.printedPageEnd}`
      : null

  const fields: ChalkieUnitIntelligenceField[] = uiFieldsForColumnSet(
    input.document.columnSet,
  ).map((descriptor) => {
    const field: ChalkieUnitIntelligenceField = {
      key: descriptor.key,
      label: descriptor.label,
      value: unitFieldValue(unit, descriptor.key),
    }
    if (descriptor.showProvenanceBadge) {
      field.badge = provenanceBadge(unit.learningOutcomesProvenance)
    }
    return field
  })

  return {
    status: 'ready',
    unitNumber: unit.unitNumber,
    title: unit.title,
    pageRange,
    fields,
    layer: input.document.layer ?? null,
  }
}
