# Phase 2 Experiment Protocol — BE1-SB Unit 1 Learning Requirements (Method Transfer Test)

**Status:** ACTIVE  
**Version:** 1.0  
**Date:** 2026-10-09  
**Experiment ID:** `P2-EXP-BE1-U01-v1`  
**Decisions:** D015, D016 (method continues experimental; BE1 is outside the D016 candidate set but allowed under D015 Big English Phase 2 scope)  
**Method baseline:** BE2 U6 v2 / U7 v1 / U8 v1 LR methodology — **apply as-is** for the initial pass  
**Purpose:** Test whether the Phase 2 Learning Requirements methodology transfers to Big English 1 without modifying the methodology or locking a schema.

---

## 1. Experiment identity

| Field | Value |
|---|---|
| Experiment ID | `P2-EXP-BE1-U01-v1` |
| Focus unit | BE1-SB Unit 1 — **Good Morning, Class!** |
| Focus catalog ID | `big_english_1_sb` |
| Focus unit ID | `bep1_unit_01` |
| Printed pages | 10–25 |
| Run status | **READY** |

---

## 2. Unit selection (brief)

| Candidate considered | Why not / why yes |
|---|---|
| U1 *Good Morning, Class!* | **Selected** — densest language inventory (15 language rows), full vocab + grammar + phonics + CLIL + culture + values spine, clear beginner communicative systems (object ID, possession, imperatives, politeness) |
| U4 / U5 / U9 | Strong alternatives; deferred to keep scope to one unit |
| U7 *Party Time* | Food overlap with BE2 U7 would confound “level transfer” vs “topic transfer” |

**Rationale:** Best single-unit stress test of beginner suitability and whether BE2-honed LR patterns assume intermediate language systems.

---

## 3. Research question

> Does the current Phase 2 LR methodology (as used on BE2 Units 6–8) transfer successfully to one complete Big English 1 unit, preserving evidence accuracy, observable LRs, and beginner-level suitability — without modifying the methodology?

---

## 4. Inputs

| Role | Source |
|---|---|
| Primary | `data/phase1/big_english_1_sb/canonical/v1.json` → `bep1_unit_01` |
| Secondary | `big_english_1_wb` Unit 1 | Corroborate only |
| Baseline | BE2 U6–U8 Phase 2 LR reviews |

Do not modify Phase 1 datasets, BE2 experiment artifacts, methodology, or JSON schema. Do not expand beyond this one BE1 unit. Do not push.

---

## 5. Methodology (as-is)

Same six dimensions, evidence tags, and refinements R-A–R-E as BE2 U7/U8.  
Evidence-led LR count. No invented objectives. Supporting ≠ optional.

---

## 6. Evaluation criteria (defined before results)

### Transfer baseline (same bars as U7/U8, IDs adapted)

| ID | Criterion |
|---|---|
| BE1-E1 | Accuracy |
| BE1-E2 | Traceability |
| BE1-E3 | Observability |
| BE1-E4 | Language interpretation |
| BE1-E5 | Learning progression |
| BE1-E6 | Evidence discipline |
| BE1-E7 | Consolidation |
| BE1-E8 | Teacher usefulness — report `PASS (AI-assessed) / teacher validation pending` only if AI clarity bar met |
| BE1-E9 | Scope discipline — no methodology/schema lock; no further BE1/BE6 units |

### Transfer / comparison criteria

| ID | Criterion |
|---|---|
| T1 | LR template compatibility with beginner unit |
| T2 | Core/supporting classification remains defensible |
| T3 | Evidence traceability maintained |
| T4 | Vocabulary classification + language-system coverage adequate |
| T5 | Progression + activity grouping remain effective |
| T6 | Beginner-level suitability (no inappropriate BE2 assumptions) |
| T7 | Distinguish methodological weakness vs normal content difference |

Labels for comparison notes: `REUSABLE_AS_IS` | `REUSABLE_WITH_ADAPTATION` | `INSUFFICIENT_EVIDENCE` | `METHOD_WEAKNESS` (experimental — NOT LOCKED).

---

## 7. Required outputs

1. This protocol.  
2. [`p2-exp-be1-u01-v1-review.md`](./p2-exp-be1-u01-v1-review.md) — LR dataset + evaluation + BE2 comparison + recommendations.

---

## Change log

| Date | Change |
|---|---|
| 2026-10-09 | Created BE1 U1 transfer-test protocol; criteria defined before execution. |
