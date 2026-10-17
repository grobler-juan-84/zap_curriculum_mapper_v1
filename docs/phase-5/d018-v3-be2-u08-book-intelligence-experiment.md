# D018 V3 Experiment Design — BE2 Unit 8 + Book Intelligence (planning only)

**Status:** ACTIVE / DESIGN ONLY — **NOT AUTHORIZED TO GENERATE**  
**Version:** 1.0  
**Date:** 2026-10-17  
**Decision:** D018 (LOCKED) — iteration **V3** (+ AI Curriculum / Book Intelligence); generation **not** authorized  
**Pilot:** Big English 2 · Unit 8 *Wild Animals* · **SB pp. 128–129** + **WB pp. 104–105** (unchanged page scope)  
**Control:** **V2b** — preferred V2-family Pass baseline (`WILD ANIMALS(2).pdf`; Audio OFF; evaluation `495c917`)  
**V2-family pack (CLOSED):** [`d018-v2-be2-u08-sb128-129-wb104-105-experiment.md`](./d018-v2-be2-u08-sb128-129-wb104-105-experiment.md)  
**Do not use V2c as control.**

---

## Purpose

Design a **controlled** D018 V3 experiment that tests whether adding **bounded Unit 8 Book Intelligence** to the **unchanged V2b control prompt** produces a **meaningfully better** lesson than V2b alone.

This step is **planning and prompt design only**. No Chalkie run. No V3 generation authorization. No change to V2b’s accepted Pass verdict, D018, the seven-criterion rubric, architecture, schemas, datasets, application code, or [`../4-decisions.md`](../4-decisions.md).

---

## Experiment question

> Does adding bounded Unit 8 Book Intelligence to the unchanged V2b control improve lesson quality, teacher usefulness, or curriculum coherence **without** reducing source fidelity, provenance clarity, concision, or classroom readiness?

---

## Control (V2b) — held constant

| Variable | Control value |
|---|---|
| Series / book | Big English 2 · SB + WB evidence for Unit 8 opener pages |
| Page scope | SB **128–129** + WB **104–105** only |
| Base prompt | Exact **V2 paste block** (same content V2b used) — **unchanged** |
| Mode | Single Lesson |
| Audio activities | **OFF** |
| Framework | Chalkie Default |
| Theme | Simple |
| Grade | Grade 3 |
| English ability | Grade 2 |
| Requested slide count | 25 |
| Rubric | Existing seven-criterion D018 checklist |
| Pass gates | ≥5 Yes; no hard #1 scope failure; no invented listening as book text |

**Control artifact (historical):** `WILD ANIMALS(2).pdf` — formal **PASS** 5 Yes / 2 Partial (provenance + concision Partial).

---

## Treatment (V3) — sole intentional change

| Variable | Treatment |
|---|---|
| **Changed** | Append the bounded **`[BI]`** Book Intelligence block below to the unchanged V2b/V2 paste prompt |
| **Not changed** | Page scope, mode, audio OFF, framework/theme/grades/slide count, SS/SB/WB evidence text, rubric, Pass gates |

V3 = **V2b control prompt + `[BI]` addition only**.

---

## Book Intelligence artifact selected

| Field | Value |
|---|---|
| Preferred human SoT | [`../phase-2/experiments/be2-sb-u01-u09-book-overview-d017-v2.md`](../phase-2/experiments/be2-sb-u01-u09-book-overview-d017-v2.md) |
| Machine companion (same content) | `data/phase2/big_english_2_sb/interpretations/be2-sb-u01-u09-book-intelligence-v2-eight-column-v0.1-draft.json` |
| Schema / version | `book_intelligence_unit_overview` · `0.1-draft` |
| Methodology | D017 **v2 eight-column** provisional Book Intelligence working baseline (owner-approved; **format/methodology/schema not locked**) |
| `column_set` | `eight_column_baseline` |
| Unit record | `bep2_unit_08` · Unit 8 · *Wild Animals* · printed pp. **128–143** (unit span — **not** the lesson page license) |
| Status of data | Existing interpretation port; **not** regenerated for V3; **not** Phase 1 evidence; **not** merged into canonical `v1.json` |

**Rejected as control/treatment sources:** BE2 v1 overview (superseded as working baseline); BE3 nine-column / A+B artifacts; V2c prompt; invented BI fields.

---

## Unit 8 fields — include vs exclude

### Included in the V3 `[BI]` treatment (smallest relevant set)

| Field | Provenance | Why it could help **this** lesson (SB 128–129 + WB 104–105) |
|---|---|---|
| `title` / unit number | Factual catalog/unit identity | Orients teacher: Unit 8 *Wild Animals* |
| Soft communicative focus drawn from `communicative_functions` (ability Q&A only) | Unit-level **interpretation** synthesized from Phase 1 language evidence | Clarifies that the SB like+can frame supports **ability talk**, not a free expansion into later grammar |
| Soft page-faithful aim drawn from first LO clause (“Describe animals”) | **`learning_outcomes_provenance`: `ai_inferred`** | Reduces teacher inference about “what success looks like” on opener pages **without** forcing habitats/values aims |
| Explicit exclusion list (habitats / adjective order / values / phonics) | Derived from BI unit columns that are **out of page scope** | Uses BI to **constrain** scope, not expand it — targets known V2-family residual risk of unit drift |

### Excluded (irrelevant or likely to expand scope)

| Field | Why excluded |
|---|---|
| Habitat vocabulary (*desert, ocean, jungle, forest…*) | Later Unit 8 (e.g. CLIL / ~p.134+); would expand beyond SB 128–129 + WB 104–105 |
| Full `grammar_structures` beyond light ability talk | Adjective order; *They're so + adj* belong later in the unit |
| Full `communicative_functions` (ordered adjectives; appreciation) | Pulls description craft / values-adjacent talk off these pages |
| LO clauses “where animals live” / “appreciating animals” | Habitats + values aims — out of opener-page license |
| `clil_culture` | Habitats / culture — later |
| `values` (*Appreciate animals*) | Later values strand |
| `phonics` (*ou, ow*) | Later phonics |
| Other units’ BI rows | Out of pilot |
| Writing column | Not present in eight-column BE2 baseline |

### Evidence vs interpretation (labeling rule for the prompt)

| Kind | Examples | Prompt rule |
|---|---|---|
| **Factual / catalog** | Unit title, unit number, printed unit page span as **context only** | May appear under `[BI]`; page span is **not** a license to teach pp. 130–143 |
| **Interpretation (Phase 1–grounded synthesis)** | Vocabulary/grammar/functions cell summaries in the v2 overview | Label `[BI · interpretation]`; never as `[SB]` / `[WB]` / `[SS]` |
| **AI-inferred** | `learning_outcomes` (`ai_inferred`) | Label `[BI · AI-inferred]`; soft aim only; do not present as publisher “I Can” verbatim |

---

## Copy-ready V3 addition (append to unchanged V2b / V2 paste block)

**Status:** **DRAFTED / NOT RUN** — requires owner approval before generation.

```text
---
D. BOOK INTELLIGENCE — BOUNDED UNIT 8 CONTEXT [BI] (append-only; do not rewrite A–C above)

[BI] Source: BE2-SB D017 v2 eight-column Book Intelligence (provisional working baseline).
[BI] Machine companion: be2-sb-u01-u09-book-intelligence-v2-eight-column-v0.1-draft.json → unit_id bep2_unit_08 only.
[BI] Label rule: [BI] is interpretation / unit overview — NEVER label BI content as [SS], [SB], or [WB]. Never present [BI] as publisher page text.

[BI] Unit identity (factual): Unit 8 Wild Animals (full SB unit span pp. 128–143 is CONTEXT ONLY — this lesson still uses SB 128–129 + WB 104–105 ONLY).

[BI · interpretation] Soft communicative focus that fits THESE pages only:
- Name zoo/wild animals already listed in [SB]/[WB].
- Support ability talk that fits the required [SB] frame (like + can) — light yes/no ability practice only.
- Do NOT start adjective-order description drills or “They’re so + adj” lessons.

[BI · AI-inferred] Soft success aim for THIS lesson only:
- Students can describe / talk about the target animals using the page language and the required like + can frame.
- Do NOT force unit aims about where animals live or appreciating animals onto these opener pages.

[BI] EXCLUDE from slides (later Unit 8 — out of scope):
- Habitat words (desert, ocean, jungle, forest…) and habitat/CLIL teaching
- Values (“Appreciate animals”) and phonics (ou, ow)
- Full-unit grammar beyond light can/can't support for the [SB] frame

[BI] Hard rule: Book Intelligence may improve teacher coherence and reduce guessing — it must NOT expand curriculum scope, invent publisher audio/lyrics/answers, or weaken [SS]/[SB]/[WB] provenance.
---
```

---

## Evaluation design

### A. Continuity — unchanged seven-criterion rubric

Score Yes / Partial / No on the same seven criteria and the same Pass gates as V1–V2c.

**Important:** Matching V2b’s **5 Yes / 2 Partial Pass alone is not enough** to claim Book Intelligence added value.

### B. Separate V3 value assessment (predeclared)

Score each **Yes / Partial / No** only after generation+review:

| # | V3 value criterion | Yes means… |
|---|---|---|
| V3-1 | Meaningful teaching improvement | Clearer modeling/practice of the like+can / animal-naming job vs V2b — not merely more text |
| V3-2 | Useful curriculum coherence | Teacher can see how these pages sit in Unit 8 **without** the lesson teaching later strands |
| V3-3 | Reduced teacher inference burden | Less guesswork about soft aims / ability focus vs V2b |
| V3-4 | No unsupported source claims | `[BI]` not mislabeled as `[SS]`/`[SB]`/`[WB]`; no new invented publisher items |
| V3-5 | No unnecessary length/complexity | Not longer/noisier than V2b in a way that harms usability (#6 must not regress to worse than V2b’s Partial without compensating gains) |

### C. “Meaningful improvement” (declared before generation)

V3 shows **meaningful improvement** over V2b only if **all** of the following hold:

1. V3 meets the standard Pass gates (or fails only in a way already true of V2b **without new hard failures**).
2. At least **two** of V3-1…V3-3 are **Yes**.
3. V3-4 is **Yes** (no new provenance fabrication / BI mislabeled as publisher source).
4. No regression that makes #1, #4, or #7 **worse** than V2b.
5. Concision (#6) is not **worse** than V2b unless V3-1 and V3-2 are both **Yes** and the owner accepts the length trade (still recorded as not an automatic win).

### D. Classification vs V2b

| Class | Rule |
|---|---|
| **Better than V2b** | Meaningful-improvement definition above is met |
| **Equivalent to V2b** | Formal Pass similar (e.g. 5 Yes / 2 Partial) **and** fewer than two Yes among V3-1…V3-3, **or** gains offset by equal provenance/length problems |
| **Worse than V2b** | Hard Pass-gate failure; **or** #1/#4/#7 regresses; **or** V3-4 is No; **or** clear scope expansion into excluded BI fields |

---

## Explicit non-locks / boundaries

- Does **not** authorize Chalkie generation or V3 execution.
- Does **not** change V2b’s accepted Pass verdict or reopen V2 / V2c.
- Does **not** authorize V2d or further V2 variants.
- Does **not** lock BI methodology, schema, UI contract, or Phase 2 format.
- Does **not** modify Phase 1 datasets, BI JSON content, or application code.
- Does **not** update [`../4-decisions.md`](../4-decisions.md).

---

## Next gate (required before generation)

**Owner review and explicit approval of this V3 design and the copy-ready `[BI]` addition before any Chalkie generation.**

Until that approval is recorded, V3 status remains: **DESIGN ONLY / NOT AUTHORIZED TO GENERATE**.

---

## Change log

| Date | Note |
|---|---|
| 2026-10-17 | Step 198: created V3 Book Intelligence experiment design (planning only). Selected BE2 D017 v2 eight-column Unit 8 BI; defined include/exclude fields, append-only `[BI]` treatment, V3 value criteria, and owner approval gate. No generation. |
