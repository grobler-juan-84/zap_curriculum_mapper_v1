/**
 * Authenticated Chalkie prompt generation via OpenAI (server-only).
 */
import { authorizeBearerUser } from './authorizeBearerUser.ts'
import {
  buildUserEvidenceMessage,
  CHALKIE_SYSTEM_PROMPT,
  type ChalkieGenerateEvidence,
} from './chalkiePromptScaffold.ts'

export type GenerateChalkieHttpRequest = {
  authorizationHeader: string | undefined
  body: unknown
}

export type GenerateChalkieHttpResponse = {
  status: number
  body: Record<string, unknown>
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    .map((item) => item.trim())
}

function asNumberArray(value: unknown): number[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => (typeof item === 'number' ? item : Number(item)))
    .filter((n) => Number.isFinite(n))
}

function parseEvidence(body: Record<string, unknown>): ChalkieGenerateEvidence | null {
  const bookTitle = asString(body.bookTitle)
  const unitLabel = asString(body.unitLabel)
  if (!bookTitle || !unitLabel) return null

  return {
    bookTitle,
    catalogBookId: asString(body.catalogBookId),
    series: asString(body.series),
    unitLabel,
    unitTheme: asString(body.unitTheme) ?? null,
    unitPageRange: asString(body.unitPageRange) ?? null,
    learningFocus: asString(body.learningFocus) ?? null,
    visiblePrintedPages: asNumberArray(body.visiblePrintedPages),
    unitVocabulary: asStringArray(body.unitVocabulary),
    unitLanguage: asStringArray(body.unitLanguage),
    unitActivities: asStringArray(body.unitActivities),
    visiblePageLabels: asStringArray(body.visiblePageLabels),
    visibleVocabulary: asStringArray(body.visibleVocabulary),
    visibleLanguage: asStringArray(body.visibleLanguage),
    visibleActivities: asStringArray(body.visibleActivities),
  }
}

function parseModelJson(content: string): {
  lessonTopic: string
  chalkiePrompt: string
  vocabularyCsv: string
} | null {
  const trimmed = content.trim()
  const fence = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/i)
  const jsonText = fence ? fence[1].trim() : trimmed
  try {
    const parsed = JSON.parse(jsonText) as Record<string, unknown>
    const lessonTopic = asString(parsed.lessonTopic) ?? ''
    const chalkiePrompt = asString(parsed.chalkiePrompt) ?? ''
    const vocabularyCsv =
      asString(parsed.vocabularyCsv) ??
      (Array.isArray(parsed.vocabularyCsv)
        ? parsed.vocabularyCsv.filter((v): v is string => typeof v === 'string').join(', ')
        : '')
    if (!chalkiePrompt) return null
    return { lessonTopic, chalkiePrompt, vocabularyCsv }
  } catch {
    return null
  }
}

export async function handleGenerateChalkiePromptRequest(
  req: GenerateChalkieHttpRequest,
): Promise<GenerateChalkieHttpResponse> {
  const auth = await authorizeBearerUser(req.authorizationHeader)
  if (!auth.ok) {
    return {
      status: auth.status,
      body: { error: auth.error, message: auth.message },
    }
  }

  const openaiKey = (process.env.OPENAI_API_KEY || '').trim()
  if (!openaiKey) {
    return {
      status: 503,
      body: {
        error: 'not_configured',
        message: 'OPENAI_API_KEY is not set on the server (root .env.local).',
      },
    }
  }

  const body = asRecord(req.body)
  const evidence = parseEvidence(body)
  if (!evidence) {
    return {
      status: 400,
      body: {
        error: 'bad_request',
        message: 'bookTitle and unitLabel are required.',
      },
    }
  }

  if (evidence.visiblePrintedPages.length === 0) {
    return {
      status: 400,
      body: {
        error: 'bad_request',
        message: 'Navigate the PDF so visible printed pages are available before generating.',
      },
    }
  }

  const model = (process.env.OPENAI_CHALKIE_MODEL || 'gpt-4o-mini').trim() || 'gpt-4o-mini'

  let openaiResponse: Response
  try {
    openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: CHALKIE_SYSTEM_PROMPT },
          { role: 'user', content: buildUserEvidenceMessage(evidence) },
        ],
      }),
    })
  } catch (err) {
    return {
      status: 503,
      body: {
        error: 'unavailable',
        message: err instanceof Error ? err.message : 'OpenAI network error.',
      },
    }
  }

  const openaiText = await openaiResponse.text()
  let openaiJson: Record<string, unknown> = {}
  try {
    openaiJson = JSON.parse(openaiText) as Record<string, unknown>
  } catch {
    /* keep empty */
  }

  if (!openaiResponse.ok) {
    const errObj = asRecord(openaiJson.error)
    const message =
      asString(errObj.message) ||
      `OpenAI request failed (HTTP ${openaiResponse.status}).`
    const status =
      openaiResponse.status === 401 || openaiResponse.status === 403
        ? 502
        : openaiResponse.status === 429
          ? 429
          : 502
    return {
      status,
      body: { error: 'openai_error', message },
    }
  }

  const choices = Array.isArray(openaiJson.choices) ? openaiJson.choices : []
  const first = asRecord(choices[0])
  const message = asRecord(first.message)
  const content = asString(message.content) ?? ''
  const parsed = parseModelJson(content)
  if (!parsed) {
    return {
      status: 502,
      body: {
        error: 'bad_model_output',
        message: 'Model did not return usable lessonTopic / chalkiePrompt JSON.',
      },
    }
  }

  // Prefer model vocab; if empty, fall back to visible then unit evidence.
  let vocabularyCsv = parsed.vocabularyCsv.trim()
  if (!vocabularyCsv) {
    const fromVisible = evidence.visibleVocabulary.join(', ')
    const fromUnit = evidence.unitVocabulary.join(', ')
    vocabularyCsv = fromVisible || fromUnit
  }

  return {
    status: 200,
    body: {
      lessonTopic: parsed.lessonTopic,
      chalkiePrompt: parsed.chalkiePrompt,
      vocabularyCsv,
      model,
    },
  }
}
