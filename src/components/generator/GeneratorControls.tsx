import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ChallengeCategory, Difficulty } from '@/types';
import { UI_TEXT } from '@/types';

interface GeneratorControlsProps {
  category: ChallengeCategory | 'all';
  difficulty: Difficulty | 'all';
  onCategoryChange: (category: ChallengeCategory | 'all') => void;
  onDifficultyChange: (difficulty: Difficulty | 'all') => void;
}

const categories: (ChallengeCategory | 'all')[] = [
  'all',
  'nature',
  'urban',
  'people',
  'food',
  'abstract',
  'mood',
  'color',
  'light',
];

const difficulties: (Difficulty | 'all')[] = ['all', 'easy', 'medium', 'hard'];

export function GeneratorControls({
  category,
  difficulty,
  onCategoryChange,
  onDifficultyChange,
}: GeneratorControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Category */}
      <div className="flex-1 space-y-2">
        <Label htmlFor="category" className="text-sm text-muted-foreground">
          Категория
        </Label>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Выберите категорию" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {categories.slice(1).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {UI_TEXT.categories[cat as ChallengeCategory]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Difficulty */}
      <div className="flex-1 space-y-2">
        <Label htmlFor="difficulty" className="text-sm text-muted-foreground">
          Сложность
        </Label>
        <Select value={difficulty} onValueChange={onDifficultyChange}>
          <SelectTrigger id="difficulty">
            <SelectValue placeholder="Выберите сложность" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Любая</SelectItem>
            {difficulties.slice(1).map((diff) => (
              <SelectItem key={diff} value={diff}>
                {UI_TEXT.hunts.difficulty[diff as Difficulty]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
