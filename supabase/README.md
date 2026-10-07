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

Apply to the remote project manually (Dashboard SQL editor, or `supabase link` + `supabase db push`).

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

### Upload source PDFs to Storage

Place the four pilot PDFs under `book-sources/` (gitignored via `*.pdf`), apply `20261007160000_seed_source_pdf_book_files.sql` if needed, then from repo root:

```bash
node scripts/upload_source_pdfs.mjs
```

Optional filter (comma-separated `book_id` / filename fragments):

```bash
# PowerShell — replace one book’s PDF
$env:UPLOAD_ONLY='reach_higher_2a'; node scripts/upload_source_pdfs.mjs
```

This upserts PDFs into the private `book-sources` bucket and upserts matching `book_files` rows (`file_type = source_pdf`). The Validation app loads them via short-lived signed URLs for authenticated users only.

### Upload series cover images

```bash
node scripts/upload_series_covers.mjs
```

Uploads local `app/src/assests/images/book-series/*_book_series.png` (gitignored) into private `book-assets` (`series/*.png`) and sets `book_series.cover_path` when that column exists.

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
