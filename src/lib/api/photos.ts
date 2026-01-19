import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface Photo {
  id: string;
  user_id: string;
  image_url: string;
  thumbnail_url: string | null;
  challenge_id: string | null;
  event_id: string | null;
  hunt_id: string | null;
  hunt_task_id: string | null;
  event_challenge_id: string | null;
  filter_applied: string | null;
  likes_count: number;
  created_at: string;
}

export interface PhotoWithProfile extends Photo {
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
}

/**
 * Upload a photo to Supabase Storage
 */
export async function uploadPhoto(
  file: File,
  options?: {
    challengeId?: string;
    eventId?: string;
    eventChallengeId?: string;
    huntId?: string;
    huntTaskId?: string;
    filter?: string;
  }
): Promise<Photo | null> {
  if (!isSupabaseConfigured) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from('photos')
    .upload(fileName, file);

  if (uploadError) {
    console.error('Error uploading photo:', uploadError);
    return null;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('photos')
    .getPublicUrl(fileName);

  // Create photo record
  const { data, error } = await supabase
    .from('photos')
    .insert({
      user_id: user.id,
      image_url: publicUrl,
      challenge_id: options?.challengeId || null,
      event_id: options?.eventId || null,
      event_challenge_id: options?.eventChallengeId || null,
      hunt_id: options?.huntId || null,
      hunt_task_id: options?.huntTaskId || null,
      filter_applied: options?.filter || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating photo record:', error);
    return null;
  }

  return data;
}

/**
 * Get user's photos
 */
export async function getUserPhotos(userId?: string): Promise<Photo[]> {
  if (!isSupabaseConfigured) return [];

  let query = supabase
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  } else {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    query = query.eq('user_id', user.id);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching photos:', error);
    return [];
  }

  return data || [];
}

/**
 * Get all public photos (feed) with profile info
 */
export async function getPhotoFeed(limit = 20, offset = 0): Promise<PhotoWithProfile[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('photos')
    .select(`
      *,
      profiles:user_id (
        username,
        display_name,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching photo feed:', error);
    return [];
  }

  // Map to PhotoWithProfile
  return (data || []).map(photo => {
    const profile = photo.profiles as any;
    return {
      ...photo,
      username: profile?.username || null,
      display_name: profile?.display_name || null,
      avatar_url: profile?.avatar_url || null,
      profiles: undefined, // Remove nested object
    };
  });
}

/**
 * Like a photo
 */
export async function likePhoto(photoId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('photo_likes')
    .insert({ photo_id: photoId, user_id: user.id });

  if (error && error.code !== '23505') { // 23505 = unique violation (already liked)
    console.error('Error liking photo:', error);
    return false;
  }

  return true;
}

/**
 * Unlike a photo
 */
export async function unlikePhoto(photoId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('photo_likes')
    .delete()
    .eq('photo_id', photoId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error unliking photo:', error);
    return false;
  }

  return true;
}

/**
 * Check if user liked a photo
 */
export async function hasUserLikedPhoto(photoId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from('photo_likes')
    .select('id')
    .eq('photo_id', photoId)
    .eq('user_id', user.id)
    .maybeSingle();

  return !!data;
}

/**
 * Delete a photo
 */
export async function deletePhoto(photoId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', photoId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting photo:', error);
    return false;
  }

  return true;
}
