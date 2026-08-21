// Shared text cleaner to normalize PDF text anomalies (kerning spaces, split words, weird hyphens)
export const cleanText = (str) => {
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
    // Fix hyphenated compound words: "hands - on" -> "hands-on", "full - stack" -> "full-stack", "production - ready" -> "production-ready", "high - velocity" -> "high-velocity", "enterprise - grade" -> "enterprise-grade", "AI - First" -> "AI-First", "AI - Native" -> "AI-Native"
    .replace(/([a-zA-Z0-9]+)\s*[-–—]\s*([a-zA-Z0-9]+)/g, '$1-$2')
    // Fix spaces before punctuation (e.g. "deployments ," -> "deployments,")
    .replace(/\s+([,.:;?!%])/g, '$1')
    // Clean multiple spaces
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
};

export default cleanText;
