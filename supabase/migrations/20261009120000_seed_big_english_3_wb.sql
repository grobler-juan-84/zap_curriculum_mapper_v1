-- Seed Big English 3 Workbook (BE3-WB) catalog row + source PDF pointer + 9 batch_json pointers.
-- PDF bytes: Cloudflare R2 only (D012).
-- Upload PDF: $env:UPLOAD_ONLY='big_english_3_wb'; node scripts/upload_source_pdfs.mjs
-- Upload JSON: $env:UPLOAD_ONLY='big_english_3_wb'; node scripts/upload_pilot_batches.mjs
-- Idempotent: safe to re-run (ON CONFLICT).

insert into public.books (
  book_id,
  series_id,
  title,
  level,
  book_type,
  edition,
  language,
  status
)
select
  v.book_id,
  s.id,
  v.title,
  v.level,
  v.book_type,
  v.edition,
  v.language,
  v.status
from (
  values
    (
      'big_english_3_wb',
      'Big English',
      'Big English 3 Workbook',
      '3',
      'Workbook',
      null::text,
      'English',
      'registered'
    )
) as v(book_id, series_name, title, level, book_type, edition, language, status)
join public.book_series s on lower(s.name) = lower(v.series_name)
on conflict (book_id) do update
set
  series_id = excluded.series_id,
  title = excluded.title,
  level = excluded.level,
  book_type = excluded.book_type,
  edition = excluded.edition,
  language = excluded.language,
  status = excluded.status,
  updated_at = now();

with pdf_rows (
  book_key,
  storage_path,
  filename,
  label
) as (
  values
    (
      'big_english_3_wb',
      'big-english/big_english_3_wb/source.pdf',
      'source.pdf',
      'Source PDF'
    )
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
  'source_pdf',
  'book-sources',
  r.storage_path,
  r.filename,
  'application/pdf',
  r.label,
  'pending'
from pdf_rows r
join public.books b on b.book_id = r.book_key
on conflict (bucket, storage_path) do update
set
  book_id = excluded.book_id,
  file_type = excluded.file_type,
  filename = excluded.filename,
  mime_type = excluded.mime_type,
  label = excluded.label,
  status = excluded.status;

with batch_rows (
  book_key,
  label,
  filename,
  storage_path,
  file_status
) as (
  values
    ('big_english_3_wb', 'Unit 1', 'big_english_3_wb_unit_01.json', 'big-english/big_english_3_wb/batches/unit_01.json', 'pending'),
    ('big_english_3_wb', 'Unit 2', 'big_english_3_wb_unit_02.json', 'big-english/big_english_3_wb/batches/unit_02.json', 'pending'),
    ('big_english_3_wb', 'Unit 3', 'big_english_3_wb_unit_03.json', 'big-english/big_english_3_wb/batches/unit_03.json', 'pending'),
    ('big_english_3_wb', 'Unit 4', 'big_english_3_wb_unit_04.json', 'big-english/big_english_3_wb/batches/unit_04.json', 'pending'),
    ('big_english_3_wb', 'Unit 5', 'big_english_3_wb_unit_05.json', 'big-english/big_english_3_wb/batches/unit_05.json', 'pending'),
    ('big_english_3_wb', 'Unit 6', 'big_english_3_wb_unit_06.json', 'big-english/big_english_3_wb/batches/unit_06.json', 'pending'),
    ('big_english_3_wb', 'Unit 7', 'big_english_3_wb_unit_07.json', 'big-english/big_english_3_wb/batches/unit_07.json', 'pending'),
    ('big_english_3_wb', 'Unit 8', 'big_english_3_wb_unit_08.json', 'big-english/big_english_3_wb/batches/unit_08.json', 'pending'),
    ('big_english_3_wb', 'Unit 9', 'big_english_3_wb_unit_09.json', 'big-english/big_english_3_wb/batches/unit_09.json', 'pending')
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
