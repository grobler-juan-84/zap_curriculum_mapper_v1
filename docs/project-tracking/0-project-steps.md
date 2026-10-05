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

### Step 8

**Summary:** Added `.cursor/rules/github_commit_workflow.mdc` so each file-changing Agent prompt ends with a descriptive local git commit (no auto-push). Updated related tracker rules so commit runs after status/steps maintenance.

**Files touched:**
- `.cursor/rules/github_commit_workflow.mdc` (created)
- `.cursor/rules/project_steps_rule.mdc` (updated)
- `.cursor/rules/project_status_rule.mdc` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 9

**Summary:** Marked all Beehive 1 SB unit batches (`01–08`) as human-verified with batch-level `verification` objects; left open audio/workbook issues and SEL schema gaps documented. Updated dataset registry BH1 to EXTRACTED + human verification COMPLETE (Phase 1 still IN PROGRESS).

**Files touched:**
- `data/phase1/beehive_1_sb/beehive_1_sb_unit_01.json` … `unit_08.json` (updated)
- `docs/6-Dataset_registry.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 10

**Summary:** Marked all Big English 1 SB unit batches (`01–09`) as human-verified after project review; left open audio/visual issues and the Think Big schema gap documented. Updated dataset registry BE1-SB to EXTRACTED + human verification COMPLETE (Phase 1 still IN PROGRESS).

**Files touched:**
- `data/phase1/big_english_1_sb/big_english_1_sb_unit_01.json` … `unit_09.json` (updated)
- `docs/6-Dataset_registry.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 11

**Summary:** Marked Big English 2 SB units `01–09` and Reach Higher 2A units `1–3` human-verified after project review; left RH2A Unit 4 pending extraction restriction. Repaired truncated BE2 Unit 2 JSON (reconstructed header; pages/vocabulary/language empty with open issue). Updated dataset registry for BE2-SB (COMPLETE) and RH2A (PARTIAL).

**Files touched:**
- `data/phase1/big_english_2_sb/big_english_2_sb_unit_01.json` … `unit_09.json` (updated)
- `data/phase1/reach_higher_2a/rh2a_sb_unit1.json` … `unit3.json` (updated)
- `docs/6-Dataset_registry.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 12

**Summary:** Created evolving internal brainstorming and locked project-decisions trackers under `docs/project-tracking/`, seeded brainstorming with current open Phase 1 questions, and registered both docs in the documentation index.

**Files touched:**
- `docs/project-tracking/2-internal-brainstorming.md` (created)
- `docs/project-tracking/3-project-decisions.md` (created)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 13

**Summary:** Added brief brainstorming Q&A on one canonical JSON per book, schema-first storage vs early relational tables, SaaS options for storing book JSON, and two pre-coding thinking steps.

**Files touched:**
- `docs/project-tracking/2-internal-brainstorming.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 14

**Summary:** Added brainstorming answer on JSON-only vs later relational: lean hybrid (JSON curriculum source of truth + thin relational app/ops metadata; normalize curriculum tables only if needed).

**Files touched:**
- `docs/project-tracking/2-internal-brainstorming.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 15

**Summary:** Explained in brainstorming how a React/Vite/Vercel app would create JSON via Gemini API and persist it to Blob/DB (not Vercel filesystem), replacing today’s Cursor/manual save workflow.

**Files touched:**
- `docs/project-tracking/2-internal-brainstorming.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 16

**Summary:** Verified restored Big English 2 SB Unit 2 re-extraction (valid JSON; pages/vocabulary/language populated; title `My Games`); marked human-verified; cleared truncation notes in registry and brainstorming.

**Files touched:**
- `data/phase1/big_english_2_sb/big_english_2_sb_unit_02.json` (updated)
- `docs/6-Dataset_registry.md` (updated)
- `docs/project-tracking/2-internal-brainstorming.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 17

**Summary:** Added Reach Higher 2A Unit 4 extraction as two batch files (part1/part2) after citation limits blocked a single JSON; updated registry to EXTRACTED + PARTIAL verification.

**Files touched:**
- `data/phase1/reach_higher_2a/rh2a_sb_unit4_part1.json` (created)
- `data/phase1/reach_higher_2a/rh2a_sb_unit4_part2.json` (created)
- `docs/6-Dataset_registry.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---
