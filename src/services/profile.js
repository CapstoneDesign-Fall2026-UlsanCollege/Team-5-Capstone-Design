/**
 * Profile Service — Smart Study Companion
 * 
 * Supports both live Supabase profiles table and local session profiles.
 */
import { supabase, isConfigured } from '../lib/supabase.js';

export async function getProfile(userId) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  // Local mode fallback
  const session = localStorage.getItem('study_companion_local_session');
  if (session) {
    try {
      const parsed = JSON.parse(session);
      return {
        data: {
          id: userId,
          full_name: parsed.user?.user_metadata?.full_name || 'Student',
          country: parsed.user?.user_metadata?.country || '',
          university: parsed.user?.user_metadata?.university || '',
          faculty: parsed.user?.user_metadata?.faculty || '',
          major: parsed.user?.user_metadata?.major || '',
          onboarding_completed: Boolean(parsed.user?.user_metadata?.onboarding_completed),
          created_at: new Date().toISOString(),
        },
        error: null,
      };
    } catch (_) {}
  }
  return { data: { id: userId, full_name: 'Student', onboarding_completed: false }, error: null };
}

export async function upsertProfile(profile) {
  if (isConfigured) {
    return supabase
      .from('profiles')
      .upsert(profile, { onConflict: 'id' })
      .select()
      .single();
  }
  const session = localStorage.getItem('study_companion_local_session');
  if (session) {
    try {
      const parsed = JSON.parse(session);
      parsed.user.user_metadata = {
        ...(parsed.user.user_metadata || {}),
        full_name: profile.full_name || parsed.user.user_metadata?.full_name || 'Student',
        country: profile.country !== undefined ? profile.country : (parsed.user.user_metadata?.country || ''),
        university: profile.university !== undefined ? profile.university : (parsed.user.user_metadata?.university || ''),
        faculty: profile.faculty !== undefined ? profile.faculty : (parsed.user.user_metadata?.faculty || ''),
        major: profile.major !== undefined ? profile.major : (parsed.user.user_metadata?.major || ''),
        onboarding_completed: profile.onboarding_completed !== undefined ? profile.onboarding_completed : Boolean(parsed.user.user_metadata?.onboarding_completed)
      };
      localStorage.setItem('study_companion_local_session', JSON.stringify(parsed));
    } catch (_) {}
  }
  return { data: profile, error: null };
}

export async function updateDisplayName(userId, fullName) {
  if (isConfigured) {
    return supabase
      .from('profiles')
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
  }

  // Update local session
  const session = localStorage.getItem('study_companion_local_session');
  if (session) {
    try {
      const parsed = JSON.parse(session);
      parsed.user.user_metadata = parsed.user.user_metadata || {};
      parsed.user.user_metadata.full_name = fullName;
      localStorage.setItem('study_companion_local_session', JSON.stringify(parsed));
    } catch (_) {}
  }
  return { data: { id: userId, full_name: fullName }, error: null };
}
