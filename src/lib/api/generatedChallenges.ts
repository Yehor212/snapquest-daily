import { supabase } from '@/integrations/supabase/client';

const isSupabaseConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

export interface GeneratedChallenge {
  id: string;
  user_id: string | null;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  xp_reward: number;
  is_saved: boolean;
  generated_at: string;
}

export interface SavedChallengeWithDetails {
  id: string;
  user_id: string;
  challenge_id: string;
  saved_at: string;
  challenge: GeneratedChallenge;
}

/**
 * Create a user-generated challenge
 */
export async function createGeneratedChallenge(
  challenge: {
    title: string;
    description?: string;
    category?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    xp_reward?: number;
  }
): Promise<GeneratedChallenge | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('generated_challenges')
      .insert({
        title: challenge.title,
        description: challenge.description || '',
        category: challenge.category || 'nature',
        difficulty: challenge.difficulty || 'medium',
        xp_reward: challenge.xp_reward || 50,
        user_id: user?.id || null,
        is_saved: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating challenge:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.warn('Network error creating challenge:', error);
    return null;
  }
}

/**
 * Save a challenge (add to user's saved list)
 */
export async function saveUserChallenge(challengeId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('user_saved_challenges')
      .insert({
        user_id: user.id,
        challenge_id: challengeId,
      });

    if (error) {
      if (error.code === '23505') return true; // already saved
      console.error('Error saving challenge:', error);
      return false;
    }

    // Mark as saved
    await supabase
      .from('generated_challenges')
      .update({ is_saved: true })
      .eq('id', challengeId);

    return true;
  } catch (error) {
    console.warn('Network error saving challenge:', error);
    return false;
  }
}

/**
 * Unsave a challenge (remove from user's saved list)
 */
export async function unsaveUserChallenge(challengeId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('user_saved_challenges')
      .delete()
      .eq('user_id', user.id)
      .eq('challenge_id', challengeId);

    if (error) {
      console.error('Error unsaving challenge:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.warn('Network error unsaving challenge:', error);
    return false;
  }
}

/**
 * Get user's saved challenges
 */
export async function getSavedChallenges(): Promise<GeneratedChallenge[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('user_saved_challenges')
      .select(`
        challenge_id,
        saved_at,
        generated_challenges (*)
      `)
      .eq('user_id', user.id)
      .order('saved_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved challenges:', error);
      return [];
    }

    // Extract challenge data from joined result
    return (data || [])
      .map((item: any) => item.generated_challenges)
      .filter(Boolean) as GeneratedChallenge[];
  } catch (error) {
    console.warn('Network error fetching saved challenges:', error);
    return [];
  }
}

/**
 * Check if a challenge is saved by current user
 */
export async function isChallengeSaved(challengeId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
      .from('user_saved_challenges')
      .select('id')
      .eq('user_id', user.id)
      .eq('challenge_id', challengeId)
      .maybeSingle();

    return !!data;
  } catch {
    return false;
  }
}

/**
 * Get saved challenge IDs for current user (for batch checking)
 */
export async function getSavedChallengeIds(): Promise<Set<string>> {
  if (!isSupabaseConfigured) return new Set();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Set();

    const { data, error } = await supabase
      .from('user_saved_challenges')
      .select('challenge_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching saved challenge IDs:', error);
      return new Set();
    }

    return new Set((data || []).map(item => item.challenge_id));
  } catch (error) {
    console.warn('Network error fetching saved challenge IDs:', error);
    return new Set();
  }
}

/**
 * Create and save a challenge in one operation
 */
export async function createAndSaveChallenge(
  challenge: {
    title: string;
    description?: string;
    category?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    xp_reward?: number;
  }
): Promise<GeneratedChallenge | null> {
  const created = await createGeneratedChallenge(challenge);
  if (created) {
    await saveUserChallenge(created.id);
  }
  return created;
}

/**
 * Delete a user-created challenge
 */
export async function deleteGeneratedChallenge(challengeId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('generated_challenges')
      .delete()
      .eq('id', challengeId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting challenge:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.warn('Network error deleting challenge:', error);
    return false;
  }
}
