# General Curriculum Mapper — Project Status

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 15  
**Purpose:** Short, evolving snapshot of project progress. Rewrite the three sections below after each file-changing prompt so this file always reflects the current state.

---

## 1. What has been done

- Core Phase 1–7 architecture and curriculum philosophy documented under `docs/`.
- Phase 1 unit-batch extractions human-verified for BH1, BE1-SB, BE2-SB; RH2A units 1–3 verified (Unit 4 pending).
- Project-tracking + brainstorming Q&A covering canonical JSON, hybrid storage, and how a future React/Vercel app would create JSON via Gemini API and persist it outside Vercel’s filesystem.

---

## 2. Current status

- **Focus:** Phase 1 thinking / extraction — not application coding yet.
- **Storage lean (not locked):** JSON curriculum documents in Blob/DB; Vercel hosts UI/API only; Gemini called from serverless with server-side keys.
- **Open data issues:** BE2 Unit 2 truncated sections; RH2A Unit 4 extraction restriction; schema gaps; ID normalization.
- **Decisions:** None locked yet in `3-project-decisions.md`.

---

## 3. Next small step

**Suggested next move (depends on the next prompt):** Keep refining brainstorming / lock any settled architecture notes into decisions, or continue Phase 1 data work (BE2-U02 repair / RH2A Unit 4 / draft schema review).

**Bird’s-eye still to do (not this step):** finish pilot books; canonical merges + audits; schema review; remaining books; SaaS/Gemini ingestion much later.

---
