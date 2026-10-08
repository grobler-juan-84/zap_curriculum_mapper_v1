/**
 * Vite transport for source-PDF APIs:
 * - POST /api/sign-source-pdf       → R2 presigned URL JSON (optional)
 * - POST /api/source-pdf-content    → same-origin PDF bytes (preferred for PDF.js)
 */
import type { Plugin } from 'vite'
import { loadServerEnv } from '../server/loadServerEnv.ts'
import { handleSignSourcePdfRequest } from '../server/handleSignSourcePdfRequest.ts'
import { handleProxySourcePdfRequest } from '../server/handleProxySourcePdfRequest.ts'

async function readJsonBody(req: import('http').IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  if (chunks.length === 0) return {}
  const text = Buffer.concat(chunks).toString('utf8')
  if (!text.trim()) return {}
  try {
    return JSON.parse(text) as unknown
  } catch {
    return null
  }
}

function sendJson(
  res: import('http').ServerResponse,
  status: number,
  body: Record<string, unknown>,
): void {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

export function signSourcePdfPlugin(appRoot: string): Plugin {
  return {
    name: 'gcm-sign-source-pdf',
    configureServer(server) {
      loadServerEnv(appRoot)

      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''
        const isSign = url === '/api/sign-source-pdf'
        const isProxy = url === '/api/source-pdf-content'
        if (!isSign && !isProxy) {
          next()
          return
        }

        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
          res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
          res.end()
          return
        }

        if (req.method !== 'POST') {
          sendJson(res, 405, { error: 'method_not_allowed' })
          return
        }

        const body = await readJsonBody(req)
        if (body === null) {
          sendJson(res, 400, { error: 'bad_request', message: 'Invalid JSON body.' })
          return
        }

        try {
          if (isProxy) {
            const result = await handleProxySourcePdfRequest({
              authorizationHeader: req.headers.authorization,
              body,
            })
            if (!result.ok) {
              sendJson(res, result.status, result.body)
              return
            }
            res.statusCode = 200
            res.setHeader('Content-Type', result.contentType)
            res.setHeader('Cache-Control', 'private, no-store')
            res.setHeader('X-Gcm-Pdf-Provider', 'r2')
            res.setHeader('X-Gcm-Pdf-Delivery', 'proxy')
            res.end(Buffer.from(result.bytes))
            return
          }

          const result = await handleSignSourcePdfRequest({
            authorizationHeader: req.headers.authorization,
            body,
          })
          sendJson(res, result.status, result.body)
        } catch (err) {
          console.error(
            '[source-pdf-api] unexpected error:',
            err instanceof Error ? err.message : 'unknown',
          )
          sendJson(res, 503, {
            error: 'unavailable',
            message: 'Source PDF service failed unexpectedly.',
          })
        }
      })
    },
  }
}
