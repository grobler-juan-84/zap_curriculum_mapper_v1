import { isSupabaseConfigured, supabase } from '../lib/supabase'

export type ChalkieGenerateRequest = {
  bookTitle: string
  catalogBookId?: string
  series?: string
  unitLabel: string
  unitTheme?: string | null
  unitPageRange?: string | null
  learningFocus?: string | null
  visiblePrintedPages: number[]
  unitVocabulary: string[]
  unitLanguage: string[]
  unitActivities: string[]
  visiblePageLabels: string[]
  visibleVocabulary: string[]
  visibleLanguage: string[]
  visibleActivities: string[]
}

export type ChalkieGenerateResult = {
  lessonTopic: string
  chalkiePrompt: string
  vocabularyCsv: string
  model?: string
}

export const chalkieGenerateService = {
  async generate(payload: ChalkieGenerateRequest): Promise<ChalkieGenerateResult> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(
        'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to app/.env.local.',
      )
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    const token = sessionData.session?.access_token
    if (sessionError || !token) {
      throw new Error('Sign in required to generate a Chalkie prompt.')
    }

    const response = await fetch('/api/generate-chalkie-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    let body: Record<string, unknown> = {}
    try {
      body = (await response.json()) as Record<string, unknown>
    } catch {
      /* keep empty */
    }

    if (!response.ok) {
      const message =
        typeof body.message === 'string' && body.message.trim()
          ? body.message
          : `Generate failed (HTTP ${response.status}).`
      throw new Error(message)
    }

    const chalkiePrompt =
      typeof body.chalkiePrompt === 'string' ? body.chalkiePrompt.trim() : ''
    if (!chalkiePrompt) {
      throw new Error('Server returned an empty Chalkie prompt.')
    }

    return {
      lessonTopic: typeof body.lessonTopic === 'string' ? body.lessonTopic.trim() : '',
      chalkiePrompt,
      vocabularyCsv: typeof body.vocabularyCsv === 'string' ? body.vocabularyCsv.trim() : '',
      model: typeof body.model === 'string' ? body.model : undefined,
    }
  },
}
