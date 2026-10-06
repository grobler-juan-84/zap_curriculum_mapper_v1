import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Optional Supabase client for local development.
 * The app must start without VITE_SUPABASE_* credentials.
 */
export function getSupabaseClient(): SupabaseClient | null {
  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    return null
  }

  return createClient(url, anonKey)
}
