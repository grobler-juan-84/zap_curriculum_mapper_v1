# Teacher Intelligence left-pane contract v0.1

**Status:** ACTIVE (design record)  
**Version:** 0.1  
**Date:** 2026-10-21  
**Type:** Information-architecture contract only  

**Not:** UI implementation, schema lock, AI feature, Chalkie generation, or platform-adapter work.

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
| Provenance | Label as **AI-inferred / Phase 2 interpretation** — never as current-page publisher evidence |
| Available vs selected | **Available** for reading; not auto-selected into the package as page evidence |
| Empty state | Honest unavailable when BI/Storage overview is missing for the book/unit |
| Boundary | Informs teacher judgement; **must not silently become page-level source evidence** |

#### 2. Horizontal Mapping

| Rule | Detail |
|---|---|
| Question | What useful earlier content is available to retrieve or reinforce? |
| Content | Earlier lessons in the same unit; earlier units in the same book ([F022](../7-future.md)) |
| Provenance | Provenance-labelled candidates; **prior exposure ≠ mastery** |
| Available vs selected | Pool is available; inclusion is **optional and teacher-selected** only |
| Empty state | Honest “horizontal mapping not available yet” — no guessed retrieval |
| Boundary | Not current-page evidence; not auto-inserted into prompts |

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
| Current source evidence | Always (when pages resolve) | **Required** |
| Unit Intelligence | When BI exists for book/unit | Read-only judgement aid; not silent page evidence |
| Horizontal Mapping | When candidates exist (future) | Only if teacher selects |
| School-Specific Notes | When teacher/school saved notes | Only if teacher selects relevant notes |
| Future Suggestions | Out of scope now | Only after explicit acceptance (future) |

---

## Handoff boundary

```text
Required:     verified current-page source evidence
Optional:     teacher-selected Horizontal Mapping + relevant School-Specific Notes
Judgement:    Unit Intelligence (does not silently become page evidence)
Future only:  Suggestions after explicit teacher acceptance
                    │
                    ▼
            Neutral lesson package
            (platform-independent; F021)
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   Chalkie      MagicSchool    Canva …
   Workspace    Workspace      Workspace
   (adapter)    (future)       (future)
```

- The **neutral lesson package** remains platform-independent ([F021](../7-future.md)).
- **Chalkie Workspace** is the current platform adapter that translates the package into a Chalkie-specific handoff.
- Future MagicSchool / Canva / etc. workspaces would be **parallel adapters**, not replacements for Chalkie or for the evidence layer.

---

## Relationship to existing work

| Item | Relationship |
|---|---|
| [F021](../7-future.md) | Neutral package + separate platform workspaces — this pane feeds the package, not a single vendor UI |
| [F022](../7-future.md) | Horizontal Mapping is the left-pane home for selectable prior-learning candidates (not implemented here) |
| [Chalkie Workspace prototype](./p5-prototype-chalkie-workspace.md) | Current adapter UI; already has source summaries + a read-only Unit Intelligence accordion precursor |
| D018 / handoff builders | **Unchanged** by this record |
| `docs/4-decisions.md` | **Unchanged** by this record |

---

## Explicit non-goals (this record)

- No app code, routes, or component work authorized beyond documenting the contract.
- No data schema, Storage, or Postgres changes.
- No AI/API calls, automatic prompt insertion, or Chalkie generation.
- No implementation of Horizontal Mapping, School-Specific Notes, or Future Suggestions UI.
- No claim that today’s handoff objects are already a locked neutral lesson package.

---

## Next implementation slice (smallest)

**Only:** keep / treat the **read-only Unit Intelligence** accordion in Chalkie Workspace as the first Teacher Intelligence surface under this contract — with an honest unavailable state when Book Intelligence is missing.

**Do not** implement Horizontal Mapping, School-Specific Notes, or Future Suggestions yet.

---

## Document history

| Date | Note |
|---|---|
| 2026-10-21 | v0.1 design record created (IA contract only). |
