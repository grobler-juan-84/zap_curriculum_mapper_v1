# Project Status

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 37  
**Purpose:** Short current snapshot. Detailed narrative lives in [`../5-PROGRESS.md`](../5-PROGRESS.md).

## What has been done

- Hybrid Supabase catalog + private Storage for pilot batch JSON, cover imagery, and source PDFs.
- Curriculum UI loads series/books from Supabase; covers via signed URLs.
- `/app/validation`: unit JSON from Storage; source PDFs via short-lived signed URLs + PDF.js two-page viewer (unit first page on the left).

## Current status

Four pilot PDFs are in private `book-sources` with `book_files` `source_pdf` rows. Unit jumps open the unit’s first printed page on the left (e.g. Beehive Unit 2 → 26 | 27). Apply `20261007160000_seed_source_pdf_book_files.sql` on remote if pointers were only upserted via the upload script.

## Next small step

**Suggestion:** Spot-check Validation PDF jumps for odd- and even-start units, then continue RH2A Unit 4 review / cover_path stamp / canonical merges.
