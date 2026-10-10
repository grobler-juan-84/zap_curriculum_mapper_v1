# Phase 5 Prototype — Chalkie Workspace UI

**Status:** ACTIVE  
**Version:** 1.0  
**Branch:** `feature/chalkie-workspace`  
**Route:** `/app/chalkie` (protected)

---

## Purpose and scope

First teacher-facing **UI slice** for Phase 5 lesson packaging: browse the textbook PDF, see concise Phase 1 evidence summaries, and reserve space for server-generated Chalkie prompts.

**In scope (this slice):**

- Three-pane layout aligned with Validation Workspace (header, left context, PDF, bottom prompt area).
- Series / book / unit navigation and R2-backed PDF viewing (same authorized pathway as Validation).
- **Unit Summary** and **Visible Pages Summary** derived from Phase 1 canonical or batch JSON only.
- Disabled **Generate Chalkie Prompt** and read-only output placeholder (no mock AI).

**Out of scope (explicit):**

- OpenAI or other model API integration.
- Loading Phase 2–4 experiment markdown into the app.
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
| Bottom panel | Disabled generate, placeholder textarea, stub copy rows for topic / prompt / vocabulary CSV |

---

## What remains pending

1. Server route (e.g. `POST /api/generate-chalkie-prompt`) with session auth and `OPENAI_API_KEY`.
2. Wire Generate button; populate lesson topic, full prompt, and vocabulary CSV with individual copy actions.
3. Optional: teacher page-range picker beyond the current PDF spread.
4. Optional: attach approved Phase 5 brief scaffolding server-side (e.g. page-scoped BE2 U8 pp. 128–129 pattern).

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
