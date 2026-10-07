-- Seed Big English 1 Student Book canonical v1 pointer + dataset_versions row.
-- Binary JSON upload is separate: node scripts/merge_canonical_book.mjs big_english_1_sb

with book_row as (
  select id
  from public.books
  where book_id = 'big_english_1_sb'
  limit 1
),
file_upsert as (
  insert into public.book_files (
    book_id,
    file_type,
    bucket,
    storage_path,
    filename,
    mime_type,
    label,
    status
  )
  select
    b.id,
    'canonical_json',
    'book-datasets',
    'big-english/big_english_1_sb/canonical/v1.json',
    'v1.json',
    'application/json',
    'Canonical v1',
    'verified'
  from book_row b
  on conflict (bucket, storage_path) do update
  set
    book_id = excluded.book_id,
    file_type = excluded.file_type,
    filename = excluded.filename,
    mime_type = excluded.mime_type,
    label = excluded.label,
    status = excluded.status
  returning id, book_id
)
insert into public.dataset_versions (
  book_id,
  version,
  schema_version,
  json_file_id,
  status,
  is_current,
  notes
)
select
  f.book_id,
  1,
  '0.1',
  f.id,
  'draft',
  true,
  'Merged from 9 verified unit batches; whole-book audit pending. Entity IDs preserved as extracted.'
from file_upsert f
on conflict (book_id, version) do update
set
  schema_version = excluded.schema_version,
  json_file_id = excluded.json_file_id,
  status = excluded.status,
  is_current = excluded.is_current,
  notes = excluded.notes;

-- Ensure only this version is current for the book.
update public.dataset_versions dv
set is_current = false
from public.books b
where dv.book_id = b.id
  and b.book_id = 'big_english_1_sb'
  and dv.version <> 1
  and dv.is_current = true;
