import { motion } from 'framer-motion';
import { Camera, Bookmark, Share2, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { XpBadge, DifficultyBadge } from '@/components/common';
import type { GeneratedChallenge } from '@/types';
import { UI_TEXT } from '@/types';

interface GeneratedChallengeCardProps {
  challenge: GeneratedChallenge;
  onUse?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  onRegenerate?: () => void;
  isSaved?: boolean;
}

export function GeneratedChallengeCard({
  challenge,
  onUse,
  onSave,
  onShare,
  onRegenerate,
  isSaved,
}: GeneratedChallengeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="bg-card rounded-2xl border border-border overflow-hidden"
    >
      {/* Header gradient */}
      <div className="h-2 bg-gradient-to-r from-primary via-accent to-gold" />

      <div className="p-6 space-y-4">
        {/* Category & Difficulty */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {UI_TEXT.categories[challenge.category]}
          </span>
          <DifficultyBadge difficulty={challenge.difficulty} size="sm" />
        </div>

        {/* Challenge text */}
        <h3 className="font-display text-xl font-bold leading-tight">
          {challenge.title}
        </h3>

        {/* XP Reward */}
        <XpBadge xp={challenge.xpReward} animated />

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {onRegenerate && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              className="gap-2"
            >
              <Shuffle className="w-4 h-4" />
              Другой
            </Button>
          )}

          {onSave && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSave}
              className={isSaved ? 'text-gold' : ''}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
          )}

          {onShare && (
            <Button variant="outline" size="sm" onClick={onShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          )}

          {onUse && (
            <Button
              size="sm"
              onClick={onUse}
              className="flex-1 gap-2 bg-gradient-to-r from-primary to-primary/80"
            >
              <Camera className="w-4 h-4" />
              Выполнить
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
