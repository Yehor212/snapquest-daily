import { motion } from 'framer-motion';
import { Check, Camera, Lightbulb, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { XpBadge } from '@/components/common';
import type { HuntTask } from '@/types';
import { cn } from '@/lib/utils';

interface HuntTaskCardProps {
  task: HuntTask;
  isCompleted: boolean;
  order: number;
  onClick?: () => void;
  showHint?: boolean;
}

export function HuntTaskCard({
  task,
  isCompleted,
  order,
  onClick,
  showHint = false,
}: HuntTaskCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: order * 0.05 }}
      onClick={onClick}
      className={cn(
        'relative flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer',
        isCompleted
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-card border-border hover:border-primary/40'
      )}
    >
      {/* Order number / Check */}
      <div
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold',
          isCompleted
            ? 'bg-green-500 text-white'
            : 'bg-secondary text-muted-foreground'
        )}
      >
        {isCompleted ? (
          <Check className="w-5 h-5" />
        ) : (
          <span>{order}</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4
          className={cn(
            'font-medium mb-1',
            isCompleted && 'line-through text-muted-foreground'
          )}
        >
          {task.title}
        </h4>
        <p className="text-sm text-muted-foreground mb-2">
          {task.description}
        </p>

        {/* Hint */}
        {showHint && task.hint && !isCompleted && (
          <div className="flex items-start gap-2 p-2 rounded-lg bg-gold/10 border border-gold/20 text-sm">
            <Lightbulb className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
            <span className="text-gold">{task.hint}</span>
          </div>
        )}

        {/* XP */}
        <div className="flex items-center gap-2 mt-2">
          <XpBadge xp={task.xpReward} size="sm" showIcon={false} />
          {task.bonusXp && !isCompleted && (
            <span className="text-xs text-gold">+{task.bonusXp} бонус</span>
          )}
        </div>
      </div>

      {/* Action */}
      {!isCompleted && (
        <div className="flex-shrink-0">
          <Button size="icon" variant="ghost">
            <Camera className="w-5 h-5" />
          </Button>
        </div>
      )}
    </motion.div>
  );
}
