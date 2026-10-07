# General Curriculum Mapper — Database Architecture

**Status:** ACTIVE  
**Version:** 1.0  
**Purpose:** Explain the hybrid storage prototype: what lives in PostgreSQL, what lives in Supabase Storage, what remains in canonical JSON, and which layer is authoritative.

---

## 1. Core rule

> **Canonical curriculum content stays in JSON. PostgreSQL holds stable operational metadata. Storage holds the files.**

Do not convert Phase 1 curriculum entities (units, pages, vocabulary, language, activities, continuous text, curriculum components, relationships, extraction issues, schema gaps, in-JSON verification) into relational tables.

Different publishers and series differ, and schema `0.1` is still evolving. Premature normalization would force constant migrations.

---

## 2. Layer responsibilities

| Layer | Holds | Authoritative for |
|---|---|---|
| **Canonical JSON** | Full structured curriculum evidence for a book (or unit batch) | What the curriculum contains |
| **Supabase Storage** | Source PDFs, batch JSON, canonical JSON blobs | The binary/file bytes |
| **PostgreSQL (Supabase)** | Series, books, file pointers, dataset versions, app profiles | Catalog identity, versioning, processing status, auth profiles |

### Canonical JSON (authoritative curriculum)

- Lives as objects in the private `book-datasets` Storage bucket (authoritative file bytes).
- Optional local working copies may exist under `data/phase1/…` (gitignored; not committed).
- Linked from Postgres via `book_files` + `dataset_versions.json_file_id`.
- Schema defined in `docs/phase-1/JSON_Schema.md`.

### Supabase Storage (authoritative file bytes)

Private buckets (copyrighted PDFs must not be public):

| Bucket | Purpose | Example path |
|---|---|---|
| `book-sources` | Source PDFs | `{series-slug}/{book_id}/source.pdf` |
| `book-datasets` | Batch + canonical JSON | `{series-slug}/{book_id}/batches/unit_01.json` or `…/canonical/v1.json` |
| `book-assets` | Series/book cover imagery | `series/beehive_book_series.png` |

Store **bucket + `storage_path`** in Postgres. Generate signed/authenticated URLs at read time. Do not store permanent public URLs as the canonical reference.

### PostgreSQL (authoritative catalog / ops metadata)

Tables introduced by `supabase/migrations/20261007120000_create_curriculum_catalog.sql`:

```text
book_series
  → books
      → book_files
      → dataset_versions → book_files (canonical JSON pointer)
```

| Table | Role |
|---|---|
| `book_series` | Series name / publisher / description |
| `books` | Stable `book_id`, title, level, type, language, operational `status` |
| `book_files` | File-type + Storage location for PDFs / JSON; optional `label` (e.g. Unit 1) and per-file `status` |
| `dataset_versions` | Per-book dataset revision (`version`) vs JSON schema (`schema_version`), current flag, verification timestamp |

Also: `profiles` (Auth) from the earlier profiles migration — not curriculum data.

---

## 3. Important distinctions

- **`books.book_id`** (text) — project-level identifier shared with Phase 1 JSON / registry (e.g. `big_english_1_sb`).
- **`books.id`** (UUID) — Postgres primary key used by FKs.
- **`dataset_versions.version`** — revision of that book’s dataset (1, 2, 3…).
- **`dataset_versions.schema_version`** — Phase 1 JSON schema version (e.g. `0.1`). These are separate.

At most one `dataset_versions` row per book may have `is_current = true`.

For the feasibility prototype, books may have many `batch_json` rows (unit batches) and **no** `dataset_versions` until a canonical merge exists.

Distinction:

- `books.status` — coarse Postgres book workflow (`registered` → `extracted` → `verified` → …). **Do not treat this alone as Phase 1 COMPLETE** (registry criteria also require canonical merge + whole-book audit). Seed rows may say `verified` while registry Phase 1 remains `IN PROGRESS`.
- `book_files.status` — individual file/batch workflow (`pending` / `needs_review` / `verified`); this is what Validation writes.
- `book_files.label` — display-only label (e.g. `Unit 1`); not a relational unit model
- Dataset Registry (`docs/phase-1/Dataset_registry.md`) — authoritative operational Phase 1 status for humans/AI sessions

---

## 4. RLS (prototype)

Simplest safe configuration for this stage:

- Authenticated users: **SELECT** catalog tables and Storage objects in the curriculum buckets.
- Authenticated **writes** (tables + Storage objects): **admin** only (`profiles.role = 'admin'`).
- Service role (server/dashboard): bypasses RLS for seeding and ops.

This is not a full multi-tenant permissions system. Expand later when product roles require it.

---

## 5. What we deliberately did not build

- Relational tables for curriculum entities inside the JSON
- Speculative SaaS tables (orgs, schools, jobs, analytics)
- Public Storage buckets for source PDFs
- Automatic continuous sync of local `data/phase1` into Storage (manual upload scripts exist instead)

Upload tooling (service role): `scripts/upload_pilot_batches.mjs`, `scripts/upload_source_pdfs.mjs`, `scripts/upload_series_covers.mjs`, `scripts/upload_book_covers.mjs`.

---

## 6. Apply migrations

See the full ordered list in [`supabase/README.md`](../supabase/README.md). Core catalog + Storage policies start at:

```text
supabase/migrations/20261007120000_create_curriculum_catalog.sql
```

Later migrations add `label`/`status`, pilot seeds, cover paths, source PDF pointers, and Beehive Units 9–10 batch pointers.

Apply with Dashboard SQL editor, or `supabase link` + `supabase db push`.
---

## 7. Related docs

- [`2-tech-stack.md`](./2-tech-stack.md) — locked stack
- [`3-architecture.md`](./3-architecture.md) — phase architecture
- [`4-DECISIONS.md`](./4-DECISIONS.md) — D005 Supabase, D006 hybrid storage
- [`phase-1/JSON_Schema.md`](./phase-1/JSON_Schema.md) — curriculum JSON schema
- [`phase-1/Dataset_registry.md`](./phase-1/Dataset_registry.md) — operational book status
