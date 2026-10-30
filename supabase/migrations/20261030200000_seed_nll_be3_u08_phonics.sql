-- Phonics-A Step B: additive Neutral Lesson Library Phonics seed.
-- Big English 3 Unit 8 Phonics only (be3-u08-phonics).
-- Does not modify Opener, Story, LiA, Grammar, CLIL/P.E., Culture, or Writing rows or alter schema/RLS.
-- Ordinary inserts only: any collision aborts the transaction.
-- Local implementation only until separately authorized application.
-- One proposed SS link: Phonics.

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

  if component_count <> 7
     or membership_count <> 60
     or summary_count <> 60
     or ss_link_count <> 8 then
    raise exception 'Phonics-A Step B precondition failed: expected approved NLL baseline 7/60/60/8, found %/%/%/%',
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
  ) then
    raise exception 'Phonics-A Step B precondition failed: accepted prior component identities changed';
  end if;

  if exists (
    select 1 from public.nll_components
    where component_key = 'be3-u08-phonics'
       or id = '3e800008-0000-4000-8000-000000000008'
  ) then
    raise exception 'Phonics-A Step B precondition failed: component key or UUID already present';
  end if;

  if exists (
    select 1 from public.nll_activity_summaries
    where id in (
      'big_english_3_sb_unit_08_activity_32_summary_phonics_a_v1',
      'big_english_3_sb_unit_08_activity_33_summary_phonics_a_v1',
      'big_english_3_sb_unit_08_activity_34_summary_phonics_a_v1',
      'big_english_3_sb_unit_08_activity_35_summary_phonics_a_v1',
      'big_english_3_wb_unit_08_p116_activity_27_summary_phonics_a_v1',
      'big_english_3_wb_unit_08_p116_activity_28_summary_phonics_a_v1',
      'big_english_3_wb_unit_08_p116_activity_29_summary_phonics_a_v1',
      'big_english_3_wb_unit_08_p116_activity_30_summary_phonics_a_v1'
    )
    or (activity_id, version) in (
      ('bep3_sb_act_08_32', 1),
      ('bep3_sb_act_08_33', 1),
      ('bep3_sb_act_08_34', 1),
      ('bep3_sb_act_08_35', 1),
      ('bep_3_wb_act_116_27', 1),
      ('bep_3_wb_act_116_28', 1),
      ('bep_3_wb_act_116_29', 1),
      ('bep_3_wb_act_116_30', 1)
    )
    or (
      is_preferred = true
      and activity_id in (
         'bep3_sb_act_08_32',
         'bep3_sb_act_08_33',
         'bep3_sb_act_08_34',
         'bep3_sb_act_08_35',
         'bep_3_wb_act_116_27',
         'bep_3_wb_act_116_28',
         'bep_3_wb_act_116_29',
         'bep_3_wb_act_116_30'
      )
    )
  ) then
    raise exception 'Phonics-A Step B precondition failed: summary identity, version pair, or preferred slot already present';
  end if;

  if exists (
    select 1 from public.nll_component_activities
    where component_id = '3e800008-0000-4000-8000-000000000008'
       or activity_id in (
         'bep3_sb_act_08_32',
         'bep3_sb_act_08_33',
         'bep3_sb_act_08_34',
         'bep3_sb_act_08_35',
         'bep_3_wb_act_116_27',
         'bep_3_wb_act_116_28',
         'bep_3_wb_act_116_29',
         'bep_3_wb_act_116_30'
       )
  ) then
    raise exception 'Phonics-A Step B precondition failed: Phonics component or activity membership already present';
  end if;

  if exists (
    select 1 from public.nll_ss_component_links
    where id in ('3e800008-0000-4000-8000-000000000801')
       or component_id = '3e800008-0000-4000-8000-000000000008'
  ) then
    raise exception 'Phonics-A Step B precondition failed: Phonics SS-link identity already present';
  end if;
end $$;

insert into public.nll_components (id, component_key, title, status)
values (
  '3e800008-0000-4000-8000-000000000008',
  'be3-u08-phonics',
  'Big English 3 Unit 8 Phonics',
  'draft'
);

insert into public.nll_component_activities (component_id, activity_id, position)
values
  ('3e800008-0000-4000-8000-000000000008', 'bep3_sb_act_08_32', 1),
  ('3e800008-0000-4000-8000-000000000008', 'bep3_sb_act_08_33', 2),
  ('3e800008-0000-4000-8000-000000000008', 'bep3_sb_act_08_34', 3),
  ('3e800008-0000-4000-8000-000000000008', 'bep3_sb_act_08_35', 4),
  ('3e800008-0000-4000-8000-000000000008', 'bep_3_wb_act_116_27', 5),
  ('3e800008-0000-4000-8000-000000000008', 'bep_3_wb_act_116_28', 6),
  ('3e800008-0000-4000-8000-000000000008', 'bep_3_wb_act_116_29', 7),
  ('3e800008-0000-4000-8000-000000000008', 'bep_3_wb_act_116_30', 8);

insert into public.nll_activity_summaries (
  id, activity_id, version, summary_text, canonical_path, canonical_sha256,
  activity_sha256, evidence_status, display_status, review_state,
  is_preferred, provenance
)
values
  (
    'big_english_3_sb_unit_08_activity_32_summary_phonics_a_v1',
    'bep3_sb_act_08_32', 1,
    'Students listen, read, and repeat the graphemes all, au, and aw with Audio 163; no keyed answers, transcript, IPA, or invented pronunciation rule is added.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    'eb079a327bed4964226ab499f4dbb05278a91856192c33be0f0b1953a4b262c6',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"phonics-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_33_summary_phonics_a_v1',
    'bep3_sb_act_08_33', 1,
    'Students listen to Audio 164, find publisher targets ball, haul, and draw, and say them, preserving the visual dependency without inventing further words or a transcript.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    '07fa8309f46baa30993982081c74700bc47fde4c947a093da9715fb9d6376760',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"phonics-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_34_summary_phonics_a_v1',
    'bep3_sb_act_08_34', 1,
    'Students listen to Audio 165 and blend eight keyed publisher words; keyed answers remain protected and are not treated as an open word list or reconstructed if excluded.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    'd6df47a6bbbc3523d399ff3437c63918f8df4fd71fad83ec903a437746c79309',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"phonics-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_35_summary_phonics_a_v1',
    'bep3_sb_act_08_35', 1,
    'Students read aloud, then listen and chant with Audio 166 using chant evidence bep3_sb_text_08_06 by identity and role only; excluding this activity removes chant evidence everywhere without reconstructing the chant text.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    '1814770428f06a23c53928bab33ff843b29a5632b639c15733135cb51f01769a',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"phonics-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p116_activity_27_summary_phonics_a_v1',
    'bep_3_wb_act_116_27', 1,
    'Students read and circle all, au, and aw in the publisher word box; keyed circle targets remain protected without inventing additional words.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    '247fb95700c8ec1877a65266ea8979bea5550c8d289631f59d5df5e4e30569a5',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"phonics-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p116_activity_28_summary_phonics_a_v1',
    'bep_3_wb_act_116_28', 1,
    'Students underline publisher all, au, and aw words in two sentences and read aloud without inventing sentences or reconstructing excluded underlines.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    '2fb3d4c9e46c8fc7db0353e65495739fc3b7dbd67e43d8b37c35b71b48b8acb1',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"phonics-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p116_activity_29_summary_phonics_a_v1',
    'bep_3_wb_act_116_29', 1,
    'Students connect letter parts and write three keyed words without inventing spellings or reconstructing excluded connect/write items.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    'c580dacd102dfc89b4cc7398453e10e363742444d793abdbeacdbfbe0f232dea',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"phonics-a-step-a-knowledge-prep-v0.1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p116_activity_30_summary_phonics_a_v1',
    'bep_3_wb_act_116_30', 1,
    'Students listen to Audio 167 and complete five chant-gap prompts; no invented transcript or reconstructed chant answers are added beyond the canonical gap evidence.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    '7b4e92ac24c6ad5e026ac0d6c29ff23d278007770d501922078724d475021270',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"phonics-a-step-a-knowledge-prep-v0.1"}}'
  );

insert into public.nll_ss_component_links (
  id, component_id, ss_path, ss_sha256, unit_number_raw, column_order, category_name_raw, status
)
values
  (
    '3e800008-0000-4000-8000-000000000801',
    '3e800008-0000-4000-8000-000000000008',
    'big-english/big_english_3_sb/canonical/ss_v1.json',
    'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a',
    '8', 5, 'Phonics', 'proposed'
  );

-- Pre-commit assertions: commit only if every check passes.
do $$
declare
  phonics_component_count integer;
  phonics_membership_count integer;
  phonics_summary_count integer;
  phonics_ss_link_count integer;
  prior_0_count integer;
  prior_1_count integer;
  prior_2_count integer;
  prior_3_count integer;
  prior_4_count integer;
  prior_5_count integer;
  prior_6_count integer;
  component_count integer;
  membership_count integer;
  summary_count integer;
  ss_link_count integer;
  unexpected_summary_count integer;
begin
  select count(*) into phonics_component_count
  from public.nll_components
  where id = '3e800008-0000-4000-8000-000000000008'
    and component_key = 'be3-u08-phonics'
    and title = 'Big English 3 Unit 8 Phonics'
    and status = 'draft';
  if phonics_component_count <> 1 then
    raise exception 'Phonics-A Step B assertion failed: expected one exact draft Phonics component';
  end if;

  select count(*) into phonics_membership_count
  from public.nll_component_activities
  where component_id = '3e800008-0000-4000-8000-000000000008'
    and (activity_id, position) in (
      ('bep3_sb_act_08_32', 1),
      ('bep3_sb_act_08_33', 2),
      ('bep3_sb_act_08_34', 3),
      ('bep3_sb_act_08_35', 4),
      ('bep_3_wb_act_116_27', 5),
      ('bep_3_wb_act_116_28', 6),
      ('bep_3_wb_act_116_29', 7),
      ('bep_3_wb_act_116_30', 8)
    );
  if phonics_membership_count <> 8 then
    raise exception 'Phonics-A Step B assertion failed: expected eight exact ordered Phonics memberships';
  end if;

  select count(*) into phonics_summary_count
  from public.nll_activity_summaries s
  where (s.id, s.activity_id, s.version, s.summary_text, s.canonical_path, s.canonical_sha256,
         s.activity_sha256, s.evidence_status, s.display_status, s.review_state,
         s.is_preferred, s.provenance) in (
        (
          'big_english_3_sb_unit_08_activity_32_summary_phonics_a_v1',
          'bep3_sb_act_08_32',
          1,
          'Students listen, read, and repeat the graphemes all, au, and aw with Audio 163; no keyed answers, transcript, IPA, or invented pronunciation rule is added.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          'eb079a327bed4964226ab499f4dbb05278a91856192c33be0f0b1953a4b262c6',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"phonics-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_sb_unit_08_activity_33_summary_phonics_a_v1',
          'bep3_sb_act_08_33',
          1,
          'Students listen to Audio 164, find publisher targets ball, haul, and draw, and say them, preserving the visual dependency without inventing further words or a transcript.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          '07fa8309f46baa30993982081c74700bc47fde4c947a093da9715fb9d6376760',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"phonics-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_sb_unit_08_activity_34_summary_phonics_a_v1',
          'bep3_sb_act_08_34',
          1,
          'Students listen to Audio 165 and blend eight keyed publisher words; keyed answers remain protected and are not treated as an open word list or reconstructed if excluded.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          'd6df47a6bbbc3523d399ff3437c63918f8df4fd71fad83ec903a437746c79309',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"phonics-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_sb_unit_08_activity_35_summary_phonics_a_v1',
          'bep3_sb_act_08_35',
          1,
          'Students read aloud, then listen and chant with Audio 166 using chant evidence bep3_sb_text_08_06 by identity and role only; excluding this activity removes chant evidence everywhere without reconstructing the chant text.',
          'big-english/big_english_3_sb/canonical/v1.json',
          '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
          '1814770428f06a23c53928bab33ff843b29a5632b639c15733135cb51f01769a',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"phonics-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_wb_unit_08_p116_activity_27_summary_phonics_a_v1',
          'bep_3_wb_act_116_27',
          1,
          'Students read and circle all, au, and aw in the publisher word box; keyed circle targets remain protected without inventing additional words.',
          'big-english/big_english_3_wb/canonical/v1.json',
          '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
          '247fb95700c8ec1877a65266ea8979bea5550c8d289631f59d5df5e4e30569a5',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"phonics-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_wb_unit_08_p116_activity_28_summary_phonics_a_v1',
          'bep_3_wb_act_116_28',
          1,
          'Students underline publisher all, au, and aw words in two sentences and read aloud without inventing sentences or reconstructing excluded underlines.',
          'big-english/big_english_3_wb/canonical/v1.json',
          '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
          '2fb3d4c9e46c8fc7db0353e65495739fc3b7dbd67e43d8b37c35b71b48b8acb1',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"phonics-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_wb_unit_08_p116_activity_29_summary_phonics_a_v1',
          'bep_3_wb_act_116_29',
          1,
          'Students connect letter parts and write three keyed words without inventing spellings or reconstructing excluded connect/write items.',
          'big-english/big_english_3_wb/canonical/v1.json',
          '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
          'c580dacd102dfc89b4cc7398453e10e363742444d793abdbeacdbfbe0f232dea',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"phonics-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        ),
        (
          'big_english_3_wb_unit_08_p116_activity_30_summary_phonics_a_v1',
          'bep_3_wb_act_116_30',
          1,
          'Students listen to Audio 167 and complete five chant-gap prompts; no invented transcript or reconstructed chant answers are added beyond the canonical gap evidence.',
          'big-english/big_english_3_wb/canonical/v1.json',
          '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
          '7b4e92ac24c6ad5e026ac0d6c29ff23d278007770d501922078724d475021270',
          'sufficient',
          'hidden',
          'experimental',
          true,
          '{"record_type":"teacher_friendly_summary","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","prompt_version":"phonics-a-step-a-knowledge-prep-v0.1"}}'::jsonb
        )
      );
  if phonics_summary_count <> 8 then
    raise exception 'Phonics-A Step B assertion failed: Phonics summary rows do not exactly match the accepted payload mapping';
  end if;

  select count(*) into unexpected_summary_count
  from public.nll_activity_summaries
  where activity_id in (
         'bep3_sb_act_08_32',
         'bep3_sb_act_08_33',
         'bep3_sb_act_08_34',
         'bep3_sb_act_08_35',
         'bep_3_wb_act_116_27',
         'bep_3_wb_act_116_28',
         'bep_3_wb_act_116_29',
         'bep_3_wb_act_116_30'
      )
    and id not in (
      'big_english_3_sb_unit_08_activity_32_summary_phonics_a_v1',
      'big_english_3_sb_unit_08_activity_33_summary_phonics_a_v1',
      'big_english_3_sb_unit_08_activity_34_summary_phonics_a_v1',
      'big_english_3_sb_unit_08_activity_35_summary_phonics_a_v1',
      'big_english_3_wb_unit_08_p116_activity_27_summary_phonics_a_v1',
      'big_english_3_wb_unit_08_p116_activity_28_summary_phonics_a_v1',
      'big_english_3_wb_unit_08_p116_activity_29_summary_phonics_a_v1',
      'big_english_3_wb_unit_08_p116_activity_30_summary_phonics_a_v1'
    );
  if unexpected_summary_count <> 0 then
    raise exception 'Phonics-A Step B assertion failed: unexpected summaries present for Phonics activity IDs';
  end if;

  select count(*) into phonics_ss_link_count
  from public.nll_ss_component_links
  where component_id = '3e800008-0000-4000-8000-000000000008'
    and id = '3e800008-0000-4000-8000-000000000801'
    and ss_path = 'big-english/big_english_3_sb/canonical/ss_v1.json'
    and ss_sha256 = 'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a'
    and unit_number_raw = '8'
    and status = 'proposed'
    and column_order = 5
    and category_name_raw = 'Phonics';
  if phonics_ss_link_count <> 1 then
    raise exception 'Phonics-A Step B assertion failed: expected exactly one proposed Phonics SS link';
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
  if prior_0_count <> 1
     or prior_1_count <> 1
     or prior_2_count <> 1
     or prior_3_count <> 1
     or prior_4_count <> 1
     or prior_5_count <> 1
     or prior_6_count <> 1 then
    raise exception 'Phonics-A Step B assertion failed: existing component identities changed';
  end if;

  select count(*) into component_count from public.nll_components;
  select count(*) into membership_count from public.nll_component_activities;
  select count(*) into summary_count from public.nll_activity_summaries;
  select count(*) into ss_link_count from public.nll_ss_component_links;
  if component_count <> 8
     or membership_count <> 68
     or summary_count <> 68
     or ss_link_count <> 9 then
    raise exception 'Phonics-A Step B assertion failed: expected post-insert totals 8/68/68/9, found %/%/%/%',
      component_count, membership_count, summary_count, ss_link_count;
  end if;
end $$;

commit;
