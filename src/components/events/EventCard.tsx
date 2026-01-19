import { motion } from 'framer-motion';
import { Calendar, Users, Camera, ChevronRight } from 'lucide-react';
import type { PrivateEvent } from '@/types';
import { UI_TEXT } from '@/types';

interface EventCardProps {
  event: PrivateEvent;
  onClick?: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const startDate = new Date(event.startDate);
  const formattedDate = startDate.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  });

  const statusColors = {
    draft: 'bg-yellow-500/20 text-yellow-400',
    active: 'bg-green-500/20 text-green-400',
    completed: 'bg-muted text-muted-foreground',
  };

  const statusLabels = {
    draft: 'Черновик',
    active: 'Активно',
    completed: 'Завершено',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-card rounded-2xl border border-border overflow-hidden cursor-pointer group"
    >
      {/* Cover */}
      <div className="relative h-32 overflow-hidden">
        {event.coverImage ? (
          <img
            src={event.coverImage}
            alt={event.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs font-medium">
            {UI_TEXT.events.eventTypes[event.eventType]}
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
          <span className="px-2 py-1 rounded bg-white/20 backdrop-blur-sm text-xs font-mono">
            {event.accessCode}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-lg font-bold mb-1 group-hover:text-primary transition-colors">
          {event.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1 mb-4">
          {event.description}
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
              {event.participantsCount}
            </span>
            <span className="flex items-center gap-1">
              <Camera className="w-4 h-4" />
              {event.challenges.length}
            </span>
          </div>

          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </motion.div>
  );
}
