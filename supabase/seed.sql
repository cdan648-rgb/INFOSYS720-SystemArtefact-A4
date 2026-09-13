-- Demo data for the INFOSYS 720 Team AI Accountability PoC.
-- Fixed UUIDs + ON CONFLICT DO UPDATE make this safe to re-run any time.

insert into public.teams (id, name, course_name, assignment_name)
values ('11111111-1111-4111-8111-111111111111', 'Group 4', 'INFOSYS 720', 'Collaborative Research Assignment')
on conflict (id) do update set
  name = excluded.name,
  course_name = excluded.course_name,
  assignment_name = excluded.assignment_name;

insert into public.members (id, team_id, name) values
  ('22222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111111', 'Casey'),
  ('33333333-3333-4333-8333-333333333333', '11111111-1111-4111-8111-111111111111', 'Alex'),
  ('44444444-4444-4444-8444-444444444444', '11111111-1111-4111-8111-111111111111', 'Jamie')
on conflict (id) do update set
  team_id = excluded.team_id,
  name = excluded.name;
