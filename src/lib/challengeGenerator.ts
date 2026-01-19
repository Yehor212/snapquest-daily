import type { ChallengeTemplate, GeneratedChallenge, Difficulty } from '@/types';

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Генерирует случайное значение из массива
 */
function randomFrom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Base challenge templates
 */
export const challengeTemplates: ChallengeTemplate[] = [
  {
    id: 'tmpl-1',
    pattern: 'Найдите [object] и сфотографируйте в [style]',
    category: 'abstract',
    difficulty: 'easy',
    variables: [
      { name: 'object', type: 'object', options: ['красный предмет', 'круглый объект', 'что-то блестящее', 'старинную вещь', 'симметричный объект'] },
      { name: 'style', type: 'style', options: ['минималистичном стиле', 'макро', 'с необычного ракурса', 'на закате', 'с размытым фоном'] },
    ],
  },
  {
    id: 'tmpl-2',
    pattern: 'Создайте фото с настроением "[emotion]" используя [color] цвет',
    category: 'mood',
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
    category: 'light',
    difficulty: 'medium',
    variables: [
      { name: 'object', type: 'object', options: ['вашу еду', 'рабочее место', 'любимую вещь', 'обувь', 'книгу'] },
      { name: 'angle', type: 'angle', options: ['сверху (flat lay)', 'снизу', 'на уровне глаз', 'сбоку', 'через стекло'] },
    ],
  },
  {
    id: 'tmpl-5',
    pattern: 'Найдите в городе [object] цвета [color]',
    category: 'color',
    difficulty: 'easy',
    variables: [
      { name: 'object', type: 'object', options: ['дверь', 'машину', 'цветок', 'вывеску', 'скамейку'] },
      { name: 'color', type: 'color', options: ['красного', 'синего', 'жёлтого', 'зелёного', 'розового'] },
    ],
  },
];

/**
 * Рассчитывает награду XP на основе сложности
 */
function calculateXpReward(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy':
      return 30 + Math.floor(Math.random() * 20);
    case 'medium':
      return 50 + Math.floor(Math.random() * 30);
    case 'hard':
      return 80 + Math.floor(Math.random() * 40);
    default:
      return 40;
  }
}

/**
 * Генерирует челлендж из шаблона
 */
export function generateChallenge(
  template: ChallengeTemplate,
  customVariables?: Record<string, string>
): GeneratedChallenge {
  let title = template.pattern;
  const variables: Record<string, string> = {};

  // Заменяем переменные в шаблоне
  template.variables.forEach(variable => {
    const value = customVariables?.[variable.name] ?? randomFrom(variable.options);
    variables[variable.name] = value;
    title = title.replace(`[${variable.name}]`, value);
  });

  return {
    id: generateId(),
    templateId: template.id,
    title,
    description: title,
    variables,
    category: template.category,
    difficulty: template.difficulty,
    xpReward: calculateXpReward(template.difficulty),
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Генерирует несколько челленджей из разных шаблонов
 */
export function generateMultipleChallenges(
  templates: ChallengeTemplate[],
  count: number = 3
): GeneratedChallenge[] {
  const shuffled = [...templates].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));
  return selected.map(template => generateChallenge(template));
}

/**
 * Фильтрует шаблоны по категории и сложности
 */
export function filterTemplates(
  templates: ChallengeTemplate[],
  filters: {
    category?: string;
    difficulty?: Difficulty;
  }
): ChallengeTemplate[] {
  return templates.filter(template => {
    if (filters.category && template.category !== filters.category) {
      return false;
    }
    if (filters.difficulty && template.difficulty !== filters.difficulty) {
      return false;
    }
    return true;
  });
}

/**
 * Дополнительные шаблоны для разнообразия
 */
export const additionalTemplates: ChallengeTemplate[] = [
  {
    id: 'tmpl-extra-1',
    pattern: 'Сфотографируйте [object] так, чтобы было видно [detail]',
    category: 'light',
    difficulty: 'medium',
    variables: [
      { name: 'object', type: 'object', options: ['ваш обед', 'чашку кофе', 'любимую книгу', 'рабочий стол', 'окно'] },
      { name: 'detail', type: 'style', options: ['отражение', 'тень', 'текстуру', 'игру света', 'глубину'] },
    ],
  },
  {
    id: 'tmpl-extra-2',
    pattern: 'Найдите [count] предметов [color] цвета и сфотографируйте их вместе',
    category: 'color',
    difficulty: 'easy',
    variables: [
      { name: 'count', type: 'object', options: ['3', '5', '7'] },
      { name: 'color', type: 'color', options: ['красного', 'синего', 'зелёного', 'жёлтого', 'белого'] },
    ],
  },
  {
    id: 'tmpl-extra-3',
    pattern: 'Создайте фото в стиле [style] используя только [limitation]',
    category: 'abstract',
    difficulty: 'hard',
    variables: [
      { name: 'style', type: 'style', options: ['минимализм', 'симметрия', 'хаос', 'геометрия'] },
      { name: 'limitation', type: 'object', options: ['естественный свет', 'один цвет', 'прямые линии', 'круглые формы'] },
    ],
  },
  {
    id: 'tmpl-extra-4',
    pattern: 'Запечатлейте момент [moment] в вашем дне',
    category: 'mood',
    difficulty: 'easy',
    variables: [
      { name: 'moment', type: 'emotion', options: ['спокойствия', 'радости', 'ожидания', 'движения', 'тишины'] },
    ],
  },
  {
    id: 'tmpl-extra-5',
    pattern: 'Сфотографируйте [subject] с [perspective] перспективы',
    category: 'urban',
    difficulty: 'medium',
    variables: [
      { name: 'subject', type: 'location', options: ['здание', 'лестницу', 'коридор', 'арку', 'мост'] },
      { name: 'perspective', type: 'angle', options: ['низкой', 'высокой', 'диагональной', 'центральной'] },
    ],
  },
];
