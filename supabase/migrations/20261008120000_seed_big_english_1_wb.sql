-- Seed Big English 1 Workbook (BE1-WB) catalog row + file pointers.
-- PDF bytes: Cloudflare R2 only (D012). JSON: Supabase book-datasets.
-- Uploads are separate:
--   $env:UPLOAD_ONLY='big_english_1_wb'; node scripts/upload_source_pdfs.mjs
--   $env:UPLOAD_ONLY='big_english_1_wb'; node scripts/upload_pilot_batches.mjs
-- Idempotent: safe to re-run (ON CONFLICT).

-- ---------------------------------------------------------------------------
-- Book
-- ---------------------------------------------------------------------------

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
      'big_english_1_wb',
      'Big English',
      'Big English 1 Workbook',
      '1',
      'Workbook',
      null::text,
      'English',
      'extracted'
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

-- ---------------------------------------------------------------------------
-- Source PDF pointer (logical bucket book-sources; object lives on R2)
-- ---------------------------------------------------------------------------

with pdf_rows (
  book_key,
  storage_path,
  filename,
  label
) as (
  values
    (
      'big_english_1_wb',
      'big-english/big_english_1_wb/source.pdf',
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

-- ---------------------------------------------------------------------------
-- Unit batch JSON pointers (pending human Verification)
-- ---------------------------------------------------------------------------

with batch_rows (
  book_key,
  label,
  filename,
  storage_path,
  file_status
) as (
  values
    ('big_english_1_wb', 'Unit 1', 'big_english_1_wb_unit_01.json', 'big-english/big_english_1_wb/batches/unit_01.json', 'pending'),
    ('big_english_1_wb', 'Unit 2', 'big_english_1_wb_unit_02.json', 'big-english/big_english_1_wb/batches/unit_02.json', 'pending'),
    ('big_english_1_wb', 'Unit 3', 'big_english_1_wb_unit_03.json', 'big-english/big_english_1_wb/batches/unit_03.json', 'pending'),
    ('big_english_1_wb', 'Unit 4', 'big_english_1_wb_unit_04.json', 'big-english/big_english_1_wb/batches/unit_04.json', 'pending'),
    ('big_english_1_wb', 'Unit 5', 'big_english_1_wb_unit_05.json', 'big-english/big_english_1_wb/batches/unit_05.json', 'pending'),
    ('big_english_1_wb', 'Unit 6', 'big_english_1_wb_unit_06.json', 'big-english/big_english_1_wb/batches/unit_06.json', 'pending'),
    ('big_english_1_wb', 'Unit 7', 'big_english_1_wb_unit_07.json', 'big-english/big_english_1_wb/batches/unit_07.json', 'pending'),
    ('big_english_1_wb', 'Unit 8', 'big_english_1_wb_unit_08.json', 'big-english/big_english_1_wb/batches/unit_08.json', 'pending'),
    ('big_english_1_wb', 'Unit 9', 'big_english_1_wb_unit_09.json', 'big-english/big_english_1_wb/batches/unit_09.json', 'pending')
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
