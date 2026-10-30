/**
 * Task Service
 * 
 * CRUD operations for study tasks stored in Supabase PostgreSQL.
 * Replaces the localStorage-based persistence from the original app.
 */
import { supabase } from '../lib/supabase.js';

/**
 * Get all tasks for the authenticated student.
 * @param {string} studentId
 * @returns {Promise<{ data: object[]|null, error: object|null }>}
 */
export async function getTasks(studentId) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*, subject:subjects(id, name, slug)')
    .eq('student_id', studentId)
    .order('deadline', { ascending: true });
  return { data, error };
}

/**
 * Get tasks for a specific subject.
 * @param {string} studentId
 * @param {string} subjectId
 */
export async function getTasksBySubject(studentId, subjectId) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*, subject:subjects(id, name, slug)')
    .eq('student_id', studentId)
    .eq('subject_id', subjectId)
    .order('deadline', { ascending: true });
  return { data, error };
}

/**
 * Create a new task.
 * @param {{ student_id: string, subject_id: string, title: string, deadline: string }} task
 */
export async function createTask(task) {
  const { data, error } = await supabase
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
  return { data, error };
}

/**
 * Update a task.
 * @param {string} taskId
 * @param {object} updates - Fields to update (title, deadline, subject_id, completed).
 */
export async function updateTask(taskId, updates) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', taskId)
    .select('*, subject:subjects(id, name, slug)')
    .single();
  return { data, error };
}

/**
 * Toggle task completion status.
 * @param {string} taskId
 * @param {boolean} completed
 */
export async function toggleTask(taskId, completed) {
  return updateTask(taskId, { completed });
}

/**
 * Delete a task.
 * @param {string} taskId
 */
export async function deleteTask(taskId) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);
  return { error };
}

