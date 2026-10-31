-- Values NLL knowledge seed (modal activity summaries only).
-- Big English 3 Unit 8 Values only (be3-u08-values).
-- Chained after Review-A migration 20261030210000 (post-Review baseline 9/74/74/9).
-- Does not modify prior component rows or alter schema/RLS.
-- Ordinary inserts only: any collision aborts the transaction.
-- Local preparation only — application is a separate explicit gate.
-- Knowledge component for shared modal summaries; no Values package/renderer/adapter/flag.
-- Values remains generic sb_only; no Workbook companion invented.
-- One proposed SS link: Unit 8 Values column_order 6; approved SS pin ss_v1.json
-- (hash f6f756…bb5a) cell raw_text / entries_raw exact locator "Get exercise."

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

  if component_count <> 9
     or membership_count <> 74
     or summary_count <> 74
     or ss_link_count <> 9 then
    raise exception 'Values NLL seed precondition failed: expected post-Review NLL baseline 9/74/74/9, found %/%/%/%',
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
  ) or not exists (
    select 1 from public.nll_components
    where id = '3e800008-0000-4000-8000-000000000009'
      and component_key = 'be3-u08-review'
      and title = 'Big English 3 Unit 8 Review'
      and status = 'draft'
  ) then
    raise exception 'Values NLL seed precondition failed: accepted prior component identities changed';
  end if;

  if exists (
    select 1 from public.nll_components
    where component_key = 'be3-u08-values'
       or id = '3e800008-0000-4000-8000-000000000010'
  ) then
    raise exception 'Values NLL seed precondition failed: component key or UUID already present';
  end if;

  if exists (
    select 1 from public.nll_activity_summaries
    where id in (
      'big_english_3_sb_unit_08_activity_36_summary_values_nll_v1',
      'big_english_3_sb_unit_08_activity_37_summary_values_nll_v1',
      'big_english_3_sb_unit_08_activity_38_summary_values_nll_v1'
    )
    or (activity_id, version) in (
      ('bep3_sb_act_08_36', 1),
      ('bep3_sb_act_08_37', 1),
      ('bep3_sb_act_08_38', 1)
    )
    or (
      is_preferred = true
      and activity_id in (
         'bep3_sb_act_08_36',
         'bep3_sb_act_08_37',
         'bep3_sb_act_08_38'
      )
    )
  ) then
    raise exception 'Values NLL seed precondition failed: summary identity, version pair, or preferred slot already present';
  end if;

  if exists (
    select 1 from public.nll_component_activities
    where component_id = '3e800008-0000-4000-8000-000000000010'
       or activity_id in (
         'bep3_sb_act_08_36',
         'bep3_sb_act_08_37',
         'bep3_sb_act_08_38'
       )
  ) then
    raise exception 'Values NLL seed precondition failed: Values component or activity membership already present';
  end if;

  if exists (
    select 1 from public.nll_ss_component_links
    where id = '3e800008-0000-4000-8000-000000001001'
       or component_id = '3e800008-0000-4000-8000-000000000010'
  ) then
    raise exception 'Values NLL seed precondition failed: Values SS-link identity already present';
  end if;
end $$;

insert into public.nll_components (id, component_key, title, status)
values (
  '3e800008-0000-4000-8000-000000000010',
  'be3-u08-values',
  'Big English 3 Unit 8 Values',
  'draft'
);

insert into public.nll_component_activities (component_id, activity_id, position)
values
  ('3e800008-0000-4000-8000-000000000010', 'bep3_sb_act_08_36', 1),
  ('3e800008-0000-4000-8000-000000000010', 'bep3_sb_act_08_37', 2),
  ('3e800008-0000-4000-8000-000000000010', 'bep3_sb_act_08_38', 3);

insert into public.nll_activity_summaries (
  id, activity_id, version, summary_text, canonical_path, canonical_sha256,
  activity_sha256, evidence_status, display_status, review_state,
  is_preferred, provenance
)
values
  (
    'big_english_3_sb_unit_08_activity_36_summary_values_nll_v1',
    'bep3_sb_act_08_36', 1,
    'Students listen to Audio 168 and classify four pictured activities as healthy or unhealthy.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    '904d555171527fc0edb93360096c82c48ba1031048209bddcf2f96ccf3b3fd97',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"human_authored_from_canonical_evidence","prompt_version":"values-nll-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_37_summary_values_nll_v1',
    'bep3_sb_act_08_37', 1,
    'Students use the publisher language frames to tell a partner to do healthy things.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    '28c0f42aa137bf610df5a35223101738043cf0a0f4d7fc6e2bd1c058431880b4',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"human_authored_from_canonical_evidence","prompt_version":"values-nll-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_38_summary_values_nll_v1',
    'bep3_sb_act_08_38', 1,
    'Students invent an outdoor game with a group, write the rules, and teach it to the class.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    '4b150a90e379b435969e2977869f48d972236ff56898575928177a58ba7f740e',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"human_authored_from_canonical_evidence","prompt_version":"values-nll-knowledge-prep-v0.1"}}'
  );

insert into public.nll_ss_component_links (
  id, component_id, ss_path, ss_sha256, unit_number_raw, column_order, category_name_raw, status
)
values
  (
    '3e800008-0000-4000-8000-000000001001',
    '3e800008-0000-4000-8000-000000000010',
    'big-english/big_english_3_sb/canonical/ss_v1.json',
    'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a',
    '8', 6, 'Values', 'proposed'
  );

-- Pre-commit assertions: commit only if every check passes.
do $$
declare
  values_component_count integer;
  values_membership_count integer;
  values_summary_count integer;
  values_ss_link_count integer;
  prior_0_count integer;
  prior_1_count integer;
  prior_2_count integer;
  prior_3_count integer;
  prior_4_count integer;
  prior_5_count integer;
  prior_6_count integer;
  prior_7_count integer;
  prior_8_count integer;
  component_count integer;
  membership_count integer;
  summary_count integer;
  ss_link_count integer;
  unexpected_summary_count integer;
begin
  select count(*) into values_component_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000010'
    and component_key = 'be3-u08-values'
    and title = 'Big English 3 Unit 8 Values'
    and status = 'draft';
  if values_component_count <> 1 then
    raise exception 'Values NLL seed assertion failed: expected one exact draft Values component';
  end if;

  select count(*) into values_membership_count
  from public.nll_component_activities
  where component_id = '3e800008-0000-4000-8000-000000000010'
    and (activity_id, position) in (
      ('bep3_sb_act_08_36', 1),
      ('bep3_sb_act_08_37', 2),
      ('bep3_sb_act_08_38', 3)
    );
  if values_membership_count <> 3 then
    raise exception 'Values NLL seed assertion failed: expected three exact ordered Values memberships';
  end if;

  select count(*) into values_summary_count
  from public.nll_activity_summaries s
  where (s.id, s.activity_id, s.version, s.summary_text, s.canonical_path, s.canonical_sha256,
         s.activity_sha256, s.evidence_status, s.display_status, s.review_state, s.is_preferred, s.provenance)
    in (
      (
        'big_english_3_sb_unit_08_activity_36_summary_values_nll_v1',
        'bep3_sb_act_08_36',
        1,
        'Students listen to Audio 168 and classify four pictured activities as healthy or unhealthy.',
        'big-english/big_english_3_sb/canonical/v1.json',
        '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
        '904d555171527fc0edb93360096c82c48ba1031048209bddcf2f96ccf3b3fd97',
        'sufficient',
        'hidden',
        'experimental',
        true,
        '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"human_authored_from_canonical_evidence","prompt_version":"values-nll-knowledge-prep-v0.1"}}'::jsonb
      ),
      (
        'big_english_3_sb_unit_08_activity_37_summary_values_nll_v1',
        'bep3_sb_act_08_37',
        1,
        'Students use the publisher language frames to tell a partner to do healthy things.',
        'big-english/big_english_3_sb/canonical/v1.json',
        '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
        '28c0f42aa137bf610df5a35223101738043cf0a0f4d7fc6e2bd1c058431880b4',
        'sufficient',
        'hidden',
        'experimental',
        true,
        '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"human_authored_from_canonical_evidence","prompt_version":"values-nll-knowledge-prep-v0.1"}}'::jsonb
      ),
      (
        'big_english_3_sb_unit_08_activity_38_summary_values_nll_v1',
        'bep3_sb_act_08_38',
        1,
        'Students invent an outdoor game with a group, write the rules, and teach it to the class.',
        'big-english/big_english_3_sb/canonical/v1.json',
        '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
        '4b150a90e379b435969e2977869f48d972236ff56898575928177a58ba7f740e',
        'sufficient',
        'hidden',
        'experimental',
        true,
        '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"human_authored_from_canonical_evidence","prompt_version":"values-nll-knowledge-prep-v0.1"}}'::jsonb
      )
    );
  if values_summary_count <> 3 then
    raise exception 'Values NLL seed assertion failed: summary rows do not exactly match the accepted payload mapping';
  end if;

  select count(*) into unexpected_summary_count
  from public.nll_activity_summaries
  where activity_id in (
      'bep3_sb_act_08_36',
      'bep3_sb_act_08_37',
      'bep3_sb_act_08_38'
    )
    and id not in (
      'big_english_3_sb_unit_08_activity_36_summary_values_nll_v1',
      'big_english_3_sb_unit_08_activity_37_summary_values_nll_v1',
      'big_english_3_sb_unit_08_activity_38_summary_values_nll_v1'
    );
  if unexpected_summary_count <> 0 then
    raise exception 'Values NLL seed assertion failed: unexpected summaries present for Values activity IDs';
  end if;

  select count(*) into values_ss_link_count
  from public.nll_ss_component_links
  where id = '3e800008-0000-4000-8000-000000001001'
    and component_id = '3e800008-0000-4000-8000-000000000010'
    and ss_path = 'big-english/big_english_3_sb/canonical/ss_v1.json'
    and ss_sha256 = 'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a'
    and unit_number_raw = '8'
    and column_order = 6
    and category_name_raw = 'Values'
    and status = 'proposed';
  if values_ss_link_count <> 1 then
    raise exception 'Values NLL seed assertion failed: expected one proposed Values SS link (column 6 Get exercise.)';
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
  select count(*) into prior_8_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000009'
    and component_key = 'be3-u08-review'
    and title = 'Big English 3 Unit 8 Review'
    and status = 'draft';
  if prior_0_count <> 1
     or prior_1_count <> 1
     or prior_2_count <> 1
     or prior_3_count <> 1
     or prior_4_count <> 1
     or prior_5_count <> 1
     or prior_6_count <> 1
     or prior_7_count <> 1
     or prior_8_count <> 1 then
    raise exception 'Values NLL seed assertion failed: existing component identities changed';
  end if;

  select count(*) into component_count from public.nll_components;
  select count(*) into membership_count from public.nll_component_activities;
  select count(*) into summary_count from public.nll_activity_summaries;
  select count(*) into ss_link_count from public.nll_ss_component_links;
  if component_count <> 10
     or membership_count <> 77
     or summary_count <> 77
     or ss_link_count <> 10 then
    raise exception 'Values NLL seed assertion failed: expected post-insert totals 10/77/77/10, found %/%/%/%',
      component_count, membership_count, summary_count, ss_link_count;
  end if;
end $$;

commit;
