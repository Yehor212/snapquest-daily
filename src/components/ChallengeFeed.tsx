import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Award, Loader2, ImageIcon } from "lucide-react";
import { useState } from "react";
import { usePhotoFeed, useLikePhoto, useUnlikePhoto, useHasUserLikedPhoto } from "@/hooks/usePhotos";
import { useAuth } from "@/contexts/AuthContext";

interface FeedItemProps {
  id: string;
  imageUrl: string;
  likesCount: number;
  username: string;
  avatarUrl: string | null;
  isTop: boolean;
  createdAt: string;
}

function FeedItem({ id, imageUrl, likesCount, username, avatarUrl, isTop, createdAt }: FeedItemProps) {
  const { user } = useAuth();
  const { data: isLiked } = useHasUserLikedPhoto(id);
  const likeMutation = useLikePhoto();
  const unlikeMutation = useUnlikePhoto();
  const [optimisticLiked, setOptimisticLiked] = useState<boolean | null>(null);

  const liked = optimisticLiked !== null ? optimisticLiked : isLiked;
  const displayLikes = liked && !isLiked ? likesCount + 1 : !liked && isLiked ? likesCount - 1 : likesCount;

  const handleLikeToggle = async () => {
    if (!user) return;

    if (liked) {
      setOptimisticLiked(false);
      await unlikeMutation.mutateAsync(id);
    } else {
      setOptimisticLiked(true);
      await likeMutation.mutateAsync(id);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Только что';
    if (diffHours < 24) return `${diffHours}ч назад`;
    if (diffDays < 7) return `${diffDays}д назад`;
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const avatarColors = ['bg-primary', 'bg-accent', 'bg-gold', 'bg-success'];
  const avatarColor = avatarColors[username.length % avatarColors.length];

  return (
    <div className="group">
      <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={imageUrl}
            alt={`Photo by ${username}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Top badge */}
          {isTop && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-gold text-gold-foreground text-xs font-semibold">
              <Award className="w-3 h-3" />
              ТОП
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* User info */}
          <div className="flex items-center gap-3 mb-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={username}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-sm font-semibold text-primary-foreground`}>
                {getInitial(username)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{username}</p>
              <p className="text-xs text-muted-foreground">{formatTimeAgo(createdAt)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLikeToggle}
              disabled={!user}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
            >
              <Heart
                className={`w-5 h-5 transition-all ${
                  liked ? "fill-primary text-primary scale-110" : ""
                }`}
              />
              <span className={liked ? "text-primary" : ""}>
                {displayLikes}
              </span>
            </button>
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span>0</span>
            </button>
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const ChallengeFeed = () => {
  const { data: photos, isLoading } = usePhotoFeed(12);

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Лента <span className="text-gradient">выполнений</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Смотрите, как другие интерпретируют задание
          </p>
        </motion.div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && (!photos || photos.length === 0) && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ImageIcon className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="font-display text-xl font-bold mb-2">Пока нет фото</h3>
            <p className="text-muted-foreground max-w-md">
              Станьте первым, кто выполнит сегодняшний челлендж!
            </p>
          </div>
        )}

        {/* Feed Grid */}
        {!isLoading && photos && photos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <FeedItem
                  id={photo.id}
                  imageUrl={photo.image_url}
                  likesCount={photo.likes_count}
                  username={photo.display_name || photo.username || photo.user_id.slice(0, 8)}
                  avatarUrl={photo.avatar_url}
                  isTop={photo.likes_count >= 10}
                  createdAt={photo.created_at}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Load more */}
        {!isLoading && photos && photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <button className="px-6 py-3 rounded-xl border-2 border-border text-muted-foreground font-medium hover:border-primary hover:text-primary transition-colors">
              Показать ещё
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
