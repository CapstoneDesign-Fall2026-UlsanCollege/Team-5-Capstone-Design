/**
 * Task Service
 * 
 * Supports both live Supabase PostgreSQL queries and local storage fallback.
 */
import { supabase, isConfigured } from '../lib/supabase.js';

const LOCAL_TASKS_KEY = 'smart_study_tasks';

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
  if (isConfigured) {
    return supabase
      .from('tasks')
      .insert({
        student_id: task.student_id,
        subject_id: task.subject_id,
        title: task.title,
        deadline: task.deadline,
        completed: false,
      })
      .select('*, subject:subjects(id, name, slug)')
      .single();
  }

  const tasks = getLocalTasks();
  const newTask = {
    id: 'local-task-' + Math.random().toString(36).slice(2, 9),
    student_id: task.student_id,
    subject_id: task.subject_id,
    title: task.title,
    deadline: task.deadline,
    completed: false,
    created_at: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveLocalTasks(tasks);
  return { data: newTask, error: null };
}

export async function updateTask(taskId, updates) {
  if (isConfigured) {
    return supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', taskId)
      .select('*, subject:subjects(id, name, slug)')
      .single();
  }

  const tasks = getLocalTasks();
  const idx = tasks.findIndex(t => t.id === taskId);
  if (idx > -1) {
    tasks[idx] = { ...tasks[idx], ...updates, updated_at: new Date().toISOString() };
    saveLocalTasks(tasks);
    return { data: tasks[idx], error: null };
  }
  return { data: null, error: { message: 'Task not found' } };
}

export async function toggleTask(taskId, completed) {
  return updateTask(taskId, { completed });
}

export async function deleteTask(taskId) {
  if (isConfigured) {
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
