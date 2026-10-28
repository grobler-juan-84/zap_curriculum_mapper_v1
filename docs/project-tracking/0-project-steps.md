# General Curriculum Mapper â Project Steps

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

**Summary:** Added an evolving project-status snapshot (`docs/project-tracking/1-project-status.md`) with three sections â what has been done, current status, and suggested next small step â plus a Cursor rule to refresh it after each file-changing prompt. Updated the documentation index.

**Files touched:**
- `docs/project-tracking/1-project-status.md` (created)
- `.cursor/rules/project_status_rule.mdc` (created)
- `docs/0-index.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 4

**Summary:** Documentation consistency cleanup only â normalized Phase 1 schema version notation to `0.1`, corrected stale `3`/`3A` Phase 1 doc references to `4`/`4A`, and clarified that the Overview ~90% target is qualitative, not a formal automated acceptance threshold. No architecture or data-model changes.

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

**Summary:** Synced documentation to the updated Google AI Studio Prompt V2 workflow â complete textbook upload with unit-by-unit separate JSON batch outputs (`FILE:` labels). Updated the docs index and aligned Phase 1 process, extraction-spec, and registry batch-tracking language.

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

**Summary:** Marked all Beehive 1 SB unit batches (`01â08`) as human-verified with batch-level `verification` objects; left open audio/workbook issues and SEL schema gaps documented. Updated dataset registry BH1 to EXTRACTED + human verification COMPLETE (Phase 1 still IN PROGRESS).

**Files touched:**
- `data/phase1/beehive_1_sb/beehive_1_sb_unit_01.json` â¦ `unit_08.json` (updated)
- `docs/6-Dataset_registry.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 10

**Summary:** Marked all Big English 1 SB unit batches (`01â09`) as human-verified after project review; left open audio/visual issues and the Think Big schema gap documented. Updated dataset registry BE1-SB to EXTRACTED + human verification COMPLETE (Phase 1 still IN PROGRESS).

**Files touched:**
- `data/phase1/big_english_1_sb/big_english_1_sb_unit_01.json` â¦ `unit_09.json` (updated)
- `docs/6-Dataset_registry.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 11

**Summary:** Marked Big English 2 SB units `01â09` and Reach Higher 2A units `1â3` human-verified after project review; left RH2A Unit 4 pending extraction restriction. Repaired truncated BE2 Unit 2 JSON (reconstructed header; pages/vocabulary/language empty with open issue). Updated dataset registry for BE2-SB (COMPLETE) and RH2A (PARTIAL).

**Files touched:**
- `data/phase1/big_english_2_sb/big_english_2_sb_unit_01.json` â¦ `unit_09.json` (updated)
- `data/phase1/reach_higher_2a/rh2a_sb_unit1.json` â¦ `unit3.json` (updated)
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

**Summary:** Explained in brainstorming how a React/Vite/Vercel app would create JSON via Gemini API and persist it to Blob/DB (not Vercel filesystem), replacing todayâs Cursor/manual save workflow.

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

**Summary:** Audited the docs reorg into `phase-1`â¦`phase-6` folders; refreshed `docs/0-index.md` paths/sections and updated cross-document filename references in Phase 1 docs (plus the documentation-index Cursor rule examples).

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
- `docs/project-tracking/1-project-status.md` (updated â legacy pointer)
- `docs/project-tracking/3-project-decisions.md` (updated â legacy pointer)
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
- `app/` (created â Vite React TS Tailwind scaffold + minimal shell)
- `supabase/` (created â local config only)
- `python/` (created â tooling foundation)
- `schemas/` (created â placeholder + README)
- `scripts/` (created â placeholder)
- `.env.example` (created)
- `README.md` (created)
- `.gitignore` (updated)
- `docs/2-tech-stack.md` (updated)
- `docs/4-DECISIONS.md` (updated â D005)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/7-FUTURE.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 22

**Summary:** Added clean zcmv1-inspired public UI: landing page plus login, signup, forgot-password, and reset-password screens with React Router. UI-only forms (no Supabase Auth wiring yet).

**Files touched:**
- `app/package.json` / `app/package-lock.json` (updated â react-router-dom, lucide-react)
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
- `supabase/migrations/20261007120000_create_curriculum_catalog.sql` (updated â include label/status on fresh installs)
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

**Summary:** Added a separate `/app/validation` route with the workspace-style split layout (JSON evidence left, PDF stub top-right, validation status tools bottom) loading unit batches from Supabase Storage â no Ask AI.

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
- `app/package.json` / `app/package-lock.json` (updated â `react-pdf`)
- `app/src/features/validation/ValidationPdfPane.tsx` (updated)
- `app/src/features/validation/ValidationWorkspace.tsx` (updated)
- `app/src/services/validationService.ts` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 37

**Summary:** Validation PDF two-page view now places the unitâs first printed page on the left (and the next page on the right) instead of snapping to odd-numbered spreads.

**Files touched:**
- `app/src/features/validation/ValidationPdfPane.tsx` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 38

**Summary:** Added a draggable vertical divider between Validation left (JSON evidence) and right (PDF + tools), mirroring the existing top/bottom resize pattern (left width clamped 22â50%).

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

**Summary:** Added Beehive 1 Units 9â10 batch JSON to private `book-datasets`, upserted `book_files` rows (`pending`), and updated the upload script / dataset registry so Validation lists all 10 units.

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

**Summary:** Marked Beehive 1 Units 9â10 and all Reach Higher 2A unit batches as `verified` in Supabase `book_files`, and updated Dataset Registry / trackers so pilot human verification is COMPLETE for BH1 and RH2A (Phase 1 still not COMPLETE â no canonical merge yet).

**Files touched:**
- `supabase/migrations/20261007180000_verify_bh1_u09_u10_rh2a.sql` (created)
- `supabase/migrations/20261007170000_seed_beehive_1_units_09_10.sql` (updated)
- `supabase/migrations/20261007131000_seed_pilot_catalog.sql` (updated â RH2A Unit 4 seed status)
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

**Summary:** First canonical merge for Big English 1 SB: nine verified unit batches â `canonical/v1.json` in Storage, `book_files` + `dataset_versions` v1 (`draft` / `is_current`), merge script + seed migration, registry/trackers updated (Phase 1 still not COMPLETE).

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

**Summary:** Validation now reviews one canonical book JSON via unit-scoped slices (Unit 1â¦N picker, filtered evidence panels) so the UI matches separate unit batches without dropping the canonical artifact.

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

### Step 52

**Summary:** Merged BH1 verified unit batches into canonical v1 with book_id normalization (added alias `beehive_american_sb1`); registered `dataset_versions` draft and updated registry.

**Files touched:**
- `scripts/merge_canonical_book.mjs` (updated)
- `docs/phase-1/book_id_aliases.json` (updated)
- `docs/phase-1/Book_ID_Alias_Map.md` (updated)
- `docs/phase-1/Dataset_registry.md` (updated)
- `docs/phase-1/Cross_Series_Schema_Review_Notes.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 53

**Summary:** Recorded BH1 whole-book audit PASSED (structural PASS + owner page/vocab/sentence-structure spot-check); set `dataset_versions` verified and marked BH1 Phase 1 COMPLETE.

**Files touched:**
- `scripts/audit_canonical_book.mjs` (updated)
- `scripts/mark_canonical_audit_passed.mjs` (updated)
- `docs/phase-1/audits/BH1_canonical_v1_audit.md` (created)
- `docs/phase-1/Dataset_registry.md` (updated)
- `docs/phase-1/Cross_Series_Schema_Review_Notes.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 54

**Summary:** Merged BE2-SB verified unit batches into canonical v1 with book_id normalization (`bep_sb_2` â `big_english_2_sb`); registered `dataset_versions` draft; re-aligned unit batch statuses to verified.

**Files touched:**
- `scripts/merge_canonical_book.mjs` (updated)
- `docs/phase-1/Dataset_registry.md` (updated)
- `docs/phase-1/Cross_Series_Schema_Review_Notes.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 55

**Summary:** Recorded BE2-SB whole-book audit PASSED (structural PASS + owner spot-check); set `dataset_versions` verified and marked BE2-SB Phase 1 COMPLETE.

**Files touched:**
- `scripts/audit_canonical_book.mjs` (updated)
- `scripts/mark_canonical_audit_passed.mjs` (updated)
- `docs/phase-1/audits/BE2-SB_canonical_v1_audit.md` (created)
- `docs/phase-1/Dataset_registry.md` (updated)
- `docs/phase-1/Cross_Series_Schema_Review_Notes.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 56

**Summary:** Merged RH2A verified unit batches into canonical v1 with book_id normalization (`rh_2a` â `reach_higher_2a`); registered `dataset_versions` draft. All four Storage-backed pilots now have canonical datasets.

**Files touched:**
- `scripts/merge_canonical_book.mjs` (updated)
- `docs/phase-1/Dataset_registry.md` (updated)
- `docs/phase-1/Cross_Series_Schema_Review_Notes.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 57

**Summary:** Recorded RH2A whole-book audit PASSED (structural PASS + owner PDF spot-check); set `dataset_versions` verified and marked RH2A Phase 1 COMPLETE. All four Storage-backed pilots are now Phase 1 COMPLETE.

**Files touched:**
- `scripts/audit_canonical_book.mjs` (updated)
- `scripts/mark_canonical_audit_passed.mjs` (updated)
- `docs/phase-1/audits/RH2A_canonical_v1_audit.md` (created)
- `docs/phase-1/Dataset_registry.md` (updated)
- `docs/phase-1/Cross_Series_Schema_Review_Notes.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/7-FUTURE.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 58

**Summary:** Recorded the post-pilot schema 0.2 candidate as an explicit deferral. Canonical audits do not show the same structure in two series, so schema 0.1 and the extraction prompt stay unchanged.

**Files touched:**
- `docs/phase-1/Cross_Series_Schema_Review_Notes.md` (updated)
- `docs/phase-1/Dataset_registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 59

**Summary:** Implemented Phase 1 schema 0.1 automated structural validation with a machine schema, shared JavaScript integrity engine, CLI reports, tests, and merge/audit integration. Retrospective runs passed BE1-SB, BH1, and RH2A with warnings and found nine dangling same-book relationship targets in BE2-SB; the defect was documented without auto-repairing or revoking the historical audit.

**Files touched:**
- `schemas/phase1-0.1.schema.json` (created)
- `scripts/lib/phase1Books.mjs` (created)
- `scripts/lib/phase1Validation.mjs` (created)
- `scripts/validate_phase1_json.mjs` (created)
- `scripts/tests/phase1Validation.test.mjs` (created)
- `scripts/merge_canonical_book.mjs` (updated)
- `scripts/audit_canonical_book.mjs` (updated)
- `scripts/mark_canonical_audit_passed.mjs` (updated)
- `app/package.json` (updated)
- `app/package-lock.json` (updated)
- `supabase/README.md` (updated)
- `docs/phase-1/JSON_Schema.md` (updated)
- `docs/phase-1/Extraction_Data_Specification.md` (updated)
- `docs/phase-1/Dataset_registry.md` (updated)
- `docs/phase-1/Curriculum_Mapping_process.md` (updated)
- `docs/phase-1/Cross_Series_Schema_Review_Notes.md` (updated)
- `docs/phase-1/audits/BE1-SB_canonical_v1_audit.md` (updated)
- `docs/phase-1/audits/BH1_canonical_v1_audit.md` (updated)
- `docs/phase-1/audits/BE2-SB_canonical_v1_audit.md` (updated)
- `docs/phase-1/audits/RH2A_canonical_v1_audit.md` (updated)
- `docs/0-index.md` (updated)
- `docs/4-DECISIONS.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 60

**Summary:** Triaged BE2-SB dangling `paired_with` targets by adding appendix sticker page records `bep2_p189`â`bep2_p191` (`unit_id` null). Revalidation now PASSED WITH WARNINGS for all four pilots; historical whole-book audit PASS retained.

**Files touched:**
- `scripts/patch_be2_appendix_sticker_pages.mjs` (created)
- `docs/phase-1/Dataset_registry.md` (updated)
- `docs/phase-1/audits/BE2-SB_canonical_v1_audit.md` (updated)
- `docs/phase-1/Curriculum_Mapping_process.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 61

**Summary:** Drafted the remaining 14-book Phase 1 extraction order after the pilot/schema pass. The default starts with BE1-WB, brings BH2 / BE2-WB / RH2B in early, then processes later Big English Student Book/Workbook pairs with Reach Higher checkpoints.

**Files touched:**
- `docs/phase-1/Dataset_registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 62

**Summary:** Drafted a non-binding project-wide naming proposal with style rules, explicit book-identity layers, prospective JSON ID templates, and a risk-aware legacy migration policy. Recorded owner review and formalization as the next task before BE1-WB preparation.

**Files touched:**
- `docs/project-tracking/2-internal-brainstorming.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 63

**Summary:** Owner-approved and locked project-wide naming conventions as D009. Created the authority doc and always-on Cursor rule; grandfathered pilot entity IDs; queued extraction/alias doc alignment before BE1-WB.

**Files touched:**
- `docs/9-naming-conventions.md` (created)
- `.cursor/rules/naming_conventions.mdc` (created)
- `docs/4-DECISIONS.md` (updated)
- `docs/project-tracking/2-internal-brainstorming.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 64

**Summary:** Aligned Phase 1 extraction prompt, JSON Schema identifier guidance, Extraction Spec batch naming, and Book ID Alias Map with D009. Pre-registered BE1-WB as catalog `big_english_1_wb` with full-prefix entity IDs; pilot aliases remain grandfathered.

**Files touched:**
- `docs/phase-1/Google_AI_Studio_Prompt.md` (updated)
- `docs/phase-1/JSON_Schema.md` (updated)
- `docs/phase-1/Extraction_Data_Specification.md` (updated)
- `docs/phase-1/Book_ID_Alias_Map.md` (updated)
- `docs/phase-1/book_id_aliases.json` (updated)
- `docs/0-index.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 65

**Summary:** Clarified D009 naming authority to v1.1 after the repo naming audit: tracker kebab targets, audit-report registry filenames, local/public asset rules, schema filenames, Postgres UUID vs catalog collision, and `catalogBookId` preference. No renames performed.

**Files touched:**
- `docs/9-naming-conventions.md` (updated)
- `.cursor/rules/naming_conventions.mdc` (updated)
- `docs/4-DECISIONS.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-PROGRESS.md` (updated)
- `docs/6-TODO.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 66

**Summary:** Applied D009 Â§7.1 safe cosmetic rename batch: `assests`â`assets` with catalog-named local PDFs, `TeacherAiAssistant` file/export, root and phase docs to kebab-case, and live link/Cursor-rule updates. Historical project-steps filenames left unchanged; TS `bookId` mapper cleanup deferred.

**Files touched:**
- `app/src/assests/` â `app/src/assets/` (renamed; gitignored)
- `app/src/features/teacher-assistant/TeacherAiAssistant.tsx` (renamed/updated)
- `app/src/features/book-workspace/BookWorkspace.tsx` (updated)
- `.gitignore` (updated)
- `docs/1-project-overview.md` (renamed)
- `docs/4-decisions.md` (renamed)
- `docs/5-progress.md` (renamed/updated)
- `docs/6-todo.md` (renamed/updated)
- `docs/7-future.md` (renamed/updated)
- `docs/phase-1/*.md` Title_Case â kebab-case (renamed; links updated)
- `docs/phase-4/teacher-enrichment-philosophy.md` (renamed)
- `docs/phase-6/chalkie-ai-handover-specifications.md` (renamed)
- `.cursor/rules/*.mdc` (updated paths)
- `docs/9-naming-conventions.md` (updated to v1.2)
- `docs/0-index.md` (updated)
- `README.md` (updated)
- `scripts/upload_book_covers.mjs` / `upload_series_covers.mjs` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 67

**Summary:** Fixed Validation source-PDF pane stuck on âCheckingâ¦â by clearing `pdfLoading` in a `finally` when the active request is not cancelled. Aligned `upload_source_pdfs.mjs` with D009 local catalog PDF paths; verified Beehive 1 `source_pdf` row and Storage object are present (no re-upload needed).

**Files touched:**
- `app/src/features/validation/ValidationWorkspace.tsx` (updated)
- `scripts/upload_source_pdfs.mjs` (updated)
- `supabase/README.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 68

**Summary:** Removed eager global cover signing from catalog loading, added batched and expiry-cached cover URLs for visible library screens, and kept PDF.js mounted during document loading. Live probes confirmed fewer Storage/data requests while preserving signed URLs and range-capable PDF delivery.

**Files touched:**
- `app/src/services/curriculumService.ts` (updated)
- `app/src/services/coverImageService.ts` (created)
- `app/src/hooks/useCoverImageUrls.ts` (created)
- `app/src/features/curriculum-library/CurriculumLibrary.tsx` (updated)
- `app/src/features/series-library/SeriesLibrary.tsx` (updated)
- `app/src/features/validation/ValidationPdfPane.tsx` (updated)
- `app/src/features/validation/ValidationWorkspace.tsx` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/7-future.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 69

**Summary:** Documented Cloudflare R2 as the textbook PDF object-storage target (D010): storage architecture doc with Stages AâE, security rules, and refined hybrid-storage docs. No R2 configuration, upload, or app code changes.

**Files touched:**
- `docs/10-storage-architecture.md` (created)
- `docs/2-tech-stack.md` (updated)
- `docs/3-architecture.md` (updated)
- `docs/4-decisions.md` (updated)
- `docs/8-database-architecture.md` (updated)
- `docs/1-project-overview.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/7-future.md` (updated)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/project-tracking/2-internal-brainstorming.md` (updated)
- `docs/project-tracking/4-mock-data-registry.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 70

**Summary:** Added R2 Stage B connectivity-test tooling (`scripts/test_r2_connection.mjs`), gitignored vendor SDK path, and `.env.example` / `.env.local` placeholders. Stage B not marked complete â local R2 secrets were still empty at stop time.

**Files touched:**
- `scripts/test_r2_connection.mjs` (created)
- `scripts/_check_r2_env_presence.mjs` (created)
- `.env.example` (updated)
- `.gitignore` (updated)
- `docs/10-storage-architecture.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 71

**Summary:** Ran R2 Stage B connectivity test successfully (list / put / get+SHA-256 / delete under `_connection-tests/`). Normalized endpoint when `R2_ACCOUNT_ID` contains a full URL. Marked Stage B PASS in docs; no PDF migration.

**Files touched:**
- `scripts/test_r2_connection.mjs` (updated)
- `docs/10-storage-architecture.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 72

**Summary:** Stage C PASS â migrated Beehive 1 source PDF from Supabase to R2 at verified key `beehive/beehive_1_sb/source.pdf` with matching SHA-256; Supabase original preserved. Clarified that `beehive/beehive/â¦` is not the catalog path. No app or DB changes.

**Files touched:**
- `scripts/migrate_pilot_pdf_to_r2.mjs` (created)
- `docs/10-storage-architecture.md` (updated)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 73

**Summary:** Stage D PASS â Validation PDF signing via server `/api/sign-source-pdf` (JWT + catalog bookFileId auth, R2-first dual-read per D011). Provider badge in UI. CORS apply blocked by token (dashboard follow-up). JSON/covers and Supabase PDF originals unchanged.

**Files touched:**
- `app/server/loadServerEnv.ts` (created)
- `app/server/r2Config.ts` (created)
- `app/server/signSourcePdf.ts` (created)
- `app/server/handleSignSourcePdfRequest.ts` (created)
- `app/vite-plugins/signSourcePdfPlugin.ts` (created)
- `app/vite.config.ts` (updated)
- `app/tsconfig.node.json` (updated)
- `app/package.json` / `app/package-lock.json` (updated â AWS SDK)
- `app/src/services/validationService.ts` (updated)
- `app/src/types/validation.ts` (updated)
- `app/src/features/validation/ValidationWorkspace.tsx` (updated)
- `app/src/features/validation/ValidationPdfPane.tsx` (updated)
- `api/sign-source-pdf.ts` (created)
- `scripts/configure_r2_cors.mjs` (created)
- `scripts/smoke_sign_source_pdf.mjs` (created)
- `.env.example` (updated)
- `docs/4-decisions.md` (updated â D011)
- `docs/10-storage-architecture.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/2-internal-brainstorming.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 74

**Summary:** Fixed Beehive 1 PDF.js CORS failure by serving R2 PDFs through same-origin `POST /api/source-pdf-content` (blob URL). Presigned sign endpoint retained; dual-read and catalog auth unchanged.

**Files touched:**
- `app/server/authorizeSourcePdf.ts` (created)
- `app/server/handleProxySourcePdfRequest.ts` (created)
- `app/server/handleSignSourcePdfRequest.ts` (updated)
- `app/server/signSourcePdf.ts` (updated)
- `app/vite-plugins/signSourcePdfPlugin.ts` (updated)
- `app/src/services/validationService.ts` (updated)
- `app/src/features/validation/ValidationWorkspace.tsx` (updated)
- `api/sign-source-pdf.ts` (updated)
- `docs/4-decisions.md` (updated)
- `docs/10-storage-architecture.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 75

**Summary:** Stage E PASS â audited catalog/Supabase/R2 source PDFs; migrated the three remaining pilots to R2 with SHA-256 verify (Beehive already present); parked PDF delivery scalability as F013; Supabase originals and dual-read fallback retained. Browser Validation badge check left as manual pending.

**Files touched:**
- `scripts/migrate_source_pdfs_to_r2.mjs` (created)
- `scripts/smoke_sign_source_pdf.mjs` (updated)
- `docs/7-future.md` (updated â F013)
- `docs/10-storage-architecture.md` (updated)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 76

**Summary:** Owner confirmed Validation console: all four cataloged pilots load with `provider=r2 delivery=proxy`. Closed the Stage E browser verification pending item.

**Files touched:**
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/10-storage-architecture.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 77

**Summary:** Aligned local source PDFs to `app/src/assets/books/{series_slug}/{catalog_book_id}.pdf`, created series folders plus a local (gitignored) naming README, and hardened `.gitignore` so `app/src/assets/`, `project-books/`, and all PDFs cannot be committed to GitHub.

**Files touched:**
- `.gitignore` (updated)
- `.cursor/rules/naming_conventions.mdc` (updated)
- `app/src/assets/books/{beehive,big-english,reach-higher}/` (created locally; gitignored)
- `app/src/assets/books/README.md` (created locally; gitignored)
- `docs/9-naming-conventions.md` (updated â v1.3)
- `docs/0-index.md` (updated)
- `supabase/README.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 78

**Summary:** Scaffolded remaining Big English unit-batch working folders under `data/phase1/` with 90 empty `{}` placeholders (`*_unit_01.json`â`*_unit_09.json` for WB/SB levels still to extract). Confirmed `data/phase1/` stays gitignored; added tracked `data/README.md` layout notes only.

**Files touched:**
- `data/phase1/big_english_{1_wb,2_wb,3_sb,3_wb,4_sb,4_wb,5_sb,5_wb,6_sb,6_wb}/` (created locally; gitignored)
- `data/phase1/README.md` (created locally; gitignored)
- `data/README.md` (created; tracked layout notes)
- `.gitignore` (updated comment)
- `docs/9-naming-conventions.md` (updated â v1.4)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 79

**Summary:** Locked D012 â textbook source PDFs are R2-only. Removed Validation Supabase Storage fallback; retargeted `upload_source_pdfs.mjs` to R2 PutObject + Postgres `book_files` upsert; left existing Supabase `book-sources` objects unused (delete later = F014). Typecheck and R2 smoke PASS.

**Files touched:**
- `docs/4-decisions.md` (updated â D012)
- `docs/10-storage-architecture.md` (updated â v1.2)
- `docs/2-tech-stack.md` (updated)
- `docs/8-database-architecture.md` (updated)
- `docs/7-future.md` (updated â F014)
- `docs/0-index.md` (updated)
- `supabase/README.md` (updated)
- `app/src/services/validationService.ts` (updated â R2-only PDF)
- `app/src/features/validation/ValidationPdfPane.tsx` (updated comment)
- `scripts/upload_source_pdfs.mjs` (updated â R2 PutObject)
- `scripts/.r2-tools/` (vendor install for AWS SDK)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 80

**Summary:** Registered and staged BE1-WB (`big_english_1_wb`) for Validation: catalog seed, R2 source PDF upload, nine pending unit JSON batches on Supabase `book-datasets`. Smoke PASS. Human verify + merge/audit left for follow-up.

**Files touched:**
- `supabase/migrations/20261008120000_seed_big_english_1_wb.sql` (created)
- `scripts/apply_be1wb_seed.mjs` (created)
- `scripts/upload_source_pdfs.mjs` (updated)
- `scripts/upload_pilot_batches.mjs` (updated)
- `scripts/lib/phase1Books.mjs` (updated)
- `scripts/smoke_sign_source_pdf.mjs` (updated)
- `supabase/README.md` (updated)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 81

**Summary:** Recorded BE1-WB Unit 9 human verification for available PDF content (D013); documented missing printed pages 124â129 as open `missing_source`; parked Validation PDF page-nav mismatch as F015. No curriculum content, schema, or viewer code changes. Book-level HV and Phase 1 remain incomplete.

**Files touched:**
- `data/phase1/big_english_1_wb/big_english_1_wb_unit_09.json` (updated locally + re-uploaded to Storage; gitignored)
- `scripts/mark_be1wb_u09_verified.mjs` (created)
- `docs/4-decisions.md` (updated â D013)
- `docs/7-future.md` (updated â F015)
- `docs/phase-1/dataset-registry.md` (updated â Â§8E + table)
- `docs/project-tracking/2-internal-brainstorming.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 82

**Summary:** Finalized BE1-WB Phase 1: confirmed Units 1â9 verified, book-level human verification (available PDF content), canonical merge + automated validation PASSED WITH WARNINGS, whole-book audit PASSED. Kept Unit 9 printed pages 124â129 as open `missing_source` (D013). Project-wide Phase 1 remains incomplete (5/18).

**Files touched:**
- `scripts/finalize_be1wb_human_verify.mjs` (created)
- `scripts/check_be1wb_unit_status.mjs` (created)
- `scripts/check_be1wb_storage_verify.mjs` (created)
- `data/phase1/big_english_1_wb/` unit + canonical JSON (updated locally + Storage; gitignored)
- `docs/phase-1/audits/BE1-WB_canonical_v1_audit.md` (created)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 83

**Summary:** Confirmed all 12 Big English source PDFs are already present under `app/src/assets/books/big-english/` with D009 filenames (`big_english_{1â6}_{sb|wb}.pdf`); marked the related todo complete.

**Files touched:**
- `docs/6-todo.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 84

**Summary:** Chose BE2-WB as next book (owner continuing Big English; BH2 deferred). Seeded catalog + uploaded source PDF to R2; wired scripts/aliases; deferred batch JSON upload because local unit files are still empty placeholders.

**Files touched:**
- `supabase/migrations/20261008130000_seed_big_english_2_wb.sql` (created)
- `scripts/apply_be2wb_seed.mjs` (created)
- `scripts/upload_source_pdfs.mjs` (updated)
- `scripts/lib/phase1Books.mjs` (updated)
- `scripts/smoke_sign_source_pdf.mjs` (updated)
- `docs/phase-1/book_id_aliases.json` (updated)
- `docs/phase-1/book-id-alias-map.md` (updated â v1.2)
- `docs/phase-1/dataset-registry.md` (updated)
- `supabase/README.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 85

**Summary:** Uploaded BE2-WB Units 1â9 batch JSON to Supabase `book-datasets` (all `pending`), set `books.status=extracted`, and recorded extraction alias `big_english_plus_2_wb` for D007 merge normalization. Human Validation left for owner.

**Files touched:**
- `scripts/upload_pilot_batches.mjs` (updated)
- `scripts/set_be2wb_extracted.mjs` (created)
- `supabase/migrations/20261008140000_seed_big_english_2_wb_batches.sql` (created)
- `supabase/README.md` (updated)
- `docs/phase-1/book_id_aliases.json` (updated)
- `docs/phase-1/book-id-alias-map.md` (updated)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)
- `data/phase1/big_english_2_wb/*.json` (local filled batches; gitignored; uploaded to Storage)

---

### Step 86

**Summary:** Recorded BE2-WB book-level human verification after owner confirmed Units 1â9 verified in Validation (PDF via R2). Synced JSON metadata + `books.status=verified`; merge/audit left for follow-up.

**Files touched:**
- `scripts/finalize_be2wb_human_verify.mjs` (created)
- `data/phase1/big_english_2_wb/*.json` (updated locally + Storage; gitignored)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 87

**Summary:** Completed BE2-WB Phase 1: remumbered colliding Unit 8â9 entity IDs, fixed language slug + dangling page_141 relationship, merged canonical v1, D008 PASSED WITH WARNINGS, whole-book audit PASSED. Project Phase 1 now 6/18.

**Files touched:**
- `scripts/renumber_be2wb_units_08_09.mjs` (created)
- `scripts/fix_be2wb_merge_blockers.mjs` (created)
- `scripts/inspect_be2wb_id_ranges.mjs` (created)
- `data/phase1/big_english_2_wb/` batches + canonical (updated; gitignored; Storage uploaded)
- `docs/phase-1/audits/BE2-WB_canonical_v1_audit.md` (created)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 88

**Summary:** Documented BE2-WB multi-chat Google AI Studio extraction lesson: registry Â§8F notes, audit root-cause line (mid-book new chats), and prompt caution to carry entity ID counters/slug forms across chats.

**Files touched:**
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/phase-1/audits/BE2-WB_canonical_v1_audit.md` (updated)
- `docs/phase-1/google-ai-studio-prompt.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 89

**Summary:** Trial-merged BE3-SB Units 1â3 split part JSON files (~8 pages each) into single local unit batches; no entity-ID collisions within units. Part files kept for re-merge.

**Files touched:**
- `scripts/merge_be3sb_unit_parts.mjs` (created)
- `data/phase1/big_english_3_sb/big_english_3_sb_unit_01.json` (updated; gitignored)
- `data/phase1/big_english_3_sb/big_english_3_sb_unit_02.json` (updated; gitignored)
- `data/phase1/big_english_3_sb/big_english_3_sb_unit_03.json` (updated; gitignored)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 90

**Summary:** Merged BE3-SB Units 4â5 part pairs into unit batches. Unit 6 blocked â `*_p98_105.json` is byte-identical to `*_p90-97.json` (needs re-export of pp. 98â105). Extended merge script with unit CLI args + page-overlap guard.

**Files touched:**
- `scripts/merge_be3sb_unit_parts.mjs` (updated)
- `data/phase1/big_english_3_sb/big_english_3_sb_unit_04.json` (updated; gitignored)
- `data/phase1/big_english_3_sb/big_english_3_sb_unit_05.json` (updated; gitignored)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 91

**Summary:** Merged BE3-SB Unit 6 after repairing invalid JSON in `*_p98_105.json` (unescaped quotes in a reading-passage `content` field). Local units 1â6 now complete.

**Files touched:**
- `scripts/fix_be3sb_unit06_part2_json.mjs` (created)
- `data/phase1/big_english_3_sb/big_english_3_sb_unit_06_p98_105.json` (updated; gitignored)
- `data/phase1/big_english_3_sb/big_english_3_sb_unit_06.json` (updated; gitignored)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 92

**Summary:** Staged BE3-SB for Validation: catalog seed + R2 source PDF upload, script/alias wiring, Unit 7 catalog normalize. Batch JSON upload deferred â Units 8â9 local files are still empty `{}`.

**Files touched:**
- `supabase/migrations/20261009100000_seed_big_english_3_sb.sql` (created)
- `scripts/apply_be3sb_seed.mjs` (created)
- `scripts/normalize_be3sb_unit07.mjs` (created)
- `scripts/upload_source_pdfs.mjs` (updated)
- `scripts/upload_pilot_batches.mjs` (updated)
- `scripts/lib/phase1Books.mjs` (updated)
- `scripts/smoke_sign_source_pdf.mjs` (updated)
- `docs/phase-1/book_id_aliases.json` (updated)
- `docs/phase-1/book-id-alias-map.md` (updated)
- `docs/phase-1/dataset-registry.md` (updated)
- `supabase/README.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)
- `data/phase1/big_english_3_sb/big_english_3_sb_unit_07.json` (updated; gitignored)

---

### Step 93

**Summary:** Normalized BE3-SB Units 8â9, uploaded all nine unit batches to `book-datasets` as `pending`, set `books.status=extracted`. Ready for Validation human verification.

**Files touched:**
- `scripts/normalize_be3sb_units.mjs` (created)
- `scripts/set_be3sb_extracted.mjs` (created)
- `supabase/migrations/20261009110000_seed_big_english_3_sb_batches.sql` (created)
- `supabase/README.md` (updated)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)
- `data/phase1/big_english_3_sb/big_english_3_sb_unit_08.json` (updated; gitignored; Storage uploaded)
- `data/phase1/big_english_3_sb/big_english_3_sb_unit_09.json` (updated; gitignored; Storage uploaded)

---

### Step 94

**Summary:** Fixed Validation PDF navigation for source PDFs with missing pages: the viewer now opens units at the extracted `pdf_page_start`, shows printed page numbers in the counter, accepts printed pages in the Go box, and flags missing-page gaps. Locked D014, resolved F015, and recorded BE3-SB missing pp. 66â67.

**Files touched:**
- `app/src/features/validation/pdfPageMap.ts` (created)
- `app/src/features/validation/ValidationPdfPane.tsx` (updated)
- `app/src/features/validation/ValidationWorkspace.tsx` (updated)
- `app/src/services/validationService.ts` (updated)
- `app/src/types/validation.ts` (updated)
- `docs/4-decisions.md` (updated â D014)
- `docs/7-future.md` (updated â F015 resolved)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 95

**Summary:** Recorded BE3-SB book-level human verification after owner confirmed Units 1â9 correct and page display fixed (D014). Synced JSON metadata to `human_verified`, re-uploaded batches, set `books.status=verified`. Unit 4 already carries open `missing_source` for printed pp. 66â67. Merge/audit left for follow-up.

**Files touched:**
- `scripts/finalize_be3sb_human_verify.mjs` (created)
- `data/phase1/big_english_3_sb/*.json` (updated locally + Storage; gitignored)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 96

**Summary:** Completed BE3-SB Phase 1: remumbered colliding Unit 3â4 entity IDs, fixed Unit 2 null-target workbook relationship, merged canonical v1, D008 PASSED WITH WARNINGS, whole-book audit PASSED. Project Phase 1 now 7/18 (D013 exception for printed pp. 66â67).

**Files touched:**
- `scripts/renumber_be3sb_merge_collisions.mjs` (created)
- `scripts/fix_be3sb_merge_blockers.mjs` (created)
- `scripts/patch_be3sb_canonical_book_range.mjs` (created)
- `scripts/inspect_be3sb_u02_storage.mjs` (created)
- `data/phase1/big_english_3_sb/` batches + canonical (updated; gitignored; Storage uploaded)
- `docs/phase-1/audits/BE3-SB_canonical_v1_audit.md` (created)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 97

**Summary:** Staged BE3-WB for Validation: catalog seed + R2 source PDF, sanitized/normalized Units 1â9, uploaded nine `book-datasets` batches as `pending`, set `books.status=extracted`. Alias map and registry updated.

**Files touched:**
- `scripts/fix_be3wb_json_quotes.mjs` (created)
- `scripts/normalize_be3wb_units.mjs` (created)
- `scripts/apply_be3wb_seed.mjs` (created)
- `scripts/set_be3wb_extracted.mjs` (created)
- `scripts/lib/phase1Books.mjs` (updated)
- `scripts/upload_source_pdfs.mjs` (updated)
- `scripts/upload_pilot_batches.mjs` (updated)
- `scripts/smoke_sign_source_pdf.mjs` (updated)
- `supabase/migrations/20261009120000_seed_big_english_3_wb.sql` (created)
- `data/phase1/big_english_3_wb/` units (updated; gitignored; Storage uploaded)
- `docs/phase-1/book-id-alias-map.md` (updated)
- `docs/phase-1/book_id_aliases.json` (updated)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 98

**Summary:** Recorded BE3-WB book-level human verification after owner confirmed Units 1â9 in Validation. Synced JSON metadata to `human_verified`, re-uploaded batches, set `books.status=verified`. Merge/audit left for follow-up.

**Files touched:**
- `scripts/finalize_be3wb_human_verify.mjs` (created)
- `data/phase1/big_english_3_wb/*.json` (updated locally + Storage; gitignored)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 99

**Summary:** Completed BE3-WB Phase 1: merge hygiene for grammar pages and Unit 5 relationship, canonical v1 merge, D008 PASSED WITH WARNINGS, whole-book audit PASSED. Project Phase 1 now 8/18.

**Files touched:**
- `scripts/fix_be3wb_merge_blockers.mjs` (created)
- `scripts/patch_be3wb_canonical_book_range.mjs` (created)
- `data/phase1/big_english_3_wb/` batches + canonical (updated; gitignored; Storage uploaded)
- `docs/phase-1/audits/BE3-WB_canonical_v1_audit.md` (created)
- `docs/phase-1/book-id-alias-map.md` (updated)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 100

**Summary:** Staged BE4-SB for Validation: catalog seed + R2 source PDF, normalized Units 1â9 (`bep4_sb` â catalog), uploaded nine `book-datasets` batches as `pending`, set `books.status=extracted`. Alias map and registry updated.

**Files touched:**
- `scripts/normalize_be4sb_units.mjs` (created)
- `scripts/apply_be4sb_seed.mjs` (created)
- `scripts/set_be4sb_extracted.mjs` (created)
- `scripts/lib/phase1Books.mjs` (updated)
- `scripts/upload_source_pdfs.mjs` (updated)
- `scripts/upload_pilot_batches.mjs` (updated)
- `scripts/smoke_sign_source_pdf.mjs` (updated)
- `supabase/migrations/20261009140000_seed_big_english_4_sb.sql` (created)
- `data/phase1/big_english_4_sb/` units (updated; gitignored; Storage uploaded)
- `docs/phase-1/book-id-alias-map.md` (updated)
- `docs/phase-1/book_id_aliases.json` (updated)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 101

**Summary:** Recorded BE4-SB book-level human verification after owner confirmed Units 1â9 in Validation. Synced JSON metadata to `human_verified`, re-uploaded batches, set `books.status=verified`. Merge/audit left for follow-up.

**Files touched:**
- `scripts/finalize_be4sb_human_verify.mjs` (created)
- `data/phase1/big_english_4_sb/*.json` (updated locally + Storage; gitignored)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 102

**Summary:** Completed BE4-SB Phase 1: remapped Unit 4/9 Studio unit-ID relationship targets, merged canonical v1, D008 PASSED WITH WARNINGS, whole-book audit PASSED. Project Phase 1 now 9/18.

**Files touched:**
- `scripts/fix_be4sb_merge_blockers.mjs` (created)
- `scripts/patch_be4sb_canonical_book_range.mjs` (created)
- `data/phase1/big_english_4_sb/` batches + canonical (updated; gitignored; Storage uploaded)
- `docs/phase-1/audits/BE4-SB_canonical_v1_audit.md` (created)
- `docs/phase-1/book-id-alias-map.md` (updated)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 103

**Summary:** Staged BE4-WB for Validation: catalog seed + R2 source PDF, normalized Units 1â9 (mixed Studio aliases â catalog), uploaded nine `book-datasets` batches as `pending`, set `books.status=extracted`. Alias map and registry updated.

**Files touched:**
- `scripts/normalize_be4wb_units.mjs` (created)
- `scripts/apply_be4wb_seed.mjs` (created)
- `scripts/set_be4wb_extracted.mjs` (created)
- `scripts/lib/phase1Books.mjs` (updated)
- `scripts/upload_source_pdfs.mjs` (updated)
- `scripts/upload_pilot_batches.mjs` (updated)
- `scripts/smoke_sign_source_pdf.mjs` (updated)
- `supabase/migrations/20261009150000_seed_big_english_4_wb.sql` (created)
- `data/phase1/big_english_4_wb/` units (updated; gitignored; Storage uploaded)
- `docs/phase-1/book-id-alias-map.md` (updated)
- `docs/phase-1/book_id_aliases.json` (updated)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 104

**Summary:** Completed BE4-WB Phase 1: HV finalize, grammar-range + relationship hygiene, Unit 7 collision remumber, canonical v1 merge, D008 PASSED WITH WARNINGS, whole-book audit PASSED. Project Phase 1 now 10/18 (level 4 pair closed).

**Files touched:**
- `scripts/finalize_be4wb_human_verify.mjs` (created)
- `scripts/fix_be4wb_merge_blockers.mjs` (created)
- `scripts/renumber_be4wb_merge_collisions.mjs` (created)
- `scripts/fix_be4wb_missing_page_rels.mjs` (created)
- `scripts/patch_be4wb_canonical_book_range.mjs` (created)
- `data/phase1/big_english_4_wb/` batches + canonical (updated; gitignored; Storage uploaded)
- `docs/phase-1/audits/BE4-WB_canonical_v1_audit.md` (created)
- `docs/phase-1/book-id-alias-map.md` (updated)
- `docs/phase-1/book_id_aliases.json` (updated)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 105

**Summary:** Staged remaining Big English books (BE5-SB, BE5-WB, BE6-SB, BE6-WB): sanitized/normalized unit JSON, catalog seed + R2 PDFs, uploaded 9 batches each as `pending`, set `books.status=extracted`. Owner HV next.

**Files touched:**
- `scripts/sanitize_be_unit_json.mjs` (created)
- `scripts/normalize_be_units.mjs` (created)
- `scripts/stage_big_english_books.mjs` (created)
- `scripts/lib/phase1Books.mjs` (updated)
- `scripts/upload_source_pdfs.mjs` (updated)
- `scripts/upload_pilot_batches.mjs` (updated)
- `scripts/smoke_sign_source_pdf.mjs` (updated)
- `supabase/migrations/20261009160000_seed_big_english_5_6.sql` (created)
- `data/phase1/big_english_5_sb/` / `_5_wb/` / `_6_sb/` / `_6_wb/` (updated; gitignored; Storage uploaded)
- `docs/phase-1/book-id-alias-map.md` (updated)
- `docs/phase-1/book_id_aliases.json` (updated)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 106

**Summary:** Completed BE5-SB Phase 1: HV finalize, canonical v1 merge, D008 PASSED WITH WARNINGS, whole-book audit PASSED. Project Phase 1 now 11/18.

**Files touched:**
- `scripts/finalize_be_human_verify.mjs` (created)
- `scripts/patch_canonical_book_range.mjs` (created)
- `data/phase1/big_english_5_sb/` batches + canonical (updated; gitignored; Storage uploaded)
- `docs/phase-1/audits/BE5-SB_canonical_v1_audit.md` (created)
- `docs/phase-1/book-id-alias-map.md` (updated)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 107

**Summary:** Completed BE5-WB Phase 1: HV finalize, grammar-range + U2 vocab relationship hygiene, canonical v1 merge, D008 PASSED WITH WARNINGS, whole-book audit PASSED. Project Phase 1 now 12/18 (level 5 pair closed).

**Files touched:**
- `scripts/fix_be5wb_merge_blockers.mjs` (created)
- `data/phase1/big_english_5_wb/` batches + canonical (updated; gitignored; Storage uploaded)
- `docs/phase-1/audits/BE5-WB_canonical_v1_audit.md` (created)
- `docs/phase-1/book-id-alias-map.md` (updated)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 108

**Summary:** Completed BE6-SB Phase 1: HV finalize, U1 wordlist page_id hygiene, canonical v1 merge, D008 PASSED WITH WARNINGS, whole-book audit PASSED. Project Phase 1 now 13/18.

**Files touched:**
- `scripts/fix_be6sb_merge_blockers.mjs` (created)
- `data/phase1/big_english_6_sb/` batches + canonical (updated; gitignored; Storage uploaded)
- `docs/phase-1/audits/BE6-SB_canonical_v1_audit.md` (created)
- `docs/phase-1/book-id-alias-map.md` (updated)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 109

**Summary:** Completed BE6-WB Phase 1: HV finalize, grammar-range + U8 remumber + unit-alias hygiene, canonical v1 merge, D008 PASSED WITH WARNINGS, whole-book audit PASSED. Big English set closed; Phase 1 now 14/18.

**Files touched:**
- `scripts/fix_be6wb_merge_blockers.mjs` (created)
- `scripts/renumber_be6wb_merge_collisions.mjs` (created)
- `data/phase1/big_english_6_wb/` batches + canonical (updated; gitignored; Storage uploaded)
- `docs/phase-1/audits/BE6-WB_canonical_v1_audit.md` (created)
- `docs/phase-1/book-id-alias-map.md` (updated)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 110

**Summary:** Refactored app TypeScript identity fields to prefer `catalogBookId` / `bookUuid` over overloaded `bookId` / `stableBookId` (D009 mapper cleanup). No stored graph IDs changed.

**Files touched:**
- `app/src/types/curriculum.ts` (updated)
- `app/src/types/validation.ts` (updated)
- `app/src/services/catalogMapper.ts` (updated)
- `app/src/services/curriculumService.ts` (updated)
- `app/src/services/validationService.ts` (updated)
- `app/src/features/shell/WorkspaceProvider.tsx` (updated)
- `app/src/features/validation/*` + series/curriculum library pages (updated)
- `app/src/mocks/curriculum/curriculumSeries.ts` (updated)
- `app/server/authorizeSourcePdf.ts` (updated)
- `docs/9-naming-conventions.md` (updated â v1.5)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 111

**Summary:** Intentionally paused project-wide Phase 1 at 14/18 COMPLETE and made bounded Big-English-only Phase 2 interpretation experiments the active priority (D015). Preserved the four remaining Phase 1 book pipelines as deferred work without defining a Phase 2 schema or implementation.

**Files touched:**
- `.cursor/rules/project_status_rule.mdc` (updated)
- `docs/0-index.md` (updated)
- `docs/1-project-overview.md` (updated)
- `docs/4-decisions.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/7-future.md` (updated)
- `docs/phase-1/curriculum-mapping-process.md` (updated)
- `docs/phase-1/extraction-data-specification.md` (updated)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/phase-6/chalkie-ai-handover-specifications.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 112

**Summary:** Locked D016 first Phase 2 candidates (BE2-SB U6/U7/U8, Unit 6 first), added the Unit 6 experiment protocol without schema lock, and restored the local BE1-SB canonical dataset for offline experiments.

**Files touched:**
- `docs/phase-2/be2-candidate-units.md` (created)
- `docs/phase-2/be2-unit-6-experiment-protocol.md` (created)
- `docs/4-decisions.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/7-future.md` (updated)
- `docs/0-index.md` (updated)
- `docs/phase-1/curriculum-mapping-process.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)
- `data/phase1/big_english_1_sb/canonical/v1.json` (created; gitignored local working copy)

---

### Step 113

**Summary:** Executed first Phase 2 experiment `P2-EXP-BE2-U06-v1` for BE2-SB Unit 6 *My Day*: produced the tagged review artifact, self-evaluated E1âE6 as PASS, and left findings for owner review without locking a Phase 2 schema.

**Files touched:**
- `docs/phase-2/p2-exp-be2-u06-v1-review.md` (created)
- `docs/phase-2/be2-unit-6-experiment-protocol.md` (updated; run status only)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/7-future.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 114

**Summary:** Executed second Phase 2 experiment `P2-EXP-BE2-U06-v2` interpreting BE2-SB Unit 6 into observable learning requirements: defined evaluation criteria in the protocol before results, produced the review artifact, and left V2-E8 as PARTIAL (teacher usefulness unvalidated) without locking a schema or starting U7/U8.

**Files touched:**
- `docs/phase-2/p2-exp-be2-u06-v2-protocol.md` (created)
- `docs/phase-2/p2-exp-be2-u06-v2-review.md` (created)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/7-future.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 115

**Summary:** Executed `P2-EXP-BE2-U07-v1` applying the refined Unit 6 learning-requirements method to BE2-SB Unit 7 *My Favorite Food*, compared methodology transfer (mostly reusable with justified adaptations for countability/offers), and left Unit 8 unstarted pending owner review.

**Files touched:**
- `docs/phase-2/p2-exp-be2-u07-v1-protocol.md` (created)
- `docs/phase-2/p2-exp-be2-u07-v1-review.md` (created)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/7-future.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 116

**Summary:** Executed `P2-EXP-BE2-U08-v1` on BE2-SB Unit 8 *Wild Animals* using the Unit 7 LR method (no redesign), produced the three-unit methodology comparison across U6âU8, and left further Phase 2 work for owner decision without locking a schema.

**Files touched:**
- `docs/phase-2/p2-exp-be2-u08-v1-protocol.md` (created)
- `docs/phase-2/p2-exp-be2-u08-v1-review.md` (created)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/7-future.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 117

**Summary:** Executed `P2-EXP-BE1-U01-v1` transferring the BE2 U6âU8 LR methodology as-is to BE1-SB Unit 1 *Good Morning, Class!*; produced 12 evidence-traceable LRs, evaluation vs BE2 baseline, and recommendations; stopped for owner review (no BE6, no methodology/schema lock).

**Files touched:**
- `docs/phase-2/p2-exp-be1-u01-v1-protocol.md` (created)
- `docs/phase-2/p2-exp-be1-u01-v1-review.md` (created)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/7-future.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 118

**Summary:** Finalized Phase 2 for GitHub preservation with an experiment-status snapshot and tracker updates; prepared handoff to a `phase-3` branch for controlled vertical-mapping experiments (no Phase 2 methodology/schema lock).

**Files touched:**
- `docs/phase-2/phase-2-experiment-status.md` (created)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 119

**Summary:** Realigned operating trackers to Phase 2 overview v2: near-term work is a minimal BE2 Unit 8 Google AI Studio interpretation loop (inspect â prompt/JSON â evaluate), not Phase 3 branch handoff or infrastructure.

**Files touched:**
- `docs/phase-2/phase-2-overview-v2` (created)
- `docs/6-todo.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/7-future.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 120

**Summary:** Inspected local BE2/BE1 Phase 1 canonical JSON and prior Phase 2 U6âU8 / BE1 U1 experiment artifacts; recorded U8 slice readiness (~49 KB, 5 language rows) and implications for the next minimal Studio prompt/JSON design.

**Files touched:**
- `docs/phase-2/p2-inspect-be2-inputs.md` (created)
- `docs/0-index.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 121

**Summary:** Designed the experimental Google AI Studio unit-interpretation prompt V1 and Phase 2 unit+page JSON output sketch v0.1 for BE2 Unit 8 (docs only; no infrastructure; not locked).

**Files touched:**
- `docs/phase-2/google-ai-studio-unit-interpretation-prompt-v1.md` (created)
- `docs/phase-2/phase2-unit-page-output-v0.1.md` (created)
- `docs/0-index.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 122

**Summary:** Added blank Phase 2 v3.1 feedback JSON templates for BE2-SB Units 1, 6, and 8; recorded owner v3.1 prompt adoption (v1 removed) and tracker/index updates for the feedback pass.

**Files touched:**
- `docs/phase-2/p2-feedback-be2-u01-v3.1.json` (created)
- `docs/phase-2/p2-feedback-be2-u06-v3.1.json` (created)
- `docs/phase-2/p2-feedback-be2-u08-v3.1.json` (created)
- `docs/phase-2/google-ai-studio-unit-interpretation-prompt-v3.1.md` (created)
- `docs/phase-2/google-ai-studio-unit-interpretation-prompt-v1.md` (deleted)
- `docs/0-index.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 123

**Summary:** Moved Phase 2 BE2 U1/U6/U8 v3.1 JSON into `data/phase2/big_english_2_sb/feedback/` (book folder + feedback only; no interpretations folder yet) and documented the layout in `data/README.md`.

**Files touched:**
- `data/phase2/big_english_2_sb/feedback/p2-feedback-be2-u01-v3.1.json` (renamed/moved)
- `data/phase2/big_english_2_sb/feedback/p2-feedback-be2-u06-v3.1.json` (renamed/moved)
- `data/phase2/big_english_2_sb/feedback/p2-feedback-be2-u08-v3.1.json` (renamed/moved)
- `data/README.md` (updated)
- `README.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 124

**Summary:** Synced Phase 2 V3.1 + cross-unit experiment docs/data: reorganized unit JSON into `interpretations/` and cross-unit JSON into `cross-unit/`; documented validation (V1.2 file = V1.1 duplicate); recorded D017 experimental preference; pointed next work at an end-to-end later-phase influence experiment.

**Files touched:**
- `data/phase2/big_english_2_sb/interpretations/be2-sb-u01-v3.1.json` (renamed/moved)
- `data/phase2/big_english_2_sb/interpretations/be2-sb-u06-v3.1.json` (renamed/moved)
- `data/phase2/big_english_2_sb/interpretations/be2-sb-u08-v3.1.json` (renamed/moved)
- `data/phase2/big_english_2_sb/cross-unit/be2-cross-unit-v1.1.json` (created/moved)
- `data/phase2/big_english_2_sb/cross-unit/be2-cross-unit-v1.2.json` (created/moved)
- `data/README.md` (updated)
- `README.md` (updated)
- `docs/phase-2/p2-exp-be2-v3.1-cross-unit-status.md` (created)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/phase-2/phase2-v3.1-prompt.md` (created)
- `docs/phase-2/cross-unit-v1.2-prompt.md` (created)
- `docs/phase-2/phase-2-overview-v2.md` (created)
- `docs/phase-2/phase-2-overview-v2` (deleted)
- `docs/phase-2/google-ai-studio-unit-interpretation-prompt-v3.1.md` (deleted)
- `docs/0-index.md` (updated)
- `docs/1-project-overview.md` (updated)
- `docs/3-architecture.md` (updated)
- `docs/4-decisions.md` (updated)
- `docs/phase-1/curriculum-mapping-process.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 125

**Summary:** Re-validated owner-updated Cross-Unit V1.2 JSON as a true connections-only run (schema `0.1.2-experimental`, 8 multi-unit connections, local IDs resolve including U8 FS-09); cleared the prior mislabeled-duplicate unresolved item and refreshed trackers.

**Files touched:**
- `data/phase2/big_english_2_sb/cross-unit/be2-cross-unit-v1.2.json` (updated)
- `docs/phase-2/p2-exp-be2-v3.1-cross-unit-status.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `data/README.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 126

**Summary:** Ran bounded Phase 4 enrichment probe `P4-EXP-BE2-U06-ENRICH-v1` (BE2 U6): Proposal A from Phase 1 only, Proposal B with V3.1 + CON-01/02, and evaluation concluding Phase 2 did not change the three enrichment decisions. Indexed the new probe plus the prior e2e brief folder; operating trackers left unchanged per experiment restrictions.

**Files touched:**
- `docs/phase-4/p4-exp-be2-u06-enrich-v1/p4-exp-be2-u06-enrich-v1-protocol.md` (created)
- `docs/phase-4/p4-exp-be2-u06-enrich-v1/p4-exp-be2-u06-enrich-v1-proposal-a-phase1.md` (created)
- `docs/phase-4/p4-exp-be2-u06-enrich-v1/p4-exp-be2-u06-enrich-v1-proposal-b-informed.md` (created)
- `docs/phase-4/p4-exp-be2-u06-enrich-v1/p4-exp-be2-u06-enrich-v1-evaluation.md` (created)
- `docs/0-index.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 127

**Summary:** Adopted D017 Progressive Curriculum Intelligence as the locked development direction (replacing the prior V3.1+V1.2 process preference wording). Aligned overview, process, architecture, experiment status, and operating trackers; queued BE2-SB U1â9 book overview as the next proposed experiment (awaiting owner execution approval). Deleted staging D017 file after merge into decisions.

**Files touched:**
- `docs/4-decisions.md` (updated)
- `docs/D017-progressive-curriculum-intelligence.md` (deleted)
- `docs/1-project-overview.md` (updated)
- `docs/phase-1/curriculum-mapping-process.md` (updated)
- `docs/3-architecture.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/phase-2/p2-exp-be2-v3.1-cross-unit-status.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/7-future.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 128

**Summary:** Executed D017 Phase 2 Book Intelligence experiment for Big English 2 SB Units 1â9: concise Markdown whole-book curriculum overview from Phase 1 canonical evidence, with E1âE10 self-evaluation. Updated experiment status and operating trackers; awaiting owner review.

**Files touched:**
- `docs/phase-2/experiments/be2-sb-u01-u09-book-overview-d017-v1.md` (created)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 129

**Summary:** Relocated and refactored `curriculum-mapping-process.md` into a project-wide Phases 1â4 workflow (`11-curriculum-mapping-workflow.md`) and a dedicated Phase 1 extraction workflow; updated links, index, and trackers. D017 preserved; D018 not recorded.

**Files touched:**
- `docs/11-curriculum-mapping-workflow.md` (created)
- `docs/phase-1/phase-1-extraction-workflow.md` (created)
- `docs/phase-1/curriculum-mapping-process.md` (deleted)
- `docs/phase-2/be2-candidate-units.md` (updated)
- `docs/phase-2/be2-unit-6-experiment-protocol.md` (updated)
- `docs/3-architecture.md` (updated)
- `docs/1-project-overview.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 130

**Summary:** Recorded ChatGPT owner review findings for the BE2-SB U1â9 D017 overview: promising minimum-sufficient baseline, not formally accepted; flagged U3/U6/U8 potential gaps; next proposed experiment = publisher overview comparison (~90% coverage as review target only). Updated Phase 2 status and operating trackers. Did not regenerate the overview or lock methodology.

**Files touched:**
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/phase-2/experiments/be2-sb-u01-u09-book-overview-d017-v1.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 131

**Summary:** Executed D017 Phase 2 second pass for BE2-SB Units 1â9: created v2 eight-column overview candidate (v1 preserved), validated against publisher Scope and Sequence (~92% meaningful coverage AI-assessed), corrected U3/U6/U8 omissions from Phase 1 evidence, and recorded Learning Outcomes consistency notes. v2 remains experimental / not accepted; D018 stays PROPOSED.

**Files touched:**
- `docs/phase-2/experiments/be2-sb-u01-u09-book-overview-d017-v2.md` (created)
- `docs/phase-2/experiments/be2-sb-u01-u09-overview-v2-review.md` (created)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/1-project-overview.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 132

**Summary:** Recorded owner approval of D017 v2 as the provisional Phase 2 Book Intelligence working baseline (eight-column structure for continued experimentation; format/methodology/schema still not locked). Parked Phase 1 publisher curriculum-plan and review/checkpoint extraction ideas as F017/F018. Left v1/v2 experiment artifacts unchanged; D018 remains PROPOSED.

**Files touched:**
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/7-future.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/1-project-overview.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 133

**Summary:** Generated BE1-SB and BE3-SB eight-column D017-pattern Book Intelligence overviews from verified Phase 1 evidence; completed combined horizontal consistency assessment and BE1âBE2âBE3 vertical sufficiency probe (coarse progression signals; minimum-sufficient for bounded Series Intelligence experiments; not a Phase 3 start). Preserved BE2 v1/v2 unchanged; BE1/BE3 not accepted pending owner review.

**Files touched:**
- `docs/phase-2/experiments/be1-sb-u01-u09-book-overview-d017-v1.md` (created)
- `docs/phase-2/experiments/be3-sb-u01-u09-book-overview-d017-v1.md` (created)
- `docs/phase-2/experiments/be1-be2-be3-book-intelligence-probe-d017-v1.md` (created)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/7-future.md` (updated)
- `docs/1-project-overview.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 134

**Summary:** Diagnosed BE3 Book Intelligence overview against publisher Scope & Sequence: weaker alignment driven mainly by missing Writing-column presentation and under-inferred writing/metalanguage Learning Outcomes, while Phase 1 writing components exist for all nine units. Recommended Test BE5 unchanged before any refine. No overview/prompt/data changes.

**Files touched:**
- `docs/phase-2/experiments/be3-book-intelligence-diagnostic-d017-v1.md` (created)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 135

**Summary:** Generated BE5-SB Units 1â9 Book Intelligence overview with the unchanged D017 eight-column method from Phase 1 only (no Writing column; no post-BE3 inference changes). Publisher BE5 S&S not available locally, so the separate publisher diagnostic was deferred. BE1/BE2/BE3 artifacts and Phase 1 data untouched; overview not accepted.

**Files touched:**
- `docs/phase-2/experiments/be5-sb-u01-u09-book-overview-d017-v1.md` (created)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 136

**Summary:** Ran D017 Step 3 controlled BE3 methodology refinement: Experiment A (inference-only writing LOs, eight columns) and Experiment B (Writing column only, control LOs preserved), both from Phase 1 only. Compared control/A/B with partial publisher-reference validation against diagnostic S&S transcriptions (original PDF missing). Both hypotheses complementary; combined A+B recommended next; no overview approved and methodology not locked.

**Files touched:**
- `docs/phase-2/experiments/be3-sb-u01-u09-book-overview-d017-exp-a.md` (created)
- `docs/phase-2/experiments/be3-sb-u01-u09-book-overview-d017-exp-b.md` (created)
- `docs/phase-2/experiments/be3-methodology-refinement-comparison-d017-v1.md` (created)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 137

**Summary:** Executed BE3 combined A+B Book Intelligence experiment (writing-aware LOs plus Writing column from Phase 1, with differentiated column roles). Produced three-way A/B/A+B comparison and concise owner-review pack. Preserved A/B/control and BE2 v2 baseline; no overview approved and methodology not locked.

**Files touched:**
- `docs/phase-2/experiments/be3-sb-u01-u09-book-overview-d017-exp-ab.md` (created)
- `docs/phase-2/experiments/be3-methodology-a-b-ab-comparison-d017-v1.md` (created)
- `docs/phase-2/experiments/be3-ab-combined-owner-review-d017-v1.md` (created)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 138

**Summary:** Renamed Phase 1 Google AI Studio SB/WB prompt to `google-ai-studio-prompt-sb-wb-v2.md`, added Scope & Sequence prompt `google-ai-studio-prompt-ss-v1.md`, and updated live documentation references (index, workflow, extraction spec, registry, future F017 note). Historical project-steps entries left unchanged.

**Files touched:**
- `docs/phase-1/google-ai-studio-prompt.md` (renamed â `google-ai-studio-prompt-sb-wb-v2.md`)
- `docs/phase-1/google-ai-studio-prompt-sb-wb-v2.md` (created/updated)
- `docs/phase-1/google-ai-studio-prompt-ss-v1.md` (created)
- `docs/0-index.md` (updated)
- `docs/phase-1/phase-1-extraction-workflow.md` (updated)
- `docs/phase-1/extraction-data-specification.md` (updated)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/phase-1/cross-series-schema-review-notes.md` (updated)
- `docs/11-curriculum-mapping-workflow.md` (updated)
- `docs/7-future.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 139

**Summary:** Registered BE3-SB companion Scope & Sequence as a separate local canonical source (`ss_v1.json`) beside preserved SB `v1.json`. Documented paths in the dataset registry, naming conventions, and data README; no JSON/UI/DB/architecture changes and no SBâSS merge.

**Files touched:**
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/9-naming-conventions.md` (updated)
- `data/README.md` (updated)
- `docs/7-future.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 140

**Summary:** Uploaded BE3-SB companion Scope & Sequence JSON to Supabase Storage at `book-datasets/big-english/big_english_3_sb/canonical/ss_v1.json` (download-verified beside existing SB `v1.json`). No merge, no `dataset_versions`/`book_files` changes, no JSON content edits.

**Files touched:**
- `docs/phase-1/dataset-registry.md` (updated)
- `data/README.md` (updated)
- `docs/7-future.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 141

**Summary:** Ran BE3 Unit 1 dry check of publisher SS Writing + I Can against Control/A/B/A+B overviews using `ss_v1.json`. Documented findings only: A+B is the only Unit-1 dual Pass; no overview, JSON, or methodology changes.

**Files touched:**
- `docs/phase-2/experiments/be3-u01-ss-writing-ican-dry-check-d017-v1.md` (created)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 142

**Summary:** Repeated BE3 Unit 2 SS Writing + I Can dry check (A+B dual Pass again). Expanded testing to Units 3/5/9 sample before any book-wide decision; A+B dual Pass on all five sampled units. No overview/JSON/methodology changes; Units 4/6/7/8 still unchecked.

**Files touched:**
- `docs/phase-2/experiments/be3-u02-ss-writing-ican-dry-check-d017-v1.md` (created)
- `docs/phase-2/experiments/be3-u03-u05-u09-ss-writing-ican-dry-check-d017-v1.md` (created)
- `docs/phase-2/experiments/be3-u01-ss-writing-ican-dry-check-d017-v1.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 143

**Summary:** Completed BE3 SS Writing + I Can dry checks for remaining Units 4/6/7/8 and produced a full 9/9 roll-up: A+B is the only dual Pass on every unit. Updated owner-review pack addendum; proceeded to owner decision with no overview edits and no methodology changes.

**Files touched:**
- `docs/phase-2/experiments/be3-u04-u06-u07-u08-ss-writing-ican-dry-check-d017-v1.md` (created)
- `docs/phase-2/experiments/be3-ss-writing-ican-dry-check-full-roll-up-d017-v1.md` (created)
- `docs/phase-2/experiments/be3-ab-combined-owner-review-d017-v1.md` (updated)
- `docs/phase-2/experiments/be3-u03-u05-u09-ss-writing-ican-dry-check-d017-v1.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 144

**Summary:** Recorded owner decision under D017 working approvals: prefer BE3 Experiment A+B for BE3-SB only; BE2 v2 baseline unchanged; methodology/schema not locked; no implementation. Updated owner-review pack, roll-up, experiment status, and trackers. Also committed existing D018 Chalkie prompt-iteration decision already present in the decision log.

**Files touched:**
- `docs/4-decisions.md` (updated)
- `docs/phase-2/experiments/be3-sb-u01-u09-book-overview-d017-exp-ab.md` (updated)
- `docs/phase-2/experiments/be3-ab-combined-owner-review-d017-v1.md` (updated)
- `docs/phase-2/experiments/be3-ss-writing-ican-dry-check-full-roll-up-d017-v1.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 145

**Summary:** Independently regenerated BE3 Unit 1 using the approved A+B approach from Phase 1 only and compared it to the existing A+B Unit 1 row. Reproducibility PASS (exact on non-experimental columns; near-exact on LO/Writing with soft âdailyâ wording only). Existing A+B overview and methodology/schema/UI left unchanged.

**Files touched:**
- `docs/phase-2/experiments/be3-u01-ab-regen-reproducibility-d017-v1.md` (created)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 146

**Summary:** Independently regenerated BE3 Unit 9 using the approved A+B approach from Phase 1 only and compared it to the existing A+B Unit 9 row (book-end reproducibility check). PASS â non-experimental columns and Writing exact; LO near-exact (soft âschool tripsâ vs âtripsâ). Existing A+B overview and methodology/schema/UI left unchanged.

**Files touched:**
- `docs/phase-2/experiments/be3-u09-ab-regen-reproducibility-d017-v1.md` (created)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 147

**Summary:** Independently regenerated BE3 Unit 5 using the approved A+B approach from Phase 1 only and compared it to the existing A+B Unit 5 row (mid-book reproducibility check). PASS â non-experimental columns and Writing exact; LO near-exact (soft âabout seasonsâ only). With U1+U9, start/mid/end sampling all PASS. Existing A+B overview and methodology/schema/UI left unchanged.

**Files touched:**
- `docs/phase-2/experiments/be3-u05-ab-regen-reproducibility-d017-v1.md` (created)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 148

**Summary:** Completed read-only A+B reproducibility check for remaining BE3 Units 2â4 and 6â8 and produced a full 9/9 roll-up with prior U1/U5/U9. All units PASS; discrepancies are soft Near LO paraphrases only (0 Drift/Fail). Existing A+B overview and methodology/schema/UI left unchanged.

**Files touched:**
- `docs/phase-2/experiments/be3-ab-regen-reproducibility-full-roll-up-d017-v1.md` (created)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 149

**Summary:** Read-only compatibility assessment for controlled implementation of BE3 Unit 1 A+B against existing Postgres catalog tables and UI data contracts. Catalog identity compatible; overview cells must stay out of relational tables (D006); no live Book Intelligence UI consumer (Writing column gap). No database, schema, or UI changes.

**Files touched:**
- `docs/phase-2/experiments/be3-u01-ab-implementation-compatibility-d017-v1.md` (created)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 150

**Summary:** Defined the nine-column Book Intelligence UI data contract draft (A+B): JSON/TS field names, types, book/unit identity, document envelope, and BE3 Unit 1 example structure. Documentation only â not locked; no implementation, database, or UI changes.

**Files touched:**
- `docs/phase-2/book-intelligence-ui-data-contract-v1.md` (created)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 151

**Summary:** Created BE3 Unit 1 A+B Book Intelligence JSON artifact conforming to the draft nine-column UI data contract (`column_set: nine_column_ab`). Content from preferred A+B overview Unit 1 row. No UI, database, or Storage wiring.

**Files touched:**
- `data/phase2/big_english_3_sb/interpretations/be3-sb-u01-book-intelligence-ab-v0.1-draft.json` (created)
- `data/README.md` (updated)
- `docs/phase-2/book-intelligence-ui-data-contract-v1.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 152

**Summary:** Added read-only TypeScript Book Intelligence loader/validator (types, field map, parse/map, load-from-JSON-text) and a CLI verifier for the draft nine-column contract. BE3 Unit 1 JSON PASS with field-mapping checks; app typecheck clean. No UI, database, or Storage changes.

**Files touched:**
- `app/src/types/bookIntelligence.ts` (created)
- `app/src/lib/bookIntelligence/fieldMap.ts` (created)
- `app/src/lib/bookIntelligence/parseBookIntelligenceOverview.ts` (created)
- `app/src/lib/bookIntelligence/loadBookIntelligenceOverview.ts` (created)
- `app/src/lib/bookIntelligence/index.ts` (created)
- `scripts/validate_book_intelligence_json.mjs` (created)
- `docs/phase-2/book-intelligence-ui-data-contract-v1.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 153

**Summary:** Built a read-only BE3 Unit 1 Book Intelligence UI preview at `/app/book-intelligence` using the validated TS loader and local Phase 2 JSON (Vite alias). Displays all 8 content fields including Writing and inferred Learning Outcomes provenance. No Supabase, database, or schema changes.

**Files touched:**
- `app/src/features/book-intelligence/BookIntelligencePreviewPage.tsx` (created)
- `app/src/features/book-intelligence/BookIntelligenceUnitPreview.tsx` (created)
- `app/src/features/book-intelligence/loadLocalBe3Unit1BookIntelligence.ts` (created)
- `app/src/App.tsx` (updated)
- `app/src/components/shared/Sidebar.tsx` (updated)
- `app/src/vite-env.d.ts` (updated)
- `app/vite.config.ts` (updated)
- `app/tsconfig.app.json` (updated)
- `docs/phase-2/book-intelligence-ui-data-contract-v1.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/4-mock-data-registry.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 154

**Summary:** Extended the local Book Intelligence preview to all nine BE3 units from the preferred A+B overview. Replaced the Unit 1-only JSON with a Units 1â9 artifact; CLI PASS `units=9`; preview lists all unit cards with jump links. No Supabase, database, or schema changes.

**Files touched:**
- `data/phase2/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json` (created)
- `data/phase2/big_english_3_sb/interpretations/be3-sb-u01-book-intelligence-ab-v0.1-draft.json` (deleted)
- `app/src/features/book-intelligence/loadLocalBe3BookIntelligence.ts` (created)
- `app/src/features/book-intelligence/loadLocalBe3Unit1BookIntelligence.ts` (deleted)
- `app/src/features/book-intelligence/BookIntelligencePreviewPage.tsx` (updated)
- `app/src/features/book-intelligence/BookIntelligenceUnitPreview.tsx` (updated)
- `app/vite.config.ts` (updated)
- `app/tsconfig.app.json` (updated)
- `app/src/vite-env.d.ts` (updated)
- `scripts/validate_book_intelligence_json.mjs` (updated)
- `data/README.md` (updated)
- `docs/phase-2/book-intelligence-ui-data-contract-v1.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/4-mock-data-registry.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 155

**Summary:** Ran visual/content QA of all nine BE3 BI preview units against the preferred A+B overview (completeness, accuracy, formatting, AI-inferred LO labels). Fixed one discrepancy â Unit 8 Learning Outcomes restored to overview wording. Re-check 9/9 PASS; CLI PASS. No DB/Storage/schema changes.

**Files touched:**
- `data/phase2/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 156

**Summary:** Uploaded the validated BE3 Units 1â9 A+B Book Intelligence JSON to Supabase Storage (`book-datasets` interpretations path) as a separate Phase 2 companion. Download SHA-256 integrity verified. Added Storage-only upload script. No `book_files` / `dataset_versions`, schema, or UI wiring changes.

**Files touched:**
- `scripts/upload_book_intelligence_json.mjs` (created)
- `supabase/README.md` (updated)
- `data/README.md` (updated)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/phase-2/book-intelligence-ui-data-contract-v1.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/4-mock-data-registry.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 157

**Summary:** Switched the Book Intelligence preview from local Vite JSON to the verified Supabase Storage artifact. Kept the draft-contract loader; added loading/error states; verified all 9 units (Writing + AI-inferred LOs). Removed the local `@bi-be3-ab-json` alias. No database, schema, or methodology changes.

**Files touched:**
- `app/src/features/book-intelligence/loadBe3BookIntelligenceFromStorage.ts` (created)
- `app/src/features/book-intelligence/loadLocalBe3BookIntelligence.ts` (deleted)
- `app/src/features/book-intelligence/BookIntelligencePreviewPage.tsx` (updated)
- `app/vite.config.ts` (updated)
- `app/tsconfig.app.json` (updated)
- `app/src/vite-env.d.ts` (updated)
- `data/README.md` (updated)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/phase-2/book-intelligence-ui-data-contract-v1.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/4-mock-data-registry.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 158

**Summary:** Integrated Book Intelligence into Series Library navigation. BE3-SB book cards expose a Book Intelligence action that opens `/app/book-intelligence/:catalogBookId` using the existing Storage loader/registry. No database, schema, or methodology changes.

**Files touched:**
- `app/src/features/book-intelligence/bookIntelligenceStorageRegistry.ts` (created)
- `app/src/features/book-intelligence/loadBookIntelligenceFromStorage.ts` (created)
- `app/src/features/book-intelligence/loadBe3BookIntelligenceFromStorage.ts` (deleted)
- `app/src/features/book-intelligence/BookIntelligencePreviewPage.tsx` (updated)
- `app/src/features/series-library/SeriesLibrary.tsx` (updated)
- `app/src/features/series-library/SeriesLibraryPage.tsx` (updated)
- `app/src/App.tsx` (updated)
- `app/src/components/shared/Sidebar.tsx` (updated)
- `docs/phase-2/book-intelligence-ui-data-contract-v1.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/4-mock-data-registry.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 159

**Summary:** Added a Units 1â9 selector to the Book Intelligence preview so one unit shows at a time instead of all nine stacked. Preserved all 8 content fields and AI-inferred LO labels. No database, schema, or methodology changes.

**Files touched:**
- `app/src/features/book-intelligence/BookIntelligencePreviewPage.tsx` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 160

**Summary:** Made the Book Intelligence selected unit URL-addressable via `?unit={unitNumber}` (e.g. `?unit=5`). Refreshing or sharing the URL opens the correct unit; invalid/missing params fall back to Unit 1 and normalize the query. No database, schema, or methodology changes.

**Files touched:**
- `app/src/features/book-intelligence/BookIntelligencePreviewPage.tsx` (updated)
- `app/src/features/book-intelligence/bookIntelligenceStorageRegistry.ts` (updated)
- `docs/phase-2/book-intelligence-ui-data-contract-v1.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 161

**Summary:** Added a read-only Unit 1 âView Source Evidenceâ control on the Book Intelligence overview that selects the catalog book and opens Phase 1 Validation at `?unit=1`. Validation honors the unit query when loading. Units 2â9 deferred. No database, schema, or methodology changes.

**Files touched:**
- `app/src/features/book-intelligence/phase1EvidenceLink.ts` (created)
- `app/src/features/book-intelligence/BookIntelligenceUnitPreview.tsx` (updated)
- `app/src/features/book-intelligence/BookIntelligencePreviewPage.tsx` (updated)
- `app/src/features/validation/ValidationWorkspace.tsx` (updated)
- `docs/phase-2/book-intelligence-ui-data-contract-v1.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 162

**Summary:** Extended View Source Evidence to Units 2â9 using the Unit 1 pattern. Verified each BI unit number maps to a unique Validation `?unit=N` target. No database, schema, or methodology changes.

**Files touched:**
- `app/src/features/book-intelligence/phase1EvidenceLink.ts` (updated)
- `app/src/features/book-intelligence/BookIntelligenceUnitPreview.tsx` (updated)
- `docs/phase-2/book-intelligence-ui-data-contract-v1.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 163

**Summary:** Added Validation âBack to Book Intelligenceâ that returns to the same catalog book and selected unit (`?unit=N`). Syncs Validationâs unit query as the picker changes. Verified U1âU9 round-trip paths. No database, schema, or methodology changes.

**Files touched:**
- `app/src/features/validation/ValidationHeader.tsx` (updated)
- `app/src/features/validation/ValidationWorkspace.tsx` (updated)
- `docs/phase-2/book-intelligence-ui-data-contract-v1.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 164

**Summary:** Ran Library â BI â Unit â Validation â Back E2E acceptance for BE3-SB. Fixed two Validation defects (reload on every `?unit=` change; deep-link unit overwritten by Unit 1). Recorded results; scripted U1âU9 PASS. No DB/schema/methodology changes.

**Files touched:**
- `app/src/features/validation/ValidationWorkspace.tsx` (updated)
- `scripts/verify_bi_validation_e2e_acceptance.mjs` (created)
- `docs/phase-2/experiments/be3-bi-validation-e2e-acceptance-d017-v1.md` (created)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 165

**Summary:** Recorded D019 â BE3 Book Intelligence MVP UI path implementation-validated (Library â BI â Unit â Validation â Back). Explicitly not a methodology/schema/contract lock. Synced progress, experiment status, and related docs.

**Files touched:**
- `docs/4-decisions.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/1-project-overview.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/phase-2/experiments/be3-bi-validation-e2e-acceptance-d017-v1.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 166

**Summary:** Refactored Book Intelligence preview to Validation-style split layout: resizable left panel for eight BI fields (AI-inferred LO label preserved), right panel source PDF via existing `ValidationPdfPane`. Kept Storage load, `?unit=` navigation, and evidence links. Typecheck + Unit 1 verify + E2E script PASS. No DB/schema/methodology changes.

**Files touched:**
- `app/src/features/book-intelligence/BookIntelligencePreviewPage.tsx` (updated)
- `app/src/features/book-intelligence/BookIntelligenceUnitPreview.tsx` (updated)
- `docs/phase-2/book-intelligence-ui-data-contract-v1.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 167

**Summary:** Fixed Book Intelligence PDF navigation: removed remount `key` so `ValidationPdfPane` stays mounted like Validation; unit changes jump via Phase 1 `pdf_page_start`; toolbar wraps so Prev/Next/Go stay usable. Verified U1=4, U5=72, U9=142. No DB/schema/methodology changes.

**Files touched:**
- `app/src/features/book-intelligence/BookIntelligencePreviewPage.tsx` (updated)
- `app/src/features/book-intelligence/resolvePdfInitialPage.ts` (created)
- `app/src/features/validation/ValidationPdfPane.tsx` (updated)
- `scripts/verify_bi_pdf_navigation.mjs` (created)
- `docs/phase-2/book-intelligence-ui-data-contract-v1.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 168

**Summary:** Synchronized Book Intelligence with PDF navigation: visible page range selects the matching unit and `?unit=N`; inter-unit review/checkpoint gaps show no-BI message; continuous PDF browsing preserved; loop prevention via `initialPageEnd` overlap skip. Verified U3âreviewâU4, U6âreviewâU7, U9âreview. No schema/data changes.

**Files touched:**
- `app/src/features/book-intelligence/BookIntelligencePreviewPage.tsx` (updated)
- `app/src/features/book-intelligence/syncUnitFromPdfPages.ts` (created)
- `app/src/features/book-intelligence/resolvePdfInitialPage.ts` (updated)
- `app/src/features/validation/ValidationPdfPane.tsx` (updated)
- `scripts/verify_bi_pdf_unit_sync.mjs` (created)
- `docs/phase-2/book-intelligence-ui-data-contract-v1.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 169

**Summary:** Fixed Review 1 â Unit 4 selecting Unit 1. Root cause: clearing `?unit=` on review gaps plus `resolveUnit` fallback to `units[0]` applied a Unit 1 PDF jump. Stopped the fallback, kept `?unit=` across gaps, and suppressed unit-start jumps for PDF-driven sync. Verified Review1âU4; nav + E2E PASS.

**Files touched:**
- `app/src/features/book-intelligence/BookIntelligencePreviewPage.tsx` (updated)
- `scripts/verify_bi_pdf_unit_sync.mjs` (updated)
- `docs/phase-2/book-intelligence-ui-data-contract-v1.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 170

**Summary:** Ran complete U1âU9 PDF navigation regression (forward/backward walks, review gaps, unit selection targets, deep links, Storage). No application defects; corrected test-only gap-straddle assertion. Companion nav/E2E scripts and typecheck PASS.

**Files touched:**
- `scripts/verify_bi_pdf_u1_u9_regression.mjs` (created)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 171

**Summary:** Recorded the completed BE3 BI PDF navigation regression milestone in progress and Phase 2 acceptance docs (new acceptance artifact; cross-links from D019 E2E acceptance and experiment status). No implementation changes; methodology not locked.

**Files touched:**
- `docs/phase-2/experiments/be3-bi-pdf-navigation-regression-acceptance-d017-v1.md` (created)
- `docs/phase-2/experiments/be3-bi-validation-e2e-acceptance-d017-v1.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 172

**Summary:** Documented BE2 Book Intelligence integration plan: compared BE2 v2 eight-column overview + Phase 1 data with BE3 nine-column contract/UI; listed compatibility gaps; proposed book-independent column-set UI and phased P0âP5 implementation. Docs only â no code, schema, DB, or methodology changes.

**Files touched:**
- `docs/phase-2/experiments/be2-bi-integration-compatibility-plan-d017-v1.md` (created)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 173

**Summary:** Generalized the Book Intelligence draft contract for `eight_column_baseline` and `nine_column_ab`: Writing required only for nine-column; column-set-driven UI fields; shared CLI validator + dual-set automated tests. BE3 path preserved (typecheck + E2E/PDF regressions PASS). No BE2 JSON, Storage, DB, or methodology lock.

**Files touched:**
- `app/src/types/bookIntelligence.ts` (updated)
- `app/src/lib/bookIntelligence/fieldMap.ts` (updated)
- `app/src/lib/bookIntelligence/parseBookIntelligenceOverview.ts` (updated)
- `app/src/lib/bookIntelligence/index.ts` (updated)
- `app/src/features/book-intelligence/BookIntelligenceUnitPreview.tsx` (updated)
- `scripts/lib/book_intelligence_contract.mjs` (created)
- `scripts/validate_book_intelligence_json.mjs` (updated)
- `scripts/tests/book_intelligence_column_sets.test.mjs` (created)
- `docs/phase-2/book-intelligence-ui-data-contract-v1.md` (updated)
- `docs/phase-2/experiments/be2-bi-integration-compatibility-plan-d017-v1.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 174

**Summary:** Ported approved BE2 v2 eight-column Markdown overview to a local Book Intelligence JSON artifact (`eight_column_baseline`, Phase 1 `bep2_unit_*` IDs). Validated against dual-set loader; all nine units matched Markdown (0 discrepancies). No Writing column, Storage, DB, or UI changes.

**Files touched:**
- `data/phase2/big_english_2_sb/interpretations/be2-sb-u01-u09-book-intelligence-v2-eight-column-v0.1-draft.json` (created)
- `scripts/build_be2_book_intelligence_json.mjs` (created)
- `scripts/compare_be2_bi_json_to_markdown.mjs` (created)
- `scripts/tests/book_intelligence_column_sets.test.mjs` (updated)
- `docs/phase-2/book-intelligence-ui-data-contract-v1.md` (updated)
- `docs/phase-2/experiments/be2-bi-integration-compatibility-plan-d017-v1.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 175

**Summary:** Enabled BE2 in Series Library â Book Intelligence: uploaded eight-column BI JSON to Storage (integrity verified) and registered `big_english_2_sb` in the BI Storage registry. Default BI book remains BE3; no Postgres / methodology lock.

**Files touched:**
- `app/src/features/book-intelligence/bookIntelligenceStorageRegistry.ts` (updated)
- `scripts/upload_book_intelligence_json.mjs` (updated)
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/phase-2/book-intelligence-ui-data-contract-v1.md` (updated)
- `docs/phase-2/experiments/be2-bi-integration-compatibility-plan-d017-v1.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 176

**Summary:** Ran BE2 BI E2E acceptance: fixed LibraryâBI / deep-link workspace selection; added BE2 E2E + PDF U1âU9 regression scripts (eight-column, gaps, deep links); all PASS; BE3 regressions still green. No schema/data/methodology changes.

**Files touched:**
- `app/src/features/series-library/SeriesLibraryPage.tsx` (updated)
- `app/src/features/book-intelligence/BookIntelligencePreviewPage.tsx` (updated)
- `scripts/verify_be2_bi_validation_e2e_acceptance.mjs` (created)
- `scripts/verify_be2_bi_pdf_u1_u9_regression.mjs` (created)
- `docs/phase-2/experiments/be2-bi-e2e-acceptance-d017-v1.md` (created)
- `docs/phase-2/experiments/be2-bi-integration-compatibility-plan-d017-v1.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 177

**Summary:** BI-first navigation UX: sidebar Book Intelligence targets the selected registered book (Workspace fallback); Series/Curriculum primary open prefers BI with Workspace secondary. No schema/data/methodology changes.

**Files touched:**
- `app/src/components/shared/Sidebar.tsx` (updated)
- `app/src/features/series-library/SeriesLibrary.tsx` (updated)
- `app/src/features/curriculum-library/CurriculumLibraryPage.tsx` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 178

**Summary:** Recorded BE2 BI acceptance milestone in progress and amended D019 for two-book MVP UI implementation validation (BE2 eight-column + BE3 nine-column). Both methodologies remain provisional; schema/contract not locked.

**Files touched:**
- `docs/4-decisions.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/1-project-overview.md` (updated)
- `docs/0-index.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/phase-2/experiments/be2-bi-e2e-acceptance-d017-v1.md` (updated)
- `docs/phase-2/experiments/be3-bi-validation-e2e-acceptance-d017-v1.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 179

**Summary:** Reconciled documentation to teacher-first development priorities with D018 as immediate Chalkie prompt-validation experiment. Clarified Vertical Mapping parked (not a D018 prerequisite); promoted F007 partially; preserved D017/D018/D019 and seven-phase architecture without methodology locks or code changes.

**Files touched:**
- `docs/1-project-overview.md` (updated)
- `docs/3-architecture.md` (updated)
- `docs/7-future.md` (updated)
- `docs/11-curriculum-mapping-workflow.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 180

**Summary:** Verified BE2 companion Scope & Sequence `ss_v1.json` (local parse + Storage upload/hash match), registered it beside BE2 SB canonical without `dataset_versions` wiring, and prepared the smallest D018 V1 experiment pack for BE2 Unit 8 pp. 128â129 (ready Chalkie paste + evaluation checklist; no app/schema changes).

**Files touched:**
- `docs/phase-5/d018-v1-be2-u08-p128-129-experiment.md` (created)
- `docs/phase-1/dataset-registry.md` (updated)
- `data/README.md` (updated)
- `docs/7-future.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)
- `tmp/verify_be2_ss_v1.mjs` (created; local ops helper)

---

### Step 181

**Summary:** Integrated Chalkie interface & generation workflow V1 into the documentation system as an Active/Evolving operational reference. Cross-linked from overview, architecture, D018 operational note, curriculum workflow handoff, parked handover spec, and future lot (F019). Renamed uploaded file to the canonical path declared in the doc; D018 substance and seven-phase architecture unchanged; no app/schema changes.

**Files touched:**
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (added; renamed from `â¦-v1.md` to match declared path)
- `docs/0-index.md` (updated)
- `docs/1-project-overview.md` (updated)
- `docs/3-architecture.md` (updated)
- `docs/4-decisions.md` (updated â D018 operational note only)
- `docs/5-progress.md` (updated)
- `docs/7-future.md` (updated)
- `docs/11-curriculum-mapping-workflow.md` (updated)
- `docs/phase-6/chalkie-ai-handover-specifications.md` (updated)
- `docs/phase-5/d018-v1-be2-u08-p128-129-experiment.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 182

**Summary:** Recorded completed D018 V1 Chalkie generation and seven-criterion evaluation for BE2 U8 pp. 128â129. Formal rubric BELOW PASS THRESHOLD (4 Yes / 3 Partial); conditionally accepted as comparative baseline; V2 not started; Pass-gate bypass not authorized. No app/schema changes; D018 design unchanged.

**Files touched:**
- `docs/phase-5/d018-v1-be2-u08-p128-129-experiment.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 183

**Summary:** Recorded owner one-time experimental override under D018 authorizing V2 (+ Workbook) despite V1 remaining BELOW PASS THRESHOLD. V1 closed as usable comparative baseline without formal Pass or rerun; rubric/productization/V3âV5 unchanged; V2 prompt not generated.

**Files touched:**
- `docs/4-decisions.md` (updated â D018 owner override note only)
- `docs/phase-5/d018-v1-be2-u08-p128-129-experiment.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 185

**Summary:** Prepared smallest D018 V2 experiment pack adding BE2 Workbook pp. 104â105 to V1 SS + SB pp. 128â129 evidence. Recorded provenance, WB additions, comparison question, and unchanged seven-criterion rubric; deferred Chalkie prompt; excluded WB 106â117; V1 findings unchanged.

**Files touched:**
- `docs/phase-5/d018-v2-be2-u08-sb128-129-wb104-105-experiment.md` (created)
- `docs/phase-5/d018-v1-be2-u08-p128-129-experiment.md` (updated â changelog cross-ref only)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 186

**Summary:** Drafted copy-ready D018 V2 Chalkie paste prompt (SS + SB 128â129 + WB 104â105) into the V2 experiment pack. Status DRAFTED / NOT RUN; evaluation findings left blank; no Chalkie run; locked decisions and datasets unchanged.

**Files touched:**
- `docs/phase-5/d018-v2-be2-u08-sb128-129-wb104-105-experiment.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 187

**Summary:** Recorded D018 V2 Chalkie generation settings and initial PDF review findings (GENERATED / INITIAL REVIEW ONLY). Captured artifact `Wild Animals (2).pdf` (30 pages with reveals), textbook-alignment positives, audio provenance concern (âZoo Friendsâ mislabeled `[SB]`), WB contribution notes, and efficiency/scope observations. Formal seven-criterion scores and Pass/Fail deferred to Step 188; prompt not rewritten; D018 unchanged.

**Files touched:**
- `docs/phase-5/d018-v2-be2-u08-sb128-129-wb104-105-experiment.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 188

**Summary:** Formally evaluated D018 V2 against the seven-criterion rubric using Step 187 PDF review evidence. Result 4 Yes / 3 Partial â BELOW PASS THRESHOLD (Yes-count and invented listening labeled `[SB]`). Compared with V1: WB improved dual-book practice alignment but not formal Pass. Audio clarified as accurate AI supplementary â  publisher-authentic. Prompt not rewritten; V3 not authorized; D018 unchanged.

**Files touched:**
- `docs/phase-5/d018-v2-be2-u08-sb128-129-wb104-105-experiment.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 189

**Summary:** Recorded owner authorization for D018 V2b â controlled audio-OFF rerun of the exact V2 prompt (Single Lesson; same framework/theme/grades/slide count). Not V3; original V2 formal verdict preserved; generation not started.

**Files touched:**
- `docs/phase-5/d018-v2-be2-u08-sb128-129-wb104-105-experiment.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 190

**Summary:** Recorded D018 V2b Chalkie generation (same V2 prompt; Audio OFF) and ChatGPT initial review of `WILD ANIMALS(2).pdf` (30 pages with reveals). Zoo Friends absent; remaining concerns are unverified WB answers and invented song sentence. Formal seven-criterion scores deferred to Step 191; V1/V2 evaluations and D018 unchanged.

**Files touched:**
- `docs/phase-5/d018-v2-be2-u08-sb128-129-wb104-105-experiment.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 191

**Summary:** Formally evaluated D018 V2b (Audio OFF) against the seven-criterion rubric using Step 190 PDF review evidence. Result 5 Yes / 2 Partial â PASS (Yes-count, no hard scope fail, invented-listening gate cleared). Audio OFF improved formal result vs V2; concision not improved; residual `[WB]` provenance Partials recorded. Prompt unchanged; V2 verdict preserved; V3 not authorized; D018 unchanged.

**Files touched:**
- `docs/phase-5/d018-v2-be2-u08-sb128-129-wb104-105-experiment.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 192

**Summary:** Recorded owner acceptance of D018 V2b (`WILD ANIMALS(2).pdf`, Audio OFF) as the V2-family Pass artifact. Audio OFF enabled the Pass by clearing the listening mislabel; residual p.13 / pp.19â20 / length notes are optional cleanup only (verdict not reopened; no rerun). V2 verdict unchanged; V3 not authorized; `4-decisions.md` not updated.

**Files touched:**
- `docs/phase-5/d018-v2-be2-u08-sb128-129-wb104-105-experiment.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 193

**Summary:** Recorded owner decision to retain D018 V2b as the final stopping point for the V2-family. V3 not authorized; track closed; no rerun or prompt refine; `4-decisions.md` not updated. Follow-up in the same prompt: refreshed index lifecycle counts/intro and `7-future.md` F007 note for the closed V2-family stop.

**Files touched:**
- `docs/phase-5/d018-v2-be2-u08-sb128-129-wb104-105-experiment.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/0-index.md` (updated)
- `docs/7-future.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 194

**Summary:** Owner authorized one bounded D018 V2c prompt-refinement attempt before considering V3 / Book Intelligence. V2b remains an accepted Pass artifact; the V2c prompt preserves Audio OFF and the same evidence scope while targeting source-label accuracy, unnecessary slides, and invented textbook details. V3 remains unauthorized and no further V2 iteration is implied.

**Files touched:**
- `docs/phase-5/d018-v2-be2-u08-sb128-129-wb104-105-experiment.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/7-future.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 195

**Summary:** Recorded D018 V2c Chalkie generation (`Wild Animals(3).pdf`, 30 pages, Audio OFF, Single Lesson) and initial PDF review. Positives include 12 animals, like+can frame, SB/WB practice, no fabricated listening, and removal of the V2b WB picture-answer sequence. Concerns: grammar (âA elephantâ), âchaseâ attribution to SB p.129, supplementary labeled `[SB]`/`[SS]`, length still 30 pages. Formal scores deferred to Step 196; V2b PASS preserved; V3 not authorized; D018/rubric unchanged.

**Files touched:**
- `docs/phase-5/d018-v2-be2-u08-sb128-129-wb104-105-experiment.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/7-future.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 196

**Summary:** Formally evaluated D018 V2c against the seven-criterion rubric using Step 195 PDF review evidence (PDF not local). Result 5 Yes / 2 Partial â PASS (equivalent formal totals to V2b). Mixed qualitative trade-off; V2c not preferred by default; V2b remains accepted Pass artifact. V3 not authorized; further V2 iterations not auto-authorized; D018/rubric/`4-decisions.md` unchanged.

**Files touched:**
- `docs/phase-5/d018-v2-be2-u08-sb128-129-wb104-105-experiment.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/7-future.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 197

**Summary:** Closed the D018 V2-family after V1/V2/V2b/V2c. Retained V2b as preferred Pass baseline and future control; V2c Pass not preferred; no V2d (diminishing expected value). Preserved cross-version limitations. Recorded Step 198 as next proposed action: V3 Book Intelligence design only (no generation). D018/rubric/`4-decisions.md` unchanged.

**Files touched:**
- `docs/phase-5/d018-v2-be2-u08-sb128-129-wb104-105-experiment.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/7-future.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 198

**Summary:** Designed D018 V3 Book Intelligence experiment (planning only). Control = V2b; treatment = append-only `[BI]` from BE2 D017 v2 eight-column Unit 8 (`bep2_unit_08`); habitats/values/phonics/adjective-order excluded. Predeclared V3 value criteria and better/equivalent/worse rules; owner approval gate before generation. No Chalkie run; V2b Pass preserved; `4-decisions.md` unchanged.

**Files touched:**
- `docs/phase-5/d018-v3-be2-u08-book-intelligence-experiment.md` (created)
- `docs/phase-5/d018-v2-be2-u08-sb128-129-wb104-105-experiment.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/7-future.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 199

**Summary:** Applied V3 `[BI]` wording revision (reinforce abilities through existing like+can frame; optional yes/no must not become a separate grammar lesson) and recorded owner approval for **one** controlled V3 generation. Not generated or formally scored in this step. V2b remains control; V4/V5/reruns not authorized; `4-decisions.md` unchanged.

**Files touched:**
- `docs/phase-5/d018-v3-be2-u08-book-intelligence-experiment.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/7-future.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 200

**Summary:** Recorded the completed D018 V3 Single Lesson generation (`WILD ANIMALS (1)(1).pdf`, 31 exported PDF pages, Audio OFF) without inventing initial-review findings or formal scores. Documented an owner-directed experimental pivot: Chalkie Single Lesson slide allocation may constrain scaffolding; approved a design-only two-lesson Lesson Series direction (SB introduce â WB practise), proposed 30 slides per lesson pending owner confirmation, added instructional-quality evaluation dimensions, and parked a three-lesson comparison plus ChatGPT + Canva benchmark. No lesson-series generation, new scores, application changes, or `4-decisions.md` update.

**Files touched:**
- `docs/phase-5/d018-v3-be2-u08-book-intelligence-experiment.md` (updated)
- `docs/phase-5/d018-lesson-series-be2-u08-experiment-design.md` (created)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/7-future.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 201

**Summary:** Finalized the D018 Lesson Series Experiment 1 configuration: Chalkie Lesson Series with two approximately 40-minute lessons (duration includes textbook work), 30 requested slides per lesson, Lesson 1 SB introduce, Lesson 2 WB practise, unchanged V3 inputs / `[BI]`, Audio OFF, Chalkie Default, Simple, Grade 3 / English ability Grade 2. Documented expected basic scaffolding, purposeful repetition versus filler, and Curriculum/Book vs future Teaching vs future School/Teacher-Specific Intelligence boundaries. Additional instructional-quality dimensions remain observational; no thresholds or generation authorized.

**Files touched:**
- `docs/phase-5/d018-lesson-series-be2-u08-experiment-design.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 202

**Summary:** Drafted the copy-ready D018 Lesson Series Experiment 1 prompt from the approved Step 201 configuration. The prompt defines two approximately 40-minute lessons (SB introduce â WB practise), 30 requested slides per lesson as a platform setting, verified SS/SB/WB evidence, unchanged V3 `[BI]`, basic scaffolding, purposeful repetition versus filler, provenance rules, and an outline-review gate. No Teaching or School/Teacher-Specific Intelligence, new thresholds, generation, or `4-decisions.md` change.

**Files touched:**
- `docs/phase-5/d018-lesson-series-be2-u08-experiment-design.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 203

**Summary:** Recorded owner approval of the D018 Lesson Series Experiment 1 prompt after removing the redundant instruction to use SS/BI only as labeled context and the detailed later-Unit-8 exclusion paragraph. Existing evidence, `[BI]`, provenance, scope, scaffolding, lesson allocation, and outline-review safeguards remain. Prompt not run; Lesson Series generation remains separately gated; no `4-decisions.md` change.

**Files touched:**
- `docs/phase-5/d018-lesson-series-be2-u08-experiment-design.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---



### Step 204

**Summary:** Completed sections 5 and 8 of the BE2 U8 HM lesson-input pack from owner/teacher answers. Recorded final selected input `PL-01`, `PL-03`, `PL-19` plus teacher-added `What is it?` / `What are they?` (not PL-22); deselected PL-08 as a school-specific override. Cleared the gate for bounded Arm B2 design; generation remains unauthorized.

**Files touched:**
- `docs/phase-2/experiments/be2-u08-horizontal-map-lesson-input-pack-v0.1.md` (updated)
- `docs/phase-5/d018-v2b-horizontal-map-polarity-cue-comparison-design-v0.1.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---



### Step 205

**Summary:** Drafted bounded Arm B2 comparison design: reuse Arm A; append teacher-selected HM lesson-input pack (PL-01/PL-03/PL-19 + What is it?/What are they?; no PL-08); copy-ready section 7B2; owner design approval and generation remain separate gates.

**Files touched:**
- docs/phase-5/d018-arm-b2-horizontal-map-lesson-input-comparison-design-v0.1.md (created)
- docs/phase-5/d018-v2b-horizontal-map-polarity-cue-comparison-design-v0.1.md (updated)
- docs/phase-2/experiments/be2-u08-horizontal-map-lesson-input-pack-v0.1.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/0-index.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---


### Step 206

**Summary:** Recorded Arm B2 design approval (section 8 checklist) and authorized one Arm B2 generation run only. Reuse Arm A; do not regenerate historical Arm B. Generation not yet executed.

**Files touched:**
- docs/phase-5/d018-arm-b2-horizontal-map-lesson-input-comparison-design-v0.1.md (updated)
- docs/phase-5/d018-v2b-horizontal-map-polarity-cue-comparison-design-v0.1.md (updated)
- docs/phase-2/experiments/be2-u08-horizontal-map-lesson-input-pack-v0.1.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/0-index.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---


### Step 207

**Summary:** Backfilled the project-steps gap and synced stale references after Arm B2 generation was recorded (L1 30 / L2 32 PDF pages; filenames Wild Animals - Arm 7A&7B2v2). No evaluation in this step entry alone â evaluation follows in Step 208.

**Files touched:**
- docs/phase-5/d018-arm-b2-horizontal-map-lesson-input-comparison-design-v0.1.md (updated â section 10 pointer during sync)
- docs/phase-2/experiments/be2-u08-horizontal-map-lesson-input-pack-v0.1.md (updated)
- docs/0-index.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---

### Step 208

**Summary:** Formally evaluated Arm B2 vs Arm A using the seven-criterion rubric and pack-fidelity lenses. Arm B2 preferred (selection fidelity, progressive ID, polarities without PL-08); scores Arm A 4Y/2P/1N vs Arm B2 4Y/3P/0N; neither Pass; further regeneration not authorized. Arm A scores reused from prior comparison; V2b and historical Arm A/B scores unchanged.

**Files touched:**
- docs/phase-5/d018-arm-b2-horizontal-map-lesson-input-comparison-design-v0.1.md (updated)
- docs/phase-2/experiments/be2-u08-horizontal-map-lesson-input-pack-v0.1.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/0-index.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---


### Step 209

**Summary:** Drafted the owner-gated Chalkie transfer-test design for Big English 2 Unit 5 Language in Action pp. 78-79 from verified Phase 1 canonical SB evidence plus restored SS Unit 5 companion. Preserves the Experiment 5/6 handoff pattern (detailed prompt + concise outlines + explicit vocabulary). Status DESIGN DRAFT / not authorized to generate. No Chalkie run; D018 scores unchanged.

**Files touched:**
- docs/phase-5/chalkie-transfer-be2-u05-lia-p78-79-experiment-design-v0.1.md (created)
- docs/0-index.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---


### Step 210

**Summary:** Narrowed the BE2 U5 LiA transfer-test explicit Chalkie vocabulary to the six jobs used on pp. 78-79: actor, doctor, vet, teacher, dancer, singer. Updated the copy-ready prompt and Lesson 1 activate note for consistency. Generation still not authorized.

**Files touched:**
- docs/phase-5/chalkie-transfer-be2-u05-lia-p78-79-experiment-design-v0.1.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---


### Step 211

**Summary:** Recorded Experiment 7 Chalkie transfer-test generation and qualitative review for BE2 U5 Language in Action SB pp. 78-79. Strong transfer success for the provisional handoff pattern; 30/30 PDF pages acceptable; curation notes only (not failures). Further generation not authorized; D018 scores and methodology unlocked status unchanged.

**Files touched:**
- docs/phase-5/chalkie-transfer-be2-u05-lia-p78-79-experiment-design-v0.1.md (updated)
- docs/phase-5/chalkie-outline-context-retention-diagnostic-v0.1.md (updated; tracked)
- docs/0-index.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---


### Step 212

**Summary:** Drafted a concise reusable Chalkie provisional handoff template from Experiments 5-7 (detailed handoff + concise outlines + explicit vocabulary). Status DRAFT / experimental / not a methodology lock; does not authorize generation. No D018 or decisions changes.

**Files touched:**
- docs/phase-5/chalkie-provisional-handoff-template-v0.1.md (created)
- docs/0-index.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---


### Step 213

**Summary:** Completed a read-only retrospective dry run of the provisional Chalkie handoff template against Experiment 7 (BE2 U5 LiA). Recorded field usability marks, genuine gaps, and a bounded revision list; revised the template for demonstrated ambiguities only (title field, scoped-words wording, activation/retrieve, outline-order note, vocab same-set rule, run record). Verdict: usable provisional starting point. No generation authorized; D018/decisions unchanged.

**Files touched:**
- docs/phase-5/chalkie-provisional-handoff-template-be2-u05-lia-retrofill-v0.1.md (created)
- docs/phase-5/chalkie-provisional-handoff-template-v0.1.md (updated)
- docs/0-index.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---

### Step 214

**Summary:** Created a source-only preflight for BE3 Unit 3 Language in Action SB pp. 40â41. Verified Phase 1 canonical + SS evidence; unit title is *Working Hard!* (requested *In My House* is a mismatch). Recorded page inventory, scoped vocab floor, template-readiness gaps, and conditional suitability. No Chalkie prompt, generation, or decisions change.

**Files touched:**
- docs/phase-5/chalkie-transfer-be3-u03-lia-p40-41-preflight-v0.1.md (created)
- docs/0-index.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---

### Step 215

**Summary:** Drafted the owner-gated BE3 Unit 3 *Working Hard!* LiA pp. 40â41 Chalkie transfer-test design from verified preflight evidence (detailed handoff, two concise outlines, scoped vocab, evaluation lenses). Status DESIGN DRAFT / not authorized to generate. No decisions change.

**Files touched:**
- docs/phase-5/chalkie-transfer-be3-u03-lia-p40-41-experiment-design-v0.1.md (created)
- docs/0-index.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---

### Step 216

**Summary:** Recorded Experiment 8 review as PASS / strong qualitative transfer success (31/31). Corrected lesson-split finding as a vocabulary-allocation confound from the duplicated 12-item list. Revised provisional handoff template to require per-lesson vocabulary allocation. Pre-run design history preserved. No D018/decisions change.

**Files touched:**
- docs/phase-5/chalkie-transfer-be3-u03-lia-p40-41-experiment-design-v0.1.md (updated)
- docs/phase-5/chalkie-provisional-handoff-template-v0.1.md (updated)
- docs/phase-5/chalkie-provisional-handoff-template-be2-u05-lia-retrofill-v0.1.md (updated)
- docs/phase-5/chalkie-outline-context-retention-diagnostic-v0.1.md (updated)
- docs/0-index.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---

### Step 217

**Summary:** Drafted Experiment 9 one-page vocab-split run card â repeat Experiment 8 BE3 U3 LiA pp. 40â41 changing only L1 chores / L2 frequency vocabulary allocation. Generation not authorized. Linked from Exp 8 design Â§8.1.

**Files touched:**
- docs/phase-5/chalkie-transfer-be3-u03-lia-p40-41-vocab-split-runcard-v0.1.md (created)
- docs/phase-5/chalkie-transfer-be3-u03-lia-p40-41-experiment-design-v0.1.md (updated)
- docs/0-index.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---

### Step 218

**Summary:** Recorded Experiment 9 review as PASS / vocabulary-split control succeeded (31/31). Confirmed per-lesson vocab chips as provisional-pattern practice (practical evidence vs Exp 8). Strengthened handoff template on provenance, frequency scales, and earlier book work. Pre-run run-card design preserved. No D018/decisions change.

**Files touched:**
- docs/phase-5/chalkie-transfer-be3-u03-lia-p40-41-vocab-split-runcard-v0.1.md (updated)
- docs/phase-5/chalkie-provisional-handoff-template-v0.1.md (updated)
- docs/phase-5/chalkie-outline-context-retention-diagnostic-v0.1.md (updated)
- docs/phase-5/chalkie-transfer-be3-u03-lia-p40-41-experiment-design-v0.1.md (updated)
- docs/0-index.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---

### Step 219

**Summary:** Created Experiments 1â9 evidence synthesis (matrix, supported findings, rejected approaches, provisional workflow, uncertainties, next-phase recommendation). Cross-linked from handoff template and diagnostic. Pause further Chalkie prompt experiments unless a specific question remains. No generation authorized; no decisions change.

**Files touched:**
- docs/phase-5/chalkie-experiments-1-9-evidence-synthesis-v0.1.md (created)
- docs/phase-5/chalkie-provisional-handoff-template-v0.1.md (updated)
- docs/phase-5/chalkie-outline-context-retention-diagnostic-v0.1.md (updated)
- docs/0-index.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---

### Step 220

**Summary:** Source-preflighted first operational Chalkie pilot candidate BE3 Unit 8 *Healthy Living* Grammar SB pp. 136â137. Identity verified; CONDITIONALLY SUITABLE with Track 159 / answer-key / per-lesson vocab conditions. No handoff or generation. Cross-linked from Exp 1â9 synthesis.

**Files touched:**
- docs/phase-5/chalkie-operational-pilot-be3-u08-grammar-p136-137-preflight-v0.1.md (created)
- docs/phase-5/chalkie-experiments-1-9-evidence-synthesis-v0.1.md (updated)
- docs/0-index.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---

### Step 221

**Summary:** Drafted the BE3 U8 Grammar pp. 136â137 operational-pilot handoff design (copy-ready prompt, two concise outlines with early book work, separate L1/L2 model chips, provenance safeguards, review plan). Owner review pending; generation not authorized. No decisions change.

**Files touched:**
- docs/phase-5/chalkie-operational-pilot-be3-u08-grammar-p136-137-handoff-design-v0.1.md (created)
- docs/phase-5/chalkie-operational-pilot-be3-u08-grammar-p136-137-preflight-v0.1.md (updated)
- docs/phase-5/chalkie-experiments-1-9-evidence-synthesis-v0.1.md (updated)
- docs/0-index.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---

### Step 222

**Summary:** Recorded Experiment 10 operational-pilot review as CONDITIONAL FAIL (source-fidelity gate; Act 19 answer contradicted verified *by bike*). Preserved pre-run handoff; strengthened provisional template hard answer-reveal / visual-reconstruction gate. Owner choice pending (curate vs targeted regen design); regeneration not authorized. No D018/decisions change.

**Files touched:**
- docs/phase-5/chalkie-operational-pilot-be3-u08-grammar-p136-137-handoff-design-v0.1.md (updated)
- docs/phase-5/chalkie-provisional-handoff-template-v0.1.md (updated)
- docs/phase-5/chalkie-outline-context-retention-diagnostic-v0.1.md (updated)
- docs/phase-5/chalkie-experiments-1-9-evidence-synthesis-v0.1.md (updated)
- docs/0-index.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---

### Step 223

**Summary:** Recorded Experiment 10 teacher-corrected completion as dual-stage: raw CONDITIONAL FAIL preserved; Stage 2 PASS AFTER TEACHER REVIEW (Act 19 bike wording; exact `experimpent` filename). Closed operational-pilot record; teacher-in-the-loop / must-correct philosophy captured. No regeneration; no decisions change. Next: owner names the next project question.

**Files touched:**
- docs/phase-5/chalkie-operational-pilot-be3-u08-grammar-p136-137-handoff-design-v0.1.md (updated)
- docs/phase-5/chalkie-provisional-handoff-template-v0.1.md (updated)
- docs/phase-5/chalkie-outline-context-retention-diagnostic-v0.1.md (updated)
- docs/phase-5/chalkie-experiments-1-9-evidence-synthesis-v0.1.md (updated)
- docs/0-index.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---

### Step 224

**Summary:** Locked **D020** â Phase 3 Vertical Mapping parked as a later priority (not gated on Phase 2 âuseful/sufficientâ overviews). Documented eventual teacher-facing cross-book prior-learning reuse parallel to horizontal mapping; AI suggests / teacher chooses; exposure â  mastery; BE3 U1 â BE2 U1â9 as non-binding example. Aligned overview, architecture, workflow, index, F005, and trackers. Docs-only; no Phase 3 implementation.

**Files touched:**
- docs/4-decisions.md (updated)
- docs/1-project-overview.md (updated)
- docs/3-architecture.md (updated)
- docs/11-curriculum-mapping-workflow.md (updated)
- docs/0-index.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/7-future.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---

### Step 225

**Summary:** Added docs-only **teacher-choice flow sketch v0.1** â simplest teacher-facing prior-learning selection flow (current lesson â AI 0â5 â teacher decide â lesson-input summary) with BE2 U8 worked example. Linked from Phase 2 experiment status and docs index. No application code, schema, API, or Phase 3 unlock.

**Files touched:**
- docs/phase-2/experiments/teacher-choice-flow-sketch-v0.1.md (created)
- docs/phase-2/phase-2-experiment-status.md (updated)
- docs/0-index.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---

### Step 226

**Summary:** Integrated teacher-choice Step 1 into Chalkie Workspace: replaced the lower Generate/output panel with a calm **Prepare Chalkie prompt** action, and opened a focused overlay (`1 of 4 Â· Current lesson`) with BE2 U8 prototype context. Cancel returns to the workspace; Continue shows a non-generating Step 2 placeholder. No API/schema/data changes.

**Files touched:**
- app/src/features/chalkie/ChalkieWorkspace.tsx (updated)
- app/src/features/chalkie/ChalkieOutputPanel.tsx (updated)
- app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx (created)
- app/src/features/chalkie/teacherChoicePrototypeContent.ts (created)
- docs/phase-5/p5-prototype-chalkie-workspace.md (updated)
- docs/0-index.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---

### Step 227

**Summary:** Refined teacher-choice overlay Step 1 for BE2 U8: page-specific current focus (pp. 128â129 lesson), labelled Preference / Ability language entries, and an inline `can / canât` note under Current language. Left Workspace panel and other UI unchanged.

**Files touched:**
- app/src/features/chalkie/teacherChoicePrototypeContent.ts (updated)
- app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx (updated)
- docs/5-progress.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---

### Step 228

**Summary:** Fixed BE2 U8 teacher-choice prototype matching: runtime `unitNumber` is a string (`"8"`), so strict `=== 8` never matched and the overlay fell back to generic unit theme/language. Detection now normalizes catalog IDs, coerces unit numbers, accepts summary `catalogBookId` as a candidate, and uses the exact book title only as a narrow fallback.

**Files touched:**
- app/src/features/chalkie/teacherChoicePrototypeContent.ts (updated)
- app/src/features/chalkie/ChalkieWorkspace.tsx (updated)
- docs/5-progress.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---

### Step 229

**Summary:** Implemented teacher-choice overlay Step 2 (Prior learning): four AI suggestions with native checkboxes (all start unchecked), optional evidence disclosure, quiet selected count, Back to Step 1 preserving local selection, Continue to Step 3 placeholder with zero selection allowed. No persistence or prompt generation.

**Files touched:**
- app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx (updated)
- app/src/features/chalkie/teacherChoiceSuggestions.ts (created)
- docs/phase-5/p5-prototype-chalkie-workspace.md (updated)
- docs/0-index.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---

### Step 230

**Summary:** Refined teacher-choice overlay shell and Step 2 layout: dialog width `min(80vw, 1440px)`, Step 1 kept in a centred reading column (~736px), Step 2 as a responsive two-by-two suggestion card grid with subtle selected state. Selection behaviour and copy unchanged; Steps 3â4 not built.

**Files touched:**
- app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx (updated)
- docs/5-progress.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---

### Step 231

**Summary:** Implemented teacher-choice overlay Step 3 (Your choices): carries forward Step 2 selections with functional uncheck, local teacher-added unverified language, use-no-prior-learning clear action, quiet footer summary, and Continue to Step 4 placeholder. No persistence or prompt generation.

**Files touched:**
- app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx (updated)
- docs/phase-5/p5-prototype-chalkie-workspace.md (updated)
- docs/0-index.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---

### Step 232

**Summary:** Implemented teacher-choice overlay Step 4 (Lesson inputs): concise review of current lesson requirements, selected prior learning, optional teacher-added language, and use guidance. Primary action is Back to workspace; no prompt generation, copy, or persistence.

**Files touched:**
- app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx (updated)
- docs/phase-5/p5-prototype-chalkie-workspace.md (updated)
- docs/0-index.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---

### Step 233

**Summary:** Added local copy-ready Chalkie prompt preview from Step 4 (deterministic BE2 U8 pp. 128â129 assembly with selected [HM] and teacher-added labels). Corrected Steps 1/4 current language to drop the non-page kangaroo Q&A. Clipboard copy only; no API/Chalkie submit or persistence.

**Files touched:**
- app/src/features/chalkie/buildChalkiePromptPreview.ts (created)
- app/src/features/chalkie/teacherChoicePrototypeContent.ts (updated)
- app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx (updated)
- docs/phase-5/p5-prototype-chalkie-workspace.md (updated)
- docs/0-index.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---

### Step 234

**Summary:** Added Step 4 lesson-shape selection (Single lesson default; Two-lesson series visible but disabled with quiet scope note) and a copyable lesson title for BE2 U8 pp. 128â129. Existing single-lesson prompt preview unchanged; future series requirements documented in code/docs only.

**Files touched:**
- app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx (updated)
- app/src/features/chalkie/buildChalkiePromptPreview.ts (updated)
- docs/phase-5/p5-prototype-chalkie-workspace.md (updated)
- docs/0-index.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---

### Step 235

**Summary:** Enabled the agreed BE2 U8 two-lesson series packaging preview (Lesson 1 SB pp. 128â129 â Lesson 2 WB pp. 104â105): selectable package radio, series title, local series prompt with [SB]/[WB]/[HM]/teacher-added labels, and a wide left-prompt / right Lesson 1â2 rundown layout. Single-lesson route preserved; no API/persistence.

**Files touched:**
- app/src/features/chalkie/buildChalkiePromptPreview.ts (updated)
- app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx (updated)
- docs/phase-5/p5-prototype-chalkie-workspace.md (updated)
- docs/0-index.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---

### Step 236

**Summary:** Added server-side OpenAI generation test path for the teacher-choice overlay: `POST /api/chalkie/generate` (Bearer JWT, Responses API, `OPENAI_API_KEY` + `OPENAI_MODEL`), teacher-triggered **Generate Chalkie lesson draft** after the local prompt preview, copyable unsaved Markdown result. No persistence; local deterministic preview unchanged.

**Files touched:**
- app/package.json (updated)
- app/package-lock.json (updated)
- app/server/openaiConfig.ts (created)
- app/server/handleGenerateChalkieLessonDraftRequest.ts (created)
- app/vite-plugins/generateChalkieLessonDraftPlugin.ts (created)
- app/src/services/chalkieLessonDraftService.ts (created)
- app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx (updated)
- app/vite.config.ts (updated)
- .env.example (updated)
- docs/phase-5/p5-prototype-chalkie-workspace.md (updated)
- docs/0-index.md (updated)
- docs/5-progress.md (updated)
- docs/6-todo.md (updated)
- docs/project-tracking/1-project-status.md (updated)
- docs/project-tracking/0-project-steps.md (updated)

---

### Step 237

**Summary:** Replaced hard-coded Chalkie lesson context with a resolved, data-backed context from selected book/unit and open PDF pages. Added page-scope guard (block out-of-unit / missing page evidence), kept BE2 U8 fixture + two-lesson series only for exact pp. 128â129, and wired the same context through Step 1/4, local prompt preview, and OpenAI request metadata. Dynamic source-context binding and page-scope guard added; horizontal suggestions remain fixture-only for BE2 U8 pp. 128â129.

**Files touched:**
- `app/src/features/chalkie/resolveChalkieLessonContext.ts` (created)
- `app/src/features/chalkie/teacherChoicePrototypeContent.ts` (updated)
- `app/src/features/chalkie/buildChalkiePromptPreview.ts` (updated)
- `app/src/features/chalkie/ChalkieWorkspace.tsx` (updated)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `app/src/features/validation/ValidationPdfPane.tsx` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 238

**Summary:** Top-aligned Prepare Chalkie prompt modals (teacher-choice overlay and scope-guard dialog) so the header and Cancel stay stable across steps instead of bouncing when content height changes.

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `app/src/features/chalkie/ChalkieWorkspace.tsx` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 239

**Summary:** Fixed Chalkie visible-page activity resolution to prefer verified canonical `instruction` when `title` / `activity_title` are absent, raised the visible activity bound to six so BE3 U8 Grammar pp. 136â137 Acts 19â23 resolve as ready, and added focused regression tests. Documented the fallback and regression without claiming Experiment 10 handoff parity.

**Files touched:**
- `app/src/features/chalkie/chalkieEvidence.ts` (updated)
- `app/src/services/validationService.ts` (updated)
- `scripts/tests/resolveChalkieLessonContext.test.ts` (created)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 240

**Summary:** Added the Phase 5 gap audit comparing the generic `/app/chalkie` prompt preview with the Experiment 10 detailed handoff. Mapped required evidence fields, evidence-handling rules, minimum generic package, UI vs automatic split, acceptance cases (BE3 U8 136â137 + BE3 U3 40â41 regression), and the single next coding slice. Docs/trackers only; no code.

**Files touched:**
- `docs/phase-5/chalkie-generic-detailed-handoff-gap-audit-v0.1.md` (created)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 241

**Summary:** Surfaced verified activity-derived words/models, language frames, and a deterministic teaching-focus planning summary on Chalkie Screen 1 and the local prompt preview. Renamed the vocab label to âCurrent words and models,â used honest dedicated-vs-activity empty-state wording, skipped chart answer-key dumps, and left the BE2 U8 fixture route unchanged. No OpenAI, packaging, outlines, or `[HM]` work.

**Files touched:**
- `app/src/features/chalkie/chalkieEvidence.ts` (updated)
- `app/src/features/chalkie/resolveChalkieLessonContext.ts` (updated)
- `app/src/features/chalkie/buildChalkiePromptPreview.ts` (updated)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/resolveChalkieLessonContext.test.ts` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 242

**Summary:** Correction pass for manually reviewed BE3 Unit 8 spreads 128â137: verified lesson topic, intact `|`-separated Q&A exchanges, language `full_text` fallback, Didâ¦? teaching focus without false irregular detection, `matching_and_speaking` phrase models, and words/models bound raised to 24 so `put â put` is retained. Canonical-slice regression tests added; BE2 U8 fixture unchanged.

**Files touched:**
- `app/src/features/chalkie/chalkieEvidence.ts` (updated)
- `app/src/features/chalkie/resolveChalkieLessonContext.ts` (updated)
- `app/src/features/chalkie/buildChalkiePromptPreview.ts` (updated)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/resolveChalkieLessonContext.test.ts` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 243

**Summary:** Corrected verified BE3 Unit 8 language page-placement errors: Activity 8 `Didâ¦?` frames (`lang_08_01`/`02`) moved from Story p.130 to Language in Action p.132; regular/irregular grammar-box rows (`lang_08_03`/`04`) moved from CLIL p.134 to Grammar p.136. Upstream unit_08 batch patched, Storage uploaded as verified, canonical remarged; placement regression tests and preflight note updated. No UI/heuristics/packaging changes.

**Files touched:**
- `scripts/fix_be3sb_u08_language_page_placement.mjs` (created)
- `scripts/tests/resolveChalkieLessonContext.test.ts` (updated)
- `docs/phase-5/chalkie-operational-pilot-be3-u08-grammar-p136-137-preflight-v0.1.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)
- `data/phase1/big_english_3_sb/big_english_3_sb_unit_08.json` (updated, gitignored)
- `data/phase1/big_english_3_sb/canonical/v1.json` (updated, gitignored)

---

### Step 244

**Summary:** Improved deterministic Teaching focus for non-grammar lesson types: vocabulary/song, story/reading, and CLIL lanes now take priority over secondary `Didâ¦?` frames using verified section/component evidence. Grammar and Language in Action focus strings unchanged; Screen 1 and prompt preview continue to share the same derived focus. Regression coverage updated for all five BE3 U8 spreads.

**Files touched:**
- `app/src/features/chalkie/chalkieEvidence.ts` (updated)
- `app/src/types/validation.ts` (updated)
- `scripts/tests/resolveChalkieLessonContext.test.ts` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 245

**Summary:** Added deterministic same-unit earlier-page vocabulary prior-learning for Chalkie Step 2: human-verified target vocab from earlier printed pages in the loaded unit summary is grouped by curriculum-component title into a selectable `[PRIOR]` bundle (e.g. BE3 U8 p.128 â pp.132â133). Screen 1 evidence unchanged; BE2 curated `[HM]` suggestions preserved; selection flows into the local prompt with earlier-page provenance.

**Files touched:**
- `app/src/features/chalkie/deriveSameUnitEarlierVocabularySuggestions.ts` (created)
- `app/src/features/chalkie/resolveChalkieLessonContext.ts` (updated)
- `app/src/features/chalkie/teacherChoiceSuggestions.ts` (updated)
- `app/src/features/chalkie/buildChalkiePromptPreview.ts` (updated)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/resolveChalkieLessonContext.test.ts` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 246

**Summary:** Merged the teacher-choice âYour choices / What do you choose?â step into âWhat might be useful to reuse?â so suggestion cards and custom-language entry share one screen. Flow is now 3 steps; footer shows selected/teacher-added counts; Back preserves session state; prompt preview remains the confirmation point. No evidence/suggestion-rule changes.

**Files touched:**
- `app/src/features/chalkie/teacherChoiceFlow.ts` (created)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/teacherChoiceFlow.test.ts` (created)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 247

**Summary:** Added a deterministic local concise teacher-controlled outline on the final Chalkie handoff, separate from the detailed evidence prompt. Outline follows verified visible-page activities in page/number order, optional `[PRIOR]` retrieval when selected, audio note only for verified audio-dependent activities, and a `[SUPPLEMENTARY]` close; own Copy outline action. No API; detailed prompt unchanged.

**Files touched:**
- `app/src/features/chalkie/buildChalkieConciseOutline.ts` (created)
- `app/src/features/chalkie/chalkieEvidence.ts` (updated)
- `app/src/features/chalkie/resolveChalkieLessonContext.ts` (updated)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/buildChalkieConciseOutline.test.ts` (created)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 248

**Summary:** Added a separate Suggested Chalkie vocabulary handoff section from verified current-page words/models only (deduped, source order), with Copy vocabulary and an honest empty state. PRIOR / HM / teacher-added language are excluded so they do not become automatic Chalkie vocabulary chips. Detailed prompt and concise outline unchanged.

**Files touched:**
- `app/src/features/chalkie/buildSuggestedChalkieVocabulary.ts` (created)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/buildSuggestedChalkieVocabulary.test.ts` (created)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 249

**Summary:** Cosmetic handoff pass: each of the four copyable items (title, detailed prompt, concise outline, suggested vocabulary) is a text box with a compact top-right copy icon (accessible label + copied check feedback). External labelled copy buttons removed on the final preview screen; contents and copy behaviour unchanged.

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 250

**Summary:** Removed the optional OpenAI model-draft section from the visible Chalkie handoff: no draft button, loading/error UI, or client calls to `/api/chalkie/generate`. Final screen is local-only (title, detailed prompt, concise outline, suggested vocabulary) with honest âPrepared locallyâ¦ No AI generation was used.â wording. Server draft endpoint/service left dormant on disk.

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/teacherChoiceFlow.test.ts` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 251

**Summary:** Applied deterministic Chalkie lesson naming: teacher-facing titles (`BE3 SB Unit 08 pp. 132â133 â Healthy Living â Asking About Yesterday`) plus stable tracking refs (`be3-sb-u08-p132-133`). Short focus derived from verified Didâ¦? teaching focus (not page hardcoding); copy action uses the teacher-facing title only; detailed prompt/outline/vocabulary unchanged.

**Files touched:**
- `app/src/features/chalkie/buildChalkieLessonNaming.ts` (created)
- `app/src/features/chalkie/resolveChalkieLessonContext.ts` (updated)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/buildChalkieLessonNaming.test.ts` (created)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 252

**Summary:** Documented the current Chalkie Single Lesson workflow (Topic â Refine â Theme), including the newly observed AI title suggestion, manual vocabulary entry and first-screen `Create outline` control. Added a controlled Experiments 11â12 run card for BE3 U8 LiA pp.132â133: no outline request vs exact local concise-outline replacement, with title and all other settings held fixed. No lesson generated in this documentation step.

**Files touched:**
- `docs/phase-5/chalkie-single-lesson-experiments-11-12-run-card-v0.1.md` (created)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated to V1.1)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 253

**Summary:** Recorded Chalkie Single-Lesson Experiments 11â13 results for BE3 U8 LiA pp.132â133 (31-page exports). Linked from the preserved 11â12 run card; Exp 13 provisional preferred workflow is detailed handoff + appended concise outline without Create outline. Docs only â D018 and 4-decisions untouched; no generation authorized.

**Files touched:**
- `docs/phase-5/chalkie-single-lesson-experiments-11-13-results-v0.1.md` (created)
- `docs/phase-5/chalkie-single-lesson-experiments-11-12-run-card-v0.1.md` (updated â link + run record only)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated to V1.2)
- `docs/phase-5/chalkie-experiments-1-9-evidence-synthesis-v0.1.md` (updated â follow-up note)
- `docs/phase-5/chalkie-provisional-handoff-template-v0.1.md` (updated â related link)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 254

**Summary:** Recorded Chalkie Single-Lesson Experiment 14 (BE3 U8 Content Connection / P.E. pp.134â135, *What Is a Calorie?*): preferred-path non-grammar transfer PASS AFTER LIGHT TEACHER REVIEW. Documented optional Ask Chalkie as post-generation teacher-review aid only. Docs only â D018 and 4-decisions untouched.

**Files touched:**
- `docs/phase-5/chalkie-single-lesson-experiment-14-results-v0.1.md` (created)
- `docs/phase-5/chalkie-single-lesson-experiments-11-13-results-v0.1.md` (updated â cross-link + optional Ask Chalkie step)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated to V1.3)
- `docs/phase-5/chalkie-provisional-handoff-template-v0.1.md` (updated â related link)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 255

**Summary:** Drafted BE3 SB Unit 8 Chalkie production-pilot plan from canonical page evidence: six legitimate two-page spreads mapped; Exp 10/11â13/14 linked; first recommended untested production spread = Vocabulary/Song pp.128â129. No generation authorized; D018 and 4-decisions untouched.

**Files touched:**
- `docs/phase-5/chalkie-be3-u08-production-pilot-plan-v0.1.md` (created)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 256

**Summary:** Attempted BE3 U8 two-lesson SBâWB handoff; stopped after proving no verified canonical/SS pairing for SB pp.128â129 (WB 104â105 exist as content only). Added non-heuristic `resolveVerifiedSbWbCompanion`, kept series unavailable for BE3, documented the gap. No AI/API, no generation, D018/4-decisions untouched.

**Files touched:**
- `app/src/features/chalkie/resolveVerifiedSbWbCompanion.ts` (created)
- `app/src/features/chalkie/resolveChalkieLessonContext.ts` (updated)
- `scripts/tests/resolveVerifiedSbWbCompanion.test.ts` (created)
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` (created)
- `docs/phase-5/chalkie-be3-u08-production-pilot-plan-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 257

**Summary:** Content-reviewed and **ACCEPTED** one curated BE3 U8 SBâWB pairing (SB pp.128â129 â WB pp.104â105) based on shared vocab/Didâ¦?/song-consolidation evidenceânot pagination. Resolver recognises the curated relationship; unmapped spreads stay unpaired; series handoff UI deferred to the next microstep.

**Files touched:**
- `app/src/features/chalkie/verifiedSbWbCompanions.ts` (created)
- `app/src/features/chalkie/resolveVerifiedSbWbCompanion.ts` (updated)
- `app/src/features/chalkie/resolveChalkieLessonContext.ts` (updated)
- `scripts/tests/resolveVerifiedSbWbCompanion.test.ts` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-production-pilot-plan-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 258

**Summary:** Updated teacher-choice Step 2 (Prior learning): heading **Add Prior Skills**; removed âChoose only what helps this lesson.â; replaced separate custom-language section with a first-grid âAdd a prior skillâ card (title / frame / purpose, then selectable); simplified all cards to title + language frame + Purpose (no Caution).

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `app/src/features/chalkie/teacherChoiceFlow.ts` (updated)
- `app/src/features/chalkie/buildChalkiePromptPreview.ts` (updated)
- `scripts/tests/teacherChoiceFlow.test.ts` (updated)
- `scripts/tests/buildChalkieConciseOutline.test.ts` (updated)
- `scripts/tests/buildSuggestedChalkieVocabulary.test.ts` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 259

**Summary:** Set the Chalkie teacher-choice modal footer background to `#8bcfd9` for all overlay screens (shared footer).

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 260

**Summary:** Set the Chalkie teacher-choice modal footer primary buttons (Continue / Generate / Back to workspace) to `#3766a3`.

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 261

**Summary:** Made the Step 2 âAdd a prior skillâ card expandable and collapsed by default so its height matches other skill cards; expanded body temporarily shows âfuture instructions to come hereâ (form inputs deferred).

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/teacherChoiceFlow.test.ts` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 262

**Summary:** Corrected Step 2 layout: âAdd a prior skillâ is its own two-column section above the suggestion grid (left inputs restored; right hard-coded âfuture instructions to come hereâ); Preference and other skill cards stay in the grid below.

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/teacherChoiceFlow.test.ts` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 263

**Summary:** Made the Step 2 âAdd a prior skillâ two-column block collapsed by default (header-height only) and expandable on click; expanded view keeps left inputs + right instructions placeholder above the suggestion cards.

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/teacherChoiceFlow.test.ts` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 264

**Summary:** Prior-skill card titles now include Student Book unit and page range (`Unit 0N pp.NN-KK: Skill name`) for curated BE2 suggestions and same-unit PRIOR bundles, so teachers can check the source pages before selecting.

**Files touched:**
- `app/src/features/chalkie/teacherChoiceSuggestions.ts` (updated)
- `app/src/features/chalkie/deriveSameUnitEarlierVocabularySuggestions.ts` (updated)
- `app/src/features/chalkie/resolveChalkieLessonContext.ts` (updated)
- `app/src/features/chalkie/buildChalkieConciseOutline.ts` (updated)
- `scripts/tests/teacherChoiceFlow.test.ts` (updated)
- `scripts/tests/resolveChalkieLessonContext.test.ts` (updated)
- `scripts/tests/buildChalkieConciseOutline.test.ts` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 265

**Summary:** Reordered prior-skill titles to `Skill name: Unit 0N pp.NN-KK` and bold only the skill name in the Step 2/3 card UI.

**Files touched:**
- `app/src/features/chalkie/teacherChoiceSuggestions.ts` (updated)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `app/src/features/chalkie/buildChalkieConciseOutline.ts` (updated)
- `scripts/tests/teacherChoiceFlow.test.ts` (updated)
- `scripts/tests/resolveChalkieLessonContext.test.ts` (updated)
- `scripts/tests/buildChalkieConciseOutline.test.ts` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 266

**Summary:** Removed Step 2 empty-state copy (âNo prior learning selectedâ, continue-without / use-no-prior-learning prompts); footer selection text shows only when something is selected.

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `app/src/features/chalkie/teacherChoiceFlow.ts` (updated)
- `scripts/tests/teacherChoiceFlow.test.ts` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 267

**Summary:** Set the teacher-choice modal body background to `#8bcfd9` at 50% opacity; header stays white and footer stays solid `#8bcfd9`.

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 268

**Summary:** Raised the teacher-choice modal body background opacity from 50% to 70% (`#8bcfd9` / 70).

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 269

**Summary:** Set the teacher-choice modal body background opacity to 30% (`#8bcfd9` / 30).

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 270

**Summary:** Made Step 2 prior-skill / add-skill cards opaque white (selected: solid indigo-50) so the teal body tint no longer shows through translucent card backgrounds.

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 271

**Summary:** Set the teacher-choice modal body background opacity to 20% (`#8bcfd9` / 20).

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 272

**Summary:** Removed the Step 3 footer line âNo Chalkie prompt has been prepared yet.â

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 273

**Summary:** Removed the Step 3 review-screen âCopy titleâ button next to the lesson title (handoff-screen title copy control kept).

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 274

**Summary:** Added the same copy-icon control to series Lesson 1 and Lesson 2 outline cards on the Chalkie prompt preview, copying each lesson outline as plain text.

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/teacherChoiceFlow.test.ts` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 275

**Summary:** Added a âLesson Outlinesâ header above the series Lesson 1/2 cards so they align vertically with âDetailed Chalkie promptâ on the left.

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/teacherChoiceFlow.test.ts` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 276

**Summary:** Removed the visible `Ref: â¦` stable-lesson-reference line from Step 3 review and Chalkie prompt-preview title sections.

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 277

**Summary:** Removed the prompt-preview footer note âPrepared locally from verified curriculum evidenceâ¦ No AI generation was used.â

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/teacherChoiceFlow.test.ts` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 278

**Summary:** Wrapped Step 3 âCurrent lesson requirementsâ and âSelected prior learningâ content in opaque white cards matching the prior-skill card chrome.

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 279

**Summary:** Moved Step 3 packaging radios into a white card above Current lesson requirements, left-column width only (right side empty).

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `docs/5-progress.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 280

**Summary:** Built the local two-lesson SBâWB Chalkie handoff for the accepted BE3 U8 opener pair only (SB 128â129 â WB 104â105): six copyables from verified evidence, series enabled for that relationship, unmapped spreads and BE2 fixture unchanged.

**Files touched:**
- `app/src/features/chalkie/buildBe3U08OpenerSbWbSeriesHandoff.ts` (created)
- `app/src/features/chalkie/resolveChalkieLessonContext.ts` (updated)
- `app/src/features/chalkie/buildChalkiePromptPreview.ts` (updated)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/buildBe3U08OpenerSbWbSeriesHandoff.test.ts` (created)
- `scripts/tests/resolveVerifiedSbWbCompanion.test.ts` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-production-pilot-plan-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 281

**Summary:** Documented the first successful BE3 U8 SBâWB two-lesson production pilot (SB 128â129 â WB 104â105) as PASS AFTER LIGHT TEACHER REVIEW; recorded one Chalkie-generation short-answer correction; no app/handoff/D018 changes; further generation not authorized.

**Files touched:**
- `docs/phase-5/chalkie-be3-u08-sb-wb-production-pilot-results-v0.1.md` (created)
- `docs/phase-5/chalkie-be3-u08-production-pilot-plan-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` (updated)
- `docs/phase-5/chalkie-provisional-handoff-template-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 282

**Summary:** Content-reviewed candidate BE3 U8 SB pp.130â131 â WB pp.106â107 and **REJECTED** it: WB p.106 matches *An Unhealthy Dinner*, but p.107 is Language in Action. No mapping or code change; opener pair preserved.

**Files touched:**
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-production-pilot-plan-v0.1.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 283

**Summary:** Added BE3 U8 SBâWB component map (logical components, not equal page counts) and **ACCEPTED** asymmetric curated companion SB pp.130â131 â WB p.106 only; series packaging left off; focused resolver/series tests updated so story companion resolves without enabling opener series.

**Files touched:**
- `docs/phase-5/chalkie-be3-u08-sb-wb-component-map-v0.1.md` (created)
- `app/src/features/chalkie/verifiedSbWbCompanions.ts` (updated)
- `app/src/features/chalkie/resolveVerifiedSbWbCompanion.ts` (updated)
- `scripts/tests/resolveVerifiedSbWbCompanion.test.ts` (updated)
- `scripts/tests/buildBe3U08OpenerSbWbSeriesHandoff.test.ts` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-production-pilot-plan-v0.1.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 284

**Summary:** Enabled the asymmetric BE3 U8 story two-lesson series handoff for SB pp.130-131 to WB p.106 only (`be3_sb_wb_rel_u08_story_sb130-131_wb106`), with six local copyables; preserved opener/BE2/unmapped behaviour; WB p.107 kept out of package scope.

**Files touched:**
- `app/src/features/chalkie/buildBe3U08StorySbWbSeriesHandoff.ts` (created)
- `app/src/features/chalkie/resolveChalkieLessonContext.ts` (updated)
- `app/src/features/chalkie/buildChalkiePromptPreview.ts` (updated)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/buildBe3U08StorySbWbSeriesHandoff.test.ts` (created)
- `scripts/tests/buildBe3U08OpenerSbWbSeriesHandoff.test.ts` (updated)
- `scripts/tests/resolveVerifiedSbWbCompanion.test.ts` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-component-map-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-production-pilot-plan-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 285

**Summary:** Recorded BE3 U8 Story SB-to-WB handoff (SB 130-131 to WB p.106 only) as ACCEPTED FOR PROVISIONAL USE — local workflow only; no further Story Chalkie experiments; no Story export or classroom-validation claim.

**Files touched:**
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-component-map-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-production-pilot-plan-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 286

**Summary:** Content-reviewed BE3 U8 Language in Action SB pp.132-133 against WB pp.107-108 and ACCEPTED it as a docs-only curated mapping (`be3_sb_wb_rel_u08_lia_sb132-133_wb107-108`); no handoff, no app code, no Chalkie generation.

**Files touched:**
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-component-map-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-production-pilot-plan-v0.1.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 287

**Summary:** Content-reviewed BE3 U8 Content Connection / P.E. SB pp.134-135 against WB pp.109-110 and ACCEPTED it as a docs-only curated mapping (`be3_sb_wb_rel_u08_clil_pe_sb134-135_wb109-110`); no handoff, no app code, no Chalkie generation.

**Files touched:**
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-component-map-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-production-pilot-plan-v0.1.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 288

**Summary:** Content-reviewed BE3 U8 Grammar SB pp.136-137 against WB pp.111-112 and ACCEPTED it as a docs-only curated mapping (`be3_sb_wb_rel_u08_grammar_sb136-137_wb111-112`); no handoff, no app code, no Chalkie generation.

**Files touched:**
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-component-map-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-production-pilot-plan-v0.1.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 289

**Summary:** Content-reviewed BE3 U8 Culture Connection SB pp.138-139 against WB pp.113-114 and ACCEPTED it as a docs-only curated mapping (`be3_sb_wb_rel_u08_culture_sb138-139_wb113-114`); no handoff, no app code, no Chalkie generation.

**Files touched:**
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-component-map-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-production-pilot-plan-v0.1.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 290

**Summary:** Content-reviewed BE3 U8 Writing SB p.140 against WB p.115 and ACCEPTED it as a docs-only 1-to-1 curated mapping (`be3_sb_wb_rel_u08_writing_sb140_wb115`); packaging note single lesson likely; no handoff, no app code, no Chalkie generation.

**Files touched:**
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-component-map-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-production-pilot-plan-v0.1.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 291

**Summary:** Content-reviewed BE3 U8 Phonics SB p.141 against WB p.116 and ACCEPTED it as a docs-only 1-to-1 curated mapping (`be3_sb_wb_rel_u08_phonics_sb141_wb116`); packaging note single lesson likely; no handoff, no app code, no Chalkie generation.

**Files touched:**
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-component-map-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-production-pilot-plan-v0.1.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 292

**Summary:** Completed final BE3 U8 map checks: Review SB p.143 to WB p.117 ACCEPTED (`be3_sb_wb_rel_u08_review_sb143_wb117`); Values SB p.142 SB-ONLY CONFIRMED (no WB Values page). Unit 8 component-map content review complete; no app wiring.

**Files touched:**
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-component-map-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-production-pilot-plan-v0.1.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 293

**Summary:** Recorded provisional two-lesson-first packaging policy for internal Chalkie generation (docs only): prefer two lessons; SB→WB split when companion verified; honest SB-only two-lesson split when not; 3–4 lessons only by deliberate teacher grouping. No app/handoff/Chalkie/D018/decisions changes; F021/F022 preserved.

**Files touched:**
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-5/chalkie-provisional-handoff-template-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-component-map-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-production-pilot-plan-v0.1.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 294

**Summary:** Added read-only Unit Intelligence accordion to Chalkie Workspace left panel, reusing the Storage-backed Book Intelligence loader for the selected book/unit. Honest empty state when unavailable; does not alter handoff/context. Focused tests + typecheck pass.

**Files touched:**
- `app/src/features/chalkie/chalkieUnitIntelligence.ts` (created)
- `app/src/features/chalkie/ChalkieLeftPanel.tsx` (updated)
- `app/src/features/chalkie/ChalkieWorkspace.tsx` (updated)
- `scripts/tests/chalkieUnitIntelligence.test.ts` (created)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 295

**Summary:** Retired the standalone Book Intelligence preview UI and sidebar item. Legacy `/app/book-intelligence…` routes redirect to Chalkie Workspace (preserving `?unit=` when present). BI JSON/loaders/contract retained for Unit Intelligence. Library/Validation links retargeted to Chalkie.

**Files touched:**
- `app/src/App.tsx` (updated)
- `app/src/components/shared/Sidebar.tsx` (updated)
- `app/src/features/book-intelligence/BookIntelligenceRedirect.tsx` (created)
- `app/src/features/book-intelligence/bookIntelligenceStorageRegistry.ts` (updated)
- `app/src/features/book-intelligence/BookIntelligencePreviewPage.tsx` (deleted)
- `app/src/features/book-intelligence/BookIntelligenceUnitPreview.tsx` (deleted)
- `app/src/features/book-intelligence/resolvePdfInitialPage.ts` (deleted)
- `app/src/features/book-intelligence/syncUnitFromPdfPages.ts` (deleted)
- `app/src/features/book-intelligence/phase1EvidenceLink.ts` (deleted)
- `app/src/features/chalkie/ChalkieWorkspace.tsx` (updated)
- `app/src/features/series-library/SeriesLibrary.tsx` (updated)
- `app/src/features/series-library/SeriesLibraryPage.tsx` (updated)
- `app/src/features/curriculum-library/CurriculumLibraryPage.tsx` (updated)
- `app/src/features/validation/ValidationWorkspace.tsx` (updated)
- `app/src/features/validation/ValidationHeader.tsx` (updated)
- `scripts/tests/chalkieWorkspacePath.test.ts` (created)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-2/book-intelligence-ui-data-contract-v1.md` (updated)
- `docs/phase-2/phase-2-experiment-status.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 296

**Summary:** Locked **D021** Student Book–first lesson preparation: teachers start from SB unit/component; WB attaches only via verified companions; no WB-origin Single Lesson as the standard path; no immediate UI/code authorization. Cross-linked from Chalkie Workspace and Phase 6 workflow docs. F021/F022 preserved.

**Files touched:**
- `docs/4-decisions.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-5/chalkie-be3-u08-production-pilot-plan-v0.1.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 297

**Summary:** Implemented D021 Chalkie Workspace slice: Student Book–only teacher book dropdown with simplified display names; View Workbook / View Student Book toggle for verified companions (mapped pages only; PDF nav locked); SB/WB page summaries; prepare prompt remains SB-anchored. Focused tests + typecheck pass. F021/F022 preserved.

**Files touched:**
- `app/src/features/chalkie/chalkieStudentBookUi.ts` (created)
- `app/src/features/chalkie/ChalkieWorkspace.tsx` (updated)
- `app/src/features/chalkie/ChalkieLeftPanel.tsx` (updated)
- `app/src/features/validation/ValidationHeader.tsx` (updated)
- `app/src/features/validation/ValidationPdfPane.tsx` (updated)
- `scripts/tests/chalkieStudentBookUi.test.ts` (created)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 298

**Summary:** Fixed View Student Book restore after Workbook view: reinstates the frozen SB spread (e.g. pp.128–129), ignores one-page PDF overwrites during restore, remounts the PDF pane so nav lock cannot leak, and restores companion toggle / WB summary / normal PDF controls. Regression test covers the full round trip. F021/F022 preserved.

**Files touched:**
- `app/src/features/chalkie/chalkieStudentBookUi.ts` (updated)
- `app/src/features/chalkie/ChalkieWorkspace.tsx` (updated)
- `app/src/features/validation/ValidationPdfPane.tsx` (updated)
- `scripts/tests/chalkieStudentBookUi.test.ts` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 299

**Summary:** Fixed SB/WB PDF-page binding: viewer targets verified source `pdf_page` (SB printed 128–129 → PDF 126–127; WB printed 104–105 → PDF 104–105), removed remount-to-cover path, and lock WB to exact PDF indices. Regression tests assert rendered PDF identifiers for the known opener mapping. F021/F022 preserved.

**Files touched:**
- `app/src/features/validation/pdfPageMap.ts` (updated)
- `app/src/features/validation/ValidationPdfPane.tsx` (updated)
- `app/src/features/chalkie/chalkieStudentBookUi.ts` (updated)
- `app/src/features/chalkie/ChalkieWorkspace.tsx` (updated)
- `scripts/tests/chalkieStudentBookUi.test.ts` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 300

**Summary:** Fixed ValidationPdfPane render pipeline for companion spreads: resolve exact left/right PDF pages without clamp-collapse; force both mapped pages into the renderer; remount Document on `pdfUrl` change; SB restore force-displays PDF 126–127. Added spread regression tests that fail on second-page End-of-document. F021/F022 preserved.

**Files touched:**
- `app/src/features/validation/pdfRendererSpread.ts` (created)
- `app/src/features/validation/ValidationPdfPane.tsx` (updated)
- `app/src/features/chalkie/ChalkieWorkspace.tsx` (updated)
- `scripts/tests/pdfRendererSpread.test.ts` (created)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 301

**Summary:** Added Teacher Intelligence left-pane IA contract v0.1 (Source Context + Unit Intelligence / Horizontal Mapping / School-Specific Notes / Future Suggestions; handoff boundary vs neutral package and Chalkie adapter; F021/F022 linked). Docs/index/trackers only — no app, schema, D018, or decisions changes. F021/F022 preserved unstaged in `docs/7-future.md`.

**Files touched:**
- `docs/phase-5/teacher-intelligence-left-pane-contract-v0.1.md` (created)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 302

**Summary:** Confirmed Unit Intelligence accordion against the Teacher Intelligence left-pane contract (already in app: Storage BI loader, fields, AI-inferred badge, exact unavailable copy, no handoff mutation). Aligned disclaimer punctuation; marked contract implementation status; updated prototype/index/trackers. No mappings/handoff/D018/decisions changes. F021/F022 preserved.

**Files touched:**
- `app/src/features/chalkie/chalkieUnitIntelligence.ts` (updated)
- `docs/phase-5/teacher-intelligence-left-pane-contract-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 303

**Summary:** Wired BE3 U8 Language in Action companion into curated resolver (SB 132–133 → WB 107–108; relationship `be3_sb_wb_rel_u08_lia_sb132-133_wb107-108`; stable ref `be3-sb-wb-u08-p132-133-wb107-108`). No series handoff / no Chalkie. Opener + story unchanged. Focused resolver tests + typecheck pass. Docs distinguish docs-accepted + resolver-wired. F021/F022 preserved.

**Files touched:**
- `app/src/features/chalkie/verifiedSbWbCompanions.ts` (updated)
- `scripts/tests/resolveVerifiedSbWbCompanion.test.ts` (updated)
- `scripts/tests/buildBe3U08OpenerSbWbSeriesHandoff.test.ts` (updated)
- `scripts/tests/buildBe3U08StorySbWbSeriesHandoff.test.ts` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-component-map-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-production-pilot-plan-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 304

**Summary:** Wired BE3 U8 Content Connection / P.E. companion into curated resolver (SB 134–135 → WB 109–110; relationship `be3_sb_wb_rel_u08_clil_pe_sb134-135_wb109-110`; stable ref `be3-sb-wb-u08-p134-135-wb109-110`). Resolver-wired only — no series handoff / no Chalkie. Opener, story, and LiA unchanged. Focused tests + typecheck. Docs: docs-accepted + resolver-wired. F021/F022 preserved unstaged.

**Files touched:**
- `app/src/features/chalkie/verifiedSbWbCompanions.ts` (updated)
- `scripts/tests/resolveVerifiedSbWbCompanion.test.ts` (updated)
- `scripts/tests/buildBe3U08OpenerSbWbSeriesHandoff.test.ts` (updated)
- `scripts/tests/buildBe3U08StorySbWbSeriesHandoff.test.ts` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-component-map-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-production-pilot-plan-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 305

**Summary:** Wired BE3 U8 Grammar companion into curated resolver (SB 136–137 → WB 111–112; relationship `be3_sb_wb_rel_u08_grammar_sb136-137_wb111-112`; stable ref `be3-sb-wb-u08-p136-137-wb111-112`). Resolver-wired only — no series handoff / no Chalkie. Opener, story, LiA, and CLIL/P.E. unchanged. Focused tests + typecheck. Docs: docs-accepted + resolver-wired. F021/F022 preserved unstaged.

**Files touched:**
- `app/src/features/chalkie/verifiedSbWbCompanions.ts` (updated)
- `scripts/tests/resolveVerifiedSbWbCompanion.test.ts` (updated)
- `scripts/tests/buildBe3U08OpenerSbWbSeriesHandoff.test.ts` (updated)
- `scripts/tests/buildBe3U08StorySbWbSeriesHandoff.test.ts` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-component-map-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-production-pilot-plan-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 306

**Summary:** Wired BE3 U8 Culture Connection companion into curated resolver (SB 138–139 → WB 113–114; relationship `be3_sb_wb_rel_u08_culture_sb138-139_wb113-114`; stable ref `be3-sb-wb-u08-p138-139-wb113-114`). Resolver-wired only — no series handoff / no Chalkie. Prior companions unchanged. Focused tests + typecheck. Docs: docs-accepted + resolver-wired. F021/F022 preserved unstaged.

**Files touched:**
- `app/src/features/chalkie/verifiedSbWbCompanions.ts` (updated)
- `scripts/tests/resolveVerifiedSbWbCompanion.test.ts` (updated)
- `scripts/tests/buildBe3U08OpenerSbWbSeriesHandoff.test.ts` (updated)
- `scripts/tests/buildBe3U08StorySbWbSeriesHandoff.test.ts` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-component-map-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-production-pilot-plan-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 307

**Summary:** Audit confirmed Writing was not in the resolver (Culture was). Wired BE3 U8 Writing companion (SB p.140 → WB p.115; `be3_sb_wb_rel_u08_writing_sb140_wb115`; ref `be3-sb-wb-u08-p140-wb115`). 1→1 resolver-only; no series/Chalkie. Prior companions unchanged. Focused tests + typecheck. Docs: docs-accepted + resolver-wired; 1→1 single lesson likely. F021/F022 preserved unstaged.

**Files touched:**
- `app/src/features/chalkie/verifiedSbWbCompanions.ts` (updated)
- `scripts/tests/resolveVerifiedSbWbCompanion.test.ts` (updated)
- `scripts/tests/buildBe3U08OpenerSbWbSeriesHandoff.test.ts` (updated)
- `scripts/tests/buildBe3U08StorySbWbSeriesHandoff.test.ts` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-component-map-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-production-pilot-plan-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 308

**Summary:** Wired BE3 U8 Phonics companion into curated resolver (SB p.141 → WB p.116; `be3_sb_wb_rel_u08_phonics_sb141_wb116`; ref `be3-sb-wb-u08-p141-wb116`). 1→1 resolver-only; no series/Chalkie. Writing and prior companions unchanged. Focused tests + typecheck. Docs: docs-accepted + resolver-wired; 1→1 single lesson likely. F021/F022 preserved unstaged.

**Files touched:**
- `app/src/features/chalkie/verifiedSbWbCompanions.ts` (updated)
- `scripts/tests/resolveVerifiedSbWbCompanion.test.ts` (updated)
- `scripts/tests/buildBe3U08OpenerSbWbSeriesHandoff.test.ts` (updated)
- `scripts/tests/buildBe3U08StorySbWbSeriesHandoff.test.ts` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-component-map-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-production-pilot-plan-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 309

**Summary:** Wired BE3 U8 Review companion into curated resolver (SB p.143 → WB p.117; `be3_sb_wb_rel_u08_review_sb143_wb117`; ref `be3-sb-wb-u08-p143-wb117`). 1→1 resolver-only; no series/Chalkie. Values p.142 remains SB-only confirmed (no companion / no View Workbook). All prior Unit 8 mappings unchanged. Focused tests + typecheck. Docs updated. F021/F022 preserved unstaged.

**Files touched:**
- `app/src/features/chalkie/verifiedSbWbCompanions.ts` (updated)
- `scripts/tests/resolveVerifiedSbWbCompanion.test.ts` (updated)
- `scripts/tests/buildBe3U08OpenerSbWbSeriesHandoff.test.ts` (updated)
- `scripts/tests/buildBe3U08StorySbWbSeriesHandoff.test.ts` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-sb-wb-component-map-v0.1.md` (updated)
- `docs/phase-5/chalkie-be3-u08-production-pilot-plan-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 310

**Summary:** Fixed Chalkie Workspace companion lookup for one-page components inside a two-page PDF reading spread. Go / page-control active page scopes companion + Prepare (Writing 140, Phonics 141, Values 142 no companion, Review 143); both PDF pages stay visible; true two-page mappings unchanged. Focused tests + typecheck. F021/F022 preserved unstaged.

**Files touched:**
- `app/src/features/chalkie/chalkieStudentBookUi.ts` (updated)
- `app/src/features/chalkie/ChalkieWorkspace.tsx` (updated)
- `app/src/features/validation/ValidationPdfPane.tsx` (updated)
- `scripts/tests/chalkieStudentBookUi.test.ts` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 311

**Summary:** Added the Chalkie Current Activity Selection contract v0.1 as active design only. It places explicit teacher keep/exclude choices over verified current-page activities before optional prior learning, defines strict downstream filtering and evidence boundaries, and records later acceptance cases without implementing UI, schema, resolver, handoff-builder, or canonical-data changes.

**Files touched:**
- `docs/phase-5/chalkie-current-activity-selection-contract-v0.1.md` (created)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 312

**Summary:** Implemented the first bounded Activity Selection slice: an SB-only, active-scope verified activity-card model with stable source-backed IDs, safe previews, deterministic default selection/exclusion state, no-selected status, and a selected-evidence accessor. Added focused exclusion/scope tests; visible UI and current handoff builders remain unchanged.

**Files touched:**
- `app/src/features/chalkie/chalkieActivitySelection.ts` (created)
- `scripts/tests/chalkieActivitySelection.test.ts` (created)
- `docs/phase-5/chalkie-current-activity-selection-contract-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 313

**Summary:** Rendered verified Student Book activity cards on Current Lesson with active-page columns, default-selected checkboxes, session-only exclusions, selection feedback, honest empty states, and Back/Continue persistence. Added focused UI-boundary tests and kept every existing Chalkie handoff artifact unchanged.

**Files touched:**
- `app/src/features/chalkie/ChalkieWorkspace.tsx` (updated)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `app/src/features/chalkie/chalkieActivitySelection.ts` (updated)
- `scripts/tests/chalkieActivitySelection.test.ts` (updated)
- `docs/phase-5/chalkie-current-activity-selection-contract-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 314

**Summary:** Refined Current Lesson into an activity-first Student Book picker: compact lesson context, a wide restrained book-spread surface, a subtle two-page gutter, a centered one-page layout, and denser checkbox-only cards. Preserved session selection and all handoff output, and documented future evidence-shaped asymmetric Workbook layouts without implementing them.

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/chalkieActivitySelection.test.ts` (updated)
- `docs/phase-5/chalkie-current-activity-selection-contract-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 315

**Summary:** Propagated deterministic Student Book activity selection through local Chalkie prompts, concise outlines, suggested vocabulary, activity language/models, selection-sensitive focus, and supported-series Lesson 1. Added strict no-fallback and all-unselected behavior while preserving Workbook Lesson 2, then aligned focused tests and Activity Selection documentation.

**Files touched:**
- `app/src/features/chalkie/chalkieActivitySelection.ts` (updated)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `app/src/features/chalkie/buildChalkiePromptPreview.ts` (updated)
- `app/src/features/chalkie/buildChalkieConciseOutline.ts` (updated)
- `app/src/features/chalkie/buildSuggestedChalkieVocabulary.ts` (updated)
- `app/src/features/chalkie/buildBe3U08OpenerSbWbSeriesHandoff.ts` (updated)
- `app/src/features/chalkie/buildBe3U08StorySbWbSeriesHandoff.ts` (updated)
- `scripts/tests/chalkieActivitySelection.test.ts` (updated)
- `scripts/tests/buildChalkieConciseOutline.test.ts` (updated)
- `scripts/tests/buildSuggestedChalkieVocabulary.test.ts` (updated)
- `scripts/tests/buildBe3U08OpenerSbWbSeriesHandoff.test.ts` (updated)
- `docs/phase-5/chalkie-current-activity-selection-contract-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 316

**Summary:** Added verified Workbook activity cards and separate session-only selection beneath the Student Book spread. Workbook panels now follow the exact resolved companion shape while all existing Chalkie handoff output remains unchanged by Workbook checkbox choices.

**Files touched:**
- `app/src/features/chalkie/chalkieWorkbookActivitySelection.ts` (created)
- `app/src/features/chalkie/ChalkieWorkspace.tsx` (updated)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/chalkieWorkbookActivitySelection.test.ts` (created)
- `docs/phase-5/chalkie-current-activity-selection-contract-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 317

**Summary:** Corrected one-page Activity Selection layouts to preserve a two-panel open-book spread. Scoped even pages stay left, odd pages stay right, and the facing SB/WB panel is a quiet non-selectable placeholder with no evidence or handoff effect.

**Files touched:**
- `app/src/features/chalkie/chalkieActivitySelection.ts` (updated)
- `app/src/features/chalkie/chalkieWorkbookActivitySelection.ts` (updated)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/chalkieActivitySelection.test.ts` (updated)
- `scripts/tests/chalkieWorkbookActivitySelection.test.ts` (updated)
- `docs/phase-5/chalkie-current-activity-selection-contract-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 318

**Summary:** Propagated selected verified Workbook activities into the accepted BE3 opener and Story local handoffs. Partial and zero Workbook selections now prevent fallback leakage while all-selected output, SB selection behavior, companion scope, and packaging remain stable.

**Files touched:**
- `app/src/features/chalkie/chalkieWorkbookActivitySelection.ts` (updated)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `app/src/features/chalkie/buildChalkiePromptPreview.ts` (updated)
- `app/src/features/chalkie/buildBe3U08OpenerSbWbSeriesHandoff.ts` (updated)
- `app/src/features/chalkie/buildBe3U08StorySbWbSeriesHandoff.ts` (updated)
- `scripts/tests/chalkieWorkbookActivitySelection.test.ts` (updated)
- `scripts/tests/buildBe3U08OpenerSbWbSeriesHandoff.test.ts` (updated)
- `scripts/tests/buildBe3U08StorySbWbSeriesHandoff.test.ts` (updated)
- `docs/phase-5/chalkie-current-activity-selection-contract-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 319

**Summary:** Recorded owner manual acceptance of Chalkie Workspace Activity Selection as IMPLEMENTED / MANUALLY ACCEPTED for provisional local handoff curation. Documented open-book layout, selected-only SB/WB propagation, BE3 U8 opener persistence (`4 of 5` / `3 of 4`), and paused further Activity Selection feature work.

**Files touched:**
- `docs/phase-5/chalkie-current-activity-selection-contract-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 320

**Summary:** Added a design-only audit for a future generic two-lesson SB→WB handoff adapter. Compared the accepted BE3 opener and Story builders, proposed a neutral selected-evidence and explicitly targeted prior-support contract, separated Chalkie rendering concerns, and recommended a read-only package-assembler proof as the smallest possible follow-up.

**Files touched:**
- `docs/phase-5/chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md` (created)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 321

**Summary:** Implemented a read-only neutral SB→WB lesson-package assembler for the accepted BE3 Unit 8 Opener and Story pairs only. Added exact-scope selected evidence, conservative page attribution, explicit partial/zero states and boundaries, and lesson-targeted prior support without changing existing Chalkie UI or rendering.

**Files touched:**
- `app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts` (created)
- `scripts/tests/buildNeutralSbWbLessonPackage.test.ts` (created)
- `docs/phase-5/chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 322

**Summary:** Proved test-only Chalkie renderer parity for the accepted BE3 Unit 8 Opener neutral package. All five all-selected artifacts match the bespoke builder exactly, while exclusions, zero-selection, and explicitly targeted prior support remain honest; production UI/output is unchanged.

**Files touched:**
- `app/src/features/chalkie/renderBe3U08OpenerNeutralPackageToChalkieShadow.ts` (created)
- `scripts/tests/renderBe3U08OpenerNeutralPackageToChalkieShadow.test.ts` (created)
- `docs/phase-5/chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 323

**Summary:** Proved test-only Chalkie renderer parity for the accepted asymmetric BE3 Unit 8 Story neutral package. All five all-selected artifacts match exactly for SB pp.130–131 → WB p.106, with no WB p.107 leakage and honest exclusion, zero-selection, and targeted-support behavior; production UI/output is unchanged.

**Files touched:**
- `app/src/features/chalkie/renderBe3U08StoryNeutralPackageToChalkieShadow.ts` (created)
- `scripts/tests/renderBe3U08StoryNeutralPackageToChalkieShadow.test.ts` (created)
- `docs/phase-5/chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 324

**Summary:** Added a small test-only Chalkie dispatcher for the parity-proved Opener and Story neutral packages. Shared parity and selection-safety tests now route through exact relationship dispatch, while unsupported relationships fail with a typed error and no fallback; production UI/output remains unchanged.

**Files touched:**
- `app/src/features/chalkie/renderChalkieFromNeutralPackage.ts` (created)
- `scripts/tests/renderChalkieFromNeutralPackage.test.ts` (created)
- `scripts/tests/renderBe3U08OpenerNeutralPackageToChalkieShadow.test.ts` (updated)
- `scripts/tests/renderBe3U08StoryNeutralPackageToChalkieShadow.test.ts` (updated)
- `docs/phase-5/chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 325

**Summary:** Drafted a docs-only Opener-first production migration plan for the neutral package → shared Chalkie dispatcher path, with parity gates, artifact-only mismatch diagnostics, and bespoke rollback. Status remains not authorized for production wiring; no app code changed.

**Files touched:**
- `docs/phase-5/chalkie-neutral-package-production-migration-plan-v0.1.md` (created)
- `docs/phase-5/chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 326

**Summary:** Implemented the Opener-only guarded neutral-package production canary (default off). Exact five-artifact parity serves neutral output; mismatch or failure serves bespoke with a bounded developer diagnostic; Story and all other relationships remain on bespoke builders.

**Files touched:**
- `app/src/features/chalkie/be3U08OpenerNeutralCanary.ts` (created)
- `app/src/features/chalkie/renderBe3U08OpenerNeutralPackageToChalkieShadow.ts` (updated)
- `app/src/features/chalkie/renderChalkieFromNeutralPackage.ts` (updated)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `app/src/features/chalkie/buildChalkiePromptPreview.ts` (updated)
- `app/src/vite-env.d.ts` (updated)
- `scripts/tests/be3U08OpenerNeutralCanary.test.ts` (created)
- `scripts/tests/renderBe3U08OpenerNeutralPackageToChalkieShadow.test.ts` (updated)
- `scripts/tests/buildBe3U08OpenerSbWbSeriesHandoff.test.ts` (updated)
- `.env.example` (updated)
- `docs/phase-5/chalkie-neutral-package-production-migration-plan-v0.1.md` (updated)
- `docs/phase-5/chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 327

**Summary:** Recorded documentation-only manual acceptance of the BE3 Unit 8 Opener neutral-package canary as `IMPLEMENTED / MANUALLY ACCEPTED — LIMITED OPENER CANARY` for `be3_sb_wb_rel_u08_opener_sb128-129_wb104-105` only. Story remains bespoke; no Chalkie generation or classroom-validation claim; next step is a separate Story canary authorization decision.

**Files touched:**
- `docs/phase-5/chalkie-neutral-package-production-migration-plan-v0.1.md` (updated)
- `docs/phase-5/chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 328

**Summary:** Drafted a docs-only Story neutral-canary proposal for `be3_sb_wb_rel_u08_story_sb130-131_wb106` (SB pp.130–131 → WB p.106 only) as `DRAFT / NOT AUTHORIZED FOR PRODUCTION WIRING`. No app code, flags, or routing changed; Opener Step 327 acceptance preserved.

**Files touched:**
- `docs/phase-5/chalkie-be3-u08-story-neutral-canary-proposal-v0.1.md` (created)
- `docs/phase-5/chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 329

**Summary:** Implemented the Story-only guarded neutral-package production canary (`VITE_CHALKIE_BE3_U08_STORY_NEUTRAL_CANARY`, default off) for `be3_sb_wb_rel_u08_story_sb130-131_wb106` (WB p.106 only). Exact five-artifact parity serves neutral output; mismatch/error serves bespoke with a bounded diagnostic; Opener canary unchanged. Status: `IMPLEMENTED / AWAITING OWNER MANUAL CHECK`.

**Files touched:**
- `app/src/features/chalkie/be3U08StoryNeutralCanary.ts` (created)
- `app/src/features/chalkie/renderBe3U08StoryNeutralPackageToChalkieShadow.ts` (updated)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `app/src/features/chalkie/buildChalkiePromptPreview.ts` (updated)
- `app/src/features/chalkie/renderChalkieFromNeutralPackage.ts` (updated)
- `app/src/vite-env.d.ts` (updated)
- `scripts/tests/be3U08StoryNeutralCanary.test.ts` (created)
- `scripts/tests/be3U08OpenerNeutralCanary.test.ts` (updated)
- `scripts/tests/renderBe3U08StoryNeutralPackageToChalkieShadow.test.ts` (updated)
- `.env.example` (updated)
- `docs/phase-5/chalkie-be3-u08-story-neutral-canary-proposal-v0.1.md` (updated)
- `docs/phase-5/chalkie-neutral-package-production-migration-plan-v0.1.md` (updated)
- `docs/phase-5/chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 330

**Summary:** Recorded documentation-only manual acceptance of the BE3 Unit 8 Story neutral-package canary as `IMPLEMENTED / MANUALLY ACCEPTED — LIMITED STORY CANARY` for `be3_sb_wb_rel_u08_story_sb130-131_wb106` (WB p.106 only; WB p.107 excluded). Opener canary remains independent; no Chalkie generation or classroom-validation claim; further canaries paused.

**Files touched:**
- `docs/phase-5/chalkie-be3-u08-story-neutral-canary-proposal-v0.1.md` (updated)
- `docs/phase-5/chalkie-neutral-package-production-migration-plan-v0.1.md` (updated)
- `docs/phase-5/chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 331

**Summary:** Created a docs-only Prior Learning / Horizontal Mapping design audit separating `[PRIOR]`, `[HM]`, and teacher-added support, with hard exclusion-safety rules and staged slices. Status `DRAFT / DESIGN ONLY — NOT AUTHORIZED FOR IMPLEMENTATION`; no app/UI code; F021/F022 preserved in `7-future.md`.

**Files touched:**
- `docs/phase-5/chalkie-prior-learning-horizontal-mapping-audit-v0.1.md` (created)
- `docs/phase-5/teacher-intelligence-left-pane-contract-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 332

**Summary:** Implemented Prior Learning / Horizontal Mapping Slice 1 only: deterministic read-only same-unit `[PRIOR]` candidate model and builder, with existing Step 2 suggestion cards preserved via adapter. No Slice 2+ UI, `[HM]` retrieval, School Notes, or selection-behaviour change.

**Files touched:**
- `app/src/features/chalkie/priorLearningCandidate.ts` (created)
- `app/src/features/chalkie/buildSameUnitPriorLearningCandidates.ts` (created)
- `app/src/features/chalkie/deriveSameUnitEarlierVocabularySuggestions.ts` (updated)
- `scripts/tests/buildSameUnitPriorLearningCandidates.test.ts` (created)
- `docs/phase-5/chalkie-prior-learning-horizontal-mapping-audit-v0.1.md` (updated)
- `docs/phase-5/teacher-intelligence-left-pane-contract-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 333

**Summary:** Implemented Prior Learning / Horizontal Mapping Slice 2 only: candidate-aware same-unit `[PRIOR]` suggestion surfacing on lesson context and Step 2 cards, with optional teacher selection that never auto-selects. No curated `[HM]`, School Notes, or AI suggestions.

**Files touched:**
- `app/src/features/chalkie/surfaceSameUnitPriorLearningSuggestions.ts` (created)
- `app/src/features/chalkie/resolveChalkieLessonContext.ts` (updated)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/surfaceSameUnitPriorLearningSuggestions.test.ts` (created)
- `scripts/tests/resolveChalkieLessonContext.test.ts` (updated)
- `docs/phase-5/chalkie-prior-learning-horizontal-mapping-audit-v0.1.md` (updated)
- `docs/phase-5/teacher-intelligence-left-pane-contract-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 334

**Summary:** Created a docs-only Unit Learning Spine design record (author-curated core/support roles, BE3 U8 worked example, future `[PRIOR]` categories) with status `DRAFT / DESIGN ONLY — NOT AUTHORIZED FOR IMPLEMENTATION`. No app/UI code; `docs/7-future.md` and `docs/4-decisions.md` untouched.

**Files touched:**
- `docs/phase-5/unit-learning-spine-and-prior-learning-ranking-design-v0.1.md` (created)
- `docs/phase-5/chalkie-prior-learning-horizontal-mapping-audit-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 335

**Summary:** Implemented the smallest safe read-only BE3 Unit 8 Unit Learning Spine data foundation (generic types + curated core/support components + focused tests). No Step 2, ranking, UI, handoff, or canary changes; ranking/UI integration remains not authorized.

**Files touched:**
- `app/src/features/chalkie/unitLearningSpine.ts` (created)
- `app/src/features/chalkie/be3U08UnitLearningSpine.ts` (created)
- `scripts/tests/be3U08UnitLearningSpine.test.ts` (created)
- `docs/phase-5/unit-learning-spine-and-prior-learning-ranking-design-v0.1.md` (updated)
- `docs/phase-5/chalkie-prior-learning-horizontal-mapping-audit-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 336

**Summary:** Added a narrow read-only Unit Learning Spine consumer (`listCoreUnitLearningSpineComponentIds`) that returns BE3 U8 core component IDs in declared order (or empty when no spine). Internal query only — no Step 2, ranking, UI, handoff, package, or canary changes.

**Files touched:**
- `app/src/features/chalkie/listCoreUnitLearningSpineComponentIds.ts` (created)
- `scripts/tests/listCoreUnitLearningSpineComponentIds.test.ts` (created)
- `docs/phase-5/unit-learning-spine-and-prior-learning-ranking-design-v0.1.md` (updated)
- `docs/phase-5/chalkie-prior-learning-horizontal-mapping-audit-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 337

**Summary:** Added read-only Unit Learning Spine metadata enrichment on same-unit `[PRIOR]` candidates (`componentId` / `spineRole` only when printed pages uniquely match a declared spine component). Step 2 cards, order, selection, handoff, packages, and canaries unchanged; ranking/UI not authorized.

**Files touched:**
- `app/src/features/chalkie/attachUnitLearningSpineMetadata.ts` (created)
- `app/src/features/chalkie/priorLearningCandidate.ts` (updated)
- `app/src/features/chalkie/buildSameUnitPriorLearningCandidates.ts` (updated)
- `scripts/tests/attachUnitLearningSpineMetadata.test.ts` (created)
- `docs/phase-5/unit-learning-spine-and-prior-learning-ranking-design-v0.1.md` (updated)
- `docs/phase-5/chalkie-prior-learning-horizontal-mapping-audit-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 338

**Summary:** Added narrow deterministic same-unit `[PRIOR]` ordering by Unit Learning Spine role (core → support → unclassified, stable within role). Cards remain optional and unchecked; no badges, filters, HM, or language/grammar builders.

**Files touched:**
- `app/src/features/chalkie/orderSameUnitPriorLearningCandidatesBySpineRole.ts` (created)
- `app/src/features/chalkie/buildSameUnitPriorLearningCandidates.ts` (updated)
- `app/src/features/chalkie/surfaceSameUnitPriorLearningSuggestions.ts` (updated)
- `scripts/tests/orderSameUnitPriorLearningCandidatesBySpineRole.test.ts` (created)
- `docs/phase-5/unit-learning-spine-and-prior-learning-ranking-design-v0.1.md` (updated)
- `docs/phase-5/chalkie-prior-learning-horizontal-mapping-audit-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 339

**Summary:** Added read-only verified same-unit language/grammar `[PRIOR]` candidate foundation for BE3 Unit 8 (LiA Did…? frames + Grammar regular/irregular patterns). Not wired into Step 2, ordering merge, handoff, packages, or canaries.

**Files touched:**
- `app/src/features/chalkie/buildSameUnitLanguageGrammarPriorLearningCandidates.ts` (created)
- `app/src/features/chalkie/priorLearningCandidate.ts` (updated)
- `scripts/tests/buildSameUnitLanguageGrammarPriorLearningCandidates.test.ts` (created)
- `docs/phase-5/unit-learning-spine-and-prior-learning-ranking-design-v0.1.md` (updated)
- `docs/phase-5/chalkie-prior-learning-horizontal-mapping-audit-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 340

**Summary:** Surfaced verified BE3 Unit 8 Language in Action and Grammar same-unit `[PRIOR]` candidates on Step 2 via assemble + spine-aware ordering. Cards remain optional/unchecked; vocabulary and support cards retained; no badges, HM, School Notes, or AI.

**Files touched:**
- `app/src/features/chalkie/assembleSameUnitPriorLearningCandidates.ts` (created)
- `app/src/features/chalkie/resolveChalkieLessonContext.ts` (updated)
- `app/src/features/chalkie/buildSameUnitPriorLearningCandidates.ts` (updated)
- `app/src/features/chalkie/buildSameUnitLanguageGrammarPriorLearningCandidates.ts` (updated)
- `scripts/tests/assembleSameUnitPriorLearningCandidates.test.ts` (created)
- `scripts/tests/buildSameUnitLanguageGrammarPriorLearningCandidates.test.ts` (updated)
- `docs/phase-5/unit-learning-spine-and-prior-learning-ranking-design-v0.1.md` (updated)
- `docs/phase-5/chalkie-prior-learning-horizontal-mapping-audit-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 341

**Summary:** Added light teacher-facing evidence-kind distinction on same-unit `[PRIOR]` Step 2 cards (`Vocabulary` / `Language in Action` / `Grammar` in provenance text). Selection, ordering, handoff, support cards, and BE2 fixtures unchanged; no badges or filters.

**Files touched:**
- `app/src/features/chalkie/priorLearningCandidate.ts` (updated)
- `app/src/features/chalkie/teacherChoiceSuggestions.ts` (updated)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/priorLearningEvidenceKindDisplay.test.ts` (created)
- `scripts/tests/assembleSameUnitPriorLearningCandidates.test.ts` (updated)
- `scripts/tests/buildSameUnitPriorLearningCandidates.test.ts` (updated)
- `scripts/tests/attachUnitLearningSpineMetadata.test.ts` (updated)
- `docs/phase-5/unit-learning-spine-and-prior-learning-ranking-design-v0.1.md` (updated)
- `docs/phase-5/chalkie-prior-learning-horizontal-mapping-audit-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 342

**Summary:** Implemented Prior Learning Slice 3 curated earlier-unit `[HM]` support (BE2 U8 opener verified bank). Same-unit `[PRIOR]` preserved; cards optional/unchecked; light `[HM]` provenance; PRIOR-then-HM merge with id/frame dedupe; no School Notes or AI.

**Files touched:**
- `app/src/features/chalkie/curatedHorizontalMappingEntries.ts` (created)
- `app/src/features/chalkie/buildCuratedHorizontalMappingCandidates.ts` (created)
- `app/src/features/chalkie/surfaceSameUnitPriorLearningSuggestions.ts` (updated)
- `app/src/features/chalkie/priorLearningCandidate.ts` (updated)
- `app/src/features/chalkie/teacherChoiceSuggestions.ts` (updated)
- `app/src/features/chalkie/resolveChalkieLessonContext.ts` (updated)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/buildCuratedHorizontalMappingCandidates.test.ts` (created)
- `scripts/tests/assembleSameUnitPriorLearningCandidates.test.ts` (updated)
- `scripts/tests/surfaceSameUnitPriorLearningSuggestions.test.ts` (updated)
- `docs/phase-5/chalkie-prior-learning-horizontal-mapping-audit-v0.1.md` (updated)
- `docs/phase-5/unit-learning-spine-and-prior-learning-ranking-design-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 343

**Summary:** Attempted verification-first curated `[HM]` coverage expansion. No second verified target lesson/unit exists in the repo (only BE2 U8 opener). Left product store/builder/UI unchanged; recorded audit §8a coverage gate + inventory tests.

**Files touched:**
- `scripts/tests/curatedHorizontalMappingCoverageInventory.test.ts` (created)
- `docs/phase-5/chalkie-prior-learning-horizontal-mapping-audit-v0.1.md` (updated)
- `docs/phase-5/unit-learning-spine-and-prior-learning-ranking-design-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 345

**Summary:** Strengthened session `[TEACHER-ADDED · UNVERIFIED]` prior-skill path: visible provenance on Step 2/3 cards, no auto-select on add, session-only guidance replacing the placeholder. Distinct from any future School Notes product; `[PRIOR]` / `[HM]` unchanged.

**Files touched:**
- `app/src/features/chalkie/priorLearningCandidate.ts` (updated)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/teacherAddedPriorSkillPath.test.ts` (created)
- `scripts/tests/teacherChoiceFlow.test.ts` (updated)
- `docs/phase-5/chalkie-prior-learning-horizontal-mapping-audit-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-5/unit-learning-spine-and-prior-learning-ranking-design-v0.1.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 346

**Summary:** Defined a verification-ready authoring contract for additional curated `[HM]` target packs (docs + validator + focused gate tests). No second product `[HM]` route, School Notes, or runtime PRIOR/HM/teacher-added behavior changes.

**Files touched:**
- `docs/phase-5/curated-horizontal-mapping-pack-authoring-contract-v0.1.md` (created)
- `app/src/features/chalkie/curatedHorizontalMappingPackAuthoringContract.ts` (created)
- `scripts/tests/curatedHorizontalMappingPackAuthoringContract.test.ts` (created)
- `scripts/tests/curatedHorizontalMappingCoverageInventory.test.ts` (updated)
- `app/src/features/chalkie/curatedHorizontalMappingEntries.ts` (updated)
- `docs/phase-5/chalkie-prior-learning-horizontal-mapping-audit-v0.1.md` (updated)
- `docs/phase-5/unit-learning-spine-and-prior-learning-ranking-design-v0.1.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 348

**Summary:** Reverted premature School Notes preparation only (§8b coverage gate, unlock-pack authoring contract/validator/tests, and related tracker framing). Retained shipped `[PRIOR]` evidence-kind display, curated `[HM]` Slice 3 + authoring contract, and session `[TEACHER-ADDED · UNVERIFIED]` behavior/tests.

**Files touched:**
- `docs/phase-5/school-notes-unlock-pack-authoring-contract-v0.1.md` (deleted)
- `app/src/features/chalkie/schoolNotesUnlockPackAuthoringContract.ts` (deleted)
- `scripts/tests/schoolNotesUnlockPackAuthoringContract.test.ts` (deleted)
- `scripts/tests/schoolNotesSlice4CoverageGate.test.ts` (deleted)
- `docs/phase-5/chalkie-prior-learning-horizontal-mapping-audit-v0.1.md` (updated)
- `docs/phase-5/teacher-intelligence-left-pane-contract-v0.1.md` (updated)
- `docs/phase-5/unit-learning-spine-and-prior-learning-ranking-design-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 349

**Summary:** Enabled generic Student-Book-only two-lesson packaging for every ready SB spread with verified page evidence (stable selected-activity mid-split; no WB companion required). Verified SB->WB series routes unchanged. BE3 U8 pp.132-133 acceptance covered by focused tests.

**Files touched:**
- `app/src/features/chalkie/allocateSbOnlyTwoLessonActivities.ts` (created)
- `app/src/features/chalkie/buildSbOnlyTwoLessonHandoff.ts` (created)
- `app/src/features/chalkie/resolveChalkieLessonContext.ts` (updated)
- `app/src/features/chalkie/buildChalkiePromptPreview.ts` (updated)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/sbOnlyTwoLessonPackaging.test.ts` (created)
- `scripts/tests/buildBe3U08OpenerSbWbSeriesHandoff.test.ts` (updated)
- `scripts/tests/buildBe3U08StorySbWbSeriesHandoff.test.ts` (updated)
- `scripts/tests/resolveVerifiedSbWbCompanion.test.ts` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 350

**Summary:** Added a Prepare detailed lesson plan output beside Prepare Chalkie prompt in the existing teacher-choice flow. The plan reuses the same selected evidence and package shape (single, SB-only two-lesson, or verified SB->WB) as a local copyable document without changing Chalkie handoff behavior.

**Files touched:**
- `app/src/features/chalkie/buildDetailedGeneralLessonPlan.ts` (created)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/buildDetailedGeneralLessonPlan.test.ts` (created)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 351

**Summary:** Fixed Step 1 activity selection so ordinary Student Book-only lessons show one full-width Student Book activities list without an empty facing-page "Not included" panel. Verified SB->WB pair routes keep the two-source layout.

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/chalkieSbOnlyActivityLayout.test.ts` (created)
- `scripts/tests/chalkieActivitySelection.test.ts` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 352

**Summary:** Implemented D022 Neutral Lesson Package + Book Intelligence realignment: locked decision and revised F021/left-pane contracts; added filtered BI planning context into Opener NLP and detailed lesson plans; optional Chalkie BI framing flag (default off); archived unused BI PDF verifier scripts and deferred further BI book expansion.

**Files touched:**
- `docs/4-decisions.md` (updated — D022)
- `docs/7-future.md` (updated — F021/F022)
- `docs/phase-5/teacher-intelligence-left-pane-contract-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-2/book-intelligence-ui-data-contract-v1.md` (updated)
- `docs/0-index.md` (updated)
- `app/src/lib/bookIntelligence/toBiPlanningContext.ts` (created)
- `app/src/lib/bookIntelligence/index.ts` (updated)
- `app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts` (updated)
- `app/src/features/chalkie/buildDetailedGeneralLessonPlan.ts` (updated)
- `app/src/features/chalkie/chalkieBiFraming.ts` (created)
- `app/src/features/chalkie/be3U08OpenerNeutralCanary.ts` (updated)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `app/src/features/chalkie/ChalkieWorkspace.tsx` (updated)
- `app/src/features/chalkie/chalkieUnitIntelligence.ts` (updated)
- `scripts/tests/toBiPlanningContext.test.ts` (created)
- `scripts/tests/chalkieBiFraming.test.ts` (created)
- `scripts/tests/buildNeutralSbWbLessonPackage.test.ts` (updated)
- `scripts/tests/buildDetailedGeneralLessonPlan.test.ts` (updated)
- `scripts/archive/bi-pdf-verifiers/` (created — moved unused BI PDF/e2e verifiers)
- `.env.example` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 353

**Summary:** Split the Create-a-prompt teacher-choice modal into a five-page flow (Student Book → optional Workbook → prior skills → neutral review → choose output). Workbook is skipped and progress renumbered when no verified companion/activity set exists; Chalkie single/two-lesson packaging opens only after choosing Chalkie; generation and fidelity rules unchanged.

**Files touched:**
- `app/src/features/chalkie/teacherChoiceFlow.ts` (updated)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/teacherChoiceFlow.test.ts` (updated)
- `scripts/tests/chalkieActivitySelection.test.ts` (updated)
- `scripts/tests/chalkieWorkbookActivitySelection.test.ts` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/phase-6/chalkie-interface-and-generation-workflow.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 354

**Summary:** Removed redundant Student Book step chrome from the Create-a-prompt modal: the “Select Student Book activities · book · unit” heading, the select-instruction line, and the “local handoff” caption. Kept the in-card “Student Book activities” title and empty-selection warning.

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/chalkieActivitySelection.test.ts` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 355

**Summary:** Locked the Create-a-prompt modal to a fixed shell height matched to the Review lesson package screen (`min(78vh, 52rem)`), so steps no longer grow/shrink with content; body scrolls when needed and the dialog is vertically centered.

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/teacherChoiceFlow.test.ts` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 356

**Summary:** Trimmed Workbook step chrome to match Student Book: removed the Select Workbook heading/instruction, the in-card “Workbook activities” title, and the session handoff caption. Kept the verified-companion line, selection count, and empty-selection warning.

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/chalkieWorkbookActivitySelection.test.ts` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 357

**Summary:** Increased the fixed Create-a-prompt modal height by ~40px (+20px top and bottom) while keeping all steps on the same anchored shell size.

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/teacherChoiceFlow.test.ts` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 358

**Summary:** Increased the fixed Create-a-prompt modal height by another 80px (+40px top and bottom), for +120px total from the original Review-matched shell.

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/teacherChoiceFlow.test.ts` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 359

**Summary:** Reorganized the Chalkie left panel into Curriculum & Intelligence progressive disclosure: Book Content (verified/blue nested accordions for objectives, vocabulary, language, focus, activities, optional WB companion) and Teaching Intelligence (purple Unit Intelligence). No generation/schema/package changes; empty categories hidden; typecheck green.

**Files touched:**
- `app/src/features/chalkie/ChalkieLeftPanel.tsx` (updated)
- `docs/phase-5/teacher-intelligence-left-pane-contract-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 360

**Summary:** Shipped bounded neutral `CurrentLessonContext`: left panel Book Content/Book Intelligence and Create-a-prompt share verified activity card builders; Teaching Intelligence renamed Book Intelligence; selection stays modal-only. Focused tests + typecheck green; F023 parks selection-in-left-panel follow-up.

**Files touched:**
- `app/src/features/chalkie/currentLessonContext.ts` (created)
- `app/src/features/chalkie/ChalkieLeftPanel.tsx` (updated)
- `app/src/features/chalkie/ChalkieWorkspace.tsx` (updated)
- `app/src/features/chalkie/chalkieActivitySelection.ts` (updated)
- `app/src/features/chalkie/chalkieWorkbookActivitySelection.ts` (updated)
- `scripts/tests/currentLessonContext.test.ts` (created)
- `docs/phase-5/teacher-intelligence-left-pane-contract-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/7-future.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 361

**Summary:** Made left-panel Book Activities the authoritative activity-selection surface: workspace-owned SB/WB selection shared with Create-a-prompt review steps, shared `ActivityEvidenceCard`, scope-keyed reset/reconcile. Neutral module relocation remains parked under F023 (no half-neutral move). Focused tests + typecheck green.

**Files touched:**
- `app/src/features/chalkie/ChalkieWorkspace.tsx` (updated)
- `app/src/features/chalkie/ChalkieLeftPanel.tsx` (updated)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `app/src/features/chalkie/teacherChoiceFlow.ts` (updated)
- `app/src/features/chalkie/lessonActivitySelection.ts` (created)
- `app/src/features/chalkie/ActivityEvidenceCard.tsx` (created)
- `app/src/features/chalkie/currentLessonContext.ts` (updated)
- `scripts/tests/lessonActivitySelection.test.ts` (created)
- `scripts/tests/chalkieActivitySelection.test.ts` (updated)
- `scripts/tests/chalkieWorkbookActivitySelection.test.ts` (updated)
- `scripts/tests/teacherChoiceFlow.test.ts` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/7-future.md` (updated)
- `docs/0-index.md` (updated)
- `docs/phase-5/teacher-intelligence-left-pane-contract-v0.1.md` (updated)
- `docs/phase-5/p5-prototype-chalkie-workspace.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 362

**Summary:** Bounded the Create-a-prompt SB/WB activity-review layout into an equal-height open-book shell: page lists scroll independently; modal activity cards share a fixed `11.5rem` height with sticky chrome and scrollable evidence. Left-panel cards stay unbounded. Focused layout tests + typecheck green.

**Files touched:**
- `app/src/features/chalkie/ActivityEvidenceCard.tsx` (updated)
- `app/src/features/chalkie/ActivityReviewBookSpread.tsx` (created)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/activityReviewBookLayout.test.ts` (created)
- `scripts/tests/chalkieActivitySelection.test.ts` (updated)
- `scripts/tests/chalkieWorkbookActivitySelection.test.ts` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 363

**Summary:** Presentation-only: hide the `Type: …` row on modal SB/WB activity-review cards while keeping `activityType` in the model and leaving the left-panel Type display unchanged. Focused tests + typecheck green.

**Files touched:**
- `app/src/features/chalkie/ActivityEvidenceCard.tsx` (updated)
- `scripts/tests/activityReviewBookLayout.test.ts` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 364

**Summary:** Removed the redundant SB/WB review intro headings and copy from Create-a-prompt activity-review steps; dialog title id now sits on the book-spread heading. Focused tests + typecheck green.

**Files touched:**
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `app/src/features/chalkie/ActivityReviewBookSpread.tsx` (updated)
- `scripts/tests/chalkieActivitySelection.test.ts` (updated)
- `scripts/tests/chalkieWorkbookActivitySelection.test.ts` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 365

**Summary:** Implemented the D023 default-off BE3 Unit 8 activity-enrichment POC for the five verified SB pp. 128–129 activities. Added separate immutable summary/guidance sidecars, independent guidance selection with Activity 3 insufficient-evidence protection, and a lesson-specific experimental Neutral Lesson Package projection; canonical evidence, SS companions, database, bulk processing, production routing, and generation adapters remain unchanged. Focused tests, app typecheck, and lint completed.

**Files touched:**
- `.env.example` (updated)
- `app/src/vite-env.d.ts` (updated)
- `app/src/features/chalkie/be3U08ActivityEnrichmentPoc.ts` (created)
- `app/src/features/chalkie/buildBe3U08ActivityEnrichmentPocPackage.ts` (created)
- `app/src/features/chalkie/ActivityEvidenceCard.tsx` (updated)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (updated)
- `scripts/tests/be3U08ActivityEnrichmentPoc.test.ts` (created)
- `docs/4-decisions.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/7-future.md` (updated)
- `docs/0-index.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---
