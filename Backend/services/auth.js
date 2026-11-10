/**
 * Authentication Service — Smart Study Companion
 * 
 * Supports both live Supabase Auth and Local Preview Mode (when Supabase credentials
 * have not yet been provided by the user).
 */
import { supabase, isConfigured } from '../lib/supabase.js';

const LOCAL_USER_KEY = 'study_companion_local_user';
const LOCAL_SESSION_KEY = 'study_companion_local_session';
const LOCAL_OTP_KEY = 'study_companion_recovery_otp';

/**
 * Helper to compute the correct base URL for auth redirects.
 * Automatically handles GitHub Pages repo subdirectories and local environments.
 */
function getAuthBaseUrl() {
  if (typeof window === 'undefined' || !window.location) {
    return 'https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public';
  }
  const href = window.location.href;
  const authIdx = href.indexOf('/auth/');
  if (authIdx !== -1) {
    return href.substring(0, authIdx);
  }
  const publicIdx = href.indexOf('/public');
  if (publicIdx !== -1) {
    return href.substring(0, publicIdx + '/public'.length);
  }
  if (href.includes('github.io/Team-5-Capstone-Design')) {
    return `${window.location.origin}/Team-5-Capstone-Design/public`;
  }
  return window.location.origin;
}

/**
 * Sign up a new student account.
 * Uses Supabase Auth if configured, otherwise sets up local preview session.
 * @param {{ email: string, password: string, fullName: string, country?: string, university?: string }} params
 */
export async function signUp({ email, password, fullName, country = '', university = '' }) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, country, university, onboarding_completed: false },
          emailRedirectTo: `${getAuthBaseUrl()}/auth/login.html?registered=true`,
        },
      });
      if (error) {
        return { data: null, error };
      }

      // Check if Supabase auto-created a session (e.g. if email confirmation is turned off)
      const hadAutoSession = Boolean(data?.session);
      const isConfirmed = Boolean(data?.user?.confirmed_at || data?.user?.email_confirmed_at || hadAutoSession);

      // CRITICAL FOR PROBLEM 1:
      // If the authentication provider automatically creates a session during signup,
      // terminate that session immediately so the user must perform the required explicit login.
      if (hadAutoSession) {
        try {
          await supabase.auth.signOut();
        } catch (_) {}
      }

      return {
        data: {
          user: data.user,
          session: null, // Always require explicit login
          emailConfirmed: isConfirmed,
        },
        error: null,
      };
    } catch (err) {
      return { data: null, error: { message: err.message || 'Signup failed' } };
    }
  }

  // ---- Local Preview Fallback Mode ----
  const localUser = {
    id: 'local-student-' + Math.random().toString(36).slice(2, 9),
    email,
    user_metadata: { full_name: fullName, country, university, onboarding_completed: false },
    created_at: new Date().toISOString(),
  };

  // Save registered user credential for subsequent explicit login
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({ ...localUser, password }));
  // CRITICAL: Do NOT create LOCAL_SESSION_KEY here! User must explicitly log in via login page.
  localStorage.removeItem(LOCAL_SESSION_KEY);

  return {
    data: { user: localUser, session: null, emailConfirmed: true },
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
    return { data: null, error: { message: 'No registered account found with this email. Please sign up first.' } };
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
 * Send a real password reset email with 6-digit OTP code or recovery link.
 * @param {string} email
 */
export async function resetPassword(email) {
  if (isConfigured) {
    try {
      return await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getAuthBaseUrl()}/auth/reset-password.html`,
      });
    } catch (err) {
      return { data: null, error: { message: err.message || 'Failed to send recovery instructions.' } };
    }
  }

  // Demonstration/sample codes are strictly prohibited.
  // Real email delivery requires live Supabase Auth credentials and SMTP.
  return {
    data: null,
    error: {
      message: 'Supabase Auth is not configured. Real password recovery email requires setting VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env and configuring custom SMTP in your Supabase dashboard.',
      code: 'AUTH_UNCONFIGURED',
    },
  };
}

/**
 * Verify real OTP (e.g. 6-digit code for password recovery or signup confirmation).
 * @param {{ email: string, token: string, type?: 'recovery' | 'signup' | 'email' }} params
 */
export async function verifyOtp({ email, token, type = 'recovery' }) {
  if (isConfigured) {
    try {
      const cleanToken = (token || '').toString().trim().replace(/\D/g, '');
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: cleanToken,
        type,
      });
      return { data, error };
    } catch (err) {
      return { data: null, error: { message: err.message || 'OTP verification failed' } };
    }
  }

  // Demonstration codes are not accepted. Real verification requires live Supabase Auth.
  return {
    data: null,
    error: {
      message: 'Authentication provider is not configured. Real 6-digit verification code check requires live Supabase credentials.',
      code: 'AUTH_UNCONFIGURED',
    },
  };
}

/**
 * Resend password recovery email with 6-digit PIN.
 * @param {string} email
 */
export async function resendPasswordReset(email) {
  return resetPassword(email);
}

/**
 * Update password for authenticated or OTP-verified user.
 * @param {string} newPassword
 */
export async function updatePassword(newPassword) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      // Terminate the temporary recovery session so the user must log in with their new credentials
      if (!error) {
        try {
          await supabase.auth.signOut();
        } catch (_) {}
      }
      return { data, error };
    } catch (err) {
      return { data: null, error: { message: err.message || 'Password update failed' } };
    }
  }

  return {
    data: null,
    error: {
      message: 'Cannot update password without valid recovery authorization from the authentication provider.',
      code: 'AUTH_UNCONFIGURED',
    },
  };
}

/**
 * Resend the confirmation email.
 * @param {string} email
 */
export async function resendVerification(email) {
  if (isConfigured) {
    return supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${getAuthBaseUrl()}/auth/login.html?registered=true`,
      },
    });
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
