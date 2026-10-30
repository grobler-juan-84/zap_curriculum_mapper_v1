-- Writing-A Step B: additive Neutral Lesson Library Writing seed.
-- Big English 3 Unit 8 Writing only (be3-u08-writing).
-- Does not modify Opener, Story, LiA, Grammar, CLIL/P.E., or Culture rows or alter schema/RLS from
-- 20261029120000_create_nll_pilot.sql.
-- Ordinary inserts only: any collision aborts the transaction.
-- Local implementation only until separately authorized application.
-- Two proposed SS links: Writing + I can...

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

  if component_count <> 6
     or membership_count <> 53
     or summary_count <> 53
     or ss_link_count <> 6 then
    raise exception 'Writing-A Step B precondition failed: expected approved NLL baseline 6/53/53/6, found %/%/%/%',
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
  ) or not exists (
    select 1 from public.nll_components
    where id = '3e800008-0000-4000-8000-000000000006'
      and component_key = 'be3-u08-culture'
      and title = 'Big English 3 Unit 8 Culture Connection'
      and status = 'draft'
  ) then
    raise exception 'Writing-A Step B precondition failed: accepted Opener/Story/LiA/Grammar/CLIL/Culture identities changed';
  end if;

  if exists (
    select 1 from public.nll_components
    where component_key = 'be3-u08-writing'
       or id = '3e800008-0000-4000-8000-000000000007'
  ) then
    raise exception 'Writing-A Step B precondition failed: component key or UUID already present';
  end if;

  if exists (
    select 1 from public.nll_activity_summaries
    where id in (
      'big_english_3_sb_unit_08_activity_28_summary_writing_a_v1',
      'big_english_3_sb_unit_08_activity_29_summary_writing_a_v1',
      'big_english_3_sb_unit_08_activity_30_summary_writing_a_v1',
      'big_english_3_sb_unit_08_activity_31_summary_writing_a_v1',
      'big_english_3_wb_unit_08_p115_activity_24_summary_writing_a_v1',
      'big_english_3_wb_unit_08_p115_activity_25_summary_writing_a_v1',
      'big_english_3_wb_unit_08_p115_activity_26_summary_writing_a_v1'
    )
    or (activity_id, version) in (
      ('bep3_sb_act_08_28', 1),
      ('bep3_sb_act_08_29', 1),
      ('bep3_sb_act_08_30', 1),
      ('bep3_sb_act_08_31', 1),
      ('bep_3_wb_act_115_24', 1),
      ('bep_3_wb_act_115_25', 1),
      ('bep_3_wb_act_115_26', 1)
    )
    or (
      is_preferred = true
      and activity_id in (
         'bep3_sb_act_08_28',
         'bep3_sb_act_08_29',
         'bep3_sb_act_08_30',
         'bep3_sb_act_08_31',
         'bep_3_wb_act_115_24',
         'bep_3_wb_act_115_25',
         'bep_3_wb_act_115_26'
      )
    )
  ) then
    raise exception 'Writing-A Step B precondition failed: summary identity, version pair, or preferred slot already present';
  end if;

  if exists (
    select 1 from public.nll_component_activities
    where component_id = '3e800008-0000-4000-8000-000000000007'
       or activity_id in (
         'bep3_sb_act_08_28',
         'bep3_sb_act_08_29',
         'bep3_sb_act_08_30',
         'bep3_sb_act_08_31',
         'bep_3_wb_act_115_24',
         'bep_3_wb_act_115_25',
         'bep_3_wb_act_115_26'
       )
  ) then
    raise exception 'Writing-A Step B precondition failed: Writing component or activity membership already present';
  end if;

  if exists (
    select 1 from public.nll_ss_component_links
    where id in (
      '3e800008-0000-4000-8000-000000000701',
      '3e800008-0000-4000-8000-000000000702'
    )
       or component_id = '3e800008-0000-4000-8000-000000000007'
  ) then
    raise exception 'Writing-A Step B precondition failed: Writing SS-link identity already present';
  end if;
end $$;

insert into public.nll_components (id, component_key, title, status)
values (
  '3e800008-0000-4000-8000-000000000007',
  'be3-u08-writing',
  'Big English 3 Unit 8 Writing',
  'draft'
);

insert into public.nll_component_activities (component_id, activity_id, position)
values
  ('3e800008-0000-4000-8000-000000000007', 'bep3_sb_act_08_28', 1),
  ('3e800008-0000-4000-8000-000000000007', 'bep3_sb_act_08_29', 2),
  ('3e800008-0000-4000-8000-000000000007', 'bep3_sb_act_08_30', 3),
  ('3e800008-0000-4000-8000-000000000007', 'bep3_sb_act_08_31', 4),
  ('3e800008-0000-4000-8000-000000000007', 'bep_3_wb_act_115_24', 5),
  ('3e800008-0000-4000-8000-000000000007', 'bep_3_wb_act_115_25', 6),
  ('3e800008-0000-4000-8000-000000000007', 'bep_3_wb_act_115_26', 7);

insert into public.nll_activity_summaries (
  id, activity_id, version, summary_text, canonical_path, canonical_sha256,
  activity_sha256, evidence_status, display_status, review_state,
  is_preferred, provenance
)
values
  (
    'big_english_3_sb_unit_08_activity_28_summary_writing_a_v1',
    'bep3_sb_act_08_28', 1,
    'Students complete three keyed conjunction gaps, then listen to Audio 162 to check, without inventing a transcript or treating keyed answers as a student composition.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    'b27b71a97da7e774cce69485d9e44a560744b7862d75218a6d3aa60dbf01898c',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"writing-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_29_summary_writing_a_v1',
    'bep3_sb_act_08_29', 1,
    'Students join five keyed sentence pairs with and, but, or and write the combined sentences; keyed examples are not a student paragraph.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    'b951d44f268a7c89e4f6fcadcaca3bb5f6cf134a557f8f8369fa56ba49b68f3f',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"writing-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_30_summary_writing_a_v1',
    'bep3_sb_act_08_30', 1,
    'Students read and choose among and, but, or in four keyed items without reconstructing answers if the activity is excluded.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    '8377cffc7556d569987b71460898e76f5c38e66ecaf125912ad0640b5c328b84',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"writing-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_31_summary_writing_a_v1',
    'bep3_sb_act_08_31', 1,
    'Students write three open sentences about healthy habits using and, but, and or once each, without any invented sample response, rubric, or criteria.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    '437978d1169a7d8522b81fe8f800336bfb0f9e128f1e2f2995599688537e2326',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"writing-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p115_activity_24_summary_writing_a_v1',
    'bep_3_wb_act_115_24', 1,
    'Students read and circle the correct and, but, or choice in six keyed items.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    'dbc871979d68ef6816112c87f5ddb1dd0df7fa3c268dc06e3c7ae61a2134483c',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"writing-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p115_activity_25_summary_writing_a_v1',
    'bep_3_wb_act_115_25', 1,
    'Students complete four sentence stems using clause options from the box, preserving the box and visual dependency without inventing clauses.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    '4ac42b5c299e90b9d1a1c0508a27b75fc66e3db1e4865c2a060c82f244e3fc60',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"writing-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p115_activity_26_summary_writing_a_v1',
    'bep_3_wb_act_115_26', 1,
    'Students complete a six-gap paragraph cloze with or, but, or and without inventing paragraph content beyond the keyed task.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    'b1cebb0f0b60cd844e9347d3284708e7cec1b91a36fe3af9c10733772caf6aca',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"writing-a-step-a-knowledge-prep-v0.1"}}'
  );

insert into public.nll_ss_component_links (
  id, component_id, ss_path, ss_sha256, unit_number_raw,
  column_order, category_name_raw, status
)
values
  (
    '3e800008-0000-4000-8000-000000000701',
    '3e800008-0000-4000-8000-000000000007',
    'big-english/big_english_3_sb/canonical/ss_v1.json',
    'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a',
    '8', 4, 'Writing', 'proposed'
  ),
  (
    '3e800008-0000-4000-8000-000000000702',
    '3e800008-0000-4000-8000-000000000007',
    'big-english/big_english_3_sb/canonical/ss_v1.json',
    'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a',
    '8', 7, 'I can...', 'proposed'
  );

-- Pre-commit assertions: commit only if every check passes.
do $$
declare
  writing_component_count integer;
  writing_membership_count integer;
  writing_summary_count integer;
  writing_ss_link_count integer;
  opener_identity_count integer;
  story_identity_count integer;
  lia_identity_count integer;
  grammar_identity_count integer;
  clil_identity_count integer;
  culture_identity_count integer;
  component_count integer;
  membership_count integer;
  summary_count integer;
  ss_link_count integer;
  unexpected_summary_count integer;
begin
  select count(*) into writing_component_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000007'
    and component_key = 'be3-u08-writing'
    and title = 'Big English 3 Unit 8 Writing'
    and status = 'draft';
  if writing_component_count <> 1 then
    raise exception 'Writing-A Step B assertion failed: expected one exact draft Writing component';
  end if;

  select count(*) into writing_membership_count
  from public.nll_component_activities
  where component_id = '3e800008-0000-4000-8000-000000000007'
    and (activity_id, position) in (
      ('bep3_sb_act_08_28', 1),
      ('bep3_sb_act_08_29', 2),
      ('bep3_sb_act_08_30', 3),
      ('bep3_sb_act_08_31', 4),
      ('bep_3_wb_act_115_24', 5),
      ('bep_3_wb_act_115_25', 6),
      ('bep_3_wb_act_115_26', 7)
    );
  if writing_membership_count <> 7 then
    raise exception 'Writing-A Step B assertion failed: expected seven exact ordered Writing memberships';
  end if;

  select count(*) into writing_summary_count
  from public.nll_activity_summaries s
  where (s.id, s.activity_id, s.version, s.summary_text, s.canonical_path, s.canonical_sha256,
         s.activity_sha256, s.evidence_status, s.display_status, s.review_state,
         s.is_preferred, s.provenance) in (
        (
          'big_english_3_sb_unit_08_activity_28_summary_writing_a_v1',
          'bep3_sb_act_08_28',
          1,
          'Students complete three keyed conjunction gaps, then listen to Audio 162 to check, without inventing a transcript or treating keyed answers as a student composition.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          'b27b71a97da7e774cce69485d9e44a560744b7862d75218a6d3aa60dbf01898c',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"writing-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_sb_unit_08_activity_29_summary_writing_a_v1',
          'bep3_sb_act_08_29',
          1,
          'Students join five keyed sentence pairs with and, but, or and write the combined sentences; keyed examples are not a student paragraph.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          'b951d44f268a7c89e4f6fcadcaca3bb5f6cf134a557f8f8369fa56ba49b68f3f',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"writing-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_sb_unit_08_activity_30_summary_writing_a_v1',
          'bep3_sb_act_08_30',
          1,
          'Students read and choose among and, but, or in four keyed items without reconstructing answers if the activity is excluded.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          '8377cffc7556d569987b71460898e76f5c38e66ecaf125912ad0640b5c328b84',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"writing-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_sb_unit_08_activity_31_summary_writing_a_v1',
          'bep3_sb_act_08_31',
          1,
          'Students write three open sentences about healthy habits using and, but, and or once each, without any invented sample response, rubric, or criteria.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          '437978d1169a7d8522b81fe8f800336bfb0f9e128f1e2f2995599688537e2326',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"writing-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_wb_unit_08_p115_activity_24_summary_writing_a_v1',
          'bep_3_wb_act_115_24',
          1,
          'Students read and circle the correct and, but, or choice in six keyed items.',
          'big-english/big_english_3_wb/canonical/v1.json',
          '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
          'dbc871979d68ef6816112c87f5ddb1dd0df7fa3c268dc06e3c7ae61a2134483c',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"writing-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_wb_unit_08_p115_activity_25_summary_writing_a_v1',
          'bep_3_wb_act_115_25',
          1,
          'Students complete four sentence stems using clause options from the box, preserving the box and visual dependency without inventing clauses.',
          'big-english/big_english_3_wb/canonical/v1.json',
          '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
          '4ac42b5c299e90b9d1a1c0508a27b75fc66e3db1e4865c2a060c82f244e3fc60',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"writing-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_wb_unit_08_p115_activity_26_summary_writing_a_v1',
          'bep_3_wb_act_115_26',
          1,
          'Students complete a six-gap paragraph cloze with or, but, or and without inventing paragraph content beyond the keyed task.',
          'big-english/big_english_3_wb/canonical/v1.json',
          '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
          'b1cebb0f0b60cd844e9347d3284708e7cec1b91a36fe3af9c10733772caf6aca',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"writing-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        )
      );
  if writing_summary_count <> 7 then
    raise exception 'Writing-A Step B assertion failed: Writing summary rows do not exactly match the accepted payload mapping';
  end if;

  select count(*) into unexpected_summary_count
  from public.nll_activity_summaries
  where activity_id in (
         'bep3_sb_act_08_28',
         'bep3_sb_act_08_29',
         'bep3_sb_act_08_30',
         'bep3_sb_act_08_31',
         'bep_3_wb_act_115_24',
         'bep_3_wb_act_115_25',
         'bep_3_wb_act_115_26'
      )
    and id not in (
      'big_english_3_sb_unit_08_activity_28_summary_writing_a_v1',
      'big_english_3_sb_unit_08_activity_29_summary_writing_a_v1',
      'big_english_3_sb_unit_08_activity_30_summary_writing_a_v1',
      'big_english_3_sb_unit_08_activity_31_summary_writing_a_v1',
      'big_english_3_wb_unit_08_p115_activity_24_summary_writing_a_v1',
      'big_english_3_wb_unit_08_p115_activity_25_summary_writing_a_v1',
      'big_english_3_wb_unit_08_p115_activity_26_summary_writing_a_v1'
    );
  if unexpected_summary_count <> 0 then
    raise exception 'Writing-A Step B assertion failed: unexpected summaries present for Writing activity IDs';
  end if;

  select count(*) into writing_ss_link_count
  from public.nll_ss_component_links
  where component_id = '3e800008-0000-4000-8000-000000000007'
    and id in ('3e800008-0000-4000-8000-000000000701', '3e800008-0000-4000-8000-000000000702')
    and ss_path = 'big-english/big_english_3_sb/canonical/ss_v1.json'
    and ss_sha256 = 'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a'
    and unit_number_raw = '8'
    and status = 'proposed'
    and (
      (id = '3e800008-0000-4000-8000-000000000701' and column_order = 4 and category_name_raw = 'Writing')
      or (id = '3e800008-0000-4000-8000-000000000702' and column_order = 7 and category_name_raw = 'I can...')
    );
  if writing_ss_link_count <> 2 then
    raise exception 'Writing-A Step B assertion failed: expected exactly two proposed Writing SS links';
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
  select count(*) into culture_identity_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000006'
    and component_key = 'be3-u08-culture'
    and title = 'Big English 3 Unit 8 Culture Connection'
    and status = 'draft';
  if opener_identity_count <> 1
     or story_identity_count <> 1
     or lia_identity_count <> 1
     or grammar_identity_count <> 1
     or clil_identity_count <> 1
     or culture_identity_count <> 1 then
    raise exception 'Writing-A Step B assertion failed: existing component identities changed';
  end if;

  select count(*) into component_count from public.nll_components;
  select count(*) into membership_count from public.nll_component_activities;
  select count(*) into summary_count from public.nll_activity_summaries;
  select count(*) into ss_link_count from public.nll_ss_component_links;
  if component_count <> 7
     or membership_count <> 60
     or summary_count <> 60
     or ss_link_count <> 8 then
    raise exception 'Writing-A Step B assertion failed: expected post-insert totals 7/60/60/8, found %/%/%/%',
      component_count, membership_count, summary_count, ss_link_count;
  end if;
end $$;

commit;
