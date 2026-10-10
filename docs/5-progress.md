# General Curriculum Mapper — Progress

**Status:** ACTIVE  

**Version:** 1.0  

**Last updated:** Step 129

**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phases 2–4** working methodologies locked (D018).

- **Phase 5 Experiment 1 corrected:** page-scoped Chalkie brief for BE2 SB **pp. 128–129**.

- **Chalkie Workspace UI prototype** approved; `/app/chalkie` live for summaries + PDF.

- **OpenAI env prepared:** `OPENAI_API_KEY` documented in `.env.example`; placeholder in root `.env.local`.

## In progress

- Waiting for owner to paste OpenAI key and request Generate API wiring.

## Next

- Implement `POST /api/generate-chalkie-prompt` + enable Generate button (after key is present).

- Optional Chalkie paste test of the page brief (owner-directed).

## Blocked

- Soft: Generate cannot run until `OPENAI_API_KEY` is set in root `.env.local`.

---

## Snapshot notes

- Active Git branch: `feature/chalkie-workspace` (local commits; not pushed unless requested).
