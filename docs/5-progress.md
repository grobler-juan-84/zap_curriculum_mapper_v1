# General Curriculum Mapper — Progress

**Status:** ACTIVE
**Version:** 1.0
**Last updated:** Step 386
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** remains paused at 14/18 COMPLETE (D015).
- **D017–D027** are locked. D021 keeps preparation SB-first; D022 keeps the Neutral Lesson Package as the durable handoff; **D027** locks SS/SB/WB → NLL → NLP → adapters. Stage 3/4 work does not reopen D027.
- **D024 / D025 NLL pilot complete on `main`:** migration applied; persistent 1 / 9 / 9 / 2 seed and RLS verified.
- **D026 Batch 0** and audit evidence are on `main`. Stage 1–2 docs (D027 + roadmap) recorded.
- **Stage 3 complete (bounded):** owner-accepted default-off Opener NLL↔POC card comparison on `main`. Nine NLL summaries remain `hidden` + `experimental`. POC remains.
- **Stage 4 complete (bounded):** owner-accepted default-off Opener NLL → NLP (`derivedKnowledge`) → two-lesson General Lesson Plan on the authorized 16 paths. Automated verification and authenticated smoke passed. Successful Stage 4 output excludes experimental BI; legacy and failure-fallback paths preserve existing D022 BI behavior. Flag remains default-off and Opener-only. Nine NLL summaries remain `hidden` + `experimental`. No NLP persistence; no deployment; no visibility promotion; no POC retirement; no Stage 5 authorization.
- **PC2 reconciliation complete:** stale Stage 4 wording corrected; Stage 3/4 example flags explicitly default to `false`; the local BE3 WB canonical file is present but remains gitignored and untracked. A Stage 5 implementation brief is drafted for owner review only.

## In progress

- Stage 5 brief is awaiting owner review. Stage 5 implementation remains unauthorized; the feature freeze otherwise holds.

## Next

- Review the Stage 5 implementation brief and either revise it or explicitly authorize one bounded implementation slice. Until then, do not implement Stage 5, deploy, promote NLL visibility, retire the POC, or begin Stage 6.

## Blocked

- Stages 5–6 implementation not authorized.
- Production deployment remains deferred.
- Wider D026 feature freeze remains active outside bounded Stage 3/4 slices.

---

## Snapshot notes

- Active Git branch: `main`.
- Stage 4 is owner-accepted and authorized for commit/push of the 16 paths only.
- No database, Storage, migration, or canonical-data changes in Stage 4.
- `data/phase1/big_english_3_wb/canonical/v1.json` exists on PC2; `data/phase1/` is gitignored, so this is local presence rather than tracked repository state.
- The Stage 5 brief changes no application behavior and grants no implementation authorization.
- Intentional UI copy: Prepare lesson plan button wording may remain as-is.
