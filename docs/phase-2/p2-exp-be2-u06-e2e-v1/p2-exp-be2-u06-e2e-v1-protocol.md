# P2-EXP-BE2-U06-E2E-v1 — Protocol

**Status:** ACTIVE / EXPERIMENTAL  
**Version:** 1.0  
**Date:** 2026-10-11  
**Experiment ID:** `P2-EXP-BE2-U06-E2E-v1`  
**Purpose:** Bounded end-to-end check: does Phase 2 V3.1 + Cross-Unit V1.2 improve a teacher-facing curriculum brief versus Phase 1 alone?  
**Non-claims:** Not a methodology lock. Not a Phase 3 start. Not whole-book scale. Does not modify datasets, prompts, app code, or operating trackers.

---

## 1. Question

For Big English 2 SB Unit 6 (*My Day*), with teaching focus on *When do/does…?*, present-simple agreement, and *at + time* answers: does adding Phase 2 V3.1 linguistic findings and selected Cross-Unit V1.2 connections produce a **more useful** teacher brief than Phase 1 evidence alone—or mainly more detail?

---

## 2. Scope

| Field | Value |
|---|---|
| Book | `big_english_2_sb` |
| Primary unit | `bep2_unit_06` — *My Day* — printed pp. 90–105 |
| Context units | `bep2_unit_01`, `bep2_unit_08` (via V1.2 only in Brief B) |
| Teaching focus | Routine-time Q/A; *do/does*; third-person *-s*; *at + time* |

**Out of scope:** Other units/books; regenerating Phase 1/2/JSON; infrastructure; schema lock; updating decisions/progress docs.

---

## 3. Sources (read-only)

| Role | Path |
|---|---|
| Phase 1 | `data/phase1/big_english_2_sb/canonical/v1.json` |
| Phase 2 U6 | `data/phase2/big_english_2_sb/interpretations/be2-sb-u06-v3.1.json` |
| Phase 2 U1 / U8 | `…/be2-sb-u01-v3.1.json`, `…/be2-sb-u08-v3.1.json` (context for V1.2 IDs only) |
| Cross-unit | `data/phase2/big_english_2_sb/cross-unit/be2-cross-unit-v1.2.json` |

Pre-flight: all five files parse; U6 human_verified; V1.2 schema `phase2_cross_unit_connections` `0.1.2-experimental`. Soft gaps: I Can text not extracted on `bep2_p105`; audio issues `bep2_issue_0010`, `0011`.

---

## 4. Isolation rule (mandatory)

1. **Brief A** must be drafted and saved using **only** Phase 1 U6 evidence.  
2. Phase 2 V3.1 and Cross-Unit V1.2 must **not** be opened for content while drafting Brief A.  
3. **Brief B** may then use Phase 1 + V3.1 U6 + relevant V1.2 connections.  
4. This protocol records that isolation; Brief A header restates it.

**Execution note:** Brief A file was written first from Phase 1 extraction only; Brief B was written afterward.

---

## 5. Brief format

Identical headings for A and B (~400–600 words each):

1. Main language target  
2. Relevant vocabulary  
3. Foundational knowledge evident from the source  
4. Possible student difficulties (teaching considerations — not textbook facts)  
5. Practical teaching considerations  

**V1.2 selection for B:** Prefer connections tied to the teaching focus (**CON-01**, **CON-02**). Omit CON-05–08 (and other low-relevance links) unless clearly useful.

---

## 6. Evaluation criteria

Compare A vs B on:

1. Accuracy and source traceability  
2. Identification of foundational skills  
3. Useful cross-unit connections  
4. Appropriate teaching considerations  
5. Clarity and teacher readability  
6. Practical classroom usefulness  
7. Unnecessary complexity or duplication  

For each: **Better / Equivalent / Worse** for B relative to A, with examples.  
Separately judge **genuine usefulness** vs **extra detail**. Do **not** automatically favor B.

Distinguish: direct source evidence | analytical interpretation | suggested teaching actions.

---

## 7. Deliverables

| File | Role |
|---|---|
| `p2-exp-be2-u06-e2e-v1-protocol.md` | This protocol |
| `p2-exp-be2-u06-e2e-v1-brief-a-baseline.md` | Phase 1–only brief |
| `p2-exp-be2-u06-e2e-v1-brief-b-informed.md` | Phase 1 + V3.1 + selected V1.2 |
| `p2-exp-be2-u06-e2e-v1-evaluation.md` | Comparison |

---

## 8. Explicit non-claims

- Does not validate or lock Phase 2 / V1.2 methodology.  
- Does not declare Phase 3 started.  
- Does not authorize whole-book processing.  
- Teacher usefulness remains experimentally assessed here only.
