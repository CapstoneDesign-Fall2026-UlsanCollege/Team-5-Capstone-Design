/**
 * Subjects Service
 * 
 * Manages the subjects catalog and student subject enrollments.
 * Default CS subjects are seeded in the database; students can enroll in them.
 */
import { supabase } from '../lib/supabase.js';

/**
 * Get all default (catalog) subjects.
 * @returns {Promise<{ data: object[]|null, error: object|null }>}
 */
export async function getDefaultSubjects() {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('is_default', true)
    .order('name');
  return { data, error };
}

/**
 * Get all subjects (default + user-created).
 * @returns {Promise<{ data: object[]|null, error: object|null }>}
 */
export async function getAllSubjects() {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('name');
  return { data, error };
}

/**
 * Get subjects the student is enrolled in.
 * @param {string} studentId
 */
export async function getStudentSubjects(studentId) {
  const { data, error } = await supabase
    .from('student_subjects')
    .select('*, subject:subjects(*)')
    .eq('student_id', studentId);
  return { data, error };
}

/**
 * Enroll a student in a subject (if not already enrolled).
 * @param {string} studentId
 * @param {string} subjectId
 */
export async function enrollInSubject(studentId, subjectId) {
  const { data, error } = await supabase
    .from('student_subjects')
    .upsert(
      { student_id: studentId, subject_id: subjectId },
      { onConflict: 'student_id,subject_id' }
    )
    .select()
    .single();
  return { data, error };
}

