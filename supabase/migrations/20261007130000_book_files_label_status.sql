-- Add operational display/workflow fields on book_files (prototype).
-- label = human-friendly file label (e.g. Unit 1); not curriculum structure.
-- status = per-file workflow/verification state (distinct from books.status).

alter table public.book_files
  add column if not exists label text,
  add column if not exists status text;

comment on column public.book_files.label is
  'Human-friendly display label for the file (e.g. Unit 1). Generic only — not a relational unit model.';

comment on column public.book_files.status is
  'Workflow/verification state of this individual file/batch (e.g. pending, needs_review, verified). Distinct from books.status.';

-- Drop prior check if re-running; then add status domain check (null allowed).
alter table public.book_files
  drop constraint if exists book_files_status_check;

alter table public.book_files
  add constraint book_files_status_check check (
    status is null
    or status in ('pending', 'needs_review', 'verified')
  );

create index if not exists book_files_status_idx
  on public.book_files (status);
