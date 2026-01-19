import { motion } from 'framer-motion';
import { Clock, CheckCircle2, ChevronRight, Trophy } from 'lucide-react';
import { DifficultyBadge, XpBadge, ProgressRing } from '@/components/common';
import { UI_TEXT, type HuntTheme, type HuntDuration, type Difficulty } from '@/types';
import type { Hunt, HuntProgress } from '@/lib/api/hunts';

interface HuntCardProps {
  hunt: Hunt;
  progress?: HuntProgress | null;
  taskCount?: number;
  onClick?: () => void;
}

export function HuntCard({ hunt, progress, taskCount = 0, onClick }: HuntCardProps) {
  const completedTasks = progress?.completed_tasks?.length || 0;
  const totalTasks = taskCount;
  const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const isCompleted = progress?.completed_at !== null && progress?.completed_at !== undefined;

  const themeGradients: Record<HuntTheme, string> = {
    city: 'from-slate-700/60 to-slate-900/60',
    nature: 'from-emerald-500/50 to-teal-900/60',
    home: 'from-amber-400/50 to-orange-800/60',
    travel: 'from-sky-500/50 to-indigo-900/60',
    seasonal: 'from-fuchsia-500/50 to-purple-900/60',
  };
  const gradientClass = themeGradients[hunt.theme as HuntTheme] || 'from-primary/20 to-accent/20';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-card rounded-2xl border border-border overflow-hidden cursor-pointer group"
    >
      {/* Cover Image */}
      <div className="relative h-32 overflow-hidden">
        {hunt.cover_image ? (
          <img
            src={hunt.cover_image}
            alt={hunt.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientClass}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs font-medium text-white">
            {UI_TEXT.hunts.themes[hunt.theme as HuntTheme] || hunt.theme}
          </span>
          <DifficultyBadge difficulty={hunt.difficulty as Difficulty} size="sm" />
        </div>

        {/* Completed badge */}
        {isCompleted && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/90 text-xs font-semibold text-white">
              <CheckCircle2 className="w-3 h-3" />
              Завершено
            </span>
          </div>
        )}

        {/* XP */}
        <div className="absolute bottom-3 right-3">
          <XpBadge xp={hunt.total_xp} size="sm" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-lg font-bold mb-1 group-hover:text-primary transition-colors">
          {hunt.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {hunt.description || 'Нет описания'}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {UI_TEXT.hunts.duration[hunt.duration as HuntDuration] || hunt.duration}
            </span>
            {totalTasks > 0 && (
              <span className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                {totalTasks} заданий
              </span>
            )}
          </div>

          {/* Progress */}
          {progress ? (
            <div className="flex items-center gap-2">
              <ProgressRing progress={progressPercent} size={32} strokeWidth={3}>
                <span className="text-[10px] font-medium">
                  {completedTasks}/{totalTasks}
                </span>
              </ProgressRing>
            </div>
          ) : (
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
