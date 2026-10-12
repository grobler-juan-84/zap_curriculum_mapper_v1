# Phase 2 Experiment Status

**Status:** ACTIVE  
**Version:** 1.2  
**Date:** 2026-10-12  
**Purpose:** Living inventory of Phase 2 experiment lineages. Early LR, V3.1, cross-unit, e2e, and enrichment work remain **historical research evidence** (D017 principle 4). Active direction is Progressive Curriculum Intelligence (D017): minimum-sufficient Book Intelligence. Does **not** lock a Phase 2 methodology, JSON schema, storage model, or product implementation.

---

## 1. Current state

| Item | State |
|---|---|
| Git branch | `phase-2` |
| Phase 1 | PAUSED at 14/18 COMPLETE (D015) |
| Active direction | D017 Progressive Curriculum Intelligence — Book Intelligence first |
| Next proposed experiment | BE2-SB Units 1–9 concise whole-book overview (awaiting owner execution approval) |
| Methodology / schema | **Experimental — NOT LOCKED** |
| Research inventory (V3.1 + cross-unit) | [`p2-exp-be2-v3.1-cross-unit-status.md`](./p2-exp-be2-v3.1-cross-unit-status.md) |

---

## 2. Next proposed experiment (not started)

**Big English 2 Student Book, Units 1–9:** Generate a concise Phase 2 book overview from existing verified Phase 1 data. Use the publisher curriculum overview as a density benchmark, not a fixed schema. Preserve evidence references; distinguish publisher-stated from AI-inferred outcomes.

**Evaluate:** (1) accuracy against textbook evidence; (2) teacher readability and usefulness; (3) sufficiency for an initial BE1 → BE2 → BE3 vertical mapping test.

Do **not** execute until the owner explicitly approves.

---

## 3. Historical research — V3.1 + cross-unit (BE2-SB)

Preserved research artifacts; **not** the active production direction under D017.

| Artifact | Location | Outcome |
|---|---|---|
| BE2 U1 V3.1 | `data/phase2/big_english_2_sb/interpretations/be2-sb-u01-v3.1.json` | Research unit analysis |
| BE2 U6 V3.1 | `data/phase2/big_english_2_sb/interpretations/be2-sb-u06-v3.1.json` | Research unit analysis |
| BE2 U8 V3.1 | `data/phase2/big_english_2_sb/interpretations/be2-sb-u08-v3.1.json` | Research unit analysis |
| Cross-unit V1.1 | `data/phase2/big_english_2_sb/cross-unit/be2-cross-unit-v1.1.json` | Historical consolidation shape |
| Cross-unit V1.2 | `data/phase2/big_english_2_sb/cross-unit/be2-cross-unit-v1.2.json` | Connections-only research run (8 multi-unit links) |

---

## 4. Historical research — early LR experiments

| Experiment ID | Focus | Artifact | Outcome (summary) |
|---|---|---|---|
| `P2-EXP-BE2-U06-v1` | BE2 U6 relationships | [`p2-exp-be2-u06-v1-review.md`](./p2-exp-be2-u06-v1-review.md) | Prior/future candidates + evidence discipline |
| `P2-EXP-BE2-U06-v2` | BE2 U6 learning requirements | [`p2-exp-be2-u06-v2-review.md`](./p2-exp-be2-u06-v2-review.md) | Observable LR method established |
| `P2-EXP-BE2-U07-v1` | BE2 U7 LRs + generalization | [`p2-exp-be2-u07-v1-review.md`](./p2-exp-be2-u07-v1-review.md) | Method reusable with unit-native adaptations |
| `P2-EXP-BE2-U08-v1` | BE2 U8 LRs + three-unit compare | [`p2-exp-be2-u08-v1-review.md`](./p2-exp-be2-u08-v1-review.md) | D016 candidate set LR runs complete |
| `P2-EXP-BE1-U01-v1` | BE1 U1 LR transfer test | [`p2-exp-be1-u01-v1-review.md`](./p2-exp-be1-u01-v1-review.md) | Method transfers to beginner unit |

---

## 5. Historical research — later-phase influence probes

| Experiment ID | Focus | Artifact | Outcome (summary) |
|---|---|---|---|
| `P2-EXP-BE2-U06-E2E-v1` | Teacher brief A/B | [`p2-exp-be2-u06-e2e-v1/`](./p2-exp-be2-u06-e2e-v1/) | Curriculum-informed brief modestly more useful |
| `P4-EXP-BE2-U06-ENRICH-v1` | Enrichment A/B | [`../phase-4/p4-exp-be2-u06-enrich-v1/`](../phase-4/p4-exp-be2-u06-enrich-v1/) | Phase 2 did not change the three enrichment decisions |

---

## 6. What carries forward

- Verified Phase 1 Big English datasets (local / Storage).
- D017 progressive method: minimum sufficient output; expand only when downstream tests require it.
- Research artifacts above as evidence, not mandatory production depth.
- Soft open item: teacher validation of earlier “one glance” syntheses / connection usefulness.

---

## 7. Explicit non-claims

- Phase 2 is **not** product-complete.
- No Phase 2 JSON schema or pipeline is approved.
- Historical V3.1 / V1.2 success does **not** lock methodology or define production output.
- The BE2 U1–9 book overview is **proposed only** until owner execution approval.
- Phase 3 / Phase 4 are **not** formally started.

---

## Change log

| Date | Change |
|---|---|
| 2026-10-09 | Created preservation snapshot before pushing `phase-2` and branching `phase-3`. |
| 2026-10-11 | Expanded to V3.1 + cross-unit lineage; linked validation status; kept early LR experiments as history. |
| 2026-10-11 | Recorded true Cross-Unit V1.2 connections JSON after owner update (replacing earlier mislabeled duplicate). |
| 2026-10-12 | Aligned to D017 Progressive Curriculum Intelligence; V3.1/V1.2/e2e/enrich marked research history; next proposed = BE2-SB U1–9 book overview (awaiting approval). |
