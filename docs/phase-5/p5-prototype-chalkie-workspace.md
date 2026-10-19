# Phase 5 Prototype — Chalkie Workspace UI

**Status:** ACTIVE  
**Version:** 1.2  
**Route:** `/app/chalkie` (protected)

---

## Purpose and scope

First teacher-facing **UI slice** for Phase 5 lesson packaging: browse the textbook PDF, see concise Phase 1 evidence summaries, and launch a guided teacher-choice setup before prompt preparation.

**In scope:**

- Three-pane layout aligned with Validation Workspace (header, left context, PDF, compact bottom action area).
- Series / book / unit navigation and R2-backed PDF viewing (same authorized pathway as Validation).
- **Unit Summary** and **Visible Pages Summary** derived from Phase 1 canonical or batch JSON only.
- **Prepare Chalkie prompt** launch into a focused four-step teacher-choice overlay (Steps 1–2 implemented for the BE2 Unit 8 prototype case).

**Out of scope (explicit):**

- Loading Phase 2–4 experiment markdown into the app / inventing interpretation.
- Full teacher-choice Steps 3–4 (choices workspace, lesson-input summary).
- Actual Chalkie prompt generation / copy output in this micro-step.
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
| Bottom panel | Calm **Prepare Chalkie prompt** action + helper text (no generated output yet) |
| Overlay | Teacher-choice Steps 1–2 (Current lesson + AI prior-learning suggestions with local checkboxes); Cancel returns to workspace |
| API (deferred) | `POST /api/generate-chalkie-prompt` still exists server-side; not launched from this bottom panel in the current micro-step |

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

1. Teacher-choice Steps 3–4 overlay content (choices workspace, lesson-input summary).
2. Optional: teacher page-range picker beyond the current PDF spread.
3. Optional: re-wire or redesign Generate / copy after the guided flow is complete.
4. Optional: Vercel/serverless adapter for `/api/generate-chalkie-prompt` (local Vite middleware works today).

---

## Current limitations

- Visible scope = current PDF spread only (typically two printed pages).
- Summaries depend on Phase 1 JSON linkage (`printed_page`, `page_id`); sparse links may yield empty spread vocabulary.
- Teacher-choice overlay Steps 1–2 are live; Steps 3–4 remain placeholder only.
- Curated BE2 U8 prototype content is used when `big_english_2_sb` Unit 8 is selected; other units fall back to Phase 1 previews.
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
| 2026-10-19 | Bottom panel replaced with **Prepare Chalkie prompt** launch; Step 1 teacher-choice overlay for BE2 U8. |
| 2026-10-19 | Step 2 AI suggestions (four unchecked prior-learning rows; local selection; Step 3 placeholder). |
