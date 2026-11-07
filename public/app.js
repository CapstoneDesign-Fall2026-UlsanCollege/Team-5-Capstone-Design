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

import { supabase } from '../src/lib/supabase.js';
import {
    getCurrentUser,
    getSession,
    signOut,
    updatePassword,
    onAuthStateChange
} from '../src/services/auth.js';
import { getProfile, updateDisplayName, upsertProfile } from '../src/services/profile.js';
import {
    getTasks,
    createTask as apiCreateTask,
    updateTask as apiUpdateTask,
    toggleTask as apiToggleTask,
    deleteTask as apiDeleteTask
} from '../src/services/tasks.js';
import {
    getDefaultSubjects,
    getAllSubjects,
    getStudentSubjects,
    saveStudentSubjects
} from '../src/services/subjects.js';
import { getQuizQuestions, saveQuizAttempt } from '../src/services/quiz.js';
import {
    getCountries,
    getUniversities,
    getFaculties,
    getMajors,
    SUBJECTS_CATALOG,
    searchSubjects
} from '../src/lib/academic-catalog.js';

// ---- Constants ----
const THEME_KEY = 'smart_study_theme';

const CS_SUBJECTS = [
    { name: 'Programming Fundamentals', slug: 'programming', icon: 'fa-code', description: 'Languages, logic, and software development' },
    { name: 'Data Structures & Algorithms', slug: 'data-structures', icon: 'fa-diagram-project', description: 'Core structures, searching, and sorting' },
    { name: 'Database Management Systems', slug: 'databases', icon: 'fa-database', description: 'SQL, data modeling, and storage' },
    { name: 'Computer Networks', slug: 'networks', icon: 'fa-network-wired', description: 'Protocols, addressing, and network design' },
    { name: 'Operating Systems', slug: 'operating-systems', icon: 'fa-desktop', description: 'Processes, memory, and system resources' }
];

const QUIZ_BANK = {
    programming: [
        { q: 'Which JavaScript keyword declares a block-scoped variable that can be reassigned?', options: ['const', 'let', 'static', 'define'], answer: 1 },
        { q: 'Which HTML element represents the most important heading?', options: ['<h6>', '<head>', '<h1>', '<title>'], answer: 2 },
        { q: 'Which CSS property changes the color of text?', options: ['font-style', 'background', 'text-align', 'color'], answer: 3 },
        { q: 'What does a Boolean value represent?', options: ['True or false', 'A decimal number', 'A sequence of characters', 'A memory address'], answer: 0 },
        { q: 'What is the main purpose of a function?', options: ['To store database rows', 'To group reusable instructions', 'To increase screen resolution', 'To allocate network ports'], answer: 1 },
        { q: 'What does debugging help a programmer do?', options: ['Compress source code', 'Design a database', 'Find and fix errors', 'Encrypt every variable'], answer: 2 },
        { q: 'Which JavaScript operator checks both value and type equality?', options: ['==', '=', '!=', '==='], answer: 3 },
        { q: 'What is a parameter in a function?', options: ['A named input the function can use', 'The value returned by every function', 'A syntax error', 'A loop condition'], answer: 0 },
        { q: 'What does an array commonly store?', options: ['One named function only', 'An ordered collection of values', 'Only true/false values', 'A network protocol'], answer: 1 },
        { q: 'Which keyword exits a loop immediately in many programming languages?', options: ['skip', 'return-all', 'break', 'next-loop'], answer: 2 },
        { q: 'What is the result of 9 % 4 in JavaScript?', options: ['1', '2', '2.25', '36'], answer: 0 },
        { q: 'What is a syntax error?', options: ['A slow algorithm', 'A rule violation in how code is written', 'A missing user account', 'A full hard drive'], answer: 1 },
        { q: 'Which statement runs a block only when its condition is true?', options: ['import', 'class', 'if', 'return'], answer: 2 },
        { q: 'What does a return statement do in a function?', options: ['Repeats a loop', 'Declares a variable', 'Catches every error', 'Sends a value back to the caller'], answer: 3 },
        { q: 'What does source control help a team track?', options: ['Changes to files over time', 'CPU temperature', 'Monitor brightness', 'Internet speed'], answer: 0 }
    ],
    'data-structures': [
        { q: 'Which structure follows last-in, first-out order?', options: ['Queue', 'Stack', 'Heap', 'Graph'], answer: 1 },
        { q: 'Which structure follows first-in, first-out order?', options: ['Stack', 'Tree', 'Queue', 'Set'], answer: 2 },
        { q: 'In a typical array, what is the time complexity of accessing an element by index?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 0 },
        { q: 'Which data structure is commonly used to implement a priority queue?', options: ['Linked list only', 'Binary heap', 'Hash set', 'Stack'], answer: 1 },
        { q: 'What is the average lookup time for a well-distributed hash table?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'], answer: 2 },
        { q: 'In a binary search tree, values in the left subtree are usually:', options: ['Smaller than the node', 'Larger than the node', 'Always equal to the node', 'Stored as child indexes'], answer: 0 },
        { q: 'Which traversal explores a graph level by level?', options: ['Depth-first search', 'In-order traversal', 'Breadth-first search', 'Binary search'], answer: 2 },
        { q: 'What is the worst-case time complexity of linear search?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 2 },
        { q: 'Which structure connects nodes using edges and has no required root?', options: ['Graph', 'Stack', 'Array', 'Queue'], answer: 0 },
        { q: 'What is a leaf in a tree?', options: ['A node with no children', 'The root node', 'An edge between roots', 'A cycle'], answer: 0 },
        { q: 'Which sorting algorithm repeatedly partitions around a pivot?', options: ['Selection sort', 'Quick sort', 'Insertion sort', 'Counting sort'], answer: 1 },
        { q: 'What does a linked list node typically contain?', options: ['Only an array index', 'A value and link(s) to other node(s)', 'A database table', 'A sorting algorithm'], answer: 1 },
        { q: 'Which algorithmic technique solves problems by combining results from smaller subproblems?', options: ['Brute-force enumeration', 'Hashing', 'Divide and conquer', 'Linear probing'], answer: 2 },
        { q: 'A balanced binary search tree keeps its height approximately:', options: ['O(log n)', 'O(n²)', 'O(1) for every size', 'O(2ⁿ)'], answer: 0 },
        { q: 'Which data structure is most suitable for checking whether an item has appeared before?', options: ['Queue', 'Hash set', 'Stack', 'Tree traversal list'], answer: 1 }
    ],
    databases: [
        { q: 'What does SQL stand for?', options: ['Structured Query Language', 'Sequential Question Logic', 'System Quality Layer', 'Simple Queue Language'], answer: 0 },
        { q: 'Which key uniquely identifies a row in a relational table?', options: ['Foreign key', 'Primary key', 'Index label', 'Nullable key'], answer: 1 },
        { q: 'What is the purpose of a foreign key?', options: ['To encrypt a table', 'To sort every row', 'To reference a key in another table', 'To create a backup'], answer: 2 },
        { q: 'Which SQL command retrieves rows from a table?', options: ['FETCH TABLE', 'OPEN', 'RETRIEVE', 'SELECT'], answer: 3 },
        { q: 'Which clause filters rows before grouping?', options: ['WHERE', 'ORDER BY', 'HAVING', 'LIMIT'], answer: 0 },
        { q: 'What does a JOIN do in a relational query?', options: ['Deletes duplicate databases', 'Combines related rows from tables', 'Changes a column type', 'Backs up a table'], answer: 1 },
        { q: 'Which property is expected of a transaction under ACID?', options: ['Approximation', 'Caching', 'Atomicity', 'Duplication'], answer: 2 },
        { q: 'What is database normalization primarily intended to reduce?', options: ['Data redundancy and update anomalies', 'Query language features', 'The number of users', 'All indexes'], answer: 0 },
        { q: 'Which SQL command adds a new row?', options: ['APPEND ROW', 'INSERT INTO', 'ADD COLUMN', 'CREATE ROW'], answer: 1 },
        { q: 'What does an index generally improve?', options: ['Query lookup speed', 'Disk capacity', 'Data accuracy automatically', 'Network encryption'], answer: 0 },
        { q: 'Which clause sorts query results?', options: ['GROUP BY', 'HAVING', 'ORDER BY', 'SORT TABLE'], answer: 2 },
        { q: 'What does NULL typically mean in a database?', options: ['The number zero', 'An empty string in every system', 'False', 'A missing or unknown value'], answer: 3 },
        { q: 'Which SQL operation changes existing rows?', options: ['UPDATE', 'CREATE', 'SELECT', 'GRANT'], answer: 0 },
        { q: 'What does GROUP BY do?', options: ['Removes a table', 'Groups rows that share values for aggregation', 'Encrypts grouped columns', 'Orders rows alphabetically only'], answer: 1 },
        { q: 'Which database model stores data as documents, key-value pairs, or graphs instead of only relational tables?', options: ['Spreadsheet', 'Relational only', 'NoSQL', 'Flat-file index'], answer: 2 }
    ],
    networks: [
        { q: 'What does IP stand for in networking?', options: ['Internet Protocol', 'Internal Process', 'Interface Program', 'Integrated Port'], answer: 0 },
        { q: 'Which protocol provides reliable, ordered delivery using a connection?', options: ['UDP', 'TCP', 'IP', 'ARP'], answer: 1 },
        { q: 'What is the main purpose of DNS?', options: ['Encrypt files', 'Assign CPU time', 'Translate domain names to IP addresses', 'Detect hardware errors'], answer: 2 },
        { q: 'Which device forwards packets between different networks?', options: ['Hub', 'Repeater', 'Switch', 'Router'], answer: 3 },
        { q: 'How many layers are in the commonly taught OSI model?', options: ['Seven', 'Four', 'Five', 'Eight'], answer: 0 },
        { q: 'Which protocol is commonly used to securely browse websites?', options: ['FTP', 'HTTPS', 'SMTP', 'DHCP'], answer: 1 },
        { q: 'What does DHCP commonly provide to a client?', options: ['A domain name certificate', 'A MAC address', 'Network configuration such as an IP address', 'A web page'], answer: 2 },
        { q: 'Which transport protocol is connectionless and does not guarantee delivery?', options: ['TCP', 'HTTP', 'SSH', 'UDP'], answer: 3 },
        { q: 'What is a MAC address associated with?', options: ['A network interface at the link layer', 'A web domain', 'A TCP port', 'A file system'], answer: 0 },
        { q: 'What is the purpose of a subnet mask?', options: ['To encrypt a packet', 'To identify network and host portions of an IP address', 'To map a URL to HTML', 'To increase Wi-Fi signal'], answer: 1 },
        { q: 'Which protocol is used to send email between mail servers?', options: ['POP3', 'IMAP', 'SMTP', 'SNMP'], answer: 2 },
        { q: 'What does bandwidth describe in a data connection?', options: ['The physical length of a cable', 'The number of devices on a LAN', 'A packet’s destination', 'The maximum data transfer capacity'], answer: 3 },
        { q: 'Which network topology connects devices to a central switch or hub?', options: ['Star', 'Ring', 'Bus', 'Mesh only'], answer: 0 },
        { q: 'What is latency?', options: ['The number of IP addresses', 'The time delay for data to travel', 'The size of a hard drive', 'The encryption key length'], answer: 1 },
        { q: 'Which protocol securely supports remote command-line access?', options: ['Telnet', 'HTTP', 'SSH', 'TFTP'], answer: 2 }
    ],
    'operating-systems': [
        { q: 'What is the main role of an operating system?', options: ['Manage computer resources and provide services to programs', 'Design web pages', 'Manufacture a CPU', 'Translate domain names'], answer: 0 },
        { q: 'What is a process?', options: ['A stored source-code comment', 'A program in execution', 'A network cable', 'A database column'], answer: 1 },
        { q: 'Which scheduling algorithm assigns each process a fixed time slice in turn?', options: ['Shortest job first', 'Priority only', 'Round robin', 'First-fit'], answer: 2 },
        { q: 'What is virtual memory?', options: ['A type of CPU cache only', 'A second physical processor', 'A backup power supply', 'An abstraction that uses storage to extend addressable memory'], answer: 3 },
        { q: 'What condition describes two or more processes waiting indefinitely for resources held by each other?', options: ['Deadlock', 'Thrashing', 'Starvation-free scheduling', 'Context switching'], answer: 0 },
        { q: 'What does a context switch do?', options: ['Formats a disk', 'Saves one process state and loads another', 'Compiles source code', 'Changes a user password'], answer: 1 },
        { q: 'What is a system call?', options: ['A phone call to support', 'A compiler warning', 'A request for a service from the operating system', 'A network broadcast'], answer: 2 },
        { q: 'Which memory is typically fastest and closest to the CPU?', options: ['Hard disk', 'RAM', 'Optical disc', 'CPU register'], answer: 3 },
        { q: 'What is a thread?', options: ['A unit of execution within a process', 'A file permission', 'A storage sector', 'A device driver'], answer: 0 },
        { q: 'What is the purpose of a file system?', options: ['Schedule CPU instructions', 'Organize and manage files on storage', 'Route network traffic', 'Cool the processor'], answer: 1 },
        { q: 'What is a race condition?', options: ['A CPU speed benchmark', 'A disk seek operation', 'An outcome that depends on timing of concurrent operations', 'A process priority level'], answer: 2 },
        { q: 'What does a mutex help provide?', options: ['Virtual addressing', 'Disk partitioning', 'Network routing', 'Mutual exclusion for shared resources'], answer: 3 },
        { q: 'What is paging in memory management?', options: ['Dividing memory into fixed-size pages and frames', 'Printing pages from a document', 'Sorting files by name', 'Creating user accounts'], answer: 0 },
        { q: 'What does starvation mean in process scheduling?', options: ['A process uses no memory', 'A process waits indefinitely for needed resources or CPU time', 'The system has no files', 'A process has completed'], answer: 1 },
        { q: 'Which component typically mediates access between the OS and hardware devices?', options: ['Text editor', 'Web browser', 'Device driver', 'SQL query'], answer: 2 }
    ]
};

// ---- State ----
let currentUser = null;
let currentProfile = null;
let dbSubjects = [];
let selectedEnrolledSlugs = new Set(['programming', 'data-structures', 'databases']);
let tasks = [];
let currentView = 'dashboard';
let currentFilter = 'all';
let currentSubjectTab = 'all';
let searchQuery = '';
let subjectSearchQuery = '';
let subjectCategoryFilter = 'all';
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
    const found = dbSubjects.find(s => s.name.toLowerCase() === name.toLowerCase());
    return found ? found.id : null;
}

function getSubjectName(id) {
    const found = dbSubjects.find(s => s.id === id);
    return found ? found.name : id;
}

function subjectNames() {
    // Return names of active enrolled subjects or default list
    const enrolled = Array.from(selectedEnrolledSlugs).map(slug => {
        const sub = SUBJECTS_CATALOG.find(s => s.slug === slug);
        return sub ? sub.name : slug;
    });
    if (enrolled.length > 0) return enrolled.sort((a, b) => a.localeCompare(b));
    if (dbSubjects.length > 0) return dbSubjects.map(s => s.name).sort((a, b) => a.localeCompare(b));
    return CS_SUBJECTS.map(s => s.name).sort((a, b) => a.localeCompare(b));
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
}

// ---- Data Synchronization with Supabase ----
async function loadUserData() {
    try {
        const session = await getSession();
        if (!session) {
            window.location.href = 'auth/login.html';
            return;
        }

        currentUser = session.user;

        // Load student profile
        const { data: profile } = await getProfile(currentUser.id);
        currentProfile = profile;
        renderUserProfile();

        // Check if student completed onboarding
        if (!currentProfile?.onboarding_completed && location.hash !== '#quiz') {
            // First time student: show subjects & hierarchy selection
            showView('subjects');
        }

        // Load subjects
        const { data: enrolled } = await getStudentSubjects(currentUser.id);
        if (enrolled && enrolled.length > 0) {
            selectedEnrolledSlugs.clear();
            enrolled.forEach(s => {
                const slug = s.slug || (s.subject ? s.subject.slug : null) || (s.name ? s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : null);
                if (slug) selectedEnrolledSlugs.add(slug);
            });
        }

        // Load catalog
        const { data: subjectsData } = await getAllSubjects();
        if (subjectsData && subjectsData.length > 0) {
            dbSubjects = subjectsData;
        } else {
            dbSubjects = CS_SUBJECTS.map((s, idx) => ({ id: `subj-${idx}`, ...s }));
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
function initAcademicHierarchy() {
    const countryEl = document.getElementById('academic-country');
    const uniEl = document.getElementById('academic-university');
    const facEl = document.getElementById('academic-faculty');
    const majorEl = document.getElementById('academic-major');
    if (!countryEl || !uniEl) return;

    // Populate countries
    const countries = getCountries();
    countryEl.innerHTML = '<option value="">Select country...</option>' +
        countries.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');

    // Populate faculties
    if (facEl) {
        const faculties = getFaculties();
        facEl.innerHTML = '<option value="">Select faculty...</option>' +
            faculties.map(f => `<option value="${escapeHtml(f)}">${escapeHtml(f)}</option>`).join('');
    }

    const updateUniversities = () => {
        const country = countryEl.value;
        const universities = getUniversities(country);
        uniEl.innerHTML = '<option value="">Select university...</option>' +
            universities.map(u => `<option value="${escapeHtml(u)}">${escapeHtml(u)}</option>`).join('');
        if (currentProfile?.university) {
            uniEl.value = currentProfile.university;
        }
    };

    const updateMajors = () => {
        if (!facEl || !majorEl) return;
        const faculty = facEl.value;
        const majors = getMajors(faculty);
        majorEl.innerHTML = '<option value="">Select major...</option>' +
            majors.map(m => `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join('');
        if (currentProfile?.major) {
            majorEl.value = currentProfile.major;
        }
    };

    countryEl.addEventListener('change', updateUniversities);
    if (facEl) facEl.addEventListener('change', updateMajors);

    // Prefill from current profile
    if (currentProfile?.country) {
        countryEl.value = currentProfile.country;
        updateUniversities();
    }
    if (currentProfile?.faculty && facEl) {
        facEl.value = currentProfile.faculty;
        updateMajors();
    }
}

function renderScrollableSubjects() {
    const container = document.getElementById('subject-scroll-container');
    if (!container) return;

    const filtered = searchSubjects(subjectSearchQuery, subjectCategoryFilter);

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; padding: 24px; text-align: center;">
                <p class="muted">No subjects match "${escapeHtml(subjectSearchQuery)}". Try another search or filter.</p>
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
                    <span class="card-badge">${escapeHtml(subject.category || 'Core')}</span>
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

    if (selectedEnrolledSlugs.size === 0) {
        toast('Please select at least 1 subject to continue.');
        return;
    }

    // Convert selected slugs to subject objects
    const selectedList = SUBJECTS_CATALOG.filter(sub => selectedEnrolledSlugs.has(sub.slug));

    // Save subjects to PostgreSQL / local fallback
    await saveStudentSubjects(currentUser.id, selectedList);

    // Save profile with onboarding_completed = true
    await upsertProfile({
        id: currentUser.id,
        full_name: currentProfile?.full_name || currentUser.user_metadata?.full_name || 'Student',
        country,
        university,
        faculty,
        major,
        onboarding_completed: true
    });

    currentProfile = {
        ...(currentProfile || {}),
        country,
        university,
        faculty,
        major,
        onboarding_completed: true
    };

    fillSubjectSelects();
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
    const subjectRecord = dbSubjects.find((item) => item.slug === subject);
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
    const subject = document.getElementById('quiz-subject').value;
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

    setQuizStage('play');
    renderQuizQuestion();

    if (mode === 'rapid') {
        startRapidQuizTimer();
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
        const subjectRecord = dbSubjects.find(s => s.slug === quiz.subject);
        if (subjectRecord?.id && !String(subjectRecord.id).startsWith('subj-')) {
            const responses = quiz.questions.map((q, idx) => ({
                question_id: q.id,
                selected_answer: quiz.answers[idx] ?? -1,
                is_correct: quiz.answers[idx] === q.answer
            }));
            await saveQuizAttempt({
                studentId: currentUser.id,
                subjectId: subjectRecord.id,
                score: correctCount,
                totalQuestions: total,
                timeSpentSeconds: quiz.mode === 'rapid' ? (30 - quiz.timeLeft) : null,
                responses
            });
        }
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
                </li>
            `;
        }).join('');
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

                const newState = !task.completed;
                task.completed = newState;

                if (newState) {
                    const rect = toggleBtn.getBoundingClientRect();
                    burst(rect.left + rect.width / 2, rect.top + rect.height / 2);
                }

                await apiToggleTask(id, newState);
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
            tasks = tasks.filter(t => t.id !== id);
            await apiDeleteTask(id);
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

function initTheme() {
    const html = document.documentElement;
    const stored = localStorage.getItem(THEME_KEY);
    html.classList.toggle('dark', stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            html.classList.toggle('dark');
            localStorage.setItem(THEME_KEY, html.classList.contains('dark') ? 'dark' : 'light');
        });
    }
}

async function init() {
    initTheme();
    setupEventListeners();

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
