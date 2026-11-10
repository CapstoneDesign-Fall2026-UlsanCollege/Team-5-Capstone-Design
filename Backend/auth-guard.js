/**
 * Auth Guard
 * 
 * Protects pages that require authentication.
 * Import this at the top of any protected page's script.
 * Redirects to login if no valid session exists.
 */
import { getSession, onAuthStateChange } from './services/auth.js';

const AUTH_PAGES = ['/auth/login.html', '/auth/signup.html', '/auth/forgot-password.html', '/auth/reset-password.html', '/auth/verify.html'];

function getBasePath() {
  const path = window.location.pathname;
  const authIdx = path.indexOf('/auth/');
  if (authIdx !== -1) {
    return path.slice(0, authIdx);
  }
  const publicIdx = path.indexOf('/public');
  if (publicIdx !== -1) {
    return path.slice(0, publicIdx + '/public'.length);
  }
  return '';
}

function getDashboardUrl() {
  return `${getBasePath()}/index.html`;
}

function getLoginUrl() {
  return `${getBasePath()}/auth/login.html`;
}

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
  const dashboardUrl = getDashboardUrl();
  const loginUrl = getLoginUrl();

  if (!session && !isAuthPage()) {
    // Not authenticated on a protected page → redirect to login
    window.location.href = loginUrl;
    return null;
  }

  if (session && isAuthPage() && !window.location.pathname.includes('reset-password')) {
    // Already authenticated on an auth page → redirect to dashboard
    window.location.href = dashboardUrl;
    return session;
  }

  // Listen for auth state changes (logout, token expiry)
  onAuthStateChange((event, _session) => {
    if (event === 'SIGNED_OUT' && !isAuthPage()) {
      window.location.href = loginUrl;
    }
    if (event === 'SIGNED_IN' && isAuthPage() && !window.location.pathname.includes('reset-password')) {
      window.location.href = dashboardUrl;
    }
  });

  return session;
}

