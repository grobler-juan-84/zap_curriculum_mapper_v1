-- Private assets bucket for series/book imagery (not curriculum JSON, not source PDFs).
-- Also adds optional cover_path on book_series for Storage object paths.

alter table public.book_series
  add column if not exists cover_path text;

comment on column public.book_series.cover_path is
  'Object path within the book-assets bucket for a series cover image (e.g. series/beehive_book_series.png).';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'book-assets',
  'book-assets',
  false,
  10485760, -- 10 MiB
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "book_assets_select_authenticated" on storage.objects;
create policy "book_assets_select_authenticated"
on storage.objects
for select
to authenticated
using (bucket_id = 'book-assets');

drop policy if exists "book_assets_write_admin" on storage.objects;
create policy "book_assets_write_admin"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'book-assets'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  bucket_id = 'book-assets'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- Seed/update cover paths for the pilot series (images uploaded separately).
update public.book_series
set cover_path = 'series/beehive_book_series.png'
where lower(name) = 'beehive';

update public.book_series
set cover_path = 'series/big_english_book_series.png'
where lower(name) = 'big english';

update public.book_series
set cover_path = 'series/reach_higher_book_series.png'
where lower(name) = 'reach higher';
