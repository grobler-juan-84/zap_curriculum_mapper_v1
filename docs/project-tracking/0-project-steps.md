# General Curriculum Mapper — Project Steps

**Status:** ACTIVE  
**Version:** 1.0  
**Purpose:** Chronological log of agent prompts that changed project files. Each non-Ask prompt that alters files is one step.

---

## Rules for this log

- One **step** = one user prompt (Agent / Edit / similar) that **created, modified, renamed, or deleted** any project file, including documentation and Cursor rules.
- **Ask-mode** prompts, and any prompt that only answered questions without changing files, are **not** recorded.
- Append new steps at the end. Do not renumber older steps.
- Keep each summary short and human-readable (what changed and why, not a file dump).

---

## Steps

### Step 1

**Summary:** Created the master documentation index (`docs/0-index.md`) and an always-on Cursor rule (`.cursor/rules/documentation_update.mdc`) so the index stays current when docs are added, removed, renamed, or substantively updated.

**Files touched:**
- `docs/0-index.md` (created)
- `.cursor/rules/documentation_update.mdc` (created)

---

### Step 2

**Summary:** Added a project-steps tracker under `docs/project-tracking/` and a Cursor rule that appends a step after each file-changing prompt. Updated the documentation index to include the new tracker.

**Files touched:**
- `docs/project-tracking/0-project-steps.md` (created)
- `.cursor/rules/project_steps_rule.mdc` (created)
- `docs/0-index.md` (updated)

---

### Step 3

**Summary:** Added an evolving project-status snapshot (`docs/project-tracking/1-project-status.md`) with three sections — what has been done, current status, and suggested next small step — plus a Cursor rule to refresh it after each file-changing prompt. Updated the documentation index.

**Files touched:**
- `docs/project-tracking/1-project-status.md` (created)
- `.cursor/rules/project_status_rule.mdc` (created)
- `docs/0-index.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 4

**Summary:** Documentation consistency cleanup only — normalized Phase 1 schema version notation to `0.1`, corrected stale `3`/`3A` Phase 1 doc references to `4`/`4A`, and clarified that the Overview ~90% target is qualitative, not a formal automated acceptance threshold. No architecture or data-model changes.

**Files touched:**
- `docs/4-Phase_1_Extraction_Data_Specification.md` (updated)
- `docs/2-Curriculum_Mapping_process.md` (updated)
- `docs/6-Dataset_registry.md` (updated)
- `docs/1-Project Overview.md` (updated)
- `docs/0-index.md` (updated)
- `.cursor/rules/documentation_update.mdc` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 5

**Summary:** Synced documentation to the updated Google AI Studio Prompt V2 workflow — complete textbook upload with unit-by-unit separate JSON batch outputs (`FILE:` labels). Updated the docs index and aligned Phase 1 process, extraction-spec, and registry batch-tracking language.

**Files touched:**
- `docs/0-index.md` (updated)
- `docs/2-Curriculum_Mapping_process.md` (updated)
- `docs/4-Phase_1_Extraction_Data_Specification.md` (updated)
- `docs/6-Dataset_registry.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 6

**Summary:** Created eight empty Beehive 1 SB unit JSON placeholders (`beehive_1_sb_unit_01.json` through `beehive_1_sb_unit_08.json`) under `data/phase1/beehive/`.

**Files touched:**
- `data/phase1/beehive/beehive_1_sb_unit_01.json` (created)
- `data/phase1/beehive/beehive_1_sb_unit_02.json` (created)
- `data/phase1/beehive/beehive_1_sb_unit_03.json` (created)
- `data/phase1/beehive/beehive_1_sb_unit_04.json` (created)
- `data/phase1/beehive/beehive_1_sb_unit_05.json` (created)
- `data/phase1/beehive/beehive_1_sb_unit_06.json` (created)
- `data/phase1/beehive/beehive_1_sb_unit_07.json` (created)
- `data/phase1/beehive/beehive_1_sb_unit_08.json` (created)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 7

**Summary:** Prepared the project for GitHub: added `.gitignore`, initialized a dedicated git repository inside ZAP! Curriculum Mapper (separate from the parent `kis-points` folder), created the initial commit, and pushed to `grobler-juan-84/zap_curriculum_mapper_v1`.

**Files touched:**
- `.gitignore` (created)
- `.git/` (initialized)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)
- project files committed and pushed to GitHub

---
