# Teacher Intelligence left-pane contract v0.1

**Status:** ACTIVE (design record)  
**Version:** 0.1.6  
**Date:** 2026-10-25  
**Type:** Information-architecture contract  

**Implementation status (2026-10-21):** **Unit Intelligence** accordion is implemented in Chalkie Workspace (`/app/chalkie` left panel). Future Suggestions remain **not implemented**. School-Specific Notes remain **not implemented** (design intent in §3 only — not an active product track; no coverage gate or unlock-pack contract).

**Prior Learning / Horizontal Mapping (2026-10-24):** Slice 1–3 implemented on Step 2 (same-unit `[PRIOR]` + curated `[HM]` for BE2 U8 opener). Left-pane Horizontal Mapping accordion still not built. Audit: [`chalkie-prior-learning-horizontal-mapping-audit-v0.1.md`](./chalkie-prior-learning-horizontal-mapping-audit-v0.1.md).

**NLP / BI boundary ([D022](../4-decisions.md), 2026-10-25):** Unit Intelligence may feed the Neutral Lesson Package’s optional `curriculumInterpretation.bookIntelligence` bag when assembled. It still **must not** mutate source scope, activity selection, page-scoped vocabulary/language, or be labelled as `[SB]`/`[WB]` evidence.

**Not:** schema lock, AI feature, Chalkie generation authorization, or multi-platform adapter expansion.

---

## Purpose

Define what the **left side** of a future lesson-preparation workspace shows a teacher **before** a neutral lesson package and any platform-specific handoff are created.

This contract separates:

1. **SOURCE CONTEXT** — verified current-page evidence (“what are you teaching now?”).
2. **TEACHER INTELLIGENCE** — planning support layers that inform judgement and optional selection; they are not publisher page evidence.

---

## Left-pane structure

```text
SOURCE CONTEXT
- Current Pages / Current Source Evidence
  “What are you teaching now?”
  Verified, scoped current-page evidence only.

TEACHER INTELLIGENCE
1. Unit Intelligence
   “What is this unit actually teaching in English terms?”
2. Horizontal Mapping
   “What useful earlier content is available to retrieve or reinforce?”
3. School-Specific Notes
   “What local learner errors or teaching priorities should I remember?”
4. Future Suggestions
   Later AI/system suggestions only (proposed + teacher-accepted).
```

### SOURCE CONTEXT — Current Pages / Current Source Evidence

| Rule | Detail |
|---|---|
| Question | What are you teaching now? |
| Content | Verified, scoped current-page (or verified companion) publisher evidence only |
| Provenance | Phase 1 / canonical page evidence; SB-anchored under D021 when preparing a lesson |
| Role in handoff | **Required** input to any neutral package / platform handoff |
| Empty state | Honest “no page evidence for this selection” — do not invent pages |

In the current Chalkie prototype this maps to Unit Summary + **SB Pages Summary** (+ optional **WB Pages Summary** for a verified companion). Workbook viewing must not rewrite lesson identity to WB.

### TEACHER INTELLIGENCE

#### 1. Unit Intelligence

| Rule | Detail |
|---|---|
| Question | What is this unit actually teaching in English terms? |
| Content | Phase 2 interpretation / planning support (e.g. Book Intelligence overview) |
| Provenance | Label as **`phase2_interpretation` / AI-inferred** — never as current-page publisher evidence |
| Available vs selected | **Available** for reading in the left pane; when an NLP is assembled, filtered BI planning fields may attach as optional `curriculumInterpretation` ([D022](../4-decisions.md)) |
| Empty state | Honest unavailable when BI/Storage overview is missing for the book/unit; NLP still assembles without BI |
| Boundary | Informs teacher judgement and optional labelled NLP planning context; **must not silently become page-level source evidence**, set scope, or populate activity selection / page vocab / language models |

#### 2. Horizontal Mapping

| Rule | Detail |
|---|---|
| Question | What useful earlier content is available to retrieve or reinforce? |
| Content | Earlier lessons in the same unit (`[PRIOR]`); earlier units in the same book (`[HM]`) only via human-curated evidence ([F022](../7-future.md)); session teacher-added stays separate |
| Provenance | Provenance-labelled candidates; **prior exposure ≠ mastery**; never infer usefulness from word similarity alone |
| Available vs selected | Pool is available; inclusion is **optional and teacher-selected** only — never auto-selected |
| Empty state | Honest “horizontal mapping not available yet” — no guessed retrieval |
| Boundary | Not current-page evidence; cannot restore excluded SB/WB activities; not auto-inserted into prompts |
| Design audit | [`chalkie-prior-learning-horizontal-mapping-audit-v0.1.md`](./chalkie-prior-learning-horizontal-mapping-audit-v0.1.md) — Slice 1–3 on Step 2; left-pane HM accordion still not built |

#### 3. School-Specific Notes

| Rule | Detail |
|---|---|
| Question | What local learner errors or teaching priorities should I remember? |
| Content | Teacher/school-created notes (e.g. recurring language errors) |
| Provenance | Label as **school/teacher note** — not publisher evidence, not curriculum truth |
| Available vs selected | Available locally; relevant notes may be **teacher-selected** into support context |
| Empty state | Empty list is normal; do not invent school notes |
| Boundary | Not automatically inserted into a handoff |

#### 4. Future Suggestions

| Rule | Detail |
|---|---|
| Question | What might the system propose next? |
| Content | Later AI/system suggestions only |
| Provenance | Label as **suggestion (proposed)** until teacher accepts |
| Available vs selected | Proposed items stay out of the package until **explicit teacher acceptance** |
| Empty state | Omit or “no suggestions” — **not in current scope** |
| Boundary | Never automatic |

---

## Available vs selected

| Layer | Available in left pane | Selected into package / handoff |
|---|---|---|
| Current source evidence | Always (when pages resolve) | **Required** (`sourceEvidence`) |
| Unit Intelligence | When BI exists for book/unit | Optional labelled `curriculumInterpretation` when NLP assembles; never silent page evidence |
| Horizontal Mapping | When candidates exist (Step 2 pool) | Only if teacher selects (`teacherContext` / prior support) |
| School-Specific Notes | When teacher/school saved notes | Only if teacher selects relevant notes (parked product) |
| Future Suggestions | Out of scope now | Only after explicit acceptance (future) |

---

## Handoff boundary

```text
Required:     verified current-page source evidence
Optional:     teacher-selected Horizontal Mapping + relevant School-Specific Notes
Optional:     Unit Intelligence → labelled curriculumInterpretation (D022)
Future only:  Suggestions after explicit teacher acceptance
                    │
                    ▼
            Neutral lesson package
            (platform-independent; D022 / F021)
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   Chalkie      MagicSchool    Canva …
   Workspace    Workspace      Workspace
   (adapter)    (future)       (future)
```

- The **neutral lesson package** is the durable handoff ([D022](../4-decisions.md); [F021](../7-future.md)).
- **Chalkie Workspace** is the current platform adapter that translates the package into a Chalkie-specific handoff.
- Future MagicSchool / Canva / etc. workspaces would be **parallel adapters**, not replacements for Chalkie or for the evidence layer.

---

## Relationship to existing work

| Item | Relationship |
|---|---|
| [D022](../4-decisions.md) | NLP durable handoff; BI optional `curriculumInterpretation` only |
| [F021](../7-future.md) | Neutral package + separate platform workspaces — this pane feeds the package, not a single vendor UI |
| [F022](../7-future.md) | Horizontal Mapping candidates (Step 2 Slice 1–3; left-pane accordion not built) |
| [Chalkie Workspace prototype](./p5-prototype-chalkie-workspace.md) | Current adapter UI; source summaries + **implemented** Unit Intelligence accordion |
| D018 / handoff builders | Unchanged by this contract record alone |

---

## Explicit non-goals (this record)

- No data schema, Storage, or Postgres changes from this contract alone.
- No AI/API calls or Chalkie generation authorization driven solely by Unit Intelligence.
- No implementation of Horizontal Mapping left-pane accordion, School-Specific Notes, or Future Suggestions UI.
- No claim that today’s package is a locked fully multi-platform product.
- Unit Intelligence must not alter **source evidence** (scope, activity selection, page vocab/language). Optional labelled NLP interpretation attach is authorized by D022.

---

## Implementation notes (Unit Intelligence slice)

| Item | Status |
|---|---|
| Left-panel accordion after source summaries | Done in `ChalkieLeftPanel` |
| Load BI via Storage registry/loader for selected book | Done in `ChalkieWorkspace` |
| Compact fields + AI-inferred Learning Outcomes badge | Done via `chalkieUnitIntelligence.ts` |
| Exact unavailable copy when BI missing | Done (`UNIT_INTELLIGENCE_EMPTY_MESSAGE`) |
| Does not mutate source evidence; may feed NLP interpretation bag (D022) | Display done; NLP attach per D022 implementation |
| Horizontal Mapping left-pane accordion / Future Suggestions | **Not started** (HM Step 2 candidates exist) |
| School-Specific Notes | **Not implemented** — design intent only; not an active product track |

---

## Next implementation slice (smallest)

Prefer Prior Learning / curated `[HM]` work already in flight (new verified `[HM]` pack per authoring contract). **Do not** invent School Notes UI, seed notes, or build School Notes gates/contracts without an approved plan and source pack.

Optional later: wire more books into the BI Storage registry so Unit Intelligence covers more catalog books (still read-only).

---

## Document history

| Date | Note |
|---|---|
| 2026-10-21 | v0.1 design record created (IA contract only). |
| 2026-10-21 | v0.1.1 — Unit Intelligence accordion marked implemented in Chalkie Workspace; other Teacher Intelligence sections still out of scope. |
| 2026-10-24 | v0.1.5 — Linked Prior Learning Slice 1–3; School Notes remains design-only (premature §8b / unlock-pack prep removed). |
