-- =============================================
-- SNAPQUEST DAILY - FULL DATABASE SETUP
-- Run this entire file in Supabase SQL Editor
-- =============================================

-- =============================================
-- 1. TABLES
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

-- 4. Задания событий
create table event_challenges (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade not null,
  title text not null,
  description text,
  order_num integer default 0,
  xp_reward integer default 30
);

-- 5. Фото-охоты
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

-- 6. Задания охоты
create table hunt_tasks (
  id uuid primary key default gen_random_uuid(),
  hunt_id uuid references hunts(id) on delete cascade not null,
  title text not null,
  description text,
  order_num integer default 0,
  xp_reward integer default 20,
  hint text
);

-- 7. Фотографии
create table photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  image_url text not null,
  thumbnail_url text,
  challenge_id uuid references challenges(id) on delete set null,
  event_id uuid references events(id) on delete set null,
  event_challenge_id uuid references event_challenges(id) on delete set null,
  hunt_id uuid references hunts(id) on delete set null,
  hunt_task_id uuid references hunt_tasks(id) on delete set null,
  filter_applied text,
  likes_count integer default 0,
  xp_earned integer default 0,
  created_at timestamp with time zone default now()
);

-- 8. Участники событий
create table event_participants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  joined_at timestamp with time zone default now(),
  unique(event_id, user_id)
);

-- 9. Прогресс охоты
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

-- 11. Бейджи
create table badges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon text,
  color text default 'primary',
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

-- Индексы
create index idx_photos_user_id on photos(user_id);
create index idx_photos_created_at on photos(created_at desc);
create index idx_photos_challenge_id on photos(challenge_id);
create index idx_photos_event_id on photos(event_id);
create index idx_photos_hunt_id on photos(hunt_id);
create index idx_event_challenges_event_id on event_challenges(event_id);
create index idx_hunt_tasks_hunt_id on hunt_tasks(hunt_id);
create index idx_hunt_progress_user_id on hunt_progress(user_id);
create index idx_photo_likes_photo_id on photo_likes(photo_id);
create index idx_user_badges_user_id on user_badges(user_id);

-- =============================================
-- 2. ROW LEVEL SECURITY
-- =============================================

alter table profiles enable row level security;
alter table challenges enable row level security;
alter table photos enable row level security;
alter table events enable row level security;
alter table event_challenges enable row level security;
alter table event_participants enable row level security;
alter table hunts enable row level security;
alter table hunt_tasks enable row level security;
alter table hunt_progress enable row level security;
alter table photo_likes enable row level security;
alter table badges enable row level security;
alter table user_badges enable row level security;

-- Profiles
create policy "Profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Challenges
create policy "Anyone can view challenges" on challenges for select using (true);

-- Photos
create policy "Photos are viewable by everyone" on photos for select using (true);
create policy "Users can insert own photos" on photos for insert with check (auth.uid() = user_id);
create policy "Users can update own photos" on photos for update using (auth.uid() = user_id);
create policy "Users can delete own photos" on photos for delete using (auth.uid() = user_id);

-- Events
create policy "Events viewable by creator and participants" on events for select
  using (creator_id = auth.uid() or id in (select event_id from event_participants where user_id = auth.uid()));
create policy "Users can create events" on events for insert with check (auth.uid() = creator_id);
create policy "Creators can update events" on events for update using (auth.uid() = creator_id);
create policy "Creators can delete events" on events for delete using (auth.uid() = creator_id);

-- Event Challenges
create policy "Event challenges viewable by participants" on event_challenges for select
  using (event_id in (select id from events where creator_id = auth.uid()) or event_id in (select event_id from event_participants where user_id = auth.uid()));
create policy "Creators can insert event challenges" on event_challenges for insert
  with check (event_id in (select id from events where creator_id = auth.uid()));

-- Event Participants
create policy "Participants viewable by all" on event_participants for select using (true);
create policy "Users can join events" on event_participants for insert with check (auth.uid() = user_id);
create policy "Users can leave events" on event_participants for delete using (auth.uid() = user_id);

-- Hunts
create policy "Hunts are viewable by everyone" on hunts for select using (true);
create policy "Hunt tasks viewable by everyone" on hunt_tasks for select using (true);

-- Hunt Progress
create policy "Users can view own hunt progress" on hunt_progress for select using (auth.uid() = user_id);
create policy "Users can insert own hunt progress" on hunt_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own hunt progress" on hunt_progress for update using (auth.uid() = user_id);

-- Photo Likes
create policy "Likes viewable by everyone" on photo_likes for select using (true);
create policy "Users can like photos" on photo_likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike photos" on photo_likes for delete using (auth.uid() = user_id);

-- Badges
create policy "Badges viewable by everyone" on badges for select using (true);
create policy "User badges viewable by everyone" on user_badges for select using (true);
create policy "System can grant badges" on user_badges for insert with check (auth.uid() = user_id);

-- =============================================
-- 3. FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'username',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update likes count
create or replace function update_photo_likes_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update photos set likes_count = likes_count + 1 where id = NEW.photo_id;
  elsif TG_OP = 'DELETE' then
    update photos set likes_count = likes_count - 1 where id = OLD.photo_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_photo_like_change
  after insert or delete on photo_likes
  for each row execute procedure update_photo_likes_count();

-- Add XP function
create or replace function add_user_xp(user_uuid uuid, xp_amount integer)
returns void as $$
declare
  current_xp integer;
  new_level integer;
begin
  select xp into current_xp from profiles where id = user_uuid;
  new_level := ((current_xp + xp_amount) / 100) + 1;
  update profiles set xp = xp + xp_amount, level = new_level, updated_at = now() where id = user_uuid;
end;
$$ language plpgsql security definer;

-- =============================================
-- 4. SEED DATA
-- =============================================

-- Daily challenges
insert into challenges (title, description, category, difficulty, xp_reward, is_daily, day_number) values
('Отражение', 'Найди интересное отражение в воде, стекле или зеркале', 'abstract', 'medium', 50, true, 1),
('Уличное искусство', 'Сфотографируй граффити или стрит-арт', 'urban', 'easy', 30, true, 2),
('Золотой час', 'Поймай красивый свет на закате или рассвете', 'light', 'hard', 75, true, 3),
('Текстуры', 'Найди интересную текстуру: дерево, камень, ткань', 'abstract', 'easy', 30, true, 4),
('Симметрия', 'Сфотографируй что-то симметричное', 'abstract', 'medium', 50, true, 5),
('Минимализм', 'Простая композиция с минимумом элементов', 'mood', 'medium', 50, true, 6),
('Контраст', 'Найди контраст: свет/тень, старое/новое', 'abstract', 'medium', 50, true, 7),
('Натюрморт', 'Создай красивую композицию из предметов', 'food', 'medium', 50, true, 8),
('Силуэт', 'Сфотографируй силуэт на фоне света', 'light', 'hard', 75, true, 9),
('Детали', 'Сними крупным планом мелкую деталь', 'abstract', 'easy', 30, true, 10);

-- Hunt: Городской исследователь
insert into hunts (id, title, description, theme, difficulty, duration, total_xp) values
('11111111-1111-1111-1111-111111111111', 'Городской исследователь', 'Открой свой город заново', 'city', 'medium', 'week', 200);

insert into hunt_tasks (hunt_id, title, description, order_num, xp_reward, hint) values
('11111111-1111-1111-1111-111111111111', 'Архитектурная деталь', 'Найди необычный архитектурный элемент', 1, 30, 'Посмотри вверх'),
('11111111-1111-1111-1111-111111111111', 'Уличный музыкант', 'Сфотографируй уличного артиста', 2, 40, 'Загляни в переходы'),
('11111111-1111-1111-1111-111111111111', 'Скрытый дворик', 'Найди красивый внутренний дворик', 3, 50, 'Зайди в арку'),
('11111111-1111-1111-1111-111111111111', 'Городская природа', 'Природа среди бетона', 4, 30, 'Ищи зелень'),
('11111111-1111-1111-1111-111111111111', 'Ночной город', 'Огни ночного города', 5, 50, 'Дождись заката');

-- Hunt: Природный фотограф
insert into hunts (id, title, description, theme, difficulty, duration, total_xp) values
('22222222-2222-2222-2222-222222222222', 'Природный фотограф', 'Исследуй красоту природы', 'nature', 'easy', 'week', 150);

insert into hunt_tasks (hunt_id, title, description, order_num, xp_reward, hint) values
('22222222-2222-2222-2222-222222222222', 'Капля воды', 'Сфотографируй каплю росы', 1, 30, 'Ищи утром'),
('22222222-2222-2222-2222-222222222222', 'Насекомое', 'Поймай в кадр насекомое', 2, 40, 'Терпение'),
('22222222-2222-2222-2222-222222222222', 'Облака', 'Интересная форма облаков', 3, 25, 'Перед закатом'),
('22222222-2222-2222-2222-222222222222', 'Дерево', 'Красивое дерево', 4, 30, 'Снизу вверх'),
('22222222-2222-2222-2222-222222222222', 'Цветок', 'Макро-съёмка цветка', 5, 25, 'Подойди ближе');

-- Hunt: Домашний уют
insert into hunts (id, title, description, theme, difficulty, duration, total_xp) values
('33333333-3333-3333-3333-333333333333', 'Домашний уют', 'Красота в повседневных вещах', 'home', 'easy', 'day', 100);

insert into hunt_tasks (hunt_id, title, description, order_num, xp_reward, hint) values
('33333333-3333-3333-3333-333333333333', 'Утренний кофе', 'Красивый кадр с кофе', 1, 20, 'Поймай пар'),
('33333333-3333-3333-3333-333333333333', 'Любимая книга', 'Книга в уютной обстановке', 2, 20, 'Добавь плед'),
('33333333-3333-3333-3333-333333333333', 'Окно', 'Вид из окна', 3, 25, 'Золотой час'),
('33333333-3333-3333-3333-333333333333', 'Питомец', 'Фото любимца', 4, 35, 'На их уровне');

-- Badges
insert into badges (name, description, icon, color, category, requirement_type, requirement_value) values
('Первый шаг', 'Загрузите первое фото', 'camera', 'primary', 'beginner', 'photos', 1),
('Новичок', 'Загрузите 5 фото', 'image', 'primary', 'beginner', 'photos', 5),
('Фотограф', 'Загрузите 10 фото', 'award', 'accent', 'progress', 'photos', 10),
('Опытный', 'Загрузите 50 фото', 'star', 'gold', 'progress', 'photos', 50),
('Мастер', 'Загрузите 100 фото', 'trophy', 'gold', 'progress', 'photos', 100),
('На старте', '3 дня подряд', 'flame', 'primary', 'streak', 'streak', 3),
('Огненный стрик', '7 дней подряд', 'zap', 'gold', 'streak', 'streak', 7),
('Две недели', '14 дней подряд', 'target', 'gold', 'streak', 'streak', 14),
('Охотник', 'Завершите первую охоту', 'map', 'accent', 'hunts', 'hunts', 1);

-- =============================================
-- 5. STORAGE BUCKETS
-- =============================================

insert into storage.buckets (id, name, public) values ('photos', 'photos', true);
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

create policy "Anyone can view photos" on storage.objects for select using (bucket_id = 'photos');
create policy "Authenticated users can upload photos" on storage.objects for insert
  with check (bucket_id = 'photos' and auth.role() = 'authenticated');
create policy "Users can update own photos" on storage.objects for update
  using (bucket_id = 'photos' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users can delete own photos" on storage.objects for delete
  using (bucket_id = 'photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Anyone can view avatars" on storage.objects for select using (bucket_id = 'avatars');
create policy "Users can upload own avatar" on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- =============================================
-- 6. USER SAVED CHALLENGES
-- =============================================

alter table challenges add column if not exists creator_id uuid references profiles(id) on delete cascade;

create table if not exists user_saved_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  challenge_id uuid references challenges(id) on delete cascade not null,
  saved_at timestamp with time zone default now(),
  unique(user_id, challenge_id)
);

alter table user_saved_challenges enable row level security;

create policy "Users can view own saved challenges" on user_saved_challenges for select using (auth.uid() = user_id);
create policy "Users can save challenges" on user_saved_challenges for insert with check (auth.uid() = user_id);
create policy "Users can unsave challenges" on user_saved_challenges for delete using (auth.uid() = user_id);

-- Add policies for user-created challenges
create policy "Users can create challenges" on challenges for insert with check (auth.uid() = creator_id or creator_id is null);
create policy "Users can update own challenges" on challenges for update using (auth.uid() = creator_id);
create policy "Users can delete own challenges" on challenges for delete using (auth.uid() = creator_id);

create index if not exists idx_user_saved_challenges_user_id on user_saved_challenges(user_id);
create index if not exists idx_challenges_creator_id on challenges(creator_id);
