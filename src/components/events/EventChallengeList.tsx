import { motion } from 'framer-motion';
import { Check, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { XpBadge } from '@/components/common';
import type { EventChallenge } from '@/types';
import { cn } from '@/lib/utils';

interface EventChallengeListProps {
  challenges: EventChallenge[];
  completedIds: string[];
  onChallengeClick: (challenge: EventChallenge) => void;
}

export function EventChallengeList({
  challenges,
  completedIds,
  onChallengeClick,
}: EventChallengeListProps) {
  return (
    <div className="space-y-3">
      {challenges.map((challenge, index) => {
        const isCompleted = completedIds.includes(challenge.id);

        return (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              'relative flex items-center gap-4 p-4 rounded-xl border transition-all',
              isCompleted
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-card border-border hover:border-primary/40 cursor-pointer'
            )}
            onClick={() => !isCompleted && onChallengeClick(challenge)}
          >
            {/* Order / Check */}
            <div
              className={cn(
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                isCompleted
                  ? 'bg-green-500 text-white'
                  : 'bg-secondary text-muted-foreground'
              )}
            >
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : (
                challenge.order
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4
                className={cn(
                  'font-medium text-sm',
                  isCompleted && 'line-through text-muted-foreground'
                )}
              >
                {challenge.title}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                {challenge.description}
              </p>
            </div>

            {/* XP / Action */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <XpBadge xp={challenge.xpReward} size="sm" showIcon={false} />
              {!isCompleted && (
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
