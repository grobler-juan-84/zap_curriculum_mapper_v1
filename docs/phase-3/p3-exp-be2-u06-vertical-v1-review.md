# P3-EXP-BE2-U06-VERTICAL-v1 — Vertical Mapping Review

**Status:** ACTIVE (awaiting owner review)  
**Version:** 1.0  
**Date:** 2026-10-09  
**Experiment ID:** `P3-EXP-BE2-U06-VERTICAL-v1`  
**Protocol:** [`p3-exp-be2-u06-vertical-v1-protocol.md`](./p3-exp-be2-u06-vertical-v1-protocol.md)  
**Decision:** [D017](../4-decisions.md)  
**Hub:** BE2-SB Unit 6 — *My Day* (`bep2_unit_06`, pp. 90–105)

**Tags:** `BOOK_EVIDENCE` | `AI_INTERPRETATION` | `UNCERTAIN` | `MISSING_EVIDENCE`  
Tables: `EXPERIMENT_SKETCH — NOT LOCKED`. Not a Phase 3 schema or product map.

---

## 0. Inputs

| Layer | Source |
|---|---|
| Phase 1 | BE1/BE2/BE3 SB canonicals (WB corroboration only where cited in Phase 2) |
| Phase 2 relationships | [`../phase-2/p2-exp-be2-u06-v1-review.md`](../phase-2/p2-exp-be2-u06-v1-review.md) |
| Phase 2 LRs | [`../phase-2/p2-exp-be2-u06-v2-review.md`](../phase-2/p2-exp-be2-u06-v2-review.md) |

This run **does not re-extract** Phase 1; it **connects** existing Phase 2 outputs into a Previous → Current → Future sketch.

---

## 1. Map overview (teacher glance)

```text
PREVIOUS (BE1)                    CURRENT (BE2 U6)                 FUTURE (BE3)
─────────────────                 ────────────────                 ────────────
U5 continuous home actions   →    timed routines (LR-03/06)   →    U1 finer times + before/after
U7 every-day meal habits     →    clock-anchored When…        →    U1 frequency set
Distributed Wh-forms         →    consolidated Wh page (LR-07) →    (later recycle; not primary)
(no BE1 clocks)              →    o'clock (LR-01/02) NEW      →    U1 non-hour times
```

All arrows are `AI_INTERPRETATION` unless an edge row below cites matching `BOOK_EVIDENCE` structures.

---

## 2. Current Learning nodes (from Phase 2 LRs)

| Current LR | Role on map | Vertical connectivity |
|---|---|---|
| LR-01 Clock times | Core | **No BE1 prior** (`MISSING_EVIDENCE`); extends to BE3 U1 finer times |
| LR-02 *What time is it?* | Core | Same as LR-01 |
| LR-03 *When do/does … at [time]* | Core | Contrastive prior BE1 U5; partial prior BE1 U7; extends to BE3 U1 |
| LR-04 *do/does* choice | Core | Mostly local to BE2 guided practice; thin prior |
| LR-05 *start/finish* | Core | **New** vs BE1; continues in BE3 schedule talk (`AI_INTERPRETATION`) |
| LR-06 Routine verb phrases | Core | Thematic prior via U5 actions (different tense); lexical overlap weak |
| LR-07 Wh- set | Core | Recycle from distributed BE1 Wh-forms |
| LR-08 Silly-time game | Supporting | Weak/uncertain continuity with BE3 silly-time check |
| LR-09 CLIL timekeeping | Supporting | Largely local; no strong vertical claim |
| LR-10 Culture schedules | Supporting | Weak thematic only — do not treat as progression |
| LR-11 Punctuality values | Supporting | Local values strand |
| LR-12 Phonics | Supporting | Local — reject as vertical link |

---

## 3. Edge inventory

`EXPERIMENT_SKETCH — NOT LOCKED`

### 3.1 Previous → Current

| Edge ID | From | To | Label | Evidence summary | Tag |
|---|---|---|---|---|---|
| E-P1 | BE1 U5 continuous home actions (`bep1_lang_0501`–`0504`) | LR-03 / LR-06 | `contrastive_prior` | Same life-domain; different tense/aspect; no clocks | Mixed: structures `BOOK_EVIDENCE`; label `AI_INTERPRETATION` |
| E-P2 | BE1 U7 *I eat … every day* (`bep1_lang_0708`) | LR-03 | `partial_prior` | Habitual present without clock anchoring | Mixed |
| E-P3 | BE1 Wh distributed (U1/U2/U4/U8) | LR-07 | `recycle` | Forms recycled into one BE2 page | Mixed |
| E-P4 | BE1 clock unit | LR-01 / LR-02 | `unsupported` | No BE1 o'clock language/vocab | `MISSING_EVIDENCE` |

### 3.2 Current → Future

| Edge ID | From | To | Label | Evidence summary | Tag |
|---|---|---|---|---|---|
| E-F1 | LR-01 / LR-02 / LR-03 | BE3 U1 *Wake Up!* (`bep_3_sb_l0001`+) | `extend` | Finer times, parts of day, before/after, frequency | Mixed |
| E-F2 | LR-05 / schedule talk | BE3 U1 sequencing | `extend` | `before`/`after` builds on timed events | `AI_INTERPRETATION` |
| E-F3 | LR-08 silly-time | BE3 U1 silly check | `weak` | Surface similarity only | `UNCERTAIN` |
| E-F4 | LR-03 bedtime/wake verbs | BE3 U8 health example | `weak` | Domain shift to past/health — not primary continuation | Mixed; primary claim **rejected** |

### 3.3 Rejected false friends (carried from Phase 2)

| Non-edge | Why rejected |
|---|---|
| Theme-only “daily life” BE1 U5 ↔ BE2 U6 | Different grammar systems |
| Zero lemma overlap BE1↔BE2 U6 targets as “recycling” | Topic without shared listed terms |
| BE3 U9 `sand` ↔ BE2 CLIL `sand` | Homograph coincidence |
| Phonics digraphs as vertical curriculum | Local practice only |

---

## 4. Gaps that constrain the map

| Gap | Tag | Implication |
|---|---|---|
| No BE1 clock prior | `MISSING_EVIDENCE` | LR-01/02 are genuine entry points — do not invent a prior edge |
| No publisher cross-level prerequisite list | `MISSING_EVIDENCE` | All edges remain interpretive |
| Thin *How do you…* (manner/transport) prior for Wh page | `UNCERTAIN` | Partial recycle only |

---

## 5. Answers to research questions

1. **Clear anchors:** LR-03/06 (priors U5/U7; future U1); LR-07 (BE1 Wh recycle); LR-01/02 (future U1 only).  
2. **Isolated / local:** LR-09–LR-12; largely LR-04/05 as system-internal.  
3. **Topic failure still holds:** theme match ≠ progression (E-P1 is contrastive, not simple prerequisite).  
4. **Schema non-invention:** This sketch uses edge IDs and provisional labels only — no JSON types, graph store, or API.

---

## 6. Evaluation (P3-E1–E7)

| ID | Result | Notes |
|---|---|---|
| P3-E1 | **PASS** | Edges cite Phase 1 IDs and/or Phase 2 LR IDs |
| P3-E2 | **PASS** | Tags on material claims |
| P3-E3 | **PASS** | §3.3 false friends |
| P3-E4 | **PASS** | E-P4 unsupported; no invented BE1 clocks |
| P3-E5 | **PASS** | Current = Phase 2 LRs |
| P3-E6 | **PASS** | Docs-only; nothing locked/implemented |
| P3-E7 | **PASS** | BE1–BE3 U6 window only |

---

## 7. Owner decisions needed

1. Accept this first vertical-map sketch as the Phase 3 method seed?  
2. Next hub: BE2 U7 food vertical, BE2 U8 ability vertical, or refine U6?  
3. Any edge labels to rename before further experiments?

**Stop:** Do not implement schema/UI/pipeline without owner approval.

---

## Change log

| Date | Change |
|---|---|
| 2026-10-09 | First Phase 3 vertical-mapping run for BE2 U6 using Phase 2 U6 v1/v2 inputs. |
