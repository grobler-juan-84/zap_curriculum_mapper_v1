# General Curriculum Mapper — Progress

**Status:** ACTIVE
**Version:** 1.0
**Last updated:** Step 375
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** remains paused at 14/18 COMPLETE (D015).
- **D017–D027** are locked. D021 keeps preparation SB-first; D022 keeps the Neutral Lesson Package as the durable handoff; **D027** locks SS/SB/WB → NLL → NLP → adapters.
- **D024 / D025 NLL pilot complete on `main`:** migration applied; persistent 1 / 9 / 9 / 2 seed and RLS verified; committed at `f8a86c7`.
- **D026 Batch 0 complete and pushed** at `c504fd7` (docs/orientation and operational safety). Audit brief + report preserved at `998e7f5`.
- **Stage 1 + Stage 2 recorded:** D027 architecture lock and `nll-migration-roadmap-v0.1.md` (Stages 3–6 planning only).
- Feature development remains frozen under D026. No runtime, database, Storage, canonical-data, or deployment changes in Stage 1.

## In progress

- Independent review of the uncommitted Stage 1 documentation diff.
- Production deployment remains deferred. NLL remains default-off / shadow; nine pilot summaries stay `hidden` + `experimental`.

## Next

- Owner review / explicit Git authorization for the Stage 1 docs commit when ready.
- Stages 3–6 remain unauthorized; Stage 3 card-comparison approach is recorded in the roadmap only (`VITE_CHALKIE_NLL_CARD_COMPARISON`, default off, side-by-side with POC fallback).

## Blocked

- Stages 3–6 implementation pending separate owner authorization and acceptance gates.
- Runtime cleanup and broader consolidation batches remain separately approved only.
- Local BE3 WB canonical working copy still absent on this PC; do not reconcile as part of architecture work.
- New features, deployment, production NLL integration, bulk enrichment, and UI redesign remain frozen.

---

## Snapshot notes

- Active Git branch: `main` (tip before this uncommitted Stage 1 work: `998e7f5`).
- D025 NLL: `f8a86c7`. D026 Batch 0: `c504fd7`. Audit evidence: `998e7f5`.
