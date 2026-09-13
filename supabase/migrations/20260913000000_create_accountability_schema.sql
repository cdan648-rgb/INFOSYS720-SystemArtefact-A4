create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  course_name text not null,
  assignment_name text not null,
  created_at timestamptz not null default now()
);

create table public.members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);
create index members_team_id_idx on public.members(team_id);

create table public.ai_records (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  task_name text not null,
  ai_level smallint not null check (ai_level between 0 and 4),
  ai_tool text,
  description text not null,
  evidence_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ai_records_team_id_idx on public.ai_records(team_id);
create index ai_records_member_id_idx on public.ai_records(member_id);
create trigger ai_records_set_updated_at before update on public.ai_records
  for each row execute function public.set_updated_at();

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references public.ai_records(id) on delete cascade,
  reviewer_id uuid not null references public.members(id) on delete cascade,
  decision text not null check (decision in ('acknowledged','non_endorsed')),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reviews_record_reviewer_unique unique (record_id, reviewer_id),
  constraint reviews_non_endorsed_requires_comment
    check (decision <> 'non_endorsed' or (comment is not null and length(trim(comment)) > 0))
);
create index reviews_record_id_idx on public.reviews(record_id);
create index reviews_reviewer_id_idx on public.reviews(reviewer_id);
create trigger reviews_set_updated_at before update on public.reviews
  for each row execute function public.set_updated_at();

alter table public.teams enable row level security;
alter table public.members enable row level security;
alter table public.ai_records enable row level security;
alter table public.reviews enable row level security;

-- PoC simplification: there is no real Supabase Auth session (demo users are
-- identified via a plain cookie, not Supabase Auth), so per-row policies keyed
-- on auth.uid() are not meaningful here. RLS is enabled (per Supabase best
-- practice / to avoid advisor warnings) with fully permissive policies rather
-- than disabled outright. This means the anon key can read/write all data,
-- which is acceptable only for this local academic prototype with synthetic
-- data, not a deployed multi-tenant system.
create policy "poc_public_all_teams" on public.teams for all to anon, authenticated using (true) with check (true);
create policy "poc_public_all_members" on public.members for all to anon, authenticated using (true) with check (true);
create policy "poc_public_all_ai_records" on public.ai_records for all to anon, authenticated using (true) with check (true);
create policy "poc_public_all_reviews" on public.reviews for all to anon, authenticated using (true) with check (true);
