import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Users, Camera, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventChallengeList, EventShareDialog } from '@/components/events';
import { PhotoGallery } from '@/components/gallery';
import { ProgressRing } from '@/components/common';
import { UI_TEXT } from '@/types';
import { useEventDetails } from '@/hooks/useEvents';
import { useAuth } from '@/contexts/AuthContext';

export default function EventDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: eventData, isLoading } = useEventDetails(id);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  // Calculate completed challenges based on user's photos
  const completedChallenges = useMemo(() => {
    if (!eventData?.photos || !user) return [];
    const userPhotos = eventData.photos.filter(p => p.user_id === user.id);
    return userPhotos
      .filter(p => p.event_challenge_id)
      .map(p => p.event_challenge_id as string);
  }, [eventData?.photos, user]);

  const handleChallengeClick = (challengeId: string) => {
    navigate(`/upload?event=${id}&eventChallenge=${challengeId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!eventData?.event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Событие не найдено</p>
      </div>
    );
  }

  const { event, challenges, participants, photos } = eventData;

  const startDate = event.start_date ? new Date(event.start_date) : new Date(event.created_at);
  const formattedDate = startDate.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const progressPercent =
    challenges.length > 0
      ? (completedChallenges.length / challenges.length) * 100
      : 0;

  // Map challenges to UI format
  const mappedChallenges = challenges.map(c => ({
    id: c.id,
    eventId: c.event_id,
    title: c.title,
    description: c.description || '',
    order: c.order_num,
    xpReward: c.xp_reward,
  }));

  // Map photos for gallery
  const mappedPhotos = photos.map(p => ({
    id: p.id,
    userId: p.user_id,
    imageData: p.image_url,
    thumbnailData: p.thumbnail_url || p.image_url,
    createdAt: p.created_at,
    likes: p.likes_count,
    comments: 0,
    isTop: p.likes_count >= 10,
    eventId: p.event_id || undefined,
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate('/events')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-lg font-semibold truncate max-w-[200px]">
            {event.name}
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShareDialogOpen(true)}
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Cover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-48 rounded-2xl overflow-hidden"
        >
          {event.cover_image ? (
            <img
              src={event.cover_image}
              alt={event.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium">
                {UI_TEXT.events.eventTypes[event.event_type]}
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">
              {event.name}
            </h2>
            <div className="flex items-center gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {participants.length}
              </span>
            </div>
          </div>

          {/* Access code */}
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-sm font-mono">
              {event.access_code}
            </span>
          </div>
        </motion.div>

        {/* Description */}
        {event.description && (
          <p className="text-muted-foreground">{event.description}</p>
        )}

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4"
        >
          <ProgressRing progress={progressPercent} size={64} strokeWidth={5}>
            <span className="text-sm font-bold">{Math.round(progressPercent)}%</span>
          </ProgressRing>
          <div>
            <p className="font-medium">
              {completedChallenges.length} из {challenges.length} заданий
            </p>
            <p className="text-sm text-muted-foreground">
              Выполнено вами
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="challenges" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="challenges" className="gap-2">
              <Camera className="w-4 h-4" />
              Задания
            </TabsTrigger>
            <TabsTrigger value="gallery" className="gap-2">
              <Users className="w-4 h-4" />
              Галерея
            </TabsTrigger>
          </TabsList>

          <TabsContent value="challenges" className="mt-4">
            <EventChallengeList
              challenges={mappedChallenges}
              completedIds={completedChallenges}
              onChallengeClick={(c) => handleChallengeClick(c.id)}
            />
          </TabsContent>

          <TabsContent value="gallery" className="mt-4">
            {mappedPhotos.length > 0 ? (
              <PhotoGallery photos={mappedPhotos} columns={2} />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Пока нет фотографий</p>
                <p className="text-sm">Станьте первым!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Share Dialog */}
      <EventShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        eventName={event.name}
        accessCode={event.access_code}
      />
    </div>
  );
}
