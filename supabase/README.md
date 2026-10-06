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

Apply to the remote project manually (Dashboard SQL editor, or `supabase link` + `supabase db push`).

Apply in timestamp order. If the catalog migration was already applied without `label`/`status`, the `20261007130000_…` migration adds those columns. Apply `20261007140000_…` so authenticated clients can read cover images and `cover_path` is stored on series rows.

Frontend public env vars live in `app/.env.local` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

Server-side scripts may also read `SUPABASE_SERVICE_ROLE_KEY` (never prefix with `VITE_`; never commit). Prefer keeping the service-role key in a root `.env` / `.env.local` rather than a Vite-loaded file long-term.

### Upload pilot batch JSON to Storage

From repo root, after seeding `book_files` paths:

```bash
node scripts/upload_pilot_batches.mjs
```

This upserts the local `data/phase1/**/*.json` unit batches into the private `book-datasets` bucket using the seeded `storage_path` values and updates `book_files.file_size`.

### Upload series cover images

```bash
node scripts/upload_series_covers.mjs
```

Uploads `app/src/assests/images/book-series/*.png` into private `book-assets` (`series/*.png`) and sets `book_series.cover_path` when that column exists.

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
