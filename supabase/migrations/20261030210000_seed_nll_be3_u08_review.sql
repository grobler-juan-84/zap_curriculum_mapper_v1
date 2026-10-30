-- Review-A Step B: additive Neutral Lesson Library Review seed.
-- Big English 3 Unit 8 Review only (be3-u08-review).
-- Chained after Phonics-A local migration 20261030200000 (post-Phonics baseline 8/68/68/9).
-- Does not modify prior component rows or alter schema/RLS.
-- Ordinary inserts only: any collision aborts the transaction.
-- Local implementation only until separately authorized application.
-- Zero component-level SS links (mixed consolidation / over-linking withheld).

begin;

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

  if component_count <> 8
     or membership_count <> 68
     or summary_count <> 68
     or ss_link_count <> 9 then
    raise exception 'Review-A Step B precondition failed: expected post-Phonics NLL baseline 8/68/68/9, found %/%/%/%',
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
  ) or not exists (
    select 1 from public.nll_components
    where id = '3e800008-0000-4000-8000-000000000007'
      and component_key = 'be3-u08-writing'
      and title = 'Big English 3 Unit 8 Writing'
      and status = 'draft'
  ) or not exists (
    select 1 from public.nll_components
    where id = '3e800008-0000-4000-8000-000000000008'
      and component_key = 'be3-u08-phonics'
      and title = 'Big English 3 Unit 8 Phonics'
      and status = 'draft'
  ) then
    raise exception 'Review-A Step B precondition failed: accepted prior component identities changed';
  end if;

  if exists (
    select 1 from public.nll_components
    where component_key = 'be3-u08-review'
       or id = '3e800008-0000-4000-8000-000000000009'
  ) then
    raise exception 'Review-A Step B precondition failed: component key or UUID already present';
  end if;

  if exists (
    select 1 from public.nll_activity_summaries
    where id in (
      'big_english_3_sb_unit_08_activity_39_summary_review_a_v1',
      'big_english_3_sb_unit_08_activity_40_summary_review_a_v1',
      'big_english_3_sb_unit_08_activity_41_summary_review_a_v1',
      'big_english_3_wb_unit_08_p117_activity_31_summary_review_a_v1',
      'big_english_3_wb_unit_08_p117_activity_32_summary_review_a_v1',
      'big_english_3_wb_unit_08_p117_activity_33_summary_review_a_v1'
    )
    or (activity_id, version) in (
      ('bep3_sb_act_08_39', 1),
      ('bep3_sb_act_08_40', 1),
      ('bep3_sb_act_08_41', 1),
      ('bep_3_wb_act_117_31', 1),
      ('bep_3_wb_act_117_32', 1),
      ('bep_3_wb_act_117_33', 1)
    )
    or (
      is_preferred = true
      and activity_id in (
         'bep3_sb_act_08_39',
         'bep3_sb_act_08_40',
         'bep3_sb_act_08_41',
         'bep_3_wb_act_117_31',
         'bep_3_wb_act_117_32',
         'bep_3_wb_act_117_33'
      )
    )
  ) then
    raise exception 'Review-A Step B precondition failed: summary identity, version pair, or preferred slot already present';
  end if;

  if exists (
    select 1 from public.nll_component_activities
    where component_id = '3e800008-0000-4000-8000-000000000009'
       or activity_id in (
         'bep3_sb_act_08_39',
         'bep3_sb_act_08_40',
         'bep3_sb_act_08_41',
         'bep_3_wb_act_117_31',
         'bep_3_wb_act_117_32',
         'bep_3_wb_act_117_33'
       )
  ) then
    raise exception 'Review-A Step B precondition failed: Review component or activity membership already present';
  end if;

  if exists (
    select 1 from public.nll_ss_component_links
    where component_id = '3e800008-0000-4000-8000-000000000009'
  ) then
    raise exception 'Review-A Step B precondition failed: Review SS-link identity already present';
  end if;
end $$;

insert into public.nll_components (id, component_key, title, status)
values (
  '3e800008-0000-4000-8000-000000000009',
  'be3-u08-review',
  'Big English 3 Unit 8 Review',
  'draft'
);

insert into public.nll_component_activities (component_id, activity_id, position)
values
  ('3e800008-0000-4000-8000-000000000009', 'bep3_sb_act_08_39', 1),
  ('3e800008-0000-4000-8000-000000000009', 'bep3_sb_act_08_40', 2),
  ('3e800008-0000-4000-8000-000000000009', 'bep3_sb_act_08_41', 3),
  ('3e800008-0000-4000-8000-000000000009', 'bep_3_wb_act_117_31', 4),
  ('3e800008-0000-4000-8000-000000000009', 'bep_3_wb_act_117_32', 5),
  ('3e800008-0000-4000-8000-000000000009', 'bep_3_wb_act_117_33', 6);

insert into public.nll_activity_summaries (
  id, activity_id, version, summary_text, canonical_path, canonical_sha256,
  activity_sha256, evidence_status, display_status, review_state,
  is_preferred, provenance
)
values
  (
    'big_english_3_sb_unit_08_activity_39_summary_review_a_v1',
    'bep3_sb_act_08_39', 1,
    'Students read and choose among Did, did, and didn''t forms in four keyed items without reconstructing answers if the activity is excluded.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    '1bb4b39ff4529d1e95892cb9851498deb90cfcb1b3f55500a85fc991cdbf0dcf',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"review-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_40_summary_review_a_v1',
    'bep3_sb_act_08_40', 1,
    'Students run an open class survey with publisher Did you…? frames, complete initial prompt cues, and add two of their own questions, without inventing personal answers or requiring disclosure.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    'e7ac38891bbffc268882cfd01e17b3b5ff34064393f7ca241bc55383da7e2ce1',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"review-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_41_summary_review_a_v1',
    'bep3_sb_act_08_41', 1,
    'Students complete six keyed past verb forms without reconstructing answers if the activity is excluded and without inventing SB audio.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    'd3caf3deddf110e8ca4d129750c42578b4943d70fa0a4d4de8c9f9c5e6143e7b',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"review-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p117_activity_31_summary_review_a_v1',
    'bep_3_wb_act_117_31', 1,
    'Students circle the correct verb form in three keyed items, preserving the page visual dependency without reconstructing excluded choices.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    'f4e92af38b4ebaca2fe915300de5026cc82239701ccce9ffb7ec71ae7f7df159',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"review-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p117_activity_32_summary_review_a_v1',
    'bep_3_wb_act_117_32', 1,
    'Students complete a six-gap cloze from the publisher word box without inventing box words or reconstructing excluded gaps.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    'e1deeee9dbbe6dde23f13c3047a2c325cbf9afba85d9ff1905aa86ba3604014f',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"review-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p117_activity_33_summary_review_a_v1',
    'bep_3_wb_act_117_33', 1,
    'Students complete five keyed gerund-as-subject sentences that remain Workbook-only evidence and must not be back-ported into Student Book Review summaries.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    '3333eaa10ad76b2cfe3828e21de7d46805369a83d728ecbb83c1c1d11c2f7c32',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"review-a-step-a-knowledge-prep-v0.1"}}'
  );

-- Pre-commit assertions: commit only if every check passes.
do $$
declare
  review_component_count integer;
  review_membership_count integer;
  review_summary_count integer;
  review_ss_link_count integer;
  prior_0_count integer;
  prior_1_count integer;
  prior_2_count integer;
  prior_3_count integer;
  prior_4_count integer;
  prior_5_count integer;
  prior_6_count integer;
  prior_7_count integer;
  component_count integer;
  membership_count integer;
  summary_count integer;
  ss_link_count integer;
  unexpected_summary_count integer;
begin
  select count(*) into review_component_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000009'
    and component_key = 'be3-u08-review'
    and title = 'Big English 3 Unit 8 Review'
    and status = 'draft';
  if review_component_count <> 1 then
    raise exception 'Review-A Step B assertion failed: expected one exact draft Review component';
  end if;

  select count(*) into review_membership_count
  from public.nll_component_activities
  where component_id = '3e800008-0000-4000-8000-000000000009'
    and (activity_id, position) in (
      ('bep3_sb_act_08_39', 1),
      ('bep3_sb_act_08_40', 2),
      ('bep3_sb_act_08_41', 3),
      ('bep_3_wb_act_117_31', 4),
      ('bep_3_wb_act_117_32', 5),
      ('bep_3_wb_act_117_33', 6)
    );
  if review_membership_count <> 6 then
    raise exception 'Review-A Step B assertion failed: expected six exact ordered Review memberships';
  end if;

  select count(*) into review_summary_count
  from public.nll_activity_summaries s
  where (s.id, s.activity_id, s.version, s.summary_text, s.canonical_path, s.canonical_sha256,
         s.activity_sha256, s.evidence_status, s.display_status, s.review_state,
         s.is_preferred, s.provenance) in (
        (
          'big_english_3_sb_unit_08_activity_39_summary_review_a_v1',
          'bep3_sb_act_08_39',
          1,
          'Students read and choose among Did, did, and didn''t forms in four keyed items without reconstructing answers if the activity is excluded.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          '1bb4b39ff4529d1e95892cb9851498deb90cfcb1b3f55500a85fc991cdbf0dcf',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"review-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_sb_unit_08_activity_40_summary_review_a_v1',
          'bep3_sb_act_08_40',
          1,
          'Students run an open class survey with publisher Did you…? frames, complete initial prompt cues, and add two of their own questions, without inventing personal answers or requiring disclosure.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          'e7ac38891bbffc268882cfd01e17b3b5ff34064393f7ca241bc55383da7e2ce1',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"review-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_sb_unit_08_activity_41_summary_review_a_v1',
          'bep3_sb_act_08_41',
          1,
          'Students complete six keyed past verb forms without reconstructing answers if the activity is excluded and without inventing SB audio.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          'd3caf3deddf110e8ca4d129750c42578b4943d70fa0a4d4de8c9f9c5e6143e7b',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"review-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_wb_unit_08_p117_activity_31_summary_review_a_v1',
          'bep_3_wb_act_117_31',
          1,
          'Students circle the correct verb form in three keyed items, preserving the page visual dependency without reconstructing excluded choices.',
          'big-english/big_english_3_wb/canonical/v1.json',
          '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
          'f4e92af38b4ebaca2fe915300de5026cc82239701ccce9ffb7ec71ae7f7df159',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"review-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_wb_unit_08_p117_activity_32_summary_review_a_v1',
          'bep_3_wb_act_117_32',
          1,
          'Students complete a six-gap cloze from the publisher word box without inventing box words or reconstructing excluded gaps.',
          'big-english/big_english_3_wb/canonical/v1.json',
          '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
          'e1deeee9dbbe6dde23f13c3047a2c325cbf9afba85d9ff1905aa86ba3604014f',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"review-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_wb_unit_08_p117_activity_33_summary_review_a_v1',
          'bep_3_wb_act_117_33',
          1,
          'Students complete five keyed gerund-as-subject sentences that remain Workbook-only evidence and must not be back-ported into Student Book Review summaries.',
          'big-english/big_english_3_wb/canonical/v1.json',
          '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
          '3333eaa10ad76b2cfe3828e21de7d46805369a83d728ecbb83c1c1d11c2f7c32',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"review-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        )
      );
  if review_summary_count <> 6 then
    raise exception 'Review-A Step B assertion failed: Review summary rows do not exactly match the accepted payload mapping';
  end if;

  select count(*) into unexpected_summary_count
  from public.nll_activity_summaries
  where activity_id in (
         'bep3_sb_act_08_39',
         'bep3_sb_act_08_40',
         'bep3_sb_act_08_41',
         'bep_3_wb_act_117_31',
         'bep_3_wb_act_117_32',
         'bep_3_wb_act_117_33'
      )
    and id not in (
      'big_english_3_sb_unit_08_activity_39_summary_review_a_v1',
      'big_english_3_sb_unit_08_activity_40_summary_review_a_v1',
      'big_english_3_sb_unit_08_activity_41_summary_review_a_v1',
      'big_english_3_wb_unit_08_p117_activity_31_summary_review_a_v1',
      'big_english_3_wb_unit_08_p117_activity_32_summary_review_a_v1',
      'big_english_3_wb_unit_08_p117_activity_33_summary_review_a_v1'
    );
  if unexpected_summary_count <> 0 then
    raise exception 'Review-A Step B assertion failed: unexpected summaries present for Review activity IDs';
  end if;

  select count(*) into review_ss_link_count
  from public.nll_ss_component_links
  where component_id = '3e800008-0000-4000-8000-000000000009';
  if review_ss_link_count <> 0 then
    raise exception 'Review-A Step B assertion failed: expected zero Review SS links';
  end if;

  select count(*) into prior_0_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000001'
    and component_key = 'be3-u08-opener'
    and title = 'Big English 3 Unit 8 Opener'
    and status = 'draft';
  select count(*) into prior_1_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000002'
    and component_key = 'be3-u08-story'
    and title = 'Big English 3 Unit 8 Story'
    and status = 'draft';
  select count(*) into prior_2_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000003'
    and component_key = 'be3-u08-lia'
    and title = 'Big English 3 Unit 8 Language in Action'
    and status = 'draft';
  select count(*) into prior_3_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000004'
    and component_key = 'be3-u08-grammar'
    and title = 'Big English 3 Unit 8 Grammar'
    and status = 'draft';
  select count(*) into prior_4_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000005'
    and component_key = 'be3-u08-clil-pe'
    and title = 'Big English 3 Unit 8 Content Connection / P.E.'
    and status = 'draft';
  select count(*) into prior_5_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000006'
    and component_key = 'be3-u08-culture'
    and title = 'Big English 3 Unit 8 Culture Connection'
    and status = 'draft';
  select count(*) into prior_6_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000007'
    and component_key = 'be3-u08-writing'
    and title = 'Big English 3 Unit 8 Writing'
    and status = 'draft';
  select count(*) into prior_7_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000008'
    and component_key = 'be3-u08-phonics'
    and title = 'Big English 3 Unit 8 Phonics'
    and status = 'draft';
  if prior_0_count <> 1
     or prior_1_count <> 1
     or prior_2_count <> 1
     or prior_3_count <> 1
     or prior_4_count <> 1
     or prior_5_count <> 1
     or prior_6_count <> 1
     or prior_7_count <> 1 then
    raise exception 'Review-A Step B assertion failed: existing component identities changed';
  end if;

  select count(*) into component_count from public.nll_components;
  select count(*) into membership_count from public.nll_component_activities;
  select count(*) into summary_count from public.nll_activity_summaries;
  select count(*) into ss_link_count from public.nll_ss_component_links;
  if component_count <> 9
     or membership_count <> 74
     or summary_count <> 74
     or ss_link_count <> 9 then
    raise exception 'Review-A Step B assertion failed: expected post-insert totals 9/74/74/9, found %/%/%/%',
      component_count, membership_count, summary_count, ss_link_count;
  end if;
end $$;

commit;
