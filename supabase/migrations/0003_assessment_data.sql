-- 0003: Demographics + raw assessment responses
-- Apply via Supabase dashboard → SQL Editor → New query → Run

alter table public.profiles
  add column if not exists full_name text,
  add column if not exists age int check (age is null or age between 1 and 120),
  add column if not exists gender text check (gender is null or gender in ('male','female','other','prefer_not_to_say')),
  -- Raw responses: { ghq: { GHQ1: 0..3, ... }, vpi: { VPI1: 1..7, ... } }
  -- Scoring is intentionally NOT done at write time — we score later in app code
  -- so the rubric can change without a re-survey.
  add column if not exists assessment_responses jsonb;
