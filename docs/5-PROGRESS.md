# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 42  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- App foundation: Vite/React/TS/Tailwind; landing; Supabase Auth; app shell.
- Live curriculum catalog from Postgres (`book_series` / `books`) with Storage covers.
- Validation workspace: unit-batch JSON + source PDF viewer; resizable panes; admin `book_files.status` writes.
- Private Storage pilot data: BH1 / BE1-SB / BE2-SB / RH2A unit batches + source PDFs (full RH2A PDF).
- Manual Google AI Studio extraction for the pilot books; first-iteration human verification largely done.
- Documentation audit (Step 42): tech-stack, registry, mock registry, FUTURE, overview/process aligned with repo evidence.
- Owner judgement recorded: Phase 1 extraction quality is satisfactory to continue (Phase 1 still not COMPLETE).

## In progress

- Phase 1 remains open: no canonical merges; no whole-book audits; automated validation not run; formal cross-series schema review not started.
- Close remaining unit reviews when convenient: BH1 Units 9–10 (`pending`); RH2A Unit 4 (`needs_review`).
- Ensure signed-in Validation users have `profiles.role = admin` for status writes.

## Next

- Prefer one small step: formalize the cross-series schema review notes from BH1 / BE1 / RH2A (and BE2), **or** perform the first canonical merge for one verified book (BE1-SB is the cleanest candidate).
- Do not start Phase 2 product work until that checkpoint choice is made.

## Blocked

- None hard-blocked.

---

## Snapshot notes

- **Focus:** Phase 1 evidence quality + lifecycle (verify → merge → audit → schema review).
- **Usable now:** Auth + catalog + Validation against Storage JSON/PDFs.
- **Still mock:** Book Workspace interactive spreads (Beehive 1 only); teacher AI responses.
- **Not Phase 1 COMPLETE:** 0 / 18 books per registry criteria.
