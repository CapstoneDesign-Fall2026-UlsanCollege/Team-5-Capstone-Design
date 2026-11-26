/**
 * Task Service
 *
 * Supports both live Supabase PostgreSQL queries and local storage fallback,
 * including optional multiline Task Description / Details (up to 1000 chars).
 */
import { supabase, isConfigured } from '../lib/supabase.js';
import { MAX_TASK_DESCRIPTION_LENGTH, normalizeOptionalDescription } from '../lib/time-schedule.js';

const LOCAL_TASKS_KEY = 'smart_study_tasks';
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getLocalTasks() {
  try {
    const raw = localStorage.getItem(LOCAL_TASKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function saveLocalTasks(tasks) {
  localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(tasks));
}

function isMissingDescriptionColumnError(error) {
  const msg = String(error?.message || '').toLowerCase();
  const code = String(error?.code || '');
  return (code === '42703' || code === 'PGRST204') && msg.includes('description');
}

export async function getTasks(studentId) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, subject:subjects(id, name, slug)')
        .eq('student_id', studentId)
        .order('deadline', { ascending: true });
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  const tasks = getLocalTasks();
  return { data: tasks, error: null };
}

export async function getTasksBySubject(studentId, subjectId) {
  if (isConfigured) {
    return supabase
      .from('tasks')
      .select('*, subject:subjects(id, name, slug)')
      .eq('student_id', studentId)
      .eq('subject_id', subjectId)
      .order('deadline', { ascending: true });
  }

  const tasks = getLocalTasks().filter(t => t.subject_id === subjectId || t.subject === subjectId);
  return { data: tasks, error: null };
}

export async function createTask(task) {
  const studentId = task.student_id || task.studentId;
  const subjectId = task.subject_id || task.subjectId;
  const title = String(task.title || '').trim();

  if (!title || title.length > 500) {
    return { data: null, error: { message: 'Task title must be between 1 and 500 characters.' } };
  }
  if (!task.deadline || Number.isNaN(new Date(task.deadline).getTime())) {
    return { data: null, error: { message: 'Please enter a valid deadline date and time.' } };
  }

  const descCheck = normalizeOptionalDescription(task.description, MAX_TASK_DESCRIPTION_LENGTH);
  if (!descCheck.valid) {
    return { data: null, error: { message: descCheck.error } };
  }

  if (isConfigured && studentId && !String(studentId).startsWith('local-')) {
    if (!UUID_REGEX.test(String(subjectId || ''))) {
      return { data: null, error: { message: 'Could not resolve the subject ID in Supabase. Please save your subjects first.' } };
    }
    const insertPayload = {
      student_id: studentId,
      subject_id: subjectId,
      title,
      description: descCheck.value,
      deadline: task.deadline,
      completed: Boolean(task.completed),
    };
    const res = await supabase
      .from('tasks')
      .insert(insertPayload)
      .select('*, subject:subjects(id, name, slug)')
      .single();

    if (res.error && isMissingDescriptionColumnError(res.error) && descCheck.value === null) {
      const { description: _omitted, ...legacyPayload } = insertPayload;
      return supabase
        .from('tasks')
        .insert(legacyPayload)
        .select('*, subject:subjects(id, name, slug)')
        .single();
    }
    return res;
  }

  const tasks = getLocalTasks();
  const newTask = {
    id: 'local-task-' + Math.random().toString(36).slice(2, 9),
    student_id: studentId,
    subject_id: subjectId,
    title,
    description: descCheck.value,
    deadline: task.deadline,
    completed: Boolean(task.completed),
    created_at: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveLocalTasks(tasks);
  return { data: newTask, error: null };
}

export async function updateTask(taskId, updates) {
  const mappedUpdates = { ...updates };
  if ('subjectId' in mappedUpdates) {
    mappedUpdates.subject_id = mappedUpdates.subjectId;
    delete mappedUpdates.subjectId;
  }
  if ('studentId' in mappedUpdates) {
    mappedUpdates.student_id = mappedUpdates.studentId;
    delete mappedUpdates.studentId;
  }
  if ('title' in mappedUpdates) {
    const cleanTitle = String(mappedUpdates.title || '').trim();
    if (!cleanTitle || cleanTitle.length > 500) {
      return { data: null, error: { message: 'Task title must be between 1 and 500 characters.' } };
    }
    mappedUpdates.title = cleanTitle;
  }
  if ('deadline' in mappedUpdates) {
    if (!mappedUpdates.deadline || Number.isNaN(new Date(mappedUpdates.deadline).getTime())) {
      return { data: null, error: { message: 'Please enter a valid deadline date and time.' } };
    }
  }
  if ('description' in mappedUpdates) {
    const descCheck = normalizeOptionalDescription(mappedUpdates.description, MAX_TASK_DESCRIPTION_LENGTH);
    if (!descCheck.valid) {
      return { data: null, error: { message: descCheck.error } };
    }
    mappedUpdates.description = descCheck.value;
  }

  if (isConfigured && !String(taskId).startsWith('local-task-')) {
    if ('subject_id' in mappedUpdates && !UUID_REGEX.test(String(mappedUpdates.subject_id || ''))) {
      return { data: null, error: { message: 'Could not resolve the subject ID in Supabase. Please save your subjects first.' } };
    }
    const res = await supabase
      .from('tasks')
      .update({ ...mappedUpdates, updated_at: new Date().toISOString() })
      .eq('id', taskId)
      .select('*, subject:subjects(id, name, slug)')
      .single();

    if (res.error && isMissingDescriptionColumnError(res.error) && (!('description' in mappedUpdates) || mappedUpdates.description === null)) {
      const { description: _omitted, ...legacyUpdates } = mappedUpdates;
      return supabase
        .from('tasks')
        .update({ ...legacyUpdates, updated_at: new Date().toISOString() })
        .eq('id', taskId)
        .select('*, subject:subjects(id, name, slug)')
        .single();
    }
    return res;
  }

  const tasks = getLocalTasks();
  const idx = tasks.findIndex(t => t.id === taskId);
  if (idx > -1) {
    tasks[idx] = { ...tasks[idx], ...mappedUpdates, updated_at: new Date().toISOString() };
    saveLocalTasks(tasks);
    return { data: tasks[idx], error: null };
  }
  return { data: null, error: { message: 'Task not found' } };
}

export async function toggleTask(taskId, completed) {
  return updateTask(taskId, { completed });
}

export async function deleteTask(taskId) {
  if (isConfigured && !String(taskId).startsWith('local-task-')) {
    return supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
  }

  let tasks = getLocalTasks();
  tasks = tasks.filter(t => t.id !== taskId);
  saveLocalTasks(tasks);
  return { error: null };
}
