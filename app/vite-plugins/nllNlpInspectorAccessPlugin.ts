/**
 * Vite transport for NLL/NLP Inspector admin access gate:
 * - POST /api/nll-nlp-inspector/access
 */
import type { Plugin } from 'vite'
import { loadServerEnv } from '../server/loadServerEnv.ts'
import { handleNllNlpInspectorAccessRequest } from '../server/handleNllNlpInspectorAccessRequest.ts'

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

export function nllNlpInspectorAccessPlugin(appRoot: string): Plugin {
  return {
    name: 'gcm-nll-nlp-inspector-access',
    configureServer(server) {
      loadServerEnv(appRoot)

      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''
        if (url !== '/api/nll-nlp-inspector/access') {
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
          sendJson(res, 405, { error: 'method_not_allowed', allowed: false })
          return
        }

        // Body is optional; read to drain the stream if present.
        await readJsonBody(req)

        try {
          const result = await handleNllNlpInspectorAccessRequest({
            authorizationHeader: req.headers.authorization,
          })
          sendJson(res, result.status, result.body)
        } catch (err) {
          console.error(
            '[nll-nlp-inspector/access] unexpected error:',
            err instanceof Error ? err.message : 'unknown',
          )
          sendJson(res, 503, {
            error: 'unavailable',
            message: 'Inspector access check failed unexpectedly.',
            allowed: false,
          })
        }
      })
    },
  }
}
