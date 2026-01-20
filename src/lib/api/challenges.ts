import { supabase } from '@/integrations/supabase/client';

const isSupabaseConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

export interface Challenge {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: string;
  xp_reward: number;
  day_number: number | null;
  participants_count: number;
  created_at: string;
  expires_at: string | null;
}

/**
 * Get today's daily challenge
 */
export async function getDailyChallenge(): Promise<Challenge | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching daily challenge:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.warn('Network error fetching daily challenge:', error);
    return null;
  }
}

/**
 * Get all challenges
 */
export async function getAllChallenges(): Promise<Challenge[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('day_number', { ascending: true });

    if (error) {
      console.error('Error fetching challenges:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.warn('Network error fetching challenges:', error);
    return [];
  }
}

/**
 * Get challenges by category
 */
export async function getChallengesByCategory(category: string): Promise<Challenge[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('category', category);

    if (error) {
      console.error('Error fetching challenges:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.warn('Network error fetching challenges by category:', error);
    return [];
  }
}

/**
 * Get completed challenges count for today
 */
export async function getTodayCompletionsCount(): Promise<number> {
  if (!isSupabaseConfigured) return 0;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from('photos')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())
      .not('challenge_id', 'is', null);

    return count || 0;
  } catch (error) {
    console.warn('Network error fetching today completions:', error);
    return 0;
  }
}
