/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  /** Opt-in Opener-only neutral canary. Default unset/false = bespoke path. */
  readonly VITE_CHALKIE_BE3_U08_OPENER_NEUTRAL_CANARY?: string
  /** Opt-in Story-only neutral canary. Default unset/false = bespoke path. */
  readonly VITE_CHALKIE_BE3_U08_STORY_NEUTRAL_CANARY?: string
  /** Opt-in BE3 U8 pp.128-129 activity-enrichment POC. Default unset/false. */
  readonly VITE_CHALKIE_BE3_U08_ACTIVITY_ENRICHMENT_POC?: string
  /**
   * Opt-in BE3 U8 Opener NLL↔POC activity-card comparison (default unset/false).
   * Independent of enrichment POC, NLL shadow pilot, and neutral canaries.
   */
  readonly VITE_CHALKIE_NLL_CARD_COMPARISON?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
