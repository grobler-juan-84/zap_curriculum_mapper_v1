# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 39  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Hybrid Supabase catalog/Storage; pilot unit JSON and source PDFs in private buckets.
- Curriculum library uses live `book_series` / `books` with Storage cover URLs.
- `/app/validation`: unit JSON + PDF.js two-page viewer; resizable left/right and PDF/tools panes.
- Validation status writes detect RLS no-ops and require `profiles.role = admin` (UI warns otherwise).

## In progress

- Promote signed-in user to admin if Validation status buttons are disabled; confirm row updates in Supabase.
- Apply pending remote migrations if not already applied.

## Next

- Human-review RH2A Unit 4 via Validation UI; mark `book_files.status`.
- Persist validation notes when needed.
- Canonical merges after units verified.

## Blocked

- None hard-blocked (status writes need admin role by design).

---

## Snapshot notes

- **Focus:** Storage-backed verification workflow for Phase 1 batches.
- **Usable now:** Auth + catalog + Validation with resizable panes and embedded source PDFs.
- **Not started:** Canonical merges; teacher Ask-AI production path.
