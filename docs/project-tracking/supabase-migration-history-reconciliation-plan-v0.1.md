# Supabase Migration-History Reconciliation Plan v0.1

**Status:** HISTORY REPAIR COMPLETE / GRAMMAR STILL UNAPPLIED
**Version:** 0.1
**Date:** 2026-10-30
**Project:** `kivvmobjphtcgxoltqbc` (`zap_curriculum_mapper`)
**CLI:** ephemeral pinned `npx.cmd supabase@2.122.0`
**Authority:** Owner-authorized **history-only** `migration repair --status applied --linked` for exactly 20 versions (seven batches). Does **not** authorize migration SQL execution, Grammar apply, non-dry-run `db push`, `--include-all`, `--status reverted`, grant/RLS/security changes, Storage mutation, staging, commit, or push.

---

## 0. Execution outcome (2026-10-30)

### Preflight (all passed before any repair)

| Check | Result |
|---|---|
| HEAD | `b1953cdf513562ed86badd09bb62058787adf581` |
| Untracked paths | Exactly four: Grammar Step B plan, Grammar migration, Grammar test, this reconciliation plan |
| Migration matrix | **21** remote-empty / **2** recorded (Story + LiA) / **0** remote-only |
| Live NLL totals | `3 / 23 / 23 / 5` |
| Grammar | key / UUID `…000004` / link / memberships / summaries **absent** |
| CLI | `npx.cmd supabase@2.122.0` |
| Linked project | `kivvmobjphtcgxoltqbc` |

### Authorized operation only

```powershell
npx.cmd supabase@2.122.0 migration repair <version> --status applied --linked
```

Each command returned JSON equivalent to:

```json
{"versions":["<version>"],"status":"applied","repairAll":false,"message":"Migration history repaired"}
```

Human stderr always included `Initialising login role...`, `Connecting to remote database...`, and `Repaired migration history: [<version>] => applied`. **No migration SQL was executed.**

### Batch results

| Batch | Versions repaired | After: recorded / empty | Empty remaining | NLL / invariants |
|---|---|---|---|---|
| 1 — profiles | `20261006120000` | **3 / 20** | 19 catalog/foundation + Opener + Grammar | `3/23/23/5`; Grammar absent |
| 2 — catalog schema | `20261007120000` | **4 / 19** | … | catalog accessible; NLL unchanged |
| 3 — label/status | `20261007130000` | **5 / 18** | … | NLL unchanged |
| 4 — assets/covers | `20261007140000`, `20261007150000` | **7 / 16** | … | buckets `book-sources` / `book-datasets` / `book-assets` present; NLL unchanged |
| 5 — pilot/BE1 seeds | `20261007131000`, `20261007160000`, `20261007170000`, `20261007180000`, `20261007190000` | **12 / 11** | 9 BE seeds + Opener + Grammar | catalog counts stable; buckets present; NLL unchanged |
| 6 — Big English seeds | `20261008120000` … `20261009160000` (9 versions) | **21 / 2** | Opener + Grammar only | catalog counts stable; NLL unchanged |
| 7 — Opener | `20261029120000` | **22 / 1** | Grammar only | Opener identity exact; NLL `3/23/23/5`; Grammar still absent |

### Exact repair commands executed (sequential)

```powershell
# Batch 1
npx.cmd supabase@2.122.0 migration repair 20261006120000 --status applied --linked

# Batch 2
npx.cmd supabase@2.122.0 migration repair 20261007120000 --status applied --linked

# Batch 3
npx.cmd supabase@2.122.0 migration repair 20261007130000 --status applied --linked

# Batch 4
npx.cmd supabase@2.122.0 migration repair 20261007140000 --status applied --linked
npx.cmd supabase@2.122.0 migration repair 20261007150000 --status applied --linked

# Batch 5
npx.cmd supabase@2.122.0 migration repair 20261007131000 --status applied --linked
npx.cmd supabase@2.122.0 migration repair 20261007160000 --status applied --linked
npx.cmd supabase@2.122.0 migration repair 20261007170000 --status applied --linked
npx.cmd supabase@2.122.0 migration repair 20261007180000 --status applied --linked
npx.cmd supabase@2.122.0 migration repair 20261007190000 --status applied --linked

# Batch 6
npx.cmd supabase@2.122.0 migration repair 20261008120000 --status applied --linked
npx.cmd supabase@2.122.0 migration repair 20261008130000 --status applied --linked
npx.cmd supabase@2.122.0 migration repair 20261008140000 --status applied --linked
npx.cmd supabase@2.122.0 migration repair 20261009100000 --status applied --linked
npx.cmd supabase@2.122.0 migration repair 20261009110000 --status applied --linked
npx.cmd supabase@2.122.0 migration repair 20261009120000 --status applied --linked
npx.cmd supabase@2.122.0 migration repair 20261009140000 --status applied --linked
npx.cmd supabase@2.122.0 migration repair 20261009150000 --status applied --linked
npx.cmd supabase@2.122.0 migration repair 20261009160000 --status applied --linked

# Batch 7 (after Opener live reconfirm)
npx.cmd supabase@2.122.0 migration repair 20261029120000 --status applied --linked
```

**Not repaired (by design):** Story `20261029180000`, LiA `20261029213000` (already recorded); Grammar `20261030160000` (intentionally pending).

### Final migration matrix

| Count | State |
|---|---|
| **22** | recorded remotely (20 repaired + Story + LiA) |
| **1** | local-only / remote-empty: Grammar `20261030160000` |
| **0** | remote-only |

### Final dry-run

```powershell
npx.cmd supabase@2.122.0 db push --linked --dry-run
```

**Exit code:** `0`

**JSON stdout (normalized):**

```json
{
  "upToDate": false,
  "dryRun": true,
  "migrations": ["20261030160000_seed_nll_be3_u08_grammar.sql"],
  "seeds": [],
  "roles": [],
  "message": "Finished supabase db push."
}
```

**Human stderr excerpt:**

```text
Initialising login role...
DRY RUN: migrations will *not* be pushed to the database.
Connecting to remote database...
Would push these migrations:
  20261030160000_seed_nll_be3_u08_grammar.sql
```

Success criteria met: dry-run completed; listed **exactly** Grammar; no seeds, roles, unrelated migrations, or `--include-all`. **Non-dry-run push was not run.**

### Post-repair live invariants (unchanged)

| Invariant | Value |
|---|---|
| NLL totals | `3 / 23 / 23 / 5` |
| Opener | UUID `…000001`, key `be3-u08-opener`, draft; 9 memb; 9 summaries; 2 proposed SS links (Vocabulary / Structures) |
| Story / LiA | identities unchanged; still remote-recorded |
| Grammar | key / UUID `…000004` / memberships / summaries / Structures link **absent** |
| Catalog | `book_series` 3 / `books` 14 / `book_files` 150 / `dataset_versions` 14 |
| Storage buckets | `book-assets`, `book-datasets`, `book-sources` (all present) |
| Application schema/rows/policies | **no change** from history repair (metadata only) |

### CLI login-role behavior

Every linked `migration repair` and the final dry-run logged `Initialising login role...` then connected with the existing authenticated CLI session. No DB password was prompted in NonInteractive shell; no credentials were written to the repository.

### Grant supersets (unchanged; separately gated)

Pre-repair schema proof documented that live `authenticated` grants on `profiles`, catalog tables, and NLL tables are **broader** than some migration texts for `TRUNCATE` / `REFERENCES` / `TRIGGER` (and in some cases extra row DML grants gated by RLS). History repair did **not** alter grants, RLS, policies, or security hardening. Those supersets remain **acknowledged and separately gated** — not part of this reconciliation.

### Grammar

`20261030160000` remains **unapplied** and **unrepaired**. Apply remains a separate owner gate.

---

## 1. Original problem and hard boundaries

### Problem (pre-repair)

`migration list --linked` showed **history divergence**:

- **21** local versions remote-empty (nineteen catalog/foundation through `20261009160000`, plus Opener `20261029120000`, plus Grammar `20261030160000`).
- **2** aligned: Story `20261029180000`, LiA `20261029213000`.
- **0** remote-only.
- Live NLL already reflected Opener + Story + LiA (`3 / 23 / 23 / 5`), so an ordinary linked `db push` was unsafe for a Grammar-only apply.

### Hard boundaries (honored during repair)

- Repair = history metadata only (`--status applied`); **no** migration SQL execution.
- Grammar remained pending.
- No `--include-all`, non-dry-run push, revert, pull, fetch, reset, squash, or down.
- No grant/RLS/security-hardening changes.
- No application, config, dependency, canonical, or tracker changes beyond this document.

### Evidence sources

| Source | Used |
|---|---|
| Local `supabase/migrations/*.sql` | Yes |
| `migration list --linked` before/after each batch | Yes |
| Supabase JS service-role read-only selects/counts | Yes |
| Storage `listBuckets` (metadata) | Yes |
| Linked read-only `db query` schema proof (earlier same day) | Yes — §5–§6 |
| `db push --linked --dry-run` after final matrix | Yes — Grammar only |

---

## 2. Authoritative local/remote migration matrix (FINAL)

Captured via `migration list --linked` after Batch 7 against `kivvmobjphtcgxoltqbc`.

| Version | Filename | Remote history |
|---|---|---|
| `20261006120000` | `create_profiles.sql` | **recorded** (repaired Batch 1) |
| `20261007120000` | `create_curriculum_catalog.sql` | **recorded** (repaired Batch 2) |
| `20261007130000` | `book_files_label_status.sql` | **recorded** (repaired Batch 3) |
| `20261007131000` | `seed_pilot_catalog.sql` | **recorded** (repaired Batch 5) |
| `20261007140000` | `book_assets_and_series_covers.sql` | **recorded** (repaired Batch 4) |
| `20261007150000` | `books_cover_path.sql` | **recorded** (repaired Batch 4) |
| `20261007160000` | `seed_source_pdf_book_files.sql` | **recorded** (repaired Batch 5) |
| `20261007170000` | `seed_beehive_1_units_09_10.sql` | **recorded** (repaired Batch 5) |
| `20261007180000` | `verify_bh1_u09_u10_rh2a.sql` | **recorded** (repaired Batch 5) |
| `20261007190000` | `seed_be1_canonical_v1.sql` | **recorded** (repaired Batch 5) |
| `20261008120000` | `seed_big_english_1_wb.sql` | **recorded** (repaired Batch 6) |
| `20261008130000` | `seed_big_english_2_wb.sql` | **recorded** (repaired Batch 6) |
| `20261008140000` | `seed_big_english_2_wb_batches.sql` | **recorded** (repaired Batch 6) |
| `20261009100000` | `seed_big_english_3_sb.sql` | **recorded** (repaired Batch 6) |
| `20261009110000` | `seed_big_english_3_sb_batches.sql` | **recorded** (repaired Batch 6) |
| `20261009120000` | `seed_big_english_3_wb.sql` | **recorded** (repaired Batch 6) |
| `20261009140000` | `seed_big_english_4_sb.sql` | **recorded** (repaired Batch 6) |
| `20261009150000` | `seed_big_english_4_wb.sql` | **recorded** (repaired Batch 6) |
| `20261009160000` | `seed_big_english_5_6.sql` | **recorded** (repaired Batch 6) |
| `20261029120000` | `create_nll_pilot.sql` | **recorded** (repaired Batch 7) |
| `20261029180000` | `seed_nll_be3_u08_story.sql` | **recorded** (pre-existing; not repaired) |
| `20261029213000` | `seed_nll_be3_u08_lia.sql` | **recorded** (pre-existing; not repaired) |
| `20261030160000` | `seed_nll_be3_u08_grammar.sql` | **empty (intentionally unapplied)** |

---

## 3. Per-migration evidence table (pre-repair confidence; actions now completed)

Confidence values from schema proof / live checks before repair. Proposed actions in the rightmost column are now **done** except Grammar.

| Version | Purpose | Confidence (pre-repair) | History action |
|---|---|---|---|
| `20261006120000` | Profiles | confirmed complete (grant supersets noted) | **applied repair done** |
| `20261007120000` | Catalog + Storage policies | confirmed complete (grant supersets noted) | **applied repair done** |
| `20261007130000` | label/status | confirmed complete | **applied repair done** |
| `20261007131000` | Pilot catalog | probably complete | **applied repair done** |
| `20261007140000` | book-assets | confirmed complete | **applied repair done** |
| `20261007150000` | books.cover_path | confirmed complete | **applied repair done** |
| `20261007160000`–`07190000` | Pilot PDF / BH1 / verify / BE1 | probably complete | **applied repair done** |
| `20261008120000`–`09160000` | Big English seeds | probably complete | **applied repair done** |
| `20261029120000` | NLL + Opener | confirmed complete (grant supersets noted) | **applied repair done** |
| `20261029180000` | Story | confirmed complete | **no action** (already recorded) |
| `20261029213000` | LiA | confirmed complete | **no action** (already recorded) |
| `20261030160000` | Grammar | intentionally unapplied | **must remain pending** |

### Live aggregate catalog snapshot (post-repair; unchanged)

| Object | Live count / note |
|---|---|
| `book_series` | 3 |
| `books` | 14 |
| `book_files` | 150 |
| `dataset_versions` | 14 |
| Storage buckets | `book-sources`, `book-datasets`, `book-assets` — present |
| NLL totals | **3 / 23 / 23 / 5** |

---

## 4. Dependency ordering (executed)

1. Foundation: `06120000` → `07120000` → `07130000` — Batches 1–3
2. Assets/covers: `07140000` → `07150000` — Batch 4
3. Pilot/BE1: `07131000` → `07160000` → `07170000` → `07180000` → `07190000` — Batch 5
4. Big English: `08120000` … `09160000` — Batch 6
5. Opener: `20261029120000` — Batch 7
6. Already remote: Story, LiA — skipped
7. Remain pending: Grammar

---

## 5. Confirmed versus unresolved effects (schema proof retained)

### Privilege-layer rule

Postgres RLS applies to row-level `SELECT`/`INSERT`/`UPDATE`/`DELETE` only. It does **not** restrict `TRUNCATE`, `REFERENCES`, or `TRIGGER`. Grant supersets for those non-row privileges remain real table-level differences from some migration texts and stay **outside** this history repair.

### Still separately gated

- Grammar-A Step B apply
- Any grant/RLS/security-hardening change
- Non-dry-run `db push`

---

## 6. Opener schema-and-seed (reconfirmed before Batch 7)

| Expected | Live (Batch 7 preconfirm + postconfirm) |
|---|---|
| Component UUID `…000001`, key `be3-u08-opener`, title exact, `draft` | Match |
| Nine memberships positions 1–9 | Match |
| Nine preferred v1 summaries; `08_03` insufficient; others sufficient; all hidden/experimental | Match |
| Links `…000101` Vocabulary col 1, `…000102` Structures col 2, `proposed` | Match |
| Aggregate with Story+LiA | `3 / 23 / 23 / 5` |

---

## 7. Repair set — final disposition

### A. Already aligned — no repair

- `20261029180000` Story
- `20261029213000` LiA

### B–C. Repaired (history-only applied)

All 20 authorized versions in Batches 1–7 (see §0).

### D. Excluded — still pending

- `20261030160000` Grammar

---

## 8. Explicitly excluded versions

| Version | Reason |
|---|---|
| `20261030160000` | Intentionally unapplied; sole pending after reconciliation |
| Story / LiA | Already remote-recorded; not repaired |
| Any unexpected remote-only | None observed; would have stopped repair |

---

## 9. Commands — executed as authorized

See §0 for the exact sequential repair list and dry-run. History-only rollback syntax (`--status reverted`) was **not** used and still requires a new owner decision if ever needed.

---

## 10. Incremental verification (completed each batch)

After every batch:

1. Newly repaired versions appeared in both local and remote columns.
2. Previously repaired versions remained recorded.
3. No unexpected remote-only version.
4. Grammar remained remote-empty.
5. Story and LiA remained recorded.
6. NLL totals remained `3 / 23 / 23 / 5`.
7. Opener / Story / LiA identities unchanged; Grammar absent.
8. No application table/row/Storage/policy/grant/schema object changes attributed to repair.

---

## 11. Stop conditions (none triggered)

None of the authorized stop conditions fired: no repair failure, no unexpected remote version, Grammar never recorded, NLL/identities/catalog/Storage stable, CLI never proposed SQL apply / excluded repair / `--include-all` / reset / pull.

---

## 12. Recovery considerations

- `--status reverted` edits history only; it does not undo schema/data.
- Not invoked. Any revert would need a new owner decision after failure review.

---

## 13. Criteria for a safe Grammar-only dry run — **met**

1. Every local version except `20261030160000` is recorded remotely — **yes (22)**.
2. Grammar remains remote-empty — **yes**.
3. No remote-only versions — **yes**.
4. Live NLL baseline `3 / 23 / 23 / 5` with Opener/Story/LiA unchanged and Grammar absent — **yes**.
5. `db push --linked --dry-run` lists only Grammar — **yes**.
6. Owner separately authorizes Grammar apply — **still required; not granted here**.

---

## 14. Recommendation (updated)

**History reconciliation complete.** Ready for a **separate** Grammar-A Step B apply gate if the owner authorizes non-dry-run push of only `20261030160000`.

### Still unauthorized

- Applying Grammar SQL / non-dry-run `db push`
- Grant/RLS hardening for documented supersets
- Staging, commit, push, deployment

**Grammar remains intentionally unapplied.**

---

## Appendix A — Repository / audit hygiene (post-repair)

- HEAD unchanged: `b1953cdf513562ed86badd09bb62058787adf581`
- Same four untracked paths only (Grammar plan, Grammar migration, Grammar test, this reconciliation plan)
- Grammar plan / migration / test remain byte-identical to pre-repair local artifacts (only this reconciliation plan content changed)
- CLI link state under `supabase/.temp/` remains gitignored; not staged
- Nothing staged or committed
- Whitespace: no BOM on this plan; `git diff --check` clean for this file after update
