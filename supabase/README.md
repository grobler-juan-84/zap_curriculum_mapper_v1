# Supabase

Supabase is the **locked** backend platform for this project (PostgreSQL, Auth, Storage when needed).

This folder holds local Supabase project configuration only.

## Rules for now

- Do not create speculative tables or curriculum relational schemas.
- Do not require live Supabase credentials for the frontend to start.
- Do not run `supabase login`, `supabase link`, or remote migrations from scaffolding work.
- Canonical curriculum data remains JSON-first under `data/`.

When a real Supabase project is connected later, document env vars in the root `.env.example`.
