import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MessageCircle, Share2, Award, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Photo } from '@/types';
import { mockUsers } from '@/data/mockData';

interface PhotoDetailModalProps {
  photo: Photo | null;
  onClose: () => void;
}

export function PhotoDetailModal({ photo, onClose }: PhotoDetailModalProps) {
  if (!photo) return null;

  const user = mockUsers.find(u => u.id === photo.userId);
  const formattedDate = new Date(photo.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-lg bg-card rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Image */}
            <div className="relative aspect-square">
              <img
                src={photo.imageData}
                alt=""
                className="w-full h-full object-cover"
              />

              {/* Top badge */}
              {photo.isTop && (
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold/90 text-sm font-semibold text-black">
                    <Award className="w-4 h-4" />
                    TOP
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4 space-y-4">
              {/* User info */}
              {user && (
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{user.displayName}</p>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>{photo.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span>{photo.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formattedDate}
                </span>
                {photo.metadata?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {photo.metadata.location.placeName || 'Местоположение'}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
