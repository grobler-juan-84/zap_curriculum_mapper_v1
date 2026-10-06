# Mock Data Registry

**Status:** ACTIVE (temporary operational registry)  
**Purpose:** Track UI mock datasets so they remain visible technical debt until replaced by real sources.  
**Rule:** Do not treat these datasets as verified curriculum truth. Phase 1 JSON under `data/` is untouched.

| Mock Dataset | Location | Used By | Represents | Future Source | Status |
|---|---|---|---|---|---|
| Curriculum Series Catalog | `app/src/mocks/curriculum/curriculumSeries.ts` | Curriculum Library, Series Library, Book Workspace (via `curriculumService`) | Prototype publisher series, books, and page spreads (Beehive / Big English / Reach Higher mock) | Canonical curriculum JSON / later Supabase catalog | MOCK |
| Teacher AI Responses | `app/src/mocks/ai/aiResponses.ts` | Teacher AI Assistant (via `aiAssistantService`) | Deterministic mock quick-action and chat responses for the current spread | Real model/API later | MOCK |

## Access path

```text
UI components
  → feature hooks (`useCurriculumCatalog`, `useTeacherAiResponses`) / WorkspaceProvider
  → services (`curriculumService`, `aiAssistantService`)
  → mocks/*
```

## Cover assets (static, not datasets)

| Asset | Location | Used By |
|---|---|---|
| Beehive cover SVGs | `app/public/images/beehive-1-cover.svg`, `beehive-2-cover.svg` | Series Library |
