import type {
  User,
  Photo,
  Challenge,
  PrivateEvent,
  ScavengerHunt,
  ChallengeTemplate,
  Badge,
  LeaderboardEntry,
  UserChallengeIdea,
} from '@/types';

// ============ MOCK USERS ============

export const mockCurrentUser: User = {
  id: 'user-1',
  username: 'creative_alex',
  displayName: 'Алексей',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
  avatarColor: 'bg-primary',
  xp: 2450,
  level: 5,
  streak: 7,
  photosCount: 127,
  badgesCount: 12,
  createdAt: '2024-01-15T10:00:00Z',
};

export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: 'user-2',
    username: 'photo_maria',
    displayName: 'Мария',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    avatarColor: 'bg-accent',
    xp: 3200,
    level: 7,
    streak: 14,
    photosCount: 203,
    badgesCount: 18,
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: 'user-3',
    username: 'snap_dmitry',
    displayName: 'Дмитрий',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    avatarColor: 'bg-gold',
    xp: 1850,
    level: 4,
    streak: 3,
    photosCount: 89,
    badgesCount: 8,
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 'user-4',
    username: 'lens_elena',
    displayName: 'Елена',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    avatarColor: 'bg-primary',
    xp: 4100,
    level: 9,
    streak: 21,
    photosCount: 312,
    badgesCount: 24,
    createdAt: '2023-12-01T10:00:00Z',
  },
  {
    id: 'user-5',
    username: 'frame_ivan',
    displayName: 'Иван',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    avatarColor: 'bg-accent',
    xp: 2100,
    level: 5,
    streak: 5,
    photosCount: 145,
    badgesCount: 11,
    createdAt: '2024-01-20T10:00:00Z',
  },
];

// ============ MOCK CHALLENGES ============

export const mockTodayChallenge: Challenge = {
  id: 'challenge-today',
  title: 'Золотой час',
  description: 'Сфотографируйте что-нибудь в золотистом свете заката или рассвета. Покажите магию "золотого часа"!',
  dayNumber: 127,
  xpReward: 50,
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  participantsCount: 1247,
  category: 'nature',
  difficulty: 'medium',
};

export const mockChallenges: Challenge[] = [
  mockTodayChallenge,
  {
    id: 'challenge-2',
    title: 'Минимализм',
    description: 'Найдите красоту в простоте. Один объект, чистый фон.',
    dayNumber: 126,
    xpReward: 40,
    createdAt: '2024-03-14T00:00:00Z',
    expiresAt: '2024-03-15T00:00:00Z',
    participantsCount: 2341,
    category: 'abstract',
    difficulty: 'easy',
  },
  {
    id: 'challenge-3',
    title: 'Отражения',
    description: 'Поймайте интересное отражение в воде, стекле или зеркале.',
    dayNumber: 125,
    xpReward: 60,
    createdAt: '2024-03-13T00:00:00Z',
    expiresAt: '2024-03-14T00:00:00Z',
    participantsCount: 1876,
    category: 'creative',
    difficulty: 'hard',
  },
];

// ============ MOCK PHOTOS ============

export const mockPhotos: Photo[] = [
  {
    id: 'photo-1',
    userId: 'user-2',
    imageData: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    challengeId: 'challenge-today',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: 234,
    comments: 18,
    isTop: true,
  },
  {
    id: 'photo-2',
    userId: 'user-4',
    imageData: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop',
    challengeId: 'challenge-today',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    likes: 189,
    comments: 12,
    isTop: true,
  },
  {
    id: 'photo-3',
    userId: 'user-3',
    imageData: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=400&fit=crop',
    challengeId: 'challenge-today',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes: 156,
    comments: 8,
    isTop: false,
  },
  {
    id: 'photo-4',
    userId: 'user-5',
    imageData: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=400&fit=crop',
    challengeId: 'challenge-today',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    likes: 142,
    comments: 6,
    isTop: false,
  },
  {
    id: 'photo-5',
    userId: 'user-1',
    imageData: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=400&fit=crop',
    challengeId: 'challenge-today',
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    likes: 128,
    comments: 5,
    isTop: false,
  },
  {
    id: 'photo-6',
    userId: 'user-2',
    imageData: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=400&fit=crop',
    challengeId: 'challenge-today',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    likes: 98,
    comments: 4,
    isTop: false,
  },
];

// ============ MOCK PRIVATE EVENTS ============

export const mockEvents: PrivateEvent[] = [
  {
    id: 'event-1',
    name: 'Свадьба Анны и Максима',
    description: 'Фото-челлендж для гостей свадьбы! Выполняйте задания и создавайте незабываемые воспоминания.',
    accessCode: 'WEDDING24',
    creatorId: 'user-1',
    eventType: 'wedding',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=400&fit=crop',
    startDate: '2024-06-15T14:00:00Z',
    endDate: '2024-06-16T02:00:00Z',
    createdAt: '2024-05-01T10:00:00Z',
    participantsCount: 45,
    maxParticipants: 100,
    status: 'active',
    challenges: [
      { id: 'ec-1', eventId: 'event-1', title: 'Первый танец', description: 'Сфотографируйте момент первого танца молодожёнов', order: 1, xpReward: 50 },
      { id: 'ec-2', eventId: 'event-1', title: 'Букет невесты', description: 'Лучший ракурс свадебного букета', order: 2, xpReward: 30 },
      { id: 'ec-3', eventId: 'event-1', title: 'Селфи с молодожёнами', description: 'Сделайте селфи с женихом и невестой', order: 3, xpReward: 40 },
      { id: 'ec-4', eventId: 'event-1', title: 'Торт', description: 'Запечатлейте момент разрезания торта', order: 4, xpReward: 35 },
      { id: 'ec-5', eventId: 'event-1', title: 'Танцпол', description: 'Самый зажигательный момент на танцполе', order: 5, xpReward: 45 },
    ],
  },
  {
    id: 'event-2',
    name: 'Корпоратив Tech Corp',
    description: 'Тимбилдинг через фото-квест. Командная работа и веселье!',
    accessCode: 'TECH2024',
    creatorId: 'user-1',
    eventType: 'teambuilding',
    coverImage: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?w=800&h=400&fit=crop',
    startDate: '2024-04-20T10:00:00Z',
    endDate: '2024-04-20T18:00:00Z',
    createdAt: '2024-04-01T10:00:00Z',
    participantsCount: 28,
    maxParticipants: 50,
    status: 'active',
    challenges: [
      { id: 'ec-6', eventId: 'event-2', title: 'Командное фото', description: 'Фото всей команды в креативной позе', order: 1, xpReward: 60 },
      { id: 'ec-7', eventId: 'event-2', title: 'Офисный артефакт', description: 'Найдите самый необычный предмет в офисе', order: 2, xpReward: 40 },
      { id: 'ec-8', eventId: 'event-2', title: 'Кофе-брейк', description: 'Лучший кадр с кофе или чаем', order: 3, xpReward: 30 },
    ],
  },
];

// ============ MOCK SCAVENGER HUNTS ============

export const mockHunts: ScavengerHunt[] = [
  {
    id: 'hunt-1',
    title: 'Городской исследователь',
    description: 'Откройте для себя город заново через объектив камеры. Найдите скрытые жемчужины и интересные детали.',
    coverImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop',
    theme: 'city',
    difficulty: 'medium',
    duration: 'week',
    totalXp: 500,
    participantsCount: 234,
    createdAt: '2024-03-01T00:00:00Z',
    isActive: true,
    tasks: [
      { id: 'ht-1', huntId: 'hunt-1', title: 'Уличное искусство', description: 'Найдите интересное граффити или стрит-арт', order: 1, xpReward: 50, hint: 'Загляните в переулки' },
      { id: 'ht-2', huntId: 'hunt-1', title: 'Уютное кафе', description: 'Сфотографируйте атмосферное кафе с характером', order: 2, xpReward: 40 },
      { id: 'ht-3', huntId: 'hunt-1', title: 'Архитектурная деталь', description: 'Интересный элемент здания: дверь, окно, балкон', order: 3, xpReward: 50 },
      { id: 'ht-4', huntId: 'hunt-1', title: 'Отражение города', description: 'Город в отражении: лужа, витрина, зеркало', order: 4, xpReward: 60 },
      { id: 'ht-5', huntId: 'hunt-1', title: 'Ночные огни', description: 'Городские огни после заката', order: 5, xpReward: 70, bonusXp: 20 },
      { id: 'ht-6', huntId: 'hunt-1', title: 'Местная еда', description: 'Типичное блюдо или напиток вашего города', order: 6, xpReward: 40 },
      { id: 'ht-7', huntId: 'hunt-1', title: 'Транспорт', description: 'Интересный ракурс городского транспорта', order: 7, xpReward: 50 },
      { id: 'ht-8', huntId: 'hunt-1', title: 'Зелёный оазис', description: 'Природа в городе: парк, дерево, цветы', order: 8, xpReward: 40 },
      { id: 'ht-9', huntId: 'hunt-1', title: 'Люди города', description: 'Уличный портрет или силуэт (с разрешения!)', order: 9, xpReward: 60 },
      { id: 'ht-10', huntId: 'hunt-1', title: 'Секретное место', description: 'Место, которое знают только местные', order: 10, xpReward: 80, bonusXp: 30 },
    ],
  },
  {
    id: 'hunt-2',
    title: 'Гастрономическое путешествие',
    description: 'Исследуйте мир еды через камеру. От завтрака до десерта.',
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop',
    theme: 'food',
    difficulty: 'easy',
    duration: 'day',
    totalXp: 200,
    participantsCount: 456,
    createdAt: '2024-03-10T00:00:00Z',
    isActive: true,
    tasks: [
      { id: 'ht-11', huntId: 'hunt-2', title: 'Утренний ритуал', description: 'Ваш завтрак или утренний кофе', order: 1, xpReward: 30 },
      { id: 'ht-12', huntId: 'hunt-2', title: 'Яркие цвета', description: 'Блюдо с яркими красками', order: 2, xpReward: 40 },
      { id: 'ht-13', huntId: 'hunt-2', title: 'Процесс готовки', description: 'Еда в процессе приготовления', order: 3, xpReward: 50 },
      { id: 'ht-14', huntId: 'hunt-2', title: 'Сладкий момент', description: 'Десерт или сладость', order: 4, xpReward: 40 },
      { id: 'ht-15', huntId: 'hunt-2', title: 'Стрит-фуд', description: 'Уличная еда или фастфуд', order: 5, xpReward: 40 },
    ],
  },
  {
    id: 'hunt-3',
    title: 'Природа вокруг нас',
    description: 'Найдите красоту природы даже в городских джунглях.',
    coverImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop',
    theme: 'nature',
    difficulty: 'hard',
    duration: 'month',
    totalXp: 1000,
    participantsCount: 123,
    createdAt: '2024-02-15T00:00:00Z',
    isActive: true,
    tasks: [
      { id: 'ht-16', huntId: 'hunt-3', title: 'Рассвет', description: 'Встретьте рассвет с камерой', order: 1, xpReward: 100, bonusXp: 50 },
      { id: 'ht-17', huntId: 'hunt-3', title: 'Макро мир', description: 'Крупный план насекомого или цветка', order: 2, xpReward: 80 },
      { id: 'ht-18', huntId: 'hunt-3', title: 'Вода', description: 'Река, озеро, фонтан или дождь', order: 3, xpReward: 70 },
      { id: 'ht-19', huntId: 'hunt-3', title: 'Текстуры природы', description: 'Кора дерева, камень, листья', order: 4, xpReward: 60 },
      { id: 'ht-20', huntId: 'hunt-3', title: 'Животное', description: 'Птица, кот, собака или дикое животное', order: 5, xpReward: 90 },
      { id: 'ht-21', huntId: 'hunt-3', title: 'Погодное явление', description: 'Туман, гроза, снег или радуга', order: 6, xpReward: 120, bonusXp: 80 },
      { id: 'ht-22', huntId: 'hunt-3', title: 'Звёздное небо', description: 'Ночное небо со звёздами', order: 7, xpReward: 150, bonusXp: 100 },
      { id: 'ht-23', huntId: 'hunt-3', title: 'Сезонные изменения', description: 'Признаки текущего времени года', order: 8, xpReward: 70 },
      { id: 'ht-24', huntId: 'hunt-3', title: 'Панорама', description: 'Широкий вид на природный ландшафт', order: 9, xpReward: 100 },
      { id: 'ht-25', huntId: 'hunt-3', title: 'Закат', description: 'Красивый закат в любом месте', order: 10, xpReward: 100 },
    ],
  },
];

// ============ MOCK CHALLENGE TEMPLATES ============

export const mockTemplates: ChallengeTemplate[] = [
  {
    id: 'tmpl-1',
    pattern: 'Найдите [object] и сфотографируйте в [style]',
    category: 'creative',
    difficulty: 'easy',
    variables: [
      { name: 'object', type: 'object', options: ['красный предмет', 'круглый объект', 'что-то блестящее', 'старинную вещь', 'симметричный объект'] },
      { name: 'style', type: 'style', options: ['минималистичном стиле', 'макро', 'с необычного ракурса', 'на закате', 'с размытым фоном'] },
    ],
  },
  {
    id: 'tmpl-2',
    pattern: 'Создайте фото с настроением "[emotion]" используя [color] цвет',
    category: 'emotions',
    difficulty: 'medium',
    variables: [
      { name: 'emotion', type: 'emotion', options: ['спокойствие', 'радость', 'меланхолия', 'энергия', 'загадочность'] },
      { name: 'color', type: 'color', options: ['синий', 'жёлтый', 'красный', 'зелёный', 'чёрно-белый'] },
    ],
  },
  {
    id: 'tmpl-3',
    pattern: 'Сфотографируйте [location] в [time]',
    category: 'urban',
    difficulty: 'hard',
    variables: [
      { name: 'location', type: 'location', options: ['улицу', 'парк', 'здание', 'мост', 'площадь'] },
      { name: 'time', type: 'time', options: ['золотой час', 'синий час', 'полдень', 'ночью', 'во время дождя'] },
    ],
  },
  {
    id: 'tmpl-4',
    pattern: 'Покажите [object] с точки зрения [angle]',
    category: 'creative',
    difficulty: 'medium',
    variables: [
      { name: 'object', type: 'object', options: ['вашу еду', 'рабочее место', 'любимую вещь', 'обувь', 'книгу'] },
      { name: 'angle', type: 'angle', options: ['сверху (flat lay)', 'снизу', 'на уровне глаз', 'сбоку', 'через стекло'] },
    ],
  },
  {
    id: 'tmpl-5',
    pattern: 'Найдите в городе [object] цвета [color]',
    category: 'urban',
    difficulty: 'easy',
    variables: [
      { name: 'object', type: 'object', options: ['дверь', 'машину', 'цветок', 'вывеску', 'скамейку'] },
      { name: 'color', type: 'color', options: ['красного', 'синего', 'жёлтого', 'зелёного', 'розового'] },
    ],
  },
];

// ============ MOCK BADGES ============

export const mockBadges: Badge[] = [
  { id: 'badge-1', name: 'Первый шаг', description: 'Выполните первый челлендж', icon: '🎯', color: 'bg-primary', requirement: '1 челлендж', isEarned: true, earnedAt: '2024-01-16T10:00:00Z' },
  { id: 'badge-2', name: 'Неделя креатива', description: '7 дней подряд', icon: '🔥', color: 'bg-gold', requirement: '7 дней', isEarned: true, earnedAt: '2024-01-23T10:00:00Z' },
  { id: 'badge-3', name: 'Золотой час', description: '10 фото на закате', icon: '🌅', color: 'bg-gold', requirement: '10 закатов', isEarned: true, earnedAt: '2024-02-15T10:00:00Z' },
  { id: 'badge-4', name: 'Исследователь', description: 'Завершите фото-охоту', icon: '🗺️', color: 'bg-accent', requirement: '1 охота', isEarned: true, earnedAt: '2024-02-20T10:00:00Z' },
  { id: 'badge-5', name: 'Социальная бабочка', description: 'Участие в 5 событиях', icon: '🦋', color: 'bg-primary', requirement: '5 событий', progress: 3, maxProgress: 5, isEarned: false },
  { id: 'badge-6', name: 'Месяц без пропусков', description: '30 дней подряд', icon: '💎', color: 'bg-gold', requirement: '30 дней', progress: 7, maxProgress: 30, isEarned: false },
  { id: 'badge-7', name: 'Топ-фотограф', description: '5 фото в топе дня', icon: '⭐', color: 'bg-gold', requirement: '5 топов', progress: 2, maxProgress: 5, isEarned: false },
  { id: 'badge-8', name: 'Генератор идей', description: 'Предложите 10 челленджей', icon: '💡', color: 'bg-accent', requirement: '10 идей', progress: 4, maxProgress: 10, isEarned: false },
];

// ============ MOCK LEADERBOARD ============

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, user: mockUsers[3], xp: 4100, photosCount: 312, streak: 21 },
  { rank: 2, user: mockUsers[1], xp: 3200, photosCount: 203, streak: 14 },
  { rank: 3, user: mockUsers[0], xp: 2450, photosCount: 127, streak: 7 },
  { rank: 4, user: mockUsers[4], xp: 2100, photosCount: 145, streak: 5 },
  { rank: 5, user: mockUsers[2], xp: 1850, photosCount: 89, streak: 3 },
];

// ============ MOCK USER IDEAS ============

export const mockUserIdeas: UserChallengeIdea[] = [
  {
    id: 'idea-1',
    oderId: 'user-2',
    title: 'Фото с незнакомцем',
    description: 'Попросите незнакомого человека сфотографироваться с вами (с разрешения!)',
    category: 'portrait',
    status: 'approved',
    votes: 47,
    submittedAt: '2024-03-10T14:30:00Z',
  },
  {
    id: 'idea-2',
    oderId: 'user-4',
    title: 'Тени и силуэты',
    description: 'Создайте интересную композицию используя только тени',
    category: 'abstract',
    status: 'approved',
    votes: 38,
    submittedAt: '2024-03-12T09:15:00Z',
  },
  {
    id: 'idea-3',
    oderId: 'user-3',
    title: 'Ретро-настроение',
    description: 'Найдите что-то винтажное или создайте фото в ретро-стиле',
    category: 'creative',
    status: 'pending',
    votes: 23,
    submittedAt: '2024-03-14T16:45:00Z',
  },
];

// ============ HELPER FUNCTIONS ============

export function getUserById(userId: string): User | undefined {
  return mockUsers.find(u => u.id === userId);
}

export function getPhotosByChallenge(challengeId: string): Photo[] {
  return mockPhotos.filter(p => p.challengeId === challengeId);
}

export function getHuntById(huntId: string): ScavengerHunt | undefined {
  return mockHunts.find(h => h.id === huntId);
}

export function getEventById(eventId: string): PrivateEvent | undefined {
  return mockEvents.find(e => e.id === eventId);
}
