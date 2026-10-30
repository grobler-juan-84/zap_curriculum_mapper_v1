-- Grammar-A Step B: additive Neutral Lesson Library Grammar seed.
-- Big English 3 Unit 8 Grammar only (be3-u08-grammar).
-- Does not modify Opener, Story, or LiA rows or alter schema/RLS from
-- 20261029120000_create_nll_pilot.sql.
-- Ordinary inserts only: any collision aborts the transaction.
-- Local implementation only until separately authorized application.

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

  if component_count <> 3
     or membership_count <> 23
     or summary_count <> 23
     or ss_link_count <> 5 then
    raise exception 'Grammar-A Step B precondition failed: expected approved NLL baseline 3/23/23/5, found %/%/%/%',
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
  ) then
    raise exception 'Grammar-A Step B precondition failed: accepted Opener/Story/LiA identities changed';
  end if;

  if exists (
    select 1 from public.nll_components
    where component_key = 'be3-u08-grammar'
       or id = '3e800008-0000-4000-8000-000000000004'
  ) then
    raise exception 'Grammar-A Step B precondition failed: component key or UUID already present';
  end if;

  if exists (
    select 1 from public.nll_activity_summaries
    where id in (
      'big_english_3_sb_unit_08_activity_19_summary_grammar_a_v1',
      'big_english_3_sb_unit_08_activity_20_summary_grammar_a_v1',
      'big_english_3_sb_unit_08_activity_21_summary_grammar_a_v1',
      'big_english_3_sb_unit_08_activity_22_summary_grammar_a_v1',
      'big_english_3_sb_unit_08_activity_23_summary_grammar_a_v1',
      'big_english_3_wb_unit_08_p111_activity_15_summary_grammar_a_v1',
      'big_english_3_wb_unit_08_p111_activity_16_summary_grammar_a_v1',
      'big_english_3_wb_unit_08_p111_activity_17_summary_grammar_a_v1',
      'big_english_3_wb_unit_08_p112_activity_18_summary_grammar_a_v1',
      'big_english_3_wb_unit_08_p112_activity_19_summary_grammar_a_v1'
    )
    or (activity_id, version) in (
      ('bep3_sb_act_08_19', 1),
      ('bep3_sb_act_08_20', 1),
      ('bep3_sb_act_08_21', 1),
      ('bep3_sb_act_08_22', 1),
      ('bep3_sb_act_08_23', 1),
      ('bep_3_wb_act_111_15', 1),
      ('bep_3_wb_act_111_16', 1),
      ('bep_3_wb_act_111_17', 1),
      ('bep_3_wb_act_112_18', 1),
      ('bep_3_wb_act_112_19', 1)
    )
    or (
      is_preferred = true
      and activity_id in (
        'bep3_sb_act_08_19',
        'bep3_sb_act_08_20',
        'bep3_sb_act_08_21',
        'bep3_sb_act_08_22',
        'bep3_sb_act_08_23',
        'bep_3_wb_act_111_15',
        'bep_3_wb_act_111_16',
        'bep_3_wb_act_111_17',
        'bep_3_wb_act_112_18',
        'bep_3_wb_act_112_19'
      )
    )
  ) then
    raise exception 'Grammar-A Step B precondition failed: summary identity, version pair, or preferred slot already present';
  end if;

  if exists (
    select 1 from public.nll_component_activities
    where component_id = '3e800008-0000-4000-8000-000000000004'
       or activity_id in (
         'bep3_sb_act_08_19',
         'bep3_sb_act_08_20',
         'bep3_sb_act_08_21',
         'bep3_sb_act_08_22',
         'bep3_sb_act_08_23',
         'bep_3_wb_act_111_15',
         'bep_3_wb_act_111_16',
         'bep_3_wb_act_111_17',
         'bep_3_wb_act_112_18',
         'bep_3_wb_act_112_19'
       )
  ) then
    raise exception 'Grammar-A Step B precondition failed: Grammar component or activity membership already present';
  end if;

  if exists (
    select 1 from public.nll_ss_component_links
    where id = '3e800008-0000-4000-8000-000000000401'
       or (
         component_id = '3e800008-0000-4000-8000-000000000004'
         and ss_path = 'big-english/big_english_3_sb/canonical/ss_v1.json'
         and ss_sha256 = 'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a'
         and unit_number_raw = '8'
         and column_order = 2
         and category_name_raw = 'Structures'
       )
  ) then
    raise exception 'Grammar-A Step B precondition failed: SS-link UUID or Grammar Structures tuple already present';
  end if;
end $$;

insert into public.nll_components (id, component_key, title, status)
values (
  '3e800008-0000-4000-8000-000000000004',
  'be3-u08-grammar',
  'Big English 3 Unit 8 Grammar',
  'draft'
);

insert into public.nll_component_activities (component_id, activity_id, position)
values
  ('3e800008-0000-4000-8000-000000000004', 'bep3_sb_act_08_19', 1),
  ('3e800008-0000-4000-8000-000000000004', 'bep3_sb_act_08_20', 2),
  ('3e800008-0000-4000-8000-000000000004', 'bep3_sb_act_08_21', 3),
  ('3e800008-0000-4000-8000-000000000004', 'bep3_sb_act_08_22', 4),
  ('3e800008-0000-4000-8000-000000000004', 'bep3_sb_act_08_23', 5),
  ('3e800008-0000-4000-8000-000000000004', 'bep_3_wb_act_111_15', 6),
  ('3e800008-0000-4000-8000-000000000004', 'bep_3_wb_act_111_16', 7),
  ('3e800008-0000-4000-8000-000000000004', 'bep_3_wb_act_111_17', 8),
  ('3e800008-0000-4000-8000-000000000004', 'bep_3_wb_act_112_18', 9),
  ('3e800008-0000-4000-8000-000000000004', 'bep_3_wb_act_112_19', 10);

insert into public.nll_activity_summaries (
  id, activity_id, version, summary_text, canonical_path, canonical_sha256,
  activity_sha256, evidence_status, display_status, review_state,
  is_preferred, provenance
)
values
  (
    'big_english_3_sb_unit_08_activity_19_summary_grammar_a_v1',
    'bep3_sb_act_08_19', 1,
    'Students look, listen to Audio 159, and read the dialogue to answer how Donna''s dad came home.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    'aa749d55fdc96f1b08efa95824c688bd06d5af786013c2ec9064397c5fe0133c',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"grammar-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_20_summary_grammar_a_v1',
    'bep3_sb_act_08_20', 1,
    'Students copy the regular-past spelling chart and complete it by sorting the word-box verbs into the chart columns.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    'cf280c387907a1cdfe41919cc7845ccc442247273b78f306d4c86665d1ea12e4',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"grammar-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_21_summary_grammar_a_v1',
    'bep3_sb_act_08_21', 1,
    'Students read and complete a nine-item past-form narrative gap-fill.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    '3b39624df961791c53e2f095bbc57f9833146d8b209e431ed7e847223412237b',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"grammar-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_22_summary_grammar_a_v1',
    'bep3_sb_act_08_22', 1,
    'Students match eight base verbs to their irregular past forms.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    'aabd99915eddb739229a9a3f24d7e1a03ef85021e5afda1dd8d8c62da2077ec7',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"grammar-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_23_summary_grammar_a_v1',
    'bep3_sb_act_08_23', 1,
    'Students tell a partner what they did yesterday, using the verified model frames.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    '50e5750d70b5af0f8816bfcf599945496db1ae9694bb30cb749f21722b5d6052',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"grammar-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p111_activity_15_summary_grammar_a_v1',
    'bep_3_wb_act_111_15', 1,
    'Students complete the regular-past spelling chart by sorting the word-box verbs into the given columns.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    'c1cfb0e700232a8b83a074e73af78fa6bb4f5c0fb2a62440b38d183649e543b2',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"grammar-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p111_activity_16_summary_grammar_a_v1',
    'bep_3_wb_act_111_16', 1,
    'Students write the simple-past forms of ten irregular verbs.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    '5fe70c5bb93e7b475182257435f7d875e7e96d4372c3336fc04ad3a57b1d7678',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"grammar-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p111_activity_17_summary_grammar_a_v1',
    'bep_3_wb_act_111_17', 1,
    'Students complete a thirteen-item narrative cloze with the correct past forms of the verbs in parentheses.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    'e49a9db3deec16cf04c1bb1a6d2118141eeac90b3444f5d2240667e7a4d28bbc',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"grammar-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p112_activity_18_summary_grammar_a_v1',
    'bep_3_wb_act_112_18', 1,
    'Students use the page models and illustrations to complete six questions and answers about past activities.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    'c95ce7e9e36352db1d38107f5667d8c613b0944db36884a4e1a7fb718feb39f4',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"grammar-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p112_activity_19_summary_grammar_a_v1',
    'bep_3_wb_act_112_19', 1,
    'Students rewrite three affirmative past sentences as negatives with didn''t.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    '3868686e77c2d55c8692ae183162fc28ec95d3e32d5feea77cf911ce5a018073',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"grammar-a-step-a-knowledge-prep-v0.1"}}'
  );

insert into public.nll_ss_component_links (
  id, component_id, ss_path, ss_sha256, unit_number_raw,
  column_order, category_name_raw, status
)
values
  (
    '3e800008-0000-4000-8000-000000000401',
    '3e800008-0000-4000-8000-000000000004',
    'big-english/big_english_3_sb/canonical/ss_v1.json',
    'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a',
    '8', 2, 'Structures', 'proposed'
  );

-- Pre-commit assertions: commit only if every check passes.
do $$
declare
  grammar_component_count integer;
  grammar_membership_count integer;
  grammar_summary_count integer;
  grammar_ss_link_count integer;
  opener_identity_count integer;
  story_identity_count integer;
  lia_identity_count integer;
  component_count integer;
  membership_count integer;
  summary_count integer;
  ss_link_count integer;
begin
  select count(*) into grammar_component_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000004'
    and component_key = 'be3-u08-grammar'
    and title = 'Big English 3 Unit 8 Grammar'
    and status = 'draft';
  if grammar_component_count <> 1 then
    raise exception 'Grammar-A Step B assertion failed: expected one exact draft Grammar component';
  end if;

  select count(*) into grammar_membership_count
  from public.nll_component_activities
  where component_id = '3e800008-0000-4000-8000-000000000004'
    and (activity_id, position) in (
      ('bep3_sb_act_08_19', 1),
      ('bep3_sb_act_08_20', 2),
      ('bep3_sb_act_08_21', 3),
      ('bep3_sb_act_08_22', 4),
      ('bep3_sb_act_08_23', 5),
      ('bep_3_wb_act_111_15', 6),
      ('bep_3_wb_act_111_16', 7),
      ('bep_3_wb_act_111_17', 8),
      ('bep_3_wb_act_112_18', 9),
      ('bep_3_wb_act_112_19', 10)
    );
  if grammar_membership_count <> 10 or (
    select count(*) from public.nll_component_activities
    where component_id = '3e800008-0000-4000-8000-000000000004'
  ) <> 10 then
    raise exception 'Grammar-A Step B assertion failed: expected ten exact memberships in positions 1-10';
  end if;

  -- Exact row-level summary mapping: any swap of id/activity/text/hash/source fails.
  select count(*) into grammar_summary_count
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
        'bep3_sb_act_08_19',
        'bep3_sb_act_08_20',
        'bep3_sb_act_08_21',
        'bep3_sb_act_08_22',
        'bep3_sb_act_08_23',
        'bep_3_wb_act_111_15',
        'bep_3_wb_act_111_16',
        'bep_3_wb_act_111_17',
        'bep_3_wb_act_112_18',
        'bep_3_wb_act_112_19'
      )
    )
    except
    (
      values
        (
          'big_english_3_sb_unit_08_activity_19_summary_grammar_a_v1',
          'bep3_sb_act_08_19',
          1,
          'Students look, listen to Audio 159, and read the dialogue to answer how Donna''s dad came home.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          'aa749d55fdc96f1b08efa95824c688bd06d5af786013c2ec9064397c5fe0133c',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"grammar-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_sb_unit_08_activity_20_summary_grammar_a_v1',
          'bep3_sb_act_08_20',
          1,
          'Students copy the regular-past spelling chart and complete it by sorting the word-box verbs into the chart columns.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          'cf280c387907a1cdfe41919cc7845ccc442247273b78f306d4c86665d1ea12e4',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"grammar-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_sb_unit_08_activity_21_summary_grammar_a_v1',
          'bep3_sb_act_08_21',
          1,
          'Students read and complete a nine-item past-form narrative gap-fill.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          '3b39624df961791c53e2f095bbc57f9833146d8b209e431ed7e847223412237b',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"grammar-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_sb_unit_08_activity_22_summary_grammar_a_v1',
          'bep3_sb_act_08_22',
          1,
          'Students match eight base verbs to their irregular past forms.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          'aabd99915eddb739229a9a3f24d7e1a03ef85021e5afda1dd8d8c62da2077ec7',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"grammar-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_sb_unit_08_activity_23_summary_grammar_a_v1',
          'bep3_sb_act_08_23',
          1,
          'Students tell a partner what they did yesterday, using the verified model frames.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          '50e5750d70b5af0f8816bfcf599945496db1ae9694bb30cb749f21722b5d6052',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"grammar-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_wb_unit_08_p111_activity_15_summary_grammar_a_v1',
          'bep_3_wb_act_111_15',
          1,
          'Students complete the regular-past spelling chart by sorting the word-box verbs into the given columns.',
          'big-english/big_english_3_wb/canonical/v1.json',
          '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
          'c1cfb0e700232a8b83a074e73af78fa6bb4f5c0fb2a62440b38d183649e543b2',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"grammar-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_wb_unit_08_p111_activity_16_summary_grammar_a_v1',
          'bep_3_wb_act_111_16',
          1,
          'Students write the simple-past forms of ten irregular verbs.',
          'big-english/big_english_3_wb/canonical/v1.json',
          '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
          '5fe70c5bb93e7b475182257435f7d875e7e96d4372c3336fc04ad3a57b1d7678',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"grammar-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_wb_unit_08_p111_activity_17_summary_grammar_a_v1',
          'bep_3_wb_act_111_17',
          1,
          'Students complete a thirteen-item narrative cloze with the correct past forms of the verbs in parentheses.',
          'big-english/big_english_3_wb/canonical/v1.json',
          '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
          'e49a9db3deec16cf04c1bb1a6d2118141eeac90b3444f5d2240667e7a4d28bbc',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"grammar-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_wb_unit_08_p112_activity_18_summary_grammar_a_v1',
          'bep_3_wb_act_112_18',
          1,
          'Students use the page models and illustrations to complete six questions and answers about past activities.',
          'big-english/big_english_3_wb/canonical/v1.json',
          '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
          'c95ce7e9e36352db1d38107f5667d8c613b0944db36884a4e1a7fb718feb39f4',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"grammar-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_wb_unit_08_p112_activity_19_summary_grammar_a_v1',
          'bep_3_wb_act_112_19',
          1,
          'Students rewrite three affirmative past sentences as negatives with didn''t.',
          'big-english/big_english_3_wb/canonical/v1.json',
          '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
          '3868686e77c2d55c8692ae183162fc28ec95d3e32d5feea77cf911ce5a018073',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"grammar-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        )
    )
  ) as summary_mismatches;
  if grammar_summary_count <> 0 then
    raise exception 'Grammar-A Step B assertion failed: Grammar summary rows do not exactly match the accepted payload mapping';
  end if;

  if (
    select count(*) from public.nll_activity_summaries
    where activity_id in (
      'bep3_sb_act_08_19',
      'bep3_sb_act_08_20',
      'bep3_sb_act_08_21',
      'bep3_sb_act_08_22',
      'bep3_sb_act_08_23',
      'bep_3_wb_act_111_15',
      'bep_3_wb_act_111_16',
      'bep_3_wb_act_111_17',
      'bep_3_wb_act_112_18',
      'bep_3_wb_act_112_19'
    )
  ) <> 10 then
    raise exception 'Grammar-A Step B assertion failed: expected exactly ten summaries for Grammar activity IDs';
  end if;

  if (
    select count(*) from public.nll_activity_summaries
    where id in (
      'big_english_3_sb_unit_08_activity_19_summary_grammar_a_v1',
      'big_english_3_sb_unit_08_activity_20_summary_grammar_a_v1',
      'big_english_3_sb_unit_08_activity_21_summary_grammar_a_v1',
      'big_english_3_sb_unit_08_activity_22_summary_grammar_a_v1',
      'big_english_3_sb_unit_08_activity_23_summary_grammar_a_v1',
      'big_english_3_wb_unit_08_p111_activity_15_summary_grammar_a_v1',
      'big_english_3_wb_unit_08_p111_activity_16_summary_grammar_a_v1',
      'big_english_3_wb_unit_08_p111_activity_17_summary_grammar_a_v1',
      'big_english_3_wb_unit_08_p112_activity_18_summary_grammar_a_v1',
      'big_english_3_wb_unit_08_p112_activity_19_summary_grammar_a_v1'
    )
  ) <> 10 then
    raise exception 'Grammar-A Step B assertion failed: expected exactly the ten accepted Grammar summary IDs';
  end if;

  select count(*) into grammar_ss_link_count
  from public.nll_ss_component_links
  where component_id = '3e800008-0000-4000-8000-000000000004'
    and id = '3e800008-0000-4000-8000-000000000401'
    and ss_path = 'big-english/big_english_3_sb/canonical/ss_v1.json'
    and ss_sha256 = 'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a'
    and unit_number_raw = '8'
    and column_order = 2
    and category_name_raw = 'Structures'
    and status = 'proposed';
  if grammar_ss_link_count <> 1 or (
    select count(*) from public.nll_ss_component_links
    where component_id = '3e800008-0000-4000-8000-000000000004'
  ) <> 1 then
    raise exception 'Grammar-A Step B assertion failed: expected exactly one proposed Structures SS link';
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
  if opener_identity_count <> 1
     or story_identity_count <> 1
     or lia_identity_count <> 1 then
    raise exception 'Grammar-A Step B assertion failed: accepted Opener/Story/LiA identities changed';
  end if;

  select count(*) into component_count from public.nll_components;
  select count(*) into membership_count from public.nll_component_activities;
  select count(*) into summary_count from public.nll_activity_summaries;
  select count(*) into ss_link_count from public.nll_ss_component_links;
  if component_count <> 4
     or membership_count <> 33
     or summary_count <> 33
     or ss_link_count <> 6 then
    raise exception 'Grammar-A Step B assertion failed: expected post-insert totals 4/33/33/6, found %/%/%/%',
      component_count, membership_count, summary_count, ss_link_count;
  end if;
end $$;

commit;
