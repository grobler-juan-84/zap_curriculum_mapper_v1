# General Curriculum Mapper — Progress

**Status:** ACTIVE
**Version:** 1.0
**Last updated:** Step 406
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** remains paused at 14/18 COMPLETE (D015).
- **D017–D027** are locked. D021 keeps preparation SB-first; D022 keeps the Neutral Lesson Package as the durable handoff; **D027** locks SS/SB/WB → NLL → NLP → adapters.
- **Stages 3–5 / 6A / 6B** complete and owner-accepted where applicable; Opener and Story remain the two accepted reference implementations (default-off / undeployed).
- **LiA-A/B/C complete and owner-accepted:** default-off `VITE_NLL_CHALKIE_LIA_ADAPTER_PILOT`; undeployed; resolver `sb_only` default unchanged.
- **Grammar-A/B/C complete and owner-accepted:** live `be3-u08-grammar`; Grammar-B/C on `main` at `e99636c`; default-off `VITE_NLL_CHALKIE_GRAMMAR_ADAPTER_PILOT`; undeployed.
- **CLIL-A Step B applied / verified / owner-accepted under advance authorization:** migration `20261030170000` on `kivvmobjphtcgxoltqbc`; live totals **5 / 44 / 44 / 6**; history **24 recorded / 0 pending / 0 remote-only**; `be3-u08-clil-pe` draft `…000005`; eleven ordered memberships; eleven preferred hidden/experimental summaries; **zero** CLIL SS links; Opener/Story/LiA/Grammar unchanged.
- **CLIL-B/C implemented / automated verification passed / owner-accepted under advance authorization:** exact CLIL neutral package + five-artifact renderer; default-off `VITE_NLL_CHALKIE_CLIL_PE_ADAPTER_PILOT`; overlay stale-result guards and `sb_only` fallback; BI-absent; package-level NLL only. Undeployed/unpromoted; no commit/push in this step.

## In progress

- None. CLIL A/B/C complete within authorized bounds; next Unit 8 component work remains gated.

## Next

- Hold promotion, deployment, NLL visibility changes, flag-on defaults, and other Unit 8 component work until separately authorized.
- Separately authorize any CLIL commit/push if desired.
- Grant/RLS hardening for documented privilege supersets remains separately gated.

## Blocked

- NLL promotion and production deployment are not authorized.
- Broader `supabase db push` / `--include-all` remain unauthorized.
- Wider D026 feature freeze remains active outside bounded authorized slices.

---

## Snapshot notes

- Active Git branch: `main` at `e99636c` (Grammar-B/C). CLIL A/B/C work is local/uncommitted.
- Live NLL: Opener + Story + LiA + Grammar + CLIL = **5 / 44 / 44 / 6**.
- CLIL default serving remains resolver `sb_only`; flag-off behavior unchanged.
