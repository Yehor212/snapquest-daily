import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  uploadPhoto,
  getUserPhotos,
  getPhotoFeed,
  likePhoto,
  unlikePhoto,
  hasUserLikedPhoto,
  deletePhoto,
  getGlobalStats,
  Photo,
} from '@/lib/api/photos';

export const photoKeys = {
  all: ['photos'] as const,
  user: (userId?: string) => [...photoKeys.all, 'user', userId] as const,
  feed: (limit: number, offset: number) => [...photoKeys.all, 'feed', limit, offset] as const,
  liked: (photoId: string) => [...photoKeys.all, 'liked', photoId] as const,
};

/**
 * Hook to get user's photos
 */
export function useUserPhotos(userId?: string) {
  return useQuery({
    queryKey: photoKeys.user(userId),
    queryFn: () => getUserPhotos(userId),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to get photo feed
 */
export function usePhotoFeed(limit = 20, offset = 0) {
  return useQuery({
    queryKey: photoKeys.feed(limit, offset),
    queryFn: () => getPhotoFeed(limit, offset),
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to check if user liked a photo
 */
export function useHasUserLikedPhoto(photoId: string) {
  return useQuery({
    queryKey: photoKeys.liked(photoId),
    queryFn: () => hasUserLikedPhoto(photoId),
    enabled: !!photoId,
  });
}

/**
 * Hook to upload a photo
 */
export function useUploadPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      options,
    }: {
      file: File;
      options?: {
        challengeId?: string;
        eventId?: string;
        eventChallengeId?: string;
        huntId?: string;
        huntTaskId?: string;
        filter?: string;
        xpEarned?: number;
      };
    }) => uploadPhoto(file, options),
    onSuccess: () => {
      // Invalidate user photos and feed
      queryClient.invalidateQueries({ queryKey: photoKeys.all });
      // Invalidate profile to update stats
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

/**
 * Hook to like a photo
 */
export function useLikePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (photoId: string) => likePhoto(photoId),
    onSuccess: (_, photoId) => {
      queryClient.setQueryData(photoKeys.liked(photoId), true);
      queryClient.invalidateQueries({ queryKey: photoKeys.all });
    },
  });
}

/**
 * Hook to unlike a photo
 */
export function useUnlikePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (photoId: string) => unlikePhoto(photoId),
    onSuccess: (_, photoId) => {
      queryClient.setQueryData(photoKeys.liked(photoId), false);
      queryClient.invalidateQueries({ queryKey: photoKeys.all });
    },
  });
}

/**
 * Hook to delete a photo
 */
export function useDeletePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (photoId: string) => deletePhoto(photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: photoKeys.all });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

/**
 * Hook to get global stats for home page
 */
export function useGlobalStats() {
  return useQuery({
    queryKey: ['globalStats'],
    queryFn: getGlobalStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
