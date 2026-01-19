import { motion } from "framer-motion";
import { Camera, Heart, Award, Clock, Loader2, ImageIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserPhotosWithChallenges, useUserStats } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";

export const ProfileHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: photos, isLoading } = useUserPhotosWithChallenges(12);
  const { data: stats } = useUserStats(user?.id);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Вчера';
    if (diffDays < 7) return `${diffDays} дн. назад`;
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="bg-card rounded-2xl border border-border p-6"
      >
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </motion.div>
    );
  }

  const historyItems = photos || [];
  const totalPhotos = stats?.photosCount || historyItems.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Camera className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg">История челленджей</h3>
            <p className="text-sm text-muted-foreground">
              {totalPhotos} выполненных заданий
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/gallery')}
          className="text-sm text-primary hover:underline"
        >
          Все фото
        </button>
      </div>

      {/* Photo grid */}
      {historyItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {historyItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
              className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(selectedImage === item.id ? null : item.id)}
            >
              <img
                src={item.thumbnail_url || item.image_url}
                alt={item.challenge_title || 'Фото'}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-sm font-medium truncate mb-1">
                    {item.challenge_title || 'Фото'}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-primary" />
                      <span>{item.likes_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top badge */}
              {item.likes_count >= 10 && (
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-gold text-gold-foreground text-xs font-semibold">
                  <Award className="w-3 h-3" />
                  ТОП
                </div>
              )}

              {/* XP earned */}
              <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-semibold text-gold">
                +{item.xp_earned} XP
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <ImageIcon className="w-12 h-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-sm">
            Пока нет выполненных челленджей
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-3 text-sm text-primary hover:underline"
          >
            Начать первый челлендж
          </button>
        </div>
      )}

      {/* Load more */}
      {historyItems.length > 0 && historyItems.length < totalPhotos && (
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/gallery')}
            className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            Показать ещё
          </button>
        </div>
      )}
    </motion.div>
  );
};
