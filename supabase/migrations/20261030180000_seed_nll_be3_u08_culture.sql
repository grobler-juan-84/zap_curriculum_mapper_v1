-- Culture-A Step B: additive Neutral Lesson Library Culture Connection seed.
-- Big English 3 Unit 8 Culture only (be3-u08-culture).
-- Does not modify Opener, Story, LiA, Grammar, or CLIL/P.E. rows or alter schema/RLS from
-- 20261029120000_create_nll_pilot.sql.
-- Ordinary inserts only: any collision aborts the transaction.
-- Local implementation only until separately authorized application.
-- Zero SS links by accepted knowledge decision.

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

  if component_count <> 5
     or membership_count <> 44
     or summary_count <> 44
     or ss_link_count <> 6 then
    raise exception 'Culture-A Step B precondition failed: expected approved NLL baseline 5/44/44/6, found %/%/%/%',
      component_count, membership_count, summary_count, ss_link_count;
  end if;

  if not exists (
    select 1 from public.nll_components
    where id = '3e800008-0000-4000-8000-000000000001'
      and component_key = 'be3-u08-opener'
      and title = 'Big English 3 Unit 8 Opener'
      and status = 'draft'
  ) or not exists (
    select 1 from public.nll_components
    where id = '3e800008-0000-4000-8000-000000000002'
      and component_key = 'be3-u08-story'
      and title = 'Big English 3 Unit 8 Story'
      and status = 'draft'
  ) or not exists (
    select 1 from public.nll_components
    where id = '3e800008-0000-4000-8000-000000000003'
      and component_key = 'be3-u08-lia'
      and title = 'Big English 3 Unit 8 Language in Action'
      and status = 'draft'
  ) or not exists (
    select 1 from public.nll_components
    where id = '3e800008-0000-4000-8000-000000000004'
      and component_key = 'be3-u08-grammar'
      and title = 'Big English 3 Unit 8 Grammar'
      and status = 'draft'
  ) or not exists (
    select 1 from public.nll_components
    where id = '3e800008-0000-4000-8000-000000000005'
      and component_key = 'be3-u08-clil-pe'
      and title = 'Big English 3 Unit 8 Content Connection / P.E.'
      and status = 'draft'
  ) then
    raise exception 'Culture-A Step B precondition failed: accepted Opener/Story/LiA/Grammar/CLIL identities changed';
  end if;

  if exists (
    select 1 from public.nll_components
    where component_key = 'be3-u08-culture'
       or id = '3e800008-0000-4000-8000-000000000006'
  ) then
    raise exception 'Culture-A Step B precondition failed: component key or UUID already present';
  end if;

  if exists (
    select 1 from public.nll_activity_summaries
    where id in (
      'big_english_3_sb_unit_08_activity_24_summary_culture_a_v1',
      'big_english_3_sb_unit_08_activity_25_summary_culture_a_v1',
      'big_english_3_sb_unit_08_activity_26_summary_culture_a_v1',
      'big_english_3_sb_unit_08_activity_27_summary_culture_a_v1',
      'big_english_3_wb_unit_08_p113_activity_20_summary_culture_a_v1',
      'big_english_3_wb_unit_08_p113_activity_21_summary_culture_a_v1',
      'big_english_3_wb_unit_08_p114_activity_22_summary_culture_a_v1',
      'big_english_3_wb_unit_08_p114_activity_23_summary_culture_a_v1',
      'big_english_3_wb_unit_08_p114_think_big_summary_culture_a_v1'
    )
    or (activity_id, version) in (
      ('bep3_sb_act_08_24', 1),
      ('bep3_sb_act_08_25', 1),
      ('bep3_sb_act_08_26', 1),
      ('bep3_sb_act_08_27', 1),
      ('bep_3_wb_act_113_20', 1),
      ('bep_3_wb_act_113_21', 1),
      ('bep_3_wb_act_114_22', 1),
      ('bep_3_wb_act_114_23', 1),
      ('bep_3_wb_act_114_tb', 1)
    )
    or (
      is_preferred = true
      and activity_id in (
         'bep3_sb_act_08_24',
         'bep3_sb_act_08_25',
         'bep3_sb_act_08_26',
         'bep3_sb_act_08_27',
         'bep_3_wb_act_113_20',
         'bep_3_wb_act_113_21',
         'bep_3_wb_act_114_22',
         'bep_3_wb_act_114_23',
         'bep_3_wb_act_114_tb'
      )
    )
  ) then
    raise exception 'Culture-A Step B precondition failed: summary identity, version pair, or preferred slot already present';
  end if;

  if exists (
    select 1 from public.nll_component_activities
    where component_id = '3e800008-0000-4000-8000-000000000006'
       or activity_id in (
         'bep3_sb_act_08_24',
         'bep3_sb_act_08_25',
         'bep3_sb_act_08_26',
         'bep3_sb_act_08_27',
         'bep_3_wb_act_113_20',
         'bep_3_wb_act_113_21',
         'bep_3_wb_act_114_22',
         'bep_3_wb_act_114_23',
         'bep_3_wb_act_114_tb'
       )
  ) then
    raise exception 'Culture-A Step B precondition failed: Culture component or activity membership already present';
  end if;

  if exists (
    select 1 from public.nll_ss_component_links
    where id = '3e800008-0000-4000-8000-000000000601'
       or component_id = '3e800008-0000-4000-8000-000000000006'
  ) then
    raise exception 'Culture-A Step B precondition failed: unexpected Culture SS-link identity already present';
  end if;
end $$;

insert into public.nll_components (id, component_key, title, status)
values (
  '3e800008-0000-4000-8000-000000000006',
  'be3-u08-culture',
  'Big English 3 Unit 8 Culture Connection',
  'draft'
);

insert into public.nll_component_activities (component_id, activity_id, position)
values
  ('3e800008-0000-4000-8000-000000000006', 'bep3_sb_act_08_24', 1),
  ('3e800008-0000-4000-8000-000000000006', 'bep3_sb_act_08_25', 2),
  ('3e800008-0000-4000-8000-000000000006', 'bep3_sb_act_08_26', 3),
  ('3e800008-0000-4000-8000-000000000006', 'bep3_sb_act_08_27', 4),
  ('3e800008-0000-4000-8000-000000000006', 'bep_3_wb_act_113_20', 5),
  ('3e800008-0000-4000-8000-000000000006', 'bep_3_wb_act_113_21', 6),
  ('3e800008-0000-4000-8000-000000000006', 'bep_3_wb_act_114_22', 7),
  ('3e800008-0000-4000-8000-000000000006', 'bep_3_wb_act_114_23', 8),
  ('3e800008-0000-4000-8000-000000000006', 'bep_3_wb_act_114_tb', 9);

insert into public.nll_activity_summaries (
  id, activity_id, version, summary_text, canonical_path, canonical_sha256,
  activity_sha256, evidence_status, display_status, review_state,
  is_preferred, provenance
)
values
  (
    'big_english_3_sb_unit_08_activity_24_summary_culture_a_v1',
    'bep3_sb_act_08_24', 1,
    'Students work with a partner to match listed sports to country options or add their own; the matching is open and not keyed.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    '91d73d467b5a0f3d250a8e3b707e37baa435972a8bd0f556e574f738ebb7c19f',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"culture-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_25_summary_culture_a_v1',
    'bep3_sb_act_08_25', 1,
    'Students listen to Audio 160 and read about publisher-labelled strange sports to identify when people started them, preserving the visual dependency.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    '765aa1c97c1fd5f6c48f7939b3e9509f5ee142bc74d2e26ea4559a981151146f',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"culture-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_26_summary_culture_a_v1',
    'bep3_sb_act_08_26', 1,
    'Students look at Activity 25 and say true or false for five claims without reconstructing excluded reading evidence.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    'c7fd13fff75b8c9450bd69bf89eefb7555d38176015ebea6da5234aae926ca31',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"culture-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_27_summary_culture_a_v1',
    'bep3_sb_act_08_27', 1,
    'Students complete the sports chart for origin, description, similar sports, and reason started, preserving the chart and layout dependency.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    '53d699c4da14681ae91035e58ea6b586e6f047f5d075d47338c38393126e1f14',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"culture-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p113_activity_20_summary_culture_a_v1',
    'bep_3_wb_act_113_20', 1,
    'Students look at Activity 21 and quickly match three sentence halves about the sports, without reconstructing excluded Activity 21 evidence.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    'caaae9a48c0d8af780ff7ef9507b8d3f1e3e2366cba50c2927dfe66ae9230ce4',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"culture-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p113_activity_21_summary_culture_a_v1',
    'bep_3_wb_act_113_21', 1,
    'Students listen, read, and write gaps from the word box, using Audio 161 to check without inventing audio wording.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    '4ea2ea0261684b617d610de920784b1793819e9ba7517d17cae7b09095d5f18f',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"culture-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p114_activity_22_summary_culture_a_v1',
    'bep_3_wb_act_114_22', 1,
    'Students read and match five sentence halves about how and why the sports started.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    'b0b3a02d50803e98713b052c60297bc5c23a06f1a4cd074dfccd0bfe3b56d381',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"culture-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p114_activity_23_summary_culture_a_v1',
    'bep_3_wb_act_114_23', 1,
    'Students circle true or false for five claims about the sports without dumping answer keys.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    'bce7fc8beccd52654a5e2c6f8697482524605a819f8720e2a72bd0abd1e8ce5c',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"culture-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p114_think_big_summary_culture_a_v1',
    'bep_3_wb_act_114_tb', 1,
    'Students invent a strange sport, then draw and describe it using the Think Big prompt.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    '80eb227d16b30df0fbc01e6e45184a31adbf0c25ff2f1a1f0a861b1a97ba9bf8',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"culture-a-step-a-knowledge-prep-v0.1"}}'
  );

-- Pre-commit assertions: commit only if every check passes.
do $$
declare
  culture_component_count integer;
  culture_membership_count integer;
  culture_summary_count integer;
  culture_ss_link_count integer;
  opener_identity_count integer;
  story_identity_count integer;
  lia_identity_count integer;
  grammar_identity_count integer;
  clil_identity_count integer;
  component_count integer;
  membership_count integer;
  summary_count integer;
  ss_link_count integer;
begin
  select count(*) into culture_component_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000006'
    and component_key = 'be3-u08-culture'
    and title = 'Big English 3 Unit 8 Culture Connection'
    and status = 'draft';
  if culture_component_count <> 1 then
    raise exception 'Culture-A Step B assertion failed: expected one exact draft Culture component';
  end if;

  select count(*) into culture_membership_count
  from public.nll_component_activities
  where component_id = '3e800008-0000-4000-8000-000000000006'
    and (activity_id, position) in (
      ('bep3_sb_act_08_24', 1),
      ('bep3_sb_act_08_25', 2),
      ('bep3_sb_act_08_26', 3),
      ('bep3_sb_act_08_27', 4),
      ('bep_3_wb_act_113_20', 5),
      ('bep_3_wb_act_113_21', 6),
      ('bep_3_wb_act_114_22', 7),
      ('bep_3_wb_act_114_23', 8),
      ('bep_3_wb_act_114_tb', 9)
    );
  if culture_membership_count <> 9 or (
    select count(*) from public.nll_component_activities
    where component_id = '3e800008-0000-4000-8000-000000000006'
  ) <> 9 then
    raise exception 'Culture-A Step B assertion failed: expected nine exact memberships in positions 1-9';
  end if;

  select count(*) into culture_summary_count
  from (
    (
      select
        id,
        activity_id,
        version,
        summary_text,
        canonical_path,
        canonical_sha256,
        activity_sha256,
        evidence_status,
        display_status,
        review_state,
        is_preferred,
        provenance
      from public.nll_activity_summaries
      where activity_id in (
         'bep3_sb_act_08_24',
         'bep3_sb_act_08_25',
         'bep3_sb_act_08_26',
         'bep3_sb_act_08_27',
         'bep_3_wb_act_113_20',
         'bep_3_wb_act_113_21',
         'bep_3_wb_act_114_22',
         'bep_3_wb_act_114_23',
         'bep_3_wb_act_114_tb'
      )
    )
    except
    (
      values
        (
          'big_english_3_sb_unit_08_activity_24_summary_culture_a_v1',
          'bep3_sb_act_08_24',
          1,
          'Students work with a partner to match listed sports to country options or add their own; the matching is open and not keyed.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          '91d73d467b5a0f3d250a8e3b707e37baa435972a8bd0f556e574f738ebb7c19f',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"culture-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_sb_unit_08_activity_25_summary_culture_a_v1',
          'bep3_sb_act_08_25',
          1,
          'Students listen to Audio 160 and read about publisher-labelled strange sports to identify when people started them, preserving the visual dependency.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          '765aa1c97c1fd5f6c48f7939b3e9509f5ee142bc74d2e26ea4559a981151146f',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"culture-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_sb_unit_08_activity_26_summary_culture_a_v1',
          'bep3_sb_act_08_26',
          1,
          'Students look at Activity 25 and say true or false for five claims without reconstructing excluded reading evidence.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          'c7fd13fff75b8c9450bd69bf89eefb7555d38176015ebea6da5234aae926ca31',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"culture-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_sb_unit_08_activity_27_summary_culture_a_v1',
          'bep3_sb_act_08_27',
          1,
          'Students complete the sports chart for origin, description, similar sports, and reason started, preserving the chart and layout dependency.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          '53d699c4da14681ae91035e58ea6b586e6f047f5d075d47338c38393126e1f14',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"culture-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_wb_unit_08_p113_activity_20_summary_culture_a_v1',
          'bep_3_wb_act_113_20',
          1,
          'Students look at Activity 21 and quickly match three sentence halves about the sports, without reconstructing excluded Activity 21 evidence.',
          'big-english/big_english_3_wb/canonical/v1.json',
          '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
          'caaae9a48c0d8af780ff7ef9507b8d3f1e3e2366cba50c2927dfe66ae9230ce4',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"culture-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_wb_unit_08_p113_activity_21_summary_culture_a_v1',
          'bep_3_wb_act_113_21',
          1,
          'Students listen, read, and write gaps from the word box, using Audio 161 to check without inventing audio wording.',
          'big-english/big_english_3_wb/canonical/v1.json',
          '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
          '4ea2ea0261684b617d610de920784b1793819e9ba7517d17cae7b09095d5f18f',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"culture-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_wb_unit_08_p114_activity_22_summary_culture_a_v1',
          'bep_3_wb_act_114_22',
          1,
          'Students read and match five sentence halves about how and why the sports started.',
          'big-english/big_english_3_wb/canonical/v1.json',
          '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
          'b0b3a02d50803e98713b052c60297bc5c23a06f1a4cd074dfccd0bfe3b56d381',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"culture-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_wb_unit_08_p114_activity_23_summary_culture_a_v1',
          'bep_3_wb_act_114_23',
          1,
          'Students circle true or false for five claims about the sports without dumping answer keys.',
          'big-english/big_english_3_wb/canonical/v1.json',
          '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
          'bce7fc8beccd52654a5e2c6f8697482524605a819f8720e2a72bd0abd1e8ce5c',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"culture-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_wb_unit_08_p114_think_big_summary_culture_a_v1',
          'bep_3_wb_act_114_tb',
          1,
          'Students invent a strange sport, then draw and describe it using the Think Big prompt.',
          'big-english/big_english_3_wb/canonical/v1.json',
          '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
          '80eb227d16b30df0fbc01e6e45184a31adbf0c25ff2f1a1f0a861b1a97ba9bf8',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"culture-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        )
    )
  ) as summary_mismatches;
  if culture_summary_count <> 0 then
    raise exception 'Culture-A Step B assertion failed: Culture summary rows do not exactly match the accepted payload mapping';
  end if;

  if (
    select count(*) from public.nll_activity_summaries
    where activity_id in (
         'bep3_sb_act_08_24',
         'bep3_sb_act_08_25',
         'bep3_sb_act_08_26',
         'bep3_sb_act_08_27',
         'bep_3_wb_act_113_20',
         'bep_3_wb_act_113_21',
         'bep_3_wb_act_114_22',
         'bep_3_wb_act_114_23',
         'bep_3_wb_act_114_tb'
    )
  ) <> 9 then
    raise exception 'Culture-A Step B assertion failed: expected exactly nine summaries for Culture activity IDs';
  end if;

  if (
    select count(*) from public.nll_activity_summaries
    where id in (
      'big_english_3_sb_unit_08_activity_24_summary_culture_a_v1',
      'big_english_3_sb_unit_08_activity_25_summary_culture_a_v1',
      'big_english_3_sb_unit_08_activity_26_summary_culture_a_v1',
      'big_english_3_sb_unit_08_activity_27_summary_culture_a_v1',
      'big_english_3_wb_unit_08_p113_activity_20_summary_culture_a_v1',
      'big_english_3_wb_unit_08_p113_activity_21_summary_culture_a_v1',
      'big_english_3_wb_unit_08_p114_activity_22_summary_culture_a_v1',
      'big_english_3_wb_unit_08_p114_activity_23_summary_culture_a_v1',
      'big_english_3_wb_unit_08_p114_think_big_summary_culture_a_v1'
    )
  ) <> 9 then
    raise exception 'Culture-A Step B assertion failed: expected exactly the nine accepted Culture summary IDs';
  end if;

  select count(*) into culture_ss_link_count
  from public.nll_ss_component_links
  where component_id = '3e800008-0000-4000-8000-000000000006';
  if culture_ss_link_count <> 0 then
    raise exception 'Culture-A Step B assertion failed: expected zero Culture SS links';
  end if;

  select count(*) into opener_identity_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000001'
    and component_key = 'be3-u08-opener'
    and title = 'Big English 3 Unit 8 Opener'
    and status = 'draft';
  select count(*) into story_identity_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000002'
    and component_key = 'be3-u08-story'
    and title = 'Big English 3 Unit 8 Story'
    and status = 'draft';
  select count(*) into lia_identity_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000003'
    and component_key = 'be3-u08-lia'
    and title = 'Big English 3 Unit 8 Language in Action'
    and status = 'draft';
  select count(*) into grammar_identity_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000004'
    and component_key = 'be3-u08-grammar'
    and title = 'Big English 3 Unit 8 Grammar'
    and status = 'draft';
  select count(*) into clil_identity_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000005'
    and component_key = 'be3-u08-clil-pe'
    and title = 'Big English 3 Unit 8 Content Connection / P.E.'
    and status = 'draft';
  if opener_identity_count <> 1
     or story_identity_count <> 1
     or lia_identity_count <> 1
     or grammar_identity_count <> 1
     or clil_identity_count <> 1 then
    raise exception 'Culture-A Step B assertion failed: accepted Opener/Story/LiA/Grammar/CLIL identities changed';
  end if;

  select count(*) into component_count from public.nll_components;
  select count(*) into membership_count from public.nll_component_activities;
  select count(*) into summary_count from public.nll_activity_summaries;
  select count(*) into ss_link_count from public.nll_ss_component_links;
  if component_count <> 6
     or membership_count <> 53
     or summary_count <> 53
     or ss_link_count <> 6 then
    raise exception 'Culture-A Step B assertion failed: expected post-insert totals 6/53/53/6, found %/%/%/%',
      component_count, membership_count, summary_count, ss_link_count;
  end if;
end $$;

commit;
