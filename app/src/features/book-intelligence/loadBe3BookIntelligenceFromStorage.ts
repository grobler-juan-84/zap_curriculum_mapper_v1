import { isSupabaseConfigured, SUPABASE_CONFIG_ERROR, supabase } from '../../lib/supabase'
import {
  loadBookIntelligenceOverviewFromUnknown,
  type BookIntelligenceParseResult,
} from '../../lib/bookIntelligence'

/** Private `book-datasets` companion — not registered in `book_files`. */
export const BE3_BI_STORAGE_BUCKET = 'book-datasets'

export const BE3_BI_STORAGE_PATH =
  'big-english/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json'

const EXPECTED_UNIT_COUNT = 9

/**
 * Download BE3 Units 1–9 Book Intelligence from Supabase Storage, then parse
 * with the validated draft-contract loader. No Postgres / schema access.
 */
export async function loadBe3BookIntelligenceFromStorage(): Promise<BookIntelligenceParseResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, errors: [SUPABASE_CONFIG_ERROR] }
  }

  const { data: blob, error } = await supabase.storage
    .from(BE3_BI_STORAGE_BUCKET)
    .download(BE3_BI_STORAGE_PATH)

  if (error || !blob) {
    return {
      ok: false,
      errors: [
        error?.message ??
          `Could not download ${BE3_BI_STORAGE_BUCKET}/${BE3_BI_STORAGE_PATH}`,
      ],
    }
  }

  let raw: unknown
  try {
    const text = await blob.text()
    raw = JSON.parse(text) as unknown
  } catch (err) {
    const message = err instanceof Error ? err.message : 'JSON parse failed'
    return {
      ok: false,
      errors: [`Invalid JSON in ${BE3_BI_STORAGE_PATH}: ${message}`],
    }
  }

  const result = loadBookIntelligenceOverviewFromUnknown(raw)
  if (!result.ok) return result

  if (result.data.units.length !== EXPECTED_UNIT_COUNT) {
    return {
      ok: false,
      errors: [
        `Expected ${EXPECTED_UNIT_COUNT} units, got ${result.data.units.length}`,
      ],
    }
  }

  return result
}
