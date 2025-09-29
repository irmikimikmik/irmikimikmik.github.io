// ================== PROJECTS ==================
const projectData = [
  {
    title: 'UniBuddy',
    stack: 'RAG, Chunking, LLMs, FastAPI, LangChain, OpenAI, React',
    date: 'June 2025 – Ongoing',
    desc: 'End-to-end RAG chatbot answering UBC-specific questions. Built a modular web crawler and cleaner, experimented with chunking strategies + metadata tagging, and shipped a React chat UI with cited sources and reusable design tokens.',
    link: null
  },
  {
    title: 'PLUMAGE for YouCode Hackathon',
    stack: 'Node.js, OpenAI API, NPM',
    date: 'April 2024',
    desc: 'Retail backend with 8 API endpoints; integrated GPT-4-Vision to deliver personalized color advice from facial features within 24 hours.',
    link: 'https://github.com/irmikimikmik/PLUMAGE-for-YouCode2024'
  },
  {
    title: 'Project Buddies',
    stack: 'PHP (CodeIgniter), HTML5, CSS, JavaScript, SQL/MySQL',
    date: 'June – August 2023',
    desc: 'Web collaboration platform: designed schema + CRUD in MySQL, built frontend with HTML/CSS/JS, and implemented backend in PHP/CodeIgniter.',
    link: 'https://github.com/irmikimikmik/ProjectCollaboratorApp'
  },
  {
    title: 'Query Engine App',
    stack: 'TypeScript, Node.js, OOP, TDD',
    date: 'January – May 2022',
    desc: 'TypeScript query engine that validates, filters, and processes datasets using object-oriented design and test-driven development.',
    link: null
  },
  {
    title: 'Figure Skating Strategy App',
    stack: 'Java, JUnit, Swing (JFrame)',
    date: 'January – May 2021',
    desc: 'Algorithm to estimate figure-skating competition scores; built abstractions, refactored for maintainability, and shipped a desktop GUI with tests.',
    link: 'https://github.com/irmikimikmik/FigureSkatingStrategyApp/blob/master/FigureSkatingApp.mp4'
  }
];


// ================== EXPERIENCE ==================
const experienceData = [
  {
    role: 'Agile Developer Intern — Data Wrangling',
    company: 'SAP Canada Inc.',
    date: 'Jan 2025 – Sep 2025',
    bullets: [
      'Received the Fast Track Award (manager-nominated top iXp interns).',
      'Owned an end-to-end user story (feature disabling) and presented to international teams.',
      'Designed a RAG-extended LLM for SAC custom expressions and explored PPO-style RLHF to improve accuracy.',
      'Delivered reusable OLAP dimension-mapping feature in collaboration with cross-functional teams.',
      'Reduced memory usage of an error-processing SQL statement by ~70% on customer systems; resolved 3 customer tickets.',
      'Diagnosed issues across core data-transformation features and ensured seamless integration via comprehensive testing.'
    ]
  },
  {
    role: 'Teaching Assistant — Introduction to AI (CPSC 322)',
    company: 'University of British Columbia',
    date: 'Sep 2024 – Jun 2025',
    bullets: [
      'Authored 300+ questions on Search, Belief Networks, Logic, CSPs, Planning, Decision & Probability.',
      'Built diverse PrairieLearn items using Python + HTML; deployed across practice sets, midterms, and finals.'
    ]
  },
  {
    role: 'Agile Developer Intern — Cloud Infrastructure',
    company: 'SAP Canada Inc.',
    date: 'Sep 2022 – Apr 2023',
    bullets: [
      'Fast Track Award recipient; improved resiliency of two SAC microservices (startup independent of external cache).',
      'Set up real-time metrics and alerts with Prometheus/Grafana, preventing Redis cache crashes.',
      'Standardized a monitoring framework for test-system health checks; investigated CI/CD (Jenkins) and Kubernetes issues.',
      'Performed RCA on 30+ workflows using distributed tracing and logs; contributed 135+ changes and resolved 70+ issues.'
    ]
  },
  {
    role: 'Finance Director',
    company: 'Women in Computer Science (WiCS) at UBC',
    date: 'May 2024 – Present',
    bullets: [
      'Applied for >$30,000 in grants; managed budgets/reimbursements and set up university financial processes.',
      'Organized Women in AI and intro-to-Deep-Learning events; advanced DEI initiatives with 50+ participants.'
    ]
  },
  {
    role: 'Full-Stack Developer (Volunteer)',
    company: 'Superfan',
    date: 'Jan 2024 – May 2024',
    bullets: [
      'Built features using Spotify API with a SupaBase backend; powered personalized weekly recaps.',
      'Shipped “oldest soul” ranking via SQL aggregation; Node.js backend + React frontend.'
    ]
  }
];


// ================== EDUCATION ==================
const educationData = {
  school: 'University of British Columbia (UBC)',
  degree: 'BSc in Computer Science',
  date: 'Sep 2020 – Dec 2025 (expected)',
  details: 'CODE committee; Educational Leadership program; Outstanding International Student (OIS) Award; cGPA 84.4%.'
};

window.projectData = projectData;
window.experienceData = experienceData;
window.educationData = educationData;