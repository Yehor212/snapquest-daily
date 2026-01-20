import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface XpBadgeProps {
  xp: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  animated?: boolean;
}

export function XpBadge({ xp, size = 'md', showIcon = true, animated = false }: XpBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' as const, stiffness: 500, damping: 30 }}
        className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/30 font-semibold text-gold ${sizeClasses[size]}`}
      >
        {showIcon && <Sparkles className={iconSizes[size]} />}
        <span>+{xp} XP</span>
      </motion.div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/30 font-semibold text-gold ${sizeClasses[size]}`}
    >
      {showIcon && <Sparkles className={iconSizes[size]} />}
      <span>+{xp} XP</span>
    </div>
  );
}
