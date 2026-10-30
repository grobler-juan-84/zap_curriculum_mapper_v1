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
  /**
   * Opt-in Stage 4 NLL → NLP → General Lesson Plan pilot (default unset/false).
   * Opener-only; General-plan path only; independent of Stage 3 comparison,
   * enrichment POC, NLL shadow pilot, and neutral canaries. May read hidden
   * experimental summaries without promoting them.
   */
  readonly VITE_NLL_GENERAL_LESSON_PLAN_PILOT?: string
  /**
   * Opt-in Stage 5 NLL -> NLP -> Chalkie adapter pilot (default unset/false).
   * Exact BE3 U8 Opener two-lesson package only; NLL summaries stay package-only.
   */
  readonly VITE_NLL_CHALKIE_ADAPTER_PILOT?: string
  /**
   * Opt-in Stage 6B NLL -> NLP -> Chalkie Story adapter pilot (default unset/false).
   * Exact BE3 U8 Story two-lesson package only; independent of Stage 5 and Story canary.
   * NLL summaries stay package-only; Story remains BI-absent.
   */
  readonly VITE_NLL_CHALKIE_STORY_ADAPTER_PILOT?: string
  /**
   * Opt-in LiA-C NLL -> NLP -> Chalkie adapter pilot (default unset/false).
   * Exact BE3 U8 Language in Action two-lesson series only; independent of Opener/Story.
   * NLL summaries stay package-only; LiA remains BI-absent; resolver default stays sb_only.
   */
  readonly VITE_NLL_CHALKIE_LIA_ADAPTER_PILOT?: string
  /**
   * Opt-in Grammar-C NLL -> NLP -> Chalkie adapter pilot (default unset/false).
   * Exact BE3 U8 Grammar two-lesson series only; independent of Opener/Story/LiA.
   * NLL summaries stay package-only; Grammar remains BI-absent; resolver default stays sb_only.
   */
  readonly VITE_NLL_CHALKIE_GRAMMAR_ADAPTER_PILOT?: string
  /**
   * Opt-in CLIL-C NLL -> NLP -> Chalkie adapter pilot (default unset/false).
   * Exact BE3 U8 Content Connection / P.E. two-lesson series only; independent of Opener/Story/LiA/Grammar.
   * NLL summaries stay package-only; CLIL remains BI-absent; resolver default stays sb_only.
   */
  readonly VITE_NLL_CHALKIE_CLIL_PE_ADAPTER_PILOT?: string
  /**
   * Opt-in Culture-C NLL -> NLP -> Chalkie adapter pilot (default unset/false).
   * Exact BE3 U8 Culture Connection two-lesson series only; independent of Opener/Story/LiA/Grammar/CLIL.
   * NLL summaries stay package-only; Culture remains BI-absent; resolver default stays sb_only.
   */
  readonly VITE_NLL_CHALKIE_CULTURE_ADAPTER_PILOT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
