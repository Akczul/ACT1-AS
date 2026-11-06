create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password text not null,
  name text not null,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;