-- Stillness MVP schema — 0001 init
-- How to apply: Supabase dashboard → SQL Editor → New query → paste this whole file → Run

create extension if not exists "uuid-ossp";

------------------------------------------------------------
-- profiles: one row per user, path assessment + preferences
------------------------------------------------------------
create table if not exists public.profiles (
  id                   uuid primary key references auth.users (id) on delete cascade,
  dominant_path        text check (dominant_path in ('karma','bhakti','jnana','raja')),
  path_resonance       jsonb,
  preferred_length_min int default 15 check (preferred_length_min in (10, 15, 20, 30)),
  started_at           timestamptz not null default now(),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

------------------------------------------------------------
-- practice_sessions: every practice the user starts/completes
------------------------------------------------------------
create table if not exists public.practice_sessions (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references auth.users (id) on delete cascade,
  practice_slug    text not null,
  practice_kind    text not null check (practice_kind in ('breathwork','meditation','reading')),
  started_at       timestamptz not null default now(),
  completed_at     timestamptz,
  duration_seconds int
);

create index if not exists practice_sessions_user_id_idx
  on public.practice_sessions (user_id, started_at desc);

------------------------------------------------------------
-- journal_entries: daily check-in linked to a session
------------------------------------------------------------
create table if not exists public.journal_entries (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  session_id  uuid references public.practice_sessions (id) on delete set null,
  entry_date  date not null default current_date,
  body        smallint check (body between 1 and 3),
  heart       smallint check (heart between 1 and 3),
  mind        smallint check (mind between 1 and 3),
  reflection  text,
  breath      text check (breath in ('deep','fragmented','rhythmic','effortless')),
  sealed_at   timestamptz not null default now()
);

create index if not exists journal_entries_user_date_idx
  on public.journal_entries (user_id, entry_date desc);

------------------------------------------------------------
-- stuck_logs: "I feel stuck" flow
------------------------------------------------------------
create table if not exists public.stuck_logs (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references auth.users (id) on delete cascade,
  category          text not null check (category in ('physical','emotional','mental','subtle')),
  obstacle_text     text,
  recommended_tools jsonb,
  tried_tool        text,
  helpful           text check (helpful in ('yes','partly','no')),
  created_at        timestamptz not null default now(),
  resolved_at       timestamptz
);

create index if not exists stuck_logs_user_idx
  on public.stuck_logs (user_id, created_at desc);

------------------------------------------------------------
-- Auto-create a profile row when a new auth user signs up
------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

------------------------------------------------------------
-- Row-Level Security: users can only access their own rows
------------------------------------------------------------
alter table public.profiles          enable row level security;
alter table public.practice_sessions enable row level security;
alter table public.journal_entries   enable row level security;
alter table public.stuck_logs        enable row level security;

-- profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- practice_sessions
drop policy if exists "sessions_select_own" on public.practice_sessions;
create policy "sessions_select_own" on public.practice_sessions
  for select using (auth.uid() = user_id);

drop policy if exists "sessions_insert_own" on public.practice_sessions;
create policy "sessions_insert_own" on public.practice_sessions
  for insert with check (auth.uid() = user_id);

drop policy if exists "sessions_update_own" on public.practice_sessions;
create policy "sessions_update_own" on public.practice_sessions
  for update using (auth.uid() = user_id);

-- journal_entries
drop policy if exists "journal_select_own" on public.journal_entries;
create policy "journal_select_own" on public.journal_entries
  for select using (auth.uid() = user_id);

drop policy if exists "journal_insert_own" on public.journal_entries;
create policy "journal_insert_own" on public.journal_entries
  for insert with check (auth.uid() = user_id);

drop policy if exists "journal_update_own" on public.journal_entries;
create policy "journal_update_own" on public.journal_entries
  for update using (auth.uid() = user_id);

drop policy if exists "journal_delete_own" on public.journal_entries;
create policy "journal_delete_own" on public.journal_entries
  for delete using (auth.uid() = user_id);

-- stuck_logs
drop policy if exists "stuck_select_own" on public.stuck_logs;
create policy "stuck_select_own" on public.stuck_logs
  for select using (auth.uid() = user_id);

drop policy if exists "stuck_insert_own" on public.stuck_logs;
create policy "stuck_insert_own" on public.stuck_logs
  for insert with check (auth.uid() = user_id);

drop policy if exists "stuck_update_own" on public.stuck_logs;
create policy "stuck_update_own" on public.stuck_logs
  for update using (auth.uid() = user_id);
