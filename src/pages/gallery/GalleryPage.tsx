import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PhotoGallery, GalleryFilters } from '@/components/gallery';
import { EmptyState } from '@/components/common';
import type { Photo, PhotoGalleryFilter } from '@/types';
import { getAllPhotos } from '@/lib/storage';
import { mockPhotos } from '@/data/mockData';

export default function GalleryPage() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<PhotoGalleryFilter>({
    sortBy: 'date',
    sortOrder: 'desc',
  });

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      // Загружаем фото из IndexedDB
      const savedPhotos = await getAllPhotos();
      // Объединяем с mock данными для демо
      const allPhotos = [...savedPhotos, ...mockPhotos];
      setPhotos(allPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
      // Fallback to mock data
      setPhotos(mockPhotos);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilter: Partial<PhotoGalleryFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  };

  // Применяем фильтры и сортировку
  const filteredPhotos = photos
    .filter(photo => {
      if (filter.isTop && !photo.isTop) return false;
      return true;
    })
    .sort((a, b) => {
      const order = filter.sortOrder === 'desc' ? -1 : 1;
      if (filter.sortBy === 'date') {
        return order * (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      if (filter.sortBy === 'likes') {
        return order * (b.likes - a.likes);
      }
      return 0;
    });

  // Разделяем на свои и чужие фото
  const myPhotos = filteredPhotos.filter(p => p.userId === 'user-1');
  const feedPhotos = filteredPhotos;

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
            {isLoading ? (
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-secondary animate-pulse"
                  />
                ))}
              </div>
            ) : feedPhotos.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <PhotoGallery photos={feedPhotos} columns={3} />
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
            {isLoading ? (
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-secondary animate-pulse"
                  />
                ))}
              </div>
            ) : myPhotos.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <PhotoGallery photos={myPhotos} columns={3} />
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
