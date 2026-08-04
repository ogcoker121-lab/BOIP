-- Minimal schema for Founder Discovery Interview persistence (v0.2).
-- No auth: interviews are anonymous, identified only by their generated id.

create extension if not exists pgcrypto;

create table if not exists interviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'in_progress' check (status in ('in_progress', 'submitted')),
  current_question_index integer not null default 0
);

create table if not exists interview_answers (
  id uuid primary key default gen_random_uuid(),
  interview_id uuid not null references interviews (id) on delete cascade,
  question_id text not null,
  answer text not null default '',
  updated_at timestamptz not null default now(),
  unique (interview_id, question_id)
);

create index if not exists interview_answers_interview_id_idx on interview_answers (interview_id);

-- The app only ever talks to Supabase from server-side API routes using the
-- service role key, which bypasses RLS. RLS is enabled anyway as a safety
-- net with no policies, so these tables stay unreachable if the anon/public
-- key is ever used against them directly.
alter table interviews enable row level security;
alter table interview_answers enable row level security;
