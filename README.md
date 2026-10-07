# General Curriculum Mapper

Textbook-agnostic curriculum intelligence system. Current focus: **Phase 1 — Curriculum Extraction & Dataset Development**.

## Repository layout

```text
/
├── app/                 # Vite + React + TypeScript + Tailwind frontend
├── data/phase1/         # Local working copies of unit-batch JSON (gitignored; Storage is source of truth)
├── docs/                # Project documentation and operating trackers
├── python/              # Future validation / processing / AI tooling
├── schemas/             # Reserved for machine-readable schema artifacts
├── scripts/             # Upload / utility scripts (batch JSON + cover assets)
├── supabase/            # Supabase local project config + migrations
└── .cursor/rules/       # Cursor workflow rules
```

## Frontend

```bash
cd app
npm install
npm run dev
```

Other useful commands:

```bash
npm run typecheck
npm run build
```

Auth, catalog, and Validation require Supabase credentials in `app/.env.local` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Without them, login/catalog/Validation are not usable.

## Python tooling

See [`python/README.md`](./python/README.md).

## Locked technology (implementation varies)

| Layer | Choice | Pilot status |
|---|---|---|
| Frontend | Vite + React + TypeScript + Tailwind | App shell + Validation live |
| Backend platform | Supabase (PostgreSQL / Auth / Storage) | Auth, catalog, private Storage in use |
| Curriculum format | JSON-first (JSONB later where useful) | Unit batches in Storage |
| AI | Google Gemini API | Not integrated; extraction via Google AI Studio manually |
| Frontend hosting | Vercel | Not deployed from this repo |

See [`docs/2-tech-stack.md`](./docs/2-tech-stack.md), [`docs/5-PROGRESS.md`](./docs/5-PROGRESS.md), and [`docs/4-DECISIONS.md`](./docs/4-DECISIONS.md).

## Documentation

Start at [`docs/0-index.md`](./docs/0-index.md) and [`docs/5-PROGRESS.md`](./docs/5-PROGRESS.md).
