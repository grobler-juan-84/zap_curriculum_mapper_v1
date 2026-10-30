# General Curriculum Mapper — Progress

**Status:** ACTIVE
**Version:** 1.0
**Last updated:** Step 402
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** remains paused at 14/18 COMPLETE (D015).
- **D017–D027** are locked. D021 keeps preparation SB-first; D022 keeps the Neutral Lesson Package as the durable handoff; **D027** locks SS/SB/WB → NLL → NLP → adapters. Stage 3/4/5/6A/6B work does not reopen D027.
- **D024 / D025 NLL pilot complete on `main`:** Opener migration applied; persistent seed and RLS verified.
- **D026 Batch 0** and audit evidence are on `main`. Stage 1–2 docs (D027 + roadmap) recorded.
- **Stages 3–5 complete (bounded):** owner-accepted default-off Opener pilots on `main`; undeployed/unpromoted. Opener summaries remain `hidden` + `experimental`.
- **Stage 6A complete and owner-accepted:** BE3 U8 Story NLL knowledge live at totals **2 / 14 / 14 / 3** (`be3-u08-story` draft; five preferred v1 summaries `hidden`/`experimental`; one Structures link `proposed`; WB p.107 excluded). Migration `20261029180000` recorded as applied remotely. Opener remains **1 / 9 / 9 / 2**.
- **Stage 6B complete and owner-accepted:** default-off `VITE_NLL_CHALKIE_STORY_ADAPTER_PILOT`; automated **74/74**, typecheck pass, lint pass (pre-existing warnings only); authenticated manual acceptance passed. Undeployed/unpromoted. Stage 5 Opener and Stage 6B Story are the two accepted reference implementations.
- **LiA-A complete and owner-accepted:** `be3-u08-lia` is live as `draft` with nine ordered memberships, nine preferred v1 summaries `hidden`/`experimental`, and Structures + I can... links `proposed` (Vocabulary withheld). Totals are **3 / 23 / 23 / 5**; migration `20261029213000` is recorded as applied.
- **LiA-B complete and owner-accepted:** exact BI/NLL-absent neutral package for SB pp.132–133 → WB pp.107–108 (`be3_sb_wb_rel_u08_lia_sb132-133_wb107-108` / `be3-sb-wb-u08-p132-133-wb107-108`) plus five-artifact renderer.
- **LiA-C complete and owner-accepted (2026-10-30):** default-off `VITE_NLL_CHALKIE_LIA_ADAPTER_PILOT`; exact-scope Create-a-prompt series path; focused **15/15**; retained **172/172**; undeployed/unpromoted; flag-off LiA remains `sb_only`.
- **Grammar-A Step A owner-accepted (2026-10-30):** documentation/content only for proposed `be3-u08-grammar` / `be3_sb_wb_rel_u08_grammar_sb136-137_wb111-112` / `be3-sb-wb-u08-p136-137-wb111-112`. Exact inventory SB Acts 19–23 + WB Acts 15–19 (ten ordered memberships); ten hidden/experimental preferred v1 summary designs (`evidence_status = sufficient`); SB bind `3924fa23…67e6`; WB bind `811deea2…04fa`; future Structures `proposed` link only; I can… withheld; grammar-box langs `08_03`/`08_04` are p.136 page context only. **No NLL insertion.** Grammar-A Step B / Grammar-B / Grammar-C unauthorized. Serving remains `sb_only`.
- **Remaining BE3 U8 planning documented (docs-only, separately gated):** provisional/evidence-blocked CLIL/P.E., Culture, Writing, Phonics, and Review transfer briefs plus Values standalone architecture brief. Statuses unchanged by Grammar-A Step A acceptance.

## In progress

- None. Grammar-A Step B is the next possible owner gate, not active work.

## Next

- Hold promotion, deployment, NLL visibility changes, canary/POC/bespoke/fallback retirement, Supabase CLI/database/Storage writes, `.env.local` changes, Grammar-A Step B, Grammar-B/C, and any CLIL/Culture/Writing/Phonics/Values/Review implementation until separately authorized.
- Deferred audit risk: older local migrations still show empty remote history entries (including Opener `20261029120000`).

## Blocked

- NLL promotion and production deployment are not authorized.
- Broad `supabase db push` is not authorized.
- Wider D026 feature freeze remains active outside bounded authorized slices.
- Grammar-A Step B and next-component implementation are not authorized by Step A acceptance.

---

## Snapshot notes

- Active Git branch: `main` (Grammar-A Step A acceptance documentation for Step 402; uncommitted unless separately authorized).
- Live NLL: Opener + Story + LiA = **3 / 23 / 23 / 5**; all summaries remain hidden/experimental and all SS links remain proposed. Grammar has **no** live NLL component.
- Stages 3–5, Stage 6B, and LiA-C remain default-off and undeployed.
