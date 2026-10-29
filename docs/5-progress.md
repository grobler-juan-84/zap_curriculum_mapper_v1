# General Curriculum Mapper — Progress

**Status:** ACTIVE
**Version:** 1.0
**Last updated:** Step 380
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** remains paused at 14/18 COMPLETE (D015).
- **D017–D027** are locked. D021 keeps preparation SB-first; D022 keeps the Neutral Lesson Package as the durable handoff; **D027** locks SS/SB/WB → NLL → NLP → adapters (D027 / Stage 2 roadmap did not themselves authorize Stage 3). Stage 3 acceptance does not reopen or supersede D027.
- **D024 / D025 NLL pilot complete on `main`:** migration applied; persistent 1 / 9 / 9 / 2 seed and RLS verified.
- **D026 Batch 0** and audit evidence are on `main`. Stage 1–2 docs (D027 + roadmap) recorded.
- **Stage 3 complete (bounded):** authenticated smoke passed; **owner accepted** the default-off Opener NLL↔POC card-comparison slice. Nine NLL summaries remain `hidden` + `experimental` (not available for normal use). POC remains in place. This is not NLL promotion and not POC retirement.

## In progress

- None for Stage 3. Hold for separate authorization before Stages 4–6, deployment, visibility promotion, or POC retirement.

## Next

- Do not authorize Stages 4–6, deploy, promote NLL visibility, or retire the POC without separate explicit approval.
- Keep `VITE_CHALKIE_NLL_CARD_COMPARISON` and enrichment POC flags default-off in shared environments.

## Blocked

- Stages 4–6 implementation not authorized.
- Production deployment remains deferred.
- Wider D026 feature freeze remains active outside the completed Stage 3 slice.
- Local BE3 WB canonical working copy still absent on this PC; do not reconcile as part of Stage 3.

---

## Snapshot notes

- Active Git branch: `main`.
- Stage 3 acceptance authorizes commit/push of the verified 13-path implementation only.
- No database, Storage, migration, or canonical-data changes in Stage 3.
