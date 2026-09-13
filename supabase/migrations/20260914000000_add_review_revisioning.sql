-- Adds a lightweight revision counter so a disputed record can be revised
-- and re-reviewed without deleting prior review rounds. This preserves
-- previous review decisions/comments as history; it does NOT preserve the
-- previous contents of the ai_records row itself (no version-storage table
-- is introduced at this stage).

alter table public.ai_records
  add column revision integer not null default 1;

alter table public.reviews
  add column record_revision integer not null default 1;

alter table public.reviews
  drop constraint reviews_record_reviewer_unique;

alter table public.reviews
  add constraint reviews_record_reviewer_revision_unique
  unique (record_id, reviewer_id, record_revision);
