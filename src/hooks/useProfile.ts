import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCurrentProfile,
  updateProfile,
  addXp,
  updateStreak,
  getUserStats,
  getWeeklyActivity,
  getUserBadges,
  getAllBadges,
  getUserBadgeMetrics,
  syncUserBadges,
  getUserPhotosWithChallenges,
  getUserAchievements,
  getLeaderboard,
  getUserRank,
  Profile,
} from '@/lib/api/profiles';

export const profileKeys = {
  all: ['profile'] as const,
  current: () => [...profileKeys.all, 'current'] as const,
  stats: (userId: string) => [...profileKeys.all, 'stats', userId] as const,
  weeklyActivity: () => [...profileKeys.all, 'weeklyActivity'] as const,
  badges: () => [...profileKeys.all, 'badges'] as const,
  allBadges: () => [...profileKeys.all, 'allBadges'] as const,
  badgeMetrics: () => [...profileKeys.all, 'badgeMetrics'] as const,
  photosWithChallenges: () => [...profileKeys.all, 'photosWithChallenges'] as const,
  achievements: () => [...profileKeys.all, 'achievements'] as const,
  leaderboard: () => [...profileKeys.all, 'leaderboard'] as const,
  rank: () => [...profileKeys.all, 'rank'] as const,
};

/**
 * Hook to get current user's profile
 */
export function useCurrentProfile() {
  return useQuery({
    queryKey: profileKeys.current(),
    queryFn: getCurrentProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get user stats
 */
export function useUserStats(userId: string | undefined) {
  return useQuery({
    queryKey: profileKeys.stats(userId || ''),
    queryFn: () => getUserStats(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to update profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<Profile>) => updateProfile(updates),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(profileKeys.current(), data);
      }
    },
  });
}

/**
 * Hook to add XP to user
 */
export function useAddXp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount: number) => addXp(amount),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(profileKeys.current(), data);
        // Also invalidate stats
        queryClient.invalidateQueries({ queryKey: profileKeys.all });
      }
    },
  });
}

/**
 * Hook to update user streak
 */
export function useUpdateStreak() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => updateStreak(),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(profileKeys.current(), data);
        queryClient.invalidateQueries({ queryKey: profileKeys.all });
      }
    },
  });
}

/**
 * Hook to get weekly activity for profile stats
 */
export function useWeeklyActivity() {
  return useQuery({
    queryKey: profileKeys.weeklyActivity(),
    queryFn: getWeeklyActivity,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to get user's earned badges
 */
export function useUserBadges() {
  return useQuery({
    queryKey: profileKeys.badges(),
    queryFn: getUserBadges,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to get all available badges
 */
export function useAllBadges() {
  return useQuery({
    queryKey: profileKeys.allBadges(),
    queryFn: getAllBadges,
    staleTime: 30 * 60 * 1000, // 30 minutes - badges don't change often
  });
}

/**
 * Hook to get badge metrics for progress
 */
export function useBadgeMetrics() {
  return useQuery({
    queryKey: profileKeys.badgeMetrics(),
    queryFn: getUserBadgeMetrics,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to sync badges (award new ones)
 */
export function useSyncBadges() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncUserBadges,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.badges() });
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}

/**
 * Hook to get user photos with challenge info
 */
export function useUserPhotosWithChallenges(limit = 10) {
  return useQuery({
    queryKey: profileKeys.photosWithChallenges(),
    queryFn: () => getUserPhotosWithChallenges(limit),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to get user achievements
 */
export function useUserAchievements() {
  return useQuery({
    queryKey: profileKeys.achievements(),
    queryFn: getUserAchievements,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to get leaderboard
 */
export function useLeaderboard(limit = 10) {
  return useQuery({
    queryKey: profileKeys.leaderboard(),
    queryFn: () => getLeaderboard(limit),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to get user's rank in leaderboard
 */
export function useUserRank() {
  return useQuery({
    queryKey: profileKeys.rank(),
    queryFn: getUserRank,
    staleTime: 5 * 60 * 1000,
  });
}
