# Project Status

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 39  
**Purpose:** Short current snapshot. Detailed narrative lives in [`../5-PROGRESS.md`](../5-PROGRESS.md).

## What has been done

- Hybrid Supabase catalog + private Storage for pilot batch JSON, cover imagery, and source PDFs.
- `/app/validation`: unit JSON + PDF.js viewer; resizable panes; status buttons write `book_files.status` for admins.

## Current status

Status updates were failing silently for non-admin (RLS 0-row update). Client now errors if no row returns, and the tools panel warns when `profiles.role` is not `admin`. See `supabase/README.md` for promote-to-admin SQL.

## Next small step

**Suggestion:** Set your user to admin, refresh Validation, flip Pending → Verified and confirm the `book_files` row updates.
