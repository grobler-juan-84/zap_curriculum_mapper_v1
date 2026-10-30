# General Curriculum Mapper — Progress

**Status:** ACTIVE
**Version:** 1.0
**Last updated:** Step 408
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** remains paused at 14/18 COMPLETE (D015).
- **D017–D027** are locked. D021 keeps preparation SB-first; D022 keeps the Neutral Lesson Package as the durable handoff; **D027** locks SS/SB/WB → NLL → NLP → adapters.
- **Stages 3–5 / 6A / 6B** complete and owner-accepted where applicable; Opener and Story remain the two accepted reference implementations (default-off / undeployed).
- **LiA-A/B/C**, **Grammar-A/B/C**, and **CLIL-A/B/C** complete and owner-accepted; CLIL checkpoint on `main` at `3f5fcabdc7a498643051882734744e23710be018`.
- **Culture-A Step B APPLIED / VERIFIED / OWNER-ACCEPTED UNDER ADVANCE AUTHORIZATION:** only `20261030180000` applied to `kivvmobjphtcgxoltqbc`; live NLL **6 / 53 / 53 / 6**; history **25 recorded / 0 pending / 0 remote-only**; nine memberships; zero Culture SS links.
- **Culture-B/C IMPLEMENTED / AUTOMATED VERIFICATION PASSED / OWNER-ACCEPTED UNDER ADVANCE AUTHORIZATION:** exact Culture package/renderer; default-off `VITE_NLL_CHALKIE_CULTURE_ADAPTER_PILOT`; overlay stale guards and `sb_only` fallback; BI-absent; package-level NLL only. Dedicated focused **9/9**; retained batch **178/178**; typecheck pass; lint warnings only.

## In progress

- None. Culture A/B/C complete for this authorization; undeployed/unpromoted; uncommitted.

## Next

- Hold promotion, deployment, NLL visibility changes, flag-on defaults, Writing, and other Unit 8 component work until separately authorized.
- Optional later: owner-authorized Culture commit/push (not part of this gate).
- Grant/RLS hardening for documented privilege supersets remains separately gated.

## Blocked

- NLL promotion and production deployment are not authorized.
- Broader `supabase db push` / `--include-all` remain unauthorized.
- Wider D026 feature freeze remains active outside bounded authorized slices.

---

## Snapshot notes

- Active Git branch: `main` at `3f5fcab` plus local uncommitted Culture A/B/C work.
- Live NLL: Opener + Story + LiA + Grammar + CLIL + Culture = **6 / 53 / 53 / 6**.
- Culture default serving remains resolver `sb_only`; Culture flag default-off.
