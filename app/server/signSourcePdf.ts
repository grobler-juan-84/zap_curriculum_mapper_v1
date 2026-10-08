/**
 * Shared R2 source-PDF signing (server-only).
 * Does not authorize callers — use handleSignSourcePdfRequest for that.
 */
import {
  S3Client,
  HeadObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { readR2Config, type R2Config } from './r2Config.ts'

export const SOURCE_PDF_SIGNED_TTL_SECONDS = 60 * 15

export type SignSourcePdfSuccess = {
  ok: true
  signedUrl: string
  expiresIn: number
  storagePath: string
  bucket: string
}

export type SignSourcePdfFailure = {
  ok: false
  code: 'not_configured' | 'not_found' | 'forbidden' | 'unavailable'
  message: string
}

export type SignSourcePdfResult = SignSourcePdfSuccess | SignSourcePdfFailure

export type GetSourcePdfSuccess = {
  ok: true
  bytes: Uint8Array
  contentType: string
  storagePath: string
  bucket: string
}

export type GetSourcePdfResult = GetSourcePdfSuccess | SignSourcePdfFailure

function createR2Client(cfg: R2Config): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: cfg.endpoint,
    credentials: {
      accessKeyId: cfg.accessKeyId,
      secretAccessKey: cfg.secretAccessKey,
    },
  })
}

function mapR2Error(err: unknown, fallbackMessage: string): SignSourcePdfFailure {
  const name = err instanceof Error ? err.name : ''
  const status =
    err && typeof err === 'object' && '$metadata' in err
      ? Number((err as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode)
      : undefined

  if (name === 'NotFound' || name === 'NoSuchKey' || status === 404) {
    return { ok: false, code: 'not_found', message: 'Object not found on R2.' }
  }
  if (status === 401 || status === 403 || name === 'AccessDenied' || name === 'Forbidden') {
    return {
      ok: false,
      code: 'forbidden',
      message: 'R2 denied access to this object (check token permissions).',
    }
  }
  return {
    ok: false,
    code: 'unavailable',
    message: err instanceof Error ? err.message : fallbackMessage,
  }
}

/** Stream/object bytes from R2 for same-origin proxy (avoids browser CORS on R2). */
export async function getSourcePdfObject(storagePath: string): Promise<GetSourcePdfResult> {
  const cfg = readR2Config()
  if (!cfg) {
    return {
      ok: false,
      code: 'not_configured',
      message: 'R2 credentials are not configured on the server.',
    }
  }

  const client = createR2Client(cfg)
  try {
    const got = await client.send(
      new GetObjectCommand({
        Bucket: cfg.bucket,
        Key: storagePath,
      }),
    )
    if (!got.Body) {
      return { ok: false, code: 'unavailable', message: 'R2 GetObject returned empty body.' }
    }
    const bytes = await got.Body.transformToByteArray()
    return {
      ok: true,
      bytes,
      contentType: got.ContentType || 'application/pdf',
      storagePath,
      bucket: cfg.bucket,
    }
  } catch (err) {
    return mapR2Error(err, 'R2 GetObject failed.')
  } finally {
    try {
      client.destroy()
    } catch {
      /* ignore */
    }
  }
}

export async function signSourcePdfObject(
  storagePath: string,
  options?: { expiresIn?: number },
): Promise<SignSourcePdfResult> {
  const cfg = readR2Config()
  if (!cfg) {
    return {
      ok: false,
      code: 'not_configured',
      message: 'R2 credentials are not configured on the server.',
    }
  }

  const expiresIn = options?.expiresIn ?? SOURCE_PDF_SIGNED_TTL_SECONDS
  const client = createR2Client(cfg)

  try {
    await client.send(
      new HeadObjectCommand({
        Bucket: cfg.bucket,
        Key: storagePath,
      }),
    )
  } catch (err) {
    const name = err instanceof Error ? err.name : ''
    const status =
      err && typeof err === 'object' && '$metadata' in err
        ? Number((err as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode)
        : undefined

    if (name === 'NotFound' || name === 'NoSuchKey' || status === 404) {
      return { ok: false, code: 'not_found', message: 'Object not found on R2.' }
    }
    if (status === 401 || status === 403 || name === 'AccessDenied' || name === 'Forbidden') {
      return {
        ok: false,
        code: 'forbidden',
        message: 'R2 denied access to this object (check token permissions).',
      }
    }
    return {
      ok: false,
      code: 'unavailable',
      message: err instanceof Error ? err.message : 'R2 HeadObject failed.',
    }
  }

  try {
    const signedUrl = await getSignedUrl(
      client,
      new GetObjectCommand({
        Bucket: cfg.bucket,
        Key: storagePath,
      }),
      { expiresIn },
    )
    return {
      ok: true,
      signedUrl,
      expiresIn,
      storagePath,
      bucket: cfg.bucket,
    }
  } catch (err) {
    const status =
      err && typeof err === 'object' && '$metadata' in err
        ? Number((err as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode)
        : undefined
    if (status === 401 || status === 403) {
      return {
        ok: false,
        code: 'forbidden',
        message: 'R2 denied signing (check token permissions).',
      }
    }
    return {
      ok: false,
      code: 'unavailable',
      message: err instanceof Error ? err.message : 'R2 getSignedUrl failed.',
    }
  } finally {
    try {
      client.destroy()
    } catch {
      /* ignore */
    }
  }
}
