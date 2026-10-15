# BE3 Unit 1 Dry Check — SS Writing + I Can vs Control / A / B / A+B (D017)

**Date:** 2026-10-15  
**Status:** EXPERIMENTAL findings only — **no overview changed**; **no methodology lock**  
**Scope:** Big English 3 SB **Unit 1 only**; **Writing** and **I can…** only  
**SS source:** `data/phase1/big_english_3_sb/canonical/ss_v1.json` (also Storage `book-datasets/big-english/big_english_3_sb/canonical/ss_v1.json`)  
**Compared overviews (unchanged):**
- Control: [`be3-sb-u01-u09-book-overview-d017-v1.md`](./be3-sb-u01-u09-book-overview-d017-v1.md)
- A: [`be3-sb-u01-u09-book-overview-d017-exp-a.md`](./be3-sb-u01-u09-book-overview-d017-exp-a.md)
- B: [`be3-sb-u01-u09-book-overview-d017-exp-b.md`](./be3-sb-u01-u09-book-overview-d017-exp-b.md)
- A+B: [`be3-sb-u01-u09-book-overview-d017-exp-ab.md`](./be3-sb-u01-u09-book-overview-d017-exp-ab.md)

**Explicit non-actions:** No edits to overviews, Phase 1 JSON, prompts, schema, DB, UI, or BE2 baseline.

**Follow-ons:** Unit 2 [`be3-u02-ss-writing-ican-dry-check-d017-v1.md`](./be3-u02-ss-writing-ican-dry-check-d017-v1.md); expansion sample U3/U5/U9 [`be3-u03-u05-u09-ss-writing-ican-dry-check-d017-v1.md`](./be3-u03-u05-u09-ss-writing-ican-dry-check-d017-v1.md).

---

## 1. Publisher SS Unit 1 targets (Writing + I can only)

| SS field | Exact content |
|---|---|
| Unit | 1 — Wake Up! (pp. 4–19) |
| **Writing** | `Sentence: Subjects and Verbs` |
| **I can…** | (1) …talk about what people do before and after school. |
| | (2) …talk about different times of the day. |
| | (3) …talk about keeping clean. |
| | (4) …find and use adverbs of frequency, subjects and verbs. |

Other SS columns (Vocabulary, Structures, CLIL/Culture, Phonics, Values) are **out of scope** for this micro-step.

---

## 2. Overview Unit 1 cells under test

| Variant | Learning Outcomes (U1) | Writing column (U1) |
|---|---|---|
| **Control** | Talk about daily routines and times; use frequency adverbs for habits; talk about keeping clean / chores timing | *(none — eight-column layout)* |
| **A** | Talk about daily routines and times; use frequency adverbs for habits; **find and use subjects and verbs in sentences about routines**; talk about keeping clean / chores timing | *(none)* |
| **B** | Same as Control | **Subjects and verbs — identify and write routine sentences** |
| **A+B** | Talk about daily routines and times; use frequency adverbs for habits; **identify subjects and verbs when writing about routines**; talk about keeping clean / chores timing | **Sentence craft — subjects & verbs (routine sentences)** |

Note: Control/A/B also list “subject + verb sentences” under **Grammar / Structures** (not scored as Writing-column coverage here).

---

## 3. Item-by-item comparison

Legend: **OK** = meaningful coverage · **Soft** = present but thin / wording-only · **Gap** = meaningful omission  
Classes: **Presentation** · **Inference** · **Evidence** · **Uncertain**

### 3A. Writing target — `Sentence: Subjects and Verbs`

| Variant | Result | Class | Note |
|---|---|---|---|
| Control | **Gap** | Presentation (+ soft Grammar parking) | No Writing column; metalanguage only appears under Grammar |
| A | **Soft/Gap** | Presentation | LO carries “find and use subjects and verbs”, but no Writing strand column like publisher S&S |
| B | **OK** | — | Dedicated Writing cell matches publisher strand intent |
| A+B | **OK** | — | Writing cell present; wording paraphrased from Phase 1 (“Sentence craft…”) rather than exact SS title |

### 3B. I can (1) — before and after school

| Variant | Result | Class | Note |
|---|---|---|---|
| All four | **Soft OK** | Inference / presentation wording | Covered as “daily routines and times” + Functions “before/after”; not verbatim SS wording |

### 3C. I can (2) — times of the day

| Variant | Result | Class | Note |
|---|---|---|---|
| All four | **OK** | — | Explicitly in Learning Outcomes |

### 3D. I can (3) — keeping clean

| Variant | Result | Class | Note |
|---|---|---|---|
| All four | **OK** | — | Present in Learning Outcomes (+ CLIL Science) |

### 3E. I can (4) — adverbs of frequency **and** subjects and verbs

| Variant | Adverbs | Subjects & verbs | Class |
|---|---|---|---|
| Control | **OK** (in LO) | **Gap** in LO | Inference (writing metalanguage dropped from outcomes) |
| A | **OK** | **OK** in LO | — for this item; Writing **Presentation** gap remains (§3A) |
| B | **OK** | **Soft** — in Writing column, **not** in LO | Inference if LO completeness is required; Presentation OK for Writing strand |
| A+B | **OK** | **OK** in LO **and** Writing column | Closest dual match; soft paraphrase vs exact “find and use …” |

---

## 4. Scorecard (Unit 1 Writing + I Can only)

| Criterion | Control | A | B | A+B |
|---|---|---|---|---|
| Publisher Writing column visible | Fail | Fail | Pass | Pass |
| Writing metalanguage in Learning Outcomes | Fail | Pass | Fail | Pass |
| Non-writing I Can (1–3) meaning coverage | Pass (soft on #1) | Pass (soft on #1) | Pass (soft on #1) | Pass (soft on #1) |
| I Can #4 adverb part | Pass | Pass | Pass | Pass |
| I Can #4 subjects/verbs part | Fail | Pass | Soft (column only) | Pass |
| Exact SS wording preserved | No | No | No | No |

**Unit-1 dry-check verdict (AI-assessed, this scope only):**

- **Control** — confirms prior BE3 diagnosis: Writing **Presentation** gap + LO **Inference** gap on subjects/verbs.
- **A** — fixes LO writing metalanguage; still fails publisher-style Writing visibility.
- **B** — fixes Writing visibility; leaves subjects/verbs out of Learning Outcomes.
- **A+B** — only variant that **passes both** Writing visibility and LO writing metalanguage for Unit 1.

This does **not** approve A+B book-wide or lock methodology.

---

## 5. Classification summary

| Pattern | Confirmed on U1? |
|---|---|
| Presentation mismatch (no Writing column vs SS Writing) | **Yes** — Control, A |
| Inference underweight of writing/metalanguage I Can in LOs | **Yes** — Control, B |
| Evidence failure (SS unavailable) | **No for this check** — `ss_v1.json` used as publisher-faithful companion source |
| Exact wording fidelity to SS I Can / Writing titles | Soft across all variants (expected while LOs stay AI-inferred) |

---

## 6. What this micro-step deliberately did **not** do

- Did not edit Control / A / B / A+B overviews.
- Did not merge SS into SB canonical.
- Did not promote F017 into a pipeline rule.
- Did not expand the dry check beyond Unit 1 Writing + I Can.
- Did not choose an owner path.

---

## 7. Implication for owner review (non-binding)

For **Unit 1 Writing + I Can only**, A+B is the only variant that simultaneously satisfies:

1. Writing strand visibility, and  
2. writing metalanguage inside Learning Outcomes,

when checked against `ss_v1.json`.

Owner path choice (A / B / A+B / hybrid / pause) remains open; this dry check is evidence for that choice, not a decision.

---

## Change log

| Date | Change |
|---|---|
| 2026-10-15 | Created Unit 1 Writing + I Can dry check vs Control/A/B/A+B using BE3 `ss_v1.json`; no overview/data changes. |
| 2026-10-15 | Linked Unit 2 + U3/U5/U9 expansion dry checks after A+B dual Pass repeated. |
