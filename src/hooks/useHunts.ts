import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getActiveHunts,
  getHuntWithTasks,
  getHuntProgress,
  startHunt,
  completeHuntTask,
  getUserHuntProgress,
  Hunt,
  HuntProgress,
} from '@/lib/api/hunts';

export const huntKeys = {
  all: ['hunts'] as const,
  active: () => [...huntKeys.all, 'active'] as const,
  detail: (id: string) => [...huntKeys.all, 'detail', id] as const,
  progress: (id: string) => [...huntKeys.all, 'progress', id] as const,
  userProgress: () => [...huntKeys.all, 'userProgress'] as const,
};

/**
 * Hook to get all active hunts
 */
export function useActiveHunts() {
  return useQuery({
    queryKey: huntKeys.active(),
    queryFn: getActiveHunts,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get hunt with tasks
 */
export function useHuntWithTasks(huntId: string | undefined) {
  return useQuery({
    queryKey: huntKeys.detail(huntId || ''),
    queryFn: () => getHuntWithTasks(huntId!),
    enabled: !!huntId,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to get hunt progress
 */
export function useHuntProgress(huntId: string | undefined) {
  return useQuery({
    queryKey: huntKeys.progress(huntId || ''),
    queryFn: () => getHuntProgress(huntId!),
    enabled: !!huntId,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to get user's all hunt progress
 */
export function useUserHuntProgress() {
  return useQuery({
    queryKey: huntKeys.userProgress(),
    queryFn: getUserHuntProgress,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to start a hunt
 */
export function useStartHunt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (huntId: string) => startHunt(huntId),
    onSuccess: (data, huntId) => {
      if (data) {
        queryClient.setQueryData(huntKeys.progress(huntId), data);
        queryClient.invalidateQueries({ queryKey: huntKeys.userProgress() });
      }
    },
  });
}

/**
 * Hook to complete a hunt task
 */
export function useCompleteHuntTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ huntId, taskId, xpReward }: { huntId: string; taskId: string; xpReward: number }) =>
      completeHuntTask(huntId, taskId, xpReward),
    onSuccess: (data, { huntId }) => {
      if (data) {
        queryClient.setQueryData(huntKeys.progress(huntId), data);
        queryClient.invalidateQueries({ queryKey: huntKeys.userProgress() });
        // Also invalidate profile to update XP
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
    },
  });
}
