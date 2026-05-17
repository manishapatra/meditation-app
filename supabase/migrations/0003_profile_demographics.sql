-- 0003: Add demographic + assessment fields to profiles so the onboarding
-- flow's UPDATE can succeed. Onboarding writes: full_name, age, gender.
-- assessment_responses is added pre-emptively for the GHQ+VPI assessment
-- type referenced in src/types/database.ts so future UI work can land
-- without another migration.
--
-- Safe to re-run: every ADD uses IF NOT EXISTS.
-- Apply via Supabase dashboard → SQL Editor → New query → Run.

alter table public.profiles
  add column if not exists full_name text,
  add column if not exists age       int  check (age is null or (age > 0 and age < 150)),
  add column if not exists gender    text check (
    gender is null or gender in ('male','female','other','prefer_not_to_say')
  ),
  add column if not exists assessment_responses jsonb;
