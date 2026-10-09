/**
 * Shared JWT + catalog authorization for source PDF endpoints (server-only).
 */
import { createClient } from '@supabase/supabase-js'

export type AuthorizedSourcePdf = {
  bookFileId: string
  /** Postgres UUID FK (`book_files.book_id` → `books.id`). */
  bookUuid: string
  storagePath: string
  bucket: string
}

export type AuthorizeFailure = {
  ok: false
  status: number
  error: string
  message: string
}

export type AuthorizeSuccess = {
  ok: true
  file: AuthorizedSourcePdf
}

function bearerToken(header: string | undefined): string | null {
  if (!header) return null
  const match = header.match(/^Bearer\s+(.+)$/i)
  return match?.[1]?.trim() || null
}

export function isSafeSourcePdfPath(path: string): boolean {
  if (!path || path.includes('..') || path.startsWith('/') || path.includes('\\')) return false
  if (!path.endsWith('/source.pdf')) return false
  if (!/^[a-z0-9][a-z0-9/_.-]*source\.pdf$/i.test(path)) return false
  return true
}

export async function authorizeSourcePdfByBookFileId(
  authorizationHeader: string | undefined,
  bookFileIdRaw: string,
): Promise<AuthorizeSuccess | AuthorizeFailure> {
  const supabaseUrl = (
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    ''
  ).trim()
  const anonKey = (
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ''
  ).trim()

  if (!supabaseUrl || !anonKey) {
    return {
      ok: false,
      status: 503,
      error: 'not_configured',
      message: 'Supabase is not configured on the server.',
    }
  }

  const jwt = bearerToken(authorizationHeader)
  if (!jwt) {
    return { ok: false, status: 401, error: 'unauthorized', message: 'Missing Bearer token.' }
  }

  const bookFileId = bookFileIdRaw.trim()
  if (!bookFileId) {
    return {
      ok: false,
      status: 400,
      error: 'bad_request',
      message: 'bookFileId is required.',
    }
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: userData, error: userError } = await supabase.auth.getUser(jwt)
  if (userError || !userData.user) {
    return {
      ok: false,
      status: 401,
      error: 'unauthorized',
      message: 'Invalid or expired session.',
    }
  }

  const { data: fileRow, error: fileError } = await supabase
    .from('book_files')
    .select('id, book_id, bucket, storage_path, file_type')
    .eq('id', bookFileId)
    .eq('file_type', 'source_pdf')
    .maybeSingle()

  if (fileError) {
    return {
      ok: false,
      status: 503,
      error: 'unavailable',
      message: 'Catalog lookup failed.',
    }
  }
  if (!fileRow) {
    return {
      ok: false,
      status: 403,
      error: 'forbidden',
      message: 'No authorized source_pdf catalog row for this bookFileId.',
    }
  }

  const storagePath = String(fileRow.storage_path ?? '')
  if (!isSafeSourcePdfPath(storagePath)) {
    return {
      ok: false,
      status: 403,
      error: 'forbidden',
      message: 'Catalog storage_path is not a valid source.pdf key.',
    }
  }

  return {
    ok: true,
    file: {
      bookFileId: String(fileRow.id),
      bookUuid: String(fileRow.book_id),
      storagePath,
      bucket: String(fileRow.bucket ?? 'book-sources'),
    },
  }
}
