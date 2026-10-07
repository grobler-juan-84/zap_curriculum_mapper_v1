-- Mark Beehive 1 Units 9–10 and all Reach Higher 2A unit batches as human-verified.

update public.book_files bf
set status = 'verified'
from public.books b
where bf.book_id = b.id
  and bf.file_type = 'batch_json'
  and bf.bucket = 'book-datasets'
  and (
    (
      b.book_id = 'beehive_1_sb'
      and bf.storage_path in (
        'beehive/beehive_1_sb/batches/unit_09.json',
        'beehive/beehive_1_sb/batches/unit_10.json'
      )
    )
    or (
      b.book_id = 'reach_higher_2a'
      and bf.storage_path like 'reach-higher/reach_higher_2a/batches/unit_0%.json'
    )
  );
