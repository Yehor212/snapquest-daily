import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Trophy } from 'lucide-react';
import { ProgressRing } from '@/components/common';
import type { ScavengerHunt, HuntProgress as HuntProgressType } from '@/types';

interface HuntProgressProps {
  hunt: ScavengerHunt;
  progress: HuntProgressType | null;
  variant?: 'compact' | 'detailed';
}

export function HuntProgress({
  hunt,
  progress,
  variant = 'detailed',
}: HuntProgressProps) {
  const completedCount = progress?.tasksCompleted.length || 0;
  const totalCount = hunt.tasks.length;
  const percent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isCompleted = completedCount === totalCount && totalCount > 0;

  const earnedXp = progress?.totalXpEarned || 0;

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3">
        <ProgressRing progress={percent} size={48} strokeWidth={4}>
          <span className="text-xs font-bold">{Math.round(percent)}%</span>
        </ProgressRing>
        <div>
          <p className="text-sm font-medium">
            {completedCount} из {totalCount}
          </p>
          <p className="text-xs text-muted-foreground">заданий</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-bold">Прогресс</h3>
        {isCompleted && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold/20 text-gold text-sm font-medium">
            <Trophy className="w-4 h-4" />
            Завершено!
          </span>
        )}
      </div>

      {/* Main progress */}
      <div className="flex items-center gap-6 mb-6">
        <ProgressRing
          progress={percent}
          size={80}
          strokeWidth={6}
          color={isCompleted ? 'stroke-green-500' : 'stroke-primary'}
        >
          <span className="text-lg font-bold">{Math.round(percent)}%</span>
        </ProgressRing>

        <div className="flex-1">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold">{completedCount}</span>
            <span className="text-muted-foreground">/ {totalCount} заданий</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Заработано: <span className="text-gold font-medium">{earnedXp} XP</span>
          </p>
        </div>
      </div>

      {/* Task dots */}
      <div className="flex flex-wrap gap-2">
        {hunt.tasks.map((task, index) => {
          const isTaskCompleted = progress?.tasksCompleted.includes(task.id);
          return (
            <motion.div
              key={task.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="relative group"
            >
              {isTaskCompleted ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <Circle className="w-6 h-6 text-muted-foreground/30" />
              )}

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-popover text-popover-foreground text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {task.title}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
