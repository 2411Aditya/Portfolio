// Portfolio Admin Backend Server
// Stores resume portfolio versions as JSON files on disk so all browsers/devices can access them
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Use Render's persistent disk path in production, local path in dev
const DATA_DIR = process.env.NODE_ENV === 'production'
  ? '/opt/render/project/src/portfolio-data'
  : path.join(__dirname, 'portfolio-data');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');


// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure history file exists
if (!fs.existsSync(HISTORY_FILE)) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify([], null, 2));
}

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Large limit for PDF data URLs

// Helper: Read history
const readHistory = () => {
  try {
    const raw = fs.readFileSync(HISTORY_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

// Helper: Write history
const writeHistory = (history) => {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
};

// GET /api/portfolio/history - Get all saved portfolio versions
app.get('/api/portfolio/history', (req, res) => {
  const history = readHistory();
  res.json({ success: true, history });
});

// GET /api/portfolio/:slug - Get portfolio data for a specific slug
app.get('/api/portfolio/:slug', (req, res) => {
  const { slug } = req.params;
  const history = readHistory();
  const found = history.find(item => 
    item.slug?.toLowerCase() === slug.toLowerCase() || item.id === slug
  );
  if (found) {
    res.json({ success: true, portfolio: found });
  } else {
    res.status(404).json({ success: false, error: 'Portfolio not found' });
  }
});

// POST /api/portfolio/save - Save a new portfolio version
app.post('/api/portfolio/save', (req, res) => {
  try {
    const { portfolioData, name, slug, pdfFileName } = req.body;
    
    if (!portfolioData || !slug) {
      return res.status(400).json({ success: false, error: 'Missing portfolioData or slug' });
    }

    const newId = 'port_' + Date.now();
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');

    const newVersion = {
      id: newId,
      slug: cleanSlug,
      name: name || `Portfolio (${cleanSlug})`,
      createdAt: new Date().toISOString(),
      pdfFileName: pdfFileName || 'Resume.pdf',
      data: portfolioData
    };

    // Replace existing matching slug, add new at front
    const history = readHistory();
    const filtered = history.filter(item => item.slug?.toLowerCase() !== cleanSlug);
    const updatedHistory = [newVersion, ...filtered];
    writeHistory(updatedHistory);

    res.json({ success: true, version: newVersion });
  } catch (e) {
    console.error('Save error:', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// DELETE /api/portfolio/:id - Delete a portfolio version
app.delete('/api/portfolio/:id', (req, res) => {
  const { id } = req.params;
  const history = readHistory();
  const updated = history.filter(item => item.id !== id);
  writeHistory(updated);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Portfolio Backend running at http://localhost:${PORT}`);
  console.log(`📁 Data stored at: ${DATA_DIR}`);
  console.log(`📋 History file: ${HISTORY_FILE}\n`);
});
