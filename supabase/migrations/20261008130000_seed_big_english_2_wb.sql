-- Seed Big English 2 Workbook (BE2-WB) catalog row + source PDF pointer.
-- PDF bytes: Cloudflare R2 only (D012). Unit batch_json rows are added after extraction
-- (local placeholders under data/phase1/big_english_2_wb/ are empty `{}` and must not be uploaded yet).
-- Upload: $env:UPLOAD_ONLY='big_english_2_wb'; node scripts/upload_source_pdfs.mjs
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
      'big_english_2_wb',
      'Big English',
      'Big English 2 Workbook',
      '2',
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
      'big_english_2_wb',
      'big-english/big_english_2_wb/source.pdf',
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
