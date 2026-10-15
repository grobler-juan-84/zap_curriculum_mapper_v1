# BE3 Unit 1 A+B Regen — Reproducibility Check (D017)

**Date:** 2026-10-15  
**Decision:** D017 — Progressive Curriculum Intelligence (LOCKED)  
**Micro-step:** Independently regenerate **one** BE3-SB Unit 1 overview using the owner-preferred **A+B** approach; compare to the existing A+B Unit 1 row  
**Baseline (unchanged):** [`be3-sb-u01-u09-book-overview-d017-exp-ab.md`](./be3-sb-u01-u09-book-overview-d017-exp-ab.md)  
**Source dataset:** `data/phase1/big_english_3_sb/canonical/v1.json` (catalog `big_english_3_sb`)  
**Publisher S&S:** **not used** for this regeneration  
**Status:** EXPERIMENTAL findings only — **existing A+B overview not edited**; **no methodology / schema / UI change**

---

## A. Question and bounds

| Field | Value |
|---|---|
| Question | Does a fresh A+B Unit 1 generation from Phase 1 reproduce the existing A+B Unit 1 overview (exact or semantic)? |
| Method | A+B — writing-aware Learning Outcomes **plus** dedicated Writing column; column roles: LOs = capabilities; Writing = skill/form/task |
| Isolation | Vocab / Grammar / Functions / CLIL / Values / Phonics follow the same control-preserved spine as the A+B experiment |
| Out of scope | Editing the book-wide A+B artifact; locking methodology; schema/DB/API/UI; other units; publisher alignment |

---

## B. Phase 1 evidence used (Unit 1 only)

| Strand | Phase 1 anchors |
|---|---|
| Unit | `big_english_3_sb_unit_01` — *Wake Up!* — printed pp. 4–19 — `human_verified` |
| Vocabulary | Daily routines; clock times (*seven thirty*, *seven forty-five*…); parts of day; hygiene / germs CLIL words; chore phrases |
| Grammar / language | *When does…?*; *at… / in the morning…*; *before/after*; frequency adverbs (*always–never*); subject + verb sentence frame (`bep3_lang_0004`) |
| Functions | Ask/answer routine times; sequence with before/after; state habit frequency |
| CLIL / Culture | `Keep It Clean!` (germs); `Time Zones` / e-pals |
| Values | `Do your chores.` |
| Phonics | `a_e, i_e, o_e` |
| Writing | `bep3_comp_0003` — title *Sentence: Subjects and Verbs*; description *Subject and verb identification and writing sentences about a daily routine* (p. 16) |

---

## C. Regenerated Unit 1 overview (A+B)

| Unit | Vocabulary | Grammar / Structures | Communicative Functions | Learning Outcomes *(AI-inferred)* | CLIL / Culture | Values | Phonics | Writing |
|---|---|---|---|---|---|---|---|---|
| **1 Wake Up!** (pp. 4–19) | Daily routines; clock times beyond o’clock (*seven thirty, seven forty-five…*); parts of day; hygiene content words | *When does…? at… / in the morning…*; *before/after*; frequency adverbs (*always–never*); subject + verb sentences | Talk about routine times; sequence with before/after; state habit frequency | Talk about daily routines and times; use frequency adverbs for habits; identify subjects and verbs when writing about daily routines; talk about keeping clean / chores timing | Science: Keep It Clean (germs); Culture: time zones / e-pals | Do your chores | **a_e, i_e, o_e** | Sentence craft — subjects & verbs (daily-routine sentences) |

**Generation notes (experimental cells only):**

| Column | Inference from Phase 1 |
|---|---|
| LO writing fragment | Capability paraphrase of `bep3_comp_0003` description (identify + write subjects/verbs in routine sentences) |
| Writing | Form/task label from title *Sentence: Subjects and Verbs*, scoped to daily-routine sentences |
| LO ↔ Writing | Related by design; wording not identical |

---

## D. Existing A+B Unit 1 (reference — unchanged)

| Unit | Vocabulary | Grammar / Structures | Communicative Functions | Learning Outcomes *(AI-inferred)* | CLIL / Culture | Values | Phonics | Writing |
|---|---|---|---|---|---|---|---|---|
| **1 Wake Up!** (pp. 4–19) | Daily routines; clock times beyond o’clock (*seven thirty, seven forty-five…*); parts of day; hygiene content words | *When does…? at… / in the morning…*; *before/after*; frequency adverbs (*always–never*); subject + verb sentences | Talk about routine times; sequence with before/after; state habit frequency | Talk about daily routines and times; use frequency adverbs for habits; identify subjects and verbs when writing about routines; talk about keeping clean / chores timing | Science: Keep It Clean (germs); Culture: time zones / e-pals | Do your chores | **a_e, i_e, o_e** | Sentence craft — subjects & verbs (routine sentences) |

---

## E. Cell-by-cell comparison

Legend: **Exact** = identical text · **Near** = same meaning, soft wording only · **Drift** = meaningful content difference · **Fail** = missing / contradictory

| Column | Regen vs existing | Notes |
|---|---|---|
| Unit label / pages | **Exact** | *Wake Up!* pp. 4–19 |
| Vocabulary | **Exact** | Control-preserved spine |
| Grammar / Structures | **Exact** | Control-preserved spine |
| Communicative Functions | **Exact** | Control-preserved spine |
| Learning Outcomes | **Near** | Only soft delta: *writing about **daily** routines* vs *writing about routines* |
| CLIL / Culture | **Exact** | Control-preserved spine |
| Values | **Exact** | Control-preserved spine |
| Phonics | **Exact** | Control-preserved spine |
| Writing | **Near** | Only soft delta: *(**daily-routine** sentences)* vs *(routine sentences)* |

**No Drift / Fail cells.**

---

## F. Reproducibility verdict

| Criterion | Result |
|---|---|
| A+B dual writing coverage reproduced (LO fragment + Writing column) | **PASS** |
| Non-experimental columns match existing A+B | **PASS** (exact) |
| Experimental cells semantically match | **PASS** (near-exact; soft “daily” wording only) |
| Harmful content drift | **None** |
| Existing book-wide A+B artifact modified? | **No** |
| Methodology / schema / UI changed? | **No** |

**Overall:** Unit 1 A+B regeneration is **reproducible** against the existing A+B overview for practical Book Intelligence use. Residual differences are paraphrase-level only and do not change teaching content.

**Limit:** Single-unit check. Does **not** prove book-wide (U2–U9) reproducibility or lock A+B as a formal method.

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
| 2026-10-15 | Created Unit 1 A+B regen + reproducibility comparison; existing A+B preserved. |
