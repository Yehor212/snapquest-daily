import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Users, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventCard, JoinEventDialog } from '@/components/events';
import { EmptyState } from '@/components/common';
import type { PrivateEvent } from '@/types';
import { mockEvents } from '@/data/mockData';
import { getEvents } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export default function EventsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);

  // Combine mock events with saved events
  const savedEvents = getEvents();
  const allEvents = [...savedEvents, ...mockEvents];

  // Group by status
  const activeEvents = allEvents.filter(e => e.status === 'active');
  const draftEvents = allEvents.filter(e => e.status === 'draft');
  const completedEvents = allEvents.filter(e => e.status === 'completed');

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleJoinEvent = (event: PrivateEvent) => {
    toast({
      title: 'Вы присоединились!',
      description: `Добро пожаловать на "${event.name}"`,
    });
    navigate(`/events/${event.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-lg font-semibold">Мои события</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/events/create')}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-4">
            <Users className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-muted-foreground">
              Фото-игры для компаний
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">
            Приватные события
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Создавайте фото-челленджи для свадеб, вечеринок и тимбилдингов
          </p>
        </motion.div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => setJoinDialogOpen(true)}
          >
            <LogIn className="w-4 h-4" />
            Присоединиться
          </Button>
          <Button
            className="flex-1 gap-2 bg-gradient-to-r from-primary to-accent"
            onClick={() => navigate('/events/create')}
          >
            <Plus className="w-4 h-4" />
            Создать
          </Button>
        </div>

        {/* Active Events */}
        {activeEvents.length > 0 && (
          <section>
            <h3 className="font-display text-lg font-bold mb-4">
              Активные события
            </h3>
            <div className="space-y-4">
              {activeEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <EventCard
                    event={event}
                    onClick={() => handleEventClick(event.id)}
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Draft Events */}
        {draftEvents.length > 0 && (
          <section>
            <h3 className="font-display text-lg font-bold mb-4">
              Черновики
            </h3>
            <div className="space-y-4">
              {draftEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <EventCard
                    event={event}
                    onClick={() => handleEventClick(event.id)}
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Completed Events */}
        {completedEvents.length > 0 && (
          <section>
            <h3 className="font-display text-lg font-bold mb-4">
              Завершённые
            </h3>
            <div className="space-y-4">
              {completedEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <EventCard
                    event={event}
                    onClick={() => handleEventClick(event.id)}
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {allEvents.length === 0 && (
          <EmptyState
            icon={Users}
            title="Нет событий"
            description="Создайте своё первое событие или присоединитесь к существующему"
            actionLabel="Создать событие"
            onAction={() => navigate('/events/create')}
          />
        )}
      </main>

      {/* Join Dialog */}
      <JoinEventDialog
        open={joinDialogOpen}
        onOpenChange={setJoinDialogOpen}
        onJoin={handleJoinEvent}
      />
    </div>
  );
}
