# General Curriculum Mapper — Todo

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 26  
**Purpose:** Concrete near-term actionable tasks. Not a parking lot for long-term ideas (see [`7-FUTURE.md`](./7-FUTURE.md)).

---

## Now

- [ ] Apply migrations in order on live Supabase: catalog → `book_files` label/status → pilot seed; confirm 3 series / 4 books / batch rows.
- [ ] Confirm profiles migration + Auth redirect URLs on the live Supabase project (if not already applied).
- [ ] Human-verify RH2A Unit 4 `rh2a_sb_unit4.json`; set that `book_files.status` to `verified` when done.
- [ ] Owner review of ZCMV1 UI baseline in `/app/*` before connecting real curriculum data.

## Next

- [ ] Replace mock curriculum catalog with Supabase `book_series` / `books` reads.
- [ ] Load unit batches for a selected book from `book_files` (`batch_json` + `label`/`status`) for verification UI.
- [ ] Normalize RH2A `book_id` / folder naming (`reach_higher_2a` vs `rh_2a`) for units 1–4.

## Soon

- [ ] Upload batch JSON (and later PDFs) to private Storage; keep Postgres as pointers only.
- [ ] After all units verified for one book: merge canonical JSON + create `dataset_versions` (`is_current`).
- [ ] Draft first cross-series schema review notes from BH1 / BE1–2 / RH2A extractions.

---

## Maintenance

- Keep this list short and actionable.
- Move completed items off the list (progress belongs in [`5-PROGRESS.md`](./5-PROGRESS.md)).
- Park non-now ideas in [`7-FUTURE.md`](./7-FUTURE.md), not here.
- Keep [`project-tracking/4-mock-data-registry.md`](./project-tracking/4-mock-data-registry.md) current when mock datasets change.
