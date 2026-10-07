-- Seed book_files pointers for pilot source PDFs (private book-sources bucket).
-- Binary upload is separate: node scripts/upload_source_pdfs.mjs

with pdf_rows (
  book_key,
  storage_path,
  filename,
  label
) as (
  values
    ('beehive_1_sb', 'beehive/beehive_1_sb/source.pdf', 'source.pdf', 'Source PDF'),
    ('big_english_1_sb', 'big-english/big_english_1_sb/source.pdf', 'source.pdf', 'Source PDF'),
    ('big_english_2_sb', 'big-english/big_english_2_sb/source.pdf', 'source.pdf', 'Source PDF'),
    ('reach_higher_2a', 'reach-higher/reach_higher_2a/source.pdf', 'source.pdf', 'Source PDF')
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
