-- LiA-A Step B: additive Neutral Lesson Library Language in Action seed.
-- Big English 3 Unit 8 Language in Action only (be3-u08-lia).
-- Does not modify Opener or Story rows or alter schema/RLS from
-- 20261029120000_create_nll_pilot.sql.
-- Ordinary inserts only: any collision aborts the transaction.

begin;

-- Fail-fast preconditions: approved baseline and every proposed identity
-- must still be unchanged and unused.
do $$
declare
  component_count integer;
  membership_count integer;
  summary_count integer;
  ss_link_count integer;
begin
  select count(*) into component_count from public.nll_components;
  select count(*) into membership_count from public.nll_component_activities;
  select count(*) into summary_count from public.nll_activity_summaries;
  select count(*) into ss_link_count from public.nll_ss_component_links;

  if component_count <> 2
     or membership_count <> 14
     or summary_count <> 14
     or ss_link_count <> 3 then
    raise exception 'LiA-A Step B precondition failed: expected approved NLL baseline 2/14/14/3, found %/%/%/%',
      component_count, membership_count, summary_count, ss_link_count;
  end if;

  if not exists (
    select 1 from public.nll_components
    where id = '3e800008-0000-4000-8000-000000000001'
      and component_key = 'be3-u08-opener'
      and status = 'draft'
  ) or not exists (
    select 1 from public.nll_components
    where id = '3e800008-0000-4000-8000-000000000002'
      and component_key = 'be3-u08-story'
      and status = 'draft'
  ) then
    raise exception 'LiA-A Step B precondition failed: accepted Opener/Story identities changed';
  end if;

  if exists (
    select 1 from public.nll_components
    where component_key = 'be3-u08-lia'
       or id = '3e800008-0000-4000-8000-000000000003'
  ) then
    raise exception 'LiA-A Step B precondition failed: component key or UUID already present';
  end if;

  if exists (
    select 1 from public.nll_activity_summaries
    where id in (
      'big_english_3_sb_unit_08_activity_08_summary_lia_a_v1',
      'big_english_3_sb_unit_08_activity_09_summary_lia_a_v1',
      'big_english_3_sb_unit_08_activity_10_summary_lia_a_v1',
      'big_english_3_sb_unit_08_activity_11_summary_lia_a_v1',
      'big_english_3_sb_unit_08_activity_12_summary_lia_a_v1',
      'big_english_3_wb_unit_08_p107_activity_7_summary_lia_a_v1',
      'big_english_3_wb_unit_08_p107_activity_8_summary_lia_a_v1',
      'big_english_3_wb_unit_08_p108_activity_9_summary_lia_a_v1',
      'big_english_3_wb_unit_08_p108_activity_10_summary_lia_a_v1'
    )
    or (activity_id, version) in (
      ('bep3_sb_act_08_08', 1),
      ('bep3_sb_act_08_09', 1),
      ('bep3_sb_act_08_10', 1),
      ('bep3_sb_act_08_11', 1),
      ('bep3_sb_act_08_12', 1),
      ('bep_3_wb_act_107_7', 1),
      ('bep_3_wb_act_107_8', 1),
      ('bep_3_wb_act_108_9', 1),
      ('bep_3_wb_act_108_10', 1)
    )
    or (
      is_preferred = true
      and activity_id in (
        'bep3_sb_act_08_08',
        'bep3_sb_act_08_09',
        'bep3_sb_act_08_10',
        'bep3_sb_act_08_11',
        'bep3_sb_act_08_12',
        'bep_3_wb_act_107_7',
        'bep_3_wb_act_107_8',
        'bep_3_wb_act_108_9',
        'bep_3_wb_act_108_10'
      )
    )
  ) then
    raise exception 'LiA-A Step B precondition failed: summary identity, version pair, or preferred slot already present';
  end if;

  if exists (
    select 1 from public.nll_component_activities
    where component_id = '3e800008-0000-4000-8000-000000000003'
       or activity_id in (
         'bep3_sb_act_08_08',
         'bep3_sb_act_08_09',
         'bep3_sb_act_08_10',
         'bep3_sb_act_08_11',
         'bep3_sb_act_08_12',
         'bep_3_wb_act_107_7',
         'bep_3_wb_act_107_8',
         'bep_3_wb_act_108_9',
         'bep_3_wb_act_108_10'
       )
  ) then
    raise exception 'LiA-A Step B precondition failed: LiA component or activity membership already present';
  end if;

  if exists (
    select 1 from public.nll_ss_component_links
    where id in (
      '3e800008-0000-4000-8000-000000000301',
      '3e800008-0000-4000-8000-000000000302'
    )
  ) then
    raise exception 'LiA-A Step B precondition failed: SS-link UUID already present';
  end if;
end $$;

insert into public.nll_components (id, component_key, title, status)
values (
  '3e800008-0000-4000-8000-000000000003',
  'be3-u08-lia',
  'Big English 3 Unit 8 Language in Action',
  'draft'
);

insert into public.nll_component_activities (component_id, activity_id, position)
values
  ('3e800008-0000-4000-8000-000000000003', 'bep3_sb_act_08_08', 1),
  ('3e800008-0000-4000-8000-000000000003', 'bep3_sb_act_08_09', 2),
  ('3e800008-0000-4000-8000-000000000003', 'bep3_sb_act_08_10', 3),
  ('3e800008-0000-4000-8000-000000000003', 'bep3_sb_act_08_11', 4),
  ('3e800008-0000-4000-8000-000000000003', 'bep3_sb_act_08_12', 5),
  ('3e800008-0000-4000-8000-000000000003', 'bep_3_wb_act_107_7', 6),
  ('3e800008-0000-4000-8000-000000000003', 'bep_3_wb_act_107_8', 7),
  ('3e800008-0000-4000-8000-000000000003', 'bep_3_wb_act_108_9', 8),
  ('3e800008-0000-4000-8000-000000000003', 'bep_3_wb_act_108_10', 9);

insert into public.nll_activity_summaries (
  id, activity_id, version, summary_text, canonical_path, canonical_sha256,
  activity_sha256, evidence_status, display_status, review_state,
  is_preferred, provenance
)
values
  (
    'big_english_3_sb_unit_08_activity_08_summary_lia_a_v1',
    'bep3_sb_act_08_08', 1,
    'Students listen to Audio 155, look at two Did …? question-and-short-answer models and use the healthy-living phrase bank to make more.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    '724834079145d53b8f6084b74517b38e3c82aa6252f5aaae2502c2caabd8462f',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"lia-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_09_summary_lia_a_v1',
    'bep3_sb_act_08_09', 1,
    'Students match five healthy-living phrase halves, make questions about yesterday and ask and answer them.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    '87a73133e696f67edbdb501a58dc6f0d8c30e45be39675df4d77a7da6a8309e9',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"lia-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_10_summary_lia_a_v1',
    'bep3_sb_act_08_10', 1,
    'Students complete four short dialogues with did or didn''t.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    '484f2a8af42268c5b9058ce265f3cfb30e6cf9b5f018b6940903099ffe5fe455',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"lia-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_11_summary_lia_a_v1',
    'bep3_sb_act_08_11', 1,
    'Students reorder words to make five questions about past activities, then ask them.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    'f52de88e3b0e6c68d98a8df078a56100d71f7c380e43b197b9044be4a9fed757',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"lia-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_12_summary_lia_a_v1',
    'bep3_sb_act_08_12', 1,
    'Students match six Did …? questions to answers, then change the answers.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    '220f25dd6ef5fe5683bcb041d252eea726ecc79956ba0a0be278377f7a0c73ba',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"lia-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p107_activity_7_summary_lia_a_v1',
    'bep_3_wb_act_107_7', 1,
    'Students listen to Audio 156 and place stickers to show what Grace and Carlos did on the weekend.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    '8d87e2f39b1159ea9695a99ae3d862e0561abdfc6970d7d31e659bfaec835f1b',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"lia-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p107_activity_8_summary_lia_a_v1',
    'bep_3_wb_act_107_8', 1,
    'Students complete two health-related dialogues with did or didn''t.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    'b1031c028795146942e2cf08d03d8295d4f06d3b38505266b37b66e51daaef56',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"lia-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p108_activity_9_summary_lia_a_v1',
    'bep_3_wb_act_108_9', 1,
    'Students use the illustrations to circle the past activity that completes each of three sentences about yesterday.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    'd505b0b98e5f8bcf58dc392f6caaa54d82b165ba64983d3f7b68f45dbbe5dd73',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"lia-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p108_activity_10_summary_lia_a_v1',
    'bep_3_wb_act_108_10', 1,
    'Students use the Activity 9 illustrations to answer seven Did …? questions with affirmative or negative short answers.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    'f8290f121ff0040d8657f3ca795ccbcf46abd9b7cd69758ae4e465055139ccba',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"lia-a-step-a-knowledge-prep-v0.1"}}'
  );

insert into public.nll_ss_component_links (
  id, component_id, ss_path, ss_sha256, unit_number_raw,
  column_order, category_name_raw, status
)
values
  (
    '3e800008-0000-4000-8000-000000000301',
    '3e800008-0000-4000-8000-000000000003',
    'big-english/big_english_3_sb/canonical/ss_v1.json',
    'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a',
    '8', 2, 'Structures', 'proposed'
  ),
  (
    '3e800008-0000-4000-8000-000000000302',
    '3e800008-0000-4000-8000-000000000003',
    'big-english/big_english_3_sb/canonical/ss_v1.json',
    'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a',
    '8', 7, 'I can...', 'proposed'
  );

-- Pre-commit assertions: commit only if every check passes.
do $$
declare
  lia_component_count integer;
  lia_membership_count integer;
  lia_summary_count integer;
  lia_ss_link_count integer;
  opener_identity_count integer;
  story_identity_count integer;
  component_count integer;
  membership_count integer;
  summary_count integer;
  ss_link_count integer;
begin
  select count(*) into lia_component_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000003'
    and component_key = 'be3-u08-lia'
    and title = 'Big English 3 Unit 8 Language in Action'
    and status = 'draft';
  if lia_component_count <> 1 then
    raise exception 'LiA-A Step B assertion failed: expected one exact draft LiA component';
  end if;

  select count(*) into lia_membership_count
  from public.nll_component_activities
  where component_id = '3e800008-0000-4000-8000-000000000003'
    and (activity_id, position) in (
      ('bep3_sb_act_08_08', 1),
      ('bep3_sb_act_08_09', 2),
      ('bep3_sb_act_08_10', 3),
      ('bep3_sb_act_08_11', 4),
      ('bep3_sb_act_08_12', 5),
      ('bep_3_wb_act_107_7', 6),
      ('bep_3_wb_act_107_8', 7),
      ('bep_3_wb_act_108_9', 8),
      ('bep_3_wb_act_108_10', 9)
    );
  if lia_membership_count <> 9 or (
    select count(*) from public.nll_component_activities
    where component_id = '3e800008-0000-4000-8000-000000000003'
  ) <> 9 then
    raise exception 'LiA-A Step B assertion failed: expected nine exact memberships in positions 1-9';
  end if;

  select count(*) into lia_summary_count
  from public.nll_activity_summaries
  where id in (
      'big_english_3_sb_unit_08_activity_08_summary_lia_a_v1',
      'big_english_3_sb_unit_08_activity_09_summary_lia_a_v1',
      'big_english_3_sb_unit_08_activity_10_summary_lia_a_v1',
      'big_english_3_sb_unit_08_activity_11_summary_lia_a_v1',
      'big_english_3_sb_unit_08_activity_12_summary_lia_a_v1',
      'big_english_3_wb_unit_08_p107_activity_7_summary_lia_a_v1',
      'big_english_3_wb_unit_08_p107_activity_8_summary_lia_a_v1',
      'big_english_3_wb_unit_08_p108_activity_9_summary_lia_a_v1',
      'big_english_3_wb_unit_08_p108_activity_10_summary_lia_a_v1'
    )
    and version = 1
    and evidence_status = 'sufficient'
    and display_status = 'hidden'
    and review_state = 'experimental'
    and is_preferred = true
    and provenance #>> '{generation,prompt_version}' = 'lia-a-step-a-knowledge-prep-v0.1';
  if lia_summary_count <> 9 then
    raise exception 'LiA-A Step B assertion failed: expected nine preferred v1 hidden experimental summaries';
  end if;

  select count(*) into lia_ss_link_count
  from public.nll_ss_component_links
  where component_id = '3e800008-0000-4000-8000-000000000003'
    and id in (
      '3e800008-0000-4000-8000-000000000301',
      '3e800008-0000-4000-8000-000000000302'
    )
    and ss_path = 'big-english/big_english_3_sb/canonical/ss_v1.json'
    and ss_sha256 = 'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a'
    and unit_number_raw = '8'
    and status = 'proposed'
    and (column_order, category_name_raw) in (
      (2, 'Structures'),
      (7, 'I can...')
    );
  if lia_ss_link_count <> 2 or (
    select count(*) from public.nll_ss_component_links
    where component_id = '3e800008-0000-4000-8000-000000000003'
  ) <> 2 then
    raise exception 'LiA-A Step B assertion failed: expected two exact proposed SS links';
  end if;

  select count(*) into opener_identity_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000001'
    and component_key = 'be3-u08-opener'
    and status = 'draft';
  select count(*) into story_identity_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000002'
    and component_key = 'be3-u08-story'
    and status = 'draft';
  if opener_identity_count <> 1 or story_identity_count <> 1 then
    raise exception 'LiA-A Step B assertion failed: accepted Opener/Story identities changed';
  end if;

  select count(*) into component_count from public.nll_components;
  select count(*) into membership_count from public.nll_component_activities;
  select count(*) into summary_count from public.nll_activity_summaries;
  select count(*) into ss_link_count from public.nll_ss_component_links;
  if component_count <> 3
     or membership_count <> 23
     or summary_count <> 23
     or ss_link_count <> 5 then
    raise exception 'LiA-A Step B assertion failed: expected post-insert totals 3/23/23/5, found %/%/%/%',
      component_count, membership_count, summary_count, ss_link_count;
  end if;
end $$;

commit;
