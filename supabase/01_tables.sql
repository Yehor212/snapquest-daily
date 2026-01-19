-- =============================================
-- SNAPQUEST DAILY - TABLES
-- =============================================

-- 1. Профили пользователей
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  display_name text,
  avatar_url text,
  xp integer default 0,
  level integer default 1,
  streak integer default 0,
  longest_streak integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. Челленджи (ежедневные задания)
create table challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text check (category in ('nature', 'urban', 'people', 'food', 'abstract', 'mood', 'color', 'light')),
  difficulty text check (difficulty in ('easy', 'medium', 'hard')) default 'medium',
  xp_reward integer default 50,
  day_number integer,
  is_daily boolean default false,
  created_at timestamp with time zone default now(),
  expires_at timestamp with time zone
);

-- 3. Приватные события
create table events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  access_code text unique not null,
  creator_id uuid references profiles(id) on delete cascade not null,
  event_type text check (event_type in ('wedding', 'party', 'teambuilding', 'birthday', 'other')) default 'other',
  cover_image text,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  status text check (status in ('draft', 'active', 'completed', 'archived')) default 'active',
  created_at timestamp with time zone default now()
);

-- 4. Фото-охоты
create table hunts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cover_image text,
  theme text check (theme in ('city', 'nature', 'home', 'travel', 'seasonal')) default 'city',
  difficulty text check (difficulty in ('easy', 'medium', 'hard')) default 'medium',
  duration text check (duration in ('day', 'week', 'month')) default 'week',
  total_xp integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- 5. Фотографии
create table photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  image_url text not null,
  thumbnail_url text,
  challenge_id uuid references challenges(id) on delete set null,
  event_id uuid references events(id) on delete set null,
  hunt_id uuid references hunts(id) on delete set null,
  hunt_task_id uuid,
  filter_applied text,
  likes_count integer default 0,
  created_at timestamp with time zone default now()
);

-- 6. Задания событий
create table event_challenges (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade not null,
  title text not null,
  description text,
  order_num integer default 0,
  xp_reward integer default 30
);

-- 7. Участники событий
create table event_participants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  joined_at timestamp with time zone default now(),
  unique(event_id, user_id)
);

-- 8. Задания охоты
create table hunt_tasks (
  id uuid primary key default gen_random_uuid(),
  hunt_id uuid references hunts(id) on delete cascade not null,
  title text not null,
  description text,
  order_num integer default 0,
  xp_reward integer default 20,
  hint text
);

-- 9. Прогресс охоты пользователя
create table hunt_progress (
  id uuid primary key default gen_random_uuid(),
  hunt_id uuid references hunts(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  completed_tasks uuid[] default '{}',
  total_xp_earned integer default 0,
  started_at timestamp with time zone default now(),
  completed_at timestamp with time zone,
  unique(hunt_id, user_id)
);

-- 10. Лайки фото
create table photo_likes (
  id uuid primary key default gen_random_uuid(),
  photo_id uuid references photos(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique(photo_id, user_id)
);

-- 11. Бейджи/достижения
create table badges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon text,
  category text,
  requirement_type text,
  requirement_value integer
);

-- 12. Бейджи пользователей
create table user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  badge_id uuid references badges(id) on delete cascade not null,
  earned_at timestamp with time zone default now(),
  unique(user_id, badge_id)
);
