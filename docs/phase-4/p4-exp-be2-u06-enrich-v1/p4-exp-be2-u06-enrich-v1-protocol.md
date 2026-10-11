# P4-EXP-BE2-U06-ENRICH-v1 — Protocol

**Status:** ACTIVE / EXPERIMENTAL  
**Version:** 1.0  
**Date:** 2026-10-11  
**Experiment ID:** `P4-EXP-BE2-U06-ENRICH-v1`  
**Purpose:** Bounded Phase 4 enrichment probe: does Phase 2 V3.1 + Cross-Unit V1.2 help identify better, more targeted teacher enrichment opportunities than Phase 1 alone?  
**Non-claims:** Not a methodology lock. Not a formal Phase 3 or Phase 4 start. Not whole-book scale. Does not modify datasets, prompts, app code, or operating trackers.

---

## 1. Question

For Big English 2 SB Unit 6 (*My Day*), with teaching focus on *When do/does…?*, present-simple agreement, and *at + time* answers: does adding Phase 2 V3.1 linguistic findings and selected Cross-Unit V1.2 connections change **enrichment decisions** (what to intervene on, whether to intervene, priority, smallest action)—or mainly improve explanation of the same decisions?

---

## 2. Scope

| Field | Value |
|---|---|
| Book | `big_english_2_sb` |
| Primary unit | `bep2_unit_06` — *My Day* — printed pp. 90–105 |
| Context units | `bep2_unit_01`, `bep2_unit_08` (via V1.2 only in Proposal B) |
| Teaching focus | Routine-time Q/A; *do/does*; third-person *-s*; *at + time* |

**Out of scope:** Other units/books; regenerating Phase 1/2/JSON; infrastructure; schema lock; updating decisions/progress operating trackers; declaring Phase 3/4 started.

---

## 3. Sources (read-only)

| Role | Path |
|---|---|
| Phase 1 | `data/phase1/big_english_2_sb/canonical/v1.json` |
| Phase 2 U6 | `data/phase2/big_english_2_sb/interpretations/be2-sb-u06-v3.1.json` |
| Phase 2 U1 / U8 | `…/be2-sb-u01-v3.1.json`, `…/be2-sb-u08-v3.1.json` (context for V1.2 IDs only) |
| Cross-unit | `data/phase2/big_english_2_sb/cross-unit/be2-cross-unit-v1.2.json` |
| Philosophy | `docs/phase-4/teacher-enrichment-philosophy.md` |
| Prior e2e (aide) | `docs/phase-2/p2-exp-be2-u06-e2e-v1/` (Brief A allowed for Proposal A; Brief B only after A is saved) |

Soft gaps (disclose; do not invent): I Can text not extracted on `bep2_p105`; audio issues `bep2_issue_0010`, `0011`.

---

## 4. Isolation rule (mandatory)

1. **Proposal A** must be drafted and saved using **only** Phase 1 U6 evidence (+ enrichment philosophy; optionally e2e Brief A).  
2. Phase 2 V3.1 and Cross-Unit V1.2 must **not** be opened for Proposal B content while drafting Proposal A.  
3. **Proposal B** may then use Phase 1 + V3.1 U6 + relevant V1.2 connections.  
4. This protocol records that isolation; Proposal A header restates it.

---

## 5. Proposal format

Identical headings for A and B. Up to **three** enrichment opportunities (or fewer / none if the textbook already suffices). For each opportunity:

1. What is being enriched or supported?  
2. Why might students need it?  
3. What evidence justifies it? (label: textbook / AI interpretation / teacher judgment)  
4. What is the smallest practical teacher action?  
5. Priority class: essential support / optional reinforcement / extension  
6. What would make this enrichment unnecessary?

Keep A and B comparable in length and structure.

**V1.2 selection for B:** Prefer connections tied to the teaching focus (**CON-01**, **CON-02**). Omit CON-05–08 (and other low-relevance links) unless clearly useful.

---

## 6. Classification rule

Do **not** automatically treat an identified weakness as essential support.

Without actual student-performance evidence, most interventions are **conditional recommendations** (optional reinforcement, or “recommend if students struggle with X”).

Reserve **essential support** only when the textbook itself clearly under-supports a required focus skill (e.g. a gap in book practice)—not because AI or teacher judgment merely flags a predictable difficulty.

Prefer wording like “recommend if…” over “students need…”.

It is acceptable to recommend **no enrichment** when the textbook already provides sufficient support.

---

## 7. Evaluation criteria

Compare A vs B on:

1. Relevance to the teaching focus  
2. Strength of evidence  
3. Identification of meaningful learning gaps  
4. Practicality for busy teachers  
5. Appropriateness of enrichment difficulty  
6. Usefulness of cross-unit connections  
7. Unnecessary complexity or duplication  

For each: **Better / Equivalent / Worse** for B relative to A, with a short explanation.

### Decision-change analysis (required)

Evaluate **decisions**, not just proposal quality:

- List each enrichment decision (what to intervene on, whether to intervene, priority class, smallest action).  
- Mark each as **Changed** or **Unchanged** because Phase 2 / V1.2 was available.  
- If A and B recommend the **same interventions** in substance, explicitly conclude that **Phase 2 did not change the enrichment decisions**—even if B explains them more precisely or adds project IDs.  
- Count only material changes: different opportunity, different priority, different smallest action, added/removed intervention, or a cross-unit-driven choice A could not make.  
- Do **not** count longer explanations or terminology as improvements. Do **not** automatically favor B.

Distinguish: direct source evidence | analytical interpretation | suggested teaching actions.

---

## 8. Deliverables

| File | Role |
|---|---|
| `p4-exp-be2-u06-enrich-v1-protocol.md` | This protocol |
| `p4-exp-be2-u06-enrich-v1-proposal-a-phase1.md` | Phase 1–only enrichment proposals |
| `p4-exp-be2-u06-enrich-v1-proposal-b-informed.md` | Phase 1 + V3.1 + selected V1.2 |
| `p4-exp-be2-u06-enrich-v1-evaluation.md` | Comparison + decision-change analysis |

---

## 9. Explicit non-claims

- Does not validate or lock Phase 2 / V1.2 / Phase 4 methodology.  
- Does not declare Phase 3 or Phase 4 formally started.  
- Does not authorize whole-book processing.  
- Enrichment usefulness remains experimentally assessed here only.
