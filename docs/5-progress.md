# General Curriculum Mapper — Progress

**Status:** ACTIVE
**Version:** 1.0
**Last updated:** Step 411
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** remains paused at 14/18 COMPLETE (D015).
- **D017–D027** are locked. D021 keeps preparation SB-first; D022 keeps the Neutral Lesson Package as the durable handoff; **D027** locks SS/SB/WB → NLL → NLP → adapters.
- **Stages 3–5 / 6A / 6B** complete and owner-accepted where applicable; Opener and Story remain the two accepted reference implementations (default-off / undeployed).
- **LiA-A/B/C**, **Grammar-A/B/C**, **CLIL-A/B/C**, and **Culture-A/B/C** complete and owner-accepted; Culture committed/pushed on `main` at `de6ef31f0cf16f897bbb31e62e8427637b4eab09`.
- **Writing-A Step B APPLIED / VERIFIED:** live NLL **7 / 60 / 60 / 8**; history **26 / 0 / 0**; seven memberships; two proposed SS links.
- **Writing-B/C IMPLEMENTED / AUTOMATED VERIFICATION PASSED / OWNER-ACCEPTED UNDER ADVANCE AUTHORIZATION:** exact Writing package/renderer; default-off `VITE_NLL_CHALKIE_WRITING_ADAPTER_PILOT`; overlay stale guards and `sb_only` fallback; BI-absent; package-level NLL only. Focused/retained **297/297**; typecheck pass; lint warnings only.

## In progress

- None. Writing A/B/C complete for this authorization; undeployed/unpromoted; uncommitted.

## Next

- Hold promotion, deployment, NLL visibility changes, and flag-on defaults.
- Optional later: owner-authorized Writing commit/push (not part of this gate).
- Phonics and remaining Unit 8 components remain separately gated.

## Blocked

- NLL promotion and production deployment are not authorized.
- Broader `supabase db push` / `--include-all` remain unauthorized.
- Wider D026 feature freeze remains active outside bounded authorized slices.

---

## Snapshot notes

- Active Git branch: `main` at `de6ef31` plus local uncommitted Writing A/B/C work.
- Live NLL: Opener + Story + LiA + Grammar + CLIL + Culture + Writing = **7 / 60 / 60 / 8**.
- Writing default serving remains resolver `sb_only`; Writing flag default-off.
