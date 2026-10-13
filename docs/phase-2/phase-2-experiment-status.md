# Phase 2 Experiment Status

**Status:** ACTIVE  
**Version:** 1.5  
**Date:** 2026-10-13  
**Purpose:** Living inventory of Phase 2 experiment lineages. Early LR, V3.1, cross-unit, e2e, and enrichment work remain **historical research evidence** (D017 principle 4). Active direction is Progressive Curriculum Intelligence (D017): minimum-sufficient Book Intelligence. Does **not** lock a Phase 2 methodology, JSON schema, storage model, or product implementation.

---

## 1. Current state

| Item | State |
|---|---|
| Git branch | `phase-2` |
| Phase 1 | PAUSED at 14/18 COMPLETE (D015) |
| Active direction | D017 Progressive Curriculum Intelligence — Book Intelligence first |
| Latest Book Intelligence experiment | D017 **v2** comparison candidate executed; **v1 preserved**; neither formally accepted |
| Next proposed step | Owner review of v2 (endorse as working baseline or request tweaks) |
| Methodology / schema | **Experimental — NOT LOCKED** |
| Decision note | D017 LOCKED; any **D018** remains **PROPOSED only** (not approved / not recorded as LOCKED) |
| Research inventory (V3.1 + cross-unit) | [`p2-exp-be2-v3.1-cross-unit-status.md`](./p2-exp-be2-v3.1-cross-unit-status.md) |

---

## 2. D017 Book Intelligence experiments

### v1 (preserved baseline)

**Artifact:** [`experiments/be2-sb-u01-u09-book-overview-d017-v1.md`](./experiments/be2-sb-u01-u09-book-overview-d017-v1.md)

ChatGPT owner review (2026-10-12): promising minimum-sufficient baseline; **not formally accepted**; flagged U3 old/new, U6 telling-time variants, U8 habitats; proposed publisher comparison.

### v2 (comparison candidate — 2026-10-13)

**Artifacts:**
- Overview: [`experiments/be2-sb-u01-u09-book-overview-d017-v2.md`](./experiments/be2-sb-u01-u09-book-overview-d017-v2.md)
- Review bundle (v1 vs v2 + publisher comparison + LO assessment): [`experiments/be2-sb-u01-u09-overview-v2-review.md`](./experiments/be2-sb-u01-u09-overview-v2-review.md)

**What changed:** eight-column layout (CLIL/Culture, Values, Phonics split); corrected flagged U3/U6/U8 omissions using Phase 1 evidence; Learning Outcomes still AI-inferred but meaning-aligned to publisher I Can where Phase 1 supports.

**Publisher comparison (AI-assessed):** ~**92%** meaningful coverage vs official Scope and Sequence (review target ~90%; not a locked production threshold). Flagged gaps were Phase 2 interpretation omissions, not Phase 1 extraction gaps. Soft upstream note: exact I Can sentence text still missing from Phase 1.

**Non-claims:** v2 is **not** accepted, **not** production-ready, and does **not** lock methodology/schema. D018 remains PROPOSED only.

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
- D017 v1 overview as preserved baseline; v2 as refined comparison candidate (**neither accepted**).
- D017 progressive method: validate before expanding; minimum sufficient output.
- Research artifacts above as evidence, not mandatory production depth.
- Soft open item: teacher validation of overview readability still pending.

---

## 7. Explicit non-claims

- Phase 2 is **not** product-complete.
- No Phase 2 JSON schema or pipeline is approved.
- Historical V3.1 / V1.2 success does **not** lock methodology or define production output.
- BE2 U1–9 overviews (v1 and v2) remain **experimental** — **not formally accepted**.
- ~90% meaningful coverage is a **comparison review target**, not a locked production threshold.
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
| 2026-10-13 | Executed D017 v2 second pass + publisher S&S comparison; U3/U6/U8 gaps corrected; v2 not accepted; awaiting owner review. |
