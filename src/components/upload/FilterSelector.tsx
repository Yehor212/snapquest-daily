import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { PhotoFilterType } from '@/types';
import { FILTER_CONFIGS, FILTER_NAMES } from '@/lib/imageUtils';
import { cn } from '@/lib/utils';

interface FilterSelectorProps {
  imageUrl: string;
  selectedFilter: PhotoFilterType;
  onFilterSelect: (filter: PhotoFilterType) => void;
}

const FILTERS: PhotoFilterType[] = [
  'none',
  'grayscale',
  'sepia',
  'vintage',
  'warm',
  'cool',
  'dramatic',
  'fade',
];

export function FilterSelector({
  imageUrl,
  selectedFilter,
  onFilterSelect,
}: FilterSelectorProps) {
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});

  useEffect(() => {
    // Создаём превью для каждого фильтра
    const generateThumbnails = async () => {
      const newThumbnails: Record<string, string> = {};

      for (const filter of FILTERS) {
        // Для простоты используем CSS фильтры вместо Canvas для превью
        newThumbnails[filter] = imageUrl;
      }

      setThumbnails(newThumbnails);
    };

    if (imageUrl) {
      generateThumbnails();
    }
  }, [imageUrl]);

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Фильтры
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {FILTERS.map((filter, index) => (
          <motion.button
            key={filter}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onFilterSelect(filter)}
            className={cn(
              'flex-shrink-0 flex flex-col items-center gap-2 p-1 rounded-lg transition-all',
              selectedFilter === filter
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                : 'hover:bg-secondary'
            )}
          >
            <div
              className="w-16 h-16 rounded-lg overflow-hidden bg-secondary"
              style={{
                filter: FILTER_CONFIGS[filter],
              }}
            >
              <img
                src={thumbnails[filter] || imageUrl}
                alt={FILTER_NAMES[filter]}
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className={cn(
                'text-xs',
                selectedFilter === filter
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground'
              )}
            >
              {FILTER_NAMES[filter]}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
