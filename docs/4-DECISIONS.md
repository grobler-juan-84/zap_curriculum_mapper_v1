# General Curriculum Mapper — Decisions

**Status:** ACTIVE  
**Version:** 1.0  
**Purpose:** Canonical decision log. Record important settled choices with date, reason, and rejected alternatives so future AI/Cursor sessions do not reopen them without cause.

**Related:** Exploratory discussion lives in [`project-tracking/2-internal-brainstorming.md`](./project-tracking/2-internal-brainstorming.md). This file supersedes [`project-tracking/3-project-decisions.md`](./project-tracking/3-project-decisions.md) as the authoritative log.

---

## How to use

- Append only when a choice is intentionally locked.
- Do not delete superseded decisions — mark them `SUPERSEDED` and point to the replacement.
- Prefer short, concrete statements.
- Before proposing a major direction change, read this file first.

### Entry template

```markdown
### D### — Short title

**Date:** YYYY-MM-DD  
**Status:** LOCKED | SUPERSEDED  
**Decision:**  
**Reason:**  
**Alternatives rejected:**  
**Implications:**  
**Supersedes:** — or D###
```

---

## Decision index

| ID | Title | Date | Status |
|---|---|---|---|
| D001 | Phase 1 is extract-only | 2026-10-06 | LOCKED |
| D002 | Unit-batch JSON, then canonical merge | 2026-10-06 | LOCKED |
| D003 | Docs organized by phase folders | 2026-10-06 | LOCKED |
| D004 | Operating trackers live at docs root 4–7 | 2026-10-06 | LOCKED |

---

## Decisions

### D001 — Phase 1 is extract-only

**Date:** 2026-10-06  
**Status:** LOCKED  
**Decision:** Phase 1 captures what the curriculum source actually contains. No lesson planning, enrichment, or invented pedagogy in Phase 1 datasets.  
**Reason:** Preserve book-truth and keep enrichment (Phase 4+) clearly separable from evidence.  
**Alternatives rejected:** Mixing teacher tips / lesson plans into extraction JSON; treating AI inference as source content.  
**Implications:** Extraction prompt, schema, and verification stay evidence-oriented.  
**Supersedes:** —

---

### D002 — Unit-batch JSON, then canonical merge

**Date:** 2026-10-06  
**Status:** LOCKED  
**Decision:** Google AI Studio extraction returns one JSON batch per unit (with `FILE:` labels). After human verification, batches merge into one canonical book JSON.  
**Reason:** Whole-book single-shot output is unreliable; unit batches are reviewable and recoverable.  
**Alternatives rejected:** One whole-book JSON as the primary extraction artifact; keeping batches forever as the product.  
**Implications:** Registry tracks batch + book lifecycle; merge/audit are required before COMPLETE.  
**Supersedes:** —

---

### D003 — Docs organized by phase folders

**Date:** 2026-10-06  
**Status:** LOCKED  
**Decision:** Phase-specific documentation lives under `docs/phase-1` … `docs/phase-6`. Empty phase folders are intentional placeholders.  
**Reason:** Keep phase scope visible and prevent cross-phase doc sprawl at the docs root.  
**Alternatives rejected:** Flat numbered dump of all phase docs at `docs/` root.  
**Implications:** Index and cross-links must use phase paths; root docs are overview / stack / architecture / operating trackers.  
**Supersedes:** —

---

### D004 — Operating trackers live at docs root 4–7

**Date:** 2026-10-06  
**Status:** LOCKED  
**Decision:** AI-facing operating state is maintained in `4-DECISIONS.md`, `5-PROGRESS.md`, `6-TODO.md`, and `7-FUTURE.md`.  
**Reason:** Give every session a short, predictable place to read decisions, current state, actionable work, and parked ideas.  
**Alternatives rejected:** Relying only on `project-tracking/` status/decisions for day-to-day AI orientation.  
**Implications:** Cursor rules must keep these four files current; `project-tracking/` remains for steps log and brainstorming.  
**Supersedes:** —

---

## Change log

| Date | Change |
|---|---|
| 2026-10-06 | Created canonical decision log; recorded D001–D004 from existing project doctrine. |
