# BE3 Unit 9 A+B Regen — Reproducibility Check (D017)

**Date:** 2026-10-15  
**Decision:** D017 — Progressive Curriculum Intelligence (LOCKED)  
**Micro-step:** Independently regenerate **one** BE3-SB Unit 9 overview using the owner-preferred **A+B** approach; compare to the existing A+B Unit 9 row  
**Companion (U1):** [`be3-u01-ab-regen-reproducibility-d017-v1.md`](./be3-u01-ab-regen-reproducibility-d017-v1.md)  
**Baseline (unchanged):** [`be3-sb-u01-u09-book-overview-d017-exp-ab.md`](./be3-sb-u01-u09-book-overview-d017-exp-ab.md)  
**Source dataset:** `data/phase1/big_english_3_sb/canonical/v1.json` (catalog `big_english_3_sb`)  
**Publisher S&S:** **not used** for this regeneration  
**Status:** EXPERIMENTAL findings only — **existing A+B overview not edited**; **no methodology / schema / UI change**

---

## A. Question and bounds

| Field | Value |
|---|---|
| Question | Does a fresh A+B Unit 9 generation from Phase 1 reproduce the existing A+B Unit 9 overview (exact or semantic)? |
| Why Unit 9 | Opposite end of the book from the Unit 1 regen check — stress-tests late-unit writing (SVO / past tense) |
| Method | A+B — writing-aware Learning Outcomes **plus** dedicated Writing column; column roles: LOs = capabilities; Writing = skill/form/task |
| Isolation | Vocab / Grammar / Functions / CLIL / Values / Phonics follow the same control-preserved spine as the A+B experiment |
| Out of scope | Editing the book-wide A+B artifact; locking methodology; schema/DB/API/UI; other units; publisher alignment |

---

## B. Phase 1 evidence used (Unit 9 only)

| Strand | Phase 1 anchors |
|---|---|
| Unit | `big_english_3_sb_unit_09` — *School Trips!* — printed pp. 144–159 — `human_verified` |
| Vocabulary | Places to visit (*museum, aquarium, zoo, theater…*); past trip verbs (*went, saw, ate…*); art/theater content words |
| Grammar / language | Past simple Wh/Y-N (*Where did you go? / Did you…?*); *didn't* + base; SVO frame (`bep3_sb_u09_lang_0009`) |
| Functions | Narrate past trips; contrast what was/wasn't done; identify sentence parts |
| CLIL / Culture | `At the Art Gallery` (Art); `The World Stage` (theater) |
| Values | `Recognize your talents.` |
| Phonics | `nt, ld, nd, st` |
| Writing | `bep3_sb_u09_comp_0008` — title *Writing Sentences: Subjects, Verbs, and Objects*; description *Sentence structure instruction identifying subjects, verbs, and objects in past tense sentences* (p. 156) |

---

## C. Regenerated Unit 9 overview (A+B)

| Unit | Vocabulary | Grammar / Structures | Communicative Functions | Learning Outcomes *(AI-inferred)* | CLIL / Culture | Values | Phonics | Writing |
|---|---|---|---|---|---|---|---|---|
| **9 School Trips!** (pp. 144–159) | Places to visit (*museum, aquarium, zoo…*); past trip verbs (*went, saw, ate…*); art/theater words | Past simple Wh/Y-N (*Where did you go? / Did you…?*); *didn't* + base; SVO sentence order | Narrate past trips; contrast what was/wasn't done; identify sentence parts | Talk about past school trips and places visited; use past affirmative/negative; write past-tense SVO sentences about school trips; recognize talents | Art: art gallery; Culture: world stage / theater | Recognize your talents | **nt, ld, nd, st** | SVO sentence structure (subject–verb–object) |

**Generation notes (experimental cells only):**

| Column | Inference from Phase 1 |
|---|---|
| LO writing fragment | Capability paraphrase of `bep3_sb_u09_comp_0008` (write past-tense SVO sentences about school trips) |
| Writing | Form/task label from title *Writing Sentences: Subjects, Verbs, and Objects* → SVO structure |
| LO ↔ Writing | Related by design; wording not identical |

---

## D. Existing A+B Unit 9 (reference — unchanged)

| Unit | Vocabulary | Grammar / Structures | Communicative Functions | Learning Outcomes *(AI-inferred)* | CLIL / Culture | Values | Phonics | Writing |
|---|---|---|---|---|---|---|---|---|
| **9 School Trips!** (pp. 144–159) | Places to visit (*museum, aquarium, zoo…*); past trip verbs (*went, saw, ate…*); art/theater words | Past simple Wh/Y-N (*Where did you go? / Did you…?*); *didn't* + base; SVO sentence order | Narrate past trips; contrast what was/wasn't done; identify sentence parts | Talk about past school trips and places visited; use past affirmative/negative; write past-tense SVO sentences about trips; recognize talents | Art: art gallery; Culture: world stage / theater | Recognize your talents | **nt, ld, nd, st** | SVO sentence structure (subject–verb–object) |

---

## E. Cell-by-cell comparison

Legend: **Exact** = identical text · **Near** = same meaning, soft wording only · **Drift** = meaningful content difference · **Fail** = missing / contradictory

| Column | Regen vs existing | Notes |
|---|---|---|
| Unit label / pages | **Exact** | *School Trips!* pp. 144–159 |
| Vocabulary | **Exact** | Control-preserved spine |
| Grammar / Structures | **Exact** | Control-preserved spine |
| Communicative Functions | **Exact** | Control-preserved spine |
| Learning Outcomes | **Near** | Only soft delta: *about **school** trips* vs *about trips* |
| CLIL / Culture | **Exact** | Control-preserved spine |
| Values | **Exact** | Control-preserved spine |
| Phonics | **Exact** | Control-preserved spine |
| Writing | **Exact** | Same SVO form/task label |

**No Drift / Fail cells.**

---

## F. Reproducibility verdict

| Criterion | Result |
|---|---|
| A+B dual writing coverage reproduced (LO fragment + Writing column) | **PASS** |
| Non-experimental columns match existing A+B | **PASS** (exact) |
| Experimental cells semantically match | **PASS** (Writing exact; LO near-exact — soft “school” only) |
| Harmful content drift | **None** |
| Existing book-wide A+B artifact modified? | **No** |
| Methodology / schema / UI changed? | **No** |

**Overall:** Unit 9 A+B regeneration is **reproducible** against the existing A+B overview. Residual difference is paraphrase-level only.

**With Unit 1:** Book-end sampling (U1 + U9) both PASS near-exact. Still does **not** prove full U2–U8 reproducibility or lock A+B as a formal method.

---

## G. Explicit non-actions

- Did not edit [`be3-sb-u01-u09-book-overview-d017-exp-ab.md`](./be3-sb-u01-u09-book-overview-d017-exp-ab.md) or Control / A / B isolates  
- Did not consult `ss_v1.json` or publisher S&S while regenerating  
- Did not change Phase 1 JSON, prompts, schema, DB, API, or UI  
- Did not alter BE2 v2 baseline  

---

## Change log

| Date | Change |
|---|---|
| 2026-10-15 | Created Unit 9 A+B regen + reproducibility comparison; existing A+B preserved. |
