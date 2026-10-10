/**
 * Vite transport for Chalkie prompt generation:
 * - POST /api/generate-chalkie-prompt
 */
import type { Plugin } from 'vite'
import { loadServerEnv } from '../server/loadServerEnv.ts'
import { handleGenerateChalkiePromptRequest } from '../server/handleGenerateChalkiePromptRequest.ts'

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

export function generateChalkiePromptPlugin(appRoot: string): Plugin {
  return {
    name: 'gcm-generate-chalkie-prompt',
    configureServer(server) {
      loadServerEnv(appRoot)

      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''
        if (url !== '/api/generate-chalkie-prompt') {
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
          const result = await handleGenerateChalkiePromptRequest({
            authorizationHeader: req.headers.authorization,
            body,
          })
          sendJson(res, result.status, result.body)
        } catch (err) {
          console.error(
            '[generate-chalkie-prompt] unexpected error:',
            err instanceof Error ? err.message : 'unknown',
          )
          sendJson(res, 503, {
            error: 'unavailable',
            message: 'Chalkie prompt generation failed unexpectedly.',
          })
        }
      })
    },
  }
}
