# General Curriculum Mapper — Decisions

**Status:** ACTIVE  
**Version:** 1.0  
**Purpose:** Canonical decision log. Record important settled choices with date, reason, and rejected alternatives so future AI/Cursor sessions do not reopen them without cause.

**Related:** Exploratory discussion lives in [`project-tracking/2-internal-brainstorming.md`](./project-tracking/2-internal-brainstorming.md). This file supersedes [`project-tracking/3-project-decisions.md`](./project-tracking/3-project-decisions.md) as the authoritative log.

---

## How to use

- Append only when a choice is intentionally locked.
- Do not delete superseded decisions — mark them `SUPERSEDED` and point to the replacement.
- Prefer short, concrete statements.
- Before proposing a major direction change, read this file first.

### Entry template

```markdown
### D### — Short title

**Date:** YYYY-MM-DD  
**Status:** LOCKED | SUPERSEDED  
**Decision:**  
**Reason:**  
**Alternatives rejected:**  
**Implications:**  
**Supersedes:** — or D###
```

---

## Decision index

| ID | Title | Date | Status |
|---|---|---|---|
| D001 | Phase 1 is extract-only | 2026-10-06 | LOCKED |
| D002 | Unit-batch JSON, then canonical merge | 2026-10-06 | LOCKED |
| D003 | Docs organized by phase folders | 2026-10-06 | LOCKED |
| D004 | Operating trackers live at docs root 4–7 | 2026-10-06 | LOCKED |
| D005 | Supabase is the backend platform | 2026-10-06 | LOCKED |
| D006 | Hybrid storage: Postgres metadata + Storage files + JSON curriculum | 2026-10-07 | LOCKED |
| D007 | Catalog book_id is canonical; aliases normalized at merge | 2026-10-07 | LOCKED |
| D008 | Automated structural validation is a separate future gate | 2026-10-07 | LOCKED |
| D009 | Project-wide naming conventions | 2026-10-07 | LOCKED |

---

## Decisions

### D001 — Phase 1 is extract-only

**Date:** 2026-10-06  
**Status:** LOCKED  
**Decision:** Phase 1 captures what the curriculum source actually contains. No lesson planning, enrichment, or invented pedagogy in Phase 1 datasets.  
**Reason:** Preserve book-truth and keep enrichment (Phase 4+) clearly separable from evidence.  
**Alternatives rejected:** Mixing teacher tips / lesson plans into extraction JSON; treating AI inference as source content.  
**Implications:** Extraction prompt, schema, and verification stay evidence-oriented.  
**Supersedes:** —

---

### D002 — Unit-batch JSON, then canonical merge

**Date:** 2026-10-06  
**Status:** LOCKED  
**Decision:** Google AI Studio extraction returns one JSON batch per unit (with `FILE:` labels). After human verification, batches merge into one canonical book JSON.  
**Reason:** Whole-book single-shot output is unreliable; unit batches are reviewable and recoverable.  
**Alternatives rejected:** One whole-book JSON as the primary extraction artifact; keeping batches forever as the product.  
**Implications:** Registry tracks batch + book lifecycle; merge/audit are required before COMPLETE.  
**Supersedes:** —

---

### D003 — Docs organized by phase folders

**Date:** 2026-10-06  
**Status:** LOCKED  
**Decision:** Phase-specific documentation lives under `docs/phase-1` … `docs/phase-6`. Empty phase folders are intentional placeholders.  
**Reason:** Keep phase scope visible and prevent cross-phase doc sprawl at the docs root.  
**Alternatives rejected:** Flat numbered dump of all phase docs at `docs/` root.  
**Implications:** Index and cross-links must use phase paths; root docs are overview / stack / architecture / operating trackers.  
**Supersedes:** —

---

### D004 — Operating trackers live at docs root 4–7

**Date:** 2026-10-06  
**Status:** LOCKED  
**Decision:** AI-facing operating state is maintained in `4-DECISIONS.md`, `5-PROGRESS.md`, `6-TODO.md`, and `7-FUTURE.md`.  
**Reason:** Give every session a short, predictable place to read decisions, current state, actionable work, and parked ideas.  
**Alternatives rejected:** Relying only on `project-tracking/` status/decisions for day-to-day AI orientation.  
**Implications:** Cursor rules must keep these four files current; `project-tracking/` remains for steps log and brainstorming.  
**Supersedes:** —

---

### D005 — Supabase is the backend platform

**Date:** 2026-10-06  
**Status:** LOCKED  
**Decision:** Supabase is the selected backend platform for the General Curriculum Mapper. It will provide PostgreSQL, authentication, and object storage when those capabilities are required. Canonical curriculum data remains JSON-first, with PostgreSQL JSONB available where database persistence/querying is useful. Locking Supabase does not require immediate implementation of every Supabase capability.  
**Reason:** The project owner already uses Supabase in KIS Points, reducing unnecessary technology switching and allowing knowledge and development patterns to transfer between projects.  
**Alternatives rejected:** Leaving PostgreSQL / Auth / Storage providers undecided; selecting a different BaaS solely for novelty; normalizing Phase 1 curriculum JSON into relational tables as a precondition for backend choice.  
**Implications:** Tech-stack docs treat Supabase PostgreSQL, Auth, and Storage as locked; scaffold may include Supabase client/config without requiring live credentials; curriculum evidence stays under `data/` as JSON.  
**Supersedes:** —

---

### D006 — Hybrid storage: Postgres metadata + Storage files + JSON curriculum

**Date:** 2026-10-07  
**Status:** LOCKED  
**Decision:** Use a hybrid architecture. PostgreSQL holds stable catalog/ops metadata (`book_series`, `books`, `book_files`, `dataset_versions`, profiles). Supabase Storage holds source PDFs and dataset JSON files in private buckets. Canonical curriculum content (units, pages, vocabulary, language, activities, etc.) remains inside JSON documents and is not normalized into relational tables.  
**Reason:** Phase 1 schema is still evolving and publishers differ; premature relational curriculum tables would force constant migrations. Metadata and file pointers are stable enough to model early.  
**Alternatives rejected:** Full relational model of curriculum entities; storing only JSONB blobs with no catalog tables; public Storage buckets for copyrighted PDFs; permanent public URLs as canonical file references.  
**Implications:** App catalog queries Postgres; curriculum detail loads from Storage/local JSON; `dataset_versions.version` ≠ `schema_version`; see `docs/8-database-architecture.md`.  
**Supersedes:** —

---

### D007 — Catalog book_id is canonical; aliases normalized at merge

**Date:** 2026-10-07  
**Status:** LOCKED  
**Decision:** Postgres `books.book_id` (matching Storage folder segment) is the canonical book identity. Extraction-era `book_id` strings are aliases listed in [`phase-1/book_id_aliases.json`](./phase-1/book_id_aliases.json). At canonical merge (and when re-normalizing), rewrite `book_id` / same-book `source_book_id` / `target_book_id` fields to the catalog ID. Do **not** rewrite entity ID strings (`unit_id`, `page_id`, …).  
**Reason:** Stable catalog identity is required for Storage paths, joins, Validation, and app architecture independently of curriculum schema evolution; extraction prefixes vary by series and must not block merges.  
**Alternatives rejected:** Treating extracted `book_id` as canonical and renaming folders/registry; rewriting all entity ID prefixes at merge; promoting aliases into separate schemas per series.  
**Implications:** Merge script and `normalize_canonical_book_ids.mjs` apply the map; BE1-SB canonical v1 book_id fields normalized 2026-10-07; further pilot merges must use the map. See [`phase-1/Book_ID_Alias_Map.md`](./phase-1/Book_ID_Alias_Map.md).  
**Supersedes:** —

---

### D008 — Automated structural validation is a separate future gate

**Date:** 2026-10-07
**Status:** LOCKED
**Decision:** Use a small two-layer validator for Phase 1 schema 0.1: machine JSON Schema for shape/types and shared JavaScript for identity, references, D007 normalization, and range consistency. Run lightweight validation on verified batches before merge and full validation on the normalized canonical candidate. Automated `ERROR` findings block new progression; warnings do not. Human curriculum verification and whole-book/source audit remain separate gates.
**Reason:** Deterministic structural checks should replace repetitive manual integrity work without claiming curriculum meaning, source completeness, or PDF fidelity, and without closing extensible cross-series classifications.
**Alternatives rejected:** Treating the historical audit script as a complete validator; using only JSON Schema for graph/reference checks; making all category vocabularies closed enums; treating open issues/schema gaps as automatic failures; combining automated validation with human/source certification.
**Implications:** Merge, audit, and standalone CLI reuse one validation engine. Existing completed pilots are validated retrospectively without silently revoking prior completion; new errors are recorded and triaged. Schema remains 0.1.
**Supersedes:** —

---

### D009 — Project-wide naming conventions

**Date:** 2026-10-07  
**Status:** LOCKED  
**Decision:** Adopt [`9-naming-conventions.md`](./9-naming-conventions.md) as the project-wide naming authority, enforced for agents by `.cursor/rules/naming_conventions.mdc`. Keep registry ID, catalog `book_id`, series slug, Postgres UUID, and entity ID as distinct identities. New books use full-word catalog templates and full catalog `book_id` entity prefixes. Grandfather the four COMPLETE pilots; do not silently rewrite entity IDs (D007).  
**Reason:** The repository had accumulated inconsistent abbreviations and casing across docs, Storage, and extraction JSON. A forward-looking standard before BE1-WB extraction prevents further drift without forcing a risky pilot ID rewrite.  
**Alternatives rejected:** Rewriting pilot entity IDs now; using registry IDs as Storage paths; introducing new abbreviated catalog/entity prefixes (`bep*`, `be*`, `rh*`); making Reach Higher later books use `_sb` while `reach_higher_2a` remains without it; delaying formalization until after the next extraction.  
**Implications:** New folders, docs, code, Storage segments, and curriculum IDs follow the authority doc. Existing mixed doc filenames and pilot entity prefixes remain until a risk-classified backward audit. Extraction prompt / alias guidance / validator naming checks should be updated as follow-through, not by reopening this decision.  
**Supersedes:** —

---

## Change log

| Date | Change |
|---|---|
| 2026-10-06 | Created canonical decision log; recorded D001–D004 from existing project doctrine. |
| 2026-10-06 | Added D005 — Supabase backend platform locked. |
| 2026-10-07 | Added D006 — hybrid storage architecture locked; catalog migration created. |
| 2026-10-07 | Added D007 — catalog book_id canonical; alias map + merge-time normalization. |
| 2026-10-07 | Added D008 — automated structural validation is separate from human/source verification and gates future progression on ERROR findings. |
| 2026-10-07 | Added D009 — project-wide naming conventions locked; authority doc + always-on Cursor rule. |
