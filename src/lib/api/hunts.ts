import { supabase } from '@/integrations/supabase/client';

const isSupabaseConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

export interface Hunt {
  id: string;
  title: string;
  description: string | null;
  cover_image: string | null;
  theme: string;
  difficulty: string;
  duration: string;
  total_xp: number;
  participants_count: number;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
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
  bonus_xp: number | null;
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
    .from('scavenger_hunts')
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
    supabase.from('scavenger_hunts').select('*').eq('id', huntId).single(),
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
    .maybeSingle();

  if (error) {
    console.error('Error fetching hunt progress:', error);
    return null;
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
  photoId: string
): Promise<HuntProgress | null> {
  if (!isSupabaseConfigured) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    // Get current progress
    const { data: progress } = await supabase
      .from('hunt_progress')
      .select('*')
      .eq('hunt_id', huntId)
      .eq('user_id', user.id)
      .single();

    if (!progress) {
      console.error('Hunt not started');
      return null;
    }

    // Check if already completed
    if (progress.completed_tasks.includes(taskId)) {
      return progress;
    }

    // Get task XP reward
    const { data: task } = await supabase
      .from('hunt_tasks')
      .select('xp_reward')
      .eq('id', taskId)
      .single();

    const xpReward = task?.xp_reward || 20;
    const newCompletedTasks = [...progress.completed_tasks, taskId];
    const newXp = progress.total_xp_earned + xpReward;

    // Update progress
    const { data: updated, error } = await supabase
      .from('hunt_progress')
      .update({
        completed_tasks: newCompletedTasks,
        total_xp_earned: newXp,
      })
      .eq('id', progress.id)
      .select()
      .single();

    if (error) {
      console.error('Error completing hunt task:', error);
      return null;
    }

    // Link photo to hunt task
    await supabase
      .from('photos')
      .update({ hunt_task_id: taskId })
      .eq('id', photoId);

    return updated;
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
