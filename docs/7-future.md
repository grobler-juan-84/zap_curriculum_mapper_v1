# General Curriculum Mapper — Future

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 115  
**Purpose:** Parking lot for good ideas and deferred work that are explicitly **not now**. Keep them visible without contaminating the active Phase 2 experiment scope.

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
| F005 | Phase 3 connections / mapping products | Depends on Phase 1–2 maturity | architecture |
| F006 | Phase 4 teacher enrichment productization | Philosophy exists; no enrichment engine work yet | phase-4 doc |
| F007 | Phase 5–6 lesson packaging / generation (incl. Chalkie.ai handover patterns) | Parked handover spec; not current priority | phase-6 doc |
| F008 | Automated multi-book extraction factory | Manual Google AI Studio unit-batch + human verify is the learning loop now | process |
| F009 | Wire Book Workspace to Storage-backed page models (replace Beehive mock spreads) | Valuable UX bridge; not required to finish Phase 1 evidence quality | app audit 2026-10-07 |
| F010 | Persist Validation session notes | Useful ops polish; status writes already land in Postgres | Validation UI |
| F011 | Generate cover thumbnails and/or linearize source PDFs | First measure the targeted URL-loading fix; avoid changing source assets or Storage architecture without evidence | Storage performance investigation 2026-10-07 |
| F012 | Move dataset JSON and/or covers from Supabase Storage to R2 | Explicitly out of D010; revisit only after PDF migration is verified | D010 / brainstorming 2026-10-08 |
| F013 | PDF delivery scalability (presigned URLs + CORS, streaming, HTTP range, caching, or alternate architecture) | Current authenticated same-origin R2 PDF proxy (D012 R2-only) is appropriate for this internal app (~10 teachers max). Larger apps should investigate backend memory, bandwidth, serverless limits, and PDF.js behavior before adopting the same pattern. No changes required now. | Stage E / 2026-10-08 |
| F014 | Delete unused Supabase Storage `book-sources` PDF objects | D012 stops using them but leaves objects in place; delete only after sustained R2-only confidence | D012 / 2026-10-08 |
| ~~F015~~ | ~~Validation PDF viewer printed-page ↔ PDF-index navigation mismatch when source pages are absent~~ | **Resolved 2026-10-09 (D014):** viewer now navigates by extracted `pdf_page` and labels printed pages. Triggered by BE3-SB Units 5–9 (pp. 66–67 missing). | BE1-WB U9 verify 2026-10-08 |
| F016 | Complete Phase 1 for BH2, RH2B, RH3A and RH4A | Intentionally deferred by D015 while controlled Phase 2 experiments use the completed Big English sequence | D015 |

### PDF Delivery Scalability — Future Consideration

- **Current approach:** authenticated same-origin PDF proxy using Cloudflare R2 (R2-only; D012).
- **Appropriate for:** the current internal application (approximately 10 teachers maximum).
- **Later options:** direct presigned URLs with CORS, streaming responses, HTTP range requests, caching, or alternative delivery architecture.
- **Investigate before scaling up:** backend memory consumption, bandwidth, serverless hosting limits, and PDF.js behavior.
- **Action now:** none (F013).

---

## Reminder

If an idea starts steering today’s Phase 2 experiments toward an unproven schema, implementation or downstream product without an explicit user decision, park it here.
