import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RandomizeButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  variant?: 'default' | 'large';
}

export function RandomizeButton({
  onClick,
  isLoading = false,
  variant = 'default',
}: RandomizeButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onClick();
    setTimeout(() => setIsAnimating(false), 600);
  };

  if (variant === 'large') {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        disabled={isLoading}
        className="relative w-full py-6 rounded-2xl bg-gradient-to-r from-primary via-accent to-gold text-primary-foreground font-display text-xl font-bold overflow-hidden group"
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={isAnimating ? { x: '100%' } : { x: '-100%' }}
          transition={{ duration: 0.6 }}
        />

        <span className="relative flex items-center justify-center gap-3">
          <motion.div
            animate={isAnimating ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Wand2 className="w-6 h-6" />
          </motion.div>
          {isLoading ? 'Генерирую...' : 'Сгенерировать челлендж'}
        </span>
      </motion.button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className="gap-2 bg-gradient-to-r from-primary to-accent"
    >
      <motion.div
        animate={isAnimating ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Sparkles className="w-4 h-4" />
      </motion.div>
      {isLoading ? 'Генерирую...' : 'Сгенерировать'}
    </Button>
  );
}
