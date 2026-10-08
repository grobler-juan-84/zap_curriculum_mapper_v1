/**
 * Future Vercel serverless entry for POST /api/sign-source-pdf.
 * Shares the same handler as the Vite middleware (Stage D local surface).
 *
 * Not required for local Validation — Vite middleware serves this path in `npm run dev`.
 */
import { loadServerEnv } from '../app/server/loadServerEnv.ts'
import { handleSignSourcePdfRequest } from '../app/server/handleSignSourcePdfRequest.ts'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../app')

type VercelRequest = {
  method?: string
  headers: Record<string, string | string[] | undefined>
  body?: unknown
}

type VercelResponse = {
  status: (code: number) => VercelResponse
  json: (body: unknown) => void
  setHeader: (name: string, value: string) => void
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

  const result = await handleSignSourcePdfRequest({
    authorizationHeader: headerValue(req.headers, 'authorization'),
    body: req.body ?? {},
  })
  res.status(result.status).json(result.body)
}
