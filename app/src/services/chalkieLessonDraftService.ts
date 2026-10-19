import { isSupabaseConfigured, supabase } from '../lib/supabase'

export type ChalkieLessonDraftRequest = {
  assembledPrompt: string
  packageType: 'single' | 'series'
  displayTitle: string
}

export type ChalkieLessonDraftResult = {
  draftMarkdown: string
  packageType: 'single' | 'series'
  displayTitle: string
}

export const chalkieLessonDraftService = {
  async generate(payload: ChalkieLessonDraftRequest): Promise<ChalkieLessonDraftResult> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(
        'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to app/.env.local.',
      )
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    const token = sessionData.session?.access_token
    if (sessionError || !token) {
      throw new Error('Sign in required to generate a Chalkie lesson draft.')
    }

    const response = await fetch('/api/chalkie/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        assembledPrompt: payload.assembledPrompt,
        packageType: payload.packageType,
        displayTitle: payload.displayTitle,
      }),
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
          : `Generation failed (HTTP ${response.status}).`
      throw new Error(message)
    }

    const draftMarkdown =
      typeof body.draftMarkdown === 'string' ? body.draftMarkdown.trim() : ''
    if (!draftMarkdown) {
      throw new Error('Server returned an empty lesson draft.')
    }

    const packageType =
      body.packageType === 'series' || body.packageType === 'single'
        ? body.packageType
        : payload.packageType

    return {
      draftMarkdown,
      packageType,
      displayTitle:
        typeof body.displayTitle === 'string' && body.displayTitle.trim()
          ? body.displayTitle.trim()
          : payload.displayTitle,
    }
  },
}
