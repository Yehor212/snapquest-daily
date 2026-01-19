import { useQuery } from '@tanstack/react-query';
import {
  getDailyChallenge,
  getAllChallenges,
  getChallengesByCategory,
  getTodayCompletionsCount,
  Challenge
} from '@/lib/api/challenges';

export const challengeKeys = {
  all: ['challenges'] as const,
  daily: () => [...challengeKeys.all, 'daily'] as const,
  list: () => [...challengeKeys.all, 'list'] as const,
  byCategory: (category: string) => [...challengeKeys.all, 'category', category] as const,
  todayCount: () => [...challengeKeys.all, 'todayCount'] as const,
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
