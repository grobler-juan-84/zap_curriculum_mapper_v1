/**
 * Authenticated Chalkie lesson-draft generation via OpenAI Responses API (server-only).
 * Accepts the already-assembled deterministic prompt; does not invent page scope.
 */
import OpenAI from 'openai'
import { authorizeBearerUser } from './authorizeBearerUser.ts'
import { resolveOpenAiServerConfig } from './openaiConfig.ts'

export type GenerateChalkieLessonDraftHttpRequest = {
  authorizationHeader: string | undefined
  body: unknown
}

export type GenerateChalkieLessonDraftHttpResponse = {
  status: number
  body: Record<string, unknown>
}

const MAX_PROMPT_CHARS = 48_000
const MAX_TITLE_CHARS = 240

const LESSON_DRAFT_INSTRUCTIONS = [
  'You are a cautious Chalkie lesson-draft generator for English teaching support.',
  'Produce a concise, usable Chalkie lesson draft in Markdown.',
  'Follow the submitted page scope exactly.',
  'Respect whether the request is a single lesson or a two-lesson series.',
  'For a two-lesson series, keep Student Book [SB] and Workbook [WB] evidence distinct.',
  'Treat [HM] as optional teacher-selected support, never compulsory content for every activity.',
  'Treat [TEACHER-ADDED · UNVERIFIED] as teacher-directed language, not publisher evidence.',
  'Do not invent publisher audio scripts, missing true/false text, unseen page content, page numbers, or claims of publisher wording.',
  'Do not introduce later Unit 8 content such as habitats, grammar, phonics, culture, values, or review.',
  'Do not claim a lesson has been saved, exported, or turned into slides.',
  'Do not add timings unless the submitted prompt explicitly supplies them.',
  'Do not present assumptions as textbook facts.',
].join(' ')

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function extractOutputText(response: OpenAI.Responses.Response): string {
  const direct = typeof response.output_text === 'string' ? response.output_text.trim() : ''
  if (direct) return direct

  const chunks: string[] = []
  for (const item of response.output ?? []) {
    if (item.type !== 'message') continue
    for (const part of item.content ?? []) {
      if (part.type === 'output_text' && typeof part.text === 'string' && part.text.trim()) {
        chunks.push(part.text.trim())
      }
    }
  }
  return chunks.join('\n\n').trim()
}

export async function handleGenerateChalkieLessonDraftRequest(
  req: GenerateChalkieLessonDraftHttpRequest,
): Promise<GenerateChalkieLessonDraftHttpResponse> {
  const auth = await authorizeBearerUser(req.authorizationHeader)
  if (!auth.ok) {
    return {
      status: auth.status,
      body: { error: auth.error, message: auth.message },
    }
  }

  const config = resolveOpenAiServerConfig()
  if (!config.ok) {
    return {
      status: 503,
      body: {
        error: 'not_configured',
        message: config.message,
      },
    }
  }

  const body = asRecord(req.body)
  const assembledPrompt = asString(body.assembledPrompt)
  const packageType = asString(body.packageType)
  const displayTitle = asString(body.displayTitle)

  if (!assembledPrompt || !packageType || !displayTitle) {
    return {
      status: 400,
      body: {
        error: 'bad_request',
        message: 'assembledPrompt, packageType, and displayTitle are required.',
      },
    }
  }

  if (packageType !== 'single' && packageType !== 'series') {
    return {
      status: 400,
      body: {
        error: 'bad_request',
        message: 'packageType must be "single" or "series".',
      },
    }
  }

  if (assembledPrompt.length > MAX_PROMPT_CHARS || displayTitle.length > MAX_TITLE_CHARS) {
    return {
      status: 400,
      body: {
        error: 'bad_request',
        message: 'Request payload exceeds the allowed size for this prototype.',
      },
    }
  }

  // Reject client attempts to override secrets / model / tooling.
  if (
    body.apiKey != null ||
    body.openaiApiKey != null ||
    body.model != null ||
    body.instructions != null ||
    body.developerInstruction != null
  ) {
    return {
      status: 400,
      body: {
        error: 'bad_request',
        message: 'Unsupported fields were supplied.',
      },
    }
  }

  const client = new OpenAI({ apiKey: config.apiKey })
  const userInput = [
    `Package type: ${packageType}`,
    `Display title: ${displayTitle}`,
    '',
    'Source-grounded Chalkie prompt (follow exactly):',
    assembledPrompt,
  ].join('\n')

  try {
    const response = await client.responses.create({
      model: config.model,
      instructions: LESSON_DRAFT_INSTRUCTIONS,
      input: userInput,
    })

    const draftMarkdown = extractOutputText(response)
    if (!draftMarkdown) {
      console.error('[chalkie-lesson-draft] empty model output')
      return {
        status: 502,
        body: {
          error: 'bad_model_output',
          message: 'The model returned an empty lesson draft.',
        },
      }
    }

    return {
      status: 200,
      body: {
        draftMarkdown,
        packageType,
        displayTitle,
        // Safe, non-secret metadata only
        modelConfigured: true,
      },
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown'
    console.error('[chalkie-lesson-draft] provider call failed:', message.slice(0, 200))
    return {
      status: 502,
      body: {
        error: 'openai_error',
        message: 'OpenAI generation failed. Try again later.',
      },
    }
  }
}
