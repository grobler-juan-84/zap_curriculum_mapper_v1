# General Curriculum Mapper — Progress

**Status:** ACTIVE
**Version:** 1.0
**Last updated:** Step 403
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** remains paused at 14/18 COMPLETE (D015).
- **D017–D027** are locked. D021 keeps preparation SB-first; D022 keeps the Neutral Lesson Package as the durable handoff; **D027** locks SS/SB/WB → NLL → NLP → adapters. Stage 3/4/5/6A/6B work does not reopen D027.
- **D024 / D025 NLL pilot complete on `main`:** Opener migration applied; persistent seed and RLS verified.
- **D026 Batch 0** and audit evidence are on `main`. Stage 1–2 docs (D027 + roadmap) recorded.
- **Stages 3–5 complete (bounded):** owner-accepted default-off Opener pilots on `main`; undeployed/unpromoted. Opener summaries remain `hidden` + `experimental`.
- **Stage 6A complete and owner-accepted:** BE3 U8 Story NLL knowledge live; migration `20261029180000` recorded as applied remotely.
- **Stage 6B complete and owner-accepted:** default-off `VITE_NLL_CHALKIE_STORY_ADAPTER_PILOT`; undeployed/unpromoted. Stage 5 Opener and Stage 6B Story are the two accepted reference implementations.
- **LiA-A/B/C complete and owner-accepted:** live `be3-u08-lia` draft with nine memberships, nine hidden/experimental summaries, and two proposed SS links; totals **3 / 23 / 23 / 5**; migration `20261029213000` recorded applied; LiA-C default-off and undeployed.
- **Grammar-A Step A owner-accepted (2026-10-30):** documentation/content only for proposed `be3-u08-grammar` designs (ten memberships / ten summaries / Structures proposed only).
- **Grammar-A Step B implemented locally (2026-10-30) — unapplied:** migration `20261030160000_seed_nll_be3_u08_grammar.sql` and focused suite prepared; 10 memberships, 10 preferred hidden/experimental summaries, one proposed Structures link. Focused tests **4/4**; retained Opener/schema + Story + LiA seed suites **13/13**. **Not live. Not accepted as applied.**
- **Migration-history reconciliation complete (2026-10-30):** twenty already-live migrations marked applied in remote history only (no SQL re-execution). Final matrix: **22** remotely recorded, **1** local-only Grammar (`20261030160000`), **0** remote-only. Linked dry-run listed only Grammar. Live NLL unchanged at **3 / 23 / 23 / 5**; catalog **3 / 14 / 150 / 14**; Storage buckets present. Broader `authenticated` grants (`TRUNCATE`/`REFERENCES`/`TRIGGER` outside RLS) acknowledged as a separate security-hardening question.
- **Remaining BE3 U8 planning documented (docs-only, separately gated):** CLIL/P.E., Culture, Writing, Phonics, Review, Values.

## In progress

- None. Next owner gate is a separately authorized Grammar-only database application of `20261030160000`.

## Next

- Separately authorize Grammar-only DB application of `20261030160000` if desired (do not treat this checkpoint as apply authorization).
- Hold promotion, deployment, NLL visibility changes, canary/POC/bespoke/fallback retirement, unrelated migrations, `.env.local` changes, Grammar-B/C, and further component implementation until separately authorized.
- Grant/RLS hardening for documented privilege supersets remains separately gated.

## Blocked

- NLL promotion and production deployment are not authorized.
- Grammar-A Step B database application is not authorized by this checkpoint.
- Broader `supabase db push` / `--include-all` remain unauthorized.
- Wider D026 feature freeze remains active outside bounded authorized slices.

---

## Snapshot notes

- Active Git branch: `main` (Step 403 checkpoint: local Grammar Step B artifacts + history reconciliation docs).
- Live NLL: Opener + Story + LiA = **3 / 23 / 23 / 5**; Grammar remains **absent** from live NLL.
- Stages 3–5, Stage 6B, and LiA-C remain default-off and undeployed.
