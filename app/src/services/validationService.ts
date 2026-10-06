import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { BookFileBatch, BookFileStatus, BatchJsonSummary } from '../types/validation'

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

/** Best-effort summary of a Phase 1 unit-batch JSON blob. */
export function summarizeBatchJson(raw: unknown): BatchJsonSummary {
  const root = asRecord(raw)
  const units = asArray(root.units).map((entry) => {
    const u = asRecord(entry)
    return {
      unitId: asString(u.unit_id),
      unitNumber: asString(u.unit_number) ?? String(asNumber(u.unit_number) ?? ''),
      title: asString(u.title),
      theme: asString(u.theme),
      printedPageStart: asNumber(u.printed_page_start) ?? null,
      printedPageEnd: asNumber(u.printed_page_end) ?? null,
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
  async listUnitBatches(bookUuid: string): Promise<BookFileBatch[]> {
    const client = requireClient()
    const { data, error } = await client
      .from('book_files')
      .select(
        'id, book_id, file_type, bucket, storage_path, filename, label, status, mime_type, file_size',
      )
      .eq('book_id', bookUuid)
      .eq('file_type', 'batch_json')
      .order('storage_path', { ascending: true })

    if (error) throw new Error(error.message)

    return ((data ?? []) as DbBookFileRow[])
      .map(mapRow)
      .sort((a, b) => unitSortKey(a) - unitSortKey(b) || a.storagePath.localeCompare(b.storagePath))
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

  async loadBatchJson(batch: BookFileBatch): Promise<BatchJsonSummary> {
    const client = requireClient()
    const { data, error } = await client.storage.from(batch.bucket).download(batch.storagePath)
    if (error || !data) {
      throw new Error(error?.message ?? `Could not download ${batch.storagePath}`)
    }
    const text = await data.text()
    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch {
      throw new Error(`Invalid JSON in ${batch.storagePath}`)
    }
    return summarizeBatchJson(parsed)
  },

  async createSignedPdfUrl(batch: BookFileBatch): Promise<string | null> {
    const client = requireClient()
    const { data, error } = await client.storage
      .from(batch.bucket)
      .createSignedUrl(batch.storagePath, 60 * 60)
    if (error || !data?.signedUrl) return null
    return data.signedUrl
  },

  async updateBatchStatus(batchId: string, status: BookFileStatus): Promise<void> {
    const client = requireClient()
    const { error } = await client.from('book_files').update({ status }).eq('id', batchId)
    if (error) {
      const code = 'code' in error ? String((error as { code?: string }).code ?? '') : ''
      throw new Error(
        /policy|permission|rls|42501/i.test(`${error.message} ${code}`)
          ? 'Status update requires an admin profile (RLS). Sign in as admin or update via SQL.'
          : error.message,
      )
    }
  },
}
