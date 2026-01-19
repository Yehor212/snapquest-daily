// ============ CORE TYPES ============

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  avatarColor: string;
  xp: number;
  level: number;
  streak: number;
  photosCount: number;
  badgesCount: number;
  createdAt: string;
}

export interface Photo {
  id: string;
  userId: string;
  imageData: string; // base64 или URL
  thumbnailData?: string;
  challengeId?: string;
  eventId?: string;
  huntTaskId?: string;
  createdAt: string;
  likes: number;
  comments: number;
  isTop: boolean;
  filter?: PhotoFilterType;
  metadata?: PhotoMetadata;
}

export interface PhotoMetadata {
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
    placeName?: string;
  };
  deviceInfo?: string;
}

export type PhotoFilterType =
  | 'none'
  | 'grayscale'
  | 'sepia'
  | 'vintage'
  | 'warm'
  | 'cool'
  | 'dramatic'
  | 'fade';

export interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ============ CHALLENGE TYPES ============

export interface Challenge {
  id: string;
  title: string;
  description: string;
  dayNumber: number;
  xpReward: number;
  createdAt: string;
  expiresAt: string;
  participantsCount: number;
  category: ChallengeCategory;
  difficulty: Difficulty;
}

export type ChallengeCategory =
  | 'nature'
  | 'urban'
  | 'portrait'
  | 'abstract'
  | 'food'
  | 'animals'
  | 'architecture'
  | 'seasonal'
  | 'creative'
  | 'colors'
  | 'emotions';

export type Difficulty = 'easy' | 'medium' | 'hard';

// ============ PRIVATE EVENT TYPES ============

export interface PrivateEvent {
  id: string;
  name: string;
  description: string;
  accessCode: string;
  creatorId: string;
  eventType: EventType;
  coverImage?: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  participantsCount: number;
  maxParticipants?: number;
  challenges: EventChallenge[];
  status: 'draft' | 'active' | 'completed';
}

export type EventType =
  | 'wedding'
  | 'party'
  | 'teambuilding'
  | 'birthday'
  | 'corporate'
  | 'travel'
  | 'other';

export interface EventChallenge {
  id: string;
  eventId: string;
  title: string;
  description: string;
  order: number;
  xpReward: number;
  isCompleted?: boolean;
  completedBy?: string[];
}

export interface EventParticipant {
  id: string;
  eventId: string;
  userId: string;
  user: User;
  joinedAt: string;
  photosSubmitted: number;
  xpEarned: number;
}

export interface EventPhoto extends Photo {
  eventId: string;
  eventChallengeId?: string;
}

// ============ SCAVENGER HUNT TYPES ============

export interface ScavengerHunt {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  theme: HuntTheme;
  difficulty: Difficulty;
  duration: HuntDuration;
  tasks: HuntTask[];
  totalXp: number;
  participantsCount: number;
  createdAt: string;
  startsAt?: string;
  endsAt?: string;
  isActive: boolean;
}

export type HuntTheme =
  | 'city'
  | 'nature'
  | 'food'
  | 'travel'
  | 'home'
  | 'work'
  | 'seasonal'
  | 'holiday'
  | 'art';

export type HuntDuration = 'day' | 'week' | 'month';

export interface HuntTask {
  id: string;
  huntId: string;
  title: string;
  description: string;
  order: number;
  xpReward: number;
  bonusXp?: number;
  hint?: string;
  isCompleted?: boolean;
}

export interface HuntProgress {
  id: string;
  huntId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  tasksCompleted: string[];
  totalXpEarned: number;
}

// ============ CHALLENGE GENERATOR TYPES ============

export interface ChallengeTemplate {
  id: string;
  pattern: string;
  category: ChallengeCategory;
  difficulty: Difficulty;
  variables: TemplateVariable[];
}

export interface TemplateVariable {
  name: string;
  type: 'object' | 'color' | 'style' | 'angle' | 'emotion' | 'location' | 'time';
  options: string[];
}

export interface GeneratedChallenge {
  id: string;
  templateId: string;
  title: string;
  description: string;
  variables: Record<string, string>;
  category: ChallengeCategory;
  difficulty: Difficulty;
  xpReward: number;
  generatedAt: string;
  isSaved?: boolean;
}

export interface UserChallengeIdea {
  id: string;
  oderId: string;
  title: string;
  description: string;
  category?: ChallengeCategory;
  status: 'pending' | 'approved' | 'rejected';
  votes: number;
  submittedAt: string;
}

// ============ GALLERY TYPES ============

export interface PhotoGalleryFilter {
  challengeId?: string;
  eventId?: string;
  huntId?: string;
  dateFrom?: string;
  dateTo?: string;
  isTop?: boolean;
  sortBy: 'date' | 'likes';
  sortOrder: 'asc' | 'desc';
}

export interface PhotoEditOptions {
  filter: PhotoFilterType;
  crop?: CropData;
  brightness: number;
  contrast: number;
  saturation: number;
}

// ============ BADGE & ACHIEVEMENT TYPES ============

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: string;
  progress?: number;
  maxProgress?: number;
  isEarned: boolean;
  earnedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  value: number | string;
  icon: string;
}

// ============ LEADERBOARD TYPES ============

export interface LeaderboardEntry {
  rank: number;
  user: User;
  xp: number;
  photosCount: number;
  streak: number;
}

// ============ UI TEXT CONSTANTS ============

export const UI_TEXT = {
  events: {
    title: 'Мои события',
    create: 'Создать событие',
    join: 'Присоединиться',
    enterCode: 'Введите код приглашения',
    codeHint: 'Код из 8 символов',
    eventTypes: {
      wedding: 'Свадьба',
      party: 'Вечеринка',
      teambuilding: 'Тимбилдинг',
      birthday: 'День рождения',
      corporate: 'Корпоратив',
      travel: 'Путешествие',
      other: 'Другое',
    } as Record<EventType, string>,
    participants: 'участников',
    challenges: 'заданий',
  },
  hunts: {
    title: 'Фото-охота',
    available: 'Доступные охоты',
    active: 'Активные',
    completed: 'Завершённые',
    tasks: 'заданий',
    progress: 'Прогресс',
    timeLeft: 'Осталось времени',
    themes: {
      city: 'Город',
      nature: 'Природа',
      food: 'Еда',
      travel: 'Путешествие',
      home: 'Дом',
      work: 'Работа',
      seasonal: 'Сезонный',
      holiday: 'Праздник',
      art: 'Искусство',
    } as Record<HuntTheme, string>,
    difficulty: {
      easy: 'Лёгкий',
      medium: 'Средний',
      hard: 'Сложный',
    } as Record<Difficulty, string>,
    duration: {
      day: 'День',
      week: 'Неделя',
      month: 'Месяц',
    } as Record<HuntDuration, string>,
  },
  generator: {
    title: 'Генератор челленджей',
    generate: 'Сгенерировать',
    shuffle: 'Перемешать',
    useChallenge: 'Использовать',
    saveChallenge: 'Сохранить',
    themes: 'Темы',
    userIdeas: 'Идеи сообщества',
    submitIdea: 'Предложить идею',
  },
  gallery: {
    title: 'Моя галерея',
    all: 'Все фото',
    favorites: 'Избранное',
    challenges: 'По челленджам',
    sortBy: 'Сортировка',
    filters: 'Фильтры',
  },
  upload: {
    takePhoto: 'Сделать фото',
    chooseFromGallery: 'Выбрать из галереи',
    preview: 'Предпросмотр',
    edit: 'Редактировать',
    filters: 'Фильтры',
    crop: 'Обрезать',
    submit: 'Отправить',
    uploading: 'Загрузка...',
  },
  categories: {
    nature: 'Природа',
    urban: 'Город',
    portrait: 'Портрет',
    abstract: 'Абстракция',
    food: 'Еда',
    animals: 'Животные',
    architecture: 'Архитектура',
    seasonal: 'Сезонный',
    creative: 'Креатив',
    colors: 'Цвета',
    emotions: 'Эмоции',
  } as Record<ChallengeCategory, string>,
  common: {
    loading: 'Загрузка...',
    error: 'Ошибка',
    retry: 'Повторить',
    cancel: 'Отмена',
    save: 'Сохранить',
    delete: 'Удалить',
    share: 'Поделиться',
    back: 'Назад',
    next: 'Далее',
    done: 'Готово',
    empty: 'Пока ничего нет',
    xp: 'XP',
  },
} as const;
