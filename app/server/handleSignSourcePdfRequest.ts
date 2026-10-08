/**
 * HTTP-agnostic handler: verify Supabase JWT, authorize via book_files catalog, then R2-sign.
 * Transport adapters (Vite middleware / Vercel) call this.
 */
import { createClient } from '@supabase/supabase-js'
import { signSourcePdfObject, SOURCE_PDF_SIGNED_TTL_SECONDS } from './signSourcePdf.ts'

export type SignSourcePdfHttpRequest = {
  authorizationHeader: string | undefined
  body: unknown
}

export type SignSourcePdfHttpResponse = {
  status: number
  body: Record<string, unknown>
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function bearerToken(header: string | undefined): string | null {
  if (!header) return null
  const match = header.match(/^Bearer\s+(.+)$/i)
  return match?.[1]?.trim() || null
}

function isSafeSourcePdfPath(path: string): boolean {
  if (!path || path.includes('..') || path.startsWith('/') || path.includes('\\')) return false
  if (!path.endsWith('/source.pdf')) return false
  if (!/^[a-z0-9][a-z0-9/_.-]*source\.pdf$/i.test(path)) return false
  return true
}

export async function handleSignSourcePdfRequest(
  req: SignSourcePdfHttpRequest,
): Promise<SignSourcePdfHttpResponse> {
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
      status: 503,
      body: { error: 'not_configured', message: 'Supabase is not configured on the server.' },
    }
  }

  const jwt = bearerToken(req.authorizationHeader)
  if (!jwt) {
    return { status: 401, body: { error: 'unauthorized', message: 'Missing Bearer token.' } }
  }

  const body = asRecord(req.body)
  const bookFileId = typeof body.bookFileId === 'string' ? body.bookFileId.trim() : ''
  if (!bookFileId) {
    return {
      status: 400,
      body: { error: 'bad_request', message: 'bookFileId is required.' },
    }
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: userData, error: userError } = await supabase.auth.getUser(jwt)
  if (userError || !userData.user) {
    return { status: 401, body: { error: 'unauthorized', message: 'Invalid or expired session.' } }
  }

  const { data: fileRow, error: fileError } = await supabase
    .from('book_files')
    .select('id, book_id, bucket, storage_path, file_type')
    .eq('id', bookFileId)
    .eq('file_type', 'source_pdf')
    .maybeSingle()

  if (fileError) {
    return {
      status: 503,
      body: { error: 'unavailable', message: 'Catalog lookup failed.' },
    }
  }
  if (!fileRow) {
    return {
      status: 403,
      body: {
        error: 'forbidden',
        message: 'No authorized source_pdf catalog row for this bookFileId.',
      },
    }
  }

  const storagePath = String(fileRow.storage_path ?? '')
  if (!isSafeSourcePdfPath(storagePath)) {
    return {
      status: 403,
      body: { error: 'forbidden', message: 'Catalog storage_path is not a valid source.pdf key.' },
    }
  }

  // Catalog bucket should be book-sources; still only sign the catalog key on R2.
  const signed = await signSourcePdfObject(storagePath, {
    expiresIn: SOURCE_PDF_SIGNED_TTL_SECONDS,
  })

  if (!signed.ok) {
    if (signed.code === 'not_found') {
      return { status: 404, body: { error: 'not_found', message: signed.message } }
    }
    if (signed.code === 'forbidden') {
      return { status: 403, body: { error: 'r2_forbidden', message: signed.message } }
    }
    if (signed.code === 'not_configured') {
      return { status: 503, body: { error: 'not_configured', message: signed.message } }
    }
    return { status: 503, body: { error: 'unavailable', message: signed.message } }
  }

  return {
    status: 200,
    body: {
      signedUrl: signed.signedUrl,
      expiresIn: signed.expiresIn,
      provider: 'r2',
      storagePath: signed.storagePath,
      bucket: signed.bucket,
    },
  }
}
