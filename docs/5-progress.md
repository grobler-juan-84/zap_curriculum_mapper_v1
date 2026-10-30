# General Curriculum Mapper — Progress

**Status:** ACTIVE
**Version:** 1.0
**Last updated:** Step 404
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** remains paused at 14/18 COMPLETE (D015).
- **D017–D027** are locked. D021 keeps preparation SB-first; D022 keeps the Neutral Lesson Package as the durable handoff; **D027** locks SS/SB/WB → NLL → NLP → adapters.
- **Stages 3–5 / 6A / 6B** complete and owner-accepted where applicable; Opener and Story remain the two accepted reference implementations (default-off / undeployed).
- **LiA-A/B/C complete and owner-accepted:** default-off `VITE_NLL_CHALKIE_LIA_ADAPTER_PILOT`; undeployed; resolver `sb_only` default unchanged.
- **Grammar-A Step A/B complete and owner-accepted:** live `be3-u08-grammar` draft UUID `…000004`; ten memberships; ten preferred v1 `hidden`/`experimental`/`sufficient` summaries; one `proposed` Structures link; no Grammar I can…/Vocabulary link. Migration `20261030160000` recorded. Live NLL totals **4 / 33 / 33 / 6**. Migration history **23 recorded / 0 pending / 0 remote-only**.
- **Grammar-B/C complete and owner-accepted under advance authorization (2026-10-30):** exact Grammar neutral package + five-artifact renderer; default-off `VITE_NLL_CHALKIE_GRAMMAR_ADAPTER_PILOT`; package-level NLL only; BI absent; stale-result guards; current `sb_only` fallback. Automated gates passed (focused Grammar suites **19/19**; retained regressions **141/141** combined with focused; typecheck pass; lint warnings only; `git diff --check` / encoding clean). Undeployed/unpromoted.

## In progress

- None. Grammar-B/C milestone complete under automated acceptance authority.

## Next

- Hold promotion, deployment, NLL visibility changes, Structures promotion, Grammar I can…/Vocabulary links, flag-on by default, canary/POC/fallback retirement, unrelated migrations, and next Unit 8 component work until separately authorized.
- Grant/RLS hardening for documented privilege supersets remains separately gated.

## Blocked

- NLL promotion and production deployment are not authorized.
- Broader `supabase db push` / `--include-all` remain unauthorized.
- Wider D026 feature freeze remains active outside bounded authorized slices.

---

## Snapshot notes

- Active Git branch: `main` (Step 404: Grammar-B/C local implementation; uncommitted unless separately authorized).
- Live NLL: Opener + Story + LiA + Grammar = **4 / 33 / 33 / 6**.
- Grammar serving remains resolver `sb_only` with flag-off byte-equivalent path; Grammar-C is default-off.
