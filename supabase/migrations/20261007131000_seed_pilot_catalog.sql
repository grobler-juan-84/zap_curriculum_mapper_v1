-- Seed pilot catalog for feasibility study:
-- 3 series, 4 books, unit batch_json file pointers (no canonical dataset_versions yet).
-- storage_path values are intended Storage object paths; local repo copies remain under data/phase1/.
-- Idempotent: safe to re-run (ON CONFLICT / NOT EXISTS).

-- ---------------------------------------------------------------------------
-- Series
-- ---------------------------------------------------------------------------

insert into public.book_series (name, publisher, description)
select v.name, v.publisher, v.description
from (
  values
    (
      'Beehive',
      'Oxford University Press',
      'Beehive American student books used in the Phase 1 pilot set.'
    ),
    (
      'Big English',
      'Pearson Education Limited',
      'Big English / Big English Plus student books used in the Phase 1 pilot set.'
    ),
    (
      'Reach Higher',
      'National Geographic Learning',
      'Reach Higher student books used in the Phase 1 pilot set.'
    )
) as v(name, publisher, description)
where not exists (
  select 1 from public.book_series s where lower(s.name) = lower(v.name)
);

update public.book_series s
set
  publisher = v.publisher,
  description = v.description
from (
  values
    (
      'Beehive',
      'Oxford University Press',
      'Beehive American student books used in the Phase 1 pilot set.'
    ),
    (
      'Big English',
      'Pearson Education Limited',
      'Big English / Big English Plus student books used in the Phase 1 pilot set.'
    ),
    (
      'Reach Higher',
      'National Geographic Learning',
      'Reach Higher student books used in the Phase 1 pilot set.'
    )
) as v(name, publisher, description)
where lower(s.name) = lower(v.name);

-- ---------------------------------------------------------------------------
-- Books (stable book_id = folder / registry convention)
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
      'beehive_1_sb',
      'Beehive',
      'Beehive 1 Student Book',
      '1',
      'Student Book',
      null::text,
      'English',
      'verified'
    ),
    (
      'big_english_1_sb',
      'Big English',
      'Big English 1 Student Book',
      '1',
      'Student Book',
      null::text,
      'English',
      'verified'
    ),
    (
      'big_english_2_sb',
      'Big English',
      'Big English 2 Student Book',
      '2',
      'Student Book',
      null::text,
      'English',
      'verified'
    ),
    (
      'reach_higher_2a',
      'Reach Higher',
      'Reach Higher 2A Student Book',
      '2A',
      'Student Book',
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
-- Batch JSON file pointers (working unit batches; no dataset_versions yet)
-- ---------------------------------------------------------------------------

with batch_rows (
  book_key,
  label,
  filename,
  storage_path,
  file_status
) as (
  values
    -- Beehive 1 (units 1–8 verified)
    ('beehive_1_sb', 'Unit 1', 'beehive_1_sb_unit_01.json', 'beehive/beehive_1_sb/batches/unit_01.json', 'verified'),
    ('beehive_1_sb', 'Unit 2', 'beehive_1_sb_unit_02.json', 'beehive/beehive_1_sb/batches/unit_02.json', 'verified'),
    ('beehive_1_sb', 'Unit 3', 'beehive_1_sb_unit_03.json', 'beehive/beehive_1_sb/batches/unit_03.json', 'verified'),
    ('beehive_1_sb', 'Unit 4', 'beehive_1_sb_unit_04.json', 'beehive/beehive_1_sb/batches/unit_04.json', 'verified'),
    ('beehive_1_sb', 'Unit 5', 'beehive_1_sb_unit_05.json', 'beehive/beehive_1_sb/batches/unit_05.json', 'verified'),
    ('beehive_1_sb', 'Unit 6', 'beehive_1_sb_unit_06.json', 'beehive/beehive_1_sb/batches/unit_06.json', 'verified'),
    ('beehive_1_sb', 'Unit 7', 'beehive_1_sb_unit_07.json', 'beehive/beehive_1_sb/batches/unit_07.json', 'verified'),
    ('beehive_1_sb', 'Unit 8', 'beehive_1_sb_unit_08.json', 'beehive/beehive_1_sb/batches/unit_08.json', 'verified'),
    -- Big English 1 (units 1–9 verified)
    ('big_english_1_sb', 'Unit 1', 'big_english_1_sb_unit_01.json', 'big-english/big_english_1_sb/batches/unit_01.json', 'verified'),
    ('big_english_1_sb', 'Unit 2', 'big_english_1_sb_unit_02.json', 'big-english/big_english_1_sb/batches/unit_02.json', 'verified'),
    ('big_english_1_sb', 'Unit 3', 'big_english_1_sb_unit_03.json', 'big-english/big_english_1_sb/batches/unit_03.json', 'verified'),
    ('big_english_1_sb', 'Unit 4', 'big_english_1_sb_unit_04.json', 'big-english/big_english_1_sb/batches/unit_04.json', 'verified'),
    ('big_english_1_sb', 'Unit 5', 'big_english_1_sb_unit_05.json', 'big-english/big_english_1_sb/batches/unit_05.json', 'verified'),
    ('big_english_1_sb', 'Unit 6', 'big_english_1_sb_unit_06.json', 'big-english/big_english_1_sb/batches/unit_06.json', 'verified'),
    ('big_english_1_sb', 'Unit 7', 'big_english_1_sb_unit_07.json', 'big-english/big_english_1_sb/batches/unit_07.json', 'verified'),
    ('big_english_1_sb', 'Unit 8', 'big_english_1_sb_unit_08.json', 'big-english/big_english_1_sb/batches/unit_08.json', 'verified'),
    ('big_english_1_sb', 'Unit 9', 'big_english_1_sb_unit_09.json', 'big-english/big_english_1_sb/batches/unit_09.json', 'verified'),
    -- Big English 2 (units 1–9 verified)
    ('big_english_2_sb', 'Unit 1', 'big_english_2_sb_unit_01.json', 'big-english/big_english_2_sb/batches/unit_01.json', 'verified'),
    ('big_english_2_sb', 'Unit 2', 'big_english_2_sb_unit_02.json', 'big-english/big_english_2_sb/batches/unit_02.json', 'verified'),
    ('big_english_2_sb', 'Unit 3', 'big_english_2_sb_unit_03.json', 'big-english/big_english_2_sb/batches/unit_03.json', 'verified'),
    ('big_english_2_sb', 'Unit 4', 'big_english_2_sb_unit_04.json', 'big-english/big_english_2_sb/batches/unit_04.json', 'verified'),
    ('big_english_2_sb', 'Unit 5', 'big_english_2_sb_unit_05.json', 'big-english/big_english_2_sb/batches/unit_05.json', 'verified'),
    ('big_english_2_sb', 'Unit 6', 'big_english_2_sb_unit_06.json', 'big-english/big_english_2_sb/batches/unit_06.json', 'verified'),
    ('big_english_2_sb', 'Unit 7', 'big_english_2_sb_unit_07.json', 'big-english/big_english_2_sb/batches/unit_07.json', 'verified'),
    ('big_english_2_sb', 'Unit 8', 'big_english_2_sb_unit_08.json', 'big-english/big_english_2_sb/batches/unit_08.json', 'verified'),
    ('big_english_2_sb', 'Unit 9', 'big_english_2_sb_unit_09.json', 'big-english/big_english_2_sb/batches/unit_09.json', 'verified'),
    -- Reach Higher 2A (units 1–3 verified; unit 4 needs review)
    ('reach_higher_2a', 'Unit 1', 'rh2a_sb_unit1.json', 'reach-higher/reach_higher_2a/batches/unit_01.json', 'verified'),
    ('reach_higher_2a', 'Unit 2', 'rh2a_sb_unit2.json', 'reach-higher/reach_higher_2a/batches/unit_02.json', 'verified'),
    ('reach_higher_2a', 'Unit 3', 'rh2a_sb_unit3.json', 'reach-higher/reach_higher_2a/batches/unit_03.json', 'verified'),
    ('reach_higher_2a', 'Unit 4', 'rh2a_sb_unit4.json', 'reach-higher/reach_higher_2a/batches/unit_04.json', 'verified')
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
