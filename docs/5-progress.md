# General Curriculum Mapper — Progress

**Status:** ACTIVE  

**Version:** 1.0  

**Last updated:** Step 237

**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** PAUSED at 14/18 COMPLETE (D015).

- **D017** / **D018** / **D019** / **D020** LOCKED (BI methodologies provisional; Phase 3 parked as later priority).

- Git consolidation: Chalkie Workspace merged on integration branch; **`main` fast-forwarded** to consolidated tip.

- **Teacher-choice flow sketch v0.1** recorded (docs).

- **UI micro-step:** Teacher-choice packaging + local prompt preview; **server-side OpenAI generation test path** added (`POST /api/chalkie/generate`); teacher-triggered only; no persistence.

- **Dynamic source-context binding and page-scope guard** added: one resolved Chalkie lesson context from selected book/unit + open PDF pages; generation blocked when pages are outside the unit or lack verified page evidence. Horizontal suggestions remain fixture-only for BE2 U8 pp. 128–129.

## In progress

- Owner live test of Generate Chalkie lesson draft (Single + Series) with configured `OPENAI_API_KEY` / `OPENAI_MODEL`, including the new scope-guard cases.

## Next

- Owner run Single (BE2 U8 128–129), Series (same route), out-of-unit block, and another unit/spread; decide whether to keep, harden, or park the OpenAI path.
- Keep Phase 3 / F005 parked (D020).

## Blocked

- Soft: Phase 2 closure, methodology/schema lock, Phase 3 unlock, and full prompt generation remain unauthorized without explicit owner approval.

---

## Snapshot notes

- Active Git branch: `main` (consolidated application).

- Sketch: [`phase-2/experiments/teacher-choice-flow-sketch-v0.1.md`](./phase-2/experiments/teacher-choice-flow-sketch-v0.1.md).

- Entry: `/app/chalkie` → **Prepare Chalkie prompt** → scope check → overlay `1 of 4 · Current lesson` (when source is truthful).
