-- =============================================
-- USER SAVED CHALLENGES
-- For storing user-generated and saved challenges
-- =============================================

-- Add creator_id to challenges for user-generated challenges
alter table challenges add column if not exists creator_id uuid references profiles(id) on delete cascade;

-- Table for tracking which challenges users have saved
create table if not exists user_saved_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  challenge_id uuid references challenges(id) on delete cascade not null,
  saved_at timestamp with time zone default now(),
  unique(user_id, challenge_id)
);

-- Enable RLS
alter table user_saved_challenges enable row level security;
-- Note: challenges RLS is defined in 02_rls.sql

-- Policies for user_saved_challenges
create policy "Users can view own saved challenges"
  on user_saved_challenges for select
  using (auth.uid() = user_id);

create policy "Users can save challenges"
  on user_saved_challenges for insert
  with check (auth.uid() = user_id);

create policy "Users can unsave challenges"
  on user_saved_challenges for delete
  using (auth.uid() = user_id);

-- Index for faster lookups
create index if not exists idx_user_saved_challenges_user_id on user_saved_challenges(user_id);
create index if not exists idx_challenges_creator_id on challenges(creator_id);
create index if not exists idx_challenges_is_daily on challenges(is_daily);
