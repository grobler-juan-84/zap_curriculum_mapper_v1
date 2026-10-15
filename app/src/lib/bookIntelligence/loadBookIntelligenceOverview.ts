import type { BookIntelligenceParseResult } from '../../types/bookIntelligence'
import { parseBookIntelligenceOverview } from './parseBookIntelligenceOverview'

/**
 * Load from an already-parsed JSON value (e.g. import or prior JSON.parse).
 * No fetch, Storage, or database access.
 */
export function loadBookIntelligenceOverviewFromUnknown(
  raw: unknown,
): BookIntelligenceParseResult {
  return parseBookIntelligenceOverview(raw)
}

/**
 * Parse JSON text then validate/map to the draft Book Intelligence contract.
 * No fetch, Storage, or database access.
 */
export function loadBookIntelligenceOverviewFromJsonText(
  jsonText: string,
): BookIntelligenceParseResult {
  let raw: unknown
  try {
    raw = JSON.parse(jsonText) as unknown
  } catch (err) {
    const message = err instanceof Error ? err.message : 'JSON parse failed'
    return { ok: false, errors: [`json: ${message}`] }
  }
  return parseBookIntelligenceOverview(raw)
}
