# General Curriculum Mapper — Progress

**Status:** ACTIVE  

**Version:** 1.0  

**Last updated:** Step 236

**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** PAUSED at 14/18 COMPLETE (D015).

- **D017** / **D018** / **D019** / **D020** LOCKED (BI methodologies provisional; Phase 3 parked as later priority).

- Git consolidation: Chalkie Workspace merged on integration branch; **`main` fast-forwarded** to consolidated tip (`b7d3c04`).

- **Teacher-choice flow sketch v0.1** recorded (docs).

- **UI micro-step:** Teacher-choice packaging + local prompt preview; **server-side OpenAI generation test path** added (`POST /api/chalkie/generate`); teacher-triggered only; no persistence.

## In progress

- Owner live test of Generate Chalkie lesson draft (Single + Series) with configured `OPENAI_API_KEY` / `OPENAI_MODEL`.

## Next

- Owner run one Single and one Series draft generation; decide whether to keep, harden, or park the OpenAI path.
- Keep Phase 3 / F005 parked (D020).
- OpenAI Chalkie Generate remains deferred from this launch path until the guided flow is further defined.

## Blocked

- Soft: Phase 2 closure, methodology/schema lock, Phase 3 unlock, and full prompt generation remain unauthorized without explicit owner approval.

---

## Snapshot notes

- Active Git branch: `main` (consolidated application).

- Sketch: [`phase-2/experiments/teacher-choice-flow-sketch-v0.1.md`](./phase-2/experiments/teacher-choice-flow-sketch-v0.1.md).

- Entry: `/app/chalkie` → **Prepare Chalkie prompt** → overlay `1 of 4 · Current lesson`.
