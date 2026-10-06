-- Curriculum catalog metadata (hybrid architecture prototype)
-- PostgreSQL holds stable app/ops metadata only.
-- Canonical curriculum content remains in JSON files in Storage / local data/.
-- Do NOT add relational tables for units, pages, vocabulary, activities, etc.

-- ---------------------------------------------------------------------------
-- 1. book_series
-- ---------------------------------------------------------------------------

create table if not exists public.book_series (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  publisher text,
  description text,
  created_at timestamptz not null default now()
);

comment on table public.book_series is
  'Publisher series metadata only. Curriculum structure lives in canonical JSON, not here.';

create unique index if not exists book_series_name_lower_uidx
  on public.book_series (lower(name));

-- ---------------------------------------------------------------------------
-- 2. books
-- ---------------------------------------------------------------------------

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  book_id text not null,
  series_id uuid not null references public.book_series (id) on delete restrict,
  title text not null,
  level text,
  book_type text,
  edition text,
  language text,
  status text not null default 'registered',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint books_book_id_key unique (book_id),
  constraint books_status_check check (
    status in ('registered', 'extracting', 'extracted', 'verified', 'complete', 'archived')
  )
);

comment on table public.books is
  'Book registry row. book_id links to Phase 1 dataset identifiers; detailed curriculum stays in JSON.';

comment on column public.books.book_id is
  'Stable project-level identifier connecting this row to curriculum JSON (e.g. big_english_1_sb).';

comment on column public.books.level is
  'Free-text level label (e.g. 1, 2A). Not assumed numeric.';

create index if not exists books_series_id_idx
  on public.books (series_id);

create index if not exists books_status_idx
  on public.books (status);

create or replace function public.set_books_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists books_set_updated_at on public.books;
create trigger books_set_updated_at
before update on public.books
for each row
execute function public.set_books_updated_at();

-- ---------------------------------------------------------------------------
-- 3. book_files
-- ---------------------------------------------------------------------------

create table if not exists public.book_files (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books (id) on delete cascade,
  file_type text not null,
  bucket text not null,
  storage_path text not null,
  filename text,
  mime_type text,
  file_size bigint,
  created_at timestamptz not null default now(),
  constraint book_files_file_type_check check (
    file_type in ('source_pdf', 'canonical_json', 'batch_json', 'other')
  ),
  constraint book_files_file_size_check check (file_size is null or file_size >= 0)
);

comment on table public.book_files is
  'Pointers to objects in Supabase Storage. Store bucket + path only; never permanent public URLs.';

comment on column public.book_files.storage_path is
  'Object path within the bucket (e.g. big-english/big_english_1_sb/source.pdf).';

create index if not exists book_files_book_id_idx
  on public.book_files (book_id);

create index if not exists book_files_file_type_idx
  on public.book_files (file_type);

create unique index if not exists book_files_bucket_path_uidx
  on public.book_files (bucket, storage_path);

-- ---------------------------------------------------------------------------
-- 4. dataset_versions
-- ---------------------------------------------------------------------------

create table if not exists public.dataset_versions (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books (id) on delete cascade,
  version integer not null,
  schema_version text not null,
  json_file_id uuid not null references public.book_files (id) on delete restrict,
  status text not null default 'draft',
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  verified_at timestamptz,
  notes text,
  constraint dataset_versions_version_positive check (version >= 1),
  constraint dataset_versions_book_version_key unique (book_id, version),
  constraint dataset_versions_status_check check (
    status in ('draft', 'verified', 'published', 'superseded', 'archived')
  )
);

comment on table public.dataset_versions is
  'Revision history for a book dataset. version = book dataset revision; schema_version = Phase 1 JSON schema version.';

comment on column public.dataset_versions.version is
  'Integer revision of this book''s dataset (1, 2, 3…). Independent from schema_version.';

comment on column public.dataset_versions.schema_version is
  'Phase 1 JSON schema version used by the linked canonical JSON (e.g. 0.1).';

comment on column public.dataset_versions.json_file_id is
  'FK to the book_files row for the canonical JSON object in Storage.';

create index if not exists dataset_versions_book_id_idx
  on public.dataset_versions (book_id);

create index if not exists dataset_versions_json_file_id_idx
  on public.dataset_versions (json_file_id);

-- At most one current dataset version per book
create unique index if not exists dataset_versions_one_current_per_book_uidx
  on public.dataset_versions (book_id)
  where is_current = true;

-- ---------------------------------------------------------------------------
-- RLS — simplest safe prototype
-- Authenticated users may read catalog metadata.
-- Writes are admin-only (profiles.role = 'admin'). Service role bypasses RLS.
-- ---------------------------------------------------------------------------

alter table public.book_series enable row level security;
alter table public.books enable row level security;
alter table public.book_files enable row level security;
alter table public.dataset_versions enable row level security;

-- book_series
drop policy if exists "book_series_select_authenticated" on public.book_series;
create policy "book_series_select_authenticated"
on public.book_series
for select
to authenticated
using (true);

drop policy if exists "book_series_write_admin" on public.book_series;
create policy "book_series_write_admin"
on public.book_series
for all
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- books
drop policy if exists "books_select_authenticated" on public.books;
create policy "books_select_authenticated"
on public.books
for select
to authenticated
using (true);

drop policy if exists "books_write_admin" on public.books;
create policy "books_write_admin"
on public.books
for all
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- book_files
drop policy if exists "book_files_select_authenticated" on public.book_files;
create policy "book_files_select_authenticated"
on public.book_files
for select
to authenticated
using (true);

drop policy if exists "book_files_write_admin" on public.book_files;
create policy "book_files_write_admin"
on public.book_files
for all
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- dataset_versions
drop policy if exists "dataset_versions_select_authenticated" on public.dataset_versions;
create policy "dataset_versions_select_authenticated"
on public.dataset_versions
for select
to authenticated
using (true);

drop policy if exists "dataset_versions_write_admin" on public.dataset_versions;
create policy "dataset_versions_write_admin"
on public.dataset_versions
for all
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

grant select, insert, update, delete on table public.book_series to authenticated;
grant select, insert, update, delete on table public.books to authenticated;
grant select, insert, update, delete on table public.book_files to authenticated;
grant select, insert, update, delete on table public.dataset_versions to authenticated;

-- ---------------------------------------------------------------------------
-- Storage buckets (private) + object policies
-- Copyrighted source PDFs must not be public.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'book-sources',
    'book-sources',
    false,
    104857600, -- 100 MiB
    array['application/pdf']::text[]
  ),
  (
    'book-datasets',
    'book-datasets',
    false,
    52428800, -- 50 MiB
    array['application/json', 'text/json']::text[]
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Authenticated read of private curriculum objects
drop policy if exists "book_sources_select_authenticated" on storage.objects;
create policy "book_sources_select_authenticated"
on storage.objects
for select
to authenticated
using (bucket_id = 'book-sources');

drop policy if exists "book_datasets_select_authenticated" on storage.objects;
create policy "book_datasets_select_authenticated"
on storage.objects
for select
to authenticated
using (bucket_id = 'book-datasets');

-- Admin-only writes for both buckets
drop policy if exists "book_sources_write_admin" on storage.objects;
create policy "book_sources_write_admin"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'book-sources'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  bucket_id = 'book-sources'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists "book_datasets_write_admin" on storage.objects;
create policy "book_datasets_write_admin"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'book-datasets'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  bucket_id = 'book-datasets'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);
