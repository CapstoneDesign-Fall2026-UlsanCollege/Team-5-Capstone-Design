/**
 * Subjects Service — Smart Study Companion
 * 
 * Manages the subjects catalog, major-to-subject curricula,
 * and student subject enrollments in Supabase PostgreSQL & offline storage.
 */
import { supabase, isConfigured } from '../lib/supabase.js';
import { SUBJECTS_CATALOG, UNIVERSITIES_BY_COUNTRY, getSubjectsForMajor } from '../lib/academic-catalog.js';

const LOCAL_ENROLLED_KEY = 'study_companion_enrolled_subjects';

/**
 * Load country -> universities map from Supabase `universities` table,
 * supplementing any offline countries cleanly from local catalog.
 * @returns {Promise<{ data: Record<string, string[]>, error: object|null }>}
 */
export async function getUniversitiesCatalog() {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('country, name')
        .order('name');
      if (!error && Array.isArray(data) && data.length > 0) {
        const grouped = {};
        data.forEach((row) => {
          if (!row.country || !row.name) return;
          if (!grouped[row.country]) grouped[row.country] = [];
          if (!grouped[row.country].includes(row.name)) {
            grouped[row.country].push(row.name);
          }
        });
        // Preserve any countries defined locally that are not yet seeded in DB
        Object.keys(UNIVERSITIES_BY_COUNTRY).forEach((c) => {
          if (!grouped[c] || grouped[c].length === 0) {
            grouped[c] = [...UNIVERSITIES_BY_COUNTRY[c]];
          }
        });
        return { data: grouped, error: null };
      }
    } catch (_) {}
  }
  return { data: UNIVERSITIES_BY_COUNTRY, error: null };
}

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
      if (error) return { data: null, error };
    } catch (err) {
      return { data: null, error: err };
    }
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
  if (isConfigured && studentId && !String(studentId).startsWith('local-')) {
    try {
      const { data, error } = await supabase
        .from('student_subjects')
        .select('*, subject:subjects(*)')
        .eq('student_id', studentId);
      if (error) {
        return { data: null, error };
      }
      return { data: data || [], error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  // Offline / Local Preview Mode fallback
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
 * Enroll or synchronize a student's enrolled subjects list in Supabase PostgreSQL.
 * Resolves catalog UUIDs cleanly by slug without attempting unauthorized catalog writes.
 * @param {string} studentId
 * @param {Array<{ id?: string, name: string, slug?: string, icon?: string, description?: string }>} subjects
 */
export async function saveStudentSubjects(studentId, subjects) {
  if (isConfigured && studentId && !String(studentId).startsWith('local-')) {
    try {
      const slugs = (subjects || [])
        .map((sub) => sub.slug || sub.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
        .filter(Boolean);

      if (slugs.length === 0) {
        const { error: clearErr } = await supabase
          .from('student_subjects')
          .delete()
          .eq('student_id', studentId);
        if (clearErr) return { data: null, error: clearErr };
        return { data: [], error: null };
      }

      const { data: catalogRows, error: catErr } = await supabase
        .from('subjects')
        .select('id, slug, name')
        .in('slug', slugs);

      if (catErr) {
        return { data: null, error: catErr };
      }

      const targetIds = (catalogRows || []).map((row) => row.id);
      if (targetIds.length === 0) {
        return { data: null, error: { message: 'Selected subjects were not found in the Supabase subjects catalog.' } };
      }

      const { data: existingRows, error: existingErr } = await supabase
        .from('student_subjects')
        .select('id, subject_id')
        .eq('student_id', studentId);

      if (existingErr) {
        return { data: null, error: existingErr };
      }

      const targetSet = new Set(targetIds);
      const removedIds = (existingRows || [])
        .filter((row) => !targetSet.has(row.subject_id))
        .map((row) => row.subject_id);

      if (removedIds.length > 0) {
        const { error: delErr } = await supabase
          .from('student_subjects')
          .delete()
          .eq('student_id', studentId)
          .in('subject_id', removedIds);
        if (delErr) return { data: null, error: delErr };
      }

      const rowsToUpsert = targetIds.map((subjectId) => ({
        student_id: studentId,
        subject_id: subjectId,
      }));

      const { data: savedRows, error: upsertErr } = await supabase
        .from('student_subjects')
        .upsert(rowsToUpsert, { onConflict: 'student_id,subject_id' })
        .select('*, subject:subjects(*)');

      if (upsertErr) {
        return { data: null, error: upsertErr };
      }

      localStorage.setItem(`${LOCAL_ENROLLED_KEY}_${studentId}`, JSON.stringify(subjects));
      return { data: savedRows || subjects, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  // Offline / Local Preview fallback
  localStorage.setItem(`${LOCAL_ENROLLED_KEY}_${studentId}`, JSON.stringify(subjects));
  localStorage.setItem(LOCAL_ENROLLED_KEY, JSON.stringify(subjects));
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
