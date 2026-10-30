/**
 * Smart Study Companion — Application Core (ES Module)
 * 
 * Backed by Supabase PostgreSQL and Supabase Auth.
 * Preserves all original features (5 CS subjects, task CRUD, study plan filters,
 * progress tracking, standard & rapid quizzes, dark/light theme).
 */

import { supabase } from '../src/lib/supabase.js';
import {
    getCurrentUser,
    getSession,
    signOut,
    updatePassword,
    onAuthStateChange
} from '../src/services/auth.js';
import { getProfile, updateDisplayName } from '../src/services/profile.js';
import {
    getTasks,
    createTask as apiCreateTask,
    updateTask as apiUpdateTask,
    toggleTask as apiToggleTask,
    deleteTask as apiDeleteTask
} from '../src/services/tasks.js';
import { getDefaultSubjects, getAllSubjects } from '../src/services/subjects.js';
import { getQuizQuestions, saveQuizAttempt } from '../src/services/quiz.js';

// ---- Constants ----
const THEME_KEY = 'smart_study_theme';

const CS_SUBJECTS = [
    { name: 'Programming', slug: 'programming', icon: 'fa-code', description: 'Languages, logic, and software development' },
    { name: 'Data Structures & Algorithms', slug: 'data-structures', icon: 'fa-diagram-project', description: 'Core structures, searching, and sorting' },
    { name: 'Databases', slug: 'databases', icon: 'fa-database', description: 'SQL, data modeling, and storage' },
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

const QUIZ_SUBJECT_NAMES = {
    programming: 'Programming',
    'data-structures': 'Data Structures & Algorithms',
    databases: 'Databases',
    networks: 'Computer Networks',
    'operating-systems': 'Operating Systems'
};

// ---- State ----
let currentUser = null;
let currentProfile = null;
let dbSubjects = [];
let tasks = [];
let currentView = 'create';
let currentFilter = 'all';
let currentSubjectTab = 'all';
let searchQuery = '';
let pendingDelete = null;
let quiz = { subject: '', mode: 'standard', questions: [], index: 0, answers: [], timeLeft: 30, deadline: 0, finished: false };
let quizTimer = null;
let selectedCreateSubject = '';

// ---- Utilities ----
function escapeHtml(value) {
    return String(value)
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
    for (let i = 0; i < subject.length; i += 1) hash = subject.charCodeAt(i) + ((hash << 5) - hash);
    return palettes[Math.abs(hash) % palettes.length];
}

function formatDate(dateString) {
    const date = new Date(dateString);
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
    if (dbSubjects.length) {
        return dbSubjects.map(s => s.name).sort((a, b) => a.localeCompare(b));
    }
    return CS_SUBJECTS.map(s => s.name).sort((a, b) => a.localeCompare(b));
}

function fillSubjectSelects() {
    const names = subjectNames();
    const options = names.length
        ? names.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('')
        : '<option value="">Select a subject</option>';
    const select = document.getElementById('task-subject');
    if (select) select.innerHTML = options;
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

        // Load subjects from catalog
        const { data: subjectsData } = await getAllSubjects();
        if (subjectsData && subjectsData.length > 0) {
            dbSubjects = subjectsData;
        } else {
            dbSubjects = CS_SUBJECTS.map((s, idx) => ({ id: `subj-${idx}`, ...s }));
        }

        // Load student tasks from database
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
    currentView = view;
    ['create', 'plan', 'quiz'].forEach((name) => {
        const el = document.getElementById(`view-${name}`);
        if (el) el.hidden = name !== view;
    });
    document.querySelectorAll('.nav-link[data-view]').forEach((link) => {
        link.classList.toggle('is-active', link.dataset.view === view);
    });
    const titles = {
        create: 'Subjects & Tasks',
        plan: 'Study Plan',
        quiz: 'Quiz & Result'
    };
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = titles[view];

    const searchWrap = document.getElementById('search-wrap');
    if (searchWrap) searchWrap.hidden = view !== 'plan';

    const addTaskBtn = document.getElementById('add-task-btn');
    if (addTaskBtn) addTaskBtn.hidden = view === 'quiz';

    const goPlanBtn = document.getElementById('go-plan-btn');
    if (goPlanBtn) goPlanBtn.hidden = view === 'plan';

    if (location.hash !== `#${view}`) location.hash = view;
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
        if (currentSubjectTab !== 'all' && task.subject !== currentSubjectTab) return false;
        if (query && !`${task.subject} ${task.name}`.toLowerCase().includes(query)) return false;
        return true;
    }).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
}

function renderCreate() {
    const subjectGrid = document.getElementById('cs-subject-grid');
    if (!subjectGrid) return;

    subjectGrid.innerHTML = CS_SUBJECTS.map((subject) => {
        const taskCount = tasks.filter((task) => task.subject === subject.name).length;
        const colors = getSubjectColors(subject.name);
        return `<button class="cs-subject-card ${selectedCreateSubject === subject.name ? 'is-selected' : ''}"
                    type="button" data-create-subject="${escapeHtml(subject.name)}"
                    aria-pressed="${selectedCreateSubject === subject.name}" style="--subject-accent:${colors.color}">
            <span class="cs-subject-icon"><i class="fa-solid ${subject.icon}" aria-hidden="true"></i></span>
            <span class="cs-subject-copy">
                <strong>${escapeHtml(subject.name)}</strong>
                <span>${escapeHtml(subject.description)}</span>
            </span>
            <span class="cs-subject-count">${taskCount} task${taskCount === 1 ? '' : 's'}</span>
        </button>`;
    }).join('');

    const taskForm = document.getElementById('create-task-form');
    const selectedSubject = CS_SUBJECTS.find((subject) => subject.name === selectedCreateSubject);
    if (taskForm) {
        taskForm.hidden = !selectedSubject;
        document.getElementById('create-task-subject').value = selectedCreateSubject;
        document.getElementById('create-task-heading').textContent = selectedSubject
            ? `Add a ${selectedSubject.name} task`
            : 'Add a study task';
        document.getElementById('create-task-hint').textContent = selectedSubject
            ? `Add as many tasks as you need for ${selectedSubject.name}.`
            : 'Choose a subject to unlock the task form.';
    }

    const subjectTasksSection = document.getElementById('selected-subject-task-list');
    if (subjectTasksSection) {
        subjectTasksSection.hidden = !selectedSubject;
        if (selectedSubject) {
            const subjectTasks = tasks
                .filter((task) => task.subject === selectedSubject.name)
                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
            document.getElementById('selected-subject-task-title').textContent = `${selectedSubject.name} tasks`;
            document.getElementById('selected-subject-task-count').textContent =
                `${subjectTasks.length} task${subjectTasks.length === 1 ? '' : 's'}`;
            document.getElementById('selected-subject-tasks').innerHTML = subjectTasks.length
                ? subjectTasks.map((task) => `
                    <article class="selected-subject-task ${task.completed ? 'is-complete' : ''}">
                        <span class="selected-subject-task-status" aria-hidden="true">
                            <i class="fa-solid ${task.completed ? 'fa-circle-check' : 'fa-circle'}"></i>
                        </span>
                        <div>
                            <strong>${escapeHtml(task.name)}</strong>
                            <span>${formatDate(task.deadline)} · ${task.completed ? 'Completed' : 'Pending'}</span>
                        </div>
                    </article>
                `).join('')
                : '<p class="selected-subject-empty">No tasks for this subject yet. Add one above.</p>';
        }
    }

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
            sub.textContent = 'Take a quiz to check what you learned.';
        } else if (overdue > 0) {
            headline.textContent = 'Deadlines need attention';
            sub.textContent = next ? `Start with “${next.name}”.` : 'Clear overdue work first.';
        } else {
            headline.textContent = 'Your weekly plan';
            sub.textContent = next ? `Next up: ${next.name}.` : 'Create tasks, then track them here.';
        }
    }
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
            document.getElementById('empty-copy').textContent = 'Add a subject and task, or change filters.';
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
        const key = task.subject.trim();
        if (!indexMap.has(key)) {
            indexMap.set(key, grouped.length);
            grouped.push({ subject: task.subject, tasks: [] });
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

function quizQuestionsFor(subject, count) {
    const list = QUIZ_BANK[subject] || [];
    const questions = [...list];
    for (let index = questions.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [questions[index], questions[swapIndex]] = [questions[swapIndex], questions[index]];
    }
    return questions.slice(0, count);
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

    document.getElementById('quiz-title').textContent = `${QUIZ_SUBJECT_NAMES[quiz.subject]} ${quiz.mode === 'rapid' ? 'rapid quiz' : 'quiz'}`;
    document.getElementById('quiz-progress').textContent = `Question ${quiz.index + 1} of ${quiz.questions.length}`;
    document.getElementById('quiz-question').textContent = item.q;
    document.getElementById('quiz-options').innerHTML = item.options.map((option, index) => `
        <label class="choice ${quiz.answers[quiz.index] === index ? 'is-on' : ''}">
            <input type="radio" name="quiz-option" value="${index}" ${quiz.answers[quiz.index] === index ? 'checked' : ''}>
            ${escapeHtml(option)}
        </label>
    `).join('');
    document.getElementById('quiz-next-btn').textContent = quiz.index === quiz.questions.length - 1 ? 'Submit' : 'Next';
}

async function finishQuiz(timedOut = false) {
    if (quiz.finished) return;
    if (quiz.mode === 'rapid' && Date.now() >= quiz.deadline) timedOut = true;
    quiz.finished = true;
    clearQuizTimer();

    const correct = quiz.questions.reduce((sum, item, index) => sum + (quiz.answers[index] === item.answer ? 1 : 0), 0);
    const percent = Math.round((correct / quiz.questions.length) * 100);

    document.getElementById('quiz-score').textContent = `Marks: ${correct} / ${quiz.questions.length}`;
    document.getElementById('quiz-percent').textContent = `${percent}% correct`;

    const unanswered = quiz.answers.filter((answer) => answer == null).length;
    const modeLabel = quiz.mode === 'rapid' ? 'Rapid quiz' : 'Standard quiz';
    document.getElementById('quiz-review').textContent = `${timedOut ? 'Time is up. ' : ''}${modeLabel} · ${QUIZ_SUBJECT_NAMES[quiz.subject]} · ${correct} correct, ${quiz.questions.length - correct} incorrect${unanswered ? ` (${unanswered} unanswered)` : ''}.`;

    document.getElementById('quiz-answer-review').innerHTML = quiz.questions.map((item, index) => {
        const selected = quiz.answers[index] == null ? 'Not answered' : item.options[quiz.answers[index]];
        const isCorrect = quiz.answers[index] === item.answer;
        return `<li class="${isCorrect ? 'answer-correct' : 'answer-incorrect'}">
            <strong>${escapeHtml(item.q)}</strong>
            <span>Your answer: ${escapeHtml(selected)}</span>
            ${isCorrect ? '' : `<span>Correct answer: ${escapeHtml(item.options[item.answer])}</span>`}
        </li>`;
    }).join('');

    // Save quiz attempt to Supabase PostgreSQL
    if (currentUser) {
        const subjectId = getSubjectId(QUIZ_SUBJECT_NAMES[quiz.subject]);
        if (subjectId) {
            saveQuizAttempt({
                student_id: currentUser.id,
                subject_id: subjectId,
                mode: quiz.mode,
                score: correct,
                total_questions: quiz.questions.length,
                responses: quiz.questions.map((q, idx) => ({
                    question_id: q.id || null,
                    selected_answer: quiz.answers[idx] ?? null
                }))
            }).catch(err => console.warn('Could not save quiz attempt to database:', err));
        }
    }

    setQuizStage('result');
}

function render() {
    const curDate = document.getElementById('current-date');
    if (curDate) {
        curDate.textContent = new Date().toLocaleDateString(undefined, {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
        });
    }
    fillSubjectSelects();
    renderCreate();
    updateDashboard();
    renderSubjectTabs();
    renderTaskList();
}

function openModal(task) {
    const modal = document.getElementById('task-modal');
    fillSubjectSelects();
    document.getElementById('task-id').value = task.id;
    document.getElementById('task-subject').value = task.subject;
    document.getElementById('task-name').value = task.name;
    document.getElementById('task-deadline').value = formatForInput(task.deadline);
    modal.hidden = false;
}

function closeModal() {
    document.getElementById('task-modal').hidden = true;
}

function setupEventListeners() {
    const overlay = document.getElementById('mobile-overlay');
    const openSide = document.getElementById('open-sidebar-btn');
    const closeSide = document.getElementById('close-sidebar-btn');

    if (openSide) {
        openSide.addEventListener('click', () => {
            document.getElementById('sidebar').classList.add('is-open');
            if (overlay) overlay.hidden = false;
        });
    }
    if (closeSide) {
        closeSide.addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('is-open');
            if (overlay) overlay.hidden = true;
        });
    }
    if (overlay) {
        overlay.addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('is-open');
            overlay.hidden = true;
        });
    }

    // Navigation links
    document.querySelectorAll('.nav-link[data-view]').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            showView(link.dataset.view);
            document.getElementById('sidebar').classList.remove('is-open');
            if (overlay) overlay.hidden = true;
        });
    });

    const goPlan = document.getElementById('go-plan-btn');
    if (goPlan) goPlan.addEventListener('click', () => showView('plan'));

    const addTask = document.getElementById('add-task-btn');
    if (addTask) {
        addTask.addEventListener('click', () => {
            showView('create');
            if (selectedCreateSubject) {
                document.getElementById('create-task-name').focus();
            } else {
                const firstCard = document.querySelector('[data-create-subject]');
                if (firstCard) firstCard.focus();
            }
        });
    }

    const emptyGoCreate = document.getElementById('empty-goto-create');
    if (emptyGoCreate) emptyGoCreate.addEventListener('click', () => showView('create'));

    const startQuiz = document.getElementById('start-quiz-btn');
    if (startQuiz) startQuiz.addEventListener('click', () => showView('quiz'));

    // Subject selection on Create view
    const csGrid = document.getElementById('cs-subject-grid');
    if (csGrid) {
        csGrid.addEventListener('click', (event) => {
            const card = event.target.closest('[data-create-subject]');
            if (!card) return;
            selectedCreateSubject = card.getAttribute('data-create-subject');
            renderCreate();
            const taskInput = document.getElementById('create-task-name');
            if (taskInput) taskInput.focus();
        });
    }

    // Recent tasks delete button
    const recentTasks = document.getElementById('recent-tasks');
    if (recentTasks) {
        recentTasks.addEventListener('click', (event) => {
            const button = event.target.closest('[data-delete-recent-task]');
            if (!button) return;
            const id = button.getAttribute('data-delete-recent-task');
            const task = tasks.find((item) => item.id === id);
            if (!task) return;
            pendingDelete = { type: 'task', id };
            document.getElementById('confirm-copy').textContent = `“${task.name}” will be removed.`;
            document.getElementById('confirm-modal').hidden = false;
        });
    }

    // Create task form submit
    const createForm = document.getElementById('create-task-form');
    if (createForm) {
        createForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (!CS_SUBJECTS.some((subject) => subject.name === selectedCreateSubject)) {
                toast('Choose a computer science subject first');
                return;
            }
            const name = document.getElementById('create-task-name').value.trim();
            const subject = selectedCreateSubject;
            const day = document.getElementById('create-task-deadline').value;
            const deadline = new Date(`${day}T17:00`).toISOString();
            const subjectId = getSubjectId(subject);

            // Database insert via Supabase
            if (currentUser && subjectId) {
                const { data: created, error } = await apiCreateTask({
                    student_id: currentUser.id,
                    subject_id: subjectId,
                    title: name,
                    deadline
                });

                if (error) {
                    toast(`Error: ${error.message}`);
                } else if (created) {
                    tasks.push({
                        id: created.id,
                        subject: created.subject?.name || subject,
                        subject_id: created.subject_id,
                        name: created.title,
                        deadline: created.deadline,
                        completed: created.completed
                    });
                    toast('Task saved to cloud database');
                }
            } else {
                // Local fallback
                tasks.push({ id: Math.random().toString(36).slice(2, 11), subject, name, deadline, completed: false });
                toast('Task created');
            }

            createForm.reset();
            document.getElementById('create-task-deadline').value = dateInputValue();
            render();
        });
    }

    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            searchQuery = event.target.value;
            renderTaskList();
        });
    }

    // Filters
    document.querySelectorAll('.filter-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach((item) => item.classList.remove('is-on'));
            btn.classList.add('is-on');
            currentFilter = btn.dataset.filter;
            renderTaskList();
        });
    });

    // Subject tabs
    const subjectTabs = document.getElementById('subject-tabs');
    if (subjectTabs) {
        subjectTabs.addEventListener('click', (event) => {
            const tab = event.target.closest('[data-subject]');
            if (!tab) return;
            currentSubjectTab = tab.dataset.subject;
            renderSubjectTabs();
            renderTaskList();
        });
    }

    // Task actions (toggle, edit, delete)
    const taskContainer = document.getElementById('task-container');
    if (taskContainer) {
        taskContainer.addEventListener('click', async (event) => {
            const toggleBtn = event.target.closest('.toggle-btn');
            const deleteBtn = event.target.closest('.delete-btn');
            const editBtn = event.target.closest('.edit-btn');

            if (toggleBtn) {
                const task = tasks.find((item) => item.id === toggleBtn.dataset.id);
                if (!task) return;
                task.completed = !task.completed;

                if (currentUser && !task.id.startsWith('mock')) {
                    apiToggleTask(task.id, task.completed).catch(err => console.warn(err));
                }

                render();
                toast(task.completed ? 'Marked completed' : 'Marked pending');
                if (task.completed) burst(event.clientX, event.clientY);
            }

            if (deleteBtn) {
                const task = tasks.find((item) => item.id === deleteBtn.dataset.id);
                pendingDelete = { type: 'task', id: deleteBtn.dataset.id };
                document.getElementById('confirm-copy').textContent = task ? `“${task.name}” will be removed.` : 'This cannot be undone.';
                document.getElementById('confirm-modal').hidden = false;
            }

            if (editBtn) {
                const task = tasks.find((item) => item.id === editBtn.dataset.id);
                if (task) openModal(task);
            }
        });
    }

    // Edit modal submit
    const taskForm = document.getElementById('task-form');
    if (taskForm) {
        taskForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const id = document.getElementById('task-id').value;
            const newSubject = document.getElementById('task-subject').value;
            const newName = document.getElementById('task-name').value.trim();
            const newDeadline = new Date(document.getElementById('task-deadline').value).toISOString();

            const index = tasks.findIndex((task) => task.id === id);
            if (index > -1) {
                const subjectId = getSubjectId(newSubject);
                tasks[index] = {
                    ...tasks[index],
                    subject: newSubject,
                    subject_id: subjectId,
                    name: newName,
                    deadline: newDeadline
                };

                if (currentUser && !id.startsWith('mock')) {
                    await apiUpdateTask(id, {
                        title: newName,
                        subject_id: subjectId,
                        deadline: newDeadline
                    });
                }

                render();
                toast('Task updated in database');
            }
            closeModal();
        });
    }

    // Modal close buttons
    const closeModalBtn = document.getElementById('close-modal-btn');
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

    const modalBackdrop = document.getElementById('modal-backdrop');
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // Delete confirmation
    const confirmCancel = document.getElementById('confirm-cancel');
    if (confirmCancel) {
        confirmCancel.addEventListener('click', () => {
            document.getElementById('confirm-modal').hidden = true;
            pendingDelete = null;
        });
    }

    const confirmBackdrop = document.getElementById('confirm-backdrop');
    if (confirmBackdrop) {
        confirmBackdrop.addEventListener('click', () => {
            document.getElementById('confirm-modal').hidden = true;
            pendingDelete = null;
        });
    }

    const confirmDelete = document.getElementById('confirm-delete');
    if (confirmDelete) {
        confirmDelete.addEventListener('click', async () => {
            if (pendingDelete?.type === 'task') {
                const taskId = pendingDelete.id;
                tasks = tasks.filter((task) => task.id !== taskId);
                if (currentUser && !taskId.startsWith('mock')) {
                    await apiDeleteTask(taskId);
                }
            }
            pendingDelete = null;
            document.getElementById('confirm-modal').hidden = true;
            render();
            toast('Removed from database');
        });
    }

    // Quiz triggers
    const quizStart = document.getElementById('quiz-start-btn');
    if (quizStart) {
        quizStart.addEventListener('click', () => {
            const subject = document.getElementById('quiz-subject').value;
            quiz = { subject, mode: 'standard', questions: quizQuestionsFor(subject, 15), index: 0, answers: [], timeLeft: 30, deadline: 0, finished: false };
            setQuizStage('play');
            renderQuizQuestion();
        });
    }

    const quizRapid = document.getElementById('quiz-rapid-btn');
    if (quizRapid) {
        quizRapid.addEventListener('click', () => {
            const subject = document.getElementById('quiz-subject').value;
            quiz = { subject, mode: 'rapid', questions: quizQuestionsFor(subject, 10), index: 0, answers: [], timeLeft: 30, deadline: 0, finished: false };
            setQuizStage('play');
            renderQuizQuestion();
            startRapidQuizTimer();
        });
    }

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

    // Profile Name Update Form
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

    // Profile Password Update Form
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
            document.getElementById('confirm-modal').hidden = true;
        }
        if (!typing && event.key === '/') {
            event.preventDefault();
            showView('plan');
            const searchEl = document.getElementById('search-input');
            if (searchEl) searchEl.focus();
        }
    });

    // Hash change router
    window.addEventListener('hashchange', () => {
        const view = location.hash.replace('#', '');
        if (['create', 'plan', 'quiz'].includes(view) && view !== currentView) showView(view);
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
    showView(['create', 'plan', 'quiz'].includes(initial) ? initial : 'create');

    // Load user data from Supabase
    await loadUserData();

    // Listen for auth state changes (e.g. token expired, logged out)
    onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
            window.location.href = 'auth/login.html';
        }
    });

    setInterval(updateDashboard, 60000);
}

document.addEventListener('DOMContentLoaded', init);

