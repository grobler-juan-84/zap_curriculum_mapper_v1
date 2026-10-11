# Phase 2 Experiment Status

**Status:** ACTIVE  
**Version:** 1.1  
**Date:** 2026-10-11  
**Purpose:** Living inventory of Phase 2 experiment lineages. Early LR experiments remain historical. Current active lineage is V3.1 unit linguistic analysis + cross-unit connection experiments on BE2-SB. Does **not** lock a Phase 2 methodology, JSON schema, storage model, or product implementation.

---

## 1. Current state

| Item | State |
|---|---|
| Git branch | `phase-2` |
| Phase 1 | PAUSED at 14/18 COMPLETE (D015) |
| Active unit prompt | V3.1 — [`phase2-v3.1-prompt.md`](./phase2-v3.1-prompt.md) |
| Preferred cross-unit prompt | V1.2 connections-only — [`cross-unit-v1.2-prompt.md`](./cross-unit-v1.2-prompt.md) |
| Methodology / schema | **Experimental — NOT LOCKED** (D017) |
| Detailed V3.1 + cross-unit validation | [`p2-exp-be2-v3.1-cross-unit-status.md`](./p2-exp-be2-v3.1-cross-unit-status.md) |

---

## 2. Active lineage — V3.1 + cross-unit (BE2-SB)

| Artifact | Location | Outcome |
|---|---|---|
| BE2 U1 V3.1 | `data/phase2/big_english_2_sb/interpretations/be2-sb-u01-v3.1.json` | Valid unit SoT |
| BE2 U6 V3.1 | `data/phase2/big_english_2_sb/interpretations/be2-sb-u06-v3.1.json` | Valid unit SoT |
| BE2 U8 V3.1 | `data/phase2/big_english_2_sb/interpretations/be2-sb-u08-v3.1.json` | Valid unit SoT |
| Cross-unit V1.1 | `data/phase2/big_english_2_sb/cross-unit/be2-cross-unit-v1.1.json` | Historical consolidation shape |
| Cross-unit V1.2 (filename) | `data/phase2/big_english_2_sb/cross-unit/be2-cross-unit-v1.2.json` | **Preserved but mislabeled** — byte-identical to V1.1; not a true connections-only run |

**Unit JSON remains SoT.** Cross-unit files must not silently rewrite unit IDs or findings.

---

## 3. Historical lineage — early LR experiments (preserved)

| Experiment ID | Focus | Artifact | Outcome (summary) |
|---|---|---|---|
| `P2-EXP-BE2-U06-v1` | BE2 U6 relationships | [`p2-exp-be2-u06-v1-review.md`](./p2-exp-be2-u06-v1-review.md) | Prior/future candidates + evidence discipline |
| `P2-EXP-BE2-U06-v2` | BE2 U6 learning requirements | [`p2-exp-be2-u06-v2-review.md`](./p2-exp-be2-u06-v2-review.md) | Observable LR method established |
| `P2-EXP-BE2-U07-v1` | BE2 U7 LRs + generalization | [`p2-exp-be2-u07-v1-review.md`](./p2-exp-be2-u07-v1-review.md) | Method reusable with unit-native adaptations |
| `P2-EXP-BE2-U08-v1` | BE2 U8 LRs + three-unit compare | [`p2-exp-be2-u08-v1-review.md`](./p2-exp-be2-u08-v1-review.md) | D016 candidate set LR runs complete |
| `P2-EXP-BE1-U01-v1` | BE1 U1 LR transfer test | [`p2-exp-be1-u01-v1-review.md`](./p2-exp-be1-u01-v1-review.md) | Method transfers to beginner unit; no `METHOD_WEAKNESS` |

Supporting selection/protocol docs: [`be2-candidate-units.md`](./be2-candidate-units.md), [`be2-unit-6-experiment-protocol.md`](./be2-unit-6-experiment-protocol.md), and matching `p2-exp-*-protocol.md` files.

---

## 4. What carries forward

- Verified Phase 1 Big English datasets (local / Storage).
- V3.1 unit interpretations as current experimental unit SoT for BE2 U1/U6/U8.
- Cross-Unit V1.2 **prompt** as preferred connections approach for the next genuine cross-unit run.
- Evidence discipline: do not invent IDs; do not silently accept prior consolidation claims.
- Unresolved: true V1.2 connections JSON; teacher validation of earlier “one glance” syntheses; end-to-end later-phase influence experiment.

---

## 5. Explicit non-claims

- Phase 2 is **not** product-complete.
- No Phase 2 JSON schema or pipeline is approved.
- Cross-unit V1.2 filename on disk is **not** proof that connections-only methodology succeeded.
- Whole-book scale-up is deferred until end-to-end usefulness is tested.

---

## Change log

| Date | Change |
|---|---|
| 2026-10-09 | Created preservation snapshot before pushing `phase-2` and branching `phase-3`. |
| 2026-10-11 | Expanded to V3.1 + cross-unit lineage; linked validation status; kept early LR experiments as history. |
