# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 21  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Core Phase 1–7 philosophy documented; docs split into `phase-1`…`phase-6` folders.
- Root docs cover overview, tech stack, architecture, and operating trackers (decisions / progress / todo / future).
- Phase 1 unit batches human-verified for BH1, BE1-SB, BE2-SB, and RH2A units 1–3.
- RH2A Unit 4 extracted and consolidated into single `rh2a_sb_unit4.json`.
- Technology scaffold initialized: Vite/React/TS/Tailwind under `app/`, Supabase local config under `supabase/`, Python tooling area under `python/`.
- Supabase locked as backend platform (D005); curriculum remains JSON-first.

## In progress

- Phase 1 extraction / verification for the pilot series (Beehive, Big English, Reach Higher).
- Keeping schema 0.1 honest against real extractions (gaps logged, not frozen).

## Next

- Human-review RH2A Unit 4 (`rh2a_sb_unit4.json`).
- Or start a draft cross-series schema review now that all three pilot series have representative units.

## Blocked

- None hard-blocked. Soft friction: RH2A `book_id` naming still inconsistent (`reach_higher_2a` vs `rh_2a`).

---

## Snapshot notes

- **Focus:** Phase 1 evidence quality remains primary; software scaffold exists but product features are not started.
- **Usable now:** Unit JSON batches + registry + Phase 1 docs + minimal frontend shell (`cd app && npm run dev`).
- **Not started as product work:** Auth, curriculum browser, Gemini ingestion, automated validation pipeline, canonical merges at scale, live Supabase wiring.
