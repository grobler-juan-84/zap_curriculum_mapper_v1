/**
 * Filter Book Intelligence unit overviews into NLP planning context (D022).
 * Never copies unit vocab/grammar/CLIL/values/phonics/writing into source evidence.
 */

import type {
  BookIntelligenceUnitOverview,
  LearningOutcomesProvenance,
} from '../../types/bookIntelligence'
import { BOOK_INTELLIGENCE_LAYER } from './fieldMap'

export type BiPlanningContext = {
  readonly catalogBookId: string
  readonly unitId: string
  readonly unitNumber: string
  /** From BI communicativeFunctions — unit planning only. */
  readonly communicativeFocus: string | null
  /** From BI learningOutcomes — labelled interpretation, not page evidence. */
  readonly suggestedLearningOutcomes: string | null
  readonly learningOutcomesProvenance: LearningOutcomesProvenance | null
  /** Storage path or schema version pointer when known. */
  readonly biArtifactRef: string | null
  readonly layer: typeof BOOK_INTELLIGENCE_LAYER
}

function trimOrNull(value: string | undefined | null): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function normalizeUnitNumber(value: string | number): string {
  return String(value).trim().replace(/^0+/, '') || '0'
}

/**
 * Convert a BI unit overview into filtered NLP planning context.
 * Returns null when there is no usable communicative focus or learning outcomes.
 */
export function toBiPlanningContext(input: {
  readonly catalogBookId: string
  readonly unit: BookIntelligenceUnitOverview
  readonly biArtifactRef?: string | null
  /** When set, unit number must match or the result is null (honest partial). */
  readonly expectedUnitNumber?: string | number | null
}): BiPlanningContext | null {
  const catalogBookId = input.catalogBookId.trim()
  const unitId = input.unit.unitId.trim()
  const unitNumber = String(input.unit.unitNumber).trim()
  if (!catalogBookId || !unitId || !unitNumber) return null

  if (
    input.expectedUnitNumber !== undefined &&
    input.expectedUnitNumber !== null &&
    input.expectedUnitNumber !== ''
  ) {
    if (
      normalizeUnitNumber(unitNumber) !==
      normalizeUnitNumber(input.expectedUnitNumber)
    ) {
      return null
    }
  }

  const communicativeFocus = trimOrNull(input.unit.communicativeFunctions)
  const suggestedLearningOutcomes = trimOrNull(input.unit.learningOutcomes)
  if (!communicativeFocus && !suggestedLearningOutcomes) return null

  return {
    catalogBookId,
    unitId,
    unitNumber,
    communicativeFocus,
    suggestedLearningOutcomes,
    learningOutcomesProvenance: suggestedLearningOutcomes
      ? (input.unit.learningOutcomesProvenance ?? 'ai_inferred')
      : null,
    biArtifactRef: trimOrNull(input.biArtifactRef ?? null),
    layer: BOOK_INTELLIGENCE_LAYER,
  }
}
