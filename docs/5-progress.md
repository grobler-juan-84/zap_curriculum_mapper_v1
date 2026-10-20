# General Curriculum Mapper — Progress

**Status:** ACTIVE  

**Version:** 1.0  

**Last updated:** Step 239

**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** PAUSED at 14/18 COMPLETE (D015).

- **D017** / **D018** / **D019** / **D020** LOCKED (BI methodologies provisional; Phase 3 parked as later priority).

- Git consolidation: Chalkie Workspace merged on integration branch; **`main` fast-forwarded** to consolidated tip.

- **Teacher-choice flow sketch v0.1** recorded (docs).

- **UI micro-step:** Teacher-choice packaging + local prompt preview; **server-side OpenAI generation test path** added (`POST /api/chalkie/generate`); teacher-triggered only; no persistence.

- **Dynamic source-context binding and page-scope guard** added: one resolved Chalkie lesson context from selected book/unit + open PDF pages; generation blocked when pages are outside the unit or lack verified page evidence. Horizontal suggestions remain fixture-only for BE2 U8 pp. 128–129.

- **Chalkie prep modals** top-aligned so the step header / Cancel stay fixed when step content height changes.

- **Activity evidence fix:** canonical `instruction` fallback (`title` → `activity_title` → `instruction`) + visible activity bound of six; BE3 U8 Grammar pp. 136–137 resolves `ready` from Acts 19–23 without fixtures.

## In progress

- Owner live validation of BE3 U8 pp. 136–137 Prepare Chalkie prompt route after the activity-resolution fix; OpenAI draft path keep/harden/park still owner-gated.

## Next

- Owner confirm BE3 U8 *Healthy Living* Grammar pp. 136–137 opens teacher-choice with Acts 19–23 instructions (canonical source).
- Owner run Single (BE2 U8 128–129), Series (same route), out-of-unit block; decide whether to keep, harden, or park the OpenAI path.
- Keep Phase 3 / F005 parked (D020). Do not treat Experiment 10 handoff parity as done by this evidence fix.

## Blocked

- Soft: Phase 2 closure, methodology/schema lock, Phase 3 unlock, and full prompt generation remain unauthorized without explicit owner approval.

---

## Snapshot notes

- Active Git branch: `main` (consolidated application).

- Sketch: [`phase-2/experiments/teacher-choice-flow-sketch-v0.1.md`](./phase-2/experiments/teacher-choice-flow-sketch-v0.1.md).

- Entry: `/app/chalkie` → **Prepare Chalkie prompt** → scope check → overlay `1 of 4 · Current lesson` (when source is truthful).
