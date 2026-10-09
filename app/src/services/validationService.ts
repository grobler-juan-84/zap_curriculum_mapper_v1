import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type {
  BookFileBatch,
  BookFileStatus,
  BatchJsonSummary,
  SignedPdfResult,
} from '../types/validation'

export type { SignedPdfResult, PdfStorageProvider } from '../types/validation'

type R2ProxyAttempt =
  | { kind: 'ok'; objectUrl: string }
  | { kind: 'not_found' }
  | { kind: 'unavailable'; reason: string }
  | { kind: 'auth_error'; message: string }

/**
 * Fetch PDF bytes via same-origin proxy (avoids R2 CORS for PDF.js).
 * Caller must revoke the returned object URL when done.
 */
async function tryProxySourcePdfViaApi(bookFileId: string): Promise<R2ProxyAttempt> {
  const client = requireClient()
  const { data: sessionData, error: sessionError } = await client.auth.getSession()
  const token = sessionData.session?.access_token
  if (sessionError || !token) {
    return { kind: 'auth_error', message: 'Sign in required to load source PDFs.' }
  }

  let response: Response
  try {
    response = await fetch('/api/source-pdf-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bookFileId }),
    })
  } catch (err) {
    return {
      kind: 'unavailable',
      reason: err instanceof Error ? err.message : 'network error',
    }
  }

  if (response.status === 401 || response.status === 403) {
    let message = `PDF proxy failed (${response.status})`
    try {
      const payload = (await response.json()) as Record<string, unknown>
      if (typeof payload.message === 'string' && payload.message.trim()) {
        message = payload.message
      }
      if (payload.error === 'r2_forbidden') {
        return { kind: 'auth_error', message }
      }
    } catch {
      /* keep default message */
    }
    return { kind: 'auth_error', message }
  }

  if (response.status === 404) {
    return { kind: 'not_found' }
  }

  if (!response.ok) {
    let reason = `HTTP ${response.status}`
    try {
      const payload = (await response.json()) as Record<string, unknown>
      if (typeof payload.error === 'string') reason = payload.error
    } catch {
      /* keep */
    }
    return { kind: 'unavailable', reason }
  }

  const blob = await response.blob()
  if (!blob.size) {
    return { kind: 'unavailable', reason: 'empty PDF body from proxy' }
  }
  return { kind: 'ok', objectUrl: URL.createObjectURL(blob) }
}

type DbBookFileRow = {
  id: string
  book_id: string
  file_type: string
  bucket: string
  storage_path: string
  filename: string | null
  label: string | null
  status: string | null
  mime_type: string | null
  file_size: number | null
}

function mapStatus(value: string | null): BookFileStatus | null {
  if (value === 'pending' || value === 'needs_review' || value === 'verified') return value
  return null
}

function mapRow(row: DbBookFileRow): BookFileBatch {
  return {
    id: row.id,
    bookId: row.book_id,
    fileType: row.file_type,
    bucket: row.bucket,
    storagePath: row.storage_path,
    filename: row.filename,
    label: row.label,
    status: mapStatus(row.status),
    mimeType: row.mime_type,
    fileSize: row.file_size,
  }
}

function unitSortKey(batch: BookFileBatch): number {
  const fromLabel = batch.label?.match(/(\d+)/)?.[1]
  if (fromLabel) return Number(fromLabel)
  const fromPath = batch.storagePath.match(/unit[_-]?(\d+)/i)?.[1]
  if (fromPath) return Number(fromPath)
  return Number.MAX_SAFE_INTEGER
}

/** Canonical datasets first, then unit batches by unit number. */
function validationFileSortKey(a: BookFileBatch, b: BookFileBatch): number {
  const aCanonical = a.fileType === 'canonical_json' ? 0 : 1
  const bCanonical = b.fileType === 'canonical_json' ? 0 : 1
  if (aCanonical !== bCanonical) return aCanonical - bCanonical
  if (a.fileType === 'canonical_json' && b.fileType === 'canonical_json') {
    return a.storagePath.localeCompare(b.storagePath)
  }
  return unitSortKey(a) - unitSortKey(b) || a.storagePath.localeCompare(b.storagePath)
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined
}

function asNumber(value: unknown): number | null | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() && !Number.isNaN(Number(value))) {
    return Number(value)
  }
  return value === null ? null : undefined
}

function unitNumberOf(entry: unknown): string {
  const u = asRecord(entry)
  return asString(u.unit_number) ?? String(asNumber(u.unit_number) ?? '')
}

function inPrintedRange(
  printedPage: number | null | undefined,
  start: number | null | undefined,
  end: number | null | undefined,
): boolean {
  if (printedPage == null || start == null || end == null) return false
  return printedPage >= start && printedPage <= end
}

/**
 * Filter a whole-book canonical JSON blob down to one unit’s arrays
 * so Validation can reuse the per-unit evidence panels.
 */
export function sliceCanonicalByUnit(
  raw: unknown,
  selector: { unitId?: string; unitNumber?: string },
): unknown {
  const root = asRecord(raw)
  const units = asArray(root.units)

  const unitEntry = units.find((entry) => {
    const u = asRecord(entry)
    if (selector.unitId && asString(u.unit_id) === selector.unitId) return true
    if (selector.unitNumber != null && selector.unitNumber !== '') {
      return unitNumberOf(entry) === String(selector.unitNumber)
    }
    return false
  })

  const emptySlice = (): Record<string, unknown> => {
    const out: Record<string, unknown> = { ...root, units: [] }
    for (const key of [
      'pages',
      'vocabulary',
      'language',
      'activities',
      'continuous_text',
      'curriculum_components',
      'relationships',
      'extraction_issues',
      'schema_gaps',
    ]) {
      if (key in root) out[key] = []
    }
    return out
  }

  if (!unitEntry) return emptySlice()

  const unit = asRecord(unitEntry)
  const unitId = asString(unit.unit_id)
  const pageStart = asNumber(unit.printed_page_start) ?? null
  const pageEnd = asNumber(unit.printed_page_end) ?? null

  const pages = asArray(root.pages).filter((entry) => {
    const p = asRecord(entry)
    if (unitId && asString(p.unit_id) === unitId) return true
    return inPrintedRange(asNumber(p.printed_page), pageStart, pageEnd)
  })

  const pageIds = new Set(
    pages
      .map((entry) => asString(asRecord(entry).page_id))
      .filter((id): id is string => Boolean(id)),
  )

  const belongsToUnit = (entry: unknown): boolean => {
    const r = asRecord(entry)
    if (unitId && asString(r.unit_id) === unitId) return true
    const pageId = asString(r.page_id)
    if (pageId && pageIds.has(pageId)) return true
    return inPrintedRange(asNumber(r.printed_page), pageStart, pageEnd)
  }

  const out: Record<string, unknown> = {
    ...root,
    units: [unitEntry],
    pages,
    vocabulary: asArray(root.vocabulary).filter(belongsToUnit),
    language: asArray(root.language).filter(belongsToUnit),
    activities: asArray(root.activities).filter(belongsToUnit),
  }

  for (const key of [
    'continuous_text',
    'curriculum_components',
    'relationships',
    'extraction_issues',
    'schema_gaps',
  ]) {
    if (key in root) out[key] = asArray(root[key]).filter(belongsToUnit)
  }

  return out
}

/** Ordered unit descriptors from a canonical (or batch) JSON root. */
export function listUnitsFromJson(raw: unknown): Array<{
  unitId?: string
  unitNumber: string
  title?: string
  theme?: string
  printedPageStart: number | null
  printedPageEnd: number | null
  pdfPageStart: number | null
  pdfPageEnd: number | null
}> {
  return asArray(asRecord(raw).units)
    .map((entry) => {
      const u = asRecord(entry)
      return {
        unitId: asString(u.unit_id),
        unitNumber: unitNumberOf(entry),
        title: asString(u.title),
        theme: asString(u.theme),
        printedPageStart: asNumber(u.printed_page_start) ?? null,
        printedPageEnd: asNumber(u.printed_page_end) ?? null,
        pdfPageStart: asNumber(u.pdf_page_start) ?? null,
        pdfPageEnd: asNumber(u.pdf_page_end) ?? null,
      }
    })
    .filter((u) => u.unitNumber !== '')
    .sort((a, b) => Number(a.unitNumber) - Number(b.unitNumber))
}

/** Match a unit batch_json row by unit number in label or storage path. */
export function findBatchForUnitNumber(
  batches: BookFileBatch[],
  unitNumber: string,
): BookFileBatch | null {
  const n = Number(unitNumber)
  if (!Number.isFinite(n)) return null
  return (
    batches.find((batch) => batch.fileType === 'batch_json' && unitSortKey(batch) === n) ?? null
  )
}

/** Best-effort summary of a Phase 1 unit-batch JSON blob. */
export function summarizeBatchJson(raw: unknown): BatchJsonSummary {
  const root = asRecord(raw)
  const units = asArray(root.units).map((entry) => {
    const u = asRecord(entry)
    return {
      unitId: asString(u.unit_id),
      unitNumber: unitNumberOf(entry),
      title: asString(u.title),
      theme: asString(u.theme),
      printedPageStart: asNumber(u.printed_page_start) ?? null,
      printedPageEnd: asNumber(u.printed_page_end) ?? null,
      pdfPageStart: asNumber(u.pdf_page_start) ?? null,
      pdfPageEnd: asNumber(u.pdf_page_end) ?? null,
    }
  })

  const vocabulary = asArray(root.vocabulary).map((entry) => {
    const v = asRecord(entry)
    return {
      term: asString(v.term),
      classification: asString(v.classification),
      pageId: asString(v.page_id),
    }
  })

  const language = asArray(root.language).map((entry) => {
    const l = asRecord(entry)
    return {
      prompt: asString(l.prompt),
      response: asString(l.response),
      languageType: asString(l.language_type),
    }
  })

  const activities = asArray(root.activities).map((entry) => {
    const a = asRecord(entry)
    return {
      title: asString(a.title) ?? asString(a.activity_title),
      activityType: asString(a.activity_type) ?? asString(a.type),
      pageId: asString(a.page_id),
    }
  })

  const pages = asArray(root.pages).map((entry) => {
    const p = asRecord(entry)
    return {
      printedPage: asNumber(p.printed_page) ?? null,
      pdfPage: asNumber(p.pdf_page) ?? null,
      sectionTitle: asString(p.section_title),
      sectionType: asString(p.section_type),
    }
  })

  return {
    bookId: asString(root.book_id),
    series: asString(root.series),
    level: asString(root.level),
    bookType: asString(root.book_type),
    units,
    vocabulary,
    language,
    activities,
    pages,
    raw,
  }
}

function requireClient() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to app/.env.local.',
    )
  }
  return supabase
}

export const validationService = {
  /** Unit batches and canonical JSON datasets for Validation (canonical first). */
  async listValidationFiles(bookUuid: string): Promise<BookFileBatch[]> {
    const client = requireClient()
    const { data, error } = await client
      .from('book_files')
      .select(
        'id, book_id, file_type, bucket, storage_path, filename, label, status, mime_type, file_size',
      )
      .eq('book_id', bookUuid)
      .in('file_type', ['batch_json', 'canonical_json'])
      .order('storage_path', { ascending: true })

    if (error) throw new Error(error.message)

    return ((data ?? []) as DbBookFileRow[]).map(mapRow).sort(validationFileSortKey)
  },

  /** @deprecated Prefer listValidationFiles — kept for older call sites. */
  async listUnitBatches(bookUuid: string): Promise<BookFileBatch[]> {
    return this.listValidationFiles(bookUuid)
  },

  async findSourcePdf(bookUuid: string): Promise<BookFileBatch | null> {
    const client = requireClient()
    const { data, error } = await client
      .from('book_files')
      .select(
        'id, book_id, file_type, bucket, storage_path, filename, label, status, mime_type, file_size',
      )
      .eq('book_id', bookUuid)
      .eq('file_type', 'source_pdf')
      .limit(1)
      .maybeSingle()

    if (error) throw new Error(error.message)
    return data ? mapRow(data as DbBookFileRow) : null
  },

  async downloadJson(batch: BookFileBatch): Promise<unknown> {
    const client = requireClient()
    const { data, error } = await client.storage.from(batch.bucket).download(batch.storagePath)
    if (error || !data) {
      throw new Error(error?.message ?? `Could not download ${batch.storagePath}`)
    }
    const text = await data.text()
    try {
      return JSON.parse(text) as unknown
    } catch {
      throw new Error(`Invalid JSON in ${batch.storagePath}`)
    }
  },

  async loadBatchJson(batch: BookFileBatch): Promise<BatchJsonSummary> {
    return summarizeBatchJson(await this.downloadJson(batch))
  },

  /**
   * R2-only PDF delivery (D012): same-origin `/api/source-pdf-content` proxy.
   * Proxy avoids browser CORS on R2 (Object Read/Write tokens often cannot set bucket CORS).
   * - ok → blob URL, provider `r2`
   * - auth_error / not_found / unavailable → throw (no Supabase Storage fallback)
   * Caller must revoke blob: URLs when unloading.
   */
  async createSignedPdfUrl(batch: BookFileBatch): Promise<SignedPdfResult | null> {
    const r2Attempt = await tryProxySourcePdfViaApi(batch.id)
    if (r2Attempt.kind === 'ok') {
      return { url: r2Attempt.objectUrl, provider: 'r2' }
    }
    if (r2Attempt.kind === 'auth_error') {
      throw new Error(r2Attempt.message)
    }
    if (r2Attempt.kind === 'not_found') {
      throw new Error(
        `Source PDF not found on R2 for ${batch.storagePath}. Upload with scripts/upload_source_pdfs.mjs.`,
      )
    }
    throw new Error(
      `R2 PDF proxy unavailable for ${batch.storagePath} (${r2Attempt.reason}).`,
    )
  },

  async updateBatchStatus(batchId: string, status: BookFileStatus): Promise<void> {
    const client = requireClient()
    // Prefer returning the row: RLS-denied updates often succeed with 0 rows and no error.
    const { data, error } = await client
      .from('book_files')
      .update({ status })
      .eq('id', batchId)
      .select('id')
      .maybeSingle()

    if (error) {
      const code = 'code' in error ? String((error as { code?: string }).code ?? '') : ''
      throw new Error(
        /policy|permission|rls|42501/i.test(`${error.message} ${code}`)
          ? 'Status update requires an admin profile (RLS). Set profiles.role = admin for your user.'
          : error.message,
      )
    }

    if (!data) {
      throw new Error(
        'Status was not saved. Your account needs profiles.role = admin (RLS blocks non-admin writes).',
      )
    }
  },
}
