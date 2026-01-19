import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@/types';
import { getUser, saveUser, updateUserXp, updateUserStreak } from '@/lib/storage';
import { mockCurrentUser } from '@/data/mockData';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (username?: string) => void;
  logout: () => void;
  addXp: (amount: number) => void;
  incrementStreak: () => void;
  incrementPhotosCount: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Загружаем пользователя из localStorage или создаём нового
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
    } else {
      // Для демо используем mock пользователя
      saveUser(mockCurrentUser);
      setUser(mockCurrentUser);
    }
    setIsLoading(false);
  }, []);

  const login = (username?: string) => {
    const newUser: User = {
      ...mockCurrentUser,
      id: `user-${Date.now()}`,
      username: username || mockCurrentUser.username,
      displayName: username || mockCurrentUser.displayName,
      xp: 0,
      level: 1,
      streak: 0,
      photosCount: 0,
      badgesCount: 0,
      createdAt: new Date().toISOString(),
    };
    saveUser(newUser);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('snapquest_user');
    setUser(null);
  };

  const addXp = (amount: number) => {
    const updatedUser = updateUserXp(amount);
    if (updatedUser) {
      setUser({ ...updatedUser });
    }
  };

  const incrementStreak = () => {
    const updatedUser = updateUserStreak();
    if (updatedUser) {
      setUser({ ...updatedUser });
    }
  };

  const incrementPhotosCount = () => {
    if (user) {
      const updatedUser = { ...user, photosCount: user.photosCount + 1 };
      saveUser(updatedUser);
      setUser(updatedUser);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        addXp,
        incrementStreak,
        incrementPhotosCount,
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
