# General Curriculum Mapper — Progress

**Status:** ACTIVE
**Version:** 1.0
**Last updated:** Step 385
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** remains paused at 14/18 COMPLETE (D015).
- **D017–D027** are locked. D021 keeps preparation SB-first; D022 keeps the Neutral Lesson Package as the durable handoff; **D027** locks SS/SB/WB → NLL → NLP → adapters. Stage 3/4 work does not reopen D027.
- **D024 / D025 NLL pilot complete on `main`:** migration applied; persistent 1 / 9 / 9 / 2 seed and RLS verified.
- **D026 Batch 0** and audit evidence are on `main`. Stage 1–2 docs (D027 + roadmap) recorded.
- **Stage 3 complete (bounded):** owner-accepted default-off Opener NLL↔POC card comparison on `main`. Nine NLL summaries remain `hidden` + `experimental`. POC remains.
- **Stage 4 complete (bounded):** owner-accepted default-off Opener NLL → NLP (`derivedKnowledge`) → two-lesson General Lesson Plan on the authorized 16 paths. Automated verification and authenticated smoke passed. Successful Stage 4 output excludes experimental BI; legacy and failure-fallback paths preserve existing D022 BI behavior. Flag remains default-off and Opener-only. Nine NLL summaries remain `hidden` + `experimental`. No NLP persistence; no deployment; no visibility promotion; no POC retirement; no Stage 5 authorization. Local BE3 WB canonical absence remains a known limitation.

## In progress

- None for Stage 4. Feature freeze holds outside separately authorized slices.

## Next

- Do not deploy, promote NLL visibility, retire the POC, or authorize Stage 5–6 without separate approval.

## Blocked

- Stages 5–6 implementation not authorized.
- Production deployment remains deferred.
- Wider D026 feature freeze remains active outside bounded Stage 3/4 slices.
- Local BE3 WB canonical working copy still absent on this PC; do not reconcile here.

---

## Snapshot notes

- Active Git branch: `main`.
- Stage 4 is owner-accepted and authorized for commit/push of the 16 paths only.
- No database, Storage, migration, or canonical-data changes in Stage 4.
- Intentional UI copy: Prepare lesson plan button wording may remain as-is.
