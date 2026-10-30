/**
 * Authentication Service
 * 
 * Wraps Supabase Auth for login, signup, password recovery, email verification,
 * session management and logout.
 */
import { supabase } from '../lib/supabase.js';

/**
 * Sign up a new student account.
 * Supabase sends a confirmation email automatically.
 * @param {{ email: string, password: string, fullName: string }} params
 * @returns {Promise<{ data: object|null, error: object|null }>}
 */
export async function signUp({ email, password, fullName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${window.location.origin}/auth/verify.html`,
    },
  });
  return { data, error };
}

/**
 * Sign in with email and password.
 * @param {{ email: string, password: string }} params
 * @returns {Promise<{ data: object|null, error: object|null }>}
 */
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Sign out error:', error.message);
  window.location.href = '/auth/login.html';
}

/**
 * Send a password reset email.
 * @param {string} email
 */
export async function resetPassword(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password.html`,
  });
  return { data, error };
}

/**
 * Update password (used on the reset-password page after following the email link).
 * @param {string} newPassword
 */
export async function updatePassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { data, error };
}

/**
 * Resend the confirmation email.
 * @param {string} email
 */
export async function resendVerification(email) {
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });
  return { data, error };
}

/**
 * Get the currently authenticated user (from the session).
 * @returns {Promise<import('@supabase/supabase-js').User|null>}
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Get the current session.
 * @returns {Promise<import('@supabase/supabase-js').Session|null>}
 */
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Listen for auth state changes (login, logout, token refresh).
 * @param {(event: string, session: object|null) => void} callback
 * @returns {{ data: { subscription: object } }}
 */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}

