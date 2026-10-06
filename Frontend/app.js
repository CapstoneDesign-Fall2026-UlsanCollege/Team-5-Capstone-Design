const TASKS_KEY = 'smart_study_tasks';
const SUBJECTS_KEY = 'smart_study_subjects';
const THEME_KEY = 'smart_study_theme';
const QUIZ_KEY = 'smart_study_quiz_last';

const QUIZ_BANK = {
    programming: [
        { q: 'Which structure is last-in, first-out?', options: ['Queue', 'Stack', 'Set', 'Tree'], answer: 1 },
        { q: 'What does HTML stand for?', options: ['HyperText Markup Language', 'High Transfer Machine Language', 'Home Tool Markup List', 'Hyperlink Text Mode'], answer: 0 },
        { q: 'A loop that never ends is called a:', options: ['For loop', 'Infinite loop', 'Break loop', 'Range loop'], answer: 1 },
        { q: 'Which language is primarily used to style web pages?', options: ['CSS', 'SQL', 'C', 'Bash'], answer: 0 },
        { q: 'What does a Boolean value represent?', options: ['A decimal number', 'True or false', 'A text paragraph', 'A file path'], answer: 1 },
        { q: 'Which data structure stores key-value pairs?', options: ['Stack', 'Queue', 'Map', 'Array only'], answer: 2 },
        { q: 'What is the purpose of a function?', options: ['To group reusable instructions', 'To store images', 'To stop the computer', 'To format a hard drive'], answer: 0 },
        { q: 'Which is a valid JavaScript declaration keyword?', options: ['define', 'let', 'make', 'dim'], answer: 1 },
        { q: 'What does an array commonly store?', options: ['An ordered collection of values', 'Only one boolean', 'A network connection', 'A browser window'], answer: 0 },
        { q: 'What does debugging help a programmer do?', options: ['Find and fix errors', 'Compress a monitor', 'Create a password', 'Install a keyboard'], answer: 0 }
    ],
    math: [
        { q: 'What is 7 × 8?', options: ['54', '56', '64', '48'], answer: 1 },
        { q: 'The slope of a horizontal line is:', options: ['Undefined', '1', '0', '-1'], answer: 2 },
        { q: 'π is approximately:', options: ['2.14', '3.14', '4.13', '1.41'], answer: 1 },
        { q: 'What is 15% of 200?', options: ['15', '20', '30', '40'], answer: 2 },
        { q: 'What is the area of a rectangle 5 units by 3 units?', options: ['8 square units', '15 square units', '16 square units', '30 square units'], answer: 1 },
        { q: 'What is the next prime number after 7?', options: ['9', '10', '11', '12'], answer: 2 },
        { q: 'Solve: 3x = 21.', options: ['6', '7', '8', '9'], answer: 1 },
        { q: 'What is the median of 2, 4, and 9?', options: ['2', '4', '5', '9'], answer: 1 },
        { q: 'How many degrees are in a right angle?', options: ['45', '90', '180', '360'], answer: 1 },
        { q: 'What is 2⁵?', options: ['10', '16', '25', '32'], answer: 3 }
    ],
    calculus: [
        { q: 'The derivative of x² is:', options: ['x', '2x', 'x²', '2'], answer: 1 },
        { q: 'An integral finds:', options: ['Slope', 'Area under a curve', 'A root', 'A limit only'], answer: 1 },
        { q: 'The limit of 1/x as x → ∞ is:', options: ['∞', '1', '0', '-1'], answer: 2 },
        { q: 'What is the derivative of a constant?', options: ['The constant', 'Zero', 'One', 'Undefined'], answer: 1 },
        { q: 'What is the derivative of x³?', options: ['3x²', 'x²', '3x', 'x⁴'], answer: 0 },
        { q: 'The derivative of sin(x) is:', options: ['-sin(x)', 'cos(x)', '-cos(x)', 'tan(x)'], answer: 1 },
        { q: 'What does a definite integral commonly represent geometrically?', options: ['Signed area over an interval', 'A tangent line only', 'The y-intercept', 'A sequence'], answer: 0 },
        { q: 'A function is continuous at a point when its limit there:', options: ['Is zero', 'Equals the function value', 'Is infinite', 'Does not exist'], answer: 1 },
        { q: 'What is the derivative of eˣ?', options: ['x·eˣ', 'eˣ', 'ln(x)', '1/eˣ'], answer: 1 },
        { q: 'The chain rule is used to differentiate:', options: ['A composite function', 'A constant only', 'A matrix', 'A geometric series'], answer: 0 }
    ],
    physics: [
        { q: 'Force equals:', options: ['mv', 'ma', 'm/a', 'a/m'], answer: 1 },
        { q: 'Unit of energy is the:', options: ['Newton', 'Watt', 'Joule', 'Pascal'], answer: 2 },
        { q: 'Speed is:', options: ['Distance / time', 'Mass × velocity', 'Force / area', 'Work × time'], answer: 0 },
        { q: 'What is the SI unit of electric current?', options: ['Volt', 'Ampere', 'Ohm', 'Coulomb'], answer: 1 },
        { q: 'What is the approximate acceleration due to gravity near Earth?', options: ['0.98 m/s²', '9.8 m/s²', '98 m/s²', '980 m/s²'], answer: 1 },
        { q: 'Which quantity is measured in watts?', options: ['Power', 'Force', 'Mass', 'Distance'], answer: 0 },
        { q: 'In a vacuum, light travels:', options: ['At a constant speed', 'Only downhill', 'At the speed of sound', 'Only through water'], answer: 0 },
        { q: 'Newton’s third law says forces occur in:', options: ['Equal and opposite pairs', 'Unequal pairs in one direction', 'Circular paths only', 'Pairs with no interaction'], answer: 0 },
        { q: 'Which type of energy does a moving object have?', options: ['Chemical', 'Kinetic', 'Nuclear', 'Potential only'], answer: 1 },
        { q: 'What is the SI unit of frequency?', options: ['Hertz', 'Joule', 'Tesla', 'Newton'], answer: 0 }
    ],
    history: [
        { q: 'The Renaissance began in:', options: ['England', 'Italy', 'Russia', 'Egypt'], answer: 1 },
        { q: 'A primary source is:', options: ['A textbook summary', 'A firsthand account', 'A Wikipedia page', 'A later analysis'], answer: 1 },
        { q: 'WWII ended in:', options: ['1918', '1939', '1945', '1963'], answer: 2 },
        { q: 'The Magna Carta was sealed in which year?', options: ['1066', '1215', '1492', '1776'], answer: 1 },
        { q: 'Which ancient civilization built the pyramids at Giza?', options: ['Ancient Egypt', 'Ancient Greece', 'The Maya', 'The Romans'], answer: 0 },
        { q: 'The printing press associated with Gutenberg spread in which century?', options: ['11th', '13th', '15th', '18th'], answer: 2 },
        { q: 'Which event began the French Revolution in 1789?', options: ['Storming of the Bastille', 'Battle of Waterloo', 'Signing of the Magna Carta', 'Boston Tea Party'], answer: 0 },
        { q: 'The Silk Road connected trade routes between Europe and:', options: ['East Asia', 'South America', 'Antarctica', 'The Caribbean only'], answer: 0 },
        { q: 'Who was the first president of the United States?', options: ['Thomas Jefferson', 'John Adams', 'George Washington', 'James Madison'], answer: 2 },
        { q: 'The Berlin Wall fell in which year?', options: ['1961', '1975', '1989', '1999'], answer: 2 }
    ]
};

let subjects = [];
let tasks = [];
let currentView = 'create';
let currentFilter = 'all';
let currentSubjectTab = 'all';
let searchQuery = '';
let pendingDelete = null;
let quiz = { subject: '', questions: [], index: 0, answers: [] };

const generateId = () => Math.random().toString(36).slice(2, 11);

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
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    document.getElementById('toast-stack').appendChild(el);
    setTimeout(() => el.remove(), 2400);
}

function burst(x, y) {
    const layer = document.getElementById('burst-layer');
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

function persist() {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
}

function ensureSubject(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const exists = subjects.some((subject) => subject.name.toLowerCase() === trimmed.toLowerCase());
    if (!exists) subjects.push({ id: generateId(), name: trimmed });
}

function loadData() {
    const storedTasks = localStorage.getItem(TASKS_KEY);
    const storedSubjects = localStorage.getItem(SUBJECTS_KEY);

    if (storedTasks) tasks = JSON.parse(storedTasks);
    if (storedSubjects) subjects = JSON.parse(storedSubjects);

    if (!storedTasks && !storedSubjects) {
        subjects = [
            { id: generateId(), name: 'Computer Science' },
            { id: generateId(), name: 'Calculus' }
        ];
        tasks = [
            { id: generateId(), subject: 'Computer Science', name: 'Finish Data Structures assignment', deadline: new Date(Date.now() + 86400000).toISOString(), completed: false },
            { id: generateId(), subject: 'Calculus', name: 'Review Chapter 5 notes', deadline: new Date(Date.now() - 3600000).toISOString(), completed: true }
        ];
        persist();
        return;
    }

    tasks.forEach((task) => ensureSubject(task.subject));
    persist();
}

function subjectNames() {
    return subjects.map((subject) => subject.name).sort((a, b) => a.localeCompare(b));
}

function fillSubjectSelects() {
    const names = subjectNames();
    const options = names.length
        ? names.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('')
        : '<option value="">Add a subject first</option>';
    document.getElementById('create-task-subject').innerHTML = options;
    document.getElementById('task-subject').innerHTML = options;
}

function showView(view) {
    currentView = view;
    ['create', 'plan', 'quiz'].forEach((name) => {
        document.getElementById(`view-${name}`).hidden = name !== view;
    });
    document.querySelectorAll('.nav-link[data-view]').forEach((link) => {
        link.classList.toggle('is-active', link.dataset.view === view);
    });
    const titles = {
        create: 'Subjects & Tasks',
        plan: 'Study Plan',
        quiz: 'Quiz & Result'
    };
    document.getElementById('page-title').textContent = titles[view];
    document.getElementById('search-wrap').hidden = view !== 'plan';
    document.getElementById('add-task-btn').hidden = view === 'quiz';
    document.getElementById('go-plan-btn').hidden = view === 'plan';
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
    const chips = document.getElementById('subject-chips');
    chips.innerHTML = subjects.map((subject) => {
        const colors = getSubjectColors(subject.name);
        return `<button class="subject-pill" type="button" data-remove-subject="${subject.id}" style="color:${colors.color}">
            ${escapeHtml(subject.name)} <span aria-label="Remove">×</span>
        </button>`;
    }).join('');
    document.getElementById('subject-empty').hidden = subjects.length > 0;
    document.getElementById('create-task-form').querySelector('button').disabled = subjects.length === 0;

    const recent = [...tasks].reverse().slice(0, 8);
    document.getElementById('recent-count').textContent = `${tasks.length} task${tasks.length === 1 ? '' : 's'} saved locally`;
    const list = document.getElementById('recent-tasks');
    const empty = document.getElementById('create-empty');
    if (recent.length === 0) {
        list.innerHTML = '';
        empty.hidden = false;
        empty.classList.add('is-visible');
        return;
    }
    empty.hidden = true;
    empty.classList.remove('is-visible');
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

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-completed').textContent = completed;
    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-progress-text').textContent = `${percentage}%`;
    document.getElementById('orb-fill').style.strokeDashoffset = String(314 - (314 * percentage) / 100);
    document.getElementById('pill-pending').textContent = `${pending} pending`;
    document.getElementById('pill-overdue').textContent = `${overdue} overdue`;
    document.getElementById('count-all').textContent = total;
    document.getElementById('count-pending').textContent = pending;
    document.getElementById('count-completed').textContent = completed;
    document.getElementById('focus-title').textContent = next ? next.name : 'No pending tasks';
    document.getElementById('focus-meta').textContent = next ? `${next.subject} · ${relativeDeadline(next.deadline, false)}` : 'Add a subject, then a task';

    const headline = document.getElementById('hero-headline');
    const sub = document.getElementById('hero-sub');
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

function renderTaskList() {
    const filtered = visibleTasks();
    const taskContainer = document.getElementById('task-container');
    const emptyState = document.getElementById('empty-state');
    taskContainer.innerHTML = '';

    if (filtered.length === 0) {
        emptyState.hidden = false;
        emptyState.classList.add('is-visible');
        document.getElementById('empty-title').textContent = searchQuery ? 'No matches' : 'Nothing in this view';
        document.getElementById('empty-copy').textContent = 'Add a subject and task, or change filters.';
        return;
    }

    emptyState.hidden = true;
    emptyState.classList.remove('is-visible');

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

function quizQuestionsFor() {
    return Object.entries(QUIZ_BANK)
        .flatMap(([, questions]) => questions);
}

function setQuizStage(stage) {
    document.getElementById('quiz-setup').hidden = stage !== 'setup';
    document.getElementById('quiz-play').hidden = stage !== 'play';
    document.getElementById('quiz-result').hidden = stage !== 'result';
}

function renderQuizQuestion() {
    const item = quiz.questions[quiz.index];
    document.getElementById('quiz-title').textContent = `${quiz.subject} quiz`;
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

function finishQuiz() {
    const correct = quiz.questions.reduce((sum, item, index) => sum + (quiz.answers[index] === item.answer ? 1 : 0), 0);
    const percent = Math.round((correct / quiz.questions.length) * 100);
    document.getElementById('quiz-score').textContent = `Marks: ${correct} / ${quiz.questions.length}`;
    document.getElementById('quiz-percent').textContent = `${percent}% correct`;
    document.getElementById('quiz-review').textContent = `${correct} correct, ${quiz.questions.length - correct} incorrect across mixed topics.`;
    localStorage.setItem(QUIZ_KEY, JSON.stringify({ subject: quiz.subject, correct, total: quiz.questions.length, percent }));
    setQuizStage('result');
}

function render() {
    document.getElementById('current-date').textContent = new Date().toLocaleDateString(undefined, {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
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
    document.getElementById('open-sidebar-btn').addEventListener('click', () => {
        document.getElementById('sidebar').classList.add('is-open');
        overlay.hidden = false;
    });
    document.getElementById('close-sidebar-btn').addEventListener('click', () => {
        document.getElementById('sidebar').classList.remove('is-open');
        overlay.hidden = true;
    });
    overlay.addEventListener('click', () => {
        document.getElementById('sidebar').classList.remove('is-open');
        overlay.hidden = true;
    });

    document.querySelectorAll('.nav-link[data-view]').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            showView(link.dataset.view);
            document.getElementById('sidebar').classList.remove('is-open');
            overlay.hidden = true;
        });
    });

    document.getElementById('go-plan-btn').addEventListener('click', () => showView('plan'));
    document.getElementById('add-task-btn').addEventListener('click', () => {
        showView('create');
        document.getElementById('create-task-name').focus();
    });
    document.getElementById('empty-goto-create').addEventListener('click', () => showView('create'));
    document.getElementById('start-quiz-btn').addEventListener('click', () => showView('quiz'));

    document.getElementById('subject-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('subject-name').value.trim();
        if (!name) return;
        ensureSubject(name);
        document.getElementById('subject-name').value = '';
        persist();
        render();
        toast(`Subject “${name}” saved`);
    });

    document.getElementById('subject-chips').addEventListener('click', (event) => {
        const btn = event.target.closest('[data-remove-subject]');
        if (!btn) return;
        const id = btn.getAttribute('data-remove-subject');
        const subject = subjects.find((item) => item.id === id);
        pendingDelete = { type: 'subject', id };
        document.getElementById('confirm-copy').textContent = subject
            ? `Remove “${subject.name}”? Tasks for this subject stay in the plan.`
            : 'Remove this subject?';
        document.getElementById('confirm-modal').hidden = false;
    });

    document.getElementById('recent-tasks').addEventListener('click', (event) => {
        const button = event.target.closest('[data-delete-recent-task]');
        if (!button) return;
        const id = button.getAttribute('data-delete-recent-task');
        const task = tasks.find((item) => item.id === id);
        if (!task) return;
        pendingDelete = { type: 'task', id };
        document.getElementById('confirm-copy').textContent = `“${task.name}” will be removed.`;
        document.getElementById('confirm-modal').hidden = false;
    });

    document.getElementById('create-task-form').addEventListener('submit', (event) => {
        event.preventDefault();
        if (subjects.length === 0) {
            toast('Add a subject first');
            return;
        }
        const name = document.getElementById('create-task-name').value.trim();
        const subject = document.getElementById('create-task-subject').value;
        const day = document.getElementById('create-task-deadline').value;
        const deadline = new Date(`${day}T17:00`).toISOString();
        tasks.push({ id: generateId(), subject, name, deadline, completed: false });
        persist();
        document.getElementById('create-task-form').reset();
        document.getElementById('create-task-deadline').value = dateInputValue();
        render();
        toast('Task saved in this browser');
    });

    document.getElementById('search-input').addEventListener('input', (event) => {
        searchQuery = event.target.value;
        renderTaskList();
    });

    document.querySelectorAll('.filter-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach((item) => item.classList.remove('is-on'));
            btn.classList.add('is-on');
            currentFilter = btn.dataset.filter;
            renderTaskList();
        });
    });

    document.getElementById('subject-tabs').addEventListener('click', (event) => {
        const tab = event.target.closest('[data-subject]');
        if (!tab) return;
        currentSubjectTab = tab.dataset.subject;
        renderSubjectTabs();
        renderTaskList();
    });

    document.getElementById('task-container').addEventListener('click', (event) => {
        const toggleBtn = event.target.closest('.toggle-btn');
        const deleteBtn = event.target.closest('.delete-btn');
        const editBtn = event.target.closest('.edit-btn');
        if (toggleBtn) {
            const task = tasks.find((item) => item.id === toggleBtn.dataset.id);
            if (!task) return;
            task.completed = !task.completed;
            persist();
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

    document.getElementById('task-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const id = document.getElementById('task-id').value;
        const index = tasks.findIndex((task) => task.id === id);
        if (index > -1) {
            tasks[index] = {
                ...tasks[index],
                subject: document.getElementById('task-subject').value,
                name: document.getElementById('task-name').value.trim(),
                deadline: new Date(document.getElementById('task-deadline').value).toISOString()
            };
            persist();
            render();
            toast('Task updated');
        }
        closeModal();
    });

    document.getElementById('close-modal-btn').addEventListener('click', closeModal);
    document.getElementById('cancel-modal-btn').addEventListener('click', closeModal);
    document.getElementById('modal-backdrop').addEventListener('click', closeModal);

    document.getElementById('confirm-cancel').addEventListener('click', () => {
        document.getElementById('confirm-modal').hidden = true;
        pendingDelete = null;
    });
    document.getElementById('confirm-backdrop').addEventListener('click', () => {
        document.getElementById('confirm-modal').hidden = true;
        pendingDelete = null;
    });
    document.getElementById('confirm-delete').addEventListener('click', () => {
        if (pendingDelete?.type === 'task') tasks = tasks.filter((task) => task.id !== pendingDelete.id);
        if (pendingDelete?.type === 'subject') subjects = subjects.filter((subject) => subject.id !== pendingDelete.id);
        pendingDelete = null;
        document.getElementById('confirm-modal').hidden = true;
        persist();
        render();
        toast('Removed');
    });

    document.getElementById('quiz-start-btn').addEventListener('click', () => {
        quiz = { subject: 'Mixed topics', questions: quizQuestionsFor(), index: 0, answers: [] };
        setQuizStage('play');
        renderQuizQuestion();
    });
    document.getElementById('quiz-options').addEventListener('change', (event) => {
        quiz.answers[quiz.index] = Number(event.target.value);
        renderQuizQuestion();
    });
    document.getElementById('quiz-next-btn').addEventListener('click', () => {
        if (quiz.answers[quiz.index] == null) {
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
    document.getElementById('quiz-back-btn').addEventListener('click', () => {
        if (quiz.index === 0) {
            setQuizStage('setup');
            return;
        }
        quiz.index -= 1;
        renderQuizQuestion();
    });
    document.getElementById('quiz-retake-btn').addEventListener('click', () => setQuizStage('setup'));
    document.getElementById('quiz-to-plan-btn').addEventListener('click', () => showView('plan'));

    document.addEventListener('keydown', (event) => {
        const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName);
        if (event.key === 'Escape') {
            closeModal();
            document.getElementById('confirm-modal').hidden = true;
        }
        if (!typing && event.key === '/') {
            event.preventDefault();
            showView('plan');
            document.getElementById('search-input').focus();
        }
    });

    window.addEventListener('hashchange', () => {
        const view = location.hash.replace('#', '');
        if (['create', 'plan', 'quiz'].includes(view) && view !== currentView) showView(view);
    });
}

function initTheme() {
    const html = document.documentElement;
    const stored = localStorage.getItem(THEME_KEY);
    html.classList.toggle('dark', stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.getElementById('theme-toggle-btn').addEventListener('click', () => {
        html.classList.toggle('dark');
        localStorage.setItem(THEME_KEY, html.classList.contains('dark') ? 'dark' : 'light');
    });
}

function init() {
    initTheme();
    loadData();
    setupEventListeners();
    document.getElementById('create-task-deadline').value = dateInputValue();
    const initial = location.hash.replace('#', '');
    showView(['create', 'plan', 'quiz'].includes(initial) ? initial : 'create');
    setInterval(updateDashboard, 60000);
}

document.addEventListener('DOMContentLoaded', init);
