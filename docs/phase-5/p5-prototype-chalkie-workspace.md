# Phase 5 Prototype — Chalkie Workspace UI

**Status:** ACTIVE  
**Version:** 1.0  
**Branch:** `feature/chalkie-workspace`  
**Route:** `/app/chalkie` (protected)

---

## Purpose and scope

First teacher-facing **UI slice** for Phase 5 lesson packaging: browse the textbook PDF, see concise Phase 1 evidence summaries, and reserve space for server-generated Chalkie prompts.

**In scope:**

- Three-pane layout aligned with Validation Workspace (header, left context, PDF, bottom prompt area).
- Series / book / unit navigation and R2-backed PDF viewing (same authorized pathway as Validation).
- **Unit Summary** and **Visible Pages Summary** derived from Phase 1 canonical or batch JSON only.
- **Generate Chalkie Prompt** via server `POST /api/generate-chalkie-prompt` (OpenAI, session JWT, `OPENAI_API_KEY`).
- Copy controls for lesson topic, Chalkie prompt, and vocabulary CSV.

**Out of scope (explicit):**

- Loading Phase 2–4 experiment markdown into the app / inventing interpretation.
- Validation status writes or ops tooling.
- Book Workspace mock Teacher AI / `chalkie-prompt` quick action.

---

## What was implemented

| Area | Detail |
|---|---|
| Navigation | Sidebar **Chalkie Workspace** → `/app/chalkie` |
| Header | Reuses `ValidationHeader` with verification status badge hidden |
| PDF | Reuses `ValidationPdfPane`; optional callback lifts visible **printed** page numbers to the workspace |
| Left panel | Collapsible Unit Summary + Visible Pages Summary (`chalkieEvidence.ts`) |
| Bottom panel | Generate (OpenAI) + copy for topic / prompt / vocabulary CSV |
| API | `POST /api/generate-chalkie-prompt` (Vite middleware; Bearer JWT) |

---

## Environment (OpenAI key)

Server-only secret. Never prefix with `VITE_` (that would expose it to the browser).

| Where | Purpose |
|---|---|
| **Root** [`.env.local`](../../.env.local) (gitignored) | **Put your real `OPENAI_API_KEY` here** — preferred for Vite middleware / API handlers via `loadServerEnv` |
| Root [`.env.example`](../../.env.example) | Documented empty template (committed; no secrets) |
| `app/.env.local` | Public Supabase `VITE_*` only — **do not** put OpenAI here |

After adding the key, restart the Vite dev server (`npm run dev` in `app/`).

## What remains pending

1. Optional: teacher page-range picker beyond the current PDF spread.
2. Optional: harden scaffolding with the approved BE2 U8 pp. 128–129 brief as a golden-path fixture.
3. Optional: Vercel/serverless adapter for `/api/generate-chalkie-prompt` (local Vite middleware works today).

---

## Current limitations

- Visible scope = current PDF spread only (typically two printed pages).
- Summaries depend on Phase 1 JSON linkage (`printed_page`, `page_id`); sparse links may yield empty spread vocabulary.
- No Phase 2 learning-requirement interpretation in the UI.
- Header may still show “from canonical” when applicable; verification status is hidden only.

---

## Relationship to Phase 5 methodology and Phase 6

- Aligns with **page-scoped packaging** discipline documented in [`p5-exp-be2-u08-p128-129-chalkie-brief-v1.md`](./p5-exp-be2-u08-p128-129-chalkie-brief-v1.md) (manual paste brief; not yet automated).
- **Phase 6** [`chalkie-ai-handover-specifications.md`](../phase-6/chalkie-ai-handover-specifications.md) remains **PARKED** for downstream generation productization; this prototype is Phase 5 teacher packaging UI, not Phase 6 lesson generation.

---

## Change log

| Date | Change |
|---|---|
| 2026-10-10 | Initial UI prototype on `feature/chalkie-workspace`. |
| 2026-10-10 | Owner approved UI prototype and pp. 128–129 packaging brief; OpenAI wiring not started. |
| 2026-10-10 | Documented `OPENAI_API_KEY` env setup (root `.env.local`); Generate route still pending. |
| 2026-10-10 | Wired Generate via OpenAI server route; copy controls enabled. |
