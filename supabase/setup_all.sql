-- ============================================================================
-- SMART STUDY COMPANION — COMPLETE SUPABASE DATABASE SETUP SCRIPT
-- ============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/_/sql
-- 2. Click "+ New query"
-- 3. Copy and paste this ENTIRE file into the editor
-- 4. Click "Run" (or press Command + Enter / Ctrl + Enter)
--
-- This script creates:
--  - All 8 tables: profiles, subjects, student_subjects, tasks,
--    quiz_questions, quiz_attempts, quiz_responses, universities, major_subjects
--  - Automatic profile creation trigger on signup (auth.users -> profiles)
--  - Complete Row Level Security (RLS) policies for data isolation
--  - 32 accredited subjects across 4 faculties & 15 majors
--  - All accredited South Asian & international universities
--  - Full degree curriculum mappings (core & electives)
--  - 345 verified multiple-choice quiz questions
-- ============================================================================


-- Migration 001: Profiles table
-- Links to Supabase Auth users via auth.users(id)

CREATE TABLE IF NOT EXISTS profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name   TEXT NOT NULL DEFAULT '',
    country     TEXT NOT NULL DEFAULT '',
    university  TEXT NOT NULL DEFAULT '',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, country, university)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'country', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'university', '')
    );
    RETURN NEW;
END;
$$;

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

COMMENT ON TABLE profiles IS 'Student profiles linked to Supabase Auth identities';


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



-- Migration 003: Tasks table
-- Study tasks with deadlines and completion tracking

CREATE TABLE IF NOT EXISTS tasks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject_id  UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    title       TEXT NOT NULL CHECK (char_length(title) >= 1 AND char_length(title) <= 500),
    deadline    TIMESTAMPTZ NOT NULL,
    completed   BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tasks_student ON tasks(student_id);
CREATE INDEX IF NOT EXISTS idx_tasks_subject ON tasks(subject_id);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(student_id, deadline);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(student_id, completed);

-- Auto-update updated_at
CREATE TRIGGER tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

COMMENT ON TABLE tasks IS 'Student study tasks with deadlines';



-- Migration 004: Quiz Questions table
-- Stores quiz questions linked to subjects. Seeded with the original 75 questions.

CREATE TABLE IF NOT EXISTS quiz_questions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id      UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    question        TEXT NOT NULL,
    options         JSONB NOT NULL,       -- Array of answer strings
    correct_answer  INT NOT NULL,         -- 0-based index into options
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_subject ON quiz_questions(subject_id);

COMMENT ON TABLE quiz_questions IS 'Multiple-choice quiz questions per subject';

-- Seed the original 75 quiz questions
-- We use a DO block to look up subject IDs by slug

DO $$
DECLARE
    v_programming UUID;
    v_data_structures UUID;
    v_databases UUID;
    v_networks UUID;
    v_operating_systems UUID;
BEGIN
    SELECT id INTO v_programming FROM subjects WHERE slug = 'programming';
    SELECT id INTO v_data_structures FROM subjects WHERE slug = 'data-structures';
    SELECT id INTO v_databases FROM subjects WHERE slug = 'databases';
    SELECT id INTO v_networks FROM subjects WHERE slug = 'networks';
    SELECT id INTO v_operating_systems FROM subjects WHERE slug = 'operating-systems';

    -- Programming (15 questions)
    INSERT INTO quiz_questions (subject_id, question, options, correct_answer) VALUES
    (v_programming, 'Which JavaScript keyword declares a block-scoped variable that can be reassigned?', '["const", "let", "static", "define"]', 1),
    (v_programming, 'Which HTML element represents the most important heading?', '["<h6>", "<head>", "<h1>", "<title>"]', 2),
    (v_programming, 'Which CSS property changes the color of text?', '["font-style", "background", "text-align", "color"]', 3),
    (v_programming, 'What does a Boolean value represent?', '["True or false", "A decimal number", "A sequence of characters", "A memory address"]', 0),
    (v_programming, 'What is the main purpose of a function?', '["To store database rows", "To group reusable instructions", "To increase screen resolution", "To allocate network ports"]', 1),
    (v_programming, 'What does debugging help a programmer do?', '["Compress source code", "Design a database", "Find and fix errors", "Encrypt every variable"]', 2),
    (v_programming, 'Which JavaScript operator checks both value and type equality?', '["==", "=", "!=", "==="]', 3),
    (v_programming, 'What is a parameter in a function?', '["A named input the function can use", "The value returned by every function", "A syntax error", "A loop condition"]', 0),
    (v_programming, 'What does an array commonly store?', '["One named function only", "An ordered collection of values", "Only true/false values", "A network protocol"]', 1),
    (v_programming, 'Which keyword exits a loop immediately in many programming languages?', '["skip", "return-all", "break", "next-loop"]', 2),
    (v_programming, 'What is the result of 9 % 4 in JavaScript?', '["1", "2", "2.25", "36"]', 0),
    (v_programming, 'What is a syntax error?', '["A slow algorithm", "A rule violation in how code is written", "A missing user account", "A full hard drive"]', 1),
    (v_programming, 'Which statement runs a block only when its condition is true?', '["import", "class", "if", "return"]', 2),
    (v_programming, 'What does a return statement do in a function?', '["Repeats a loop", "Declares a variable", "Catches every error", "Sends a value back to the caller"]', 3),
    (v_programming, 'What does source control help a team track?', '["Changes to files over time", "CPU temperature", "Monitor brightness", "Internet speed"]', 0);

    -- Data Structures & Algorithms (15 questions)
    INSERT INTO quiz_questions (subject_id, question, options, correct_answer) VALUES
    (v_data_structures, 'Which structure follows last-in, first-out order?', '["Queue", "Stack", "Heap", "Graph"]', 1),
    (v_data_structures, 'Which structure follows first-in, first-out order?', '["Stack", "Tree", "Queue", "Set"]', 2),
    (v_data_structures, 'In a typical array, what is the time complexity of accessing an element by index?', '["O(1)", "O(log n)", "O(n)", "O(n²)"]', 0),
    (v_data_structures, 'Which data structure is commonly used to implement a priority queue?', '["Linked list only", "Binary heap", "Hash set", "Stack"]', 1),
    (v_data_structures, 'What is the average lookup time for a well-distributed hash table?', '["O(n)", "O(log n)", "O(1)", "O(n log n)"]', 2),
    (v_data_structures, 'In a binary search tree, values in the left subtree are usually:', '["Smaller than the node", "Larger than the node", "Always equal to the node", "Stored as child indexes"]', 0),
    (v_data_structures, 'Which traversal explores a graph level by level?', '["Depth-first search", "In-order traversal", "Breadth-first search", "Binary search"]', 2),
    (v_data_structures, 'What is the worst-case time complexity of linear search?', '["O(1)", "O(log n)", "O(n)", "O(n log n)"]', 2),
    (v_data_structures, 'Which structure connects nodes using edges and has no required root?', '["Graph", "Stack", "Array", "Queue"]', 0),
    (v_data_structures, 'What is a leaf in a tree?', '["A node with no children", "The root node", "An edge between roots", "A cycle"]', 0),
    (v_data_structures, 'Which sorting algorithm repeatedly partitions around a pivot?', '["Selection sort", "Quick sort", "Insertion sort", "Counting sort"]', 1),
    (v_data_structures, 'What does a linked list node typically contain?', '["Only an array index", "A value and link(s) to other node(s)", "A database table", "A sorting algorithm"]', 1),
    (v_data_structures, 'Which algorithmic technique solves problems by combining results from smaller subproblems?', '["Brute-force enumeration", "Hashing", "Divide and conquer", "Linear probing"]', 2),
    (v_data_structures, 'A balanced binary search tree keeps its height approximately:', '["O(log n)", "O(n²)", "O(1) for every size", "O(2ⁿ)"]', 0),
    (v_data_structures, 'Which data structure is most suitable for checking whether an item has appeared before?', '["Queue", "Hash set", "Stack", "Tree traversal list"]', 1);

    -- Databases (15 questions)
    INSERT INTO quiz_questions (subject_id, question, options, correct_answer) VALUES
    (v_databases, 'What does SQL stand for?', '["Structured Query Language", "Sequential Question Logic", "System Quality Layer", "Simple Queue Language"]', 0),
    (v_databases, 'Which key uniquely identifies a row in a relational table?', '["Foreign key", "Primary key", "Index label", "Nullable key"]', 1),
    (v_databases, 'What is the purpose of a foreign key?', '["To encrypt a table", "To sort every row", "To reference a key in another table", "To create a backup"]', 2),
    (v_databases, 'Which SQL command retrieves rows from a table?', '["FETCH TABLE", "OPEN", "RETRIEVE", "SELECT"]', 3),
    (v_databases, 'Which clause filters rows before grouping?', '["WHERE", "ORDER BY", "HAVING", "LIMIT"]', 0),
    (v_databases, 'What does a JOIN do in a relational query?', '["Deletes duplicate databases", "Combines related rows from tables", "Changes a column type", "Backs up a table"]', 1),
    (v_databases, 'Which property is expected of a transaction under ACID?', '["Approximation", "Caching", "Atomicity", "Duplication"]', 2),
    (v_databases, 'What is database normalization primarily intended to reduce?', '["Data redundancy and update anomalies", "Query language features", "The number of users", "All indexes"]', 0),
    (v_databases, 'Which SQL command adds a new row?', '["APPEND ROW", "INSERT INTO", "ADD COLUMN", "CREATE ROW"]', 1),
    (v_databases, 'What does an index generally improve?', '["Query lookup speed", "Disk capacity", "Data accuracy automatically", "Network encryption"]', 0),
    (v_databases, 'Which clause sorts query results?', '["GROUP BY", "HAVING", "ORDER BY", "SORT TABLE"]', 2),
    (v_databases, 'What does NULL typically mean in a database?', '["The number zero", "An empty string in every system", "False", "A missing or unknown value"]', 3),
    (v_databases, 'Which SQL operation changes existing rows?', '["UPDATE", "CREATE", "SELECT", "GRANT"]', 0),
    (v_databases, 'What does GROUP BY do?', '["Removes a table", "Groups rows that share values for aggregation", "Encrypts grouped columns", "Orders rows alphabetically only"]', 1),
    (v_databases, 'Which database model stores data as documents, key-value pairs, or graphs instead of only relational tables?', '["Spreadsheet", "Relational only", "NoSQL", "Flat-file index"]', 2);

    -- Computer Networks (15 questions)
    INSERT INTO quiz_questions (subject_id, question, options, correct_answer) VALUES
    (v_networks, 'What does IP stand for in networking?', '["Internet Protocol", "Internal Process", "Interface Program", "Integrated Port"]', 0),
    (v_networks, 'Which protocol provides reliable, ordered delivery using a connection?', '["UDP", "TCP", "IP", "ARP"]', 1),
    (v_networks, 'What is the main purpose of DNS?', '["Encrypt files", "Assign CPU time", "Translate domain names to IP addresses", "Detect hardware errors"]', 2),
    (v_networks, 'Which device forwards packets between different networks?', '["Hub", "Repeater", "Switch", "Router"]', 3),
    (v_networks, 'How many layers are in the commonly taught OSI model?', '["Seven", "Four", "Five", "Eight"]', 0),
    (v_networks, 'Which protocol is commonly used to securely browse websites?', '["FTP", "HTTPS", "SMTP", "DHCP"]', 1),
    (v_networks, 'What does DHCP commonly provide to a client?', '["A domain name certificate", "A MAC address", "Network configuration such as an IP address", "A web page"]', 2),
    (v_networks, 'Which transport protocol is connectionless and does not guarantee delivery?', '["TCP", "HTTP", "SSH", "UDP"]', 3),
    (v_networks, 'What is a MAC address associated with?', '["A network interface at the link layer", "A web domain", "A TCP port", "A file system"]', 0),
    (v_networks, 'What is the purpose of a subnet mask?', '["To encrypt a packet", "To identify network and host portions of an IP address", "To map a URL to HTML", "To increase Wi-Fi signal"]', 1),
    (v_networks, 'Which protocol is used to send email between mail servers?', '["POP3", "IMAP", "SMTP", "SNMP"]', 2),
    (v_networks, 'What does bandwidth describe in a data connection?', '["The physical length of a cable", "The number of devices on a LAN", "A packet''s destination", "The maximum data transfer capacity"]', 3),
    (v_networks, 'Which network topology connects devices to a central switch or hub?', '["Star", "Ring", "Bus", "Mesh only"]', 0),
    (v_networks, 'What is latency?', '["The number of IP addresses", "The time delay for data to travel", "The size of a hard drive", "The encryption key length"]', 1),
    (v_networks, 'Which protocol securely supports remote command-line access?', '["Telnet", "HTTP", "SSH", "TFTP"]', 2);

    -- Operating Systems (15 questions)
    INSERT INTO quiz_questions (subject_id, question, options, correct_answer) VALUES
    (v_operating_systems, 'What is the main role of an operating system?', '["Manage computer resources and provide services to programs", "Design web pages", "Manufacture a CPU", "Translate domain names"]', 0),
    (v_operating_systems, 'What is a process?', '["A stored source-code comment", "A program in execution", "A network cable", "A database column"]', 1),
    (v_operating_systems, 'Which scheduling algorithm assigns each process a fixed time slice in turn?', '["Shortest job first", "Priority only", "Round robin", "First-fit"]', 2),
    (v_operating_systems, 'What is virtual memory?', '["A type of CPU cache only", "A second physical processor", "A backup power supply", "An abstraction that uses storage to extend addressable memory"]', 3),
    (v_operating_systems, 'What condition describes two or more processes waiting indefinitely for resources held by each other?', '["Deadlock", "Thrashing", "Starvation-free scheduling", "Context switching"]', 0),
    (v_operating_systems, 'What does a context switch do?', '["Formats a disk", "Saves one process state and loads another", "Compiles source code", "Changes a user password"]', 1),
    (v_operating_systems, 'What is a system call?', '["A phone call to support", "A compiler warning", "A request for a service from the operating system", "A network broadcast"]', 2),
    (v_operating_systems, 'Which memory is typically fastest and closest to the CPU?', '["Hard disk", "RAM", "Optical disc", "CPU register"]', 3),
    (v_operating_systems, 'What is a thread?', '["A unit of execution within a process", "A file permission", "A storage sector", "A device driver"]', 0),
    (v_operating_systems, 'What is the purpose of a file system?', '["Schedule CPU instructions", "Organize and manage files on storage", "Route network traffic", "Cool the processor"]', 1),
    (v_operating_systems, 'What is a race condition?', '["A CPU speed benchmark", "A disk seek operation", "An outcome that depends on timing of concurrent operations", "A process priority level"]', 2),
    (v_operating_systems, 'What does a mutex help provide?', '["Virtual addressing", "Disk partitioning", "Network routing", "Mutual exclusion for shared resources"]', 3),
    (v_operating_systems, 'What is paging in memory management?', '["Dividing memory into fixed-size pages and frames", "Printing pages from a document", "Sorting files by name", "Creating user accounts"]', 0),
    (v_operating_systems, 'What does starvation mean in process scheduling?', '["A process uses no memory", "A process waits indefinitely for needed resources or CPU time", "The system has no files", "A process has completed"]', 1),
    (v_operating_systems, 'Which component typically mediates access between the OS and hardware devices?', '["Text editor", "Web browser", "Device driver", "SQL query"]', 2);
END;
$$;



-- Migration 005: Quiz Attempts and Responses
-- Stores quiz attempt records and individual question responses

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject_id      UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    mode            TEXT NOT NULL CHECK (mode IN ('standard', 'rapid')),
    score           INT NOT NULL DEFAULT 0,
    total_questions INT NOT NULL DEFAULT 0,
    completed_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quiz_responses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id      UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id     UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    selected_answer INT  -- NULL means unanswered
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student ON quiz_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_subject ON quiz_attempts(subject_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_attempt ON quiz_responses(attempt_id);

COMMENT ON TABLE quiz_attempts IS 'Records of completed quiz attempts';
COMMENT ON TABLE quiz_responses IS 'Individual question responses within a quiz attempt';



-- Migration 006: Row Level Security (RLS) Policies
-- Every private student record is protected. Students cannot access other students' data.

-- ============================================================================
-- PROFILES
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Students can read their own profile
DROP POLICY IF EXISTS profiles_select_own ON profiles;
CREATE POLICY profiles_select_own ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Students can update their own profile
DROP POLICY IF EXISTS profiles_update_own ON profiles;
CREATE POLICY profiles_update_own ON profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Insert handled by the trigger (SECURITY DEFINER), but allow user to insert own
DROP POLICY IF EXISTS profiles_insert_own ON profiles;
CREATE POLICY profiles_insert_own ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================================
-- SUBJECTS (readable by all users, since they are public academic catalog data)
-- ============================================================================
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- Any authenticated or anonymous user can read subjects catalog
DROP POLICY IF EXISTS subjects_select_authenticated ON subjects;
DROP POLICY IF EXISTS subjects_select_all ON subjects;
CREATE POLICY subjects_select_all ON subjects
    FOR SELECT USING (true);

-- ============================================================================
-- STUDENT_SUBJECTS
-- ============================================================================
ALTER TABLE student_subjects ENABLE ROW LEVEL SECURITY;

-- Students can view their own enrollments
DROP POLICY IF EXISTS student_subjects_select_own ON student_subjects;
CREATE POLICY student_subjects_select_own ON student_subjects
    FOR SELECT USING (auth.uid() = student_id);

-- Students can enroll themselves
DROP POLICY IF EXISTS student_subjects_insert_own ON student_subjects;
CREATE POLICY student_subjects_insert_own ON student_subjects
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Students can update their enrollments (required for upsert operations)
DROP POLICY IF EXISTS student_subjects_update_own ON student_subjects;
CREATE POLICY student_subjects_update_own ON student_subjects
    FOR UPDATE USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);

-- Students can unenroll themselves
DROP POLICY IF EXISTS student_subjects_delete_own ON student_subjects;
CREATE POLICY student_subjects_delete_own ON student_subjects
    FOR DELETE USING (auth.uid() = student_id);

-- ============================================================================
-- TASKS
-- ============================================================================
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Students can only see their own tasks
DROP POLICY IF EXISTS tasks_select_own ON tasks;
CREATE POLICY tasks_select_own ON tasks
    FOR SELECT USING (auth.uid() = student_id);

-- Students can create tasks for themselves
DROP POLICY IF EXISTS tasks_insert_own ON tasks;
CREATE POLICY tasks_insert_own ON tasks
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Students can update their own tasks
DROP POLICY IF EXISTS tasks_update_own ON tasks;
CREATE POLICY tasks_update_own ON tasks
    FOR UPDATE USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);

-- Students can delete their own tasks
DROP POLICY IF EXISTS tasks_delete_own ON tasks;
CREATE POLICY tasks_delete_own ON tasks
    FOR DELETE USING (auth.uid() = student_id);

-- ============================================================================
-- QUIZ_QUESTIONS (readable by all authenticated and anonymous users)
-- ============================================================================
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

-- Any user can read quiz questions for practice
DROP POLICY IF EXISTS quiz_questions_select_authenticated ON quiz_questions;
DROP POLICY IF EXISTS quiz_questions_select_all ON quiz_questions;
CREATE POLICY quiz_questions_select_all ON quiz_questions
    FOR SELECT USING (true);

-- ============================================================================
-- QUIZ_ATTEMPTS
-- ============================================================================
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Students can view their own attempts
DROP POLICY IF EXISTS quiz_attempts_select_own ON quiz_attempts;
CREATE POLICY quiz_attempts_select_own ON quiz_attempts
    FOR SELECT USING (auth.uid() = student_id);

-- Students can create their own attempts
DROP POLICY IF EXISTS quiz_attempts_insert_own ON quiz_attempts;
CREATE POLICY quiz_attempts_insert_own ON quiz_attempts
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- ============================================================================
-- QUIZ_RESPONSES
-- ============================================================================
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- Students can view responses for their own attempts
DROP POLICY IF EXISTS quiz_responses_select_own ON quiz_responses;
CREATE POLICY quiz_responses_select_own ON quiz_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM quiz_attempts
            WHERE quiz_attempts.id = quiz_responses.attempt_id
            AND quiz_attempts.student_id = auth.uid()
        )
    );

-- Students can insert responses for their own attempts
DROP POLICY IF EXISTS quiz_responses_insert_own ON quiz_responses;
CREATE POLICY quiz_responses_insert_own ON quiz_responses
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM quiz_attempts
            WHERE quiz_attempts.id = quiz_responses.attempt_id
            AND quiz_attempts.student_id = auth.uid()
        )
    );



-- Migration 007: Comprehensive University Catalog, Academic Hierarchy & Onboarding Schema
-- Adds academic hierarchy columns to student profiles and seeds universities with RLS policies.

-- 1. Extend profiles table with academic profile fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country TEXT NOT NULL DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS university TEXT NOT NULL DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS faculty TEXT NOT NULL DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS major TEXT NOT NULL DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT false;

-- 2. Update automatic profile initialization trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, country, university, faculty, major, onboarding_completed)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'country', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'university', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'faculty', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'major', ''),
        COALESCE((NEW.raw_user_meta_data ->> 'onboarding_completed')::boolean, false)
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        country = EXCLUDED.country,
        university = EXCLUDED.university,
        faculty = EXCLUDED.faculty,
        major = EXCLUDED.major,
        onboarding_completed = EXCLUDED.onboarding_completed,
        updated_at = now();
    RETURN NEW;
END;
$$;

-- 3. Universities Table
CREATE TABLE IF NOT EXISTS public.universities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT universities_country_name_unique UNIQUE (country, name)
);

ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS university TEXT NOT NULL DEFAULT '';

-- 4. Seed accredited universities
INSERT INTO public.universities (country, name) VALUES
    -- South Korea
    ('South Korea', 'Ulsan College'),
    ('South Korea', 'Ulsan National Institute of Science and Technology (UNIST)'),
    ('South Korea', 'Seoul National University (SNU)'),
    ('South Korea', 'Korea Advanced Institute of Science and Technology (KAIST)'),
    ('South Korea', 'Korea University'),
    ('South Korea', 'Yonsei University'),
    ('South Korea', 'Pusan National University'),
    ('South Korea', 'Sungkyunkwan University (SKKU)'),
    ('South Korea', 'Hanyang University'),
    ('South Korea', 'Other institution in South Korea'),

    -- Nepal
    ('Nepal', 'Tribhuvan University (TU)'),
    ('Nepal', 'Kathmandu University (KU)'),
    ('Nepal', 'Pokhara University (PU)'),
    ('Nepal', 'Purbanchal University (PU)'),
    ('Nepal', 'Mid-Western University'),
    ('Nepal', 'Far-Western University'),
    ('Nepal', 'Nepal Open University'),
    ('Nepal', 'Other institution in Nepal'),

    -- India
    ('India', 'Indian Institute of Technology (IIT Bombay / Delhi / Madras)'),
    ('India', 'University of Delhi'),
    ('India', 'University of Mumbai'),
    ('India', 'Jawaharlal Nehru University (JNU)'),
    ('India', 'Anna University'),
    ('India', 'Vellore Institute of Technology (VIT)'),
    ('India', 'Other institution in India'),

    -- Bangladesh
    ('Bangladesh', 'University of Dhaka'),
    ('Bangladesh', 'Bangladesh University of Engineering and Technology (BUET)'),
    ('Bangladesh', 'North South University'),
    ('Bangladesh', 'BRAC University'),
    ('Bangladesh', 'Other institution in Bangladesh'),

    -- Pakistan
    ('Pakistan', 'National University of Sciences and Technology (NUST)'),
    ('Pakistan', 'Quaid-i-Azam University'),
    ('Pakistan', 'Lahore University of Management Sciences (LUMS)'),
    ('Pakistan', 'Other institution in Pakistan'),

    -- Sri Lanka
    ('Sri Lanka', 'University of Colombo'),
    ('Sri Lanka', 'University of Peradeniya'),
    ('Sri Lanka', 'University of Moratuwa'),
    ('Sri Lanka', 'Other institution in Sri Lanka'),

    -- Regional aliases for backward compatibility
    ('South Asia', 'Tribhuvan University'),
    ('South Asia', 'Kathmandu University'),
    ('South Asia', 'Pokhara University'),
    ('South Asia', 'University of Dhaka'),
    ('South Asia', 'University of Colombo'),
    ('South Asia', 'University of Delhi'),
    ('South Asia', 'University of Mumbai'),
    ('South Asia', 'Other South Asian university or college')
ON CONFLICT (country, name) DO NOTHING;

-- 5. Row Level Security on universities
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS universities_select_authenticated ON public.universities;
CREATE POLICY universities_select_authenticated ON public.universities
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS universities_select_anon ON public.universities;
CREATE POLICY universities_select_anon ON public.universities
    FOR SELECT USING (true);


-- Migration 008: Comprehensive Faculty/Major Curricula & Extended Quiz Bank
-- Seeds 32 accredited subjects across 4 faculties & 15 majors with 345 quiz questions.

-- 1. Ensure subjects table has faculty and major columns if needed
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Core';

-- 2. Upsert all 32 accredited subjects into subjects table
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Programming Fundamentals', 'programming', 'fa-code', 'Core CS', 'C, C++, Python, JavaScript logic, syntax, functions, and modular code', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Data Structures & Algorithms', 'data-structures', 'fa-diagram-project', 'Core CS', 'Arrays, linked lists, trees, graphs, sorting, searching, and complexity', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Database Management Systems', 'databases', 'fa-database', 'Core CS', 'Relational design, SQL, ACID transactions, normalization, and indexing', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Computer Networks', 'networks', 'fa-network-wired', 'Core CS', 'OSI & TCP/IP stack, routing, sockets, protocols, and security', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Operating Systems', 'operating-systems', 'fa-desktop', 'Core CS', 'Processes, threads, CPU scheduling, virtual memory, concurrency, and I/O', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Software Engineering', 'software-engineering', 'fa-sitemap', 'Software Dev', 'Agile methodologies, SDLC, requirements analysis, design patterns, testing', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Web Technologies & Cloud', 'web-cloud', 'fa-globe', 'Software Dev', 'Full-stack web, REST APIs, client-server models, Supabase, and cloud deployment', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Artificial Intelligence & ML', 'artificial-intelligence', 'fa-brain', 'Intelligence', 'Machine learning fundamentals, neural networks, supervised & unsupervised models', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Information Security & Privacy', 'cybersecurity', 'fa-shield-halved', 'Systems', 'Cryptography, network defense, authentication protocols, and web safety', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Data Science & Analytics', 'data-science', 'fa-chart-pie', 'Intelligence', 'Data wrangling, statistical inference, visualization, and Pandas/NumPy', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Discrete Mathematics', 'discrete-math', 'fa-square-root-variable', 'Mathematics', 'Logic, sets, relations, graph theory, combinatorics, and proofs', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Calculus & Linear Algebra', 'calculus-linear-algebra', 'fa-calculator', 'Mathematics', 'Matrices, vectors, eigenvalues, derivatives, and multidimensional calculus', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Probability & Statistics', 'prob-stats', 'fa-chart-simple', 'Mathematics', 'Random variables, distributions, hypothesis testing, and Bayes theorem', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Numerical Methods', 'numerical-methods', 'fa-superscript', 'Mathematics', 'Root finding, interpolation, numerical integration, and error analysis', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Capstone Design Project', 'capstone-design', 'fa-award', 'Projects', 'Team-based project delivery, architecture, Git workflow, and demo', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Technical Writing & Presentation', 'technical-writing', 'fa-pen-nib', 'General', 'Engineering reports, research documentation, proposals, and communication', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Circuit Analysis', 'circuit-analysis', 'fa-bolt', 'Engineering', 'Ohm''s and Kirchhoff''s laws, network theorems, RC/RL/RLC circuits, and AC phasors', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Digital Electronics & Logic Design', 'digital-electronics', 'fa-microchip', 'Engineering', 'Number systems, Boolean algebra, logic gates, flip-flops, and counters', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Signals & Systems', 'signals-systems', 'fa-wave-square', 'Engineering', 'Continuous and discrete signals, LTI systems, convolution, Fourier and Laplace transforms', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Communication Systems', 'communication-systems', 'fa-tower-broadcast', 'Engineering', 'Modulation, bandwidth, noise, sampling, and digital communication', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Electrical Machines & Power Systems', 'power-systems', 'fa-plug', 'Engineering', 'Transformers, motors, generators, transmission, and power factor', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Engineering Mechanics', 'engineering-mechanics', 'fa-gears', 'Engineering', 'Statics, dynamics, free-body diagrams, friction, and moments', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Structural Analysis', 'structural-analysis', 'fa-building', 'Engineering', 'Beams, trusses, loads, shear force, bending moment, and deflection', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Fluid Mechanics', 'fluid-mechanics', 'fa-water', 'Engineering', 'Fluid properties, pressure, Bernoulli''s equation, flow regimes, and pipe flow', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Thermodynamics', 'thermodynamics', 'fa-fire', 'Engineering', 'Laws of thermodynamics, heat engines, entropy, and thermodynamic cycles', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Classical Mechanics', 'classical-mechanics', 'fa-atom', 'Science', 'Newton''s laws, energy, momentum, rotation, and oscillations', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Electromagnetism', 'electromagnetism', 'fa-magnet', 'Science', 'Electric and magnetic fields, Gauss''s law, induction, and Maxwell''s equations', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Principles of Management', 'principles-of-management', 'fa-people-group', 'Business', 'Planning, organizing, leading, controlling, and organizational behavior', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Financial Accounting', 'financial-accounting', 'fa-file-invoice-dollar', 'Business', 'Double-entry bookkeeping, financial statements, and the accounting equation', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Corporate Finance', 'corporate-finance', 'fa-sack-dollar', 'Business', 'Time value of money, NPV, risk and return, and capital structure', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Marketing Management', 'marketing-management', 'fa-bullhorn', 'Business', 'Marketing mix, segmentation, targeting, positioning, and branding', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;
INSERT INTO public.subjects (name, slug, icon, category, description, is_default) VALUES ('Principles of Economics', 'economics', 'fa-scale-balanced', 'Business', 'Supply and demand, elasticity, market structures, GDP, and inflation', true) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category, description = EXCLUDED.description;

-- 3. Major to Subject Curricula Mapping Table
CREATE TABLE IF NOT EXISTS public.major_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty TEXT NOT NULL DEFAULT '',
    major TEXT NOT NULL,
    subject_slug TEXT NOT NULL REFERENCES public.subjects(slug) ON DELETE CASCADE,
    is_core BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT major_subject_slug_unique UNIQUE (major, subject_slug)
);

CREATE INDEX IF NOT EXISTS idx_major_subjects_major ON public.major_subjects(major);
CREATE INDEX IF NOT EXISTS idx_major_subjects_slug ON public.major_subjects(subject_slug);

ALTER TABLE public.major_subjects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS major_subjects_select_all ON public.major_subjects;
CREATE POLICY major_subjects_select_all ON public.major_subjects FOR SELECT USING (true);

-- 4. Seed Major-to-Subject Curricula
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Computer Science & Engineering (CSE)', 'programming', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Computer Science & Engineering (CSE)', 'data-structures', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Computer Science & Engineering (CSE)', 'databases', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Computer Science & Engineering (CSE)', 'networks', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Computer Science & Engineering (CSE)', 'operating-systems', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Computer Science & Engineering (CSE)', 'discrete-math', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Computer Science & Engineering (CSE)', 'software-engineering', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Computer Science & Engineering (CSE)', 'artificial-intelligence', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Computer Science & Engineering (CSE)', 'web-cloud', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Computer Science & Engineering (CSE)', 'calculus-linear-algebra', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Computer Science & Engineering (CSE)', 'capstone-design', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Software Engineering', 'programming', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Software Engineering', 'software-engineering', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Software Engineering', 'data-structures', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Software Engineering', 'web-cloud', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Software Engineering', 'databases', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Software Engineering', 'operating-systems', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Software Engineering', 'cybersecurity', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Software Engineering', 'capstone-design', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Software Engineering', 'technical-writing', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Information Technology (IT)', 'programming', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Information Technology (IT)', 'networks', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Information Technology (IT)', 'databases', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Information Technology (IT)', 'web-cloud', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Information Technology (IT)', 'cybersecurity', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Information Technology (IT)', 'operating-systems', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Information Technology (IT)', 'software-engineering', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Information Technology (IT)', 'technical-writing', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Information Technology (IT)', 'capstone-design', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Artificial Intelligence & Data Science', 'programming', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Artificial Intelligence & Data Science', 'artificial-intelligence', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Artificial Intelligence & Data Science', 'data-science', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Artificial Intelligence & Data Science', 'prob-stats', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Artificial Intelligence & Data Science', 'calculus-linear-algebra', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Artificial Intelligence & Data Science', 'data-structures', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Artificial Intelligence & Data Science', 'databases', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Artificial Intelligence & Data Science', 'numerical-methods', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Artificial Intelligence & Data Science', 'discrete-math', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Artificial Intelligence & Data Science', 'capstone-design', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Cybersecurity & Network Systems', 'networks', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Cybersecurity & Network Systems', 'cybersecurity', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Cybersecurity & Network Systems', 'operating-systems', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Cybersecurity & Network Systems', 'programming', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Cybersecurity & Network Systems', 'discrete-math', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Cybersecurity & Network Systems', 'databases', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Cybersecurity & Network Systems', 'web-cloud', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Computer Science & Information Technology', 'Cybersecurity & Network Systems', 'capstone-design', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Electronics & Communication Engineering', 'circuit-analysis', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Electronics & Communication Engineering', 'digital-electronics', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Electronics & Communication Engineering', 'signals-systems', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Electronics & Communication Engineering', 'communication-systems', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Electronics & Communication Engineering', 'calculus-linear-algebra', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Electronics & Communication Engineering', 'programming', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Electronics & Communication Engineering', 'electromagnetism', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Electronics & Communication Engineering', 'prob-stats', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Electronics & Communication Engineering', 'networks', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Electronics & Communication Engineering', 'capstone-design', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Electrical & Information Engineering', 'circuit-analysis', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Electrical & Information Engineering', 'power-systems', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Electrical & Information Engineering', 'digital-electronics', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Electrical & Information Engineering', 'signals-systems', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Electrical & Information Engineering', 'electromagnetism', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Electrical & Information Engineering', 'programming', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Electrical & Information Engineering', 'calculus-linear-algebra', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Electrical & Information Engineering', 'numerical-methods', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Electrical & Information Engineering', 'capstone-design', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Civil Engineering', 'engineering-mechanics', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Civil Engineering', 'structural-analysis', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Civil Engineering', 'fluid-mechanics', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Civil Engineering', 'calculus-linear-algebra', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Civil Engineering', 'numerical-methods', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Civil Engineering', 'prob-stats', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Civil Engineering', 'technical-writing', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Civil Engineering', 'capstone-design', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Mechanical Engineering', 'engineering-mechanics', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Mechanical Engineering', 'thermodynamics', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Mechanical Engineering', 'fluid-mechanics', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Mechanical Engineering', 'calculus-linear-algebra', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Mechanical Engineering', 'classical-mechanics', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Mechanical Engineering', 'numerical-methods', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Mechanical Engineering', 'programming', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Engineering & Technology', 'Mechanical Engineering', 'capstone-design', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Science & Mathematics', 'Mathematics & Computing', 'calculus-linear-algebra', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Science & Mathematics', 'Mathematics & Computing', 'discrete-math', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Science & Mathematics', 'Mathematics & Computing', 'numerical-methods', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Science & Mathematics', 'Mathematics & Computing', 'programming', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Science & Mathematics', 'Mathematics & Computing', 'prob-stats', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Science & Mathematics', 'Mathematics & Computing', 'data-structures', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Science & Mathematics', 'Mathematics & Computing', 'data-science', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Science & Mathematics', 'Mathematics & Computing', 'artificial-intelligence', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Science & Mathematics', 'Applied Statistics & Data Analysis', 'prob-stats', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Science & Mathematics', 'Applied Statistics & Data Analysis', 'data-science', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Science & Mathematics', 'Applied Statistics & Data Analysis', 'calculus-linear-algebra', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Science & Mathematics', 'Applied Statistics & Data Analysis', 'programming', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Science & Mathematics', 'Applied Statistics & Data Analysis', 'numerical-methods', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Science & Mathematics', 'Applied Statistics & Data Analysis', 'databases', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Science & Mathematics', 'Applied Statistics & Data Analysis', 'artificial-intelligence', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Science & Mathematics', 'Applied Statistics & Data Analysis', 'economics', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Science & Mathematics', 'Physics & Computational Modeling', 'classical-mechanics', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Science & Mathematics', 'Physics & Computational Modeling', 'electromagnetism', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Science & Mathematics', 'Physics & Computational Modeling', 'calculus-linear-algebra', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Science & Mathematics', 'Physics & Computational Modeling', 'numerical-methods', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Science & Mathematics', 'Physics & Computational Modeling', 'programming', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Science & Mathematics', 'Physics & Computational Modeling', 'thermodynamics', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Science & Mathematics', 'Physics & Computational Modeling', 'prob-stats', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Business & Management Studies', 'Management Information Systems (MIS)', 'principles-of-management', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Business & Management Studies', 'Management Information Systems (MIS)', 'databases', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Business & Management Studies', 'Management Information Systems (MIS)', 'financial-accounting', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Business & Management Studies', 'Management Information Systems (MIS)', 'web-cloud', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Business & Management Studies', 'Management Information Systems (MIS)', 'data-science', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Business & Management Studies', 'Management Information Systems (MIS)', 'software-engineering', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Business & Management Studies', 'Management Information Systems (MIS)', 'marketing-management', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Business & Management Studies', 'Management Information Systems (MIS)', 'technical-writing', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Business & Management Studies', 'Business Administration & Tech Management', 'principles-of-management', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Business & Management Studies', 'Business Administration & Tech Management', 'financial-accounting', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Business & Management Studies', 'Business Administration & Tech Management', 'marketing-management', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Business & Management Studies', 'Business Administration & Tech Management', 'economics', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Business & Management Studies', 'Business Administration & Tech Management', 'corporate-finance', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Business & Management Studies', 'Business Administration & Tech Management', 'software-engineering', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Business & Management Studies', 'Business Administration & Tech Management', 'technical-writing', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Business & Management Studies', 'FinTech & Financial Engineering', 'corporate-finance', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Business & Management Studies', 'FinTech & Financial Engineering', 'financial-accounting', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Business & Management Studies', 'FinTech & Financial Engineering', 'economics', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Business & Management Studies', 'FinTech & Financial Engineering', 'prob-stats', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Business & Management Studies', 'FinTech & Financial Engineering', 'programming', true) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Business & Management Studies', 'FinTech & Financial Engineering', 'data-science', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Business & Management Studies', 'FinTech & Financial Engineering', 'cybersecurity', false) ON CONFLICT (major, subject_slug) DO NOTHING;
INSERT INTO public.major_subjects (faculty, major, subject_slug, is_core) VALUES ('Faculty of Business & Management Studies', 'FinTech & Financial Engineering', 'numerical-methods', false) ON CONFLICT (major, subject_slug) DO NOTHING;

-- 5. Seed Quiz Questions for All 32 Subjects
DO $$
DECLARE
    v_sub_id UUID;
    v_programming UUID;
    v_data_structures UUID;
    v_databases UUID;
    v_networks UUID;
    v_operating_systems UUID;
    v_software_engineering UUID;
    v_web_cloud UUID;
    v_artificial_intelligence UUID;
    v_cybersecurity UUID;
    v_data_science UUID;
    v_discrete_math UUID;
    v_calculus_linear_algebra UUID;
    v_prob_stats UUID;
    v_numerical_methods UUID;
    v_capstone_design UUID;
    v_technical_writing UUID;
    v_circuit_analysis UUID;
    v_digital_electronics UUID;
    v_signals_systems UUID;
    v_communication_systems UUID;
    v_power_systems UUID;
    v_engineering_mechanics UUID;
    v_structural_analysis UUID;
    v_fluid_mechanics UUID;
    v_thermodynamics UUID;
    v_classical_mechanics UUID;
    v_electromagnetism UUID;
    v_principles_of_management UUID;
    v_financial_accounting UUID;
    v_corporate_finance UUID;
    v_marketing_management UUID;
    v_economics UUID;
BEGIN
    SELECT id INTO v_programming FROM public.subjects WHERE slug = 'programming';
    SELECT id INTO v_data_structures FROM public.subjects WHERE slug = 'data-structures';
    SELECT id INTO v_databases FROM public.subjects WHERE slug = 'databases';
    SELECT id INTO v_networks FROM public.subjects WHERE slug = 'networks';
    SELECT id INTO v_operating_systems FROM public.subjects WHERE slug = 'operating-systems';
    SELECT id INTO v_software_engineering FROM public.subjects WHERE slug = 'software-engineering';
    SELECT id INTO v_web_cloud FROM public.subjects WHERE slug = 'web-cloud';
    SELECT id INTO v_artificial_intelligence FROM public.subjects WHERE slug = 'artificial-intelligence';
    SELECT id INTO v_cybersecurity FROM public.subjects WHERE slug = 'cybersecurity';
    SELECT id INTO v_data_science FROM public.subjects WHERE slug = 'data-science';
    SELECT id INTO v_discrete_math FROM public.subjects WHERE slug = 'discrete-math';
    SELECT id INTO v_calculus_linear_algebra FROM public.subjects WHERE slug = 'calculus-linear-algebra';
    SELECT id INTO v_prob_stats FROM public.subjects WHERE slug = 'prob-stats';
    SELECT id INTO v_numerical_methods FROM public.subjects WHERE slug = 'numerical-methods';
    SELECT id INTO v_capstone_design FROM public.subjects WHERE slug = 'capstone-design';
    SELECT id INTO v_technical_writing FROM public.subjects WHERE slug = 'technical-writing';
    SELECT id INTO v_circuit_analysis FROM public.subjects WHERE slug = 'circuit-analysis';
    SELECT id INTO v_digital_electronics FROM public.subjects WHERE slug = 'digital-electronics';
    SELECT id INTO v_signals_systems FROM public.subjects WHERE slug = 'signals-systems';
    SELECT id INTO v_communication_systems FROM public.subjects WHERE slug = 'communication-systems';
    SELECT id INTO v_power_systems FROM public.subjects WHERE slug = 'power-systems';
    SELECT id INTO v_engineering_mechanics FROM public.subjects WHERE slug = 'engineering-mechanics';
    SELECT id INTO v_structural_analysis FROM public.subjects WHERE slug = 'structural-analysis';
    SELECT id INTO v_fluid_mechanics FROM public.subjects WHERE slug = 'fluid-mechanics';
    SELECT id INTO v_thermodynamics FROM public.subjects WHERE slug = 'thermodynamics';
    SELECT id INTO v_classical_mechanics FROM public.subjects WHERE slug = 'classical-mechanics';
    SELECT id INTO v_electromagnetism FROM public.subjects WHERE slug = 'electromagnetism';
    SELECT id INTO v_principles_of_management FROM public.subjects WHERE slug = 'principles-of-management';
    SELECT id INTO v_financial_accounting FROM public.subjects WHERE slug = 'financial-accounting';
    SELECT id INTO v_corporate_finance FROM public.subjects WHERE slug = 'corporate-finance';
    SELECT id INTO v_marketing_management FROM public.subjects WHERE slug = 'marketing-management';
    SELECT id INTO v_economics FROM public.subjects WHERE slug = 'economics';
    -- programming (15 questions)
    IF v_programming IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_programming AND question = 'Which JavaScript keyword declares a block-scoped variable that can be reassigned?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_programming, 'Which JavaScript keyword declares a block-scoped variable that can be reassigned?', '["const", "let", "static", "define"]'::jsonb, 1);
    END IF;
    IF v_programming IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_programming AND question = 'Which HTML element represents the most important heading?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_programming, 'Which HTML element represents the most important heading?', '["<h6>", "<head>", "<h1>", "<title>"]'::jsonb, 2);
    END IF;
    IF v_programming IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_programming AND question = 'Which CSS property changes the color of text?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_programming, 'Which CSS property changes the color of text?', '["font-style", "background", "text-align", "color"]'::jsonb, 3);
    END IF;
    IF v_programming IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_programming AND question = 'What does a Boolean value represent?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_programming, 'What does a Boolean value represent?', '["True or false", "A decimal number", "A sequence of characters", "A memory address"]'::jsonb, 0);
    END IF;
    IF v_programming IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_programming AND question = 'What is the main purpose of a function?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_programming, 'What is the main purpose of a function?', '["To store database rows", "To group reusable instructions", "To increase screen resolution", "To allocate network ports"]'::jsonb, 1);
    END IF;
    IF v_programming IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_programming AND question = 'What does debugging help a programmer do?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_programming, 'What does debugging help a programmer do?', '["Compress source code", "Design a database", "Find and fix errors", "Encrypt every variable"]'::jsonb, 2);
    END IF;
    IF v_programming IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_programming AND question = 'Which JavaScript operator checks both value and type equality?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_programming, 'Which JavaScript operator checks both value and type equality?', '["==", "=", "!=", "==="]'::jsonb, 3);
    END IF;
    IF v_programming IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_programming AND question = 'What is a parameter in a function?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_programming, 'What is a parameter in a function?', '["A named input the function can use", "The value returned by every function", "A syntax error", "A loop condition"]'::jsonb, 0);
    END IF;
    IF v_programming IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_programming AND question = 'What does an array commonly store?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_programming, 'What does an array commonly store?', '["One named function only", "An ordered collection of values", "Only true/false values", "A network protocol"]'::jsonb, 1);
    END IF;
    IF v_programming IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_programming AND question = 'Which keyword exits a loop immediately in many programming languages?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_programming, 'Which keyword exits a loop immediately in many programming languages?', '["skip", "return-all", "break", "next-loop"]'::jsonb, 2);
    END IF;
    IF v_programming IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_programming AND question = 'What is the result of 9 % 4 in JavaScript?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_programming, 'What is the result of 9 % 4 in JavaScript?', '["1", "2", "2.25", "36"]'::jsonb, 0);
    END IF;
    IF v_programming IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_programming AND question = 'What is a syntax error?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_programming, 'What is a syntax error?', '["A slow algorithm", "A rule violation in how code is written", "A missing user account", "A full hard drive"]'::jsonb, 1);
    END IF;
    IF v_programming IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_programming AND question = 'Which statement runs a block only when its condition is true?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_programming, 'Which statement runs a block only when its condition is true?', '["import", "class", "if", "return"]'::jsonb, 2);
    END IF;
    IF v_programming IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_programming AND question = 'What does a return statement do in a function?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_programming, 'What does a return statement do in a function?', '["Repeats a loop", "Declares a variable", "Catches every error", "Sends a value back to the caller"]'::jsonb, 3);
    END IF;
    IF v_programming IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_programming AND question = 'What does source control help a team track?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_programming, 'What does source control help a team track?', '["Changes to files over time", "CPU temperature", "Monitor brightness", "Internet speed"]'::jsonb, 0);
    END IF;
    -- data-structures (15 questions)
    IF v_data_structures IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_data_structures AND question = 'Which structure follows last-in, first-out order?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_data_structures, 'Which structure follows last-in, first-out order?', '["Queue", "Stack", "Heap", "Graph"]'::jsonb, 1);
    END IF;
    IF v_data_structures IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_data_structures AND question = 'Which structure follows first-in, first-out order?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_data_structures, 'Which structure follows first-in, first-out order?', '["Stack", "Tree", "Queue", "Set"]'::jsonb, 2);
    END IF;
    IF v_data_structures IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_data_structures AND question = 'In a typical array, what is the time complexity of accessing an element by index?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_data_structures, 'In a typical array, what is the time complexity of accessing an element by index?', '["O(1)", "O(log n)", "O(n)", "O(n²)"]'::jsonb, 0);
    END IF;
    IF v_data_structures IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_data_structures AND question = 'Which data structure is commonly used to implement a priority queue?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_data_structures, 'Which data structure is commonly used to implement a priority queue?', '["Linked list only", "Binary heap", "Hash set", "Stack"]'::jsonb, 1);
    END IF;
    IF v_data_structures IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_data_structures AND question = 'What is the average lookup time for a well-distributed hash table?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_data_structures, 'What is the average lookup time for a well-distributed hash table?', '["O(n)", "O(log n)", "O(1)", "O(n log n)"]'::jsonb, 2);
    END IF;
    IF v_data_structures IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_data_structures AND question = 'In a binary search tree, values in the left subtree are usually:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_data_structures, 'In a binary search tree, values in the left subtree are usually:', '["Smaller than the node", "Larger than the node", "Always equal to the node", "Stored as child indexes"]'::jsonb, 0);
    END IF;
    IF v_data_structures IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_data_structures AND question = 'Which traversal explores a graph level by level?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_data_structures, 'Which traversal explores a graph level by level?', '["Depth-first search", "In-order traversal", "Breadth-first search", "Binary search"]'::jsonb, 2);
    END IF;
    IF v_data_structures IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_data_structures AND question = 'What is the worst-case time complexity of linear search?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_data_structures, 'What is the worst-case time complexity of linear search?', '["O(1)", "O(log n)", "O(n)", "O(n log n)"]'::jsonb, 2);
    END IF;
    IF v_data_structures IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_data_structures AND question = 'Which structure connects nodes using edges and has no required root?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_data_structures, 'Which structure connects nodes using edges and has no required root?', '["Graph", "Stack", "Array", "Queue"]'::jsonb, 0);
    END IF;
    IF v_data_structures IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_data_structures AND question = 'What is a leaf in a tree?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_data_structures, 'What is a leaf in a tree?', '["A node with no children", "The root node", "An edge between roots", "A cycle"]'::jsonb, 0);
    END IF;
    IF v_data_structures IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_data_structures AND question = 'Which sorting algorithm repeatedly partitions around a pivot?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_data_structures, 'Which sorting algorithm repeatedly partitions around a pivot?', '["Selection sort", "Quick sort", "Insertion sort", "Counting sort"]'::jsonb, 1);
    END IF;
    IF v_data_structures IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_data_structures AND question = 'What does a linked list node typically contain?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_data_structures, 'What does a linked list node typically contain?', '["Only an array index", "A value and link(s) to other node(s)", "A database table", "A sorting algorithm"]'::jsonb, 1);
    END IF;
    IF v_data_structures IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_data_structures AND question = 'Which algorithmic technique solves problems by combining results from smaller subproblems?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_data_structures, 'Which algorithmic technique solves problems by combining results from smaller subproblems?', '["Brute-force enumeration", "Hashing", "Divide and conquer", "Linear probing"]'::jsonb, 2);
    END IF;
    IF v_data_structures IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_data_structures AND question = 'A balanced binary search tree keeps its height approximately:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_data_structures, 'A balanced binary search tree keeps its height approximately:', '["O(log n)", "O(n²)", "O(1) for every size", "O(2ⁿ)"]'::jsonb, 0);
    END IF;
    IF v_data_structures IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_data_structures AND question = 'Which data structure is most suitable for checking whether an item has appeared before?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_data_structures, 'Which data structure is most suitable for checking whether an item has appeared before?', '["Queue", "Hash set", "Stack", "Tree traversal list"]'::jsonb, 1);
    END IF;
    -- databases (15 questions)
    IF v_databases IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_databases AND question = 'What does SQL stand for?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_databases, 'What does SQL stand for?', '["Structured Query Language", "Sequential Question Logic", "System Quality Layer", "Simple Queue Language"]'::jsonb, 0);
    END IF;
    IF v_databases IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_databases AND question = 'Which key uniquely identifies a row in a relational table?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_databases, 'Which key uniquely identifies a row in a relational table?', '["Foreign key", "Primary key", "Index label", "Nullable key"]'::jsonb, 1);
    END IF;
    IF v_databases IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_databases AND question = 'What is the purpose of a foreign key?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_databases, 'What is the purpose of a foreign key?', '["To encrypt a table", "To sort every row", "To reference a key in another table", "To create a backup"]'::jsonb, 2);
    END IF;
    IF v_databases IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_databases AND question = 'Which SQL command retrieves rows from a table?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_databases, 'Which SQL command retrieves rows from a table?', '["FETCH TABLE", "OPEN", "RETRIEVE", "SELECT"]'::jsonb, 3);
    END IF;
    IF v_databases IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_databases AND question = 'Which clause filters rows before grouping?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_databases, 'Which clause filters rows before grouping?', '["WHERE", "ORDER BY", "HAVING", "LIMIT"]'::jsonb, 0);
    END IF;
    IF v_databases IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_databases AND question = 'What does a JOIN do in a relational query?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_databases, 'What does a JOIN do in a relational query?', '["Deletes duplicate databases", "Combines related rows from tables", "Changes a column type", "Backs up a table"]'::jsonb, 1);
    END IF;
    IF v_databases IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_databases AND question = 'Which property is expected of a transaction under ACID?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_databases, 'Which property is expected of a transaction under ACID?', '["Approximation", "Caching", "Atomicity", "Duplication"]'::jsonb, 2);
    END IF;
    IF v_databases IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_databases AND question = 'What is database normalization primarily intended to reduce?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_databases, 'What is database normalization primarily intended to reduce?', '["Data redundancy and update anomalies", "Query language features", "The number of users", "All indexes"]'::jsonb, 0);
    END IF;
    IF v_databases IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_databases AND question = 'Which SQL command adds a new row?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_databases, 'Which SQL command adds a new row?', '["APPEND ROW", "INSERT INTO", "ADD COLUMN", "CREATE ROW"]'::jsonb, 1);
    END IF;
    IF v_databases IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_databases AND question = 'What does an index generally improve?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_databases, 'What does an index generally improve?', '["Query lookup speed", "Disk capacity", "Data accuracy automatically", "Network encryption"]'::jsonb, 0);
    END IF;
    IF v_databases IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_databases AND question = 'Which clause sorts query results?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_databases, 'Which clause sorts query results?', '["GROUP BY", "HAVING", "ORDER BY", "SORT TABLE"]'::jsonb, 2);
    END IF;
    IF v_databases IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_databases AND question = 'What does NULL typically mean in a database?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_databases, 'What does NULL typically mean in a database?', '["The number zero", "An empty string in every system", "False", "A missing or unknown value"]'::jsonb, 3);
    END IF;
    IF v_databases IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_databases AND question = 'Which SQL operation changes existing rows?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_databases, 'Which SQL operation changes existing rows?', '["UPDATE", "CREATE", "SELECT", "GRANT"]'::jsonb, 0);
    END IF;
    IF v_databases IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_databases AND question = 'What does GROUP BY do?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_databases, 'What does GROUP BY do?', '["Removes a table", "Groups rows that share values for aggregation", "Encrypts grouped columns", "Orders rows alphabetically only"]'::jsonb, 1);
    END IF;
    IF v_databases IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_databases AND question = 'Which database model stores data as documents, key-value pairs, or graphs instead of only relational tables?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_databases, 'Which database model stores data as documents, key-value pairs, or graphs instead of only relational tables?', '["Spreadsheet", "Relational only", "NoSQL", "Flat-file index"]'::jsonb, 2);
    END IF;
    -- networks (15 questions)
    IF v_networks IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_networks AND question = 'What does IP stand for in networking?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_networks, 'What does IP stand for in networking?', '["Internet Protocol", "Internal Process", "Interface Program", "Integrated Port"]'::jsonb, 0);
    END IF;
    IF v_networks IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_networks AND question = 'Which protocol provides reliable, ordered delivery using a connection?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_networks, 'Which protocol provides reliable, ordered delivery using a connection?', '["UDP", "TCP", "IP", "ARP"]'::jsonb, 1);
    END IF;
    IF v_networks IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_networks AND question = 'What is the main purpose of DNS?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_networks, 'What is the main purpose of DNS?', '["Encrypt files", "Assign CPU time", "Translate domain names to IP addresses", "Detect hardware errors"]'::jsonb, 2);
    END IF;
    IF v_networks IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_networks AND question = 'Which device forwards packets between different networks?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_networks, 'Which device forwards packets between different networks?', '["Hub", "Repeater", "Switch", "Router"]'::jsonb, 3);
    END IF;
    IF v_networks IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_networks AND question = 'How many layers are in the commonly taught OSI model?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_networks, 'How many layers are in the commonly taught OSI model?', '["Seven", "Four", "Five", "Eight"]'::jsonb, 0);
    END IF;
    IF v_networks IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_networks AND question = 'Which protocol is commonly used to securely browse websites?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_networks, 'Which protocol is commonly used to securely browse websites?', '["FTP", "HTTPS", "SMTP", "DHCP"]'::jsonb, 1);
    END IF;
    IF v_networks IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_networks AND question = 'What does DHCP commonly provide to a client?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_networks, 'What does DHCP commonly provide to a client?', '["A domain name certificate", "A MAC address", "Network configuration such as an IP address", "A web page"]'::jsonb, 2);
    END IF;
    IF v_networks IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_networks AND question = 'Which transport protocol is connectionless and does not guarantee delivery?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_networks, 'Which transport protocol is connectionless and does not guarantee delivery?', '["TCP", "HTTP", "SSH", "UDP"]'::jsonb, 3);
    END IF;
    IF v_networks IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_networks AND question = 'What is a MAC address associated with?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_networks, 'What is a MAC address associated with?', '["A network interface at the link layer", "A web domain", "A TCP port", "A file system"]'::jsonb, 0);
    END IF;
    IF v_networks IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_networks AND question = 'What is the purpose of a subnet mask?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_networks, 'What is the purpose of a subnet mask?', '["To encrypt a packet", "To identify network and host portions of an IP address", "To map a URL to HTML", "To increase Wi-Fi signal"]'::jsonb, 1);
    END IF;
    IF v_networks IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_networks AND question = 'Which protocol is used to send email between mail servers?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_networks, 'Which protocol is used to send email between mail servers?', '["POP3", "IMAP", "SMTP", "SNMP"]'::jsonb, 2);
    END IF;
    IF v_networks IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_networks AND question = 'What does bandwidth describe in a data connection?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_networks, 'What does bandwidth describe in a data connection?', '["The physical length of a cable", "The number of devices on a LAN", "A packet’s destination", "The maximum data transfer capacity"]'::jsonb, 3);
    END IF;
    IF v_networks IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_networks AND question = 'Which network topology connects devices to a central switch or hub?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_networks, 'Which network topology connects devices to a central switch or hub?', '["Star", "Ring", "Bus", "Mesh only"]'::jsonb, 0);
    END IF;
    IF v_networks IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_networks AND question = 'What is latency?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_networks, 'What is latency?', '["The number of IP addresses", "The time delay for data to travel", "The size of a hard drive", "The encryption key length"]'::jsonb, 1);
    END IF;
    IF v_networks IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_networks AND question = 'Which protocol securely supports remote command-line access?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_networks, 'Which protocol securely supports remote command-line access?', '["Telnet", "HTTP", "SSH", "TFTP"]'::jsonb, 2);
    END IF;
    -- operating-systems (15 questions)
    IF v_operating_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_operating_systems AND question = 'What is the main role of an operating system?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_operating_systems, 'What is the main role of an operating system?', '["Manage computer resources and provide services to programs", "Design web pages", "Manufacture a CPU", "Translate domain names"]'::jsonb, 0);
    END IF;
    IF v_operating_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_operating_systems AND question = 'What is a process?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_operating_systems, 'What is a process?', '["A stored source-code comment", "A program in execution", "A network cable", "A database column"]'::jsonb, 1);
    END IF;
    IF v_operating_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_operating_systems AND question = 'Which scheduling algorithm assigns each process a fixed time slice in turn?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_operating_systems, 'Which scheduling algorithm assigns each process a fixed time slice in turn?', '["Shortest job first", "Priority only", "Round robin", "First-fit"]'::jsonb, 2);
    END IF;
    IF v_operating_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_operating_systems AND question = 'What is virtual memory?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_operating_systems, 'What is virtual memory?', '["A type of CPU cache only", "A second physical processor", "A backup power supply", "An abstraction that uses storage to extend addressable memory"]'::jsonb, 3);
    END IF;
    IF v_operating_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_operating_systems AND question = 'What condition describes two or more processes waiting indefinitely for resources held by each other?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_operating_systems, 'What condition describes two or more processes waiting indefinitely for resources held by each other?', '["Deadlock", "Thrashing", "Starvation-free scheduling", "Context switching"]'::jsonb, 0);
    END IF;
    IF v_operating_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_operating_systems AND question = 'What does a context switch do?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_operating_systems, 'What does a context switch do?', '["Formats a disk", "Saves one process state and loads another", "Compiles source code", "Changes a user password"]'::jsonb, 1);
    END IF;
    IF v_operating_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_operating_systems AND question = 'What is a system call?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_operating_systems, 'What is a system call?', '["A phone call to support", "A compiler warning", "A request for a service from the operating system", "A network broadcast"]'::jsonb, 2);
    END IF;
    IF v_operating_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_operating_systems AND question = 'Which memory is typically fastest and closest to the CPU?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_operating_systems, 'Which memory is typically fastest and closest to the CPU?', '["Hard disk", "RAM", "Optical disc", "CPU register"]'::jsonb, 3);
    END IF;
    IF v_operating_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_operating_systems AND question = 'What is a thread?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_operating_systems, 'What is a thread?', '["A unit of execution within a process", "A file permission", "A storage sector", "A device driver"]'::jsonb, 0);
    END IF;
    IF v_operating_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_operating_systems AND question = 'What is the purpose of a file system?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_operating_systems, 'What is the purpose of a file system?', '["Schedule CPU instructions", "Organize and manage files on storage", "Route network traffic", "Cool the processor"]'::jsonb, 1);
    END IF;
    IF v_operating_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_operating_systems AND question = 'What is a race condition?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_operating_systems, 'What is a race condition?', '["A CPU speed benchmark", "A disk seek operation", "An outcome that depends on timing of concurrent operations", "A process priority level"]'::jsonb, 2);
    END IF;
    IF v_operating_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_operating_systems AND question = 'What does a mutex help provide?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_operating_systems, 'What does a mutex help provide?', '["Virtual addressing", "Disk partitioning", "Network routing", "Mutual exclusion for shared resources"]'::jsonb, 3);
    END IF;
    IF v_operating_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_operating_systems AND question = 'What is paging in memory management?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_operating_systems, 'What is paging in memory management?', '["Dividing memory into fixed-size pages and frames", "Printing pages from a document", "Sorting files by name", "Creating user accounts"]'::jsonb, 0);
    END IF;
    IF v_operating_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_operating_systems AND question = 'What does starvation mean in process scheduling?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_operating_systems, 'What does starvation mean in process scheduling?', '["A process uses no memory", "A process waits indefinitely for needed resources or CPU time", "The system has no files", "A process has completed"]'::jsonb, 1);
    END IF;
    IF v_operating_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_operating_systems AND question = 'Which component typically mediates access between the OS and hardware devices?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_operating_systems, 'Which component typically mediates access between the OS and hardware devices?', '["Text editor", "Web browser", "Device driver", "SQL query"]'::jsonb, 2);
    END IF;
    -- software-engineering (10 questions)
    IF v_software_engineering IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_software_engineering AND question = 'Which SDLC model completes each phase fully before the next one begins?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_software_engineering, 'Which SDLC model completes each phase fully before the next one begins?', '["Waterfall", "Scrum", "Kanban", "Extreme Programming"]'::jsonb, 0);
    END IF;
    IF v_software_engineering IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_software_engineering AND question = 'In Scrum, what is a fixed-length development iteration called?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_software_engineering, 'In Scrum, what is a fixed-length development iteration called?', '["Epic", "Sprint", "Backlog", "Release train"]'::jsonb, 1);
    END IF;
    IF v_software_engineering IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_software_engineering AND question = 'What does a unit test verify?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_software_engineering, 'What does a unit test verify?', '["The whole system under heavy load", "Network latency", "A small, isolated piece of code", "User interface colors"]'::jsonb, 2);
    END IF;
    IF v_software_engineering IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_software_engineering AND question = 'Which document captures what a system must do?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_software_engineering, 'Which document captures what a system must do?', '["Deployment log", "Test coverage report", "Commit history", "Software requirements specification"]'::jsonb, 3);
    END IF;
    IF v_software_engineering IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_software_engineering AND question = 'What is refactoring?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_software_engineering, 'What is refactoring?', '["Improving code structure without changing its behavior", "Adding new features", "Deleting all tests", "Rewriting the app in a new language"]'::jsonb, 0);
    END IF;
    IF v_software_engineering IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_software_engineering AND question = 'Which design pattern ensures a class has only one instance?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_software_engineering, 'Which design pattern ensures a class has only one instance?', '["Observer", "Singleton", "Factory", "Adapter"]'::jsonb, 1);
    END IF;
    IF v_software_engineering IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_software_engineering AND question = 'What does version control such as Git primarily provide?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_software_engineering, 'What does version control such as Git primarily provide?', '["A faster CPU", "Database indexing", "History and collaboration on code changes", "Automatic UI design"]'::jsonb, 2);
    END IF;
    IF v_software_engineering IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_software_engineering AND question = 'A functional requirement describes:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_software_engineering, 'A functional requirement describes:', '["Hardware cost", "Coding style", "Team schedule", "A behavior the system must perform"]'::jsonb, 3);
    END IF;
    IF v_software_engineering IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_software_engineering AND question = 'What is continuous integration?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_software_engineering, 'What is continuous integration?', '["Frequently merging code with automated builds and tests", "Releasing software once a year", "Testing only manually", "Writing documentation after release"]'::jsonb, 0);
    END IF;
    IF v_software_engineering IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_software_engineering AND question = 'Which UML diagram shows interactions between objects over time?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_software_engineering, 'Which UML diagram shows interactions between objects over time?', '["Class diagram", "Sequence diagram", "Deployment diagram", "Use case diagram"]'::jsonb, 1);
    END IF;
    -- web-cloud (10 questions)
    IF v_web_cloud IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_web_cloud AND question = 'Which HTTP method is typically used to retrieve data?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_web_cloud, 'Which HTTP method is typically used to retrieve data?', '["GET", "POST", "DELETE", "PATCH"]'::jsonb, 0);
    END IF;
    IF v_web_cloud IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_web_cloud AND question = 'What does REST stand for?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_web_cloud, 'What does REST stand for?', '["Remote Execution Script Technology", "Representational State Transfer", "Reliable Encrypted Session Transport", "Rapid Endpoint Service Tool"]'::jsonb, 1);
    END IF;
    IF v_web_cloud IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_web_cloud AND question = 'What does HTTP status code 404 mean?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_web_cloud, 'What does HTTP status code 404 mean?', '["Internal server error", "Unauthorized", "Resource not found", "Success"]'::jsonb, 2);
    END IF;
    IF v_web_cloud IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_web_cloud AND question = 'Which data format is most common for REST API payloads?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_web_cloud, 'Which data format is most common for REST API payloads?', '["BMP", "WAV", "PDF", "JSON"]'::jsonb, 3);
    END IF;
    IF v_web_cloud IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_web_cloud AND question = 'What does CSS control on a web page?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_web_cloud, 'What does CSS control on a web page?', '["Presentation and layout", "Database queries", "Server routing", "DNS lookups"]'::jsonb, 0);
    END IF;
    IF v_web_cloud IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_web_cloud AND question = 'In cloud computing, what does IaaS provide?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_web_cloud, 'In cloud computing, what does IaaS provide?', '["Only finished applications", "Virtualized infrastructure such as servers and storage", "Only email accounts", "Only domain names"]'::jsonb, 1);
    END IF;
    IF v_web_cloud IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_web_cloud AND question = 'What is the main role of a CDN?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_web_cloud, 'What is the main role of a CDN?', '["Encrypt passwords", "Compile JavaScript", "Serve content from servers close to users", "Host the database schema"]'::jsonb, 2);
    END IF;
    IF v_web_cloud IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_web_cloud AND question = 'Which HTTP status code means a request succeeded?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_web_cloud, 'Which HTTP status code means a request succeeded?', '["500", "301", "403", "200"]'::jsonb, 3);
    END IF;
    IF v_web_cloud IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_web_cloud AND question = 'What does CORS control in a browser?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_web_cloud, 'What does CORS control in a browser?', '["Which origins may access a resource", "CPU scheduling", "Disk partitions", "Email spam filtering"]'::jsonb, 0);
    END IF;
    IF v_web_cloud IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_web_cloud AND question = 'Supabase is primarily built on which database?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_web_cloud, 'Supabase is primarily built on which database?', '["MongoDB", "PostgreSQL", "SQLite", "Oracle"]'::jsonb, 1);
    END IF;
    -- artificial-intelligence (10 questions)
    IF v_artificial_intelligence IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_artificial_intelligence AND question = 'Supervised learning trains a model using:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_artificial_intelligence, 'Supervised learning trains a model using:', '["Labeled examples", "No data at all", "Random weights only", "Only unlabeled clusters"]'::jsonb, 0);
    END IF;
    IF v_artificial_intelligence IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_artificial_intelligence AND question = 'Which machine-learning task predicts a continuous value?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_artificial_intelligence, 'Which machine-learning task predicts a continuous value?', '["Classification", "Regression", "Clustering", "Tokenization"]'::jsonb, 1);
    END IF;
    IF v_artificial_intelligence IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_artificial_intelligence AND question = 'Overfitting means a model:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_artificial_intelligence, 'Overfitting means a model:', '["Is too simple to learn anything", "Has no parameters", "Performs well on training data but poorly on new data", "Always generalizes perfectly"]'::jsonb, 2);
    END IF;
    IF v_artificial_intelligence IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_artificial_intelligence AND question = 'Which algorithm groups unlabeled data into k clusters?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_artificial_intelligence, 'Which algorithm groups unlabeled data into k clusters?', '["Linear regression", "Decision tree", "Naive Bayes", "K-means"]'::jsonb, 3);
    END IF;
    IF v_artificial_intelligence IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_artificial_intelligence AND question = 'What does an activation function add to a neural network?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_artificial_intelligence, 'What does an activation function add to a neural network?', '["Non-linearity", "Extra storage", "Labels", "Data cleaning"]'::jsonb, 0);
    END IF;
    IF v_artificial_intelligence IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_artificial_intelligence AND question = 'Gradient descent is used to:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_artificial_intelligence, 'Gradient descent is used to:', '["Label data automatically", "Minimize a loss function by updating parameters", "Store images", "Encrypt models"]'::jsonb, 1);
    END IF;
    IF v_artificial_intelligence IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_artificial_intelligence AND question = 'What is the purpose of a test set?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_artificial_intelligence, 'What is the purpose of a test set?', '["Train the weights", "Increase dataset size", "Estimate performance on unseen data", "Replace validation"]'::jsonb, 2);
    END IF;
    IF v_artificial_intelligence IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_artificial_intelligence AND question = 'Reinforcement learning agents learn from:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_artificial_intelligence, 'Reinforcement learning agents learn from:', '["Labeled images only", "Sorted lists", "Fixed hand-written rules", "Rewards and penalties from an environment"]'::jsonb, 3);
    END IF;
    IF v_artificial_intelligence IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_artificial_intelligence AND question = 'Precision measures:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_artificial_intelligence, 'Precision measures:', '["The fraction of predicted positives that are truly positive", "The fraction of data used for training", "Training speed", "Model size"]'::jsonb, 0);
    END IF;
    IF v_artificial_intelligence IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_artificial_intelligence AND question = 'A convolutional neural network is especially suited to:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_artificial_intelligence, 'A convolutional neural network is especially suited to:', '["Spreadsheet formulas", "Image data", "Sorting numbers", "Email routing"]'::jsonb, 1);
    END IF;
    -- cybersecurity (10 questions)
    IF v_cybersecurity IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_cybersecurity AND question = 'What does the CIA triad stand for?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_cybersecurity, 'What does the CIA triad stand for?', '["Confidentiality, Integrity, Availability", "Control, Inspection, Audit", "Cipher, Identity, Access", "Code, Internet, Authentication"]'::jsonb, 0);
    END IF;
    IF v_cybersecurity IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_cybersecurity AND question = 'What is phishing?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_cybersecurity, 'What is phishing?', '["A firewall rule", "Tricking users into revealing information through deceptive messages", "A hashing algorithm", "A backup method"]'::jsonb, 1);
    END IF;
    IF v_cybersecurity IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_cybersecurity AND question = 'Symmetric encryption uses:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_cybersecurity, 'Symmetric encryption uses:', '["Two unrelated keys", "No key", "The same key to encrypt and decrypt", "Only public keys"]'::jsonb, 2);
    END IF;
    IF v_cybersecurity IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_cybersecurity AND question = 'Cryptographic hash functions are designed to be:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_cybersecurity, 'Cryptographic hash functions are designed to be:', '["Easily reversible", "Different every time for the same input", "Dependent on a secret key", "One-way"]'::jsonb, 3);
    END IF;
    IF v_cybersecurity IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_cybersecurity AND question = 'Multi-factor authentication requires:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_cybersecurity, 'Multi-factor authentication requires:', '["Two or more different types of verification", "A longer username", "Only a password", "Only a fingerprint"]'::jsonb, 0);
    END IF;
    IF v_cybersecurity IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_cybersecurity AND question = 'SQL injection exploits:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_cybersecurity, 'SQL injection exploits:', '["Weak Wi-Fi signals", "Unsanitized input inserted into database queries", "Expired certificates", "Slow hard drives"]'::jsonb, 1);
    END IF;
    IF v_cybersecurity IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_cybersecurity AND question = 'A firewall primarily:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_cybersecurity, 'A firewall primarily:', '["Speeds up the CPU", "Stores passwords", "Filters network traffic based on rules", "Compresses files"]'::jsonb, 2);
    END IF;
    IF v_cybersecurity IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_cybersecurity AND question = 'HTTPS protects web traffic using:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_cybersecurity, 'HTTPS protects web traffic using:', '["FTP", "UDP flooding", "Plain HTTP", "TLS encryption"]'::jsonb, 3);
    END IF;
    IF v_cybersecurity IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_cybersecurity AND question = 'The principle of least privilege means:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_cybersecurity, 'The principle of least privilege means:', '["Give users only the access they need", "Give every user admin rights", "Disable all logging", "Share passwords within teams"]'::jsonb, 0);
    END IF;
    IF v_cybersecurity IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_cybersecurity AND question = 'Ransomware is malware that:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_cybersecurity, 'Ransomware is malware that:', '["Speeds up backups", "Encrypts victim data and demands payment", "Acts as antivirus", "Is a network protocol"]'::jsonb, 1);
    END IF;
    -- data-science (10 questions)
    IF v_data_science IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_data_science AND question = 'What is the mean of 2, 4, 6, and 8?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_data_science, 'What is the mean of 2, 4, 6, and 8?', '["5", "4", "6", "20"]'::jsonb, 0);
    END IF;
    IF v_data_science IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_data_science AND question = 'Which Python library is widely used for tabular data analysis?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_data_science, 'Which Python library is widely used for tabular data analysis?', '["Flask", "Pandas", "Pygame", "Requests"]'::jsonb, 1);
    END IF;
    IF v_data_science IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_data_science AND question = 'Data cleaning mainly involves:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_data_science, 'Data cleaning mainly involves:', '["Buying servers", "Designing the UI", "Handling missing, duplicate, or invalid values", "Encrypting data"]'::jsonb, 2);
    END IF;
    IF v_data_science IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_data_science AND question = 'Which chart best shows the distribution of one numeric variable?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_data_science, 'Which chart best shows the distribution of one numeric variable?', '["Pie chart", "Gantt chart", "Org chart", "Histogram"]'::jsonb, 3);
    END IF;
    IF v_data_science IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_data_science AND question = 'The median of a dataset is:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_data_science, 'The median of a dataset is:', '["The middle value of the sorted data", "The most frequent value", "The arithmetic average", "The largest value"]'::jsonb, 0);
    END IF;
    IF v_data_science IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_data_science AND question = 'A correlation coefficient of +1 indicates:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_data_science, 'A correlation coefficient of +1 indicates:', '["No relationship", "A perfect positive linear relationship", "A perfect negative relationship", "A random pattern"]'::jsonb, 1);
    END IF;
    IF v_data_science IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_data_science AND question = 'An outlier is:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_data_science, 'An outlier is:', '["The mean value", "A column header", "A value far from the rest of the data", "Always a missing value"]'::jsonb, 2);
    END IF;
    IF v_data_science IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_data_science AND question = 'What does EDA stand for?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_data_science, 'What does EDA stand for?', '["Encrypted Data Access", "External Data API", "Event Driven Architecture", "Exploratory Data Analysis"]'::jsonb, 3);
    END IF;
    IF v_data_science IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_data_science AND question = 'Standard deviation measures:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_data_science, 'Standard deviation measures:', '["How spread out data is around the mean", "The central value", "The number of rows", "The data type"]'::jsonb, 0);
    END IF;
    IF v_data_science IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_data_science AND question = 'What is the mode of 3, 3, 5, 7, 3, 5?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_data_science, 'What is the mode of 3, 3, 5, 7, 3, 5?', '["5", "3", "7", "4.33"]'::jsonb, 1);
    END IF;
    -- discrete-math (10 questions)
    IF v_discrete_math IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_discrete_math AND question = 'When is the proposition p AND q true?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_discrete_math, 'When is the proposition p AND q true?', '["When both p and q are true", "When either one is true", "When both are false", "When p is false"]'::jsonb, 0);
    END IF;
    IF v_discrete_math IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_discrete_math AND question = 'How many subsets does a set with 3 elements have?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_discrete_math, 'How many subsets does a set with 3 elements have?', '["6", "8", "9", "3"]'::jsonb, 1);
    END IF;
    IF v_discrete_math IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_discrete_math AND question = 'The intersection A ∩ B contains:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_discrete_math, 'The intersection A ∩ B contains:', '["All elements in either set", "Elements only in A", "Elements in both A and B", "No elements"]'::jsonb, 2);
    END IF;
    IF v_discrete_math IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_discrete_math AND question = 'In graph theory, the degree of a vertex is:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_discrete_math, 'In graph theory, the degree of a vertex is:', '["The number of graphs", "Its label", "The total number of vertices", "The number of edges incident to it"]'::jsonb, 3);
    END IF;
    IF v_discrete_math IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_discrete_math AND question = 'What is 5! (5 factorial)?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_discrete_math, 'What is 5! (5 factorial)?', '["120", "25", "60", "720"]'::jsonb, 0);
    END IF;
    IF v_discrete_math IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_discrete_math AND question = 'A relation that is reflexive, symmetric, and transitive is called:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_discrete_math, 'A relation that is reflexive, symmetric, and transitive is called:', '["A partial order", "An equivalence relation", "A function", "A bijection"]'::jsonb, 1);
    END IF;
    IF v_discrete_math IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_discrete_math AND question = 'The implication p → q is false only when:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_discrete_math, 'The implication p → q is false only when:', '["p is false and q is true", "Both are false", "p is true and q is false", "Both are true"]'::jsonb, 2);
    END IF;
    IF v_discrete_math IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_discrete_math AND question = 'How many ways can 2 items be chosen from 5 (C(5,2))?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_discrete_math, 'How many ways can 2 items be chosen from 5 (C(5,2))?', '["20", "5", "25", "10"]'::jsonb, 3);
    END IF;
    IF v_discrete_math IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_discrete_math AND question = 'A proof by contradiction begins by assuming:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_discrete_math, 'A proof by contradiction begins by assuming:', '["The negation of the statement is true", "The statement is true", "Nothing", "Only the base case"]'::jsonb, 0);
    END IF;
    IF v_discrete_math IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_discrete_math AND question = 'A tree with n vertices has how many edges?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_discrete_math, 'A tree with n vertices has how many edges?', '["n", "n − 1", "n + 1", "2n"]'::jsonb, 1);
    END IF;
    -- calculus-linear-algebra (10 questions)
    IF v_calculus_linear_algebra IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_calculus_linear_algebra AND question = 'What is the derivative of x²?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_calculus_linear_algebra, 'What is the derivative of x²?', '["2x", "x", "x³/3", "2"]'::jsonb, 0);
    END IF;
    IF v_calculus_linear_algebra IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_calculus_linear_algebra AND question = 'What is the integral of 1/x dx?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_calculus_linear_algebra, 'What is the integral of 1/x dx?', '["x²", "ln|x| + C", "1/x²", "eˣ"]'::jsonb, 1);
    END IF;
    IF v_calculus_linear_algebra IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_calculus_linear_algebra AND question = 'Multiplying a 2×3 matrix by a 3×4 matrix gives a matrix of size:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_calculus_linear_algebra, 'Multiplying a 2×3 matrix by a 3×4 matrix gives a matrix of size:', '["3×3", "2×3", "2×4", "4×2"]'::jsonb, 2);
    END IF;
    IF v_calculus_linear_algebra IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_calculus_linear_algebra AND question = 'What is the determinant of [[1, 2], [3, 4]]?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_calculus_linear_algebra, 'What is the determinant of [[1, 2], [3, 4]]?', '["10", "2", "5", "−2"]'::jsonb, 3);
    END IF;
    IF v_calculus_linear_algebra IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_calculus_linear_algebra AND question = 'What is the derivative of sin x?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_calculus_linear_algebra, 'What is the derivative of sin x?', '["cos x", "−cos x", "sin x", "−sin x"]'::jsonb, 0);
    END IF;
    IF v_calculus_linear_algebra IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_calculus_linear_algebra AND question = 'Multiplying the identity matrix by a matrix A gives:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_calculus_linear_algebra, 'Multiplying the identity matrix by a matrix A gives:', '["The zero matrix", "A", "The transpose of A", "The inverse of A"]'::jsonb, 1);
    END IF;
    IF v_calculus_linear_algebra IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_calculus_linear_algebra AND question = 'What is the limit of (sin x)/x as x approaches 0?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_calculus_linear_algebra, 'What is the limit of (sin x)/x as x approaches 0?', '["0", "Infinity", "1", "Undefined"]'::jsonb, 2);
    END IF;
    IF v_calculus_linear_algebra IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_calculus_linear_algebra AND question = 'An eigenvector v of matrix A satisfies:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_calculus_linear_algebra, 'An eigenvector v of matrix A satisfies:', '["Av = 0 always", "A + v = λ", "vA = A", "Av = λv"]'::jsonb, 3);
    END IF;
    IF v_calculus_linear_algebra IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_calculus_linear_algebra AND question = 'What is the dot product of (1, 2) and (3, 4)?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_calculus_linear_algebra, 'What is the dot product of (1, 2) and (3, 4)?', '["11", "10", "7", "24"]'::jsonb, 0);
    END IF;
    IF v_calculus_linear_algebra IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_calculus_linear_algebra AND question = 'A square matrix is invertible if and only if its determinant is:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_calculus_linear_algebra, 'A square matrix is invertible if and only if its determinant is:', '["Zero", "Non-zero", "Negative", "Exactly one"]'::jsonb, 1);
    END IF;
    -- prob-stats (10 questions)
    IF v_prob_stats IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_prob_stats AND question = 'What is the probability of heads on a fair coin toss?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_prob_stats, 'What is the probability of heads on a fair coin toss?', '["0.5", "1", "0.25", "0"]'::jsonb, 0);
    END IF;
    IF v_prob_stats IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_prob_stats AND question = 'Probability values always lie between:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_prob_stats, 'Probability values always lie between:', '["−1 and 1", "0 and 1", "0 and 100", "1 and 10"]'::jsonb, 1);
    END IF;
    IF v_prob_stats IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_prob_stats AND question = 'When rolling a fair six-sided die, what is P(even number)?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_prob_stats, 'When rolling a fair six-sided die, what is P(even number)?', '["1/6", "1/3", "1/2", "2/3"]'::jsonb, 2);
    END IF;
    IF v_prob_stats IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_prob_stats AND question = 'If events A and B are independent, P(A and B) equals:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_prob_stats, 'If events A and B are independent, P(A and B) equals:', '["P(A) + P(B)", "P(A) − P(B)", "P(A|B) + P(B)", "P(A) · P(B)"]'::jsonb, 3);
    END IF;
    IF v_prob_stats IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_prob_stats AND question = 'What is the shape of a normal distribution?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_prob_stats, 'What is the shape of a normal distribution?', '["Symmetric and bell-shaped", "A flat rectangle", "Always skewed right", "Always bimodal"]'::jsonb, 0);
    END IF;
    IF v_prob_stats IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_prob_stats AND question = 'A null hypothesis usually states that:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_prob_stats, 'A null hypothesis usually states that:', '["A strong effect exists", "There is no effect or no difference", "The sample is biased", "The data are invalid"]'::jsonb, 1);
    END IF;
    IF v_prob_stats IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_prob_stats AND question = 'A p-value below the significance level suggests you should:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_prob_stats, 'A p-value below the significance level suggests you should:', '["Always accept the null hypothesis", "Discard the data", "Reject the null hypothesis", "Only increase the sample size"]'::jsonb, 2);
    END IF;
    IF v_prob_stats IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_prob_stats AND question = 'What is the expected value of one roll of a fair six-sided die?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_prob_stats, 'What is the expected value of one roll of a fair six-sided die?', '["3", "4", "6", "3.5"]'::jsonb, 3);
    END IF;
    IF v_prob_stats IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_prob_stats AND question = 'Bayes'' theorem relates:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_prob_stats, 'Bayes'' theorem relates:', '["P(A|B) and P(B|A)", "The mean and the median", "Variance and range", "Two sample sizes"]'::jsonb, 0);
    END IF;
    IF v_prob_stats IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_prob_stats AND question = 'Variance is the square of the:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_prob_stats, 'Variance is the square of the:', '["Mean", "Standard deviation", "Median", "Range"]'::jsonb, 1);
    END IF;
    -- numerical-methods (10 questions)
    IF v_numerical_methods IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_numerical_methods AND question = 'The bisection method requires f(a) and f(b) to have:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_numerical_methods, 'The bisection method requires f(a) and f(b) to have:', '["Opposite signs", "The same sign", "Zero values", "Equal magnitudes"]'::jsonb, 0);
    END IF;
    IF v_numerical_methods IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_numerical_methods AND question = 'The Newton–Raphson update uses:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_numerical_methods, 'The Newton–Raphson update uses:', '["Only f(x)", "Both f(x) and f′(x)", "Random guesses", "The integral of f"]'::jsonb, 1);
    END IF;
    IF v_numerical_methods IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_numerical_methods AND question = 'The trapezoidal rule approximates:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_numerical_methods, 'The trapezoidal rule approximates:', '["Derivatives", "Roots", "Definite integrals", "Matrix inverses"]'::jsonb, 2);
    END IF;
    IF v_numerical_methods IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_numerical_methods AND question = 'Truncation error arises from:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_numerical_methods, 'Truncation error arises from:', '["Hardware faults", "Typing mistakes", "Network delay", "Approximating an infinite process with a finite one"]'::jsonb, 3);
    END IF;
    IF v_numerical_methods IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_numerical_methods AND question = 'Round-off error is caused by:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_numerical_methods, 'Round-off error is caused by:', '["Finite-precision representation of numbers", "Using the wrong formula", "Missing data", "A slow CPU"]'::jsonb, 0);
    END IF;
    IF v_numerical_methods IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_numerical_methods AND question = 'Gaussian elimination is used to solve:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_numerical_methods, 'Gaussian elimination is used to solve:', '["Only differential equations", "Systems of linear equations", "Only optimization problems", "Only sorting problems"]'::jsonb, 1);
    END IF;
    IF v_numerical_methods IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_numerical_methods AND question = 'Interpolation estimates:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_numerical_methods, 'Interpolation estimates:', '["Only values outside the data range", "Derivatives exactly", "Values between known data points", "Measurement errors"]'::jsonb, 2);
    END IF;
    IF v_numerical_methods IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_numerical_methods AND question = 'Simpson''s 1/3 rule fits the data with:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_numerical_methods, 'Simpson''s 1/3 rule fits the data with:', '["Straight lines", "Cubic splines", "Exponentials", "Parabolas (quadratic polynomials)"]'::jsonb, 3);
    END IF;
    IF v_numerical_methods IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_numerical_methods AND question = 'Euler''s method numerically solves:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_numerical_methods, 'Euler''s method numerically solves:', '["Ordinary differential equations", "Linear programs", "Sorting problems", "Only eigenvalue problems"]'::jsonb, 0);
    END IF;
    IF v_numerical_methods IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_numerical_methods AND question = 'An iterative method converges when successive approximations:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_numerical_methods, 'An iterative method converges when successive approximations:', '["Diverge", "Approach a fixed value", "Oscillate forever", "Stay random"]'::jsonb, 1);
    END IF;
    -- capstone-design (10 questions)
    IF v_capstone_design IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_capstone_design AND question = 'What is the purpose of a project charter or team agreement?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_capstone_design, 'What is the purpose of a project charter or team agreement?', '["Define scope, roles, and goals", "Write all the code", "Test the UI", "Deploy servers"]'::jsonb, 0);
    END IF;
    IF v_capstone_design IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_capstone_design AND question = 'What does MVP stand for in product development?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_capstone_design, 'What does MVP stand for in product development?', '["Most Valuable Player", "Minimum Viable Product", "Maximum Version Plan", "Main Verification Process"]'::jsonb, 1);
    END IF;
    IF v_capstone_design IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_capstone_design AND question = 'A pull request is used to:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_capstone_design, 'A pull request is used to:', '["Delete a repository", "Install packages", "Propose and review changes before merging", "Create a database"]'::jsonb, 2);
    END IF;
    IF v_capstone_design IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_capstone_design AND question = 'A Gantt chart shows:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_capstone_design, 'A Gantt chart shows:', '["Code coverage", "Class hierarchy", "Network topology", "Project tasks over time"]'::jsonb, 3);
    END IF;
    IF v_capstone_design IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_capstone_design AND question = 'A demo rehearsal helps the team:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_capstone_design, 'A demo rehearsal helps the team:', '["Find issues before the final presentation", "Increase file sizes", "Replace testing entirely", "Skip documentation"]'::jsonb, 0);
    END IF;
    IF v_capstone_design IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_capstone_design AND question = 'A risk register records:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_capstone_design, 'A risk register records:', '["Commit messages", "Potential risks, their impact, and mitigation", "User passwords", "Raw test data"]'::jsonb, 1);
    END IF;
    IF v_capstone_design IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_capstone_design AND question = 'A vertical slice is:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_capstone_design, 'A vertical slice is:', '["Only UI mockups", "Only the database layer", "A thin end-to-end feature through all layers", "A design document"]'::jsonb, 2);
    END IF;
    IF v_capstone_design IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_capstone_design AND question = 'A Definition of Done is:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_capstone_design, 'A Definition of Done is:', '["The final grade", "The list of team members", "The deadline date", "Agreed criteria a task must meet to be complete"]'::jsonb, 3);
    END IF;
    IF v_capstone_design IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_capstone_design AND question = 'A Git merge conflict happens when:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_capstone_design, 'A Git merge conflict happens when:', '["Two changes edit the same lines differently", "The repository is public", "A branch is protected", "CI passes"]'::jsonb, 0);
    END IF;
    IF v_capstone_design IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_capstone_design AND question = 'Project stakeholders are:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_capstone_design, 'Project stakeholders are:', '["Only the programmers", "People affected by or interested in the project", "Test cases", "Servers"]'::jsonb, 1);
    END IF;
    -- technical-writing (10 questions)
    IF v_technical_writing IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_technical_writing AND question = 'What is the abstract of a report?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_technical_writing, 'What is the abstract of a report?', '["A brief summary of the whole document", "The reference list", "An appendix", "The title page"]'::jsonb, 0);
    END IF;
    IF v_technical_writing IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_technical_writing AND question = 'Which sentence uses the active voice?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_technical_writing, 'Which sentence uses the active voice?', '["The test was run by the team.", "The team ran the test.", "Tests are being run.", "Running of tests occurred."]'::jsonb, 1);
    END IF;
    IF v_technical_writing IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_technical_writing AND question = 'What is the main purpose of citations?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_technical_writing, 'What is the main purpose of citations?', '["Increase word count", "Decoration", "Credit sources and allow verification", "Hide ideas"]'::jsonb, 2);
    END IF;
    IF v_technical_writing IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_technical_writing AND question = 'Which is a good practice for presentation slides?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_technical_writing, 'Which is a good practice for presentation slides?', '["Full paragraphs on each slide", "Many different fonts", "Very small text", "A few key points with readable visuals"]'::jsonb, 3);
    END IF;
    IF v_technical_writing IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_technical_writing AND question = 'Audience analysis helps a writer:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_technical_writing, 'Audience analysis helps a writer:', '["Tailor content and language to readers", "Choose a printer", "Reduce research", "Avoid editing"]'::jsonb, 0);
    END IF;
    IF v_technical_writing IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_technical_writing AND question = 'A project README file typically explains:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_technical_writing, 'A project README file typically explains:', '["Server hardware specifications", "How to install, run, and use the project", "Personal opinions", "Company finances"]'::jsonb, 1);
    END IF;
    IF v_technical_writing IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_technical_writing AND question = 'An executive summary is written mainly for:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_technical_writing, 'An executive summary is written mainly for:', '["Developers only", "Proofreaders", "Decision-makers who need key points quickly", "Testers"]'::jsonb, 2);
    END IF;
    IF v_technical_writing IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_technical_writing AND question = 'Plagiarism means:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_technical_writing, 'Plagiarism means:', '["Quoting with citation", "Paraphrasing with credit", "Summarizing your own work", "Presenting someone else''s work as your own"]'::jsonb, 3);
    END IF;
    IF v_technical_writing IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_technical_writing AND question = 'Figures in a technical report should:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_technical_writing, 'Figures in a technical report should:', '["Have numbered captions and be referenced in the text", "Have no labels", "Be placed randomly", "Rely only on color"]'::jsonb, 0);
    END IF;
    IF v_technical_writing IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_technical_writing AND question = 'Proofreading checks for:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_technical_writing, 'Proofreading checks for:', '["Server uptime", "Spelling, grammar, and clarity errors", "Code performance", "Network speed"]'::jsonb, 1);
    END IF;
    -- circuit-analysis (10 questions)
    IF v_circuit_analysis IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_circuit_analysis AND question = 'Which equation expresses Ohm''s law?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_circuit_analysis, 'Which equation expresses Ohm''s law?', '["V = IR", "P = IV²", "I = VR", "R = VI"]'::jsonb, 0);
    END IF;
    IF v_circuit_analysis IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_circuit_analysis AND question = 'Kirchhoff''s Current Law states that the current entering a node equals:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_circuit_analysis, 'Kirchhoff''s Current Law states that the current entering a node equals:', '["Zero volts", "The current leaving the node", "The resistance", "The power"]'::jsonb, 1);
    END IF;
    IF v_circuit_analysis IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_circuit_analysis AND question = 'Two 10 Ω resistors in series have a total resistance of:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_circuit_analysis, 'Two 10 Ω resistors in series have a total resistance of:', '["5 Ω", "10 Ω", "20 Ω", "100 Ω"]'::jsonb, 2);
    END IF;
    IF v_circuit_analysis IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_circuit_analysis AND question = 'Two 10 Ω resistors in parallel have an equivalent resistance of:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_circuit_analysis, 'Two 10 Ω resistors in parallel have an equivalent resistance of:', '["20 Ω", "10 Ω", "100 Ω", "5 Ω"]'::jsonb, 3);
    END IF;
    IF v_circuit_analysis IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_circuit_analysis AND question = 'What is the SI unit of capacitance?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_circuit_analysis, 'What is the SI unit of capacitance?', '["Farad", "Henry", "Ohm", "Siemens"]'::jsonb, 0);
    END IF;
    IF v_circuit_analysis IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_circuit_analysis AND question = 'What power is dissipated when 2 A flows through a 5 Ω resistor?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_circuit_analysis, 'What power is dissipated when 2 A flows through a 5 Ω resistor?', '["10 W", "20 W", "2.5 W", "50 W"]'::jsonb, 1);
    END IF;
    IF v_circuit_analysis IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_circuit_analysis AND question = 'Kirchhoff''s Voltage Law states that voltages around a closed loop sum to:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_circuit_analysis, 'Kirchhoff''s Voltage Law states that voltages around a closed loop sum to:', '["The total current", "Infinity", "Zero", "The source voltage squared"]'::jsonb, 2);
    END IF;
    IF v_circuit_analysis IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_circuit_analysis AND question = 'The time constant of an RC circuit is:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_circuit_analysis, 'The time constant of an RC circuit is:', '["R/C", "C/R", "1/(RC)", "RC"]'::jsonb, 3);
    END IF;
    IF v_circuit_analysis IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_circuit_analysis AND question = 'An inductor opposes changes in:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_circuit_analysis, 'An inductor opposes changes in:', '["Current", "Resistance", "Color", "Temperature"]'::jsonb, 0);
    END IF;
    IF v_circuit_analysis IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_circuit_analysis AND question = 'A Thevenin equivalent circuit consists of:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_circuit_analysis, 'A Thevenin equivalent circuit consists of:', '["A current source in parallel with a resistor", "A voltage source in series with a resistance", "Only a resistor", "Only a capacitor"]'::jsonb, 1);
    END IF;
    -- digital-electronics (10 questions)
    IF v_digital_electronics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_digital_electronics AND question = 'What is binary 1010 in decimal?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_digital_electronics, 'What is binary 1010 in decimal?', '["10", "8", "12", "5"]'::jsonb, 0);
    END IF;
    IF v_digital_electronics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_digital_electronics AND question = 'Which gate outputs 1 only when all inputs are 1?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_digital_electronics, 'Which gate outputs 1 only when all inputs are 1?', '["OR", "AND", "XOR", "NOR"]'::jsonb, 1);
    END IF;
    IF v_digital_electronics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_digital_electronics AND question = 'Which gates are called universal gates?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_digital_electronics, 'Which gates are called universal gates?', '["AND and OR", "XOR and XNOR", "NAND and NOR", "NOT and buffer"]'::jsonb, 2);
    END IF;
    IF v_digital_electronics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_digital_electronics AND question = 'Hexadecimal F equals which decimal number?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_digital_electronics, 'Hexadecimal F equals which decimal number?', '["16", "10", "14", "15"]'::jsonb, 3);
    END IF;
    IF v_digital_electronics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_digital_electronics AND question = 'A flip-flop stores:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_digital_electronics, 'A flip-flop stores:', '["One bit", "One byte", "An analog voltage", "A full instruction"]'::jsonb, 0);
    END IF;
    IF v_digital_electronics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_digital_electronics AND question = 'An XOR gate outputs 1 when:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_digital_electronics, 'An XOR gate outputs 1 when:', '["Both inputs are 1", "The inputs differ", "Both inputs are 0", "Always"]'::jsonb, 1);
    END IF;
    IF v_digital_electronics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_digital_electronics AND question = 'By De Morgan''s theorem, NOT(A AND B) equals:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_digital_electronics, 'By De Morgan''s theorem, NOT(A AND B) equals:', '["NOT A AND NOT B", "A OR B", "NOT A OR NOT B", "A AND B"]'::jsonb, 2);
    END IF;
    IF v_digital_electronics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_digital_electronics AND question = 'A multiplexer:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_digital_electronics, 'A multiplexer:', '["Adds two numbers", "Stores bits permanently", "Inverts signals", "Selects one of several inputs to send to the output"]'::jsonb, 3);
    END IF;
    IF v_digital_electronics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_digital_electronics AND question = 'The output of a combinational circuit depends on:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_digital_electronics, 'The output of a combinational circuit depends on:', '["Only the current inputs", "Past states", "Only the clock", "Stored memory"]'::jsonb, 0);
    END IF;
    IF v_digital_electronics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_digital_electronics AND question = 'A 3-bit binary counter has how many distinct states?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_digital_electronics, 'A 3-bit binary counter has how many distinct states?', '["3", "8", "6", "16"]'::jsonb, 1);
    END IF;
    -- signals-systems (10 questions)
    IF v_signals_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_signals_systems AND question = 'What does LTI stand for?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_signals_systems, 'What does LTI stand for?', '["Linear Time-Invariant", "Low Transfer Interface", "Logic Timing Index", "Linear Transmission Input"]'::jsonb, 0);
    END IF;
    IF v_signals_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_signals_systems AND question = 'The output of an LTI system equals the input convolved with its:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_signals_systems, 'The output of an LTI system equals the input convolved with its:', '["Derivative", "Impulse response", "Step size", "Noise"]'::jsonb, 1);
    END IF;
    IF v_signals_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_signals_systems AND question = 'The Fourier transform represents a signal in the:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_signals_systems, 'The Fourier transform represents a signal in the:', '["Time domain only", "Spatial domain", "Frequency domain", "Probability domain"]'::jsonb, 2);
    END IF;
    IF v_signals_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_signals_systems AND question = 'The Nyquist rate is:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_signals_systems, 'The Nyquist rate is:', '["Equal to the highest frequency", "Half the highest frequency", "Ten times the highest frequency", "Twice the highest frequency component"]'::jsonb, 3);
    END IF;
    IF v_signals_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_signals_systems AND question = 'A periodic signal:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_signals_systems, 'A periodic signal:', '["Repeats itself after a fixed interval", "Never repeats", "Is always zero", "Is purely random"]'::jsonb, 0);
    END IF;
    IF v_signals_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_signals_systems AND question = 'The Laplace transform is commonly used to analyze:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_signals_systems, 'The Laplace transform is commonly used to analyze:', '["Databases", "Continuous-time systems and differential equations", "Sorting algorithms", "Only images"]'::jsonb, 1);
    END IF;
    IF v_signals_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_signals_systems AND question = 'The output of a causal system depends on:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_signals_systems, 'The output of a causal system depends on:', '["Future inputs", "Random inputs", "Present and past inputs only", "Nothing"]'::jsonb, 2);
    END IF;
    IF v_signals_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_signals_systems AND question = 'The Z-transform is used for:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_signals_systems, 'The Z-transform is used for:', '["Continuous signals only", "Optical lenses", "Mechanical gears", "Discrete-time signals"]'::jsonb, 3);
    END IF;
    IF v_signals_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_signals_systems AND question = 'Aliasing occurs when a signal is:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_signals_systems, 'Aliasing occurs when a signal is:', '["Sampled below the Nyquist rate", "Sampled very fast", "Low-pass filtered", "Amplified"]'::jsonb, 0);
    END IF;
    IF v_signals_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_signals_systems AND question = 'A low-pass filter:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_signals_systems, 'A low-pass filter:', '["Blocks low frequencies", "Passes low frequencies and attenuates high frequencies", "Passes all frequencies", "Blocks all frequencies"]'::jsonb, 1);
    END IF;
    -- communication-systems (10 questions)
    IF v_communication_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_communication_systems AND question = 'Amplitude modulation (AM) varies the carrier''s:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_communication_systems, 'Amplitude modulation (AM) varies the carrier''s:', '["Amplitude", "Frequency", "Phase only", "Wavelength only"]'::jsonb, 0);
    END IF;
    IF v_communication_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_communication_systems AND question = 'Frequency modulation (FM) varies the carrier''s:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_communication_systems, 'Frequency modulation (FM) varies the carrier''s:', '["Amplitude", "Frequency", "Power supply", "Polarization"]'::jsonb, 1);
    END IF;
    IF v_communication_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_communication_systems AND question = 'Signal-to-noise ratio (SNR) compares:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_communication_systems, 'Signal-to-noise ratio (SNR) compares:', '["Speed to range", "Size to noise", "Signal power to noise power", "Sampling to Nyquist"]'::jsonb, 2);
    END IF;
    IF v_communication_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_communication_systems AND question = 'Bandwidth is:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_communication_systems, 'Bandwidth is:', '["The signal amplitude", "The wire thickness", "The number of users", "The range of frequencies a signal occupies"]'::jsonb, 3);
    END IF;
    IF v_communication_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_communication_systems AND question = 'The main purpose of modulation is to:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_communication_systems, 'The main purpose of modulation is to:', '["Transmit information efficiently over a channel using a carrier", "Store data", "Compress files", "Encrypt messages"]'::jsonb, 0);
    END IF;
    IF v_communication_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_communication_systems AND question = 'Shannon''s channel capacity depends on:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_communication_systems, 'Shannon''s channel capacity depends on:', '["Antenna color", "Bandwidth and signal-to-noise ratio", "Cable length only", "Number of bits only"]'::jsonb, 1);
    END IF;
    IF v_communication_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_communication_systems AND question = 'Multiplexing allows:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_communication_systems, 'Multiplexing allows:', '["Only one signal per channel", "Removal of all noise", "Multiple signals to share one channel", "Higher supply voltage"]'::jsonb, 2);
    END IF;
    IF v_communication_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_communication_systems AND question = 'How many bits per symbol does QPSK encode?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_communication_systems, 'How many bits per symbol does QPSK encode?', '["1", "4", "8", "2"]'::jsonb, 3);
    END IF;
    IF v_communication_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_communication_systems AND question = 'Demodulation means:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_communication_systems, 'Demodulation means:', '["Recovering the original message from a modulated carrier", "Adding a carrier", "Amplifying noise", "Sampling a signal"]'::jsonb, 0);
    END IF;
    IF v_communication_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_communication_systems AND question = 'Optical fiber transmits information using:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_communication_systems, 'Optical fiber transmits information using:', '["Sound waves", "Light", "Only radio waves", "Copper current"]'::jsonb, 1);
    END IF;
    -- power-systems (10 questions)
    IF v_power_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_power_systems AND question = 'A transformer works on the principle of:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_power_systems, 'A transformer works on the principle of:', '["Electromagnetic induction", "The photoelectric effect", "The piezoelectric effect", "Thermionic emission"]'::jsonb, 0);
    END IF;
    IF v_power_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_power_systems AND question = 'Transformers operate on:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_power_systems, 'Transformers operate on:', '["DC only", "AC", "Both AC and DC equally", "Neither"]'::jsonb, 1);
    END IF;
    IF v_power_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_power_systems AND question = 'A step-up transformer has:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_power_systems, 'A step-up transformer has:', '["Fewer secondary turns than primary", "Equal turns", "More secondary turns than primary", "No secondary winding"]'::jsonb, 2);
    END IF;
    IF v_power_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_power_systems AND question = 'Power factor is the ratio of:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_power_systems, 'Power factor is the ratio of:', '["Voltage to current", "Reactive power to apparent power", "Apparent power to real power", "Real power to apparent power"]'::jsonb, 3);
    END IF;
    IF v_power_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_power_systems AND question = 'What is the unit of real (active) power?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_power_systems, 'What is the unit of real (active) power?', '["Watt", "VAR", "VA", "Joule per volt"]'::jsonb, 0);
    END IF;
    IF v_power_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_power_systems AND question = 'High-voltage transmission is used mainly to reduce:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_power_systems, 'High-voltage transmission is used mainly to reduce:', '["Voltage", "I²R line losses", "Frequency", "Generation"]'::jsonb, 1);
    END IF;
    IF v_power_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_power_systems AND question = 'The rotor of an induction motor rotates:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_power_systems, 'The rotor of an induction motor rotates:', '["Faster than synchronous speed", "Exactly at synchronous speed", "Slightly slower than synchronous speed", "Not at all"]'::jsonb, 2);
    END IF;
    IF v_power_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_power_systems AND question = 'What is the standard grid frequency in South Korea?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_power_systems, 'What is the standard grid frequency in South Korea?', '["50 Hz", "100 Hz", "25 Hz", "60 Hz"]'::jsonb, 3);
    END IF;
    IF v_power_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_power_systems AND question = 'An electrical generator converts:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_power_systems, 'An electrical generator converts:', '["Mechanical energy into electrical energy", "Electrical energy into mechanical energy", "Heat into light", "Chemical energy into mechanical energy"]'::jsonb, 0);
    END IF;
    IF v_power_systems IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_power_systems AND question = 'The purpose of a circuit breaker is to:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_power_systems, 'The purpose of a circuit breaker is to:', '["Increase voltage", "Interrupt current during faults", "Store energy", "Measure power factor"]'::jsonb, 1);
    END IF;
    -- engineering-mechanics (10 questions)
    IF v_engineering_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_engineering_mechanics AND question = 'For a body in static equilibrium, the net force is:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_engineering_mechanics, 'For a body in static equilibrium, the net force is:', '["Zero", "Maximum", "Equal to its weight", "Infinite"]'::jsonb, 0);
    END IF;
    IF v_engineering_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_engineering_mechanics AND question = 'The moment of a force equals:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_engineering_mechanics, 'The moment of a force equals:', '["Force ÷ distance", "Force × perpendicular distance", "Mass × velocity", "Force + distance"]'::jsonb, 1);
    END IF;
    IF v_engineering_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_engineering_mechanics AND question = 'A free-body diagram shows:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_engineering_mechanics, 'A free-body diagram shows:', '["Material cost", "Assembly steps", "All external forces acting on a body", "Temperature"]'::jsonb, 2);
    END IF;
    IF v_engineering_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_engineering_mechanics AND question = 'What is the SI unit of force?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_engineering_mechanics, 'What is the SI unit of force?', '["Joule", "Pascal", "Watt", "Newton"]'::jsonb, 3);
    END IF;
    IF v_engineering_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_engineering_mechanics AND question = 'The maximum static friction force equals:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_engineering_mechanics, 'The maximum static friction force equals:', '["μN", "N/μ", "μ/N", "μ + N"]'::jsonb, 0);
    END IF;
    IF v_engineering_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_engineering_mechanics AND question = 'Newton''s second law is:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_engineering_mechanics, 'Newton''s second law is:', '["F = mv", "F = ma", "F = m/a", "F = a/m"]'::jsonb, 1);
    END IF;
    IF v_engineering_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_engineering_mechanics AND question = 'A couple consists of:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_engineering_mechanics, 'A couple consists of:', '["A single force", "Three concurrent forces", "Two equal, opposite, parallel forces", "Two collinear forces in the same direction"]'::jsonb, 2);
    END IF;
    IF v_engineering_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_engineering_mechanics AND question = 'The center of gravity is:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_engineering_mechanics, 'The center of gravity is:', '["The heaviest part of a body", "A geometric edge", "The base point", "The point where the total weight acts"]'::jsonb, 3);
    END IF;
    IF v_engineering_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_engineering_mechanics AND question = 'Work done by a constant force equals:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_engineering_mechanics, 'Work done by a constant force equals:', '["Force × displacement in the direction of the force", "Mass × acceleration", "Power × velocity", "Force ÷ time"]'::jsonb, 0);
    END IF;
    IF v_engineering_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_engineering_mechanics AND question = 'How many independent equilibrium equations exist for a rigid body in 2D?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_engineering_mechanics, 'How many independent equilibrium equations exist for a rigid body in 2D?', '["2", "3", "4", "6"]'::jsonb, 1);
    END IF;
    -- structural-analysis (10 questions)
    IF v_structural_analysis IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_structural_analysis AND question = 'A simply supported beam has:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_structural_analysis, 'A simply supported beam has:', '["A pin support and a roller support", "Two fixed ends", "One fixed end only", "No supports"]'::jsonb, 0);
    END IF;
    IF v_structural_analysis IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_structural_analysis AND question = 'A truss member mainly carries:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_structural_analysis, 'A truss member mainly carries:', '["Bending moment", "Axial force (tension or compression)", "Torsion only", "Shear only"]'::jsonb, 1);
    END IF;
    IF v_structural_analysis IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_structural_analysis AND question = 'A cantilever beam is:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_structural_analysis, 'A cantilever beam is:', '["Supported at both ends", "Supported only on rollers", "Fixed at one end and free at the other", "Floating"]'::jsonb, 2);
    END IF;
    IF v_structural_analysis IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_structural_analysis AND question = 'Bending moment is maximum where the shear force is:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_structural_analysis, 'Bending moment is maximum where the shear force is:', '["Maximum", "Constant", "Negative only", "Zero"]'::jsonb, 3);
    END IF;
    IF v_structural_analysis IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_structural_analysis AND question = 'Dead load refers to:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_structural_analysis, 'Dead load refers to:', '["The permanent self-weight of the structure", "Occupants", "Wind", "Earthquakes"]'::jsonb, 0);
    END IF;
    IF v_structural_analysis IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_structural_analysis AND question = 'Which is an example of live load?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_structural_analysis, 'Which is an example of live load?', '["Beam self-weight", "Occupants and furniture", "Foundation weight", "Permanent wall weight"]'::jsonb, 1);
    END IF;
    IF v_structural_analysis IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_structural_analysis AND question = 'For a simply supported beam of span L with a central point load P, the maximum moment is:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_structural_analysis, 'For a simply supported beam of span L with a central point load P, the maximum moment is:', '["PL/2", "PL", "PL/4", "PL/8"]'::jsonb, 2);
    END IF;
    IF v_structural_analysis IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_structural_analysis AND question = 'Deflection describes:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_structural_analysis, 'Deflection describes:', '["Material color", "Load type", "Construction cost", "The displacement of a member under load"]'::jsonb, 3);
    END IF;
    IF v_structural_analysis IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_structural_analysis AND question = 'A statically determinate structure is one where:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_structural_analysis, 'A statically determinate structure is one where:', '["Reactions can be found from equilibrium equations alone", "Compatibility equations are always required", "The structure is unstable", "There are no supports"]'::jsonb, 0);
    END IF;
    IF v_structural_analysis IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_structural_analysis AND question = 'Young''s modulus relates:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_structural_analysis, 'Young''s modulus relates:', '["Force and area", "Stress and strain", "Mass and volume", "Load and span"]'::jsonb, 1);
    END IF;
    -- fluid-mechanics (10 questions)
    IF v_fluid_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_fluid_mechanics AND question = 'Density is defined as:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_fluid_mechanics, 'Density is defined as:', '["Mass per unit volume", "Weight per unit area", "Force per unit area", "Volume per unit mass"]'::jsonb, 0);
    END IF;
    IF v_fluid_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_fluid_mechanics AND question = 'Pressure in a static fluid increases with:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_fluid_mechanics, 'Pressure in a static fluid increases with:', '["Height above the surface", "Depth", "Container color", "Container shape only"]'::jsonb, 1);
    END IF;
    IF v_fluid_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_fluid_mechanics AND question = 'Bernoulli''s equation expresses conservation of:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_fluid_mechanics, 'Bernoulli''s equation expresses conservation of:', '["Mass", "Charge", "Energy along a streamline", "Volume only"]'::jsonb, 2);
    END IF;
    IF v_fluid_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_fluid_mechanics AND question = 'The Reynolds number is used to predict:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_fluid_mechanics, 'The Reynolds number is used to predict:', '["Pressure", "Density", "Temperature", "Whether flow is laminar or turbulent"]'::jsonb, 3);
    END IF;
    IF v_fluid_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_fluid_mechanics AND question = 'The continuity equation A₁V₁ = A₂V₂ comes from conservation of:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_fluid_mechanics, 'The continuity equation A₁V₁ = A₂V₂ comes from conservation of:', '["Mass", "Energy", "Momentum", "Heat"]'::jsonb, 0);
    END IF;
    IF v_fluid_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_fluid_mechanics AND question = 'Viscosity is a fluid''s:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_fluid_mechanics, 'Viscosity is a fluid''s:', '["Density", "Resistance to flow or shear", "Compressibility", "Surface color"]'::jsonb, 1);
    END IF;
    IF v_fluid_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_fluid_mechanics AND question = 'The buoyant force on a submerged object equals:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_fluid_mechanics, 'The buoyant force on a submerged object equals:', '["The object''s mass", "The fluid''s viscosity", "The weight of fluid displaced", "Pressure times depth"]'::jsonb, 2);
    END IF;
    IF v_fluid_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_fluid_mechanics AND question = 'In pipe flow, a Reynolds number below about 2000 indicates:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_fluid_mechanics, 'In pipe flow, a Reynolds number below about 2000 indicates:', '["Turbulent flow", "Supersonic flow", "Compressible flow", "Laminar flow"]'::jsonb, 3);
    END IF;
    IF v_fluid_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_fluid_mechanics AND question = 'What is the SI unit of pressure?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_fluid_mechanics, 'What is the SI unit of pressure?', '["Pascal", "Newton", "Joule", "Watt"]'::jsonb, 0);
    END IF;
    IF v_fluid_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_fluid_mechanics AND question = 'When a pipe narrows, the velocity of an incompressible fluid:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_fluid_mechanics, 'When a pipe narrows, the velocity of an incompressible fluid:', '["Decreases", "Increases", "Stays the same", "Becomes zero"]'::jsonb, 1);
    END IF;
    -- thermodynamics (10 questions)
    IF v_thermodynamics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_thermodynamics AND question = 'The first law of thermodynamics states that:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_thermodynamics, 'The first law of thermodynamics states that:', '["Energy is conserved", "Entropy always decreases", "Absolute zero is easily reached", "Heat flows from cold to hot spontaneously"]'::jsonb, 0);
    END IF;
    IF v_thermodynamics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_thermodynamics AND question = 'According to the second law, the entropy of an isolated system:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_thermodynamics, 'According to the second law, the entropy of an isolated system:', '["Decreases", "Never decreases", "Is always zero", "Is irrelevant"]'::jsonb, 1);
    END IF;
    IF v_thermodynamics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_thermodynamics AND question = 'In an isothermal process, which quantity is constant?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_thermodynamics, 'In an isothermal process, which quantity is constant?', '["Pressure", "Volume", "Temperature", "Entropy"]'::jsonb, 2);
    END IF;
    IF v_thermodynamics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_thermodynamics AND question = 'An adiabatic process has no:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_thermodynamics, 'An adiabatic process has no:', '["Work", "Volume change", "Pressure change", "Heat transfer"]'::jsonb, 3);
    END IF;
    IF v_thermodynamics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_thermodynamics AND question = 'The Carnot efficiency equals:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_thermodynamics, 'The Carnot efficiency equals:', '["1 − Tc/Th", "Tc/Th", "Th/Tc", "1 + Tc/Th"]'::jsonb, 0);
    END IF;
    IF v_thermodynamics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_thermodynamics AND question = 'What is the SI unit of temperature?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_thermodynamics, 'What is the SI unit of temperature?', '["Celsius", "Kelvin", "Fahrenheit", "Rankine"]'::jsonb, 1);
    END IF;
    IF v_thermodynamics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_thermodynamics AND question = 'The ideal gas law is:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_thermodynamics, 'The ideal gas law is:', '["P = VT", "PV = mT", "PV = nRT", "P/V = nRT"]'::jsonb, 2);
    END IF;
    IF v_thermodynamics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_thermodynamics AND question = 'A heat engine converts:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_thermodynamics, 'A heat engine converts:', '["Work into heat only", "Light into heat", "Electricity into light", "Heat into work"]'::jsonb, 3);
    END IF;
    IF v_thermodynamics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_thermodynamics AND question = 'The zeroth law of thermodynamics defines:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_thermodynamics, 'The zeroth law of thermodynamics defines:', '["Thermal equilibrium and temperature", "Energy conservation", "Entropy", "Absolute zero"]'::jsonb, 0);
    END IF;
    IF v_thermodynamics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_thermodynamics AND question = 'A refrigerator moves heat from:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_thermodynamics, 'A refrigerator moves heat from:', '["Hot to cold spontaneously", "A cold region to a hot region using work", "Nowhere", "Inside to inside"]'::jsonb, 1);
    END IF;
    -- classical-mechanics (10 questions)
    IF v_classical_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_classical_mechanics AND question = 'Newton''s first law states that:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_classical_mechanics, 'Newton''s first law states that:', '["An object stays at rest or in uniform motion unless acted on by a net force", "F = ma", "Every action has a reaction", "Energy is conserved"]'::jsonb, 0);
    END IF;
    IF v_classical_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_classical_mechanics AND question = 'Linear momentum equals:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_classical_mechanics, 'Linear momentum equals:', '["m · a", "m · v", "m · g", "F · t²"]'::jsonb, 1);
    END IF;
    IF v_classical_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_classical_mechanics AND question = 'Kinetic energy equals:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_classical_mechanics, 'Kinetic energy equals:', '["mgh", "mv", "½mv²", "ma"]'::jsonb, 2);
    END IF;
    IF v_classical_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_classical_mechanics AND question = 'Acceleration due to gravity near Earth''s surface is about:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_classical_mechanics, 'Acceleration due to gravity near Earth''s surface is about:', '["1.6 m/s²", "3.0 m/s²", "15 m/s²", "9.8 m/s²"]'::jsonb, 3);
    END IF;
    IF v_classical_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_classical_mechanics AND question = 'Newton''s third law states that:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_classical_mechanics, 'Newton''s third law states that:', '["Every action has an equal and opposite reaction", "Objects have inertia", "F = ma", "Momentum is mass times velocity"]'::jsonb, 0);
    END IF;
    IF v_classical_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_classical_mechanics AND question = 'The work–energy theorem says net work equals the change in:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_classical_mechanics, 'The work–energy theorem says net work equals the change in:', '["Potential energy only", "Kinetic energy", "Momentum", "Mass"]'::jsonb, 1);
    END IF;
    IF v_classical_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_classical_mechanics AND question = 'The period of a mass–spring oscillator depends on:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_classical_mechanics, 'The period of a mass–spring oscillator depends on:', '["Amplitude", "Color", "Mass and spring constant", "Only gravity"]'::jsonb, 2);
    END IF;
    IF v_classical_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_classical_mechanics AND question = 'Angular momentum is conserved when the net external:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_classical_mechanics, 'Angular momentum is conserved when the net external:', '["Force is zero", "Energy is zero", "Mass is zero", "Torque is zero"]'::jsonb, 3);
    END IF;
    IF v_classical_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_classical_mechanics AND question = 'Gravitational potential energy near Earth equals:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_classical_mechanics, 'Gravitational potential energy near Earth equals:', '["mgh", "½mv²", "mv", "F/d"]'::jsonb, 0);
    END IF;
    IF v_classical_mechanics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_classical_mechanics AND question = 'Ignoring air resistance, a projectile''s horizontal velocity:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_classical_mechanics, 'Ignoring air resistance, a projectile''s horizontal velocity:', '["Increases", "Remains constant", "Decreases", "Becomes zero at the peak"]'::jsonb, 1);
    END IF;
    -- electromagnetism (10 questions)
    IF v_electromagnetism IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_electromagnetism AND question = 'Coulomb''s law says electric force is proportional to:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_electromagnetism, 'Coulomb''s law says electric force is proportional to:', '["The product of the charges divided by distance squared", "Distance", "The sum of the charges", "Mass"]'::jsonb, 0);
    END IF;
    IF v_electromagnetism IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_electromagnetism AND question = 'What is the SI unit of electric charge?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_electromagnetism, 'What is the SI unit of electric charge?', '["Ampere", "Coulomb", "Volt", "Tesla"]'::jsonb, 1);
    END IF;
    IF v_electromagnetism IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_electromagnetism AND question = 'Gauss''s law relates electric flux through a closed surface to:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_electromagnetism, 'Gauss''s law relates electric flux through a closed surface to:', '["The magnetic field", "The current", "The enclosed charge", "Resistance"]'::jsonb, 2);
    END IF;
    IF v_electromagnetism IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_electromagnetism AND question = 'Faraday''s law states that a changing magnetic flux induces:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_electromagnetism, 'Faraday''s law states that a changing magnetic flux induces:', '["Mass", "Only heat", "Resistance", "An electromotive force (EMF)"]'::jsonb, 3);
    END IF;
    IF v_electromagnetism IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_electromagnetism AND question = 'What is the SI unit of magnetic field (flux density)?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_electromagnetism, 'What is the SI unit of magnetic field (flux density)?', '["Tesla", "Weber per second", "Henry", "Ohm"]'::jsonb, 0);
    END IF;
    IF v_electromagnetism IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_electromagnetism AND question = 'Like electric charges:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_electromagnetism, 'Like electric charges:', '["Attract", "Repel", "Do not interact", "Cancel out"]'::jsonb, 1);
    END IF;
    IF v_electromagnetism IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_electromagnetism AND question = 'Lenz''s law states that an induced current opposes:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_electromagnetism, 'Lenz''s law states that an induced current opposes:', '["Resistance", "Voltage", "The change in magnetic flux that produced it", "Charge"]'::jsonb, 2);
    END IF;
    IF v_electromagnetism IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_electromagnetism AND question = 'Electromagnetic waves in a vacuum travel at:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_electromagnetism, 'Electromagnetic waves in a vacuum travel at:', '["The speed of sound", "1000 m/s", "A speed depending on amplitude", "The speed of light"]'::jsonb, 3);
    END IF;
    IF v_electromagnetism IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_electromagnetism AND question = 'Electric field lines point:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_electromagnetism, 'Electric field lines point:', '["Away from positive charges", "Toward positive charges", "Always perpendicular to charges", "Randomly"]'::jsonb, 0);
    END IF;
    IF v_electromagnetism IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_electromagnetism AND question = 'Maxwell''s equations unify:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_electromagnetism, 'Maxwell''s equations unify:', '["Thermodynamics and optics", "Electricity and magnetism", "Gravity and mechanics", "Quantum mechanics and relativity"]'::jsonb, 1);
    END IF;
    -- principles-of-management (10 questions)
    IF v_principles_of_management IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_principles_of_management AND question = 'What are the four functions of management?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_principles_of_management, 'What are the four functions of management?', '["Planning, organizing, leading, controlling", "Hiring, firing, paying, training", "Buying, selling, shipping, storing", "Coding, testing, deploying, monitoring"]'::jsonb, 0);
    END IF;
    IF v_principles_of_management IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_principles_of_management AND question = 'What does SWOT stand for?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_principles_of_management, 'What does SWOT stand for?', '["Sales, Work, Operations, Tasks", "Strengths, Weaknesses, Opportunities, Threats", "Strategy, Workflow, Output, Time", "Systems, Workers, Objectives, Targets"]'::jsonb, 1);
    END IF;
    IF v_principles_of_management IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_principles_of_management AND question = 'Planning involves:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_principles_of_management, 'Planning involves:', '["Monitoring performance", "Motivating employees", "Setting goals and deciding how to achieve them", "Recruiting staff"]'::jsonb, 2);
    END IF;
    IF v_principles_of_management IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_principles_of_management AND question = 'What is the top level of Maslow''s hierarchy of needs?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_principles_of_management, 'What is the top level of Maslow''s hierarchy of needs?', '["Safety", "Physiological", "Esteem", "Self-actualization"]'::jsonb, 3);
    END IF;
    IF v_principles_of_management IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_principles_of_management AND question = 'The controlling function means:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_principles_of_management, 'The controlling function means:', '["Measuring performance and correcting deviations", "Setting the vision", "Designing the structure", "Recruiting"]'::jsonb, 0);
    END IF;
    IF v_principles_of_management IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_principles_of_management AND question = 'Span of control refers to:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_principles_of_management, 'Span of control refers to:', '["The budget size", "The number of subordinates a manager directly supervises", "Project length", "Market share"]'::jsonb, 1);
    END IF;
    IF v_principles_of_management IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_principles_of_management AND question = 'In SMART goals, the S stands for:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_principles_of_management, 'In SMART goals, the S stands for:', '["Simple", "Strategic", "Specific", "Short"]'::jsonb, 2);
    END IF;
    IF v_principles_of_management IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_principles_of_management AND question = 'An organizational structure defines:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_principles_of_management, 'An organizational structure defines:', '["Products", "Prices", "Customers", "Roles, reporting lines, and authority"]'::jsonb, 3);
    END IF;
    IF v_principles_of_management IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_principles_of_management AND question = 'Democratic leadership:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_principles_of_management, 'Democratic leadership:', '["Involves team members in decision-making", "Has the leader decide alone", "Has no leader at all", "Avoids all decisions"]'::jsonb, 0);
    END IF;
    IF v_principles_of_management IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_principles_of_management AND question = 'Delegation means:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_principles_of_management, 'Delegation means:', '["Firing employees", "Assigning authority and responsibility to others", "Preparing the budget", "Advertising"]'::jsonb, 1);
    END IF;
    -- financial-accounting (10 questions)
    IF v_financial_accounting IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_financial_accounting AND question = 'What is the basic accounting equation?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_financial_accounting, 'What is the basic accounting equation?', '["Assets = Liabilities + Equity", "Assets = Revenue − Expenses", "Equity = Assets + Liabilities", "Liabilities = Assets + Equity"]'::jsonb, 0);
    END IF;
    IF v_financial_accounting IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_financial_accounting AND question = 'In double-entry bookkeeping, each transaction affects:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_financial_accounting, 'In double-entry bookkeeping, each transaction affects:', '["Only one account", "At least two accounts with equal debits and credits", "Only cash", "Only equity"]'::jsonb, 1);
    END IF;
    IF v_financial_accounting IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_financial_accounting AND question = 'A balance sheet shows:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_financial_accounting, 'A balance sheet shows:', '["Revenue over a period", "Only cash flows", "Assets, liabilities, and equity at a point in time", "Tax returns"]'::jsonb, 2);
    END IF;
    IF v_financial_accounting IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_financial_accounting AND question = 'An income statement reports:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_financial_accounting, 'An income statement reports:', '["The list of owners", "Assets only", "The bank balance", "Revenues and expenses over a period"]'::jsonb, 3);
    END IF;
    IF v_financial_accounting IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_financial_accounting AND question = 'Depreciation allocates:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_financial_accounting, 'Depreciation allocates:', '["The cost of a long-term asset over its useful life", "Cash to owners", "Revenue to customers", "Taxes to periods"]'::jsonb, 0);
    END IF;
    IF v_financial_accounting IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_financial_accounting AND question = 'Accounts receivable represents:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_financial_accounting, 'Accounts receivable represents:', '["Money the company owes", "Money owed to the company by customers", "Inventory", "Owner''s equity"]'::jsonb, 1);
    END IF;
    IF v_financial_accounting IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_financial_accounting AND question = 'Under accrual accounting, revenue is recorded when it is:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_financial_accounting, 'Under accrual accounting, revenue is recorded when it is:', '["Received in cash", "The end of the year", "Earned, regardless of cash timing", "Taxed"]'::jsonb, 2);
    END IF;
    IF v_financial_accounting IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_financial_accounting AND question = 'Which of these is a liability?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_financial_accounting, 'Which of these is a liability?', '["Equipment", "Cash", "Inventory", "Accounts payable"]'::jsonb, 3);
    END IF;
    IF v_financial_accounting IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_financial_accounting AND question = 'Net income equals:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_financial_accounting, 'Net income equals:', '["Revenues − Expenses", "Assets − Liabilities", "Revenues + Expenses", "Cash − Debt"]'::jsonb, 0);
    END IF;
    IF v_financial_accounting IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_financial_accounting AND question = 'Retained earnings are part of:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_financial_accounting, 'Retained earnings are part of:', '["Liabilities", "Owner''s (shareholders'') equity", "Revenue", "Current assets"]'::jsonb, 1);
    END IF;
    -- corporate-finance (10 questions)
    IF v_corporate_finance IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_corporate_finance AND question = 'Because of the time value of money, a dollar today is worth:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_corporate_finance, 'Because of the time value of money, a dollar today is worth:', '["More than a dollar in the future", "Less than a dollar in the future", "Exactly the same", "Nothing"]'::jsonb, 0);
    END IF;
    IF v_corporate_finance IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_corporate_finance AND question = 'A positive NPV means the project is expected to:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_corporate_finance, 'A positive NPV means the project is expected to:', '["Destroy value", "Add value", "Exactly break even", "Be rejected automatically"]'::jsonb, 1);
    END IF;
    IF v_corporate_finance IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_corporate_finance AND question = 'What is the future value of 100 invested at 10% for one year?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_corporate_finance, 'What is the future value of 100 invested at 10% for one year?', '["100", "105", "110", "121"]'::jsonb, 2);
    END IF;
    IF v_corporate_finance IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_corporate_finance AND question = 'A discount rate is used to convert:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_corporate_finance, 'A discount rate is used to convert:', '["Present values to future values only", "Revenue into profit", "Assets into liabilities", "Future cash flows into present value"]'::jsonb, 3);
    END IF;
    IF v_corporate_finance IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_corporate_finance AND question = 'Diversification mainly reduces:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_corporate_finance, 'Diversification mainly reduces:', '["Unsystematic (firm-specific) risk", "Systematic market risk", "All returns", "Taxes"]'::jsonb, 0);
    END IF;
    IF v_corporate_finance IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_corporate_finance AND question = 'The internal rate of return (IRR) is the discount rate at which:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_corporate_finance, 'The internal rate of return (IRR) is the discount rate at which:', '["Profit is maximized", "NPV equals zero", "Cash is zero", "Risk is zero"]'::jsonb, 1);
    END IF;
    IF v_corporate_finance IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_corporate_finance AND question = 'For taking on higher risk, investors typically require:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_corporate_finance, 'For taking on higher risk, investors typically require:', '["A lower return", "No return", "A higher expected return", "A fixed return"]'::jsonb, 2);
    END IF;
    IF v_corporate_finance IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_corporate_finance AND question = 'Capital structure refers to:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_corporate_finance, 'Capital structure refers to:', '["Office layout", "Product mix", "Staff hierarchy", "The mix of debt and equity financing"]'::jsonb, 3);
    END IF;
    IF v_corporate_finance IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_corporate_finance AND question = 'A dividend is:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_corporate_finance, 'A dividend is:', '["A distribution of profits to shareholders", "Loan interest", "A tax", "An employee salary"]'::jsonb, 0);
    END IF;
    IF v_corporate_finance IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_corporate_finance AND question = 'A typical bond pays:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_corporate_finance, 'A typical bond pays:', '["An ownership share", "Fixed interest (coupons) and principal at maturity", "Only dividends", "Nothing"]'::jsonb, 1);
    END IF;
    -- marketing-management (10 questions)
    IF v_marketing_management IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_marketing_management AND question = 'What are the 4 Ps of the marketing mix?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_marketing_management, 'What are the 4 Ps of the marketing mix?', '["Product, Price, Place, Promotion", "People, Process, Profit, Plan", "Product, Profit, Packaging, Partners", "Price, Policy, Press, Publicity"]'::jsonb, 0);
    END IF;
    IF v_marketing_management IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_marketing_management AND question = 'Market segmentation means:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_marketing_management, 'Market segmentation means:', '["Merging markets", "Dividing a market into distinct groups of buyers", "Setting prices", "Running advertisements"]'::jsonb, 1);
    END IF;
    IF v_marketing_management IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_marketing_management AND question = 'Positioning is:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_marketing_management, 'Positioning is:', '["Shipping products", "Hiring sales staff", "Creating a distinct image in target customers'' minds", "Lowering costs"]'::jsonb, 2);
    END IF;
    IF v_marketing_management IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_marketing_management AND question = 'A target market is:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_marketing_management, 'A target market is:', '["Everyone", "Competitors", "Suppliers", "The specific customer group a company aims to serve"]'::jsonb, 3);
    END IF;
    IF v_marketing_management IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_marketing_management AND question = 'Brand equity is:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_marketing_management, 'Brand equity is:', '["The value a brand adds to a product", "The factory cost", "The number of employees", "Only the stock price"]'::jsonb, 0);
    END IF;
    IF v_marketing_management IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_marketing_management AND question = 'What are the stages of the product life cycle?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_marketing_management, 'What are the stages of the product life cycle?', '["Plan, build, test, ship", "Introduction, growth, maturity, decline", "Design, price, promote, sell", "Idea, patent, launch, exit"]'::jsonb, 1);
    END IF;
    IF v_marketing_management IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_marketing_management AND question = 'Market research involves:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_marketing_management, 'Market research involves:', '["Producing goods", "Bookkeeping", "Collecting and analyzing data about customers and markets", "Recruiting"]'::jsonb, 2);
    END IF;
    IF v_marketing_management IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_marketing_management AND question = 'Penetration pricing means:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_marketing_management, 'Penetration pricing means:', '["A high initial price", "Random pricing", "Always matching competitors", "A low initial price to gain market share"]'::jsonb, 3);
    END IF;
    IF v_marketing_management IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_marketing_management AND question = 'Which is an example of digital marketing?') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_marketing_management, 'Which is an example of digital marketing?', '["Search engine and social media advertising", "Billboards only", "Printed flyers", "Door-to-door sales"]'::jsonb, 0);
    END IF;
    IF v_marketing_management IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_marketing_management AND question = 'Customer retention focuses on:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_marketing_management, 'Customer retention focuses on:', '["Acquiring new customers only", "Keeping existing customers", "Cutting prices", "Reducing staff"]'::jsonb, 1);
    END IF;
    -- economics (10 questions)
    IF v_economics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_economics AND question = 'According to the law of demand, when price rises, quantity demanded:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_economics, 'According to the law of demand, when price rises, quantity demanded:', '["Falls", "Rises", "Stays the same", "Doubles"]'::jsonb, 0);
    END IF;
    IF v_economics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_economics AND question = 'Market equilibrium occurs where:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_economics, 'Market equilibrium occurs where:', '["Supply exceeds demand", "Quantity supplied equals quantity demanded", "Demand exceeds supply", "The government sets the price"]'::jsonb, 1);
    END IF;
    IF v_economics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_economics AND question = 'GDP measures:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_economics, 'GDP measures:', '["Government debt", "Population", "The total market value of final goods and services produced", "Exports only"]'::jsonb, 2);
    END IF;
    IF v_economics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_economics AND question = 'Inflation is:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_economics, 'Inflation is:', '["Falling prices", "Unemployment", "An interest rate", "A general rise in the price level over time"]'::jsonb, 3);
    END IF;
    IF v_economics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_economics AND question = 'Opportunity cost is:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_economics, 'Opportunity cost is:', '["The value of the next best alternative forgone", "Money spent", "A tax", "Profit"]'::jsonb, 0);
    END IF;
    IF v_economics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_economics AND question = 'A monopoly is a market with:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_economics, 'A monopoly is a market with:', '["Many sellers", "A single seller with no close substitutes", "Exactly two sellers", "Perfect competition"]'::jsonb, 1);
    END IF;
    IF v_economics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_economics AND question = 'If demand is price elastic, quantity demanded is:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_economics, 'If demand is price elastic, quantity demanded is:', '["Unresponsive to price", "Fixed", "Highly responsive to price changes", "Always zero"]'::jsonb, 2);
    END IF;
    IF v_economics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_economics AND question = 'When a central bank raises interest rates, it generally aims to:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_economics, 'When a central bank raises interest rates, it generally aims to:', '["Increase inflation", "Raise unemployment deliberately", "Increase borrowing", "Reduce inflation"]'::jsonb, 3);
    END IF;
    IF v_economics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_economics AND question = 'Scarcity means:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_economics, 'Scarcity means:', '["Limited resources relative to unlimited wants", "Unlimited resources", "No demand", "Free goods"]'::jsonb, 0);
    END IF;
    IF v_economics IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE subject_id = v_economics AND question = 'Microeconomics studies:') THEN
        INSERT INTO public.quiz_questions (subject_id, question, options, correct_answer) VALUES (v_economics, 'Microeconomics studies:', '["The whole economy only", "Individual consumers, firms, and markets", "Only global trade", "Only government"]'::jsonb, 1);
    END IF;
END $$;

COMMENT ON TABLE public.major_subjects IS 'Curriculum mapping from degree majors to core and elective subjects';

-- ============================================================================
-- MIGRATION 009: AI QUIZ GENERATOR SCHEMA & ROW LEVEL SECURITY
-- ============================================================================

-- 1. AI QUIZZES
CREATE TABLE IF NOT EXISTS public.ai_quizzes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id      UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    topic           VARCHAR(255) NOT NULL,
    difficulty      VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    question_count  INT NOT NULL DEFAULT 5 CHECK (question_count BETWEEN 1 AND 50),
    created_by      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status          VARCHAR(50) NOT NULL DEFAULT 'completed' CHECK (status IN ('generating', 'completed', 'failed')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.ai_quizzes IS 'Metadata and configuration for topic-specific AI-generated quizzes';
CREATE INDEX IF NOT EXISTS idx_ai_quizzes_subject ON public.ai_quizzes(subject_id);
CREATE INDEX IF NOT EXISTS idx_ai_quizzes_created_by ON public.ai_quizzes(created_by);
CREATE INDEX IF NOT EXISTS idx_ai_quizzes_created_at ON public.ai_quizzes(created_at DESC);

-- 2. AI QUIZ QUESTIONS
CREATE TABLE IF NOT EXISTS public.ai_quiz_questions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ai_quiz_id      UUID NOT NULL REFERENCES public.ai_quizzes(id) ON DELETE CASCADE,
    question_text   TEXT NOT NULL,
    options         JSONB NOT NULL,
    correct_answer  INT NOT NULL CHECK (correct_answer BETWEEN 0 AND 3),
    explanation     TEXT,
    question_order  INT NOT NULL DEFAULT 1,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.ai_quiz_questions IS 'Individual AI-generated multiple-choice questions belonging to an AI quiz';
CREATE INDEX IF NOT EXISTS idx_ai_quiz_questions_quiz ON public.ai_quiz_questions(ai_quiz_id);
CREATE INDEX IF NOT EXISTS idx_ai_quiz_questions_order ON public.ai_quiz_questions(ai_quiz_id, question_order);

-- 3. AI QUIZ ATTEMPTS
CREATE TABLE IF NOT EXISTS public.ai_quiz_attempts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ai_quiz_id          UUID NOT NULL REFERENCES public.ai_quizzes(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    submitted_answers   JSONB NOT NULL DEFAULT '[]'::jsonb,
    score               INT NOT NULL DEFAULT 0,
    total_questions     INT NOT NULL,
    percentage          INT GENERATED ALWAYS AS (
                            CASE WHEN total_questions > 0 
                            THEN ROUND((score::numeric / total_questions::numeric) * 100) 
                            ELSE 0 END
                        ) STORED,
    time_spent_seconds  INT,
    started_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.ai_quiz_attempts IS 'Student submission records, scores, and answer histories for AI quizzes';
CREATE INDEX IF NOT EXISTS idx_ai_quiz_attempts_user ON public.ai_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_quiz_attempts_quiz ON public.ai_quiz_attempts(ai_quiz_id);
CREATE INDEX IF NOT EXISTS idx_ai_quiz_attempts_completed ON public.ai_quiz_attempts(completed_at DESC);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.ai_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- AI_QUIZZES POLICIES
DROP POLICY IF EXISTS ai_quizzes_select_own ON public.ai_quizzes;
CREATE POLICY ai_quizzes_select_own ON public.ai_quizzes
    FOR SELECT USING (auth.uid() = created_by);

DROP POLICY IF EXISTS ai_quizzes_insert_own ON public.ai_quizzes;
CREATE POLICY ai_quizzes_insert_own ON public.ai_quizzes
    FOR INSERT WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS ai_quizzes_update_own ON public.ai_quizzes;
CREATE POLICY ai_quizzes_update_own ON public.ai_quizzes
    FOR UPDATE USING (auth.uid() = created_by)
    WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS ai_quizzes_delete_own ON public.ai_quizzes;
CREATE POLICY ai_quizzes_delete_own ON public.ai_quizzes
    FOR DELETE USING (auth.uid() = created_by);

-- AI_QUIZ_QUESTIONS POLICIES
DROP POLICY IF EXISTS ai_quiz_questions_select ON public.ai_quiz_questions;
CREATE POLICY ai_quiz_questions_select ON public.ai_quiz_questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.ai_quizzes
            WHERE public.ai_quizzes.id = public.ai_quiz_questions.ai_quiz_id
              AND public.ai_quizzes.created_by = auth.uid()
        )
    );

DROP POLICY IF EXISTS ai_quiz_questions_insert ON public.ai_quiz_questions;
CREATE POLICY ai_quiz_questions_insert ON public.ai_quiz_questions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.ai_quizzes
            WHERE public.ai_quizzes.id = public.ai_quiz_questions.ai_quiz_id
              AND public.ai_quizzes.created_by = auth.uid()
        )
    );

-- AI_QUIZ_ATTEMPTS POLICIES
DROP POLICY IF EXISTS ai_quiz_attempts_select_own ON public.ai_quiz_attempts;
CREATE POLICY ai_quiz_attempts_select_own ON public.ai_quiz_attempts
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS ai_quiz_attempts_insert_own ON public.ai_quiz_attempts;
CREATE POLICY ai_quiz_attempts_insert_own ON public.ai_quiz_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS ai_quiz_attempts_update_own ON public.ai_quiz_attempts;
CREATE POLICY ai_quiz_attempts_update_own ON public.ai_quiz_attempts
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
