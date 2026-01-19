import { motion } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PhotoFilterType } from '@/types';
import { FILTER_CONFIGS } from '@/lib/imageUtils';

interface PhotoPreviewProps {
  imageUrl: string;
  filter?: PhotoFilterType;
  onRemove?: () => void;
  onReset?: () => void;
  showControls?: boolean;
}

export function PhotoPreview({
  imageUrl,
  filter = 'none',
  onRemove,
  onReset,
  showControls = true,
}: PhotoPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full aspect-square max-w-md mx-auto rounded-2xl overflow-hidden bg-secondary"
    >
      <img
        src={imageUrl}
        alt="Preview"
        className="w-full h-full object-cover"
        style={{ filter: FILTER_CONFIGS[filter] }}
      />

      {showControls && (
        <div className="absolute top-3 right-3 flex gap-2">
          {onReset && (
            <Button
              size="icon"
              variant="secondary"
              className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm"
              onClick={onReset}
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          )}
          {onRemove && (
            <Button
              size="icon"
              variant="secondary"
              className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm"
              onClick={onRemove}
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      )}

      {/* Gradient overlay at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
    </motion.div>
  );
}
