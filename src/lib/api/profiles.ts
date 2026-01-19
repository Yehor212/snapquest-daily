import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Profile interface matches DB schema (snake_case: xp, streak)
export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  xp: number;
  level: number;
  streak: number;
  longest_streak: number;
  created_at: string;
  updated_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  requirement_type: string;
  requirement_value: number;
}

/**
 * Ensure profile exists for user (upsert)
 */
export async function ensureProfile(userId: string, email?: string): Promise<Profile | null> {
  if (!isSupabaseConfigured) return null;

  // Try to get existing profile
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (existing) return existing;

  // Create new profile
  const username = email?.split('@')[0] || `user_${userId.slice(0, 8)}`;
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      username,
      display_name: username,
      xp: 0,
      level: 1,
      streak: 0,
      longest_streak: 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    return null;
  }

  return data;
}

/**
 * Get current user's profile
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  // Profile doesn't exist - create it
  if (!data) {
    return ensureProfile(user.id, user.email || undefined);
  }

  return data;
}

/**
 * Update current user's profile
 */
export async function updateProfile(updates: Partial<Profile>): Promise<Profile | null> {
  if (!isSupabaseConfigured) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }

  return data;
}

/**
 * Add XP to user using atomic RPC
 */
export async function addXp(amount: number): Promise<Profile | null> {
  if (!isSupabaseConfigured) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Use atomic RPC to add XP
  const { error } = await supabase.rpc('add_user_xp', {
    user_uuid: user.id,
    xp_amount: amount,
  });

  if (error) {
    console.error('Error adding XP via RPC:', error);
    return null;
  }

  // Return updated profile
  return getCurrentProfile();
}

/**
 * Update user streak using atomic RPC
 */
export async function updateStreak(): Promise<Profile | null> {
  if (!isSupabaseConfigured) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Use atomic RPC to update streak
  const { error } = await supabase.rpc('update_user_streak', {
    user_uuid: user.id,
  });

  if (error) {
    console.error('Error updating streak via RPC:', error);
    return null;
  }

  // Return updated profile
  return getCurrentProfile();
}

export interface UserStats {
  profile: Profile | null;
  photosCount: number;
  badgesCount: number;
  badges: UserBadge[];
}

/**
 * Get user stats
 */
export async function getUserStats(userId: string): Promise<UserStats | null> {
  if (!isSupabaseConfigured) return null;

  const [profileResult, photosResult, badgesResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase.from('photos').select('id', { count: 'exact' }).eq('user_id', userId),
    supabase.from('user_badges').select('*, badge:badges(*)').eq('user_id', userId),
  ]);

  return {
    profile: profileResult.data,
    photosCount: photosResult.count || 0,
    badgesCount: badgesResult.data?.length || 0,
    badges: badgesResult.data || [],
  };
}

export interface WeeklyActivity {
  day: string;
  date: string;
  completed: boolean;
  xp: number;
}

/**
 * Get weekly activity for current user
 */
export async function getWeeklyActivity(): Promise<WeeklyActivity[]> {
  if (!isSupabaseConfigured) return getEmptyWeekActivity();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return getEmptyWeekActivity();

  // Get start of current week (Monday)
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);

  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const weekActivity: WeeklyActivity[] = [];

  // Fetch photos for this week with real xp_earned
  const { data: photos } = await supabase
    .from('photos')
    .select('created_at, xp_earned')
    .eq('user_id', user.id)
    .gte('created_at', monday.toISOString())
    .order('created_at', { ascending: true });

  // Create activity map by date using real XP values
  const activityMap = new Map<string, number>();
  (photos || []).forEach(photo => {
    const date = new Date(photo.created_at).toISOString().split('T')[0];
    // Use real xp_earned, fallback to 50 for legacy photos without xp_earned
    const xp = photo.xp_earned || 50;
    activityMap.set(date, (activityMap.get(date) || 0) + xp);
  });

  // Build week data
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const xp = activityMap.get(dateStr) || 0;

    weekActivity.push({
      day: days[i],
      date: dateStr,
      completed: xp > 0,
      xp,
    });
  }

  return weekActivity;
}

function getEmptyWeekActivity(): WeeklyActivity[] {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  return days.map((day, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return {
      day,
      date: date.toISOString().split('T')[0],
      completed: false,
      xp: 0,
    };
  });
}

/**
 * Get user's badges
 */
export async function getUserBadges(): Promise<UserBadge[]> {
  if (!isSupabaseConfigured) return [];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('user_badges')
    .select(`
      *,
      badge:badges(*)
    `)
    .eq('user_id', user.id)
    .order('earned_at', { ascending: false });

  if (error) {
    console.error('Error fetching user badges:', error);
    return [];
  }

  return data || [];
}

/**
 * Get all available badges
 */
export async function getAllBadges(): Promise<Badge[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .order('requirement_value', { ascending: true });

  if (error) {
    console.error('Error fetching badges:', error);
    return [];
  }

  return data || [];
}

export interface PhotoWithChallenge {
  id: string;
  image_url: string;
  thumbnail_url: string | null;
  created_at: string;
  likes_count: number;
  challenge_id: string | null;
  challenge_title: string | null;
  xp_earned: number;
}

/**
 * Get user photos with challenge info
 */
export async function getUserPhotosWithChallenges(limit = 10): Promise<PhotoWithChallenge[]> {
  if (!isSupabaseConfigured) return [];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('photos')
    .select(`
      id,
      image_url,
      thumbnail_url,
      created_at,
      likes_count,
      xp_earned,
      challenge_id,
      challenges(title)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching user photos:', error);
    return [];
  }

  return (data || []).map(photo => ({
    id: photo.id,
    image_url: photo.image_url,
    thumbnail_url: photo.thumbnail_url,
    created_at: photo.created_at,
    likes_count: photo.likes_count,
    challenge_id: photo.challenge_id,
    challenge_title: (photo.challenges as any)?.title || null,
    xp_earned: photo.xp_earned || 50, // Fallback for legacy photos
  }));
}

export interface UserAchievements {
  longestStreak: number;
  totalPhotos: number;
  totalLikes: number;
  topPhotosCount: number;
  favoriteTheme: string | null;
  favoriteThemeCount: number;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  xp: number;
}

/**
 * Get weekly leaderboard (top users by XP)
 */
export async function getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, xp')
    .order('xp', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  return (data || []).map((user, index) => ({
    rank: index + 1,
    id: user.id,
    username: user.username,
    display_name: user.display_name,
    avatar_url: user.avatar_url,
    xp: user.xp,
  }));
}

/**
 * Get user's rank in leaderboard
 */
export async function getUserRank(): Promise<number | null> {
  if (!isSupabaseConfigured) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('xp')
    .eq('id', user.id)
    .single();

  if (!profile) return null;

  // Count users with more XP
  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gt('xp', profile.xp);

  return (count || 0) + 1;
}

/**
 * Get user achievements data
 */
export async function getUserAchievements(): Promise<UserAchievements | null> {
  if (!isSupabaseConfigured) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Get profile for streak
  const { data: profile } = await supabase
    .from('profiles')
    .select('longest_streak')
    .eq('id', user.id)
    .single();

  // Get photos stats
  const { data: photos } = await supabase
    .from('photos')
    .select('likes_count, challenge_id, challenges(title)')
    .eq('user_id', user.id);

  const totalPhotos = photos?.length || 0;
  const totalLikes = photos?.reduce((sum, p) => sum + (p.likes_count || 0), 0) || 0;
  const topPhotosCount = photos?.filter(p => (p.likes_count || 0) >= 10).length || 0;

  // Find favorite theme
  const themeCount = new Map<string, number>();
  photos?.forEach(p => {
    const title = (p.challenges as any)?.title;
    if (title) {
      themeCount.set(title, (themeCount.get(title) || 0) + 1);
    }
  });

  let favoriteTheme: string | null = null;
  let favoriteThemeCount = 0;
  themeCount.forEach((count, theme) => {
    if (count > favoriteThemeCount) {
      favoriteTheme = theme;
      favoriteThemeCount = count;
    }
  });

  return {
    longestStreak: profile?.longest_streak || 0,
    totalPhotos,
    totalLikes,
    topPhotosCount,
    favoriteTheme,
    favoriteThemeCount,
  };
}
