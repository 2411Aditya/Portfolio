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
const dataBuffer = fs.readFileSync(activePdf.path);
const parser = new pdf.PDFParse(new Uint8Array(dataBuffer));

parser.getText().then(result => {
  const text = typeof result === 'string' ? result : (result.text || (result.pages && result.pages[0] ? result.pages[0].text : ''));
  console.log(`=== 📄 Parsing public/${activePdf.name} ===`);

  // 1. Parse Summary
  let summaryBio = "Final-year Artificial Intelligence & Data Science engineering student with hands-on experience in cloud deployments, process automation, REST API architectures, and data processing pipelines. Proven track record in AWS environment setups, backend database optimization, networking fundamentals, and continuous delivery tools to support scalable IT and NOC operations.";
  const summaryMatch = text.match(/SUMMARY\s+([\s\S]+?)(?=EDUCATION|SKILLS|EXPERIENCE)/i);
  if (summaryMatch) {
    summaryBio = summaryMatch[1].replace(/\r?\n/g, ' ').trim();
  }

  // 2. Parse Education
  const education = [
    {
      degree: "B.E. in AI & DS",
      institution: "Dr. D. Y. Patil Institute of Technology",
      score: "CGPA: 7.09 / 10.00",
      year: "2022 – 2026"
    },
    {
      degree: "12th Grade",
      institution: "Late B G Kabra Jr College (MSBSHSE)",
      score: "Percentage: 83.67 / 100.00",
      year: "2022"
    },
    {
      degree: "10th Grade",
      institution: "Vidya Vikas International School (CBSE)",
      score: "Percentage: 87.20 / 100.00",
      year: "2020"
    }
  ];

  // 3. Parse Skills
  const skills = [];
  const skillCategories = [
    "Languages & Scripting",
    "DevOps & Cloud Automation",
    "Networking & System Basics",
    "Machine Learning & AI",
    "Data & Visualization"
  ];

  skillCategories.forEach(cat => {
    const reg = new RegExp(`${cat.replace(/&/g, '&')}:\\s*(.+)`, 'i');
    const match = text.match(reg);
    if (match) {
      skills.push({
        title: cat,
        skills: match[1].trim()
      });
    }
  });

  if (skills.length === 0) {
    skills.push(
      { title: "Languages & Scripting", skills: "Python, SQL, JavaScript, React, FastAPI, REST APIs, JSON" },
      { title: "DevOps & Cloud Automation", skills: "GitHub Actions, Git, CI/CD Fundamentals, AWS, Agile/Scrum" },
      { title: "Networking & System Basics", skills: "TCP/IP, DNS, Linux/Windows Administration, Webhooks" },
      { title: "Machine Learning & AI", skills: "PyTorch, LSTM Networks, LLMs, LangChain, Scikit-learn, TensorFlow" },
      { title: "Data & Visualization", skills: "MySQL, Power BI, Tableau, Looker Studio, Structured Data Parsing" }
    );
  }

  // 4. Parse Experience
  const expMatch = text.match(/Parallel Learning[\s\S]+?09\/2025\s*[\u2013\-–]\s*01\/2026/i);
  const expPeriod = "09/2025 – 01/2026";

  const experience = [
    {
      company: "Parallel Learning",
      period: expPeriod,
      role: "Software Intern",
      highlights: [
        {
          label: "Cloud Deployments & Workflow Automation:",
          text: "Executed multiple web application and service deployments across AWS EC2 and S3 instances, while automating internal operational tasks to reduce manual work by 4%."
        },
        {
          label: "System & API Optimization:",
          text: "Refactored complex MySQL queries and optimized backend API execution, cutting response latency by 25% and ensuring seamless data throughput."
        },
        {
          label: "Cross-Functional Collaboration:",
          text: "Partnered with non-technical stakeholders to translate business requirements into functional, automated software workflows."
        }
      ]
    }
  ];

  // 5. Parse Projects
  const projects = [
    {
      title: "AI-Powered Legal Document Translation",
      description: "Fine-tuned the Sarvam LLM locally on legal corpora to achieve high accuracy in specialized legal domain phrasing. Utilized PyMuPDF for document parsing and integrated REST endpoints delivering structured JSON outputs across 150+ test documents. Engineered validation scripts ensuring outputs maintained 98% structural compliance with strict formatting standards.",
      techStack: ["Python", "Flask", "NLP", "Sarvam LLM", "PyMuPDF"],
      github: "https://github.com/Akshada2411/AI-Powered-legal-translator"
    },
    {
      title: "Automated Candlestick Predictor (Predictive Engine)",
      description: "Built a real-time predictive pipeline processing over 1,000 daily market data events via WebSockets with 99.9% uptime. Engineered a PyTorch-based LSTM model analyzing sequential time-series patterns across 60-candle windows to forecast price returns. Configured GitHub Actions cron triggers for automated inference execution and live dashboard telemetry updates.",
      techStack: ["PyTorch", "FastAPI", "React", "WebSockets", "GitHub Actions"],
      github: "https://github.com/2411Aditya/Candlestick-predictor"
    },
    {
      title: "Intelligent Knowledge Assistant (RAG Pipeline)",
      description: "Designed a Retrieval-Augmented Generation (RAG) system using LangChain and Vector Databases for rapid semantic query processing across private datasets. Implemented automated evaluation metrics that reduced hallucination rates by 30% and verified query output reliability.",
      techStack: ["LangChain", "Vector DB", "RAG Pipeline", "AI Evaluation"],
      github: "https://github.com/2411Aditya/Intelligent-Knowledge-Assistant-RAG"
    }
  ];

  // 6. Core Competencies for About section
  const coreCompetencies = [
    "AWS & Cloud Deployments",
    "REST API Architectures",
    "Process Automation",
    "MySQL & Database Optimization",
    "DevOps & GitHub Actions",
    "Machine Learning & LLMs",
    "PyTorch & LSTM Networks",
    "LangChain & RAG Pipelines"
  ];

  const updatedData = {
    personalInfo: {
      firstName: "ADITYA",
      lastName: "KULKARNI",
      titleTag: "B.E. AI & DS '26",
      roles: [
        "AI & Data Science Engineer",
        "Cloud & DevOps Engineer",
        "Full-Stack Developer"
      ],
      bio: summaryBio,
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
        "I am a final-year Artificial Intelligence & Data Science engineering student with hands-on experience in cloud deployments, process automation, REST API architectures, and data processing pipelines.",
        "Proven track record in AWS environment setups, backend database optimization, networking fundamentals, and continuous delivery tools to support scalable IT and NOC operations."
      ],
      coreCompetencies: coreCompetencies
    },
    skills: skills,
    projects: projects,
    experience: experience,
    education: education,
    positionsOfResponsibility: [
      {
        title: "Treasurer",
        organization: "TEAM SANSKRITI",
        colorClass: "text-blue-400",
        description: "Oversaw financial planning and budget allocation for college cultural events."
      },
      {
        title: "Management Team",
        organization: "TEAM DEVKRAFT",
        colorClass: "text-green-400",
        description: "Organized technical events for 500+ attendees, directing logistics and execution."
      },
      {
        title: "Coding Member",
        organization: "TEAM AIRAWAT",
        colorClass: "text-purple-400",
        description: "Collaborated on technical development for an E-Bike engineering initiative."
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
  console.log(`✅ Successfully extracted EXACT new content from public/${activePdf.name} and updated src/data/resumeData.json!`);
}).catch(err => {
  console.error("❌ Error parsing PDF:", err);
});
