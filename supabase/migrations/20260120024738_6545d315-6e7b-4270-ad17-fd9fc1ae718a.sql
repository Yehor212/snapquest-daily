-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create badges table
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'award',
  color TEXT NOT NULL DEFAULT 'primary',
  category TEXT NOT NULL DEFAULT 'general',
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_badges table (junction)
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create challenges table
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'nature',
  difficulty TEXT NOT NULL DEFAULT 'medium',
  xp_reward INTEGER NOT NULL DEFAULT 50,
  day_number INTEGER NOT NULL DEFAULT 1,
  participants_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '1 day')
);

-- Create photos table
CREATE TABLE public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE SET NULL,
  event_id UUID,
  hunt_task_id UUID,
  filter_applied TEXT,
  likes_count INTEGER NOT NULL DEFAULT 0,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create photo_likes table
CREATE TABLE public.photo_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id UUID NOT NULL REFERENCES public.photos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(photo_id, user_id)
);

-- Create scavenger_hunts table
CREATE TABLE public.scavenger_hunts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  theme TEXT NOT NULL DEFAULT 'city',
  difficulty TEXT NOT NULL DEFAULT 'medium',
  duration TEXT NOT NULL DEFAULT 'day',
  total_xp INTEGER NOT NULL DEFAULT 100,
  participants_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  starts_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hunt_tasks table
CREATE TABLE public.hunt_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hunt_id UUID NOT NULL REFERENCES public.scavenger_hunts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  hint TEXT,
  order_num INTEGER NOT NULL DEFAULT 1,
  xp_reward INTEGER NOT NULL DEFAULT 20,
  bonus_xp INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hunt_progress table
CREATE TABLE public.hunt_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hunt_id UUID NOT NULL REFERENCES public.scavenger_hunts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_tasks TEXT[] NOT NULL DEFAULT '{}',
  total_xp_earned INTEGER NOT NULL DEFAULT 0,
  UNIQUE(hunt_id, user_id)
);

-- Create private_events table
CREATE TABLE public.private_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  access_code TEXT NOT NULL UNIQUE,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL DEFAULT 'other',
  cover_image TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  participants_count INTEGER NOT NULL DEFAULT 0,
  max_participants INTEGER,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event_challenges table
CREATE TABLE public.event_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.private_events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_num INTEGER NOT NULL DEFAULT 1,
  xp_reward INTEGER NOT NULL DEFAULT 25,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event_participants table
CREATE TABLE public.event_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.private_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  photos_submitted INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  UNIQUE(event_id, user_id)
);

-- Create generated_challenges table (for challenge generator)
CREATE TABLE public.generated_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'nature',
  difficulty TEXT NOT NULL DEFAULT 'medium',
  xp_reward INTEGER NOT NULL DEFAULT 50,
  is_saved BOOLEAN NOT NULL DEFAULT false,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_saved_challenges table
CREATE TABLE public.user_saved_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.generated_challenges(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scavenger_hunts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hunt_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hunt_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_challenges ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Badges policies (read-only for users)
CREATE POLICY "Badges are viewable by everyone" ON public.badges FOR SELECT USING (true);

-- User badges policies
CREATE POLICY "User badges are viewable by everyone" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "Users can insert own badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Challenges policies
CREATE POLICY "Challenges are viewable by everyone" ON public.challenges FOR SELECT USING (true);

-- Photos policies
CREATE POLICY "Photos are viewable by everyone" ON public.photos FOR SELECT USING (true);
CREATE POLICY "Users can insert own photos" ON public.photos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own photos" ON public.photos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own photos" ON public.photos FOR DELETE USING (auth.uid() = user_id);

-- Photo likes policies
CREATE POLICY "Photo likes are viewable by everyone" ON public.photo_likes FOR SELECT USING (true);
CREATE POLICY "Users can like photos" ON public.photo_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike photos" ON public.photo_likes FOR DELETE USING (auth.uid() = user_id);

-- Scavenger hunts policies
CREATE POLICY "Hunts are viewable by everyone" ON public.scavenger_hunts FOR SELECT USING (true);

-- Hunt tasks policies
CREATE POLICY "Hunt tasks are viewable by everyone" ON public.hunt_tasks FOR SELECT USING (true);

-- Hunt progress policies
CREATE POLICY "Hunt progress is viewable by everyone" ON public.hunt_progress FOR SELECT USING (true);
CREATE POLICY "Users can insert own progress" ON public.hunt_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.hunt_progress FOR UPDATE USING (auth.uid() = user_id);

-- Private events policies
CREATE POLICY "Events are viewable by participants" ON public.private_events FOR SELECT USING (
  creator_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.event_participants WHERE event_id = id AND user_id = auth.uid())
);
CREATE POLICY "Users can create events" ON public.private_events FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update events" ON public.private_events FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Creators can delete events" ON public.private_events FOR DELETE USING (auth.uid() = creator_id);

-- Event challenges policies
CREATE POLICY "Event challenges are viewable by participants" ON public.event_challenges FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.private_events WHERE id = event_id AND (creator_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.event_participants WHERE event_id = private_events.id AND user_id = auth.uid())))
);
CREATE POLICY "Creators can insert event challenges" ON public.event_challenges FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.private_events WHERE id = event_id AND creator_id = auth.uid())
);

-- Event participants policies
CREATE POLICY "Event participants viewable by event members" ON public.event_participants FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.private_events WHERE id = event_id AND (creator_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.event_participants ep WHERE ep.event_id = event_participants.event_id AND ep.user_id = auth.uid())))
);
CREATE POLICY "Users can join events" ON public.event_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave events" ON public.event_participants FOR DELETE USING (auth.uid() = user_id);

-- Generated challenges policies
CREATE POLICY "Generated challenges viewable by everyone" ON public.generated_challenges FOR SELECT USING (true);
CREATE POLICY "Users can create challenges" ON public.generated_challenges FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update own challenges" ON public.generated_challenges FOR UPDATE USING (auth.uid() = user_id);

-- User saved challenges policies
CREATE POLICY "Users can view own saved challenges" ON public.user_saved_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save challenges" ON public.user_saved_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave challenges" ON public.user_saved_challenges FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert seed data for badges
INSERT INTO public.badges (name, description, icon, color, category, requirement_type, requirement_value) VALUES
('Первый шаг', 'Загрузите первое фото', 'camera', 'primary', 'photos', 'photos', 1),
('Новичок', 'Загрузите 5 фото', 'image', 'primary', 'photos', 'photos', 5),
('Фотограф', 'Загрузите 10 фото', 'award', 'accent', 'photos', 'photos', 10),
('Мастер', 'Загрузите 25 фото', 'trophy', 'gold', 'photos', 'photos', 25),
('На старте', '3 дня подряд', 'flame', 'primary', 'streak', 'streak', 3),
('В ритме', '7 дней подряд', 'flame', 'accent', 'streak', 'streak', 7),
('Огонь!', '14 дней подряд', 'flame', 'gold', 'streak', 'streak', 14),
('Охотник', 'Завершите первую охоту', 'map', 'gold', 'hunts', 'hunts', 1),
('Исследователь', 'Завершите 3 охоты', 'compass', 'accent', 'hunts', 'hunts', 3),
('Покоритель', 'Завершите 5 охот', 'globe', 'gold', 'hunts', 'hunts', 5);

-- Insert sample daily challenge
INSERT INTO public.challenges (title, description, category, difficulty, xp_reward, day_number, expires_at) VALUES
('Золотой час', 'Сфотографируй что-то красивое в золотом свете заката или рассвета', 'light', 'medium', 75, 1, now() + interval '1 day');

-- Insert sample scavenger hunts
INSERT INTO public.scavenger_hunts (title, description, theme, difficulty, duration, total_xp, is_active, cover_image) VALUES
('Городской исследователь', 'Исследуй город и найди интересные детали архитектуры', 'city', 'medium', 'day', 200, true, null),
('Природа вокруг нас', 'Найди красоту природы прямо рядом с тобой', 'nature', 'easy', 'week', 300, true, null),
('Домашний уют', 'Открой красоту в повседневных вещах дома', 'home', 'easy', 'day', 150, true, null);

-- Insert hunt tasks
INSERT INTO public.hunt_tasks (hunt_id, title, description, hint, order_num, xp_reward) 
SELECT h.id, task.title, task.description, task.hint, task.order_num, task.xp_reward
FROM public.scavenger_hunts h
CROSS JOIN (VALUES
  ('Городской исследователь', 'Интересная дверь', 'Найди необычную или красивую дверь', 'Посмотри на старые здания', 1, 40),
  ('Городской исследователь', 'Уличное искусство', 'Сфотографируй граффити или мурал', 'Ищи в переулках', 2, 50),
  ('Городской исследователь', 'Отражение', 'Поймай отражение в витрине или луже', null, 3, 40),
  ('Городской исследователь', 'Геометрия', 'Найди интересные геометрические формы', 'Смотри на здания сверху', 4, 35),
  ('Городской исследователь', 'Детали', 'Сфотографируй интересную мелкую деталь', null, 5, 35),
  ('Природа вокруг нас', 'Цветок', 'Найди и сфотографируй красивый цветок', null, 1, 30),
  ('Природа вокруг нас', 'Текстура', 'Сфотографируй интересную природную текстуру', 'Кора дерева, камень, листья', 2, 40),
  ('Природа вокруг нас', 'Небо', 'Поймай красивое небо', 'Лучше на закате', 3, 50),
  ('Природа вокруг нас', 'Вода', 'Сфотографируй воду в любом виде', null, 4, 40),
  ('Природа вокруг нас', 'Животное', 'Найди и сфотографируй животное', 'Птицы тоже считаются!', 5, 60),
  ('Природа вокруг нас', 'Зелень', 'Сфотографируй что-то зелёное', null, 6, 30),
  ('Природа вокруг нас', 'Закат', 'Сфотографируй закат', null, 7, 50),
  ('Домашний уют', 'Любимая чашка', 'Сфотографируй свою любимую кружку', null, 1, 30),
  ('Домашний уют', 'Уголок', 'Покажи свой любимый уголок дома', null, 2, 40),
  ('Домашний уют', 'Свет из окна', 'Поймай красивый свет из окна', 'Лучше утром или вечером', 3, 40),
  ('Домашний уют', 'Растение', 'Сфотографируй домашнее растение', null, 4, 40)
) AS task(hunt_title, title, description, hint, order_num, xp_reward)
WHERE h.title = task.hunt_title;