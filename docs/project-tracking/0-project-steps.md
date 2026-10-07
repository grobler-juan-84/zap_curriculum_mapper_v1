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

### Step 18

**Summary:** Audited the docs reorg into `phase-1`…`phase-6` folders; refreshed `docs/0-index.md` paths/sections and updated cross-document filename references in Phase 1 docs (plus the documentation-index Cursor rule examples).

**Files touched:**
- `docs/0-index.md` (updated)
- `docs/phase-1/Curriculum_Mapping_process.md` (updated; moved/renamed from `docs/2-Curriculum_Mapping_process.md`)
- `docs/phase-1/Google_AI_Studio_Prompt.md` (moved/renamed from `docs/3-Google_AI_Studio_Prompt.md`)
- `docs/phase-1/Extraction_Data_Specification.md` (updated; moved/renamed from `docs/4-Phase_1_Extraction_Data_Specification.md`)
- `docs/phase-1/JSON_Schema.md` (moved/renamed from `docs/4A-Phase_1_JSON_Schema.md`)
- `docs/phase-1/Dataset_registry.md` (updated; moved/renamed from `docs/6-Dataset_registry.md`)
- `docs/phase-4/Teacher_Enrichment_Philosophy.md` (moved/renamed from `docs/5-Teacher_Enrichment_Philosophy.md`)
- `docs/phase-6/ChalkieAI_Handover_specifications.md` (moved/renamed from `docs/7-ChalkieAI_Handover_specifications.md`)
- `docs/phase-2/.gitignore` (created; empty phase placeholder)
- `docs/phase-3/.gitignore` (created; empty phase placeholder)
- `docs/phase-5/.gitignore` (created; empty phase placeholder)
- `.cursor/rules/documentation_update.mdc` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 19

**Summary:** Added root operating trackers `4-DECISIONS`, `5-PROGRESS`, `6-TODO`, and `7-FUTURE`; wired Cursor rules to keep them current every Agent prompt; pointed legacy project-tracking status/decisions at the new canonical files; refreshed the docs index (including tech-stack and architecture).

**Files touched:**
- `docs/4-DECISIONS.md` (created)
- `docs/5-PROGRESS.md` (created)
- `docs/6-TODO.md` (created)
- `docs/7-FUTURE.md` (created)
- `docs/0-index.md` (updated)
- `.cursor/rules/operating_trackers.mdc` (created)
- `.cursor/rules/project_status_rule.mdc` (updated)
- `.cursor/rules/project_steps_rule.mdc` (updated)
- `.cursor/rules/github_commit_workflow.mdc` (updated)
- `docs/project-tracking/1-project-status.md` (updated → legacy pointer)
- `docs/project-tracking/3-project-decisions.md` (updated → legacy pointer)
- `docs/project-tracking/2-internal-brainstorming.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 20

**Summary:** Consolidated RH2A Unit 4 part1/part2 extraction batches into a single `rh2a_sb_unit4.json` (no ID collisions); removed the split files and updated registry/progress/todo accordingly.

**Files touched:**
- `data/phase1/reach_higher_2a/rh2a_sb_unit4.json` (created)
- `data/phase1/reach_higher_2a/rh2a_sb_unit4_part1.json` (deleted)
- `data/phase1/reach_higher_2a/rh2a_sb_unit4_part2.json` (deleted)
- `docs/phase-1/Dataset_registry.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 21

**Summary:** Initialized technology scaffold only: Vite/React/TypeScript/Tailwind under `app/`, Supabase local config under `supabase/`, minimal Python tooling under `python/`, root `.env.example` + README; locked Supabase as backend platform (D005) without live project wiring or curriculum feature work.

**Files touched:**
- `app/` (created — Vite React TS Tailwind scaffold + minimal shell)
- `supabase/` (created — local config only)
- `python/` (created — tooling foundation)
- `schemas/` (created — placeholder + README)
- `scripts/` (created — placeholder)
- `.env.example` (created)
- `README.md` (created)
- `.gitignore` (updated)
- `docs/2-tech-stack.md` (updated)
- `docs/4-DECISIONS.md` (updated — D005)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/7-FUTURE.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 22

**Summary:** Added clean zcmv1-inspired public UI: landing page plus login, signup, forgot-password, and reset-password screens with React Router. UI-only forms (no Supabase Auth wiring yet).

**Files touched:**
- `app/package.json` / `app/package-lock.json` (updated — react-router-dom, lucide-react)
- `app/src/main.tsx` (updated)
- `app/src/App.tsx` (updated)
- `app/src/features/landing/LandingPage.tsx` (created)
- `app/src/features/auth/AuthLayout.tsx` (created)
- `app/src/features/auth/LoginPage.tsx` (created)
- `app/src/features/auth/SignupPage.tsx` (created)
- `app/src/features/auth/ForgotPasswordPage.tsx` (created)
- `app/src/features/auth/ResetPasswordPage.tsx` (created)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 23

**Summary:** Wired auth pages to Supabase Auth (signup/login/forgot/reset), added AuthProvider + protected `/app` shell with logout, and created `profiles` migration with teacher-default trigger and SELECT-own RLS.

**Files touched:**
- `app/src/lib/supabase.ts` (updated)
- `app/src/lib/authErrors.ts` (created)
- `app/src/types/user.ts` (created)
- `app/src/features/auth/AuthProvider.tsx` (created)
- `app/src/features/auth/ProtectedRoute.tsx` (created)
- `app/src/features/auth/LoginPage.tsx` (updated)
- `app/src/features/auth/SignupPage.tsx` (updated)
- `app/src/features/auth/ForgotPasswordPage.tsx` (updated)
- `app/src/features/auth/ResetPasswordPage.tsx` (updated)
- `app/src/features/app/AppHomePage.tsx` (created)
- `app/src/main.tsx` (updated)
- `app/src/App.tsx` (updated)
- `supabase/migrations/20261006120000_create_profiles.sql` (created)
- `supabase/README.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 24

**Summary:** Recreated the ZCMV1 authenticated workstation UI (curriculum library, series library, book workspace with intelligence panel, book viewer, teacher AI) using mock data behind services/hooks, while preserving Supabase auth and leaving Phase 1 curriculum JSON untouched.

**Files touched:**
- `app/src/App.tsx` (updated)
- `app/src/index.css` (updated)
- `app/index.html` (updated)
- `app/src/features/shell/*` (created)
- `app/src/features/curriculum-library/*` (created)
- `app/src/features/series-library/*` (created)
- `app/src/features/book-workspace/*` (created)
- `app/src/features/book-viewer/*` (created)
- `app/src/features/lesson-intelligence/*` (created)
- `app/src/features/teacher-assistant/*` (created)
- `app/src/components/shared/*` (created)
- `app/src/services/*` (created)
- `app/src/mocks/*` (created)
- `app/src/types/curriculum.ts` (created)
- `app/public/images/*` (created)
- `app/src/features/app/AppHomePage.tsx` (deleted)
- `docs/project-tracking/4-mock-data-registry.md` (created)
- `docs/0-index.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 25

**Summary:** Added the first hybrid Supabase curriculum catalog (series/books/files/dataset_versions + private Storage buckets), documented Postgres vs Storage vs JSON authority, and locked D006 so curriculum entities stay out of relational tables.

**Files touched:**
- `supabase/migrations/20261007120000_create_curriculum_catalog.sql` (created)
- `supabase/README.md` (updated)
- `docs/8-database-architecture.md` (created)
- `docs/0-index.md` (updated)
- `docs/2-tech-stack.md` (updated)
- `docs/4-DECISIONS.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 26

**Summary:** Extended `book_files` with nullable `label`/`status`, seeded the pilot catalog (3 series, 4 books, unit batch file pointers), and documented that working unit batches do not create `dataset_versions` until canonical merge.

**Files touched:**
- `supabase/migrations/20261007120000_create_curriculum_catalog.sql` (updated — include label/status on fresh installs)
- `supabase/migrations/20261007130000_book_files_label_status.sql` (created)
- `supabase/migrations/20261007131000_seed_pilot_catalog.sql` (created)
- `supabase/README.md` (updated)
- `docs/8-database-architecture.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 27

**Summary:** Uploaded all 30 pilot unit-batch JSON files to the private `book-datasets` Storage bucket (paths matching the seed) via `scripts/upload_pilot_batches.mjs`, and documented the upload workflow.

**Files touched:**
- `scripts/upload_pilot_batches.mjs` (created)
- `.env.example` (updated)
- `supabase/README.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 28

**Summary:** Wired the curriculum library/series catalog to live Supabase `book_series` + `books` (async load, loading/error UI, UUID ids), while keeping Beehive 1 mock page spreads for the existing workstation demo.

**Files touched:**
- `app/src/services/curriculumService.ts` (updated)
- `app/src/services/catalogMapper.ts` (created)
- `app/src/types/curriculum.ts` (updated)
- `app/src/features/curriculum-library/hooks/useCurriculumCatalog.ts` (updated)
- `app/src/features/curriculum-library/CurriculumLibraryPage.tsx` (updated)
- `app/src/features/curriculum-library/CurriculumLibrary.tsx` (updated)
- `app/src/features/series-library/SeriesLibraryPage.tsx` (updated)
- `app/src/features/series-library/SeriesLibrary.tsx` (updated)
- `app/src/features/shell/WorkspaceProvider.tsx` (updated)
- `app/src/features/book-workspace/BookWorkspacePage.tsx` (updated)
- `app/src/components/shared/Sidebar.tsx` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 29

**Summary:** Uploaded the three series cover PNGs to private `book-assets` Storage, added migration for `cover_path` + read policies, and wired curriculum cards to show signed cover images when available.

**Files touched:**
- `supabase/migrations/20261007140000_book_assets_and_series_covers.sql` (created)
- `scripts/upload_series_covers.mjs` (created)
- `app/src/services/curriculumService.ts` (updated)
- `app/src/services/catalogMapper.ts` (updated)
- `app/src/types/curriculum.ts` (updated)
- `app/src/features/curriculum-library/CurriculumLibrary.tsx` (updated)
- `supabase/README.md` (updated)
- `docs/8-database-architecture.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 30

**Summary:** Replaced the curriculum series card header (icon/title/description) with the full series cover PNG above the levels/books row, preferring Storage signed URLs with local asset fallback.

**Files touched:**
- `app/src/features/curriculum-library/CurriculumLibrary.tsx` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 31

**Summary:** Shrunk series card covers to `object-contain` so each PNG is fully visible, and added the series name as a header above the image.

**Files touched:**
- `app/src/features/curriculum-library/CurriculumLibrary.tsx` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 32

**Summary:** Uploaded four student-book cover PNGs to `book-assets`, added `books.cover_path` migration, and wired series-library book cards to Supabase books with real cover imagery (signed URL + local fallback).

**Files touched:**
- `supabase/migrations/20261007150000_books_cover_path.sql` (created)
- `scripts/upload_book_covers.mjs` (created)
- `app/src/assests/images/book-series/*_cover.png` (added)
- `app/src/services/catalogMapper.ts` (updated)
- `app/src/services/curriculumService.ts` (updated)
- `app/src/types/curriculum.ts` (updated)
- `app/src/features/series-library/SeriesLibrary.tsx` (updated)
- `supabase/README.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 33

**Summary:** Removed local Phase 1 unit JSON and cover PNGs from the git tree, fixed gitignore paths, and switched curriculum UI covers to Storage signed URLs only so copyrighted curriculum bytes stay out of GitHub.

**Files touched:**
- `app/src/features/curriculum-library/CurriculumLibrary.tsx` (updated)
- `app/src/features/series-library/SeriesLibrary.tsx` (updated)
- `.gitignore` (updated)
- `data/phase1/**/*.json` (deleted from git)
- `app/src/assests/images/book-series/*.png` (deleted from git)
- `scripts/upload_pilot_batches.mjs` (updated)
- `scripts/upload_series_covers.mjs` (updated)
- `scripts/upload_book_covers.mjs` (updated)
- `README.md` (updated)
- `supabase/README.md` (updated)
- `docs/8-database-architecture.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 34

**Summary:** Added a separate `/app/validation` route with the workspace-style split layout (JSON evidence left, PDF stub top-right, validation status tools bottom) loading unit batches from Supabase Storage — no Ask AI.

**Files touched:**
- `app/src/App.tsx` (updated)
- `app/src/components/shared/Sidebar.tsx` (updated)
- `app/src/types/validation.ts` (created)
- `app/src/services/validationService.ts` (created)
- `app/src/features/validation/ValidationPage.tsx` (created)
- `app/src/features/validation/ValidationWorkspace.tsx` (created)
- `app/src/features/validation/ValidationHeader.tsx` (created)
- `app/src/features/validation/ValidationLeftPanel.tsx` (created)
- `app/src/features/validation/ValidationPdfPane.tsx` (created)
- `app/src/features/validation/ValidationToolsPanel.tsx` (created)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 35

**Summary:** Fixed Validation staying stuck on the default Beehive book by adding series/book selectors in the validation header and a Validate action on series library cards so Big English and Reach Higher can be opened the same way.

**Files touched:**
- `app/src/features/validation/ValidationHeader.tsx` (updated)
- `app/src/features/validation/ValidationWorkspace.tsx` (updated)
- `app/src/features/validation/ValidationPage.tsx` (updated)
- `app/src/features/series-library/SeriesLibrary.tsx` (updated)
- `app/src/features/series-library/SeriesLibraryPage.tsx` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 36

**Summary:** Uploaded four pilot source PDFs to private `book-sources`, upserted `book_files` `source_pdf` rows, and replaced the Validation PDF iframe with a PDF.js two-page signed-URL viewer (15-minute TTL, unit page jump).

**Files touched:**
- `scripts/upload_source_pdfs.mjs` (created)
- `supabase/migrations/20261007160000_seed_source_pdf_book_files.sql` (created)
- `supabase/README.md` (updated)
- `app/package.json` / `app/package-lock.json` (updated — `react-pdf`)
- `app/src/features/validation/ValidationPdfPane.tsx` (updated)
- `app/src/features/validation/ValidationWorkspace.tsx` (updated)
- `app/src/services/validationService.ts` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 37

**Summary:** Validation PDF two-page view now places the unit’s first printed page on the left (and the next page on the right) instead of snapping to odd-numbered spreads.

**Files touched:**
- `app/src/features/validation/ValidationPdfPane.tsx` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 38

**Summary:** Added a draggable vertical divider between Validation left (JSON evidence) and right (PDF + tools), mirroring the existing top/bottom resize pattern (left width clamped 22–50%).

**Files touched:**
- `app/src/features/validation/ValidationWorkspace.tsx` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 39

**Summary:** Fixed silent Validation status writes: detect RLS 0-row updates, warn/disable status buttons for non-admins, and document promote-to-admin SQL.

**Files touched:**
- `app/src/services/validationService.ts` (updated)
- `app/src/features/validation/ValidationToolsPanel.tsx` (updated)
- `app/src/features/validation/ValidationWorkspace.tsx` (updated)
- `supabase/README.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 40

**Summary:** Added Beehive 1 Units 9–10 batch JSON to private `book-datasets`, upserted `book_files` rows (`pending`), and updated the upload script / dataset registry so Validation lists all 10 units.

**Files touched:**
- `supabase/migrations/20261007170000_seed_beehive_1_units_09_10.sql` (created)
- `scripts/upload_pilot_batches.mjs` (updated)
- `supabase/README.md` (updated)
- `docs/phase-1/Dataset_registry.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 41

**Summary:** Replaced the incomplete Reach Higher 2A source PDF in private `book-sources` with the full Student Book (~27.7 MB) and added `UPLOAD_ONLY` support to the source PDF upload script.

**Files touched:**
- `scripts/upload_source_pdfs.mjs` (updated)
- `supabase/README.md` (updated)
- `docs/phase-1/Dataset_registry.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 42

**Summary:** Full documentation audit against the repository: aligned tech-stack, Dataset Registry, mock registry, FUTURE, overview/process/extraction specs, database architecture, and operating trackers with implemented Auth/catalog/Storage/Validation and the 2026-10-07 Phase 1 extraction-quality checkpoint (no Phase 1 COMPLETE claims).

**Files touched:**
- `README.md` (updated)
- `docs/0-index.md` (updated)
- `docs/1-Project Overview.md` (updated)
- `docs/2-tech-stack.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/7-FUTURE.md` (updated)
- `docs/8-database-architecture.md` (updated)
- `docs/phase-1/Dataset_registry.md` (updated)
- `docs/phase-1/Curriculum_Mapping_process.md` (updated)
- `docs/phase-1/Extraction_Data_Specification.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/2-internal-brainstorming.md` (updated)
- `docs/project-tracking/4-mock-data-registry.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 43

**Summary:** Marked Beehive 1 Units 9–10 and all Reach Higher 2A unit batches as `verified` in Supabase `book_files`, and updated Dataset Registry / trackers so pilot human verification is COMPLETE for BH1 and RH2A (Phase 1 still not COMPLETE — no canonical merge yet).

**Files touched:**
- `supabase/migrations/20261007180000_verify_bh1_u09_u10_rh2a.sql` (created)
- `supabase/migrations/20261007170000_seed_beehive_1_units_09_10.sql` (updated)
- `supabase/migrations/20261007131000_seed_pilot_catalog.sql` (updated — RH2A Unit 4 seed status)
- `scripts/upload_pilot_batches.mjs` (updated)
- `scripts/mark_batches_verified.mjs` (created)
- `supabase/README.md` (updated)
- `docs/phase-1/Dataset_registry.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/2-internal-brainstorming.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 44

**Summary:** First canonical merge for Big English 1 SB: nine verified unit batches → `canonical/v1.json` in Storage, `book_files` + `dataset_versions` v1 (`draft` / `is_current`), merge script + seed migration, registry/trackers updated (Phase 1 still not COMPLETE).

**Files touched:**
- `scripts/merge_canonical_book.mjs` (created)
- `supabase/migrations/20261007190000_seed_be1_canonical_v1.sql` (created)
- `supabase/README.md` (updated)
- `docs/phase-1/Dataset_registry.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 45

**Summary:** Added structural whole-book audit tooling and BE1-SB canonical v1 audit report (integrity PASS; counts/coverage/uncertainty). Owner PDF spot-check still required before recording PASSED / Phase 1 COMPLETE.

**Files touched:**
- `scripts/audit_canonical_book.mjs` (created)
- `docs/phase-1/audits/BE1-SB_canonical_v1_audit.md` (created)
- `docs/0-index.md` (updated)
- `docs/phase-1/Dataset_registry.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 46

**Summary:** Validation now lists `canonical_json` alongside unit batches (canonical first) so BE1-SB Canonical v1 can be opened for whole-book audit against the PDF.

**Files touched:**
- `app/src/services/validationService.ts` (updated)
- `app/src/features/validation/ValidationWorkspace.tsx` (updated)
- `app/src/features/validation/ValidationHeader.tsx` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 47

**Summary:** Validation now reviews one canonical book JSON via unit-scoped slices (Unit 1…N picker, filtered evidence panels) so the UI matches separate unit batches without dropping the canonical artifact.

**Files touched:**
- `app/src/services/validationService.ts` (updated)
- `app/src/types/validation.ts` (updated)
- `app/src/features/validation/ValidationWorkspace.tsx` (updated)
- `app/src/features/validation/ValidationHeader.tsx` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 48

**Summary:** Recorded owner audit PASSED for BE1-SB: whole-book audit PASSED, canonical verification patched, `dataset_versions` set to verified, and BE1-SB marked Phase 1 COMPLETE in the registry.

**Files touched:**
- `scripts/mark_canonical_audit_passed.mjs` (created)
- `docs/phase-1/audits/BE1-SB_canonical_v1_audit.md` (updated)
- `docs/phase-1/Dataset_registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 49

**Summary:** Drafted initial cross-series schema review notes from BH1 / BE1-SB / BE2-SB / RH2A evidence (gap themes, additive 0.2 candidates, continue-on-0.1 recommendation).

**Files touched:**
- `docs/phase-1/Cross_Series_Schema_Review_Notes.md` (created)
- `docs/phase-1/Dataset_registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/2-internal-brainstorming.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 50

**Summary:** Incorporated owner-accepted schema review working recommendations: continue on 0.1, treat gaps as classification evidence, defer 0.2 until after remaining pilot merges/audits, prioritize book_id alias map.

**Files touched:**
- `docs/phase-1/Cross_Series_Schema_Review_Notes.md` (updated)
- `docs/phase-1/Dataset_registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 51

**Summary:** Documented and implemented catalog `book_id` alias map (D007): merge-time normalization rewrites `book_id` fields to catalog IDs; entity ID prefixes preserved; BE1-SB canonical normalized in Storage.

**Files touched:**
- `docs/phase-1/book_id_aliases.json` (created)
- `docs/phase-1/Book_ID_Alias_Map.md` (created)
- `scripts/lib/bookIdAliases.mjs` (created)
- `scripts/normalize_canonical_book_ids.mjs` (created)
- `scripts/merge_canonical_book.mjs` (updated)
- `docs/4-DECISIONS.md` (updated)
- `docs/phase-1/Dataset_registry.md` (updated)
- `docs/phase-1/Cross_Series_Schema_Review_Notes.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/2-internal-brainstorming.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---
