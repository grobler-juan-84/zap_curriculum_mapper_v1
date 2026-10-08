# Project Status

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 77  
**Purpose:** Short current snapshot. Detailed narrative lives in [`../5-progress.md`](../5-progress.md).

## What has been done

- Four pilots Phase 1 COMPLETE; D010–D011 locked; R2 Stages A–E PASS.
- All 4 cataloged source PDFs on R2; Validation UI confirms `provider=r2 delivery=proxy` for each.
- Local PDF layout + gitignore hardened (`app/src/assets/books/…`; no PDFs to GitHub).

## Current status

R2 PDF migration verified for pilots. Remaining Big English source PDFs can be staged locally under `app/src/assets/books/big-english/` without entering Git.

## Next small step

**Suggestion:** Drop remaining Big English PDFs into `app/src/assets/books/big-english/` using catalog filenames, then prepare BE1-WB (`big_english_1_wb`).
