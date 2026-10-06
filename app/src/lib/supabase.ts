import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? '').trim()
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim()

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const SUPABASE_CONFIG_ERROR =
  'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to app/.env.local and restart the Vite dev server.'

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
