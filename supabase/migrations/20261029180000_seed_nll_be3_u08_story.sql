-- Stage 6A Step B: additive Neutral Lesson Library Story seed.
-- Big English 3 Unit 8 Story only (be3-u08-story).
-- Does not modify Opener rows or alter schema/RLS from
-- 20261029120000_create_nll_pilot.sql.
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
