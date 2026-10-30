-- CLIL-A Step B: additive Neutral Lesson Library Content Connection / P.E. seed.
-- Big English 3 Unit 8 CLIL/P.E. only (be3-u08-clil-pe).
-- Does not modify Opener, Story, LiA, or Grammar rows or alter schema/RLS from
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

  if component_count <> 4
     or membership_count <> 33
     or summary_count <> 33
     or ss_link_count <> 6 then
    raise exception 'CLIL-A Step B precondition failed: expected approved NLL baseline 4/33/33/6, found %/%/%/%',
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
  ) then
    raise exception 'CLIL-A Step B precondition failed: accepted Opener/Story/LiA/Grammar identities changed';
  end if;

  if exists (
    select 1 from public.nll_components
    where component_key = 'be3-u08-clil-pe'
       or id = '3e800008-0000-4000-8000-000000000005'
  ) then
    raise exception 'CLIL-A Step B precondition failed: component key or UUID already present';
  end if;

  if exists (
    select 1 from public.nll_activity_summaries
    where id in (
      'big_english_3_sb_unit_08_activity_13_summary_clil_a_v1',
      'big_english_3_sb_unit_08_activity_14_summary_clil_a_v1',
      'big_english_3_sb_unit_08_activity_15_summary_clil_a_v1',
      'big_english_3_sb_unit_08_activity_16_summary_clil_a_v1',
      'big_english_3_sb_unit_08_activity_17_summary_clil_a_v1',
      'big_english_3_sb_unit_08_activity_18_summary_clil_a_v1',
      'big_english_3_wb_unit_08_p109_activity_11_summary_clil_a_v1',
      'big_english_3_wb_unit_08_p109_activity_12_summary_clil_a_v1',
      'big_english_3_wb_unit_08_p110_activity_13_summary_clil_a_v1',
      'big_english_3_wb_unit_08_p110_activity_14_summary_clil_a_v1',
      'big_english_3_wb_unit_08_p110_think_big_summary_clil_a_v1'
    )
    or (activity_id, version) in (
      ('bep3_sb_act_08_13', 1),
      ('bep3_sb_act_08_14', 1),
      ('bep3_sb_act_08_15', 1),
      ('bep3_sb_act_08_16', 1),
      ('bep3_sb_act_08_17', 1),
      ('bep3_sb_act_08_18', 1),
      ('bep_3_wb_act_109_11', 1),
      ('bep_3_wb_act_109_12', 1),
      ('bep_3_wb_act_110_13', 1),
      ('bep_3_wb_act_110_14', 1),
      ('bep_3_wb_act_110_tb', 1)
    )
    or (
      is_preferred = true
      and activity_id in (
        'bep3_sb_act_08_13',
        'bep3_sb_act_08_14',
        'bep3_sb_act_08_15',
        'bep3_sb_act_08_16',
        'bep3_sb_act_08_17',
        'bep3_sb_act_08_18',
        'bep_3_wb_act_109_11',
        'bep_3_wb_act_109_12',
        'bep_3_wb_act_110_13',
        'bep_3_wb_act_110_14',
        'bep_3_wb_act_110_tb'
      )
    )
  ) then
    raise exception 'CLIL-A Step B precondition failed: summary identity, version pair, or preferred slot already present';
  end if;

  if exists (
    select 1 from public.nll_component_activities
    where component_id = '3e800008-0000-4000-8000-000000000005'
       or activity_id in (
         'bep3_sb_act_08_13',
         'bep3_sb_act_08_14',
         'bep3_sb_act_08_15',
         'bep3_sb_act_08_16',
         'bep3_sb_act_08_17',
         'bep3_sb_act_08_18',
         'bep_3_wb_act_109_11',
         'bep_3_wb_act_109_12',
         'bep_3_wb_act_110_13',
         'bep_3_wb_act_110_14',
         'bep_3_wb_act_110_tb'
       )
  ) then
    raise exception 'CLIL-A Step B precondition failed: CLIL component or activity membership already present';
  end if;

  if exists (
    select 1 from public.nll_ss_component_links
    where id = '3e800008-0000-4000-8000-000000000501'
       or component_id = '3e800008-0000-4000-8000-000000000005'
  ) then
    raise exception 'CLIL-A Step B precondition failed: unexpected CLIL SS-link identity already present';
  end if;
end $$;

insert into public.nll_components (id, component_key, title, status)
values (
  '3e800008-0000-4000-8000-000000000005',
  'be3-u08-clil-pe',
  'Big English 3 Unit 8 Content Connection / P.E.',
  'draft'
);

insert into public.nll_component_activities (component_id, activity_id, position)
values
  ('3e800008-0000-4000-8000-000000000005', 'bep3_sb_act_08_13', 1),
  ('3e800008-0000-4000-8000-000000000005', 'bep3_sb_act_08_14', 2),
  ('3e800008-0000-4000-8000-000000000005', 'bep3_sb_act_08_15', 3),
  ('3e800008-0000-4000-8000-000000000005', 'bep3_sb_act_08_16', 4),
  ('3e800008-0000-4000-8000-000000000005', 'bep3_sb_act_08_17', 5),
  ('3e800008-0000-4000-8000-000000000005', 'bep3_sb_act_08_18', 6),
  ('3e800008-0000-4000-8000-000000000005', 'bep_3_wb_act_109_11', 7),
  ('3e800008-0000-4000-8000-000000000005', 'bep_3_wb_act_109_12', 8),
  ('3e800008-0000-4000-8000-000000000005', 'bep_3_wb_act_110_13', 9),
  ('3e800008-0000-4000-8000-000000000005', 'bep_3_wb_act_110_14', 10),
  ('3e800008-0000-4000-8000-000000000005', 'bep_3_wb_act_110_tb', 11);

insert into public.nll_activity_summaries (
  id, activity_id, version, summary_text, canonical_path, canonical_sha256,
  activity_sha256, evidence_status, display_status, review_state,
  is_preferred, provenance
)
values
  (
    'big_english_3_sb_unit_08_activity_13_summary_clil_a_v1',
    'bep3_sb_act_08_13', 1,
    'Students read, guess, and choose answers to two warm-up questions about exercise amount and which activity uses more energy.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    'e0ab565f885400b6274829fdacdcb492ce111e369b8611825cf055b1bb02b321',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"clil-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_14_summary_clil_a_v1',
    'bep3_sb_act_08_14', 1,
    'Students listen to Audio 157 and read the article to identify what the numbers 60, 12,000, 9, and 10 mean, then check their Activity 13 answers.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    '04e43b12c5cd6ef7e01b0f2d7613db08ab1e3ddcb1136f8de480e58071b1c6fd',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"clil-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_15_summary_clil_a_v1',
    'bep3_sb_act_08_15', 1,
    'Students answer five comprehension questions about the Activity 14 article in their notebooks.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    'e4e3a5848aeb91ecad6f4dbfbdb94018e58878e079a43003c4eb73ecb1eedfe5',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"clil-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_16_summary_clil_a_v1',
    'bep3_sb_act_08_16', 1,
    'Students complete a two-column body-activity chart using the word-box activities, then add more activities.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    '1d37a74a555e14b8066cba06e3939339b4c43efbc892dc3a6a72c0d681af4cd3',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"clil-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_17_summary_clil_a_v1',
    'bep3_sb_act_08_17', 1,
    'Students work with a partner to ask and answer the questions at the end of the Activity 14 article.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    '15aa2f5b907715e7223a0c8a17af5245485071077e8c6b2d1a7d8587676b0a50',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"clil-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_18_summary_clil_a_v1',
    'bep3_sb_act_08_18', 1,
    'Students make a personal Exercise Chart of good and bad activities, using the verified language frame.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    'c7ab978e2ee7ac872bb79bbbd908f89f8b29f699fd8f42300b4cbf4ca4e97948',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"clil-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p109_activity_11_summary_clil_a_v1',
    'bep_3_wb_act_109_11', 1,
    'Students complete a six-gap calorie text using the words from the box.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    'f5b92d0de13c0b30c51a0f082d8744676e4c916a17a6f98992723a18bf03c653',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"clil-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p109_activity_12_summary_clil_a_v1',
    'bep_3_wb_act_109_12', 1,
    'Students read and circle choices in a calorie passage, then listen to Audio 158 to check.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    'ecfd8e6833722077033ba0f1bd4a450a287a8bc81a7fba2d8c80c44fc549ed62',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"clil-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p110_activity_13_summary_clil_a_v1',
    'bep_3_wb_act_110_13', 1,
    'Students look at Activity 12 and match five sentence halves about calories and activity.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    '4526d0eb5ad95c9ec8f84a08c26d00b539a94c21a678ad12772fea2e40fee13f',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"clil-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p110_activity_14_summary_clil_a_v1',
    'bep_3_wb_act_110_14', 1,
    'Students complete the Inside / Outside / Inside or Outside activity diagram and add five more activities.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    '39f62325f7434edf449866a03594fd76a7da09f959e21adb201314e033f18495',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"clil-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p110_think_big_summary_clil_a_v1',
    'bep_3_wb_act_110_tb', 1,
    'Students complete the Think Big healthy-choice prompts by choosing one option in each pair.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    '76c7285c24aefc477fce094858cc82790b3f88c33cc2c4329ec777e74a90ca03',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"clil-a-step-a-knowledge-prep-v0.1"}}'
  );

-- Pre-commit assertions: commit only if every check passes.
do $$
declare
  clil_component_count integer;
  clil_membership_count integer;
  clil_summary_count integer;
  clil_ss_link_count integer;
  opener_identity_count integer;
  story_identity_count integer;
  lia_identity_count integer;
  grammar_identity_count integer;
  component_count integer;
  membership_count integer;
  summary_count integer;
  ss_link_count integer;
begin
  select count(*) into clil_component_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000005'
    and component_key = 'be3-u08-clil-pe'
    and title = 'Big English 3 Unit 8 Content Connection / P.E.'
    and status = 'draft';
  if clil_component_count <> 1 then
    raise exception 'CLIL-A Step B assertion failed: expected one exact draft CLIL/P.E. component';
  end if;

  select count(*) into clil_membership_count
  from public.nll_component_activities
  where component_id = '3e800008-0000-4000-8000-000000000005'
    and (activity_id, position) in (
      ('bep3_sb_act_08_13', 1),
      ('bep3_sb_act_08_14', 2),
      ('bep3_sb_act_08_15', 3),
      ('bep3_sb_act_08_16', 4),
      ('bep3_sb_act_08_17', 5),
      ('bep3_sb_act_08_18', 6),
      ('bep_3_wb_act_109_11', 7),
      ('bep_3_wb_act_109_12', 8),
      ('bep_3_wb_act_110_13', 9),
      ('bep_3_wb_act_110_14', 10),
      ('bep_3_wb_act_110_tb', 11)
    );
  if clil_membership_count <> 11 or (
    select count(*) from public.nll_component_activities
    where component_id = '3e800008-0000-4000-8000-000000000005'
  ) <> 11 then
    raise exception 'CLIL-A Step B assertion failed: expected eleven exact memberships in positions 1-11';
  end if;

  -- Exact row-level summary mapping: any swap of id/activity/text/hash/source fails.
  select count(*) into clil_summary_count
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
        'bep3_sb_act_08_13',
        'bep3_sb_act_08_14',
        'bep3_sb_act_08_15',
        'bep3_sb_act_08_16',
        'bep3_sb_act_08_17',
        'bep3_sb_act_08_18',
        'bep_3_wb_act_109_11',
        'bep_3_wb_act_109_12',
        'bep_3_wb_act_110_13',
        'bep_3_wb_act_110_14',
        'bep_3_wb_act_110_tb'
      )
    )
    except
    (
      values
        (
          'big_english_3_sb_unit_08_activity_13_summary_clil_a_v1',
          'bep3_sb_act_08_13',
          1,
          'Students read, guess, and choose answers to two warm-up questions about exercise amount and which activity uses more energy.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          'e0ab565f885400b6274829fdacdcb492ce111e369b8611825cf055b1bb02b321',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"clil-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_sb_unit_08_activity_14_summary_clil_a_v1',
          'bep3_sb_act_08_14',
          1,
          'Students listen to Audio 157 and read the article to identify what the numbers 60, 12,000, 9, and 10 mean, then check their Activity 13 answers.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          '04e43b12c5cd6ef7e01b0f2d7613db08ab1e3ddcb1136f8de480e58071b1c6fd',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"clil-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_sb_unit_08_activity_15_summary_clil_a_v1',
          'bep3_sb_act_08_15',
          1,
          'Students answer five comprehension questions about the Activity 14 article in their notebooks.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          'e4e3a5848aeb91ecad6f4dbfbdb94018e58878e079a43003c4eb73ecb1eedfe5',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"clil-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_sb_unit_08_activity_16_summary_clil_a_v1',
          'bep3_sb_act_08_16',
          1,
          'Students complete a two-column body-activity chart using the word-box activities, then add more activities.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          '1d37a74a555e14b8066cba06e3939339b4c43efbc892dc3a6a72c0d681af4cd3',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"clil-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_sb_unit_08_activity_17_summary_clil_a_v1',
          'bep3_sb_act_08_17',
          1,
          'Students work with a partner to ask and answer the questions at the end of the Activity 14 article.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          '15aa2f5b907715e7223a0c8a17af5245485071077e8c6b2d1a7d8587676b0a50',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"clil-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_sb_unit_08_activity_18_summary_clil_a_v1',
          'bep3_sb_act_08_18',
          1,
          'Students make a personal Exercise Chart of good and bad activities, using the verified language frame.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          'c7ab978e2ee7ac872bb79bbbd908f89f8b29f699fd8f42300b4cbf4ca4e97948',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"clil-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_wb_unit_08_p109_activity_11_summary_clil_a_v1',
          'bep_3_wb_act_109_11',
          1,
          'Students complete a six-gap calorie text using the words from the box.',
          'big-english/big_english_3_wb/canonical/v1.json',
          '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
          'f5b92d0de13c0b30c51a0f082d8744676e4c916a17a6f98992723a18bf03c653',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"clil-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_wb_unit_08_p110_activity_13_summary_clil_a_v1',
          'bep_3_wb_act_110_13',
          1,
          'Students look at Activity 12 and match five sentence halves about calories and activity.',
          'big-english/big_english_3_wb/canonical/v1.json',
          '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
          '4526d0eb5ad95c9ec8f84a08c26d00b539a94c21a678ad12772fea2e40fee13f',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"clil-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_wb_unit_08_p109_activity_12_summary_clil_a_v1',
          'bep_3_wb_act_109_12',
          1,
          'Students read and circle choices in a calorie passage, then listen to Audio 158 to check.',
          'big-english/big_english_3_wb/canonical/v1.json',
          '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
          'ecfd8e6833722077033ba0f1bd4a450a287a8bc81a7fba2d8c80c44fc549ed62',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"clil-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_wb_unit_08_p110_activity_14_summary_clil_a_v1',
          'bep_3_wb_act_110_14',
          1,
          'Students complete the Inside / Outside / Inside or Outside activity diagram and add five more activities.',
          'big-english/big_english_3_wb/canonical/v1.json',
          '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
          '39f62325f7434edf449866a03594fd76a7da09f959e21adb201314e033f18495',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"clil-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_wb_unit_08_p110_think_big_summary_clil_a_v1',
          'bep_3_wb_act_110_tb',
          1,
          'Students complete the Think Big healthy-choice prompts by choosing one option in each pair.',
          'big-english/big_english_3_wb/canonical/v1.json',
          '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
          '76c7285c24aefc477fce094858cc82790b3f88c33cc2c4329ec777e74a90ca03',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"clil-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        )
    )
  ) as summary_mismatches;
  if clil_summary_count <> 0 then
    raise exception 'CLIL-A Step B assertion failed: CLIL summary rows do not exactly match the accepted payload mapping';
  end if;

  if (
    select count(*) from public.nll_activity_summaries
    where activity_id in (
      'bep3_sb_act_08_13',
      'bep3_sb_act_08_14',
      'bep3_sb_act_08_15',
      'bep3_sb_act_08_16',
      'bep3_sb_act_08_17',
      'bep3_sb_act_08_18',
      'bep_3_wb_act_109_11',
      'bep_3_wb_act_109_12',
      'bep_3_wb_act_110_13',
      'bep_3_wb_act_110_14',
      'bep_3_wb_act_110_tb'
    )
  ) <> 11 then
    raise exception 'CLIL-A Step B assertion failed: expected exactly eleven summaries for CLIL activity IDs';
  end if;

  if (
    select count(*) from public.nll_activity_summaries
    where id in (
      'big_english_3_sb_unit_08_activity_13_summary_clil_a_v1',
      'big_english_3_sb_unit_08_activity_14_summary_clil_a_v1',
      'big_english_3_sb_unit_08_activity_15_summary_clil_a_v1',
      'big_english_3_sb_unit_08_activity_16_summary_clil_a_v1',
      'big_english_3_sb_unit_08_activity_17_summary_clil_a_v1',
      'big_english_3_sb_unit_08_activity_18_summary_clil_a_v1',
      'big_english_3_wb_unit_08_p109_activity_11_summary_clil_a_v1',
      'big_english_3_wb_unit_08_p109_activity_12_summary_clil_a_v1',
      'big_english_3_wb_unit_08_p110_activity_13_summary_clil_a_v1',
      'big_english_3_wb_unit_08_p110_activity_14_summary_clil_a_v1',
      'big_english_3_wb_unit_08_p110_think_big_summary_clil_a_v1'
    )
  ) <> 11 then
    raise exception 'CLIL-A Step B assertion failed: expected exactly the eleven accepted CLIL summary IDs';
  end if;

  select count(*) into clil_ss_link_count
  from public.nll_ss_component_links
  where component_id = '3e800008-0000-4000-8000-000000000005';
  if clil_ss_link_count <> 0 then
    raise exception 'CLIL-A Step B assertion failed: expected zero CLIL SS links';
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
  if opener_identity_count <> 1
     or story_identity_count <> 1
     or lia_identity_count <> 1
     or grammar_identity_count <> 1 then
    raise exception 'CLIL-A Step B assertion failed: accepted Opener/Story/LiA/Grammar identities changed';
  end if;

  select count(*) into component_count from public.nll_components;
  select count(*) into membership_count from public.nll_component_activities;
  select count(*) into summary_count from public.nll_activity_summaries;
  select count(*) into ss_link_count from public.nll_ss_component_links;
  if component_count <> 5
     or membership_count <> 44
     or summary_count <> 44
     or ss_link_count <> 6 then
    raise exception 'CLIL-A Step B assertion failed: expected post-insert totals 5/44/44/6, found %/%/%/%',
      component_count, membership_count, summary_count, ss_link_count;
  end if;
end $$;

commit;
