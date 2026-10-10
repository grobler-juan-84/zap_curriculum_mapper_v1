# General Curriculum Mapper — Progress

**Status:** ACTIVE  

**Version:** 1.0  

**Last updated:** Step 130

**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phases 2–4** working methodologies locked (D018).

- **Phase 5 Experiment 1** page-scoped Chalkie brief (BE2 SB pp. 128–129) + owner-approved UI.

- **Chalkie Generate live (local):** `/app/chalkie` → `POST /api/generate-chalkie-prompt` with session JWT + root `OPENAI_API_KEY`.

## In progress

- Owner optional paste-test of a generated brief in Chalkie.ai.

## Next

- Optional teacher page-range picker beyond PDF spread — only after explicit decision.

## Blocked

- Soft: OpenAI key is short-lived (1-day test key) — renew tomorrow before more Generate tests.

---

## Snapshot notes

- Active Git branch: `feature/chalkie-workspace` (local commits; not pushed unless requested).
- Restart Vite after env changes so middleware reloads `OPENAI_API_KEY`.
