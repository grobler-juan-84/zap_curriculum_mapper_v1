# General Curriculum Mapper — Progress

**Status:** ACTIVE
**Version:** 1.0
**Last updated:** Step 388
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** remains paused at 14/18 COMPLETE (D015).
- **D017–D027** are locked. D021 keeps preparation SB-first; D022 keeps the Neutral Lesson Package as the durable handoff; **D027** locks SS/SB/WB → NLL → NLP → adapters. Stage 3/4/5 work does not reopen D027.
- **D024 / D025 NLL pilot complete on `main`:** migration applied; persistent 1 / 9 / 9 / 2 seed and RLS verified.
- **D026 Batch 0** and audit evidence are on `main`. Stage 1–2 docs (D027 + roadmap) recorded.
- **Stage 3 complete (bounded):** owner-accepted default-off Opener NLL↔POC card comparison on `main`. Nine NLL summaries remain `hidden` + `experimental`. POC remains.
- **Stage 4 complete (bounded):** owner-accepted default-off Opener NLL → NLP (`derivedKnowledge`) → two-lesson General Lesson Plan on the authorized 16 paths. Automated verification and authenticated smoke passed. Successful Stage 4 output excludes experimental BI; legacy and failure-fallback paths preserve existing D022 BI behavior. Flag remains default-off and Opener-only. Nine NLL summaries remain `hidden` + `experimental`. No NLP persistence; no deployment; no visibility promotion; no POC retirement.
- **PC2 reconciliation complete and pushed:** the nine-file reconciliation/planning batch is on `main` at `1b0326f526feb69ac578eaae9b086373156df0d4`.
- **Stage 5 complete (bounded):** owner-accepted default-off Opener NLL → selected NLP → `renderChalkieFromNeutralPackage` behind `VITE_NLL_CHALKIE_ADAPTER_PILOT`. Automated verification 69/69 plus typecheck/lint; authenticated manual acceptance **A–F PASS** (2026-10-29). NLL summaries stay package-only; D022 BI, selection integrity, stale-result protection and existing canary/bespoke fallback preserved. Commit/push of the verified 14 Stage 5 paths authorized. No database, Storage, canonical, `.env.local`, deployment, NLL promotion, POC retirement, Story or Stage 6 changes.

## In progress

- None for Stage 5. Feature freeze otherwise holds outside separately authorized work.

## Next

- Hold deployment, NLL visibility promotion, POC/canary retirement, Stage 5 expansion, and Stage 6 until separately authorized.

## Blocked

- Stage 5 expansion and Stage 6 implementation are not authorized.
- Production deployment remains deferred.
- Wider D026 feature freeze remains active outside bounded Stage 3/4/5 slices.

---

## Snapshot notes

- Active Git branch: `main`.
- Stages 3–5 are owner-accepted bounded default-off Opener pilots and remain undeployed/unpromoted.
- No database, Storage, migration, or canonical-data changes in Stage 5.
- `data/phase1/big_english_3_wb/canonical/v1.json` exists on PC2; `data/phase1/` is gitignored, so this is local presence rather than tracked repository state.
- Intentional UI copy: Prepare lesson plan button wording may remain as-is.
