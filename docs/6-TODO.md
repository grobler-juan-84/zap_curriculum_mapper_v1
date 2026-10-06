# General Curriculum Mapper — Todo

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 33  
**Purpose:** Concrete near-term actionable tasks. Not a parking lot for long-term ideas (see [`7-FUTURE.md`](./7-FUTURE.md)).

---

## Now

- [ ] Apply `supabase/migrations/20261007150000_books_cover_path.sql` in the Supabase SQL editor, then re-run `node scripts/upload_book_covers.mjs` (restore local cover PNGs temporarily if needed).
- [ ] Confirm series/book cards show covers from Storage signed URLs while signed in.
- [ ] Human-verify RH2A Unit 4; set that `book_files.status` to `verified` when done.

## Next

- [ ] Load unit batches for a selected book from Storage via `book_files` for verification UI.
- [ ] Replace remaining Beehive-only mock spreads with Storage-backed content path.
- [ ] Move `SUPABASE_SERVICE_ROLE_KEY` to root server env (not Vite-loaded) when convenient.

## Soon

- [ ] Upload source PDFs to private `book-sources` and register `book_files` rows.
- [ ] After all units verified for one book: merge canonical JSON + create `dataset_versions` (`is_current`).
- [ ] Draft first cross-series schema review notes from BH1 / BE1–2 / RH2A extractions.

---

## Maintenance

- Keep this list short and actionable.
- Move completed items off the list (progress belongs in [`5-PROGRESS.md`](./5-PROGRESS.md)).
- Park non-now ideas in [`7-FUTURE.md`](./7-FUTURE.md), not here.
- Keep [`project-tracking/4-mock-data-registry.md`](./project-tracking/4-mock-data-registry.md) current when mock datasets change.
