# General Curriculum Mapper — Storage Architecture

**Status:** ACTIVE  
**Version:** 1.2  
**Date:** 2026-10-08  
**Purpose:** Describe how object storage is split across providers, what must stay private, and the staged plan to move textbook source PDFs to Cloudflare R2 — without changing Phase 1 curriculum data models.

**Related:** [`2-tech-stack.md`](./2-tech-stack.md) · [`8-database-architecture.md`](./8-database-architecture.md) · [`4-decisions.md`](./4-decisions.md) (D005, D006, D010, D011, D012) · [`9-naming-conventions.md`](./9-naming-conventions.md)

---

## 1. Scope

This document covers **binary object storage** (PDFs, dataset JSON files, cover images) and how the app will access those objects.

It does **not** redesign:

- Phase 1 JSON schema or extraction workflow;
- verified pilot completion status;
- curriculum mapping phases;
- teacher enrichment philosophy;
- Supabase Auth or PostgreSQL catalog responsibilities.

**Runtime status (2026-10-08):** Stages A–E complete for in-scope cataloged source PDFs. **D012:** Validation serves PDFs **R2-only** via same-origin proxy; dual-read removed. Supabase `book-sources` originals remain on disk unused (not deleted). JSON datasets and covers stay on Supabase.

---

## 2. Intended provider responsibilities

| Responsibility | Provider | Notes |
|---|---|---|
| Textbook **source PDFs** | **Cloudflare R2** (private bucket `book-sources`) | D012: R2-only upload + Validation; Supabase originals frozen unused |
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

## 3. Current runtime (as of D012)

| Concern | Current behaviour |
|---|---|
| PDF primary store | Cloudflare R2 `book-sources` (identical object keys) |
| PDF fallback | **None** (D012) — R2 miss/unavailable surfaces as Validation error |
| Catalog | `book_files` (`file_type = source_pdf`, `bucket`, `storage_path`) — unchanged |
| Validation PDF view | R2-only via same-origin `POST /api/source-pdf-content` (+ optional `/api/sign-source-pdf`); badge `via r2` |
| Ops upload (local) | `scripts/upload_source_pdfs.mjs` → R2 PutObject + Postgres `book_files` upsert |
| Supabase `book-sources` | Existing pilot PDF objects left in place unused (not deleted) |
| JSON download | `validationService.downloadJson` → Supabase `book-datasets` |
| Covers | `coverImageService` → Supabase `book-assets` signed URLs |

**Out of scope for the PDF move (unchanged):**

- `book-datasets` merge/audit/validate scripts
- Cover upload scripts
- Auth, catalog queries, dataset versioning
- Physical deletion/emptying of unused Supabase `book-sources` objects (parked F014)

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

Local env names (root `.env.local`, gitignored — use `UPPER_SNAKE_CASE`, never `VITE_*` for secrets):

```text
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME=book-sources
R2_ENDPOINT   # optional; default https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com
```

Ops connectivity test (Stage B): `node scripts/test_r2_connection.mjs`  
Vendor SDK install (gitignored): `npm install --prefix scripts/.r2-tools @aws-sdk/client-s3`

---

## 6. Staged implementation checklist (do not execute in this documentation pass)

### Stage A — Cloudflare setup

- [x] Verify R2 account and private bucket `book-sources` (owner-confirmed 2026-10-08)
- [x] Confirm intended object-key prefixes match existing Supabase layout (documented)
- [x] Select authentication method: **S3-compatible R2 API tokens** (Object Read & Write on `book-sources`)
- [x] Configure credentials securely (owner-created; local values belong in root `.env.local` only)
- [x] Establish CLI and/or S3-compatible API access for ops scripts (`scripts/test_r2_connection.mjs` + gitignored `scripts/.r2-tools`)

### Stage B — Connectivity testing

- [x] Verify bucket list/access with configured credentials (2026-10-08 — `scripts/test_r2_connection.mjs`)
- [x] Upload a small non-curriculum test object under `_connection-tests/`
- [x] Retrieve and verify the object (SHA-256)
- [x] Delete the test object (verified absent after delete)
- [x] Anonymous S3-endpoint GET heuristic: not publicly readable (400/401/403/404)
- [ ] Confirm API token bucket scope in Cloudflare dashboard (Object Read & Write limited to `book-sources` — not provable via S3 API alone)

**Stage B result:** PASS (2026-10-08). No textbook PDFs migrated; existing prefix placeholders under series folders were listed only and not modified. Script accepts either a bare account id or a full `https://…r2.cloudflarestorage.com` value in `R2_ACCOUNT_ID`.

### Stage C — PDF pilot

- [x] Select one existing pilot source PDF: **Beehive 1 Student Book** (`beehive_1_sb`)
- [x] Upload to R2 using the **same** logical object key verified from `book_files`
- [x] Verify size, integrity, and retrieval (byte-for-byte SHA-256 match)
- [x] Confirm access from the intended **application** environment (Stage D — Validation R2-first dual-read)

**Stage C result:** PASS (2026-10-08) via `scripts/migrate_pilot_pdf_to_r2.mjs`

| Field | Value |
|---|---|
| Pilot | Beehive 1 Student Book (`beehive_1_sb`) |
| Verified object key | `beehive/beehive_1_sb/source.pdf` |
| Source | Supabase Storage `book-sources` |
| Destination | Cloudflare R2 `book-sources` |
| Size | 12,133,731 bytes |
| SHA-256 (both) | `9005ef26c53283ec0146b06ad9896b9c9d2fbc2dc731c11c44ac14ec3c5053e3` |
| Integrity | PASS (identical) |
| Supabase original | Preserved (not deleted) |
| App cutover | Not done (still Supabase) |

**Path note:** The brief’s `beehive/beehive/beehive_1_sb/…` key is **incorrect**. Catalog, seed SQL, and upload scripts use `{series-slug}/{catalog_book_id}/source.pdf` → `beehive/beehive_1_sb/source.pdf`. The repeated `beehive` tokens are series slug + book id prefix (`beehive_1_sb`), not a duplicated folder segment. Path-generation logic was not changed.

### Stage D — Application integration

- [x] Shared R2 signer + Vite middleware `POST /api/sign-source-pdf` (JWT + catalog `bookFileId` authorization)
- [x] Validation `createSignedPdfUrl` R2-first dual-read (D011); JSON/covers unchanged on Supabase
- [x] Preserve Auth, Postgres, `book-datasets`, and `book-assets` behaviour
- [x] Environment / docs updated; provider badge + console log show `r2` vs `supabase`
- [x] Smoke: Beehive 1 R2 sign PASS; Big English 1 expected `not_found` (Supabase fallback)
- [ ] Bucket CORS for localhost PDF.js — set in Cloudflare dashboard if Object Read/Write token lacks CORS admin (`scripts/configure_r2_cors.mjs` AccessDenied)

**Stage D result:** PASS (2026-10-08) with dual-read. Fallback rules: R2 `not_found` / unavailable → Supabase; R2 or catalog `401`/`403` → visible error (no silent fallback). Supabase PDF originals preserved.

**Browser delivery:** Validation loads R2 PDFs via same-origin `POST /api/source-pdf-content` (blob URL for PDF.js), not a cross-origin R2 signed URL. This avoids requiring bucket CORS when the Object Read/Write token cannot call PutBucketCors. Presigned `/api/sign-source-pdf` remains available for non-browser clients.

### Stage E — Migration and validation

- [x] Inventory existing Supabase `book-sources` PDF objects (catalog + Storage list)
- [x] Migrate remaining PDFs with identical keys (`scripts/migrate_source_pdfs_to_r2.mjs`)
- [x] Verify object counts, paths, sizes/SHA-256
- [x] Confirm R2 retrieval via Stage D `getSourcePdfObject` smoke (`scripts/smoke_sign_source_pdf.mjs`)
- [x] Freeze Supabase `book-sources` usage — **D012** (stop reading/writing; dual-read removed; originals not deleted)
- [x] Update Dataset Registry / ops notes that PDFs are R2-backed

**Stage E result:** PASS (2026-10-08) for all **4** cataloged `source_pdf` rows.

| Book ID | Object key | Supabase | R2 | SHA-256 match | Status |
|---|---|---|---|---|---|
| `beehive_1_sb` | `beehive/beehive_1_sb/source.pdf` | present | present | PASS | already migrated (Stage C) |
| `big_english_1_sb` | `big-english/big_english_1_sb/source.pdf` | present | present | PASS | newly migrated |
| `big_english_2_sb` | `big-english/big_english_2_sb/source.pdf` | present | present | PASS | newly migrated |
| `reach_higher_2a` | `reach-higher/reach_higher_2a/source.pdf` | present | present | PASS | newly migrated |

| Metric | Count |
|---|---:|
| Total cataloged source PDFs | 4 |
| Newly migrated | 3 |
| Previously migrated + re-verified | 1 |
| Missing sources / conflicts / failed transfers | 0 |
| Uncataloged PDF objects | 0 |

SHA-256 values (identical on Supabase and R2):

| Book ID | Size (bytes) | SHA-256 |
|---|---:|---|
| `beehive_1_sb` | 12,133,731 | `9005ef26c53283ec0146b06ad9896b9c9d2fbc2dc731c11c44ac14ec3c5053e3` |
| `big_english_1_sb` | 18,406,281 | `4b0b0f169b59e4251a6c2b198ad57022cc3e9cbd615b43a95921b23c056c0699` |
| `big_english_2_sb` | 18,541,226 | `84da7b1ad417351459151ce4a10b146043c2ecafb30ed3bc827a62f3d1c17c98` |
| `reach_higher_2a` | 27,671,806 | `038437d1b23a66d83e443bbd6609cbc1da72221e438064945f0f3679270e29b3` |

**App verification:** server-side R2 proxy-get PASS for all four. Browser Validation console (owner-confirmed 2026-10-08): `provider=r2 delivery=proxy` for `beehive_1_sb`, `big_english_1_sb`, `big_english_2_sb`, and `reach_higher_2a`. JSON/covers remain on Supabase; Auth + catalog authorization unchanged. Scalability of the same-origin proxy for larger apps is parked as F013 in [`7-future.md`](./7-future.md).

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
| 2026-10-08 | Stage B PASS via `scripts/test_r2_connection.mjs` (list / put / get+SHA-256 / delete under `_connection-tests/`). |
| 2026-10-08 | Stage C PASS — Beehive 1 PDF copied Supabase→R2 at `beehive/beehive_1_sb/source.pdf` (SHA-256 match; Supabase preserved). |
| 2026-10-08 | Stage D PASS — Validation PDF via `/api/sign-source-pdf` (R2-first dual-read, D011); CORS may need dashboard if token lacks CORS permission. |
| 2026-10-08 | Validation R2 delivery switched to same-origin `/api/source-pdf-content` proxy (fixes PDF.js CORS without bucket CORS admin). |
| 2026-10-08 | Stage E PASS — all 4 cataloged pilot source PDFs on R2 with SHA-256 match; Supabase originals + dual-read fallback retained; `scripts/migrate_source_pdfs_to_r2.mjs`. |
| 2026-10-08 | D012 — R2-only PDFs: dual-read removed; `upload_source_pdfs.mjs` targets R2; Supabase `book-sources` objects left unused. |
