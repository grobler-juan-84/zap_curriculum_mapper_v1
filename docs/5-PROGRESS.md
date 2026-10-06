# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 23  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Core Phase 1–7 philosophy documented; docs split into `phase-1`…`phase-6` folders.
- Technology scaffold: Vite/React/TS/Tailwind under `app/`, Supabase config, Python tooling.
- Supabase locked as backend platform (D005); curriculum remains JSON-first.
- Public UI: landing + auth pages.
- Supabase Auth wired: signup/login/forgot/reset, AuthProvider, protected `/app` shell, `profiles` migration with teacher-default trigger + SELECT-own RLS.

## In progress

- Phase 1 extraction / verification for the pilot series.
- Applying/verifying the profiles migration against the live Supabase project (manual).

## Next

- Apply `profiles` migration + configure Auth redirect URLs in Supabase Dashboard.
- Human-review RH2A Unit 4 (`rh2a_sb_unit4.json`).

## Blocked

- None hard-blocked. Soft friction: RH2A `book_id` naming still inconsistent (`reach_higher_2a` vs `rh_2a`).

---

## Snapshot notes

- **Focus:** Phase 1 evidence quality remains primary; auth foundation is ready once migration is applied.
- **Usable now:** Unit JSON batches + docs + auth UI against Supabase (after migration + Dashboard redirects).
- **Not started:** Curriculum browser, Gemini ingestion, automated validation, canonical merges at scale, admin tooling.
