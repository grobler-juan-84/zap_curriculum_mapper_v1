# Phase 2 Experiment Status

**Status:** ACTIVE  
**Version:** 1.4  
**Date:** 2026-10-12  
**Purpose:** Living inventory of Phase 2 experiment lineages. Early LR, V3.1, cross-unit, e2e, and enrichment work remain **historical research evidence** (D017 principle 4). Active direction is Progressive Curriculum Intelligence (D017): minimum-sufficient Book Intelligence. Does **not** lock a Phase 2 methodology, JSON schema, storage model, or product implementation.

---

## 1. Current state

| Item | State |
|---|---|
| Git branch | `phase-2` |
| Phase 1 | PAUSED at 14/18 COMPLETE (D015) |
| Active direction | D017 Progressive Curriculum Intelligence — Book Intelligence first |
| Latest Book Intelligence experiment | [`experiments/be2-sb-u01-u09-book-overview-d017-v1.md`](./experiments/be2-sb-u01-u09-book-overview-d017-v1.md) — **executed; ChatGPT owner review recorded; not formally accepted** |
| Next proposed experiment | Compare D017 overview vs official Big English 2 publisher curriculum overview (**not started**) |
| Methodology / schema | **Experimental — NOT LOCKED** |
| Decision note | D017 LOCKED; any **D018** remains **PROPOSED only** (not approved / not recorded as LOCKED) |
| Research inventory (V3.1 + cross-unit) | [`p2-exp-be2-v3.1-cross-unit-status.md`](./p2-exp-be2-v3.1-cross-unit-status.md) |

---

## 2. D017 Book Intelligence experiment (executed)

**Big English 2 Student Book, Units 1–9:** Concise Phase 2 whole-book curriculum overview from verified Phase 1 canonical data. Publisher overview used as density benchmark only (not a fixed schema). Evidence references preserved; learning outcomes labeled AI-inferred (exact I Can text not in Phase 1 continuous text).

**Artifact:** [`experiments/be2-sb-u01-u09-book-overview-d017-v1.md`](./experiments/be2-sb-u01-u09-book-overview-d017-v1.md)

**Self-eval (see artifact §E):** E1/E2/E4/E5/E7/E8/E10 PASS; E3/E6/E9 PARTIAL (no teacher validation; outcomes not publisher-quoted; Phase 3 not tested).

### ChatGPT owner review (2026-10-12) — findings recorded

Initial ChatGPT review of the existing overview (overview **not** regenerated):

1. Promising **minimum-sufficient Phase 2 baseline**; concise teacher-readable approach aligns with Book Intelligence (D017).
2. Overview is **not formally accepted** and is **not locked** as a production standard.
3. Potential coverage gaps flagged for later verification (not yet investigated):
   - Unit 3 — old/new objects
   - Unit 6 — different ways of telling time
   - Unit 8 — animal habitats
4. **Next recommended experiment:** compare the existing overview against the official Big English 2 publisher curriculum overview across vocabulary, grammar/structures, communicative functions, learning outcomes, and supporting curriculum.
5. Proposed evaluation target for that comparison: at least **~90% meaningful coverage** — a review target only, **not** an approved production threshold.
6. Record omissions and unsupported additions separately; investigate discrepancies against verified Phase 1 canonical JSON. Investigate Workbook evidence only if validation shows a meaningful need.

**Do not** treat this review as format lock, methodology lock, or production acceptance.

---

## 3. Historical research — V3.1 + cross-unit (BE2-SB)

Preserved research artifacts; **not** the active production direction under D017.

| Artifact | Location | Outcome |
|---|---|---|
| BE2 U1 V3.1 | `data/phase2/big_english_2_sb/interpretations/be2-sb-u01-v3.1.json` | Research unit analysis |
| BE2 U6 V3.1 | `data/phase2/big_english_2_sb/interpretations/be2-sb-u06-v3.1.json` | Research unit analysis |
| BE2 U8 V3.1 | `data/phase2/big_english_2_sb/interpretations/be2-sb-u08-v3.1.json` | Research unit analysis |
| Cross-unit V1.1 | `data/phase2/big_english_2_sb/cross-unit/be2-cross-unit-v1.1.json` | Historical consolidation shape |
| Cross-unit V1.2 | `data/phase2/big_english_2_sb/cross-unit/be2-cross-unit-v1.2.json` | Connections-only research run (8 multi-unit links) |

---

## 4. Historical research — early LR experiments

| Experiment ID | Focus | Artifact | Outcome (summary) |
|---|---|---|---|
| `P2-EXP-BE2-U06-v1` | BE2 U6 relationships | [`p2-exp-be2-u06-v1-review.md`](./p2-exp-be2-u06-v1-review.md) | Prior/future candidates + evidence discipline |
| `P2-EXP-BE2-U06-v2` | BE2 U6 learning requirements | [`p2-exp-be2-u06-v2-review.md`](./p2-exp-be2-u06-v2-review.md) | Observable LR method established |
| `P2-EXP-BE2-U07-v1` | BE2 U7 LRs + generalization | [`p2-exp-be2-u07-v1-review.md`](./p2-exp-be2-u07-v1-review.md) | Method reusable with unit-native adaptations |
| `P2-EXP-BE2-U08-v1` | BE2 U8 LRs + three-unit compare | [`p2-exp-be2-u08-v1-review.md`](./p2-exp-be2-u08-v1-review.md) | D016 candidate set LR runs complete |
| `P2-EXP-BE1-U01-v1` | BE1 U1 LR transfer test | [`p2-exp-be1-u01-v1-review.md`](./p2-exp-be1-u01-v1-review.md) | Method transfers to beginner unit |

---

## 5. Historical research — later-phase influence probes

| Experiment ID | Focus | Artifact | Outcome (summary) |
|---|---|---|---|
| `P2-EXP-BE2-U06-E2E-v1` | Teacher brief A/B | [`p2-exp-be2-u06-e2e-v1/`](./p2-exp-be2-u06-e2e-v1/) | Curriculum-informed brief modestly more useful |
| `P4-EXP-BE2-U06-ENRICH-v1` | Enrichment A/B | [`../phase-4/p4-exp-be2-u06-enrich-v1/`](../phase-4/p4-exp-be2-u06-enrich-v1/) | Phase 2 did not change the three enrichment decisions |

---

## 6. What carries forward

- Verified Phase 1 Big English datasets (local / Storage).
- D017 v1 whole-book overview as a promising (**not accepted**) Book Intelligence baseline.
- D017 progressive method: validate before expanding; minimum sufficient output.
- Research artifacts above as evidence, not mandatory production depth.
- Soft open item: teacher validation of overview readability still pending after publisher comparison.

---

## 7. Explicit non-claims

- Phase 2 is **not** product-complete.
- No Phase 2 JSON schema or pipeline is approved.
- Historical V3.1 / V1.2 success does **not** lock methodology or define production output.
- The BE2 U1–9 book overview remains **experimental** — ChatGPT review recorded; **not formally accepted**.
- ~90% meaningful coverage is a **proposed comparison target**, not a locked production threshold.
- Phase 3 / Phase 4 are **not** formally started.
- D018 (if discussed) remains **PROPOSED only**.

---

## Change log

| Date | Change |
|---|---|
| 2026-10-09 | Created preservation snapshot before pushing `phase-2` and branching `phase-3`. |
| 2026-10-11 | Expanded to V3.1 + cross-unit lineage; linked validation status; kept early LR experiments as history. |
| 2026-10-11 | Recorded true Cross-Unit V1.2 connections JSON after owner update (replacing earlier mislabeled duplicate). |
| 2026-10-12 | Aligned to D017 Progressive Curriculum Intelligence; V3.1/V1.2/e2e/enrich marked research history; next proposed = BE2-SB U1–9 book overview (awaiting approval). |
| 2026-10-12 | Executed BE2-SB U1–9 D017 v1 book overview experiment; status → completed / awaiting owner review. |
| 2026-10-12 | Recorded ChatGPT owner review findings; overview not accepted; next proposed = publisher overview comparison (~90% coverage target, non-binding). |
