import type { Difficulty } from '@/types';
import { UI_TEXT } from '@/types';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  size?: 'sm' | 'md';
}

const difficultyConfig = {
  easy: {
    label: UI_TEXT.hunts.difficulty.easy,
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  medium: {
    label: UI_TEXT.hunts.difficulty.medium,
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  },
  hard: {
    label: UI_TEXT.hunts.difficulty.hard,
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
};

export function DifficultyBadge({ difficulty, size = 'md' }: DifficultyBadgeProps) {
  const config = difficultyConfig[difficulty];
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${config.color} ${sizeClasses}`}>
      {config.label}
    </span>
  );
}
