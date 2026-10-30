/**
 * Authentication Service
 * 
 * Supports both live Supabase Auth and Local Preview Mode (when Supabase credentials
 * have not yet been provided by the user).
 */
import { supabase, isConfigured } from '../lib/supabase.js';

const LOCAL_USER_KEY = 'study_companion_local_user';
const LOCAL_SESSION_KEY = 'study_companion_local_session';

/**
 * Sign up a new student account.
 * Uses Supabase Auth if configured, otherwise sets up local preview session.
 * @param {{ email: string, password: string, fullName: string }} params
 */
export async function signUp({ email, password, fullName }) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/verify.html`,
        },
      });
      return { data, error };
    } catch (err) {
      return { data: null, error: { message: err.message || 'Signup failed' } };
    }
  }

  // ---- Local Preview Fallback Mode ----
  const localUser = {
    id: 'local-student-' + Math.random().toString(36).slice(2, 9),
    email,
    user_metadata: { full_name: fullName },
    created_at: new Date().toISOString(),
  };

  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({ ...localUser, password }));
  const session = { user: localUser, access_token: 'local-demo-token' };
  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));

  return {
    data: { user: localUser, session },
    error: null,
  };
}

/**
 * Sign in with email and password.
 * @param {{ email: string, password: string }} params
 */
export async function signIn({ email, password }) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (err) {
      return { data: null, error: { message: err.message || 'Login failed' } };
    }
  }

  // ---- Local Preview Fallback Mode ----
  const stored = localStorage.getItem(LOCAL_USER_KEY);
  let user = null;

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.email.toLowerCase() === email.toLowerCase()) {
        if (parsed.password && parsed.password !== password) {
          return { data: null, error: { message: 'Invalid password. Please try again.' } };
        }
        user = parsed;
      }
    } catch (_) {}
  }

  if (!user) {
    // In local demo, allow login with any valid credentials
    user = {
      id: 'local-student-demo',
      email,
      user_metadata: { full_name: email.split('@')[0] },
      created_at: new Date().toISOString(),
    };
  }

  const session = { user, access_token: 'local-demo-token' };
  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));

  return {
    data: { user, session },
    error: null,
  };
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  localStorage.removeItem(LOCAL_SESSION_KEY);
  if (isConfigured) {
    try {
      await supabase.auth.signOut();
    } catch (_) {}
  }
  window.location.href = window.location.pathname.includes('/auth/') ? 'login.html' : 'auth/login.html';
}

/**
 * Send a password reset email.
 * @param {string} email
 */
export async function resetPassword(email) {
  if (isConfigured) {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password.html`,
    });
  }
  // Local mode simulation
  return { data: {}, error: null };
}

/**
 * Update password.
 * @param {string} newPassword
 */
export async function updatePassword(newPassword) {
  if (isConfigured) {
    return supabase.auth.updateUser({ password: newPassword });
  }

  // Local mode simulation
  const stored = localStorage.getItem(LOCAL_USER_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      parsed.password = newPassword;
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(parsed));
    } catch (_) {}
  }
  return { data: { user: {} }, error: null };
}

/**
 * Resend the confirmation email.
 * @param {string} email
 */
export async function resendVerification(email) {
  if (isConfigured) {
    return supabase.auth.resend({ type: 'signup', email });
  }
  return { data: {}, error: null };
}

/**
 * Get the currently authenticated user.
 */
export async function getCurrentUser() {
  if (isConfigured) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) return user;
    } catch (_) {}
  }

  const local = localStorage.getItem(LOCAL_SESSION_KEY);
  if (local) {
    try {
      return JSON.parse(local).user;
    } catch (_) {}
  }
  return null;
}

/**
 * Get the current session.
 */
export async function getSession() {
  if (isConfigured) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) return session;
    } catch (_) {}
  }

  const local = localStorage.getItem(LOCAL_SESSION_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch (_) {}
  }
  return null;
}

/**
 * Listen for auth state changes.
 * @param {(event: string, session: object|null) => void} callback
 */
export function onAuthStateChange(callback) {
  if (isConfigured) {
    return supabase.auth.onAuthStateChange(callback);
  }
  return { data: { subscription: { unsubscribe: () => {} } } };
}
