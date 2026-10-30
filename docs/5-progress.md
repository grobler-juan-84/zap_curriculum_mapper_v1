# General Curriculum Mapper — Progress

**Status:** ACTIVE
**Version:** 1.0
**Last updated:** Step 413
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** remains paused at 14/18 COMPLETE (D015).
- **D017–D028** are locked. D021 keeps preparation SB-first; D022 keeps the Neutral Lesson Package as the durable handoff; **D027** locks SS/SB/WB → NLL → NLP → adapters; **D028** locks Values as generic `sb_only` with no specialized NLL/A/B/C.
- **Stages 3–5 / 6A / 6B** complete and owner-accepted where applicable; Opener and Story remain the two accepted reference implementations (default-off / undeployed).
- **LiA / Grammar / CLIL / Culture / Writing / Phonics / Review A/B/C** complete and owner-accepted under advance authorization for Unit 8.
- Writing checkpointed on `main` at `cbd4d3a`; Phonics+Review apply + B/C implemented locally (uncommitted).
- Live NLL **9 / 74 / 74 / 9**; history **28 / 0 / 0**.
- **Values** remains D028 generic `sb_only` (no NLL component / specialized code).
- Unit 8 automated matrix **334/334**; typecheck pass; lint warnings only.

## In progress

- None for further Unit 8 component implementation. Real Create-a-prompt workflow validation still pending.

## Next

- Hold promotion, deployment, NLL visibility changes, and flag-on defaults.
- Separately authorize commit/push of Phonics+Review remainder work if desired.
- Owner/manual Create-a-prompt smoke validation across Unit 8 components when ready.

## Blocked

- NLL promotion and production deployment are not authorized.
- Broader `supabase db push` / `--include-all` remain unauthorized.
- Wider D026 feature freeze remains active outside bounded authorized slices.

---

## Snapshot notes

- Active Git branch: `main` at `cbd4d3a` plus local uncommitted Phonics/Review apply evidence + B/C implementation.
- Live components: Opener + Story + LiA + Grammar + CLIL + Culture + Writing + Phonics + Review.
- Default-off flags: `VITE_NLL_CHALKIE_PHONICS_ADAPTER_PILOT`, `VITE_NLL_CHALKIE_REVIEW_ADAPTER_PILOT` (and prior component flags).
- Resolver default and failure fallback remain **`sb_only`**.
- **BE3 UNIT 8 COMPONENT PIPELINE COMPLETE / VALUES GENERIC PATH RETAINED** — pending real workflow validation and any commit gate.
