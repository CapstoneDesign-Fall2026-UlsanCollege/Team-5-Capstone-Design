-- Migration 002: Subjects table
-- Stores the catalog of study subjects (default CS subjects + future user-created)

CREATE TABLE IF NOT EXISTS subjects (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    slug        TEXT NOT NULL UNIQUE,
    icon        TEXT NOT NULL DEFAULT 'fa-book',
    description TEXT NOT NULL DEFAULT '',
    is_default  BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT subjects_name_unique UNIQUE (name)
);

-- Student-subject enrollment (many-to-many)
CREATE TABLE IF NOT EXISTS student_subjects (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject_id  UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT student_subjects_unique UNIQUE (student_id, subject_id)
);

CREATE INDEX IF NOT EXISTS idx_student_subjects_student ON student_subjects(student_id);
CREATE INDEX IF NOT EXISTS idx_student_subjects_subject ON student_subjects(subject_id);

-- Seed the 5 default CS subjects
INSERT INTO subjects (name, slug, icon, description, is_default) VALUES
    ('Programming', 'programming', 'fa-code', 'Languages, logic, and software development', true),
    ('Data Structures & Algorithms', 'data-structures', 'fa-diagram-project', 'Core structures, searching, and sorting', true),
    ('Databases', 'databases', 'fa-database', 'SQL, data modeling, and storage', true),
    ('Computer Networks', 'networks', 'fa-network-wired', 'Protocols, addressing, and network design', true),
    ('Operating Systems', 'operating-systems', 'fa-desktop', 'Processes, memory, and system resources', true)
ON CONFLICT (slug) DO NOTHING;

COMMENT ON TABLE subjects IS 'Catalog of study subjects (default and user-created)';
COMMENT ON TABLE student_subjects IS 'Student enrollment in subjects';

