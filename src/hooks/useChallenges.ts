import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDailyChallenge,
  getAllChallenges,
  getChallengesByCategory,
  getTodayCompletionsCount,
  Challenge
} from '@/lib/api/challenges';
import {
  getSavedChallenges,
  getSavedChallengeIds,
  saveUserChallenge,
  unsaveUserChallenge,
  createAndSaveChallenge,
  deleteGeneratedChallenge,
} from '@/lib/api/generatedChallenges';

export const challengeKeys = {
  all: ['challenges'] as const,
  daily: () => [...challengeKeys.all, 'daily'] as const,
  list: () => [...challengeKeys.all, 'list'] as const,
  byCategory: (category: string) => [...challengeKeys.all, 'category', category] as const,
  todayCount: () => [...challengeKeys.all, 'todayCount'] as const,
  saved: () => [...challengeKeys.all, 'saved'] as const,
  savedIds: () => [...challengeKeys.all, 'savedIds'] as const,
};

/**
 * Hook to get today's daily challenge
 */
export function useDailyChallenge() {
  return useQuery({
    queryKey: challengeKeys.daily(),
    queryFn: getDailyChallenge,
    staleTime: 60 * 60 * 1000, // 1 hour - daily challenge doesn't change often
  });
}

/**
 * Hook to get all challenges
 */
export function useAllChallenges() {
  return useQuery({
    queryKey: challengeKeys.list(),
    queryFn: getAllChallenges,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get challenges by category
 */
export function useChallengesByCategory(category: string) {
  return useQuery({
    queryKey: challengeKeys.byCategory(category),
    queryFn: () => getChallengesByCategory(category),
    enabled: !!category,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to get today's completions count
 */
export function useTodayCompletions() {
  return useQuery({
    queryKey: challengeKeys.todayCount(),
    queryFn: getTodayCompletionsCount,
    staleTime: 60 * 1000, // 1 minute - updates more frequently
  });
}

/**
 * Hook to get user's saved challenges
 */
export function useSavedChallenges() {
  return useQuery({
    queryKey: challengeKeys.saved(),
    queryFn: getSavedChallenges,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get saved challenge IDs (for checking if saved)
 */
export function useSavedChallengeIds() {
  return useQuery({
    queryKey: challengeKeys.savedIds(),
    queryFn: getSavedChallengeIds,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to save a challenge
 */
export function useSaveChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveUserChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: challengeKeys.saved() });
      queryClient.invalidateQueries({ queryKey: challengeKeys.savedIds() });
    },
  });
}

/**
 * Hook to unsave a challenge
 */
export function useUnsaveChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unsaveUserChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: challengeKeys.saved() });
      queryClient.invalidateQueries({ queryKey: challengeKeys.savedIds() });
    },
  });
}

/**
 * Hook to create and save a generated challenge
 */
export function useCreateAndSaveChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAndSaveChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: challengeKeys.saved() });
      queryClient.invalidateQueries({ queryKey: challengeKeys.savedIds() });
    },
  });
}

/**
 * Hook to delete a user-generated challenge
 */
export function useDeleteGeneratedChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGeneratedChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: challengeKeys.saved() });
      queryClient.invalidateQueries({ queryKey: challengeKeys.savedIds() });
      queryClient.invalidateQueries({ queryKey: challengeKeys.list() });
    },
  });
}
