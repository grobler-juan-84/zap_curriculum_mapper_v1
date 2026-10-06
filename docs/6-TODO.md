# General Curriculum Mapper — Todo

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 30  
**Purpose:** Concrete near-term actionable tasks. Not a parking lot for long-term ideas (see [`7-FUTURE.md`](./7-FUTURE.md)).

---

## Now

- [ ] Confirm `/app/curriculum` shows the 3 series cover PNGs on the cards (above levels/books).
- [ ] Human-verify RH2A Unit 4; set that `book_files.status` to `verified` when done.
- [ ] Apply any remaining Storage RLS notes if signed cover URLs fail while logged in (local PNG fallback still works).

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
