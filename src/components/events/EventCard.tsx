import { motion } from 'framer-motion';
import { Calendar, Users, Camera, ChevronRight } from 'lucide-react';
import { UI_TEXT, type EventType } from '@/types';
import type { Event } from '@/lib/api/events';

interface EventCardProps {
  event: Event;
  participantsCount?: number;
  challengesCount?: number;
  onClick?: () => void;
}

export function EventCard({ event, participantsCount = 0, challengesCount = 0, onClick }: EventCardProps) {
  const startDate = event.start_date ? new Date(event.start_date) : new Date(event.created_at);
  const formattedDate = startDate.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  });

  const statusColors = {
    draft: 'bg-yellow-500/20 text-yellow-400',
    active: 'bg-green-500/20 text-green-400',
    completed: 'bg-muted text-muted-foreground',
    archived: 'bg-muted text-muted-foreground',
  };

  const statusLabels = {
    draft: 'Черновик',
    active: 'Активно',
    completed: 'Завершено',
    archived: 'В архиве',
  };

  // Map Supabase event types to UI text
  const eventTypeLabel = UI_TEXT.events.eventTypes[event.event_type as EventType] || event.event_type;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-card rounded-2xl border border-border overflow-hidden cursor-pointer group"
    >
      {/* Cover */}
      <div className="relative h-32 overflow-hidden">
        {event.cover_image ? (
          <img
            src={event.cover_image}
            alt={event.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs font-medium text-white">
            {eventTypeLabel}
          </span>
        </div>

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[event.status]}`}>
            {statusLabels[event.status]}
          </span>
        </div>

        {/* Code */}
        <div className="absolute bottom-3 right-3">
          <span className="px-2 py-1 rounded bg-white/20 backdrop-blur-sm text-xs font-mono text-white">
            {event.access_code}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-lg font-bold mb-1 group-hover:text-primary transition-colors">
          {event.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1 mb-4">
          {event.description || 'Нет описания'}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {participantsCount}
            </span>
            {challengesCount > 0 && (
              <span className="flex items-center gap-1">
                <Camera className="w-4 h-4" />
                {challengesCount}
              </span>
            )}
          </div>

          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </motion.div>
  );
}
