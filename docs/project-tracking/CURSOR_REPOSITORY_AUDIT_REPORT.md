# Curriculum Mapper — Repository Audit Report (Read-Only)

**Status:** COMPLETE (audit only; no cleanup authorized)  
**Date:** 2026-10-29  
**Starting commit:** `f8a86c73f074409e5a366a4881ed4118062a87e2`  
**Branch:** `main`  
**Authority:** D026 + `docs/project-tracking/CURSOR_REPOSITORY_AUDIT.md`  
**Sole audit artifact:** this file  

---

## 1. Executive summary

The repository is a working teacher product (Auth → Catalog → Chalkie Workspace → local deterministic handoffs) with a large surrounding research archive and several intentional experimental pipelines. Health is **good for production Chalkie and canonical Storage integrity**, but **agent/operator orientation is poor** because many ACTIVE docs and Cursor rules still describe earlier priorities (Phase 1 focus, Phase 2 horizontal mapping, `phase-2` branch).

Highest-priority findings:

1. **Multiple parallel lesson-package / summary lineages** coexist: production bespoke BE3 handoffs, flag-gated neutral canaries, hardcoded D023 enrichment POC sidecars, and the D024/D025 NLL pilot (Postgres + library, UI-unwired). NLL does **not** obsolete the others.
2. **Documentation SoT fragmentation and ACTIVE inflation** (~152 markdown docs; index snapshot **137 ACTIVE / 15 PARKED**) steer agents away from the freeze+audit state in `docs/5-progress.md` / D025–D026.
3. **Root `README.md` still says current focus is Phase 1**, contradicting D015 pause and D025/D026.
4. **Dormant OpenAI client/server paths** remain registered (`chalkieGenerateService`, `chalkieLessonDraftService`, Vite plugins) while UI deliberately uses local handoffs only.
5. **Mock `/app/workspace` stack** remains routed and linked from the shell beside production Chalkie, increasing product surface confusion.
6. **~74 Phase 1 / ops scripts** include many completed one-offs; valuable but noisy next to the active upload/merge/validate tooling.

Overall: consolidate **orientation and classification** before deleting code. Preserve canonical data, decisions, experiment evidence, NLL pilot, and production Chalkie paths.

---

## 2. Repository overview

### Application architecture (current)

| Layer | Role | Key locations |
|---|---|---|
| Frontend | Vite + React + TS + Tailwind | `app/` |
| Auth / catalog | Supabase Auth + Postgres catalog | `app/src/features/auth`, `curriculumService`, curriculum/series libraries |
| Teacher product | Chalkie Workspace + Create-a-prompt overlay | `app/src/features/chalkie/*` (`/app/chalkie`) |
| Ops verify | Phase 1 validation + PDF | `app/src/features/validation` (`/app/validation`) |
| Curriculum authority | SS + SB/WB JSON from Supabase Storage; PDFs from R2 | `scope-sequence/*`, `validationService`, `app/server/signSourcePdf.ts` |
| Interpretation overlay | Book Intelligence from Storage | `book-intelligence/*` |
| Additive knowledge pilot | NLL tables + read-only library | `app/src/features/nll/*`, `supabase/migrations/20261029120000_create_nll_pilot.sql` |
| Mock prototype | Older textbook workspace UI | `/app/workspace` → `book-workspace` + `book-viewer` + `lesson-intelligence` + `teacher-assistant` + `mocks/` |

**Live Chalkie load graph (evidence):** `ChalkieWorkspace.tsx` loads catalog via `curriculumService`, canonical SB/WB JSON via `validationService.downloadJson`, SS via `loadScopeSequenceFromStorage`, BI via `loadBookIntelligenceFromStorage`, PDFs via signed R2 proxy. Teacher outputs are assembled locally in `TeacherChoiceFlowOverlay.tsx` (bespoke/canary/SB-only/general plan paths). No UI import of `features/nll/*` was found.

### Major dependencies (`app/package.json`)

| Dependency | Assessment |
|---|---|
| `@supabase/supabase-js` | Keep — auth/catalog/storage |
| `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` | Keep — R2 PDF signing (server) |
| `openai` | Keep for now / Archive later — only dormant lesson-draft path |
| `react-pdf`, `lucide-react`, React/Router/Tailwind | Keep |
| `ajv` (devDependency) | Keep — used by Phase 1 validation scripts via app package |

### Inventory counts (this checkout)

| Item | Count |
|---|---:|
| `docs/**/*.md` | 152 |
| Index lifecycle snapshot ACTIVE / PARKED | 137 / 15 |
| `app/src/features/chalkie` TS files | 52 |
| `scripts/*.mjs` | 74 |
| `scripts/tests/*` | 46 |
| `scripts/archive/*` files | 7 |

---

## 3. Code / features / experiments findings

### Finding C1 — Parallel package and summary lineages (not obsolete by NLL)

| Field | Detail |
|---|---|
| **Location** | `app/src/features/chalkie/buildBe3U08*Handoff.ts`, `buildNeutralSbWbLessonPackage.ts`, `be3U08*NeutralCanary.ts`, `renderChalkieFromNeutralPackage.ts`, `be3U08ActivityEnrichmentPoc.ts`, `buildBe3U08ActivityEnrichmentPocPackage.ts`, `app/src/features/nll/*` |
| **Finding** | Four related but separate lineages: (1) production bespoke handoffs, (2) neutral package + canary/shadow renderers, (3) D023 hardcoded enrichment sidecars/package preview, (4) NLL Postgres summaries + shadow package. |
| **Evidence** | Overlay imports canaries/enrichment; NLL imports only in `scripts/tests/neutralLessonLibraryPilot.test.ts`. Flags default off for canaries/POC/NLL shadow. D026 explicitly rejects treating NLL as proof prior builders are obsolete. |
| **Recommendation** | **Keep** all four until an owner-approved consolidation plan chooses a single summary store and a single render path. |
| **Confidence** | High |
| **Risk** | Deleting enrichment/neutral/bespoke early would regress accepted BE3 U8 teacher outputs or lose experiment parity evidence. |

### Finding C2 — Feature flags: overlapping, two undeclared in `vite-env.d.ts`

| Field | Detail |
|---|---|
| **Location** | `app/src/vite-env.d.ts`; readers in `be3U08OpenerNeutralCanary.ts`, `be3U08StoryNeutralCanary.ts`, `be3U08ActivityEnrichmentPoc.ts`, `chalkieBiFraming.ts`, `buildNllShadowLessonPackage.ts`; examples in `.env.example` |
| **Finding** | Active flags: opener/story neutral canaries, enrichment POC (typed). Also `VITE_CHALKIE_BE3_U08_OPENER_BI_FRAMING` and `VITE_CHALKIE_NLL_SHADOW_PILOT` are read in code but **absent** from `ImportMetaEnv` in `vite-env.d.ts`. All experiment flags default off. |
| **Evidence** | Grep of `VITE_CHALKIE_*` across `app/`; `vite-env.d.ts` lists only three experiment flags. |
| **Recommendation** | **Consolidate** documentation/typing of flags (no behavior change). Do not remove flags. |
| **Confidence** | High |
| **Risk** | Low for typing/docs; High if flags removed while canaries/POC still needed. |

### Finding C3 — Dormant OpenAI / generate API stack still registered

| Field | Detail |
|---|---|
| **Location** | `app/src/services/chalkieGenerateService.ts`, `app/src/services/chalkieLessonDraftService.ts`, `app/vite.config.ts` plugins, `app/server/handleGenerateChalkiePromptRequest.ts`, `handleGenerateChalkieLessonDraftRequest.ts` |
| **Finding** | UI overlay path is local-deterministic; client services have no production importers. Tests assert overlay does not include `chalkieLessonDraftService`. Vite still registers both generate plugins. |
| **Evidence** | Repo-wide import grep; `teacherChoiceFlow.test.ts` / handoff tests assert absence; `vite.config.ts` lines registering plugins. |
| **Recommendation** | **Archive** after owner confirms no external tooling calls `/api/generate-chalkie-prompt` or `/api/chalkie/generate`. Keep R2 `signSourcePdfPlugin`. |
| **Confidence** | High (UI-unused); Medium (no runtime telemetry for external callers) |
| **Risk** | Low–Medium if someone still hits the APIs during local demos. |

### Finding C4 — Mock `/app/workspace` stack vs production Chalkie

| Field | Detail |
|---|---|
| **Location** | `App.tsx` route `workspace`; `book-workspace`, `book-viewer`, `lesson-intelligence`, `teacher-assistant`, `mocks/*`; `Sidebar.tsx` links; curriculum/series pages navigate to workspace |
| **Finding** | Older mock textbook + AI assistant UI remains a first-class route beside `/app/chalkie`. |
| **Evidence** | Route table in `App.tsx`; `BookWorkspace.tsx` imports `TeacherAiAssistant`; sidebar nav entries. |
| **Recommendation** | **Consolidate** product navigation (owner decision): keep as prototype demo, or demote/hide, or archive. Do not delete until product intent is explicit. |
| **Confidence** | High (exists and linked); Medium (usage frequency unknown) |
| **Risk** | Medium — removing without replacement breaks demos and nav expectations. |

### Finding C5 — Thin helpers used only by tests

| Field | Detail |
|---|---|
| **Location** | `listCoreUnitLearningSpineComponentIds.ts`, `deriveSameUnitEarlierVocabularySuggestions.ts` |
| **Finding** | App runtime does not import these; dedicated tests do. |
| **Evidence** | Import grep limited to `scripts/tests/*`. |
| **Recommendation** | **Requires investigation** before Delete; likely **Archive** or fold into used prior-learning modules. |
| **Confidence** | High for “not UI-imported”; Medium for “safe to remove” |
| **Risk** | Low if tests retained/moved; avoid silent deletion. |

### Finding C6 — Phase 1 / book-ops script sprawl

| Field | Detail |
|---|---|
| **Location** | `scripts/*.mjs` (~74), vs `scripts/archive/` (~7), vs `scripts/tests/` (~46) |
| **Finding** | Many completed one-offs (`apply_be*_seed`, `fix_*`, `normalize_*`, `finalize_*`, `renumber_*`, `inspect_*`) sit beside enduring tools (`merge_canonical_book.mjs`, `validate_phase1_json.mjs`, upload/R2 scripts). |
| **Evidence** | Filename families + `scripts/archive/bi-pdf-verifiers` precedent for archival. |
| **Recommendation** | **Archive** completed one-offs under `scripts/archive/…` after owner review; **Keep** merge/validate/upload/R2/smoke tools; **Consolidate** clones only if Phase 1 resumes. |
| **Confidence** | Medium (completion state inferred from naming/history, not per-script run logs) |
| **Risk** | Medium — mistaking an still-needed seed/fix script for dead code. |

### Finding C7 — Operational paths that must be preserved

| Path | Evidence | Recommendation |
|---|---|---|
| Auth + protected `/app` | `AuthProvider`, `ProtectedRoute`, `App.tsx` | **Keep** |
| Catalog / series / covers | `curriculumService`, library pages | **Keep** |
| Chalkie production selection + handoffs | `ChalkieWorkspace`, overlay, bespoke BE3 handoffs, companions, prior-learning | **Keep** |
| Validation + R2 PDF | `ValidationPage`, `signSourcePdfPlugin` | **Keep** |
| SS runtime BE3–6 | `scope-sequence/*` wired in Chalkie | **Keep** |
| BI loaders | `book-intelligence/*` | **Keep** |
| NLL pilot schema + library + tests | migration + `features/nll` + pilot test | **Keep** (experimental, not UI) |
| Verified companion bank | `verifiedSbWbCompanions.ts` | **Keep** |

---

## 4. Documentation / instructions findings

### Finding D1 — Competing sources of truth

| Field | Detail |
|---|---|
| **Location** | `docs/4-decisions.md`–`7-future.md` (canonical ops); `docs/project-tracking/1-project-status.md`; `docs/project-tracking/3-project-decisions.md`; `docs/phase-2/phase-2-experiment-status.md`; Phase 5/6 Chalkie ops docs |
| **Finding** | D004 locks root trackers as AI operating layer, but legacy pointers and ACTIVE phase “status” docs still publish next-steps and branch claims. |
| **Evidence** | `phase-2-experiment-status.md` still lists Git branch `phase-2` and “Next proposed step” BI hardening (dated 2026-10-19). Working tree is on `main` at NLL completion commit. Legacy decisions pointer historically lagged (pre-existing handover edits may be updating this; treated as pre-existing). |
| **Recommendation** | **Consolidate**: thin stubs for legacy pointers; freeze banners on phase status inventories; keep root `4–7` as sole ops SoT. |
| **Confidence** | High |
| **Risk** | Low if history preserved; High if phase inventories deleted. |

### Finding D2 — Ops drift: README / architecture vs freeze

| Field | Detail |
|---|---|
| **Location** | `README.md` L3; `docs/1-project-overview.md`; `docs/3-architecture.md`; `docs/11-curriculum-mapping-workflow.md`; `.cursor/rules/project_status_rule.mdc` priority sentence |
| **Finding** | Root README: “Current focus: **Phase 1**…”. Architecture/overview still emphasize immediate horizontal mapping. Cursor status rule still frames priorities around bounded Phase 2 / D015. Live ops (`5-progress`, D025/D026) say NLL complete + feature freeze + audit. |
| **Evidence** | Direct file reads/greps vs `docs/4-decisions.md` D025/D026 and `docs/5-progress.md`. |
| **Recommendation** | **Consolidate** orientation text (banner or rewrite focus lines). Do not rewrite approved experiment baselines. |
| **Confidence** | High |
| **Risk** | Low for README/banners; Medium if conceptual architecture content is deleted rather than labeled. |

### Finding D3 — Database architecture omits NLL

| Field | Detail |
|---|---|
| **Location** | `docs/8-database-architecture.md` (no `nll_` mentions); contrast `docs/project-tracking/nll-pilot-architecture-v0.1.md`, `supabase/README.md` |
| **Finding** | Hybrid DB doc does not describe the four NLL tables now present in the live project. |
| **Evidence** | Grep of `8-database-architecture.md` for `nll_` / Neutral Lesson: no matches. |
| **Recommendation** | **Consolidate**: add NLL section or explicit pointer to pilot architecture doc. |
| **Confidence** | High |
| **Risk** | Low |

### Finding D4 — ACTIVE inflation and missing index row

| Field | Detail |
|---|---|
| **Location** | `docs/0-index.md` lifecycle snapshot; `docs/phase-2/experiments/*`; `docs/phase-1/audits/*`; `docs/phase-5/d018-*` and transfer docs; orphan `docs/project-tracking/ss-canonical-v1-runtime-integration-audit-2026-10-28.md` |
| **Finding** | ~90% of docs labeled ACTIVE. Experiment/audit corpora share lifecycle with operating trackers. SS runtime audit file exists on disk but was not listed in the index at audit time. |
| **Evidence** | 152 md files; index ACTIVE=137; `Test-Path` true for SS audit; index search did not show a dedicated row for that file in the project-tracking section used during audit. |
| **Recommendation** | **Archive** (lifecycle/PARKED/HISTORICAL) experiment kits and audits for agent orientation; **Keep** content. Fix index orphan in a later docs-only batch. |
| **Confidence** | High for inflation; Medium for exact orphan status if pre-existing handover already patches index (treat handover edits as pre-existing). |
| **Risk** | High if experiment trees are deleted instead of relabeled. |

### Finding D5 — Cursor rule / user-rule commit conflict

| Field | Detail |
|---|---|
| **Location** | `.cursor/rules/github_commit_workflow.mdc` (auto-commit every file-changing prompt; never push); user rule “commit only when asked”; D026 forbids commit during this audit |
| **Finding** | Agents receive contradictory commit instructions. |
| **Evidence** | Rule files vs user rules vs D026 text. |
| **Recommendation** | **Consolidate** policy: owner-explicit commits win; auto-commit rule should defer to user/D0xx overrides. |
| **Confidence** | High |
| **Risk** | High — unwanted commits or skipped required commits. |

### Finding D6 — `6-todo.md` size and dual “Now” pressure

| Field | Detail |
|---|---|
| **Location** | `docs/6-todo.md` |
| **Finding** | Long completed checklist mixed with open items makes “what now?” hard under freeze. |
| **Evidence** | File length and many `[x]` items observed during audit of near-term section. |
| **Recommendation** | **Consolidate**: short Now + move Done history to steps/progress. |
| **Confidence** | High |
| **Risk** | Low |

---

## 5. Architecture / dependencies findings

### Finding A1 — Storage-backed foundation is sound

| Field | Detail |
|---|---|
| **Location** | `validationService.ts`, `loadScopeSequenceFromStorage.ts`, `scopeSequenceStorageRegistry.ts`, `loadBookIntelligenceFromStorage.ts`, R2 signing server |
| **Finding** | Canonical SS/SB/WB are not hardcoded app bundles; SB/WB via `book_files` + Storage download; SS/BI via Storage registries with hash pins for selected books; PDFs via R2. |
| **Evidence** | Loader implementations and ChalkieWorkspace wiring. Local BE3 WB working copy absence is an environment limitation only. |
| **Recommendation** | **Keep**. Do not “simplify” by inlining curriculum JSON into the app. |
| **Confidence** | High |
| **Risk** | Critical if Storage/R2 paths are broken. |

### Finding A2 — `TeacherChoiceFlowOverlay` is the coupling hotspot

| Field | Detail |
|---|---|
| **Location** | `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (+ `buildChalkiePromptPreview.ts`) |
| **Finding** | Mega-router for companion detection, canaries, enrichment POC display, BI framing, SB-only packaging, outlines, vocab, detailed plans. Dual construction of string preview vs structured series handoffs risks drift. |
| **Evidence** | Import graph of overlay; canary wrappers calling both bespoke and neutral builders. |
| **Recommendation** | **Consolidate** only after owner picks the winning render path; not a quick delete. |
| **Confidence** | High |
| **Risk** | High — regressions in teacher Create-a-prompt. |

### Finding A3 — Competing activity-summary stores

| Field | Detail |
|---|---|
| **Location** | Hardcoded sidecars in `be3U08ActivityEnrichmentPoc.ts`; NLL `nll_activity_summaries` (DB); neutral package fields |
| **Finding** | Same conceptual object (teacher-friendly activity summary) exists in multiple stores with different lifecycles. |
| **Evidence** | POC constants vs migration seed vs neutral package types; NLL not wired to overlay. |
| **Recommendation** | **Consolidate** toward NLL (or explicitly Archive POC) only after product decision; until then **Keep** both. |
| **Confidence** | High |
| **Risk** | Medium–High if POC removed before NLL UI exists. |

### Finding A4 — Duplicate `buildCanonicalUnitNav`

| Field | Detail |
|---|---|
| **Location** | `ChalkieWorkspace.tsx` and `ValidationWorkspace.tsx` |
| **Finding** | Same unit-nav helper logic appears in two workspaces. |
| **Evidence** | Architecture explore comparison of both files. |
| **Recommendation** | **Consolidate** into shared util when convenient. |
| **Confidence** | Medium–High |
| **Risk** | Low |

### Finding A5 — SS/BI registry pattern vs `book_files`

| Field | Detail |
|---|---|
| **Location** | `scopeSequenceStorageRegistry.ts`, `bookIntelligenceStorageRegistry.ts` vs Postgres `book_files` for canonical JSON |
| **Finding** | Two registration styles for Storage artifacts (pinned registries vs catalog rows). |
| **Evidence** | Loaders differ by artifact type. |
| **Recommendation** | **Keep** for now; **Consolidate** later only with a migration plan. Not a quick win. |
| **Confidence** | Medium |
| **Risk** | Medium — breaking hash-pinned SS authority. |

---

## 6. Cleanup priorities

### Quick wins (docs/orientation only; still require owner approval)

1. Fix root `README.md` current-focus line to match `5-progress.md` / D025–D026.
2. Add freeze/ops banners to `3-architecture.md`, `1-project-overview.md`, and `phase-2-experiment-status.md`.
3. Point `8-database-architecture.md` at NLL pilot tables/doc.
4. Declare missing flag types in `vite-env.d.ts` (typing only).
5. Resolve Cursor auto-commit rule vs user/D026 commit policy in writing.
6. Index the SS runtime audit orphan (docs-only).

### Consolidation (bounded later batches)

1. Classify docs lifecycle: Authority / Ops / History (see §7).
2. Trim `6-todo.md` Now vs Done.
3. Product decision on `/app/workspace` mock stack vs Chalkie-only nav.
4. Choose one activity-summary store (POC sidecars → NLL) without deleting bespoke handoffs.
5. After neutral canary acceptance, consolidate toward one Chalkie render path.
6. Archive Phase 1 one-off scripts under `scripts/archive/…`.
7. Archive or remove dormant generate client services **after** confirming APIs unused.

### High-risk (do not do without explicit owner + regression plan)

1. Deleting bespoke BE3 opener/story handoffs or verified companions.
2. Deleting enrichment POC while teachers still use the flag.
3. Deleting NLL migration/seed/library because “UI unused.”
4. Changing canonical SS/SB/WB Storage objects or hash pins.
5. Broad deletion of Phase 2/5 experiment documentation.
6. Refactors inside `TeacherChoiceFlowOverlay` without parity tests.

### Preserve

- Canonical SS/SB/WB + R2 PDFs + hash verification practices  
- D001–D026 decision log and `0-project-steps.md`  
- Production Chalkie selection + local handoff path  
- Neutral canary/parity stack (default-off)  
- NLL pilot (1/9/9/2) and architecture/completion records  
- Phase 1 audits and D017/D018 experiment evidence (as history)  
- Validation workspace and catalog flows  

---

## 7. Documentation simplification proposal

Proposed **agent-facing spine** (history retained, not deleted):

```text
AUTHORITY (every session)
  docs/4-decisions.md
  docs/5-progress.md
  docs/6-todo.md          # short Now only
  docs/7-future.md

ARCHITECTURE (when changing system shape)
  docs/3-architecture.md              # + ops-priority banner
  docs/8-database-architecture.md     # + NLL section/pointer
  docs/10-storage-architecture.md
  docs/9-naming-conventions.md
  docs/project-tracking/nll-pilot-architecture-v0.1.md  # until folded into 8-

PRODUCT / TEACHER PATH
  docs/phase-6/chalkie-interface-and-generation-workflow.md   # pick as primary ops
  docs/phase-5/p5-prototype-chalkie-workspace.md              # satellite UI log
  phase-5 contracts (activity selection, left pane, HM) as needed

HISTORY (not Next)
  docs/project-tracking/0-project-steps.md
  docs/phase-1/audits/*
  docs/phase-2/experiments/*
  docs/phase-5/d018-* and transfer experiments
  PARKED phase-3 / superseded briefs
```

`docs/0-index.md` should remain a catalog but distinguish **Authority / Ops / History** rather than labeling ~137 docs ACTIVE as if all were current work.

---

## 8. Reversible cleanup sequence

No cleanup is authorized by this audit. Suggested future batches (owner-gated):

### Batch 0 — Orientation only
- README focus line; architecture/status banners; NLL pointer in DB arch; flag typing; commit-policy note; index orphan.
- **Regression:** none beyond docs review; `git diff` review.

### Batch 1 — Docs lifecycle relabel (no deletes)
- Demote experiment/audit docs to PARKED/HISTORICAL; thin legacy pointers; trim todo Done.
- **Regression:** confirm `0-index` counts; agents still find decisions/progress.

### Batch 2 — Script archive
- Move completed Phase 1 one-offs to `scripts/archive/…`; leave merge/validate/upload/R2.
- **Regression:** dry-run list of archived names; ensure README script map updated.

### Batch 3 — Dormant generate clients
- Remove or archive unused client services; optionally unregister Vite plugins if APIs unused.
- **Regression:** start Vite; confirm `/api/source-pdf-content` still works; Chalkie overlay still builds handoffs; tests asserting no draft-service wiring still pass.

### Batch 4 — Product surface (`/app/workspace`)
- Hide, redirect, or archive mock workspace only after product decision.
- **Regression:** nav smoke; curriculum/series entry points; Chalkie path untouched.

### Batch 5 — Summary/render consolidation (largest)
- Migrate enrichment POC → NLL or Archive POC; then consider neutral renderer promotion.
- **Regression:** focused NLL tests; enrichment POC tests; opener/story handoff + canary parity suites; manual BE3 U8 Create-a-prompt check.

Each batch should be a separate PR/commit with easy revert. **Audit first; delete second.**

---

## 9. Owner decisions required

1. Is `/app/workspace` still a product surface, a demo, or disposable?
2. Should D023 enrichment POC remain the teacher-facing summary experiment until NLL is UI-wired, or is NLL the only future summary store?
3. When (if ever) should neutral canaries become the default over bespoke BE3 handoffs?
4. May completed Phase 1 one-off scripts be archived (not deleted) now?
5. Confirm no external/local tooling depends on `/api/chalkie/generate` or `/api/generate-chalkie-prompt` before archiving those paths.
6. Should Cursor’s auto-commit rule be formally subordinated to “commit only when asked” / decision overrides?
7. Which single Chalkie ops doc is primary: Phase 6 workflow or Phase 5 prototype workspace log?

---

## 10. Audit limitations

- **Read-only checkout:** no runtime telemetry, production logs, or teacher analytics.
- **Local BE3 WB canonical working copy missing** on this PC; remote Storage hash path verified in prior NLL work, not re-downloaded as a full curriculum audit here.
- **Script “completed” status** inferred from naming patterns and archive precedents, not by re-running each script.
- **Pre-existing dirty tree** at audit start: modified docs trackers + untracked `CURSOR_REPOSITORY_AUDIT.md` (handover). Treated as pre-existing; not part of audit changes.
- **No dependency vulnerability scan** or bundle-size analysis performed.
- **No Supabase schema dump** beyond known NLL migration/README; catalog tables assumed stable from existing docs/code.
- **Import-graph confidence** is static (grep/read); dynamic `import()` edges are unlikely but not exhaustively proven absent.
- ChatGPT Desktop second-pass challenge is expected before any cleanup approval (D026).

---

## Diagnostics run

- `git rev-parse HEAD` → `f8a86c73f074409e5a366a4881ed4118062a87e2`
- `git status --short` (pre-existing handover changes observed; not modified by audit)
- Directory/file counts for `docs`, `scripts`, `scripts/tests`, `scripts/archive`, `features/chalkie`
- Repository greps for `VITE_CHALKIE_*`, package builders, NLL imports, dormant services
- Reads of `README.md`, `App.tsx`, `vite.config.ts`, `vite-env.d.ts`, `phase-2-experiment-status.md`, `4-decisions.md` (D025/D026), `8-database-architecture.md`
- Parallel read-only exploration of code, docs/rules, and architecture coupling

---

## Change boundary confirmation

- **Created:** `docs/project-tracking/CURSOR_REPOSITORY_AUDIT_REPORT.md` only (this file).  
- **Not done:** cleanup, refactor, delete/move/rename, dependency changes, DB/Storage/canonical edits, feature work, commit, push, deploy, operating-tracker/index updates.
