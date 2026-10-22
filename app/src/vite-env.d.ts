/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  /** Opt-in Opener-only neutral canary. Default unset/false = bespoke path. */
  readonly VITE_CHALKIE_BE3_U08_OPENER_NEUTRAL_CANARY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
