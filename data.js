// ================== PROJECTS ==================
const projectData = [
  {
    title: 'Departmental Admissions Chatbot',
    stack: 'RAG · LangChain · Web Crawler · RAGAS',
    date: 'Sept 2025 – Apr 2026',
    desc: 'Co-founded a RAG-powered chatbot centralizing UBC CS admissions info for advisors and undergraduates. Built a configurable web crawler with tiered-depth crawling and ethical scraping compliance, a semantic-search query pipeline in LangChain, and a RAGAS-based factual-correctness benchmark.',
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
    stack: 'Java · JUnit · JFrame',
    date: 'January – May 2021',
    desc: 'Algorithm to estimate figure-skating competition scores. Built abstractions, refactored for maintainability, and shipped a desktop GUI with comprehensive tests.',
    link: 'https://github.com/irmikimikmik/FigureSkatingStrategyApp/blob/master/FigureSkatingApp.mp4'
  }
];


// ================== ACADEMIC EXPERIENCE ==================
const academicExperienceData = [
  {
    role: 'Research Assistant — Natural Language Processing Group',
    company: 'University of British Columbia · Supervisor: Prof. Hila Gonen',
    date: 'Sept 2025 – Ongoing · Vancouver, BC',
    bullets: [
      'Researching <strong>semantic consistency</strong> in LLMs using vector embeddings and NLI-based methods to assess semantic equivalence',
      'Extended SOTA consistency metrics to long-form text, exploring decomposition strategies and inconsistency localization',
      'Used geometric spaces for N-way comparisons of decomposed units, informed by literature on argument salience',
      'Investigated single-forward-pass consistency prediction by training GRU and MHSA architectures on probability and semantic signals'
    ]
  },
  {
    role: 'Teaching Assistant — Introduction to AI (AI 100)',
    company: 'University of British Columbia',
    date: 'Sept 2026 – Dec 2026 · Vancouver, BC',
    bullets: []
  },
  {
    role: 'Co-founder — Departmental Admissions Chatbot',
    company: 'University of British Columbia · Supervisor: Prof. Varada Kolhatkar',
    date: 'Sept 2025 – Apr 2026 · Vancouver, BC',
    bullets: [
      'Founded a <strong>RAG-powered chatbot</strong> centralizing CS admissions info for advisors and undergraduates, reducing reliance on unofficial sources',
      'Built the knowledge base (web crawling, content processing, embeddings) and query pipeline (semantic search, contextual prompting) using <strong>LangChain</strong>',
      'Engineered a configurable crawler with tiered-depth crawling, cross-domain link following, and ethical scraping compliance',
      'Benchmarked factual correctness with a hand-built admissions Q&A dataset using the <strong>RAGAS</strong> library',
      'Presented a poster at the Can-CWiC Student Research Conference'
    ]
  },
  {
    role: 'Teaching Assistant — Introduction to AI (CPSC 322)',
    company: 'University of British Columbia · Supervisor: Prof. Mehrdad Oveisi',
    date: 'Sept 2024 – Jun 2025 · Vancouver, BC',
    bullets: [
      'Authored 300+ Python assessment questions on Search, Belief Networks, Logic, CSPs, and Probability Theory',
      'Migrated the question bank to new infrastructure and built Python-based automated grading pipelines',
      'Created rubrics adopted across the course, standardizing evaluation for 350+ students',
      'Researched AI curriculum design across universities to inform question development'
    ]
  }
];


// ================== CONFERENCES ==================
const conferenceData = [
  {
    event: 'UBC Computer Science Student Research Conference',
    role: 'Presenter',
    date: 'Feb 2026 · Vancouver, BC, Canada',
    desc: 'Presented work on a RAG-extended LLM for CS department admissions.'
  },
  {
    event: 'IGNITE Professional Development Conference',
    role: 'Panelist',
    date: 'Nov 2025 · Science Undergraduate Society, UBC, Vancouver, BC',
    desc: null
  },
  {
    event: 'Canadian Celebration of Women in Computing (Can-CWiC) West',
    role: 'Sponsored Presenter',
    date: 'Nov 2025 · Vancouver, BC, Canada',
    desc: 'Presented work on a RAG-extended LLM for CS department admissions.'
  },
  {
    event: 'SAP Developer Conference (DCOM)',
    role: 'Presenter',
    date: 'May 2025 · Vancouver, BC (in-person) & Global (virtual)',
    desc: 'Presented an AI-powered code review agent for automated pull request evaluations.'
  },
  {
    event: 'Canadian Celebration of Women in Computing (Can-CWiC)',
    role: 'Sponsored Attendee',
    date: 'Oct 2024 · Toronto, ON, Canada',
    desc: null
  }
];


// ================== INDUSTRY EXPERIENCE ==================
const industryExperienceData = [
  {
    role: 'Agile Developer Intern — Data Wrangling',
    company: 'SAP Canada Inc.',
    date: 'Jan 2025 – Sept 2025 · Vancouver, BC',
    bullets: [
      'Received the <strong>Fast Track Award</strong> (manager-nominated recognition for top-performing SAP iXp interns)',
      'Designed a <strong>RAG-extended LLM</strong> for SAP Analytics Cloud custom expressions, integrating Proximal Policy Optimization (PPO)',
      'Owned a user story end-to-end and presented the solution to international teams',
      'Delivered a full-stack feature for reusable dimension mappings, improving data import flexibility',
      'Onboarded 5 new hires through knowledge-transfer sessions on OLAP and product concepts',
      'Troubleshot core data transformations in a wrangling microservice, ensuring seamless integration'
    ]
  },
  {
    role: 'Agile Developer Intern — Cloud Infrastructure',
    company: 'SAP Canada Inc.',
    date: 'Sept 2022 – Apr 2023 · Vancouver, BC',
    bullets: [
      'Received the <strong>Fast Track Award</strong> (manager-nominated recognition for top-performing SAP iXp interns)',
      'Improved resiliency of two SAP Analytics Cloud microservices, removing startup dependency on external cache services',
      'Built an alerting system with real-time <strong>Prometheus/Grafana</strong> metrics for distributed cache (Redis) memory usage',
      'Diagnosed root causes in 30+ workflows using distributed traces and logs (Kibana, Grafana, Dynatrace); resolved CI/CD (Jenkins) and Kubernetes issues',
      'Established a monitoring framework for test systems, adopted by on-duty developers'
    ]
  }
];


// ================== COMMUNITY INVOLVEMENT AND VOLUNTEERISM ==================
const communityData = [
  {
    role: 'Research and Graduate Studies Liaison',
    company: 'Women in Computer Science (UBC WiCS)',
    date: 'Jan 2026 – Ongoing · Vancouver, BC',
    bullets: [
      'Organized high school research lab tours with UBC Geering Up and STEM Fellowship REO',
      'Developed and led a workshop on <strong>LLM reliability</strong> for gender-diverse high-schoolers (GIRLsmarts4tech)',
      'Building pipelines to increase undergraduate research accessibility via directed studies and research award support'
    ]
  },
  {
    role: 'Student Representative',
    company: 'Committee for Outreach, Diversity and Equity (UBC CODE)',
    date: 'Sept 2024 – Ongoing · Vancouver, BC',
    bullets: [
      'Co-organized the Indigenous Strategic Plan workshop series for student leaders, faculty, and staff',
      'Volunteered at CEDAR, an Indigenous STEM camp for middle schoolers',
      'Identified information inaccessibility in the admissions process and co-initiated the Advisor Help RAG chatbot project'
    ]
  },
  {
    role: 'Finance Director',
    company: 'Women in Computer Science (UBC WiCS)',
    date: 'Sept 2024 – Apr 2026 · Vancouver, BC',
    bullets: [
      'Scaled funding applications from $3,000 to over $35,000, building a multi-year funding strategy and personally securing $15,000',
      'Created grant guides, accounting templates, and financial procedures adopted across department affinity groups',
      'Managed budgets with 15+ corporate sponsors, supporting 40+ events reaching 600+ students with a 30+ person team',
      'Received the <strong>Club Dynamics Award</strong> from the Science Undergraduate Society'
    ]
  }
];


// ================== ATHLETIC ACHIEVEMENTS AND SCHOLARSHIPS ==================
const athleticData = [
  {
    role: 'Professional Figure Skater & Coach',
    company: 'Golden Skaters Club of Turkey · Coaching Association of Canada',
    date: 'Jan 2011 – Jan 2025 · Ankara, Turkey & Vancouver, BC',
    link: 'https://en.wikipedia.org/wiki/Guzide_Irmak_Bayir',
    bullets: [
      "4× National Figure Skating Champion (2016–2020) and national record holder for highest international competition score in women's figure skating",
      'Competed in 22+ international competitions across 18 countries, including three World Junior Championships (2017–2019), the ISU Junior Grand Prix series, and the European Youth Olympic Winter Festival',
      'Olympic Athlete Scholarship, Turkish National Olympic Committee (2021–2023, $8,400)',
      'National Team Athlete Scholarship, Turkish Ministry of Sports (2021–2023, $25,000)'
    ]
  }
];


// ================== EDUCATION ==================
const educationData = [
  {
    school: 'University of British Columbia',
    degree: "Master's in Computer Science",
    date: 'Sept 2026 – Ongoing · Vancouver, BC',
    details: 'Scholarships: CS Merit Scholar Award ($5,000), BPOC Graduate Excellence Award ($1,000) &nbsp;&middot;&nbsp; Coursework: Interpretability & Control of LLMs, InfoVis Applications of LLMs, LLM Commonsense Reasoning'
  },
  {
    school: 'University of British Columbia',
    degree: 'BSc, Major in Computer Science',
    date: 'Sept 2020 – May 2026 · Vancouver, BC',
    details: "Graduated with Distinction, Co-operative Education Program &nbsp;&middot;&nbsp; GPA 84.9% &nbsp;&middot;&nbsp; Dean's Honour List (2021–2022, 2023–2024) &nbsp;&middot;&nbsp; Research: Reliability &amp; Trustworthiness of LLMs, RAG in Educational Domains &nbsp;&middot;&nbsp; Awards: Bill Aiello Memorial Award ($2,500), NSERC USRA ($6,000), Outstanding International Student Award ($25,000)"
  }
];

window.projectData            = projectData;
window.academicExperienceData = academicExperienceData;
window.conferenceData         = conferenceData;
window.industryExperienceData = industryExperienceData;
window.communityData          = communityData;
window.athleticData           = athleticData;
window.educationData          = educationData;
