# General Curriculum Mapper — Todo

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 41  
**Purpose:** Concrete near-term actionable tasks. Not a parking lot for long-term ideas (see [`7-FUTURE.md`](./7-FUTURE.md)).

---

## Now

- [ ] Refresh Validation for Reach Higher 2A and confirm the full source PDF (not units 1–2 only) loads for Units 3–4.
- [ ] Refresh Validation for Beehive 1 and confirm Units 9–10 appear; human-verify and set `book_files.status`.
- [ ] Promote your signed-in user to `profiles.role = admin` (see `supabase/README.md`) if status buttons are disabled.
- [ ] Human-verify RH2A Unit 4 in Validation; set `book_files.status` to `verified`.

## Next

- [x] Upload source PDFs to private `book-sources` and register `book_files` `source_pdf` rows so the validation PDF pane embeds.
- [ ] Confirm Validation 2-page PDF viewer on each pilot book while signed in.
- [ ] Replace remaining Beehive-only mock spreads with Storage-backed content path.
- [ ] Move `SUPABASE_SERVICE_ROLE_KEY` to root server env (not Vite-loaded) when convenient.

## Soon

- [ ] Persist validation session notes (optional column / table).
- [ ] After all units verified for one book: merge canonical JSON + create `dataset_versions` (`is_current`).
- [ ] Draft first cross-series schema review notes from BH1 / BE1–2 / RH2A extractions.

---

## Maintenance

- Keep this list short and actionable.
- Move completed items off the list (progress belongs in [`5-PROGRESS.md`](./5-PROGRESS.md)).
- Park non-now ideas in [`7-FUTURE.md`](./7-FUTURE.md), not here.
- Keep [`project-tracking/4-mock-data-registry.md`](./project-tracking/4-mock-data-registry.md) current when mock datasets change.
