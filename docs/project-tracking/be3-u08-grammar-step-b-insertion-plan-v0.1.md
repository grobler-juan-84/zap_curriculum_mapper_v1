# BE3 Unit 8 Grammar — Grammar-A Step B Insertion Plan v0.1

**Status:** GRAMMAR-A STEP B / LOCAL MIGRATION + FOCUSED TEST CREATED / APPLICATION UNAUTHORIZED
**Version:** 0.1
**Date:** 2026-10-30
**Authority:** Binding content authority: [`be3-u08-grammar-knowledge-review-v0.1.md`](./be3-u08-grammar-knowledge-review-v0.1.md) (owner-accepted Step A, 2026-10-30). Owner later authorized local Step B file creation only.
**Implementation authorization:** Local migration and focused static suite only. Created files: `supabase/migrations/20261030160000_seed_nll_be3_u08_grammar.sql` and `scripts/tests/nllBe3U08GrammarSeedStepB.test.ts`. Does **not** authorize migration application, Supabase CLI setup/history reconciliation, database/Storage mutation, Grammar-B/C work, deployment, stage, commit, or push.

---

## 1. Exact insertion boundary and explicit non-actions

### In-boundary (future authorized Step B only)

Insert, in one fail-closed transaction, for Big English 3 Unit 8 Grammar only:

| Object | Identity |
|---|---|
| Component | `be3-u08-grammar` · UUID `3e800008-0000-4000-8000-000000000004` · status `draft` |
| Memberships | Ten exact activities, positions 1–10 |
| Summaries | Ten preferred v1 rows · `hidden` · `experimental` · `evidence_status = sufficient` |
| SS link | One Structures link · status `proposed` only |

Relationship context (not stored as NLL fields): `be3_sb_wb_rel_u08_grammar_sb136-137_wb111-112` / `be3-sb-wb-u08-p136-137-wb111-112`. Default serving remains **`sb_only`**.

### Explicit non-actions (now and unless separately authorized)

- Local Step B SQL + focused test files may exist; do **not** apply the migration or mutate any live NLL row until separately authorized.
- Do not insert, update, delete, or promote any NLL row via CLI/database apply in this Step B local-file gate.
- Do not create application/configuration/canonical changes beyond the two authorized Step B artifact paths.
- Do not modify Opener (`be3-u08-opener`), Story (`be3-u08-story`), or LiA (`be3-u08-lia`) records.
- Do not insert I can… or Vocabulary SS links for Grammar.
- Do not treat grammar-box language entities `bep3_sb_lang_08_03` / `08_04` as memberships.
- Do not change resolver packaging, `sb_only`, flags, overlay, package, or renderer behavior.
- Do not run Supabase CLI, broad `supabase db push`, Storage writes, or deployment.
- Do not start Grammar-B or Grammar-C.

---

## 2. Verified baseline and collision preflight (read-only, 2026-10-30)

Live read used the existing Supabase JS client and local configuration against `kivvmobjphtcgxoltqbc.supabase.co` (service-role key present locally). No CLI. No writes.

### Totals

| Table | Live count | Expected baseline |
|---|---:|---:|
| `nll_components` | **3** | 3 |
| `nll_component_activities` | **23** | 23 |
| `nll_activity_summaries` | **23** | 23 |
| `nll_ss_component_links` | **5** | 5 |

**Baseline match:** `3 / 23 / 23 / 5` — **PASS**.

### Live components (unchanged)

| id | component_key | status |
|---|---|---|
| `…000001` | `be3-u08-opener` | `draft` |
| `…000002` | `be3-u08-story` | `draft` |
| `…000003` | `be3-u08-lia` | `draft` |

### Collision results

| Check | Result |
|---|---|
| `be3-u08-grammar` key exists | **0** |
| Proposed component UUID `…000004` exists | **0** |
| Memberships for Grammar activity IDs | **0** |
| Summary ID collisions (ten Grammar IDs) | **0** |
| `(activity_id, version=1)` for Grammar activities | **0** |
| Preferred summaries for Grammar activities | **0** |
| Proposed SS-link UUID `…000401` exists | **0** |
| Structures tuple already on proposed Grammar component | **0** |
| Component keys containing `grammar` | **none** |

### Structures SS cell identity (unambiguous)

Accepted Grammar Structures target matches the same Unit 8 SS cell already used by Opener/Story/LiA locators:

| Field | Value |
|---|---|
| `ss_path` | `big-english/big_english_3_sb/canonical/ss_v1.json` |
| `ss_sha256` | `f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a` |
| `unit_number_raw` | `8` |
| `column_order` | `2` |
| `category_name_raw` | `Structures` |
| Future Grammar link `status` | `proposed` |

Live Unit 8 Structures links already exist for Opener (`…000102`), Story (`…000201`), and LiA (`…000301`). Those are **different `component_id` rows** and do **not** collide with a Grammar Structures link under the unique constraint `(component_id, ss_path, ss_sha256, unit_number_raw, column_order, category_name_raw)`.

### Migration-history state (read-only limitation)

Client queries to `public.schema_migrations` and `supabase_migrations.schema_migrations` were not available through the JS schema cache (`Invalid schema` / table not found). Local NLL migration filenames remain:

- `20261029120000_create_nll_pilot.sql`
- `20261029180000_seed_nll_be3_u08_story.sql`
- `20261029213000_seed_nll_be3_u08_lia.sql`

Project trackers already record those NLL seeds as applied and warn about older remote-empty migration-history entries. **Future application must re-verify remote migration history in the same authorized session** and must not use broad `supabase db push`.

### Fingerprint reconfirm

Local trusted canonicals still produce the accepted Step A activity fingerprints (see §5). SB `3924fa23…67e6` / WB `811deea2…04fa` unchanged and gitignored.

---

## 3. Exact proposed component record

| Field | Proposed value |
|---|---|
| `id` | `3e800008-0000-4000-8000-000000000004` |
| `component_key` | `be3-u08-grammar` |
| `title` | Big English 3 Unit 8 Grammar |
| `status` | `draft` |

---

## 4. Exact ordered memberships

| position | activity_id |
|---:|---|
| 1 | `bep3_sb_act_08_19` |
| 2 | `bep3_sb_act_08_20` |
| 3 | `bep3_sb_act_08_21` |
| 4 | `bep3_sb_act_08_22` |
| 5 | `bep3_sb_act_08_23` |
| 6 | `bep_3_wb_act_111_15` |
| 7 | `bep_3_wb_act_111_16` |
| 8 | `bep_3_wb_act_111_17` |
| 9 | `bep_3_wb_act_112_18` |
| 10 | `bep_3_wb_act_112_19` |

---

## 5. Exact summary payloads (accepted Step A text)

Common fields for every row:

- `version = 1`
- `evidence_status = sufficient`
- `display_status = hidden`
- `review_state = experimental`
- `is_preferred = true`
- SB `canonical_path = big-english/big_english_3_sb/canonical/v1.json`
- SB `canonical_sha256 = 3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6`
- WB `canonical_path = big-english/big_english_3_wb/canonical/v1.json`
- WB `canonical_sha256 = 811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa`

Provenance shape (source `SB` or `WB` per row):

```json
{
  "record_type": "teacher_friendly_summary",
  "source": "SB|WB",
  "verification_status": "human_verified",
  "original_review_status": "experimental_review_required",
  "generation": {
    "method": "ai_assisted_draft",
    "prompt_version": "grammar-a-step-a-knowledge-prep-v0.1"
  }
}
```

| id | activity_id | summary_text | activity_sha256 | source |
|---|---|---|---|---|
| `big_english_3_sb_unit_08_activity_19_summary_grammar_a_v1` | `bep3_sb_act_08_19` | Students look, listen to Audio 159, and read the dialogue to answer how Donna's dad came home. | `aa749d55fdc96f1b08efa95824c688bd06d5af786013c2ec9064397c5fe0133c` | SB |
| `big_english_3_sb_unit_08_activity_20_summary_grammar_a_v1` | `bep3_sb_act_08_20` | Students copy the regular-past spelling chart and complete it by sorting the word-box verbs into the chart columns. | `cf280c387907a1cdfe41919cc7845ccc442247273b78f306d4c86665d1ea12e4` | SB |
| `big_english_3_sb_unit_08_activity_21_summary_grammar_a_v1` | `bep3_sb_act_08_21` | Students read and complete a nine-item past-form narrative gap-fill. | `3b39624df961791c53e2f095bbc57f9833146d8b209e431ed7e847223412237b` | SB |
| `big_english_3_sb_unit_08_activity_22_summary_grammar_a_v1` | `bep3_sb_act_08_22` | Students match eight base verbs to their irregular past forms. | `aabd99915eddb739229a9a3f24d7e1a03ef85021e5afda1dd8d8c62da2077ec7` | SB |
| `big_english_3_sb_unit_08_activity_23_summary_grammar_a_v1` | `bep3_sb_act_08_23` | Students tell a partner what they did yesterday, using the verified model frames. | `50e5750d70b5af0f8816bfcf599945496db1ae9694bb30cb749f21722b5d6052` | SB |
| `big_english_3_wb_unit_08_p111_activity_15_summary_grammar_a_v1` | `bep_3_wb_act_111_15` | Students complete the regular-past spelling chart by sorting the word-box verbs into the given columns. | `c1cfb0e700232a8b83a074e73af78fa6bb4f5c0fb2a62440b38d183649e543b2` | WB |
| `big_english_3_wb_unit_08_p111_activity_16_summary_grammar_a_v1` | `bep_3_wb_act_111_16` | Students write the simple-past forms of ten irregular verbs. | `5fe70c5bb93e7b475182257435f7d875e7e96d4372c3336fc04ad3a57b1d7678` | WB |
| `big_english_3_wb_unit_08_p111_activity_17_summary_grammar_a_v1` | `bep_3_wb_act_111_17` | Students complete a thirteen-item narrative cloze with the correct past forms of the verbs in parentheses. | `e49a9db3deec16cf04c1bb1a6d2118141eeac90b3444f5d2240667e7a4d28bbc` | WB |
| `big_english_3_wb_unit_08_p112_activity_18_summary_grammar_a_v1` | `bep_3_wb_act_112_18` | Students use the page models and illustrations to complete six questions and answers about past activities. | `c95ce7e9e36352db1d38107f5667d8c613b0944db36884a4e1a7fb718feb39f4` | WB |
| `big_english_3_wb_unit_08_p112_activity_19_summary_grammar_a_v1` | `bep_3_wb_act_112_19` | Students rewrite three affirmative past sentences as negatives with `didn't`. | `3868686e77c2d55c8692ae183162fc28ec95d3e32d5feea77cf911ce5a018073` | WB |

---

## 6. Exact proposed Structures link

| Field | Proposed value |
|---|---|
| `id` | `3e800008-0000-4000-8000-000000000401` |
| `component_id` | `3e800008-0000-4000-8000-000000000004` |
| `ss_path` | `big-english/big_english_3_sb/canonical/ss_v1.json` |
| `ss_sha256` | `f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a` |
| `unit_number_raw` | `8` |
| `column_order` | `2` |
| `category_name_raw` | `Structures` |
| `status` | `proposed` |

---

## 7. Withheld and unsuitable SS links

| Candidate | Decision |
|---|---|
| I can… ask/answer about past activities (`column_order` 7) | **Withheld** (Step A) |
| Vocabulary (`column_order` 1) | **Unsuitable** |
| CLIL/Culture, Writing, Phonics, Values | **Unsuitable** |

Do not insert any of the above in Step B.

---

## 8. Deterministic identifier strategy

Follow the accepted NLL UUID family `3e800008-0000-4000-8000-*`:

| Kind | Pattern used historically | Grammar assignment |
|---|---|---|
| Components | `…000001` Opener, `…000002` Story, `…000003` LiA | `…000004` Grammar |
| SS links | Opener `…000101/102`, Story `…000201`, LiA `…000301/302` | Grammar Structures `…000401` |
| Summary IDs | `{book}_unit_08_…_summary_{lane}_v1` | `…_summary_grammar_a_v1` |

Ordinary inserts only (no `ON CONFLICT … DO NOTHING`). Fixed IDs make the future migration auditable and re-runnable as a collision-aborting plan.

---

## 9. One-transaction fail-closed insertion design

**Created local migration filename (application still unauthorized):**

`supabase/migrations/20261030160000_seed_nll_be3_u08_grammar.sql`

Logical shape (implemented locally; do not apply yet):

```sql
begin;
-- 1) Preconditions DO block: totals must be 3/23/23/5;
--    Opener/Story/LiA identities unchanged;
--    Grammar key/UUID unused;
--    ten activity memberships unused;
--    ten summary IDs / (activity_id,1) / preferred slots unused;
--    SS-link UUID unused;
--    Grammar Structures unique tuple unused.
-- 2) INSERT component.
-- 3) INSERT ten memberships in positions 1-10.
-- 4) INSERT ten preferred hidden/experimental summaries.
-- 5) INSERT one proposed Structures link.
-- 6) Assertions DO block: totals 4/33/33/6;
--    exact Grammar memberships/order;
--    ten preferred hidden/experimental summaries;
--    one proposed Structures link only for Grammar;
--    Opener/Story/LiA unchanged.
commit;
```

No schema/RLS changes. No updates to existing rows.

---

## 10. Collision behavior

Abort the transaction (raise exception) if any of the following is true:

1. Baseline totals are not exactly `3 / 23 / 23 / 5`.
2. Opener/Story/LiA component IDs/keys/status changed.
3. `be3-u08-grammar` or UUID `…000004` already exists.
4. Any Grammar activity already appears in `nll_component_activities`.
5. Membership count/order after insert is not exactly the ten accepted pairs.
6. Any of the ten summary IDs exists; any `(activity_id, version=1)` exists; any preferred row already exists for those activities; provenance/status fields do not match assertions.
7. SS-link UUID `…000401` exists, or an unexpected Grammar Structures tuple exists.
8. Any `ON CONFLICT` soft-success path is used (forbidden).
9. Any statement would update or replace Opener, Story, or LiA records (forbidden).

---

## 11. Expected post-insertion totals

| Table | Before | After |
|---|---:|---:|
| `nll_components` | 3 | **4** |
| `nll_component_activities` | 23 | **33** |
| `nll_activity_summaries` | 23 | **33** |
| `nll_ss_component_links` | 5 | **6** |

Expected aggregate: **`4 / 33 / 33 / 6`**.

---

## 12. Focused test design (created locally; live apply still unauthorized)

Created suite path: `scripts/tests/nllBe3U08GrammarSeedStepB.test.ts`, modeled on `nllBe3U08LiaSeedStepB.test.ts`.

Assertions:

1. SQL contains `begin;` / `commit;`, precondition/assertion failures, baseline `3/23/23/5`, post totals `4/33/33/6`.
2. No `ON CONFLICT`, no `create/alter table`, no policy changes.
3. Exact component key/UUID/title/`draft`.
4. Ten unique memberships in exact order 1–10.
5. Ten summary IDs and accepted summary texts; preferred + hidden + experimental + sufficient.
6. Exact SB/WB canonical hashes and activity fingerprints.
7. Structures-only proposed link; no I can… / Vocabulary for Grammar.
8. Opener/Story/LiA migration identities remain referenced as unchanged.
9. Optional runtime assembly check via `assembleNeutralLessonComponent` with `includeHiddenExperimental` once live (post-application only).

---

## 13. Safe future application approach

1. Re-run the live collision preflight immediately before application; abort if anything drifted.
2. Create the single bounded migration file only after explicit owner authorization.
3. Apply **only that migration** by an owner-approved bounded method.
4. **Do not** run broad `supabase db push`.
5. Account for older remote-empty migration-history risk: verify the target version is absent remotely before apply; do not “repair” unrelated empty history entries in the same action.
6. Keep serving `sb_only`; no adapter/flag work in Step B.

---

## 14. Post-application verification and owner acceptance criteria

After a future authorized apply:

1. Live totals exactly `4 / 33 / 33 / 6`.
2. `be3-u08-grammar` is `draft` with ten ordered memberships.
3. Ten preferred v1 summaries are `hidden` / `experimental` / `sufficient` with exact texts and hashes.
4. Exactly one Grammar SS link: Structures `proposed`.
5. Opener/Story/LiA counts and identities unchanged.
6. Focused Step B suite green; retained Opener/Story/LiA seed suites still green.
7. Separate owner acceptance of the live state before any Grammar-B work.

---

## 15. Stop conditions and rollback / recovery

**Stop / do not apply if:**

- Live baseline ≠ `3 / 23 / 23 / 5`.
- Any Grammar identity already exists.
- Structures target cannot be resolved (cell ambiguity) — currently resolved.
- Trusted SB/WB hashes or fingerprints diverge from Step A.
- Migration-history state cannot be verified safely for a bounded apply.

**Rollback design (future, Grammar-scoped only; not executed now):**

```sql
begin;
-- Verify target is exactly be3-u08-grammar / …000004.
-- Delete Grammar SS link …000401.
-- Delete the ten Grammar summaries by exact IDs.
-- Delete Grammar memberships.
-- Delete Grammar component.
-- Assert totals return to 3/23/23/5 and Opener/Story/LiA unchanged.
commit;
```

No cascading deletes against other components.

---

## 16. Recommendation

Local Grammar-A Step B migration + focused suite files are created. **Application remains a separate owner gate**, provided the live baseline remains `3 / 23 / 23 / 5` at apply time.

This local-file milestone inserts nothing into any database. Grammar-B package/renderer and Grammar-C adapter remain unauthorized. Current serving remains `sb_only`.
