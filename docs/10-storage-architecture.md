# General Curriculum Mapper — Storage Architecture

**Status:** ACTIVE  
**Version:** 1.0  
**Date:** 2026-10-08  
**Purpose:** Describe how object storage is split across providers, what must stay private, and the staged plan to move textbook source PDFs to Cloudflare R2 — without changing Phase 1 curriculum data models.

**Related:** [`2-tech-stack.md`](./2-tech-stack.md) · [`8-database-architecture.md`](./8-database-architecture.md) · [`4-decisions.md`](./4-decisions.md) (D005, D006, D010) · [`9-naming-conventions.md`](./9-naming-conventions.md)

---

## 1. Scope

This document covers **binary object storage** (PDFs, dataset JSON files, cover images) and how the app will access those objects.

It does **not** redesign:

- Phase 1 JSON schema or extraction workflow;
- verified pilot completion status;
- curriculum mapping phases;
- teacher enrichment philosophy;
- Supabase Auth or PostgreSQL catalog responsibilities.

**Documentation-only status (2026-10-08):** Cloudflare R2 has been selected for textbook source PDFs and a private bucket named `book-sources` exists with the intended logical folder layout. **No PDF upload, app integration, or Supabase Storage retirement has been executed yet.** Follow Stages A–E below before changing runtime code.

---

## 2. Intended provider responsibilities

| Responsibility | Provider | Notes |
|---|---|---|
| Textbook **source PDFs** | **Cloudflare R2** (private bucket `book-sources`) | Selected destination; migration not started |
| Unit-batch + **canonical JSON** datasets | **Supabase Storage** (`book-datasets`) until a separate decision | Do **not** auto-migrate JSON to R2 |
| Series/book **cover images** | **Supabase Storage** (`book-assets`) until reassessed | Unrelated to PDF move |
| Catalog / file pointers / dataset versions | **Supabase PostgreSQL** | `book_files.bucket` + `storage_path` remain the operational pointers |
| Authentication & roles | **Supabase Auth** + `profiles` | Unchanged |
| Curriculum evidence content | **Phase 1 JSON** (JSON-first) | Unchanged |

### Logical object-key structure (preserve)

R2 `book-sources` should reuse the same keys already used in Supabase Storage:

```text
{series-slug}/{catalog_book_id}/source.pdf
```

Examples (pilot):

```text
beehive/beehive_1_sb/source.pdf
big-english/big_english_1_sb/source.pdf
big-english/big_english_2_sb/source.pdf
reach-higher/reach_higher_2a/source.pdf
```

Postgres `book_files` rows for `file_type = source_pdf` already store bucket name `book-sources` and these paths. Prefer keeping **bucket id + object key** stable across the provider cutover so catalog rows need minimal or no path rewrite.

---

## 3. Current runtime (as of documentation)

Until Stage D lands, the live app still uses **Supabase Storage** for PDFs:

| Concern | Current behaviour |
|---|---|
| Upload | `scripts/upload_source_pdfs.mjs` → Supabase `book-sources` (service role) |
| Catalog | `book_files` (`file_type = source_pdf`, `bucket`, `storage_path`) |
| Validation PDF view | `validationService.createSignedPdfUrl` → Supabase `createSignedUrl` (~15 min TTL) |
| JSON download | `validationService.downloadJson` → Supabase `book-datasets` |
| Covers | `coverImageService` → Supabase `book-assets` signed URLs |

**Affected dependencies when PDFs move to R2:**

- Validation PDF signing / retrieval path
- Source PDF upload scripts
- Any RLS / Storage policies that only cover Supabase `book-sources`
- Environment configuration (new R2 credentials; never `VITE_`-prefixed secrets)
- Possibly a storage adapter so business logic is not hard-wired to one SDK

**Not automatically in scope for the PDF move:**

- `book-datasets` merge/audit/validate scripts
- Cover upload scripts
- Auth, catalog queries, dataset versioning

---

## 4. Application access principles

1. **Server-side only for secrets.** Cloudflare R2 access keys / API tokens must never ship in the Vite frontend bundle.
2. **Prefer a storage abstraction** (adapter interface for upload / download / signed URL) so Validation and ops scripts call one contract while providers can differ by file class.
3. **Private by default.** No public R2 bucket access without an explicit locked decision.
4. **Short-lived signed URLs** (or equivalent) for browser PDF viewing. Treat signed URLs as ephemeral access tokens — **not** permanent source identifiers. Canonical references remain `bucket` + `storage_path` (and later, if needed, an explicit provider field — see open questions).
5. **Do not delete or overwrite** existing Supabase PDF objects during initial connectivity or pilot tests.

Exact signing surface (Vercel serverless, Cloudflare Worker, or other) is **not locked** — see brainstorming.

---

## 5. Security requirements

- Never commit Cloudflare API tokens, access keys, or secret keys.
- Store credentials in environment variables or a secrets manager (local: `.env.local` / host secrets; never commit).
- Keep the R2 `book-sources` bucket **private**.
- Use **least-privilege** credentials (object read/write limited to the required bucket/prefix).
- Do not introduce public bucket access without an explicit decision in [`4-decisions.md`](./4-decisions.md).
- Do not delete or overwrite existing Supabase Storage files during Stages A–C.
- Do not persist temporary signed URLs as the long-term identity of a source file.

Suggested env names (illustrative; finalize during Stage A — use `UPPER_SNAKE_CASE`, never `VITE_*` for secrets):

```text
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_BOOK_SOURCES=book-sources
R2_ENDPOINT   # S3-compatible endpoint when using S3 API
```

---

## 6. Staged implementation checklist (do not execute in this documentation pass)

### Stage A — Cloudflare setup

- [ ] Verify R2 account and private bucket `book-sources`
- [ ] Confirm intended object-key prefixes match existing Supabase layout
- [ ] Select authentication method (S3-compatible access keys vs other Cloudflare auth — open question)
- [ ] Configure credentials securely (local + eventual host secrets)
- [ ] Establish CLI and/or S3-compatible API access for ops scripts

### Stage B — Connectivity testing

- [ ] Verify bucket list/access with configured credentials
- [ ] Upload a small non-curriculum test object
- [ ] Retrieve and verify the object
- [ ] Delete the test object
- [ ] Confirm permissions are least-privilege and bucket remains private

### Stage C — PDF pilot

- [ ] Select one existing pilot source PDF (prefer a known-good Supabase object, e.g. Beehive 1)
- [ ] Upload to R2 using the **same** logical object key
- [ ] Verify size, integrity, and retrieval
- [ ] Confirm access from the intended server-side / app environment (still without retiring Supabase)

### Stage D — Application integration

- [ ] Introduce or update a storage adapter (PDF operations → R2; leave JSON/covers on Supabase unless decided otherwise)
- [ ] Replace relevant Supabase Storage **PDF** calls (Validation signed URL / download; upload script)
- [ ] Preserve Auth, Postgres, `book-datasets`, and `book-assets` behaviour
- [ ] Update environment configuration and docs
- [ ] Test upload, retrieval, signed access, and error handling
- [ ] Dual-read / feature flag strategy if needed during cutover (open question)

### Stage E — Migration and validation

- [ ] Inventory existing Supabase `book-sources` PDF objects
- [ ] Migrate in controlled batches (same keys)
- [ ] Verify object counts, paths, sizes/checksums
- [ ] Confirm Validation and ops scripts against R2
- [ ] Retire or freeze Supabase `book-sources` **only after** successful verification
- [ ] Update Dataset Registry / ops notes that PDFs are R2-backed

---

## 7. JSON and other objects (explicit non-goals for this change)

- Canonical and batch JSON remain on Supabase Storage (`book-datasets`) for now.
- Whether JSON later moves to R2, stays on Supabase, or uses another pattern is an **open question** — record options in [`project-tracking/2-internal-brainstorming.md`](./project-tracking/2-internal-brainstorming.md), not as a locked decision.
- Cover assets remain on Supabase Storage (`book-assets`) unless separately decided.

---

## 8. Relationship to hybrid architecture (D006)

D006 remains the hybrid rule: **Postgres metadata + object files + JSON curriculum content**.

D010 refines **only** the object-storage provider for textbook source PDFs (Cloudflare R2). It does not remove Supabase, does not move curriculum entities into relational tables, and does not change Phase 1 schema.

---

## 9. Change log

| Date | Change |
|---|---|
| 2026-10-08 | Created; documented R2 PDF target, security rules, and Stages A–E (docs-only; no migration executed). |
