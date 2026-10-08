/**
 * Vite-only transport for POST /api/sign-source-pdf.
 * Signing + auth live in app/server/* — keep this file transport-only.
 */
import type { Plugin } from 'vite'
import { loadServerEnv } from '../server/loadServerEnv.ts'
import { handleSignSourcePdfRequest } from '../server/handleSignSourcePdfRequest.ts'

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

export function signSourcePdfPlugin(appRoot: string): Plugin {
  return {
    name: 'gcm-sign-source-pdf',
    configureServer(server) {
      loadServerEnv(appRoot)

      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''
        if (url !== '/api/sign-source-pdf') {
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
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'method_not_allowed' }))
          return
        }

        const body = await readJsonBody(req)
        if (body === null) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'bad_request', message: 'Invalid JSON body.' }))
          return
        }

        try {
          const result = await handleSignSourcePdfRequest({
            authorizationHeader: req.headers.authorization,
            body,
          })
          res.statusCode = result.status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(result.body))
        } catch (err) {
          console.error(
            '[sign-source-pdf] unexpected error:',
            err instanceof Error ? err.message : 'unknown',
          )
          res.statusCode = 503
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              error: 'unavailable',
              message: 'Signing service failed unexpectedly.',
            }),
          )
        }
      })
    },
  }
}
