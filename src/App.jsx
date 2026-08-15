import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';

import CustomCursor from './components/CustomCursor';
import LiquidEther from './components/LiquidEther';
import AdminPage from './components/AdminPage';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';

function NotFound({ slug }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white font-sans px-6">
      <div className="text-center max-w-md">
        <div className="text-[#e50914] text-8xl font-black mb-4 font-mono tracking-tighter">404</div>
        <h1 className="text-2xl font-extrabold uppercase tracking-widest mb-3 text-white">
          Link Not Found
        </h1>
        <p className="text-white/50 text-sm mb-2 leading-relaxed">
          The portfolio link{' '}
          <code className="bg-white/10 text-[#e50914] px-2 py-0.5 rounded font-mono text-xs">
            /Portfolio/{slug}
          </code>{' '}
          does not exist or has been removed.
        </p>
        <p className="text-white/30 text-xs mb-8">
          Only links generated in the Admin Panel are valid.
        </p>
        <div className="flex gap-3 justify-center">
          <a
            href="/Portfolio/"
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition uppercase tracking-wider"
          >
            ← Main Portfolio
          </a>
          <a
            href="/Portfolio/admin"
            className="px-5 py-2.5 bg-[#e50914] hover:bg-[#b20710] text-white text-xs font-bold rounded-lg transition uppercase tracking-wider"
          >
            Admin Panel
          </a>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { isAdminRoute, isNotFound, currentSlug, isLoadingData } = usePortfolio();

  // Brief loading state while history is fetched from server
  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-t-transparent border-[#e50914] rounded-full animate-spin" />
      </div>
    );
  }

  if (isAdminRoute) {
    return <AdminPage />;
  }

  if (isNotFound) {
    return <NotFound slug={currentSlug} />;
  }

  return (
    <div className="bg-bg-dark text-text-main selection:bg-[#e50914]/30 font-sans antialiased overflow-x-hidden md:cursor-none cursor-auto">
      {/* Fixed full-screen LiquidEther background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        <LiquidEther
          mouseForce={20}
          cursorSize={100}
          isViscous={true}
          viscous={30}
          colors={["#5227FF", "#F43F5E", "#EF4444"]}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          isBounce={false}
          resolution={0.5}
        />
      </div>

      {/* Public Navigation */}
      <Navbar />

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <CustomCursor />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Certifications />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <PortfolioProvider>
      <AppContent />
    </PortfolioProvider>
  );
}

export default App;
