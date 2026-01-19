import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface Hunt {
  id: string;
  title: string;
  description: string | null;
  cover_image: string | null;
  theme: 'city' | 'nature' | 'home' | 'travel' | 'seasonal';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: 'day' | 'week' | 'month';
  total_xp: number;
  is_active: boolean;
  created_at: string;
}

export interface HuntTask {
  id: string;
  hunt_id: string;
  title: string;
  description: string | null;
  order_num: number;
  xp_reward: number;
  hint: string | null;
}

export interface HuntProgress {
  id: string;
  hunt_id: string;
  user_id: string;
  completed_tasks: string[];
  total_xp_earned: number;
  started_at: string;
  completed_at: string | null;
}

/**
 * Get all active hunts
 */
export async function getActiveHunts(): Promise<Hunt[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('hunts')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching hunts:', error);
    return [];
  }

  return data || [];
}

/**
 * Get hunt by ID with tasks
 */
export async function getHuntWithTasks(huntId: string): Promise<{ hunt: Hunt; tasks: HuntTask[] } | null> {
  if (!isSupabaseConfigured) return null;

  const [huntResult, tasksResult] = await Promise.all([
    supabase.from('hunts').select('*').eq('id', huntId).single(),
    supabase.from('hunt_tasks').select('*').eq('hunt_id', huntId).order('order_num'),
  ]);

  if (huntResult.error || !huntResult.data) {
    console.error('Error fetching hunt:', huntResult.error);
    return null;
  }

  return {
    hunt: huntResult.data,
    tasks: tasksResult.data || [],
  };
}

/**
 * Get user's progress for a hunt
 */
export async function getHuntProgress(huntId: string): Promise<HuntProgress | null> {
  if (!isSupabaseConfigured) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('hunt_progress')
    .select('*')
    .eq('hunt_id', huntId)
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = not found
    console.error('Error fetching hunt progress:', error);
  }

  return data;
}

/**
 * Start a hunt
 */
export async function startHunt(huntId: string): Promise<HuntProgress | null> {
  if (!isSupabaseConfigured) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('hunt_progress')
    .insert({
      hunt_id: huntId,
      user_id: user.id,
      completed_tasks: [],
      total_xp_earned: 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Error starting hunt:', error);
    return null;
  }

  return data;
}

/**
 * Complete a hunt task
 */
export async function completeHuntTask(
  huntId: string,
  taskId: string,
  xpReward: number
): Promise<HuntProgress | null> {
  if (!isSupabaseConfigured) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Get current progress
  let progress = await getHuntProgress(huntId);

  // Start hunt if not started
  if (!progress) {
    progress = await startHunt(huntId);
  }

  if (!progress) return null;

  // Check if task already completed
  if (progress.completed_tasks.includes(taskId)) {
    return progress;
  }

  // Update progress
  const { data, error } = await supabase
    .from('hunt_progress')
    .update({
      completed_tasks: [...progress.completed_tasks, taskId],
      total_xp_earned: progress.total_xp_earned + xpReward,
    })
    .eq('id', progress.id)
    .select()
    .single();

  if (error) {
    console.error('Error completing task:', error);
    return null;
  }

  return data;
}

/**
 * Get user's hunt progress list
 */
export async function getUserHuntProgress(): Promise<HuntProgress[]> {
  if (!isSupabaseConfigured) return [];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('hunt_progress')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching hunt progress:', error);
    return [];
  }

  return data || [];
}
