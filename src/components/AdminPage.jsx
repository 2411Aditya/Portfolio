/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure bundled pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const AdminPage = () => {
  const {
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    history,
    savePortfolioVersion,
    navigateTo,
    getPortfolioUrl,
    setDefaultVersion,
    deleteVersion,
    defaultResumeData
  } = usePortfolio();

  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('generator');

  // Generator form state (3 fields only)
  const [slugInput, setSlugInput] = useState(`resume${history.length + 1}`);
  const [jobTitleTag, setJobTitleTag] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [scanProgressStep, setScanProgressStep] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedSuccessUrl, setGeneratedSuccessUrl] = useState('');

  useEffect(() => {
    setSlugInput(`resume${history.length + 1}`);
  }, [history.length]);

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    const res = loginAdmin(password);
    if (!res.success) {
      setAuthError(res.error);
    } else {
      setPassword('');
    }
  };

  // Intelligent Text Normalizer for PDFs
  const normalizeExtractedText = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str
      // Fix broken words split by intra-word spaces (e.g. "clo u d" -> "cloud", "c l o u d" -> "cloud")
      .replace(/\bclo\s*u\s*d\b/gi, 'cloud')
      .replace(/\bc\s*l\s*o\s*u\s*d\b/gi, 'cloud')
      .replace(/\bd\s*a\s*t\s*a\b/gi, 'data')
      .replace(/\bA\s*W\s*S\b/g, 'AWS')
      .replace(/\bA\s*I\b/g, 'AI')
      .replace(/\bD\s*S\b/g, 'DS')
      .replace(/\bM\s*L\b/g, 'ML')
      .replace(/\bN\s*L\s*P\b/g, 'NLP')
      .replace(/\bL\s*L\s*M\s*s?\b/gi, 'LLMs')
      .replace(/\bR\s*A\s*G\b/g, 'RAG')
      .replace(/\bS\s*Q\s*L\b/g, 'SQL')
      .replace(/\bP\s*y\s*T\s*o\s*r\s*c\s*h\b/gi, 'PyTorch')
      .replace(/\bF\s*a\s*s\s*t\s*A\s*P\s*I\b/gi, 'FastAPI')
      .replace(/\bL\s*a\s*n\s*g\s*C\s*h\s*a\s*i\s*n\b/gi, 'LangChain')
      .replace(/\bP\s*o\s*s\s*t\s*m\s*a\s*n\b/gi, 'Postman')
      .replace(/\bM\s*y\s*S\s*Q\s*L\b/gi, 'MySQL')
      // Fix hyphenated compound words: "hands - on" -> "hands-on", "full - stack" -> "full-stack", "production - ready" -> "production-ready"
      .replace(/([a-zA-Z0-9]+)\s*[-–—]\s*([a-zA-Z0-9]+)/g, '$1-$2')
      // Fix spaces before punctuation (e.g. "deployments ," -> "deployments,")
      .replace(/\s+([,.:;?!%])/g, '$1')
      // Clean multiple spaces
      .replace(/[ \t]{2,}/g, ' ')
      .trim();
  };

  // PDF.js Line-by-Line Text Extractor with Glyph Kerning Awareness
  const extractPdfText = async (arrayBuffer) => {
    try {
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdfDoc = await loadingTask.promise;
      let fullText = '';

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        
        let lastY = null;
        let lastX = null;
        let lastWidth = null;
        const pageLines = [];
        let currentLine = '';

        for (const item of textContent.items) {
          const x = item.transform ? item.transform[4] : null;
          const y = item.transform ? Math.round(item.transform[5]) : null;
          const width = item.width || 0;

          if (lastY !== null && y !== null && Math.abs(y - lastY) > 3) {
            if (currentLine.trim()) {
              pageLines.push(normalizeExtractedText(currentLine));
            }
            currentLine = item.str;
          } else {
            if (lastX !== null && lastWidth !== null && x !== null) {
              const gap = x - (lastX + lastWidth);
              // Only insert space if gap between characters is significant (> 1.5px)
              if (gap > 1.5 && !currentLine.endsWith(' ') && !item.str.startsWith(' ')) {
                currentLine += ' ';
              }
            } else if (currentLine && !currentLine.endsWith(' ') && !item.str.startsWith(' ')) {
              currentLine += ' ';
            }
            currentLine += item.str;
          }
          if (y !== null) lastY = y;
          if (x !== null) lastX = x;
          lastWidth = width;
        }
        if (currentLine.trim()) {
          pageLines.push(normalizeExtractedText(currentLine));
        }

        fullText += pageLines.join('\n') + '\n';
      }
      return normalizeExtractedText(fullText);
    } catch (err) {
      console.error("PDF extraction error:", err);
      return '';
    }
  };

  // Intelligent Section-by-Section Resume Parser
  const parseResumeTextToStructure = (rawText, fileName = '', fileDataUrl = '') => {
    const base = JSON.parse(JSON.stringify(defaultResumeData));

    // Ensure First & Last name are clean (ADITYA KULKARNI) and no roles tags
    base.personalInfo.firstName = "ADITYA";
    base.personalInfo.lastName = "KULKARNI";
    delete base.personalInfo.roles;

    if (fileName) {
      base.personalInfo.pdfFile = fileName;
      base.personalInfo.pdfDownloadName = fileName;
    }
    if (fileDataUrl) {
      base.personalInfo.pdfDataUrl = fileDataUrl;
    }

    if (!rawText || rawText.trim().length === 0) {
      return base;
    }

    const text = rawText.replace(/\r\n/g, '\n');

    // Helper to find text block for a section
    const getSectionText = (headerRegex, nextHeaderRegex) => {
      const startMatch = text.match(headerRegex);
      if (!startMatch) return '';
      const startIndex = startMatch.index + startMatch[0].length;
      const sub = text.slice(startIndex);
      const endMatch = sub.match(nextHeaderRegex);
      if (endMatch) {
        return sub.slice(0, endMatch.index).trim();
      }
      return sub.trim();
    };

    const nextSectionPattern = /(?:\n\s*SUMMARY|\n\s*EDUCATION|\n\s*SKILLS|\n\s*EXPERIENCE|\n\s*PROJECTS|\n\s*CERTIFICATIONS|\n\s*LEADERSHIP|$)/i;

    // 1. Summary / Bio Parsing
    const summaryText = getSectionText(/(?:SUMMARY|PROFILE|OBJECTIVE|ABOUT ME)\b/i, nextSectionPattern);
    if (summaryText && summaryText.length > 15) {
      const bioStr = normalizeExtractedText(summaryText.replace(/\n/g, ' '));
      base.personalInfo.bio = bioStr;
      base.about.paragraphs = [bioStr];
    }

    // 2. Education Parsing (Always extracts all 3 education items cleanly)
    const eduText = getSectionText(/(?:EDUCATION|ACADEMIC BACKGROUND)\b/i, nextSectionPattern);
    const parsedEdu = [];
    const fullTextUpper = (eduText + ' ' + text).toUpperCase();

    // Check Degree 1: B.E. in AI & DS
    if (fullTextUpper.includes('PATIL') || fullTextUpper.includes('B.E.') || fullTextUpper.includes('ARTIFICIAL INTELLIGENCE') || fullTextUpper.includes('DEGREE')) {
      const cgpaMatch = text.match(/CGPA:?\s*([0-9\.\/ ]+)/i);
      parsedEdu.push({
        degree: "B.E. in AI & DS",
        institution: "Dr. D. Y. Patil Institute of Technology",
        score: cgpaMatch ? `CGPA: ${cgpaMatch[1].trim()}` : "CGPA: 6.99 / 10.00",
        year: "2022 – 2026"
      });
    }

    // Check Degree 2: 12th Grade
    if (fullTextUpper.includes('KABRA') || fullTextUpper.includes('12TH') || fullTextUpper.includes('MSBSHSE') || fullTextUpper.includes('JR COLLEGE')) {
      const perc12Match = text.match(/12th[\s\S]*?Percentage:?\s*([0-9\.\/% ]+)/i);
      parsedEdu.push({
        degree: "12th Grade",
        institution: "Late B G Kabra Jr College (MSBSHSE)",
        score: perc12Match ? `Percentage: ${perc12Match[1].trim()}` : "Percentage: 83.67 / 100.00",
        year: "2022"
      });
    }

    // Check Degree 3: 10th Grade
    if (fullTextUpper.includes('VIKAS') || fullTextUpper.includes('10TH') || fullTextUpper.includes('CBSE') || fullTextUpper.includes('INTERNATIONAL SCHOOL')) {
      const perc10Match = text.match(/10th[\s\S]*?Percentage:?\s*([0-9\.\/% ]+)/i);
      parsedEdu.push({
        degree: "10th Grade",
        institution: "Vidya Vikas International School (CBSE)",
        score: perc10Match ? `Percentage: ${perc10Match[1].trim()}` : "Percentage: 87.20 / 100.00",
        year: "2020"
      });
    }

    // Set education list (fallback to default 3 entries if empty)
    if (parsedEdu.length > 0) {
      base.education = parsedEdu;
    } else {
      base.education = defaultResumeData.education;
    }

    // 3. Skills Parsing (Matches distinct category cards)
    const skillText = getSectionText(/(?:SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES)\b/i, nextSectionPattern);
    if (skillText) {
      const sLines = skillText.split('\n').map(l => l.trim()).filter(Boolean);
      const parsedSkills = [];
      const coreComps = [];

      sLines.forEach(l => {
        if (l.includes(':')) {
          const parts = l.split(':');
          const cat = normalizeExtractedText(parts[0]);
          const val = normalizeExtractedText(parts.slice(1).join(':'));
          if (cat && val) {
            parsedSkills.push({ title: cat, skills: val });
            coreComps.push(cat);
          }
        }
      });

      if (parsedSkills.length > 0) {
        base.skills = parsedSkills;
        base.about.coreCompetencies = [
          ...coreComps,
          "AWS & Cloud Deployments",
          "REST API Architectures",
          "Process Automation"
        ];
      }
    }

    // 4. Experience Parsing (Preserves complete sentence highlights without missing words)
    const expText = getSectionText(/(?:EXPERIENCE|WORK HISTORY|EMPLOYMENT)\b/i, nextSectionPattern);
    if (expText) {
      const eLines = expText.split('\n').map(l => l.trim()).filter(Boolean);
      let company = "Parallel Learning";
      let role = "Software Intern";
      let period = "09/2025 – 01/2026";
      const highlights = [];

      let currentLabel = "";
      let currentText = "";

      eLines.forEach(l => {
        if (l.startsWith('•') || l.startsWith('-')) {
          if (currentLabel && currentText) {
            highlights.push({ label: currentLabel, text: currentText.trim() });
          }
          const clean = l.replace(/^[•\-]\s*/, '');
          if (clean.includes(':')) {
            const parts = clean.split(':');
            currentLabel = parts[0].trim() + ':';
            currentText = parts.slice(1).join(':').trim();
          } else {
            currentLabel = '•';
            currentText = clean;
          }
        } else if (currentLabel) {
          // Append continuation line to current bullet sentence
          currentText += ' ' + l;
        } else if (l.includes('Learning')) {
          company = "Parallel Learning";
        } else if (l.includes('Software') || l.includes('Intern')) {
          role = "Software Intern";
        } else if (l.match(/\d{4}/)) {
          period = "09/2025 – 01/2026";
        }
      });

      if (currentLabel && currentText) {
        highlights.push({ label: normalizeExtractedText(currentLabel), text: normalizeExtractedText(currentText) });
      }

      base.experience = [
        {
          company,
          role,
          period,
          highlights: highlights.length > 0 ? highlights : defaultResumeData.experience[0].highlights
        }
      ];
    }

    // 5. Dynamic Projects Parsing (Extracts ANY project present in the resume automatically)
    const projText = getSectionText(/(?:PROJECTS|KEY PROJECTS|ACADEMIC PROJECTS|PERSONAL PROJECTS)\b/i, nextSectionPattern);
    if (projText) {
      const lines = projText.split('\n').map(l => l.trim()).filter(Boolean);
      const parsedProjects = [];

      let currentProject = null;
      let currentBullets = [];

      const isMetaLine = (l) => {
        const lower = l.toLowerCase();
        return lower === 'personal project' || lower === 'sponsored project' || 
               lower === 'academic project' || lower === 'team project' || 
               lower === 'client project' || /^(19|20)\d{2}(\s*[-–—]\s*(19|20)\d{2}|(\s*present)?)?$/i.test(l);
      };

      const isBulletLine = (l) => {
        return /^([•\-*▪–—]|(\d+\.))\s*/.test(l);
      };

      const knownTechList = [
        "Python", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express",
        "FastAPI", "Flask", "Django", "PyTorch", "TensorFlow", "Keras", "Scikit-Learn",
        "Machine Learning", "Deep Learning", "NLP", "LLM", "LLMs", "RAG", "LangChain",
        "LlamaIndex", "SQL", "MySQL", "PostgreSQL", "SQLite", "MongoDB", "Redis",
        "REST APIs", "REST API", "GraphQL", "WebSockets", "Docker", "Kubernetes",
        "AWS", "GCP", "Azure", "GitHub Actions", "CI/CD", "Tailwind", "TailwindCSS",
        "C++", "Java", "Go", "Rust", "PHP", "HTML", "CSS", "Vite", "Pandas", "NumPy"
      ];

      const extractTechFromLine = (textLine) => {
        const foundTech = [];
        knownTechList.forEach(tech => {
          const regex = new RegExp(`\\b${tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
          if (regex.test(textLine)) {
            foundTech.push(tech);
          }
        });
        return foundTech;
      };

      const finalizeCurrentProject = () => {
        if (currentProject && currentProject.title) {
          const fullDesc = currentBullets.map(b => normalizeExtractedText(b)).join(' ').trim();
          currentProject.description = fullDesc || currentProject.description || "Developed software solution implementing optimized workflows and system architectures.";
          
          if (!currentProject.techStack || currentProject.techStack.length === 0) {
            const detected = extractTechFromLine(fullDesc);
            currentProject.techStack = detected.length > 0 ? detected.slice(0, 4) : ["Python", "Machine Learning", "REST APIs"];
          }

          if (!currentProject.github) {
            const cleanTitleSlug = currentProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            currentProject.github = `https://github.com/2411Aditya/${cleanTitleSlug}`;
          }

          parsedProjects.push(currentProject);
        }
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (isBulletLine(line)) {
          const cleanBullet = line.replace(/^([•\-*▪–—]|(\d+\.))\s*/, '');
          currentBullets.push(cleanBullet);
        } else if (isMetaLine(line)) {
          // Skip meta tags like "Personal Project 2026"
          continue;
        } else {
          // This line is a project title line!
          // Finalize previous project if exists
          finalizeCurrentProject();
          currentBullets = [];

          // Separate title and potential inline tech stack
          let title = line;
          let inlineTech = [];

          // Check if line contains a separator or tech list
          if (line.includes('|')) {
            const parts = line.split('|');
            title = parts[0].trim();
            inlineTech = extractTechFromLine(parts.slice(1).join(' '));
          } else if (line.includes('  ') || line.includes('\t')) {
            // Tab or large space separation (e.g. "Candlestick Predictor    PyTorch, FastAPI")
            const parts = line.split(/\s{2,}|\t/);
            title = parts[0].trim();
            inlineTech = extractTechFromLine(parts.slice(1).join(' '));
          } else {
            // Check if trailing words are known tech
            const detectedTech = extractTechFromLine(line);
            if (detectedTech.length > 0) {
              inlineTech = detectedTech;
            }
          }

          // Clean title (remove trailing commas, colons, or years)
          title = normalizeExtractedText(title.replace(/\s+(19|20)\d{2}$/, '').replace(/[:|,]+$/, '').trim());

          currentProject = {
            title: title || `Project ${parsedProjects.length + 1}`,
            description: "",
            techStack: inlineTech.length > 0 ? inlineTech : [],
            github: ""
          };
        }
      }

      // Finalize the last project in loop
      finalizeCurrentProject();

      if (parsedProjects.length > 0) {
        base.projects = parsedProjects;
      }
    }

    return base;
  };

  // Helper Delay for Scanner Animation Feedback
  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  // Generate Action with Full Scanning Workflow
  const handleGeneratePortfolio = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please upload a resume file (.pdf, .txt, or .json).');
      return;
    }

    const cleanSlug = (slugInput || `resume${history.length + 1}`).trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!cleanSlug) {
      alert('Please enter a valid link name (e.g. resume1, resume2).');
      return;
    }

    setIsProcessing(true);
    setGeneratedSuccessUrl('');

    // Step 1: Reading file
    setScanProgressStep('1/4: 📄 Reading uploaded file data...');
    await delay(500);

    // Read Data URL for download
    const dataUrlPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(selectedFile);
    });
    const fileDataUrl = await dataUrlPromise;

    // Step 2: Extracting text line by line
    setScanProgressStep('2/4: 🔍 Scanning PDF layout & line position streams via PDF.js...');
    await delay(700);

    let parsedPortfolioData = defaultResumeData;

    if (selectedFile.name.endsWith('.json')) {
      const textPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsText(selectedFile);
      });
      const jsonTextStr = await textPromise;
      try {
        parsedPortfolioData = JSON.parse(jsonTextStr);
        parsedPortfolioData.personalInfo = parsedPortfolioData.personalInfo || {};
        parsedPortfolioData.personalInfo.pdfDataUrl = fileDataUrl;
        parsedPortfolioData.personalInfo.pdfFile = selectedFile.name;
        parsedPortfolioData.personalInfo.firstName = "ADITYA";
        parsedPortfolioData.personalInfo.lastName = "KULKARNI";
        delete parsedPortfolioData.personalInfo.roles;
      } catch (err) {
        console.error("JSON parse error", err);
      }
    } else if (selectedFile.name.endsWith('.txt')) {
      const textPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsText(selectedFile);
      });
      const rawText = await textPromise;
      parsedPortfolioData = parseResumeTextToStructure(rawText, selectedFile.name, fileDataUrl);
    } else if (selectedFile.name.endsWith('.pdf')) {
      const bufferPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsArrayBuffer(selectedFile);
      });
      const buffer = await bufferPromise;
      const extractedText = await extractPdfText(buffer);
      parsedPortfolioData = parseResumeTextToStructure(extractedText, selectedFile.name, fileDataUrl);
    }

    // Step 3: Mapping JSON Schema
    setScanProgressStep('3/4: 🧠 Structuring Skills, Projects, Experience & Education...');
    await delay(700);

    // Step 4: Storing JSON & Creating Link
    setScanProgressStep('4/4: 💾 Saving JSON structure to history & activating link...');
    await delay(500);

    const created = await savePortfolioVersion(
      parsedPortfolioData,
      jobTitleTag.trim() || `Portfolio (${cleanSlug})`,
      cleanSlug,
      selectedFile.name
    );

    const fullUrl = getPortfolioUrl(created.slug);
    setGeneratedSuccessUrl(fullUrl);
    setIsProcessing(false);
    setScanProgressStep('');
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-[#181818] border-b border-white/10 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#e50914]/20 border border-[#e50914]/40 flex items-center justify-center text-[#e50914] font-bold text-sm">
            ⚙️
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">Portfolio Admin Panel</h1>
            <p className="text-[11px] sm:text-xs text-white/50">Generate & Manage Custom Resume Portfolio Links</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
          <button
            onClick={() => navigateTo('/')}
            className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition"
          >
            ← Public Website
          </button>
          {isAdminLoggedIn && (
            <button
              onClick={logoutAdmin}
              className="text-xs bg-[#e50914]/20 hover:bg-[#e50914] text-[#e50914] hover:text-white border border-[#e50914]/40 px-3 py-2 rounded-lg transition font-semibold"
            >
              Logout
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-6 md:p-8">
        {!isAdminLoggedIn ? (
          /* LOGIN FORM */
          <div className="max-w-md mx-auto my-8 sm:my-16 bg-[#181818] border border-white/10 rounded-xl p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold mb-2">Admin Login</h2>
              <p className="text-xs text-white/60">Enter password to manage portfolio links.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-2 font-bold">Admin Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  className="w-full bg-[#222] border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#e50914]"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="bg-red-500/20 border border-red-500/40 text-red-300 text-xs px-3 py-2 rounded-lg">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#e50914] hover:bg-[#b20710] text-white font-extrabold py-3 rounded-lg text-sm tracking-wider uppercase transition shadow-lg"
              >
                Unlock Admin Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* DASHBOARD */
          <div className="bg-[#181818] border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col">
            {/* Tabs Header */}
            <div className="flex border-b border-white/10 bg-[#141414] px-3 sm:px-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('generator')}
                className={`py-3.5 sm:py-4 px-3 sm:px-6 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
                  activeTab === 'generator'
                    ? 'border-[#e50914] text-[#e50914]'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                ⚡ Create New Link
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-3.5 sm:py-4 px-3 sm:px-6 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'history'
                    ? 'border-[#e50914] text-[#e50914]'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                🔗 Active Links
                <span className="bg-[#e50914]/20 text-[#e50914] text-[10px] px-2 py-0.5 rounded-full font-black">
                  {history.length}
                </span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-4 sm:p-6 md:p-8 space-y-6">
              {activeTab === 'generator' ? (
                <form onSubmit={handleGeneratePortfolio} className="space-y-4 sm:space-y-6">
                  
                  {/* Scanning Progress Banner */}
                  {isProcessing && (
                    <div className="bg-[#e50914]/15 border border-[#e50914]/40 p-4 sm:p-5 rounded-xl space-y-2.5 animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-t-transparent border-[#e50914] rounded-full animate-spin"></div>
                        <span className="text-[#e50914] font-extrabold text-xs sm:text-sm uppercase tracking-wider">
                          Scanning & Generating Resume Link...
                        </span>
                      </div>
                      <p className="text-xs font-mono text-white/80 pl-8">
                        {scanProgressStep}
                      </p>
                    </div>
                  )}

                  {/* Generated Success Alert */}
                  {generatedSuccessUrl && !isProcessing && (
                    <div className="bg-emerald-500/15 border border-emerald-500/40 p-4 sm:p-5 rounded-xl space-y-3 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-400 font-extrabold text-xs sm:text-sm flex items-center gap-1.5">
                          <span>🎉</span> Link Generated Successfully!
                        </span>
                        <button
                          type="button"
                          onClick={() => setGeneratedSuccessUrl('')}
                          className="text-white/50 hover:text-white text-xs p-1"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-black/50 p-2.5 sm:p-3 rounded-lg border border-white/10">
                        <input
                          type="text"
                          readOnly
                          value={generatedSuccessUrl}
                          className="bg-transparent text-xs font-mono text-emerald-300 font-bold flex-1 outline-none select-all p-1"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(generatedSuccessUrl);
                              alert(`Copied link to clipboard:\n${generatedSuccessUrl}`);
                            }}
                            className="flex-1 sm:flex-none bg-emerald-500 text-black font-extrabold text-xs px-3 sm:px-4 py-2 rounded-lg hover:bg-emerald-400 transition"
                          >
                            Copy Link
                          </button>
                          <button
                            type="button"
                            onClick={() => navigateTo(slugInput)}
                            className="flex-1 sm:flex-none bg-white/20 text-white font-extrabold text-xs px-3 sm:px-4 py-2 rounded-lg hover:bg-white/30 transition text-center"
                          >
                            Preview ↗
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Field 1 & 2: Route Slug & Target Label */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-[#202020] p-4 sm:p-6 rounded-xl border border-white/5">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#e50914] mb-2">
                        1. Custom Link Name (URL Slug) *
                      </label>
                      <div className="flex items-center bg-[#141414] border border-white/15 rounded-lg px-3 py-2.5 text-xs font-mono text-white/70 focus-within:border-[#e50914]">
                        <span className="text-white/40 select-none">/Portfolio/</span>
                        <input
                          type="text"
                          value={slugInput}
                          onChange={(e) => setSlugInput(e.target.value)}
                          placeholder="resume1"
                          className="bg-transparent text-white font-bold outline-none flex-1 font-mono"
                          required
                        />
                      </div>
                      <span className="text-[11px] text-white/40 mt-1.5 block break-all">
                        Link: <strong className="text-white">{window.location.origin}/Portfolio/{(slugInput || 'resume1').trim()}</strong>
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#e50914] mb-2">
                        2. Target Application Label (Optional)
                      </label>
                      <input
                        type="text"
                        value={jobTitleTag}
                        onChange={(e) => setJobTitleTag(e.target.value)}
                        placeholder="e.g. Google - Software Engineer"
                        className="w-full bg-[#141414] border border-white/15 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#e50914]"
                      />
                      <span className="text-[11px] text-white/40 mt-1.5 block">
                        Reference label for history management.
                      </span>
                    </div>
                  </div>

                  {/* Field 3: Upload Resume File */}
                  <div className="bg-[#202020] p-4 sm:p-6 rounded-xl border border-white/5">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#e50914] mb-2">
                      3. Upload Resume File (PDF / TXT / JSON) *
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.txt,.json"
                      onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                      className="w-full text-xs text-white/70 file:mr-3 file:py-2.5 file:px-3 sm:file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#e50914] file:text-white hover:file:bg-[#b20710] cursor-pointer"
                      required
                    />
                    {selectedFile && (
                      <p className="text-xs text-emerald-400 mt-2.5 font-medium">
                        Selected file: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </p>
                    )}
                  </div>

                  {/* Generate Button */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isProcessing || !selectedFile}
                      className="w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-[#e50914] hover:bg-[#b20710] disabled:bg-white/20 text-xs font-extrabold uppercase tracking-wider rounded-lg text-white shadow-xl transition text-center"
                    >
                      {isProcessing ? '⏳ Scanning Resume...' : `🚀 Scan & Generate Link: /Portfolio/${(slugInput || 'resume1').trim()}`}
                    </button>
                  </div>
                </form>
              ) : (
                /* HISTORY TAB */
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
                    <div>
                      <h3 className="text-sm sm:text-base font-extrabold text-white">Active Generated Resume Links</h3>
                      <p className="text-[11px] sm:text-xs text-white/50">All links below are active concurrently and can be shared with recruiters.</p>
                    </div>
                    <button
                      onClick={() => {
                        setSlugInput(`resume${history.length + 1}`);
                        setActiveTab('generator');
                      }}
                      className="bg-[#e50914] hover:bg-[#b20710] text-white text-xs font-bold px-3 py-2 rounded-lg transition self-stretch sm:self-auto text-center"
                    >
                      + Create New Link
                    </button>
                  </div>

                  {history.length === 0 ? (
                    <div className="text-center py-12 sm:py-16 bg-[#202020] rounded-xl border border-white/5 p-4">
                      <p className="text-sm text-white/60 mb-3">No active resume links generated yet.</p>
                      <button
                        onClick={() => setActiveTab('generator')}
                        className="text-xs bg-[#e50914] text-white font-bold px-4 py-2 rounded-lg hover:bg-[#b20710] transition"
                      >
                        + Create Your First Link
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {history.map((item) => {
                        const linkUrl = getPortfolioUrl(item.slug || item.id);

                        return (
                          <div
                            key={item.id}
                            className="bg-[#202020] border border-white/5 hover:border-white/20 p-4 sm:p-5 rounded-xl transition flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md"
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="bg-[#e50914]/20 border border-[#e50914]/40 text-[#e50914] font-mono text-xs px-2.5 py-0.5 rounded-md font-bold">
                                  /Portfolio/{item.slug || item.id}
                                </span>
                                <h4 className="font-bold text-xs sm:text-sm text-white">{item.name}</h4>
                              </div>

                              <p className="text-xs font-mono text-emerald-400 select-all break-all">
                                {linkUrl}
                              </p>

                              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-white/40">
                                <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                                <span>• File: {item.pdfFileName}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(linkUrl);
                                  alert(`Copied link to clipboard:\n${linkUrl}`);
                                }}
                                className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 px-3 py-1.5 sm:py-2 rounded-lg font-bold transition flex items-center gap-1.5 flex-1 sm:flex-none justify-center"
                              >
                                🔗 Copy Link
                              </button>

                              <button
                                onClick={() => navigateTo(item.slug || item.id)}
                                className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 sm:py-2 rounded-lg font-semibold transition flex-1 sm:flex-none justify-center text-center"
                              >
                                👁️ Preview
                              </button>

                              <button
                                onClick={() => {
                                  setDefaultVersion(item.id);
                                  alert(`"/Portfolio/${item.slug || item.id}" set as default for root /Portfolio/ path.`);
                                }}
                                className="text-xs bg-[#e50914]/20 hover:bg-[#e50914] text-[#e50914] hover:text-white border border-[#e50914]/40 px-3 py-1.5 sm:py-2 rounded-lg font-semibold transition flex-1 sm:flex-none justify-center text-center"
                              >
                                ⭐ Make Default
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Delete active link "/Portfolio/${item.slug || item.id}"?`)) {
                                    deleteVersion(item.id);
                                  }
                                }}
                                className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition"
                                title="Delete link"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
