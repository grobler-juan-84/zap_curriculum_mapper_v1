/**
 * HTTP-agnostic handler: verify Supabase JWT, authorize via book_files catalog, then R2-sign.
 * Transport adapters (Vite middleware / Vercel) call this.
 *
 * Prefer `/api/source-pdf-content` proxy for browser PDF.js (no R2 CORS required).
 */
import { authorizeSourcePdfByBookFileId } from './authorizeSourcePdf.ts'
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

export async function handleSignSourcePdfRequest(
  req: SignSourcePdfHttpRequest,
): Promise<SignSourcePdfHttpResponse> {
  const body = asRecord(req.body)
  const bookFileId = typeof body.bookFileId === 'string' ? body.bookFileId : ''

  const auth = await authorizeSourcePdfByBookFileId(req.authorizationHeader, bookFileId)
  if (!auth.ok) {
    return {
      status: auth.status,
      body: { error: auth.error, message: auth.message },
    }
  }

  const signed = await signSourcePdfObject(auth.file.storagePath, {
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
      delivery: 'presigned',
      storagePath: signed.storagePath,
      bucket: signed.bucket,
    },
  }
}
