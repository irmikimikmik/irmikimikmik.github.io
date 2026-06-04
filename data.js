// ================== PROJECTS ==================
const projectData = [
  {
    title: 'UniBuddy',
    stack: 'RAG · LangChain · FastAPI · OpenAI · React',
    date: 'June 2025 – Ongoing',
    desc: 'End-to-end RAG chatbot answering UBC-specific questions. Built a modular web crawler and cleaner, experimented with chunking strategies + metadata tagging, and shipped a React chat UI with cited sources and reusable design tokens.',
    link: null
  },
  {
    title: 'PLUMAGE',
    stack: 'Node.js · OpenAI API · GPT-4-Vision · NPM',
    date: 'April 2024',
    desc: 'Retail backend with 8 API endpoints; integrated GPT-4-Vision to deliver personalized color advice from facial features. Built within 24 hours at YouCode Hackathon.',
    link: 'https://github.com/irmikimikmik/PLUMAGE-for-YouCode2024'
  },
  {
    title: 'Project Buddies',
    stack: 'PHP · CodeIgniter · MySQL · HTML/CSS/JS',
    date: 'June – August 2023',
    desc: 'Web collaboration platform for IT projects. Designed the database schema, built CRUD operations in MySQL, and implemented the frontend and backend end-to-end.',
    link: 'https://github.com/irmikimikmik/ProjectCollaboratorApp'
  },
  {
    title: 'Query Engine App',
    stack: 'TypeScript · Node.js · OOP · TDD',
    date: 'January – May 2022',
    desc: 'TypeScript query engine that validates, filters, and processes datasets using object-oriented design and test-driven development, enabling analytics of UBC buildings, rooms, and courses.',
    link: null
  },
  {
    title: 'Figure Skating Strategy App',
    stack: 'Java · JUnit · Swing (JFrame)',
    date: 'January – May 2021',
    desc: 'Algorithm to estimate figure-skating competition scores. Built abstractions, refactored for maintainability, and shipped a desktop GUI with comprehensive tests.',
    link: 'https://github.com/irmikimikmik/FigureSkatingStrategyApp/blob/master/FigureSkatingApp.mp4'
  }
];


// ================== EXPERIENCE ==================
const experienceData = [
  {
    role: 'Agile Developer Intern — Data Wrangling',
    company: 'SAP Canada Inc.',
    date: 'Jan 2025 – Sep 2025 · Vancouver, BC',
    bullets: [
      'Received the <strong>Fast Track Award</strong> (manager-nominated top iXp interns)',
      'Owned an end-to-end user story (feature disabling) and presented the solution to international teams',
      'Designed a <strong>RAG-extended LLM</strong> for SAC custom expressions and explored PPO-style RLHF to improve accuracy',
      'Delivered a reusable OLAP dimension-mapping feature in collaboration with cross-functional teams',
      'Reduced memory usage of an error-processing SQL statement by ~70% on customer systems; resolved 3 customer tickets'
    ]
  },
  {
    role: 'Teaching Assistant — Introduction to AI (CPSC 322)',
    company: 'University of British Columbia',
    date: 'Sep 2024 – Jun 2025 · Vancouver, BC',
    bullets: [
      'Authored 300+ questions on Search, Belief Networks, Logic, CSPs, Planning, Decision & Probability',
      'Built diverse PrairieLearn items using Python + HTML; deployed across practice sets, midterms, and finals'
    ]
  },
  {
    role: 'Agile Developer Intern — Cloud Infrastructure',
    company: 'SAP Canada Inc.',
    date: 'Sep 2022 – Apr 2023 · Vancouver, BC',
    bullets: [
      'Received the <strong>Fast Track Award</strong>; improved resiliency of two SAC microservices (startup independent of external cache)',
      'Set up real-time metrics and alerts with <strong>Prometheus/Grafana</strong>, preventing Redis cache crashes',
      'Standardized a monitoring framework for test-system health checks; investigated CI/CD (Jenkins) and Kubernetes issues',
      'Performed RCA on 30+ workflows using distributed tracing and logs; contributed 135+ changes and resolved 70+ issues'
    ]
  },
  {
    role: 'Finance Director',
    company: 'Women in Computer Science (WiCS) at UBC',
    date: 'May 2024 – Present · Vancouver, BC',
    bullets: [
      'Applied for >$30,000 in grants; managed budgets, reimbursements, and university financial processes',
      'Organized Women in AI and intro-to-Deep-Learning events, advancing DEI with 50+ participants'
    ]
  },
  {
    role: 'Full-Stack Developer (Volunteer)',
    company: 'Superfan',
    date: 'Jan 2024 – May 2024 · Columbus, OH',
    bullets: [
      'Built features using Spotify API with a SupaBase backend; powered personalized weekly recaps',
      "Shipped 'oldest soul' ranking via SQL aggregation; Node.js backend + React frontend"
    ]
  },
  {
    role: 'Professional Figure Skater & Regional Coach',
    company: 'Golden Skaters Figure Skating Club',
    date: 'Jan 2011 – 2021 · Ankara, Turkey',
    link: 'https://en.wikipedia.org/wiki/Guzide_Irmak_Bayir',
    bullets: [
      '4× National Figure Skating Champion and record-holder for highest points by a female skater in an international competition in Türkiye',
      'Competed in 22+ worldwide competitions in 18 countries, including European Youth Olympics Festival and three seasons of World Junior Championships',
      'Regional Coach trained by the National Coaching Certification Program of Canada'
    ]
  }
];


// ================== EDUCATION ==================
const educationData = {
  school: 'University of British Columbia',
  degree: 'BSc in Computer Science',
  date: 'Sep 2020 – Dec 2025 (expected) · Vancouver, BC',
  details: 'CODE committee &nbsp;&middot;&nbsp; Educational Leadership program &nbsp;&middot;&nbsp; Outstanding International Student (OIS) Award &nbsp;&middot;&nbsp; cGPA 84.4%'
};

window.projectData   = projectData;
window.experienceData = experienceData;
window.educationData  = educationData;
