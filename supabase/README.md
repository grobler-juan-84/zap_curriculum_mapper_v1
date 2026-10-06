# Supabase

Supabase is the **locked** backend platform for this project (PostgreSQL, Auth, Storage when needed).

This folder holds local Supabase project configuration and versioned migrations.

## Auth / profiles

Migration `migrations/20261006120000_create_profiles.sql` creates:

- `public.profiles`
- automatic teacher profile on `auth.users` insert
- RLS: authenticated users can `SELECT` their own row only

Apply to the remote project manually (Dashboard SQL editor, or `supabase link` + `supabase db push`).

Frontend public env vars live in `app/.env.local` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

## Rules

- Do not normalize Phase 1 curriculum JSON into relational tables here.
- Never put the service-role key in the frontend.
- Canonical curriculum data remains JSON-first under `data/`.
