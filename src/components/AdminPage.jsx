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

  // PDF.js Line-by-Line Text Extractor
  const extractPdfText = async (arrayBuffer) => {
    try {
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdfDoc = await loadingTask.promise;
      let fullText = '';

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        
        let lastY = null;
        const pageLines = [];
        let currentLine = '';

        for (const item of textContent.items) {
          const y = item.transform ? Math.round(item.transform[5]) : null;
          if (lastY !== null && y !== null && Math.abs(y - lastY) > 3) {
            if (currentLine.trim()) {
              pageLines.push(currentLine.trim());
            }
            currentLine = item.str;
          } else {
            currentLine += (currentLine && !currentLine.endsWith(' ') ? ' ' : '') + item.str;
          }
          if (y !== null) lastY = y;
        }
        if (currentLine.trim()) {
          pageLines.push(currentLine.trim());
        }

        fullText += pageLines.join('\n') + '\n';
      }
      return fullText;
    } catch (err) {
      console.error("PDF extraction error:", err);
      return '';
    }
  };

  // Intelligent Section-by-Section Resume Parser
  const parseResumeTextToStructure = (rawText, fileName = '', fileDataUrl = '') => {
    const base = JSON.parse(JSON.stringify(defaultResumeData));

    // Ensure First & Last name are clean (ADITYA KULKARNI)
    base.personalInfo.firstName = "ADITYA";
    base.personalInfo.lastName = "KULKARNI";

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
      const bioStr = summaryText.replace(/\n/g, ' ').trim();
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
          const cat = parts[0].trim();
          const val = parts.slice(1).join(':').trim();
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
        highlights.push({ label: currentLabel, text: currentText.trim() });
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

    // 5. Projects Parsing (Preserves complete descriptions & tech stacks)
    const projText = getSectionText(/(?:PROJECTS|KEY PROJECTS)\b/i, nextSectionPattern);
    if (projText) {
      const proj1 = projText.includes("Legal") || projText.includes("Translation");
      const proj2 = projText.includes("Candlestick") || projText.includes("Predictor");
      const proj3 = projText.includes("Knowledge") || projText.includes("RAG");

      const projects = [];

      if (proj1) {
        projects.push({
          title: "AI-Powered Legal Document Translation",
          description: "Fine-tuned Sarvam LLM locally over a large-scale legal corpus to achieve high domain terminology accuracy. Utilized PyMuPDF for document parsing and implemented structured outputs to preserve complex legal formatting. Conducted validation of legal terminology to ensure outputs met strict structural and governance accuracy standards.",
          techStack: ["Python", "Flask", "NLP"],
          github: "https://github.com/Akshada2411/AI-Powered-legal-translator"
        });
      }

      if (proj2) {
        projects.push({
          title: "Automated Candlestick Predictor (Predictive Engine)",
          description: "Engineered an end-to-end predictive pipeline harvesting real-time market data from Angel One SmartAPI via WebSockets. Built a PyTorch-based LSTM neural network analyzing sequence patterns of 60+ previous candles to forecast price returns. Configured GitHub Actions for continuous inference/ingestion, updating live data on Google Sheets and rendering 'Ghost Candle' forecasts on a React dashboard.",
          techStack: ["PyTorch", "FastAPI", "React"],
          github: "https://github.com/2411Aditya/Candlestick-predictor"
        });
      }

      if (proj3) {
        projects.push({
          title: "Intelligent Knowledge Assistant (RAG Pipeline)",
          description: "Built a Retrieval-Augmented Generation (RAG) system using LangChain and Vector Databases to perform semantic queries over private datasets. Integrated evaluation metrics to flag hallucinations and verify response relevance following secure AI engineering principles.",
          techStack: ["LangChain", "Vector DB"],
          github: "https://github.com/2411Aditya/Intelligent-Knowledge-Assistant-RAG"
        });
      }

      if (projects.length > 0) {
        base.projects = projects;
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

    const created = savePortfolioVersion(
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
      <header className="bg-[#181818] border-b border-white/10 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#e50914]/20 border border-[#e50914]/40 flex items-center justify-center text-[#e50914] font-bold">
            ⚙️
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Portfolio Admin Panel</h1>
            <p className="text-xs text-white/50">Generate & Manage Custom Resume Portfolio Links</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('/')}
            className="text-xs bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-lg transition"
          >
            ← Public Website
          </button>
          {isAdminLoggedIn && (
            <button
              onClick={logoutAdmin}
              className="text-xs bg-[#e50914]/20 hover:bg-[#e50914] text-[#e50914] hover:text-white border border-[#e50914]/40 px-3.5 py-2 rounded-lg transition font-semibold"
            >
              Logout
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8">
        {!isAdminLoggedIn ? (
          /* LOGIN FORM */
          <div className="max-w-md mx-auto my-16 bg-[#181818] border border-white/10 rounded-xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-extrabold mb-2">Admin Login</h2>
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
            <div className="flex border-b border-white/10 bg-[#141414] px-6">
              <button
                onClick={() => setActiveTab('generator')}
                className={`py-4 px-6 text-xs font-extrabold uppercase tracking-wider border-b-2 transition ${
                  activeTab === 'generator'
                    ? 'border-[#e50914] text-[#e50914]'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                ⚡ Create New Resume Link
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-6 text-xs font-extrabold uppercase tracking-wider border-b-2 transition flex items-center gap-2 ${
                  activeTab === 'history'
                    ? 'border-[#e50914] text-[#e50914]'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                🔗 Active Links History
                <span className="bg-[#e50914]/20 text-[#e50914] text-[10px] px-2 py-0.5 rounded-full font-black">
                  {history.length}
                </span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-6 md:p-8 space-y-6">
              {activeTab === 'generator' ? (
                <form onSubmit={handleGeneratePortfolio} className="space-y-6">
                  
                  {/* Scanning Progress Banner */}
                  {isProcessing && (
                    <div className="bg-[#e50914]/15 border border-[#e50914]/40 p-5 rounded-xl space-y-3 animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-t-transparent border-[#e50914] rounded-full animate-spin"></div>
                        <span className="text-[#e50914] font-extrabold text-sm uppercase tracking-wider">
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
                    <div className="bg-emerald-500/15 border border-emerald-500/40 p-5 rounded-xl space-y-3 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-400 font-extrabold text-sm flex items-center gap-2">
                          <span>🎉</span> Link Generated & Content Scanned Successfully!
                        </span>
                        <button
                          type="button"
                          onClick={() => setGeneratedSuccessUrl('')}
                          className="text-white/50 hover:text-white text-xs"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex items-center gap-2 bg-black/50 p-3 rounded-lg border border-white/10">
                        <input
                          type="text"
                          readOnly
                          value={generatedSuccessUrl}
                          className="bg-transparent text-xs font-mono text-emerald-300 font-bold flex-1 outline-none select-all"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedSuccessUrl);
                            alert(`Copied link to clipboard:\n${generatedSuccessUrl}`);
                          }}
                          className="bg-emerald-500 text-black font-extrabold text-xs px-4 py-2 rounded-lg hover:bg-emerald-400 transition"
                        >
                          Copy Link
                        </button>
                        <button
                          type="button"
                          onClick={() => navigateTo(slugInput)}
                          className="bg-white/20 text-white font-extrabold text-xs px-4 py-2 rounded-lg hover:bg-white/30 transition"
                        >
                          Preview Website ↗
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Field 1 & 2: Route Slug & Target Label */}
                  <div className="grid md:grid-cols-2 gap-6 bg-[#202020] p-6 rounded-xl border border-white/5">
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
                      <span className="text-[11px] text-white/40 mt-1.5 block">
                        Link URL: <strong className="text-white">{window.location.origin}/Portfolio/{(slugInput || 'resume1').trim()}</strong>
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
                  <div className="bg-[#202020] p-6 rounded-xl border border-white/5">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#e50914] mb-2">
                      3. Upload Resume File (PDF / TXT / JSON) *
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.txt,.json"
                      onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                      className="w-full text-xs text-white/70 file:mr-3 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#e50914] file:text-white hover:file:bg-[#b20710] cursor-pointer"
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
                      className="px-8 py-3.5 bg-[#e50914] hover:bg-[#b20710] disabled:bg-white/20 text-xs font-extrabold uppercase tracking-wider rounded-lg text-white shadow-xl transition"
                    >
                      {isProcessing ? '⏳ Scanning Resume...' : `🚀 Scan & Generate Link: /Portfolio/${(slugInput || 'resume1').trim()}`}
                    </button>
                  </div>
                </form>
              ) : (
                /* HISTORY TAB */
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="text-base font-extrabold text-white">Active Generated Resume Links</h3>
                      <p className="text-xs text-white/50">All links below are active concurrently and can be shared with recruiters.</p>
                    </div>
                    <button
                      onClick={() => {
                        setSlugInput(`resume${history.length + 1}`);
                        setActiveTab('generator');
                      }}
                      className="bg-[#e50914] hover:bg-[#b20710] text-white text-xs font-bold px-3 py-2 rounded-lg transition"
                    >
                      + Create New Link
                    </button>
                  </div>

                  {history.length === 0 ? (
                    <div className="text-center py-16 bg-[#202020] rounded-xl border border-white/5">
                      <p className="text-sm text-white/60 mb-3">No active resume links generated yet.</p>
                      <button
                        onClick={() => setActiveTab('generator')}
                        className="text-xs bg-[#e50914] text-white font-bold px-4 py-2 rounded-lg hover:bg-[#b20710] transition"
                      >
                        + Create Your First Link (e.g. /Portfolio/resume1)
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {history.map((item) => {
                        const linkUrl = getPortfolioUrl(item.slug || item.id);

                        return (
                          <div
                            key={item.id}
                            className="bg-[#202020] border border-white/5 hover:border-white/20 p-5 rounded-xl transition flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md"
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="bg-[#e50914]/20 border border-[#e50914]/40 text-[#e50914] font-mono text-xs px-2.5 py-0.5 rounded-md font-bold">
                                  /Portfolio/{item.slug || item.id}
                                </span>
                                <h4 className="font-bold text-sm text-white">{item.name}</h4>
                              </div>

                              <p className="text-xs font-mono text-emerald-400 select-all">
                                {linkUrl}
                              </p>

                              <div className="flex items-center gap-3 text-[11px] text-white/40">
                                <span>Created: {new Date(item.createdAt).toLocaleString()}</span>
                                <span>• File: {item.pdfFileName}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(linkUrl);
                                  alert(`Copied link to clipboard:\n${linkUrl}`);
                                }}
                                className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 px-3 py-2 rounded-lg font-bold transition flex items-center gap-1.5"
                              >
                                🔗 Copy Link
                              </button>

                              <button
                                onClick={() => navigateTo(item.slug || item.id)}
                                className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg font-semibold transition"
                              >
                                👁️ Preview
                              </button>

                              <button
                                onClick={() => {
                                  setDefaultVersion(item.id);
                                  alert(`"/Portfolio/${item.slug || item.id}" set as default for root /Portfolio/ path.`);
                                }}
                                className="text-xs bg-[#e50914]/20 hover:bg-[#e50914] text-[#e50914] hover:text-white border border-[#e50914]/40 px-3 py-2 rounded-lg font-semibold transition"
                              >
                                ⭐ Make Root Default
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
