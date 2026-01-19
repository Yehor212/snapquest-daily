-- =============================================
-- FUNCTIONS & TRIGGERS
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

-- Trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- Update likes count on photo
-- =============================================
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

-- =============================================
-- Add XP to user
-- =============================================
create or replace function add_user_xp(user_uuid uuid, xp_amount integer)
returns void as $$
declare
  current_xp integer;
  current_level integer;
  new_level integer;
begin
  -- Get current XP and level
  select xp, level into current_xp, current_level
  from profiles where id = user_uuid;

  -- Calculate new level (100 XP per level)
  new_level := ((current_xp + xp_amount) / 100) + 1;

  -- Update profile
  update profiles
  set
    xp = xp + xp_amount,
    level = new_level,
    updated_at = now()
  where id = user_uuid;
end;
$$ language plpgsql security definer;

-- =============================================
-- Update user streak
-- =============================================
create or replace function update_user_streak(user_uuid uuid)
returns void as $$
declare
  prev_photo_date date;
  photos_today integer;
  current_streak integer;
  longest integer;
begin
  -- Get current streak and longest (with NULL protection)
  select coalesce(streak, 0), coalesce(longest_streak, 0)
  into current_streak, longest
  from profiles where id = user_uuid;

  -- Count photos uploaded today
  select count(*) into photos_today
  from photos
  where user_id = user_uuid and date(created_at) = current_date;

  -- If more than 1 photo today, streak already updated - skip
  if photos_today > 1 then
    return;
  end if;

  -- Get the most recent photo date BEFORE today
  select date(created_at) into prev_photo_date
  from photos
  where user_id = user_uuid and date(created_at) < current_date
  order by created_at desc
  limit 1;

  -- Determine new streak value
  if prev_photo_date is null then
    -- No previous photos before today → first day, streak = 1
    current_streak := 1;
  elsif prev_photo_date = current_date - interval '1 day' then
    -- Photo yesterday → continue streak
    current_streak := current_streak + 1;
  else
    -- Gap in uploads → reset streak to 1
    current_streak := 1;
  end if;

  -- Update longest streak if needed
  if current_streak > longest then
    longest := current_streak;
  end if;

  -- Update profile
  update profiles
  set
    streak = current_streak,
    longest_streak = longest,
    updated_at = now()
  where id = user_uuid;
end;
$$ language plpgsql security definer;

-- =============================================
-- Join event by access code
-- =============================================
create or replace function join_event_by_code(code text)
returns uuid as $$
declare
  event_uuid uuid;
begin
  -- Find event by code
  select id into event_uuid
  from events
  where access_code = upper(code) and status = 'active';

  if event_uuid is null then
    raise exception 'Event not found or inactive';
  end if;

  -- Add participant
  insert into event_participants (event_id, user_id)
  values (event_uuid, auth.uid())
  on conflict (event_id, user_id) do nothing;

  return event_uuid;
end;
$$ language plpgsql security definer;

-- =============================================
-- Complete hunt task
-- =============================================
create or replace function complete_hunt_task(
  p_hunt_id uuid,
  p_task_id uuid,
  p_photo_id uuid
)
returns void as $$
declare
  task_xp integer;
  progress_record hunt_progress%rowtype;
begin
  -- Get task XP
  select xp_reward into task_xp
  from hunt_tasks where id = p_task_id and hunt_id = p_hunt_id;

  if task_xp is null then
    raise exception 'Task not found';
  end if;

  -- Get or create progress record
  select * into progress_record
  from hunt_progress
  where hunt_id = p_hunt_id and user_id = auth.uid();

  if progress_record.id is null then
    insert into hunt_progress (hunt_id, user_id, completed_tasks, total_xp_earned)
    values (p_hunt_id, auth.uid(), array[p_task_id], task_xp);
  else
    -- Check if task already completed
    if p_task_id = any(progress_record.completed_tasks) then
      raise exception 'Task already completed';
    end if;

    -- Update progress
    update hunt_progress
    set
      completed_tasks = array_append(completed_tasks, p_task_id),
      total_xp_earned = total_xp_earned + task_xp
    where id = progress_record.id;
  end if;

  -- Update photo with hunt info
  update photos
  set hunt_id = p_hunt_id, hunt_task_id = p_task_id
  where id = p_photo_id and user_id = auth.uid();

  -- Add XP to user
  perform add_user_xp(auth.uid(), task_xp);

  -- Update user streak
  perform update_user_streak(auth.uid());
end;
$$ language plpgsql security definer;
