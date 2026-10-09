# Phase 2 Experiment Protocol — BE2-SB Unit 8 Learning Requirements + Three-Unit Comparison

**Status:** ACTIVE  
**Version:** 1.0  
**Date:** 2026-10-09  
**Experiment ID:** `P2-EXP-BE2-U08-v1`  
**Decisions:** D015, D016  
**Method baseline:** Unit 7 v1 ([`p2-exp-be2-u07-v1-protocol.md`](./p2-exp-be2-u07-v1-protocol.md) / [`p2-exp-be2-u07-v1-review.md`](./p2-exp-be2-u07-v1-review.md)); Unit 6 v2 retained for comparison  
**Purpose:** Apply the Unit 7 interpretation methodology consistently to Unit 8 (*Wild Animals*) and compare methodological performance across Units 6, 7, and 8. Does **not** lock schema, architecture, or methodology.

**Owner direction:** Repeat the Unit 7 method (no new mandatory steps; no extra specialized criteria; no predetermined LR count).

---

## 1. Experiment identity

| Field | Value |
|---|---|
| Experiment ID | `P2-EXP-BE2-U08-v1` |
| Focus unit | BE2-SB Unit 8 — **Wild Animals** |
| Focus catalog ID | `big_english_2_sb` |
| Focus unit ID | `bep2_unit_08` |
| Printed / PDF pages | 128–143 (verified from canonical) |
| Run status | **EXECUTED** — review artifact [`p2-exp-be2-u08-v1-review.md`](./p2-exp-be2-u08-v1-review.md) awaiting owner review |

---

## 2. Research questions

**Primary:** Can the Unit 7 interpretation methodology be applied consistently to BE2 Unit 8, and what does a comparison across Units 6, 7, and 8 reveal about its generalizability?

**Secondary:**

1. Does the observable-LR approach work for Unit 8?  
2. Can existing analytical dimensions represent Unit 8’s language accurately?  
3. Which elements remain reusable across all three units?  
4. Which require evidence-justified adaptation?  
5. Are there limitations not visible in Units 6–7?

Do not force a positive generalization outcome.

---

## 3. Inputs and authority

| Role | Source | Use |
|---|---|---|
| Primary | `data/phase1/big_english_2_sb/canonical/v1.json` → `bep2_unit_08` | Authoritative SB |
| Secondary | `big_english_2_wb` Unit 8 | Corroborate only |
| Method | U7 v1 protocol/review | Procedural baseline |
| Comparison | U6 v2 + U7 v1 reviews | Three-unit comparison |
| Optional | U6 v1 | Context only |

Respect D001, D015, D016. Do not modify Phase 1 datasets or completed U6/U7 experiment substance. Do not begin another unit after U8. Do not push.

---

## 4. Scope and exclusions

**In scope:** U8 LR interpretation using U7 dimensions/tags/refinements; three-unit methodology comparison; predefined evaluation.

**Out of scope:** New experimental methodology; mandatory language-systems inventory as a new standalone step; extra specialized eval criteria beyond U7 baseline + G1–G4; changing core/supporting rules; locking Phase 2 schema/architecture; Phase 3; pushing to remote.

---

## 5. Carried-forward methodology

### Dimensions

1. Observable learning requirements  
2. Grammar and communicative functions  
3. Vocabulary and expected use  
4. Skills and activity purposes  
5. Potential learner difficulties  
6. Core versus supporting learning  

Plus **three-unit methodology comparison**.

### Evidence tags (experimental — NOT LOCKED)

`BOOK_EVIDENCE` | `AI_INTERPRETATION` | `UNCERTAIN` | `MISSING_EVIDENCE` | `AI_PREDICTED_DIFFICULTY` | `TEACHER_CONFIRMED_DIFFICULTY`

Temporary tables: `EXPERIMENT_SKETCH — NOT LOCKED`.

### Refinements R-A–R-E

| ID | Rule |
|---|---|
| R-A | Missing I Can/objectives → `MISSING_EVIDENCE`; continue |
| R-B | Core/supporting = AI interpretation; supporting ≠ optional |
| R-C | Listed targets vs text-only exposure default |
| R-D | Teacher synthesis AI-assessed; validation pending |
| R-E | Shared dimensions; unit-specific structures only when evidenced; do not copy U6 clocks or U7 food frames into U8 |

Evidence determines LR count. Verify *can/can’t*, adjective order, etc. against canonical data before treating as targets.

---

## 6. Evaluation criteria (defined before results)

### Baseline (Unit 7 pass conditions, unit IDs adapted)

| ID | Criterion | Pass condition |
|---|---|---|
| U8-E1 | Accuracy | LRs consistent with cited SB/WB evidence; no invented objectives |
| U8-E2 | Traceability | Material claims cite entity IDs or printed pages |
| U8-E3 | Observability | Core LRs are recognizable performances |
| U8-E4 | Language interpretation | Grammar, vocab, functions distinguished and evidenced |
| U8-E5 | Learning progression | Recognition / guided / production-*opportunity* where supported; no mastery overclaim |
| U8-E6 | Evidence discipline | Tags separate facts, interpretation, uncertainty, difficulty hypotheses |
| U8-E7 | Consolidation | Shared LRs with multiple refs; important distinctions kept |
| U8-E8 | Teacher usefulness | Concise synthesis clear/practical as AI self-assessment; if that bar is met report **`PASS (AI-assessed) / teacher validation pending`**; else PARTIAL/FAIL |
| U8-E9 | Scope discipline | No schema/architecture/methodology lock; no further unit experiment started in this run |

### Generalization

| ID | Criterion | Pass condition |
|---|---|---|
| G1 | Methodological transferability | U7 dimensions meaningfully applied to U8 |
| G2 | Adaptation discipline | Departures justified by U8 evidence, documented |
| G3 | Comparative insight | Concrete reusable practices, limitations, improvements across 6/7/8 |
| G4 | Non-forced interpretation | U8 content determines LRs (not U6 time or U7 food frames) |

Results: **PASS** / **PARTIAL** / **FAIL** with evidence.

Comparison labels (experimental — NOT LOCKED):  
`REUSABLE_AS_IS` | `REUSABLE_WITH_ADAPTATION` | `INSUFFICIENT_EVIDENCE` | `METHOD_WEAKNESS`

---

## 7. Required outputs

1. This protocol.  
2. [`p2-exp-be2-u08-v1-review.md`](./p2-exp-be2-u08-v1-review.md) with sections 1–14 as specified by the owner prompt.

---

## 8. Execution procedure

1. Inventory U8 language, vocab, components, activities, continuous text (+ optional WB).  
2. Synthesize LRs (evidence-led count).  
3. Apply R-A–R-E; write teacher-facing synthesis.  
4. Evaluate U8-E1–E9 and G1–G4.  
5. Compare Units 6, 7, 8; distinguish findings across all three vs fewer units.  
6. Update trackers; local commit on `phase-2`; **do not push**.

---

## Change log

| Date | Change |
|---|---|
| 2026-10-09 | Created U8 protocol (repeat U7 method; criteria defined before execution). |
| 2026-10-09 | First run executed; status → EXECUTED (criteria unchanged). |
