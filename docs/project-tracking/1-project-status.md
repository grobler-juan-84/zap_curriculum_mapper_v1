# Project Status

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 33  
**Purpose:** Short current snapshot. Detailed narrative lives in [`../5-PROGRESS.md`](../5-PROGRESS.md).

## What has been done

- Hybrid Supabase catalog + private Storage for pilot batch JSON and cover imagery.
- Curriculum UI loads series/books from Supabase; covers via signed URLs only.
- Local `data/phase1` JSON and `app/src/assests` cover PNGs removed from Git (gitignored).

## Current status

Phase 1 catalog is usable while authenticated. Copyrighted curriculum bytes should live in Supabase Storage, not the repo. Book `cover_path` column may still need applying on remote.

## Next small step

**Suggestion:** Apply `20261007150000_books_cover_path.sql` on remote and stamp `books.cover_path`, then wire Storage batch JSON into a verification/viewer path. Remaining work: RH2A Unit 4 review, drop Beehive mock spreads, canonical merges.
