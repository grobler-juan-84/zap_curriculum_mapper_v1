# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 40  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Hybrid Supabase catalog/Storage; pilot unit JSON and source PDFs in private buckets.
- Curriculum library uses live `book_series` / `books` with Storage cover URLs.
- `/app/validation`: unit JSON + PDF.js two-page viewer; resizable panes; admin-gated status writes.
- Beehive 1 now has all 10 unit batches in Storage (`unit_01`–`unit_10`); Units 9–10 seeded as `pending`.

## In progress

- Human-verify Beehive Units 9–10 (and RH2A Unit 4) in Validation.
- Promote signed-in user to admin if status buttons are disabled.

## Next

- Persist validation notes when needed.
- Canonical merges after units verified.

## Blocked

- None hard-blocked (status writes need admin role by design).

---

## Snapshot notes

- **Focus:** Storage-backed verification workflow for Phase 1 batches.
- **Usable now:** Auth + catalog + Validation with Beehive 1 Units 1–10.
- **Not started:** Canonical merges; teacher Ask-AI production path.
