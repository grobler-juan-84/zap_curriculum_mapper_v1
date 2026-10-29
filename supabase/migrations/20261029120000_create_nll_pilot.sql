-- Neutral Lesson Library (NLL) pilot: Big English 3 Unit 8 opener only.
-- Canonical SS/SB/WB content remains in Storage. These tables hold additive
-- identities, relationships, summaries, and exact source bindings only.

create table if not exists public.nll_components (
  id uuid primary key default gen_random_uuid(),
  component_key text not null unique,
  title text not null,
  status text not null default 'draft'
    check (status in ('draft', 'available', 'retired')),
  created_at timestamptz not null default now()
);

create table if not exists public.nll_component_activities (
  component_id uuid not null references public.nll_components (id) on delete cascade,
  activity_id text not null,
  position smallint,
  primary key (component_id, activity_id),
  constraint nll_component_activities_position_positive
    check (position is null or position >= 1)
);

create table if not exists public.nll_activity_summaries (
  id text primary key,
  activity_id text not null,
  version integer not null check (version >= 1),
  summary_text text not null,
  canonical_path text not null,
  canonical_sha256 text not null check (canonical_sha256 ~ '^[0-9a-f]{64}$'),
  activity_sha256 text not null check (activity_sha256 ~ '^[0-9a-f]{64}$'),
  evidence_status text not null check (evidence_status in ('sufficient', 'insufficient')),
  display_status text not null default 'hidden'
    check (display_status in ('hidden', 'available')),
  review_state text not null default 'experimental'
    check (review_state in ('experimental', 'reviewed', 'teacher_corrected')),
  is_preferred boolean not null default false,
  provenance jsonb not null default '{}'::jsonb
    check (jsonb_typeof(provenance) = 'object'),
  created_at timestamptz not null default now(),
  unique (activity_id, version)
);

create unique index if not exists nll_activity_summaries_one_preferred_per_activity_uidx
  on public.nll_activity_summaries (activity_id)
  where is_preferred = true;

create index if not exists nll_activity_summaries_activity_idx
  on public.nll_activity_summaries (activity_id);

create table if not exists public.nll_ss_component_links (
  id uuid primary key default gen_random_uuid(),
  component_id uuid not null references public.nll_components (id) on delete cascade,
  ss_path text not null,
  ss_sha256 text not null check (ss_sha256 ~ '^[0-9a-f]{64}$'),
  unit_number_raw text not null,
  column_order integer not null check (column_order >= 1),
  category_name_raw text not null,
  status text not null default 'proposed'
    check (status in ('proposed', 'available')),
  created_at timestamptz not null default now(),
  unique (
    component_id,
    ss_path,
    ss_sha256,
    unit_number_raw,
    column_order,
    category_name_raw
  )
);

comment on table public.nll_components is
  'Reusable lesson components. Canonical publisher content remains in Storage.';
comment on table public.nll_component_activities is
  'Membership links from NLL components to stable canonical activity identities.';
comment on table public.nll_activity_summaries is
  'Versioned, independently replaceable AI-derived knowledge keyed to canonical activity identity.';
comment on table public.nll_ss_component_links is
  'Component-level curriculum relevance locators. A link does not claim that every component activity satisfies the SS category.';

alter table public.nll_components enable row level security;
alter table public.nll_component_activities enable row level security;
alter table public.nll_activity_summaries enable row level security;
alter table public.nll_ss_component_links enable row level security;

drop policy if exists "nll_components_select_authenticated" on public.nll_components;
create policy "nll_components_select_authenticated"
on public.nll_components for select to authenticated using (true);
drop policy if exists "nll_components_write_admin" on public.nll_components;
create policy "nll_components_write_admin"
on public.nll_components for all to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "nll_component_activities_select_authenticated" on public.nll_component_activities;
create policy "nll_component_activities_select_authenticated"
on public.nll_component_activities for select to authenticated using (true);
drop policy if exists "nll_component_activities_write_admin" on public.nll_component_activities;
create policy "nll_component_activities_write_admin"
on public.nll_component_activities for all to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "nll_activity_summaries_select_authenticated" on public.nll_activity_summaries;
create policy "nll_activity_summaries_select_authenticated"
on public.nll_activity_summaries for select to authenticated using (true);
drop policy if exists "nll_activity_summaries_write_admin" on public.nll_activity_summaries;
create policy "nll_activity_summaries_write_admin"
on public.nll_activity_summaries for all to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "nll_ss_component_links_select_authenticated" on public.nll_ss_component_links;
create policy "nll_ss_component_links_select_authenticated"
on public.nll_ss_component_links for select to authenticated using (true);
drop policy if exists "nll_ss_component_links_write_admin" on public.nll_ss_component_links;
create policy "nll_ss_component_links_write_admin"
on public.nll_ss_component_links for all to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

grant select, insert, update, delete on table public.nll_components to authenticated;
grant select, insert, update, delete on table public.nll_component_activities to authenticated;
grant select, insert, update, delete on table public.nll_activity_summaries to authenticated;
grant select, insert, update, delete on table public.nll_ss_component_links to authenticated;

-- Fixed IDs make the bounded seed repeatable and easy to audit.
insert into public.nll_components (id, component_key, title, status)
values (
  '3e800008-0000-4000-8000-000000000001',
  'be3-u08-opener',
  'Big English 3 Unit 8 Opener',
  'draft'
)
on conflict (id) do nothing;

insert into public.nll_component_activities (component_id, activity_id, position)
values
  ('3e800008-0000-4000-8000-000000000001', 'bep3_sb_act_08_01', 1),
  ('3e800008-0000-4000-8000-000000000001', 'bep3_sb_act_08_02', 2),
  ('3e800008-0000-4000-8000-000000000001', 'bep3_sb_act_08_03', 3),
  ('3e800008-0000-4000-8000-000000000001', 'bep3_sb_act_08_04', 4),
  ('3e800008-0000-4000-8000-000000000001', 'bep3_sb_act_08_05', 5),
  ('3e800008-0000-4000-8000-000000000001', 'bep_3_wb_act_104_1', 6),
  ('3e800008-0000-4000-8000-000000000001', 'bep_3_wb_act_104_2', 7),
  ('3e800008-0000-4000-8000-000000000001', 'bep_3_wb_act_105_3', 8),
  ('3e800008-0000-4000-8000-000000000001', 'bep_3_wb_act_105_4', 9)
on conflict (component_id, activity_id) do nothing;

insert into public.nll_activity_summaries (
  id, activity_id, version, summary_text, canonical_path, canonical_sha256,
  activity_sha256, evidence_status, display_status, review_state,
  is_preferred, provenance
)
values
  (
    'big_english_3_sb_unit_08_activity_01_summary_poc_v1',
    'bep3_sb_act_08_01', 1,
    'Students listen, look at the pictures and say the healthy-living questions about Sally and Zach.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    '93651e9218ff5ab99368a3168e2fda0426365cc10be8c55e55729c58fad0e1bc',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","legacy_version":"be3-u08-activity-enrichment-poc-v1","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","provider":"openai","model":"gpt-5","prompt_version":"be3-u08-activity-enrichment-poc-v1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_02_summary_poc_v1',
    'bep3_sb_act_08_02', 1,
    'Students listen to Audio 150, find the matching content on the page and say it.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    'c8ce88d4494d28c26a2ac1900917bb9d231d634d9206fb4e4ab2382a4a29f090',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","legacy_version":"be3-u08-activity-enrichment-poc-v1","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","provider":"openai","model":"gpt-5","prompt_version":"be3-u08-activity-enrichment-poc-v1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_03_summary_poc_v1',
    'bep3_sb_act_08_03', 1,
    'The verified evidence only says “Play a game.” The game procedure is not available in the activity record.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    'e982dd762d90c48ae83a3413ec26d02a6c3aa2c9e83cf41221eabcbcb5700b57',
    'insufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","legacy_version":"be3-u08-activity-enrichment-poc-v1","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","provider":"openai","model":"gpt-5","prompt_version":"be3-u08-activity-enrichment-poc-v1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_04_summary_poc_v1',
    'bep3_sb_act_08_04', 1,
    'Students listen and sing, then answer how Zach feels today.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    '997039dd223958481da3242ea4e9cda05e5c77a9f925b60ed2e4eeb5d696e134',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","legacy_version":"be3-u08-activity-enrichment-poc-v1","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","provider":"openai","model":"gpt-5","prompt_version":"be3-u08-activity-enrichment-poc-v1"}}'
  ),
  (
    'big_english_3_sb_unit_08_activity_05_summary_poc_v1',
    'bep3_sb_act_08_05', 1,
    'Students use the pictures from Activity 1 to ask and answer Did…? questions with short answers.',
    'big-english/big_english_3_sb/canonical/v1.json',
    '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6',
    '611a0cacde7303da8e261f6f1d1f9a7d27e456540b66db9bc583011628d0b298',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","legacy_version":"be3-u08-activity-enrichment-poc-v1","source":"SB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","provider":"openai","model":"gpt-5","prompt_version":"be3-u08-activity-enrichment-poc-v1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p104_activity_1_summary_poc_v1',
    'bep_3_wb_act_104_1', 1,
    'Students write the activities shown in the pictures using the word box, then check which ones are healthy.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    '730e5647818047cdf9b6eb0d8b98ca2826886c931826aac5146ee0afc210bfdd',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","legacy_version":"be3-u08-activity-enrichment-poc-v1","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","provider":"openai","model":"gpt-5","prompt_version":"be3-u08-activity-enrichment-poc-v1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p104_activity_2_summary_poc_v1',
    'bep_3_wb_act_104_2', 1,
    'Students read questions about how they feel and their healthy habits, then circle the answers that are true for them.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    '25dd8c77b263c2dec60cd88d4a63c6a8c5dc96b1cf75cb25a825e16dcd368c0b',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","legacy_version":"be3-u08-activity-enrichment-poc-v1","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","provider":"openai","model":"gpt-5","prompt_version":"be3-u08-activity-enrichment-poc-v1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p105_activity_3_summary_poc_v1',
    'bep_3_wb_act_105_3', 1,
    'Students listen to the ‘Live Right!’ song and complete six gaps using words from the word box.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    'f5cbc7cd8303f07c1d1f1ed412fc61e373f13dca23cbce73f07bf3839470d93e',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","legacy_version":"be3-u08-activity-enrichment-poc-v1","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","provider":"openai","model":"gpt-5","prompt_version":"be3-u08-activity-enrichment-poc-v1"}}'
  ),
  (
    'big_english_3_wb_unit_08_p105_activity_4_summary_poc_v1',
    'bep_3_wb_act_105_4', 1,
    'Students read three healthy-habit questions, check their own answers, then respond with Yes, I did or No, I didn’t.',
    'big-english/big_english_3_wb/canonical/v1.json',
    '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa',
    'ca7ff3810cb4b4acffa469ee4723d0b1243f89aefb0c1a257958c0a2b64c9a70',
    'sufficient', 'hidden', 'experimental', true,
    '{"record_type":"teacher_friendly_summary","legacy_version":"be3-u08-activity-enrichment-poc-v1","source":"WB","verification_status":"human_verified","original_review_status":"experimental_review_required","generation":{"method":"ai_assisted_draft","provider":"openai","model":"gpt-5","prompt_version":"be3-u08-activity-enrichment-poc-v1"}}'
  )
on conflict (id) do nothing;

insert into public.nll_ss_component_links (
  id, component_id, ss_path, ss_sha256, unit_number_raw,
  column_order, category_name_raw, status
)
values
  (
    '3e800008-0000-4000-8000-000000000101',
    '3e800008-0000-4000-8000-000000000001',
    'big-english/big_english_3_sb/canonical/ss_v1.json',
    'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a',
    '8', 1, 'Vocabulary', 'proposed'
  ),
  (
    '3e800008-0000-4000-8000-000000000102',
    '3e800008-0000-4000-8000-000000000001',
    'big-english/big_english_3_sb/canonical/ss_v1.json',
    'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a',
    '8', 2, 'Structures', 'proposed'
  )
on conflict (id) do nothing;
