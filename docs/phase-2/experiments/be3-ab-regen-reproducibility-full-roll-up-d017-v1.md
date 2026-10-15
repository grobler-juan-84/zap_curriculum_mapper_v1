# BE3 A+B Regen — Full 9/9 Reproducibility Roll-up (D017)

**Date:** 2026-10-15  
**Decision:** D017 — Progressive Curriculum Intelligence (LOCKED)  
**Micro-step:** Read-only A+B reproducibility check across **all nine** BE3-SB units; this prompt covers remaining **U2–U4 / U6–U8** and rolls up with prior U1 / U5 / U9 checks  
**Baseline (unchanged):** [`be3-sb-u01-u09-book-overview-d017-exp-ab.md`](./be3-sb-u01-u09-book-overview-d017-exp-ab.md)  
**Prior unit checks:** [`be3-u01-ab-regen-reproducibility-d017-v1.md`](./be3-u01-ab-regen-reproducibility-d017-v1.md) · [`be3-u05-ab-regen-reproducibility-d017-v1.md`](./be3-u05-ab-regen-reproducibility-d017-v1.md) · [`be3-u09-ab-regen-reproducibility-d017-v1.md`](./be3-u09-ab-regen-reproducibility-d017-v1.md)  
**Source dataset:** `data/phase1/big_english_3_sb/canonical/v1.json`  
**Publisher S&S:** **not used**  
**Status:** EXPERIMENTAL findings only — **existing A+B overview not edited**; **no methodology / schema / UI change**

---

## A. Question and bounds

| Field | Value |
|---|---|
| Question | Do independent A+B regenerations from Phase 1 reproduce the existing A+B overview across Units 1–9? |
| Method | A+B role split — LOs = capabilities (writing-aware); Writing = skill/form/task; other columns control-preserved |
| This prompt | Fresh regen for **U2, U3, U4, U6, U7, U8**; roll-up includes prior U1/U5/U9 |
| Documentation style | **Discrepancies only** (plus compact scorecard) |
| Out of scope | Editing overviews; locking methodology; schema/DB/API/UI; publisher alignment |

Legend: **Exact** · **Near** (soft wording only) · **Drift** (meaningful content difference) · **Fail**

---

## B. Compact scorecard (all 9)

| Unit | Non-exp columns | Learning Outcomes | Writing | Dual writing coverage | Overall |
|---|---|---|---|---|---|
| 1 *Wake Up!* | Exact | Near | Near | PASS | **PASS** |
| 2 *A Lot of Jobs!* | Exact | Near | Exact | PASS | **PASS** |
| 3 *Working Hard!* | Exact | Near | Exact | PASS | **PASS** |
| 4 *Amazing Animals* | Exact | Exact | Exact | PASS | **PASS** |
| 5 *Wonderful Weather!* | Exact | Near | Exact | PASS | **PASS** |
| 6 *Smells Good!* | Exact | Near | Exact | PASS | **PASS** |
| 7 *Fabulous Food!* | Exact | Near | Exact | PASS | **PASS** |
| 8 *Healthy Living* | Exact | Exact | Exact | PASS | **PASS** |
| 9 *School Trips!* | Exact | Near | Exact | PASS | **PASS** |

| Roll-up | Result |
|---|---|
| Units with Drift / Fail | **0 / 9** |
| Units with any Near soft wording | **7 / 9** (U1–U3, U5–U7, U9) |
| Units Exact on all compared cells | **2 / 9** (U4, U8) |
| Harmful content drift | **None** |
| Book-wide A+B edited? | **No** |

**Overall:** A+B is **reproducible across all nine units** for practical Book Intelligence use. Residual differences are paraphrase-level only. Does **not** lock methodology.

---

## C. Discrepancies only

Units with **no discrepancies** (all Exact): **U4**, **U8** — omitted from detail below.

### Prior checks (U1 / U5 / U9) — soft Near only

| Unit | Column | Existing | Independent regen | Class |
|---|---|---|---|---|
| 1 | LO | …identify subjects and verbs when writing about **routines**… | …when writing about **daily routines**… | Near |
| 1 | Writing | Sentence craft — subjects & verbs (**routine** sentences) | …(**daily-routine** sentences) | Near |
| 5 | LO | …support a topic with detail sentences… | …detail sentences **about seasons**… | Near |
| 9 | LO | …write past-tense SVO sentences about **trips**… | …about **school trips**… | Near |

### This prompt (U2–U4 / U6–U8) — soft Near only

Phase 1 writing anchors used for independent regen:

| Unit | Component ID | Phase 1 title | Description note |
|---|---|---|---|
| 2 | `bep_sb_3_comp_0003` | Sentence: Two Subjects and Verbs | compound subjects/verbs connected by *and* |
| 3 | `be_plus_3_sb_comp_003` | Paragraph: Titles | capitalize most words; not short function words |
| 4 | `big_english_3_sb_component_0012` | Paragraph: Topic Sentences | identify and compose topic sentences |
| 6 | `bep3_comp_u6_003` | Paragraph: Final Sentences | final sentences that restate the main idea |
| 7 | `bep_3_sb_u07_comp_0008` | Paragraphs (Title, Topic, Detail, Final) | paragraph structure; personal paragraph |
| 8 | `bep3_sb_comp_08_08` | Combining Sentences with and, but, or | **description null** (title-only) |

| Unit | Column | Existing | Independent regen | Class |
|---|---|---|---|---|
| 2 | LO | …**produce** compound sentences with two subjects and two verbs… | …**write** compound sentences with two subjects and two verbs… | Near |
| 3 | LO | …**capitalize paragraph titles correctly**… | …**capitalize most words in paragraph titles correctly**… | Near |
| 6 | LO | …**close a paragraph with** a final sentence that restates the main idea… | …**write** a final sentence that restates the main idea… | Near |
| 7 | LO | …write a short paragraph with title, topic, details, and **closing**… | …write a short **personal** paragraph with title, topic, details, and **final sentence**… | Near |

**U4 / U8:** no discrepancies (Exact LO + Exact Writing + Exact non-exp).

**Writing column (U2–U4 / U6–U8):** no discrepancies — all Exact vs existing A+B Writing cells.

---

## D. Non-discrepancy confirmations (brief)

| Check | Result |
|---|---|
| Non-experimental columns vs control spine (U2–U4 / U6–U8) | Exact match for unit/vocab/grammar/functions/CLIL/values/phonics |
| Writing component present 9/9 | Yes (U8 title-only; no invented description content) |
| Dual A+B coverage (LO writing fragment + Writing column) 9/9 | PASS |
| Publisher S&S consulted during regen | No |

---

## E. Explicit non-actions

- Did not edit [`be3-sb-u01-u09-book-overview-d017-exp-ab.md`](./be3-sb-u01-u09-book-overview-d017-exp-ab.md) or Control / A / B isolates  
- Did not change Phase 1 JSON, prompts, schema, DB, API, or UI  
- Did not alter BE2 v2 baseline  
- Did not “fix” soft Near paraphrases into the baseline overview  

---

## Change log

| Date | Change |
|---|---|
| 2026-10-15 | Full 9/9 A+B regen reproducibility roll-up; remaining U2–U4 / U6–U8 checked; discrepancies-only; overview preserved. |
