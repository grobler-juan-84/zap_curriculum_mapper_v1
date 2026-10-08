# Internal Brainstorming

**Status:** ACTIVE / EVOLVING  
**Version:** 1.0  
**Purpose:** Working space for ideas, options, and possible solutions to open project questions. Nothing here is binding until promoted into [`../4-decisions.md`](../4-decisions.md).

---

## How to use this document

- Capture questions, options, trade-offs, and rough recommendations.
- Prefer short dated entries over long essays.
- Link related schema gaps, registry notes, or extraction issues when useful.
- When an idea becomes a firm project choice, record it in [`../4-decisions.md`](../4-decisions.md) and leave a short pointer here. Park non-now ideas in [`../7-future.md`](../7-future.md).
- Do **not** treat this file as operational truth; the registry, schema, and locked decisions remain authoritative.

### Entry template

```markdown
### YYYY-MM-DD — Short question title

**Question:**  
**Context:**  
**Options:**
1. …
2. …
**Lean / notes:**  
**Status:** open | leaning | promoted to decision | parked
```

---

## Active themes

Current areas where brainstorming is especially useful:

1. Post-pilot schema_gap classification vs any future 0.2 candidate (owner-accepted deferral).
2. R2 integration details after D010 (auth method, signed-URL surface, `book_files` provider field) — see 2026-10-08 entry.
3. Whether/when dataset JSON or covers leave Supabase Storage (not part of D010).
4. Whether Validation UI as the primary verification surface should become a LOCKED decision (currently implementation-established, not locked).
5. Whether to wire Book Workspace to Storage JSON or keep it as a separate prototype until Phase 2+.
6. BE1-WB extraction prep under D009 naming.

---

## Q&A — storage & automation (2026-10-05)

Brief answers for current thinking only. Not locked decisions.

### #1 — One JSON per book eventually?

**Yes.** Unit-by-unit Google AI Studio output → N batch JSON files is the right *working* method now. After verification, those batches are meant to merge into **one canonical book JSON** (the durable Phase 1 dataset). Batches are scaffolding; the book file is the product.

### #2 — Different series + automation: must we predefine relational tables?

**No — not yet, and not per series.** New series should still emit JSON against a shared, evolving Phase 1 schema (textbook-agnostic entities + optional series-specific fields/gaps). Rigid relational tables too early are the risk: every new book structure forces migrations. Better path: stabilize the JSON schema from real extractions first; only later project stable entities into relational tables (or JSONB) if the SaaS needs them. Automation still produces schema-shaped JSON — it does not require a new table design for each series.

### #3 — If we keep JSON, how does a SaaS store new book files?

Treat each canonical book JSON as a **versioned document**, not a spreadsheet. Practical patterns (any one is enough later):

1. **Object storage** (S3 / GCS / Supabase Storage) for the `.json` blob + a small DB row for `book_id`, version, status, path.
2. **Postgres JSONB** (or similar) — store the document in a `books` / `datasets` row; query metadata in columns, curriculum payload in JSONB.
3. **Document DB** (MongoDB, Firestore, etc.) — natural fit if the app stays document-oriented.

New extractions = new version of that book document (or a draft → published lifecycle), not a new table.

### #4 — Two small thinking steps before any coding

1. **Define “done” for one book** — batch extract → human verify → merge to one canonical JSON → whole-book audit → registry COMPLETE. Write that lifecycle in one page before designing an app.
2. **Freeze ID + schema ownership rules** — one canonical `book_id` convention, what may change in schema 0.1 vs what must wait for a version bump, and who/what is allowed to edit published book JSON. Coding without this creates rename and migration debt immediately.

### #5 — JSON only forever, or move to relational later?

**JSON can carry the curriculum for a long time — maybe forever as the source of truth.** The app does **not** need a full relational model of every vocabulary item / activity to be useful.

**Practical lean:**

| Layer | Prefer | Why |
|---|---|---|
| Curriculum payload (units, pages, vocab, activities, etc.) | **JSON / JSONB / document** | Schema still evolving; series differ; nested evidence fits documents |
| App/ops metadata (users, orgs, book registry, versions, permissions, jobs) | **Small relational tables early** | Stable, queryable, normal SaaS concerns |
| Heavy cross-book analytics / “find all X across 18 books” | **Maybe relational (or search index) later** | Only if JSON queries become slow or painful |

So: **not JSON-only for the whole product**, and **not a big relational curriculum schema soon**. Best middle path is **hybrid** — keep book datasets as JSON documents; use a thin relational (or even just auth + file metadata) layer for the SaaS shell. Move curriculum entities into normalized tables only if a concrete product feature proves JSON querying is the bottleneck.

**Do not decide this before Phase 1 schema + a few canonical books exist.**

### #6 — React/Vite/Vercel stack: how do new JSON files get added without Cursor?

**Yes, the app can create them** (e.g. via Gemini API) — but **Vercel is not where the JSON files “live” as files in a folder.** Vercel hosts the app (static frontend + optional serverless API routes). Serverless disks are ephemeral; you do not `save file.json` onto Vercel the way you save into this repo with Cursor.

**Mental model:**

```text
Teacher/admin uploads PDF (or picks a unit)
        ↓
Vercel serverless function (API route)
        ↓
Calls Gemini API with your extraction prompt + PDF/unit context
        ↓
Gets JSON back → validate against Phase 1 schema
        ↓
SAVE to persistent storage (not Vercel’s filesystem)
        ↓
App later LOADS that JSON from storage to display/edit
```

**Where the JSON actually gets saved (pick one later):**

1. **Vercel Blob** — object storage that pairs well with Vercel; store `beehive_1_sb.json` (or unit drafts) as blobs; DB/metadata row points to the URL.
2. **Supabase Storage / S3 / GCS** — same idea: file in a bucket; app reads via URL or signed link.
3. **Postgres JSONB** (Supabase/Neon/etc.) — store the whole book document in a row; no separate `.json` file on disk, but same data.
4. **GitHub via API** — possible for a private ops workflow, but awkward for a normal SaaS product; not the default.

**What Cursor is doing today vs what the app would do:**

| Today (manual) | Later (in-app) |
|---|---|
| You run Google AI Studio | App calls **Gemini API** from a backend/serverless function |
| You paste/save JSON into `data/phase1/...` via Cursor/repo | App writes JSON to **Blob / DB** |
| GitHub holds the files | Storage + thin DB hold versions; GitHub optional for backups |

**Important constraints to remember early:**

- Put the **Gemini API key only on the server** (Vercel env vars / serverless), never in the Vite frontend bundle.
- Prefer **async jobs** for full-book extraction (long-running); unit-by-unit is a better first product shape — same as now.
- The React app **reads** stored JSON over HTTP/API; it does not need the JSON baked into the Vite build (though shipping a few seed books in-repo is fine for demos).

**Short answer:** Possible without Cursor. App creates JSON via Gemini → saves to Blob/DB → Vercel only hosts the UI/API. Vercel ≠ permanent JSON hard drive.

---

## Open brainstorming entries

### 2026-10-05 — Schema gaps before more books

**Question:** Should we pause large-scale extraction and adjust schema 0.1 now that BH1, BE1-SB, BE2-SB, and RH2A (partial) have exposed recurring gaps?  
**Context:** Think Big / SEL reflection, Reach Higher Big Question, glossary definitions, and intermittent reading prompts are already logged as schema gaps.  
**Options:**
1. Continue extracting remaining books on schema 0.1; migrate later.
2. Run a focused cross-series schema review now; bump schema before more books.
3. Hybrid: lock a small additive schema patch for the highest-frequency gaps only, then continue.
**Lean / notes:** Pilot decision point in the registry already points toward review after representative RH2A extraction; Unit 4 still pending may delay a full review, but additive fields could be sketched now.  
**Status:** promoted — draft review written in [`../phase-1/cross-series-schema-review-notes.md`](../phase-1/cross-series-schema-review-notes.md) (2026-10-07); owner sign-off / 0.2 lock still open

---

### 2026-10-05 — book_id / folder naming consistency

**Question:** How should we normalize IDs such as `big_english_1_sb` (folder) vs `bep1_sb` / `bep_sb_2` (JSON)?  
**Context:** Mismatches will complicate canonical merge, registry joins, and future app views.  
**Options:**
1. Treat folder / registry IDs as canonical; rewrite internal JSON IDs at merge time.
2. Treat extracted `book_id` as canonical; rename folders/registry to match.
3. Keep both with an explicit alias map in the registry or a mapping file.
**Lean / notes:** Merge-time normalization is already noted as a follow-up; an alias map may be the lowest-risk interim step.  
**Status:** promoted — locked as **D007**; map in [`../phase-1/book_id_aliases.json`](../phase-1/book_id_aliases.json) + [`../phase-1/book-id-alias-map.md`](../phase-1/book-id-alias-map.md) (2026-10-07)

---

### 2026-10-05 — Canonical merge trigger

**Question:** When should unit batches be merged into a canonical book JSON?  
**Context:** BH1, BE1-SB, and BE2-SB are human-verified at batch level but still Phase 1 IN PROGRESS; no whole-book audit yet.  
**Options:**
1. Merge as soon as all planned unit batches exist and are human-verified.
2. Merge only after automated validation passes.
3. Merge after human verification, then run whole-book audit on the canonical file.
**Lean / notes:** Spec language suggests merge after validated/verified batches; automated validation has not been run yet.  
**Status:** open

---

### 2026-10-05 — Truncated / incomplete batch recovery

**Question:** What is the preferred recovery path for BE2 Unit 2 (missing pages/vocabulary/language)?  
**Context:** Unit 2 was re-extracted by project owner (2026-10-05): full batch restored (`My Games`, pages 20–35; pages/vocabulary/language populated). Truncation workaround cleared.  
**Options:**
1. Full unit re-extraction into a replacement batch file.
2. Targeted re-extraction of only missing arrays, then merge into the existing file.
3. Leave until canonical merge and rebuild Unit 2 entirely then.
**Lean / notes:** Option 1 applied successfully — full replacement batch verified and marked human-verified.  
**Status:** promoted to decision / closed (recovery done; formal decision log optional)

---

### 2026-10-05 — RH2A Unit 4 and pilot completion

**Question:** Can cross-series schema review start before RH2A Unit 4 exists?  
**Context:** Units 1–3 are human-verified; Unit 4 is blocked by an extraction restriction.  
**Options:**
1. Start schema review now using BH1 + BE1/BE2 + RH2A units 1–3.
2. Wait for Unit 4 so the RH2A representative book is complete.
3. Start a draft review now; finalize after Unit 4.
**Lean / notes:** Units 1–3 already expose distinctive RH structures (Big Question, glosses, intermittent prompts), so a draft review seems viable.  
**Status:** closed — RH2A Unit 4 verified; draft review includes U01–U04 evidence (2026-10-07)

---

### 2026-10-07 — Documentation audit: implementation-established but not locked

**Question:** Which practices from the built app should become LOCKED decisions vs remain operational habit?  
**Context:** Auth/catalog/Storage/Validation are live; extraction is manual Google AI Studio; Sheets is unused for pilot verification.  
**Options:**
1. Lock Validation UI + Storage as the Phase 1 verification surface (D00x).
2. Leave as documented practice in registry/progress until owner explicitly locks.
3. Also lock “manual AI Studio extraction until factory exists.”  
**Lean / notes:** Prefer option 2 for now — record in registry/progress/tech-stack; promote only if owner wants LOCKED permanence.  
**Status:** open

---

### 2026-10-07 — Project-wide naming conventions and migration policy

**Question:** What naming standard should govern new folders, files, code symbols, database/storage identifiers, and curriculum JSON so the project stops accumulating inconsistent abbreviations and casing?

**Context:** The repository already has several strong conventions, but they differ by layer:

- D007 locks catalog `book_id` as the Postgres / Storage / canonical-JSON identity while preserving legacy entity IDs.
- JSON and SQL primarily use `snake_case`; Storage series slugs and app feature folders use `kebab-case`.
- React components use `PascalCase`; hooks/functions use `camelCase`.
- Existing docs mix spaces, kebab-case, underscores, and uppercase operating names.
- Pilot extraction created inconsistent aliases/entity prefixes (`bep1_sb`, `bep_sb_2`, `bep1_*`, `bep2_*`, `rh_2a_*`).
- Some code names overload identity meaning (`bookId` can mean a UUID or catalog string), and safe cosmetic debt remains (`assests`, mixed acronym casing).

**Promoted 2026-10-07:** Owner accepted; locked as D009. Authority: [`../9-naming-conventions.md`](../9-naming-conventions.md). Always-on rule: `.cursor/rules/naming_conventions.mdc`.

#### Recommended authority / location

- Create **`docs/9-naming-conventions.md`** after acceptance.
- Keep it at the docs root because it applies across all phases, code, infrastructure, Storage, and curriculum data.
- Add an always-on Cursor rule at **`.cursor/rules/naming_conventions.mdc`** that summarizes the non-negotiable rules and links to the authority document.
- Lock the accepted standard as **D009**; do not create D009 before owner sign-off.

#### Proposed style matrix

| Scope | Proposed convention | Examples / notes |
|---|---|---|
| Multiword repository / feature folders | lowercase `kebab-case` | `project-tracking`, `curriculum-library`; keep conventional `src`, `lib`, `scripts`, `schemas` |
| New markdown docs | lowercase `kebab-case` | numbered root docs: `9-naming-conventions.md`; existing names audited later |
| React components / pages / types | `PascalCase` | `ValidationWorkspace`, `BookFileBatch` |
| Hooks / functions / variables | `camelCase` | `useTeacherAiResponses`, `catalogBookId` |
| Acronyms in code identifiers | treat as words | `TeacherAiAssistant`, `pdfUrl`, `bookId`; all-caps reserved for constants/env |
| Executable Node scripts | `snake_case.mjs` | `merge_canonical_book.mjs` |
| Node/TS service and library modules | established `camelCase` | `phase1Validation.mjs`, `validationService.ts` |
| Python files/packages | `snake_case` | ecosystem standard |
| SQL tables/columns/migration suffixes | `snake_case` | timestamp prefix remains `YYYYMMDDHHMMSS_...sql` |
| JSON keys / schema fields | `snake_case` | `book_id`, `continuous_text` |
| Constants / environment variables | `UPPER_SNAKE_CASE` | only public browser values use `VITE_*`; never prefix service-role secrets with `VITE_` |
| Storage bucket IDs / series slugs | lowercase `kebab-case` | `book-datasets`, `big-english`, `reach-higher` |
| Cursor rule filenames | `snake_case.mdc` | `naming_conventions.mdc` |
| Fixed Storage leaf names | stable lowercase names | `source.pdf`, `batches/unit_01.json`, `canonical/v1.json`, `cover.png` |

#### Identity vocabulary (do not interchange)

1. **Registry ID** — human/ops shorthand only: `BE1-SB`, `BH2`, `RH2B`.
2. **Catalog `book_id`** — technical join/path identity in Postgres, Storage, app routing, and canonical JSON; full-word `snake_case`.
3. **Series slug** — Storage path prefix in full-word `kebab-case`: `big-english`, `reach-higher`.
4. **Postgres UUID** — database row identity; code should call it `bookUuid`, not ambiguous `bookId`.
5. **Entity ID** — stable graph identity inside curriculum JSON; references must not be rewritten silently.

Recommended explicit code names: `registryId`, `catalogBookId`, and `bookUuid`. Avoid bare `bookId` wherever its meaning is not unambiguous.

#### Prospective catalog templates (preserve D007 identities)

- Beehive: `beehive_{level}_sb`
- Big English: `big_english_{level}_{sb|wb}`
- Reach Higher: `reach_higher_{level}`

Reach Higher intentionally omits `_sb` so future books remain consistent with locked `reach_higher_2a`. Do not create `reach_higher_2b_sb` while 2A remains `reach_higher_2a`.

Registry IDs remain display shorthand and never become Storage folder names.

#### Prospective entity IDs for newly extracted books

Use the full catalog `book_id` as the prefix. Do not introduce new `bep`, `be`, or `rh` abbreviations:

```text
{catalog_book_id}_unit_{NN}
{catalog_book_id}_page_{PPP}
{catalog_book_id}_vocab_{NNNN}
{catalog_book_id}_language_{NNNN}
{catalog_book_id}_activity_{NNNN}
{catalog_book_id}_text_{NNNN}
{catalog_book_id}_component_{NNNN}
{catalog_book_id}_relationship_{NNNN}
{catalog_book_id}_issue_{NNNN}
{catalog_book_id}_gap_{NNNN}
```

Use zero padding consistently. If a source requires more than one logical page record for the same printed page, retain the printed page in data and add a deterministic record suffix rather than creating a collision.

Batch/local extraction filename:

```text
{catalog_book_id}_unit_{NN}.json
```

Storage stays:

```text
{series_slug}/{catalog_book_id}/batches/unit_{NN}.json
{series_slug}/{catalog_book_id}/canonical/v{dataset_version}.json
{series_slug}/{catalog_book_id}/source.pdf
```

#### Legacy / backward-audit policy

- Grandfather all entity IDs, uploaded Storage keys, catalog IDs, and archival filenames for the four COMPLETE pilots.
- D007 forbids silent entity-ID rewrites. Aliases remain explicit compatibility data in [`../phase-1/book_id_aliases.json`](../phase-1/book_id_aliases.json), not preferred new names.
- Do not mass-rename before an inventory. Classify each finding as:
  1. safe cosmetic rename;
  2. mapper/alias cleanup;
  3. versioned migration required;
  4. accepted legacy exception.
- Safe candidates include docs links/casing, code symbol ambiguity, acronym casing, local asset naming, and the `assests` typo.
- Any canonical entity-ID migration needs a separate decision, old→new ID map, relationship rewrite, new dataset version, automated validation, and whole-book re-audit.

#### Proposed implementation after owner acceptance

1. Create `docs/9-naming-conventions.md` with scope, glossary, style matrix, approved abbreviations, book/JSON templates, legacy exceptions, and migration rules.
2. Add D009 and the concise always-on Cursor rule.
3. Update the extraction prompt, JSON schema guidance, Book ID Alias Map, and BE1-WB onboarding/profile to use the prospective standard.
4. Add lightweight naming checks for books marked with the new policy; legacy pilots remain exempt.
5. Run a read-only backward naming audit and propose risk-separated cleanup batches. No mass rename.

**Owner acceptance needed later:**

- approve `docs/9-naming-conventions.md` as the authority;
- approve prospective lowercase-kebab documentation filenames;
- approve full catalog IDs as new entity prefixes;
- approve per-series catalog templates, especially Reach Higher without `_sb`;
- approve the acronym-as-word code policy;
- approve grandfathering pilot entity IDs instead of rewriting them.

**Lean / notes:** Adopt the prospective standard before BE1-WB extraction. Preserve D007 pilot identities and handle backward cleanup separately by risk.

**Status:** promoted — locked as D009 (2026-10-07)

---

### 2026-10-08 — Cloudflare R2 PDF cutover open questions

**Question:** After locking D010 (R2 for textbook source PDFs), which integration details remain open before implementation?

**Context:** R2 account + private bucket `book-sources` exist with the intended folder layout; no PDFs uploaded yet. Live Validation still signs PDFs from Supabase Storage. Canonical/batch JSON and covers stay on Supabase for now. See [`../10-storage-architecture.md`](../10-storage-architecture.md).

**Options / open items:**
1. **R2 auth method** — S3-compatible access key pair vs Cloudflare API token / other; which is simplest for Node ops scripts + eventual server-side signing.
2. **Signed-URL surface** — Vercel serverless function, Cloudflare Worker, or other backend that never exposes secrets to Vite.
3. **`book_files` schema** — keep `bucket` + `storage_path` only (bucket name stays `book-sources`) vs add an explicit `storage_provider` / `storage_backend` column for dual-read during migration.
4. **Cutover strategy** — hard cut after Stage C pilot vs dual-read (try R2, fall back to Supabase) until Stage E verification.
5. **Canonical / batch JSON long-term home** — remain on Supabase `book-datasets`, move to R2 later, or another pattern (separate decision; not implied by D010).
6. **Cover images** — remain on Supabase `book-assets` vs eventual R2 (out of scope for PDF move).

**Lean / notes:** Prefer documenting Stage A credential choice before writing app code. Do not lock JSON or cover migration here. Do not delete Supabase PDFs until Stage E passes.

**Status:** partially promoted — D010 (provider/bucket/keys) + D011 (Vite `/api/sign-source-pdf` + R2-first dual-read). Still open: production Vercel/Worker surface; whether `book_files` needs an explicit provider column; JSON/covers long-term home; CORS admin on least-privilege token.

---

## Promoted / closed pointers

| Date | Topic | Outcome |
|---|---|---|
| 2026-10-05 | BE2 Unit 2 truncated batch | Full re-extraction replaced the file; pages/vocabulary/language restored; human-verified. |
| 2026-10-07 | Pilot extraction quality | Owner judgement: satisfactory to continue; Phase 1 still not COMPLETE (see Dataset Registry §14). |
| 2026-10-07 | BH1 U9–10 + RH2A U4 verification | Marked `verified` in `book_files`; registry human verification COMPLETE for BH1 and RH2A. |
| 2026-10-07 | First canonical merge (BE1-SB) | `canonical/v1.json` + `dataset_versions` v1; IDs preserved (`bep1_sb`); whole-book audit still open. |
| 2026-10-07 | Project-wide naming conventions | Promoted to [`../9-naming-conventions.md`](../9-naming-conventions.md); locked as D009; always-on rule `.cursor/rules/naming_conventions.mdc`. |
| 2026-10-08 | Textbook PDF object storage | Promoted to D010 — Cloudflare R2 `book-sources`; implementation staged in [`../10-storage-architecture.md`](../10-storage-architecture.md). |
| 2026-10-08 | BE1-WB U9 missing printed pp. 124–129 | Promoted to D013 — approve available PDF content with open `missing_source`; do not invent pages. Viewer printed↔PDF index mismatch parked as F015. |

---

## Parking lot

Ideas worth keeping but not actively exploring:

- Whether Google Sheets should return as a secondary verification surface (pilot uses React Validation).
- Whether workbook extraction should follow each SB immediately or wait until SB canonical datasets stabilize.
- Long-term automation of registry fields from batch metadata.
- Aligning seed `books.status = verified` with registry Phase 1 IN PROGRESS (docs clarified; data cleanup optional).
- Validation PDF page spinner vs printed page numbers when source PDF omits pages (F015).

---
