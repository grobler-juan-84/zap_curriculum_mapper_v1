# General Curriculum Mapper — Progress

**Status:** ACTIVE
**Version:** 1.0
**Last updated:** Step 401
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
- **LiA-C complete and owner-accepted (2026-10-30):** default-off `VITE_NLL_CHALKIE_LIA_ADAPTER_PILOT`; exact-scope Create-a-prompt series path loads hidden/experimental `be3-u08-lia`, builds selected NLP, attaches package-level NLL only, renders five artifacts via shared `renderChalkieFromNeutralPackage`, preserves BI absence and stale-result guards, and falls back to current `sb_only` (resolver default unchanged). Focused **15/15**; retained LiA/shared/resolver **81/81**; Opener/Story **76/76**; combined **172/172**; typecheck pass; lint pass (pre-existing warnings only); `git diff --check` pass. Trusted WB canonical restored and hash-verified locally (gitignored). Authenticated manual acceptance passed (all selected; SB Act 8 / WB Act 7 exclusion; WB Act 10 without Act 9; zero WB; zero SB; zero both; prior/teacher-added; Opener/Story/Grammar isolation; flag-off). Manual stale-result not safely observable; automated stale-result coverage passed. Process-only flags only; no `.env.local` change. Undeployed/unpromoted.
- **Remaining BE3 U8 planning documented (docs-only, separately gated):** provisional/evidence-blocked CLIL/P.E., Grammar, Culture, Writing, Phonics, and Review transfer briefs plus Values standalone architecture brief. Inclusion does not authorize implementation.

## In progress

- None for LiA-C. Next Unit 8 component work remains separately gated and unauthorized.

## Next

- Hold promotion, deployment, NLL visibility changes, canary/POC/bespoke/fallback retirement, Supabase CLI/database/Storage writes, `.env.local` changes, and any CLIL/Grammar/Culture/Writing/Phonics/Values/Review implementation until separately authorized.
- Deferred audit risk: older local migrations still show empty remote history entries (including Opener `20261029120000`).

## Blocked

- NLL promotion and production deployment are not authorized.
- Broad `supabase db push` is not authorized.
- Wider D026 feature freeze remains active outside bounded authorized slices.
- Next-component implementation is not authorized by LiA-C acceptance or the seven planning briefs.

---

## Snapshot notes

- Active Git branch: `main` (LiA-C acceptance closeout in progress for Step 401).
- Live NLL: Opener + Story + LiA = **3 / 23 / 23 / 5**; all summaries remain hidden/experimental and all SS links remain proposed.
- Stages 3–5, Stage 6B, and LiA-C remain default-off and undeployed.
