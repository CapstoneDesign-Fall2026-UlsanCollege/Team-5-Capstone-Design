/**
 * Smart Study Companion — Application Core (ES Module)
 * 
 * Backed by Supabase PostgreSQL and Supabase Auth.
 * Features:
 * - Direct authentication persistence and onboarding detection
 * - Multi-tier Academic Hierarchy: Country -> University -> Faculty -> Major -> Subjects
 * - Scrollable multi-select subject catalog with search & category filters
 * - Live study task analytics: Total, Completed, Pending, Overdue, Rate, 7-day weekly activity chart, subject-wise progress bars, upcoming deadlines
 * - Standard 15-question and 10-question / 30-sec Rapid quiz with 75 seeded questions
 * - Light / Dark mode persistence
 */

import { supabase } from './src/lib/supabase.js';
import {
    getCurrentUser,
    getSession,
    signOut,
    updatePassword,
    onAuthStateChange
} from './src/services/auth.js';
import { getProfile, updateDisplayName, upsertProfile } from './src/services/profile.js';
import {
    getTasks,
    createTask as apiCreateTask,
    updateTask as apiUpdateTask,
    toggleTask as apiToggleTask,
    deleteTask as apiDeleteTask
} from './src/services/tasks.js';
import {
    getDefaultSubjects,
    getAllSubjects,
    getUniversitiesCatalog,
    getStudentSubjects,
    saveStudentSubjects
} from './src/services/subjects.js';
import { getQuizQuestions, saveQuizAttempt, getQuizHistory } from './src/services/quiz.js';
import { generateAiQuiz, saveAiQuizAttempt, getAiQuizHistory } from './src/services/ai-quiz.js';
import { initTheme } from './src/theme.js';
import {
    getCountries,
    getUniversities,
    getFaculties,
    getMajors,
    getSubjectsForMajor,
    MAJOR_SUBJECT_MAP,
    SUBJECTS_CATALOG,
    QUIZ_BANK,
    searchSubjects
} from './src/lib/academic-catalog.js';

// ---- Constants ----
const THEME_KEY = 'smart_study_theme';

// ---- State ----
let currentUser = null;
let currentProfile = null;
let dbSubjects = [];
let dbUniversitiesByCountry = {};
let quizHistory = [];
let selectedEnrolledSlugs = new Set(['programming', 'data-structures', 'databases']);
let tasks = [];
let currentView = 'dashboard';
let currentFilter = 'all';
let currentSubjectTab = 'all';
let searchQuery = '';
let subjectSearchQuery = '';
let subjectCategoryFilter = 'all';
let subjectScope = 'major';
let pendingDelete = null;
let quiz = { subject: '', mode: 'standard', questions: [], index: 0, answers: [], timeLeft: 30, deadline: 0, finished: false };
let quizTimer = null;

// ---- Utilities ----
function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function getSubjectColors(subject) {
    const palettes = [
        { color: '#0f766e' }, { color: '#b45309' }, { color: '#1d4ed8' },
        { color: '#9f1239' }, { color: '#6d28d9' }, { color: '#0e7490' }
    ];
    let hash = 0;
    const str = String(subject || 'General');
    for (let i = 0; i < str.length; i += 1) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return palettes[Math.abs(hash) % palettes.length];
}

function formatDate(dateString) {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    if (date.toDateString() === new Date().toDateString()) {
        return `Today, ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function relativeDeadline(dateString, completed) {
    if (completed) return 'Done';
    const mins = Math.round((new Date(dateString) - Date.now()) / 60000);
    if (mins < -1440) return `${Math.abs(Math.round(mins / 1440))}d overdue`;
    if (mins < -60) return `${Math.abs(Math.round(mins / 60))}h overdue`;
    if (mins < 0) return `${Math.abs(mins)}m overdue`;
    if (mins < 60) return `in ${Math.max(mins, 0)}m`;
    if (mins < 1440) return `in ${Math.round(mins / 60)}h`;
    return `in ${Math.round(mins / 1440)}d`;
}

function formatForInput(dateString) {
    const d = new Date(dateString);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function dateInputValue(daysAhead = 1) {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return date.toISOString().slice(0, 10);
}

function toast(message) {
    const stack = document.getElementById('toast-stack') || document.body;
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    stack.appendChild(el);
    setTimeout(() => el.remove(), 2600);
}

function burst(x, y) {
    const layer = document.getElementById('burst-layer');
    if (!layer) return;
    for (let i = 0; i < 12; i += 1) {
        const spark = document.createElement('span');
        spark.className = 'spark';
        const angle = (i / 12) * Math.PI * 2;
        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;
        spark.style.background = i % 2 ? '#2dd4bf' : '#fbbf24';
        spark.style.setProperty('--dx', `${Math.cos(angle) * 56}px`);
        spark.style.setProperty('--dy', `${Math.sin(angle) * 56}px`);
        layer.appendChild(spark);
        setTimeout(() => spark.remove(), 700);
    }
}

// ---- Subject & Task Lookups ----
function getSubjectId(name) {
    if (!name) return null;
    const target = name.toLowerCase();
    const direct = dbSubjects.find(s => (s.name || '').toLowerCase() === target);
    if (direct) return direct.id;
    const cat = SUBJECTS_CATALOG.find(s => s.name.toLowerCase() === target);
    if (cat) {
        const bySlug = dbSubjects.find(s => s.slug === cat.slug);
        if (bySlug) return bySlug.id;
    }
    return null;
}

function getSubjectName(id) {
    const found = dbSubjects.find(s => s.id === id) || SUBJECTS_CATALOG.find(s => s.id === id || s.slug === id);
    return found ? found.name : 'General';
}

function subjectNames() {
    // Return names of active enrolled subjects or default list
    const enrolled = Array.from(selectedEnrolledSlugs).map(slug => {
        const sub = SUBJECTS_CATALOG.find(s => s.slug === slug);
        return sub ? sub.name : slug;
    });
    if (enrolled.length > 0) return enrolled.sort((a, b) => a.localeCompare(b));
    if (dbSubjects.length > 0) return dbSubjects.map(s => s.name).sort((a, b) => a.localeCompare(b));
    return SUBJECTS_CATALOG.map(s => s.name).sort((a, b) => a.localeCompare(b));
}

function fillSubjectSelects() {
    const names = subjectNames();
    const options = names.length
        ? names.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('')
        : '<option value="General">General</option>';
    
    const taskSubject = document.getElementById('task-subject');
    if (taskSubject) taskSubject.innerHTML = options;

    const quickSelect = document.getElementById('create-task-subject-select');
    if (quickSelect) quickSelect.innerHTML = options;

    fillQuizSubjects();
}

function fillQuizSubjects() {
    const quizSubjectEl = document.getElementById('quiz-subject');
    if (!quizSubjectEl) return;

    const currentMajor = document.getElementById('academic-major')?.value || currentProfile?.major || '';
    const currentUni = document.getElementById('academic-university')?.value || currentProfile?.university || '';
    const prevSelected = quizSubjectEl.value;

    let html = '';

    // Group 1: Enrolled Subjects
    const enrolledList = Array.from(selectedEnrolledSlugs).map(slug => {
        return SUBJECTS_CATALOG.find(s => s.slug === slug) || { slug, name: slug };
    }).sort((a, b) => a.name.localeCompare(b.name));

    if (enrolledList.length > 0) {
        html += `<optgroup label="My Enrolled Subjects (${enrolledList.length})">` +
            enrolledList.map(s => `<option value="${escapeHtml(s.slug)}">${escapeHtml(s.name)}</option>`).join('') +
            `</optgroup>`;
    }

    // Group 2: Subjects for Current Major
    if (currentMajor && MAJOR_SUBJECT_MAP[currentMajor]) {
        const majorSubjects = getSubjectsForMajor(currentMajor);
        const nonEnrolledMajor = majorSubjects.filter(s => !selectedEnrolledSlugs.has(s.slug));
        if (nonEnrolledMajor.length > 0) {
            html += `<optgroup label="Curriculum for ${escapeHtml(currentMajor)}">` +
                nonEnrolledMajor.map(s => `<option value="${escapeHtml(s.slug)}">${escapeHtml(s.name)}${s.isCore ? ' (Core)' : ''}</option>`).join('') +
                `</optgroup>`;
        }
    }

    // Group 3: All Other Catalog Subjects
    const otherSubjects = SUBJECTS_CATALOG.filter(s => {
        const isEnrolled = selectedEnrolledSlugs.has(s.slug);
        const isMajor = currentMajor && MAJOR_SUBJECT_MAP[currentMajor] &&
            ([...(MAJOR_SUBJECT_MAP[currentMajor].core || []), ...(MAJOR_SUBJECT_MAP[currentMajor].electives || [])]).includes(s.slug);
        return !isEnrolled && !isMajor;
    }).sort((a, b) => a.name.localeCompare(b.name));

    if (otherSubjects.length > 0) {
        html += `<optgroup label="All Other University Subjects">` +
            otherSubjects.map(s => `<option value="${escapeHtml(s.slug)}">${escapeHtml(s.name)}</option>`).join('') +
            `</optgroup>`;
    }

    quizSubjectEl.innerHTML = html;

    if (prevSelected && Array.from(quizSubjectEl.options).some(o => o.value === prevSelected)) {
        quizSubjectEl.value = prevSelected;
    } else if (quizSubjectEl.options.length > 0) {
        quizSubjectEl.selectedIndex = 0;
    }

    const quizAiSubjectEl = document.getElementById('quiz-ai-subject');
    if (quizAiSubjectEl) {
        quizAiSubjectEl.innerHTML = html;
        if (prevSelected && Array.from(quizAiSubjectEl.options).some(o => o.value === prevSelected)) {
            quizAiSubjectEl.value = prevSelected;
        } else if (quizAiSubjectEl.options.length > 0) {
            quizAiSubjectEl.selectedIndex = 0;
        }
    }

    // Update Quiz Header text to show university & major!
    const headingEl = document.getElementById('quiz-main-heading');
    const subHeadingEl = document.getElementById('quiz-sub-heading');
    if (headingEl) {
        headingEl.textContent = currentMajor ? `Practice Quiz · ${currentMajor}` : 'Choose your study subject';
    }
    if (subHeadingEl) {
        const uniText = currentUni ? ` at ${currentUni}` : '';
        const majorText = currentMajor ? `for ${currentMajor}${uniText}` : 'for your enrolled courses';
        subHeadingEl.textContent = `Practice questions tailored ${majorText}. Standard quizzes have 15 questions; rapid quizzes have 10 questions and a 30-second limit.`;
    }
}

// ---- Data Synchronization with Supabase ----
async function loadUserData() {
    try {
        let session = await getSession();
        if (!session) {
            const hasAuthError = window.location.search.includes('error=') || window.location.hash.includes('error=');
            if (hasAuthError) {
                window.location.href = 'auth/login.html' + (window.location.search || '') + (window.location.hash || '');
                return;
            }
            const hasAuthToken = window.location.search.includes('code=') || window.location.hash.includes('access_token=');
            if (hasAuthToken) {
                session = await new Promise((resolve) => {
                    const timer = setTimeout(() => resolve(null), 3000);
                    const { data: sub } = onAuthStateChange((_event, s) => {
                        if (s) {
                            clearTimeout(timer);
                            sub?.subscription?.unsubscribe();
                            resolve(s);
                        }
                    });
                });
            }
        }
        if (!session) {
            window.location.href = 'auth/login.html';
            return;
        }

        currentUser = session.user;

        // Display loading state in subject picker
        const scrollContainer = document.getElementById('subject-scroll-container');
        if (scrollContainer && selectedEnrolledSlugs.size === 0) {
            scrollContainer.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; padding: 36px; text-align: center;">
                    <i class="fa-solid fa-spinner fa-spin" style="font-size: 1.8rem; color: var(--amber);" aria-hidden="true"></i>
                    <p style="margin-top: 10px; font-weight: 500;">Loading academic catalog &amp; curriculum...</p>
                </div>
            `;
        }

        // Load student profile
        const { data: profile } = await getProfile(currentUser.id);
        currentProfile = profile;
        renderUserProfile();

        // Check if student completed onboarding
        if (!currentProfile?.onboarding_completed && location.hash !== '#quiz') {
            // First time student: show subjects & hierarchy selection
            showView('subjects');
        }

        // Load academic catalog before tasks/subjects so UUID lookups succeed
        const [{ data: subjectsData }, { data: universitiesData }] = await Promise.all([
            getAllSubjects(),
            getUniversitiesCatalog()
        ]);
        if (subjectsData && subjectsData.length > 0) {
            dbSubjects = subjectsData;
        } else {
            dbSubjects = SUBJECTS_CATALOG;
        }
        if (universitiesData && typeof universitiesData === 'object' && !Array.isArray(universitiesData)) {
            dbUniversitiesByCountry = universitiesData;
        } else if (Array.isArray(universitiesData)) {
            const grouped = {};
            universitiesData.forEach((u) => {
                if (u?.country && u?.name) {
                    if (!grouped[u.country]) grouped[u.country] = [];
                    if (!grouped[u.country].includes(u.name)) grouped[u.country].push(u.name);
                }
            });
            dbUniversitiesByCountry = grouped;
        }

        // Load student enrolled subjects
        const { data: enrolled, error: enrolledError } = await getStudentSubjects(currentUser.id);
        if (enrolledError) {
            console.warn('Could not load student subjects:', enrolledError.message);
        } else if (enrolled && enrolled.length > 0) {
            selectedEnrolledSlugs.clear();
            enrolled.forEach(s => {
                const slug = s.slug || (s.subject ? s.subject.slug : null) || (s.name ? s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : null);
                if (slug) selectedEnrolledSlugs.add(slug);
            });
        } else if (currentProfile?.onboarding_completed) {
            selectedEnrolledSlugs.clear();
        }

        // Load student tasks
        const { data: tasksData, error: tasksError } = await getTasks(currentUser.id);
        if (tasksError) {
            console.warn('Could not load cloud tasks:', tasksError.message);
        } else if (tasksData) {
            tasks = tasksData.map(t => ({
                id: t.id,
                subject: t.subject ? t.subject.name : (getSubjectName(t.subject_id) || 'General'),
                subject_id: t.subject_id,
                name: t.title,
                deadline: t.deadline,
                completed: t.completed
            }));
        }

        initAcademicHierarchy();
        await loadAndRenderQuizHistory();
        render();
    } catch (err) {
        console.error('Failed to load user data:', err);
    }
}

function renderUserProfile() {
    const nameEl = document.getElementById('user-display-name');
    const emailEl = document.getElementById('user-display-email');
    const avatarEl = document.getElementById('user-avatar');

    const fullName = currentProfile?.full_name || currentUser?.user_metadata?.full_name || 'Student';
    const email = currentUser?.email || 'student@university.edu';

    if (nameEl) nameEl.textContent = fullName;
    if (emailEl) emailEl.textContent = email;
    if (avatarEl) {
        const initials = fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'S';
        avatarEl.textContent = initials;
    }

    const modalEmail = document.getElementById('profile-email-input');
    const modalName = document.getElementById('profile-name-input');
    if (modalEmail) modalEmail.value = email;
    if (modalName) modalName.value = fullName;
}

// ---- View Navigation ----
function showView(view) {
    if (view === 'create' || view === 'onboarding') view = 'subjects';
    if (view === 'plan') view = 'tasks';
    if (!['dashboard', 'tasks', 'subjects', 'analytics', 'quiz'].includes(view)) {
        view = 'dashboard';
    }

    currentView = view;

    // Show/hide view canvases
    ['dashboard', 'tasks', 'subjects', 'analytics', 'quiz'].forEach((name) => {
        const el = document.getElementById(`view-${name}`);
        if (el) el.hidden = (name !== view);
    });

    // Update nav links
    document.querySelectorAll('.nav-link[data-view]').forEach((link) => {
        const linkView = link.dataset.view;
        const isActive = (linkView === view) ||
                         (linkView === 'create' && view === 'subjects') ||
                         (linkView === 'plan' && view === 'tasks');
        link.classList.toggle('is-active', isActive);
    });

    const titles = {
        dashboard: 'Student Dashboard',
        tasks: 'Study Task Tracker',
        subjects: 'Subjects & University Onboarding',
        analytics: 'Study Task Analytics & Workload Breakdown',
        quiz: 'Quiz Practice & Results'
    };
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = titles[view] || 'Dashboard';

    const searchWrap = document.getElementById('search-wrap');
    if (searchWrap) searchWrap.hidden = (view !== 'tasks' && view !== 'dashboard');

    const addTaskBtn = document.getElementById('add-task-btn');
    if (addTaskBtn) addTaskBtn.hidden = (view === 'quiz');

    const goPlanBtn = document.getElementById('go-plan-btn');
    if (goPlanBtn) {
        if (view === 'dashboard') {
            goPlanBtn.hidden = false;
            goPlanBtn.textContent = 'Task Tracker';
            goPlanBtn.onclick = () => showView('tasks');
        } else if (view === 'tasks') {
            goPlanBtn.hidden = false;
            goPlanBtn.textContent = 'Dashboard';
            goPlanBtn.onclick = () => showView('dashboard');
        } else {
            goPlanBtn.hidden = true;
        }
    }

    if (location.hash !== `#${view}`) {
        location.hash = view;
    }

    if (view === 'quiz') {
        fillQuizSubjects();
    } else if (view === 'subjects') {
        renderSubjectCategoryChips();
        renderScrollableSubjects();
    }

    render();
}

function nextPendingTask() {
    return tasks.filter((task) => !task.completed).sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];
}

function visibleTasks() {
    const query = searchQuery.trim().toLowerCase();
    return tasks.filter((task) => {
        if (currentFilter === 'pending' && task.completed) return false;
        if (currentFilter === 'completed' && !task.completed) return false;
        if (currentFilter === 'overdue' && (task.completed || new Date(task.deadline) >= new Date())) return false;
        if (currentSubjectTab !== 'all' && task.subject !== currentSubjectTab) return false;
        if (query && !`${task.subject} ${task.name}`.toLowerCase().includes(query)) return false;
        return true;
    }).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
}

// ---- Academic Hierarchy & Subject Selection ----
let hierarchyListenersAttached = false;

function getCombinedCountries() {
    const merged = [...getCountries()];
    Object.keys(dbUniversitiesByCountry).forEach((country) => {
        if (country && !merged.includes(country)) merged.push(country);
    });
    return merged;
}

function getCombinedUniversities(country) {
    if (!country) return [];
    const base = [...getUniversities(country)];
    const fromDb = Array.isArray(dbUniversitiesByCountry[country]) ? dbUniversitiesByCountry[country] : [];
    fromDb.forEach((name) => {
        if (name && !base.includes(name)) base.push(name);
    });
    return base;
}

function initAcademicHierarchy() {
    const countryEl = document.getElementById('academic-country');
    const uniEl = document.getElementById('academic-university');
    const facEl = document.getElementById('academic-faculty');
    const majorEl = document.getElementById('academic-major');
    if (!countryEl || !uniEl) return;

    const prevCountry = countryEl.value;
    const prevUni = uniEl.value;
    const prevFac = facEl ? facEl.value : '';
    const prevMajor = majorEl ? majorEl.value : '';

    // Populate countries (combining live Supabase catalog & fallback)
    const countries = getCombinedCountries();
    countryEl.innerHTML = '<option value="">Select country...</option>' +
        countries.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');

    // Populate faculties
    if (facEl) {
        const faculties = getFaculties();
        facEl.innerHTML = '<option value="">Select faculty...</option>' +
            faculties.map(f => `<option value="${escapeHtml(f)}">${escapeHtml(f)}</option>`).join('');
    }

    const updateUniversities = (preferredUni = '') => {
        const country = countryEl.value;
        const universities = getCombinedUniversities(country);
        uniEl.innerHTML = '<option value="">Select university...</option>' +
            universities.map(u => `<option value="${escapeHtml(u)}">${escapeHtml(u)}</option>`).join('');
        if (preferredUni && universities.includes(preferredUni)) {
            uniEl.value = preferredUni;
        }
    };

    const updateMajors = (preferredMajor = '') => {
        if (!facEl || !majorEl) return;
        const faculty = facEl.value;
        const majors = getMajors(faculty);
        majorEl.innerHTML = '<option value="">Select major...</option>' +
            majors.map(m => `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join('');
        if (preferredMajor && majors.includes(preferredMajor)) {
            majorEl.value = preferredMajor;
        }
    };

    if (!hierarchyListenersAttached) {
        countryEl.addEventListener('change', () => {
            // Country changed: reset university and lower dependent selections
            updateUniversities('');
            if (facEl) facEl.value = '';
            if (majorEl) {
                majorEl.innerHTML = '<option value="">Select major...</option>';
                majorEl.value = '';
            }
            selectedEnrolledSlugs.clear();
            onAcademicHierarchyChange(false);
        });
        uniEl.addEventListener('change', () => {
            if (!uniEl.value) {
                if (facEl) facEl.value = '';
                if (majorEl) {
                    majorEl.innerHTML = '<option value="">Select major...</option>';
                    majorEl.value = '';
                }
                selectedEnrolledSlugs.clear();
            }
            onAcademicHierarchyChange(false);
        });
        if (facEl) {
            facEl.addEventListener('change', () => {
                // Faculty changed: update majors list and reset major selection
                updateMajors('');
                selectedEnrolledSlugs.clear();
                onAcademicHierarchyChange(true);
            });
        }
        if (majorEl) {
            majorEl.addEventListener('change', () => {
                onAcademicHierarchyChange(true);
            });
        }
        hierarchyListenersAttached = true;
    }

    // Prefill from current selection or loaded profile
    const targetCountry = prevCountry || currentProfile?.country || '';
    const targetUni = prevUni || currentProfile?.university || '';
    const targetFac = prevFac || currentProfile?.faculty || '';
    const targetMajor = prevMajor || currentProfile?.major || '';

    if (targetCountry) {
        countryEl.value = targetCountry;
        updateUniversities(targetUni);
    }
    if (targetFac && facEl) {
        facEl.value = targetFac;
        updateMajors(targetMajor);
    }

    onAcademicHierarchyChange(false);
}

function onAcademicHierarchyChange(autoEnroll = true) {
    const country = document.getElementById('academic-country')?.value || '';
    const university = document.getElementById('academic-university')?.value || '';
    const faculty = document.getElementById('academic-faculty')?.value || '';
    const major = document.getElementById('academic-major')?.value || '';

    if (currentProfile) {
        currentProfile.country = country;
        currentProfile.university = university;
        currentProfile.faculty = faculty;
        currentProfile.major = major;
    }

    if (autoEnroll && major && MAJOR_SUBJECT_MAP[major]) {
        const majorCore = MAJOR_SUBJECT_MAP[major].core || [];
        const hasOverlap = Array.from(selectedEnrolledSlugs).some(s => majorCore.includes(s));
        // Auto-enroll in the core subjects if empty or only had default demo slugs
        if (selectedEnrolledSlugs.size === 0 || (!hasOverlap && selectedEnrolledSlugs.size <= 3)) {
            selectedEnrolledSlugs.clear();
            majorCore.forEach(s => selectedEnrolledSlugs.add(s));
        }
        subjectCategoryFilter = 'major';
    }

    renderSubjectCategoryChips();
    renderScrollableSubjects();
    fillSubjectSelects();
    fillQuizSubjects();
}

function renderSubjectCategoryChips() {
    const catContainer = document.getElementById('subject-category-chips');
    if (!catContainer) return;

    const major = document.getElementById('academic-major')?.value || currentProfile?.major || '';
    let chips = [];

    if (major && MAJOR_SUBJECT_MAP[major]) {
        chips.push({ id: 'major', label: `★ Curriculum: ${major.split(' ')[0]}` });
        chips.push({ id: 'core', label: 'Core Courses' });
        chips.push({ id: 'electives', label: 'Electives' });
    }

    chips.push({ id: 'all', label: 'All Subjects' });
    chips.push({ id: 'Core CS', label: 'Core CS' });
    chips.push({ id: 'Software Dev', label: 'Software Dev' });
    chips.push({ id: 'Engineering', label: 'Engineering' });
    chips.push({ id: 'Business', label: 'Business' });
    chips.push({ id: 'Intelligence', label: 'AI & Data' });
    chips.push({ id: 'Mathematics', label: 'Mathematics' });
    chips.push({ id: 'Science', label: 'Science' });
    chips.push({ id: 'Projects', label: 'Projects' });

    const validIds = new Set(chips.map(c => c.id));
    if (!validIds.has(subjectCategoryFilter)) {
        subjectCategoryFilter = (major && MAJOR_SUBJECT_MAP[major]) ? 'major' : 'all';
    }

    catContainer.innerHTML = chips.map(c => `
        <button type="button" class="subject-category-chip ${subjectCategoryFilter === c.id ? 'is-active' : ''}" data-cat="${escapeHtml(c.id)}">
            ${escapeHtml(c.label)}
        </button>
    `).join('');
}

function renderScrollableSubjects() {
    const container = document.getElementById('subject-scroll-container');
    if (!container) return;

    const major = document.getElementById('academic-major')?.value || currentProfile?.major || '';
    const university = document.getElementById('academic-university')?.value || currentProfile?.university || '';

    // Notice banner for active major curriculum
    const bannerEl = document.getElementById('curriculum-banner');
    if (bannerEl) {
        if (major && MAJOR_SUBJECT_MAP[major]) {
            const majorInfo = MAJOR_SUBJECT_MAP[major];
            bannerEl.hidden = false;
            bannerEl.innerHTML = `
                <div>
                    <i class="fa-solid fa-graduation-cap"></i>
                    <span>Curriculum for <strong>${escapeHtml(major)}</strong>${university ? ` at ${escapeHtml(university)}` : ''} (${majorInfo.core.length} Core, ${majorInfo.electives.length} Electives)</span>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button type="button" class="btn-ghost" id="select-major-core-btn">
                        <i class="fa-solid fa-check-double"></i> Select All Core
                    </button>
                </div>
            `;
            const coreBtn = document.getElementById('select-major-core-btn');
            if (coreBtn) {
                coreBtn.onclick = () => {
                    majorInfo.core.forEach(s => selectedEnrolledSlugs.add(s));
                    renderScrollableSubjects();
                    fillSubjectSelects();
                    toast(`Enrolled in all ${majorInfo.core.length} core subjects for ${major}`);
                };
            }
        } else {
            bannerEl.hidden = true;
        }
    }

    const filtered = searchSubjects(subjectSearchQuery, subjectCategoryFilter, major, subjectScope);

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; padding: 24px; text-align: center;">
                <p class="muted">No subjects match "${escapeHtml(subjectSearchQuery)}" with filter "${escapeHtml(subjectCategoryFilter)}". Try selecting "All Subjects" or clearing your search.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(subject => {
        const isSelected = selectedEnrolledSlugs.has(subject.slug);
        return `
            <article class="scrollable-subject-card ${isSelected ? 'is-selected' : ''}" data-subject-slug="${escapeHtml(subject.slug)}" tabindex="0" role="checkbox" aria-checked="${isSelected}">
                <div class="card-top-row">
                    <span class="card-icon"><i class="fa-solid ${subject.icon}"></i></span>
                    <div style="display: flex; gap: 4px; align-items: center; flex-wrap: wrap;">
                        ${subject.isCore ? '<span class="card-badge core-badge"><i class="fa-solid fa-star"></i> Core</span>' : ''}
                        ${subject.isElective ? '<span class="card-badge elective-badge">Elective</span>' : ''}
                        <span class="card-badge">${escapeHtml(subject.category || 'Core')}</span>
                    </div>
                    <div class="card-checkbox" aria-hidden="true">
                        ${isSelected ? '<i class="fa-solid fa-check"></i>' : ''}
                    </div>
                </div>
                <h4>${escapeHtml(subject.name)}</h4>
                <p>${escapeHtml(subject.description)}</p>
            </article>
        `;
    }).join('');

    updateSelectedSubjectsBadge();
}

function updateSelectedSubjectsBadge() {
    const countEl = document.getElementById('selected-subjects-count');
    const labelEl = document.getElementById('selected-subjects-label');
    if (!countEl) return;
    const count = selectedEnrolledSlugs.size;
    countEl.textContent = count;
    if (labelEl) {
        labelEl.textContent = count === 1 ? 'subject selected' : 'subjects selected';
    }
}

async function saveAcademicProfileAndSubjects() {
    if (!currentUser) return;

    const country = document.getElementById('academic-country')?.value || currentProfile?.country || '';
    const university = document.getElementById('academic-university')?.value || currentProfile?.university || '';
    const faculty = document.getElementById('academic-faculty')?.value || currentProfile?.faculty || '';
    const major = document.getElementById('academic-major')?.value || currentProfile?.major || '';

    // Enforce valid academic hierarchy selection
    if (!country) {
        toast('Please select your country or region.');
        document.getElementById('academic-country')?.focus();
        return;
    }
    if (!university) {
        toast('Please select your university or college.');
        document.getElementById('academic-university')?.focus();
        return;
    }
    const validUniversities = getCombinedUniversities(country);
    if (validUniversities.length > 0 && !validUniversities.includes(university)) {
        toast('Selected university does not belong to the chosen country. Please re-select.');
        document.getElementById('academic-university')?.focus();
        return;
    }
    if (!faculty) {
        toast('Please select your faculty or school.');
        document.getElementById('academic-faculty')?.focus();
        return;
    }
    if (!major) {
        toast('Please select your department or major.');
        document.getElementById('academic-major')?.focus();
        return;
    }
    const validMajors = getMajors(faculty);
    if (validMajors.length > 0 && !validMajors.includes(major)) {
        toast('Selected major does not belong to the chosen faculty. Please re-select your major.');
        document.getElementById('academic-major')?.focus();
        return;
    }

    if (selectedEnrolledSlugs.size === 0) {
        toast('Please select at least 1 subject to continue.');
        return;
    }

    // Convert selected slugs to subject objects
    const selectedList = SUBJECTS_CATALOG.filter(sub => selectedEnrolledSlugs.has(sub.slug));

    // Save subjects to PostgreSQL / local fallback
    const { error: subjectsError } = await saveStudentSubjects(currentUser.id, selectedList);
    if (subjectsError) {
        toast(`Could not save subjects: ${subjectsError.message || 'Please try again.'}`);
        return;
    }

    // Save profile with onboarding_completed = true
    const { data: savedProfile, error: profileError } = await upsertProfile({
        id: currentUser.id,
        full_name: currentProfile?.full_name || currentUser.user_metadata?.full_name || 'Student',
        country,
        university,
        faculty,
        major,
        onboarding_completed: true
    });
    if (profileError) {
        toast(`Could not save academic profile: ${profileError.message || 'Please try again.'}`);
        return;
    }

    currentProfile = {
        ...(currentProfile || {}),
        ...(savedProfile || {}),
        country,
        university,
        faculty,
        major,
        onboarding_completed: true
    };

    fillSubjectSelects();
    fillQuizSubjects();
    toast('Academic profile & subjects saved successfully!');
    showView('dashboard');
}

// ---- Task Tracker & Dashboard Analytics ----
function renderSubjectTabs() {
    const tabs = document.getElementById('subject-tabs');
    if (!tabs) return;
    const names = subjectNames();
    tabs.innerHTML = [`<button type="button" class="tab-chip ${currentSubjectTab === 'all' ? 'is-on' : ''}" data-subject="all">All subjects</button>`]
        .concat(names.map((name) => `<button type="button" class="tab-chip ${currentSubjectTab === name ? 'is-on' : ''}" data-subject="${escapeHtml(name)}">${escapeHtml(name)}</button>`))
        .join('');
}

function updateDashboard() {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter((task) => !task.completed && new Date(task.deadline) < new Date()).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    const next = nextPendingTask();

    const setTxt = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };

    setTxt('stat-total', total);
    setTxt('stat-completed', completed);
    setTxt('stat-pending', pending);
    setTxt('stat-progress-text', `${percentage}%`);

    const orb = document.getElementById('orb-fill');
    if (orb) orb.style.strokeDashoffset = String(314 - (314 * percentage) / 100);

    setTxt('pill-pending', `${pending} pending`);
    setTxt('pill-overdue', `${overdue} overdue`);
    setTxt('count-all', total);
    setTxt('count-pending', pending);
    setTxt('count-completed', completed);
    setTxt('focus-title', next ? next.name : 'No pending tasks');
    setTxt('focus-meta', next ? `${next.subject} · ${relativeDeadline(next.deadline, false)}` : 'Add a subject, then a task');

    const headline = document.getElementById('hero-headline');
    const sub = document.getElementById('hero-sub');
    if (headline && sub) {
        if (percentage === 100 && total > 0) {
            headline.textContent = 'Plan complete';
            sub.textContent = 'All tasks finished! Take a quiz to test your understanding.';
        } else if (overdue > 0) {
            headline.textContent = 'Deadlines need attention';
            sub.textContent = next ? `Start with “${next.name}”.` : 'Clear overdue work first.';
        } else {
            headline.textContent = 'Keep the streak going';
            sub.textContent = next ? `Next up: ${next.name}.` : 'Create tasks, then track them here.';
        }
    }

    renderUpcomingDeadlines();
}

function renderTaskList() {
    const filtered = visibleTasks();
    const taskContainer = document.getElementById('task-container');
    const emptyState = document.getElementById('empty-state');
    if (!taskContainer) return;

    taskContainer.innerHTML = '';

    if (filtered.length === 0) {
        if (emptyState) {
            emptyState.hidden = false;
            emptyState.classList.add('is-visible');
            document.getElementById('empty-title').textContent = searchQuery ? 'No matches' : 'Nothing in this view';
            document.getElementById('empty-copy').textContent = 'Add a study task, or change your filters.';
        }
        return;
    }

    if (emptyState) {
        emptyState.hidden = true;
        emptyState.classList.remove('is-visible');
    }

    const grouped = [];
    const indexMap = new Map();
    filtered.forEach((task) => {
        const key = (task.subject || 'General').trim();
        if (!indexMap.has(key)) {
            indexMap.set(key, grouped.length);
            grouped.push({ subject: key, tasks: [] });
        }
        grouped[indexMap.get(key)].tasks.push(task);
    });

    grouped.forEach((group) => {
        const colors = getSubjectColors(group.subject);
        const allInSubject = tasks.filter((task) => task.subject === group.subject);
        const doneRatio = allInSubject.filter((task) => task.completed).length / Math.max(allInSubject.length, 1);
        const section = document.createElement('section');
        section.innerHTML = `
            <div class="group-head">
                <span class="subject-chip" style="color:${colors.color}">
                    <span style="width:8px;height:8px;border-radius:50%;background:${colors.color}"></span>
                    ${escapeHtml(group.subject)}
                </span>
                <div class="group-progress"><span style="width:${Math.round(doneRatio * 100)}%"></span></div>
            </div>
        `;
        group.tasks.forEach((task) => {
            const isOverdue = !task.completed && new Date(task.deadline) < new Date();
            const card = document.createElement('article');
            card.className = `task-card ${task.completed ? 'is-done' : ''} ${isOverdue ? 'is-overdue' : ''}`;
            card.innerHTML = `
                <div class="task-main">
                    <button class="toggle-btn ${task.completed ? 'is-on' : ''}" data-id="${task.id}" aria-label="${task.completed ? 'Mark as pending' : 'Mark as completed'}">
                        <i class="fa-solid fa-check"></i>
                    </button>
                    <div class="task-copy">
                        <div>
                            <span class="status ${task.completed ? 'completed' : 'pending'}">${task.completed ? 'Completed' : 'Pending'}</span>
                            ${isOverdue ? '<span class="status overdue">Overdue</span>' : ''}
                        </div>
                        <h3 class="${task.completed ? 'done' : ''}">${escapeHtml(task.name)}</h3>
                        <p>${escapeHtml(task.subject)} · ${formatDate(task.deadline)} · ${relativeDeadline(task.deadline, task.completed)}</p>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="icon-btn edit-btn" data-id="${task.id}" aria-label="Edit task"><i class="fa-solid fa-pen"></i></button>
                    <button class="icon-btn delete-btn" data-id="${task.id}" aria-label="Delete task"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            section.appendChild(card);
        });
        taskContainer.appendChild(section);
    });
}

function renderAnalytics() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter(t => !t.completed && new Date(t.deadline) < new Date()).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    const orb = document.getElementById('analytics-orb-fill');
    if (orb) orb.style.strokeDashoffset = String(314 - (314 * percentage) / 100);
    const textEl = document.getElementById('analytics-progress-text');
    if (textEl) textEl.textContent = `${percentage}%`;

    const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setTxt('analytics-task-total', `${total} total task${total === 1 ? '' : 's'}`);
    setTxt('workload-completed-text', `${completed} (${percentage}%)`);
    setTxt('workload-pending-text', `${pending} (${total ? Math.round((pending / total) * 100) : 0}%)`);
    setTxt('workload-overdue-text', `${overdue} (${total ? Math.round((overdue / total) * 100) : 0}%)`);

    const setWidth = (id, pct) => { const el = document.getElementById(id); if (el) el.style.width = `${pct}%`; };
    setWidth('workload-completed-bar', percentage);
    setWidth('workload-pending-bar', total ? Math.round((pending / total) * 100) : 0);
    setWidth('workload-overdue-bar', total ? Math.round((overdue / total) * 100) : 0);

    renderWeeklyActivityChart();
    renderSubjectWiseAnalytics();
    renderQuizAnalytics();
}

function renderWeeklyActivityChart() {
    const chartEl = document.getElementById('weekly-activity-chart');
    const totalEl = document.getElementById('weekly-completed-total');
    if (!chartEl) return;

    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        d.setHours(0, 0, 0, 0);
        days.push(d);
    }

    const dayCounts = days.map((dayDate) => {
        const nextDay = new Date(dayDate);
        nextDay.setDate(dayDate.getDate() + 1);

        return tasks.filter(t => {
            const tDate = new Date(t.deadline);
            return tDate >= dayDate && tDate < nextDay;
        }).length;
    });

    const maxCount = Math.max(...dayCounts, 1);
    const weeklyTotal = dayCounts.reduce((a, b) => a + b, 0);
    if (totalEl) totalEl.textContent = `${weeklyTotal} scheduled`;

    chartEl.innerHTML = days.map((dayDate, idx) => {
        const count = dayCounts[idx];
        const isToday = dayDate.toDateString() === now.toDateString();
        const heightPct = Math.max(14, Math.round((count / maxCount) * 100));

        return `
            <div class="day-bar-column">
                <span class="day-bar-count">${count}</span>
                <div class="day-bar ${isToday ? 'is-today' : ''}" style="height: ${heightPct}%;"></div>
                <span class="day-bar-label">${dayNames[dayDate.getDay()]}</span>
            </div>
        `;
    }).join('');
}

function renderSubjectWiseAnalytics() {
    const container = document.getElementById('subject-progress-container');
    const emptyEl = document.getElementById('subject-analytics-empty');
    const countText = document.getElementById('subject-breakdown-count');
    if (!container) return;

    const subjectsMap = new Map();

    selectedEnrolledSlugs.forEach(slug => {
        const subObj = SUBJECTS_CATALOG.find(s => s.slug === slug);
        if (subObj) {
            subjectsMap.set(subObj.name, { total: 0, completed: 0, overdue: 0, icon: subObj.icon });
        }
    });

    tasks.forEach(task => {
        const key = task.subject || 'General';
        if (!subjectsMap.has(key)) {
            subjectsMap.set(key, { total: 0, completed: 0, overdue: 0, icon: 'fa-book' });
        }
        const record = subjectsMap.get(key);
        record.total += 1;
        if (task.completed) {
            record.completed += 1;
        } else if (new Date(task.deadline) < new Date()) {
            record.overdue += 1;
        }
    });

    const subjectEntries = Array.from(subjectsMap.entries());

    if (countText) countText.textContent = `${subjectEntries.length} enrolled subject${subjectEntries.length === 1 ? '' : 's'}`;

    if (subjectEntries.length === 0) {
        container.innerHTML = '';
        if (emptyEl) emptyEl.hidden = false;
        return;
    }

    if (emptyEl) emptyEl.hidden = true;

    container.innerHTML = subjectEntries.map(([name, data]) => {
        const pct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
        const colors = getSubjectColors(name);

        return `
            <article class="subject-progress-item">
                <div class="subject-progress-meta">
                    <span style="display: flex; align-items: center; gap: 8px;">
                        <span style="width: 8px; height: 8px; border-radius: 50%; background: ${colors.color}"></span>
                        <strong>${escapeHtml(name)}</strong>
                    </span>
                    <span>${data.completed}/${data.total} completed · <strong>${pct}%</strong></span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${pct}%; background: ${colors.color};"></div>
                </div>
            </article>
        `;
    }).join('');
}

function renderUpcomingDeadlines() {
    const container = document.getElementById('dashboard-deadlines-container');
    const emptyEl = document.getElementById('dashboard-deadlines-empty');
    const countText = document.getElementById('deadline-count-text');
    if (!container) return;

    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    const upcoming = tasks
        .filter(t => !t.completed && new Date(t.deadline) <= nextWeek)
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    if (countText) countText.textContent = `${upcoming.length} deadline${upcoming.length === 1 ? '' : 's'} ahead`;

    if (upcoming.length === 0) {
        container.innerHTML = '';
        if (emptyEl) emptyEl.hidden = false;
        return;
    }

    if (emptyEl) emptyEl.hidden = true;

    container.innerHTML = upcoming.map(task => {
        const isOverdue = new Date(task.deadline) < now;
        const colors = getSubjectColors(task.subject);

        return `
            <article class="deadline-item">
                <div class="deadline-item-left">
                    <span class="deadline-item-status-icon ${isOverdue ? 'is-overdue' : ''}">
                        <i class="fa-solid ${isOverdue ? 'fa-triangle-exclamation' : 'fa-clock'}"></i>
                    </span>
                    <div>
                        <strong>${escapeHtml(task.name)}</strong>
                        <p class="muted" style="font-size: 12px; margin: 2px 0 0;">
                            <span style="color: ${colors.color}; font-weight: 600;">${escapeHtml(task.subject)}</span>
                            · ${formatDate(task.deadline)}
                        </p>
                    </div>
                </div>
                <span class="pill ${isOverdue ? 'pill-warn' : ''}">
                    ${relativeDeadline(task.deadline, false)}
                </span>
            </article>
        `;
    }).join('');
}

function renderRecentTasks() {
    const recent = [...tasks].reverse().slice(0, 8);
    const recentCount = document.getElementById('recent-count');
    if (recentCount) recentCount.textContent = `${tasks.length} task${tasks.length === 1 ? '' : 's'} saved in cloud database`;

    const list = document.getElementById('recent-tasks');
    const empty = document.getElementById('create-empty');
    if (!list) return;

    if (recent.length === 0) {
        list.innerHTML = '';
        if (empty) {
            empty.hidden = false;
            empty.classList.add('is-visible');
        }
        return;
    }
    if (empty) {
        empty.hidden = true;
        empty.classList.remove('is-visible');
    }
    list.innerHTML = recent.map((task) => `
        <article class="recent-item">
            <div>
                <strong>${escapeHtml(task.name)}</strong>
                <p>${escapeHtml(task.subject)} · ${formatDate(task.deadline)} · ${task.completed ? 'Completed' : 'Pending'}</p>
            </div>
            <button class="btn-danger recent-delete-btn" type="button" data-delete-recent-task="${task.id}" aria-label="Delete ${escapeHtml(task.name)}">
                <i class="fa-solid fa-trash" aria-hidden="true"></i>
                <span>Delete</span>
            </button>
        </article>
    `).join('');
}

// ---- Quiz Logic ----
function quizQuestionsFor(subject, count) {
    const list = QUIZ_BANK[subject] || [];
    const questions = [...list];
    for (let index = questions.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [questions[index], questions[swapIndex]] = [questions[swapIndex], questions[index]];
    }
    return questions.slice(0, count);
}

async function loadQuizQuestions(subject, count) {
    const subjectRecord = dbSubjects.find((item) => item.slug === subject) || SUBJECTS_CATALOG.find(s => s.slug === subject);
    if (subjectRecord && subjectRecord.id && !String(subjectRecord.id).startsWith('subj-')) {
        const { data, error } = await getQuizQuestions(subjectRecord.id, count);
        if (!error && data && data.length) {
            return data.map((item) => ({
                id: item.id,
                q: item.question,
                options: Array.isArray(item.options) ? item.options : JSON.parse(item.options),
                answer: item.correct_answer
            }));
        }
        if (error) console.warn('Could not load quiz questions from database:', error.message);
    }

    return quizQuestionsFor(subject, count);
}

function clearQuizTimer() {
    if (quizTimer !== null) {
        window.clearInterval(quizTimer);
        quizTimer = null;
    }
}

function startRapidQuizTimer() {
    clearQuizTimer();
    quiz.deadline = Date.now() + 30000;
    const timerEl = document.getElementById('quiz-timer');
    if (timerEl) timerEl.hidden = false;
    refreshRapidQuizTimer();
    quizTimer = window.setInterval(refreshRapidQuizTimer, 250);
}

function refreshRapidQuizTimer() {
    if (quiz.mode !== 'rapid' || !quiz.deadline || quiz.finished) return;
    quiz.timeLeft = Math.max(0, Math.ceil((quiz.deadline - Date.now()) / 1000));
    const timerEl = document.getElementById('quiz-timer');
    if (timerEl) timerEl.textContent = `Time remaining: ${quiz.timeLeft} seconds`;
    if (quiz.timeLeft === 0) finishQuiz(true);
}

function setQuizStage(stage) {
    if (stage !== 'play') {
        clearQuizTimer();
        const timerEl = document.getElementById('quiz-timer');
        if (timerEl) timerEl.hidden = true;
    }
    document.getElementById('quiz-setup').hidden = stage !== 'setup';
    document.getElementById('quiz-play').hidden = stage !== 'play';
    document.getElementById('quiz-result').hidden = stage !== 'result';
}

function renderQuizQuestion() {
    const item = quiz.questions[quiz.index];
    if (!item) return;

    document.getElementById('quiz-progress').textContent = `Question ${quiz.index + 1} of ${quiz.questions.length}`;
    document.getElementById('quiz-question').textContent = item.q;

    const chosen = quiz.answers[quiz.index];
    const optionsHtml = item.options.map((optionText, optIndex) => `
        <label class="choice ${chosen === optIndex ? 'is-on' : ''}">
            <input type="radio" name="quiz-choice" value="${optIndex}" ${chosen === optIndex ? 'checked' : ''}>
            <span>${escapeHtml(optionText)}</span>
        </label>
    `).join('');

    document.getElementById('quiz-options').innerHTML = optionsHtml;

    const backBtn = document.getElementById('quiz-back-btn');
    if (backBtn) backBtn.textContent = quiz.index === 0 ? 'Quit quiz' : 'Back';

    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) {
        nextBtn.textContent = quiz.index === quiz.questions.length - 1 ? 'Finish' : 'Next';
    }
}

async function startQuiz(mode) {
    const subject = document.getElementById('quiz-subject')?.value;
    if (!subject) {
        toast('Please select a subject to start the quiz.');
        return;
    }
    const count = mode === 'rapid' ? 10 : 15;
    const questions = await loadQuizQuestions(subject, count);

    if (questions.length === 0) {
        toast('No questions available for this subject yet.');
        return;
    }

    quiz = {
        subject,
        mode,
        questions,
        index: 0,
        answers: new Array(questions.length).fill(null),
        timeLeft: 30,
        deadline: 0,
        finished: false
    };

    const subObj = SUBJECTS_CATALOG.find(s => s.slug === subject);
    const subTitle = subObj ? subObj.name : subject;
    const titleEl = document.getElementById('quiz-title');
    if (titleEl) titleEl.textContent = `${subTitle} Quiz`;

    setQuizStage('play');
    renderQuizQuestion();

    if (mode === 'rapid') {
        startRapidQuizTimer();
    }
}

async function startAiQuiz() {
    const subjectSlug = document.getElementById('quiz-ai-subject')?.value || document.getElementById('quiz-subject')?.value;
    const topic = document.getElementById('quiz-ai-topic')?.value?.trim();
    const difficulty = document.getElementById('quiz-ai-difficulty')?.value || 'medium';
    const count = parseInt(document.getElementById('quiz-ai-count')?.value || '5', 10);

    if (!topic || topic.length < 2) {
        toast('Please enter a topic prompt (at least 2 characters).');
        document.getElementById('quiz-ai-topic')?.focus();
        return;
    }

    const subObj = dbSubjects.find(s => s.slug === subjectSlug) || SUBJECTS_CATALOG.find(s => s.slug === subjectSlug);
    const subjectName = subObj ? subObj.name : 'Computer Science';
    const subjectId = subObj ? subObj.id : null;

    const loadingEl = document.getElementById('quiz-ai-loading');
    const generateBtn = document.getElementById('quiz-generate-ai-btn');

    if (loadingEl) loadingEl.style.display = 'inline-flex';
    if (generateBtn) generateBtn.disabled = true;

    try {
        const { data, error } = await generateAiQuiz({
            subjectId,
            subjectSlug,
            subjectName,
            topic,
            difficulty,
            questionCount: count,
            studentId: currentUser?.id || 'local-student'
        });

        if (error || !data || !data.questions || data.questions.length === 0) {
            toast(error?.message || 'Could not generate AI quiz questions. Please try again.');
            return;
        }

        const questions = data.questions.map((item, idx) => ({
            id: item.id || `ai-q-${idx + 1}`,
            q: item.question,
            options: item.options,
            answer: item.correct_answer,
            explanation: item.explanation
        }));

        quiz = {
            subject: subjectSlug,
            topic: data.topic,
            difficulty: data.difficulty,
            aiQuizId: data.quizId,
            mode: 'ai',
            questions,
            index: 0,
            answers: new Array(questions.length).fill(null),
            timeLeft: 0,
            deadline: 0,
            finished: false
        };

        const titleEl = document.getElementById('quiz-title');
        if (titleEl) titleEl.textContent = `AI Quiz: ${data.topic} (${data.difficulty.toUpperCase()})`;

        setQuizStage('play');
        renderQuizQuestion();
        toast(`✨ Generated ${questions.length} AI questions on "${data.topic}"!`);
    } catch (err) {
        toast('Error creating AI quiz: ' + err.message);
    } finally {
        if (loadingEl) loadingEl.style.display = 'none';
        if (generateBtn) generateBtn.disabled = false;
    }
}

async function finishQuiz(timedOut = false) {
    clearQuizTimer();
    quiz.finished = true;

    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
        if (quiz.answers[idx] === q.answer) correctCount += 1;
    });

    const total = quiz.questions.length;
    const percentage = Math.round((correctCount / total) * 100);

    // Save to database
    if (currentUser) {
        if (quiz.mode === 'ai') {
            const responses = quiz.questions.map((q, idx) => ({
                question_id: q.id,
                question_text: q.q,
                selected_answer: quiz.answers[idx] ?? null,
                correct_answer: q.answer,
                is_correct: quiz.answers[idx] === q.answer,
                explanation: q.explanation || ''
            }));
            const { data: aiSaved, error: aiErr } = await saveAiQuizAttempt({
                quizId: quiz.aiQuizId,
                studentId: currentUser.id,
                score: correctCount,
                totalQuestions: total,
                timeSpentSeconds: null,
                responses
            });
            if (aiErr) {
                toast(`Could not save AI quiz result: ${aiErr.message || 'Please try again.'}`);
            } else if (aiSaved && aiSaved.dbPersisted === false && aiSaved.persistenceError) {
                console.warn('AI quiz attempt saved locally only:', aiSaved.persistenceError);
            }
        } else {
            const subjectRecord = dbSubjects.find(s => s.slug === quiz.subject);
            const responses = quiz.questions.map((q, idx) => ({
                question_id: q.id,
                selected_answer: quiz.answers[idx] ?? null,
                is_correct: quiz.answers[idx] === q.answer
            }));
            const { error: quizSaveError } = await saveQuizAttempt({
                studentId: currentUser.id,
                subjectId: subjectRecord?.id || null,
                subjectSlug: quiz.subject,
                mode: quiz.mode,
                score: correctCount,
                totalQuestions: total,
                responses
            });
            if (quizSaveError) {
                toast(`Could not save quiz result: ${quizSaveError.message || 'Please try again.'}`);
            }
        }
        await loadAndRenderQuizHistory();
    }

    setQuizStage('result');
    document.getElementById('quiz-score').textContent = `Marks: ${correctCount} / ${total}`;
    document.getElementById('quiz-percent').textContent = `${percentage}% correct`;

    const reviewEl = document.getElementById('quiz-review');
    if (reviewEl) {
        reviewEl.textContent = timedOut
            ? 'Time ran out! Here are your results.'
            : (percentage >= 80 ? 'Outstanding work!' : percentage >= 50 ? 'Good effort!' : 'Keep practicing!');
    }

    const reviewList = document.getElementById('quiz-answer-review');
    if (reviewList) {
        reviewList.innerHTML = quiz.questions.map((q, idx) => {
            const isCorrect = quiz.answers[idx] === q.answer;
            const chosenText = quiz.answers[idx] != null ? q.options[quiz.answers[idx]] : 'Unanswered';
            const correctText = q.options[q.answer];

            return `
                <li class="${isCorrect ? 'answer-correct' : 'answer-incorrect'}">
                    <strong>${idx + 1}. ${escapeHtml(q.q)}</strong>
                    <span>Your answer: ${escapeHtml(chosenText)} ${isCorrect ? '✓' : '✗'}</span>
                    ${!isCorrect ? `<span>Correct answer: ${escapeHtml(correctText)}</span>` : ''}
                    ${q.explanation ? `<span class="quiz-explanation" style="margin-top: 6px; font-size: 13px; color: var(--accent);"><i class="fa-solid fa-circle-info"></i> ${escapeHtml(q.explanation)}</span>` : ''}
                </li>
            `;
        }).join('');
    }
}

async function loadAndRenderQuizHistory() {
    if (!currentUser) {
        quizHistory = [];
        renderQuizHistoryList();
        renderQuizAnalytics();
        return;
    }

    const [curatedRes, aiRes] = await Promise.all([
        getQuizHistory(currentUser.id, 20),
        getAiQuizHistory(currentUser.id, 20)
    ]);

    if (curatedRes.error) {
        console.warn('Could not load curated quiz history:', curatedRes.error.message || curatedRes.error);
    }

    const curatedItems = (curatedRes.data || []).map((item) => {
        const total = Number(item.total_questions || 0);
        const score = Number(item.score || 0);
        const subjectName = item.subject?.name || getSubjectName(item.subject_id) || 'Quiz';
        return {
            id: item.id,
            mode: item.mode || 'standard',
            subjectName,
            topic: null,
            score,
            totalQuestions: total,
            percentage: total > 0 ? Math.round((score / total) * 100) : 0,
            completedAt: item.completed_at || item.created_at || new Date().toISOString()
        };
    });

    const aiItems = (aiRes.data || []).map((item) => {
        const total = Number(item.total_questions || 0);
        const score = Number(item.score || 0);
        const subjectName = item.quiz?.subject?.name || 'AI Quiz';
        return {
            id: item.id,
            mode: 'ai',
            subjectName,
            topic: item.quiz?.topic || 'Custom AI Topic',
            score,
            totalQuestions: total,
            percentage: total > 0 ? Math.round((score / total) * 100) : 0,
            completedAt: item.completed_at || item.created_at || new Date().toISOString()
        };
    });

    quizHistory = [...curatedItems, ...aiItems]
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
        .slice(0, 20);

    renderQuizHistoryList();
    renderQuizAnalytics();
}

function renderQuizHistoryList() {
    const listEl = document.getElementById('quiz-history-list');
    const countEl = document.getElementById('quiz-history-count');
    if (!listEl) return;

    if (countEl) {
        countEl.textContent = `${quizHistory.length} attempt${quizHistory.length === 1 ? '' : 's'}`;
    }

    if (quizHistory.length === 0) {
        listEl.innerHTML = '<p class="muted" style="font-size: 13px;">No completed quiz attempts yet. Take a standard, rapid, or AI quiz to record your progress.</p>';
        return;
    }

    listEl.innerHTML = quizHistory.slice(0, 8).map((attempt) => {
        const modeLabel = attempt.mode === 'rapid' ? 'Rapid' : attempt.mode === 'ai' ? 'AI' : 'Standard';
        const title = attempt.topic ? `${attempt.subjectName} — ${attempt.topic}` : attempt.subjectName;
        const when = new Date(attempt.completedAt).toLocaleDateString();
        return `
            <div class="subject-progress-item">
                <div class="subject-progress-meta">
                    <span><strong>${escapeHtml(title)}</strong> · ${escapeHtml(modeLabel)} · ${escapeHtml(when)}</span>
                    <strong>${attempt.score}/${attempt.totalQuestions} (${attempt.percentage}%)</strong>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${attempt.percentage}%; background: var(--teal);"></div>
                </div>
            </div>
        `;
    }).join('');
}

function renderQuizAnalytics() {
    const totalEl = document.getElementById('analytics-quiz-total');
    const avgEl = document.getElementById('analytics-quiz-avg');
    const bestEl = document.getElementById('analytics-quiz-best');
    const countEl = document.getElementById('analytics-quiz-count');
    const recentEl = document.getElementById('analytics-quiz-recent');
    if (!totalEl && !recentEl) return;

    const total = quizHistory.length;
    const avg = total > 0
        ? Math.round(quizHistory.reduce((sum, item) => sum + item.percentage, 0) / total)
        : 0;
    const best = total > 0
        ? Math.max(...quizHistory.map((item) => item.percentage))
        : 0;

    if (totalEl) totalEl.textContent = String(total);
    if (avgEl) avgEl.textContent = `${avg}%`;
    if (bestEl) bestEl.textContent = `${best}%`;
    if (countEl) countEl.textContent = `${total} attempt${total === 1 ? '' : 's'}`;

    if (recentEl) {
        if (total === 0) {
            recentEl.innerHTML = '<p class="muted" style="font-size: 13px;">Complete a quiz to track your scores here.</p>';
        } else {
            recentEl.innerHTML = quizHistory.slice(0, 5).map((attempt) => `
                <div class="subject-progress-item">
                    <div class="subject-progress-meta">
                        <span>${escapeHtml(attempt.topic ? `${attempt.subjectName}: ${attempt.topic}` : attempt.subjectName)}</span>
                        <strong>${attempt.score}/${attempt.totalQuestions} (${attempt.percentage}%)</strong>
                    </div>
                    <div class="progress-track">
                        <div class="progress-fill" style="width: ${attempt.percentage}%; background: var(--amber);"></div>
                    </div>
                </div>
            `).join('');
        }
    }
}

// ---- Render Master ----
function render() {
    updateDashboard();
    renderSubjectTabs();
    renderTaskList();
    renderScrollableSubjects();
    renderRecentTasks();
    renderAnalytics();
    renderQuizHistoryList();
    fillSubjectSelects();

    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    }
}

// ---- Modal Controls ----
function openModal(task = null) {
    const modal = document.getElementById('task-modal');
    if (!modal) return;
    const title = document.getElementById('modal-title');
    const idInput = document.getElementById('task-id');
    const subjectSelect = document.getElementById('task-subject');
    const nameInput = document.getElementById('task-name');
    const deadlineInput = document.getElementById('task-deadline');

    fillSubjectSelects();

    if (task) {
        title.textContent = 'Edit task';
        idInput.value = task.id;
        subjectSelect.value = task.subject;
        nameInput.value = task.name;
        deadlineInput.value = formatForInput(task.deadline);
    } else {
        title.textContent = 'Add a new task';
        idInput.value = '';
        nameInput.value = '';
        const now = new Date();
        now.setDate(now.getDate() + 1);
        deadlineInput.value = formatForInput(now.toISOString());
    }

    modal.hidden = false;
    nameInput.focus();
}

function closeModal() {
    const modal = document.getElementById('task-modal');
    if (modal) modal.hidden = true;
}

// ---- Setup Event Listeners ----
function setupEventListeners() {
    // Navigation Links
    document.querySelectorAll('.nav-link[data-view]').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const view = link.dataset.view;
            showView(view);
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('mobile-overlay');
            if (sidebar) sidebar.classList.remove('is-open');
            if (overlay) overlay.hidden = true;
        });
    });

    // Mobile Sidebar Toggles
    const openMenuBtn = document.getElementById('open-sidebar-btn');
    const closeMenuBtn = document.getElementById('close-sidebar-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');

    if (openMenuBtn && sidebar && overlay) {
        openMenuBtn.addEventListener('click', () => {
            sidebar.classList.add('is-open');
            overlay.hidden = false;
        });
    }

    const closeMenu = () => {
        if (sidebar) sidebar.classList.remove('is-open');
        if (overlay) overlay.hidden = true;
    };

    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    // Topbar Actions
    const addTaskBtn = document.getElementById('add-task-btn');
    if (addTaskBtn) addTaskBtn.addEventListener('click', () => openModal());

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderTaskList();
        });
    }

    // Task Filter Buttons
    document.querySelectorAll('.filter-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('is-on'));
            btn.classList.add('is-on');
            currentFilter = btn.dataset.filter;
            renderTaskList();
        });
    });

    // Subject Filter Tabs
    const subjectTabs = document.getElementById('subject-tabs');
    if (subjectTabs) {
        subjectTabs.addEventListener('click', (e) => {
            const btn = e.target.closest('.tab-chip');
            if (!btn) return;
            currentSubjectTab = btn.dataset.subject;
            renderSubjectTabs();
            renderTaskList();
        });
    }

    // Scrollable Subjects Container clicks
    const scrollContainer = document.getElementById('subject-scroll-container');
    if (scrollContainer) {
        scrollContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.scrollable-subject-card');
            if (!card) return;
            const slug = card.dataset.subjectSlug;
            if (!slug) return;

            if (selectedEnrolledSlugs.has(slug)) {
                selectedEnrolledSlugs.delete(slug);
            } else {
                selectedEnrolledSlugs.add(slug);
            }

            renderScrollableSubjects();
            fillSubjectSelects();
        });
    }

    // Subject Search & Category Filter
    const subjectSearchInput = document.getElementById('subject-search-input');
    if (subjectSearchInput) {
        subjectSearchInput.addEventListener('input', (e) => {
            subjectSearchQuery = e.target.value;
            renderScrollableSubjects();
        });
    }

    const catChips = document.getElementById('subject-category-chips');
    if (catChips) {
        catChips.addEventListener('click', (e) => {
            const chip = e.target.closest('.subject-category-chip');
            if (!chip) return;
            document.querySelectorAll('.subject-category-chip').forEach(c => c.classList.remove('is-active'));
            chip.classList.add('is-active');
            subjectCategoryFilter = chip.dataset.cat;
            renderScrollableSubjects();
        });
    }

    // Save Subjects Button
    const saveSubjectsBtn = document.getElementById('save-subjects-btn');
    if (saveSubjectsBtn) {
        saveSubjectsBtn.addEventListener('click', saveAcademicProfileAndSubjects);
    }

    // Quick Task Form in Subjects View
    const quickTaskForm = document.getElementById('create-task-form');
    if (quickTaskForm) {
        quickTaskForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const subject = document.getElementById('create-task-subject-select').value;
            const title = document.getElementById('create-task-name').value.trim();
            const deadlineDate = document.getElementById('create-task-deadline').value;

            if (!subject || !title || !deadlineDate || !currentUser) return;

            const deadlineIso = new Date(deadlineDate + 'T23:59:59').toISOString();
            const subjectId = getSubjectId(subject);

            const { data, error } = await apiCreateTask({
                studentId: currentUser.id,
                subjectId,
                title,
                deadline: deadlineIso
            });

            if (error) {
                toast(`Error saving task: ${error.message}`);
                return;
            }

            tasks.push({
                id: data ? data.id : `task-${Date.now()}`,
                subject,
                subject_id: subjectId,
                name: title,
                deadline: deadlineIso,
                completed: false
            });

            document.getElementById('create-task-name').value = '';
            toast('Task created successfully!');
            render();
        });
    }

    // Modal Task Form
    const taskForm = document.getElementById('task-form');
    if (taskForm) {
        taskForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('task-id').value;
            const subject = document.getElementById('task-subject').value;
            const title = document.getElementById('task-name').value.trim();
            const deadline = new Date(document.getElementById('task-deadline').value).toISOString();

            if (!title || !currentUser) return;

            const subjectId = getSubjectId(subject);

            if (id) {
                // Edit existing
                const { error } = await apiUpdateTask(id, { title, deadline, subjectId });
                if (error) {
                    toast(`Error: ${error.message}`);
                    return;
                }
                const found = tasks.find(t => t.id === id);
                if (found) {
                    found.name = title;
                    found.subject = subject;
                    found.subject_id = subjectId;
                    found.deadline = deadline;
                }
                toast('Task updated');
            } else {
                // Create new
                const { data, error } = await apiCreateTask({
                    studentId: currentUser.id,
                    subjectId,
                    title,
                    deadline
                });
                if (error) {
                    toast(`Error: ${error.message}`);
                    return;
                }
                tasks.push({
                    id: data ? data.id : `task-${Date.now()}`,
                    subject,
                    subject_id: subjectId,
                    name: title,
                    deadline,
                    completed: false
                });
                toast('Task created');
            }

            closeModal();
            render();
        });
    }

    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalBackdrop = document.getElementById('modal-backdrop');
    [cancelModalBtn, closeModalBtn, modalBackdrop].forEach(el => {
        if (el) el.addEventListener('click', closeModal);
    });

    // Task List Card Action Delegation
    const taskContainer = document.getElementById('task-container');
    if (taskContainer) {
        taskContainer.addEventListener('click', async (e) => {
            // Complete toggle
            const toggleBtn = e.target.closest('.toggle-btn');
            if (toggleBtn) {
                const id = toggleBtn.dataset.id;
                const task = tasks.find(t => t.id === id);
                if (!task) return;

                const prevState = task.completed;
                const newState = !prevState;
                const { error } = await apiToggleTask(id, newState);
                if (error) {
                    toast(`Error updating task: ${error.message || 'Please try again.'}`);
                    return;
                }
                task.completed = newState;

                if (newState) {
                    const rect = toggleBtn.getBoundingClientRect();
                    burst(rect.left + rect.width / 2, rect.top + rect.height / 2);
                }

                render();
                return;
            }

            // Edit button
            const editBtn = e.target.closest('.edit-btn');
            if (editBtn) {
                const id = editBtn.dataset.id;
                const task = tasks.find(t => t.id === id);
                if (task) openModal(task);
                return;
            }

            // Delete button
            const deleteBtn = e.target.closest('.delete-btn');
            if (deleteBtn) {
                const id = deleteBtn.dataset.id;
                const task = tasks.find(t => t.id === id);
                if (task) {
                    pendingDelete = id;
                    document.getElementById('confirm-copy').textContent = `Are you sure you want to delete “${task.name}”?`;
                    document.getElementById('confirm-modal').hidden = false;
                }
            }
        });
    }

    // Recent list delete
    const recentTasks = document.getElementById('recent-tasks');
    if (recentTasks) {
        recentTasks.addEventListener('click', async (e) => {
            const delBtn = e.target.closest('[data-delete-recent-task]');
            if (!delBtn) return;
            const id = delBtn.dataset.deleteRecentTask;
            const task = tasks.find(t => t.id === id);
            if (task) {
                pendingDelete = id;
                document.getElementById('confirm-copy').textContent = `Are you sure you want to delete “${task.name}”?`;
                document.getElementById('confirm-modal').hidden = false;
            }
        });
    }

    // Confirm Delete Actions
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const confirmCancelBtn = document.getElementById('confirm-cancel');
    const confirmBackdrop = document.getElementById('confirm-backdrop');
    const confirmModal = document.getElementById('confirm-modal');

    const closeConfirm = () => {
        if (confirmModal) confirmModal.hidden = true;
        pendingDelete = null;
    };

    if (confirmCancelBtn) confirmCancelBtn.addEventListener('click', closeConfirm);
    if (confirmBackdrop) confirmBackdrop.addEventListener('click', closeConfirm);

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', async () => {
            if (!pendingDelete) return;
            const id = pendingDelete;
            closeConfirm();
            const { error } = await apiDeleteTask(id);
            if (error) {
                toast(`Error deleting task: ${error.message || 'Please try again.'}`);
                return;
            }
            tasks = tasks.filter(t => t.id !== id);
            toast('Task deleted');
            render();
        });
    }

    // Empty state redirect button
    const emptyGotoCreate = document.getElementById('empty-goto-create');
    if (emptyGotoCreate) {
        emptyGotoCreate.addEventListener('click', () => openModal());
    }

    // Start quiz buttons
    const startQuizBtn = document.getElementById('start-quiz-btn');
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', () => {
            showView('quiz');
            setQuizStage('setup');
        });
    }

    const quizStartBtn = document.getElementById('quiz-start-btn');
    if (quizStartBtn) quizStartBtn.addEventListener('click', () => startQuiz('standard'));

    const quizRapidBtn = document.getElementById('quiz-rapid-btn');
    if (quizRapidBtn) quizRapidBtn.addEventListener('click', () => startQuiz('rapid'));

    // AI Quiz Tab Switching & Generation
    const tabCurated = document.getElementById('quiz-tab-curated');
    const tabAi = document.getElementById('quiz-tab-ai');
    const panelCurated = document.getElementById('quiz-curated-panel');
    const panelAi = document.getElementById('quiz-ai-panel');

    if (tabCurated && tabAi && panelCurated && panelAi) {
        tabCurated.addEventListener('click', () => {
            tabCurated.classList.add('is-active');
            tabAi.classList.remove('is-active');
            panelCurated.hidden = false;
            panelAi.hidden = true;
        });

        tabAi.addEventListener('click', () => {
            tabAi.classList.add('is-active');
            tabCurated.classList.remove('is-active');
            panelAi.hidden = false;
            panelCurated.hidden = true;
        });
    }

    const quizGenerateAiBtn = document.getElementById('quiz-generate-ai-btn');
    if (quizGenerateAiBtn) {
        quizGenerateAiBtn.addEventListener('click', () => startAiQuiz());
    }

    // Quiz Options & Navigation
    const quizOptions = document.getElementById('quiz-options');
    if (quizOptions) {
        quizOptions.addEventListener('change', (event) => {
            refreshRapidQuizTimer();
            if (quiz.finished) return;
            quiz.answers[quiz.index] = Number(event.target.value);
            renderQuizQuestion();
        });
    }

    const quizNext = document.getElementById('quiz-next-btn');
    if (quizNext) {
        quizNext.addEventListener('click', () => {
            refreshRapidQuizTimer();
            if (quiz.finished) return;
            if (quiz.mode === 'standard' && quiz.answers[quiz.index] == null) {
                toast('Choose an answer first');
                return;
            }
            if (quiz.index === quiz.questions.length - 1) {
                finishQuiz();
                return;
            }
            quiz.index += 1;
            renderQuizQuestion();
        });
    }

    const quizBack = document.getElementById('quiz-back-btn');
    if (quizBack) {
        quizBack.addEventListener('click', () => {
            refreshRapidQuizTimer();
            if (quiz.finished) return;
            if (quiz.index === 0) {
                setQuizStage('setup');
                return;
            }
            quiz.index -= 1;
            renderQuizQuestion();
        });
    }

    const quizRetake = document.getElementById('quiz-retake-btn');
    if (quizRetake) quizRetake.addEventListener('click', () => setQuizStage('setup'));

    const quizToPlan = document.getElementById('quiz-to-plan-btn');
    if (quizToPlan) quizToPlan.addEventListener('click', () => setQuizStage('setup'));

    // Profile Modal Events
    const openProfileBtn = document.getElementById('open-profile-btn');
    const profileModal = document.getElementById('profile-modal');
    const closeProfileBtn = document.getElementById('close-profile-btn');
    const profileBackdrop = document.getElementById('profile-backdrop');

    if (openProfileBtn && profileModal) {
        openProfileBtn.addEventListener('click', () => {
            profileModal.hidden = false;
        });
    }
    const closeProfile = () => { if (profileModal) profileModal.hidden = true; };
    if (closeProfileBtn) closeProfileBtn.addEventListener('click', closeProfile);
    if (profileBackdrop) profileBackdrop.addEventListener('click', closeProfile);

    // Profile Name Form
    const profileNameForm = document.getElementById('profile-name-form');
    if (profileNameForm) {
        profileNameForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newName = document.getElementById('profile-name-input').value.trim();
            if (!newName || !currentUser) return;

            const { error } = await updateDisplayName(currentUser.id, newName);
            if (error) {
                toast(`Error: ${error.message}`);
            } else {
                if (currentProfile) currentProfile.full_name = newName;
                renderUserProfile();
                toast('Display name updated');
                closeProfile();
            }
        });
    }

    // Profile Password Form
    const profilePasswordForm = document.getElementById('profile-password-form');
    if (profilePasswordForm) {
        profilePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newPassword = document.getElementById('profile-new-password').value;
            if (!newPassword || newPassword.length < 8) {
                toast('Password must be at least 8 characters');
                return;
            }

            const { error } = await updatePassword(newPassword);
            if (error) {
                toast(`Error: ${error.message}`);
            } else {
                toast('Password changed successfully');
                document.getElementById('profile-new-password').value = '';
                closeProfile();
            }
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await signOut();
        });
    }

    // Global Keybindings
    document.addEventListener('visibilitychange', refreshRapidQuizTimer);
    document.addEventListener('keydown', (event) => {
        const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName);
        if (event.key === 'Escape') {
            closeModal();
            closeProfile();
            if (confirmModal) confirmModal.hidden = true;
        }
        if (!typing && event.key === '/') {
            event.preventDefault();
            showView('tasks');
            const searchEl = document.getElementById('search-input');
            if (searchEl) searchEl.focus();
        }
    });

    // Hash change router
    window.addEventListener('hashchange', () => {
        const view = location.hash.replace('#', '');
        if (['dashboard', 'tasks', 'subjects', 'analytics', 'quiz', 'create', 'plan', 'onboarding'].includes(view) && view !== currentView) {
            showView(view);
        }
    });
}

async function init() {
    initTheme();
    setupEventListeners();
    initAcademicHierarchy();

    const deadlineInput = document.getElementById('create-task-deadline');
    if (deadlineInput) deadlineInput.value = dateInputValue();

    const initial = location.hash.replace('#', '');
    showView(['dashboard', 'tasks', 'subjects', 'analytics', 'quiz'].includes(initial) ? initial : 'dashboard');

    // Load user data from Supabase
    await loadUserData();

    // Listen for auth state changes
    onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
            window.location.href = 'auth/login.html';
        }
    });

    setInterval(updateDashboard, 60000);
}

document.addEventListener('DOMContentLoaded', init);
