# General Curriculum Mapper — Todo

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 27  
**Purpose:** Concrete near-term actionable tasks. Not a parking lot for long-term ideas (see [`7-FUTURE.md`](./7-FUTURE.md)).

---

## Now

- [ ] Confirm migrations + Storage objects in Supabase Dashboard (3 series / 4 books / 30 batches in `book-datasets`).
- [ ] Human-verify RH2A Unit 4; set that `book_files.status` to `verified` when done.
- [ ] Move `SUPABASE_SERVICE_ROLE_KEY` to root server env (not Vite-loaded) when convenient; rotate if the key was exposed.
- [ ] Owner review of ZCMV1 UI baseline before connecting real curriculum data.

## Next

- [ ] Replace mock curriculum catalog with Supabase `book_series` / `books` reads.
- [ ] Load unit batches for a selected book from Storage via `book_files` for verification UI.
- [ ] Normalize RH2A `book_id` / folder naming (`reach_higher_2a` vs `rh_2a`) for units 1–4.

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
