/**
 * Client call to trusted admin access gate for NLL/NLP Inspector.
 */
import { supabase } from '../lib/supabase'

export type NllNlpInspectorAccessResult =
  | { readonly ok: true }
  | {
      readonly ok: false
      readonly status: number
      readonly error: string
      readonly message: string
    }

export async function requestNllNlpInspectorAccess(): Promise<NllNlpInspectorAccessResult> {
  if (!supabase) {
    return {
      ok: false,
      status: 503,
      error: 'not_configured',
      message: 'Supabase is not configured.',
    }
  }

  const { data, error } = await supabase.auth.getSession()
  if (error || !data.session?.access_token) {
    return {
      ok: false,
      status: 401,
      error: 'unauthorized',
      message: 'Sign in required.',
    }
  }

  let response: Response
  try {
    response = await fetch('/api/nll-nlp-inspector/access', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${data.session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: '{}',
    })
  } catch {
    return {
      ok: false,
      status: 503,
      error: 'unavailable',
      message: 'Inspector access endpoint is unavailable.',
    }
  }

  const body = (await response.json().catch(() => ({}))) as {
    allowed?: boolean
    error?: string
    message?: string
  }

  if (!response.ok || body.allowed !== true) {
    return {
      ok: false,
      status: response.status,
      error: body.error ?? 'forbidden',
      message: body.message ?? 'Administrator role required.',
    }
  }

  return { ok: true }
}
