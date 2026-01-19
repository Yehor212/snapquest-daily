import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createEvent,
  getUserEvents,
  getEventDetails,
  joinEventByCode,
  leaveEvent,
  getEventParticipantsCount,
  Event,
} from '@/lib/api/events';

export const eventKeys = {
  all: ['events'] as const,
  user: () => [...eventKeys.all, 'user'] as const,
  detail: (id: string) => [...eventKeys.all, 'detail', id] as const,
  participants: (id: string) => [...eventKeys.all, 'participants', id] as const,
};

/**
 * Hook to get user's events
 */
export function useUserEvents() {
  return useQuery({
    queryKey: eventKeys.user(),
    queryFn: getUserEvents,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to get event details
 */
export function useEventDetails(eventId: string | undefined) {
  return useQuery({
    queryKey: eventKeys.detail(eventId || ''),
    queryFn: () => getEventDetails(eventId!),
    enabled: !!eventId,
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to get event participants count
 */
export function useEventParticipantsCount(eventId: string | undefined) {
  return useQuery({
    queryKey: eventKeys.participants(eventId || ''),
    queryFn: () => getEventParticipantsCount(eventId!),
    enabled: !!eventId,
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to create an event
 */
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      eventType,
      description,
      challenges,
    }: {
      name: string;
      eventType: Event['event_type'];
      description?: string;
      challenges?: { title: string; description?: string }[];
    }) => createEvent(name, eventType, description, challenges),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.user() });
    },
  });
}

/**
 * Hook to join event by code
 */
export function useJoinEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => joinEventByCode(code),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: eventKeys.user() });
        queryClient.invalidateQueries({ queryKey: eventKeys.detail(data.id) });
      }
    },
  });
}

/**
 * Hook to leave an event
 */
export function useLeaveEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => leaveEvent(eventId),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.user() });
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
    },
  });
}
