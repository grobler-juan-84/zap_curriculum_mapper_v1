import { isSupabaseConfigured, SUPABASE_CONFIG_ERROR, supabase } from '../../lib/supabase'
import {
  loadBookIntelligenceOverviewFromUnknown,
  type BookIntelligenceParseResult,
} from '../../lib/bookIntelligence'
import { getBookIntelligenceStorageArtifact } from './bookIntelligenceStorageRegistry'

/**
 * Download a book's Book Intelligence overview from Supabase Storage, then parse
 * with the validated draft-contract loader. No Postgres / schema access.
 */
export async function loadBookIntelligenceFromStorage(
  catalogBookId: string,
): Promise<BookIntelligenceParseResult> {
  const artifact = getBookIntelligenceStorageArtifact(catalogBookId)
  if (!artifact) {
    return {
      ok: false,
      errors: [
        `No Book Intelligence Storage artifact registered for catalogBookId=${catalogBookId}`,
      ],
    }
  }

  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, errors: [SUPABASE_CONFIG_ERROR] }
  }

  const { data: blob, error } = await supabase.storage
    .from(artifact.bucket)
    .download(artifact.storagePath)

  if (error || !blob) {
    return {
      ok: false,
      errors: [
        error?.message ??
          `Could not download ${artifact.bucket}/${artifact.storagePath}`,
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
      errors: [`Invalid JSON in ${artifact.storagePath}: ${message}`],
    }
  }

  const result = loadBookIntelligenceOverviewFromUnknown(raw)
  if (!result.ok) return result

  if (result.data.catalogBookId !== artifact.catalogBookId) {
    return {
      ok: false,
      errors: [
        `Storage document catalogBookId=${result.data.catalogBookId} does not match requested ${artifact.catalogBookId}`,
      ],
    }
  }

  if (result.data.units.length !== artifact.expectedUnitCount) {
    return {
      ok: false,
      errors: [
        `Expected ${artifact.expectedUnitCount} units, got ${result.data.units.length}`,
      ],
    }
  }

  return result
}

/** @deprecated Prefer loadBookIntelligenceFromStorage('big_english_3_sb') */
export async function loadBe3BookIntelligenceFromStorage(): Promise<BookIntelligenceParseResult> {
  return loadBookIntelligenceFromStorage('big_english_3_sb')
}

export {
  BOOK_INTELLIGENCE_STORAGE_BUCKET as BE3_BI_STORAGE_BUCKET,
} from './bookIntelligenceStorageRegistry'

export const BE3_BI_STORAGE_PATH =
  'big-english/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json'
