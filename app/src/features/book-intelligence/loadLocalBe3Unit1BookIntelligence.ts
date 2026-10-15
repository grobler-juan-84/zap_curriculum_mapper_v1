import rawBe3U1 from '@bi-be3-u01-json'
import {
  loadBookIntelligenceOverviewFromUnknown,
  type BookIntelligenceParseResult,
} from '../../lib/bookIntelligence'

/**
 * Load BE3 Unit 1 Book Intelligence from the local Phase 2 JSON artifact.
 * Uses the validated draft-contract loader. No Supabase / Storage.
 */
export function loadLocalBe3Unit1BookIntelligence(): BookIntelligenceParseResult {
  return loadBookIntelligenceOverviewFromUnknown(rawBe3U1)
}
