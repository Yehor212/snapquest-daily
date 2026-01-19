import { motion } from 'framer-motion';
import { Clock, Users, CheckCircle2, ChevronRight } from 'lucide-react';
import { DifficultyBadge, XpBadge, ProgressRing } from '@/components/common';
import type { ScavengerHunt, HuntProgress } from '@/types';
import { UI_TEXT } from '@/types';

interface HuntCardProps {
  hunt: ScavengerHunt;
  progress?: HuntProgress;
  onClick?: () => void;
}

export function HuntCard({ hunt, progress, onClick }: HuntCardProps) {
  const completedTasks = progress?.tasksCompleted.length || 0;
  const totalTasks = hunt.tasks.length;
  const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const isCompleted = completedTasks === totalTasks && totalTasks > 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-card rounded-2xl border border-border overflow-hidden cursor-pointer group"
    >
      {/* Cover Image */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={hunt.coverImage}
          alt={hunt.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs font-medium">
            {UI_TEXT.hunts.themes[hunt.theme]}
          </span>
          <DifficultyBadge difficulty={hunt.difficulty} size="sm" />
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
          <XpBadge xp={hunt.totalXp} size="sm" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-lg font-bold mb-1 group-hover:text-primary transition-colors">
          {hunt.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {hunt.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {UI_TEXT.hunts.duration[hunt.duration]}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {hunt.participantsCount}
            </span>
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
