import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PhotoGallery, GalleryFilters } from '@/components/gallery';
import { EmptyState } from '@/components/common';
import type { PhotoGalleryFilter } from '@/types';
import { useUserPhotos, usePhotoFeed } from '@/hooks/usePhotos';
import { useAuth } from '@/contexts/AuthContext';

export default function GalleryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState<PhotoGalleryFilter>({
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const { data: feedPhotos, isLoading: feedLoading } = usePhotoFeed(50);
  const { data: myPhotos, isLoading: myLoading } = useUserPhotos(user?.id);

  const handleFilterChange = (newFilter: Partial<PhotoGalleryFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  };

  // Apply filters and sorting to feed photos
  const filteredFeedPhotos = (feedPhotos || [])
    .filter(photo => {
      if (filter.isTop && photo.likes_count < 10) return false;
      return true;
    })
    .sort((a, b) => {
      const order = filter.sortOrder === 'desc' ? -1 : 1;
      if (filter.sortBy === 'date') {
        return order * (new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
      if (filter.sortBy === 'likes') {
        return order * ((b.likes_count || 0) - (a.likes_count || 0));
      }
      return 0;
    });

  // Apply filters and sorting to my photos
  const filteredMyPhotos = (myPhotos || [])
    .sort((a, b) => {
      const order = filter.sortOrder === 'desc' ? -1 : 1;
      if (filter.sortBy === 'date') {
        return order * (new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
      if (filter.sortBy === 'likes') {
        return order * ((b.likes_count || 0) - (a.likes_count || 0));
      }
      return 0;
    });

  // Convert Supabase photos to the format expected by PhotoGallery
  const mapPhotosForGallery = (photos: typeof feedPhotos) => {
    return (photos || []).map(photo => ({
      id: photo.id,
      userId: photo.user_id,
      imageData: photo.image_url,
      thumbnailData: photo.thumbnail_url || photo.image_url,
      createdAt: photo.created_at,
      likes: photo.likes_count,
      comments: 0,
      isTop: photo.likes_count >= 10,
      challengeId: photo.challenge_id || undefined,
      eventId: photo.event_id || undefined,
      huntTaskId: photo.hunt_task_id || undefined,
      filter: photo.filter_applied || undefined,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-lg font-semibold">Галерея</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/upload')}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="my">Мои фото</TabsTrigger>
            </TabsList>

            <GalleryFilters filter={filter} onFilterChange={handleFilterChange} />
          </div>

          <TabsContent value="all">
            {feedLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredFeedPhotos.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <PhotoGallery photos={mapPhotosForGallery(filteredFeedPhotos)} columns={3} />
              </motion.div>
            ) : (
              <EmptyState
                icon={ImageIcon}
                title="Пока нет фото"
                description="Станьте первым, кто загрузит фото!"
                actionLabel="Загрузить фото"
                onAction={() => navigate('/upload')}
              />
            )}
          </TabsContent>

          <TabsContent value="my">
            {!user ? (
              <EmptyState
                icon={ImageIcon}
                title="Войдите в аккаунт"
                description="Чтобы видеть свои фото, необходимо войти в аккаунт"
              />
            ) : myLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredMyPhotos.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <PhotoGallery photos={mapPhotosForGallery(filteredMyPhotos)} columns={3} />
              </motion.div>
            ) : (
              <EmptyState
                icon={ImageIcon}
                title="У вас пока нет фото"
                description="Выполняйте челленджи и ваши фото появятся здесь"
                actionLabel="Загрузить первое фото"
                onAction={() => navigate('/upload')}
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
