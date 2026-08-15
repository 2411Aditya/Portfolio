import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import defaultResumeData from '../data/resumeData.json';

const PortfolioContext = createContext();

const AUTH_KEY = 'portfolio_admin_auth';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/portfolio';


// Helper to extract path slug from URL
const parseCurrentRoute = (savedHistory) => {
  const pathname = window.location.pathname || '';
  const hash = window.location.hash || '';

  let pathSegment = '';

  if (hash.startsWith('#/')) {
    pathSegment = hash.replace('#/', '').trim();
  } else {
    pathSegment = pathname.replace(/^\/Portfolio\/?/i, '').replace(/^\//, '').trim();
  }

  pathSegment = pathSegment.replace(/\/$/, '');

  const isRouteAdmin = pathSegment.toLowerCase() === 'admin';

  if (isRouteAdmin) {
    return {
      isAdminRoute: true,
      isNotFound: false,
      currentSlug: 'admin',
      activeVersionId: null,
      currentPortfolio: defaultResumeData,
      activeVersionMeta: null
    };
  }

  if (pathSegment && pathSegment !== 'index.html') {
    const found = savedHistory.find(
      (item) => item.slug?.toLowerCase() === pathSegment.toLowerCase() || item.id === pathSegment
    );
    if (found) {
      return {
        isAdminRoute: false,
        isNotFound: false,
        currentSlug: pathSegment,
        activeVersionId: found.id,
        currentPortfolio: found.data,
        activeVersionMeta: found
      };
    }
    // Slug was specified but not found in history → 404
    return {
      isAdminRoute: false,
      isNotFound: true,
      currentSlug: pathSegment,
      activeVersionId: null,
      currentPortfolio: defaultResumeData,
      activeVersionMeta: null
    };
  }

  return {
    isAdminRoute: false,
    isNotFound: false,
    currentSlug: '',
    activeVersionId: null,
    currentPortfolio: defaultResumeData,
    activeVersionMeta: null
  };
};

export const PortfolioProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [routeState, setRouteState] = useState({
    isAdminRoute: false,
    isNotFound: false,
    currentSlug: '',
    activeVersionId: null,
    currentPortfolio: defaultResumeData,
    activeVersionMeta: null
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  });
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch history from server on mount
  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/history`);
      const json = await res.json();
      if (json.success) {
        setHistory(json.history);
        const routeParsed = parseCurrentRoute(json.history);
        setRouteState(routeParsed);
      }
    } catch (e) {
      console.warn('Backend server not reachable, falling back to localStorage:', e);
      // Fallback: try localStorage
      try {
        const raw = localStorage.getItem('portfolio_history_v1');
        const localHistory = raw ? JSON.parse(raw) : [];
        setHistory(localHistory);
        setRouteState(parseCurrentRoute(localHistory));
      } catch (le) {
        setRouteState(parseCurrentRoute([]));
      }
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Keep Render backend alive — silent ping every 10 minutes
  useEffect(() => {
    const ping = () => {
      fetch(`${API_BASE.replace('/portfolio', '')}/ping`).catch(() => {});
    };
    ping(); // ping immediately on load
    const interval = setInterval(ping, 10 * 60 * 1000); // every 10 minutes
    return () => clearInterval(interval);
  }, []);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const updated = parseCurrentRoute(history);
      setRouteState(updated);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [history]);

  // Login handler
  const loginAdmin = (password) => {
    if (password === 'Kulkarni@2411') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem(AUTH_KEY, 'true');
      return { success: true };
    }
    return { success: false, error: 'Incorrect password. Access denied.' };
  };

  // Logout handler
  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem(AUTH_KEY);
  };

  // Save new Portfolio version to server (persists across all browsers/devices)
  const savePortfolioVersion = async (portfolioData, customName, customSlug, pdfFileName = '') => {
    let slug = (customSlug || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!slug) {
      slug = `resume${history.length + 1}`;
    }

    try {
      const res = await fetch(`${API_BASE}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolioData,
          name: customName || `Portfolio (${slug})`,
          slug,
          pdfFileName
        })
      });

      const json = await res.json();
      if (json.success) {
        const newVersion = json.version;
        const filtered = history.filter(item => item.slug?.toLowerCase() !== slug);
        const updatedHistory = [newVersion, ...filtered];
        setHistory(updatedHistory);

        // Also save to localStorage as backup
        try {
          localStorage.setItem('portfolio_history_v1', JSON.stringify(updatedHistory));
        } catch (e) { /* ignore */ }

        // Apply & Sync Route state immediately
        setRouteState({
          isAdminRoute: false,
          currentSlug: slug,
          activeVersionId: newVersion.id,
          currentPortfolio: portfolioData,
          activeVersionMeta: newVersion
        });

        return newVersion;
      }
    } catch (e) {
      console.warn('Server save failed, falling back to localStorage-only:', e);
    }

    // Fallback: localStorage-only
    const newId = 'port_' + Date.now();
    const newVersion = {
      id: newId,
      slug,
      name: customName || `Portfolio (${slug})`,
      createdAt: new Date().toISOString(),
      pdfFileName: pdfFileName || portfolioData?.personalInfo?.pdfFile || 'Resume.pdf',
      data: portfolioData
    };

    const filtered = history.filter(item => item.slug?.toLowerCase() !== slug);
    const updatedHistory = [newVersion, ...filtered];
    setHistory(updatedHistory);
    try {
      localStorage.setItem('portfolio_history_v1', JSON.stringify(updatedHistory));
    } catch (e) { /* ignore */ }

    setRouteState({
      isAdminRoute: false,
      currentSlug: slug,
      activeVersionId: newId,
      currentPortfolio: portfolioData,
      activeVersionMeta: newVersion
    });

    return newVersion;
  };

  // Navigate to slug or Admin
  const navigateTo = (pathOrSlug) => {
    let targetUrl = '';
    if (!pathOrSlug || pathOrSlug === '/') {
      targetUrl = '/Portfolio/';
    } else if (pathOrSlug.toLowerCase() === 'admin') {
      targetUrl = '/Portfolio/admin';
    } else {
      targetUrl = `/Portfolio/${pathOrSlug}`;
    }

    window.history.pushState({}, '', targetUrl);
    const updated = parseCurrentRoute(history);
    setRouteState(updated);
  };

  // Get full shareable URL for a slug/version
  const getPortfolioUrl = (slugOrVersion) => {
    const slug = typeof slugOrVersion === 'string' ? slugOrVersion : (slugOrVersion?.slug || slugOrVersion?.id);
    return `${window.location.origin}/Portfolio/${slug}`;
  };

  // Set default portfolio version for root path (no longer needed with server, kept for compatibility)
  const setDefaultVersion = (versionId) => {
    if (!versionId) {
      localStorage.removeItem('portfolio_default_version_id');
    } else {
      localStorage.setItem('portfolio_default_version_id', versionId);
    }
  };

  // Delete version from server + local state
  const deleteVersion = async (versionId) => {
    try {
      await fetch(`${API_BASE}/${versionId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Server delete failed:', e);
    }

    const updated = history.filter((item) => item.id !== versionId);
    setHistory(updated);
    try {
      localStorage.setItem('portfolio_history_v1', JSON.stringify(updated));
    } catch (e) { /* ignore */ }

    if (routeState.activeVersionId === versionId) {
      navigateTo('/');
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        currentPortfolio: routeState.currentPortfolio,
        history,
        activeVersionId: routeState.activeVersionId,
        activeVersionMeta: routeState.activeVersionMeta,
        isAdminRoute: routeState.isAdminRoute,
        isNotFound: routeState.isNotFound,
        currentSlug: routeState.currentSlug,
        isAdminLoggedIn,
        isLoadingData,
        defaultResumeData,
        loginAdmin,
        logoutAdmin,
        savePortfolioVersion,
        navigateTo,
        getPortfolioUrl,
        setDefaultVersion,
        deleteVersion,
        fetchHistory
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
