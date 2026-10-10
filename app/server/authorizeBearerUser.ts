/**
 * JWT session check for authenticated API routes (server-only).
 */
import { createClient } from '@supabase/supabase-js'

export type AuthorizeUserFailure = {
  ok: false
  status: number
  error: string
  message: string
}

export type AuthorizeUserSuccess = {
  ok: true
  userId: string
  email: string | undefined
}

function bearerToken(header: string | undefined): string | null {
  if (!header) return null
  const match = header.match(/^Bearer\s+(.+)$/i)
  return match?.[1]?.trim() || null
}

export async function authorizeBearerUser(
  authorizationHeader: string | undefined,
): Promise<AuthorizeUserSuccess | AuthorizeUserFailure> {
  const supabaseUrl = (
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    ''
  ).trim()
  const anonKey = (
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ''
  ).trim()

  if (!supabaseUrl || !anonKey) {
    return {
      ok: false,
      status: 503,
      error: 'not_configured',
      message: 'Supabase is not configured on the server.',
    }
  }

  const jwt = bearerToken(authorizationHeader)
  if (!jwt) {
    return { ok: false, status: 401, error: 'unauthorized', message: 'Missing Bearer token.' }
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: userData, error: userError } = await supabase.auth.getUser(jwt)
  if (userError || !userData.user) {
    return {
      ok: false,
      status: 401,
      error: 'unauthorized',
      message: 'Invalid or expired session.',
    }
  }

  return {
    ok: true,
    userId: userData.user.id,
    email: userData.user.email,
  }
}
