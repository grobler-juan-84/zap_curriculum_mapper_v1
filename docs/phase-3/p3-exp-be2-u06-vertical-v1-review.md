# P3-EXP-BE2-U06-VERTICAL-v1 — Vertical Mapping Review

**Status:** ACTIVE — **owner provisional acceptance** as an experimental starting point (**not** a locked methodology)  
**Version:** 1.1  
**Date:** 2026-10-09  
**Experiment ID:** `P3-EXP-BE2-U06-VERTICAL-v1`  
**Protocol:** [`p3-exp-be2-u06-vertical-v1-protocol.md`](./p3-exp-be2-u06-vertical-v1-protocol.md)  
**Decision:** [D017](../4-decisions.md)  
**Hub:** BE2-SB Unit 6 — *My Day* (`bep2_unit_06`, pp. 90–105)

**Tags:** `BOOK_EVIDENCE` | `AI_INTERPRETATION` | `UNCERTAIN` | `MISSING_EVIDENCE`  
Tables: `EXPERIMENT_SKETCH — NOT LOCKED`. Not a Phase 3 schema or product map.

**Evidence-gap convention (clarified v1.1):**
- **Documented absence** — Phase 1 complete-book scan shows the content is not in that book (e.g. no BE1 clock-time language). Not an extraction failure.
- **`MISSING_EVIDENCE`** — expected detail is incomplete in Phase 1 JSON (e.g. I Can wording not extracted) or a citation cannot be completed.

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
(no BE1 clocks — documented) →    o'clock (LR-01/02) NEW      →    U1 non-hour times
```

All arrows are `AI_INTERPRETATION` unless an edge row below cites matching `BOOK_EVIDENCE` structures.

---

## 2. Current Learning nodes (from Phase 2 LRs)

| Current LR | Role on map | Vertical connectivity |
|---|---|---|
| LR-01 Clock times | Core | **No BE1 prior** (documented absence); extends to BE3 U1 finer times |
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
| LR-12 Phonics | Supporting | Local — leave unmapped |

---

## 3. Edge inventory

`EXPERIMENT_SKETCH — NOT LOCKED`

### 3.1 Previous → Current

| Edge ID | From | To | Label | Evidence summary | Tag |
|---|---|---|---|---|---|
| E-P1 | BE1 U5 continuous home actions (`bep1_lang_0501`–`0504`) | LR-03 / LR-06 | `contrastive_prior` | Same life-domain; different tense/aspect; no clocks | Structures `BOOK_EVIDENCE`; label `AI_INTERPRETATION` |
| E-P2 | BE1 U7 *I eat … every day* (`bep1_lang_0708`) | LR-03 | `partial_prior` | Habitual present without clock anchoring | Structures `BOOK_EVIDENCE`; label `AI_INTERPRETATION` |
| E-P3 | BE1 Wh distributed (U1/U2/U4/U8) | LR-07 | `recycle` | Forms recycled into one BE2 page | Structures `BOOK_EVIDENCE`; label `AI_INTERPRETATION` |
| E-P4 | *(none)* | LR-01 / LR-02 | — | **Documented absence:** BE1-SB scan found no o'clock / *What time is it?* language or vocab targets | Documented absence (not extraction gap) |

### 3.2 Current → Future

| Edge ID | From | To | Label | Evidence summary | Tag |
|---|---|---|---|---|---|
| E-F1 | LR-01 / LR-02 / LR-03 | BE3 U1 *Wake Up!* (`bep_3_sb_l0001`, `l0002`, `l0004`; frequency `bep3_lang_0001`–`0003`) | `extend` | Finer times, parts of day, before/after, frequency | Structures `BOOK_EVIDENCE`; label `AI_INTERPRETATION` |
| E-F2 | LR-05 / schedule talk | BE3 U1 `before`/`after` (`bep_3_sb_l0007`, `bep3_lang_0005`) | `extend` | Sequencing builds on timed events | `AI_INTERPRETATION` |
| E-F3 | LR-08 silly-time | BE3 U1 silly check (`bep3_lang_0006`) | `weak` | Surface similarity only | `UNCERTAIN` |
| E-F4 | LR-03 bedtime/wake verbs | BE3 U8 health example (`bep3_sb_lang_08_05`) | — | Domain shift — **left unmapped** as primary continuation | Rejected primary claim |

### 3.3 Rejected / unmapped

| Non-edge | Why |
|---|---|
| Theme-only “daily life” BE1 U5 ↔ BE2 U6 | Different grammar systems |
| Zero lemma overlap BE1↔BE2 U6 as “recycling” | Topic without shared listed terms |
| BE3 U9 `sand` ↔ BE2 CLIL `sand` | Homograph coincidence |
| Phonics digraphs | Local practice — leave unmapped |

---

## 4. Gaps

| Gap | Kind | Implication |
|---|---|---|
| No BE1 clock prior | Documented absence | LR-01/02 are entry points — do not invent a prior edge |
| No publisher cross-level prerequisite list | Documented absence in Phase 1 | All edges remain interpretive |
| Exact BE2 U6 I Can wording | `MISSING_EVIDENCE` (not extracted) | Does not block vertical sketch |
| Thin *How do you…* (manner) prior for Wh page | `UNCERTAIN` | Partial recycle only |

---

## 5. Answers to research questions

1. **Clear anchors:** LR-03/06 (priors U5/U7; future U1); LR-07 (BE1 Wh recycle); LR-01/02 (future U1 only).  
2. **Isolated / local:** LR-09–LR-12; largely LR-04/05 as system-internal.  
3. **Topic failure still holds:** theme match ≠ progression (E-P1 is contrastive, not simple prerequisite).  
4. **Schema non-invention:** Edge IDs and provisional labels only — no JSON types, graph store, or API.

---

## 6. Evaluation (P3-E1–E7)

| ID | Result | Notes |
|---|---|---|
| P3-E1 | **PASS** | Edges cite Phase 1 IDs and/or Phase 2 LR IDs |
| P3-E2 | **PASS** | Tags on material claims |
| P3-E3 | **PASS** | §3.3 |
| P3-E4 | **PASS** | E-P4 documented absence; no invented BE1 clocks |
| P3-E5 | **PASS** | Current = Phase 2 LRs |
| P3-E6 | **PASS** | Docs-only; nothing locked/implemented |
| P3-E7 | **PASS** | BE1–BE3 U6 window only |

---

## 7. Owner status

**Provisional acceptance (2026-10-09):** Unit 6 vertical sketch may be used as an **experimental starting point** for further Phase 3 hubs. This is **not** a locked methodology, schema, or product design.

Next hub executed separately: BE2 Unit 8 (*Wild Animals*).

---

## Change log

| Date | Change |
|---|---|
| 2026-10-09 | First Phase 3 vertical-mapping run for BE2 U6 using Phase 2 U6 v1/v2 inputs. |
| 2026-10-09 | v1.1: provisional owner acceptance; clarify documented absence vs `MISSING_EVIDENCE`; tighten BE3 citations; leave weak primary claims unmapped. |
