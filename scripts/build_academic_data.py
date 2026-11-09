#!/usr/bin/env python3
"""
Build Academic Data
Generates src/lib/academic-catalog.js, public/src/lib/academic-catalog.js,
and supabase/migrations/008_major_subjects_quiz_bank.sql from data/academic-catalog.json
and data/quiz-bank.json.
"""

import json
import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

def main():
    cat_path = os.path.join(ROOT, 'data', 'academic-catalog.json')
    quiz_path = os.path.join(ROOT, 'data', 'quiz-bank.json')

    with open(cat_path, 'r', encoding='utf-8') as f:
        catalog = json.load(f)
    with open(quiz_path, 'r', encoding='utf-8') as f:
        quiz_data = json.load(f)

    subjects = catalog['subjects']
    faculties = catalog['faculties']
    questions_by_slug = quiz_data['questions']

    # Map each subject to the majors it appears in
    major_subject_map = {}
    subject_to_majors = {s['slug']: {'core_in': [], 'elective_in': []} for s in subjects}

    for fac in faculties:
        for major_obj in fac['majors']:
            m_name = major_obj['name']
            core_slugs = major_obj.get('core', [])
            elec_slugs = major_obj.get('electives', [])
            major_subject_map[m_name] = {
                'faculty': fac['name'],
                'core': core_slugs,
                'electives': elec_slugs
            }
            for slug in core_slugs:
                if slug in subject_to_majors:
                    subject_to_majors[slug]['core_in'].append(m_name)
            for slug in elec_slugs:
                if slug in subject_to_majors:
                    subject_to_majors[slug]['elective_in'].append(m_name)

    # Build SUBJECTS_CATALOG list
    subjects_catalog = []
    for s in subjects:
        slug = s['slug']
        cat_item = {
            'id': f"sub-{slug}",
            'name': s['name'],
            'slug': slug,
            'icon': s['icon'],
            'category': s['category'],
            'description': s['description'],
            'coreInMajors': subject_to_majors[slug]['core_in'],
            'electiveInMajors': subject_to_majors[slug]['elective_in'],
        }
        subjects_catalog.append(cat_item)

    # Countries and Universities
    countries = [
        'South Korea',
        'Nepal',
        'India',
        'Bangladesh',
        'Pakistan',
        'Sri Lanka',
        'Bhutan',
        'Maldives',
        'South Asia',
        'Other / International'
    ]

    universities_by_country = {
        'South Korea': [
            'Ulsan College',
            'Ulsan National Institute of Science and Technology (UNIST)',
            'Seoul National University (SNU)',
            'Korea Advanced Institute of Science and Technology (KAIST)',
            'Korea University',
            'Yonsei University',
            'Pusan National University',
            'Sungkyunkwan University (SKKU)',
            'Hanyang University',
            'Other institution in South Korea'
        ],
        'Nepal': [
            'Tribhuvan University (TU)',
            'Kathmandu University (KU)',
            'Pokhara University (PU)',
            'Purbanchal University (PU)',
            'Mid-Western University',
            'Far-Western University',
            'Nepal Open University',
            'Agriculture and Forestry University',
            'Other institution in Nepal'
        ],
        'India': [
            'Indian Institute of Technology (IIT Bombay / Delhi / Madras)',
            'University of Delhi',
            'University of Mumbai',
            'Jawaharlal Nehru University (JNU)',
            'Anna University',
            'Vellore Institute of Technology (VIT)',
            'National Institute of Technology (NIT Trichy / Surathkal)',
            'Other institution in India'
        ],
        'Bangladesh': [
            'University of Dhaka',
            'Bangladesh University of Engineering and Technology (BUET)',
            'North South University',
            'BRAC University',
            'Jahangirnagar University',
            'Other institution in Bangladesh'
        ],
        'Pakistan': [
            'National University of Sciences and Technology (NUST)',
            'Quaid-i-Azam University',
            'Lahore University of Management Sciences (LUMS)',
            'University of the Punjab',
            'COMSATS University Islamabad',
            'Other institution in Pakistan'
        ],
        'Sri Lanka': [
            'University of Colombo',
            'University of Peradeniya',
            'University of Moratuwa',
            'University of Kelaniya',
            'Sri Lanka Institute of Information Technology (SLIIT)',
            'Other institution in Sri Lanka'
        ],
        'Bhutan': [
            'Royal University of Bhutan',
            'Sherubtse College',
            'College of Science and Technology (CST)',
            'Other institution in Bhutan'
        ],
        'Maldives': [
            'The Maldives National University',
            'Villa College',
            'Other institution in Maldives'
        ],
        'South Asia': [
            'Tribhuvan University (TU)',
            'Kathmandu University (KU)',
            'Pokhara University (PU)',
            'Purbanchal University (PU)',
            'University of Delhi',
            'University of Mumbai',
            'Indian Institute of Technology (IIT)',
            'University of Dhaka',
            'Bangladesh University of Engineering and Technology (BUET)',
            'National University of Sciences and Technology (NUST)',
            'University of Colombo',
            'Royal University of Bhutan',
            'The Maldives National University',
            'Other South Asian university or college'
        ],
        'Other / International': [
            'International College / University',
            'Online / Distance Learning Institution'
        ]
    }

    faculties_list = [f['name'] for f in faculties]
    majors_by_faculty = {f['name']: [m['name'] for m in f['majors']] for f in faculties}

    # Generate academic-catalog.js content
    js_content = f"""/**
 * Academic Catalog — Smart Study Companion
 * 
 * Comprehensive hierarchy & Major-to-Subject Curricula:
 * Country -> University -> Faculty -> Major/Department -> Subjects -> Quiz Bank
 * 
 * Auto-generated by scripts/build_academic_data.py
 * Contains {len(subjects_catalog)} accredited subjects and {sum(len(q) for q in questions_by_slug.values())} quiz questions across 4 faculties & {len(major_subject_map)} majors.
 */

export const COUNTRIES = {json.dumps(countries, indent=2)};

export const UNIVERSITIES_BY_COUNTRY = {json.dumps(universities_by_country, indent=2)};

export const FACULTIES = {json.dumps(faculties_list, indent=2)};

export const MAJORS_BY_FACULTY = {json.dumps(majors_by_faculty, indent=2)};

export const MAJOR_SUBJECT_MAP = {json.dumps(major_subject_map, indent=2)};

export const SUBJECTS_CATALOG = {json.dumps(subjects_catalog, indent=2)};

export const QUIZ_BANK = {json.dumps(questions_by_slug, indent=2)};

export function getCountries() {{
  return COUNTRIES;
}}

export function getUniversities(country) {{
  if (!country) return [];
  return UNIVERSITIES_BY_COUNTRY[country] || [
    'General College or University',
    'Open / Distance Learning College'
  ];
}}

export function universitiesFor(country) {{
  return getUniversities(country);
}}

export function getFaculties() {{
  return FACULTIES;
}}

export function getMajors(faculty) {{
  if (!faculty) return MAJORS_BY_FACULTY['Faculty of Computer Science & Information Technology'] || [];
  return MAJORS_BY_FACULTY[faculty] || [];
}}

export function getSubjectBySlug(slug) {{
  return SUBJECTS_CATALOG.find(s => s.slug === slug) || null;
}}

/**
 * Returns subjects tailored to a specific major.
 * Each item includes isCore: true/false.
 * @param {{string}} majorName
 * @returns {{Array<object>}}
 */
export function getSubjectsForMajor(majorName) {{
  if (!majorName || !MAJOR_SUBJECT_MAP[majorName]) {{
    return SUBJECTS_CATALOG.map(s => ({{ ...s, isCore: false, isElective: false }}));
  }}
  const mapping = MAJOR_SUBJECT_MAP[majorName];
  const coreSet = new Set(mapping.core || []);
  const electiveSet = new Set(mapping.electives || []);

  const majorSubjects = SUBJECTS_CATALOG.filter(s => coreSet.has(s.slug) || electiveSet.has(s.slug));
  return majorSubjects.map(s => ({{
    ...s,
    isCore: coreSet.has(s.slug),
    isElective: electiveSet.has(s.slug)
  }})).sort((a, b) => {{
    // Core subjects first, then electives, then alphabetical
    if (a.isCore && !b.isCore) return -1;
    if (!a.isCore && b.isCore) return 1;
    return a.name.localeCompare(b.name);
  }});
}}

/**
 * Filters the subject catalog by query, category, and chosen major.
 * @param {{string}} query
 * @param {{string}} category
 * @param {{string}} major - When provided and scope is 'major', limits to that major's curriculum
 * @param {{'all'|'major'}} scope
 */
export function searchSubjects(query = '', category = 'all', major = '', scope = 'major') {{
  const q = query.trim().toLowerCase();
  let baseList = SUBJECTS_CATALOG;

  const majorMapping = major ? MAJOR_SUBJECT_MAP[major] : null;
  const majorSlugs = majorMapping ? new Set([...(majorMapping.core || []), ...(majorMapping.electives || [])]) : null;

  if (scope === 'major' && majorSlugs && majorSlugs.size > 0) {{
    baseList = SUBJECTS_CATALOG.filter(sub => majorSlugs.has(sub.slug));
  }}

  return baseList.filter(sub => {{
    let matchCategory = true;
    if (category === 'major') {{
      matchCategory = majorSlugs ? majorSlugs.has(sub.slug) : true;
    }} else if (category === 'core' && majorMapping) {{
      matchCategory = (majorMapping.core || []).includes(sub.slug);
    }} else if (category === 'electives' && majorMapping) {{
      matchCategory = (majorMapping.electives || []).includes(sub.slug);
    }} else if (category !== 'all') {{
      matchCategory = sub.category === category;
    }}

    const matchQuery = !q ||
      sub.name.toLowerCase().includes(q) ||
      sub.description.toLowerCase().includes(q) ||
      sub.category.toLowerCase().includes(q);

    return matchCategory && matchQuery;
  }}).map(sub => ({{
    ...sub,
    isCore: majorMapping ? (majorMapping.core || []).includes(sub.slug) : false,
    isElective: majorMapping ? (majorMapping.electives || []).includes(sub.slug) : false
  }}));
}}
"""

    # Write academic-catalog.js to src/lib and public/src/lib
    src_catalog_path = os.path.join(ROOT, 'src', 'lib', 'academic-catalog.js')
    pub_catalog_path = os.path.join(ROOT, 'public', 'src', 'lib', 'academic-catalog.js')

    with open(src_catalog_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
    with open(pub_catalog_path, 'w', encoding='utf-8') as f:
        f.write(js_content)

    print(f"✓ Generated {src_catalog_path} and {pub_catalog_path}")

    # Generate supabase/migrations/008_major_subjects_quiz_bank.sql
    migration_lines = [
        "-- Migration 008: Comprehensive Faculty/Major Curricula & Extended Quiz Bank",
        "-- Seeds 32 accredited subjects across 4 faculties & 15 majors with 345 quiz questions.",
        "",
        "-- 1. Ensure subjects table has faculty and major columns if needed",
        "ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Core';",
        "",
        "-- 2. Upsert all 32 accredited subjects into subjects table",
    ]

    for s in subjects_catalog:
        name_esc = s['name'].replace("'", "''")
        desc_esc = s['description'].replace("'", "''")
        cat_esc = s['category'].replace("'", "''")
        migration_lines.append(
            f"INSERT INTO public.subjects (name, slug, icon, category, description, is_default) "
            f"VALUES ('{name_esc}', '{s['slug']}', '{s['icon']}', '{cat_esc}', '{desc_esc}', true) "
            f"ON CONFLICT (slug) DO UPDATE SET "
            f"name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;"
        )

    migration_lines.extend([
        "",
        "-- 3. Major to Subject Curricula Mapping Table",
        "CREATE TABLE IF NOT EXISTS public.major_subjects (",
        "    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),",
        "    faculty TEXT NOT NULL DEFAULT '',",
        "    major TEXT NOT NULL,",
        "    subject_slug TEXT NOT NULL REFERENCES public.subjects(slug) ON DELETE CASCADE,",
        "    is_core BOOLEAN NOT NULL DEFAULT true,",
        "    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),",
        "    CONSTRAINT major_subject_slug_unique UNIQUE (major, subject_slug)",
        ");",
        "",
        "CREATE INDEX IF NOT EXISTS idx_major_subjects_major ON public.major_subjects(major);",
        "CREATE INDEX IF NOT EXISTS idx_major_subjects_slug ON public.major_subjects(subject_slug);",
        "",
        "ALTER TABLE public.major_subjects ENABLE ROW LEVEL SECURITY;",
        "DROP POLICY IF EXISTS major_subjects_select_all ON public.major_subjects;",
        "CREATE POLICY major_subjects_select_all ON public.major_subjects FOR SELECT USING (true);",
        "",
        "-- 4. Seed Major-to-Subject Curricula"
    ])

    for major_name, mapping in major_subject_map.items():
        m_esc = major_name.replace("'", "''")
        f_esc = mapping['faculty'].replace("'", "''")
        for slug in mapping['core']:
            migration_lines.append(
                f"INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) "
                f"VALUES ('{f_esc}', '{m_esc}', '{slug}', true) ON CONFLICT (major, subject_slug) DO NOTHING;"
            )
        for slug in mapping['electives']:
            migration_lines.append(
                f"INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) "
                f"VALUES ('{f_esc}', '{m_esc}', '{slug}', false) ON CONFLICT (major, subject_slug) DO NOTHING;"
            )

    migration_lines.extend([
        "",
        "-- 5. Seed Quiz Questions for All 32 Subjects",
        "DO $$",
        "DECLARE",
        "    v_sub_id UUID;"
    ])

    for slug, q_list in questions_by_slug.items():
        var_name = f"v_{slug.replace('-', '_')}"
        migration_lines.append(f"    {var_name} UUID;")

    migration_lines.append("BEGIN")

    for slug in questions_by_slug.keys():
        var_name = f"v_{slug.replace('-', '_')}"
        migration_lines.append(f"    SELECT id INTO {var_name} FROM public.subjects WHERE slug = '{slug}';")

    for slug, q_list in questions_by_slug.items():
        var_name = f"v_{slug.replace('-', '_')}"
        migration_lines.append(f"    -- {slug} ({len(q_list)} questions)")
        for item in q_list:
            q_text = item['q'].replace("'", "''")
            opts_json = json.dumps(item['options'], ensure_ascii=False).replace("'", "''")
            ans = item['answer']
            migration_lines.append(
                f"    IF {var_name} IS NOT NULL AND NOT EXISTS ("
                f"SELECT 1 FROM public.quiz_questions WHERE subject_id = {var_name} AND question = '{q_text}'"
                f") THEN"
            )
            migration_lines.append(
                f"        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) "
                f"VALUES ({var_name}, '{q_text}', '{opts_json}'::jsonb, {ans});"
            )
            migration_lines.append("    END IF;")

    migration_lines.extend([
        "END $$;",
        "",
        "COMMENT ON TABLE public.major_subjects IS 'Curriculum mapping from degree majors to core and elective subjects';"
    ])

    migration_sql_path = os.path.join(ROOT, 'supabase', 'migrations', '008_major_subjects_quiz_bank.sql')
    with open(migration_sql_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(migration_lines) + "\n")

    print(f"✓ Generated {migration_sql_path} ({len(migration_lines)} lines)")

if __name__ == '__main__':
    main()

