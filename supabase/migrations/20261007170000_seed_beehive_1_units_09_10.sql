-- Seed Beehive 1 Student Book unit batches 9–10 (book_files pointers).
-- JSON upload is separate: place files under data/phase1/beehive_1_sb/ then
--   node scripts/upload_pilot_batches.mjs

with batch_rows (
  book_key,
  label,
  filename,
  storage_path,
  file_status
) as (
  values
    ('beehive_1_sb', 'Unit 9', 'beehive_1_sb_unit_09.json', 'beehive/beehive_1_sb/batches/unit_09.json', 'verified'),
    ('beehive_1_sb', 'Unit 10', 'beehive_1_sb_unit_10.json', 'beehive/beehive_1_sb/batches/unit_10.json', 'verified')
)
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
  'batch_json',
  'book-datasets',
  r.storage_path,
  r.filename,
  'application/json',
  r.label,
  r.file_status
from batch_rows r
join public.books b on b.book_id = r.book_key
on conflict (bucket, storage_path) do update
set
  book_id = excluded.book_id,
  file_type = excluded.file_type,
  filename = excluded.filename,
  mime_type = excluded.mime_type,
  label = excluded.label,
  status = excluded.status;
