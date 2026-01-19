-- =============================================
-- ROW LEVEL SECURITY (RLS)
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

-- =============================================
-- PROFILES
-- =============================================
create policy "Profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- =============================================
-- CHALLENGES
-- =============================================
create policy "Anyone can view challenges"
  on challenges for select
  using (true);

create policy "Users can create challenges"
  on challenges for insert
  with check (auth.uid() = creator_id or creator_id is null);

create policy "Users can update own challenges"
  on challenges for update
  using (auth.uid() = creator_id);

create policy "Users can delete own challenges"
  on challenges for delete
  using (auth.uid() = creator_id);

-- =============================================
-- PHOTOS
-- =============================================
create policy "Photos are viewable by everyone"
  on photos for select
  using (true);

create policy "Users can insert own photos"
  on photos for insert
  with check (auth.uid() = user_id);

create policy "Users can update own photos"
  on photos for update
  using (auth.uid() = user_id);

create policy "Users can delete own photos"
  on photos for delete
  using (auth.uid() = user_id);

-- =============================================
-- EVENTS
-- =============================================
create policy "Events viewable by creator and participants"
  on events for select
  using (
    creator_id = auth.uid() or
    id in (select event_id from event_participants where user_id = auth.uid())
  );

create policy "Users can create events"
  on events for insert
  with check (auth.uid() = creator_id);

create policy "Creators can update events"
  on events for update
  using (auth.uid() = creator_id);

create policy "Creators can delete events"
  on events for delete
  using (auth.uid() = creator_id);

-- =============================================
-- EVENT CHALLENGES
-- =============================================
create policy "Event challenges viewable by participants"
  on event_challenges for select
  using (
    event_id in (select id from events where creator_id = auth.uid()) or
    event_id in (select event_id from event_participants where user_id = auth.uid())
  );

create policy "Creators can insert event challenges"
  on event_challenges for insert
  with check (
    event_id in (select id from events where creator_id = auth.uid())
  );

create policy "Creators can update event challenges"
  on event_challenges for update
  using (
    event_id in (select id from events where creator_id = auth.uid())
  );

create policy "Creators can delete event challenges"
  on event_challenges for delete
  using (
    event_id in (select id from events where creator_id = auth.uid())
  );

-- =============================================
-- EVENT PARTICIPANTS
-- =============================================
create policy "Participants viewable by all"
  on event_participants for select
  using (true);

create policy "Users can join events"
  on event_participants for insert
  with check (auth.uid() = user_id);

create policy "Users can leave events"
  on event_participants for delete
  using (auth.uid() = user_id);

-- =============================================
-- HUNTS (public read)
-- =============================================
create policy "Hunts are viewable by everyone"
  on hunts for select
  using (true);

-- =============================================
-- HUNT TASKS (public read)
-- =============================================
create policy "Hunt tasks viewable by everyone"
  on hunt_tasks for select
  using (true);

-- =============================================
-- HUNT PROGRESS
-- =============================================
create policy "Users can view own hunt progress"
  on hunt_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own hunt progress"
  on hunt_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own hunt progress"
  on hunt_progress for update
  using (auth.uid() = user_id);

-- =============================================
-- PHOTO LIKES
-- =============================================
create policy "Likes viewable by everyone"
  on photo_likes for select
  using (true);

create policy "Users can like photos"
  on photo_likes for insert
  with check (auth.uid() = user_id);

create policy "Users can unlike photos"
  on photo_likes for delete
  using (auth.uid() = user_id);

-- =============================================
-- BADGES (public read)
-- =============================================
create policy "Badges viewable by everyone"
  on badges for select
  using (true);

-- =============================================
-- USER BADGES
-- =============================================
create policy "User badges viewable by everyone"
  on user_badges for select
  using (true);

create policy "System can grant badges"
  on user_badges for insert
  with check (auth.uid() = user_id);
