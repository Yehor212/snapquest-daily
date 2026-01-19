# Supabase SQL Schema

Выполняй файлы в Supabase SQL Editor в таком порядке:

## Порядок выполнения

1. **01_tables.sql** - Создание таблиц
2. **02_rls.sql** - Row Level Security политики
3. **03_functions.sql** - Функции и триггеры
4. **04_seed.sql** - Начальные данные (челленджи, охоты, бейджи)
5. **05_storage.sql** - Storage buckets для фото

## После выполнения SQL

1. Перейди в **Authentication > Providers**
2. Включи **Google** provider
3. Вставь Client ID и Client Secret из Google Cloud Console

## Проверка

После выполнения всех файлов проверь:
- В **Table Editor** должны появиться таблицы
- В **Storage** должны быть buckets `photos` и `avatars`
- В таблице `challenges` должны быть 10 челленджей
- В таблице `hunts` должны быть 3 охоты
- В таблице `badges` должны быть бейджи

## Структура таблиц

```
profiles        - Профили пользователей
challenges      - Ежедневные челленджи
photos          - Загруженные фото
events          - Приватные события
event_challenges - Задания событий
event_participants - Участники событий
hunts           - Фото-охоты
hunt_tasks      - Задания охот
hunt_progress   - Прогресс пользователей
photo_likes     - Лайки фото
badges          - Доступные бейджи
user_badges     - Полученные бейджи
```
