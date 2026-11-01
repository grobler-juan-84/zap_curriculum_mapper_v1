/**
 * JWT + profiles.role === 'admin' gate for admin-only API routes (server-only).
 * Reuses authorizeBearerUser, then reads public.profiles with the user JWT.
 */
import { createClient } from '@supabase/supabase-js'
import {
  authorizeBearerUser,
  type AuthorizeUserFailure,
  type AuthorizeUserSuccess,
} from './authorizeBearerUser.ts'

export type AuthorizeAdminSuccess = AuthorizeUserSuccess & {
  role: 'admin'
}

export async function authorizeAdminBearerUser(
  authorizationHeader: string | undefined,
): Promise<AuthorizeAdminSuccess | AuthorizeUserFailure> {
  const userAuth = await authorizeBearerUser(authorizationHeader)
  if (!userAuth.ok) return userAuth

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

  const jwt = (() => {
    if (!authorizationHeader) return null
    const match = authorizationHeader.match(/^Bearer\s+(.+)$/i)
    return match?.[1]?.trim() || null
  })()
  if (!jwt) {
    return { ok: false, status: 401, error: 'unauthorized', message: 'Missing Bearer token.' }
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userAuth.userId)
    .maybeSingle()

  if (error) {
    return {
      ok: false,
      status: 503,
      error: 'profile_lookup_failed',
      message: error.message || 'Could not load profile role.',
    }
  }

  if (!data || data.role !== 'admin') {
    return {
      ok: false,
      status: 403,
      error: 'forbidden',
      message: 'Administrator role required.',
    }
  }

  return {
    ok: true,
    userId: userAuth.userId,
    email: userAuth.email,
    role: 'admin',
  }
}
