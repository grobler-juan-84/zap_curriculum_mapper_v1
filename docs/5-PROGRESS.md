# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 22  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Core Phase 1–7 philosophy documented; docs split into `phase-1`…`phase-6` folders.
- Root docs cover overview, tech stack, architecture, and operating trackers.
- Phase 1 unit batches human-verified for BH1, BE1-SB, BE2-SB, and RH2A units 1–3.
- RH2A Unit 4 extracted and consolidated into single `rh2a_sb_unit4.json`.
- Technology scaffold: Vite/React/TS/Tailwind under `app/`, Supabase config, Python tooling.
- Supabase locked as backend platform (D005); curriculum remains JSON-first.
- Public UI shell: clean landing page + login / signup / forgot-password / reset-password (UI-only, no Supabase Auth yet).

## In progress

- Phase 1 extraction / verification for the pilot series.
- Keeping schema 0.1 honest against real extractions.

## Next

- Wire Supabase Auth to the auth screens.
- Human-review RH2A Unit 4 (`rh2a_sb_unit4.json`).

## Blocked

- None hard-blocked. Soft friction: RH2A `book_id` naming still inconsistent (`reach_higher_2a` vs `rh_2a`).

---

## Snapshot notes

- **Focus:** Phase 1 evidence quality remains primary; public app shell pages exist without real auth.
- **Usable now:** Unit JSON batches + docs + `cd app && npm run dev` for landing/auth UI.
- **Not started:** Live Supabase Auth, curriculum browser, Gemini ingestion, automated validation, canonical merges at scale.
