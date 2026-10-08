/**
 * Future Vercel serverless entries for source PDFs.
 * Local Validation uses Vite middleware for:
 * - POST /api/sign-source-pdf
 * - POST /api/source-pdf-content (preferred — same-origin proxy for PDF.js)
 */
import { loadServerEnv } from '../app/server/loadServerEnv.ts'
import { handleSignSourcePdfRequest } from '../app/server/handleSignSourcePdfRequest.ts'
import { handleProxySourcePdfRequest } from '../app/server/handleProxySourcePdfRequest.ts'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../app')

type VercelRequest = {
  method?: string
  url?: string
  headers: Record<string, string | string[] | undefined>
  body?: unknown
}

type VercelResponse = {
  status: (code: number) => VercelResponse
  json: (body: unknown) => void
  setHeader: (name: string, value: string) => void
  send: (body: Buffer | string) => void
  end: (body?: string) => void
}

function headerValue(
  headers: VercelRequest['headers'],
  name: string,
): string | undefined {
  const raw = headers[name] ?? headers[name.toLowerCase()]
  if (Array.isArray(raw)) return raw[0]
  return raw
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  loadServerEnv(appRoot)

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
    res.status(204).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }

  const path = (req.url ?? '').split('?')[0]
  if (path.endsWith('/source-pdf-content')) {
    const result = await handleProxySourcePdfRequest({
      authorizationHeader: headerValue(req.headers, 'authorization'),
      body: req.body ?? {},
    })
    if (!result.ok) {
      res.status(result.status).json(result.body)
      return
    }
    res.setHeader('Content-Type', result.contentType)
    res.setHeader('Cache-Control', 'private, no-store')
    res.setHeader('X-Gcm-Pdf-Provider', 'r2')
    res.status(200).send(Buffer.from(result.bytes))
    return
  }

  const result = await handleSignSourcePdfRequest({
    authorizationHeader: headerValue(req.headers, 'authorization'),
    body: req.body ?? {},
  })
  res.status(result.status).json(result.body)
}
