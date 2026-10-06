# General Curriculum Mapper

Textbook-agnostic curriculum intelligence system. Current focus: **Phase 1 — Curriculum Extraction & Dataset Development**.

## Repository layout

```text
/
├── app/                 # Vite + React + TypeScript + Tailwind frontend
├── data/phase1/         # Phase 1 unit-batch JSON (canonical curriculum evidence)
├── docs/                # Project documentation and operating trackers
├── python/              # Future validation / processing / AI tooling
├── schemas/             # Reserved for machine-readable schema artifacts
├── scripts/             # Utility scripts (empty for now)
├── supabase/            # Supabase local project config (no live link required)
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

The app starts without Supabase credentials. Copy `.env.example` to `.env` only when you have local values.

## Python tooling

See [`python/README.md`](./python/README.md).

## Locked technology (not all implemented yet)

| Layer | Choice |
|---|---|
| Frontend | Vite + React + TypeScript + Tailwind |
| Backend platform | Supabase (PostgreSQL / Auth / Storage when needed) |
| Curriculum format | JSON-first (JSONB later where useful) |
| AI | Google Gemini API (not integrated in scaffold) |
| Frontend hosting | Vercel (not deployed from scaffold) |

See [`docs/2-tech-stack.md`](./docs/2-tech-stack.md) and [`docs/4-DECISIONS.md`](./docs/4-DECISIONS.md).

## Documentation

Start at [`docs/0-index.md`](./docs/0-index.md) and [`docs/5-PROGRESS.md`](./docs/5-PROGRESS.md).
