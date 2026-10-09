# Phase 2 Experiment Protocol — BE2-SB Unit 6 (My Day)

**Status:** ACTIVE  
**Version:** 1.0  
**Date:** 2026-10-09  
**Decision:** [D016](../4-decisions.md)  
**Purpose:** Bound the **first** controlled Phase 2 curriculum-interpretation experiment. Defines question, inputs, evidence rules, outputs, and evaluation criteria. Does **not** lock a Phase 2 JSON schema, storage model, prompt template, or product implementation.

---

## 1. Experiment identity

| Field | Value |
|---|---|
| Experiment ID | `P2-EXP-BE2-U06-v1` |
| Focus unit | BE2-SB Unit 6 — **My Day** |
| Focus catalog ID | `big_english_2_sb` |
| Focus unit ID | `bep2_unit_06` |
| Printed pages | 90–105 |
| Candidate set | [`be2-candidate-units.md`](./be2-candidate-units.md) |
| Run status | **READY** (protocol defined; interpretation not started) |

---

## 2. Experiment question

> Using only verified Phase 1 book evidence for Big English 1–3, what linguistically meaningful **prior learning** (mainly BE1) and **future learning** (mainly BE3) relate to BE2 Unit 6 *My Day*, and how should those relationships be classified so a teacher can tell **book evidence** apart from **AI interpretation**?

Secondary questions (same run, still bounded):

1. Which BE2 U6 language targets are genuinely new versus recycled with a new frame?
2. Where does “same topic / shared vocabulary” **fail** as a progression signal?
3. What evidence quality gaps would block a later Phase 3 mapping claim?

---

## 3. In scope

### Primary inputs (required)

| Role | Catalog ID | Local working copy | Storage key |
|---|---|---|---|
| Focus | `big_english_2_sb` | `data/phase1/big_english_2_sb/canonical/v1.json` | `big-english/big_english_2_sb/canonical/v1.json` |
| Prior | `big_english_1_sb` | `data/phase1/big_english_1_sb/canonical/v1.json` | `big-english/big_english_1_sb/canonical/v1.json` |
| Future | `big_english_3_sb` | `data/phase1/big_english_3_sb/canonical/v1.json` | `big-english/big_english_3_sb/canonical/v1.json` |

### Secondary inputs (optional triangulation)

| Role | Catalog ID | Notes |
|---|---|---|
| Prior WB | `big_english_1_wb` | Same unit titles as BE1-SB; use only to corroborate, not replace SB evidence |
| Focus WB | `big_english_2_wb` | Same unit title *My Day* |
| Future WB | `big_english_3_wb` | Same unit title *Wake Up!* for the primary future link |

### Seed prior / future anchors (from candidate discovery)

These are **starting hypotheses**, not conclusions:

| Direction | Book evidence anchors | Preliminary interpretation to test |
|---|---|---|
| Prior | BE1-SB U5 Busy at Home — present continuous home actions (`What's she doing?`) | Daily-life action talk before timed routines |
| Prior | BE1-SB U7 Party Time — meal habits with `every day` | Habitual present simple without clock times |
| Future | BE3-SB U1 Wake Up! — finer times, `before/after`, frequency set | Extends o’clock routines into precise scheduling + frequency |

### Allowed analysis moves

- Read Phase 1 `units`, `pages`, `vocabulary`, `language`, `activities`, `curriculum_components`, `continuous_text`, and in-book `relationships`.
- Quote grammar labels, functions, prompts/responses, terms, activity types, and printed/`pdf_page` references.
- Propose interpretive relationship labels (e.g. *prerequisite*, *recycle*, *extend*, *contrast*, *weak/no link*) **only** when tied to cited evidence.
- Record uncertainty and missing evidence explicitly.

---

## 4. Out of scope

- Inventing pedagogy, lesson plans, or enrichment (Phase 4+).
- Locking or drafting a Phase 2 JSON schema / API / UI.
- Full-book interpretation of BE1/BE2/BE3 (only U6 focus + cited link units).
- Phase 3 curriculum-map products or graph persistence.
- Beehive, Reach Higher, or external textbook knowledge.
- Running U7 / U8 experiments in the same pass (queued after this run).
- Treating topic match or vocab overlap alone as progression.

---

## 5. Evidence classification (mandatory)

Every substantive claim in the experiment output must be tagged:

| Class | Meaning | Examples |
|---|---|---|
| `BOOK_EVIDENCE` | Stated or structurally present in Phase 1 JSON | Unit title; `grammar_label`; `term` on a page; activity instruction |
| `AI_INTERPRETATION` | Inferred relationship or linguistic analysis | “BE3 extends BE2 clock routines with before/after” |
| `UNCERTAIN` | Plausible but under-supported | Weak lexical overlap without shared function |
| `MISSING_EVIDENCE` | Needed claim cannot be grounded in current datasets | No BE1 dedicated clock-time unit |

Phase 1 doctrine (D001) remains: extraction is extract-only; interpretation stays separable.

---

## 6. Required outputs (manual / reviewable artifact)

Produce one review note (markdown or structured text is fine) with these sections:

1. **Focus unit inventory** — BE2 U6 vocab, language, skills/components, with page refs.
2. **Prior-learning candidates** — ranked list; each with citations + classification tags.
3. **Future-learning candidates** — ranked list; each with citations + classification tags.
4. **Rejected false friends** — topic/vocab matches that are **not** educationally progressive, with reason.
5. **Experiment lessons** — what this run teaches about Phase 2 method (evidence rules, failure modes).
6. **Open gaps** — what would require returning to Phase 1 or a follow-up experiment.

Do **not** require a permanent machine schema for this first run. If a temporary table or JSON sketch appears useful, mark it `EXPERIMENT_SKETCH — NOT LOCKED`.

---

## 7. Evaluation criteria

The experiment **succeeds** if the review artifact:

| # | Criterion |
|---|---|
| E1 | Separates `BOOK_EVIDENCE` from `AI_INTERPRETATION` on every material claim |
| E2 | Cites concrete Phase 1 entities (unit/page/language/vocab IDs or printed pages) for each retained link |
| E3 | Includes at least one **rejected** same-topic / shared-vocab non-progression |
| E4 | States BE1 clock-time absence as a limitation rather than inventing a prior clock unit |
| E5 | Yields 3–7 actionable method notes for the next experiment (U7 or protocol revision) |
| E6 | Does not introduce a locked Phase 2 schema or Phase 3 map |

The experiment **fails** (must revise method, not force answers) if:

- Links are asserted without citations; or
- External Big English knowledge is used to fill gaps; or
- Output silently merges evidence and interpretation.

---

## 8. Suggested working procedure

1. Inventory BE2 U6 from canonical JSON (and optionally confirm via `/app/validation` PDF).
2. Pull candidate prior units (start with BE1 U5, U7; scan others only if functionally justified).
3. Pull candidate future units (start with BE3 U1; scan others only if functionally justified).
4. Optional WB corroboration for the same unit titles.
5. Draft the review artifact with mandatory tags.
6. Owner review; decide: accept findings, revise protocol, or queue U7.

Estimated effort: one focused analysis pass + owner review. No code delivery required for a valid first run.

---

## 9. Follow-ons (not this experiment)

| Next | Condition |
|---|---|
| BE2 U7 protocol + run | After U6 review accepted or protocol revised |
| BE2 U8 protocol + run | After U7 or if owner re-prioritizes modality |
| Phase 2 schema proposal | Only after ≥1 accepted experiment shows recurring fields worth locking |
| Phase 3 mapping experiment | Parked until Phase 2 evidence is strong enough (F005) |

---

## Related

- Candidate set: [`be2-candidate-units.md`](./be2-candidate-units.md)
- D015 / D016: [`../4-decisions.md`](../4-decisions.md)
- Phase 2 purpose in process guide: [`../phase-1/curriculum-mapping-process.md`](../phase-1/curriculum-mapping-process.md) §20–21

---

## Change log

| Date | Change |
|---|---|
| 2026-10-09 | Created bounded first-experiment protocol for BE2-SB Unit 6 (D016). |
