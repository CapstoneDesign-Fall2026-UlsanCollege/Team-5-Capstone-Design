/**
 * Study Goals Service — persists the daily task-completion goal in Supabase.
 * The server re-validates (1-20) and derives the student from the session (auth.uid()).
 */
import { supabase } from '../lib/supabase.js';
import { validateDailyGoal } from '../lib/study-logic.js';
import { isCloudStudent } from './study-streak.js';

export async function saveDailyGoal(studentId, input) {
  const checked = validateDailyGoal(input);
  if (!checked.ok) return { data: null, error: { message: checked.error } };
  if (!isCloudStudent(studentId)) {
    return { data: null, error: { message: 'Sign in with a cloud account to save a daily goal.' } };
  }
  try {
    const { error } = await supabase.rpc('set_daily_study_goal', { p_goal: checked.value });
    if (error) return { data: null, error };
    return { data: checked.value, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}
