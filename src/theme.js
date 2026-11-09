/**
 * Light / dark theme toggle.
 * The button lives in the sidebar. The choice is stored in localStorage.
 */
export const THEME_KEY = 'smart_study_theme';

export function themeIsDark(stored, prefersDark) {
    return stored ? stored === 'dark' : Boolean(prefersDark);
}

export function initTheme(options = {}) {
    const documentRef = options.document || globalThis.document;
    const storage = options.storage || globalThis.localStorage;
    const prefersDark = options.prefersDark ??
        globalThis.matchMedia('(prefers-color-scheme: dark)').matches;

    const html = documentRef.documentElement;
    const stored = storage.getItem(THEME_KEY);
    html.classList.toggle('dark', themeIsDark(stored, prefersDark));

    const themeBtn = documentRef.getElementById('theme-toggle-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            html.classList.toggle('dark');
            storage.setItem(THEME_KEY, html.classList.contains('dark') ? 'dark' : 'light');
        });
    }
}
