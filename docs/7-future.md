# General Curriculum Mapper — Future

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 69  
**Purpose:** Parking lot for good ideas that are explicitly **not now**. Keep them visible without contaminating current Phase 1 scope.

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
| F004 | Phase 2 interpretation pipeline | Explicitly downstream of trustworthy Phase 1 datasets | architecture |
| F005 | Phase 3 connections / mapping products | Depends on Phase 1–2 maturity | architecture |
| F006 | Phase 4 teacher enrichment productization | Philosophy exists; no enrichment engine work yet | phase-4 doc |
| F007 | Phase 5–6 lesson packaging / generation (incl. Chalkie.ai handover patterns) | Parked handover spec; not current priority | phase-6 doc |
| F008 | Automated multi-book extraction factory | Manual Google AI Studio unit-batch + human verify is the learning loop now | process |
| F009 | Wire Book Workspace to Storage-backed page models (replace Beehive mock spreads) | Valuable UX bridge; not required to finish Phase 1 evidence quality | app audit 2026-10-07 |
| F010 | Persist Validation session notes | Useful ops polish; status writes already land in Postgres | Validation UI |
| F011 | Generate cover thumbnails and/or linearize source PDFs | First measure the targeted URL-loading fix; avoid changing source assets or Storage architecture without evidence | Storage performance investigation 2026-10-07 |
| F012 | Move dataset JSON and/or covers from Supabase Storage to R2 | Explicitly out of D010; revisit only after PDF migration is verified | D010 / brainstorming 2026-10-08 |

---

## Reminder

If an idea starts steering today’s extraction/schema work without an explicit user decision, park it here and stay on Phase 1.
