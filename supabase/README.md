# Supabase

Supabase is the **locked** backend platform for this project (PostgreSQL, Auth, Storage when needed).

This folder holds local Supabase project configuration and versioned migrations.

## Migrations

| Migration | Purpose |
|---|---|
| `migrations/20261006120000_create_profiles.sql` | `profiles` + auto teacher profile on signup; RLS select-own |
| `migrations/20261007120000_create_curriculum_catalog.sql` | Hybrid catalog: `book_series`, `books`, `book_files`, `dataset_versions`; private Storage buckets `book-sources` / `book-datasets`; admin-write / authenticated-read RLS |

Apply to the remote project manually (Dashboard SQL editor, or `supabase link` + `supabase db push`).

Frontend public env vars live in `app/.env.local` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

## Storage buckets

Created by the curriculum catalog migration (private):

| Bucket | Contents | Example object path |
|---|---|---|
| `book-sources` | Source PDFs | `big-english/big_english_1_sb/source.pdf` |
| `book-datasets` | Batch + canonical JSON | `big-english/big_english_1_sb/batches/unit_01.json` |

If Storage policies fail to apply in a restricted environment, recreate the two private buckets in the Dashboard and re-run the policy statements from the migration.

## Architecture

See [`docs/8-database-architecture.md`](../docs/8-database-architecture.md) for what belongs in Postgres vs Storage vs canonical JSON.

## Rules

- Do not normalize Phase 1 curriculum JSON into relational tables here.
- Never put the service-role key in the frontend.
- Canonical curriculum data remains JSON-first under `data/` (and mirrored into Storage when uploaded).
- Postgres stores catalog metadata and file pointers (`bucket` + `storage_path`), not permanent public URLs.
