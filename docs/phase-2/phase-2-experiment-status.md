# Phase 2 Experiment Status — Preservation Snapshot

**Status:** ACTIVE  
**Version:** 1.0  
**Date:** 2026-10-09  
**Purpose:** Record that controlled Phase 2 Big English interpretation experiments are **complete enough to preserve on GitHub** before branching into Phase 3. This does **not** lock a Phase 2 methodology, JSON schema, storage model, or product implementation.

---

## 1. Preservation intent

| Item | State |
|---|---|
| Git branch | `phase-2` (preserve on origin before Phase 3 work) |
| Phase 1 | Still PAUSED at 14/18 COMPLETE (D015) |
| Phase 2 methodology / schema | **Experimental — NOT LOCKED** |
| Owner teacher validation | Still pending |

---

## 2. Experiment inventory

| Experiment ID | Focus | Artifact | Outcome (summary) |
|---|---|---|---|
| `P2-EXP-BE2-U06-v1` | BE2 U6 relationships | [`p2-exp-be2-u06-v1-review.md`](./p2-exp-be2-u06-v1-review.md) | Prior/future candidates + evidence discipline |
| `P2-EXP-BE2-U06-v2` | BE2 U6 learning requirements | [`p2-exp-be2-u06-v2-review.md`](./p2-exp-be2-u06-v2-review.md) | Observable LR method established |
| `P2-EXP-BE2-U07-v1` | BE2 U7 LRs + generalization | [`p2-exp-be2-u07-v1-review.md`](./p2-exp-be2-u07-v1-review.md) | Method reusable with unit-native adaptations |
| `P2-EXP-BE2-U08-v1` | BE2 U8 LRs + three-unit compare | [`p2-exp-be2-u08-v1-review.md`](./p2-exp-be2-u08-v1-review.md) | D016 candidate set LR runs complete |
| `P2-EXP-BE1-U01-v1` | BE1 U1 LR transfer test | [`p2-exp-be1-u01-v1-review.md`](./p2-exp-be1-u01-v1-review.md) | Method transfers to beginner unit; no `METHOD_WEAKNESS` |

Supporting selection/protocol docs: [`be2-candidate-units.md`](./be2-candidate-units.md), [`be2-unit-6-experiment-protocol.md`](./be2-unit-6-experiment-protocol.md), and the matching `p2-exp-*-protocol.md` files.

---

## 3. What carries forward into Phase 3

- Verified Phase 1 Big English datasets (local / Storage).
- Phase 2 LR and relationship experiment artifacts as **inputs**, tagged as interpretation (D001 boundary preserved).
- Evidence-tag discipline (`BOOK_EVIDENCE` / `AI_INTERPRETATION` / `UNCERTAIN` / `MISSING_EVIDENCE`).
- Unresolved: teacher validation; any formal methodology/schema lock.

---

## 4. Explicit non-claims

- Phase 2 is **not** declared product-complete.
- No Phase 2 JSON schema or pipeline is approved.
- Branching to Phase 3 does not close or invalidate Phase 2 review questions.

---

## Change log

| Date | Change |
|---|---|
| 2026-10-09 | Created preservation snapshot before pushing `phase-2` and branching `phase-3`. |
