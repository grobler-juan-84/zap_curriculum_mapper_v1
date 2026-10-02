# General Curriculum Mapper — Project Status

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 7  
**Purpose:** Short, evolving snapshot of project progress. Rewrite the three sections below after each file-changing prompt so this file always reflects the current state.

---

## 1. What has been done

- Core Phase 1–7 architecture and curriculum philosophy documented under `docs/`.
- Documentation tooling in place (index, project-steps, project-status, Cursor rules).
- Google AI Studio Prompt V2 supports full-PDF upload with unit-by-unit JSON batch outputs.
- Beehive 1 SB Phase 1 extraction batches `unit_01`–`unit_08` exist under `data/phase1/beehive_1_sb/` (Units 4–5 appear truncated and need repair).
- Project initialized as its own git repository and prepared for GitHub (`zap_curriculum_mapper_v1`).

---

## 2. Current status

- **Focus:** Phase 1 — Curriculum Extraction & Dataset Development.
- **Extraction:** Beehive 1 SB unit batches present; validation/human verification not done; Units 4–5 incomplete; no canonical book JSON yet.
- **Registry:** Still shows BH1 as NOT STARTED (needs update).
- **Repo:** Dedicated local git repo for this project; remote target `grobler-juan-84/zap_curriculum_mapper_v1`.

---

## 3. Next small step

**Suggested next move (depends on the next prompt):** Re-extract or repair `beehive_1_sb_unit_04.json` and `beehive_1_sb_unit_05.json`, then run a validity pass on all eight unit files and update BH1 status in the dataset registry.

**Bird’s-eye still to do (not this step):** human-verify at least Unit 1; merge canonical Beehive 1 SB; continue pilot with Big English 1 and Reach Higher 2A; schema review; later phases.

---
