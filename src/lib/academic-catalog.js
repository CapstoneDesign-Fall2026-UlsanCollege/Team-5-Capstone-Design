/**
 * Academic Catalog — Smart Study Companion
 * 
 * Comprehensive hierarchy:
 * Country -> University -> Faculty -> Major/Department -> Subjects
 * Supports accredited institutions in South Korea, Nepal, India, and South Asia.
 */

export const COUNTRIES = [
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
];

export const UNIVERSITIES_BY_COUNTRY = {
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
};

export const FACULTIES = [
  'Faculty of Computer Science & Information Technology',
  'Faculty of Engineering & Technology',
  'Faculty of Science & Mathematics',
  'Faculty of Business & Management Studies'
];

export const MAJORS_BY_FACULTY = {
  'Faculty of Computer Science & Information Technology': [
    'Computer Science & Engineering (CSE)',
    'Software Engineering',
    'Information Technology (IT)',
    'Artificial Intelligence & Data Science',
    'Cybersecurity & Network Systems'
  ],
  'Faculty of Engineering & Technology': [
    'Electronics & Communication Engineering',
    'Electrical & Information Engineering',
    'Civil Engineering',
    'Mechanical Engineering'
  ],
  'Faculty of Science & Mathematics': [
    'Mathematics & Computing',
    'Applied Statistics & Data Analysis',
    'Physics & Computational Modeling'
  ],
  'Faculty of Business & Management Studies': [
    'Management Information Systems (MIS)',
    'Business Administration & Tech Management',
    'FinTech & Financial Engineering'
  ]
};

export const SUBJECTS_CATALOG = [
  // Core Computer Science
  { id: 'sub-prog', name: 'Programming Fundamentals', slug: 'programming', icon: 'fa-code', category: 'Core CS', description: 'C, C++, Python, JavaScript logic, syntax, functions, and modular code' },
  { id: 'sub-dsa', name: 'Data Structures & Algorithms', slug: 'data-structures', icon: 'fa-diagram-project', category: 'Core CS', description: 'Arrays, linked lists, trees, graphs, sorting, searching, and complexity' },
  { id: 'sub-db', name: 'Database Management Systems', slug: 'databases', icon: 'fa-database', category: 'Core CS', description: 'Relational design, SQL, ACID transactions, normalization, and indexing' },
  { id: 'sub-net', name: 'Computer Networks', slug: 'networks', icon: 'fa-network-wired', category: 'Core CS', description: 'OSI & TCP/IP stack, routing, sockets, protocols, and security' },
  { id: 'sub-os', name: 'Operating Systems', slug: 'operating-systems', icon: 'fa-desktop', category: 'Core CS', description: 'Processes, threads, CPU scheduling, virtual memory, concurrency, and I/O' },
  { id: 'sub-se', name: 'Software Engineering', slug: 'software-engineering', icon: 'fa-sitemap', category: 'Software Dev', description: 'Agile methodologies, SDLC, requirements analysis, design patterns, testing' },
  { id: 'sub-web', name: 'Web Technologies & Cloud', slug: 'web-cloud', icon: 'fa-globe', category: 'Software Dev', description: 'Full-stack web, REST APIs, client-server models, Supabase, and cloud deployment' },
  
  // Advanced CS & AI
  { id: 'sub-ai', name: 'Artificial Intelligence & ML', slug: 'artificial-intelligence', icon: 'fa-brain', category: 'Intelligence', description: 'Machine learning fundamentals, neural networks, supervised & unsupervised models' },
  { id: 'sub-sec', name: 'Information Security & Privacy', slug: 'cybersecurity', icon: 'fa-shield-halved', category: 'Systems', description: 'Cryptography, network defense, authentication protocols, and web safety' },
  { id: 'sub-ds', name: 'Data Science & Analytics', slug: 'data-science', icon: 'fa-chart-pie', category: 'Intelligence', description: 'Data wrangling, statistical inference, visualization, and Pandas/NumPy' },

  // Mathematics & Foundation
  { id: 'sub-math-disc', name: 'Discrete Mathematics', slug: 'discrete-math', icon: 'fa-square-root-variable', category: 'Mathematics', description: 'Logic, sets, relations, graph theory, combinatorics, and proofs' },
  { id: 'sub-math-calc', name: 'Calculus & Linear Algebra', slug: 'calculus-linear-algebra', icon: 'fa-calculator', category: 'Mathematics', description: 'Matrices, vectors, eigenvalues, derivatives, and multidimensional calculus' },
  { id: 'sub-stat', name: 'Probability & Statistics', slug: 'prob-stats', icon: 'fa-chart-simple', category: 'Mathematics', description: 'Random variables, distributions, hypothesis testing, and Bayes theorem' },

  // Professional & Capstone
  { id: 'sub-capstone', name: 'Capstone Design Project', slug: 'capstone-design', icon: 'fa-award', category: 'Projects', description: 'Team-based software project delivery, architecture, Git workflow, and demo' },
  { id: 'sub-comm', name: 'Technical Writing & Presentation', slug: 'technical-writing', icon: 'fa-pen-nib', category: 'General', description: 'Engineering reports, research documentation, proposals, and communication' }
];

export function getCountries() {
  return COUNTRIES;
}

export function getUniversities(country) {
  if (!country) return [];
  return UNIVERSITIES_BY_COUNTRY[country] || [
    'General College or University',
    'Open / Distance Learning College'
  ];
}

export function universitiesFor(country) {
  return getUniversities(country);
}

export function getFaculties() {
  return FACULTIES;
}

export function getMajors(faculty) {
  if (!faculty) return MAJORS_BY_FACULTY['Faculty of Computer Science & Information Technology'];
  return MAJORS_BY_FACULTY[faculty] || [];
}

export function searchSubjects(query = '', category = 'all') {
  const q = query.trim().toLowerCase();
  return SUBJECTS_CATALOG.filter((sub) => {
    const matchCategory = category === 'all' || sub.category === category;
    const matchQuery = !q || sub.name.toLowerCase().includes(q) || sub.description.toLowerCase().includes(q) || sub.category.toLowerCase().includes(q);
    return matchCategory && matchQuery;
  });
}
