-- =============================================
-- FIX MISSING ELEMENTS (safe to run multiple times)
-- =============================================

-- Add missing columns to challenges
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE;

-- Create user_saved_challenges if not exists
CREATE TABLE IF NOT EXISTS user_saved_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  challenge_id uuid REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  saved_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Enable RLS on user_saved_challenges
ALTER TABLE user_saved_challenges ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies for user_saved_challenges (safe way)
DROP POLICY IF EXISTS "Users can view own saved challenges" ON user_saved_challenges;
DROP POLICY IF EXISTS "Users can save challenges" ON user_saved_challenges;
DROP POLICY IF EXISTS "Users can unsave challenges" ON user_saved_challenges;

CREATE POLICY "Users can view own saved challenges" ON user_saved_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save challenges" ON user_saved_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave challenges" ON user_saved_challenges FOR DELETE USING (auth.uid() = user_id);

-- Add policies for challenges (drop first to avoid conflicts)
DROP POLICY IF EXISTS "Users can create challenges" ON challenges;
DROP POLICY IF EXISTS "Users can update own challenges" ON challenges;
DROP POLICY IF EXISTS "Users can delete own challenges" ON challenges;

CREATE POLICY "Users can create challenges" ON challenges FOR INSERT WITH CHECK (auth.uid() = creator_id OR creator_id IS NULL);
CREATE POLICY "Users can update own challenges" ON challenges FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Users can delete own challenges" ON challenges FOR DELETE USING (auth.uid() = creator_id);

-- Create indexes if not exist
CREATE INDEX IF NOT EXISTS idx_user_saved_challenges_user_id ON user_saved_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_creator_id ON challenges(creator_id);

-- =============================================
-- STORAGE BUCKETS (check and create)
-- =============================================

-- Insert buckets (will fail silently if exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Drop and recreate storage policies
DROP POLICY IF EXISTS "Anyone can view photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;

CREATE POLICY "Anyone can view photos" ON storage.objects FOR SELECT USING (bucket_id = 'photos');
CREATE POLICY "Authenticated users can upload photos" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'photos' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own photos" ON storage.objects FOR UPDATE
  USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own photos" ON storage.objects FOR DELETE
  USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =============================================
-- SEED DATA (only if empty)
-- =============================================

-- Add daily challenges only if none exist
INSERT INTO challenges (title, description, category, difficulty, xp_reward, is_daily, day_number)
SELECT * FROM (VALUES
  ('Отражение', 'Найди интересное отражение в воде, стекле или зеркале', 'abstract', 'medium', 50, true, 1),
  ('Уличное искусство', 'Сфотографируй граффити или стрит-арт', 'urban', 'easy', 30, true, 2),
  ('Золотой час', 'Поймай красивый свет на закате или рассвете', 'light', 'hard', 75, true, 3),
  ('Текстуры', 'Найди интересную текстуру: дерево, камень, ткань', 'abstract', 'easy', 30, true, 4),
  ('Симметрия', 'Сфотографируй что-то симметричное', 'abstract', 'medium', 50, true, 5),
  ('Минимализм', 'Простая композиция с минимумом элементов', 'mood', 'medium', 50, true, 6),
  ('Контраст', 'Найди контраст: свет/тень, старое/новое', 'abstract', 'medium', 50, true, 7),
  ('Натюрморт', 'Создай красивую композицию из предметов', 'food', 'medium', 50, true, 8),
  ('Силуэт', 'Сфотографируй силуэт на фоне света', 'light', 'hard', 75, true, 9),
  ('Детали', 'Сними крупным планом мелкую деталь', 'abstract', 'easy', 30, true, 10)
) AS v(title, description, category, difficulty, xp_reward, is_daily, day_number)
WHERE NOT EXISTS (SELECT 1 FROM challenges WHERE is_daily = true LIMIT 1);

-- Add hunts only if none exist
INSERT INTO hunts (id, title, description, theme, difficulty, duration, total_xp)
SELECT * FROM (VALUES
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Городской исследователь', 'Открой свой город заново', 'city', 'medium', 'week', 200),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Природный фотограф', 'Исследуй красоту природы', 'nature', 'easy', 'week', 150),
  ('33333333-3333-3333-3333-333333333333'::uuid, 'Домашний уют', 'Красота в повседневных вещах', 'home', 'easy', 'day', 100)
) AS v(id, title, description, theme, difficulty, duration, total_xp)
WHERE NOT EXISTS (SELECT 1 FROM hunts LIMIT 1);

-- Add hunt tasks only if hunts were just added
INSERT INTO hunt_tasks (hunt_id, title, description, order_num, xp_reward, hint)
SELECT * FROM (VALUES
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Архитектурная деталь', 'Найди необычный архитектурный элемент', 1, 30, 'Посмотри вверх'),
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Уличный музыкант', 'Сфотографируй уличного артиста', 2, 40, 'Загляни в переходы'),
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Скрытый дворик', 'Найди красивый внутренний дворик', 3, 50, 'Зайди в арку'),
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Городская природа', 'Природа среди бетона', 4, 30, 'Ищи зелень'),
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Ночной город', 'Огни ночного города', 5, 50, 'Дождись заката'),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Капля воды', 'Сфотографируй каплю росы', 1, 30, 'Ищи утром'),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Насекомое', 'Поймай в кадр насекомое', 2, 40, 'Терпение'),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Облака', 'Интересная форма облаков', 3, 25, 'Перед закатом'),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Дерево', 'Красивое дерево', 4, 30, 'Снизу вверх'),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Цветок', 'Макро-съёмка цветка', 5, 25, 'Подойди ближе'),
  ('33333333-3333-3333-3333-333333333333'::uuid, 'Утренний кофе', 'Красивый кадр с кофе', 1, 20, 'Поймай пар'),
  ('33333333-3333-3333-3333-333333333333'::uuid, 'Любимая книга', 'Книга в уютной обстановке', 2, 20, 'Добавь плед'),
  ('33333333-3333-3333-3333-333333333333'::uuid, 'Окно', 'Вид из окна', 3, 25, 'Золотой час'),
  ('33333333-3333-3333-3333-333333333333'::uuid, 'Питомец', 'Фото любимца', 4, 35, 'На их уровне')
) AS v(hunt_id, title, description, order_num, xp_reward, hint)
WHERE NOT EXISTS (SELECT 1 FROM hunt_tasks LIMIT 1);

-- Add badges only if none exist
INSERT INTO badges (name, description, icon, color, category, requirement_type, requirement_value)
SELECT * FROM (VALUES
  ('Первый шаг', 'Загрузите первое фото', 'camera', 'primary', 'beginner', 'photos', 1),
  ('Новичок', 'Загрузите 5 фото', 'image', 'primary', 'beginner', 'photos', 5),
  ('Фотограф', 'Загрузите 10 фото', 'award', 'accent', 'progress', 'photos', 10),
  ('Опытный', 'Загрузите 50 фото', 'star', 'gold', 'progress', 'photos', 50),
  ('Мастер', 'Загрузите 100 фото', 'trophy', 'gold', 'progress', 'photos', 100),
  ('На старте', '3 дня подряд', 'flame', 'primary', 'streak', 'streak', 3),
  ('Огненный стрик', '7 дней подряд', 'zap', 'gold', 'streak', 'streak', 7),
  ('Две недели', '14 дней подряд', 'target', 'gold', 'streak', 'streak', 14),
  ('Охотник', 'Завершите первую охоту', 'map', 'accent', 'hunts', 'hunts', 1)
) AS v(name, description, icon, color, category, requirement_type, requirement_value)
WHERE NOT EXISTS (SELECT 1 FROM badges LIMIT 1);

-- Done!
SELECT 'Setup complete!' as status;
