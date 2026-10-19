/**
 * Centralized server-side OpenAI configuration (never import from browser code).
 */

export type OpenAiServerConfig =
  | { ok: true; apiKey: string; model: string }
  | { ok: false; message: string }

/**
 * Resolve key + model from process.env after loadServerEnv.
 * - Key: OPENAI_API_KEY only
 * - Model: OPENAI_MODEL, else existing OPENAI_CHALKIE_MODEL — no silent default
 */
export function resolveOpenAiServerConfig(): OpenAiServerConfig {
  const apiKey = (process.env.OPENAI_API_KEY || '').trim()
  if (!apiKey) {
    return {
      ok: false,
      message: 'OpenAI generation is not configured on this server yet.',
    }
  }

  const model = (
    process.env.OPENAI_MODEL ||
    process.env.OPENAI_CHALKIE_MODEL ||
    ''
  ).trim()
  if (!model) {
    return {
      ok: false,
      message: 'OpenAI generation is not configured on this server yet.',
    }
  }

  return { ok: true, apiKey, model }
}
