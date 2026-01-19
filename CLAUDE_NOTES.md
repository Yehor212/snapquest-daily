# SnapQuest Daily — Заметки разработки

> Этот файл создан Claude для отслеживания прогресса и планов.
> Последнее обновление: 2026-01-18

---

## ✅ ЧТО УЖЕ СДЕЛАНО

### Фаза 1: Фундамент
- [x] TypeScript типы (`src/types/index.ts`)
- [x] Mock данные (`src/data/mockData.ts`)
- [x] UserContext (`src/contexts/UserContext.tsx`)
- [x] Утилиты хранения localStorage + IndexedDB (`src/lib/storage.ts`)
- [x] Общие компоненты (`src/components/common/`)
  - XpBadge, DifficultyBadge, CountdownTimer, ProgressRing
  - EmptyState, LoadingSpinner, AccessCodeInput

### Фаза 2: Загрузка и галерея фото
- [x] Компоненты загрузки (`src/components/upload/`)
  - PhotoUploadButton — выбор камера/галерея
  - PhotoPreview — предпросмотр
  - PhotoEditor — редактор с фильтрами
  - FilterSelector — выбор фильтров
- [x] Компоненты галереи (`src/components/gallery/`)
  - PhotoGallery — сетка фото
  - PhotoDetailModal — полноэкранный просмотр
  - GalleryFilters — фильтры и сортировка
- [x] Страницы (`src/pages/upload/`, `src/pages/gallery/`)
- [x] Утилиты изображений Canvas API (`src/lib/imageUtils.ts`)

### Фаза 3: Генератор челленджей
- [x] Логика генерации (`src/lib/challengeGenerator.ts`)
- [x] Компоненты (`src/components/generator/`)
  - GeneratedChallengeCard, RandomizeButton, GeneratorControls
- [x] Страница генератора (`src/pages/generator/GeneratorPage.tsx`)

### Фаза 4: Фото-охота (Scavenger Hunt)
- [x] Компоненты (`src/components/hunt/`)
  - HuntCard, HuntTaskCard, HuntProgress
- [x] Страницы (`src/pages/hunts/`)
  - HuntsPage — список охот
  - HuntDetailPage — детали с заданиями

### Фаза 5: Приватные события
- [x] Компоненты (`src/components/events/`)
  - EventCard, JoinEventDialog, EventChallengeList, EventShareDialog
- [x] Страницы (`src/pages/events/`)
  - EventsPage — список событий
  - EventDetailPage — детали события
  - CreateEventPage — wizard создания

### Фаза 6: Интеграция
- [x] Обновлён `App.tsx` с роутами и lazy loading
- [x] Обновлён `Header.tsx` с навигацией
- [x] Обновлён `GameModes.tsx` со ссылками

---

## 🔜 ЧТО НУЖНО СДЕЛАТЬ

### 1. GitHub Pages (деплой фронтенда)

```bash
# 1. Установить gh-pages
npm install --save-dev gh-pages

# 2. Добавить в package.json:
"homepage": "https://yehor212.github.io/snapquest-daily",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# 3. Обновить vite.config.ts:
export default defineConfig({
  base: '/snapquest-daily/',
  // ... остальное
})

# 4. Деплой:
npm run deploy
```

### 2. Supabase (бесплатный backend)

**Что даёт Supabase бесплатно:**
- PostgreSQL база данных
- Аутентификация (email, Google, GitHub)
- Storage для фото (1GB бесплатно)
- Real-time подписки
- Edge Functions

**Шаги:**
1. Зарегистрироваться на https://supabase.com
2. Создать проект
3. Установить клиент: `npm install @supabase/supabase-js`
4. Создать таблицы (см. схему ниже)
5. Настроить Storage bucket для фото
6. Добавить аутентификацию

**Схема базы данных:**
```sql
-- Пользователи (расширение auth.users)
create table profiles (
  id uuid references auth.users primary key,
  username text unique,
  display_name text,
  avatar_url text,
  xp integer default 0,
  level integer default 1,
  streak integer default 0,
  created_at timestamp with time zone default now()
);

-- Челленджи
create table challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  day_number integer,
  xp_reward integer default 50,
  category text,
  difficulty text,
  created_at timestamp with time zone default now(),
  expires_at timestamp with time zone
);

-- Фотографии
create table photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  image_url text not null,
  challenge_id uuid references challenges(id),
  event_id uuid references events(id),
  hunt_task_id uuid,
  likes integer default 0,
  created_at timestamp with time zone default now()
);

-- События
create table events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  access_code text unique not null,
  creator_id uuid references profiles(id),
  event_type text,
  cover_image text,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  status text default 'active',
  created_at timestamp with time zone default now()
);

-- Задания событий
create table event_challenges (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  title text not null,
  description text,
  order_num integer,
  xp_reward integer default 30
);

-- Фото-охоты
create table hunts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cover_image text,
  theme text,
  difficulty text,
  duration text,
  total_xp integer,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Задания охоты
create table hunt_tasks (
  id uuid primary key default gen_random_uuid(),
  hunt_id uuid references hunts(id) on delete cascade,
  title text not null,
  description text,
  order_num integer,
  xp_reward integer,
  hint text
);

-- Прогресс охоты
create table hunt_progress (
  id uuid primary key default gen_random_uuid(),
  hunt_id uuid references hunts(id),
  user_id uuid references profiles(id),
  tasks_completed uuid[] default '{}',
  total_xp_earned integer default 0,
  started_at timestamp with time zone default now(),
  completed_at timestamp with time zone,
  unique(hunt_id, user_id)
);
```

### 3. Firebase (альтернатива Supabase)

**Что даёт Firebase бесплатно (Spark plan):**
- Firestore: 1GB storage, 50K reads/day
- Authentication: unlimited
- Storage: 5GB
- Hosting: 10GB/month

**Если выбрать Firebase:**
```bash
npm install firebase
```

### 4. Файлы для создания

```
src/
├── lib/
│   ├── supabase.ts      # Клиент Supabase
│   └── api/
│       ├── auth.ts      # Аутентификация
│       ├── photos.ts    # CRUD фото
│       ├── events.ts    # CRUD событий
│       ├── hunts.ts     # CRUD охот
│       └── challenges.ts
├── hooks/
│   ├── useAuth.ts       # Хук авторизации
│   ├── usePhotos.ts     # Хук фото
│   └── useEvents.ts     # Хук событий
```

---

## 📁 СТРУКТУРА ПРОЕКТА

```
snapquest-daily/
├── src/
│   ├── components/
│   │   ├── common/          # ✅ Общие компоненты
│   │   ├── upload/          # ✅ Загрузка фото
│   │   ├── gallery/         # ✅ Галерея
│   │   ├── generator/       # ✅ Генератор
│   │   ├── hunt/            # ✅ Фото-охота
│   │   ├── events/          # ✅ События
│   │   ├── profile/         # Существовало
│   │   └── ui/              # shadcn/ui
│   ├── pages/
│   │   ├── upload/          # ✅ /upload
│   │   ├── gallery/         # ✅ /gallery
│   │   ├── generator/       # ✅ /generator
│   │   ├── hunts/           # ✅ /hunts, /hunts/:id
│   │   ├── events/          # ✅ /events, /events/:id, /events/create
│   │   ├── Index.tsx        # Существовало
│   │   └── Profile.tsx      # Существовало
│   ├── contexts/
│   │   └── UserContext.tsx  # ✅
│   ├── types/
│   │   └── index.ts         # ✅ Все TypeScript типы
│   ├── data/
│   │   └── mockData.ts      # ✅ Mock данные
│   ├── lib/
│   │   ├── utils.ts         # Существовало
│   │   ├── storage.ts       # ✅ localStorage + IndexedDB
│   │   ├── imageUtils.ts    # ✅ Canvas фильтры
│   │   └── challengeGenerator.ts # ✅
│   ├── hooks/
│   │   ├── use-mobile.tsx   # Существовало
│   │   └── use-toast.ts     # Существовало
│   └── App.tsx              # ✅ Обновлён с роутами
├── CLAUDE_NOTES.md          # ✅ Этот файл
└── package.json
```

---

## 🚀 КОМАНДЫ

```bash
# Запуск dev сервера
npm run dev

# Сборка
npm run build

# Деплой на GitHub Pages (после настройки)
npm run deploy

# Линтинг
npm run lint
```

---

## 🔗 ССЫЛКИ

- **GitHub:** https://github.com/Yehor212/snapquest-daily
- **Supabase:** https://supabase.com
- **Firebase:** https://firebase.google.com
- **shadcn/ui:** https://ui.shadcn.com

---

## 📝 ЗАМЕТКИ

### Текущее хранение данных (без backend):
- Фото хранятся в IndexedDB (base64)
- Прогресс/события в localStorage
- Работает полностью офлайн

### При переходе на Supabase:
1. Заменить `src/lib/storage.ts` на API вызовы
2. Добавить аутентификацию
3. Загружать фото в Supabase Storage
4. Использовать real-time для событий

### Приоритет следующих шагов:
1. **GitHub Pages** — чтобы показать проект
2. **Supabase Auth** — регистрация/вход
3. **Supabase Storage** — хранение фото
4. **Supabase DB** — полноценный backend
