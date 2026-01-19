import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Award, Calendar } from 'lucide-react';
import type { Photo } from '@/types';
import { cn } from '@/lib/utils';
import { PhotoDetailModal } from './PhotoDetailModal';

interface PhotoGalleryProps {
  photos: Photo[];
  columns?: 2 | 3;
  onPhotoClick?: (photo: Photo) => void;
  showStats?: boolean;
  emptyMessage?: string;
}

export function PhotoGallery({
  photos,
  columns = 3,
  onPhotoClick,
  showStats = true,
  emptyMessage = 'Пока нет фотографий',
}: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const handlePhotoClick = (photo: Photo) => {
    if (onPhotoClick) {
      onPhotoClick(photo);
    } else {
      setSelectedPhoto(photo);
    }
  };

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          'grid gap-2',
          columns === 2 ? 'grid-cols-2' : 'grid-cols-3'
        )}
      >
        <AnimatePresence>
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="relative aspect-square rounded-lg overflow-hidden bg-secondary cursor-pointer group"
              onClick={() => handlePhotoClick(photo)}
            >
              <img
                src={photo.imageData}
                alt=""
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />

              {/* Top badge */}
              {photo.isTop && (
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/90 text-xs font-semibold text-black">
                    <Award className="w-3 h-3" />
                    TOP
                  </span>
                </div>
              )}

              {/* Stats overlay */}
              {showStats && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 left-2 right-2 flex items-center gap-3 text-white text-xs">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {photo.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {photo.comments}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      <PhotoDetailModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </>
  );
}
