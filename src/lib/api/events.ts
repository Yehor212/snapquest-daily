import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface Event {
  id: string;
  name: string;
  description: string | null;
  access_code: string;
  creator_id: string;
  event_type: 'wedding' | 'party' | 'teambuilding' | 'birthday' | 'other';
  cover_image: string | null;
  start_date: string | null;
  end_date: string | null;
  status: 'draft' | 'active' | 'completed' | 'archived';
  created_at: string;
}

export interface EventChallenge {
  id: string;
  event_id: string;
  title: string;
  description: string | null;
  order_num: number;
  xp_reward: number;
}

export interface EventParticipant {
  id: string;
  event_id: string;
  user_id: string;
  joined_at: string;
}

/**
 * Generate unique access code
 */
function generateAccessCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Create a new event
 */
export async function createEvent(
  name: string,
  eventType: Event['event_type'],
  description?: string,
  challenges?: { title: string; description?: string }[]
): Promise<Event | null> {
  if (!isSupabaseConfigured) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const accessCode = generateAccessCode();

  const { data: event, error } = await supabase
    .from('events')
    .insert({
      name,
      description,
      access_code: accessCode,
      creator_id: user.id,
      event_type: eventType,
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    return null;
  }

  // Add creator as participant
  await supabase
    .from('event_participants')
    .insert({ event_id: event.id, user_id: user.id });

  // Add challenges if provided
  if (challenges && challenges.length > 0) {
    const challengeRecords = challenges.map((c, index) => ({
      event_id: event.id,
      title: c.title,
      description: c.description,
      order_num: index,
      xp_reward: 30,
    }));

    await supabase.from('event_challenges').insert(challengeRecords);
  }

  return event;
}

/**
 * Get user's events (created + participating)
 */
export async function getUserEvents(): Promise<Event[]> {
  if (!isSupabaseConfigured) return [];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Get events where user is creator or participant
  const { data: participations } = await supabase
    .from('event_participants')
    .select('event_id')
    .eq('user_id', user.id);

  const eventIds = participations?.map(p => p.event_id) || [];

  if (eventIds.length === 0) {
    // Just get created events
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false });
    return data || [];
  }

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .in('id', eventIds)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  return data || [];
}

/**
 * Get event by ID with challenges and participants
 */
export async function getEventDetails(eventId: string) {
  if (!isSupabaseConfigured) return null;

  const [eventResult, challengesResult, participantsResult, photosResult] = await Promise.all([
    supabase.from('events').select('*').eq('id', eventId).single(),
    supabase.from('event_challenges').select('*').eq('event_id', eventId).order('order_num'),
    supabase.from('event_participants').select('*, profiles(*)').eq('event_id', eventId),
    supabase.from('photos').select('*').eq('event_id', eventId).order('created_at', { ascending: false }),
  ]);

  if (eventResult.error || !eventResult.data) {
    console.error('Error fetching event:', eventResult.error);
    return null;
  }

  return {
    event: eventResult.data as Event,
    challenges: challengesResult.data || [],
    participants: participantsResult.data || [],
    photos: photosResult.data || [],
  };
}

/**
 * Join event by access code
 */
export async function joinEventByCode(code: string): Promise<Event | null> {
  if (!isSupabaseConfigured) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Find event
  const { data: event, error: findError } = await supabase
    .from('events')
    .select('*')
    .eq('access_code', code.toUpperCase())
    .eq('status', 'active')
    .single();

  if (findError || !event) {
    console.error('Event not found:', findError);
    return null;
  }

  // Add participant
  const { error: joinError } = await supabase
    .from('event_participants')
    .insert({ event_id: event.id, user_id: user.id });

  if (joinError && joinError.code !== '23505') { // Already joined is ok
    console.error('Error joining event:', joinError);
    return null;
  }

  return event;
}

/**
 * Leave event
 */
export async function leaveEvent(eventId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('event_participants')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error leaving event:', error);
    return false;
  }

  return true;
}

/**
 * Get participants count for an event
 */
export async function getEventParticipantsCount(eventId: string): Promise<number> {
  if (!isSupabaseConfigured) return 0;

  const { count } = await supabase
    .from('event_participants')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId);

  return count || 0;
}
