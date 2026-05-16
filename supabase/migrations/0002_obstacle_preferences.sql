-- 0002: Store user's reported obstacle categories from onboarding (feeds stuck flow)
-- Apply via Supabase dashboard → SQL Editor → New query → Run

alter table public.profiles
  add column if not exists obstacle_preferences jsonb;
