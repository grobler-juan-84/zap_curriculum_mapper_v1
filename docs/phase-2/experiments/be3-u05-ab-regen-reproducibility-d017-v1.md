# BE3 Unit 5 A+B Regen — Reproducibility Check (D017)

**Date:** 2026-10-15  
**Decision:** D017 — Progressive Curriculum Intelligence (LOCKED)  
**Micro-step:** Independently regenerate **one** BE3-SB Unit 5 overview using the owner-preferred **A+B** approach; compare to the existing A+B Unit 5 row  
**Companions:** [`be3-u01-ab-regen-reproducibility-d017-v1.md`](./be3-u01-ab-regen-reproducibility-d017-v1.md), [`be3-u09-ab-regen-reproducibility-d017-v1.md`](./be3-u09-ab-regen-reproducibility-d017-v1.md)  
**Baseline (unchanged):** [`be3-sb-u01-u09-book-overview-d017-exp-ab.md`](./be3-sb-u01-u09-book-overview-d017-exp-ab.md)  
**Source dataset:** `data/phase1/big_english_3_sb/canonical/v1.json` (catalog `big_english_3_sb`)  
**Publisher S&S:** **not used** for this regeneration  
**Status:** EXPERIMENTAL findings only — **existing A+B overview not edited**; **no methodology / schema / UI change**

---

## A. Question and bounds

| Field | Value |
|---|---|
| Question | Does a fresh A+B Unit 5 generation from Phase 1 reproduce the existing A+B Unit 5 overview (exact or semantic)? |
| Why Unit 5 | Mid-book sample between U1 and U9 — stress-tests paragraph-detail writing + past *was/were* weather |
| Method | A+B — writing-aware Learning Outcomes **plus** dedicated Writing column; column roles: LOs = capabilities; Writing = skill/form/task |
| Isolation | Vocab / Grammar / Functions / CLIL / Values / Phonics follow the same control-preserved spine as the A+B experiment |
| Out of scope | Editing the book-wide A+B artifact; locking methodology; schema/DB/API/UI; other units; publisher alignment |

---

## B. Phase 1 evidence used (Unit 5 only)

| Strand | Phase 1 anchors |
|---|---|
| Unit | `big_english_3_sb_unit_05` — *Wonderful Weather!* — printed pp. 74–89 — `human_verified` |
| Vocabulary | Weather (*windy, snowy, rainy…*); clothes for weather; climate words |
| Grammar / language | *What's the weather like today?*; *What was it like yesterday?*; *was/were*; *There was/were* |
| Functions | Describe present/past weather; link clothes to weather; discuss climates |
| CLIL / Culture | `Changing Climates` (Geography); `All Weather Fun` (culture) |
| Values | `Prepare for the weather.` |
| Phonics | `sc, sw, sn, sl` |
| Writing | `bep_sb_3_comp_003` — title *Paragraph: Detail Sentences*; description *Writing topic sentences and detail sentences about favorite seasons* (p. 86) |

---

## C. Regenerated Unit 5 overview (A+B)

| Unit | Vocabulary | Grammar / Structures | Communicative Functions | Learning Outcomes *(AI-inferred)* | CLIL / Culture | Values | Phonics | Writing |
|---|---|---|---|---|---|---|---|---|
| **5 Wonderful Weather!** (pp. 74–89) | Weather (*windy, snowy, rainy…*); clothes for weather; climate words | *What's the weather like today?*; *What was it like yesterday?*; *was/were*; *There was/were* | Describe present/past weather; link clothes to weather; discuss climates | Talk about weather and clothes; talk about past weather with *was/were*; support a topic with detail sentences about seasons; prepare for the weather | Geography: changing climates; Culture: all-weather fun | Prepare for the weather | **sc, sw, sn, sl** | Detail sentences (supporting ideas) |

**Generation notes (experimental cells only):**

| Column | Inference from Phase 1 |
|---|---|
| LO writing fragment | Capability paraphrase of `bep_sb_3_comp_003` (support a topic with detail sentences; seasons scoped from description) |
| Writing | Form/task label from title *Paragraph: Detail Sentences* → detail / supporting ideas |
| LO ↔ Writing | Related by design; wording not identical |
| Scope note | Title focuses on **detail** sentences (topic sentences are Unit 4); regen keeps that strand focus |

---

## D. Existing A+B Unit 5 (reference — unchanged)

| Unit | Vocabulary | Grammar / Structures | Communicative Functions | Learning Outcomes *(AI-inferred)* | CLIL / Culture | Values | Phonics | Writing |
|---|---|---|---|---|---|---|---|---|
| **5 Wonderful Weather!** (pp. 74–89) | Weather (*windy, snowy, rainy…*); clothes for weather; climate words | *What's the weather like today?*; *What was it like yesterday?*; *was/were*; *There was/were* | Describe present/past weather; link clothes to weather; discuss climates | Talk about weather and clothes; talk about past weather with *was/were*; support a topic with detail sentences; prepare for the weather | Geography: changing climates; Culture: all-weather fun | Prepare for the weather | **sc, sw, sn, sl** | Detail sentences (supporting ideas) |

---

## E. Cell-by-cell comparison

Legend: **Exact** = identical text · **Near** = same meaning, soft wording only · **Drift** = meaningful content difference · **Fail** = missing / contradictory

| Column | Regen vs existing | Notes |
|---|---|---|
| Unit label / pages | **Exact** | *Wonderful Weather!* pp. 74–89 |
| Vocabulary | **Exact** | Control-preserved spine |
| Grammar / Structures | **Exact** | Control-preserved spine |
| Communicative Functions | **Exact** | Control-preserved spine |
| Learning Outcomes | **Near** | Only soft delta: *detail sentences **about seasons*** vs *detail sentences* |
| CLIL / Culture | **Exact** | Control-preserved spine |
| Values | **Exact** | Control-preserved spine |
| Phonics | **Exact** | Control-preserved spine |
| Writing | **Exact** | Same detail-sentence form/task label |

**No Drift / Fail cells.**

---

## F. Reproducibility verdict

| Criterion | Result |
|---|---|
| A+B dual writing coverage reproduced (LO fragment + Writing column) | **PASS** |
| Non-experimental columns match existing A+B | **PASS** (exact) |
| Experimental cells semantically match | **PASS** (Writing exact; LO near-exact — soft “about seasons” only) |
| Harmful content drift | **None** |
| Existing book-wide A+B artifact modified? | **No** |
| Methodology / schema / UI changed? | **No** |

**Overall:** Unit 5 A+B regeneration is **reproducible** against the existing A+B overview. Residual difference is paraphrase-level only.

**With U1 + U9:** Book-start / mid-book / book-end sampling (U1, U5, U9) all PASS near-exact. Still does **not** prove full U2–U4 / U6–U8 reproducibility or lock A+B as a formal method.

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
| 2026-10-15 | Created Unit 5 A+B regen + reproducibility comparison; existing A+B preserved. |
