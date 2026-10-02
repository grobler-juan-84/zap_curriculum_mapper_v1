# General Curriculum Mapper — Project Status

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 8  
**Purpose:** Short, evolving snapshot of project progress. Rewrite the three sections below after each file-changing prompt so this file always reflects the current state.

---

## 1. What has been done

- Core Phase 1–7 architecture and curriculum philosophy documented under `docs/`.
- Documentation tooling in place (index, project-steps, project-status, Cursor rules).
- Google AI Studio Prompt V2 supports full-PDF upload with unit-by-unit JSON batch outputs.
- Beehive 1 SB Phase 1 extraction batches `unit_01`–`unit_08` exist under `data/phase1/beehive_1_sb/` (Units 4–5 previously truncated; Unit 4 may now be repaired locally).
- GitHub repo initialized and initial commit pushed to `grobler-juan-84/zap_curriculum_mapper_v1`.
- Added always-on Cursor rule `github_commit_workflow.mdc` to auto-commit locally after each file-changing prompt (no auto-push).

---

## 2. Current status

- **Focus:** Phase 1 — Curriculum Extraction & Dataset Development.
- **Extraction:** Beehive 1 SB unit batches present; validation/human verification incomplete; Unit 5 may still need repair; no canonical book JSON yet.
- **Repo:** Local commits now expected after every Agent file-changing prompt; push remains manual/explicit only.
- **Registry:** Still needs BH1 status update.

---

## 3. Next small step

**Suggested next move (depends on the next prompt):** Confirm Units 4–5 are complete valid JSON, commit any remaining extraction repairs, run a validity pass on all eight unit files, and update BH1 in the dataset registry.

**Bird’s-eye still to do (not this step):** human-verify Unit 1; merge canonical Beehive 1 SB; continue pilot with Big English 1 and Reach Higher 2A; schema review; later phases.

---
