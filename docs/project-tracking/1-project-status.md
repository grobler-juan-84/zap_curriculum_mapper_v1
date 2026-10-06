# Project Status

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 34  
**Purpose:** Short current snapshot. Detailed narrative lives in [`../5-PROGRESS.md`](../5-PROGRESS.md).

## What has been done

- Hybrid Supabase catalog + private Storage for pilot batch JSON and cover imagery.
- Curriculum UI loads series/books from Supabase; covers via signed URLs.
- `/app/validation` scaffold: unit JSON from Storage, PDF placeholder, status tools for `book_files.status`.

## Current status

Phase 1 catalog is usable while authenticated. Validation is the primary path for checking extracted unit batches against (future) embedded PDFs. Book `cover_path` migration may still need applying on remote.

## Next small step

**Suggestion:** Try `/app/validation` on a pilot book, then upload source PDFs to `book-sources` so the PDF pane becomes real. Remaining: RH2A Unit 4 review, cover_path stamp, canonical merges.
