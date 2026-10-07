# Project Status

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 40  
**Purpose:** Short current snapshot. Detailed narrative lives in [`../5-PROGRESS.md`](../5-PROGRESS.md).

## What has been done

- Hybrid Supabase catalog + private Storage for pilot batch JSON, cover imagery, and source PDFs.
- `/app/validation`: unit JSON + PDF.js viewer; resizable panes; admin status writes.
- Beehive 1 Units 9–10 uploaded to `book-datasets` and registered on `book_files` (`pending`).

## Current status

Beehive 1 Student Book has 10 unit batches in Validation. Units 1–8 remain verified; Units 9–10 need human review. Apply `20261007170000_seed_beehive_1_units_09_10.sql` on any environment that did not get rows via the upload script upsert.

## Next small step

**Suggestion:** Open Beehive 1 in Validation, step to Unit 9 / Unit 10, verify against the PDF, set status when ready.
