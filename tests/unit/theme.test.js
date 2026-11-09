import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { THEME_KEY, initTheme, themeIsDark } from '../../public/src/theme.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const readProjectFile = (relativePath) => readFileSync(join(root, relativePath), 'utf8');

function createClassList() {
    const names = new Set();
    return {
        toggle(name, force) {
            const enabled = force === undefined ? !names.has(name) : Boolean(force);
            if (enabled) names.add(name);
            else names.delete(name);
            return enabled;
        },
        contains(name) {
            return names.has(name);
        },
    };
}

function createStorage(initial) {
    const data = { ...initial };
    return {
        getItem(key) {
            return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null;
        },
        setItem(key, value) {
            data[key] = String(value);
        },
    };
}

function mountTheme({ stored, prefersDark, includeButton = true } = {}) {
    const storage = createStorage(stored == null ? {} : { [THEME_KEY]: stored });
    const html = { classList: createClassList() };
    let onClick = null;
    const documentRef = {
        documentElement: html,
        getElementById(id) {
            if (!includeButton || id !== 'theme-toggle-btn') return null;
            return {
                addEventListener(type, handler) {
                    if (type === 'click') onClick = handler;
                },
            };
        },
    };

    initTheme({ document: documentRef, storage, prefersDark });

    return {
        html,
        storage,
        click() {
            if (!onClick) throw new Error('theme toggle was not bound');
            onClick();
        },
    };
}

function cssRule(css, selector) {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
    return match ? match[1] : '';
}

describe('Theme toggle', () => {
    it('uses a saved choice before the system preference', () => {
        expect(themeIsDark('dark', false)).toBe(true);
        expect(themeIsDark('light', true)).toBe(false);
        expect(themeIsDark(null, true)).toBe(true);
        expect(themeIsDark(null, false)).toBe(false);
    });

    it('starts in the saved theme', () => {
        const dark = mountTheme({ stored: 'dark', prefersDark: false });
        const light = mountTheme({ stored: 'light', prefersDark: true });

        expect(dark.html.classList.contains('dark')).toBe(true);
        expect(light.html.classList.contains('dark')).toBe(false);
    });

    it('follows the system preference when nothing is saved', () => {
        const dark = mountTheme({ prefersDark: true });
        const light = mountTheme({ prefersDark: false });

        expect(dark.html.classList.contains('dark')).toBe(true);
        expect(light.html.classList.contains('dark')).toBe(false);
    });

    it('switches theme and remembers the choice when the button is clicked', () => {
        const page = mountTheme({ stored: 'light', prefersDark: true });

        page.click();
        expect(page.html.classList.contains('dark')).toBe(true);
        expect(page.storage.getItem(THEME_KEY)).toBe('dark');

        page.click();
        expect(page.html.classList.contains('dark')).toBe(false);
        expect(page.storage.getItem(THEME_KEY)).toBe('light');
    });

    it('does nothing when the button is missing', () => {
        expect(() => mountTheme({ includeButton: false, prefersDark: false })).not.toThrow();
    });

    it('keeps a visible light/dark button in the sidebar', () => {
        const html = readProjectFile('public/index.html');
        const css = readProjectFile('public/styles.css');
        const app = readProjectFile('public/app.js');

        expect(html).toContain('id="theme-toggle-btn"');
        expect(html).toContain('Dark mode');
        expect(html).toContain('Light mode');
        expect(app).toContain("import { initTheme } from './src/theme.js'");
        expect(app).toContain('initTheme()');

        expect(cssRule(css, '.sidebar')).toContain('min-height: 0');
        expect(cssRule(css, '.sidebar')).toContain('overflow: hidden');
        expect(cssRule(css, '.side-nav')).toContain('overflow-y: auto');
        expect(cssRule(css, '.theme-toggle')).toContain('flex-shrink: 0');
        expect(cssRule(css, '.focus-card')).toContain('flex-shrink: 0');
        expect(cssRule(css, '.user-profile-card')).toContain('flex-shrink: 0');
        expect(css).toContain('html.dark .dark-hidden');
        expect(css).toContain('html:not(.dark) .light-hidden');
    });
});
