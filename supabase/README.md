# Supabase

Supabase is the **locked** backend platform for this project (PostgreSQL, Auth, Storage when needed).

This folder holds local Supabase project configuration and versioned migrations.

## Migrations

| Migration | Purpose |
|---|---|
| `migrations/20261006120000_create_profiles.sql` | `profiles` + auto teacher profile on signup; RLS select-own |
| `migrations/20261007120000_create_curriculum_catalog.sql` | Hybrid catalog: `book_series`, `books`, `book_files`, `dataset_versions`; private Storage buckets; admin-write / authenticated-read RLS |
| `migrations/20261007130000_book_files_label_status.sql` | Adds nullable `book_files.label` + `book_files.status` (per-file workflow) |
| `migrations/20261007131000_seed_pilot_catalog.sql` | Seeds 3 series, 4 pilot books, and unit `batch_json` file pointers (no canonical `dataset_versions` yet) |
| `migrations/20261007140000_book_assets_and_series_covers.sql` | Private `book-assets` bucket + `book_series.cover_path` for series cover images |
| `migrations/20261007150000_books_cover_path.sql` | Adds `books.cover_path` for student-book cover images |
| `migrations/20261007160000_seed_source_pdf_book_files.sql` | Seeds `book_files` `source_pdf` pointers for the four pilot books |
| `migrations/20261007170000_seed_beehive_1_units_09_10.sql` | Seeds Beehive 1 `batch_json` pointers for Units 9–10 |
| `migrations/20261007180000_verify_bh1_u09_u10_rh2a.sql` | Sets BH1 Units 9–10 and all RH2A unit batches to `verified` |
| `migrations/20261007190000_seed_be1_canonical_v1.sql` | Seeds BE1-SB `canonical_json` + `dataset_versions` v1 pointers |
| `migrations/20261008120000_seed_big_english_1_wb.sql` | Seeds BE1-WB `books` + `source_pdf` + 9 pending `batch_json` pointers |
| `migrations/20261008130000_seed_big_english_2_wb.sql` | Seeds BE2-WB `books` + `source_pdf` pointer (batches after extraction) |
| `migrations/20261008140000_seed_big_english_2_wb_batches.sql` | Seeds BE2-WB 9 pending `batch_json` pointers + `books.status=extracted` |

Apply to the remote project manually (Dashboard SQL editor, or `supabase link` + `supabase db push`). Without the CLI, catalog seeds can also be applied with `node scripts/apply_be1wb_seed.mjs` / `node scripts/apply_be2wb_seed.mjs` (service role).

Apply in timestamp order. If the catalog migration was already applied without `label`/`status`, the `20261007130000_…` migration adds those columns. Apply `20261007140000_…` so authenticated clients can read cover images and `cover_path` is stored on series rows. Apply `20261007150000_…` for per-book cover paths.

### Promote a user to admin (Validation status writes)

Catalog writes (including `book_files.status` from `/app/validation`) require `profiles.role = 'admin'`. New signups default to `teacher`. In the Supabase SQL editor:

```sql
-- Replace with your auth user id from Authentication → Users
update public.profiles
set role = 'admin'
where id = '00000000-0000-0000-0000-000000000000';
```

Then refresh the app (or sign out/in) so the client reloads your profile.

Frontend public env vars live in `app/.env.local` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

Server-side scripts may also read `SUPABASE_SERVICE_ROLE_KEY` (never prefix with `VITE_`; never commit). Prefer keeping the service-role key in a root `.env` / `.env.local` rather than a Vite-loaded file long-term.

### Merge a canonical book dataset

After unit batches are verified, merge into Storage + `dataset_versions`:

```bash
node scripts/merge_canonical_book.mjs big_english_1_sb
```

The merge command now validates each verified batch, refuses cross-batch ID collisions, applies D007 `book_id` normalization, and validates the canonical candidate before writing/uploading. Errors abort the merge; warnings are preserved in the report.

Writes `data/phase1/<book_id>/canonical/v1.json` and `data/phase1/<book_id>/validation/v1.report.json` (both gitignored), uploads `…/canonical/v1.json` to `book-datasets`, upserts `book_files` (`canonical_json`), and sets `dataset_versions` v1 `is_current` (`status = draft` until whole-book audit).

### Validate a Phase 1 dataset

Validate a local canonical when present, otherwise the Storage canonical:

```bash
node scripts/validate_phase1_json.mjs big_english_1_sb
node scripts/validate_phase1_json.mjs big_english_1_sb --json
```

Validate a local unit batch:

```bash
node scripts/validate_phase1_json.mjs big_english_1_sb --file data/phase1/big_english_1_sb/unit.json --mode batch
node scripts/validate_phase1_json.mjs big_english_1_sb --storage-path big-english/big_english_1_sb/batches/unit_01.json --mode batch
```

The command exits nonzero on `ERROR`, writes a machine report under `data/phase1/<book_id>/validation/`, and never claims curriculum/source accuracy.

### Structural audit of a canonical dataset

```bash
node scripts/audit_canonical_book.mjs big_english_1_sb
```

Reuses the same validator and writes `docs/phase-1/audits/<book>_canonical_v1_audit.md` (integrity/coverage/uncertainty). Owner PDF spot-check is still required for Whole-Book Audit PASSED.

### Upload pilot batch JSON to Storage

From repo root, after seeding `book_files` paths:

```bash
node scripts/upload_pilot_batches.mjs
```

Optional filter (comma-separated filename fragments):

```bash
# PowerShell
$env:UPLOAD_ONLY='beehive_1_sb_unit_09,beehive_1_sb_unit_10'; node scripts/upload_pilot_batches.mjs
```

This upserts local `data/phase1/**/*.json` unit batches (gitignored working copies) into the private `book-datasets` bucket and upserts matching `book_files` rows. Missing local files are skipped unless `UPLOAD_ONLY` is set. After upload, Storage is the source of truth.

### Upload source PDFs to Cloudflare R2 (D012)

**Local layout (gitignored — never commit PDFs to GitHub):**

```text
app/src/assets/books/{series_slug}/{catalog_book_id}.pdf
```

Examples:

```text
app/src/assets/books/beehive/beehive_1_sb.pdf
app/src/assets/books/big-english/big_english_1_sb.pdf
app/src/assets/books/big-english/big_english_1_wb.pdf
app/src/assets/books/reach-higher/reach_higher_2a.pdf
```

Remaining Big English books use the same pattern (`big_english_{level}_{sb|wb}.pdf` under `big-english/`). Do not use `project-books/` or registry IDs as filenames.

Requires root `.env.local` R2 credentials plus Supabase URL/service role (catalog upsert only). After local placement and any needed `books` / `book_files` seed, from repo root:

```bash
node scripts/upload_source_pdfs.mjs
```

Optional filter (comma-separated `book_id` / filename fragments):

```bash
# PowerShell — replace one book’s PDF
$env:UPLOAD_ONLY='reach_higher_2a'; node scripts/upload_source_pdfs.mjs
```

This **PutObject**s PDF bytes to Cloudflare R2 `book-sources` and upserts matching Postgres `book_files` rows (`file_type = source_pdf`). It does **not** upload PDF bytes to Supabase Storage. Object keys: `{series_slug}/{catalog_book_id}/source.pdf`. Validation loads PDFs R2-only via `/api/source-pdf-content` (D012).

### Upload series cover images

```bash
node scripts/upload_series_covers.mjs
```

Uploads local `app/src/assets/images/book-series/*_book_series.png` (gitignored) into private `book-assets` (`series/*.png`) and sets `book_series.cover_path` when that column exists.

### Upload student-book cover images

```bash
node scripts/upload_book_covers.mjs
```

Uploads the four pilot book covers into `book-assets` (`books/<book_id>/cover.png`) and sets `books.cover_path` when that column exists.

## Storage buckets

Created by the curriculum catalog migration (private):

| Bucket | Contents | Example object path |
|---|---|---|
| `book-sources` | Source PDFs | `big-english/big_english_1_sb/source.pdf` |
| `book-datasets` | Batch + canonical JSON | `big-english/big_english_1_sb/batches/unit_01.json` |
| `book-assets` | Series/book imagery (PNG/JPEG/WebP) | `series/beehive_book_series.png` |

If Storage policies fail to apply in a restricted environment, recreate the two private buckets in the Dashboard and re-run the policy statements from the migration.

## Architecture

See [`docs/8-database-architecture.md`](../docs/8-database-architecture.md) for what belongs in Postgres vs Storage vs canonical JSON.

## Rules

- Do not normalize Phase 1 curriculum JSON into relational tables here.
- Never put the service-role key in the frontend.
- Canonical curriculum data remains JSON-first under `data/` (and mirrored into Storage when uploaded).
- Postgres stores catalog metadata and file pointers (`bucket` + `storage_path`), not permanent public URLs.
