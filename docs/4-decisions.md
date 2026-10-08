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
| D010 | Cloudflare R2 for textbook source PDFs | 2026-10-08 | LOCKED |
| D011 | Validation PDF signed URLs via server API; R2-first dual-read | 2026-10-08 | LOCKED |

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
**Decision:** AI-facing operating state is maintained in `4-decisions.md`, `5-progress.md`, `6-todo.md`, and `7-future.md`.  
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
**Implications:** Tech-stack docs treat Supabase PostgreSQL and Auth as locked. Supabase Storage remains for dataset JSON and covers unless separately decided. Textbook source PDF object storage is refined by **D010** (Cloudflare R2). Supabase is **not** removed wholesale.  
**Supersedes:** —  
**Refined by:** D010 (source PDFs only)

---

### D006 — Hybrid storage: Postgres metadata + Storage files + JSON curriculum

**Date:** 2026-10-07  
**Status:** LOCKED  
**Decision:** Use a hybrid architecture. PostgreSQL holds stable catalog/ops metadata (`book_series`, `books`, `book_files`, `dataset_versions`, profiles). Object storage holds source PDFs and dataset JSON files in private buckets. Canonical curriculum content (units, pages, vocabulary, language, activities, etc.) remains inside JSON documents and is not normalized into relational tables.  
**Reason:** Phase 1 schema is still evolving and publishers differ; premature relational curriculum tables would force constant migrations. Metadata and file pointers are stable enough to model early.  
**Alternatives rejected:** Full relational model of curriculum entities; storing only JSONB blobs with no catalog tables; public Storage buckets for copyrighted PDFs; permanent public URLs as canonical file references.  
**Implications:** App catalog queries Postgres; curriculum detail loads from object storage / local JSON; `dataset_versions.version` ≠ `schema_version`; see `docs/8-database-architecture.md`. Provider split for PDFs vs JSON/covers is refined by **D010**.  
**Supersedes:** —  
**Refined by:** D010 (textbook source PDFs → Cloudflare R2; JSON/covers remain on Supabase Storage until separately decided)

---

### D007 — Catalog book_id is canonical; aliases normalized at merge

**Date:** 2026-10-07  
**Status:** LOCKED  
**Decision:** Postgres `books.book_id` (matching Storage folder segment) is the canonical book identity. Extraction-era `book_id` strings are aliases listed in [`phase-1/book_id_aliases.json`](./phase-1/book_id_aliases.json). At canonical merge (and when re-normalizing), rewrite `book_id` / same-book `source_book_id` / `target_book_id` fields to the catalog ID. Do **not** rewrite entity ID strings (`unit_id`, `page_id`, …).  
**Reason:** Stable catalog identity is required for Storage paths, joins, Validation, and app architecture independently of curriculum schema evolution; extraction prefixes vary by series and must not block merges.  
**Alternatives rejected:** Treating extracted `book_id` as canonical and renaming folders/registry; rewriting all entity ID prefixes at merge; promoting aliases into separate schemas per series.  
**Implications:** Merge script and `normalize_canonical_book_ids.mjs` apply the map; BE1-SB canonical v1 book_id fields normalized 2026-10-07; further pilot merges must use the map. See [`phase-1/book-id-alias-map.md`](./phase-1/book-id-alias-map.md).  
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
**Implications:** New folders, docs, code, Storage segments, and curriculum IDs follow the authority doc. Existing mixed doc filenames and pilot entity prefixes remain until a risk-classified backward audit. Authority clarifications (v1.1: tracker kebab targets, audit-report registry filenames, Postgres UUID vs catalog collision, local/public asset rules) refine enforcement without reopening this decision. Extraction prompt / alias guidance are aligned; safe cosmetic renames and validator naming checks remain follow-through.  
**Supersedes:** —

---

### D010 — Cloudflare R2 for textbook source PDFs

**Date:** 2026-10-08  
**Status:** LOCKED  
**Decision:** Cloudflare R2 is the selected object-storage provider for textbook **source PDFs**. The private R2 bucket is named `book-sources`. Existing logical object-key structure (`{series-slug}/{catalog_book_id}/source.pdf`) should be preserved where practical. Supabase remains the backend for PostgreSQL, Auth, and (for now) dataset JSON / cover object storage — it is not removed wholesale. Implementation must follow documentation and connection testing (Stages A–E in [`10-storage-architecture.md`](./10-storage-architecture.md)); this decision does **not** authorize immediate migration or deletion of Supabase PDF objects.  
**Reason:** Separate large copyrighted PDF binaries onto R2 while keeping Supabase strengths for Auth/catalog; keep object keys stable so `book_files` pointers and Validation workflows need minimal path rewrites; require staged verify-before-cutover because PDFs are live in Validation today.  
**Alternatives rejected:** Moving all object storage to R2 in one step; auto-migrating canonical/batch JSON to R2 as part of this change; making the R2 bucket public; deleting Supabase `book-sources` before verified migration; exposing R2 secrets to the Vite frontend.  
**Implications:** Docs and roadmaps treat R2 as the PDF target. Validation PDF signing is refined by **D011**. JSON storage provider remains an open question (brainstorming), not locked here.  
**Supersedes:** — (refines D005/D006 object-storage provider for source PDFs only)  
**Refines:** D005, D006  
**Refined by:** D011

---

### D011 — Validation PDF signed URLs via server API; R2-first dual-read

**Date:** 2026-10-08  
**Status:** LOCKED  
**Decision:** Validation obtains textbook PDF access through server-side `POST /api/sign-source-pdf` (Vite middleware locally; shared handler for future Vercel). The handler requires a valid Supabase user JWT and authorizes only catalog `book_files` rows (`file_type = source_pdf`) by `bookFileId` — not arbitrary object keys. R2 secrets never use `VITE_*`. Cutover is **R2-first dual-read**: if the object is missing on R2 (`404`) or R2/signing is temporarily unavailable (`5xx` / network), fall back to Supabase Storage signed URLs; if auth/permission fails (`401` / `403`, including R2 AccessDenied), surface the error and do **not** silently fall back. JSON datasets and cover images remain on Supabase Storage. Supabase PDF originals are not deleted in Stage D.  
**Reason:** Browser cannot hold R2 secrets; only Beehive 1 is on R2 so dual-read keeps other pilots working; distinguishing missing vs forbidden prevents a broken R2 config from hiding behind Supabase.  
**Alternatives rejected:** Signing R2 URLs in the Vite client; accepting raw `storagePath` without catalog check; hard-cut all PDFs to R2 before Stage E; silent fallback on R2 403; migrating JSON/covers in the same change.  
**Implications:** Validation UI shows provider (`via r2` / `via supabase`). Bucket CORS for localhost may need Cloudflare dashboard if the Object Read/Write token cannot call PutBucketCors. Stage E still required before retiring Supabase `book-sources`.  
**Supersedes:** —  
**Refines:** D010

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
| 2026-10-07 | D009 authority clarified to v1.1 after naming audit (no decision reopen). |
| 2026-10-08 | Added D010 — Cloudflare R2 for textbook source PDFs; refined D005/D006 implications (docs-only; no migration). |
| 2026-10-08 | Added D011 — Validation PDF signing via `/api/sign-source-pdf` with R2-first dual-read and catalog authorization. |
