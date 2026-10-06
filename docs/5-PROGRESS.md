# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 24  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Core Phase 1–7 philosophy documented; docs split into `phase-1`…`phase-6` folders.
- Technology scaffold: Vite/React/TS/Tailwind under `app/`, Supabase config, Python tooling.
- Supabase Auth wired: signup/login/forgot/reset, AuthProvider, protected routes, profiles migration.
- Authenticated ZCMV1-faithful workstation UI on mock data: AppShell, Curriculum Library, Series Library, Book Workspace (intelligence panel + book viewer + teacher AI), mock registry.

## In progress

- Phase 1 extraction / verification for the pilot series.
- Manual apply/verify of profiles migration + Auth redirect URLs on the live Supabase project (if not already done).

## Next

- Human-review RH2A Unit 4 (`rh2a_sb_unit4.json`).
- Later: replace mock curriculum catalog with real Phase 1 / canonical sources (not started).

## Blocked

- None hard-blocked. Soft friction: RH2A `book_id` naming still inconsistent (`reach_higher_2a` vs `rh_2a`).

---

## Snapshot notes

- **Focus:** Visual workstation baseline is in place; curriculum truth remains JSON-first under `data/`.
- **Usable now:** Auth + prototype UI with mock series/spreads/AI responses.
- **Not started:** Real curriculum wiring, Gemini ingestion, admin tooling, automated validation at scale.
