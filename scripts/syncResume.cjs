const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const publicDir = path.join(__dirname, '../public');
const jsonPath = path.join(__dirname, '../src/data/resumeData.json');

const pdfFiles = fs.readdirSync(publicDir)
  .filter(f => f.toLowerCase().endsWith('.pdf') && !f.toLowerCase().includes('not_in_use'))
  .map(f => ({
    name: f,
    path: path.join(publicDir, f),
    mtime: fs.statSync(path.join(publicDir, f)).mtimeMs
  }))
  .sort((a, b) => b.mtime - a.mtime);

if (pdfFiles.length === 0) {
  console.error("❌ Error: No active PDF file found in public/ folder!");
  process.exit(1);
}

const activePdf = pdfFiles[0];
const pdfPath = activePdf.path;
const dataBuffer = fs.readFileSync(pdfPath);
const parser = new pdf.PDFParse(new Uint8Array(dataBuffer));

parser.getText().then(result => {
  const text = typeof result === 'string' ? result : (result.text || (result.pages && result.pages[0] ? result.pages[0].text : ''));
  console.log(`=== 📄 Reading public/${activePdf.name} ===`);

  // Parse Education
  const education = [];
  if (text.includes("Dr. D. Y. Patil Institute of Technology")) {
    const cgpaMatch = text.match(/CGPA:\s*([\d\.\s\/]+)/i);
    education.push({
      degree: "B.E. in AI & DS",
      institution: "Dr. D. Y. Patil Institute of Technology",
      score: cgpaMatch ? `CGPA: ${cgpaMatch[1].trim()}` : "CGPA: 7.09 / 10.00",
      year: "2026"
    });
  }
  if (text.includes("Late B G Kabra")) {
    const perc12 = text.match(/Percentage:\s*([\d\.\s\/]+)/i);
    education.push({
      degree: "12th Grade",
      institution: "Late B G Kabra Jr College (MSBSHSE)",
      score: perc12 ? `Percentage: ${perc12[1].trim()}` : "Percentage: 83.67%",
      year: "2022"
    });
  }
  if (text.includes("Vidya Vikas")) {
    education.push({
      degree: "10th Grade",
      institution: "Vidya Vikas International School (CBSE)",
      score: "Percentage: 87.20%",
      year: "2020"
    });
  }

  // Parse Skills
  const skills = [];
  const skillLines = [
    { key: "Fullstack Engineering", title: "Fullstack Engineering" },
    { key: "Database & Data Modeling", title: "Database & Data Modeling" },
    { key: "Cloud & DevOps Workflows", title: "Cloud & DevOps" },
    { key: "AI-Native Engineering", title: "AI-Native Eng." },
    { key: "Tools & Visualization", title: "Visualization & Tools" }
  ];

  skillLines.forEach(item => {
    const regex = new RegExp(`${item.key}:\\s*(.+)`, 'i');
    const match = text.match(regex);
    if (match) {
      skills.push({
        title: item.title,
        skills: match[1].trim()
      });
    }
  });

  // Default fallback for skills if regex pattern differs slightly
  if (skills.length === 0) {
    skills.push(
      { title: "Fullstack Engineering", skills: "JavaScript, TypeScript, React, Node.js, Python, FastAPI, RESTful APIs, JSON" },
      { title: "Database & Data", skills: "PostgreSQL, MySQL, Schema Design, Query Optimization" },
      { title: "Cloud & DevOps", skills: "AWS (EC2, S3), GitHub Actions, Git, CI/CD, Docker, Agile/Scrum" },
      { title: "AI-Native Eng.", skills: "LLM Fine-tuning, RAG Pipelines, LangChain, PyTorch, Vector DBs" },
      { title: "Visualization", skills: "Power BI, Tableau, Looker Studio" }
    );
  }

  // Parse Experience
  const expPeriodMatch = text.match(/(\d{2}\/\d{4}\s*[\u2013\-–\u2014]\s*(?:\d{2}\/\d{4}|Present))/i);
  const expPeriod = expPeriodMatch ? expPeriodMatch[1].trim() : "01/2025 – 01/2026";

  const experience = [
    {
      company: "Parallel Learning",
      period: expPeriod,
      role: "Software Engineering Intern",
      highlights: [
        {
          label: "Backend & Service Optimization:",
          text: "Refactored database schemas and complex relational queries, reducing average API response latency by 25% and ensuring seamless high-concurrency data flow."
        },
        {
          label: "Cloud Deployments & Automation:",
          text: "Orchestrated application deployments and static asset hosting across AWS EC2 and S3 instances, while automating internal workflows to cut manual operational work by 4%."
        },
        {
          label: "Cross-Functional Product Delivery:",
          text: "Collaborated closely with cross-functional teams to translate abstract product requirements into production-ready software features."
        }
      ]
    }
  ];

  // Parse Projects
  const projects = [
    {
      title: "AI-Powered Legal Document Translation System",
      description: "Fine-tuned the Sarvam LLM locally on specialized domain corpora to ensure high terminology precision and domain accuracy. Utilized PyMuPDF for document parsing and built clean REST API endpoints serving structured JSON outputs across 150+ legal documents.",
      techStack: ["Python", "FastAPI", "REST APIs", "React", "Sarvam LLM"],
      github: "https://github.com/Akshada2411/AI-Powered-legal-translator"
    },
    {
      title: "Automated Candlestick Predictor (Fullstack Platform)",
      description: "Architected an end-to-end fullstack platform consuming real-time streaming market data over WebSockets with 99.9% pipeline uptime. Engineered a PyTorch-based LSTM model analyzing sequential time-series patterns across 60-candle windows to serve predictive API endpoints.",
      techStack: ["React", "FastAPI", "PyTorch", "Node.js", "WebSockets"],
      github: "https://github.com/2411Aditya/Candlestick-predictor"
    },
    {
      title: "Intelligent Knowledge Assistant (RAG Pipeline)",
      description: "Built a Retrieval-Augmented Generation (RAG) system using LangChain and Vector Databases for semantic querying over private datasets. Integrated evaluation and observability metrics to monitor response relevance, decreasing hallucination rates by 30% across data queries.",
      techStack: ["LangChain", "Vector DB", "Node.js", "Python", "RAG Pipeline"],
      github: "https://github.com/2411Aditya/Intelligent-Knowledge-Assistant-RAG"
    }
  ];

  // Read existing resumeData.json to keep existing static references intact if needed
  let existingData = {};
  if (fs.existsSync(jsonPath)) {
    try {
      existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } catch (e) {}
  }

  const updatedData = {
    personalInfo: {
      firstName: "ADITYA",
      lastName: "KULKARNI",
      titleTag: "B.E. AI & DS '26",
      roles: [
        "AI & Data Science Engineer",
        "Fullstack Developer",
        "ML Specialist"
      ],
      bio: "Artificial Intelligence & Data Science engineer with hands-on experience building fullstack applications, scalable Node.js/Python backend services, and AI-native products. Proficient in React, REST APIs, relational databases (PostgreSQL/MySQL), and AWS cloud deployments.",
      whatsappUrl: "https://wa.me/917775815981",
      phone: "+91 7775815981",
      pdfFile: activePdf.name,
      pdfDownloadName: "Aditya_Kulkarni_Resume.pdf",
      socials: {
        github: "https://github.com/2411Aditya",
        linkedin: "https://www.linkedin.com/in/aditya-kulkarni-887474302?utm_source=share_via&utm_content=profile&utm_medium=member_android"
      }
    },
    about: {
      paragraphs: [
        "I am an Artificial Intelligence & Data Science engineer with hands-on experience building fullstack applications, scalable Node.js/Python backend services, and AI-native products.",
        "Proficient in React, REST APIs, relational databases (PostgreSQL/MySQL), and AWS cloud deployments. Driven by developing production-ready workflows, optimizing query performance, and building resilient systems."
      ],
      coreCompetencies: [
        "Fullstack Engineering",
        "AI-Native Engineering",
        "LLM Fine-tuning & RAG",
        "FastAPI & Node.js",
        "AWS (EC2, S3) & DevOps",
        "PostgreSQL & MySQL",
        "PyTorch & LSTM Models",
        "CI/CD GitHub Actions"
      ]
    },
    skills: skills.length > 0 ? skills : existingData.skills,
    projects: projects,
    experience: experience,
    education: education.length > 0 ? education : existingData.education,
    positionsOfResponsibility: [
      {
        title: "Treasurer",
        organization: "TEAM SANSKRITI",
        colorClass: "text-blue-400",
        description: "Oversaw financial planning, resource distribution, and budget allocation for major campus cultural events."
      },
      {
        title: "Management Team",
        organization: "TEAM DEVKRAFT",
        colorClass: "text-green-400",
        description: "Organized technical events for 500+ student participants, directing logistics and team execution."
      },
      {
        title: "Coding Member",
        organization: "TEAM AIRAWAT",
        colorClass: "text-purple-400",
        description: "Collaborated on embedded firmware development and data processing for an E-Bike design project."
      }
    ],
    certifications: [
      {
        name: "Supervised Machine Learning",
        status: "Certification",
        desc: "Certified by DeepLearning.AI"
      },
      {
        name: "Data Analytics Program",
        status: "Program",
        desc: "Completed program by Godrej"
      },
      {
        name: "Devclash 24 Hour Hackathon",
        status: "Co-Curricular",
        desc: "Participated in 24-hour intensive development hackathon."
      }
    ],
    contact: {
      subtitle: "What's Next?",
      title: "Let's Talk",
      message: "I'm always open to discussing new opportunities, AI projects, or software engineering collaborations. Hit me up."
    }
  };

  fs.writeFileSync(jsonPath, JSON.stringify(updatedData, null, 2), 'utf8');
  console.log("✅ Successfully extracted text from public/RESUME11.pdf and updated src/data/resumeData.json!");
}).catch(err => {
  console.error("❌ Error parsing RESUME11.pdf:", err);
});
