/**
 * Profile Service
 * 
 * CRUD operations for the profiles table. Each profile is linked to
 * a Supabase Auth user via the same UUID.
 */
import { supabase } from '../lib/supabase.js';

/**
 * Get the profile for the authenticated user.
 * @param {string} userId
 * @returns {Promise<{ data: object|null, error: object|null }>}
 */
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

/**
 * Create or update the profile (upsert).
 * Called after signup when the profiles trigger may not yet have fired.
 * @param {{ id: string, full_name: string }} profile
 */
export async function upsertProfile(profile) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'id' })
    .select()
    .single();
  return { data, error };
}

/**
 * Update display name.
 * @param {string} userId
 * @param {string} fullName
 */
export async function updateDisplayName(userId, fullName) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ full_name: fullName, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
}

