import rawBe3Ab from '@bi-be3-ab-json'
import {
  loadBookIntelligenceOverviewFromUnknown,
  type BookIntelligenceParseResult,
} from '../../lib/bookIntelligence'

/**
 * Load BE3 Units 1–9 Book Intelligence from the local Phase 2 JSON artifact.
 * Uses the validated draft-contract loader. No Supabase / Storage.
 */
export function loadLocalBe3BookIntelligence(): BookIntelligenceParseResult {
  return loadBookIntelligenceOverviewFromUnknown(rawBe3Ab)
}
