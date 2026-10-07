# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 43  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- App foundation: Vite/React/TS/Tailwind; landing; Supabase Auth; app shell.
- Live curriculum catalog from Postgres with Storage covers.
- Validation workspace over unit-batch JSON + source PDFs; admin status writes.
- Pilot Storage data for BH1 / BE1-SB / BE2-SB / RH2A (full RH2A PDF).
- Unit-batch human verification COMPLETE for BH1 (incl. U9–10), BE1-SB, BE2-SB, and RH2A (incl. U4).
- Documentation audit (Step 42); extraction quality checkpoint accepted.

## In progress

- Phase 1 still open: no canonical merges; no whole-book audits; automated validation not run; formal cross-series schema review not started.
- Ensure Validation admins have `profiles.role = admin` when writing status (already done for verified batches via service role / admin UI).

## Next

- Draft initial cross-series schema review notes from BH1 / BE1 / RH2A (and BE2), **or** first canonical merge (BE1-SB or BH1 are strong candidates).

## Blocked

- None hard-blocked.

---

## Snapshot notes

- **Focus:** Phase 1 lifecycle after unit verification (schema review → canonical merge → audit).
- **Usable now:** Auth + catalog + Validation; all pilot unit batches marked `verified`.
- **Still mock:** Book Workspace spreads (Beehive 1); teacher AI.
- **Not Phase 1 COMPLETE:** 0 / 18 books (canonical + whole-book audit still required).
