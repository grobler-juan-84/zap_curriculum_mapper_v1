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

**Summary:** Merged BE2-SB verified unit batches into canonical v1 with book_id normalization (`bep_sb_2` → `big_english_2_sb`); registered `dataset_versions` draft; re-aligned unit batch statuses to verified.

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

**Summary:** Merged RH2A verified unit batches into canonical v1 with book_id normalization (`rh_2a` → `reach_higher_2a`); registered `dataset_versions` draft. All four Storage-backed pilots now have canonical datasets.

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

**Summary:** Triaged BE2-SB dangling `paired_with` targets by adding appendix sticker page records `bep2_p189`–`bep2_p191` (`unit_id` null). Revalidation now PASSED WITH WARNINGS for all four pilots; historical whole-book audit PASS retained.

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

**Summary:** Applied D009 §7.1 safe cosmetic rename batch: `assests`→`assets` with catalog-named local PDFs, `TeacherAiAssistant` file/export, root and phase docs to kebab-case, and live link/Cursor-rule updates. Historical project-steps filenames left unchanged; TS `bookId` mapper cleanup deferred.

**Files touched:**
- `app/src/assests/` → `app/src/assets/` (renamed; gitignored)
- `app/src/features/teacher-assistant/TeacherAiAssistant.tsx` (renamed/updated)
- `app/src/features/book-workspace/BookWorkspace.tsx` (updated)
- `.gitignore` (updated)
- `docs/1-project-overview.md` (renamed)
- `docs/4-decisions.md` (renamed)
- `docs/5-progress.md` (renamed/updated)
- `docs/6-todo.md` (renamed/updated)
- `docs/7-future.md` (renamed/updated)
- `docs/phase-1/*.md` Title_Case → kebab-case (renamed; links updated)
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

**Summary:** Fixed Validation source-PDF pane stuck on “Checking…” by clearing `pdfLoading` in a `finally` when the active request is not cancelled. Aligned `upload_source_pdfs.mjs` with D009 local catalog PDF paths; verified Beehive 1 `source_pdf` row and Storage object are present (no re-upload needed).

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

**Summary:** Documented Cloudflare R2 as the textbook PDF object-storage target (D010): storage architecture doc with Stages A–E, security rules, and refined hybrid-storage docs. No R2 configuration, upload, or app code changes.

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

**Summary:** Added R2 Stage B connectivity-test tooling (`scripts/test_r2_connection.mjs`), gitignored vendor SDK path, and `.env.example` / `.env.local` placeholders. Stage B not marked complete — local R2 secrets were still empty at stop time.

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

**Summary:** Stage C PASS — migrated Beehive 1 source PDF from Supabase to R2 at verified key `beehive/beehive_1_sb/source.pdf` with matching SHA-256; Supabase original preserved. Clarified that `beehive/beehive/…` is not the catalog path. No app or DB changes.

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

**Summary:** Stage D PASS — Validation PDF signing via server `/api/sign-source-pdf` (JWT + catalog bookFileId auth, R2-first dual-read per D011). Provider badge in UI. CORS apply blocked by token (dashboard follow-up). JSON/covers and Supabase PDF originals unchanged.

**Files touched:**
- `app/server/loadServerEnv.ts` (created)
- `app/server/r2Config.ts` (created)
- `app/server/signSourcePdf.ts` (created)
- `app/server/handleSignSourcePdfRequest.ts` (created)
- `app/vite-plugins/signSourcePdfPlugin.ts` (created)
- `app/vite.config.ts` (updated)
- `app/tsconfig.node.json` (updated)
- `app/package.json` / `app/package-lock.json` (updated — AWS SDK)
- `app/src/services/validationService.ts` (updated)
- `app/src/types/validation.ts` (updated)
- `app/src/features/validation/ValidationWorkspace.tsx` (updated)
- `app/src/features/validation/ValidationPdfPane.tsx` (updated)
- `api/sign-source-pdf.ts` (created)
- `scripts/configure_r2_cors.mjs` (created)
- `scripts/smoke_sign_source_pdf.mjs` (created)
- `.env.example` (updated)
- `docs/4-decisions.md` (updated — D011)
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

**Summary:** Stage E PASS — audited catalog/Supabase/R2 source PDFs; migrated the three remaining pilots to R2 with SHA-256 verify (Beehive already present); parked PDF delivery scalability as F013; Supabase originals and dual-read fallback retained. Browser Validation badge check left as manual pending.

**Files touched:**
- `scripts/migrate_source_pdfs_to_r2.mjs` (created)
- `scripts/smoke_sign_source_pdf.mjs` (updated)
- `docs/7-future.md` (updated — F013)
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
- `docs/9-naming-conventions.md` (updated → v1.3)
- `docs/0-index.md` (updated)
- `supabase/README.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 78

**Summary:** Scaffolded remaining Big English unit-batch working folders under `data/phase1/` with 90 empty `{}` placeholders (`*_unit_01.json`–`*_unit_09.json` for WB/SB levels still to extract). Confirmed `data/phase1/` stays gitignored; added tracked `data/README.md` layout notes only.

**Files touched:**
- `data/phase1/big_english_{1_wb,2_wb,3_sb,3_wb,4_sb,4_wb,5_sb,5_wb,6_sb,6_wb}/` (created locally; gitignored)
- `data/phase1/README.md` (created locally; gitignored)
- `data/README.md` (created; tracked layout notes)
- `.gitignore` (updated comment)
- `docs/9-naming-conventions.md` (updated → v1.4)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 79

**Summary:** Locked D012 — textbook source PDFs are R2-only. Removed Validation Supabase Storage fallback; retargeted `upload_source_pdfs.mjs` to R2 PutObject + Postgres `book_files` upsert; left existing Supabase `book-sources` objects unused (delete later = F014). Typecheck and R2 smoke PASS.

**Files touched:**
- `docs/4-decisions.md` (updated — D012)
- `docs/10-storage-architecture.md` (updated → v1.2)
- `docs/2-tech-stack.md` (updated)
- `docs/8-database-architecture.md` (updated)
- `docs/7-future.md` (updated — F014)
- `docs/0-index.md` (updated)
- `supabase/README.md` (updated)
- `app/src/services/validationService.ts` (updated — R2-only PDF)
- `app/src/features/validation/ValidationPdfPane.tsx` (updated comment)
- `scripts/upload_source_pdfs.mjs` (updated — R2 PutObject)
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

**Summary:** Recorded BE1-WB Unit 9 human verification for available PDF content (D013); documented missing printed pages 124–129 as open `missing_source`; parked Validation PDF page-nav mismatch as F015. No curriculum content, schema, or viewer code changes. Book-level HV and Phase 1 remain incomplete.

**Files touched:**
- `data/phase1/big_english_1_wb/big_english_1_wb_unit_09.json` (updated locally + re-uploaded to Storage; gitignored)
- `scripts/mark_be1wb_u09_verified.mjs` (created)
- `docs/4-decisions.md` (updated — D013)
- `docs/7-future.md` (updated — F015)
- `docs/phase-1/dataset-registry.md` (updated — §8E + table)
- `docs/project-tracking/2-internal-brainstorming.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 82

**Summary:** Finalized BE1-WB Phase 1: confirmed Units 1–9 verified, book-level human verification (available PDF content), canonical merge + automated validation PASSED WITH WARNINGS, whole-book audit PASSED. Kept Unit 9 printed pages 124–129 as open `missing_source` (D013). Project-wide Phase 1 remains incomplete (5/18).

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

**Summary:** Confirmed all 12 Big English source PDFs are already present under `app/src/assets/books/big-english/` with D009 filenames (`big_english_{1–6}_{sb|wb}.pdf`); marked the related todo complete.

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
- `docs/phase-1/book-id-alias-map.md` (updated → v1.2)
- `docs/phase-1/dataset-registry.md` (updated)
- `supabase/README.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/1-project-status.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---

### Step 85

**Summary:** Uploaded BE2-WB Units 1–9 batch JSON to Supabase `book-datasets` (all `pending`), set `books.status=extracted`, and recorded extraction alias `big_english_plus_2_wb` for D007 merge normalization. Human Validation left for owner.

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

**Summary:** Recorded BE2-WB book-level human verification after owner confirmed Units 1–9 verified in Validation (PDF via R2). Synced JSON metadata + `books.status=verified`; merge/audit left for follow-up.

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

**Summary:** Completed BE2-WB Phase 1: remumbered colliding Unit 8–9 entity IDs, fixed language slug + dangling page_141 relationship, merged canonical v1, D008 PASSED WITH WARNINGS, whole-book audit PASSED. Project Phase 1 now 6/18.

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

**Summary:** Documented BE2-WB multi-chat Google AI Studio extraction lesson: registry §8F notes, audit root-cause line (mid-book new chats), and prompt caution to carry entity ID counters/slug forms across chats.

**Files touched:**
- `docs/phase-1/dataset-registry.md` (updated)
- `docs/phase-1/audits/BE2-WB_canonical_v1_audit.md` (updated)
- `docs/phase-1/google-ai-studio-prompt.md` (updated)
- `docs/0-index.md` (updated)
- `docs/5-progress.md` (updated)
- `docs/6-todo.md` (updated)
- `docs/project-tracking/0-project-steps.md` (updated)

---


