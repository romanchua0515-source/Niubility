-- Tool listing / partnership requests (public submit + admin read via service role)

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  description text not null,
  status text not null default 'pending'
    check (status in ('pending', 'reviewed', 'approved')),
  created_at timestamptz not null default now()
);

create index submissions_created_at_idx on public.submissions (created_at desc);

alter table public.submissions enable row level security;

-- Anonymous site visitors can insert (server action uses anon key)
create policy "submissions_insert_public"
  on public.submissions
  for insert
  to anon, authenticated
  with check (true);
