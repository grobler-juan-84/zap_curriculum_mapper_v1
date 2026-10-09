# Phase 2 Experiment Protocol — BE2-SB Unit 6 Learning Requirements (v2)

**Status:** ACTIVE  
**Version:** 1.0  
**Date:** 2026-10-09  
**Experiment ID:** `P2-EXP-BE2-U06-v2`  
**Decisions:** D015, D016  
**Related prior experiment:** [`be2-unit-6-experiment-protocol.md`](./be2-unit-6-experiment-protocol.md) / [`p2-exp-be2-u06-v1-review.md`](./p2-exp-be2-u06-v1-review.md)  
**Purpose:** Bound a second controlled Phase 2 experiment that asks whether AI can interpret Phase 1 textbook evidence into accurate, observable, teacher-useful **learning requirements** for one unit. Does **not** lock a Phase 2 schema, prompt, storage model, API, or implementation.

---

## 1. Experiment identity

| Field | Value |
|---|---|
| Experiment ID | `P2-EXP-BE2-U06-v2` |
| Focus unit | BE2-SB Unit 6 — **My Day** |
| Focus catalog ID | `big_english_2_sb` |
| Focus unit ID | `bep2_unit_06` |
| Printed pages | 90–105 |
| Relationship to v1 | Same focus unit; **different research question** (learning requirements, not cross-book mapping) |
| Run status | **EXECUTED** — review artifact [`p2-exp-be2-u06-v2-review.md`](./p2-exp-be2-u06-v2-review.md) awaiting owner review |

---

## 2. Research question

> Can AI interpret BE2-SB Unit 6 textbook evidence into a coherent set of learning requirements that accurately describes what students should know, understand, and be able to do — including language forms/functions, how activities develop those abilities, core vs supporting requirements, and plausible learner difficulties — while remaining clearly tagged as evidence vs interpretation?

Secondary questions:

1. Which abilities are concrete enough that a teacher could recognize them in student performance?
2. Where does the book support recognition, guided practice, or independent-production *opportunity* (without claiming mastery)?
3. Which difficulty statements are general language hypotheses vs Korean-EFL linguistic hypotheses vs (if any) teacher-confirmed evidence?
4. What methodological gaps would block treating this interpretation pattern as reusable Phase 2 method?

---

## 3. Inputs and authority

### Primary (required)

| Role | Catalog ID | Local path |
|---|---|---|
| Focus SB | `big_english_2_sb` | `data/phase1/big_english_2_sb/canonical/v1.json` |

### Secondary (optional corroboration)

| Role | Catalog ID | Use |
|---|---|---|
| Focus WB | `big_english_2_wb` | Corroborate or clarify expectations only |
| v1 review | [`p2-exp-be2-u06-v1-review.md`](./p2-exp-be2-u06-v1-review.md) | Context only; not a substitute for Phase 1 JSON |
| BE1 / BE3 | completed canonicals | Only if a prior/future link **materially clarifies** a requirement; no full remapping |

### Authority rules

- Current repository + Phase 1 canonical JSON are authoritative.
- D001: Phase 1 remains extract-only; interpretation is separable.
- D015 / D016: Big English Phase 2 experiments; BE2 U6 remains in the approved candidate set.
- Do not modify Phase 1 datasets, v1 experiment substance, or locked decisions.

---

## 4. In scope / out of scope

### In scope

- Observable learning requirements for Unit 6.
- Grammar/function, vocabulary clusters, activity purpose, core vs supporting.
- Potential learner difficulties with mandatory category separation.
- Page/activity → unit synthesis with experimental evidence tags.
- Honest evaluation against the criteria in §7 **defined before** results.

### Out of scope

- Locking Phase 2 JSON schema, prompts, DB, API, or product UI.
- Phase 3 mapping products; U7/U8 experiments.
- Lesson plans, enrichment, publisher critique, or activity redesign.
- Invented mastery thresholds, percentages, or assessment rubrics.
- Invented teacher observations or universal Korean-learner claims.
- Repeating the full BE1↔BE2↔BE3 mapping from v1.

---

## 5. Interpretation dimensions (required)

| ID | Dimension | Rules |
|---|---|---|
| A | Observable learning requirements | Specific student abilities; distinguish publisher-stated vs AI-inferred; no mastery % |
| B | Grammar and communicative function | Structure, purpose, examples, expected use, recognition / guided / independent-production *opportunity* |
| C | Vocabulary and expected use | Clusters; recognition / context / productive / phonics where evidence permits; keep difficulty predictions separate |
| D | Activity purpose and skills | Consolidate; introduce / practise / reinforce / demonstrate-opportunity; no exercise-by-exercise noise |
| E | Potential learner difficulties | Separate general / Korean-EFL hypothesis / teacher-confirmed; hypotheses ≠ observed problems |
| F | Core vs supporting | Based on objectives, explicit language targets, activity emphasis; supporting ≠ optional; do not recommend removing content |

---

## 6. Evidence tags (experimental conventions — NOT LOCKED)

| Tag | Meaning |
|---|---|
| `BOOK_EVIDENCE` | Present in Phase 1 JSON / textbook-derived fields |
| `AI_INTERPRETATION` | Inferred requirement, purpose, or consolidation |
| `UNCERTAIN` | Plausible but under-supported |
| `MISSING_EVIDENCE` | Needed claim cannot be grounded |
| `AI_PREDICTED_DIFFICULTY` | Hypothesis about learner difficulty |
| `TEACHER_CONFIRMED_DIFFICULTY` | Only if actual teacher-confirmed evidence exists |

Temporary tables: mark `EXPERIMENT_SKETCH — NOT LOCKED`.

---

## 7. Evaluation criteria (defined before results)

The experiment **succeeds** only if the review artifact meets these bars. Partial credit is allowed; do not PASS a criterion merely because a section heading exists.

| ID | Criterion | Pass condition |
|---|---|---|
| V2-E1 | **Accuracy** | Material learning requirements are consistent with cited SB (and optional WB) evidence; no invented objectives |
| V2-E2 | **Traceability** | Material claims cite unit/page/activity/language/vocab/component IDs or printed pages |
| V2-E3 | **Observability** | Core requirements are stated as recognizable student performances (not vague themes) |
| V2-E4 | **Language interpretation** | Grammar, vocab clusters, and functions are distinguished and tied to evidence |
| V2-E5 | **Learning progression** | Recognition / guided practice / independent-production *opportunity* are distinguished where evidence supports; no mastery overclaim |
| V2-E6 | **Evidence discipline** | Publisher facts, AI interpretations, uncertainties, and difficulty predictions stay tagged and separate |
| V2-E7 | **Consolidation** | Repeated language is merged into shared requirements with multiple refs; important distinctions preserved |
| V2-E8 | **Teacher usefulness** | Teacher-facing synthesis is clear, concise, and practically relevant as an **initial AI review** (not teacher-validated) |
| V2-E9 | **Scope discipline** | No locked Phase 2 schema/architecture/implementation; no U7/U8 start |

Failure modes (must revise method, not force answers): uncited links; external textbook knowledge filling gaps; silent merge of evidence and interpretation; claiming teacher validation that did not occur.

---

## 8. Required outputs

1. This protocol (criteria locked for the run before results).
2. Review artifact: [`p2-exp-be2-u06-v2-review.md`](./p2-exp-be2-u06-v2-review.md) with sections:

   1. Executive unit interpretation  
   2. Learning requirements inventory  
   3. Grammar and language-function analysis  
   4. Vocabulary analysis  
   5. Skills and activity-purpose analysis  
   6. Potential learner difficulties  
   7. Core and supporting learning  
   8. Evidence and uncertainty register  
   9. Teacher-facing synthesis  
   10. Experiment evaluation and lessons learned  

---

## 9. Working procedure

1. Verify BE2-SB U6 canonical entities (and optional WB).
2. Inventory language, vocab, components, activities, continuous text.
3. Synthesize observable requirements (page/activity → unit).
4. Classify core vs supporting; tag difficulties carefully.
5. Write teacher-facing synthesis.
6. Evaluate against §7; record partial passes/failures honestly.
7. Update operating trackers; local commit; **do not push**.
8. Stop for owner review — do not start U7/U8.

---

## 10. Follow-ons (not this experiment)

| Next | Condition |
|---|---|
| Owner accept / revise v2 method | After review of v2 artifact |
| Apply method to BE2 U7 | Only after owner approval |
| Phase 2 schema proposal | Only after multiple accepted experiments show recurring fields |
| Teacher validation study | Separate future work; not claimed here |

---

## Change log

| Date | Change |
|---|---|
| 2026-10-09 | Created v2 protocol for Unit 6 learning-requirements interpretation (criteria defined before execution). |
| 2026-10-09 | First run executed; status → EXECUTED (criteria V2-E1–E9 unchanged). |
