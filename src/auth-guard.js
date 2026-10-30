/**
 * Auth Guard
 * 
 * Protects pages that require authentication.
 * Import this at the top of any protected page's script.
 * Redirects to login if no valid session exists.
 */
import { getSession, onAuthStateChange } from './services/auth.js';

const AUTH_PAGES = ['/auth/login.html', '/auth/signup.html', '/auth/forgot-password.html'];
const DASHBOARD_URL = '/index.html';
const LOGIN_URL = '/auth/login.html';

/**
 * Check if current page is an auth page (login, signup, etc.)
 */
function isAuthPage() {
  return AUTH_PAGES.some((page) => window.location.pathname.endsWith(page));
}

/**
 * Initialize auth guard. Call once on page load.
 * - On protected pages: redirects to login if unauthenticated.
 * - On auth pages: redirects to dashboard if already authenticated.
 */
export async function initAuthGuard() {
  const session = await getSession();

  if (!session && !isAuthPage()) {
    // Not authenticated on a protected page → redirect to login
    window.location.href = LOGIN_URL;
    return null;
  }

  if (session && isAuthPage()) {
    // Already authenticated on an auth page → redirect to dashboard
    window.location.href = DASHBOARD_URL;
    return session;
  }

  // Listen for auth state changes (logout, token expiry)
  onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' && !isAuthPage()) {
      window.location.href = LOGIN_URL;
    }
    if (event === 'SIGNED_IN' && isAuthPage()) {
      window.location.href = DASHBOARD_URL;
    }
  });

  return session;
}

