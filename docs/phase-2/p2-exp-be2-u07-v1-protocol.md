# Phase 2 Experiment Protocol — BE2-SB Unit 7 Learning Requirements + Method Generalization

**Status:** ACTIVE  
**Version:** 1.0  
**Date:** 2026-10-09  
**Experiment ID:** `P2-EXP-BE2-U07-v1`  
**Decisions:** D015, D016  
**Builds on:** [`p2-exp-be2-u06-v2-protocol.md`](./p2-exp-be2-u06-v2-protocol.md) / [`p2-exp-be2-u06-v2-review.md`](./p2-exp-be2-u06-v2-review.md) (owner-accepted methodology with refinements; **not** a locked Phase 2 spec)  
**Purpose:** Test whether the refined Unit 6 learning-requirements method generalizes to Unit 7 (*My Favorite Food*) without forcing U6-specific categories. Does **not** lock schema, architecture, or implementation.

---

## 1. Experiment identity

| Field | Value |
|---|---|
| Experiment ID | `P2-EXP-BE2-U07-v1` |
| Focus unit | BE2-SB Unit 7 — **My Favorite Food** |
| Focus catalog ID | `big_english_2_sb` |
| Focus unit ID | `bep2_unit_07` |
| Printed / PDF pages | 112–127 |
| Run status | **EXECUTED** — review artifact [`p2-exp-be2-u07-v1-review.md`](./p2-exp-be2-u07-v1-review.md) awaiting owner review |

---

## 2. Research question

> Can the refined Unit 6 interpretation methodology be applied to BE2-SB Unit 7 while preserving evidence accuracy, observable learning requirements, and practical teacher usefulness, **without forcing Unit 7 into Unit 6-specific categories**?

Secondary questions:

1. Which Unit 6 analytical dimensions transfer as-is vs need adaptation?
2. What Unit 7-specific language systems (e.g. countability, offers) require new LR shapes?
3. Which comparison outcomes are `REUSABLE_AS_IS`, `REUSABLE_WITH_ADAPTATION`, `INSUFFICIENT_EVIDENCE`, or `METHOD_WEAKNESS`?

---

## 3. Inputs and authority

| Role | Catalog / path | Use |
|---|---|---|
| Primary | `big_english_2_sb` → `data/phase1/big_english_2_sb/canonical/v1.json` | Authoritative SB evidence for `bep2_unit_07` |
| Secondary | `big_english_2_wb` Unit 7 | Corroborate/clarify only |
| Method context | U6 v2 protocol + review | Reuse dimensions & tags; do not copy U6 LRs |
| Optional | U6 v1 review | Method context only |
| BE1/BE3 | — | Not required for this generalization run |

Respect D001, D015, D016. Do not modify Phase 1 datasets, completed U6 artifacts’ substance, or locked decisions. Do not begin Unit 8.

---

## 4. Working refinements (owner-approved for experimentation)

| ID | Refinement |
|---|---|
| R-A | Missing I Can / objectives → `MISSING_EVIDENCE`; continue; do not invent wording or reopen Phase 1 |
| R-B | Core/supporting = `AI_INTERPRETATION`; supporting ≠ optional |
| R-C | Distinguish listed target vocab vs story/song/text-only exposure |
| R-D | Teacher synthesis = AI self-assessed usefulness; validation pending |
| R-E | Keep U6 dimensions/tags; allow justified U7-specific structures; document departures |

---

## 5. Interpretation dimensions

Same broad set as U6 v2: **A** Observable LRs · **B** Grammar/functions · **C** Vocabulary · **D** Skills/activity purpose · **E** Difficulties (3 categories) · **F** Core vs supporting.

Plus mandatory **Unit 6 vs Unit 7 methodology comparison** (§8).

Evidence tags (experimental — NOT LOCKED):  
`BOOK_EVIDENCE` | `AI_INTERPRETATION` | `UNCERTAIN` | `MISSING_EVIDENCE` | `AI_PREDICTED_DIFFICULTY` | `TEACHER_CONFIRMED_DIFFICULTY`

Temporary tables: `EXPERIMENT_SKETCH — NOT LOCKED`.

---

## 6. Evaluation criteria (defined before results)

### Baseline (comparable to U6 v2)

| ID | Criterion | Pass condition |
|---|---|---|
| U7-E1 | Accuracy | LRs consistent with cited SB/WB evidence; no invented objectives |
| U7-E2 | Traceability | Material claims cite entity IDs or printed pages |
| U7-E3 | Observability | Core LRs are recognizable performances |
| U7-E4 | Language interpretation | Grammar, vocab, functions distinguished and evidenced |
| U7-E5 | Learning progression | Recognition / guided / production-*opportunity* where supported; no mastery overclaim |
| U7-E6 | Evidence discipline | Tags separate facts, interpretation, uncertainty, difficulty hypotheses |
| U7-E7 | Consolidation | Shared LRs with multiple refs; important distinctions kept |
| U7-E8 | Teacher usefulness | Concise synthesis clear/practical as **AI self-assessment**; report teacher validation as **pending** (lack of teacher review is not a fabricated FAIL if AI clarity bar is met) |
| U7-E9 | Scope discipline | No schema/architecture lock; no Unit 8 start |

### Generalization (new)

| ID | Criterion | Pass condition |
|---|---|---|
| G1 | Methodological transferability | U6 dimensions meaningfully applied to U7 |
| G2 | Adaptation discipline | Departures justified by U7 evidence, documented |
| G3 | Comparative insight | Concrete reusable practices, limitations, improvements identified |
| G4 | Non-forced interpretation | U7 content determines LRs/priorities/structure (not copy of U6 time/routines frame) |

Results: **PASS** / **PARTIAL** / **FAIL** with evidence. Do not PASS for section existence alone.

Comparison labels per dimension (experimental — NOT LOCKED):  
`REUSABLE_AS_IS` | `REUSABLE_WITH_ADAPTATION` | `INSUFFICIENT_EVIDENCE` | `METHOD_WEAKNESS`

---

## 7. Required outputs

1. This protocol.  
2. Review: [`p2-exp-be2-u07-v1-review.md`](./p2-exp-be2-u07-v1-review.md) with sections 1–12 as specified by the owner prompt (including comparison table + Unit 8 recommendations).

---

## 8. Working procedure

1. Inventory U7 language, vocab, components, activities, continuous text.  
2. Synthesize LRs (evidence determines count — not forced to 12).  
3. Apply refinements R-A–R-E.  
4. Write teacher-facing synthesis.  
5. Evaluate U7-E1–E9 and G1–G4.  
6. Compare to U6 v2; document adaptations/weaknesses with five-part notes where needed.  
7. Propose Unit 8 refinements; **do not start U8**.  
8. Update trackers; local commit; no push.

---

## Change log

| Date | Change |
|---|---|
| 2026-10-09 | Created U7 protocol with baseline + generalization criteria before execution. |
| 2026-10-09 | First run executed; status → EXECUTED (criteria unchanged). |
