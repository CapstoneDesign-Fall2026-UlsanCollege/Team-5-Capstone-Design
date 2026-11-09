/**
 * Subjects Service — Smart Study Companion
 * 
 * Manages the subjects catalog, major-to-subject curricula,
 * and student subject enrollments in Supabase PostgreSQL & offline storage.
 */
import { supabase, isConfigured } from '../lib/supabase.js';
import { SUBJECTS_CATALOG, getSubjectsForMajor, MAJOR_SUBJECT_MAP } from '../lib/academic-catalog.js';

const LOCAL_ENROLLED_KEY = 'study_companion_enrolled_subjects';

/**
 * Get all default (catalog) subjects.
 * @returns {Promise<{ data: object[]|null, error: object|null }>}
 */
export async function getDefaultSubjects() {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');
      if (!error && data && data.length) return { data, error: null };
    } catch (_) {}
  }
  return { data: SUBJECTS_CATALOG, error: null };
}

/**
 * Get all subjects.
 * @returns {Promise<{ data: object[]|null, error: object|null }>}
 */
export async function getAllSubjects() {
  return getDefaultSubjects();
}

/**
 * Get curriculum subjects for a given major.
 * @param {string} major
 */
export async function getSubjectsByMajor(major) {
  if (isConfigured && major) {
    try {
      const { data, error } = await supabase
        .from('major_subjects')
        .select('*, subject:subjects(*)')
        .eq('major', major);
      if (!error && data && data.length) {
        return {
          data: data.map(item => ({
            ...(item.subject || {}),
            isCore: item.is_core,
            isElective: !item.is_core
          })),
          error: null
        };
      }
    } catch (_) {}
  }
  return { data: getSubjectsForMajor(major), error: null };
}

/**
 * Get subjects the student is enrolled in.
 * @param {string} studentId
 */
export async function getStudentSubjects(studentId) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('student_subjects')
        .select('*, subject:subjects(*)')
        .eq('student_id', studentId);
      if (!error && data && data.length) return { data, error: null };
    } catch (_) {}
  }

  // Fallback to local storage
  const stored = localStorage.getItem(`${LOCAL_ENROLLED_KEY}_${studentId}`) || localStorage.getItem(LOCAL_ENROLLED_KEY);
  if (stored) {
    try {
      const subjects = JSON.parse(stored);
      return { data: subjects, error: null };
    } catch (_) {}
  }
  return { data: [], error: null };
}

/**
 * Enroll or update a student's subjects list.
 * @param {string} studentId
 * @param {Array<{ id?: string, name: string, slug?: string, icon?: string, description?: string }>} subjects
 */
export async function saveStudentSubjects(studentId, subjects) {
  // Store locally
  localStorage.setItem(`${LOCAL_ENROLLED_KEY}_${studentId}`, JSON.stringify(subjects));
  localStorage.setItem(LOCAL_ENROLLED_KEY, JSON.stringify(subjects));

  if (isConfigured) {
    try {
      // First ensure subjects exist in database
      for (const sub of subjects) {
        await supabase
          .from('subjects')
          .upsert({
            name: sub.name,
            slug: sub.slug || sub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            icon: sub.icon || 'fa-book',
            category: sub.category || 'Core',
            description: sub.description || '',
            is_default: true
          }, { onConflict: 'slug' });
      }

      // Then enroll student
      for (const sub of subjects) {
        const { data: dbSub } = await supabase
          .from('subjects')
          .select('id')
          .eq('name', sub.name)
          .single();

        if (dbSub?.id) {
          await supabase
            .from('student_subjects')
            .upsert(
              { student_id: studentId, subject_id: dbSub.id },
              { onConflict: 'student_id,subject_id' }
            );
        }
      }
      return { data: subjects, error: null };
    } catch (err) {
      console.warn('Could not persist student subjects to cloud:', err);
    }
  }

  return { data: subjects, error: null };
}

/**
 * Enroll a student in a single subject.
 * @param {string} studentId
 * @param {string} subjectId
 */
export async function enrollInSubject(studentId, subjectId) {
  if (isConfigured) {
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
  return { data: { student_id: studentId, subject_id: subjectId }, error: null };
}
