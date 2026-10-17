# General Curriculum Mapper — Future

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 198  
**Purpose:** Parking lot for good ideas and deferred work that are explicitly **not now**. Keep them visible without contaminating current teacher-first work. D018 V2-family is **CLOSED** (V2b preferred control). V3 Book Intelligence experiment is **designed** (Step 198); generation awaits owner approval.

---

## How to use

- Add ideas that are valuable but out of current focus.
- Do not treat items here as active commitments.
- Promote to [`6-todo.md`](./6-todo.md) only when the user deliberately pulls them into near-term work.
- Lock related product choices in [`4-decisions.md`](./4-decisions.md) when settled.

---

## Parked ideas

| ID | Idea | Why not now | Source |
|---|---|---|---|
| F001 | Full SaaS productization (multi-tenant orgs, billing, polished teacher product) | Pilot Auth/catalog/Validation exist; Storage-backed pilot Phase 1 COMPLETE; remaining books + product polish still later | brainstorming / D005 |
| F002 | Relational / JSONB curriculum projections beyond ops metadata | Premature before canonical book JSON lifecycle is proven | brainstorming |
| F003 | Google Sheets explorer over Phase 1 JSON | Superseded for pilot verification by `/app/validation`; Sheets remains optional later if useful | brainstorming |
| ~~F004~~ | ~~Phase 2 interpretation pipeline~~ | **Promoted 2026-10-09 (D015):** bounded Big-English-only interpretation experiments are now active. No implementation or schema is locked. | architecture / D015 |
| F005 | Phase 3 Series Intelligence / vertical mapping products | **PARKED** under D017; **not a prerequisite** for current D018 Chalkie prompt experiments. BE1→BE2→BE3 sufficiency probe supports only bounded experimental Series Intelligence — not Phase 3 productization or schema lock | architecture / D017 |
| F006 | Phase 4 teacher enrichment **productization** (engine / production pipeline) | Bounded Teaching Intelligence experimentation may accompany D018; a full enrichment product remains later | phase-4 doc |
| ~~F007~~ | ~~Phase 5–6 lesson packaging / generation (incl. Chalkie.ai)~~ | **Partially promoted 2026-10-16; V2-family CLOSED 2026-10-17:** preferred Pass baseline/control = **V2b**. **Step 198** V3 BI experiment **designed** (append-only `[BI]`); generation **not** authorized pending owner approval. Full packaging/generation productization and locked Chalkie handover standards remain parked ([`phase-6/chalkie-ai-handover-specifications.md`](./phase-6/chalkie-ai-handover-specifications.md)). Day-to-day Chalkie UI/ops: [`phase-6/chalkie-interface-and-generation-workflow.md`](./phase-6/chalkie-interface-and-generation-workflow.md) (tool reference — not productization). | phase-6 / D018 |
| F019 | Optional multi-presentation Floor / Enrichment / Extension lesson-series modularization | **PARKED** — not a default D018 requirement. Lesson Series mode may create multiple lessons, but do not automatically split every lesson into Floor / Enrichment / Extension. See ops guide + Sandbox #4A notes in the parked handover spec. | phase-6 / D018 |
| F008 | Automated multi-book extraction factory | Manual Google AI Studio unit-batch + human verify is the learning loop now | process |
| F009 | Wire Book Workspace to Storage-backed page models (replace Beehive mock spreads) | Valuable UX bridge; not required to finish Phase 1 evidence quality | app audit 2026-10-07 |
| F010 | Persist Validation session notes | Useful ops polish; status writes already land in Postgres | Validation UI |
| F011 | Generate cover thumbnails and/or linearize source PDFs | First measure the targeted URL-loading fix; avoid changing source assets or Storage architecture without evidence | Storage performance investigation 2026-10-07 |
| F012 | Move dataset JSON and/or covers from Supabase Storage to R2 | Explicitly out of D010; revisit only after PDF migration is verified | D010 / brainstorming 2026-10-08 |
| F013 | PDF delivery scalability (presigned URLs + CORS, streaming, HTTP range, caching, or alternate architecture) | Current authenticated same-origin R2 PDF proxy (D012 R2-only) is appropriate for this internal app (~10 teachers max). Larger apps should investigate backend memory, bandwidth, serverless limits, and PDF.js behavior before adopting the same pattern. No changes required now. | Stage E / 2026-10-08 |
| F014 | Delete unused Supabase Storage `book-sources` PDF objects | D012 stops using them but leaves objects in place; delete only after sustained R2-only confidence | D012 / 2026-10-08 |
| ~~F015~~ | ~~Validation PDF viewer printed-page ↔ PDF-index navigation mismatch when source pages are absent~~ | **Resolved 2026-10-09 (D014):** viewer now navigates by extracted `pdf_page` and labels printed pages. Triggered by BE3-SB Units 5–9 (pp. 66–67 missing). | BE1-WB U9 verify 2026-10-08 |
| F016 | Complete Phase 1 for BH2, RH2B, RH3A and RH4A | Intentionally deferred by D015 while controlled Phase 2 experiments use the completed Big English sequence | D015 |
| F017 | Optional Phase 1 extraction of publisher curriculum plans (Scope and Sequence), including exact “I Can” / publisher-stated outcomes with page refs; keep publisher evidence distinct from AI inference | Not needed for current D017 v2 working baseline (~92% coverage sufficient); avoid prompt/dataset churn while validating Book Intelligence | owner park 2026-10-13 |
| F018 | Optional Phase 1 extraction of dedicated review / checkpoint sections outside normal units (e.g. Big English checkpoints after U1–3, U4–6, U7–9; other series may differ); identify what prior content is reviewed, reinforced, or assessed | Out of current Units 1–9 Book Intelligence scope; do not expand extraction until a clear downstream need appears | owner park 2026-10-13 |

### F017 / F018 notes (PARKED — not approved)

- A dedicated Scope & Sequence Studio prompt now exists at [`phase-1/google-ai-studio-prompt-ss-v1.md`](./phase-1/google-ai-studio-prompt-ss-v1.md). That file does **not** by itself promote F017 into active Phase 1 pipeline work.
- BE2-SB and BE3-SB have companion SS datasets at `…/canonical/ss_v1.json` (local + Storage), registered in [`phase-1/dataset-registry.md`](./phase-1/dataset-registry.md). Object presence ≠ pipeline promotion: no `dataset_versions`/`book_files` wiring, no SB↔SS merge, no Book Intelligence methodology change. BE2 SS is an input to the D018 V1 manual experiment only.
- **Do not** modify SB/WB extraction prompts, canonical SB/WB JSON, schemas, or existing datasets for these ideas without explicit owner approval.
- D017 v2 Learning Outcomes remain concise and **AI-inferred** until/unless F017 is deliberately promoted.

### PDF Delivery Scalability — Future Consideration

- **Current approach:** authenticated same-origin PDF proxy using Cloudflare R2 (R2-only; D012).
- **Appropriate for:** the current internal application (approximately 10 teachers maximum).
- **Later options:** direct presigned URLs with CORS, streaming responses, HTTP range requests, caching, or alternative delivery architecture.
- **Investigate before scaling up:** backend memory consumption, bandwidth, serverless hosting limits, and PDF.js behavior.
- **Action now:** none (F013).

---

## Reminder

If an idea starts steering today’s D018 Chalkie / Teaching Intelligence experiments toward an unproven schema, implementation, Vertical Mapping unlock, or downstream product without an explicit user decision, park it here.
