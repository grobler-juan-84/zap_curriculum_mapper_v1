-- Seed BE2-WB unit batch_json pointers (pending human verification).
-- JSON upload: $env:UPLOAD_ONLY='big_english_2_wb'; node scripts/upload_pilot_batches.mjs
-- Idempotent.

with batch_rows (
  book_key,
  label,
  filename,
  storage_path,
  file_status
) as (
  values
    ('big_english_2_wb', 'Unit 1', 'big_english_2_wb_unit_01.json', 'big-english/big_english_2_wb/batches/unit_01.json', 'pending'),
    ('big_english_2_wb', 'Unit 2', 'big_english_2_wb_unit_02.json', 'big-english/big_english_2_wb/batches/unit_02.json', 'pending'),
    ('big_english_2_wb', 'Unit 3', 'big_english_2_wb_unit_03.json', 'big-english/big_english_2_wb/batches/unit_03.json', 'pending'),
    ('big_english_2_wb', 'Unit 4', 'big_english_2_wb_unit_04.json', 'big-english/big_english_2_wb/batches/unit_04.json', 'pending'),
    ('big_english_2_wb', 'Unit 5', 'big_english_2_wb_unit_05.json', 'big-english/big_english_2_wb/batches/unit_05.json', 'pending'),
    ('big_english_2_wb', 'Unit 6', 'big_english_2_wb_unit_06.json', 'big-english/big_english_2_wb/batches/unit_06.json', 'pending'),
    ('big_english_2_wb', 'Unit 7', 'big_english_2_wb_unit_07.json', 'big-english/big_english_2_wb/batches/unit_07.json', 'pending'),
    ('big_english_2_wb', 'Unit 8', 'big_english_2_wb_unit_08.json', 'big-english/big_english_2_wb/batches/unit_08.json', 'pending'),
    ('big_english_2_wb', 'Unit 9', 'big_english_2_wb_unit_09.json', 'big-english/big_english_2_wb/batches/unit_09.json', 'pending')
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

update public.books
set status = 'extracted', updated_at = now()
where book_id = 'big_english_2_wb';
