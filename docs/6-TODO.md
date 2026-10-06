# General Curriculum Mapper — Todo

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 25  
**Purpose:** Concrete near-term actionable tasks. Not a parking lot for long-term ideas (see [`7-FUTURE.md`](./7-FUTURE.md)).

---

## Now

- [ ] Apply curriculum catalog migration + confirm private `book-sources` / `book-datasets` buckets on the live Supabase project.
- [ ] Confirm profiles migration + Auth redirect URLs on the live Supabase project (if not already applied).
- [ ] Human-verify RH2A Unit 4 `rh2a_sb_unit4.json`; update registry verification status.
- [ ] Owner review of ZCMV1 UI baseline in `/app/*` before connecting real curriculum data.

## Next

- [ ] Seed `book_series` / `books` from the dataset registry for pilot books (metadata only).
- [ ] Normalize RH2A `book_id` / folder naming (`reach_higher_2a` vs `rh_2a`) for units 1–4.
- [ ] Draft first cross-series schema review notes from BH1 / BE1–2 / RH2A extractions.

## Soon

- [ ] Replace mock curriculum catalog with verified/canonical sources (keep UI/service boundary).
- [ ] Upload first source PDF + canonical/batch JSON to Storage and link via `book_files` / `dataset_versions`.
- [ ] Run or design automated validation against schema 0.1 for verified unit batches.

---

## Maintenance

- Keep this list short and actionable.
- Move completed items off the list (progress belongs in [`5-PROGRESS.md`](./5-PROGRESS.md)).
- Park non-now ideas in [`7-FUTURE.md`](./7-FUTURE.md), not here.
- Keep [`project-tracking/4-mock-data-registry.md`](./project-tracking/4-mock-data-registry.md) current when mock datasets change.
