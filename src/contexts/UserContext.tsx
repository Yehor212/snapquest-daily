import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuthContext } from './AuthContext';
import { useCurrentProfile, useAddXp } from '@/hooks/useProfile';
import { updateStreak as apiUpdateStreak } from '@/lib/api/profiles';
import { useQueryClient } from '@tanstack/react-query';

interface UserContextType {
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
    xp: number;
    level: number;
    streak: number;
    longestStreak: number;
    photosCount: number;
    badgesCount: number;
  } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  addXp: (amount: number) => Promise<void>;
  incrementStreak: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user: authUser, loading: authLoading, isAuthenticated } = useAuthContext();
  const { data: profile, isLoading: profileLoading } = useCurrentProfile();
  const addXpMutation = useAddXp();
  const queryClient = useQueryClient();

  const isLoading = authLoading || (isAuthenticated && profileLoading);

  // Map Supabase profile to local user format
  const user = profile ? {
    id: profile.id,
    username: profile.username || 'user',
    displayName: profile.display_name || profile.username || 'Пользователь',
    avatar: profile.avatar_url,
    xp: profile.xp,
    level: profile.level,
    streak: profile.streak,
    longestStreak: profile.streak, // Use streak as longest for now
    photosCount: 0,
    badgesCount: 0,
  } : null;

  const addXp = async (amount: number) => {
    if (!isAuthenticated) return;
    await addXpMutation.mutateAsync(amount);
  };

  const incrementStreak = async () => {
    if (!isAuthenticated) return;
    await apiUpdateStreak();
    queryClient.invalidateQueries({ queryKey: ['profile'] });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        addXp,
        incrementStreak,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
