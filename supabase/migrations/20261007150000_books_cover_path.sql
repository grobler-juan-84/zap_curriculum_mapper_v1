-- Add book cover image path (Storage object path in book-assets).

alter table public.books
  add column if not exists cover_path text;

comment on column public.books.cover_path is
  'Object path within the book-assets bucket for a book cover image (e.g. books/beehive_1_sb/cover.png).';

update public.books
set cover_path = 'books/beehive_1_sb/cover.png'
where book_id = 'beehive_1_sb';

update public.books
set cover_path = 'books/big_english_1_sb/cover.png'
where book_id = 'big_english_1_sb';

update public.books
set cover_path = 'books/big_english_2_sb/cover.png'
where book_id = 'big_english_2_sb';

update public.books
set cover_path = 'books/reach_higher_2a/cover.png'
where book_id = 'reach_higher_2a';
