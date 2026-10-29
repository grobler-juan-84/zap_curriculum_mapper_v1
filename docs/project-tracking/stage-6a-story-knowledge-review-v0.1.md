# Stage 6A — Story Knowledge Review v0.1

**Status:** STAGE 6A COMPLETE / OWNER-ACCEPTED  
**Version:** 0.1  
**Date:** 2026-10-29  
**Authority:** Owner authorization for Stage 6A Steps A–B; migration-history reconciliation; formal Stage 6A acceptance 2026-10-29  
**Implementation authorization:** Step B seed insertion **completed** on project `kivvmobjphtcgxoltqbc`. Migration version `20261029180000` marked **applied** via supported CLI repair. Stage 6A is **owner-accepted complete**. Stage 6B / promotion / deploy / broad `supabase db push` remain **not authorized**.

---

## 1. Boundary (exact)

| Field | Value |
|---|---|
| Component key | `be3-u08-story` (live as `draft` — this does **not** mean `status = available`) |
| Title | Big English 3 Unit 8 Story |
| Status | `draft` |
| Relationship | `be3_sb_wb_rel_u08_story_sb130-131_wb106` |
| Package reference | `be3-sb-wb-u08-p130-131-wb106` |
| SB pages | 130–131 (`bep3_sb_p130`, `bep3_sb_p131`) |
| WB pages | 106 only (`bep_3_wb_p106`) |
| Excluded | WB p.107 Language in Action (`bep_3_wb_act_107_7`, `bep_3_wb_act_107_8`, and every other p.107 record) |

### Eligible activity inventory (verified)

All five candidates are `human_verified`, belong to the accepted pages, and are the exact set returned by the current Story selection path (`buildSbActivityCards` on pp.130–131 + `buildWbActivityCards` for the Story companion; WB cards require companion page IDs, not page-position inference).

| Position | activity_id | Source | Page | Instruction (publisher) |
|---:|---|---|---:|---|
| 1 | `bep3_sb_act_08_06` | SB | 130 | Listen and read. Did Amy eat a healthy dinner? |
| 2 | `bep3_sb_act_08_07` | SB | 131 | Read and choose. |
| 3 | `bep_3_wb_act_106_5` | WB | 106 | Read and answer. Write Yes, she did or No, she didn't. |
| 4 | `bep_3_wb_act_106_6` | WB | 106 | What did you eat for dinner yesterday? Was it healthy? Draw, write, and circle. |
| 5 | `bep_3_wb_act_106_tb` | WB | 106 | Healthy or unhealthy? Draw. |

---

## 2. Canonical hashes and fingerprints

### File SHA-256 (raw bytes)

| Object | Path used for hashing | SHA-256 | Notes |
|---|---|---|---|
| SB canonical | `data/phase1/big_english_3_sb/canonical/v1.json` | `3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6` | Matches Opener NLL seed |
| WB canonical | `data/phase1/big_english_3_wb/canonical/v1.json` | `811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa` | Matches Opener NLL seed |
| SS authority (v2) | Approved SS-V2 bytes (local review copy: `docs/SS_JSON_FILES NEW/BE3_SS.JSON`) | `f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a` | Same bytes as the versioned Storage object `big-english/big_english_3_sb/canonical/ss_v1.json`; NLL links pin this approved hash + that Storage path, not the local legacy file |
| Local legacy SS | `data/phase1/big_english_3_sb/canonical/ss_v1.json` | `4d30c3bae33283262156822b794bebfe1ba545c7fd5a484bbacb9e8135305bd5` | **Do not use** for Story links; pre-replacement rollback copy only |

**Algorithm for file hashes:** SHA-256 over raw file bytes (Node `crypto.createHash('sha256')`).

**Algorithm for activity fingerprints:** existing `fingerprintCanonicalActivity` — stable key-sorted JSON of the full canonical activity object, then SHA-256 of UTF-8 bytes (`app/src/features/nll/neutralLessonLibrary.ts`). Verified identical via that function and a Node stable-JSON reimplementation.

| activity_id | activity_sha256 |
|---|---|
| `bep3_sb_act_08_06` | `86adac9865b348f5ba411fa8e06b5d0709ef5dc07308bb728d14e3d056ad5294` |
| `bep3_sb_act_08_07` | `e00ee160480815d08a47c8e7a0f8b764a44b6ae93667bada567831ecc1e16b4a` |
| `bep_3_wb_act_106_5` | `bf1dc59eb81201fcd8331e514a00a76224db244deadaad84fccb6f8573f196a0` |
| `bep_3_wb_act_106_6` | `b20d8761aca70074606754168633f972935b4382fe3c33aabfcc420ca13b57c5` |
| `bep_3_wb_act_106_tb` | `f003fe506715ec8f7606d00f1c2f15e0dcfb723fb788ddaf47594e42cc3faba8` |

Storage object paths to bind in rows (unchanged conventions):

- SB: `big-english/big_english_3_sb/canonical/v1.json`
- WB: `big-english/big_english_3_wb/canonical/v1.json`
- SS: `big-english/big_english_3_sb/canonical/ss_v1.json` — this path holds the **approved SS-V2** object; the filename `ss_v1.json` is the versioned Storage key. The Story NLL SS link pins `ss_sha256 = f6f756e1…bb5a` for that Storage object. It does **not** pin or reference the local legacy file at `data/phase1/big_english_3_sb/canonical/ss_v1.json`.

---

## 3. Evidence review (record-by-record)

### 3.1 `bep3_sb_act_08_06` (SB p.130)

- **Verification:** `human_verified`
- **Publisher instruction:** Listen and read. Did Amy eat a healthy dinner?
- **Additional verified evidence:** prompt = same question; expected_answer = `No, she didn't.`; audio_dependency true; source_dependency_note = Audio track 154; visual_dependency true; items empty
- **Proposed summary:** Students listen to Audio 154, read the story and answer whether Amy ate a healthy dinner.
- **evidence_status:** `sufficient`
- **Notes:** Full story text is not in the activity record and is intentionally not reproduced. Summary uses only verified instruction/audio evidence; the expected answer remains publisher evidence, not summary prose.

### 3.2 `bep3_sb_act_08_07` (SB p.131)

- **Verification:** `human_verified`
- **Publisher instruction:** Read and choose.
- **Additional verified evidence:** six choose-items with prompts and expected answers (party/home; healthy/unhealthy; potatoes; bad; sugar; isn't)
- **Proposed summary:** Students read the story and choose the correct option in six comprehension items about Amy’s dinner.
- **evidence_status:** `sufficient`
- **Notes:** Does not invent procedures beyond “read and choose”; does not paste item bank into the summary.

### 3.3 `bep_3_wb_act_106_5` (WB p.106)

- **Verification:** `human_verified`
- **Publisher instruction:** Read and answer. Write Yes, she did or No, she didn't.
- **Additional verified evidence:** language_frame `Yes, she did. / No, she didn't.`; four Did Amy…? items with answers
- **Proposed summary:** Students answer four questions about Amy’s dinner using Yes, she did or No, she didn’t.
- **evidence_status:** `sufficient`

### 3.4 `bep_3_wb_act_106_6` (WB p.106)

- **Verification:** `human_verified`
- **Publisher instruction:** What did you eat for dinner yesterday? Was it healthy? Draw, write, and circle.
- **Additional verified evidence:** prompt/language_frame for personal dinner sentence; items empty; no expected answer (personal)
- **Proposed summary:** Students draw, write and circle to say what they ate and drank for dinner yesterday and whether it was healthy.
- **evidence_status:** `sufficient`

### 3.5 `bep_3_wb_act_106_tb` (WB p.106)

- **Verification:** `human_verified`
- **Publisher instruction:** Healthy or unhealthy? Draw.
- **Additional verified evidence:** prompt lists fries, lettuce, tomatoes, bottle of cola, burger, water
- **Proposed summary:** Students draw happy or sad faces to mark fries, lettuce, tomatoes, a bottle of cola, a burger and water as healthy or unhealthy.
- **evidence_status:** `sufficient`

---

## 4. Proposed SS links

Unit 8 title (SS v2): **Healthy Living** (`unit_number_raw = "8"`).

Original column order:

1. Vocabulary  
2. Structures  
3. CLIL/Culture  
4. Writing  
5. Phonics  
6. Values  
7. I can...

### Proposed (status = `proposed`)

| column_order | category_name_raw | Rationale |
|---:|---|---|
| 2 | Structures | Component-level relevance to unit Structures (`Did …?` / `Yes, I did.` / `No, I didn't.`). WB Activity 5 practices the same short-answer pattern in she-form about the story. This does **not** claim every Story activity independently satisfies Structures. |

### Considered, not proposed

| Category | Why withheld |
|---|---|
| Vocabulary | Unit Vocabulary lists healthy-living routines (breakfast, exercise, sleep, bike). Story evidence centres on dinner/food comprehension and personal reflection, not that listed set. Linking would over-claim. |
| I can... | Soft thematic overlap (“healthy and unhealthy habits”; past activities), but unit can-do statements are broader than this Story component. Prefer uncertainty over an extra proposed link. |
| CLIL/Culture, Writing, Phonics, Values | No defensible Story-component alignment from the accepted pages. |

---

## 5. Identifier availability (live read-only check)

Project host: `kivvmobjphtcgxoltqbc.supabase.co` (read-only; no writes).

Current Opener state unchanged:

| Table | Count |
|---|---:|
| `nll_components` | 1 |
| `nll_component_activities` | 9 |
| `nll_activity_summaries` | 9 |
| `nll_ss_component_links` | 2 |

- `be3-u08-opener` present, `status = draft`
- All nine Opener summaries remain `hidden` + `experimental` + preferred
- Both Opener SS links remain `proposed` (Vocabulary, Structures)
- `be3-u08-story` **absent** (key currently unused; not a `status = available` claim)
- Proposed Story component UUID `3e800008-0000-4000-8000-000000000002` **absent**
- Proposed Story summary IDs **absent**
- No existing preferred summaries for the five Story activity IDs
- Proposed SS link UUID `3e800008-0000-4000-8000-000000000201` **absent**

---

## 6. Proposed record payloads

### 6.1 `nll_components`

| Field | Value |
|---|---|
| id | `3e800008-0000-4000-8000-000000000002` |
| component_key | `be3-u08-story` |
| title | Big English 3 Unit 8 Story |
| status | `draft` |

### 6.2 `nll_component_activities`

| component_id | activity_id | position |
|---|---|---:|
| `…000002` | `bep3_sb_act_08_06` | 1 |
| `…000002` | `bep3_sb_act_08_07` | 2 |
| `…000002` | `bep_3_wb_act_106_5` | 3 |
| `…000002` | `bep_3_wb_act_106_6` | 4 |
| `…000002` | `bep_3_wb_act_106_tb` | 5 |

### 6.3 `nll_activity_summaries` (all v1 preferred; hidden + experimental)

Shared provenance shape (no Opener `legacy_version`; no invented provider/model):

```json
{
  "record_type": "teacher_friendly_summary",
  "source": "SB|WB",
  "verification_status": "human_verified",
  "original_review_status": "experimental_review_required",
  "generation": {
    "method": "ai_assisted_draft",
    "prompt_version": "stage-6a-story-knowledge-prep-v0.1"
  }
}
```

| id | activity_id | summary_text | evidence_status | canonical_path | canonical_sha256 | activity_sha256 |
|---|---|---|---|---|---|---|
| `big_english_3_sb_unit_08_activity_06_summary_stage6a_v1` | `bep3_sb_act_08_06` | Students listen to Audio 154, read the story and answer whether Amy ate a healthy dinner. | sufficient | `…/big_english_3_sb/canonical/v1.json` | `3924fa23…67e6` | `86adac98…5294` |
| `big_english_3_sb_unit_08_activity_07_summary_stage6a_v1` | `bep3_sb_act_08_07` | Students read the story and choose the correct option in six comprehension items about Amy’s dinner. | sufficient | SB path | SB hash | `e00ee160…6b4a` |
| `big_english_3_wb_unit_08_p106_activity_5_summary_stage6a_v1` | `bep_3_wb_act_106_5` | Students answer four questions about Amy’s dinner using Yes, she did or No, she didn’t. | sufficient | WB path | WB hash | `bf1dc59e…96a0` |
| `big_english_3_wb_unit_08_p106_activity_6_summary_stage6a_v1` | `bep_3_wb_act_106_6` | Students draw, write and circle to say what they ate and drank for dinner yesterday and whether it was healthy. | sufficient | WB path | WB hash | `b20d8761…57c5` |
| `big_english_3_wb_unit_08_p106_activity_tb_summary_stage6a_v1` | `bep_3_wb_act_106_tb` | Students draw happy or sad faces to mark fries, lettuce, tomatoes, a bottle of cola, a burger and water as healthy or unhealthy. | sufficient | WB path | WB hash | `f003fe50…aba8` |

Common flags for every summary row: `version = 1`, `display_status = hidden`, `review_state = experimental`, `is_preferred = true`.

### 6.4 `nll_ss_component_links`

| id | component_id | ss_path | ss_sha256 | unit_number_raw | column_order | category_name_raw | status |
|---|---|---|---|---|---:|---|---|
| `3e800008-0000-4000-8000-000000000201` | `…000002` | `big-english/big_english_3_sb/canonical/ss_v1.json` | `f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a` | `8` | 2 | Structures | `proposed` |

---

## 7. Step B migration SQL (durable file)

Executable additive migration created at:

`supabase/migrations/20261029180000_seed_nll_be3_u08_story.sql`

Design rules:

- wrap the whole insertion in **one transaction**;
- fail-fast precondition checks before any insert;
- **no** `ON CONFLICT … DO NOTHING` — ordinary inserts so any collision aborts;
- pre-commit assertions; `COMMIT` only if every assertion passes.

```sql
-- Additive Story knowledge for be3-u08-story. Does not modify Opener rows
-- or alter schema/RLS from 20261029120000_create_nll_pilot.sql.
-- Ordinary inserts only: any collision aborts the transaction.

begin;

-- Fail-fast preconditions: identifiers and pairs must be unused.
do $$
begin
  if exists (
    select 1 from public.nll_components
    where component_key = 'be3-u08-story'
       or id = '3e800008-0000-4000-8000-000000000002'
  ) then
    raise exception 'Stage 6A Story precondition failed: component key or UUID already present';
  end if;

  if exists (
    select 1 from public.nll_activity_summaries
    where id in (
      'big_english_3_sb_unit_08_activity_06_summary_stage6a_v1',
      'big_english_3_sb_unit_08_activity_07_summary_stage6a_v1',
      'big_english_3_wb_unit_08_p106_activity_5_summary_stage6a_v1',
      'big_english_3_wb_unit_08_p106_activity_6_summary_stage6a_v1',
      'big_english_3_wb_unit_08_p106_activity_tb_summary_stage6a_v1'
    )
    or (activity_id, version) in (
      ('bep3_sb_act_08_06', 1),
      ('bep3_sb_act_08_07', 1),
      ('bep_3_wb_act_106_5', 1),
      ('bep_3_wb_act_106_6', 1),
      ('bep_3_wb_act_106_tb', 1)
    )
  ) then
    raise exception 'Stage 6A Story precondition failed: summary id or activity/version pair already present';
  end if;

  if exists (
    select 1 from public.nll_ss_component_links
    where id = '3e800008-0000-4000-8000-000000000201'
  ) then
    raise exception 'Stage 6A Story precondition failed: SS-link UUID already present';
  end if;
end $$;

insert into public.nll_components (id, component_key, title, status)
values (
  '3e800008-0000-4000-8000-000000000002',
  'be3-u08-story',
  'Big English 3 Unit 8 Story',
  'draft'
);

insert into public.nll_component_activities (component_id, activity_id, position)
values
  ('3e800008-0000-4000-8000-000000000002', 'bep3_sb_act_08_06', 1),
  ('3e800008-0000-4000-8000-000000000002', 'bep3_sb_act_08_07', 2),
  ('3e800008-0000-4000-8000-000000000002', 'bep_3_wb_act_106_5', 3),
  ('3e800008-0000-4000-8000-000000000002', 'bep_3_wb_act_106_6', 4),
  ('3e800008-0000-4000-8000-000000000002', 'bep_3_wb_act_106_tb', 5);

insert into public.nll_activity_summaries (
  id, activity_id, version, summary_text, canonical_path, canonical_sha256,
  activity_sha256, evidence_status, display_status, review_state,
  is_preferred, provenance
)
values
  (
    'big_english_3_sb_unit_08_activity_06_summary_stage6a_v1',
    'bep3_sb_act_08_06', 1,
    'Students listen to Audio 154, read the story and answer whether Amy ate a healthy dinner.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    '86adac9865b348f5ba411fa8e06b5d0709ef5dc07308bb728d14e3d056ad5294',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"stage-6a-story-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_07_summary_stage6a_v1',
    'bep3_sb_act_08_07', 1,
    'Students read the story and choose the correct option in six comprehension items about Amy''s dinner.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    'e00ee160480815d08a47c8e7a0f8b764a44b6ae93667bada567831ecc1e16b4a',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"stage-6a-story-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p106_activity_5_summary_stage6a_v1',
    'bep_3_wb_act_106_5', 1,
    'Students answer four questions about Amy''s dinner using Yes, she did or No, she didn’t.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    'bf1dc59eb81201fcd8331e514a00a76224db244deadaad84fccb6f8573f196a0',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"stage-6a-story-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p106_activity_6_summary_stage6a_v1',
    'bep_3_wb_act_106_6', 1,
    'Students draw, write and circle to say what they ate and drank for dinner yesterday and whether it was healthy.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    'b20d8761aca70074606754168633f972935b4382fe3c33aabfcc420ca13b57c5',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"stage-6a-story-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p106_activity_tb_summary_stage6a_v1',
    'bep_3_wb_act_106_tb', 1,
    'Students draw happy or sad faces to mark fries, lettuce, tomatoes, a bottle of cola, a burger and water as healthy or unhealthy.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    'f003fe506715ec8f7606d00f1c2f15e0dcfb723fb788ddaf47594e42cc3faba8',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"stage-6a-story-knowledge-prep-v0.1"}}'
  );

insert into public.nll_ss_component_links (
  id, component_id, ss_path, ss_sha256, unit_number_raw,
  column_order, category_name_raw, status
)
values (
  '3e800008-0000-4000-8000-000000000201',
  '3e800008-0000-4000-8000-000000000002',
  'big-english/big_english_3_sb/canonical/ss_v1.json',
  'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a',
  '8', 2, 'Structures', 'proposed'
);

-- Pre-commit assertions: commit only if every check passes.
do $$
declare
  story_component_count integer;
  story_membership_count integer;
  story_summary_count integer;
  story_ss_link_count integer;
  wb107_membership_count integer;
  opener_component_count integer;
  opener_membership_count integer;
  opener_summary_count integer;
  opener_ss_link_count integer;
begin
  select count(*) into story_component_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000002'
    and component_key = 'be3-u08-story'
    and status = 'draft';
  if story_component_count <> 1 then
    raise exception 'Stage 6A Story assertion failed: expected one draft Story component';
  end if;

  select count(*) into story_membership_count
  from public.nll_component_activities
  where component_id = '3e800008-0000-4000-8000-000000000002'
    and (
      (activity_id, position) in (
        ('bep3_sb_act_08_06', 1),
        ('bep3_sb_act_08_07', 2),
        ('bep_3_wb_act_106_5', 3),
        ('bep_3_wb_act_106_6', 4),
        ('bep_3_wb_act_106_tb', 5)
      )
    );
  if story_membership_count <> 5 then
    raise exception 'Stage 6A Story assertion failed: expected five exact memberships in positions 1–5';
  end if;

  select count(*) into story_summary_count
  from public.nll_activity_summaries
  where id in (
      'big_english_3_sb_unit_08_activity_06_summary_stage6a_v1',
      'big_english_3_sb_unit_08_activity_07_summary_stage6a_v1',
      'big_english_3_wb_unit_08_p106_activity_5_summary_stage6a_v1',
      'big_english_3_wb_unit_08_p106_activity_6_summary_stage6a_v1',
      'big_english_3_wb_unit_08_p106_activity_tb_summary_stage6a_v1'
    )
    and version = 1
    and is_preferred = true
    and display_status = 'hidden'
    and review_state = 'experimental';
  if story_summary_count <> 5 then
    raise exception 'Stage 6A Story assertion failed: expected five preferred v1 hidden experimental summaries';
  end if;

  select count(*) into story_ss_link_count
  from public.nll_ss_component_links
  where id = '3e800008-0000-4000-8000-000000000201'
    and component_id = '3e800008-0000-4000-8000-000000000002'
    and column_order = 2
    and category_name_raw = 'Structures'
    and status = 'proposed';
  if story_ss_link_count <> 1 then
    raise exception 'Stage 6A Story assertion failed: expected one proposed Structures link';
  end if;

  select count(*) into wb107_membership_count
  from public.nll_component_activities
  where component_id = '3e800008-0000-4000-8000-000000000002'
    and activity_id like 'bep_3_wb_act_107_%';
  if wb107_membership_count <> 0 then
    raise exception 'Stage 6A Story assertion failed: WB p.107 activity membership present';
  end if;

  select count(*) into opener_component_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000001'
    and component_key = 'be3-u08-opener'
    and status = 'draft';
  select count(*) into opener_membership_count
  from public.nll_component_activities
  where component_id = '3e800008-0000-4000-8000-000000000001';
  select count(*) into opener_summary_count
  from public.nll_activity_summaries
  where activity_id in (
    'bep3_sb_act_08_01', 'bep3_sb_act_08_02', 'bep3_sb_act_08_03',
    'bep3_sb_act_08_04', 'bep3_sb_act_08_05',
    'bep_3_wb_act_104_1', 'bep_3_wb_act_104_2',
    'bep_3_wb_act_105_3', 'bep_3_wb_act_105_4'
  );
  select count(*) into opener_ss_link_count
  from public.nll_ss_component_links
  where component_id = '3e800008-0000-4000-8000-000000000001';
  if opener_component_count <> 1
     or opener_membership_count <> 9
     or opener_summary_count <> 9
     or opener_ss_link_count <> 2 then
    raise exception 'Stage 6A Story assertion failed: Opener identities changed';
  end if;
end $$;

commit;
```

### Compensating rollback (Story-scoped only)

```sql
-- Compensating migration / rollback for Story seed only.
-- Does not touch Opener component 3e800008-0000-4000-8000-000000000001.

delete from public.nll_ss_component_links
where id = '3e800008-0000-4000-8000-000000000201'
   or component_id = '3e800008-0000-4000-8000-000000000002';

delete from public.nll_activity_summaries
where id in (
  'big_english_3_sb_unit_08_activity_06_summary_stage6a_v1',
  'big_english_3_sb_unit_08_activity_07_summary_stage6a_v1',
  'big_english_3_wb_unit_08_p106_activity_5_summary_stage6a_v1',
  'big_english_3_wb_unit_08_p106_activity_6_summary_stage6a_v1',
  'big_english_3_wb_unit_08_p106_activity_tb_summary_stage6a_v1'
);

delete from public.nll_component_activities
where component_id = '3e800008-0000-4000-8000-000000000002';

delete from public.nll_components
where id = '3e800008-0000-4000-8000-000000000002'
  and component_key = 'be3-u08-story';
```

Expected / observed post-Step-B counts: components **2**, memberships **14**, summaries **14**, SS links **3**. Opener remains 1/9/9/2 of those totals.

---

## 8. Tests

### Step A reused suite (already available)

- `scripts/tests/neutralLessonLibraryPilot.test.ts`
- `scripts/tests/buildBe3U08StorySbWbSeriesHandoff.test.ts`
- `scripts/tests/renderBe3U08StoryNeutralPackageToChalkieShadow.test.ts`
- `scripts/tests/be3U08StoryNeutralCanary.test.ts`

### Step B focused seed-validation suite

- `scripts/tests/nllBe3U08StorySeedStage6a.test.ts` (**created**)
- Opener regression retained: `scripts/tests/neutralLessonLibraryPilot.test.ts`

Step B automated result: **10/10 passed** (3 Story seed tests + 7 Opener NLL pilot tests).

Stage 6B adapter tests remain out of scope until a separate brief.

---

## 9. Step B insertion and verification record (2026-10-29)

### Target

- Project: `kivvmobjphtcgxoltqbc` (`kivvmobjphtcgxoltqbc.supabase.co`)
- Pre-insert live totals: **1 / 9 / 9 / 2**
- Story identifiers confirmed unused before insert

### Apply method

- Durable SQL migration file created: `supabase/migrations/20261029180000_seed_nll_be3_u08_story.sql`
- Live apply used **service-role fail-fast inserts mirroring that migration**, because this checkout has no Postgres URL / Supabase Management API access token for native `BEGIN…COMMIT` / `BEGIN…ROLLBACK` SQL sessions
- No `ON CONFLICT … DO NOTHING`
- Precondition collision checks + post-insert assertions + automatic compensating delete on failure
- Opener migration `20261029120000_create_nll_pilot.sql` **not modified**

### Live post-insert validation

| Check | Result |
|---|---|
| Totals | **2 / 14 / 14 / 3** |
| Story component | `be3-u08-story` / `…000002` / `draft` |
| Memberships | five exact IDs in positions 1–5 |
| Summaries | five preferred v1; all `hidden` + `experimental`; approved texts/hashes/fingerprints/provenance |
| SS link | one `Structures` / `column_order=2` / `proposed` / approved SS-V2 hash |
| WB p.107 membership | none |
| Duplicate/orphan Story rows | none observed |
| Opener | unchanged `be3-u08-opener` / 9 memberships / 9 summaries / 2 links |

### Retrieval

- `loadNeutralLessonComponent('be3-u08-story')` normal visibility: **0** preferred summaries exposed
- same with `includeHiddenExperimental: true`: **5** preferred summaries; **1** proposed Structures link; **0** curriculum-authority links

### Compensating rollback rehearsal

- True SQL `BEGIN; <compensating deletes>; ROLLBACK;` was **not executable** without a Postgres session
- Equivalent rehearsal performed: compensating deletes → verified temporary **1 / 9 / 9 / 2** → reseed → verified restored **2 / 14 / 14 / 3** with Story retrieval intact
- Final durable state retains the Story seed

### Remaining risks / notes

1. Version `20261029180000` is now recorded as applied on remote (see §12). Many earlier local migrations remain remote-empty in `migration list` (including Opener `20261029120000`); that wider history gap is outside this Story-only reconciliation.
2. Stage 6B adapter wiring, promotion, deploy, and app-flag work remain unauthorized.
3. Native SQL transaction apply/ROLLBACK rehearsal remains desirable for future seeds when a direct Postgres session is available.

---

## 10. Gate assessment

| Gate | Step A | Step B | Notes |
|---|---|---|---|
| Exact Story boundary / five activities | Verified | Verified live | Includes THINK BIG; excludes p.107 |
| Component key unused (not `status=available`) | Verified | Inserted as `draft` | Key now present; status remains `draft` |
| Summary fidelity / evidence_status | Reviewed | Seeded live | All five sufficient / hidden / experimental |
| SS Structures link | Proposed | Seeded `proposed` | Vocabulary / I can… still withheld |
| Canonical SB/WB/SS hashes + fingerprints | Verified | Pinned live | Match approved values |
| Live totals / Opener unchanged | Precheck 1/9/9/2 | Postcheck 2/14/14/3 | Opener identities intact |
| Retrieval visibility | Designed | Verified live | Hidden unless explicitly enabled |
| Focused seed tests | — | 10/10 passed | New Story suite + Opener regression |
| Native SQL BEGIN/ROLLBACK | Designed | Partially blocked | Compensating delete+reseed rehearsed |
| Migration history `20261029180000` | Risk noted | **Reconciled** | Marked applied via CLI repair; see §12 |
| Stage 6B adapter | Not done | Not authorized | Separate brief |

---

## 11. Explicit non-actions retained

No Stage 6B; no app-code behaviour change beyond authorized Stage 6A seed/test/docs; no canonical SS/SB/WB edits; no schema/RLS change; no `.env.local` modification; no promotion; no deploy; no broad `supabase db push`. Older remote-empty migration-history entries remain a separate deferred audit risk.

---

## 12. Migration-history reconciliation attempt (2026-10-29)

**Objective:** mark local version `20261029180000` as applied on project `kivvmobjphtcgxoltqbc` without rerunning Story inserts.

### Live reconfirmation before repair

Re-read NLL rows only (service role). Confirmed again:

| Check | Result |
|---|---|
| Totals | **2 / 14 / 14 / 3** |
| Story component / memberships / summaries / SS link | exact match to approved record set and local migration content |
| Summary states | all five preferred v1; `hidden` + `experimental` |
| SS link | Structures / order 2 / `proposed` |
| WB p.107 membership | none |
| Opener | unchanged 1 component / 9 memberships / 9 summaries / 2 links |

No Story insert, delete, or reseed was performed in this reconciliation attempt.

### Remote history inspection

1. PostgREST/service-role probe of `supabase_migrations.schema_migrations` → schema not exposed (`Invalid schema: supabase_migrations`).
2. Public-schema probe of `schema_migrations` → table not present in API schema cache.
3. Supported CLI inspection from an isolated workdir (avoids root `.env.local` parse failure):

```text
npx supabase migration list --project-ref kivvmobjphtcgxoltqbc --linked
```

Result: `AccessTokenRequiredError` — no `supabase login` session and no `SUPABASE_ACCESS_TOKEN` in the environment. No database URL / DB password is available either.

Therefore remote applied/pending status for `20261029180000` could **not** be read through a supported channel in this checkout.

### Supported repair mechanism

Intended command (not executed successfully):

```text
npx supabase migration repair 20261029180000 --status applied --project-ref kivvmobjphtcgxoltqbc --linked
```

Same blocker: `AccessTokenRequiredError` (or, from the repo root, earlier `DbConfigLoadError` when the CLI tries to parse root `.env.local`).

### Actions not taken

- Did **not** manually INSERT/UPDATE `supabase_migrations` history tables.
- Did **not** rerun `20261029180000_seed_nll_be3_u08_story.sql`.
- Did **not** weaken migration fail-fast safeguards.
- Did **not** repeat compensating delete/reseed.
- Did **not** stage, commit, or push.

### Outcome (initial attempt)

**Unresolved.** Live Story knowledge remains correct at **2 / 14 / 14 / 3**. Migration-history reconciliation requires one of:

- `supabase login` / `SUPABASE_ACCESS_TOKEN` for `--linked` repair, or
- a Postgres `--db-url` / `--password` connection for `migration list` + `migration repair`

Then re-run:

```text
npx supabase migration list --project-ref kivvmobjphtcgxoltqbc --linked
npx supabase migration repair 20261029180000 --status applied --project-ref kivvmobjphtcgxoltqbc --linked
npx supabase migration list --project-ref kivvmobjphtcgxoltqbc --linked
```

and re-verify live NLL totals remain **2 / 14 / 14 / 3** with Opener unchanged.

### Resume attempt after owner reported CLI access available (2026-10-29 later)

Reconfirmed before any repair:

| Check | Result |
|---|---|
| Service-role project ref from `VITE_SUPABASE_URL` | `kivvmobjphtcgxoltqbc` |
| Live totals | **2 / 14 / 14 / 3** |
| Story rows vs approved local migration | exact match |
| Opener | unchanged **1 / 9 / 9 / 2** |
| Linked CLI project-ref file | absent (`supabase/.temp/project-ref` not present) |

CLI auth still unavailable **to this agent shell**:

```text
npx supabase whoami
npx supabase projects list
npx supabase migration list --project-ref kivvmobjphtcgxoltqbc --linked
```

All returned `AccessTokenRequiredError`. Checked and absent here:

- process / User / Machine `SUPABASE_ACCESS_TOKEN`
- `~/.supabase` access-token file
- `DATABASE_URL` / `SUPABASE_DB_PASSWORD`

Therefore `migration list` could not confirm whether `20261029180000` is absent, and:

```text
npx supabase migration repair 20261029180000 --status applied --project-ref kivvmobjphtcgxoltqbc --linked
```

was **not executed**.

No Story insert/delete/reseed; no manual history-table edit; migration fail-fast safeguards unchanged; no commit/push.

**Still unresolved at that moment** until the agent session could see a supported CLI credential.

### Successful reconciliation after `supabase login` (2026-10-29)

Owner completed Option A (`supabase login`) locally. Agent then:

1. Confirmed CLI identity via `npx supabase whoami` (no token printed).
2. Confirmed accessible project list includes `kivvmobjphtcgxoltqbc` (`zap_curriculum_mapper`, ACTIVE_HEALTHY).
3. Reconfirmed live NLL **2 / 14 / 14 / 3**, Story rows exact-match approved migration, Opener **1 / 9 / 9 / 2**.
4. Listed remote history (isolated CLI workdir to avoid root `.env.local` parse issues):

```text
npx supabase migration list --project-ref kivvmobjphtcgxoltqbc --linked
```

Before repair: `20261029180000` was local-only (`remote` empty).

5. Marked applied with supported repair only (Story seed SQL **not** re-run):

```text
npx supabase migration repair 20261029180000 --status applied --project-ref kivvmobjphtcgxoltqbc --linked --yes
```

CLI result: `Repaired migration history: [20261029180000] => applied`.

6. Re-listed history: `20261029180000` now shows `local` and `remote` both `20261029180000` (no longer pending for that version).
7. Reconfirmed live totals still **2 / 14 / 14 / 3**; Story match still true; Opener still **1 / 9 / 9 / 2**.

No Story insert/delete/reseed; no manual history-table SQL; migration fail-fast safeguards unchanged.

---

## 13. Formal Stage 6A owner acceptance (2026-10-29)

Owner formally accepted Stage 6A — Story Knowledge Readiness as complete.

| Accepted fact | Value |
|---|---|
| Live NLL totals | **2 / 14 / 14 / 3** |
| Story component | `be3-u08-story` remains `draft` |
| Summaries | Five preferred v1; `hidden` + `experimental` |
| Structures link | One link remains `proposed` |
| WB p.107 | Remains excluded |
| Opener | Unchanged **1 / 9 / 9 / 2** |
| Migration `20261029180000` | Recorded as applied remotely |
| Stage 6B | Remains unauthorized |
| Promotion / deployment / broad `db push` | Remain unauthorized |
| Older remote-empty migration history | Separate deferred audit risk |

Story knowledge is **live but hidden/experimental** — not promoted for normal use.
