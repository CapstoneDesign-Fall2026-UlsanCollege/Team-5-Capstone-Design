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

