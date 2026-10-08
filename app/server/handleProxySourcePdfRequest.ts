/**
 * Same-origin PDF proxy: authorize catalog row, then stream bytes from R2.
 * Used by Validation/PDF.js so the browser never needs R2 CORS.
 */
import { authorizeSourcePdfByBookFileId } from './authorizeSourcePdf.ts'
import { getSourcePdfObject } from './signSourcePdf.ts'

export type ProxySourcePdfHttpRequest = {
  authorizationHeader: string | undefined
  body: unknown
}

export type ProxySourcePdfHttpResponse =
  | {
      ok: true
      status: 200
      contentType: string
      bytes: Uint8Array
      storagePath: string
    }
  | {
      ok: false
      status: number
      body: Record<string, unknown>
    }

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

export async function handleProxySourcePdfRequest(
  req: ProxySourcePdfHttpRequest,
): Promise<ProxySourcePdfHttpResponse> {
  const body = asRecord(req.body)
  const bookFileId = typeof body.bookFileId === 'string' ? body.bookFileId : ''

  const auth = await authorizeSourcePdfByBookFileId(req.authorizationHeader, bookFileId)
  if (!auth.ok) {
    return {
      ok: false,
      status: auth.status,
      body: { error: auth.error, message: auth.message },
    }
  }

  const got = await getSourcePdfObject(auth.file.storagePath)
  if (!got.ok) {
    if (got.code === 'not_found') {
      return { ok: false, status: 404, body: { error: 'not_found', message: got.message } }
    }
    if (got.code === 'forbidden') {
      return { ok: false, status: 403, body: { error: 'r2_forbidden', message: got.message } }
    }
    if (got.code === 'not_configured') {
      return { ok: false, status: 503, body: { error: 'not_configured', message: got.message } }
    }
    return { ok: false, status: 503, body: { error: 'unavailable', message: got.message } }
  }

  return {
    ok: true,
    status: 200,
    contentType: got.contentType,
    bytes: got.bytes,
    storagePath: got.storagePath,
  }
}
