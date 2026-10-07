# Mock Data Registry

**Status:** ACTIVE (temporary operational registry)  
**Purpose:** Track UI mock / prototype datasets so they remain visible technical debt until replaced by real sources.  
**Rule:** Do not treat these datasets as verified curriculum truth. Phase 1 JSON in Supabase Storage (and local `data/phase1/` working copies) is the curriculum evidence path.

---

## Live (not mock)

| Dataset | Location / source | Used By | Status |
|---|---|---|---|
| Curriculum catalog | Supabase `book_series`, `books`, `book_files` via `curriculumService` | Curriculum Library, Series Library, Validation book picker | **LIVE** |
| Unit-batch JSON | Private Storage `book-datasets` via `validationService` | `/app/validation` left panel | **LIVE** |
| Source PDFs | Private Storage `book-sources` via signed URLs + `react-pdf` | `/app/validation` PDF pane | **LIVE** |
| Cover images | Private Storage `book-assets` signed URLs | Series / book cards | **LIVE** (with path fallbacks) |

---

## Still mock / prototype

| Mock Dataset | Location | Used By | Represents | Future Source | Status |
|---|---|---|---|---|---|
| Beehive 1 interactive page spreads | `app/src/mocks/curriculum/curriculumSeries.ts` (spreads only; attached in `catalogMapper` for `beehive_1_sb`) | Book Workspace / book viewer / lesson intelligence | Hand-built interactive page chrome for a few Beehive 1 spreads | Storage-backed curriculum JSON / derived page model | **MOCK** |
| Teacher AI Responses | `app/src/mocks/ai/aiResponses.ts` | Teacher AI Assistant (`aiAssistantService`) | Deterministic mock quick-action and chat responses | Real model/API later (Gemini preferred) | **MOCK** |

Unused leftover mock series/book content may still exist inside `curriculumSeries.ts`; the app catalog does **not** load series/books from that file.

## Access paths

```text
Catalog UI
  → useCurriculumCatalog / WorkspaceProvider
  → curriculumService → Supabase Postgres (+ signed cover URLs)
  → catalogMapper (presentation helpers + Beehive 1 mock spreads only)

Validation UI
  → validationService → Supabase book_files + Storage download / signed PDF URL

Teacher AI
  → useTeacherAiResponses → aiAssistantService → mocks/ai/*
```

## Cover assets (static fallbacks)

| Asset | Location | Used By |
|---|---|---|
| Beehive cover SVGs | `app/public/images/beehive-1-cover.svg`, `beehive-2-cover.svg` | Fallbacks when Storage cover paths are missing |
