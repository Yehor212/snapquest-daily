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
  task_count?: number;
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
 * Get all active hunts with task counts
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

  if (!data || data.length === 0) return [];

  // Fetch task counts for all hunts
  const huntIds = data.map(h => h.id);
  const { data: tasks } = await supabase
    .from('hunt_tasks')
    .select('hunt_id')
    .in('hunt_id', huntIds);

  // Count tasks per hunt
  const taskCounts: Record<string, number> = {};
  (tasks || []).forEach(t => {
    taskCounts[t.hunt_id] = (taskCounts[t.hunt_id] || 0) + 1;
  });

  // Add task_count to hunts
  return data.map(hunt => ({
    ...hunt,
    task_count: taskCounts[hunt.id] || 0,
  }));
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
 * Complete a hunt task using the RPC function
 * This atomically updates progress, links photo, and adds XP
 */
export async function completeHuntTask(
  huntId: string,
  taskId: string,
  photoId: string
): Promise<HuntProgress | null> {
  if (!isSupabaseConfigured) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    // Call the RPC function for atomic operation
    const { error } = await supabase.rpc('complete_hunt_task', {
      p_hunt_id: huntId,
      p_task_id: taskId,
      p_photo_id: photoId,
    });

    if (error) {
      // Check if task was already completed
      if (error.message?.includes('already completed')) {
        return getHuntProgress(huntId);
      }
      console.error('Error completing hunt task:', error);
      return null;
    }

    // Return updated progress
    return getHuntProgress(huntId);
  } catch (error) {
    console.error('Error in completeHuntTask:', error);
    return null;
  }
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
